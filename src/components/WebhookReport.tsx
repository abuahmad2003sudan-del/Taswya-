import React, { useState } from "react";
import { Check, Copy, Terminal } from "lucide-react";
import { Button } from "@/src/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/src/components/ui/card";
import { toast } from "sonner";

export function WebhookReport() {
  const [copied, setCopied] = useState(false);

  const reportContent = `
🚀 تقرير تنفيذ Webhook متجر السودان (MTGR) - منصة تسوية

✅ الحالة: تم التنفيذ بنجاح (Production Ready)
🛠️ التقنيات المستخدمة: Node.js (Express), Firebase Admin SDK, HMAC-SHA256 Security.

📋 تفاصيل الإنجاز:
1. إنشاء نقطة نهاية آمنة: /api/payments/mtgr/webhook
2. التحقق من التوقيع الرقمي (Signature Verification) باستخدام HMAC-SHA256 لضمان أمان البيانات.
3. التحقق من الطابع الزمني (Timestamp Validation) لمنع هجمات إعادة الإرسال (Replay Attacks).
4. نظام منع التكرار (Idempotency): استخدام 'webhook_locks' في Firestore لضمان معالجة كل عملية دفع مرة واحدة فقط.
5. تحديث تلقائي لحالة النزاع: 
   - COMPLETED -> under_review (مدفوع)
   - FAILED -> payment_failed
   - CANCELLED -> cancelled
6. نظام سجلات متكامل (Webhook Logs): تسجيل كافة الأحداث (النجاح والفشل) في Firestore للمتابعة والتدقيق.

⚠️ ملاحظة هامة:
يجب إضافة مفتاح 'MTGR_WEBHOOK_SECRET' في إعدادات البيئة (Environment Variables) ليعمل نظام التحقق من التوقيع بشكل صحيح.
  `.trim();

  const handleCopy = () => {
    navigator.clipboard.writeText(reportContent);
    setCopied(true);
    toast.success("تم نسخ التقرير بنجاح");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Card className="imperial-card border-none shadow-2xl overflow-hidden">
      <CardHeader className="bg-primary text-white p-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-accent/20 flex items-center justify-center">
              <Terminal className="w-5 h-5 text-accent" />
            </div>
            <div>
              <CardTitle className="text-xl font-serif">تقرير تكامل Webhook</CardTitle>
              <CardDescription className="text-stone-400">جاهز للنشر والتشغيل الفعلي</CardDescription>
            </div>
          </div>
          <Button 
            onClick={handleCopy}
            variant="outline" 
            className="rounded-full border-accent/30 text-accent hover:bg-accent hover:text-white transition-all gap-2"
          >
            {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            {copied ? "تم النسخ" : "نسخ التقرير"}
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-8">
        <pre className="bg-stone-50 p-6 rounded-2xl text-xs sm:text-sm font-mono text-stone-600 whitespace-pre-wrap leading-relaxed border border-stone-100">
          {reportContent}
        </pre>
      </CardContent>
    </Card>
  );
}
