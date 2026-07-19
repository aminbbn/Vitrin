import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, 
  Trash2, 
  Search,
  Image as ImageIcon, 
  Edit3,
  Check,
  X,
  Clock,
  DollarSign,
  Layers,
  AlertCircle,
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
  Sparkles
} from 'lucide-react';
import { Product, ModifierGroup, ProductModifier, Category } from '../types';
import { useCatalog, useAppSession } from '../data/useRepositories';
import { useRepositories } from '../data/RepositoryProvider';
import { toProductViewModel } from '../types';
import { BranchProduct, Product as DomainProduct } from '../domain';

// Animation Variants
const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 15 },
  show: { 
    opacity: 1, 
    y: 0,
    transition: { type: 'spring' as const, stiffness: 350, damping: 25 }
  },
  exit: { opacity: 0, scale: 0.95, transition: { duration: 0.15 } }
};

interface ProductManagerProps {
  brandColor: string;
  highlightedItemId?: string | null;
  clearHighlight?: () => void;
}

const ProductManager: React.FC<ProductManagerProps> = ({ brandColor, highlightedItemId, clearHighlight }) => {
  const [view, setView] = useState<'list' | 'edit' | 'create'>('list');
  const { activeBranch, activeRestaurant, setActiveBranch } = useAppSession();
  const { tenantRepository } = useRepositories();
  
  const { 
    products: domainProducts, 
    categories, 
    saveProducts, 
    loading: catalogLoading, 
    catalogRepository, 
    refetch 
  } = useCatalog();

  const [activeCategory, setActiveCategory] = useState('همه');
  const [searchQuery, setSearchQuery] = useState('');
  const [localHighlight, setLocalHighlight] = useState<string | null>(null);
  const [branches, setBranches] = useState<any[]>([]);
  const [branchProducts, setBranchProducts] = useState<Record<string, BranchProduct>>({});
  const [loadingBranchProducts, setLoadingBranchProducts] = useState(false);

  const scrollRef = useRef<HTMLDivElement>(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(false);

  // Form State
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Modal State
  const [productToDelete, setProductToDelete] = useState<string | null>(null);

  // Load branches
  useEffect(() => {
    if (tenantRepository) {
      tenantRepository.getBranches()
        .then(setBranches)
        .catch(err => console.error('Error loading branches:', err));
    }
  }, [tenantRepository]);

  // Load branch products for active branch
  const loadBranchProducts = useCallback(async () => {
    if (!activeBranch || !catalogRepository) return;
    setLoadingBranchProducts(true);
    try {
      const bps: Record<string, BranchProduct> = {};
      for (const p of domainProducts) {
        const bp = await catalogRepository.getBranchProduct(p.id, activeBranch.id);
        if (bp) {
          bps[p.id] = bp;
        }
      }
      setBranchProducts(bps);
    } catch (err) {
      console.error('Error loading branch products:', err);
    } finally {
      setLoadingBranchProducts(false);
    }
  }, [domainProducts, activeBranch, catalogRepository]);

  useEffect(() => {
    loadBranchProducts();
  }, [loadBranchProducts]);

  const checkScroll = () => {
    if (scrollRef.current) {
      const { scrollWidth, clientWidth } = scrollRef.current;
      const reachedHalfPage = scrollWidth > (window.innerWidth / 2);
      const canScroll = scrollWidth > clientWidth;
      const shouldShow = canScroll && reachedHalfPage;
      setShowLeftArrow(shouldShow);
      setShowRightArrow(shouldShow);
    }
  };

  useEffect(() => {
    checkScroll();
    window.addEventListener('resize', checkScroll);
    return () => window.removeEventListener('resize', checkScroll);
  }, [categories]);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = 200;
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  useEffect(() => {
    if (highlightedItemId) {
      setLocalHighlight(highlightedItemId);
      const timer = setTimeout(() => {
        setLocalHighlight(null);
        if (clearHighlight) clearHighlight();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [highlightedItemId, clearHighlight]);

  const handleAddToBranch = async (productId: string) => {
    if (!activeBranch || !catalogRepository) return;
    const defaultBp: BranchProduct = {
      id: `bp-${productId}-${activeBranch.id}`,
      branchId: activeBranch.id,
      productId,
      branchPriceRial: 150000, // Default price: 15,000 Tomans
      isAvailable: true,
      availability: 'AVAILABLE',
      orderingEnabled: true,
      isVisible: true
    };
    await catalogRepository.saveBranchProduct(defaultBp);
    await loadBranchProducts();
  };

  const handlePublishPrices = async () => {
    if (!activeBranch || !catalogRepository) return;
    try {
      await catalogRepository.publishBranchProducts(activeBranch.id);
      await refetch();
      await loadBranchProducts();
    } catch (err) {
      console.error('Error publishing prices:', err);
    }
  };

  const handleEdit = (product: Product) => {
    setEditingProduct({ ...product });
    setView('edit');
  };

  const handleCreate = () => {
    const defaultCat = categories.length > 0 ? categories[0] : null;
    setEditingProduct({
      id: `p-${Math.random().toString(36).substr(2, 9)}`,
      name: '',
      category: defaultCat ? defaultCat.name : 'دسته بندی نشده',
      categoryId: defaultCat ? defaultCat.id : undefined,
      description: '',
      price: 15000,
      image: '',
      estimatedTime: '15 دقیقه',
      modifiers: [],
      isAvailable: true,
      discountPrice: undefined,
      tags: [],
      internalName: ''
    });
    setView('create');
  };

  const handleSave = async () => {
    if (!editingProduct || !editingProduct.name) return;
    if (!editingProduct.categoryId) {
      alert("انتخاب دسته‌بندی برای محصول الزامی است.");
      return;
    }

    // 1. Map edited fields back to the clean Domain Product model
    const updatedDomainProduct: DomainProduct = {
      id: editingProduct.id,
      categoryId: editingProduct.categoryId,
      name: editingProduct.name,
      internalName: editingProduct.internalName || editingProduct.name,
      description: editingProduct.description || '',
      imageUrl: editingProduct.image || '',
      estimatedTime: editingProduct.estimatedTime || '15 دقیقه',
      rating: editingProduct.rating || 5,
      tags: editingProduct.tags || [],
      state: editingProduct.state || 'active',
      createdAt: new Date().toISOString(),
      modifierGroups: editingProduct.modifiers.map(g => ({
        id: g.id,
        name: g.name,
        type: g.type,
        options: g.options.map(opt => ({
          id: opt.id,
          name: opt.name,
          priceRial: opt.price * 10 // UI Tomans to Domain Rial
        }))
      }))
    };

    // 2. Map and save BranchProduct fields
    if (activeBranch && catalogRepository) {
      const currentBp = branchProducts[editingProduct.id];
      const formPriceRial = editingProduct.price * 10;
      const formDiscountRial = editingProduct.discountPrice !== undefined ? editingProduct.discountPrice * 10 : undefined;

      if (currentBp) {
        // Evaluate if pricing changed relative to published pricing
        let hasPendingChange = currentBp.hasPendingPublishPrice || false;
        let pendingPrice = currentBp.pendingPriceRial;
        let pendingDiscount = currentBp.pendingDiscountPriceRial;

        if (formPriceRial !== currentBp.branchPriceRial) {
          pendingPrice = formPriceRial;
          hasPendingChange = true;
        } else {
          pendingPrice = undefined;
        }

        if (formDiscountRial !== currentBp.branchDiscountPriceRial) {
          pendingDiscount = formDiscountRial;
          hasPendingChange = true;
        } else {
          pendingDiscount = undefined;
        }

        const updatedBp: BranchProduct = {
          ...currentBp,
          pendingPriceRial: pendingPrice,
          pendingDiscountPriceRial: pendingDiscount,
          hasPendingPublishPrice: hasPendingChange,
          isAvailable: editingProduct.isAvailable !== false,
          availability: editingProduct.isAvailable !== false ? 'AVAILABLE' : 'UNAVAILABLE'
        };
        await catalogRepository.saveBranchProduct(updatedBp);
      } else {
        // Initialize branch product for newly created product
        const newBp: BranchProduct = {
          id: `bp-${editingProduct.id}-${activeBranch.id}`,
          branchId: activeBranch.id,
          productId: editingProduct.id,
          branchPriceRial: formPriceRial,
          branchDiscountPriceRial: formDiscountRial,
          isAvailable: editingProduct.isAvailable !== false,
          availability: editingProduct.isAvailable !== false ? 'AVAILABLE' : 'UNAVAILABLE',
          orderingEnabled: true,
          isVisible: true
        };
        await catalogRepository.saveBranchProduct(newBp);
      }
    }

    // 3. Save master list
    const otherProducts = domainProducts.filter(p => p.id !== editingProduct.id);
    await saveProducts([...otherProducts, updatedDomainProduct]);

    // 4. Reload states and head back to list view
    await refetch();
    await loadBranchProducts();
    setView('list');
    setEditingProduct(null);
  };

  const initiateDelete = (id: string) => {
    setProductToDelete(id);
  };

  const confirmDelete = async () => {
    if (productToDelete) {
      const prod = domainProducts.find(p => p.id === productToDelete);
      if (prod) {
        // Soft archive instead of hard delete
        const updatedProd: DomainProduct = {
          ...prod,
          state: 'archived'
        };
        const otherProducts = domainProducts.filter(p => p.id !== productToDelete);
        await saveProducts([...otherProducts, updatedProd]);
      }
      setProductToDelete(null);
      await refetch();
      await loadBranchProducts();
      if (view !== 'list') setView('list');
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !editingProduct) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setEditingProduct({
        ...editingProduct,
        image: reader.result as string
      });
    };
    reader.readAsDataURL(file);
  };

  // --- Modifier Builder ---
  const addModifierGroup = () => {
    if (!editingProduct) return;
    const newGroup: ModifierGroup = {
      id: `mg-${Math.random().toString(36).substr(2, 9)}`,
      name: 'گروه جدید',
      type: 'optional',
      options: []
    };
    setEditingProduct({
      ...editingProduct,
      modifiers: [...editingProduct.modifiers, newGroup]
    });
  };

  const updateModifierGroup = (groupId: string, field: keyof ModifierGroup, value: any) => {
    if (!editingProduct) return;
    setEditingProduct({
      ...editingProduct,
      modifiers: editingProduct.modifiers.map(g => g.id === groupId ? { ...g, [field]: value } : g)
    });
  };

  const removeModifierGroup = (groupId: string) => {
    if (!editingProduct) return;
    setEditingProduct({
      ...editingProduct,
      modifiers: editingProduct.modifiers.filter(g => g.id !== groupId)
    });
  };

  const addModifierOption = (groupId: string) => {
    if (!editingProduct) return;
    setEditingProduct({
      ...editingProduct,
      modifiers: editingProduct.modifiers.map(g => {
        if (g.id === groupId) {
          return {
            ...g,
            options: [...g.options, { id: `mo-${Math.random().toString(36).substr(2, 9)}`, name: 'گزینه جدید', price: 0 }]
          };
        }
        return g;
      })
    });
  };

  const updateModifierOption = (groupId: string, optionId: string, field: keyof ProductModifier, value: any) => {
    if (!editingProduct) return;
    setEditingProduct({
      ...editingProduct,
      modifiers: editingProduct.modifiers.map(g => {
        if (g.id === groupId) {
          return {
            ...g,
            options: g.options.map(o => o.id === optionId ? { ...o, [field]: value } : o)
          };
        }
        return g;
      })
    });
  };

  const removeModifierOption = (groupId: string, optionId: string) => {
    if (!editingProduct) return;
    setEditingProduct({
      ...editingProduct,
      modifiers: editingProduct.modifiers.map(g => {
        if (g.id === groupId) {
          return {
            ...g,
            options: g.options.filter(o => o.id !== optionId)
          };
        }
        return g;
      })
    });
  };

  // Compose Products + active BranchProduct config
  const activeProductsOnly = domainProducts.filter(p => p.state !== 'archived');
  const mappedProducts = activeProductsOnly.map(prod => {
    const bp = branchProducts[prod.id];
    const cat = categories.find(c => c.id === prod.categoryId);
    return toProductViewModel(prod, bp, cat?.name);
  });

  const filteredProducts = mappedProducts.filter(p => {
    const matchesCategory = activeCategory === 'همه' || p.category === activeCategory;
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          p.internalName?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  if (catalogLoading || loadingBranchProducts) {
    return (
      <div className="flex items-center justify-center h-full w-full bg-slate-50 dark:bg-slate-950 animate-fade" dir="rtl">
        <div className="flex flex-col items-center gap-4">
          <div className={`w-12 h-12 rounded-full border-4 border-slate-200 border-t-${brandColor}-500 animate-spin`} />
          <p className="text-sm text-slate-400 font-medium">در حال بارگذاری اطلاعات منو...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-slate-50 dark:bg-slate-950 font-['Vazirmatn'] relative transition-colors" dir="rtl">
      
      {/* HEADER */}
      <div className="min-h-20 py-4 sm:py-0 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between px-4 sm:px-8 gap-4 shrink-0 z-10 transition-colors">
         <div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-slate-100 flex items-center gap-2">
               مدیریت محصولات
               {activeBranch && (
                  <span className={`text-[10px] font-bold bg-${brandColor}-50 dark:bg-${brandColor}-950 text-${brandColor}-600 dark:text-${brandColor}-400 px-2 py-0.5 rounded-md border border-${brandColor}-100 dark:border-${brandColor}-900`}>
                     شعبه: {activeBranch.name}
                  </span>
               )}
            </h1>
            <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
              {view === 'list' ? `${mappedProducts.length} محصول در کل کاتالوگ فعال است` : view === 'create' ? 'ایجاد شناسنامه محصول جدید' : `ویرایش ${editingProduct?.name}`}
            </p>
         </div>
         
         <div className="flex items-center gap-3">
            {/* Active Branch Switcher dropdown right in header */}
            {view === 'list' && branches.length > 1 && (
               <div className="relative">
                  <select
                     value={activeBranch?.id || ''}
                     onChange={(e) => setActiveBranch(e.target.value)}
                     className={`p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 rounded-xl text-xs font-bold outline-none cursor-pointer`}
                  >
                     {branches.map(b => (
                        <option key={b.id} value={b.id}>{b.name}</option>
                     ))}
                  </select>
               </div>
            )}

            {view !== 'list' && (
               <button 
                  onClick={() => setView('list')}
                  className="px-4 sm:px-6 py-2 sm:py-2.5 rounded-xl text-xs sm:text-sm font-bold text-slate-550 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
               >
                  انصراف
               </button>
            )}
            
            {view === 'list' ? (
              <button 
                onClick={handleCreate}
                className={`px-4 sm:px-6 py-2 sm:py-2.5 bg-${brandColor}-600 text-white rounded-xl text-xs sm:text-sm font-bold shadow-lg shadow-${brandColor}-200 dark:shadow-none hover:bg-${brandColor}-700 transition-all flex items-center gap-2 hover:scale-[1.03] active:scale-[0.97]`}
              >
                <Plus className="w-4 h-4" /> افزودن محصول جدید
              </button>
            ) : (
              <button 
                onClick={handleSave}
                className={`px-4 sm:px-6 py-2 sm:py-2.5 bg-${brandColor}-600 text-white rounded-xl text-xs sm:text-sm font-bold shadow-lg shadow-${brandColor}-200 dark:shadow-none hover:bg-${brandColor}-700 transition-all flex items-center gap-2 hover:scale-[1.03] active:scale-[0.97]`}
              >
                <Check className="w-4 h-4" /> ذخیره محصول
              </button>
            )}
         </div>
      </div>

      {/* CONTENT AREA */}
      <div className="flex-1 overflow-hidden relative">
        <AnimatePresence mode="wait">
          
          {/* VIEW: LIST */}
          {view === 'list' && (
            <motion.div 
              key="list"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="h-full flex flex-col p-4 sm:p-8 overflow-hidden"
            >
              {/* Subtle price publish warning banner if any item has unpublished pending changes */}
              {Object.values(branchProducts).some(bp => bp.hasPendingPublishPrice) && (
                 <motion.div 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-6 p-4 bg-amber-50 dark:bg-amber-950/20 border border-amber-100 dark:border-amber-900/30 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs"
                 >
                    <div className="flex items-center gap-3">
                       <div className="w-9 h-9 bg-amber-150 dark:bg-amber-900/40 rounded-xl flex items-center justify-center text-amber-600 dark:text-amber-450 shrink-0">
                          <AlertCircle className="w-5 h-5 animate-pulse" />
                       </div>
                       <div className="text-right">
                          <h4 className="text-xs font-black text-amber-850 dark:text-amber-300">قیمت‌های اصلاح‌شده نیازمند انتشار هستند</h4>
                          <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">شما تغییرات قیمتی در شعبه {activeBranch?.name || ''} دارید که هنوز برای مشتریان منوی عمومی نهایی نشده‌اند.</p>
                       </div>
                    </div>
                    <button
                       onClick={handlePublishPrices}
                       className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold rounded-xl transition-all hover:scale-[1.02] active:scale-[0.98] shadow-md shadow-amber-500/10"
                    >
                       انتشار عمومی تغییرات قیمت
                    </button>
                 </motion.div>
              )}

              {/* Filters */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8 shrink-0">
                <div className="relative flex-1 min-w-0 flex items-center">
                  {showRightArrow && (
                    <div className="absolute right-0 top-0 bottom-0 flex items-center bg-gradient-to-l from-slate-50 dark:from-slate-950 via-slate-50/80 dark:via-slate-950/80 to-transparent pl-12 z-10 pointer-events-none">
                      <button 
                        onClick={() => scroll('right')}
                        className="w-10 h-10 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 rounded-xl shadow-md flex items-center justify-center hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-200 transition-all pointer-events-auto hover:scale-105 active:scale-95"
                        aria-label="Scroll right"
                      >
                        <ChevronRight className="w-5 h-5" />
                      </button>
                    </div>
                  )}

                  {showLeftArrow && (
                    <div className="absolute left-0 top-0 bottom-0 flex items-center bg-gradient-to-r from-slate-50 dark:from-slate-950 via-slate-50/80 dark:via-slate-950/80 to-transparent pr-12 z-10 pointer-events-none">
                      <button 
                        onClick={() => scroll('left')}
                        className="w-10 h-10 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 rounded-xl shadow-md flex items-center justify-center hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-200 transition-all pointer-events-auto hover:scale-105 active:scale-95"
                        aria-label="Scroll left"
                      >
                        <ChevronLeft className="w-5 h-5" />
                      </button>
                    </div>
                  )}

                  <div 
                    ref={scrollRef}
                    className="flex-1 flex items-center gap-2 overflow-x-auto px-4 py-1.5 scroll-smooth [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
                  >
                    {[{ id: 'all', name: 'همه', order: -1 }, ...categories].map(cat => (
                      <button
                        key={cat.id}
                        onClick={() => setActiveCategory(cat.name)}
                        className={`px-4 py-2 rounded-xl text-sm font-bold whitespace-nowrap transition-all duration-300 ${
                          activeCategory === cat.name 
                            ? `bg-${brandColor}-600 text-white border border-${brandColor}-600 shadow-md shadow-${brandColor}-200/40 scale-105` 
                            : 'bg-white dark:bg-slate-900 text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-700'
                        }`}
                      >
                        {cat.name}
                      </button>
                    ))}
                  </div>
                </div>
                
                <div className="relative w-full md:w-64">
                   <Search className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" />
                   <input 
                      type="text" 
                      placeholder="جستجو در نام و توضیحات..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className={`w-full pl-4 pr-10 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-100 rounded-xl text-sm outline-none focus:border-${brandColor}-500 transition-colors`}
                   />
                </div>
              </div>

              {/* Grid with Staggered Animation */}
              <motion.div 
                variants={containerVariants}
                initial="hidden"
                animate="show"
                className="flex-1 overflow-y-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 pb-20 pr-2"
              >
                <AnimatePresence>
                  {filteredProducts.map(product => {
                    const bp = branchProducts[product.id];
                    const isProductAvailable = product.isAvailable !== false;
                    const hasPending = bp?.hasPendingPublishPrice;

                    return (
                      <motion.div 
                        key={product.id} 
                        layout
                        variants={itemVariants}
                        whileHover={{ y: -4 }}
                        className={`bg-white dark:bg-slate-900 rounded-2xl shadow-xs transition-all duration-300 group relative overflow-hidden flex flex-col border border-slate-100 dark:border-slate-800 hover:shadow-lg hover:border-${brandColor}-250 dark:hover:border-slate-700`}
                      >
                        <div className="aspect-[4/3] bg-slate-100 dark:bg-slate-950 relative overflow-hidden">
                           <img src={product.image || undefined} alt={product.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                           <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-2.5 backdrop-blur-[2px]">
                              <button onClick={() => handleEdit(product)} className={`p-2.5 bg-white dark:bg-slate-800 rounded-xl text-${brandColor}-600 dark:text-${brandColor}-400 hover:bg-${brandColor}-50 dark:hover:bg-${brandColor}-950/40 shadow-lg transform hover:scale-110 transition-all`} title="ویرایش شناسنامه و شعب"><Edit3 className="w-4 h-4" /></button>
                              <button onClick={() => initiateDelete(product.id)} className="p-2.5 bg-white dark:bg-slate-800 rounded-xl text-red-500 hover:bg-red-50 dark:hover:bg-red-950/40 shadow-lg transform hover:scale-110 transition-all" title="بایگانی محصول"><Trash2 className="w-4 h-4" /></button>
                           </div>
                           <div className="absolute top-3 right-3 bg-white/95 dark:bg-slate-900/95 backdrop-blur px-2 py-0.5 rounded-lg text-[10px] font-black text-slate-650 dark:text-slate-350 shadow-sm border border-slate-200/50 dark:border-slate-800">
                              {product.category}
                           </div>
                           
                           {/* Availability State Overlays */}
                           {!isProductAvailable && (
                              <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center pointer-events-none">
                                 <span className="bg-rose-600 text-white text-[9px] font-black px-3 py-1 rounded-full border border-rose-500 shadow-md">ناموجود در این شعبه</span>
                              </div>
                           )}
                        </div>

                        <div className="p-4 flex-1 flex flex-col justify-between">
                           <div>
                              <div className="flex items-start justify-between gap-1.5">
                                 <h3 className="font-bold text-slate-800 dark:text-slate-100 text-sm line-clamp-1">{product.name}</h3>
                                 {hasPending && (
                                    <span className="bg-amber-100 dark:bg-amber-950/80 text-amber-700 dark:text-amber-400 px-1.5 py-0.5 rounded text-[8px] font-black border border-amber-200 dark:border-amber-900/40 shrink-0">اصلاح قیمت</span>
                                 )}
                              </div>
                              <p className="text-xs text-slate-400 dark:text-slate-500 line-clamp-2 mt-1 leading-relaxed">{product.description}</p>
                           </div>
                           
                           <div className="flex items-center justify-between border-t border-slate-100 dark:border-slate-800/60 pt-3 mt-4">
                              <div className="flex flex-col">
                                 {product.discountPrice !== undefined ? (
                                    <div className="flex flex-col">
                                       <span className="text-[9px] text-slate-455 line-through leading-none">{product.price.toLocaleString()}</span>
                                       <span className={`font-black text-rose-600 dark:text-rose-450 text-xs font-mono`}>
                                          {product.discountPrice.toLocaleString()}{' '}
                                          <span className="text-[9px] font-normal text-slate-400">تومان</span>
                                       </span>
                                    </div>
                                 ) : (
                                    <span className={`font-black text-${brandColor}-600 dark:text-${brandColor}-400 text-xs font-mono`}>
                                       {product.price.toLocaleString()}{' '}
                                       <span className="text-[9px] font-normal text-slate-400">تومان</span>
                                    </span>
                                 )}
                              </div>

                              <div className="flex items-center gap-1.5">
                                 <span className="text-[9px] text-slate-400 dark:text-slate-500 font-bold">عرضه:</span>
                                 <button
                                    type="button"
                                    onClick={async (e) => {
                                       e.stopPropagation();
                                       if (!activeBranch || !catalogRepository) return;
                                       const currentBp = branchProducts[product.id];
                                       if (currentBp) {
                                          const updatedBp = {
                                             ...currentBp,
                                             isAvailable: !currentBp.isAvailable,
                                             availability: !currentBp.isAvailable ? 'AVAILABLE' as const : 'UNAVAILABLE' as const
                                          };
                                          await catalogRepository.saveBranchProduct(updatedBp);
                                          await loadBranchProducts();
                                       } else {
                                          await handleAddToBranch(product.id);
                                       }
                                    }}
                                    className={`relative inline-flex h-4.5 w-8 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                                       isProductAvailable ? `bg-${brandColor}-500` : 'bg-slate-200 dark:bg-slate-750'
                                    }`}
                                 >
                                    <span
                                       className={`pointer-events-none inline-block h-3.5 w-3.5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                                          isProductAvailable ? 'translate-x-0' : 'translate-x-3.5'
                                       }`}
                                    />
                                 </button>
                              </div>
                           </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>

                {filteredProducts.length === 0 && (
                  <motion.div 
                    initial={{ opacity: 0 }} 
                    animate={{ opacity: 1 }} 
                    className="col-span-full flex flex-col items-center justify-center text-slate-400 dark:text-slate-550 py-20 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-3xl bg-white dark:bg-slate-900/40"
                  >
                    <div className="w-16 h-16 bg-slate-100 dark:bg-slate-900 rounded-full flex items-center justify-center mb-4">
                      <Search className="w-8 h-8 text-slate-300 dark:text-slate-600" />
                    </div>
                    <p className="text-sm font-bold">محصولی در این دسته‌بندی یافت نشد.</p>
                  </motion.div>
                )}
              </motion.div>
            </motion.div>
          )}

          {/* VIEW: CREATE / EDIT */}
          {(view === 'edit' || view === 'create') && editingProduct && (
            <motion.div 
              key="form"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 15 }}
              className="h-full overflow-y-auto p-4 sm:p-8"
            >
              <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8 pb-20">
                
                {/* Left Column: Details (Main Identites) */}
                <div className="lg:col-span-2 space-y-8">
                  <section className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-6 transition-colors">
                     <h2 className="text-lg font-black text-slate-800 dark:text-slate-100 flex items-center gap-2 border-b border-slate-100 dark:border-slate-800/60 pb-3">
                        <Layers className={`w-5 h-5 text-${brandColor}-600`} />
                        اطلاعات اصلی محصول
                     </h2>
                     
                     <div className="grid grid-cols-2 gap-6">
                        <div className="col-span-2 sm:col-span-1 space-y-2">
                           <label className="text-xs font-black text-slate-500 dark:text-slate-400">نام داخلی محصول (جهت مدیریت)</label>
                           <input 
                             type="text" 
                             value={editingProduct.internalName || ''}
                             onChange={e => setEditingProduct({ ...editingProduct, internalName: e.target.value })}
                             className={`w-full p-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-100 rounded-xl text-sm outline-none focus:border-${brandColor}-500 transition-colors`}
                             placeholder="مثال: پیتزا سیسیلی تند سایز لارج"
                           />
                        </div>

                        <div className="col-span-2 sm:col-span-1 space-y-2">
                           <label className="text-xs font-black text-slate-500 dark:text-slate-400">نام نمایشی محصول (برای مشتری)</label>
                           <input 
                             type="text" 
                             value={editingProduct.name}
                             onChange={e => setEditingProduct({ ...editingProduct, name: e.target.value, internalName: editingProduct.internalName ? editingProduct.internalName : e.target.value })}
                             className={`w-full p-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-100 rounded-xl text-sm outline-none focus:border-${brandColor}-500 transition-colors`}
                             placeholder="مثال: پیتزا سیسیلی"
                           />
                        </div>
                        
                        <div className="col-span-2 sm:col-span-1 space-y-2">
                           <label className="text-xs font-black text-slate-500 dark:text-slate-400">دسته‌بندی الزامی</label>
                           <div className="relative">
                               <select 
                                 value={editingProduct.categoryId || ""}
                                 onChange={e => {
                                   const selectedCat = categories.find(c => c.id === e.target.value);
                                   setEditingProduct({ 
                                     ...editingProduct, 
                                     categoryId: selectedCat?.id,
                                     category: selectedCat ? selectedCat.name : ""
                                   });
                                 }}
                                 className={`w-full p-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-100 rounded-xl text-sm outline-none focus:border-${brandColor}-500 transition-colors appearance-none`}
                               >
                                 <option value="" disabled className="text-slate-450">انتخاب دسته‌بندی</option>
                                 {categories.map(c => <option key={c.id} value={c.id} className="text-slate-800 dark:text-slate-100 bg-white dark:bg-slate-900">{c.name}</option>)}
                               </select>
                           </div>
                        </div>

                        <div className="col-span-2 sm:col-span-1 space-y-2">
                           <label className="text-xs font-black text-slate-500 dark:text-slate-400">مدت زمان حدودی آماده‌سازی</label>
                           <div className="relative">
                              <Clock className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
                              <input 
                                type="text" 
                                value={editingProduct.estimatedTime || ''}
                                onChange={e => setEditingProduct({ ...editingProduct, estimatedTime: e.target.value })}
                                className={`w-full p-3 pr-10 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-100 rounded-xl text-sm outline-none focus:border-${brandColor}-500 transition-colors text-right`}
                                placeholder="مثال: 15 دقیقه"
                              />
                           </div>
                        </div>

                        <div className="col-span-2 space-y-2">
                           <label className="text-xs font-black text-slate-500 dark:text-slate-400">توضیحات معرفی به مشتری</label>
                           <textarea 
                             rows={3}
                             value={editingProduct.description || ''}
                             onChange={e => setEditingProduct({ ...editingProduct, description: e.target.value })}
                             className={`w-full p-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-100 rounded-xl text-sm outline-none focus:border-${brandColor}-500 transition-colors resize-none`}
                             placeholder="داستانی جذاب و کوتاه برای توصیف این طعم بنویسید..."
                           />
                        </div>
                     </div>
                  </section>

                  {/* Modifiers Builder */}
                  <section className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-6 transition-colors">
                    <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800/60 pb-3">
                       <h2 className="text-lg font-black text-slate-800 dark:text-slate-100 flex items-center gap-2">
                          <Sparkles className={`w-5 h-5 text-${brandColor}-600`} />
                          ویژگی‌ها و افزودنی‌ها
                       </h2>
                       <button 
                         type="button"
                         onClick={addModifierGroup}
                         className={`text-xs font-bold text-${brandColor}-600 bg-${brandColor}-50 dark:bg-${brandColor}-950/40 px-3 py-1.5 rounded-lg hover:bg-${brandColor}-100 dark:hover:bg-${brandColor}-900/40 transition-colors flex items-center gap-1`}
                       >
                         <Plus className="w-3.5 h-3.5" /> گروه ویژگی جدید
                       </button>
                    </div>
                    
                    <div className="space-y-6">
                      {editingProduct.modifiers.length === 0 && (
                        <div className="text-center py-8 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800 text-slate-400 dark:text-slate-500 text-sm">
                           هیچ گروه افزودنی‌ای اضافه نشده است. (مثال: نوع پخت گوشت، سایز پیتزا، نوع پنیر)
                        </div>
                      )}
                      
                      {editingProduct.modifiers.map((group, idx) => (
                        <div key={group.id} className="bg-slate-50/40 dark:bg-slate-950/40 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 relative transition-colors">
                           <div className="flex items-start justify-between mb-4">
                              <div className="flex items-center gap-4 flex-1">
                                 <div className="bg-white dark:bg-slate-800 p-2 rounded-lg shadow-xs border border-slate-100 dark:border-slate-700">
                                    <span className="text-xs font-black text-slate-400 dark:text-slate-500">#{idx + 1}</span>
                                 </div>
                                 <div className="space-y-1">
                                    <input 
                                       type="text" 
                                       value={group.name}
                                       onChange={e => updateModifierGroup(group.id, 'name', e.target.value)}
                                       className={`bg-transparent border-b border-transparent hover:border-slate-300 dark:hover:border-slate-700 focus:border-${brandColor}-500 outline-none font-bold text-slate-800 dark:text-slate-100 text-sm w-32 md:w-48 transition-colors`}
                                       placeholder="نام گروه (مثال: انتخاب سس)"
                                    />
                                    <div className="flex items-center w-fit bg-slate-100/80 dark:bg-slate-800/80 p-0.5 rounded-lg border border-slate-200/40 dark:border-slate-700/40">
                                       <button 
                                          type="button"
                                          onClick={() => updateModifierGroup(group.id, 'type', 'mandatory')}
                                          className={`text-[10px] px-2.5 py-1 rounded-md font-bold transition-all duration-200 ${group.type === 'mandatory' ? 'bg-orange-500 text-white shadow-xs' : 'text-slate-500 dark:text-slate-400'}`}
                                       >
                                          اجباری
                                       </button>
                                       <button 
                                          type="button"
                                          onClick={() => updateModifierGroup(group.id, 'type', 'optional')}
                                          className={`text-[10px] px-2.5 py-1 rounded-md font-bold transition-all duration-200 ${group.type === 'optional' ? 'bg-blue-500 text-white shadow-xs' : 'text-slate-500 dark:text-slate-400'}`}
                                       >
                                          اختیاری
                                       </button>
                                    </div>
                                 </div>
                              </div>
                              <button 
                                type="button"
                                onClick={() => removeModifierGroup(group.id)} 
                                className="text-slate-300 hover:text-red-500 p-1.5 rounded-lg transition-all"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                           </div>

                           <div className="space-y-3 pr-6 pl-0 border-r-2 border-slate-200 dark:border-slate-800 mt-2">
                              {group.options.map((opt) => (
                                 <div key={opt.id} className="flex items-center gap-3 bg-white dark:bg-slate-950 p-2 rounded-xl border border-slate-200/60 dark:border-slate-800 shadow-xs transition-all hover:border-slate-300 dark:hover:border-slate-700">
                                    <input 
                                       type="text" 
                                       value={opt.name}
                                       onChange={e => updateModifierOption(group.id, opt.id, 'name', e.target.value)}
                                       className={`flex-1 bg-transparent border-0 text-slate-800 dark:text-slate-100 px-2 py-1 text-xs outline-none`}
                                       placeholder="نام گزینه (مثال: فلفل اضافه)"
                                    />
                                    <div className="relative w-28 flex items-center bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg px-2 py-1">
                                       <span className="text-[10px] text-slate-400 mr-1 shrink-0">+</span>
                                       <input 
                                          type="number" 
                                          value={opt.price}
                                          onChange={e => updateModifierOption(group.id, opt.id, 'price', parseInt(e.target.value) || 0)}
                                          className={`w-full bg-transparent border-0 text-xs text-slate-850 dark:text-slate-100 outline-none text-left font-mono px-1`}
                                          placeholder="0"
                                       />
                                       <span className="text-[9px] text-slate-400 shrink-0">تومان</span>
                                    </div>
                                    <button 
                                      type="button"
                                      onClick={() => removeModifierOption(group.id, opt.id)} 
                                      className="p-1.5 text-slate-350 hover:text-red-500 transition-all"
                                    >
                                      <X className="w-3.5 h-3.5" />
                                    </button>
                                 </div>
                              ))}
                              
                              <button 
                                 type="button"
                                 onClick={() => addModifierOption(group.id)}
                                 className={`w-full py-2 border border-dashed border-slate-200 dark:border-slate-800 hover:border-${brandColor}-400 rounded-xl text-xs text-slate-500 hover:text-${brandColor}-650 font-bold transition-all flex items-center justify-center gap-1.5 bg-slate-50/50 hover:bg-white`}
                              >
                                 <Plus className="w-3.5 h-3.5" /> افزودن گزینه جدید
                              </button>
                           </div>
                        </div>
                      ))}
                    </div>
                  </section>
                </div>

                {/* Right Column: Branch Config & Media */}
                <div className="space-y-8">
                   
                   {/* ACTIVE BRANCH CONFIGURATION CARD */}
                   <section className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-4 transition-colors">
                      <h2 className="text-lg font-black text-slate-800 dark:text-slate-100 flex items-center gap-2 border-b border-slate-100 dark:border-slate-800/60 pb-3">
                         <Layers className={`w-5 h-5 text-${brandColor}-600`} />
                         تنظیمات شعبه فعال
                      </h2>

                      <div className="bg-slate-50 dark:bg-slate-950 p-4 rounded-2xl border border-slate-200/60 dark:border-slate-850 space-y-1.5">
                         <div className="flex items-center justify-between">
                            <span className="text-[10px] font-bold text-slate-400">شعبه فعلی منوی زنده:</span>
                            <span className={`text-[10px] font-black bg-${brandColor}-50 dark:bg-${brandColor}-950 text-${brandColor}-600 dark:text-${brandColor}-400 px-2 py-0.5 rounded border border-${brandColor}-100 dark:border-${brandColor}-900`}>
                               {activeBranch ? activeBranch.name : 'مرکزی'}
                            </span>
                         </div>
                      </div>

                      {activeBranch && !branchProducts[editingProduct.id] && view === 'edit' ? (
                         <div className="p-4 bg-amber-50 dark:bg-amber-950/20 border border-amber-100 dark:border-amber-900/30 rounded-2xl text-center space-y-3">
                            <p className="text-xs text-amber-650 dark:text-amber-400 font-bold leading-relaxed">
                               این محصول هنوز در این شعبه فعال نشده است.
                            </p>
                            <button
                               type="button"
                               onClick={() => handleAddToBranch(editingProduct.id)}
                               className={`w-full py-2 bg-${brandColor}-600 hover:bg-${brandColor}-700 text-white rounded-xl text-xs font-bold transition-all shadow-sm`}
                            >
                               افزودن و فعال‌سازی در این شعبه
                            </button>
                         </div>
                      ) : (
                         <div className="space-y-4">
                            {/* Live status change switch */}
                            <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-150 dark:border-slate-850">
                               <div className="space-y-0.5 text-right">
                                  <span className="text-xs font-bold text-slate-700 dark:text-slate-300">عرضه زنده در شعبه</span>
                                  <p className="text-[9px] text-slate-400">تغییر وضعیت بلافاصله به مشتری نشان داده می‌شود</p>
                               </div>
                               <button
                                  type="button"
                                  onClick={async () => {
                                     const currentAvailable = editingProduct.isAvailable !== false;
                                     const nextAvailable = !currentAvailable;
                                     
                                     setEditingProduct({ ...editingProduct, isAvailable: nextAvailable });

                                     if (view === 'edit' && activeBranch) {
                                        const currentBp = branchProducts[editingProduct.id];
                                        if (currentBp) {
                                           const updatedBp = {
                                              ...currentBp,
                                              isAvailable: nextAvailable,
                                              availability: nextAvailable ? 'AVAILABLE' as const : 'UNAVAILABLE' as const
                                           };
                                           await catalogRepository?.saveBranchProduct(updatedBp);
                                           await loadBranchProducts();
                                        }
                                     }
                                  }}
                                  className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                                     editingProduct.isAvailable !== false ? `bg-${brandColor}-500` : 'bg-slate-200 dark:bg-slate-700'
                                  }`}
                               >
                                  <span
                                     className={`pointer-events-none inline-block h-3.5 w-3.5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                                        editingProduct.isAvailable !== false ? 'translate-x-0' : 'translate-x-4'
                                     }`}
                                  />
                               </button>
                            </div>

                            {/* Price field */}
                            <div className="space-y-2">
                               <label className="text-xs font-bold text-slate-500 dark:text-slate-400">قیمت پایه شعبه (تومان)</label>
                               <div className="relative">
                                  <DollarSign className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
                                  <input 
                                     type="number" 
                                     value={editingProduct.price}
                                     onChange={e => setEditingProduct({ ...editingProduct, price: parseInt(e.target.value) || 0 })}
                                     className={`w-full p-3 pr-10 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-850 dark:text-slate-100 rounded-xl text-xs outline-none focus:border-${brandColor}-500 transition-colors text-right`}
                                  />
                               </div>
                            </div>

                            {/* Discount price */}
                            <div className="space-y-2">
                               <label className="text-xs font-bold text-slate-500 dark:text-slate-400">قیمت ویژه/تخفیف شعبه (تومان - اختیاری)</label>
                               <div className="relative">
                                  <DollarSign className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
                                  <input 
                                     type="number" 
                                     value={editingProduct.discountPrice === undefined ? "" : editingProduct.discountPrice}
                                     onChange={e => setEditingProduct({ ...editingProduct, discountPrice: e.target.value === "" ? undefined : parseInt(e.target.value) || 0 })}
                                     className={`w-full p-3 pr-10 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-850 dark:text-slate-100 rounded-xl text-xs outline-none focus:border-${brandColor}-500 transition-colors text-right`}
                                     placeholder="مثال: 12000"
                                  />
                               </div>
                            </div>

                            {/* Pending Publish Notification & Quick Button */}
                            {editingProduct.hasPendingPublishPrice && (
                               <div className="p-3.5 bg-amber-50 dark:bg-amber-950/20 border border-amber-100 dark:border-amber-900/30 rounded-2xl space-y-2">
                                  <div className="flex items-center gap-1.5 text-amber-700 dark:text-amber-400 font-bold text-xs">
                                     <AlertCircle className="w-4 h-4 shrink-0" />
                                     <span>قیمت نیازمند انتشار عمومی است</span>
                                  </div>
                                  <p className="text-[10px] text-slate-500 dark:text-slate-400 leading-relaxed">
                                     تغییرات قیمت منوی عمومی تا زمان کلیک روی انتشار اعمال نخواهد شد.
                                  </p>
                                  <button
                                     type="button"
                                     onClick={async () => {
                                        await handlePublishPrices();
                                        if (activeBranch && catalogRepository) {
                                           const bp = await catalogRepository.getBranchProduct(editingProduct.id, activeBranch.id);
                                           if (bp) {
                                              setEditingProduct({
                                                 ...editingProduct,
                                                 price: bp.branchPriceRial / 10,
                                                 discountPrice: bp.branchDiscountPriceRial ? bp.branchDiscountPriceRial / 10 : undefined,
                                                 hasPendingPublishPrice: false
                                              });
                                           }
                                        }
                                     }}
                                     className="w-full py-2 bg-amber-500 hover:bg-amber-600 text-white text-[11px] font-bold rounded-xl transition-all shadow-md shadow-amber-500/10"
                                  >
                                     انتشار فوری قیمت‌های این شعبه
                                  </button>
                               </div>
                            )}
                         </div>
                      )}
                   </section>

                   {/* Image Upload */}
                   <section className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-4 transition-colors">
                      <h2 className="text-lg font-black text-slate-800 dark:text-slate-100 flex items-center gap-2 border-b border-slate-100 dark:border-slate-800/60 pb-3">
                         <ImageIcon className={`w-5 h-5 text-${brandColor}-600`} />
                         تصویر محصول
                      </h2>
                      <div className={`aspect-square rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-850 bg-slate-50 dark:bg-slate-950 flex flex-col items-center justify-center cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-900 hover:border-${brandColor}-300 transition-all group overflow-hidden relative`}>
                         {editingProduct.image && editingProduct.image.trim() !== '' ? (
                            <>
                               <img src={editingProduct.image || undefined} className="w-full h-full object-cover" alt="preview" />
                               <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                  <span className="text-white text-xs font-black">بارگذاری تصویر جدید</span>
                                </div>
                            </>
                         ) : (
                            <>
                               <div className={`w-11 h-11 bg-white dark:bg-slate-800 rounded-full flex items-center justify-center shadow-xs mb-2 text-${brandColor}-600`}>
                                  <Plus className="w-5 h-5" />
                                </div>
                               <span className="text-[11px] font-bold text-slate-500">انتخاب فایل تصویر</span>
                            </>
                         )}
                         <input type="file" onChange={handleImageUpload} accept="image/*" className="absolute inset-0 opacity-0 cursor-pointer" />
                      </div>
                      <div className="text-[9px] text-slate-400 dark:text-slate-500 text-center leading-relaxed">
                         فرمت‌های پیشنهادی: JPG , PNG (حداکثر ۵ مگابایت)
                      </div>
                   </section>

                   {/* System Tip Banner */}
                   <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-100 dark:border-blue-900/40 p-5 rounded-3xl transition-colors">
                      <div className="flex items-start gap-3">
                         <AlertCircle className="w-5 h-5 text-blue-600 dark:text-blue-400 shrink-0" />
                         <div>
                            <h4 className="font-bold text-blue-800 dark:text-blue-300 text-xs mb-1">راهنمای هوشمند منو</h4>
                            <p className="text-[10px] text-blue-600 dark:text-blue-400 leading-relaxed">
                               افزودن گزینه‌های افزودنی اجباری مانند «انتخاب سایز» یا «نوع پخت»، دقت ثبت سفارش مشتری و سرعت پاسخگویی آشپزخانه را دو برابر می‌کند.
                            </p>
                         </div>
                      </div>
                   </div>

                </div>

              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </div>

      {/* CUSTOM SOFT ARCHIVE MODAL */}
      <AnimatePresence>
        {productToDelete && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md"
          >
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ type: "spring", stiffness: 350, damping: 25 }}
              className="bg-white dark:bg-slate-900 w-full max-w-sm rounded-3xl shadow-2xl relative z-10 p-6 flex flex-col items-center text-center border border-slate-100 dark:border-slate-800"
            >
              <div className="w-14 h-14 bg-red-50 dark:bg-red-950/30 rounded-full flex items-center justify-center mb-4 text-red-500">
                <AlertTriangle className="w-7 h-7" />
              </div>
              <h3 className="text-md font-black text-slate-800 dark:text-slate-100 mb-2">انتقال محصول به آرشیو</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mb-6 leading-relaxed">
                 این محصول جهت حفظ سوابق آماری و تراکنش‌های قدیمی مشتریان حذف فیزیکی نمی‌شود، بلکه به آرشیو منتقل شده و از منوی زنده مخفی خواهد شد.
              </p>
              <div className="flex gap-3 w-full">
                <button 
                  onClick={() => setProductToDelete(null)}
                  className="flex-1 py-2.5 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-bold rounded-xl hover:bg-slate-200 transition-colors text-xs"
                >
                  انصراف
                </button>
                <button 
                  onClick={confirmDelete}
                  className="flex-1 py-2.5 bg-red-500 text-white font-bold rounded-xl hover:bg-red-650 transition-colors text-xs shadow-md"
                >
                  بله، آرشیو کن
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
};

export default ProductManager;
