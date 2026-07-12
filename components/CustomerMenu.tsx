
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

// --- SHARED MOCK DATA (Ideally this comes from a shared context or API) ---

import { 
  HeroBlock, 
  CategoryDisplayBlock, 
  FeaturedBlock, 
  FooterBlock, 
  CategoryProductsScreen, 
  ProductDetailSheet, 
  CartBar, 
  CartDrawer 
} from './menu-blocks';

const ProfileModal = ({ isOpen, onClose, brandColor }: { isOpen: boolean; onClose: () => void; brandColor: string }) => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [table, setTable] = useState('۵');
  const [orders, setOrders] = useState<any[]>([]);
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    if (isOpen) {
      const savedName = localStorage.getItem('vitrin_customer_name') || '';
      const savedPhone = localStorage.getItem('vitrin_customer_phone') || '';
      const savedTable = localStorage.getItem('vitrin_customer_table') || '۵';
      const savedOrders = localStorage.getItem('vitrin_orders') || '[]';
      
      setName(savedName);
      setPhone(savedPhone);
      setTable(savedTable);
      try {
        setOrders(JSON.parse(savedOrders));
      } catch (e) {
        setOrders([]);
      }
      setIsSaved(false);
    }
  }, [isOpen]);

  const handleSave = () => {
    localStorage.setItem('vitrin_customer_name', name.trim());
    localStorage.setItem('vitrin_customer_phone', phone.trim());
    localStorage.setItem('vitrin_customer_table', table);
    setIsSaved(true);
    setTimeout(() => {
      setIsSaved(false);
      onClose();
    }, 1200);
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'new': return { label: 'ثبت شده', bg: 'bg-amber-50 text-amber-700 border-amber-100' };
      case 'preparing': 
      case 'preparing-chef': return { label: 'در حال آماده‌سازی', bg: 'bg-orange-50 text-orange-700 border-orange-100' };
      case 'ready': return { label: 'آماده تحویل', bg: 'bg-blue-50 text-blue-700 border-blue-100' };
      case 'delivered':
      case 'completed': return { label: 'تحویل شده', bg: 'bg-emerald-50 text-emerald-700 border-emerald-100' };
      case 'canceled': return { label: 'لغو شده', bg: 'bg-rose-50 text-rose-700 border-rose-100' };
      default: return { label: 'نامشخص', bg: 'bg-slate-50 text-slate-700 border-slate-100' };
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-end justify-center">
        <motion.div 
           initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
           onClick={onClose} className="fixed inset-0 bg-black/60 backdrop-blur-md z-40 pointer-events-auto"
        />
        <motion.div 
          initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="fixed bottom-0 left-0 right-0 z-50 bg-[#F8FAFC] dark:bg-slate-950 border-t border-slate-100 dark:border-slate-800 rounded-t-[2.5rem] h-[85vh] overflow-hidden flex flex-col max-w-md mx-auto shadow-[0_-10px_40px_rgba(0,0,0,0.2)] transition-colors"
        >
          {/* Header */}
          <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-white dark:bg-slate-900 shrink-0 transition-colors">
            <div className="flex items-center gap-2">
              <div className={`w-8 h-8 rounded-xl bg-${brandColor}-50 dark:bg-${brandColor}-950/30 flex items-center justify-center text-${brandColor}-600 dark:text-${brandColor}-400`}>
                <User className="w-4 h-4" />
              </div>
              <h2 className="text-lg font-black text-slate-900 dark:text-slate-100">پروفایل و سفارش‌های من</h2>
            </div>
            <button onClick={onClose} className="p-1.5 bg-slate-100 dark:bg-slate-800 rounded-full text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Scrollable Container */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6 text-right">
            
            {/* User Details Form */}
            <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm space-y-4 transition-colors">
              <h3 className="text-xs font-black text-slate-800 dark:text-slate-200 border-r-2 border-slate-900 dark:border-slate-100 pr-2 leading-none">اطلاعات کاربری</h3>
              
              <div className="space-y-3 pt-1">
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 dark:text-slate-500 mb-1.5 text-right">نام و نام خانوادگی</label>
                  <input 
                    type="text" 
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="مثال: علی محمدی"
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-xs outline-none focus:border-slate-400 dark:focus:border-slate-700 transition-colors font-medium text-slate-800 dark:text-slate-100 text-right"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-400 dark:text-slate-500 mb-1.5 text-right">شماره موبایل (اختیاری)</label>
                  <input 
                    type="tel" 
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="مثال: ۰۹۱۲۳۴۵۶۷۸۹"
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-xs outline-none focus:border-slate-400 dark:focus:border-slate-700 transition-colors font-medium text-slate-800 dark:text-slate-100 text-left"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-400 dark:text-slate-500 mb-1.5 text-right">میز پیش‌فرض</label>
                  <div className="grid grid-cols-5 gap-2 font-['Vazirmatn']">
                    {['۱', '۲', '۵', '۸', '۱۲'].map((num) => (
                      <button 
                        key={num} 
                        type="button"
                        onClick={() => setTable(num)}
                        className={`py-2 rounded-xl border text-xs font-bold transition-all cursor-pointer ${table === num ? `bg-${brandColor}-50 dark:bg-${brandColor}-950/20 border-${brandColor}-500 text-${brandColor}-700 dark:text-${brandColor}-400 shadow-sm ring-2 ring-${brandColor}-500/10` : 'border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800/50'}'`}
                      >
                        میز {num}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <button 
                onClick={handleSave}
                disabled={isSaved}
                className={`w-full py-2.5 rounded-xl font-bold text-xs shadow-md transition-all flex items-center justify-center gap-1.5 cursor-pointer ${isSaved ? 'bg-emerald-600 text-white shadow-emerald-500/10' : `bg-${brandColor}-600 text-white shadow-${brandColor}-500/10 hover:bg-${brandColor}-500`}`}
              >
                {isSaved ? (
                  <>
                    <Check className="w-4 h-4" />
                    تغییرات ذخیره شد
                  </>
                ) : (
                  'ثبت و ذخیره تغییرات'
                )}
              </button>
            </div>

            {/* Orders History Section */}
            <div className="space-y-3">
              <h3 className="text-xs font-black text-slate-800 dark:text-slate-200 border-r-2 border-slate-900 dark:border-slate-100 pr-2 leading-none">تاریخچه سفارش‌ها ({orders.length})</h3>
              
              {orders.length === 0 ? (
                <div className="bg-white dark:bg-slate-900 p-8 rounded-2xl border border-slate-100 dark:border-slate-800 text-center flex flex-col items-center justify-center space-y-3 shadow-sm transition-colors">
                  <div className="w-12 h-12 rounded-full bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-slate-300 dark:text-slate-600">
                     <ChefHat className="w-6 h-6 stroke-[1.5]" />
                  </div>
                  <p className="text-xs font-bold text-slate-400 dark:text-slate-500">هنوز سفارشی برای شما ثبت نشده است</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {orders.map((ord: any) => {
                    const statusStyle = getStatusLabel(ord.status);
                    return (
                      <div key={ord.id} className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm space-y-3 transition-colors">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-black text-slate-800 dark:text-slate-200">{ord.id}</span>
                          <span className={`px-2 py-0.5 rounded-lg border text-[9px] font-black ${statusStyle.bg}`}>
                            {statusStyle.label}
                          </span>
                        </div>
                        
                        <div className="text-[11px] text-slate-500 dark:text-slate-400 space-y-1 font-medium text-right">
                          {ord.items && ord.items.map((itemStr: string, idx: number) => (
                            <div key={idx} className="flex items-center justify-start gap-1.5 direction-rtl">
                              <span className={`w-1 h-1 rounded-full bg-${brandColor}-500 shrink-0`} />
                              <span>{itemStr}</span>
                            </div>
                          ))}
                        </div>

                        <div className="border-t border-slate-50 dark:border-slate-800/60 pt-2.5 flex items-center justify-between text-xs font-bold">
                          <span className="text-slate-400 dark:text-slate-500">میز {ord.tableNumber} • {ord.timestamp || 'هم‌اکنون'}</span>
                          <span className="text-slate-900 dark:text-slate-100 font-black">{ord.totalPrice.toLocaleString()} تومان</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

// --- MAIN PAGE ---

interface CustomerMenuProps {
  liveElements?: ComponentItem[];
  theme?: 'light' | 'dark';
  toggleTheme?: () => void;
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

const CustomerMenu: React.FC<CustomerMenuProps> = ({ liveElements, theme, toggleTheme }) => {
  const [elements, setElements] = useState<ComponentItem[]>([]);
  const [cart, setCart] = useState<{ product: Product, qty: number, selectedModifiers?: Record<string, string>, singlePrice?: number }[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [brandColor, setBrandColor] = useState('emerald');
  const [restaurantName, setRestaurantName] = useState('رستوران لیمو');
  const [restaurantLogo, setRestaurantLogo] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const [activeCategoryId, setActiveCategoryId] = useState<string | null>(null);
  const [categories, setCategories] = useState<any[]>(INITIAL_CATEGORIES);
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);

  useEffect(() => {
    const handleSync = () => {
      // 1. Try to get brand color, Name & Logo
      const savedColor = localStorage.getItem('vitrin_brand_color');
      const savedName = localStorage.getItem('vitrin_restaurant_name');
      const savedLogo = localStorage.getItem('vitrin_restaurant_logo');
      if (savedColor) setBrandColor(savedColor);
      if (savedName) setRestaurantName(savedName);
      if (savedLogo) setRestaurantLogo(savedLogo);

      // 2. Sync Categories & Products
      const savedCats = localStorage.getItem('vitrin_categories');
      if (savedCats) {
        try {
          setCategories(JSON.parse(savedCats).sort((a: any, b: any) => a.order - b.order));
        } catch (e) {
          console.error(e);
        }
      } else {
        setCategories(INITIAL_CATEGORIES);
      }

      const savedProds = localStorage.getItem('vitrin_products');
      if (savedProds) {
        try {
          setProducts(JSON.parse(savedProds));
        } catch (e) {
          console.error(e);
        }
      } else {
        setProducts(INITIAL_PRODUCTS);
      }

      // 3. Load Elements Logic - Prioritize draft design for perfect preview matching
      if (liveElements && liveElements.length > 0) {
        setElements(liveElements);
      } else {
        const draft = localStorage.getItem('vitrin_designer_draft');
        const published = localStorage.getItem('vitrin_published_design');
        
        if (draft) {
          setElements(JSON.parse(draft));
        } else if (published) {
          setElements(JSON.parse(published));
        }
      }
    };

    handleSync();

    window.addEventListener('focus', handleSync);
    window.addEventListener('storage', handleSync);
    const interval = setInterval(handleSync, 1000);

    return () => {
      window.removeEventListener('focus', handleSync);
      window.removeEventListener('storage', handleSync);
      clearInterval(interval);
    };
  }, [liveElements]);

  const addToCart = (product: Product, qty: number, selectedModifiers?: Record<string, string>, singlePrice?: number) => {
    setCart(prev => {
      const existingIdx = prev.findIndex(item => 
        item.product.id === product.id && 
        JSON.stringify(item.selectedModifiers) === JSON.stringify(selectedModifiers)
      );
      if (existingIdx > -1) {
        return prev.map((item, idx) => idx === existingIdx ? { ...item, qty: item.qty + qty } : item);
      }
      return [...prev, { product, qty, selectedModifiers, singlePrice: singlePrice || product.price }];
    });
  };

  const updateCartQty = (product: Product, selectedModifiers: Record<string, string> | undefined, newQty: number) => {
    setCart(prev => {
      if (newQty <= 0) {
        return prev.filter(item => 
          !(item.product.id === product.id && JSON.stringify(item.selectedModifiers) === JSON.stringify(selectedModifiers))
        );
      }
      return prev.map(item => 
        (item.product.id === product.id && JSON.stringify(item.selectedModifiers) === JSON.stringify(selectedModifiers))
          ? { ...item, qty: newQty }
          : item
      );
    });
  };

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

  const cartTotal = cart.reduce((acc, item) => acc + ((item.singlePrice || item.product.price) * item.qty), 0);
  const cartCount = cart.reduce((acc, item) => acc + item.qty, 0);

  return (
    <div className={`min-h-screen font-['Vazirmatn'] pb-32 max-w-md mx-auto shadow-2xl relative min-w-0 border-x transition-colors duration-200 ${isDark ? 'dark bg-slate-950 border-slate-800 text-slate-100' : 'bg-[#F2F4F7] border-slate-200 text-slate-900'}`}>
      
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
                <div className="grid grid-cols-2 gap-3.5" dir="rtl">
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
                                    {product.price.toLocaleString()}
                                  </span>
                                  <span className="text-xs font-black text-rose-600 leading-none font-sans">
                                    {product.discountPrice!.toLocaleString()}{' '}
                                    <span className="text-[9px] font-normal text-slate-400">تومان</span>
                                  </span>
                                </>
                              ) : (
                                <span className="text-xs font-black text-slate-900 leading-none">
                                  {product.price.toLocaleString()}{' '}
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
                />
              )}
            </AnimatePresence>
          </>
        )}
      </div>

      {/* Floating Cart */}
      <CartBar 
        cart={cart} 
        products={products} 
        brandColor={brandColor} 
        mode="live" 
        onClick={() => setIsCheckoutOpen(true)} 
      />

      <ProductDetailSheet 
         product={selectedProduct} 
         isOpen={!!selectedProduct} 
         onClose={() => setSelectedProduct(null)} 
         onAddToCart={addToCart}
         brandColor={brandColor}
         mode="live"
      />

      <CartDrawer 
         isOpen={isCheckoutOpen}
         onClose={() => setIsCheckoutOpen(false)}
         cart={cart}
         products={products}
         onRemoveItem={(product, modifiers) => updateCartQty(product, modifiers, 0)}
         onUpdateQty={updateCartQty}
         brandColor={brandColor}
         onOrderPlaced={() => setCart([])}
         mode="live"
      />

      <ProfileModal 
         isOpen={isProfileOpen}
         onClose={() => setIsProfileOpen(false)}
         brandColor={brandColor}
      />

    </div>
  );
};

export default CustomerMenu;
