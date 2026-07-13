import React, { useState } from 'react';
import { motion, useReducedMotion, useMotionValue, useMotionTemplate } from 'framer-motion';

// ==========================================
// DATA MODELS
// ==========================================
interface TrustItem {
  id: string;
  title: string;
  description: string;
  iconType: 'percent' | 'clock' | 'support';
}

const TRUST_ITEMS: TrustItem[] = [
  {
    id: 'commission',
    title: 'سفارش‌گیری مستقیم بدون کارمزد',
    description: 'سود کامل رستوران متعلق به خودتان است؛ بدون پرداخت هیچ‌گونه کارمزد یا درصدهای سنگین به واسطه‌ها.',
    iconType: 'percent',
  },
  {
    id: 'setup',
    title: 'راه‌اندازی فوری در چند ساعت',
    description: 'بدون نیاز به یک کلمه کدنویسی یا طی مراحل پیچیده اداری، منوی دیجیتال خود را بلافاصله فعال و مستقر کنید.',
    iconType: 'clock',
  },
  {
    id: 'support',
    title: 'پشتیبانی همه‌جانبه فارسی',
    description: 'تیم فنی ویترین در تمامی مراحل راه‌اندازی منو، ساخت کدهای QR، اتصال دامنه و درگاه در کنار شماست.',
    iconType: 'support',
  },
];

// ==========================================
// ICON COMPONENTS WITH HIGH-FIDELITY MOTION
// ==========================================

// Percent Icon with counter-rotation & sequential pulsing dots
const AnimatedPercentIcon: React.FC<{ isHovered: boolean; isReduced: boolean }> = ({ isHovered, isReduced }) => {
  const lineVariants = {
    idle: { rotate: 0 },
    hover: isReduced ? {} : { 
      rotate: [0, -10, 10, 0],
      transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } 
    }
  };

  const dot1Variants = {
    idle: { scale: 1 },
    hover: isReduced ? {} : { 
      scale: [1, 1.3, 0.9, 1.1, 1],
      transition: { duration: 0.6, ease: 'easeInOut', times: [0, 0.25, 0.5, 0.75, 1] } 
    }
  };

  const dot2Variants = {
    idle: { scale: 1 },
    hover: isReduced ? {} : { 
      scale: [1, 1.3, 0.9, 1.1, 1],
      transition: { duration: 0.6, ease: 'easeInOut', delay: 0.12, times: [0, 0.25, 0.5, 0.75, 1] } 
    }
  };

  return (
    <svg 
      viewBox="0 0 24 24" 
      width="24" 
      height="24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="1.5" 
      strokeLinecap="round" 
      strokeLinejoin="round"
      className="text-emerald-600 transition-colors duration-300"
    >
      <motion.line 
        x1="19" y1="5" x2="5" y2="19"
        style={{ transformOrigin: 'center' }}
        variants={lineVariants}
        animate={isHovered ? 'hover' : 'idle'}
      />
      <motion.circle 
        cx="7.5" cy="7.5" r="2.5"
        style={{ transformOrigin: '7.5px 7.5px' }}
        variants={dot1Variants}
        animate={isHovered ? 'hover' : 'idle'}
      />
      <motion.circle 
        cx="16.5" cy="16.5" r="2.5"
        style={{ transformOrigin: '16.5px 16.5px' }}
        variants={dot2Variants}
        animate={isHovered ? 'hover' : 'idle'}
      />
    </svg>
  );
};

