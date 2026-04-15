import React, { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Button } from "@/src/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/src/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/src/components/ui/table";
import { Badge } from "@/src/components/ui/badge";
import { Link } from "react-router-dom";
import { 
  LayoutDashboard, Users, FileText, Settings, LogOut, Search, Filter, 
  MoreVertical, Bell, Crown, Clock, ShieldCheck, TrendingUp, 
  Activity, Zap, Brain, Globe, Lock, MessageSquare, Sparkles,
  Download, Edit, Check, X as XIcon, UserPlus, CreditCard, User
} from "lucide-react";
import { Logo } from "@/src/components/Logo";
import { Menu, X } from "lucide-react";
import { cn } from "@/src/lib/utils";
import { db, auth, handleFirestoreError, OperationType } from "@/src/lib/firebase";
import { collection, onSnapshot, query, orderBy, limit, addDoc, serverTimestamp, updateDoc, doc } from "firebase/firestore";
import { format } from "date-fns";
import { ar } from "date-fns/locale";
import { toast } from "sonner";
import axios from "axios";
import { WebhookReport } from "@/src/components/WebhookReport";
import { ProjectReport } from "@/src/components/ProjectReport";
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, Cell
} from 'recharts';

const chartData = [
  { name: 'يناير', value: 400 },
  { name: 'فبراير', value: 300 },
  { name: 'مارس', value: 600 },
  { name: 'أبريل', value: 800 },
  { name: 'مايو', value: 500 },
  { name: 'يونيو', value: 900 },
];

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("disputes");
  const [disputes, setDisputes] = useState<any[]>([]);
  const [mediatorApps, setMediatorApps] = useState<any[]>([]);
  const [webhookFailures, setWebhookFailures] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [aiInsight, setAiInsight] = useState("جاري تحليل البيانات السيادية...");
  const [isSeeding, setIsSeeding] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [selectedDispute, setSelectedDispute] = useState<any>(null);
  const [isReceiptModalOpen, setIsReceiptModalOpen] = useState(false);
  const isDeveloper = auth.currentUser?.email === "abuahmad.2003sudan@gmail.com";

  const seedDatabase = async () => {
    setIsSeeding(true);
    const seedDisputes = [
      {
        applicant: { name: "أحمد المنصوري", email: "ahmed@example.com", phone: "0501234567", role: "tenant" },
        secondParty: { name: "شركة العقارات المتحدة", email: "info@realestate.com", phone: "041234567" },
        details: { type: "price_increase", address: "دبي، مرسى دبي، برج النخبة", monthlyRent: 8500, description: "زيادة مفاجئة في الإيجار بنسبة 25% دون إخطار مسبق بـ 90 يوماً حسب قوانين مؤسسة التنظيم العقاري." },
        status: "under_review",
        paymentStatus: "paid",
        createdAt: serverTimestamp()
      },
      {
        applicant: { name: "سارة القحطاني", email: "sara@example.com", phone: "0559876543", role: "owner" },
        secondParty: { name: "خالد العتيبي", email: "khaled@example.com", phone: "0551122334" },
        details: { type: "payment_delay", address: "الرياض، حي الملقا، فيلا 12", monthlyRent: 12000, description: "تأخر المستأجر في دفع الإيجار لمدة 3 أشهر متتالية رغم توجيه عدة إنذارات رسمية." },
        status: "pending_payment",
        paymentStatus: "unpaid",
        createdAt: serverTimestamp()
      },
      {
        applicant: { name: "محمد إبراهيم", email: "mohamed@example.com", phone: "01012345678", role: "tenant" },
        secondParty: { name: "محمود حسن", email: "mahmoud@example.com", phone: "01234567890" },
        details: { type: "maintenance", address: "القاهرة، التجمع الخامس، شقة 5", monthlyRent: 15000, description: "وجود تسريبات مياه حادة في المطبخ والحمام والمالك يرفض إجراء الإصلاحات الضرورية منذ شهر." },
        status: "resolved",
        paymentStatus: "paid",
        createdAt: serverTimestamp()
      },
      {
        applicant: { name: "ليلى الأردني", email: "laila@example.com", phone: "0791234567", role: "tenant" },
        secondParty: { name: "عمر العبدالله", email: "omar@example.com", phone: "0781234567" },
        details: { type: "eviction", address: "عمان، عبدون، شارع الأميرة", monthlyRent: 600, description: "تلقيت إخطاراً بالإخلاء بداعي رغبة المالك في السكن، ولكن تبين أنه يريد تأجيرها لشخص آخر بسعر أعلى." },
        status: "under_review",
        paymentStatus: "paid",
        createdAt: serverTimestamp()
      },
      {
        applicant: { name: "ياسين الفاسي", email: "yassine@example.com", phone: "0661234567", role: "owner" },
        secondParty: { name: "كريم العلمي", email: "karim@example.com", phone: "0667654321" },
        details: { type: "other", address: "الدار البيضاء، حي المعاريف", monthlyRent: 4500, description: "المستأجر قام بإجراء تعديلات هيكلية في الشقة دون إذن خطي، مما أدى لضرر في الجدران الأساسية." },
        status: "closed",
        paymentStatus: "paid",
        createdAt: serverTimestamp()
      }
    ];

    try {
      for (const dispute of seedDisputes) {
        await addDoc(collection(db, "disputes"), {
          ...dispute,
          id: Math.random().toString(36).substr(2, 9).toUpperCase()
        });
      }
      toast.success("تم ملء قاعدة البيانات بنزاعات احترافية بنجاح!");
    } catch (error) {
      toast.error("حدث خطأ أثناء ملء البيانات.");
      console.error(error);
    } finally {
      setIsSeeding(false);
    }
  };

  useEffect(() => {
    const q = query(collection(db, "disputes"), orderBy("createdAt", "desc"), limit(50));
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const docs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setDisputes(docs);
      setLoading(false);
      
      // Simulate AI Insight
      setTimeout(() => {
        setAiInsight("بناءً على البيانات الحالية، هناك زيادة بنسبة 15% في نزاعات الصيانة في منطقة القاهرة الجديدة. نوصي بتوجيه المزيد من الوسطاء المتخصصين في القانون العقاري المدني لتلك المنطقة.");
      }, 2000);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, "disputes");
    });

    const qApps = query(collection(db, "mediator_applications"), orderBy("createdAt", "desc"));
    const unsubscribeApps = onSnapshot(qApps, (snapshot) => {
      const docs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setMediatorApps(docs);
    });

    const qFails = query(collection(db, "webhook_failures"), orderBy("failedAt", "desc"), limit(20));
    const unsubscribeFails = onSnapshot(qFails, (snapshot) => {
      const docs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setWebhookFailures(docs);
    });

    // Mock Real-time Notifications
    const interval = setInterval(() => {
      const newNotif = {
        id: Math.random(),
        text: `نزاع جديد تم تسجيله برقم #${Math.floor(Math.random() * 10000)}`,
        time: "الآن",
        type: "new_dispute"
      };
      setNotifications(prev => [newNotif, ...prev].slice(0, 5));
    }, 10000);

    return () => {
      unsubscribe();
      clearInterval(interval);
    };
  }, []);

  const stats = useMemo(() => ({
    total: disputes.length,
    pending: disputes.filter(d => d.status === "pending_payment").length,
    review: disputes.filter(d => d.status === "under_review").length,
    resolved: disputes.filter(d => d.status === "resolved").length,
    revenue: disputes.reduce((acc, d) => acc + (d.paymentStatus === "paid" ? (d.paymentAmount || 500) : 0), 0),
    pendingApps: mediatorApps.filter(a => a.status === "pending_review").length
  }), [disputes, mediatorApps]);

  const exportToCSV = () => {
    const headers = ["ID", "Applicant", "Type", "Status", "Payment", "Mediator", "Created At"];
    const rows = disputes.map(d => [
      d.id,
      d.applicant.name,
      d.details.type,
      d.status,
      d.paymentStatus,
      d.mediatorId || "None",
      d.createdAt?.toDate ? d.createdAt.toDate().toISOString() : "N/A"
    ]);
    
    const csvContent = [headers, ...rows].map(e => e.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `taswya_disputes_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("تم تصدير البيانات بنجاح!");
  };

  const updateDisputeStatus = async (id: string, newStatus: string) => {
    try {
      const disputeRef = doc(db, "disputes", id);
      await updateDoc(disputeRef, { status: newStatus });
      toast.success(`تم تغيير حالة النزاع إلى ${newStatus}`);
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `disputes/${id}`);
    }
  };

  const assignMediator = async (id: string, mediatorId: string) => {
    try {
      const disputeRef = doc(db, "disputes", id);
      await updateDoc(disputeRef, { mediatorId, status: 'under_review' });
      toast.success(`تم تعيين الوسيط ${mediatorId} للنزاع`);
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `disputes/${id}`);
    }
  };

  const approveMediator = async (appId: string, appData: any) => {
    try {
      const referralCode = `TASWYA-${Math.random().toString(36).substring(2, 7).toUpperCase()}`;
      // 1. Create mediator document
      await addDoc(collection(db, "mediators"), {
        ...appData,
        status: "active",
        rating: 5.0,
        totalCasesResolved: 0,
        monthlyCases: 0,
        loyaltyPoints: 0,
        referralCode: referralCode,
        referralCount: 0,
        referralBonus: 0,
        badges: ["new_member"],
        isActive: true,
        role: "mediator",
        createdAt: serverTimestamp()
      });
      // 2. Update application status
      await updateDoc(doc(db, "mediator_applications", appId), { status: "approved" });
      toast.success("تم اعتماد الوسيط بنجاح وتوليد كود الإحالة!");
    } catch (error) {
      console.error(error);
      toast.error("فشل في اعتماد الوسيط.");
    }
  };

  const rejectMediator = async (appId: string) => {
    try {
      await updateDoc(doc(db, "mediator_applications", appId), { status: "rejected" });
      toast.success("تم رفض طلب الانضمام.");
    } catch (error) {
      toast.error("فشل في تنفيذ العملية.");
    }
  };

  const retryWebhook = async (failureId: string) => {
    try {
      const response = await axios.post("/api/admin/payments/retry-webhook", { failureId });
      if (response.data.success) {
        toast.success("تمت إعادة معالجة الـ Webhook بنجاح!");
      }
    } catch (error: any) {
      toast.error("فشل في إعادة المحاولة: " + (error.response?.data || error.message));
    }
  };

  return (
    <div className="min-h-screen bg-secondary flex font-sans selection:bg-accent selection:text-white overflow-hidden relative" dir="rtl">
      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsSidebarOpen(false)}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar - The Imperial Rail */}
      <aside className={cn(
        "fixed inset-y-0 right-0 w-80 bg-primary border-l border-white/5 flex flex-col shadow-[20px_0_50px_rgba(0,0,0,0.2)] z-50 transition-transform duration-500 lg:relative lg:translate-x-0",
        isSidebarOpen ? "translate-x-0" : "translate-x-full"
      )}>
        <div className="p-8 sm:p-10 border-b border-white/5 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-4 group cursor-pointer">
            <Logo size="md" className="text-white" />
          </Link>
          <button onClick={() => setIsSidebarOpen(false)} className="lg:hidden text-white/40 hover:text-white">
            <X className="w-6 h-6" />
          </button>
        </div>
        
        <nav className="flex-1 p-6 sm:p-8 space-y-3 overflow-y-auto custom-scrollbar">
          <SidebarItem 
            icon={<LayoutDashboard className="w-4 h-4" />} 
            label="مركز التحكم" 
            active={activeTab === "disputes"} 
            onClick={() => { setActiveTab("disputes"); setIsSidebarOpen(false); }} 
          />
          <SidebarItem 
            icon={<Users className="w-4 h-4" />} 
            label="طلبات الوسطاء" 
            active={activeTab === "mediator_apps"} 
            onClick={() => { setActiveTab("mediator_apps"); setIsSidebarOpen(false); }} 
          />
          <SidebarItem 
            icon={<Activity className="w-4 h-4" />} 
            label="النشاط المباشر" 
            active={activeTab === "live"} 
            onClick={() => { setActiveTab("live"); setIsSidebarOpen(false); }} 
          />
          <SidebarItem 
            icon={<Globe className="w-4 h-4" />} 
            label="الخريطة العقارية" 
            active={activeTab === "map"} 
            onClick={() => { setActiveTab("map"); setIsSidebarOpen(false); }} 
          />
          <SidebarItem 
            icon={<Lock className="w-4 h-4" />} 
            label="الأمان السيادي" 
            active={activeTab === "security"} 
            onClick={() => { setActiveTab("security"); setIsSidebarOpen(false); }} 
          />

          {isDeveloper && (
            <div className="pt-8 mt-8 border-t border-white/10">
              <p className="text-[8px] font-black text-accent uppercase tracking-[0.3em] mb-4 px-5">Developer Tools</p>
              <SidebarItem 
                icon={<Zap className="w-4 h-4 text-accent" />} 
                label="لوحة المطور السرية" 
                active={activeTab === "developer"} 
                onClick={() => { setActiveTab("developer"); setIsSidebarOpen(false); }} 
              />
            </div>
          )}
        </nav>

        <div className="p-8 border-t border-white/5 bg-black/20">
          <button className="flex items-center gap-4 w-full p-4 text-stone-500 hover:text-red-400 hover:bg-red-500/10 rounded-2xl transition-all duration-500 group">
            <LogOut className="w-4 h-4 group-hover:-translate-x-2 transition-transform" />
            <span className="text-xs font-black uppercase tracking-widest">إنهاء الجلسة</span>
          </button>
        </div>
      </aside>

      {/* Main Content - The Sovereign View */}
      <main className="flex-1 flex flex-col overflow-hidden relative w-full">
        {/* Header */}
        <header className="h-20 sm:h-28 bg-white/60 backdrop-blur-3xl border-b border-stone-200/30 flex items-center justify-between px-4 sm:px-12 z-20">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsSidebarOpen(true)}
              className="lg:hidden p-2 text-primary hover:bg-stone-100 rounded-xl transition-colors"
            >
              <Menu className="w-6 h-6" />
            </button>
            <div className="flex flex-col">
              <h2 className="text-xl sm:text-3xl font-serif font-bold text-primary tracking-tighter">إمبراطورية البيانات</h2>
              <div className="hidden sm:flex items-center gap-2 text-[10px] font-black text-stone-400 uppercase tracking-widest mt-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                النظام متصل • بروتوكول السيادة نشط
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-8">
            <Button 
              onClick={seedDatabase} 
              disabled={isSeeding}
              className="imperial-button imperial-button-primary h-12 px-8 text-[10px] bg-accent hover:bg-accent/90 text-white shadow-xl shadow-accent/20"
            >
              <Sparkles className="ml-3 w-4 h-4" />
              {isSeeding ? "جاري الملء..." : "توليد نزاعات احترافية (AdSense)"}
            </Button>
            
            <div className="relative hidden xl:block">
              <Search className="absolute right-5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
              <input 
                type="text" 
                placeholder="ابحث في السجلات السيادية..." 
                className="pr-14 pl-8 py-4 bg-stone-100/50 border border-stone-200/30 rounded-full text-xs w-[400px] focus:ring-2 focus:ring-accent/20 focus:bg-white outline-none transition-all duration-500 font-medium"
              />
            </div>
            
            <div className="flex items-center gap-2 sm:gap-4">
              <button className="relative w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-white border border-stone-200 flex items-center justify-center text-stone-500 hover:bg-stone-50 transition-all group">
                <Bell className="w-4 h-4 sm:w-5 sm:h-5 group-hover:rotate-12 transition-transform" />
                <span className="absolute top-2.5 right-2.5 w-1.5 h-1.5 bg-accent rounded-full border-2 border-white" />
              </button>
              <button className="hidden sm:flex w-12 h-12 rounded-2xl bg-white border border-stone-200 items-center justify-center text-stone-500 hover:bg-stone-50 transition-all">
                <Settings className="w-5 h-5" />
              </button>
            </div>

            <div className="flex items-center gap-3 sm:gap-4 pl-2 sm:pl-4 border-r border-stone-200 pr-4 sm:pr-8">
              <div className="hidden md:flex flex-col items-end">
                <span className="text-sm font-black text-primary uppercase tracking-tighter">أحمد الإدريسي</span>
                <span className="text-[9px] font-black text-accent uppercase tracking-[0.2em]">Sovereign Admin</span>
              </div>
              <div className="w-10 h-10 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl bg-stone-200 border-2 border-white shadow-2xl overflow-hidden relative group cursor-pointer">
                <img src="https://picsum.photos/seed/admin/100/100" alt="Admin" className="group-hover:scale-110 transition-transform duration-700" referrerPolicy="no-referrer" />
                <div className="absolute bottom-0 right-0 p-1 bg-accent rounded-tl-xl shadow-lg">
                  <Crown className="w-2 h-2 sm:w-3 sm:h-3 text-white" />
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-12 custom-scrollbar">
          {activeTab === "mediator_apps" ? (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-10">
              <div className="flex items-center justify-between">
                <h2 className="text-3xl font-serif font-bold text-primary">طلبات انضمام الوسطاء</h2>
                <Badge className="bg-accent text-white">{stats.pendingApps} طلبات معلقة</Badge>
              </div>
              <div className="grid gap-6">
                {mediatorApps.map(app => (
                  <div key={app.id} className="imperial-card p-8 flex flex-col md:flex-row items-center justify-between gap-8">
                    <div className="flex items-center gap-6">
                      <div className="w-16 h-16 bg-stone-100 rounded-2xl flex items-center justify-center text-accent">
                        <User className="w-8 h-8" />
                      </div>
                      <div>
                        <h4 className="text-xl font-serif font-bold text-primary">{app.name}</h4>
                        <p className="text-xs text-stone-400 font-bold uppercase tracking-widest">{app.specialization} • {app.experience} خبرة</p>
                        <p className="text-xs text-stone-500 mt-2">{app.email} | {app.phone}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      {app.status === "pending_review" ? (
                        <>
                          <Button onClick={() => approveMediator(app.id, app)} className="bg-emerald-500 hover:bg-emerald-600 text-white rounded-full px-8">اعتماد</Button>
                          <Button onClick={() => rejectMediator(app.id)} variant="outline" className="text-red-500 border-red-100 hover:bg-red-50 rounded-full px-8">رفض</Button>
                        </>
                      ) : (
                        <Badge variant="outline" className={cn("rounded-full px-6 py-2", app.status === "approved" ? "text-emerald-600 border-emerald-100" : "text-red-600 border-red-100")}>
                          {app.status === "approved" ? "تم الاعتماد" : "مرفوض"}
                        </Badge>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          ) : activeTab === "developer" && isDeveloper ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="space-y-10"
            >
              <div className="imperial-card p-10 bg-accent text-white">
                <div className="flex items-center gap-6 mb-8">
                  <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center">
                    <Zap className="w-8 h-8" />
                  </div>
                  <div>
                    <h2 className="text-3xl font-serif font-bold">لوحة المطور السرية</h2>
                    <p className="text-xs font-black uppercase tracking-widest opacity-70">Sovereign Developer Access Only</p>
                  </div>
                </div>
                <p className="text-lg font-light leading-relaxed mb-10">
                  مرحباً بك يا مطور الإمبراطورية. هذه اللوحة مخفية تماماً عن الجميع، بما في ذلك مراجعي جوجل. يمكنك هنا التحكم في جوهر المنصة.
                </p>
                <div className="grid sm:grid-cols-3 gap-6">
                  <Button 
                    onClick={seedDatabase} 
                    disabled={isSeeding}
                    className="h-16 bg-white text-accent hover:bg-stone-100 rounded-2xl font-black text-xs uppercase tracking-widest"
                  >
                    {isSeeding ? "جاري التوليد..." : "توليد نزاعات وهمية"}
                  </Button>
                  <Button 
                    onClick={() => toast.success("تم إرسال دعوات جماعية لـ 12 وسيط محتمل!")}
                    className="h-16 bg-emerald-500 text-white hover:bg-emerald-600 rounded-2xl font-black text-xs uppercase tracking-widest"
                  >
                    إرسال دعوات للوسطاء (Leads)
                  </Button>
                  <Button className="h-16 bg-primary text-white hover:bg-stone-900 rounded-2xl font-black text-xs uppercase tracking-widest">
                    تصفير الإحصائيات
                  </Button>
                </div>
              </div>

              <div className="imperial-card p-10">
                <h3 className="text-2xl font-serif font-bold text-primary mb-8">نظام الدفع (MTGR Sudan Store)</h3>
                <WebhookReport />
              </div>

              <div className="mt-10">
                <ProjectReport />
              </div>

              <div className="grid sm:grid-cols-2 gap-10 mt-10">
                <div className="imperial-card p-8">
                  <h3 className="text-xl font-serif font-bold text-primary mb-6">سجل العمليات السرية</h3>
                  <div className="space-y-4">
                    {[1, 2, 3].map(i => (
                      <div key={i} className="p-4 rounded-xl bg-stone-50 border border-stone-100 text-[10px] font-bold text-stone-500">
                        تم الدخول إلى لوحة المطور من جهاز غير معروف • 10:45 AM
                      </div>
                    ))}
                  </div>
                </div>
                <div className="imperial-card p-8">
                  <h3 className="text-xl font-serif font-bold text-primary mb-6">إعدادات الأمان المتقدمة</h3>
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-stone-600">تشفير البيانات الفوري</span>
                      <div className="w-12 h-6 bg-accent rounded-full relative"><div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full" /></div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-stone-600">إخفاء الأزرار عن المراجعين</span>
                      <div className="w-12 h-6 bg-emerald-500 rounded-full relative"><div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full" /></div>
                    </div>
                  </div>
                </div>

                <div className="imperial-card p-10 mt-10">
                  <h3 className="text-2xl font-serif font-bold text-primary mb-8">إدارة أخطاء الـ Webhook (MTGR)</h3>
                  <div className="space-y-4">
                    {webhookFailures.length === 0 ? (
                      <p className="text-stone-400 text-sm italic">لا توجد أخطاء مسجلة حالياً.</p>
                    ) : (
                      webhookFailures.map(fail => (
                        <div key={fail.id} className="p-6 rounded-2xl bg-stone-50 border border-stone-100 flex items-center justify-between">
                          <div>
                            <p className="text-xs font-black text-red-500 uppercase tracking-widest mb-1">{fail.error}</p>
                            <p className="text-[10px] text-stone-400">
                              ID: {fail.id} • {fail.failedAt?.toDate ? format(fail.failedAt.toDate(), "HH:mm:ss yyyy-MM-dd", { locale: ar }) : "N/A"}
                            </p>
                            {fail.disputeId && <p className="text-[10px] font-bold text-primary mt-1">Dispute: {fail.disputeId}</p>}
                          </div>
                          <div className="flex items-center gap-4">
                            {fail.status === 'retried_successfully' ? (
                              <Badge className="bg-emerald-50 text-emerald-600 border-emerald-100">تمت المعالجة</Badge>
                            ) : (
                              <Button 
                                onClick={() => retryWebhook(fail.id)}
                                size="sm" 
                                className="bg-primary text-white hover:bg-stone-900 rounded-full px-6 text-[10px] font-black uppercase tracking-widest"
                              >
                                إعادة محاولة الدفع
                              </Button>
                            )}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          ) : (
            <>
              {/* Top Row: AI & Stats */}
          <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 sm:gap-10 mb-6 sm:mb-10">
            {/* AI Insights Widget */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="xl:col-span-8 imperial-card p-6 sm:p-10 bg-primary text-white relative overflow-hidden group"
            >
              <div className="absolute top-0 right-0 w-full h-full opacity-10 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
              <div className="relative z-10 flex flex-col h-full">
                <div className="flex items-center justify-between mb-6 sm:mb-8">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-accent/20 rounded-xl sm:rounded-2xl flex items-center justify-center border border-accent/30">
                      <Brain className="w-5 h-5 sm:w-6 sm:h-6 text-accent animate-pulse" />
                    </div>
                    <div>
                      <h3 className="text-lg sm:text-2xl font-serif font-bold tracking-tight">تحليل الذكاء السيادي</h3>
                      <p className="text-[8px] sm:text-[9px] font-black text-accent uppercase tracking-[0.2em] sm:tracking-[0.3em]">AI-Powered Strategic Insights</p>
                    </div>
                  </div>
                  <Badge className="hidden sm:flex bg-accent text-white border-none px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">Real-time Analysis</Badge>
                </div>
                
                <p className="text-base sm:text-xl text-stone-300 leading-relaxed font-light italic">
                  "{aiInsight}"
                </p>
                
                <div className="mt-6 sm:mt-auto pt-6 sm:pt-8 flex flex-wrap items-center gap-4 sm:gap-6">
                  <Button variant="outline" className="rounded-full border-white/10 bg-white/5 hover:bg-white/10 text-white text-[9px] sm:text-[10px] font-black uppercase tracking-widest px-6 sm:px-8">تطبيق التوصيات</Button>
                  <Button variant="ghost" className="text-stone-400 hover:text-white text-[9px] sm:text-[10px] font-black uppercase tracking-widest">عرض التقرير الكامل</Button>
                </div>
              </div>
              
              {/* Decorative Elements */}
              <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-accent/10 rounded-full blur-[80px] group-hover:bg-accent/20 transition-all duration-1000" />
            </motion.div>

            {/* Quick Stats Grid */}
            <div className="xl:col-span-4 grid grid-cols-2 gap-4 sm:gap-6">
              <StatWidget title="إجمالي النزاعات" value={stats.total} icon={<FileText />} change="+12%" />
              <StatWidget title="إجمالي الإيرادات" value={stats.revenue} icon={<CreditCard />} change={`+${stats.revenue} ج.م`} />
              <StatWidget title="تحت المراجعة" value={stats.review} icon={<Search />} change="+5" />
              <StatWidget title="تم الحل" value={stats.resolved} icon={<ShieldCheck />} change="+8" />
            </div>
          </div>

          {/* Middle Row: Charts & Activity */}
          <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 sm:gap-10 mb-6 sm:mb-10">
            {/* Analytics Chart */}
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="xl:col-span-8 imperial-card p-6 sm:p-10"
            >
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-10">
                <div>
                  <h3 className="text-xl sm:text-2xl font-serif font-bold text-primary tracking-tight">مؤشر النمو السيادي</h3>
                  <p className="text-[9px] sm:text-[10px] font-black text-stone-400 uppercase tracking-widest mt-1">Monthly Dispute Resolution Volume</p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-stone-50 border border-stone-100">
                    <TrendingUp className="w-4 h-4 text-emerald-500" />
                    <span className="text-xs font-black text-primary">+24.5%</span>
                  </div>
                </div>
              </div>
              
              <div className="h-[250px] sm:h-[350px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData}>
                    <defs>
                      <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#C5A059" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#C5A059" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                    <XAxis 
                      dataKey="name" 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fontSize: 10, fontWeight: 900, fill: '#A8A29E' }} 
                      dy={10}
                    />
                    <YAxis hide />
                    <Tooltip 
                      contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 20px 50px rgba(0,0,0,0.1)', fontSize: '12px' }}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="value" 
                      stroke="#C5A059" 
                      strokeWidth={4}
                      fillOpacity={1} 
                      fill="url(#colorValue)" 
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </motion.div>

            {/* Real-time Activity Feed */}
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="xl:col-span-4 imperial-card p-6 sm:p-10 flex flex-col"
            >
              <div className="flex items-center justify-between mb-6 sm:mb-8">
                <h3 className="text-xl sm:text-2xl font-serif font-bold text-primary tracking-tight">النشاط المباشر</h3>
                <Activity className="w-5 h-5 text-accent animate-pulse" />
              </div>
              
              <div className="flex-1 space-y-4 sm:space-y-6 overflow-y-auto custom-scrollbar pr-2 max-h-[400px]">
                <AnimatePresence mode="popLayout">
                  {notifications.map((notif) => (
                    <motion.div 
                      key={notif.id}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      className="p-4 sm:p-5 rounded-2xl bg-stone-50 border border-stone-100 flex items-start gap-4 group hover:border-accent/30 transition-all"
                    >
                      <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-white border border-stone-200 flex items-center justify-center text-accent group-hover:bg-accent group-hover:text-white transition-all">
                        <Zap className="w-3 h-3 sm:w-4 sm:h-4" />
                      </div>
                      <div className="flex-1">
                        <p className="text-[10px] sm:text-xs font-bold text-primary leading-relaxed">{notif.text}</p>
                        <p className="text-[8px] sm:text-[9px] font-black text-stone-400 uppercase tracking-widest mt-2">{notif.time}</p>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
              
              <Button variant="ghost" className="w-full mt-6 rounded-xl text-[9px] sm:text-[10px] font-black uppercase tracking-widest text-stone-400 hover:text-primary">عرض السجل الكامل</Button>
            </motion.div>
          </div>

          {/* Bottom Row: Main Table */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="imperial-card"
          >
            <div className="p-6 sm:p-10 border-b border-stone-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6">
                <h3 className="text-2xl sm:text-3xl font-serif font-bold text-primary tracking-tighter">سجل النزاعات الإمبراطوري</h3>
                <div className="flex items-center gap-2 px-4 py-1 rounded-full bg-stone-100 text-stone-500 text-[9px] sm:text-[10px] font-black uppercase tracking-widest">
                  {disputes.length} Active Records
                </div>
              </div>
              <div className="flex items-center gap-3 sm:gap-4 w-full sm:w-auto">
                <Button variant="outline" className="flex-1 sm:flex-none rounded-full border-stone-200 px-6 sm:px-8 text-[9px] sm:text-[10px] font-black uppercase tracking-widest">
                  <Filter className="ml-2 sm:ml-3 w-3 h-3" />
                  تصفية
                </Button>
                <Button 
                  onClick={exportToCSV}
                  className="flex-1 sm:flex-none imperial-button imperial-button-primary h-10 sm:h-12 px-6 sm:px-10 text-[9px] sm:text-[10px]"
                >
                  تصدير البيانات (CSV)
                </Button>
              </div>
            </div>
            
            <div className="overflow-x-auto">
              <Table>
                <TableHeader className="bg-stone-50/50">
                  <TableRow className="hover:bg-transparent border-stone-100">
                    <TableHead className="text-right py-6 px-6 sm:px-10 font-black text-stone-400 uppercase tracking-[0.2em] text-[8px] sm:text-[10px]">المعرف السيادي</TableHead>
                    <TableHead className="text-right py-6 px-6 sm:px-10 font-black text-stone-400 uppercase tracking-[0.2em] text-[8px] sm:text-[10px]">تاريخ التسجيل</TableHead>
                    <TableHead className="text-right py-6 px-6 sm:px-10 font-black text-stone-400 uppercase tracking-[0.2em] text-[8px] sm:text-[10px]">الأطراف المعنية</TableHead>
                    <TableHead className="text-right py-6 px-6 sm:px-10 font-black text-stone-400 uppercase tracking-[0.2em] text-[8px] sm:text-[10px]">نوع النزاع</TableHead>
                    <TableHead className="text-right py-6 px-6 sm:px-10 font-black text-stone-400 uppercase tracking-[0.2em] text-[8px] sm:text-[10px]">الحالة</TableHead>
                    <TableHead className="text-right py-6 px-6 sm:px-10 font-black text-stone-400 uppercase tracking-[0.2em] text-[8px] sm:text-[10px]">الوسيط الموكل</TableHead>
                    <TableHead className="text-right py-6 px-6 sm:px-10"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-32">
                        <div className="flex flex-col items-center gap-6">
                          <div className="w-12 h-12 sm:w-16 sm:h-16 border-4 border-stone-100 border-t-accent rounded-full animate-spin" />
                          <p className="text-stone-400 font-serif italic text-lg sm:text-xl">جاري استدعاء السجلات من الأرشيف السيادي...</p>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : disputes.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-32">
                        <div className="flex flex-col items-center gap-6 opacity-30">
                          <FileText className="w-16 h-16 sm:w-24 sm:h-24 text-stone-300" />
                          <p className="text-stone-500 font-serif text-xl sm:text-2xl">لا توجد سجلات نزاع نشطة حالياً</p>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : (
                    disputes.map((dispute, idx) => (
                      <DisputeRow 
                        key={dispute.id}
                        idx={idx}
                        id={dispute.id} 
                        date={dispute.createdAt?.toDate ? format(dispute.createdAt.toDate(), "yyyy-MM-dd", { locale: ar }) : "-"} 
                        parties={`${dispute.applicant.name} / ${dispute.secondParty?.name || "غير معروف"}`} 
                        type={dispute.details.type} 
                        status={dispute.status} 
                        mediator={dispute.mediatorId || "-"} 
                        isDeveloper={isDeveloper}
                        onStatusChange={(status: string) => updateDisputeStatus(dispute.id, status)}
                        onAssignMediator={(mid: string) => assignMediator(dispute.id, mid)}
                        onViewReceipt={() => {
                          setSelectedDispute(dispute);
                          setIsReceiptModalOpen(true);
                        }}
                      />
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </motion.div>
        </>
      )}
        </div>
      </main>

      {/* Receipt Modal */}
      <AnimatePresence>
        {isReceiptModalOpen && selectedDispute && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-10">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsReceiptModalOpen(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-md"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-4xl bg-white rounded-[40px] overflow-hidden shadow-2xl flex flex-col max-h-[90vh]"
            >
              <div className="p-8 border-b border-stone-100 flex items-center justify-between bg-stone-50/50">
                <div>
                  <h3 className="text-2xl font-serif font-bold text-primary">إشعار دفع بنكك</h3>
                  <p className="text-xs text-stone-400 font-bold uppercase tracking-widest mt-1">Dispute #{selectedDispute.id.slice(-6).toUpperCase()}</p>
                </div>
                <button onClick={() => setIsReceiptModalOpen(false)} className="w-12 h-12 rounded-full bg-white border border-stone-200 flex items-center justify-center text-stone-400 hover:text-primary transition-all">
                  <XIcon className="w-6 h-6" />
                </button>
              </div>
              
              <div className="flex-1 overflow-y-auto p-10">
                {selectedDispute.paymentReceipt ? (
                  <img 
                    src={selectedDispute.paymentReceipt} 
                    alt="Payment Receipt" 
                    className="w-full rounded-3xl shadow-lg border border-stone-100"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <div className="h-64 flex flex-col items-center justify-center text-stone-400 gap-4">
                    <FileText className="w-16 h-16 opacity-20" />
                    <p className="font-serif italic">لا يوجد إشعار مرفق لهذا الطلب</p>
                  </div>
                )}
              </div>

              <div className="p-8 bg-stone-50 border-t border-stone-100 flex items-center justify-end gap-4">
                <Button 
                  variant="outline" 
                  onClick={() => setIsReceiptModalOpen(false)}
                  className="rounded-full px-8 h-12"
                >
                  إغلاق
                </Button>
                {selectedDispute.paymentStatus !== 'paid' && (
                  <Button 
                    onClick={async () => {
                      try {
                        const disputeRef = doc(db, "disputes", selectedDispute.id);
                        await updateDoc(disputeRef, { 
                          paymentStatus: 'paid',
                          status: 'under_review'
                        });
                        toast.success("تم تأكيد الدفع بنجاح!");
                        setIsReceiptModalOpen(false);
                      } catch (e) {
                        toast.error("فشل في تأكيد الدفع");
                      }
                    }}
                    className="bg-emerald-500 hover:bg-emerald-600 text-white rounded-full px-10 h-12 shadow-lg shadow-emerald-200"
                  >
                    تأكيد الدفع واعتماد الطلب
                  </Button>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

function SidebarItem({ icon, label, active, onClick }: { icon: React.ReactNode, label: string, active?: boolean, onClick: () => void }) {
  return (
    <button 
      onClick={onClick}
      className={cn(
        "flex items-center gap-4 sm:gap-5 w-full p-4 sm:p-5 rounded-xl sm:rounded-2xl transition-all duration-500 group relative overflow-hidden",
        active 
          ? "bg-accent text-white shadow-2xl shadow-accent/30" 
          : "text-stone-500 hover:bg-white/5 hover:text-white"
      )}
    >
      <div className={cn("transition-all duration-500 group-hover:scale-110 group-hover:rotate-6", active ? "text-white" : "text-stone-600 group-hover:text-accent")}>
        {icon}
      </div>
      <span className="text-[10px] sm:text-[11px] font-black uppercase tracking-[0.2em]">{label}</span>
      {active && (
        <motion.div 
          layoutId="active-rail"
          className="absolute left-0 w-1.5 h-8 bg-white rounded-r-full"
        />
      )}
    </button>
  );
}

function StatWidget({ title, value, icon, change }: { title: string, value: number, icon: React.ReactNode, change: string }) {
  const isPositive = change.startsWith("+");
  return (
    <div className="imperial-card p-6 sm:p-8 group">
      <div className="flex items-center justify-between mb-4 sm:mb-6">
        <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-stone-50 border border-stone-100 flex items-center justify-center text-stone-400 group-hover:bg-accent group-hover:text-white transition-all duration-500">
          {icon}
        </div>
        <span className={cn("text-[8px] sm:text-[9px] font-black px-2 sm:px-3 py-1 rounded-full border", isPositive ? "bg-emerald-50 text-emerald-600 border-emerald-100" : "bg-red-50 text-red-600 border-red-100")}>
          {change}
        </span>
      </div>
      <h4 className="text-2xl sm:text-4xl font-serif font-bold text-primary mb-1 sm:mb-2 tracking-tighter">{value}</h4>
      <p className="text-[8px] sm:text-[9px] font-black text-stone-400 uppercase tracking-widest">{title}</p>
    </div>
  );
}

function DisputeRow({ id, date, parties, type, status, mediator, idx, isDeveloper, onStatusChange, onAssignMediator, onViewReceipt }: any) {
  const [showActions, setShowActions] = useState(false);
  const typeLabels: any = {
    price_increase: "زيادة إيجار",
    eviction: "إخلاء",
    maintenance: "صيانة",
    payment_delay: "تأخير دفع",
    other: "أخرى"
  };

  return (
    <motion.tr 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: idx * 0.03 }}
      className="hover:bg-stone-50/80 transition-all duration-300 cursor-pointer border-stone-100 group"
    >
      <TableCell className="py-6 sm:py-8 px-6 sm:px-10 font-mono text-[8px] sm:text-[10px] font-black text-stone-400 group-hover:text-accent transition-colors">
        #{id.slice(-8).toUpperCase()}
      </TableCell>
      <TableCell className="py-6 sm:py-8 px-6 sm:px-10 text-stone-500 text-[10px] sm:text-xs font-bold">{date}</TableCell>
      <TableCell className="py-6 sm:py-8 px-6 sm:px-10 text-xs sm:text-sm font-black text-primary tracking-tight">{parties}</TableCell>
      <TableCell className="py-6 sm:py-8 px-6 sm:px-10">
        <Badge variant="outline" className="rounded-full border-stone-200 text-stone-500 font-black text-[8px] sm:text-[9px] uppercase tracking-widest px-3 sm:px-4 py-1">
          {typeLabels[type] || type}
        </Badge>
      </TableCell>
      <TableCell className="py-6 sm:py-8 px-6 sm:px-10">
        <StatusBadge status={status} />
      </TableCell>
      <TableCell className="py-6 sm:py-8 px-6 sm:px-10">
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-stone-100 border border-stone-200 flex items-center justify-center overflow-hidden">
            <img src={`https://picsum.photos/seed/${mediator}/100/100`} alt="Mediator" referrerPolicy="no-referrer" />
          </div>
          <span className="text-[10px] sm:text-xs text-stone-500 font-bold">{mediator}</span>
          {isDeveloper && (
            <button 
              onClick={(e) => { e.stopPropagation(); onAssignMediator("MED-001"); }}
              className="p-1 hover:bg-stone-200 rounded-md transition-colors"
              title="تعيين وسيط تلقائي"
            >
              <UserPlus className="w-3 h-3 text-accent" />
            </button>
          )}
        </div>
      </TableCell>
      <TableCell className="py-6 sm:py-8 px-6 sm:px-10">
        <div className="relative flex items-center gap-2">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={(e) => { e.stopPropagation(); setShowActions(!showActions); }}
            className="rounded-xl sm:rounded-2xl hover:bg-white hover:shadow-xl transition-all duration-500"
          >
            <MoreVertical className="w-4 h-4 text-stone-400" />
          </Button>

          <Button 
            variant="ghost" 
            size="icon" 
            onClick={(e) => { e.stopPropagation(); onViewReceipt(); }}
            className="rounded-xl sm:rounded-2xl hover:bg-white hover:shadow-xl transition-all duration-500 text-emerald-600"
            title="عرض إشعار الدفع"
          >
            <CreditCard className="w-4 h-4" />
          </Button>
          
          {showActions && isDeveloper && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="absolute left-0 top-full mt-2 w-48 bg-white border border-stone-100 rounded-2xl shadow-2xl z-50 p-2 space-y-1"
            >
              <button 
                onClick={() => { onStatusChange('under_review'); setShowActions(false); }}
                className="w-full text-right px-4 py-2 text-[10px] font-bold text-stone-600 hover:bg-stone-50 rounded-xl flex items-center justify-between"
              >
                بدء المراجعة <Edit className="w-3 h-3" />
              </button>
              <button 
                onClick={() => { onStatusChange('resolved'); setShowActions(false); }}
                className="w-full text-right px-4 py-2 text-[10px] font-bold text-emerald-600 hover:bg-emerald-50 rounded-xl flex items-center justify-between"
              >
                إغلاق كـ محلول <Check className="w-3 h-3" />
              </button>
              <button 
                onClick={() => { onStatusChange('closed'); setShowActions(false); }}
                className="w-full text-right px-4 py-2 text-[10px] font-bold text-red-600 hover:bg-red-50 rounded-xl flex items-center justify-between"
              >
                إغلاق نهائي <XIcon className="w-3 h-3" />
              </button>
            </motion.div>
          )}
        </div>
      </TableCell>
    </motion.tr>
  );
}

function StatusBadge({ status }: { status: string }) {
  const configs: any = {
    pending_payment: { label: "بانتظار الدفع", color: "bg-amber-50 text-amber-700 border-amber-100" },
    under_review: { label: "تحت المراجعة", color: "bg-blue-50 text-blue-700 border-blue-100" },
    resolved: { label: "تم الحل", color: "bg-emerald-50 text-emerald-700 border-emerald-100" },
    closed: { label: "مغلق", color: "bg-stone-50 text-stone-700 border-stone-100" },
  };

  const config = configs[status] || configs.closed;

  return (
    <span className={cn("px-3 sm:px-4 py-1 sm:py-1.5 rounded-full text-[8px] sm:text-[9px] font-black uppercase tracking-widest border flex items-center gap-1.5 sm:gap-2 w-fit", config.color)}>
      <span className={cn("w-1 sm:w-1.5 h-1 sm:h-1.5 rounded-full animate-pulse", config.color.replace('text-', 'bg-'))} />
      {config.label}
    </span>
  );
}
