import React, { useState } from 'react';
import { 
  Search, 
  Package, 
  ClipboardList, 
  Users, 
  ArrowRight,
  ChevronLeft,
  Phone,
  Mail,
  Copy,
  Check,
  X,
  Settings,
  Palette,
  Clock,
  MapPin,
  Store,
  LayoutDashboard,
  BarChart3,
  HelpCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { SEARCH_ITEMS } from '../constants';
import { useTenant } from '../data/useRepositories';

interface SearchResultsProps {
  query: string;
  onBack: () => void;
  onNavigate: (view: string, itemId?: string) => void;
}

// --- CUSTOMER PROFILE DETAIL MODAL (REUSED FOR SEARCH RESULTS) ---
interface SearchCustomerProfileModalProps {
   customer: any;
   isOpen: boolean;
   onClose: () => void;
   brandColor: string;
}

const SearchCustomerProfileModal: React.FC<SearchCustomerProfileModalProps> = ({ customer, isOpen, onClose, brandColor }) => {
   const [copiedField, setCopiedField] = useState<string | null>(null);

   if (!customer) return null;

   const handleCopy = (text: string, field: string) => {
      navigator.clipboard.writeText(text);
      setCopiedField(field);
      setTimeout(() => setCopiedField(null), 2000);
   };

   return (
      <motion.div className="fixed inset-0 z-[300] flex items-center justify-center p-4 font-['Vazirmatn']">
         <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-950/80 backdrop-blur-xl"
         />
         <motion.div 
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", stiffness: 350, damping: 28 }}
            className="bg-white w-full max-w-md rounded-[2.5rem] shadow-2xl relative z-10 p-8 overflow-hidden flex flex-col"
         >
            {/* Header / Avatar */}
            <div className="flex flex-col items-center text-center mb-6 relative">
               <button onClick={onClose} className="absolute right-0 top-0 p-2 bg-slate-100 hover:bg-slate-200 text-slate-500 rounded-full transition-colors">
                  <X className="w-4 h-4" />
               </button>
               
               <div className={`w-20 h-20 bg-${brandColor}-50 text-${brandColor}-600 rounded-[2rem] flex items-center justify-center font-black text-3xl mb-4 shadow-inner`}>
                  {customer.title?.charAt(0)}
               </div>
               
               <h3 className="text-xl font-black text-slate-800">{customer.title}</h3>
               <span className={`mt-1.5 px-3 py-1 rounded-full text-[11px] font-bold bg-${brandColor}-50 text-${brandColor}-700 border border-${brandColor}-100`}>
                  {customer.subtitle}
               </span>
            </div>

            {/* Main Stats */}
            <div className="grid grid-cols-2 gap-4 mb-6 bg-slate-50 p-4 rounded-3xl border border-slate-100">
               <div className="text-center p-2">
                  <div className="text-[10px] text-slate-400 font-bold mb-1">تعداد بازدید</div>
                  <div className={`text-lg font-black text-${brandColor}-600`}>{customer.visits ?? 1}</div>
               </div>
               <div className="text-center p-2 border-r border-slate-200">
                  <div className="text-[10px] text-slate-400 font-bold mb-1">مجموع خرید (تومان)</div>
                  <div className="text-lg font-black text-slate-800">{customer.spent ?? '3,200,000'}</div>
               </div>
            </div>

            {/* Customer Details Fields */}
            <div className="space-y-4 mb-8">
               {/* Phone */}
               <div className="flex items-center justify-between p-3.5 bg-slate-50/50 border border-slate-100 rounded-2xl hover:border-slate-200 transition-colors">
                  <div className="flex items-center gap-3">
                     <div className={`p-2 bg-${brandColor}-50 text-${brandColor}-600 rounded-xl`}>
                        <Phone className="w-4 h-4" />
                     </div>
                     <div className="text-right">
                        <div className="text-[10px] font-bold text-slate-400">شماره تلفن</div>
                        <div className="text-sm font-black text-slate-800">{customer.phone ?? '09121234567'}</div>
                     </div>
                  </div>
                  <div className="flex gap-2">
                     <button 
                        onClick={() => handleCopy(customer.phone ?? '09121234567', 'phone')}
                        className="p-2 bg-white hover:bg-slate-100 text-slate-500 rounded-xl transition-colors border border-slate-200/60 shadow-sm"
                        title="کپی شماره"
                     >
                        {copiedField === 'phone' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                     </button>
                     <a 
                        href={`tel:${customer.phone ?? '09121234567'}`}
                        className={`p-2 bg-${brandColor}-600 hover:bg-${brandColor}-700 text-white rounded-xl transition-colors shadow-md shadow-${brandColor}-200 flex items-center justify-center`}
                        title="تماس"
                     >
                        <Phone className="w-3.5 h-3.5" />
                     </a>
                  </div>
               </div>

               {/* Email */}
               <div className="flex items-center justify-between p-3.5 bg-slate-50/50 border border-slate-100 rounded-2xl hover:border-slate-200 transition-colors">
                  <div className="flex items-center gap-3">
                     <div className={`p-2 bg-${brandColor}-50 text-${brandColor}-600 rounded-xl`}>
                        <Mail className="w-4 h-4" />
                     </div>
                     <div className="text-right">
                        <div className="text-[10px] font-bold text-slate-400 font-['Inter']">ایمیل</div>
                        <div className="text-sm font-black text-slate-800 font-['Inter']">{customer.email ?? 'customer@gmail.com'}</div>
                     </div>
                  </div>
                  <div className="flex gap-2">
                     <button 
                        onClick={() => handleCopy(customer.email ?? 'customer@gmail.com', 'email')}
                        className="p-2 bg-white hover:bg-slate-100 text-slate-500 rounded-xl transition-colors border border-slate-200/60 shadow-sm"
                        title="کپی ایمیل"
                     >
                        {copiedField === 'email' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                     </button>
                     <a 
                        href={`mailto:${customer.email ?? 'customer@gmail.com'}`}
                        className={`p-2 bg-${brandColor}-600 hover:bg-${brandColor}-700 text-white rounded-xl transition-colors shadow-md shadow-${brandColor}-200 flex items-center justify-center`}
                        title="ارسال ایمیل"
                     >
                        <Mail className="w-3.5 h-3.5" />
                     </a>
                  </div>
               </div>

               {/* Other Info */}
               <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 bg-slate-50/30 border border-slate-100 rounded-2xl">
                     <span className="text-[10px] text-slate-400 block mb-0.5 font-bold">تاریخ عضویت</span>
                     <span className="text-xs font-black text-slate-700">{customer.joinDate ?? '1402/01/15'}</span>
                  </div>
                  <div className="p-3 bg-slate-50/30 border border-slate-100 rounded-2xl">
                     <span className="text-[10px] text-slate-400 block mb-0.5 font-bold font-['Vazirmatn']">غذای مورد علاقه</span>
                     <span className="text-xs font-black text-slate-700">{customer.favorite ?? 'پیتزا پپرونی'}</span>
                  </div>
               </div>
            </div>

            {/* Footer Close */}
            <button 
               onClick={onClose}
               className={`w-full py-3 bg-${brandColor}-600 hover:bg-${brandColor}-700 text-white font-black rounded-2xl shadow-lg shadow-${brandColor}-200 transition-all flex items-center justify-center gap-2`}
            >
               <Check className="w-5 h-5" /> بستن شناسنامه
            </button>
         </motion.div>
      </motion.div>
   );
};

const SearchResults: React.FC<SearchResultsProps> = ({ query, onBack, onNavigate }) => {
  const [selectedCustomer, setSelectedCustomer] = useState<any | null>(null);
  const { brandColor = 'emerald' } = useTenant();

  const getIconComponent = (iconName: string) => {
    switch (iconName) {
      case 'store': return <Store className={`w-5 h-5 text-${brandColor}-600`} />;
      case 'palette': return <Palette className={`w-5 h-5 text-${brandColor}-600`} />;
      case 'map': return <MapPin className={`w-5 h-5 text-${brandColor}-600`} />;
      case 'clock': return <Clock className={`w-5 h-5 text-${brandColor}-600`} />;
      case 'dashboard': return <LayoutDashboard className={`w-5 h-5 text-${brandColor}-600`} />;
      case 'package': return <Package className={`w-5 h-5 text-${brandColor}-600`} />;
      case 'clipboard': return <ClipboardList className={`w-5 h-5 text-${brandColor}-600`} />;
      case 'barchart': return <BarChart3 className={`w-5 h-5 text-${brandColor}-600`} />;
      case 'settings': return <Settings className={`w-5 h-5 text-${brandColor}-600`} />;
      default: return <HelpCircle className="w-5 h-5 text-slate-400" />;
    }
  };

  const filteredItems = SEARCH_ITEMS.filter(item => 
    item.title.toLowerCase().includes(query.toLowerCase()) || 
    item.subtitle.toLowerCase().includes(query.toLowerCase()) ||
    item.id.toLowerCase().includes(query.toLowerCase()) ||
    (item.keywords && item.keywords.toLowerCase().includes(query.toLowerCase()))
  );

  const products = filteredItems.filter(i => i.type === 'product');
  const orders = filteredItems.filter(i => i.type === 'order');
  const customers = filteredItems.filter(i => i.type === 'customer');
  const settings = filteredItems.filter(i => i.type === 'setting');
  const navigation = filteredItems.filter(i => i.type === 'navigation');

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemAnim = {
    hidden: { opacity: 0, y: 10 },
    show: { opacity: 1, y: 0 }
  };

  const ResultSection = ({ title, items, icon: Icon, color }: any) => {
    if (items.length === 0) return null;
    return (
      <div className="mb-8">
        <h3 className="text-lg font-black text-slate-800 flex items-center gap-2 mb-4">
          <Icon className={`w-5 h-5 ${color}`} />
          {title}
          <span className="text-xs bg-slate-100 text-slate-500 px-2 py-0.5 rounded-lg">{items.length}</span>
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {items.map((item: any) => (
            <motion.div 
              key={item.id}
              variants={itemAnim}
              onClick={() => {
                if (item.type === 'customer') {
                  setSelectedCustomer(item);
                } else if (item.type === 'product') {
                  onNavigate('products', item.title);
                } else if (item.type === 'order') {
                  const hashIdx = item.title.indexOf('#');
                  const orderId = hashIdx !== -1 ? item.title.substring(hashIdx) : item.id;
                  onNavigate('orders', orderId);
                } else if (item.type === 'setting') {
                  onNavigate('settings', item.id);
                } else if (item.type === 'navigation') {
                  onNavigate(item.id);
                }
              }}
              className={`bg-white p-5 rounded-2xl border border-slate-100 shadow-sm transition-all cursor-pointer group hover:border-${brandColor}-200 flex flex-col justify-between`}
            >
              <div className="flex gap-3 items-start justify-between w-full">
                <div className="flex gap-3 items-start">
                  {item.icon && (
                    <div className={`p-2 bg-${brandColor}-50 rounded-xl mt-0.5 shrink-0`}>
                      {getIconComponent(item.icon)}
                    </div>
                  )}
                  <div>
                    <h4 className={`font-bold text-slate-800 mb-1 group-hover:text-${brandColor}-700 transition-colors text-sm`}>{item.title}</h4>
                    <p className="text-xs text-slate-400 leading-relaxed">{item.subtitle}</p>
                  </div>
                </div>
                {item.type === 'product' && <span className={`text-xs font-black text-${brandColor}-600 bg-${brandColor}-50 px-2 py-1 rounded-lg shrink-0`}>{item.detail}</span>}
                {item.type === 'order' && (
                  <span className={`text-[10px] font-bold px-2 py-1 rounded-lg shrink-0 ${
                    item.status === 'new' ? 'bg-red-50 text-red-600' :
                    item.status === 'preparing' ? 'bg-orange-50 text-orange-600' :
                    `bg-${brandColor}-50 text-${brandColor}-600`
                  }`}>
                    {item.detail}
                  </span>
                )}
                {item.type === 'customer' && <span className={`text-[10px] bg-${brandColor}-50 text-${brandColor}-600 px-2 py-1 rounded-lg font-bold shrink-0`}>{item.visits} بازدید</span>}
                {(item.type === 'setting' || item.type === 'navigation') && <span className={`text-[10px] bg-slate-100 text-slate-500 px-2 py-1 rounded-lg font-bold shrink-0`}>{item.detail}</span>}
              </div>
              <div className="mt-4 pt-3 border-t border-slate-50 flex justify-between items-center text-[10px] text-slate-400">
                <span>شناسه: {item.id}</span>
                <ChevronLeft className="w-3 h-3 group-hover:-translate-x-1 transition-transform" />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="h-full flex flex-col bg-slate-50 overflow-hidden font-['Vazirmatn']">
      <div className="p-8 pb-4 shrink-0 bg-white border-b border-slate-200">
        <button 
          onClick={onBack}
          className={`flex items-center gap-2 text-slate-500 hover:text-${brandColor}-600 transition-colors text-sm font-bold mb-4`}
        >
          <ArrowRight className="w-4 h-4" />
          بازگشت به داشبورد
        </button>
        <div className="flex items-center gap-3">
          <div className={`p-3 bg-${brandColor}-50 text-${brandColor}-600 rounded-2xl`}>
            <Search className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-slate-900">نتایج جستجو</h1>
            <p className="text-sm text-slate-400 mt-1">
              نمایش نتایج برای "{query}" - {filteredItems.length} مورد یافت شد
            </p>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-8">
        {filteredItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-slate-400 opacity-50">
            <Search className="w-16 h-16 mb-4" />
            <p className="text-lg font-bold">موردی یافت نشد</p>
            <p className="text-sm">لطفاً با کلمات کلیدی دیگری جستجو کنید</p>
          </div>
        ) : (
          <motion.div 
            variants={container}
            initial="hidden"
            animate="show"
          >
            <ResultSection title="محصولات" items={products} icon={Package} color="text-orange-500" />
            <ResultSection title="سفارشات" items={orders} icon={ClipboardList} color="text-blue-500" />
            <ResultSection title="مشتریان" items={customers} icon={Users} color="text-purple-500" />
            <ResultSection title="بخش‌ها و صفحات سیستم" items={navigation} icon={LayoutDashboard} color="text-emerald-500" />
            <ResultSection title="تنظیمات فروشگاه" items={settings} icon={Settings} color="text-rose-500" />
          </motion.div>
        )}
      </div>

      <AnimatePresence>
         {selectedCustomer && (
            <SearchCustomerProfileModal 
               customer={selectedCustomer}
               isOpen={!!selectedCustomer}
               onClose={() => setSelectedCustomer(null)}
               brandColor={brandColor}
            />
         )}
      </AnimatePresence>
    </div>
  );
};

export default SearchResults;
