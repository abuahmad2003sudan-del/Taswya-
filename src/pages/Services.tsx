import React from "react";
import { motion } from "motion/react";
import { Logo } from "@/src/components/Logo";
import { Link } from "react-router-dom";
import { Scale, ShieldCheck, Clock, Zap, Brain, Globe, Lock, MessageSquare, Crown } from "lucide-react";
import { Button } from "@/src/components/ui/button";
import { HorizontalAd, SquareAd } from "@/src/components/GoogleAd";

const services = [
  {
    icon: <Scale className="w-8 h-8" />,
    title: "الوساطة الرقمية",
    description: "حل النزاعات ودياً عبر منصة مشفرة تضمن حقوق الطرفين دون الحاجة للمحاكم.",
    features: ["اتفاقيات ملزمة قانوناً", "سرية تامة", "سرعة في التنفيذ"]
  },
  {
    icon: <Brain className="w-8 h-8" />,
    title: "التحليل بالذكاء الاصطناعي",
    description: "استخدام خوارزميات متطورة لتحليل بنود العقود وتوقع نتائج النزاعات بدقة 98%.",
    features: ["تحليل العقود", "توقع النتائج", "توصيات قانونية"]
  },
  {
    icon: <ShieldCheck className="w-8 h-8" />,
    title: "الحماية السيادية للملاك",
    description: "خدمات مخصصة لكبار الملاك لضمان استقرار استثماراتهم العقارية وتجنب المشاكل المستقبلية.",
    features: ["إدارة أزمات", "استشارات وقائية", "دعم قانوني 24/7"]
  },
  {
    icon: <Globe className="w-8 h-8" />,
    title: "التحكيم الإقليمي",
    description: "خدمات تحكيم تغطي كافة الدول العربية مع مراعاة القوانين المحلية لكل دولة.",
    features: ["تغطية عربية شاملة", "خبراء محليين", "تنفيذ عابر للحدود"]
  }
];

export default function Services() {
  return (
    <div className="min-h-screen bg-stone-50 font-sans" dir="rtl">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-xl border-b border-stone-200">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <Link to="/">
            <Logo size="md" />
          </Link>
          <div className="flex gap-8">
            <Link to="/register" className="imperial-button imperial-button-primary px-8 py-3 text-xs">اطلب خدمة</Link>
          </div>
        </div>
      </nav>

      <main className="pt-32 pb-20 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-20"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 border border-accent/20 mb-6">
              <Crown className="w-4 h-4 text-accent" />
              <span className="text-[10px] font-black text-accent uppercase tracking-widest">خدماتنا السيادية</span>
            </div>
            <h1 className="text-4xl sm:text-5xl sm:text-7xl font-serif font-bold text-primary mb-8">حلول قانونية <br /><span className="text-accent italic">بلا حدود</span></h1>
            <p className="text-stone-500 text-xl font-light max-w-3xl mx-auto leading-relaxed">
              نقدم مجموعة متكاملة من الخدمات المصممة خصيصاً لتلبية احتياجات النخبة في السوق العقاري العربي.
            </p>
          </motion.div>

          <HorizontalAd className="mb-20" />

          <div className="grid md:grid-cols-2 gap-10">
            {services.map((service, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="imperial-card p-10 sm:p-16 group hover:border-accent transition-all duration-700"
              >
                <div className="w-20 h-20 bg-stone-50 rounded-[2rem] flex items-center justify-center text-stone-400 group-hover:bg-accent group-hover:text-white transition-all duration-700 mb-10 shadow-xl shadow-stone-100">
                  {service.icon}
                </div>
                <h3 className="text-3xl font-serif font-bold text-primary mb-6 group-hover:text-accent transition-colors">{service.title}</h3>
                <p className="text-stone-500 text-lg font-light leading-relaxed mb-10">{service.description}</p>
                <ul className="space-y-4">
                  {service.features.map((feature, fIdx) => (
                    <li key={fIdx} className="flex items-center gap-3 text-stone-400 text-sm font-bold">
                      <div className="w-1.5 h-1.5 rounded-full bg-accent" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>

          <div className="mt-20 grid lg:grid-cols-3 gap-10">
            <div className="lg:col-span-2">
              <div className="imperial-card p-12 bg-primary text-white relative overflow-hidden">
                <div className="relative z-10">
                  <h3 className="text-3xl font-serif font-bold mb-6">هل تحتاج إلى حل مخصص؟</h3>
                  <p className="text-stone-400 text-lg font-light mb-10 max-w-xl">
                    للمشاريع الكبرى والمحافظ العقارية الضخمة، نقدم حلولاً مخصصة تضمن استدامة استثماراتكم.
                  </p>
                  <Link to="/contact">
                    <Button className="imperial-button imperial-button-accent h-14 px-10">تواصل مع المستشار السيادي</Button>
                  </Link>
                </div>
                <div className="absolute top-0 right-0 w-full h-full opacity-5 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
              </div>
            </div>
            <SquareAd label="Premium Service" />
          </div>
        </div>
      </main>

      <footer className="bg-primary text-white py-10 text-center">
        <p className="text-[10px] font-black uppercase tracking-[0.3em] opacity-50">© MMXXIV TASWYA IMPERIAL. ALL RIGHTS RESERVED.</p>
      </footer>
    </div>
  );
}
