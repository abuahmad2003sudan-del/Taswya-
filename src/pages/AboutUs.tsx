import React from "react";
import { motion } from "motion/react";
import { ArrowRight, Target, Eye, Award, Users, ShieldCheck } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/src/components/ui/button";

export default function AboutUs() {
  return (
    <div className="min-h-screen bg-background font-sans selection:bg-accent selection:text-white" dir="rtl">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-background/60 backdrop-blur-3xl border-b border-stone-200/30">
        <div className="max-w-[1400px] mx-auto px-10 h-20 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
              <span className="text-white font-serif italic text-xl">ت</span>
            </div>
            <span className="font-serif font-bold text-xl text-primary">تسوية</span>
          </Link>
          <Link to="/">
            <Button variant="ghost" className="gap-2 text-stone-500">
              <ArrowRight className="w-4 h-4" />
              العودة للرئيسية
            </Button>
          </Link>
        </div>
      </nav>

      <main className="pt-40 pb-20 max-w-5xl mx-auto px-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="space-y-20"
        >
          {/* Header */}
          <div className="text-center space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-accent/10 border border-accent/20 text-accent text-[10px] font-black uppercase tracking-widest">
              <Award className="w-3 h-3" />
              The Imperial Vision
            </div>
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-serif font-bold text-primary leading-tight">
              قصة <span className="text-accent italic">إمبراطورية</span> تسوية
            </h1>
            <p className="text-stone-500 text-xl font-light max-w-3xl mx-auto leading-relaxed">
              نحن لم ننشئ مجرد موقع إلكتروني، بل أطلقنا ثورة في عالم العدالة الرقمية، لنعيد صياغة مفهوم حل النزاعات العقارية في الوطن العربي.
            </p>
          </div>

          {/* Mission & Vision Cards */}
          <div className="grid md:grid-cols-2 gap-10">
            <div className="p-12 rounded-[3rem] bg-stone-50 border border-stone-100 space-y-6">
              <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center text-white">
                <Target className="w-8 h-8" />
              </div>
              <h2 className="text-3xl font-serif font-bold text-primary">رسالتنا</h2>
              <p className="text-stone-600 leading-relaxed font-light">
                تمكين الملاك والمستأجرين من الوصول إلى حلول قانونية عادلة وسريعة دون الحاجة إلى إجراءات المحاكم الطويلة والمعقدة. نحن نؤمن أن الوقت هو أغلى ما يملكه الإنسان، لذا جعلنا "السرعة" هي ركيزتنا الأولى.
              </p>
            </div>
            <div className="p-12 rounded-[3rem] bg-accent/5 border border-accent/10 space-y-6">
              <div className="w-16 h-16 bg-accent rounded-2xl flex items-center justify-center text-white">
                <Eye className="w-8 h-8" />
              </div>
              <h2 className="text-3xl font-serif font-bold text-primary">رؤيتنا</h2>
              <p className="text-stone-600 leading-relaxed font-light">
                أن نكون المنصة الرقمية الأولى والوحيدة في الشرق الأوسط التي يعتمد عليها كبار المستثمرين العقاريين لضمان استقرار أصولهم وحل نزاعاتهم بخصوصية تامة واحترافية سيادية.
              </p>
            </div>
          </div>

          {/* Why Us Section */}
          <div className="space-y-12">
            <h2 className="text-4xl font-serif font-bold text-primary text-center">لماذا يختارنا النخبة؟</h2>
            <div className="grid md:grid-cols-3 gap-8">
              <ValueCard 
                icon={<ShieldCheck className="w-6 h-6" />}
                title="الخصوصية السيادية"
                description="بيانات النزاع مشفرة بالكامل ولا تظهر إلا للأطراف المعنية فقط."
              />
              <ValueCard 
                icon={<Users className="w-6 h-6" />}
                title="وسطاء معتمدون"
                description="نخبة من الخبراء القانونيين والوسطاء العقاريين ذوي الخبرة الطويلة."
              />
              <ValueCard 
                icon={<Award className="w-6 h-6" />}
                title="توثيق رسمي"
                description="كافة التسويات الصادرة عبر المنصة موثقة ويمكن الاعتماد عليها قانونياً."
              />
            </div>
          </div>

          {/* Real Story Section */}
          <div className="p-16 rounded-[4rem] bg-primary text-secondary relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
            <div className="relative z-10 space-y-8">
              <h2 className="text-4xl font-serif font-bold text-white">كلمة المؤسس</h2>
              <p className="text-xl text-stone-300 leading-relaxed font-light italic">
                "بدأت فكرة 'تسوية' من ملاحظة بسيطة: النزاعات العقارية الصغيرة تستهلك سنوات في المحاكم وتدمر العلاقات الاستثمارية. قررنا بناء نظام ذكي يحل هذه المشاكل في 48 ساعة فقط، مع الحفاظ على كرامة وسيادة جميع الأطراف. نحن هنا لنبني جسوراً من الثقة، لا جدراناً من القضايا."
              </p>
              <div className="pt-6 border-t border-stone-700">
                <p className="font-serif font-bold text-2xl text-accent">إمبراطورية تسوية</p>
                <p className="text-stone-500 text-sm uppercase tracking-widest">Legal Tech Pioneers</p>
                <p className="text-stone-400 text-xs mt-4">للتواصل: abuahmad.2003sudan@gmail.com</p>
              </div>
            </div>
          </div>
        </motion.div>
      </main>

      <footer className="py-10 border-t border-stone-100 text-center text-[10px] font-black uppercase tracking-[0.3em] text-stone-400">
        © MMXXIV TASWYA IMPERIAL. ALL RIGHTS RESERVED.
      </footer>
    </div>
  );
}

function ValueCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
  return (
    <div className="p-10 rounded-[2.5rem] bg-white border border-stone-100 hover:border-accent transition-all duration-500 group">
      <div className="w-12 h-12 rounded-xl bg-stone-50 flex items-center justify-center text-stone-400 group-hover:bg-accent group-hover:text-white transition-all mb-6">
        {icon}
      </div>
      <h3 className="text-xl font-serif font-bold text-primary mb-3">{title}</h3>
      <p className="text-stone-500 text-sm leading-relaxed font-light">{description}</p>
    </div>
  );
}
