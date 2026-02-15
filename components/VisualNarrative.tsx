
import React, { useState, useRef, useMemo, useEffect } from 'react';
import { motion, useMotionValue, useTransform, useAnimationFrame, AnimatePresence } from 'framer-motion';
import { 
  ConciergeBell, 
  Palette, 
  ClipboardList, 
  BarChart3, 
  Package, 
  Smartphone,
  ShieldCheck,
  Server,
  Terminal,
  Shield,
  Globe,
  Radio
} from 'lucide-react';

const ITEMS = [
  { 
    id: 'designer', 
    icon: <Palette className="w-5 h-5" />, 
    title: 'طراحی بصری', 
    subtitle: 'Visual Menu Designer',
    desc: 'ویرایشگر حرفه‌ای برای طراحی منوهای چاپی و دیجیتال با استانداردهای روز.',
    stat: '۱۰۰+ قالب حرفه‌ای',
    color: '#fbbf24', 
    gradient: 'from-amber-400 to-yellow-600'
  },
  { 
    id: 'orders', 
    icon: <ClipboardList className="w-5 h-5" />, 
    title: 'مدیریت سفارش', 
    subtitle: 'Live Order System',
    desc: 'رهگیری لحظه‌ای سفارشات از لحظه ثبت تا تحویل درب میز مشتری.',
    stat: 'پردازش آنی',
    color: '#10b981', 
    gradient: 'from-emerald-400 to-teal-600'
  },
  { 
    id: 'analytics', 
    icon: <BarChart3 className="w-5 h-5" />, 
    title: 'هوش تجاری', 
    subtitle: 'BI & Analytics',
    desc: 'تحلیل دقیق پرفروش‌ترین آیتم‌ها و رفتارهای خرید مشتریان شما.',
    stat: 'گزارش‌های ماهانه',
    color: '#3b82f6', 
    gradient: 'from-blue-400 to-indigo-600'
  },
  { 
    id: 'products', 
    icon: <Package className="w-5 h-5" />, 
    title: 'انبارداری هوشمند', 
    subtitle: 'Inventory Management',
    desc: 'کنترل خودکار موجودی مواد اولیه بر اساس هر سفارش ثبت شده.',
    stat: 'دقت ۹۹٪',
    color: '#f97316', 
    gradient: 'from-orange-400 to-red-600'
  },
  { 
    id: 'app', 
    icon: <Smartphone className="w-5 h-5" />, 
    title: 'منوی دیجیتال', 
    subtitle: 'PWA Mobile App',
    desc: 'ارائه منوی آنلاین بدون نیاز به نصب اپلیکیشن توسط مشتری.',
    stat: 'سازگار با تمام گوشی‌ها',
    color: '#8b5cf6', 
    gradient: 'from-violet-400 to-purple-600'
  },
  { 
    id: 'security', 
    icon: <ShieldCheck className="w-5 h-5" />, 
    title: 'پشتیبان‌گیری کلاود', 
    subtitle: 'Cloud Backup',
    desc: 'امنیت کامل داده‌های رستوران و دسترسی از هر جای دنیا.',
    stat: 'رمزنگاری AES-256',
    color: '#06b6d4', 
    gradient: 'from-cyan-400 to-sky-600'
  }
];

const DigitalPass = () => (
  <div className="absolute inset-0 pointer-events-none z-0" style={{ perspective: '1500px' }}>
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="absolute bottom-[-10%] left-1/2 -translate-x-1/2 w-[160%] h-[60%] origin-bottom"
      style={{ rotateX: '75deg' }}
    >
      <div className="absolute inset-0 bg-[#06080b] border-t border-emerald-500/10 overflow-hidden shadow-[inset_0_20px_60px_rgba(0,0,0,0.8)]">
         <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'url("https://www.transparenttextures.com/patterns/asfalt-dark.png")' }} />
         <div className="absolute inset-x-0 top-0 bottom-0 flex justify-center gap-[400px]">
            {[...Array(2)].map((_, i) => (
                <div key={i} className="relative w-px h-full bg-gradient-to-t from-emerald-500/0 via-emerald-500/20 to-emerald-400/0">
                    <motion.div 
                        animate={{ top: ['100%', '-20%'] }}
                        transition={{ duration: 8 + i * 2, repeat: Infinity, ease: 'linear' }}
                        className="absolute w-64 -left-32 h-64 bg-emerald-400/[0.03] blur-[120px]"
                    />
                </div>
            ))}
         </div>
      </div>
      <div className="absolute inset-0 bg-gradient-to-t from-transparent via-[#06080D]/90 to-[#06080D]" />
    </motion.div>
  </div>
);

