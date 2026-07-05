import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Search3DAnimationProps {
  brandColor: string;
}

// Map tailwind brand color names to elegant, premium cohesive color palettes
const PALETTES: Record<string, { primary: string; secondary: string; light: string; glow: string; subtle: string }> = {
  emerald: { primary: '#10b981', secondary: '#047857', light: '#ecfdf5', glow: 'rgba(16, 185, 129, 0.18)', subtle: 'rgba(16, 185, 129, 0.05)' },
  green: { primary: '#22c55e', secondary: '#15803d', light: '#f0fdf4', glow: 'rgba(34, 197, 94, 0.18)', subtle: 'rgba(34, 197, 94, 0.05)' },
  blue: { primary: '#3b82f6', secondary: '#1d4ed8', light: '#eff6ff', glow: 'rgba(59, 130, 246, 0.18)', subtle: 'rgba(59, 130, 246, 0.05)' },
  purple: { primary: '#a855f7', secondary: '#7e22ce', light: '#faf5ff', glow: 'rgba(168, 85, 247, 0.18)', subtle: 'rgba(168, 85, 247, 0.05)' },
  orange: { primary: '#f97316', secondary: '#c2410c', light: '#fff7ed', glow: 'rgba(249, 115, 22, 0.18)', subtle: 'rgba(249, 115, 22, 0.05)' },
  red: { primary: '#ef4444', secondary: '#b91c1c', light: '#fef2f2', glow: 'rgba(239, 68, 68, 0.18)', subtle: 'rgba(239, 68, 68, 0.05)' },
  violet: { primary: '#8b5cf6', secondary: '#6d28d9', light: '#f5f3ff', glow: 'rgba(139, 92, 246, 0.18)', subtle: 'rgba(139, 92, 246, 0.05)' },
  amber: { primary: '#f59e0b', secondary: '#b45309', light: '#fffbeb', glow: 'rgba(245, 158, 11, 0.18)', subtle: 'rgba(245, 158, 11, 0.05)' },
  pink: { primary: '#ec4899', secondary: '#be185d', light: '#fdf2f8', glow: 'rgba(236, 72, 153, 0.18)', subtle: 'rgba(236, 72, 153, 0.05)' },
  cyan: { primary: '#06b6d4', secondary: '#0369a1', light: '#ecfeff', glow: 'rgba(6, 182, 212, 0.18)', subtle: 'rgba(6, 182, 212, 0.05)' },
  rose: { primary: '#f43f5e', secondary: '#be123c', light: '#fff1f2', glow: 'rgba(244, 63, 94, 0.18)', subtle: 'rgba(244, 63, 94, 0.05)' },
  zinc: { primary: '#71717a', secondary: '#3f3f46', light: '#fafafa', glow: 'rgba(113, 113, 122, 0.18)', subtle: 'rgba(113, 113, 122, 0.05)' },
  slate: { primary: '#64748b', secondary: '#334155', light: '#f1f5f9', glow: 'rgba(100, 116, 139, 0.18)', subtle: 'rgba(100, 116, 139, 0.05)' },
};

// --- ELEGANT, ULTRA-MINIMALIST LINE-ART FOOD ICONS ---

const renderSearchIcon = (color: string) => (
  <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full">
    <circle cx="11" cy="11" r="8" />
    <path d="m21 21-4.3-4.3" />
  </svg>
);

const renderPizzaIcon = (color: string) => (
  <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full">
    <path d="M15 11h.01M11 15h.01M16 16h.01" strokeWidth="2" />
    <path d="M2 12C2 6.5 6.5 2 12 2c5.5 0 10 4.5 10 10c0 5.5-4.5 10-10 10" />
    <path d="m12 2-1.5 13.5c-.2 1.8 1 3.5 2.8 3.8s3.5-1 3.8-2.8L12 2Z" />
  </svg>
);

const renderBurgerIcon = (color: string) => (
  <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full">
    <path d="M2 18h20" />
    <path d="M17 14h.01M12 14h.01M7 14h.01" strokeWidth="2" />
    <path d="M3 14c0-3.9 3.1-7 7-7h4c3.9 0 7 3.1 7 7H3Z" />
    <rect width="18" height="3" x="3" y="18" rx="1.5" />
  </svg>
);

const renderDrinkIcon = (color: string) => (
  <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full">
    <path d="M18 22H6L4 4h16l-2 18Z" />
    <path d="M5 8h14" />
    <path d="m12 8 4-6" />
    <path d="M15 14h.01M9 16h.01" strokeWidth="2" />
  </svg>
);

const renderDessertIcon = (color: string) => (
  <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full">
    <path d="M12 2v4" />
    <path d="M12 6a4 4 0 0 0-4 4v4h8V10a4 4 0 0 0-4-4Z" />
    <path d="M6 14h12a2 2 0 0 1 2 2v4a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-4a2 2 0 0 1 2-2Z" />
  </svg>
);

