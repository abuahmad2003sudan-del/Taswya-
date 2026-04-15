import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { Textarea } from "@/src/components/ui/textarea";
import { Label } from "@/src/components/ui/label";
import { 
  Scale, ShieldCheck, Clock, ArrowLeft, ArrowRight, 
  CheckCircle, User, MapPin, FileText, CreditCard,
  Crown, Sparkles, Fingerprint, Lock, Globe, AlertCircle
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { db, auth, handleFirestoreError, OperationType } from "@/src/lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { cn } from "@/src/lib/utils";
import axios from "axios";
import { toast } from "sonner";

const countries = [
  { name: "مصر", code: "EGY", currency: "EGP", fee: 500, gateways: ["paytabs", "stripe", "payoneer"] },
  { name: "السعودية", code: "SAU", currency: "SAR", fee: 100, gateways: ["paytabs", "stripe", "payoneer"] },
  { name: "الإمارات", code: "ARE", currency: "AED", fee: 100, gateways: ["paytabs", "stripe", "payoneer"] },
  { name: "الأردن", code: "JOR", currency: "JOD", fee: 20, gateways: ["paytabs", "stripe", "payoneer"] },
  { name: "السودان", code: "SDN", currency: "SDG", fee: 5000, gateways: ["bankak", "mtgr", "stripe", "payoneer"] },
  { name: "الكويت", code: "KWT", currency: "KWD", fee: 10, gateways: ["paytabs", "stripe", "payoneer"] },
  { name: "قطر", code: "QAT", currency: "QAR", fee: 100, gateways: ["paytabs", "stripe", "payoneer"] },
];

const steps = [
  { id: 1, title: "الهوية السيادية", icon: <Fingerprint className="w-6 h-6" /> },
  { id: 2, title: "تفاصيل النزاع", icon: <Scale className="w-6 h-6" /> },
  { id: 3, title: "الأطراف المعنية", icon: <Globe className="w-6 h-6" /> },
  { id: 4, title: "التوثيق النهائي", icon: <ShieldCheck className="w-6 h-6" /> },
  { id: 5, title: "بوابة الدفع", icon: <CreditCard className="w-6 h-6" /> }
];

export default function RegisterDispute() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    applicant: { name: "", phone: "", email: "", role: "tenant" },
    details: { type: "price_increase", rentAmount: "", description: "", address: "" },
    secondParty: { name: "", phone: "" },
    country: "EGY",
    gateway: "paytabs",
    agreedToTerms: false,
    paymentReceipt: null as string | null,
  });

  const selectedCountry = countries.find(c => c.code === formData.country) || countries[0];

  const handleSubmit = async () => {
    if (!formData.agreedToTerms) {
      toast.error("يرجى الموافقة على الشروط والأحكام للمتابعة");
      return;
    }

    if (!auth.currentUser) {
      toast.error("يجب تسجيل الدخول أولاً");
      return;
    }

    setLoading(true);
    try {
      const disputeId = `TAS-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;
      
      // 1. Create the dispute in Firestore
      await addDoc(collection(db, "disputes"), {
        ...formData,
        id: disputeId,
        status: "pending_payment",
        paymentStatus: "pending",
        paymentAmount: selectedCountry.fee,
        paymentCurrency: selectedCountry.currency,
        applicantUid: auth.currentUser.uid,
        createdAt: serverTimestamp(),
      });

      // 2. Initiate Payment based on gateway
      if (formData.gateway === "paytabs" || formData.gateway === "stripe") {
        try {
          const endpoint = formData.gateway === "paytabs" ? "/api/payments/paytabs/initiate" : "/api/payments/stripe/initiate";
          const response = await axios.post(endpoint, {
            amount: selectedCountry.fee,
            currency: selectedCountry.currency,
            dispute_id: disputeId,
            cart_description: `رسوم وساطة لنزاع عقاري - ${disputeId}`,
            customer_details: {
              name: formData.applicant.name,
              email: formData.applicant.email,
              phone: formData.applicant.phone,
              street1: formData.details.address,
              city: "Cairo",
              state: "Cairo",
              country: formData.country,
              zip: "12345"
            }
          });
          if (response.data.redirect_url) {
            window.location.href = response.data.redirect_url;
          } else {
            toast.error("فشل في بدء عملية الدفع. يرجى المحاولة مرة أخرى.");
          }
        } catch (e) {
          console.error(`${formData.gateway} Error:`, e);
          toast.error("حدث خطأ أثناء الاتصال ببوابة الدفع.");
        }
      } else if (formData.gateway === "mtgr") {
        toast.success("جاري تحويلك لبوابة متجر السودان...");
        // In a real app, this would also call an API to get a redirect URL
        setTimeout(() => {
          navigate(`/payment-gateway?id=${disputeId}&gateway=mtgr&amount=${selectedCountry.fee}&currency=${selectedCountry.currency}`);
        }, 2000);
      } else if (formData.gateway === "bankak") {
        toast.success("تم تسجيل طلبك بنجاح. يرجى انتظار مراجعة إشعار الدفع.");
        setTimeout(() => {
          navigate("/track?id=" + disputeId);
        }, 2000);
      } else if (formData.gateway === "payoneer") {
        const response = await axios.post("/api/payments/payoneer/request", {
          amount: selectedCountry.fee,
          currency: selectedCountry.currency,
          dispute_id: disputeId
        });
        if (response.data.redirect_url) {
          window.location.href = response.data.redirect_url;
        } else {
          toast.error("فشل في بدء عملية الدفع عبر Payoneer.");
        }
      }
    } catch (error: any) {
      console.error("Payment Initiation Error:", error);
      toast.error("فشل في بدء عملية الدفع. يرجى المحاولة مرة أخرى.");
    } finally {
      setLoading(false);
    }
  };

  const nextStep = () => setStep(s => Math.min(s + 1, 6));
  const prevStep = () => setStep(s => Math.max(s - 1, 1));

  return (
    <div className="min-h-screen bg-secondary flex flex-col font-sans selection:bg-accent selection:text-white overflow-hidden" dir="rtl">
      {/* Background Elements */}
      <div className="fixed inset-0 pointer-events-none -z-10">
        <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-accent/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-primary/5 rounded-full blur-[100px]" />
      </div>

      {/* Navigation */}
      <nav className="h-20 sm:h-24 bg-white/40 backdrop-blur-3xl border-b border-stone-200/30 flex items-center justify-between px-4 sm:px-12 z-20">
        <Link to="/" className="flex items-center gap-2 sm:gap-4 group">
          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-primary rounded-xl sm:rounded-2xl flex items-center justify-center shadow-2xl shadow-stone-400 transition-all duration-500 group-hover:rotate-[15deg]">
            <span className="text-white font-black text-xl sm:text-2xl font-serif italic">ت</span>
          </div>
          <div className="flex flex-col">
            <span className="font-serif font-bold text-xl sm:text-2xl tracking-tighter text-primary leading-none">تسوية</span>
            <span className="text-[7px] sm:text-[9px] font-black text-accent uppercase tracking-[0.2em] sm:tracking-[0.3em] mt-1">Concierge Service</span>
          </div>
        </Link>
        
        <div className="flex items-center gap-4 sm:gap-10">
          <div className="hidden sm:flex items-center gap-4 text-[10px] font-black text-stone-400 uppercase tracking-widest">
            <Lock className="w-3 h-3 text-accent" />
            تشفير سيادي نشط
          </div>
          <Link to="/">
            <Button variant="ghost" className="rounded-full px-4 sm:px-8 h-10 sm:h-12 text-[9px] sm:text-[11px] font-black uppercase tracking-widest text-stone-500 hover:text-primary">
              إلغاء
            </Button>
          </Link>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-10">
        <div className="max-w-5xl w-full">
          <AnimatePresence mode="wait">
            {step < 6 ? (
              <motion.div 
                key="form"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="grid lg:grid-cols-12 gap-6 sm:gap-10"
              >
                {/* Progress Sidebar */}
                <div className="lg:col-span-4 space-y-6 sm:space-y-10">
                  <div className="imperial-card p-6 sm:p-10 bg-primary text-white relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-full h-full opacity-10 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
                    <div className="relative z-10">
                      <Crown className="w-8 h-8 sm:w-10 sm:h-10 text-accent mb-4 sm:mb-8 animate-float" />
                      <h2 className="text-2xl sm:text-4xl font-serif font-bold mb-2 sm:mb-4 leading-tight">رحلة <br /> <span className="text-accent italic text-3xl sm:text-5xl">السيادة</span></h2>
                      <p className="text-xs sm:text-sm text-stone-400 font-light leading-relaxed">أنت الآن في عهدة "تسوية". اتبع الخطوات لتسجيل نزاعك في السجل الإمبراطوري.</p>
                    </div>
                  </div>

                  <div className="hidden lg:block space-y-4">
                    {steps.map((s) => (
                      <div 
                        key={s.id}
                        className={cn(
                          "flex items-center gap-6 p-6 rounded-3xl border transition-all duration-500",
                          step === s.id 
                            ? "bg-white border-accent shadow-2xl shadow-accent/10 translate-x-4" 
                            : step > s.id 
                              ? "bg-emerald-50 border-emerald-100 opacity-60" 
                              : "bg-white/40 border-stone-200/30 opacity-40"
                        )}
                      >
                        <div className={cn(
                          "w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-500",
                          step === s.id ? "bg-accent text-white" : step > s.id ? "bg-emerald-500 text-white" : "bg-stone-100 text-stone-400"
                        )}>
                          {step > s.id ? <CheckCircle className="w-6 h-6" /> : s.icon}
                        </div>
                        <div>
                          <p className="text-[9px] font-black text-stone-400 uppercase tracking-widest mb-1">الخطوة 0{s.id}</p>
                          <p className={cn("text-sm font-bold", step === s.id ? "text-primary" : "text-stone-500")}>{s.title}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Form Area */}
                <div className="lg:col-span-8">
                  <div className="imperial-card p-6 sm:p-16 min-h-[500px] sm:min-h-[700px] flex flex-col">
                    <div className="flex-1">
                      {step === 1 && <Step1 data={formData} update={setFormData} countries={countries} />}
                      {step === 2 && <Step2 data={formData} update={setFormData} />}
                      {step === 3 && <Step3 data={formData} update={setFormData} />}
                      {step === 4 && <Step4 data={formData} />}
                      {step === 5 && <Step5 onComplete={handleSubmit} loading={loading} data={formData} update={setFormData} country={selectedCountry} />}
                    </div>

                    <div className="mt-8 sm:mt-16 pt-6 sm:pt-10 border-t border-stone-100 flex items-center justify-between">
                      <Button 
                        onClick={prevStep}
                        disabled={step === 1 || step === 5}
                        variant="ghost" 
                        className="rounded-full px-6 sm:px-10 h-12 sm:h-16 text-stone-400 hover:text-primary disabled:opacity-0 transition-all text-xs sm:text-base"
                      >
                        <ArrowRight className="ml-2 sm:ml-3 w-4 h-4 sm:w-5 sm:h-5" />
                        السابق
                      </Button>
                      
                      {step === 5 ? null : step === 4 ? (
                        <Button 
                          onClick={nextStep}
                          className="imperial-button imperial-button-accent h-14 sm:h-20 px-8 sm:px-16 text-base sm:text-lg"
                        >
                          الانتقال للدفع
                          <CreditCard className="mr-4 w-6 h-6" />
                        </Button>
                      ) : (
                        <Button 
                          onClick={nextStep}
                          className="imperial-button imperial-button-primary h-20 px-16 text-lg"
                        >
                          المتابعة
                          <ArrowLeft className="mr-4 w-6 h-6" />
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div 
                key="success"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="max-w-3xl mx-auto text-center space-y-12"
              >
                <div className="w-40 h-40 bg-accent rounded-[3rem] flex items-center justify-center text-white mx-auto shadow-2xl shadow-accent/30 animate-float">
                  <CheckCircle className="w-20 h-20" />
                </div>
                <div className="space-y-4 sm:space-y-6">
                  <h2 className="text-3xl sm:text-6xl font-serif font-bold text-primary">تم التوثيق بنجاح</h2>
                  <p className="text-lg sm:text-2xl text-stone-500 font-light leading-relaxed max-w-xl mx-auto">
                    لقد تم تسجيل نزاعك في السجل الإمبراطوري لـ "تسوية". سيقوم أحد وسطاء النخبة بمراجعة طلبك خلال 24 ساعة.
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6">
                  <Link to="/track" className="w-full sm:w-auto">
                    <Button className="w-full sm:w-auto imperial-button imperial-button-primary h-16 sm:h-20 px-12 sm:px-16 text-base sm:text-lg">
                      تتبع حالة النزاع
                    </Button>
                  </Link>
                  <Link to="/" className="w-full sm:w-auto">
                    <Button variant="outline" className="w-full sm:w-auto h-16 sm:h-20 px-12 sm:px-16 rounded-full text-base sm:text-lg border-stone-200 hover:bg-white hover:shadow-2xl transition-all duration-500">
                      العودة للرئيسية
                    </Button>
                  </Link>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}

function Step1({ data, update, countries }: any) {
  return (
    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6 sm:space-y-10">
      <div className="space-y-2 sm:space-y-4">
        <h3 className="text-2xl sm:text-4xl font-serif font-bold text-primary tracking-tighter">هويتك السيادية</h3>
        <p className="text-stone-500 text-base sm:text-lg font-light">نحتاج لبياناتك الأساسية لنبدأ بروتوكول الحماية.</p>
      </div>
      <div className="grid md:grid-cols-2 gap-4 sm:gap-8">
        <div className="space-y-3 sm:space-y-4 md:col-span-2">
          <Label className="text-[9px] sm:text-[10px] font-black uppercase tracking-widest text-stone-400">اختر دولتك</Label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-4">
            {countries.map((c: any) => (
              <button
                key={c.code}
                onClick={() => update({ ...data, country: c.code })}
                className={cn(
                  "p-3 sm:p-4 rounded-xl sm:rounded-2xl border-2 transition-all text-xs sm:text-sm font-bold",
                  data.country === c.code 
                    ? "border-accent bg-accent/5 text-primary" 
                    : "border-stone-100 bg-stone-50 text-stone-400 hover:border-stone-200"
                )}
              >
                {c.name}
              </button>
            ))}
          </div>
        </div>
        <div className="space-y-3 sm:space-y-4">
          <Label className="text-[9px] sm:text-[10px] font-black uppercase tracking-widest text-stone-400">الاسم الكامل</Label>
          <Input 
            value={data.applicant.name}
            onChange={(e) => update({ ...data, applicant: { ...data.applicant, name: e.target.value } })}
            placeholder="أدخل اسمك كما في الهوية" 
            className="h-12 sm:h-16 rounded-xl sm:rounded-2xl bg-stone-50 border-stone-200 px-4 sm:px-6 focus:bg-white transition-all text-base sm:text-lg font-serif"
          />
        </div>
        <div className="space-y-3 sm:space-y-4">
          <Label className="text-[9px] sm:text-[10px] font-black uppercase tracking-widest text-stone-400">رقم الهاتف</Label>
          <Input 
            value={data.applicant.phone}
            onChange={(e) => update({ ...data, applicant: { ...data.applicant, phone: e.target.value } })}
            placeholder="+20 123 456 789" 
            className="h-12 sm:h-16 rounded-xl sm:rounded-2xl bg-stone-50 border-stone-200 px-4 sm:px-6 focus:bg-white transition-all text-base sm:text-lg font-serif"
          />
        </div>
        <div className="space-y-3 sm:space-y-4 md:col-span-2">
          <Label className="text-[9px] sm:text-[10px] font-black uppercase tracking-widest text-stone-400">البريد الإلكتروني</Label>
          <Input 
            value={data.applicant.email}
            onChange={(e) => update({ ...data, applicant: { ...data.applicant, email: e.target.value } })}
            placeholder="name@empire.com" 
            className="h-12 sm:h-16 rounded-xl sm:rounded-2xl bg-stone-50 border-stone-200 px-4 sm:px-6 focus:bg-white transition-all text-base sm:text-lg font-serif"
          />
        </div>
      </div>
    </motion.div>
  );
}

function Step2({ data, update }: any) {
  return (
    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6 sm:space-y-10">
      <div className="space-y-2 sm:space-y-4">
        <h3 className="text-2xl sm:text-4xl font-serif font-bold text-primary tracking-tighter">تفاصيل النزاع</h3>
        <p className="text-stone-500 text-base sm:text-lg font-light">اشرح لنا جوهر الخلاف لنحدد مسار التسوية الأمثل.</p>
      </div>
      <div className="grid gap-6 sm:gap-8">
        <div className="space-y-3 sm:space-y-4">
          <Label className="text-[9px] sm:text-[10px] font-black uppercase tracking-widest text-stone-400">نوع النزاع</Label>
          <select 
            value={data.details.type}
            onChange={(e) => update({ ...data, details: { ...data.details, type: e.target.value } })}
            className="w-full h-12 sm:h-16 rounded-xl sm:rounded-2xl bg-stone-50 border-stone-200 px-4 sm:px-6 focus:bg-white transition-all text-base sm:text-lg font-serif outline-none"
          >
            <option value="price_increase">زيادة قيمة الإيجار</option>
            <option value="eviction">نزاع إخلاء</option>
            <option value="maintenance">مشاكل صيانة</option>
            <option value="payment_delay">تأخير في السداد</option>
            <option value="other">أخرى</option>
          </select>
        </div>
        <div className="space-y-3 sm:space-y-4">
          <Label className="text-[9px] sm:text-[10px] font-black uppercase tracking-widest text-stone-400">قيمة الإيجار الشهري</Label>
          <Input 
            value={data.details.rentAmount}
            onChange={(e) => update({ ...data, details: { ...data.details, rentAmount: e.target.value } })}
            placeholder="0.00 ج.م" 
            className="h-12 sm:h-16 rounded-xl sm:rounded-2xl bg-stone-50 border-stone-200 px-4 sm:px-6 focus:bg-white transition-all text-base sm:text-lg font-serif"
          />
        </div>
        <div className="space-y-3 sm:space-y-4">
          <Label className="text-[9px] sm:text-[10px] font-black uppercase tracking-widest text-stone-400">وصف النزاع بالتفصيل</Label>
          <Textarea 
            value={data.details.description}
            onChange={(e) => update({ ...data, details: { ...data.details, description: e.target.value } })}
            placeholder="اكتب هنا كافة التفاصيل التي تدعم موقفك..." 
            className="min-h-[150px] sm:min-h-[200px] rounded-2xl sm:rounded-3xl bg-stone-50 border-stone-200 p-4 sm:p-8 focus:bg-white transition-all text-base sm:text-lg font-serif leading-relaxed"
          />
        </div>
      </div>
    </motion.div>
  );
}

function Step3({ data, update }: any) {
  return (
    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6 sm:space-y-10">
      <div className="space-y-2 sm:space-y-4">
        <h3 className="text-2xl sm:text-4xl font-serif font-bold text-primary tracking-tighter">الأطراف المعنية</h3>
        <p className="text-stone-500 text-base sm:text-lg font-light">من هو الطرف الآخر في هذا النزاع؟</p>
      </div>
      <div className="grid md:grid-cols-2 gap-4 sm:gap-8">
        <div className="space-y-3 sm:space-y-4">
          <Label className="text-[9px] sm:text-[10px] font-black uppercase tracking-widest text-stone-400">اسم الطرف الآخر</Label>
          <Input 
            value={data.secondParty.name}
            onChange={(e) => update({ ...data, secondParty: { ...data.secondParty, name: e.target.value } })}
            placeholder="أدخل اسم المالك أو المستأجر" 
            className="h-12 sm:h-16 rounded-xl sm:rounded-2xl bg-stone-50 border-stone-200 px-4 sm:px-6 focus:bg-white transition-all text-base sm:text-lg font-serif"
          />
        </div>
        <div className="space-y-3 sm:space-y-4">
          <Label className="text-[9px] sm:text-[10px] font-black uppercase tracking-widest text-stone-400">رقم هاتف الطرف الآخر</Label>
          <Input 
            value={data.secondParty.phone}
            onChange={(e) => update({ ...data, secondParty: { ...data.secondParty, phone: e.target.value } })}
            placeholder="+20 123 456 789" 
            className="h-12 sm:h-16 rounded-xl sm:rounded-2xl bg-stone-50 border-stone-200 px-4 sm:px-6 focus:bg-white transition-all text-base sm:text-lg font-serif"
          />
        </div>
        <div className="space-y-3 sm:space-y-4 md:col-span-2">
          <Label className="text-[9px] sm:text-[10px] font-black uppercase tracking-widest text-stone-400">عنوان العقار محل النزاع</Label>
          <Input 
            value={data.details.address}
            onChange={(e) => update({ ...data, details: { ...data.details, address: e.target.value } })}
            placeholder="العنوان التفصيلي للعقار" 
            className="h-12 sm:h-16 rounded-xl sm:rounded-2xl bg-stone-50 border-stone-200 px-4 sm:px-6 focus:bg-white transition-all text-base sm:text-lg font-serif"
          />
        </div>
      </div>
    </motion.div>
  );
}

function Step4({ data }: any) {
  return (
    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6 sm:space-y-10">
      <div className="space-y-2 sm:space-y-4">
        <h3 className="text-2xl sm:text-4xl font-serif font-bold text-primary tracking-tighter">التوثيق النهائي</h3>
        <p className="text-stone-500 text-base sm:text-lg font-light">راجع بياناتك قبل إرسالها إلى الأرشيف السيادي.</p>
      </div>
      <div className="imperial-card p-6 sm:p-10 bg-stone-50/50 border-stone-100 space-y-6 sm:space-y-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-10">
          <ReviewField label="مقدم الطلب" value={data.applicant.name} />
          <ReviewField label="نوع النزاع" value={data.details.type} />
          <ReviewField label="الطرف الآخر" value={data.secondParty.name} />
          <ReviewField label="قيمة الإيجار" value={`${data.details.rentAmount} ج.م`} />
        </div>
        <div className="pt-6 sm:pt-8 border-t border-stone-200">
          <ReviewField label="عنوان العقار" value={data.details.address} />
        </div>
      </div>
      <div className="flex items-start sm:items-center gap-3 sm:gap-4 p-4 sm:p-6 rounded-xl sm:rounded-2xl bg-accent/5 border border-accent/10">
        <ShieldCheck className="w-5 h-5 sm:w-6 sm:h-6 text-accent shrink-0" />
        <p className="text-[10px] sm:text-xs font-bold text-stone-600 leading-relaxed">بضغطك على المتابعة، أنت تقر بصحة البيانات المقدمة وتفوض "تسوية" للبدء في إجراءات الوساطة السيادية بعد إتمام الدفع.</p>
      </div>
    </motion.div>
  );
}

function Step5({ onComplete, loading, data, update, country }: any) {
  return (
    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-10">
      <div className="space-y-2 sm:space-y-4">
        <h3 className="text-2xl sm:text-4xl font-serif font-bold text-primary tracking-tighter">بوابة الدفع السيادية</h3>
        <p className="text-stone-500 text-base sm:text-lg font-light leading-relaxed">رسوم الخدمة في {country.name} هي {country.fee} {country.currency} شاملة كافة المصاريف الإدارية.</p>
      </div>
      
      <div className="grid gap-4 sm:gap-6">
        {country.gateways.includes("paytabs") && (
          <div 
            onClick={() => update({ ...data, gateway: "paytabs" })}
            className={cn(
              "p-4 sm:p-8 rounded-2xl sm:rounded-[32px] border-2 flex items-center justify-between group cursor-pointer transition-all",
              data.gateway === "paytabs" ? "border-accent bg-accent/5" : "border-stone-100 bg-stone-50/50 hover:border-stone-200"
            )}
          >
            <div className="flex items-center gap-3 sm:gap-6">
              <div className="w-12 h-12 sm:w-16 h-16 bg-white rounded-xl sm:rounded-2xl flex items-center justify-center shadow-xl shrink-0">
                <CreditCard className="w-6 h-6 sm:w-8 h-8 text-accent" />
              </div>
              <div className="min-w-0">
                <p className="text-lg sm:text-xl font-serif font-bold text-primary truncate">الدفع عبر PayTabs</p>
                <div className="flex flex-wrap items-center gap-1 sm:gap-2 mt-1">
                  <span className="text-[7px] sm:text-[8px] font-black text-stone-400 uppercase tracking-widest">Visa</span>
                  <span className="text-[7px] sm:text-[8px] font-black text-stone-400 uppercase tracking-widest">MasterCard</span>
                  <span className="text-[7px] sm:text-[8px] font-black text-stone-400 uppercase tracking-widest">Mada</span>
                  <span className="text-[7px] sm:text-[8px] font-black text-stone-400 uppercase tracking-widest">Apple Pay</span>
                </div>
              </div>
            </div>
            <div className={cn("w-6 h-6 sm:w-8 h-8 rounded-full border-2 flex items-center justify-center shrink-0", data.gateway === "paytabs" ? "border-accent" : "border-stone-300")}>
              {data.gateway === "paytabs" && <div className="w-3 h-3 sm:w-4 h-4 bg-accent rounded-full" />}
            </div>
          </div>
        )}

        {country.gateways.includes("stripe") && (
          <div 
            onClick={() => update({ ...data, gateway: "stripe" })}
            className={cn(
              "p-4 sm:p-8 rounded-2xl sm:rounded-[32px] border-2 flex items-center justify-between group cursor-pointer transition-all",
              data.gateway === "stripe" ? "border-accent bg-accent/5" : "border-stone-100 bg-stone-50/50 hover:border-stone-200"
            )}
          >
            <div className="flex items-center gap-3 sm:gap-6">
              <div className="w-12 h-12 sm:w-16 h-16 bg-white rounded-xl sm:rounded-2xl flex items-center justify-center shadow-xl shrink-0">
                <Lock className="w-6 h-6 sm:w-8 h-8 text-blue-600" />
              </div>
              <div className="min-w-0">
                <p className="text-lg sm:text-xl font-serif font-bold text-primary truncate">الدفع عبر Stripe</p>
                <p className="text-[10px] sm:text-xs text-stone-400 font-bold uppercase tracking-widest truncate">بوابة دفع عالمية آمنة</p>
              </div>
            </div>
            <div className={cn("w-6 h-6 sm:w-8 h-8 rounded-full border-2 flex items-center justify-center shrink-0", data.gateway === "stripe" ? "border-accent" : "border-stone-300")}>
              {data.gateway === "stripe" && <div className="w-3 h-3 sm:w-4 h-4 bg-accent rounded-full" />}
            </div>
          </div>
        )}

        {country.gateways.includes("mtgr") && (
          <div 
            onClick={() => update({ ...data, gateway: "mtgr" })}
            className={cn(
              "p-4 sm:p-8 rounded-2xl sm:rounded-[32px] border-2 flex items-center justify-between group cursor-pointer transition-all",
              data.gateway === "mtgr" ? "border-accent bg-accent/5" : "border-stone-100 bg-stone-50/50 hover:border-stone-200"
            )}
          >
            <div className="flex items-center gap-3 sm:gap-6">
              <div className="w-12 h-12 sm:w-16 h-16 bg-white rounded-xl sm:rounded-2xl flex items-center justify-center shadow-xl shrink-0">
                <Crown className="w-6 h-6 sm:w-8 h-8 text-accent" />
              </div>
              <div className="min-w-0">
                <p className="text-lg sm:text-xl font-serif font-bold text-primary truncate">متجر السودان (MTGR)</p>
                <p className="text-[10px] sm:text-xs text-stone-400 font-bold uppercase tracking-widest truncate">الدفع المحلي بالسودان</p>
              </div>
            </div>
            <div className={cn("w-6 h-6 sm:w-8 h-8 rounded-full border-2 flex items-center justify-center shrink-0", data.gateway === "mtgr" ? "border-accent" : "border-stone-300")}>
              {data.gateway === "mtgr" && <div className="w-3 h-3 sm:w-4 h-4 bg-accent rounded-full" />}
            </div>
          </div>
        )}

        {country.gateways.includes("bankak") && (
          <div className="space-y-4">
            <div 
              onClick={() => update({ ...data, gateway: "bankak" })}
              className={cn(
                "p-4 sm:p-8 rounded-2xl sm:rounded-[32px] border-2 flex items-center justify-between group cursor-pointer transition-all",
                data.gateway === "bankak" ? "border-accent bg-accent/5" : "border-stone-100 bg-stone-50/50 hover:border-stone-200"
              )}
            >
              <div className="flex items-center gap-3 sm:gap-6">
                <div className="w-12 h-12 sm:w-16 h-16 bg-white rounded-xl sm:rounded-2xl flex items-center justify-center shadow-xl shrink-0">
                  <Globe className="w-6 h-6 sm:w-8 h-8 text-emerald-600" />
                </div>
                <div className="min-w-0">
                  <p className="text-lg sm:text-xl font-serif font-bold text-primary truncate">تطبيق بنكك (Bankak)</p>
                  <p className="text-[10px] sm:text-xs text-stone-400 font-bold uppercase tracking-widest truncate">تحويل مباشر • السودان</p>
                </div>
              </div>
              <div className={cn("w-6 h-6 sm:w-8 h-8 rounded-full border-2 flex items-center justify-center shrink-0", data.gateway === "bankak" ? "border-accent" : "border-stone-300")}>
                {data.gateway === "bankak" && <div className="w-3 h-3 sm:w-4 h-4 bg-accent rounded-full" />}
              </div>
            </div>

            {data.gateway === "bankak" && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="p-4 sm:p-8 rounded-2xl sm:rounded-[32px] bg-emerald-50 border border-emerald-100 space-y-4 sm:space-y-6"
              >
                <div className="space-y-2">
                  <p className="text-xs sm:text-sm font-bold text-emerald-800">بيانات التحويل:</p>
                  <div className="p-3 sm:p-4 bg-white rounded-xl sm:rounded-2xl border border-emerald-200">
                    <p className="text-base sm:text-lg font-mono font-bold text-primary">رقم الحساب: 1530230</p>
                    <p className="text-xs sm:text-sm font-bold text-stone-600">باسم: شمس الدين البشير</p>
                  </div>
                </div>

                <div className="space-y-3 sm:space-y-4">
                  <Label className="text-[9px] sm:text-[10px] font-black uppercase tracking-widest text-emerald-700">إرفاق إشعار الدفع (صورة)</Label>
                  <div className="relative">
                    <input 
                      type="file" 
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onloadend = () => {
                            update({ ...data, paymentReceipt: reader.result as string });
                          };
                          reader.readAsDataURL(file);
                        }
                      }}
                      className="hidden" 
                      id="receipt-upload"
                    />
                    <label 
                      htmlFor="receipt-upload"
                      className="flex flex-col items-center justify-center p-6 sm:p-10 border-2 border-dashed border-emerald-300 rounded-2xl sm:rounded-3xl bg-white/50 cursor-pointer hover:bg-white transition-all group"
                    >
                      {data.paymentReceipt ? (
                        <div className="relative w-full aspect-video rounded-xl sm:rounded-2xl overflow-hidden">
                          <img src={data.paymentReceipt} alt="Receipt" className="w-full h-full object-cover" />
                          <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <p className="text-white text-[10px] font-bold">تغيير الصورة</p>
                          </div>
                        </div>
                      ) : (
                        <>
                          <FileText className="w-8 h-8 sm:w-10 h-10 text-emerald-400 mb-2 sm:mb-4" />
                          <p className="text-xs sm:text-sm font-bold text-emerald-700">اضغط لرفع صورة الإشعار</p>
                          <p className="text-[8px] sm:text-[10px] text-emerald-500 mt-1 sm:mt-2">PNG, JPG (Max 5MB)</p>
                        </>
                      )}
                    </label>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        )}

        <div 
          onClick={() => update({ ...data, gateway: "payoneer" })}
          className={cn(
            "p-4 sm:p-8 rounded-2xl sm:rounded-[32px] border-2 flex items-center justify-between group cursor-pointer transition-all",
            data.gateway === "payoneer" ? "border-accent bg-accent/5" : "border-stone-100 bg-stone-50/50 hover:border-stone-200"
          )}
        >
          <div className="flex items-center gap-3 sm:gap-6">
            <div className="w-12 h-12 sm:w-16 h-16 bg-white rounded-xl sm:rounded-2xl flex items-center justify-center shadow-sm shrink-0">
              <Globe className="w-6 h-6 sm:w-8 h-8 text-primary" />
            </div>
            <div className="min-w-0">
              <p className="text-lg sm:text-xl font-serif font-bold text-primary truncate">الدفع عبر Payoneer</p>
              <p className="text-[10px] sm:text-xs text-stone-400 font-bold uppercase tracking-widest truncate">للمدفوعات الدولية</p>
            </div>
          </div>
          <div className={cn("w-6 h-6 sm:w-8 h-8 rounded-full border-2 flex items-center justify-center shrink-0", data.gateway === "payoneer" ? "border-accent" : "border-stone-300")}>
            {data.gateway === "payoneer" && <div className="w-3 h-3 sm:w-4 h-4 bg-accent rounded-full" />}
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <div className="flex items-start gap-4 p-4 sm:p-6 rounded-2xl bg-stone-50 border border-stone-100">
          <input 
            type="checkbox" 
            id="terms" 
            checked={data.agreedToTerms}
            onChange={(e) => update({ ...data, agreedToTerms: e.target.checked })}
            className="mt-1 w-5 h-5 accent-accent cursor-pointer shrink-0"
          />
          <label htmlFor="terms" className="text-xs sm:text-sm text-stone-600 leading-relaxed cursor-pointer">
            أوافق على <Link to="/terms" className="text-accent font-bold hover:underline">شروط الخدمة</Link> و <Link to="/privacy" className="text-accent font-bold hover:underline">سياسة الخصوصية</Link>. أقر بأن المنصة وسيط تقني فقط وأن القرار الصادر ملزم باتفاق الطرفين.
          </label>
        </div>

        <div className="p-6 sm:p-8 rounded-2xl sm:rounded-[32px] bg-primary text-white space-y-4 sm:space-y-6">
          <div className="flex justify-between items-center border-b border-white/10 pb-4 sm:pb-6">
            <span className="text-stone-400 font-bold uppercase tracking-widest text-[10px] sm:text-xs">إجمالي الرسوم</span>
            <span className="text-xl sm:text-2xl font-serif font-bold">{country.fee}.00 {country.currency}</span>
          </div>
          <Button 
            onClick={onComplete}
            disabled={loading || !data.gateway || !data.agreedToTerms || (data.gateway === 'bankak' && !data.paymentReceipt)}
            className="w-full h-14 sm:h-20 bg-accent hover:bg-accent/90 text-white rounded-full text-lg sm:text-xl font-serif font-bold shadow-2xl shadow-accent/20 transition-all"
          >
            {loading ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                جاري المعالجة...
              </div>
            ) : "تأكيد الدفع والتوثيق"}
          </Button>
        </div>
      </div>
    </motion.div>
  );
}

function ReviewField({ label, value }: { label: string, value: string }) {
  return (
    <div className="space-y-1">
      <p className="text-[9px] font-black text-stone-400 uppercase tracking-widest">{label}</p>
      <p className="text-lg font-serif font-bold text-primary">{value || "غير محدد"}</p>
    </div>
  );
}
