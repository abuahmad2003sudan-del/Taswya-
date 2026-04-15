import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { db, auth, handleFirestoreError, OperationType } from "@/src/lib/firebase";
import { 
  collection, query, where, onSnapshot, doc, updateDoc, 
  getDoc, serverTimestamp, runTransaction 
} from "firebase/firestore";
import { 
  LayoutDashboard, Users, FileText, CheckCircle, Clock, 
  Star, Trophy, Share2, MessageSquare, Bell, 
  TrendingUp, Award, DollarSign, Send, Crown, Scale
} from "lucide-react";
import { Button } from "@/src/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/src/components/ui/card";
import { Badge } from "@/src/components/ui/badge";
import { toast } from "sonner";
import { format } from "date-fns";
import { ar } from "date-fns/locale";
import { cn } from "@/src/lib/utils";

export default function MediatorDashboard() {
  const [mediatorData, setMediatorData] = useState<any>(null);
  const [assignedDisputes, setAssignedDisputes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!auth.currentUser) return;

    // Fetch Mediator Stats
    const mediatorRef = doc(db, "mediators", auth.currentUser.uid);
    const unsubscribeMediator = onSnapshot(mediatorRef, (doc) => {
      if (doc.exists()) {
        setMediatorData({ id: doc.id, ...doc.data() });
      } else {
        // If no mediator doc exists, maybe it's a new mediator or admin hasn't approved yet
        setMediatorData({ name: auth.currentUser?.displayName || "وسيط جديد", loyaltyPoints: 0, totalCasesResolved: 0 });
      }
    });

    // Fetch Assigned Disputes
    const q = query(
      collection(db, "disputes"), 
      where("mediatorId", "==", auth.currentUser.uid),
      where("status", "in", ["under_review", "pending_payment"])
    );
    const unsubscribeDisputes = onSnapshot(q, (snapshot) => {
      const docs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setAssignedDisputes(docs);
      setLoading(false);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, "disputes");
    });

    return () => {
      unsubscribeMediator();
      unsubscribeDisputes();
    };
  }, []);

  const issueDecision = async (disputeId: string, decisionText: string) => {
    try {
      await runTransaction(db, async (transaction) => {
        const disputeRef = doc(db, "disputes", disputeId);
        const mediatorRef = doc(db, "mediators", auth.currentUser!.uid);

        const disputeSnap = await transaction.get(disputeRef);
        const mediatorSnap = await transaction.get(mediatorRef);

        if (!disputeSnap.exists()) throw new Error("Dispute does not exist!");
        
        // Update Dispute
        transaction.update(disputeRef, {
          status: "resolved",
          decision: {
            text: decisionText,
            createdAt: serverTimestamp()
          },
          resolvedAt: serverTimestamp()
        });

        if (mediatorSnap.exists()) {
          // Update Mediator Stats
          const currentTotal = mediatorSnap.data().totalCasesResolved || 0;
          const currentMonthly = mediatorSnap.data().monthlyCases || 0;
          const currentPoints = mediatorSnap.data().loyaltyPoints || 0;
          const currentBadges = mediatorSnap.data().badges || [];

          const newPoints = currentPoints + 10;
          const newTotal = currentTotal + 1;
          const newMonthly = currentMonthly + 1;

          const updates: any = {
            totalCasesResolved: newTotal,
            monthlyCases: newMonthly,
            loyaltyPoints: newPoints
          };

          // Check for badges
          if (newTotal === 1 && !currentBadges.includes("first_case")) {
            updates.badges = [...currentBadges, "first_case"];
          }
          if (newTotal === 10 && !currentBadges.includes("expert_mediator")) {
            updates.badges = [...currentBadges, "expert_mediator"];
          }

          transaction.update(mediatorRef, updates);
        }
      });

      toast.success("تم إصدار القرار النهائي وإغلاق النزاع بنجاح.");
    } catch (error) {
      console.error(error);
      toast.error("فشل في إصدار القرار.");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-secondary flex items-center justify-center" dir="rtl">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-primary font-serif italic">جاري تحميل لوحة التحكم السيادية...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-secondary p-4 sm:p-12 font-sans" dir="rtl">
      <div className="max-w-7xl mx-auto space-y-10">
        {/* Header */}
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h1 className="text-4xl font-serif font-bold text-primary tracking-tighter">لوحة تحكم الوسيط</h1>
            <p className="text-stone-500 font-medium mt-2">مرحباً بك، {mediatorData?.name} • بروتوكول النزاهة نشط</p>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="outline" className="rounded-full border-stone-200 px-6" onClick={() => window.location.href = "/referrals"}>
              <Share2 className="ml-2 w-4 h-4" />
              نظام الإحالة
            </Button>
            <Button variant="outline" className="rounded-full border-stone-200 px-6" onClick={() => window.location.href = "/leaderboard"}>
              <Trophy className="ml-2 w-4 h-4" />
              لوحة الصدارة
            </Button>
            <div className="w-12 h-12 rounded-2xl bg-primary flex items-center justify-center text-white shadow-xl">
              <Award className="w-6 h-6" />
            </div>
          </div>
        </header>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard 
            title="القضايا المحلولة" 
            value={mediatorData?.totalCasesResolved || 0} 
            icon={<CheckCircle className="text-emerald-500" />} 
            subtext="إجمالي الإنجازات"
          />
          <StatCard 
            title="نقاط الولاء" 
            value={mediatorData?.loyaltyPoints || 0} 
            icon={<Trophy className="text-amber-500" />} 
            subtext={`${50 - ((mediatorData?.loyaltyPoints || 0) % 50)} نقطة للشارة القادمة`}
          />
          <StatCard 
            title="متوسط التقييم" 
            value={mediatorData?.rating || 5.0} 
            icon={<Star className="text-accent" />} 
            subtext="بناءً على رأي الأطراف"
          />
          <StatCard 
            title="الأرباح المحققة" 
            value={`${(mediatorData?.totalCasesResolved || 0) * 300} ج.م`} 
            icon={<DollarSign className="text-emerald-600" />} 
            subtext="قابل للسحب قريباً"
          />
        </div>

        {/* Main Content Area */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Tasks & Disputes */}
          <div className="lg:col-span-8 space-y-8">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-serif font-bold text-primary">النزاعات المعينة</h2>
              <Badge variant="outline" className="rounded-full px-4">{assignedDisputes.length} نزاعات نشطة</Badge>
            </div>

            <div className="space-y-6">
              {assignedDisputes.length === 0 ? (
                <Card className="border-dashed border-2 border-stone-200 bg-stone-50/50">
                  <CardContent className="flex flex-col items-center justify-center py-20 opacity-40">
                    <Clock className="w-16 h-16 mb-4" />
                    <p className="text-xl font-serif italic">لا توجد نزاعات معينة حالياً. استرخِ قليلاً.</p>
                  </CardContent>
                </Card>
              ) : (
                assignedDisputes.map((dispute) => (
                  <DisputeTaskCard 
                    key={dispute.id} 
                    dispute={dispute} 
                    onResolve={(text: string) => issueDecision(dispute.id, text)} 
                  />
                ))
              )}
            </div>
          </div>

          {/* Sidebar: Profile & Referrals */}
          <div className="lg:col-span-4 space-y-8">
            {/* Profile Card */}
            <Card className="rounded-3xl border-stone-200 shadow-xl overflow-hidden">
              <div className="h-24 bg-primary relative">
                <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 w-20 h-20 rounded-2xl bg-white border-4 border-white shadow-xl overflow-hidden">
                  <img src={`https://picsum.photos/seed/${mediatorData?.id || "default"}/200/200`} alt="Avatar" referrerPolicy="no-referrer" />
                </div>
              </div>
              <CardContent className="pt-14 text-center pb-8">
                <h3 className="text-xl font-serif font-bold text-primary">{mediatorData?.name}</h3>
                <p className="text-xs font-black text-accent uppercase tracking-widest mt-1">{mediatorData?.specialization || "وسيط معتمد"}</p>
                
                <div className="flex justify-center gap-1 mt-4">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star key={s} className={cn("w-4 h-4", s <= Math.round(mediatorData?.rating || 5) ? "fill-accent text-accent" : "text-stone-200")} />
                  ))}
                </div>

                <div className="flex flex-wrap justify-center gap-2 mt-6">
                  {mediatorData?.badges?.map((badge: string) => (
                    <Badge key={badge} className="bg-primary/5 text-primary border-primary/10 rounded-full px-3 py-1 text-[10px] font-bold">
                      {badge === "first_case" ? "القضية الأولى" : badge === "expert_mediator" ? "وسيط خبير" : badge}
                    </Badge>
                  ))}
                  {(mediatorData?.monthlyCases || 0) >= 5 && (
                    <Badge className="bg-accent text-white rounded-full px-3 py-1 text-[10px] font-black uppercase tracking-widest">
                      الأكثر نشاطاً 🔥
                    </Badge>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Referral Quick Card */}
            <Card className="rounded-3xl border-stone-200 shadow-xl bg-accent text-white overflow-hidden relative group">
              <div className="absolute top-0 right-0 w-full h-full opacity-10 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
              <CardContent className="p-8 relative z-10">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center">
                    <Share2 className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-xl font-serif font-bold">نظام الإحالة</h3>
                    <p className="text-[10px] font-black uppercase tracking-widest opacity-70">Refer & Earn Rewards</p>
                  </div>
                </div>
                
                <p className="text-sm font-medium leading-relaxed mb-6">
                  ادعُ زملائك المحامين للانضمام إلى منصة "تسوية" واحصل على 50 ج.م عن كل وسيط معتمد يسجل من خلالك.
                </p>

                <div className="bg-white/10 rounded-2xl p-4 mb-6 border border-white/20">
                  <p className="text-[10px] font-black uppercase tracking-widest opacity-60 mb-2">كود الإحالة الخاص بك</p>
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-mono font-bold tracking-tighter">{mediatorData?.referralCode || "TASWYA-001"}</span>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="text-white hover:bg-white/20 rounded-xl"
                      onClick={() => {
                        navigator.clipboard.writeText(mediatorData?.referralCode || "TASWYA-001");
                        toast.success("تم نسخ الكود بنجاح!");
                      }}
                    >
                      نسخ
                    </Button>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs font-bold">
                  <span>إجمالي الإحالات: {mediatorData?.referralCount || 0}</span>
                  <span>المكافآت: {mediatorData?.referralBonus || 0} ج.م</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, icon, subtext }: any) {
  return (
    <Card className="rounded-3xl border-stone-200 shadow-xl hover:shadow-2xl transition-all duration-500 group">
      <CardContent className="p-8">
        <div className="flex items-center justify-between mb-6">
          <div className="w-12 h-12 rounded-2xl bg-stone-50 border border-stone-100 flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-all duration-500">
            {icon}
          </div>
          <TrendingUp className="w-4 h-4 text-emerald-500 opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>
        <h3 className="text-3xl font-serif font-bold text-primary mb-1">{value}</h3>
        <p className="text-xs font-bold text-stone-600 uppercase tracking-widest">{title}</p>
        <p className="text-[10px] text-stone-400 mt-4">{subtext}</p>
      </CardContent>
    </Card>
  );
}

