
import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, Download, Activity, Star,
  MessageCircle, UserCheck, UserPlus, Smile, 
  ArrowUpRight, ArrowDownRight, Send, 
  ShoppingBag, Check, BarChart2,
  TrendingUp, MapPin, Phone, Search, X, Filter, ChevronLeft, Calendar
} from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, 
  ResponsiveContainer, PieChart, Pie, Cell, AreaChart, Area
} from 'recharts';

// --- TYPES & DATA ---
type DateRange = '7days' | '30days' | '1year';

// --- EXPANDED MOCK DATA ---

const ALL_REVIEWS = [
  { id: 1, user: 'علی م.', comment: 'کیفیت غذا عالی بود اما سرویس کمی کند انجام شد.', rating: 4, date: '۲ ساعت پیش', productName: 'پیتزا پپرونی', productImage: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?q=80&w=200&auto=format&fit=crop' },
  { id: 2, user: 'سارا ک.', comment: 'بهترین پیتزایی که تا حالا خوردم! نان سیر هم فوق‌العاده بود.', rating: 5, date: '۵ ساعت پیش', productName: 'پیتزا پپرونی', productImage: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?q=80&w=200&auto=format&fit=crop' },
  { id: 3, user: 'رضا ن.', comment: 'متاسفانه غذا سرد به دستم رسید.', rating: 2, date: 'دیروز', productName: 'برگر کلاسیک', productImage: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=200&auto=format&fit=crop' },
  { id: 4, user: 'مریم س.', comment: 'برخورد پرسنل عالی بود. محیط خیلی تمیز بود.', rating: 5, date: 'دیروز', productName: 'سالاد سزار', productImage: 'https://images.unsplash.com/photo-1550304999-8f69611339bf?q=80&w=200&auto=format&fit=crop' },
  { id: 5, user: 'حسین د.', comment: 'نسبت به قیمت حجم غذا کم بود.', rating: 3, date: '۲ روز پیش', productName: 'پاستا آلفردو', productImage: 'https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?q=80&w=200&auto=format&fit=crop' },
  { id: 6, user: 'نازنین ف.', comment: 'عاشق طعم سس مخصوصتون شدم!', rating: 5, date: '۳ روز پیش', productName: 'برگر کلاسیک', productImage: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=200&auto=format&fit=crop' },
  { id: 7, user: 'امیررضا', comment: 'خیلی معمولی.', rating: 3, date: 'هفته پیش', productName: 'سیب‌زمینی سرخ‌کرده', productImage: 'https://images.unsplash.com/photo-1573080496987-8198cb7fcd48?q=80&w=200&auto=format&fit=crop' },
  { id: 8, user: 'زهرا پ.', comment: 'پیتزا خیلی چرب بود.', rating: 2, date: 'هفته پیش', productName: 'پیتزا پپرونی', productImage: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?q=80&w=200&auto=format&fit=crop' },
  { id: 9, user: 'محمد ک.', comment: 'همه چیز عالی.', rating: 5, date: 'هفته پیش', productName: 'سالاد سزار', productImage: 'https://images.unsplash.com/photo-1550304999-8f69611339bf?q=80&w=200&auto=format&fit=crop' },
  { id: 10, user: 'نگین ر.', comment: 'طعم پاستا بی‌نظیر بود.', rating: 5, date: '۲ هفته پیش', productName: 'پاستا آلفردو', productImage: 'https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?q=80&w=200&auto=format&fit=crop' },
];

const ALL_LOYAL_CUSTOMERS = [
  { id: 1, name: 'سارا محمدی', orders: 42, spent: '۸,۵۰۰,۰۰۰', lastOrder: '۲ روز پیش', joinDate: '۱۴۰۲/۰۱/۱۵', favorite: 'پیتزا پپرونی' },
  { id: 2, name: 'علی رضاپور', orders: 35, spent: '۶,۲۰۰,۰۰۰', lastOrder: 'دیروز', joinDate: '۱۴۰۲/۰۲/۱۰', favorite: 'برگر کلاسیک' },
  { id: 3, name: 'مریم کاویانی', orders: 28, spent: '۵,۱۰۰,۰۰۰', lastOrder: 'هفته پیش', joinDate: '۱۴۰۱/۱۱/۲۰', favorite: 'سالاد سزار' },
  { id: 4, name: 'حسین ناصری', orders: 20, spent: '۳,۴۰۰,۰۰۰', lastOrder: '۳ روز پیش', joinDate: '۱۴۰۲/۰۵/۰۵', favorite: 'پاستا' },
  { id: 5, name: 'کیان مهرابی', orders: 18, spent: '۳,۱۰۰,۰۰۰', lastOrder: '۵ روز پیش', joinDate: '۱۴۰۲/۰۶/۱۲', favorite: 'برگر' },
  { id: 6, name: 'لیلا حاتمی', orders: 15, spent: '۲,۸۰۰,۰۰۰', lastOrder: 'دیروز', joinDate: '۱۴۰۲/۰۳/۲۵', favorite: 'پیتزا' },
];

const ALL_NEW_CUSTOMERS = [
  { id: 101, name: 'آرش کمانگیر', source: 'اینستاگرام', joinDate: 'امروز', firstOrder: 'پیتزا پپرونی' },
  { id: 102, name: 'بهرام رادان', source: 'گوگل مپ', joinDate: 'امروز', firstOrder: 'سالاد سزار' },
  { id: 103, name: 'هدیه تهرانی', source: 'معرفی دوستان', joinDate: 'دیروز', firstOrder: 'برگر کلاسیک' },
  { id: 104, name: 'نوید محمدزاده', source: 'اسنپ‌فود', joinDate: 'دیروز', firstOrder: 'پاستا آلفردو' },
  { id: 105, name: 'ترانه علیدوستی', source: 'گذری', joinDate: '۲ روز پیش', firstOrder: 'نوشیدنی' },
];

const ACQUISITION_DATA = [
  { source: 'اینستاگرام', count: 45, color: '#E1306C' },
  { source: 'گوگل مپ', count: 32, color: '#4285F4' },
  { source: 'گذری (حضوری)', count: 28, color: '#10b981' },
  { source: 'توصیه دوستان', count: 15, color: '#F4B400' },
  { source: 'اسنپ‌فود', count: 25, color: '#FF00A6' },
];

const RATING_BREAKDOWN = [
  { star: 5, count: 120 },
  { star: 4, count: 45 },
  { star: 3, count: 12 },
  { star: 2, count: 5 },
  { star: 1, count: 3 },
];

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
    default:
      return [
        { name: 'هفته ۱', newCustomers: 85, returning: 210 },
        { name: 'هفته ۲', newCustomers: 95, returning: 240 },
        { name: 'هفته ۳', newCustomers: 70, returning: 200 },
        { name: 'هفته ۴', newCustomers: 110, returning: 280 },
      ];
  }
};

const SATISFACTION_DATA = [
  { name: 'بسیار راضی (۵)', value: 65, color: '#10b981' }, 
  { name: 'راضی (۴)', value: 20, color: '#3b82f6' },
  { name: 'متوسط (۳)', value: 10, color: '#f59e0b' },
  { name: 'ناراضی (۱-۲)', value: 5, color: '#ef4444' },
];

const getAnalyticsStats = (brandColor: string, reviewCount: number) => [
  { 
    id: 'satisfaction', 
    label: 'امتیاز رضایت', 
    value: '۴.۸', 
    unit: 'از ۵', 
    trend: '+۰.۲', 
    up: true, 
    icon: Smile, 
    color: brandColor,
    desc: 'میانگین امتیازات ثبت شده توسط مشتریان'
  },
  { 
    id: 'retention', 
    label: 'نرخ بازگشت', 
    value: '۶۸٪', 
    unit: 'مشتریان وفادار', 
    trend: '+۵٪', 
    up: true, 
    icon: UserCheck, 
    color: 'blue',
    desc: 'درصد مشتریانی که بیش از یک بار خرید کرده‌اند'
  },
  { 
    id: 'new_customers', 
    label: 'مشتریان جدید', 
    value: '۱۴۵', 
    unit: 'نفر', 
    trend: '-۲٪', 
    up: false, 
    icon: UserPlus, 
    color: 'purple',
    desc: 'تعداد مشتریانی که اولین خرید خود را انجام داده‌اند'
  },
  { 
    id: 'reviews', 
    label: 'مجموع نظرات', 
    value: reviewCount.toString(), 
    unit: 'نظر', 
    trend: '+۱۲', 
    up: true, 
    icon: MessageCircle, 
    color: 'orange',
    desc: 'تعداد کل نظرات ثبت شده در پلتفرم'
  },
];

// --- COMPONENTS ---

const MetricCard = ({ id, label, value, unit, trend, up, icon: Icon, color, isActive, onClick }: any) => {
  return (
    <motion.button 
      onClick={onClick}
      layoutId={`card-${id}`}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={`relative p-5 rounded-[1.5rem] border-2 transition-all duration-300 w-full text-right overflow-hidden group ${
        isActive 
          ? `bg-${color}-600 border-${color}-600 text-white shadow-xl shadow-${color}-200 scale-105 z-10` 
          : 'bg-white border-transparent hover:border-slate-200 text-slate-600 shadow-sm hover:shadow-md'
      }`}
    >
      <div className="flex justify-between items-start mb-4">
        <div className={`p-2.5 rounded-2xl transition-colors ${isActive ? 'bg-white/20 text-white' : `bg-${color}-50 text-${color}-600`}`}>
          <Icon className="w-6 h-6" />
        </div>
        <div className={`flex items-center gap-1 text-[10px] font-black px-2 py-1 rounded-lg ${
          isActive 
            ? 'bg-white/20 text-white' 
            : up ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'
        }`}>
          {up ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
          {trend}
        </div>
      </div>
      
      <div>
        <h3 className={`text-3xl font-black mb-1 ${isActive ? 'text-white' : 'text-slate-900'}`}>{value}</h3>
        <p className={`text-xs font-bold ${isActive ? 'text-white/80' : 'text-slate-400'}`}>{label}</p>
      </div>

      {isActive && (
        <motion.div 
          layoutId="active-glow"
          className="absolute inset-0 bg-gradient-to-tr from-white/10 to-transparent pointer-events-none"
        />
      )}
    </motion.button>
  );
};

// --- INSIGHT PANEL ---

const InsightPanel = ({ activeStatId, reviews, brandColor, onShowAll }: { activeStatId: string, reviews: any[], brandColor: string, onShowAll: (type: string) => void }) => {
  
  const renderContent = () => {
    switch (activeStatId) {
      case 'satisfaction':
      case 'reviews': // Sharing similar view for reviews
        return (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-black text-slate-800 flex items-center gap-2">
                  <MessageCircle className="w-4 h-4 text-emerald-500" />
                  آخرین نظرات مشتریان
                </h3>
                <button onClick={() => onShowAll('reviews')} className="text-xs font-bold text-emerald-600 hover:bg-emerald-50 px-2 py-1 rounded-lg transition-colors flex items-center gap-1">
                   مشاهده همه <ChevronLeft className="w-3 h-3" />
                </button>
              </div>
              {reviews.slice(0, 3).map((review) => (
                <div key={review.id} className="bg-slate-50 p-4 rounded-2xl border border-slate-100 flex gap-3">
                  <div className={`w-10 h-10 rounded-full bg-${brandColor}-100 flex items-center justify-center text-${brandColor}-700 font-bold text-sm shrink-0`}>
                    {review.user.charAt(0)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-slate-800">{review.user}</span>
                        <div className="flex text-yellow-400">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className={`w-3 h-3 ${i < review.rating ? 'fill-current' : 'text-slate-200'}`} />
                          ))}
                        </div>
                      </div>
                      <span className="text-[10px] text-slate-400">{review.date}</span>
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed mb-2">{review.comment}</p>
                    <div className="flex items-center gap-2 bg-white px-2 py-1 rounded-lg border border-slate-100 w-fit">
                        <img src={review.productImage} className="w-4 h-4 rounded-full object-cover" alt="product" />
                        <span className="text-[10px] font-bold text-slate-500">{review.productName}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="flex flex-col gap-6">
                {activeStatId === 'reviews' ? (
                   <div className="bg-orange-50 rounded-3xl p-6 border border-orange-100">
                        <h3 className="text-sm font-black text-slate-800 flex items-center gap-2 mb-6">
                        <Star className="w-4 h-4 text-orange-500" />
                        توزیع امتیازات
                        </h3>
                        <div className="space-y-4">
                        {RATING_BREAKDOWN.map((item) => (
                            <div key={item.star} className="flex items-center gap-4">
                                <div className="flex items-center gap-1 w-12 shrink-0">
                                    <span className="text-sm font-black text-slate-700">{item.star}</span>
                                    <Star className="w-3.5 h-3.5 text-yellow-400 fill-current" />
                                </div>
                                <div className="flex-1 h-3 bg-white rounded-full overflow-hidden">
                                    <motion.div 
                                        initial={{ width: 0 }}
                                        animate={{ width: `${(item.count / 150) * 100}%` }}
                                        className="h-full bg-orange-400 rounded-full"
                                    />
                                </div>
                                <span className="text-xs font-bold text-slate-400 w-8 text-left">{item.count}</span>
                            </div>
                        ))}
                        </div>
                   </div>
                ) : (
                    <div className="bg-slate-50 rounded-3xl p-6 border border-slate-100 flex flex-col justify-center items-center text-center flex-1">
                        <div className="w-32 h-32 relative flex items-center justify-center mb-4">
                            <div className="absolute inset-0 rounded-full border-4 border-emerald-100"></div>
                            <div className="absolute inset-0 rounded-full border-4 border-emerald-500 border-l-transparent rotate-45"></div>
                            <div className="flex flex-col items-center">
                                <span className="text-3xl font-black text-emerald-600">۴.۸</span>
                                <span className="text-[10px] text-slate-400 font-bold">امتیاز کل</span>
                            </div>
                        </div>
                        <p className="text-sm font-bold text-slate-700 max-w-[200px]">وضعیت رضایت مشتریان عالی است!</p>
                        <p className="text-xs text-slate-400 mt-2">بر اساس ۲۰۵ نظر ثبت شده در ماه جاری</p>
                    </div>
                )}
            </div>
          </div>
        );

      case 'retention':
        return (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
             <div className="lg:col-span-2">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-black text-slate-800 flex items-center gap-2">
                    <UserCheck className="w-4 h-4 text-blue-500" />
                    مشتریان وفادار برتر
                    </h3>
                    <button onClick={() => onShowAll('loyal')} className="text-xs font-bold text-blue-600 hover:bg-blue-50 px-2 py-1 rounded-lg transition-colors flex items-center gap-1">
                        مشاهده همه <ChevronLeft className="w-3 h-3" />
                    </button>
                </div>
                <div className="space-y-3">
                   {ALL_LOYAL_CUSTOMERS.slice(0, 4).map((customer) => (
                      <div key={customer.id} className="flex items-center justify-between p-4 bg-white border border-slate-100 rounded-2xl shadow-sm hover:border-blue-200 transition-colors">
                         <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center font-bold">
                               {customer.name.charAt(0)}
                            </div>
                            <div>
                               <div className="font-bold text-sm text-slate-800">{customer.name}</div>
                               <div className="text-[10px] text-slate-400">آخرین سفارش: {customer.lastOrder}</div>
                            </div>
                         </div>
                         <div className="text-left">
                            <div className="font-black text-sm text-slate-800">{customer.orders} سفارش</div>
                            <div className="text-[10px] text-blue-600 font-bold">{customer.spent} تومان</div>
                         </div>
                      </div>
                   ))}
                </div>
             </div>
             
             <div className="bg-blue-50 rounded-3xl p-6 border border-blue-100">
                <h3 className="text-blue-800 font-black text-sm mb-4">شاخص بازگشت</h3>
                <div className="h-40 w-full">
                   <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={getSalesData('7days')}>
                         <defs>
                            <linearGradient id="colorRetention" x1="0" y1="0" x2="0" y2="1">
                               <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                               <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                            </linearGradient>
                         </defs>
                         <Area type="monotone" dataKey="returning" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorRetention)" />
                      </AreaChart>
                   </ResponsiveContainer>
                </div>
                <div className="mt-4 text-center">
                   <p className="text-xs text-blue-600 leading-relaxed">
                      <strong>نکته:</strong> ارسال کد تخفیف برای مشتریانی که بیش از ۲ هفته سفارش نداشته‌اند، می‌تواند نرخ بازگشت را تا ۱۵٪ افزایش دهد.
                   </p>
                </div>
             </div>
          </div>
        );

      case 'new_customers':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
             <div>
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-sm font-black text-slate-800 flex items-center gap-2">
                    <UserPlus className="w-4 h-4 text-purple-500" />
                    کانال‌های جذب مشتری
                    </h3>
                    <button onClick={() => onShowAll('new')} className="text-xs font-bold text-purple-600 hover:bg-purple-50 px-2 py-1 rounded-lg transition-colors flex items-center gap-1">
                        لیست مشتریان جدید <ChevronLeft className="w-3 h-3" />
                    </button>
                </div>
                <div className="space-y-5">
                   {ACQUISITION_DATA.map((item, idx) => (
                      <div key={idx}>
                         <div className="flex justify-between text-xs font-bold mb-1.5">
                            <span className="text-slate-700">{item.source}</span>
                            <span className="text-slate-900">{item.count} نفر</span>
                         </div>
                         <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                            <motion.div 
                               initial={{ width: 0 }}
                               animate={{ width: `${(item.count / 50) * 100}%` }}
                               transition={{ duration: 1, ease: "easeOut" }}
                               className="h-full rounded-full"
                               style={{ backgroundColor: item.color }}
                            />
                         </div>
                      </div>
                   ))}
                </div>
             </div>
             
             <div className="bg-purple-50 rounded-3xl p-8 border border-purple-100 flex flex-col justify-center items-center text-center relative overflow-hidden">
                <div className="relative z-10">
                   <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-lg mb-4 mx-auto text-purple-600">
                      <TrendingUp className="w-8 h-8" />
                   </div>
                   <h3 className="text-lg font-black text-purple-900 mb-2">رشد فوق‌العاده!</h3>
                   <p className="text-xs text-purple-700/80 leading-relaxed max-w-xs mx-auto">
                      تعداد مشتریان جدید شما نسبت به هفته گذشته <strong>۱۵٪ رشد</strong> داشته است. کمپین اینستاگرامی شما عملکرد موفقی دارد.
                   </p>
                </div>
                {/* Background Decorations */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-purple-200/50 rounded-full blur-3xl -mr-10 -mt-10"></div>
                <div className="absolute bottom-0 left-0 w-32 h-32 bg-purple-200/50 rounded-full blur-3xl -ml-10 -mb-10"></div>
             </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <motion.div 
      key={activeStatId}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="bg-white border border-slate-200 rounded-[2rem] p-8 shadow-sm relative overflow-hidden min-h-[300px]"
    >
       <div className="relative z-10">
          {renderContent()}
       </div>
    </motion.div>
  );
};

// --- DETAIL LIST MODAL ---

interface DetailModalProps {
   isOpen: boolean;
   onClose: () => void;
   type: 'reviews' | 'loyal' | 'new';
   brandColor: string;
}

const DetailModal: React.FC<DetailModalProps> = ({ isOpen, onClose, type, brandColor }) => {
   const [search, setSearch] = useState('');
   
   if (!isOpen) return null;

   let title = '';
   let content = null;

   if (type === 'reviews') {
      title = 'تمام نظرات مشتریان';
      const filtered = ALL_REVIEWS.filter(r => r.comment.includes(search) || r.user.includes(search) || r.productName.includes(search));
      content = (
         <div className="space-y-4">
            {filtered.map(r => (
               <div key={r.id} className="bg-white p-4 rounded-2xl border border-slate-100 flex gap-4 hover:border-slate-300 transition-colors">
                  <div className={`w-12 h-12 rounded-xl bg-${brandColor}-50 text-${brandColor}-600 flex items-center justify-center font-black text-lg shrink-0`}>
                     {r.user.charAt(0)}
                  </div>
                  <div className="flex-1">
                     <div className="flex items-center justify-between mb-1">
                        <span className="font-bold text-slate-800">{r.user}</span>
                        <span className="text-xs text-slate-400">{r.date}</span>
                     </div>
                     <div className="flex items-center gap-1 mb-2 text-yellow-400">
                        {[...Array(5)].map((_, i) => (
                           <Star key={i} className={`w-3.5 h-3.5 ${i < r.rating ? 'fill-current' : 'text-slate-200'}`} />
                        ))}
                     </div>
                     <p className="text-sm text-slate-600 leading-relaxed mb-3">{r.comment}</p>
                     
                     <div className="inline-flex items-center gap-2 bg-slate-50 border border-slate-200 pr-1 pl-3 py-1 rounded-full">
                        <img src={r.productImage} className="w-6 h-6 rounded-full object-cover" alt={r.productName} />
                        <span className="text-xs font-bold text-slate-600">محصول: <span className={`text-${brandColor}-600`}>{r.productName}</span></span>
                     </div>
                  </div>
               </div>
            ))}
         </div>
      );
   } else if (type === 'loyal') {
      title = 'لیست مشتریان وفادار';
      const filtered = ALL_LOYAL_CUSTOMERS.filter(c => c.name.includes(search));
      content = (
         <div className="space-y-3">
            {filtered.map(c => (
               <div key={c.id} className="flex items-center justify-between p-4 bg-white border border-slate-100 rounded-2xl hover:border-blue-300 transition-colors">
                  <div className="flex items-center gap-4">
                     <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center font-black text-lg">
                        {c.name.charAt(0)}
                     </div>
                     <div>
                        <div className="font-bold text-slate-800 mb-1">{c.name}</div>
                        <div className="text-xs text-slate-400 flex items-center gap-3">
                           <span>عضویت: {c.joinDate}</span>
                           <span className="w-1 h-1 bg-slate-300 rounded-full" />
                           <span>علاقه: {c.favorite}</span>
                        </div>
                     </div>
                  </div>
                  <div className="text-left flex items-center gap-6">
                     <div className="text-center">
                        <div className="text-xs text-slate-400 font-bold mb-0.5">تعداد سفارش</div>
                        <div className="font-black text-slate-800">{c.orders}</div>
                     </div>
                     <div className="text-center min-w-[100px]">
                        <div className="text-xs text-slate-400 font-bold mb-0.5">مجموع خرید</div>
                        <div className="font-black text-blue-600">{c.spent}</div>
                     </div>
                  </div>
               </div>
            ))}
         </div>
      );
   } else if (type === 'new') {
      title = 'لیست مشتریان جدید';
      const filtered = ALL_NEW_CUSTOMERS.filter(c => c.name.includes(search));
      content = (
         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filtered.map(c => (
               <div key={c.id} className="p-4 bg-white border border-slate-100 rounded-2xl hover:border-purple-300 transition-colors flex items-center gap-4">
                  <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-2xl flex items-center justify-center font-black text-lg shrink-0">
                     {c.name.charAt(0)}
                  </div>
                  <div className="flex-1">
                     <div className="flex justify-between items-start mb-1">
                        <span className="font-bold text-slate-800">{c.name}</span>
                        <span className="text-[10px] bg-purple-100 text-purple-700 px-2 py-0.5 rounded font-bold">{c.source}</span>
                     </div>
                     <div className="text-xs text-slate-500">
                        اولین سفارش: <span className="font-bold text-slate-700">{c.firstOrder}</span>
                     </div>
                     <div className="text-[10px] text-slate-400 mt-1 flex items-center gap-1">
                        <Calendar className="w-3 h-3" /> {c.joinDate}
                     </div>
                  </div>
               </div>
            ))}
         </div>
      );
   }

   return (
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
         <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
         />
         <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="bg-slate-50 w-full max-w-4xl rounded-[2.5rem] shadow-2xl relative z-10 flex flex-col max-h-[85vh] overflow-hidden"
         >
            {/* Header */}
            <div className="p-6 bg-white border-b border-slate-200 flex items-center justify-between shrink-0">
               <h2 className="text-xl font-black text-slate-800 flex items-center gap-2">
                  {title}
               </h2>
               <button onClick={onClose} className="p-2 bg-slate-100 rounded-full hover:bg-slate-200 transition-colors text-slate-500">
                  <X className="w-5 h-5" />
               </button>
            </div>

            {/* Toolbar */}
            <div className="p-4 bg-white/50 backdrop-blur border-b border-slate-200 flex gap-4 shrink-0">
               <div className="relative flex-1">
                  <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input 
                     type="text" 
                     value={search}
                     onChange={(e) => setSearch(e.target.value)}
                     placeholder="جستجو..."
                     className={`w-full bg-white border border-slate-200 rounded-xl px-4 pr-10 py-2.5 text-sm outline-none focus:border-${brandColor}-500 transition-colors`}
                  />
               </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6 scrollbar-hide">
               {content}
            </div>
         </motion.div>
      </div>
   );
}


// --- MAIN COMPONENT ---

const Analytics: React.FC<{ brandColor: string }> = ({ brandColor }) => {
  const [dateRange, setDateRange] = useState<DateRange>('7days');
  const [activeStatId, setActiveStatId] = useState<string>('satisfaction');
  
  // Modal State
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [modalType, setModalType] = useState<'reviews' | 'loyal' | 'new'>('reviews');
  
  const reviewsList = ALL_REVIEWS;
  const stats = useMemo(() => getAnalyticsStats(brandColor, reviewsList.length), [brandColor, reviewsList.length]);
  const chartData = useMemo(() => getSalesData(dateRange), [dateRange]);

  const handleShowAll = (type: string) => {
     if (type === 'reviews' || type === 'loyal' || type === 'new') {
        setModalType(type);
        setDetailModalOpen(true);
     }
  };

  const handleExportCSV = () => {
    // 1. Prepare Data
    const statsRows = stats.map(s => [s.label, s.value, s.unit, s.trend].join(','));
    const chartRows = chartData.map(c => [c.name, c.newCustomers, c.returning].join(','));
    const reviewRows = reviewsList.map(r => [r.user, r.rating, r.date, `"${r.comment}"`].join(','));

    // 2. Build CSV Content
    let csvContent = "data:text/csv;charset=utf-8,\uFEFF"; // Add BOM for Excel compatibility

    csvContent += "--- KEY METRICS ---\n";
    csvContent += "Metric,Value,Unit,Trend\n";
    csvContent += statsRows.join("\n") + "\n\n";

    csvContent += "--- CUSTOMER TRENDS ---\n";
    csvContent += "Time Period,New Customers,Returning Customers\n";
    csvContent += chartRows.join("\n") + "\n\n";

    csvContent += "--- RECENT REVIEWS ---\n";
    csvContent += "User,Rating,Date,Comment\n";
    csvContent += reviewRows.join("\n");

    // 3. Trigger Download
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "analytics_report.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="flex flex-col h-full bg-[#F8FAFC] font-['Vazirmatn'] overflow-y-auto">
      
      {/* HEADER */}
      <div className="p-8 pb-4 shrink-0">
        <div className="flex items-center justify-between mb-2">
           <div>
             <h1 className="text-2xl font-black text-slate-900 flex items-center gap-3">
               <Users className="w-6 h-6 text-emerald-600" />
               تحلیل عملکرد
             </h1>
             <p className="text-sm text-slate-400 mt-1">بررسی دقیق رفتار مشتریان و شاخص‌های کلیدی</p>
           </div>
           <button 
             onClick={handleExportCSV}
             className="flex items-center gap-2 px-5 py-2.5 bg-white border border-slate-200 text-slate-600 rounded-xl text-xs font-bold hover:bg-slate-50 transition-colors shadow-sm active:scale-95"
           >
             <Download className="w-4 h-4" /> خروجی CSV
           </button>
        </div>
      </div>

      <div className="p-8 pt-0 space-y-8 pb-20">
        
        {/* TOP METRICS DECK (SELECTORS) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat) => (
            <MetricCard 
              key={stat.id} 
              {...stat} 
              isActive={activeStatId === stat.id}
              onClick={() => setActiveStatId(stat.id)} 
            />
          ))}
        </div>

        {/* INSIGHT PANEL (MASTER DETAIL VIEW) */}
        <InsightPanel 
           activeStatId={activeStatId} 
           reviews={reviewsList} 
           brandColor={brandColor} 
           onShowAll={handleShowAll}
        />

        {/* GENERAL CHARTS SECTION */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 bg-white p-8 rounded-[2rem] shadow-sm border border-slate-200">
             <h2 className="text-lg font-black text-slate-800 mb-8 flex items-center gap-2">
                <Activity className="w-5 h-5 text-slate-400" /> نمودار روند مشتریان
             </h2>
             <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                   <BarChart data={chartData} barSize={32}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                      <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#94a3b8' }} dy={10} />
                      <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#94a3b8' }} dx={-10} />
                      <Tooltip 
                        cursor={{ fill: '#f8fafc' }}
                        contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 30px -5px rgba(0,0,0,0.1)' }}
                      />
                      <Bar dataKey="returning" name="مشتریان بازگشتی" stackId="a" fill="#3b82f6" radius={[0, 0, 4, 4]} />
                      <Bar dataKey="newCustomers" name="مشتریان جدید" stackId="a" fill="#10b981" radius={[4, 4, 0, 0]} />
                   </BarChart>
                </ResponsiveContainer>
             </div>
          </div>

          <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-slate-200 flex flex-col items-center justify-center relative overflow-hidden">
             <h2 className="text-lg font-black text-slate-800 mb-4 z-10">رضایتمندی کل</h2>
             <div className="h-64 w-full z-10">
                <ResponsiveContainer width="100%" height="100%">
                   <PieChart>
                      <Pie 
                        data={SATISFACTION_DATA} 
                        innerRadius={60} 
                        outerRadius={80} 
                        paddingAngle={5} 
                        dataKey="value"
                        cornerRadius={4}
                      >
                         {SATISFACTION_DATA.map((entry, index) => <Cell key={index} fill={entry.color} />)}
                      </Pie>
                      <Tooltip />
                   </PieChart>
                </ResponsiveContainer>
             </div>
             <div className="text-center z-10 -mt-6">
                <p className="text-3xl font-black text-slate-800">۸۵٪</p>
                <p className="text-xs text-slate-400 font-bold">تجربه مثبت</p>
             </div>
             {/* Background Pattern */}
             <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#cbd5e1 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
          </div>
        </div>

      </div>

      <AnimatePresence>
         {detailModalOpen && (
            <DetailModal 
               isOpen={detailModalOpen}
               onClose={() => setDetailModalOpen(false)}
               type={modalType}
               brandColor={brandColor}
            />
         )}
      </AnimatePresence>

    </div>
  );
};

export default Analytics;
