
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
  AlertTriangle
} from 'lucide-react';
import { Product, ModifierGroup, ProductModifier } from '../types';

// --- MOCK DATA ---
const INITIAL_PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'پیتزا پپرونی',
    category: 'پیتزا',
    price: 245000,
    description: 'پیتزای کلاسیک با پپرونی تند و پنیر موزارلا.',
    image: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?q=80&w=1000&auto=format&fit=crop',
    estimatedTime: '۲۰ دقیقه',
    rawMaterials: ['خمیر', 'سس گوجه', 'پپرونی', 'پنیر'],
    modifiers: [
      {
        id: 'm1', name: 'سایز', type: 'mandatory',
        options: [{ id: 'o1', name: 'متوسط', price: 0 }, { id: 'o2', name: 'بزرگ', price: 85000 }]
      }
    ]
  },
  {
    id: '2',
    name: 'برگر کلاسیک',
    category: 'برگر',
    price: 185000,
    description: 'گوشت گوساله ۱۰۰٪ خالص با نان بریوش.',
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=1000&auto=format&fit=crop',
    estimatedTime: '۱۵ دقیقه',
    rawMaterials: ['نان', 'گوشت', 'کاهو', 'گوجه'],
    modifiers: [
       {
        id: 'm3', name: 'پخت', type: 'mandatory',
        options: [{ id: 'o5', name: 'مدیوم', price: 0 }, { id: 'o6', name: 'ول‌دان', price: 0 }]
      }
    ]
  },
  {
    id: '3',
    name: 'سیب‌زمینی سرخ‌کرده',
    category: 'پیش‌غذا',
    price: 85000,
    description: 'سیب‌زمینی تازه با ادویه مخصوص.',
    image: 'https://images.unsplash.com/photo-1573080496987-8198cb7fcd48?q=80&w=1000&auto=format&fit=crop',
    estimatedTime: '۱۰ دقیقه',
    rawMaterials: ['سیب‌زمینی', 'روغن', 'نمک'],
    modifiers: []
  }
];

const INITIAL_CATEGORIES = ['همه', 'پیتزا', 'برگر', 'پیش‌غذا', 'نوشیدنی', 'سالاد'];

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
}

