import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  CaretLeft, 
  CaretRight, 
  Check, 
  ShoppingCart, 
  Sparkle, 
  DeviceMobile, 
  QrCode,
  List,
  MapPin,
  Circle,
  Clock
} from '@phosphor-icons/react';
import { IPhone17ProMaxFrame } from './IPhone17ProMaxFrame';

interface CartItem {
  name: string;
  price: number;
  mods: string[];
}

interface CustomerJourneyModuleProps {
  theme: 'light' | 'dark';
}

export const CustomerJourneyModule: React.FC<CustomerJourneyModuleProps> = ({ theme }) => {
  const [flowStep, setFlowStep] = useState<number>(1);
  const [appliedFlowModifiers, setAppliedFlowModifiers] = useState<string[]>([]);
  const [selectedFlowTable, setSelectedFlowTable] = useState<number>(5);
  const [flowCart, setFlowCart] = useState<CartItem[]>([]);

  const addFlowToCart = () => {
    const newItem: CartItem = {
      name: 'پیتزا پپرونی مخصوص زغالی',
      price: 340000 + (appliedFlowModifiers.includes('پنیر اضافه') ? 35000 : 0),
      mods: [...appliedFlowModifiers]
    };
    setFlowCart([newItem]);
    setFlowStep(4);
  };

  const restartFlow = () => {
    setFlowStep(1);
    setAppliedFlowModifiers([]);
    setFlowCart([]);
  };

  return (
    <section 
      id="experience" 
      className="py-16 md:py-24 bg-[#F5F7F6] dark:bg-[#080A09] text-slate-900 dark:text-slate-100 transition-colors duration-300 border-b border-slate-200/50 dark:border-white/[0.04] scroll-mt-20"
    >
      <div className="max-w-[1200px] mx-auto px-6">
        
        {/* Module Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-[10px] uppercase tracking-[0.2em] font-black text-emerald-600 dark:text-[#19C78C] bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
            ماژول شماره سه
          </span>
          <h2 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white mt-4 leading-none tracking-tight">
            تجربه خرید بی‌نقص مشتری
          </h2>
          <p className="text-slate-500 dark:text-slate-400 mt-4 leading-relaxed font-bold text-sm md:text-base">
            یک شبیه‌سازی گام‌به‌گام از تجربه کاربری مشتریان شما. اسکن کنید، فیلتر کنید، چاشنی دلخواه را انتخاب کنید، شماره میز خود را وارد کنید و به صورت آنی فاکتور نهایی را مشاهده نمایید.
          </p>
        </div>

        {/* Device & Interactive Simulator Area */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-stretch max-w-5xl mx-auto bg-white dark:bg-[#101412] border border-slate-200/50 dark:border-white/5 rounded-[2.5rem] p-6 md:p-10 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)] dark:shadow-none">
          
          {/* Guide Steps Column (Right in RTL / Left in Visual Order) */}
          <div className="lg:col-span-6 flex flex-col justify-between text-right self-stretch">
            <div className="space-y-6">
              <span className="text-[10px] font-black text-emerald-600 dark:text-[#19C78C] bg-emerald-500/10 px-3.5 py-1.5 rounded-full border border-emerald-500/20 uppercase tracking-widest inline-block select-none">
                بروشور راهنمای شبیه‌ساز مشتری
              </span>

              <AnimatePresence mode="wait">
                {flowStep === 1 && (
                  <motion.div 
                    key="step1"
                    initial={{ opacity: 0, x: 15 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -15 }}
                    className="space-y-4"
                  >
                    <h3 className="text-xl font-black text-slate-900 dark:text-white leading-none">
                      گام اول: اسکن و صفحه خانه
                    </h3>
                    <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400 leading-relaxed font-bold">
                      مشتری شما QR کد چسبانده شده روی میز شماره 5 را با دوربین اسکن کرده و فوراً منوی آنلاین کافه را بدون نیاز به دانلود هیچ اپلیکیشنی بر روی گوشی خود لود می‌کند.
                    </p>
                    <button 
                      onClick={() => setFlowStep(2)}
                      className="px-5 py-3.5 bg-slate-900 hover:bg-slate-800 dark:bg-[#10B981] dark:hover:bg-emerald-500 text-white font-black text-xs rounded-xl flex items-center gap-1.5 cursor-pointer border-0 shadow-md active:scale-[0.98] transition-all"
                    >
                      <span>تپ روی دسته پیتزا در شبیه‌ساز</span>
                      <CaretLeft className="w-4 h-4" />
                    </button>
                  </motion.div>
                )}

                {flowStep === 2 && (
                  <motion.div 
                    key="step2"
                    initial={{ opacity: 0, x: 15 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -15 }}
                    className="space-y-4"
                  >
                    <h3 className="text-xl font-black text-slate-900 dark:text-white leading-none">
                      گام دوم: گالری و جزئیات منو
                    </h3>
                    <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400 leading-relaxed font-bold">
                      منوی فیلتر شده پیتزاهای لایو با چیدمان زیبا به همراه عکس، برچسب‌های ویژه (مانند اسپایسی) و قیمت‌ها برای مشتری بارگیری می‌شود. روی پیتزا تپ کنید.
                    </p>
                    <button 
                      onClick={() => setFlowStep(3)}
                      className="px-5 py-3.5 bg-slate-900 hover:bg-slate-800 dark:bg-[#10B981] dark:hover:bg-emerald-500 text-white font-black text-xs rounded-xl flex items-center gap-1.5 cursor-pointer border-0 shadow-md active:scale-[0.98] transition-all"
                    >
                      <span>انتخاب «پیتزا پپرونی زغالی»</span>
                      <CaretLeft className="w-4 h-4" />
                    </button>
                  </motion.div>
                )}

                {flowStep === 3 && (
                  <motion.div 
                    key="step3"
                    initial={{ opacity: 0, x: 15 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -15 }}
                    className="space-y-4"
                  >
                    <h3 className="text-xl font-black text-slate-900 dark:text-white leading-none">
                      گام سوم: شخصی‌سازی و مواد افزودنی
                    </h3>
                    <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400 leading-relaxed font-bold">
                      یک باتم‌شیت شکیل بالا می‌آید. مشتری می‌تواند مخلفاتی را که مایل نیست حذف کند یا چاشنی‌های دلخواه خود (مثلا پنیر اضافه) را تیک بزند.
                    </p>

                    {/* Checkbox selector representing modification of item */}
                    <div className="bg-slate-50 dark:bg-[#141917] p-4 rounded-xl border border-slate-200/50 dark:border-white/5 text-right">
                      <div className="flex items-center justify-between text-xs font-black">
                        <span className="font-mono text-emerald-600 dark:text-[#19C78C] font-black">+35,000 تومان</span>
                        <label className="flex items-center gap-2 cursor-pointer select-none">
                          <span className="text-slate-700 dark:text-slate-200">افزودن پنیر چدار به پیتزا</span>
                          <input 
                            type="checkbox" 
                            checked={appliedFlowModifiers.includes('پنیر اضافه')}
                            onChange={(e) => {
                              if (e.target.checked) setAppliedFlowModifiers(['پنیر اضافه']);
                              else setAppliedFlowModifiers([]);
                            }}
                            className="accent-[#10b981] w-4 h-4 rounded cursor-pointer"
                          />
                        </label>
                      </div>
                    </div>

                    <button 
                      onClick={addFlowToCart}
                      className="px-5 py-3.5 bg-slate-900 hover:bg-slate-800 dark:bg-[#10B981] dark:hover:bg-emerald-500 text-white font-black text-xs rounded-xl flex items-center gap-1.5 cursor-pointer border-0 shadow-md active:scale-[0.98] transition-all"
                    >
                      <span>تایید و افزودن به سبد خرید</span>
                      <CaretLeft className="w-4 h-4" />
                    </button>
                  </motion.div>
                )}

                {flowStep === 4 && (
                  <motion.div 
                    key="step4"
                    initial={{ opacity: 0, x: 15 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -15 }}
                    className="space-y-4"
                  >
                    <h3 className="text-xl font-black text-slate-900 dark:text-white leading-none">
                      گام چهارم: بررسی سبد خرید دیجیتال
                    </h3>
                    <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400 leading-relaxed font-bold">
                      مشتری جزئیات فاکتور، مبالغ افزوده شده و فاکتور نهایی شفاف را قبل از تایید پرداخت پایش می‌نماید. هیچ ابهامی در صورتحساب وجود نخواهد داشت.
                    </p>
                    <button 
                      onClick={() => setFlowStep(5)}
                      className="px-5 py-3.5 bg-slate-900 hover:bg-slate-800 dark:bg-[#10B981] dark:hover:bg-emerald-500 text-white font-black text-xs rounded-xl flex items-center gap-1.5 cursor-pointer border-0 shadow-md active:scale-[0.98] transition-all"
                    >
                      <span>تعیین شماره میز سالن</span>
                      <CaretLeft className="w-4 h-4" />
                    </button>
                  </motion.div>
                )}

                {flowStep === 5 && (
                  <motion.div 
                    key="step5"
                    initial={{ opacity: 0, x: 15 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -15 }}
                    className="space-y-4"
                  >
                    <h3 className="text-xl font-black text-slate-900 dark:text-white leading-none">
                      گام پنجم: انتخاب شماره میز و ارسال
                    </h3>
                    <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400 leading-relaxed font-bold">
                      مشتری شماره میز خود را انتخاب و تایید نهایی می‌کند. سفارش با تیک سبز ثبت شده و فوراً راهی مانیتور پرسنل آشپزخانه رستوران می‌شود!
                    </p>

                    {/* Salon Table Selectors */}
                    <div className="bg-slate-50 dark:bg-[#141917] p-4 rounded-xl border border-slate-200/50 dark:border-white/5">
                      <span className="text-[10px] text-slate-400 font-black block mb-3 text-right">شماره میز فیزیکی خود را وارد کنید:</span>
                      <div className="grid grid-cols-4 gap-2">
                        {[2, 3, 4, 5, 6, 7, 8, 9].map((tbl) => (
                          <button
                            key={tbl}
                            onClick={() => setSelectedFlowTable(tbl)}
                            className={`py-2 rounded-lg text-xs font-mono font-black border cursor-pointer transition-all ${
                              selectedFlowTable === tbl 
                                ? 'bg-[#10b981] border-transparent text-white scale-105 shadow-sm' 
                                : 'bg-white dark:bg-[#101412] text-slate-600 dark:text-slate-400 border-slate-200 dark:border-white/5 hover:bg-slate-50 dark:hover:bg-white/5'
                            }`}
                          >
                            {tbl}
                          </button>
                        ))}
                      </div>
                    </div>

                    <button 
                      onClick={() => {
                        setFlowStep(5);
                      }}
                      className="px-5 py-3.5 bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs rounded-xl flex items-center gap-1.5 cursor-pointer border-0 shadow-md active:scale-[0.98] transition-all"
                    >
                      <span>ثبت نهایی و ارسال سفارش</span>
                      <Check className="w-4 h-4" />
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Bottom info indicators */}
            <div className="mt-8 pt-6 border-t border-slate-100 dark:border-white/5 flex items-center gap-4 text-[11px] text-slate-400 font-bold select-none">
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                <span>بدون نصب نرم‌افزار</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                <span>اتصال آنی ابری</span>
              </div>
            </div>

          </div>

          {/* Interactive Screen Display (Left in RTL / Right in Visual Order) */}
          <div className="lg:col-span-6 flex justify-center items-center">
            
            {/* High-fidelity CSS iPhone 17 Pro Max Frame */}
            <IPhone17ProMaxFrame variant="standard" className="z-10">
              
              {/* Simulated Screen Container */}
              <div className="flex-1 flex flex-col pt-4 pb-4 relative overflow-hidden bg-white dark:bg-[#101412] text-slate-800 dark:text-slate-200">
                
                <div className="flex-1 overflow-y-auto relative flex flex-col scrollbar-none px-3.5 py-2">
                    <AnimatePresence mode="wait">
                      
                      {/* SCREEN 1: Brand Welcome & Main Categories */}
                      {flowStep === 1 && (
                        <motion.div
                          key="sc-1"
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -20 }}
                          className="space-y-3 flex-1 flex flex-col justify-between"
                        >
                          <div className="space-y-3">
                            {/* Inner header */}
                            <div className="flex justify-between items-center pb-2 border-b border-slate-100 dark:border-white/5">
                              <span className="text-[7.5px] bg-emerald-500/10 text-emerald-600 dark:text-[#19C78C] border border-emerald-500/20 px-2 py-0.5 rounded font-black">
                                میز شماره 5
                              </span>
                              <div>
                                <h4 className="font-black text-[9.5px]">کافه رستوران قصر</h4>
                                <span className="text-[7px] text-slate-400 block mt-0.5">ثبت زنده و بی واسطه سفارش</span>
                              </div>
                            </div>

                            {/* Chef suggestion promo banner */}
                            <div 
                              className="h-24 bg-slate-900 text-white p-3 rounded-xl relative overflow-hidden flex flex-col justify-end"
                              style={{ backgroundImage: `linear-gradient(rgba(0,0,0,0.15), rgba(0,0,0,0.85)), url(https://picsum.photos/seed/pepperoni_suggest/400/200)`, backgroundSize: 'cover' }}
                            >
                              <span className="text-[7px] bg-[#10b981] px-1.5 py-0.5 rounded w-max mb-1 font-black">سرآشپز سفارش می‌کند</span>
                              <h3 className="font-black text-[10px]">منوی پیتزاهای دست‌ساز تنوری</h3>
                            </div>

                            {/* Menu Categories */}
                            <div className="space-y-1.5 text-right">
                              <span className="text-[8px] font-black text-slate-400 block">دسته‌بندی‌ها</span>
                              <div className="grid grid-cols-2 gap-2">
                                <button 
                                  onClick={() => setFlowStep(2)} 
                                  className="bg-emerald-500/10 text-emerald-600 dark:text-[#19C78C] border border-emerald-500/20 p-3 rounded-xl flex flex-col items-center gap-1 font-black transition-transform hover:scale-[1.03] cursor-pointer"
                                >
                                  <span className="text-xl">🍕</span>
                                  <span className="text-[9px]">پیتزای زغالی</span>
                                </button>
                                <button className="bg-slate-50 dark:bg-white/[0.02] text-slate-400 border border-slate-200/50 dark:border-white/5 p-3 rounded-xl flex flex-col items-center gap-1 font-bold opacity-45 pointer-events-none">
                                  <span className="text-xl">🍔</span>
                                  <span className="text-[9px]">برگر ذغالی</span>
                                </button>
                              </div>
                            </div>
                          </div>

                          {/* Welcome Campaign badge */}
                          <div className="bg-slate-50 dark:bg-white/[0.02] p-2.5 rounded-xl border border-slate-200/60 dark:border-white/5 mt-auto">
                            <span className="text-[8px] text-emerald-600 dark:text-[#19C78C] font-black block">🎁 کمپین خوش‌آمدگویی</span>
                            <p className="text-[7px] text-slate-400 mt-0.5 font-bold">10٪ تخفیف بدون قرعه کشی بر روی تمام فاکتورها</p>
                          </div>
                        </motion.div>
                      )}

                      {/* SCREEN 2: Product Catalog Grid list */}
                      {flowStep === 2 && (
                        <motion.div
                          key="sc-2"
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -20 }}
                          className="space-y-3 flex-1"
                        >
                          <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-white/5">
                            <button 
                              onClick={() => setFlowStep(1)} 
                              className="text-[8px] text-slate-400 hover:text-slate-600 flex items-center gap-0.5 border-0 bg-transparent cursor-pointer font-black"
                            >
                              <CaretLeft className="w-3 h-3 rotate-180" />
                              <span>بازگشت</span>
                            </button>
                            <h3 className="font-black text-[10px]">🍕 پیتزاهای زغالی</h3>
                          </div>

                          {/* Catalog Item card */}
                          <div 
                            onClick={() => setFlowStep(3)} 
                            className="bg-slate-50 dark:bg-white/[0.02] p-2.5 rounded-xl border border-emerald-500/20 dark:border-white/5 hover:border-emerald-500/30 transition-all cursor-pointer flex gap-3 shadow-sm"
                          >
                            <div className="w-14 h-14 bg-slate-100 rounded-lg overflow-hidden shrink-0">
                              <img src="https://picsum.photos/seed/pepp_cat/150/150" className="w-full h-full object-cover" alt="pepperoni" />
                            </div>
                            <div className="flex-1 text-right flex flex-col justify-between py-0.5">
                              <div>
                                <h4 className="font-black text-[9px] text-slate-900 dark:text-white leading-tight">پیتزا پپرونی مخصوص زغالی</h4>
                                <p className="text-[7px] text-slate-400 truncate mt-0.5">پپرونی ممتاز 90٪، قارچ، پنیر موزارلای دودی فر پخت</p>
                              </div>
                              <div className="flex justify-between items-center mt-1">
                                <span className="text-[7px] bg-red-500/10 text-rose-500 px-1.5 py-0.5 rounded font-black">🌶️ اسپایسی</span>
                                <span className="font-mono text-[9px] font-black text-emerald-600 dark:text-emerald-400">340,000 تومان</span>
                              </div>
                            </div>
                          </div>

                          {/* Placeholder menu row */}
                          <div className="bg-slate-50 dark:bg-white/[0.02] p-2.5 rounded-xl border border-slate-200/40 dark:border-white/5 opacity-50 flex gap-3 pointer-events-none">
                            <div className="w-14 h-14 bg-slate-100 rounded-lg overflow-hidden shrink-0">
                              <img src="https://picsum.photos/seed/marg_cat/150/150" className="w-full h-full object-cover" alt="margarita" />
                            </div>
                            <div className="flex-1 text-right flex flex-col justify-between py-0.5">
                              <div>
                                <h4 className="font-black text-[9px]">پیتزا مارگاریتا ایتالیایی</h4>
                                <p className="text-[7px] text-slate-400 truncate">ریحان تازه، گوجه خشک فرآوری شده، روغن زیتون</p>
                              </div>
                              <div className="text-left mt-1">
                                <span className="font-mono text-[9px]">290,000 تومان</span>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      )}

                      {/* SCREEN 3: Customization bottom sheet view */}
                      {flowStep === 3 && (
                        <motion.div
                          key="sc-3"
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -20 }}
                          className="space-y-3 flex-1 flex flex-col justify-between"
                        >
                          <div className="space-y-3">
                            <div className="flex justify-between items-center pb-1.5 border-b border-slate-100 dark:border-white/5">
                              <button 
                                onClick={() => setFlowStep(2)} 
                                className="text-[8px] text-slate-400 hover:text-slate-600 flex items-center gap-0.5 border-0 bg-transparent cursor-pointer font-black"
                              >
                                <CaretLeft className="w-3 h-3 rotate-180" />
                                <span>بازگشت</span>
                              </button>
                              <span className="font-black text-[9px]">سفارشی‌سازی جزئیات</span>
                            </div>

                            <div className="h-24 bg-slate-100 rounded-xl overflow-hidden select-none">
                              <img src="https://picsum.photos/seed/pepp_detail/300/150" className="w-full h-full object-cover" alt="detail" />
                            </div>

                            <div className="text-right">
                              <h4 className="font-black text-[10px]">پیتزا پپرونی مخصوص زغالی</h4>
                              <p className="text-[7.5px] text-slate-400 mt-0.5">به همراه روغن سیر فرآوری شده و سس کوکتل دست‌ساز</p>
                            </div>

                            {/* Modifier selection mock */}
                            <div className="bg-slate-50 dark:bg-white/[0.02] p-2.5 rounded-lg border border-slate-200/60 dark:border-white/5 text-right space-y-1">
                              <span className="text-[7.5px] font-black text-slate-400 block mb-1">چاشنی و مخلفات سفارش</span>
                              <div className="flex items-center justify-between text-[8px] font-black">
                                <span className="font-mono text-emerald-600 dark:text-[#19C78C]">+35,000 تومان</span>
                                <label className="flex items-center gap-1 cursor-pointer select-none">
                                  <span>پنیر پیتزا چدار اضافه</span>
                                  <input 
                                    type="checkbox" 
                                    checked={appliedFlowModifiers.includes('پنیر اضافه')}
                                    onChange={(e) => {
                                      if (e.target.checked) setAppliedFlowModifiers(['پنیر اضافه']);
                                      else setAppliedFlowModifiers([]);
                                    }}
                                    className="accent-[#10b981] w-3.5 h-3.5 rounded"
                                  />
                                </label>
                              </div>
                            </div>
                          </div>

                          {/* Purchase footer */}
                          <div className="pt-2.5 border-t border-slate-100 dark:border-white/5 flex items-center justify-between mt-auto">
                            <button 
                              onClick={addFlowToCart} 
                              className="px-3.5 py-2.5 bg-[#10b981] hover:bg-emerald-500 text-white rounded-lg text-[8.5px] font-black flex items-center gap-1 cursor-pointer border-0 shadow-sm"
                            >
                              <span>افزودن به سبد</span>
                              <ShoppingCart className="w-3.5 h-3.5" />
                            </button>
                            <div className="text-left font-bold">
                              <span className="text-[7px] text-slate-400 block">فاکتور نهایی</span>
                              <span className="font-mono text-[9px] text-[#10b981] font-black">
                                {(340000 + (appliedFlowModifiers.includes('پنیر اضافه') ? 35000 : 0)).toLocaleString()} تومان
                              </span>
                            </div>
                          </div>
                        </motion.div>
                      )}

                      {/* SCREEN 4: Digital Cart verification */}
                      {flowStep === 4 && (
                        <motion.div
                          key="sc-4"
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -20 }}
                          className="space-y-3 flex-1 flex flex-col justify-between"
                        >
                          <div className="space-y-3">
                            <div className="flex items-center justify-between pb-1.5 border-b border-slate-100 dark:border-white/5">
                              <button 
                                onClick={() => setFlowStep(3)} 
                                className="text-[8px] text-slate-400 hover:text-slate-600 flex items-center gap-0.5 border-0 bg-transparent cursor-pointer font-black"
                              >
                                <CaretLeft className="w-3 h-3 rotate-180" />
                                <span>برگشت</span>
                              </button>
                              <h3 className="font-black text-[10px]">🛒 سبد خرید شما</h3>
                            </div>

                            {flowCart.length === 0 ? (
                              <p className="text-slate-400 text-center py-10 text-[8px] font-bold">سبد خرید شما در حال حاضر خالی است.</p>
                            ) : (
                              flowCart.map((item, idx) => (
                                <div key={idx} className="bg-slate-50 dark:bg-white/[0.02] p-2.5 rounded-lg border border-slate-200/50 dark:border-white/5 space-y-1.5 text-right">
                                  <div className="flex justify-between items-center text-[8px] font-black">
                                    <span className="font-mono text-slate-400">1 عدد</span>
                                    <h4 className="text-slate-800 dark:text-slate-100">{item.name}</h4>
                                  </div>
                                  {item.mods.length > 0 && (
                                    <p className="text-[7.5px] text-slate-400">افزودنی: {item.mods.join('، ')}</p>
                                  )}
                                  <div className="flex justify-between items-center pt-2 border-t border-slate-200/30 dark:border-white/5 mt-1 font-black">
                                    <span className="text-[7.5px] text-slate-400">مالیات بر ارزش افزوده: رایگان</span>
                                    <span className="font-mono text-[8px]">{(item.price || 0).toLocaleString()} تومان</span>
                                  </div>
                                </div>
                              ))
                            )}
                          </div>

                          {flowCart.length > 0 && (
                            <div className="pt-2 border-t border-slate-100 dark:border-white/5 mt-auto">
                              <div className="flex justify-between text-[8.5px] font-black text-slate-800 dark:text-white mb-2 font-mono">
                                <span>{(flowCart[0]?.price || 0).toLocaleString()} تومان</span>
                                <span>مبلغ کل</span>
                              </div>
                              <button 
                                onClick={() => setFlowStep(5)} 
                                className="w-full py-2.5 bg-[#10b981] hover:bg-emerald-500 text-white rounded-lg text-[8.5px] font-black cursor-pointer border-0 shadow-sm"
                              >
                                تایید نهایی و تعیین شماره میز
                              </button>
                            </div>
                          )}
                        </motion.div>
                      )}

                      {/* SCREEN 5: Order submitted feedback */}
                      {flowStep === 5 && (
                        <motion.div
                          key="sc-5"
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -20 }}
                          className="space-y-4 flex-1 flex flex-col justify-between text-center py-2"
                        >
                          <div className="space-y-3.5 my-auto">
                            <div className="w-10 h-10 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center border border-emerald-500/20 mx-auto">
                              <Check className="w-5 h-5" weight="bold" />
                            </div>

                            <div className="space-y-1">
                              <h3 className="font-black text-[11px] text-slate-950 dark:text-white">سفارش ثبت شد!</h3>
                              <p className="text-[8px] text-slate-400 leading-relaxed max-w-[170px] mx-auto font-bold">
                                سفارش میز شماره {selectedFlowTable} با موفقیت در سیستم مرکزی آشپزخانه رستوران لود شد.
                              </p>
                            </div>

                            <div className="bg-slate-50 dark:bg-white/[0.02] px-2.5 py-1.5 rounded-lg border border-slate-200/60 dark:border-white/5 text-[8px] font-mono inline-block">
                              <span className="text-slate-400 block">فاکتور ثبت شده</span>
                              <span className="font-black text-slate-800 dark:text-slate-200">VIT-9204-QR</span>
                            </div>
                          </div>

                          <button 
                            onClick={restartFlow} 
                            className="w-full py-2 bg-slate-50 dark:bg-white/[0.02] hover:bg-slate-100 dark:hover:bg-white/5 text-slate-500 dark:text-slate-400 rounded-lg text-[8px] font-black transition-colors border-0 cursor-pointer"
                          >
                            ثبت سفارش مجدد
                          </button>
                        </motion.div>
                      )}

                    </AnimatePresence>
                  </div>

                </div>

            </IPhone17ProMaxFrame>

          </div>

        </div>

      </div>
    </section>
  );
};
