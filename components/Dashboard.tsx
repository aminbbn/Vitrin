
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
  { name: 'شنبه', revenue: 120 },
  { name: 'یکشنبه', revenue: 180 },
  { name: 'دوشنبه', revenue: 340 },
  { name: 'سه‌شنبه', revenue: 290 },
  { name: 'چهارشنبه', revenue: 420 },
  { name: 'پنج‌شنبه', revenue: 490 },
  { name: 'جمعه', revenue: 650 },
];

const DAILY_DATA = [
  { name: '10:00', revenue: 15 },
  { name: '12:00', revenue: 45 },
  { name: '14:00', revenue: 85 },
  { name: '16:00', revenue: 50 },
  { name: '18:00', revenue: 110 },
  { name: '20:00', revenue: 210 },
  { name: '22:00', revenue: 135 },
];

const MOCK_POPULAR_PRODUCTS = [
  { name: 'پیتزا پپرونی', category: 'پیتزا', price: '245,000', count: 128, color: 'emerald' },
  { name: 'چیزبرگر مخصوص', category: 'همبرگر', price: '165,000', count: 95, color: 'blue' },
  { name: 'سالاد سزار', category: 'سالاد', price: '120,000', count: 84, color: 'purple' },
  { name: 'سیب‌زمینی ویژه', category: 'پیش‌غذا', price: '85,000', count: 76, color: 'orange' },
  { name: 'پاستا آلفردو', category: 'پاستا', price: '190,000', count: 65, color: 'emerald' },
  { name: 'نوشابه کوکا', category: 'نوشیدنی', price: '25,000', count: 210, color: 'red' },
  { name: 'نان سیر', category: 'پیش‌غذا', price: '65,000', count: 45, color: 'orange' },
];

// Helper to generate mock stats based on range
const getMockStats = (range: string, brandColor: string) => {
  const baseStats = [
    { 
      id: 'views', 
      label: 'بازدید منوی دیجیتال', 
      value: '2,490', 
      unit: 'بار بازدید', 
      trend: '+12%', 
      up: true, 
      icon: TrendingUp, 
      color: brandColor,
      insights: [
        { label: 'بازدیدکننده یکتا', value: '820 نفر' },
        { label: 'نرخ کلیک محصولات', value: '45%' },
        { label: 'اشتراک‌گذاری منو', value: '32 بار' }
      ]
    },
    { 
      id: 'products', 
      label: 'محصولات فعال', 
      value: '24', 
      unit: 'غذا و نوشیدنی', 
      trend: '+2', 
      up: true, 
      icon: ShoppingBag, 
      color: 'blue',
      insights: [
         { label: 'غذاهای اصلی', value: '18' },
         { label: 'نوشیدنی‌ها', value: '4' },
         { label: 'پیش‌غذا و دسر', value: '2' }
      ]
    },
    { 
      id: 'categories', 
      label: 'دسته‌بندی‌ها', 
      value: '6', 
      unit: 'دسته اصلی', 
      trend: 'ثابت', 
      up: true, 
      icon: BarChart2, 
      color: 'purple',
      insights: [
         { label: 'دسته‌های فعال', value: '6' },
         { label: 'دسته‌های پنهان', value: '0' }
      ]
    },
    { 
      id: 'status', 
      label: 'وضعیت منوی لایو', 
      value: 'منتشر شده', 
      unit: 'آماده نمایش', 
      trend: 'عالی', 
      up: true, 
      icon: Clock, 
      color: 'orange',
      insights: [
         { label: 'آخرین ویرایش', value: '۱۰ دقیقه پیش' },
         { label: 'نسخه فعال منو', value: 'v2.4' }
      ]
    },
  ];

  if (range === '24h' || range === '24 ساعت گذشته') {
    return baseStats.map(s => {
      if (s.id === 'views') return { ...s, value: '380', trend: '+2%' };
      return s;
    });
  }
  if (range === '30days' || range === '30 روز گذشته') {
    return baseStats.map(s => {
      if (s.id === 'views') return { ...s, value: '12,400', trend: '+15%' };
      return s;
    });
  }
  
  // Default 7 days
  return baseStats;
};

