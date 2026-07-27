import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Trash2, Minus, Plus, Check } from 'lucide-react';
import { Product } from '../../types';
import { useOrders, useCustomerContext } from '../../data/useRepositories';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cart: any[];
  products: Product[];
  onRemoveItem: (idOrProduct: any, selectedModifiers?: any) => void;
  onUpdateQty: (idOrProduct: any, modifiers: any, newQty: number) => void;
  brandColor: string;
  mode: 'edit' | 'live';
  device?: 'mobile' | 'tablet';
  onOrderPlaced?: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  cart,
  products,
  onRemoveItem,
  onUpdateQty,
  brandColor,
  mode,
  device = 'mobile',
  onOrderPlaced,
}) => {
  const isMobile = device === 'mobile';
  const isEdit = mode === 'edit';

  const { context } = useCustomerContext();
  const { createOrder } = useOrders();

  // Checkout Fields
  const [tableNumber, setTableNumber] = useState('5');
  const [customerName, setCustomerName] = useState('');
  const [notes, setNotes] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [placedOrderId, setPlacedOrderId] = useState('');
  const [finalTotal, setFinalTotal] = useState(0);

  useEffect(() => {
    if (context) {
      if (context.table) setTableNumber(context.table);
      if (context.name) setCustomerName(context.name);
    }
  }, [context]);

  useEffect(() => {
    if (isOpen) {
      setIsSuccess(false);
    }
  }, [isOpen]);

  const getProductBasePrice = (p: Product) => {
    if (!p) return 0;
    const price = p.price || 0;
    if (p.discountPrice !== undefined && p.discountPrice !== null && p.discountPrice > 0 && p.discountPrice < price) {
      return p.discountPrice;
    }
    return price;
  };

  const cartTotal = (cart || []).reduce((acc, item) => {
    if (item.product) {
      const singlePrice = item.singlePrice || getProductBasePrice(item.product) || 0;
      return acc + singlePrice * (item.qty || 0);
    }
    const p = products && Array.isArray(products) ? products.find((prod) => prod.id === item.id) : null;
    const basePrice = p ? getProductBasePrice(p) : 0;
    return acc + basePrice * (item.qty || 0);
  }, 0);

  const cartCount = cart.reduce((acc, item) => acc + item.qty, 0);

  const handlePlaceOrder = async () => {
    if (isEdit) {
      // Simple simulation for Studio
      setPlacedOrderId(`#${Math.floor(10000 + Math.random() * 90000)}`);
      setFinalTotal(cartTotal);
      setIsSuccess(true);
      if (onOrderPlaced) onOrderPlaced();
      return;
    }

    if (!tableNumber) return;

    const orderId = `#${Math.floor(10000 + Math.random() * 90000)}`;
    const tableNum = parseInt(tableNumber) || 5;

    const newOrder = {
      id: orderId,
      tableNumber: tableNum,
      customerName: customerName.trim() || `مشتری میز ${tableNum}`,
      items: cart.map((item: any) => {
        const modNames: string[] = [];
        if (item.selectedModifiers) {
          Object.entries(item.selectedModifiers).forEach(([groupId, optId]: any) => {
            if (groupId === 'mock-bread') {
              const optIdx = parseInt(optId.split('-')[1]);
              const names = ['نان سفید', 'نان جو', 'نان سیر'];
              if (names[optIdx]) modNames.push(names[optIdx]);
            } else if (item.product.modifiers) {
              const group = item.product.modifiers.find((g: any) => g.id === groupId);
              const opt = group?.options.find((o: any) => o.id === optId);
              if (opt) modNames.push(opt.name);
            }
          });
        }
        const modifierText = modNames.length > 0 ? ` (${modNames.join('، ')})` : '';
        return `${item.product.name}${modifierText} x${item.qty}`;
      }),
      notes: notes.trim() || undefined,
      totalPrice: cartTotal,
      status: 'new' as const,
      timestamp: 'هم‌اکنون',
    };

    try {
      await createOrder(newOrder);
    } catch (e) {
      console.error('Error placing order:', e);
    }

    setPlacedOrderId(orderId);
    setFinalTotal(cartTotal);
    setIsSuccess(true);
    if (onOrderPlaced) onOrderPlaced();
  };

  const handleUpdateQty = (item: any, newQty: number) => {
    if (isEdit) {
      onUpdateQty(item.id, null, newQty);
    } else {
      onUpdateQty(item.product, item.selectedModifiers, newQty);
    }
  };

  const handleRemoveItem = (item: any) => {
    if (isEdit) {
      onRemoveItem(item.id);
    } else {
      onRemoveItem(item.product, item.selectedModifiers);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[200] flex justify-end items-end md:items-stretch"
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-950/85 backdrop-blur-md"
          />
          <motion.div
            initial={isMobile ? { y: '100%' } : { x: '100%' }}
            animate={isMobile ? { y: 0 } : { x: 0 }}
            exit={isMobile ? { y: '100%' } : { x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className={`fixed z-10 bg-white dark:bg-slate-950 shadow-2xl flex flex-col transition-colors duration-300 ${
              isMobile
                ? 'bottom-0 left-0 right-0 rounded-t-[2.5rem] h-[85vh] max-w-md mx-auto border-t border-slate-100 dark:border-slate-850'
                : 'top-0 right-0 bottom-0 w-[400px] border-l border-slate-100 dark:border-slate-850'
            }`}
          >
            {isSuccess ? (
              <div className="flex-1 flex flex-col items-center justify-center p-8 text-center bg-white dark:bg-slate-950 font-['Vazirmatn'] transition-colors" dir="rtl">
                <motion.div
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ type: 'spring', damping: 15 }}
                  className={`w-20 h-20 bg-${brandColor}-50 dark:bg-${brandColor}-950/20 border border-${brandColor}-200 dark:border-${brandColor}-800/50 text-${brandColor}-600 dark:text-${brandColor}-400 rounded-full flex items-center justify-center mb-6`}
                >
                  <Check className="w-10 h-10 stroke-[3]" />
                </motion.div>
                <h2 className="text-2xl font-black text-slate-900 dark:text-slate-100 mb-2">
                  سفارش شما ثبت شد!
                </h2>
                <p className="text-sm text-slate-500 dark:text-slate-400 mb-6 font-medium">
                  سفارش {placedOrderId} با موفقیت دریافت گردید و در حال آماده‌سازی است.
                </p>

                <div className="bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl p-4 w-full mb-8 transition-colors">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-xs text-slate-400 dark:text-slate-500 font-bold">شماره میز</span>
                    <span className="text-sm font-black text-slate-800 dark:text-slate-200">
                      میز {tableNumber}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-slate-400 dark:text-slate-500 font-bold">
                      مجموع پرداختی
                    </span>
                    <span className="text-sm font-black text-slate-800 dark:text-slate-200">
                      {finalTotal.toLocaleString()} تومان
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => {
                    setIsSuccess(false);
                    setCustomerName('');
                    setNotes('');
                    onClose();
                  }}
                  className={`w-full py-4 bg-${brandColor}-600 hover:bg-${brandColor}-700 text-white rounded-2xl font-black text-sm shadow-lg shadow-${brandColor}-500/20 transition-all cursor-pointer`}
                >
                  بازگشت به منو
                </button>
              </div>
            ) : (
              <div className="flex-1 flex flex-col overflow-hidden text-right" dir="rtl">
                {/* Header */}
                <div className="p-6 border-b border-slate-100 dark:border-slate-850 flex items-center justify-between shrink-0 bg-white dark:bg-slate-900 transition-colors">
                  <h2 className="text-lg font-black text-slate-900 dark:text-slate-100">
                    سبد خرید و پرداخت
                  </h2>
                  <button
                    onClick={onClose}
                    className="p-1.5 bg-slate-100 dark:bg-slate-800 rounded-full text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Body Content */}
                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                  {/* Cart Items list */}
                  <div className="space-y-3">
                    <h3 className="text-xs font-bold text-slate-400">
                      آیتم‌های سفارش داده شده
                    </h3>
                    {cart.map((item: any, idx: number) => {
                      const product = isEdit
                        ? products.find((p) => p.id === item.id)
                        : item.product;

                      if (!product) return null;

                      const modNames: string[] = [];
                      if (item.selectedModifiers) {
                        Object.entries(item.selectedModifiers).forEach(
                          ([groupId, optId]: any) => {
                            if (groupId === 'mock-bread') {
                              const optIdx = parseInt(optId.split('-')[1]);
                              const names = ['نان سفید', 'نان جو', 'نان سیر'];
                              if (names[optIdx]) modNames.push(names[optIdx]);
                            } else if (product.modifiers) {
                              const group = product.modifiers.find(
                                (g: any) => g.id === groupId
                              );
                              const opt = group?.options.find((o: any) => o.id === optId);
                              if (opt) modNames.push(opt.name);
                            }
                          }
                        );
                      }
                      const singlePrice = isEdit
                        ? getProductBasePrice(product)
                        : item.singlePrice || getProductBasePrice(product);

                      return (
                        <div
                          key={idx}
                          className="flex gap-4 p-3 bg-slate-50 dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 text-right transition-colors"
                        >
                          <img
                            src={product.image || undefined}
                            className="w-16 h-16 object-cover rounded-xl shrink-0 bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-800"
                            alt=""
                          />
                          <div className="flex-1 flex flex-col justify-center min-w-0 pr-1">
                            <div className="flex justify-between items-start">
                              <h4 className="text-xs font-black text-slate-800 dark:text-slate-200 line-clamp-1">
                                {product.name}
                              </h4>
                              <button
                                onClick={() => handleRemoveItem(item)}
                                className="text-slate-400 dark:text-slate-500 hover:text-red-500 dark:hover:text-red-400 mr-2 shrink-0 transition-colors"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                            {modNames.length > 0 && (
                              <span className="text-[10px] text-slate-400 dark:text-slate-500 mt-0.5 font-bold line-clamp-1">
                                {modNames.join('، ')}
                              </span>
                            )}
                            <span className="text-xs font-black text-slate-900 dark:text-slate-100 mt-1">
                              {(singlePrice * item.qty).toLocaleString()} تومان
                            </span>
                          </div>
                          <div className="flex items-center gap-2 bg-white dark:bg-slate-950 px-2.5 py-1.5 rounded-xl border border-slate-100 dark:border-slate-800 self-center transition-colors">
                            <button
                              onClick={() => handleUpdateQty(item, Math.max(1, item.qty - 1))}
                              className="p-0.5 hover:bg-slate-50 dark:hover:bg-slate-900 rounded transition-colors"
                            >
                              <Minus className="w-3 h-3 text-slate-500 dark:text-slate-400" />
                            </button>
                            <span className="font-bold text-xs w-4 text-center text-slate-800 dark:text-slate-200">
                              {item.qty}
                            </span>
                            <button
                              onClick={() => handleUpdateQty(item, item.qty + 1)}
                              className="p-0.5 hover:bg-slate-50 dark:hover:bg-slate-900 rounded transition-colors"
                            >
                              <Plus className="w-3 h-3 text-slate-500 dark:text-slate-400" />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                    {cart.length === 0 && (
                      <div className="text-center py-10 text-slate-400 text-sm font-bold">
                        سبد خرید خالی است
                      </div>
                    )}
                  </div>

                  {cart.length > 0 && (
                    <>
                      <div className="border-t border-slate-100 dark:border-slate-800 my-4" />

                      {/* Checkout Form fields */}
                      <div className="space-y-4">
                        <div>
                          <label className="block text-xs font-bold text-slate-400 dark:text-slate-500 mb-2">
                            انتخاب شماره میز
                          </label>
                          <div className="grid grid-cols-5 gap-2 font-['Vazirmatn']">
                            {['1', '2', '5', '8', '12'].map((num) => (
                              <button
                                key={num}
                                type="button"
                                onClick={() => setTableNumber(num)}
                                className={`py-2 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                                  tableNumber === num
                                    ? `bg-${brandColor}-50 dark:bg-${brandColor}-950/20 border-${brandColor}-500 text-${brandColor}-700 dark:text-${brandColor}-400 shadow-sm ring-2 ring-${brandColor}-500/10`
                                    : 'border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800/50'
                                }`}
                              >
                                میز {num}
                              </button>
                            ))}
                          </div>
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-slate-400 dark:text-slate-500 mb-1.5">
                            نام شما (اختیاری)
                          </label>
                          <input
                            type="text"
                            placeholder="نام خود را برای ثبت روی فاکتور بنویسید"
                            value={customerName}
                            onChange={(e) => setCustomerName(e.target.value)}
                            className={`w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded-xl px-4 py-3 text-xs outline-none focus:border-${brandColor}-500 transition-colors font-medium text-right text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500`}
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-slate-400 dark:text-slate-500 mb-1.5">
                            توضیحات سفارش (اختیاری)
                          </label>
                          <textarea
                            placeholder="مثال: نوشابه بدون یخ، بدون پیاز و..."
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            className={`w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded-xl p-3 text-xs outline-none focus:border-${brandColor}-500 transition-colors font-medium text-right min-h-[70px] text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500`}
                          />
                        </div>
                      </div>
                    </>
                  )}
                </div>

                {/* Pay Action Bar */}
                {cartTotal > 0 && (
                  <div className="p-5 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 rounded-t-3xl md:rounded-none shadow-[0_-10px_30px_rgba(0,0,0,0.03)] dark:shadow-none shrink-0 transition-colors">
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-slate-500 dark:text-slate-400 text-xs font-bold">
                        مبلغ قابل پرداخت
                      </span>
                      <span className="text-lg font-black text-slate-900 dark:text-slate-100">
                        {cartTotal.toLocaleString()}{' '}
                        <span className="text-xs font-normal text-slate-400 dark:text-slate-500">
                          تومان
                        </span>
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={handlePlaceOrder}
                      className={`w-full bg-${brandColor}-600 text-white py-3.5 rounded-xl font-bold text-xs hover:bg-${brandColor}-500 transition-all active:scale-95 shadow-md shadow-${brandColor}-500/10 flex items-center justify-center gap-2`}
                    >
                      ثبت و تکمیل سفارش
                    </button>
                  </div>
                )}
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
