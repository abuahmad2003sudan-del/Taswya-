import React, { useEffect, useRef } from "react";

interface AdSlotProps {
  adSlot?: string;
  adFormat?: "auto" | "fluid" | "rectangle" | "vertical" | "horizontal";
  fullWidthResponsive?: boolean;
  style?: React.CSSProperties;
}

/**
 * AdSlot Component - Professional Google AdSense Integration
 * Handles width calculation delays and prevents duplicate loading.
 */
export const AdSlot: React.FC<AdSlotProps> = ({
  adSlot = "", // Default empty as requested
  adFormat = "auto",
  fullWidthResponsive = true,
  style = { display: "block" }
}) => {
  const adRef = useRef<HTMLModElement>(null);
  const isLoaded = useRef(false);

  useEffect(() => {
    // Prevent multiple loads for the same instance
    if (isLoaded.current) return;

    const loadAd = () => {
      try {
        if (typeof window !== "undefined" && (window as any).adsbygoogle && adRef.current) {
          // Ensure the element has a width before pushing
          if (adRef.current.offsetWidth === 0) {
            return false;
          }

          if (adRef.current.getAttribute("data-adsbygoogle-status") === "done") {
            return true;
          }

          ((window as any).adsbygoogle = (window as any).adsbygoogle || []).push({});
          isLoaded.current = true;
          return true;
        }
      } catch (error) {
        console.error("AdSense Load Error:", error);
      }
      return false;
    };

    // Use ResizeObserver to wait for the element to have a width
    const observer = new ResizeObserver(() => {
      if (adRef.current && adRef.current.offsetWidth > 0 && !isLoaded.current) {
        const success = loadAd();
        if (success) {
          observer.disconnect();
        }
      }
    });

    if (adRef.current) {
      observer.observe(adRef.current);
    }

    // Fallback timer
    const timer = setTimeout(() => {
      if (!isLoaded.current) {
        loadAd();
      }
    }, 2000);

    return () => {
      observer.disconnect();
      clearTimeout(timer);
    };
  }, [adSlot]);

  return (
    <div className="ad-container my-6 overflow-hidden flex justify-center w-full min-w-[250px]">
      <ins
        ref={adRef}
        className="adsbygoogle"
        style={{ ...style, minWidth: '250px', minHeight: '90px' }}
        data-ad-client="ca-pub-9995476226348881"
        data-ad-slot={adSlot || undefined}
        data-ad-format={adFormat}
        data-full-width-responsive={fullWidthResponsive ? "true" : "false"}
      />
    </div>
  );
};

export default AdSlot;
