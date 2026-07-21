import React from 'react';
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
  onProfileClick: () => void;
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

  return (
    <motion.aside 
      initial={false}
      animate={{ width: isCollapsed ? 80 : 260 }}
      transition={shouldReduceMotion ? { duration: 0.1 } : {
        type: 'spring',
        stiffness: 320,
        damping: 32,
        mass: 0.8
      }}
      className={`bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 flex flex-col z-50 shadow-sm font-['Vazirmatn'] shrink-0 overflow-visible
        fixed md:relative right-0 top-0 h-screen md:h-auto transition-transform duration-300 ease-out
        ${isOpenOnMobile ? 'translate-x-0' : 'translate-x-full md:translate-x-0'}
      `}
      style={{ direction: 'rtl' }}
    >
      {/* Brand Header: Fixed height, with square, always centered logo button */}
      <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'justify-between'} h-20 px-4 shrink-0 overflow-hidden select-none`}>
        <div className="flex items-center gap-3 min-w-0">
          <div className={`w-11 h-11 bg-${brandColor}-600 rounded-xl flex items-center justify-center text-white shadow-md shrink-0`}>
            <ConciergeBell className="w-6 h-6" />
          </div>
          <AnimatePresence initial={false}>
            {!isCollapsed && (
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

        {!isCollapsed && onCloseMobile && (
          <button onClick={onCloseMobile} className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-slate-400 md:hidden block shrink-0">
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
              title={isCollapsed ? link.label : undefined}
              className={`flex items-center rounded-xl transition-all duration-200 group relative overflow-hidden shrink-0
                ${isCollapsed 
                  ? 'w-11 h-11 justify-center mx-auto' 
                  : 'w-full px-4 py-3 gap-4'
                }
                ${isActive 
                  ? `bg-${brandColor}-50 dark:bg-${brandColor}-950/30 text-${brandColor}-700 dark:text-${brandColor}-400 font-bold` 
                  : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50 hover:text-slate-700 dark:hover:text-slate-200'
                }
              `}
            >
              {/* Perfectly centered icon button inside 44x44 container */}
              <div className={`relative z-10 shrink-0 ${isCollapsed ? 'flex items-center justify-center w-full h-full' : ''} ${isActive ? `text-${brandColor}-600 dark:text-${brandColor}-400` : 'text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-300'}`}>
                {link.icon}
              </div>
              
              <AnimatePresence initial={false}>
                {!isCollapsed && (
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
              
              {isActive && !isCollapsed && (
                <div className={`absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-${brandColor}-500 rounded-r-full`} />
              )}
            </button>
          );
        })}
      </nav>
      
      {/* Fixed Footer */}
      <div className="p-4 border-t border-slate-50 dark:border-slate-800/50 flex flex-col gap-3 shrink-0">
        <SidebarAccountArea 
          isCollapsed={isCollapsed}
          brandColor={brandColor}
          onProfileClick={onProfileClick}
          onLogout={onLogout}
          restaurantName={restaurantName}
          restaurantLogo={restaurantLogo}
          isRestaurantOpen={isRestaurantOpen}
        />
        <button 
          onClick={toggleCollapse} 
          className={`flex items-center justify-center rounded-lg bg-slate-50 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors shrink-0 mx-auto
            ${isCollapsed ? 'w-11 h-11' : 'w-full h-10'}
          `}
        >
          {isCollapsed ? <ChevronLeft className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
        </button>
      </div>
    </motion.aside>
  );
};

export default Sidebar;
