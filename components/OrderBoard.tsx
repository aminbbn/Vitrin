
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Clock, 
  Check, 
  MoreHorizontal, 
  Truck,
  CookingPot,
  BellRing,
  Utensils,
  X,
  User,
  FileText,
  ChevronLeft,
  Calendar,
  AlertCircle
} from 'lucide-react';
import { Order, OrderStatus } from '../types';

// --- Mock Data ---
const INITIAL_ORDERS: Order[] = [
  { id: '#12890', tableNumber: 5, customerName: 'محمد رضایی', items: ['پیتزا پپرونی (متوسط)', 'کوکا کولا', 'سیب‌زمینی سرخ کرده'], notes: 'سیب‌زمینی بدون نمک باشد', totalPrice: 320000, status: 'new', timestamp: '۲ دقیقه پیش' },
  { id: '#12891', tableNumber: 12, items: ['همبرگر ویژه', 'سالاد فصل'], totalPrice: 185000, status: 'new', timestamp: '۵ دقیقه پیش' },
  { id: '#12888', tableNumber: 8, customerName: 'سارا احمدی', items: ['پیتزا سبزیجات', 'دلستر'], totalPrice: 240000, status: 'preparing', timestamp: '۱۰ دقیقه پیش' },
  { id: '#12885', tableNumber: 2, items: ['جوجه کباب', 'برنج ایرانی'], totalPrice: 410000, status: 'ready', timestamp: '۱۵ دقیقه پیش' },
  { id: '#12880', tableNumber: 1, items: ['سوپ جو'], totalPrice: 65000, status: 'delivered', timestamp: '۱ ساعت پیش' },
];

const COLUMNS: { id: OrderStatus, label: string, color: string, bg: string, icon: any }[] = [
  { id: 'new', label: 'جدید', color: 'text-red-600', bg: 'bg-red-50', icon: <BellRing className="w-5 h-5" /> },
  { id: 'preparing', label: 'در حال پخت', color: 'text-orange-600', bg: 'bg-orange-50', icon: <CookingPot className="w-5 h-5" /> },
  { id: 'ready', label: 'آماده تحویل', color: 'text-emerald-600', bg: 'bg-emerald-50', icon: <Check className="w-5 h-5" /> },
  { id: 'delivered', label: 'تحویل شده', color: 'text-slate-600', bg: 'bg-slate-100', icon: <Truck className="w-5 h-5" /> },
];

// Optimized Transition: High stiffness + High damping = Snappy but NO bounce
const SMOOTH_TRANSITION = {
  type: "spring" as const,
  stiffness: 400,
  damping: 40,
  mass: 1
};

interface OrderBoardProps {
  brandColor: string;
}

