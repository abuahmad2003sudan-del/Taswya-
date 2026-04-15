import React, { useState } from "react";
import { motion } from "motion/react";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { Label } from "@/src/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/src/components/ui/card";
import { Lock, Mail, LogIn, AlertCircle } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { auth, db } from "@/src/lib/firebase";
import { signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { doc, getDoc, setDoc, serverTimestamp, collection, query, where, getDocs } from "firebase/firestore";
import { toast } from "sonner";

import { Logo } from "@/src/components/Logo";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      await handleUserRedirect(user);
    } catch (err: any) {
      console.error(err);
      setError("خطأ في البريد الإلكتروني أو كلمة المرور.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    setError(null);
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      await handleUserRedirect(user);
    } catch (err: any) {
      console.error(err);
      setError("فشل تسجيل الدخول عبر جوجل.");
    } finally {
      setLoading(false);
    }
  };

  const handleUserRedirect = async (user: any) => {
    try {
      const userDoc = await getDoc(doc(db, "users", user.uid));
      
      if (userDoc.exists()) {
        const userData = userDoc.data();
        toast.success(`مرحباً بك، ${userData.name}`);
        
        if (userData.role === "admin") {
          navigate("/admin");
        } else if (userData.role === "mediator") {
          navigate("/mediator");
        } else {
          navigate("/");
        }
      } else {
        // Check if this user is an approved mediator by email
        const mediatorsRef = collection(db, "mediators");
        const q = query(mediatorsRef, where("email", "==", user.email));
        const querySnapshot = await getDocs(q);
        
        let role = "client";
        let name = user.displayName || "مستخدم جديد";

        if (!querySnapshot.empty) {
          role = "mediator";
          const mediatorData = querySnapshot.docs[0].data();
          name = mediatorData.name || name;
        }

        // Auto-admin for the owner
        if (user.email === "abuahmad.2003sudan@gmail.com") {
          role = "admin";
          name = "المدير العام";
        }

        // Create the user profile
        await setDoc(doc(db, "users", user.uid), {
          uid: user.uid,
          email: user.email,
          name: name,
          role: role,
          createdAt: serverTimestamp()
        });

        toast.success(`تم إنشاء ملفك بنجاح، مرحباً بك ${name}`);
        
        if (role === "admin") {
          navigate("/admin");
        } else if (role === "mediator") {
          navigate("/mediator");
        } else {
          navigate("/");
        }
      }
    } catch (err) {
      console.error("Error in redirect:", err);
      setError("حدث خطأ أثناء إعداد حسابك. يرجى المحاولة مرة أخرى.");
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4 font-sans relative overflow-hidden" dir="rtl">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-full -z-10 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-accent/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-primary/5 rounded-full blur-[100px]" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-10">
          <Link to="/" className="inline-block mb-8">
            <Logo size="lg" orientation="vertical" />
          </Link>
          <h1 className="text-3xl font-serif font-bold text-primary tracking-tight">تسجيل الدخول</h1>
          <p className="text-stone-500 mt-2 font-light">خاص بالوسطاء ومديري المنصة</p>
        </div>

        <Card className="imperial-card border-none shadow-2xl">
          <CardHeader className="p-8 sm:p-10 border-b border-stone-100 text-center">
            <CardTitle className="text-2xl font-serif font-bold text-primary">مرحباً بك مجدداً</CardTitle>
            <CardDescription className="text-stone-500 mt-2 font-light">يرجى استخدام الدخول السريع والآمن</CardDescription>
          </CardHeader>
          <CardContent className="p-8 sm:p-10">
            <div className="space-y-6">
              <Button 
                type="button" 
                className="imperial-button imperial-button-primary w-full h-14 shadow-xl shadow-stone-200" 
                onClick={handleGoogleLogin}
                disabled={loading}
              >
                <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" className="w-5 h-5 ml-3" />
                الدخول عبر جوجل (موصى به)
              </Button>

              <div className="relative my-8">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-stone-100"></span>
                </div>
                <div className="relative flex justify-center text-[10px] uppercase tracking-[0.3em]">
                  <span className="bg-white px-4 text-stone-400 font-black">أو عبر البريد</span>
                </div>
              </div>

              <form onSubmit={handleLogin} className="space-y-6">
                {error && (
                  <div className="p-4 bg-red-50 text-red-600 rounded-2xl flex items-center gap-3 text-xs font-bold border border-red-100">
                    <AlertCircle className="w-4 h-4" />
                    {error}
                  </div>
                )}
                <div className="space-y-3">
                  <Label className="text-[10px] font-black uppercase tracking-widest text-stone-400 mr-2">البريد الإلكتروني</Label>
                  <div className="relative">
                    <Mail className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                    <Input 
                      type="email" 
                      placeholder="example@mail.com" 
                      className="h-14 pr-12 rounded-2xl bg-stone-50 border-stone-100 focus:bg-white transition-all"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                </div>
                <div className="space-y-3">
                  <Label className="text-[10px] font-black uppercase tracking-widest text-stone-400 mr-2">كلمة المرور</Label>
                  <div className="relative">
                    <Lock className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                    <Input 
                      type="password" 
                      placeholder="••••••••" 
                      className="h-14 pr-12 rounded-2xl bg-stone-50 border-stone-100 focus:bg-white transition-all"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>
                </div>
                <Button type="submit" className="imperial-button imperial-button-accent w-full h-14" disabled={loading}>
                  {loading ? "جاري التحقق..." : "دخول آمن"}
                  <LogIn className="mr-2 w-4 h-4" />
                </Button>
              </form>
            </div>
          </CardContent>
        </Card>
        
        <p className="text-center mt-10 text-xs text-stone-400 font-light">
          هل تواجه مشكلة في الدخول؟ <a href="#" className="text-accent font-bold hover:underline">تواصل مع الدعم الفني</a>
        </p>
      </motion.div>
    </div>
  );
}
