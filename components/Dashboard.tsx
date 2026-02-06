
import React from 'react';
import { 
  TrendingUp, 
  Users, 
  ShoppingBag, 
  Clock, 
  ArrowUpRight, 
  ArrowDownRight,
  ChevronLeft
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';

const DATA = [
  { name: 'شنبه', orders: 40, revenue: 2400 },
  { name: 'یکشنبه', orders: 30, revenue: 1398 },
  { name: 'دوشنبه', orders: 20, revenue: 9800 },
  { name: 'سه‌شنبه', orders: 27, revenue: 3908 },
  { name: 'چهارشنبه', orders: 18, revenue: 4800 },
  { name: 'پنج‌شنبه', orders: 23, revenue: 3800 },
  { name: 'جمعه', orders: 34, revenue: 4300 },
];

const Dashboard: React.FC = () => {
  return (
    <div className="p-8 h-full overflow-y-auto space-y-8 bg-slate-50">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-slate-900">سلام، رستوران ایتالیایی روما 👋</h1>
          <p className="text-sm text-slate-400 mt-1">امروز تا الان وضعیت فروش شما فوق‌العاده بوده است!</p>
        </div>
        <div className="flex gap-4">
          <div className="px-4 py-2 bg-white border border-slate-200 rounded-xl flex items-center gap-2 text-xs font-bold text-slate-500 shadow-sm cursor-pointer">
            <Clock className="w-4 h-4 text-emerald-600" /> ۷ روز گذشته
          </div>
          <button className="px-6 py-2 bg-emerald-600 text-white rounded-xl text-sm font-bold shadow-lg shadow-emerald-100">دریافت گزارش</button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'کل فروش امروز', value: '۸,۴۵۰,۰۰۰ تومان', trend: '+۱۲٪', up: true, icon: <TrendingUp />, color: 'emerald' },
          { label: 'سفارشات جدید', value: '۴۸ سفارش', trend: '+۵٪', up: true, icon: <ShoppingBag />, color: 'blue' },
          { label: 'مشتریان جدید', value: '۱۲ نفر', trend: '-۲٪', up: false, icon: <Users />, color: 'purple' },
          { label: 'زمان آماده‌سازی', value: '۱۸ دقیقه', trend: '-۳ دقیقه', up: true, icon: <Clock />, color: 'orange' },
        ].map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-2xl bg-${stat.color}-50 text-${stat.color}-600`}>
                {stat.icon}
              </div>
              <div className={`flex items-center gap-1 text-xs font-black ${stat.up ? 'text-emerald-500' : 'text-red-500'}`}>
                {stat.trend}
                {stat.up ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
              </div>
            </div>
            <h3 className="text-sm font-bold text-slate-400 mb-1">{stat.label}</h3>
            <p className="text-xl font-black text-slate-900">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Chart */}
        <div className="lg:col-span-2 bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-lg font-black text-slate-800">نمودار فروش هفتگی</h2>
            <div className="flex gap-2">
              <div className="flex items-center gap-2 text-xs text-slate-400">
                <div className="w-3 h-3 bg-emerald-500 rounded-full" /> فروش
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-400">
                <div className="w-3 h-3 bg-slate-200 rounded-full" /> پیش‌بینی
              </div>
            </div>
          </div>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={DATA}>
                <defs>
                  <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#94a3b8' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#94a3b8' }} />
                <Tooltip 
                  contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                  itemStyle={{ fontSize: '12px', fontWeight: 'bold' }}
                />
                <Area type="monotone" dataKey="revenue" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorRev)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Top Products */}
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
          <h2 className="text-lg font-black text-slate-800 mb-6">پرطرفدارترین‌ها</h2>
          <div className="space-y-6">
            {[
              { name: 'پیتزا پپرونی', category: 'پیتزا', price: '۲۴۵,۰۰۰', count: '۱۲۸ فروش', color: 'emerald' },
              { name: 'چیزبرگر مخصوص', category: 'همبرگر', price: '۱۶۵,۰۰۰', count: '۹۵ فروش', color: 'blue' },
              { name: 'سالاد سزار', category: 'سالاد', price: '۱۲۰,۰۰۰', count: '۸۴ فروش', color: 'purple' },
              { name: 'سیب‌زمینی ویژه', category: 'پیش‌غذا', price: '۸۵,۰۰۰', count: '۷۶ فروش', color: 'orange' },
            ].map((prod, i) => (
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
          <button className="w-full mt-8 py-3 bg-slate-50 text-slate-500 text-xs font-bold rounded-xl flex items-center justify-center gap-2 hover:bg-slate-100 transition-colors">
            مشاهده کل لیست <ChevronLeft className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
