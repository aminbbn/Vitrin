import React, { useState, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { 
  Sparkles, 
  CheckCircle2, 
  Zap, 
  ShoppingBag, 
  ChevronLeft, 
  Smartphone, 
  Tablet, 
  Settings, 
  Layout, 
  Plus, 
  Trash2, 
  ZoomIn, 
  ZoomOut, 
  RotateCcw, 
  Upload, 
  ToggleLeft, 
  ToggleRight, 
  Percent, 
  Tag, 
  Check, 
  ArrowLeft, 
  ArrowRight,
  Eye,
  PlusCircle,
  Minus,
  ShoppingCart,
  Clock,
  HeartHandshake
} from 'lucide-react';

interface FeaturesPageProps {
  onLoginClick: () => void;
  onStartFreeClick: () => void;
  onNavigateHome: () => void;
  onNavigateSolutions?: () => void;
}

export const FeaturesPage: React.FC<FeaturesPageProps> = ({ 
  onLoginClick, 
  onStartFreeClick, 
  onNavigateHome,
  onNavigateSolutions
}) => {
  // Motion Presets
  const springTransition = { type: 'spring', damping: 25, stiffness: 300 };

  const studioSectionRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: studioSectionRef,
    offset: ["start end", "end start"]
  });

  // Scroll link rotates & scales slightly for 3D look
  const rotateY = useTransform(scrollYProgress, [0, 1], [-12, 12]);
  const rotateX = useTransform(scrollYProgress, [0, 1], [10, -10]);
  const scrollScale = useTransform(scrollYProgress, [0, 0.5, 1], [0.93, 1.02, 0.93]);

  // Viewport slide/fade variants with high-damping, high-stiffness spring as per spec
  const sectionViewportVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        type: 'spring',
        stiffness: 100,
        damping: 18,
        duration: 0.6
      }
    }
  };

  const stepperContainerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08
      }
    }
  };

  const stepperItemVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { type: 'spring', stiffness: 200, damping: 18 }
    }
  };

  // 1. Menu Design Studio State
  const [heroStyle, setHeroStyle] = useState<'overlay' | 'stack' | 'split'>('overlay');
  const [deviceType, setDeviceType] = useState<'mobile' | 'tablet'>('mobile');
  const [zoomScale, setZoomScale] = useState<number>(1);
  const [categories, setCategories] = useState<string[]>([
    '🍕 پیتزا زغالی',
    '🍔 برگر دست‌ساز',
    '🥗 سالاد و پیش‌غذا',
    '🥤 نوشیدنی خنک'
  ]);

  const reorderCategory = (index: number, direction: 'up' | 'down') => {
    const newCategories = [...categories];
    if (direction === 'up' && index > 0) {
      const temp = newCategories[index];
      newCategories[index] = newCategories[index - 1];
      newCategories[index - 1] = temp;
    } else if (direction === 'down' && index < categories.length - 1) {
      const temp = newCategories[index];
      newCategories[index] = newCategories[index + 1];
      newCategories[index + 1] = temp;
    }
    setCategories(newCategories);
  };

  // 2. Product Manager State
  const [prodName, setProdName] = useState<string>('برگر مخصوص دوبل چدار');
  const [prodPrice, setProdPrice] = useState<number>(380000);
  const [discountPrice, setDiscountPrice] = useState<number>(340000);
  const [useDiscount, setUseDiscount] = useState<boolean>(true);
  const [isAvailable, setIsAvailable] = useState<boolean>(true);
  const [selectedTag, setSelectedTag] = useState<string>('🔥 پرفروش‌ترین');
  const [selectedImage, setSelectedImage] = useState<string>('https://picsum.photos/seed/burger/500/500');
  
  const [ingredients, setIngredients] = useState<string[]>([
    'گوشت خالص ۱۸۰ گرمی',
    'پنیر چدار طبیعی',
    'کاهو فرانسوی',
    'سس مخصوص ویترین'
  ]);
  const [newIngredient, setNewIngredient] = useState<string>('');
  
  const [modifiers, setModifiers] = useState<Array<{ id: number; name: string; price: number; isMandatory: boolean }>>([
    { id: 1, name: 'پنیر اضافه', price: 35000, isMandatory: false },
    { id: 2, name: 'سیب‌زمینی سرخ‌کرده دورچین', price: 95000, isMandatory: false },
    { id: 3, name: 'سس قارچ مخصوص', price: 25000, isMandatory: false }
  ]);
  const [newModName, setNewModName] = useState<string>('');
  const [newModPrice, setNewModPrice] = useState<number>(20000);
  const [newModMandatory, setNewModMandatory] = useState<boolean>(false);

  const addIngredient = () => {
    if (newIngredient.trim()) {
      setIngredients([...ingredients, newIngredient.trim()]);
      setNewIngredient('');
    }
  };

  const removeIngredient = (idx: number) => {
    setIngredients(ingredients.filter((_, i) => i !== idx));
  };

  const addModifier = () => {
    if (newModName.trim()) {
      setModifiers([
        ...modifiers,
        {
          id: Date.now(),
          name: newModName.trim(),
          price: newModPrice,
          isMandatory: newModMandatory
        }
      ]);
      setNewModName('');
      setNewModPrice(20000);
      setNewModMandatory(false);
    }
  };

  const removeModifier = (id: number) => {
    setModifiers(modifiers.filter(m => m.id !== id));
  };

  // 3. Customer Experience State
  // Flow steps: 1. Home, 2. ProductList, 3. DetailSheet, 4. Cart, 5. Checkout
  const [flowStep, setFlowStep] = useState<1 | 2 | 3 | 4 | 5>(1);
  const [selectedFlowCategory, setSelectedFlowCategory] = useState<string>('پیتزا');
  const [flowCart, setFlowCart] = useState<Array<{ name: string; qty: number; price: number; mods: string[] }>>([]);
  const [selectedFlowTable, setSelectedFlowTable] = useState<number | null>(5);
  const [appliedFlowModifiers, setAppliedFlowModifiers] = useState<string[]>(['پنیر اضافه']);
  const [activeTabDetail, setActiveTabDetail] = useState<'modifiers' | 'reviews'>('modifiers');

  const addFlowToCart = () => {
    const basePrice = 340000;
    const addedModsPrice = appliedFlowModifiers.includes('پنیر اضافه') ? 35000 : 0;
    setFlowCart([
      {
        name: 'پیتزا پپرونی مخصوص زغالی',
        qty: 1,
        price: basePrice + addedModsPrice,
        mods: appliedFlowModifiers
      }
    ]);
    setFlowStep(4);
  };

  const restartFlow = () => {
    setFlowStep(1);
    setFlowCart([]);
    setAppliedFlowModifiers(['پنیر اضافه']);
  };

  // 4. Order Board State
  const [orderStatus, setOrderStatus] = useState<'received' | 'preparing' | 'ready' | 'delivered'>('preparing');
  const statuses = [
    { key: 'received', label: 'ثبت شده', color: 'bg-amber-500' },
    { key: 'preparing', label: 'در حال آماده‌سازی', color: 'bg-blue-500' },
    { key: 'ready', label: 'آماده تحویل', color: 'bg-emerald-500' },
    { key: 'delivered', label: 'تحویل شده', color: 'bg-slate-500' }
  ] as const;

  const advanceOrderStatus = () => {
    if (orderStatus === 'received') setOrderStatus('preparing');
    else if (orderStatus === 'preparing') setOrderStatus('ready');
    else if (orderStatus === 'ready') setOrderStatus('delivered');
    else setOrderStatus('received');
  };

  return (
    <div className="min-h-screen bg-[#F7F7F8] text-[#18181B] font-['Vazirmatn'] selection:bg-[#10b981]/10 selection:text-[#10b981] overflow-x-hidden leading-relaxed" style={{ direction: 'rtl' }}>
      
      {/* Header / Hero of Features */}
      <header className="relative py-12 lg:py-16 bg-[#0A0A0A] text-white overflow-hidden border-b border-white/10">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(16, 185, 129,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(16, 185, 129,0.02)_1px,transparent_1px)] bg-[size:32px_32px] opacity-40 pointer-events-none" />
        <div className="max-w-7xl mx-auto px-6 text-center relative z-10">
          
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 bg-[#10b981]/15 text-[#10b981] px-4 py-2 rounded-full border border-[#10b981]/35 text-xs font-black mb-6"
          >
            <Sparkles className="w-4 h-4" />
            <span>تور تعاملی امکانات ویترین استودیو</span>
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl md:text-6xl font-black text-white tracking-tighter leading-none mb-6 max-w-4xl mx-auto"
          >
            امکانات بی‌رقیب برای <span className="text-[#10b981]">رشد و درخشش</span> کافه شما
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-base sm:text-xl text-[#71717A] max-w-2xl mx-auto mb-10 font-medium"
          >
            با چهار ماژول قدرتمند، بر روی تک‌تک جزئیات منو، فرآیند سفارش، برچسب‌ها، ترکیبات دلخواه و داشبورد آشپزخانه خود تسلط کامل داشته باشید.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-wrap justify-center gap-4"
          >
            <a 
              href="#studio" 
              className="px-6 py-3.5 bg-[#10b981] hover:bg-[#10b981]/90 text-white font-black text-sm rounded-2xl shadow-lg shadow-[#10b981]/20 transition-all active:scale-95 flex items-center gap-2"
            >
              <span>۱. استودیو طراحی</span>
              <ChevronLeft className="w-4 h-4" />
            </a>
            <a 
              href="#products" 
              className="px-6 py-3.5 bg-white/5 hover:bg-white/10 text-white font-bold text-sm rounded-2xl border border-white/10 transition-all active:scale-95"
            >
              <span>۲. مدیریت غذاها</span>
            </a>
            <a 
              href="#flow" 
              className="px-6 py-3.5 bg-white/5 hover:bg-white/10 text-white font-bold text-sm rounded-2xl border border-white/10 transition-all active:scale-95"
            >
              <span>۳. تجربه کاربری</span>
            </a>
            <a 
              href="#orders" 
              className="px-6 py-3.5 bg-white/5 hover:bg-white/10 text-white font-bold text-sm rounded-2xl border border-white/10 transition-all active:scale-95"
            >
              <span>۴. داشبورد آشپزخانه</span>
            </a>
          </motion.div>
        </div>
      </header>

      {/* 1. SECTION: استودیو طراحی منو */}
      <section id="studio" ref={studioSectionRef} className="py-12 lg:py-16 bg-white border-b border-slate-200/50 scroll-mt-20">
        <motion.div 
          variants={sectionViewportVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, margin: "-100px" }}
          className="max-w-7xl mx-auto px-6"
        >
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
            
            {/* Copy side */}
            <div className="lg:col-span-5 text-right">
              <span className="text-[10px] uppercase tracking-[0.2em] font-black text-[#10b981] bg-[#10b981]/5 px-3 py-1 rounded-full border border-[#10b981]/10">ماژول شماره یک</span>
              <h2 className="text-3xl md:text-4xl font-black text-[#18181B] tracking-tight mt-4 leading-none">استودیو طراحی منوی دیجیتال</h2>
              <p className="text-[#71717A] mt-6 leading-relaxed font-medium text-sm sm:text-base">
                ساختار کلی چیدمان و سایدبار برندینگ رستوران خود را به صورت کاملاً زنده شخصی‌سازی کنید. برای چیدمان هیرو می‌توانید یکی از سه سبک عریض، پشته‌ای یا دو ستونه را انتخاب کنید. اولویت دسته‌بندی‌ها را با کشیدن جابجا کنید و نتیجه را فوراً روی شبیه‌ساز موبایل و تبلت با قابلیت بزرگنمایی مشاهده کنید.
              </p>

              {/* Real Interactive Widget Controls */}
              <div className="mt-8 space-y-6 bg-[#F7F7F8] p-6 rounded-3xl border border-slate-200/50">
                
                {/* Style Picker */}
                <div>
                  <span className="text-xs font-black text-[#18181B] block mb-3">۱. انتخاب استایل چیدمان هیرو</span>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { key: 'overlay', label: 'عریض (Overlay)' },
                      { key: 'stack', label: 'پشته (Stack)' },
                      { key: 'split', label: 'دو ستونه (Split)' }
                    ].map((style) => (
                      <button
                        key={style.key}
                        onClick={() => setHeroStyle(style.key as any)}
                        className={`px-3 py-2.5 rounded-xl text-xs font-bold transition-all border ${
                          heroStyle === style.key 
                            ? 'bg-[#10b981] text-white border-transparent shadow-md' 
                            : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                        }`}
                      >
                        {style.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Categories drag/reorder simulation */}
                <div>
                  <span className="text-xs font-black text-[#18181B] block mb-3">۲. مرتب‌سازی دسته‌بندی‌های منو (تغییر اولویت نمایش)</span>
                  <div className="space-y-2">
                    {categories.map((cat, idx) => (
                      <div key={cat} className="flex items-center justify-between bg-white px-4 py-2 rounded-xl border border-slate-200 text-xs font-bold">
                        <span>{cat}</span>
                        <div className="flex gap-1.5">
                          <button 
                            onClick={() => reorderCategory(idx, 'up')}
                            disabled={idx === 0}
                            className={`p-1.5 rounded-lg border transition-all ${idx === 0 ? 'text-slate-300 border-slate-100' : 'text-slate-600 border-slate-200 hover:bg-slate-50 active:scale-90'}`}
                            title="انتقال به بالا"
                          >
                            ▲
                          </button>
                          <button 
                            onClick={() => reorderCategory(idx, 'down')}
                            disabled={idx === categories.length - 1}
                            className={`p-1.5 rounded-lg border transition-all ${idx === categories.length - 1 ? 'text-slate-300 border-slate-100' : 'text-slate-600 border-slate-200 hover:bg-slate-50 active:scale-90'}`}
                            title="انتقال به پایین"
                          >
                            ▼
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Device and zoom control labels */}
                <div className="flex items-center justify-between pt-2 border-t border-slate-200/50 text-[10px] text-slate-500 font-bold">
                  <span>آخرین همگام‌سازی: آنی</span>
                  <span className="text-[#10b981]">سیستم کشیدن و رها کردن زنده</span>
                </div>
              </div>
            </div>

            {/* Interactive Live Preview Device Mockup side (Left) */}
            <div className="lg:col-span-7 flex flex-col items-center justify-center">
              
              {/* Controls bar above the device */}
              <div className="w-full max-w-md flex items-center justify-between bg-[#18181B] text-white px-5 py-3 rounded-2xl mb-4 shadow-md text-xs font-bold">
                <div className="flex items-center gap-1.5">
                  <button 
                    onClick={() => setDeviceType('mobile')}
                    className={`p-2 rounded-lg transition-all ${deviceType === 'mobile' ? 'bg-[#10b981] text-white' : 'text-slate-400 hover:text-white'}`}
                    title="نمای موبایل"
                  >
                    <Smartphone className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={() => setDeviceType('tablet')}
                    className={`p-2 rounded-lg transition-all ${deviceType === 'tablet' ? 'bg-[#10b981] text-white' : 'text-slate-400 hover:text-white'}`}
                    title="نمای تبلت"
                  >
                    <Tablet className="w-4 h-4" />
                  </button>
                </div>

                <span className="font-bold text-[11px] text-slate-300">پیش‌نمایش زنده استودیو</span>

                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => setZoomScale(p => Math.min(p + 0.1, 1.3))} 
                    className="p-1.5 bg-white/10 hover:bg-white/20 rounded-lg text-slate-300 hover:text-white transition-all"
                    title="بزرگ‌نمایی"
                  >
                    <ZoomIn className="w-3.5 h-3.5" />
                  </button>
                  <span className="font-mono text-[10px] text-slate-400 w-8 text-center">{Math.round(zoomScale * 100)}%</span>
                  <button 
                    onClick={() => setZoomScale(p => Math.max(p - 0.1, 0.7))} 
                    className="p-1.5 bg-white/10 hover:bg-white/20 rounded-lg text-slate-300 hover:text-white transition-all"
                    title="کوچک‌نمایی"
                  >
                    <ZoomOut className="w-3.5 h-3.5" />
                  </button>
                  <button 
                    onClick={() => setZoomScale(1)} 
                    className="p-1.5 bg-white/10 hover:bg-white/20 rounded-lg text-slate-300 hover:text-white transition-all"
                    title="بازنشانی"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Outer double bezel frame based on state with 3D perspective */}
              <div className="relative w-full flex items-center justify-center overflow-hidden py-10 bg-slate-100 rounded-3xl border border-slate-200/60 shadow-inner" style={{ perspective: 1200 }}>
                
                {/* 3D rotation and scaling from useScroll progress */}
                <motion.div
                  style={{ 
                    rotateY, 
                    rotateX, 
                    scale: scrollScale,
                  }}
                  className="w-full flex justify-center items-center"
                >
                  {/* Floating animation wrapper */}
                  <motion.div
                    animate={{ y: [0, -12, 0] }}
                    transition={{ 
                      repeat: Infinity, 
                      duration: 5, 
                      ease: "easeInOut" 
                    }}
                    className="flex justify-center items-center"
                  >
                    <AnimatePresence mode="wait">
                      <motion.div 
                        key={deviceType}
                        initial={{ opacity: 0, scale: 0.92 }}
                        exit={{ opacity: 0, scale: 0.92 }}
                        style={{ scale: zoomScale }}
                        animate={{ 
                          width: deviceType === 'mobile' ? '320px' : '520px', 
                          height: deviceType === 'mobile' ? '560px' : '480px',
                          opacity: 1,
                          scale: zoomScale
                        }}
                        transition={{ type: 'spring', damping: 22, stiffness: 180 }}
                        className="bg-[#0A0A0A] rounded-[2.5rem] border-4 border-slate-800 p-3 shadow-2xl relative flex flex-col overflow-hidden"
                      >
                  {/* Speaker & camera sensor on top */}
                  <div className="absolute top-1 left-1/2 -translate-x-1/2 w-20 h-4 bg-slate-800 rounded-b-xl flex items-center justify-center z-20">
                    <span className="w-6 h-1 bg-slate-700 rounded-full" />
                  </div>

                  {/* Inner screen contents */}
                  <div className="flex-1 bg-white rounded-[1.8rem] overflow-hidden flex flex-col relative text-right text-[#18181B] font-['Vazirmatn'] text-xs">
                    
                    {/* Simulated App Header inside Phone */}
                    <div className="bg-[#0A0A0A] text-white px-4 py-4 pt-6 flex items-center justify-between border-b border-white/5">
                      <div className="w-6 h-6 bg-white/10 rounded-full flex items-center justify-center">
                        <ShoppingBag className="w-3.5 h-3.5 text-white" />
                      </div>
                      <span className="font-black text-[11px]">کافه رستوران قصر رویایی</span>
                      <span className="w-2 h-2 rounded-full bg-emerald-500" />
                    </div>

                    {/* Scrollable live layout section inside phone preview */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-4">
                      
                      {/* Hero style block based on heroStyle state */}
                      <AnimatePresence mode="wait">
                        {heroStyle === 'overlay' && (
                          <motion.div 
                            key="overlay"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="bg-slate-900 text-white p-4 rounded-2xl relative overflow-hidden h-28 flex flex-col justify-end"
                            style={{ backgroundImage: `linear-gradient(rgba(0,0,0,0.1), rgba(0,0,0,0.85)), url(https://images.unsplash.com/photo-1513104890138-7c749659a591?w=500&auto=format&fit=crop&q=60)`, backgroundSize: 'cover' }}
                          >
                            <span className="text-[8px] bg-[#10b981] text-white font-black px-1.5 py-0.5 rounded w-max mb-1">پرفروش‌ترین ماه</span>
                            <h3 className="font-black text-sm">پیتزا چدار تنوری زغالی</h3>
                            <p className="text-[9px] text-slate-300">طعم اصیل زغال و پنیر دست‌ساز</p>
                          </motion.div>
                        )}

                        {heroStyle === 'stack' && (
                          <motion.div 
                            key="stack"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="space-y-2"
                          >
                            <div className="h-20 bg-slate-200 rounded-2xl overflow-hidden">
                              <img src="https://images.unsplash.com/photo-1513104890138-7c749659a591?w=500&auto=format&fit=crop&q=60" className="w-full h-full object-cover" alt="pizza" />
                            </div>
                            <div className="bg-[#F7F7F8] p-3 rounded-2xl border border-slate-200">
                              <h3 className="font-black text-xs text-[#18181B]">پیتزا چدار تنوری زغالی</h3>
                              <p className="text-[9px] text-slate-500 mt-1">ترکیب شگفت‌انگیز خمیر مخصوص با پنیر محلی</p>
                            </div>
                          </motion.div>
                        )}

                        {heroStyle === 'split' && (
                          <motion.div 
                            key="split"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="grid grid-cols-2 gap-2"
                          >
                            <div className="bg-slate-900 text-white p-3 rounded-2xl relative overflow-hidden h-24 flex flex-col justify-end" style={{ backgroundImage: `linear-gradient(rgba(0,0,0,0.1), rgba(0,0,0,0.85)), url(https://images.unsplash.com/photo-1513104890138-7c749659a591?w=500&auto=format&fit=crop&q=60)`, backgroundSize: 'cover' }}>
                              <h3 className="font-black text-[10px]">پیتزا تنوری</h3>
                            </div>
                            <div className="bg-slate-950 text-white p-3 rounded-2xl relative overflow-hidden h-24 flex flex-col justify-end animate-pulse">
                              <h3 className="font-black text-[10px] text-slate-400">فضای خالی تبلیغات</h3>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>

                      {/* Display Categories based on current Categories state list */}
                      <div>
                        <span className="text-[10px] font-black text-slate-400 block mb-2">دسته‌بندی‌ها</span>
                        <div className="flex gap-1.5 overflow-x-auto pb-1">
                          {categories.map((cat, idx) => (
                            <span key={cat} className={`px-2.5 py-1.5 rounded-lg text-[9px] font-black shrink-0 ${idx === 0 ? 'bg-[#10b981] text-white' : 'bg-slate-100 text-slate-600 border border-slate-200'}`}>
                              {cat}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Simple products mockup row */}
                      <div className="space-y-2">
                        <span className="text-[10px] font-black text-slate-400 block">پرفروش‌ترین‌های امروز</span>
                        <div className="flex gap-2.5 overflow-x-auto pb-1">
                          <div className="w-24 bg-slate-50 border border-slate-200 p-2 rounded-xl shrink-0">
                            <div className="h-14 bg-slate-200 rounded-lg mb-1 overflow-hidden">
                              <img src="https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=200&auto=format&fit=crop&q=60" className="w-full h-full object-cover" alt="burger" />
                            </div>
                            <h4 className="font-black text-[9px] truncate">برگر زغالی</h4>
                            <span className="text-[8px] font-bold text-[#10b981] block">۳۱۰,۰۰۰ تومان</span>
                          </div>
                          <div className="w-24 bg-slate-50 border border-slate-200 p-2 rounded-xl shrink-0">
                            <div className="h-14 bg-slate-200 rounded-lg mb-1 overflow-hidden">
                              <img src="https://images.unsplash.com/photo-1550304943-4f24f54ddde9?w=200&auto=format&fit=crop&q=60" className="w-full h-full object-cover" alt="salad" />
                            </div>
                            <h4 className="font-black text-[9px] truncate">سالاد سزار</h4>
                            <span className="text-[8px] font-bold text-[#10b981] block">۲۴۰,۰۰۰ تومان</span>
                          </div>
                          <div className="w-24 bg-slate-50 border border-slate-200 p-2 rounded-xl shrink-0">
                            <div className="h-14 bg-slate-200 rounded-lg mb-1 overflow-hidden">
                              <img src="https://images.unsplash.com/photo-1645112411341-6c4fd023714a?w=200&auto=format&fit=crop&q=60" className="w-full h-full object-cover" alt="pasta" />
                            </div>
                            <h4 className="font-black text-[9px] truncate">پاستا آلفردو</h4>
                            <span className="text-[8px] font-bold text-[#10b981] block">۳۲۰,۰۰۰ تومان</span>
                          </div>
                        </div>
                      </div>

                    </div>

                    {/* Sticky mini client footer inside phone */}
                    <div className="border-t border-slate-100 bg-[#F7F7F8] px-4 py-2 flex items-center justify-between text-[8px] text-slate-400 font-bold">
                      <span>طراحی شده با ویترین استودیو</span>
                      <span>تلفن پشتیبانی رستوران</span>
                    </div>

                  </div>
                      </motion.div>
                    </AnimatePresence>
                  </motion.div>
                </motion.div>
              </div>

            </div>

          </div>
        </motion.div>
      </section>

      {/* 2. SECTION: مدیریت محصولات */}
      <section id="products" className="py-12 lg:py-16 bg-[#0A0A0A] text-white relative border-b border-white/10 scroll-mt-20">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(16, 185, 129,0.01)_0%,transparent_70%)] pointer-events-none" />
        <motion.div 
          variants={sectionViewportVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, margin: "-100px" }}
          className="max-w-7xl mx-auto px-6"
        >
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
            
            {/* Interactive Edit Panel Area on the Left */}
            <div className="lg:col-span-7 order-2 lg:order-1 flex flex-col items-center">
              
              <div className="w-full max-w-2xl bg-slate-900/80 rounded-3xl border border-white/10 p-6 md:p-8 shadow-2xl backdrop-blur-md">
                
                {/* Simulated window header */}
                <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/10">
                  <div className="flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded-full bg-slate-800" />
                    <span className="w-3 h-3 rounded-full bg-slate-800" />
                    <span className="w-3 h-3 rounded-full bg-[#10b981]" />
                  </div>
                  <span className="text-xs font-black text-slate-300">پنل مدیریت غذا و مواد افزودنی</span>
                </div>

                {/* Grid Form Fields */}
                <div className="space-y-6">
                  
                  {/* Basic Row */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="text-right">
                      <label className="text-[10px] uppercase tracking-wider text-slate-500 font-bold block mb-2">نام محصول</label>
                      <input 
                        type="text" 
                        value={prodName}
                        onChange={(e) => setProdName(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white font-bold text-right focus:outline-none focus:ring-2 focus:ring-[#10b981]/40" 
                      />
                    </div>
                    <div className="text-right">
                      <label className="text-[10px] uppercase tracking-wider text-slate-500 font-bold block mb-2">قیمت پایه (تومان)</label>
                      <input 
                        type="number" 
                        value={prodPrice}
                        onChange={(e) => setProdPrice(Number(e.target.value))}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-300 font-bold text-left font-mono focus:outline-none focus:ring-2 focus:ring-[#10b981]/40" 
                      />
                    </div>
                  </div>

                  {/* Switch Controls, Availability & Discounts */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-slate-950 p-4 rounded-2xl border border-slate-800/80">
                    
                    {/* Discount Check */}
                    <div className="flex flex-col items-end justify-center">
                      <span className="text-[10px] text-slate-500 font-bold mb-1.5">فعال‌سازی تخفیف</span>
                      <button 
                        onClick={() => setUseDiscount(!useDiscount)}
                        className="flex items-center gap-1 text-xs font-bold text-slate-300 hover:text-white"
                      >
                        {useDiscount ? (
                          <ToggleRight className="w-8 h-8 text-[#10b981]" />
                        ) : (
                          <ToggleLeft className="w-8 h-8 text-slate-600" />
                        )}
                      </button>
                    </div>

                    {/* Discount value if active */}
                    <div className="text-right">
                      <label className="text-[10px] uppercase tracking-wider text-slate-500 font-bold block mb-2">قیمت جشنواره (تومان)</label>
                      <input 
                        type="number" 
                        value={discountPrice}
                        disabled={!useDiscount}
                        onChange={(e) => setDiscountPrice(Number(e.target.value))}
                        className={`w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-xs font-bold text-left font-mono focus:outline-none focus:ring-2 focus:ring-[#10b981]/40 ${!useDiscount ? 'opacity-40 text-slate-600' : 'text-emerald-400'}`} 
                      />
                    </div>

                    {/* Availability toggle */}
                    <div className="flex flex-col items-end justify-center">
                      <span className="text-[10px] text-slate-500 font-bold mb-1.5">موجود در رستوران</span>
                      <button 
                        onClick={() => setIsAvailable(!isAvailable)}
                        className="flex items-center gap-1 text-xs font-bold text-slate-300 hover:text-white"
                      >
                        {isAvailable ? (
                          <span className="flex items-center gap-2">
                            <span className="text-[9px] bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-md">موجود</span>
                            <ToggleRight className="w-8 h-8 text-emerald-500" />
                          </span>
                        ) : (
                          <span className="flex items-center gap-2">
                            <span className="text-[9px] bg-slate-500/20 text-slate-400 px-2 py-0.5 rounded-md">ناموجود</span>
                            <ToggleLeft className="w-8 h-8 text-slate-600" />
                          </span>
                        )}
                      </button>
                    </div>

                  </div>

                  {/* Badging / Tag options */}
                  <div className="text-right">
                    <label className="text-[10px] uppercase tracking-wider text-slate-500 font-bold block mb-2.5">انتخاب برچسب تصویر</label>
                    <div className="flex flex-wrap gap-2 justify-end">
                      {['🔥 پرفروش‌ترین', '🌶️ تند و اسپایسی', '🆕 غذای جدید', '🥬 رژیمی / کتو'].map((tag) => (
                        <button
                          key={tag}
                          onClick={() => setSelectedTag(selectedTag === tag ? '' : tag)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all border ${
                            selectedTag === tag 
                              ? 'bg-[#10b981] text-white border-transparent' 
                              : 'bg-slate-950 text-slate-400 border-slate-800 hover:bg-slate-900'
                          }`}
                        >
                          {tag}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Ingredients (مواد تشکیل دهنده) */}
                  <div className="text-right">
                    <label className="text-[10px] uppercase tracking-wider text-slate-500 font-bold block mb-2">مدیریت مواد اولیه تشکیل‌دهنده (مشتری می‌تواند حذف کند)</label>
                    <div className="flex gap-2 mb-3">
                      <button 
                        onClick={addIngredient}
                        className="px-4 py-2 bg-[#10b981] hover:bg-[#10b981]/90 text-white rounded-xl text-xs font-bold flex items-center gap-1 active:scale-95"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>افزودن</span>
                      </button>
                      <input 
                        type="text" 
                        value={newIngredient}
                        onChange={(e) => setNewIngredient(e.target.value)}
                        placeholder="مثال: قارچ دکمه‌ای اسلایس شده"
                        className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-xs text-white text-right font-bold focus:outline-none focus:ring-2 focus:ring-[#10b981]/40" 
                      />
                    </div>
                    <div className="flex flex-wrap gap-1.5 justify-end">
                      {ingredients.map((ing, idx) => (
                        <span key={ing} className="bg-slate-950 text-xs font-bold border border-slate-800 pl-2 pr-3 py-1 rounded-lg flex items-center gap-1.5">
                          <button onClick={() => removeIngredient(idx)} className="text-slate-500 hover:text-[#10b981] text-[9px] font-mono">✕</button>
                          <span>{ing}</span>
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Modifiers & Additives (ویژگی‌ها و افزودنی‌ها) */}
                  <div className="text-right pt-4 border-t border-slate-800/60">
                    <label className="text-[10px] uppercase tracking-wider text-slate-500 block mb-2 font-black">مدیریت افزودنی‌ها و چاشنی‌ها (انتخابی مشتری با هزینه مجزا)</label>
                    
                    {/* Add new modifier widget form */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-2 mb-4 bg-slate-950/60 p-3 rounded-xl border border-slate-800/80 items-end">
                      
                      <div className="text-right">
                        <label className="text-[9px] text-slate-500 block mb-1">نوع انتخاب</label>
                        <button 
                          onClick={() => setNewModMandatory(!newModMandatory)}
                          className="w-full text-right px-3 py-1.5 rounded-lg border border-slate-800 text-[10px] font-bold text-slate-300"
                        >
                          {newModMandatory ? 'اجباری ⚠️' : 'اختیاری 📝'}
                        </button>
                      </div>

                      <div className="text-right">
                        <label className="text-[9px] text-slate-500 block mb-1">هزینه (تومان)</label>
                        <input 
                          type="number" 
                          value={newModPrice}
                          onChange={(e) => setNewModPrice(Number(e.target.value))}
                          className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2 py-1 text-xs font-mono text-left text-[#10b981]"
                        />
                      </div>

                      <div className="text-right">
                        <label className="text-[9px] text-slate-500 block mb-1">عنوان افزودنی</label>
                        <input 
                          type="text" 
                          value={newModName}
                          onChange={(e) => setNewModName(e.target.value)}
                          placeholder="مثال: سس اضافه"
                          className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2 py-1 text-xs text-right text-white"
                        />
                      </div>

                      <button 
                        onClick={addModifier}
                        className="py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-lg text-xs flex items-center justify-center gap-1 active:scale-95"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>افزودن</span>
                      </button>

                    </div>

                    {/* Modifiers List */}
                    <div className="space-y-1.5">
                      {modifiers.map((mod) => (
                        <div key={mod.id} className="bg-slate-950 px-4 py-2 rounded-xl border border-slate-800/80 flex items-center justify-between text-xs font-bold">
                          <button onClick={() => removeModifier(mod.id)} className="text-slate-500 hover:text-[#10b981] transition-colors" title="حذف افزودنی">
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                          
                          <div className="flex items-center gap-3">
                            <span className="text-[#10b981] font-mono text-left">+{mod.price.toLocaleString()} تومان</span>
                            <span className={`text-[9px] px-1.5 py-0.5 rounded ${mod.isMandatory ? 'bg-amber-500/10 text-amber-400' : 'bg-slate-800 text-slate-400'}`}>
                              {mod.isMandatory ? 'اجباری' : 'اختیاری'}
                            </span>
                            <span className="text-white">{mod.name}</span>
                          </div>
                        </div>
                      ))}
                    </div>

                  </div>

                </div>

              </div>

            </div>

            {/* Simulated Live Product Card on the Right (Copy) */}
            <div className="lg:col-span-5 order-1 lg:order-2 text-right">
              <span className="text-[10px] uppercase tracking-[0.2em] font-black text-[#10b981] bg-[#10b981]/10 px-3 py-1 rounded-full border border-[#10b981]/20">ماژول شماره دو</span>
              <h2 className="text-3xl md:text-4xl font-black text-white tracking-tight mt-4 leading-none">مدیریت محصولات فوق‌العاده هوشمند</h2>
              <p className="text-[#71717A] mt-6 leading-relaxed font-medium text-sm sm:text-base">
                دیگر نیاز به کدهای پیچیده برای تعریف برچسب و مخلفات نیست. در استودیو مدیریت ویترین، شما هر فیلد را مستقیماً تغییر می‌دهید و کارت نهایی محصول را با جزئیات کامل و برچسب‌های دلخواه، به صورت آنی برای مشتری منتشر می‌کنید.
              </p>

              {/* Render simulated live card */}
              <div className="mt-10 flex justify-center">
                <motion.div 
                  layout
                  className={`w-full max-w-sm rounded-[2rem] bg-white border border-slate-200/50 p-5 shadow-2xl text-slate-900 overflow-hidden relative group transition-all ${!isAvailable ? 'opacity-50' : ''}`}
                >
                  {/* Badge floating */}
                  {selectedTag && (
                    <span className="absolute top-4 right-4 z-10 bg-[#10b981] text-white text-[10px] font-black px-2.5 py-1.5 rounded-full shadow-md">
                      {selectedTag}
                    </span>
                  )}

                  {/* Unavailable stamp */}
                  {!isAvailable && (
                    <div className="absolute inset-0 bg-black/40 z-20 flex items-center justify-center">
                      <span className="px-5 py-2.5 bg-black/80 text-white font-black text-xs rounded-xl uppercase tracking-wider border border-white/20">
                        🔴 موقتاً ناموجود
                      </span>
                    </div>
                  )}

                  {/* Product Image */}
                  <div className="h-44 bg-slate-100 rounded-2xl mb-4 overflow-hidden relative">
                    <img 
                      src={selectedImage} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                      alt="Product" 
                    />
                  </div>

                  {/* Product Details */}
                  <h3 className="text-lg font-black text-[#18181B] mb-1.5">{prodName || 'عنوان محصول'}</h3>
                  
                  {/* Ingredients chips inside live card */}
                  <div className="flex flex-wrap gap-1 mb-3.5">
                    {ingredients.slice(0, 3).map((ing) => (
                      <span key={ing} className="bg-slate-50 text-slate-500 border border-slate-100 text-[9px] px-2 py-0.5 rounded">
                        {ing}
                      </span>
                    ))}
                    {ingredients.length > 3 && <span className="text-slate-400 text-[9px] font-bold">+{ingredients.length - 3} مورد دیگر</span>}
                  </div>

                  {/* Pricing row with strike */}
                  <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-100">
                    <button className="px-4 py-2 bg-[#10b981] text-white rounded-xl text-xs font-black shadow-md flex items-center gap-1">
                      <span>افزودن</span>
                      <Plus className="w-3.5 h-3.5" />
                    </button>

                    <div className="text-left">
                      {useDiscount ? (
                        <div className="flex flex-col">
                          <span className="text-[10px] text-slate-400 line-through font-mono font-bold leading-none">{prodPrice.toLocaleString()} تومان</span>
                          <span className="text-sm font-black text-emerald-600 font-mono mt-0.5">{discountPrice.toLocaleString()} تومان</span>
                        </div>
                      ) : (
                        <span className="text-sm font-black text-[#10b981] font-mono">{prodPrice.toLocaleString()} تومان</span>
                      )}
                    </div>
                  </div>

                </motion.div>
              </div>

            </div>

          </div>
        </motion.div>
      </section>

      {/* 3. SECTION: تجربه مشتری */}
      <section id="flow" className="py-12 lg:py-16 bg-white border-b border-slate-200/50 scroll-mt-20">
        <motion.div 
          variants={sectionViewportVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, margin: "-100px" }}
          className="max-w-7xl mx-auto px-6"
        >
          
          {/* Header */}
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-[10px] uppercase tracking-[0.2em] font-black text-[#10b981] bg-[#10b981]/5 px-3 py-1 rounded-full border border-[#10b981]/10">ماژول شماره سه</span>
            <h2 className="text-3xl md:text-4xl font-black text-[#18181B] tracking-tight mt-4 leading-none">تجربه سفر مشتری نهایی</h2>
            <p className="text-[#71717A] mt-4 font-medium text-sm sm:text-base">
              از لحظه ورود به رستوران، اسکن QR کد روی میز، مرور هیرو بنرها و دسته‌بندی‌ها، شخصی‌سازی مخلفات و افزودن به سبد، انتخاب شماره میز و ثبت فاکتور نهایی. تمام این جریان زنده را مستقیماً در شبیه‌ساز گام‌به‌گام زیر به صورت فیزیکی تجربه کنید.
            </p>
          </div>

          {/* Device and Interactive Preview Arena */}
          <div className="flex flex-col lg:flex-row gap-12 max-w-5xl mx-auto bg-white p-8 rounded-[2.5rem] border border-slate-200/60 shadow-xl relative items-center justify-center">
            
            {/* Right side in RTL (Left side in visual order) - Guide Column */}
            <div className="w-full lg:w-1/2 text-right flex flex-col justify-between self-stretch">
              <div>
                <span className="text-[10px] text-[#10b981] font-black bg-emerald-50 border border-emerald-100 px-3 py-1 rounded-full uppercase tracking-wider inline-block mb-3">توضیحات فرآیند مشتری</span>
                
                <AnimatePresence mode="wait">
                  {flowStep === 1 && (
                    <motion.div 
                      key="step1"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="space-y-4"
                    >
                      <h3 className="text-xl font-black text-[#18181B]">گام اول: ورود و صفحه اصلی</h3>
                      <p className="text-sm text-[#71717A] leading-relaxed">
                        مشتری شما QR کد روی میز را با دوربین گوشی اسکن کرده و فوراً صفحه اصلی وب‌اپلیکیشن رستوران شما را بدون نیاز به نصب هرگونه اپ باز می‌کند. در این صفحه هیرو بنرها، پیام‌های خوش‌آمدگویی و دسته‌بندی‌ها به زیبایی نمایش داده می‌شوند.
                      </p>
                      <button 
                        onClick={() => setFlowStep(2)}
                        className="px-5 py-3 bg-[#10b981] hover:bg-[#10b981]/90 text-white rounded-xl text-xs font-black flex items-center gap-1 shadow-md hover:shadow-lg transition-all"
                      >
                        <span>تپ روی دسته‌بندی «پیتزا» در شبیه‌ساز</span>
                        <ChevronLeft className="w-4 h-4" />
                      </button>
                    </motion.div>
                  )}

                  {flowStep === 2 && (
                    <motion.div 
                      key="step2"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="space-y-4"
                    >
                      <h3 className="text-xl font-black text-[#18181B]">گام دوم: شبکه همه‌جانبه محصولات</h3>
                      <p className="text-sm text-[#71717A] leading-relaxed">
                        با ضربه زدن روی یک دسته‌بندی، مشتری به لیست فیلتر شده محصولات متصل می‌شود. کارت‌ها دارای افکت‌های لرزشی، نمایش برچسب‌های تخفیف و جزئیات تند بودن غذا هستند.
                      </p>
                      <button 
                        onClick={() => setFlowStep(3)}
                        className="px-5 py-3 bg-[#10b981] hover:bg-[#10b981]/90 text-white rounded-xl text-xs font-black flex items-center gap-1 shadow-md hover:shadow-lg transition-all"
                      >
                        <span>انتخاب «پیتزا پپرونی زغالی»</span>
                        <ChevronLeft className="w-4 h-4" />
                      </button>
                    </motion.div>
                  )}

                  {flowStep === 3 && (
                    <motion.div 
                      key="step3"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="space-y-4"
                    >
                      <h3 className="text-xl font-black text-[#18181B]">گام سوم: شخصی‌سازی و برگه افزودنی</h3>
                      <p className="text-sm text-[#71717A] leading-relaxed">
                        یک برگه/باتم‌شیت زیبا از پایین بالا می‌آید. مشتری می‌تواند مواد تشکیل‌دهنده ناخواسته را حذف کند، افزودنی‌های دلخواه را تیک بزند (مثلاً پنیر اضافه) و تعداد سفارش را تغییر دهد.
                      </p>
                      
                      {/* Live controller for cheese addon inside guide column */}
                      <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-mono text-[#10b981] font-bold">+۳۵,۰۰۰ تومان</span>
                          <label className="flex items-center gap-2 cursor-pointer">
                            <span className="font-bold">افزودن پنیر چدار اضافه</span>
                            <input 
                              type="checkbox" 
                              checked={appliedFlowModifiers.includes('پنیر اضافه')}
                              onChange={(e) => {
                                if (e.target.checked) setAppliedFlowModifiers(['پنیر اضافه']);
                                else setAppliedFlowModifiers([]);
                              }}
                              className="accent-[#10b981] w-4 h-4 rounded"
                            />
                          </label>
                        </div>
                      </div>

                      <button 
                        onClick={addFlowToCart}
                        className="px-5 py-3 bg-[#10b981] hover:bg-[#10b981]/90 text-white rounded-xl text-xs font-black flex items-center gap-1 shadow-md hover:shadow-lg transition-all"
                      >
                        <span>افزودن به سبد خرید</span>
                        <ChevronLeft className="w-4 h-4" />
                      </button>
                    </motion.div>
                  )}

                  {flowStep === 4 && (
                    <motion.div 
                      key="step4"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="space-y-4"
                    >
                      <h3 className="text-xl font-black text-[#18181B]">گام چهارم: سبد خرید دیجیتال</h3>
                      <p className="text-sm text-[#71717A] leading-relaxed">
                        مشتری خلاصه پیتزاها و مخلفاتی که انتخاب کرده است را با مبالغ دقیق، میزان مالیات یا خدمات رستوران مشاهده کرده و فاکتور نهایی را قبل از تایید مالی پایش می‌کند.
                      </p>
                      <button 
                        onClick={() => setFlowStep(5)}
                        className="px-5 py-3 bg-[#10b981] hover:bg-[#10b981]/90 text-white rounded-xl text-xs font-black flex items-center gap-1 shadow-md hover:shadow-lg transition-all"
                      >
                        <span>تایید و انتخاب شماره میز</span>
                        <ChevronLeft className="w-4 h-4" />
                      </button>
                    </motion.div>
                  )}

                  {flowStep === 5 && (
                    <motion.div 
                      key="step5"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="space-y-4"
                    >
                      <h3 className="text-xl font-black text-[#18181B]">گام پنجم: شماره میز و ثبت نهایی</h3>
                      <p className="text-sm text-[#71717A] leading-relaxed">
                        سیستم شماره میز مشتری را نمایش می‌دهد. در صورتی که QR کد فیزیکی نباشد، مشتری می‌تواند میز خود را دستی انتخاب کرده و سفارش را ثبت کند تا سفارش مستقیماً راهی پورتال آشپزخانه رستوران شود!
                      </p>
                      
                      {/* Interactive table grid inside guide */}
                      <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                        <span className="text-[10px] text-slate-500 font-bold block mb-3 text-right">میز سالن را مشخص کنید:</span>
                        <div className="grid grid-cols-4 gap-2">
                          {[1, 2, 3, 4, 5, 6, 7, 8].map((tableNum) => (
                            <button
                              key={tableNum}
                              onClick={() => setSelectedFlowTable(tableNum)}
                              className={`py-2 rounded-lg text-xs font-mono font-black border transition-all ${
                                selectedFlowTable === tableNum
                                  ? 'bg-[#10b981] text-white border-transparent shadow-sm scale-105'
                                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                              }`}
                            >
                              {tableNum}
                            </button>
                          ))}
                        </div>
                      </div>

                      <button 
                        onClick={() => {
                          setOrderStatus('received');
                          setFlowStep(5);
                        }}
                        className="px-5 py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-black flex items-center gap-1 shadow-md hover:shadow-lg transition-all"
                      >
                        <span>تایید میز و ثبت نهایی سفارش</span>
                        <Check className="w-4 h-4" />
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Step info list at the bottom */}
              <div className="mt-8 pt-6 border-t border-slate-100 flex items-center gap-4 text-xs text-slate-400 font-bold">
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  <span>بدون نیاز به نصب</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  <span>اتصال لایو ابری</span>
                </div>
              </div>
            </div>

            {/* Left side in RTL (Right side in visual order) - iPhone Mockup */}
            <div className="w-full lg:w-1/2 flex justify-center items-center">
              
              {/* Double Bezel Premium Shell */}
              <div className="bg-slate-200/50 p-2 rounded-[3rem] ring-1 ring-slate-900/5 shadow-2xl">
                
                {/* Physical Phone frame */}
                <div className="border-[10px] border-slate-950 rounded-[2.6rem] w-[285px] h-[550px] bg-slate-50 flex flex-col relative overflow-hidden">
                  
                  {/* Dynamic Island / Notch */}
                  <div className="absolute top-2.5 left-1/2 -translate-x-1/2 w-28 h-5 bg-slate-950 rounded-full z-50 flex items-center justify-between px-3.5 text-[8px] text-white/90 font-mono">
                    <span>9:41</span>
                    <div className="w-1.5 h-1.5 rounded-full bg-slate-800" />
                  </div>

                  {/* Device Screen Frame */}
                  <div className="flex-1 flex flex-col pt-9 pb-4 relative overflow-hidden bg-white text-right">
                    
                    <div className="flex-1 overflow-y-auto relative flex flex-col overflow-x-hidden">
                      <AnimatePresence mode="wait">
                        
                        {/* SCREEN 1: Home page */}
                        {flowStep === 1 && (
                          <motion.div 
                            key="screen-1"
                            initial={{ opacity: 0, x: 30 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -30 }}
                            transition={{ type: 'spring', stiffness: 300, damping: 24 }}
                            className="p-3.5 space-y-3.5 flex-1"
                          >
                            {/* App Header */}
                            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                              <span className="text-[8px] bg-emerald-50 text-[#10b981] border border-emerald-100 px-1.5 py-0.5 rounded-md font-black">میز شماره ۵</span>
                              <div className="text-right">
                                <h4 className="font-black text-[10px] text-slate-900 leading-none">کافه رویایی</h4>
                                <span className="text-[7px] text-slate-400 mt-1 block">منوی دیجیتال سفارش‌گیری</span>
                              </div>
                            </div>

                            {/* Hero Banner card */}
                            <div className="h-24 bg-slate-900 text-white p-3 rounded-xl relative overflow-hidden flex flex-col justify-end" style={{ backgroundImage: `linear-gradient(rgba(0,0,0,0.1), rgba(0,0,0,0.85)), url(https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&auto=format&fit=crop&q=60)`, backgroundSize: 'cover' }}>
                              <span className="text-[7px] bg-[#10b981] px-1 py-0.5 rounded w-max mb-1 font-black">پیشنهاد سرآشپز</span>
                              <h3 className="font-black text-[10px]">منوی پیتزاهای تنوری ویترین</h3>
                            </div>

                            {/* Category selector representation */}
                            <div>
                              <span className="text-[8px] font-black text-slate-400 block mb-2">دسته‌بندی‌های منو</span>
                              <div className="grid grid-cols-2 gap-2">
                                <button onClick={() => setFlowStep(2)} className="bg-emerald-50 text-[#10b981] border border-emerald-100 p-2.5 rounded-xl flex flex-col items-center gap-1 font-black transition-all hover:scale-105">
                                  <span className="text-lg">🍕</span>
                                  <span className="text-[9px]">پیتزای زغالی</span>
                                </button>
                                <button className="bg-slate-50 text-slate-400 border border-slate-100 p-2.5 rounded-xl flex flex-col items-center gap-1 font-bold opacity-60 pointer-events-none">
                                  <span className="text-lg">🍔</span>
                                  <span className="text-[9px]">برگر ذغالی</span>
                                </button>
                              </div>
                            </div>

                            {/* Promotional badge */}
                            <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200/60">
                              <h4 className="font-black text-[8px] text-[#18181B]">🎁 جشنواره طعم پاییز</h4>
                              <p className="text-[7px] text-slate-500 mt-0.5">۱۰٪ تخفیف زنده روی انواع پیتزاها</p>
                            </div>
                          </motion.div>
                        )}

                        {/* SCREEN 2: Product List */}
                        {flowStep === 2 && (
                          <motion.div 
                            key="screen-2"
                            initial={{ opacity: 0, x: 30 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -30 }}
                            transition={{ type: 'spring', stiffness: 300, damping: 24 }}
                            className="p-3.5 space-y-3 flex-1"
                          >
                            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                              <button onClick={() => setFlowStep(1)} className="text-[8px] text-slate-400 hover:text-slate-600 flex items-center gap-0.5">
                                <ChevronLeft className="w-3 h-3 rotate-180" />
                                <span>بازگشت</span>
                              </button>
                              <h3 className="font-black text-[10px] text-slate-900">🍕 منوی پیتزای زغالی</h3>
                            </div>

                            {/* Main Active Product card */}
                            <div onClick={() => setFlowStep(3)} className="bg-white p-2 rounded-xl border border-emerald-100 hover:border-[#10b981]/30 transition-all cursor-pointer flex gap-3 shadow-sm hover:shadow">
                              <div className="w-14 h-14 bg-slate-200 rounded-lg overflow-hidden shrink-0">
                                <img src="https://images.unsplash.com/photo-1628840042765-356cda07504e?w=200&auto=format&fit=crop&q=60" className="w-full h-full object-cover" alt="pepperoni" />
                              </div>
                              <div className="flex-1 text-right flex flex-col justify-between py-0.5">
                                <div>
                                  <h4 className="font-black text-[9px] text-slate-900 leading-tight">پیتزا پپرونی مخصوص زغالی</h4>
                                  <p className="text-[7px] text-slate-400 truncate mt-0.5">کوکتل پپرونی ۹۰٪، پنیر موزارلا غنی، سس فلفل</p>
                                </div>
                                <div className="flex items-center justify-between mt-1">
                                  <span className="text-[7px] bg-red-50 text-red-600 px-1 py-0.5 rounded font-black">🌶️ تند اسپایسی</span>
                                  <span className="font-mono text-[9px] font-black text-[#10b981]">۳۴۰,۰۰۰ تومان</span>
                                </div>
                              </div>
                            </div>

                            {/* Inactive second item */}
                            <div className="bg-white p-2 rounded-xl border border-slate-100 opacity-50 flex gap-3 pointer-events-none">
                              <div className="w-14 h-14 bg-slate-200 rounded-lg overflow-hidden shrink-0">
                                <img src="https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=200&auto=format&fit=crop&q=60" className="w-full h-full object-cover" alt="margarita" />
                              </div>
                              <div className="flex-1 text-right flex flex-col justify-between py-0.5">
                                <div>
                                  <h4 className="font-black text-[9px] text-slate-900 leading-tight">پیتزا مارگاریتا کلاسیک</h4>
                                  <p className="text-[7px] text-slate-400 truncate mt-0.5">ریحان تازه، گوجه مینیاتوری، موزارلا خالص</p>
                                </div>
                                <div className="text-left mt-1">
                                  <span className="font-mono text-[9px] font-black text-slate-700">۲۹۰,۰۰۰ تومان</span>
                                </div>
                              </div>
                            </div>
                          </motion.div>
                        )}

                        {/* SCREEN 3: Product Detail with options */}
                        {flowStep === 3 && (
                          <motion.div 
                            key="screen-3"
                            initial={{ opacity: 0, x: 30 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -30 }}
                            transition={{ type: 'spring', stiffness: 300, damping: 24 }}
                            className="p-3.5 space-y-3 flex-1 flex flex-col justify-between bg-white"
                          >
                            <div className="space-y-2.5">
                              <div className="flex items-center justify-between pb-1.5 border-b border-slate-100">
                                <button onClick={() => setFlowStep(2)} className="text-[8px] text-slate-400 hover:text-slate-600 flex items-center gap-0.5">
                                  <ChevronLeft className="w-3 h-3 rotate-180" />
                                  <span>منوی اصلی</span>
                                </button>
                                <span className="font-black text-[9px] text-slate-900">سفارشی‌سازی محصول</span>
                              </div>

                              <div className="h-24 bg-slate-100 rounded-xl overflow-hidden">
                                <img src="https://images.unsplash.com/photo-1628840042765-356cda07504e?w=400&auto=format&fit=crop&q=60" className="w-full h-full object-cover" alt="pizza" />
                              </div>
                              
                              <div className="text-right">
                                <h3 className="font-black text-[10px] text-slate-900">پیتزا پپرونی مخصوص زغالی</h3>
                                <p className="text-[7.5px] text-slate-400 leading-normal mt-0.5">به همراه روغن زیتون فرابکر و پنیر موزارلای دودی فر پخت زغالی</p>
                              </div>

                              {/* Simple interactive modifiers block inside screen */}
                              <div className="space-y-2 bg-slate-50 p-2.5 rounded-lg border border-slate-200/60">
                                <span className="text-[8px] font-black text-slate-500 block">مواد افزودنی پیتزا</span>
                                <div className="flex items-center justify-between text-[8px] font-bold">
                                  <span className="font-mono text-[#10b981]">+۳۵,۰۰۰ تومان</span>
                                  <label className="flex items-center gap-1.5 cursor-pointer">
                                    <span>پنیر پیتزا چدار اضافه</span>
                                    <input 
                                      type="checkbox" 
                                      checked={appliedFlowModifiers.includes('پنیر اضافه')}
                                      onChange={(e) => {
                                        if (e.target.checked) setAppliedFlowModifiers(['پنیر اضافه']);
                                        else setAppliedFlowModifiers([]);
                                      }}
                                      className="accent-[#10b981] w-3 h-3 rounded"
                                    />
                                  </label>
                                </div>
                              </div>
                            </div>

                            {/* Bottom fixed detail screen bar */}
                            <div className="pt-2.5 border-t border-slate-100 flex items-center justify-between mt-2 bg-white">
                              <button onClick={addFlowToCart} className="px-3.5 py-2 bg-[#10b981] hover:bg-[#10b981]/90 text-white rounded-lg text-[8.5px] font-black flex items-center gap-1">
                                <span>افزودن به سبد</span>
                                <ShoppingCart className="w-3 h-3" />
                              </button>
                              
                              <div className="text-left">
                                <span className="text-[7px] text-slate-400 block">قیمت نهایی فاکتور</span>
                                <span className="font-mono font-black text-[9px] text-[#10b981]">
                                  {(340000 + (appliedFlowModifiers.includes('پنیر اضافه') ? 35000 : 0)).toLocaleString()} تومان
                                </span>
                              </div>
                            </div>
                          </motion.div>
                        )}

                        {/* SCREEN 4: Cart and Summary */}
                        {flowStep === 4 && (
                          <motion.div 
                            key="screen-4"
                            initial={{ opacity: 0, x: 30 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -30 }}
                            transition={{ type: 'spring', stiffness: 300, damping: 24 }}
                            className="p-3.5 space-y-3 flex-1 flex flex-col justify-between"
                          >
                            <div className="space-y-3.5">
                              <div className="flex items-center justify-between pb-1.5 border-b border-slate-100">
                                <button onClick={() => setFlowStep(3)} className="text-[8px] text-slate-400 hover:text-slate-600 flex items-center gap-0.5">
                                  <ChevronLeft className="w-3 h-3 rotate-180" />
                                  <span>برگشت به محصول</span>
                                </button>
                                <h3 className="font-black text-[10px] text-slate-900">🛒 سبد خرید شما</h3>
                              </div>
                              
                              {flowCart.length === 0 ? (
                                <p className="text-slate-400 text-center py-10 text-[8px]">سبد خرید شما در حال حاضر خالی است.</p>
                              ) : (
                                flowCart.map((item, idx) => (
                                  <div key={idx} className="bg-slate-50 p-2.5 rounded-lg border border-slate-200/60 space-y-1 text-right">
                                    <div className="flex justify-between items-center text-[8.5px]">
                                      <span className="font-mono text-slate-500 font-bold">۱ عدد</span>
                                      <h4 className="font-black text-slate-900">{item.name}</h4>
                                    </div>
                                    {item.mods.length > 0 && (
                                      <p className="text-[7px] text-slate-400">افزودنی: {item.mods.join('، ')}</p>
                                    )}
                                    <div className="flex justify-between items-center pt-1.5 border-t border-slate-200/50 mt-1">
                                      <span className="text-[7.5px] text-slate-400">مالیات بر ارزش افزوده: رایگان</span>
                                      <span className="font-mono font-black text-slate-900 text-[8px]">{item.price.toLocaleString()} تومان</span>
                                    </div>
                                  </div>
                                ))
                              )}
                            </div>

                            {flowCart.length > 0 && (
                              <div className="bg-white pt-2 border-t border-slate-100">
                                <div className="flex justify-between text-[9px] font-black text-slate-900 mb-2.5">
                                  <span className="font-mono">{(flowCart[0]?.price || 0).toLocaleString()} تومان</span>
                                  <span>مبلغ نهایی پرداخت</span>
                                </div>
                                <button onClick={() => setFlowStep(5)} className="w-full py-2 bg-[#10b981] hover:bg-[#10b981]/90 text-white rounded-lg text-[9px] font-black shadow-md">
                                  تایید اطلاعات و تعیین شماره میز
                                </button>
                              </div>
                            )}
                          </motion.div>
                        )}

                        {/* SCREEN 5: Order Submission & Success */}
                        {flowStep === 5 && (
                          <motion.div 
                            key="screen-5"
                            initial={{ opacity: 0, x: 30 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -30 }}
                            transition={{ type: 'spring', stiffness: 300, damping: 24 }}
                            className="p-3.5 flex-1 flex flex-col justify-between text-center bg-white"
                          >
                            <div className="space-y-4 my-auto">
                              <div className="w-10 h-10 rounded-full bg-emerald-50 text-emerald-500 flex items-center justify-center border border-emerald-100 mx-auto">
                                <Check className="w-5 h-5" />
                              </div>
                              
                              <div className="space-y-1">
                                <h3 className="font-black text-[11px] text-slate-900 leading-none">سفارش ارسال شد!</h3>
                                <p className="text-[8px] text-slate-400 max-w-[180px] mx-auto leading-relaxed">سفارش میز شماره {selectedFlowTable || 5} با موفقیت در لایو پنل آشپزخانه رستوران به ثبت رسید.</p>
                              </div>

                              <div className="bg-slate-50 px-2.5 py-1.5 rounded-lg border border-slate-100 text-[8px] font-mono inline-block">
                                <span className="text-slate-400 block mb-0.5">کد پیگیری فاکتور</span>
                                <span className="font-black text-slate-900">VIT-8290-QR</span>
                              </div>
                            </div>

                            <button onClick={restartFlow} className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-lg text-[8px] font-black transition-colors">
                              بازگشت به منوی رستوران
                            </button>
                          </motion.div>
                        )}

                      </AnimatePresence>
                    </div>

                    {/* Bottom home button strip mockup */}
                    <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-24 h-1 bg-slate-300 rounded-full z-50 pointer-events-none" />

                    {/* Sticky small demo phone footer */}
                    <div className="border-t border-slate-100 bg-slate-50 px-3.5 py-1.5 flex items-center justify-between text-[7.5px] text-slate-400 font-bold shrink-0">
                      <span>منوی لایو دیجیتال</span>
                      <span>طراحی شده با ویترین</span>
                    </div>

                  </div>
                </div>
              </div>

            </div>

          </div>

        </motion.div>
      </section>

      {/* 4. SECTION: مدیریت سفارشها */}
      <section id="orders" className="py-12 lg:py-16 bg-[#0A0A0A] text-white relative border-b border-white/10 scroll-mt-20">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(16, 185, 129,0.015)_1px,transparent_1px),linear-gradient(90deg,rgba(16, 185, 129,0.015)_1px,transparent_1px)] bg-[size:40px_40px] opacity-40 pointer-events-none" />
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
            
            {/* Copy side */}
            <div className="lg:col-span-5 text-right">
              <span className="text-[10px] uppercase tracking-[0.2em] font-black text-[#10b981] bg-[#10b981]/10 px-3 py-1 rounded-full border border-[#10b981]/20">ماژول شماره چهار</span>
              <h2 className="text-3xl md:text-4xl font-black text-white tracking-tight mt-4 leading-none">مدیریت سفارش‌ها و آشپزخانه هوشمند</h2>
              <p className="text-[#71717A] mt-6 leading-relaxed font-medium text-sm sm:text-base">
                هر سفارشی که مشتری از روی میز خود نهایی می‌کند، بلافاصله در داشبورد پورتال مدیریت رستوران با زنگ صوتی به صدا درمی‌آید. شما می‌توانید مراحل پیشرفت سفارش را از ثبت شده به در حال آماده‌سازی، آماده تحویل و تحویل شده ارتقا دهید تا مشتری هم روی صفحه گوشی خود به صورت زنده زمان تقریبی را پایش کند.
              </p>

              {/* Status advancement interactive widget */}
              <div className="mt-8 bg-slate-900/80 p-6 rounded-3xl border border-white/10 text-right space-y-4">
                <span className="text-xs font-black text-white block mb-1">شبیه‌ساز گردش کار سفارش در آشپزخانه</span>
                <p className="text-[11px] text-slate-400">با کلیک روی دکمه زیر، وضعیت سفارش شبیه‌سازی شده را گام‌به‌گام ارتقا دهید و تغییر رنگ و افکت استپ‌های کارت رو ببینید:</p>
                
                <button 
                  onClick={advanceOrderStatus}
                  className="w-full py-3 bg-[#10b981] hover:bg-[#10b981]/90 text-white font-black text-xs rounded-xl shadow-lg transition-all active:scale-95 flex items-center justify-center gap-2"
                >
                  <Zap className="w-4 h-4" />
                  <span>ارتقا وضعیت سفارش (تغییر زنده استپ)</span>
                </button>
              </div>
            </div>

            {/* Interactive Kitchen Dashboard Display Mockup side (Left) */}
            <div className="lg:col-span-7 flex flex-col items-center justify-center">
              
              <div className="w-full max-w-xl bg-slate-900 rounded-3xl border border-white/10 p-6 md:p-8 shadow-2xl relative overflow-hidden">
                
                {/* Simulated window chrome header */}
                <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/5">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-slate-800" />
                    <span className="w-2.5 h-2.5 rounded-full bg-slate-800" />
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <span className="text-[9px] uppercase font-mono bg-emerald-500/10 text-emerald-400 px-2.5 py-1 rounded border border-emerald-500/20 animate-pulse">● سرور متصل است</span>
                    <span className="text-xs font-black text-white">لایو پانل کنترل سفارشات کافه</span>
                  </div>
                </div>

                {/* State Progress stepper visual */}
                <div className="grid grid-cols-4 gap-2 mb-8 relative">
                  {/* Progress Line background */}
                  <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-slate-800 -translate-y-1/2 z-0" />
                  
                  {statuses.map((status, idx) => {
                    const isPassed = 
                      (orderStatus === 'received' && idx === 0) ||
                      (orderStatus === 'preparing' && idx <= 1) ||
                      (orderStatus === 'ready' && idx <= 2) ||
                      (orderStatus === 'delivered' && idx <= 3);

                    return (
                      <div key={status.key} className="flex flex-col items-center z-10 relative">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center border transition-all duration-300 ${isPassed ? `${status.color} border-transparent text-white shadow-lg shadow-white/5` : 'bg-slate-950 border-slate-800 text-slate-500'}`}>
                          <Check className={`w-4 h-4 transition-transform ${isPassed ? 'scale-100' : 'scale-0'}`} />
                        </div>
                        <span className={`text-[10px] mt-2 font-bold transition-all ${isPassed ? 'text-white' : 'text-slate-500'}`}>{status.label}</span>
                      </div>
                    );
                  })}
                </div>

                {/* Live simulation active order ticket card inside kitchen view */}
                <div className="bg-slate-950 rounded-2xl border border-slate-800 p-5 space-y-4">
                  
                  {/* Top bar with table number and elapsed time */}
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-mono text-slate-500 flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-slate-500" />
                      <span>۳ دقیقه پیش</span>
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="bg-[#10b981] text-white font-black px-2 py-0.5 rounded text-[10px]">میز شماره ۵</span>
                      <span className="font-mono font-black text-white">#12895</span>
                    </div>
                  </div>

                  {/* Order items checklist */}
                  <div className="space-y-2 text-right">
                    <div className="flex justify-between items-center text-xs font-bold text-slate-200">
                      <span className="font-mono text-slate-400">۱ عدد</span>
                      <span className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#10b981]" />
                        <span>پیتزا پپرونی مخصوص زغالی</span>
                      </span>
                    </div>
                    {/* Modifier details */}
                    <p className="text-[10px] text-slate-400 pr-3.5 leading-relaxed">
                      + پنیر پیتزا چدار اضافه (تایید شد)<br />
                      - فلفل دلمه‌ای حذف شود (بدون فلفل)
                    </p>
                  </div>

                  {/* Pricing and Payment Status banner */}
                  <div className="flex items-center justify-between bg-slate-900/50 p-3 rounded-xl border border-slate-800/80 text-xs font-bold pt-3.5 mt-2">
                    <span className="text-[10px] bg-emerald-500/10 text-emerald-400 px-2 py-1 rounded border border-emerald-500/20">💳 آنلاین - پرداخت شده</span>
                    
                    <div className="text-left font-mono text-slate-300">
                      <span className="text-[9px] text-slate-500 block">جمع کل پرداختی</span>
                      <span className="text-white font-black">۳۷۵,۰۰۰ تومان</span>
                    </div>
                  </div>

                </div>

                {/* Simulated action message */}
                <div className="mt-6 pt-4 border-t border-slate-800/60 flex justify-between items-center text-[10px] text-slate-500 font-bold">
                  <span>مکانیزم اتصال: چاپ خودکار فاکتور آشپزخانه</span>
                  <span>IP پرینتر: ۱۹۲.۱۶۸.۱.۸۰</span>
                </div>

              </div>

            </div>

          </div>
        </div>
      </section>

      {/* COMPARISON SECTION: قبل از ویترین vs با ویترین */}
      <section className="py-12 lg:py-16 bg-[#F7F7F8] border-b border-slate-200/50">
        <div className="max-w-4xl mx-auto px-6">
          
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-[10px] uppercase tracking-[0.2em] font-black text-[#10b981] bg-[#10b981]/5 px-3 py-1 rounded-full border border-[#10b981]/10">تغییر شگرف در کسب‌وکار</span>
            <h2 className="text-3xl md:text-4xl font-black text-[#18181B] tracking-tight mt-4 leading-none">مقایسه عملکرد: قبل و بعد از ویترین</h2>
            <p className="text-[#71717A] mt-4 font-medium text-sm sm:text-base">ببینید چطور انتقال به پلتفرم ابری ویترین، چالش‌های سنتی رستوران‌داری را برطرف می‌کند.</p>
          </div>

          <div className="bg-white rounded-3xl border border-slate-200/60 shadow-xl overflow-hidden">
            
            {/* Header row */}
            <div className="grid grid-cols-2 bg-[#0A0A0A] text-white p-5 text-right font-black text-sm">
              <div className="border-r border-white/10 pr-4">با پلتفرم ابری ویترین</div>
              <div className="pr-4 text-slate-400">روش‌های قدیمی کاغذی و اسکرین‌شات</div>
            </div>

            {/* Comparison Rows */}
            <div className="divide-y divide-slate-100 text-right text-xs">
              
              {[
                {
                  before: 'منو رو با نرم‌افزار طراحی گرافیک می‌سازی و اسکرین‌شات به تلگرام مشتری‌ها می‌فرستی.',
                  after: 'منو رو مستقیم در استودیو طراحی می‌کنی و با یک دکمه روی وب‌اپ اختصاصی منتشر می‌کنی.',
                },
                {
                  before: 'برای تغییر یک قیمت ناچار به چاپ مجدد کاتالوگ یا فرستادن فایل عکس جدید هستی.',
                  after: 'قیمت‌ها و تخفیف‌ها رو در ثانیه تغییر میدی و مشتری بلافاصله منوی جدید رو میبینه.',
                },
                {
                  before: 'اتمام موجودی غذاها رو باید تک‌تک پشت تلفن یا سالن به مشتری‌ها عذرخواهی کنی.',
                  after: 'با یک سوئیچ دکمه اتمام موجودی رو فعال می‌کنی تا مشتری نتونه سفارش اشتباه ثبت کنه.',
                },
                {
                  before: 'سفارش‌های تلفنی رو دستی رو کاغذ می‌نویسی و امکان خطا و فراموشی سفارش بالاست.',
                  after: 'سفارش مستقیم از روی میز ثبت میشه و با فیش پرینتر آشپزخانه متصل و فاکتور میشه.',
                }
              ].map((row, idx) => (
                <motion.div 
                  key={idx}
                  whileInView={{ backgroundColor: ['rgba(255,255,255,1)', 'rgba(16, 185, 129,0.015)', 'rgba(255,255,255,1)'] }}
                  viewport={{ once: true }}
                  transition={{ duration: 1.5, delay: idx * 0.2 }}
                  className="grid grid-cols-2 p-5 items-start gap-4"
                >
                  {/* After Vitrin (Left in RTL grid col 1) */}
                  <div className="border-r border-slate-100 pr-4 flex items-start gap-2 text-slate-900 font-bold">
                    <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                    <p className="leading-relaxed">{row.after}</p>
                  </div>

                  {/* Before Vitrin (Right in RTL grid col 2) */}
                  <div className="pr-4 flex items-start gap-2 text-[#71717A]">
                    <span className="w-5 h-5 rounded-full bg-slate-100 text-slate-400 font-mono text-[9px] font-bold flex items-center justify-center shrink-0 mt-0.5">✕</span>
                    <p className="leading-relaxed">{row.before}</p>
                  </div>
                </motion.div>
              ))}

            </div>

          </div>

        </div>
      </section>

      {/* Testimonials Teaser */}
      <section className="py-12 lg:py-16 bg-[#0A0A0A] text-white text-center border-b border-white/10 relative overflow-hidden">
        <div className="max-w-4xl mx-auto px-6 relative z-10 space-y-4">
          <HeartHandshake className="w-10 h-10 text-[#10b981] mx-auto" />
          <h2 className="text-2xl sm:text-3xl font-black text-white">رضایت مشتری مایه افتخار ماست</h2>
          <p className="text-slate-400 text-xs sm:text-sm max-w-xl mx-auto leading-relaxed">بیش از ۵۰۰ رستوران، فست‌فود و کافه در سراسر کشور با تکیه بر سرعت طراحی و پورتال مجهز ویترین، درآمدهای خود را تا ۴۵ درصد ارتقا داده‌اند.</p>
        </div>
      </section>

      {/* Final CTA band */}
      <section id="final-cta" className="relative py-12 lg:py-16 bg-[#10b981] text-white overflow-hidden text-center">
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
      <footer id="marketing-footer" className="bg-[#0A0A0A] text-slate-400 py-12 border-t border-white/10 text-right">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-16">
            
            {/* Info Column (Rightmost in RTL) */}
            <div className="lg:col-span-2 flex flex-col items-start lg:items-start text-right">
              <div className="flex items-center gap-3 mb-4">
                <button onClick={onNavigateHome} className="flex items-center gap-3 text-right focus:outline-none focus:ring-2 focus:ring-[#10b981]/30 rounded-xl p-1">
                  <div className="w-9 h-9 bg-[#10b981] rounded-lg flex items-center justify-center shadow-lg shadow-[#10b981]/20">
                    <span className="text-white font-black text-lg">وی</span>
                  </div>
                  <span className="text-lg font-black tracking-tight text-white">ویترین</span>
                </button>
              </div>
              <p className="text-xs text-slate-500 leading-relaxed max-w-xs">
                پلتفرم ابری یکپارچه طراحی و توسعه منوی دیجیتال و سفارش‌گیری مستقیم. بدون کارمزد، بدون واسطه و بدون سختی کدنویسی.
              </p>
            </div>

            {/* Links Col 1: Product */}
            <div>
              <h4 className="text-xs font-black text-white mb-4">محصول</h4>
              <ul className="space-y-2.5 text-xs">
                <li><button onClick={onNavigateHome} className="hover:text-white transition-colors text-right bg-transparent border-none p-0 cursor-pointer">صفحه نخست پلتفرم</button></li>
                <li>
                  <button 
                    onClick={() => {
                      if (onNavigateSolutions) onNavigateSolutions();
                    }}
                    className="hover:text-white transition-colors text-right bg-transparent border-none p-0 cursor-pointer"
                  >
                    راهکارهای صنفی
                  </button>
                </li>
                <li><a href="#studio" className="hover:text-white transition-colors">استودیو منوساز</a></li>
                <li><a href="#products" className="hover:text-white transition-colors">مدیریت محصولات ویژه</a></li>
              </ul>
            </div>

            {/* Links Col 2: Company */}
            <div>
              <h4 className="text-xs font-black text-white mb-4">شرکت</h4>
              <ul className="space-y-2.5 text-xs">
                <li><button onClick={onNavigateHome} className="hover:text-white transition-colors text-right bg-transparent border-none p-0 cursor-pointer">درباره ما</button></li>
                <li><button onClick={onNavigateHome} className="hover:text-white transition-colors text-right bg-transparent border-none p-0 cursor-pointer">ارتباط با ما</button></li>
                <li><button onClick={onNavigateHome} className="hover:text-white transition-colors text-right bg-transparent border-none p-0 cursor-pointer">بلاگ و مقالات</button></li>
              </ul>
            </div>

            {/* Links Col 3: Resources */}
            <div>
              <h4 className="text-xs font-black text-white mb-4">منابع</h4>
              <ul className="space-y-2.5 text-xs">
                <li><button onClick={onNavigateHome} className="hover:text-white transition-colors text-right bg-transparent border-none p-0 cursor-pointer">مرکز راهنمایی</button></li>
                <li><button onClick={onNavigateHome} className="hover:text-white transition-colors text-right bg-transparent border-none p-0 cursor-pointer">پشتیبانی فنی</button></li>
                <li><button onClick={onNavigateHome} className="hover:text-white transition-colors text-right bg-transparent border-none p-0 cursor-pointer">امنیت داده‌ها</button></li>
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
