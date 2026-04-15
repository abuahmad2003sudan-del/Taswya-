import React from "react";
import { motion } from "motion/react";
import { Lock, Eye, ShieldCheck, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-secondary p-10 font-sans" dir="rtl">
      <div className="max-w-4xl mx-auto space-y-12">
        <header className="text-center space-y-4">
          <div className="w-20 h-20 bg-accent rounded-3xl flex items-center justify-center text-white mx-auto shadow-2xl">
            <Lock className="w-10 h-10" />
          </div>
          <h1 className="text-3xl sm:text-5xl font-serif font-bold text-primary">سياسة الخصوصية السيادية</h1>
          <p className="text-stone-500 text-lg">كيف نحمي بياناتك ونحافظ على سرية نزاعاتك.</p>
        </header>

        <div className="imperial-card p-12 space-y-10">
          <section className="space-y-4">
            <h2 className="text-2xl font-serif font-bold text-primary flex items-center gap-3">
              <Eye className="w-6 h-6 text-accent" />
              1. جمع البيانات
            </h2>
            <p className="text-stone-600 leading-relaxed">
              نجمع فقط البيانات الضرورية لإتمام عملية الوساطة، بما في ذلك الأسماء، أرقام الهواتف، عناوين العقارات، وتفاصيل النزاع. يتم تخزين هذه البيانات في خوادم مشفرة تابعة لـ Firebase.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-serif font-bold text-primary flex items-center gap-3">
              <ShieldCheck className="w-6 h-6 text-accent" />
              2. استخدام البيانات
            </h2>
            <p className="text-stone-600 leading-relaxed">
              تستخدم بياناتك حصرياً لغرض الوساطة. الوسطاء المعينون فقط هم من يملكون حق الوصول لملف النزاع الخاص بك. لا نبيع أو نؤجر بياناتك لأي جهات إعلانية.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-serif font-bold text-primary flex items-center gap-3">
              <Lock className="w-6 h-6 text-accent" />
              3. أمن المعلومات والامتثال
            </h2>
            <p className="text-stone-600 leading-relaxed">
              نحن نطبق أعلى معايير الأمان العالمية. يتم تشفير كافة البيانات أثناء النقل (In Transit) وأثناء السكون (At Rest). كما نلتزم بمعايير حماية البيانات العامة لضمان سيادة المستخدم على معلوماته الشخصية.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-serif font-bold text-primary flex items-center gap-3">
              <ShieldCheck className="w-6 h-6 text-accent" />
              4. حقوق المستخدم
            </h2>
            <p className="text-stone-600 leading-relaxed">
              لك الحق في طلب نسخة من بياناتك، أو طلب حذفها نهائياً من سجلاتنا السيادية، ما لم يكن هناك التزام قانوني يمنع ذلك (مثل النزاعات القائمة).
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
