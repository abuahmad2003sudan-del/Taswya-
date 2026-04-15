# 🏛️ منصة تسوية (Taswiya) - الإمبراطورية القانونية الرقمية

منصة "تسوية" هي نظام سيادي متكامل للوساطة العقارية والقانونية، يهدف لربط الملاك والمستأجرين بوسطاء (محامين) معتمدين لحل النزاعات بخصوصية وسرعة فائقة باستخدام أحدث تقنيات الويب والذكاء الاصطناعي.

## 🚀 التقنيات المستخدمة (Tech Stack)

- **Frontend**: React 19 + Vite + Tailwind CSS 4.
- **Backend**: Express Server (Node.js) مدمج للتعامل مع الـ Webhooks والعمليات الحساسة.
- **Database**: Firebase Firestore (Real-time).
- **Auth**: Firebase Authentication (Google OAuth).
- **Security**: Helmet.js + CSP + HSTS + RLS (Firestore Rules).
- **Payments**: PayTabs + Payoneer + MTGR Sudan Store.

## 🔒 ميزات الأمان (Production-Grade Security)

- **رؤوس الأمان**: استخدام `helmet` لإضافة CSP و HSTS و X-Frame-Options.
- **قواعد البيانات**: تطبيق قواعد أمان صارمة في Firestore لضمان خصوصية البيانات.
- **التشفير**: تشفير كافة الاتصالات عبر SSL/TLS.
- **التحقق**: نظام Webhook آمن مع تحقق من التوقيع الرقمي (HMAC-SHA256).

## 🛠️ التشغيل المحلي (Local Development)

### المتطلبات الأساسية
- Node.js (v18+)
- npm أو yarn

### خطوات التشغيل
1. قم بتثبيت التبعيات:
   ```bash
   npm install
   ```
2. قم بإنشاء ملف `.env` بناءً على `.env.example` وأضف المفاتيح المطلوبة.
3. ابدأ خادم التطوير:
   ```bash
   npm run dev
   ```
4. افتح المتصفح على `http://localhost:3000`.

## 📦 بناء المشروع للإنتاج (Production Build)

```bash
npm run build
```
سيتم إنشاء ملفات الإنتاج في مجلد `dist/`.

## 🧪 الاختبارات (Testing)

```bash
npm test
```

## 📜 الامتثال (Compliance)

- متوافق مع معايير **WCAG 2.2 AA** لسهولة الوصول.
- يتضمن نظام موافقة على ملفات تعريف الارتباط (Cookie Consent).
- سياسات خصوصية وشروط استخدام شاملة.

---
© MMXXIV TASWIYA IMPERIAL. ALL RIGHTS RESERVED.
