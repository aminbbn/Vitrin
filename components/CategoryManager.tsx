import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, 
  Trash2, 
  Edit3, 
  Check, 
  X, 
  Image as ImageIcon, 
  Layers, 
  MoveUp, 
  MoveDown,
  AlertTriangle,
  FolderOpen,
  ArrowLeftRight,
  ChevronUp,
  ChevronDown,
  ChevronRight,
  ChevronLeft
} from 'lucide-react';
import { Category } from '../types';
import { useCatalog } from '../data/useRepositories';

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.05 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 15 },
  show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 350, damping: 25 } },
  exit: { opacity: 0, scale: 0.95, transition: { duration: 0.15 } }
};

interface CategoryManagerProps {
  brandColor: string;
}

const CategoryManager: React.FC<CategoryManagerProps> = ({ brandColor }) => {
  const { categories, products, saveCategories, saveProducts, loading } = useCatalog();
  const [view, setView] = useState<'list' | 'edit' | 'create'>('list');
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [categoryToDelete, setCategoryToDelete] = useState<string | null>(null);
  
  // Conflict resolution states
  const [conflictCategory, setConflictCategory] = useState<Category | null>(null);
  const [targetCategoryId, setTargetCategoryId] = useState<string>('');

  const activeCategoriesOnly = categories.filter(c => c.state !== 'archived');

  const handleCreate = () => {
    setEditingCategory({
      id: `c-${Date.now()}`,
      name: '',
      image: '',
      order: activeCategoriesOnly.length,
      state: 'active'
    });
    setView('create');
  };

  const handleEdit = (category: Category) => {
    setEditingCategory({ ...category });
    setView('edit');
  };

  const handleDelete = async (id: string) => {
    try {
      const newCategories = categories.filter(c => c.id !== id);
      newCategories.forEach((c, i) => c.order = i);
      await saveCategories(newCategories);
      setCategoryToDelete(null);
    } catch (err) {
      // Mock repository will throw if category has active products referencing it.
      // Show the conflict resolution modal.
      const cat = categories.find(c => c.id === id);
      if (cat) {
        setConflictCategory(cat);
        const otherCats = activeCategoriesOnly.filter(c => c.id !== id);
        if (otherCats.length > 0) {
          setTargetCategoryId(otherCats[0].id);
        }
      }
      setCategoryToDelete(null);
    }
  };

  const handleArchiveCategory = async (cat: Category) => {
    const updatedCategories = categories.map(c => 
      c.id === cat.id ? { ...c, state: 'archived' as const } : c
    );
    await saveCategories(updatedCategories);
    setConflictCategory(null);
  };

  const handleMoveProductsAndDelete = async (oldCatId: string, newCatId: string) => {
    const targetCat = categories.find(c => c.id === newCatId);
    if (!targetCat) return;

    // Update referencing products
    const updatedProducts = products.map(p => 
      p.categoryId === oldCatId ? { ...p, categoryId: newCatId, category: targetCat.name } : p
    );
    await saveProducts(updatedProducts);

    // Save and delete
    const newCategories = categories.filter(c => c.id !== oldCatId);
    newCategories.forEach((c, i) => c.order = i);
    await saveCategories(newCategories);
    setConflictCategory(null);
  };

  const handleSave = () => {
    if (!editingCategory || !editingCategory.name) return;

    if (view === 'create') {
      saveCategories([...categories, editingCategory]);
    } else {
      saveCategories(categories.map(c => c.id === editingCategory.id ? editingCategory : c));
    }
    setView('list');
    setEditingCategory(null);
  };

  const handleMove = (index: number, direction: 'up' | 'down') => {
    if (direction === 'up' && index === 0) return;
    if (direction === 'down' && index === activeCategoriesOnly.length - 1) return;

    const newCategories = [...activeCategoriesOnly];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    
    // Swap order values
    const temp = newCategories[index].order;
    newCategories[index].order = newCategories[targetIndex].order;
    newCategories[targetIndex].order = temp;

    // Reassemble full array containing both active and archived categories
    const archivedCategories = categories.filter(c => c.state === 'archived');
    saveCategories([...newCategories, ...archivedCategories]);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full w-full bg-slate-50 dark:bg-slate-950" dir="rtl">
        <div className="flex flex-col items-center gap-4">
          <div className={`w-12 h-12 rounded-full border-4 border-slate-200 border-t-${brandColor}-500 animate-spin`} />
          <p className="text-sm text-slate-400 font-medium">در حال بارگذاری اطلاعات دسته‌بندی‌ها...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`p-4 sm:p-6 lg:p-8 w-full max-w-[1440px] mx-auto h-full font-['Vazirmatn'] ${view === 'list' ? 'flex flex-col overflow-hidden' : 'overflow-y-auto pb-32'}`} dir="rtl">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 shrink-0">
        <div>
          <h1 className="text-xl sm:text-2xl md:text-3xl font-black text-slate-800 dark:text-slate-100 tracking-tight flex items-center gap-3">
            <Layers className={`w-7 h-7 sm:w-8 sm:h-8 text-${brandColor}-600 dark:text-${brandColor}-400`} />
            مدیریت دسته‌بندی‌ها
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1 font-medium text-xs">دسته‌بندی‌های منو را تعریف و مرتب‌سازی کنید</p>
        </div>

        {view === 'list' && (
          <button 
            onClick={handleCreate}
            className={`w-full sm:w-auto justify-center bg-${brandColor}-600 hover:bg-${brandColor}-700 text-white px-5 py-2.5 rounded-xl text-sm font-bold shadow-lg shadow-${brandColor}-600/20 dark:shadow-none transition-all flex items-center gap-2 hover:scale-[1.02] active:scale-[0.98]`}
          >
            <Plus className="w-5 h-5" />
            دسته‌بندی جدید
          </button>
        )}
      </div>

      <AnimatePresence mode="wait">
        {view === 'list' ? (
          <motion.div
            key="list"
            variants={containerVariants}
            initial="hidden"
            animate="show"
            exit={{ opacity: 0, y: -20, transition: { duration: 0.2 } }}
            className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/60 dark:border-slate-800/80 shadow-xl shadow-slate-200/40 dark:shadow-none overflow-hidden flex-1 flex flex-col min-h-0"
          >
            <div className="p-4 md:p-6 border-b border-slate-150 dark:border-slate-800/60 flex items-center justify-between bg-slate-50/50 dark:bg-slate-950/20 shrink-0">
              <h2 className="text-sm font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
                <Layers className="w-5 h-5 text-slate-400 dark:text-slate-500" />
                لیست دسته‌بندی‌ها
              </h2>
              <span className="bg-white dark:bg-slate-950 px-3 py-1 rounded-lg text-xs font-bold text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800 shadow-xs">
                {activeCategoriesOnly.length} دسته فعال
              </span>
            </div>

            <div className="divide-y divide-slate-100 dark:divide-slate-800/60 flex-1 overflow-y-auto">
              <AnimatePresence>
                {activeCategoriesOnly.map((category, index) => (
                  <motion.div 
                    key={category.id}
                    variants={itemVariants}
                    layout
                    className="p-4 flex flex-col md:flex-row md:items-center gap-4 hover:bg-slate-50 dark:hover:bg-slate-950/20 transition-colors group"
                  >
                    {/* First row: image + name */}
                    <div className="flex items-center gap-4 flex-1 min-w-0">
                      {/* Image */}
                      <div className="w-16 h-16 rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-950 flex-shrink-0 border border-slate-200/60 dark:border-slate-800 relative">
                        {category.image && category.image.trim() !== '' ? (
                          <img src={category.image || undefined} alt={category.name} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-slate-400 dark:text-slate-500">
                            <ImageIcon className="w-6 h-6 opacity-40" />
                          </div>
                        )}
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-slate-800 dark:text-slate-200 text-sm truncate md:whitespace-normal">{category.name}</h3>
                        {/* Optional metadata: count of products in this category */}
                        <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-1 font-medium">
                          {products.filter(p => p.categoryId === category.id).length} محصول
                        </p>
                      </div>
                    </div>

                    {/* Actions and Reordering row on mobile, inline on desktop */}
                    <div className="flex items-center justify-between md:justify-end gap-2 border-t border-slate-100 dark:border-slate-800/40 pt-3 md:pt-0 md:border-t-0 opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity">
                      {/* Reorder controls */}
                      <div className="flex items-center md:flex-row gap-1 bg-slate-100 dark:bg-slate-950 rounded-xl p-1 border border-slate-200/50 dark:border-slate-800">
                        <button 
                          onClick={() => handleMove(index, 'up')}
                          disabled={index === 0}
                          className="p-1.5 text-slate-400 dark:text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-white dark:hover:bg-slate-900 rounded-lg transition-colors"
                          title="انتقال به بالا"
                          aria-label="انتقال به بالا"
                        >
                          <ChevronUp className="w-4 h-4 md:hidden" />
                          <MoveUp className="w-3.5 h-3.5 hidden md:block" />
                        </button>
                        <button 
                          onClick={() => handleMove(index, 'down')}
                          disabled={index === activeCategoriesOnly.length - 1}
                          className="p-1.5 text-slate-400 dark:text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-white dark:hover:bg-slate-900 rounded-lg transition-colors"
                          title="انتقال به پایین"
                          aria-label="انتقال به پایین"
                        >
                          <ChevronDown className="w-4 h-4 md:hidden" />
                          <MoveDown className="w-3.5 h-3.5 hidden md:block" />
                        </button>
                      </div>

                      {/* Edit / Delete */}
                      <div className="flex items-center gap-1.5">
                        <button 
                          onClick={() => handleEdit(category)}
                          className={`w-11 h-11 md:w-9 md:h-9 flex items-center justify-center bg-slate-50 dark:bg-slate-850 hover:bg-${brandColor}-50 dark:hover:bg-${brandColor}-950 text-slate-550 dark:text-slate-400 hover:text-${brandColor}-600 dark:hover:text-${brandColor}-400 rounded-xl transition-all active:scale-95`}
                          title="ویرایش"
                          aria-label="ویرایش دسته‌بندی"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => setCategoryToDelete(category.id)}
                          className="w-11 h-11 md:w-9 md:h-9 flex items-center justify-center bg-slate-50 dark:bg-slate-850 hover:bg-rose-50 dark:hover:bg-rose-950/30 text-slate-550 dark:text-slate-400 hover:text-rose-600 dark:hover:text-rose-450 rounded-xl transition-all active:scale-95"
                          title="حذف"
                          aria-label="حذف دسته‌بندی"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>

              {activeCategoriesOnly.length === 0 && (
                <div className="p-12 text-center flex flex-col items-center">
                  <div className="w-20 h-20 bg-slate-50 dark:bg-slate-950 rounded-full flex items-center justify-center mb-4">
                    <Layers className="w-8 h-8 text-slate-300 dark:text-slate-600" />
                  </div>
                  <h3 className="text-slate-800 dark:text-slate-200 font-bold mb-1">هیچ دسته‌بندی یافت نشد</h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400 max-w-sm mx-auto mb-6">
                    شما هنوز هیچ دسته‌بندی اضافه نکرده‌اید. برای شروع یک دسته‌بندی جدید ایجاد کنید.
                  </p>
                  <button 
                    onClick={handleCreate}
                    className={`text-${brandColor}-600 dark:text-${brandColor}-400 font-bold hover:bg-${brandColor}-50 dark:hover:bg-${brandColor}-950/30 px-4 py-2 rounded-xl transition-colors text-xs`}
                  >
                    + افزودن اولین دسته‌بندی
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="form"
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl shadow-slate-200/50 dark:shadow-none p-6 md:p-8 relative overflow-hidden"
          >
            {/* Form Header */}
            <div className="flex items-center justify-between mb-8 pb-6 border-b border-slate-100 dark:border-slate-800">
              <h2 className="text-lg font-black text-slate-800 dark:text-slate-100 flex items-center gap-3">
                <span className={`w-10 h-10 rounded-xl bg-${brandColor}-50 dark:bg-${brandColor}-950/40 flex items-center justify-center text-${brandColor}-600 dark:text-${brandColor}-400`}>
                  {view === 'create' ? <Plus className="w-5 h-5" /> : <Edit3 className="w-5 h-5" />}
                </span>
                {view === 'create' ? 'ایجاد دسته‌بندی جدید' : 'ویرایش دسته‌بندی'}
              </h2>
              
              <button 
                onClick={() => {
                  setView('list');
                  setEditingCategory(null);
                }}
                className="w-10 h-10 rounded-xl bg-slate-50 dark:bg-slate-950 text-slate-400 hover:text-slate-700 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-850 flex items-center justify-center transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {editingCategory && (
              <div className="space-y-6 max-w-2xl">
                {/* Name */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                    <Layers className="w-4 h-4 text-slate-400 dark:text-slate-500" />
                    نام دسته‌بندی
                    <span className="text-rose-500">*</span>
                  </label>
                  <input 
                    type="text" 
                    value={editingCategory.name}
                    onChange={e => setEditingCategory({ ...editingCategory, name: e.target.value })}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl px-4 py-3.5 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-slate-300 dark:focus:ring-slate-800 transition-all font-medium text-xs"
                    placeholder="مثلاً: پیتزا، نوشیدنی، پیش‌غذا..."
                  />
                </div>

                {/* Image URL */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                    <ImageIcon className="w-4 h-4 text-slate-400 dark:text-slate-500" />
                    لینک تصویر 
                    <span className="text-slate-400 dark:text-slate-500 font-normal text-[10px]">(اختیاری)</span>
                  </label>
                  <div className="flex gap-4">
                    <div className="flex-1">
                      <input 
                        type="text" 
                        value={editingCategory.image || ''}
                        onChange={e => setEditingCategory({ ...editingCategory, image: e.target.value })}
                        className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl px-4 py-3.5 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-slate-300 dark:focus:ring-slate-800 transition-all text-left font-mono text-xs"
                        placeholder="https://..."
                        dir="ltr"
                      />
                    </div>
                    {editingCategory.image && editingCategory.image.trim() !== '' && (
                      <div className="w-14 h-14 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 flex-shrink-0 bg-slate-50 dark:bg-slate-950">
                        <img src={editingCategory.image || undefined} alt="Preview" className="w-full h-full object-cover" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                      </div>
                    )}
                  </div>
                </div>

                {/* Submit */}
                <div className="pt-8 border-t border-slate-100 dark:border-slate-800 flex gap-3">
                  <button 
                    onClick={handleSave}
                    disabled={!editingCategory.name}
                    className={`flex-1 bg-${brandColor}-600 hover:bg-${brandColor}-700 text-white py-3.5 rounded-2xl font-bold shadow-lg shadow-${brandColor}-600/20 dark:shadow-none transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed text-xs`}
                  >
                    <Check className="w-5 h-5" />
                    ذخیره تغییرات
                  </button>
                  <button 
                    onClick={() => {
                      setView('list');
                      setEditingCategory(null);
                    }}
                    className="px-6 py-3.5 rounded-2xl font-bold text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-750 transition-all text-xs"
                  >
                    انصراف
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {categoryToDelete && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm"
          >
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white dark:bg-slate-900 rounded-3xl p-6 max-w-sm w-full shadow-2xl border border-slate-100 dark:border-slate-800 relative overflow-hidden"
            >
              <div className="w-14 h-14 bg-rose-50 dark:bg-rose-950/30 rounded-full flex items-center justify-center mb-4 text-rose-500 mx-auto">
                <Trash2 className="w-7 h-7" />
              </div>
              <h3 className="text-md font-black text-slate-800 dark:text-slate-100 text-center mb-2">حذف دسته‌بندی</h3>
              <p className="text-slate-500 dark:text-slate-400 text-center text-xs leading-relaxed mb-6">
                آیا از حذف این دسته‌بندی اطمینان دارید؟ این عمل تمام محصولات این دسته را حذف نخواهد کرد مگر اینکه دسته‌بندی خالی باشد.
              </p>
              <div className="flex gap-3">
                <button 
                  onClick={() => setCategoryToDelete(null)}
                  className="flex-1 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 py-2.5 rounded-xl font-bold transition-colors text-xs"
                >
                  انصراف
                </button>
                <button 
                  onClick={() => handleDelete(categoryToDelete)}
                  className="flex-1 bg-rose-500 hover:bg-rose-600 text-white py-2.5 rounded-xl font-bold shadow-lg shadow-rose-500/20 dark:shadow-none transition-all text-xs"
                >
                  بله، حذف کن
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Graceful Conflict Resolution Modal */}
      <AnimatePresence>
        {conflictCategory && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md"
          >
            <motion.div 
              initial={{ scale: 0.95, opacity: 0, y: 15 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 15 }}
              className="bg-white dark:bg-slate-900 rounded-3xl p-6 max-w-md w-full shadow-2xl border border-slate-150 dark:border-slate-800 text-right space-y-6"
            >
              <div className="flex items-center gap-3 border-b border-slate-100 dark:border-slate-800 pb-3">
                 <div className="w-10 h-10 bg-amber-50 dark:bg-amber-950/40 rounded-xl flex items-center justify-center text-amber-500">
                    <AlertTriangle className="w-5 h-5" />
                 </div>
                 <div>
                    <h3 className="text-sm font-black text-slate-800 dark:text-slate-100">دسته‌بندی دارای محصول فعال است</h3>
                    <p className="text-[10px] text-slate-400 mt-0.5">دسته‌بندی «{conflictCategory.name}» را نمی‌توان به طور مستقیم حذف فیزیکی کرد.</p>
                 </div>
              </div>

              <div className="space-y-4">
                 
                 {/* Option 1: Soft Archive Category */}
                 <div className="p-3.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl flex items-start gap-3.5 hover:bg-slate-100/50 transition-colors">
                    <FolderOpen className="w-5 h-5 text-slate-455 mt-0.5 shrink-0" />
                    <div className="space-y-1.5 flex-1">
                       <h4 className="text-xs font-black text-slate-850 dark:text-slate-100">بایگانی دسته‌بندی (پیشنهادی)</h4>
                       <p className="text-[10px] text-slate-500 dark:text-slate-400 leading-relaxed">
                          دسته‌بندی را از لیست عمومی غیرفعال و مخفی می‌کند، اما محصولات و آمارهای تاریخی ثبت شده پابرجا می‌مانند.
                       </p>
                       <button
                          onClick={() => handleArchiveCategory(conflictCategory)}
                          className={`mt-1 text-[10px] font-bold text-${brandColor}-600 bg-${brandColor}-50 hover:bg-${brandColor}-100 dark:bg-${brandColor}-950/40 dark:hover:bg-${brandColor}-900/40 px-3 py-1 rounded-lg transition-colors`}
                       >
                          بایگانی کردن دسته‌بندی
                       </button>
                    </div>
                 </div>

                 {/* Option 2: Reassign products then Delete */}
                 {activeCategoriesOnly.filter(c => c.id !== conflictCategory.id).length > 0 && (
                    <div className="p-3.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl flex items-start gap-3.5 hover:bg-slate-100/50 transition-colors">
                       <ArrowLeftRight className="w-5 h-5 text-slate-455 mt-0.5 shrink-0" />
                       <div className="space-y-2 flex-1">
                          <h4 className="text-xs font-black text-slate-850 dark:text-slate-100">انتقال تمام محصولات و حذف دسته‌بندی</h4>
                          <p className="text-[10px] text-slate-500 dark:text-slate-400 leading-relaxed">
                             محصولات فعال این دسته‌بندی را به دسته‌بندی دیگری منتقل کنید و سپس این دسته‌بندی را حذف نمایید.
                          </p>
                          
                          <div className="flex items-center gap-2 mt-2">
                             <select
                                value={targetCategoryId}
                                onChange={e => setTargetCategoryId(e.target.value)}
                                className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 p-1.5 rounded-lg text-[10px] outline-none"
                             >
                                {activeCategoriesOnly.filter(c => c.id !== conflictCategory.id).map(c => (
                                   <option key={c.id} value={c.id}>{c.name}</option>
                                ))}
                             </select>
                             <button
                                onClick={() => handleMoveProductsAndDelete(conflictCategory.id, targetCategoryId)}
                                className="bg-amber-500 hover:bg-amber-600 text-white text-[10px] font-bold px-3 py-1.5 rounded-lg transition-colors"
                             >
                                انتقال و حذف نهایی
                             </button>
                          </div>
                       </div>
                    </div>
                 )}

              </div>

              <div className="border-t border-slate-100 dark:border-slate-800 pt-3 flex justify-end">
                 <button 
                   onClick={() => setConflictCategory(null)}
                   className="px-4 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-600 dark:text-slate-300 text-xs font-bold rounded-xl transition-colors"
                 >
                   انصراف
                 </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
};

export default CategoryManager;
