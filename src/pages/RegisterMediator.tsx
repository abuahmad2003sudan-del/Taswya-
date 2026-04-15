import React, { useState } from "react";
import { motion } from "motion/react";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { Label } from "@/src/components/ui/label";
import { Textarea } from "@/src/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/src/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/src/components/ui/select";
import { Link, useNavigate } from "react-router-dom";
import { Scale, ShieldCheck, ArrowRight, Upload, CheckCircle2, Award, Briefcase, Star, Zap, Brain, Globe, Lock, DollarSign } from "lucide-react";
import { db, handleFirestoreError, OperationType } from "@/src/lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { toast } from "sonner";

function BenefitItem({ icon, title, desc }: { icon: React.ReactNode, title: string, desc: string }) {
  return (
    <div className="space-y-3">
      <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center text-white border border-white/20">
        {icon}
      </div>
      <h4 className="text-lg font-serif font-bold">{title}</h4>
      <p className="text-sm text-white/70 leading-relaxed">{desc}</p>
    </div>
  );
}

export default function RegisterMediator() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    
    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get("name"),
      email: formData.get("email"),
      phone: formData.get("phone"),
      country: formData.get("country"),
      specialization: formData.get("specialization"),
      experience: formData.get("experience"),
      licenseNumber: formData.get("licenseNumber"),
      bio: formData.get("bio"),
      referralCode: formData.get("referralCode"),
      agreedToCooperation: formData.get("agreedToCooperation") === "on",
      status: "pending_review",
      role: "mediator_candidate",
      createdAt: serverTimestamp(),
    };

    try {
      await addDoc(collection(db, "mediator_applications"), data);
      setSubmitted(true);
      toast.success("تم إرسال طلب الانضمام بنجاح. سيتم مراجعة ملفك من قبل لجنة النخبة.");
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, "mediator_applications");
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-stone-50 flex items-center justify-center p-6 font-sans" dir="rtl">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full text-center"
        >
          <div className="w-24 h-24 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-8 border border-emerald-100 shadow-xl shadow-emerald-100/50">
            <CheckCircle2 className="w-12 h-12 text-emerald-600" />
          </div>
          <h2 className="text-3xl font-serif font-bold text-primary mb-4">طلبك قيد المراجعة الفاخرة</h2>
          <p className="text-stone-600 mb-10 leading-relaxed">
            شكراً لانضمامك لنخبة الوسطاء في "تسوية". يقوم فريقنا القانوني حالياً بمراجعة مؤهلاتك لضمان أعلى معايير الجودة. سنتواصل معك عبر البريد الإلكتروني خلال 24 ساعة.
          </p>
          <Link to="/">
            <Button className="w-full h-14 rounded-full bg-primary hover:bg-stone-800 shadow-xl shadow-stone-200">
              العودة للرئيسية
            </Button>
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-50 py-20 px-6 font-sans selection:bg-stone-200 selection:text-stone-900" dir="rtl">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <Link to="/" className="inline-flex items-center gap-2 text-stone-400 hover:text-primary transition-colors mb-8 group">
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            <span className="text-sm font-bold uppercase tracking-widest">العودة للرئيسية</span>
          </Link>
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-serif font-bold text-primary mb-6">انضم لنخبة الوسطاء</h1>
          <p className="text-stone-500 max-w-2xl mx-auto text-lg leading-relaxed">
            نحن نبحث عن كبار المحامين والمستشارين القانونيين لإعادة صياغة مفهوم العدالة الرقمية. كن جزءاً من المنصة الأكثر رقيّاً في الوطن العربي.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2 space-y-12">
            <section className="p-10 rounded-[40px] bg-accent text-white shadow-2xl shadow-accent/20 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-full h-full opacity-10 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
              <div className="relative z-10">
                <h2 className="text-3xl font-serif font-bold mb-6">لماذا تنضم لنخبة "تسوية"؟</h2>
                <div className="grid sm:grid-cols-2 gap-8">
                  <BenefitItem 
                    icon={<Brain className="w-6 h-6" />} 
                    title="ذكاء اصطناعي قانوني" 
                    desc="أدوات تحليل ذكية تساعدك في صياغة القرارات بناءً على آلاف السوابق القضائية." 
                  />
                  <BenefitItem 
                    icon={<DollarSign className="w-6 h-6" />} 
                    title="أتعاب سيادية" 
                    desc="نظام تسعير يضمن لك أعلى عوائد مهنية في السوق العربي مع تحصيل فوري." 
                  />
                  <BenefitItem 
                    icon={<Zap className="w-6 h-6" />} 
                    title="صفر تكاليف تسويق" 
                    desc="نحن نوفر لك تدفقاً مستمراً من القضايا عالية القيمة دون أي مجهود تسويقي منك." 
                  />
                  <BenefitItem 
                    icon={<Globe className="w-6 h-6" />} 
                    title="سمعة دولية" 
                    desc="احصل على 'شارة السيادة' التي ترفع من مكانتك المهنية في كافة أنحاء العالم." 
                  />
                </div>
              </div>
            </section>

            <Card className="border-stone-200 shadow-2xl shadow-stone-200/50 rounded-[32px] overflow-hidden bg-white">
              <CardHeader className="p-10 bg-stone-50/50 border-b border-stone-100">
                <CardTitle className="font-serif text-2xl text-primary">نموذج التسجيل المهني</CardTitle>
                <CardDescription>يرجى إدخال بياناتك المهنية بدقة ليتم مراجعتها</CardDescription>
              </CardHeader>
              <CardContent className="p-10">
                <form onSubmit={handleSubmit} className="space-y-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-3">
                      <Label htmlFor="name" className="text-sm font-bold text-stone-600">الاسم الكامل (كما في الرخصة)</Label>
                      <Input id="name" name="name" placeholder="الأستاذ/ ..." required className="h-14 rounded-2xl border-stone-200 focus:ring-stone-200" />
                    </div>
                    <div className="space-y-3">
                      <Label htmlFor="country" className="text-sm font-bold text-stone-600">دولة الممارسة</Label>
                      <Select name="country" required>
                        <SelectTrigger className="h-14 rounded-2xl border-stone-200">
                          <SelectValue placeholder="اختر الدولة" />
                        </SelectTrigger>
                        <SelectContent className="rounded-2xl border-stone-200">
                          <SelectItem value="EGY">مصر</SelectItem>
                          <SelectItem value="SAU">السعودية</SelectItem>
                          <SelectItem value="ARE">الإمارات</SelectItem>
                          <SelectItem value="JOR">الأردن</SelectItem>
                          <SelectItem value="SDN">السودان</SelectItem>
                          <SelectItem value="KWT">الكويت</SelectItem>
                          <SelectItem value="QAT">قطر</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-3">
                      <Label htmlFor="email" className="text-sm font-bold text-stone-600">البريد الإلكتروني المهني</Label>
                      <Input id="email" name="email" type="email" placeholder="lawyer@example.com" required className="h-14 rounded-2xl border-stone-200 focus:ring-stone-200" />
                    </div>
                    <div className="space-y-3">
                      <Label htmlFor="phone" className="text-sm font-bold text-stone-600">رقم التواصل</Label>
                      <Input id="phone" name="phone" placeholder="+20 ..." required className="h-14 rounded-2xl border-stone-200 focus:ring-stone-200" />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-3">
                      <Label htmlFor="specialization" className="text-sm font-bold text-stone-600">التخصص الرئيسي</Label>
                      <Select name="specialization" required>
                        <SelectTrigger className="h-14 rounded-2xl border-stone-200">
                          <SelectValue placeholder="اختر التخصص" />
                        </SelectTrigger>
                        <SelectContent className="rounded-2xl border-stone-200">
                          <SelectItem value="real_estate">قانون عقاري</SelectItem>
                          <SelectItem value="civil">قانون مدني</SelectItem>
                          <SelectItem value="commercial">قانون تجاري</SelectItem>
                          <SelectItem value="arbitration">تحكيم دولي</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-3">
                      <Label htmlFor="experience" className="text-sm font-bold text-stone-600">سنوات الخبرة</Label>
                      <Select name="experience" required>
                        <SelectTrigger className="h-14 rounded-2xl border-stone-200">
                          <SelectValue placeholder="اختر سنوات الخبرة" />
                        </SelectTrigger>
                        <SelectContent className="rounded-2xl border-stone-200">
                          <SelectItem value="5-10">5 - 10 سنوات</SelectItem>
                          <SelectItem value="10-20">10 - 20 سنة</SelectItem>
                          <SelectItem value="20+">أكثر من 20 سنة</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <Label htmlFor="bio" className="text-sm font-bold text-stone-600">نبذة مهنية مختصرة</Label>
                    <Textarea id="bio" name="bio" placeholder="تحدث عن خبراتك في حل النزاعات..." className="min-h-[120px] rounded-2xl border-stone-200 focus:ring-stone-200" required />
                  </div>

                  <div className="space-y-3">
                    <Label htmlFor="referralCode" className="text-sm font-bold text-stone-600">كود الإحالة (اختياري)</Label>
                    <Input id="referralCode" name="referralCode" placeholder="إذا تمت دعوتك من قبل وسيط آخر، أدخل الكود هنا" className="h-14 rounded-2xl border-stone-200 focus:ring-stone-200" />
                  </div>

                  <div className="space-y-6">
                    <div className="p-6 rounded-2xl bg-stone-50 border border-stone-200 flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-white border border-stone-200 flex items-center justify-center text-stone-400">
                        <Upload className="w-5 h-5" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-bold text-primary">إرفاق السيرة الذاتية وصورة الرخصة</p>
                        <p className="text-xs text-stone-400">PDF, JPG (بحد أقصى 5MB)</p>
                      </div>
                      <Button type="button" variant="outline" size="sm" className="rounded-full">اختيار ملف</Button>
                    </div>

                    <div className="flex items-start gap-4 p-6 rounded-2xl bg-primary/5 border border-primary/10">
                      <input 
                        type="checkbox" 
                        id="agreedToCooperation" 
                        name="agreedToCooperation"
                        required
                        className="mt-1 w-5 h-5 accent-primary cursor-pointer"
                      />
                      <label htmlFor="agreedToCooperation" className="text-sm text-stone-600 leading-relaxed cursor-pointer">
                        أوافق على <span className="text-primary font-bold">اتفاقية التعاون الرقمي</span> مع منصة "تسوية". أقر بصحة كافة البيانات المهنية المذكورة وألتزم بمعايير النزاهة والسرية السيادية المعمول بها في المنصة.
                      </label>
                    </div>
                  </div>

                  <Button 
                    type="submit" 
                    disabled={loading}
                    className="w-full h-16 rounded-full bg-primary hover:bg-stone-800 shadow-2xl shadow-stone-300 text-lg transition-all hover:-translate-y-1"
                  >
                    {loading ? "جاري إرسال الطلب..." : "تقديم طلب الانضمام للنخبة"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-8">
            <div className="p-8 rounded-[32px] bg-primary text-white shadow-2xl shadow-stone-300">
              <Award className="w-12 h-12 mb-6 text-stone-400" />
              <h3 className="text-2xl font-serif font-bold mb-4">مزايا النخبة</h3>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-stone-400 mt-1 shrink-0" />
                  <span className="text-sm leading-relaxed">الوصول لعملاء من الفئة الممتازة (High-Net-Worth).</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-stone-400 mt-1 shrink-0" />
                  <span className="text-sm leading-relaxed">نظام مالي شفاف وتحصيل فوري للأتعاب.</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-stone-400 mt-1 shrink-0" />
                  <span className="text-sm leading-relaxed">أدوات رقمية متطورة لإدارة الجلسات والوثائق.</span>
                </li>
              </ul>
            </div>

            <div className="p-8 rounded-[32px] bg-white border border-stone-200 shadow-xl shadow-stone-100">
              <Star className="w-10 h-10 mb-6 text-accent fill-accent" />
              <h3 className="text-xl font-serif font-bold text-primary mb-4">نظام تقييم النجوم</h3>
              <p className="text-sm text-stone-500 leading-relaxed mb-6">
                يعتمد تصنيفك في المنصة على نظام "النجوم السيادية" (1-5 نجوم). يتم احتساب التقييم بناءً على:
              </p>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center gap-3 text-xs font-bold text-stone-600">
                  <div className="w-1.5 h-1.5 rounded-full bg-accent" />
                  سرعة حسم النزاعات
                </li>
                <li className="flex items-center gap-3 text-xs font-bold text-stone-600">
                  <div className="w-1.5 h-1.5 rounded-full bg-accent" />
                  دقة التحليل القانوني
                </li>
                <li className="flex items-center gap-3 text-xs font-bold text-stone-600">
                  <div className="w-1.5 h-1.5 rounded-full bg-accent" />
                  رضا الأطراف عن العملية
                </li>
              </ul>
              <div className="p-4 rounded-2xl bg-stone-50 border border-stone-100 text-[10px] font-black text-stone-400 uppercase tracking-widest text-center">
                الوسطاء ذوي الـ 5 نجوم يحصلون على قضايا "الفئة الملكية"
              </div>
            </div>

            <div className="p-8 rounded-[32px] bg-white border border-stone-200 shadow-xl shadow-stone-100">
              <Briefcase className="w-10 h-10 mb-6 text-stone-300" />
              <h3 className="text-xl font-serif font-bold text-primary mb-4">هل لديك استفسار؟</h3>
              <p className="text-sm text-stone-500 leading-relaxed mb-6">
                فريق علاقات الوسطاء جاهز للإجابة على تساؤلاتك المهنية حول نظام العمل في المنصة.
              </p>
              <Button variant="outline" className="w-full rounded-full border-stone-200">تواصل مع قسم الوسطاء</Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
