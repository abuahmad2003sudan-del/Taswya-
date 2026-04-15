import React from "react";
import { motion } from "motion/react";
import { Briefcase, Users, ArrowLeft, Star, Heart, Zap, Shield, Crown, MapPin } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/src/components/ui/button";
import { Badge } from "@/src/components/ui/badge";

const jobs = [
  {
    title: "وسيط قانوني أول",
    department: "إدارة النزاعات",
    location: "الرياض / دبي",
    type: "دوام كامل",
    description: "نبحث عن خبراء قانونيين بخبرة لا تقل عن 10 سنوات في التحكيم والوساطة العقارية."
  },
  {
    title: "مهندس برمجيات (Full Stack)",
    department: "التقنية والابتكار",
    location: "عن بعد / القاهرة",
    type: "دوام كامل",
    description: "تطوير وصيانة البنية التحتية السيادية للمنصة باستخدام أحدث التقنيات الرقمية."
  },
  {
    title: "مدير علاقات كبار العملاء",
    department: "المبيعات السيادية",
    location: "جدة / أبوظبي",
    type: "دوام كامل",
    description: "إدارة العلاقات مع كبار الملاك والشركات العقارية الكبرى في المنطقة."
  }
];

export default function Careers() {
  return (
    <div className="min-h-screen bg-secondary flex flex-col font-sans selection:bg-accent selection:text-white" dir="rtl">
      <nav className="h-24 bg-white/80 backdrop-blur-xl border-b border-stone-200/50 sticky top-0 z-50 flex items-center justify-between px-6 sm:px-12">
        <Link to="/" className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
            <Briefcase className="text-white w-6 h-6" />
          </div>
          <span className="font-serif font-bold text-xl text-primary">انضم للنخبة</span>
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
              Join the Empire
            </Badge>
            <h1 className="text-5xl sm:text-7xl font-serif font-bold text-primary tracking-tighter">
              اصنع <span className="text-accent italic">مستقبلك</span> السيادي
            </h1>
            <p className="text-stone-500 text-xl font-light max-w-3xl mx-auto leading-relaxed mt-6">
              نحن لا نبحث عن موظفين، بل نبحث عن شركاء في بناء أقوى منظومة قانونية رقمية في العالم العربي. إذا كنت تمتلك الشغف والتميز، مكانك هنا.
            </p>
          </motion.div>
        </header>

        <div className="grid lg:grid-cols-3 gap-8 mb-40">
          <ValueCard icon={<Star className="w-6 h-6" />} title="ثقافة التميز" description="نحن نقدّر الإبداع والنتائج الاستثنائية فوق كل شيء." />
          <ValueCard icon={<Heart className="w-6 h-6" />} title="بيئة داعمة" description="نؤمن بالتوازن بين العمل والحياة والنمو المستمر لفريقنا." />
          <ValueCard icon={<Zap className="w-6 h-6" />} title="تقنيات متطورة" description="ستعمل مع أحدث أدوات الذكاء الاصطناعي والحلول الرقمية." />
        </div>

        <h2 className="text-3xl font-serif font-bold text-primary mb-12 border-b border-stone-200 pb-6">الفرص المتاحة حالياً</h2>
        <div className="space-y-6">
          {jobs.map((job, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="imperial-card p-8 flex flex-col md:flex-row items-center justify-between gap-8 group hover:border-accent transition-all duration-500"
            >
              <div className="space-y-4 text-center md:text-right">
                <div className="flex flex-wrap items-center justify-center md:justify-start gap-3">
                  <Badge variant="outline" className="rounded-full border-stone-200 text-stone-400 text-[10px] font-black uppercase tracking-widest">{job.department}</Badge>
                  <span className="flex items-center gap-1 text-[10px] font-black text-stone-400 uppercase tracking-widest"><MapPin className="w-3 h-3" /> {job.location}</span>
                </div>
                <h3 className="text-2xl font-serif font-bold text-primary group-hover:text-accent transition-colors">{job.title}</h3>
                <p className="text-stone-500 text-sm max-w-xl">{job.description}</p>
              </div>
              <Button className="imperial-button imperial-button-primary h-14 px-10 shrink-0">قدم الآن</Button>
            </motion.div>
          ))}
        </div>

        <section className="mt-40 p-12 sm:p-20 rounded-[3rem] bg-primary text-white relative overflow-hidden text-center">
          <div className="absolute top-0 right-0 w-full h-full opacity-10 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
          <div className="relative z-10 max-w-2xl mx-auto space-y-8">
            <Crown className="w-16 h-16 text-accent mx-auto" />
            <h2 className="text-4xl sm:text-5xl font-serif font-bold">لم تجد ما يناسبك؟</h2>
            <p className="text-stone-400 text-lg font-light leading-relaxed">
              أرسل لنا سيرتك الذاتية ومجال تميزك، وسنتواصل معك عندما تتوفر فرصة تليق بقدراتك السيادية.
            </p>
            <Button variant="outline" className="h-16 px-12 rounded-full border-white/20 text-white font-bold text-lg hover:bg-white/10 transition-all">
              تقديم طلب عام
            </Button>
          </div>
        </section>
      </main>

      <footer className="py-12 border-t border-stone-200 text-center">
        <p className="text-[10px] font-black text-stone-400 uppercase tracking-[0.3em]">
          © 2024 TASWYA CAREERS • BUILD YOUR LEGACY WITH US
        </p>
      </footer>
    </div>
  );
}

function ValueCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
  return (
    <div className="imperial-card p-8 text-center space-y-4">
      <div className="w-12 h-12 bg-stone-50 rounded-2xl flex items-center justify-center text-accent mx-auto">
        {icon}
      </div>
      <h4 className="text-xl font-serif font-bold text-primary">{title}</h4>
      <p className="text-stone-500 text-sm leading-relaxed">{description}</p>
    </div>
  );
}
