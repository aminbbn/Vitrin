import React from 'react';
import { InstagramLogo, TwitterLogo, WhatsappLogo } from '@phosphor-icons/react';

interface MarketingFooterProps {
  onNavigateHome: () => void;
  onNavigateSolutions?: () => void;
  theme: 'light' | 'dark';
}

export const MarketingFooter: React.FC<MarketingFooterProps> = ({
  onNavigateHome,
  onNavigateSolutions,
  theme
}) => {
  return (
    <footer 
      id="marketing-footer" 
      className="bg-[#080A09] text-slate-400 py-16 border-t border-white/[0.04] text-right transition-colors duration-300"
    >
      <div className="max-w-[1200px] mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-16">
          
          {/* Brand Info Column (Rightmost in RTL) */}
          <div className="lg:col-span-2 flex flex-col items-start text-right">
            <div className="flex items-center gap-3 mb-5">
              <button 
                onClick={onNavigateHome} 
                className="flex items-center gap-3 text-right focus:outline-none rounded-xl p-1 border-0 bg-transparent cursor-pointer"
              >
                <div className="w-10 h-10 bg-[#10b981] rounded-xl flex items-center justify-center shadow-lg shadow-[#10b981]/25">
                  <span className="text-white font-black text-lg">وی</span>
                </div>
                <span className="text-xl font-black tracking-tight text-white">ویترین</span>
              </button>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed max-w-xs font-bold">
              پلتفرم ابری یکپارچه طراحی و توسعه منوی دیجیتال و سفارش‌گیری مستقیم. بدون کارمزد، بدون واسطه و بدون سختی کدنویسی.
            </p>
          </div>

          {/* Links Col 1: Product */}
          <div>
            <h4 className="text-xs font-black text-white mb-5">محصول</h4>
            <ul className="space-y-3 text-xs font-bold list-none p-0 m-0">
              <li>
                <button 
                  onClick={onNavigateHome} 
                  className="hover:text-[#10b981] transition-colors text-right bg-transparent border-none p-0 cursor-pointer text-slate-400 font-bold"
                >
                  صفحه نخست پلتفرم
                </button>
              </li>
              <li>
                <button 
                  onClick={() => {
                    if (onNavigateSolutions) onNavigateSolutions();
                  }}
                  className="hover:text-[#10b981] transition-colors text-right bg-transparent border-none p-0 cursor-pointer text-slate-400 font-bold"
                >
                  راهکارهای صنفی
                </button>
              </li>
              <li>
                <a href="#studio" className="hover:text-[#10b981] transition-colors text-slate-400 no-underline">
                  استودیو منوساز
                </a>
              </li>
              <li>
                <a href="#products" className="hover:text-[#10b981] transition-colors text-slate-400 no-underline">
                  مدیریت محصولات ویژه
                </a>
              </li>
            </ul>
          </div>

          {/* Links Col 2: Company */}
          <div>
            <h4 className="text-xs font-black text-white mb-5">شرکت</h4>
            <ul className="space-y-3 text-xs font-bold list-none p-0 m-0">
              <li>
                <button 
                  onClick={onNavigateHome} 
                  className="hover:text-[#10b981] transition-colors text-right bg-transparent border-none p-0 cursor-pointer text-slate-400 font-bold"
                >
                  درباره ما
                </button>
              </li>
              <li>
                <button 
                  onClick={onNavigateHome} 
                  className="hover:text-[#10b981] transition-colors text-right bg-transparent border-none p-0 cursor-pointer text-slate-400 font-bold"
                >
                  ارتباط با ما
                </button>
              </li>
              <li>
                <button 
                  onClick={onNavigateHome} 
                  className="hover:text-[#10b981] transition-colors text-right bg-transparent border-none p-0 cursor-pointer text-slate-400 font-bold"
                >
                  بلاگ و مقالات
                </button>
              </li>
            </ul>
          </div>

          {/* Links Col 3: Resources */}
          <div>
            <h4 className="text-xs font-black text-white mb-5">منابع</h4>
            <ul className="space-y-3 text-xs font-bold list-none p-0 m-0">
              <li>
                <button 
                  onClick={onNavigateHome} 
                  className="hover:text-[#10b981] transition-colors text-right bg-transparent border-none p-0 cursor-pointer text-slate-400 font-bold"
                >
                  مرکز راهنمایی
                </button>
              </li>
              <li>
                <button 
                  onClick={onNavigateHome} 
                  className="hover:text-[#10b981] transition-colors text-right bg-transparent border-none p-0 cursor-pointer text-slate-400 font-bold"
                >
                  پشتیبانی فنی
                </button>
              </li>
              <li>
                <button 
                  onClick={onNavigateHome} 
                  className="hover:text-[#10b981] transition-colors text-right bg-transparent border-none p-0 cursor-pointer text-slate-400 font-bold"
                >
                  امنیت داده‌ها
                </button>
              </li>
            </ul>
          </div>

        </div>

        <div className="h-px bg-white/[0.04] mb-8" />

        {/* Socials & Copyright Row */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6 text-xs text-slate-600 font-bold">
          
          {/* Social Icons (Left in RTL flex order) */}
          <div className="flex gap-4">
            <a href="#" className="hover:text-[#10b981] text-slate-600 transition-colors" aria-label="WhatsApp">
              <WhatsappLogo className="w-5 h-5" />
            </a>
            <a href="#" className="hover:text-[#10b981] text-slate-600 transition-colors" aria-label="Instagram">
              <InstagramLogo className="w-5 h-5" />
            </a>
            <a href="#" className="hover:text-[#10b981] text-slate-600 transition-colors" aria-label="Twitter">
              <TwitterLogo className="w-5 h-5" />
            </a>
          </div>
          
          {/* Copyright text (Right in RTL flex order) */}
          <div>
            <p className="m-0 text-slate-500 font-bold">© 1405 ویترین. تمامی حقوق این پلتفرم محفوظ و تحت مالکیت معنوی می‌باشد.</p>
          </div>
        </div>
      </div>
    </footer>
  );
};
