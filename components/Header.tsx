import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, Power, Eye, Sparkles, CheckCircle2, Bell,
  Trash2, Sun, Moon, Menu, Check, X
} from 'lucide-react';
import { Notification } from '../types';

interface HeaderProps {
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  isRestaurantOpen: boolean;
  setIsRestaurantOpen: (open: boolean) => void;
  isPublishing: boolean;
  onPublish: () => void;
  showPublishSuccess: boolean;
  notifications: Notification[];
  onPreviewShop: () => void;
  onViewAllNotifications: () => void;
  brandColor: string;
  onNotificationClick: (n: Notification) => void;
  onMarkRead?: (id: string) => void;
  onDelete?: (id: string) => void;
  theme?: 'light' | 'dark';
  toggleTheme?: () => void;
  onMenuToggle?: () => void;
  activeView?: string;
}

const getViewLabel = (view?: string) => {
  switch (view) {
    case 'dashboard': return 'داشبورد';
    case 'designer': return 'طراحی منو';
    case 'products': return 'محصولات';
    case 'categories': return 'دسته‌بندی‌ها';
    case 'settings': return 'تنظیمات';
    case 'notifications': return 'اعلان‌ها';
    case 'notification-archive': return 'آرشیو اعلان‌ها';
    case 'search-results': return 'نتایج جستجو';
    case 'customer-menu': return 'پیش‌نمایش';
    default: return 'مدیریت';
  }
};

