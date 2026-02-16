
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
      case 'order': return 'bg-emerald-50 border-emerald-100';
      case 'inventory': return 'bg-red-50 border-red-100';
      case 'system': return 'bg-blue-50 border-blue-100';
      default: return 'bg-slate-50 border-slate-100';
    }
  };

  return (
    <div className="h-full bg-slate-50 font-['Vazirmatn'] overflow-y-auto p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
           <div>
              <h1 className="text-2xl font-black text-slate-900 flex items-center gap-3">
                 <Bell className="w-7 h-7 text-emerald-600" />
                 اعلان‌ها
                 {unreadCount > 0 && (
                    <span className="text-sm bg-red-500 text-white px-2 py-0.5 rounded-full shadow-md shadow-red-200">{unreadCount} جدید</span>
                 )}
              </h1>
              <p className="text-sm text-slate-400 mt-2">مرکز پیام‌ها و هشدارهای سیستم</p>
           </div>
           
           <div className="flex gap-3">
              {unreadCount > 0 && (
                 <button 
                   onClick={onMarkAllRead}
                   className="px-4 py-2 bg-emerald-50 text-emerald-600 border border-emerald-100 rounded-xl text-xs font-bold hover:bg-emerald-100 transition-colors flex items-center gap-2"
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
                       className={`relative p-5 rounded-2xl border transition-all hover:shadow-lg group ${
                          notification.read ? 'bg-white border-slate-200' : 'bg-white border-emerald-200 shadow-md shadow-emerald-50'
                       }`}
                    >
                       <div className="flex items-start gap-4">
                          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-sm ${getBgColor(notification.type)}`}>
                             {getIcon(notification.type)}
                          </div>
                          
                          <div className="flex-1 cursor-pointer" onClick={() => onMarkRead(notification.id)}>
                             <div className="flex items-center justify-between mb-1">
                                <h3 className={`text-sm font-black ${notification.read ? 'text-slate-600' : 'text-slate-900'}`}>
                                   {notification.title}
                                </h3>
                                <div className="flex items-center gap-2 text-[10px] text-slate-400 font-bold bg-slate-50 px-2 py-1 rounded-lg">
                                   <Clock className="w-3 h-3" />
                                   {notification.time}
                                </div>
                             </div>
                             <p className="text-xs text-slate-500 leading-relaxed max-w-2xl">
                                {notification.message}
                             </p>
                             
                             <div className="flex items-center gap-2 mt-3">
                                {!notification.read && (
                                   <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded flex items-center gap-1 animate-pulse">
                                      <span className="w-1.5 h-1.5 bg-blue-500 rounded-full" />
                                      جدید
                                   </span>
                                )}
                             </div>
                          </div>

                          <div className="flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                             <button 
                                onClick={() => onDelete(notification.id)}
                                className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-colors"
                                title="حذف"
                             >
                                <Trash2 className="w-4 h-4" />
                             </button>
                             {!notification.read && (
                                <button 
                                   onClick={() => onMarkRead(notification.id)}
                                   className="p-2 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-xl transition-colors"
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
                 <div className="flex flex-col items-center justify-center py-20 text-slate-400 border-2 border-dashed border-slate-200 rounded-3xl">
                    <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-4">
                       <Bell className="w-8 h-8 text-slate-300" />
                    </div>
                    <p className="font-bold">هیچ اعلانی ندارید</p>
                    <p className="text-xs mt-1">همه چیز تحت کنترل است!</p>
                 </div>
              )}
           </AnimatePresence>
        </div>

      </div>
    </div>
  );
};

export default NotificationsView;
