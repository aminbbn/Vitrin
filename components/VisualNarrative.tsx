import React, { useState, useRef, useEffect } from 'react';
import { motion, useMotionValue, useTransform, useAnimationFrame, AnimatePresence } from 'framer-motion';
import { 
  ConciergeBell, Palette, ClipboardList, BarChart3, 
  Package, Smartphone, ShieldCheck, Shield, Globe, Radio
} from 'lucide-react';

const ITEMS = [
  { id: 'designer',  icon: <Palette className="w-5 h-5" />,      title: 'طراحی بصری',        subtitle: 'طراح هوشمند منو',    desc: 'ویرایشگر حرفه‌ای برای طراحی منوهای چاپی و دیجیتال با استانداردهای روز.', stat: '۱۰۰+ قالب حرفه‌ای',      color: '#fbbf24' },
  { id: 'orders',    icon: <ClipboardList className="w-5 h-5" />, title: 'مدیریت سفارش',      subtitle: 'سیستم ثبت سفارش آنی',       desc: 'رهگیری لحظه‌ای سفارشات از لحظه ثبت تا تحویل درب میز مشتری.',           stat: 'پردازش آنی',             color: '#10b981' },
  { id: 'analytics', icon: <BarChart3 className="w-5 h-5" />,    title: 'هوش تجاری',          subtitle: 'تحلیل هوشمند کسب‌وکار',          desc: 'تحلیل دقیق پرفروش‌ترین آیتم‌ها و رفتارهای خرید مشتریان شما.',          stat: 'گزارش‌های ماهانه',       color: '#3b82f6' },
  { id: 'products',  icon: <Package className="w-5 h-5" />,       title: 'انبارداری هوشمند',  subtitle: 'کنترل و مدیریت موجودی',    desc: 'کنترل خودکار موجودی مواد اولیه بر اساس هر سفارش ثبت شده.',            stat: 'دقت ۹۹٪',               color: '#f97316' },
  { id: 'app',       icon: <Smartphone className="w-5 h-5" />,    title: 'منوی دیجیتال',      subtitle: 'منوی وب‌اپلیکیشن مشتری',          desc: 'ارائه منوی آنلاین بدون نیاز به نصب اپلیکیشن توسط مشتری.',            stat: 'سازگار با تمام گوشی‌ها', color: '#8b5cf6' },
  { id: 'security',  icon: <ShieldCheck className="w-5 h-5" />,   title: 'پشتیبان‌گیری کلاود', subtitle: 'پشتیبان‌گیری امن ابری',           desc: 'امنیت کامل داده‌های رستوران و دسترسی از هر جای دنیا.',                stat: 'رمزنگاری AES-256',       color: '#06b6d4' },
];

// Resolve brandColor string → hex for inline styles
const COLOR_MAP: Record<string, string> = {
  emerald: '#10b981',
  green: '#22c55e',
  blue: '#3b82f6',
  purple: '#a855f7',
  orange: '#f97316',
  red: '#ef4444',
  violet: '#8b5cf6',
  amber: '#f59e0b',
  pink: '#ec4899',
  cyan: '#06b6d4',
  rose: '#f43f5e',
  zinc: '#71717a',
  slate: '#64748b',
};
const hex = (brandColor: string) => COLOR_MAP[brandColor] ?? '#10b981';

