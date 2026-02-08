
import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Smartphone, 
  Tablet, 
  Monitor, 
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
  ChevronDown
} from 'lucide-react';
import { COMPONENT_LIBRARY } from '../constants';
import { ComponentItem } from '../types';

// --- Enhanced Mock Data ---
const MOCK_PRODUCTS = [
  { 
    id: 1, 
    name: 'پیتزا پپرونی', 
    price: 245000, 
    description: 'پیتزای کلاسیک با پپرونی تند، پنیر موزارلا و سس گوجه‌فرنگی مخصوص',
    image: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?q=80&w=1000&auto=format&fit=crop',
    modifiers: [
      { name: 'سایز', options: [{ label: 'متوسط', price: 0 }, { label: 'بزرگ', price: 85000 }] },
      { name: 'نان', options: [{ label: 'ایتالیایی', price: 0 }, { label: 'آمریکایی', price: 15000 }] }
    ]
  },
  { 
    id: 2, 
    name: 'برگر کلاسیک', 
    price: 185000, 
    description: 'گوشت گوساله ۱۰۰٪ خالص، کاهو، گوجه، خیارشور و سس مخصوص',
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=1000&auto=format&fit=crop',
    modifiers: [
      { name: 'پخت', options: [{ label: 'مدیوم', price: 0 }, { label: 'ول‌دان', price: 0 }] },
      { name: 'پنیر اضافه', options: [{ label: 'خیر', price: 0 }, { label: 'بله', price: 25000 }] }
    ]
  },
  { 
    id: 3, 
    name: 'سالاد سزار', 
    price: 120000, 
    description: 'کاهو رسمی، فیله مرغ گریل، نان سیر، پنیر پارمزان و سس سزار',
    image: 'https://images.unsplash.com/photo-1550304999-8f69611339bf?q=80&w=1000&auto=format&fit=crop',
    modifiers: []
  },
  { 
    id: 4, 
    name: 'پاستا آلفردو', 
    price: 190000, 
    description: 'پنه، سس آلفردو خامه ای، قارچ، مرغ و جعفری تازه',
    image: 'https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?q=80&w=1000&auto=format&fit=crop',
    modifiers: []
  },
];

// --- Types for Local State ---
interface CartItem {
  id: number;
  qty: number;
}

interface CommonRendererProps {
  element: ComponentItem;
  isSelected: boolean;
  onClick: () => void;
  onProductClick: (product: any) => void;
  cart: CartItem[];
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

const HeroRenderer: React.FC<{ element: ComponentItem, isSelected: boolean, onClick: () => void }> = ({ element, isSelected, onClick }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const { settings } = element;
  const { style, imageUrl, title, subtitle, color, fontSize } = settings;

  const handleSplitClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsExpanded(!isExpanded);
  };

  const containerClasses = `relative w-full rounded-2xl overflow-hidden cursor-pointer transition-all border-2 ${isSelected ? 'border-emerald-500 ring-4 ring-emerald-500/10' : 'border-transparent hover:border-emerald-200'}`;

