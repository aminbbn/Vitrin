import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface TabItem {
  id: string;
  label: string;
}

const TABS: TabItem[] = [
  { id: 'studio', label: 'استودیو طراحی' },
  { id: 'products', label: 'مدیریت محصولات' },
  { id: 'experience', label: 'تجربه مشتری' },
  { id: 'orders', label: 'مدیریت سفارش‌ها' }
];

export const ModuleNavigator: React.FC = () => {
  const [activeSection, setActiveSection] = useState<string>('studio');

  useEffect(() => {
    const sectionIds = ['studio', 'products', 'experience', 'orders'];
    const observers = sectionIds.map(id => {
      const el = document.getElementById(id);
      if (!el) return null;

      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setActiveSection(id);
          }
        },
        {
          rootMargin: '-30% 0px -60% 0px',
          threshold: 0
        }
      );

      observer.observe(el);
      return { observer, el };
    });

    return () => {
      observers.forEach(obs => {
        if (obs) {
          obs.observer.unobserve(obs.el);
          obs.observer.disconnect();
        }
      });
    };
  }, []);

  const handleTabClick = (id: string) => {
    setActiveSection(id);
    const el = document.getElementById(id);
    if (el) {
      const yOffset = -72; // height of floating header
      const y = el.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  return (
    <div className="sticky top-14 md:top-14 z-40 w-full bg-[#F5F7F6]/80 dark:bg-[#080A09]/80 backdrop-blur-xl border-b border-slate-200/50 dark:border-white/[0.04] py-2 md:py-3 transition-colors duration-300">
      <div className="max-w-[1200px] mx-auto px-4 md:px-6">
        
        {/* Scrollable Container on Mobile */}
        <div className="overflow-x-auto scrollbar-none flex justify-start md:justify-center">
          <nav className="flex items-center gap-1.5 md:gap-2.5 bg-slate-200/40 dark:bg-white/[0.02] border border-slate-200/30 dark:border-white/[0.04] p-1 rounded-full whitespace-nowrap min-w-max mx-auto">
            {TABS.map((tab) => {
              const isActive = activeSection === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => handleTabClick(tab.id)}
                  className={`relative px-4 py-1.5 text-xs font-black rounded-full border-0 bg-transparent cursor-pointer select-none transition-colors duration-200 focus:outline-none focus-visible:ring-1 focus-visible:ring-[#10b981]/50 ${
                    isActive 
                      ? 'text-slate-900 dark:text-white' 
                      : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <span className="relative z-10">{tab.label}</span>
                  
                  {isActive && (
                    <motion.div
                      layoutId="moduleNavActiveIndicator"
                      className="absolute inset-0 bg-white dark:bg-[#141917] border border-slate-200/50 dark:border-[#10b981]/15 rounded-full shadow-sm z-0"
                      transition={{ type: 'spring', stiffness: 350, damping: 28 }}
                    />
                  )}
                </button>
              );
            })}
          </nav>
        </div>

      </div>
    </div>
  );
};
