
import React, { useState } from 'react';
import { 
  TrendingUp, 
  Users, 
  ShoppingBag, 
  Clock, 
  ArrowUpRight, 
  ArrowDownRight, 
  ChevronLeft, 
  X, 
  BarChart2,
  Calendar as CalendarIcon,
  Download,
  Loader2,
  Filter,
  Search,
  ChevronDown
} from 'lucide-react';
import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { motion, AnimatePresence } from 'framer-motion';

const WEEKLY_DATA = [
  { name: 'شنبه', revenue: 8500000 },
  { name: 'یکشنبه', revenue: 14200000 },
  { name: 'دوشنبه', revenue: 25800000 },
  { name: 'سه‌شنبه', revenue: 18900000 },
  { name: 'چهارشنبه', revenue: 32500000 },
  { name: 'پنج‌شنبه', revenue: 28400000 },
  { name: 'جمعه', revenue: 46800000 },
];

const DAILY_DATA = [
  { name: '۱۰:۰۰', revenue: 2500000 },
  { name: '۱۲:۰۰', revenue: 8900000 },
  { name: '۱۴:۰۰', revenue: 15400000 },
  { name: '۱۶:۰۰', revenue: 6500000 },
  { name: '۱۸:۰۰', revenue: 12800000 },
  { name: '۲۰:۰۰', revenue: 38600000 },
  { name: '۲۲:۰۰', revenue: 24400000 },
];

const MOCK_POPULAR_PRODUCTS = [
  { name: 'پیتزا پپرونی', category: 'پیتزا', price: '۲۴۵,۰۰۰', count: 128, color: 'emerald' },
  { name: 'چیزبرگر مخصوص', category: 'همبرگر', price: '۱۶۵,۰۰۰', count: 95, color: 'blue' },
  { name: 'سالاد سزار', category: 'سالاد', price: '۱۲۰,۰۰۰', count: 84, color: 'purple' },
  { name: 'سیب‌زمینی ویژه', category: 'پیش‌غذا', price: '۸۵,۰۰۰', count: 76, color: 'orange' },
  { name: 'پاستا آلفردو', category: 'پاستا', price: '۱۹۰,۰۰۰', count: 65, color: 'emerald' },
  { name: 'نوشابه کوکا', category: 'نوشیدنی', price: '۲۵,۰۰۰', count: 210, color: 'red' },
  { name: 'نان سیر', category: 'پیش‌غذا', price: '۶۵,۰۰۰', count: 45, color: 'orange' },
];

// Helper to generate mock stats based on range
const getMockStats = (range: string, brandColor: string) => {
  const baseStats = [
    { 
      id: 'revenue', 
      label: 'کل فروش', 
      value: '۳۸,۴۵۰,۰۰۰', 
      unit: 'تومان', 
      trend: '+۱۲٪', 
      up: true, 
      icon: TrendingUp, 
      color: brandColor,
      insights: [
        { label: 'میانگین فاکتور', value: '۴۵۰,۰۰۰ تومان' },
        { label: 'فروش سالن', value: '۲۸,۴۵۰,۰۰۰' },
        { label: 'بیرون‌بر', value: '۱۰,۰۰۰,۰۰۰' }
      ]
    },
    { 
      id: 'orders', 
      label: 'سفارشات جدید', 
      value: '۴۸', 
      unit: 'سفارش امروز', 
      trend: '+۵٪', 
      up: true, 
      icon: ShoppingBag, 
      color: 'blue',
      insights: [
         { label: 'تکمیل شده', value: '۲۴' },
         { label: 'در انتظار', value: '۱۲' },
         { label: 'لغو شده', value: '۲' }
      ]
    },
    { 
      id: 'customers', 
      label: 'مشتریان جدید', 
      value: '۱۲', 
      unit: 'نفر', 
      trend: '-۲٪', 
      up: false, 
      icon: Users, 
      color: 'purple',
      insights: [
         { label: 'مشتریان وفادار', value: '۱۰۵' },
         { label: 'مشتریان جدید', value: '۱۲' }
      ]
    },
    { 
      id: 'prep', 
      label: 'زمان آماده‌سازی', 
      value: '۱۸', 
      unit: 'دقیقه میانگین', 
      trend: '-۳ دقیقه', 
      up: true, 
      icon: Clock, 
      color: 'orange',
      insights: [
         { label: 'پیش‌غذا', value: '۸ دقیقه' },
         { label: 'غذای اصلی', value: '۲۰ دقیقه' }
      ]
    },
  ];

  if (range === 'today' || range === 'امروز') {
    return baseStats.map(s => {
      if (s.id === 'revenue') return { ...s, value: '۳,۸۵۰,۰۰۰', trend: '+۲٪' };
      if (s.id === 'orders') return { ...s, value: '۱۲', trend: '۰٪' };
      return s;
    });
  }
  if (range === 'yesterday' || range === 'دیروز') {
    return baseStats.map(s => {
      if (s.id === 'revenue') return { ...s, value: '۴,۱۰۰,۰۰۰', trend: '-۵٪', up: false };
      if (s.id === 'orders') return { ...s, value: '۱۵', trend: '+۲٪' };
      return s;
    });
  }
  if (range === '30days' || range === '۳۰ روز گذشته') {
    return baseStats.map(s => {
      if (s.id === 'revenue') return { ...s, value: '۴۵۰,۰۰۰,۰۰۰', trend: '+۱۵٪' };
      if (s.id === 'orders') return { ...s, value: '۱,۲۰۰', trend: '+۱۰٪' };
      if (s.id === 'customers') return { ...s, value: '۱۴۰', trend: '+۸٪', up: true };
      return s;
    });
  }
  if (range === '3months' || range === '۳ ماه گذشته') {
    return baseStats.map(s => {
      if (s.id === 'revenue') return { ...s, value: '۱,۲۵۰,۰۰۰,۰۰۰', trend: '+۲۵٪' };
      if (s.id === 'orders') return { ...s, value: '۳,۵۰۰', trend: '+۱۸٪' };
      if (s.id === 'customers') return { ...s, value: '۴۲۰', trend: '+۱۲٪', up: true };
      return s;
    });
  }
  
  return baseStats;
};

