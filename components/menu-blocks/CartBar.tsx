import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, ChevronLeft } from 'lucide-react';
import { Product } from '../../types';

interface CartBarProps {
  cart: any[];
  products: Product[];
  brandColor: string;
  mode: 'edit' | 'live';
  device?: 'mobile' | 'tablet';
  onClick: () => void;
}

export const CartBar: React.FC<CartBarProps> = ({
  cart,
  products,
  brandColor,
  mode,
  device = 'mobile',
  onClick,
}) => {
  const isEdit = mode === 'edit';

  const getProductBasePrice = (p: Product) => {
    if (!p) return 0;
    const price = p.price || 0;
    if (p.discountPrice !== undefined && p.discountPrice !== null && p.discountPrice > 0 && p.discountPrice < price) {
      return p.discountPrice;
    }
    return price;
  };

  const cartCount = (cart || []).reduce((acc, item) => acc + (item.qty || 0), 0);

  const cartTotal = (cart || []).reduce((acc, item) => {
    if (item.product) {
      const singlePrice = item.singlePrice || getProductBasePrice(item.product) || 0;
      return acc + singlePrice * (item.qty || 0);
    }
    const p = products && Array.isArray(products) ? products.find((prod) => prod.id === item.id) : null;
    const basePrice = p ? getProductBasePrice(p) : 0;
    return acc + basePrice * (item.qty || 0);
  }, 0);

  if (cartCount === 0) return null;

  const widthClass = isEdit
    ? device === 'mobile'
      ? 'left-6 right-6'
      : 'left-1/2 -translate-x-1/2 w-[400px]'
    : 'fixed bottom-6 left-6 right-6 z-40 max-w-[calc(28rem-3rem)] mx-auto';

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        className={`${isEdit ? 'absolute' : ''} ${widthClass}`}
        onClick={onClick}
      >
        <div className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-md text-slate-800 dark:text-slate-100 p-3.5 rounded-2xl shadow-xl flex items-center justify-between border border-slate-100 dark:border-slate-800 hover:scale-[1.02] transition-transform cursor-pointer" dir="rtl">
          <div className="flex flex-col text-right">
            <span className="text-[10px] text-slate-400 dark:text-slate-500 mb-0.5 font-bold flex items-center gap-1">
              <ShoppingBag className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500" />
              {cartCount} آیتم در سبد
            </span>
            <span className="text-base font-black text-slate-900 dark:text-slate-100">
              {cartTotal.toLocaleString()}{' '}
              <span className="text-[10px] font-normal text-slate-400 dark:text-slate-500">تومان</span>
            </span>
          </div>
          <button
            type="button"
            className={`bg-${brandColor}-600 text-white px-5 py-2.5 rounded-xl text-xs font-bold hover:bg-${brandColor}-500 transition-colors shadow-md shadow-${brandColor}-500/10 flex items-center gap-1.5`}
          >
            مشاهده و پرداخت <ChevronLeft className="w-3.5 h-3.5" />
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
