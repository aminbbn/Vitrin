
import React, { useState, useRef, useMemo, useEffect } from 'react';
import { motion, useMotionValue, useTransform, useAnimationFrame, AnimatePresence } from 'framer-motion';
import { 
  ConciergeBell, 
  Mail,
  Lock, 
  ArrowLeft, 
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
  Radio,
  Eye,
  EyeOff,
  User,
  Store
} from 'lucide-react';

interface LoginPageProps {
  onLogin: () => void;
}

// --- CONSTANTS FOR LEFT SIDE VISUALS (PRESERVED) ---
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

// --- HELPER COMPONENTS FOR LEFT SIDE (PRESERVED) ---

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

// --- NEW RIGHT SIDE COMPONENTS ---

const ModernInput = ({ label, type, value, onChange, placeholder, icon: Icon, showPasswordToggle, error }: any) => {
  const [showPassword, setShowPassword] = useState(false);
  const inputType = showPassword ? 'text' : type;

  return (
    <div className="space-y-1.5">
      <div className="flex justify-between items-end">
        <label className={`text-xs font-bold block ${error ? 'text-red-500' : 'text-slate-700'}`}>{label}</label>
        {error && (
          <motion.span 
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-[10px] font-bold text-red-500"
          >
            {error}
          </motion.span>
        )}
      </div>
      <div className="relative group">
        <div className={`absolute left-3.5 top-1/2 -translate-y-1/2 transition-colors ${error ? 'text-red-400' : 'text-slate-400 group-focus-within:text-emerald-600'}`}>
          <Icon className="w-5 h-5" />
        </div>
        <input 
          type={inputType}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className={`w-full bg-white text-slate-900 text-sm font-medium border rounded-xl py-3 pl-11 outline-none transition-all placeholder:text-slate-400/70 
            ${showPasswordToggle ? 'pr-11' : 'pr-4'}
            ${error ? 'border-red-200 focus:border-red-500 focus:ring-4 focus:ring-red-500/10' : 'border-slate-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10'}
          `}
          dir="ltr" 
          style={{ textAlign: 'left' }}
        />
        {showPasswordToggle && (
           <button 
             type="button"
             onClick={() => setShowPassword(!showPassword)}
             className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
           >
             {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
           </button>
        )}
      </div>
    </div>
  );
};

const WELCOME_MESSAGES = [
  "خوش آمدید! 👋",
  "امروز چه چیزی می‌سازیم؟ 🚀",
  "مدیریت حرفه‌ای رستوران 💎",
  "همراه شما در رشد 📈",
  "به ویترین خوش آمدید ✨"
];

const TypewriterText = () => {
  const [index, setIndex] = useState(0);
  const [subIndex, setSubIndex] = useState(0);
  const [reverse, setReverse] = useState(false);
  const [blink, setBlink] = useState(true);

  useEffect(() => {
    const timeout2 = setTimeout(() => {
      setBlink((prev) => !prev);
    }, 500);
    return () => clearTimeout(timeout2);
  }, [blink]);

  useEffect(() => {
    if (subIndex === WELCOME_MESSAGES[index].length + 1 && !reverse) {
      setTimeout(() => setReverse(true), 2000);
      return;
    }

    if (subIndex === 0 && reverse) {
      setReverse(false);
      setIndex((prev) => (prev + 1) % WELCOME_MESSAGES.length);
      return;
    }

    const timeout = setTimeout(() => {
      setSubIndex((prev) => prev + (reverse ? -1 : 1));
    }, reverse ? 30 : 80);

    return () => clearTimeout(timeout);
  }, [subIndex, index, reverse]);

  return (
    <span className="inline-block min-h-[40px] text-2xl font-black text-slate-900">
      {WELCOME_MESSAGES[index].substring(0, subIndex)}
      <span className={`${blink ? 'opacity-100' : 'opacity-0'} text-emerald-500`}>|</span>
    </span>
  );
};

const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');
  const [isLoading, setIsLoading] = useState(false);
  
  // Form State
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [restaurantName, setRestaurantName] = useState(''); // Only for signup
  
  // Errors
  const [errors, setErrors] = useState<{ email?: string; password?: string; restaurantName?: string }>({});

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

  const validateForm = () => {
    const newErrors: any = {};
    let isValid = true;

    if (!email) {
      newErrors.email = 'ایمیل الزامی است';
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'فرمت ایمیل صحیح نیست';
      isValid = false;
    }

    if (!password) {
      newErrors.password = 'رمز عبور الزامی است';
      isValid = false;
    } else if (password.length < 6) {
      newErrors.password = 'حداقل ۶ کاراکتر باشد';
      isValid = false;
    }

    if (authMode === 'signup') {
      if (!restaurantName) {
        newErrors.restaurantName = 'نام رستوران الزامی است';
        isValid = false;
      }
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleAuthAction = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      onLogin();
    }, 1500);
  };

  const switchMode = (mode: 'login' | 'signup') => {
    setAuthMode(mode);
    setErrors({});
    setEmail('');
    setPassword('');
    setRestaurantName('');
  };

  return (
    <div className="flex h-screen w-full bg-white overflow-hidden font-['Vazirmatn']">
      
      {/* --- RIGHT SIDE: AUTH FORM (REDESIGNED) --- */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center items-center p-6 bg-slate-50/50">
        <motion.div 
          key={authMode}
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: -10 }}
          transition={{ duration: 0.4 }}
          className="w-full max-w-[400px]"
        >
          {/* Header */}
          <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center w-14 h-14 bg-emerald-600 rounded-2xl shadow-lg shadow-emerald-200 mb-6">
              <ConciergeBell className="w-7 h-7 text-white" />
            </div>
            <div className="h-16 flex items-center justify-center mb-2">
               <TypewriterText />
            </div>
            <p className="text-slate-500 text-sm">
              {authMode === 'login' ? 'لطفا برای ورود به پنل، مشخصات خود را وارد کنید' : 'برای شروع، اطلاعات رستوران خود را ثبت کنید'}
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleAuthAction} className="space-y-5">
            
            {authMode === 'signup' && (
              <ModernInput 
                label="نام رستوران"
                type="text"
                icon={Store}
                placeholder="رستوران ایتالیایی..."
                value={restaurantName}
                onChange={(e: any) => {
                  setRestaurantName(e.target.value);
                  if (errors.restaurantName) setErrors({ ...errors, restaurantName: undefined });
                }}
                error={errors.restaurantName}
              />
            )}

            <ModernInput 
              label="ایمیل"
              type="email"
              icon={Mail}
              placeholder="name@company.com"
              value={email}
              onChange={(e: any) => {
                setEmail(e.target.value);
                if (errors.email) setErrors({ ...errors, email: undefined });
              }}
              error={errors.email}
            />

            <ModernInput 
              label="رمز عبور"
              type="password"
              icon={Lock}
              placeholder="••••••••"
              value={password}
              onChange={(e: any) => {
                setPassword(e.target.value);
                if (errors.password) setErrors({ ...errors, password: undefined });
              }}
              showPasswordToggle
              error={errors.password}
            />

            {authMode === 'login' && (
              <div className="flex items-center justify-between">
                 <label className="flex items-center gap-2 cursor-pointer">
                    <div className="relative flex items-center">
                       {/* Added bg-white to ensure checkbox background is white when unchecked */}
                       <input type="checkbox" className="peer w-4 h-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500 bg-white" />
                    </div>
                    <span className="text-xs font-bold text-slate-500">مرا به خاطر بسپار</span>
                 </label>
                 <a href="#" className="text-xs font-bold text-emerald-600 hover:text-emerald-700">رمز عبور را فراموش کردید؟</a>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-slate-900 text-white rounded-xl py-4 font-bold text-sm shadow-xl shadow-slate-900/20 hover:bg-slate-800 active:scale-[0.98] transition-all flex items-center justify-center gap-2 mt-4"
            >
              {isLoading ? (
                 <>
                   <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                   <span>در حال پردازش...</span>
                 </>
              ) : (
                 <>
                   {authMode === 'login' ? 'ورود به پنل' : 'ثبت نام رایگان'}
                   <ArrowLeft className="w-4 h-4" />
                 </>
              )}
            </button>
          </form>

          {/* Footer / Toggle Mode */}
          <div className="text-center mt-10">
             {authMode === 'login' ? (
                <p className="text-xs text-slate-500">
                   حساب کاربری ندارید؟ <button onClick={() => switchMode('signup')} className="font-bold text-emerald-600 hover:underline">ثبت‌نام کنید</button>
                </p>
             ) : (
                <p className="text-xs text-slate-500">
                   قبلاً ثبت‌نام کرده‌اید؟ <button onClick={() => switchMode('login')} className="font-bold text-emerald-600 hover:underline">وارد شوید</button>
                </p>
             )}
          </div>

          <div className="mt-8 pt-6 border-t border-slate-200 text-center">
             <p className="text-[10px] text-slate-400 font-medium">
                © ۲۰۲۵ ویترین. تمامی حقوق محفوظ است.
             </p>
          </div>
        </motion.div>
      </div>

      {/* --- LEFT SIDE: VISUAL NARRATIVE (PRESERVED) --- */}
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
    </div>
  );
};

export default LoginPage;
