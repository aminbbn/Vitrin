import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Star, Clock, ChefHat, Send, Minus, Plus, ShoppingBag } from 'lucide-react';
import { Product } from '../../types';

interface ProductDetailSheetProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  onAddToCart: (
    productOrId: any,
    qty: number,
    selectedModifiers?: Record<string, string>,
    finalSinglePrice?: number
  ) => void;
  brandColor: string;
  mode: 'edit' | 'live';
  device?: 'mobile' | 'tablet';
  initialQty?: number;
}

const getTagStyles = (tag: string) => {
  const t = tag.trim();
  if (t === 'تند' || t === 'اسپایسی') {
    return 'bg-rose-50 text-rose-600 border-rose-100';
  }
  if (t === 'گیاهی' || t === 'وگن' || t === 'رژیمی') {
    return 'bg-emerald-50 text-emerald-600 border-emerald-100';
  }
  if (t === 'جدید' || t === 'نیو') {
    return 'bg-blue-50 text-blue-600 border-blue-100';
  }
  if (t === 'محبوب' || t === 'پرفروش' || t === 'ویژه' || t === 'پیشنهاد سرآشپز') {
    return 'bg-amber-50 text-amber-600 border-amber-100';
  }
  return 'bg-slate-50 text-slate-600 border-slate-100';
};

