import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  PaintBrush, 
  DeviceMobile, 
  DeviceTablet, 
  Monitor, 
  MagnifyingGlassPlus, 
  MagnifyingGlassMinus, 
  ArrowClockwise, 
  ArrowUp, 
  ArrowDown, 
  Check, 
  ShoppingBag,
  ArrowsDownUp,
  Layout
} from '@phosphor-icons/react';

interface DesignStudioModuleProps {
  theme: 'light' | 'dark';
}

export const DesignStudioModule: React.FC<DesignStudioModuleProps> = ({ theme }) => {
  // Module-specific states
  const [heroStyle, setHeroStyle] = useState<'overlay' | 'stack' | 'split'>('overlay');
  const [viewportSize, setViewportSize] = useState<'mobile' | 'tablet' | 'desktop'>('mobile');
  const [zoomScale, setZoomScale] = useState<number>(1);
  const [isSaved, setIsSaved] = useState<boolean>(true);
  const [categories, setCategories] = useState<string[]>([
    '🍕 پیتزا زغالی',
    '🍔 برگر دست‌ساز',
    '🥗 سالاد و پیش‌غذا',
    '🥤 نوشیدنی خنک'
  ]);

  const reorderCategory = (index: number, direction: 'up' | 'down') => {
    setIsSaved(false);
    const newCategories = [...categories];
    if (direction === 'up' && index > 0) {
      const temp = newCategories[index];
      newCategories[index] = newCategories[index - 1];
      newCategories[index - 1] = temp;
    } else if (direction === 'down' && index < categories.length - 1) {
      const temp = newCategories[index];
      newCategories[index] = newCategories[index + 1];
      newCategories[index + 1] = temp;
    }
    setCategories(newCategories);
    setTimeout(() => setIsSaved(true), 1200);
  };

  const handleReset = () => {
    setIsSaved(false);
    setHeroStyle('overlay');
    setViewportSize('mobile');
    setZoomScale(1);
    setCategories([
      '🍕 پیتزا زغالی',
      '🍔 برگر دست‌ساز',
      '🥗 سالاد و پیش‌غذا',
      '🥤 نوشیدنی خنک'
    ]);
    setTimeout(() => setIsSaved(true), 800);
  };

  // Viewport width mapping
  const getViewportWidth = () => {
    if (viewportSize === 'mobile') return '340px';
    if (viewportSize === 'tablet') return '480px';
    return '100%';
  };

  return (
    <section 
      id="studio" 
      className="py-16 md:py-24 bg-[#F5F7F6] dark:bg-[#080A09] text-slate-900 dark:text-slate-100 transition-colors duration-300 border-b border-slate-200/50 dark:border-white/[0.04] scroll-mt-20"
    >
      <div className="max-w-[1200px] mx-auto px-6">
        
        {/* Module Header */}
        <div className="text-right max-w-2xl mb-12">
          <span className="text-[10px] uppercase tracking-[0.2em] font-black text-emerald-600 dark:text-[#19C78C] bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
            ماژول شماره یک
          </span>
          <h2 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white mt-4 leading-none tracking-tight">
            استودیو طراحی منوی دیجیتال
          </h2>
          <p className="text-slate-500 dark:text-slate-400 mt-4 leading-relaxed font-bold text-sm md:text-base">
            ساختار چیدمان، دسته‌بندی‌ها و هویت بصری منو را در فضایی یکپارچه طراحی و تست کنید. استایل هیرو را به سرعت تغییر دهید، اولویت‌ها را ویرایش کنید و نتیجه را بر روی نمایشگرهای گوناگون بسنجید.
          </p>
        </div>

        {/* Unified Connected Workspace Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* Editor Side (Right in RTL) */}
          <div className="lg:col-span-5 flex flex-col justify-between bg-white dark:bg-[#101412] rounded-[2rem] border border-slate-200/60 dark:border-white/10 p-6 md:p-8 shadow-[0_12px_24px_-10px_rgba(0,0,0,0.03)] dark:shadow-none">
            <div className="space-y-6">
              
              {/* Style Selection */}
              <div className="text-right">
                <span className="text-xs font-black text-slate-800 dark:text-slate-300 block mb-3">
                  ۱. انتخاب استایل چیدمان هیرو
                </span>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { key: 'overlay', label: 'عریض (Overlay)' },
                    { key: 'stack', label: 'پشته‌ای (Stack)' },
                    { key: 'split', label: 'دو ستونه (Split)' }
                  ].map((style) => (
                    <button
                      key={style.key}
                      onClick={() => setHeroStyle(style.key as any)}
                      className={`px-3 py-2.5 rounded-xl text-[11px] font-black transition-all border cursor-pointer ${
                        heroStyle === style.key 
                          ? 'bg-[#10b981] text-white border-transparent shadow-sm' 
                          : 'bg-slate-50 dark:bg-[#141917] text-slate-600 dark:text-slate-400 border-slate-200/80 dark:border-white/5 hover:bg-slate-100 dark:hover:bg-white/[0.02]'
                      }`}
                    >
                      {style.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Categories Re-ordering */}
              <div className="text-right">
                <span className="text-xs font-black text-slate-800 dark:text-slate-300 block mb-3">
                  ۲. مدیریت و مرتب‌سازی نمایش دسته‌بندی‌ها
                </span>
                <div className="space-y-2">
                  {categories.map((cat, idx) => (
                    <div 
                      key={cat} 
                      className="flex items-center justify-between bg-slate-50 dark:bg-[#141917] px-4 py-2.5 rounded-xl border border-slate-200/50 dark:border-white/5 text-xs font-black text-slate-800 dark:text-slate-200"
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-slate-300 dark:text-slate-600 cursor-grab active:cursor-grabbing">
                          <ArrowsDownUp className="w-4 h-4" />
                        </span>
                        <span>{cat}</span>
                      </div>
                      <div className="flex gap-1">
                        <button 
                          onClick={() => reorderCategory(idx, 'up')}
                          disabled={idx === 0}
                          className={`p-1.5 rounded-lg border transition-all cursor-pointer ${
                            idx === 0 
                              ? 'text-slate-300 dark:text-slate-700 border-transparent bg-transparent' 
                              : 'text-slate-600 border-slate-200 hover:border-emerald-500/20 dark:text-slate-400 dark:border-white/5 hover:bg-slate-100 dark:hover:bg-white/5 active:scale-95'
                          }`}
                          title="انتقال به بالا"
                        >
                          <ArrowUp className="w-3.5 h-3.5" />
                        </button>
                        <button 
                          onClick={() => reorderCategory(idx, 'down')}
                          disabled={idx === categories.length - 1}
                          className={`p-1.5 rounded-lg border transition-all cursor-pointer ${
                            idx === categories.length - 1 
                              ? 'text-slate-300 dark:text-slate-700 border-transparent bg-transparent' 
                              : 'text-slate-600 border-slate-200 hover:border-emerald-500/20 dark:text-slate-400 dark:border-white/5 hover:bg-slate-100 dark:hover:bg-white/5 active:scale-95'
                          }`}
                          title="انتقال به پایین"
                        >
                          <ArrowDown className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>

            {/* Editor Workspace Footer Info */}
            <div className="mt-8 pt-4 border-t border-slate-100 dark:border-white/5 flex items-center justify-between text-[11px] text-slate-400 font-bold">
              <div className="flex items-center gap-1.5">
                <span className={`w-2 h-2 rounded-full ${isSaved ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]' : 'bg-amber-500 animate-ping'}`} />
                <span>{isSaved ? 'تغییرات به صورت آنی ذخیره شد' : 'در حال همگام‌سازی...'}</span>
              </div>
              <button 
                onClick={handleReset}
                className="text-slate-400 hover:text-emerald-500 transition-colors border-0 bg-transparent cursor-pointer font-black"
              >
                بازنشانی استودیو
              </button>
            </div>

          </div>

          {/* Interactive Preview Canvas Side (Left in RTL) */}
          <div className="lg:col-span-7 flex flex-col items-stretch">
            
            {/* Viewport & Controls Bar */}
            <div className="flex items-center justify-between bg-slate-900 text-white px-5 py-3 rounded-2xl mb-4 shadow-sm text-xs font-black">
              
              {/* Responsive Size Selectors */}
              <div className="flex items-center gap-1">
                {[
                  { key: 'mobile', label: 'موبایل', icon: DeviceMobile },
                  { key: 'tablet', label: 'تبلت', icon: DeviceTablet },
                  { key: 'desktop', label: 'دسکتاپ', icon: Monitor }
                ].map((item) => {
                  const Icon = item.icon;
                  const isActive = viewportSize === item.key;
                  return (
                    <button
                      key={item.key}
                      onClick={() => setViewportSize(item.key as any)}
                      className={`p-2 rounded-lg transition-all border-0 flex items-center gap-1 text-[10px] cursor-pointer ${
                        isActive ? 'bg-[#10b981] text-white shadow-sm' : 'text-slate-400 hover:text-white bg-transparent'
                      }`}
                      title={item.label}
                    >
                      <Icon className="w-4 h-4" />
                      <span className="hidden sm:inline">{item.label}</span>
                    </button>
                  );
                })}
              </div>

              {/* Title label */}
              <span className="text-[11px] text-slate-300 font-black">پیش‌نمایش زنده استودیو</span>

              {/* Zoom & Reset Controllers */}
              <div className="flex items-center gap-1">
                <button 
                  onClick={() => setZoomScale(p => Math.min(p + 0.1, 1.2))} 
                  className="p-1.5 bg-white/10 hover:bg-white/20 rounded-lg text-slate-300 hover:text-white transition-all cursor-pointer"
                  title="بزرگ‌نمایی"
                >
                  <MagnifyingGlassPlus className="w-4 h-4" />
                </button>
                <span className="font-mono text-[10px] text-slate-400 w-8 text-center select-none">{Math.round(zoomScale * 100)}%</span>
                <button 
                  onClick={() => setZoomScale(p => Math.max(p - 0.1, 0.8))} 
                  className="p-1.5 bg-white/10 hover:bg-white/20 rounded-lg text-slate-300 hover:text-white transition-all cursor-pointer"
                  title="کوچک‌نمایی"
                >
                  <MagnifyingGlassMinus className="w-4 h-4" />
                </button>
                <button 
                  onClick={() => setZoomScale(1)} 
                  className="p-1.5 bg-white/10 hover:bg-white/20 rounded-lg text-slate-300 hover:text-white transition-all cursor-pointer"
                  title="بازنشانی زوم"
                >
                  <ArrowClockwise className="w-4 h-4" />
                </button>
              </div>

            </div>

            {/* PREVIEW CANVAS AREA - Realistic Workspace Frame (Bezel-less & clean) */}
            <div className="flex-1 min-h-[460px] max-h-[500px] overflow-hidden bg-slate-200/50 dark:bg-[#141917] rounded-[2.5rem] border border-slate-200/60 dark:border-white/5 p-4 flex items-center justify-center relative shadow-inner">
              
              <motion.div
                layout
                style={{ 
                  width: getViewportWidth(), 
                  scale: zoomScale,
                  maxHeight: '100%'
                }}
                transition={{ type: 'spring', damping: 24, stiffness: 200 }}
                className="bg-white dark:bg-[#101412] h-full rounded-[1.8rem] shadow-xl border border-slate-200/60 dark:border-white/10 flex flex-col overflow-hidden text-right text-xs"
              >
                
                {/* Simulated Header inside canvas */}
                <div className="bg-slate-900 text-white px-4 py-3.5 flex items-center justify-between border-b border-white/5">
                  <div className="w-6 h-6 bg-white/10 rounded-full flex items-center justify-center">
                    <ShoppingBag className="w-3.5 h-3.5 text-[#10b981]" weight="fill" />
                  </div>
                  <span className="font-black text-[10px]">کافه رستوران قصر رویایی</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_4px_#10b981]" />
                </div>

                {/* Simulated Canvas Body */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  
                  {/* Hero banner preview (reacts to state) */}
                  <AnimatePresence mode="wait">
                    {heroStyle === 'overlay' && (
                      <motion.div 
                        key="overlay"
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -8 }}
                        className="bg-slate-900 text-white p-4 rounded-xl relative overflow-hidden h-24 flex flex-col justify-end"
                        style={{ backgroundImage: `linear-gradient(rgba(0,0,0,0.2), rgba(0,0,0,0.85)), url(https://picsum.photos/seed/pizza_hero/600/300)`, backgroundSize: 'cover' }}
                      >
                        <span className="text-[7px] bg-[#10b981] text-white font-black px-1.5 py-0.5 rounded w-max mb-1">پرفروش‌ترین ماه</span>
                        <h3 className="font-black text-[11px]">پیتزا چدار تنوری زغالی</h3>
                        <p className="text-[8px] text-slate-300">طعم اصیل زغال و پنیر دست‌ساز</p>
                      </motion.div>
                    )}

                    {heroStyle === 'stack' && (
                      <motion.div 
                        key="stack"
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -8 }}
                        className="space-y-2"
                      >
                        <div className="h-20 bg-slate-200 rounded-xl overflow-hidden">
                          <img src="https://picsum.photos/seed/pizza_stack/600/300" className="w-full h-full object-cover" alt="pizza" />
                        </div>
                        <div className="bg-slate-50 dark:bg-[#141917] p-2.5 rounded-xl border border-slate-200/50 dark:border-white/5">
                          <h3 className="font-black text-[10px] text-slate-900 dark:text-white">پیتزا چدار تنوری زغالی</h3>
                          <p className="text-[8px] text-slate-400 dark:text-slate-500 mt-1">ترکیب شگفت‌انگیز خمیر مخصوص با پنیر محلی</p>
                        </div>
                      </motion.div>
                    )}

                    {heroStyle === 'split' && (
                      <motion.div 
                        key="split"
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -8 }}
                        className="grid grid-cols-2 gap-2"
                      >
                        <div className="bg-slate-900 text-white p-2.5 rounded-xl relative overflow-hidden h-20 flex flex-col justify-end" style={{ backgroundImage: `linear-gradient(rgba(0,0,0,0.2), rgba(0,0,0,0.85)), url(https://picsum.photos/seed/pizza_split/300/200)`, backgroundSize: 'cover' }}>
                          <h3 className="font-black text-[9px]">پیتزا تنوری</h3>
                        </div>
                        <div className="bg-[#EEF2F0] dark:bg-[#141917] p-2.5 rounded-xl border border-slate-200/40 dark:border-white/5 flex flex-col justify-center items-center text-center">
                          <h3 className="font-black text-[9px] text-emerald-500">جشنواره تابستانه</h3>
                          <p className="text-[7px] text-slate-400">تا ۲۰٪ تخفیف ویژه</p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Render Categories Reactively */}
                  <div>
                    <span className="text-[9px] font-black text-slate-400 dark:text-slate-500 block mb-1.5">دسته‌بندی‌ها</span>
                    <div className="flex gap-1 overflow-x-auto pb-1 scrollbar-none">
                      {categories.map((cat, idx) => (
                        <span key={cat} className={`px-2.5 py-1.5 rounded-lg text-[9px] font-black shrink-0 ${idx === 0 ? 'bg-[#10b981] text-white' : 'bg-slate-50 dark:bg-[#141917] text-slate-600 dark:text-slate-400 border border-slate-200/60 dark:border-white/5'}`}>
                          {cat}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Mock products lists */}
                  <div className="space-y-2">
                    <span className="text-[9px] font-black text-slate-400 dark:text-slate-500 block">پرفروش‌ترین‌های امروز</span>
                    <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
                      {[
                        { seed: 'burger_prev', title: 'برگر زغالی', price: '۳۱۰,۰۰۰' },
                        { seed: 'salad_prev', title: 'سالاد سزار', price: '۲۴۰,۰۰۰' },
                        { seed: 'pasta_prev', title: 'پاستا آلفردو', price: '۳۲۰,۰۰0' }
                      ].map((item) => (
                        <div key={item.title} className="w-24 bg-slate-50 dark:bg-[#141917]/40 border border-slate-200/50 dark:border-white/5 p-2 rounded-xl shrink-0">
                          <div className="h-12 bg-slate-200 dark:bg-[#141917] rounded-lg mb-1 overflow-hidden">
                            <img src={`https://picsum.photos/seed/${item.seed}/200/120`} className="w-full h-full object-cover" alt="food" />
                          </div>
                          <h4 className="font-black text-[8px] truncate text-slate-800 dark:text-slate-200">{item.title}</h4>
                          <span className="text-[8px] font-black text-[#10b981] block mt-0.5">{item.price} تومان</span>
                        </div>
                      ))}
                    </div>
                  </div>

                </div>

                {/* Sticky Preview Footer */}
                <div className="border-t border-slate-100 dark:border-white/5 bg-slate-50 dark:bg-[#141917] px-4 py-2.5 flex items-center justify-between text-[8px] text-slate-400 dark:text-slate-500 font-bold select-none">
                  <span>طراحی شده با ویترین استودیو</span>
                  <span>کد میز اسکن هوشمند</span>
                </div>

              </motion.div>

            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
