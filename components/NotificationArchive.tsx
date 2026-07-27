
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  Trash2, 
  Bell, 
  Package, 
  ClipboardList, 
  AlertTriangle, 
  CheckCheck, 
  Filter,
  ArrowRight,
  Info
} from 'lucide-react';
import { Notification } from '../types';

interface NotificationArchiveProps {
  notifications: Notification[];
  onDelete: (id: string) => void;
  onClearAll: () => void;
  onMarkRead: (notification: Notification) => void;
  onBack: () => void;
}

const NotificationArchive: React.FC<NotificationArchiveProps> = ({ 
  notifications, 
  onDelete, 
  onClearAll, 
  onMarkRead,
  onBack
}) => {
  const [filter, setFilter] = useState<'all' | 'order' | 'inventory' | 'system'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredNotifications = notifications.filter(n => {
    const matchesFilter = filter === 'all' || n.type === filter;
    const matchesSearch = n.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          n.message.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const getIcon = (type: string) => {
    switch (type) {
      case 'order': return <ClipboardList className="w-5 h-5 text-emerald-600" />;
      case 'inventory': return <Package className="w-5 h-5 text-red-600" />;
      case 'system': return <Info className="w-5 h-5 text-blue-600" />;
      default: return <Bell className="w-5 h-5 text-slate-600" />;
    }
  };

  const getBgColor = (type: string) => {
    switch (type) {
      case 'order': return 'bg-emerald-50 dark:bg-emerald-950/25 border-emerald-100 dark:border-emerald-900/30';
      case 'inventory': return 'bg-red-50 dark:bg-red-950/25 border-red-100 dark:border-red-900/30';
      case 'system': return 'bg-blue-50 dark:bg-blue-950/25 border-blue-100 dark:border-blue-900/30';
      default: return 'bg-slate-50 dark:bg-slate-800/50 border-slate-100 dark:border-slate-800/50';
    }
  };

  return (
    <div className="h-full flex flex-col bg-slate-50 dark:bg-slate-950 font-['Vazirmatn'] overflow-hidden transition-colors">
      {/* Header */}
      <div className="p-4 sm:p-6 lg:p-8 pb-6 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 shrink-0 transition-colors">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
           <div>
              <button 
                onClick={onBack}
                className="flex items-center gap-2 text-slate-500 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors text-xs sm:text-sm font-bold mb-3 sm:mb-4"
              >
                <ArrowRight className="w-4 h-4" />
                بازگشت به داشبورد
              </button>
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-slate-100 flex items-center gap-3">
                <Bell className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
                آرشیو اعلان‌ها
              </h1>
           </div>
           
           {notifications.length > 0 && (
             <button 
               onClick={onClearAll}
               className="w-full sm:w-auto justify-center flex items-center gap-2 px-4 py-2.5 bg-red-50 dark:bg-red-950/20 text-red-600 dark:text-red-400 rounded-xl text-xs sm:text-sm font-bold hover:bg-red-100 dark:hover:bg-red-900/40 transition-colors border border-red-100 dark:border-red-900/20 active:scale-95"
             >
               <Trash2 className="w-4 h-4" />
               حذف همه
             </button>
           )}
        </div>

        {/* Toolbar */}
        <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
          {/* Filters */}
          <div className="flex items-center gap-1 sm:gap-2 bg-slate-100 dark:bg-slate-950 p-1 rounded-xl w-full md:w-auto border border-slate-200/20 dark:border-slate-800/60">
            {['all', 'order', 'system'].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f as any)}
                className={`flex-1 md:flex-none px-3 sm:px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                  filter === f 
                    ? 'bg-white dark:bg-slate-800 text-slate-850 dark:text-slate-100 shadow-sm' 
                    : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
                }`}
              >
                {f === 'all' && 'همه'}
                {f === 'order' && 'سفارشات'}
                {f === 'system' && 'سیستم'}
              </button>
            ))}
          </div>

          {/* Search */}
          <div className="relative w-full md:w-64">
             <Search className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" />
             <input 
               type="text" 
               value={searchQuery}
               onChange={(e) => setSearchQuery(e.target.value)}
               placeholder="جستجو در اعلان‌ها..."
               className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 pr-10 py-2.5 text-sm outline-none focus:border-emerald-500 dark:focus:border-emerald-500 transition-colors text-slate-850 dark:text-slate-100"
             />
          </div>
        </div>
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
        <AnimatePresence mode="popLayout">
          {filteredNotifications.length > 0 ? (
            <div className="space-y-3 max-w-4xl mx-auto">
              {filteredNotifications.map((notification) => (
                <motion.div
                  key={notification.id}
                  layout
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className={`relative p-4 rounded-2xl border transition-all hover:shadow-md group ${
                    notification.read 
                      ? 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 opacity-80 hover:opacity-100' 
                      : 'bg-white dark:bg-slate-900 border-emerald-200 dark:border-emerald-800/50 shadow-sm'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row items-start gap-4">
                     <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 border ${getBgColor(notification.type)}`}>
                        {getIcon(notification.type)}
                     </div>
                     
                     <div className="flex-1 cursor-pointer w-full min-w-0" onClick={() => onMarkRead(notification)}>
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-1">
                           <h3 className={`text-sm font-black ${notification.read ? 'text-slate-500 dark:text-slate-400' : 'text-slate-900 dark:text-slate-100'}`}>
                              {notification.title}
                           </h3>
                           <span className="text-[10px] text-slate-400 dark:text-slate-500 font-bold bg-slate-50 dark:bg-slate-950 px-2 py-1 rounded-lg border border-slate-200/20 dark:border-slate-800/40 w-fit">
                              {notification.time}
                           </span>
                        </div>
                        <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed max-w-2xl">
                           {notification.message}
                        </p>
                        
                        <div className="flex items-center gap-2 mt-3">
                           {notification.type === 'order' && (
                              <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-100 dark:border-emerald-900/30">سفارش جدید</span>
                           )}
                           {notification.type === 'inventory' && (
                              <span className="text-[10px] font-bold text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/40 px-2 py-0.5 rounded border border-red-100 dark:border-red-900/30">هشدار موجودی</span>
                           )}
                           {!notification.read && (
                              <span className="text-[10px] font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/40 px-2 py-0.5 rounded flex items-center gap-1">
                                 جدید
                              </span>
                           )}
                        </div>
                     </div>

                     {/* Action tray persistent on mobile, group hover on desktop */}
                     <div className="flex flex-row sm:flex-col gap-1.5 sm:gap-2 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity shrink-0 w-full sm:w-auto justify-end border-t sm:border-t-0 border-slate-100 dark:border-slate-800/40 pt-3 sm:pt-0 mt-2 sm:mt-0">
                        <button 
                           onClick={(e) => { e.stopPropagation(); onDelete(notification.id); }}
                           className="w-11 h-11 sm:w-9 sm:h-9 flex items-center justify-center text-slate-400 hover:text-red-500 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-xl transition-colors active:scale-95"
                           title="حذف"
                        >
                           <Trash2 className="w-4 h-4" />
                        </button>
                        {!notification.read && (
                           <button 
                              onClick={(e) => { e.stopPropagation(); onMarkRead(notification); }}
                              className="w-11 h-11 sm:w-9 sm:h-9 flex items-center justify-center text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/20 rounded-xl transition-colors active:scale-95"
                              title="خوانده شد"
                           >
                              <CheckCheck className="w-4 h-4" />
                           </button>
                        )}
                     </div>
                  </div>
                  {!notification.read && (
                     <div className="absolute right-0 top-6 bottom-6 w-1 bg-emerald-500 rounded-l-full" />
                  )}
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-slate-400 opacity-60">
               <div className="w-20 h-20 bg-slate-100 dark:bg-slate-900 rounded-full flex items-center justify-center mb-4">
                  <Bell className="w-8 h-8 text-slate-300 dark:text-slate-700" />
               </div>
               <p className="font-bold dark:text-slate-300">هیچ اعلانی یافت نشد</p>
               {filter !== 'all' && (
                  <button onClick={() => setFilter('all')} className="text-xs text-emerald-600 dark:text-emerald-400 font-bold mt-2 hover:underline">
                     مشاهده همه
                  </button>
               )}
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default NotificationArchive;
