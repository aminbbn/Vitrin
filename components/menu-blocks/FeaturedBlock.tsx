import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Star, ChevronLeft } from 'lucide-react';
import { ComponentItem, Product } from '../../types';
import { INITIAL_PRODUCTS } from '../../constants';

interface FeaturedBlockProps {
  element?: ComponentItem;
  brandColor: string;
  mode: 'edit' | 'live';
  isSelected?: boolean;
  onClick?: () => void;
  onProductClick: (product: Product) => void;
  cart?: any[];
  device?: 'mobile' | 'tablet';
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

export const FeaturedBlock: React.FC<FeaturedBlockProps> = ({
  element,
  brandColor,
  mode,
  isSelected = false,
  onClick,
  onProductClick,
  cart = [],
  device = 'mobile',
}) => {
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);

  useEffect(() => {
    const handleLoadProducts = () => {
      const saved = localStorage.getItem('vitrin_products');
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setProducts(parsed);
          }
        } catch (e) {
          console.error(e);
        }
      }
    };

    handleLoadProducts();

    if (mode === 'live') {
      window.addEventListener('storage', handleLoadProducts);
      window.addEventListener('focus', handleLoadProducts);
      return () => {
        window.removeEventListener('storage', handleLoadProducts);
        window.removeEventListener('focus', handleLoadProducts);
      };
    }
  }, [mode]);

  // Use the first product as featured, or second depending on availability
  const baseProduct = products[1] || products[0] || INITIAL_PRODUCTS[1];
  const featuredProduct = {
    ...baseProduct,
    name: baseProduct.name,
    image: element?.settings?.imageUrl || baseProduct.image,
    description: baseProduct.description,
  };

  const isEdit = mode === 'edit';
  const isMobile = device === 'mobile';
  
  // Check if item is in cart
  // Supporting both cart formats: [{ id: '1' }] and [{ product: { id: '1' } }]
  const inCart = cart.some((item) => {
    const id = item.id || item.product?.id;
    return id === featuredProduct.id;
  });

  const containerClasses = isEdit
    ? `relative w-full rounded-3xl overflow-hidden cursor-pointer transition-all border-2 bg-white ${
        isSelected
          ? `border-${brandColor}-500 ring-4 ring-${brandColor}-500/10`
          : `border-transparent hover:border-${brandColor}-200`
      }`
    : 'px-4 py-6 mb-2 text-right';

  const heightClass = 'h-72 md:h-80';

  return (
    <div onClick={onClick} className={containerClasses}>
      <div className="flex items-center justify-between mb-4 px-2">
        <div className="flex flex-col text-right">
          <h3 className="font-black text-slate-800 text-lg">
            {element?.settings?.title || 'پیشنهادات ویژه'}
          </h3>
          <span className="text-[10px] text-slate-400 font-bold mt-0.5">
            {element?.settings?.subtitle || 'هنری از ترکیب طعم‌های اصیل و مدرن'}
          </span>
        </div>
      </div>

      <motion.div
        whileTap={(isEdit || featuredProduct.isAvailable === false) ? undefined : { scale: 0.98 }}
        onClick={(e) => {
          if (!isEdit) {
            e.stopPropagation();
            onProductClick(featuredProduct);
          }
        }}
        className={`relative ${heightClass} w-full rounded-[2rem] overflow-hidden bg-[#1a1a1a] shadow-xl text-white flex flex-col justify-end ${
          featuredProduct.isAvailable === false ? 'opacity-70 grayscale-[30%]' : ''
        }`}
      >
        <img
          src={featuredProduct.image || undefined}
          alt="Featured"
          className="absolute top-0 left-0 w-full h-full object-cover opacity-60 mix-blend-overlay"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />

        <div className="absolute top-4 right-4 z-10">
          <div className="bg-orange-500 text-white px-3 py-1 rounded-full text-[10px] font-black flex items-center gap-1 shadow-lg animate-pulse">
            <Star className="w-3 h-3 fill-current" />
            پیشنهاد ویژه سرآشپز
          </div>
        </div>

        {featuredProduct.isAvailable === false && (
          <div className="absolute inset-0 bg-slate-950/40 backdrop-blur-xs flex items-center justify-center z-10">
            <span className="bg-slate-950/90 text-white text-xs font-black px-4 py-2 rounded-xl border border-white/10">ناموجود در منو</span>
          </div>
        )}

        <div className="relative z-10 p-6 flex flex-col items-start justify-end text-right w-full" dir="rtl">
          <h3 className="text-2xl font-black mb-1 drop-shadow-md">
            {featuredProduct.name}
          </h3>
          <p className="text-white/80 text-xs mb-4 line-clamp-2 max-w-[280px] drop-shadow-sm font-medium leading-relaxed">
            {featuredProduct.description}
          </p>

          <div className="flex items-center justify-between bg-white/10 backdrop-blur-md p-3 rounded-2xl border border-white/10 w-full max-w-sm">
            <div className="flex flex-col text-right">
              <span className="text-[10px] text-white/60">قیمت</span>
              {featuredProduct.discountPrice !== undefined && featuredProduct.discountPrice > 0 && featuredProduct.discountPrice < featuredProduct.price ? (
                <div className="flex items-baseline gap-2">
                  <span className="text-lg font-black text-white">
                    {featuredProduct.discountPrice.toLocaleString()} تومان
                  </span>
                  <span className="text-xs text-white/50 line-through">
                    {featuredProduct.price.toLocaleString()}
                  </span>
                </div>
              ) : (
                <div className="flex items-baseline gap-2">
                  <span className="text-lg font-black text-white">
                    {featuredProduct.price.toLocaleString()} تومان
                  </span>
                </div>
              )}
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                if (!isEdit && featuredProduct.isAvailable !== false) {
                  onProductClick(featuredProduct);
                }
              }}
              disabled={featuredProduct.isAvailable === false}
              className={`px-6 py-2.5 rounded-xl text-xs font-bold transition-all shadow-lg ${
                featuredProduct.isAvailable === false
                  ? 'bg-slate-800 text-slate-500 border border-slate-700/50 cursor-not-allowed'
                  : inCart
                  ? `bg-${brandColor}-500 text-white`
                  : `bg-white text-slate-900 hover:bg-${brandColor}-50`
              }`}
            >
              {featuredProduct.isAvailable === false ? 'ناموجود' : inCart ? 'مشاهده سفارش' : 'سفارش دهید'}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
