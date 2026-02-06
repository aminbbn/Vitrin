
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Clock, 
  MapPin, 
  Check, 
  MoreHorizontal, 
  AlertCircle,
  Truck,
  CookingPot,
  BellRing
} from 'lucide-react';
import { Order, OrderStatus } from '../types';

const INITIAL_ORDERS: Order[] = [
  { id: '#12890', tableNumber: 5, items: ['پیتزا پپرونی (متوسط)', 'کوکا کولا', 'سیب‌زمینی سرخ کرده'], totalPrice: 320000, status: 'new', timestamp: '۲ دقیقه پیش' },
  { id: '#12891', tableNumber: 12, items: ['همبرگر ویژه', 'سالاد فصل'], totalPrice: 185000, status: 'new', timestamp: '۵ دقیقه پیش' },
  { id: '#12888', tableNumber: 8, items: ['پیتزا سبزیجات', 'دلستر'], totalPrice: 240000, status: 'preparing', timestamp: '۱۰ دقیقه پیش' },
  { id: '#12885', tableNumber: 2, items: ['جوجه کباب', 'برنج ایرانی'], totalPrice: 410000, status: 'ready', timestamp: '۱۵ دقیقه پیش' },
  { id: '#12880', tableNumber: 1, items: ['سوپ جو'], totalPrice: 65000, status: 'delivered', timestamp: '۱ ساعت پیش' },
];

const OrderBoard: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>(INITIAL_ORDERS);

  const updateStatus = (id: string, newStatus: OrderStatus) => {
    setOrders(prev => prev.map(o => o.id === id ? { ...o, status: newStatus } : o));
  };

  const COLUMNS: { id: OrderStatus, label: string, color: string, icon: any }[] = [
    { id: 'new', label: 'سفارشات جدید', color: 'red', icon: <BellRing className="w-5 h-5" /> },
    { id: 'preparing', label: 'در حال آماده‌سازی', color: 'orange', icon: <CookingPot className="w-5 h-5" /> },
    { id: 'ready', label: 'آماده تحویل', color: 'emerald', icon: <Check className="w-5 h-5" /> },
    { id: 'delivered', label: 'تحویل شده', color: 'slate', icon: <Truck className="w-5 h-5" /> },
  ];

  return (
    <div className="flex flex-col h-full bg-slate-50">
      <div className="p-8 border-b border-slate-200 bg-white flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-slate-900">سفارشات زنده</h1>
          <p className="text-sm text-slate-400 mt-1">مدیریت لحظه‌ای درخواست‌های مشتریان</p>
        </div>
        <div className="flex gap-4">
          <div className="flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-600 rounded-xl font-bold text-sm border border-emerald-100">
            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-ping" />
            ۱۰ سفارش فعال
          </div>
          <button className="px-4 py-2 bg-slate-100 text-slate-600 rounded-xl font-bold text-sm hover:bg-slate-200 transition-colors">فیلتر کردن</button>
        </div>
      </div>

      <div className="flex-1 overflow-x-auto p-8 flex gap-8">
        {COLUMNS.map((col) => (
          <div key={col.id} className="min-w-[320px] flex-1 flex flex-col gap-4">
            <div className="flex items-center justify-between px-2">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg bg-${col.color}-100 text-${col.color}-600`}>
                  {col.icon}
                </div>
                <h3 className="font-bold text-slate-800">{col.label}</h3>
                <span className="bg-slate-200 text-slate-600 text-[10px] font-black px-2 py-0.5 rounded-full">
                  {orders.filter(o => o.status === col.id).length}
                </span>
              </div>
              <MoreHorizontal className="w-4 h-4 text-slate-400 cursor-pointer" />
            </div>

            <div className="flex-1 space-y-4">
              <AnimatePresence>
                {orders
                  .filter((o) => o.status === col.id)
                  .map((order) => (
                    <motion.div
                      key={order.id}
                      layout
                      initial={{ opacity: 0, scale: 0.9, y: 10 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      className={`bg-white p-5 rounded-2xl shadow-sm border ${
                        col.id === 'new' ? 'border-red-100 ring-2 ring-red-500/10' : 'border-slate-100'
                      } hover:shadow-md transition-all group cursor-pointer relative overflow-hidden`}
                    >
                      {col.id === 'new' && (
                        <div className="absolute top-0 right-0 w-1 h-full bg-red-500" />
                      )}

                      <div className="flex items-center justify-between mb-4">
                        <span className="text-xs font-black text-slate-800">{order.id}</span>
                        <div className="flex items-center gap-1.5 text-slate-400">
                          <Clock className="w-3.5 h-3.5" />
                          <span className="text-[10px] font-bold">{order.timestamp}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 mb-3">
                        <div className="bg-slate-100 text-slate-700 px-3 py-1 rounded-lg flex items-center gap-1.5">
                          <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                          <span className="text-xs font-black">میز {order.tableNumber}</span>
                        </div>
                      </div>

                      <div className="space-y-2 mb-4">
                        {order.items.map((item, i) => (
                          <div key={i} className="flex items-center gap-2 text-xs text-slate-600">
                            <div className="w-1 h-1 bg-slate-300 rounded-full" />
                            {item}
                          </div>
                        ))}
                      </div>

                      <div className="flex items-center justify-between pt-4 border-t border-slate-50">
                        <span className="text-sm font-black text-emerald-600">{order.totalPrice.toLocaleString()} تومان</span>
                        
                        {col.id === 'new' && (
                          <button 
                            onClick={() => updateStatus(order.id, 'preparing')}
                            className="bg-red-500 text-white px-4 py-2 rounded-xl text-xs font-bold animate-pulse-emerald hover:bg-red-600 transition-colors"
                          >
                            تایید سفارش
                          </button>
                        )}

                        {col.id === 'preparing' && (
                          <button 
                            onClick={() => updateStatus(order.id, 'ready')}
                            className="bg-orange-500 text-white px-4 py-2 rounded-xl text-xs font-bold hover:bg-orange-600 transition-colors"
                          >
                            آماده شد
                          </button>
                        )}

                        {col.id === 'ready' && (
                          <button 
                            onClick={() => updateStatus(order.id, 'delivered')}
                            className="bg-emerald-500 text-white px-4 py-2 rounded-xl text-xs font-bold hover:bg-emerald-600 transition-colors"
                          >
                            تحویل داده شد
                          </button>
                        )}

                        {col.id === 'delivered' && (
                          <div className="flex items-center gap-1 text-emerald-600 text-[10px] font-bold">
                            <Check className="w-3 h-3" /> تحویل شد
                          </div>
                        )}
                      </div>
                    </motion.div>
                  ))}
              </AnimatePresence>

              {orders.filter(o => o.status === col.id).length === 0 && (
                <div className="h-32 border-2 border-dashed border-slate-200 rounded-2xl flex items-center justify-center text-slate-300 text-xs text-center p-4">
                   سفارشی در این وضعیت وجود ندارد
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OrderBoard;
