import React, { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { 
  Reveal, 
  StaggerGroup, 
  StaggerChild, 
  AnimatedHeading, 
  AnimatedIcon, 
  AnimatedCard, 
  MotionButton,
} from './MotionSystem';
import { CustomerJourney } from './CustomerJourney';
import { TrustStripSection } from './TrustStripSection';
import { 
  Sparkles, 
  CheckCircle2, 
  MousePointerClick, 
  Zap, 
  ShoppingBag, 
  Layers, 
  Play, 
  ArrowLeft, 
  ChevronLeft, 
  Smartphone, 
  Settings, 
  Layout,
  Clock,
  HeartHandshake,
  QrCode,
  Percent,
  Check,
  Plus,
  Minus,
  Database,
  Printer,
  FileSpreadsheet,
  Globe,
  HelpCircle,
  ChevronDown
} from 'lucide-react';

const PRIMARY_EASE = [0.16, 1, 0.3, 1];

// ==========================================
// STATIC DATA MODELS (Separate Data/Logic)
// ==========================================

interface IntegrationItem {
  id: string;
  name: string;
  description: string;
  category: string;
  status: 'active' | 'upcoming';
  icon: React.ComponentType<{ className?: string }>;
}

const INTEGRATIONS: IntegrationItem[] = [
  {
    id: 'gateway',
    name: 'درگاه‌های پرداخت مستقیم',
    description: 'اتصال به کلیه درگاه‌های بانکی مستقیم و واسط (زرین‌پال، جیبیت و...) برای واریز آنی مبالغ به حساب شما.',
    category: 'مالی',
    status: 'active',
    icon: CheckCircle2,
  },
  {
    id: 'printer',
    name: 'چاپگرهای حرارتی آشپزخانه',
    description: 'اتصال مستقیم به چاپگرهای فیش حرارتی (LAN, WiFi, Bluetooth) جهت چاپ خودکار فاکتور به محض ثبت سفارش.',
    category: 'عملیات',
    status: 'active',
    icon: Printer,
  },
  {
    id: 'sms',
    name: 'پنل‌های پیامکی اطلاع‌رسانی',
    description: 'ارسال خودکار پیامک تایید سفارش، مراحل آماده‌سازی و ارسال غذا برای خریدار جهت ایجاد اعتماد.',
    category: 'ارتباطات',
    status: 'active',
    icon: Zap,
  },
  {
    id: 'domain',
    name: 'اتصال به دامنه اختصاصی',
    description: 'راه‌اندازی منو روی دامنه شخصی رستوران شما (مانند menu.yourbrand.com) برای ارتقای ارزش برند.',
    category: 'برندینگ',
    status: 'active',
    icon: Globe,
  },
  {
    id: 'table-qr',
    name: 'کدهای QR میزهای سالن',
    description: 'کدهای QR هوشمند منحصر‌به‌فرد برای هر میز جهت تشخیص خودکار موقعیت و شماره میز خریدار.',
    category: 'سفارش‌گیری',
    status: 'active',
    icon: QrCode,
  },
  {
    id: 'excel',
    name: 'خروجی اکسل و گزارش‌گیری',
    description: 'دانلود فایل گزارش سفارش‌ها، اطلاعات خریداران، ساعات شلوغی و نمودار فروش با فیلترهای دلخواه.',
    category: 'تحلیل',
    status: 'active',
    icon: FileSpreadsheet,
  },
  {
    id: 'accounting',
    name: 'همگام‌سازی با نرم‌افزارهای حسابداری',
    description: 'اتصال مستقیم و انتقال خودکار اقلام فاکتور به نرم‌افزارهای هلو، سپیدار، محک و صندوق‌های فروشگاهی سنتی.',
    category: 'سیستم‌ها',
    status: 'upcoming',
    icon: Database,
  },
];

interface TemplateItem {
  id: string;
  title: string;
  description: string;
  accent: string;
  bgType: 'light' | 'dark' | 'warm';
  items: Array<{ name: string; price: string; isSpicy?: boolean; isAvailable?: boolean }>;
}

const TEMPLATES: TemplateItem[] = [
  {
    id: 'cafe',
    title: 'کافه تخصصی و نوشیدنی',
    description: 'طراحی مینیمال با رنگ‌بندی گرم استخوانی، گالری‌های تصویری مجزا برای نوشیدنی‌های دمی و منوی کیک‌های روز.',
    accent: 'emerald',
    bgType: 'warm',
    items: [
      { name: 'اسپرسو دبل کمربند', price: '۷۵,۰۰۰' },
      { name: 'کورتادو با شیر بادام', price: '۹۰,۰۰۰' },
      { name: 'تارت بلوبری تازه', price: '۱۲۰,۰۰۰' },
    ],
  },
  {
    id: 'fastfood',
    title: 'فست‌فود و برگر شاپ',
    description: 'رابط کاربری پرانرژی تیره با تمرکز بر عکاسی‌های بزرگ از غذا، برچسب‌های تند و دکمه‌های سفارش‌گیری سریع.',
    accent: 'red',
    bgType: 'dark',
    items: [
      { name: 'دبل برگر با پنیر سوئیسی', price: '۳۸۰,۰۰۰' },
      { name: 'سیب‌زمینی سرخ‌کرده با پنیر چدار', price: '۱۴۰,۰۰۰' },
      { name: 'پیتزا پپرونی تند ایتالیایی', price: '۳۴۰,۰۰۰', isSpicy: true },
    ],
  },
  {
    id: 'restaurant',
    title: 'رستوران سنتی و کلاسیک',
    description: 'قالب‌های منظم، تفکیک دقیق کباب‌ها، پلوها و پیش‌غذاها، همراه با توضیحات مفصل و وزن مواد تشکیل‌دهنده.',
    accent: 'amber',
    bgType: 'light',
    items: [
      { name: 'چلوکباب کوبیده مخصوص', price: '۴۲۰,۰۰۰' },
      { name: 'کباب برگ گوسفندی ممتاز', price: '۵۸۰,۰۰۰' },
      { name: 'ماست کوزه‌ای محلی با نعنا', price: '۴۵,۰۰۰' },
    ],
  },
  {
    id: 'confectionery',
    title: 'قنادی و بوتیک شیرینی',
    description: 'چیدمان لوکس و رنگ‌های پاستلی ملایم با فیلترهای تفکیکی براساس وزن، طعم و زمان تحویل کیک‌های سفارشی.',
    accent: 'rose',
    bgType: 'warm',
    items: [
      { name: 'کیک هویج و گردو کلاسیک', price: '۲۹۰,۰۰۰' },
      { name: 'ماکارون فرانسوی (جعبه ۶ عددی)', price: '۱۸۰,۰۰۰' },
      { name: 'دسر چیزکیک سن‌سباستین', price: '۱۶۰,۰۰۰' },
    ],
  },
];

interface FAQItem {
  id: string;
  question: string;
  answer: string;
}

const FAQS: FAQItem[] = [
  {
    id: 'q1',
    question: 'آیا ویترین از سفارش‌های ثبت‌شده کارمزد کسر می‌کند؟',
    answer: 'خیر، برخلاف پلتفرم‌های واسط، ویترین هیچ‌گونه کارمزدی از سفارش‌های شما دریافت نمی‌کند. تمام سود حاصل از فروش شما مستقیم و بدون هیچ کسر وجهی به درگاه بانکی متصل به حساب خودتان واریز می‌شود.',
  },
  {
    id: 'q2',
    question: 'چگونه کدهای QR برای میزها کار می‌کنند؟ آیا خریدار باید نرم‌افزار خاصی نصب کند؟',
    answer: 'مشتریان شما برای مشاهده منو نیازی به نصب هیچ اپلیکیشنی ندارند. آن‌ها به سادگی با دوربین گوشی یا اسکنرهای استاندارد، کد QR نصب‌شده روی میز را اسکن می‌کنند و منو روی مرورگر موبایل آن‌ها باز می‌شود. شماره میز نیز به طور خودکار به فاکتور سفارش پیوست خواهد شد.',
  },
  {
    id: 'q3',
    question: 'سفارش‌های ثبت‌شده مشتریان در کجا نمایش داده می‌شوند؟',
    answer: 'سفارش‌ها بلافاصله با صدای هشدار صوتی در پنل تحت وب مدیریت ویترین قرار می‌گیرند. شما می‌توانید این پنل را روی انواع تبلت، موبایل، لپ‌تاپ یا مانیتورهای مستقر در پیشخوان نصب کنید. همچنین امکان ارسال مستقیم به پرینتر آشپزخانه جهت چاپ فیش مهیا است.',
  },
  {
    id: 'q4',
    question: 'آیا پرداخت آنلاین در منو پشتیبانی می‌شود؟',
    answer: 'بله، شما می‌توانید درگاه پرداخت مستقیم متعلق به بانک یا درگاه‌های واسط مانند زرین‌پال را به منوی خود متصل کنید تا مشتریان در همان لحظه سفارش، هزینه فاکتور را پرداخت نمایند.',
  },
  {
    id: 'q5',
    question: 'آیا برای ایجاد و کار با منوی دیجیتال نیاز به دانش فنی دارم؟',
    answer: 'به هیچ وجه. تمام بخش‌های استودیوی طراحی و پنل مدیریت ویترین به صورت کاملاً فارسی، بصری و بدون نیاز به دانش برنامه‌نویسی یا گرافیک پیشرفته ساخته شده است. شما می‌توانید در چند دقیقه دسته‌بندی‌ها و محصولات جدید خود را ایجاد و ثبت کنید.',
  },
  {
    id: 'q6',
    question: 'آیا می‌توانم منوی دیجیتال را به دامنه اختصاصی رستوران خودم متصل کنم؟',
    answer: 'بله، در طرح‌های حرفه‌ای می‌توانید منوی خود را به زیردامنه یا دامنه اختصاصی خود (مانند menu.yourbrand.com) متصل کنید. روند فنی اتصال با همکاری تیم پشتیبانی ویترین برای شما به طور کامل انجام می‌گیرد.',
  },
  {
    id: 'q7',
    question: 'پشتیبانی فنی در چه ساعاتی و به چه صورتی انجام می‌شود؟',
    answer: 'تیم پشتیبانی فنی ویترین در تمام روزهای هفته از طریق چت آنلاین، تماس تلفنی و تیکت آماده راهنمایی و پاسخ‌گویی به سوالات شما است. برای رستوران‌های فعال در ساعات شبانه، پشتیبانی اورژانسی تدارک دیده شده است.',
  },
];

interface PlanItem {
  id: string;
  name: string;
  price: string;
  period: string;
  description: string;
  isPopular?: boolean;
  features: string[];
}

const PLANS: PlanItem[] = [
  {
    id: 'free',
    name: 'طرح آغازین (رایگان)',
    price: '۰',
    period: 'همیشگی',
    description: 'مناسب برای کافه‌ها و کیوسک‌های کوچک که تازه کسب‌و‌کار خود را راه‌اندازی کرده‌اند و منوی دیجیتال ساده می‌خواهند.',
    features: [
      'تعریف تا ۵۰ محصول متمایز',
      'دسته‌بندی نامحدود اقلام منو',
      'ایجاد کدهای QR پایه جهت اسکن عمومی',
      'مشاهده آنلاین منو با لود فوق‌العاده سریع',
      'امکان درج توضیحات و گالری عکس محصول',
      'پشتیبانی آنلاین از طریق تیکت',
    ],
  },
  {
    id: 'growth',
    name: 'طرح رشد (حرفه‌ای)',
    price: '۵۵۰,۰۰۰',
    period: 'ماهانه',
    description: 'پیشنهاد اصلی برای کافه‌ها و رستوران‌های پرمخاطب که خواهان تجربه کامل سفارش‌گیری هوشمند بدون واسطه هستند.',
    isPopular: true,
    features: [
      'محصولات نامحدود بدون سقف دسته‌بندی',
      'سیستم ثبت سفارش مستقیم و مدیریت سبد خرید خریدار',
      'کدهای QR مجزا و اختصاصی برای تک‌تک میزها',
      'اتصال مستقیم به درگاه پرداخت بانکی بدون واسطه',
      'قابلیت اتصال به چاپگر حرارتی آشپزخانه',
      'اتصال به دامنه اختصاصی شخصی',
      'پنل پیامک اطلاع‌رسانی خودکار وضعیت سفارش',
      'پشتیبانی اولویت‌دار تلفنی و آنلاین',
      'دریافت کارمزد دقیقا ۰٪ روی تمام سفارش‌ها',
    ],
  },
];

interface LandingPageProps {
  onLoginClick: () => void;
  onStartFreeClick: () => void;
  onNavigateFeatures?: () => void;
  onNavigateSolutions?: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ 
  onLoginClick, 
  onStartFreeClick, 
  onNavigateFeatures,
  onNavigateSolutions
}) => {
  // Navigation tabs state
  const [activeTemplateId, setActiveTemplateId] = useState<string>('cafe');
  const [activeFaqId, setActiveFaqId] = useState<string | null>(null);

  // Responsive device checks
  const [isMobileDevice, setIsMobileDevice] = useState(false);

  // Ref for the Interactive Hero Container (Intersection Observer)
  const heroRef = useRef<HTMLDivElement | null>(null);
  const [isHeroInView, setIsHeroInView] = useState(true);

  // States for the Real-time Sync Simulation (Studio / Creator Side)
  const [basePrice, setBasePrice] = useState<number>(340000);
  const [isDiscountActive, setIsDiscountActive] = useState<boolean>(false);
  const [isAvailable, setIsAvailable] = useState<boolean>(true);

  // States for the Real-time Sync Simulation (Customer Side - delayed update after sync)
  const [customerPrice, setCustomerPrice] = useState<number>(340000);
  const [isCustomerDiscountActive, setIsCustomerDiscountActive] = useState<boolean>(false);
  const [isCustomerAvailable, setIsCustomerAvailable] = useState<boolean>(true);

  // Success sync flash message on the customer phone
  const [customerSyncAlert, setCustomerSyncAlert] = useState<string | null>(null);
  
  // Track if the user interacted with the hero controls
  const [isUserInteracted, setIsUserInteracted] = useState<boolean>(false);
  
  // State for automatic simulation flow (when not interacted)
  const [autoSimPhase, setAutoSimPhase] = useState<'idle' | 'cursor-gliding' | 'edited' | 'pulsing' | 'synced'>('idle');
  const [autoSimCount, setAutoSimCount] = useState<number>(1);
  const [syncPulseTrigger, setSyncPulseTrigger] = useState<number>(0);

  // For manual action triggers (displays glowing line briefly)
  const [isManualSyncing, setIsManualSyncing] = useState<boolean>(false);

  // Intersection Observer to pause/play auto simulation based on viewport visibility
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsHeroInView(entry.isIntersecting);
      },
      { threshold: 0.1 }
    );

    if (heroRef.current) {
      observer.observe(heroRef.current);
    }

    const checkMobile = () => setIsMobileDevice(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);

    return () => {
      observer.disconnect();
      window.removeEventListener('resize', checkMobile);
    };
  }, []);

  // Automatic simulation loop: runs ONLY if user hasn't interacted and hero is in viewport
  useEffect(() => {
    if (isUserInteracted || !isHeroInView) return;

    let timerA: any;
    let timerB: any;
    let timerC: any;
    let timerD: any;
    let timerReset: any;

    const runAutoIteration = () => {
      setAutoSimPhase('idle');
      
      // Step A: Glide cursor to toggle discount on Studio side
      timerA = setTimeout(() => {
        setAutoSimPhase('cursor-gliding');
      }, 1000);

      // Step B: Trigger Click ripple & Toggle state on Studio Phone ONLY
      timerB = setTimeout(() => {
        setAutoSimPhase('edited');
        setIsDiscountActive(true);
      }, 2300);

      // Step C: Trigger active sync pulsing dot across path
      timerC = setTimeout(() => {
        setAutoSimPhase('pulsing');
        setSyncPulseTrigger(prev => prev + 1);
      }, 3000);

      // Step D: Synced! Customer Phone updates with smooth pop animation and success message
      timerD = setTimeout(() => {
        setAutoSimPhase('synced');
        setIsCustomerDiscountActive(true);
        setCustomerSyncAlert('تخفیف منو اعمال شد!');
        setAutoSimCount(prev => prev + 1);
        
        // Hide success alert after 1.5s
        timerReset = setTimeout(() => {
          setCustomerSyncAlert(null);
        }, 1500);
      }, 3800);
    };

    // Run first iteration shortly after mount
    runAutoIteration();

    // Set interval for continuous loop (every 8.5s)
    const interval = setInterval(() => {
      // Clear active states to reset visual to normal before restarting glide
      setIsDiscountActive(false);
      setIsCustomerDiscountActive(false);
      setCustomerSyncAlert(null);
      runAutoIteration();
    }, 8500);

    return () => {
      clearInterval(interval);
      clearTimeout(timerA);
      clearTimeout(timerB);
      clearTimeout(timerC);
      clearTimeout(timerD);
      clearTimeout(timerReset);
    };
  }, [isUserInteracted, isHeroInView]);

  // Framer Motion parallax scroll effects
  const { scrollY } = useScroll();
  const yStudioPhone = useTransform(scrollY, [0, 800], [0, isMobileDevice ? 0 : -35]);
  const yCustomerPhone = useTransform(scrollY, [0, 800], [0, isMobileDevice ? 0 : 35]);

  // Helper trigger for manual synchronizer animation
  const triggerManualSyncAnimation = (onComplete: () => void, alertMsg?: string) => {
    setIsManualSyncing(true);
    setSyncPulseTrigger(prev => prev + 1);
    
    // Finish syncing after curved path transit time (approx 650ms)
    setTimeout(() => {
      setIsManualSyncing(false);
      onComplete();
      if (alertMsg) {
        setCustomerSyncAlert(alertMsg);
        setTimeout(() => setCustomerSyncAlert(null), 1500);
      }
    }, 650);
  };

  // Handle Manual Interaction on Studio side controls
  const handleToggleDiscountManual = () => {
    setIsUserInteracted(true);
    const nextState = !isDiscountActive;
    
    // 1. Instantly trigger state change on studio side
    setIsDiscountActive(nextState);
    triggerManualSyncAnimation(() => {
      setIsCustomerDiscountActive(nextState);
    }, nextState ? 'تخفیف ۱۵٪ منو اعمال شد!' : 'تخفیف منو حذف شد!');
  };

  const handleToggleAvailabilityManual = () => {
    setIsUserInteracted(true);
    const nextState = !isAvailable;
    
    // 1. Instantly trigger state change on studio side
    setIsAvailable(nextState);
    triggerManualSyncAnimation(() => {
      setIsCustomerAvailable(nextState);
    }, nextState ? 'موجودی سالن فعال شد!' : 'اتمام موجودی اعمال شد!');
  };

  const handlePriceChangeManual = (amount: number) => {
    setIsUserInteracted(true);
    let nextPrice = 340000;
    setBasePrice(prev => {
      const computed = prev + amount;
      nextPrice = Math.max(250000, Math.min(computed, 450000));
      return nextPrice;
    });
    
    // Trigger sync pulse, update customer price after transition complete
    triggerManualSyncAnimation(() => {
      setCustomerPrice(nextPrice);
    }, 'قیمت منو با موفقیت بروز شد!');
  };

  // Derived current state for calculations
  const finalPrice = isDiscountActive ? Math.round(basePrice * 0.85) : basePrice;
  const customerFinalPrice = isCustomerDiscountActive ? Math.round(customerPrice * 0.85) : customerPrice;

  // Render prices in Persian numerals format
  const formatPersianPrice = (num: number) => {
    return num.toLocaleString('fa-IR');
  };

  // Spring animations preset
  const smoothSpring = { type: 'spring', damping: 25, stiffness: 220 };
  const bouncySpring = { type: 'spring', damping: 15, stiffness: 350 };

  return (
    <div className="min-h-screen bg-[#F8F9FA] text-[#18181B] font-['Vazirmatn'] selection:bg-[#10b981]/15 selection:text-[#10b981] overflow-x-hidden leading-relaxed">
      
      {/* ==========================================
          SECTION 2: INTERACTIVE HERO SECTION
         ========================================== */}
      <header ref={heroRef} id="hero" className="relative py-16 lg:py-24 border-b border-slate-200/50 bg-[#F8F9FA] overflow-hidden">
        {/* Cinematic ambient background glow and stage atmosphere */}
        <div className="absolute top-1/2 left-1/3 w-[600px] h-[600px] -translate-y-1/2 bg-gradient-radial from-emerald-500/5 to-transparent rounded-full blur-[120px] pointer-events-none z-0 animate-pulse" />
        <div className="absolute -top-40 right-1/4 w-[400px] h-[400px] bg-emerald-600/5 rounded-full blur-[100px] pointer-events-none z-0" />

        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center relative z-10">
          
          {/* Copy Column (Right side in RTL, comes first vertically on mobile) */}
          <StaggerGroup className="lg:col-span-5 text-right flex flex-col items-start lg:items-start justify-center z-10 order-1 lg:order-1">
            {/* Elegant Micro-badge tag (RTL) */}
            <StaggerChild>
              <div className="inline-flex items-center gap-2 bg-emerald-500/10 text-emerald-800 px-4 py-1.5 rounded-full border border-emerald-500/15 text-[11px] font-black tracking-wide mb-6">
                <Sparkles className="w-3.5 h-3.5 text-emerald-600 animate-pulse" />
                <span>منوی دیجیتال و سفارش‌گیری مستقیم برای کافه و رستوران</span>
              </div>
            </StaggerChild>

            {/* Main Headline (Enforcing <= 3 lines wrap limit on desktop) */}
            <StaggerChild>
              <h1 className="text-3xl sm:text-4xl md:text-5xl xl:text-[54px] font-black text-slate-900 tracking-tight leading-[1.1] mb-5 max-w-2xl text-right">
                منوی دیجیتال خودت را بساز؛
                <br />
                <span className="text-[#10b981]">سفارش مستقیم</span> بگیر
              </h1>
            </StaggerChild>

            {/* Accent sub-headline highlighting sync speed */}
            <StaggerChild>
              <p className="text-emerald-600 text-base sm:text-lg md:text-xl font-bold mb-4 tracking-tight leading-snug">
                هر تغییری، همان لحظه برای مشتری منتشر می‌شود
              </p>
            </StaggerChild>

            {/* Secondary supporting copy */}
            <StaggerChild>
              <p className="text-sm sm:text-base text-slate-500 mb-8 leading-relaxed max-w-[48ch] text-right font-medium">
                محصولات، قیمت‌ها، موجودی و ظاهر منو را بدون کدنویسی مدیریت کن و سفارش‌های مشتریان را مستقیم در پنل ویترین دریافت کن.
              </p>
            </StaggerChild>

            {/* CTAs Group */}
            <StaggerChild className="w-full">
              <div className="flex flex-wrap gap-4 items-center w-full justify-start">
                <MotionButton 
                  id="hero-cta-main"
                  onClick={onStartFreeClick}
                  className="px-8 py-4 bg-[#10b981] hover:bg-emerald-600 text-white rounded-2xl text-sm font-black shadow-[0_12px_24px_-8px_rgba(16,185,129,0.35)] hover:shadow-[0_16px_32px_-6px_rgba(16,185,129,0.45)] active:scale-95 transition-all flex items-center gap-2.5 group cursor-pointer border-0"
                >
                  <span>ساخت اولین منو</span>
                  <span className="w-6 h-6 rounded-full bg-white/15 flex items-center justify-center transition-transform group-hover:translate-x-[-3px]">
                    <ChevronLeft className="w-4 h-4 text-white" />
                  </span>
                </MotionButton>
                
                <a 
                  href="#how-it-works"
                  className="px-6 py-4 bg-white hover:bg-slate-50 text-slate-800 border border-slate-200 rounded-2xl text-xs font-black active:scale-95 transition-all flex items-center gap-2.5 group shadow-sm"
                >
                  <span className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center transition-transform group-hover:scale-105">
                    <Play className="w-2.5 h-2.5 fill-slate-800 text-slate-800" />
                  </span>
                  <span>دموی تعاملی ۶۰ ثانیه‌ای</span>
                </a>
              </div>

              {/* Tiny trust row / assurance row */}
              <div className="text-[11px] text-slate-400 font-medium tracking-wide mt-5 flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-[#10b981] shrink-0" />
                <span>بدون نیاز به دانش فنی</span>
                <span className="text-slate-300">•</span>
                <Check className="w-3.5 h-3.5 text-[#10b981] shrink-0" />
                <span>انتشار فوری</span>
                <span className="text-slate-300">•</span>
                <Check className="w-3.5 h-3.5 text-[#10b981] shrink-0" />
                <span>سفارش مستقیم</span>
              </div>
            </StaggerChild>
          </StaggerGroup>

          {/* Staged Sync Scene Column (Left side in RTL, comes second vertically on mobile) */}
          <div className="lg:col-span-7 flex flex-col lg:flex-row items-center justify-center gap-6 lg:gap-4 relative min-h-[500px] order-2 lg:order-2 select-none">
            
            {/* Top Annotation capsule */}
            <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-white/95 backdrop-blur-md px-5 py-2 rounded-full border border-slate-200/60 shadow-md flex items-center gap-2.5 z-30 select-none">
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span className="text-[11px] font-black text-slate-700 tracking-wide">نتیجه تغییرات را همان لحظه روی موبایل مشتری ببین</span>
            </div>

            {/* Left Column contents: 2 device mockups + elegant link bridge */}
            <div className="flex flex-col md:flex-row items-center justify-center gap-8 lg:gap-6 relative w-full mt-6">
              
              {/* Device 1: STUDIO PHONE (Dominant, darker, editing controls - Right side in RTL layout) */}
              <motion.div 
                style={{ y: yStudioPhone }}
                animate={{
                  y: [0, -6, 0],
                }}
                transition={{
                  duration: 6,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="w-full max-w-[290px] bg-slate-950/5 p-2 rounded-[2.8rem] ring-1 ring-black/5 shadow-2xl relative z-10 order-1 md:order-2 shrink-0"
              >
                <div className="bg-[#090D0B] rounded-[2.5rem] border-[6px] border-[#18231E] relative overflow-hidden ring-1 ring-emerald-500/10 shadow-inner">
                  {/* Notch */}
                  <div className="absolute top-2 left-1/2 -translate-x-1/2 w-24 h-4 bg-[#18231E] rounded-full z-30 flex items-center justify-center">
                    <div className="w-10 h-1 bg-slate-800 rounded-full mb-1" />
                  </div>

                  {/* Status / Workspace Header */}
                  <div className="bg-[#0C1410] text-white pt-7 pb-2.5 px-4 flex items-center justify-between text-[9px] font-bold border-b border-emerald-950/20 relative z-20">
                    <div className="flex items-center gap-1.5 text-[#10b981]">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#10b981] animate-pulse" />
                      <span className="font-black">استودیوی طراحی ویترین</span>
                    </div>
                    <div className="text-[8px] text-slate-500 font-mono">WORKSPACE_LIVE</div>
                  </div>

                  {/* Designer Screen Content */}
                  <div className="bg-[#0A0E0C] p-3.5 h-[360px] overflow-hidden flex flex-col justify-between select-none relative">
                    
                    {/* Control Panel Panel */}
                    <div className="space-y-2.5 bg-[#111815] border border-emerald-500/10 rounded-2xl p-3 relative z-10 text-right">
                      <span className="text-[9px] text-emerald-500/70 font-black block mb-1 border-b border-emerald-950/30 pb-1.5">جعبه ابزار ویرایش منو</span>
                      
                      {/* Toggle 1: Discount */}
                      <div className="flex items-center justify-between">
                        <button 
                          onClick={handleToggleDiscountManual}
                          className={`w-9 h-5 rounded-full p-0.5 transition-colors duration-300 outline-none flex items-center border-0 cursor-pointer ${isDiscountActive ? 'bg-[#10b981] justify-end' : 'bg-slate-800 justify-start'}`}
                        >
                          <motion.div layout className="w-4 h-4 rounded-full bg-white shadow-xs" />
                        </button>
                        <span className="text-[10px] font-bold text-slate-200">تخفیف ویژه ۱۵٪</span>
                      </div>

                      {/* Toggle 2: Availability */}
                      <div className="flex items-center justify-between">
                        <button 
                          onClick={handleToggleAvailabilityManual}
                          className={`w-9 h-5 rounded-full p-0.5 transition-colors duration-300 outline-none flex items-center border-0 cursor-pointer ${isAvailable ? 'bg-[#10b981] justify-end' : 'bg-slate-800 justify-start'}`}
                        >
                          <motion.div layout className="w-4 h-4 rounded-full bg-white shadow-xs" />
                        </button>
                        <span className="text-[10px] font-bold text-slate-200">موجودی در سالن</span>
                      </div>

                      {/* Control 3: Price Changer */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5">
                          <button 
                            onClick={() => handlePriceChangeManual(10000)}
                            className="w-5 h-5 bg-slate-800 hover:bg-slate-700 active:scale-90 rounded-md flex items-center justify-center text-xs text-slate-100 border-0 cursor-pointer font-bold transition-all"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                          <span className="text-[10px] font-mono font-bold text-emerald-400 w-16 text-center">
                            {formatPersianPrice(basePrice)}
                          </span>
                          <button 
                            onClick={() => handlePriceChangeManual(-10000)}
                            className="w-5 h-5 bg-slate-800 hover:bg-slate-700 active:scale-90 rounded-md flex items-center justify-center text-xs text-slate-100 border-0 cursor-pointer font-bold transition-all"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                        </div>
                        <span className="text-[10px] font-bold text-slate-200">تغییر قیمت پایه (تومان)</span>
                      </div>
                    </div>

                    {/* Food Card Preview in Editor */}
                    <div className="bg-[#121A16] border border-emerald-500/10 rounded-xl p-2 flex flex-col justify-between h-[165px]">
                      {/* Image Preview with overlay */}
                      <div className="h-18 w-full rounded-lg overflow-hidden relative bg-emerald-950">
                        <img 
                          src="https://images.unsplash.com/photo-1628840042765-356cda07504e?w=500&auto=format&fit=crop&q=60" 
                          alt="" 
                          className="w-full h-full object-cover opacity-75" 
                          referrerPolicy="no-referrer"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#0A0E0C]/90 to-transparent" />
                        <div className="absolute bottom-1 right-2 text-right">
                          <span className="text-[7px] bg-[#10b981] text-white px-1.5 py-0.5 rounded-sm font-black">پیتزا پرفروش</span>
                        </div>

                        {/* Interactive Discount Tag */}
                        <AnimatePresence>
                          {isDiscountActive && (
                            <motion.div
                              initial={{ scale: 0, opacity: 0 }}
                              animate={{ scale: 1, opacity: 1 }}
                              exit={{ scale: 0, opacity: 0 }}
                              className="absolute top-1 left-1 bg-red-500 text-white text-[8px] px-1.5 py-0.5 rounded font-black shadow-md border border-red-400/20"
                            >
                              ۱۵٪ تخفیف
                            </motion.div>
                          )}
                        </AnimatePresence>

                        {/* Availability overlay */}
                        {!isAvailable && (
                          <div className="absolute inset-0 bg-black/70 backdrop-blur-[1px] flex items-center justify-center">
                            <span className="text-[9px] text-red-400 font-black border border-red-500/30 px-2 py-0.5 rounded bg-red-500/10">ناموجود در سالن</span>
                          </div>
                        )}
                      </div>

                      {/* Metadata info */}
                      <div className="text-right mt-1 flex-1 flex flex-col justify-between">
                        <div>
                          <h4 className="text-[10px] font-black text-slate-100 leading-none">پیتزا پپرونی تند</h4>
                          <p className="text-[8px] text-slate-400 mt-1.5 leading-tight line-clamp-1">کوکتل پپرونی، پنیر موزارلا، سس مخصوص تند طبیعی</p>
                        </div>

                        <div className="flex justify-between items-center mt-1.5 pt-1.5 border-t border-emerald-950/40">
                          <span className="text-[8px] text-slate-500">قیمت نهایی منو</span>
                          <div className="text-left font-mono">
                            <span className={`text-[9px] font-black leading-none ${isDiscountActive ? 'text-red-400 line-through mr-1 opacity-60' : 'text-[#10b981]'}`}>
                              {formatPersianPrice(basePrice)}
                            </span>
                            {isDiscountActive && (
                              <span className="text-[10px] font-black text-[#10b981] leading-none">
                                {formatPersianPrice(finalPrice)}
                              </span>
                            )}
                            <span className="text-[7px] text-slate-500 mr-0.5 font-sans">تومان</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Automatic Simulator State Indicators */}
                    <div className="pt-2.5 flex items-center justify-between text-[8px] text-slate-500 border-t border-emerald-950/20">
                      <span>
                        {isUserInteracted ? 'کنترل دستی شما فعال است' : `همگام‌سازی شماره ${autoSimCount}`}
                      </span>
                      <span className="flex items-center gap-1 text-[#10b981]">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#10b981] animate-pulse" />
                        <span>ذخیره فوری</span>
                      </span>
                    </div>

                    {/* Cursor Simulation Overlay */}
                    {!isUserInteracted && autoSimPhase === 'edited' && (
                      <motion.div 
                        initial={{ scale: 0, opacity: 1 }}
                        animate={{ scale: 2, opacity: 0 }}
                        transition={{ duration: 0.5, ease: "easeOut" }}
                        className="absolute w-8 h-8 rounded-full border-2 border-[#10b981] pointer-events-none z-50"
                        style={{ left: 198, top: 42 }}
                      />
                    )}

                    {!isUserInteracted && (
                      <motion.div 
                        variants={{
                          idle: { x: 200, y: 260, opacity: 0, scale: 1 },
                          'cursor-gliding': { 
                            x: 214, 
                            y: 54, 
                            opacity: 1, 
                            scale: 1,
                            transition: { duration: 1.2, ease: PRIMARY_EASE } 
                          },
                          edited: { 
                            x: 214, 
                            y: 54, 
                            opacity: 1, 
                            scale: 0.85,
                            transition: { duration: 0.1, ease: "easeOut" } 
                          },
                          pulsing: { 
                            x: 80, 
                            y: 120, 
                            opacity: 0, 
                            scale: 1,
                            transition: { duration: 0.5, ease: "easeIn" } 
                          },
                          synced: { x: 200, y: 260, opacity: 0 }
                        }}
                        animate={autoSimPhase}
                        className="absolute pointer-events-none z-50 text-[#10b981] drop-shadow-[0_0_6px_rgba(16,185,129,0.5)]"
                        style={{ left: 0, top: 0 }}
                      >
                        <MousePointerClick className="w-5 h-5 fill-[#10b981]" />
                        <span className="absolute -top-1 -left-1 w-6 h-6 bg-[#10b981]/25 rounded-full animate-ping pointer-events-none" />
                      </motion.div>
                    )}
                  </div>

                  {/* Lower device footer indicator */}
                  <div className="bg-[#0C1410] p-2 text-center border-t border-emerald-900/15 text-[8px] text-slate-500 font-bold flex justify-between items-center px-4">
                    <span>پایگاه داده ابری</span>
                    <span className="text-[#10b981] flex items-center gap-1">
                      <span>سایت روی ابر زنده است</span>
                      <span className="w-1.5 h-1.5 rounded-full bg-[#10b981]" />
                    </span>
                  </div>
                </div>
              </motion.div>

              {/* Sync Connector (High-Fidelity Multi-Strand Fiber-Optic Data Cables) */}
              <div className="hidden md:flex flex-col items-center justify-center w-36 h-24 relative z-20 shrink-0 order-2 -mx-4">
                <svg width="100%" height="100%" viewBox="0 0 160 80" fill="none" className="overflow-visible">
                  <defs>
                    <linearGradient id="cable-gradient-1" x1="100%" y1="0%" x2="0%" y2="0%">
                      <stop offset="0%" stopColor="#34d399" stopOpacity="0" />
                      <stop offset="50%" stopColor="#10b981" stopOpacity="1" />
                      <stop offset="100%" stopColor="#059669" stopOpacity="0" />
                    </linearGradient>
                    <linearGradient id="cable-gradient-2" x1="100%" y1="0%" x2="0%" y2="0%">
                      <stop offset="0%" stopColor="#60a5fa" stopOpacity="0" />
                      <stop offset="50%" stopColor="#3b82f6" stopOpacity="1" />
                      <stop offset="100%" stopColor="#1d4ed8" stopOpacity="0" />
                    </linearGradient>
                    <filter id="glow-filter" x="-20%" y="-20%" width="140%" height="140%">
                      <feGaussianBlur stdDeviation="2" result="blur" />
                      <feComposite in="SourceGraphic" in2="blur" operator="over" />
                    </filter>
                  </defs>

                  {/* Physical multi-strand cable backgrounds (metallic outer casing) */}
                  <path 
                    d="M 160 25 C 110 5, 50 65, 0 25" 
                    stroke="#1e293b" 
                    strokeWidth="3" 
                    strokeOpacity="0.1"
                  />
                  <path 
                    d="M 160 40 C 110 15, 50 55, 0 40" 
                    stroke="#1e293b" 
                    strokeWidth="4" 
                    strokeOpacity="0.15"
                  />
                  <path 
                    d="M 160 55 C 110 25, 50 45, 0 55" 
                    stroke="#1e293b" 
                    strokeWidth="3" 
                    strokeOpacity="0.1"
                  />

                  {/* Core fiber lines */}
                  <path 
                    d="M 160 25 C 110 5, 50 65, 0 25" 
                    stroke="#059669" 
                    strokeWidth="1" 
                    strokeOpacity="0.3"
                  />
                  <path 
                    d="M 160 40 C 110 15, 50 55, 0 40" 
                    stroke="#3b82f6" 
                    strokeWidth="1.2" 
                    strokeOpacity="0.3"
                  />
                  <path 
                    d="M 160 55 C 110 25, 50 45, 0 55" 
                    stroke="#10b981" 
                    strokeWidth="1" 
                    strokeOpacity="0.3"
                  />
                  
                  {/* Glowing Laser Pulses traveling leftward on sync pulse */}
                  <motion.path 
                    key={`pulse-cable-top-${syncPulseTrigger}`}
                    d="M 160 25 C 110 5, 50 65, 0 25" 
                    stroke="url(#cable-gradient-1)" 
                    strokeWidth="2.5" 
                    strokeLinecap="round"
                    strokeDasharray="25 135"
                    filter="url(#glow-filter)"
                    initial={{ strokeDashoffset: 160 }}
                    animate={{ strokeDashoffset: 0 }}
                    transition={{ duration: 0.65, ease: "easeInOut" }}
                  />
                  <motion.path 
                    key={`pulse-cable-mid-${syncPulseTrigger}`}
                    d="M 160 40 C 110 15, 50 55, 0 40" 
                    stroke="url(#cable-gradient-2)" 
                    strokeWidth="3" 
                    strokeLinecap="round"
                    strokeDasharray="35 125"
                    filter="url(#glow-filter)"
                    initial={{ strokeDashoffset: 160 }}
                    animate={{ strokeDashoffset: 0 }}
                    transition={{ duration: 0.55, ease: "easeInOut", delay: 0.05 }}
                  />
                  <motion.path 
                    key={`pulse-cable-bot-${syncPulseTrigger}`}
                    d="M 160 55 C 110 25, 50 45, 0 55" 
                    stroke="url(#cable-gradient-1)" 
                    strokeWidth="2.5" 
                    strokeLinecap="round"
                    strokeDasharray="20 140"
                    filter="url(#glow-filter)"
                    initial={{ strokeDashoffset: 160 }}
                    animate={{ strokeDashoffset: 0 }}
                    transition={{ duration: 0.7, ease: "easeInOut", delay: 0.08 }}
                  />
                </svg>
                
                {/* Elevated LIVE Synchronizer Status Pill */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white/95 text-[#10b981] text-[9px] px-3.5 py-1.5 rounded-full font-black border border-emerald-500/15 shadow-md flex items-center gap-1.5 select-none shrink-0 whitespace-nowrap z-30">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#10b981] animate-ping" />
                  <span>خط انتقال داده ابری</span>
                </div>
              </div>

              {/* Mobile Only Vertical Link Connection (Multi-Strand) */}
              <div className="md:hidden flex flex-col items-center justify-center my-3 relative z-20 order-2">
                <svg width="40" height="80" viewBox="0 0 40 80" fill="none" className="overflow-visible">
                  <defs>
                    <linearGradient id="v-cable-grad" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor="#10b981" stopOpacity="0" />
                      <stop offset="50%" stopColor="#10b981" stopOpacity="1" />
                      <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                  {/* Background cables */}
                  <path 
                    d="M 15 0 C 5 25, 35 55, 15 80" 
                    stroke="#1e293b" 
                    strokeWidth="2" 
                    strokeOpacity="0.1"
                  />
                  <path 
                    d="M 25 0 C 15 25, 25 55, 25 80" 
                    stroke="#1e293b" 
                    strokeWidth="2.5" 
                    strokeOpacity="0.1"
                  />
                  {/* Front cables */}
                  <path 
                    d="M 15 0 C 5 25, 35 55, 15 80" 
                    stroke="#10b981" 
                    strokeWidth="0.8" 
                    strokeOpacity="0.3"
                  />
                  <path 
                    d="M 25 0 C 15 25, 25 55, 25 80" 
                    stroke="#3b82f6" 
                    strokeWidth="0.8" 
                    strokeOpacity="0.3"
                  />
                  
                  {/* Pulses */}
                  <motion.path 
                    key={`pulse-v-1-${syncPulseTrigger}`}
                    d="M 15 0 C 5 25, 35 55, 15 80" 
                    stroke="url(#v-cable-grad)" 
                    strokeWidth="2" 
                    strokeDasharray="20 60"
                    initial={{ strokeDashoffset: 80 }}
                    animate={{ strokeDashoffset: 0 }}
                    transition={{ duration: 0.6, ease: "easeInOut" }}
                  />
                  <motion.path 
                    key={`pulse-v-2-${syncPulseTrigger}`}
                    d="M 25 0 C 15 25, 25 55, 25 80" 
                    stroke="url(#v-cable-grad)" 
                    strokeWidth="2" 
                    strokeDasharray="15 65"
                    initial={{ strokeDashoffset: 80 }}
                    animate={{ strokeDashoffset: 0 }}
                    transition={{ duration: 0.5, ease: "easeInOut", delay: 0.05 }}
                  />
                </svg>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white text-[#10b981] text-[8px] px-2.5 py-0.5 rounded-full font-black border border-emerald-500/15 shadow-sm whitespace-nowrap z-30">
                  <span>همگام‌سازی آنی ابری</span>
                </div>
              </div>

              {/* Device 2: CUSTOMER PHONE (Slightly smaller, lighter theme, customer-facing menu - Left side in RTL) */}
              <motion.div 
                style={{ y: yCustomerPhone }}
                animate={{
                  y: [0, 6, 0],
                }}
                transition={{
                  duration: 6,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 0.5,
                }}
                className="w-full max-w-[260px] bg-slate-200/40 p-2 rounded-[2.8rem] ring-1 ring-slate-200/50 shadow-xl relative z-10 order-3 shrink-0"
              >
                <div className="bg-white rounded-[2.5rem] border-[6px] border-slate-100 relative overflow-hidden ring-1 ring-black/5 shadow-inner">
                  {/* Notch */}
                  <div className="absolute top-2 left-1/2 -translate-x-1/2 w-24 h-4 bg-slate-200 rounded-full z-30 flex items-center justify-center">
                    <div className="w-10 h-1 bg-slate-300 rounded-full mb-1" />
                  </div>

                  {/* Status Bar */}
                  <div className="bg-[#F8F9FA] text-slate-800 pt-7 pb-2.5 px-4 flex items-center justify-between text-[9px] font-bold border-b border-slate-100 relative z-20">
                    <div className="flex items-center gap-1.5 text-[#10b981]">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#10b981] animate-ping" />
                      <span className="font-extrabold text-[#0f766e]">زنده روی مرورگر مشتری</span>
                    </div>
                    <div className="text-[8px] text-slate-400 font-mono">12:45</div>
                  </div>

                  {/* Live Menu viewport */}
                  <div className="bg-[#F3F4F6] p-3 h-[360px] overflow-hidden flex flex-col justify-between relative">
                    
                    {/* Customer Sync Flash Alert */}
                    <AnimatePresence>
                      {customerSyncAlert && (
                        <motion.div
                          initial={{ opacity: 0, y: -10, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: -10, scale: 0.95 }}
                          className="absolute top-2 left-3 right-3 bg-emerald-500 text-white text-[9px] py-1.5 px-3 rounded-lg font-black shadow-lg shadow-emerald-500/20 text-center flex items-center justify-center gap-1.5 z-40"
                        >
                          <Zap className="w-3 h-3 text-white fill-white shrink-0 animate-bounce" />
                          <span>{customerSyncAlert}</span>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    <div className="space-y-2.5">
                      {/* Interactive Category Chips */}
                      <div className="flex gap-1 overflow-hidden mb-0.5">
                        <span className="px-3 py-1 bg-[#10b981] text-white rounded-lg text-[8px] font-black shadow-xs">پیتزا</span>
                        <span className="px-3 py-1 bg-white text-slate-500 border border-slate-200/50 rounded-lg text-[8px] font-bold">برگر</span>
                        <span className="px-3 py-1 bg-white text-slate-500 border border-slate-200/50 rounded-lg text-[8px] font-bold">سالاد</span>
                      </div>

                      {/* Synced Product Card */}
                      <div className="bg-white border border-slate-100 rounded-xl p-2.5 shadow-xs flex flex-col gap-2 relative">
                        {/* Pizza image */}
                        <div className="h-18 w-full rounded-lg overflow-hidden relative bg-slate-100">
                          <img 
                            src="https://images.unsplash.com/photo-1628840042765-356cda07504e?w=500&auto=format&fit=crop&q=60" 
                            alt="" 
                            className="w-full h-full object-cover" 
                            referrerPolicy="no-referrer"
                          />

                          {/* Synced Discount Pop Tag */}
                          <AnimatePresence>
                            {isCustomerDiscountActive && (
                              <motion.div
                                initial={{ scale: 0, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                exit={{ scale: 0, opacity: 0 }}
                                className="absolute top-1 left-1 bg-red-500 text-white text-[8px] px-1.5 py-0.5 rounded font-black shadow-md shadow-red-500/20"
                              >
                                ۱۵٪ تخفیف
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>

                        {/* Text / Price container */}
                        <div className="text-right flex flex-col justify-between">
                          <div>
                            <div className="flex justify-between items-start">
                              <h4 className="text-[10px] font-black text-slate-800 leading-none">پیتزا پپرونی تند</h4>
                              <span className="text-[7px] bg-red-50 text-red-600 px-1 rounded-sm font-black border border-red-100/50">
                                <span>تند</span>
                              </span>
                            </div>
                            <p className="text-[8px] text-slate-400 mt-1.5 leading-tight line-clamp-1">کوکتل پپرونی، پنیر موزارلا، سس مخصوص تند طبیعی</p>
                          </div>

                          {/* Dynamic synced footer pricing and status button */}
                          <div className="flex justify-between items-center mt-2 pt-2 border-t border-slate-100">
                            {isCustomerAvailable ? (
                              <button className="w-5 h-5 bg-[#10b981] hover:bg-emerald-600 text-white rounded-md flex items-center justify-center text-xs font-black shadow-xs border-0 cursor-pointer">+</button>
                            ) : (
                              <span className="text-[8px] text-red-500 font-extrabold bg-red-50 border border-red-100 px-1.5 py-0.5 rounded-md">اتمام موجودی</span>
                            )}
                            
                            <div className="text-left font-mono">
                              <span className={`text-[10px] font-black leading-none ${isCustomerDiscountActive ? 'text-red-500 line-through mr-1 opacity-50' : 'text-slate-800'}`}>
                                {formatPersianPrice(customerPrice)}
                              </span>
                              {isCustomerDiscountActive && (
                                <span className="text-[10px] font-black text-red-600 leading-none">
                                  {formatPersianPrice(customerFinalPrice)}
                                </span>
                              )}
                              <span className="text-[7px] text-slate-500 mr-0.5 font-sans">تومان</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Fast-sync announcement note box */}
                      <div className="bg-emerald-50 border border-emerald-100 p-2.5 rounded-xl flex items-center gap-2 justify-between text-right">
                        <p className="text-[8px] text-slate-600 leading-tight">تغییر منو بدون ثانیه‌ای معطلی روی موبایل مشتریان اعمال می‌شود.</p>
                        <Zap className="w-3.5 h-3.5 text-[#10b981] shrink-0 animate-bounce" />
                      </div>
                    </div>

                    {/* Bottom customer nav with synced basket badge count */}
                    <div className="bg-white px-5 py-2 border-t border-slate-200/60 flex items-center justify-between text-slate-400 rounded-b-[1.8rem] -mx-3 -mb-3 shadow-sm">
                      <div className="flex flex-col items-center gap-0.5 text-[#10b981]">
                        <Layers className="w-4 h-4" />
                        <span className="text-[7px] font-black">منو</span>
                      </div>
                      <div className="relative flex flex-col items-center gap-0.5">
                        <span className="absolute -top-1.5 -right-2 bg-red-500 text-white text-[7px] w-3.5 h-3.5 rounded-full flex items-center justify-center font-bold border border-white">
                          {isCustomerDiscountActive ? '۱' : '۰'}
                        </span>
                        <ShoppingBag className="w-4 h-4 text-slate-500" />
                        <span className="text-[7px] font-bold">سبد خرید</span>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>

            </div>

          </div>

        </div>
      </header>

      {/* ==========================================
          SECTION 3: TRUST & PROOF STRIP
         ========================================== */}
      <TrustStripSection />

      {/* ==========================================
          SECTION 4: THREE-STEP WORKFLOW
         ========================================== */}
      <section id="how-it-works" className="py-12 lg:py-16 bg-[#F8F9FA] overflow-hidden">
        <div className="max-w-7xl mx-auto px-6">
          
          <Reveal variant="fadeUp" className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-[10px] uppercase tracking-[0.2em] font-black text-[#10b981] bg-[#10b981]/10 px-3.5 py-1 rounded-full border border-[#10b981]/15">مسیر راه‌اندازی منو</span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-[#18181B] tracking-tight mt-4 leading-none">سه قدم ساده تا تحول کامل منو</h2>
            <p className="text-[#71717A] mt-4 font-medium text-sm sm:text-base">بستر اختصاصی و مدرن سفارش‌گیری دیجیتال خود را بدون واسطه‌ها پایه‌ریزی کنید.</p>
          </Reveal>

          <StaggerGroup className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Step 1 Card */}
            <AnimatedCard className="bg-white p-6 md:p-8 rounded-[2rem] border border-slate-200/50 shadow-xs flex flex-col justify-between group hover:shadow-md transition-all duration-300">
              <div>
                <div className="flex justify-between items-center mb-6">
                  <div className="w-11 h-11 rounded-xl bg-emerald-50 text-[#10b981] flex items-center justify-center font-black text-lg border border-emerald-100">۱</div>
                  <Layout className="w-5 h-5 text-slate-400 group-hover:text-[#10b981] transition-colors" />
                </div>
                
                <h3 className="text-lg font-black text-slate-800 mb-2">منوی خود را بسازید</h3>
                <p className="text-xs sm:text-sm text-slate-500 leading-relaxed mb-6">محصولات، دسته‌بندی‌ها و اطلاعات کافه یا رستوران خود را به سادگی و به صورت کاملاً ویژوال در استودیو طراحی کنید.</p>
                
                {/* Visual UI Micro-mockup */}
                <div className="bg-slate-50 rounded-xl p-3 border border-slate-200/40 text-right space-y-1.5 select-none pointer-events-none mb-6">
                  <div className="h-6 bg-white rounded border border-slate-200/50 flex items-center justify-between px-2">
                    <span className="text-[8px] text-emerald-600 font-extrabold">برچسب: ویژه</span>
                    <span className="text-[9px] text-slate-700 font-black">پیتزا بیکن دودی</span>
                  </div>
                  <div className="h-6 bg-white rounded border border-slate-200/50 flex items-center justify-between px-2 opacity-75">
                    <span className="text-[8px] text-slate-400">برچسب: ندارد</span>
                    <span className="text-[9px] text-slate-600 font-bold">برگر زغالی کلاسیک</span>
                  </div>
                  <div className="h-6 bg-white rounded border border-slate-100 flex items-center justify-between px-2 opacity-40">
                    <span className="text-[8px] text-slate-300">برچسب: ندارد</span>
                    <span className="text-[9px] text-slate-400">سیب‌زمینی آلفردو</span>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 text-[11px] font-black text-[#10b981]">
                دست‌آورد: طراحی اختصاصی متناسب با برند شما
              </div>
            </AnimatedCard>

            {/* Step 2 Card */}
            <AnimatedCard className="bg-white p-6 md:p-8 rounded-[2rem] border border-slate-200/50 shadow-xs flex flex-col justify-between group hover:shadow-md transition-all duration-300">
              <div>
                <div className="flex justify-between items-center mb-6">
                  <div className="w-11 h-11 rounded-xl bg-emerald-50 text-[#10b981] flex items-center justify-center font-black text-lg border border-emerald-100">۲</div>
                  <QrCode className="w-5 h-5 text-slate-400 group-hover:text-[#10b981] transition-colors" />
                </div>
                
                <h3 className="text-lg font-black text-slate-800 mb-2">منتشرش کنید</h3>
                <p className="text-xs sm:text-sm text-slate-500 leading-relaxed mb-6">طرح نهایی منو را با یک کلیک روی دامنه اختصاصی خود یا کدهای QR میزها فعال کنید تا در دسترس مشتریان قرار گیرد.</p>
                
                {/* Visual UI Micro-mockup */}
                <div className="bg-slate-50 rounded-xl p-3 border border-slate-200/40 flex items-center justify-center mb-6 select-none pointer-events-none">
                  <div className="bg-white p-2 rounded-lg border border-slate-200 shadow-sm flex flex-col items-center gap-1.5 w-24">
                    <QrCode className="w-10 h-10 text-slate-800" />
                    <span className="text-[8px] font-black text-slate-700 bg-slate-100 px-1.5 py-0.5 rounded">میز شماره ۴</span>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 text-[11px] font-black text-[#10b981]">
                دست‌آورد: دسترسی آنی خریدار بدون نیاز به نصب اپلیکیشن
              </div>
            </AnimatedCard>

            {/* Step 3 Card */}
            <AnimatedCard className="bg-white p-6 md:p-8 rounded-[2rem] border border-slate-200/50 shadow-xs flex flex-col justify-between group hover:shadow-md transition-all duration-300">
              <div>
                <div className="flex justify-between items-center mb-6">
                  <div className="w-11 h-11 rounded-xl bg-emerald-50 text-[#10b981] flex items-center justify-center font-black text-lg border border-emerald-100">۳</div>
                  <ShoppingBag className="w-5 h-5 text-slate-400 group-hover:text-[#10b981] transition-colors" />
                </div>
                
                <h3 className="text-lg font-black text-slate-800 mb-2">سفارش‌ها را مدیریت کنید</h3>
                <p className="text-xs sm:text-sm text-slate-500 leading-relaxed mb-6">سفارش‌های ثبت‌شده مشتریان را با اطلاعات دقیق میز و پرداخت، مستقیماً در پنل مدیریت ویترین دریافت و پیگیری کنید.</p>
                
                {/* Visual UI Micro-mockup */}
                <div className="bg-slate-50 rounded-xl p-3 border border-slate-200/40 text-right space-y-2 mb-6 select-none pointer-events-none">
                  <div className="bg-emerald-50 border border-emerald-200/60 p-1.5 rounded flex items-center justify-between">
                    <span className="text-[8px] bg-[#10b981] text-white px-1.5 py-0.5 rounded font-black">در حال آماده‌سازی</span>
                    <div className="text-right">
                      <span className="text-[8px] text-slate-700 font-extrabold block">سفارش میز ۴</span>
                      <span className="text-[7px] text-slate-400 block">پیتزا پپرونی تند + پنیر اضافه</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 text-[11px] font-black text-[#10b981]">
                دست‌آورد: کاهش خطاهای سفارش‌گیری به صفر درصد
              </div>
            </AnimatedCard>

          </StaggerGroup>
        </div>
      </section>

      {/* ==========================================
          SECTION 5: CUSTOMER ORDERING JOURNEY (Premium Redesigned Process Stack)
         ========================================== */}
      <CustomerJourney />

      {/* ==========================================
          SECTION 6: PRODUCT MANAGEMENT SHOWCASE (Dark theme, highly professional)
         ========================================== */}
      <section className="py-12 lg:py-16 bg-[#0A0A0A] text-white overflow-hidden relative">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(16,185,129,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(16,185,129,0.02)_1px,transparent_1px)] bg-[size:32px_32px] opacity-40 pointer-events-none" />
        
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
            
            {/* Copy Side (Right in RTL) */}
            <Reveal variant="fadeRight" delay={0.1} className="lg:col-span-5 text-right z-10">
              <span className="text-[10px] uppercase tracking-[0.2em] font-black text-[#10b981] bg-[#10b981]/15 px-3.5 py-1.5 rounded-full border border-[#10b981]/20">مدیریت پیشرفته منو</span>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tight mt-6 leading-[1.2] text-white">کنترل همه‌جانبه مشخصات منو از پنل مدیریت</h2>
              <p className="text-slate-300 mt-6 leading-relaxed text-sm sm:text-base font-medium">
                در پنل ویرایشگر محصولات ویترین، گزینه‌های جانبی متعدد و مخلفات سفارش را به صورت زنده برای هر غذا تعریف کنید. قیمت‌ها، تخفیف‌ها، موجود بودن کالاها و برچسب‌های ویژه را با یک سوئیچ ساده تغییر دهید.
              </p>
              
              <div className="mt-8 space-y-4">
                <div className="flex items-center gap-3 justify-end">
                  <span className="text-xs sm:text-sm font-bold text-slate-200">تغییر فوری قیمت‌ها و اعمال خودکار تخفیف‌های زمان‌دار</span>
                  <div className="w-5 h-5 rounded-full bg-[#10b981]/25 text-[#10b981] flex items-center justify-center shrink-0 border border-[#10b981]/35">
                    <Check className="w-3 h-3 text-[#10b981]" />
                  </div>
                </div>
                <div className="flex items-center gap-3 justify-end">
                  <span className="text-xs sm:text-sm font-bold text-slate-200">تعریف افزودنی‌ها، طعم‌ها و شخصی‌سازی نهایی برای مشتری</span>
                  <div className="w-5 h-5 rounded-full bg-[#10b981]/25 text-[#10b981] flex items-center justify-center shrink-0 border border-[#10b981]/35">
                    <Check className="w-3 h-3 text-[#10b981]" />
                  </div>
                </div>
                <div className="flex items-center gap-3 justify-end">
                  <span className="text-xs sm:text-sm font-bold text-slate-200">اعلام زنده اتمام موجودی کالاها برای جلوگیری از خطای پیشخوان</span>
                  <div className="w-5 h-5 rounded-full bg-[#10b981]/25 text-[#10b981] flex items-center justify-center shrink-0 border border-[#10b981]/35">
                    <Check className="w-3 h-3 text-[#10b981]" />
                  </div>
                </div>
              </div>
            </Reveal>

            {/* Simulated UI Mockup (Left in RTL) */}
            <Reveal variant="fadeLeft" delay={0.25} className="lg:col-span-7 w-full flex items-center justify-center relative">
              <div className="w-full max-w-xl bg-slate-900 rounded-3xl border border-white/10 p-6 md:p-8 shadow-2xl relative">
                
                {/* Window Chrome Mac Controls */}
                <div className="flex items-center gap-1.5 mb-6 justify-end">
                  <span className="w-3 h-3 rounded-full bg-slate-800" />
                  <span className="w-3 h-3 rounded-full bg-slate-800" />
                  <span className="w-3 h-3 rounded-full bg-emerald-500/80" />
                  <span className="text-[10px] text-slate-500 mr-3 font-mono">PRODUCT_EDITOR_V2.TSX</span>
                </div>

                <div className="space-y-6">
                  {/* Grid Rows */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="text-right">
                      <label className="text-[10px] uppercase tracking-wider text-slate-500 font-extrabold block mb-2">نام محصول</label>
                      <div className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-xs text-white font-black text-right">
                        پیتزا پپرونی مخصوص زغالی
                      </div>
                    </div>
                    <div className="text-right">
                      <label className="text-[10px] uppercase tracking-wider text-slate-500 font-extrabold block mb-2">قیمت پایه (تومان)</label>
                      <div className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-xs text-[#10b981] font-black text-left font-mono">
                        ۳۴۰,۰۰۰
                      </div>
                    </div>
                  </div>

                  {/* Form Block 2 */}
                  <div className="bg-slate-950 rounded-2xl p-4 border border-slate-800/80 space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-[9px] bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded font-black flex items-center gap-1 border border-emerald-500/20">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                          موجود
                        </span>
                      </div>
                      <span className="text-xs font-black text-slate-200">وضعیت موجودی در انبار سالن</span>
                    </div>
                    
                    <div className="h-px bg-slate-800/60" />
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <span className="text-[10px] font-mono text-emerald-400 font-black">فعال (۱۵٪ تخفیف)</span>
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                      </div>
                      <span className="text-xs font-black text-slate-200">جشنواره تخفیف همزمان</span>
                    </div>
                  </div>

                  {/* Badges Selector */}
                  <div className="text-right">
                    <label className="text-[10px] uppercase tracking-wider text-slate-500 font-extrabold block mb-2">برچسب برجسته روی تصویر</label>
                    <div className="flex flex-wrap gap-2 justify-end">
                      <span className="px-3 py-1.5 rounded-lg text-xs font-black bg-[#10b981] text-white border border-[#10b981]/30">پرفروش ترین 🔥</span>
                      <span className="px-3 py-1.5 rounded-lg text-xs font-bold bg-slate-950 text-slate-400 border border-slate-800">پیشنهاد سرآشپز</span>
                      <span className="px-3 py-1.5 rounded-lg text-xs font-bold bg-slate-950 text-slate-400 border border-slate-800">رژیمی و سالم</span>
                    </div>
                  </div>
                </div>

                {/* Simulated action message */}
                <div className="mt-6 pt-4 border-t border-slate-800 flex justify-between items-center text-right">
                  <span className="text-[9px] text-slate-500 font-bold">آخرین ویرایش: کمتر از ۲ ثانیه پیش</span>
                  <div className="px-4 py-1.5 bg-[#10b981] text-white rounded-lg text-xs font-black shadow-lg">ذخیره‌سازی خودکار ابری</div>
                </div>

              </div>
            </Reveal>

          </div>
        </div>
      </section>

      {/* ==========================================
          SECTION 7: TEMPLATES SECTION
         ========================================== */}
      <section className="py-12 lg:py-16 bg-[#F8F9FA]">
        <div className="max-w-7xl mx-auto px-6">
          
          <Reveal variant="fadeUp" className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-[10px] uppercase tracking-[0.2em] font-black text-[#10b981] bg-[#10b981]/10 px-3.5 py-1 rounded-full border border-[#10b981]/15">طراحی و دیزاین</span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-[#18181B] tracking-tight mt-4 leading-none">قالب‌های از پیش طراحی‌شده برای انواع صنف‌ها</h2>
            <p className="text-[#71717A] mt-4 font-medium text-sm sm:text-base">ساختار و هویت منحصربه‌فرد کسب‌و‌کار خود را با طرح‌های آماده تخصصی ویترین حفظ کنید.</p>
          </Reveal>

          {/* Business niche selectors */}
          <Reveal variant="fadeUp" delay={0.1} className="flex flex-wrap gap-2 justify-center mb-10">
            {TEMPLATES.map((tpl) => (
              <button
                key={tpl.id}
                onClick={() => setActiveTemplateId(tpl.id)}
                className={`px-5 py-2.5 rounded-xl text-xs font-black cursor-pointer border transition-all ${activeTemplateId === tpl.id ? 'bg-[#10b981] text-white border-[#10b981] shadow-md' : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'}`}
              >
                {tpl.title}
              </button>
            ))}
          </Reveal>

          {/* Interactive template visual container */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-white border border-slate-200/50 rounded-[2.5rem] p-6 md:p-10 shadow-xs">
            
            {/* Description of current active Template */}
            <Reveal variant="fadeRight" delay={0.2} className="lg:col-span-5 text-right">
              {TEMPLATES.filter(t => t.id === activeTemplateId).map((tpl) => (
                <div key={tpl.id}>
                  <h3 className="text-xl font-black text-slate-800 mb-3">{tpl.title}</h3>
                  <p className="text-xs sm:text-sm text-slate-500 leading-relaxed mb-6">{tpl.description}</p>
                  
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 justify-end text-xs font-bold text-slate-700">
                      <span>سازگاری کامل با تم‌های تاریک و روشن</span>
                      <Check className="w-4 h-4 text-[#10b981]" />
                    </div>
                    <div className="flex items-center gap-2 justify-end text-xs font-bold text-slate-700">
                      <span>امکان آپلود تصاویر نامحدود محصولات بدون افت کیفیت</span>
                      <Check className="w-4 h-4 text-[#10b981]" />
                    </div>
                    <div className="flex items-center gap-2 justify-end text-xs font-bold text-slate-700">
                      <span>ثبت خودکار پیشنهادهای مکمل غذاها جهت ارتقای مبلغ خرید</span>
                      <Check className="w-4 h-4 text-[#10b981]" />
                    </div>
                  </div>
                </div>
              ))}
            </Reveal>

            {/* Miniature Phone Mockup showing the layout */}
            <Reveal variant="fadeLeft" delay={0.2} className="lg:col-span-7 flex justify-center">
              {TEMPLATES.filter(t => t.id === activeTemplateId).map((tpl) => (
                <motion.div 
                  key={tpl.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5 }}
                  className={`w-64 border-[5px] rounded-[2rem] shadow-lg overflow-hidden relative ${tpl.bgType === 'dark' ? 'bg-[#0E0F11] text-white border-slate-800' : tpl.bgType === 'warm' ? 'bg-[#FAF8F5] text-slate-800 border-slate-200' : 'bg-white text-slate-800 border-slate-200'}`}
                >
                  {/* Status Bar */}
                  <div className="pt-4 pb-2 px-4 flex items-center justify-between text-[8px] font-bold border-b border-slate-500/10">
                    <span className="text-[7px] text-[#10b981]">● سفارش آنلاین</span>
                    <span className="text-slate-400 font-mono">12:30</span>
                  </div>

                  {/* Menu Core */}
                  <div className="p-3.5 space-y-3 h-[260px] overflow-hidden">
                    <div className="text-right">
                      <h4 className="text-[10px] font-black tracking-tight">{tpl.title}</h4>
                      <p className="text-[7px] text-slate-400 mt-0.5">طعم‌های فراموش‌نشدنی و اصیل</p>
                    </div>

                    <div className="h-[1px] bg-slate-500/10 my-1" />

                    {/* Products list within template */}
                    <div className="space-y-2">
                      {tpl.items.map((it, idx) => (
                        <div key={idx} className={`p-2 rounded-lg border flex items-center justify-between text-right ${tpl.bgType === 'dark' ? 'bg-[#181A1F] border-slate-800' : 'bg-white border-slate-100 shadow-xs'}`}>
                          <div className="flex items-center gap-1.5">
                            <span className="text-[8px] font-mono font-black text-[#10b981]">{it.price} تومان</span>
                          </div>
                          <div className="text-right">
                            <span className="text-[9px] font-black block">{it.name}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              ))}
            </Reveal>

          </div>
        </div>
      </section>

      {/* ==========================================
          SECTION 8: INTEGRATIONS
         ========================================== */}
      <section className="py-12 lg:py-16 bg-white border-t border-b border-slate-200/50">
        <div className="max-w-7xl mx-auto px-6">
          
          <Reveal variant="fadeUp" className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-[10px] uppercase tracking-[0.2em] font-black text-[#10b981] bg-[#10b981]/10 px-3.5 py-1 rounded-full border border-[#10b981]/15">اتصالات و یکپارچگی</span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-[#18181B] tracking-tight mt-4 leading-none">یکپارچگی کامل با ابزارهای روز رستوران‌داری</h2>
            <p className="text-[#71717A] mt-4 font-medium text-sm sm:text-base">سفارش‌ها، سیستم پرداخت، حسابداری و سخت‌افزارهای خود را به صورت یکپارچه متصل کنید.</p>
          </Reveal>

          <StaggerGroup className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {INTEGRATIONS.map((integ) => {
              const Icon = integ.icon;
              return (
                <AnimatedCard 
                  key={integ.id}
                  className="bg-[#F8F9FA] p-6 rounded-2xl border border-slate-200/50 flex items-start gap-4 text-right transition-all hover:border-[#10b981]/20 duration-300"
                >
                  <div className="w-10 h-10 bg-emerald-50 text-[#10b981] rounded-xl flex items-center justify-center shrink-0 border border-emerald-100">
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      {integ.status === 'active' ? (
                        <span className="text-[8px] bg-emerald-500/10 text-[#0f766e] border border-emerald-500/15 px-2 py-0.5 rounded font-black">فعال</span>
                      ) : (
                        <span className="text-[8px] bg-slate-200 text-slate-500 px-2 py-0.5 rounded font-bold">به‌زودی</span>
                      )}
                      <h4 className="text-sm font-black text-slate-800">{integ.name}</h4>
                    </div>
                    <p className="text-xs text-slate-500 leading-relaxed mt-1.5">{integ.description}</p>
                  </div>
                </AnimatedCard>
              );
            })}
          </StaggerGroup>

        </div>
      </section>

      {/* ==========================================
          SECTION 9: VERIFIED CUSTOMER STORY (Case Study layout)
         ========================================== */}
      <section className="py-12 lg:py-16 bg-[#F8F9FA]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="bg-white rounded-[2.5rem] border border-slate-200/60 p-8 md:p-12 shadow-xs grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Metric Metrics (Left side in RTL) */}
            <Reveal variant="fadeRight" delay={0.1} className="lg:col-span-5 grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
              <div className="bg-[#F8F9FA] p-5 rounded-2xl border border-slate-200/40 hover:border-[#10b981]/20 transition-all">
                <span className="text-3xl md:text-4xl font-black text-red-500 font-mono tracking-tight">-۴۰٪</span>
                <p className="text-[10px] sm:text-xs text-slate-500 font-bold mt-2">کاهش زمان انتظار و صف سفارش‌گیری سالن</p>
              </div>
              <div className="bg-[#F8F9FA] p-5 rounded-2xl border border-slate-200/40 hover:border-[#10b981]/20 transition-all">
                <span className="text-3xl md:text-4xl font-black text-[#10b981] font-mono tracking-tight">+۲۵٪</span>
                <p className="text-[10px] sm:text-xs text-slate-500 font-bold mt-2">افزایش مبلغ سبد خرید با پیشنهاد مکمل</p>
              </div>
              <div className="bg-[#F8F9FA] p-5 rounded-2xl border border-slate-200/40 hover:border-[#10b981]/20 transition-all">
                <span className="text-3xl md:text-4xl font-black text-[#10b981] font-mono tracking-tight">۰٪</span>
                <p className="text-[10px] sm:text-xs text-slate-500 font-bold mt-2">خطای پیشخوان در ثبت اقلام سفارش خریداران</p>
              </div>
            </Reveal>

            {/* Case Study Story Content (Right side in RTL) */}
            <Reveal variant="fadeLeft" delay={0.2} className="lg:col-span-7 text-right">
              <span className="text-[10px] uppercase tracking-[0.2em] font-black text-[#10b981] bg-[#10b981]/10 px-3.5 py-1 rounded-full border border-[#10b981]/15">داستان موفقیت مشتریان</span>
              <h3 className="text-xl sm:text-2xl md:text-3xl font-black text-slate-800 mt-6 leading-tight">چگونه کافه رستوران راک فرآیند سفارش‌گیری سالن خود را متحول کرد</h3>
              <p className="text-xs sm:text-sm text-slate-500 leading-relaxed mt-4">
                «منوهای کاغذی ما به دلیل تغییرات نوسان قیمت‌ها کثیف، خط‌خورده یا نامرتب به نظر می‌رسیدند. از زمان تجهیز سالن به کدهای میز ویترین، قیمت‌ها را در کسری از ثانیه تغییر می‌دهیم و سفارش‌ها با شماره میز صحیح مستقیماً روی چاپگر پیشخوان آشپزخانه ارسال می‌شوند.»
              </p>
              
              <div className="mt-8 flex items-center justify-end gap-3">
                <div className="text-right">
                  <h5 className="text-xs font-black text-slate-800">احسان خسروی</h5>
                  <p className="text-[10px] text-slate-400 mt-0.5">صاحب و موسس کافه رستوران راک</p>
                </div>
                <div className="w-10 h-10 rounded-full bg-slate-100 object-cover overflow-hidden border border-slate-200">
                  <div className="w-full h-full bg-gradient-to-br from-[#10b981] to-[#0A0A0A]" />
                </div>
              </div>
            </Reveal>

          </div>
        </div>
      </section>

      {/* ==========================================
          SECTION 10: PRICING SECTION
         ========================================== */}
      <section id="pricing" className="py-12 lg:py-16 bg-white border-t border-slate-200/50">
        <div className="max-w-7xl mx-auto px-6">
          
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-[10px] uppercase tracking-[0.2em] font-black text-[#10b981] bg-[#10b981]/10 px-3.5 py-1 rounded-full border border-[#10b981]/15">طرح‌ها و اشتراک</span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-[#18181B] tracking-tight mt-4 leading-none">قیمت‌گذاری شفاف و بی‌دردسر</h2>
            <p className="text-[#71717A] mt-4 font-medium text-sm sm:text-base">طرح مناسب کسب‌و‌کار خود را انتخاب کرده و از سود کامل سفارش‌ها لذت ببرید.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* TODO: Replace these placeholder plan specifications with real pricing decisions when finalized. */}
            {PLANS.map((plan) => (
              <div 
                key={plan.id}
                className={`p-6 md:p-8 rounded-[2rem] border relative flex flex-col justify-between ${plan.isPopular ? 'bg-white border-[#10b981] shadow-lg shadow-emerald-500/5 scale-102 z-10' : 'bg-[#F8F9FA] border-slate-200/60'}`}
              >
                {plan.isPopular && (
                  <span className="absolute -top-3 left-6 bg-[#10b981] text-white text-[9px] font-black px-3 py-1 rounded-full border border-emerald-400">محبوب‌ترین انتخاب</span>
                )}

                <div>
                  <h4 className="text-lg font-black text-slate-800 mb-2">{plan.name}</h4>
                  <p className="text-xs text-slate-400 leading-relaxed mb-6 h-12">{plan.description}</p>
                  
                  <div className="flex items-baseline justify-end gap-1.5 mb-6 text-right" style={{ direction: 'rtl' }}>
                    <span className="text-3xl md:text-4xl font-black text-slate-800 font-mono tracking-tight">{plan.price}</span>
                    <span className="text-xs text-slate-500 font-bold">تومان / {plan.period}</span>
                  </div>

                  <div className="h-px bg-slate-200/60 mb-6" />

                  <ul className="space-y-3 mb-8 text-right">
                    {plan.features.map((feat, idx) => (
                      <li key={idx} className="flex items-center gap-2.5 justify-end text-xs font-bold text-slate-700">
                        <span>{feat}</span>
                        <Check className="w-4 h-4 text-[#10b981] shrink-0" />
                      </li>
                    ))}
                  </ul>
                </div>

                <button 
                  onClick={onStartFreeClick}
                  className={`w-full py-3.5 rounded-xl text-xs font-black cursor-pointer border transition-all ${plan.isPopular ? 'bg-[#10b981] hover:bg-[#10b981]/95 text-white border-[#10b981]' : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200'}`}
                >
                  شروع با این طرح
                </button>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* ==========================================
          SECTION 11: FAQ SECTION (Accordion with accessibility)
         ========================================== */}
      <section id="faq" className="py-12 lg:py-16 bg-[#F8F9FA] border-t border-b border-slate-200/50">
        <div className="max-w-4xl mx-auto px-6">
          
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-[10px] uppercase tracking-[0.2em] font-black text-[#10b981] bg-[#10b981]/10 px-3.5 py-1 rounded-full border border-[#10b981]/15">پاسخ به ابهامات شما</span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-[#18181B] tracking-tight mt-4 leading-none">سوالات متداول کاربران</h2>
            <p className="text-[#71717A] mt-4 font-medium text-sm sm:text-base">پاسخ‌های دقیق به پرسش‌های متداول شما درباره امکانات و کاربرد ویترین.</p>
          </div>

          <div className="space-y-3">
            {FAQS.map((faq) => {
              const isOpen = activeFaqId === faq.id;
              return (
                <div 
                  key={faq.id} 
                  className="bg-white border border-slate-200/50 rounded-2xl overflow-hidden transition-all duration-300"
                >
                  <button
                    aria-expanded={isOpen}
                    aria-controls={`faq-answer-${faq.id}`}
                    onClick={() => setActiveFaqId(isOpen ? null : faq.id)}
                    className="w-full px-6 py-4.5 flex items-center justify-between text-right font-black text-slate-800 text-sm sm:text-base transition-colors hover:bg-slate-50/50 cursor-pointer border-0 bg-transparent"
                  >
                    <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform duration-300 ${isOpen ? 'rotate-180 text-[#10b981]' : ''}`} />
                    <span className="flex-1 pr-3">{faq.question}</span>
                  </button>
                  
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        id={`faq-answer-${faq.id}`}
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25, ease: 'easeInOut' }}
                        className="overflow-hidden border-t border-slate-100 bg-slate-50/30"
                      >
                        <p className="px-6 py-4 text-xs sm:text-sm text-slate-500 leading-relaxed text-right">
                          {faq.answer}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* ==========================================
          SECTION 12: FINAL CTA
         ========================================== */}
      <section className="relative py-12 lg:py-16 bg-[#10b981] text-white overflow-hidden text-center z-10">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.15)_0%,transparent_80%)]" />
        
        <div className="max-w-4xl mx-auto px-6 relative z-10">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-white mb-6 leading-tight tracking-tight">آماده‌اید منوی خود را متحول کنید؟</h2>
          <p className="text-emerald-50 max-w-xl mx-auto mb-10 text-xs sm:text-base font-medium leading-relaxed">با پیوستن به پلتفرم طراحی منو و سفارش‌گیری ویترین، زمان ثبت هر سفارش سالن خود را به میزان چشمگیری کاهش دهید.</p>
          
          <button 
            onClick={onStartFreeClick}
            className="px-8 py-4 bg-[#0A0A0A] hover:bg-slate-900 text-white rounded-2xl font-black text-sm sm:text-base shadow-2xl active:scale-95 transition-all flex items-center gap-3 mx-auto group cursor-pointer border-0"
          >
            <span>شروع ساخت منو به صورت رایگان</span>
            <span className="w-5 h-5 rounded-full bg-white/10 flex items-center justify-center transition-transform group-hover:translate-x-[-3px]">
              <ChevronLeft className="w-4 h-4 text-white" />
            </span>
          </button>
        </div>
      </section>

      {/* ==========================================
          SECTION 13: MARKETING FOOTER
         ========================================== */}
      <footer className="bg-[#0A0A0A] text-slate-400 py-12 border-t border-white/10 text-right relative z-10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-16">
            
            {/* Info Branding Column (Rightmost in RTL) */}
            <div className="lg:col-span-2 flex flex-col items-start lg:items-start text-right">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-9 h-9 bg-[#10b981] rounded-lg flex items-center justify-center shadow-lg shadow-[#10b981]/20">
                  <span className="text-white font-black text-lg">وی</span>
                </div>
                <span className="text-lg font-black tracking-tight text-white">ویترین</span>
              </div>
              <p className="text-xs text-slate-500 leading-relaxed max-w-xs">
                پلتفرم یکپارچه طراحی و توسعه منوی دیجیتال و بستر هوشمند سفارش‌گیری مستقیم. بدون نیاز به واسطه‌ها و بدون پرداخت مبالغ کارمزد تراکنش.
              </p>
            </div>

            {/* Link Col 1: Product */}
            <div>
              <h4 className="text-xs font-black text-white mb-4">محصول</h4>
              <ul className="space-y-3 text-xs list-none p-0">
                <li><a href="#hero" className="text-slate-400 hover:text-white transition-colors no-underline">شبیه‌ساز تعاملی منو</a></li>
                <li><a href="#how-it-works" className="text-slate-400 hover:text-white transition-colors no-underline">مسیر راه‌اندازی منو</a></li>
                <li><a href="#pricing" className="text-slate-400 hover:text-white transition-colors no-underline">تعرفه‌ها و اشتراک ماهانه</a></li>
              </ul>
            </div>

            {/* Link Col 2: Company */}
            <div>
              <h4 className="text-xs font-black text-white mb-4">شرکت</h4>
              <ul className="space-y-3 text-xs list-none p-0">
                <li><a href="#how-it-works" className="text-slate-400 hover:text-white transition-colors no-underline">درباره ما</a></li>
                <li><a href="#pricing" className="text-slate-400 hover:text-white transition-colors no-underline">راهکارهای صنفی رستوران</a></li>
                <li><a href="#faq" className="text-slate-400 hover:text-white transition-colors no-underline">سوالات متداول کاربران</a></li>
              </ul>
            </div>

            {/* Link Col 3: Legal */}
            <div>
              <h4 className="text-xs font-black text-white mb-4">قوانین و پشتیبانی</h4>
              <ul className="space-y-3 text-xs list-none p-0">
                <li><a href="#faq" className="text-slate-400 hover:text-white transition-colors no-underline">قوانین و مقررات استفاده</a></li>
                <li><a href="#pricing" className="text-slate-400 hover:text-white transition-colors no-underline">امنیت اطلاعات کاربران</a></li>
                <li><a href="#faq" className="text-slate-400 hover:text-white transition-colors no-underline">ارتباط با کارشناسان فنی</a></li>
              </ul>
            </div>

          </div>

          <div className="h-px bg-slate-900 mb-8" />

          {/* Socials & Copyright */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6 text-xs text-slate-600">
            <div className="flex gap-4">
              <span className="hover:text-[#10b981] transition-colors cursor-pointer">اینستاگرام</span>
              <span className="hover:text-[#10b981] transition-colors cursor-pointer">لینکدین</span>
              <span className="hover:text-[#10b981] transition-colors cursor-pointer">واتساپ ارتباطی</span>
            </div>
            <div>
              <p className="text-center sm:text-right">© ۱۴۰۵ ویترین. تمامی حقوق معنوی این پلتفرم ابری محفوظ می‌باشد.</p>
            </div>
          </div>
        </div>
      </footer>

    </div>
  );
};
