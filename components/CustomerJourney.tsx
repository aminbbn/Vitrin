import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { 
  QrCode, 
  Smartphone, 
  Plus, 
  Check, 
  ChevronLeft, 
  CreditCard, 
  Bell, 
  CheckCircle2, 
  Play, 
  Pause,
  Maximize2
} from 'lucide-react';

interface JourneyStep {
  id: string;
  number: string;
  title: string;
  description: string;
  shortLabel: string;
  sceneType: "scan" | "browse" | "addons" | "payment" | "confirm";
  benefits: string[];
  note: string;
}

const JOURNEY_STEPS: JourneyStep[] = [
  {
    id: "step-1",
    number: "مرحله ۱",
    title: "اسکن کد میز",
    shortLabel: "اسکن کد میز",
    description: "مشتری با اسکن QR روی میز، بلافاصله وارد منوی اختصاصی همان میز می‌شود و بدون نیاز به گارسون یا نصب اپلیکیشن سفارش خود را آغاز می‌کند.",
    sceneType: "scan",
    benefits: ["کاهش صف انتظار پیشخوان سالن", "بدون نیاز به نصب اپلیکیشن یا ثبت‌نام", "شناسایی خودکار شماره میز مشتری"],
    note: "منوی هر میز اختصاصی همان شعبه و همان میز است."
  },
  {
    id: "step-2",
    number: "مرحله ۲",
    title: "مشاهده سریع منو",
    shortLabel: "مشاهده منو",
    description: "منوی دیجیتال با ساختاری ساده، روان و فوق‌العاده سریع روی مرورگر موبایل مشتری باز می‌شود. دسته‌بندی‌ها به آسانی قابل مرور و بررسی هستند.",
    sceneType: "browse",
    benefits: ["پیمایش روان و لود زیر ۱ ثانیه منو", "طراحی سازگار با موبایل (Responsive)", "نمایش عکس‌ها و قیمت‌های به‌روز"],
    note: "تغییر منو زنده و در لحظه اعمال می‌شود."
  },
  {
    id: "step-3",
    number: "مرحله ۳",
    title: "افزودن ملزومات",
    shortLabel: "افزودن ملزومات",
    description: "غذا، نوشیدنی و افزودنی‌های دلخواه را انتخاب می‌کند و سفارش را با انتخاب گزینه‌های جانبی (پنیر اضافه، قارچ، سس ویژه) مطابق سلیقه خود می‌سازد.",
    sceneType: "addons",
    benefits: ["تعریف آسان سایدها و مخلفات غذا", "محاسبه خودکار قیمت نهایی بر اساس انتخاب‌ها", "شخصی‌سازی کامل سفارش مطابق سلیقه مشتری"],
    note: "تغییرات قیمت و موجودی اقلام کاملاً هوشمند است."
  },
  {
    id: "step-4",
    number: "مرحله ۴",
    title: "پرداخت مستقیم",
    shortLabel: "پرداخت مستقیم",
    description: "پس از بررسی سبد خرید، سفارش خود را به صورت مستقیم ثبت می‌کند و در صورت نیاز، هزینه فاکتور را از طریق درگاه بانکی متصل به میز پرداخت می‌کند.",
    sceneType: "payment",
    benefits: ["تسویه حساب آنی بدون نیاز به مراجعه به صندوق", "پشتیبانی از درگاه‌های مستقیم و واسط بانکی", "کاهش بار کاری صندوقدار و حسابدار"],
    note: "اتصال به درگاه پرداخت کاملا اختیاری است."
  },
  {
    id: "step-5",
    number: "مرحله ۵",
    title: "تحویل و ثبت سفارش",
    shortLabel: "تحویل سفارش",
    description: "اطلاعات سفارش با شماره میز دقیق و جزئیات پرداخت وارد پنل مدیریت رستوران می‌شود. زنگ هشدار به صدا درآمده و فرآیند آماده‌سازی بلافاصله شروع می‌شود.",
    sceneType: "confirm",
    benefits: ["ارسال مستقیم سفارش به پرینتر آشپزخانه", "کاهش خطاهای انسانی ثبت فیش به صفر", "نمایش زمان ثبت و پیگیری مراحل آماده‌سازی"],
    note: "سیستم هشدار صوتی برای سفارشات جدید فعال است."
  }
];

