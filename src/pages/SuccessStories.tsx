import React from "react";
import { motion } from "motion/react";
import { Star, Quote, ArrowLeft, CheckCircle, Users, TrendingUp, Award, Zap, Clock } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/src/components/ui/button";
import { Badge } from "@/src/components/ui/badge";

const stories = [
  {
    title: "نزاع برج النخبة - دبي",
    category: "نزاع تجاري عقاري",
    result: "تمت التسوية خلال 72 ساعة",
    description: "نزاع بين شركة تطوير عقاري ومستثمر حول تأخير تسليم وحدات فندقية. تم التوصل لاتفاق يرضي الطرفين دون اللجوء للمحاكم.",
    impact: "توفير 250,000 درهم مصاريف قضائية",
    image: "https://picsum.photos/seed/dubai/800/600",
  },
  {
    title: "مجمع الملقا السكني - الرياض",
    category: "نزاع إيجاري",
    result: "استعادة حقوق متأخرة",
    description: "قضية تأخر دفع إيجارات لمجمع سكني كامل. نجح وسيطنا في جدولة المديونية وضمان استمرار العلاقة الإيجارية.",
    impact: "تحصيل 1.2 مليون ريال سعودي",
    image: "https://picsum.photos/seed/riyadh/800/600",
  },
  {
    title: "أزمة الصيانة - القاهرة الجديدة",
    category: "صيانة وتشغيل",
    result: "إصلاح فوري وتعويض",
    description: "نزاع حول أضرار جسيمة ناتجة عن تسريبات مياه. تم إلزام المالك بالإصلاح الفوري وتعويض المستأجر عن فترة التعطل.",
    impact: "حل أزمة استمرت 6 أشهر في أسبوع واحد",
    image: "https://picsum.photos/seed/cairo/800/600",
  },
];

export default function SuccessStories() {
  return (
    <div className="min-h-screen bg-secondary flex flex-col font-sans selection:bg-accent selection:text-white" dir="rtl">
      <nav className="h-24 bg-white/80 backdrop-blur-xl border-b border-stone-200/50 sticky top-0 z-50 flex items-center justify-between px-6 sm:px-12">
        <Link to="/" className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
            <Award className="text-white w-6 h-6" />
          </div>
          <span className="font-serif font-bold text-xl text-primary">قصص النجاح</span>
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
              Proven Results
            </Badge>
            <h1 className="text-5xl sm:text-7xl font-serif font-bold text-primary tracking-tighter">
              سجل <span className="text-accent italic">الانتصارات</span> القانونية
            </h1>
            <p className="text-stone-500 text-xl font-light max-w-3xl mx-auto leading-relaxed mt-6">
              نحن لا نعد بالنتائج، نحن نحققها. استعرض كيف ساعدت منصة "تسوية" مئات الأطراف في الوصول لحلول عادلة وسريعة بعيداً عن تعقيدات المحاكم التقليدية.
            </p>
          </motion.div>
        </header>

        <div className="grid lg:grid-cols-3 gap-12">
          {stories.map((story, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="imperial-card overflow-hidden group"
            >
              <div className="aspect-video overflow-hidden relative">
                <img 
                  src={story.image} 
                  alt={story.title} 
                  className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-1000 group-hover:scale-110"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute top-4 right-4">
                  <Badge className="bg-emerald-500 text-white border-none px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">
                    {story.result}
                  </Badge>
                </div>
              </div>
              <div className="p-8 space-y-6">
                <div className="space-y-2">
                  <p className="text-[10px] font-black text-accent uppercase tracking-widest">{story.category}</p>
                  <h3 className="text-2xl font-serif font-bold text-primary">{story.title}</h3>
                </div>
                <p className="text-stone-500 text-sm leading-relaxed">{story.description}</p>
                <div className="p-4 bg-stone-50 rounded-2xl border border-stone-100 flex items-center gap-4">
                  <TrendingUp className="w-5 h-5 text-emerald-500" />
                  <span className="text-xs font-bold text-primary">{story.impact}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <section className="mt-40 grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          <StatCard icon={<CheckCircle className="w-6 h-6" />} value="94%" label="نسبة نجاح التسويات" />
          <StatCard icon={<Clock className="w-6 h-6" />} value="4.2 يوم" label="متوسط وقت الحل" />
          <StatCard icon={<Users className="w-6 h-6" />} value="+15,000" label="مستفيد نشط" />
          <StatCard icon={<Zap className="w-6 h-6" />} value="85%" label="توفير في التكاليف" />
        </section>

        <section className="mt-40 text-center space-y-12">
          <div className="max-w-3xl mx-auto">
            <Quote className="w-16 h-16 text-accent/20 mx-auto mb-8" />
            <h2 className="text-4xl font-serif font-bold text-primary mb-8">"تسوية لم تكن مجرد منصة، بل كانت طوق نجاة لاستثماراتنا في وقت حرج جداً."</h2>
            <div className="flex items-center justify-center gap-4">
              <div className="w-16 h-16 rounded-full bg-stone-200 overflow-hidden">
                <img src="https://picsum.photos/seed/user1/100/100" alt="User" referrerPolicy="no-referrer" />
              </div>
              <div className="text-right">
                <p className="font-serif font-bold text-primary">د. فهد السبيعي</p>
                <p className="text-xs text-stone-400 font-bold uppercase tracking-widest">مستثمر عقاري - الرياض</p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="py-12 border-t border-stone-200 text-center">
        <p className="text-[10px] font-black text-stone-400 uppercase tracking-[0.3em]">
          © 2024 TASWYA SUCCESS RECORDS • THE SOVEREIGN STANDARD
        </p>
      </footer>
    </div>
  );
}

function StatCard({ icon, value, label }: { icon: React.ReactNode, value: string, label: string }) {
  return (
    <div className="imperial-card p-8 text-center space-y-4">
      <div className="w-12 h-12 bg-stone-50 rounded-2xl flex items-center justify-center text-accent mx-auto">
        {icon}
      </div>
      <h4 className="text-4xl font-serif font-bold text-primary tracking-tighter">{value}</h4>
      <p className="text-[10px] font-black text-stone-400 uppercase tracking-widest">{label}</p>
    </div>
  );
}
