
import React, { useState } from 'react';
import { 
  MapPin, 
  Star, 
  Plus, 
  ShoppingBag, 
  ChevronLeft, 
  Search,
  Clock
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// --- Types ---
interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  discount?: number;
}

// --- Mock Data ---
const CATEGORIES = [
  { id: 'kebabs', label: 'کباب‌ها' },
  { id: 'stews', label: 'خورشت‌ها' },
  { id: 'rice', label: 'پلوها' },
  { id: 'appetizers', label: 'پیش‌غذا' },
  { id: 'drinks', label: 'نوشیدنی' },
];

const MENU_ITEMS: MenuItem[] = [
  {
    id: '1',
    name: 'کباب کوبیده',
    description: 'دو سیخ کباب گوشت گوسفندی تازه به همراه برنج زعفرانی و گوجه کبابی.',
    price: 280000,
    image: 'https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?q=80&w=1000&auto=format&fit=crop',
    category: 'kebabs'
  },
  {
    id: '2',
    name: 'قورمه سبزی',
    description: 'خورشت سبزیجات معطر با گوشت گوسفندی، لوبیا قرمز و لیمو عمانی.',
    price: 245000,
    image: 'https://images.unsplash.com/photo-1594910087216-3665a8eb8d0f?q=80&w=1000&auto=format&fit=crop',
    category: 'stews'
  },
  {
    id: '3',
    name: 'جوجه کباب',
    description: 'سینه مرغ مزه‌دار شده با زعفران و کره، کبابی شده روی زغال.',
    price: 221000,
    image: 'https://images.unsplash.com/photo-1626075253805-4d642e0388d1?q=80&w=1000&auto=format&fit=crop',
    category: 'kebabs',
    discount: 15
  },
  {
    id: '4',
    name: 'زرشک پلو با مرغ',
    description: 'ران مرغ سرخ شده با سس مخصوص، برنج زعفرانی و زرشک تازه.',
    price: 210000,
    image: 'https://images.unsplash.com/photo-1606419770542-c13f9f43c393?q=80&w=1000&auto=format&fit=crop',
    category: 'rice'
  },
  {
    id: '5',
    name: 'دوغ پارچی',
    description: 'دوغ سنتی با نعنا خشک و گل محمدی.',
    price: 45000,
    image: 'https://images.unsplash.com/photo-1599321955726-9048b5c93d42?q=80&w=1000&auto=format&fit=crop',
    category: 'drinks'
  },
  {
    id: '6',
    name: 'سالاد شیرازی',
    description: 'خیار، گوجه و پیاز خرد شده با چاشنی آبلیمو و نعنا.',
    price: 35000,
    image: 'https://images.unsplash.com/photo-1626804475297-411d8c6b7189?q=80&w=1000&auto=format&fit=crop',
    category: 'appetizers'
  }
];

// Initial cart matching the prompt requirements (approx 570k)
// Koobideh (280) + Ghormeh (245) + Doogh (45) = 570
const INITIAL_CART = {
  items: [
    { id: '1', qty: 1 },
    { id: '2', qty: 1 },
    { id: '5', qty: 1 }
  ]
};

