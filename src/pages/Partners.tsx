import React from "react";
import { motion } from "motion/react";
import { Globe, ShieldCheck, ArrowLeft, Handshake, Building2, Scale, Crown, Zap } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/src/components/ui/button";
import { Badge } from "@/src/components/ui/badge";

const partners = [
  {
    name: "وزارة العدل السعودية",
    type: "شريك حكومي سيادي",
    description: "تكامل تقني وقانوني لضمان توافق التسويات مع الأنظمة القضائية في المملكة.",
    logo: <Scale className="w-12 h-12" />
  },
  {
    name: "الهيئة السعودية للمحامين",
    type: "شريك مهني",
    description: "توفير نخبة من المحامين المعتمدين كوسطاء في المنصة.",
    logo: <ShieldCheck className="w-12 h-12" />
  },
  {
    name: "دائرة الأراضي والأملاك - دبي",
    type: "شريك استراتيجي",
    description: "تنسيق مباشر لحل النزاعات العقارية في إمارة دبي.",
    logo: <Building2 className="w-12 h-12" />
  },
  {
    name: "مؤسسة التنظيم العقاري (RERA)",
    type: "شريك تنظيمي",
    description: "الالتزام بكافة المعايير واللوائح المنظمة للعلاقات الإيجارية.",
    logo: <Zap className="w-12 h-12" />
  }
];

export default function Partners() {
  return (
    <div className="min-h-screen bg-secondary flex flex-col font-sans selection:bg-accent selection:text-white" dir="rtl">
      <nav className="h-24 bg-white/80 backdrop-blur-xl border-b border-stone-200/50 sticky top-0 z-50 flex items-center justify-between px-6 sm:px-12">
        <Link to="/" className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
            <Handshake className="text-white w-6 h-6" />
          </div>
          <span className="font-serif font-bold text-xl text-primary">شركاء السيادة</span>
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
              Sovereign Ecosystem
            </Badge>
            <h1 className="text-5xl sm:text-7xl font-serif font-bold text-primary tracking-tighter">
              تحالفات <span className="text-accent italic">القوة</span> القانونية
            </h1>
            <p className="text-stone-500 text-xl font-light max-w-3xl mx-auto leading-relaxed mt-6">
              نحن نؤمن بأن العدالة الرقمية تتطلب تكاتفاً بين القطاعين العام والخاص. نفخر بشراكاتنا مع كبرى الجهات الحكومية والمهنية في المنطقة.
            </p>
          </motion.div>
        </header>

        <div className="grid md:grid-cols-2 gap-8 mb-40">
          {partners.map((partner, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="imperial-card p-10 flex items-start gap-8 group hover:border-accent transition-all duration-500"
            >
              <div className="w-20 h-20 bg-stone-50 rounded-3xl flex items-center justify-center text-accent group-hover:bg-accent group-hover:text-white transition-all shrink-0 shadow-lg">
                {partner.logo}
              </div>
              <div className="space-y-4">
                <Badge variant="outline" className="rounded-full border-stone-200 text-stone-400 text-[10px] font-black uppercase tracking-widest">{partner.type}</Badge>
                <h3 className="text-2xl font-serif font-bold text-primary">{partner.name}</h3>
                <p className="text-stone-500 text-sm leading-relaxed">{partner.description}</p>
              </div>
            </motion.div>
          ))}
        </div>

        <section className="p-12 sm:p-20 rounded-[3rem] bg-primary text-white relative overflow-hidden text-center">
          <div className="absolute top-0 right-0 w-full h-full opacity-10 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
          <div className="relative z-10 max-w-3xl mx-auto space-y-8">
            <Crown className="w-16 h-16 text-accent mx-auto" />
            <h2 className="text-4xl sm:text-5xl font-serif font-bold">كن شريكاً في الإمبراطورية</h2>
            <p className="text-stone-400 text-lg font-light leading-relaxed">
              إذا كنت تمثل جهة قانونية، عقارية، أو تقنية وترغب في الانضمام إلى منظومتنا السيادية، يسعدنا مناقشة سبل التعاون المشترك.
            </p>
            <Link to="/contact">
              <Button className="imperial-button imperial-button-primary h-16 px-12 text-lg">
                طلب شراكة استراتيجية
              </Button>
            </Link>
          </div>
        </section>
      </main>

      <footer className="py-12 border-t border-stone-200 text-center">
        <p className="text-[10px] font-black text-stone-400 uppercase tracking-[0.3em]">
          © 2024 TASWYA PARTNERSHIP NETWORK • THE SOVEREIGN ALLIANCE
        </p>
      </footer>
    </div>
  );
}
