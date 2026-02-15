
import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, 
  Calendar, 
  Download, 
  ChevronDown, 
  Activity,
  Star,
  MessageCircle,
  UserCheck,
  UserPlus,
  Smile,
  Meh,
  Frown,
  ThumbsUp,
  X,
  ChevronLeft,
  ArrowUpRight,
  ArrowDownRight,
  Send,
  Trash2,
  CornerDownRight,
  ShoppingBag,
  Filter
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell
} from 'recharts';

// --- TYPES ---
type DateRange = '7days' | '30days' | '1year';

// --- ANIMATION CONFIG ---
const SPRING_TRANSITION = { type: "spring" as const, stiffness: 350, damping: 30 };

// --- MOCK DATA ---

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

const TOP_RATED_PRODUCTS = [
  { id: 1, name: 'پیتزا پپرونی', rating: 4.8, reviews: 145, positive: 98, category: 'پیتزا', price: 245000, sold: 1200 },
  { id: 2, name: 'استیک ریب‌آی', rating: 4.7, reviews: 89, positive: 95, category: 'غذای اصلی', price: 450000, sold: 450 },
  { id: 3, name: 'موخیتو طبیعی', rating: 4.6, reviews: 210, positive: 92, category: 'نوشیدنی', price: 45000, sold: 2100 },
  { id: 4, name: 'برگر ذغالی', rating: 4.5, reviews: 112, positive: 88, category: 'برگر', price: 185000, sold: 850 },
  { id: 5, name: 'سالاد سزار', rating: 4.4, reviews: 95, positive: 85, category: 'سالاد', price: 120000, sold: 620 },
  { id: 6, name: 'پاستا آلفردو', rating: 4.3, reviews: 78, positive: 82, category: 'پاستا', price: 195000, sold: 540 },
  { id: 7, name: 'سیب‌زمینی ویژه', rating: 4.8, reviews: 320, positive: 96, category: 'پیش‌غذا', price: 85000, sold: 3500 },
];

const RECENT_REVIEWS = [
  { id: 1, user: 'علی م.', comment: 'کیفیت غذا عالی بود اما سرویس کمی کند انجام شد.', rating: 4, date: '۲ ساعت پیش', sentiment: 'neutral', replied: false },
  { id: 2, user: 'سارا ک.', comment: 'بهترین پیتزایی که تا حالا خوردم! نان سیر هم فوق‌العاده بود.', rating: 5, date: '۵ ساعت پیش', sentiment: 'positive', replied: false },
  { id: 3, user: 'رضا ن.', comment: 'متاسفانه غذا سرد به دستم رسید.', rating: 2, date: 'دیروز', sentiment: 'negative', replied: false },
  { id: 4, user: 'مریم س.', comment: 'برخورد پرسنل عالی بود.', rating: 5, date: 'دیروز', sentiment: 'positive', replied: true },
];

const CUSTOMER_LIST = [
  { id: 1, name: 'محمد رضایی', type: 'loyal', visits: 15, lastOrder: '۲ روز پیش' },
  { id: 2, name: 'سارا احمدی', type: 'new', visits: 1, lastOrder: '۱ ساعت پیش' },
  { id: 3, name: 'علی کمالی', type: 'loyal', visits: 24, lastOrder: '۳ روز پیش' },
  { id: 4, name: 'زهرا حسینی', type: 'new', visits: 2, lastOrder: '۵ ساعت پیش' },
];

// --- COMPONENTS ---

