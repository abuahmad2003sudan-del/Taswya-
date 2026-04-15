import React, { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import { CreditCard, ShieldCheck, Lock, ArrowLeft, CheckCircle, Globe } from "lucide-react";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { Label } from "@/src/components/ui/label";
import { toast } from "sonner";

export default function PaymentGateway() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  
  const disputeId = searchParams.get("id");
  const gateway = searchParams.get("gateway") || "paytabs";
  const amount = searchParams.get("amount") || "500";
  const currency = searchParams.get("currency") || "EGP";

  const [cardData, setCardData] = useState({
    number: "",
    name: "",
    expiry: "",
    cvv: ""
  });

  const handlePayment = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate processing
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
      toast.success("تمت عملية الدفع بنجاح");
      
      setTimeout(() => {
        navigate(`/track?id=${disputeId}&payment=success`);
      }, 2000);
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-stone-50 dark:bg-stone-950 flex flex-col font-sans selection:bg-accent selection:text-white" dir="rtl">
      {/* Header */}
      <nav className="h-20 bg-white dark:bg-stone-900 border-b border-stone-200 dark:border-stone-800 flex items-center justify-between px-6 sm:px-12">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary dark:bg-accent rounded-xl flex items-center justify-center">
            <span className="text-white font-serif italic text-xl">ت</span>
          </div>
          <span className="font-serif font-bold text-xl text-primary dark:text-white">بوابة الدفع السيادية</span>
        </div>
        <div className="flex items-center gap-2 text-[10px] font-black text-stone-400 uppercase tracking-widest">
          <Lock className="w-3 h-3 text-emerald-500" />
          اتصال مشفر 256-بت
        </div>
      </nav>

      <main className="flex-1 flex items-center justify-center p-4 sm:p-10">
        <div className="max-w-md w-full">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-stone-900 rounded-[32px] shadow-2xl shadow-stone-200 dark:shadow-black/40 overflow-hidden border border-stone-100 dark:border-stone-800"
          >
            {/* Gateway Branding */}
            <div className="p-8 bg-stone-900 dark:bg-black text-white flex items-center justify-between">
              <div>
                <p className="text-[10px] font-black text-stone-400 uppercase tracking-[0.2em] mb-1">المزود المعتمد</p>
                <h2 className="text-2xl font-serif font-bold capitalize">{gateway}</h2>
              </div>
              <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center">
                {gateway === "paytabs" ? <CreditCard className="w-6 h-6 text-accent" /> : <Globe className="w-6 h-6 text-accent" />}
              </div>
            </div>

            {success ? (
              <div className="p-12 text-center space-y-6">
                <div className="w-20 h-20 bg-emerald-500 rounded-full flex items-center justify-center text-white mx-auto animate-bounce">
                  <CheckCircle className="w-10 h-10" />
                </div>
                <h3 className="text-2xl font-serif font-bold text-primary dark:text-white">تم قبول الدفع</h3>
                <p className="text-stone-500 dark:text-stone-400">جاري توثيق المعاملة في السجل الإمبراطوري...</p>
              </div>
            ) : (
              <form onSubmit={handlePayment} className="p-8 space-y-6">
                <div className="flex justify-between items-center mb-8 p-4 bg-stone-50 dark:bg-stone-800/50 rounded-2xl border border-stone-100 dark:border-stone-800">
                  <span className="text-stone-500 dark:text-stone-400 text-sm">المبلغ المستحق</span>
                  <span className="text-xl font-serif font-bold text-primary dark:text-white">{amount}.00 {currency}</span>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-stone-400">رقم البطاقة</Label>
                    <div className="relative">
                      <Input 
                        required
                        placeholder="0000 0000 0000 0000"
                        value={cardData.number}
                        onChange={(e) => setCardData({...cardData, number: e.target.value})}
                        className="h-14 rounded-xl bg-stone-50 dark:bg-stone-800 border-stone-200 dark:border-stone-700 px-12 font-mono dark:text-white"
                      />
                      <CreditCard className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-400" />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-[10px] font-black uppercase tracking-widest text-stone-400">تاريخ الانتهاء</Label>
                      <Input 
                        required
                        placeholder="MM/YY"
                        value={cardData.expiry}
                        onChange={(e) => setCardData({...cardData, expiry: e.target.value})}
                        className="h-14 rounded-xl bg-stone-50 dark:bg-stone-800 border-stone-200 dark:border-stone-700 text-center font-mono dark:text-white"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-[10px] font-black uppercase tracking-widest text-stone-400">CVV</Label>
                      <Input 
                        required
                        placeholder="***"
                        type="password"
                        maxLength={3}
                        value={cardData.cvv}
                        onChange={(e) => setCardData({...cardData, cvv: e.target.value})}
                        className="h-14 rounded-xl bg-stone-50 dark:bg-stone-800 border-stone-200 dark:border-stone-700 text-center font-mono dark:text-white"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-stone-400">اسم صاحب البطاقة</Label>
                    <Input 
                      required
                      placeholder="كما يظهر على البطاقة"
                      value={cardData.name}
                      onChange={(e) => setCardData({...cardData, name: e.target.value})}
                      className="h-14 rounded-xl bg-stone-50 dark:bg-stone-800 border-stone-200 dark:border-stone-700 dark:text-white"
                    />
                  </div>
                </div>

                <Button 
                  type="submit"
                  disabled={loading}
                  className="w-full h-16 bg-accent hover:bg-accent/90 text-white rounded-xl text-lg font-serif font-bold shadow-xl shadow-accent/20 transition-all mt-4"
                >
                  {loading ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      جاري المعالجة...
                    </div>
                  ) : `دفع ${amount} ${currency}`}
                </Button>

                <div className="flex items-center justify-center gap-4 pt-4">
                  <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Visa_Inc._logo.svg/2560px-Visa_Inc._logo.svg.png" alt="Visa" className="h-3 opacity-30 grayscale" />
                  <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Mastercard-logo.svg/1280px-Mastercard-logo.svg.png" alt="Mastercard" className="h-5 opacity-30 grayscale" />
                  <div className="w-px h-4 bg-stone-200" />
                  <div className="flex items-center gap-1 opacity-30 grayscale">
                    <ShieldCheck className="w-3 h-3" />
                    <span className="text-[8px] font-black uppercase tracking-widest">Verified by Visa</span>
                  </div>
                </div>
              </form>
            )}
          </motion.div>

          <button 
            onClick={() => navigate(-1)}
            className="mt-8 flex items-center gap-2 text-stone-400 hover:text-primary transition-colors mx-auto text-sm font-bold"
          >
            <ArrowLeft className="w-4 h-4" />
            إلغاء والعودة للمنصة
          </button>
        </div>
      </main>

      <footer className="p-8 text-center">
        <p className="text-[10px] font-black text-stone-400 uppercase tracking-[0.3em]">
          Powered by Taswiya Sovereign Payment Infrastructure
        </p>
      </footer>
    </div>
  );
}
