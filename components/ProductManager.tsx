
import React, { useState } from 'react';
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
  ChefHat,
  Tag,
  AlertCircle,
  AlertTriangle,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { Product, ModifierGroup, ProductModifier, Category } from '../types';
import { INITIAL_PRODUCTS, INITIAL_CATEGORIES } from '../constants';

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
  hidden: { opacity: 0, y: 20 },
  show: { 
    opacity: 1, 
    y: 0,
    transition: { type: 'spring' as const, stiffness: 300, damping: 24 }
  },
  exit: { opacity: 0, scale: 0.9, transition: { duration: 0.2 } }
};

interface ProductManagerProps {
  brandColor: string;
  highlightedItemId?: string | null;
  clearHighlight?: () => void;
}

const ProductManager: React.FC<ProductManagerProps> = ({ brandColor, highlightedItemId, clearHighlight }) => {
  const [view, setView] = useState<'list' | 'edit' | 'create'>('list');
  const [products, setProducts] = useState<Product[]>(() => {
    const savedProds = localStorage.getItem('vitrin_products');
    if (savedProds) {
      try {
        return JSON.parse(savedProds);
      } catch (e) {
        return INITIAL_PRODUCTS;
      }
    }
    return INITIAL_PRODUCTS;
  });
  const [categories, setCategories] = useState<Category[]>(INITIAL_CATEGORIES);
  const [activeCategory, setActiveCategory] = useState('همه');
  const [searchQuery, setSearchQuery] = useState('');
  const [localHighlight, setLocalHighlight] = useState<string | null>(null);

  React.useEffect(() => {
    const savedCats = localStorage.getItem('vitrin_categories');
    if (savedCats) {
      try {
        setCategories(JSON.parse(savedCats).sort((a: Category, b: Category) => a.order - b.order));
      } catch (e) {
        // use initial
      }
    }
  }, []);

  React.useEffect(() => {
    localStorage.setItem('vitrin_products', JSON.stringify(products));
  }, [products]);

  const scrollRef = React.useRef<HTMLDivElement>(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(false);

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

  React.useEffect(() => {
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
  
  // Form State
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [tempRawMaterial, setTempRawMaterial] = useState('');
  const [tempTagInput, setTempTagInput] = useState('');

  // Modal State
  const [productToDelete, setProductToDelete] = useState<string | null>(null);

  // --- Actions ---

  const handleEdit = (product: Product) => {
    setEditingProduct({ ...product });
    setView('edit');
  };

  const handleCreate = () => {
    const defaultCat = categories.length > 0 ? categories[0] : null;
    setEditingProduct({
      id: Math.random().toString(36).substr(2, 9),
      name: '',
      category: defaultCat ? defaultCat.name : 'دسته بندی نشده',
      categoryId: defaultCat ? defaultCat.id : undefined,
      description: '',
      price: 0,
      image: '',
      estimatedTime: '',
      rawMaterials: [],
      modifiers: [],
      isAvailable: true,
      discountPrice: undefined,
      tags: []
    });
    setView('create');
  };

  const handleSave = () => {
    if (!editingProduct || !editingProduct.name) return;

    if (view === 'create') {
      setProducts([...products, editingProduct]);
    } else {
      setProducts(products.map(p => p.id === editingProduct.id ? editingProduct : p));
    }
    setView('list');
    setEditingProduct(null);
  };

  const initiateDelete = (id: string) => {
    setProductToDelete(id);
  };

  const confirmDelete = () => {
    if (productToDelete) {
      setProducts(products.filter(p => p.id !== productToDelete));
      setProductToDelete(null);
      if (view !== 'list') setView('list');
    }
  };

  const handleAddRawMaterial = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && tempRawMaterial.trim() && editingProduct) {
      e.preventDefault();
      setEditingProduct({
        ...editingProduct,
        rawMaterials: [...(editingProduct.rawMaterials || []), tempRawMaterial.trim()]
      });
      setTempRawMaterial('');
    }
  };

  const removeRawMaterial = (index: number) => {
    if (!editingProduct) return;
    const newMaterials = [...(editingProduct.rawMaterials || [])];
    newMaterials.splice(index, 1);
    setEditingProduct({ ...editingProduct, rawMaterials: newMaterials });
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

  // --- Modifier Logic ---

  const addModifierGroup = () => {
    if (!editingProduct) return;
    const newGroup: ModifierGroup = {
      id: Math.random().toString(36).substr(2, 9),
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
            options: [...g.options, { id: Math.random().toString(36).substr(2, 9), name: 'گزینه جدید', price: 0 }]
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

  // --- Filtering ---
  const filteredProducts = products.filter(p => {
    const matchesCategory = activeCategory === 'همه' || p.category === activeCategory;
    const matchesSearch = p.name.includes(searchQuery) || p.description.includes(searchQuery);
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="h-full flex flex-col bg-slate-50 dark:bg-slate-950 font-['Vazirmatn'] relative transition-colors">
      
      {/* HEADER */}
      <div className="min-h-20 py-4 sm:py-0 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between px-4 sm:px-8 gap-4 shrink-0 z-10 transition-colors">
         <div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-slate-100">مدیریت محصولات</h1>
            <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
              {view === 'list' ? `${products.length} محصول در منو موجود است` : view === 'create' ? 'افزودن محصول جدید' : `ویرایش ${editingProduct?.name}`}
            </p>
         </div>
         <div className="flex gap-2 sm:gap-3">
            {view !== 'list' && (
               <button 
                  onClick={() => setView('list')}
                  className="px-4 sm:px-6 py-2 sm:py-2.5 rounded-xl text-xs sm:text-sm font-bold text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
               >
                  انصراف
               </button>
            )}
            {view === 'list' ? (
              <button 
                onClick={handleCreate}
                className={`px-4 sm:px-6 py-2 sm:py-2.5 bg-${brandColor}-600 text-white rounded-xl text-xs sm:text-sm font-bold shadow-lg shadow-${brandColor}-200 dark:shadow-none hover:bg-${brandColor}-700 transition-all flex items-center gap-1.5 sm:gap-2 hover:scale-105 active:scale-95`}
              >
                <Plus className="w-4 h-4" /> افزودن محصول
              </button>
            ) : (
              <button 
                onClick={handleSave}
                className={`px-4 sm:px-6 py-2 sm:py-2.5 bg-${brandColor}-600 text-white rounded-xl text-xs sm:text-sm font-bold shadow-lg shadow-${brandColor}-200 dark:shadow-none hover:bg-${brandColor}-700 transition-all flex items-center gap-1.5 sm:gap-2 hover:scale-105 active:scale-95`}
              >
                <Check className="w-4 h-4" /> ذخیره تغییرات
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
              {/* Filters */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8 shrink-0">
                <div className="relative flex-1 min-w-0 flex items-center">
                  {/* Right fade & button */}
                  {showRightArrow && (
                    <div className="absolute right-0 top-0 bottom-0 flex items-center bg-gradient-to-l from-slate-50 dark:from-slate-950 via-slate-50/80 dark:via-slate-950/80 to-transparent pl-12 z-10 pointer-events-none">
                      <button 
                        onClick={() => scroll('right')}
                        className="w-10 h-10 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 rounded-xl shadow-md flex items-center justify-center hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-200 transition-all cursor-pointer pointer-events-auto hover:scale-105 active:scale-95"
                        aria-label="Scroll right"
                      >
                        <ChevronRight className="w-5 h-5" />
                      </button>
                    </div>
                  )}

                  {/* Left fade & button */}
                  {showLeftArrow && (
                    <div className="absolute left-0 top-0 bottom-0 flex items-center bg-gradient-to-r from-slate-50 dark:from-slate-950 via-slate-50/80 dark:via-slate-950/80 to-transparent pr-12 z-10 pointer-events-none">
                      <button 
                        onClick={() => scroll('left')}
                        className="w-10 h-10 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 rounded-xl shadow-md flex items-center justify-center hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-200 transition-all cursor-pointer pointer-events-auto hover:scale-105 active:scale-95"
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
                        className={`px-4 py-2 rounded-xl text-sm font-bold whitespace-nowrap transition-all duration-300 outline-none focus:outline-none ${
                          activeCategory === cat.name 
                            ? `bg-${brandColor}-600 text-white border border-${brandColor}-600 shadow-md shadow-${brandColor}-200/50 dark:shadow-none scale-105` 
                            : 'bg-white dark:bg-slate-900 text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-700 dark:hover:text-slate-350'
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
                      placeholder="جستجو در محصولات..."
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
                  {filteredProducts.map(product => (
                    <motion.div 
                      key={product.id} 
                      layout // Enables smooth rearrangement
                      variants={itemVariants}
                      whileHover={{ y: -5, transition: { duration: 0.2 } }}
                      className={`bg-white dark:bg-slate-900 rounded-2xl shadow-sm transition-all duration-1000 group relative overflow-hidden flex flex-col ${
                        (localHighlight === product.id || (localHighlight && product.name === localHighlight))
                          ? `border-2 border-${brandColor}-500 ring-4 ring-${brandColor}-500/40 scale-[1.03] z-10` 
                          : `border border-slate-100 dark:border-slate-800 hover:shadow-lg dark:hover:shadow-none hover:border-${brandColor}-200 dark:hover:border-${brandColor}-800`
                      }`}
                    >
                      <div className="aspect-[4/3] bg-slate-100 dark:bg-slate-950 relative overflow-hidden">
                         <img src={product.image || undefined} alt={product.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                         <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-2 backdrop-blur-[2px]">
                            <button onClick={() => handleEdit(product)} className={`p-2.5 bg-white dark:bg-slate-800 rounded-xl text-${brandColor}-600 dark:text-${brandColor}-400 hover:bg-${brandColor}-50 dark:hover:bg-${brandColor}-950/30 shadow-lg transform hover:scale-110 transition-all`}><Edit3 className="w-5 h-5" /></button>
                            <button onClick={() => initiateDelete(product.id)} className="p-2.5 bg-white dark:bg-slate-800 rounded-xl text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 shadow-lg transform hover:scale-110 transition-all"><Trash2 className="w-5 h-5" /></button>
                         </div>
                         <div className="absolute top-3 right-3 bg-white/90 dark:bg-slate-900/90 backdrop-blur px-2 py-1 rounded-lg text-[10px] font-bold text-slate-700 dark:text-slate-300 shadow-sm border border-slate-200/50 dark:border-slate-800">
                            {product.category}
                         </div>
                      </div>
                      <div className="p-4 flex-1 flex flex-col">
                         <h3 className="font-bold text-slate-800 dark:text-slate-100 mb-1">{product.name}</h3>
                         <p className="text-xs text-slate-400 dark:text-slate-500 line-clamp-2 mb-4 flex-1">{product.description}</p>
                         <div className="flex items-center justify-between border-t border-slate-50 dark:border-slate-800/60 pt-3">
                            <span className={`font-black text-${brandColor}-600 dark:text-${brandColor}-400 text-sm`}>{product.price.toLocaleString()}</span>
                            <span className="text-[10px] text-slate-400 dark:text-slate-500 flex items-center gap-1">
                               <Clock className="w-3 h-3" /> {product.estimatedTime}
                            </span>
                         </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
                {filteredProducts.length === 0 && (
                  <motion.div 
                    initial={{ opacity: 0 }} 
                    animate={{ opacity: 1 }} 
                    className="col-span-full flex flex-col items-center justify-center text-slate-400 dark:text-slate-500 py-20 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-3xl"
                  >
                    <div className="w-16 h-16 bg-slate-100 dark:bg-slate-900 rounded-full flex items-center justify-center mb-4">
                      <Search className="w-8 h-8 text-slate-300 dark:text-slate-600" />
                    </div>
                    <p>محصولی یافت نشد</p>
                  </motion.div>
                )}
              </motion.div>
            </motion.div>
          )}

          {/* VIEW: CREATE / EDIT */}
          {(view === 'edit' || view === 'create') && editingProduct && (
            <motion.div 
              key="form"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="h-full overflow-y-auto p-8"
            >
              <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8 pb-20">
                
                {/* Left Column: Details */}
                <div className="lg:col-span-2 space-y-8">
                  {/* Basic Info */}
                  <section className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-6 transition-colors">
                    <h2 className="text-lg font-black text-slate-800 dark:text-slate-100 flex items-center gap-2">
                       <Tag className={`w-5 h-5 text-${brandColor}-600`} />
                       اطلاعات پایه
                    </h2>
                    
                    <div className="grid grid-cols-2 gap-6">
                       <div className="col-span-2 sm:col-span-1 space-y-2">
                          <label className="text-xs font-bold text-slate-500 dark:text-slate-400">نام محصول</label>
                          <input 
                            type="text" 
                            value={editingProduct.name}
                            onChange={e => setEditingProduct({ ...editingProduct, name: e.target.value })}
                            className={`w-full p-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-100 rounded-xl text-sm outline-none focus:border-${brandColor}-500 transition-colors`}
                            placeholder="مثال: پیتزا مخصوص"
                          />
                       </div>
                       
                       <div className="col-span-2 sm:col-span-1 space-y-2">
                          <label className="text-xs font-bold text-slate-500 dark:text-slate-400">دسته‌بندی</label>
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
                                <option value="" disabled className="text-slate-400">انتخاب دسته‌بندی</option>
                                {categories.map(c => <option key={c.id} value={c.id} className="text-slate-800 dark:text-slate-100 bg-white dark:bg-slate-900">{c.name}</option>)}
                              </select>
                          </div>
                       </div>

                       <div className="col-span-2 space-y-2">
                          <label className="text-xs font-bold text-slate-500 dark:text-slate-400">توضیحات</label>
                          <textarea 
                            rows={3}
                            value={editingProduct.description}
                            onChange={e => setEditingProduct({ ...editingProduct, description: e.target.value })}
                            className={`w-full p-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-100 rounded-xl text-sm outline-none focus:border-${brandColor}-500 transition-colors resize-none`}
                            placeholder="توضیحات جذاب برای مشتری..."
                          />
                       </div>

                       <div className="col-span-2 sm:col-span-1 space-y-2">
                          <label className="text-xs font-bold text-slate-500 dark:text-slate-400">قیمت پایه (تومان)</label>
                          <div className="relative">
                             <DollarSign className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
                             <input 
                               type="number" 
                               value={editingProduct.price}
                               onChange={e => setEditingProduct({ ...editingProduct, price: parseInt(e.target.value) || 0 })}
                               className={`w-full p-3 pr-10 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-100 rounded-xl text-sm outline-none focus:border-${brandColor}-500 transition-colors text-right [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none`}
                             />
                          </div>
                       </div>

                       <div className="col-span-2 sm:col-span-1 space-y-2">
                          <label className="text-xs font-bold text-slate-500 dark:text-slate-400">قیمت ویژه / تخفیف‌دار (اختیاری)</label>
                          <div className="relative">
                             <DollarSign className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
                             <input 
                               type="number" 
                               value={editingProduct.discountPrice === undefined ? "" : editingProduct.discountPrice}
                               onChange={e => setEditingProduct({ ...editingProduct, discountPrice: e.target.value === "" ? undefined : parseInt(e.target.value) || 0 })}
                               className={`w-full p-3 pr-10 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-100 rounded-xl text-sm outline-none focus:border-${brandColor}-500 transition-colors text-right [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none`}
                               placeholder="مثال: ۱۹۹,۰۰۰"
                             />
                          </div>
                          
                          {/* Validation: discountPrice must be less than base price */}
                          {editingProduct.discountPrice !== undefined && editingProduct.discountPrice >= editingProduct.price && (
                            <p className="text-[11px] text-red-500 mt-1 flex items-center gap-1 font-bold">
                              <AlertCircle className="w-3.5 h-3.5" />
                              قیمت تخفیف‌دار باید کمتر از قیمت پایه باشد.
                            </p>
                          )}

                          {/* Discount Preview */}
                          {editingProduct.discountPrice !== undefined && editingProduct.discountPrice > 0 && editingProduct.discountPrice < editingProduct.price && (
                            <div className="mt-1.5 flex items-center gap-2 text-xs font-bold text-slate-600 dark:text-slate-400 bg-slate-100/50 dark:bg-slate-900/50 p-2 rounded-lg">
                              <span className="text-[10px] text-slate-400 mr-1 shrink-0">نمایش در منو:</span>
                              <span className="line-through text-slate-400">{editingProduct.price.toLocaleString()}</span>
                              <span className="text-slate-400">←</span>
                              <span className={`text-${brandColor}-600 dark:text-${brandColor}-400 font-extrabold`}>{editingProduct.discountPrice.toLocaleString()} تومان</span>
                            </div>
                          )}
                       </div>

                       <div className="col-span-2 sm:col-span-1 space-y-2">
                          <label className="text-xs font-bold text-slate-500 dark:text-slate-400">زمان آماده‌سازی</label>
                          <div className="relative">
                             <Clock className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
                             <input 
                               type="text" 
                               value={editingProduct.estimatedTime}
                               onChange={e => setEditingProduct({ ...editingProduct, estimatedTime: e.target.value })}
                               className={`w-full p-3 pr-10 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-100 rounded-xl text-sm outline-none focus:border-${brandColor}-500 transition-colors text-right`}
                               placeholder="مثال: ۱۵ دقیقه"
                             />
                          </div>
                       </div>

                       <div className="col-span-2 sm:col-span-1 space-y-2 flex flex-col justify-between">
                          <div className="flex items-center justify-between h-full pt-1">
                             <div className="space-y-1">
                                <span className="text-xs font-bold text-slate-500 dark:text-slate-400">موجود در منو</span>
                                <p className="text-[10px] text-slate-400 dark:text-slate-500 font-medium">قابلیت مشاهده محصول در منوی مشتری</p>
                             </div>
                             <button
                                type="button"
                                onClick={() => setEditingProduct({ ...editingProduct, isAvailable: editingProduct.isAvailable === false ? true : false })}
                                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                                   editingProduct.isAvailable !== false ? `bg-${brandColor}-500` : 'bg-slate-200 dark:bg-slate-700'
                                }`}
                             >
                                <span
                                   className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                                      editingProduct.isAvailable !== false ? 'translate-x-0' : 'translate-x-5'
                                   }`}
                                />
                             </button>
                          </div>
                          
                          {/* Availability warning note */}
                          {editingProduct.isAvailable === false && (
                             <p className="text-[11px] text-amber-600 dark:text-amber-450 mt-1.5 flex items-center gap-1 font-bold">
                                <AlertCircle className="w-3.5 h-3.5" />
                                این محصول برای مشتریان مخفی یا غیرقابل سفارش نمایش داده می‌شود.
                             </p>
                          )}
                       </div>

                       {/* Tags Input */}
                       <div className="col-span-2 border-t border-slate-100 dark:border-slate-800/60 pt-6 space-y-3">
                          <label className="text-xs font-bold text-slate-500 dark:text-slate-400">برچسب‌ها (مثال: تند، پرفروش)</label>
                          
                          <div className="flex flex-wrap gap-2 mb-2">
                             {(editingProduct.tags || []).map((tag, idx) => (
                                <span key={idx} className={`bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 px-2.5 py-1 rounded-lg text-xs font-bold flex items-center gap-1.5 border border-slate-200/50 dark:border-slate-700/50`}>
                                   {tag}
                                   <button 
                                      type="button"
                                      onClick={() => {
                                        const newTags = (editingProduct.tags || []).filter((_, i) => i !== idx);
                                        setEditingProduct({ ...editingProduct, tags: newTags });
                                      }} 
                                      className="text-slate-400 hover:text-red-500 dark:hover:text-red-400 transition-colors p-0.5"
                                   >
                                      <X className="w-3 h-3" />
                                   </button>
                                </span>
                             ))}
                             {(editingProduct.tags || []).length === 0 && (
                                <span className="text-[11px] text-slate-400 dark:text-slate-500">هیچ برچسبی برای این محصول ثبت نشده است.</span>
                             )}
                          </div>
                          
                          {/* Suggested tags */}
                          <div className="flex flex-wrap items-center gap-1.5 pt-1">
                             <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 ml-1">برچسب‌های سریع:</span>
                             {['تند', 'گیاهی', 'جدید', 'پرفروش', 'پیشنهاد سرآشپز'].map(sTag => {
                                const isAdded = (editingProduct.tags || []).includes(sTag);
                                return (
                                   <button
                                      type="button"
                                      key={sTag}
                                      onClick={() => {
                                         const currentTags = editingProduct.tags || [];
                                         if (isAdded) {
                                            setEditingProduct({ ...editingProduct, tags: currentTags.filter(t => t !== sTag) });
                                         } else {
                                            setEditingProduct({ ...editingProduct, tags: [...currentTags, sTag] });
                                         }
                                      }}
                                      className={`text-[10px] px-2.5 py-1 rounded-lg font-bold border transition-all ${
                                         isAdded 
                                            ? `bg-${brandColor}-500 border-${brandColor}-500 text-white` 
                                            : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 hover:border-slate-300 dark:hover:border-slate-700'
                                      }`}
                                   >
                                      {isAdded ? `✓ ${sTag}` : `+ ${sTag}`}
                                   </button>
                                 );
                             })}
                          </div>

                          <div className="relative pt-1">
                             <input 
                                type="text" 
                                value={tempTagInput}
                                onChange={e => setTempTagInput(e.target.value)}
                                onKeyDown={e => {
                                   if (e.key === 'Enter') {
                                      e.preventDefault();
                                      const trimmed = tempTagInput.trim();
                                      if (trimmed && !(editingProduct.tags || []).includes(trimmed)) {
                                         setEditingProduct({
                                            ...editingProduct,
                                            tags: [...(editingProduct.tags || []), trimmed]
                                         });
                                         setTempTagInput('');
                                      }
                                   }
                                }}
                                placeholder="برچسب جدید بنویسید و Enter بزنید..."
                                className={`w-full p-3 pl-14 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-100 rounded-xl text-xs outline-none focus:border-${brandColor}-500 transition-colors`}
                             />
                             <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[10px] text-slate-400 dark:text-slate-500">Enter ↵</span>
                          </div>
                       </div>
                    </div>
                  </section>

                  {/* Modifiers Builder */}
                  <section className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-6 transition-colors">
                    <div className="flex items-center justify-between">
                       <h2 className="text-lg font-black text-slate-800 dark:text-slate-100 flex items-center gap-2">
                          <Layers className={`w-5 h-5 text-${brandColor}-600`} />
                          ویژگی‌ها و افزودنی‌ها
                       </h2>
                       <button 
                         onClick={addModifierGroup}
                         className={`text-xs font-bold text-${brandColor}-600 bg-${brandColor}-50 dark:bg-${brandColor}-950/40 px-3 py-1.5 rounded-lg hover:bg-${brandColor}-100 dark:hover:bg-${brandColor}-900/40 transition-colors flex items-center gap-1`}
                         >
                         <Plus className="w-3.5 h-3.5" /> گروه جدید
                       </button>
                    </div>
                    
                    <div className="space-y-6">
                      {editingProduct.modifiers.length === 0 && (
                        <div className="text-center py-8 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800 text-slate-400 dark:text-slate-500 text-sm">
                           هیچ گروه ویژگی‌ای اضافه نشده است. (مثال: سایز، نوع نان، پخت)
                        </div>
                      )}
                      
                      {editingProduct.modifiers.map((group, idx) => (
                        <div key={group.id} className="bg-slate-50/50 dark:bg-slate-950/50 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 relative group-card transition-colors">
                           <div className="flex items-start justify-between mb-4">
                              <div className="flex items-center gap-4 flex-1">
                                 <div className="bg-white dark:bg-slate-800 p-2 rounded-lg shadow-sm border border-slate-100 dark:border-slate-700">
                                    <span className="text-xs font-black text-slate-400 dark:text-slate-500">#{idx + 1}</span>
                                 </div>
                                 <div className="space-y-1">
                                    <input 
                                       type="text" 
                                       value={group.name}
                                       onChange={e => updateModifierGroup(group.id, 'name', e.target.value)}
                                       className={`bg-transparent border-b border-transparent hover:border-slate-300 dark:hover:border-slate-700 focus:border-${brandColor}-500 outline-none font-bold text-slate-800 dark:text-slate-100 text-sm w-32 md:w-48 transition-colors`}
                                       placeholder="نام گروه (مثال: سایز)"
                                    />
                                    <div className="flex items-center w-fit bg-slate-100/80 dark:bg-slate-800/80 p-0.5 rounded-lg border border-slate-200/40 dark:border-slate-700/40">
                                       <button 
                                          type="button"
                                          onClick={() => updateModifierGroup(group.id, 'type', 'mandatory')}
                                          className={`text-[10px] px-2.5 py-1 rounded-md font-bold transition-all duration-200 ${group.type === 'mandatory' ? 'bg-orange-500 text-white shadow-sm' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'}`}
                                       >
                                          اجباری
                                       </button>
                                       <button 
                                          type="button"
                                          onClick={() => updateModifierGroup(group.id, 'type', 'optional')}
                                          className={`text-[10px] px-2.5 py-1 rounded-md font-bold transition-all duration-200 ${group.type === 'optional' ? 'bg-blue-500 text-white shadow-sm' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'}`}
                                       >
                                          اختیاری
                                       </button>
                                    </div>
                                 </div>
                              </div>
                              <button 
                                onClick={() => removeModifierGroup(group.id)} 
                                className="text-slate-300 dark:text-slate-600 hover:text-red-500 dark:hover:text-red-400 p-1.5 hover:bg-red-50 dark:hover:bg-red-950/40 rounded-lg transition-all"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                           </div>

                           <div className="space-y-3 pr-6 pl-0 border-r-2 border-slate-200 dark:border-slate-800 mt-2">
                              {group.options.map((opt) => (
                                 <div key={opt.id} className="flex items-center gap-3 bg-white dark:bg-slate-950 p-2 rounded-xl border border-slate-200 dark:border-slate-800/60 shadow-sm transition-all hover:border-slate-300 dark:hover:border-slate-700">
                                    <input 
                                       type="text" 
                                       value={opt.name}
                                       onChange={e => updateModifierOption(group.id, opt.id, 'name', e.target.value)}
                                       className={`flex-1 bg-transparent border-0 text-slate-800 dark:text-slate-100 px-2 py-1 text-xs outline-none focus:ring-0`}
                                       placeholder="نام گزینه (مثال: متوسط)"
                                    />
                                    <div className="relative w-28 flex items-center bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg px-2.5 py-1">
                                       <span className="text-[10px] text-slate-400 dark:text-slate-500 mr-1 shrink-0">+</span>
                                       <input 
                                          type="number" 
                                          value={opt.price}
                                          onChange={e => updateModifierOption(group.id, opt.id, 'price', parseInt(e.target.value) || 0)}
                                          className={`w-full bg-transparent border-0 text-xs text-slate-800 dark:text-slate-100 outline-none text-left dir-ltr font-mono py-0 px-1 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none`}
                                          placeholder="0"
                                       />
                                       <span className="text-[9px] text-slate-400 dark:text-slate-500 ml-1 shrink-0">تومان</span>
                                    </div>
                                    <button 
                                      onClick={() => removeModifierOption(group.id, opt.id)} 
                                      className="p-1.5 text-slate-400 dark:text-slate-500 hover:text-red-500 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 rounded-lg transition-all"
                                      title="حذف گزینه"
                                    >
                                      <X className="w-3.5 h-3.5" />
                                    </button>
                                 </div>
                              ))}
                              
                              <button 
                                 onClick={() => addModifierOption(group.id)}
                                 className={`w-full py-2 border border-dashed border-slate-200 dark:border-slate-800 hover:border-${brandColor}-400 dark:hover:border-${brandColor}-500 rounded-xl text-xs text-slate-500 dark:text-slate-400 hover:text-${brandColor}-600 dark:hover:text-${brandColor}-400 font-bold transition-all flex items-center justify-center gap-1.5 bg-slate-50/50 dark:bg-slate-900/50 hover:bg-white dark:hover:bg-slate-950`}
                              >
                                 <Plus className="w-3.5 h-3.5" /> افزودن گزینه جدید
                              </button>
                           </div>
                        </div>
                      ))}
                    </div>
                  </section>
                </div>

                {/* Right Column: Media & Extra */}
                <div className="space-y-8">
                   {/* Image Upload */}
                   <section className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4 transition-colors">
                      <h2 className="text-lg font-black text-slate-800 dark:text-slate-100 flex items-center gap-2">
                         <ImageIcon className={`w-5 h-5 text-${brandColor}-600`} />
                         تصویر محصول
                      </h2>
                      <div className={`aspect-square rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 flex flex-col items-center justify-center cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-900 hover:border-${brandColor}-300 dark:hover:border-${brandColor}-500 transition-all group overflow-hidden relative`}>
                         {editingProduct.image && editingProduct.image.trim() !== '' ? (
                            <>
                               <img src={editingProduct.image || undefined} className="w-full h-full object-cover" alt="preview" />
                               <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                  <span className="text-white text-xs font-bold">تغییر تصویر</span>
                               </div>
                            </>
                         ) : (
                            <>
                               <div className="w-12 h-12 bg-white dark:bg-slate-800 rounded-full flex items-center justify-center shadow-sm mb-3">
                                  <Plus className={`w-6 h-6 text-${brandColor}-600`} />
                                </div>
                               <span className="text-xs font-bold text-slate-500 dark:text-slate-400">آپلود تصویر</span>
                            </>
                         )}
                         {/* Mock Input */}
                         <input type="file" onChange={handleImageUpload} accept="image/*" className="absolute inset-0 opacity-0 cursor-pointer" />
                      </div>
                      <div className="text-[10px] text-slate-400 dark:text-slate-500 text-center">
                         حداکثر حجم: ۵ مگابایت (JPG, PNG)
                      </div>
                   </section>

                   {/* Raw Materials */}
                   <section className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4 transition-colors">
                      <h2 className="text-lg font-black text-slate-800 dark:text-slate-100 flex items-center gap-2">
                         <ChefHat className={`w-5 h-5 text-${brandColor}-600`} />
                         مواد اولیه
                      </h2>
                      <div className="flex flex-wrap gap-2 mb-2">
                         {editingProduct.rawMaterials?.map((mat, idx) => (
                            <span key={idx} className={`bg-${brandColor}-50 dark:bg-${brandColor}-950 text-${brandColor}-700 dark:text-${brandColor}-300 px-2 py-1 rounded-lg text-xs font-bold flex items-center gap-1 border border-${brandColor}-100 dark:border-${brandColor}-900`}>
                               {mat}
                               <button onClick={() => removeRawMaterial(idx)} className={`hover:text-${brandColor}-900 dark:hover:text-${brandColor}-100`}><X className="w-3 h-3" /></button>
                            </span>
                         ))}
                      </div>
                      <div className="relative">
                         <input 
                            type="text" 
                            value={tempRawMaterial}
                            onChange={e => setTempRawMaterial(e.target.value)}
                            onKeyDown={handleAddRawMaterial}
                            placeholder="تایپ کنید و Enter بزنید..."
                            className={`w-full p-3 pl-14 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-100 rounded-xl text-xs outline-none focus:border-${brandColor}-500 transition-colors`}
                         />
                         <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[10px] text-slate-400 dark:text-slate-500">Enter ↵</span>
                      </div>
                   </section>

                   {/* System Tip */}
                   <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-100 dark:border-blue-900/40 p-6 rounded-3xl relative overflow-hidden transition-colors">
                      <div className="flex items-start gap-3 relative z-10">
                         <AlertCircle className="w-5 h-5 text-blue-600 dark:text-blue-400 shrink-0" />
                         <div>
                            <h4 className="font-bold text-blue-800 dark:text-blue-300 text-sm mb-1">نکته مدیریتی</h4>
                            <p className="text-xs text-blue-600 dark:text-blue-400 leading-relaxed">
                               افزودن گزینه‌های "اجباری" مثل انتخاب نان یا پخت، تجربه سفارش مشتری را دقیق‌تر می‌کند و خطاهای آشپزخانه را کاهش می‌دهد.
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

      {/* CUSTOM DELETE MODAL */}
      <AnimatePresence>
        {productToDelete && (
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
              className="fixed inset-0 bg-slate-950/80 backdrop-blur-xl"
              onClick={() => setProductToDelete(null)}
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
             className="bg-white dark:bg-slate-900 w-full max-w-sm rounded-[2rem] shadow-2xl relative z-10 p-6 flex flex-col items-center text-center border border-slate-100 dark:border-slate-800"
            >
              <div className="w-16 h-16 bg-red-50 dark:bg-red-950/30 rounded-full flex items-center justify-center mb-4">
                <AlertTriangle className="w-8 h-8 text-red-500" />
              </div>
              <h3 className="text-lg font-black text-slate-800 dark:text-slate-100 mb-2">حذف محصول</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 mb-8 leading-relaxed">
                آیا از حذف این محصول اطمینان دارید؟ این عملیات قابل بازگشت نیست.
              </p>
              <div className="flex gap-3 w-full">
                <button 
                  onClick={() => setProductToDelete(null)}
                  className="flex-1 py-3 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-350 font-bold rounded-xl hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                >
                  انصراف
                </button>
                <button 
                  onClick={confirmDelete}
                  className="flex-1 py-3 bg-red-500 text-white font-bold rounded-xl hover:bg-red-600 transition-colors shadow-lg shadow-red-200 dark:shadow-none"
                >
                  بله، حذف کن
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
