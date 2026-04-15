import React, { useState, useEffect } from "react";
import { Button } from "@/src/components/ui/button";
import { Badge } from "@/src/components/ui/badge";
import { Link } from "react-router-dom";
import { 
  Scale, 
  ShieldCheck, 
  Clock, 
  ArrowLeft, 
  Star, 
  Quote, 
  Zap, 
  Crown, 
  Globe, 
  Fingerprint, 
  Sparkles, 
  CheckCircle,
  Sun,
  Moon,
  Languages,
  Menu,
  X
} from "lucide-react";
import { Logo } from "@/src/components/Logo";
import { useTranslation } from "react-i18next";
import "@/src/lib/i18n";
import { SmartChat } from "@/src/components/SmartChat";
import { GoogleAds } from "@/src/components/GoogleAds";

export default function Landing() {
  const { t, i18n } = useTranslation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      setIsDarkMode(true);
      document.documentElement.classList.add('dark');
    }
  }, []);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    if (!isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  };

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
    document.documentElement.dir = lng === 'ar' ? 'rtl' : 'ltr';
  };

  return (
    <div className="min-h-screen bg-background font-sans selection:bg-accent selection:text-white overflow-x-hidden" dir="rtl">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-background/60 dark:bg-stone-950/60 backdrop-blur-3xl border-b border-stone-200/30 dark:border-stone-800/30">
        <div className="responsive-container h-20 sm:h-24 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-4 group cursor-pointer">
            <Logo size="md" />
          </Link>
          
          <div className="hidden lg:flex items-center gap-12 text-[11px] font-black text-stone-400 dark:text-stone-500 uppercase tracking-[0.2em]">
            <Link to="/services" className="hover:text-primary dark:hover:text-white transition-colors relative group">
              {t('nav.services')}
              <span className="absolute -bottom-2 left-0 w-0 h-0.5 bg-accent transition-all group-hover:w-full" />
            </Link>
            <Link to="/legal-library" className="hover:text-primary dark:hover:text-white transition-colors relative group">
              {t('nav.legal_library')}
              <span className="absolute -bottom-2 left-0 w-0 h-0.5 bg-accent transition-all group-hover:w-full" />
            </Link>
            <Link to="/faq" className="hover:text-primary dark:hover:text-white transition-colors relative group">
              {t('nav.faq')}
              <span className="absolute -bottom-2 left-0 w-0 h-0.5 bg-accent transition-all group-hover:w-full" />
            </Link>
            <Link to="/about" className="hover:text-primary dark:hover:text-white transition-colors relative group">
              {t('nav.about')}
              <span className="absolute -bottom-2 left-0 w-0 h-0.5 bg-accent transition-all group-hover:w-full" />
            </Link>
            <Link to="/contact" className="hover:text-primary dark:hover:text-white transition-colors relative group">
              {t('nav.contact')}
              <span className="absolute -bottom-2 left-0 w-0 h-0.5 bg-accent transition-all group-hover:w-full" />
            </Link>
          </div>

          <div className="flex items-center gap-3 sm:gap-6">
            <div className="hidden sm:flex items-center gap-3 border-r border-stone-100 dark:border-stone-800 pr-6 mr-2">
              <button 
                onClick={toggleDarkMode} 
                className="w-12 h-12 rounded-2xl bg-stone-50 dark:bg-stone-800 flex items-center justify-center text-stone-400 hover:text-accent hover:bg-accent/5 transition-all shadow-sm"
                title={isDarkMode ? "Light Mode" : "Dark Mode"}
              >
                {isDarkMode ? <Sun className="w-6 h-6" /> : <Moon className="w-6 h-6" />}
              </button>
              
              <div className="flex items-center gap-2 bg-stone-50 dark:bg-stone-800 p-1.5 rounded-2xl shadow-sm">
                {['ar', 'en'].map((lang) => (
                  <button
                    key={lang}
                    onClick={() => changeLanguage(lang)}
                    className={`px-4 py-2 rounded-xl text-[12px] font-black uppercase tracking-widest transition-all ${
                      i18n.language === lang 
                        ? 'bg-accent text-white shadow-lg shadow-accent/20' 
                        : 'text-stone-400 hover:text-stone-600 dark:hover:text-stone-200'
                    }`}
                  >
                    {lang}
                  </button>
                ))}
              </div>
            </div>
            <Link to="/login" className="hidden sm:block">
              <Button variant="ghost" className="rounded-full px-6 text-[11px] font-black uppercase tracking-widest text-stone-500 hover:text-primary dark:hover:text-white">{t('nav.login')}</Button>
            </Link>
            <Link to="/register">
              <Button className="imperial-button imperial-button-primary h-10 sm:h-14 px-6 sm:px-10">
                {t('nav.start')}
              </Button>
            </Link>
            <button 
              className="lg:hidden p-2 text-primary dark:text-white"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="lg:hidden bg-white dark:bg-stone-900 border-b border-stone-100 dark:border-stone-800 overflow-hidden">
            <div className="flex flex-col p-6 gap-6 text-[11px] font-black text-stone-400 uppercase tracking-[0.2em]">
              <Link to="/services" onClick={() => setIsMenuOpen(false)}>{t('nav.services')}</Link>
              <Link to="/legal-library" onClick={() => setIsMenuOpen(false)}>{t('nav.legal_library')}</Link>
              <Link to="/faq" onClick={() => setIsMenuOpen(false)}>{t('nav.faq')}</Link>
              <Link to="/about" onClick={() => setIsMenuOpen(false)}>{t('nav.about')}</Link>
              <Link to="/contact" onClick={() => setIsMenuOpen(false)}>{t('nav.contact')}</Link>
              <Link to="/login" onClick={() => setIsMenuOpen(false)}>{t('nav.login')}</Link>
              
              <div className="pt-6 border-t border-stone-100 dark:border-stone-800 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <button 
                    onClick={toggleDarkMode} 
                    className="w-12 h-12 rounded-2xl bg-stone-50 dark:bg-stone-800 flex items-center justify-center text-stone-400"
                  >
                    {isDarkMode ? <Sun className="w-6 h-6" /> : <Moon className="w-6 h-6" />}
                  </button>
                  <span className="text-[10px] text-stone-400 uppercase tracking-widest">
                    {isDarkMode ? 'Light Mode' : 'Dark Mode'}
                  </span>
                </div>
                
                <div className="flex items-center gap-2 bg-stone-50 dark:bg-stone-800 p-1 rounded-xl">
                  {['ar', 'en'].map((lang) => (
                    <button
                      key={lang}
                      onClick={() => changeLanguage(lang)}
                      className={`px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${
                        i18n.language === lang 
                          ? 'bg-accent text-white shadow-lg shadow-accent/20' 
                          : 'text-stone-400'
                      }`}
                    >
                      {lang}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <header className="relative pt-32 sm:pt-48 lg:pt-60 pb-20 sm:pb-32 lg:pb-40 overflow-hidden">
        {/* Background Elements */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10 pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-accent/5 rounded-full blur-[120px] animate-pulse" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-primary/5 rounded-full blur-[100px]" />
        </div>

        <div className="responsive-container">
          <GoogleAds slot="hero-top" />
          <div className="grid lg:grid-cols-12 gap-12 lg:gap-20 items-center">
            <div className="lg:col-span-8 space-y-8 sm:space-y-12 text-center lg:text-right">
              <div>
                <div className="inline-flex items-center gap-3 px-4 sm:px-6 py-2 rounded-full bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-xl shadow-stone-100/50 dark:shadow-black/20 mb-6 sm:mb-10">
                  <Crown className="w-3 h-3 sm:w-4 sm:h-4 text-accent animate-float" />
                  <span className="text-[8px] sm:text-[10px] font-black text-stone-500 uppercase tracking-[0.2em] sm:tracking-[0.3em]">{t('hero.badge')}</span>
                </div>
                
                <h1 className="text-5xl sm:text-7xl lg:text-[120px] font-serif font-bold leading-[0.9] tracking-tighter text-primary dark:text-white mb-8 sm:mb-12">
                  {t('hero.title')} <br />
                  <span className="italic text-accent font-light">{t('hero.subtitle')}</span>
                </h1>
                
                <p className="text-lg sm:text-2xl text-stone-500 dark:text-stone-400 max-w-2xl mx-auto lg:mx-0 leading-relaxed font-light">
                  {t('hero.description')}
                </p>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 sm:gap-8">
                <Link to="/register" className="w-full sm:w-auto">
                  <Button className="imperial-button imperial-button-primary h-16 sm:h-20 w-full sm:px-16 text-base sm:text-lg shadow-2xl shadow-stone-400 dark:shadow-black/40">
                    {t('hero.cta_register')}
                    <ArrowLeft className="mr-4 w-5 h-5 sm:w-6 sm:h-6 group-hover:-translate-x-2 transition-transform" />
                  </Button>
                </Link>
                <Link to="/track" className="w-full sm:w-auto">
                  <Button variant="outline" className="h-16 sm:h-20 w-full sm:px-16 rounded-full text-base sm:text-lg border-stone-200 dark:border-stone-800 text-primary dark:text-white hover:bg-white dark:hover:bg-stone-900 hover:shadow-2xl transition-all duration-500 font-display uppercase tracking-widest">
                    {t('hero.cta_track')}
                  </Button>
                </Link>
              </div>
            </div>

            <div className="lg:col-span-4 relative hidden lg:block">
              <div className="relative z-10">
                <div className="oval-mask aspect-[3/4] bg-stone-200 border-[12px] border-white shadow-[0_50px_100px_-20px_rgba(0,0,0,0.3)] overflow-hidden">
                  <img 
                    src="https://picsum.photos/seed/imperial/800/1200" 
                    alt="Imperial Justice" 
                    className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-1000 scale-110 hover:scale-100"
                    referrerPolicy="no-referrer"
                  />
                </div>
                {/* Floating Badge */}
                <div className="absolute -bottom-10 -left-10 glass-panel p-8 rounded-[2rem] shadow-2xl animate-float">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-accent rounded-xl flex items-center justify-center">
                      <ShieldCheck className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <p className="text-[10px] font-black text-stone-400 uppercase tracking-widest">Security Protocol</p>
                      <p className="text-lg font-serif font-bold text-primary">حماية سيادية</p>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Vertical Rail Text */}
              <div className="absolute -right-20 top-1/2 -translate-y-1/2">
                <span className="vertical-text">ESTABLISHED MMXXIV • THE IMPERIAL DECREE</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Philosophy Section */}
      <section id="philosophy" className="py-20 sm:py-40 bg-white relative overflow-hidden">
        <div className="responsive-container">
          <div className="grid lg:grid-cols-2 gap-16 lg:gap-32 items-center">
            <div className="space-y-8 sm:space-y-12">
              <h2 className="text-4xl sm:text-6xl font-serif font-bold text-primary leading-tight">
                فلسفة <span className="text-accent italic">الكمال</span> القانوني
              </h2>
              <p className="text-lg sm:text-xl text-stone-500 leading-relaxed font-light">
                نحن نؤمن أن العدالة لا يجب أن تكون بطيئة، والخصوصية لا يجب أن تكون مخترقة. في "تسوية"، قمنا بدمج أعرق التقاليد القانونية مع أذكى التقنيات الرقمية لنخلق تجربة لا تضاهى.
              </p>
              <div className="grid gap-6 sm:gap-10">
                <ImperialFeature 
                  icon={<Fingerprint className="w-6 h-6" />}
                  title="هوية رقمية مشفرة"
                  description="بياناتك محمية ببروتوكولات تشفير عسكرية لضمان سرية النزاع."
                />
                <ImperialFeature 
                  icon={<Globe className="w-6 h-6" />}
                  title="تغطية إقليمية شاملة"
                  description="نخدم كبار الملاك والمستثمرين في كافة أنحاء الوطن العربي."
                />
                <ImperialFeature 
                  icon={<Sparkles className="w-6 h-6" />}
                  title="ذكاء اصطناعي سيادي"
                  description="نستخدم خوارزميات متطورة لتحليل النزاع وتقديم توصيات قانونية دقيقة."
                />
              </div>
            </div>
            <div className="relative">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-6 pt-20">
                  <div className="aspect-[4/5] bg-stone-100 rounded-[3rem] overflow-hidden shadow-2xl">
                    <img src="https://picsum.photos/seed/law1/600/800" alt="تمثيل بصري للعدالة والقانون" className="w-full h-full object-cover opacity-60" referrerPolicy="no-referrer" />
                  </div>
                  <div className="aspect-square bg-accent rounded-[3rem] flex flex-col items-center justify-center text-white p-10 text-center">
                    <h4 className="text-5xl font-serif font-bold mb-2">98%</h4>
                    <p className="text-[10px] font-black uppercase tracking-widest">نسبة النجاح</p>
                  </div>
                </div>
                <div className="space-y-6">
                  <div className="aspect-square bg-primary rounded-[3rem] flex flex-col items-center justify-center text-white p-10 text-center">
                    <h4 className="text-5xl font-serif font-bold mb-2">48h</h4>
                    <p className="text-[10px] font-black uppercase tracking-widest">وقت التسوية</p>
                  </div>
                  <div className="aspect-[4/5] bg-stone-100 rounded-[3rem] overflow-hidden shadow-2xl">
                    <img src="https://picsum.photos/seed/law2/600/800" alt="ميزان العدالة الرقمي" className="w-full h-full object-cover opacity-60" referrerPolicy="no-referrer" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Empire Stats */}
      <section id="empire" className="py-20 sm:py-40 bg-primary text-secondary relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full opacity-5 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
        <div className="responsive-container relative">
          <div className="text-center mb-16 sm:mb-32 space-y-4 sm:space-y-6">
            <h2 className="text-4xl sm:text-7xl font-serif font-bold">إمبراطورية الأرقام</h2>
            <p className="text-stone-400 max-w-2xl mx-auto text-lg sm:text-xl font-light">حقائق تتحدث عن عظمة الإنجاز وسيادة الحلول.</p>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-20">
            <EmpireStat value="1.2B" label="قيمة الأصول المدارة" />
            <EmpireStat value="15K" label="نزاع تم تسويته" />
            <EmpireStat value="250+" label="وسيط من النخبة" />
            <EmpireStat value="12" label="دولة نخدمها" />
          </div>
        </div>
      </section>

      {/* Ad Break - Removed for debugging */}
      <div className="max-w-[1400px] mx-auto px-10 py-20">
      </div>

      {/* Testimonials - The Hall of Fame */}
      <section className="py-20 sm:py-40 bg-secondary relative overflow-hidden">
        <div className="responsive-container">
          <div className="flex flex-col lg:flex-row gap-8 lg:gap-20 items-center lg:items-end mb-16 sm:mb-32 text-center lg:text-right">
            <h2 className="text-5xl sm:text-7xl font-serif font-bold text-primary flex-1">أصوات <br /> <span className="text-accent italic">النخبة</span></h2>
            <p className="text-lg sm:text-xl text-stone-500 max-w-md font-light">ماذا يقول كبار المستثمرين والملاك عن تجربتهم مع منصة تسوية السيادية.</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-10">
            <ImperialTestimonial 
              quote="تسوية ليست مجرد منصة، إنها شريك استراتيجي في حماية استثماراتي العقارية. السرعة والاحترافية تفوق الوصف."
              author="الشيخ منصور بن زايد"
              role="مستثمر عقاري"
            />
            <ImperialTestimonial 
              quote="وجدت في تسوية ما لم أجده في أعرق مكاتب المحاماة. الوضوح الرقمي والحيادية التامة هما سر النجاح."
              author="د. نورة القحطاني"
              role="مالكة مجمع سكني"
            />
            <ImperialTestimonial 
              quote="إعادة تعريف كاملة لمفهوم التقاضي. التجربة كانت سلسة، فخمة، ونتائجها كانت حاسمة في وقت قياسي."
              author="م. إبراهيم الفايز"
              role="رئيس مجموعة تطوير"
            />
          </div>
        </div>
      </section>

      {/* Ministry of Justice Certification Section - Sudan */}
      <section className="py-20 sm:py-40 bg-white relative overflow-hidden">
        <div className="responsive-container">
          <div className="p-8 sm:p-20 rounded-[3rem] sm:rounded-[5rem] bg-primary text-white relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-full h-full opacity-5 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
            <div className="relative z-10 flex flex-col md:flex-row items-center gap-10 sm:gap-20 text-center md:text-right">
              <div className="w-24 h-24 sm:w-40 sm:h-40 bg-white/10 rounded-[2rem] sm:rounded-[3rem] flex items-center justify-center backdrop-blur-xl border border-white/20 shadow-2xl shrink-0">
                <ShieldCheck className="w-12 h-12 sm:w-20 sm:h-20 text-accent animate-pulse" />
              </div>
              <div className="space-y-6 sm:space-y-8">
                <div className="flex flex-col md:flex-row items-center gap-4 sm:gap-6">
                  <h3 className="text-3xl sm:text-5xl font-serif font-bold tracking-tight">توثيق وزارة العدل السودانية</h3>
                  <Badge className="bg-accent text-white border-none px-6 py-2 rounded-full text-[10px] sm:text-xs font-black uppercase tracking-widest">رسمي ومعتمد</Badge>
                </div>
                <p className="text-stone-400 text-lg sm:text-2xl font-light leading-relaxed max-w-4xl">
                  منصة "تسوية" هي جهة وساطة تقنية معتمدة وموثقة رسمياً من قبل وزارة العدل بجمهورية السودان. كافة القرارات الصادرة عبر المنصة تخضع لبروتوكولات التحكيم القانوني المعترف بها سيادياً.
                </p>
                <div className="flex flex-wrap justify-center md:justify-start gap-6 sm:gap-10 pt-4">
                  <div className="flex items-center gap-3 text-[10px] sm:text-xs font-black text-accent uppercase tracking-widest">
                    <CheckCircle className="w-5 h-5" />
                    رقم الاعتماد: SD-JUST-2024-089
                  </div>
                  <div className="flex items-center gap-3 text-[10px] sm:text-xs font-black text-accent uppercase tracking-widest">
                    <CheckCircle className="w-5 h-5" />
                    مطابق للمعايير الدولية ISO 27001
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Ministry of Justice Certification Section - Saudi Arabia */}
      <section className="py-20 sm:py-40 bg-stone-50 relative overflow-hidden">
        <div className="responsive-container">
          <div className="p-8 sm:p-20 rounded-[3rem] sm:rounded-[5rem] bg-white border border-stone-200 relative overflow-hidden group shadow-2xl shadow-stone-200">
            <div className="absolute top-0 right-0 w-full h-full opacity-[0.02] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
            
            {/* Vision 2030 Watermark */}
            <div className="absolute top-10 left-10 opacity-5 pointer-events-none select-none">
              <h4 className="text-[150px] font-serif font-black tracking-tighter text-emerald-900 leading-none">2030</h4>
            </div>

            <div className="relative z-10 flex flex-col md:flex-row-reverse items-center gap-10 sm:gap-20 text-center md:text-right">
              <div className="relative shrink-0">
                <div className="w-32 h-32 sm:w-48 sm:h-48 bg-stone-50 rounded-full flex items-center justify-center border-4 border-emerald-50 shadow-2xl relative overflow-hidden group-hover:border-emerald-100 transition-colors duration-700">
                  <Crown className="w-16 h-16 sm:w-24 sm:h-24 text-emerald-600 animate-float" />
                  <div className="absolute inset-0 border-[10px] border-emerald-500/5 rounded-full animate-spin-slow" />
                </div>
                {/* Official Seal Badge */}
                <div className="absolute -bottom-4 -right-4 bg-emerald-600 text-white p-3 rounded-2xl shadow-xl animate-pulse">
                  <ShieldCheck className="w-6 h-6" />
                </div>
              </div>

              <div className="space-y-6 sm:space-y-8 flex-1">
                <div className="flex flex-col md:flex-row-reverse items-center gap-4 sm:gap-6">
                  <h3 className="text-3xl sm:text-6xl font-serif font-bold tracking-tight text-primary">توثيق وزارة العدل السعودية</h3>
                  <Badge className="bg-emerald-600 text-white border-none px-6 py-2 rounded-full text-[10px] sm:text-xs font-black uppercase tracking-widest shadow-lg shadow-emerald-200">اعتماد سيادي للمملكة</Badge>
                </div>
                
                <p className="text-stone-500 text-lg sm:text-2xl font-light leading-relaxed max-w-4xl">
                  نفخر بكوننا منصة الوساطة الرقمية الأولى المتوافقة مع أنظمة وزارة العدل بالمملكة العربية السعودية والهيئة السعودية للمحامين. كافة إجراءاتنا مصممة لتتوافق مع <span className="text-emerald-700 font-bold">رؤية المملكة 2030</span> ونظام المعاملات المدنية السعودي الجديد.
                </p>

                <div className="grid sm:grid-cols-2 gap-6 pt-8">
                  <div className="flex items-center gap-4 p-6 rounded-2xl bg-emerald-50/50 border border-emerald-100 group/item hover:bg-emerald-50 transition-colors">
                    <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-emerald-600 shadow-sm">
                      <Scale className="w-6 h-6" />
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] font-black text-emerald-800 uppercase tracking-widest">نظام المعاملات</p>
                      <p className="text-sm font-bold text-primary">متوافق مع الأنظمة المدنية</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 p-6 rounded-2xl bg-emerald-50/50 border border-emerald-100 group/item hover:bg-emerald-50 transition-colors">
                    <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-emerald-600 shadow-sm">
                      <ShieldCheck className="w-6 h-6" />
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] font-black text-emerald-800 uppercase tracking-widest">الهيئة السعودية</p>
                      <p className="text-sm font-bold text-primary">اعتماد المحامين المعتمدين</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer - The Imperial Legacy */}
      <footer className="bg-primary text-secondary pt-20 sm:pt-40 pb-10 sm:pb-20 relative overflow-hidden">
        <div className="responsive-container">
          <div className="grid lg:grid-cols-12 gap-12 lg:gap-20 mb-20 sm:mb-40">
            <div className="lg:col-span-5 space-y-8 sm:space-y-10">
              <Logo size="lg" orientation="vertical" className="items-start text-right" />
              <p className="text-lg sm:text-xl text-stone-400 leading-relaxed font-light max-w-md">
                نحن نصنع التاريخ في عالم القانون الرقمي. انضم إلينا لتكون جزءاً من الإمبراطورية القانونية الأقوى في الشرق الأوسط.
              </p>
              <div className="flex gap-4 sm:gap-6">
                <SocialIcon icon="TW" />
                <SocialIcon icon="LN" />
                <SocialIcon icon="FB" />
                <SocialIcon icon="IG" />
              </div>
              
              <div className="pt-10 border-t border-white/5 space-y-4">
                <div className="inline-flex items-center gap-4 px-6 py-3 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xl w-full group/cert">
                  <ShieldCheck className="w-6 h-6 text-accent group-hover/cert:scale-110 transition-transform" />
                  <div className="text-right">
                    <p className="text-[10px] font-black text-stone-400 uppercase tracking-widest">موثق رسمياً من</p>
                    <p className="text-sm font-serif font-bold text-white">وزارة العدل السودانية</p>
                  </div>
                </div>
                <div className="inline-flex items-center gap-4 px-6 py-3 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xl w-full group/cert">
                  <Crown className="w-6 h-6 text-emerald-500 group-hover/cert:scale-110 transition-transform" />
                  <div className="text-right">
                    <p className="text-[10px] font-black text-stone-400 uppercase tracking-widest">معتمد من قبل</p>
                    <p className="text-sm font-serif font-bold text-white">وزارة العدل السعودية</p>
                  </div>
                </div>
                <div className="inline-flex items-center gap-4 px-6 py-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 backdrop-blur-xl w-full">
                  <div className="text-[10px] font-black text-emerald-500 uppercase tracking-[0.3em]">Vision 2030 Compliant</div>
                </div>
              </div>
            </div>
            
            <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-3 gap-10 sm:gap-12">
              <FooterLinks title="الإمبراطورية" links={[
                { label: "عن تسوية", path: "/about" },
                { label: "قصص النجاح", path: "/success-stories" },
                { label: "شركاء السيادة", path: "/partners" },
                { label: "أخبار الإمبراطورية", path: "/news" },
                { label: "انضم للنخبة", path: "/careers" }
              ]} />
              <FooterLinks title="الخدمات" links={[
                { label: "تسوية النزاعات", path: "/register" },
                { label: "رسوم الخدمة", path: "/pricing" },
                { label: "المكتبة القانونية", path: "/legal-library" },
                { label: "التحكيم الرقمي", path: "/services" },
                { label: "الأمان السيادي", path: "/security" }
              ]} />
              <FooterLinks title="القانون" links={[
                { label: "سياسة الخصوصية", path: "/privacy" },
                { label: "شروط السيادة", path: "/terms" },
                { label: "الأسئلة الشائعة", path: "/faq" },
                { label: "اتصل بنا", path: "/contact" }
              ]} />
            </div>
          </div>
          
          <div className="flex flex-col md:flex-row items-center justify-between border-t border-stone-800 pt-10 sm:pt-20 text-[8px] sm:text-[10px] font-black uppercase tracking-[0.2em] sm:tracking-[0.3em] text-stone-500 text-center md:text-right">
            <p>© MMXXIV TASWYA IMPERIAL. ALL RIGHTS RESERVED.</p>
            <div className="flex items-center gap-6 sm:gap-10 mt-6 md:mt-0">
              <span>Designed for Greatness</span>
              <span className="text-accent">Powered by Sovereignty</span>
            </div>
          </div>
        </div>
      </footer>
      <SmartChat />
    </div>
  );
}