/* ─── Orbit Item ─────────────────────────────────────────── */
const OrbitItem = ({ item, index, total, rotation, onHover, hoveredId, isActive = false }: any) => {
  const isHovered = hoveredId === item.id;
  const [placement, setPlacement] = useState<{ v: 'top' | 'bottom'; h: 'left' | 'right' }>({ v: 'bottom', h: 'right' });

  const baseAngle = (360 / total) * index;
  const currentAngle = useTransform(rotation, (r: number) => baseAngle + r);
  const radiusX = 210;
  const radiusY = 82;
  const x = useTransform(currentAngle, (a) => radiusX * Math.cos((a * Math.PI) / 180));
  const y = useTransform(currentAngle, (a) => radiusY * Math.sin((a * Math.PI) / 180));

  const zIndexBase = useTransform(y, (cy) => (cy > 0 ? 40 : 10));
  const zIndex = isActive ? 999 : zIndexBase;

  // Depth cues — back items still clearly readable (min opacity 0.6)
  const scale   = useTransform(y, [-radiusY, radiusY], [0.84, 1.06]);
  const blur    = useTransform(y, [-radiusY, 0], [2.5, 0]);
  const filter  = useTransform(blur, (b) => `blur(${b}px)`);
  const opacity = useTransform(y, [-radiusY, 0], [0.60, 1]);

  const handleMouseEnter = () => {
    const v = y.get() > 0 ? 'top' : 'bottom';
    const h = x.get() > 0 ? 'left' : 'right';
    setPlacement({ v, h });
    onHover(item.id);
  };

  const originPos = () =>
    `${placement.h === 'left' ? '100%' : '0%'} ${placement.v === 'top' ? '100%' : '0%'}`;

  const cardVariants = {
    hidden: { clipPath: `circle(0% at ${originPos()})` },
    visible: { clipPath: `circle(150% at ${originPos()})`, transition: { type: 'spring' as const, stiffness: 130, damping: 22, mass: 0.5 } },
    exit:    { clipPath: `circle(0% at ${originPos()})`,   transition: { duration: 0.18, ease: 'anticipate' as const } },
  };

  const contentVariants = {
    hidden: { opacity: 0, y: 8 },
    visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.07 + 0.08, duration: 0.32 } }),
  };

  return (
    <motion.div
      style={{
        x, y, left: '50%', top: '50%', zIndex,
        scale:   isActive ? 1.1  : scale,
        opacity: isActive ? 1    : opacity,
        filter:  isActive ? 'none' : filter,
        marginLeft: '-28px', marginTop: '-28px',
      }}
      className="absolute flex items-center justify-center pointer-events-auto"
    >
      <div
        className="relative cursor-pointer flex flex-col items-center"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={() => onHover(null)}
      >
        {/* Pulsing ring on active */}
        {isActive && (
          <motion.div
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: [0.35, 0.65, 0.35], scale: [1.1, 1.28, 1.1] }}
            transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut', type: 'tween' }}
            className="absolute -inset-3 rounded-2xl border border-dashed"
            style={{ borderColor: item.color }}
          />
        )}

        {/* Icon tile — solid dark card with strong colored border + glow */}
        <motion.div
          animate={{
            boxShadow: isHovered
              ? `0 0 0 1.5px ${item.color}, 0 0 28px ${item.color}55, 0 8px 20px rgba(0,0,0,0.7)`
              : `0 0 0 1px rgba(255,255,255,0.14), 0 4px 14px rgba(0,0,0,0.55)`,
          }}
          transition={{ duration: 0.3 }}
          className="w-14 h-14 rounded-2xl flex items-center justify-center z-20 relative"
          style={{
            background: isHovered
              ? `linear-gradient(140deg, ${item.color}28 0%, #0f1117 100%)`
              : 'linear-gradient(140deg, rgba(255,255,255,0.10) 0%, rgba(255,255,255,0.03) 100%)',
            border: `1px solid ${isHovered ? item.color + '90' : 'rgba(255,255,255,0.15)'}`,
            backdropFilter: 'blur(16px)',
            transition: 'background 0.3s, border 0.3s',
          }}
        >
          {/* Colored icon — full opacity, always visible */}
          <span style={{ color: item.color, opacity: isHovered ? 1 : 0.9, display: 'flex' }}>
            {item.icon}
          </span>
          {/* Subtle inner highlight */}
          <div
            className="absolute inset-0 rounded-2xl pointer-events-none"
            style={{ background: 'linear-gradient(135deg, rgba(255,255,255,0.07) 0%, transparent 55%)' }}
          />
        </motion.div>

        {/* Label — visible and legible */}
        <AnimatePresence>
          {!hoveredId && !isActive && (
            <motion.div
              initial={{ opacity: 0, y: -2 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="absolute top-full pt-2.5 flex justify-center pointer-events-none"
              style={{ width: 96 }}
            >
              <span
                className="text-[10px] font-bold whitespace-nowrap text-center drop-shadow-md"
                style={{ color: 'rgba(255,255,255,0.9)', letterSpacing: '0.06em' }}
              >
                {item.title}
              </span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Hover card */}
        <AnimatePresence>
          {isActive && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, filter: `drop-shadow(0 0 24px ${item.color}28)` }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className={`absolute w-[290px] z-[999] flex flex-col ${
                placement.v === 'top' ? 'bottom-full mb-8' : 'top-full mt-8'
              } ${placement.h === 'left' ? 'right-0' : 'left-0'}`}
            >
              {/* Tether */}
              <div
                className={`absolute z-30 flex flex-col items-center ${
                  placement.v === 'top' ? '-bottom-7' : '-top-7'
                } ${placement.h === 'left' ? 'right-5' : 'left-5'}`}
                style={{ width: 2, height: 28 }}
              >
                <motion.div
                  initial={{ scaleY: 0, opacity: 0 }}
                  animate={{ scaleY: 1, opacity: 1 }}
                  exit={{ scaleY: 0, opacity: 0 }}
                  transition={{ duration: 0.18 }}
                  style={{
                    width: 2, height: '100%', borderRadius: 999,
                    background: `linear-gradient(to ${placement.v === 'top' ? 'top' : 'bottom'}, ${item.color}cc, transparent)`,
                    transformOrigin: placement.v === 'top' ? 'bottom' : 'top',
                  }}
                />
                <motion.div
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0 }}
                  transition={{ delay: 0.12 }}
                  style={{
                    position: 'absolute',
                    [placement.v === 'top' ? 'bottom' : 'top']: -3,
                    width: 6, height: 6, borderRadius: '50%',
                    backgroundColor: item.color,
                    boxShadow: `0 0 8px 2px ${item.color}88`,
                    left: '50%', transform: 'translateX(-50%)',
                  }}
                />
              </div>

              {/* Card */}
              <motion.div
                variants={cardVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="relative w-full overflow-hidden rounded-2xl"
                style={{
                  background: 'linear-gradient(150deg, #0e1118 0%, #080b10 100%)',
                  border: `1px solid ${item.color}40`,
                  boxShadow: `0 0 0 1px ${item.color}18, 0 24px 48px rgba(0,0,0,0.7)`,
                }}
              >
                {/* Top accent line */}
                <div className="absolute top-0 left-0 right-0 h-px" style={{ background: `linear-gradient(90deg, transparent, ${item.color}80, transparent)` }} />

                {/* Shimmer */}
                <motion.div
                  animate={{ x: ['-100%', '200%'] }}
                  transition={{ repeat: Infinity, duration: 3.5, ease: 'linear', repeatDelay: 1.5 }}
                  className="absolute inset-0 z-10 skew-x-12 pointer-events-none"
                  style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.04), transparent)' }}
                />

                <div className="relative z-20 p-5">
                  <motion.div custom={1} variants={contentVariants} className="mb-3">
                    <span
                      className="text-[8px] font-black px-2 py-1 rounded tracking-wider uppercase"
                      style={{ color: item.color, border: `1px solid ${item.color}35`, background: `${item.color}12` }}
                    >
                      {item.stat}
                    </span>
                  </motion.div>

                  <motion.div custom={2} variants={contentVariants} className="w-full">
                    <h3 className="text-white font-black text-lg mb-0.5 tracking-tight">{item.title}</h3>
                    <h4 className="text-white/40 text-[9px] font-bold tracking-[0.22em] uppercase font-mono mb-3">{item.subtitle}</h4>
                    <div className="w-full h-px mb-3 overflow-hidden" style={{ background: 'rgba(255,255,255,0.06)' }}>
                      <motion.div
                        initial={{ x: '-100%' }} animate={{ x: 0 }} transition={{ duration: 0.45, delay: 0.2 }}
                        className="h-full w-full"
                        style={{ background: `linear-gradient(90deg, ${item.color}, transparent)` }}
                      />
                    </div>
                    <p className="text-slate-400 text-[11px] font-light leading-relaxed">{item.desc}</p>
                  </motion.div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

