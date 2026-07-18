import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash2, Edit3, Check, X, Image as ImageIcon, Layers, MoveUp, MoveDown } from 'lucide-react';
import { Category } from '../types';
import { useCatalog } from '../data/useRepositories';

interface CategoryManagerProps {
  brandColor: string;
}

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.05 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } },
  exit: { opacity: 0, scale: 0.9, transition: { duration: 0.2 } }
};

const CategoryManager: React.FC<CategoryManagerProps> = ({ brandColor }) => {
  const { categories, saveCategories, loading } = useCatalog();
  const [view, setView] = useState<'list' | 'edit' | 'create'>('list');
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [categoryToDelete, setCategoryToDelete] = useState<string | null>(null);

  const handleCreate = () => {
    setEditingCategory({
      id: `c${Date.now()}`,
      name: '',
      image: '',
      order: categories.length
    });
    setView('create');
  };

  const handleEdit = (category: Category) => {
    setEditingCategory({ ...category });
    setView('edit');
  };

  const handleDelete = (id: string) => {
    const newCategories = categories.filter(c => c.id !== id);
    // Reorder
    newCategories.forEach((c, i) => c.order = i);
    saveCategories(newCategories);
    setCategoryToDelete(null);
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
    if (direction === 'down' && index === categories.length - 1) return;

    const newCategories = [...categories];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    
    // Swap order values
    const temp = newCategories[index].order;
    newCategories[index].order = newCategories[targetIndex].order;
    newCategories[targetIndex].order = temp;

    saveCategories(newCategories);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full w-full bg-slate-50 dark:bg-slate-950" dir="rtl">
        <div className="flex flex-col items-center gap-4">
          <div className={`w-12 h-12 rounded-full border-4 border-slate-200 border-t-${brandColor}-500 animate-spin`} />
          <p className="text-sm text-slate-400 font-medium">در حال بارگذاری اطلاعات...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`p-4 md:p-8 max-w-5xl mx-auto h-full ${view === 'list' ? 'flex flex-col overflow-hidden' : 'overflow-y-auto pb-32'}`} dir="rtl">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 shrink-0">
        <div>
          <h1 className="text-2xl md:text-3xl font-black text-slate-800 dark:text-slate-100 tracking-tight flex items-center gap-3">
            <Layers className={`w-8 h-8 text-${brandColor}-600 dark:text-${brandColor}-400`} />
            مدیریت دسته‌بندی‌ها
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-2 font-medium">دسته‌بندی‌های منو را تعریف و مرتب‌سازی کنید</p>
        </div>

        {view === 'list' && (
          <button 
            onClick={handleCreate}
            className={`bg-${brandColor}-600 hover:bg-${brandColor}-700 text-white px-5 py-2.5 rounded-xl text-sm font-bold shadow-lg shadow-${brandColor}-600/20 dark:shadow-none transition-all flex items-center gap-2`}
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
            className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/60 dark:border-slate-800 shadow-xl shadow-slate-200/40 dark:shadow-none overflow-hidden flex-1 flex flex-col min-h-0"
          >
            <div className="p-4 md:p-6 border-b border-slate-100 dark:border-slate-800/60 flex items-center justify-between bg-slate-50/50 dark:bg-slate-950/20 shrink-0">
              <h2 className="text-lg font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
                <Layers className="w-5 h-5 text-slate-400 dark:text-slate-500" />
                لیست دسته‌بندی‌ها
              </h2>
              <span className="bg-white dark:bg-slate-950 px-3 py-1 rounded-lg text-xs font-bold text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800 shadow-sm">
                {categories.length} دسته
              </span>
            </div>

            <div className="divide-y divide-slate-100 dark:divide-slate-800/60 flex-1 overflow-y-auto">
              <AnimatePresence>
                {categories.map((category, index) => (
                  <motion.div 
                    key={category.id}
                    variants={itemVariants}
                    layout
                    className="p-4 flex items-center gap-4 hover:bg-slate-50 dark:hover:bg-slate-950/40 transition-colors group"
                  >
                    {/* Image */}
                    <div className="w-16 h-16 rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-950 flex-shrink-0 border border-slate-200 dark:border-slate-800 relative">
                      {category.image && category.image.trim() !== '' ? (
                        <img src={category.image || undefined} alt={category.name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-slate-400 dark:text-slate-500">
                          <ImageIcon className="w-6 h-6 opacity-50" />
                        </div>
                      )}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-slate-800 dark:text-slate-200 text-lg">{category.name}</h3>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2 opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="flex flex-col gap-1 mr-2 bg-slate-100 dark:bg-slate-950 rounded-lg p-1 border border-slate-200/50 dark:border-slate-800">
                        <button 
                          onClick={() => handleMove(index, 'up')}
                          disabled={index === 0}
                          className="p-1 text-slate-400 dark:text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-white dark:hover:bg-slate-900 rounded transition-colors"
                        >
                          <MoveUp className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleMove(index, 'down')}
                          disabled={index === categories.length - 1}
                          className="p-1 text-slate-400 dark:text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-white dark:hover:bg-slate-900 rounded transition-colors"
                        >
                          <MoveDown className="w-4 h-4" />
                        </button>
                      </div>

                      <button 
                        onClick={() => handleEdit(category)}
                        className={`p-2.5 text-slate-400 dark:text-slate-500 hover:text-${brandColor}-600 dark:hover:text-${brandColor}-400 hover:bg-${brandColor}-50 dark:hover:bg-${brandColor}-950/30 rounded-xl transition-colors`}
                        title="ویرایش"
                      >
                        <Edit3 className="w-5 h-5" />
                      </button>
                      <button 
                        onClick={() => setCategoryToDelete(category.id)}
                        className="p-2.5 text-slate-400 dark:text-slate-500 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 rounded-xl transition-colors"
                        title="حذف"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>

              {categories.length === 0 && (
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
                    className={`text-${brandColor}-600 dark:text-${brandColor}-400 font-bold hover:bg-${brandColor}-50 dark:hover:bg-${brandColor}-950/30 px-4 py-2 rounded-xl transition-colors text-sm`}
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
              <h2 className="text-xl font-black text-slate-800 dark:text-slate-100 flex items-center gap-3">
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
                  <label className="text-sm font-bold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                    <Layers className="w-4 h-4 text-slate-400 dark:text-slate-500" />
                    نام دسته‌بندی
                    <span className="text-rose-500">*</span>
                  </label>
                  <input 
                    type="text" 
                    value={editingCategory.name}
                    onChange={e => setEditingCategory({ ...editingCategory, name: e.target.value })}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl px-4 py-3.5 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-slate-300 dark:focus:ring-slate-800 transition-all font-medium"
                    placeholder="مثلاً: پیتزا، نوشیدنی، پیش‌غذا..."
                  />
                </div>

                {/* Image URL */}
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                    <ImageIcon className="w-4 h-4 text-slate-400 dark:text-slate-500" />
                    لینک تصویر 
                    <span className="text-slate-400 dark:text-slate-500 font-normal text-xs">(اختیاری)</span>
                  </label>
                  <div className="flex gap-4">
                    <div className="flex-1">
                      <input 
                        type="text" 
                        value={editingCategory.image || ''}
                        onChange={e => setEditingCategory({ ...editingCategory, image: e.target.value })}
                        className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl px-4 py-3.5 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-slate-300 dark:focus:ring-slate-800 transition-all text-left font-mono text-sm"
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
                  <p className="text-xs text-slate-500 dark:text-slate-400">آدرس اینترنتی (URL) یک تصویر باکیفیت را وارد کنید.</p>
                </div>

                {/* Submit */}
                <div className="pt-8 border-t border-slate-100 dark:border-slate-800 flex gap-3">
                  <button 
                    onClick={handleSave}
                    disabled={!editingCategory.name}
                    className={`flex-1 bg-${brandColor}-600 hover:bg-${brandColor}-700 text-white py-4 rounded-2xl font-bold shadow-lg shadow-${brandColor}-600/20 dark:shadow-none transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed`}
                  >
                    <Check className="w-5 h-5" />
                    ذخیره تغییرات
                  </button>
                  <button 
                    onClick={() => {
                      setView('list');
                      setEditingCategory(null);
                    }}
                    className="px-6 py-4 rounded-2xl font-bold text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-755 transition-all"
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
              className="bg-white dark:bg-slate-900 rounded-3xl p-6 md:p-8 max-w-sm w-full shadow-2xl border border-slate-100 dark:border-slate-800 relative overflow-hidden"
            >
              <div className="w-16 h-16 bg-rose-50 dark:bg-rose-950/30 rounded-full flex items-center justify-center mb-6 text-rose-500 mx-auto">
                <Trash2 className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-black text-slate-800 dark:text-slate-100 text-center mb-2">حذف دسته‌بندی</h3>
              <p className="text-slate-500 dark:text-slate-400 text-center text-sm leading-relaxed mb-8">
                آیا از حذف این دسته‌بندی اطمینان دارید؟ این عمل غیرقابل بازگشت است.
              </p>
              <div className="flex gap-3">
                <button 
                  onClick={() => setCategoryToDelete(null)}
                  className="flex-1 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 py-3 rounded-xl font-bold transition-colors"
                >
                  انصراف
                </button>
                <button 
                  onClick={() => handleDelete(categoryToDelete)}
                  className="flex-1 bg-rose-500 hover:bg-rose-600 text-white py-3 rounded-xl font-bold shadow-lg shadow-rose-500/20 dark:shadow-none transition-all"
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

export default CategoryManager;
