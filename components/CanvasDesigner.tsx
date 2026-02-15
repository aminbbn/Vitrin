
import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Smartphone, 
  Tablet, 
  Plus, 
  Trash2, 
  Settings2, 
  Maximize2, 
  ZoomIn, 
  ZoomOut,
  GripVertical,
  Layers,
  Sparkles,
  ChevronUp,
  Star,
  ShoppingBag,
  ArrowLeft,
  X,
  Minus,
  Check,
  ChevronDown,
  Clock,
  ChefHat,
  Send,
  User
} from 'lucide-react';
import { COMPONENT_LIBRARY } from '../constants';
import { ComponentItem, Product } from '../types';

// --- Enhanced Mock Data ---
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

// --- Types for Local State ---
interface CartItem {
  id: string;
  qty: number;
}

type DeviceType = 'mobile' | 'tablet';

interface CommonRendererProps {
  element: ComponentItem;
  isSelected: boolean;
  onClick: () => void;
  onProductClick: (product: Product) => void;
  cart: CartItem[];
  device: DeviceType;
}

// --- Helper Components ---

const HandleBar = ({ isExpanded, onToggle }: { isExpanded: boolean, onToggle: (e: React.MouseEvent) => void }) => (
  <div 
    onClick={onToggle}
    className="w-full flex items-center justify-center py-2 cursor-pointer hover:bg-slate-50 transition-colors group"
  >
    <div className={`w-12 h-1.5 rounded-full transition-all duration-300 ${isExpanded ? 'bg-slate-300 group-hover:bg-emerald-400' : 'bg-slate-200 group-hover:bg-emerald-300'}`} />
    {isExpanded ? 
      <ChevronUp className="w-4 h-4 text-slate-400 absolute right-4 opacity-0 group-hover:opacity-100 transition-opacity" /> : 
      <ChevronDown className="w-4 h-4 text-slate-400 absolute right-4 opacity-0 group-hover:opacity-100 transition-opacity" />
    }
  </div>
);

// --- Renderers ---

