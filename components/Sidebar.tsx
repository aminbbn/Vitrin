import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { ConciergeBell, ChevronLeft, ChevronRight, X } from 'lucide-react';
import { SIDEBAR_LINKS } from '../constants';
import { ViewState } from '../types';
import { SidebarAccountArea } from './sidebar/SidebarAccountArea';

interface SidebarProps {
  isCollapsed: boolean;
  toggleCollapse: () => void;
  activeView: ViewState;
  onViewChange: (view: ViewState) => void;
  brandColor: string;
  isOpenOnMobile?: boolean;
  onCloseMobile?: () => void;
  onProfileClick: (tab?: 'restaurant' | 'branches' | 'account' | 'appearance') => void;
  onLogout: () => void;
  restaurantName: string;
  restaurantLogo: string;
  isRestaurantOpen: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ 
  isCollapsed, 
  toggleCollapse, 
  activeView, 
  onViewChange,
  brandColor,
  isOpenOnMobile = false,
  onCloseMobile,
  onProfileClick,
  onLogout,
  restaurantName,
  restaurantLogo,
  isRestaurantOpen
}) => {
  const shouldReduceMotion = useReducedMotion();
  const sidebarRef = useRef<HTMLElement>(null);
  
  // Responsive window size detection
  const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1200);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const isMobile = windowWidth < 768;
  const isTablet = windowWidth >= 768 && windowWidth < 1024;
  const isDesktop = windowWidth >= 1024;

  // Determine effective collapse mode based on responsive state
  // On mobile, never collapse (always full width menu items)
  // On tablet, always force compact collapsed mode
  // On desktop, use user choice
  const effectiveCollapsed = isMobile ? false : (isTablet ? true : isCollapsed);

  // Focus management: when mobile drawer opens, focus it
  useEffect(() => {
    if (isOpenOnMobile && isMobile && sidebarRef.current) {
      sidebarRef.current.focus();
    }
  }, [isOpenOnMobile, isMobile]);

  return (
    <motion.aside 
      ref={sidebarRef}
      role="navigation"
      aria-label="منوی اصلی مدیریت"
      tabIndex={isMobile ? -1 : undefined}
      initial={false}
      animate={{ 
        width: isMobile ? 300 : (effectiveCollapsed ? 80 : 260)
      }}
      transition={shouldReduceMotion ? { duration: 0.1 } : {
        type: 'spring',
        stiffness: 320,
        damping: 32,
        mass: 0.8
      }}
      className={`bg-white dark:bg-[var(--app-sidebar)] border-l border-slate-200 dark:border-[var(--app-border)] flex flex-col z-50 shadow-sm font-['Vazirmatn'] shrink-0 overflow-visible
        fixed md:relative right-0 top-0 h-screen h-[100dvh] md:h-auto transition-transform duration-300 ease-out
        max-w-[82vw] md:max-w-none pt-[env(safe-area-inset-top,0px)] pb-[env(safe-area-inset-bottom,0px)]
        ${isOpenOnMobile ? 'translate-x-0' : 'translate-x-full md:translate-x-0'}
      `}
      style={{ direction: 'rtl' }}
    >
      {/* Brand Header: Fixed height, with square, always centered logo button */}
      <div className={`flex items-center ${effectiveCollapsed ? 'justify-center' : 'justify-between'} h-20 px-4 shrink-0 overflow-hidden select-none`}>
        <div className="flex items-center gap-3 min-w-0">
          <div className={`w-11 h-11 bg-${brandColor}-600 rounded-xl flex items-center justify-center text-white shadow-md shrink-0`}>
            <ConciergeBell className="w-6 h-6" />
          </div>
          <AnimatePresence initial={false}>
            {!effectiveCollapsed && (
              <motion.span 
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: 'auto' }}
                exit={{ opacity: 0, width: 0 }}
                transition={{ duration: 0.15 }}
                className={`text-xl font-black text-${brandColor}-900 dark:text-${brandColor}-400 tracking-tight overflow-hidden whitespace-nowrap`}
              >
                ویترین
              </motion.span>
            )}
          </AnimatePresence>
        </div>

        {!effectiveCollapsed && onCloseMobile && (
          <button 
            onClick={onCloseMobile} 
            className="p-1.5 hover:bg-slate-100 dark:hover:bg-[var(--app-surface-elevated)] rounded-lg text-slate-400 md:hidden block shrink-0 transition-colors"
            aria-label="بستن منو"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>
      
      {/* Scrollable Navigation links */}
      <nav className="flex-1 px-4 space-y-2 mt-4 overflow-y-auto scrollbar-hide">
        {SIDEBAR_LINKS.map((link) => {
          const isActive = activeView === link.id;
          return (
            <button
              key={link.id}
              onClick={() => {
                onViewChange(link.id as ViewState);
                if (onCloseMobile) onCloseMobile();
              }}
              title={effectiveCollapsed ? link.label : undefined}
              aria-label={link.label}
              className={`flex items-center rounded-xl transition-all duration-200 group relative overflow-hidden shrink-0 border
                ${effectiveCollapsed 
                  ? 'w-11 h-11 justify-center mx-auto' 
                  : 'w-full px-4 py-3 gap-4'
                }
                ${isActive 
                  ? `bg-${brandColor}-50/60 dark:bg-${brandColor}-950/20 border-${brandColor}-500/20 dark:border-${brandColor}-500/30 text-${brandColor}-700 dark:text-${brandColor}-400 font-bold shadow-sm` 
                  : 'border-transparent text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-[var(--app-hover)] hover:text-slate-700 dark:hover:text-slate-200'
                }
              `}
            >
              {/* Perfectly centered icon button inside 44x44 container */}
              <div className={`relative z-10 shrink-0 ${effectiveCollapsed ? 'flex items-center justify-center w-full h-full' : ''} ${isActive ? `text-${brandColor}-600 dark:text-${brandColor}-400` : 'text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-300'}`}>
                {link.icon}
              </div>
              
              <AnimatePresence initial={false}>
                {!effectiveCollapsed && (
                  <motion.span 
                    initial={{ opacity: 0, width: 0 }}
                    animate={{ opacity: 1, width: 'auto' }}
                    exit={{ opacity: 0, width: 0 }}
                    transition={{ duration: 0.15 }}
                    className="relative z-10 overflow-hidden whitespace-nowrap text-right text-xs"
                  >
                    {link.label}
                  </motion.span>
                )}
              </AnimatePresence>
              
              {isActive && !effectiveCollapsed && (
                <div className={`absolute right-0 top-1/2 -translate-y-1/2 w-[3px] h-6 bg-${brandColor}-500 rounded-l-md`} />
              )}
            </button>
          );
        })}
      </nav>
      
      {/* Fixed Footer */}
      <div className="p-4 border-t border-slate-50 dark:border-[var(--app-border)] flex flex-col gap-3 shrink-0">
        <SidebarAccountArea 
          isCollapsed={effectiveCollapsed}
          brandColor={brandColor}
          onProfileClick={onProfileClick}
          onLogout={onLogout}
          restaurantName={restaurantName}
          restaurantLogo={restaurantLogo}
          isRestaurantOpen={isRestaurantOpen}
        />
        {isDesktop && (
          <button 
            onClick={toggleCollapse} 
            className={`flex items-center justify-center rounded-lg bg-slate-50 dark:bg-[var(--app-surface-elevated)] text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-[var(--app-hover)] transition-colors shrink-0 mx-auto
              ${effectiveCollapsed ? 'w-11 h-11' : 'w-full h-10'}
            `}
            aria-label={effectiveCollapsed ? "بزرگ کردن منو" : "کوچک کردن منو"}
          >
            {effectiveCollapsed ? <ChevronLeft className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
          </button>
        )}
      </div>
    </motion.aside>
  );
};

export default Sidebar;
