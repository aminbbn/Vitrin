
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
  Timer,
  Receipt,
  UserPlus,
  UserCheck
} from 'lucide-react';
import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { motion, AnimatePresence } from 'framer-motion';

// Updated Data with realistic millions values
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

const MOCK_PREP_ORDERS = [
  { id: '#12888', items: ['پیتزا سبزیجات', 'سیب‌زمینی'], timeElapsed: '۱۲ دقیقه', progress: 75 },
  { id: '#12889', items: ['پاستا آلفردو'], timeElapsed: '۸ دقیقه', progress: 45 },
  { id: '#12890', items: ['استیک ریب‌آی', 'سالاد سزار'], timeElapsed: '۵ دقیقه', progress: 20 },
];

const MOCK_CUSTOMERS = [
  { name: 'علی رضایی', type: 'new', visits: 1, lastOrder: '۲ دقیقه پیش' },
  { name: 'سارا محمدی', type: 'loyal', visits: 15, lastOrder: '۱۵ دقیقه پیش' },
  { name: 'رضا کمالی', type: 'new', visits: 1, lastOrder: '۳۴ دقیقه پیش' },
  { name: 'مریم حسینی', type: 'loyal', visits: 8, lastOrder: '۱ ساعت پیش' },
];

const MOCK_NEW_ORDERS = [
  { id: '#12892', table: 5, items: ['پیتزا پپرونی', 'نوشابه'], total: '۲۴۵,۰۰۰' },
  { id: '#12893', table: 12, items: ['برگر ذغالی', 'سیب‌زمینی'], total: '۳۱۰,۰۰۰' },
  { id: '#12894', table: 3, items: ['سالاد فصل'], total: '۸۵,۰۰۰' },
];

const MOCK_COMPLETED_ORDERS = [
  { id: '#12880', time: '۱۲:۳۰', items: 'چلوکباب کوبیده (۲ پرس)', amount: 450000 },
  { id: '#12881', time: '۱۲:۴۵', items: 'خورشت قورمه‌سبزی', amount: 180000 },
  { id: '#12882', time: '۱۳:۱۰', items: 'پیتزا مخصوص', amount: 290000 },
  { id: '#12883', time: '۱۳:۱۵', items: 'نوشیدنی‌های خنک', amount: 120000 },
  { id: '#12884', time: '۱۳:۳۰', items: 'سالاد سزار، سوپ جو', amount: 210000 },
];

const MOCK_POPULAR_PRODUCTS = [
  { name: 'پیتزا پپرونی', category: 'پیتزا', price: '۲۴۵,۰۰۰', count: 128, color: 'emerald' },
  { name: 'چیزبرگر مخصوص', category: 'همبرگر', price: '۱۶۵,۰۰۰', count: 95, color: 'blue' },
  { name: 'سالاد سزار', category: 'سالاد', price: '۱۲۰,۰۰۰', count: 84, color: 'purple' },
  { name: 'سیب‌زمینی ویژه', category: 'پیش‌غذا', price: '۸۵,۰۰۰', count: 76, color: 'orange' },
  { name: 'پاستا آلفردو', category: 'پاستا', price: '۱۸۰,۰۰۰', count: 65, color: 'emerald' },
  { name: 'نوشابه کوکا', category: 'نوشیدنی', price: '۲۵,۰۰۰', count: 150, color: 'blue' },
  { name: 'موخیتو', category: 'نوشیدنی', price: '۴۵,۰۰۰', count: 45, color: 'purple' },
  { name: 'استیک ریب‌آی', category: 'غذای اصلی', price: '۴۵۰,۰۰۰', count: 32, color: 'orange' },
];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-slate-900 text-white p-4 rounded-2xl shadow-xl border border-white/10 text-xs">
        <p className="font-bold mb-2 text-slate-400">{label}</p>
        <div className="flex items-center gap-2 mb-1">
          <div className="w-2 h-2 rounded-full bg-emerald-500" />
          <span className="text-emerald-400 font-black text-sm">
            {payload[0].value.toLocaleString()} تومان
          </span>
        </div>
      </div>
    );
  }
  return null;
};

