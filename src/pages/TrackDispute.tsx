import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { Label } from "@/src/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/src/components/ui/card";
import { Search, FileText, Clock, CheckCircle2, AlertCircle, ShieldCheck, ArrowLeft, Download, ExternalLink, Star } from "lucide-react";
import { cn } from "@/src/lib/utils";
import { db, handleFirestoreError, OperationType } from "@/src/lib/firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { useSearchParams, Link } from "react-router-dom";
import { format } from "date-fns";
import { ar } from "date-fns/locale";
import { HorizontalAd } from "@/src/components/GoogleAd";
import { toast } from "sonner";

export default function TrackDispute() {
  const [searchParams] = useSearchParams();
  const [searchId, setSearchId] = useState(searchParams.get("id") || "");
  const [email, setEmail] = useState(searchParams.get("email") || "");
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (searchParams.get("id") && searchParams.get("email")) {
      handleSearch();
    }
  }, []);

  const handleSearch = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const docRef = doc(db, "disputes", searchId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data();
        // Verify email for security
        if (data.applicant.email.toLowerCase() === email.toLowerCase()) {
          setResult({ id: docSnap.id, ...data });
        } else {
          setError("البريد الإلكتروني غير مطابق لهذا النزاع.");
        }
      } else {
        setError("لم يتم العثور على نزاع بهذا الرقم.");
      }
    } catch (err) {
      handleFirestoreError(err, OperationType.GET, `disputes/${searchId}`);
    } finally {
      setLoading(false);
    }
  };

  const getStatusUpdates = (status: string, createdAt: any, gateway?: string, paymentStatus?: string) => {
    const date = createdAt?.toDate ? format(createdAt.toDate(), "yyyy-MM-dd", { locale: ar }) : "قيد المعالجة";
    const updates = [
      { date, text: "تم استلام الطلب وبانتظار الدفع", status: "completed" },
    ];

    if (gateway === "bankak" && paymentStatus === "pending") {
      updates.push({ date: "الآن", text: "بانتظار مراجعة إشعار تحويل بنكك", status: "current" });
    } else if (paymentStatus === "paid") {
      updates.push({ date, text: "تم تأكيد الدفع بنجاح", status: "completed" });
    } else {
      updates.push({ date: "-", text: "بانتظار تأكيد الدفع", status: "pending" });
    }

    if (status === "under_review") {
      updates.push({ date: "اليوم", text: "الطلب قيد المراجعة من قبل الوسيط", status: "current" });
    } else if (status === "resolved" || status === "closed") {
      updates.push({ date: "مكتمل", text: "تمت مراجعة الطلب وإصدار القرار", status: "completed" });
    } else {
      updates.push({ date: "-", text: "بانتظار المراجعة", status: "pending" });
    }

    return updates;
  };

  return (
    <div className="min-h-screen bg-stone-50/50 py-20 px-4 font-sans selection:bg-stone-200 selection:text-stone-900" dir="rtl">
      <div className="max-w-3xl mx-auto">
        <header className="text-center mb-16 space-y-6">
          <Link to="/" className="inline-flex items-center gap-2 text-stone-400 hover:text-primary transition-colors text-sm font-bold uppercase tracking-widest mb-4">
            <ArrowLeft className="w-4 h-4" />
            العودة للرئيسية
          </Link>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            <h1 className="text-3xl sm:text-5xl font-serif font-bold text-primary tracking-tight">متابعة حالة النزاع</h1>
            <p className="text-stone-500 text-lg max-w-lg mx-auto leading-relaxed">أدخل رقم النزاع والبريد الإلكتروني لمتابعة آخر التطورات والقرارات الصادرة.</p>
          </motion.div>
        </header>

        <Card className="border-stone-200/60 shadow-2xl shadow-stone-200/50 rounded-[40px] mb-12 overflow-hidden bg-white">
          <CardContent className="p-12">
            <form onSubmit={handleSearch} className="space-y-8">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                <div className="space-y-3">
                  <Label className="text-sm font-bold text-primary uppercase tracking-widest">رقم النزاع</Label>
                  <Input 
                    placeholder="مثلاً: TAS-12345" 
                    value={searchId}
                    onChange={(e) => setSearchId(e.target.value)}
                    className="h-14 rounded-2xl border-stone-200 focus:ring-primary focus:border-primary bg-stone-50/30 focus:bg-white transition-all px-6 text-lg"
                    required
                  />
                </div>
                <div className="space-y-3">
                  <Label className="text-sm font-bold text-primary uppercase tracking-widest">البريد الإلكتروني</Label>
                  <Input 
                    type="email" 
                    placeholder="example@mail.com" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="h-14 rounded-2xl border-stone-200 focus:ring-primary focus:border-primary bg-stone-50/30 focus:bg-white transition-all px-6 text-lg"
                    required
                  />
                </div>
              </div>
              <Button type="submit" className="w-full h-16 rounded-full bg-primary hover:bg-stone-800 text-lg shadow-xl shadow-stone-300 transition-all hover:-translate-y-1" disabled={loading}>
                {loading ? "جاري البحث في السجلات..." : "بحث عن الطلب"}
                <Search className="mr-3 w-5 h-5" />
              </Button>
            </form>
            {error && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="mt-8 p-6 bg-red-50 text-red-700 rounded-3xl flex items-center gap-4 border border-red-100"
              >
                <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm">
                  <AlertCircle className="w-6 h-6 text-red-500" />
                </div>
                <p className="font-bold">{error}</p>
              </motion.div>
            )}
          </CardContent>
        </Card>

        <HorizontalAd className="mb-12 opacity-80 hover:opacity-100 transition-opacity" />

        {result && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
          >
            <Card className="border-stone-200/60 shadow-2xl shadow-stone-200/50 rounded-[48px] overflow-hidden bg-white">
              <CardHeader className="bg-stone-50/50 border-b border-stone-100 p-12">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                  <div className="space-y-2">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white shadow-lg shadow-stone-200">
                        <ShieldCheck className="w-4 h-4" />
                      </div>
                      <CardTitle className="text-3xl font-serif font-bold text-primary tracking-tight">نزاع رقم: <span className="text-stone-400 italic">#{result.id.slice(-6).toUpperCase()}</span></CardTitle>
                    </div>
                    <CardDescription className="text-stone-500 font-medium text-lg">{result.details.type} — {result.applicant.name}</CardDescription>
                  </div>
                  <StatusBadge status={result.status} />
                </div>
              </CardHeader>
              <CardContent className="p-12">
                <h4 className="font-serif font-bold text-2xl text-primary mb-10 flex items-center gap-3">
                  <Clock className="w-6 h-6 text-stone-400" />
                  الجدول الزمني للطلب
                </h4>
                <div className="space-y-12 relative before:absolute before:right-6 before:top-2 before:bottom-2 before:w-0.5 before:bg-stone-100">
                  {getStatusUpdates(result.status, result.createdAt, result.gateway, result.paymentStatus).map((update: any, idx: number) => (
                    <div key={idx} className="relative pr-16 group">
                      <div className={cn(
                        "absolute right-0 top-1 w-12 h-12 rounded-2xl flex items-center justify-center z-10 transition-all duration-500",
                        update.status === "completed" ? "bg-primary text-white shadow-lg shadow-stone-200" : "bg-white border-2 border-stone-100 text-stone-300"
                      )}>
                        {update.status === "completed" ? <CheckCircle2 className="w-6 h-6" /> : <div className="w-2 h-2 rounded-full bg-current" />}
                      </div>
                      <div className="space-y-1">
                        <p className="text-[10px] font-bold text-stone-400 uppercase tracking-widest">{update.date}</p>
                        <p className={cn("text-lg font-serif transition-colors", update.status === "current" ? "text-primary font-bold" : "text-stone-600")}>
                          {update.text}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
              {result.status === "resolved" && result.decision && (
                <CardFooter className="p-12 bg-stone-50/50 border-t border-stone-100 block space-y-8">
                  <div className="p-10 bg-white rounded-[32px] border border-stone-200/60 shadow-xl shadow-stone-200/20 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-2 h-full bg-primary" />
                    <h5 className="font-serif font-bold text-2xl text-primary mb-4 flex items-center gap-3">
                      <FileText className="w-6 h-6 text-stone-400" />
                      قرار الوسيط النهائي:
                    </h5>
                    <p className="text-stone-600 text-lg leading-relaxed italic font-serif">"{result.decision.text}"</p>
                  </div>
                  
                  <div className="flex flex-col sm:flex-row items-center justify-between p-8 bg-white rounded-[32px] border border-stone-200/60 shadow-lg shadow-stone-200/10 gap-6">
                    <div className="flex items-center gap-5">
                      <div className="w-16 h-16 bg-stone-50 rounded-2xl flex items-center justify-center shadow-inner">
                        <FileText className="w-8 h-8 text-stone-400" />
                      </div>
                      <div>
                        <p className="font-serif font-bold text-xl text-primary">صك قرار الوساطة الرسمي</p>
                        <p className="text-xs text-stone-400 font-bold uppercase tracking-widest">ملف PDF موثق رقمياً</p>
                      </div>
                    </div>
                    <div className="flex gap-3 w-full sm:w-auto">
                      <Button variant="outline" className="flex-1 sm:flex-none rounded-full border-stone-200 px-8 h-12 hover:bg-stone-50">
                        <ExternalLink className="ml-2 w-4 h-4" />
                        معاينة
                      </Button>
                      <Button className="flex-1 sm:flex-none rounded-full bg-primary px-8 h-12 shadow-lg shadow-stone-200">
                        <Download className="ml-2 w-4 h-4" />
                        تحميل
                      </Button>
                    </div>
                  </div>

                  {result.status === "resolved" && !result.rating && (
                    <div className="mt-12">
                      <MediatorRating disputeId={result.id} mediatorId={result.mediatorId} />
                    </div>
                  )}
                </CardFooter>
              )}
            </Card>
            
            <div className="text-center py-12 opacity-50">
              <HorizontalAd className="max-w-xl mx-auto" />
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const configs: any = {
    pending_payment: { label: "بانتظار الدفع", color: "bg-amber-50 text-amber-700 border-amber-100" },
    under_review: { label: "تحت المراجعة", color: "bg-blue-50 text-blue-700 border-blue-100" },
    resolved: { label: "تم الحل", color: "bg-emerald-50 text-emerald-700 border-emerald-100" },
    closed: { label: "مغلق", color: "bg-stone-50 text-stone-700 border-stone-100" },
  };

  const config = configs[status] || configs.closed;

  return (
    <span className={cn("px-6 py-2 rounded-full text-sm font-bold border shadow-sm", config.color)}>
      {config.label}
    </span>
  );
}

function MediatorRating({ disputeId, mediatorId }: { disputeId: string, mediatorId: string }) {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [feedback, setFeedback] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  const handleSubmit = async () => {
    if (rating === 0) {
      toast.error("يرجى اختيار عدد النجوم أولاً.");
      return;
    }
    setSubmitting(true);
    try {
      const disputeRef = doc(db, "disputes", disputeId);
      await updateDoc(disputeRef, {
        rating,
        feedback,
        ratedAt: new Date()
      });
      setDone(true);
      toast.success("شكراً لتقييمك! يساعدنا هذا في تحسين جودة النخبة.");
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `disputes/${disputeId}`);
    } finally {
      setSubmitting(false);
    }
  };

  if (done) return null;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-10 bg-accent/5 border border-accent/20 rounded-[40px] text-center space-y-8"
    >
      <div className="space-y-2">
        <h4 className="text-2xl font-serif font-bold text-primary">تقييم تجربة الوساطة</h4>
        <p className="text-stone-500 text-sm">رأيك يساهم في الحفاظ على معايير السيادة في منصتنا.</p>
      </div>

      <div className="flex items-center justify-center gap-4">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            onMouseEnter={() => setHover(star)}
            onMouseLeave={() => setHover(0)}
            onClick={() => setRating(star)}
            className="transition-all duration-300 transform hover:scale-125"
          >
            <Star 
              className={cn(
                "w-12 h-12 transition-colors",
                (hover || rating) >= star ? "text-accent fill-accent" : "text-stone-200"
              )} 
            />
          </button>
        ))}
      </div>

      <textarea 
        value={feedback}
        onChange={(e) => setFeedback(e.target.value)}
        placeholder="أضف تعليقاً حول أداء الوسيط (اختياري)..."
        className="w-full min-h-[120px] p-6 bg-white border border-stone-200 rounded-3xl text-sm focus:ring-2 focus:ring-accent/20 outline-none transition-all font-medium resize-none"
      />

      <Button 
        onClick={handleSubmit}
        disabled={submitting}
        className="imperial-button imperial-button-accent h-16 px-12 text-lg w-full sm:w-auto"
      >
        {submitting ? "جاري الإرسال..." : "إرسال التقييم السيادي"}
      </Button>
    </motion.div>
  );
}