export const CustomerJourney: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [isHovered, setIsHovered] = useState<boolean>(false);
  const shouldReduceMotion = useReducedMotion();
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const sectionRef = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  // 3D Parallax Tilt Effect for Desktop
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (shouldReduceMotion || window.innerWidth < 1024) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    
    // Max tilt ±3 degrees
    const tiltX = (y / (rect.height / 2)) * -3;
    const tiltY = (x / (rect.width / 2)) * 3;
    
    setTilt({ x: tiltX, y: tiltY });
  };

  const handleMouseLeave = () => {
    setTilt({ x: 0, y: 0 });
    setIsHovered(false);
  };

  // Auto-cycle through steps
  useEffect(() => {
    if (!isPlaying || isHovered || shouldReduceMotion) {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }

    timerRef.current = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % JOURNEY_STEPS.length);
    }, 5000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPlaying, isHovered, shouldReduceMotion]);

  // Pause auto-cycle when tab is hidden or element is out of viewport
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        setIsPlaying(false);
      } else {
        setIsPlaying(true);
      }
    };

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsPlaying(true);
          } else {
            setIsPlaying(false);
          }
        });
      },
      { threshold: 0.1 }
    );

    document.addEventListener("visibilitychange", handleVisibilityChange);
    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);

  const handleStepSelect = (index: number) => {
    setActiveIndex(index);
    // Pause auto-play temporarily once user explicitly interacts
    setIsPlaying(false);
  };

  const nextStep = () => {
    setActiveIndex((prev) => (prev + 1) % JOURNEY_STEPS.length);
    setIsPlaying(false);
  };

  // Scene Component Switcher
  const renderScene = (type: string, isActive: boolean) => {
    switch (type) {
      case "scan":
        return (
          <div className="relative w-full h-full flex items-center justify-center bg-slate-950 overflow-hidden rounded-3xl p-6">
            {/* Grid background */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f2937_1px,transparent_1px),linear-gradient(to_bottom,#1f2937_1px,transparent_1px)] bg-[size:24px_24px] opacity-15" />
            
            {/* QR Scanner Container */}
            <div className="relative flex flex-col items-center z-10">
              {/* Scan target QR */}
              <motion.div 
                animate={isActive ? { scale: [1, 1.02, 1] } : {}}
                transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
                className="relative bg-white p-4 rounded-2xl shadow-xl shadow-emerald-500/10 border-2 border-emerald-500/20"
              >
                <QrCode className="w-24 h-24 text-slate-900" />
                
                {/* Laser scan line */}
                {isActive && (
                  <motion.div 
                    initial={{ top: "0%" }}
                    animate={{ top: ["4%", "92%", "4%"] }}
                    transition={{ repeat: Infinity, duration: 2.2, ease: "easeInOut" }}
                    className="absolute left-[4%] right-[4%] h-[2px] bg-emerald-500 shadow-[0_0_8px_#10b981] z-20"
                  />
                )}
              </motion.div>

              {/* Table code indicator */}
              <motion.div 
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="mt-4 flex items-center gap-1.5 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-full text-xs font-black text-[#10b981]"
              >
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>میز شماره ۴</span>
              </motion.div>
            </div>

            {/* Glowing orb background */}
            <div className="absolute bottom-[-20%] left-[-20%] w-[180px] h-[180px] bg-emerald-500/10 blur-[60px] rounded-full pointer-events-none" />
          </div>
        );

      case "browse":
        return (
          <div className="relative w-full h-full flex items-center justify-center bg-slate-950 overflow-hidden rounded-3xl p-4">
            {/* Phone Screen Mockup */}
            <div className="w-[190px] h-[256px] bg-[#111312] border-4 border-slate-800 rounded-3xl shadow-2xl relative overflow-hidden flex flex-col font-['Vazirmatn'] text-right">
              {/* Phone speaker/camera bar */}
              <div className="absolute top-0 inset-x-0 h-4 bg-slate-800 flex justify-center items-center z-20">
                <div className="w-10 h-1.5 rounded-full bg-slate-900" />
              </div>

              {/* Mock App Header */}
              <div className="pt-5 pb-2 px-3 border-b border-white/[0.06] bg-white/[0.02] flex items-center justify-between text-[10px] text-slate-300 font-bold">
                <span className="text-[8px] bg-emerald-500/10 text-emerald-400 px-1.5 py-0.5 rounded">میز ۴</span>
                <span>کافه رستوران راک</span>
              </div>

              {/* Category selector */}
              <div className="p-2 flex gap-1 overflow-x-hidden border-b border-white/[0.04]">
                <span className="text-[7px] font-black bg-emerald-500 text-white px-2 py-0.5 rounded-full shrink-0">پیتزا</span>
                <span className="text-[7px] font-bold bg-white/5 text-slate-400 px-2 py-0.5 rounded-full shrink-0">برگر</span>
                <span className="text-[7px] font-bold bg-white/5 text-slate-400 px-2 py-0.5 rounded-full shrink-0">نوشیدنی</span>
              </div>

              {/* Food Items list (Staggered animation) */}
              <div className="flex-1 p-2 overflow-y-auto space-y-2 flex flex-col justify-start">
                <motion.div 
                  initial={isActive ? { opacity: 0, y: 12 } : { opacity: 1, y: 0 }}
                  animate={isActive ? { opacity: 1, y: 0 } : {}}
                  transition={{ delay: 0.1 }}
                  className="bg-white/[0.03] border border-white/[0.06] p-1.5 rounded-xl flex items-center gap-2"
                >
                  <div className="w-10 h-10 bg-slate-800 rounded-lg shrink-0 overflow-hidden relative">
                    <img src="https://picsum.photos/seed/pizza/120/120" referrerPolicy="no-referrer" className="w-full h-full object-cover filter contrast-125 saturate-75 opacity-90" alt="Pizza" />
                  </div>
                  <div className="flex-1 text-[8px] flex flex-col justify-center min-w-0">
                    <span className="text-white font-black truncate">پیتزا پپرونی</span>
                    <span className="text-[#10b981] font-bold mt-0.5">۲۸۰,۰۰۰ تومان</span>
                  </div>
                  <div className="w-4 h-4 rounded-full bg-emerald-500 flex items-center justify-center text-white text-[10px] font-black shrink-0 shadow-lg shadow-emerald-500/20 cursor-pointer">+</div>
                </motion.div>

                <motion.div 
                  initial={isActive ? { opacity: 0, y: 12 } : { opacity: 1, y: 0 }}
                  animate={isActive ? { opacity: 1, y: 0 } : {}}
                  transition={{ delay: 0.2 }}
                  className="bg-white/[0.03] border border-white/[0.06] p-1.5 rounded-xl flex items-center gap-2"
                >
                  <div className="w-10 h-10 bg-slate-800 rounded-lg shrink-0 overflow-hidden relative">
                    <img src="https://picsum.photos/seed/burger/120/120" referrerPolicy="no-referrer" className="w-full h-full object-cover filter contrast-125 saturate-75 opacity-90" alt="Burger" />
                  </div>
                  <div className="flex-1 text-[8px] flex flex-col justify-center min-w-0">
                    <span className="text-white font-black truncate">چیزبرگر مخصوص</span>
                    <span className="text-slate-400 font-bold mt-0.5">۲۹۵,۰۰۰ تومان</span>
                  </div>
                  <div className="w-4 h-4 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white text-[10px] font-black shrink-0">+</div>
                </motion.div>
              </div>
            </div>

            {/* Glowing ambient ring */}
            <div className="absolute inset-0 border border-[#10b981]/10 rounded-3xl pointer-events-none" />
          </div>
        );

      case "addons":
        return (
          <div className="relative w-full h-full flex items-center justify-center bg-slate-950 overflow-hidden rounded-3xl p-4">
            {/* Food Customize Sheet Panel */}
            <div className="w-[200px] bg-[#111312] border-2 border-emerald-500/20 rounded-2xl p-3 shadow-2xl relative z-10 text-right font-['Vazirmatn']">
              <span className="text-[6px] bg-emerald-500/10 text-emerald-400 px-1.5 py-0.5 rounded font-black">انتخاب ساید و مخلفات</span>
              <h5 className="text-[10px] font-black text-white mt-1">پیتزا پپرونی تند</h5>
              
              {/* Customize options */}
              <div className="mt-3 space-y-2">
                {/* Cheese option */}
                <div className="flex items-center justify-between text-[8px] border-b border-white/[0.05] pb-2">
                  <div className="flex items-center gap-1.5">
                    <motion.div 
                      animate={isActive ? { scale: [1, 1.1, 1], backgroundColor: ["rgba(16, 185, 129, 0.1)", "rgba(16, 185, 129, 1)", "rgba(16, 185, 129, 1)"] } : {}}
                      transition={{ delay: 0.3, duration: 0.4 }}
                      className="w-3.5 h-3.5 rounded bg-emerald-500 flex items-center justify-center text-white"
                    >
                      <Check className="w-2.5 h-2.5 stroke-[3px]" />
                    </motion.div>
                    <span className="text-slate-200 font-bold">پنیر پیتزا اضافه</span>
                  </div>
                  <span className="text-slate-400">+۴۵,۰۰۰ تومان</span>
                </div>

                {/* Mushrooms option */}
                <div className="flex items-center justify-between text-[8px] border-b border-white/[0.05] pb-2">
                  <div className="flex items-center gap-1.5">
                    <motion.div 
                      animate={isActive ? { scale: [1, 1.1, 1], backgroundColor: ["rgba(16, 185, 129, 0.1)", "rgba(16, 185, 129, 1)", "rgba(16, 185, 129, 1)"] } : {}}
                      transition={{ delay: 0.6, duration: 0.4 }}
                      className="w-3.5 h-3.5 rounded bg-emerald-500 flex items-center justify-center text-white"
                    >
                      <Check className="w-2.5 h-2.5 stroke-[3px]" />
                    </motion.div>
                    <span className="text-slate-200 font-bold">قارچ اضافه</span>
                  </div>
                  <span className="text-slate-400">+۲۵,۰۰۰ تومان</span>
                </div>

                {/* Jalapeno option */}
                <div className="flex items-center justify-between text-[8px] pb-1">
                  <div className="flex items-center gap-1.5">
                    <div className="w-3.5 h-3.5 rounded bg-white/5 border border-white/10 flex items-center justify-center text-transparent" />
                    <span className="text-slate-400">هالوپینو تند اضافه</span>
                  </div>
                  <span className="text-slate-500">+۱۵,۰۰0 تومان</span>
                </div>
              </div>

              {/* Total Summary */}
              <div className="mt-4 pt-2.5 border-t border-white/10 flex items-center justify-between text-[9px] text-white">
                <span className="font-bold">مبلغ کل سفارش:</span>
                <span className="font-black text-[#10b981]">۳۵۰,۰۰۰ تومان</span>
              </div>
            </div>

            {/* Glowing radial spot */}
            <div className="absolute top-[20%] right-[20%] w-[120px] h-[120px] bg-emerald-500/5 blur-[40px] rounded-full pointer-events-none" />
          </div>
        );

      case "payment":
        return (
          <div className="relative w-full h-full flex items-center justify-center bg-slate-950 overflow-hidden rounded-3xl p-4">
            {/* Checkout Invoice Card */}
            <div className="w-[190px] bg-[#111312] border border-white/10 rounded-2xl p-3 shadow-2xl relative z-10 text-right font-['Vazirmatn']">
              <span className="text-[6px] bg-slate-800 text-slate-300 px-1.5 py-0.5 rounded font-black">پیش‌فاکتور میز شماره ۴</span>
              
              <div className="mt-2.5 space-y-1 text-[8px] text-slate-300 border-b border-white/[0.05] pb-2">
                <div className="flex justify-between">
                  <span>پیتزا پپرونی با پنیر اضافه</span>
                  <span>۳۲۵,۰۰۰ تومان</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>قارچ اضافه × ۱</span>
                  <span>۲۵,۰۰۰ تومان</span>
                </div>
              </div>

              {/* Total */}
              <div className="my-2.5 flex justify-between items-center text-[10px] font-black text-white">
                <span>مبلغ قابل پرداخت:</span>
                <span className="text-[#10b981]">۳۵۰,۰۰۰ تومان</span>
              </div>

              {/* Button with animated pulse */}
              <motion.button 
                animate={isActive ? { scale: [1, 1.02, 1] } : {}}
                transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                className="w-full bg-[#10b981] hover:bg-[#12cb8d] text-white py-1.5 px-3 rounded-lg text-[8px] font-extrabold flex items-center justify-center gap-1 cursor-pointer border-0 shadow-lg shadow-emerald-500/15"
              >
                <CreditCard className="w-2.5 h-2.5" />
                <span>پرداخت آنلاین و ثبت نهایی</span>
              </motion.button>
            </div>

            {/* Success Shield popup inside mockup (Slide in) */}
            <AnimatePresence>
              {isActive && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.8, y: 15 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.8, y: 10 }}
                  transition={{ delay: 0.9, type: "spring", stiffness: 200, damping: 15 }}
                  className="absolute inset-x-6 top-1/2 -translate-y-1/2 bg-[#141514] border border-emerald-500/40 p-3 rounded-xl shadow-2xl z-20 flex flex-col items-center justify-center text-center font-['Vazirmatn']"
                >
                  <div className="w-7 h-7 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-[#10b981]">
                    <CheckCircle2 className="w-4 h-4 stroke-[2.5px]" />
                  </div>
                  <span className="text-[9px] font-black text-white mt-2">پرداخت با موفقیت انجام شد</span>
                  <span className="text-[7px] text-slate-400 mt-1">شماره پیگیری: ۸۹۱۲۷۶</span>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );

      case "confirm":
        return (
          <div className="relative w-full h-full flex items-center justify-center bg-slate-950 overflow-hidden rounded-3xl p-4">
            {/* Tablet Restaurant View Screen */}
            <div className="w-[210px] bg-[#111312] border border-white/10 rounded-2xl p-2.5 shadow-2xl relative z-10 text-right font-['Vazirmatn']">
              {/* Top bar */}
              <div className="flex items-center justify-between text-[7px] text-slate-400 border-b border-white/[0.06] pb-1.5 mb-2">
                <div className="flex items-center gap-1 font-bold">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span>آشپزخانه آنلاین</span>
                </div>
                <span>پنل سفارشات ویترین</span>
              </div>

              {/* Incoming Order Notification Ticket Card */}
              <motion.div 
                initial={isActive ? { scale: 0.85, opacity: 0, y: 8 } : { scale: 1, opacity: 1, y: 0 }}
                animate={isActive ? { scale: 1, opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.3, type: "spring", stiffness: 200, damping: 15 }}
                className="bg-emerald-500/5 border border-emerald-500/20 p-2 rounded-xl text-right relative"
              >
                {/* Order header */}
                <div className="flex justify-between items-center text-[8px]">
                  <span className="font-black text-[#10b981]">جدید #۱۲۸۹۵</span>
                  <span className="bg-[#10b981]/15 text-[#10b981] px-1.5 py-0.5 rounded font-black text-[7px]">میز شماره ۴</span>
                </div>

                {/* Divider */}
                <div className="h-[1px] bg-emerald-500/10 my-1.5" />

                {/* Items */}
                <div className="space-y-1 text-[7px] text-slate-200 font-bold">
                  <div>۱ × پیتزا پپرونی مخصوص</div>
                  <div className="text-slate-400 mr-2.5">• با پنیر پیتزا اضافه</div>
                  <div className="text-slate-400 mr-2.5">• با قارچ اضافه</div>
                </div>

                {/* Status indicator */}
                <div className="mt-2 pt-1.5 border-t border-white/[0.04] flex justify-between items-center text-[6px]">
                  <span className="text-slate-400">ثبت شده در: ۱۲:۰۴</span>
                  <div className="flex items-center gap-1 bg-emerald-500/10 text-emerald-400 px-1 py-0.2 rounded font-black">
                    <span className="w-1 h-1 rounded-full bg-emerald-400 animate-ping" />
                    <span>آماده‌سازی</span>
                  </div>
                </div>

                {/* Bell icon ringing animation */}
                {isActive && (
                  <motion.div 
                    animate={{ rotate: [-8, 8, -8, 8, 0] }}
                    transition={{ repeat: 3, repeatDelay: 1, duration: 0.5 }}
                    className="absolute -top-1.5 -left-1.5 bg-[#10b981] text-white p-1 rounded-lg shadow-md shrink-0"
                  >
                    <Bell className="w-2.5 h-2.5 fill-white text-[#10b981]" />
                  </motion.div>
                )}
              </motion.div>
            </div>

            {/* Glowing background */}
            <div className="absolute inset-0 bg-radial-gradient from-emerald-500/10 to-transparent opacity-30 pointer-events-none" />
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <section 
      ref={sectionRef}
      className="py-20 lg:py-28 bg-[#F8F9FA] dark:bg-[#121614] border-t border-b border-slate-200/50 dark:border-white/5 scroll-mt-20 overflow-hidden relative select-none font-['Vazirmatn']"
      style={{ direction: 'rtl' }}
    >
      <div className="max-w-[1280px] mx-auto px-6 md:px-8 relative z-10">
        
        {/* ==========================================
            SECTION HEADER (Premium Styled)
           ========================================== */}
        <div className="text-center max-w-2xl mx-auto mb-16 md:mb-20">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          >
            <span className="text-[10px] uppercase tracking-[0.2em] font-black text-[#10b981] dark:text-[#19C78C] bg-[#10b981]/10 dark:bg-[#19C78C]/10 px-3.5 py-1 rounded-full border border-[#10b981]/15 dark:border-[#19C78C]/20">
              تجربه مشتری
            </span>
          </motion.div>
          
          <motion.h2 
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="text-2xl sm:text-3xl md:text-4xl font-black text-slate-900 dark:text-white tracking-tight mt-5 leading-tight"
          >
            مسیر ساده و بی‌دردسر خرید نهایی
          </motion.h2>
          
          <motion.p 
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="text-slate-500 dark:text-slate-400 mt-4 font-bold text-sm sm:text-base"
          >
            مشتری چگونه سفارش خود را ثبت و نهایی می‌کند؟
          </motion.p>
          
          {/* Growth divider bar */}
          <div className="mt-8 flex justify-center">
            <motion.div 
              initial={{ width: 0 }}
              whileInView={{ width: 80 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
              className="h-1 bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full"
            />
          </div>
        </div>

        {/* ==========================================
            MAIN CORE LAYOUT: Split Left / Right
           ========================================== */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 xl:gap-12 items-center">
          
          {/* RIGHT SIDE: Active Step Explanatory Panel (RTL alignment) */}
          <div className="lg:col-span-5 flex flex-col justify-between h-full order-1 lg:order-2">
            <div className="bg-white dark:bg-[#161B18] border border-slate-200/50 dark:border-white/5 rounded-3xl p-8 shadow-xl shadow-slate-100/40 dark:shadow-none relative overflow-hidden flex flex-col justify-between min-h-[380px]">
              
              {/* Background abstract graphic */}
              <div className="absolute top-0 left-0 w-24 h-24 bg-gradient-to-br from-emerald-500/5 to-transparent blur-3xl rounded-full pointer-events-none" />

              <AnimatePresence mode="wait">
                <motion.div
                  key={activeIndex}
                  initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: shouldReduceMotion ? 0 : -10 }}
                  transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                  className="flex flex-col flex-1"
                >
                  {/* Step index badge */}
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-[11px] font-black text-emerald-500 dark:text-[#19C78C] uppercase tracking-widest bg-emerald-50 dark:bg-[#19C78C]/10 px-2.5 py-1 rounded-lg">
                      {JOURNEY_STEPS[activeIndex].number}
                    </span>
                    <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500">
                      مرحله {activeIndex + 1} از ۵
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="text-xl md:text-2xl font-black text-slate-800 dark:text-white leading-none mb-3">
                    {JOURNEY_STEPS[activeIndex].title}
                  </h3>

                  {/* Description */}
                  <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed font-bold mb-6">
                    {JOURNEY_STEPS[activeIndex].description}
                  </p>

                  {/* Bullet list of key benefits */}
                  <div className="space-y-2.5 mb-6">
                    {JOURNEY_STEPS[activeIndex].benefits.map((benefit, i) => (
                      <div key={i} className="flex items-start gap-2 text-[11px] sm:text-xs text-slate-600 dark:text-slate-300 font-bold">
                        <span className="w-4.5 h-4.5 rounded-full bg-emerald-50 dark:bg-emerald-500/10 flex items-center justify-center text-emerald-500 dark:text-[#19C78C] shrink-0 mt-0.5">
                          <Check className="w-3 h-3 stroke-[2.5px]" />
                        </span>
                        <span className="leading-snug">{benefit}</span>
                      </div>
                    ))}
                  </div>

                  {/* Highlight note block */}
                  <div className="mt-auto bg-slate-50 dark:bg-white/[0.02] border-r-2 border-emerald-500 dark:border-[#19C78C] p-3 rounded-l-xl text-[10px] text-slate-500 dark:text-slate-400 font-bold leading-relaxed flex items-center justify-between">
                    <span>{JOURNEY_STEPS[activeIndex].note}</span>
                  </div>
                </motion.div>
              </AnimatePresence>

              {/* Navigation Actions Panel */}
              <div className="mt-6 pt-5 border-t border-slate-100 dark:border-white/5 flex items-center justify-between">
                {/* Autoplay play/pause toggle */}
                {!shouldReduceMotion && (
                  <button
                    onClick={() => setIsPlaying(!isPlaying)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-transparent text-[11px] font-bold text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white hover:border-slate-300 dark:hover:border-white/20 active:scale-[0.98] transition-all cursor-pointer outline-none"
                    title={isPlaying ? "توقف چرخش خودکار" : "شروع چرخش خودکار"}
                  >
                    {isPlaying ? (
                      <>
                        <Pause className="w-3 h-3 text-[#10b981] dark:text-[#19C78C] fill-[#10b981] dark:fill-[#19C78C]" />
                        <span>پخش خودکار فعال</span>
                      </>
                    ) : (
                      <>
                        <Play className="w-3 h-3 text-slate-400 dark:text-slate-500" />
                        <span>پخش خودکار متوقف</span>
                      </>
                    )}
                  </button>
                )}

                {/* Show next step CTA */}
                <button
                  onClick={nextStep}
                  className="flex items-center gap-1 px-4 py-2 bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-100 text-white dark:text-slate-950 text-[11px] font-extrabold rounded-xl active:scale-[0.97] transition-all cursor-pointer border-0 shadow-lg shadow-slate-900/10 dark:shadow-none"
                >
                  <span>{activeIndex === 4 ? "شروع دوباره از ابتدا" : "مشاهده مرحله بعد"}</span>
                  <ChevronLeft className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>

          {/* LEFT SIDE: Core Layered Interaction Stack Visuals */}
          <div 
            className="lg:col-span-7 flex flex-col items-center justify-center order-2 lg:order-1 relative min-h-[420px] w-full"
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            onMouseEnter={() => setIsHovered(true)}
          >
            {/* Visual platform base ring */}
            <div className="absolute bottom-[10%] w-[80%] h-[30%] bg-emerald-500/5 blur-[40px] rounded-full pointer-events-none transform -rotate-12 z-0" />

            {/* 3D Stack Container (Rotates slightly according to tilt coordinates) */}
            <motion.div 
              style={{
                perspective: 1200,
                transformStyle: "preserve-3d"
              }}
              animate={shouldReduceMotion ? {} : {
                rotateX: tilt.x,
                rotateY: tilt.y,
              }}
              transition={{ type: "spring", stiffness: 100, damping: 25 }}
              className="relative w-[310px] sm:w-[350px] md:w-[390px] h-[340px] flex items-center justify-center z-10"
            >
              <AnimatePresence>
                {JOURNEY_STEPS.map((step, index) => {
                  const diff = index - activeIndex;
                  const isActive = index === activeIndex;
                  
                  // Calculate stacked visual styling parameters
                  const zIndexValue = isActive ? 50 : 40 - Math.abs(diff);
                  const scaleValue = isActive ? 1 : 0.95 - Math.abs(diff) * 0.04;
                  const opacityValue = isActive ? 1 : Math.max(0.12, 0.45 - Math.abs(diff) * 0.12);
                  
                  // Creative layout offset math to position inactive layers sitting elegantly behind
                  const yOffset = diff * -16;
                  const xOffset = diff * -24; // Cascading offset in space
                  const rotationValue = diff * 2.5; // Subtle rotate drift
                  const blurValue = isActive ? "blur(0px)" : `blur(${Math.min(3, Math.abs(diff) * 1.5)}px)`;

                  return (
                    <motion.div
                      key={step.id}
                      initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.8, y: 30 }}
                      animate={{
                        opacity: opacityValue,
                        scale: scaleValue,
                        zIndex: zIndexValue,
                        y: yOffset,
                        x: xOffset,
                        rotate: shouldReduceMotion ? 0 : rotationValue,
                        filter: shouldReduceMotion ? "none" : blurValue,
                      }}
                      transition={{
                        type: "spring",
                        stiffness: 150,
                        damping: 20,
                        mass: 0.8
                      }}
                      onClick={() => handleStepSelect(index)}
                      className={`absolute w-[290px] sm:w-[330px] md:w-[370px] h-[270px] rounded-[32px] cursor-pointer ${
                        isActive 
                          ? 'ring-2 ring-[#10b981]/50 dark:ring-[#19C78C]/50 shadow-[0_24px_50px_-16px_rgba(16,185,129,0.3)] bg-slate-950 p-1.5' 
                          : 'shadow-md border border-slate-200/50 dark:border-white/5 bg-white dark:bg-[#161B18] hover:border-slate-300 dark:hover:border-white/10'
                      } transition-all duration-300`}
                    >
                      {isActive ? (
                        /* Core Interactive Mini Product Scene Container */
                        <div className="w-full h-full relative rounded-[26px] overflow-hidden">
                          {renderScene(step.sceneType, isActive)}

                          {/* Hover-aware indicator inside active scene */}
                          <div className="absolute bottom-3 right-3 bg-white/10 backdrop-blur-md px-2 py-0.5 rounded-full border border-white/10 flex items-center gap-1.5 z-20">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                            <span className="text-[7px] font-black tracking-normal text-white uppercase">نمای دمو زنده</span>
                          </div>
                        </div>
                      ) : (
                        /* Compact Elegant Inactive Layer Shell */
                        <div className="w-full h-full p-6 flex flex-col justify-between font-['Vazirmatn'] text-right select-none">
                          <div className="flex items-center justify-between border-b border-slate-100 dark:border-white/5 pb-2.5">
                            <span className="text-[10px] font-black text-slate-400 dark:text-slate-500">{step.number}</span>
                            <span className="text-[9px] font-black text-slate-400 dark:text-slate-400 px-2 py-0.5 bg-slate-50 dark:bg-white/[0.02] border border-slate-100 dark:border-white/5 rounded-md">کلیک کنید</span>
                          </div>
                          
                          <div className="my-auto">
                            <h4 className="text-sm font-black text-slate-700 dark:text-white">{step.title}</h4>
                            <p className="text-[10px] text-slate-400 dark:text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                              {step.description}
                            </p>
                          </div>

                          <div className="flex items-center gap-2 mt-auto text-[9px] font-bold text-[#10b981] dark:text-[#19C78C]">
                            <span>جزییات مرحله</span>
                            <ChevronLeft className="w-3 h-3 stroke-[2.5px]" />
                          </div>
                        </div>
                      )}
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </motion.div>
          </div>
          
        </div>

        {/* ==========================================
            BOTTOM STEP TIMELINE PILLS NAVIGATION
           ========================================== */}
        <div className="mt-16 md:mt-24 max-w-4xl mx-auto">
          {/* Connecting tracking line */}
          <div className="relative flex items-center justify-between">
            <div className="absolute top-1/2 left-[4%] right-[4%] h-[2px] bg-slate-200 dark:bg-white/10 -translate-y-1/2 z-0">
              <motion.div 
                className="h-full bg-gradient-to-r from-emerald-500 to-[#10b981] dark:from-[#19C78C] dark:to-emerald-500 origin-right"
                animate={{ width: `${(activeIndex / 4) * 100}%` }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              />
            </div>

            {/* Individual step pills */}
            {JOURNEY_STEPS.map((step, index) => {
              const isActive = index === activeIndex;
              const isCompleted = index < activeIndex;

              return (
                <button
                  key={step.id}
                  onClick={() => handleStepSelect(index)}
                  className="relative z-10 flex flex-col items-center group cursor-pointer focus:outline-none border-0 bg-transparent"
                >
                  {/* Circle point */}
                  <motion.div
                    animate={{
                      scale: isActive ? 1.15 : 1,
                    }}
                    className={`w-10 h-10 rounded-full border-2 flex items-center justify-center shadow-lg transition-all duration-300 ${
                      isActive
                        ? "bg-[#10b981] border-[#10b981] dark:bg-[#19C78C] dark:border-[#19C78C]"
                        : isCompleted
                        ? "bg-[#e6fbf4] border-[#10b981] dark:bg-[#19C78C]/10 dark:border-[#19C78C]"
                        : "bg-white border-slate-300 dark:bg-[#161B18] dark:border-white/10"
                    }`}
                  >
                    {isCompleted ? (
                      <Check className="w-5 h-5 text-emerald-600 dark:text-[#19C78C] stroke-[3px]" />
                    ) : (
                      <span className={`text-xs font-black ${isActive ? 'text-white' : 'text-slate-500 dark:text-slate-400'}`}>
                        {index + 1}
                      </span>
                    )}
                  </motion.div>

                  {/* Label title */}
                  <span className={`mt-3 text-[11px] md:text-xs font-black transition-colors duration-300 ${
                    isActive ? 'text-slate-900 dark:text-white font-extrabold' : 'text-slate-400 group-hover:text-slate-600 dark:text-slate-500 dark:group-hover:text-slate-400'
                  }`}>
                    {step.shortLabel}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

      </div>
    </section>
  );
};