function DisputeTaskCard({ dispute, onResolve }: any) {
  const [decision, setDecision] = useState("");
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <Card className="rounded-3xl border-stone-200 shadow-lg overflow-hidden group hover:border-accent/30 transition-all duration-500">
      <CardContent className="p-0">
        <div className="p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-stone-100">
          <div className="flex items-center gap-6">
            <div className="w-14 h-14 rounded-2xl bg-stone-100 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all duration-500">
              <FileText className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-3 mb-1">
                <h4 className="text-xl font-serif font-bold text-primary">نزاع #{dispute.id.slice(-6).toUpperCase()}</h4>
                <Badge className="bg-blue-50 text-blue-600 border-blue-100 rounded-full px-3 py-0.5 text-[10px]">تحت المراجعة</Badge>
              </div>
              <p className="text-xs font-bold text-stone-500">{dispute.applicant.name} ضد {dispute.secondParty?.name}</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              className="rounded-full text-stone-400 hover:text-primary"
              onClick={() => setIsExpanded(!isExpanded)}
            >
              {isExpanded ? "إغلاق التفاصيل" : "عرض التفاصيل"}
            </Button>
            <Button 
              className="rounded-full bg-primary hover:bg-stone-900 text-white px-8"
              onClick={() => setIsExpanded(true)}
            >
              إصدار قرار
            </Button>
          </div>
        </div>

        <AnimatePresence>
          {isExpanded && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="p-8 bg-stone-50/50 space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                  <div className="space-y-4">
                    <h5 className="text-sm font-black text-stone-400 uppercase tracking-widest">تفاصيل النزاع</h5>
                    <p className="text-sm text-stone-600 leading-relaxed">{dispute.details.description}</p>
                    <div className="flex items-center gap-4 text-xs font-bold text-stone-500">
                      <span>العنوان: {dispute.details.address}</span>
                      <span>الإيجار: {dispute.details.monthlyRent} ج.م</span>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <h5 className="text-sm font-black text-stone-400 uppercase tracking-widest">الأطراف</h5>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between p-3 rounded-xl bg-white border border-stone-200">
                        <span className="text-xs font-bold text-stone-500">المتقدم (المستأجر)</span>
                        <span className="text-xs font-black text-primary">{dispute.applicant.name}</span>
                      </div>
                      <div className="flex items-center justify-between p-3 rounded-xl bg-white border border-stone-200">
                        <span className="text-xs font-bold text-stone-500">الطرف الثاني (المالك)</span>
                        <span className="text-xs font-black text-primary">{dispute.secondParty?.name}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4 pt-6 border-t border-stone-200">
                  <h5 className="text-sm font-black text-primary uppercase tracking-widest">القرار النهائي السيادي</h5>
                  <textarea 
                    className="w-full min-h-[150px] p-6 rounded-2xl border border-stone-200 focus:ring-2 focus:ring-primary/20 outline-none text-sm leading-relaxed"
                    placeholder="اكتب منطوق القرار النهائي هنا... يجب أن يكون القرار مستنداً إلى القوانين العقارية المعمول بها."
                    value={decision}
                    onChange={(e) => setDecision(e.target.value)}
                  />
                  <div className="flex justify-end gap-4">
                    <Button 
                      variant="outline" 
                      className="rounded-full px-8"
                      onClick={() => setIsExpanded(false)}
                    >
                      إلغاء
                    </Button>
                    <Button 
                      className="rounded-full bg-emerald-600 hover:bg-emerald-700 text-white px-10"
                      onClick={() => {
                        if (decision.length < 20) {
                          toast.error("يرجى كتابة قرار مفصل.");
                          return;
                        }
                        onResolve(decision);
                      }}
                    >
                      <Send className="ml-2 w-4 h-4" />
                      اعتماد وإرسال القرار
                    </Button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </CardContent>
    </Card>
  );
}