const CustomTooltip = ({ active, payload, label, brandColor }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 p-4 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-slate-200 dark:border-slate-800 text-xs z-[100] relative">
        <p className="font-bold mb-2 text-slate-500 dark:text-slate-400">{label}</p>
        <div className="flex items-center gap-2 mb-1">
          <div className={`w-2 h-2 rounded-full bg-${brandColor}-500`} />
          <span className={`text-${brandColor}-600 dark:text-${brandColor}-400 font-black text-sm`}>{payload[0].value.toLocaleString()} بازدید</span>
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
  theme?: 'light' | 'dark';
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
  const theme = { 
    bg: `bg-${color}-50 dark:bg-${color}-950/30`, 
    text: `text-${color}-600 dark:text-${color}-400`, 
    border: `border-${color}-200 dark:border-${color}-850` 
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, type: "spring", stiffness: 200, damping: 20 }}
      onClick={onClick}
      whileHover={{ scale: 1.02, y: -2 }}
      className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border border-slate-100 dark:border-slate-800 p-6 rounded-[2rem] shadow-sm hover:shadow-md transition-all cursor-pointer group h-[180px] flex flex-col justify-between relative overflow-hidden"
    >
      {/* Header */}
      <div className="flex items-start justify-between">
         <div className={`p-2.5 rounded-2xl ${theme.bg} ${theme.text} transition-transform group-hover:scale-110 shadow-sm`}>
            <Icon className="w-6 h-6" />
         </div>
         <span className="text-xs font-bold text-slate-500 dark:text-slate-400 mt-1.5">{label}</span>
      </div>

      {/* Main Metric */}
      <div className="flex flex-col items-center justify-center flex-1 py-2">
         <h3 className="text-4xl font-black text-slate-900 dark:text-slate-100 tracking-tight">
            {value}
         </h3>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between gap-4">
         <div className={`flex items-center gap-1.5 text-[10px] font-black px-3 py-1.5 rounded-full border ${up ? `text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/30 border-emerald-100 dark:border-emerald-900/40` : 'text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/30 border-rose-100 dark:border-rose-900/40'}`}>
            {up ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
            {trend}
         </div>
         <span className="text-[10px] text-slate-400 dark:text-slate-500 font-bold bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-800 px-3 py-1.5 rounded-full">
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
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[200] flex items-center justify-center p-4 overflow-y-auto"
    >
      <motion.div 
        initial={{ opacity: 0, backdropFilter: "blur(0px)" }}
        animate={{ opacity: 1, backdropFilter: "blur(24px)" }}
        exit={{ opacity: 0, backdropFilter: "blur(0px)" }}
        transition={{ duration: 0.3 }}
        onClick={onClose}
        className="fixed inset-0 bg-slate-950/80 backdrop-blur-xl"
      />
      
      <motion.div 
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 20 }}
        transition={{ type: "spring", stiffness: 300, damping: 25 }}
        className="bg-white dark:bg-slate-900 w-full max-w-sm rounded-[1.5rem] shadow-2xl relative overflow-hidden border border-slate-100 dark:border-slate-800 flex flex-col z-10 transition-colors"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6 relative">
           <div className="flex items-center justify-between mb-8">
               <div className="flex items-center gap-3">
                  <div className={`p-3.5 rounded-2xl bg-${color}-50 dark:bg-${color}-950/30 text-${color}-600 dark:text-${color}-400 shadow-sm`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <span className="text-lg font-black text-slate-700 dark:text-slate-200">{stat.label}</span>
               </div>
               <button onClick={onClose} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors text-slate-400">
                  <X className="w-5 h-5" />
               </button>
           </div>

           <div className="flex flex-col items-start mb-8">
               <motion.h2 
                 initial={{ opacity: 0, y: 10 }}
                 animate={{ opacity: 1, y: 0 }}
                 transition={{ delay: 0.1 }}
                 className="text-5xl font-black text-slate-900 dark:text-slate-100 tracking-tight"
               >
                 {stat.value}
               </motion.h2>
               <div className="flex items-center gap-3 mt-3">
                  <span className={`text-xs font-black px-3 py-1.5 rounded-full flex items-center gap-1.5 border ${stat.up ? 'bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400 border-emerald-100 dark:border-emerald-850' : 'bg-rose-50 dark:bg-rose-950/30 text-rose-600 dark:text-rose-400 border-rose-100 dark:border-rose-850'}`}>
                      {stat.up ? <ArrowUpRight className="w-3.5 h-3.5" /> : <ArrowDownRight className="w-3.5 h-3.5" />}
                      {stat.trend}
                  </span>
                  <span className="text-xs text-slate-500 dark:text-slate-400 font-bold bg-slate-50 dark:bg-slate-800 px-3 py-1.5 rounded-full border border-slate-100 dark:border-slate-800">{stat.unit}</span>
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
                      className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-800/60 hover:border-slate-200 dark:hover:border-slate-700 transition-colors"
                    >
                       <span className="text-xs font-bold text-slate-600 dark:text-slate-400">{detail.label}</span>
                       <span className="text-sm font-black text-slate-800 dark:text-slate-200">{detail.value}</span>
                    </motion.div>
                 ))}
              </div>
           </div>
           
           <div className="h-6" />
        </div>
      </motion.div>
    </motion.div>
  );
};

