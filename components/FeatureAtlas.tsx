import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { 
  PaintBrush, 
  Tag, 
  CursorClick, 
  Receipt,
  CheckCircle,
  Clock,
  Sparkle,
  ArrowLeft
} from '@phosphor-icons/react';

export type FeatureModuleId = 'studio' | 'products' | 'customer' | 'orders';

interface FeatureAtlasProps {
  activeModule: FeatureModuleId;
  lockedModule: FeatureModuleId;
  onPreviewModule: (module: FeatureModuleId) => void;
  onActivateModule: (module: FeatureModuleId) => void;
  onPointerPresenceChange: (inside: boolean) => void;
  theme: 'light' | 'dark';
}

// ==========================================
// CUSTOM SEMANTIC ANIMATED ICONS
// ==========================================

const StudioIcon = ({ isActive }: { isActive: boolean }) => {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="3" y="3" width="18" height="18" rx="4.5" stroke="currentColor" strokeWidth="1.8" className="opacity-40" />
      <motion.rect
        x="5"
        y="5"
        width="6"
        height="6"
        rx="1.5"
        fill="currentColor"
        fillOpacity={isActive ? 0.15 : 0.05}
        stroke="currentColor"
        strokeWidth="1.8"
        animate={isActive ? { x: 1, y: 1 } : { x: 0, y: 0 }}
        transition={{ type: 'spring', stiffness: 200, damping: 15 }}
      />
      <motion.rect
        x="13"
        y="5"
        width="6"
        height="14"
        rx="1.5"
        fill="currentColor"
        fillOpacity={isActive ? 0.15 : 0.05}
        stroke="currentColor"
        strokeWidth="1.8"
        animate={isActive ? { x: -1 } : { x: 0 }}
        transition={{ type: 'spring', stiffness: 200, damping: 15 }}
      />
      <motion.path
        d="M5 15 H 11"
        stroke="#10b981"
        strokeWidth="2"
        strokeLinecap="round"
        initial={{ pathLength: 0 }}
        animate={isActive ? { pathLength: 1 } : { pathLength: 0 }}
        transition={{ duration: 0.5 }}
      />
    </svg>
  );
};

const ProductsIcon = ({ isActive }: { isActive: boolean }) => {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="3" y="7" width="18" height="13" rx="3" stroke="currentColor" strokeWidth="1.8" className="opacity-40" />
      <motion.path
        d="M8 3 H 16"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        animate={isActive ? { y: 1 } : { y: 0 }}
      />
      <motion.circle
        cx="12"
        cy="13.5"
        r="2"
        stroke="#10b981"
        strokeWidth="1.8"
        animate={isActive ? { scale: [1, 1.2, 1] } : { scale: 1 }}
        transition={{ duration: 0.6 }}
      />
      <motion.path
        d="M7 11 H 9 M15 11 H 17"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        className="opacity-60"
      />
    </svg>
  );
};

const CustomerIcon = ({ isActive }: { isActive: boolean }) => {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="4" y="4" width="16" height="16" rx="4" stroke="currentColor" strokeWidth="1.8" className="opacity-40" />
      <motion.path
        d="M12 12 L 16 16"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        animate={isActive ? { x: [0, -2, 0], y: [0, -2, 0] } : {}}
        transition={{ duration: 0.6 }}
      />
      <motion.circle
        cx="10"
        cy="10"
        r="3"
        stroke="#10b981"
        strokeWidth="1.8"
        animate={isActive ? { r: [3, 4, 3] } : { r: 3 }}
        transition={{ duration: 0.6 }}
      />
    </svg>
  );
};

const OrdersIcon = ({ isActive }: { isActive: boolean }) => {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M4 3 H 20 V 21 L 16 19 L 12 21 L 8 19 L 4 21 Z" stroke="currentColor" strokeWidth="1.8" className="opacity-40" />
      <motion.path
        d="M8 8 H 16 M8 12 H 13"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        animate={isActive ? { x: [0, 1, 0] } : {}}
      />
      <motion.path
        d="M14 14 L 16 16 L 19 13"
        stroke="#10b981"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={{ pathLength: 0 }}
        animate={isActive ? { pathLength: 1 } : { pathLength: 0 }}
        transition={{ duration: 0.4 }}
      />
    </svg>
  );
};

