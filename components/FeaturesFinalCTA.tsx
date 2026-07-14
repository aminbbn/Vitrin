import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Sparkle } from '@phosphor-icons/react';

interface FeaturesFinalCTAProps {
  onStartFreeClick: () => void;
  theme: 'light' | 'dark';
}

export const FeaturesFinalCTA: React.FC<FeaturesFinalCTAProps> = ({ onStartFreeClick, theme }) => {
  return (
    <section 
      id="final-cta" 
      className="relative py-20 lg:py-28 bg-[#10B981] text-white overflow-hidden text-center select-none"
    >
      {/* Dynamic ambient background glow */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.2)_0%,transparent_80%)] pointer-events-none" />
      
      <div className="max-w-[1200px] mx-auto px-6 relative z-10">
        <div className="max-w-2xl mx-auto space-y-6">
          
          <div className="inline-flex items-center gap-1.5 bg-white/10 px-3.5 py-1.5 rounded-full border border-white/20 text-[10px] font-black uppercase tracking-[0.15em] mx-auto">
            <Sparkle className="w-3.5 h-3.5 text-white" weight="fill" />
            <span>یک پلتفرم متصل، یکپارچه و مدرن</span>
          </div>

          <h2 className="text-4xl md:text-5xl font-black text-white leading-none tracking-tight">
            آماده‌اید منوی آنلاین خود را بسازید؟
          </h2>
          
          <p className="text-emerald-50 max-w-lg mx-auto text-sm md:text-base font-bold leading-relaxed opacity-95">
            با پلتفرم مدیریت منوی ویترین، کنترل کاملی بر روی قیمت‌ها، ظاهر دسته‌بندی‌ها، تجربه سفارش مشتری و آشپزخانه خود داشته باشید.
          </p>

          <div className="pt-6 flex justify-center">
            <button 
              onClick={onStartFreeClick}
              className="px-8 py-4.5 bg-slate-900 hover:bg-slate-800 text-white rounded-2xl font-black text-sm shadow-2xl active:scale-[0.98] focus:outline-none focus:ring-4 focus:ring-black/10 transition-all flex items-center gap-3 group border-0 cursor-pointer"
            >
              <span>هم‌اکنون منوی اختصاصی خود را طراحی کنید</span>
              <span className="w-5 h-5 rounded-full bg-white/10 flex items-center justify-center transition-transform group-hover:-translate-x-0.5">
                <ArrowLeft className="w-3.5 h-3.5 text-white" />
              </span>
            </button>
          </div>

        </div>
      </div>
    </section>
  );
};
