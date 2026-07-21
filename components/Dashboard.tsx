import React, { useState } from 'react';
import { 
  TrendingUp, 
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
  ChevronDown,
  Layers,
  Sparkles,
  QrCode,
  Link as LinkIcon,
  Plus,
  Compass,
  CheckCircle2,
  Info,
  MapPin,
  Phone
} from 'lucide-react';
import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppSession, useCatalog, useMenuDraft } from '../data/useRepositories';
import { useRepositories } from '../data/RepositoryProvider';
import { toProductViewModel } from '../types';

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

interface DashboardProps {
  onNavigateDesigner?: () => void;
  onNavigateCatalog?: () => void;
  onNavigateSettings?: () => void;
  brandColor: string;
  theme?: 'light' | 'dark';
}

// --- SUMMARY CARD COMPONENT ---
const SummaryCard = ({ 
  label, 
  value, 
  unit, 
  trend, 
  up, 
  icon: Icon, 
  color, 
  index 
}: any) => {
  const theme = { 
    bg: `bg-${color}-50 dark:bg-${color}-950/30`, 
    text: `text-${color}-600 dark:text-${color}-400`, 
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08, type: "spring", stiffness: 200, damping: 22 }}
      whileHover={{ y: -2 }}
      className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-6 rounded-[2rem] shadow-sm hover:shadow-md transition-all h-[170px] flex flex-col justify-between relative overflow-hidden"
    >
      <div className="flex items-start justify-between">
         <div className={`p-2.5 rounded-2xl ${theme.bg} ${theme.text} shadow-sm`}>
            <Icon className="w-5 h-5" />
         </div>
         <span className="text-xs font-bold text-slate-400 dark:text-slate-500 mt-1">{label}</span>
      </div>

      <div className="flex flex-col items-center justify-center flex-1 py-1">
         <h3 className="text-3xl font-black text-slate-800 dark:text-slate-100 tracking-tight font-mono">
            {value}
         </h3>
      </div>

      <div className="flex items-center justify-between gap-4">
         <div className={`flex items-center gap-1 text-[10px] font-black px-2.5 py-1 rounded-full border ${up ? `text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/30 border-emerald-100 dark:border-emerald-900/40` : 'text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/30 border-rose-100 dark:border-rose-900/40'}`}>
            {up ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
            {trend}
         </div>
         <span className="text-[10px] text-slate-400 dark:text-slate-500 font-bold bg-slate-50 dark:bg-slate-850 border border-slate-100 dark:border-slate-800 px-2.5 py-1 rounded-full">
            {unit}
         </span>
      </div>

      <div className={`absolute -right-12 -bottom-12 w-32 h-32 bg-${color}-500/5 blur-[60px] rounded-full pointer-events-none`} />
    </motion.div>
  );
};

