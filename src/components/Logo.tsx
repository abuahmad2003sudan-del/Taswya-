import React from "react";
import { cn } from "@/src/lib/utils";

interface LogoProps {
  className?: string;
  size?: "sm" | "md" | "lg";
  showText?: boolean;
  orientation?: "horizontal" | "vertical";
}

export function Logo({ className, size = "md", showText = true, orientation = "horizontal" }: LogoProps) {
  const sizes = {
    sm: "w-8 h-8",
    md: "w-12 h-12",
    lg: "w-24 h-24",
  };

  const textSizes = {
    sm: "text-lg",
    md: "text-2xl",
    lg: "text-5xl",
  };

  return (
    <div 
      className={cn(
        "flex items-center gap-4", 
        orientation === "vertical" ? "flex-col text-center" : "flex-row",
        className
      )}
      role="img"
      aria-label="شعار منصة تسوية - الوساطة النخبوية"
    >
      <div className={cn(
        "relative flex items-center justify-center rounded-2xl bg-[#0A1929] shadow-2xl overflow-hidden group rotate-[5deg]",
        sizes[size]
      )}>
        {/* Luxurious Background Pattern */}
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-[#B87333] via-transparent to-transparent" />
        
        {/* The Combined T/ت SVG Icon */}
        <svg 
          viewBox="0 0 100 100" 
          className="w-2/3 h-2/3 relative z-10"
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* The "T" and "ت" combined shape */}
          {/* Horizontal line as a bridge/roof */}
          <path 
            d="M20 35 H80" 
            stroke="#B87333" 
            strokeWidth="8" 
            strokeLinecap="round" 
          />
          {/* Vertical stem of T and part of ت */}
          <path 
            d="M50 35 V75" 
            stroke="#B87333" 
            strokeWidth="8" 
            strokeLinecap="round" 
          />
          {/* Curved base of ت representing the bowl/scales */}
          <path 
            d="M25 55 C25 80 75 80 75 55" 
            stroke="#B87333" 
            strokeWidth="8" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          />
          {/* The dots of the Arabic 'ت' - stylized as subtle diamonds */}
          <rect x="42" y="18" width="6" height="6" transform="rotate(45 45 21)" fill="#B87333" />
          <rect x="52" y="18" width="6" height="6" transform="rotate(45 55 21)" fill="#B87333" />
          
          {/* Subtle hint of scales/arch in negative space */}
          <path 
            d="M35 85 Q50 75 65 85" 
            stroke="#B87333" 
            strokeWidth="2" 
            strokeOpacity="0.3" 
            fill="none"
          />
        </svg>
        
        {/* Shimmer Effect */}
        <div className="absolute inset-0 shimmer opacity-20" />
      </div>
      
      {showText && (
        <div className="flex flex-col">
          <span className={cn(
            "font-arabic font-bold tracking-tight text-[#0A1929] leading-tight", 
            textSizes[size]
          )}>
            تسوية
          </span>
          <span className={cn(
            "font-tajawal font-black uppercase tracking-[0.3em] text-[#B87333] mt-1 leading-none",
            size === "lg" ? "text-xs" : "text-[8px]"
          )}>
            Elite Mediation
          </span>
        </div>
      )}
    </div>
  );
}
