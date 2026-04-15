import React from 'react';
import { Badge } from '@/src/components/ui/badge';

interface GoogleAdsProps {
  slot: string;
  format?: 'auto' | 'fluid' | 'rectangle';
  className?: string;
}

export function GoogleAds({ slot, format = 'auto', className = "" }: GoogleAdsProps) {
  return (
    <div className={`w-full flex flex-col items-center justify-center py-8 px-4 ${className}`}>
      <div className="text-[9px] font-black text-stone-400 uppercase tracking-[0.3em] mb-4">Advertisement • إعلان</div>
      <div className="w-full max-w-4xl h-[100px] sm:h-[250px] bg-stone-100 dark:bg-stone-800/50 border border-stone-200 dark:border-stone-800 rounded-3xl flex items-center justify-center relative overflow-hidden group">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
        <div className="text-center space-y-2">
          <p className="text-xs font-bold text-stone-400">Google Ad Placement</p>
          <Badge variant="outline" className="text-[8px] border-stone-300 text-stone-400">Slot: {slot}</Badge>
        </div>
        {/* In a real production environment, you would insert the script here:
            <ins className="adsbygoogle"
                 style={{ display: 'block' }}
                 data-ad-client="ca-pub-XXXXXXXXXXXXXXXX"
                 data-ad-slot={slot}
                 data-ad-format={format}
                 data-full-width-responsive="true"></ins>
        */}
      </div>
    </div>
  );
}
