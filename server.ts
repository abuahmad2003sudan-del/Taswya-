import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";
import axios from "axios";
import crypto from "crypto";
import dotenv from "dotenv";
import admin from "firebase-admin";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initialize Firebase Admin
if (!admin.apps.length) {
  admin.initializeApp({
    projectId: "gen-lang-client-0035466538",
  });
}

const db = admin.firestore();
const firestore = db;

// Payment Configuration
const PAYMENT_MODE = process.env.PAYMENT_MODE || "sandbox"; // 'sandbox' or 'production'

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Global middleware for most routes
  app.use((req, res, next) => {
    if (req.path === "/api/payments/mtgr/webhook") {
      next();
    } else {
      express.json()(req, res, next);
    }
  });

  // --- MTGR Webhook Integration ---
  const MTGR_WEBHOOK_SECRET = process.env.MTGR_WEBHOOK_SECRET;
  const DISPUTES_COLLECTION = 'disputes';
  const WEBHOOK_LOGS_COLLECTION = 'webhook_logs';
  const WEBHOOK_FAILURES_COLLECTION = 'webhook_failures';

  function isValidMTGRSignature(rawBodyBuffer: Buffer, signature: string) {
    // In sandbox mode, we might want to skip signature check or use a test secret
    if (PAYMENT_MODE === "sandbox" && signature === "sandbox_test_signature") return true;
    
    if (!MTGR_WEBHOOK_SECRET) {
      console.error('❌ MTGR_WEBHOOK_SECRET is not set');
      return false;
    }
    const expected = crypto
      .createHmac('sha256', MTGR_WEBHOOK_SECRET)
      .update(rawBodyBuffer)
      .digest('hex');
    
    try {
      return crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expected));
    } catch (err) {
      return false;
    }
  }

  function isValidMTGRTimestamp(timestamp: string) {
    if (PAYMENT_MODE === "sandbox") return true; // Skip timestamp check in sandbox
    const now = Date.now();
    const requestTime = parseInt(timestamp, 10);
    if (isNaN(requestTime)) return false;
    return (now - requestTime) <= 10 * 60 * 1000;
  }

  async function logMTGRWebhookEvent(data: any) {
    const logRef = firestore.collection(WEBHOOK_LOGS_COLLECTION).doc();
    const safeData = {
      eventId: data.eventId || 'unknown',
      status: data.status,
      disputeId: data.disputeId || null,
      mtgrReference: data.mtgrReference || null,
      message: data.message || null,
      error: data.error ? data.error.substring(0, 500) : null,
      receivedAt: admin.firestore.FieldValue.serverTimestamp(),
      mode: PAYMENT_MODE
    };
    await logRef.set(safeData);
  }

  async function logMTGRWebhookFailure(data: any) {
    const failRef = firestore.collection(WEBHOOK_FAILURES_COLLECTION).doc();
    await failRef.set({
      ...data,
      failedAt: admin.firestore.FieldValue.serverTimestamp(),
      retryCount: 0,
      status: 'failed',
      mode: PAYMENT_MODE
    });
  }

  async function updateDisputeStatus(disputeId: string, newStatus: string, mtgrReference: string) {
    const disputeRef = firestore.collection(DISPUTES_COLLECTION).doc(String(disputeId));
    const disputeDoc = await disputeRef.get();

    if (!disputeDoc.exists) {
      // Try searching by the custom 'id' field if doc ID doesn't match
      const querySnapshot = await firestore.collection(DISPUTES_COLLECTION).where("id", "==", disputeId).get();
      if (querySnapshot.empty) {
        throw new Error(`Dispute ${disputeId} not found`);
      }
      const doc = querySnapshot.docs[0];
      await doc.ref.update({
        status: newStatus,
        paymentStatus: newStatus === 'under_review' ? 'paid' : (newStatus === 'payment_failed' ? 'failed' : 'cancelled'),
        mtgrTransactionId: mtgrReference || null,
        lastUpdated: admin.firestore.FieldValue.serverTimestamp(),
      });
      return;
    }

    const current = disputeDoc.data()!;
    const currentStatus = current.status;

    if (currentStatus === 'resolved' || currentStatus === 'closed') {
      throw new Error(`Dispute ${disputeId} already finalized (${currentStatus})`);
    }

    await disputeRef.update({
      status: newStatus,
      paymentStatus: newStatus === 'under_review' ? 'paid' : (newStatus === 'payment_failed' ? 'failed' : 'cancelled'),
      mtgrTransactionId: mtgrReference || null,
      lastUpdated: admin.firestore.FieldValue.serverTimestamp(),
    });
  }

  app.post("/api/payments/mtgr/webhook", express.raw({ type: 'application/json' }), async (req, res) => {
    let disputeId = null;
    let mtgrReference = null;
    let rawBody: Buffer | null = null;

    try {
      const signature = req.headers['x-mtgr-signature'] as string;
      const timestamp = req.headers['x-mtgr-timestamp'] as string;

      if (!signature || !timestamp) {
        const err = 'Missing signature/timestamp headers';
        await logMTGRWebhookFailure({ error: err, headers: req.headers });
        return res.status(400).send(err);
      }

      rawBody = req.body;
      if (!rawBody || rawBody.length === 0) {
        const err = 'Empty body';
        await logMTGRWebhookFailure({ error: err });
        return res.status(400).send(err);
      }

      if (!isValidMTGRSignature(rawBody, signature)) {
        const err = 'Signature mismatch';
        await logMTGRWebhookFailure({ error: err, signature });
        return res.status(401).send(err);
      }

      if (!isValidMTGRTimestamp(timestamp)) {
        const err = 'Timestamp expired';
        await logMTGRWebhookFailure({ error: err, timestamp });
        return res.status(400).send(err);
      }

      let payload;
      try {
        payload = JSON.parse(rawBody.toString());
      } catch (err: any) {
        await logMTGRWebhookFailure({ error: 'Invalid JSON', body: rawBody.toString() });
        return res.status(400).send('Invalid JSON');
      }

      disputeId = payload.order_id || payload.client_reference || payload.dispute_id;
      mtgrReference = payload.transaction_id || payload.payment_id;
      const status = payload.status;

      if (!disputeId) {
        await logMTGRWebhookFailure({ error: 'Missing dispute ID', payload });
        return res.status(400).send('Missing dispute id');
      }

      if (mtgrReference) {
        const lockRef = firestore.collection('webhook_locks').doc(mtgrReference);
        const lockDoc = await lockRef.get();
        if (lockDoc.exists) {
          return res.status(200).send('OK (duplicate)');
        }
        await lockRef.set({ processedAt: admin.firestore.FieldValue.serverTimestamp() });
      }

      let newStatus = null;
      switch (status) {
        case 'COMPLETED': newStatus = 'under_review'; break;
        case 'FAILED': newStatus = 'payment_failed'; break;
        case 'CANCELLED': newStatus = 'cancelled'; break;
        default:
          await logMTGRWebhookFailure({ error: `Unknown status ${status}`, payload });
          return res.status(400).send(`Unknown status: ${status}`);
      }

      await updateDisputeStatus(disputeId, newStatus, mtgrReference);
      await logMTGRWebhookEvent({ eventId: 'success', status: 'processed', disputeId, mtgrReference });
      
      return res.status(200).send('OK');

    } catch (error: any) {
      console.error('❌ Webhook error:', error);
      await logMTGRWebhookFailure({
        error: error.message,
        disputeId,
        payload: rawBody ? rawBody.toString() : null
      });
      if (!res.headersSent) {
        return res.status(500).send('Internal Server Error');
      }
    }
  });

  // Manual Webhook Retry Endpoint
  app.post("/api/admin/payments/retry-webhook", async (req, res) => {
    const { failureId } = req.body;
    try {
      const failRef = firestore.collection(WEBHOOK_FAILURES_COLLECTION).doc(failureId);
      const failDoc = await failRef.get();
      if (!failDoc.exists) return res.status(404).send("Failure log not found");

      const data = failDoc.data()!;
      // Logic to retry processing based on saved payload
      if (data.payload) {
        const payload = JSON.parse(data.payload);
        const disputeId = payload.order_id || payload.client_reference || payload.dispute_id;
        const mtgrReference = payload.transaction_id || payload.payment_id;
        const status = payload.status;

        let newStatus = null;
        if (status === 'COMPLETED') newStatus = 'under_review';
        else if (status === 'FAILED') newStatus = 'payment_failed';
        else if (status === 'CANCELLED') newStatus = 'cancelled';

        if (newStatus && disputeId) {
          await updateDisputeStatus(disputeId, newStatus, mtgrReference);
          await failRef.update({ status: 'retried_successfully', retriedAt: admin.firestore.FieldValue.serverTimestamp() });
          return res.json({ success: true });
        }
      }
      res.status(400).send("Cannot retry: missing payload or invalid status");
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // --- PayTabs Integration ---
  const PAYTABS_PROFILE_ID = process.env.PAYTABS_PROFILE_ID;
  const PAYTABS_SERVER_KEY = process.env.PAYTABS_SERVER_KEY;
  const PAYTABS_REGION = process.env.PAYTABS_REGION || "ARE"; // e.g., ARE, SAU, EGY

  const getPayTabsEndpoint = (region: string) => {
    switch (region.toUpperCase()) {
      case "EGY": return "https://secure-egypt.paytabs.com/payment/request";
      case "SAU": return "https://secure-saudi.paytabs.com/payment/request";
      case "ARE": return "https://secure.paytabs.com/payment/request";
      default: return "https://secure.paytabs.com/payment/request";
    }
  };

  app.post("/api/payments/paytabs/initiate", async (req, res) => {
    try {
      const { amount, currency, customer_details, dispute_id, cart_description } = req.body;

      if (!PAYTABS_PROFILE_ID || !PAYTABS_SERVER_KEY) {
        console.warn("⚠️ PayTabs keys missing. Returning simulated gateway for demo.");
        return res.json({ 
          redirect_url: `${req.protocol}://${req.get("host")}/payment-gateway?id=${dispute_id}&gateway=paytabs&amount=${amount}&currency=${currency}`,
          is_mock: true 
        });
      }

      const payload = {
        profile_id: parseInt(PAYTABS_PROFILE_ID!),
        tran_type: "sale",
        tran_class: "ecom",
        cart_id: dispute_id,
        cart_currency: currency,
        cart_amount: amount,
        cart_description: cart_description,
        paypage_lang: "ar",
        customer_details: customer_details,
        callback: `${req.protocol}://${req.get("host")}/api/payments/paytabs/callback`,
        return: `${req.protocol}://${req.get("host")}/track?id=${dispute_id}`,
      };

      const response = await axios.post(
        getPayTabsEndpoint(PAYTABS_REGION),
        payload,
        {
          headers: {
            Authorization: PAYTABS_SERVER_KEY,
            "Content-Type": "application/json",
          },
        }
      );

      res.json(response.data);
    } catch (error: any) {
      console.error("PayTabs Initiation Error:", error.response?.data || error.message);
      res.status(500).json({ error: "Failed to initiate payment" });
    }
  });

  app.post("/api/payments/paytabs/callback", async (req, res) => {
    // PayTabs Webhook / Callback
    const signature = req.headers["signature"];
    // In production, verify signature here using PAYTABS_SERVER_KEY
    
    const { cart_id, payment_result } = req.body;
    
    if (payment_result?.response_status === "A") {
      console.log(`Payment Approved for Dispute: ${cart_id}`);
      // Here you would typically update Firestore directly from the server
      // using firebase-admin if available, or wait for the user to return to the app.
      // For this app, we'll rely on the return URL to trigger a status check or 
      // use a server-side update if we had firebase-admin setup.
    }
    
    res.status(200).send("OK");
  });

  // --- Payoneer Integration (Simulated for Demo) ---
  app.post("/api/payments/payoneer/request", async (req, res) => {
    const { amount, currency, dispute_id } = req.body;
    res.json({ 
      redirect_url: `${req.protocol}://${req.get("host")}/payment-gateway?id=${dispute_id}&gateway=payoneer&amount=${amount}&currency=${currency}` 
    });
  });

  // --- Stripe Integration (Simulated for Demo) ---
  app.post("/api/payments/stripe/initiate", async (req, res) => {
    const { amount, currency, dispute_id } = req.body;
    res.json({ 
      redirect_url: `${req.protocol}://${req.get("host")}/payment-gateway?id=${dispute_id}&gateway=stripe&amount=${amount}&currency=${currency}` 
    });
  });

  // --- Vite Middleware ---
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(__dirname, "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
