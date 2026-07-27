import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, 
  Trash, 
  ToggleLeft, 
  ToggleRight, 
  ShoppingBag,
  Circle
} from '@phosphor-icons/react';

interface ModifierItem {
  id: string;
  name: string;
  price: number;
  isMandatory: boolean;
}

interface ProductManagementModuleProps {
  theme: 'light' | 'dark';
}

export const ProductManagementModule: React.FC<ProductManagementModuleProps> = ({ theme }) => {
  // Module-specific state
  const [prodName, setProdName] = useState<string>('برگر دوبل با پنیر اضافه');
  const [prodPrice, setProdPrice] = useState<number>(310000);
  const [discountPrice, setDiscountPrice] = useState<number>(275000);
  const [useDiscount, setUseDiscount] = useState<boolean>(true);
  const [isAvailable, setIsAvailable] = useState<boolean>(true);
  const [selectedTag, setSelectedTag] = useState<string>('🔥 پرفروش‌ترین');
  const [ingredients, setIngredients] = useState<string[]>([
    'گوشت گرم 180 گرمی',
    'پنیر گودا ذوب شده',
    'کاهو فرانسوی و گوجه',
    'سس مخصوص ویترین'
  ]);
  const [newIngredient, setNewIngredient] = useState<string>('');
  
  // Modifiers
  const [modifiers, setModifiers] = useState<ModifierItem[]>([
    { id: '1', name: 'سس قارچ اضافه', price: 45000, isMandatory: false },
    { id: '2', name: 'پیاز سوخاری (4 حلقه)', price: 35000, isMandatory: false }
  ]);
  
  const [newModName, setNewModName] = useState<string>('');
  const [newModPrice, setNewModPrice] = useState<number>(15000);
  const [newModMandatory, setNewModMandatory] = useState<boolean>(false);
  const [autosaveStatus, setAutosaveStatus] = useState<string>('تغییرات شما فوراً همگام می‌شود');

  const addIngredient = () => {
    if (!newIngredient.trim()) return;
    setIngredients([...ingredients, newIngredient.trim()]);
    setNewIngredient('');
    triggerAutosaveEffect();
  };

  const removeIngredient = (idx: number) => {
    setIngredients(ingredients.filter((_, i) => i !== idx));
    triggerAutosaveEffect();
  };

  const addModifier = () => {
    if (!newModName.trim()) return;
    const newMod: ModifierItem = {
      id: Date.now().toString(),
      name: newModName.trim(),
      price: newModPrice,
      isMandatory: newModMandatory
    };
    setModifiers([...modifiers, newMod]);
    setNewModName('');
    triggerAutosaveEffect();
  };

  const removeModifier = (id: string) => {
    setModifiers(modifiers.filter(m => m.id !== id));
    triggerAutosaveEffect();
  };

  const triggerAutosaveEffect = () => {
    setAutosaveStatus('در حال همگام‌سازی...');
    setTimeout(() => {
      setAutosaveStatus('تغییرات با موفقیت ذخیره شد');
    }, 800);
  };

  return (
    <section 
      id="products" 
      className="py-16 md:py-24 bg-[#EEF2F0] dark:bg-[#101412] text-slate-900 dark:text-slate-100 transition-colors duration-300 border-b border-slate-200/50 dark:border-white/[0.04] scroll-mt-20"
    >
      <div className="max-w-[1200px] mx-auto px-6">
        
        {/* Module Header */}
        <div className="text-right max-w-2xl mb-12">
          <span className="text-[10px] uppercase tracking-[0.2em] font-black text-emerald-600 dark:text-[#19C78C] bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
            ماژول شماره دو
          </span>
          <h2 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white mt-4 leading-none tracking-tight">
            مدیریت محصولات فوق‌العاده هوشمند
          </h2>
          <p className="text-slate-500 dark:text-slate-400 mt-4 leading-relaxed font-bold text-sm md:text-base">
            دیگر نیازی به پنل‌های پیچیده و دیتابیس‌های سنتی نیست. در این ماژول می‌توانید موجودی، قیمت‌های جشنواره، مخلفات و چاشنی‌های دلخواه را مدیریت کرده و خروجی زنده آن را به صورت آنی مشاهده کنید.
          </p>
        </div>

        {/* Unified connected workspace: Editor & Live Product Card */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* Form Editor Side (Right in RTL) */}
          <div className="lg:col-span-7 bg-white dark:bg-[#141917] rounded-[2rem] border border-slate-200/60 dark:border-white/5 p-6 md:p-8 shadow-[0_12px_24px_-10px_rgba(0,0,0,0.03)] dark:shadow-none text-right">
            
            {/* Window header banner */}
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100 dark:border-white/5">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-slate-200 dark:bg-slate-800" />
                <span className="w-2.5 h-2.5 rounded-full bg-slate-200 dark:bg-slate-800" />
                <span className="w-2.5 h-2.5 rounded-full bg-[#10b981]" />
              </div>
              <span className="text-[11px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                پنل مدیریت محصول
              </span>
            </div>

            <div className="space-y-6">
              
              {/* Product Basic Info fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-black text-slate-500 dark:text-slate-400 block mb-2">نام غذا / محصول</label>
                  <input 
                    type="text" 
                    value={prodName}
                    onChange={(e) => { setProdName(e.target.value); triggerAutosaveEffect(); }}
                    className="w-full bg-slate-50 dark:bg-[#101412] border border-slate-200/80 dark:border-white/5 rounded-xl px-4 py-2.5 text-xs text-slate-800 dark:text-white font-bold text-right focus:outline-none focus:ring-1 focus:ring-[#10b981]/50" 
                  />
                </div>
                <div>
                  <label className="text-[10px] font-black text-slate-500 dark:text-slate-400 block mb-2">قیمت پایه (تومان)</label>
                  <input 
                    type="number" 
                    value={prodPrice}
                    onChange={(e) => { setProdPrice(Number(e.target.value)); triggerAutosaveEffect(); }}
                    className="w-full bg-slate-50 dark:bg-[#101412] border border-slate-200/80 dark:border-white/5 rounded-xl px-4 py-2.5 text-xs text-slate-800 dark:text-white font-bold text-left font-mono focus:outline-none focus:ring-1 focus:ring-[#10b981]/50" 
                  />
                </div>
              </div>

              {/* Switches, Availability & discounts in a card wrapper */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-slate-50 dark:bg-[#101412] p-4 rounded-xl border border-slate-200/50 dark:border-white/5">
                
                {/* Use discount checkbox/toggle */}
                <div className="flex flex-col items-end justify-center">
                  <span className="text-[10px] text-slate-500 font-bold mb-1.5">فعال‌سازی تخفیف</span>
                  <button 
                    onClick={() => { setUseDiscount(!useDiscount); triggerAutosaveEffect(); }}
                    className="flex items-center gap-1 text-xs font-bold text-slate-600 hover:text-slate-800 border-0 bg-transparent cursor-pointer focus:outline-none"
                  >
                    {useDiscount ? (
                      <ToggleRight className="w-8 h-8 text-[#10b981]" weight="fill" />
                    ) : (
                      <ToggleLeft className="w-8 h-8 text-slate-300 dark:text-slate-700" />
                    )}
                  </button>
                </div>

                {/* Festival Discount Price input */}
                <div>
                  <label className="text-[10px] text-slate-500 font-bold block mb-2">قیمت تخفیف (تومان)</label>
                  <input 
                    type="number" 
                    value={discountPrice}
                    disabled={!useDiscount}
                    onChange={(e) => { setDiscountPrice(Number(e.target.value)); triggerAutosaveEffect(); }}
                    className={`w-full bg-slate-100 dark:bg-[#141917] border border-slate-200/80 dark:border-white/5 rounded-xl px-4 py-2 text-xs font-bold text-left font-mono focus:outline-none focus:ring-1 focus:ring-[#10b981]/50 ${
                      !useDiscount ? 'opacity-40 text-slate-400 dark:text-slate-700' : 'text-emerald-500'
                    }`} 
                  />
                </div>

                {/* Availability Toggle */}
                <div className="flex flex-col items-end justify-center">
                  <span className="text-[10px] text-slate-500 font-bold mb-1.5">وضعیت موجودی</span>
                  <button 
                    onClick={() => { setIsAvailable(!isAvailable); triggerAutosaveEffect(); }}
                    className="flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-slate-800 border-0 bg-transparent cursor-pointer focus:outline-none"
                  >
                    {isAvailable ? (
                      <span className="flex items-center gap-1.5">
                        <span className="text-[9px] bg-emerald-500/10 text-emerald-600 dark:text-[#19C78C] px-2 py-0.5 rounded font-black">موجود</span>
                        <ToggleRight className="w-8 h-8 text-emerald-500" weight="fill" />
                      </span>
                    ) : (
                      <span className="flex items-center gap-1.5">
                        <span className="text-[9px] bg-rose-500/10 text-rose-600 dark:text-rose-400 px-2 py-0.5 rounded font-black">ناموجود</span>
                        <ToggleLeft className="w-8 h-8 text-slate-300 dark:text-slate-700" />
                      </span>
                    )}
                  </button>
                </div>

              </div>

              {/* Tag / Badge options */}
              <div>
                <label className="text-[10px] font-black text-slate-500 dark:text-slate-400 block mb-2.5">انتخاب برچسب تصویر</label>
                <div className="flex flex-wrap gap-2 justify-end">
                  {['🔥 پرفروش‌ترین', '🌶️ تند و اسپایسی', '🆕 غذای جدید', '🥬 رژیمی / کتو'].map((tag) => (
                    <button
                      key={tag}
                      onClick={() => { setSelectedTag(selectedTag === tag ? '' : tag); triggerAutosaveEffect(); }}
                      className={`px-3 py-1.5 rounded-lg text-[10px] font-black transition-all border cursor-pointer ${
                        selectedTag === tag 
                          ? 'bg-[#10b981] text-white border-transparent shadow-sm' 
                          : 'bg-slate-50 dark:bg-[#101412] text-slate-500 dark:text-slate-400 border-slate-200 dark:border-white/5 hover:bg-slate-100 dark:hover:bg-white/5'
                      }`}
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>

              {/* Ingredients / Materials management */}
              <div>
                <label className="text-[10px] font-black text-slate-500 dark:text-slate-400 block mb-2">مدیریت مواد اولیه تشکیل‌دهنده (مشتری می‌تواند حذف کند)</label>
                <div className="flex gap-2 mb-3">
                  <button 
                    onClick={addIngredient}
                    className="px-4 py-2 bg-[#10b981] hover:bg-emerald-500 text-white rounded-xl text-xs font-black flex items-center gap-1 active:scale-95 border-0 cursor-pointer shadow-sm"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>افزودن</span>
                  </button>
                  <input 
                    type="text" 
                    value={newIngredient}
                    onChange={(e) => setNewIngredient(e.target.value)}
                    placeholder="مثال: قارچ دکمه‌ای اسلایس شده"
                    className="flex-1 bg-slate-50 dark:bg-[#101412] border border-slate-200/80 dark:border-white/5 rounded-xl px-4 py-2 text-xs text-slate-800 dark:text-white font-bold text-right focus:outline-none focus:ring-1 focus:ring-[#10b981]/50" 
                  />
                </div>
                <div className="flex flex-wrap gap-1.5 justify-end">
                  <AnimatePresence>
                    {ingredients.map((ing, idx) => (
                      <motion.span 
                        layoutId={`ing-${ing}`}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        key={ing} 
                        className="bg-slate-50 dark:bg-[#101412] text-xs font-bold border border-slate-200 dark:border-white/5 pl-2 pr-3 py-1 rounded-lg flex items-center gap-1.5 text-slate-700 dark:text-slate-300"
                      >
                        <button 
                          onClick={() => removeIngredient(idx)} 
                          className="text-slate-400 hover:text-rose-500 text-[10px] font-mono border-0 bg-transparent cursor-pointer"
                        >
                          ✕
                        </button>
                        <span>{ing}</span>
                      </motion.span>
                    ))}
                  </AnimatePresence>
                </div>
              </div>

              {/* Additive & Modifiers */}
              <div className="pt-4 border-t border-slate-100 dark:border-white/5 text-right">
                <label className="text-[10px] font-black text-slate-500 dark:text-slate-400 block mb-2">مدیریت افزودنی‌ها و چاشنی‌ها (انتخابی مشتری با هزینه مجزا)</label>
                
                {/* Modifier Builder Form */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-2 mb-4 bg-slate-50 dark:bg-[#101412] p-3 rounded-xl border border-slate-200/50 dark:border-white/5 items-end">
                  
                  <div>
                    <label className="text-[9px] text-slate-400 block mb-1">نوع انتخاب</label>
                    <button 
                      onClick={() => setNewModMandatory(!newModMandatory)}
                      className="w-full text-right px-3 py-2 rounded-lg border border-slate-200 dark:border-white/5 bg-white dark:bg-[#141917] text-[10px] font-bold text-slate-700 dark:text-slate-300 cursor-pointer"
                    >
                      {newModMandatory ? 'اجباری ⚠️' : 'اختیاری 📝'}
                    </button>
                  </div>

                  <div>
                    <label className="text-[9px] text-slate-400 block mb-1">هزینه افزودنی (تومان)</label>
                    <input 
                      type="number" 
                      value={newModPrice}
                      onChange={(e) => setNewModPrice(Number(e.target.value))}
                      className="w-full bg-white dark:bg-[#141917] border border-slate-200 dark:border-white/5 rounded-lg px-2 py-1.5 text-xs font-mono text-left text-emerald-500 font-bold focus:outline-none"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="text-[9px] text-slate-400 block mb-1">عنوان افزودنی</label>
                    <div className="flex gap-1.5">
                      <input 
                        type="text" 
                        value={newModName}
                        onChange={(e) => setNewModName(e.target.value)}
                        placeholder="مثال: سس دیپ پنیر چدار"
                        className="w-full bg-white dark:bg-[#141917] border border-slate-200 dark:border-white/5 rounded-lg px-2 py-1.5 text-xs text-right text-slate-800 dark:text-white font-bold focus:outline-none"
                      />
                      <button 
                        onClick={addModifier}
                        className="px-4 py-1.5 bg-[#10b981] hover:bg-emerald-500 text-white font-bold rounded-lg text-xs flex items-center justify-center gap-1 cursor-pointer border-0 shrink-0"
                      >
                        <Plus className="w-3 h-3" />
                        <span>افزودن</span>
                      </button>
                    </div>
                  </div>

                </div>

                {/* Modifiers List */}
                <div className="space-y-1.5">
                  <AnimatePresence>
                    {modifiers.map((mod) => (
                      <motion.div 
                        initial={{ opacity: 0, y: 4 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -4 }}
                        key={mod.id} 
                        className="bg-slate-50 dark:bg-[#101412] px-4 py-2 rounded-xl border border-slate-200/50 dark:border-white/5 flex items-center justify-between text-xs font-bold"
                      >
                        <button 
                          onClick={() => removeModifier(mod.id)} 
                          className="text-slate-400 hover:text-rose-500 transition-colors border-0 bg-transparent cursor-pointer" 
                          title="حذف افزودنی"
                        >
                          <Trash className="w-4 h-4" />
                        </button>
                        
                        <div className="flex items-center gap-3">
                          <span className="text-emerald-600 dark:text-[#19C78C] font-mono">+{mod.price.toLocaleString()} تومان</span>
                          <span className={`text-[9px] px-1.5 py-0.5 rounded ${mod.isMandatory ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400' : 'bg-slate-200 dark:bg-white/5 text-slate-500'}`}>
                            {mod.isMandatory ? 'اجباری' : 'اختیاری'}
                          </span>
                          <span className="text-slate-700 dark:text-slate-200">{mod.name}</span>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>

              </div>

            </div>

          </div>

          {/* Interactive Live Product Preview Side (Left in RTL) */}
          <div className="lg:col-span-5 flex flex-col justify-center items-center">
            
            <div className="w-full text-center lg:text-right mb-6 lg:mb-8">
              <span className="text-[10px] font-black tracking-widest text-slate-400 block mb-2 select-none uppercase">پیش‌نمایش زنده کارت محصول</span>
              <div className="flex items-center justify-center lg:justify-end gap-1 text-[11px] font-bold text-slate-400">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span>{autosaveStatus}</span>
              </div>
            </div>

            {/* Simulated Customer-Facing Product Card with clean layout, animations, availability indicators */}
            <motion.div 
              layout
              className={`w-full max-w-[340px] rounded-[2.5rem] bg-white dark:bg-[#141917] border border-slate-200/60 dark:border-white/5 p-5 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)] text-slate-900 dark:text-slate-100 overflow-hidden relative group transition-opacity duration-300 ${
                !isAvailable ? 'opacity-50' : ''
              }`}
            >
              {/* Image Badging / Tag */}
              {selectedTag && isAvailable && (
                <span className="absolute top-4 right-4 z-10 bg-[#10b981] text-white text-[9px] font-black px-3 py-1 rounded-full shadow-sm select-none">
                  {selectedTag}
                </span>
              )}

              {/* Out of Stock overlay state */}
              {!isAvailable && (
                <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-[2px] z-20 flex items-center justify-center rounded-[2.5rem] select-none">
                  <div className="px-5 py-2.5 bg-slate-900 text-white font-black text-[10px] rounded-xl border border-white/10 flex items-center gap-1.5 shadow-md">
                    <Circle className="w-2.5 h-2.5 text-rose-500 animate-pulse" weight="fill" />
                    <span>موقتاً پایان موجودی در سالن</span>
                  </div>
                </div>
              )}

              {/* Product Visual Photo */}
              <div className="h-44 bg-slate-50 dark:bg-[#101412] rounded-2xl mb-4 overflow-hidden relative">
                <img 
                  src="https://picsum.photos/seed/burger_full/400/300" 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out" 
                  alt={prodName} 
                />
              </div>

              {/* Product Details info block */}
              <h3 className="text-base font-black text-slate-900 dark:text-white mb-2 text-right truncate">
                {prodName || 'برگر دوبل زغالی'}
              </h3>
              
              {/* Ingredients list rendered inside the live customer card */}
              <div className="flex flex-wrap gap-1 mb-4 justify-start flex-row-reverse">
                {ingredients.slice(0, 3).map((ing) => (
                  <span 
                    key={ing} 
                    className="bg-slate-50 dark:bg-[#101412] text-slate-500 dark:text-slate-400 border border-slate-100 dark:border-white/5 text-[9px] px-2 py-0.5 rounded"
                  >
                    {ing}
                  </span>
                ))}
                {ingredients.length > 3 && (
                  <span className="text-slate-400 dark:text-slate-500 text-[8px] font-bold py-0.5 self-center">
                    +{ingredients.length - 3} مورد دیگر
                  </span>
                )}
              </div>

              {/* Modifiers selected inside customer view */}
              {modifiers.length > 0 && (
                <div className="mb-4 pt-3 border-t border-slate-100 dark:border-white/5 text-right">
                  <span className="text-[9px] text-slate-400 font-bold block mb-1.5">مخلفات قابل سفارش</span>
                  <div className="space-y-1">
                    {modifiers.slice(0, 2).map(m => (
                      <div key={m.id} className="flex justify-between items-center text-[9px] text-slate-500 dark:text-slate-400">
                        <span className="font-mono text-emerald-600 dark:text-emerald-400">+{m.price.toLocaleString()} تومان</span>
                        <span>• {m.name}</span>
                      </div>
                    ))}
                    {modifiers.length > 2 && <span className="text-slate-400 text-[8px] block mt-1">+{modifiers.length - 2} مورد دیگر</span>}
                  </div>
                </div>
              )}

              {/* Pricing display bar */}
              <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-100 dark:border-[#101412] text-right">
                <span className="text-xs text-slate-400 dark:text-slate-500 font-bold">قیمت آیتم منو</span>

                <div className="text-left">
                  {useDiscount ? (
                    <div className="flex flex-col">
                      <span className="text-[9px] text-slate-400 dark:text-slate-500 line-through font-mono font-bold leading-none">
                        {prodPrice.toLocaleString()} تومان
                      </span>
                      <span className="text-sm font-black text-emerald-600 dark:text-[#19C78C] font-mono mt-1">
                        {discountPrice.toLocaleString()} تومان
                      </span>
                    </div>
                  ) : (
                    <span className="text-sm font-black text-slate-900 dark:text-white font-mono">
                      {prodPrice.toLocaleString()} تومان
                    </span>
                  )}
                </div>
              </div>

            </motion.div>

          </div>

        </div>

      </div>
    </section>
  );
};