// Clock Icon with forward hand rotation & gentle progress indicator
const AnimatedClockIcon: React.FC<{ isHovered: boolean; isReduced: boolean }> = ({ isHovered, isReduced }) => {
  const hourVariants = {
    idle: { rotate: 0 },
    hover: isReduced ? {} : { 
      rotate: 360,
      transition: { duration: 1.2, ease: [0.16, 1, 0.3, 1] } 
    }
  };

  const minuteVariants = {
    idle: { rotate: 0 },
    hover: isReduced ? {} : { 
      rotate: 720,
      transition: { duration: 1.2, ease: [0.16, 1, 0.3, 1] } 
    }
  };

  return (
    <div className="relative w-6 h-6 flex items-center justify-center">
      <svg 
        viewBox="0 0 24 24" 
        width="24" 
        height="24" 
        fill="none" 
        stroke="currentColor" 
        strokeWidth="1.5" 
        strokeLinecap="round" 
        strokeLinejoin="round"
        className="text-emerald-600 transition-colors duration-300"
      >
        <circle cx="12" cy="12" r="10" />
        <motion.line 
          x1="12" y1="12" x2="12" y2="8"
          style={{ transformOrigin: '12px 12px' }}
          variants={hourVariants}
          animate={isHovered ? 'hover' : 'idle'}
        />
        <motion.line 
          x1="12" y1="12" x2="15.5" y2="12"
          style={{ transformOrigin: '12px 12px' }}
          variants={minuteVariants}
          animate={isHovered ? 'hover' : 'idle'}
        />
        <circle cx="12" cy="12" r="1" fill="currentColor" />
      </svg>
      {/* Tiny outer radar-sweep circle */}
      {!isReduced && isHovered && (
        <motion.div 
          className="absolute inset-[-4px] rounded-full border border-emerald-500/25"
          initial={{ rotate: 0, opacity: 0.8 }}
          animate={{ rotate: 360, opacity: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        />
      )}
    </div>
  );
};

// Support/Heart Icon with realistic double heartbeat pulse
const AnimatedSupportIcon: React.FC<{ isHovered: boolean; isReduced: boolean }> = ({ isHovered, isReduced }) => {
  const heartVariants = {
    idle: { scale: 1 },
    hover: isReduced ? {} : { 
      scale: [1, 1.15, 0.96, 1.12, 1],
      transition: { 
        duration: 0.55, 
        ease: 'easeInOut', 
        times: [0, 0.22, 0.42, 0.7, 1] 
      } 
    }
  };

  return (
    <div className="relative w-6 h-6 flex items-center justify-center">
      <svg 
        viewBox="0 0 24 24" 
        width="23" 
        height="23" 
        fill="none" 
        stroke="currentColor" 
        strokeWidth="1.5" 
        strokeLinecap="round" 
        strokeLinejoin="round"
        className="text-emerald-600 transition-colors duration-300"
      >
        <motion.path 
          d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"
          style={{ transformOrigin: 'center' }}
          variants={heartVariants}
          animate={isHovered ? 'hover' : 'idle'}
        />
      </svg>
      
      {/* Halo radial wave */}
      {!isReduced && isHovered && (
        <motion.div 
          className="absolute inset-[-6px] rounded-full border border-emerald-500/30"
          initial={{ scale: 0.8, opacity: 0.6 }}
          animate={{ scale: 1.4, opacity: 0 }}
          transition={{ duration: 0.65, ease: 'easeOut' }}
        />
      )}
    </div>
  );
};

// ==========================================
// CARD COMPONENT
// ==========================================
const TrustCard: React.FC<{ item: TrustItem; index: number; isReduced: boolean }> = ({ item, index, isReduced }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const active = isHovered || isFocused;

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    const { left, top } = event.currentTarget.getBoundingClientRect();
    mouseX.set(event.clientX - left);
    mouseY.set(event.clientY - top);
  };

  // Stagger variants for entry reveal
  const cardEntryVariants = {
    hidden: { 
      opacity: 0, 
      y: isReduced ? 0 : 20,
      scale: isReduced ? 1 : 0.98,
      filter: isReduced ? 'none' : 'blur(4px)'
    },
    visible: { 
      opacity: 1, 
      y: 0,
      scale: 1,
      filter: 'none',
      transition: {
        duration: 0.6,
        ease: [0.16, 1, 0.3, 1],
        delay: index * 0.1
      }
    }
  };

  return (
    <motion.div
      variants={cardEntryVariants}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onFocus={() => setIsFocused(true)}
      onBlur={() => setIsFocused(false)}
      onMouseMove={handleMouseMove}
      onTouchStart={() => setIsHovered(true)}
      onTouchEnd={() => setIsHovered(false)}
      tabIndex={0}
      className="outline-hidden group relative text-right cursor-pointer select-none rounded-[1.5rem] p-[1px] bg-slate-200/50 overflow-hidden"
      whileTap={isReduced ? {} : { scale: 0.995 }}
    >
      {/* Spotlight Border Glow */}
      {!isReduced && (
        <motion.div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none rounded-[1.5rem]"
          style={{
            background: useMotionTemplate`radial-gradient(130px circle at ${mouseX}px ${mouseY}px, rgba(16, 185, 129, 0.45), transparent 80%)`
          }}
        />
      )}

      {/* Inner card content container */}
      <div className={`
        relative overflow-hidden bg-white rounded-[calc(1.5rem-1px)] p-6 md:p-7 flex flex-col items-start md:flex-row gap-5 h-full transition-all duration-300
        ${active ? 'shadow-xs' : ''}
      `}>
        {/* Spotlight Background Glow */}
        {!isReduced && (
          <motion.div
            className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none rounded-[calc(1.5rem-1px)]"
            style={{
              background: useMotionTemplate`radial-gradient(130px circle at ${mouseX}px ${mouseY}px, rgba(16, 185, 129, 0.04), transparent 80%)`
            }}
          />
        )}

        {/* Highlight top line bar */}
        <div className="absolute top-0 right-0 left-0 h-[2px] overflow-hidden pointer-events-none">
          <motion.div 
            className="h-full bg-emerald-500"
            initial={{ width: '0%' }}
            animate={{ width: active ? '100%' : '0%' }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
          />
        </div>

        {/* Refined Icon Container */}
        <div className={`
          relative w-12 h-12 rounded-xl flex items-center justify-center shrink-0 transition-all duration-300 border z-10
          ${active 
            ? 'bg-emerald-50/80 border-emerald-500/30 shadow-xs shadow-emerald-500/5 scale-102' 
            : 'bg-emerald-500/5 border-emerald-500/10'
          }
        `}>
          {item.iconType === 'percent' && <AnimatedPercentIcon isHovered={active} isReduced={isReduced} />}
          {item.iconType === 'clock' && <AnimatedClockIcon isHovered={active} isReduced={isReduced} />}
          {item.iconType === 'support' && <AnimatedSupportIcon isHovered={active} isReduced={isReduced} />}

          {/* Ripple on active icon */}
          {!isReduced && active && (
            <motion.div 
              className="absolute inset-0 rounded-xl bg-emerald-500/10 pointer-events-none"
              initial={{ scale: 0.8, opacity: 0.5 }}
              animate={{ scale: 1.2, opacity: 0 }}
              transition={{ duration: 0.5 }}
            />
          )}
        </div>

        {/* Text Content Block */}
        <div className="flex-1 space-y-2 mt-1 z-10">
          <h4 className={`
            text-[14px] font-black text-slate-800 transition-colors duration-300 leading-tight
            ${active ? 'text-emerald-700 translate-y-[-0.5px]' : ''}
          `}>
            {item.title}
          </h4>
          <p className={`
            text-xs leading-relaxed transition-colors duration-300
            ${active ? 'text-slate-700' : 'text-[#71717A]'}
          `}>
            {item.description}
          </p>
        </div>
      </div>
    </motion.div>
  );
};

// ==========================================
// MAIN COMPONENT EXPORT
// ==========================================
export const TrustStripSection: React.FC = () => {
  const isReduced = useReducedMotion() ?? false;

  return (
    <section className="bg-slate-50/50 py-16 border-b border-slate-200/50 relative z-20 overflow-hidden">
      {/* Decorative clean grid pattern background */}
      <div className="absolute inset-0 bg-linear-to-b from-transparent to-white/70 opacity-30 pointer-events-none" />
      <div 
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(#10b981 1.5px, transparent 1.5px)`,
          backgroundSize: '24px 24px',
        }}
      />

      <div className="max-w-7xl mx-auto px-6 relative">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8"
        >
          {TRUST_ITEMS.map((item, index) => (
            <TrustCard 
              key={item.id} 
              item={item} 
              index={index} 
              isReduced={isReduced} 
            />
          ))}
        </motion.div>
      </div>
    </section>
  );
};