const Dashboard: React.FC<DashboardProps> = ({ 
  onNavigateDesigner, 
  onNavigateCatalog, 
  onNavigateSettings, 
  brandColor, 
  theme 
}) => {
  const { tenantRepository, catalogRepository } = useRepositories();
  const { 
    activeRestaurant, 
    activeBranch, 
    accessibleRestaurants, 
    accessibleBranches, 
    refetchSession 
  } = useAppSession();

  const { categories = [], products = [], loading: catalogLoading } = useCatalog();
  const { activePublication, loading: menuLoading } = useMenuDraft();

  const [popularProducts, setPopularProducts] = useState<any[]>([]);

  React.useEffect(() => {
    const loadPopularProducts = async () => {
      if (!products || products.length === 0 || !activeBranch) {
        setPopularProducts([]);
        return;
      }
      try {
        const sliced = products.slice(0, 4);
        const mapped = [];
        for (const prod of sliced) {
          const bp = await catalogRepository.getBranchProduct(prod.id, activeBranch.id);
          const cat = categories.find(c => c.id === prod.categoryId);
          const mappedProd = toProductViewModel(prod, bp || undefined, cat?.name);
          mapped.push(mappedProd);
        }
        setPopularProducts(mapped);
      } catch (err) {
        console.error('Error loading popular products branch prices:', err);
      }
    };
    loadPopularProducts();
  }, [products, categories, activeBranch, catalogRepository]);

  const [isDark, setIsDark] = useState(() => theme === 'dark' || document.documentElement.classList.contains('dark'));
  const [dateRange, setDateRange] = useState<'24h' | '7days' | '30days'>('7days');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [chartView, setChartView] = useState<'weekly' | 'daily'>('weekly');
  const [isGeneratingReport, setIsGeneratingReport] = useState(false);
  const [showQrModal, setShowQrModal] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  // Branch Onboarding form state
  const [newBranchName, setNewBranchName] = useState('');
  const [newBranchAddress, setNewBranchAddress] = useState('');
  const [newBranchPhone, setNewBranchPhone] = useState('');
  const [isCreatingBranch, setIsCreatingBranch] = useState(false);
  const [branchError, setBranchError] = useState<string | null>(null);

  React.useEffect(() => {
    setIsDark(theme === 'dark' || document.documentElement.classList.contains('dark'));
  }, [theme]);

  const handleCreateBranch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeRestaurant) return;
    if (!newBranchName.trim()) {
      setBranchError('نام شعبه الزامی است');
      return;
    }
    if (!newBranchAddress.trim()) {
      setBranchError('آدرس شعبه الزامی است');
      return;
    }

    try {
      setIsCreatingBranch(true);
      setBranchError(null);
      await tenantRepository.createBranch!(activeRestaurant.id, newBranchName, newBranchAddress, newBranchPhone);
      await refetchSession();
    } catch (err: any) {
      setBranchError(err?.message || 'خطا در ثبت اطلاعات شعبه');
    } finally {
      setIsCreatingBranch(false);
    }
  };

  const handleCopyLink = () => {
    const link = `https://vitrin.ir/menu/${activeRestaurant?.slug || 'menu'}`;
    navigator.clipboard.writeText(link);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const activeProductsCount = products.filter(p => p.isActive).length;
  const unavailableProductsCount = products.filter(p => !p.isActive).length;
  const categoriesCount = categories.length;

  const isMenuLive = activePublication !== null;
  const lastPublishedAt = activePublication 
    ? new Date(activePublication.publishedAt).toLocaleDateString('fa-IR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    : 'هرگز منتشر نشده';

  const statsData = [
    {
      id: 'active_products',
      label: 'محصولات فعال منو',
      value: activeProductsCount,
      unit: 'آیتم لایو',
      trend: `${unavailableProductsCount} غیرفعال`,
      up: unavailableProductsCount === 0,
      icon: ShoppingBag,
      color: brandColor,
    },
    {
      id: 'categories_count',
      label: 'دسته‌بندی‌های فعال',
      value: categoriesCount,
      unit: 'دسته اصلی',
      trend: 'سازمان‌دهی شده',
      up: true,
      icon: Layers,
      color: 'blue',
    },
    {
      id: 'menu_status',
      label: 'وضعیت انتشار منو',
      value: isMenuLive ? 'منتشر شده' : 'پیش‌نویس',
      unit: isMenuLive ? (activePublication?.version || 'v1.0') : 'نیاز به انتشار',
      trend: isMenuLive ? 'فعال در آدرس عمومی' : 'تغییرات محلی',
      up: isMenuLive,
      icon: Clock,
      color: isMenuLive ? 'emerald' : 'orange',
    },
    {
      id: 'last_published',
      label: 'آخرین انتشار سراسری',
      value: isMenuLive ? 'لایو' : 'نامشخص',
      unit: 'تاریخ نهایی',
      trend: lastPublishedAt,
      up: isMenuLive,
      icon: TrendingUp,
      color: 'purple',
    }
  ];

  const handleDownloadReport = () => {
    setIsGeneratingReport(true);
    setTimeout(() => {
      const headers = ['Metric', 'Value', 'Unit', 'Trend'];
      const rows = statsData.map(s => [s.label, s.value, s.unit, s.trend]);
      let csvContent = "data:text/csv;charset=utf-8,\uFEFF";
      csvContent += "--- MENU MANAGEMENT REPORT ---\n";
      csvContent += headers.join(",") + "\n";
      rows.forEach(r => csvContent += r.join(",") + "\n");
      
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      link.setAttribute("download", "menu-report.csv");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      setIsGeneratingReport(false);
    }, 1000);
  };

  const chartColorMap: Record<string, string> = {
    emerald: '#10b981',
    blue: '#3b82f6',
    purple: '#a855f7',
    orange: '#f97316',
    red: '#ef4444',
  };
  const chartHexColor = chartColorMap[brandColor] || '#10b981';

  // Empty State: Restaurant exists but no active branch
  if (activeRestaurant && !activeBranch) {
    return (
      <div className="p-8 h-full overflow-y-auto bg-[#F8FAFC] dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex items-center justify-center font-['Vazirmatn'] selection:bg-emerald-500/10 transition-colors">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-lg bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[2.5rem] p-8 md:p-10 shadow-xl"
        >
          <div className="w-16 h-16 bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 rounded-2xl flex items-center justify-center mb-6 shadow-inner mx-auto">
            <Compass className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-black text-center text-slate-800 dark:text-slate-100 mb-2">ثبت اولین شعبه رستوران</h2>
          <p className="text-xs text-slate-400 text-center leading-relaxed mb-8">
            رستوران شما ثبت شده است، اما برای شروع مدیریت منو و کالاها نیاز به ثبت حداقل یک شعبه دارید.
          </p>

          {branchError && (
            <div className="mb-6 p-4 bg-rose-50 dark:bg-rose-950/20 text-rose-600 dark:text-rose-400 rounded-2xl text-xs font-bold border border-rose-100 dark:border-rose-950/30">
              {branchError}
            </div>
          )}

          <form onSubmit={handleCreateBranch} className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-black text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                نام شعبه
              </label>
              <input
                type="text"
                value={newBranchName}
                onChange={(e) => setNewBranchName(e.target.value)}
                placeholder="مثال: شعبه مرکزی، شعبه جردن"
                className="w-full bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 rounded-2xl px-4 py-3.5 text-sm focus:border-emerald-500 outline-none transition-colors dark:text-slate-100"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-black text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                آدرس شعبه
              </label>
              <input
                type="text"
                value={newBranchAddress}
                onChange={(e) => setNewBranchAddress(e.target.value)}
                placeholder="آدرس دقیق فیزیکی شعبه"
                className="w-full bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 rounded-2xl px-4 py-3.5 text-sm focus:border-emerald-500 outline-none transition-colors dark:text-slate-100"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-black text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                شماره تلفن شعبه (اختیاری)
              </label>
              <input
                type="text"
                value={newBranchPhone}
                onChange={(e) => setNewBranchPhone(e.target.value)}
                placeholder="تلفن تماس مستقیم شعبه"
                className="w-full bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 rounded-2xl px-4 py-3.5 text-sm focus:border-emerald-500 outline-none transition-colors dark:text-slate-100"
              />
            </div>

            <button
              type="submit"
              disabled={isCreatingBranch}
              className="w-full py-4 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs rounded-2xl shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 disabled:opacity-80 active:scale-95"
            >
              {isCreatingBranch ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  در حال ثبت شعبه...
                </>
              ) : (
                'ایجاد شعبه و شروع به کار'
              )}
            </button>
          </form>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="p-8 h-full overflow-y-auto space-y-8 bg-[#F8FAFC] dark:bg-slate-950 text-slate-900 dark:text-slate-100 relative font-['Vazirmatn'] transition-colors" onClick={() => setIsDropdownOpen(false)}>
      
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <span>سلام، {activeRestaurant?.name || 'مدیر گرامی'} 👋</span>
            <span className="text-xs font-normal text-slate-400 bg-slate-100 dark:bg-slate-850 border border-slate-200/50 dark:border-slate-800 px-3 py-1.5 rounded-full">
              {activeBranch?.name || 'بدون شعبه'}
            </span>
          </h1>
          <p className="text-sm text-slate-400 mt-1">پنل مدیریت یکپارچه منوی دیجیتال ویترین</p>
        </div>
        <div className="flex gap-4 relative">
          {/* REPORT DOWNLOAD */}
          <button 
            onClick={handleDownloadReport}
            disabled={isGeneratingReport}
            className={`px-5 py-2.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-bold hover:bg-slate-200 dark:hover:bg-slate-700 transition-all flex items-center gap-2 active:scale-95 disabled:opacity-80 min-w-[140px] justify-center border border-slate-200/50 dark:border-slate-700`}
          >
            {isGeneratingReport ? (
               <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  در حال ساخت...
               </>
            ) : (
               <>
                  <Download className="w-4 h-4" />
                  خروجی اطلاعات
               </>
            )}
          </button>
        </div>
      </div>

      {/* METRIC CARD EMPTY STATE HANDLER OR STANDARD STATS GRID */}
      {products.length === 0 ? (
        <motion.div 
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-8 rounded-[2rem] shadow-sm flex flex-col md:flex-row items-center justify-between gap-6"
        >
          <div className="flex items-center gap-4">
            <div className="p-4 bg-amber-50 dark:bg-amber-950/30 text-amber-500 rounded-2xl shrink-0">
              <ShoppingBag className="w-8 h-8" />
            </div>
            <div>
              <h3 className="text-base font-black text-slate-800 dark:text-slate-200">هنوز کالا یا دسته‌ای ثبت نکرده‌اید!</h3>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed max-w-[55ch]">
                برای فعال شدن منوی دیجیتال لایو و نمایش به مشتریان، ابتدا چند دسته اصلی تعریف کرده و اولین محصولات خود را به همراه قیمت و جزئیات اضافه کنید.
              </p>
            </div>
          </div>
          {onNavigateCatalog && (
            <button
              onClick={onNavigateCatalog}
              className={`px-6 py-3.5 bg-${brandColor}-600 text-white rounded-2xl text-xs font-black shadow-lg shadow-${brandColor}-500/10 hover:bg-${brandColor}-700 transition-all flex items-center gap-2 shrink-0 active:scale-95`}
            >
              <Plus className="w-4 h-4" />
              افزودن اولین محصول
            </button>
          )}
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative z-0">
          {statsData.map((stat, index) => (
            <SummaryCard 
              key={stat.id} 
              {...stat} 
              index={index}
            />
          ))}
        </div>
      )}

      {/* NO PUBLICATION WARNING OR MENU PREVIEW / QR SECTION */}
      {!isMenuLive ? (
        <motion.div 
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-orange-50/60 dark:bg-orange-950/15 border border-orange-100 dark:border-orange-900/30 p-8 rounded-[2rem] flex flex-col md:flex-row items-center justify-between gap-6"
        >
          <div className="flex items-center gap-4">
            <div className="p-4 bg-orange-100 dark:bg-orange-950/40 text-orange-600 dark:text-orange-400 rounded-2xl shrink-0">
              <Info className="w-8 h-8" />
            </div>
            <div>
              <h3 className="text-base font-black text-slate-800 dark:text-slate-100">منوی دیجیتال شما هنوز منتشر نشده است!</h3>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed max-w-[55ch]">
                تغییرات چیدمان و کالاها در حالت پیش‌نویس قرار دارد. برای فعال شدن رسمی آدرس اینترنتی و بارگیری منو برای مشتریان، به ویرایشگر بروید و دکمه انتشار سراسری را بزنید.
              </p>
            </div>
          </div>
          {onNavigateDesigner && (
            <button
              onClick={onNavigateDesigner}
              className="px-6 py-3.5 bg-orange-600 hover:bg-orange-700 text-white rounded-2xl text-xs font-black shadow-lg transition-all flex items-center gap-2 shrink-0 active:scale-95"
            >
              <Compass className="w-4 h-4" />
              طراحی و انتشار منو
            </button>
          )}
        </motion.div>
      ) : (
        <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-8 rounded-[2rem] shadow-sm flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex items-center gap-5">
            <div className={`p-4 bg-${brandColor}-50 dark:bg-${brandColor}-950/20 text-${brandColor}-600 dark:text-${brandColor}-400 rounded-3xl shrink-0 shadow-inner`}>
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <div>
              <h3 className="text-base font-black text-slate-800 dark:text-slate-200 flex items-center gap-2">
                <span>منوی دیجیتال شما زنده و فعال است!</span>
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              </h3>
              <p className="text-xs text-slate-400 mt-1.5 leading-relaxed max-w-[60ch]">
                مشتریان می‌توانند با اسکن کد QR یا کلیک بر روی لینک اختصاصی شما، لیست کالاها، قیمت‌ها و تصاویر زیبای منو را با سرعت بالا مشاهده کنند.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => setShowQrModal(true)}
              className="px-4 py-3.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold rounded-2xl transition-all flex items-center gap-2 active:scale-95"
            >
              <QrCode className="w-4 h-4" />
              دریافت کد QR اختصاصی
            </button>
            <button
              onClick={handleCopyLink}
              className={`px-4 py-3.5 bg-${brandColor}-50 dark:bg-${brandColor}-950/30 text-${brandColor}-600 dark:text-${brandColor}-400 text-xs font-black rounded-2xl transition-all flex items-center gap-2 active:scale-95`}
            >
              <LinkIcon className="w-4 h-4" />
              {copiedLink ? 'لینک کپی شد!' : 'کپی لینک منوی اختصاصی'}
            </button>
          </div>
        </div>
      )}

      {/* CHARTS AND RECENT POPULAR PRODUCTS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 p-8 rounded-[2rem] shadow-sm border border-slate-100 dark:border-slate-800 flex flex-col transition-colors">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-base font-black text-slate-850 dark:text-slate-100">تحلیل بازدیدهای منو</h2>
            <div className="flex gap-1.5 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
              <button 
                onClick={() => setChartView('weekly')} 
                className={`px-4 py-1.5 text-xs font-bold rounded-lg transition-all ${chartView === 'weekly' ? `bg-white dark:bg-slate-900 shadow-sm text-${brandColor}-600 dark:text-${brandColor}-400` : 'text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300'}`}
              >
                هفتگی
              </button>
              <button 
                onClick={() => setChartView('daily')} 
                className={`px-4 py-1.5 text-xs font-bold rounded-lg transition-all ${chartView === 'daily' ? `bg-white dark:bg-slate-900 shadow-sm text-${brandColor}-600 dark:text-${brandColor}-400` : 'text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300'}`}
              >
                روزانه
              </button>
            </div>
          </div>
          <div className="h-80 w-full relative">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartView === 'weekly' ? WEEKLY_DATA : DAILY_DATA}>
                 <defs>
                   <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                     <stop offset="5%" stopColor={chartHexColor} stopOpacity={0.15}/>
                     <stop offset="95%" stopColor={chartHexColor} stopOpacity={0}/>
                   </linearGradient>
                 </defs>
                 <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={isDark ? '#26262b' : '#f1f5f9'} />
                 <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#94a3b8' }} dy={10} />
                 <YAxis axisLine={false} tickLine={false} width={40} tickFormatter={(value) => value} tick={{ fontSize: 11, fill: '#94a3b8' }} dx={-10} />
                 <Tooltip 
                    cursor={{ stroke: isDark ? '#26262b' : '#e2e8f0', strokeWidth: 1, strokeDasharray: '4 4' }}
                    content={({ active, payload, label }: any) => {
                      if (active && payload && payload.length) {
                        return (
                          <div className="bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 p-4 rounded-2xl shadow-xl border border-slate-100 dark:border-slate-800 text-xs z-[100] relative">
                            <p className="font-bold mb-2 text-slate-400">{label}</p>
                            <div className="flex items-center gap-2">
                              <span className={`text-${brandColor}-600 dark:text-${brandColor}-400 font-black text-sm`}>{(payload[0] && payload[0].value !== undefined && payload[0].value !== null) ? payload[0].value.toLocaleString() : '۰'} بازدید</span>
                            </div>
                          </div>
                        );
                      }
                      return null;
                    }}
                    wrapperStyle={{ zIndex: 1000 }} 
                 />
                 <Area type="monotone" dataKey="revenue" stroke={chartHexColor} strokeWidth={3.5} fillOpacity={1} fill="url(#colorRev)" />
               </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* MOST POPULAR DISHES */}
        <div className="bg-white dark:bg-slate-900 p-8 rounded-[2rem] shadow-sm border border-slate-100 dark:border-slate-800 transition-colors">
          <h2 className="text-base font-black text-slate-850 dark:text-slate-100 mb-6">محبوب‌ترین محصولات</h2>
          <div className="space-y-6">
            {popularProducts.map((prod, i) => (
              <div key={i} className="flex items-center justify-between group p-1 rounded-xl">
                 <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl overflow-hidden bg-slate-50 dark:bg-slate-800 flex items-center justify-center shrink-0 border border-slate-100 dark:border-slate-800">
                       {prod.image ? (
                         <img src={prod.image} alt={prod.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform" referrerPolicy="no-referrer" />
                       ) : (
                         <ShoppingBag className="w-5 h-5 text-slate-400" />
                       )}
                    </div>
                    <div>
                       <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200">{prod.name}</h4>
                       <span className="text-[10px] font-medium text-slate-400 dark:text-slate-500">{prod.category}</span>
                    </div>
                 </div>
                 <div className="text-left">
                    <p className="text-sm font-black text-slate-700 dark:text-slate-300 font-mono">
                      {prod.price !== undefined && prod.price !== null ? prod.price.toLocaleString() : '۰'} تومان
                    </p>
                    <span className={`text-[10px] text-${brandColor}-500 font-bold`}>{30 + (i * 12)} بازدید</span>
                 </div>
              </div>
            ))}
            {popularProducts.length === 0 && (
              <div className="py-12 text-center text-xs text-slate-400 font-medium">هیچ محصولی برای نمایش وجود ندارد</div>
            )}
          </div>
          {onNavigateCatalog && products.length > 0 && (
            <button 
               onClick={onNavigateCatalog}
               className="w-full mt-8 py-3 bg-slate-50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 text-xs font-bold rounded-xl flex items-center justify-center gap-2 hover:bg-slate-100 dark:hover:bg-slate-850 transition-colors"
            >
               مدیریت محصولات <ChevronLeft className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* QR MODAL */}
      <AnimatePresence>
        {showQrModal && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] flex items-center justify-center p-4"
          >
            <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-xl" onClick={() => setShowQrModal(false)} />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 16 }}
              className="bg-white dark:bg-slate-900 w-full max-w-sm rounded-[2.5rem] shadow-2xl relative z-10 p-8 text-center border border-slate-100 dark:border-slate-800"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-black text-base text-slate-800 dark:text-slate-200">کد QR منوی دیجیتال</h3>
                <button onClick={() => setShowQrModal(false)} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full text-slate-400">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="w-48 h-48 bg-slate-50 dark:bg-slate-800 p-4 rounded-3xl mx-auto mb-6 border border-slate-150 dark:border-slate-700 flex items-center justify-center">
                <div className="w-full h-full bg-white p-2 rounded-2xl flex items-center justify-center shadow-inner">
                  {/* Premium mock visual QR code */}
                  <div className="relative w-full h-full flex flex-col items-center justify-center border-2 border-dashed border-slate-100 rounded-xl">
                    <QrCode className={`w-28 h-28 text-${brandColor}-600`} />
                    <span className="text-[9px] font-black text-slate-400 tracking-wider absolute bottom-1 uppercase">vitrin.ir</span>
                  </div>
                </div>
              </div>

              <p className="text-xs text-slate-400 mb-6 leading-relaxed">
                این تصویر را چاپ کرده و روی میزها، کانتر یا شیشه ورودی رستوران خود قرار دهید تا مشتریان به راحتی منو را باز کنند.
              </p>

              <button
                onClick={() => setShowQrModal(false)}
                className={`w-full py-3.5 bg-${brandColor}-600 text-white rounded-2xl text-xs font-black shadow-lg transition-all active:scale-95`}
              >
                دانلود تصویر QR
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
};

export default Dashboard;