// ==========================================
// PREVIEW 1: DESIGN STUDIO PREVIEW
// ==========================================

const StudioPreview = ({ theme }: { theme: 'light' | 'dark' }) => {
  const [step, setStep] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setStep((prev) => (prev + 1) % 4);
    }, 1200);
    return () => clearInterval(interval);
  }, []);

  const items = [
    { id: 'burger', title: 'برگر کلاسیک', price: '240,000 تومان', order: 0 },
    { id: 'pizza', title: 'پیتزا پپرونی', price: '320,000 تومان', order: 1 },
    { id: 'fries', title: 'سیب زمینی ویژه', price: '140,000 تومان', order: 2 },
  ];

  // Dynamic ordering animation simulation
  const getOrder = (id: string) => {
    if (step >= 2) {
      if (id === 'burger') return 1;
      if (id === 'pizza') return 0;
    }
    return items.find(item => item.id === id)?.order || 0;
  };

  return (
    <div className="w-full h-full flex flex-col justify-between text-right">
      <div className="flex justify-between items-center border-b border-slate-100 dark:border-white/[0.04] pb-2.5 mb-2">
        <span className="text-[10px] bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 px-2 py-0.5 rounded-md font-black">
          استودیو زنده
        </span>
        <span className="text-[10px] text-slate-400 dark:text-slate-500 font-bold">
          چیدمان کارت‌های منو
        </span>
      </div>

      <div className="flex-1 flex flex-col justify-center space-y-2 relative overflow-hidden min-h-[190px]">
        {items.map((item) => {
          const currentOrder = getOrder(item.id);
          return (
            <motion.div
              key={item.id}
              layout
              transition={{ type: 'spring', stiffness: 220, damping: 20 }}
              className="p-3 rounded-xl bg-white dark:bg-[#111413] border border-slate-100 dark:border-white/[0.04] shadow-sm flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <div className="w-2.5 h-6 flex flex-col justify-between items-center cursor-grab opacity-30">
                  <div className="w-1 h-1 rounded-full bg-slate-400" />
                  <div className="w-1 h-1 rounded-full bg-slate-400" />
                  <div className="w-1 h-1 rounded-full bg-slate-400" />
                </div>
                <div className="text-right">
                  <h4 className="text-xs font-black text-slate-800 dark:text-slate-200">
                    {item.title}
                  </h4>
                  <span className="text-[10px] font-mono text-slate-400 dark:text-slate-500 mt-0.5 block">
                    {item.price}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-[9px] bg-slate-100 dark:bg-white/[0.03] text-slate-500 dark:text-slate-400 px-2 py-0.5 rounded-md font-bold">
                  سایز استاندارد
                </span>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Automatic autosave notification banner */}
      <div className="mt-3 flex justify-between items-center pt-2.5 border-t border-slate-100 dark:border-white/[0.04]">
        <div className="flex items-center gap-1.5">
          <motion.div
            animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
            className="w-1.5 h-1.5 rounded-full bg-emerald-500"
          />
          <span className="text-[10px] text-slate-500 dark:text-slate-400 font-bold">
            وضعیت همگام‌سازی:
          </span>
        </div>
        <AnimatePresence mode="wait">
          {step >= 3 ? (
            <motion.span
              key="saved"
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              className="text-[10px] text-emerald-500 font-black flex items-center gap-1"
            >
              به‌روزرسانی موفق
            </motion.span>
          ) : (
            <motion.span
              key="editing"
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              className="text-[10px] text-slate-400 dark:text-slate-500 font-bold"
            >
              در حال ویرایش...
            </motion.span>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

// ==========================================
// PREVIEW 2: PRODUCT MANAGEMENT PREVIEW
// ==========================================

const ProductPreview = ({ theme }: { theme: 'light' | 'dark' }) => {
  const [step, setStep] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setStep((prev) => (prev + 1) % 3);
    }, 1500);
    return () => clearInterval(interval);
  }, []);

  const price = step === 0 ? '340,000' : '290,000';
  const hasDiscount = step > 0;
  const isAvailable = step < 2;

  return (
    <div className="w-full h-full flex flex-col justify-between text-right">
      <div className="flex justify-between items-center border-b border-slate-100 dark:border-white/[0.04] pb-2.5 mb-2">
        <span className="text-[10px] bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 px-2 py-0.5 rounded-md font-black">
          بروزرسانی زنده قیمت
        </span>
        <span className="text-[10px] text-slate-400 dark:text-slate-500 font-bold">
          کنترل قیمت و تخفیف‌ها
        </span>
      </div>

      <div className="flex-1 flex flex-col justify-center gap-3 min-h-[190px]">
        {/* Real Customer-Facing Card primitive */}
        <div className="p-4 rounded-2xl bg-white dark:bg-[#111413] border border-slate-100 dark:border-white/[0.04] shadow-sm relative overflow-hidden transition-all duration-300">
          <div className="flex justify-between items-start">
            <div className="text-right">
              <span className="text-[9px] bg-emerald-500/10 text-emerald-500 px-2 py-0.5 rounded-md font-black">
                برگر ویژه
              </span>
              <h3 className="text-sm font-black text-slate-800 dark:text-slate-100 mt-1.5">
                برگر دوبل پنیر کافه ویترین
              </h3>
              <p className="text-[10px] text-slate-400 dark:text-slate-500 font-bold mt-1 max-w-[200px] leading-relaxed">
                دو لایه گوشت گرم گوساله، پنیر گودا ذوب شده، سس مخصوص
              </p>
            </div>
            <div className="w-16 h-16 rounded-xl bg-slate-50 dark:bg-black/30 border border-slate-100 dark:border-white/[0.03] flex items-center justify-center relative flex-shrink-0">
              <Tag className="w-6 h-6 text-emerald-500 opacity-60" />
              {hasDiscount && (
                <motion.div
                  initial={{ scale: 0, rotate: -15 }}
                  animate={{ scale: 1, rotate: 0 }}
                  className="absolute -top-1.5 -right-1.5 bg-rose-500 text-white font-black text-[8px] px-1.5 py-0.5 rounded-md"
                >
                  ٪15 تخفیف
                </motion.div>
              )}
            </div>
          </div>

          <div className="flex justify-between items-center mt-4 pt-3 border-t border-slate-100 dark:border-white/[0.04]">
            <div className="flex items-center gap-2">
              <span className="text-[10px] text-slate-400 dark:text-slate-500 font-bold">قیمت نهایی:</span>
              <div className="flex items-center gap-1">
                {hasDiscount && (
                  <span className="text-[10px] text-slate-400 line-through font-mono">
                    340,000
                  </span>
                )}
                <motion.span
                  key={price}
                  initial={{ y: 5, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  className="text-xs font-black text-emerald-500 font-mono"
                >
                  {price}
                </motion.span>
                <span className="text-[9px] text-emerald-500 font-black">تومان</span>
              </div>
            </div>

            <div className="flex items-center gap-1.5">
              <span className={`w-1.5 h-1.5 rounded-full ${isAvailable ? 'bg-emerald-500' : 'bg-rose-500'}`} />
              <span className="text-[10px] text-slate-500 dark:text-slate-400 font-bold">
                {isAvailable ? 'موجود در سالن' : 'ناموجود زنده'}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-3 flex justify-between items-center pt-2.5 border-t border-slate-100 dark:border-white/[0.04]">
        <span className="text-[10px] text-slate-400 dark:text-slate-500 font-bold">
          وضعیت تغییرات پنل:
        </span>
        <span className="text-[10px] text-emerald-500 font-black">
          ثبت آنی روی منوی آنلاین
        </span>
      </div>
    </div>
  );
};

// ==========================================
// PREVIEW 3: CUSTOMER EXPERIENCE PREVIEW
// ==========================================

const CustomerPreview = ({ theme }: { theme: 'light' | 'dark' }) => {
  const [step, setStep] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setStep((prev) => (prev + 1) % 4);
    }, 1300);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full h-full flex flex-col justify-between text-right">
      <div className="flex justify-between items-center border-b border-slate-100 dark:border-white/[0.04] pb-2.5 mb-2">
        <span className="text-[10px] bg-[#10b981]/10 text-[#10b981] px-2 py-0.5 rounded-md font-black">
          سفارش آنلاین مستقل
        </span>
        <span className="text-[10px] text-slate-400 dark:text-slate-500 font-bold">
          شبیه‌ساز خرید مشتری
        </span>
      </div>

      <div className="flex-1 flex flex-col justify-center min-h-[190px] relative">
        <div className="p-4 rounded-2xl bg-white dark:bg-[#111413] border border-slate-100 dark:border-white/[0.04] shadow-sm space-y-4">
          {/* Categories Tab Selector */}
          <div className="flex items-center gap-2 border-b border-slate-100 dark:border-white/[0.03] pb-2">
            <span className={`text-[10px] px-2.5 py-1 rounded-full font-black transition-colors ${step === 0 ? 'bg-emerald-500/10 text-[#10b981] border border-emerald-500/20' : 'text-slate-400 dark:text-slate-500'}`}>
              پیتزا
            </span>
            <span className={`text-[10px] px-2.5 py-1 rounded-full font-black transition-colors ${step >= 1 ? 'bg-emerald-500/10 text-[#10b981] border border-emerald-500/20' : 'text-slate-400 dark:text-slate-500'}`}>
              برگرها
            </span>
            <span className="text-[10px] text-slate-400 dark:text-slate-500 px-1 font-bold">
              نوشیدنی
            </span>
          </div>

          {/* Simple card inside */}
          <div className="flex justify-between items-center">
            <div className="text-right">
              <h4 className="text-xs font-black text-slate-800 dark:text-slate-200">
                برگر مخصوص ویترین
              </h4>
              <span className="text-[10px] font-mono text-emerald-500 font-bold mt-1 block">
                285,000 تومان
              </span>
            </div>
            
            {/* Action Add-to-cart button with custom motion visual state */}
            <motion.button
              animate={{
                scale: step === 2 ? 0.95 : 1,
                backgroundColor: step >= 2 ? 'rgba(16, 185, 129, 0.12)' : 'rgba(16, 185, 129, 0.05)',
                color: step >= 2 ? '#10b981' : 'currentColor'
              }}
              className="text-xs font-black px-3.5 py-1.5 rounded-lg border border-emerald-500/20 flex items-center gap-1.5 cursor-default focus:outline-none"
            >
              {step >= 2 ? (
                <>
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-500" weight="fill" />
                  <span>ثبت شد</span>
                </>
              ) : (
                <>
                  <span>+ افزودن به سبد</span>
                </>
              )}
            </motion.button>
          </div>
        </div>

        {/* Floating animated hand cursor simulation */}
        <AnimatePresence>
          {step === 1 && (
            <motion.div
              initial={{ opacity: 0, x: 20, y: 20 }}
              animate={{ opacity: 1, x: -10, y: -5 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className="absolute bottom-6 left-[10%] pointer-events-none z-20"
            >
              <CursorClick className="w-6 h-6 text-[#10b981] filter drop-shadow-md animate-bounce" weight="fill" />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Cart status response bar */}
      <div className="mt-3 flex justify-between items-center pt-2.5 border-t border-slate-100 dark:border-white/[0.04]">
        <span className="text-[10px] text-slate-400 dark:text-slate-500 font-bold">
          سبد خرید مشتری:
        </span>
        <div className="flex items-center gap-1 text-[10px] font-black text-emerald-500">
          <span>سبد خرید:</span>
          <motion.span
            key={step}
            animate={{ scale: step >= 2 ? [1, 1.3, 1] : 1 }}
            className="w-4 h-4 rounded-full bg-emerald-500 text-white font-mono flex items-center justify-center text-[9px]"
          >
            {step >= 2 ? '1' : '0'}
          </motion.span>
        </div>
      </div>
    </div>
  );
};

// ==========================================
// PREVIEW 4: ORDER MANAGEMENT PREVIEW
// ==========================================

const OrdersPreview = ({ theme }: { theme: 'light' | 'dark' }) => {
  const [step, setStep] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setStep((prev) => (prev + 1) % 4);
    }, 1400);
    return () => clearInterval(interval);
  }, []);

  const getStepStatus = (index: number) => {
    if (step >= index) return 'active';
    return 'inactive';
  };

  return (
    <div className="w-full h-full flex flex-col justify-between text-right">
      <div className="flex justify-between items-center border-b border-slate-100 dark:border-white/[0.04] pb-2.5 mb-2">
        <span className="text-[10px] bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 px-2 py-0.5 rounded-md font-black">
          مدیریت سفارش‌ها
        </span>
        <span className="text-[10px] text-slate-400 dark:text-slate-500 font-bold">
          نمایش تبلت آشپزخانه
        </span>
      </div>

      <div className="flex-1 flex flex-col justify-center min-h-[190px]">
        <div className="p-4 rounded-2xl bg-white dark:bg-[#111413] border border-slate-100 dark:border-white/[0.04] shadow-sm space-y-3.5">
          <div className="flex justify-between items-center">
            <span className="text-xs font-black text-slate-800 dark:text-slate-200">
              سفارش شماره #108
            </span>
            <span className="text-[10px] bg-emerald-500/10 text-emerald-500 px-2.5 py-0.5 rounded-full font-black">
              میز شماره 4
            </span>
          </div>

          <div className="space-y-1.5 text-right border-y border-slate-100 dark:border-white/[0.03] py-2">
            <div className="flex justify-between text-[11px] text-slate-600 dark:text-slate-300 font-bold">
              <span>1x برگر کلاسیک مخصوص</span>
              <span>240,000 تومان</span>
            </div>
            <div className="flex justify-between text-[11px] text-slate-600 dark:text-slate-300 font-bold">
              <span>1x سیب زمینی ویژه با پنیر</span>
              <span>140,000 تومان</span>
            </div>
          </div>

          {/* Connected order steps pipeline */}
          <div className="grid grid-cols-3 gap-2 pt-1.5">
            {[
              { label: 'ثبت جدید', key: 1, icon: Receipt },
              { label: 'در حال پخت', key: 2, icon: Clock },
              { label: 'تحویل شده', key: 3, icon: CheckCircle }
            ].map((st) => {
              const isActive = getStepStatus(st.key) === 'active';
              return (
                <div
                  key={st.key}
                  className={`py-2 px-1 rounded-xl border text-center flex flex-col items-center justify-center transition-all ${
                    isActive 
                      ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-600 dark:text-emerald-400 shadow-sm' 
                      : 'bg-transparent border-slate-100 dark:border-white/[0.03] text-slate-400 dark:text-slate-500'
                  }`}
                >
                  <st.icon className="w-4 h-4 mb-1" weight={isActive ? "fill" : "regular"} />
                  <span className="text-[9px] font-black">{st.label}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

    </div>
  );
};

// ==========================================
// CENTRALIZED VIEWPORT PREVIEW ROUTER
// ==========================================

const ActiveModulePreview = ({ activeModule, theme }: { activeModule: FeatureModuleId; theme: 'light' | 'dark' }) => {
  return (
    <div className="w-full h-full p-4 relative z-10 flex flex-col justify-between">
      <AnimatePresence mode="wait">
        <motion.div
          key={activeModule}
          initial={{ opacity: 0, y: 6, filter: 'blur(2px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          exit={{ opacity: 0, y: -6, filter: 'blur(2px)' }}
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          className="w-full h-full flex-1"
        >
          {activeModule === 'studio' && <StudioPreview theme={theme} />}
          {activeModule === 'products' && <ProductPreview theme={theme} />}
          {activeModule === 'customer' && <CustomerPreview theme={theme} />}
          {activeModule === 'orders' && <OrdersPreview theme={theme} />}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

// ==========================================
// CORE COMPACT ATLASEXECUTION FILE COMPONENT
// ==========================================

export const FeatureAtlas: React.FC<FeatureAtlasProps> = ({
  activeModule,
  lockedModule,
  onPreviewModule,
  onActivateModule,
  onPointerPresenceChange,
  theme
}) => {
  const shouldReduceMotion = useReducedMotion();
  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Intent delay wrapper for smoother module preview switches
  const handleHoverStart = (id: FeatureModuleId) => {
    if (shouldReduceMotion) return;
    if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
    hoverTimeoutRef.current = setTimeout(() => {
      onPreviewModule(id);
    }, 110);
  };

  const handleHoverEnd = () => {
    if (shouldReduceMotion) return;
    if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
    onPreviewModule(lockedModule);
  };

  const handleClick = (id: FeatureModuleId) => {
    if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
    onActivateModule(id);
  };

  const modules = [
    { id: 'studio' as FeatureModuleId, label: 'استودیو طراحی', icon: StudioIcon, desc: 'چیدمان بصری' },
    { id: 'products' as FeatureModuleId, label: 'مدیریت محصولات', icon: ProductsIcon, desc: 'قیمت و موجودی' },
    { id: 'customer' as FeatureModuleId, label: 'تجربه مشتری', icon: CustomerIcon, desc: 'سفارش آنلاین' },
    { id: 'orders' as FeatureModuleId, label: 'مدیریت سفارشها', icon: OrdersIcon, desc: 'کنترل سالن و پخت' },
  ];

  // Helper coordinate lookup for curved S-curves
  const getYCenter = (id: FeatureModuleId) => {
    switch (id) {
      case 'studio': return 85;
      case 'products': return 175;
      case 'customer': return 265;
      case 'orders': return 355;
    }
  };

  const currentY = getYCenter(activeModule);

  // Dynamic SVG path definitions for curves based on custom 620x440 coordinate layout
  const baseCurve = `M 480 ${currentY} C 465 ${currentY}, 455 220, 445 220`;
  const exitCurve = `M 425 220 L 400 220`;

  return (
    <div 
      onMouseEnter={() => onPointerPresenceChange(true)}
      onMouseLeave={() => {
        onPointerPresenceChange(false);
        handleHoverEnd();
      }}
      className="w-full relative select-none"
    >
      {/* 1. Main contained translucent showcase deck surface */}
      <div 
        className="w-full min-h-[430px] max-h-[480px] lg:h-[440px] rounded-[36px] bg-white/75 dark:bg-slate-950/90 border border-slate-200/50 dark:border-emerald-500/20 p-4 md:p-5 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.04)] dark:shadow-none backdrop-blur-md relative overflow-hidden flex flex-col justify-between"
      >
        {/* Subtle grid accent faintly glowing behind and inside the surface */}
        <div className="absolute inset-0 pointer-events-none opacity-20 dark:opacity-[0.06] bg-[radial-gradient(#10b981_1.2px,transparent_1.2px)] [background-size:16px_16px] -z-10" />

        {/* Desktop grid layout */}
        <div className="hidden lg:grid grid-cols-12 gap-1 items-center h-full relative">
          
          {/* A. Left Active Preview Area (65% width) */}
          <div className="col-span-7 h-full flex flex-col justify-between rounded-2xl bg-slate-50/40 dark:bg-black/50 border border-slate-100/50 dark:border-white/10 overflow-hidden">
            <ActiveModulePreview activeModule={activeModule} theme={theme} />
          </div>

          {/* B. Middle Connection Pathway Column (SVG dynamic routes) */}
          <div className="col-span-2 h-full relative flex items-center justify-center overflow-visible">
            <svg 
              className="absolute inset-0 w-full h-full pointer-events-none z-0 overflow-visible" 
              viewBox="0 0 110 440" 
              preserveAspectRatio="none"
            >
              <defs>
                <linearGradient id="curveGradient" x1="1" y1="0" x2="0" y2="0">
                  <stop offset="0%" stopColor="#10b981" stopOpacity="0.8" />
                  <stop offset="100%" stopColor="#059669" stopOpacity="0.2" />
                </linearGradient>
              </defs>

              {/* Faint ambient layout connectors represented as circuits */}
              {modules.map((m) => (
                <path
                  key={m.id}
                  d={`M 110 ${getYCenter(m.id)} C 85 ${getYCenter(m.id)}, 65 220, 55 220`}
                  fill="none"
                  stroke={theme === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(16,185,129,0.04)'}
                  strokeWidth="1.2"
                />
              ))}
              <path 
                d="M 35 220 L 0 220" 
                fill="none" 
                stroke={theme === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(16,185,129,0.04)'} 
                strokeWidth="1.2" 
              />

              {/* Active Connector Path */}
              <motion.path
                key={`active-connector-${activeModule}`}
                initial={{ pathLength: 0, opacity: 0.2 }}
                animate={{ pathLength: 1, opacity: 1 }}
                transition={{ duration: 0.45, ease: "easeOut" }}
                d={`M 110 ${currentY} C 85 ${currentY}, 65 220, 55 220`}
                fill="none"
                stroke="url(#curveGradient)"
                strokeWidth="2"
                strokeLinecap="round"
              />

              <motion.path
                key={`active-exit-${activeModule}`}
                initial={{ pathLength: 0, opacity: 0.2 }}
                animate={{ pathLength: 1, opacity: 1 }}
                transition={{ duration: 0.45, ease: "easeOut", delay: 0.2 }}
                d="M 35 220 L 0 220"
                fill="none"
                stroke="url(#curveGradient)"
                strokeWidth="2"
                strokeLinecap="round"
              />

              {/* Active Pulse Burst travelling through core on module switch */}
              {!shouldReduceMotion && (
                <motion.circle
                  key={`pulse-circle-${activeModule}`}
                  r="3.5"
                  fill="#10b981"
                  filter="drop-shadow(0 0 4px #10b981)"
                >
                  <animateMotion
                    dur="0.6s"
                    repeatCount="1"
                    fill="freeze"
                    path={`M 110 ${currentY} C 85 ${currentY}, 65 220, 55 220`}
                    calcMode="spline"
                    keySplines="0.16 1 0.3 1"
                  />
                </motion.circle>
              )}
            </svg>

            {/* Compact Superellipse Vitrin Core at Junction */}
            <motion.div
              animate={{ scale: [1, 0.94, 1] }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              className="absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 z-10 w-[50px] h-[50px] rounded-[1.3rem] bg-gradient-to-br from-[#10b981] via-[#059669] to-[#046a4d] dark:from-[#19C78C] dark:to-[#046146] flex flex-col items-center justify-center p-0.5 shadow-md relative group select-none border border-white/20"
            >
              <span className="text-white font-black text-xs">وی</span>
              
              {/* Telemetry live sync pulse dot */}
              <div className="absolute top-1 right-1 w-1.5 h-1.5 flex items-center justify-center">
                <span className="w-1 h-1 rounded-full bg-[#34D399]" />
                <span className="absolute w-2 h-2 rounded-full bg-[#34D399]/40 animate-ping" />
              </div>
            </motion.div>
          </div>

          {/* C. Right Module Rail Column */}
          <div className="col-span-3 h-full flex flex-col justify-center gap-3 pr-1.5">
            {modules.map((m) => {
              const isActive = activeModule === m.id;
              const isLocked = lockedModule === m.id;

              return (
                <button
                  key={m.id}
                  onClick={() => handleClick(m.id)}
                  onMouseEnter={() => handleHoverStart(m.id)}
                  onMouseLeave={handleHoverEnd}
                  aria-pressed={isLocked}
                  className="w-full text-right focus:outline-none focus:ring-2 focus:ring-[#10b981]/50 rounded-2xl border-0 bg-transparent p-0 cursor-pointer block"
                >
                  <motion.div
                    animate={{
                      height: isActive ? 72 : 60,
                      scale: isActive ? 1.02 : 0.98,
                    }}
                    transition={{ type: 'spring', stiffness: 220, damping: 24 }}
                    className={`w-full rounded-2xl border px-3.5 flex items-center justify-start gap-2.5 transition-all duration-300 relative overflow-hidden ${
                      isActive 
                        ? 'bg-white dark:bg-[#111613] border-[#10b981]/60 text-[#10b981] shadow-md shadow-[#10b981]/5' 
                        : 'bg-white/55 dark:bg-black/10 border-slate-200/20 dark:border-white/[0.03] text-slate-600 dark:text-slate-400 hover:border-slate-300/40 dark:hover:border-white/10'
                    }`}
                  >
                    {/* Active dynamic capsule background via shared layout ID */}
                    {isActive && (
                      <motion.div
                        layoutId="activePillRailBg"
                        className="absolute inset-0 bg-[#10b981]/5 dark:bg-[#19C78C]/5 -z-10"
                        transition={{ type: 'spring', stiffness: 220, damping: 24 }}
                      />
                    )}

                    <div className={`w-7 h-7 rounded-xl flex items-center justify-center flex-shrink-0 transition-colors ${isActive ? 'bg-[#10b981]/15 text-[#10b981]' : 'bg-slate-100/60 dark:bg-white/[0.02]'}`}>
                      <m.icon isActive={isActive} />
                    </div>

                    <div className="flex-1 min-w-0">
                      <h4 className={`text-[11px] font-black truncate leading-normal ${isActive ? 'text-[#10b981]' : 'text-slate-700 dark:text-slate-300'}`}>
                        {m.label}
                      </h4>
                      {isActive && (
                        <motion.span
                          initial={{ opacity: 0, y: 3 }}
                          animate={{ opacity: 0.7, y: 0 }}
                          className="text-[8px] font-bold block truncate mt-0.5 leading-none"
                        >
                          {m.desc}
                        </motion.span>
                      )}
                    </div>
                  </motion.div>
                </button>
              );
            })}
          </div>

        </div>

        {/* Mobile/Tablet Adaptive layout */}
        <div className="flex lg:hidden flex-col gap-4 h-full justify-between">
          
          {/* Horizontal scrollable capsule rail at top */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 -mx-2 px-2 scrollbar-none scroll-smooth">
            {modules.map((m) => {
              const isActive = activeModule === m.id;
              return (
                <button
                  key={m.id}
                  onClick={() => handleClick(m.id)}
                  className={`px-4 py-2.5 rounded-full border text-xs font-black whitespace-nowrap flex items-center gap-2 transition-all flex-shrink-0 cursor-pointer ${
                    isActive 
                      ? 'bg-emerald-500/10 border-emerald-500/40 text-[#10b981]' 
                      : 'bg-white/40 dark:bg-white/[0.02] border-slate-200/30 dark:border-white/[0.04] text-slate-500 dark:text-slate-400'
                  }`}
                >
                  <m.icon isActive={isActive} />
                  <span>{m.label}</span>
                </button>
              );
            })}
          </div>

          {/* Large active preview panel below */}
          <div className="flex-1 min-h-[240px] rounded-2xl bg-slate-50/40 dark:bg-black/20 border border-slate-100/40 dark:border-white/[0.02] overflow-hidden">
            <ActiveModulePreview activeModule={activeModule} theme={theme} />
          </div>

        </div>

      </div>
    </div>
  );
};

export default FeatureAtlas;