const renderCoffeeIcon = (color: string) => (
  <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full">
    <path d="M17 8h1a4 4 0 1 1 0 8h-1" />
    <path d="M3 8h14v9a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4V8Z" />
    <path d="M6 2v2M10 2v2M14 2v2" />
  </svg>
);

const STEPS = [
  { id: 'search', render: renderSearchIcon, label: 'جستجو در منو' },
  { id: 'pizza', render: renderPizzaIcon, label: 'پیتزا و کالزونه' },
  { id: 'burger', render: renderBurgerIcon, label: 'برگر و ساندویچ' },
  { id: 'drink', render: renderDrinkIcon, label: 'نوشیدنی‌های خنک' },
  { id: 'dessert', render: renderDessertIcon, label: 'کیک و دسرها' },
  { id: 'coffee', render: renderCoffeeIcon, label: 'قهوه و بار گرم' },
];

export const Search3DAnimation: React.FC<Search3DAnimationProps> = ({ brandColor }) => {
  const [index, setIndex] = useState(0);
  const colors = PALETTES[brandColor] ?? PALETTES.emerald;

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % STEPS.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full py-8 flex flex-col items-center justify-center select-none">
      
      {/* Container holding the pulsing high-end design visual */}
      <div className="relative w-44 h-44 flex items-center justify-center">
        
        {/* Radar wave 1 (Pulsing outwards) */}
        <motion.div
          animate={{
            scale: [1, 1.4],
            opacity: [0.6, 0],
          }}
          transition={{
            duration: 3,
            ease: "easeOut",
            repeat: Infinity,
          }}
          className="absolute w-28 h-28 rounded-full border border-dashed pointer-events-none"
          style={{ borderColor: colors.primary, backgroundColor: colors.subtle }}
        />

        {/* Radar wave 2 (Delayed pulsing) */}
        <motion.div
          animate={{
            scale: [1, 1.4],
            opacity: [0.4, 0],
          }}
          transition={{
            duration: 3,
            ease: "easeOut",
            repeat: Infinity,
            delay: 1.5,
          }}
          className="absolute w-28 h-28 rounded-full border pointer-events-none"
          style={{ borderColor: colors.primary, opacity: 0.1 }}
        />

        {/* Beautiful morphing fluid background disc */}
        <motion.div
          animate={{
            borderRadius: [
              "42% 58% 70% 30% / 45% 45% 55% 55%",
              "70% 30% 52% 48% / 60% 40% 60% 40%",
              "42% 58% 70% 30% / 45% 45% 55% 55%"
            ]
          }}
          transition={{
            duration: 8,
            ease: "easeInOut",
            repeat: Infinity
          }}
          className="absolute w-32 h-32 blur-[2px] pointer-events-none transition-all duration-1000"
          style={{ 
            backgroundColor: colors.light,
            boxShadow: `0 8px 30px ${colors.glow}`
          }}
        />

        {/* Pure Minimalist Central Display Circle */}
        <motion.div 
          animate={{
            y: [-4, 4, -4],
          }}
          transition={{
            duration: 4,
            ease: "easeInOut",
            repeat: Infinity,
          }}
          className="w-24 h-24 rounded-full bg-white border border-slate-100 shadow-[0_12px_24px_rgba(0,0,0,0.04)] flex items-center justify-center relative overflow-hidden"
        >
          {/* Subtle gloss overlay to make it feel premium */}
          <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-white/60 pointer-events-none rounded-full" />

          {/* Smooth Fade Transition for the Minimalist Icon */}
          <AnimatePresence mode="wait">
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.8, rotate: -15 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              exit={{ opacity: 0, scale: 0.8, rotate: 15 }}
              transition={{ duration: 0.4, ease: "easeInOut" }}
              className="w-14 h-14 flex items-center justify-center"
            >
              {STEPS[index].render(colors.primary)}
            </motion.div>
          </AnimatePresence>
        </motion.div>
      </div>

      {/* Clean text indicating the loop transition state */}
      <div className="text-center mt-3 h-5 flex items-center justify-center">
        <AnimatePresence mode="wait">
          <motion.span
            key={index}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.25 }}
            className="text-xs font-black tracking-wide text-slate-500"
          >
            {STEPS[index].label}
          </motion.span>
        </AnimatePresence>
      </div>

      {/* Tiny clean line indicators */}
      <div className="flex gap-1 justify-center mt-3">
        {STEPS.map((step, idx) => (
          <div 
            key={step.id} 
            className="h-1 rounded-full transition-all duration-300"
            style={{
              width: idx === index ? '12px' : '4px',
              backgroundColor: idx === index ? colors.primary : '#e2e8f0'
            }}
          />
        ))}
      </div>
    </div>
  );
};
