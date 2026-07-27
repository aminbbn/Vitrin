import React, { useState } from 'react';
import { createPortal } from 'react-dom';
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
  Phone,
  RotateCcw
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
  index,
  onClick
}: any) => {
  const theme = { 
    bg: `bg-${color}-50 dark:bg-${color}-950/30`, 
    text: `text-${color}-600 dark:text-${color}-400`, 
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onClick?.();
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08, type: "spring", stiffness: 200, damping: 22 }}
      whileHover={{ y: -4, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      onKeyDown={handleKeyDown}
      role="button"
      tabIndex={0}
      className="bg-white dark:bg-[var(--app-surface)] border border-slate-100 dark:border-[var(--app-border)] p-4 sm:p-6 rounded-[2rem] shadow-[0_4px_20px_rgba(0,0,0,0.01)] dark:shadow-[0_4px_20px_rgba(0,0,0,0.05)] hover:shadow-md transition-all min-h-[145px] sm:min-h-[170px] flex flex-col justify-between relative overflow-hidden cursor-pointer select-none outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 group"
    >
      <div className="flex items-start justify-between gap-2">
         <div className={`p-2 rounded-2xl ${theme.bg} ${theme.text} shadow-sm group-hover:scale-110 transition-transform shrink-0`}>
            <Icon className="w-4.5 h-4.5 sm:w-5 sm:h-5" />
         </div>
         <span className="text-[11px] sm:text-xs font-bold text-slate-400 dark:text-slate-500 mt-1 text-left sm:text-right line-clamp-1">{label}</span>
      </div>

      <div className="flex flex-col items-center justify-center flex-1 py-1 min-w-0">
         <h3 className="text-xl sm:text-3xl font-black text-slate-800 dark:text-slate-100 tabular-nums break-words text-center w-full">
            {value}
         </h3>
      </div>

      <div className="flex items-center justify-between gap-2 flex-wrap">
         <div className={`flex items-center gap-1 text-[9px] sm:text-[10px] font-black px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full border shrink-0 ${up ? `text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/30 border-emerald-100 dark:border-emerald-900/40` : 'text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/30 border-rose-100 dark:border-rose-900/40'}`}>
            {up ? <ArrowUpRight className="w-2.5 h-2.5 sm:w-3 sm:h-3" /> : <ArrowDownRight className="w-2.5 h-2.5 sm:w-3 sm:h-3" />}
            <span className="truncate max-w-[80px]">{trend}</span>
         </div>
         <span className="text-[9px] sm:text-[10px] text-slate-400 dark:text-slate-500 font-bold bg-slate-50 dark:bg-[var(--app-surface-elevated)] border border-slate-100 dark:border-[var(--app-border)] px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full truncate max-w-[90px]">
            {unit}
         </span>
      </div>

      <div className={`absolute -right-12 -bottom-12 w-32 h-32 bg-${color}-500/5 blur-[60px] rounded-full pointer-events-none`} />
    </motion.div>
  );
};

