import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, Calendar, Download, ChevronDown, Activity, Star,
  MessageCircle, UserCheck, UserPlus, Smile, Meh, Frown, ThumbsUp,
  X, ChevronLeft, ArrowUpRight, ArrowDownRight, Send, Trash2,
  CornerDownRight, ShoppingBag, Filter, Check, BarChart2
} from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, 
  ResponsiveContainer, PieChart, Pie, Cell
} from 'recharts';

// --- TYPES & DATA ---
type DateRange = '7days' | '30days' | '1year';

const getSalesData = (range: DateRange) => {
  switch (range) {
    case '7days':
      return [
        { name: 'شنبه', newCustomers: 12, returning: 45 },
        { name: 'یکشنبه', newCustomers: 18, returning: 52 },
        { name: 'دوشنبه', newCustomers: 10, returning: 48 },
        { name: 'سه‌شنبه', newCustomers: 25, returning: 60 },
        { name: 'چهارشنبه', newCustomers: 20, returning: 55 },
        { name: 'پنج‌شنبه', newCustomers: 35, returning: 80 },
        { name: 'جمعه', newCustomers: 40, returning: 95 },
      ];
    case '30days':
      return [
        { name: 'هفته ۱', newCustomers: 85, returning: 210 },
        { name: 'هفته ۲', newCustomers: 95, returning: 240 },
        { name: 'هفته ۳', newCustomers: 70, returning: 200 },
        { name: 'هفته ۴', newCustomers: 110, returning: 280 },
      ];
    case '1year':
      return [
        { name: 'فروردین', newCustomers: 400, returning: 800 },
        { name: 'اردیبهشت', newCustomers: 450, returning: 850 },
        { name: 'خرداد', newCustomers: 500, returning: 900 },
        { name: 'تیر', newCustomers: 600, returning: 1100 },
        { name: 'مرداد', newCustomers: 550, returning: 1050 },
        { name: 'شهریور', newCustomers: 650, returning: 1200 },
        { name: 'مهر', newCustomers: 480, returning: 950 },
        { name: 'آبان', newCustomers: 510, returning: 980 },
        { name: 'آذر', newCustomers: 530, returning: 1000 },
        { name: 'دی', newCustomers: 580, returning: 1050 },
        { name: 'بهمن', newCustomers: 620, returning: 1150 },
        { name: 'اسفند', newCustomers: 800, returning: 1400 },
      ];
  }
};

const SATISFACTION_DATA = [
  { name: 'بسیار راضی (۵)', value: 65, color: '#10b981' }, 
  { name: 'راضی (۴)', value: 20, color: '#3b82f6' },
  { name: 'متوسط (۳)', value: 10, color: '#f59e0b' },
  { name: 'ناراضی (۱-۲)', value: 5, color: '#ef4444' },
];

const RECENT_REVIEWS = [
  { id: 1, user: 'علی م.', comment: 'کیفیت غذا عالی بود اما سرویس کمی کند انجام شد.', rating: 4, date: '۲ ساعت پیش', sentiment: 'neutral', replied: false },
  { id: 2, user: 'سارا ک.', comment: 'بهترین پیتزایی که تا حالا خوردم! نان سیر هم فوق‌العاده بود.', rating: 5, date: '۵ ساعت پیش', sentiment: 'positive', replied: false },
  { id: 3, user: 'رضا ن.', comment: 'متاسفانه غذا سرد به دستم رسید.', rating: 2, date: 'دیروز', sentiment: 'negative', replied: false },
  { id: 4, user: 'مریم س.', comment: 'برخورد پرسنل عالی بود.', rating: 5, date: 'دیروز', sentiment: 'positive', replied: true },
];

// --- ANALYTICS SPECIFIC STATS DATA ---
const getAnalyticsStats = (brandColor: string, reviewCount: number) => [
  { 
    id: 'satisfaction', 
    label: 'امتیاز رضایت', 
    value: '۴.۸/۵', 
    unit: `از ${reviewCount} نظر`, 
    trend: '+۰.۲', 
    up: true, 
    icon: Smile, 
    color: brandColor 
  },
  { 
    id: 'retention', 
    label: 'نرخ بازگشت', 
    value: '۶۸٪', 
    unit: 'وفاداری بالا', 
    trend: '+۵٪', 
    up: true, 
    icon: UserCheck, 
    color: 'blue' 
  },
  { 
    id: 'new_customers', 
    label: 'مشتریان جدید', 
    value: '۱۴۵', 
    unit: 'در بازه انتخابی', 
    trend: '-۲٪', 
    up: false, 
    icon: UserPlus, 
    color: 'purple' 
  },
  { 
    id: 'reviews', 
    label: 'مجموع نظرات', 
    value: reviewCount.toString(), 
    unit: 'نظر فعال', 
    trend: '+۱۲', 
    up: true, 
    icon: MessageCircle, 
    color: 'orange' 
  },
];

