
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

const OrbitItem = ({ item, index, total, rotation, onHover, hoveredId }: any) => {
  const isHovered = hoveredId === item.id;
  
  const baseAngle = (360 / total) * index;
  const currentAngle = useTransform(rotation, (r: number) => baseAngle + r);
  
  const radiusX = 280;
  const radiusY = 110;

  const x = useTransform(currentAngle, (a) => radiusX * Math.cos((a * Math.PI) / 180));
  const y = useTransform(currentAngle, (a) => radiusY * Math.sin((a * Math.PI) / 180));
  
  const zIndexBase = useTransform(y, (currentY) => (currentY > 0 ? 40 : 10));
  const scale = useTransform(y, [-radiusY, radiusY], [0.8, 1.1]);
  const blurValue = useTransform(y, [-radiusY, 0], [5, 0]);
  const opacityValue = useTransform(y, [-radiusY, -radiusY/2, 0], [0.4, 0.7, 1]);
  const filterString = useTransform(blurValue, (b) => `blur(${isHovered ? 0 : b}px)`);

  return (
    <motion.div
      style={{ 
        x, 
        y, 
        left: '50%', 
        top: '50%', 
        zIndex: isHovered ? 100 : zIndexBase, 
        scale: isHovered ? 1.2 : scale, 
        opacity: isHovered ? 1 : opacityValue, 
        filter: filterString,
        marginLeft: '-32px',
        marginTop: '-32px'
      }}
      className="absolute flex items-center justify-center pointer-events-auto"
    >
      <div 
        className="relative group cursor-pointer flex flex-col items-center"
        onMouseEnter={() => onHover(item.id)}
        onMouseLeave={() => onHover(null)}
      >
        <motion.div
          animate={{ 
            boxShadow: isHovered ? `0 0 50px ${item.color}66` : `0 0 10px rgba(0,0,0,0.5)`,
            borderColor: isHovered ? item.color : 'rgba(255,255,255,0.05)',
            rotate: isHovered ? 10 : 0
          }}
          className="w-14 h-14 md:w-16 md:h-16 rounded-2xl md:rounded-[1.75rem] bg-slate-900/95 border backdrop-blur-3xl flex items-center justify-center text-white transition-all duration-500 ease-out overflow-hidden z-10"
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

        <AnimatePresence>
          {!hoveredId && (
              <motion.div 
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="absolute top-full pt-6 w-32 flex justify-center"
              >
                  <span className="text-[9px] font-black text-white/20 whitespace-nowrap tracking-[0.2em] uppercase transition-colors group-hover:text-white/30 bg-black/20 px-2 py-0.5 rounded-full backdrop-blur-sm border border-white/5">
                      {item.title}
                  </span>
              </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

const RestaurantCore = () => (
  <div className="relative z-30 w-44 h-44 flex items-center justify-center pointer-events-none">
    <div className="absolute w-80 h-80 bg-emerald-500/[0.03] rounded-full blur-[120px] animate-pulse" />
    
    <motion.div 
      animate={{ rotate: 360 }}
      transition={{ duration: 60, repeat: Infinity, ease: 'linear' }}
      className="absolute inset-[-60px] border border-white/5 rounded-full border-dashed opacity-20"
    />

    <div className="w-28 h-28 bg-[#0a0d14] rounded-full border border-white/10 shadow-[0_0_60px_rgba(16,185,129,0.15),inset_0_0_30px_rgba(16,185,129,0.1)] flex items-center justify-center relative overflow-hidden group">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(16,185,129,0.1),transparent_70%)]" />
      
      <div className="relative z-10 w-14 h-14 bg-emerald-600 rounded-[1.25rem] flex items-center justify-center shadow-2xl shadow-emerald-500/20">
        <ConciergeBell className="w-8 h-8 text-white" />
      </div>

      <motion.div 
        animate={{ top: ['-20%', '120%'] }}
        transition={{ duration: 6, repeat: Infinity, ease: 'linear' }}
        className="absolute left-0 right-0 h-px bg-emerald-400/20 blur-[1px]"
      />
      
      <motion.div 
        animate={{ rotate: -360 }}
        transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
        className="absolute inset-1 border border-emerald-500/5 rounded-full border-t-emerald-500/20 border-r-transparent border-b-transparent border-l-transparent"
      />
    </div>
  </div>
);

const VisualNarrative: React.FC = () => {
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  
  // Animation logic for left side
  const rotation = useMotionValue(0);
  const speedRef = useRef(0.04);
  const targetSpeedRef = useRef(0.04);
  const activeItem = useMemo(() => ITEMS.find(i => i.id === hoveredId), [hoveredId]);

  useEffect(() => {
    if (hoveredId) {
      targetSpeedRef.current = 0.003;
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
        
        {/* Top Section */}
        <div className="flex justify-between items-start">
           {/* System Status Pill */}
          <div className="flex items-center gap-4 bg-white/[0.03] backdrop-blur-3xl px-6 py-3 rounded-full border border-white/10 shadow-2xl pointer-events-auto mt-4 mr-4">
              <div className="relative flex">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full animate-ping absolute" />
                  <div className="w-2 h-2 bg-emerald-500 rounded-full relative" />
              </div>
              <span className="text-[10px] font-black text-white/40 tracking-[0.4em] uppercase">SYSTEM_READY</span>
          </div>

          {/* EXPANDING INTELLIGENCE PANEL */}
          <AnimatePresence mode="wait">
            {activeItem && (
              <motion.div
                key={activeItem.id}
                initial={{ opacity: 0, x: -30, filter: 'blur(15px)' }}
                animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
                exit={{ opacity: 0, x: -30, filter: 'blur(15px)', transition: { duration: 0.15 } }}
                className="w-[420px] bg-slate-900/90 backdrop-blur-[40px] border border-white/10 rounded-[2.5rem] p-8 shadow-3xl text-right pointer-events-auto overflow-hidden mt-4 ml-4 relative"
              >
                {/* Glowing Edge Accent with Double Layer for Extra Shine */}
                <div 
                  className={`absolute top-0 left-0 w-1.5 h-full bg-gradient-to-b ${activeItem.gradient}`} 
                  style={{ 
                      boxShadow: `0 0 40px ${activeItem.color}`, 
                      opacity: 1 
                  }}
                />
                <div 
                  className="absolute top-0 left-0 w-1 h-full blur-[4px] opacity-100" 
                  style={{ backgroundColor: activeItem.color }} 
                />
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between whitespace-nowrap">
                    <span className="text-[10px] font-bold text-emerald-400 bg-emerald-400/10 px-3 py-1 rounded-full border border-emerald-500/20">{activeItem.stat}</span>
                    <h3 className="text-white font-black text-xl tracking-tight mr-4 truncate">{activeItem.title}</h3>
                  </div>
                  <h4 className="text-white/20 text-[10px] font-bold uppercase tracking-[0.3em] whitespace-nowrap">{activeItem.subtitle}</h4>
                  <div className="h-px bg-white/5 w-full" />
                  <p className="text-slate-300 text-[12px] leading-relaxed font-light">{activeItem.desc}</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* BOTTOM COMMAND BAR - CENTERED & ALIGNED */}
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
        <RestaurantCore />
        
        {ITEMS.map((item, idx) => (
          <OrbitItem 
            key={item.id}
            item={item}
            index={idx}
            total={ITEMS.length}
            rotation={rotation}
            onHover={setHoveredId}
            hoveredId={hoveredId}
          />
        ))}
      </div>
    </div>
  );
};

export default VisualNarrative;
