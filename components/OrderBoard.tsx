import React, { useState } from 'react';
import { motion, AnimatePresence, LayoutGroup } from 'framer-motion';
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
  AlertCircle,
  Plus
} from 'lucide-react';
import { Order, OrderStatus } from '../types';
import { useOrders } from '../data/useRepositories';

// --- Mock Data ---
const INITIAL_ORDERS: Order[] = [
  { id: '#12890', tableNumber: 5, customerName: 'محمد رضایی', items: ['پیتزا پپرونی (متوسط)', 'کوکا کولا', 'سیب‌زمینی سرخ کرده'], notes: 'سیب‌زمینی بدون نمک باشد', totalPrice: 320000, status: 'new', timestamp: '2 دقیقه پیش' },
  { id: '#12891', tableNumber: 12, items: ['همبرگر ویژه', 'سالاد فصل'], totalPrice: 185000, status: 'new', timestamp: '5 دقیقه پیش' },
  { id: '#12888', tableNumber: 8, customerName: 'سارا احمدی', items: ['پیتزا سبزیجات', 'دلستر'], totalPrice: 240000, status: 'preparing', timestamp: '10 دقیقه پیش' },
  { id: '#12885', tableNumber: 2, items: ['جوجه کباب', 'برنج ایرانی'], totalPrice: 410000, status: 'ready', timestamp: '15 دقیقه پیش' },
  { id: '#12880', tableNumber: 1, items: ['سوپ جو'], totalPrice: 65000, status: 'delivered', timestamp: '1 ساعت پیش' },
];

