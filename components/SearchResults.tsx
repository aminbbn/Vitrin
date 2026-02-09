
import React from 'react';
import { 
  Search, 
  Package, 
  ClipboardList, 
  Users, 
  ArrowRight,
  ChevronLeft
} from 'lucide-react';
import { motion } from 'framer-motion';
import { SEARCH_ITEMS } from '../constants';

interface SearchResultsProps {
  query: string;
  onBack: () => void;
}

const SearchResults: React.FC<SearchResultsProps> = ({ query, onBack }) => {
  const filteredItems = SEARCH_ITEMS.filter(item => 
    item.title.toLowerCase().includes(query.toLowerCase()) || 
    item.subtitle.toLowerCase().includes(query.toLowerCase()) ||
    item.id.toLowerCase().includes(query.toLowerCase())
  );

  const products = filteredItems.filter(i => i.type === 'product');
  const orders = filteredItems.filter(i => i.type === 'order');
  const customers = filteredItems.filter(i => i.type === 'customer');

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
              className="bg-white p-4 rounded-2xl border border-slate-100 hover:border-emerald-200 shadow-sm hover:shadow-md transition-all cursor-pointer group"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-bold text-slate-800 mb-1 group-hover:text-emerald-700 transition-colors">{item.title}</h4>
                  <p className="text-xs text-slate-500">{item.subtitle}</p>
                </div>
                {item.type === 'product' && <span className="text-xs font-black text-emerald-600 bg-emerald-50 px-2 py-1 rounded-lg">{item.detail}</span>}
                {item.type === 'order' && (
                  <span className={`text-[10px] font-bold px-2 py-1 rounded-lg ${
                    item.status === 'new' ? 'bg-red-50 text-red-600' :
                    item.status === 'preparing' ? 'bg-orange-50 text-orange-600' :
                    'bg-emerald-50 text-emerald-600'
                  }`}>
                    {item.detail}
                  </span>
                )}
                {item.type === 'customer' && <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-1 rounded-lg font-bold">{item.visits} بازدید</span>}
              </div>
              <div className="mt-4 pt-4 border-t border-slate-50 flex justify-between items-center text-[10px] text-slate-400">
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
          className="flex items-center gap-2 text-slate-500 hover:text-emerald-600 transition-colors text-sm font-bold mb-4"
        >
          <ArrowRight className="w-4 h-4" />
          بازگشت به داشبورد
        </button>
        <div className="flex items-center gap-3">
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-2xl">
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
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default SearchResults;
