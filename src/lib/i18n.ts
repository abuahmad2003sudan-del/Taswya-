import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

const resources = {
  ar: {
    translation: {
      "nav": {
        "services": "الخدمات",
        "legal_library": "المكتبة القانونية",
        "faq": "الأسئلة الشائعة",
        "about": "عن الإمبراطورية",
        "contact": "اتصل بنا",
        "login": "دخول النخبة",
        "start": "ابدأ الرحلة"
      },
      "hero": {
        "badge": "المعيار السيادي في التقنية القانونية",
        "title": "العدالة",
        "subtitle": "بسيادة عربية",
        "description": "نحن لا نحل النزاعات فحسب، نحن نصنع عصراً جديداً من الاستقرار العقاري. منصة \"تسوية\" هي الملاذ الآمن لنخبة الملاك والمستأجرين في كافة أنحاء الوطن العربي.",
        "cta_register": "سجل نزاعك الآن",
        "cta_track": "مركز التتبع"
      },
      "footer": {
        "certified_sudan": "وزارة العدل السودانية",
        "certified_saudi": "وزارة العدل السعودية",
        "rights": "جميع الحقوق محفوظة"
      }
    }
  },
  en: {
    translation: {
      "nav": {
        "services": "Services",
        "legal_library": "Legal Library",
        "faq": "FAQ",
        "about": "About Us",
        "contact": "Contact",
        "login": "Elite Login",
        "start": "Start Journey"
      },
      "hero": {
        "badge": "The Sovereign Standard in Legal Tech",
        "title": "Justice",
        "subtitle": "with Arabic Sovereignty",
        "description": "We don't just resolve disputes; we create a new era of real estate stability. Taswya is the safe haven for elite owners and tenants across the Arab world.",
        "cta_register": "Register Your Dispute",
        "cta_track": "Tracking Center"
      },
      "footer": {
        "certified_sudan": "Sudanese Ministry of Justice",
        "certified_saudi": "Saudi Ministry of Justice",
        "rights": "All Rights Reserved"
      }
    }
  },
  fr: {
    translation: {
      "nav": {
        "services": "Services",
        "legal_library": "Bibliothèque Juridique",
        "faq": "FAQ",
        "about": "À Propos",
        "contact": "Contact",
        "login": "Connexion Élite",
        "start": "Commencer"
      },
      "hero": {
        "badge": "Le Standard Souverain en Tech Juridique",
        "title": "Justice",
        "subtitle": "avec Souveraineté Arabe",
        "description": "Nous ne nous contentons pas de résoudre les litiges ; nous créons une nouvelle ère de stabilité immobilière. Taswya est le refuge sûr pour les propriétaires et locataires d'élite.",
        "cta_register": "Enregistrer un Litige",
        "cta_track": "Centre de Suivi"
      }
    }
  },
  tr: {
    translation: {
      "nav": {
        "services": "Hizmetler",
        "legal_library": "Hukuk Kütüphanesi",
        "faq": "SSS",
        "about": "Hakkımızda",
        "contact": "İletişيم",
        "login": "Seçkin Giriş",
        "start": "Yolculuğa Başla"
      },
      "hero": {
        "badge": "Hukuk Teknolojisinde Egemen Standart",
        "title": "Adalet",
        "subtitle": "Arap Egemenliği ile",
        "description": "Sadece anlaşmazlıkları çözmüyoruz; gayrimenkul istikrarında yeni bir dönem yaratıyoruz. Taswya, Arap dünyasındaki seçkin sahipler ve kiracılar için güvenli bir limandır.",
        "cta_register": "Uyuşmazlığı Kaydet",
        "cta_track": "Takip Merkezi"
      }
    }
  }
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'ar',
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;
