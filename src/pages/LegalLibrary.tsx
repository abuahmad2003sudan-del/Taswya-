import React from "react";
import { motion } from "motion/react";
import { BookOpen, Search, Scale, Shield, Globe, ArrowLeft, Download, ExternalLink } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { Badge } from "@/src/components/ui/badge";

const laws = [
  {
    title: "نظام المعاملات المدنية السعودي",
    country: "السعودية",
    category: "قانون مدني",
    description: "الإطار التشريعي الشامل للمعاملات المدنية في المملكة العربية السعودية.",
    year: "2023",
  },
  {
    title: "قانون الإيجارات الإماراتي",
    country: "الإمارات",
    category: "قانون عقاري",
    description: "تنظيم العلاقة بين المؤجر والمستأجر في إمارة دبي وأبوظبي.",
    year: "2022",
  },
  {
    title: "قانون التحكيم السوداني",
    country: "السودان",
    category: "تحكيم",
    description: "القواعد المنظمة لإجراءات التحكيم والوساطة في جمهورية السودان.",
    year: "2016",
  },
  {
    title: "نظام المحاكم التجارية",
    country: "السعودية",
    category: "قانون تجاري",
    description: "الإجراءات والأنظمة الخاصة بالمنازعات التجارية في المملكة.",
    year: "2020",
  },
  {
    title: "قانون حماية البيانات الشخصية",
    country: "دولي",
    category: "خصوصية",
    description: "المعايير العالمية والمحلية لحماية بيانات المستخدمين الرقمية.",
    year: "2024",
  },
];

export default function LegalLibrary() {
  return (
    <div className="min-h-screen bg-secondary flex flex-col font-sans selection:bg-accent selection:text-white" dir="rtl">
      {/* Navigation */}
      <nav className="h-24 bg-white/80 backdrop-blur-xl border-b border-stone-200/50 sticky top-0 z-50 flex items-center justify-between px-6 sm:px-12">
        <Link to="/" className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
            <Scale className="text-white w-6 h-6" />
          </div>
          <span className="font-serif font-bold text-xl text-primary">المكتبة القانونية</span>
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
              Sovereign Knowledge Base
            </Badge>
            <h1 className="text-5xl sm:text-7xl font-serif font-bold text-primary tracking-tighter">
              الأرشيف <span className="text-accent italic">القانوني</span> السيادي
            </h1>
            <p className="text-stone-500 text-xl font-light max-w-3xl mx-auto leading-relaxed mt-6">
              موسوعة شاملة للأنظمة والقوانين واللوائح المنظمة للقطاع العقاري والتجاري في الوطن العربي، محدثة وفقاً لآخر التعديلات السيادية.
            </p>
          </motion.div>

          <div className="max-w-2xl mx-auto relative mt-12">
            <Search className="absolute right-6 top-1/2 -translate-y-1/2 text-stone-400 w-5 h-5" />
            <Input 
              placeholder="ابحث عن نظام، مادة، أو لائحة قانونية..." 
              className="h-16 pr-14 rounded-2xl border-stone-200 bg-white shadow-xl shadow-stone-200/50 text-lg"
            />
          </div>
        </header>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {laws.map((law, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="imperial-card p-8 group hover:border-accent transition-all duration-500"
            >
              <div className="flex items-center justify-between mb-6">
                <div className="w-12 h-12 bg-stone-100 rounded-xl flex items-center justify-center text-accent group-hover:bg-accent group-hover:text-white transition-all">
                  <BookOpen className="w-6 h-6" />
                </div>
                <Badge variant="outline" className="rounded-full border-stone-200 text-stone-400 text-[10px] font-black uppercase tracking-widest">
                  {law.year}
                </Badge>
              </div>
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Globe className="w-3 h-3 text-stone-400" />
                  <span className="text-[10px] font-black text-stone-400 uppercase tracking-widest">{law.country} • {law.category}</span>
                </div>
                <h3 className="text-2xl font-serif font-bold text-primary group-hover:text-accent transition-colors">{law.title}</h3>
                <p className="text-stone-500 text-sm leading-relaxed line-clamp-3">{law.description}</p>
              </div>
              <div className="pt-8 mt-8 border-t border-stone-100 flex items-center justify-between">
                <Button variant="ghost" className="text-accent hover:text-accent hover:bg-accent/5 gap-2 text-xs font-bold">
                  <Download className="w-4 h-4" />
                  تحميل PDF
                </Button>
                <Button variant="ghost" className="text-stone-400 hover:text-primary gap-2 text-xs font-bold">
                  <ExternalLink className="w-4 h-4" />
                  المصدر الرسمي
                </Button>
              </div>
            </motion.div>
          ))}
        </div>

        <section className="mt-40 p-12 sm:p-20 rounded-[3rem] bg-primary text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-full h-full opacity-10 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
          <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-12">
            <div className="max-w-2xl space-y-6">
              <h2 className="text-4xl sm:text-5xl font-serif font-bold">هل تحتاج إلى استشارة قانونية مخصصة؟</h2>
              <p className="text-stone-400 text-lg font-light leading-relaxed">
                فريقنا من المستشارين والوسطاء المعتمدين جاهز لتقديم الدعم القانوني اللازم لنزاعك الخاص بناءً على هذه الأنظمة.
              </p>
              <Link to="/register">
                <Button className="imperial-button imperial-button-primary h-16 px-12 text-lg mt-4">
                  ابدأ تسوية نزاعك الآن
                </Button>
              </Link>
            </div>
            <div className="w-48 h-48 bg-white/10 rounded-full flex items-center justify-center backdrop-blur-xl border border-white/20">
              <Shield className="w-24 h-24 text-accent animate-pulse" />
            </div>
          </div>
        </section>
      </main>

      <footer className="py-12 border-t border-stone-200 text-center">
        <p className="text-[10px] font-black text-stone-400 uppercase tracking-[0.3em]">
          © 2024 TASWYA SOVEREIGN LEGAL ARCHIVE • ALL RIGHTS RESERVED
        </p>
      </footer>
    </div>
  );
}
