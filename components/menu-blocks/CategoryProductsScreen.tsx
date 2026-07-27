import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, X, Plus } from 'lucide-react';
import { Product, Category } from '../../types';
import { INITIAL_CATEGORIES, INITIAL_PRODUCTS } from '../../constants';
import { useCatalog } from '../../data/useRepositories';

interface CategoryProductsScreenProps {
  categoryId: string;
  onBack: () => void;
  onProductClick: (product: Product) => void;
  brandColor: string;
  mode: 'edit' | 'live';
  // Optional overrides for edit mode
  layoutStyle?: 'grid' | 'list';
  columns?: number;
  categories?: Category[];
  products?: Product[];
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

export const CategoryProductsScreen: React.FC<CategoryProductsScreenProps> = ({
  categoryId,
  onBack,
  onProductClick,
  brandColor,
  mode,
  layoutStyle: editLayoutStyle,
  columns: editColumns,
  categories: propCategories,
  products: propProducts,
}) => {
  const { categories: catalogCategories, products: catalogProducts, layoutSettings } = useCatalog();

  const categories = propCategories || catalogCategories || INITIAL_CATEGORIES;
  const products = propProducts || catalogProducts || INITIAL_PRODUCTS;

  const liveLayoutStyle = layoutSettings?.layout || 'grid';
  const liveColumns = layoutSettings?.columns || 2;

  const isEdit = mode === 'edit';

  const activeLayoutStyle = isEdit ? editLayoutStyle || 'grid' : liveLayoutStyle;
  const activeColumns = isEdit ? editColumns || 2 : liveColumns;

  const category = useMemo(() => {
    return categories.find((c) => c.id === categoryId) || INITIAL_CATEGORIES[0];
  }, [categories, categoryId]);

  const filteredProducts = useMemo(() => {
    const list = products.filter(
      (p) => p.categoryId === categoryId || p.category === category?.name
    );
    if (mode === 'live') {
      return list.filter(p => p.isAvailable !== false);
    }
    return list;
  }, [products, categoryId, category, mode]);

  return (
    <motion.div
      initial={{ x: '100%' }}
      animate={{ x: 0 }}
      exit={{ x: '100%' }}
      transition={{ type: 'spring', damping: 25, stiffness: 300 }}
      className={`absolute inset-0 bg-[#F2F4F7] dark:bg-slate-950 z-30 flex flex-col min-h-screen transition-colors duration-300 ${
        isEdit ? 'pb-16 h-full overflow-y-auto' : 'pb-32 overflow-y-auto'
      }`}
    >
      {/* Header */}
      <div className="sticky top-0 z-30 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-100 dark:border-slate-800 px-5 py-4 flex items-center justify-between shadow-sm min-h-[60px] shrink-0 transition-colors duration-300">
        <button
          onClick={onBack}
          className="w-9 h-9 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-xl flex items-center justify-center cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 text-slate-500 dark:text-slate-400" />
        </button>

        <h2 className="font-black text-slate-900 dark:text-slate-100 text-base text-right flex-1 pr-4">
          {category?.name}
        </h2>

        <div className="w-9 h-9" /> {/* Spacer for symmetry */}
      </div>

      {/* Hero Banner for Category */}
      {category?.image && (
        <div className="relative aspect-[16/6] overflow-hidden mx-4 my-3 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm shrink-0">
          <img
            src={category.image || undefined}
            alt={category.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
          <div className="absolute bottom-3 right-4 text-right">
            <span className="text-[10px] text-white/80 font-bold uppercase tracking-widest bg-black/30 backdrop-blur-sm px-2 py-0.5 rounded-full border border-white/10">
              دسته‌بندی
            </span>
            <h3 className="text-white font-black text-lg mt-0.5">
              {category.name}
            </h3>
          </div>
        </div>
      )}

      {/* Products list or grid */}
      <div className="flex-1 mt-2">
        {filteredProducts.length === 0 ? (
          <div className="p-10 text-center text-slate-400 flex flex-col items-center mt-6">
            <X className="w-12 h-12 mb-4 opacity-20 text-rose-500" />
            <p className="font-bold text-sm text-slate-500">
              هیچ محصولی در این دسته‌بندی تعریف نشده است.
            </p>
          </div>
        ) : activeLayoutStyle === 'grid' ? (
          <div
            className={`grid gap-3.5 px-4 ${
              isEdit ? 'pb-16' : 'pb-24'
            } ${
              activeColumns === 3
                ? 'grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6'
                : activeColumns === 4
                ? 'grid-cols-4 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-7'
                : 'grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5'
            }`}
          >
            {filteredProducts.map((product, index) => {
              const hasDiscount = product.discountPrice !== undefined && product.discountPrice > 0 && product.discountPrice < product.price;
              const discountPercent = hasDiscount ? Math.round(((product.price - product.discountPrice!) / product.price) * 100) : 0;
              return (
                <motion.div
                  key={product.id}
                  initial={isEdit ? undefined : { opacity: 0, scale: 0.95 }}
                  animate={isEdit ? undefined : { opacity: 1, scale: 1 }}
                  transition={isEdit ? undefined : { delay: index * 0.03 }}
                  onClick={(e) => {
                    e.stopPropagation();
                    onProductClick(product);
                  }}
                  className={`bg-white dark:bg-slate-900 rounded-[1.5rem] overflow-hidden border border-slate-100/80 dark:border-slate-800 shadow-sm active:scale-95 transition-all group cursor-pointer text-right flex flex-col h-full ${product.isAvailable === false ? 'opacity-60 grayscale-[30%]' : ''}`}
                >
                  <div className="aspect-square bg-slate-50 dark:bg-slate-800 relative overflow-hidden">
                    <img
                      referrerPolicy="no-referrer"
                      src={product.image || undefined}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    {/* Badges/Tags removed - leaving only discount tag */}
                    {hasDiscount && (
                      <div className="absolute top-2 left-2">
                        <span className="bg-rose-500 text-white text-[8px] font-black px-1.5 py-0.5 rounded-md shadow-xs" dir="ltr">
                          %{discountPercent}-
                        </span>
                      </div>
                    )}
                    {product.isAvailable === false && (
                      <div className="absolute inset-0 bg-slate-900/45 backdrop-blur-xs flex items-center justify-center">
                        <span className="bg-slate-950/90 text-white text-[10px] font-black px-2.5 py-1 rounded-lg">ناموجود</span>
                      </div>
                    )}
                  </div>
                  <div className="p-3 flex-1 flex flex-col justify-between">
                    <div>
                      <h4 className="text-xs font-black text-slate-800 dark:text-slate-200 mb-1 line-clamp-1">
                        {product.name}
                      </h4>
                      <p className="text-[9px] text-slate-400 dark:text-slate-500 mb-2 font-bold">
                        {product.category}
                      </p>
                    </div>
                    <div className="flex items-center justify-between mt-1 pt-1 border-t border-slate-50 dark:border-slate-800">
                      <div className="flex flex-col text-right">
                        {hasDiscount ? (
                          <>
                            <span className="text-[9px] text-slate-400 dark:text-slate-500 line-through leading-none mb-0.5" dir="ltr">
                              {(product.price || 0).toLocaleString()}
                            </span>
                            <span className={`text-xs font-black text-${brandColor}-600 dark:text-${brandColor}-400`}>
                              {(product.discountPrice || 0).toLocaleString()} تومان
                            </span>
                          </>
                        ) : (
                          <span className="text-xs font-black text-slate-900 dark:text-slate-100">
                            {(product.price || 0).toLocaleString()} تومان
                          </span>
                        )}
                      </div>
                      <span
                        className={`w-7 h-7 bg-${brandColor}-50 dark:bg-${brandColor}-950/30 text-${brandColor}-600 dark:text-${brandColor}-400 rounded-lg flex items-center justify-center text-xs font-bold hover:bg-${brandColor}-100 dark:hover:bg-${brandColor}-900/45 transition-colors`}
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </span>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        ) : (
          <div className={`grid gap-4 px-4 ${isEdit ? 'pb-16' : 'pb-24'} grid-cols-1 md:grid-cols-2`}>
            {filteredProducts.map((product, index) => {
              const hasDiscount = product.discountPrice !== undefined && product.discountPrice > 0 && product.discountPrice < product.price;
              const discountPercent = hasDiscount ? Math.round(((product.price - product.discountPrice!) / product.price) * 100) : 0;
              return (
                <motion.div
                  key={product.id}
                  initial={isEdit ? undefined : { opacity: 0, x: -10 }}
                  animate={isEdit ? undefined : { opacity: 1, x: 0 }}
                  transition={isEdit ? undefined : { delay: index * 0.03 }}
                  onClick={(e) => {
                    e.stopPropagation();
                    onProductClick(product);
                  }}
                  className={`flex gap-4 bg-white dark:bg-slate-900 p-3 rounded-[1.25rem] border border-slate-100 dark:border-slate-800 shadow-sm active:scale-95 transition-all cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-850 text-right ${product.isAvailable === false ? 'opacity-60 grayscale-[30%]' : ''}`}
                >
                  <div className="w-20 h-20 bg-slate-100 dark:bg-slate-800 border border-slate-100 dark:border-slate-800 rounded-xl overflow-hidden shrink-0 relative">
                    <img
                      referrerPolicy="no-referrer"
                      src={product.image || undefined}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                    {hasDiscount && (
                      <div className="absolute top-1 left-1">
                        <span className="bg-rose-500 text-white text-[7px] font-black px-1 py-0.5 rounded shadow-xs" dir="ltr">
                          %{discountPercent}-
                        </span>
                      </div>
                    )}
                    {product.isAvailable === false && (
                      <div className="absolute inset-0 bg-slate-900/45 backdrop-blur-xs flex items-center justify-center">
                        <span className="bg-slate-950/90 text-white text-[8px] font-black px-1.5 py-0.5 rounded-md">ناموجود</span>
                      </div>
                    )}
                  </div>
                  <div className="flex-1 flex flex-col justify-center py-0.5 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <h4 className="text-xs font-black text-slate-800 dark:text-slate-200 mb-0.5">
                        {product.name}
                      </h4>
                    </div>
                    <p className="text-[9px] text-slate-400 dark:text-slate-500 line-clamp-1 mb-2 font-bold leading-relaxed">
                      {product.description}
                    </p>

                    <div className="flex justify-between items-center mt-1 pt-1 border-t border-slate-50 dark:border-slate-800">
                      <div className="flex flex-col text-right">
                        {hasDiscount ? (
                          <div className="flex items-baseline gap-1.5">
                            <span className="text-[9px] text-slate-400 dark:text-slate-500 line-through" dir="ltr">
                              {(product.price || 0).toLocaleString()}
                            </span>
                            <span className={`text-xs font-black text-${brandColor}-600 dark:text-${brandColor}-400`}>
                              {(product.discountPrice || 0).toLocaleString()} تومان
                            </span>
                          </div>
                        ) : (
                          <span className="text-xs font-black text-slate-900 dark:text-slate-100">
                            {(product.price || 0).toLocaleString()}{' '}
                            <span className="text-[9px] font-normal text-slate-400 dark:text-slate-500">
                              تومان
                            </span>
                          </span>
                        )}
                      </div>
                      <div
                        className={`px-2.5 py-1 rounded-lg bg-${brandColor}-50 dark:bg-${brandColor}-950/30 text-${brandColor}-600 dark:text-${brandColor}-400 text-[10px] font-bold border border-${brandColor}-100 dark:border-${brandColor}-800/40 hover:bg-${brandColor}-100/80 dark:hover:bg-${brandColor}-900/40 transition-colors`}
                      >
                        افزودن
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </motion.div>
  );
};
