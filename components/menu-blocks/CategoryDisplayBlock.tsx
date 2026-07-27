import React, { useState, useEffect, useMemo, useRef } from 'react';
import { motion } from 'framer-motion';
import { LayoutGrid, List, ChevronLeft, ChevronRight } from 'lucide-react';
import { ComponentItem } from '../../types';
import { INITIAL_CATEGORIES } from '../../constants';
import { useCatalog } from '../../data/useRepositories';

interface CategoryDisplayBlockProps {
  element?: ComponentItem;
  brandColor: string;
  mode: 'edit' | 'live';
  isSelected?: boolean;
  onClick?: () => void;
  onCategoryClick: (categoryId: string) => void;
  categories?: any[];
}

export const CategoryDisplayBlock: React.FC<CategoryDisplayBlockProps> = ({
  element,
  brandColor,
  mode,
  isSelected = false,
  onClick,
  onCategoryClick,
  categories: propCategories,
}) => {
  const { categories: catalogCategories } = useCatalog();
  const categories = propCategories || catalogCategories || INITIAL_CATEGORIES;
  const layout = element?.settings?.layout || 'grid'; // 'grid' or 'scroll'
  const columns = element?.settings?.columns || 2;
  const visibleCategories = element?.settings?.visibleCategories || [];
  const categoriesOrder = element?.settings?.categoriesOrder || [];

  const scrollRef = useRef<HTMLDivElement>(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);

  const updateArrows = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      const isRtl = document.dir === 'rtl' || window.getComputedStyle(scrollRef.current).direction === 'rtl';
      
      if (isRtl) {
        const absScrollLeft = Math.abs(scrollLeft);
        setShowRightArrow(absScrollLeft > 5);
        setShowLeftArrow(absScrollLeft + clientWidth < scrollWidth - 5);
      } else {
        setShowLeftArrow(scrollLeft > 5);
        setShowRightArrow(scrollLeft + clientWidth < scrollWidth - 5);
      }
    }
  };

  const processedCategories = useMemo(() => {
    let list = [...categories];
    // Filter by visibleCategories if configured
    if (visibleCategories.length > 0) {
      list = list.filter((c) => visibleCategories.includes(c.id));
    }
    // Sort by categoriesOrder if configured, else by order field
    if (categoriesOrder.length > 0) {
      list.sort((a, b) => {
        const idxA = categoriesOrder.indexOf(a.id);
        const idxB = categoriesOrder.indexOf(b.id);
        if (idxA === -1 && idxB === -1) return a.order - b.order;
        if (idxA === -1) return 1;
        if (idxB === -1) return -1;
        return idxA - idxB;
      });
    } else {
      list.sort((a, b) => a.order - b.order);
    }
    return list;
  }, [categories, visibleCategories, categoriesOrder]);



  useEffect(() => {
    const el = scrollRef.current;
    if (el && layout === 'scroll') {
      updateArrows();
      el.addEventListener('scroll', updateArrows);
      window.addEventListener('resize', updateArrows);
      const timer = setTimeout(updateArrows, 400);
      return () => {
        el.removeEventListener('scroll', updateArrows);
        window.removeEventListener('resize', updateArrows);
        clearTimeout(timer);
      };
    }
  }, [processedCategories, layout]);

  const handleScroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = 180;
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  const isEdit = mode === 'edit';

  const containerClasses = isEdit
    ? `relative w-full rounded-2xl overflow-hidden cursor-pointer transition-all border-2 bg-white dark:bg-slate-900 ${
        isSelected
          ? `border-${brandColor}-500 ring-4 ring-${brandColor}-500/10`
          : `border-transparent hover:border-${brandColor}-200 dark:hover:border-${brandColor}-800`
      }`
    : 'px-4 py-2 mb-6 mt-4';

  return (
    <div onClick={onClick} className={containerClasses}>
      <div className="p-2">
        <div className="flex items-center justify-between mb-4 px-2" dir="rtl">
          <h2
            className="font-black text-slate-800 dark:text-slate-100 text-right"
            style={{ fontSize: element?.settings?.fontSize || 18 }}
          >
            {element?.settings?.title || 'دسته‌بندی‌ها'}
          </h2>

          {layout === 'scroll' && (
            <div className="flex items-center gap-1.5 text-slate-400 dark:text-slate-500" dir="ltr">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleScroll('left');
                }}
                disabled={!showLeftArrow}
                className="p-1 transition-all rounded hover:text-slate-800 dark:hover:text-slate-200 disabled:opacity-30 disabled:pointer-events-none active:scale-95 cursor-pointer"
                title="قبلی"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              
              <div className="w-5 h-[2px] bg-slate-200 dark:bg-slate-800" />
              
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleScroll('right');
                }}
                disabled={!showRightArrow}
                className="p-1 transition-all rounded hover:text-slate-800 dark:hover:text-slate-200 disabled:opacity-30 disabled:pointer-events-none active:scale-95 cursor-pointer"
                title="بعدی"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>

        {layout === 'grid' ? (
          <div
            className={`grid gap-3 ${
              columns === 3
                ? 'grid-cols-3 sm:grid-cols-4 md:grid-cols-5'
                : columns === 4
                ? 'grid-cols-4 sm:grid-cols-5 md:grid-cols-6'
                : 'grid-cols-2 sm:grid-cols-3 md:grid-cols-4'
            }`}
          >
            {processedCategories.map((cat, index) => (
              <motion.div
                key={cat.id}
                initial={isEdit ? undefined : { opacity: 0, y: 10 }}
                animate={isEdit ? undefined : { opacity: 1, y: 0 }}
                transition={isEdit ? undefined : { delay: index * 0.05 }}
                onClick={(e) => {
                  e.stopPropagation();
                  onCategoryClick(cat.id);
                }}
                className="bg-white dark:bg-slate-900 rounded-[1.5rem] overflow-hidden border border-slate-100 dark:border-slate-800 shadow-sm active:scale-95 transition-all group relative cursor-pointer"
              >
                <div className="aspect-[4/3] bg-slate-50 dark:bg-slate-800 relative overflow-hidden">
                  <img
                    src={cat.image || undefined}
                    alt={cat.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-3 text-right">
                  <h3 className="text-xs font-black text-white">{cat.name}</h3>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="relative group/scroll-container">
            <div 
              ref={scrollRef}
              className="flex overflow-x-auto gap-3 pb-4 snap-x snap-mandatory [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] scroll-smooth"
            >
              {processedCategories.map((cat, index) => (
                <motion.div
                  key={cat.id}
                  initial={isEdit ? undefined : { opacity: 0, x: 20 }}
                  animate={isEdit ? undefined : { opacity: 1, x: 0 }}
                  transition={isEdit ? undefined : { delay: index * 0.05 }}
                  onClick={(e) => {
                    e.stopPropagation();
                    onCategoryClick(cat.id);
                  }}
                  className="bg-white dark:bg-slate-900 rounded-[1.5rem] min-w-[120px] md:min-w-[140px] overflow-hidden border border-slate-100 dark:border-slate-800 shadow-sm active:scale-95 transition-all group relative cursor-pointer snap-start"
                >
                  <div className="aspect-square bg-slate-50 dark:bg-slate-800 relative overflow-hidden">
                    <img
                      src={cat.image || undefined}
                      alt={cat.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 p-3 text-right">
                    <h3 className="text-xs font-black text-white">{cat.name}</h3>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
