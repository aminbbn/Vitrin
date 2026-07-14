import React from 'react';
import { CheckCircle, XCircle } from '@phosphor-icons/react';

interface ComparisonSectionProps {
  theme: 'light' | 'dark';
}

const COMPARISONS = [
  {
    before: 'طراحی منو با نرم‌افزارهای گرافیکی سنگین، خروجی گرفتن آفلاین و ارسال اسکرین‌شات‌های غیرقابل‌کلیک به مشتریان.',
    after: 'طراحی مستقیم و زنده در استودیو گرافیکی با چیدمان‌های گوناگون و انتشار آنی بر روی وب‌اپلیکیشن اختصاصی رستوران.',
  },
  {
    before: 'نیاز به چاپ مجدد کاتالوگ یا به‌روزرسانی پرهزینه فایل‌های دانلودی تنها برای ویرایش قیمت یک غذا.',
    after: 'تغییر آنی قیمت‌ها، تخفیف‌ها و پیشنهادهای روزانه در کوتاه‌ترین زمان و همگام‌سازی بلافاصله روی نمایشگر مشتریان.',
  },
  {
    before: 'توضیح مکرر اتمام موجودی غذاها پشت تلفن، ثبت ناخواسته سفارش‌های ناموجود و ایجاد نارضایتی.',
    after: 'غیرفعال‌سازی آنی موجودی با سوئیچ ساده، جلوگیری کامل از ثبت سفارش‌های ناموجود و به‌روزرسانی خودکار منو.',
  },
  {
    before: 'نوشتن دستی سفارش‌های سالن روی برگه کاغذ، سردرگمی پرسنل سالن و آشپزخانه و احتمال زیاد خطا در فرآیند تهیه.',
    after: 'ثبت خودکار سفارش مستقیم از روی میز توسط مشتری، ارسال مستقیم به پرینترهای آشپزخانه سالن و ثبت فوری صورتحساب.'
  }
];

export const ComparisonSection: React.FC<ComparisonSectionProps> = ({ theme }) => {
  return (
    <section className="py-16 md:py-24 bg-[#EEF2F0] dark:bg-[#101412] text-slate-900 dark:text-slate-100 transition-colors duration-300 border-b border-slate-200/50 dark:border-white/[0.04]">
      <div className="max-w-[1000px] mx-auto px-6">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-[10px] uppercase tracking-[0.2em] font-black text-emerald-600 dark:text-[#19C78C] bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
            تغییر شگرف در کسب‌وکار
          </span>
          <h2 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white mt-4 leading-none tracking-tight">
            چرا رستوران‌های مدرن ویترین را برمی‌گزینند؟
          </h2>
          <p className="text-slate-500 dark:text-slate-400 mt-4 leading-relaxed font-bold text-sm md:text-base">
            مقایسه رویکرد نوین پلتفرم ابری ویترین با روش‌های سنتی و پرمخاطره قدیمی
          </p>
        </div>

        {/* Elegant comparison grid */}
        <div className="bg-white dark:bg-[#141917] rounded-[2rem] border border-slate-200/60 dark:border-white/5 shadow-[0_12px_24px_-10px_rgba(0,0,0,0.03)] dark:shadow-none overflow-hidden">
          
          {/* Header Row */}
          <div className="grid grid-cols-2 bg-slate-900 text-white p-5 text-right font-black text-xs md:text-sm">
            <div className="border-r border-white/10 pr-4">با پلتفرم ابری ویترین</div>
            <div className="pr-4 text-slate-400">روش‌های سنتی و دستی قدیمی</div>
          </div>

          {/* Comparison Rows */}
          <div className="divide-y divide-slate-100 dark:divide-white/5 text-right text-xs md:text-sm font-bold">
            {COMPARISONS.map((row, idx) => (
              <div 
                key={idx}
                className="grid grid-cols-2 p-5 md:p-6 items-start gap-6 hover:bg-slate-50/50 dark:hover:bg-white/[0.01] transition-colors"
              >
                {/* With Vitrin (RTL rightmost/first column) */}
                <div className="border-r border-slate-100 dark:border-white/5 pr-4 flex items-start gap-2.5 text-slate-900 dark:text-slate-100 font-bold">
                  <CheckCircle className="w-5 h-5 text-[#10b981] shrink-0 mt-0.5" weight="fill" />
                  <p className="leading-relaxed">{row.after}</p>
                </div>

                {/* Old Ways (RTL leftmost/second column) */}
                <div className="pr-4 flex items-start gap-2.5 text-slate-400 dark:text-slate-500">
                  <XCircle className="w-5 h-5 text-slate-300 dark:text-slate-700 shrink-0 mt-0.5" weight="fill" />
                  <p className="leading-relaxed">{row.before}</p>
                </div>
              </div>
            ))}
          </div>

        </div>

      </div>
    </section>
  );
};
