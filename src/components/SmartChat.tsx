import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Send, Bot, User, ShieldCheck, Zap } from 'lucide-react';
import { Button } from '@/src/components/ui/button';

interface Message {
  role: 'user' | 'bot';
  content: string;
}

const KNOWLEDGE_BASE: Record<string, string> = {
  "من أنتم": "نحن منصة 'تسوية'، المنظومة الرقمية السيادية الأولى في الوطن العربي لحل النزاعات العقارية والإيجارية بعيداً عن تعقيدات المحاكم التقليدية. نجمع بين هيبة القانون وسرعة التقنية.",
  "who are you": "We are 'Taswya', the first sovereign digital platform in the Arab world for resolving real estate and rental disputes. We combine legal prestige with technological speed.",
  "كيف تعمل المنصة": "تعمل المنصة عبر 3 خطوات سيادية: 1. تسجيل النزاع وتوثيق البيانات. 2. اختيار وسيط أو محكم معتمد من نخبتنا. 3. جلسة وساطة رقمية تنتهي بقرار ملزم وموثق.",
  "how it works": "The platform works in 3 sovereign steps: 1. Register the dispute. 2. Choose a certified mediator from our elite. 3. A digital session ending with a binding, certified decision.",
  "هل أنتم معتمدون": "نعم، نحن معتمدون رسمياً ونعمل وفق المعايير الدولية للتحكيم الرقمي، مع شراكات استراتيجية تضمن تنفيذ القرارات في السودان، السعودية، ومصر.",
  "are you certified": "Yes, we are officially certified and operate according to international digital arbitration standards, with strategic partnerships in Sudan, KSA, and Egypt.",
  "ما هي التكلفة": "تبدأ رسومنا من 500 للمنازعات البسيطة. لدينا نظام تسعير شفاف يضمن العدالة للجميع. يمكنك مراجعة صفحة 'رسوم الخدمة' للتفاصيل الدقيقة.",
  "cost": "Our fees start from 500 for simple disputes. We have a transparent pricing system. Check our 'Pricing' page for details.",
  "الأمان": "نستخدم تشفير 256-بت وتقنيات حماية سيادية لضمان سرية بيانات النخبة من عملائنا. بياناتك في حصن رقمي منيع.",
  "security": "We use 256-bit encryption and sovereign protection technologies to ensure the confidentiality of our elite clients' data.",
  "المدة": "تستغرق معظم التسويات لدينا أقل من 7 أيام عمل، مقارنة بالسنوات في المحاكم التقليدية.",
  "duration": "Most settlements take less than 7 business days, compared to years in traditional courts."
};

const QUICK_REPLIES = [
  { ar: "من أنتم؟", en: "Who are you?" },
  { ar: "كيف تعمل؟", en: "How it works?" },
  { ar: "ما هي التكلفة؟", en: "What is the cost?" },
  { ar: "هل الخدمة آمنة؟", en: "Is it secure?" }
];

export function SmartChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: 'bot', content: 'مرحباً بك في حصن تسوية الرقمي. أنا مساعدك الذكي، كيف يمكنني خدمتك اليوم؟' }
  ]);
  const [input, setInput] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = () => {
    if (!input.trim()) return;

    const userMsg = input.trim();
    setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setInput('');

    // Simple Smart Logic
    setTimeout(() => {
      let botResponse = "عذراً، لم أفهم استفسارك تماماً. يمكنك التواصل مع فريق الدعم السيادي مباشرة عبر صفحة 'اتصل بنا' لمزيد من التفاصيل.";
      
      const lowerMsg = userMsg.toLowerCase();
      for (const [key, value] of Object.entries(KNOWLEDGE_BASE)) {
        if (lowerMsg.includes(key.toLowerCase())) {
          botResponse = value;
          break;
        }
      }

      setMessages(prev => [...prev, { role: 'bot', content: botResponse }]);
    }, 600);
  };

  return (
    <div className="fixed bottom-8 right-8 z-[100] font-sans">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            className="mb-4 w-[350px] sm:w-[400px] h-[500px] bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-[2rem] shadow-2xl flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="p-6 bg-primary text-white flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-accent rounded-xl flex items-center justify-center">
                  <Bot className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h4 className="font-serif font-bold text-sm">مساعد تسوية الذكي</h4>
                  <p className="text-[10px] text-stone-400 uppercase tracking-widest">Sovereign AI Support</p>
                </div>
              </div>
              <button onClick={() => setIsOpen(false)} className="hover:rotate-90 transition-transform">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Messages */}
            <div ref={scrollRef} className="flex-1 p-6 overflow-y-auto space-y-4 bg-stone-50 dark:bg-stone-950/50">
              {messages.map((msg, i) => (
                <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] p-4 rounded-2xl text-sm leading-relaxed ${
                    msg.role === 'user' 
                      ? 'bg-accent text-white rounded-tr-none' 
                      : 'bg-white dark:bg-stone-800 text-primary dark:text-white border border-stone-200 dark:border-stone-700 rounded-tl-none shadow-sm'
                  }`}>
                    {msg.content}
                  </div>
                </div>
              ))}
              
              {messages.length === 1 && (
                <div className="flex flex-wrap gap-2 mt-4">
                  {QUICK_REPLIES.map((reply, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        setInput(document.documentElement.dir === 'rtl' ? reply.ar : reply.en);
                        handleSend();
                      }}
                      className="text-[10px] font-black uppercase tracking-widest px-3 py-2 bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-full text-stone-500 hover:border-accent hover:text-accent transition-all"
                    >
                      {document.documentElement.dir === 'rtl' ? reply.ar : reply.en}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Input */}
            <div className="p-4 border-t border-stone-100 dark:border-stone-800 bg-white dark:bg-stone-900 flex gap-2">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="اكتب استفسارك هنا..."
                className="flex-1 bg-stone-100 dark:bg-stone-800 border-none rounded-xl px-4 text-sm outline-none focus:ring-2 focus:ring-accent/20 transition-all"
              />
              <Button onClick={handleSend} className="bg-accent hover:bg-accent/90 text-white rounded-xl w-12 h-12 p-0">
                <Send className="w-5 h-5" />
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(!isOpen)}
        className="w-16 h-16 bg-accent text-white rounded-2xl shadow-2xl flex items-center justify-center relative group overflow-hidden"
      >
        <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
        {isOpen ? <X className="w-8 h-8 relative z-10" /> : <MessageCircle className="w-8 h-8 relative z-10" />}
      </motion.button>
    </div>
  );
}
