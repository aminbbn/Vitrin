import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Check, 
  Clock, 
  Lightning, 
  Printer, 
  ShieldCheck, 
  SoundWave,
  ChefHat
} from '@phosphor-icons/react';

interface OrderManagementModuleProps {
  theme: 'light' | 'dark';
}

interface StatusStep {
  key: string;
  label: string;
  color: string;
}

const STATUSES: StatusStep[] = [
  { key: 'received', label: 'دریافت شده', color: 'bg-indigo-500' },
  { key: 'preparing', label: 'آماده‌سازی', color: 'bg-amber-500' },
  { key: 'ready', label: 'آماده تحویل', color: 'bg-emerald-500' },
  { key: 'delivered', label: 'تحویل شده', color: 'bg-slate-700' }
];

export const OrderManagementModule: React.FC<OrderManagementModuleProps> = ({ theme }) => {
  const [orderStatus, setOrderStatus] = useState<'received' | 'preparing' | 'ready' | 'delivered'>('received');
  const [isPrinting, setIsPrinting] = useState<boolean>(false);

  const advanceOrderStatus = () => {
    if (orderStatus === 'received') setOrderStatus('preparing');
    else if (orderStatus === 'preparing') setOrderStatus('ready');
    else if (orderStatus === 'ready') setOrderStatus('delivered');
    else setOrderStatus('received');
  };

  const simulatePrint = () => {
    setIsPrinting(true);
    setTimeout(() => {
      setIsPrinting(false);
    }, 1500);
  };

  return (
    <section 
      id="orders" 
      className="py-16 md:py-24 bg-[#EEF2F0] dark:bg-[#101412] text-slate-900 dark:text-slate-100 transition-colors duration-300 border-b border-slate-200/50 dark:border-white/[0.04] scroll-mt-20"
    >
      <div className="max-w-[1200px] mx-auto px-6">
        
        {/* Module Header */}
        <div className="text-right max-w-2xl mb-12">
          <span className="text-[10px] uppercase tracking-[0.2em] font-black text-emerald-600 dark:text-[#19C78C] bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
            ماژول شماره چهار
          </span>
          <h2 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white mt-4 leading-none tracking-tight">
            داشبورد آشپزخانه و سفارش‌ها
          </h2>
          <p className="text-slate-500 dark:text-slate-400 mt-4 leading-relaxed font-bold text-sm md:text-base">
            بلافاصله پس از ثبت فاکتور توسط مشتری، هشدار صوتی و تصویری در داشبورد آشپزخانه طنین‌انداز می‌شود. وضعیت سفارش را تغییر دهید تا مشتری بر روی نمایشگر گوشی خود از آخرین پیشرفت مطلع شود.
          </p>
        </div>

        {/* Unified connected workspace: Dashboard Controller & Visual Screen */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* Dashboard Control Box (Right in RTL) */}
          <div className="lg:col-span-5 bg-white dark:bg-[#141917] rounded-[2rem] border border-slate-200/60 dark:border-white/5 p-6 md:p-8 shadow-[0_12px_24px_-10px_rgba(0,0,0,0.03)] dark:shadow-none text-right flex flex-col justify-between">
            <div className="space-y-6">
              <span className="text-[10px] text-emerald-600 dark:text-[#19C78C] font-black bg-emerald-500/10 px-3.5 py-1.5 rounded-full border border-emerald-500/20 uppercase tracking-widest inline-block select-none">
                پنل فرمان دهی و شبیه‌ساز گردش کار
              </span>
              
              <div className="space-y-4">
                <h3 className="text-lg font-black text-slate-900 dark:text-white leading-tight">کنترل مراحل آماده‌سازی</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-bold">
                  سفارش ثبت شده مشتری را گام‌به‌گام ارتقا داده و افکت آماده‌سازی را بر روی مانیتور پرسنل آشپزخانه مشاهده فرمایید:
                </p>

                {/* Main Action buttons */}
                <div className="space-y-2 pt-2">
                  <button 
                    onClick={advanceOrderStatus}
                    className="w-full py-3.5 bg-[#10b981] hover:bg-emerald-500 text-white font-black text-xs rounded-xl flex items-center justify-center gap-2 border-0 shadow-sm cursor-pointer active:scale-[0.98] transition-all"
                  >
                    <Lightning className="w-4 h-4" />
                    <span>ارتقا وضعیت سفارش (تغییر زنده مرحله)</span>
                  </button>

                  <button 
                    onClick={simulatePrint}
                    disabled={isPrinting}
                    className="w-full py-3.5 bg-slate-50 dark:bg-[#101412] text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/5 border border-slate-200/80 dark:border-white/5 font-black text-xs rounded-xl flex items-center justify-center gap-2 cursor-pointer active:scale-[0.98] transition-all"
                  >
                    <Printer className="w-4 h-4" />
                    <span>{isPrinting ? 'در حال چاپ حرارتی فاکتور...' : 'چاپ دستی فاکتور آشپزخانه'}</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Simulated automatic receipt print details */}
            <div className="mt-8 pt-4 border-t border-slate-100 dark:border-white/5 flex items-center justify-between text-[11px] text-slate-400 font-bold">
              <span>اتصال پرینتر حرارتی: بی سیم</span>
              <span>شناسه چاپگر: LP-802</span>
            </div>

          </div>

          {/* Simulated Monitor Screen (Left in RTL) */}
          <div className="lg:col-span-7 flex flex-col justify-center items-stretch">
            
            <div className="w-full text-center lg:text-right mb-6">
              <span className="text-[10px] font-black tracking-widest text-slate-400 block mb-2 select-none uppercase">نمای مانیتور زنده پرسنل آشپزخانه</span>
              <div className="flex items-center justify-center lg:justify-end gap-1.5 text-[11px] font-bold text-slate-400">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_#10b981] animate-pulse" />
                <span>سرور مرکزی متصل است - به روز رسانی ۱ میلی‌ثانیه</span>
              </div>
            </div>

            {/* Dashboard Visual Window chrome */}
            <div className="bg-white dark:bg-[#141917] rounded-[2.5rem] border border-slate-200/60 dark:border-white/5 p-5 md:p-7 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)] dark:shadow-none flex flex-col overflow-hidden text-right">
              
              {/* Fake Chrome head */}
              <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-white/5 mb-6">
                <div className="flex gap-1">
                  <span className="w-2 h-2 rounded-full bg-slate-200 dark:bg-slate-800" />
                  <span className="w-2 h-2 rounded-full bg-slate-200 dark:bg-slate-800" />
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                </div>
                <span className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                  لایو فید آشپزخانه رستوران
                </span>
              </div>

              {/* Advanced Stepper progress bar */}
              <div className="grid grid-cols-4 gap-2 mb-8 relative">
                <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-slate-100 dark:bg-white/5 -translate-y-1/2 z-0" />
                
                {STATUSES.map((status, idx) => {
                  const isPassed = 
                    (orderStatus === 'received' && idx === 0) ||
                    (orderStatus === 'preparing' && idx <= 1) ||
                    (orderStatus === 'ready' && idx <= 2) ||
                    (orderStatus === 'delivered' && idx <= 3);

                  return (
                    <div key={status.key} className="flex flex-col items-center z-10 relative">
                      <div 
                        className={`w-7 h-7 rounded-full flex items-center justify-center border transition-all duration-300 ${
                          isPassed 
                            ? `${status.color} border-transparent text-white shadow-sm` 
                            : 'bg-white dark:bg-[#101412] border-slate-200 dark:border-white/5 text-slate-300'
                        }`}
                      >
                        <Check className={`w-3.5 h-3.5 transition-transform duration-300 ${isPassed ? 'scale-100' : 'scale-0'}`} weight="bold" />
                      </div>
                      <span className={`text-[9px] mt-1.5 font-black transition-all ${isPassed ? 'text-slate-800 dark:text-white' : 'text-slate-400'}`}>
                        {status.label}
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* Active Ticket Card */}
              <div className="bg-slate-50 dark:bg-[#101412] rounded-2xl border border-slate-200/50 dark:border-white/5 p-4 md:p-5 space-y-4 relative overflow-hidden">
                
                {/* Print loading animation overlay */}
                <AnimatePresence>
                  {isPrinting && (
                    <motion.div 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="absolute inset-0 bg-white/90 dark:bg-[#141917]/90 backdrop-blur-[1px] z-20 flex flex-col items-center justify-center gap-2 select-none"
                    >
                      <Printer className="w-7 h-7 text-[#10b981] animate-bounce" />
                      <span className="text-[10px] font-black text-slate-500">در حال ارسال سیگنال چاپی حرارتی...</span>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Top header details */}
                <div className="flex items-center justify-between text-xs font-bold border-b border-slate-200/30 dark:border-white/5 pb-3">
                  <span className="font-mono text-slate-400 flex items-center gap-1 text-[11px]">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    <span>همین الان</span>
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="bg-[#10b981] text-white font-black px-2 py-0.5 rounded text-[10px] select-none">میز ۵</span>
                    <span className="font-mono text-slate-700 dark:text-slate-300">#VIT-9204</span>
                  </div>
                </div>

                {/* Ticket checklists */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center text-xs font-bold text-slate-800 dark:text-slate-100">
                    <span className="font-mono text-slate-400">۱ عدد</span>
                    <span className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#10b981]" />
                      <span>پیتزا پپرونی مخصوص زغالی</span>
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-400 pr-3.5 leading-relaxed font-bold">
                    + پنیر پیتزا چدار اضافه (تایید شد)<br />
                    - فلفل دلمه‌ای حذف شود (بدون فلفل)
                  </p>
                </div>

                {/* Ticket pricing bar */}
                <div className="flex items-center justify-between bg-white dark:bg-[#141917] p-3 rounded-xl border border-slate-200/50 dark:border-white/5 text-xs font-bold pt-3 mt-2">
                  <span className="text-[9.5px] bg-emerald-500/10 text-emerald-600 dark:text-[#19C78C] px-2 py-1 rounded border border-emerald-500/20 select-none">
                    💳 آنلاین - پرداخت شده
                  </span>
                  
                  <div className="text-left font-mono">
                    <span className="text-[8.5px] text-slate-400 block font-black">مبلغ پرداختی فاکتور</span>
                    <span className="text-slate-800 dark:text-white font-black text-[11px]">۳۷۵,۰۰۰ تومان</span>
                  </div>
                </div>

              </div>

            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
