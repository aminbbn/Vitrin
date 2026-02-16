
import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, Power, Eye, Sparkles, CheckCircle2, Bell, User,
  LogOut, Store, MapPin, Phone, Clock, X, ChevronDown 
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
  onProfileClick: () => void;
  onLogout: () => void;
  restaurantName: string;
  restaurantLogo: string;
  onViewAllNotifications: () => void;
  brandColor: string;
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
  onPreviewShop,
  onProfileClick,
  onLogout,
  restaurantName,
  restaurantLogo,
  onViewAllNotifications,
  brandColor
}) => {
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isRestaurantInfoOpen, setIsRestaurantInfoOpen] = useState(false);

  const searchRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) setIsSearchFocused(false);
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) setIsNotificationsOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <>
      <header className="h-20 bg-white/80 backdrop-blur-md border-b border-slate-200 flex items-center justify-between px-8 z-40 relative font-['Vazirmatn'] shrink-0">
        
        {/* Left: Search Section */}
        <div className="flex items-center flex-1 max-w-md" ref={searchRef}>
          <div className="relative w-full group">
            <Search className={`w-4 h-4 absolute right-4 top-1/2 -translate-y-1/2 transition-colors ${isSearchFocused ? `text-${brandColor}-500` : 'text-slate-400'}`} />
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setIsSearchFocused(true)}
              placeholder="جستجو در پنل مدیریت..." 
              className={`bg-slate-100/50 border border-transparent rounded-2xl pr-11 pl-4 py-2.5 w-full text-sm outline-none transition-all ${isSearchFocused ? `bg-white border-${brandColor}-500/30 ring-4 ring-${brandColor}-500/5 shadow-sm` : 'hover:bg-slate-100'}`}
            />
          </div>
        </div>

        {/* Right: Actions & Profile */}
        <div className="flex items-center gap-2">
          
          {/* Action Group 1: Status & Preview */}
          <div className="flex items-center gap-1 bg-slate-100/50 p-1 rounded-2xl border border-slate-200/50 mr-2">
            <div className="flex items-center gap-2 px-3 py-1.5">
               <div className={`w-2 h-2 rounded-full ${isRestaurantOpen ? `bg-${brandColor}-500` : 'bg-rose-500'} animate-pulse`} />
               <span className="text-[11px] font-bold text-slate-600">رستوران {isRestaurantOpen ? 'باز' : 'بسته'}</span>
               <button 
                onClick={() => setIsRestaurantOpen(!isRestaurantOpen)}
                className={`p-1 hover:bg-white hover:shadow-sm rounded-lg transition-all text-slate-400 hover:text-${brandColor}-600`}
               >
                 <Power className="w-3.5 h-3.5" />
               </button>
            </div>
            <div className="w-px h-4 bg-slate-200 mx-1" />
            <button 
              onClick={onPreviewShop}
              className={`p-2 rounded-xl text-slate-500 hover:text-${brandColor}-600 hover:bg-white transition-all group`}
              title="مشاهده سایت"
            >
              <Eye className="w-4 h-4 group-hover:scale-110" />
            </button>
          </div>

          {/* Publish Button */}
          <div className="relative">
            <button 
              onClick={onPublish} 
              disabled={isPublishing} 
              className={`px-5 py-2.5 rounded-2xl text-xs font-black flex items-center gap-2 transition-all ${isPublishing ? 'bg-slate-100 text-slate-400 cursor-not-allowed' : `bg-${brandColor}-600 text-white hover:bg-${brandColor}-700 shadow-lg shadow-${brandColor}-600/20 active:scale-95`}`}
            >
              {isPublishing ? (
                <div className="w-3.5 h-3.5 border-2 border-slate-300 border-t-slate-600 rounded-full animate-spin" />
              ) : (
                <Sparkles className="w-3.5 h-3.5" />
              )}
              <span>انتشار تغییرات</span>
            </button>
            
            <AnimatePresence>
              {showPublishSuccess && (
                <motion.div 
                  initial={{ opacity: 0, y: 15 }} 
                  animate={{ opacity: 1, y: 0 }} 
                  exit={{ opacity: 0, scale: 0.9 }} 
                  className="absolute top-full mt-3 left-0 bg-slate-900 text-white px-4 py-2 rounded-xl flex items-center gap-2 shadow-2xl z-50 whitespace-nowrap"
                >
                  <CheckCircle2 className={`w-4 h-4 text-${brandColor}-400`} />
                  <span className="text-[11px] font-bold">تغییرات با موفقیت اعمال شد</span>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="w-[1px] h-8 bg-slate-200 mx-2" />

          {/* Notification Bell */}
          <div className="relative" ref={notifRef}>
            <button 
               onClick={() => setIsNotificationsOpen(!isNotificationsOpen)} 
               className={`p-2.5 rounded-xl relative transition-all ${isNotificationsOpen ? `bg-${brandColor}-50 text-${brandColor}-600 shadow-inner` : 'text-slate-500 hover:bg-slate-100'}`}
            >
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className="absolute top-2 right-2 w-4 h-4 bg-rose-500 rounded-full border-2 border-white flex items-center justify-center text-[8px] font-black text-white shadow-sm">
                  {unreadCount}
                </span>
              )}
            </button>

            <AnimatePresence>
              {isNotificationsOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  className="absolute top-full left-0 mt-4 w-80 bg-white rounded-[1.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.1)] border border-slate-200 z-[60] overflow-hidden origin-top-left"
                >
                   <div className="p-4 border-b border-slate-100 flex justify-between items-center">
                      <h3 className="font-black text-slate-800 text-sm">اعلان‌های سیستم</h3>
                      <span className={`text-[10px] bg-${brandColor}-100 text-${brandColor}-700 px-2.5 py-1 rounded-lg font-bold`}>
                        {unreadCount} مورد جدید
                      </span>
                   </div>
                   <div className="max-h-[320px] overflow-y-auto">
                      {notifications.length === 0 ? (
                        <div className="p-10 text-center text-slate-400 text-xs">پیامی برای نمایش وجود ندارد</div>
                      ) : (
                        notifications.map(n => (
                          <div key={n.id} className={`p-4 border-b border-slate-50 last:border-0 hover:bg-slate-50 transition-colors cursor-pointer ${!n.read ? `bg-${brandColor}-50/20` : ''}`}>
                             <div className="flex justify-between mb-1">
                                <span className="font-bold text-xs text-slate-800">{n.title}</span>
                                <span className="text-[9px] text-slate-400 font-medium">{n.time}</span>
                             </div>
                             <p className="text-[11px] text-slate-500 leading-relaxed line-clamp-2">{n.message}</p>
                          </div>
                        ))
                      )}
                   </div>
                   <button 
                    onClick={() => { onViewAllNotifications(); setIsNotificationsOpen(false); }}
                    className={`w-full p-4 bg-slate-50 text-[11px] font-black text-${brandColor}-600 hover:text-${brandColor}-700 hover:bg-slate-100 transition-colors border-t border-slate-100`}
                   >
                      مشاهده تمام اعلان‌ها
                   </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Identity & Profile */}
          <div 
            className="relative" 
            ref={profileRef} 
            onMouseEnter={() => setIsProfileOpen(true)} 
            onMouseLeave={() => setIsProfileOpen(false)}
          >
            <div className="flex items-center gap-3 pr-2 border-r border-slate-200 mr-1 cursor-pointer group py-1">
              <div 
                onClick={() => setIsRestaurantInfoOpen(true)}
                className="text-left hidden md:flex flex-col items-end px-2"
              >
                <div className="flex items-center gap-1.5">
                    <span className={`text-sm font-black text-slate-800 group-hover:text-${brandColor}-600 transition-colors`}>{restaurantName}</span>
                    <ChevronDown className="w-3 h-3 text-slate-400" />
                </div>
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">شعبه مرکزی</span>
              </div>
              <div 
                onClick={onProfileClick}
                className={`w-10 h-10 rounded-2xl border-2 shadow-sm flex items-center justify-center transition-all overflow-hidden ${isProfileOpen ? `border-${brandColor}-500 bg-${brandColor}-50` : 'bg-slate-100 border-white'}`}
              >
                {restaurantLogo ? (
                  <img src={restaurantLogo} alt="Logo" className="w-full h-full object-cover" />
                ) : (
                  <User className={`w-5 h-5 ${isProfileOpen ? `text-${brandColor}-600` : 'text-slate-400'}`} />
                )}
              </div>
            </div>

            <AnimatePresence>
              {isProfileOpen && (
                 <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className="absolute top-full left-0 w-56 bg-white rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.15)] border border-slate-200 z-[60] p-2 origin-top-left"
                 >
                    <div className="px-4 py-3 bg-slate-50 rounded-xl mb-2">
                       <p className="font-black text-xs text-slate-800 uppercase tracking-tight">پنل مدیریت</p>
                       <p className="text-[10px] text-slate-400 mt-0.5">admin@vitrin.com</p>
                    </div>
                    <button 
                      onClick={onLogout}
                      className="w-full text-right px-4 py-3 rounded-xl text-xs font-black text-rose-500 hover:bg-rose-50 transition-colors flex items-center justify-between group"
                    >
                       <span>خروج از حساب</span>
                       <LogOut className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                    </button>
                 </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </header>

      {/* Restaurant Info Modal */}
      <AnimatePresence>
        {isRestaurantInfoOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
             <motion.div 
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               exit={{ opacity: 0 }}
               onClick={() => setIsRestaurantInfoOpen(false)}
               className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
             />
             
             <motion.div 
               initial={{ scale: 0.9, opacity: 0, y: 20 }}
               animate={{ scale: 1, opacity: 1, y: 0 }}
               exit={{ scale: 0.9, opacity: 0, y: 20 }}
               className="bg-white w-full max-w-md rounded-[2.5rem] shadow-2xl relative z-10 overflow-hidden border border-slate-100 flex flex-col"
               onClick={(e) => e.stopPropagation()}
             >
               <div className="p-8 relative">
                  <div className="flex items-center justify-between mb-8">
                     <div className="flex items-center gap-4">
                        <div className={`p-4 rounded-[1.25rem] bg-${brandColor}-50 text-${brandColor}-600 shadow-inner`}>
                           <Store className="w-6 h-6" />
                        </div>
                        <h3 className="text-xl font-black text-slate-800">اطلاعات فروشگاه</h3>
                     </div>
                     <button onClick={() => setIsRestaurantInfoOpen(false)} className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-400">
                        <X className="w-5 h-5" />
                     </button>
                  </div>

                  <div className="space-y-5">
                     <div className="flex items-center justify-between p-5 bg-slate-50 rounded-2xl border border-slate-200/50">
                        <div className="flex flex-col">
                           <span className="text-[10px] font-bold text-slate-400 mb-1">نام رسمی</span>
                           <span className="text-lg font-black text-slate-800">{restaurantName}</span>
                        </div>
                        <div className={`px-3 py-1 rounded-full text-[10px] font-black border ${isRestaurantOpen ? `bg-${brandColor}-100 text-${brandColor}-700 border-${brandColor}-200` : 'bg-rose-100 text-rose-700 border-rose-200'}`}>
                           {isRestaurantOpen ? 'فعال' : 'غیرفعال'}
                        </div>
                     </div>

                     <div className="space-y-2">
                        {[
                          { icon: MapPin, label: "آدرس", value: "تهران، سعادت آباد، میدان کاج، خیابان سرو شرقی" },
                          { icon: Phone, label: "تلفن", value: "۰۲۱-۸۸۹۹۰۰۰۰" },
                          { icon: Clock, label: "ساعت کار", value: "همه روزه ۱۱:۰۰ صبح تا ۱۱:۳۰ شب" }
                        ].map((item, idx) => (
                          <div key={idx} className="flex items-start gap-4 p-4 hover:bg-slate-50 rounded-2xl transition-all border border-transparent hover:border-slate-100">
                             <item.icon className="w-5 h-5 text-slate-400 mt-0.5" />
                             <div>
                                <span className="block text-[10px] font-bold text-slate-400 mb-0.5">{item.label}</span>
                                <p className="text-xs font-bold text-slate-700 leading-relaxed">{item.value}</p>
                             </div>
                          </div>
                        ))}
                     </div>

                     <button 
                        onClick={() => { setIsRestaurantInfoOpen(false); onProfileClick(); }} 
                        className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black text-sm hover:bg-slate-800 transition-all shadow-xl shadow-slate-900/10 active:scale-95 mt-4"
                     >
                        ویرایش تنظیمات فروشگاه
                     </button>
                  </div>
               </div>
             </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Header;
