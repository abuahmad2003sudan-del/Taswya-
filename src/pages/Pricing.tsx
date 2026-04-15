import React from "react";
import { motion } from "motion/react";
import { CreditCard, Check, ArrowLeft, ShieldCheck, Zap, Crown, Globe, Scale } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/src/components/ui/button";
import { Badge } from "@/src/components/ui/badge";

const plans = [
  {
    name: "الباقة الأساسية",
    price: "500",
    currency: "ج.م / ر.س",
    description: "مثالية للنزاعات الإيجارية الفردية والمطالبات الصغيرة.",
    features: [
      "وسيط معتمد واحد",
      "جلسة وساطة رقمية واحدة",
      "توثيق إلكتروني للقرار",
      "دعم فني عبر البريد",
      "تتبع النزاع 24/7"
    ],
    icon: <Scale className="w-6 h-6" />,
    popular: false
  },
  {
    name: "باقة النخبة",
    price: "1,500",
    currency: "ج.م / ر.س",
    description: "للنزاعات التجارية المتوسطة والمجمعات السكنية.",
    features: [
      "وسيط خبير متخصص",
      "جلسات وساطة غير محدودة",
      "توثيق سيادي معتمد",
      "دعم هاتفي مباشر",
      "أولوية في معالجة الطلب",
      "استشارة قانونية مجانية"
    ],
    icon: <Zap className="w-6 h-6" />,
    popular: true
  },
  {
    name: "باقة الإمبراطورية",
    price: "5,000",
    currency: "ج.م / ر.س",
    description: "للشركات الكبرى والنزاعات العقارية الضخمة.",
    features: [
      "لجنة من 3 وسطاء كبار",
      "إدارة قانونية شاملة",
      "توثيق دولي (ISO)",
      "مدير حساب مخصص",
      "تحليل ذكاء اصطناعي للنزاع",
      "تغطية قانونية شاملة"
    ],
    icon: <Crown className="w-6 h-6" />,
    popular: false
  }
];

export default function Pricing() {
  return (
    <div className="min-h-screen bg-secondary flex flex-col font-sans selection:bg-accent selection:text-white" dir="rtl">
      <nav className="h-24 bg-white/80 backdrop-blur-xl border-b border-stone-200/50 sticky top-0 z-50 flex items-center justify-between px-6 sm:px-12">
        <Link to="/" className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
            <CreditCard className="text-white w-6 h-6" />
          </div>
          <span className="font-serif font-bold text-xl text-primary">رسوم الخدمة</span>
        </Link>
        <Link to="/">
          <Button variant="ghost" className="rounded-full gap-2 text-stone-500">
            <ArrowLeft className="w-4 h-4" />
            العودة للرئيسية
          </Button>
        </Link>
      </nav>

      <main className="flex-1 py-20 px-6 sm:px-12 max-w-7xl mx-auto w-full">
        <header className="text-center mb-20 space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Badge className="bg-accent/10 text-accent border-none px-6 py-2 rounded-full text-xs font-black uppercase tracking-widest mb-6">
              Transparent Fees
            </Badge>
            <h1 className="text-5xl sm:text-7xl font-serif font-bold text-primary tracking-tighter">
              استثمار في <span className="text-accent italic">الاستقرار</span> القانوني
            </h1>
            <p className="text-stone-500 text-xl font-light max-w-3xl mx-auto leading-relaxed mt-6">
              نقدم هيكل رسوم واضح وتنافسي يضمن لك الحصول على أفضل خدمة وساطة سيادية في المنطقة، دون تكاليف خفية أو مفاجآت.
            </p>
          </motion.div>
        </header>

        <div className="grid lg:grid-cols-3 gap-8">
          {plans.map((plan, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className={cn(
                "imperial-card p-10 flex flex-col relative overflow-hidden",
                plan.popular ? "border-accent shadow-2xl shadow-accent/10 scale-105 z-10" : ""
              )}
            >
              {plan.popular && (
                <div className="absolute top-0 left-0 w-full bg-accent text-white text-[10px] font-black uppercase tracking-widest py-2 text-center">
                  الأكثر طلباً
                </div>
              )}
              <div className="mb-8">
                <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center mb-6", plan.popular ? "bg-accent text-white" : "bg-stone-100 text-stone-400")}>
                  {plan.icon}
                </div>
                <h3 className="text-2xl font-serif font-bold text-primary mb-2">{plan.name}</h3>
                <p className="text-stone-500 text-sm leading-relaxed">{plan.description}</p>
              </div>
              <div className="mb-10">
                <div className="flex items-baseline gap-2">
                  <span className="text-5xl font-serif font-bold text-primary tracking-tighter">{plan.price}</span>
                  <span className="text-stone-400 text-sm font-bold">{plan.currency}</span>
                </div>
                <p className="text-[10px] font-black text-stone-400 uppercase tracking-widest mt-2">رسوم إدارية شاملة</p>
              </div>
              <div className="flex-1 space-y-4 mb-10">
                {plan.features.map((feature, fIdx) => (
                  <div key={fIdx} className="flex items-center gap-3">
                    <div className="w-5 h-5 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-500 shrink-0">
                      <Check className="w-3 h-3" />
                    </div>
                    <span className="text-sm text-stone-600">{feature}</span>
                  </div>
                ))}
              </div>
              <Link to="/register">
                <Button className={cn("w-full h-14 rounded-xl font-serif font-bold text-lg transition-all", plan.popular ? "bg-accent hover:bg-accent/90 text-white shadow-xl shadow-accent/20" : "bg-primary hover:bg-stone-900 text-white")}>
                  اختر هذه الباقة
                </Button>
              </Link>
            </motion.div>
          ))}
        </div>

        <section className="mt-40 p-12 sm:p-20 rounded-[3rem] bg-white border border-stone-200 relative overflow-hidden text-center">
          <div className="max-w-3xl mx-auto space-y-8">
            <Globe className="w-16 h-16 text-accent mx-auto" />
            <h2 className="text-4xl font-serif font-bold text-primary">هل أنت مؤسسة حكومية أو شركة عقارية كبرى؟</h2>
            <p className="text-stone-500 text-lg font-light leading-relaxed">
              نقدم حلولاً مخصصة للمؤسسات والشركات التي تدير محافظ عقارية ضخمة، مع إمكانية الربط التقني المباشر (API) وتخصيص فريق عمل دائم.
            </p>
            <Link to="/contact">
              <Button variant="outline" className="h-16 px-12 rounded-full border-stone-200 text-primary font-bold text-lg hover:bg-stone-50 transition-all">
                تواصل مع فريق المبيعات السيادي
              </Button>
            </Link>
          </div>
        </section>
      </main>

      <footer className="py-12 border-t border-stone-200 text-center">
        <p className="text-[10px] font-black text-stone-400 uppercase tracking-[0.3em]">
          © 2024 TASWYA SOVEREIGN PRICING • ALL PRICES ARE SUBJECT TO LOCAL TAXES
        </p>
      </footer>
    </div>
  );
}

function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(" ");
}
