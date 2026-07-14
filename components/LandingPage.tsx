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
import { ThreeStepSection } from './ThreeStepSection';
import { InteractiveProductShowcase } from './InteractiveProductShowcase';
import { LivingMenuEngine } from './LivingMenuEngine';
import { ReactiveGridBackground } from './ReactiveGridBackground';
import { IPhone17ProMaxFrame } from './IPhone17ProMaxFrame';
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
      { name: 'اسپرسو دبل کمربند', price: '75,000' },
      { name: 'کورتادو با شیر بادام', price: '90,000' },
      { name: 'تارت بلوبری تازه', price: '120,000' },
    ],
  },
  {
    id: 'fastfood',
    title: 'فست‌فود و برگر شاپ',
    description: 'رابط کاربری پرانرژی تیره با تمرکز بر عکاسی‌های بزرگ از غذا، برچسب‌های تند و دکمه‌های سفارش‌گیری سریع.',
    accent: 'red',
    bgType: 'dark',
    items: [
      { name: 'دبل برگر با پنیر سوئیسی', price: '380,000' },
      { name: 'سیب‌زمینی سرخ‌کرده با پنیر چدار', price: '140,000' },
      { name: 'پیتزا پپرونی تند ایتالیایی', price: '340,000', isSpicy: true },
    ],
  },
  {
    id: 'restaurant',
    title: 'رستوران سنتی و کلاسیک',
    description: 'قالب‌های منظم، تفکیک دقیق کباب‌ها، پلوها و پیش‌غذاها، همراه با توضیحات مفصل و وزن مواد تشکیل‌دهنده.',
    accent: 'amber',
    bgType: 'light',
    items: [
      { name: 'چلوکباب کوبیده مخصوص', price: '420,000' },
      { name: 'کباب برگ گوسفندی ممتاز', price: '580,000' },
      { name: 'ماست کوزه‌ای محلی با نعنا', price: '45,000' },
    ],
  },
  {
    id: 'confectionery',
    title: 'قنادی و بوتیک شیرینی',
    description: 'چیدمان لوکس و رنگ‌های پاستلی ملایم با فیلترهای تفکیکی براساس وزن، طعم و زمان تحویل کیک‌های سفارشی.',
    accent: 'rose',
    bgType: 'warm',
    items: [
      { name: 'کیک هویج و گردو کلاسیک', price: '290,000' },
      { name: 'ماکارون فرانسوی (جعبه ۶ عددی)', price: '180,000' },
      { name: 'دسر چیزکیک سن‌سباستین', price: '160,000' },
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
    price: '0',
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
    price: '550,000',
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

  // Ref for the Interactive Hero Container
  const heroRef = useRef<HTMLDivElement | null>(null);
  const [isHeroInView, setIsHeroInView] = useState(true);

  // Intersection Observer & window resize handler
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

  return (
    <div className="min-h-screen bg-[#F8F9FA] dark:bg-[#121614] text-[#18181B] dark:text-slate-200 font-['Vazirmatn'] selection:bg-[#10b981]/15 selection:text-[#10b981] overflow-x-hidden leading-relaxed">
      
      {/* ==========================================
          SECTION 2: INTERACTIVE HERO SECTION
         ========================================== */}
      {/* ==========================================
          SECTION 2: INTERACTIVE HERO SECTION
         ========================================== */}
      <header ref={heroRef} id="hero" className="relative py-20 lg:py-32 border-b border-slate-200/50 dark:border-white/5 bg-[#F9FAF9] dark:bg-[#0B0E0C] overflow-hidden">
        {/* Elastic Interactive Grid Background */}
        <ReactiveGridBackground containerRef={heroRef} />

        {/* Cinematic ambient background glow and stage atmosphere */}
        <div className="absolute top-1/2 left-1/4 w-[700px] h-[700px] -translate-y-1/2 bg-gradient-radial from-[#10b981]/8 to-transparent rounded-full blur-[140px] pointer-events-none z-0 animate-pulse" />
        <div className="absolute -top-40 right-1/3 w-[500px] h-[500px] bg-[#10b981]/4 rounded-full blur-[120px] pointer-events-none z-0" />

        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center relative z-10">
          
          {/* Copy Column (Right side in RTL, comes first vertically on mobile) */}
          <StaggerGroup className="lg:col-span-5 text-right flex flex-col items-start justify-center z-10 order-1 lg:order-1">
            
            {/* Elegant Micro-badge tag (RTL) */}
            <StaggerChild>
              <div className="inline-flex items-center gap-2 bg-emerald-500/10 dark:bg-emerald-500/5 text-emerald-800 dark:text-[#19C78C] px-4 py-1.5 rounded-full border border-emerald-500/15 dark:border-emerald-500/10 text-[11px] font-black tracking-wide mb-6">
                <Sparkles className="w-3.5 h-3.5 text-emerald-600 dark:text-[#19C78C] animate-pulse" />
                <span>منوی دیجیتال و سفارشگیری مستقیم برای کافه و رستوران</span>
              </div>
            </StaggerChild>

            {/* Main Headline (Enforcing <= 3 lines wrap limit on desktop) */}
            <StaggerChild>
              <h1 className="text-3xl sm:text-4xl md:text-5xl xl:text-[52px] font-black text-slate-900 dark:text-white tracking-tighter leading-[1.1] mb-4 max-w-2xl text-right">
                منوی دیجیتال خودت را بساز؛
                <br />
                سفارش مستقیم بگیر
              </h1>
            </StaggerChild>

            {/* Accent sub-headline highlighting sync speed */}
            <StaggerChild>
              <p className="text-[#10b981] dark:text-[#19C78C] text-base sm:text-lg md:text-xl font-black mb-5 tracking-tight leading-snug">
                هر تغییری، همان لحظه در ویترین زنده میشود
              </p>
            </StaggerChild>

            {/* Secondary supporting copy */}
            <StaggerChild>
              <p className="text-sm sm:text-base text-slate-500 dark:text-slate-400 mb-8 leading-relaxed max-w-[55ch] text-right font-medium">
                قیمت، موجودی، تخفیف، افزودنیها و ظاهر منو را بدون کدنویسی مدیریت کن و سفارشهای مشتریان را مستقیم و بیواسطه دریافت کن.
              </p>
            </StaggerChild>

            {/* CTAs Group */}
            <StaggerChild className="w-full">
              <div className="flex flex-wrap gap-4 items-center w-full justify-start">
                <MotionButton 
                  id="hero-cta-main"
                  onClick={onStartFreeClick}
                  className="h-14 px-8 bg-[#10b981] hover:bg-emerald-600 dark:bg-[#19C78C] dark:hover:bg-[#12cb8d] text-white rounded-2xl text-sm font-black shadow-[0_12px_24px_-8px_rgba(16,185,129,0.3)] hover:shadow-[0_16px_32px_-6px_rgba(16,185,129,0.4)] active:scale-95 transition-all flex items-center justify-center gap-2.5 group cursor-pointer border-0"
                >
                  <span>ساخت اولین منو</span>
                  <span className="w-6 h-6 rounded-full bg-white/15 flex items-center justify-center transition-transform group-hover:translate-x-[-3px]">
                    <ChevronLeft className="w-4 h-4 text-white" />
                  </span>
                </MotionButton>
                
                <a 
                  href="#how-it-works"
                  className="h-14 px-6 bg-white hover:bg-slate-50 dark:bg-[#161B18] dark:hover:bg-[#1C221E] text-slate-800 dark:text-white border border-slate-200/60 dark:border-white/5 rounded-2xl text-sm font-black active:scale-95 transition-all flex items-center justify-center gap-2.5 group shadow-sm"
                >
                  <span className="w-6 h-6 rounded-full bg-slate-100 dark:bg-white/5 flex items-center justify-center transition-transform group-hover:scale-105">
                    <Play className="w-2.5 h-2.5 fill-slate-800 text-slate-800 dark:fill-white dark:text-white" />
                  </span>
                  <span>مشاهده دموی تعاملی</span>
                </a>
              </div>

              {/* Tiny trust row / assurance row */}
              <div className="text-[11px] text-slate-400 dark:text-slate-500 font-bold tracking-wide mt-6 flex items-center gap-3">
                <div className="flex items-center gap-1">
                  <Check className="w-3.5 h-3.5 text-[#10b981] dark:text-[#19C78C] shrink-0" />
                  <span>بدون نیاز به دانش فنی</span>
                </div>
                <span className="text-slate-300 dark:text-slate-700">•</span>
                <div className="flex items-center gap-1">
                  <Check className="w-3.5 h-3.5 text-[#10b981] dark:text-[#19C78C] shrink-0" />
                  <span>بهروزرسانی زنده</span>
                </div>
                <span className="text-slate-300 dark:text-slate-700">•</span>
                <div className="flex items-center gap-1">
                  <Check className="w-3.5 h-3.5 text-[#10b981] dark:text-[#19C78C] shrink-0" />
                  <span>سفارش مستقیم</span>
                </div>
              </div>
            </StaggerChild>
          </StaggerGroup>

          {/* Living Menu Engine Column (Left side in RTL) */}
          <div className="lg:col-span-7 flex flex-col items-center justify-center relative order-2 lg:order-2">
            <LivingMenuEngine />
          </div>

        </div>
      </header>

      {/* ==========================================
          SECTION 3: TRUST & PROOF STRIP
         ========================================== */}
      <TrustStripSection />

      {/* ==========================================
          SECTION 4: THREE-STEP WORKFLOW (PREMIUM UPGRADED)
         ========================================== */}
      <ThreeStepSection />

      {/* ==========================================
          SECTION 5: CUSTOMER ORDERING JOURNEY (Premium Redesigned Process Stack)
         ========================================== */}
      <CustomerJourney />

      {/* ==========================================
          SECTION 6: PRODUCT MANAGEMENT SHOWCASE (Premium Fully Rebuilt)
         ========================================== */}
      <InteractiveProductShowcase />

      {/* ==========================================
          SECTION 7: TEMPLATES SECTION
         ========================================== */}
      <section id="solutions-tabs" className="py-24 bg-[#FBFBFA] dark:bg-[#121614] transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-6">
          
          <Reveal variant="fadeUp" className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-[10px] uppercase tracking-[0.2em] font-black text-[#10b981] dark:text-[#19C78C] bg-[#10b981]/10 dark:bg-[#10b981]/5 px-3.5 py-1.5 rounded-full border border-[#10b981]/15 dark:border-white/5">طراحی و دیزاین</span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-[#18181B] dark:text-white tracking-tight mt-4 leading-none">قالب‌های از پیش طراحی‌شده برای انواع صنف‌ها</h2>
            <p className="text-[#71717A] dark:text-slate-400 mt-4 font-medium text-sm sm:text-base">ساختار و هویت منحصربه‌فرد کسب‌و‌کار خود را با طرح‌های آماده تخصصی ویترین حفظ کنید.</p>
          </Reveal>

          {/* Business niche selectors - Premium Sliding Tabs */}
          <Reveal variant="fadeUp" delay={0.1} className="flex justify-center mb-12">
            <div className="flex flex-wrap gap-1 bg-slate-50 dark:bg-[#161B18] border border-slate-200/40 dark:border-white/5 p-1.5 rounded-[20px] max-w-3xl mx-auto justify-center">
              {TEMPLATES.map((tpl) => {
                const isActive = activeTemplateId === tpl.id;
                return (
                  <button
                    key={tpl.id}
                    onClick={() => setActiveTemplateId(tpl.id)}
                    className="relative px-5 py-3 text-xs font-bold transition-all duration-300 cursor-pointer rounded-[14px] outline-none border-0 bg-transparent focus-visible:ring-2 focus-visible:ring-emerald-500/30"
                    style={{ WebkitTapHighlightColor: 'transparent' }}
                  >
                    {isActive && (
                      <motion.span
                        layoutId="activeTemplateTab"
                        className="absolute inset-0 bg-white dark:bg-[#121614] border border-slate-200/60 dark:border-white/5 shadow-xs rounded-[14px] z-0"
                        transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                      />
                    )}
                    <span className={`relative z-10 font-black transition-colors duration-300 ${isActive ? 'text-[#10b981] dark:text-[#19C78C]' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'}`}>
                      {tpl.title}
                    </span>
                  </button>
                );
              })}
            </div>
          </Reveal>

          {/* Interactive template visual container */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center bg-white dark:bg-[#0B0E0C] border border-slate-200/50 dark:border-white/5 rounded-[2.5rem] p-8 md:p-12 shadow-xs">
            
            {/* Description of current active Template - Animated Crossfade */}
            <div className="lg:col-span-5 text-right">
              <AnimatePresence mode="wait">
                {TEMPLATES.filter(t => t.id === activeTemplateId).map((tpl) => (
                  <motion.div
                    key={tpl.id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3, ease: PRIMARY_EASE }}
                    className="space-y-6"
                  >
                    {/* Eyebrow tag matching template accent color */}
                    <span className={`inline-block text-[9px] uppercase tracking-[0.15em] font-black px-3 py-1 rounded-full border ${
                      tpl.accent === 'emerald' ? 'text-emerald-700 bg-emerald-50 border-emerald-500/15 dark:text-emerald-400 dark:bg-emerald-500/10 dark:border-[#10b981]/20' :
                      tpl.accent === 'red' ? 'text-red-700 bg-red-50 border-red-500/15 dark:text-red-400 dark:bg-red-500/10 dark:border-red-500/20' :
                      tpl.accent === 'amber' ? 'text-amber-700 bg-amber-50 border-amber-500/15 dark:text-amber-400 dark:bg-amber-500/10 dark:border-amber-500/20' :
                      'text-rose-700 bg-rose-50 border-rose-500/15 dark:text-rose-400 dark:bg-rose-500/10 dark:border-rose-500/20'
                    }`}>
                      قالب تخصصی صنف
                    </span>

                    <h3 className="text-2xl font-black text-slate-800 dark:text-white tracking-tight leading-none">
                      {tpl.title}
                    </h3>

                    <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
                      {tpl.description}
                    </p>

                    <div className="h-px bg-slate-100 dark:bg-white/5 my-4" />

                    {/* Features checklist */}
                    <div className="space-y-4">
                      <div className="flex items-center gap-3 justify-end text-xs font-bold text-slate-700 dark:text-slate-300">
                        <span className="text-right">بهینه‌سازی شده برای سرعت لود و خرید سریع مشتریان صنف</span>
                        <div className="w-5 h-5 rounded-full bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-100 dark:border-emerald-500/20 flex items-center justify-center shrink-0">
                          <Check className="w-3 h-3 text-[#10b981] dark:text-[#19C78C]" />
                        </div>
                      </div>
                      <div className="flex items-center gap-3 justify-end text-xs font-bold text-slate-700 dark:text-slate-300">
                        <span className="text-right">طراحی متناسب با روانشناسی خرید و عکاسی منوی این صنف</span>
                        <div className="w-5 h-5 rounded-full bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-100 dark:border-emerald-500/20 flex items-center justify-center shrink-0">
                          <Check className="w-3 h-3 text-[#10b981] dark:text-[#19C78C]" />
                        </div>
                      </div>
                      <div className="flex items-center gap-3 justify-end text-xs font-bold text-slate-700 dark:text-slate-300">
                        <span className="text-right">امکان شخصی‌سازی کامل تم رنگی، بنرها و لوگو در پنل مدیریت</span>
                        <div className="w-5 h-5 rounded-full bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-100 dark:border-emerald-500/20 flex items-center justify-center shrink-0">
                          <Check className="w-3 h-3 text-[#10b981] dark:text-[#19C78C]" />
                        </div>
                      </div>
                    </div>

                    <div className="pt-4 flex justify-end">
                      <button 
                        onClick={onStartFreeClick}
                        className="px-6 py-3 bg-slate-900 hover:bg-slate-800 dark:bg-emerald-600 dark:hover:bg-[#19C78C] text-white font-black text-xs rounded-xl cursor-pointer transition-all border-0 shadow-sm"
                      >
                        ساخت منو با این قالب
                      </button>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {/* Miniature Phone Mockup showing the layout - Animated Crossfade */}
            <div className="lg:col-span-7 flex justify-center">
              <AnimatePresence mode="wait">
                {TEMPLATES.filter(t => t.id === activeTemplateId).map((tpl) => (
                  <motion.div 
                    key={tpl.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.35, ease: PRIMARY_EASE }}
                    className="relative"
                  >
                    {/* Shadow & stage backdrop behind the phone */}
                    <div className="absolute -inset-4 bg-radial from-slate-200/50 dark:from-emerald-500/5 via-transparent to-transparent opacity-60 blur-2xl z-0" />

                    {/* High-fidelity CSS iPhone 17 Pro Max Frame */}
                    <IPhone17ProMaxFrame variant="standard" className="z-10">
                      
                      {/* Dynamic top badge style matching template */}
                      <div className={`pt-2 pb-2 px-4 flex items-center justify-between text-[8px] font-bold border-b transition-colors duration-300 shrink-0 ${
                        tpl.bgType === 'dark' 
                          ? 'bg-[#0E0F11] text-white/80 border-slate-800' 
                          : tpl.bgType === 'warm' 
                            ? 'bg-[#FAF8F5] dark:bg-[#111312] text-slate-800 dark:text-white/80 border-slate-200/50 dark:border-white/5' 
                            : 'bg-white dark:bg-[#111312] text-slate-800 dark:text-white/80 border-slate-100 dark:border-white/5'
                      }`}>
                        <span className="text-[7.5px] text-[#10b981] dark:text-[#19C78C] font-black flex items-center gap-1">
                          <span className="w-1.5 h-1.5 bg-[#10b981] dark:bg-[#19C78C] rounded-full animate-pulse" />
                          سفارش آنلاین فعال
                        </span>
                        <span className="font-mono text-slate-400">VITRIN</span>
                      </div>

                      {/* Header banner or subtle background */}
                      <div className={`h-24 px-4 flex items-end justify-between pb-3 relative transition-all duration-300 shrink-0 ${
                        tpl.bgType === 'dark' 
                          ? 'bg-gradient-to-br from-[#1E2026] to-[#0E0F11]' 
                          : tpl.bgType === 'warm' 
                            ? 'bg-gradient-to-br from-[#EFEAE2] to-[#FAF8F5] dark:from-[#1A1C19] dark:to-[#111312]' 
                            : 'bg-gradient-to-br from-emerald-50 to-white dark:from-emerald-950/20 dark:to-[#111312]'
                      }`}>
                        {/* Dynamic decorative backdrop shape */}
                        <div className={`absolute top-2 right-2 w-14 h-14 rounded-full blur-xl opacity-20 ${
                          tpl.accent === 'emerald' ? 'bg-emerald-500' :
                          tpl.accent === 'red' ? 'bg-red-500' :
                          tpl.accent === 'amber' ? 'bg-amber-500' : 'bg-rose-500'
                        }`} />

                        <div className="text-right w-full relative z-10">
                          <span className={`text-[7px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded ${
                            tpl.accent === 'emerald' ? 'bg-emerald-500/10 text-[#10b981]' :
                            tpl.accent === 'red' ? 'bg-red-500/10 text-red-500' :
                            tpl.accent === 'amber' ? 'bg-amber-500/10 text-amber-500' :
                            'bg-rose-500/10 text-rose-500'
                          }`}>
                            {tpl.id === 'cafe' ? 'کافه یاب' : tpl.id === 'fastfood' ? 'برگر لوکس' : tpl.id === 'restaurant' ? 'غذای اصیل' : 'دسر کده'}
                          </span>
                          <h4 className={`text-[11px] font-black mt-1 ${tpl.bgType === 'dark' ? 'text-white' : 'text-slate-800 dark:text-white'}`}>{tpl.title}</h4>
                          <p className={`text-[7px] mt-0.5 ${tpl.bgType === 'dark' ? 'text-slate-400' : 'text-slate-500 dark:text-slate-400'}`}>ثبت سریع سفارش پای میز و بیرون‌بر</p>
                        </div>
                      </div>

                      {/* Menu Core list */}
                      <div className={`p-3 space-y-2.5 flex-1 overflow-hidden transition-colors duration-300 ${
                        tpl.bgType === 'dark' ? 'bg-[#0E0F11]' : tpl.bgType === 'warm' ? 'bg-[#FAF8F5] dark:bg-[#111312]' : 'bg-white dark:bg-[#111312]'
                      }`}>
                        
                        {/* Search mockup */}
                        <div className={`p-1.5 rounded-lg flex items-center justify-between border ${
                          tpl.bgType === 'dark' ? 'bg-[#181A1F] border-slate-800' : 'bg-slate-50 dark:bg-white/5 border-slate-100 dark:border-white/5'
                        }`}>
                          <span className="text-[7px] text-slate-400 dark:text-slate-500 font-bold">جستجو در منو...</span>
                          <span className="w-2.5 h-2.5 bg-slate-300 dark:bg-white/5 rounded-full" />
                        </div>

                        <div className="space-y-2">
                          {tpl.items.map((it, idx) => (
                            <div 
                              key={idx} 
                              className={`p-2 rounded-xl border flex items-center justify-between text-right transition-all hover:scale-101 cursor-pointer ${
                                tpl.bgType === 'dark' 
                                  ? 'bg-[#181A1F] border-slate-800/80 hover:border-slate-700 text-white' 
                                  : 'bg-white dark:bg-[#161B18] border-slate-100 dark:border-white/5 shadow-[0_2px_4px_rgba(0,0,0,0.02)] hover:border-slate-200 dark:hover:border-white/10 text-slate-800 dark:text-white'
                              }`}
                            >
                              {/* Price */}
                              <div className="flex items-center gap-1.5 shrink-0">
                                <span className={`text-[8.5px] font-mono font-extrabold ${
                                  tpl.accent === 'emerald' ? 'text-[#10b981] dark:text-[#19C78C]' :
                                  tpl.accent === 'red' ? 'text-red-500' :
                                  tpl.accent === 'amber' ? 'text-amber-500' : 'text-rose-500'
                                }`}>
                                  {it.price}
                                </span>
                                <span className="text-[6.5px] text-slate-400 dark:text-slate-500 font-bold">تومان</span>
                              </div>

                              {/* Food name with options if spicy */}
                              <div className="text-right">
                                <span className="text-[9.5px] font-extrabold block leading-tight">{it.name}</span>
                                {it.isSpicy && (
                                  <span className="text-[6px] bg-red-500/10 text-red-500 px-1 rounded font-black mt-0.5 inline-block">تند</span>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                    </IPhone17ProMaxFrame>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

          </div>
        </div>
      </section>

      {/* ==========================================
          SECTION 8: INTEGRATIONS
         ========================================== */}
      <section className="py-24 bg-white dark:bg-[#0B0E0C] border-t border-b border-slate-200/50 dark:border-white/5 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-6">
          
          <Reveal variant="fadeUp" className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-[10px] uppercase tracking-[0.2em] font-black text-[#10b981] dark:text-[#19C78C] bg-[#10b981]/10 dark:bg-[#10b981]/5 px-3.5 py-1.5 rounded-full border border-[#10b981]/15 dark:border-white/5">اتصالات و یکپارچگی</span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-[#18181B] dark:text-white tracking-tight mt-4 leading-none">یکپارچگی کامل با ابزارهای روز رستوران‌داری</h2>
            <p className="text-[#71717A] dark:text-slate-400 mt-4 font-medium text-sm sm:text-base">سفارش‌ها، سیستم پرداخت، حسابداری و سخت‌افزارهای خود را به صورت یکپارچه متصل کنید.</p>
          </Reveal>

          <StaggerGroup className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {INTEGRATIONS.map((integ) => {
              const Icon = integ.icon;
              // Map categories to premium Persian labels
              const getCategoryLabel = (category: string) => {
                switch (category) {
                  case 'مالی': return 'پرداخت و مالی';
                  case 'عملیات': return 'چاپ و سخت‌افزار';
                  case 'ارتباطات': return 'ارتباطات و پیامک';
                  case 'برندینگ': return 'برندینگ اختصاصی';
                  case 'سفارش‌گیری': return 'عملیات سالن';
                  case 'تحلیل': return 'زیرساخت و گزارش‌دهی';
                  case 'سیستم‌ها': return 'زیرساخت و حسابداری';
                  default: return 'سفارش و عملیات';
                }
              };

              return (
                <StaggerChild key={integ.id}>
                  <div className="bg-slate-50/50 dark:bg-[#161B18]/50 p-1.5 rounded-[24px] border border-slate-200/40 dark:border-white/5 hover:-translate-y-1.5 hover:shadow-xl hover:shadow-emerald-500/5 hover:border-emerald-500/20 dark:hover:border-emerald-500/30 transition-all duration-300 group h-full flex flex-col">
                    <div className="bg-white dark:bg-[#111312] p-6 rounded-[18px] border border-slate-100 dark:border-white/5 flex flex-col justify-between h-full flex-1">
                      
                      {/* Top Row: Category and Status */}
                      <div className="flex items-center justify-between mb-4">
                        {integ.status === 'active' ? (
                          <span className="text-[9px] bg-emerald-500/10 dark:bg-emerald-500/5 text-emerald-700 dark:text-[#19C78C] border border-emerald-500/15 dark:border-emerald-500/10 px-2 py-0.5 rounded-md font-extrabold">فعال</span>
                        ) : (
                          <span className="text-[9px] bg-slate-100 dark:bg-white/5 text-slate-500 dark:text-slate-400 px-2 py-0.5 rounded-md font-bold">به‌زودی</span>
                        )}
                        <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 bg-slate-50 dark:bg-white/5 px-2.5 py-0.5 rounded-full border border-slate-100 dark:border-white/5">{getCategoryLabel(integ.category)}</span>
                      </div>

                      {/* Middle Row: Icon & Name */}
                      <div className="flex items-center gap-3.5 text-right justify-end mb-1">
                        <div className="text-right">
                          <h4 className="text-base font-extrabold text-slate-800 dark:text-white group-hover:text-emerald-950 dark:group-hover:text-emerald-400 transition-colors duration-300">{integ.name}</h4>
                        </div>
                        <div className="w-11 h-11 bg-slate-50 dark:bg-white/5 text-slate-700 dark:text-slate-300 rounded-xl flex items-center justify-center shrink-0 border border-slate-100 dark:border-white/5 group-hover:bg-emerald-50 dark:group-hover:bg-emerald-500/10 group-hover:border-emerald-100 dark:group-hover:border-emerald-500/20 group-hover:text-[#10b981] dark:group-hover:text-[#19C78C] transition-all duration-300">
                          <Icon className="w-5 h-5" />
                        </div>
                      </div>

                      {/* Bottom Row: Description */}
                      <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-medium mt-3 text-right flex-1">
                        {integ.description}
                      </p>
                    </div>
                  </div>
                </StaggerChild>
              );
            })}
          </StaggerGroup>

        </div>
      </section>

      {/* ==========================================
          SECTION 9: VERIFIED CUSTOMER STORY (Case Study layout)
         ========================================== */}
      <section className="py-12 lg:py-16 bg-[#F8F9FA] dark:bg-[#121614] transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-6">
          <div className="bg-white dark:bg-[#0B0E0C] rounded-[2.5rem] border border-slate-200/60 dark:border-white/5 p-8 md:p-12 shadow-xs grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Metric Metrics (Left side in RTL) */}
            <Reveal variant="fadeRight" delay={0.1} className="lg:col-span-5 grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
              <div className="bg-[#F8F9FA] dark:bg-[#161B18] p-5 rounded-2xl border border-slate-200/40 dark:border-white/5 hover:border-[#10b981]/20 dark:hover:border-emerald-500/30 transition-all">
                <span className="text-3xl md:text-4xl font-black text-red-500 dark:text-rose-400 font-mono tracking-tight">-۴۰٪</span>
                <p className="text-[10px] sm:text-xs text-slate-500 dark:text-slate-400 font-bold mt-2">کاهش زمان انتظار و صف سفارش‌گیری سالن</p>
              </div>
              <div className="bg-[#F8F9FA] dark:bg-[#161B18] p-5 rounded-2xl border border-slate-200/40 dark:border-white/5 hover:border-[#10b981]/20 dark:hover:border-emerald-500/30 transition-all">
                <span className="text-3xl md:text-4xl font-black text-[#10b981] dark:text-[#19C78C] font-mono tracking-tight">+۲۵٪</span>
                <p className="text-[10px] sm:text-xs text-slate-500 dark:text-slate-400 font-bold mt-2">افزایش مبلغ سبد خرید با پیشنهاد مکمل</p>
              </div>
              <div className="bg-[#F8F9FA] dark:bg-[#161B18] p-5 rounded-2xl border border-slate-200/40 dark:border-white/5 hover:border-[#10b981]/20 dark:hover:border-emerald-500/30 transition-all">
                <span className="text-3xl md:text-4xl font-black text-[#10b981] dark:text-[#19C78C] font-mono tracking-tight">۰٪</span>
                <p className="text-[10px] sm:text-xs text-slate-500 dark:text-slate-400 font-bold mt-2">خطای پیشخوان در ثبت اقلام سفارش خریداران</p>
              </div>
            </Reveal>

            {/* Case Study Story Content (Right side in RTL) */}
            <Reveal variant="fadeLeft" delay={0.2} className="lg:col-span-7 text-right">
              <span className="text-[10px] uppercase tracking-[0.2em] font-black text-[#10b981] dark:text-[#19C78C] bg-[#10b981]/10 dark:bg-[#10b981]/5 px-3.5 py-1 rounded-full border border-[#10b981]/15 dark:border-white/5">داستان موفقیت مشتریان</span>
              <h3 className="text-xl sm:text-2xl md:text-3xl font-black text-slate-800 dark:text-white mt-6 leading-tight">چگونه کافه رستوران راک فرآیند سفارش‌گیری سالن خود را متحول کرد</h3>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed mt-4">
                «منوهای کاغذی ما به دلیل تغییرات نوسان قیمت‌ها کثیف، خط‌خورده یا نامرتب به نظر می‌رسیدند. از زمان تجهیز سالن به کدهای میز ویترین، قیمت‌ها را در کسری از ثانیه تغییر می‌دهیم و سفارش‌ها با شماره میز صحیح مستقیماً روی چاپگر پیشخوان آشپزخانه ارسال می‌شوند.»
              </p>
              
              <div className="mt-8 flex items-center justify-end gap-3">
                <div className="text-right">
                  <h5 className="text-xs font-black text-slate-800 dark:text-white">احسان خسروی</h5>
                  <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-0.5">صاحب و موسس کافه رستوران راک</p>
                </div>
                <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-[#161B18] object-cover overflow-hidden border border-slate-200 dark:border-white/5">
                  <div className="w-full h-full bg-gradient-to-br from-[#10b981] to-[#0A0A0A]" />
                </div>
              </div>
            </Reveal>

          </div>
        </div>
      </section>

      {/* ==========================================
          SECTION 11: FAQ SECTION (Accordion with premium design & accessibility)
         ========================================== */}
      <section id="faq" className="py-20 bg-[#FBFBFA] dark:bg-[#121614] border-t border-b border-slate-200/50 dark:border-white/5 transition-colors duration-300">
        <div className="max-w-4xl mx-auto px-6">
          
          <Reveal variant="fadeUp" className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-[10px] uppercase tracking-[0.2em] font-black text-[#10b981] dark:text-[#19C78C] bg-[#10b981]/10 dark:bg-[#10b981]/5 px-3.5 py-1.5 rounded-full border border-[#10b981]/15 dark:border-white/5">پاسخ به ابهامات شما</span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-[#18181B] dark:text-white tracking-tight mt-4 leading-none">سوالات متداول کاربران</h2>
            <p className="text-[#71717A] dark:text-slate-400 mt-4 font-medium text-sm sm:text-base">پاسخ‌های دقیق به پرسش‌های متداول شما درباره امکانات و کاربرد ویترین.</p>
          </Reveal>

          <StaggerGroup className="space-y-4">
            {FAQS.map((faq) => {
              const isOpen = activeFaqId === faq.id;
              return (
                <StaggerChild key={faq.id}>
                  <div 
                    className={`bg-white dark:bg-[#111312] rounded-[20px] border transition-all duration-300 overflow-hidden ${
                      isOpen 
                        ? 'border-emerald-500/30 dark:border-emerald-500/40 shadow-md shadow-emerald-500/5 ring-1 ring-emerald-500/5' 
                        : 'border-slate-200/60 dark:border-white/5 hover:border-emerald-500/20 dark:hover:border-emerald-500/30 hover:-translate-y-[2px] hover:shadow-lg hover:shadow-emerald-500/5'
                    }`}
                  >
                    <button
                      aria-expanded={isOpen}
                      aria-controls={`faq-answer-${faq.id}`}
                      onClick={() => setActiveFaqId(isOpen ? null : faq.id)}
                      className="w-full px-6 py-5 flex items-center justify-between text-right font-black text-slate-800 dark:text-slate-200 text-sm sm:text-base cursor-pointer border-0 bg-transparent focus-visible:ring-2 focus-visible:ring-emerald-500/30 focus-visible:outline-none rounded-t-[20px]"
                    >
                      <ChevronDown className={`w-5 h-5 text-slate-400 dark:text-slate-500 transition-all duration-300 shrink-0 ${isOpen ? 'rotate-180 text-[#10b981] dark:text-[#19C78C]' : ''}`} />
                      <span className="flex-1 pr-4">{faq.question}</span>
                    </button>
                    
                    <AnimatePresence initial={false}>
                      {isOpen && (
                        <motion.div
                          id={`faq-answer-${faq.id}`}
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.25, ease: PRIMARY_EASE }}
                        >
                          <div className="border-t border-slate-100/80 dark:border-white/5 mx-6" />
                          <div className="px-6 pb-6 pt-3">
                            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed text-right font-medium">
                              {faq.answer}
                            </p>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </StaggerChild>
              );
            })}
          </StaggerGroup>

          {/* Bottom FAQ Helper Block */}
          <Reveal variant="fadeUp" delay={0.2} className="mt-12 bg-white dark:bg-[#161B18] ring-1 ring-black/5 dark:ring-white/5 rounded-[24px] p-1 border border-slate-200/40 dark:border-white/5 shadow-[0_12px_24px_-10px_rgba(16,185,129,0.04)] max-w-2xl mx-auto">
            <div className="bg-slate-50/60 dark:bg-[#111312] rounded-[20px] p-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-right">
              <p className="text-xs sm:text-sm font-bold text-slate-600 dark:text-slate-400">پاسخ سوال خود را پیدا نکردید؟ با تیم ویترین در تماس باشید.</p>
              <button 
                onClick={onStartFreeClick}
                className="px-5 py-2.5 bg-[#10b981] hover:bg-emerald-600 dark:bg-[#19C78C] dark:hover:bg-[#12cb8d] text-white rounded-xl text-xs font-black shadow-md shadow-emerald-500/10 cursor-pointer transition-all border-0"
              >
                تماس با ما
              </button>
            </div>
          </Reveal>

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
                <li><a href="#faq" className="text-slate-400 hover:text-white transition-colors no-underline">سوالات متداول کاربران</a></li>
              </ul>
            </div>

            {/* Link Col 2: Company */}
            <div>
              <h4 className="text-xs font-black text-white mb-4">شرکت</h4>
              <ul className="space-y-3 text-xs list-none p-0">
                <li><a href="#how-it-works" className="text-slate-400 hover:text-white transition-colors no-underline">درباره ما</a></li>
                <li><a href="#how-it-works" className="text-slate-400 hover:text-white transition-colors no-underline">راهکارهای صنفی رستوران</a></li>
                <li><a href="#faq" className="text-slate-400 hover:text-white transition-colors no-underline">سوالات متداول کاربران</a></li>
              </ul>
            </div>

            {/* Link Col 3: Legal */}
            <div>
              <h4 className="text-xs font-black text-white mb-4">قوانین و پشتیبانی</h4>
              <ul className="space-y-3 text-xs list-none p-0">
                <li><a href="#faq" className="text-slate-400 hover:text-white transition-colors no-underline">قوانین و مقررات استفاده</a></li>
                <li><a href="#faq" className="text-slate-400 hover:text-white transition-colors no-underline">امنیت اطلاعات کاربران</a></li>
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
