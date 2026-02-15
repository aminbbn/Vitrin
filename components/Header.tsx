
import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, Power, Eye, Sparkles, CheckCircle2, Bell, User,
  LogOut, Store, Settings
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
}

const Header: React.FC<HeaderProps> = ({
  searchQuery,
  setSearchQuery,
  isRestaurantOpen,
  setIsRestaurantOpen,
  isPublishing,
  onPublish,
  showPublishSuccess,
  notifications,
  onPreviewShop
}) => {
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const searchRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) setIsSearchFocused(false);
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) setIsNotificationsOpen(false);
      // Removed profileRef check here because we use onMouseLeave for profile
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="h-20 bg-white border-b border-slate-200 flex items-center justify-between px-8 z-40 relative font-['Vazirmatn'] shrink-0">
      <div className="flex items-center gap-6 flex-1 max-w-xl">
        <div className="relative w-full max-w-sm" ref={searchRef}>
          <Search className="w-5 h-5 absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input 
            type="text" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => setIsSearchFocused(true)}
            placeholder="جستجو..." 
            className={`bg-slate-100 border-none rounded-full pr-10 pl-10 py-2.5 w-full text-sm outline-none transition-all placeholder:text-slate-400 ${isSearchFocused ? 'bg-white ring-2 ring-emerald-500/20 shadow-sm' : ''}`}
          />
        </div>
      </div>
      
      <div className="flex items-center gap-4">
        {/* Restaurant Status */}
        <div className="flex items-center gap-3 bg-slate-50 px-3 py-1.5 rounded-full border border-slate-100">
          <div className={`w-2 h-2 rounded-full ${isRestaurantOpen ? 'bg-emerald-500' : 'bg-red-500'} animate-pulse`} />
          <span className="text-xs font-bold text-slate-600">رستوران {isRestaurantOpen ? 'باز است' : 'بسته است'}</span>
          <button onClick={() => setIsRestaurantOpen(!isRestaurantOpen)} className="p-1 hover:bg-slate-200 rounded-full transition-colors">
            <Power className="w-3.5 h-3.5 text-slate-400" />
          </button>
        </div>

        <div className="h-6 w-[1px] bg-slate-200 mx-1" />

        {/* Action Buttons */}
        <button onClick={onPreviewShop} className="p-2.5 rounded-full text-slate-500 hover:text-emerald-600 hover:bg-emerald-50 transition-all relative group" title="مشاهده فروشگاه">
          <Eye className="w-5 h-5" />
        </button>
        
        <button onClick={onPublish} disabled={isPublishing} className={`relative px-5 py-2.5 rounded-full text-xs font-bold flex items-center gap-2 transition-all ${isPublishing ? 'bg-emerald-100 text-emerald-800 cursor-not-allowed' : 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-md shadow-emerald-100 hover:scale-105 active:scale-95'}`}>
          {isPublishing ? 'در حال انتشار...' : <><Sparkles className="w-3.5 h-3.5" /><span>انتشار تغییرات</span></>}
          <AnimatePresence>
            {showPublishSuccess && (
              <motion.div initial={{ opacity: 0, scale: 0.5, y: 10 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.5 }} className="absolute top-full mt-2 right-0 bg-slate-900 text-white px-3 py-2 rounded-lg flex items-center gap-2 whitespace-nowrap shadow-xl z-50">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                تغییرات منتشر شد
              </motion.div>
            )}
          </AnimatePresence>
        </button>

        {/* Notification Dropdown */}
        <div className="relative" ref={notifRef}>
          <button 
             onClick={() => setIsNotificationsOpen(!isNotificationsOpen)} 
             className={`p-2 rounded-full relative transition-colors ${isNotificationsOpen ? 'bg-emerald-50 text-emerald-600' : 'text-slate-500 hover:bg-slate-100'}`}
          >
            <Bell className="w-5 h-5" />
            {notifications.filter(n => !n.read).length > 0 && (
              <span className="absolute top-1.5 right-1.5 w-3.5 h-3.5 bg-red-500 rounded-full border-2 border-white flex items-center justify-center text-[8px] font-bold text-white">
                {notifications.filter(n => !n.read).length}
              </span>
            )}
          </button>

          <AnimatePresence>
            {isNotificationsOpen && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                className="absolute top-full left-0 mt-4 w-80 bg-white/90 backdrop-blur-xl border border-slate-200 rounded-2xl shadow-2xl z-50 overflow-hidden origin-top-left"
              >
                 <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-white/50">
                    <h3 className="font-bold text-slate-800 text-sm">اعلان‌ها</h3>
                    <span className="text-[10px] bg-emerald-100 text-emerald-600 px-2 py-0.5 rounded-full font-bold border border-emerald-200">
                      {notifications.filter(n => !n.read).length} جدید
                    </span>
                 </div>
                 <div className="max-h-[300px] overflow-y-auto">
                    {notifications.length === 0 ? (
                      <div className="p-8 text-center text-slate-400 text-xs">هیچ اعلانی وجود ندارد</div>
                    ) : (
                      notifications.slice(0, 3).map(n => (
                        <div key={n.id} className={`p-4 border-b border-slate-50 last:border-0 hover:bg-slate-50 transition-colors cursor-pointer ${!n.read ? 'bg-emerald-50/30' : ''}`}>
                           <div className="flex justify-between mb-1">
                              <span className="font-bold text-xs text-slate-800">{n.title}</span>
                              <span className="text-[10px] text-slate-400 font-medium">{n.time}</span>
                           </div>
                           <p className="text-xs text-slate-500 leading-relaxed line-clamp-2">{n.message}</p>
                        </div>
                      ))
                    )}
                 </div>
                 <div className="p-3 bg-slate-50 border-t border-slate-100 text-center cursor-pointer hover:bg-slate-100 transition-colors">
                    <button className="text-xs font-bold text-emerald-600 hover:text-emerald-700">مشاهده همه اعلان‌ها</button>
                 </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Profile Dropdown */}
        <div 
          className="relative" 
          ref={profileRef} 
          onMouseEnter={() => setIsProfileOpen(true)} 
          onMouseLeave={() => setIsProfileOpen(false)}
        >
          <div className="flex items-center gap-3 pr-2 border-r border-slate-200 mr-2 cursor-pointer group pb-2 pt-2">
            <div className="text-left hidden md:block">
              <h4 className="text-sm font-bold text-slate-800 group-hover:text-emerald-700 transition-colors">مدیر رستوران</h4>
              <span className="text-[10px] text-slate-400 block group-hover:text-emerald-500/70 transition-colors">شعبه مرکزی</span>
            </div>
            <div className={`w-10 h-10 rounded-full border-2 shadow-sm flex items-center justify-center overflow-hidden transition-all ${isProfileOpen ? 'border-emerald-500 ring-2 ring-emerald-500/20 bg-emerald-50' : 'bg-slate-200 border-white'}`}>
              <User className={`w-5 h-5 ${isProfileOpen ? 'text-emerald-600' : 'text-slate-400'}`} />
            </div>
          </div>

          <AnimatePresence>
            {isProfileOpen && (
               <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  className="absolute top-full right-0 w-60 bg-white/90 backdrop-blur-xl border border-slate-200 rounded-2xl shadow-2xl z-50 p-2 origin-top-right"
               >
                  <div className="px-3 py-3 border-b border-slate-100 mb-2">
                     <p className="font-bold text-sm text-slate-800">مدیر رستوران</p>
                     <p className="text-xs text-slate-400 mt-0.5">admin@vitrin.com</p>
                  </div>
                  <div className="space-y-1">
                     <button className="w-full text-right px-3 py-2.5 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 hover:text-emerald-600 transition-colors flex items-center gap-3">
                        <Settings className="w-4 h-4" /> تنظیمات پروفایل
                     </button>
                     <button className="w-full text-right px-3 py-2.5 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 hover:text-emerald-600 transition-colors flex items-center gap-3">
                        <Store className="w-4 h-4" /> اطلاعات رستوران
                     </button>
                  </div>
                  <div className="h-px bg-slate-100 my-2" />
                  <button className="w-full text-right px-3 py-2.5 rounded-xl text-xs font-bold text-red-500 hover:bg-red-50 transition-colors flex items-center gap-3">
                     <LogOut className="w-4 h-4" /> خروج از حساب
                  </button>
               </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
};

export default Header;
