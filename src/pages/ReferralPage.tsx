import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
import { db, auth } from "@/src/lib/firebase";
import { doc, onSnapshot } from "firebase/firestore";
import { 
  Share2, Users, Gift, Copy, Check, 
  Twitter, Facebook, Linkedin, Mail 
} from "lucide-react";
import { Button } from "@/src/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/src/components/ui/card";
import { toast } from "sonner";

export default function ReferralPage() {
  const [mediatorData, setMediatorData] = useState<any>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!auth.currentUser) return;

    const mediatorRef = doc(db, "mediators", auth.currentUser.uid);
    const unsubscribe = onSnapshot(mediatorRef, (doc) => {
      if (doc.exists()) {
        setMediatorData({ id: doc.id, ...doc.data() });
      }
    });

    return () => unsubscribe();
  }, []);

  const referralCode = mediatorData?.referralCode || "TASWYA-001";
  const referralLink = `${window.location.origin}/become-mediator?ref=${referralCode}`;

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    toast.success("تم النسخ بنجاح!");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-secondary p-4 sm:p-12 font-sans" dir="rtl">
      <div className="max-w-4xl mx-auto space-y-10">
        <header className="text-center space-y-4">
          <div className="w-20 h-20 bg-accent rounded-3xl flex items-center justify-center text-white shadow-2xl shadow-accent/20 mx-auto mb-6">
            <Share2 className="w-10 h-10" />
          </div>
          <h1 className="text-4xl font-serif font-bold text-primary tracking-tighter">نظام الإحالة والمكافآت</h1>
          <p className="text-stone-500 max-w-lg mx-auto leading-relaxed">
            ساهم في بناء أكبر شبكة وسطاء عقاريين في المنطقة. شارك كود الإحالة الخاص بك واحصل على مكافآت مالية ونقاط ولاء.
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <RewardStat 
            icon={<Users className="text-blue-500" />} 
            label="إجمالي الإحالات" 
            value={mediatorData?.referralCount || 0} 
          />
          <RewardStat 
            icon={<Gift className="text-accent" />} 
            label="المكافآت المالية" 
            value={`${mediatorData?.referralBonus || 0} ج.م`} 
          />
          <RewardStat 
            icon={<Check className="text-emerald-500" />} 
            label="إحالات معتمدة" 
            value={mediatorData?.referralCount || 0} 
          />
        </div>

        <Card className="rounded-3xl border-stone-200 shadow-2xl overflow-hidden">
          <CardContent className="p-10 space-y-10">
            <div className="space-y-6">
              <h3 className="text-xl font-serif font-bold text-primary">رابط الإحالة الخاص بك</h3>
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1 bg-stone-50 border border-stone-200 rounded-2xl p-4 flex items-center justify-between overflow-hidden">
                  <span className="text-xs font-mono text-stone-500 truncate">{referralLink}</span>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="rounded-xl"
                    onClick={() => copyToClipboard(referralLink)}
                  >
                    {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                  </Button>
                </div>
                <Button 
                  className="rounded-2xl bg-primary hover:bg-stone-900 text-white px-8 h-14"
                  onClick={() => copyToClipboard(referralCode)}
                >
                  نسخ الكود فقط
                </Button>
              </div>
            </div>

            <div className="space-y-6">
              <h3 className="text-xl font-serif font-bold text-primary">شارك عبر المنصات</h3>
              <div className="flex flex-wrap gap-4">
                <ShareButton icon={<Twitter />} label="تويتر" color="bg-[#1DA1F2]" />
                <ShareButton icon={<Facebook />} label="فيسبوك" color="bg-[#4267B2]" />
                <ShareButton icon={<Linkedin />} label="لينكد إن" color="bg-[#0077B5]" />
                <ShareButton icon={<Mail />} label="البريد" color="bg-stone-600" />
              </div>
            </div>

            <div className="pt-10 border-t border-stone-100">
              <h3 className="text-xl font-serif font-bold text-primary mb-6">كيف يعمل النظام؟</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
                <Step 
                  number="01" 
                  title="شارك الرابط" 
                  desc="أرسل رابط الإحالة لزملائك المحامين والوسطاء المعتمدين." 
                />
                <Step 
                  number="02" 
                  title="يسجل الزميل" 
                  desc="يقوم الزميل بالتسجيل وتقديم أوراقه المهنية للمراجعة." 
                />
                <Step 
                  number="03" 
                  title="احصل على المكافأة" 
                  desc="بمجرد اعتماد حساب الزميل، تضاف المكافأة لرصيدك فوراً." 
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function RewardStat({ icon, label, value }: any) {
  return (
    <Card className="rounded-3xl border-stone-200 shadow-xl text-center p-8">
      <div className="w-12 h-12 bg-stone-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
        {icon}
      </div>
      <h4 className="text-2xl font-serif font-bold text-primary mb-1">{value}</h4>
      <p className="text-[10px] font-black text-stone-400 uppercase tracking-widest">{label}</p>
    </Card>
  );
}

function ShareButton({ icon, label, color }: any) {
  return (
    <Button className={cn("rounded-2xl text-white px-6 h-12 flex items-center gap-3", color)}>
      {icon}
      <span className="text-xs font-bold">{label}</span>
    </Button>
  );
}

function Step({ number, title, desc }: any) {
  return (
    <div className="space-y-3">
      <span className="text-3xl font-serif font-bold text-accent/20">{number}</span>
      <h4 className="text-lg font-serif font-bold text-primary">{title}</h4>
      <p className="text-xs text-stone-500 leading-relaxed">{desc}</p>
    </div>
  );
}

function cn(...classes: any[]) {
  return classes.filter(Boolean).join(" ");
}
