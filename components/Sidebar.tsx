
import React from 'react';
import { motion } from 'framer-motion';
import { ConciergeBell, ChevronLeft, ChevronRight, X } from 'lucide-react';
import { SIDEBAR_LINKS } from '../constants';
import { ViewState } from '../types';

interface SidebarProps {
  isCollapsed: boolean;
  toggleCollapse: () => void;
  activeView: ViewState;
  onViewChange: (view: ViewState) => void;
  brandColor: string;
  isOpenOnMobile?: boolean;
  onCloseMobile?: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ 
  isCollapsed, 
  toggleCollapse, 
  activeView, 
  onViewChange,
  brandColor,
  isOpenOnMobile = false,
  onCloseMobile
}) => {
  return (
    <motion.aside 
      initial={false}
      animate={{ width: isCollapsed ? 80 : 260 }}
      className={`bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 flex flex-col z-50 shadow-sm font-['Vazirmatn'] shrink-0
        fixed md:relative right-0 top-0 h-screen md:h-auto transition-all duration-300
        ${isOpenOnMobile ? 'translate-x-0' : 'translate-x-full md:translate-x-0'}
      `}
    >
      <div className="p-6 flex items-center justify-between overflow-hidden whitespace-nowrap h-20">
        {!isCollapsed ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center justify-between w-full">
            <div className="flex items-center gap-2">
              <div className={`w-10 h-10 bg-${brandColor}-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-${brandColor}-200 dark:shadow-none`}>
                <ConciergeBell className="w-6 h-6" />
              </div>
              <span className={`text-xl font-black text-${brandColor}-900 dark:text-${brandColor}-400 tracking-tight`}>ویترین</span>
            </div>
            {onCloseMobile && (
              <button onClick={onCloseMobile} className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-slate-400 md:hidden block">
                <X className="w-5 h-5" />
              </button>
            )}
          </motion.div>
        ) : (
          <div className={`w-10 h-10 bg-${brandColor}-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-${brandColor}-200 mx-auto dark:shadow-none`}>
            <ConciergeBell className="w-6 h-6" />
          </div>
        )}
      </div>
      
      <nav className="flex-1 px-4 space-y-2 mt-4 overflow-y-auto scrollbar-hide">
        {SIDEBAR_LINKS.map((link) => (
          <button
            key={link.id}
            onClick={() => {
              onViewChange(link.id as ViewState);
              if (onCloseMobile) onCloseMobile();
            }}
            className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-200 group relative overflow-hidden ${
              activeView === link.id 
                ? `bg-${brandColor}-50 dark:bg-${brandColor}-950/30 text-${brandColor}-700 dark:text-${brandColor}-400 font-bold` 
                : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50 hover:text-slate-700 dark:hover:text-slate-200'
            }`}
          >
            <div className={`relative z-10 ${activeView === link.id ? `text-${brandColor}-600 dark:text-${brandColor}-400` : 'text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-300'}`}>
              {link.icon}
            </div>
            {!isCollapsed && (
              <motion.span 
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }} 
                className="relative z-10"
              >
                {link.label}
              </motion.span>
            )}
            {activeView === link.id && !isCollapsed && (
              <div className={`absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-${brandColor}-500 rounded-r-full`} />
            )}
          </button>
        ))}
      </nav>
      
      <div className="p-4 border-t border-slate-50 dark:border-slate-800/50">
         <button onClick={toggleCollapse} className="w-full flex items-center justify-center p-2 rounded-lg bg-slate-50 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
          {isCollapsed ? <ChevronLeft className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
        </button>
      </div>
    </motion.aside>
  );
};

export default Sidebar;
