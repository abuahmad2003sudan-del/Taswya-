import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Cookie, X, ShieldCheck } from "lucide-react";
import { Button } from "./ui/button";
import { Link } from "react-router-dom";

export function CookieConsent() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem("cookie-consent");
    if (!consent) {
      const timer = setTimeout(() => setIsVisible(true), 2000);
      return () => clearTimeout(timer);
    }
  }, []);

  const acceptCookies = () => {
    localStorage.setItem("cookie-consent", "true");
    setIsVisible(false);
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          className="fixed bottom-8 left-8 right-8 md:left-auto md:right-8 md:max-w-md z-[100]"
        >
          <div className="glass-panel p-8 rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.2)] border border-white/20 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-accent" />
            
            <div className="flex items-start gap-6">
              <div className="w-14 h-14 rounded-2xl bg-accent/10 flex items-center justify-center text-accent shrink-0">
                <Cookie className="w-7 h-7" />
              </div>
              
              <div className="space-y-4">
                <h4 className="text-xl font-serif font-bold text-primary tracking-tight">بروتوكول ملفات التعريف</h4>
                <p className="text-sm text-stone-500 leading-relaxed font-light">
                  نحن نستخدم ملفات تعريف الارتباط لضمان تقديم تجربة سيادية تليق بك، ولتحسين أداء الإعلانات عبر AdSense. استمرارك يعني قبولك لسياسة الخصوصية الخاصة بنا.
                </p>
                
                <div className="flex flex-wrap items-center gap-4 pt-2">
                  <Button 
                    onClick={acceptCookies}
                    className="imperial-button imperial-button-primary h-12 px-8 text-xs"
                  >
                    قبول السيادة
                  </Button>
                  <Link to="/privacy">
                    <Button variant="ghost" className="text-[10px] font-black uppercase tracking-widest text-stone-400 hover:text-primary">
                      التفاصيل القانونية
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
            
            <button 
              onClick={() => setIsVisible(false)}
              className="absolute top-6 left-6 text-stone-300 hover:text-stone-500 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
