
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
  ArrowLeft
} from 'lucide-react';
import { ComponentItem, Product } from '../types';
import { Search3DAnimation } from './Search3DAnimation';

// --- SHARED MOCK DATA (Ideally this comes from a shared context or API) ---
const MOCK_PRODUCTS: Product[] = [
  { 
    id: '1', 
    name: 'پیتزا پپرونی', 
    category: 'پیتزا',
    price: 245000, 
    description: 'پیتزای کلاسیک با پپرونی تند، پنیر موزارلا و سس گوجه‌فرنگی مخصوص. نان این پیتزا با خمیر ترش ۲۴ ساعته تهیه می‌شود.',
    image: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?q=80&w=1000&auto=format&fit=crop',
    rawMaterials: ['پپرونی ۹۰٪', 'پنیر موزارلا', 'سس مارینارا', 'خمیر دست‌ساز', 'فلفل هالوپینو'],
    estimatedTime: '۲۰ دقیقه',
    rating: 4.8,
    reviews: [
      { id: 'r1', user: 'محمد امینی', comment: 'بهترین پپرونی که تا حالا خوردم!', rating: 5, date: '۲ روز پیش' },
      { id: 'r2', user: 'سارا', comment: 'کمی تند بود ولی خوشمزه', rating: 4, date: 'هفته پیش' }
    ],
    modifiers: [
      { id: 'm1', name: 'سایز', type: 'mandatory', options: [{ id: 'o1', name: 'متوسط', price: 0 }, { id: 'o2', name: 'بزرگ', price: 85000 }] },
      { id: 'm2', name: 'نان', type: 'mandatory', options: [{ id: 'o3', name: 'ایتالیایی', price: 0 }, { id: 'o4', name: 'آمریکایی', price: 15000 }] }
    ]
  },
  { 
    id: '2', 
    name: 'برگر کلاسیک', 
    category: 'برگر',
    price: 185000, 
    description: 'گوشت گوساله ۱۰۰٪ خالص، کاهو، گوجه، خیارشور و سس مخصوص',
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=1000&auto=format&fit=crop',
    rawMaterials: ['گوشت گوساله ۱۵۰ گرم', 'نان بریوش', 'کاهو فرانسوی', 'گوجه فرنگی', 'سس مخصوص'],
    estimatedTime: '۱۵ دقیقه',
    rating: 4.5,
    reviews: [
      { id: 'r3', user: 'علی', comment: 'خیلی آبدار و عالی بود', rating: 5, date: 'دیروز' }
    ],
    modifiers: [
      { id: 'm3', name: 'پخت', type: 'mandatory', options: [{ id: 'o5', name: 'مدیوم', price: 0 }, { id: 'o6', name: 'ول‌دان', price: 0 }] },
      { id: 'm4', name: 'پنیر اضافه', type: 'optional', options: [{ id: 'o7', name: 'خیر', price: 0 }, { id: 'o8', name: 'بله', price: 25000 }] }
    ]
  },
  { 
    id: '3', 
    name: 'سالاد سزار', 
    category: 'سالاد',
    price: 120000, 
    description: 'کاهو رسمی، فیله مرغ گریل، نان سیر، پنیر پارمزان و سس سزار',
    image: 'https://images.unsplash.com/photo-1550304999-8f69611339bf?q=80&w=1000&auto=format&fit=crop',
    rawMaterials: ['کاهو', 'مرغ گریل', 'نان کروتان', 'پنیر پارمزان', 'سس سزار مخصوص'],
    estimatedTime: '۱۰ دقیقه',
    rating: 4.6,
    reviews: [
      { id: 'r4', user: 'نیلوفر', comment: 'سس سزارش عالی بود', rating: 5, date: '۳ روز پیش' }
    ],
    modifiers: [
      { id: 'm5', name: 'سس سزار اضافه', type: 'optional', options: [{ id: 'o9', name: 'خیر', price: 0 }, { id: 'o10', name: 'بله', price: 15000 }] }
    ]
  }
];

