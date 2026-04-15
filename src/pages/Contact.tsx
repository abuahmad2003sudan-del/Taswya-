import React, { useState } from "react";
import { motion } from "motion/react";
import { Logo } from "@/src/components/Logo";
import { Link } from "react-router-dom";
import { Mail, Phone, MapPin, Send, MessageSquare, Globe } from "lucide-react";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { Textarea } from "@/src/components/ui/textarea";
import { Label } from "@/src/components/ui/label";
import { toast } from "sonner";
import { SquareAd } from "@/src/components/GoogleAd";

export default function Contact() {
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      toast.success("تم إرسال رسالتك بنجاح. سيتواصل معك فريق النخبة قريباً.");
      setLoading(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-stone-50 font-sans" dir="rtl">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-xl border-b border-stone-200">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <Link to="/">
            <Logo size="md" />
          </Link>
          <div className="flex gap-6">
            <Link to="/faq" className="text-xs font-black text-stone-400 uppercase tracking-widest hover:text-primary transition-colors">الأسئلة الشائعة</Link>
          </div>
        </div>
      </nav>

      <main className="pt-32 pb-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-12 gap-16">
            {/* Contact Info */}
            <div className="lg:col-span-5 space-y-12">
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
              >
                <h1 className="text-3xl sm:text-5xl font-serif font-bold text-primary mb-6">تواصل مع <br /><span className="text-accent italic">الإمبراطورية</span></h1>
                <p className="text-stone-500 text-lg font-light leading-relaxed">
                  نحن هنا لخدمتكم في كافة أنحاء الوطن العربي. سواء كنت في الرياض، دبي، القاهرة، أو الدار البيضاء، فريقنا جاهز لتقديم الدعم السيادي.
                </p>
              </motion.div>

              <div className="space-y-8">
                <ContactItem 
                  icon={<Mail className="w-6 h-6" />}
                  title="البريد الإلكتروني"
                  value="concierge@taswya.com"
                  description="للطلبات الرسمية والاستشارات الخاصة"
                />
                <ContactItem 
                  icon={<Phone className="w-6 h-6" />}
                  title="الخط الساخن"
                  value="+971 4 000 0000"
                  description="متاح على مدار الساعة لنخبة الملاك"
                />
                <ContactItem 
                  icon={<Globe className="w-6 h-6" />}
                  title="المكاتب الإقليمية"
                  value="دبي • الرياض • القاهرة"
                  description="تغطية شاملة للشرق الأوسط وشمال أفريقيا"
                />
              </div>

              <div className="pt-10">
                <SquareAd label="Sovereign Support" />
              </div>
            </div>

            {/* Contact Form */}
            <div className="lg:col-span-7">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="imperial-card p-10 sm:p-16"
              >
                <h2 className="text-3xl font-serif font-bold text-primary mb-10">أرسل رسالة فورية</h2>
                <form onSubmit={handleSubmit} className="space-y-8">
                  <div className="grid sm:grid-cols-2 gap-8">
                    <div className="space-y-3">
                      <Label className="text-[10px] font-black uppercase tracking-widest text-stone-400">الاسم الكامل</Label>
                      <Input placeholder="أحمد الإدريسي" className="h-14 rounded-2xl bg-stone-50 border-stone-100 focus:bg-white transition-all" required />
                    </div>
                    <div className="space-y-3">
                      <Label className="text-[10px] font-black uppercase tracking-widest text-stone-400">البريد الإلكتروني</Label>
                      <Input type="email" placeholder="example@mail.com" className="h-14 rounded-2xl bg-stone-50 border-stone-100 focus:bg-white transition-all" required />
                    </div>
                  </div>
                  <div className="space-y-3">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-stone-400">الموضوع</Label>
                    <Input placeholder="نزاع عقاري في دبي" className="h-14 rounded-2xl bg-stone-50 border-stone-100 focus:bg-white transition-all" required />
                  </div>
                  <div className="space-y-3">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-stone-400">الرسالة</Label>
                    <Textarea placeholder="اشرح لنا كيف يمكننا مساعدتك..." className="min-h-[200px] rounded-2xl bg-stone-50 border-stone-100 focus:bg-white transition-all p-6" required />
                  </div>
                  <Button type="submit" className="imperial-button imperial-button-primary w-full h-16 text-lg" disabled={loading}>
                    {loading ? "جاري الإرسال..." : "إرسال الطلب السيادي"}
                    <Send className="mr-3 w-5 h-5" />
                  </Button>
                </form>
              </motion.div>
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

function ContactItem({ icon, title, value, description }: { icon: React.ReactNode, title: string, value: string, description: string }) {
  return (
    <div className="flex gap-6 group">
      <div className="w-14 h-14 rounded-2xl bg-white border border-stone-200 flex items-center justify-center text-stone-400 group-hover:bg-accent group-hover:text-white transition-all duration-500 shadow-lg shadow-stone-100">
        {icon}
      </div>
      <div>
        <h3 className="text-sm font-black text-stone-400 uppercase tracking-widest mb-1">{title}</h3>
        <p className="text-xl font-serif font-bold text-primary mb-1">{value}</p>
        <p className="text-xs text-stone-500 font-light">{description}</p>
      </div>
    </div>
  );
}