const ProductManager: React.FC<ProductManagerProps> = ({ brandColor }) => {
  const [view, setView] = useState<'list' | 'edit' | 'create'>('list');
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [categories, setCategories] = useState<string[]>(INITIAL_CATEGORIES);
  const [activeCategory, setActiveCategory] = useState('همه');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Form State
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [tempRawMaterial, setTempRawMaterial] = useState('');

  // Modal State
  const [productToDelete, setProductToDelete] = useState<string | null>(null);

  // --- Actions ---

  const handleEdit = (product: Product) => {
    setEditingProduct({ ...product });
    setView('edit');
  };

  const handleCreate = () => {
    setEditingProduct({
      id: Math.random().toString(36).substr(2, 9),
      name: '',
      category: categories[1] || 'دسته بندی نشده',
      description: '',
      price: 0,
      image: '',
      estimatedTime: '',
      rawMaterials: [],
      modifiers: []
    });
    setView('create');
  };

  const handleSave = () => {
    if (!editingProduct || !editingProduct.name) return;

    if (view === 'create') {
      setProducts([...products, editingProduct]);
      // Add category if new
      if (!categories.includes(editingProduct.category) && editingProduct.category !== 'همه') {
        setCategories([...categories, editingProduct.category]);
      }
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
    <div className="h-full flex flex-col bg-slate-50 font-['Vazirmatn'] relative">
      
      {/* HEADER */}
      <div className="h-20 bg-white border-b border-slate-200 flex items-center justify-between px-8 shrink-0 z-10">
         <div>
            <h1 className="text-2xl font-black text-slate-900">مدیریت محصولات</h1>
            <p className="text-xs text-slate-400 mt-1">
              {view === 'list' ? `${products.length} محصول در منو موجود است` : view === 'create' ? 'افزودن محصول جدید' : `ویرایش ${editingProduct?.name}`}
            </p>
         </div>
         <div className="flex gap-3">
            {view !== 'list' && (
               <button 
                  onClick={() => setView('list')}
                  className="px-6 py-2.5 rounded-xl text-sm font-bold text-slate-500 hover:bg-slate-100 transition-colors"
               >
                  انصراف
               </button>
            )}
            {view === 'list' ? (
              <button 
                onClick={handleCreate}
                className={`px-6 py-2.5 bg-${brandColor}-600 text-white rounded-xl text-sm font-bold shadow-lg shadow-${brandColor}-200 hover:bg-${brandColor}-700 transition-all flex items-center gap-2 hover:scale-105 active:scale-95`}
              >
                <Plus className="w-4 h-4" /> افزودن محصول
              </button>
            ) : (
              <button 
                onClick={handleSave}
                className={`px-6 py-2.5 bg-${brandColor}-600 text-white rounded-xl text-sm font-bold shadow-lg shadow-${brandColor}-200 hover:bg-${brandColor}-700 transition-all flex items-center gap-2 hover:scale-105 active:scale-95`}
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
              className="h-full flex flex-col p-8 overflow-hidden"
            >
              {/* Filters */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8 shrink-0">
                <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-hide">
                  {categories.map(cat => (
                    <button
                      key={cat}
                      onClick={() => setActiveCategory(cat)}
                      className={`px-4 py-2 rounded-xl text-sm font-bold whitespace-nowrap transition-all duration-300 ${
                        activeCategory === cat 
                          ? `bg-${brandColor}-600 text-white shadow-md shadow-${brandColor}-200 scale-105` 
                          : 'bg-white text-slate-500 border border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
                <div className="relative w-full md:w-64">
                   <Search className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" />
                   <input 
                      type="text" 
                      placeholder="جستجو در محصولات..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className={`w-full pl-4 pr-10 py-2.5 bg-white border border-slate-200 rounded-xl text-sm outline-none focus:border-${brandColor}-500 transition-colors`}
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
                      className={`bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-lg hover:shadow-${brandColor}-100 hover:border-${brandColor}-200 transition-all group relative overflow-hidden flex flex-col`}
                    >
                      <div className="aspect-[4/3] bg-slate-100 relative overflow-hidden">
                         <img src={product.image} alt={product.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                         <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-2 backdrop-blur-[2px]">
                            <button onClick={() => handleEdit(product)} className={`p-2.5 bg-white rounded-xl text-${brandColor}-600 hover:bg-${brandColor}-50 shadow-lg transform hover:scale-110 transition-all`}><Edit3 className="w-5 h-5" /></button>
                            <button onClick={() => initiateDelete(product.id)} className="p-2.5 bg-white rounded-xl text-red-500 hover:bg-red-50 shadow-lg transform hover:scale-110 transition-all"><Trash2 className="w-5 h-5" /></button>
                         </div>
                         <div className="absolute top-3 right-3 bg-white/90 backdrop-blur px-2 py-1 rounded-lg text-[10px] font-bold text-slate-700 shadow-sm">
                            {product.category}
                         </div>
                      </div>
                      <div className="p-4 flex-1 flex flex-col">
                         <h3 className="font-bold text-slate-800 mb-1">{product.name}</h3>
                         <p className="text-xs text-slate-400 line-clamp-2 mb-4 flex-1">{product.description}</p>
                         <div className="flex items-center justify-between border-t border-slate-50 pt-3">
                            <span className={`font-black text-${brandColor}-600 text-sm`}>{product.price.toLocaleString()}</span>
                            <span className="text-[10px] text-slate-400 flex items-center gap-1">
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
                    className="col-span-full flex flex-col items-center justify-center text-slate-400 py-20 border-2 border-dashed border-slate-200 rounded-3xl"
                  >
                    <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                      <Search className="w-8 h-8 text-slate-300" />
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
                  <section className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-6">
                    <h2 className="text-lg font-black text-slate-800 flex items-center gap-2">
                       <Tag className={`w-5 h-5 text-${brandColor}-600`} />
                       اطلاعات پایه
                    </h2>
                    
                    <div className="grid grid-cols-2 gap-6">
                       <div className="col-span-2 sm:col-span-1 space-y-2">
                          <label className="text-xs font-bold text-slate-500">نام محصول</label>
                          <input 
                            type="text" 
                            value={editingProduct.name}
                            onChange={e => setEditingProduct({ ...editingProduct, name: e.target.value })}
                            className={`w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:border-${brandColor}-500 transition-colors`}
                            placeholder="مثال: پیتزا مخصوص"
                          />
                       </div>
                       
                       <div className="col-span-2 sm:col-span-1 space-y-2">
                          <label className="text-xs font-bold text-slate-500">دسته‌بندی</label>
                          <div className="relative">
                             <input 
                               type="text" 
                               list="categories-list"
                               value={editingProduct.category}
                               onChange={e => setEditingProduct({ ...editingProduct, category: e.target.value })}
                               className={`w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:border-${brandColor}-500 transition-colors`}
                               placeholder="انتخاب یا تایپ دسته‌بندی جدید"
                             />
                             <datalist id="categories-list">
                                {INITIAL_CATEGORIES.filter(c => c !== 'همه').map(c => <option key={c} value={c} />)}
                             </datalist>
                          </div>
                       </div>

                       <div className="col-span-2 space-y-2">
                          <label className="text-xs font-bold text-slate-500">توضیحات</label>
                          <textarea 
                            rows={3}
                            value={editingProduct.description}
                            onChange={e => setEditingProduct({ ...editingProduct, description: e.target.value })}
                            className={`w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:border-${brandColor}-500 transition-colors resize-none`}
                            placeholder="توضیحات جذاب برای مشتری..."
                          />
                       </div>

                       <div className="col-span-2 sm:col-span-1 space-y-2">
                          <label className="text-xs font-bold text-slate-500">قیمت پایه (تومان)</label>
                          <div className="relative">
                             <DollarSign className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                             <input 
                               type="number" 
                               value={editingProduct.price}
                               onChange={e => setEditingProduct({ ...editingProduct, price: parseInt(e.target.value) || 0 })}
                               className={`w-full p-3 pl-10 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:border-${brandColor}-500 transition-colors dir-ltr`}
                             />
                          </div>
                       </div>

                       <div className="col-span-2 sm:col-span-1 space-y-2">
                          <label className="text-xs font-bold text-slate-500">زمان آماده‌سازی</label>
                          <div className="relative">
                             <Clock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                             <input 
                               type="text" 
                               value={editingProduct.estimatedTime}
                               onChange={e => setEditingProduct({ ...editingProduct, estimatedTime: e.target.value })}
                               className={`w-full p-3 pl-10 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:border-${brandColor}-500 transition-colors`}
                               placeholder="مثال: ۱۵ دقیقه"
                             />
                          </div>
                       </div>
                    </div>
                  </section>

                  {/* Modifiers Builder */}
                  <section className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-6">
                    <div className="flex items-center justify-between">
                       <h2 className="text-lg font-black text-slate-800 flex items-center gap-2">
                          <Layers className={`w-5 h-5 text-${brandColor}-600`} />
                          ویژگی‌ها و افزودنی‌ها
                       </h2>
                       <button 
                         onClick={addModifierGroup}
                         className={`text-xs font-bold text-${brandColor}-600 bg-${brandColor}-50 px-3 py-1.5 rounded-lg hover:bg-${brandColor}-100 transition-colors flex items-center gap-1`}
                         >
                         <Plus className="w-3.5 h-3.5" /> گروه جدید
                       </button>
                    </div>
                    
                    <div className="space-y-6">
                      {editingProduct.modifiers.length === 0 && (
                        <div className="text-center py-8 bg-slate-50 rounded-2xl border border-dashed border-slate-200 text-slate-400 text-sm">
                           هیچ گروه ویژگی‌ای اضافه نشده است. (مثال: سایز، نوع نان، پخت)
                        </div>
                      )}
                      
                      {editingProduct.modifiers.map((group, idx) => (
                        <div key={group.id} className="bg-slate-50/50 rounded-2xl border border-slate-200 p-5 relative group-card">
                           <div className="flex items-start justify-between mb-4">
                              <div className="flex items-center gap-4 flex-1">
                                 <div className="bg-white p-2 rounded-lg shadow-sm border border-slate-100">
                                    <span className="text-xs font-black text-slate-400">#{idx + 1}</span>
                                 </div>
                                 <div className="space-y-1">
                                    <input 
                                       type="text" 
                                       value={group.name}
                                       onChange={e => updateModifierGroup(group.id, 'name', e.target.value)}
                                       className={`bg-transparent border-b border-transparent hover:border-slate-300 focus:border-${brandColor}-500 outline-none font-bold text-slate-700 text-sm w-32 md:w-48 transition-colors`}
                                       placeholder="نام گروه (مثال: سایز)"
                                    />
                                    <div className="flex items-center gap-2">
                                       <button 
                                          onClick={() => updateModifierGroup(group.id, 'type', 'mandatory')}
                                          className={`text-[10px] px-2 py-0.5 rounded-full transition-colors ${group.type === 'mandatory' ? 'bg-orange-100 text-orange-600 font-bold' : 'text-slate-400 hover:bg-slate-200'}`}
                                       >
                                          اجباری
                                       </button>
                                       <button 
                                          onClick={() => updateModifierGroup(group.id, 'type', 'optional')}
                                          className={`text-[10px] px-2 py-0.5 rounded-full transition-colors ${group.type === 'optional' ? 'bg-blue-100 text-blue-600 font-bold' : 'text-slate-400 hover:bg-slate-200'}`}
                                       >
                                          اختیاری
                                       </button>
                                    </div>
                                 </div>
                              </div>
                              <button onClick={() => removeModifierGroup(group.id)} className="text-slate-300 hover:text-red-500 transition-colors"><Trash2 className="w-4 h-4" /></button>
                           </div>

                           <div className="space-y-2 pl-4 border-r-2 border-slate-200">
                              {group.options.map((opt) => (
                                 <div key={opt.id} className="flex items-center gap-2">
                                    <input 
                                       type="text" 
                                       value={opt.name}
                                       onChange={e => updateModifierOption(group.id, opt.id, 'name', e.target.value)}
                                       className={`flex-1 bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-xs outline-none focus:border-${brandColor}-500`}
                                       placeholder="نام گزینه"
                                    />
                                    <div className="relative w-24">
                                       <input 
                                          type="number" 
                                          value={opt.price}
                                          onChange={e => updateModifierOption(group.id, opt.id, 'price', parseInt(e.target.value) || 0)}
                                          className={`w-full bg-white border border-slate-200 rounded-lg px-2 py-1.5 text-xs outline-none focus:border-${brandColor}-500 text-left dir-ltr pl-6`}
                                          placeholder="0"
                                       />
                                       <span className="absolute left-2 top-1/2 -translate-y-1/2 text-[10px] text-slate-400">+</span>
                                    </div>
                                    <button onClick={() => removeModifierOption(group.id, opt.id)} className="p-1.5 text-slate-300 hover:text-red-400"><X className="w-3 h-3" /></button>
                                 </div>
                              ))}
                              <button 
                                 onClick={() => addModifierOption(group.id)}
                                 className={`text-xs text-${brandColor}-600 font-bold hover:underline flex items-center gap-1 mt-2`}
                              >
                                 <Plus className="w-3 h-3" /> افزودن گزینه
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
                   <section className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
                      <h2 className="text-lg font-black text-slate-800 flex items-center gap-2">
                         <ImageIcon className={`w-5 h-5 text-${brandColor}-600`} />
                         تصویر محصول
                      </h2>
                      <div className={`aspect-square rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50 flex flex-col items-center justify-center cursor-pointer hover:bg-slate-100 hover:border-${brandColor}-300 transition-all group overflow-hidden relative`}>
                         {editingProduct.image ? (
                            <>
                               <img src={editingProduct.image} className="w-full h-full object-cover" alt="preview" />
                               <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                  <span className="text-white text-xs font-bold">تغییر تصویر</span>
                               </div>
                            </>
                         ) : (
                            <>
                               <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm mb-3">
                                  <Plus className={`w-6 h-6 text-${brandColor}-600`} />
                               </div>
                               <span className="text-xs font-bold text-slate-500">آپلود تصویر</span>
                            </>
                         )}
                         {/* Mock Input */}
                         <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" />
                      </div>
                      <div className="text-[10px] text-slate-400 text-center">
                         حداکثر حجم: ۵ مگابایت (JPG, PNG)
                      </div>
                   </section>

                   {/* Raw Materials */}
                   <section className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
                      <h2 className="text-lg font-black text-slate-800 flex items-center gap-2">
                         <ChefHat className={`w-5 h-5 text-${brandColor}-600`} />
                         مواد اولیه
                      </h2>
                      <div className="flex flex-wrap gap-2 mb-2">
                         {editingProduct.rawMaterials?.map((mat, idx) => (
                            <span key={idx} className={`bg-${brandColor}-50 text-${brandColor}-700 px-2 py-1 rounded-lg text-xs font-bold flex items-center gap-1`}>
                               {mat}
                               <button onClick={() => removeRawMaterial(idx)} className={`hover:text-${brandColor}-900`}><X className="w-3 h-3" /></button>
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
                            className={`w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:border-${brandColor}-500`}
                         />
                         <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[10px] text-slate-400">Enter ↵</span>
                      </div>
                   </section>

                   {/* System Tip */}
                   <div className="bg-blue-50 border border-blue-100 p-6 rounded-3xl relative overflow-hidden">
                      <div className="flex items-start gap-3 relative z-10">
                         <AlertCircle className="w-5 h-5 text-blue-600 shrink-0" />
                         <div>
                            <h4 className="font-bold text-blue-800 text-sm mb-1">نکته مدیریتی</h4>
                            <p className="text-xs text-blue-600 leading-relaxed">
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
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-30"
              onClick={() => setProductToDelete(null)}
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-white w-full max-w-sm rounded-[2rem] shadow-2xl relative z-[60] p-6 flex flex-col items-center text-center"
            >
              <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mb-4">
                <AlertTriangle className="w-8 h-8 text-red-500" />
              </div>
              <h3 className="text-lg font-black text-slate-800 mb-2">حذف محصول</h3>
              <p className="text-sm text-slate-500 mb-8 leading-relaxed">
                آیا از حذف این محصول اطمینان دارید؟ این عملیات قابل بازگشت نیست.
              </p>
              <div className="flex gap-3 w-full">
                <button 
                  onClick={() => setProductToDelete(null)}
                  className="flex-1 py-3 bg-slate-100 text-slate-600 font-bold rounded-xl hover:bg-slate-200 transition-colors"
                >
                  انصراف
                </button>
                <button 
                  onClick={confirmDelete}
                  className="flex-1 py-3 bg-red-500 text-white font-bold rounded-xl hover:bg-red-600 transition-colors shadow-lg shadow-red-200"
                >
                  بله، حذف کن
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};

export default ProductManager;