const CustomTooltip = ({ active, payload, label, brandColor }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-slate-900 text-white p-4 rounded-2xl shadow-xl border border-white/10 text-xs">
        <p className="font-bold mb-2 text-slate-400">{label}</p>
        <div className="flex items-center gap-2 mb-1">
          <div className={`w-2 h-2 rounded-full bg-${brandColor}-500`} />
          <span className={`text-${brandColor}-400 font-black text-sm`}>{payload[0].value.toLocaleString()} تومان</span>
        </div>
      </div>
    );
  }
  return null;
};

interface DashboardProps {
  restaurantName: string;
  searchQuery?: string;
  brandColor: string;
}

// --- SUMMARY CARD COMPONENT ---
const SummaryCard = ({ 
  id, 
  label, 
  value, 
  unit, 
  trend, 
  up, 
  icon: Icon, 
  color, 
  onClick, 
  index 
}: any) => {
  
  // Basic theme construction for standard colors
  // Note: We rely on Tailwind classes existing in the bundle. 
  // Common colors like emerald, blue, purple, orange are standard.
  const theme = { bg: `bg-${color}-50`, text: `text-${color}-600`, border: `border-${color}-200` };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, type: "spring", stiffness: 200, damping: 20 }}
      onClick={onClick}
      whileHover={{ scale: 1.02, y: -2 }}
      className="bg-white/90 backdrop-blur-md border border-slate-100 p-6 rounded-[2rem] shadow-sm hover:shadow-md transition-all cursor-pointer group h-[180px] flex flex-col justify-between relative overflow-hidden"
    >
      {/* Header */}
      <div className="flex items-start justify-between">
         <div className={`p-2.5 rounded-2xl ${theme.bg} ${theme.text} transition-transform group-hover:scale-110 shadow-sm`}>
            <Icon className="w-6 h-6" />
         </div>
         <span className="text-xs font-bold text-slate-500 mt-1.5">{label}</span>
      </div>

      {/* Main Metric */}
      <div className="flex flex-col items-center justify-center flex-1 py-2">
         <h3 className="text-4xl font-black text-slate-900 tracking-tight">
           {value}
         </h3>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between gap-4">
         <div className={`flex items-center gap-1.5 text-[10px] font-black px-3 py-1.5 rounded-full border ${up ? `text-emerald-600 bg-emerald-50 border-emerald-100` : 'text-rose-600 bg-rose-50 border-rose-100'}`}>
            {up ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
            {trend}
         </div>
         <span className="text-[10px] text-slate-400 font-bold bg-slate-50 border border-slate-100 px-3 py-1.5 rounded-full">
           {unit}
         </span>
      </div>

      {/* Ambient Glow */}
      <div className={`absolute -right-12 -bottom-12 w-32 h-32 bg-${color}-500/5 blur-[60px] rounded-full group-hover:bg-${color}-500/10 transition-colors pointer-events-none`} />
    </motion.div>
  );
};

