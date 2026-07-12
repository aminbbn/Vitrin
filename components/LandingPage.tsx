import React, { useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
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
  Phone, 
  MapPin, 
  Smartphone, 
  Settings, 
  ArrowDown,
  Layout,
  Clock,
  HeartHandshake
} from 'lucide-react';

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
  const [activeCategory, setActiveCategory] = useState<'pizza' | 'burger' | 'salad' | 'pasta'>('pizza');
  const [studioHoveredProduct, setStudioHoveredProduct] = useState<number | null>(null);

  // Categories list
  const categories = [
    { id: 'pizza', name: 'پیتزا' },
    { id: 'burger', name: 'برگر' },
    { id: 'salad', name: 'سالاد' },
    { id: 'pasta', name: 'پاستا' },
  ] as const;

  // Realistic sample products
  const products = {
    pizza: [
      { id: 1, name: 'پیتزا پپرونی تند', price: '۳۴۰,۰۰۰', desc: 'کوکتل پپرونی، پنیر موزارلا، سلف فلفل تند طبیعی', isSpicy: true, discount: '۱۰٪', image: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?w=500&auto=format&fit=crop&q=60' },
      { id: 2, name: 'پیتزا مارگاریتا کلاسیک', price: '۲۹۰,۰۰۰', desc: 'گوجه‌فرنگی مینیاتوری، ریحان تازه، پنیر خالص محلی', isSpicy: false, discount: '', image: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=500&auto=format&fit=crop&q=60' }
    ],
    burger: [
      { id: 3, name: 'دبل چیز برگر زغالی', price: '۳۹۰,۰۰۰', desc: 'دو لایه گوشت خالص، پنیر چدار دوبل، سس دست‌ساز', isSpicy: false, discount: '۱۵٪', image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500&auto=format&fit=crop&q=60' },
    ],
    salad: [
      { id: 4, name: 'سالاد سزار فیله سوخاری', price: '۲۶۰,۰۰۰', desc: 'کاهو رسمی، فیله سوخاری، پنیر پارمزان، سس سزار سنسو', isSpicy: false, discount: '', image: 'https://images.unsplash.com/photo-1550304943-4f24f54ddde9?w=500&auto=format&fit=crop&q=60' },
    ],
    pasta: [
      { id: 5, name: 'پاستا آلفردو با مرغ', price: '۳۲۰,۰۰۰', desc: 'پنه، فیله مرغ گریل، قارچ اسلایس، خامه طبیعی دوشاب', isSpicy: false, discount: '', image: 'https://images.unsplash.com/photo-1645112411341-6c4fd023714a?w=500&auto=format&fit=crop&q=60' },
    ]
  };

  // Framer Motion scroll and parallax hooks
  const { scrollY } = useScroll();
  const yStudio = useTransform(scrollY, [0, 1000], [0, -45]);
  const yCustomer = useTransform(scrollY, [0, 1000], [0, 45]);

  // Framer Motion presets
  const springTransition = { type: 'spring', damping: 25, stiffness: 300 };
  
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 24 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { ...springTransition }
    }
  };

  // Dedicated variants for sections
  const trustContainerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.1,
      }
    }
  };

  const trustItemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] }
    }
  };

  const stepsContainerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.15
      }
    }
  };

  const stepItemVariants = {
    hidden: { opacity: 0, x: 40 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { type: 'spring', damping: 20, stiffness: 100 }
    }
  };

  const featureCardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { type: 'spring', damping: 20, stiffness: 100 }
    }
  };

  const editorContainerVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: { 
        duration: 0.8, 
        ease: [0.16, 1, 0.3, 1],
        staggerChildren: 0.15,
        delayChildren: 0.3
      }
    }
  };

  const testimonialContainerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.15
      }
    }
  };

  const testimonialItemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] }
    }
  };

  // Dedicated loading sequence states for the Split Hero visual
  const heroStudioPhone = {
    hidden: { opacity: 0, x: 40, scale: 0.95 },
    visible: { 
      opacity: 1, 
      x: 0, 
      scale: 1,
      transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] }
    }
  };

  const heroLivePhone = {
    hidden: { opacity: 0, x: -40, scale: 0.95 },
    visible: { 
      opacity: 1, 
      x: 0, 
      scale: 1,
      transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 1.4 }
    }
  };

  const svgLineVariant = {
    hidden: { pathLength: 0, opacity: 0 },
    visible: { 
      pathLength: 1, 
      opacity: 1,
      transition: { duration: 0.8, ease: 'easeInOut', delay: 0.8 }
    }
  };

  const arrowPulseVariant = {
    hidden: { opacity: 0, y: -10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, delay: 0.9, repeat: Infinity, repeatType: 'reverse' as const }
    }
  };

  return (
    <div className="min-h-screen bg-[#F7F7F8] text-[#18181B] font-['Vazirmatn'] selection:bg-[#10b981]/10 selection:text-[#10b981] overflow-x-hidden leading-relaxed" style={{ direction: 'rtl' }}>
      
      {/* Hero Section */}
      <header id="hero-section" className="relative py-20 lg:py-32 bg-[#F7F7F8] border-b border-slate-200/50 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
          
          {/* Hero Description (Right Column) */}
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: false, amount: 0.1 }}
            variants={containerVariants}
            className="lg:col-span-5 text-right flex flex-col items-start lg:items-end justify-center"
          >
            {/* Utility Eyebrow tag */}
            <motion.div 
              variants={itemVariants}
              className="inline-flex items-center gap-2 bg-[#10b981]/5 text-[#10b981] px-3.5 py-1.5 rounded-full border border-[#10b981]/15 text-[11px] font-bold tracking-wider mb-6 self-start lg:self-auto"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>پلتفرم مدیریت منو و سفارش برای کافه و رستوران</span>
            </motion.div>

            {/* Headline (Enforce strict max 3 lines wrap on desktop) */}
            <motion.h1 
              variants={itemVariants}
              className="text-4xl md:text-5xl lg:text-5xl xl:text-6xl font-black text-[#18181B] tracking-tighter leading-[1.1] mb-6 max-w-2xl text-right"
            >
              هرچی تو استودیو طراحی میکنی، <span className="text-[#10b981]">دقیقاً همونه</span> که مشتری میبینه
            </motion.h1>

            {/* Subheadline */}
            <motion.p 
              variants={itemVariants}
              className="text-base sm:text-lg text-[#71717A] mb-8 leading-relaxed max-w-[55ch] text-right font-medium"
            >
              منو، دسته‌بندی، محصولات و سبد خرید رو مثل کانوا بچین — بدون یک خط کد، بدون دردسر و بدون فاصله بین چیزی که ساختی و چیزی که مشتری تجربه میکنه.
            </motion.p>

            {/* CTAs */}
            <motion.div 
              variants={itemVariants}
              className="flex flex-wrap gap-4 items-center w-full justify-start lg:justify-start"
            >
              <button 
                id="hero-cta-start"
                onClick={onStartFreeClick}
                className="px-8 py-4 bg-[#10b981] hover:bg-[#10b981]/90 text-white rounded-2xl font-black shadow-xl shadow-[#10b981]/20 hover:shadow-2xl hover:shadow-[#10b981]/30 hover:-translate-y-0.5 active:translate-y-0 active:scale-98 focus:outline-none focus:ring-4 focus:ring-[#10b981]/20 transition-all cursor-pointer flex items-center gap-3 group"
              >
                شروع رایگان و بی دردسر
                <span className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center transition-transform group-hover:translate-x-[-3px]">
                  <ChevronLeft className="w-4 h-4 text-white" />
                </span>
              </button>
              <a 
                href="#how-it-works"
                id="hero-cta-demo"
                className="px-7 py-4 bg-white hover:bg-slate-50 text-[#18181B] border border-slate-200 rounded-2xl font-bold hover:border-slate-300 active:scale-98 focus:outline-none focus:ring-4 focus:ring-slate-100 transition-all flex items-center gap-2"
              >
                <Play className="w-4 h-4 fill-[#18181B]" />
                دیدن دمو و راهنما
              </a>
            </motion.div>
          </motion.div>

          {/* Hero Visual Studio/Phone Split Scene (Left Column) */}
          <div className="lg:col-span-7 flex flex-col md:flex-row items-center justify-center gap-4 lg:gap-8 relative min-h-[500px]">
            
            {/* Right: Studio Canvas Designer (Interactive Mockup) */}
            <motion.div 
              initial="hidden"
              animate="visible"
              variants={heroStudioPhone}
              style={{ y: yStudio }}
              className="w-full max-w-[280px] bg-slate-900 rounded-[2.5rem] border-[6px] border-slate-950 shadow-2xl relative overflow-hidden shrink-0"
            >
              {/* Studio Header bar */}
              <div className="bg-slate-950 text-white py-3 px-4 flex items-center justify-between text-[10px] font-bold border-b border-slate-800">
                <div className="flex items-center gap-1.5 text-[#10b981]">
                  <span className="w-2 h-2 rounded-full bg-[#10b981] animate-pulse" />
                  <span>استودیو طراحی</span>
                </div>
                <div className="text-[9px] text-[#71717A] font-mono">WORKSPACE_V1</div>
              </div>

              {/* Canvas Content Area */}
              <div className="bg-white p-4 h-[380px] overflow-y-auto flex flex-col select-none">
                {/* Hero Banner Mock */}
                <div className="w-full h-24 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl p-3 text-white flex flex-col justify-end relative overflow-hidden mb-4 shadow-sm border border-emerald-400/20">
                  <div className="absolute inset-0 bg-black/10" />
                  <div className="relative z-10 text-right">
                    <h3 className="text-xs font-black">پیتزا سیسیلی لذیذ</h3>
                    <p className="text-[8px] opacity-80 mt-0.5">طعم واقعی جنوب ایتالیا با خمیر دست‌ساز</p>
                  </div>
                </div>

                {/* Category Chips Mock */}
                <div className="flex gap-1.5 overflow-hidden mb-4 pb-1">
                  {categories.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => setActiveCategory(cat.id)}
                      className={`px-3 py-1.5 rounded-lg text-[9px] font-black transition-all ${
                        activeCategory === cat.id
                          ? 'bg-[#10b981] text-white'
                          : 'bg-slate-100 text-[#71717A] hover:bg-slate-200'
                      }`}
                    >
                      {cat.name}
                    </button>
                  ))}
                </div>

                {/* Product List Mock */}
                <div className="space-y-3 flex-1">
                  {products[activeCategory].map((prod) => (
                    <div 
                      key={prod.id} 
                      className={`p-2.5 rounded-xl border transition-all flex gap-2 relative ${
                        studioHoveredProduct === prod.id 
                          ? 'border-[#10b981] bg-emerald-50/20 shadow-sm' 
                          : 'border-slate-100 bg-white'
                      }`}
                      onMouseEnter={() => setStudioHoveredProduct(prod.id)}
                      onMouseLeave={() => setStudioHoveredProduct(null)}
                    >
                      {/* Interactive Selection ring in studio mock */}
                      {studioHoveredProduct === prod.id && (
                        <div className="absolute -top-1.5 -left-1.5 bg-[#10b981] text-white text-[7px] px-1 rounded-md font-bold">کلیک برای ادیت</div>
                      )}

                      <img src={prod.image} alt="" className="w-12 h-12 rounded-lg object-cover bg-slate-100 shrink-0" />
                      <div className="flex-1 text-right flex flex-col justify-between">
                        <div>
                          <h4 className="text-[10px] font-black text-[#18181B] leading-none mb-1">{prod.name}</h4>
                          <p className="text-[8px] text-[#71717A] leading-tight line-clamp-1">{prod.desc}</p>
                        </div>
                        <div className="flex justify-between items-center mt-1">
                          {prod.discount ? (
                            <span className="text-[8px] bg-red-50 text-red-600 px-1 rounded font-bold">{prod.discount} تخفیف</span>
                          ) : <span />}
                          <span className="text-[9px] font-black text-[#10b981] font-mono leading-none">{prod.price} تومان</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Status bar in Studio Mockup */}
              <div className="bg-slate-950 p-2 text-center border-t border-slate-800 text-[8px] text-[#71717A] font-medium flex justify-between items-center px-4">
                <span>تغییرات ذخیره شد</span>
                <span className="text-[#22C55E]">● آماده انتشار</span>
              </div>
            </motion.div>

            {/* Connecting SVG Path Line for desktop / Stack arrow for mobile */}
            <div className="absolute z-10 pointer-events-none hidden md:block w-32 h-20">
              <svg width="120" height="40" viewBox="0 0 120 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                <motion.path 
                  initial="hidden"
                  animate="visible"
                  variants={svgLineVariant}
                  d="M10 20C40 20 80 20 110 20" 
                  stroke="#10b981" 
                  strokeWidth="2.5" 
                  strokeDasharray="6 4" 
                />
                <motion.polygon 
                  initial="hidden"
                  animate="visible"
                  variants={svgLineVariant}
                  points="9,20 14,16 14,24" 
                  fill="#10b981" 
                />
              </svg>
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#10b981] text-white text-[8px] px-2 py-1 rounded-full font-black tracking-widest uppercase shadow-md shadow-[#10b981]/30">LIVE</div>
            </div>

            {/* Mobile-only Downward animated connector */}
            <div className="md:hidden flex flex-col items-center my-2 text-[#10b981]">
              <motion.div 
                initial="hidden"
                animate="visible"
                variants={arrowPulseVariant}
                className="flex flex-col items-center gap-0.5"
              >
                <span className="text-[10px] font-black bg-[#10b981] text-white px-2.5 py-0.5 rounded-full shadow-md">پخش لحظه‌ای روی گوشی مشتری</span>
                <ArrowDown className="w-5 h-5 mt-1" />
              </motion.div>
            </div>

            {/* Left: Customer Side Phone (Live Reacting Mockup) */}
            <motion.div 
              initial="hidden"
              animate="visible"
              variants={heroLivePhone}
              style={{ y: yCustomer }}
              className="w-full max-w-[280px] bg-slate-950 rounded-[2.5rem] border-[6px] border-slate-900 shadow-2xl relative overflow-hidden shrink-0"
            >
              {/* Customer Phone Status bar */}
              <div className="bg-slate-900 text-white py-3 px-5 flex items-center justify-between text-[10px] font-black">
                <div className="flex items-center gap-1.5 text-[#22C55E]">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#22C55E] animate-ping" />
                  <span>زنده روی موبایل مشتری</span>
                </div>
                <div className="text-[9px] text-[#71717A] font-mono">12:45</div>
              </div>

              {/* Live Menu Content (Renders identically to Studio selection) */}
              <div className="bg-[#F2F4F7] p-4 h-[380px] overflow-y-auto flex flex-col">
                {/* Hero Banner (Synced with Studio) */}
                <div className="w-full h-24 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl p-3 text-white flex flex-col justify-end relative overflow-hidden mb-4 shadow-sm">
                  <div className="absolute inset-0 bg-black/10" />
                  <div className="relative z-10 text-right">
                    <h3 className="text-xs font-black">پیتزا سیسیلی لذیذ</h3>
                    <p className="text-[8px] opacity-80 mt-0.5">طعم واقعی جنوب ایتالیا با خمیر دست‌ساز</p>
                  </div>
                </div>

                {/* Categories Scroll Area (Synced with Studio) */}
                <div className="flex gap-1.5 overflow-hidden mb-4 pb-1">
                  {categories.map((cat) => (
                    <div
                      key={cat.id}
                      className={`px-3 py-1.5 rounded-lg text-[9px] font-black text-center transition-all ${
                        activeCategory === cat.id
                          ? 'bg-[#10b981] text-white shadow-sm'
                          : 'bg-white text-[#71717A] border border-slate-200/50'
                      }`}
                    >
                      {cat.name}
                    </div>
                  ))}
                </div>

                {/* Products List (Synced and showing real components) */}
                <div className="space-y-3 flex-1">
                  {products[activeCategory].map((prod) => (
                    <div key={prod.id} className="p-2.5 rounded-xl bg-white border border-slate-100 shadow-xs flex gap-2 hover:shadow-md transition-shadow">
                      <img src={prod.image} alt="" className="w-12 h-12 rounded-lg object-cover shrink-0" />
                      <div className="flex-1 text-right flex flex-col justify-between">
                        <div>
                          <div className="flex justify-between items-start">
                            <h4 className="text-[10px] font-black text-[#18181B] leading-none">{prod.name}</h4>
                            {prod.isSpicy && (
                              <span className="text-[7px] bg-red-50 text-red-600 px-1 rounded-sm font-black flex items-center gap-0.5 border border-red-100">
                                <span>تند</span>
                              </span>
                            )}
                          </div>
                          <p className="text-[8px] text-[#71717A] leading-tight line-clamp-1 mt-1">{prod.desc}</p>
                        </div>
                        <div className="flex justify-between items-center mt-1">
                          <button className="w-5 h-5 bg-[#10b981] text-white rounded-md flex items-center justify-center text-xs font-black shadow-xs hover:bg-[#10b981]/90">+</button>
                          <span className="text-[9px] font-black text-slate-800 font-mono leading-none">{prod.price} تومان</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Bottom Nav Mock on Customer Phone */}
              <div className="bg-white px-6 py-2.5 border-t border-slate-200/80 flex items-center justify-between text-[#71717A]">
                <div className="flex flex-col items-center gap-0.5 cursor-pointer text-[#10b981]">
                  <ShoppingBag className="w-4 h-4" />
                  <span className="text-[8px] font-black">منو</span>
                </div>
                <div className="relative cursor-pointer flex flex-col items-center gap-0.5">
                  <div className="absolute -top-1 -right-2 bg-[#10b981] text-white text-[7px] w-3.5 h-3.5 rounded-full flex items-center justify-center font-bold">۱</div>
                  <ShoppingBag className="w-4 h-4" />
                  <span className="text-[8px] font-bold">سبد خرید</span>
                </div>
              </div>
            </motion.div>

          </div>

        </div>
      </header>

      {/* Trust & Highlights Row below the fold */}
      <section className="bg-white py-12 border-b border-slate-200/60 shadow-xs">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div 
            variants={trustContainerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: false, margin: "0px 0px -15% 0px" }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12"
          >
            
            <motion.div variants={trustItemVariants} className="flex items-center gap-4 text-right">
              <div className="w-12 h-12 bg-[#10b981]/5 text-[#10b981] rounded-2xl flex items-center justify-center shrink-0 border border-[#10b981]/10 shadow-sm">
                <MousePointerClick className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-sm font-black text-[#18181B]">بدون نیاز به دانش فنی</h4>
                <p className="text-xs text-[#71717A] mt-1">تمام المان‌ها را با کشیدن و رها کردن و بدون کدنویسی شخصی‌سازی کنید.</p>
              </div>
            </motion.div>

            <motion.div variants={trustItemVariants} className="flex items-center gap-4 text-right">
              <div className="w-12 h-12 bg-[#10b981]/5 text-[#10b981] rounded-2xl flex items-center justify-center shrink-0 border border-[#10b981]/10 shadow-sm">
                <Clock className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-sm font-black text-[#18181B]">طراحی در چند دقیقه</h4>
                <p className="text-xs text-[#71717A] mt-1">از قالب‌های آماده و الگوهای تایید شده استفاده کنید و منو را در چند دقیقه بسازید.</p>
              </div>
            </motion.div>

            <motion.div variants={trustItemVariants} className="flex items-center gap-4 text-right">
              <div className="w-12 h-12 bg-[#10b981]/5 text-[#10b981] rounded-2xl flex items-center justify-center shrink-0 border border-[#10b981]/10 shadow-sm">
                <HeartHandshake className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-sm font-black text-[#18181B]">پشتیبانی فارسی تمام وقت</h4>
                <p className="text-xs text-[#71717A] mt-1">در تمام مراحل راه‌اندازی، اتصال دامنه و پشتیبانی فنی در کنار شما هستیم.</p>
              </div>
            </motion.div>

          </motion.div>
        </div>
      </section>

      {/* How it works section (Numbered 1/2/3) */}
      <section id="how-it-works" className="py-24 bg-[#F7F7F8] overflow-hidden">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-[10px] uppercase tracking-[0.2em] font-black text-[#10b981] bg-[#10b981]/5 px-3 py-1 rounded-full border border-[#10b981]/10">مسیر راه‌اندازی منو</span>
            <h2 className="text-3xl md:text-4xl font-black text-[#18181B] tracking-tight mt-4 leading-none">سه قدم ساده تا منوی مدرن شما</h2>
            <p className="text-[#71717A] mt-4 font-medium text-sm sm:text-base">در کمتر از ده دقیقه، بدون واسطه و بدون کارمزد، بستر سفارش‌گیری مستقیم خود را پایه‌ریزی کنید.</p>
          </div>

          <motion.div 
            variants={stepsContainerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: false, margin: "-100px" }}
            className="grid grid-cols-1 lg:grid-cols-3 gap-8 relative"
          >
            
            {/* Step 1 */}
            <motion.div 
              variants={stepItemVariants}
              className="bg-white p-8 rounded-[2rem] border border-slate-200/50 shadow-sm relative overflow-hidden group hover:shadow-md hover:border-[#10b981]/25 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex justify-between items-center mb-6">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-[#10b981] flex items-center justify-center font-black text-xl font-mono border border-emerald-100">1</div>
                  <Layout className="w-6 h-6 text-[#71717A] group-hover:text-[#10b981] transition-colors" />
                </div>
                <h3 className="text-lg font-black text-[#18181B] mb-3">منوی خودت رو طراحی کن</h3>
                <p className="text-sm text-[#71717A] leading-relaxed">با استفاده از استودیو ویژوال، دسته‌بندی‌ها، محصولات، تخفیف‌ها و برندینگ رستوران خود را به سادگی و به صورت کاملاً زنده طراحی کنید.</p>
              </div>
              <div className="mt-8 pt-4 border-t border-slate-100 text-xs font-bold text-[#10b981] flex items-center gap-1">
                <span>استودیو پیشرفته کشیدن و رها کردن</span>
              </div>
            </motion.div>
 
            {/* Step 2 */}
            <motion.div 
              variants={stepItemVariants}
              className="bg-white p-8 rounded-[2rem] border border-slate-200/50 shadow-sm relative overflow-hidden group hover:shadow-md hover:border-[#10b981]/25 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex justify-between items-center mb-6">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-[#10b981] flex items-center justify-center font-black text-xl font-mono border border-emerald-100">2</div>
                  <Zap className="w-6 h-6 text-[#71717A] group-hover:text-[#10b981] transition-colors" />
                </div>
                <h3 className="text-lg font-black text-[#18181B] mb-3">با یک کلیک منتشر کن</h3>
                <p className="text-sm text-[#71717A] leading-relaxed">بلافاصله بعد از طراحی، طرح نهایی شما با دامنه‌ اختصاصی یا کد QR برای مشتری‌ها روی گوشی‌هاشون فعال میشه و مستقیماً خرید میکنند.</p>
              </div>
              <div className="mt-8 pt-4 border-t border-slate-100 text-xs font-bold text-[#10b981] flex items-center gap-1">
                <span>به‌روزرسانی آنی و زنده منو</span>
              </div>
            </motion.div>
 
            {/* Step 3 */}
            <motion.div 
              variants={stepItemVariants}
              className="bg-white p-8 rounded-[2rem] border border-slate-200/50 shadow-sm relative overflow-hidden group hover:shadow-md hover:border-[#10b981]/25 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex justify-between items-center mb-6">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-[#10b981] flex items-center justify-center font-black text-xl font-mono border border-emerald-100">3</div>
                  <ShoppingBag className="w-6 h-6 text-[#71717A] group-hover:text-[#10b981] transition-colors" />
                </div>
                <h3 className="text-lg font-black text-[#18181B] mb-3">سفارش‌ها رو مدیریت کن</h3>
                <p className="text-sm text-[#71717A] leading-relaxed">هر سفارشی که مشتری ثبت میکنه، فوراً با جزئیات کامل، اطلاعات میز و پرداخت، در داشبورد سفارشات رستوران شما زنگ میخوره و نمایش داده میشه.</p>
              </div>
              <div className="mt-8 pt-4 border-t border-slate-100 text-xs font-bold text-[#10b981] flex items-center gap-1">
                <span>اتصال مستقیم به چاپگر و صندوق</span>
              </div>
            </motion.div>
 
          </motion.div>
        </div>
      </section>

      {/* Feature highlights grid */}
      <section id="features" className="py-24 bg-white border-t border-slate-200/50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-[10px] uppercase tracking-[0.2em] font-black text-[#10b981] bg-[#10b981]/5 px-3 py-1 rounded-full border border-[#10b981]/10">ویژگی‌های برجسته پلتفرم</span>
            <h2 className="text-3xl md:text-4xl font-black text-[#18181B] tracking-tight mt-4 leading-none">مجهز به هر آنچه برای فروش نیاز دارید</h2>
            <p className="text-[#71717A] mt-4 font-medium text-sm sm:text-base">امکاناتی فراتر از یک منوی معمولی، طراحی شده برای بهینه‌سازی فروش و تجربه کاربری مدرن.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            
            {/* Feature 1 */}
            <motion.div 
              variants={featureCardVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: false, amount: 0.1 }}
              whileHover={{ y: -6, scale: 1.02, boxShadow: "0 20px 25px -5px rgba(16, 185, 129, 0.05), 0 10px 10px -5px rgba(0, 0, 0, 0.04)" }}
              className="bg-[#F7F7F8] p-8 rounded-[2rem] border border-slate-200/40 hover:border-[#10b981]/20 transition-colors duration-300 flex items-start gap-5 cursor-pointer"
            >
              <div className="w-12 h-12 rounded-2xl bg-[#10b981]/5 text-[#10b981] flex items-center justify-center shrink-0 border border-[#10b981]/10 shadow-sm">
                <Layout className="w-6 h-6" />
              </div>
              <div className="text-right">
                <h3 className="text-lg font-black text-[#18181B] mb-2">استودیو پیشرفته منوساز</h3>
                <p className="text-sm text-[#71717A] leading-relaxed">دسته‌بندی، هیرو بنرها، محصولات ویژه، فیلترها و فوتر سایت را به صورت ویژوال و مثل ساختن اسلاید تغییر دهید تا هویت کافه شما حفظ شود.</p>
              </div>
            </motion.div>
 
            {/* Feature 2 */}
            <motion.div 
              variants={featureCardVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: false, amount: 0.1 }}
              whileHover={{ y: -6, scale: 1.02, boxShadow: "0 20px 25px -5px rgba(16, 185, 129, 0.05), 0 10px 10px -5px rgba(0, 0, 0, 0.04)" }}
              className="bg-[#F7F7F8] p-8 rounded-[2rem] border border-slate-200/40 hover:border-[#10b981]/20 transition-colors duration-300 flex items-start gap-5 cursor-pointer"
            >
              <div className="w-12 h-12 rounded-2xl bg-[#10b981]/5 text-[#10b981] flex items-center justify-center shrink-0 border border-[#10b981]/10 shadow-sm">
                <Smartphone className="w-6 h-6" />
              </div>
              <div className="text-right">
                <h3 className="text-lg font-black text-[#18181B] mb-2">سفارش‌گیری هم‌تراز پلتفرم‌های بزرگ</h3>
                <p className="text-sm text-[#71717A] leading-relaxed">انتقال سریع از دسته‌بندی به محصول، انتخاب ملزومات و تغییرات محصول، ثبت نهایی با سبد خرید پویا و زیبا، عینا مطابق استانداردهای اسنپ‌فود.</p>
              </div>
            </motion.div>
 
            {/* Feature 3 */}
            <motion.div 
              variants={featureCardVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: false, amount: 0.1 }}
              whileHover={{ y: -6, scale: 1.02, boxShadow: "0 20px 25px -5px rgba(16, 185, 129, 0.05), 0 10px 10px -5px rgba(0, 0, 0, 0.04)" }}
              className="bg-[#F7F7F8] p-8 rounded-[2rem] border border-slate-200/40 hover:border-[#10b981]/20 transition-colors duration-300 flex items-start gap-5 cursor-pointer"
            >
              <div className="w-12 h-12 rounded-2xl bg-[#10b981]/5 text-[#10b981] flex items-center justify-center shrink-0 border border-[#10b981]/10 shadow-sm">
                <Settings className="w-6 h-6" />
              </div>
              <div className="text-right">
                <h3 className="text-lg font-black text-[#18181B] mb-2">مدیریت محصولات همه‌جانبه</h3>
                <p className="text-sm text-[#71717A] leading-relaxed">موجودی لحظه‌ای محصولات را فعال یا غیرفعال کنید. قیمت‌های تخفیف خورده، برچسب‌های ویژه (رژیمی، تند، پیشنهاد سرآشپز) و ترکیبات دلخواه ثبت کنید.</p>
              </div>
            </motion.div>
 
            {/* Feature 4 */}
            <motion.div 
              variants={featureCardVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: false, amount: 0.1 }}
              whileHover={{ y: -6, scale: 1.02, boxShadow: "0 20px 25px -5px rgba(16, 185, 129, 0.05), 0 10px 10px -5px rgba(0, 0, 0, 0.04)" }}
              className="bg-[#F7F7F8] p-8 rounded-[2rem] border border-slate-200/40 hover:border-[#10b981]/20 transition-colors duration-300 flex items-start gap-5 cursor-pointer"
            >
              <div className="w-12 h-12 rounded-2xl bg-[#10b981]/5 text-[#10b981] flex items-center justify-center shrink-0 border border-[#10b981]/10 shadow-sm">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div className="text-right">
                <h3 className="text-lg font-black text-[#18181B] mb-2">پنل پایش سفارشات زنده</h3>
                <p className="text-sm text-[#71717A] leading-relaxed">هر سفارشی که توسط مشتریان نهایی ثبت می‌شود، فوراً با زنگ اخطار و نوتیفیکیشن در داشبورد مدیریت و آشپزخانه شما قرار می‌گیرد.</p>
              </div>
            </motion.div>
 
          </div>
        </div>
      </section>

      {/* Secondary Showcase Section (Full-bleed Dark #0A0A0A) */}
      <section className="py-24 bg-[#0A0A0A] text-white overflow-hidden relative">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(16, 185, 129,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(16, 185, 129,0.03)_1px,transparent_1px)] bg-[size:32px_32px] opacity-40 pointer-events-none" />
        <div className="max-w-7xl mx-auto px-6">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
            
            {/* Caption & Description (Right half) */}
            <div className="lg:col-span-5 text-right">
              <span className="text-[10px] uppercase tracking-[0.2em] font-black text-[#10b981] bg-[#10b981]/10 px-3 py-1 rounded-full border border-[#10b981]/20">مدیریت هوشمند محصولات</span>
              <h2 className="text-3xl md:text-4xl font-black tracking-tight mt-4 leading-none text-white">کنترل کامل جزئیات منو از پنل مدیریت</h2>
              <p className="text-[#71717A] mt-6 leading-relaxed text-sm sm:text-base">
                با پنل ویرایش اختصاصی، برای هر محصول گزینه‌های متعددی تعریف کنید. موجود بودن را با یک سوئیچ تغییر دهید، مواد تشکیل‌دهنده را کم و زیاد کنید و روی هر آیتم برچسب دلخواه بزنید.
              </p>
              <div className="mt-8 space-y-3.5">
                <div className="flex items-center gap-3 justify-end">
                  <span className="text-sm font-bold text-slate-300">امکان تغییر قیمت‌ها و تخفیف‌ها به صورت آنی</span>
                  <div className="w-5 h-5 rounded-full bg-[#10b981]/20 text-[#10b981] flex items-center justify-center shrink-0 border border-[#10b981]/30">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  </div>
                </div>
                <div className="flex items-center gap-3 justify-end">
                  <span className="text-sm font-bold text-slate-300">تعریف افزودنی‌ها و شخصی‌سازی سفارش برای مشتری</span>
                  <div className="w-5 h-5 rounded-full bg-[#10b981]/20 text-[#10b981] flex items-center justify-center shrink-0 border border-[#10b981]/30">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  </div>
                </div>
                <div className="flex items-center gap-3 justify-end">
                  <span className="text-sm font-bold text-slate-300">اعلام زنده اتمام موجودی برای جلوگیری از خطای سفارش</span>
                  <div className="w-5 h-5 rounded-full bg-[#10b981]/20 text-[#10b981] flex items-center justify-center shrink-0 border border-[#10b981]/30">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  </div>
                </div>
              </div>
            </div>

            {/* Simulated UI Mockup of Product Edit (Left half) */}
            <div className="lg:col-span-7 w-full flex items-center justify-center">
              <motion.div 
                variants={editorContainerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: false }}
                className="w-full max-w-xl bg-slate-900 rounded-3xl border border-white/10 p-6 md:p-8 shadow-2xl relative"
              >
                {/* Simulated Mac Window controls */}
                <div className="flex items-center gap-1.5 mb-6 justify-end">
                  <span className="w-3 h-3 rounded-full bg-slate-800" />
                  <span className="w-3 h-3 rounded-full bg-slate-800" />
                  <span className="w-3 h-3 rounded-full bg-[#10b981]/60" />
                  <span className="text-[10px] text-slate-500 mr-3 font-mono">PRODUCT_EDITOR.CSS</span>
                </div>

                <div className="space-y-6">
                  {/* Item row 1: Name and price */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="text-right">
                      <label className="text-[10px] uppercase tracking-wider text-slate-500 font-bold block mb-2">نام محصول (فارسی)</label>
                      <div className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white font-bold text-right">
                        پیتزا پپرونی مخصوص زغالی
                      </div>
                    </div>
                    <div className="text-right">
                      <label className="text-[10px] uppercase tracking-wider text-slate-500 font-bold block mb-2">قیمت پایه (تومان)</label>
                      <div className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-[#10b981] font-black text-left font-mono">
                        ۳۴۰,۰۰۰
                      </div>
                    </div>
                  </div>

                  {/* Switch Controls */}
                  <div className="bg-slate-950 rounded-2xl p-4 border border-slate-800/80 space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <motion.span 
                          animate={{ opacity: [1, 0.5, 1] }}
                          transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
                          className="text-[9px] bg-[#22C55E]/10 text-[#22C55E] px-2 py-0.5 rounded font-black flex items-center gap-1"
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-[#22C55E] animate-pulse" />
                          فعال
                        </motion.span>
                      </div>
                      <span className="text-xs font-bold text-slate-300">موجودی محصول در سالن</span>
                    </div>
                    <div className="h-px bg-slate-800/50" />
                    <div className="flex items-center justify-between">
                      <motion.div 
                        animate={{ scale: [1, 1.05, 1] }}
                        transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
                        className="flex items-center gap-1.5 text-[#10b981]"
                      >
                        <span className="text-xs font-mono text-slate-400">۱۰٪ تخفیف</span>
                        <span className="w-2 h-2 rounded-full bg-[#10b981] animate-ping" />
                      </motion.div>
                      <span className="text-xs font-bold text-slate-300">فعال‌سازی جشنواره تخفیف</span>
                    </div>
                  </div>

                  {/* Product Tag badging simulated selector */}
                  <div className="text-right">
                    <label className="text-[10px] uppercase tracking-wider text-slate-500 font-bold block mb-2">برچسب روی عکس محصول</label>
                    <div className="flex flex-wrap gap-2 justify-end">
                      <motion.span 
                        whileHover={{ scale: 1.05 }}
                        animate={{ opacity: [1, 0.8, 1] }}
                        transition={{ repeat: Infinity, duration: 2.5, ease: "easeInOut" }}
                        className="px-3 py-1.5 rounded-lg text-xs font-bold bg-[#10b981] text-white border border-[#10b981]/35 cursor-pointer shadow-md shadow-[#10b981]/10"
                      >
                        پرفروش ترین 🔥
                      </motion.span>
                      <motion.span 
                        whileHover={{ scale: 1.05 }}
                        className="px-3 py-1.5 rounded-lg text-xs font-bold bg-slate-950 text-slate-400 border border-slate-800 cursor-pointer hover:border-slate-700 hover:text-slate-300 transition-colors"
                      >
                        تند و اسپایسی
                      </motion.span>
                      <motion.span 
                        whileHover={{ scale: 1.05 }}
                        className="px-3 py-1.5 rounded-lg text-xs font-bold bg-slate-950 text-slate-400 border border-slate-800 cursor-pointer hover:border-slate-700 hover:text-slate-300 transition-colors"
                      >
                        پیشنهاد شف
                      </motion.span>
                      <motion.span 
                        whileHover={{ scale: 1.05 }}
                        className="px-3 py-1.5 rounded-lg text-xs font-bold bg-slate-950 text-slate-400 border border-slate-800 cursor-pointer hover:border-slate-700 hover:text-slate-300 transition-colors"
                      >
                        رژیمی
                      </motion.span>
                    </div>
                  </div>
                </div>

                {/* Simulated action message */}
                <div className="mt-6 pt-4 border-t border-slate-800 flex justify-between items-center">
                  <span className="text-[10px] text-slate-500">آخرین ویرایش: ۲ ثانیه پیش</span>
                  <div className="px-4 py-1.5 bg-[#10b981] text-white rounded-lg text-xs font-black shadow-lg shadow-[#10b981]/10">ذخیره خودکار</div>
                </div>
              </motion.div>
            </div>

          </div>

        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-[10px] uppercase tracking-[0.2em] font-black text-[#10b981] bg-[#10b981]/5 px-3 py-1 rounded-full border border-[#10b981]/10">رضایت مشتریان ما</span>
            <h2 className="text-3xl md:text-4xl font-black text-[#18181B] tracking-tight mt-4 leading-none">صاحبان رستوران‌ها درباره ما چه می‌گویند؟</h2>
            <p className="text-[#71717A] mt-4 font-medium text-sm sm:text-base">بشنوید از کسانی که سرعت، استقلال و تجربه سفارش‌گیری بهتری را تجربه کرده‌اند.</p>
          </div>

          <motion.div 
            variants={testimonialContainerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: false, amount: 0.1 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            
            {/* Quote 1 */}
            <motion.div 
              variants={testimonialItemVariants}
              whileHover={{ y: -4 }}
              className="bg-[#F7F7F8] p-8 rounded-[2rem] border border-slate-200/50 shadow-xs hover:shadow-md transition-all flex flex-col justify-between cursor-pointer"
            >
              <p className="text-slate-700 text-sm leading-relaxed mb-6 italic">
                «منوهای کاغذی ما همیشه بخاطر تغییرات قیمت کثیف یا نامرتب بودن. از وقتی استودیو ویترین رو راه‌اندازی کردیم، هر صبح قیمت‌ها رو خودم تو ۵ ثانیه ویرایش میکنم و عکس محصولات جدید رو آپلود میکنم. فوق‌العاده‌اس.»
              </p>
              <div className="flex items-center gap-3 justify-end text-right text-[#18181B]">
                <div>
                  <h4 className="text-xs font-black">احسان خسروی</h4>
                  <p className="text-[10px] text-[#71717A] mt-0.5">مدیر کافه رستوران راک</p>
                </div>
                <div className="w-10 h-10 rounded-full bg-slate-200 object-cover overflow-hidden">
                  <div className="w-full h-full bg-gradient-to-br from-[#10b981] to-[#0A0A0A]" />
                </div>
              </div>
            </motion.div>

            {/* Quote 2 */}
            <motion.div 
              variants={testimonialItemVariants}
              whileHover={{ y: -4 }}
              className="bg-[#F7F7F8] p-8 rounded-[2rem] border border-slate-200/50 shadow-xs hover:shadow-md transition-all flex flex-col justify-between cursor-pointer"
            >
              <p className="text-slate-700 text-sm leading-relaxed mb-6 italic">
                «دیگه لازم نیست برای کوچک‌ترین تغییرات به طراح یا توسعه‌دهنده زنگ بزنم و منتظر بمونم. تمام منو و چیدمان پیتزاها و برگرها رو خودم مثل بوم کانوا جابجا میکنم و همون لحظه روی موبایل مشتری‌ها منتشر میشه.»
              </p>
              <div className="flex items-center gap-3 justify-end text-right text-[#18181B]">
                <div>
                  <h4 className="text-xs font-black">مریم سادات</h4>
                  <p className="text-[10px] text-[#71717A] mt-0.5">صاحب مطبخ طهرون</p>
                </div>
                <div className="w-10 h-10 rounded-full bg-slate-200 object-cover overflow-hidden">
                  <div className="w-full h-full bg-gradient-to-br from-[#0A0A0A] to-emerald-400" />
                </div>
              </div>
            </motion.div>

            {/* Quote 3 */}
            <motion.div 
              variants={testimonialItemVariants}
              whileHover={{ y: -4 }}
              className="bg-[#F7F7F8] p-8 rounded-[2rem] border border-slate-200/50 shadow-xs hover:shadow-md transition-all flex flex-col justify-between cursor-pointer"
            >
              <p className="text-slate-700 text-sm leading-relaxed mb-6 italic">
                «مشتری‌ها خیلی راحت‌تر از قبل سفارش میدن. با داشتن کد QR اختصاصی روی هر میز، بدون معطلی گارسون، منو رو چک میکنن و سفارششون با شماره میز مستقیم میاد روی تبلت صندوقدار ما.»
              </p>
              <div className="flex items-center gap-3 justify-end text-right text-[#18181B]">
                <div>
                  <h4 className="text-xs font-black">کامیار راد</h4>
                  <p className="text-[10px] text-[#71717A] mt-0.5">مدیر داخلی فود کورت هگمتانه</p>
                </div>
                <div className="w-10 h-10 rounded-full bg-slate-200 object-cover overflow-hidden">
                  <div className="w-full h-full bg-gradient-to-br from-[#10b981] to-emerald-800" />
                </div>
              </div>
            </motion.div>

          </motion.div>
        </div>
      </section>

      {/* Solutions Teaser Row */}
      <section className="py-16 bg-[#F7F7F8] border-t border-b border-slate-200/50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="bg-white p-8 md:p-12 rounded-[2.5rem] border border-slate-200/50 shadow-sm flex flex-col md:flex-row items-center justify-between gap-8 text-right md:text-right">
            <div>
              <span className="text-[10px] uppercase tracking-[0.2em] font-black text-[#10b981] bg-[#10b981]/5 px-3 py-1 rounded-full border border-[#10b981]/10">راهکارهای صنفی ویترین</span>
              <h3 className="text-2xl font-black text-[#18181B] mt-4">آیا راهکار متفاوتی برای صنف خود می‌خواهید؟</h3>
              <p className="text-xs sm:text-sm text-[#71717A] mt-2 max-w-xl">پلتفرم طراحی منو و سفارش‌گیری هوشمند ویترین راهکارهای ویژه‌ای برای کافه‌ها، رستوران‌های زنجیره‌ای، مطبخ‌ها و فودکورت‌ها دارد.</p>
            </div>
            <button 
              id="solutions-teaser-link"
              onClick={onStartFreeClick}
              className="px-6 py-3.5 bg-[#18181B] hover:bg-slate-800 text-white rounded-xl text-xs font-black shadow-md transition-all active:scale-95 flex items-center gap-2 group shrink-0"
            >
              دیدن راهکارها
              <span className="w-5 h-5 rounded-full bg-white/10 flex items-center justify-center transition-transform group-hover:translate-x-[-3px]">
                <ArrowLeft className="w-3.5 h-3.5" />
              </span>
            </button>
          </div>
        </div>
      </section>

      {/* Final CTA band */}
      <section id="final-cta" className="relative py-24 bg-[#10b981] text-white overflow-hidden text-center">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.15)_0%,transparent_80%)]" />
        <div className="max-w-4xl mx-auto px-6 relative z-10">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white mb-6 leading-none tracking-tight">آماده‌اید منوی خود را متحول کنید؟</h2>
          <p className="text-emerald-100 max-w-xl mx-auto mb-10 text-sm sm:text-base font-medium leading-relaxed">بیش از ۵۰۰ رستوران و کافه در سراسر کشور با پلتفرم طراحی منوی هوشمند ویترین، فروش خود را افزایش داده‌اند.</p>
          <button 
            id="final-cta-btn"
            onClick={onStartFreeClick}
            className="px-8 py-4 bg-[#0A0A0A] hover:bg-slate-900 text-white rounded-2xl font-black text-base shadow-2xl active:scale-95 focus:outline-none focus:ring-4 focus:ring-black/20 transition-all flex items-center gap-3 mx-auto group cursor-pointer"
          >
            شروع ساخت منو به صورت رایگان
            <span className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center transition-transform group-hover:translate-x-[-3px]">
              <ChevronLeft className="w-4 h-4 text-white" />
            </span>
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer id="marketing-footer" className="bg-[#0A0A0A] text-slate-400 py-16 border-t border-white/10 text-right">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-16">
            
            {/* Info Column (Rightmost in RTL) */}
            <div className="lg:col-span-2 flex flex-col items-start lg:items-start text-right">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-9 h-9 bg-[#10b981] rounded-lg flex items-center justify-center shadow-lg shadow-[#10b981]/20">
                  <span className="text-white font-black text-lg">وی</span>
                </div>
                <span className="text-lg font-black tracking-tight text-white">ویترین</span>
              </div>
              <p className="text-xs text-slate-500 leading-relaxed max-w-xs">
                پلتفرم ابری یکپارچه طراحی و توسعه منوی دیجیتال و سفارش‌گیری مستقیم. بدون کارمزد، بدون واسطه و بدون سختی کدنویسی.
              </p>
            </div>

            {/* Links Col 1: Product */}
            <div>
              <h4 className="text-xs font-black text-white mb-4">محصول</h4>
              <ul className="space-y-2.5 text-xs">
                <li>
                  <a 
                    href="#features" 
                    onClick={(e) => {
                      if (onNavigateFeatures) {
                        e.preventDefault();
                        onNavigateFeatures();
                      }
                    }}
                    className="hover:text-white transition-colors"
                  >
                    امکانات پلتفرم
                  </a>
                </li>
                <li>
                  <a 
                    href="#solutions" 
                    onClick={(e) => {
                      if (onNavigateSolutions) {
                        e.preventDefault();
                        onNavigateSolutions();
                      }
                    }}
                    className="hover:text-white transition-colors"
                  >
                    راهکارهای صنفی
                  </a>
                </li>
                <li><a href="#how-it-works" className="hover:text-white transition-colors">پیش‌نمایش دمو</a></li>
                <li><a href="#final-cta" className="hover:text-white transition-colors">تعرفه‌ها و اشتراک</a></li>
              </ul>
            </div>

            {/* Links Col 2: Company */}
            <div>
              <h4 className="text-xs font-black text-white mb-4">شرکت</h4>
              <ul className="space-y-2.5 text-xs">
                <li><a href="#how-it-works" className="hover:text-white transition-colors">درباره ما</a></li>
                <li><a href="#contact" className="hover:text-white transition-colors">ارتباط با ما</a></li>
                <li><a href="#features" className="hover:text-white transition-colors">بلاگ و مقالات</a></li>
                <li><a href="#final-cta" className="hover:text-white transition-colors">همکاری با ما</a></li>
              </ul>
            </div>

            {/* Links Col 3: Resources */}
            <div>
              <h4 className="text-xs font-black text-white mb-4">منابع</h4>
              <ul className="space-y-2.5 text-xs">
                <li><a href="#how-it-works" className="hover:text-white transition-colors">مرکز راهنمایی</a></li>
                <li><a href="#how-it-works" className="hover:text-white transition-colors">پشتیبانی فنی</a></li>
                <li><a href="#features" className="hover:text-white transition-colors">امنیت داده‌ها</a></li>
                <li><a href="#how-it-works" className="hover:text-white transition-colors">قوانین و مقررات</a></li>
              </ul>
            </div>

          </div>

          <div className="h-px bg-slate-900 mb-8" />

          {/* Socials & Copyright Row */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6 text-xs text-slate-600">
            {/* Social Icons (Left in RTL flex) */}
            <div className="flex gap-4">
              <a href="#" className="hover:text-[#10b981] transition-colors" aria-label="WhatsApp">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.253 8.477 3.52 2.262 2.268 3.51 5.28 3.505 8.484-.011 6.541-5.348 11.878-11.954 11.878H12a11.815 11.815 0 01-5.683-1.448L.057 24zm8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413zM17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347"/></svg>
              </a>
              <a href="#" className="hover:text-[#10b981] transition-colors" aria-label="Instagram">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
              </a>
              <a href="#" className="hover:text-[#10b981] transition-colors" aria-label="Twitter">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
              </a>
            </div>
            
            {/* Copyright text (Right in RTL flex) */}
            <div>
              <p>© ۱۴۰۵ ویترین. تمامی حقوق این پلتفرم محفوظ و تحت مالکیت معنوی می‌باشد.</p>
            </div>
          </div>
        </div>
      </footer>

    </div>
  );
};
