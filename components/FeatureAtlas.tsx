import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  PaintBrush, 
  Tag as TagIcon, 
  ShoppingBag, 
  CheckCircle,
  Sparkles,
  ArrowRight,
  Clock,
  ArrowUp,
  ArrowDown
} from '@phosphor-icons/react';

export interface AtlasNode {
  id: number;
  title: string;
  shortDesc: string;
  icon: React.ComponentType<any>;
  color: string;
  anchor: string;
}

interface FeatureAtlasProps {
  activeNode: number;
  setActiveNode: (id: number) => void;
  isAutoplay: boolean;
  setIsAutoplay: (autoplay: boolean) => void;
  theme: 'light' | 'dark';
}

export const FeatureAtlas: React.FC<FeatureAtlasProps> = ({
  activeNode,
  setActiveNode,
  isAutoplay,
  setIsAutoplay,
  theme
}) => {
  const nodes: AtlasNode[] = [
    {
      id: 1,
      title: 'استودیو طراحی',
      shortDesc: 'چیدمان اجزا و مدیریت دسته‌بندی‌ها',
      icon: PaintBrush,
      color: '#10B981',
      anchor: 'studio'
    },
    {
      id: 2,
      title: 'مدیریت محصولات',
      shortDesc: 'ویرایش قیمت، تخفیف، موجودی و افزودنی‌ها',
      icon: TagIcon,
      color: '#10B981',
      anchor: 'products'
    },
    {
      id: 3,
      title: 'تجربه مشتری',
      shortDesc: 'گردش کار خرید مشتری روی میز بدون واسطه',
      icon: ShoppingBag,
      color: '#10B981',
      anchor: 'experience'
    },
    {
      id: 4,
      title: 'مدیریت سفارش‌ها',
      shortDesc: 'داشبورد آشپزخانه هوشمند با تغییر زنده وضعیت',
      icon: CheckCircle,
      color: '#10B981',
      anchor: 'orders'
    }
  ];

  // Disable autoplay once user clicks or hovers
  const handleNodeInteraction = (id: number) => {
    setIsAutoplay(false);
    setActiveNode(id);
  };

  const activeNodeData = nodes.find(n => n.id === activeNode) || nodes[0];

  return (
    <div className="w-full relative flex flex-col items-center">
      
      {/* 1. THE ATLAS VISUAL CANVAS */}
      <div className="w-full aspect-[4/3] max-w-[500px] relative bg-white/40 dark:bg-black/20 rounded-[2.5rem] border border-slate-200/50 dark:border-white/[0.05] p-6 shadow-[inset_0_1px_2px_rgba(255,255,255,0.1),0_20px_40px_-15px_rgba(0,0,0,0.03)] dark:shadow-none flex items-center justify-center overflow-hidden">
        
        {/* Subtle grid backdrop */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(16,185,129,0.04)_0%,transparent_70%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(20,30,25,0.015)_1px,transparent_1px),linear-gradient(90deg,rgba(20,30,25,0.015)_1px,transparent_1px)] dark:bg-[linear-gradient(rgba(255,255,255,0.01)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_at_center,white,transparent_80%)]" />

        {/* Dynamic connection paths */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none z-0">
          {/* Central to Node 1 (Top Left) */}
          <motion.line 
            x1="50%" y1="50%" x2="20%" y2="25%" 
            stroke={activeNode === 1 ? '#10B981' : theme === 'dark' ? 'rgba(255,255,255,0.08)' : 'rgba(20,30,25,0.08)'} 
            strokeWidth={activeNode === 1 ? '3' : '1.5'}
            className="transition-colors duration-300"
          />
          {/* Central to Node 2 (Top Right) */}
          <motion.line 
            x1="50%" y1="50%" x2="80%" y2="25%" 
            stroke={activeNode === 2 ? '#10B981' : theme === 'dark' ? 'rgba(255,255,255,0.08)' : 'rgba(20,30,25,0.08)'} 
            strokeWidth={activeNode === 2 ? '3' : '1.5'}
            className="transition-colors duration-300"
          />
          {/* Central to Node 3 (Bottom Left) */}
          <motion.line 
            x1="50%" y1="50%" x2="20%" y2="75%" 
            stroke={activeNode === 3 ? '#10B981' : theme === 'dark' ? 'rgba(255,255,255,0.08)' : 'rgba(20,30,25,0.08)'} 
            strokeWidth={activeNode === 3 ? '3' : '1.5'}
            className="transition-colors duration-300"
          />
          {/* Central to Node 4 (Bottom Right) */}
          <motion.line 
            x1="50%" y1="50%" x2="80%" y2="75%" 
            stroke={activeNode === 4 ? '#10B981' : theme === 'dark' ? 'rgba(255,255,255,0.08)' : 'rgba(20,30,25,0.08)'} 
            strokeWidth={activeNode === 4 ? '3' : '1.5'}
            className="transition-colors duration-300"
          />
        </svg>

        {/* CENTRAL CORE: Vitrin Node */}
        <div className="absolute z-10 w-20 h-20 flex items-center justify-center">
          <motion.div 
            animate={{ 
              scale: [1, 1.05, 1],
              boxShadow: activeNode !== 0 
                ? '0 0 25px rgba(16, 185, 129, 0.25)' 
                : '0 0 15px rgba(16, 185, 129, 0.1)'
            }}
            transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut' }}
            className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#10b981] to-[#059669] flex items-center justify-center relative overflow-hidden select-none"
          >
            <div className="absolute inset-0 border border-white/20 rounded-[inherit] pointer-events-none" />
            <span className="text-white font-black text-lg">ویترین</span>
          </motion.div>
        </div>

        {/* NODE 1: TOP LEFT - DESIGN STUDIO */}
        <button
          onClick={() => handleNodeInteraction(1)}
          onMouseEnter={() => setActiveNode(1)}
          className="absolute top-[18%] left-[12%] z-20 flex flex-col items-center group cursor-pointer focus:outline-none"
        >
          <motion.div 
            animate={{ y: activeNode === 1 ? -4 : 0 }}
            className={`w-12 h-12 rounded-xl flex items-center justify-center border transition-all ${
              activeNode === 1 
                ? 'bg-[#10b981]/15 border-[#10b981] text-[#10b981] shadow-lg shadow-emerald-500/10 scale-110' 
                : 'bg-white dark:bg-[#101412] border-slate-200/50 dark:border-white/10 text-slate-500 dark:text-slate-400 group-hover:border-emerald-500/40'
            }`}
          >
            <PaintBrush className="w-5 h-5" weight={activeNode === 1 ? 'fill' : 'regular'} />
          </motion.div>
          <span className={`text-[10px] font-black mt-1.5 transition-colors ${activeNode === 1 ? 'text-[#10b981]' : 'text-slate-500 dark:text-slate-400'}`}>
            استودیو طراحی
          </span>
        </button>

        {/* NODE 2: TOP RIGHT - PRODUCT MANAGEMENT */}
        <button
          onClick={() => handleNodeInteraction(2)}
          onMouseEnter={() => setActiveNode(2)}
          className="absolute top-[18%] right-[12%] z-20 flex flex-col items-center group cursor-pointer focus:outline-none"
        >
          <motion.div 
            animate={{ y: activeNode === 2 ? -4 : 0 }}
            className={`w-12 h-12 rounded-xl flex items-center justify-center border transition-all ${
              activeNode === 2 
                ? 'bg-[#10b981]/15 border-[#10b981] text-[#10b981] shadow-lg shadow-emerald-500/10 scale-110' 
                : 'bg-white dark:bg-[#101412] border-slate-200/50 dark:border-white/10 text-slate-500 dark:text-slate-400 group-hover:border-emerald-500/40'
            }`}
          >
            <TagIcon className="w-5 h-5" weight={activeNode === 2 ? 'fill' : 'regular'} />
          </motion.div>
          <span className={`text-[10px] font-black mt-1.5 transition-colors ${activeNode === 2 ? 'text-[#10b981]' : 'text-slate-500 dark:text-slate-400'}`}>
            مدیریت محصولات
          </span>
        </button>

        {/* NODE 3: BOTTOM LEFT - CUSTOMER JOURNEY */}
        <button
          onClick={() => handleNodeInteraction(3)}
          onMouseEnter={() => setActiveNode(3)}
          className="absolute bottom-[18%] left-[12%] z-20 flex flex-col items-center group cursor-pointer focus:outline-none"
        >
          <motion.div 
            animate={{ y: activeNode === 3 ? -4 : 0 }}
            className={`w-12 h-12 rounded-xl flex items-center justify-center border transition-all ${
              activeNode === 3 
                ? 'bg-[#10b981]/15 border-[#10b981] text-[#10b981] shadow-lg shadow-emerald-500/10 scale-110' 
                : 'bg-white dark:bg-[#101412] border-slate-200/50 dark:border-white/10 text-slate-500 dark:text-slate-400 group-hover:border-emerald-500/40'
            }`}
          >
            <ShoppingBag className="w-5 h-5" weight={activeNode === 3 ? 'fill' : 'regular'} />
          </motion.div>
          <span className={`text-[10px] font-black mt-1.5 transition-colors ${activeNode === 3 ? 'text-[#10b981]' : 'text-slate-500 dark:text-slate-400'}`}>
            تجربه مشتری
          </span>
        </button>

        {/* NODE 4: BOTTOM RIGHT - ORDERS */}
        <button
          onClick={() => handleNodeInteraction(4)}
          onMouseEnter={() => setActiveNode(4)}
          className="absolute bottom-[18%] right-[12%] z-20 flex flex-col items-center group cursor-pointer focus:outline-none"
        >
          <motion.div 
            animate={{ y: activeNode === 4 ? -4 : 0 }}
            className={`w-12 h-12 rounded-xl flex items-center justify-center border transition-all ${
              activeNode === 4 
                ? 'bg-[#10b981]/15 border-[#10b981] text-[#10b981] shadow-lg shadow-emerald-500/10 scale-110' 
                : 'bg-white dark:bg-[#101412] border-slate-200/50 dark:border-white/10 text-slate-500 dark:text-slate-400 group-hover:border-emerald-500/40'
            }`}
          >
            <CheckCircle className="w-5 h-5" weight={activeNode === 4 ? 'fill' : 'regular'} />
          </motion.div>
          <span className={`text-[10px] font-black mt-1.5 transition-colors ${activeNode === 4 ? 'text-[#10b981]' : 'text-slate-500 dark:text-slate-400'}`}>
            مدیریت سفارش‌ها
          </span>
        </button>

      </div>

      {/* 2. THE CONTEXTUAL PREVIEW UNDERNEATH OR INSIDE AT LEADING DEPTH */}
      <div className="w-full max-w-[500px] mt-6 bg-white dark:bg-[#101412] rounded-3xl border border-slate-200/60 dark:border-white/10 p-5 shadow-[0_12px_24px_-10px_rgba(0,0,0,0.04)] text-right">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeNode}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25 }}
            className="space-y-4"
          >
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#10b981] shadow-[0_0_8px_#10b981] animate-pulse" />
              <h4 className="text-sm font-black text-slate-900 dark:text-white">{activeNodeData.title}</h4>
            </div>
            
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-bold">
              {activeNodeData.shortDesc}
            </p>

            {/* Micro animation showcase representing the state semantic */}
            <div className="h-32 rounded-2xl bg-slate-50 dark:bg-[#141917] border border-slate-100 dark:border-white/[0.04] p-3 flex items-center justify-center relative overflow-hidden">
              {activeNode === 1 && (
                /* Module 1: Design studio modules assembly */
                <div className="flex gap-2.5">
                  {[1, 2, 3].map((v) => (
                    <motion.div 
                      key={v}
                      initial={{ scale: 0.3, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ delay: v * 0.15, type: 'spring', stiffness: 180, damping: 15 }}
                      className="w-14 h-14 bg-white dark:bg-[#1d2421] border border-slate-200/60 dark:border-white/[0.05] rounded-xl flex flex-col items-center justify-center gap-1 shadow-sm"
                    >
                      <div className="w-8 h-2 bg-slate-200 dark:bg-slate-700 rounded-full" />
                      <div className="w-6 h-1.5 bg-[#10b981]/30 rounded-full" />
                    </motion.div>
                  ))}
                </div>
              )}

              {activeNode === 2 && (
                /* Module 2: Price tag modifier changes snapping into place */
                <div className="flex flex-col items-center gap-2">
                  <motion.div 
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ type: 'spring', stiffness: 200, damping: 15 }}
                    className="bg-white dark:bg-[#1d2421] px-4 py-2 border border-slate-200/50 dark:border-white/[0.05] rounded-xl flex items-center gap-4 shadow-sm"
                  >
                    <span className="text-[11px] font-black text-slate-800 dark:text-white">برگر مخصوص</span>
                    <div className="flex items-center gap-1 font-mono text-[10px] text-[#10b981] font-black">
                      <motion.span 
                        animate={{ scale: [1, 1.15, 1] }} 
                        transition={{ repeat: Infinity, repeatDelay: 2, duration: 0.6 }}
                      >
                        ۳۴۰,۰۰۰
                      </motion.span>
                      <span>تومان</span>
                    </div>
                  </motion.div>
                  <motion.span 
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.2, type: 'spring' }}
                    className="text-[9px] uppercase font-bold tracking-wider text-slate-400 dark:text-slate-500"
                  >
                    تغییر قیمت و موجودی آنی
                  </motion.span>
                </div>
              )}

              {activeNode === 3 && (
                /* Module 3: selection transitions to cart */
                <div className="w-full flex items-center justify-around px-4">
                  <motion.div 
                    animate={{ x: [0, 40, 0] }}
                    transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
                    className="w-16 p-2 bg-white dark:bg-[#1d2421] border border-slate-200/50 dark:border-[#10b981]/20 rounded-xl flex flex-col items-center gap-1 shadow-sm"
                  >
                    <div className="w-10 h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full" />
                    <span className="text-[9px] font-black text-slate-800 dark:text-white">پیتزا دبل</span>
                  </motion.div>
                  <div className="text-slate-300 dark:text-slate-700">➔</div>
                  <div className="w-12 h-12 rounded-full bg-emerald-500/10 border border-[#10b981]/30 flex items-center justify-center relative">
                    <ShoppingBag className="w-5 h-5 text-[#10b981]" weight="bold" />
                    <motion.span 
                      animate={{ scale: [1, 1.3, 1] }}
                      transition={{ repeat: Infinity, duration: 1.5, repeatDelay: 1.5 }}
                      className="absolute -top-1 -right-1 bg-[#10b981] text-white rounded-full w-4 h-4 flex items-center justify-center text-[8px] font-mono font-black"
                    >
                      ۱
                    </motion.span>
                  </div>
                </div>
              )}

              {activeNode === 4 && (
                /* Module 4: Order status flow advances */
                <div className="flex flex-col items-center gap-3">
                  <div className="flex gap-2">
                    {['received', 'preparing', 'ready'].map((step, idx) => {
                      const isCurrent = idx === 1; // Highlight preparing for layout loop
                      return (
                        <div key={step} className={`px-2.5 py-1.5 rounded-lg border text-[9px] font-black transition-all ${isCurrent ? 'bg-[#10b981] border-transparent text-white shadow-md' : 'bg-white dark:bg-[#1d2421] border-slate-200/50 dark:border-white/10 text-slate-400 dark:text-slate-500'}`}>
                          {idx === 0 ? 'دریافت شده' : idx === 1 ? 'آماده‌سازی...' : 'آماده'}
                        </div>
                      );
                    })}
                  </div>
                  <span className="text-[9px] font-black text-slate-400 dark:text-slate-500">جریان زنده فاکتور در صفحه آشپزخانه</span>
                </div>
              )}
            </div>

            {/* Quick jump to detailed section */}
            <div className="flex justify-end pt-1">
              <a 
                href={`#${activeNodeData.anchor}`}
                className="inline-flex items-center gap-1 text-[11px] font-black text-[#10b981] hover:text-emerald-500 group"
              >
                <span>مشاهده دمو و تنظیمات کامل ماژول</span>
                <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-[-2px] rotate-180" />
              </a>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

    </div>
  );
};
