import React, { useState, useEffect, useRef } from 'react';
import { motion, useReducedMotion, useMotionValue, useMotionTemplate, AnimatePresence } from 'framer-motion';
import { Layout, QrCode, ShoppingBag, Check, Sparkles, Clock, ArrowLeft } from 'lucide-react';

// ==========================================
// TYPE DEFINITIONS
// ==========================================

export type ProcessStepId = 'build' | 'publish' | 'manage';

export interface ProcessStep {
  id: ProcessStepId;
  number: string;
  title: string;
  description: string;
  result: string;
}

// ==========================================
// CONSTANTS & DATA
// ==========================================

const STEPS: ProcessStep[] = [
  {
    id: 'build',
    number: '1',
    title: 'منوی خود را بسازید',
    description: 'محصولات، دسته‌بندی‌ها و اطلاعات کافه یا رستوران خود را به سادگی و به صورت کاملاً ویژوال در استودیو طراحی کنید.',
    result: 'دست‌آورد: طراحی اختصاصی متناسب با برند شما',
  },
  {
    id: 'publish',
    number: '2',
    title: 'منتشرش کنید',
    description: 'طرح نهایی منو را با یک کلیک روی دامنه اختصاصی خود یا کدهای QR میزها فعال کنید تا در دسترس مشتریان قرار گیرد.',
    result: 'دست‌آورد: دسترسی آنی خریدار بدون نیاز به نصب اپلیکیشن',
  },
  {
    id: 'manage',
    number: '3',
    title: 'سفارش‌ها را مدیریت کنید',
    description: 'سفارش‌های ثبت‌شده مشتریان را با اطلاعات دقیق میز و پرداخت، مستقیماً در پنل مدیریت ویترین دریافت و پیگیری کنید.',
    result: 'دست‌آورد: کاهش خطاهای سفارش‌گیری به صفر درصد',
  },
];

// ==========================================
// CUSTOM SEMANTIC ANIMATED ICONS
// ==========================================

/**
 * Step 1 Icon: Menu Design
 * - Interface frame draws in
 * - Internal layout lines appear sequentially
 * - Small element shifts into place
 * - On hover, the internal rows rearrange subtly
 */
