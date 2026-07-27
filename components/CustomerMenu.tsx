
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ShoppingBag, 
  Plus, 
  Minus, 
  X, 
  Star, 
  Clock, 
  ChevronLeft, 
  ChevronDown,
  ChevronUp,
  Search,
  Check,
  ChefHat,
  User,
  Send,
  MapPin,
  Phone,
  ArrowLeft,
  Sun,
  Moon
} from 'lucide-react';
import { ComponentItem, Product } from '../types';
import { Search3DAnimation } from './Search3DAnimation';
import { INITIAL_PRODUCTS, INITIAL_CATEGORIES } from '../constants';
import { useTenant, useCatalog, useMenuDraft } from '../data/useRepositories';
import { useAppSession } from '../data/SessionProvider';
import { useRepositories } from '../data/RepositoryProvider';
import { MenuPublication, BranchProduct } from '../domain';

// --- SHARED MOCK DATA (Ideally this comes from a shared context or API) ---

import { 
  HeroBlock, 
  CategoryDisplayBlock, 
  FeaturedBlock, 
  FooterBlock, 
  CategoryProductsScreen, 
  ProductDetailSheet
} from './menu-blocks';


// --- MAIN PAGE ---

interface CustomerMenuProps {
  liveElements?: ComponentItem[];
  theme?: 'light' | 'dark';
  toggleTheme?: () => void;
  source?: 'PUBLICATION' | 'PREVIEW_DRAFT';
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

const CustomerMenu: React.FC<CustomerMenuProps> = ({ 
  liveElements, 
  theme, 
  toggleTheme, 
  source = 'PUBLICATION' 
}) => {
  const { menuRepository, catalogRepository } = useRepositories();
  const { activeBranch } = useAppSession();
  
  const branchId = activeBranch?.id || 'b1';

  const { restaurant, brandColor: tenantBrandColor, loading: tenantLoading } = useTenant();
  const { categories: repoCategories, products: repoProducts, loading: catalogLoading } = useCatalog();
  const { draftElements, publishedElements, loading: draftLoading } = useMenuDraft();

  // Load the active publication for this branch
  const [activePub, setActivePub] = useState<MenuPublication | null>(null);
  const [loadingPub, setLoadingPub] = useState(true);

  useEffect(() => {
    const fetchPub = async () => {
      try {
        setLoadingPub(true);
        const pub = await menuRepository.getActivePublication(branchId);
        setActivePub(pub);
      } catch (err) {
        console.error('Error fetching active publication:', err);
      } finally {
        setLoadingPub(false);
      }
    };
    fetchPub();
  }, [branchId, menuRepository]);

  // Load live BranchProducts for cross-referencing availability & visibility
  const [liveBranchProducts, setLiveBranchProducts] = useState<BranchProduct[]>([]);
  useEffect(() => {
    const loadLiveBranchProducts = async () => {
      try {
        const productsList = repoProducts && repoProducts.length > 0 ? repoProducts : INITIAL_PRODUCTS;
        const list: BranchProduct[] = [];
        for (const p of productsList) {
          const bp = await catalogRepository.getBranchProduct(p.id, branchId);
          if (bp) {
            list.push(bp);
          }
        }
        setLiveBranchProducts(list);
      } catch (err) {
        console.error('Error loading live branch products:', err);
      }
    };
    if (repoProducts && repoProducts.length > 0) {
      loadLiveBranchProducts();
    }
  }, [repoProducts, branchId, catalogRepository]);

  const [elements, setElements] = useState<ComponentItem[]>([]);
  const [resolvedCategories, setResolvedCategories] = useState<any[]>([]);
  const [resolvedProducts, setResolvedProducts] = useState<any[]>([]);

  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const [activeCategoryId, setActiveCategoryId] = useState<string | null>(null);

  const brandColor = tenantBrandColor || 'emerald';
  const restaurantName = restaurant?.name || 'رستوران لیمو';
  const restaurantLogo = restaurant?.logoUrl || '';

  useEffect(() => {
    if (source === 'PREVIEW_DRAFT') {
      // 1. Elements
      if (liveElements && liveElements.length > 0) {
        setElements(liveElements);
      } else if (draftElements && draftElements.length > 0) {
        setElements(draftElements);
      } else {
        setElements([]);
      }

      // 2. Categories
      const cats = repoCategories && repoCategories.length > 0 
        ? [...repoCategories].sort((a: any, b: any) => a.order - b.order) 
        : INITIAL_CATEGORIES;
      setResolvedCategories(cats);

      // 3. Products mapped with live draft pricing & live availability
      const prodsList = repoProducts && repoProducts.length > 0 ? repoProducts : INITIAL_PRODUCTS;
      const mapped = prodsList.map(p => {
        const bp = liveBranchProducts.find(x => x.productId === p.id);
        const priceVal = bp 
          ? (bp.pendingPriceIRR !== undefined && bp.hasPendingPublishPrice ? bp.pendingPriceIRR : bp.branchPriceIRR) 
          : null;
        const price = priceVal !== null ? priceVal / 10 : (p.price || 0);

        const discountVal = bp 
          ? (bp.pendingDiscountPriceIRR !== undefined && bp.hasPendingPublishPrice ? bp.pendingDiscountPriceIRR : bp.branchDiscountPriceIRR) 
          : null;
        const discountPrice = discountVal !== null && discountVal !== undefined ? discountVal / 10 : p.discountPrice;

        const isAvailable = bp ? bp.isAvailable : true;
        const isVisible = bp ? bp.isVisible : true;
        const orderingEnabled = bp ? bp.orderingEnabled : true;
        return {
          ...p,
          price,
          discountPrice,
          isAvailable,
          isVisible,
          orderingEnabled
        };
      }).filter(p => p.isVisible);
      setResolvedProducts(mapped);

    } else {
      // source === 'PUBLICATION'
      if (!activePub) {
        setElements([]);
        setResolvedCategories([]);
        setResolvedProducts([]);
        return;
      }

      // 1. Elements from snapshot
      setElements(activePub.snapshot.elements || []);

      // 2. Categories from snapshot
      const cats = activePub.snapshot.categories && activePub.snapshot.categories.length > 0
        ? [...activePub.snapshot.categories].sort((a: any, b: any) => a.order - b.order)
        : [];
      setResolvedCategories(cats);

      // 3. Products from snapshot mapped with snapshot pricing and live availability & visibility
      const prodsList = activePub.snapshot.products || [];
      const mapped = prodsList.map((p: any) => {
        // Pricing comes strictly from snapshot branch products list
        const snapBp = activePub.snapshot.branchProducts.find(x => x.productId === p.id);
        const price = snapBp ? (snapBp.branchPriceIRR / 10) : (p.price || 0);
        const discountPrice = snapBp && snapBp.branchDiscountPriceIRR !== undefined && snapBp.branchDiscountPriceIRR !== null
          ? (snapBp.branchDiscountPriceIRR / 10) 
          : p.discountPrice;

        // Availability and visibility come live!
        const liveBp = liveBranchProducts.find(x => x.productId === p.id);
        const isAvailable = liveBp ? liveBp.isAvailable : true;
        const isVisible = liveBp ? liveBp.isVisible : true;
        const orderingEnabled = liveBp ? liveBp.orderingEnabled : true;

        return {
          ...p,
          price,
          discountPrice,
          isAvailable,
          isVisible,
          orderingEnabled
        };
      }).filter(p => p.isVisible);
      setResolvedProducts(mapped);
    }
  }, [source, liveElements, draftElements, activePub, repoCategories, repoProducts, liveBranchProducts]);

  const [localIsDark, setLocalIsDark] = useState(() => {
    if (typeof window !== 'undefined') {
      return (localStorage.getItem('vitrin_theme') || localStorage.getItem('vitrin_preview_theme')) === 'dark';
    }
    return false;
  });

  const isDark = theme !== undefined ? (theme === 'dark') : localIsDark;

  const handleToggleTheme = () => {
    if (toggleTheme) {
      toggleTheme();
    } else {
      setLocalIsDark(prev => {
        const next = !prev;
        localStorage.setItem('vitrin_theme', next ? 'dark' : 'light');
        localStorage.setItem('vitrin_preview_theme', next ? 'dark' : 'light');
        return next;
      });
    }
  };

  useEffect(() => {
    if (theme === undefined) {
      if (localIsDark) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    }
  }, [localIsDark, theme]);

  const categories = resolvedCategories;
  const products = resolvedProducts;

  if (tenantLoading || catalogLoading || draftLoading || loadingPub) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center font-['Vazirmatn']">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-slate-200 border-t-emerald-600 rounded-full animate-spin" />
          <p className="text-slate-500 dark:text-slate-400 text-sm font-bold">در حال بارگذاری منو...</p>
        </div>
      </div>
    );
  }

  if (source === 'PUBLICATION' && !activePub) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex flex-col items-center justify-center p-6 text-center font-['Vazirmatn'] relative" style={{ direction: 'rtl' }}>
        <div className="absolute inset-0 opacity-40">
          <div className="w-full h-full bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:16px_16px] dark:bg-[radial-gradient(#334155_1px,transparent_1px)]" />
        </div>
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-slate-800 p-10 rounded-3xl shadow-xl shadow-slate-200/50 dark:shadow-none border border-slate-100 dark:border-slate-700/50 max-w-md w-full relative z-10 flex flex-col items-center gap-6"
        >
          <div className="w-20 h-20 rounded-2xl bg-amber-50 dark:bg-amber-950/40 flex items-center justify-center text-amber-500 animate-pulse animate-none">
            <Clock className="w-10 h-10 animate-none" />
          </div>
          <div className="space-y-2">
            <h2 className="text-xl font-extrabold text-slate-800 dark:text-slate-100">منو هنوز منتشر نشده است</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">این شعبه هنوز منوی عمومی خود را منتشر نکرده است. لطفاً بعداً مراجعه کنید یا با مدیریت تماس بگیرید.</p>
          </div>
          <div className="text-xs font-mono text-slate-400 dark:text-slate-500 bg-slate-50 dark:bg-slate-900/40 px-3 py-1.5 rounded-lg border border-slate-100 dark:border-slate-800">
            {restaurantName} - {activeBranch?.name || 'شعبه مرکزی'}
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen font-['Vazirmatn'] pb-32 max-w-md md:max-w-3xl lg:max-w-5xl mx-auto shadow-2xl relative min-w-0 border-x transition-colors duration-200 ${isDark ? 'dark bg-slate-950 border-slate-800 text-slate-100' : 'bg-[#F2F4F7] border-slate-200 text-slate-900'}`}>
      
      {/* Top Navigation - Styled to Match Studio Customizations */}
      <div className="sticky top-0 z-30 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-100 dark:border-slate-800 px-5 py-3 flex items-center justify-between shadow-sm min-h-[60px] transition-colors">
        {isSearchOpen ? (
          <div className="flex-1 flex items-center gap-3">
            <button 
              onClick={() => {
                setIsSearchOpen(false);
                setSearchQuery('');
              }}
              className="w-9 h-9 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-xl flex items-center justify-center cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-750 transition-colors"
            >
              <ArrowLeft className="w-4 h-4 text-slate-500 dark:text-slate-400" />
            </button>
            <div className="flex-1 relative">
              <input 
                type="text"
                autoFocus
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="جستجوی پیتزا، برگر، سالاد و..."
                className={`w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 pr-10 py-2 text-xs outline-none focus:border-${brandColor}-500 transition-colors font-medium text-right text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500`}
              />
              <Search className="w-4 h-4 text-slate-400 dark:text-slate-500 absolute right-3.5 top-1/2 -translate-y-1/2" />
              {searchQuery && (
                <button 
                  onClick={() => setSearchQuery('')}
                  className="p-1 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-500 dark:text-slate-400 rounded-full absolute left-2 top-1/2 -translate-y-1/2 transition-colors flex items-center justify-center w-5 h-5"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>
          </div>
        ) : (
          <>
            <div className="flex items-center gap-1.5">
              <button 
                onClick={() => setIsSearchOpen(true)}
                className="w-9 h-9 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700/50 rounded-xl flex items-center justify-center cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-750 transition-colors"
                title="جستجو"
              >
                <Search className="w-4 h-4 text-slate-500 dark:text-slate-400" />
              </button>
              
              <button 
                onClick={handleToggleTheme}
                className="w-9 h-9 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700/50 rounded-xl flex items-center justify-center cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-750 transition-colors"
                title={isDark ? "حالت روز" : "حالت شب"}
              >
                {isDark ? (
                  <Sun className="w-4 h-4 text-amber-500" />
                ) : (
                  <Moon className="w-4 h-4 text-slate-500" />
                )}
              </button>
            </div>
            
            <div className="flex items-center gap-2">
              {restaurantLogo && restaurantLogo.trim() !== '' ? (
                <img src={restaurantLogo || undefined} alt="Logo" className="w-8 h-8 rounded-lg object-cover border border-slate-100 dark:border-slate-800" />
              ) : (
                <div className={`w-8 h-8 rounded-lg bg-${brandColor}-50 dark:bg-${brandColor}-950/20 flex items-center justify-center border border-${brandColor}-100 dark:border-${brandColor}-800/30`}>
                  <span className={`text-xs font-bold text-${brandColor}-600 dark:text-${brandColor}-400`}>{restaurantName ? restaurantName[0] : 'ر'}</span>
                </div>
              )}
              <div className="flex flex-col items-start text-right">
                <span className="text-[9px] font-black text-slate-400 dark:text-slate-500">بهترین طعم، با بالاترین کیفیت</span>
                <span className={`font-black text-slate-900 dark:text-slate-100 text-sm tracking-tight hover:text-${brandColor}-600 dark:hover:text-${brandColor}-400 transition-colors`}>{restaurantName}</span>
              </div>
            </div>

            <button 
              onClick={() => setIsProfileOpen(true)}
              className="w-9 h-9 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700/50 rounded-xl flex items-center justify-center cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-750 transition-colors"
            >
              <User className="w-4 h-4 text-slate-500 dark:text-slate-400" />
            </button>
          </>
        )}
      </div>

      {/* Dynamic Content Renderer or Search View */}
      <div className="flex flex-col">
        {isSearchOpen ? (
          <div className="flex flex-col px-4 py-4 space-y-4">
            <h3 className="text-xs font-black text-slate-400 mb-2 text-right">
              {searchQuery.trim() === '' ? 'جستجو در محصولات منو' : `نتایج جستجو برای "${searchQuery}"`}
            </h3>
            {searchQuery.trim() === '' ? (
              <div className="text-center text-slate-400 flex flex-col items-center">
                <Search3DAnimation brandColor={brandColor} />
                <p className="font-black text-sm text-slate-700 mt-2 max-w-[280px] leading-relaxed">نام غذا، دسته‌بندی یا مواد تشکیل‌دهنده را جستجو کنید...</p>
                <p className="text-[10px] text-slate-400 font-bold mt-1.5">پیتزا، برگر، سالاد، نوشیدنی یا دسر</p>
              </div>
            ) : (() => {
              const q = searchQuery.toLowerCase();
              const filtered = products.filter(product => {
                return (
                  product.name.toLowerCase().includes(q) ||
                  product.category.toLowerCase().includes(q) ||
                  product.description.toLowerCase().includes(q) ||
                  (product.rawMaterials && product.rawMaterials.some(m => m.toLowerCase().includes(q)))
                );
              });

              if (filtered.length === 0) {
                return (
                  <div className="p-10 text-center text-slate-400 flex flex-col items-center mt-6">
                    <X className="w-12 h-12 mb-4 opacity-20 text-rose-500" />
                    <p className="font-bold text-sm text-slate-500">محصولی با این مشخصات یافت نشد.</p>
                  </div>
                );
              }

              return (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3.5" dir="rtl">
                  {filtered.map(product => {
                    const isAvailable = product.isAvailable !== false;
                    const hasDiscount = product.discountPrice !== undefined && product.discountPrice > 0 && product.discountPrice < product.price;

                    return (
                      <motion.div 
                        key={product.id}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        onClick={() => setSelectedProduct(product)}
                        className={`bg-white rounded-[1.5rem] overflow-hidden border border-slate-100/80 shadow-sm active:scale-95 transition-all group cursor-pointer text-right relative flex flex-col h-full ${
                          !isAvailable ? 'opacity-65 grayscale-[20%]' : ''
                        }`}
                      >
                        <div className="aspect-square bg-slate-50 relative overflow-hidden shrink-0">
                          <img referrerPolicy="no-referrer" src={product.image || undefined} alt={product.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                          
                          {/* Discount percentage badge */}
                          {isAvailable && hasDiscount && (
                            <span className="absolute bottom-2 right-2 z-10 text-[9px] font-black bg-rose-500 text-white px-1.5 py-0.5 rounded shadow-xs">
                              {Math.round(((product.price - product.discountPrice!) / product.price) * 100)}% تخفیف
                            </span>
                          )}

                          {/* Unavailable Overlay */}
                          {!isAvailable && (
                            <div className="absolute inset-0 bg-slate-950/40 backdrop-blur-xs flex items-center justify-center z-10">
                              <span className="bg-slate-900/90 text-white text-[10px] font-black px-2.5 py-1 rounded-lg border border-white/10">ناموجود</span>
                            </div>
                          )}
                        </div>
                        <div className="p-3 flex flex-col justify-between flex-1">
                          <div>
                            <h4 className="text-xs font-black text-slate-800 mb-1 line-clamp-1">{product.name}</h4>
                            <p className="text-[9px] text-slate-400 mb-2 font-bold">{product.category}</p>
                          </div>
                          <div className="flex items-end justify-between mt-1">
                            <div className="flex flex-col text-right">
                              {hasDiscount ? (
                                <>
                                  <span className="text-[9px] text-slate-400 line-through leading-none mb-0.5">
                                    {(product.price || 0).toLocaleString()}
                                  </span>
                                  <span className="text-xs font-black text-rose-600 leading-none font-sans">
                                    {(product.discountPrice || 0).toLocaleString()}{' '}
                                    <span className="text-[9px] font-normal text-slate-400">تومان</span>
                                  </span>
                                </>
                              ) : (
                                <span className="text-xs font-black text-slate-900 leading-none">
                                  {(product.price || 0).toLocaleString()}{' '}
                                  <span className="text-[9px] font-normal text-slate-400">تومان</span>
                                </span>
                              )}
                            </div>
                            <span className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold transition-all ${
                              !isAvailable
                                ? 'bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200'
                                : `bg-${brandColor}-50 text-${brandColor}-600 hover:bg-${brandColor}-100`
                            }`}>
                              <Plus className="w-3.5 h-3.5" />
                            </span>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              );
            })()}
          </div>
        ) : elements.length === 0 ? (
          <div className="p-10 text-center text-slate-400 flex flex-col items-center mt-10">
            <Clock className="w-12 h-12 mb-4 opacity-20" />
            <p className="font-bold text-sm">منوی رستوران در حال آماده‌سازی است...</p>
          </div>
        ) : (
          <>
            {elements.map((el) => {
               if (el.hidden) return null;
               if (el.type === 'hero') {
                 return (
                   <HeroBlock 
                     key={el.id} 
                     element={el} 
                     brandColor={brandColor} 
                     mode="live" 
                   />
                 );
               }
               if (el.type === 'featured') {
                 return (
                   <FeaturedBlock 
                     key={el.id} 
                     element={el} 
                     onProductClick={setSelectedProduct} 
                     brandColor={brandColor} 
                     mode="live" 
                     products={products}
                   />
                 );
               }
               if (el.type === 'category-display') {
                 return (
                   <CategoryDisplayBlock 
                     key={el.id}
                     element={el}
                     brandColor={brandColor} 
                     onCategoryClick={(id) => setActiveCategoryId(id)} 
                     mode="live"
                     categories={categories}
                   />
                 );
               }
               if (el.type === 'footer') {
                 return (
                   <FooterBlock 
                     key={el.id} 
                     element={el} 
                     brandColor={brandColor} 
                     mode="live" 
                   />
                 );
               }
               // Fallback for default or custom blocks
               return (
                 <div 
                   key={el.id}
                   className="mx-4 my-2 p-6 rounded-2xl bg-white border border-slate-100 shadow-sm text-center"
                 >
                   <div className="py-4">
                     <h3 style={{ color: el.settings?.color || 'black', fontSize: el.settings?.fontSize }} className="font-bold">
                       {el.settings?.title}
                     </h3>
                     {el.type === 'action-btn' && (
                       <button className={`mt-3 bg-${brandColor}-600 text-white px-6 py-2 rounded-xl text-sm font-bold w-full`}>
                         کلیک کنید
                       </button>
                     )}
                   </div>
                 </div>
               );
             })}

             <AnimatePresence>
               {activeCategoryId && (
                 <CategoryProductsScreen
                   categoryId={activeCategoryId}
                   onBack={() => setActiveCategoryId(null)}
                   onProductClick={setSelectedProduct}
                   brandColor={brandColor}
                   mode="live"
                   categories={categories}
                   products={products}
                 />
               )}
             </AnimatePresence>
          </>
        )}
      </div>

      <ProductDetailSheet 
         product={selectedProduct} 
         isOpen={!!selectedProduct} 
         onClose={() => setSelectedProduct(null)} 
         onAddToCart={() => {}}
         brandColor={brandColor}
         mode="live"
      />

    </div>
  );
};

export default CustomerMenu;