// --- EXPANDED CARD (MODAL) ---
const ExpandedCard = ({ stat, onClose }: { stat: any, onClose: () => void }) => {
  const Icon = stat.icon;
  const color = stat.color;

  return (
    <>
      <motion.div 
        initial={{ opacity: 0, backdropFilter: "blur(0px)" }}
        animate={{ opacity: 1, backdropFilter: "blur(8px)" }}
        exit={{ opacity: 0, backdropFilter: "blur(0px)" }}
        transition={{ duration: 0.3 }}
        onClick={onClose}
        className="fixed inset-0 bg-slate-900/70 z-[100]"
      />
      
      <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 pointer-events-none">
        <motion.div 
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
          className="bg-white w-full max-w-sm rounded-[1.5rem] shadow-2xl relative overflow-hidden border border-slate-100 flex flex-col pointer-events-auto"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="p-6 relative">
             <div className="flex items-center justify-between mb-8">
                 <div className="flex items-center gap-3">
                    <div className={`p-3.5 rounded-2xl bg-${color}-50 text-${color}-600 shadow-sm`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-lg font-black text-slate-700">{stat.label}</span>
                 </div>
                 <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-400">
                    <X className="w-5 h-5" />
                 </button>
             </div>

             <div className="flex flex-col items-start mb-8">
                 <motion.h2 
                   initial={{ opacity: 0, y: 10 }}
                   animate={{ opacity: 1, y: 0 }}
                   transition={{ delay: 0.1 }}
                   className="text-5xl font-black text-slate-900 tracking-tight"
                 >
                   {stat.value}
                 </motion.h2>
                 <div className="flex items-center gap-3 mt-3">
                    <span className={`text-xs font-black px-3 py-1.5 rounded-full flex items-center gap-1.5 border ${stat.up ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-rose-50 text-rose-600 border-rose-100'}`}>
                        {stat.up ? <ArrowUpRight className="w-3.5 h-3.5" /> : <ArrowDownRight className="w-3.5 h-3.5" />}
                        {stat.trend}
                    </span>
                    <span className="text-xs text-slate-500 font-bold bg-slate-50 px-3 py-1.5 rounded-full border border-slate-100">{stat.unit}</span>
                 </div>
             </div>

             <div className="space-y-4">
                <h4 className="text-xs font-black text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-2">
                   <BarChart2 className="w-3 h-3" />
                   جزئیات سریع
                </h4>
                <div className="space-y-3">
                   {stat.insights.map((detail: any, i: number) => (
                      <motion.div 
                        key={i} 
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 + (i * 0.1) }}
                        className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100 hover:border-slate-200 transition-colors"
                      >
                         <span className="text-xs font-bold text-slate-600">{detail.label}</span>
                         <span className="text-sm font-black text-slate-800">{detail.value}</span>
                      </motion.div>
                   ))}
                </div>
             </div>
             
             <div className="h-6" />
          </div>
        </motion.div>
      </div>
    </>
  );
};