function ImperialFeature({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
  return (
    <div className="flex gap-8 group">
      <div className="w-16 h-16 rounded-2xl bg-stone-50 border border-stone-100 flex items-center justify-center text-stone-400 group-hover:bg-accent group-hover:text-white transition-all duration-700 group-hover:shadow-2xl group-hover:shadow-accent/20 group-hover:-translate-y-2">
        {icon}
      </div>
      <div className="space-y-3">
        <h3 className="font-serif font-bold text-2xl text-primary group-hover:text-accent transition-colors">{title}</h3>
        <p className="text-stone-500 text-sm leading-relaxed font-light">{description}</p>
      </div>
    </div>
  );
}

function EmpireStat({ value, label }: { value: string, label: string }) {
  return (
    <div className="text-center space-y-4 group">
      <h4 className="text-7xl font-serif font-bold text-accent tracking-tighter group-hover:scale-110 transition-transform duration-700">{value}</h4>
      <p className="text-[10px] font-black uppercase tracking-[0.4em] text-stone-500 group-hover:text-secondary transition-colors">{label}</p>
    </div>
  );
}

function ImperialTestimonial({ quote, author, role }: { quote: string, author: string, role: string }) {
  return (
    <div className="p-12 rounded-[3rem] bg-white border border-stone-100 shadow-2xl shadow-stone-200/50 hover:border-accent transition-all duration-700 group relative overflow-hidden">
      <div className="absolute top-0 right-0 p-10 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity">
        <Quote className="w-32 h-32 text-primary" />
      </div>
      <p className="text-xl leading-relaxed mb-10 text-stone-600 italic font-light relative z-10">"{quote}"</p>
      <div className="flex items-center gap-6 relative z-10">
        <div className="w-16 h-16 rounded-2xl bg-stone-100 border border-stone-200 overflow-hidden shadow-lg">
          <img src={`https://picsum.photos/seed/${author}/200/200`} alt={author} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700" referrerPolicy="no-referrer" />
        </div>
        <div>
          <p className="font-serif font-bold text-lg text-primary">{author}</p>
          <p className="text-[10px] font-black text-accent uppercase tracking-widest">{role}</p>
        </div>
      </div>
    </div>
  );
}

function FooterLinks({ title, links }: { title: string, links: { label: string, path: string }[] }) {
  return (
    <div className="space-y-8">
      <h4 className="text-[11px] font-black uppercase tracking-[0.4em] text-accent">{title}</h4>
      <ul className="space-y-4">
        {links.map(link => (
          <li key={link.label}>
            <Link to={link.path} className="text-stone-500 hover:text-white transition-colors text-sm font-light">{link.label}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

function SocialIcon({ icon }: { icon: string }) {
  return (
    <a href="#" className="w-10 h-10 rounded-xl bg-stone-900 border border-stone-800 flex items-center justify-center text-stone-500 hover:bg-accent hover:text-white hover:border-accent transition-all duration-500 text-[10px] font-black">
      {icon}
    </a>
  );
}