/* ─── Center Core ─────────────────────────────────────────── */
const RestaurantCore = ({ brandColor }: { brandColor: string }) => {
  const c = hex(brandColor);
  return (
    <div className="relative z-10 flex items-center justify-center">
      {/* Background glow */}
      <div className="absolute rounded-full pointer-events-none"
        style={{ width: 200, height: 200, background: `radial-gradient(circle, ${c}28 0%, transparent 68%)`, filter: 'blur(16px)' }}
      />

      {/* Outer dashed ring */}
      <motion.div
        animate={{ rotate: 360 }} transition={{ duration: 80, repeat: Infinity, ease: 'linear' }}
        className="absolute rounded-full"
        style={{ width: 310, height: 310, border: `1px dashed ${c}30` }}
      />
      {/* Inner solid ring */}
      <motion.div
        animate={{ rotate: -360 }} transition={{ duration: 55, repeat: Infinity, ease: 'linear' }}
        className="absolute rounded-full"
        style={{ width: 215, height: 215, border: '1px solid rgba(255,255,255,0.10)' }}
      />

      {/* Center orb */}
      <div
        className="relative flex items-center justify-center rounded-full z-20"
        style={{
          width: 92, height: 92,
          background: 'linear-gradient(145deg, rgba(255,255,255,0.10) 0%, rgba(255,255,255,0.03) 100%)',
          border: '1px solid rgba(255,255,255,0.18)',
          boxShadow: `0 0 0 1px rgba(255,255,255,0.05), 0 12px 40px rgba(0,0,0,0.65), 0 0 50px ${c}28`,
        }}
      >
        <div className="absolute inset-0 rounded-full" style={{ background: 'linear-gradient(135deg, rgba(255,255,255,0.08) 0%, transparent 55%)' }} />
        <div
          className="w-14 h-14 rounded-full flex items-center justify-center"
          style={{ background: `radial-gradient(circle at 38% 32%, ${c}40, ${c}10)`, border: `1px solid ${c}45` }}
        >
          <ConciergeBell style={{ width: 24, height: 24, color: c }} />
        </div>
      </div>
    </div>
  );
};