// --- ALL PRODUCTS MODAL ---
const AllProductsModal = ({ isOpen, onClose, searchQuery, brandColor }: any) => {
  const [localSearch, setLocalSearch] = useState('');
  
  // Combine global search query (from header) with local search in modal if needed, 
  // but usually modal uses its own. If searchQuery passed, filter by it.
  const query = localSearch || searchQuery || '';

  const filteredProducts = MOCK_POPULAR_PRODUCTS.filter(p => 
    p.name.includes(query) || p.category.includes(query)
  );

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
          />
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="bg-white w-full max-w-4xl rounded-[2.5rem] shadow-2xl relative z-10 overflow-hidden flex flex-col max-h-[85vh]"
          >
            <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-white sticky top-0 z-20">
              <h3 className="font-black text-lg text-slate-800 flex items-center gap-2">
                <ShoppingBag className={`w-5 h-5 text-${brandColor}-600`} />
                لیست کامل محصولات
              </h3>
              <button 
                onClick={onClose}
                className="p-2 bg-slate-50 rounded-full border border-slate-200 hover:bg-slate-100 transition-colors"
              >
                <X className="w-5 h-5 text-slate-500" />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto">
               <div className="flex gap-4 mb-6">
                  <div className="relative flex-1">
                     <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                     <input 
                        type="text" 
                        value={localSearch || searchQuery || ''}
                        onChange={(e) => setLocalSearch(e.target.value)}
                        placeholder="جستجو در محصولات..." 
                        className={`w-full bg-slate-50 border border-slate-200 rounded-xl pl-4 pr-10 py-2.5 text-sm focus:border-${brandColor}-500 outline-none`}
                     />
                  </div>
               </div>

               <div className="border border-slate-100 rounded-2xl overflow-hidden">
                  <table className="w-full text-right">
                     <thead className="bg-slate-50 border-b border-slate-100">
                        <tr>
                           <th className="px-6 py-4 text-xs font-black text-slate-500">نام محصول</th>
                           <th className="px-6 py-4 text-xs font-black text-slate-500">دسته‌بندی</th>
                           <th className="px-6 py-4 text-xs font-black text-slate-500">قیمت</th>
                           <th className="px-6 py-4 text-xs font-black text-slate-500">تعداد فروش</th>
                           <th className="px-6 py-4 text-xs font-black text-slate-500">وضعیت</th>
                        </tr>
                     </thead>
                     <tbody className="divide-y divide-slate-100">
                        {filteredProducts.length > 0 ? filteredProducts.map((prod, idx) => (
                           <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                              <td className="px-6 py-4">
                                 <div className="flex items-center gap-3">
                                    <div className={`w-8 h-8 rounded-lg bg-${prod.color}-100 flex items-center justify-center text-${prod.color}-600 font-bold text-xs`}>
                                       {prod.name.charAt(0)}
                                    </div>
                                    <span className="text-sm font-bold text-slate-800">{prod.name}</span>
                                 </div>
                              </td>
                              <td className="px-6 py-4 text-xs font-medium text-slate-500">
                                 <span className="bg-slate-100 px-2 py-1 rounded-md">{prod.category}</span>
                              </td>
                              <td className={`px-6 py-4 text-sm font-black text-${brandColor}-600`}>{prod.price}</td>
                              <td className="px-6 py-4 text-sm font-bold text-slate-700">{prod.count}</td>
                              <td className="px-6 py-4">
                                 <span className={`text-[10px] font-bold text-${brandColor}-600 bg-${brandColor}-50 px-2 py-1 rounded-full border border-${brandColor}-100`}>موجود</span>
                              </td>
                           </tr>
                        )) : (
                          <tr>
                             <td colSpan={5} className="px-6 py-10 text-center text-slate-400 text-sm">
                                موردی یافت نشد
                             </td>
                          </tr>
                        )}
                     </tbody>
                  </table>
               </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};


