import React, { useState, useEffect, useRef } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { FeatureAtlas, FeatureModuleId } from './FeatureAtlas';
import { ArrowLeft, Play } from '@phosphor-icons/react';

interface FeaturesHeroProps {
  onLoginClick?: () => void;
  onStartFreeClick: () => void;
  theme: 'light' | 'dark';
}

export const FeaturesHero: React.FC<FeaturesHeroProps> = ({
  onLoginClick,
  onStartFreeClick,
  theme
}) => {
  const shouldReduceMotion = useReducedMotion();
  
  // Refactored State according to Non-Negotiable constraints
  const [activeNode, setActiveNode] = useState<FeatureModuleId>('studio');
  const [lockedNode, setLockedNode] = useState<FeatureModuleId>('studio');
  const [isInView, setIsInView] = useState<boolean>(true);
  const [hasUserInteracted, setHasUserInteracted] = useState<boolean>(false);
  const [isPointerInside, setIsPointerInside] = useState<boolean>(false);
  const [isDocumentHidden, setIsDocumentHidden] = useState<boolean>(typeof document !== 'undefined' ? document.hidden : false);

  const heroContainerRef = useRef<HTMLDivElement | null>(null);

  // Derived autoplay eligibility state
  const canAutoplay = 
    isInView && 
    !hasUserInteracted && 
    !isPointerInside && 
    !shouldReduceMotion && 
    !isDocumentHidden;

  // Handle document visibility changes
  useEffect(() => {
    if (typeof document === 'undefined') return;

    const handleVisibilityChange = () => {
      setIsDocumentHidden(document.hidden);
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  // Intersection Observer for autoplay viewport awareness
  useEffect(() => {
    if (shouldReduceMotion) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsInView(entry.isIntersecting);
      },
      { threshold: 0.15 }
    );

    if (heroContainerRef.current) {
      observer.observe(heroContainerRef.current);
    }

    return () => observer.disconnect();
  }, [shouldReduceMotion]);

  // Autoplay cycle timer at 4400ms interval
  useEffect(() => {
    if (!canAutoplay) return;

    const cycleOrder: FeatureModuleId[] = ['studio', 'products', 'customer', 'orders'];

    const timer = setInterval(() => {
      setActiveNode((current) => {
        const nextIndex = (cycleOrder.indexOf(current) + 1) % cycleOrder.length;
        const nextModule = cycleOrder[nextIndex];
        setLockedNode(nextModule);
        return nextModule;
      });
    }, 4400);

    return () => clearInterval(timer);
  }, [canAutoplay]);

  const handleStartTour = () => {
    setHasUserInteracted(true);
    const firstModule = document.getElementById('studio');
    if (firstModule) {
      const yOffset = -72; // header height offset
      const y = firstModule.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  const handlePreviewModule = (module: FeatureModuleId) => {
    setActiveNode(module);
  };

  const handleActivateModule = (module: FeatureModuleId) => {
    setHasUserInteracted(true);
    setLockedNode(module);
    setActiveNode(module);
  };

  const handlePointerPresenceChange = (inside: boolean) => {
    setIsPointerInside(inside);
    if (!inside) {
      // Revert to locked state when pointer exits
      setActiveNode(lockedNode);
    }
  };

  return (
    <section 
      ref={heroContainerRef}
      className="relative py-16 lg:py-24 bg-transparent text-slate-900 dark:text-slate-100 overflow-hidden transition-colors duration-300"
    >
      {/* Decorative subtle ambient backdrop glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(16,185,129,0.05)_0%,transparent_65%)] dark:bg-[radial-gradient(circle_at_center,rgba(16,185,129,0.03)_0%,transparent_65%)] pointer-events-none" />

      {/* Preserve Non-Negotiable structural layouts exactly */}
      <div className="max-w-[1200px] mx-auto px-6 md:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* RIGHT COL: Copy & CTAs (lg:col-span-5) */}
          <div className="lg:col-span-5 flex flex-col items-start text-right">
            
            {/* Elegant tiny eyebrow tag */}
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-1.5 bg-emerald-500/10 dark:bg-emerald-500/5 text-emerald-600 dark:text-[#19C78C] px-3.5 py-1.5 rounded-full border border-emerald-500/20 dark:border-emerald-500/10 text-[10px] font-black uppercase tracking-[0.15em] mb-6 select-none"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span>تور تعاملی پلتفرم ویترین</span>
            </motion.div>

            {/* Headline with corrected Persian half-spaces */}
            <motion.h1 
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-4xl md:text-5xl lg:text-[48px] font-black tracking-tight leading-[1.15] mb-4 text-[#151817] dark:text-[#F3F6F4]"
            >
              تمام ابزارهای منو و سفارش، <br />
              <span className="text-[#10B981] dark:text-[#19C78C]">در یک سیستم یکپارچه</span>
            </motion.h1>

            {/* Visual Highlight line */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="px-3.5 py-1.5 bg-slate-200/50 dark:bg-[#101412] text-slate-700 dark:text-emerald-400 text-xs font-black rounded-lg border border-slate-300/20 dark:border-[#10B981]/10 mb-6"
            >
              از طراحی تا تحویل سفارش
            </motion.div>

            {/* Meticulously corrected description with Persian half-spaces */}
            <motion.p 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.25 }}
              className="text-sm md:text-base text-slate-500 dark:text-slate-400 font-bold leading-relaxed max-w-[50ch] mb-8"
            >
              چهار ماژول متصل برای طراحی منو، مدیریت محصولات، ساخت تجربه خرید و کنترل سفارشهای رستوران.
            </motion.p>

            {/* Action Buttons */}
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="flex flex-wrap items-center gap-4 w-full"
            >
              {/* Primary CTA with button-in-button micro-interaction */}
              <button
                onClick={handleStartTour}
                className="px-6 py-3.5 bg-slate-900 hover:bg-slate-800 dark:bg-[#10B981] dark:hover:bg-emerald-500 text-white font-black text-xs rounded-xl flex items-center gap-3 transition-all active:scale-[0.98] border-0 cursor-pointer shadow-lg group focus:outline-none"
              >
                <span>شروع تور امکانات</span>
                <span className="w-5 h-5 rounded-full bg-white/10 flex items-center justify-center transition-transform group-hover:-translate-x-0.5">
                  <Play className="w-3 h-3 text-white rotate-180" weight="fill" />
                </span>
              </button>

              {/* Secondary CTA */}
              <button
                onClick={onStartFreeClick}
                className="px-6 py-3.5 bg-white hover:bg-slate-50 dark:bg-transparent dark:hover:bg-white/[0.03] text-slate-800 dark:text-slate-200 font-black text-xs rounded-xl flex items-center gap-2 transition-all border border-slate-300/40 dark:border-white/10 cursor-pointer focus:outline-none"
              >
                <span>ساخت اولین منو</span>
                <ArrowLeft className="w-4 h-4" />
              </button>
            </motion.div>

          </div>

          {/* LEFT COL: Interactive Compact Flow Deck (lg:col-span-7) */}
          <div className="lg:col-span-7 flex items-center justify-center w-full">
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="w-full relative"
            >
              <FeatureAtlas 
                activeModule={activeNode} 
                lockedModule={lockedNode} 
                onPreviewModule={handlePreviewModule} 
                onActivateModule={handleActivateModule} 
                onPointerPresenceChange={handlePointerPresenceChange}
                theme={theme}
              />
            </motion.div>
          </div>

        </div>
      </div>
    </section>
  );
};
