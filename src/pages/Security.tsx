import React from "react";
import { motion } from "motion/react";
import { ShieldCheck, Lock, ArrowLeft, Eye, Fingerprint, Shield, Zap, Crown, Server } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/src/components/ui/button";
import { Badge } from "@/src/components/ui/badge";

export default function Security() {
  return (
    <div className="min-h-screen bg-secondary flex flex-col font-sans selection:bg-accent selection:text-white" dir="rtl">
      <nav className="h-24 bg-white/80 backdrop-blur-xl border-b border-stone-200/50 sticky top-0 z-50 flex items-center justify-between px-6 sm:px-12">
        <Link to="/" className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
            <ShieldCheck className="text-white w-6 h-6" />
          </div>
          <span className="font-serif font-bold text-xl text-primary">الأمان السيادي</span>
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
              Sovereign Protection
            </Badge>
            <h1 className="text-5xl sm:text-7xl font-serif font-bold text-primary tracking-tighter">
              حصن <span className="text-accent italic">البيانات</span> المنيع
            </h1>
            <p className="text-stone-500 text-xl font-light max-w-3xl mx-auto leading-relaxed mt-6">
              بياناتك القانونية هي أثمن ما تملك. في "تسوية"، نطبق بروتوكولات أمان عسكرية لضمان سرية وسلامة كل معلومة تمر عبر منصتنا السيادية.
            </p>
          </motion.div>
        </header>

        <div className="grid lg:grid-cols-3 gap-8 mb-40">
          <SecurityFeature 
            icon={<Lock className="w-8 h-8" />} 
            title="تشفير 256-بت" 
            description="كافة البيانات والاتصالات مشفرة بأعلى المعايير العالمية المستخدمة في البنوك والمؤسسات العسكرية." 
          />
          <SecurityFeature 
            icon={<Fingerprint className="w-8 h-8" />} 
            title="هوية سيادية" 
            description="نظام توثيق متعدد المراحل يضمن أن الأطراف المعنية فقط هم من يمكنهم الوصول للنزاع." 
          />
          <SecurityFeature 
            icon={<Server className="w-8 h-8" />} 
            title="خوادم محلية" 
            description="يتم تخزين البيانات في خوادم محلية داخل المنطقة لضمان السيادة الرقمية والامتثال للقوانين المحلية." 
          />
        </div>

        <section className="grid lg:grid-cols-2 gap-20 items-center mb-40">
          <div className="space-y-8">
            <h2 className="text-4xl font-serif font-bold text-primary">التزامنا بالخصوصية المطلقة</h2>
            <p className="text-stone-500 text-lg leading-relaxed">
              نحن ندرك حساسية النزاعات القانونية. لذلك، لا يتم مشاركة أي بيانات مع أطراف ثالثة، ويتم حذف السجلات الحساسة فور انتهاء الفترة القانونية للحفظ، مع إمكانية التشفير الكامل للنزاعات بطلب خاص.
            </p>
            <ul className="space-y-4">
              {[
                "مطابق لمعايير ISO 27001 للأمن السيبراني",
                "فحص دوري للثغرات من قبل شركات أمنية مستقلة",
                "نظام مراقبة ذكي للأنشطة المشبوهة 24/7",
                "نسخ احتياطي مشفر في مواقع متعددة"
              ].map((item, i) => (
                <li key={i} className="flex items-center gap-4 text-stone-600 font-bold">
                  <div className="w-2 h-2 bg-accent rounded-full" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div className="relative">
            <div className="aspect-square bg-stone-100 rounded-[4rem] flex items-center justify-center overflow-hidden border-8 border-white shadow-2xl">
              <Shield className="w-48 h-48 text-accent animate-pulse" />
            </div>
            <div className="absolute -bottom-10 -right-10 glass-panel p-8 rounded-3xl shadow-2xl">
              <div className="flex items-center gap-4">
                <Crown className="w-8 h-8 text-accent" />
                <div>
                  <p className="text-[10px] font-black text-stone-400 uppercase tracking-widest">Sovereign Grade</p>
                  <p className="text-xl font-serif font-bold text-primary">أمان من الفئة الأولى</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="p-12 sm:p-20 rounded-[3rem] bg-primary text-white text-center space-y-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-full h-full opacity-10 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
          <h2 className="text-4xl font-serif font-bold relative z-10">هل لديك استفسار أمني؟</h2>
          <p className="text-stone-400 text-lg font-light max-w-2xl mx-auto relative z-10">
            فريق الأمن السيبراني لدينا جاهز للإجابة على كافة تساؤلاتك التقنية حول كيفية حماية بياناتك السيادية.
          </p>
          <Link to="/contact">
            <Button className="imperial-button imperial-button-primary h-16 px-12 text-lg relative z-10">
              تحدث مع خبير أمني
            </Button>
          </Link>
        </section>
      </main>

      <footer className="py-12 border-t border-stone-200 text-center">
        <p className="text-[10px] font-black text-stone-400 uppercase tracking-[0.3em]">
          © 2024 TASWYA SECURITY PROTOCOL • PROTECTING THE SOVEREIGNTY OF DATA
        </p>
      </footer>
    </div>
  );
}

function SecurityFeature({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
  return (
    <div className="imperial-card p-10 text-center space-y-6 group hover:border-accent transition-all duration-500">
      <div className="w-20 h-20 bg-stone-50 rounded-3xl flex items-center justify-center text-accent mx-auto group-hover:bg-accent group-hover:text-white transition-all shadow-lg">
        {icon}
      </div>
      <h3 className="text-2xl font-serif font-bold text-primary">{title}</h3>
      <p className="text-stone-500 text-sm leading-relaxed">{description}</p>
    </div>
  );
}
