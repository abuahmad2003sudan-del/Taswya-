import React from "react";
import { motion } from "motion/react";
import { Shield, Scale, Lock, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

export default function TermsOfService() {
  return (
    <div className="min-h-screen bg-secondary p-10 font-sans" dir="rtl">
      <div className="max-w-4xl mx-auto space-y-12">
        <header className="text-center space-y-4">
          <div className="w-20 h-20 bg-primary rounded-3xl flex items-center justify-center text-white mx-auto shadow-2xl">
            <Scale className="w-10 h-10" />
          </div>
          <h1 className="text-3xl sm:text-5xl font-serif font-bold text-primary">شروط الخدمة السيادية</h1>
          <p className="text-stone-500 text-lg">يرجى قراءة هذه الشروط بعناية قبل استخدام منصة "تسوية".</p>
        </header>

        <div className="imperial-card p-12 space-y-10">
          <section className="space-y-4">
            <h2 className="text-2xl font-serif font-bold text-primary flex items-center gap-3">
              <Shield className="w-6 h-6 text-accent" />
              1. طبيعة الخدمة
            </h2>
            <p className="text-stone-600 leading-relaxed">
              منصة "تسوية" هي وسيط تقني يوفر أدوات للوساطة العقارية والحل الودي للنزاعات. المنصة ليست طرفاً في أي نزاع، ولا تقدم استشارات قانونية رسمية، بل تسهل التواصل والوصول لاتفاقات ودية بين الأطراف عبر وسطاء مستقلين.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-serif font-bold text-primary flex items-center gap-3">
              <Scale className="w-6 h-6 text-accent" />
              2. إلزامية القرارات
            </h2>
            <p className="text-stone-600 leading-relaxed">
              القرار الصادر عن الوسيط عبر المنصة هو قرار ملزم للأطراف فقط في حال توقيعهم عليه وقبولهم به بمحض إرادتهم. المنصة لا تملك سلطة قضائية تنفيذية، ولكنها توفر صلحاً موثقاً يمكن استخدامه أمام الجهات المختصة كعقد صلح.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-serif font-bold text-primary flex items-center gap-3">
              <Lock className="w-6 h-6 text-accent" />
              3. سياسة الخصوصية والبيانات
            </h2>
            <p className="text-stone-600 leading-relaxed">
              نحن نلتزم بحماية بياناتك السيادية. يتم تشفير كافة المستندات والمراسلات. لا يتم مشاركة بياناتك مع أي طرف ثالث إلا بموجب حكم قضائي أو لضرورة إجراءات الوساطة التي طلبتها.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-serif font-bold text-primary flex items-center gap-3">
              <ArrowRight className="w-6 h-6 text-accent" />
              4. سياسة الإلغاء والاسترداد
            </h2>
            <p className="text-stone-600 leading-relaxed">
              رسوم الوساطة غير قابلة للاسترداد بمجرد تعيين وسيط للنزاع وبدء مراجعة الملف. في حال تم إلغاء الطلب قبل التعيين، قد يتم استرداد جزء من الرسوم بعد خصم المصاريف الإدارية.
            </p>
          </section>
        </div>

        <footer className="text-center">
          <Link to="/register-dispute">
            <button className="text-accent font-bold hover:underline">العودة لتسجيل النزاع</button>
          </Link>
        </footer>
      </div>
    </div>
  );
}