const COLUMNS: { id: OrderStatus, label: string, color: string, bg: string, icon: any }[] = [
  { id: 'new', label: 'جدید', color: 'text-red-600 dark:text-red-400', bg: 'bg-red-50 dark:bg-red-950/20 border-red-100/50 dark:border-red-900/30', icon: <BellRing className="w-5 h-5" /> },
  { id: 'preparing', label: 'در حال پخت', color: 'text-orange-600 dark:text-orange-400', bg: 'bg-orange-50 dark:bg-orange-950/20 border-orange-100/50 dark:border-orange-900/30', icon: <CookingPot className="w-5 h-5" /> },
  { id: 'ready', label: 'آماده تحویل', color: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-50 dark:bg-emerald-950/20 border-emerald-100/50 dark:border-emerald-900/30', icon: <Check className="w-5 h-5" /> },
  { id: 'delivered', label: 'تحویل شده', color: 'text-slate-600 dark:text-slate-400', bg: 'bg-slate-100 dark:bg-slate-900 border-slate-200 dark:border-slate-800', icon: <Truck className="w-5 h-5" /> },
];

// Optimized Transition: High stiffness + High damping = Snappy but NO bounce
const SMOOTH_TRANSITION = {
  type: "spring" as const,
  stiffness: 450,
  damping: 38,
  mass: 1
};

interface OrderBoardProps {
  brandColor: string;
  highlightedItemId?: string | null;
  clearHighlight?: () => void;
}

const OrderBoard: React.FC<OrderBoardProps> = ({ brandColor, highlightedItemId, clearHighlight }) => {
  const { orders, loading, createOrder, updateOrderStatus } = useOrders();
  
  // Real-time Drag State for Design Studio Layer style
  const [draggedOrder, setDraggedOrder] = useState<Order | null>(null);
  const [dragCoords, setDragCoords] = useState({ x: 0, y: 0 });
  const [activeDropCol, setActiveDropCol] = useState<OrderStatus | null>(null);
  
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [localHighlight, setLocalHighlight] = useState<string | null>(null);

  React.useEffect(() => {
    if (highlightedItemId) {
      setLocalHighlight(highlightedItemId);
      const timer = setTimeout(() => {
        setLocalHighlight(null);
        if (clearHighlight) clearHighlight();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [highlightedItemId, clearHighlight]);

  React.useEffect(() => {
    const handleWindowDragOver = (e: DragEvent) => {
      if (draggedOrder) {
        setDragCoords({ x: e.clientX, y: e.clientY });
      }
    };
    if (draggedOrder) {
      window.addEventListener('dragover', handleWindowDragOver);
    }
    return () => {
      window.removeEventListener('dragover', handleWindowDragOver);
    };
  }, [draggedOrder]);
  
  // New Order Modal State
  const [isNewOrderModalOpen, setIsNewOrderModalOpen] = useState(false);
  const [newOrderData, setNewOrderData] = useState({
    tableNumber: '',
    customerName: '',
    items: '',
    totalPrice: '',
    notes: ''
  });

  const updateStatus = async (id: string, newStatus: OrderStatus) => {
    try {
      await updateOrderStatus(id, newStatus);
    } catch (e) {
      console.error('Error updating order status:', e);
    }
    setActiveDropdown(null);
  };

  // Drag handlers
  const handleDragStart = (e: React.DragEvent, order: Order) => {
    setDraggedOrder(order);
    
    // Set transparent 1x1 GIF as the drag image to hide the browser's default ghost preview
    const img = new Image();
    img.src = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';
    if (e.dataTransfer) {
      e.dataTransfer.setDragImage(img, 0, 0);
      e.dataTransfer.effectAllowed = 'move';
    }
    
    setDragCoords({ x: e.clientX, y: e.clientY });
  };

  const handleDrag = (e: React.DragEvent) => {
    // Handled by window dragover listener for ultimate smoothness
  };

  const handleDragOverCol = (e: React.DragEvent, colId: OrderStatus) => {
    e.preventDefault();
    if (activeDropCol !== colId) {
      setActiveDropCol(colId);
    }
    if (e.clientX !== 0 && e.clientY !== 0) {
      setDragCoords({ x: e.clientX, y: e.clientY });
    }
  };

  const handleDrop = (status: OrderStatus) => {
    if (draggedOrder && draggedOrder.status !== status) {
      updateStatus(draggedOrder.id, status);
    }
    setDraggedOrder(null);
    setActiveDropCol(null);
  };

  const handleDragEnd = () => {
    setDraggedOrder(null);
    setActiveDropCol(null);
  };

  const handleCreateOrder = async () => {
    if (!newOrderData.tableNumber || !newOrderData.items || !newOrderData.totalPrice) return;

    const newOrder: Order = {
      id: `#${Math.floor(10000 + Math.random() * 90000)}`,
      tableNumber: parseInt(newOrderData.tableNumber),
      customerName: newOrderData.customerName,
      items: newOrderData.items.split(/[،,]/).map(i => i.trim()).filter(i => i),
      totalPrice: parseInt(newOrderData.totalPrice.replace(/,/g, '')),
      notes: newOrderData.notes,
      status: 'new',
      timestamp: 'هم‌اکنون'
    };

    try {
      await createOrder(newOrder);
    } catch (e) {
      console.error('Error creating order:', e);
    }
    setIsNewOrderModalOpen(false);
    setNewOrderData({ tableNumber: '', customerName: '', items: '', totalPrice: '', notes: '' });
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

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full w-full bg-slate-50 dark:bg-slate-950 font-['Vazirmatn']" dir="rtl">
        <div className="flex flex-col items-center gap-4">
          <div className={`w-12 h-12 rounded-full border-4 border-slate-200 border-t-${brandColor}-500 animate-spin`} />
          <p className="text-sm text-slate-400 font-medium">در حال بارگذاری اطلاعات...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-slate-50 dark:bg-slate-950 font-['Vazirmatn'] relative transition-colors duration-300" onClick={() => setActiveDropdown(null)}>
      
      {/* Header */}
      <div className="p-6 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-center justify-between shrink-0 z-20 shadow-sm relative transition-colors duration-300">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-slate-100 flex items-center gap-3">
            <Utensils className={`w-6 h-6 text-${brandColor}-600 dark:text-${brandColor}-400`} />
            مدیریت سفارشات
          </h1>
          <p className="text-sm text-slate-400 dark:text-slate-500 mt-1">مانیتورینگ زنده وضعیت سفارشات رستوران</p>
        </div>
        <div className="flex gap-4">
           <div className="flex -space-x-2 space-x-reverse px-2">
              {orders.slice(0, 3).map((_, i) => (
                 <div key={i} className="w-9 h-9 rounded-full bg-slate-100 dark:bg-slate-800 border-2 border-white dark:border-slate-900 flex items-center justify-center text-[10px] font-bold text-slate-500 shadow-sm transition-colors">
                    <User className="w-4 h-4 text-slate-400" />
                 </div>
              ))}
              <div className="w-9 h-9 rounded-full bg-slate-900 dark:bg-slate-800 text-white dark:text-slate-300 border-2 border-white dark:border-slate-900 flex items-center justify-center text-[10px] font-bold shadow-sm transition-colors">
                 +{orders.length}
              </div>
           </div>
           <button 
             onClick={() => setIsNewOrderModalOpen(true)}
             className={`px-5 py-2.5 bg-${brandColor}-600 text-white rounded-xl text-sm font-bold shadow-lg shadow-${brandColor}-200 dark:shadow-none hover:bg-${brandColor}-700 transition-all active:scale-95 flex items-center gap-2`}
            >
               <Plus className="w-4 h-4" />
               ثبت سفارش جدید
            </button>
         </div>
       </div>

       {/* Board Columns */}
      <LayoutGroup>
        <div className="flex-1 overflow-x-auto p-6 flex gap-6 scrollbar-hide">
          {COLUMNS.map((col) => {
            const isOver = activeDropCol === col.id;
            const colOrders = orders.filter((o) => o.status === col.id);
            
            return (
              <div 
                key={col.id} 
                className={`min-w-[320px] flex-1 flex flex-col h-full rounded-[2rem] p-3 border-2 transition-all duration-300 ${
                  isOver 
                    ? `bg-${brandColor}-50/30 dark:bg-${brandColor}-950/10 border-dashed border-${brandColor}-400/60 dark:border-${brandColor}-800/80 shadow-xl shadow-${brandColor}-500/5` 
                    : 'border-transparent bg-transparent'
                }`}
                onDragOver={(e) => handleDragOverCol(e, col.id)}
                onDragLeave={() => setActiveDropCol(null)}
                onDrop={() => handleDrop(col.id)}
              >
                {/* Column Header */}
                <div className={`flex items-center justify-between p-4 rounded-2xl mb-4 ${col.bg} border transition-colors duration-300`}>
                  <div className="flex items-center gap-3">
                    <div className={`p-2.5 rounded-xl bg-white dark:bg-slate-900 shadow-sm ${col.color} transition-colors duration-300`}>
                      {col.icon}
                    </div>
                    <div>
                       <h3 className={`font-black ${col.color} text-sm`}>{col.label}</h3>
                       <span className="text-[11px] font-bold opacity-70 text-slate-600 dark:text-slate-400">
                          {colOrders.length} سفارش فعال
                       </span>
                    </div>
                  </div>
                  {col.id === 'new' && colOrders.length > 0 && (
                     <div className="flex h-3 w-3 relative">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                     </div>
                  )}
                </div>

                {/* Drop Zone */}
                <div className="flex-1 overflow-y-auto pb-20 space-y-3 px-1 scrollbar-hide">
                  <AnimatePresence mode="popLayout">
                    {colOrders.map((order) => {
                      const isDragging = draggedOrder?.id === order.id;

                      return (
                        <motion.div
                          key={`${order.id}-${order.status}`}
                          layout="position"
                          transition={SMOOTH_TRANSITION}
                          initial={{ opacity: 0, scale: 0.85, rotate: -3 }}
                          animate={{ 
                            opacity: isDragging ? 0.25 : 1, 
                            scale: isDragging ? 0.85 : 1,
                            rotate: isDragging ? -3 : 0
                          }}
                          exit={{ opacity: 0, scale: 0.85, rotate: -3, transition: { duration: 0.1 } }}
                          draggable
                          onDragStart={(e) => handleDragStart(e, order)}
                          onDrag={handleDrag}
                          onDragEnd={handleDragEnd}
                          onClick={(e) => {
                             if ((e.target as HTMLElement).closest('.action-btn')) return;
                             setSelectedOrder(order);
                          }}
                          className={`bg-white dark:bg-slate-900 p-5 rounded-2xl cursor-grab active:cursor-grabbing group relative select-none border transition-colors duration-200 ${
                            (localHighlight === order.id || (localHighlight && order.id.includes(localHighlight)) || (localHighlight && localHighlight.includes(order.id)))
                              ? `border-2 border-${brandColor}-500 ring-4 ring-${brandColor}-500/40 scale-[1.03] z-10`
                              : `border-slate-100 dark:border-slate-800/80 shadow-sm hover:shadow-xl hover:shadow-${brandColor}-500/5 hover:border-${brandColor}-200 dark:hover:border-${brandColor}-800/60`
                          }`}
                        >
                          {/* Card Content */}
                          <div className="flex items-start justify-between mb-4">
                             <div className="flex items-center gap-2">
                                <span className="bg-slate-900 dark:bg-slate-800 text-white dark:text-slate-200 px-2.5 py-1.5 rounded-lg text-[10px] font-black tracking-wide transition-colors">
                                   میز {order.tableNumber}
                                </span>
                                {order.status === 'new' && (
                                   <span className="bg-red-50 dark:bg-red-950/30 text-red-600 dark:text-red-400 px-2.5 py-1.5 rounded-lg text-[10px] font-bold flex items-center gap-1.5 border border-red-100 dark:border-red-900/30">
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
                                   className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300 transition-colors"
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
                                        className="absolute left-0 top-full mt-2 w-44 bg-white dark:bg-slate-900 rounded-xl shadow-xl border border-slate-100 dark:border-slate-800 z-50 overflow-hidden"
                                     >
                                        {COLUMNS.filter(c => c.id !== order.status).map(c => (
                                           <button
                                              key={c.id}
                                              onClick={(e) => {
                                                 e.stopPropagation();
                                                 updateStatus(order.id, c.id);
                                              }}
                                              className={`w-full text-right px-4 py-3 text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-${brandColor}-600 dark:hover:text-${brandColor}-400 transition-colors flex items-center gap-3 border-b border-slate-50 dark:border-slate-800/50 last:border-0`}
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
                                <h4 className="font-black text-slate-800 dark:text-slate-100 text-sm">{order.id}</h4>
                                {order.customerName && <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 flex items-center gap-1"><User className="w-3 h-3" /> {order.customerName}</span>}
                             </div>
                             <div className="text-xs font-medium text-slate-500 dark:text-slate-400 leading-6 bg-slate-50 dark:bg-slate-950/50 p-2 rounded-lg border border-slate-100 dark:border-slate-800/40">
                                {order.items.join('، ')}
                             </div>
                          </div>

                          <div className="flex items-center justify-between pt-3 border-t border-slate-50 dark:border-slate-800/60">
                             <div className="flex flex-col">
                                <span className="text-[10px] text-slate-400 dark:text-slate-500 font-bold mb-0.5">مبلغ کل</span>
                                <span className={`text-sm font-black text-${brandColor}-600 dark:text-${brandColor}-400`}>{order.totalPrice.toLocaleString()} <span className="text-[10px] font-medium text-slate-400 dark:text-slate-500">تومان</span></span>
                             </div>
                             <div className="text-[10px] font-bold text-slate-400 dark:text-slate-500 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 px-2 py-1 rounded-lg shadow-sm transition-colors">
                                {order.timestamp}
                             </div>
                          </div>
                        </motion.div>
                      );
                    })}
                  </AnimatePresence>
                  
                  {/* Empty State */}
                  {colOrders.length === 0 && (
                     <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="h-32 border-2 border-dashed border-slate-200 dark:border-slate-800/80 rounded-3xl flex flex-col gap-2 items-center justify-center text-slate-300 dark:text-slate-700 bg-slate-50/50 dark:bg-slate-900/10 transition-colors"
                     >
                        <div className="p-3 bg-white dark:bg-slate-900 rounded-full shadow-sm">
                           {col.icon}
                        </div>
                        <span className="text-xs font-bold text-slate-400 dark:text-slate-500">بدون سفارش</span>
                     </motion.div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </LayoutGroup>

      {/* --- DESIGN STUDIO FLOATING GLASS CARD PREVIEW --- */}
      <AnimatePresence>
        {draggedOrder && (
          <motion.div
            style={{
              position: 'fixed',
              left: 0,
              top: 0,
              x: dragCoords.x,
              y: dragCoords.y,
              translateX: '-50%',
              translateY: '-50%',
              pointerEvents: 'none',
              zIndex: 1000,
              width: 220,
            }}
            initial={{ scale: 0.85, opacity: 0, rotate: 0 }}
            animate={{ scale: 1, opacity: 0.95, rotate: -3 }}
            exit={{ scale: 0.85, opacity: 0 }}
            transition={{ type: "spring", stiffness: 450, damping: 28 }}
            className="bg-white/75 dark:bg-slate-900/75 backdrop-blur-md p-3.5 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.15)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.5)] border border-white/20 dark:border-slate-800/60 text-right pointer-events-none select-none"
          >
            <div className="flex items-center justify-between gap-2 mb-2">
              <span className="bg-slate-900 dark:bg-slate-800 text-white dark:text-slate-200 px-2 py-1 rounded-md text-[9px] font-black tracking-wide">
                میز {draggedOrder.tableNumber}
              </span>
              <h4 className="font-black text-slate-800 dark:text-slate-100 text-[11px]">{draggedOrder.id}</h4>
            </div>
            
            <div className="flex items-center justify-between text-[10px] text-slate-500 dark:text-slate-400 font-bold border-t border-slate-100 dark:border-slate-800/60 pt-2 mt-2">
              <span>{draggedOrder.items.length} قلم کالا</span>
              <span className={`font-black text-${brandColor}-600 dark:text-${brandColor}-400`}>
                {draggedOrder.totalPrice.toLocaleString()} تومان
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* --- NEW ORDER MODAL --- */}
      <AnimatePresence>
        {isNewOrderModalOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] flex items-center justify-center p-4"
          >
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsNewOrderModalOpen(false)}
              className="fixed inset-0 bg-slate-950/80 backdrop-blur-xl"
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              className="bg-white dark:bg-slate-900 w-full max-w-lg rounded-[2rem] shadow-2xl relative z-10 p-8 border border-slate-100 dark:border-slate-800"
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-black text-slate-800 dark:text-slate-100 flex items-center gap-2">
                   <Plus className={`w-6 h-6 text-${brandColor}-600 dark:text-${brandColor}-400`} />
                   ثبت سفارش جدید
                </h2>
                <button 
                  onClick={() => setIsNewOrderModalOpen(false)}
                  className="p-2 bg-slate-50 dark:bg-slate-850 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-slate-500 dark:text-slate-400"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                   <div className="space-y-2">
                     <label className="text-xs font-bold text-slate-500 dark:text-slate-400">شماره میز</label>
                     <input 
                       type="number" 
                       value={newOrderData.tableNumber}
                       onChange={(e) => setNewOrderData({ ...newOrderData, tableNumber: e.target.value })}
                       className={`w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded-xl px-4 py-3 text-sm text-slate-800 dark:text-slate-100 focus:border-${brandColor}-500 outline-none`}
                       placeholder="شماره میز"
                     />
                   </div>
                   <div className="space-y-2">
                     <label className="text-xs font-bold text-slate-500 dark:text-slate-400">نام مشتری (اختیاری)</label>
                     <input 
                       type="text" 
                       value={newOrderData.customerName}
                       onChange={(e) => setNewOrderData({ ...newOrderData, customerName: e.target.value })}
                       className={`w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded-xl px-4 py-3 text-sm text-slate-800 dark:text-slate-100 focus:border-${brandColor}-500 outline-none`}
                       placeholder="نام مشتری"
                     />
                   </div>
                </div>
                
                <div className="space-y-2">
                   <label className="text-xs font-bold text-slate-500 dark:text-slate-400">اقلام سفارش</label>
                   <textarea 
                     value={newOrderData.items}
                     onChange={(e) => setNewOrderData({ ...newOrderData, items: e.target.value })}
                     className={`w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded-xl px-4 py-3 text-sm text-slate-800 dark:text-slate-100 focus:border-${brandColor}-500 outline-none min-h-[80px]`}
                     placeholder="مثال: پیتزا پپرونی، نوشابه، سالاد سزار (با کاما جدا کنید)"
                   />
                   <p className="text-[10px] text-slate-400 dark:text-slate-500">اقلام را با کاما (،) از هم جدا کنید</p>
                </div>

                <div className="space-y-2">
                   <label className="text-xs font-bold text-slate-500 dark:text-slate-400">مبلغ کل (تومان)</label>
                   <input 
                     type="text" 
                     value={newOrderData.totalPrice}
                     onChange={(e) => setNewOrderData({ ...newOrderData, totalPrice: e.target.value })}
                     className={`w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded-xl px-4 py-3 text-sm text-slate-800 dark:text-slate-100 focus:border-${brandColor}-500 outline-none dir-ltr`}
                     placeholder="0"
                   />
                </div>

                <div className="space-y-2">
                   <label className="text-xs font-bold text-slate-500 dark:text-slate-400">یادداشت آشپزخانه (اختیاری)</label>
                   <textarea 
                     value={newOrderData.notes}
                     onChange={(e) => setNewOrderData({ ...newOrderData, notes: e.target.value })}
                     className={`w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded-xl px-4 py-3 text-sm text-slate-800 dark:text-slate-100 focus:border-${brandColor}-500 outline-none min-h-[60px]`}
                     placeholder="توضیحات اضافی برای آشپزخانه..."
                   />
                </div>

                <button 
                  onClick={handleCreateOrder}
                  className={`w-full py-3.5 bg-${brandColor}-600 text-white rounded-xl font-bold text-sm shadow-lg shadow-${brandColor}-200 dark:shadow-none hover:bg-${brandColor}-700 transition-all active:scale-95 mt-4`}
                >
                  ثبت سفارش
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* --- REIMAGINED ORDER DETAILS MODAL --- */}
      <AnimatePresence>
        {selectedOrder && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] flex items-center justify-center p-4"
          >
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedOrder(null)}
              className="fixed inset-0 bg-slate-950/80 backdrop-blur-xl"
            />
            <motion.div 
               initial={{ scale: 0.95, opacity: 0, y: 15 }}
               animate={{ scale: 1, opacity: 1, y: 0 }}
               exit={{ scale: 0.95, opacity: 0, y: 15 }}
               transition={{ type: "spring", stiffness: 350, damping: 28 }}
               className="bg-white dark:bg-slate-900 w-full max-w-lg rounded-[2.5rem] shadow-2xl relative z-10 overflow-hidden flex flex-col max-h-[90vh] border border-slate-100 dark:border-slate-800"
            >
               {/* Internal Content Wrapper for smooth rendering */}
               <div className="flex flex-col h-full">
                 {/* 1. Modal Header: Status Timeline */}
                 <div className="pt-8 pb-6 px-8 bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800 z-20">
                    <div className="flex items-center justify-between mb-8">
                       <div>
                          <h2 className="text-2xl font-black text-slate-900 dark:text-slate-100 mb-1 flex items-center gap-2">
                             سفارش {selectedOrder.id}
                             <span className="text-xs bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 px-2 py-1 rounded-md font-bold border border-slate-200 dark:border-slate-700">میز {selectedOrder.tableNumber}</span>
                          </h2>
                          <div className="flex items-center gap-2 text-xs font-bold text-slate-400 dark:text-slate-500">
                             <Calendar className="w-3.5 h-3.5" />
                             {selectedOrder.timestamp}
                             <span className="w-1 h-1 bg-slate-300 dark:bg-slate-700 rounded-full" />
                             <User className="w-3.5 h-3.5" />
                             {selectedOrder.customerName || 'مشتری ناشناس'}
                          </div>
                       </div>
                       <button onClick={() => setSelectedOrder(null)} className="p-2 bg-slate-50 dark:bg-slate-850 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors border border-slate-200 dark:border-slate-700">
                          <X className="w-5 h-5 text-slate-500 dark:text-slate-400" />
                       </button>
                    </div>

                    {/* Timeline Stepper */}
                    <div className="flex items-center justify-between relative">
                       {/* Line */}
                       <div className="absolute top-1/2 left-0 right-0 h-1 bg-slate-100 dark:bg-slate-800 -z-10 rounded-full"></div>
                       <div 
                          className="absolute top-1/2 right-0 h-1 bg-emerald-500 -z-10 rounded-full transition-all duration-500"
                          style={{ width: `${((getStatusStep(selectedOrder.status) - 1) / 3) * 100}%` }}
                       ></div>

                       {COLUMNS.map((col, idx) => {
                          const step = idx + 1;
                          const currentStep = getStatusStep(selectedOrder.status);
                          const isCompleted = step <= currentStep;
                          const isCurrent = step === currentStep;
                          
                          return (
                             <div key={col.id} className="flex flex-col items-center gap-2 bg-white dark:bg-slate-900 px-2">
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${isCompleted ? 'bg-emerald-500 border-emerald-500 text-white' : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-300 dark:text-slate-600'}`}>
                                   {isCompleted ? <Check className="w-4 h-4" /> : <span className="text-xs font-black">{step}</span>}
                                </div>
                                <span className={`text-[10px] font-bold ${isCurrent ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-400 dark:text-slate-500'}`}>{col.label}</span>
                             </div>
                          );
                       })}
                    </div>
                 </div>

                 {/* 2. Scrollable Ticket Content */}
                 <div className="flex-1 overflow-y-auto bg-slate-50 dark:bg-slate-950 p-6 relative">
                    <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden relative">
                       {/* Ticket Teeth Effect Top */}
                       <div className="absolute -top-1 left-0 right-0 h-2 bg-slate-50 dark:bg-slate-950" style={{ clipPath: 'polygon(0% 0%, 5% 100%, 10% 0%, 15% 100%, 20% 0%, 25% 100%, 30% 0%, 35% 100%, 40% 0%, 45% 100%, 50% 0%, 55% 100%, 60% 0%, 65% 100%, 70% 0%, 75% 100%, 80% 0%, 85% 100%, 90% 0%, 95% 100%, 100% 0%)'}}></div>

                       <div className="p-6 pt-8 space-y-4">
                          {selectedOrder.items.map((item, i) => (
                             <div key={i} className="flex justify-between items-start py-3 border-b border-dashed border-slate-100 dark:border-slate-800 last:border-0 hover:bg-slate-50 dark:hover:bg-slate-850/50 transition-colors px-2 rounded-lg">
                                <div className="flex items-start gap-3">
                                   <div className="w-6 h-6 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-md flex items-center justify-center text-xs font-black shrink-0 mt-0.5">1x</div>
                                   <div>
                                      <h4 className="font-bold text-slate-800 dark:text-slate-100 text-sm mb-1">{item}</h4>
                                      <span className="text-[10px] text-slate-400 dark:text-slate-500 block">بدون توضیحات اضافه</span>
                                   </div>
                                </div>
                                <span className="font-bold text-slate-850 dark:text-slate-300 text-sm">--</span>
                             </div>
                          ))}
                       </div>

                       {/* Notes Section */}
                       {selectedOrder.notes && (
                          <div className="mx-6 mb-6 p-4 bg-yellow-50 dark:bg-yellow-950/20 border border-yellow-100 dark:border-yellow-900/30 rounded-xl flex gap-3">
                             <AlertCircle className="w-5 h-5 text-yellow-600 dark:text-yellow-400 shrink-0" />
                             <div>
                                <h4 className="text-xs font-black text-yellow-700 dark:text-yellow-400 mb-1">یادداشت آشپزخانه</h4>
                                <p className="text-xs text-yellow-800 dark:text-yellow-300 font-medium leading-relaxed">{selectedOrder.notes}</p>
                             </div>
                          </div>
                       )}

                       {/* Total Section */}
                       <div className="bg-slate-900 dark:bg-slate-950 p-6 text-white flex justify-between items-center relative overflow-hidden">
                          <div className="relative z-10">
                             <span className="text-slate-400 dark:text-slate-500 text-xs block mb-1">مبلغ قابل پرداخت</span>
                             <span className={`text-2xl font-black text-${brandColor}-400`}>{selectedOrder.totalPrice.toLocaleString()} <span className={`text-sm text-${brandColor}-400/70`}>تومان</span></span>
                          </div>
                          <div className="relative z-10">
                             <div className="w-10 h-10 rounded-full bg-white/10 dark:bg-slate-800 flex items-center justify-center">
                                <FileText className="w-5 h-5 text-white dark:text-slate-300" />
                             </div>
                          </div>
                          {/* Decorative Circles */}
                          <div className="absolute -right-4 -top-4 w-20 h-20 bg-white/5 rounded-full blur-xl"></div>
                          <div className={`absolute -left-4 -bottom-4 w-20 h-20 bg-${brandColor}-500/10 rounded-full blur-xl`}></div>
                       </div>
                    </div>
                 </div>

                 {/* 3. Footer Actions */}
                 <div className="p-6 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 shadow-[0_-5px_20px_rgba(0,0,0,0.02)]">
                     <div className="flex gap-4">
                        <button className="flex-1 py-3.5 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 font-bold rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-850 transition-colors text-sm">
                           چاپ فیش
                        </button>
                        
                        {selectedOrder.status === 'new' && (
                           <button 
                             onClick={() => { updateStatus(selectedOrder.id, 'preparing'); setSelectedOrder(null); }}
                             className={`flex-[2] bg-${brandColor}-600 text-white py-3.5 rounded-2xl font-bold hover:bg-${brandColor}-700 transition-colors shadow-lg shadow-${brandColor}-200 dark:shadow-none flex items-center justify-center gap-2 text-sm`}
                           >
                              <CookingPot className="w-4 h-4" />
                              تایید و شروع پخت
                           </button>
                        )}
                        {selectedOrder.status === 'preparing' && (
                           <button 
                             onClick={() => { updateStatus(selectedOrder.id, 'ready'); setSelectedOrder(null); }}
                             className="flex-[2] bg-orange-500 text-white py-3.5 rounded-2xl font-bold hover:bg-orange-600 transition-colors shadow-lg shadow-orange-200 dark:shadow-none flex items-center justify-center gap-2 text-sm"
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
                              className="flex-[2] bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-600 py-3.5 rounded-2xl font-bold cursor-not-allowed text-sm flex items-center justify-center gap-2"
                              disabled
                           >
                              <Check className="w-4 h-4" />
                              تکمیل شده
                           </button>
                        )}
                     </div>
                 </div>
               </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default OrderBoard;