/* ─── Status Bar ──────────────────────────────────────────── */
const StatusBar = ({ brandColor }: { brandColor: string }) => {
  const c = hex(brandColor);
  return (
    <div
      className="flex items-center gap-4 px-5 py-2.5 rounded-full flex-row-reverse"
      style={{
        background: 'linear-gradient(90deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.03) 100%)',
        border: '1px solid rgba(255,255,255,0.10)',
        backdropFilter: 'blur(20px)',
        boxShadow: '0 4px 20px rgba(0,0,0,0.4)',
      }}
    >
      {/* Waveform */}
      <div className="flex items-center justify-center gap-[3px] h-5 w-4">
        {[...Array(4)].map((_, i) => (
          <motion.div
            key={i}
            animate={{ height: [5, 14, 6, 18, 5] }}
            transition={{ duration: 1.0 + i * 0.18, repeat: Infinity, ease: 'easeInOut' }}
            style={{ width: 3, backgroundColor: c, opacity: 0.7, borderRadius: 2 }}
          />
        ))}
      </div>

      <div style={{ width: 1, height: 16, background: 'rgba(255,255,255,0.12)' }} />

      <div className="flex items-center gap-3.5 flex-row-reverse">
        <div className="flex items-center gap-1.5 flex-row-reverse">
          <Radio style={{ width: 11, height: 11, color: 'rgba(255,255,255,0.4)' }} />
          <span className="text-[10px] font-sans" style={{ color: 'rgba(255,255,255,0.55)' }}>پایداری ۱۰۰٪</span>
        </div>
        <div className="flex items-center gap-1.5 flex-row-reverse">
          <Shield style={{ width: 11, height: 11, color: 'rgba(255,255,255,0.4)' }} />
          <span className="text-[10px] font-sans" style={{ color: 'rgba(255,255,255,0.55)' }}>رمزنگاری AES-256</span>
        </div>
        <div className="flex items-center gap-1.5 flex-row-reverse">
          <Globe style={{ width: 11, height: 11, color: 'rgba(255,255,255,0.4)' }} />
          <span className="text-[10px] font-sans" style={{ color: 'rgba(255,255,255,0.55)' }}>پاسخ‌دهی ۱۴ms</span>
        </div>
      </div>

      <div style={{ width: 1, height: 16, background: 'rgba(255,255,255,0.12)' }} />

      <div className="flex items-center gap-2 flex-row-reverse">
        <span className="text-[10px] font-bold" style={{ color: c }}>پلتفرم نسخه ۴.۲</span>
        <div className="relative flex">
          <div className="absolute w-1.5 h-1.5 rounded-full animate-ping" style={{ backgroundColor: c, opacity: 0.7 }} />
          <div className="relative w-1.5 h-1.5 rounded-full" style={{ backgroundColor: c }} />
        </div>
      </div>
    </div>
  );
};

