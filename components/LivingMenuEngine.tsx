import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { 
  Sparkle, 
  CaretLeft, 
  CaretRight,
  Tag, 
  Coins, 
  ShoppingCart, 
  Plus, 
  Minus, 
  Bell, 
  QrCode, 
  Lightning, 
  Clock, 
  ArrowUpRight, 
  Check, 
  ToggleLeft, 
  ToggleRight, 
  Storefront,
  Pizza,
  Receipt,
  CheckCircle,
  Eye,
  ArrowsClockwise
} from '@phosphor-icons/react';

// ==========================================
// DATA MODELS & TYPES
// ==========================================

export interface MenuState {
  price: number;
  available: boolean;
  discount: number; // percentage
  isDiscountActive: boolean;
  tags: string[];
  addons: string[];
}

export interface OrderTicket {
  id: string;
  table: string;
  items: string;
  price: number;
  time: string;
  status: 'received' | 'preparing' | 'delivered';
}

const PRIMARY_EASE = [0.16, 1, 0.3, 1];

export const LivingMenuEngine: React.FC = () => {
  const shouldReduceMotion = useReducedMotion();
  const containerRef = useRef<HTMLDivElement>(null);

  // Core interactive menu state
  const [menuState, setMenuState] = useState<MenuState>({
    price: 340000,
    available: true,
    discount: 15,
    isDiscountActive: false,
    tags: ['پرفروش'],
    addons: []
  });

  // Track user manual interaction to disable auto-cycling
  const [isUserInteracted, setIsUserInteracted] = useState<boolean>(false);
  const [activeNode, setActiveNode] = useState<string | null>(null);
  const [autoStep, setAutoStep] = useState<number>(0);
  const [orderTickets, setOrderTickets] = useState<OrderTicket[]>([
    { id: '1', table: 'میز ۴', items: '۱× پیتزا پپرونی + قارچ', price: 340000, time: 'همین الان', status: 'received' }
  ]);
  const [isLivePulse, setIsLivePulse] = useState<boolean>(true);

  // Highlight and state synchronization
  useEffect(() => {
    const pulseInterval = setInterval(() => {
      setIsLivePulse(prev => !prev);
    }, 2000);
    return () => clearInterval(pulseInterval);
  }, []);

  // Auto-simulation steps (only runs if user hasn't interacted)
  useEffect(() => {
    if (isUserInteracted) return;

    const timer = setInterval(() => {
      setAutoStep(prevStep => {
        const nextStep = (prevStep + 1) % 5;
        
        // Execute automatic adjustments matching steps
        if (nextStep === 0) {
          // Reset state
          setMenuState({
            price: 340000,
            available: true,
            discount: 15,
            isDiscountActive: false,
            tags: ['پرفروش'],
            addons: []
          });
        } else if (nextStep === 1) {
          // Enable discount
          setMenuState(prev => ({
            ...prev,
            isDiscountActive: true
          }));
          triggerNotification('تخفیف ویژه اعمال شد');
        } else if (nextStep === 2) {
          // Add extra addon
          setMenuState(prev => ({
            ...prev,
            addons: ['پنیر اضافه چدار']
          }));
          triggerNotification('پنیر اضافه چدار به منو متصل شد');
        } else if (nextStep === 3) {
          // Set to unavailable
          setMenuState(prev => ({
            ...prev,
            available: false
          }));
          triggerNotification('محصول به طور موقت ناموجود شد');
        } else if (nextStep === 4) {
          // Re-enable and spawn an order
          setMenuState(prev => ({
            ...prev,
            available: true,
            price: 350000
          }));
          triggerOrder();
        }

        return nextStep;
      });
    }, 4500);

    return () => clearInterval(timer);
  }, [isUserInteracted]);

  // Generate a direct customer order
  const triggerOrder = () => {
    const tableNum = Math.floor(Math.random() * 12) + 1;
    const randomId = Math.random().toString(36).substr(2, 4).toUpperCase();
    const isDiscounted = menuState.isDiscountActive;
    const calcPrice = isDiscounted ? Math.round(menuState.price * (1 - menuState.discount / 100)) : menuState.price;
    const finalOrderPrice = calcPrice + (menuState.addons.length > 0 ? 35000 : 0);

    const newTicket: OrderTicket = {
      id: randomId,
      table: `میز ${tableNum}`,
      items: `۱× پیتزا پپرونی ${menuState.addons.length > 0 ? '+ پنیر اضافه' : ''}`,
      price: finalOrderPrice,
      time: 'همین الان',
      status: 'received'
    };

    setOrderTickets(prev => [newTicket, ...prev.slice(0, 2)]);
    triggerNotification(`سفارش جدید از میز ${tableNum} دریافت شد`);
  };

  // Notification alert state
  const [notification, setNotification] = useState<string | null>(null);
  const triggerNotification = (text: string) => {
    setNotification(text);
    setTimeout(() => {
      setNotification(null);
    }, 2200);
  };

  // Manual handlers that disable auto mode instantly
  const handleDiscountToggle = () => {
    setIsUserInteracted(true);
    setMenuState(prev => {
      const next = !prev.isDiscountActive;
      triggerNotification(next ? 'درگاه مشتری: تخفیف فعال شد' : 'درگاه مشتری: تخفیف حذف شد');
      return { ...prev, isDiscountActive: next };
    });
  };

  const handleAvailableToggle = () => {
    setIsUserInteracted(true);
    setMenuState(prev => {
      const next = !prev.available;
      triggerNotification(next ? 'درگاه مشتری: محصول آماده سفارش است' : 'درگاه مشتری: اعلام اتمام موجودی');
      return { ...prev, available: next };
    });
  };

  const handleAddonChange = (addonName: string) => {
    setIsUserInteracted(true);
    setMenuState(prev => {
      const isPresent = prev.addons.includes(addonName);
      const nextAddons = isPresent ? prev.addons.filter(a => a !== addonName) : [...prev.addons, addonName];
      triggerNotification(isPresent ? 'افزودنی حذف شد' : `${addonName} به جزئیات محصول اضافه شد`);
      return { ...prev, addons: nextAddons };
    });
  };

  const handlePriceAdjust = (diff: number) => {
    setIsUserInteracted(true);
    setMenuState(prev => {
      const nextPrice = Math.max(200000, Math.min(prev.price + diff, 500000));
      triggerNotification(`قیمت پایه به ${nextPrice.toLocaleString('fa-IR')} تومان تغییر یافت`);
      return { ...prev, price: nextPrice };
    });
  };

  const handleAddTag = (tag: string) => {
    setIsUserInteracted(true);
    setMenuState(prev => {
      const isPresent = prev.tags.includes(tag);
      const nextTags = isPresent ? prev.tags.filter(t => t !== tag) : [...prev.tags, tag];
      triggerNotification(isPresent ? `برچسب ${tag} حذف شد` : `برچسب ${tag} افزوده شد`);
      return { ...prev, tags: nextTags };
    });
  };

  // Format helper
  const fPrice = (num: number) => num.toLocaleString('fa-IR');

  return (
    <div ref={containerRef} className="w-full relative z-10 flex flex-col items-center justify-center p-2 sm:p-4 text-slate-800">
      
      {/* Absolute Dynamic Status Notification Pill */}
      <AnimatePresence>
        {notification && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className="absolute -top-12 md:-top-16 bg-slate-900/95 backdrop-blur-md text-emerald-400 border border-emerald-500/25 px-5 py-2 rounded-full text-xs font-black shadow-2xl flex items-center gap-2 z-50 whitespace-nowrap"
          >
            <Lightning className="w-4 h-4 animate-bounce" weight="fill" />
            <span className="text-white">{notification}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Kinetic Canvas (The Doppelrand Double-Bezel Pattern) */}
      <div className="w-full max-w-[620px] bg-slate-900/[0.03] border border-slate-900/[0.04] p-3 sm:p-5 rounded-[2.5rem] shadow-[0_24px_50px_-20px_rgba(0,0,0,0.06)] relative overflow-hidden group">
        
        {/* Spatial background field (Atmosphere grid lines and glowing center) */}
        <div className="absolute inset-0 bg-radial-gradient from-emerald-500/[0.03] to-transparent pointer-events-none" />
        <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/[0.01] blur-3xl pointer-events-none" />
        
        {/* Dashboard Frame / Floating Header */}
        <div className="w-full flex items-center justify-between border-b border-slate-200/50 pb-4 mb-5 text-[11px] font-bold text-slate-500">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2.5 w-2.5">
              <span className={`animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75 ${isLivePulse ? 'scale-125' : 'scale-100'}`} />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
            </span>
            <span className="text-slate-800 font-extrabold text-[12px]">موتور پویای منوی ویترین</span>
          </div>

          <div className="flex items-center gap-3">
            {isUserInteracted ? (
              <span className="text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-md flex items-center gap-1.5 font-bold border border-emerald-100">
                <span>کنترل دستی فعال است</span>
              </span>
            ) : (
              <span className="text-slate-500 bg-slate-100 px-2.5 py-1 rounded-md flex items-center gap-1.5 font-medium animate-pulse">
                <ArrowsClockwise className="w-3.5 h-3.5 animate-spin" />
                <span>نمایش خودکار قابلیت‌ها</span>
              </span>
            )}
            <span className="hidden sm:inline font-mono text-[10px] text-slate-400 bg-slate-100/50 px-2 py-0.5 rounded">SYSTEM_ACTIVE</span>
          </div>
        </div>

        {/* Dynamic Composition: Central Menu Card & Surrounding Controls */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-stretch relative">
          
          {/* RIGHT SIDE: Surrounding Modular Attribute Tokens / Control Nodes (4 nodes stacked) */}
          <div className="md:col-span-5 flex flex-col gap-3.5 order-2 md:order-1">
            
            {/* Control Node 1: Price Control */}
            <motion.div
              whileHover={{ scale: 1.01 }}
              onClick={() => setActiveNode('price')}
              className={`p-3.5 rounded-2xl text-right transition-all duration-300 cursor-pointer border ${
                activeNode === 'price' || autoStep === 0 || autoStep === 4
                  ? 'bg-white border-emerald-500/30 shadow-[0_8px_20px_-6px_rgba(16,185,129,0.12)]' 
                  : 'bg-white/80 border-slate-200/60 hover:bg-white hover:border-slate-300'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-extrabold text-slate-400">ویجت تنظیم قیمت</span>
                <Coins className={`w-4 h-4 ${activeNode === 'price' || autoStep === 0 || autoStep === 4 ? 'text-emerald-500' : 'text-slate-400'}`} weight="duotone" />
              </div>
              <h3 className="text-xs font-black text-slate-800 mb-2">مدیریت آنی قیمت</h3>
              <div className="flex items-center justify-between bg-slate-50/80 p-1.5 rounded-xl border border-slate-200/40">
                <button 
                  onClick={(e) => { e.stopPropagation(); handlePriceAdjust(10000); }}
                  className="w-7 h-7 bg-white hover:bg-slate-50 rounded-lg flex items-center justify-center border border-slate-200 shadow-sm active:scale-90 transition-all"
                >
                  <Plus className="w-3.5 h-3.5 text-slate-700" />
                </button>
                <span className="text-xs font-mono font-extrabold text-slate-800">
                  {fPrice(menuState.price)} <span className="text-[9px] font-sans text-slate-500">تومان</span>
                </span>
                <button 
                  onClick={(e) => { e.stopPropagation(); handlePriceAdjust(-10000); }}
                  className="w-7 h-7 bg-white hover:bg-slate-50 rounded-lg flex items-center justify-center border border-slate-200 shadow-sm active:scale-90 transition-all"
                >
                  <Minus className="w-3.5 h-3.5 text-slate-700" />
                </button>
              </div>
            </motion.div>

            {/* Control Node 2: Discount & Offers */}
            <motion.div
              whileHover={{ scale: 1.01 }}
              onClick={() => setActiveNode('discount')}
              className={`p-3.5 rounded-2xl text-right transition-all duration-300 cursor-pointer border ${
                menuState.isDiscountActive || autoStep === 1
                  ? 'bg-white border-emerald-500/30 shadow-[0_8px_20px_-6px_rgba(16,185,129,0.12)]' 
                  : 'bg-white/80 border-slate-200/60 hover:bg-white hover:border-slate-300'
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[10px] font-extrabold text-slate-400">تخفیف هوشمند منو</span>
                <Tag className={`w-4 h-4 ${menuState.isDiscountActive || autoStep === 1 ? 'text-rose-500' : 'text-slate-400'}`} weight="duotone" />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xs font-black text-slate-800">کمپین تخفیف ۱۵٪</h3>
                  <p className="text-[10px] text-slate-400 mt-0.5 font-medium">فعال‌سازی با یک لمس</p>
                </div>
                <button
                  onClick={(e) => { e.stopPropagation(); handleDiscountToggle(); }}
                  className="focus:outline-none bg-transparent border-0 p-0 cursor-pointer"
                >
                  {menuState.isDiscountActive ? (
                    <ToggleRight className="w-10 h-10 text-emerald-500" weight="fill" />
                  ) : (
                    <ToggleLeft className="w-10 h-10 text-slate-300" weight="fill" />
                  )}
                </button>
              </div>
            </motion.div>

            {/* Control Node 3: Availability Indicator */}
            <motion.div
              whileHover={{ scale: 1.01 }}
              onClick={() => setActiveNode('availability')}
              className={`p-3.5 rounded-2xl text-right transition-all duration-300 cursor-pointer border ${
                !menuState.available || autoStep === 3
                  ? 'bg-red-50/40 border-red-200 shadow-sm' 
                  : 'bg-white/80 border-slate-200/60 hover:bg-white hover:border-slate-300'
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[10px] font-extrabold text-slate-400">موجودی لحظه‌ای</span>
                <Storefront className={`w-4 h-4 ${menuState.available ? 'text-emerald-500' : 'text-red-500'}`} weight="duotone" />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xs font-black text-slate-800">کنترل موجودی سالن</h3>
                  <p className="text-[10px] text-slate-400 mt-0.5 font-medium">عدم فروش در صورت اتمام غذا</p>
                </div>
                <button
                  onClick={(e) => { e.stopPropagation(); handleAvailableToggle(); }}
                  className="focus:outline-none bg-transparent border-0 p-0 cursor-pointer"
                >
                  {menuState.available ? (
                    <ToggleRight className="w-10 h-10 text-emerald-500" weight="fill" />
                  ) : (
                    <ToggleLeft className="w-10 h-10 text-slate-400" weight="fill" />
                  )}
                </button>
              </div>
            </motion.div>

            {/* Control Node 4: Add-ons & Extras */}
            <motion.div
              whileHover={{ scale: 1.01 }}
              onClick={() => setActiveNode('addons')}
              className={`p-3.5 rounded-2xl text-right transition-all duration-300 cursor-pointer border ${
                menuState.addons.length > 0 || autoStep === 2
                  ? 'bg-white border-emerald-500/30 shadow-[0_8px_20px_-6px_rgba(16,185,129,0.12)]' 
                  : 'bg-white/80 border-slate-200/60 hover:bg-white hover:border-slate-300'
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[10px] font-extrabold text-slate-400">سفارشی‌سازی محصول</span>
                <Plus className="w-4 h-4 text-emerald-500" weight="bold" />
              </div>
              <h3 className="text-xs font-black text-slate-800 mb-1.5">افزودنی‌های دلخواه مشتری</h3>
              <div className="flex flex-wrap gap-1.5">
                <button
                  onClick={(e) => { e.stopPropagation(); handleAddonChange('پنیر اضافه چدار'); }}
                  className={`px-2.5 py-1 rounded-lg text-[9px] font-black border transition-all cursor-pointer ${
                    menuState.addons.includes('پنیر اضافه چدار') || (autoStep === 2 && menuState.addons.includes('پنیر اضافه چدار'))
                      ? 'bg-emerald-500 text-white border-emerald-400'
                      : 'bg-slate-100 text-slate-600 border-slate-200/50 hover:bg-slate-200/40'
                  }`}
                >
                  + پنیر چدار اضافه
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); handleAddonChange('سس سیر تند'); }}
                  className={`px-2.5 py-1 rounded-lg text-[9px] font-black border transition-all cursor-pointer ${
                    menuState.addons.includes('سس سیر تند')
                      ? 'bg-emerald-500 text-white border-emerald-400'
                      : 'bg-slate-100 text-slate-600 border-slate-200/50 hover:bg-slate-200/40'
                  }`}
                >
                  + سس سیر تند
                </button>
              </div>
            </motion.div>

          </div>

          {/* LEFT / CENTER SIDE: CENTRAL LIVE MENU BOARD (Focal centerpiece card) */}
          <div className="md:col-span-7 flex flex-col justify-between order-1 md:order-2 bg-slate-50 border border-slate-200/30 p-4 rounded-3xl relative overflow-hidden min-h-[380px]">
            
            {/* Ambient indicator indicating "Real-Time Customer Screen View" */}
            <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between text-[9px] text-slate-400 font-bold border-b border-slate-200/30 pb-2 z-10">
              <span className="flex items-center gap-1 text-emerald-600">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                <span>بروزرسانی زنده منو</span>
              </span>
              <span>خروجی نهایی سمت مشتری</span>
            </div>

            {/* Simulated Live Product Card with physical elevation */}
            <motion.div
              layout
              className="mt-6 bg-white border border-slate-100 rounded-2xl p-3.5 shadow-[0_16px_35px_-12px_rgba(0,0,0,0.05)] relative z-20 flex flex-col gap-3"
            >
              {/* Product Visual Container with gradient masks */}
              <div className="h-28 sm:h-32 w-full rounded-xl overflow-hidden relative bg-slate-100">
                <img 
                  src="https://images.unsplash.com/photo-1628840042765-356cda07504e?w=500&auto=format&fit=crop&q=60" 
                  alt="پیتزا پپرونی تند" 
                  className="w-full h-full object-cover grayscale-[15%] group-hover:scale-105 transition-transform duration-700 ease-out" 
                  referrerPolicy="no-referrer"
                />
                
                {/* Visual indicator lines / bounding boxes representing design overlays */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                
                {/* Active Dynamic Badges */}
                <div className="absolute bottom-2 right-2 flex flex-wrap gap-1 text-right">
                  {menuState.tags.map((tag) => (
                    <span key={tag} className="text-[8px] bg-emerald-500 text-white px-2 py-0.5 rounded-md font-black shadow-sm">
                      {tag}
                    </span>
                  ))}
                  <span className="text-[8px] bg-red-500 text-white px-2 py-0.5 rounded-md font-black shadow-sm flex items-center gap-0.5">
                    <span>تند</span>
                  </span>
                </div>

                {/* Simulated Floating Discount Tag with absolute transition */}
                <AnimatePresence>
                  {menuState.isDiscountActive && (
                    <motion.div
                      initial={{ scale: 0, opacity: 0, x: 10 }}
                      animate={{ scale: 1, opacity: 1, x: 0 }}
                      exit={{ scale: 0, opacity: 0, x: 10 }}
                      className="absolute top-2 left-2 bg-red-500 text-white text-[9px] px-2 py-1 rounded-lg font-black shadow-lg border border-red-400/20"
                    >
                      {fPrice(menuState.discount)}٪ تخفیف ویژه
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Unavailable Overlay */}
                <AnimatePresence>
                  {!menuState.available && (
                    <motion.div 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="absolute inset-0 bg-slate-950/80 backdrop-blur-[2px] flex flex-col items-center justify-center p-3 text-center"
                    >
                      <span className="text-[11px] text-red-400 font-black border-2 border-red-500/30 px-3.5 py-1 rounded-lg bg-red-500/10 tracking-wide">
                        اتمام موجودی موقت
                      </span>
                      <p className="text-[9px] text-slate-300 mt-1.5 font-medium">سفارش‌گیری این آیتم غیرفعال شد</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Title & Description Info */}
              <div className="text-right">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-black text-slate-900 leading-tight">پیتزا پپرونی مخصوص</h4>
                  <span className="text-[9px] text-slate-400 font-mono">CODE: #PEP-24</span>
                </div>
                <p className="text-[10px] text-slate-500 mt-1 leading-relaxed">
                  کوکتل پپرونی ممتاز، پنیر موزارلا، سس مخصوص تند طبیعی، همراه با آویشن کوهی
                </p>

                {/* Add-ons List inside Card (Dynamic snap) */}
                <AnimatePresence>
                  {menuState.addons.length > 0 && (
                    <motion.div 
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="mt-2 bg-emerald-50/50 border border-emerald-100 p-1.5 rounded-lg flex items-center justify-between text-[9px] text-emerald-800"
                    >
                      <span className="font-extrabold flex items-center gap-1">
                        <Check className="w-3 h-3" />
                        <span>افزودنی متصل: {menuState.addons.join(' + ')}</span>
                      </span>
                      <span className="font-mono text-slate-500">+۳۵,۰۰۰ تومان</span>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Pricing, Buttons & Interactions with intermediate animations */}
              <div className="flex items-center justify-between pt-2.5 border-t border-slate-100">
                {menuState.available ? (
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={() => { triggerOrder(); }}
                    className="h-7 px-3.5 bg-slate-900 text-white rounded-lg text-[10px] font-black flex items-center gap-1.5 hover:bg-emerald-600 cursor-pointer transition-colors border-0"
                  >
                    <ShoppingCart className="w-3.5 h-3.5" weight="bold" />
                    <span>سفارش آزمایشی</span>
                  </motion.button>
                ) : (
                  <span className="text-[10px] text-slate-400 font-extrabold bg-slate-100 px-3 py-1 rounded-lg">
                    غیرقابل سفارش
                  </span>
                )}

                <div className="text-left font-mono">
                  {menuState.isDiscountActive ? (
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs text-red-500 line-through opacity-50">
                        {fPrice(menuState.price)}
                      </span>
                      <span className="text-sm font-black text-emerald-600">
                        {fPrice(Math.round(menuState.price * (1 - menuState.discount / 100)))}
                      </span>
                      <span className="text-[8px] text-slate-500 font-sans font-bold">تومان</span>
                    </div>
                  ) : (
                    <div>
                      <span className="text-sm font-black text-slate-800">
                        {fPrice(menuState.price)}
                      </span>
                      <span className="text-[8px] text-slate-500 font-sans font-bold mr-0.5">تومان</span>
                    </div>
                  )}
                </div>
              </div>

            </motion.div>

            {/* FLOATING DIRECT ORDERS TICKETS STREAM (Shows direct orders flow) */}
            <div className="mt-4 border-t border-slate-200/50 pt-3 relative z-10">
              <div className="flex items-center justify-between text-[10px] font-extrabold text-slate-400 mb-2">
                <span className="bg-emerald-500/10 text-emerald-700 px-2 py-0.5 rounded-full flex items-center gap-1 font-black">
                  <CheckCircle className="w-3 h-3 text-emerald-500" weight="fill" />
                  <span>بدون واسطه مستقیم به آشپزخانه</span>
                </span>
                <span>سفارش‌های دریافتی زنده</span>
              </div>

              {/* Stack of tickets sliding down */}
              <div className="space-y-1.5 overflow-hidden max-h-24">
                <AnimatePresence initial={false}>
                  {orderTickets.map((ticket, index) => (
                    <motion.div
                      key={ticket.id}
                      initial={{ opacity: 0, y: -15, scale: 0.95 }}
                      animate={{ opacity: 1 - index * 0.35, y: 0, scale: 1 - index * 0.02 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ ease: PRIMARY_EASE, duration: 0.5 }}
                      className="bg-white border border-emerald-500/10 rounded-xl p-2 flex items-center justify-between text-right shadow-xs"
                    >
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 bg-emerald-50 rounded-lg flex items-center justify-center text-emerald-600 font-extrabold shrink-0 text-[10px]">
                          {ticket.id}
                        </div>
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="text-[10px] font-black text-slate-800">{ticket.table}</span>
                            <span className="text-[8px] text-slate-400">• {ticket.time}</span>
                          </div>
                          <p className="text-[9px] text-slate-500 font-medium">{ticket.items}</p>
                        </div>
                      </div>

                      <div className="text-left">
                        <span className="text-[10px] font-black text-emerald-600 font-mono">
                          {fPrice(ticket.price)} <span className="text-[8px] font-sans text-slate-400">تومان</span>
                        </span>
                        <div className="text-[7px] text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded font-black mt-0.5 text-center leading-none">
                          واریز مستقیم آنی
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </div>

          </div>

        </div>

        {/* Bounded Info Footer on the system */}
        <div className="mt-4 pt-3 border-t border-slate-200/50 flex items-center justify-between text-[10px] text-slate-400 font-medium">
          <span className="flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            <span>متصل به درگاه پرداخت مستقیم شاپرک</span>
          </span>
          <span>ویترین © ۱۴۰۵</span>
        </div>

      </div>

    </div>
  );
};
