import React, { useState, useEffect, useRef, useTransition } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { 
  Check, 
  Plus, 
  Minus, 
  RotateCw, 
  ShoppingBag, 
  Zap, 
  Sparkles,
  Eye,
  Sliders,
  ChevronLeft,
  ChevronRight,
  Maximize2
} from 'lucide-react';
import { IPhone17ProMaxFrame } from './IPhone17ProMaxFrame';
import { useTheme } from './ThemeProvider';

// ==========================================
// TYPES & CONSTANTS
// ==========================================

export type ProductDemoState = {
  name: string;
  price: number;
  available: boolean;
  discountEnabled: boolean;
  discountPercent: number;
  selectedTags: string[];
  enabledAddOns: string[];
};

const DEFAULT_STATE: ProductDemoState = {
  name: "پیتزا پپرونی مخصوص زغالی",
  price: 340000,
  available: true,
  discountEnabled: true,
  discountPercent: 15,
  selectedTags: ["پرفروش‌ترین", "تند"],
  enabledAddOns: ["قارچ"]
};

const ALL_TAGS = [
  { id: "پرفروش‌ترین", label: "پرفروش‌ترین", color: "bg-amber-500/10 text-amber-500 border-amber-500/20" },
  { id: "پیشنهاد سرآشپز", label: "پیشنهاد سرآشپز", color: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" },
  { id: "تند", label: "تند 🔥", color: "bg-rose-500/10 text-rose-500 border-rose-500/20" },
  { id: "رژیمی", label: "رژیمی 🌱", color: "bg-teal-500/10 text-teal-400 border-teal-500/20" }
];

const ALL_ADDONS = [
  { id: "پنیر اضافه", label: "پنیر اضافه", price: 25000 },
  { id: "قارچ", label: "قارچ اسلایس‌شده", price: 15000 },
  { id: "سس ویژه", label: "سس ویژه دست‌ساز", price: 10000 }
];

// Helper to format prices to English Numerals with comma separators
const toPersianNumber = (num: number): string => {
  return num.toLocaleString('en-US');
};

export function InteractiveProductShowcase() {
  const { theme } = useTheme();
  const isReduced = useReducedMotion();
  const [state, setState] = useState<ProductDemoState>(DEFAULT_STATE);
  const [cartCount, setCartCount] = useState<number>(0);
  
  // Animation states
  const [syncStatus, setSyncStatus] = useState<'saved' | 'saving' | 'published'>('saved');
  const [isPulseActive, setIsPulseActive] = useState<boolean>(false);
  const [isCartBouncing, setIsCartBouncing] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'edit' | 'preview'>('edit'); // Mobile-only tabs
  
  const syncTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const pulseTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Clean up timeouts on unmount
  useEffect(() => {
    return () => {
      if (syncTimeoutRef.current) clearTimeout(syncTimeoutRef.current);
      if (pulseTimeoutRef.current) clearTimeout(pulseTimeoutRef.current);
    };
  }, []);

  // Sync state machine helper
  const triggerSyncSequence = () => {
    // 1. Immediately switch status to saving
    setSyncStatus('saving');
    setIsPulseActive(true);

    if (syncTimeoutRef.current) clearTimeout(syncTimeoutRef.current);
    if (pulseTimeoutRef.current) clearTimeout(pulseTimeoutRef.current);

    // 2. Pulse traveling dot animation finishes
    pulseTimeoutRef.current = setTimeout(() => {
      setIsPulseActive(false);
    }, 600);

    // 3. Status switches to published / saved
    syncTimeoutRef.current = setTimeout(() => {
      setSyncStatus('published');
    }, 850);
  };

  // State update handler that triggers immediate visual sync and debounced status feedback
  const updateState = (updater: (prev: ProductDemoState) => ProductDemoState) => {
    setState(prev => {
      const next = updater(prev);
      triggerSyncSequence();
      return next;
    });
  };

  // Reset function
  const handleReset = () => {
    setState(DEFAULT_STATE);
    setCartCount(0);
    setSyncStatus('saved');
    setIsPulseActive(false);
    setIsCartBouncing(false);
  };

  // Derived pricing calculations
  const calculateFinalPrice = () => {
    if (!state.discountEnabled) return state.price;
    const discountAmount = (state.price * state.discountPercent) / 100;
    return state.price - discountAmount;
  };

  const finalPrice = calculateFinalPrice();

  // Add to Cart handler
  const handleAddToCart = () => {
    if (!state.available) return;
    setCartCount(prev => prev + 1);
    setIsCartBouncing(true);
    setTimeout(() => {
      setIsCartBouncing(false);
    }, 500);
  };

  // Transition presets
  const bezierTransition = isReduced ? { duration: 0.15 } : { type: "spring", stiffness: 120, damping: 20 };
  const easeTransition = isReduced ? { duration: 0.1 } : { duration: 0.4, ease: [0.16, 1, 0.3, 1] };

  return (
    <section id="studio" className="py-24 md:py-32 bg-white dark:bg-[#070908] text-slate-900 dark:text-white overflow-hidden relative transition-colors duration-300">
      {/* Cinematic ambient background glow and subtle dot grid */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(16,185,129,0.03),transparent_60%)] pointer-events-none" />
      <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.01)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.01)_1px,transparent_1px)] dark:bg-[linear-gradient(rgba(255,255,255,0.01)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[size:24px_24px] opacity-40 dark:opacity-20 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* ==========================================
              RIGHT COLUMN: MARKETING COPY & BENEFITS (RTL)
             ========================================== */}
          <motion.div 
            initial={{ opacity: 0, y: isReduced ? 0 : 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-5 text-right flex flex-col items-start lg:items-start"
          >
            {/* Actionable Micro-Badge */}
            <motion.div 
              whileHover={isReduced ? {} : { scale: 1.02 }}
              className="inline-flex items-center gap-1.5 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 px-3.5 py-1.5 rounded-full border border-emerald-500/15 dark:border-emerald-500/20 text-[11px] font-black tracking-wider mb-6 cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 animate-pulse" />
              <span>مدیریت زنده محصولات</span>
            </motion.div>

            {/* Main Headline */}
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 dark:text-white leading-[1.15] tracking-tight mb-6">
              محصول را ویرایش کن؛
              <span className="block mt-2 text-transparent bg-clip-text bg-gradient-to-l from-emerald-500 to-teal-500 dark:from-emerald-400 dark:to-teal-200">
                نتیجه را همان لحظه ببین
              </span>
            </h2>

            {/* Main Description */}
            <p className="text-slate-500 dark:text-slate-400 leading-relaxed text-sm sm:text-base font-medium mb-8 max-w-[48ch]">
              قیمت، موجودی، تخفیف، برچسب‌ها و افزودنی‌های هر محصول را تغییر بده و نتیجه را فوراً در منوی مشتری مشاهده کن.
            </p>

            {/* Benefit Items List */}
            <div className="space-y-4 mb-8 w-full">
              {[
                "تغییر فوری قیمت و موجودی",
                "تعریف تخفیف، برچسب و افزودنی‌ها",
                "ذخیره خودکار و انتشار زنده"
              ].map((benefit, i) => (
                <motion.div 
                  key={i}
                  className="flex items-center gap-3.5 justify-end w-full group cursor-default"
                  whileHover={isReduced ? {} : { x: -4 }}
                  transition={{ duration: 0.2 }}
                >
                  <span className="text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-200 transition-colors group-hover:text-emerald-500 dark:group-hover:text-emerald-400">
                    {benefit}
                  </span>
                  <div className="w-5 h-5 rounded-full bg-emerald-500/10 dark:bg-emerald-500/15 text-[#10b981] dark:text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-500/15 dark:border-emerald-500/25">
                    <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Instruction Microcopy */}
            <div className="pt-4 border-t border-slate-100 dark:border-white/5 w-full text-right">
              <span className="text-xs text-slate-400 dark:text-slate-500 font-bold block">
                💡 یکی از تنظیمات را تغییر بده و نتیجه را در پیش‌نمایش مشتری ببین.
              </span>
            </div>
          </motion.div>

          {/* ==========================================
              LEFT/CENTER COLUMN: INTEGRATED WORKSPACE
             ========================================== */}
          <motion.div 
            initial={{ opacity: 0, x: isReduced ? 0 : -48, scale: isReduced ? 1 : 0.98 }}
            whileInView={{ opacity: 1, x: 0, scale: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
            className="lg:col-span-7 w-full flex flex-col relative"
          >
            {/* Subtle background radial light behind the workspace */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] bg-emerald-500/5 rounded-full blur-[80px] pointer-events-none" />

            {/* Double-Bezel outer container */}
            <div className="w-full bg-slate-100/70 dark:bg-emerald-950/10 border border-slate-200/50 dark:border-white/5 p-2 rounded-[2.2rem] shadow-2xl relative transition-all duration-300">
              <div className="w-full bg-white dark:bg-[#101311] rounded-[1.8rem] border border-slate-200/60 dark:border-white/10 overflow-hidden shadow-sm dark:shadow-inner p-4 md:p-6 transition-all duration-300">
                
                {/* 1. Workspace Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-5 border-b border-slate-100 dark:border-white/5 mb-6 text-right">
                  <div className="flex items-center gap-2.5 justify-end sm:justify-start">
                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-[11px] font-black text-[#10b981] dark:text-emerald-400 uppercase tracking-widest bg-[#10b981]/10 px-2.5 py-1 rounded-full border border-emerald-500/15">
                      پیش‌نمایش زنده
                    </span>
                  </div>

                  <div className="flex flex-col text-right">
                    <h3 className="text-sm font-black text-slate-900 dark:text-white">ویرایش محصول</h3>
                    <p className="text-[10px] text-slate-400 dark:text-slate-500 font-bold mt-0.5">منوی شعبه مرکزی / پیتزا</p>
                  </div>
                </div>

                {/* Mobile Tab Switcher */}
                <div className="flex lg:hidden bg-slate-50 dark:bg-[#0B0D0C] p-1.5 rounded-xl border border-slate-200/50 dark:border-white/5 mb-6">
                  <button
                    onClick={() => setActiveTab('preview')}
                    className={`flex-1 py-2.5 rounded-lg text-xs font-black transition-all border-0 cursor-pointer ${
                      activeTab === 'preview' 
                        ? 'bg-[#10b981] text-white shadow-md' 
                        : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white bg-transparent'
                    }`}
                  >
                    پیش‌نمایش مشتری ({toPersianNumber(cartCount)})
                  </button>
                  <button
                    onClick={() => setActiveTab('edit')}
                    className={`flex-1 py-2.5 rounded-lg text-xs font-black transition-all border-0 cursor-pointer ${
                      activeTab === 'edit' 
                        ? 'bg-[#10b981] text-white shadow-md' 
                        : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white bg-transparent'
                    }`}
                  >
                    تنظیمات محصول
                  </button>
                </div>

                {/* Primary Dual View Split */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
                  
                  {/* ==========================================
                      EDITOR PANEL: 50% width
                     ========================================== */}
                  <div className={`lg:col-span-6 flex flex-col space-y-5 text-right ${activeTab === 'edit' ? 'block' : 'hidden lg:block'}`}>
                    
                    {/* Product Name Input */}
                    <div className="space-y-2">
                      <label htmlFor="prod-name" className="text-[11px] font-extrabold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
                        نام محصول
                      </label>
                      <input
                        id="prod-name"
                        type="text"
                        value={state.name}
                        onChange={(e) => updateState(prev => ({ ...prev, name: e.target.value }))}
                        className="w-full bg-slate-50 dark:bg-[#0B0D0C] border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 text-xs text-slate-900 dark:text-white font-extrabold text-right focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/30 transition-all outline-none"
                        placeholder="نام محصول را وارد کنید"
                      />
                    </div>

                    {/* Price Controller */}
                    <div className="space-y-2">
                      <label className="text-[11px] font-extrabold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
                        قیمت پایه (تومان)
                      </label>
                      <div className="flex items-center bg-slate-50 dark:bg-[#0B0D0C] border border-slate-200 dark:border-white/10 rounded-xl overflow-hidden p-1">
                        <button
                          onClick={() => updateState(prev => ({ ...prev, price: Math.max(10000, prev.price - 10000) }))}
                          aria-label="کاهش قیمت"
                          className="w-9 h-9 border-0 rounded-lg bg-white dark:bg-white/5 shadow-sm dark:shadow-none hover:bg-slate-100 dark:hover:bg-white/10 active:scale-95 transition-all flex items-center justify-center text-slate-600 dark:text-slate-300 cursor-pointer"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <input
                          type="text"
                          readOnly
                          value={`${toPersianNumber(state.price)} تومان`}
                          className="flex-1 bg-transparent border-0 text-center text-xs font-black text-emerald-600 dark:text-emerald-400 select-none outline-none focus:ring-0"
                        />
                        <button
                          onClick={() => updateState(prev => ({ ...prev, price: prev.price + 10000 }))}
                          aria-label="افزایش قیمت"
                          className="w-9 h-9 border-0 rounded-lg bg-white dark:bg-white/5 shadow-sm dark:shadow-none hover:bg-slate-100 dark:hover:bg-white/10 active:scale-95 transition-all flex items-center justify-center text-slate-600 dark:text-slate-300 cursor-pointer"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* Product Availability Toggle */}
                    <div className="flex items-center justify-between bg-slate-50 dark:bg-[#0B0D0C] border border-slate-200 dark:border-white/5 p-4 rounded-xl">
                      <button
                        role="switch"
                        aria-checked={state.available}
                        onClick={() => updateState(prev => ({ ...prev, available: !prev.available }))}
                        className={`w-11 h-6 rounded-full p-1 border-0 transition-colors outline-none cursor-pointer flex items-center ${
                          state.available ? 'bg-emerald-500' : 'bg-slate-300 dark:bg-slate-800'
                        }`}
                      >
                        <motion.div 
                          layout
                          transition={bezierTransition}
                          className="w-4 h-4 rounded-full bg-white shadow-sm"
                          style={{ marginLeft: state.available ? 'auto' : '0px', marginRight: state.available ? '0px' : 'auto' }}
                        />
                      </button>
                      <span className="text-xs font-black text-slate-700 dark:text-slate-200">موجود در منو</span>
                    </div>

                    {/* Discount Controls */}
                    <div className="bg-slate-50 dark:bg-[#0B0D0C] border border-slate-200 dark:border-white/5 p-4 rounded-xl space-y-3">
                      <div className="flex items-center justify-between">
                        <button
                          role="switch"
                          aria-checked={state.discountEnabled}
                          onClick={() => updateState(prev => ({ ...prev, discountEnabled: !prev.discountEnabled }))}
                          className={`w-11 h-6 rounded-full p-1 border-0 transition-colors outline-none cursor-pointer flex items-center ${
                            state.discountEnabled ? 'bg-emerald-500' : 'bg-slate-300 dark:bg-slate-800'
                          }`}
                        >
                          <motion.div 
                            layout
                            transition={bezierTransition}
                            className="w-4 h-4 rounded-full bg-white shadow-sm"
                            style={{ marginLeft: state.discountEnabled ? 'auto' : '0px', marginRight: state.discountEnabled ? '0px' : 'auto' }}
                          />
                        </button>
                        <span className="text-xs font-black text-slate-700 dark:text-slate-200">تخفیف محصول</span>
                      </div>

                      <AnimatePresence>
                        {state.discountEnabled && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={easeTransition}
                            className="overflow-hidden pt-2"
                          >
                            <div className="flex gap-1.5 justify-end">
                              {[10, 15, 20, 25].map((percent) => (
                                <button
                                  key={percent}
                                  onClick={() => updateState(prev => ({ ...prev, discountPercent: percent }))}
                                  className={`relative border-0 px-3 py-1.5 rounded-lg text-[10px] font-black transition-all cursor-pointer ${
                                    state.discountPercent === percent
                                      ? 'bg-emerald-500 text-white'
                                      : 'bg-white dark:bg-white/5 border border-slate-100 dark:border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white'
                                  }`}
                                >
                                  {state.discountPercent === percent && (
                                    <motion.div 
                                      layoutId="discountIndicator" 
                                      className="absolute inset-0 bg-emerald-500 rounded-lg -z-10"
                                      transition={bezierTransition}
                                    />
                                  )}
                                  {toPersianNumber(percent)}٪
                                </button>
                              ))}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>

                    {/* Tags Multi-select */}
                    <div className="space-y-2">
                      <label className="text-[11px] font-extrabold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
                        برچسب‌های محصول
                      </label>
                      <div className="flex flex-wrap gap-1.5 justify-end">
                        {ALL_TAGS.map((tag) => {
                          const isSelected = state.selectedTags.includes(tag.id);
                          return (
                            <button
                              key={tag.id}
                              onClick={() => {
                                updateState(prev => {
                                  const updated = isSelected
                                    ? prev.selectedTags.filter(t => t !== tag.id)
                                    : [...prev.selectedTags, tag.id];
                                  return { ...prev, selectedTags: updated };
                                });
                              }}
                              className={`px-3 py-1.5 rounded-xl text-[10px] font-extrabold border transition-all cursor-pointer ${
                                isSelected
                                  ? 'bg-emerald-500/10 dark:bg-emerald-500/15 border-emerald-500/30 dark:border-emerald-500/35 text-emerald-700 dark:text-emerald-400'
                                  : 'bg-slate-50 dark:bg-white/5 border-slate-200/50 dark:border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white'
                              }`}
                            >
                              <div className="flex items-center gap-1.5">
                                {isSelected && <Check className="w-3 h-3 text-emerald-700 dark:text-emerald-400" />}
                                <span>{tag.label}</span>
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Add-ons Selector */}
                    <div className="space-y-2">
                      <label className="text-[11px] font-extrabold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
                        افزودنی‌های اختیاری
                      </label>
                      <div className="space-y-1.5">
                        {ALL_ADDONS.map((addon) => {
                          const isEnabled = state.enabledAddOns.includes(addon.id);
                          return (
                            <button
                              key={addon.id}
                              onClick={() => {
                                updateState(prev => {
                                  const updated = isEnabled
                                    ? prev.enabledAddOns.filter(a => a !== addon.id)
                                    : [...prev.enabledAddOns, addon.id];
                                  return { ...prev, enabledAddOns: updated };
                                });
                              }}
                              className={`w-full flex items-center justify-between p-2.5 rounded-xl border text-right transition-all cursor-pointer ${
                                isEnabled
                                  ? 'bg-emerald-500/5 border-emerald-500/20 text-slate-900 dark:text-white'
                                  : 'bg-slate-50 dark:bg-white/5 border-slate-200/50 dark:border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-850 dark:hover:text-slate-300'
                              }`}
                            >
                              <span className="text-[10px] font-bold font-mono text-emerald-600 dark:text-emerald-400">
                                +{toPersianNumber(addon.price)} تومان
                              </span>
                              <div className="flex items-center gap-2">
                                <span className="text-[11px] font-extrabold">{addon.label}</span>
                                <div className={`w-4 h-4 rounded flex items-center justify-center border transition-all ${
                                  isEnabled ? 'bg-emerald-500 border-emerald-500 text-white' : 'border-slate-300 dark:border-white/20'
                                }`}>
                                  {isEnabled && <Check className="w-3 h-3 stroke-[3]" />}
                                </div>
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Reset Button */}
                    <div className="pt-2 flex justify-end">
                      <button
                        onClick={handleReset}
                        className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white bg-slate-50 dark:bg-white/5 hover:bg-slate-100 dark:hover:bg-white/10 border border-slate-200/50 dark:border-transparent text-xs font-black transition-all cursor-pointer active:scale-95"
                      >
                        <span>بازنشانی دمو</span>
                        <RotateCw className="w-3.5 h-3.5" />
                      </button>
                    </div>

                  </div>

                  {/* ==========================================
                      MIDDLE SYNC ARTERI: Pulse Animation Indicator
                     ========================================== */}
                  <div className="hidden lg:flex lg:col-span-1 flex-col items-center justify-center relative">
                    <div className="h-full w-[2px] bg-slate-100 dark:bg-white/5 relative flex items-center justify-center">
                      <AnimatePresence>
                        {isPulseActive && (
                          <motion.div
                            initial={{ y: -60, opacity: 0 }}
                            animate={{ y: 60, opacity: [0, 1, 1, 0] }}
                            transition={{ duration: 0.6, ease: "easeInOut" }}
                            className="absolute w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_12px_rgba(52,211,153,0.5)]"
                          />
                        )}
                      </AnimatePresence>
                    </div>
                    <div className="absolute top-1/2 -translate-y-1/2 bg-white dark:bg-[#101311] px-2.5 py-1 rounded-full border border-slate-200/50 dark:border-white/5 text-[9px] font-extrabold text-slate-400 dark:text-slate-500 rotate-90 whitespace-nowrap tracking-wider">
                      همگام‌سازی آنی
                    </div>
                  </div>

                  {/* ==========================================
                      CUSTOMER MOBILE PREVIEW: 40% width
                     ========================================== */}
                  <div className={`lg:col-span-5 flex flex-col justify-start items-center relative z-20 overflow-hidden ${activeTab === 'preview' ? 'block' : 'hidden lg:block'}`}>
                    
                    {/* High-fidelity CSS iPhone 17 Pro Max Frame */}
                    <IPhone17ProMaxFrame variant="standard" className="z-10">
                      
                      {/* Customer Live Menu View */}
                      <div className="p-3 bg-[#F4F6F6] dark:bg-[#0B0E0C] h-[340px] overflow-y-auto flex flex-col justify-between relative space-y-2 text-right">
                          
                          {/* Inner Product Detail Block */}
                          <motion.div 
                            layout
                            className={`bg-white dark:bg-[#161B18] border border-slate-100 dark:border-white/5 rounded-2xl p-3 shadow-sm flex flex-col gap-2.5 relative transition-all duration-300 ${
                              !state.available ? 'opacity-65 grayscale-[35%]' : ''
                            }`}
                          >
                            {/* Product Image Panel */}
                            <div className="h-20 w-full rounded-xl overflow-hidden relative bg-slate-100 dark:bg-slate-900">
                              <img
                                src="https://images.unsplash.com/photo-1628840042765-356cda07504e?w=600&auto=format&fit=crop&q=80"
                                alt={state.name}
                                className="w-full h-full object-cover"
                                referrerPolicy="no-referrer"
                              />

                              {/* Live Dynamic Discount Tag */}
                              <AnimatePresence>
                                {state.discountEnabled && (
                                  <motion.div
                                    initial={{ scale: 0, opacity: 0, rotate: -6 }}
                                    animate={{ scale: 1, opacity: 1, rotate: -4 }}
                                    exit={{ scale: 0, opacity: 0 }}
                                    className="absolute top-1.5 left-1.5 bg-red-500 text-white text-[8px] px-2 py-0.5 rounded-md font-black shadow-md"
                                  >
                                    {toPersianNumber(state.discountPercent)}٪ تخفیف
                                  </motion.div>
                                )}
                              </AnimatePresence>
                            </div>

                            {/* Tag row */}
                            <div className="flex flex-wrap gap-1 justify-end min-h-[16px]">
                              <AnimatePresence>
                                {state.selectedTags.map(tagId => {
                                  const tagObj = ALL_TAGS.find(t => t.id === tagId);
                                  if (!tagObj) return null;
                                  return (
                                    <motion.span
                                      key={tagId}
                                      layoutId={`preview-tag-${tagId}`}
                                      initial={{ scale: 0.8, opacity: 0 }}
                                      animate={{ scale: 1, opacity: 1 }}
                                      exit={{ scale: 0.8, opacity: 0 }}
                                      className={`px-1.5 py-0.5 rounded text-[7px] font-black border ${tagObj.color}`}
                                    >
                                      {tagObj.label}
                                    </motion.span>
                                  );
                                })}
                              </AnimatePresence>
                            </div>

                            {/* Product Info Block */}
                            <div className="space-y-1">
                              <h4 className="text-[11px] font-black text-slate-800 dark:text-white tracking-tight leading-tight min-h-[14px]">
                                {state.name || "بدون نام"}
                              </h4>
                              <p className="text-[8px] text-slate-400 dark:text-slate-400 mt-0.5 leading-tight">
                                کوکتل پپرونی، پنیر موزارلا، سس مخصوص تند طبیعی
                              </p>
                            </div>

                            {/* Live Enabled Add-Ons List on Customer card */}
                            <div className="min-h-[12px] border-t border-slate-50 dark:border-white/5 pt-1.5">
                              {state.enabledAddOns.length > 0 ? (
                                <div className="flex flex-wrap gap-1 justify-end">
                                  <span className="text-[6.5px] text-slate-400 dark:text-slate-500 font-extrabold ml-1">افزودنی:</span>
                                  {state.enabledAddOns.map(addonId => (
                                    <span key={addonId} className="text-[6.5px] bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-300 px-1 py-0.5 rounded">
                                      {addonId}
                                    </span>
                                  ))}
                                </div>
                              ) : (
                                <span className="text-[6.5px] text-slate-300 dark:text-slate-600 font-bold block">بدون افزودنی جانبی</span>
                              )}
                            </div>

                            {/* Dynamic synced footer pricing and status button */}
                            <div className="flex justify-between items-center mt-1 pt-2 border-t border-slate-100 dark:border-white/5">
                              {state.available ? (
                                <button
                                  onClick={handleAddToCart}
                                  className="w-5.5 h-5.5 bg-emerald-500 hover:bg-emerald-600 dark:bg-[#19C78C] dark:hover:bg-[#12cb8d] text-white rounded-lg flex items-center justify-center text-xs font-black shadow-md border-0 cursor-pointer active:scale-90 transition-all"
                                >
                                  +
                                </button>
                              ) : (
                                <span className="text-[8px] text-red-500 font-black bg-red-50 dark:bg-red-500/10 border border-red-100 dark:border-red-500/20 px-2 py-0.5 rounded-md">
                                  ناموجود
                                </span>
                              )}

                              <div className="text-left font-mono">
                                {state.discountEnabled ? (
                                  <div className="flex flex-col items-start leading-none">
                                    <span className="text-[8px] text-slate-400 dark:text-slate-500 line-through">
                                      {toPersianNumber(state.price)}
                                    </span>
                                    <span className="text-[10px] font-black text-red-600 dark:text-rose-400">
                                      {toPersianNumber(finalPrice)} <span className="text-[6.5px] font-sans">تومان</span>
                                    </span>
                                  </div>
                                ) : (
                                  <span className="text-[10px] font-black text-slate-800 dark:text-slate-200">
                                    {toPersianNumber(state.price)} <span className="text-[6.5px] font-sans">تومان</span>
                                  </span>
                                )}
                              </div>
                            </div>

                          </motion.div>

                          {/* Fast-sync informational card */}
                          <div className="bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-100 dark:border-emerald-500/20 p-2.5 rounded-xl flex items-center gap-2 justify-between text-right">
                            <p className="text-[8px] text-slate-600 dark:text-slate-300 leading-tight">
                              تغییر منو بدون ثانیه‌ای معطلی روی موبایل مشتریان اعمال می‌شود.
                            </p>
                            <Zap className="w-3.5 h-3.5 text-emerald-500 dark:text-[#19C78C] shrink-0 animate-bounce" />
                          </div>

                        </div>

                        {/* Customer Basket Footer Navigation */}
                        <div className="bg-white dark:bg-[#111312] px-5 py-2 border-t border-slate-200/60 dark:border-white/5 flex items-center justify-between text-slate-400 dark:text-slate-500 rounded-b-[2rem] shadow-sm">
                          <div className="flex flex-col items-center gap-0.5 text-emerald-500 dark:text-[#19C78C]">
                            <Sliders className="w-3.5 h-3.5" />
                            <span className="text-[7px] font-black">منو</span>
                          </div>
                          
                          <motion.div 
                            animate={isCartBouncing ? { scale: [1, 1.25, 1], y: [0, -3, 0] } : {}}
                            transition={{ duration: 0.3 }}
                            className="relative flex flex-col items-center gap-0.5"
                          >
                            <span className="absolute -top-1.5 -right-2 bg-red-500 text-white text-[7px] w-3.5 h-3.5 rounded-full flex items-center justify-center font-bold border border-white dark:border-[#111312]">
                              {toPersianNumber(cartCount)}
                            </span>
                            <ShoppingBag className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
                            <span className="text-[7px] font-extrabold">سبد خرید</span>
                          </motion.div>
                        </div>

                      </IPhone17ProMaxFrame>

                  </div>

                </div>

                {/* 4. Sync/Autosave Status Footer bar */}
                <div className="mt-6 pt-4 border-t border-slate-100 dark:border-white/5 flex flex-col sm:flex-row justify-between items-center gap-2.5 text-right">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-slate-400 dark:text-slate-500 font-bold">آخرین ویرایش: کمتر از 2 ثانیه پیش</span>
                  </div>

                  <div className="flex items-center gap-2 bg-slate-50 dark:bg-[#0B0D0C] border border-slate-200/50 dark:border-white/5 px-4 py-1.5 rounded-lg">
                    <span className="text-[10px] text-slate-600 dark:text-slate-300 font-extrabold">
                      {syncStatus === 'saving' && "در حال ذخیره و همگام‌سازی…"}
                      {syncStatus === 'saved' && "تغییرات ذخیره شد"}
                      {syncStatus === 'published' && "تغییرات ذخیره و منتشر شد"}
                    </span>
                    <div className="flex items-center justify-center relative">
                      {syncStatus === 'saving' ? (
                        <RotateCw className="w-3.5 h-3.5 text-emerald-400 animate-spin" />
                      ) : (
                        <div className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.6)]" />
                      )}
                    </div>
                  </div>
                </div>

              </div>
            </div>

          </motion.div>

        </div>
      </div>
    </section>
  );
}