const Dashboard: React.FC = () => {
  const [selectedStat, setSelectedStat] = useState<string | null>(null);
  const [showPopularModal, setShowPopularModal] = useState(false);
  const [chartView, setChartView] = useState<'weekly' | 'daily'>('weekly');

  const STATS = [
    { 
      id: 'revenue', 
      label: 'کل فروش امروز', 
      value: '۳۸,۴۵۰,۰۰۰ تومان', 
      trend: '+۱۲٪', 
      up: true, 
      icon: <TrendingUp />, 
      color: 'emerald',
      popupTitle: 'گزارش فروش تکمیل شده' 
    },
    { 
      id: 'orders', 
      label: 'سفارشات جدید', 
      value: '۴۸ سفارش', 
      trend: '+۵٪', 
      up: true, 
      icon: <ShoppingBag />, 
      color: 'blue',
      popupTitle: 'پیش‌نمایش سفارشات جدید' 
    },
    { 
      id: 'customers', 
      label: 'مشتریان جدید', 
      value: '۱۲ نفر', 
      trend: '-۲٪', 
      up: false, 
      icon: <Users />, 
      color: 'purple',
      popupTitle: 'لیست مشتریان اخیر' 
    },
    { 
      id: 'prep', 
      label: 'زمان آماده‌سازی', 
      value: '۱۸ دقیقه', 
      trend: '-۳ دقیقه', 
      up: true, 
      icon: <Clock />, 
      color: 'orange',
      popupTitle: 'سفارشات در حال آماده‌سازی' 
    },
  ];

  const renderPopupContent = () => {
    switch (selectedStat) {
      case 'prep':
        return (
          <div className="space-y-4">
            {MOCK_PREP_ORDERS.map((order) => (
              <div key={order.id} className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-bold text-slate-800">{order.id}</span>
                  <div className="flex items-center gap-1 text-orange-600 text-xs font-bold">
                    <Timer className="w-3 h-3" />
                    {order.timeElapsed} گذشته
                  </div>
                </div>
                <div className="text-sm text-slate-600 mb-3">{order.items.join('، ')}</div>
                <div className="h-2 w-full bg-slate-200 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-orange-500 rounded-full transition-all duration-1000" 
                    style={{ width: `${order.progress}%` }} 
                  />
                </div>
              </div>
            ))}
          </div>
        );
      case 'customers':
        return (
          <div className="space-y-3">
            {MOCK_CUSTOMERS.map((cust, i) => (
              <div key={i} className="flex items-center justify-between p-3 hover:bg-slate-50 rounded-xl transition-colors border border-transparent hover:border-slate-100">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${cust.type === 'new' ? 'bg-emerald-100 text-emerald-600' : 'bg-blue-100 text-blue-600'}`}>
                    {cust.type === 'new' ? <UserPlus className="w-5 h-5" /> : <UserCheck className="w-5 h-5" />}
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-800 text-sm">{cust.name}</h4>
                    <span className="text-[10px] text-slate-400">{cust.lastOrder}</span>
                  </div>
                </div>
                <span className={`text-[10px] px-2 py-1 rounded-full font-bold ${cust.type === 'new' ? 'bg-emerald-50 text-emerald-600' : 'bg-blue-50 text-blue-600'}`}>
                  {cust.type === 'new' ? 'مشتری جدید' : 'مشتری وفادار'}
                </span>
              </div>
            ))}
          </div>
        );
      case 'orders':
        return (
          <div className="space-y-3">
            {MOCK_NEW_ORDERS.map((order) => (
              <div key={order.id} className="bg-white border border-slate-200 p-4 rounded-2xl shadow-sm flex justify-between items-center">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-black text-slate-800">{order.id}</span>
                    <span className="text-[10px] bg-slate-100 px-2 py-0.5 rounded text-slate-500">میز {order.table}</span>
                  </div>
                  <div className="text-xs text-slate-500">{order.items.join(' + ')}</div>
                </div>
                <div className="text-left">
                  <div className="font-bold text-emerald-600 text-sm mb-1">{order.total}</div>
                  <button className="text-[10px] bg-slate-900 text-white px-3 py-1 rounded-lg hover:bg-slate-700 transition-colors">مشاهده</button>
                </div>
              </div>
            ))}
            <div className="text-center pt-2">
              <button className="text-xs text-emerald-600 font-bold hover:underline">مشاهده همه سفارشات در بورد</button>
            </div>
          </div>
        );
      case 'revenue':
        const totalRevenue = MOCK_COMPLETED_ORDERS.reduce((acc, curr) => acc + curr.amount, 0);
        return (
          <>
            <div className="overflow-y-auto max-h-[300px] pr-2 space-y-2">
              {MOCK_COMPLETED_ORDERS.map((order) => (
                <div key={order.id} className="flex justify-between items-center py-3 border-b border-slate-100 last:border-0">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center">
                      <Receipt className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="font-bold text-slate-800 text-xs">{order.id} <span className="text-slate-300 mx-1">|</span> {order.time}</div>
                      <div className="text-[10px] text-slate-400 truncate w-32">{order.items}</div>
                    </div>
                  </div>
                  <span className="font-bold text-slate-700 text-sm">{order.amount.toLocaleString()}</span>
                </div>
              ))}
            </div>
            <div className="mt-4 pt-4 border-t border-slate-200 flex justify-between items-center bg-slate-50 p-4 rounded-xl">
              <span className="font-bold text-slate-600">مجموع فروش ثبت شده</span>
              <span className="font-black text-emerald-600 text-lg">{totalRevenue.toLocaleString()} تومان</span>
            </div>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <div className="p-8 h-full overflow-y-auto space-y-8 bg-slate-50 relative font-['Vazirmatn']">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-slate-900">سلام، رستوران ایتالیایی روما 👋</h1>
          <p className="text-sm text-slate-400 mt-1">امروز تا الان وضعیت فروش شما فوق‌العاده بوده است!</p>
        </div>
        <div className="flex gap-4">
          <div className="px-4 py-2 bg-white border border-slate-200 rounded-xl flex items-center gap-2 text-xs font-bold text-slate-500 shadow-sm cursor-pointer hover:bg-slate-50 transition-colors">
            <Clock className="w-4 h-4 text-emerald-600" /> ۷ روز گذشته
          </div>
          <button className="px-6 py-2 bg-emerald-600 text-white rounded-xl text-sm font-bold shadow-lg shadow-emerald-100 hover:bg-emerald-700 transition-colors">دریافت گزارش</button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative z-0">
        {STATS.map((stat) => (
          <motion.div 
            key={stat.id}
            layoutId={`container-${stat.id}`}
            onClick={() => setSelectedStat(stat.id)}
            className="bg-white p-6 shadow-sm border border-slate-100 cursor-pointer group relative overflow-hidden"
            style={{ borderRadius: '1.5rem' }}
            transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
          >
            <motion.div 
              animate={{ opacity: selectedStat === stat.id ? 0 : 1 }}
              transition={{ duration: 0.2 }}
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-2xl bg-${stat.color}-50 text-${stat.color}-600 group-hover:scale-110 transition-transform`}>
                  {stat.icon}
                </div>
                <div className={`flex items-center gap-1 text-xs font-black ${stat.up ? 'text-emerald-500' : 'text-red-500'}`}>
                  {stat.trend}
                  {stat.up ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                </div>
              </div>
              <h3 className="text-sm font-bold text-slate-400 mb-1">{stat.label}</h3>
              <p className="text-xl font-black text-slate-900">{stat.value}</p>
            </motion.div>
          </motion.div>
        ))}
      </div>

      {/* MODAL POPUP FOR STATS */}
      <AnimatePresence>
        {selectedStat && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
             {/* Backdrop */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedStat(null)}
              className="absolute inset-0 bg-slate-900/20 backdrop-blur-sm"
            />
            
            {/* Modal Container Morphing */}
            <motion.div 
              layoutId={`container-${selectedStat}`}
              className="bg-white w-full max-w-lg shadow-2xl relative z-10 overflow-hidden flex flex-col"
              style={{ borderRadius: '2rem' }}
              transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
            >
               {/* Modal Content - Fades IN after morph starts */}
               <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3, delay: 0.1 }}
                  className="flex flex-col h-full"
               >
                  <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                    <h3 className="font-black text-lg text-slate-800 flex items-center gap-2">
                      {STATS.find(s => s.id === selectedStat)?.icon}
                      {STATS.find(s => s.id === selectedStat)?.popupTitle}
                    </h3>
                    <button 
                      onClick={() => setSelectedStat(null)}
                      className="p-2 bg-white rounded-full border border-slate-200 hover:bg-slate-100 transition-colors"
                    >
                      <X className="w-5 h-5 text-slate-500" />
                    </button>
                  </div>
                  
                  <div className="p-6 max-h-[60vh] overflow-y-auto">
                    {renderPopupContent()}
                  </div>
               </motion.div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* NEW MODAL POPUP FOR POPULAR PRODUCTS */}
      <AnimatePresence>
        {showPopularModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowPopularModal(false)}
              className="absolute inset-0 bg-slate-900/20 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white w-full max-w-2xl rounded-[2rem] shadow-2xl relative z-10 overflow-hidden flex flex-col max-h-[85vh]"
            >
              <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                <h3 className="font-black text-lg text-slate-800 flex items-center gap-2">
                  <ShoppingBag className="w-5 h-5 text-emerald-600" />
                  محصولات پرفروش
                </h3>
                <button 
                  onClick={() => setShowPopularModal(false)}
                  className="p-2 bg-white rounded-full border border-slate-200 hover:bg-slate-100 transition-colors"
                >
                  <X className="w-5 h-5 text-slate-500" />
                </button>
              </div>
              <div className="p-6 overflow-y-auto">
                <div className="space-y-3">
                  {MOCK_POPULAR_PRODUCTS.map((prod, i) => (
                    <div key={i} className="flex items-center justify-between p-4 rounded-2xl bg-white border border-slate-100 shadow-sm hover:border-emerald-200 transition-all group">
                       <div className="flex items-center gap-4">
                         <span className="w-8 h-8 flex items-center justify-center rounded-full bg-slate-100 text-slate-500 text-xs font-black">{i + 1}</span>
                         <div className={`w-12 h-12 rounded-2xl bg-${prod.color}-50 flex items-center justify-center text-${prod.color}-600`}>
                           <ShoppingBag className="w-6 h-6" />
                         </div>
                         <div>
                           <h4 className="font-bold text-slate-800 text-sm">{prod.name}</h4>
                           <span className="text-[10px] font-medium text-slate-400">{prod.category}</span>
                         </div>
                       </div>
                       <div className="text-left flex items-center gap-6">
                         <div className="text-left">
                            <span className="block text-xs text-slate-400 mb-0.5">قیمت واحد</span>
                            <span className="text-sm font-black text-slate-800">{prod.price}</span>
                         </div>
                         <div className="text-center bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200 min-w-[70px]">
                            <span className="block text-xs text-emerald-600 font-black">{prod.count}</span>
                            <span className="text-[9px] text-slate-400">فروش</span>
                         </div>
                       </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Chart */}
        <div className="lg:col-span-2 bg-white p-8 rounded-3xl shadow-sm border border-slate-100 flex flex-col">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-lg font-black text-slate-800">آمار فروش</h2>
            <div className="flex gap-2 bg-slate-100 p-1 rounded-xl">
              <button 
                onClick={() => setChartView('weekly')}
                className={`px-3 py-1 text-xs font-bold rounded-lg transition-all ${chartView === 'weekly' ? 'bg-white shadow-sm text-emerald-600' : 'text-slate-400 hover:text-slate-600'}`}
              >
                هفتگی
              </button>
              <button 
                onClick={() => setChartView('daily')}
                className={`px-3 py-1 text-xs font-bold rounded-lg transition-all ${chartView === 'daily' ? 'bg-white shadow-sm text-emerald-600' : 'text-slate-400 hover:text-slate-600'}`}
              >
                روزانه
              </button>
            </div>
          </div>
          
          <div className="h-80 w-full relative">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartView === 'weekly' ? WEEKLY_DATA : DAILY_DATA} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 12, fill: '#94a3b8', fontWeight: '500' }} 
                  dy={10}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  width={60}
                  domain={[0, 50000000]}
                  ticks={[0, 5000000, 10000000, 15000000, 20000000, 25000000, 30000000, 35000000, 40000000, 45000000, 50000000]}
                  tickFormatter={(value) => value === 0 ? '۰' : `${value / 1000000} م`}
                  tick={{ fontSize: 11, fill: '#94a3b8', fontWeight: '500' }}
                  dx={-10}
                />
                <Tooltip content={<CustomTooltip />} />
                <Area 
                  type="monotone" 
                  dataKey="revenue" 
                  stroke="#10b981" 
                  strokeWidth={3} 
                  fillOpacity={1} 
                  fill="url(#colorRev)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          
          <div className="flex items-center justify-center gap-6 mt-4">
             <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-emerald-500 rounded-full"></div>
                <span className="text-xs font-bold text-slate-500">فروش کل</span>
             </div>
          </div>
        </div>

        {/* Top Products */}
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
          <h2 className="text-lg font-black text-slate-800 mb-6">پرطرفدارترین‌ها</h2>
          <div className="space-y-6">
            {MOCK_POPULAR_PRODUCTS.slice(0, 4).map((prod, i) => (
              <div key={i} className="flex items-center justify-between group cursor-pointer">
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
                  <span className="text-[10px] text-emerald-500 font-bold">{prod.count}</span>
                </div>
              </div>
            ))}
          </div>
          <button 
            onClick={() => setShowPopularModal(true)}
            className="w-full mt-8 py-3 bg-slate-50 text-slate-500 text-xs font-bold rounded-xl flex items-center justify-center gap-2 hover:bg-slate-100 transition-colors"
          >
            مشاهده کل لیست <ChevronLeft className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