const HeroSection: React.FC<{ element: ComponentItem, brandColor: string }> = ({ element, brandColor }) => {
  const { style, imageUrl, title, subtitle, color, fontSize } = element.settings;
  const [isExpanded, setIsExpanded] = useState(false);

  if (style === 'overlay') {
    return (
      <div 
        className="relative overflow-hidden aspect-[16/11] rounded-2xl mx-4 my-2 border border-slate-100 shadow-sm bg-white"
        style={{ width: 'calc(100% - 2rem)' }}
      >
        <div className="absolute inset-0">
          <img referrerPolicy="no-referrer" src={imageUrl} alt="Hero" className="w-full h-full object-cover" />
          <div className="absolute bottom-0 left-0 right-0 h-3/4 bg-gradient-to-t from-black/90 via-black/45 to-transparent" />
        </div>
        <div className="absolute bottom-0 left-0 right-0 p-6 z-10 text-right">
          <h1 style={{ color: color || 'white', fontSize: fontSize || 24 }} className="font-black leading-tight mb-2 text-white drop-shadow-md">{title}</h1>
          {subtitle && <p className="text-white/90 text-xs font-bold leading-relaxed drop-shadow-sm">{subtitle}</p>}
        </div>
      </div>
    );
  }

  if (style === 'stack') {
    return (
      <div 
        className="bg-white flex flex-col rounded-2xl mx-4 my-2 border border-slate-100 shadow-sm overflow-hidden"
        style={{ width: 'calc(100% - 2rem)' }}
      >
        <div className="aspect-[16/10] w-full relative overflow-hidden">
          <img referrerPolicy="no-referrer" src={imageUrl} alt="Hero" className="w-full h-full object-cover" />
        </div>
        <div className="p-5 text-center">
          <h1 style={{ color: color || '#0f172a', fontSize: fontSize || 20 }} className="font-black mb-2 leading-snug">{title}</h1>
          {subtitle && <p className="text-slate-500 text-xs font-bold leading-relaxed">{subtitle}</p>}
        </div>
      </div>
    );
  }

  if (style === 'split') {
    return (
      <div 
        className="bg-white aspect-[16/10] relative rounded-2xl mx-4 my-2 border border-slate-100 shadow-sm overflow-hidden"
        style={{ width: 'calc(100% - 2rem)' }}
      >
        <div className="w-full h-full relative">
          <motion.div
            layout
            onClick={() => setIsExpanded(!isExpanded)}
            className="absolute top-0 bottom-0 left-0 bg-cover bg-center cursor-pointer z-10 transition-all duration-500 ease-out"
            style={{ 
              backgroundImage: `url(${imageUrl})`,
              width: isExpanded ? '100%' : '50%'
            }}
          >
             <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: isExpanded ? 1 : 0 }}
                className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-transparent"
             />
          </motion.div>

          <div className={`absolute top-0 bottom-0 right-0 w-1/2 flex flex-col items-start justify-center p-5 text-right transition-opacity duration-300 ${isExpanded ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
             <h1 style={{ color: color || '#0f172a', fontSize: fontSize || 18 }} className="font-black mb-2 leading-tight">{title}</h1>
             {subtitle && <p className="text-slate-400 text-[10px] font-bold leading-relaxed">{subtitle}</p>}
             <button onClick={() => setIsExpanded(true)} className={`mt-3 px-3 py-1.5 bg-${brandColor}-50 text-${brandColor}-600 rounded-lg text-[9px] font-bold`}>سفارش دهید</button>
          </div>

          <AnimatePresence>
            {isExpanded && (
               <motion.div 
                 initial={{ opacity: 0, y: 15 }}
                 animate={{ opacity: 1, y: 0 }}
                 exit={{ opacity: 0, y: 15 }}
                 transition={{ delay: 0.1 }}
                 className="absolute bottom-0 left-0 right-0 p-5 z-20 text-right text-white pointer-events-none"
               >
                  <h1 style={{ color: color || 'white', fontSize: (fontSize || 18) + 2 }} className="font-black leading-tight mb-1 drop-shadow-md">{title}</h1>
                  {subtitle && <p className="text-white/90 text-[10px] font-medium drop-shadow-sm leading-relaxed">{subtitle}</p>}
               </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    );
  }

  // Modern Mobile Hero (Overlap Style) as fallback
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="relative w-full mb-6">
       <div className={`w-full h-[45vh] relative z-0 transition-all duration-700 ${isOpen ? 'blur-sm scale-[1.02]' : 'blur-0 scale-100'}`}>
          <img referrerPolicy="no-referrer" src={imageUrl} alt="Hero" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-60" />
       </div>
       
       <AnimatePresence>
         {isOpen && (
           <>
             <motion.div 
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               exit={{ opacity: 0 }}
               transition={{ duration: 0.5 }}
               className="fixed inset-0 bg-slate-900/40 backdrop-blur-md z-40 pointer-events-auto cursor-default"
               onClick={() => setIsOpen(false)}
             />
             
             <motion.div 
               initial={{ y: 30, opacity: 0 }}
               animate={{ y: 0, opacity: 1 }}
               exit={{ y: 60, opacity: 0, scale: 0.95 }}
               transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
               className="relative z-50 -mt-16 px-4"
             >
                <div className="bg-white rounded-[2rem] p-8 text-center shadow-2xl border border-slate-100/80">
                   <h1 style={{ color: color || '#0f172a', fontSize: fontSize || 28 }} className="font-black mb-3 leading-tight">{title}</h1>
                   {subtitle && <p className="text-slate-500 text-sm mb-6 font-medium leading-relaxed">{subtitle}</p>}
                   <button 
                     onClick={() => setIsOpen(false)}
                     className="bg-black text-white px-8 py-4 rounded-2xl font-black text-sm w-full shadow-lg shadow-black/20 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer animate-pulse"
                   >
                      شروع سفارش
                   </button>
                </div>
             </motion.div>
           </>
         )}
       </AnimatePresence>
    </div>
  );
};

const ProductGridSection = ({ element, onProductClick, brandColor }: any) => {
  const [isCollapsed, setIsCollapsed] = useState(true);

  return (
    <div className="px-4 py-4 mb-3 bg-white rounded-2xl mx-4 my-2 border border-slate-100 shadow-sm">
      <div 
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="flex items-center justify-between cursor-pointer select-none pb-2 border-b border-dashed border-slate-100"
      >
        <div className="flex flex-col text-right">
          <h3 className="font-black text-slate-800" style={{ fontSize: element.settings.fontSize || 18 }}>
            {element.settings.title}
          </h3>
          {element.settings.subtitle && <span className="text-[10px] text-slate-400 font-bold mt-0.5">{element.settings.subtitle}</span>}
        </div>
        
        {/* Transforming Arrow on the Left */}
        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-slate-50 border border-slate-100 hover:bg-slate-100 transition-colors">
          <ChevronDown 
            className={`w-4 h-4 text-slate-500 transition-transform duration-300 ease-out ${!isCollapsed ? 'rotate-180' : 'rotate-0'}`} 
          />
        </div>
      </div>

      <AnimatePresence initial={false}>
        {!isCollapsed && (
          <motion.div 
            initial={{ height: 0, opacity: 0, marginTop: 0 }}
            animate={{ height: 'auto', opacity: 1, marginTop: 16 }}
            exit={{ height: 0, opacity: 0, marginTop: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <div className="grid grid-cols-2 gap-3.5">
              {MOCK_PRODUCTS.map(product => (
                <motion.div 
                  key={product.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  onClick={() => onProductClick(product)}
                  className="bg-slate-50 rounded-[1.5rem] overflow-hidden border border-slate-100/80 shadow-sm active:scale-95 transition-transform group cursor-pointer"
                >
                  <div className="aspect-square bg-slate-100 relative overflow-hidden">
                    <img referrerPolicy="no-referrer" src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                  </div>
                  <div className="p-3">
                    <h4 className="text-xs font-black text-slate-800 mb-1 line-clamp-1">{product.name}</h4>
                    <p className="text-[9px] text-slate-400 mb-2 font-bold">{product.category}</p>
                    <div className="flex items-center justify-between mt-1">
                       <span className="text-xs font-black text-slate-900">{product.price.toLocaleString()}</span>
                       <span className={`w-7 h-7 bg-${brandColor}-50 text-${brandColor}-600 rounded-lg flex items-center justify-center text-xs font-bold hover:bg-${brandColor}-100`}>
                          <Plus className="w-3.5 h-3.5" />
                       </span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const ProductListSection = ({ element, onProductClick, brandColor }: any) => {
  const [isCollapsed, setIsCollapsed] = useState(true);

  return (
    <div className="px-4 py-4 mb-3 bg-white rounded-2xl mx-4 my-2 border border-slate-100 shadow-sm">
      <div 
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="flex items-center justify-between cursor-pointer select-none pb-2 border-b border-dashed border-slate-100"
      >
        <div className="flex flex-col text-right">
          <h3 className="font-black text-slate-800" style={{ fontSize: element.settings.fontSize || 18 }}>
            {element.settings.title}
          </h3>
          {element.settings.subtitle && <span className="text-[10px] text-slate-400 font-bold mt-0.5">{element.settings.subtitle}</span>}
        </div>
        
        {/* Transforming Arrow on the Left */}
        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-slate-50 border border-slate-100 hover:bg-slate-100 transition-colors">
          <ChevronDown 
            className={`w-4 h-4 text-slate-500 transition-transform duration-300 ease-out ${!isCollapsed ? 'rotate-180' : 'rotate-0'}`} 
          />
        </div>
      </div>

      <AnimatePresence initial={false}>
        {!isCollapsed && (
          <motion.div 
            initial={{ height: 0, opacity: 0, marginTop: 0 }}
            animate={{ height: 'auto', opacity: 1, marginTop: 16 }}
            exit={{ height: 0, opacity: 0, marginTop: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <div className="space-y-3">
              {MOCK_PRODUCTS.map(product => (
                <motion.div 
                  key={product.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  onClick={() => onProductClick(product)}
                  className="flex gap-4 bg-slate-50 p-3 rounded-[1.25rem] border border-slate-100 shadow-sm active:scale-95 transition-transform cursor-pointer hover:bg-slate-100/50"
                >
                  <div className="w-20 h-20 bg-slate-100 rounded-xl overflow-hidden shrink-0">
                     <img referrerPolicy="no-referrer" src={product.image} alt={product.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 flex flex-col justify-center py-0.5 min-w-0 text-right">
                     <h4 className="text-xs font-black text-slate-800 mb-0.5">{product.name}</h4>
                     <p className="text-[9px] text-slate-400 line-clamp-1 mb-2 font-bold leading-relaxed">{product.description}</p>
                     
                     <div className="flex justify-between items-center mt-1">
                        <span className="text-xs font-black text-slate-900">{product.price.toLocaleString()} <span className="text-[9px] font-normal text-slate-400">تومان</span></span>
                        <div className={`px-2.5 py-1 rounded-lg bg-${brandColor}-50 text-${brandColor}-600 text-[10px] font-bold border border-${brandColor}-100 hover:bg-${brandColor}-100/80`}>
                           افزودن
                        </div>
                     </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const FeaturedSection = ({ element, onProductClick, brandColor }: any) => {
  const featuredProduct = { ...MOCK_PRODUCTS[1], name: element.settings.title || MOCK_PRODUCTS[1].name, image: element.settings.imageUrl || MOCK_PRODUCTS[1].image };
  
  // Dark Card Style from Screenshot
  return (
    <div className="px-4 py-6 mb-2">
      <div className="flex items-center justify-between mb-4 px-2">
        <h3 className="font-black text-slate-800 text-lg">{element.settings.title || 'پیشنهادات ویژه'}</h3>
        <span className="text-xs text-slate-400">انتخاب‌های محبوب مشتریان ما</span>
      </div>

      <motion.div 
         whileTap={{ scale: 0.98 }}
         onClick={() => onProductClick(featuredProduct)}
         className="relative h-64 w-full rounded-[2rem] overflow-hidden bg-[#1a1a1a] shadow-xl text-white flex flex-col justify-end"
      >
        <img src={featuredProduct.image} alt="Featured" className="absolute top-0 left-0 w-full h-full object-cover opacity-60 mix-blend-overlay" />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
        
        <div className="relative z-10 p-6 flex items-end justify-between">
           <div>
              <div className="bg-emerald-500/20 text-emerald-400 px-3 py-1 rounded-full text-[10px] font-bold backdrop-blur-md border border-emerald-500/20 inline-flex items-center gap-1 mb-2">
                 <Star className="w-3 h-3 fill-current" />
                 پیشنهاد سرآشپز
              </div>
              <h3 className="text-2xl font-black mb-1">{featuredProduct.name}</h3>
              <p className="text-white/60 text-xs line-clamp-1 max-w-[200px]">{element.settings.subtitle || featuredProduct.description}</p>
           </div>

           <button 
             className={`px-4 py-3 bg-${brandColor}-600 hover:bg-${brandColor}-500 text-white rounded-xl font-bold text-xs flex items-center gap-2 shadow-lg shadow-${brandColor}-900/50`}
           >
             تکمیل سفارش <ChevronLeft className="w-4 h-4" />
           </button>
        </div>
        
        {/* Price Tag Floating */}
        <div className="absolute top-6 right-6 z-10 text-left">
           <span className="text-[10px] text-white/60 block">قیمت ویژه</span>
           <span className="text-xl font-black text-white">{featuredProduct.price.toLocaleString()}</span>
        </div>
      </motion.div>
    </div>
  );
};

// --- MODALS & CART ---

const ProductDetailModal = ({ product: incomingProduct, isOpen, onClose, onAddToCart, brandColor }: any) => {
  const [qty, setQty] = useState(1);
  const [localProduct, setLocalProduct] = useState<any>(null);
  const [selectedModifiers, setSelectedModifiers] = useState<Record<string, string>>({});

  useEffect(() => {
    if (incomingProduct) {
      setLocalProduct(incomingProduct);
      setQty(1);
      
      // Initialize selected modifiers with the first option of each group
      const initial: Record<string, string> = {};
      if (incomingProduct.modifiers) {
        incomingProduct.modifiers.forEach((group: any) => {
          if (group.options && group.options.length > 0) {
            initial[group.id] = group.options[0].id;
          }
        });
      }
      setSelectedModifiers(initial);
    }
  }, [incomingProduct]);

  const product = incomingProduct || localProduct;

  if (!product) return null;

  // Calculate extra cost based on selected modifiers
  const extraCost = (product.modifiers || []).reduce((sum: number, group: any) => {
    const selectedOptionId = selectedModifiers[group.id];
    if (selectedOptionId) {
      const option = group.options.find((opt: any) => opt.id === selectedOptionId);
      if (option) {
        return sum + option.price;
      }
    }
    return sum;
  }, 0);

  const singlePrice = product.price + extraCost;
  const totalPrice = singlePrice * qty;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-end justify-center"
        >
          <motion.div 
             initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
             onClick={onClose} className="fixed inset-0 bg-black/60 backdrop-blur-md"
          />
          <motion.div 
            initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed bottom-0 left-0 right-0 z-10 bg-white rounded-t-[2.5rem] h-[85vh] overflow-hidden flex flex-col max-w-md mx-auto shadow-[0_-10px_40px_rgba(0,0,0,0.2)]"
          >
            {/* Image Header */}
            <div className="relative h-72 shrink-0">
               <img src={product.image} className="w-full h-full object-cover" alt={product.name} />
               <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-transparent" />
               <button onClick={onClose} className="absolute top-6 right-6 w-10 h-10 bg-white/20 backdrop-blur-md border border-white/20 rounded-full flex items-center justify-center text-white active:scale-95 transition-transform">
                  <X className="w-5 h-5" />
               </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-8 -mt-10 bg-white rounded-t-[2.5rem] relative z-10">
               <div className="w-12 h-1 bg-slate-200 rounded-full mx-auto mb-6" />
               
               <div className="flex justify-between items-start mb-2">
                  <h2 className="text-2xl font-black text-slate-900 leading-tight">{product.name}</h2>
                  <div className="flex items-center gap-1.5 bg-yellow-50 px-2.5 py-1.5 rounded-xl border border-yellow-100 shrink-0">
                     <Star className="w-4 h-4 text-yellow-500 fill-current" />
                     <span className="text-sm font-bold text-yellow-700 pt-0.5">{product.rating || '4.5'}</span>
                  </div>
               </div>
               
               <div className="flex items-baseline gap-1 mb-4">
                  <span className="text-2xl font-black text-slate-950">{product.price.toLocaleString()}</span>
                  <span className="text-xs font-normal text-slate-400">تومان</span>
               </div>
               
               <div className="flex items-center gap-4 text-xs text-slate-500 font-medium mb-6">
                  <div className="flex items-center gap-1.5">
                     <Clock className="w-4 h-4 text-slate-400" />
                     {product.estimatedTime || '۱۵ دقیقه'}
                  </div>
                  <div className="w-1 h-1 bg-slate-300 rounded-full" />
                  <span>{product.category}</span>
               </div>

               <p className="text-sm text-slate-600 leading-7 mb-8 font-medium">{product.description}</p>

               <div className="space-y-6">
                  {/* Dynamic Options */}
                  {product.modifiers && product.modifiers.length > 0 ? (
                    product.modifiers.map((group: any) => (
                      <div key={group.id} className="space-y-3">
                         <div className="flex items-center justify-between">
                            <h3 className="text-sm font-black text-slate-900">{group.name}</h3>
                            {group.type === 'mandatory' ? (
                               <span className={`text-[10px] bg-${brandColor}-50 text-${brandColor}-600 px-2.5 py-1 rounded-md font-bold`}>اجباری</span>
                            ) : (
                               <span className="text-[10px] bg-slate-100 text-slate-500 px-2.5 py-1 rounded-md font-bold">اختیاری</span>
                            )}
                         </div>
                         <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
                            {group.options.map((opt: any) => {
                               const isSelected = selectedModifiers[group.id] === opt.id;
                               return (
                                  <button 
                                     key={opt.id} 
                                     type="button"
                                     onClick={() => setSelectedModifiers(prev => ({ ...prev, [group.id]: opt.id }))}
                                     className={`px-5 py-3 rounded-2xl border text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                                        isSelected 
                                           ? `bg-${brandColor}-50 border-${brandColor}-500 text-${brandColor}-700 shadow-sm ring-2 ring-${brandColor}-500/10 scale-[1.02]` 
                                           : 'border-slate-200 text-slate-600 bg-white hover:bg-slate-50'
                                     }`}
                                  >
                                     {opt.name} {opt.price > 0 ? `(+${opt.price.toLocaleString()})` : ''}
                                  </button>
                               );
                            })}
                         </div>
                      </div>
                    ))
                  ) : (
                    /* Fallback Mock bread selection if the list is empty (matching user screenshot) */
                    <div className="space-y-4">
                       <h3 className="text-sm font-black text-slate-900">انتخاب نان</h3>
                       <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
                          {['نان سفید', 'نان جو (+۱۵,۰۰۰)', 'نان سیر'].map((opt, i) => {
                             const optId = `mock-${i}`;
                             const isSelected = selectedModifiers['mock-bread'] === optId || (!selectedModifiers['mock-bread'] && i === 0);
                             return (
                                <button 
                                   key={i} 
                                   type="button"
                                   onClick={() => {
                                      setSelectedModifiers(prev => ({ ...prev, 'mock-bread': optId }));
                                   }}
                                   className={`px-5 py-3 rounded-2xl border text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                                      isSelected 
                                         ? `bg-${brandColor}-50 border-${brandColor}-500 text-${brandColor}-700 shadow-sm ring-2 ring-${brandColor}-500/10 scale-[1.02]` 
                                         : 'border-slate-200 text-slate-500 bg-white hover:bg-slate-50'
                                   }`}
                                >
                                   {opt}
                                </button>
                             );
                          })}
                       </div>
                    </div>
                  )}
               </div>
            </div>

            {/* Action Bar */}
            <div className="p-4 border-t border-slate-100 bg-white safe-area-bottom shadow-[0_-5px_20px_rgba(0,0,0,0.03)]">
               <div className="flex items-center justify-between gap-4 mb-4">
                  <div className="flex items-center gap-3 bg-slate-50 px-3 py-2 rounded-xl border border-slate-100">
                     <button onClick={() => setQty(Math.max(1, qty - 1))} className="p-1 hover:bg-white rounded-lg transition-colors"><Minus className="w-3.5 h-3.5 text-slate-500" /></button>
                     <span className="font-bold w-5 text-center text-sm">{qty}</span>
                     <button onClick={() => setQty(qty + 1)} className="p-1 hover:bg-white rounded-lg transition-colors"><Plus className="w-3.5 h-3.5 text-slate-500" /></button>
                  </div>
                  <div className="flex-1 text-left">
                     <span className="text-[10px] text-slate-400 block font-bold mb-0.5">مبلغ کل</span>
                     <span className="text-lg font-black text-slate-950">{( (singlePrice + (!product.modifiers || product.modifiers.length === 0 ? (selectedModifiers['mock-bread'] === 'mock-1' ? 15000 : 0) : 0)) * qty).toLocaleString()} <span className="text-xs font-normal text-slate-400">تومان</span></span>
                  </div>
               </div>
               <button 
                  onClick={() => { 
                     let finalSinglePrice = singlePrice;
                     if (!product.modifiers || product.modifiers.length === 0) {
                        const isMockBarley = selectedModifiers['mock-bread'] === 'mock-1';
                        finalSinglePrice += isMockBarley ? 15000 : 0;
                     }
                     onAddToCart(product, qty, selectedModifiers, finalSinglePrice); 
                     onClose(); 
                  }}
                  className={`w-full py-2.5 bg-${brandColor}-600 text-white rounded-xl font-bold text-xs shadow-md shadow-${brandColor}-500/10 flex items-center justify-center gap-2 active:scale-[0.98] transition-all hover:bg-${brandColor}-500`}
               >
                  <ShoppingBag className="w-4 h-4" />
                  افزودن به سبد خرید
               </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

const CheckoutModal = ({ isOpen, onClose, cart, updateCartQty, cartTotal, brandColor, onOrderPlaced }: any) => {
  const [tableNumber, setTableNumber] = useState('۵');
  const [customerName, setCustomerName] = useState('');
  const [notes, setNotes] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [placedOrderId, setPlacedOrderId] = useState('');
  const [finalTotal, setFinalTotal] = useState(0);

  useEffect(() => {
    if (isOpen) {
      setIsSuccess(false);
    }
  }, [isOpen]);

  const handleSubmit = () => {
    if (!tableNumber) return;

    const orderId = `#${Math.floor(10000 + Math.random() * 90000)}`;
    const tableNum = parseInt(tableNumber) || 5;

    const newOrder = {
      id: orderId,
      tableNumber: tableNum,
      customerName: customerName.trim() || `مشتری میز ${tableNum}`,
      items: cart.map((item: any) => {
        const modNames: string[] = [];
        if (item.selectedModifiers) {
          Object.entries(item.selectedModifiers).forEach(([groupId, optId]: any) => {
            if (groupId === 'mock-bread') {
              const optIdx = parseInt(optId.split('-')[1]);
              const names = ['نان سفید', 'نان جو', 'نان سیر'];
              if (names[optIdx]) modNames.push(names[optIdx]);
            } else if (item.product.modifiers) {
              const group = item.product.modifiers.find((g: any) => g.id === groupId);
              const opt = group?.options.find((o: any) => o.id === optId);
              if (opt) modNames.push(opt.name);
            }
          });
        }
        const modifierText = modNames.length > 0 ? ` (${modNames.join('، ')})` : '';
        return `${item.product.name}${modifierText} x${item.qty}`;
      }),
      notes: notes.trim() || undefined,
      totalPrice: cartTotal,
      status: 'new' as const,
      timestamp: 'هم‌اکنون'
    };

    const saved = localStorage.getItem('vitrin_orders');
    const existingOrders = saved ? JSON.parse(saved) : [];
    localStorage.setItem('vitrin_orders', JSON.stringify([newOrder, ...existingOrders]));

    setPlacedOrderId(orderId);
    setFinalTotal(cartTotal);
    setIsSuccess(true);
    onOrderPlaced();
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
          className="fixed bottom-0 left-0 right-0 z-50 bg-white rounded-t-[2.5rem] h-[85vh] overflow-hidden flex flex-col max-w-md mx-auto shadow-[0_-10px_40px_rgba(0,0,0,0.2)]"
        >
          {isSuccess ? (
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center bg-white font-['Vazirmatn']">
              <motion.div 
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: 'spring', damping: 15 }}
                className={`w-20 h-20 bg-${brandColor}-50 border border-${brandColor}-200 text-${brandColor}-600 rounded-full flex items-center justify-center mb-6`}
              >
                <Check className="w-10 h-10 stroke-[3]" />
              </motion.div>
              <h2 className="text-2xl font-black text-slate-900 mb-2">سفارش شما ثبت شد!</h2>
              <p className="text-sm text-slate-500 mb-6 font-medium">سفارش {placedOrderId} با موفقیت دریافت گردید و در حال آماده‌سازی است.</p>
              
              <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 w-full mb-8">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs text-slate-400 font-bold">شماره میز</span>
                  <span className="text-sm font-black text-slate-800">میز {tableNumber}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-slate-400 font-bold">مجموع پرداختی</span>
                  <span className="text-sm font-black text-slate-800">{finalTotal.toLocaleString()} تومان</span>
                </div>
              </div>

              <button 
                onClick={() => {
                  setIsSuccess(false);
                  setCustomerName('');
                  setNotes('');
                  onClose();
                }}
                className={`w-full py-4 bg-${brandColor}-600 hover:bg-${brandColor}-700 text-white rounded-2xl font-black text-sm shadow-lg shadow-${brandColor}-500/20 transition-all cursor-pointer`}
              >
                بازگشت به منو
              </button>
            </div>
          ) : (
            <div className="flex-1 flex flex-col overflow-hidden">
              {/* Header */}
              <div className="p-6 border-b border-slate-100 flex items-center justify-between shrink-0 bg-white">
                <h2 className="text-lg font-black text-slate-900">جزئیات سبد خرید و پرداخت</h2>
                <button onClick={onClose} className="p-1.5 bg-slate-100 rounded-full text-slate-500 hover:bg-slate-200 transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Scrollable Items list & Form */}
              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                
                {/* Cart Items list */}
                <div className="space-y-3">
                  <h3 className="text-xs font-bold text-slate-400">آیتم‌های سفارش داده شده</h3>
                  {cart.map((item: any, idx: number) => {
                    const modNames: string[] = [];
                    if (item.selectedModifiers) {
                      Object.entries(item.selectedModifiers).forEach(([groupId, optId]: any) => {
                        if (groupId === 'mock-bread') {
                          const optIdx = parseInt(optId.split('-')[1]);
                          const names = ['نان سفید', 'نان جو', 'نان سیر'];
                          if (names[optIdx]) modNames.push(names[optIdx]);
                        } else if (item.product.modifiers) {
                          const group = item.product.modifiers.find((g: any) => g.id === groupId);
                          const opt = group?.options.find((o: any) => o.id === optId);
                          if (opt) modNames.push(opt.name);
                        }
                      });
                    }
                    const singlePrice = item.singlePrice || item.product.price;

                    return (
                      <div key={idx} className="flex gap-4 p-3 bg-slate-50 rounded-2xl border border-slate-100">
                        <img src={item.product.image} className="w-16 h-16 object-cover rounded-xl shrink-0" alt="" />
                        <div className="flex-1 flex flex-col justify-center min-w-0">
                          <h4 className="text-xs font-black text-slate-800 line-clamp-1">{item.product.name}</h4>
                          {modNames.length > 0 && (
                            <span className="text-[10px] text-slate-400 mt-0.5 font-bold line-clamp-1">{modNames.join('، ')}</span>
                          )}
                          <span className="text-xs font-black text-slate-900 mt-1">{(singlePrice * item.qty).toLocaleString()} تومان</span>
                        </div>
                        <div className="flex items-center gap-2 bg-white px-2.5 py-1.5 rounded-xl border border-slate-100 self-center">
                          <button onClick={() => updateCartQty(item.product, item.selectedModifiers, item.qty - 1)} className="p-0.5 hover:bg-slate-50 rounded"><Minus className="w-3 h-3 text-slate-500" /></button>
                          <span className="font-bold text-xs w-4 text-center">{item.qty}</span>
                          <button onClick={() => updateCartQty(item.product, item.selectedModifiers, item.qty + 1)} className="p-0.5 hover:bg-slate-50 rounded"><Plus className="w-3 h-3 text-slate-500" /></button>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="border-t border-slate-100 my-4" />

                {/* Form fields */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-400 mb-2">انتخاب شماره میز</label>
                    <div className="grid grid-cols-5 gap-2 font-['Vazirmatn']">
                      {['۱', '۲', '۵', '۸', '۱۲'].map((num) => (
                        <button 
                          key={num} 
                          type="button"
                          onClick={() => setTableNumber(num)}
                          className={`py-2 rounded-xl border text-xs font-bold transition-all cursor-pointer ${tableNumber === num ? `bg-${brandColor}-50 border-${brandColor}-500 text-${brandColor}-700 shadow-sm ring-2 ring-${brandColor}-500/10` : 'border-slate-200 text-slate-500 bg-white hover:bg-slate-50'}`}
                        >
                          میز {num}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-400 mb-2">نام شما (اختیاری)</label>
                    <input 
                      type="text" 
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      placeholder="مثال: علی محمدی"
                      className={`w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs outline-none focus:border-${brandColor}-500 transition-colors font-medium`}
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-400 mb-2">توضیحات سفارش (اختیاری)</label>
                    <textarea 
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="مثال: سس اضافه آورده شود، نوشابه بدون یخ باشد..."
                      rows={3}
                      className={`w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs outline-none focus:border-${brandColor}-500 transition-colors font-medium resize-none`}
                    />
                  </div>
                </div>

              </div>

              {/* Action Bar */}
              <div className="p-4 border-t border-slate-100 bg-white safe-area-bottom shadow-[0_-5px_20px_rgba(0,0,0,0.03)]">
                <div className="flex justify-between items-center mb-4 px-2">
                  <span className="text-xs text-slate-400 font-bold">مجموع فاکتور</span>
                  <span className="text-lg font-black text-slate-950">{cartTotal.toLocaleString()} <span className="text-xs font-normal text-slate-400">تومان</span></span>
                </div>
                <button 
                  onClick={handleSubmit}
                  className={`w-full py-3.5 bg-${brandColor}-600 text-white rounded-2xl font-black text-sm shadow-md shadow-${brandColor}-500/10 flex items-center justify-center gap-2 active:scale-[0.98] transition-all hover:bg-${brandColor}-500 cursor-pointer`}
                >
                  <Check className="w-5 h-5 stroke-[2.5]" />
                  تایید نهایی و ارسال سفارش
                </button>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

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
          className="fixed bottom-0 left-0 right-0 z-50 bg-[#F8FAFC] rounded-t-[2.5rem] h-[85vh] overflow-hidden flex flex-col max-w-md mx-auto shadow-[0_-10px_40px_rgba(0,0,0,0.2)]"
        >
          {/* Header */}
          <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-white shrink-0">
            <div className="flex items-center gap-2">
              <div className={`w-8 h-8 rounded-xl bg-${brandColor}-50 flex items-center justify-center text-${brandColor}-600`}>
                <User className="w-4 h-4" />
              </div>
              <h2 className="text-lg font-black text-slate-900">پروفایل و سفارش‌های من</h2>
            </div>
            <button onClick={onClose} className="p-1.5 bg-slate-100 rounded-full text-slate-500 hover:bg-slate-200 transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Scrollable Container */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6 text-right">
            
            {/* User Details Form */}
            <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm space-y-4">
              <h3 className="text-xs font-black text-slate-800 border-r-2 border-slate-900 pr-2 leading-none">اطلاعات کاربری</h3>
              
              <div className="space-y-3 pt-1">
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 mb-1.5 text-right">نام و نام خانوادگی</label>
                  <input 
                    type="text" 
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="مثال: علی محمدی"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs outline-none focus:border-slate-400 transition-colors font-medium text-slate-800 text-right"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-400 mb-1.5 text-right">شماره موبایل (اختیاری)</label>
                  <input 
                    type="tel" 
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="مثال: ۰۹۱۲۳۴۵۶۷۸۹"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs outline-none focus:border-slate-400 transition-colors font-medium text-slate-800 text-left"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-400 mb-1.5 text-right">میز پیش‌فرض</label>
                  <div className="grid grid-cols-5 gap-2 font-['Vazirmatn']">
                    {['۱', '۲', '۵', '۸', '۱۲'].map((num) => (
                      <button 
                        key={num} 
                        type="button"
                        onClick={() => setTable(num)}
                        className={`py-2 rounded-xl border text-xs font-bold transition-all cursor-pointer ${table === num ? `bg-${brandColor}-50 border-${brandColor}-500 text-${brandColor}-700 shadow-sm ring-2 ring-${brandColor}-500/10` : 'border-slate-200 text-slate-500 bg-white hover:bg-slate-50'}`}
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
              <h3 className="text-xs font-black text-slate-800 border-r-2 border-slate-900 pr-2 leading-none">تاریخچه سفارش‌ها ({orders.length})</h3>
              
              {orders.length === 0 ? (
                <div className="bg-white p-8 rounded-2xl border border-slate-100 text-center flex flex-col items-center justify-center space-y-3 shadow-sm">
                  <div className="w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center text-slate-300">
                     <ChefHat className="w-6 h-6 stroke-[1.5]" />
                  </div>
                  <p className="text-xs font-bold text-slate-400">هنوز سفارشی برای شما ثبت نشده است</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {orders.map((ord: any) => {
                    const statusStyle = getStatusLabel(ord.status);
                    return (
                      <div key={ord.id} className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-black text-slate-800">{ord.id}</span>
                          <span className={`px-2 py-0.5 rounded-lg border text-[9px] font-black ${statusStyle.bg}`}>
                            {statusStyle.label}
                          </span>
                        </div>
                        
                        <div className="text-[11px] text-slate-500 space-y-1 font-medium text-right">
                          {ord.items && ord.items.map((itemStr: string, idx: number) => (
                            <div key={idx} className="flex items-center justify-start gap-1.5 direction-rtl">
                              <span className={`w-1 h-1 rounded-full bg-${brandColor}-500 shrink-0`} />
                              <span>{itemStr}</span>
                            </div>
                          ))}
                        </div>

                        <div className="border-t border-slate-50 pt-2.5 flex items-center justify-between text-xs font-bold">
                          <span className="text-slate-400">میز {ord.tableNumber} • {ord.timestamp || 'هم‌اکنون'}</span>
                          <span className="text-slate-900 font-black">{ord.totalPrice.toLocaleString()} تومان</span>
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
}

const CustomerMenu: React.FC<CustomerMenuProps> = ({ liveElements }) => {
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

  useEffect(() => {
    const handleSync = () => {
      // 1. Try to get brand color, Name & Logo
      const savedColor = localStorage.getItem('vitrin_brand_color');
      const savedName = localStorage.getItem('vitrin_restaurant_name');
      const savedLogo = localStorage.getItem('vitrin_restaurant_logo');
      if (savedColor) setBrandColor(savedColor);
      if (savedName) setRestaurantName(savedName);
      if (savedLogo) setRestaurantLogo(savedLogo);

      // 2. Load Elements Logic - Prioritize draft design for perfect preview matching
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

  const cartTotal = cart.reduce((acc, item) => acc + ((item.singlePrice || item.product.price) * item.qty), 0);
  const cartCount = cart.reduce((acc, item) => acc + item.qty, 0);

  return (
    <div className="min-h-screen bg-[#F2F4F7] font-['Vazirmatn'] pb-32 max-w-md mx-auto shadow-2xl relative min-w-0 border-x border-slate-200">
      
      {/* Top Navigation - Styled to Match Studio Customizations */}
      <div className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-100 px-5 py-3 flex items-center justify-between shadow-sm min-h-[60px]">
        {isSearchOpen ? (
          <div className="flex-1 flex items-center gap-3">
            <button 
              onClick={() => {
                setIsSearchOpen(false);
                setSearchQuery('');
              }}
              className="w-9 h-9 bg-slate-50 border border-slate-100 rounded-xl flex items-center justify-center cursor-pointer hover:bg-slate-100 transition-colors"
            >
              <ArrowLeft className="w-4 h-4 text-slate-500" />
            </button>
            <div className="flex-1 relative">
              <input 
                type="text"
                autoFocus
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="جستجوی پیتزا، برگر، سالاد و..."
                className={`w-full bg-slate-50 border border-slate-200 rounded-xl px-4 pr-10 py-2 text-xs outline-none focus:border-${brandColor}-500 transition-colors font-medium text-right`}
              />
              <Search className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2" />
              {searchQuery && (
                <button 
                  onClick={() => setSearchQuery('')}
                  className="p-1 bg-slate-200 hover:bg-slate-300 text-slate-500 rounded-full absolute left-2 top-1/2 -translate-y-1/2 transition-colors flex items-center justify-center w-5 h-5"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>
          </div>
        ) : (
          <>
            <button 
              onClick={() => setIsSearchOpen(true)}
              className="w-9 h-9 bg-slate-50 border border-slate-100 rounded-xl flex items-center justify-center cursor-pointer hover:bg-slate-100 transition-colors"
            >
              <Search className="w-4 h-4 text-slate-500" />
            </button>
            
            <div className="flex items-center gap-2">
              {restaurantLogo ? (
                <img src={restaurantLogo} alt="Logo" className="w-8 h-8 rounded-lg object-cover border border-slate-100" />
              ) : (
                <div className={`w-8 h-8 rounded-lg bg-${brandColor}-50 flex items-center justify-center border border-${brandColor}-100`}>
                  <span className={`text-xs font-bold text-${brandColor}-600`}>{restaurantName ? restaurantName[0] : 'ر'}</span>
                </div>
              )}
              <div className="flex flex-col items-start text-right">
                <span className="text-[9px] font-black text-slate-400">بهترین طعم، با بالاترین کیفیت</span>
                <span className={`font-black text-slate-900 text-sm tracking-tight hover:text-${brandColor}-600 transition-colors`}>{restaurantName}</span>
              </div>
            </div>

            <button 
              onClick={() => setIsProfileOpen(true)}
              className="w-9 h-9 bg-slate-50 border border-slate-100 rounded-xl flex items-center justify-center cursor-pointer hover:bg-slate-100 transition-colors"
            >
              <User className="w-4 h-4 text-slate-500" />
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
              const filtered = MOCK_PRODUCTS.filter(product => {
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
                <div className="grid grid-cols-2 gap-3.5">
                  {filtered.map(product => (
                    <motion.div 
                      key={product.id}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      onClick={() => setSelectedProduct(product)}
                      className="bg-white rounded-[1.5rem] overflow-hidden border border-slate-100/80 shadow-sm active:scale-95 transition-transform group cursor-pointer text-right"
                    >
                      <div className="aspect-square bg-slate-50 relative overflow-hidden">
                        <img referrerPolicy="no-referrer" src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                      </div>
                      <div className="p-3">
                        <h4 className="text-xs font-black text-slate-800 mb-1 line-clamp-1">{product.name}</h4>
                        <p className="text-[9px] text-slate-400 mb-2 font-bold">{product.category}</p>
                        <div className="flex items-center justify-between mt-1">
                          <span className="text-xs font-black text-slate-900">{product.price.toLocaleString()} تومان</span>
                          <span className={`w-7 h-7 bg-${brandColor}-50 text-${brandColor}-600 rounded-lg flex items-center justify-center text-xs font-bold hover:bg-${brandColor}-100`}>
                            <Plus className="w-3.5 h-3.5" />
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  ))}
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
          elements.map((el) => {
            switch (el.type) {
              case 'hero':
                return <HeroSection key={el.id} element={el} brandColor={brandColor} />;
              case 'product-grid':
                return <ProductGridSection key={el.id} element={el} onProductClick={setSelectedProduct} brandColor={brandColor} />;
              case 'product-list':
                return <ProductListSection key={el.id} element={el} onProductClick={setSelectedProduct} brandColor={brandColor} />;
              case 'featured':
                return <FeaturedSection key={el.id} element={el} onProductClick={setSelectedProduct} brandColor={brandColor} />;
              default:
                return null;
            }
          })
        )}
      </div>

      {/* Footer Info */}
      <div className="px-8 py-8 text-center border-t border-slate-200 mt-6 bg-white rounded-t-[2.5rem]">
         <div className="flex justify-center gap-6 mb-6">
            <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-500 hover:bg-slate-100 hover:text-slate-800 transition-colors"><Phone className="w-4 h-4" /></div>
            <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-500 hover:bg-slate-100 hover:text-slate-800 transition-colors"><MapPin className="w-4 h-4" /></div>
         </div>
         <p className="text-[10px] font-bold text-slate-300">طراحی و پیاده‌سازی با ❤️ توسط پلتفرم ویترین</p>
      </div>

      {/* Floating Cart */}
      <AnimatePresence>
         {cartCount > 0 && (
            <motion.div 
               initial={{ y: 100 }} animate={{ y: 0 }} exit={{ y: 100 }}
               className="fixed bottom-6 left-6 right-6 z-40 max-w-[calc(28rem-3rem)] mx-auto"
            >
               <div className="bg-white/95 backdrop-blur-md text-slate-800 p-3.5 rounded-2xl shadow-xl flex items-center justify-between border border-slate-100 hover:scale-[1.02] transition-transform">
                  <div className="flex flex-col">
                     <span className="text-[10px] text-slate-400 mb-0.5 font-bold">{cartCount} آیتم در سبد</span>
                     <span className="font-black text-base text-slate-900">{cartTotal.toLocaleString()} <span className="text-[10px] font-normal text-slate-400">تومان</span></span>
                  </div>
                  <button 
                     onClick={() => setIsCheckoutOpen(true)}
                     className={`bg-${brandColor}-600 text-white px-5 py-2.5 rounded-xl font-bold text-xs shadow-md shadow-${brandColor}-500/10 flex items-center gap-1.5 hover:bg-${brandColor}-500 transition-colors cursor-pointer`}
                  >
                     مشاهده و پرداخت <ChevronLeft className="w-3.5 h-3.5" />
                  </button>
               </div>
            </motion.div>
         )}
      </AnimatePresence>

      <ProductDetailModal 
         product={selectedProduct} 
         isOpen={!!selectedProduct} 
         onClose={() => setSelectedProduct(null)} 
         onAddToCart={addToCart}
         brandColor={brandColor}
      />

      <CheckoutModal 
         isOpen={isCheckoutOpen}
         onClose={() => setIsCheckoutOpen(false)}
         cart={cart}
         updateCartQty={updateCartQty}
         cartTotal={cartTotal}
         brandColor={brandColor}
         onOrderPlaced={() => setCart([])}
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