export const ProductDetailSheet: React.FC<ProductDetailSheetProps> = ({
  product,
  isOpen,
  onClose,
  onAddToCart,
  brandColor,
  mode,
  device = 'mobile',
  initialQty = 1,
}) => {
  const [qty, setQty] = useState(initialQty);
  const [activeTab, setActiveTab] = useState<'details' | 'reviews'>('details');
  const [newComment, setNewComment] = useState('');
  const [selectedModifiers, setSelectedModifiers] = useState<Record<string, string>>({});

  useEffect(() => {
    if (product) {
      setQty(initialQty || 1);
      setActiveTab('details');
      setNewComment('');

      // Initialize selected modifiers with the first option of each group
      const initial: Record<string, string> = {};
      if (product.modifiers) {
        product.modifiers.forEach((group: any) => {
          if (group.options && group.options.length > 0) {
            initial[group.id] = group.options[0].id;
          }
        });
      }
      setSelectedModifiers(initial);
    }
  }, [product, initialQty]);

  if (!product) return null;

  const isMobile = device === 'mobile';
  const isEdit = mode === 'edit';

  // Calculate extra cost based on selected modifiers
  const extraCost = (product.modifiers || []).reduce((sum: number, group: any) => {
    const selectedOptionId = selectedModifiers[group.id];
    if (selectedOptionId) {
      const option = group.options.find((opt: any) => opt.id === selectedOptionId);
      if (option) {
        return sum + option.price;
      }
    }
    return sum;
  }, 0);

  // Fallback modifier logic for mock-bread
  const hasModifiers = product.modifiers && product.modifiers.length > 0;
  const mockBreadPrice = !hasModifiers && selectedModifiers['mock-bread'] === 'mock-1' ? 15000 : 0;

  const basePrice = (product.discountPrice !== undefined && product.discountPrice > 0 && product.discountPrice < product.price)
    ? product.discountPrice
    : product.price;

  const singlePrice = basePrice + extraCost + mockBreadPrice;
  const totalPrice = singlePrice * qty;

  const handleAdd = () => {
    if (isEdit) {
      onAddToCart(product.id, qty);
    } else {
      onAddToCart(product, qty, selectedModifiers, singlePrice);
    }
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[200] flex items-end justify-center"
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-md"
          />
          <motion.div
            initial={isMobile ? { y: '100%' } : { opacity: 0, scale: 0.9 }}
            animate={isMobile ? { y: 0 } : { opacity: 1, scale: 1 }}
            exit={isMobile ? { y: '100%' } : { opacity: 0, scale: 0.9 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className={`fixed z-10 bg-white dark:bg-slate-950 shadow-2xl overflow-hidden flex flex-col transition-colors duration-300 ${
              isMobile
                ? 'bottom-0 left-0 right-0 rounded-t-[2.5rem] h-[85vh] max-w-md mx-auto border-t border-slate-100 dark:border-slate-850'
                : 'top-[10%] left-[10%] right-[10%] bottom-[10%] rounded-[2rem] max-w-4xl mx-auto border border-slate-100 dark:border-slate-850'
            }`}
          >
            {/* Image Header */}
            <div className={`relative shrink-0 ${isMobile ? 'h-64' : 'h-72'}`}>
              <img
                src={product.image || undefined}
                className="w-full h-full object-cover"
                alt={product.name}
              />
              <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-transparent" />
              <button
                onClick={onClose}
                className="absolute top-6 right-6 w-10 h-10 bg-slate-900/40 dark:bg-black/40 backdrop-blur-md border border-white/15 rounded-full flex items-center justify-center text-white active:scale-95 transition-transform z-10"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-8 -mt-10 bg-white dark:bg-slate-950 rounded-t-[2.5rem] relative z-10 text-right transition-colors" dir="rtl">
              <div className="w-12 h-1 bg-slate-200 dark:bg-slate-800 rounded-full mx-auto mb-6 shrink-0" />

              <div className="flex justify-between items-start mb-2">
                <div className="space-y-1">
                  <h2 className="text-2xl font-black text-slate-900 dark:text-slate-100 leading-tight">
                    {product.name}
                  </h2>
                  {product.tags && product.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-1">
                      {product.tags.map((tag, tIdx) => (
                        <span key={tIdx} className={`text-[10px] font-black border px-2.5 py-1 rounded-md shadow-xs ${getTagStyles(tag)}`}>
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-1.5 bg-yellow-50 dark:bg-yellow-950/20 px-2.5 py-1.5 rounded-xl border border-yellow-100/60 dark:border-yellow-900/30 shrink-0 transition-colors">
                  <Star className="w-4 h-4 text-yellow-500 fill-current" />
                  <span className="text-sm font-bold text-yellow-700 dark:text-yellow-400">
                    {product.rating || '4.5'}
                  </span>
                </div>
              </div>

              <div className="flex items-baseline gap-2 mb-4">
                {product.discountPrice !== undefined && product.discountPrice > 0 && product.discountPrice < product.price ? (
                  <>
                    <span className="text-2xl font-black text-slate-950 dark:text-slate-100">
                      {product.discountPrice.toLocaleString()}
                    </span>
                    <span className="text-xs font-normal text-slate-400 dark:text-slate-500">تومان</span>
                    <span className="text-xs text-slate-400 dark:text-slate-500 line-through mr-1 font-bold">
                      {product.price.toLocaleString()} تومان
                    </span>
                    <span className={`text-[10px] font-black bg-red-50 dark:bg-red-950/20 text-red-600 dark:text-red-400 px-2 py-0.5 rounded-md border border-red-100 dark:border-red-900/30 mr-1`}>
                      تخفیف ویژه
                    </span>
                  </>
                ) : (
                  <>
                    <span className="text-2xl font-black text-slate-950 dark:text-slate-100">
                      {product.price.toLocaleString()}
                    </span>
                    <span className="text-xs font-normal text-slate-400 dark:text-slate-500">تومان</span>
                  </>
                )}
              </div>

              <div className="flex items-center gap-4 text-xs text-slate-500 dark:text-slate-400 font-medium mb-6">
                <div className="flex items-center gap-1.5 bg-slate-50 dark:bg-slate-900 px-2.5 py-1.5 rounded-lg border border-slate-100/30 dark:border-slate-800/45">
                  <Clock className="w-4 h-4 text-slate-400 dark:text-slate-500" />
                  {product.estimatedTime || '15 دقیقه'}
                </div>
                <div className="w-1 h-1 bg-slate-300 dark:bg-slate-700 rounded-full" />
                <span>{product.category}</span>
              </div>

              {/* Tabs for detail view */}
              <div className="flex border-b border-slate-100 dark:border-slate-850 mb-6 sticky top-0 bg-white dark:bg-slate-950 z-10 transition-colors">
                <button
                  type="button"
                  onClick={() => setActiveTab('details')}
                  className={`flex-1 pb-3 text-sm font-bold transition-colors border-b-2 ${
                    activeTab === 'details'
                      ? `border-${brandColor}-500 text-${brandColor}-600`
                      : 'border-transparent text-slate-400 dark:text-slate-500'
                  }`}
                >
                  جزئیات محصول
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('reviews')}
                  className={`flex-1 pb-3 text-sm font-bold transition-colors border-b-2 ${
                    activeTab === 'reviews'
                      ? `border-${brandColor}-500 text-${brandColor}-600`
                      : 'border-transparent text-slate-400 dark:text-slate-500'
                  }`}
                >
                  نظرات کاربران
                </button>
              </div>

              {activeTab === 'details' ? (
                <div className="space-y-6">
                  <p className="text-sm text-slate-600 dark:text-slate-300 leading-7 font-medium">
                    {product.description}
                  </p>

                  {/* Raw Materials (Only if they exist) */}
                  {product.rawMaterials && product.rawMaterials.length > 0 && (
                    <div className="space-y-3">
                      <h3 className="text-sm font-black text-slate-800 dark:text-slate-200 flex items-center gap-2">
                        <ChefHat className={`w-4 h-4 text-${brandColor}-600`} />
                        مواد اولیه
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {product.rawMaterials.map((item: string, i: number) => (
                          <span
                            key={i}
                            className="px-3 py-1 bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-400 rounded-full text-[10px] font-bold border border-slate-200 dark:border-slate-800"
                          >
                            {item}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Dynamic Options or Fallbacks */}
                  {hasModifiers ? (
                    product.modifiers.map((group: any) => (
                      <div key={group.id} className="space-y-3">
                        <div className="flex items-center justify-between">
                          <h3 className="text-sm font-black text-slate-900 dark:text-slate-100">
                            {group.name}
                          </h3>
                          {group.type === 'mandatory' ? (
                            <span
                              className={`text-[10px] bg-${brandColor}-50 dark:bg-${brandColor}-950/25 text-${brandColor}-600 dark:text-${brandColor}-400 px-2.5 py-1 rounded-md font-bold`}
                            >
                              اجباری
                            </span>
                          ) : (
                            <span className="text-[10px] bg-slate-100 dark:bg-slate-900 text-slate-500 dark:text-slate-400 px-2.5 py-1 rounded-md font-bold">
                              اختیاری
                            </span>
                          )}
                        </div>
                        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
                          {group.options.map((opt: any) => {
                            const isSelected = selectedModifiers[group.id] === opt.id;
                            return (
                              <button
                                key={opt.id}
                                type="button"
                                onClick={() =>
                                  setSelectedModifiers((prev) => ({
                                    ...prev,
                                    [group.id]: opt.id,
                                  }))
                                }
                                className={`px-5 py-3 rounded-2xl border text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                                  isSelected
                                    ? `bg-${brandColor}-50 dark:bg-${brandColor}-950/20 border-${brandColor}-500 text-${brandColor}-700 dark:text-${brandColor}-400 shadow-sm ring-2 ring-${brandColor}-500/10 scale-[1.02]`
                                    : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-850'
                                }`}
                              >
                                {opt.name}{' '}
                                {opt.price > 0
                                  ? `(+${opt.price.toLocaleString()})`
                                  : ''}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    ))
                  ) : (
                    /* Fallback bread selection if modifier list is empty (matches user screenshot) */
                    <div className="space-y-4">
                      <h3 className="text-sm font-black text-slate-900 dark:text-slate-100">
                        انتخاب نان
                      </h3>
                      <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
                        {[
                          { id: 'mock-0', name: 'نان سفید', price: 0 },
                          { id: 'mock-1', name: 'نان جو', price: 15000 },
                          { id: 'mock-2', name: 'نان سیر', price: 0 },
                        ].map((opt) => {
                          const isSelected =
                            selectedModifiers['mock-bread'] === opt.id ||
                            (!selectedModifiers['mock-bread'] && opt.id === 'mock-0');
                          return (
                            <button
                              key={opt.id}
                              type="button"
                              onClick={() => {
                                setSelectedModifiers((prev) => ({
                                  ...prev,
                                  'mock-bread': opt.id,
                                }));
                              }}
                              className={`px-5 py-3 rounded-2xl border text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                                isSelected
                                  ? `bg-${brandColor}-50 dark:bg-${brandColor}-950/20 border-${brandColor}-500 text-${brandColor}-700 dark:text-${brandColor}-400 shadow-sm ring-2 ring-${brandColor}-500/10 scale-[1.02]`
                                  : 'border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-850'
                              }`}
                            >
                              {opt.name}{' '}
                              {opt.price > 0
                                ? `(+${opt.price.toLocaleString()})`
                                : ''}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="space-y-6">
                  {/* Comment Input */}
                  <div className="bg-slate-50 dark:bg-slate-900 p-4 rounded-2xl border border-slate-100 dark:border-slate-800 transition-colors">
                    <div className="flex gap-2 mb-2">
                      <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center transition-colors">
                        <Star className="w-4 h-4 text-slate-500 dark:text-slate-400" />
                      </div>
                      <div className="flex-1">
                        <textarea
                          placeholder="نظر خود را بنویسید..."
                          value={newComment}
                          onChange={(e) => setNewComment(e.target.value)}
                          className={`w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded-xl p-3 text-xs outline-none focus:border-${brandColor}-400 min-h-[80px] text-right text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 transition-colors`}
                        />
                      </div>
                    </div>
                    <div className="flex justify-end">
                      <button
                        type="button"
                        className={`bg-${brandColor}-600 text-white px-4 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5`}
                      >
                        ارسال نظر
                      </button>
                    </div>
                  </div>

                  {/* Reviews List */}
                  {product.reviews && product.reviews.length > 0 ? (
                    <div className="space-y-4">
                      {product.reviews.map((review: any) => (
                        <div
                          key={review.id}
                          className="border-b border-slate-100 dark:border-slate-850 pb-4 last:border-0 text-right transition-colors"
                        >
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-[10px] text-slate-400 dark:text-slate-550">
                              {review.date}
                            </span>
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                                {review.user}
                              </span>
                              <div className="flex text-yellow-400">
                                {[...Array(5)].map((_, i) => (
                                  <Star
                                    key={i}
                                    className={`w-3 h-3 ${
                                      i < review.rating
                                        ? 'fill-current'
                                        : 'text-slate-200 dark:text-slate-850'
                                    }`}
                                  />
                                ))}
                              </div>
                            </div>
                          </div>
                          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                            {review.comment}
                          </p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-slate-400 dark:text-slate-500 text-xs">
                      هنوز نظری ثبت نشده است. اولین نفر باشید!
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Action Bar */}
            <div className="p-4 border-t border-slate-100 dark:border-slate-850 bg-white dark:bg-slate-950 safe-area-bottom shadow-[0_-5px_20px_rgba(0,0,0,0.03)] dark:shadow-none z-10 shrink-0 transition-colors">
              {product.isAvailable === false ? (
                <div className="text-center" dir="rtl">
                  <p className="text-xs text-rose-500 dark:text-rose-400 font-bold mb-3 bg-rose-50 dark:bg-rose-950/20 p-2.5 rounded-xl border border-rose-100 dark:border-rose-900/30">
                    این محصول در حال حاضر موجود نیست و امکان افزودن به سبد وجود ندارد.
                  </p>
                  <button
                    type="button"
                    disabled
                    className="w-full bg-slate-100 dark:bg-slate-900 text-slate-400 dark:text-slate-600 py-3.5 rounded-xl font-bold text-xs flex items-center justify-center gap-2 cursor-not-allowed border border-slate-200 dark:border-slate-800"
                  >
                    ناموجود در منو
                  </button>
                </div>
              ) : (
                <>
                  <div className="flex items-center justify-between gap-4 mb-4">
                    <div className="flex items-center gap-3 bg-slate-50 dark:bg-slate-900 px-3 py-2 rounded-xl border border-slate-100 dark:border-slate-800/40">
                      <button
                        type="button"
                        onClick={() => setQty(Math.max(1, qty - 1))}
                        className="p-1 hover:bg-white dark:hover:bg-slate-950 rounded-lg transition-colors"
                      >
                        <Minus className="w-3.5 h-3.5 text-slate-500 dark:text-slate-450" />
                      </button>
                      <span className="font-bold w-5 text-center text-sm text-slate-900 dark:text-slate-100">{qty}</span>
                      <button
                        type="button"
                        onClick={() => setQty(qty + 1)}
                        className="p-1 hover:bg-white dark:hover:bg-slate-950 rounded-lg transition-colors"
                      >
                        <Plus className="w-3.5 h-3.5 text-slate-500 dark:text-slate-450" />
                      </button>
                    </div>
                    <div className="flex-1 text-left">
                      <span className="text-[10px] text-slate-400 dark:text-slate-550 block font-bold mb-0.5">
                        مبلغ کل
                      </span>
                      <span className="text-lg font-black text-slate-950 dark:text-slate-100">
                        {totalPrice.toLocaleString()}{' '}
                        <span className="text-xs font-normal text-slate-400 dark:text-slate-500">
                          تومان
                        </span>
                      </span>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={handleAdd}
                    className={`w-full bg-${brandColor}-600 hover:bg-${brandColor}-500 text-white py-3.5 rounded-xl font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-${brandColor}-500/10 active:scale-[0.98] transition-all`}
                  >
                    <ShoppingBag className="w-4 h-4" />
                    افزودن به سبد خرید
                  </button>
                </>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
