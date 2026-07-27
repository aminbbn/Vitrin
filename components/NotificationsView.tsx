
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, Check, Trash2, Clock, CheckCircle2, ClipboardList, Package, Info } from 'lucide-react';
import { Notification } from '../types';

interface NotificationsViewProps {
  notifications: Notification[];
  onMarkAllRead: () => void;
  onMarkRead: (id: string) => void;
  onDelete: (id: string) => void;
}

const NotificationsView: React.FC<NotificationsViewProps> = ({
  notifications,
  onMarkAllRead,
  onMarkRead,
  onDelete
}) => {
  const unreadCount = notifications.filter(n => !n.read).length;

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
      case 'order': return 'bg-emerald-50 dark:bg-emerald-950/20 border-emerald-100 dark:border-emerald-900/30';
      case 'inventory': return 'bg-red-50 dark:bg-red-950/20 border-red-100 dark:border-red-900/30';
      case 'system': return 'bg-blue-50 dark:bg-blue-950/20 border-blue-100 dark:border-blue-900/30';
      default: return 'bg-slate-50 dark:bg-slate-800/50 border-slate-100 dark:border-slate-800/50';
    }
  };

  return (
    <div className="h-full bg-slate-50 dark:bg-slate-950 font-['Vazirmatn'] overflow-y-auto p-4 sm:p-6 lg:p-8 transition-colors">
      <div className="max-w-4xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
           <div>
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-slate-100 flex items-center gap-3">
                 <Bell className="w-6 h-6 sm:w-7 sm:h-7 text-emerald-600 dark:text-emerald-500" />
                 اعلان‌ها
                 {unreadCount > 0 && (
                    <span className="text-xs bg-red-500 text-white px-2 py-0.5 rounded-full shadow-md shadow-red-200 dark:shadow-none">{unreadCount} جدید</span>
                 )}
              </h1>
              <p className="text-xs sm:text-sm text-slate-400 dark:text-slate-500 mt-1 sm:mt-2">مرکز پیام‌ها و هشدارهای سیستم</p>
           </div>
           
           <div className="flex gap-3">
              {unreadCount > 0 && (
                 <button 
                   onClick={onMarkAllRead}
                   className="w-full sm:w-auto justify-center px-4 py-2 bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-900/30 rounded-xl text-xs font-bold hover:bg-emerald-100 dark:hover:bg-emerald-900/40 transition-colors flex items-center gap-2"
                 >
                    <CheckCircle2 className="w-4 h-4" />
                    علامت‌گذاری همه به عنوان خوانده شده
                 </button>
              )}
           </div>
        </div>

        {/* Notifications List */}
        <div className="space-y-4">
           <AnimatePresence mode="popLayout">
              {notifications.length > 0 ? (
                 notifications.map((notification) => (
                    <motion.div
                       key={notification.id}
                       layout
                       initial={{ opacity: 0, y: 10 }}
                       animate={{ opacity: 1, y: 0 }}
                       exit={{ opacity: 0, scale: 0.95 }}
                       className={`relative p-4 sm:p-5 rounded-2xl border transition-all hover:shadow-md group ${
                          notification.read 
                            ? 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800' 
                            : 'bg-white dark:bg-slate-900 border-emerald-200 dark:border-emerald-800/50 shadow-md shadow-emerald-50/10'
                       }`}
                    >
                       <div className="flex flex-col sm:flex-row items-start gap-4">
                          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-sm border ${getBgColor(notification.type)}`}>
                             {getIcon(notification.type)}
                          </div>
                          
                          <div className="flex-1 cursor-pointer w-full min-w-0" onClick={() => onMarkRead(notification.id)}>
                             <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-1">
                                <h3 className={`text-sm font-black ${notification.read ? 'text-slate-500 dark:text-slate-400' : 'text-slate-900 dark:text-slate-100'}`}>
                                   {notification.title}
                                </h3>
                                <div className="flex items-center w-fit gap-2 text-[10px] text-slate-400 dark:text-slate-500 font-bold bg-slate-50 dark:bg-slate-950 px-2 py-1 rounded-lg border border-slate-200/20 dark:border-slate-800/40">
                                   <Clock className="w-3 h-3" />
                                   {notification.time}
                                </div>
                             </div>
                             <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed max-w-2xl">
                                {notification.message}
                             </p>
                             
                             <div className="flex items-center gap-2 mt-3">
                                {!notification.read && (
                                   <span className="text-[10px] font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/50 px-2 py-0.5 rounded flex items-center gap-1 animate-pulse">
                                      <span className="w-1.5 h-1.5 bg-blue-500 dark:bg-blue-400 rounded-full" />
                                      جدید
                                   </span>
                                )}
                             </div>
                          </div>

                          {/* Action Column - persistent on mobile, hover overlay on md desktop */}
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
                                   onClick={(e) => { e.stopPropagation(); onMarkRead(notification.id); }}
                                   className="w-11 h-11 sm:w-9 sm:h-9 flex items-center justify-center text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/20 rounded-xl transition-colors active:scale-95"
                                   title="خوانده شد"
                                >
                                   <Check className="w-4 h-4" />
                                </button>
                             )}
                          </div>
                       </div>
                    </motion.div>
                 ))
              ) : (
                 <div className="flex flex-col items-center justify-center py-20 text-slate-400 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-3xl">
                    <div className="w-20 h-20 bg-slate-50 dark:bg-slate-900 rounded-full flex items-center justify-center mb-4">
                       <Bell className="w-8 h-8 text-slate-300 dark:text-slate-700" />
                    </div>
                    <p className="font-bold dark:text-slate-300">هیچ اعلانی ندارید</p>
                    <p className="text-xs mt-1 dark:text-slate-500">همه چیز تحت کنترل است!</p>
                 </div>
              )}
           </AnimatePresence>
        </div>

      </div>
    </div>
  );
};

export default NotificationsView;