// --- EXPANDED CARD CONTENT ---
const ExpandedCardContent = ({ stat, onClose }: { stat: any, onClose: () => void }) => {
  const Icon = stat.icon;
  const color = stat.color;
  return (
    <div className="p-6 relative font-['Vazirmatn'] text-right" dir="rtl">
       <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
               <div className={`p-3.5 rounded-2xl bg-${color}-50 dark:bg-${color}-950/30 text-${color}-600 dark:text-${color}-400 shadow-sm`}>
                 <Icon className="w-6 h-6" />
               </div>
               <span className="text-lg font-black text-slate-700 dark:text-slate-200">{stat.label}</span>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors text-slate-400 cursor-pointer border-none bg-transparent">
               <X className="w-5 h-5" />
            </button>
       </div>
       <div className="flex flex-col items-start mb-8">
            <h2 className="text-5xl font-black text-slate-900 dark:text-slate-100 tabular-nums leading-none">
              {stat.value}
            </h2>
            <div className="flex items-center gap-3 mt-3">
               <span className={`text-xs font-black px-3 py-1.5 rounded-full flex items-center gap-1.5 border ${stat.up ? 'bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400 border-emerald-100 dark:border-emerald-850' : 'bg-rose-50 dark:bg-rose-950/30 text-rose-600 dark:text-rose-400 border-rose-100 dark:border-rose-850'}`}>
                   {stat.up ? <ArrowUpRight className="w-3.5 h-3.5" /> : <ArrowDownRight className="w-3.5 h-3.5" />}
                   {stat.trend}
               </span>
               <span className="text-xs text-slate-500 dark:text-slate-400 font-bold bg-slate-50 dark:bg-[var(--app-surface-elevated)] px-3 py-1.5 rounded-full border border-slate-100 dark:border-[var(--app-border)]">{stat.unit}</span>
            </div>
       </div>
       <div className="space-y-4">
          <h4 className="text-xs font-black text-slate-400 uppercase tracking-normal mb-2 flex items-center gap-2">
             <BarChart2 className="w-3 h-3" />
             جزئیات سریع
          </h4>
          <div className="space-y-3">
             {stat.insights?.map((detail: any, i: number) => (
                <div
                   key={i}
                   className="flex items-center justify-between p-4 bg-slate-50 dark:bg-[var(--app-surface-elevated)] rounded-2xl border border-slate-100 dark:border-[var(--app-border)]/60 hover:border-slate-200 dark:hover:bg-[var(--app-hover)] transition-colors"
                >
                   <span className="text-xs font-bold text-slate-600 dark:text-slate-400">{detail.label}</span>
                   <span className="text-sm font-black text-slate-800 dark:text-slate-200 tabular-nums">{detail.value}</span>
                </div>
             ))}
          </div>
       </div>
       <div className="h-6" />
    </div>
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
    refetchSession,
    setActiveBranch
  } = useAppSession();

  const { categories = [], products = [], loading: catalogLoading } = useCatalog();
  const { activePublication, publicationHistory = [], publishMenu, loading: menuLoading } = useMenuDraft();

  const [popularProducts, setPopularProducts] = useState<any[]>([]);
  const [isRollingBack, setIsRollingBack] = useState(false);
  const [rollbackSuccess, setRollbackSuccess] = useState(false);

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
  const [selectedStatId, setSelectedStatId] = useState<string | null>(null);

  React.useEffect(() => {
    if (selectedStatId) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [selectedStatId]);

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

  const sortedHistory = [...publicationHistory].sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());

  const handleRollback = async () => {
    if (sortedHistory.length < 2) return;
    try {
      setIsRollingBack(true);
      const prevPub = sortedHistory[1];
      await publishMenu(prevPub.snapshot.elements);
      setRollbackSuccess(true);
      setTimeout(() => setRollbackSuccess(false), 3000);
    } catch (err) {
      console.error('Error rolling back menu:', err);
    } finally {
      setIsRollingBack(false);
    }
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
      insights: [
        { label: 'آیتم‌های فعال (در حال نمایش)', value: `${activeProductsCount} محصول` },
        { label: 'آیتم‌های غیرفعال (پنهان)', value: `${unavailableProductsCount} محصول` },
        { label: 'کل محصولات تعریف شده', value: `${products.length} محصول` }
      ]
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
      insights: [
        { label: 'تعداد کل دسته‌ها', value: `${categoriesCount} دسته` },
        { label: 'دسته‌بندی‌های دارای محصول', value: `${categories.filter(c => products.some(p => p.categoryId === c.id)).length} دسته` },
        { label: 'دسته‌بندی‌های خالی', value: `${categories.filter(c => !products.some(p => p.categoryId === c.id)).length} دسته` }
      ]
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
      insights: [
        { label: 'وضعیت فعلی', value: isMenuLive ? 'منتشر شده و زنده' : 'پیش‌نویس (نیاز به انتشار)' },
        { label: 'نسخه منو', value: isMenuLive ? (activePublication?.version || 'v1.0') : 'در انتظار انتشار' },
        { label: 'تعداد کل صفحات لایو', value: isMenuLive ? '۱ صفحه اصلی' : '۰' }
      ]
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
      insights: [
        { label: 'آخرین تاریخ انتشار', value: lastPublishedAt },
        { label: 'تاریخ تغییرات محلی', value: 'بروزرسانی لحظه‌ای' },
        { label: 'وضعیت همگام‌سازی', value: isMenuLive ? 'کاملاً همگام‌سازی شده' : 'تغییرات محلی منتشر نشده' }
      ]
    }
  ];

  const selectedStat = statsData.find(s => s.id === selectedStatId);

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
      <div className="p-8 h-full overflow-y-auto bg-[#F8FAFC] dark:bg-[var(--app-bg)] text-slate-900 dark:text-slate-100 flex items-center justify-center font-['Vazirmatn'] selection:bg-emerald-500/10 transition-colors">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-lg bg-white dark:bg-[var(--app-surface)] border border-slate-100 dark:border-[var(--app-border)] rounded-[2.5rem] p-8 md:p-10 shadow-xl"
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
                className="w-full bg-slate-50 dark:bg-[var(--app-surface-elevated)] border border-slate-200 dark:border-[var(--app-border)] rounded-2xl px-4 py-3.5 text-sm focus:border-emerald-500 outline-none transition-colors dark:text-slate-100"
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
                className="w-full bg-slate-50 dark:bg-[var(--app-surface-elevated)] border border-slate-200 dark:border-[var(--app-border)] rounded-2xl px-4 py-3.5 text-sm focus:border-emerald-500 outline-none transition-colors dark:text-slate-100"
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
                className="w-full bg-slate-50 dark:bg-[var(--app-surface-elevated)] border border-slate-200 dark:border-[var(--app-border)] rounded-2xl px-4 py-3.5 text-sm focus:border-emerald-500 outline-none transition-colors dark:text-slate-100"
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
    <div className="p-4 sm:p-6 lg:p-8 h-full overflow-y-auto space-y-6 sm:space-y-8 bg-[#F8FAFC] dark:bg-[var(--app-bg)] text-slate-900 dark:text-slate-100 relative font-['Vazirmatn'] transition-colors pb-24 md:pb-8" onClick={() => setIsDropdownOpen(false)}>
      
      {/* 1. INTRODUCTION & GREETINGS */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-slate-100 flex flex-wrap items-center gap-2">
            <span>سلام، {activeRestaurant?.name || 'مدیر گرامی'} 👋</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">پنل مدیریت یکپارچه منوی دیجیتال ویترین</p>
        </div>
        <div className="flex gap-4 relative w-full sm:w-auto">
          <button 
            onClick={handleDownloadReport}
            disabled={isGeneratingReport}
            className={`px-5 py-2.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-bold hover:bg-slate-200 dark:hover:bg-slate-700 transition-all flex items-center gap-2 active:scale-95 disabled:opacity-80 w-full sm:w-auto justify-center border border-slate-200/50 dark:border-slate-700`}
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

      {/* 2. BRANCH CONTEXT & SELECTION */}
      <div className="bg-white dark:bg-[var(--app-surface)] border border-slate-100 dark:border-[var(--app-border)] p-5 rounded-[2rem] shadow-[0_4px_24px_rgba(0,0,0,0.01)] dark:shadow-[0_4px_24px_rgba(0,0,0,0.04)] flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all">
        <div className="flex items-center gap-3">
          <div className={`p-2.5 bg-${brandColor}-50 dark:bg-${brandColor}-950/20 text-${brandColor}-600 dark:text-${brandColor}-400 rounded-2xl shrink-0`}>
            <MapPin className="w-5.5 h-5.5" />
          </div>
          <div>
            <h3 className="text-[10px] sm:text-xs font-bold text-slate-400 dark:text-slate-500">شعبه فعال در حال مدیریت</h3>
            <p className="text-sm font-black text-slate-800 dark:text-slate-100 mt-0.5">{activeBranch?.name || 'شعبه‌ای انتخاب نشده است'}</p>
          </div>
        </div>
        {accessibleBranches.length > 1 && (
          <div className="relative w-full sm:w-auto">
            <select
              value={activeBranch?.id || ''}
              onChange={async (e) => {
                await setActiveBranch(e.target.value);
              }}
              className={`w-full sm:w-56 bg-slate-50 dark:bg-[var(--app-surface-elevated)] border border-slate-200 dark:border-[var(--app-border)] text-slate-700 dark:text-slate-200 rounded-2xl px-4 py-2.5 text-xs font-black outline-none appearance-none cursor-pointer pr-4 pl-10 focus:border-${brandColor}-500 transition-colors`}
              dir="rtl"
            >
              {accessibleBranches.map((b) => (
                <option key={b.id} value={b.id} className="font-bold py-2 bg-white dark:bg-[var(--app-surface)] text-slate-800 dark:text-slate-100">
                  {b.name}
                </option>
              ))}
            </select>
            <ChevronDown className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          </div>
        )}
      </div>

      {/* 3. PUBLICATION STATUS CARD (Versioned with rollbacks) */}
      <div className="bg-white dark:bg-[var(--app-surface)] border border-slate-100 dark:border-[var(--app-border)] p-5 sm:p-6 md:p-8 rounded-[2rem] shadow-[0_4px_24px_rgba(0,0,0,0.01)] dark:shadow-[0_4px_24px_rgba(0,0,0,0.04)] flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex flex-col md:flex-row items-center gap-4 md:gap-5 text-center md:text-right w-full md:w-auto">
          <div className={`p-3.5 rounded-3xl shrink-0 shadow-inner ${isMenuLive ? `bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400` : 'bg-orange-50 dark:bg-orange-950/20 text-orange-600 dark:text-orange-400'}`}>
            {isMenuLive ? <CheckCircle2 className="w-7 h-7" /> : <Info className="w-7 h-7" />}
          </div>
          <div className="min-w-0">
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
              <h3 className="text-sm sm:text-base font-black text-slate-800 dark:text-slate-100">
                {isMenuLive ? 'منوی دیجیتال شما منتشر شده و زنده است!' : 'منوی دیجیتال شما هنوز منتشر نشده است!'}
              </h3>
              {isMenuLive && (
                <span className="text-[10px] bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 px-2.5 py-0.5 rounded-lg font-black shrink-0">
                  نسخه {activePublication?.version || '۱.۰'}
                </span>
              )}
            </div>
            <p className="text-[11px] sm:text-xs text-slate-400 mt-1.5 leading-relaxed max-w-[60ch]">
              {isMenuLive 
                ? `آخرین انتشار سراسری در تاریخ ${lastPublishedAt} انجام شده است. مشتریان چیدمان زنده را مشاهده می‌کنند.`
                : 'تغییرات چیدمان و کالاها در حالت پیش‌نویس قرار دارد. برای بارگیری منو برای مشتریان، به ویرایشگر بروید و انتشار سراسری را بزنید.'
              }
            </p>
          </div>
        </div>

        {/* Action triggers (Publish/Rollback) */}
        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto shrink-0 justify-center md:justify-end">
          {sortedHistory.length > 1 && isMenuLive && (
            <button
              onClick={handleRollback}
              disabled={isRollingBack}
              className="px-5 py-3.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-2xl text-xs font-bold transition-all flex items-center justify-center gap-2 active:scale-95 disabled:opacity-80"
            >
              {isRollingBack ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <RotateCcw className="w-4 h-4" />
              )}
              <span>{rollbackSuccess ? 'بازگردانی شد!' : 'بازگردانی به نسخه قبل'}</span>
            </button>
          )}

          {onNavigateDesigner && (
            <button
              onClick={onNavigateDesigner}
              className={`px-6 py-3.5 ${isMenuLive ? `bg-${brandColor}-600 text-white hover:bg-${brandColor}-700 shadow-lg shadow-${brandColor}-600/10` : 'bg-orange-600 hover:bg-orange-700 text-white shadow-lg'} rounded-2xl text-xs font-black transition-all flex items-center justify-center gap-2 active:scale-95`}
            >
              <Compass className="w-4 h-4" />
              <span>{isMenuLive ? 'ویرایش چیدمان منو' : 'طراحی و انتشار منو'}</span>
            </button>
          )}
        </div>
      </div>

      {/* 4. METRICS & STATISTICS GRID (Compact, space-efficient 2-columns on mobile) */}
      {products.length === 0 ? (
        <motion.div 
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-[var(--app-surface)] border border-slate-100 dark:border-[var(--app-border)] p-5 sm:p-6 md:p-8 rounded-[2rem] shadow-sm flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-right"
        >
          <div className="flex flex-col md:flex-row items-center gap-4">
            <div className="p-3 bg-amber-50 dark:bg-amber-950/30 text-amber-500 rounded-2xl shrink-0">
              <ShoppingBag className="w-7 h-7" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-black text-slate-800 dark:text-slate-200">هنوز کالا یا دسته‌ای ثبت نکرده‌اید!</h3>
              <p className="text-[11px] sm:text-xs text-slate-400 mt-1 leading-relaxed max-w-[55ch]">
                برای فعال شدن منوی دیجیتال لایو و نمایش به مشتریان، ابتدا چند دسته اصلی تعریف کرده و اولین محصولات خود را به همراه قیمت و جزئیات اضافه کنید.
              </p>
            </div>
          </div>
          {onNavigateCatalog && (
            <button
              onClick={onNavigateCatalog}
              className={`w-full md:w-auto px-6 py-3.5 bg-${brandColor}-600 text-white rounded-2xl text-xs font-black shadow-lg shadow-${brandColor}-500/10 hover:bg-${brandColor}-700 transition-all flex items-center justify-center gap-2 shrink-0 active:scale-95`}
            >
              <Plus className="w-4 h-4" />
              افزودن اولین محصول
            </button>
          )}
        </motion.div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 relative z-0">
          {statsData.map((stat, index) => (
            <SummaryCard 
              key={stat.id} 
              {...stat} 
              index={index}
              onClick={() => setSelectedStatId(stat.id)}
            />
          ))}
        </div>
      )}

      {/* 5. PUBLIC MENU CARD (quick-link preview with share/copy actions) */}
      {isMenuLive && (
        <div className="bg-white dark:bg-[var(--app-surface)] border border-slate-100 dark:border-[var(--app-border)] p-5 sm:p-6 md:p-8 rounded-[2rem] shadow-[0_4px_24px_rgba(0,0,0,0.01)] dark:shadow-[0_4px_24px_rgba(0,0,0,0.04)] flex flex-col md:flex-row items-center justify-between gap-6 transition-colors">
          <div className="flex flex-col md:flex-row items-center gap-4 text-center md:text-right w-full md:w-auto">
            <div className="p-3 bg-indigo-50 dark:bg-indigo-950/25 text-indigo-600 dark:text-indigo-400 rounded-2xl shrink-0">
              <QrCode className="w-6.5 h-6.5" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-black text-slate-800 dark:text-slate-100">کد QR و لینک اختصاصی منو</h3>
              <p className="text-[11px] sm:text-xs text-slate-400 mt-1 leading-relaxed max-w-[55ch]">
                مشتریان با اسکن این کد QR یا کلیک روی لینک عمومی، به منوی دیجیتال زیبای شما دسترسی خواهند داشت.
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row flex-wrap gap-3 w-full md:w-auto shrink-0 justify-center">
            <button
              onClick={() => setShowQrModal(true)}
              className="w-full sm:w-auto px-4 py-3.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold rounded-2xl transition-all flex items-center justify-center gap-2 active:scale-95"
            >
              <QrCode className="w-4 h-4" />
              <span>دریافت کد QR میزها</span>
            </button>
            <button
              onClick={handleCopyLink}
              className={`w-full sm:w-auto px-4 py-3.5 bg-${brandColor}-55 dark:bg-${brandColor}-950/30 text-${brandColor}-600 dark:text-${brandColor}-400 text-xs font-black rounded-2xl transition-all flex items-center justify-center gap-2 active:scale-95`}
            >
              <LinkIcon className="w-4 h-4" />
              <span>{copiedLink ? 'کپی شد!' : 'کپی لینک منوی اختصاصی'}</span>
            </button>
          </div>
        </div>
      )}

      {/* 6 & 7. TWO-COLUMN SPLIT (Visits & Recent Products list) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
        
        {/* 6. VISITS & TRAFFIC CHART */}
        <div className="lg:col-span-2 bg-white dark:bg-[var(--app-surface)] p-4 sm:p-6 md:p-8 rounded-[2rem] shadow-sm border border-slate-100 dark:border-[var(--app-border)] flex flex-col transition-colors">
          <div className="flex flex-col xs:flex-row gap-4 items-start xs:items-center justify-between mb-6 sm:mb-8">
            <h2 className="text-sm sm:text-base font-black text-slate-850 dark:text-slate-100">تحلیل بازدیدهای منو</h2>
            <div className="flex gap-1.5 bg-slate-100 dark:bg-[var(--app-surface-elevated)] p-1 rounded-xl w-full xs:w-auto justify-between xs:justify-start">
              <button 
                onClick={() => setChartView('weekly')} 
                className={`flex-1 xs:flex-none px-4 py-1.5 text-xs font-bold rounded-lg transition-all ${chartView === 'weekly' ? `bg-white dark:bg-[var(--app-surface)] shadow-sm text-${brandColor}-600 dark:text-${brandColor}-400` : 'text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300'}`}
              >
                هفتگی
              </button>
              <button 
                onClick={() => setChartView('daily')} 
                className={`flex-1 xs:flex-none px-4 py-1.5 text-xs font-bold rounded-lg transition-all ${chartView === 'daily' ? `bg-white dark:bg-[var(--app-surface)] shadow-sm text-${brandColor}-600 dark:text-${brandColor}-400` : 'text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300'}`}
              >
                روزانه
              </button>
            </div>
          </div>
          <div className="h-[220px] sm:h-[300px] md:h-80 w-full relative">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartView === 'weekly' ? WEEKLY_DATA : DAILY_DATA}>
                 <defs>
                   <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                     <stop offset="5%" stopColor={chartHexColor} stopOpacity={0.15}/>
                     <stop offset="95%" stopColor={chartHexColor} stopOpacity={0}/>
                   </linearGradient>
                 </defs>
                 <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={isDark ? '#26262b' : '#f1f5f9'} />
                 <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94a3b8' }} dy={10} />
                 <YAxis axisLine={false} tickLine={false} width={30} tickFormatter={(value) => value} tick={{ fontSize: 10, fill: '#94a3b8' }} dx={-10} />
                 <Tooltip 
                    cursor={{ stroke: isDark ? '#26262b' : '#e2e8f0', strokeWidth: 1, strokeDasharray: '4 4' }}
                    content={({ active, payload, label }: any) => {
                      if (active && payload && payload.length) {
                        return (
                          <div className="bg-white dark:bg-[var(--app-surface)] text-slate-800 dark:text-slate-200 p-3 sm:p-4 rounded-2xl shadow-xl border border-slate-100 dark:border-[var(--app-border)] text-xs z-[100] relative">
                            <p className="font-bold mb-1 sm:mb-2 text-slate-400">{label}</p>
                            <div className="flex items-center gap-2">
                              <span className={`text-${brandColor}-600 dark:text-${brandColor}-400 font-black text-xs sm:text-sm`}>{(payload[0] && payload[0].value !== undefined && payload[0].value !== null) ? payload[0].value.toLocaleString() : '۰'} بازدید</span>
                            </div>
                          </div>
                        );
                      }
                      return null;
                    }}
                    wrapperStyle={{ zIndex: 1000 }} 
                 />
                 <Area type="monotone" dataKey="revenue" stroke={chartHexColor} strokeWidth={3} fillOpacity={1} fill="url(#colorRev)" />
               </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 7. RECENT POPULAR PRODUCTS / CATALOG HEALTH */}
        <div className="bg-white dark:bg-[var(--app-surface)] p-4 sm:p-6 md:p-8 rounded-[2rem] shadow-sm border border-slate-100 dark:border-[var(--app-border)] transition-colors">
          <h2 className="text-sm sm:text-base font-black text-slate-850 dark:text-slate-100 mb-6">محبوب‌ترین محصولات</h2>
          <div className="space-y-4 sm:space-y-6">
            {popularProducts.map((prod, i) => (
              <div key={i} className="flex items-center justify-between gap-3 group p-1 rounded-xl min-w-0">
                 <div className="flex items-center gap-3 min-w-0">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl overflow-hidden bg-slate-50 dark:bg-slate-800 flex items-center justify-center shrink-0 border border-slate-100 dark:border-slate-800">
                       {prod.image ? (
                         <img src={prod.image} alt={prod.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform" referrerPolicy="no-referrer" />
                       ) : (
                         <ShoppingBag className="w-4 h-4 sm:w-5 sm:h-5 text-slate-400" />
                       )}
                    </div>
                    <div className="min-w-0">
                       <h4 className="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-200 truncate">{prod.name}</h4>
                       <span className="text-[10px] font-medium text-slate-400 dark:text-slate-500 truncate block">{prod.category}</span>
                    </div>
                 </div>
                 <div className="text-left shrink-0">
                    <p className="text-xs sm:text-sm font-black text-slate-700 dark:text-slate-300 font-mono">
                      {prod.price !== undefined && prod.price !== null ? prod.price.toLocaleString() : '۰'} تومان
                    </p>
                    <span className={`text-[9px] sm:text-[10px] text-${brandColor}-500 font-bold`}>{30 + (i * 12)} بازدید</span>
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
               className="w-full mt-8 py-3 bg-slate-50 dark:bg-[var(--app-surface-elevated)] text-slate-500 dark:text-slate-400 text-xs font-bold rounded-xl flex items-center justify-center gap-2 hover:bg-slate-100 dark:hover:bg-[var(--app-hover)] transition-colors"
            >
               مدیریت محصولات <ChevronLeft className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* QR MODAL / BOTTOM SHEET */}
      <AnimatePresence>
        {showQrModal && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] flex items-end sm:items-center justify-center p-0 sm:p-4"
          >
            <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm" onClick={() => setShowQrModal(false)} />
            <motion.div 
              initial={{ 
                opacity: 0, 
                y: window.innerWidth < 640 ? '100%' : 16, 
                scale: window.innerWidth < 640 ? 1 : 0.95 
              }}
              animate={{ 
                opacity: 1, 
                y: 0, 
                scale: 1 
              }}
              exit={{ 
                opacity: 0, 
                y: window.innerWidth < 640 ? '100%' : 16, 
                scale: window.innerWidth < 640 ? 1 : 0.95 
              }}
              transition={{ type: "spring", stiffness: 350, damping: 30 }}
              className="bg-white dark:bg-[var(--app-surface)] w-full sm:max-w-sm rounded-t-[2.5rem] sm:rounded-[2.5rem] shadow-2xl relative z-10 p-6 sm:p-8 text-center border-t sm:border border-slate-100 dark:border-[var(--app-border)] max-h-[90dvh] overflow-y-auto"
            >
              {/* Mobile Swipe Handle */}
              <div className="w-12 h-1.5 bg-slate-200 dark:bg-slate-800 rounded-full mx-auto mb-4 sm:hidden shrink-0" />

              <div className="flex items-center justify-between mb-6">
                <h3 className="font-black text-base text-slate-800 dark:text-slate-200">کد QR منوی دیجیتال</h3>
                <button onClick={() => setShowQrModal(false)} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full text-slate-400">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="w-48 h-48 bg-slate-50 dark:bg-slate-800 p-4 rounded-3xl mx-auto mb-6 border border-slate-150 dark:border-slate-700 flex items-center justify-center">
                <div className="w-full h-full bg-white p-2 rounded-2xl flex items-center justify-center shadow-inner">
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

      {/* DETAILED STAT POPUP / BOTTOM SHEET */}
      {typeof document !== 'undefined' && createPortal(
        <AnimatePresence>
          {selectedStatId && selectedStat && (
            <motion.div className="fixed inset-0 z-[9999] flex items-end sm:items-center justify-center p-0 sm:p-4">
              <motion.button
                aria-label="بستن پنجره"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 h-full w-full bg-slate-950/60 backdrop-blur-sm cursor-pointer outline-none border-none pointer-events-auto"
                onClick={() => setSelectedStatId(null)}
              />
              <div className="relative z-10 flex min-h-full items-end sm:items-center justify-center p-0 sm:p-4 w-full max-w-sm pointer-events-none">
                <motion.div
                  role="dialog"
                  aria-modal="true"
                  initial={{ 
                    y: window.innerWidth < 640 ? '100%' : 20, 
                    opacity: window.innerWidth < 640 ? 1 : 0 
                  }}
                  animate={{ 
                    y: 0, 
                    opacity: 1 
                  }}
                  exit={{ 
                    y: window.innerWidth < 640 ? '100%' : 20, 
                    opacity: window.innerWidth < 640 ? 1 : 0 
                  }}
                  transition={{ type: "spring", stiffness: 350, damping: 30 }}
                  className="bg-white dark:bg-[var(--app-surface)] w-full rounded-t-[2rem] sm:rounded-[1.5rem] shadow-2xl relative overflow-hidden border-t sm:border border-slate-100 dark:border-[var(--app-border)] flex flex-col pointer-events-auto max-h-[90dvh]"
                >
                  {/* Mobile Swipe Handle */}
                  <div className="w-12 h-1.5 bg-slate-200 dark:bg-slate-800 rounded-full mx-auto mt-4 sm:hidden shrink-0" />
                  
                  <ExpandedCardContent stat={selectedStat} onClose={() => setSelectedStatId(null)} />
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>,
        document.body
      )}

    </div>
  );
};

export default Dashboard;
