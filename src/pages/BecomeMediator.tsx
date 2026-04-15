import React, { useState } from "react";
import { motion } from "motion/react";
import { db } from "@/src/lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { 
  Scale, ShieldCheck, TrendingUp, Users, 
  CheckCircle, ArrowRight, Star, Award 
} from "lucide-react";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { Label } from "@/src/components/ui/label";
import { Card, CardContent } from "@/src/components/ui/card";
import { toast } from "sonner";
import { useSearchParams } from "react-router-dom";

export default function BecomeMediator() {
  const [searchParams] = useSearchParams();
  const referralCode = searchParams.get("ref");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    
    try {
      await addDoc(collection(db, "leads_mediators"), {
        name: formData.get("name"),
        email: formData.get("email"),
        phone: formData.get("phone"),
        experience: formData.get("experience"),
        city: formData.get("city"),
        referralCode: referralCode || null,
        status: "new",
        createdAt: serverTimestamp(),
      });
      setSubmitted(true);
      toast.success("تم تسجيل اهتمامك بنجاح! سنتواصل معك قريباً.");
    } catch (error) {
      console.error(error);
      toast.error("حدث خطأ أثناء التسجيل. يرجى المحاولة لاحقاً.");
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-secondary flex items-center justify-center p-4 font-sans" dir="rtl">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full text-center space-y-8"
        >
          <div className="w-24 h-24 bg-emerald-500 rounded-3xl flex items-center justify-center text-white shadow-2xl shadow-emerald-200 mx-auto">
            <CheckCircle className="w-12 h-12" />
          </div>
          <h1 className="text-4xl font-serif font-bold text-primary tracking-tighter">شكراً لاهتمامك!</h1>
          <p className="text-stone-500 leading-relaxed">
            لقد تم استلام طلبك بنجاح. فريقنا يراجع حالياً كافة طلبات الوسطاء وسنقوم بالتواصل معك عبر البريد الإلكتروني لتحديد موعد للمقابلة المهنية.
          </p>
          <Button 
            onClick={() => window.location.href = "/"}
            className="rounded-full bg-primary hover:bg-stone-900 text-white px-10 h-14"
          >
            العودة للرئيسية
          </Button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-secondary font-sans" dir="rtl">
      {/* Hero Section */}
      <section className="relative pt-20 pb-32 overflow-hidden">
        <div className="absolute top-0 right-0 w-full h-full opacity-5 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]" />
        <div className="max-w-7xl mx-auto px-4 sm:px-12 relative z-10">
          <div className="grid lg:grid-cols-2 gap-20 items-center">
            <div className="space-y-10">
              <Badge className="bg-accent text-white rounded-full px-6 py-2 text-[10px] font-black uppercase tracking-widest">فرصة مهنية سيادية</Badge>
              <h1 className="text-4xl sm:text-6xl sm:text-7xl font-serif font-bold text-primary tracking-tighter leading-[0.9]">
                كن جزءاً من <br /> <span className="text-accent italic">مستقبل الوساطة</span> العقارية
              </h1>
              <p className="text-xl text-stone-500 leading-relaxed max-w-lg">
                انضم إلى نخبة الوسطاء في منصة "تسوية". حوّل خبرتك القانونية إلى دخل إضافي وساهم في استقرار السوق العقاري.
              </p>
              
              <div className="grid grid-cols-2 gap-8">
                <Feature icon={<TrendingUp />} title="دخل إضافي" desc="رسوم مجزية عن كل نزاع يتم حله." />
                <Feature icon={<Award />} title="سمعة مهنية" desc="نظام تقييم يرفع من مكانتك في السوق." />
                <Feature icon={<ShieldCheck />} title="عمل مرن" desc="حل النزاعات رقمياً من أي مكان." />
                <Feature icon={<Users />} title="شبكة علاقات" desc="تواصل مع كبار الملاك والمستثمرين." />
              </div>
            </div>

            <Card className="rounded-[40px] border-stone-200 shadow-[0_50px_100px_rgba(0,0,0,0.1)] overflow-hidden">
              <CardContent className="p-10 sm:p-16 space-y-10">
                <div className="text-center space-y-2">
                  <h2 className="text-3xl font-serif font-bold text-primary">سجل اهتمامك الآن</h2>
                  <p className="text-sm text-stone-400">كن أول من يحصل على دعوة الانضمام الرسمية</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="name" className="text-xs font-black text-stone-500 uppercase tracking-widest">الاسم الكامل</Label>
                      <Input id="name" name="name" placeholder="الأستاذ/ ..." required className="h-14 rounded-2xl border-stone-200" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-xs font-black text-stone-500 uppercase tracking-widest">البريد الإلكتروني</Label>
                      <Input id="email" name="email" type="email" placeholder="lawyer@example.com" required className="h-14 rounded-2xl border-stone-200" />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="phone" className="text-xs font-black text-stone-500 uppercase tracking-widest">رقم الهاتف</Label>
                      <Input id="phone" name="phone" placeholder="+20 ..." required className="h-14 rounded-2xl border-stone-200" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="city" className="text-xs font-black text-stone-500 uppercase tracking-widest">المدينة</Label>
                      <Input id="city" name="city" placeholder="القاهرة، الرياض، إلخ" required className="h-14 rounded-2xl border-stone-200" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="experience" className="text-xs font-black text-stone-500 uppercase tracking-widest">سنوات الخبرة</Label>
                    <Input id="experience" name="experience" placeholder="مثلاً: 10 سنوات في القانون المدني" required className="h-14 rounded-2xl border-stone-200" />
                  </div>

                  {referralCode && (
                    <div className="p-4 rounded-2xl bg-accent/5 border border-accent/10 flex items-center justify-between">
                      <span className="text-xs font-bold text-accent">تم تطبيق كود الإحالة:</span>
                      <span className="text-xs font-black text-primary">{referralCode}</span>
                    </div>
                  )}

                  <Button 
                    type="submit" 
                    disabled={loading}
                    className="w-full h-16 rounded-2xl bg-primary hover:bg-stone-900 text-white font-black text-xs uppercase tracking-[0.2em] shadow-2xl shadow-primary/20"
                  >
                    {loading ? "جاري التسجيل..." : "إرسال طلب الانضمام"}
                    <ArrowRight className="mr-3 w-4 h-4" />
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Testimonials/Trust Section */}
      <section className="py-32 bg-primary text-white overflow-hidden relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-12 relative z-10">
          <div className="text-center space-y-6 mb-20">
            <h2 className="text-3xl sm:text-4xl sm:text-5xl font-serif font-bold tracking-tighter">لماذا يختار المحامون "تسوية"؟</h2>
            <p className="text-stone-400 max-w-lg mx-auto">نحن لا نوفر مجرد منصة، بل نوفر نظاماً بيئياً متكاملاً للنجاح المهني.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-10">
            <Testimonial 
              quote="منصة تسوية غيرت طريقتي في العمل. أستطيع الآن حل النزاعات من مكتبي وبكفاءة أعلى بكثير."
              author="المستشار خالد العتيبي"
              role="خبير عقاري"
            />
            <Testimonial 
              quote="نظام الحوافز والنقاط في تسوية يجعل العمل ممتعاً ومجزياً. أشعر أن جهدي مقدر دائماً."
              author="الأستاذة سارة المنصوري"
              role="محامية بالنقض"
            />
            <Testimonial 
              quote="الشفافية والسرية السيادية هي ما يميز هذه المنصة. ثقة العملاء تزداد يوماً بعد يوم."
              author="د. أحمد إبراهيم"
              role="وسيط معتمد"
            />
          </div>
        </div>
      </section>
    </div>
  );
}

function Feature({ icon, title, desc }: any) {
  return (
    <div className="flex gap-4">
      <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center text-accent shrink-0">
        {icon}
      </div>
      <div>
        <h4 className="text-sm font-black text-primary uppercase tracking-widest mb-1">{title}</h4>
        <p className="text-xs text-stone-400 leading-relaxed">{desc}</p>
      </div>
    </div>
  );
}

function Testimonial({ quote, author, role }: any) {
  return (
    <div className="p-10 rounded-[40px] bg-white/5 border border-white/10 space-y-6">
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map(s => <Star key={s} className="w-4 h-4 fill-accent text-accent" />)}
      </div>
      <p className="text-lg font-serif italic text-stone-300 leading-relaxed">"{quote}"</p>
      <div className="pt-6 border-t border-white/10">
        <p className="text-sm font-black text-white uppercase tracking-widest">{author}</p>
        <p className="text-[10px] text-accent font-black uppercase tracking-widest mt-1">{role}</p>
      </div>
    </div>
  );
}

function Badge({ children, className }: any) {
  return (
    <span className={cn("inline-block px-3 py-1 text-[10px] font-bold", className)}>
      {children}
    </span>
  );
}

function cn(...classes: any[]) {
  return classes.filter(Boolean).join(" ");
}