/* ─── Main ────────────────────────────────────────────────── */
const VisualNarrative: React.FC<{ brandColor?: string }> = ({ brandColor = 'emerald' }) => {
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const rotation = useMotionValue(0);
  const speedRef = useRef(0.04);
  const targetSpeedRef = useRef(0.04);

  useEffect(() => { targetSpeedRef.current = hoveredId ? 0 : 0.04; }, [hoveredId]);

  useAnimationFrame((_, delta) => {
    speedRef.current += (targetSpeedRef.current - speedRef.current) * 0.08;
    rotation.set(rotation.get() + (delta * speedRef.current) / 10);
  });

  const c = hex(brandColor);

  return (
    <div className="hidden lg:flex w-1/2 relative bg-[#0a0a0a] items-center justify-center z-10">
      {/* Richer background — visible radial glow in center */}
      <div className="absolute inset-0" style={{ background: `radial-gradient(ellipse 60% 55% at 50% 48%, ${c}12 0%, rgba(255,255,255,0.012) 40%, transparent 70%)` }} />

      {/* Top-left badge */}
      <div
        className="absolute top-6 left-6 z-50 flex items-center gap-2 px-4 py-2 rounded-full flex-row-reverse"
        style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.10)', backdropFilter: 'blur(20px)' }}
      >
        <div className="relative flex">
          <div className="absolute w-1.5 h-1.5 rounded-full animate-ping" style={{ backgroundColor: c, opacity: 0.7 }} />
          <div className="relative w-1.5 h-1.5 rounded-full" style={{ backgroundColor: c }} />
        </div>
        <span className="text-[10px] font-bold" style={{ color: 'rgba(255,255,255,0.45)' }}>سیستم آماده به کار</span>
      </div>

      {/* Bottom status bar */}
      <div className="absolute bottom-7 left-0 right-0 flex justify-center z-50">
        <StatusBar brandColor={brandColor} />
      </div>

      {/* Orbital system */}
      <div className="relative flex items-center justify-center">
        <motion.div
          animate={{
            filter: hoveredId ? 'blur(8px) brightness(0.38)' : 'blur(0px) brightness(1)',
            scale:  hoveredId ? 0.97 : 1,
          }}
          transition={{ duration: 0.4, ease: 'circOut' }}
          className="relative flex items-center justify-center z-10"
        >
          <RestaurantCore brandColor={brandColor} />
          {ITEMS.map((item, idx) =>
            item.id !== hoveredId && (
              <OrbitItem
                key={item.id} item={item} index={idx} total={ITEMS.length}
                rotation={rotation} onHover={setHoveredId} hoveredId={hoveredId} isActive={false}
              />
            )
          )}
        </motion.div>

        {hoveredId && (
          <div className="absolute inset-0 flex items-center justify-center z-50 pointer-events-none">
            {ITEMS.filter(i => i.id === hoveredId).map((item) => (
              <OrbitItem
                key={item.id} item={item}
                index={ITEMS.findIndex(x => x.id === item.id)}
                total={ITEMS.length}
                rotation={rotation} onHover={setHoveredId} hoveredId={hoveredId} isActive={true}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default VisualNarrative;