const OrbitItem = ({ item, index, total, rotation, onHover, hoveredId, isActive = false }: any) => {
  const isHovered = hoveredId === item.id;
  
  // Placement State
  const [placement, setPlacement] = useState<{ v: 'top' | 'bottom', h: 'left' | 'right' }>({ v: 'bottom', h: 'right' });
  
  const baseAngle = (360 / total) * index;
  const currentAngle = useTransform(rotation, (r: number) => baseAngle + r);
  
  const radiusX = 280;
  const radiusY = 110;

  const x = useTransform(currentAngle, (a) => radiusX * Math.cos((a * Math.PI) / 180));
  const y = useTransform(currentAngle, (a) => radiusY * Math.sin((a * Math.PI) / 180));
  
  // Z-Index: Active item gets max z-index
  const zIndexBase = useTransform(y, (currentY) => (currentY > 0 ? 40 : 10));
  const zIndex = isActive ? 999 : zIndexBase;

  // Scale & Blur (only applies if NOT active - active state handled by wrapper logic in parent)
  const scale = useTransform(y, [-radiusY, radiusY], [0.8, 1.1]);
  const blurValue = useTransform(y, [-radiusY, 0], [5, 0]);
  const orbitalFilter = useTransform(blurValue, (b) => `blur(${b}px)`);
  const orbitalOpacity = useTransform(y, [-radiusY, -radiusY/2, 0], [0.4, 0.7, 1]);

  const handleMouseEnter = () => {
    const currentX = x.get();
    const currentY = y.get();
    const v = currentY > 0 ? 'top' : 'bottom';
    const h = currentX > 0 ? 'left' : 'right';
    setPlacement({ v, h });
    onHover(item.id);
  };

  const getOriginPosition = () => {
    const xPos = placement.h === 'left' ? '100%' : '0%';
    const yPos = placement.v === 'top' ? '100%' : '0%';
    return `${xPos} ${yPos}`;
  };

  // Wrapper Animation
  const wrapperVariants = {
    hidden: { opacity: 0, filter: 'drop-shadow(0 0 0px rgba(0,0,0,0))' },
    visible: { 
      opacity: 1, 
      filter: `drop-shadow(0 0 30px ${item.color}30)`,
      transition: { duration: 0.3 }
    },
    exit: { opacity: 0, transition: { duration: 0.2 } }
  };

  // Inner Card Animation
  const cardBodyVariants = {
    hidden: { 
      clipPath: `circle(0% at ${getOriginPosition()})`,
    },
    visible: { 
      clipPath: `circle(150% at ${getOriginPosition()})`,
      transition: { type: "spring" as const, stiffness: 120, damping: 20, mass: 0.5 }
    },
    exit: { 
      clipPath: `circle(0% at ${getOriginPosition()})`,
      transition: { duration: 0.2, ease: "anticipate" as const }
    }
  };

  const contentVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: (i: number) => ({ 
      opacity: 1, 
      y: 0, 
      transition: { delay: i * 0.08 + 0.1, duration: 0.4, ease: "easeOut" as const } 
    })
  };

  const tetherVariants = {
    hidden: { opacity: 0, pathLength: 0 },
    visible: { opacity: 1, pathLength: 1, transition: { duration: 0.3, ease: "easeOut" as const } }
  };

  return (
    <motion.div
      style={{ 
        x, 
        y, 
        left: '50%', 
        top: '50%', 
        zIndex, 
        scale: isActive ? 1.2 : scale, 
        opacity: isActive ? 1 : orbitalOpacity, 
        filter: isActive ? 'none' : orbitalFilter,
        marginLeft: '-32px',
        marginTop: '-32px'
      }}
      className="absolute flex items-center justify-center pointer-events-auto"
    >
      <div 
        className="relative group cursor-pointer flex flex-col items-center"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={() => onHover(null)}
      >
        {/* Active Glowing Ring */}
        {isActive && (
           <motion.div
             initial={{ opacity: 0, scale: 0.8 }}
             animate={{ opacity: [0.3, 0.6, 0.3], scale: [1.1, 1.3, 1.1] }}
             transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
             className="absolute -inset-4 rounded-full border border-dashed z-0"
             style={{ borderColor: item.color }}
           />
        )}

        {/* Icon Circle */}
        <motion.div
          animate={{ 
            boxShadow: isHovered ? `0 0 50px ${item.color}66` : `0 0 10px rgba(0,0,0,0.5)`,
            borderColor: isHovered ? item.color : 'rgba(255,255,255,0.05)',
            rotate: isHovered ? 10 : 0
          }}
          className="w-14 h-14 md:w-16 md:h-16 rounded-2xl md:rounded-[1.75rem] bg-slate-900/95 border backdrop-blur-3xl flex items-center justify-center text-white transition-all duration-500 ease-out overflow-hidden z-20 relative"
        >
          <div style={{ color: isHovered ? 'white' : item.color, transition: 'color 0.4s' }}>
            {item.icon}
          </div>
          {isHovered && (
             <motion.div 
               layoutId="hover-glow"
               className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent pointer-events-none"
             />
          )}
        </motion.div>

        {/* Small Tooltip (Only when not active/hovered) */}
        <AnimatePresence>
          {!hoveredId && !isActive && (
              <motion.div 
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="absolute top-full pt-6 w-32 flex justify-center pointer-events-none"
              >
                  <span className="text-[9px] font-black text-white/20 whitespace-nowrap tracking-[0.2em] uppercase transition-colors group-hover:text-white/30 bg-black/20 px-2 py-0.5 rounded-full backdrop-blur-sm border border-white/5">
                      {item.title}
                  </span>
              </motion.div>
          )}
        </AnimatePresence>

        {/* --- FINAL BOSS CARD --- */}
        <AnimatePresence>
          {isActive && (
            <motion.div
              variants={wrapperVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className={`absolute w-[340px] z-[999] flex flex-col ${
                placement.v === 'top' ? 'bottom-full mb-6' : 'top-full mt-6'
              } ${
                placement.h === 'left' ? 'right-0 items-end' : 'left-0 items-start'
              }`}
            >
              {/* Tether */}
              <svg 
                className={`absolute w-6 h-6 z-30 ${placement.v === 'top' ? '-bottom-5' : '-top-5'} ${placement.h === 'left' ? 'right-4' : 'left-4'}`}
                viewBox="0 0 24 24"
                style={{ 
                  color: item.color,
                  transform: placement.v === 'top' ? 'scaleY(-1)' : 'none'
                }}
              >
                <motion.path 
                  d={placement.h === 'left' ? "M24,24 L24,12 Q24,0 12,0 L0,0" : "M0,24 L0,12 Q0,0 12,0 L24,0"} 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="2"
                  variants={tetherVariants}
                />
                <motion.circle 
                  cx={placement.h === 'left' ? 24 : 0} 
                  cy="24" 
                  r="2" 
                  fill="currentColor" 
                  initial={{ opacity: 0 }} 
                  animate={{ opacity: 1 }} 
                  transition={{ delay: 0.2 }}
                />
              </svg>

              {/* Main Card */}
              <motion.div
                variants={cardBodyVariants}
                className="relative w-full overflow-hidden rounded-[1.5rem] bg-[#06080D]/90 backdrop-blur-2xl"
              >
                {/* Noise */}
                <div 
                  className="absolute inset-0 opacity-[0.15] pointer-events-none z-0 mix-blend-overlay" 
                  style={{ 
                    backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` 
                  }} 
                />

                {/* Gradient Border */}
                <div className="absolute inset-0 p-[1px] rounded-[1.5rem] pointer-events-none z-20">
                   <div className="absolute inset-0 rounded-[1.5rem]" style={{ 
                      background: `linear-gradient(120deg, ${item.color}80, transparent 40%, ${item.color}40)`, 
                      maskImage: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)', 
                      maskComposite: 'exclude', 
                      WebkitMaskComposite: 'xor' 
                   }} />
                </div>

                {/* Shimmer */}
                <motion.div 
                  animate={{ x: ['-100%', '200%'] }}
                  transition={{ repeat: Infinity, duration: 3, ease: "linear", repeatDelay: 1 }}
                  className="absolute inset-0 z-10 bg-gradient-to-r from-transparent via-white/[0.07] to-transparent skew-x-12 pointer-events-none"
                />

                {/* Content */}
                <div className="relative z-30 p-6 flex flex-col items-start text-left">
                  <motion.div custom={1} variants={contentVariants} className="mb-3">
                    <span 
                      className="text-[9px] font-black px-2.5 py-1 rounded-md border tracking-wider uppercase"
                      style={{ 
                        color: item.color, 
                        borderColor: `${item.color}40`, 
                        backgroundColor: `${item.color}10` 
                      }}
                    >
                      {item.stat}
                    </span>
                  </motion.div>

                  <motion.div custom={2} variants={contentVariants} className="w-full">
                    <h3 className="text-white font-black text-xl mb-0.5 tracking-tight drop-shadow-md">{item.title}</h3>
                    <h4 className="text-white/40 text-[10px] font-bold tracking-[0.25em] uppercase font-mono mb-4">{item.subtitle}</h4>
                    
                    <div className="w-full h-px mb-4 relative overflow-hidden bg-white/5">
                       <motion.div 
                          initial={{ x: '-100%' }}
                          animate={{ x: 0 }}
                          transition={{ duration: 0.5, delay: 0.3 }}
                          className="absolute inset-0 w-full h-full"
                          style={{ background: `linear-gradient(90deg, ${item.color}, transparent)` }}
                       />
                    </div>

                    <p className="text-slate-300 text-xs font-light leading-relaxed pl-1">{item.desc}</p>
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

const RestaurantCore = () => (
  <div className="relative z-10 flex items-center justify-center">
    <div className="absolute inset-0 bg-emerald-500/20 blur-[100px] rounded-full" />
    <motion.div 
      animate={{ rotate: 360 }}
      transition={{ duration: 100, repeat: Infinity, ease: "linear" }}
      className="absolute w-[600px] h-[600px] border border-white/5 rounded-full border-dashed opacity-20"
    />
    <motion.div 
      animate={{ rotate: -360 }}
      transition={{ duration: 80, repeat: Infinity, ease: "linear" }}
      className="absolute w-[450px] h-[450px] border border-white/5 rounded-full opacity-30"
    />
    
    <div className="relative w-32 h-32 bg-[#06080D] rounded-full border border-white/10 flex items-center justify-center shadow-[0_0_60px_-10px_rgba(16,185,129,0.3)] z-20">
       <div className="absolute inset-0 rounded-full bg-gradient-to-br from-white/5 to-transparent" />
       <div className="w-20 h-20 bg-emerald-500/10 rounded-full flex items-center justify-center border border-emerald-500/20 backdrop-blur-md">
          <ConciergeBell className="w-8 h-8 text-emerald-500 drop-shadow-[0_0_10px_rgba(16,185,129,0.8)]" />
       </div>
    </div>
  </div>
);

const VisualNarrative: React.FC = () => {
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  
  // Animation logic for left side
  const rotation = useMotionValue(0);
  const speedRef = useRef(0.04);
  const targetSpeedRef = useRef(0.04);

  useEffect(() => {
    // Zero-G Mode: Absolute stop when hovered
    if (hoveredId) {
      targetSpeedRef.current = 0;
    } else {
      targetSpeedRef.current = 0.04;
    }
  }, [hoveredId]);

  useAnimationFrame((_, delta) => {
    speedRef.current += (targetSpeedRef.current - speedRef.current) * 0.08;
    rotation.set(rotation.get() + (delta * speedRef.current) / 10);
  });

  return (
    <div className="hidden lg:flex w-1/2 relative bg-[#06080D] overflow-hidden items-center justify-center">
      <div className="absolute inset-0 bg-[#06080D]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(16,185,129,0.02)_0%,transparent_85%)]" />
      
      <DigitalPass />

      {/* INTELLIGENCE HUD LAYERS */}
      <div className="absolute inset-0 pointer-events-none z-50 p-12 flex flex-col justify-between">
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-4 bg-white/[0.03] backdrop-blur-3xl px-6 py-3 rounded-full border border-white/10 shadow-2xl pointer-events-auto mt-4 mr-4">
              <div className="relative flex">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full animate-ping absolute" />
                  <div className="w-2 h-2 bg-emerald-500 rounded-full relative" />
              </div>
              <span className="text-[10px] font-black text-white/40 tracking-[0.4em] uppercase">SYSTEM_READY</span>
          </div>
        </div>
        <div className="flex justify-center w-full pb-10 pointer-events-auto">
          <div className="flex items-stretch gap-1 bg-white/[0.02] backdrop-blur-[60px] rounded-[2rem] border border-white/5 shadow-3xl overflow-hidden p-1.5">
            <div className="flex items-center gap-4 bg-white/[0.03] px-8 py-5 rounded-[1.75rem] border border-white/5 mr-4">
              <div className="w-10 h-10 bg-emerald-500/10 rounded-2xl flex items-center justify-center border border-emerald-500/10">
                  <Server className="w-5 h-5 text-emerald-500/70" />
              </div>
              <div className="flex flex-col">
                  <span className="text-[9px] font-black text-white/30 uppercase tracking-[0.2em]">Live Node</span>
                  <span className="text-[11px] font-bold text-emerald-400 uppercase tracking-widest">Platform v4.2</span>
              </div>
            </div>
            <div className="flex items-center gap-10 px-6">
              <div className="flex flex-col gap-1.5">
                  <div className="flex items-center gap-2">
                      <Terminal className="w-3.5 h-3.5 text-white/20" />
                      <span className="text-[9px] font-mono text-white/40 tracking-wider">SECURE_TUNNEL</span>
                  </div>
                  <div className="flex items-center gap-2">
                      <Shield className="w-3.5 h-3.5 text-white/20" />
                      <span className="text-[9px] font-mono text-white/40 tracking-wider">AES_256_ACTIVE</span>
                  </div>
              </div>
              <div className="h-10 w-px bg-white/5" />
              <div className="flex flex-col gap-1.5">
                  <div className="flex items-center gap-2">
                      <Globe className="w-3.5 h-3.5 text-white/20" />
                      <span className="text-[9px] font-mono text-white/40 tracking-wider">GEO_LATENCY: 14ms</span>
                  </div>
                  <div className="flex items-center gap-2">
                      <Radio className="w-3.5 h-3.5 text-white/20" />
                      <span className="text-[9px] font-mono text-white/40 tracking-wider">UPTIME: 100%</span>
                  </div>
              </div>
            </div>
            <div className="flex items-center gap-2 px-8 bg-black/20 rounded-[1.75rem] border border-white/5 ml-auto">
                {[...Array(5)].map((_, i) => (
                    <motion.div 
                      key={i}
                      animate={{ height: [6, 18, 8, 24, 6] }}
                      transition={{ duration: 1.2 + i * 0.2, repeat: Infinity, ease: "easeInOut" }}
                      className="w-1.5 bg-emerald-500/30 rounded-full shadow-[0_0_8px_rgba(16,185,129,0.2)]"
                    />
                ))}
            </div>
          </div>
        </div>
      </div>

      {/* ORBITAL CORE SYSTEM */}
      <div className="relative flex items-center justify-center">
        
        {/* Background Layer: Blurred & Scaled */}
        <motion.div
           animate={{ 
             filter: hoveredId ? 'blur(12px) brightness(0.5)' : 'blur(0px) brightness(1)', 
             scale: hoveredId ? 0.95 : 1 
           }}
           transition={{ duration: 0.5, ease: "circOut" }}
           className="relative flex items-center justify-center z-10"
        >
            <RestaurantCore />
            {ITEMS.map((item, idx) => (
               item.id !== hoveredId && (
                  <OrbitItem 
                    key={item.id}
                    item={item}
                    index={idx}
                    total={ITEMS.length}
                    rotation={rotation}
                    onHover={setHoveredId}
                    hoveredId={hoveredId}
                    isActive={false}
                  />
               )
            ))}
        </motion.div>

        {/* Foreground Layer: Active Item Only (Sharp & Highlighted) */}
        {hoveredId && (
            <div className="absolute inset-0 flex items-center justify-center z-50 pointer-events-none">
                {ITEMS.filter(i => i.id === hoveredId).map((item) => {
                   // Ensure we pass the original index so calculation is correct relative to the background items
                   const originalIndex = ITEMS.findIndex(x => x.id === item.id);
                   return (
                       <OrbitItem 
                          key={item.id}
                          item={item}
                          index={originalIndex}
                          total={ITEMS.length}
                          rotation={rotation}
                          onHover={setHoveredId}
                          hoveredId={hoveredId}
                          isActive={true}
                       />
                   )
                })}
            </div>
        )}

      </div>
    </div>
  );
};

export default VisualNarrative;
