
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
    rawMaterials: ['کاهو', 'مرغ گریل', 'نان کروتان', 'پنیر پارمزان', 'سس سزار دست‌ساز'],
    estimatedTime: '۱۰ دقیقه',
    rating: 4.9,
    reviews: [],
    modifiers: []
  },
  { 
    id: '4', 
    name: 'پاستا آلفردو', 
    category: 'پاستا',
    price: 190000, 
    description: 'پنه، سس آلفردو خامه ای، قارچ، مرغ و جعفری تازه',
    image: 'https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?q=80&w=1000&auto=format&fit=crop',
    rawMaterials: ['پاستا پنه', 'خامه', 'شیر', 'قارچ', 'سینه مرغ'],
    estimatedTime: '۲۵ دقیقه',
    rating: 4.2,
    reviews: [],
    modifiers: []
  },
];

// --- RENDERERS ---

const HeroSection: React.FC<{ element: ComponentItem }> = ({ element }) => {
  const { style, imageUrl, title, subtitle, color, fontSize } = element.settings;

  // Modern Mobile Hero (Overlap Style) as seen in screenshot
  return (
    <div className="relative w-full mb-6">
       <div className="w-full h-[45vh] relative z-0">
          <img src={imageUrl} alt="Hero" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-60" />
       </div>
       
       <div className="relative z-10 -mt-16 px-4">
          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            className="bg-white rounded-[2rem] p-8 text-center shadow-xl border border-slate-100"
          >
             <h1 style={{ color: color || '#0f172a', fontSize: fontSize || 28 }} className="font-black mb-3 leading-tight">{title}</h1>
             {subtitle && <p className="text-slate-500 text-sm mb-6 font-medium leading-relaxed">{subtitle}</p>}
             <button className="bg-black text-white px-8 py-4 rounded-2xl font-black text-sm w-full shadow-lg shadow-black/20 hover:scale-[1.02] active:scale-[0.98] transition-all">
                شروع سفارش
             </button>
          </motion.div>
       </div>
    </div>
  );
};