const AnimatedMenuIcon: React.FC<{ isHovered: boolean; isReduced: boolean }> = ({ isHovered, isReduced }) => {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-emerald-600 dark:text-[#19C78C]">
      {/* Outer frame */}
      <motion.rect
        x="3"
        y="3"
        width="18"
        height="18"
        rx="3"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        initial={isReduced ? { pathLength: 1 } : { pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
      />
      {/* Horizontal divider (top-bar) */}
      <motion.line
        x1="3"
        y1="8"
        x2="21"
        y2="8"
        stroke="currentColor"
        strokeWidth="1.5"
        initial={isReduced ? { pathLength: 1 } : { pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      />
      {/* Row 1 layout lines */}
      <motion.rect
        x="6"
        y="11"
        width="12"
        height="3"
        rx="0.5"
        fill="currentColor"
        fillOpacity={0.15}
        stroke="currentColor"
        strokeWidth="1"
        animate={
          isReduced
            ? {}
            : isHovered
            ? { y: 3, transition: { duration: 0.3, ease: 'easeInOut' } }
            : { y: 0, transition: { duration: 0.3 } }
        }
      />
      {/* Row 2 layout lines */}
      <motion.rect
        x="6"
        y="16"
        width="8"
        height="3"
        rx="0.5"
        fill="currentColor"
        fillOpacity={0.15}
        stroke="currentColor"
        strokeWidth="1"
        animate={
          isReduced
            ? {}
            : isHovered
            ? { y: -5, transition: { duration: 0.3, ease: 'easeInOut' } }
            : { y: 0, transition: { duration: 0.3 } }
        }
      />
      {/* A tiny accent element that shifts into place */}
      <motion.circle
        cx="17"
        cy="17.5"
        r="1.5"
        fill="currentColor"
        className="text-[#10b981] dark:text-[#19C78C]"
        initial={isReduced ? { scale: 1 } : { scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 200, delay: 0.6 }}
      />
    </svg>
  );
};

/**
 * Step 2 Icon: QR Code Scanner
 * - QR icon scales in
 * - A scan beam moves from top to bottom
 * - Small QR modules pulse in sequence
 */
const AnimatedQRPublishIcon: React.FC<{ isHovered: boolean; isReduced: boolean }> = ({ isHovered, isReduced }) => {
  const [beamTrigger, setBeamTrigger] = useState(0);

  useEffect(() => {
    if (isHovered && !isReduced) {
      setBeamTrigger((prev) => prev + 1);
    }
  }, [isHovered, isReduced]);

  return (
    <div className="relative w-6 h-6 flex items-center justify-center overflow-hidden">
      <motion.svg
        width="22"
        height="22"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        className="text-emerald-600 dark:text-[#19C78C]"
        initial={isReduced ? { scale: 1 } : { scale: 0.85, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 180, delay: 0.1 }}
      >
        {/* Top Right, Top Left, Bottom Left corners of QR */}
        <path d="M3 9V5a2 2 0 0 1 2-2h4M15 3h4a2 2 0 0 1 2 2v4M21 15v4a2 2 0 0 1-2 2h-4M9 21H5a2 2 0 0 1-2-2v-4" />
        <rect x="7" y="7" width="3" height="3" fill="currentColor" fillOpacity={0.4} />
        <rect x="14" y="7" width="3" height="3" fill="currentColor" fillOpacity={0.4} />
        <rect x="7" y="14" width="3" height="3" fill="currentColor" fillOpacity={0.4} />
        <rect x="14" y="14" width="3" height="3" fill="currentColor" fillOpacity={0.8} />
      </motion.svg>

      {/* Moving scan line beam */}
      {!isReduced && (
        <motion.div
          key={beamTrigger}
          className="absolute left-0 right-0 h-[1.5px] bg-emerald-500 dark:bg-[#19C78C] shadow-[0_0_8px_rgba(16,185,129,0.8)]"
          initial={{ top: -2 }}
          animate={{ top: 26 }}
          transition={{ duration: 1.2, ease: 'easeInOut' }}
        />
      )}
    </div>
  );
};

/**
 * Step 3 Icon: Order Ticket Management
 * - Order ticket outline draws in
 * - A tiny receipt slides downward
 * - A small confirmation checkmark appears
 */
const AnimatedOrderIcon: React.FC<{ isHovered: boolean; isReduced: boolean }> = ({ isHovered, isReduced }) => {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-emerald-600 dark:text-[#19C78C]">
      {/* Outer Bag/Ticket border */}
      <motion.path
        d="M6 3h12a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        initial={isReduced ? { pathLength: 1 } : { pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.7, ease: 'easeOut' }}
      />
      {/* Receipt zig-zag at the bottom cut */}
      <motion.path
        d="M4 19l4-2 4 2 4-2 4 2"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={isReduced ? { pathLength: 1 } : { pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.4, delay: 0.3 }}
      />
      {/* Sliding ticket content rows */}
      <motion.g
        animate={
          isReduced
            ? {}
            : isHovered
            ? { y: [0, 2, 0], transition: { duration: 0.5, ease: 'easeInOut' } }
            : {}
        }
      >
        <motion.line
          x1="7"
          y1="7"
          x2="17"
          y2="7"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          initial={isReduced ? { opacity: 1 } : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        />
        <motion.line
          x1="7"
          y1="11"
          x2="14"
          y2="11"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          initial={isReduced ? { opacity: 1 } : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        />
      </motion.g>
      {/* Small confirmation check */}
      <motion.path
        d="M14 15l2 2 4-4"
        stroke="currentColor"
        className="text-[#10b981] dark:text-[#19C78C]"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={isReduced ? { pathLength: 1, opacity: 1 } : { pathLength: 0, opacity: 0 }}
        animate={isHovered ? { pathLength: 1, opacity: 1 } : { pathLength: 1, opacity: 1 }}
        transition={{ duration: 0.4, delay: 0.6 }}
      />
    </svg>
  );
};

// ==========================================
// PREVIEWS WITH PREMIUM MICRO-INTERACTIONS
// ==========================================

/**
 * Preview 1: Visual Menu Editing
 * - List rows reordering elegantly
 * - Save feedback, hover reordering
 */
const MenuBuilderPreview: React.FC<{ isHovered: boolean; isReduced: boolean }> = ({ isHovered, isReduced }) => {
  const [items, setItems] = useState([
    { id: '1', title: 'پیتزا بیکن دودی', label: 'ویژه', isSpecial: true, isGhost: false },
    { id: '2', title: 'برگر زغالی کلاسیک', label: 'محبوب', isSpecial: false, isGhost: false },
    { id: '3', title: 'سیب‌زمینی آلفردو', label: 'جدید', isSpecial: false, isGhost: true },
  ]);

  const [savedVisible, setSavedVisible] = useState(false);

  // Trigger state changes once when hover changes
  useEffect(() => {
    if (isHovered && !isReduced) {
      // Reorder: Move Item 2 to top, Item 1 to second
      setItems([
        { id: '2', title: 'برگر زغالی کلاسیک', label: 'محبوب', isSpecial: true, isGhost: false },
        { id: '1', title: 'پیتزا بیکن دودی', label: 'ویژه', isSpecial: false, isGhost: false },
        { id: '3', title: 'سیب‌زمینی آلفردو', label: 'جدید', isSpecial: false, isGhost: true },
      ]);
      const timer = setTimeout(() => {
        setSavedVisible(true);
      }, 700);
      return () => clearTimeout(timer);
    } else {
      setItems([
        { id: '1', title: 'پیتزا بیکن دودی', label: 'ویژه', isSpecial: true, isGhost: false },
        { id: '2', title: 'برگر زغالی کلاسیک', label: 'محبوب', isSpecial: false, isGhost: false },
        { id: '3', title: 'سیب‌زمینی آلفردو', label: 'جدید', isSpecial: false, isGhost: true },
      ]);
      setSavedVisible(false);
    }
  }, [isHovered, isReduced]);

  return (
    <div className="relative bg-slate-50 dark:bg-[#171C19] rounded-2xl p-4 border border-slate-100 dark:border-white/5 min-h-[140px] flex flex-col justify-center gap-2 select-none">
      {/* Editor cursor visual guide */}
      {!isReduced && isHovered && (
        <motion.div
          className="absolute top-8 right-6 z-20 pointer-events-none"
          initial={{ opacity: 0, scale: 0.8, x: 20, y: 10 }}
          animate={{ opacity: [0, 1, 1, 0], scale: [0.8, 1, 1, 0.8], x: [20, -5, -5, 20], y: [10, -8, -8, 10] }}
          transition={{ duration: 1.5, times: [0, 0.2, 0.8, 1], ease: 'easeInOut' }}
        >
          <div className="flex items-center gap-1.5 bg-slate-950 dark:bg-black text-white text-[8px] font-black px-2 py-1 rounded-full shadow-lg border border-white/20 whitespace-nowrap">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>ویرایش چیدمان</span>
          </div>
        </motion.div>
      )}

      {/* Floating Saved Toast Notification */}
      <AnimatePresence>
        {savedVisible && (
          <motion.div
            className="absolute bottom-2 left-1/2 -translate-x-1/2 bg-emerald-600 dark:bg-[#19C78C] text-white dark:text-black text-[9px] font-bold px-3 py-1 rounded-full shadow-lg flex items-center gap-1 z-10"
            initial={{ opacity: 0, y: 8, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -4, scale: 0.9 }}
            transition={{ type: 'spring', stiffness: 220, damping: 15 }}
          >
            <Check className="w-2.5 h-2.5" />
            <span>تغییرات ذخیره شد</span>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="space-y-1.5">
        {items.map((item, idx) => (
          <motion.div
            key={item.id}
            layout={!isReduced}
            transition={{ type: 'spring', stiffness: 220, damping: 20 }}
            className={`h-7 rounded-lg border flex items-center justify-between px-2.5 transition-all duration-300 ${
              item.isGhost
                ? 'bg-white/40 dark:bg-black/20 border-slate-100 dark:border-white/5 opacity-40'
                : item.isSpecial
                ? 'bg-emerald-500/5 dark:bg-[#19C78C]/5 border-emerald-500/20 dark:border-[#19C78C]/20 shadow-xs'
                : 'bg-white dark:bg-[#121614] border-slate-200/60 dark:border-white/5 shadow-xs'
            }`}
          >
            <div className="flex items-center gap-1.5">
              <span
                className={`text-[7px] px-1.5 py-0.5 rounded-md font-extrabold transition-all duration-300 ${
                  item.isGhost
                    ? 'bg-slate-100 dark:bg-white/5 text-slate-400 dark:text-slate-500'
                    : item.isSpecial
                    ? 'bg-emerald-500 text-white dark:text-black'
                    : 'bg-slate-100 dark:bg-white/5 text-slate-500 dark:text-slate-400'
                }`}
              >
                {item.label}
              </span>
            </div>
            <span className={`text-[9px] font-black transition-colors duration-300 ${item.isSpecial ? 'text-slate-800 dark:text-[#F4F7F5]' : 'text-slate-600 dark:text-[#A4ADA8]'}`}>
              {item.title}
            </span>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

/**
 * Preview 2: QR Code and Scanner
 * - Scanner line travel
 * - State switch from «آماده انتشار» to «منتشر شد»
 */
const PublishQRPreview: React.FC<{ isHovered: boolean; isReduced: boolean }> = ({ isHovered, isReduced }) => {
  const [published, setPublished] = useState(false);
  const [beamTrigger, setBeamTrigger] = useState(0);

  useEffect(() => {
    if (isHovered && !isReduced) {
      setBeamTrigger((prev) => prev + 1);
      const timer = setTimeout(() => {
        setPublished(true);
      }, 600);
      return () => clearTimeout(timer);
    } else {
      setPublished(false);
    }
  }, [isHovered, isReduced]);

  return (
    <div className="relative bg-slate-50 dark:bg-[#171C19] rounded-2xl p-4 border border-slate-100 dark:border-white/5 min-h-[140px] flex flex-col items-center justify-center gap-2 select-none overflow-hidden">
      {/* Scan Pulse Radial Glow Background */}
      {!isReduced && isHovered && (
        <motion.div
          className="absolute inset-0 bg-radial from-emerald-500/5 to-transparent pointer-events-none rounded-2xl"
          initial={{ opacity: 0, scale: 0.6 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
        />
      )}

      {/* Main interactive QR mockup board */}
      <motion.div
        className="relative bg-white dark:bg-[#121614] p-2.5 rounded-xl border border-slate-200/80 dark:border-white/5 shadow-md flex flex-col items-center gap-1.5 w-24"
        animate={!isReduced && isHovered ? { y: -2, scale: 1.02 } : { y: 0, scale: 1 }}
        transition={{ type: 'spring', stiffness: 200, damping: 15 }}
      >
        <div className="relative">
          <QrCode className="w-12 h-12 text-slate-800 dark:text-slate-200" />
          
          {/* Animated red/emerald laser scanner beam */}
          {!isReduced && isHovered && (
            <motion.div
              key={beamTrigger}
              className="absolute left-0 right-0 h-[1.5px] bg-emerald-500 dark:bg-[#19C78C] shadow-[0_0_8px_rgba(16,185,129,0.9)]"
              initial={{ top: 0 }}
              animate={{ top: 48 }}
              transition={{ duration: 1.0, ease: 'easeInOut' }}
            />
          )}
        </div>
        <span className="text-[8px] font-black text-slate-600 dark:text-[#A4ADA8] bg-slate-100 dark:bg-white/5 px-2 py-0.5 rounded">میز شماره 4</span>
      </motion.div>

      {/* Status Indicators and micro domain link */}
      <div className="flex flex-col items-center gap-0.5 z-10 w-full mt-1">
        <motion.span
          className={`text-[8px] font-black px-2 py-0.5 rounded-full border ${
            published
              ? 'bg-emerald-500/10 text-emerald-600 dark:text-[#19C78C] border-emerald-500/20 dark:border-[#19C78C]/20'
              : 'bg-amber-500/10 text-amber-600 dark:text-[#F59E0B] border-amber-500/20 dark:border-[#F59E0B]/20'
          }`}
          layout
        >
          {published ? '● منتشر شد' : '○ آماده انتشار'}
        </motion.span>
        
        {/* Domain chip */}
        <span className="text-[7px] text-slate-400 dark:text-slate-500 font-mono tracking-tight mt-0.5">menu.vitrin.me/shandiz</span>
      </div>
    </div>
  );
};

/**
 * Preview 3: Live Order Ticket Stream
 * - Order statuses transitions: جدید -> در حال آماده‌سازی -> آماده تحویل
 */
const OrderManagementPreview: React.FC<{ isHovered: boolean; isReduced: boolean }> = ({ isHovered, isReduced }) => {
  const [status, setStatus] = useState<'new' | 'preparing' | 'ready'>('preparing');

  useEffect(() => {
    if (isHovered && !isReduced) {
      // Step 1: new -> preparing -> ready
      setStatus('new');
      const t1 = setTimeout(() => setStatus('preparing'), 500);
      const t2 = setTimeout(() => setStatus('ready'), 1100);
      return () => {
        clearTimeout(t1);
        clearTimeout(t2);
      };
    } else {
      setStatus('preparing');
    }
  }, [isHovered, isReduced]);

  const getStatusLabel = () => {
    switch (status) {
      case 'new':
        return { text: 'سفارش جدید', bg: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20 dark:border-blue-400/20' };
      case 'preparing':
        return { text: 'در حال آماده‌سازی', bg: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20 dark:border-amber-400/20' };
      case 'ready':
        return { text: 'آماده تحویل', bg: 'bg-emerald-500/10 text-emerald-600 dark:text-[#19C78C] border-emerald-500/20 dark:border-[#19C78C]/20' };
    }
  };

  const currentStatus = getStatusLabel();

  return (
    <div className="relative bg-slate-50 dark:bg-[#171C19] rounded-2xl p-4 border border-slate-100 dark:border-white/5 min-h-[140px] flex flex-col justify-center select-none overflow-hidden">
      <motion.div
        className="bg-white dark:bg-[#121614] border border-slate-200/80 dark:border-white/5 p-3 rounded-xl shadow-xs space-y-2 relative"
        animate={!isReduced && isHovered ? { scale: 1.02, y: -1 } : { scale: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 200, damping: 15 }}
      >
        <div className="flex items-center justify-between">
          <motion.span
            key={status}
            className={`text-[8px] font-black px-1.5 py-0.5 rounded border transition-colors ${currentStatus.bg}`}
            initial={isReduced ? {} : { scale: 0.9, opacity: 0.5 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 200, damping: 12 }}
          >
            {currentStatus.text}
          </motion.span>
          <span className="text-[8px] text-slate-400 dark:text-slate-500 font-mono">میز شماره 2</span>
        </div>

        <div className="space-y-1 border-t border-slate-100 dark:border-white/5 pt-1.5 text-right">
          <span className="text-[9px] text-slate-800 dark:text-[#F4F7F5] font-extrabold block">پیتزا پپرونی تند</span>
          <span className="text-[7.5px] text-slate-400 dark:text-slate-500 block">+ پنیر اضافه، سوسیس بوقلمون</span>
        </div>

        {/* Dynamic checking indicators */}
        <div className="flex items-center gap-1 justify-end pt-1">
          <span className="text-[7px] text-slate-400 dark:text-slate-500">پرداخت آنلاین موفق</span>
          <div className="w-3.5 h-3.5 rounded-full bg-emerald-500/10 dark:bg-[#19C78C]/15 border border-emerald-500/25 dark:border-[#19C78C]/20 flex items-center justify-center shrink-0">
            <Check className="w-2.5 h-2.5 text-emerald-600 dark:text-[#19C78C]" />
          </div>
        </div>
      </motion.div>
    </div>
  );
};

// ==========================================
// PROCESS CARD SUB-COMPONENT
// ==========================================

interface ProcessCardProps {
  step: ProcessStep;
  index: number;
  activeStep: number | null;
  setActiveStep: (index: number | null) => void;
  isReduced: boolean;
}

const ProcessCard: React.FC<ProcessCardProps> = ({ step, index, activeStep, setActiveStep, isReduced }) => {
  const [isFocused, setIsFocused] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  
  // Define radial background highlight using useMotionTemplate at the top level (always executed)
  const radialBg = useMotionTemplate`radial-gradient(140px circle at ${mouseX}px ${mouseY}px, rgba(16, 185, 129, 0.05), transparent 85%)`;

  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    if (isReduced) return;
    const { left, top } = event.currentTarget.getBoundingClientRect();
    mouseX.set(event.clientX - left);
    mouseY.set(event.clientY - top);
  };

  const isHovered = activeStep === index + 1;
  const isAnyHovered = activeStep !== null;
  const isActive = isHovered || isFocused;

  // Reduced opacity for other cards
  const opacityValue = isAnyHovered && !isActive ? 0.82 : 1;

  // Custom entrance values based on step index (Step 1 is idx=0, right; Step 2 is idx=1, center; Step 3 is idx=2, left)
  const getEntranceVariants = () => {
    if (isReduced) {
      return {
        hidden: { opacity: 0 },
        visible: { opacity: 1 },
      };
    }
    
    switch (index) {
      case 0: // Step 1 (Enter from right)
        return {
          hidden: { opacity: 0, x: 36, y: 18, scale: 0.96, filter: 'blur(6px)' },
          visible: {
            opacity: 1,
            x: 0,
            y: 0,
            scale: 1,
            filter: 'blur(0px)',
            transition: { duration: 0.65, ease: [0.16, 1, 0.3, 1], delay: index * 0.14 },
          },
        };
      case 2: // Step 3 (Enter from left)
        return {
          hidden: { opacity: 0, x: -36, y: 18, scale: 0.96, filter: 'blur(6px)' },
          visible: {
            opacity: 1,
            x: 0,
            y: 0,
            scale: 1,
            filter: 'blur(0px)',
            transition: { duration: 0.65, ease: [0.16, 1, 0.3, 1], delay: index * 0.14 },
          },
        };
      default: // Step 2 (Enter from below)
        return {
          hidden: { opacity: 0, y: 38, scale: 0.96, filter: 'blur(6px)' },
          visible: {
            opacity: 1,
            y: 0,
            scale: 1,
            filter: 'blur(0px)',
            transition: { duration: 0.65, ease: [0.16, 1, 0.3, 1], delay: index * 0.14 },
          },
        };
    }
  };

  return (
    <motion.div
      ref={cardRef}
      variants={getEntranceVariants()}
      onMouseEnter={() => setActiveStep(index + 1)}
      onMouseLeave={() => setActiveStep(null)}
      onFocus={() => {
        setIsFocused(true);
        setActiveStep(index + 1);
      }}
      onBlur={() => {
        setIsFocused(false);
        setActiveStep(null);
      }}
      onMouseMove={handleMouseMove}
      onTouchStart={() => setActiveStep(index + 1)}
      onTouchEnd={() => setActiveStep(null)}
      tabIndex={0}
      style={{ opacity: opacityValue }}
      className={`relative bg-white dark:bg-[#121614] rounded-3xl border transition-all duration-300 flex flex-col justify-between group outline-hidden select-none h-full p-6 md:p-8 ${
        isActive 
          ? '-translate-y-1.5 scale-[1.006] border-emerald-500/20 dark:border-[#19C78C]/20 shadow-lg' 
          : 'border-slate-200/50 dark:border-white/5 shadow-xs'
      }`}
    >
      {/* Pointer following radial highlight light - Desktop & Non-reduced only */}
      {!isReduced && isActive && (
        <motion.div
          className="absolute inset-0 pointer-events-none rounded-3xl hidden md:block"
          style={{
            background: radialBg
          }}
        />
      )}

      <div>
        {/* Top Header Row */}
        <div className="flex justify-between items-center mb-5 relative z-10">
          {/* Spring animated number badge */}
          <motion.div
            className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-base border transition-all duration-300 ${
              isActive
                ? 'bg-emerald-500 dark:bg-[#19C78C] text-white dark:text-black border-emerald-500 dark:border-[#19C78C] scale-106 -translate-y-0.5'
                : 'bg-emerald-50/50 dark:bg-[#19C78C]/5 text-[#10b981] dark:text-[#19C78C] border-emerald-100 dark:border-[#19C78C]/10'
            }`}
            initial={isReduced ? { scale: 1, opacity: 1 } : { scale: 0, rotate: 8, opacity: 0 }}
            whileInView={{ scale: 1, rotate: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{
               type: 'spring',
               stiffness: 260,
               damping: 18,
               delay: 0.35 + index * 0.12,
            }}
          >
            {step.number}
          </motion.div>

          {/* Semantic Animated Icons */}
          <div className="w-10 h-10 bg-slate-50 dark:bg-[#171C19] rounded-xl flex items-center justify-center border border-slate-100 dark:border-white/5 transition-colors group-hover:border-emerald-100">
            {step.id === 'build' && <AnimatedMenuIcon isHovered={isActive} isReduced={isReduced} />}
            {step.id === 'publish' && <AnimatedQRPublishIcon isHovered={isActive} isReduced={isReduced} />}
            {step.id === 'manage' && <AnimatedOrderIcon isHovered={isActive} isReduced={isReduced} />}
          </div>
        </div>

        {/* Text Area */}
        <div className="space-y-2 mb-5 relative z-10 text-right">
          <h3 className={`text-base font-black transition-colors duration-300 ${isActive ? 'text-emerald-700 dark:text-[#19C78C]' : 'text-slate-800 dark:text-[#F4F7F5]'}`}>
            {step.title}
          </h3>
          <p className="text-xs text-slate-500 dark:text-[#A4ADA8] leading-relaxed min-h-[40px]">
            {step.description}
          </p>
        </div>

        {/* Customized Previews */}
        <div className="relative z-10 mb-6">
          {step.id === 'build' && <MenuBuilderPreview isHovered={isActive} isReduced={isReduced} />}
          {step.id === 'publish' && <PublishQRPreview isHovered={isActive} isReduced={isReduced} />}
          {step.id === 'manage' && <OrderManagementPreview isHovered={isActive} isReduced={isReduced} />}
        </div>
      </div>

      {/* Result Footer Statement */}
      <div className="pt-4 border-t border-slate-100/80 dark:border-white/5 flex items-center justify-between text-right relative z-10">
        <div className="flex items-center gap-1.5 justify-end w-full">
          {/* Subtle indicator dot on hover */}
          <motion.div
            className="w-1.5 h-1.5 rounded-full bg-[#10b981] dark:bg-[#19C78C]"
            initial={{ scale: 0, opacity: 0 }}
            animate={isActive ? { scale: 1, opacity: 1 } : { scale: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
          />
          <motion.span 
            className={`text-[11px] font-black leading-none transition-colors duration-200 ${isActive ? 'text-emerald-800 dark:text-[#19C78C] font-extrabold' : 'text-[#10b981] dark:text-[#19C78C]'}`}
            animate={isActive ? { y: -1 } : { y: 0 }}
          >
            {step.result}
          </motion.span>
        </div>
      </div>
    </motion.div>
  );
};

// ==========================================
// CONNECTING PROCESS LINE (Desktop SVG)
// ==========================================

const ProcessConnector: React.FC<{ activeStep: number | null; isReduced: boolean }> = ({ activeStep, isReduced }) => {
  if (isReduced) return null;

  // Determine path length progress based on activeStep
  // Step 1: index 0 (on right, x=83.3%)
  // Step 2: index 1 (center, x=50%)
  // Step 3: index 2 (on left, x=16.6%)
  // Line goes from right to left (M 833 -> L 166)
  let pathLengthValue = 0;
  if (activeStep === 1) pathLengthValue = 0.05;
  else if (activeStep === 2) pathLengthValue = 0.52;
  else if (activeStep === 3) pathLengthValue = 1.0;

  return (
    <div className="absolute top-[160px] left-0 right-0 h-20 w-full pointer-events-none hidden lg:block z-0">
      <svg width="100%" height="80" viewBox="0 0 1000 80" fill="none" preserveAspectRatio="none">
        {/* Faint grey background baseline */}
        <motion.path
          d="M 833 40 C 700 20, 633 60, 500 40 C 367 20, 300 60, 166 40"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          className="text-slate-200 dark:text-white/10"
          initial={{ pathLength: 0 }}
          whileInView={{ pathLength: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
        />

        {/* Dynamic Glowing Emerald progress line overlay */}
        <motion.path
          d="M 833 40 C 700 20, 633 60, 500 40 C 367 20, 300 60, 166 40"
          stroke="#10b981"
          strokeWidth="2.5"
          strokeLinecap="round"
          animate={{ pathLength: pathLengthValue }}
          transition={{ type: 'spring', stiffness: 80, damping: 15 }}
        />

        {/* Node Circles */}
        {/* Node 1: Step 1 (Right) */}
        <circle cx="833" cy="40" r="5" fill="currentColor" stroke={activeStep && activeStep >= 1 ? '#10b981' : 'currentColor'} strokeWidth="3" className="text-white dark:text-[#121614]" />
        {/* Node 2: Step 2 (Center) */}
        <circle cx="500" cy="40" r="5" fill="currentColor" stroke={activeStep && activeStep >= 2 ? '#10b981' : 'currentColor'} strokeWidth="3" className="text-white dark:text-[#121614]" />
        {/* Node 3: Step 3 (Left) */}
        <circle cx="166" cy="40" r="5" fill="currentColor" stroke={activeStep && activeStep >= 3 ? '#10b981' : 'currentColor'} strokeWidth="3" className="text-white dark:text-[#121614]" />
      </svg>
    </div>
  );
};

// ==========================================
// MAIN SECTION EXPORT
// ==========================================

export const ThreeStepSection: React.FC = () => {
  const [activeStep, setActiveStep] = useState<number | null>(null);
  const isReduced = useReducedMotion() ?? false;

  const headingRef = useRef<HTMLDivElement>(null);

  // Stagger parameters for choreographed entrance
  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.14,
        delayChildren: 0.1,
      },
    },
  };

  return (
    <section id="how-it-works" className="py-20 lg:py-28 bg-[#FBFBFA] dark:bg-[#0B0E0C] overflow-hidden relative">
      <div className="max-w-7xl mx-auto px-6 relative">
        
        {/* Choreographed Heading Entrance */}
        <motion.div
          ref={headingRef}
          className="text-center max-w-2xl mx-auto mb-20 space-y-4"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2, margin: '0px 0px -10% 0px' }}
          variants={{
            hidden: { opacity: 0 },
            visible: { opacity: 1, transition: { staggerChildren: 0.12 } },
          }}
        >
          {/* Eyebrow Badge Animation */}
          <motion.div
            className="inline-block"
            variants={{
              hidden: { opacity: 0, y: 15, scale: 0.92 },
              visible: { 
                opacity: 1, 
                y: 0, 
                scale: 1,
                transition: { type: 'spring', stiffness: 200, damping: 15 }
              }
            }}
          >
            <span className="relative text-[10px] uppercase tracking-[0.2em] font-black text-[#10b981] dark:text-[#19C78C] bg-emerald-500/5 dark:bg-[#19C78C]/5 px-4 py-1.5 rounded-full border border-[#10b981]/15 dark:border-[#19C78C]/15 overflow-hidden block">
              مسیر راه‌اندازی منو
              {/* Subtle highlight sweep */}
              {!isReduced && (
                <motion.div 
                  className="absolute inset-0 bg-linear-to-r from-transparent via-white/45 to-transparent -translate-x-full"
                  animate={{ translateX: ['100%', '-100%'] }}
                  transition={{ duration: 1.8, repeat: Infinity, repeatDelay: 4, ease: 'easeInOut' }}
                />
              )}
            </span>
          </motion.div>

          {/* Heading with line-level mask */}
          <div className="overflow-hidden py-1">
            <motion.h2
              className="text-2xl sm:text-3xl md:text-4xl font-black text-[#18181B] dark:text-[#F4F7F5] tracking-tight leading-tight"
              variants={{
                hidden: { opacity: 0, y: 28, filter: 'blur(3px)' },
                visible: { 
                  opacity: 1, 
                  y: 0, 
                  filter: 'blur(0px)',
                  transition: { duration: 0.65, ease: [0.16, 1, 0.3, 1] } 
                }
              }}
            >
              سه قدم ساده تا تحول کامل منو
            </motion.h2>
          </div>

          {/* Supporting paragraph */}
          <motion.p
            className="text-[#71717A] dark:text-[#A4ADA8] font-medium text-sm sm:text-base leading-relaxed"
            variants={{
              hidden: { opacity: 0, y: 16 },
              visible: { 
                opacity: 1, 
                y: 0, 
                transition: { duration: 0.5, ease: 'easeOut', delay: 0.12 } 
              }
            }}
          >
            بستر اختصاصی و مدرن سفارش‌گیری دیجیتال خود را بدون واسطه‌ها پایه‌ریزی کنید.
          </motion.p>

          {/* Subtle short separator line growing from right to left */}
          <div className="flex justify-center pt-2">
            <motion.div
              className="h-[2px] bg-emerald-500/30 rounded-full"
              initial={{ width: 0 }}
              whileInView={{ width: 48 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: 'easeInOut', delay: 0.3 }}
            />
          </div>
        </motion.div>

        {/* Cards Grid Container */}
        <div className="relative">
          {/* Desktop Visual Connection Path */}
          <ProcessConnector activeStep={activeStep} isReduced={isReduced} />

          <motion.div
            className="grid grid-cols-1 lg:grid-cols-3 gap-8 relative z-10"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2, margin: '0px 0px -10% 0px' }}
            variants={containerVariants}
          >
            {STEPS.map((step, idx) => (
              <ProcessCard
                key={step.id}
                step={step}
                index={idx}
                activeStep={activeStep}
                setActiveStep={setActiveStep}
                isReduced={isReduced}
              />
            ))}
          </motion.div>
        </div>

      </div>
    </section>
  );
};