const HeroRenderer: React.FC<Omit<CommonRendererProps, 'onProductClick' | 'cart'> & { device: DeviceType }> = ({ element, isSelected, onClick, device }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const { settings } = element;
  const { style, imageUrl, title, subtitle, color, fontSize } = settings;

  const handleSplitClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsExpanded(!isExpanded);
  };

  const containerClasses = `relative w-full rounded-2xl overflow-hidden cursor-pointer transition-all border-2 ${isSelected ? 'border-emerald-500 ring-4 ring-emerald-500/10' : 'border-transparent hover:border-emerald-200'}`;
  
  // Responsive aspect ratio
  const aspectClass = device === 'mobile' ? 'aspect-square' : 'aspect-[21/9] h-[400px]';

  if (style === 'overlay') {
    return (
      <motion.div layoutId={element.id} onClick={onClick} className={`${containerClasses} ${aspectClass}`}>
        <div className="absolute inset-0">
          <img src={imageUrl} alt="Hero" className="w-full h-full object-cover" />
          <div className="absolute bottom-0 left-0 right-0 h-2/3 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
        </div>
        <div className="absolute bottom-0 left-0 right-0 p-6 z-10">
          <h3 style={{ color: color || 'white', fontSize: fontSize || 24 }} className="font-black leading-tight mb-2 shadow-sm">{title}</h3>
          {subtitle && <p className="text-white/80 text-sm font-medium">{subtitle}</p>}
        </div>
      </motion.div>
    );
  }

  if (style === 'stack') {
    return (
      <motion.div layoutId={element.id} onClick={onClick} className={`${containerClasses} bg-white flex flex-col`}>
        <div className={`${device === 'mobile' ? 'aspect-square' : 'h-[300px]'} w-full relative overflow-hidden`}>
          <img src={imageUrl} alt="Hero" className="w-full h-full object-cover" />
        </div>
        <div className="p-6 text-center">
          <h3 style={{ color: color || '#0f172a', fontSize: fontSize || 20 }} className="font-black mb-2">{title}</h3>
          {subtitle && <p className="text-slate-500 text-sm">{subtitle}</p>}
        </div>
      </motion.div>
    );
  }

  if (style === 'split') {
    return (
      <motion.div 
        layout
        layoutId={element.id} 
        onClick={onClick}
        className={`${containerClasses} bg-white ${device === 'mobile' ? 'aspect-square' : 'h-[400px]'}`}
      >
        <div className="w-full h-full relative">
          <motion.div
            layout
            onClick={handleSplitClick}
            className={`absolute top-0 bottom-0 left-0 bg-cover bg-center cursor-pointer z-10 transition-all duration-500 ease-spring`}
            style={{ 
              backgroundImage: `url(${imageUrl})`,
              width: isExpanded ? '100%' : '50%'
            }}
          >
             <motion.div 
               initial={{ opacity: 0 }}
               animate={{ opacity: isExpanded ? 1 : 0 }}
               className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent"
             />
          </motion.div>

          <div className={`absolute top-0 bottom-0 right-0 w-1/2 flex flex-col items-start justify-center p-6 transition-opacity duration-300 ${isExpanded ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
             <h3 style={{ color: color || '#0f172a', fontSize: fontSize || 22 }} className="font-black mb-2 leading-tight">{title}</h3>
             {subtitle && <p className="text-slate-400 text-xs font-bold">{subtitle}</p>}
             <button className="mt-4 px-4 py-2 bg-emerald-50 text-emerald-600 rounded-lg text-xs font-bold">سفارش دهید</button>
          </div>

          <AnimatePresence>
            {isExpanded && (
               <motion.div
                 initial={{ y: 60, opacity: 0 }}
                 animate={{ y: 0, opacity: 1 }}
                 exit={{ y: 60, opacity: 0 }}
                 transition={{ type: 'spring', damping: 20, stiffness: 300, delay: 0.1 }}
                 className="absolute bottom-0 left-0 right-0 p-8 z-20"
               >
                  <h3 style={{ color: 'white', fontSize: (fontSize || 22) + 4 }} className="font-black mb-2 leading-tight drop-shadow-lg">{title}</h3>
                  {subtitle && <p className="text-white/90 text-sm font-medium drop-shadow-md">{subtitle}</p>}
               </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    );
  }

  return null;
};

const ProductGridRenderer: React.FC<CommonRendererProps> = ({ element, isSelected, onClick, onProductClick, cart, device }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const containerClasses = `relative w-full rounded-2xl overflow-hidden cursor-pointer transition-all border-2 bg-white ${isSelected ? 'border-emerald-500 ring-4 ring-emerald-500/10' : 'border-transparent hover:border-emerald-200'}`;
  
  const gridCols = device === 'mobile' ? 'grid-cols-2' : 'grid-cols-3';

  return (
    <div onClick={onClick} className={containerClasses}>
      <HandleBar isExpanded={!isCollapsed} onToggle={(e) => { e.stopPropagation(); setIsCollapsed(!isCollapsed); }} />
      
      <div className="px-4 pb-4">
        <div className="flex items-center justify-between mb-4 mt-2">
          <h3 className="font-black text-slate-800" style={{ fontSize: element.settings.fontSize }}>{element.settings.title}</h3>
          {element.settings.subtitle && <span className="text-xs text-slate-400">{element.settings.subtitle}</span>}
        </div>
        
        <AnimatePresence>
          {!isCollapsed && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className={`grid ${gridCols} gap-3 overflow-hidden`}
            >
              {MOCK_PRODUCTS.map(product => {
                const inCart = cart.some(item => item.id === product.id);
                return (
                  <div 
                    key={product.id} 
                    onClick={(e) => { e.stopPropagation(); onProductClick(product); }}
                    className={`bg-white rounded-2xl overflow-hidden border-2 transition-all shadow-sm group ${inCart ? 'border-emerald-500 bg-emerald-50/30' : 'border-slate-100'}`}
                  >
                    <div className="h-28 w-full bg-slate-200 relative overflow-hidden">
                      <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                      {inCart && (
                        <div className="absolute top-2 right-2 bg-emerald-500 text-white w-6 h-6 rounded-full flex items-center justify-center shadow-lg">
                          <Check className="w-3.5 h-3.5" />
                        </div>
                      )}
                    </div>
                    <div className="p-3">
                      <h4 className="text-xs font-bold text-slate-800 mb-1 line-clamp-1">{product.name}</h4>
                      <div className="flex flex-col gap-2 mt-2">
                        <span className="text-[11px] font-black text-slate-700">{product.price.toLocaleString()} تومان</span>
                        <button className={`w-full py-1.5 rounded-lg flex items-center justify-center text-[10px] font-bold transition-colors ${inCart ? 'bg-emerald-100 text-emerald-700' : 'bg-emerald-600 text-white hover:bg-emerald-700'}`}>
                          {inCart ? 'افزوده شد' : 'افزودن'}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

const ProductListRenderer: React.FC<CommonRendererProps> = ({ element, isSelected, onClick, onProductClick, cart, device }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const containerClasses = `relative w-full rounded-2xl overflow-hidden cursor-pointer transition-all border-2 bg-white ${isSelected ? 'border-emerald-500 ring-4 ring-emerald-500/10' : 'border-transparent hover:border-emerald-200'}`;
  
  // On Tablet, use a grid for list items to fill space better
  const layoutClass = device === 'mobile' ? 'flex flex-col space-y-3' : 'grid grid-cols-2 gap-4';

  return (
    <div onClick={onClick} className={containerClasses}>
      <HandleBar isExpanded={!isCollapsed} onToggle={(e) => { e.stopPropagation(); setIsCollapsed(!isCollapsed); }} />

      <div className="px-4 pb-4">
        <div className="flex items-center justify-between mb-4 mt-2">
          <h3 className="font-black text-slate-800" style={{ fontSize: element.settings.fontSize }}>{element.settings.title}</h3>
          {element.settings.subtitle && <span className="text-xs text-slate-400">{element.settings.subtitle}</span>}
        </div>
        
        <AnimatePresence>
          {!isCollapsed && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className={`${layoutClass} overflow-hidden`}
            >
              {MOCK_PRODUCTS.map(product => {
                const inCart = cart.some(item => item.id === product.id);
                return (
                  <div 
                    key={product.id} 
                    onClick={(e) => { e.stopPropagation(); onProductClick(product); }}
                    className={`flex gap-3 bg-white border-2 rounded-2xl p-2.5 shadow-sm transition-all ${inCart ? 'border-emerald-500 bg-emerald-50/20' : 'border-slate-100'}`}
                  >
                    <div className="w-20 h-20 bg-slate-100 rounded-xl overflow-hidden shrink-0 relative">
                       <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                       {inCart && (
                        <div className="absolute inset-0 bg-emerald-500/20 flex items-center justify-center">
                          <div className="bg-emerald-500 text-white w-6 h-6 rounded-full flex items-center justify-center shadow-sm">
                             <Check className="w-3.5 h-3.5" />
                          </div>
                        </div>
                       )}
                    </div>
                    <div className="flex-1 flex flex-col justify-between py-0.5">
                      <div>
                        <h4 className="text-xs font-bold text-slate-800 mb-1">{product.name}</h4>
                        <p className="text-[10px] text-slate-400 line-clamp-1">{product.description}</p>
                      </div>
                      <div className="flex items-center justify-between mt-2">
                         <span className="text-xs font-black text-slate-800">{product.price.toLocaleString()}</span>
                         <button className={`px-4 py-1.5 rounded-lg text-[10px] font-bold transition-colors ${inCart ? 'bg-emerald-100 text-emerald-700' : 'bg-emerald-600 text-white'}`}>
                           {inCart ? 'ویرایش' : 'افزودن'}
                         </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

const FeaturedRenderer: React.FC<CommonRendererProps> = ({ element, isSelected, onClick, onProductClick, cart, device }) => {
  const containerClasses = `relative w-full rounded-3xl overflow-hidden cursor-pointer transition-all border-2 bg-white ${isSelected ? 'border-emerald-500 ring-4 ring-emerald-500/10' : 'border-transparent hover:border-emerald-200'}`;
  const featuredProduct = { ...MOCK_PRODUCTS[0], name: element.settings.title || MOCK_PRODUCTS[0].name, image: element.settings.imageUrl || MOCK_PRODUCTS[0].image };
  const inCart = cart.some(item => item.id === featuredProduct.id);
  
  const heightClass = device === 'mobile' ? 'h-72' : 'h-96';

  return (
    <div onClick={onClick} className={containerClasses}>
      <div className={`relative ${heightClass} group`}>
        <img src={element.settings.imageUrl} alt="Featured" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
        
        <div className="absolute top-4 right-4 z-10">
           <div className="bg-orange-500 text-white px-3 py-1 rounded-full text-[10px] font-black flex items-center gap-1 shadow-lg animate-pulse">
             <Star className="w-3 h-3 fill-current" />
             پیشنهاد ویژه سرآشپز
           </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-6 z-10">
           <h3 className="text-2xl font-black text-white mb-2 leading-tight drop-shadow-md">{element.settings.title}</h3>
           <p className="text-white/80 text-sm mb-4 line-clamp-2">{element.settings.subtitle}</p>
           
           <div className="flex items-center justify-between bg-white/10 backdrop-blur-md p-3 rounded-2xl border border-white/10">
              <div className="flex flex-col">
                 <span className="text-[10px] text-white/60">قیمت ویژه</span>
                 <div className="flex items-baseline gap-2">
                    <span className="text-lg font-black text-white">۳۲۰,۰۰۰</span>
                    <span className="text-xs text-white/50 line-through">۴۵۰,۰۰۰</span>
                 </div>
              </div>
              <button 
                onClick={(e) => { e.stopPropagation(); onProductClick(featuredProduct); }}
                className={`px-6 py-2.5 rounded-xl text-xs font-bold transition-all shadow-lg ${inCart ? 'bg-emerald-500 text-white' : 'bg-white text-slate-900 hover:bg-emerald-50'}`}
              >
                {inCart ? 'مشاهده سفارش' : 'سفارش دهید'}
              </button>
           </div>
        </div>
      </div>
    </div>
  );
};

// --- Product Detail Bottom Sheet / Modal ---

const ProductDetailModal = ({ product, isOpen, onClose, onAddToCart, initialQty = 0, device }: any) => {
  const [qty, setQty] = useState(initialQty || 1);
  const [activeTab, setActiveTab] = useState<'details' | 'reviews'>('details');
  const [newComment, setNewComment] = useState('');

  if (!isOpen || !product) return null;
  
  const isMobile = device === 'mobile';

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm z-40"
          />
          <motion.div 
            initial={isMobile ? { y: '100%' } : { opacity: 0, scale: 0.9 }}
            animate={isMobile ? { y: 0 } : { opacity: 1, scale: 1 }}
            exit={isMobile ? { y: '100%' } : { opacity: 0, scale: 0.9 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className={`absolute z-50 bg-white shadow-2xl overflow-hidden flex flex-col ${
              isMobile 
                ? 'bottom-0 left-0 right-0 rounded-t-[2.5rem] h-[90%]' 
                : 'top-[10%] left-[10%] right-[10%] bottom-[10%] rounded-[2rem] max-w-4xl mx-auto'
            }`}
          >
            {/* Header / Image */}
            <div className={`relative shrink-0 ${isMobile ? 'h-64' : 'h-72'}`}>
              <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
              <button onClick={onClose} className="absolute top-4 right-4 w-9 h-9 bg-black/40 backdrop-blur text-white rounded-full flex items-center justify-center hover:bg-black/60 transition-colors z-10">
                <X className="w-5 h-5" />
              </button>
              <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent" />
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto px-6 pb-28 -mt-10 relative z-0">
              <div className="flex items-start justify-between mb-2">
                <h2 className={`font-black text-slate-900 ${isMobile ? 'text-2xl' : 'text-3xl'}`}>{product.name}</h2>
                <span className="text-xl font-black text-emerald-600 bg-emerald-50 px-3 py-1 rounded-xl">{product.price.toLocaleString()}</span>
              </div>
              
              {/* Meta Info */}
              <div className="flex items-center gap-4 mb-6 text-slate-500 text-xs font-bold">
                 <div className="flex items-center gap-1.5 bg-slate-50 px-2.5 py-1.5 rounded-lg">
                    <Clock className="w-3.5 h-3.5 text-orange-500" />
                    {product.estimatedTime || '۱۵ دقیقه'}
                 </div>
                 <div className="flex items-center gap-1.5 bg-slate-50 px-2.5 py-1.5 rounded-lg">
                    <Star className="w-3.5 h-3.5 text-yellow-500 fill-current" />
                    {product.rating || 4.5}
                 </div>
              </div>

              {/* Tabs */}
              <div className="flex border-b border-slate-100 mb-6 sticky top-0 bg-white z-10">
                <button 
                  onClick={() => setActiveTab('details')}
                  className={`flex-1 pb-3 text-sm font-bold transition-colors border-b-2 ${activeTab === 'details' ? 'border-emerald-500 text-emerald-600' : 'border-transparent text-slate-400'}`}
                >
                  جزئیات محصول
                </button>
                <button 
                  onClick={() => setActiveTab('reviews')}
                  className={`flex-1 pb-3 text-sm font-bold transition-colors border-b-2 ${activeTab === 'reviews' ? 'border-emerald-500 text-emerald-600' : 'border-transparent text-slate-400'}`}
                >
                  نظرات کاربران
                </button>
              </div>

              {activeTab === 'details' ? (
                <div className="space-y-6">
                  <p className="text-sm text-slate-600 leading-relaxed">{product.description}</p>
                  
                  {/* Raw Materials */}
                  {product.rawMaterials && (
                    <div className="space-y-3">
                      <h3 className="text-sm font-black text-slate-800 flex items-center gap-2">
                        <ChefHat className="w-4 h-4 text-emerald-600" />
                        مواد اولیه
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {product.rawMaterials.map((item: string, i: number) => (
                           <span key={i} className="px-3 py-1 bg-slate-100 text-slate-600 rounded-full text-[10px] font-bold border border-slate-200">{item}</span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Modifiers */}
                  {product.modifiers && product.modifiers.length > 0 && (
                    <div className="space-y-4 pt-4 border-t border-slate-100">
                      {product.modifiers.map((mod: any, idx: number) => (
                        <div key={idx} className="space-y-3">
                          <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                            <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
                            {mod.name}
                          </h3>
                          <div className="flex flex-wrap gap-2">
                            {mod.options.map((opt: any, oIdx: number) => (
                              <label key={oIdx} className="cursor-pointer">
                                <input type="radio" name={`mod-${idx}`} className="peer sr-only" />
                                <div className="px-4 py-2 rounded-xl border border-slate-200 bg-slate-50 text-xs font-bold text-slate-500 peer-checked:bg-emerald-600 peer-checked:text-white peer-checked:border-emerald-600 transition-all shadow-sm">
                                  {opt.name} {opt.price > 0 && `(+${opt.price/1000})`}
                                </div>
                              </label>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <div className="space-y-6">
                   {/* Comment Input */}
                   <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                      <div className="flex gap-2 mb-2">
                         <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center">
                            <User className="w-4 h-4 text-slate-500" />
                         </div>
                         <div className="flex-1">
                            <textarea 
                               placeholder="نظر خود را بنویسید..." 
                               value={newComment}
                               onChange={(e) => setNewComment(e.target.value)}
                               className="w-full bg-white border border-slate-200 rounded-xl p-3 text-xs outline-none focus:border-emerald-400 min-h-[80px]"
                            />
                         </div>
                      </div>
                      <div className="flex justify-end">
                         <button className="bg-emerald-600 text-white px-4 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5">
                            <Send className="w-3 h-3" /> ارسال نظر
                         </button>
                      </div>
                   </div>

                   {/* Reviews List */}
                   {product.reviews && product.reviews.length > 0 ? (
                      <div className="space-y-4">
                         {product.reviews.map((review: any) => (
                            <div key={review.id} className="border-b border-slate-100 pb-4 last:border-0">
                               <div className="flex items-center justify-between mb-2">
                                  <div className="flex items-center gap-2">
                                     <span className="text-xs font-bold text-slate-800">{review.user}</span>
                                     <div className="flex text-yellow-400">
                                        {[...Array(5)].map((_, i) => (
                                           <Star key={i} className={`w-3 h-3 ${i < review.rating ? 'fill-current' : 'text-slate-200'}`} />
                                        ))}
                                     </div>
                                  </div>
                                  <span className="text-[10px] text-slate-400">{review.date}</span>
                               </div>
                               <p className="text-xs text-slate-600 leading-relaxed">{review.comment}</p>
                            </div>
                         ))}
                      </div>
                   ) : (
                      <div className="text-center py-8 text-slate-400 text-xs">
                         هنوز نظری ثبت نشده است. اولین نفر باشید!
                      </div>
                   )}
                </div>
              )}
            </div>

            {/* Sticky Action Bar */}
            <div className="absolute bottom-0 left-0 right-0 p-6 bg-white border-t border-slate-100 flex items-center gap-4 shadow-[0_-5px_20px_rgba(0,0,0,0.05)]">
              <div className="flex items-center gap-4 bg-slate-100 px-4 py-3 rounded-2xl">
                <button onClick={() => setQty(Math.max(1, qty - 1))} className="p-1 hover:bg-white rounded-lg transition-colors">
                  <Minus className="w-4 h-4 text-slate-600" />
                </button>
                <span className="font-black text-lg text-slate-800 w-6 text-center">{qty}</span>
                <button onClick={() => setQty(qty + 1)} className="p-1 hover:bg-white rounded-lg transition-colors">
                  <Plus className="w-4 h-4 text-slate-600" />
                </button>
              </div>
              <button 
                onClick={() => {
                  onAddToCart(product.id, qty);
                  onClose();
                }}
                className="flex-1 bg-emerald-600 text-white py-3.5 rounded-2xl font-black text-sm shadow-lg shadow-emerald-200 hover:bg-emerald-700 transition-all active:scale-95 flex items-center justify-center gap-2"
              >
                <ShoppingBag className="w-5 h-5" />
                افزودن {(product.price * qty).toLocaleString()}
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

// --- Cart Drawer Component ---
const CartDrawer = ({ isOpen, onClose, cart, products, onRemoveItem, onUpdateQty, device }: any) => {
  if (!isOpen) return null;

  const total = cart.reduce((acc: number, item: CartItem) => {
    const p = products.find((prod: Product) => prod.id === item.id);
    return acc + (p ? p.price * item.qty : 0);
  }, 0);
  
  const isMobile = device === 'mobile';

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm z-40"
          />
          <motion.div 
            initial={isMobile ? { y: '100%' } : { x: '100%' }}
            animate={isMobile ? { y: 0 } : { x: 0 }}
            exit={isMobile ? { y: '100%' } : { x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className={`absolute z-50 bg-white shadow-2xl flex flex-col ${
               isMobile 
                ? 'bottom-0 left-0 right-0 rounded-t-[2.5rem] h-[70%]' 
                : 'top-0 right-0 bottom-0 w-[400px] border-l border-slate-100'
            }`}
          >
            <div className={`w-full flex justify-center pt-3 pb-1 ${!isMobile && 'hidden'}`} onClick={onClose}>
              <div className="w-12 h-1.5 bg-slate-200 rounded-full" />
            </div>
            
            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center">
               <h2 className="text-lg font-black text-slate-800">سبد خرید شما</h2>
               <div className="flex items-center gap-2">
                 <span className="bg-emerald-50 text-emerald-600 px-3 py-1 rounded-full text-xs font-bold">{cart.length} قلم</span>
                 {!isMobile && (
                   <button onClick={onClose} className="p-1 hover:bg-slate-100 rounded-full">
                     <X className="w-5 h-5 text-slate-500" />
                   </button>
                 )}
               </div>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {cart.map((item: CartItem) => {
                const product = products.find((p: Product) => p.id === item.id);
                if (!product) return null;
                return (
                  <div key={item.id} className="flex gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                    <img src={product.image} alt={product.name} className="w-20 h-20 rounded-xl object-cover bg-white" />
                    <div className="flex-1 flex flex-col justify-between">
                       <div className="flex justify-between items-start">
                          <h3 className="font-bold text-slate-800 text-sm">{product.name}</h3>
                          <button onClick={() => onRemoveItem(item.id)} className="text-slate-400 hover:text-red-500">
                             <Trash2 className="w-4 h-4" />
                          </button>
                       </div>
                       <div className="flex justify-between items-end">
                          <span className="text-sm font-black text-emerald-600">{(product.price * item.qty).toLocaleString()}</span>
                          <div className="flex items-center gap-3 bg-white px-2 py-1 rounded-lg border border-slate-200">
                             <button onClick={() => onUpdateQty(item.id, Math.max(1, item.qty - 1))} className="p-0.5"><Minus className="w-3 h-3 text-slate-600" /></button>
                             <span className="text-xs font-bold w-4 text-center">{item.qty}</span>
                             <button onClick={() => onUpdateQty(item.id, item.qty + 1)} className="p-0.5"><Plus className="w-3 h-3 text-slate-600" /></button>
                          </div>
                       </div>
                    </div>
                  </div>
                );
              })}
              {cart.length === 0 && (
                 <div className="text-center py-10 text-slate-400 text-sm">سبد خرید خالی است</div>
              )}
            </div>

            <div className="p-6 bg-slate-900 text-white rounded-t-3xl md:rounded-none">
               <div className="flex justify-between items-center mb-4">
                  <span className="text-slate-400 text-sm">مبلغ قابل پرداخت</span>
                  <span className="text-xl font-black text-emerald-400">{total.toLocaleString()} تومان</span>
               </div>
               <button className="w-full bg-emerald-500 text-white py-4 rounded-2xl font-black text-lg hover:bg-emerald-400 transition-colors">
                  تکمیل و پرداخت
               </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

// --- Floating Cart Bar ---

const CartFloatingBar = ({ cart, products, onClick, device }: { cart: CartItem[], products: any[], onClick: () => void, device: DeviceType }) => {
  const totalItems = cart.reduce((acc, item) => acc + item.qty, 0);
  const totalPrice = cart.reduce((acc, item) => {
    const prod = products.find(p => p.id === item.id);
    return acc + (prod ? prod.price * item.qty : 0);
  }, 0);
  
  const widthClass = device === 'mobile' ? 'left-6 right-6' : 'left-1/2 -translate-x-1/2 w-[400px]';

  return (
    <AnimatePresence>
      {totalItems > 0 && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          className={`absolute bottom-6 z-30 cursor-pointer ${widthClass}`}
          onClick={onClick}
        >
          {/* Using #0a0a0a hex code as requested */}
          <div className="bg-[#0a0a0a] text-white p-4 rounded-2xl shadow-2xl flex items-center justify-between border border-white/10 backdrop-blur-xl hover:scale-[1.02] transition-transform">
            <div className="flex flex-col">
              <span className="text-[10px] text-slate-400 font-bold mb-0.5 flex items-center gap-1">
                 <ShoppingBag className="w-3 h-3" />
                 {totalItems} آیتم در سبد
              </span>
              <span className="text-lg font-black text-emerald-400">{totalPrice.toLocaleString()} تومان</span>
            </div>
            <button className="bg-emerald-600 text-white px-6 py-2.5 rounded-xl text-xs font-black hover:bg-emerald-500 transition-colors shadow-lg shadow-emerald-900/50 flex items-center gap-2">
              مشاهده و پرداخت <ArrowLeft className="w-4 h-4" />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};


// --- Main Designer Component ---

// Added props interface for CanvasDesigner to receive state from App
interface CanvasDesignerProps {
  elements: ComponentItem[];
  onElementsChange: React.Dispatch<React.SetStateAction<ComponentItem[]>>;
}

const CanvasDesigner: React.FC<CanvasDesignerProps> = ({ elements: canvasElements, onElementsChange: setCanvasElements }) => {
  const [device, setDevice] = useState<DeviceType>('mobile');
  const [zoom, setZoom] = useState(100);
  const [selectedElementId, setSelectedElementId] = useState<string | null>(null);
  
  // Preview State
  const [cart, setCart] = useState<CartItem[]>([]);
  const [activeProduct, setActiveProduct] = useState<Product | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);

  const addToCart = (id: string, qty: number) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === id);
      if (existing) {
        return prev.map(item => item.id === id ? { ...item, qty: item.qty + qty } : item);
      }
      return [...prev, { id, qty }];
    });
  };

  const removeFromCart = (id: string) => {
    setCart(prev => prev.filter(item => item.id !== id));
  };

  const updateCartQty = (id: string, qty: number) => {
    setCart(prev => prev.map(item => item.id === id ? { ...item, qty } : item));
  };

  const addElement = (item: any) => {
    const newEl: ComponentItem = {
      id: Math.random().toString(36).substr(2, 9),
      type: item.type,
      label: item.label,
      settings: item.defaults ? { ...item.defaults } : {
        title: item.label,
        fontSize: 16,
        padding: 16,
        animation: 'fade'
      }
    };
    setCanvasElements([...canvasElements, newEl]);
    setSelectedElementId(newEl.id);
  };

  const removeElement = (id: string) => {
    setCanvasElements(canvasElements.filter(el => el.id !== id));
    if (selectedElementId === id) setSelectedElementId(null);
  };

  const selectedElement = canvasElements.find(el => el.id === selectedElementId);

  // Dynamic Styles based on Device
  const getDeviceFrameStyles = () => {
    switch (device) {
      case 'mobile':
        return {
           width: 375,
           height: 812,
           className: "bg-white rounded-[3rem] border-[8px] border-slate-900"
        };
      case 'tablet':
        return {
           width: 768,
           height: '100%',
           className: "bg-white rounded-[2rem] border-[8px] border-slate-900"
        };
    }
  };

  const frameStyle = getDeviceFrameStyles();

  return (
    <div className="flex h-full bg-slate-50 overflow-hidden select-none">
      {/* Right Sidebar: Library */}
      <div className="w-72 bg-white border-l border-slate-200 flex flex-col shadow-sm">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <h3 className="font-bold text-slate-800 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-emerald-600" />
            اجزای منو
          </h3>
          <Layers className="w-4 h-4 text-slate-400" />
        </div>
        <div className="flex-1 overflow-y-auto p-4 space-y-6">
          {COMPONENT_LIBRARY.map((cat, idx) => (
            <div key={idx} className="space-y-3">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">{cat.category}</span>
              <div className="grid grid-cols-2 gap-2">
                {cat.items.map((item) => (
                  <button 
                    key={item.id}
                    onClick={() => addElement(item)}
                    className="flex flex-col items-center justify-center p-3 border border-slate-100 rounded-xl bg-slate-50 hover:bg-emerald-50 hover:border-emerald-200 transition-all group text-center gap-2"
                  >
                    <div className="p-2 bg-white rounded-lg shadow-sm text-slate-500 group-hover:text-emerald-600 transition-colors">
                      {item.icon}
                    </div>
                    <span className="text-[10px] font-medium text-slate-600 group-hover:text-emerald-700">{item.label}</span>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Center: Canvas */}
      <div className="flex-1 flex flex-col bg-slate-100 relative overflow-hidden">
        {/* Toolbar */}
        <div className="h-14 bg-white/80 backdrop-blur border-b border-slate-200 flex items-center justify-between px-6 z-20">
          <div className="flex items-center gap-2 bg-slate-200/50 p-1 rounded-lg">
            <button onClick={() => setDevice('mobile')} className={`p-1.5 rounded ${device === 'mobile' ? 'bg-white shadow-sm text-emerald-600' : 'text-slate-500'}`}><Smartphone className="w-4 h-4" /></button>
            <button onClick={() => setDevice('tablet')} className={`p-1.5 rounded ${device === 'tablet' ? 'bg-white shadow-sm text-emerald-600' : 'text-slate-500'}`}><Tablet className="w-4 h-4" /></button>
          </div>

          <div className="flex items-center gap-4 text-xs font-medium text-slate-500">
            <div className="flex items-center gap-2">
              <button onClick={() => setZoom(Math.max(50, zoom - 10))}><ZoomOut className="w-4 h-4" /></button>
              <span className="w-10 text-center">{zoom}%</span>
              <button onClick={() => setZoom(Math.min(200, zoom + 10))}><ZoomIn className="w-4 h-4" /></button>
            </div>
            <button className="flex items-center gap-1 hover:text-emerald-600"><Maximize2 className="w-4 h-4" /> تمام صفحه</button>
          </div>
        </div>

        {/* The Frame */}
        <div className="flex-1 overflow-auto flex items-center justify-center p-12 perspective-1000">
          <motion.div 
            layout
            style={{ 
              width: frameStyle.width, 
              height: frameStyle.height,
              scale: zoom / 100,
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
            }}
            className={`${frameStyle.className} overflow-hidden relative group`}
          >
            {/* Notch - Only for Mobile */}
            {device === 'mobile' && (
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-slate-900 rounded-b-2xl z-20" />
            )}

            {/* Grid Overlays */}
            <div className="absolute inset-0 pointer-events-none opacity-5 group-hover:opacity-10 transition-opacity z-0">
              <div className="w-full h-full" style={{ backgroundImage: 'linear-gradient(to right, #ccc 1px, transparent 1px), linear-gradient(to bottom, #ccc 1px, transparent 1px)', backgroundSize: '20px 20px' }} />
            </div>

            {/* Canvas Content */}
            <div className="p-4 pt-10 h-full overflow-y-auto space-y-4 relative z-10 scrollbar-hide pb-24">
              {canvasElements.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center p-10 space-y-4 opacity-30">
                  <div className="w-16 h-16 bg-slate-200 rounded-full flex items-center justify-center">
                    <Plus className="w-8 h-8 text-slate-400" />
                  </div>
                  <p className="text-sm font-bold">برای شروع، اجزای مورد نظر را از پنل سمت راست اضافه کنید</p>
                </div>
              ) : (
                canvasElements.map((el) => {
                  const commonProps = {
                    key: el.id,
                    element: el,
                    isSelected: selectedElementId === el.id,
                    onClick: () => setSelectedElementId(el.id),
                    onProductClick: setActiveProduct,
                    cart: cart,
                    device: device
                  };

                  if (el.type === 'hero') {
                    return <HeroRenderer key={el.id} element={el} isSelected={selectedElementId === el.id} onClick={() => setSelectedElementId(el.id)} device={device} />;
                  }

                  if (el.type === 'product-grid') {
                    return <ProductGridRenderer {...commonProps} />;
                  }
                  
                  if (el.type === 'product-list') {
                    return <ProductListRenderer {...commonProps} />;
                  }

                  if (el.type === 'featured') {
                    return <FeaturedRenderer {...commonProps} />;
                  }

                  // Default Fallback
                  return (
                    <motion.div 
                      key={el.id}
                      layoutId={el.id}
                      onClick={() => setSelectedElementId(el.id)}
                      className={`relative p-6 rounded-2xl cursor-pointer border-2 transition-all bg-white text-center ${
                        selectedElementId === el.id ? 'border-emerald-500 bg-emerald-50/30' : 'border-transparent hover:border-emerald-200 shadow-sm'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded shadow-sm border border-emerald-100">{el.label}</span>
                        <GripVertical className="w-4 h-4 text-slate-300" />
                      </div>
                      <div className="py-4">
                        <h3 style={{ color: el.settings.color || 'black', fontSize: el.settings.fontSize }} className="font-bold">
                          {el.settings.title}
                        </h3>
                         {el.type === 'action-btn' && (
                            <button className="mt-3 bg-emerald-600 text-white px-6 py-2 rounded-xl text-sm font-bold w-full">
                                کلیک کنید
                            </button>
                         )}
                      </div>
                    </motion.div>
                  );
                })
              )}
            </div>

            {/* Overlays for Interaction */}
            <CartFloatingBar cart={cart} products={MOCK_PRODUCTS} onClick={() => setIsCartOpen(true)} device={device} />
            
            <ProductDetailModal 
              product={activeProduct} 
              isOpen={!!activeProduct} 
              onClose={() => setActiveProduct(null)} 
              onAddToCart={addToCart}
              device={device}
            />

            <CartDrawer 
               isOpen={isCartOpen}
               onClose={() => setIsCartOpen(false)}
               cart={cart}
               products={MOCK_PRODUCTS}
               onRemoveItem={removeFromCart}
               onUpdateQty={updateCartQty}
               device={device}
            />

          </motion.div>
        </div>
      </div>

      {/* Left Sidebar: Property Inspector */}
      <div className="w-80 bg-white border-r border-slate-200 flex flex-col shadow-sm">
        <div className="p-4 border-b border-slate-100 flex items-center gap-2">
          <Settings2 className="w-4 h-4 text-slate-500" />
          <h3 className="font-bold text-slate-800">تنظیمات المان</h3>
        </div>
        
        <div className="flex-1 overflow-y-auto p-6">
          <AnimatePresence mode="wait">
            {selectedElement ? (
              <motion.div
                key={selectedElement.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-6"
              >
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500">عنوان المان</label>
                  <input 
                    type="text" 
                    value={selectedElement.settings.title}
                    onChange={(e) => {
                      const val = e.target.value;
                      setCanvasElements(prev => prev.map(el => el.id === selectedElement.id ? { ...el, settings: { ...el.settings, title: val }} : el));
                    }}
                    className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 outline-none" 
                  />
                </div>

                {selectedElement.settings.subtitle !== undefined && (
                   <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500">توضیحات کوتاه</label>
                    <input 
                      type="text" 
                      value={selectedElement.settings.subtitle}
                      onChange={(e) => {
                        const val = e.target.value;
                        setCanvasElements(prev => prev.map(el => el.id === selectedElement.id ? { ...el, settings: { ...el.settings, subtitle: val }} : el));
                      }}
                      className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 outline-none" 
                    />
                  </div>
                )}

                {selectedElement.settings.imageUrl !== undefined && (
                   <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500">لینک تصویر</label>
                    <input 
                      type="text" 
                      value={selectedElement.settings.imageUrl}
                      onChange={(e) => {
                        const val = e.target.value;
                        setCanvasElements(prev => prev.map(el => el.id === selectedElement.id ? { ...el, settings: { ...el.settings, imageUrl: val }} : el));
                      }}
                      className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 outline-none text-left" 
                      dir="ltr"
                    />
                  </div>
                )}

                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500">رنگ متن</label>
                  <div className="flex gap-2">
                    {['#ffffff', '#0f172a', '#10b981', '#3b82f6', '#f59e0b', '#ef4444'].map(color => (
                      <button 
                        key={color}
                        style={{ backgroundColor: color }}
                        className={`w-8 h-8 rounded-full border-2 shadow-sm ${selectedElement.settings.color === color ? 'border-slate-800 scale-110' : 'border-slate-200'} transition-transform`}
                        onClick={() => {
                          setCanvasElements(prev => prev.map(el => el.id === selectedElement.id ? { ...el, settings: { ...el.settings, color }} : el));
                        }}
                      />
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <label className="text-xs font-bold text-slate-500">اندازه فونت</label>
                    <span className="text-xs text-slate-400">{selectedElement.settings.fontSize}px</span>
                  </div>
                  <input 
                    type="range" 
                    min="12" 
                    max="64" 
                    value={selectedElement.settings.fontSize}
                    onChange={(e) => {
                      const val = parseInt(e.target.value);
                      setCanvasElements(prev => prev.map(el => el.id === selectedElement.id ? { ...el, settings: { ...el.settings, fontSize: val }} : el));
                    }}
                    className="w-full h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-emerald-600"
                  />
                </div>

                <div className="pt-4 border-t border-slate-100">
                  <button 
                    onClick={() => removeElement(selectedElement.id)}
                    className="w-full py-3 bg-red-50 text-red-600 rounded-xl text-sm font-bold flex items-center justify-center gap-2 hover:bg-red-100 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                    حذف المان
                  </button>
                </div>
              </motion.div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center opacity-40 py-20">
                <Smartphone className="w-12 h-12 mb-4 text-slate-300" />
                <p className="text-sm">یک المان را برای ویرایش انتخاب کنید</p>
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default CanvasDesigner;