// --- ALL PRODUCTS MODAL ---
const AllProductsModal = ({ isOpen, onClose, brandColor }: any) => {
  const [localSearch, setLocalSearch] = useState('');
  
  const query = localSearch;

  const filteredProducts = MOCK_POPULAR_PRODUCTS.filter(p => 
    p.name.includes(query) || p.category.includes(query)
  );

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[200] flex items-center justify-center p-4"
        >
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-950/80 backdrop-blur-xl"
          />
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="bg-white w-full max-w-4xl rounded-[2.5rem] shadow-2xl relative z-10 overflow-hidden flex flex-col max-h-[85vh]"
            onClick={(e) => e.stopPropagation()}
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
                        value={localSearch}
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
                           <th className="px-6 py-4 text-xs font-black text-slate-500">تعداد بازدید</th>
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
        </motion.div>
      )}
    </AnimatePresence>
  );
};


const Dashboard: React.FC<DashboardProps> = ({ restaurantName, searchQuery = '', brandColor, theme }) => {
  const [isDark, setIsDark] = useState(() => theme === 'dark' || document.documentElement.classList.contains('dark'));

  React.useEffect(() => {
    setIsDark(theme === 'dark' || document.documentElement.classList.contains('dark'));
  }, [theme]);

  React.useEffect(() => {
    const checkDark = () => {
      setIsDark(document.documentElement.classList.contains('dark') || localStorage.getItem('vitrin_theme') === 'dark');
    };
    checkDark();
    const observer = new MutationObserver(checkDark);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    return () => observer.disconnect();
  }, []);

  const [dateRange, setDateRange] = useState<'24h' | '7days' | '30days'>('7days');
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
  
  // Filter popular products (dashboard popular products should show all by default, not filter by header search)
  const filteredPopularProducts = MOCK_POPULAR_PRODUCTS;

  const getDateRangeLabel = () => {
    switch(dateRange) {
      case '24h': return '24 ساعت گذشته';
      case '7days': return '7 روز گذشته';
      case '30days': return '30 روز گذشته';
    }
  };

  // Sync Logic
  const handleDateConfirm = (range: '24h' | '7days' | '30days') => {
    setDateRange(range);
    setIsDropdownOpen(false);
    
    // Update Stats Data with simulated visual changes
    setStatsData(getMockStats(range, brandColor));

    // Update Chart View Logic
    if (range === '24h') {
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
      
      const chartHeaders = ['Day/Time', 'Views'];
      const chartRows = (chartView === 'weekly' ? WEEKLY_DATA : DAILY_DATA).map(d => [d.name, d.revenue]);

      let csvContent = "data:text/csv;charset=utf-8,\uFEFF"; // BOM for Excel
      
      csvContent += "--- SUMMARY STATISTICS ---\n";
      csvContent += headers.join(",") + "\n";
      rows.forEach(r => csvContent += r.join(",") + "\n");
      
      csvContent += "\n--- VIEWS DATA ---\n";
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
    <div className="p-8 h-full overflow-y-auto space-y-8 bg-[#F8FAFC] dark:bg-slate-950 text-slate-900 dark:text-slate-100 relative font-['Vazirmatn'] transition-colors" onClick={() => setIsDropdownOpen(false)}>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-slate-100">سلام، {restaurantName} 👋</h1>
          <p className="text-sm text-slate-400 mt-1">امروز تا الان وضعیت فروش شما فوق‌العاده بوده است!</p>
        </div>
        <div className="flex gap-4 relative">
          
          {/* DATE PICKER DROPDOWN */}
          <div className="relative">
            <button 
              onClick={(e) => { e.stopPropagation(); setIsDropdownOpen(!isDropdownOpen); }}
              className="px-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl flex items-center gap-2 text-xs font-bold text-slate-600 dark:text-slate-300 shadow-sm cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors min-w-[140px] justify-between"
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
                    className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-xl shadow-xl overflow-hidden z-50"
                  >
                    <button onClick={() => handleDateConfirm('24h')} className={`w-full text-right px-4 py-2.5 text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-${brandColor}-600`}>24 ساعت گذشته</button>
                    <button onClick={() => handleDateConfirm('7days')} className={`w-full text-right px-4 py-2.5 text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-${brandColor}-600`}>7 روز گذشته</button>
                    <button onClick={() => handleDateConfirm('30days')} className={`w-full text-right px-4 py-2.5 text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-${brandColor}-600`}>30 روز گذشته</button>
                  </motion.div>
               )}
            </AnimatePresence>
          </div>

          {/* REPORT BUTTON */}
          <button 
            onClick={handleDownloadReport}
            disabled={isGeneratingReport}
            className={`px-6 py-2.5 bg-${brandColor}-600 text-white rounded-xl text-sm font-bold shadow-lg shadow-${brandColor}-100 dark:shadow-none hover:bg-${brandColor}-700 transition-all flex items-center gap-2 active:scale-95 disabled:opacity-80 disabled:cursor-not-allowed min-w-[160px] justify-center`}
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
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 p-8 rounded-[2rem] shadow-sm border border-slate-100 dark:border-slate-800 flex flex-col transition-colors">
          <div className="flex items-center justify-between mb-8"><h2 className="text-lg font-black text-slate-800 dark:text-slate-100">آمار بازدید منو</h2><div className="flex gap-2 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl"><button onClick={() => setChartView('weekly')} className={`px-4 py-1.5 text-xs font-bold rounded-lg transition-all ${chartView === 'weekly' ? `bg-white dark:bg-slate-900 shadow-sm text-${brandColor}-600 dark:text-${brandColor}-400` : 'text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300'}`}>هفتگی</button><button onClick={() => setChartView('daily')} className={`px-4 py-1.5 text-xs font-bold rounded-lg transition-all ${chartView === 'daily' ? `bg-white dark:bg-slate-900 shadow-sm text-${brandColor}-600 dark:text-${brandColor}-400` : 'text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300'}`}>روزانه</button></div></div>
          <div className="h-80 w-full relative">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartView === 'weekly' ? WEEKLY_DATA : DAILY_DATA}>
                 <defs><linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor={chartHexColor} stopOpacity={0.2}/><stop offset="95%" stopColor={chartHexColor} stopOpacity={0}/></linearGradient></defs>
                 <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={isDark ? '#26262b' : '#f1f5f9'} />
                 <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#94a3b8' }} dy={10} />
                 <YAxis axisLine={false} tickLine={false} width={60} tickFormatter={(value) => value} tick={{ fontSize: 11, fill: '#94a3b8' }} dx={-10} />
                 <Tooltip 
                    cursor={{ stroke: isDark ? '#26262b' : '#e2e8f0', strokeWidth: 1, strokeDasharray: '4 4' }}
                    content={<CustomTooltip brandColor={brandColor} />} 
                    wrapperStyle={{ zIndex: 1000 }} 
                 />
                 <Area type="monotone" dataKey="revenue" stroke={chartHexColor} strokeWidth={3} fillOpacity={1} fill="url(#colorRev)" />
               </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="bg-white dark:bg-slate-900 p-8 rounded-[2rem] shadow-sm border border-slate-100 dark:border-slate-800 transition-colors">
          <h2 className="text-lg font-black text-slate-800 dark:text-slate-100 mb-6">محبوب‌ترین محصولات</h2>
          <div className="space-y-6">
            {filteredPopularProducts.slice(0, 4).map((prod, i) => (
              <div key={i} className="flex items-center justify-between group cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/40 p-2 rounded-xl transition-colors -mx-2">
                 <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-2xl bg-${prod.color}-50 dark:bg-${prod.color}-950/30 flex items-center justify-center text-${prod.color}-600 dark:text-${prod.color}-400 group-hover:scale-110 transition-transform`}>
                       <ShoppingBag className="w-6 h-6" />
                    </div>
                    <div>
                       <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200">{prod.name}</h4>
                       <span className="text-[10px] font-medium text-slate-400 dark:text-slate-500">{prod.category}</span>
                    </div>
                 </div>
                 <div className="text-left">
                    <p className="text-sm font-black text-slate-700 dark:text-slate-300">{prod.price}</p>
                    <span className={`text-[10px] text-${brandColor}-500 font-bold`}>{prod.count} بازدید</span>
                 </div>
              </div>
            ))}
          </div>
          <button 
             onClick={() => setShowAllProductsModal(true)}
             className="w-full mt-8 py-3 bg-slate-50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 text-xs font-bold rounded-xl flex items-center justify-center gap-2 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
             مشاهده کل لیست <ChevronLeft className="w-4 h-4" />
          </button>
        </div>
      </div>

      <AllProductsModal 
         isOpen={showAllProductsModal} 
         onClose={() => setShowAllProductsModal(false)} 
         brandColor={brandColor}
      />
    </div>
  );
};

export default Dashboard;