const OrderBoard: React.FC<OrderBoardProps> = ({ brandColor }) => {
  const [orders, setOrders] = useState<Order[]>(INITIAL_ORDERS);
  const [draggedOrder, setDraggedOrder] = useState<Order | null>(null);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const updateStatus = (id: string, newStatus: OrderStatus) => {
    setOrders(prev => prev.map(o => o.id === id ? { ...o, status: newStatus } : o));
    setActiveDropdown(null);
  };

  const handleDragStart = (order: Order) => {
    setDraggedOrder(order);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (status: OrderStatus) => {
    if (draggedOrder && draggedOrder.status !== status) {
      updateStatus(draggedOrder.id, status);
    }
    setDraggedOrder(null);
  };

  const handleDragEnd = () => {
    setDraggedOrder(null);
  };

  // Status Stepper for Modal
  const getStatusStep = (status: OrderStatus) => {
    switch (status) {
      case 'new': return 1;
      case 'preparing': return 2;
      case 'ready': return 3;
      case 'delivered': return 4;
    }
  };

  return (
    <div className="flex flex-col h-full bg-slate-50 font-['Vazirmatn'] relative" onClick={() => setActiveDropdown(null)}>
      
      {/* Header */}
      <div className="p-6 border-b border-slate-200 bg-white flex items-center justify-between shrink-0 z-20 shadow-sm relative">
        <div>
          <h1 className="text-2xl font-black text-slate-900 flex items-center gap-3">
            <Utensils className={`w-6 h-6 text-${brandColor}-600`} />
            مدیریت سفارشات
          </h1>
          <p className="text-sm text-slate-400 mt-1">مانیتورینگ زنده وضعیت سفارشات رستوران</p>
        </div>
        <div className="flex gap-4">
           <div className="flex -space-x-2 space-x-reverse px-2">
              {orders.slice(0, 3).map((_, i) => (
                 <div key={i} className="w-9 h-9 rounded-full bg-slate-100 border-2 border-white flex items-center justify-center text-[10px] font-bold text-slate-500 shadow-sm">
                    <User className="w-4 h-4" />
                 </div>
              ))}
              <div className="w-9 h-9 rounded-full bg-slate-900 text-white border-2 border-white flex items-center justify-center text-[10px] font-bold shadow-sm">
                 +۸
              </div>
           </div>
           <button className={`px-5 py-2.5 bg-${brandColor}-600 text-white rounded-xl text-sm font-bold shadow-lg shadow-${brandColor}-200 hover:bg-${brandColor}-700 hover:shadow-${brandColor}-300 transition-all active:scale-95`}>
              ثبت سفارش جدید
           </button>
        </div>
      </div>

      {/* Board Columns */}
      <div className="flex-1 overflow-x-auto p-6 flex gap-6 scrollbar-hide">
        {COLUMNS.map((col) => (
          <div 
            key={col.id} 
            className="min-w-[320px] flex-1 flex flex-col h-full"
            onDragOver={handleDragOver}
            onDrop={() => handleDrop(col.id)}
          >
            {/* Column Header */}
            <div className={`flex items-center justify-between p-4 rounded-2xl mb-4 ${col.bg} border border-transparent`}>
              <div className="flex items-center gap-3">
                <div className={`p-2.5 rounded-xl bg-white shadow-sm ${col.color}`}>
                  {col.icon}
                </div>
                <div>
                   <h3 className={`font-black ${col.color} text-sm`}>{col.label}</h3>
                   <span className="text-[11px] font-bold opacity-70 text-slate-600">
                      {orders.filter(o => o.status === col.id).length} سفارش فعال
                   </span>
                </div>
              </div>
              {col.id === 'new' && orders.filter(o => o.status === 'new').length > 0 && (
                 <div className="flex h-3 w-3 relative">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                 </div>
              )}
            </div>

            {/* Drop Zone */}
            <div className="flex-1 overflow-y-auto pb-20 space-y-3 px-1 scrollbar-hide">
              <AnimatePresence mode="popLayout">
                {orders
                  .filter((o) => o.status === col.id)
                  .map((order) => {
                    const isDragging = draggedOrder?.id === order.id;
                    return (
                      <motion.div
                        key={order.id}
                        layout
                        layoutId={order.id}
                        transition={SMOOTH_TRANSITION}
                        initial={{ opacity: 0, scale: 0.9, y: 10 }}
                        animate={{ 
                          opacity: isDragging ? 0.3 : 1, 
                          scale: isDragging ? 0.98 : 1,
                          y: 0,
                          filter: isDragging ? 'grayscale(100%)' : 'grayscale(0%)'
                        }}
                        exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
                        draggable
                        onDragStart={() => handleDragStart(order)}
                        onDragEnd={handleDragEnd}
                        onClick={(e) => {
                           if ((e.target as HTMLElement).closest('.action-btn')) return;
                           setSelectedOrder(order);
                        }}
                        className={`bg-white p-5 rounded-2xl transition-all cursor-grab active:cursor-grabbing group relative select-none ${
                          isDragging 
                            ? 'border-2 border-dashed border-slate-300 shadow-none bg-slate-50' 
                            : `border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-${brandColor}-500/5 hover:border-${brandColor}-200`
                        }`}
                      >
                        {/* Card Content */}
                        <div className="flex items-start justify-between mb-4">
                           <div className="flex items-center gap-2">
                              <span className="bg-slate-900 text-white px-2.5 py-1.5 rounded-lg text-[10px] font-black tracking-wide">
                                 میز {order.tableNumber}
                              </span>
                              {order.status === 'new' && (
                                 <span className="bg-red-50 text-red-600 px-2.5 py-1.5 rounded-lg text-[10px] font-bold flex items-center gap-1.5 border border-red-100">
                                    <Clock className="w-3 h-3" /> فوری
                                 </span>
                              )}
                           </div>
                           <div className="relative action-btn">
                              <button 
                                 onClick={(e) => {
                                    e.stopPropagation();
                                    setActiveDropdown(activeDropdown === order.id ? null : order.id);
                                 }}
                                 className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-slate-600 transition-colors"
                              >
                                 <MoreHorizontal className="w-5 h-5" />
                              </button>
                              
                              {/* Quick Action Dropdown */}
                              <AnimatePresence>
                                {activeDropdown === order.id && (
                                   <motion.div 
                                      initial={{ opacity: 0, scale: 0.95, transformOrigin: "top left" }}
                                      animate={{ opacity: 1, scale: 1 }}
                                      exit={{ opacity: 0, scale: 0.95 }}
                                      transition={{ duration: 0.15 }}
                                      className="absolute left-0 top-full mt-2 w-44 bg-white rounded-xl shadow-xl border border-slate-100 z-50 overflow-hidden"
                                   >
                                      {COLUMNS.filter(c => c.id !== order.status).map(c => (
                                         <button
                                            key={c.id}
                                            onClick={(e) => {
                                               e.stopPropagation();
                                               updateStatus(order.id, c.id);
                                            }}
                                            className={`w-full text-right px-4 py-3 text-xs font-bold text-slate-600 hover:bg-slate-50 hover:text-${brandColor}-600 transition-colors flex items-center gap-3 border-b border-slate-50 last:border-0`}
                                         >
                                            <div className={`w-2 h-2 rounded-full ${c.color.replace('text-', 'bg-')}`} />
                                            انتقال به {c.label}
                                         </button>
                                      ))}
                                   </motion.div>
                                )}
                              </AnimatePresence>
                           </div>
                        </div>

                        <div className="mb-4 space-y-2">
                           <div className="flex items-center justify-between">
                              <h4 className="font-black text-slate-800 text-sm">{order.id}</h4>
                              {order.customerName && <span className="text-[10px] font-bold text-slate-400 flex items-center gap-1"><User className="w-3 h-3" /> {order.customerName}</span>}
                           </div>
                           <div className="text-xs font-medium text-slate-500 leading-6 bg-slate-50 p-2 rounded-lg border border-slate-100">
                              {order.items.join('، ')}
                           </div>
                        </div>

                        <div className="flex items-center justify-between pt-3 border-t border-slate-50">
                           <div className="flex flex-col">
                              <span className="text-[10px] text-slate-400 font-bold mb-0.5">مبلغ کل</span>
                              <span className={`text-sm font-black text-${brandColor}-600`}>{order.totalPrice.toLocaleString()} <span className="text-[10px] font-medium text-slate-400">تومان</span></span>
                           </div>
                           <div className="text-[10px] font-bold text-slate-400 bg-white border border-slate-100 px-2 py-1 rounded-lg shadow-sm">
                              {order.timestamp}
                           </div>
                        </div>
                      </motion.div>
                    );
                  })}
              </AnimatePresence>
              
              {/* Empty State */}
              {orders.filter(o => o.status === col.id).length === 0 && (
                 <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="h-32 border-2 border-dashed border-slate-200 rounded-3xl flex flex-col gap-2 items-center justify-center text-slate-300 bg-slate-50/50"
                 >
                    <div className="p-3 bg-white rounded-full shadow-sm">
                       {col.icon}
                    </div>
                    <span className="text-xs font-bold">بدون سفارش</span>
                 </motion.div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* --- REIMAGINED ORDER DETAILS MODAL --- */}
      <AnimatePresence>
        {selectedOrder && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedOrder(null)}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-md"
            />
            <motion.div 
               layoutId={selectedOrder.id}
               transition={SMOOTH_TRANSITION}
               className="bg-white w-full max-w-lg rounded-[2.5rem] shadow-2xl relative z-10 overflow-hidden flex flex-col max-h-[90vh]"
            >
               {/* Internal Content Wrapper for smooth rendering */}
               <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2, delay: 0.1 }}
                  className="flex flex-col h-full"
               >
                 {/* 1. Modal Header: Status Timeline */}
                 <div className="pt-8 pb-6 px-8 bg-white border-b border-slate-100 z-20">
                    <div className="flex items-center justify-between mb-8">
                       <div>
                          <h2 className="text-2xl font-black text-slate-900 mb-1 flex items-center gap-2">
                             سفارش {selectedOrder.id}
                             <span className="text-xs bg-slate-100 text-slate-500 px-2 py-1 rounded-md font-bold border border-slate-200">میز {selectedOrder.tableNumber}</span>
                          </h2>
                          <div className="flex items-center gap-2 text-xs font-bold text-slate-400">
                             <Calendar className="w-3.5 h-3.5" />
                             {selectedOrder.timestamp}
                             <span className="w-1 h-1 bg-slate-300 rounded-full" />
                             <User className="w-3.5 h-3.5" />
                             {selectedOrder.customerName || 'مشتری ناشناس'}
                          </div>
                       </div>
                       <button onClick={() => setSelectedOrder(null)} className="p-2 bg-slate-50 rounded-full hover:bg-slate-100 transition-colors border border-slate-200">
                          <X className="w-5 h-5 text-slate-500" />
                       </button>
                    </div>

                    {/* Timeline Stepper */}
                    <div className="flex items-center justify-between relative">
                       {/* Line */}
                       <div className="absolute top-1/2 left-0 right-0 h-1 bg-slate-100 -z-10 rounded-full"></div>
                       <div 
                          className={`absolute top-1/2 right-0 h-1 bg-emerald-500 -z-10 rounded-full transition-all duration-500`}
                          style={{ width: `${((getStatusStep(selectedOrder.status) - 1) / 3) * 100}%` }}
                       ></div>

                       {COLUMNS.map((col, idx) => {
                          const step = idx + 1;
                          const currentStep = getStatusStep(selectedOrder.status);
                          const isCompleted = step <= currentStep;
                          const isCurrent = step === currentStep;
                          
                          return (
                             <div key={col.id} className="flex flex-col items-center gap-2 bg-white px-2">
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${isCompleted ? 'bg-emerald-500 border-emerald-500 text-white' : 'bg-white border-slate-200 text-slate-300'}`}>
                                   {isCompleted ? <Check className="w-4 h-4" /> : <span className="text-xs font-black">{step}</span>}
                                </div>
                                <span className={`text-[10px] font-bold ${isCurrent ? 'text-emerald-600' : 'text-slate-400'}`}>{col.label}</span>
                             </div>
                          );
                       })}
                    </div>
                 </div>

                 {/* 2. Scrollable Ticket Content */}
                 <div className="flex-1 overflow-y-auto bg-slate-50 p-6 relative">
                    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden relative">
                       {/* Ticket Teeth Effect Top */}
                       <div className="absolute -top-1 left-0 right-0 h-2 bg-slate-50" style={{ clipPath: 'polygon(0% 0%, 5% 100%, 10% 0%, 15% 100%, 20% 0%, 25% 100%, 30% 0%, 35% 100%, 40% 0%, 45% 100%, 50% 0%, 55% 100%, 60% 0%, 65% 100%, 70% 0%, 75% 100%, 80% 0%, 85% 100%, 90% 0%, 95% 100%, 100% 0%)'}}></div>

                       <div className="p-6 pt-8 space-y-4">
                          {selectedOrder.items.map((item, i) => (
                             <div key={i} className="flex justify-between items-start py-3 border-b border-dashed border-slate-100 last:border-0 hover:bg-slate-50 transition-colors px-2 rounded-lg">
                                <div className="flex items-start gap-3">
                                   <div className="w-6 h-6 bg-slate-100 text-slate-600 rounded-md flex items-center justify-center text-xs font-black shrink-0 mt-0.5">1x</div>
                                   <div>
                                      <h4 className="font-bold text-slate-800 text-sm mb-1">{item}</h4>
                                      <span className="text-[10px] text-slate-400 block">بدون توضیحات اضافه</span>
                                   </div>
                                </div>
                                <span className="font-bold text-slate-800 text-sm">--</span>
                             </div>
                          ))}
                       </div>

                       {/* Notes Section */}
                       {selectedOrder.notes && (
                          <div className="mx-6 mb-6 p-4 bg-yellow-50 rounded-xl border border-yellow-100 flex gap-3">
                             <AlertCircle className="w-5 h-5 text-yellow-600 shrink-0" />
                             <div>
                                <h4 className="text-xs font-black text-yellow-700 mb-1">یادداشت آشپزخانه</h4>
                                <p className="text-xs text-yellow-800 font-medium leading-relaxed">{selectedOrder.notes}</p>
                             </div>
                          </div>
                       )}

                       {/* Total Section */}
                       <div className="bg-slate-900 p-6 text-white flex justify-between items-center relative overflow-hidden">
                          <div className="relative z-10">
                             <span className="text-slate-400 text-xs block mb-1">مبلغ قابل پرداخت</span>
                             <span className={`text-2xl font-black text-${brandColor}-400`}>{selectedOrder.totalPrice.toLocaleString()} <span className={`text-sm text-${brandColor}-400/70`}>تومان</span></span>
                          </div>
                          <div className="relative z-10">
                             <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
                                <FileText className="w-5 h-5 text-white" />
                             </div>
                          </div>
                          {/* Decorative Circles */}
                          <div className="absolute -right-4 -top-4 w-20 h-20 bg-white/5 rounded-full blur-xl"></div>
                          <div className={`absolute -left-4 -bottom-4 w-20 h-20 bg-${brandColor}-500/10 rounded-full blur-xl`}></div>
                       </div>
                    </div>
                 </div>

                 {/* 3. Footer Actions */}
                 <div className="p-6 bg-white border-t border-slate-200 shadow-[0_-5px_20px_rgba(0,0,0,0.02)]">
                     <div className="flex gap-4">
                        <button className="flex-1 py-3.5 border border-slate-200 text-slate-600 font-bold rounded-2xl hover:bg-slate-50 transition-colors text-sm">
                           چاپ فیش
                        </button>
                        
                        {selectedOrder.status === 'new' && (
                           <button 
                             onClick={() => { updateStatus(selectedOrder.id, 'preparing'); setSelectedOrder(null); }}
                             className={`flex-[2] bg-${brandColor}-600 text-white py-3.5 rounded-2xl font-bold hover:bg-${brandColor}-700 transition-colors shadow-lg shadow-${brandColor}-200 flex items-center justify-center gap-2 text-sm`}
                           >
                              <CookingPot className="w-4 h-4" />
                              تایید و شروع پخت
                           </button>
                        )}
                        {selectedOrder.status === 'preparing' && (
                           <button 
                             onClick={() => { updateStatus(selectedOrder.id, 'ready'); setSelectedOrder(null); }}
                             className="flex-[2] bg-orange-500 text-white py-3.5 rounded-2xl font-bold hover:bg-orange-600 transition-colors shadow-lg shadow-orange-200 flex items-center justify-center gap-2 text-sm"
                           >
                              <Check className="w-4 h-4" />
                              آماده تحویل
                           </button>
                        )}
                        {selectedOrder.status === 'ready' && (
                           <button 
                             onClick={() => { updateStatus(selectedOrder.id, 'delivered'); setSelectedOrder(null); }}
                             className="flex-[2] bg-slate-800 text-white py-3.5 rounded-2xl font-bold hover:bg-slate-900 transition-colors flex items-center justify-center gap-2 text-sm"
                           >
                              <Truck className="w-4 h-4" />
                              تحویل به مشتری
                           </button>
                        )}
                        {selectedOrder.status === 'delivered' && (
                           <button 
                              className="flex-[2] bg-slate-100 text-slate-400 py-3.5 rounded-2xl font-bold cursor-not-allowed text-sm flex items-center justify-center gap-2"
                              disabled
                           >
                              <Check className="w-4 h-4" />
                              تکمیل شده
                           </button>
                        )}
                     </div>
                 </div>
               </motion.div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default OrderBoard;
