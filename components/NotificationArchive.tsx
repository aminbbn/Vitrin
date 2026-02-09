
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
      case 'order': return 'bg-emerald-50 border-emerald-100';
      case 'inventory': return 'bg-red-50 border-red-100';
      case 'system': return 'bg-blue-50 border-blue-100';
      default: return 'bg-slate-50 border-slate-100';
    }
  };

  return (
    <div className="h-full flex flex-col bg-slate-50 font-['Vazirmatn'] overflow-hidden">
      {/* Header */}
      <div className="p-8 pb-6 bg-white border-b border-slate-200 shrink-0">
        <div className="flex items-center justify-between mb-6">
           <div>
              <button 
                onClick={onBack}
                className="flex items-center gap-2 text-slate-500 hover:text-emerald-600 transition-colors text-sm font-bold mb-4"
              >
                <ArrowRight className="w-4 h-4" />
                بازگشت به داشبورد
              </button>
              <h1 className="text-2xl font-black text-slate-900 flex items-center gap-3">
                <Bell className="w-6 h-6 text-emerald-600" />
                آرشیو اعلان‌ها
              </h1>
           </div>
           
           {notifications.length > 0 && (
             <button 
               onClick={onClearAll}
               className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 rounded-xl text-sm font-bold hover:bg-red-100 transition-colors border border-red-100"
             >
               <Trash2 className="w-4 h-4" />
               حذف همه
             </button>
           )}
        </div>

        {/* Toolbar */}
        <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
          {/* Filters */}
          <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-xl w-full md:w-auto">
            {['all', 'order', 'inventory', 'system'].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f as any)}
                className={`flex-1 md:flex-none px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                  filter === f 
                    ? 'bg-white text-slate-800 shadow-sm' 
                    : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                {f === 'all' && 'همه'}
                {f === 'order' && 'سفارشات'}
                {f === 'inventory' && 'موجودی'}
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
               className="w-full bg-white border border-slate-200 rounded-xl px-4 pr-10 py-2.5 text-sm outline-none focus:border-emerald-500 transition-colors"
             />
          </div>
        </div>
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto p-8">
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
                    notification.read ? 'bg-white border-slate-200 opacity-80 hover:opacity-100' : 'bg-white border-emerald-200 shadow-sm'
                  }`}
                >
                  <div className="flex items-start gap-4">
                     <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${getBgColor(notification.type)}`}>
                        {getIcon(notification.type)}
                     </div>
                     
                     <div className="flex-1 cursor-pointer" onClick={() => onMarkRead(notification)}>
                        <div className="flex items-center justify-between mb-1">
                           <h3 className={`text-sm font-black ${notification.read ? 'text-slate-700' : 'text-slate-900'}`}>
                              {notification.title}
                           </h3>
                           <span className="text-[10px] text-slate-400 font-bold bg-slate-50 px-2 py-1 rounded-lg">
                              {notification.time}
                           </span>
                        </div>
                        <p className="text-xs text-slate-500 leading-relaxed max-w-2xl">
                           {notification.message}
                        </p>
                        
                        <div className="flex items-center gap-2 mt-3">
                           {notification.type === 'order' && (
                              <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100">سفارش جدید</span>
                           )}
                           {notification.type === 'inventory' && (
                              <span className="text-[10px] font-bold text-red-600 bg-red-50 px-2 py-0.5 rounded border border-red-100">هشدار موجودی</span>
                           )}
                           {!notification.read && (
                              <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded flex items-center gap-1">
                                 جدید
                              </span>
                           )}
                        </div>
                     </div>

                     <div className="flex flex-col gap-2">
                        <button 
                           onClick={() => onDelete(notification.id)}
                           className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-colors"
                           title="حذف"
                        >
                           <Trash2 className="w-4 h-4" />
                        </button>
                        {!notification.read && (
                           <button 
                              onClick={() => onMarkRead(notification)}
                              className="p-2 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-xl transition-colors"
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
               <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                  <Bell className="w-8 h-8 text-slate-300" />
               </div>
               <p className="font-bold">هیچ اعلانی یافت نشد</p>
               {filter !== 'all' && (
                  <button onClick={() => setFilter('all')} className="text-xs text-emerald-600 font-bold mt-2 hover:underline">
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