// --- SHARED UI COMPONENTS (DASHBOARD STYLE) ---

const SummaryCard = ({ id, label, value, unit, trend, up, icon: Icon, color, onClick, index }: any) => {
  const colorStyles: any = {
    emerald: { bg: 'bg-emerald-50', text: 'text-emerald-600' },
    blue: { bg: 'bg-blue-50', text: 'text-blue-600' },
    purple: { bg: 'bg-purple-50', text: 'text-purple-600' },
    orange: { bg: 'bg-orange-50', text: 'text-orange-600' },
    // Handle brandColor if it's passed as a hex or specific string
  };

  const theme = colorStyles[color] || { bg: 'bg-slate-50', text: 'text-slate-600' };

  return (
    <motion.div 
      layoutId={`card-container-${id}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, type: "spring", stiffness: 200, damping: 20 }}
      onClick={onClick}
      whileHover={{ scale: 1.02, y: -2 }}
      className="bg-white/90 backdrop-blur-md border border-slate-100 p-6 rounded-[2rem] shadow-sm hover:shadow-md transition-all cursor-pointer group h-[180px] flex flex-col justify-between relative overflow-hidden"
    >
      <div className="flex items-start justify-between">
         <div className={`p-2.5 rounded-2xl ${theme.bg} ${theme.text} transition-transform group-hover:scale-110 shadow-sm`}>
            <Icon className="w-6 h-6" />
         </div>
         <span className="text-xs font-bold text-slate-500 mt-1.5">{label}</span>
      </div>

      <div className="flex flex-col items-center justify-center flex-1 py-2">
         <motion.h3 layoutId={`value-${id}`} className="text-4xl font-black text-slate-900 tracking-tight">
           {value}
         </motion.h3>
      </div>

      <div className="flex items-center justify-between gap-4">
         <div className={`flex items-center gap-1.5 text-[10px] font-black px-3 py-1.5 rounded-full border ${up ? 'text-emerald-600 bg-emerald-50 border-emerald-100' : 'text-rose-600 bg-rose-50 border-rose-100'}`}>
            {up ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
            {trend}
         </div>
         <span className="text-[10px] text-slate-400 font-bold bg-slate-50 border border-slate-100 px-3 py-1.5 rounded-full">
           {unit}
         </span>
      </div>
      <div className={`absolute -right-12 -bottom-12 w-32 h-32 bg-slate-500/5 blur-[60px] rounded-full group-hover:bg-slate-500/10 transition-colors pointer-events-none`} />
    </motion.div>
  );
};

const ExpandedCard = ({ stat, onClose, children }: any) => {
  const Icon = stat.icon;
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
          layoutId={`card-container-${stat.id}`}
          className="bg-white w-full max-w-lg rounded-[2rem] shadow-2xl relative overflow-hidden border border-slate-100 flex flex-col pointer-events-auto max-h-[85vh]"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="p-6 overflow-y-auto">
             <div className="flex items-center justify-between mb-8">
                 <div className="flex items-center gap-3">
                    <div className="p-3.5 rounded-2xl bg-slate-50 text-slate-600 shadow-sm">
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-lg font-black text-slate-700">{stat.label}</span>
                 </div>
                 <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-400">
                    <X className="w-5 h-5" />
                 </button>
             </div>
             {children}
          </div>
        </motion.div>
      </div>
    </>
  );
};

// --- MAIN COMPONENT ---

const Analytics: React.FC<{ brandColor: string }> = ({ brandColor }) => {
  const [dateRange, setDateRange] = useState<DateRange>('7days');
  const [selectedStatId, setSelectedStatId] = useState<string | null>(null);
  const [reviewsList, setReviewsList] = useState(RECENT_REVIEWS);
  const [replyingId, setReplyingId] = useState<number | null>(null);
  const [replyText, setReplyText] = useState("");

  const stats = useMemo(() => getAnalyticsStats(brandColor, reviewsList.length), [brandColor, reviewsList.length]);
  const selectedStat = stats.find(s => s.id === selectedStatId);
  const chartData = useMemo(() => getSalesData(dateRange), [dateRange]);

  const handleReplySubmit = (id: number) => {
    setReviewsList(prev => prev.map(r => r.id === id ? { ...r, replied: true } : r));
    setReplyingId(null);
    setReplyText("");
  };

  return (
    <div className="flex flex-col h-full bg-[#F8FAFC] font-['Vazirmatn'] overflow-y-auto">
      
      {/* HEADER */}
      <div className="p-8 border-b border-slate-200 bg-white sticky top-0 z-30 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-slate-900 flex items-center gap-3">
            <Users className="w-6 h-6 text-emerald-600" />
            تحلیل مشتریان
          </h1>
          <p className="text-sm text-slate-400 mt-1">شناخت رفتار مشتریان و بررسی کیفیت خدمات</p>
        </div>
        <button className="flex items-center gap-2 px-6 py-2.5 bg-emerald-600 text-white rounded-xl text-sm font-bold shadow-lg shadow-emerald-100 hover:bg-emerald-700 transition-all active:scale-95">
          <Download className="w-4 h-4" /> دریافت گزارش کامل
        </button>
      </div>

      <div className="p-8 space-y-8">
        
        {/* STATS GRID - Matches Dashboard exactly */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <SummaryCard 
              key={stat.id} 
              {...stat} 
              index={index} 
              onClick={() => setSelectedStatId(stat.id)} 
            />
          ))}
        </div>

        {/* MODAL SYSTEM - Matches Dashboard Expanded View */}
        <AnimatePresence>
          {selectedStat && (
            <ExpandedCard stat={selectedStat} onClose={() => setSelectedStatId(null)}>
               <div className="space-y-6">
                  <div className="flex flex-col items-center py-4">
                     <motion.h2 layoutId={`value-${selectedStat.id}`} className="text-5xl font-black text-slate-900">{selectedStat.value}</motion.h2>
                     <p className="text-sm text-slate-400 font-bold mt-2">{selectedStat.unit}</p>
                  </div>
                  
                  {/* Reuse your existing review/customer list logic here inside the modal */}
                  <div className="bg-slate-50 rounded-[1.5rem] p-4 border border-slate-100">
                     <h4 className="text-xs font-black text-slate-400 mb-4 uppercase tracking-widest flex items-center gap-2">
                        <BarChart2 className="w-3 h-3" /> جزئیات آماری
                     </h4>
                     {/* Placeholder for list content - Add your renderPopupContent logic here */}
                     <p className="text-xs text-slate-500 text-center py-10 italic">لیست جزئیات در حال بارگذاری...</p>
                  </div>
               </div>
            </ExpandedCard>
          )}
        </AnimatePresence>

        {/* CHARTS SECTION */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 bg-white p-8 rounded-[2rem] shadow-sm border border-slate-100">
             <h2 className="text-lg font-black text-slate-800 mb-8 flex items-center gap-2">
                <Activity className="w-5 h-5 text-emerald-500" /> روند بازگشت مشتریان
             </h2>
             <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                   <BarChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                      <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#94a3b8' }} dy={10} />
                      <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#94a3b8' }} dx={-10} />
                      <Tooltip />
                      <Bar dataKey="returning" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="newCustomers" fill="#10b981" radius={[4, 4, 0, 0]} />
                   </BarChart>
                </ResponsiveContainer>
             </div>
          </div>

          <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-slate-100 flex flex-col items-center justify-center">
             <h2 className="text-lg font-black text-slate-800 mb-4">رضایتمندی کل</h2>
             <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                   <PieChart>
                      <Pie data={SATISFACTION_DATA} innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                         {SATISFACTION_DATA.map((entry, index) => <Cell key={index} fill={entry.color} />)}
                      </Pie>
                      <Tooltip />
                   </PieChart>
                </ResponsiveContainer>
             </div>
             <div className="text-center">
                <p className="text-3xl font-black text-slate-800">۸۵٪</p>
                <p className="text-xs text-slate-400 font-bold">تجربه مثبت</p>
             </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Analytics;