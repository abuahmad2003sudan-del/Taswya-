import React from "react";
import { motion } from "motion/react";
import { Newspaper, Calendar, ArrowLeft, ArrowRight, Share2, Bookmark, Zap, Crown } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/src/components/ui/button";
import { Badge } from "@/src/components/ui/badge";

const articles = [
  {
    title: "إطلاق بروتوكول 'سيادة' الجديد لتسوية النزاعات العقارية الرقمية",
    date: "13 أبريل 2024",
    category: "تحديثات المنصة",
    image: "https://picsum.photos/seed/news1/800/500",
    excerpt: "أعلنت منصة تسوية اليوم عن إطلاق أحدث بروتوكولاتها التقنية الذي يعتمد على الذكاء الاصطناعي في تحليل الأدلة القانونية وتسريع عملية الوساطة بنسبة 40%."
  },
  {
    title: "شراكة استراتيجية مع الهيئة السعودية للمحامين لتعزيز الوساطة الرقمية",
    date: "10 أبريل 2024",
    category: "شراكات",
    image: "https://picsum.photos/seed/news2/800/500",
    excerpt: "في خطوة تهدف لتعزيز الثقة في الحلول البديلة للنزاعات، وقعت تسوية مذكرة تفاهم تتيح للمحامين المعتمدين الانضمام لشبكة وسطاء المنصة."
  },
  {
    title: "تقرير: زيادة بنسبة 25% في اللجوء للوساطة الرقمية في منطقة الخليج",
    date: "5 أبريل 2024",
    category: "تقارير السوق",
    image: "https://picsum.photos/seed/news3/800/500",
    excerpt: "كشف التقرير الربع سنوي للمنصة عن تحول ملحوظ في سلوك المستثمرين العقاريين نحو الحلول الرقمية السريعة بدلاً من التقاضي التقليدي الطويل."
  }
];

export default function News() {
  return (
    <div className="min-h-screen bg-secondary flex flex-col font-sans selection:bg-accent selection:text-white" dir="rtl">
      <nav className="h-24 bg-white/80 backdrop-blur-xl border-b border-stone-200/50 sticky top-0 z-50 flex items-center justify-between px-6 sm:px-12">
        <Link to="/" className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
            <Newspaper className="text-white w-6 h-6" />
          </div>
          <span className="font-serif font-bold text-xl text-primary">أخبار الإمبراطورية</span>
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
              Imperial Updates
            </Badge>
            <h1 className="text-5xl sm:text-7xl font-serif font-bold text-primary tracking-tighter">
              نبض <span className="text-accent italic">القانون</span> الرقمي
            </h1>
            <p className="text-stone-500 text-xl font-light max-w-3xl mx-auto leading-relaxed mt-6">
              تابع آخر التطورات في عالم التقنية القانونية، تحديثات المنصة، وأخبار القطاع العقاري والتشريعي في المنطقة.
            </p>
          </motion.div>
        </header>

        <div className="grid lg:grid-cols-12 gap-12">
          {/* Featured Article */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="lg:col-span-8 imperial-card overflow-hidden group"
          >
            <div className="aspect-[21/9] overflow-hidden relative">
              <img src={articles[0].image} alt={articles[0].title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000" referrerPolicy="no-referrer" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              <div className="absolute bottom-8 right-8 left-8 text-white space-y-4">
                <Badge className="bg-accent text-white border-none px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">خبر عاجل</Badge>
                <h2 className="text-3xl sm:text-5xl font-serif font-bold leading-tight">{articles[0].title}</h2>
                <div className="flex items-center gap-6 text-stone-300 text-xs font-bold">
                  <span className="flex items-center gap-2"><Calendar className="w-4 h-4" /> {articles[0].date}</span>
                  <span className="flex items-center gap-2"><Zap className="w-4 h-4" /> {articles[0].category}</span>
                </div>
              </div>
            </div>
            <div className="p-8 flex items-center justify-between">
              <p className="text-stone-500 text-lg font-light max-w-2xl">{articles[0].excerpt}</p>
              <Button className="imperial-button imperial-button-primary h-14 px-8">اقرأ المزيد</Button>
            </div>
          </motion.div>

          {/* Sidebar News */}
          <div className="lg:col-span-4 space-y-8">
            <h3 className="text-xl font-serif font-bold text-primary border-b border-stone-200 pb-4">الأكثر قراءة</h3>
            {articles.slice(1).map((article, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="flex gap-6 group cursor-pointer"
              >
                <div className="w-24 h-24 rounded-2xl overflow-hidden shrink-0">
                  <img src={article.image} alt={article.title} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all" referrerPolicy="no-referrer" />
                </div>
                <div className="space-y-2">
                  <p className="text-[10px] font-black text-accent uppercase tracking-widest">{article.category}</p>
                  <h4 className="text-sm font-serif font-bold text-primary group-hover:text-accent transition-colors leading-snug">{article.title}</h4>
                  <p className="text-[9px] text-stone-400 font-bold">{article.date}</p>
                </div>
              </motion.div>
            ))}
            
            <div className="p-8 rounded-[2rem] bg-accent text-white space-y-4 relative overflow-hidden">
              <Crown className="absolute -bottom-4 -left-4 w-24 h-24 opacity-20" />
              <h4 className="text-xl font-serif font-bold">النشرة السيادية</h4>
              <p className="text-xs opacity-80 leading-relaxed">اشترك لتصلك آخر التحديثات القانونية والفرص الاستثمارية مباشرة إلى بريدك.</p>
              <div className="flex gap-2">
                <input placeholder="بريدك الإلكتروني" className="flex-1 bg-white/10 border border-white/20 rounded-xl px-4 text-xs outline-none focus:bg-white/20 transition-all" />
                <Button className="bg-white text-accent hover:bg-stone-100 rounded-xl px-4 text-xs font-bold">اشترك</Button>
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer className="py-12 border-t border-stone-200 text-center">
        <p className="text-[10px] font-black text-stone-400 uppercase tracking-[0.3em]">
          © 2024 TASWYA NEWS NETWORK • SOVEREIGN INFORMATION HUB
        </p>
      </footer>
    </div>
  );
}