const Dashboard: React.FC<DashboardProps> = ({ restaurantName, searchQuery = '', brandColor }) => {
  const [dateRange, setDateRange] = useState<'7days' | '30days' | '3months'>('7days');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [statsData, setStatsData] = useState(getMockStats('7days', brandColor));
  const [selectedStatId, setSelectedStatId] = useState<string | null>(null);
  const [showAllProductsModal, setShowAllProductsModal] = useState(false);
  const [chartView, setChartView] = useState<'weekly' | 'daily'>('weekly');
  
  // Report State
  const [isGeneratingReport, setIsGeneratingReport] = useState(false);

  // Update stats data when brandColor changes
  React.useEffect(() => {
     setStatsData(getMockStats(dateRange, brandColor));
  }, [brandColor, dateRange]);

  const selectedStat = statsData.find(s => s.id === selectedStatId);
  
  // Filter popular products based on search query
  const filteredPopularProducts = MOCK_POPULAR_PRODUCTS.filter(p => 
    p.name.includes(searchQuery) || p.category.includes(searchQuery)
  );

  const getDateRangeLabel = () => {
    switch(dateRange) {
      case '7days': return '۷ روز گذشته';
      case '30days': return '۳۰ روز گذشته';
      case '3months': return '۳ ماه گذشته';
    }
  };

  // Sync Logic
  const handleDateConfirm = (range: '7days' | '30days' | '3months') => {
    setDateRange(range);
    setIsDropdownOpen(false);
    
    // Update Stats Data with simulated visual changes
    setStatsData(getMockStats(range, brandColor));

    // Update Chart View Logic (simple assumption for mock)
    if (range === '7days') {
      setChartView('daily');
    } else {
      setChartView('weekly');
    }
  };

  const handleDownloadReport = () => {
    setIsGeneratingReport(true);
    setTimeout(() => {
      // 1. Prepare CSV Content
      const headers = ['Metric', 'Value', 'Unit', 'Trend'];
      const rows = statsData.map(s => [s.label, s.value, s.unit, s.trend]);
      
      const chartHeaders = ['Day/Time', 'Revenue'];
      const chartRows = (chartView === 'weekly' ? WEEKLY_DATA : DAILY_DATA).map(d => [d.name, d.revenue]);

      let csvContent = "data:text/csv;charset=utf-8,\uFEFF"; // BOM for Excel
      
      csvContent += "--- SUMMARY STATISTICS ---\n";
      csvContent += headers.join(",") + "\n";
      rows.forEach(r => csvContent += r.join(",") + "\n");
      
      csvContent += "\n--- SALES DATA ---\n";
      csvContent += chartHeaders.join(",") + "\n";
      chartRows.forEach(r => csvContent += r.join(",") + "\n");

      // 2. Create Download Link
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      link.setAttribute("download", "dashboard-report.csv");
      document.body.appendChild(link);
      
      // 3. Trigger Download
      link.click();
      document.body.removeChild(link);
      
      setIsGeneratingReport(false);
    }, 1200); // 1.2s delay for visual feedback
  };

  // Determine chart color based on brandColor prop
  // Simple mapping since chart expects specific hex or valid color
  const chartColorMap: Record<string, string> = {
    emerald: '#10b981',
    blue: '#3b82f6',
    purple: '#a855f7',
    orange: '#f97316',
    red: '#ef4444',
    violet: '#8b5cf6',
    pink: '#ec4899',
    zinc: '#71717a',
    slate: '#64748b'
  };
  const chartHexColor = chartColorMap[brandColor] || '#10b981';

  return (
    <div className="p-8 h-full overflow-y-auto space-y-8 bg-[#F8FAFC] relative font-['Vazirmatn']" onClick={() => setIsDropdownOpen(false)}>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-slate-900">سلام، {restaurantName} 👋</h1>
          <p className="text-sm text-slate-400 mt-1">امروز تا الان وضعیت فروش شما فوق‌العاده بوده است!</p>
        </div>
        <div className="flex gap-4 relative">
          
          {/* DATE PICKER DROPDOWN */}
          <div className="relative">
            <button 
              onClick={(e) => { e.stopPropagation(); setIsDropdownOpen(!isDropdownOpen); }}
              className="px-4 py-2.5 bg-white border border-slate-200 rounded-xl flex items-center gap-2 text-xs font-bold text-slate-600 shadow-sm cursor-pointer hover:bg-slate-50 transition-colors min-w-[140px] justify-between"
            >
              <div className="flex items-center gap-2">
                 <CalendarIcon className={`w-4 h-4 text-${brandColor}-600`} /> 
                 <span>{getDateRangeLabel()}</span>
              </div>
              <ChevronDown className={`w-3 h-3 text-slate-400 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
            </button>
            <AnimatePresence>
               {isDropdownOpen && (
                  <motion.div 
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 5 }}
                    className="absolute top-full left-0 right-0 mt-2 bg-white border border-slate-100 rounded-xl shadow-xl overflow-hidden z-50"
                  >
                    <button onClick={() => handleDateConfirm('7days')} className={`w-full text-right px-4 py-2.5 text-xs font-bold text-slate-600 hover:bg-slate-50 hover:text-${brandColor}-600`}>۷ روز گذشته</button>
                    <button onClick={() => handleDateConfirm('30days')} className={`w-full text-right px-4 py-2.5 text-xs font-bold text-slate-600 hover:bg-slate-50 hover:text-${brandColor}-600`}>۳۰ روز گذشته</button>
                    <button onClick={() => handleDateConfirm('3months')} className={`w-full text-right px-4 py-2.5 text-xs font-bold text-slate-600 hover:bg-slate-50 hover:text-${brandColor}-600`}>۳ ماه گذشته</button>
                  </motion.div>
               )}
            </AnimatePresence>
          </div>

          {/* REPORT BUTTON */}
          <button 
            onClick={handleDownloadReport}
            disabled={isGeneratingReport}
            className={`px-6 py-2.5 bg-${brandColor}-600 text-white rounded-xl text-sm font-bold shadow-lg shadow-${brandColor}-100 hover:bg-${brandColor}-700 transition-all flex items-center gap-2 active:scale-95 disabled:opacity-80 disabled:cursor-not-allowed min-w-[160px] justify-center`}
          >
            {isGeneratingReport ? (
               <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  در حال ساخت...
               </>
            ) : (
               <>
                  <Download className="w-4 h-4" />
                  دریافت گزارش
               </>
            )}
          </button>
        </div>
      </div>

      {/* STATS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative z-0">
        {statsData.map((stat, index) => (
          <SummaryCard 
            key={stat.id} 
            {...stat} 
            index={index}
            onClick={() => setSelectedStatId(stat.id)} 
          />
        ))}
      </div>

      {/* EXPANDED STAT MODAL */}
      <AnimatePresence>
        {selectedStat && (
           <ExpandedCard stat={selectedStat} onClose={() => setSelectedStatId(null)} />
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white p-8 rounded-[2rem] shadow-sm border border-slate-100 flex flex-col">
          <div className="flex items-center justify-between mb-8"><h2 className="text-lg font-black text-slate-800">آمار فروش</h2><div className="flex gap-2 bg-slate-100 p-1 rounded-xl"><button onClick={() => setChartView('weekly')} className={`px-4 py-1.5 text-xs font-bold rounded-lg transition-all ${chartView === 'weekly' ? `bg-white shadow-sm text-${brandColor}-600` : 'text-slate-400 hover:text-slate-600'}`}>هفتگی</button><button onClick={() => setChartView('daily')} className={`px-4 py-1.5 text-xs font-bold rounded-lg transition-all ${chartView === 'daily' ? `bg-white shadow-sm text-${brandColor}-600` : 'text-slate-400 hover:text-slate-600'}`}>روزانه</button></div></div>
          <div className="h-80 w-full relative">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartView === 'weekly' ? WEEKLY_DATA : DAILY_DATA}>
                 <defs><linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor={chartHexColor} stopOpacity={0.2}/><stop offset="95%" stopColor={chartHexColor} stopOpacity={0}/></linearGradient></defs>
                 <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                 <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#94a3b8' }} dy={10} />
                 <YAxis axisLine={false} tickLine={false} width={60} tickFormatter={(value) => `${value / 1000000} م`} tick={{ fontSize: 11, fill: '#94a3b8' }} dx={-10} />
                 <Tooltip content={<CustomTooltip brandColor={brandColor} />} />
                 <Area type="monotone" dataKey="revenue" stroke={chartHexColor} strokeWidth={3} fillOpacity={1} fill="url(#colorRev)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-slate-100">
          <h2 className="text-lg font-black text-slate-800 mb-6">پرفروش‌ترین‌ها</h2>
          <div className="space-y-6">
            {filteredPopularProducts.slice(0, 4).map((prod, i) => (
              <div key={i} className="flex items-center justify-between group cursor-pointer hover:bg-slate-50 p-2 rounded-xl transition-colors -mx-2">
                 <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-2xl bg-${prod.color}-50 flex items-center justify-center text-${prod.color}-600 group-hover:scale-110 transition-transform`}>
                       <ShoppingBag className="w-6 h-6" />
                    </div>
                    <div>
                       <h4 className="text-sm font-bold text-slate-800">{prod.name}</h4>
                       <span className="text-[10px] font-medium text-slate-400">{prod.category}</span>
                    </div>
                 </div>
                 <div className="text-left">
                    <p className="text-sm font-black text-slate-700">{prod.price}</p>
                    <span className={`text-[10px] text-${brandColor}-500 font-bold`}>{prod.count} فروش</span>
                 </div>
              </div>
            ))}
          </div>
          <button 
             onClick={() => setShowAllProductsModal(true)}
             className="w-full mt-8 py-3 bg-slate-50 text-slate-500 text-xs font-bold rounded-xl flex items-center justify-center gap-2 hover:bg-slate-100 transition-colors"
          >
             مشاهده کل لیست <ChevronLeft className="w-4 h-4" />
          </button>
        </div>
      </div>

      <AllProductsModal 
         isOpen={showAllProductsModal} 
         onClose={() => setShowAllProductsModal(false)} 
         searchQuery={searchQuery}
         brandColor={brandColor}
      />
    </div>
  );
};

export default Dashboard;