const CustomerMenu: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState('kebabs');
  const [cartItems, setCartItems] = useState(INITIAL_CART.items);

  const getCategoryItems = () => {
    // For demo purposes, we can show items of the active category, 
    // OR just show all items sorted by active category to match "Product List" general scrolling feel.
    // The prompt implies filtering: "The active category... should be solid Green".
    // I'll filter for a cleaner list view.
    
    if (activeCategory === 'kebabs') return MENU_ITEMS; // Show mostly kebabs but for demo I'll show full list or specific logic
    
    // Actually, typically PWA menus show all items sectioned, or filtered.
    // Given the prompt asks for "Product List: A vertical list", I will render ALL items 
    // but scroll to them or just render them all. 
    // However, to strictly follow the "Category Navigation" highlighting, filtering is a common pattern for single-page views.
    // Let's filter to keep the UI clean, or just show all if the design implies a long scroll.
    // The design shows specific items visible. I'll render ALL items for the "vertical list" feel, 
    // but maybe re-sort them so the active category is at top, or just filter.
    // Let's FILTER for better UX in this component demo.
    
    // Wait, the prompt image shows "Kabab Koobideh", "Ghormeh Sabzi", "Joojeh Kabab".
    // These are from different categories (Kebabs, Stews).
    // This implies the list shows EVERYTHING, and the tabs probably just scroll or filter.
    // I will render ALL items to match the screenshot showing mixed categories if that's the case.
    // Actually Koobideh (Kabab), Ghormeh (Stew), Joojeh (Kabab). 
    // It seems mixed. I will render ALL items in a single list.
    return MENU_ITEMS; 
  };

  const addToCart = (id: string) => {
    setCartItems(prev => {
      const exists = prev.find(item => item.id === id);
      if (exists) {
        return prev.map(item => item.id === id ? { ...item, qty: item.qty + 1 } : item);
      }
      return [...prev, { id, qty: 1 }];
    });
  };

  const totalAmount = cartItems.reduce((acc, item) => {
    const product = MENU_ITEMS.find(p => p.id === item.id);
    return acc + (product ? product.price * item.qty : 0);
  }, 0);

  const totalCount = cartItems.reduce((acc, item) => acc + item.qty, 0);

  return (
    <div className="min-h-screen bg-slate-50 font-['Vazirmatn'] pb-24 mx-auto max-w-md shadow-2xl overflow-hidden relative" dir="rtl">
      
      {/* Search Header */}
      <div className="absolute top-0 left-0 right-0 p-4 z-20 flex justify-between items-center">
        <button className="w-10 h-10 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white">
           <Search className="w-5 h-5" />
        </button>
        <button className="w-10 h-10 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white">
           <div className="w-6 h-0.5 bg-white mb-1"></div>
           <div className="w-6 h-0.5 bg-white mb-1"></div>
           <div className="w-6 h-0.5 bg-white"></div>
        </button>
      </div>

      {/* Hero Section */}
      <div className="relative w-full h-64">
        <img 
          src="https://images.unsplash.com/photo-1555396273-367ea4eb4db5?q=80&w=1000&auto=format&fit=crop" 
          alt="Restaurant Hero" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
        
        <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
          <div className="flex items-end justify-between">
            <div className="flex items-center gap-4">
               <div className="w-16 h-16 rounded-2xl bg-white p-1 shadow-lg">
                  <div className="w-full h-full rounded-xl bg-slate-900 flex items-center justify-center">
                     <img src="https://cdn-icons-png.flaticon.com/512/1996/1996068.png" className="w-10 h-10 invert opacity-90" alt="logo" />
                  </div>
               </div>
               <div>
                  <h1 className="text-xl font-black mb-1">رستوران شاندیز</h1>
                  <div className="flex items-center gap-1 text-xs text-white/80 font-bold">
                     <MapPin className="w-3.5 h-3.5" />
                     تهران، جردن
                  </div>
               </div>
            </div>
            <div className="flex flex-col items-end gap-2">
               <div className="bg-emerald-500/20 backdrop-blur-md border border-emerald-500/30 text-emerald-300 px-3 py-1 rounded-lg text-[10px] font-bold flex items-center gap-1.5">
                  <Clock className="w-3 h-3" /> باز است
               </div>
               <div className="flex items-center gap-1 text-yellow-400 font-black">
                  <span className="text-lg pt-1">۴.۸</span>
                  <Star className="w-4 h-4 fill-current" />
                  <span className="text-[10px] text-white/60 font-medium mr-1">(۲۰۰+ نظر)</span>
               </div>
            </div>
          </div>
        </div>
      </div>

      {/* Category Navigation */}
      <div className="sticky top-0 z-10 bg-slate-50 pt-4 pb-2">
        <div className="flex items-center gap-3 overflow-x-auto px-4 pb-2 scrollbar-hide">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-5 py-2.5 rounded-xl text-sm font-bold whitespace-nowrap transition-all ${
                activeCategory === cat.id
                  ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-200'
                  : 'bg-white text-slate-600 border border-slate-200'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Header for list */}
      <div className="px-6 py-2 flex items-center justify-between">
         <h2 className="font-black text-slate-800 text-lg">کباب‌ها</h2>
         <button className="text-xs font-bold text-emerald-600 flex items-center gap-1">
            مشاهده همه <ChevronLeft className="w-4 h-4" />
         </button>
      </div>

      {/* Product List */}
      <div className="px-4 space-y-4">
        {getCategoryItems().map((item) => (
          <div 
            key={item.id} 
            className="bg-white p-3 rounded-[1.25rem] border border-slate-100 shadow-sm flex gap-4 hover:shadow-md transition-shadow relative overflow-hidden group"
          >
             {/* Image */}
             <div className="w-[100px] h-[100px] rounded-2xl bg-slate-100 shrink-0 relative overflow-hidden">
                <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                {item.discount && (
                   <div className="absolute top-2 right-2 bg-red-500 text-white text-[10px] font-black px-1.5 py-0.5 rounded-md shadow-sm">
                      ٪{item.discount}
                   </div>
                )}
             </div>

             {/* Content */}
             <div className="flex-1 flex flex-col justify-between py-1">
                <div>
                   <div className="flex justify-between items-start">
                      <h3 className="font-black text-slate-800 text-sm mb-1">{item.name}</h3>
                      {item.name === 'کباب کوبیده' && (
                         <div className="flex items-center gap-1 bg-yellow-50 px-1.5 py-0.5 rounded text-[9px] font-bold text-yellow-700 border border-yellow-100">
                            <Star className="w-2.5 h-2.5 fill-current" /> ۴.۸
                         </div>
                      )}
                   </div>
                   <p className="text-[10px] text-slate-400 leading-relaxed line-clamp-2 pl-2">
                      {item.description}
                   </p>
                </div>
                
                <div className="flex items-end justify-between mt-2">
                   <div className="flex flex-col">
                      {item.discount && (
                         <span className="text-[10px] text-slate-300 line-through decoration-red-400 decoration-1">
                            {Math.round(item.price * 1.15).toLocaleString()}
                         </span>
                      )}
                      <span className="text-sm font-black text-slate-800">
                         {item.price.toLocaleString()} <span className="text-[10px] font-medium text-slate-400">تومان</span>
                      </span>
                   </div>
                   <button 
                      onClick={() => addToCart(item.id)}
                      className="w-8 h-8 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center hover:bg-emerald-600 hover:text-white transition-colors active:scale-95"
                   >
                      <Plus className="w-5 h-5" />
                   </button>
                </div>
             </div>
          </div>
        ))}
        {/* Extra spacing for scrolling past footer */}
        <div className="h-10" />
      </div>

      {/* Sticky Cart Footer */}
      <AnimatePresence>
        {totalCount > 0 && (
           <motion.div 
             initial={{ y: 100 }}
             animate={{ y: 0 }}
             exit={{ y: 100 }}
             className="fixed bottom-0 left-0 right-0 p-4 z-50 bg-gradient-to-t from-white via-white to-transparent pb-6 pt-10"
             style={{ maxWidth: '28rem', margin: '0 auto', right: 0, left: 0 }} // Keep it centered on desktop
           >
              <div className="bg-white rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.12)] border border-slate-100 p-4 flex items-center justify-between relative overflow-hidden">
                 <div className="absolute top-0 left-0 w-1 h-full bg-emerald-500" />
                 
                 <div className="flex flex-col pl-4">
                    <span className="text-[10px] font-bold text-slate-400 mb-0.5">مجموع پرداختی</span>
                    <span className="text-lg font-black text-slate-800">
                       {totalAmount.toLocaleString()} <span className="text-xs text-slate-500">تومان</span>
                    </span>
                 </div>

                 <button className="bg-emerald-600 text-white px-5 py-3 rounded-xl flex items-center gap-3 shadow-lg shadow-emerald-200 active:scale-95 transition-transform">
                    <span className="text-xs font-bold">مشاهده موارد انتخابی</span>
                    <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center text-xs font-black backdrop-blur-sm">
                       {totalCount}
                    </div>
                 </button>
              </div>
           </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CustomerMenu;