  // STYLE 1: Overlay
  if (style === 'overlay') {
    return (
      <motion.div layoutId={element.id} onClick={onClick} className={`${containerClasses} aspect-square`}>
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

  // STYLE 2: Stack
  if (style === 'stack') {
    return (
      <motion.div layoutId={element.id} onClick={onClick} className={`${containerClasses} bg-white flex flex-col`}>
        <div className="aspect-square w-full relative overflow-hidden">
          <img src={imageUrl} alt="Hero" className="w-full h-full object-cover" />
        </div>
        <div className="p-6 text-center">
          <h3 style={{ color: color || '#0f172a', fontSize: fontSize || 20 }} className="font-black mb-2">{title}</h3>
          {subtitle && <p className="text-slate-500 text-sm">{subtitle}</p>}
        </div>
      </motion.div>
    );
  }

  // STYLE 3: Split (Interactive)
  if (style === 'split') {
    return (
      <motion.div 
        layout
        layoutId={element.id} 
        onClick={onClick}
        className={`${containerClasses} bg-white aspect-square`}
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

const ProductGridRenderer: React.FC<CommonRendererProps> = ({ element, isSelected, onClick, onProductClick, cart }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const containerClasses = `relative w-full rounded-2xl overflow-hidden cursor-pointer transition-all border-2 bg-white ${isSelected ? 'border-emerald-500 ring-4 ring-emerald-500/10' : 'border-transparent hover:border-emerald-200'}`;
  
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
              className="grid grid-cols-2 gap-3 overflow-hidden"
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

const ProductListRenderer: React.FC<CommonRendererProps> = ({ element, isSelected, onClick, onProductClick, cart }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const containerClasses = `relative w-full rounded-2xl overflow-hidden cursor-pointer transition-all border-2 bg-white ${isSelected ? 'border-emerald-500 ring-4 ring-emerald-500/10' : 'border-transparent hover:border-emerald-200'}`;

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
              className="space-y-3 overflow-hidden"
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

const FeaturedRenderer: React.FC<CommonRendererProps> = ({ element, isSelected, onClick, onProductClick, cart }) => {
  const containerClasses = `relative w-full rounded-3xl overflow-hidden cursor-pointer transition-all border-2 bg-white ${isSelected ? 'border-emerald-500 ring-4 ring-emerald-500/10' : 'border-transparent hover:border-emerald-200'}`;
  // Use the first mock product as the "featured" item for data simulation
  const featuredProduct = { ...MOCK_PRODUCTS[0], name: element.settings.title || MOCK_PRODUCTS[0].name, image: element.settings.imageUrl || MOCK_PRODUCTS[0].image };
  const inCart = cart.some(item => item.id === featuredProduct.id);

  return (
    <div onClick={onClick} className={containerClasses}>
      <div className="relative h-72 group">
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

// --- Product Detail Bottom Sheet ---

const ProductDetailModal = ({ product, isOpen, onClose, onAddToCart, initialQty = 0 }: any) => {
  const [qty, setQty] = useState(initialQty || 1);

  if (!isOpen || !product) return null;

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
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="absolute bottom-0 left-0 right-0 bg-white rounded-t-[2.5rem] z-50 max-h-[85%] flex flex-col shadow-[0_-10px_40px_rgba(0,0,0,0.2)]"
          >
            {/* Handle */}
            <div className="w-full flex justify-center pt-3 pb-1" onClick={onClose}>
              <div className="w-12 h-1.5 bg-slate-200 rounded-full" />
            </div>

            {/* Content Scrollable */}
            <div className="flex-1 overflow-y-auto p-6 pb-24">
              <div className="relative h-56 rounded-3xl overflow-hidden mb-6 shadow-sm">
                <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                <button onClick={onClose} className="absolute top-4 right-4 w-8 h-8 bg-black/30 backdrop-blur text-white rounded-full flex items-center justify-center">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="flex items-start justify-between mb-2">
                <h2 className="text-xl font-black text-slate-900">{product.name}</h2>
                <span className="text-lg font-black text-emerald-600">{product.price.toLocaleString()}</span>
              </div>
              <p className="text-sm text-slate-500 leading-relaxed mb-6">{product.description}</p>

              {/* Modifiers */}
              {product.modifiers && product.modifiers.length > 0 && (
                <div className="space-y-6">
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
                              {opt.label} {opt.price > 0 && `(+${opt.price/1000})`}
                            </div>
                          </label>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Sticky Action Bar */}
            <div className="absolute bottom-0 left-0 right-0 p-6 bg-white border-t border-slate-100 flex items-center gap-4">
              <div className="flex items-center gap-4 bg-slate-100 px-4 py-3 rounded-2xl">
                <button onClick={() => setQty(Math.max(1, qty - 1))} className="p-1 hover:bg-white rounded-lg transition-colors">
                  <Minus className="w-4 h-4 text-slate-600" />
                </button>
                <span className="font-black text-lg text-slate-800 w-4 text-center">{qty}</span>
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
                افزودن به سبد {(product.price * qty).toLocaleString()}
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

// --- Floating Cart Bar ---

const CartFloatingBar = ({ cart, products }: { cart: CartItem[], products: any[] }) => {
  const totalItems = cart.reduce((acc, item) => acc + item.qty, 0);
  const totalPrice = cart.reduce((acc, item) => {
    const prod = products.find(p => p.id === item.id);
    return acc + (prod ? prod.price * item.qty : 0);
  }, 0);

  return (
    <AnimatePresence>
      {totalItems > 0 && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          className="absolute bottom-6 left-6 right-6 z-30"
        >
          <div className="bg-slate-900 text-white p-4 rounded-2xl shadow-2xl flex items-center justify-between border border-white/10 backdrop-blur-xl">
            <div className="flex flex-col">
              <span className="text-[10px] text-slate-400 font-bold mb-0.5">مبلغ قابل پرداخت</span>
              <span className="text-lg font-black text-emerald-400">{totalPrice.toLocaleString()} تومان</span>
            </div>
            <button className="bg-emerald-500 text-white px-6 py-2.5 rounded-xl text-xs font-black hover:bg-emerald-400 transition-colors shadow-lg shadow-emerald-900/50 flex items-center gap-2">
              تکمیل سفارش <ArrowLeft className="w-4 h-4" />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};


// --- Main Designer Component ---

const CanvasDesigner: React.FC = () => {
  const [device, setDevice] = useState<'mobile' | 'tablet' | 'desktop'>('mobile');
  const [zoom, setZoom] = useState(100);
  const [canvasElements, setCanvasElements] = useState<ComponentItem[]>([]);
  const [selectedElementId, setSelectedElementId] = useState<string | null>(null);
  
  // Preview State
  const [cart, setCart] = useState<CartItem[]>([]);
  const [activeProduct, setActiveProduct] = useState<any | null>(null);

  const addToCart = (id: number, qty: number) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === id);
      if (existing) {
        return prev.map(item => item.id === id ? { ...item, qty: item.qty + qty } : item);
      }
      return [...prev, { id, qty }];
    });
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
            <button onClick={() => setDevice('desktop')} className={`p-1.5 rounded ${device === 'desktop' ? 'bg-white shadow-sm text-emerald-600' : 'text-slate-500'}`}><Monitor className="w-4 h-4" /></button>
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
              width: device === 'mobile' ? 375 : device === 'tablet' ? 768 : '100%', 
              height: device === 'mobile' ? 812 : '100%',
              scale: zoom / 100,
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
            }}
            className="bg-white rounded-[3rem] border-[8px] border-slate-900 overflow-hidden relative group"
          >
            {/* Notch */}
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
                    cart: cart
                  };

                  if (el.type === 'hero') {
                    return <HeroRenderer key={el.id} element={el} isSelected={selectedElementId === el.id} onClick={() => setSelectedElementId(el.id)} />;
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
            <CartFloatingBar cart={cart} products={MOCK_PRODUCTS} />
            <ProductDetailModal 
              product={activeProduct} 
              isOpen={!!activeProduct} 
              onClose={() => setActiveProduct(null)} 
              onAddToCart={addToCart}
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
