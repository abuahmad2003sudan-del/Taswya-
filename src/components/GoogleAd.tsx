import React from "react";
import { cn } from "@/src/lib/utils";
import { AdSlot } from "./AdSlot";

interface GoogleAdProps {
  slot?: string;
  format?: "auto" | "fluid" | "rectangle" | "vertical" | "horizontal";
  className?: string;
  label?: string;
}

/**
 * A professional wrapper for AdSense ads.
 * Uses AdSlot for real implementation while maintaining the imperial styling.
 */
export function GoogleAd({ slot, format = "auto", className, label = "إعلان" }: GoogleAdProps) {
  return (
    <div className={cn("relative my-8 mx-auto overflow-hidden rounded-xl bg-stone-100/50 border border-stone-200/60 flex flex-col items-center justify-center min-h-[100px]", className)}>
      <span className="absolute top-2 right-3 text-[10px] font-bold text-stone-400 uppercase tracking-widest pointer-events-none z-10">
        {label}
      </span>
      
      <div className="w-full h-full">
        <AdSlot adSlot={slot} adFormat={format} />
      </div>
    </div>
  );
}

export function HorizontalAd({ className, label }: { className?: string; label?: string }) {
  return <GoogleAd format="horizontal" className={cn("w-full max-w-4xl h-[90px]", className)} slot="horizontal-banner" label={label} />;
}

export function SquareAd({ className, label }: { className?: string; label?: string }) {
  return <GoogleAd format="rectangle" className={cn("w-[300px] h-[250px]", className)} slot="square-box" label={label} />;
}

export function SidebarAd({ className, label }: { className?: string; label?: string }) {
  return <GoogleAd format="vertical" className={cn("w-[160px] h-[600px]", className)} slot="sidebar-tower" label={label} />;
}