const StatCard = ({ id, title, value, subtext, trend, up, icon: Icon, color, onClick, selected }: any) => (
  <motion.div 
    layoutId={`container-${id}`}
    onClick={onClick}
    className={`bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm relative overflow-hidden group cursor-pointer transition-colors ${selected ? 'ring-4 ring-emerald-500/10 border-emerald-500' : 'hover:border-emerald-200'}`}
    whileHover={{ y: -5 }}
    transition={SPRING_TRANSITION}
  >
    <motion.div animate={{ opacity: selected ? 0 : 1 }}>
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-2xl bg-${color}-50 text-${color}-600 group-hover:scale-110 transition-transform`}>
          <Icon className="w-6 h-6" />
        </div>
        {trend && (
           <div className={`flex items-center gap-1 text-xs font-black ${up ? 'text-emerald-500' : 'text-red-500'}`}>
             {trend}
             {up ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
           </div>
        )}
      </div>
      
      <div className="relative z-10">
        <h3 className="text-slate-400 text-sm font-bold mb-1">{title}</h3>
        <div className="flex items-baseline gap-2">
           <p className="text-2xl font-black text-slate-900">{value}</p>
           {subtext && <span className="text-[10px] text-slate-400 font-bold">{subtext}</span>}
        </div>
      </div>
    </motion.div>
  </motion.div>
);

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-slate-900 text-white p-4 rounded-xl shadow-xl border border-white/10 text-xs">
        <p className="font-bold mb-2 text-slate-400">{label}</p>
        <div className="space-y-1">
          {payload.map((entry: any, idx: number) => (
            <div key={idx} className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }} />
              <span className="font-medium">
                {entry.name === 'newCustomers' ? 'مشتریان جدید:' : 'مشتریان وفادار:'}
              </span>
              <span className="font-black">
                {entry.value.toLocaleString()} نفر
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  }
  return null;
};

const Analytics: React.FC = () => {
  const [dateRange, setDateRange] = useState<DateRange>('7days');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [hoveredPie, setHoveredPie] = useState<number | null>(null);
  const [selectedStat, setSelectedStat] = useState<string | null>(null);
  
  // Reviews Logic
  const [reviewsList, setReviewsList] = useState(RECENT_REVIEWS);
  const [replyingId, setReplyingId] = useState<number | null>(null);
  const [replyText, setReplyText] = useState("");

  // Product Modal
  const [showAllProducts, setShowAllProducts] = useState(false);

  const data = useMemo(() => getSalesData(dateRange), [dateRange]);

  const getDateRangeLabel = () => {
    switch(dateRange) {
      case '7days': return '۷ روز گذشته';
      case '30days': return '۳۰ روز گذشته';
      case '1year': return '۱۲ ماه گذشته';
    }
  };

  const handleDownloadCSV = () => {
    const headers = ['Period', 'New Customers', 'Returning Customers'];
    const rows = data.map(item => [item.name, item.newCustomers, item.returning]);
    const csvContent = [headers.join(','), ...rows.map(row => row.join(','))].join('\n');
    const blob = new Blob([`\uFEFF${csvContent}`], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `vitrin_report_${dateRange}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Review Actions
  const handleIgnoreReview = (id: number) => {
    setReviewsList(prev => prev.filter(r => r.id !== id));
  };

  const handleReplySubmit = (id: number) => {
    if (!replyText.trim()) return;
    setReviewsList(prev => prev.map(r => r.id === id ? { ...r, replied: true } : r));
    setReplyingId(null);
    setReplyText("");
  };

  const renderPopupContent = () => {
     switch(selectedStat) {
        case 'satisfaction':
           return (
              <div className="space-y-4">
                 {reviewsList.filter(r => r.rating >= 4).map((review) => (
                    <div key={review.id} className="bg-slate-50 p-4 rounded-2xl border border-slate-100 flex items-start gap-3">
                       <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 font-bold text-xs shrink-0">
                          {review.user.charAt(0)}
                       </div>
                       <div>
                          <div className="flex items-center gap-2 mb-1">
                             <h4 className="font-bold text-slate-800 text-sm">{review.user}</h4>
                             <div className="flex text-yellow-400">
                                {[...Array(5)].map((_, i) => (
                                   <Star key={i} className={`w-3 h-3 ${i < review.rating ? 'fill-current' : 'text-slate-200'}`} />
                                ))}
                             </div>
                          </div>
                          <p className="text-xs text-slate-600">{review.comment}</p>
                       </div>
                    </div>
                 ))}
                 {reviewsList.filter(r => r.rating >= 4).length === 0 && (
                   <div className="text-center text-slate-400 text-xs py-4">هیچ نظر مثبتی یافت نشد.</div>
                 )}
              </div>
           );
        case 'retention':
        case 'new_customers':
           const filteredCustomers = selectedStat === 'new_customers' ? CUSTOMER_LIST.filter(c => c.type === 'new') : CUSTOMER_LIST.filter(c => c.type === 'loyal');
           return (
              <div className="space-y-2">
                 {filteredCustomers.map((cust) => (
                    <div key={cust.id} className="flex items-center justify-between p-3 hover:bg-slate-50 rounded-xl transition-colors border border-transparent hover:border-slate-100">
                       <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${cust.type === 'new' ? 'bg-emerald-100 text-emerald-600' : 'bg-blue-100 text-blue-600'}`}>
                             {cust.type === 'new' ? <UserPlus className="w-5 h-5" /> : <UserCheck className="w-5 h-5" />}
                          </div>
                          <div>
                             <h4 className="font-bold text-slate-800 text-sm">{cust.name}</h4>
                             <span className="text-[10px] text-slate-400">آخرین سفارش: {cust.lastOrder}</span>
                          </div>
                       </div>
                       <div className="text-right">
                          <span className="block text-xs font-black text-slate-700">{cust.visits} بازدید</span>
                          <span className={`text-[10px] font-bold ${cust.type === 'new' ? 'text-emerald-500' : 'text-blue-500'}`}>
                             {cust.type === 'new' ? 'کاربر جدید' : 'وفادار'}
                          </span>
                       </div>
                    </div>
                 ))}
              </div>
           );
        case 'reviews':
           return (
              <div className="space-y-6">
                 {reviewsList.length === 0 ? (
                    <div className="text-center py-10 text-slate-400 text-sm">لیست نظرات خالی است</div>
                 ) : reviewsList.map((review) => (
                    <div key={review.id} className="border-b border-slate-100 last:border-0 pb-6 last:pb-0">
                       <div className="flex justify-between items-start mb-2">
                          <div className="flex items-center gap-2">
                             <div className="w-8 h-8 rounded-full bg-slate-100 text-slate-500 font-bold flex items-center justify-center text-xs">
                                {review.user.charAt(0)}
                             </div>
                             <div>
                                <span className="font-bold text-slate-800 text-sm block">{review.user}</span>
                                <span className="text-[10px] text-slate-400">{review.date}</span>
                             </div>
                          </div>
                          {review.replied && (
                             <span className="bg-emerald-50 text-emerald-600 text-[10px] px-2 py-0.5 rounded-full font-bold flex items-center gap-1">
                                <CheckLeft className="w-3 h-3" /> پاسخ داده شد
                             </span>
                          )}
                       </div>
                       
                       <p className="text-xs text-slate-600 mb-3 bg-slate-50 p-3 rounded-xl leading-relaxed">
                         {review.comment}
                       </p>

                       {replyingId === review.id ? (
                          <motion.div 
                             initial={{ opacity: 0, y: -10 }}
                             animate={{ opacity: 1, y: 0 }}
                             className="bg-slate-50 p-3 rounded-xl border border-slate-200"
                          >
                             <div className="flex items-center gap-2 mb-2 text-xs font-bold text-slate-500">
                                <CornerDownRight className="w-4 h-4" /> پاسخ شما:
                             </div>
                             <textarea 
                                autoFocus
                                value={replyText}
                                onChange={(e) => setReplyText(e.target.value)}
                                className="w-full bg-white border border-slate-200 rounded-lg p-2 text-xs outline-none focus:border-emerald-500 min-h-[60px] mb-2"
                                placeholder="پاسخ خود را بنویسید..."
                             />
                             <div className="flex justify-end gap-2">
                                <button 
                                   onClick={() => { setReplyingId(null); setReplyText(""); }}
                                   className="text-xs text-slate-500 hover:bg-slate-200 px-3 py-1.5 rounded-lg transition-colors"
                                >
                                   انصراف
                                </button>
                                <button 
                                   onClick={() => handleReplySubmit(review.id)}
                                   className="text-xs bg-emerald-600 text-white px-3 py-1.5 rounded-lg hover:bg-emerald-700 transition-colors flex items-center gap-1"
                                >
                                   <Send className="w-3 h-3" /> ارسال
                                </button>
                             </div>
                          </motion.div>
                       ) : (
                          <div className="flex gap-2">
                             <button 
                                onClick={() => { setReplyingId(review.id); setReplyText(""); }}
                                className="text-[10px] bg-slate-100 hover:bg-emerald-50 hover:text-emerald-600 text-slate-600 px-3 py-1.5 rounded-lg transition-colors font-bold flex items-center gap-1"
                             >
                                <CornerDownRight className="w-3 h-3" /> پاسخ دادن
                             </button>
                             <button 
                                onClick={() => handleIgnoreReview(review.id)}
                                className="text-[10px] text-slate-400 hover:bg-red-50 hover:text-red-500 px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1"
                             >
                                <Trash2 className="w-3 h-3" /> نادیده گرفتن
                             </button>
                          </div>
                       )}
                    </div>
                 ))}
              </div>
           );
        default: return null;
     }
  };

  return (
    <div className="flex flex-col h-full bg-slate-50 font-['Vazirmatn'] overflow-y-auto" onClick={() => setIsDropdownOpen(false)}>
      
      {/* HEADER */}
      <div className="p-8 border-b border-slate-200 bg-white sticky top-0 z-30 shadow-sm flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-slate-900 flex items-center gap-3">
            <Users className="w-6 h-6 text-emerald-600" />
            تحلیل مشتریان
          </h1>
          <p className="text-sm text-slate-400 mt-1">شناخت رفتار مشتریان و بررسی کیفیت خدمات</p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="relative">
            <button 
              onClick={(e) => { e.stopPropagation(); setIsDropdownOpen(!isDropdownOpen); }}
              className="flex items-center gap-2 px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-600 hover:bg-slate-100 transition-colors min-w-[140px] justify-between"
            >
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-slate-400" />
                <span>{getDateRangeLabel()}</span>
              </div>
              <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
            </button>
            
            <AnimatePresence>
              {isDropdownOpen && (
                <motion.div 
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 5 }}
                  className="absolute top-full left-0 right-0 mt-2 bg-white border border-slate-100 rounded-xl shadow-xl overflow-hidden z-50"
                >
                  <button onClick={() => setDateRange('7days')} className="w-full text-right px-4 py-2.5 text-xs font-bold text-slate-600 hover:bg-slate-50 hover:text-emerald-600">۷ روز گذشته</button>
                  <button onClick={() => setDateRange('30days')} className="w-full text-right px-4 py-2.5 text-xs font-bold text-slate-600 hover:bg-slate-50 hover:text-emerald-600">۳۰ روز گذشته</button>
                  <button onClick={() => setDateRange('1year')} className="w-full text-right px-4 py-2.5 text-xs font-bold text-slate-600 hover:bg-slate-50 hover:text-emerald-600">۱۲ ماه گذشته</button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          
          <button 
            onClick={handleDownloadCSV}
            className="flex items-center gap-2 px-4 py-2.5 bg-emerald-600 text-white rounded-xl text-sm font-bold hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-200 active:scale-95"
          >
            <Download className="w-4 h-4" />
            <span>خروجی CSV</span>
          </button>
        </div>
      </div>

      <div className="p-8 space-y-8 max-w-[1600px] mx-auto w-full">
        
        {/* KPI CARDS (ACTIONABLE) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative z-0">
          <StatCard 
            id="satisfaction"
            title="امتیاز رضایت" 
            value="۴.۸/۵" 
            subtext="از ۱۲۰ نظر" 
            trend="+۰.۲"
            up={true}
            icon={Smile} 
            color="emerald"
            onClick={() => setSelectedStat('satisfaction')}
            selected={selectedStat === 'satisfaction'}
          />
          <StatCard 
            id="retention"
            title="نرخ بازگشت" 
            value="۶۸٪" 
            subtext="وفاداری بالا" 
            trend="+۵٪"
            up={true}
            icon={UserCheck} 
            color="blue"
            onClick={() => setSelectedStat('retention')}
            selected={selectedStat === 'retention'}
          />
          <StatCard 
            id="new_customers"
            title="مشتریان جدید" 
            value="۱۴۵" 
            subtext="در بازه انتخابی" 
            trend="-۲٪"
            up={false}
            icon={UserPlus} 
            color="purple"
            onClick={() => setSelectedStat('new_customers')}
            selected={selectedStat === 'new_customers'}
          />
          <StatCard 
            id="reviews"
            title="مجموع نظرات" 
            value={reviewsList.length.toLocaleString()} 
            subtext={`${reviewsList.length} نظر فعال`} 
            trend="+۱۲"
            up={true}
            icon={MessageCircle} 
            color="orange"
            onClick={() => setSelectedStat('reviews')}
            selected={selectedStat === 'reviews'}
          />
        </div>

        {/* DETAILS MODAL FOR KPI */}
        <AnimatePresence>
           {selectedStat && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                 <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={() => setSelectedStat(null)}
                    className="absolute inset-0 bg-slate-900/20 backdrop-blur-sm"
                 />
                 <motion.div 
                    layoutId={`container-${selectedStat}`}
                    className="bg-white w-full max-w-lg shadow-2xl relative z-10 overflow-hidden flex flex-col max-h-[80vh]"
                    style={{ borderRadius: '2.5rem' }}
                    transition={SPRING_TRANSITION}
                 >
                    <motion.div
                       initial={{ opacity: 0 }}
                       animate={{ opacity: 1 }}
                       exit={{ opacity: 0 }}
                       transition={{ duration: 0.15, delay: 0.05 }}
                       className="flex flex-col h-full"
                    >
                       <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                          <h3 className="font-black text-lg text-slate-800 flex items-center gap-2">
                             {selectedStat === 'satisfaction' && <Smile className="w-5 h-5 text-emerald-600" />}
                             {selectedStat === 'retention' && <UserCheck className="w-5 h-5 text-blue-600" />}
                             {selectedStat === 'new_customers' && <UserPlus className="w-5 h-5 text-purple-600" />}
                             {selectedStat === 'reviews' && <MessageCircle className="w-5 h-5 text-orange-600" />}
                             
                             {selectedStat === 'satisfaction' && 'نظرات مثبت اخیر'}
                             {selectedStat === 'retention' && 'لیست مشتریان وفادار'}
                             {selectedStat === 'new_customers' && 'مشتریان تازه پیوسته'}
                             {selectedStat === 'reviews' && 'مدیریت بازخوردها'}
                          </h3>
                          <button 
                             onClick={() => setSelectedStat(null)}
                             className="p-2 bg-white rounded-full border border-slate-200 hover:bg-slate-100 transition-colors"
                          >
                             <X className="w-5 h-5 text-slate-500" />
                          </button>
                       </div>
                       <div className="p-6 overflow-y-auto">
                          {renderPopupContent()}
                       </div>
                    </motion.div>
                 </motion.div>
              </div>
           )}
        </AnimatePresence>

        {/* POPULAR PRODUCTS MODAL */}
        <AnimatePresence>
           {showAllProducts && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                 <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={() => setShowAllProducts(false)}
                    className="absolute inset-0 bg-slate-900/20 backdrop-blur-sm"
                 />
                 <motion.div 
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 20 }}
                    transition={SPRING_TRANSITION}
                    className="bg-white w-full max-w-3xl rounded-[2.5rem] shadow-2xl relative z-10 overflow-hidden flex flex-col max-h-[85vh]"
                 >
                    <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                       <h3 className="font-black text-lg text-slate-800 flex items-center gap-2">
                          <ShoppingBag className="w-5 h-5 text-emerald-600" />
                          همه محصولات محبوب
                       </h3>
                       <button 
                          onClick={() => setShowAllProducts(false)}
                          className="p-2 bg-white rounded-full border border-slate-200 hover:bg-slate-100 transition-colors"
                       >
                          <X className="w-5 h-5 text-slate-500" />
                       </button>
                    </div>
                    <div className="p-6 overflow-y-auto">
                       <div className="flex items-center gap-4 mb-6">
                          <div className="relative flex-1">
                             <input type="text" placeholder="جستجوی محصول..." className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 pr-10 text-sm focus:border-emerald-500 outline-none" />
                             <Filter className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                          </div>
                          <button className="px-4 py-3 bg-slate-100 text-slate-600 rounded-xl text-sm font-bold hover:bg-slate-200 transition-colors">فیلتر</button>
                       </div>
                       <div className="space-y-3">
                          {TOP_RATED_PRODUCTS.map((prod, i) => (
                             <div key={prod.id} className="flex items-center justify-between p-4 rounded-2xl bg-white border border-slate-100 hover:border-emerald-200 transition-all group">
                                <div className="flex items-center gap-4">
                                   <div className="w-10 h-10 flex items-center justify-center rounded-xl bg-slate-50 text-slate-500 text-xs font-black">{i + 1}</div>
                                   <div>
                                      <h4 className="font-bold text-slate-800 text-sm mb-1">{prod.name}</h4>
                                      <div className="flex gap-2 text-[10px] text-slate-400">
                                         <span className="bg-slate-50 px-2 py-0.5 rounded">{prod.category}</span>
                                         <span>{prod.sold} فروش موفق</span>
                                      </div>
                                   </div>
                                </div>
                                <div className="flex flex-col items-end gap-1">
                                   <div className="flex items-center gap-1 bg-yellow-50 px-2 py-1 rounded-lg border border-yellow-100">
                                      <span className="text-sm font-black text-yellow-700">{prod.rating}</span>
                                      <Star className="w-3.5 h-3.5 text-yellow-500 fill-current" />
                                   </div>
                                   <span className="text-xs font-bold text-emerald-600">{prod.price.toLocaleString()} تومان</span>
                                </div>
                             </div>
                          ))}
                       </div>
                    </div>
                 </motion.div>
              </div>
           )}
        </AnimatePresence>

        {/* CHART ROW 1 */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Customer Composition Chart */}
          <div className="lg:col-span-2 bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm flex flex-col">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-lg font-black text-slate-800 flex items-center gap-2">
                <Users className="w-5 h-5 text-blue-600" />
                روند وفاداری مشتریان
              </h2>
              <div className="flex items-center gap-4 text-xs font-bold bg-slate-50 px-4 py-2 rounded-xl">
                 <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 bg-blue-500 rounded-full" />
                    <span className="text-slate-600">وفادار</span>
                 </div>
                 <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 bg-emerald-400 rounded-full" />
                    <span className="text-slate-600">جدید</span>
                 </div>
              </div>
            </div>
            <div className="h-80 w-full relative">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }} barSize={dateRange === '1year' ? 12 : 32}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis 
                    dataKey="name" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fontSize: 11, fill: '#94a3b8', fontWeight: '500' }} 
                    dy={10}
                  />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fontSize: 11, fill: '#94a3b8', fontWeight: '500' }}
                    dx={-10}
                  />
                  <Tooltip content={<CustomTooltip />} cursor={{ fill: '#f8fafc' }} />
                  <Bar dataKey="returning" stackId="a" fill="#3b82f6" radius={[0, 0, 4, 4]} />
                  <Bar dataKey="newCustomers" stackId="a" fill="#34d399" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Satisfaction Pie Chart */}
          <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm flex flex-col">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-lg font-black text-slate-800 flex items-center gap-2">
                <Activity className="w-5 h-5 text-emerald-500" />
                رضایت‌مندی کل
              </h2>
            </div>
            
            <div className="flex-1 relative flex items-center justify-center min-h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={SATISFACTION_DATA}
                    cx="50%"
                    cy="50%"
                    innerRadius={70}
                    outerRadius={90}
                    paddingAngle={5}
                    dataKey="value"
                    onMouseEnter={(_, index) => setHoveredPie(index)}
                    onMouseLeave={() => setHoveredPie(null)}
                  >
                    {SATISFACTION_DATA.map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={entry.color} 
                        strokeWidth={0}
                        style={{
                           filter: hoveredPie === index ? `drop-shadow(0 0 10px ${entry.color}80)` : 'none',
                           transition: 'filter 0.3s ease'
                        }}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                 <span className="text-4xl font-black text-slate-800">۸۵٪</span>
                 <span className="text-xs text-slate-400 font-bold mt-1">رضایت</span>
              </div>
            </div>
            
            <div className="flex flex-wrap gap-2 justify-center mt-4">
               {SATISFACTION_DATA.map((item, i) => (
                  <div key={i} className="flex items-center gap-1.5 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100">
                     <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
                     <span className="text-[10px] font-bold text-slate-600">{item.name}</span>
                  </div>
               ))}
            </div>
          </div>
        </div>

        {/* BOTTOM ROW: RATINGS & COMMENTS */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 pb-10">
           
           {/* Top Rated Products */}
           <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden flex flex-col">
              <div className="flex items-center justify-between mb-6">
                 <h2 className="text-lg font-black text-slate-800 flex items-center gap-2">
                    <Star className="w-5 h-5 text-yellow-500 fill-current" />
                    محبوب‌ترین محصولات (امتیاز)
                 </h2>
              </div>
              <div className="space-y-4">
                 {TOP_RATED_PRODUCTS.slice(0, 4).map((product, idx) => (
                    <div key={idx} className="flex items-center justify-between p-4 rounded-2xl bg-white border border-slate-100 hover:border-emerald-200 hover:shadow-sm transition-all group cursor-pointer">
                       <div className="flex items-center gap-4">
                          <span className="w-8 h-8 flex items-center justify-center rounded-xl bg-slate-100 text-slate-500 text-xs font-black">{idx + 1}</span>
                          <div>
                             <h4 className="font-bold text-slate-800 text-sm mb-1">{product.name}</h4>
                             <div className="flex items-center gap-2 text-[10px] text-slate-400">
                                <span className="bg-slate-50 px-2 py-0.5 rounded">{product.category}</span>
                                <span className="w-1 h-1 bg-slate-300 rounded-full" />
                                <span>{product.reviews} نظر</span>
                             </div>
                          </div>
                       </div>
                       <div className="flex flex-col items-end gap-1">
                          <div className="flex items-center gap-1 bg-yellow-50 px-2 py-1 rounded-lg border border-yellow-100">
                             <span className="text-sm font-black text-yellow-700">{product.rating}</span>
                             <Star className="w-3.5 h-3.5 text-yellow-500 fill-current" />
                          </div>
                          <span className="text-xs font-bold text-emerald-500">{product.positive}٪ رضایت</span>
                       </div>
                    </div>
                 ))}
              </div>
              <button 
                onClick={() => setShowAllProducts(true)}
                className="mt-6 w-full py-3 bg-slate-50 text-slate-500 text-xs font-bold rounded-xl flex items-center justify-center gap-2 hover:bg-slate-100 transition-colors"
              >
                  مشاهده همه محصولات <ChevronLeft className="w-4 h-4" />
              </button>
           </div>

           {/* Recent Comments */}
           <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm flex flex-col">
              <div className="flex items-center justify-between mb-6">
                 <h2 className="text-lg font-black text-slate-800 flex items-center gap-2">
                    <MessageCircle className="w-5 h-5 text-purple-500" />
                    نظرات اخیر
                 </h2>
                 <button onClick={() => setSelectedStat('reviews')} className="text-xs text-purple-600 font-bold hover:underline">مدیریت نظرات</button>
              </div>
              <div className="space-y-4">
                 {reviewsList.slice(0, 4).map((review, idx) => (
                    <div key={idx} className="border-b border-slate-50 last:border-0 pb-4 last:pb-0 hover:bg-slate-50/50 p-3 rounded-xl transition-colors -mx-3">
                       <div className="flex justify-between items-start mb-2">
                          <div className="flex items-center gap-3">
                             <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 text-xs font-bold">
                                {review.user.charAt(0)}
                             </div>
                             <div>
                                <h4 className="text-xs font-bold text-slate-800">{review.user}</h4>
                                <span className="text-[10px] text-slate-400">{review.date}</span>
                             </div>
                          </div>
                          <div className={`px-2 py-1 rounded-lg text-[10px] font-bold flex items-center gap-1.5 border ${
                             review.sentiment === 'positive' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 
                             review.sentiment === 'negative' ? 'bg-red-50 text-red-600 border-red-100' : 'bg-slate-50 text-slate-500 border-slate-100'
                          }`}>
                             {review.sentiment === 'positive' ? <ThumbsUp className="w-3 h-3" /> : review.sentiment === 'negative' ? <Frown className="w-3 h-3" /> : <Meh className="w-3 h-3" />}
                             {review.rating}.0
                          </div>
                       </div>
                       <p className="text-xs text-slate-600 leading-relaxed pr-11 pl-2">{review.comment}</p>
                       
                       {/* Quick Action Hints */}
                       <div className="flex justify-end mt-2 opacity-0 hover:opacity-100 transition-opacity">
                          <button 
                            onClick={() => setSelectedStat('reviews')}
                            className="text-[10px] text-emerald-600 font-bold flex items-center gap-1"
                          >
                             پاسخ دادن <CornerDownRight className="w-3 h-3" />
                          </button>
                       </div>
                    </div>
                 ))}
              </div>
           </div>

        </div>

      </div>
    </div>
  );
};

export default Analytics;
const CheckLeft = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <polyline points="20 6 9 17 4 12"></polyline>
  </svg>
);
