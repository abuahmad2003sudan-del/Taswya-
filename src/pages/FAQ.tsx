import React from "react";
import { motion } from "motion/react";
import { Logo } from "@/src/components/Logo";
import { Link } from "react-router-dom";
import { ChevronDown, HelpCircle, MessageCircle, ShieldCheck } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/src/components/ui/accordion";
import { HorizontalAd } from "@/src/components/GoogleAd";

const faqs = [
  {
    question: "ما هي منصة تسوية؟",
    answer: "تسوية هي منصة رقمية سيادية متخصصة في حل النزاعات العقارية بين الملاك والمستأجرين في الوطن العربي باستخدام تقنيات الذكاء الاصطناعي والوساطة القانونية المتخصصة."
  },
  {
    question: "هل المنصة قانونية ومعترف بها؟",
    answer: "نعم، تعمل المنصة كجهة وساطة وتحكيم رقمي، وتعتمد حلولها على القوانين العقارية المعمول بها في كل دولة عربية، مما يضمن صبغة قانونية لاتفاقيات الصلح."
  },
  {
    question: "كم تستغرق عملية حل النزاع؟",
    answer: "نهدف إلى حل النزاعات في وقت قياسي يتراوح بين 48 إلى 72 ساعة، مقارنة بالشهور التي قد تستغرقها المحاكم التقليدية."
  },
  {
    question: "ما هي تكلفة الخدمة؟",
    answer: "نقدم باقات متنوعة تبدأ من خدمات مجانية للمستأجرين، وصولاً إلى باقات سيادية للملاك وكبار المستثمرين تضمن سرعة التنفيذ والخصوصية المطلقة."
  },
  {
    question: "كيف يتم حماية بياناتي؟",
    answer: "نستخدم بروتوكولات تشفير عسكرية (AES-256) لضمان أن جميع المستندات والمحادثات بين الأطراف تظل سرية تماماً ولا يمكن الوصول إليها إلا من قبل الأطراف المعنية."
  }
];

export default function FAQ() {
  return (
    <div className="min-h-screen bg-stone-50 font-sans" dir="rtl">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-xl border-b border-stone-200">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <Link to="/">
            <Logo size="md" />
          </Link>
          <Link to="/register">
            <button className="imperial-button imperial-button-primary px-8 py-3 text-xs">ابدأ الآن</button>
          </Link>
        </div>
      </nav>

      <main className="pt-32 pb-20 px-6">
        <div className="max-w-4xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 border border-accent/20 mb-6">
              <HelpCircle className="w-4 h-4 text-accent" />
              <span className="text-[10px] font-black text-accent uppercase tracking-widest">الأسئلة الشائعة</span>
            </div>
            <h1 className="text-3xl sm:text-4xl sm:text-6xl font-serif font-bold text-primary mb-6">كيف يمكننا <span className="text-accent italic">مساعدتك؟</span></h1>
            <p className="text-stone-500 text-lg font-light">كل ما تحتاج معرفته عن إمبراطورية تسوية في مكان واحد.</p>
          </motion.div>

          <HorizontalAd className="mb-16" />

          <div className="imperial-card p-8 sm:p-12">
            <Accordion type="single" collapsible className="w-full space-y-4">
              {faqs.map((faq, index) => (
                <AccordionItem key={index} value={`item-${index}`} className="border-stone-100">
                  <AccordionTrigger className="text-right font-serif font-bold text-xl text-primary hover:text-accent transition-colors py-6">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-stone-500 text-lg leading-relaxed font-light pb-6">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>

          <div className="mt-20 grid sm:grid-cols-2 gap-8">
            <div className="imperial-card p-10 text-center space-y-6 group hover:border-accent transition-all">
              <div className="w-16 h-16 bg-stone-50 rounded-2xl flex items-center justify-center mx-auto text-stone-400 group-hover:bg-accent group-hover:text-white transition-all">
                <MessageCircle className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-serif font-bold text-primary">تحدث مع خبير</h3>
              <p className="text-stone-500 font-light">هل لديك سؤال محدد؟ فريقنا من الخبراء القانونيين جاهز للرد عليك.</p>
              <button className="text-accent font-black text-xs uppercase tracking-widest hover:underline">تواصل معنا الآن</button>
            </div>
            <div className="imperial-card p-10 text-center space-y-6 group hover:border-accent transition-all">
              <div className="w-16 h-16 bg-stone-50 rounded-2xl flex items-center justify-center mx-auto text-stone-400 group-hover:bg-accent group-hover:text-white transition-all">
                <ShieldCheck className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-serif font-bold text-primary">مركز الأمان</h3>
              <p className="text-stone-500 font-light">تعرف على كيفية حمايتنا لبياناتك وسيادة خصوصيتك الرقمية.</p>
              <button className="text-accent font-black text-xs uppercase tracking-widest hover:underline">عرض سياسة الأمان</button>
            </div>
          </div>
        </div>
      </main>

      <footer className="bg-primary text-white py-10 text-center">
        <p className="text-[10px] font-black uppercase tracking-[0.3em] opacity-50">© MMXXIV TASWYA IMPERIAL. ALL RIGHTS RESERVED.</p>
      </footer>
    </div>
  );
}
