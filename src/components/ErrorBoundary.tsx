import React, { Component, ErrorInfo, ReactNode } from "react";
import { AlertCircle, RefreshCcw } from "lucide-react";
import { Button } from "@/src/components/ui/button";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public props: Props;
  public state: State = {
    hasError: false,
    error: null,
  };

  constructor(props: Props) {
    super(props);
    this.props = props;
  }

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      let errorMessage = "حدث خطأ غير متوقع. يرجى المحاولة مرة أخرى.";
      
      try {
        if (this.state.error?.message) {
          const parsed = JSON.parse(this.state.error.message);
          if (parsed.error && parsed.error.includes("insufficient permissions")) {
            errorMessage = "ليس لديك الصلاحيات الكافية لإتمام هذه العملية. يرجى التأكد من تسجيل الدخول.";
          }
        }
      } catch (e) {
        // Not a JSON error
      }

      return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-stone-50 font-sans" dir="rtl">
          <div className="max-w-md w-full bg-white p-10 rounded-[2.5rem] shadow-2xl border border-stone-200 text-center">
            <div className="w-20 h-20 bg-red-50 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-inner">
              <AlertCircle className="w-10 h-10 text-red-600" />
            </div>
            <h2 className="text-3xl font-serif font-bold mb-4 text-primary">نعتذر، حدث خطأ تقني</h2>
            <p className="text-stone-500 mb-10 leading-relaxed">{errorMessage}</p>
            <div className="space-y-4">
              <Button 
                onClick={() => window.location.reload()} 
                className="w-full h-14 rounded-2xl bg-primary hover:bg-stone-800 text-white font-bold text-lg shadow-xl shadow-primary/20"
              >
                <RefreshCcw className="ml-3 w-5 h-5" />
                تحديث الصفحة والبدء من جديد
              </Button>
              <Button 
                variant="ghost"
                onClick={() => window.location.href = "/"} 
                className="w-full h-12 rounded-2xl text-stone-400 hover:text-primary"
              >
                العودة للرئيسية
              </Button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