const ProductGridSection = ({ element, onProductClick, brandColor }: any) => {
  return (
    <div className="px-4 py-4 mb-2">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-black text-slate-800" style={{ fontSize: element.settings.fontSize || 18 }}>{element.settings.title}</h3>
        {element.settings.subtitle && <span className="text-xs text-slate-400">{element.settings.subtitle}</span>}
      </div>
      <div className="grid grid-cols-2 gap-4">
        {MOCK_PRODUCTS.map(product => (
          <motion.div 
            key={product.id}
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            onClick={() => onProductClick(product)}
            className="bg-white rounded-[1.5rem] overflow-hidden border border-slate-100 shadow-sm active:scale-95 transition-transform group"
          >
            <div className="aspect-square bg-slate-100 relative overflow-hidden">
              <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
            </div>
            <div className="p-4">
              <h4 className="text-sm font-black text-slate-800 mb-1 line-clamp-1">{product.name}</h4>
              <p className="text-[10px] text-slate-400 mb-3">{product.category}</p>
              <div className="flex items-center justify-between">
                 <span className="text-xs font-black text-slate-800">{product.price.toLocaleString()}</span>
                 <button className={`w-8 h-8 bg-${brandColor}-50 text-${brandColor}-600 rounded-xl flex items-center justify-center`}>
                    <Plus className="w-4 h-4" />
                 </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

const ProductListSection = ({ element, onProductClick, brandColor }: any) => {
  return (
    <div className="px-4 py-4 mb-2">
      <div className="flex items-center justify-between mb-6">
        <div>
           <h3 className="font-black text-slate-800" style={{ fontSize: element.settings.fontSize || 18 }}>{element.settings.title}</h3>
           {element.settings.subtitle && <span className="text-xs text-slate-400 mt-1 block">{element.settings.subtitle}</span>}
        </div>
      </div>
      <div className="space-y-4">
        {MOCK_PRODUCTS.map(product => (
          <motion.div 
            key={product.id}
            initial={{ opacity: 0, x: -10 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            onClick={() => onProductClick(product)}
            className="flex gap-4 bg-white p-3 rounded-[1.5rem] border border-slate-100 shadow-sm active:scale-95 transition-transform"
          >
            <div className="w-24 h-24 bg-slate-100 rounded-2xl overflow-hidden shrink-0">
               <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
            </div>
            <div className="flex-1 flex flex-col justify-center py-1">
               <h4 className="text-sm font-black text-slate-800 mb-1">{product.name}</h4>
               <p className="text-[10px] text-slate-400 line-clamp-2 mb-3 leading-relaxed">{product.description}</p>
               
               <div className="flex justify-between items-center">
                  <span className="text-sm font-black text-slate-900">{product.price.toLocaleString()} <span className="text-[10px] font-normal text-slate-400">تومان</span></span>
                  <div className={`px-3 py-1 rounded-lg bg-slate-50 text-slate-600 text-[10px] font-bold border border-slate-100`}>
                     افزودن
                  </div>
               </div>
            </div>
          </motion.div>
        ))}
      </div>
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

const ProductDetailModal = ({ product, isOpen, onClose, onAddToCart, brandColor }: any) => {
  const [qty, setQty] = useState(1);
  
  if (!isOpen || !product) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div 
             initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
             onClick={onClose} className="fixed inset-0 bg-black/60 z-50 backdrop-blur-md"
          />
          <motion.div 
            initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed bottom-0 left-0 right-0 z-[60] bg-white rounded-t-[2.5rem] h-[85vh] overflow-hidden flex flex-col max-w-md mx-auto shadow-[0_-10px_40px_rgba(0,0,0,0.2)]"
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
               
               <div className="flex justify-between items-start mb-4">
                  <h2 className="text-2xl font-black text-slate-900 leading-tight">{product.name}</h2>
                  <div className="flex items-center gap-1.5 bg-yellow-50 px-2.5 py-1.5 rounded-xl border border-yellow-100">
                     <Star className="w-4 h-4 text-yellow-500 fill-current" />
                     <span className="text-sm font-bold text-yellow-700 pt-0.5">{product.rating}</span>
                  </div>
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
                  {/* Mock Options */}
                  <div className="space-y-4">
                     <h3 className="text-sm font-black text-slate-900">انتخاب نان</h3>
                     <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
                        {['نان سفید', 'نان جو (+۱۵,۰۰۰)', 'نان سیر'].map((opt, i) => (
                           <button key={i} className={`px-5 py-3 rounded-2xl border text-xs font-bold whitespace-nowrap transition-all ${i === 0 ? `bg-${brandColor}-50 border-${brandColor}-500 text-${brandColor}-700 shadow-sm ring-2 ring-${brandColor}-500/10` : 'border-slate-200 text-slate-500 bg-white'}`}>
                              {opt}
                           </button>
                        ))}
                     </div>
                  </div>
               </div>
            </div>

            {/* Action Bar */}
            <div className="p-6 border-t border-slate-100 bg-white safe-area-bottom">
               <div className="flex items-center justify-between gap-6 mb-4">
                  <div className="flex items-center gap-4 bg-slate-50 px-4 py-3 rounded-2xl border border-slate-100">
                     <button onClick={() => setQty(Math.max(1, qty - 1))} className="p-1 hover:bg-white rounded-lg transition-colors"><Minus className="w-4 h-4 text-slate-600" /></button>
                     <span className="font-black w-6 text-center text-lg">{qty}</span>
                     <button onClick={() => setQty(qty + 1)} className="p-1 hover:bg-white rounded-lg transition-colors"><Plus className="w-4 h-4 text-slate-600" /></button>
                  </div>
                  <div className="flex-1 text-left">
                     <span className="text-xs text-slate-400 block font-bold mb-0.5">مبلغ کل</span>
                     <span className="text-xl font-black text-slate-900">{(product.price * qty).toLocaleString()} <span className="text-xs font-normal text-slate-400">تومان</span></span>
                  </div>
               </div>
               <button 
                  onClick={() => { onAddToCart(product, qty); onClose(); }}
                  className={`w-full py-4 bg-${brandColor}-600 text-white rounded-2xl font-black text-sm shadow-xl shadow-${brandColor}-500/30 flex items-center justify-center gap-3 active:scale-[0.98] transition-all`}
               >
                  <ShoppingBag className="w-5 h-5" />
                  افزودن به سبد خرید
               </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

// --- MAIN PAGE ---

interface CustomerMenuProps {
  liveElements?: ComponentItem[];
}

const CustomerMenu: React.FC<CustomerMenuProps> = ({ liveElements }) => {
  const [elements, setElements] = useState<ComponentItem[]>([]);
  const [cart, setCart] = useState<{ product: Product, qty: number }[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [brandColor, setBrandColor] = useState('emerald');
  const [restaurantName, setRestaurantName] = useState('رستوران لیمو');

  useEffect(() => {
    // 1. Try to get brand color & Name
    const savedColor = localStorage.getItem('vitrin_brand_color');
    const savedName = localStorage.getItem('vitrin_restaurant_name');
    if (savedColor) setBrandColor(savedColor);
    if (savedName) setRestaurantName(savedName);

    // 2. Load Elements Logic
    if (liveElements && liveElements.length > 0) {
      setElements(liveElements);
    } else {
      // Fallback for standalone mode
      const published = localStorage.getItem('vitrin_published_design');
      const draft = localStorage.getItem('vitrin_designer_draft');
      
      if (published) {
        setElements(JSON.parse(published));
      } else if (draft) {
        setElements(JSON.parse(draft));
      }
    }
  }, [liveElements]);

  const addToCart = (product: Product, qty: number) => {
    setCart(prev => {
      const existing = prev.find(p => p.product.id === product.id);
      if (existing) {
        return prev.map(p => p.product.id === product.id ? { ...p, qty: p.qty + qty } : p);
      }
      return [...prev, { product, qty }];
    });
  };

  const cartTotal = cart.reduce((acc, item) => acc + (item.product.price * item.qty), 0);
  const cartCount = cart.reduce((acc, item) => acc + item.qty, 0);

  return (
    <div className="min-h-screen bg-[#F2F4F7] font-['Vazirmatn'] pb-32 max-w-md mx-auto shadow-2xl relative min-w-0 border-x border-slate-200">
      
      {/* Top Navigation - Matching Screenshot */}
      <div className="sticky top-0 z-30 bg-white border-b border-slate-100 px-6 py-4 flex items-center justify-between shadow-sm">
         <div className="w-10 h-10 bg-[#F2F4F7] rounded-full flex items-center justify-center cursor-pointer hover:bg-slate-200 transition-colors">
            <Search className="w-5 h-5 text-slate-600" />
         </div>
         <div className="flex flex-col items-center">
            <span className="text-[10px] font-bold text-slate-400 mb-0.5">خوش آمدید به</span>
            <span className="font-black text-slate-900 text-lg tracking-tight">{restaurantName}</span>
         </div>
         <div className="w-10 h-10 bg-[#F2F4F7] rounded-full flex items-center justify-center cursor-pointer hover:bg-slate-200 transition-colors">
            <User className="w-5 h-5 text-slate-600" />
         </div>
      </div>

      {/* Dynamic Content Renderer */}
      <div className="flex flex-col">
        {elements.length === 0 ? (
          <div className="p-10 text-center text-slate-400 flex flex-col items-center mt-10">
            <Clock className="w-12 h-12 mb-4 opacity-20" />
            <p className="font-bold text-sm">منوی رستوران در حال آماده‌سازی است...</p>
          </div>
        ) : (
          elements.map((el) => {
            switch (el.type) {
              case 'hero':
                return <HeroSection key={el.id} element={el} />;
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
               <div className="bg-[#1a1a1a] text-white p-4 rounded-2xl shadow-2xl flex items-center justify-between border border-white/10 backdrop-blur-xl">
                  <div className="flex flex-col">
                     <span className="text-[10px] text-white/60 mb-0.5 font-bold">{cartCount} آیتم در سبد</span>
                     <span className="font-black text-lg">{cartTotal.toLocaleString()} <span className="text-xs font-normal text-white/60">تومان</span></span>
                  </div>
                  <button className={`bg-${brandColor}-600 text-white px-6 py-3 rounded-xl font-bold text-xs shadow-lg shadow-${brandColor}-500/30 flex items-center gap-2 hover:bg-${brandColor}-500 transition-colors`}>
                     تکمیل سفارش <ChevronLeft className="w-4 h-4" />
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

    </div>
  );
};

export default CustomerMenu;
