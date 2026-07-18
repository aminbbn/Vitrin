import React, { useState, useRef } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { ReactiveGridBackground } from './ReactiveGridBackground';
import { MarketingFooter } from './MarketingFooter';
import { useTheme } from './ThemeProvider';
import { 
  Sparkles, 
  CheckCircle2, 
  ChevronLeft, 
  Coffee, 
  Utensils, 
  Layers, 
  MapPin, 
  Check, 
  Phone, 
  Mail, 
  MapPin as MapPinIcon, 
  Send, 
  Plus, 
  Minus, 
  ShoppingCart, 
  Clock, 
  ArrowRight,
  TrendingUp,
  LayoutTemplate,
  ToggleLeft,
  ToggleRight,
  Users,
  Building,
  Activity,
  Heart
} from 'lucide-react';

interface SolutionsPageProps {
  onLoginClick: () => void;
  onStartFreeClick: () => void;
  onNavigateHome: () => void;
  onNavigateFeatures: () => void;
}

type TabType = 'cafe' | 'restaurant' | 'chain';

export const SolutionsPage: React.FC<SolutionsPageProps> = ({ 
  onLoginClick, 
  onStartFreeClick, 
  onNavigateHome,
  onNavigateFeatures
}) => {
  const { theme } = useTheme();
  const prefersReducedMotion = useReducedMotion();
  const [activeTab, setActiveTab] = useState<TabType>('cafe');
  const heroRef = useRef<HTMLDivElement | null>(null);

  // Animation configurations
  const springTransition = prefersReducedMotion 
    ? { duration: 0 } 
    : { type: 'spring', damping: 25, stiffness: 350 };

  const contentVariants = {
    hidden: { opacity: 0, y: prefersReducedMotion ? 0 : 15 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] } },
    exit: { opacity: 0, y: prefersReducedMotion ? 0 : -10, transition: { duration: 0.25 } }
  };

  // State for Interactive Mocks
  // Cafe Mock State
  const [milkOption, setMilkOption] = useState<'regular' | 'almond' | 'oat'>('regular');
  const [sugarOption, setSugarOption] = useState<'normal' | 'low' | 'zero'>('normal');
  const [selectedDrink, setSelectedDrink] = useState<string>('وانیل لاته اسپشیال');
  const [drinkPrice, setDrinkPrice] = useState<number>(145000);
  const [cafeCart, setCafeCart] = useState<Array<{ name: string; qty: number; price: number; milk: string; sugar: string }>>([]);

  const handleAddDrinkToCart = () => {
    let extra = 0;
    if (milkOption === 'almond') extra += 25000;
    if (milkOption === 'oat') extra += 30000;
    
    const finalPrice = drinkPrice + extra;
    setCafeCart(p => [
      ...p,
      {
        name: selectedDrink,
        qty: 1,
        price: finalPrice,
        milk: milkOption === 'regular' ? 'شیر معمولی' : milkOption === 'almond' ? 'شیر بادام' : 'شیر جو دوسر',
        sugar: sugarOption === 'normal' ? 'شکر استاندارد' : sugarOption === 'low' ? 'کم‌شیرین' : 'بدون شکر'
      }
    ]);
  };

  // Restaurant Mock State
  const [restaurantTables, setRestaurantTables] = useState([
    { id: 4, orders: '2 پیتزا پپرونی، 1 سالاد سزار', total: 920000, status: 'preparing' },
    { id: 12, orders: '1 همبرگر مخصوص، 1 سیب‌زمینی', total: 475000, status: 'ready' },
    { id: 7, orders: '3 پاستا آلفردو، 3 لیموناد', total: 1350000, status: 'received' },
    { id: 9, orders: '1 فیله استریپس، 1 نوشابه قوطی', total: 390000, status: 'delivered' }
  ]);

  const updateTableStatus = (tableId: number, nextStatus: string) => {
    setRestaurantTables(p => p.map(table => {
      if (table.id === tableId) {
        return { ...table, status: nextStatus };
      }
      return table;
    }));
  };

  // Chain Mock State
  const [activeBranch, setActiveBranch] = useState<'central' | 'vanak' | 'tajrish'>('central');
  const branchesData = {
    central: {
      name: 'شعبه مرکزی (تهران)',
      sales: '48,300,000 تومان امروز',
      orders: 142,
      activeOrders: 14,
      chefStatus: 'پیک کاری 🔥',
      syncTime: '1 ثانیه پیش'
    },
    vanak: {
      name: 'شعبه ونک',
      sales: '32,150,000 تومان امروز',
      orders: 98,
      activeOrders: 6,
      chefStatus: 'نرمال ✅',
      syncTime: '5 ثانیه پیش'
    },
    tajrish: {
      name: 'شعبه تجریش',
      sales: '27,900,000 تومان امروز',
      orders: 84,
      activeOrders: 8,
      chefStatus: 'نرمال ✅',
      syncTime: '3 ثانیه پیش'
    }
  };

  // Comparison Accordion State
  const [expandedFeature, setExpandedFeature] = useState<string | null>('design');

  // Demo Form State
  const [formName, setFormName] = useState('');
  const [formVenue, setFormVenue] = useState('');
  const [formPhone, setFormPhone] = useState('');
  const [formMsg, setFormMsg] = useState('');
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    if (!formName.trim() || !formVenue.trim() || !formPhone.trim()) {
      setFormError('لطفاً فیلدهای ستاره‌دار اجباری را تکمیل کنید.');
      return;
    }
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setFormSubmitted(true);
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-transparent text-app-text font-['Vazirmatn'] selection:bg-[#10b981]/10 selection:text-[#10b981] overflow-x-hidden leading-relaxed transition-colors duration-300" style={{ direction: 'rtl' }}>
      
      {/* Hero Header Section */}
      <header ref={heroRef} className="relative py-12 lg:py-16 bg-app-surface/60 backdrop-blur-md text-app-text overflow-hidden border-b border-app-border">
        
        <div className="absolute inset-0 bg-[linear-gradient(rgba(16,185,129,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(16,185,129,0.02)_1px,transparent_1px)] bg-[size:32px_32px] opacity-40 pointer-events-none" />
        <div className="max-w-7xl mx-auto px-6 text-center relative z-10">
          
          <div className="inline-flex items-center gap-2 bg-[#10b981]/15 text-[#10b981] px-4 py-2 rounded-full border border-[#10b981]/35 text-xs font-black mb-6">
            <Sparkles className="w-4 h-4" />
            <span>راهکارهای صنفی هوشمند ویترین</span>
          </div>

          <h1 className="text-4xl md:text-6xl font-black text-slate-900 dark:text-white tracking-tighter leading-none mb-6 max-w-4xl mx-auto">
            منوی دیجیتال و سفارش‌گیری <span className="text-[#10b981] dark:text-[#19C78C]">متناسب با کسب‌وکار شما</span>
          </h1>

          <p className="text-base sm:text-xl text-slate-500 dark:text-slate-400 max-w-2xl mx-auto mb-10 font-medium">
            رویکرد و ساختار کافه با رستوران سنتی یا فست‌فود چندشعبه‌ای کاملاً متفاوت است. راهکارهای شخصی‌سازی شده ویترین را بررسی کنید و منوی مناسب صنف خود را بسازید.
          </p>

          <div className="flex flex-wrap justify-center gap-4">
            <button 
              onClick={() => {
                setActiveTab('cafe');
                const el = document.getElementById('solutions-tabs');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              className={`px-5 py-3 rounded-2xl text-xs font-black transition-all border ${
                activeTab === 'cafe' 
                  ? 'bg-[#10b981] dark:bg-[#19C78C] text-white border-transparent shadow-lg shadow-[#10b981]/25' 
                  : 'bg-slate-100 dark:bg-white/5 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-white/10 hover:bg-slate-200 dark:hover:bg-white/10'
              }`}
            >
              1. کافه‌ها و بارهای نوشیدنی
            </button>
            <button 
              onClick={() => {
                setActiveTab('restaurant');
                const el = document.getElementById('solutions-tabs');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              className={`px-5 py-3 rounded-2xl text-xs font-black transition-all border ${
                activeTab === 'restaurant' 
                  ? 'bg-[#10b981] dark:bg-[#19C78C] text-white border-transparent shadow-lg shadow-[#10b981]/25' 
                  : 'bg-slate-100 dark:bg-white/5 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-white/10 hover:bg-slate-200 dark:hover:bg-white/10'
              }`}
            >
              2. رستوران‌های سنتی و فرنگی
            </button>
            <button 
              onClick={() => {
                setActiveTab('chain');
                const el = document.getElementById('solutions-tabs');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              className={`px-5 py-3 rounded-2xl text-xs font-black transition-all border ${
                activeTab === 'chain' 
                  ? 'bg-[#10b981] dark:bg-[#19C78C] text-white border-transparent shadow-lg shadow-[#10b981]/25' 
                  : 'bg-slate-100 dark:bg-white/5 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-white/10 hover:bg-slate-200 dark:hover:bg-white/10'
              }`}
            >
              3. فست‌فودها و زنجیره‌ای‌ها
            </button>
          </div>
        </div>
      </header>

      {/* SOLUTIONS TAB SWITCHER & PANEL SECTION */}
      <section id="solutions-tabs" className="py-12 lg:py-16 bg-white dark:bg-[#0a0c0b] border-b border-slate-200/50 dark:border-zinc-800/80 scroll-mt-24 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-6">
          
          {/* Animated Tab Switcher Container */}
          <div className="flex justify-center mb-16">
            <div className="relative w-full max-w-lg bg-[#F7F7F8] dark:bg-zinc-900/40 p-1.5 rounded-[2rem] border border-slate-200/50 dark:border-zinc-800/60 shadow-inner flex overflow-x-auto no-scrollbar scroll-smooth">
              
              <div className="flex w-full min-w-[320px] md:min-w-0">
                {/* Cafe Tab */}
                <button
                  onClick={() => setActiveTab('cafe')}
                  className="relative flex-1 py-3 rounded-[1.8rem] text-xs font-black flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-[#10b981]/30 z-10 cursor-pointer"
                >
                  <motion.span
                    animate={{ scale: activeTab === 'cafe' ? 1.18 : 1 }}
                    transition={{ type: 'spring', stiffness: 450, damping: 14 }}
                    className="flex items-center justify-center shrink-0"
                  >
                    <Coffee className="w-4 h-4" />
                  </motion.span>
                  <motion.span
                    animate={{ color: activeTab === 'cafe' ? '#10b981' : '#71717A' }}
                    transition={{ duration: 0.2 }}
                  >
                    کافه‌ها
                  </motion.span>
                  {activeTab === 'cafe' && (
                    <motion.div
                      layoutId="activeTabIndicator"
                      className="absolute inset-0 bg-white dark:bg-zinc-900 rounded-[1.8rem] border border-slate-200 dark:border-zinc-850 shadow-md -z-10"
                      transition={springTransition}
                    />
                  )}
                </button>

                {/* Restaurant Tab */}
                <button
                  onClick={() => setActiveTab('restaurant')}
                  className="relative flex-1 py-3 rounded-[1.8rem] text-xs font-black flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-[#10b981]/30 z-10 cursor-pointer"
                >
                  <motion.span
                    animate={{ scale: activeTab === 'restaurant' ? 1.18 : 1 }}
                    transition={{ type: 'spring', stiffness: 450, damping: 14 }}
                    className="flex items-center justify-center shrink-0"
                  >
                    <Utensils className="w-4 h-4" />
                  </motion.span>
                  <motion.span
                    animate={{ color: activeTab === 'restaurant' ? '#10b981' : '#71717A' }}
                    transition={{ duration: 0.2 }}
                  >
                    رستوران‌ها
                  </motion.span>
                  {activeTab === 'restaurant' && (
                    <motion.div
                      layoutId="activeTabIndicator"
                      className="absolute inset-0 bg-white dark:bg-zinc-900 rounded-[1.8rem] border border-slate-200 dark:border-zinc-850 shadow-md -z-10"
                      transition={springTransition}
                    />
                  )}
                </button>

                {/* Chain / Fast Food Tab */}
                <button
                  onClick={() => setActiveTab('chain')}
                  className="relative flex-1 py-3 rounded-[1.8rem] text-xs font-black flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-[#10b981]/30 z-10 cursor-pointer"
                >
                  <motion.span
                    animate={{ scale: activeTab === 'chain' ? 1.18 : 1 }}
                    transition={{ type: 'spring', stiffness: 450, damping: 14 }}
                    className="flex items-center justify-center shrink-0"
                  >
                    <Layers className="w-4 h-4" />
                  </motion.span>
                  <motion.span
                    animate={{ color: activeTab === 'chain' ? '#10b981' : '#71717A' }}
                    transition={{ duration: 0.2 }}
                  >
                    فست‌فود و زنجیره‌ای
                  </motion.span>
                  {activeTab === 'chain' && (
                    <motion.div
                      layoutId="activeTabIndicator"
                      className="absolute inset-0 bg-white dark:bg-zinc-900 rounded-[1.8rem] border border-slate-200 dark:border-zinc-850 shadow-md -z-10"
                      transition={springTransition}
                    />
                  )}
                </button>
              </div>

            </div>
          </div>

          {/* Content Panel Area */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              variants={contentVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center"
            >
              
              {/* Tab Panel Copy Column (Right in RTL) */}
              <div className="lg:col-span-5 text-right">
                
                {activeTab === 'cafe' && (
                  <div className="space-y-6">
                    <span className="text-[10px] font-black text-[#10b981] bg-[#10b981]/5 px-3 py-1 rounded-full border border-[#10b981]/10 uppercase tracking-[0.1em]">راهکار کافی‌شاپ</span>
                    <h2 className="text-2xl md:text-3xl font-black text-[#18181B] dark:text-zinc-100 tracking-tight leading-tight">
                      منوی نوشیدنی که مدام تغییر می‌کنه، بدون نیاز به طراح گرافیک آپدیت میشه
                    </h2>
                    <p className="text-[#71717A] dark:text-zinc-400 text-sm md:text-base font-medium">
                      یکی از بزرگترین چالش‌های کافه، نوسان موجودی دان قهوه یا میوه‌های استوایی در فصول مختلف است. در ویترین نیازی به طراحی بنر جدید یا چاپ مجدد نیست؛ در کمتر از 10 ثانیه افزودنی، سس یا چاشنی جدید اضافه کرده یا قیمت‌ها را اصلاح کنید.
                    </p>

                    <div className="space-y-3 pt-4 border-t border-slate-100 dark:border-zinc-800/80">
                      
                      {/* Capability 1 */}
                      <div className="flex items-start gap-3">
                        <div className="w-5 h-5 rounded-full bg-emerald-500/10 text-emerald-600 flex items-center justify-center shrink-0 mt-0.5">
                          <Check className="w-3.5 h-3.5" />
                        </div>
                        <div>
                          <h4 className="font-bold text-xs text-[#18181B] dark:text-zinc-200">استودیو زنده کافه‌ها (Design Studio)</h4>
                          <p className="text-[11px] text-[#71717A] dark:text-zinc-400 mt-0.5">شبیه‌سازی تم مینیمال و تیره، مناسب فضاهای دنج و کم‌نور بارهای شبانه.</p>
                        </div>
                      </div>

                      {/* Capability 2 */}
                      <div className="flex items-start gap-3">
                        <div className="w-5 h-5 rounded-full bg-emerald-500/10 text-emerald-600 flex items-center justify-center shrink-0 mt-0.5">
                          <Check className="w-3.5 h-3.5" />
                        </div>
                        <div>
                          <h4 className="font-bold text-xs text-[#18181B] dark:text-zinc-200">طبقه‌بندی ساختاریافته منو (Categories)</h4>
                          <p className="text-[11px] text-[#71717A] dark:text-zinc-400 mt-0.5">تفکیک ساده بارهای گرم، سرد، ماکتیل‌ها، دسته‌بندی دسرها و بار گرم قهوه دمی.</p>
                        </div>
                      </div>

                      {/* Capability 3 */}
                      <div className="flex items-start gap-3">
                        <div className="w-5 h-5 rounded-full bg-emerald-500/10 text-emerald-600 flex items-center justify-center shrink-0 mt-0.5">
                          <Check className="w-3.5 h-3.5" />
                        </div>
                        <div>
                          <h4 className="font-bold text-xs text-[#18181B] dark:text-zinc-200">تخفیف‌ها و برچسب‌های ویژه (Tags & Discounts)</h4>
                          <p className="text-[11px] text-[#71717A] dark:text-zinc-400 mt-0.5">تعریف برچسب "امضا کافه" یا "قهوه کلمبیا 100٪ عربیکا" برای جلب توجه مشتریان خاص‌پسند.</p>
                        </div>
                      </div>

                    </div>
                  </div>
                )}

                {activeTab === 'restaurant' && (
                  <div className="space-y-6">
                    <span className="text-[10px] font-black text-[#10b981] bg-[#10b981]/5 px-3 py-1 rounded-full border border-[#10b981]/10 uppercase tracking-[0.1em]">راهکار رستوران‌های سنتی و فرنگی</span>
                    <h2 className="text-2xl md:text-3xl font-black text-[#18181B] dark:text-zinc-100 tracking-tight leading-tight">
                      مدیریت میزها و سفارش‌های همزمان، بدون سردرگمی پرسنل
                    </h2>
                    <p className="text-[#71717A] dark:text-zinc-400 text-sm md:text-base font-medium">
                      دیگر پرسنل سالن نیازی به دویدن مکرر بین آشپزخانه و صندوق ندارند. با ویترین، مشتریان روی میز خود با اسکن بارکد اختصاصی سفارش ثبت می‌کنند. شماره میز روی سفارش قفل می‌شود و مستقیماً روی مانیتور سالن قرار می‌گیرد.
                    </p>

                    <div className="space-y-3 pt-4 border-t border-slate-100 dark:border-zinc-800/80">
                      
                      {/* Capability 1 */}
                      <div className="flex items-start gap-3">
                        <div className="w-5 h-5 rounded-full bg-emerald-500/10 text-emerald-600 flex items-center justify-center shrink-0 mt-0.5">
                          <Check className="w-3.5 h-3.5" />
                        </div>
                        <div>
                          <h4 className="font-bold text-xs text-[#18181B] dark:text-zinc-200">قفل هوشمند شماره میز (Table Lock)</h4>
                          <p className="text-[11px] text-[#71717A] dark:text-zinc-400 mt-0.5">هر میز QR Code منحصر‌به‌فرد دارد تا از ثبت اشتباه میز توسط مشتری کاملاً جلوگیری شود.</p>
                        </div>
                      </div>

                      {/* Capability 2 */}
                      <div className="flex items-start gap-3">
                        <div className="w-5 h-5 rounded-full bg-emerald-500/10 text-emerald-600 flex items-center justify-center shrink-0 mt-0.5">
                          <Check className="w-3.5 h-3.5" />
                        </div>
                        <div>
                          <h4 className="font-bold text-xs text-[#18181B] dark:text-zinc-200">افزودنی‌های اختیاری و اجباری (Modifiers)</h4>
                          <p className="text-[11px] text-[#71717A] dark:text-zinc-400 mt-0.5">تعیین میزان پخت استیک یا نوع سس دورچین به عنوان انتخاب‌های الزامی مشتری.</p>
                        </div>
                      </div>

                      {/* Capability 3 */}
                      <div className="flex items-start gap-3">
                        <div className="w-5 h-5 rounded-full bg-emerald-500/10 text-emerald-600 flex items-center justify-center shrink-0 mt-0.5">
                          <Check className="w-3.5 h-3.5" />
                        </div>
                        <div>
                          <h4 className="font-bold text-xs text-[#18181B] dark:text-zinc-200">داشبورد مدیریت زنده سفارشات (Kitchen Display)</h4>
                          <p className="text-[11px] text-[#71717A] dark:text-zinc-400 mt-0.5">اتاق کنترل یکپارچه وضعیت سفارشات با فیلتر ترتیبی آماده‌سازی جهت بهبود زمان پاسخگویی.</p>
                        </div>
                      </div>

                    </div>
                  </div>
                )}

                {activeTab === 'chain' && (
                  <div className="space-y-6">
                    <span className="text-[10px] font-black text-[#10b981] bg-[#10b981]/5 px-3 py-1 rounded-full border border-[#10b981]/10 uppercase tracking-[0.1em]">راهکار فست‌فود و برندهای زنجیره‌ای</span>
                    <h2 className="text-2xl md:text-3xl font-black text-[#18181B] dark:text-zinc-100 tracking-tight leading-tight">
                      چند شعبه، یک پنل مدیریت واحد با کنترل همزمان مرکزی
                    </h2>
                    <p className="text-[#71717A] dark:text-zinc-400 text-sm md:text-base font-medium">
                      هماهنگ کردن منوی فست‌فودهای زنجیره‌ای، کنترل موجودی‌ها، قیمت‌های متغیر محلی و جشنواره‌های تخفیف چندگانه فرآیندی فرسایشی است. در ویترین، مفهوم متمایز "شعبه مرکزی" به شما اجازه مدیریت کل شبکه شعب را تنها با چند کلیک ساده می‌دهد.
                    </p>

                    <div className="space-y-3 pt-4 border-t border-slate-100 dark:border-zinc-800/80">
                      
                      {/* Capability 1 */}
                      <div className="flex items-start gap-3">
                        <div className="w-5 h-5 rounded-full bg-emerald-500/10 text-emerald-600 flex items-center justify-center shrink-0 mt-0.5">
                          <Check className="w-3.5 h-3.5" />
                        </div>
                        <div>
                          <h4 className="font-bold text-xs text-[#18181B] dark:text-zinc-200">همگام‌سازی شعبه مرکزی (Master Sync)</h4>
                          <p className="text-[11px] text-[#71717A] dark:text-zinc-400 mt-0.5">تغییر سراسری قیمت‌ها یا افزودن یک دسته جدید به کل شعب به طور آنی و ایمن.</p>
                        </div>
                      </div>

                      {/* Capability 2 */}
                      <div className="flex items-start gap-3">
                        <div className="w-5 h-5 rounded-full bg-emerald-500/10 text-emerald-600 flex items-center justify-center shrink-0 mt-0.5">
                          <Check className="w-3.5 h-3.5" />
                        </div>
                        <div>
                          <h4 className="font-bold text-xs text-[#18181B] dark:text-zinc-200">تخفیف‌های مستقل و جشنواره‌ای (Branch Discounts)</h4>
                          <p className="text-[11px] text-[#71717A] dark:text-zinc-400 mt-0.5">تعیین قیمت یا تخفیف ویژه اختصاصی برای یک شعبه خاص جهت تحریک تقاضای محلی.</p>
                        </div>
                      </div>

                      {/* Capability 3 */}
                      <div className="flex items-start gap-3">
                        <div className="w-5 h-5 rounded-full bg-emerald-500/10 text-emerald-600 flex items-center justify-center shrink-0 mt-0.5">
                          <Check className="w-3.5 h-3.5" />
                        </div>
                        <div>
                          <h4 className="font-bold text-xs text-[#18181B] dark:text-zinc-200">سوئیچر سریع مدیریتی شعب (Branch Switcher)</h4>
                          <p className="text-[11px] text-[#71717A] dark:text-zinc-400 mt-0.5">داشبورد یکپارچه برای مدیران برند با امکان سوئیچ سریع جهت تحلیل آمار مستقل فروش.</p>
                        </div>
                      </div>

                    </div>
                  </div>
                )}

              </div>

              {/* Tab Panel Interactive Mock Column (Left in RTL) */}
              <div className="lg:col-span-7 flex justify-center">
                
                {/* 1. Cafe Mock: Interactive Custom Drinks Builder */}
                {activeTab === 'cafe' && (
                  <div className="w-full max-w-md bg-slate-900 text-white rounded-[2.5rem] border border-white/10 p-6 shadow-2xl relative overflow-hidden">
                    
                    {/* Header inside mockup */}
                    <div className="flex items-center justify-between mb-5 pb-3 border-b border-white/5">
                      <div className="flex items-center gap-2">
                        <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                        <span className="text-[10px] font-mono text-emerald-400">DEMO CUSTOMIZER</span>
                      </div>
                      <span className="text-xs font-black text-slate-300">منوی زنده کافی‌شاپ</span>
                    </div>

                    {/* Drink Showcase Card inside mock */}
                    <div className="bg-slate-950 rounded-2xl p-4 border border-white/5 flex gap-4">
                      <div className="w-24 h-24 rounded-xl overflow-hidden bg-slate-800 shrink-0">
                        <img 
                          src="https://images.unsplash.com/photo-1541167760496-1628856ab772?w=300&auto=format&fit=crop&q=60" 
                          className="w-full h-full object-cover" 
                          alt="Latte" 
                        />
                      </div>
                      <div className="flex-1 text-right flex flex-col justify-between">
                        <div>
                          <span className="bg-[#10b981] text-[9px] font-bold px-2 py-0.5 rounded-full text-white">امضا بار گرم</span>
                          <h4 className="text-sm font-black text-white mt-1">{selectedDrink}</h4>
                          <p className="text-[10px] text-slate-400 mt-0.5">اسپرسو عربیکا، سس کارامل، وانیل و شیر فوم‌دار</p>
                        </div>
                        <div className="text-left font-mono text-xs font-black text-[#10b981]">
                          <motion.span
                            key={`${milkOption}-${sugarOption}`}
                            initial={{ scale: 0.85, opacity: 0.7 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ type: 'spring', stiffness: 400, damping: 12 }}
                            className="inline-block"
                          >
                            {drinkPrice.toLocaleString()} تومان
                          </motion.span>
                        </div>
                      </div>
                    </div>

                    {/* Options Selector Area */}
                    <div className="mt-5 space-y-4 text-right">
                      
                      {/* Milk selection modifier */}
                      <div>
                        <span className="text-[10px] text-slate-400 font-bold block mb-2">انتخاب شیر جانبی (افزودنی هزینه اضافی دارد):</span>
                        <div className="grid grid-cols-3 gap-2">
                          {[
                            { key: 'regular', label: 'شیر معمولی', extra: '0' },
                            { key: 'almond', label: 'شیر بادام', extra: '+25,000' },
                            { key: 'oat', label: 'شیر جو دوسر', extra: '+30,000' }
                          ].map((item) => (
                            <button
                              key={item.key}
                              onClick={() => setMilkOption(item.key as any)}
                              className={`px-2 py-2 rounded-xl text-[10px] font-bold text-center border transition-all ${
                                milkOption === item.key
                                  ? 'bg-[#10b981] text-white border-transparent'
                                  : 'bg-slate-950 text-slate-400 border-white/5 hover:bg-slate-900'
                              }`}
                            >
                              <span>{item.label}</span>
                              <span className="block font-mono text-[8px] opacity-70 mt-0.5">{item.extra}</span>
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Sugar custom option */}
                      <div>
                        <span className="text-[10px] text-slate-400 font-bold block mb-2">میزان شکر دلخواه:</span>
                        <div className="grid grid-cols-3 gap-2">
                          {[
                            { key: 'normal', label: 'استاندارد' },
                            { key: 'low', label: 'کم‌شیرین' },
                            { key: 'zero', label: 'بدون شکر' }
                          ].map((item) => (
                            <button
                              key={item.key}
                              onClick={() => setSugarOption(item.key as any)}
                              className={`px-2 py-1.5 rounded-xl text-[10px] font-bold text-center border transition-all ${
                                sugarOption === item.key
                                  ? 'bg-slate-700 text-white border-transparent'
                                  : 'bg-slate-950 text-slate-400 border-white/5 hover:bg-slate-900'
                              }`}
                            >
                              {item.label}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Mini Cart and CTA inside mockup */}
                      <div className="pt-4 border-t border-white/5 flex items-center justify-between">
                        <button 
                          onClick={handleAddDrinkToCart}
                          className="px-4 py-2 bg-[#10b981] text-white rounded-xl text-xs font-black active:scale-95 transition-all flex items-center gap-1.5 shadow-lg shadow-[#10b981]/15"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>افزودن و سفارش</span>
                        </button>
                        
                        <div className="text-left">
                          <span className="text-[9px] text-slate-400 block">مجموع قیمت شما</span>
                          <span className="text-xs font-mono font-black text-emerald-400 block">
                            <motion.span
                              key={`${milkOption}-${sugarOption}`}
                              initial={{ scale: 0.85, opacity: 0.7 }}
                              animate={{ scale: 1, opacity: 1 }}
                              transition={{ type: 'spring', stiffness: 400, damping: 11 }}
                              className="inline-block text-emerald-400"
                            >
                              {(drinkPrice + (milkOption === 'almond' ? 25000 : milkOption === 'oat' ? 30000 : 0)).toLocaleString()} تومان
                            </motion.span>
                          </span>
                        </div>
                      </div>

                      {/* Display mini live shopping cart inside mockup */}
                      {cafeCart.length > 0 && (
                        <div className="mt-4 bg-slate-950 p-3 rounded-xl border border-white/5 space-y-2 max-h-24 overflow-y-auto">
                          <span className="text-[9px] text-slate-500 font-bold block">سبد خرید آزمایشی شما:</span>
                          {cafeCart.map((item, idx) => (
                            <div key={idx} className="flex justify-between items-center text-[10px] font-bold">
                              <span className="text-[#10b981] font-mono">{item.price.toLocaleString()} ت</span>
                              <span className="text-slate-400">({item.milk} / {item.sugar})</span>
                              <span className="text-white">{item.name}</span>
                            </div>
                          ))}
                        </div>
                      )}

                    </div>

                  </div>
                )}

                {/* 2. Restaurant Mock: Table Grid and Live Order dashboard */}
                {activeTab === 'restaurant' && (
                  <div className="w-full max-w-md bg-slate-900 text-white rounded-[2.5rem] border border-white/10 p-6 shadow-2xl relative overflow-hidden">
                    
                    {/* Header */}
                    <div className="flex items-center justify-between mb-5 pb-3 border-b border-white/5">
                      <div className="flex items-center gap-2">
                        <div className="w-2.5 h-2.5 rounded-full bg-blue-500 animate-pulse" />
                        <span className="text-[10px] font-mono text-blue-400">TABLE CONTROLLER</span>
                      </div>
                      <span className="text-xs font-black text-slate-300">پنل کنترل سفارشات سالن</span>
                    </div>

                    <p className="text-[10px] text-slate-400 text-right mb-4">
                      روی هر میز کلیک کنید تا فرآیند آماده‌سازی غذا را به مرحله بعدی هدایت کنید:
                    </p>

                    {/* Table Cards Grid */}
                    <div className="grid grid-cols-2 gap-3 text-right">
                      {restaurantTables.map((table) => {
                        let statusColor = 'bg-amber-500/10 text-amber-400 border-amber-500/20';
                        let statusLabel = 'ثبت شده 📥';
                        let nextStatus = 'preparing';

                        if (table.status === 'preparing') {
                          statusColor = 'bg-blue-500/10 text-blue-400 border-blue-500/20';
                          statusLabel = 'در حال آماده‌سازی 🍳';
                          nextStatus = 'ready';
                        } else if (table.status === 'ready') {
                          statusColor = 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
                          statusLabel = 'آماده تحویل 🔔';
                          nextStatus = 'delivered';
                        } else if (table.status === 'delivered') {
                          statusColor = 'bg-slate-800 text-slate-400 border-transparent';
                          statusLabel = 'تحویل شده ✅';
                          nextStatus = 'received'; // loop back
                        }

                        return (
                          <button
                            key={table.id}
                            onClick={() => updateTableStatus(table.id, nextStatus)}
                            className="bg-slate-950 p-3.5 rounded-2xl border border-white/5 hover:border-slate-700 transition-all text-right active:scale-95 block w-full focus:outline-none focus:ring-1 focus:ring-[#10b981]"
                          >
                            <div className="flex items-center justify-between mb-2">
                              <span className="font-mono text-xs font-bold text-slate-500">مجموع: {table.total.toLocaleString()} ت</span>
                              <span className="font-black text-xs text-white">میز شماره {table.id}</span>
                            </div>
                            
                            <p className="text-[10px] text-slate-300 truncate mb-2">{table.orders}</p>
                            
                            <motion.div
                              animate={{
                                backgroundColor: table.status === 'preparing' ? 'rgba(59, 130, 246, 0.1)' : table.status === 'ready' ? 'rgba(16, 185, 129, 0.1)' : table.status === 'delivered' ? 'rgba(30, 41, 59, 0.8)' : 'rgba(245, 158, 11, 0.1)',
                                borderColor: table.status === 'preparing' ? 'rgba(59, 130, 246, 0.2)' : table.status === 'ready' ? 'rgba(16, 185, 129, 0.2)' : table.status === 'delivered' ? 'rgba(0, 0, 0, 0)' : 'rgba(245, 158, 11, 0.2)',
                                color: table.status === 'preparing' ? '#3B82F6' : table.status === 'ready' ? '#10B981' : table.status === 'delivered' ? '#94A3B8' : '#F59E0B'
                              }}
                              transition={{ type: "spring", stiffness: 350, damping: 20 }}
                              className="px-2.5 py-1 rounded-lg text-[9px] font-black text-center border"
                            >
                              {statusLabel}
                            </motion.div>
                          </button>
                        );
                      })}
                    </div>

                    {/* Quick Stats Banner inside mock */}
                    <div className="mt-5 bg-slate-950 p-3 rounded-xl border border-white/5 flex items-center justify-between text-[10px] font-bold">
                      <span className="text-emerald-500 font-mono">
                        {restaurantTables.filter(t => t.status === 'delivered').length} میز نهایی
                      </span>
                      <span className="text-blue-400 font-mono">
                        {restaurantTables.filter(t => t.status === 'preparing').length} در حال پخت
                      </span>
                      <span className="text-slate-400">بررسی همزمان زنده پرسنل</span>
                    </div>

                  </div>
                )}

                {/* 3. Fast Food / Chain Mock: Multi-Branch selector */}
                {activeTab === 'chain' && (
                  <div className="w-full max-w-md bg-slate-900 text-white rounded-[2.5rem] border border-white/10 p-6 shadow-2xl relative overflow-hidden">
                    
                    {/* Header */}
                    <div className="flex items-center justify-between mb-5 pb-3 border-b border-white/5">
                      <div className="flex items-center gap-2">
                        <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                        <span className="text-[10px] font-mono text-emerald-400">MULTI-BRANCH PANEL</span>
                      </div>
                      <span className="text-xs font-black text-slate-300">شعبه مرکزی ویترین</span>
                    </div>

                    <p className="text-[10px] text-slate-400 text-right mb-3">
                      سوئیچ زنده بین شعب کافه زنجیره‌ای (تغییر شعبه به صورت آنی کل آمار را فیلتر می‌کند):
                    </p>

                    {/* Quick Branch Selector buttons */}
                    <div className="grid grid-cols-3 gap-2 mb-5">
                      {[
                        { key: 'central', label: 'شعبه مرکزی 🏢' },
                        { key: 'vanak', label: 'شعبه ونک 📍' },
                        { key: 'tajrish', label: 'شعبه تجریش ⛰️' }
                      ].map((item) => (
                        <button
                          key={item.key}
                          onClick={() => setActiveBranch(item.key as any)}
                          className={`px-2 py-2.5 rounded-xl text-[10px] font-black text-center border transition-all ${
                            activeBranch === item.key
                              ? 'bg-[#10b981] text-white border-transparent shadow-md'
                              : 'bg-slate-950 text-slate-400 border-white/5 hover:bg-slate-900'
                          }`}
                        >
                          {item.label}
                        </button>
                      ))}
                    </div>

                    {/* Consolidated stats display for active branch */}
                    <div className="bg-slate-950 rounded-2xl p-4 border border-white/5 text-right space-y-3">
                      
                      <div className="flex justify-between items-center pb-2 border-b border-white/5 text-xs font-black text-white">
                        <span className="text-[#10b981] font-bold">فعال و متصل ⚡</span>
                        <span>{branchesData[activeBranch].name}</span>
                      </div>

                      {/* Stat items */}
                      <div className="grid grid-cols-2 gap-2 text-right">
                        <div className="bg-slate-900 p-2.5 rounded-xl border border-white/5">
                          <span className="text-[8px] text-slate-500 block">فروش کل امروز</span>
                          <span className="text-[11px] font-mono font-black text-white mt-1 block">
                            {branchesData[activeBranch].sales}
                          </span>
                        </div>
                        <div className="bg-slate-900 p-2.5 rounded-xl border border-white/5">
                          <span className="text-[8px] text-slate-500">سفارشات ثبت شده امروز</span>
                          <span className="text-xs font-mono font-black text-white mt-1 block">
                            {branchesData[activeBranch].orders} سفارش
                          </span>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-2 text-right">
                        <div className="bg-slate-900 p-2.5 rounded-xl border border-white/5">
                          <span className="text-[8px] text-slate-500">سفارشات در حال آماده‌سازی</span>
                          <span className="text-xs font-mono font-black text-[#10b981] mt-1 block animate-pulse">
                            {branchesData[activeBranch].activeOrders} سفارش فعال
                          </span>
                        </div>
                        <div className="bg-slate-900 p-2.5 rounded-xl border border-white/5">
                          <span className="text-[8px] text-slate-500">ترافیک لایو آشپزخانه</span>
                          <span className="text-xs font-bold text-slate-300 mt-1 block">
                            {branchesData[activeBranch].chefStatus}
                          </span>
                        </div>
                      </div>

                      {/* Master central sync status */}
                      <div className="pt-2 flex items-center justify-between text-[9px] text-slate-500 font-bold font-mono">
                        <span>آخرین همگام‌سازی ابری: {branchesData[activeBranch].syncTime}</span>
                        <span className="text-emerald-400">شعبه مرکزی مدیریت واحد</span>
                      </div>

                    </div>

                  </div>
                )}

              </div>

            </motion.div>
          </AnimatePresence>

        </div>
      </section>

      {/* PAIN POINT COMPARISON SECTION (قبل از ویترین vs با ویترین) */}
      <section className="py-12 lg:py-16 bg-[#F7F7F8] dark:bg-[#070a08] border-b border-slate-200/50 dark:border-zinc-800/80 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-6">
          
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-[10px] font-black text-[#10b981] bg-[#10b981]/5 px-3 py-1 rounded-full border border-[#10b981]/10 uppercase tracking-[0.25em]">تفاوت از زمین تا آسمان</span>
            <h2 className="text-3xl md:text-4xl font-black text-[#18181B] dark:text-zinc-100 tracking-tight mt-4 mb-5">تغییر شگفت‌انگیز در مدیریت منوی شما</h2>
            <p className="text-slate-500 dark:text-zinc-400 text-sm md:text-base font-medium">
              چرا روش‌های سنتی گرافیکی و ارسال فایل‌های حجم بالا در شبکه‌های اجتماعی دیگر مشتری‌آور نیست؟ این مقایسه واقعی را ببینید.
            </p>
          </div>

          {/* Accordion-like Comparison Table */}
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={{
              hidden: { opacity: 0 },
              visible: {
                opacity: 1,
                transition: {
                  staggerChildren: 0.15,
                  delayChildren: 0.1
                }
              }
            }}
            className="space-y-4 max-w-4xl mx-auto mt-12 text-right"
          >
            {[
              {
                id: 'design',
                title: 'طراحی و به روزرسانی منو',
                desc: 'مدیریت و انتشار تغییرات ظاهری و آیتم‌های جدید منو در سریع‌ترین زمان ممکن.',
                beforeTitle: 'روش سنتی (PDF و چاپ تراکت)',
                beforeText: 'منو رو با نرم‌افزار طراحی گرافیک می‌سازی و اسکرین‌شات می‌فرستی؛ مشتری باید زوم کنه تا ببینه، یا فایل PDF سنگین دانلود کنه. برای تغییر قیمت باید کل منو رو مجدد طراحی و چاپ کنی.',
                afterTitle: 'پلتفرم هوشمند ویترین',
                afterText: 'منو رو مستقیم از استودیو زنده طراحی و در لحظه منتشر می‌کنی. مشتری با اسکن بارکد در سریع‌ترین زمان روی موبایلش منو رو باز می‌کنه و تمام تغییرات شما به صورت آنی اعمال میشه.'
              },
              {
                id: 'inventory',
                title: 'مدیریت موجودی سالن و آشپزخانه',
                desc: 'هماهنگی لحظه‌ای موجودی انبار و منوی در دسترس مشتریان سالن.',
                beforeTitle: 'روش سنتی (هماهنگی شفاهی)',
                beforeText: 'وقتی یه سالاد یا دسر تموم میشه، سالن‌کار مجبوره چندبار بره آشپزخانه و بیاد تا به مشتری معترض بگه این آیتم تمام شده که باعث هدر رفت زمان و نارضایتی مشتریان میشه.',
                afterTitle: 'پلتفرم هوشمند ویترین',
                afterText: 'هر لحظه با یک دکمه ساده آیتم رو موقتاً غیرفعال کن. منوی مشتری در صدم ثانیه آپدیت میشه و پرسنل با خیال راحت روی بقیه سفارشات همزمان تمرکز می‌کنن.'
              },
              {
                id: 'price',
                title: 'نوسانات قیمت و کمپین‌های تخفیف',
                desc: 'جذب مشتری بیشتر با پویایی قیمت‌ها و آفر‌های مناسبتی.',
                beforeTitle: 'روش سنتی (ثابت و غیرقابل ویرایش)',
                beforeText: 'برای تغییر چند قیمت ساده یا اعمال 10 درصد تخفیف موقت، باید فایل طراحی ادیت بشه و چند صدهزار تومان پول چاپ تراکت جدید بدی که عملاً انعطاف‌پذیری بازاریابی رو صفر می‌کنه.',
                afterTitle: 'پلتفرم هوشمند ویترین',
                afterText: 'در لحظه قیمت جشنواره بزار، تخفیف اعمال کن یا برچسب "امضا کافه" رو به کارت محصول بچسبون تا فروش اون محصول 2 برابر شه و رفتارهای خرید مشتریان رو هوشمندانه کنترل کنی.'
              },
              {
                id: 'ordering',
                title: 'سفارش‌گیری و مدیریت فاکتور روی میز',
                desc: 'کاهش نرخ انتظار مشتری برای ثبت نهایی سفارش در ساعات شلوغی.',
                beforeTitle: 'روش سنتی (انتظار سالن‌کار)',
                beforeText: 'مشتریان روی صندلی منتظر گارسون می‌مانند تا منوی کاغذی کثیف را بیاورد، یادداشت کند و دستی ثبت کند. این فرآیند طولانی میزها را قفل می‌کند و ظرفیت سالن را کاهش می‌دهد.',
                afterTitle: 'پلتفرم هوشمند ویترین',
                afterText: 'مشتری بارکد اختصاصی روی میز را اسکن کرده، محتویات غذا و شخصی‌سازی‌ها را ثبت می‌کند. سفارش فوراً روی مانیتور آشپزخانه ظاهر شده و فاکتور نهایی با دقت بالا قفل و ثبت می‌شود.'
              }
            ].map((feat, index) => {
              const isExpanded = expandedFeature === feat.id;
              return (
                <motion.div 
                  key={feat.id} 
                  variants={{
                    hidden: { opacity: 0, y: 20 },
                    visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 150, damping: 20 } }
                  }}
                  className="bg-white dark:bg-[#121614] rounded-[1.8rem] border border-slate-200 dark:border-zinc-800 overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300"
                >
                  {/* Accordion Row Header */}
                  <button
                    onClick={() => setExpandedFeature(isExpanded ? null : feat.id)}
                    className="w-full px-6 py-5 flex items-center justify-between text-right font-bold focus:outline-none cursor-pointer group"
                  >
                    <div className="flex items-center gap-4">
                      {/* Staggered checkmark icon fade-in */}
                      <motion.div
                        variants={{
                          hidden: { opacity: 0, scale: 0.6 },
                          visible: { 
                            opacity: 1, 
                            scale: 1, 
                            transition: { 
                              type: "spring", 
                              stiffness: 400, 
                              damping: 15,
                              delay: index * 0.1 // incremental stagger
                            } 
                          }
                        }}
                        className="w-8 h-8 rounded-full bg-[#10b981]/10 text-[#10b981] flex items-center justify-center shrink-0"
                      >
                        <CheckCircle2 className="w-4.5 h-4.5" />
                      </motion.div>
                      <div>
                        <h3 className="text-sm sm:text-base font-black text-[#18181B] dark:text-zinc-100 group-hover:text-[#10b981] transition-colors">{feat.title}</h3>
                        <p className="text-[11px] text-slate-400 dark:text-zinc-500 font-bold mt-0.5">{feat.desc}</p>
                      </div>
                    </div>
                    <motion.span
                      animate={{ rotate: isExpanded ? 90 : 0 }}
                      transition={{ type: "spring", stiffness: 300, damping: 18 }}
                      className="text-slate-400"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </motion.span>
                  </button>

                  {/* Accordion Row Expandable Panel */}
                  <AnimatePresence initial={false}>
                    {isExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                      >
                        <div className="px-6 pb-6 pt-3 border-t border-slate-100 dark:border-zinc-850 grid grid-cols-1 md:grid-cols-2 gap-6 bg-[#FBFBFA] dark:bg-[#090b0a] transition-colors duration-300">
                          
                          {/* Before Side */}
                          <div className="p-5 bg-white dark:bg-zinc-900/50 rounded-2xl border border-slate-100 dark:border-zinc-800 text-right space-y-2">
                            <h4 className="font-black text-xs text-slate-500 flex items-center gap-2">
                              <span className="w-2 h-2 rounded-full bg-red-500 inline-block" />
                              <span>{feat.beforeTitle}</span>
                            </h4>
                            <p className="text-xs text-slate-500 dark:text-zinc-400 leading-relaxed font-semibold">
                              {feat.beforeText}
                            </p>
                          </div>

                          {/* After Side */}
                          <div className="p-5 bg-slate-900 dark:bg-zinc-950 text-white rounded-2xl border border-white/5 text-right relative overflow-hidden space-y-2">
                            <div className="absolute top-0 left-0 w-1.5 h-full bg-[#10b981]" />
                            <h4 className="font-black text-xs text-[#10b981] flex items-center gap-2">
                              <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block" />
                              <span>{feat.afterTitle}</span>
                            </h4>
                            <p className="text-xs text-slate-300 dark:text-zinc-300 leading-relaxed font-semibold">
                              {feat.afterText}
                            </p>
                          </div>

                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </motion.div>

        </div>
      </section>

      {/* DEMO REQUEST SECTION (Primary Conversion) */}
      <section id="demo-form" className="py-12 lg:py-16 bg-white dark:bg-[#0a0c0b] relative scroll-mt-20 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
            
            {/* Form Column (Right in RTL) */}
            <motion.div 
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ type: "spring", stiffness: 100, damping: 15 }}
              className="lg:col-span-7 bg-slate-50/70 dark:bg-[#0b0e0c]/80 text-slate-900 dark:text-white p-8 md:p-10 rounded-[2.5rem] border border-slate-200/60 dark:border-white/[0.06] shadow-2xl relative backdrop-blur-md"
            >
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(16,185,129,0.02)_0%,transparent_60%)] pointer-events-none" />
              
              <div className="text-right mb-8">
                <span className="text-[10px] font-black text-[#10b981] bg-[#10b981]/10 px-3 py-1 rounded-full border border-[#10b981]/20">فرم ارتباط آنلاین</span>
                <h3 className="text-2xl font-black text-slate-900 dark:text-white mt-4 mb-2">درخواست رایگان دمو و مشاوره تلفنی</h3>
                <p className="text-slate-500 dark:text-slate-400 text-xs font-bold">شعب کافی‌شاپ و رستوران خود را با مشاوران ما ارتقا دهید.</p>
              </div>

              {formSubmitted ? (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.3, y: 30 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  transition={{ type: "spring", stiffness: 180, damping: 10, mass: 1.1 }}
                  className="bg-emerald-500/10 border border-emerald-500/20 p-8 rounded-2xl text-center space-y-4"
                >
                  <div className="w-12 h-12 bg-emerald-500/20 text-[#10b981] dark:text-[#19C78C] rounded-full flex items-center justify-center mx-auto text-xl">
                    ✓
                  </div>
                  <h4 className="font-black text-slate-900 dark:text-white text-lg">درخواست دمو با موفقیت ثبت شد</h4>
                  <p className="text-slate-600 dark:text-slate-300 text-xs leading-relaxed max-w-md mx-auto">
                    همکاران ما در بخش پشتیبانی فنی استودیو ویترین طی حداکثر 24 ساعت آینده با شماره <span className="font-mono text-[#10b981] font-bold">{formPhone}</span> با شما تماس گرفته و پنل آزمایشی را فعال خواهند کرد.
                  </p>
                  <button 
                    onClick={() => setFormSubmitted(false)}
                    className="mt-4 px-4 py-2 text-xs font-bold text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white transition-colors cursor-pointer"
                  >
                    ارسال درخواست مجدد
                  </button>
                </motion.div>
              ) : (
                <form onSubmit={handleFormSubmit} className="space-y-5 text-right">
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-[10px] text-slate-600 dark:text-slate-400 font-black block mb-2">نام و نام خانوادگی شما *</label>
                      <input 
                        type="text" 
                        required
                        value={formName}
                        onChange={(e) => setFormName(e.target.value)}
                        placeholder="مثال: علیرضا رضایی"
                        className="w-full bg-white dark:bg-[#111412] border border-slate-200 dark:border-white/[0.08] rounded-xl px-4 py-3 text-xs text-slate-800 dark:text-white font-bold text-right focus:outline-none focus:ring-2 focus:ring-[#10b981]/40 focus:border-transparent placeholder-slate-400 dark:placeholder-slate-600 transition-all"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-slate-600 dark:text-slate-400 font-black block mb-2">نام کافی‌شاپ یا رستوران شما *</label>
                      <input 
                        type="text" 
                        required
                        value={formVenue}
                        onChange={(e) => setFormVenue(e.target.value)}
                        placeholder="مثال: کافه قصر کارامل"
                        className="w-full bg-white dark:bg-[#111412] border border-slate-200 dark:border-white/[0.08] rounded-xl px-4 py-3 text-xs text-slate-800 dark:text-white font-bold text-right focus:outline-none focus:ring-2 focus:ring-[#10b981]/40 focus:border-transparent placeholder-slate-400 dark:placeholder-slate-600 transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] text-slate-600 dark:text-slate-400 font-black block mb-2">شماره تماس (ترجیحاً دارای واتساپ/تلگرام) *</label>
                    <input 
                      type="tel" 
                      required
                      value={formPhone}
                      onChange={(e) => setFormPhone(e.target.value)}
                      placeholder="مثال: 09123456789"
                      className="w-full bg-white dark:bg-[#111412] border border-slate-200 dark:border-white/[0.08] rounded-xl px-4 py-3 text-xs text-slate-800 dark:text-white font-bold text-left font-mono focus:outline-none focus:ring-2 focus:ring-[#10b981]/40 focus:border-transparent placeholder-slate-400 dark:placeholder-slate-600 transition-all"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] text-slate-600 dark:text-slate-400 font-black block mb-2">پیام یا سوال اختصاصی شما (اختیاری)</label>
                    <textarea 
                      rows={3}
                      value={formMsg}
                      onChange={(e) => setFormMsg(e.target.value)}
                      placeholder="اگر تمایل دارید جزئیاتی از تعداد صندلی‌ها یا شعب بنویسید..."
                      className="w-full bg-white dark:bg-[#111412] border border-slate-200 dark:border-white/[0.08] rounded-xl px-4 py-3 text-xs text-slate-800 dark:text-white font-bold text-right focus:outline-none focus:ring-2 focus:ring-[#10b981]/40 focus:border-transparent placeholder-slate-400 dark:placeholder-slate-600 transition-all"
                    />
                  </div>

                  {formError && (
                    <motion.p 
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-red-500 dark:text-red-400 text-xs font-bold text-center"
                    >
                      {formError}
                    </motion.p>
                  )}

                  <button 
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-4 bg-[#10b981] hover:bg-emerald-600 dark:bg-[#19C78C] dark:hover:bg-[#12cb8d] text-white rounded-xl text-sm font-black transition-all active:scale-95 shadow-lg shadow-[#10b981]/20 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-55 border-0"
                  >
                    <span>{isSubmitting ? 'در حال ثبت...' : 'ارسال درخواست ثبت دمو'}</span>
                    <Send className="w-4 h-4" />
                  </button>

                  <p className="text-center text-[10px] text-slate-500 font-bold mt-3">
                    طی یک روز کاری باهات تماس میگیریم و اولین منوت رو باهم میسازیم.
                  </p>

                </form>
              )}

            </motion.div>

            {/* Direct Contact / Alternating info side-panel (Left in RTL) */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={{
                hidden: { opacity: 0 },
                visible: {
                  opacity: 1,
                  transition: {
                    staggerChildren: 0.12,
                    delayChildren: 0.08
                  }
                }
              }}
              className="lg:col-span-5 text-right space-y-8"
            >
              <motion.div
                variants={{
                  hidden: { opacity: 0, x: -30, y: 10 },
                  visible: { opacity: 1, x: 0, y: 0, transition: { type: "spring", stiffness: 120, damping: 14 } }
                }}
              >
                <span className="text-[10px] font-black text-[#10b981] bg-[#10b981]/5 px-3 py-1 rounded-full border border-[#10b981]/10 uppercase tracking-[0.25em]">ارتباط بدون معطلی</span>
                <h3 className="text-2xl font-black text-[#18181B] dark:text-zinc-100 mt-4 mb-4">آفیس پشتیبانی و همکاران تجاری</h3>
                <p className="text-[#71717A] dark:text-zinc-400 text-xs sm:text-sm font-medium leading-relaxed">
                  اگر مایل هستید قرارداد رسمی خدمات زنجیره‌ای امضا کنید، یا نیاز به دموی حضوری در کافی‌شاپ خود دارید، می‌توانید مستقیماً با خطوط تلفن ارتباطی یا ایمیل توسعه سازمانی ویترین تماس حاصل فرمایید.
                </p>
              </motion.div>

              {/* Info Items List */}
              <div className="space-y-4">
                
                {/* Item 1 */}
                <motion.div
                  variants={{
                    hidden: { opacity: 0, x: -30, y: 10 },
                    visible: { opacity: 1, x: 0, y: 0, transition: { type: "spring", stiffness: 120, damping: 14 } }
                  }}
                  className="flex gap-4 p-5 bg-[#F7F7F8] dark:bg-[#121614] rounded-2xl border border-slate-200/50 dark:border-zinc-800 transition-colors"
                >
                  <div className="w-10 h-10 bg-white dark:bg-zinc-900 rounded-xl flex items-center justify-center text-[#10b981] border border-slate-100 dark:border-zinc-800 shrink-0 shadow-sm">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div className="text-right">
                    <span className="text-[9px] text-slate-400 dark:text-zinc-500 font-bold block">شماره تلفن مستقیم استودیو ویترین</span>
                    <span className="text-xs font-mono font-black text-[#18181B] dark:text-zinc-100 block mt-1" style={{ direction: 'ltr' }}>+98 (21) 8897-6543</span>
                  </div>
                </motion.div>

                {/* Item 2 */}
                <motion.div
                  variants={{
                    hidden: { opacity: 0, x: -30, y: 10 },
                    visible: { opacity: 1, x: 0, y: 0, transition: { type: "spring", stiffness: 120, damping: 14 } }
                  }}
                  className="flex gap-4 p-5 bg-[#F7F7F8] dark:bg-[#121614] rounded-2xl border border-slate-200/50 dark:border-zinc-800 transition-colors"
                >
                  <div className="w-10 h-10 bg-white dark:bg-zinc-900 rounded-xl flex items-center justify-center text-[#10b981] border border-slate-100 dark:border-zinc-800 shrink-0 shadow-sm">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div className="text-right">
                    <span className="text-[9px] text-slate-400 dark:text-zinc-500 font-bold block">مکاتبات تجاری و اداری</span>
                    <span className="text-xs font-mono font-black text-[#18181B] dark:text-zinc-100 block mt-1">support@vitrinstudio.ir</span>
                  </div>
                </motion.div>

                {/* Item 3 */}
                <motion.div
                  variants={{
                    hidden: { opacity: 0, x: -30, y: 10 },
                    visible: { opacity: 1, x: 0, y: 0, transition: { type: "spring", stiffness: 120, damping: 14 } }
                  }}
                  className="flex gap-4 p-5 bg-[#F7F7F8] dark:bg-[#121614] rounded-2xl border border-slate-200/50 dark:border-zinc-800 transition-colors"
                >
                  <div className="w-10 h-10 bg-white dark:bg-zinc-900 rounded-xl flex items-center justify-center text-[#10b981] border border-slate-100 dark:border-zinc-800 shrink-0 shadow-sm">
                    <MapPinIcon className="w-5 h-5" />
                  </div>
                  <div className="text-right">
                    <span className="text-[9px] text-slate-400 dark:text-zinc-500 font-bold block">دفتر هماهنگی مرکزی</span>
                    <span className="text-xs font-bold text-[#18181B] dark:text-zinc-200 block mt-1">تهران، پارک فناوری اطلاعات، برج ارم، طبقه چهارم</span>
                  </div>
                </motion.div>

              </div>

              {/* Heart Badge */}
              <motion.div
                variants={{
                  hidden: { opacity: 0, x: -30, y: 10 },
                  visible: { opacity: 1, x: 0, y: 0, transition: { type: "spring", stiffness: 120, damping: 14 } }
                }}
                className="p-5 bg-pink-50/50 dark:bg-pink-950/10 border border-pink-100 dark:border-pink-900/20 rounded-2xl text-right flex items-center gap-3"
              >
                <Heart className="w-5 h-5 text-[#10b981] fill-[#10b981]" />
                <span className="text-[10px] text-pink-700 dark:text-pink-400 font-black">پشتیبانی همه‌روزه، حتی ایام تعطیل سال نو به صورت بیست‌وچهار ساعته.</span>
              </motion.div>

            </motion.div>

          </div>
        </div>
      </section>

      {/* FINAL CTA RED BAND */}
      <section id="final-cta" className="relative py-12 lg:py-16 bg-[#10b981] text-white overflow-hidden text-center">
        {/* Dynamic mesh circles */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-white/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-black/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="max-w-4xl mx-auto px-6 relative z-10 space-y-6">
          <span className="text-[10px] uppercase tracking-[0.2em] font-black bg-white/10 text-white px-3.5 py-1.5 rounded-full border border-white/20">
            شروع کنید
          </span>
          <h2 className="text-3xl md:text-5xl font-black tracking-tight leading-none">
            اولین منوی کافی‌شاپ یا رستوران خود را همین امروز بسازید
          </h2>
          <p className="text-white/80 max-w-xl mx-auto text-xs sm:text-sm font-bold">
            بدون نیاز به کارت اعتباری یا دانش فنی. منوی دیجیتال کاملاً رایگان با سفارش‌گیری آزمایشی در 5 دقیقه در اختیار شماست.
          </p>
          <div className="pt-4 flex flex-wrap justify-center gap-4">
            <button 
              id="cta-start-free-btn"
              onClick={onStartFreeClick}
              className="px-8 py-4 bg-white text-[#10b981] hover:bg-slate-50 font-black text-sm rounded-2xl shadow-xl transition-all active:scale-95 cursor-pointer"
            >
              شروع رایگان کافه و رستوران
            </button>
            <button 
              onClick={onLoginClick}
              className="px-6 py-4 bg-transparent hover:bg-white/10 text-white border border-white/20 font-bold text-sm rounded-2xl transition-all active:scale-95 cursor-pointer"
            >
              ورود پرسنل سالن
            </button>
          </div>
        </div>
      </section>

      {/* Footer Section */}
      <MarketingFooter 
        theme={theme} 
        onNavigateHome={onNavigateHome} 
        onNavigateSolutions={() => {}} 
      />

    </div>
  );
};
