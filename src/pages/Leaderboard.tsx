import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
import { db } from "@/src/lib/firebase";
import { collection, query, orderBy, limit, onSnapshot } from "firebase/firestore";
import { Trophy, Star, CheckCircle, Users, Medal, Crown } from "lucide-react";
import { Card, CardContent } from "@/src/components/ui/card";
import { Badge } from "@/src/components/ui/badge";

export default function Leaderboard() {
  const [topMediators, setTopMediators] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(
      collection(db, "mediators"),
      orderBy("totalCasesResolved", "desc"),
      limit(10)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const docs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setTopMediators(docs);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return (
    <div className="min-h-screen bg-secondary p-4 sm:p-12 font-sans" dir="rtl">
      <div className="max-w-5xl mx-auto space-y-10">
        <header className="text-center space-y-4">
          <div className="w-20 h-20 bg-primary rounded-3xl flex items-center justify-center text-white shadow-2xl shadow-stone-400 mx-auto mb-6">
            <Trophy className="w-10 h-10" />
          </div>
          <h1 className="text-4xl font-serif font-bold text-primary tracking-tighter">لوحة الصدارة السيادية</h1>
          <p className="text-stone-500 max-w-lg mx-auto leading-relaxed">
            نحتفي بنخبة الوسطاء الأكثر إنجازاً وتقييماً في منصة "تسوية". الأداء العالي هو مفتاح السيادة.
          </p>
        </header>

        {/* Top 3 Podium */}
        {!loading && topMediators.length >= 3 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-end pb-10">
            {/* 2nd Place */}
            <PodiumCard 
              mediator={topMediators[1]} 
              rank={2} 
              height="h-64" 
              color="bg-stone-200" 
              icon={<Medal className="text-stone-400" />} 
            />
            {/* 1st Place */}
            <PodiumCard 
              mediator={topMediators[0]} 
              rank={1} 
              height="h-80" 
              color="bg-accent" 
              icon={<Crown className="text-white" />} 
              isMain
            />
            {/* 3rd Place */}
            <PodiumCard 
              mediator={topMediators[2]} 
              rank={3} 
              height="h-56" 
              color="bg-orange-100" 
              icon={<Medal className="text-orange-400" />} 
            />
          </div>
        )}

        {/* Full List */}
        <Card className="rounded-3xl border-stone-200 shadow-2xl overflow-hidden">
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-right">
                <thead>
                  <tr className="bg-stone-50 border-b border-stone-100">
                    <th className="py-6 px-10 text-[10px] font-black text-stone-400 uppercase tracking-widest">الترتيب</th>
                    <th className="py-6 px-10 text-[10px] font-black text-stone-400 uppercase tracking-widest">الوسيط</th>
                    <th className="py-6 px-10 text-[10px] font-black text-stone-400 uppercase tracking-widest">القضايا المحلولة</th>
                    <th className="py-6 px-10 text-[10px] font-black text-stone-400 uppercase tracking-widest">التقييم</th>
                    <th className="py-6 px-10 text-[10px] font-black text-stone-400 uppercase tracking-widest">نقاط الولاء</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {loading ? (
                    <tr>
                      <td colSpan={5} className="py-20 text-center opacity-40 italic">جاري استدعاء قائمة النخبة...</td>
                    </tr>
                  ) : (
                    topMediators.map((mediator, idx) => (
                      <tr key={mediator.id} className="hover:bg-stone-50 transition-colors group">
                        <td className="py-6 px-10">
                          <span className="text-lg font-serif font-bold text-stone-400 group-hover:text-primary transition-colors">
                            {idx + 1 < 10 ? `0${idx + 1}` : idx + 1}
                          </span>
                        </td>
                        <td className="py-6 px-10">
                          <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-xl bg-stone-100 overflow-hidden border border-stone-200">
                              <img src={`https://picsum.photos/seed/${mediator.id}/100/100`} alt="Avatar" referrerPolicy="no-referrer" />
                            </div>
                            <div>
                              <p className="text-sm font-black text-primary">{mediator.name}</p>
                              <p className="text-[10px] text-stone-400 font-bold uppercase tracking-widest">{mediator.specialization}</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-6 px-10">
                          <div className="flex items-center gap-2">
                            <CheckCircle className="w-4 h-4 text-emerald-500" />
                            <span className="text-sm font-bold text-primary">{mediator.totalCasesResolved || 0}</span>
                          </div>
                        </td>
                        <td className="py-6 px-10">
                          <div className="flex items-center gap-1">
                            <Star className="w-4 h-4 fill-accent text-accent" />
                            <span className="text-sm font-bold text-primary">{mediator.rating || 5.0}</span>
                          </div>
                        </td>
                        <td className="py-6 px-10">
                          <Badge className="bg-primary/5 text-primary border-primary/10 rounded-full px-4">
                            {mediator.loyaltyPoints || 0} نقطة
                          </Badge>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function PodiumCard({ mediator, rank, height, color, icon, isMain }: any) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: rank * 0.2 }}
      className="flex flex-col items-center gap-6"
    >
      <div className="relative">
        <div className={cn("w-24 h-24 rounded-3xl border-4 border-white shadow-2xl overflow-hidden", isMain ? "w-32 h-32" : "")}>
          <img src={`https://picsum.photos/seed/${mediator?.id}/200/200`} alt="Avatar" referrerPolicy="no-referrer" />
        </div>
        <div className={cn("absolute -bottom-4 -right-4 w-10 h-10 rounded-2xl flex items-center justify-center shadow-xl", color)}>
          {icon}
        </div>
      </div>
      <div className="text-center">
        <h3 className={cn("text-xl font-serif font-bold text-primary", isMain ? "text-2xl" : "")}>{mediator?.name}</h3>
        <p className="text-[10px] font-black text-stone-400 uppercase tracking-widest mt-1">{mediator?.specialization}</p>
      </div>
      <div className={cn("w-full rounded-t-3xl shadow-2xl flex flex-col items-center justify-center p-6", color, height)}>
        <span className={cn("text-5xl font-serif font-bold", isMain ? "text-white" : "text-stone-600 opacity-20")}>{rank}</span>
        <p className={cn("text-[10px] font-black uppercase tracking-widest mt-2", isMain ? "text-white/60" : "text-stone-400")}>RANK</p>
      </div>
    </motion.div>
  );
}

function cn(...classes: any[]) {
  return classes.filter(Boolean).join(" ");
}