const Header: React.FC<HeaderProps> = ({
  searchQuery,
  setSearchQuery,
  isRestaurantOpen,
  setIsRestaurantOpen,
  isPublishing,
  onPublish,
  showPublishSuccess,
  notifications,
  onPreviewShop,
  onViewAllNotifications,
  brandColor,
  onNotificationClick,
  onMarkRead,
  onDelete,
  theme = 'light',
  toggleTheme,
  onMenuToggle,
  activeView
}) => {
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [isMobileSearchExpanded, setIsMobileSearchExpanded] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

  const searchRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);
  const notifMobileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) setIsSearchFocused(false);
      
      const inDesktopNotif = notifRef.current && notifRef.current.contains(event.target as Node);
      const inMobileNotif = notifMobileRef.current && notifMobileRef.current.contains(event.target as Node);
      if (!inDesktopNotif && !inMobileNotif) {
        setIsNotificationsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsNotificationsOpen(false);
        setIsMobileSearchExpanded(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const unreadCount = notifications.filter(n => !n.read).length;

  const renderDropdownContent = () => (
    <motion.div
      initial={{ opacity: 0, y: 10, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 10, scale: 0.95 }}
      className="fixed sm:absolute inset-x-4 sm:inset-x-auto top-20 sm:top-full left-4 sm:left-0 mt-2 sm:mt-4 w-auto sm:w-80 bg-white dark:bg-[var(--app-surface)] rounded-[1.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.15)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.3)] border border-slate-200 dark:border-[var(--app-border)] z-[60] overflow-hidden origin-top-left max-h-[calc(100dvh-100px)] sm:max-h-none flex flex-col"
    >
       <div className="p-4 border-b border-slate-100 dark:border-[var(--app-border)] flex justify-between items-center shrink-0">
          <h3 className="font-black text-slate-800 dark:text-slate-100 text-sm">اعلان‌های سیستم</h3>
          <span className={`text-[10px] bg-${brandColor}-100 dark:bg-${brandColor}-950/50 text-${brandColor}-700 dark:text-${brandColor}-400 px-2.5 py-1 rounded-lg font-bold`}>
            {unreadCount} مورد جدید
          </span>
       </div>
       <div className="flex-1 overflow-y-auto max-h-[320px] sm:max-h-[400px]">
          {notifications.length === 0 ? (
            <div className="p-10 text-center text-slate-400 dark:text-slate-500 text-xs">پیامی برای نمایش وجود ندارد</div>
          ) : (
            notifications.map(n => (
              <div 
                key={n.id} 
                onClick={() => {
                  onNotificationClick(n);
                  setIsNotificationsOpen(false);
                }}
                className={`p-4 border-b border-slate-50 dark:border-[var(--app-border)]/40 last:border-0 hover:bg-slate-50 dark:hover:bg-[var(--app-hover)] transition-colors cursor-pointer text-right flex items-start gap-3 relative group ${!n.read ? `bg-${brandColor}-50/10 dark:bg-${brandColor}-950/10` : ''}`}
              >
                 <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-center mb-1">
                       <span className="font-bold text-xs text-slate-800 dark:text-slate-200 truncate">{n.title}</span>
                       <span className="text-[9px] text-slate-400 dark:text-slate-500 font-medium shrink-0 mr-1">{n.time}</span>
                    </div>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed line-clamp-2">{n.message}</p>
                 </div>
                 
                 <div className="flex items-center gap-1 opacity-60 md:opacity-0 group-hover:opacity-100 transition-opacity shrink-0 self-center">
                    {!n.read && onMarkRead && (
                       <button
                          onClick={(e) => {
                             e.stopPropagation();
                             onMarkRead(n.id);
                          }}
                          className="p-1.5 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950 rounded-lg transition-colors"
                          title="علامت‌گذاری به عنوان خوانده شده"
                          aria-label="علامت خوانده شده"
                       >
                          <Check className="w-3.5 h-3.5" />
                       </button>
                    )}
                    {onDelete && (
                       <button
                          onClick={(e) => {
                             e.stopPropagation();
                             onDelete(n.id);
                          }}
                          className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950 rounded-lg transition-colors"
                          title="حذف"
                          aria-label="حذف اعلان"
                       >
                          <Trash2 className="w-3.5 h-3.5" />
                       </button>
                    )}
                 </div>
              </div>
            ))
          )}
       </div>
       <button 
        onClick={() => { onViewAllNotifications(); setIsNotificationsOpen(false); }}
        className={`w-full p-4 bg-slate-50 dark:bg-[var(--app-surface-elevated)] text-[11px] font-black text-${brandColor}-600 dark:text-${brandColor}-400 hover:text-${brandColor}-700 dark:hover:text-${brandColor}-300 hover:bg-slate-100 dark:hover:bg-[var(--app-hover)] transition-colors border-t border-slate-100 dark:border-[var(--app-border)] shrink-0`}
       >
          مشاهده تمام اعلان‌ها
       </button>
    </motion.div>
  );

  return (
    <>
      {/* 1. Desktop & Tablet Header (Visible on screens >= 768px) */}
      <header className="hidden md:flex h-20 bg-[var(--app-header)] backdrop-blur-md border-b border-[var(--app-header-border)] items-center justify-between px-8 z-40 relative font-['Vazirmatn'] shrink-0 transition-colors duration-300">
        
        {/* Rightmost in RTL: Hamburger & Search Section */}
        <div className="flex items-center gap-3 flex-grow max-w-md">
          {onMenuToggle && (
            <button 
              onClick={onMenuToggle}
              className="p-2 -mr-1 text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-100 md:hidden block shrink-0 hover:bg-[var(--app-header-control-hover)] rounded-xl transition-all"
              title="منوی اصلی"
              aria-label="باز کردن منو"
            >
              <Menu className="w-5.5 h-5.5" />
            </button>
          )}

          {/* Search Section */}
          <div className="flex items-center flex-grow" ref={searchRef}>
            <div className="relative w-full group">
              <Search className={`w-4 h-4 absolute right-4 top-1/2 -translate-y-1/2 transition-colors ${isSearchFocused ? `text-${brandColor}-500` : 'text-slate-400'}`} />
              <input 
                type="text" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setIsSearchFocused(true)}
                placeholder="جستجو در پنل مدیریت..." 
                className={`bg-[var(--app-header-input)] text-[var(--app-header-text)] border border-transparent rounded-2xl pr-11 pl-4 py-2.5 w-full text-sm outline-none transition-all ${isSearchFocused ? `bg-[var(--app-header-elevated)] border-${brandColor}-500/30 ring-4 ring-${brandColor}-500/5 shadow-sm` : 'hover:bg-[var(--app-header-control-hover)]'}`}
              />
            </div>
          </div>
        </div>

        {/* Left: Actions & Profile */}
        <div className="flex items-center gap-2">
          
          {/* Action Group 1: Status & Preview */}
          <div className="flex items-center gap-1 bg-[var(--app-header-control)] p-1 rounded-2xl border border-[var(--app-header-border)] mr-2 shrink-0">
            <div className="flex items-center gap-2 px-3 py-1.5">
               <div className={`w-2 h-2 rounded-full ${isRestaurantOpen ? 'bg-emerald-500' : 'bg-rose-500'} animate-pulse`} />
               <span className="text-[11px] font-bold text-[var(--app-header-text)]">رستوران {isRestaurantOpen ? 'باز' : 'بسته'}</span>
               <button 
                 onClick={() => setIsRestaurantOpen(!isRestaurantOpen)}
                 className={`p-1 hover:bg-[var(--app-header-control-hover)] hover:shadow-xs rounded-lg transition-all text-[var(--app-header-muted)] hover:text-[var(--app-header-text)]`}
                 title={isRestaurantOpen ? "بستن رستوران" : "باز کردن رستوران"}
                 aria-label="تغییر وضعیت رستوران"
               >
                 <Power className="w-3.5 h-3.5" />
               </button>
            </div>
            <div className="w-px h-4 bg-[var(--app-header-border)] mx-1" />
            <button 
              onClick={onPreviewShop}
              className={`p-2 rounded-xl text-[var(--app-header-muted)] hover:text-[var(--app-header-text)] hover:bg-[var(--app-header-control-hover)] transition-all group`}
              title="مشاهده سایت"
              aria-label="پیش‌نمایش فروشگاه"
            >
              <Eye className="w-4 h-4 group-hover:scale-110" />
            </button>
          </div>

          {/* Publish Button */}
          <div className="relative shrink-0">
            <button 
              onClick={onPublish} 
              disabled={isPublishing} 
              className={`px-5 py-2.5 rounded-2xl text-xs font-black flex items-center gap-2 transition-all ${isPublishing ? 'bg-[var(--app-header-control)] text-[var(--app-header-muted)] cursor-not-allowed' : `bg-${brandColor}-600 text-white hover:bg-${brandColor}-700 shadow-lg shadow-${brandColor}-600/20 active:scale-95`}`}
              aria-label="انتشار تغییرات"
            >
              {isPublishing ? (
                <div className="w-3.5 h-3.5 border-2 border-slate-300 border-t-slate-600 rounded-full animate-spin" />
              ) : (
                <Sparkles className="w-3.5 h-3.5" />
              )}
              <span className="hidden md:inline">انتشار تغییرات</span>
            </button>
            
            <AnimatePresence>
              {showPublishSuccess && (
                <motion.div 
                  initial={{ opacity: 0, y: 15 }} 
                  animate={{ opacity: 1, y: 0 }} 
                  exit={{ opacity: 0, scale: 0.9 }} 
                  className="absolute top-full mt-3 right-0 bg-[var(--app-header-elevated)] border border-[var(--app-header-border)] text-[var(--app-header-text)] px-4 py-2 rounded-xl flex items-center gap-2 shadow-2xl z-50 whitespace-nowrap"
                >
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  <span className="text-[11px] font-bold">تغییرات با موفقیت اعمال شد</span>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="w-[1px] h-8 bg-[var(--app-header-border)] mx-2 shrink-0" />

          {/* Dark Mode Toggle */}
          {toggleTheme && (
            <button 
               onClick={toggleTheme} 
               className="p-2 rounded-xl text-[var(--app-header-muted)] hover:text-[var(--app-header-text)] hover:bg-[var(--app-header-control-hover)] transition-all shrink-0"
               title={theme === 'dark' ? "پوسته روشن" : "پوسته تاریک"}
               aria-label={theme === 'dark' ? "پوسته روشن" : "پوسته تاریک"}
            >
              {theme === 'dark' ? (
                <Sun className="w-5 h-5 text-amber-500 hover:scale-110 transition-transform" />
              ) : (
                <Moon className="w-5 h-5 text-slate-600 hover:scale-110 transition-transform" />
              )}
            </button>
          )}

          {/* Notification Bell */}
          <div className="relative shrink-0" ref={notifRef}>
            <button 
               onClick={() => setIsNotificationsOpen(!isNotificationsOpen)} 
               className={`p-2 rounded-xl relative transition-all ${isNotificationsOpen ? 'bg-[var(--app-header-control-hover)] text-[var(--app-header-text)] shadow-inner' : 'text-[var(--app-header-muted)] hover:text-[var(--app-header-text)] hover:bg-[var(--app-header-control-hover)]'}`}
               aria-label="اعلان‌ها"
            >
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className="absolute top-2 right-2 w-4 h-4 bg-rose-500 rounded-full border-2 border-white dark:border-[var(--app-surface)] flex items-center justify-center text-[8px] font-black text-white shadow-sm">
                  {unreadCount}
                </span>
              )}
            </button>

            <AnimatePresence>
              {isNotificationsOpen && renderDropdownContent()}
            </AnimatePresence>
          </div>

        </div>
      </header>

      {/* 2. Mobile-First Compact Header (Visible on screens < 768px) */}
      <header className="flex md:hidden h-16 bg-[var(--app-header)] backdrop-blur-md border-b border-[var(--app-header-border)] items-center justify-between px-4 z-40 relative font-['Vazirmatn'] shrink-0 transition-colors duration-300">
        
        {/* Right side (RTL): Hamburger Menu & View Title */}
        <div className="flex items-center gap-2">
          {onMenuToggle && (
            <button 
              onClick={onMenuToggle}
              className="w-11 h-11 flex items-center justify-center text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-100 hover:bg-[var(--app-header-control-hover)] rounded-xl transition-all"
              title="منوی اصلی"
              aria-label="باز کردن منو"
            >
              <Menu className="w-6 h-6" />
            </button>
          )}
          <span className="text-base font-black text-[var(--app-header-text)] truncate max-w-[140px]">
            {getViewLabel(activeView)}
          </span>
        </div>

        {/* Left side (RTL): Notification Bell & Publish Button */}
        <div className="flex items-center gap-1">
          {/* Notification Bell */}
          <div className="relative" ref={notifMobileRef}>
            <button 
               onClick={() => setIsNotificationsOpen(!isNotificationsOpen)} 
               className={`w-11 h-11 flex items-center justify-center rounded-xl relative transition-all ${isNotificationsOpen ? 'bg-[var(--app-header-control-hover)] text-[var(--app-header-text)] shadow-inner' : 'text-[var(--app-header-muted)] hover:text-[var(--app-header-text)] hover:bg-[var(--app-header-control-hover)]'}`}
               aria-label="اعلان‌ها"
            >
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className="absolute top-2.5 right-2.5 w-4 h-4 bg-rose-500 rounded-full border-2 border-white dark:border-[var(--app-surface)] flex items-center justify-center text-[8px] font-black text-white shadow-sm">
                  {unreadCount}
                </span>
              )}
            </button>

            <AnimatePresence>
              {isNotificationsOpen && renderDropdownContent()}
            </AnimatePresence>
          </div>

          {/* Publish Changes button (Primary Accent with Sparkles, visually outstanding but compact) */}
          <button 
            onClick={onPublish} 
            disabled={isPublishing} 
            className={`w-11 h-11 flex items-center justify-center rounded-xl transition-all ${isPublishing ? 'bg-[var(--app-header-control)] text-[var(--app-header-muted)] cursor-not-allowed' : `bg-${brandColor}-600 text-white hover:bg-${brandColor}-700 shadow-lg shadow-${brandColor}-600/20 active:scale-95`}`}
            aria-label="انتشار تغییرات"
            title="انتشار تغییرات"
          >
            {isPublishing ? (
              <div className="w-4 h-4 border-2 border-slate-300 border-t-slate-600 rounded-full animate-spin" />
            ) : (
              <Sparkles className="w-5 h-5" />
            )}
          </button>
        </div>
      </header>
    </>
  );
};

export default Header;
