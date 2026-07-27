import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Store, 
  MapPin, 
  Phone, 
  Globe, 
  Clock, 
  Palette, 
  Save, 
  Upload,
  Camera,
  CheckCircle2,
  User,
  Plus,
  Trash2,
  Edit2,
  X,
  Loader2,
  Check,
  Sun,
  Moon,
  AlertCircle
} from 'lucide-react';
import { useTenant, useAppSession } from '../data/useRepositories';
import { useRepositories } from '../data/RepositoryProvider';
import { useTheme } from './ThemeProvider';
import { Branch } from '../domain';

interface SettingsPageProps {
  restaurantName: string;
  setRestaurantName: (name: string) => void;
  restaurantLogo: string;
  setRestaurantLogo: (logo: string) => void;
  brandColor: string;
  setBrandColor: (color: string) => void;
  initialTab?: 'restaurant' | 'branches' | 'account' | 'appearance';
  onTabChange?: (tab: 'restaurant' | 'branches' | 'account' | 'appearance') => void;
}

const COLORS = [
  { id: 'emerald', hex: '#10b981', name: 'سبز زمردی' },
  { id: 'blue', hex: '#3b82f6', name: 'آبی اقیانوسی' },
  { id: 'purple', hex: '#a855f7', name: 'بنفش سلطنتی' },
  { id: 'orange', hex: '#f97316', name: 'نارنجی خورشیدی' },
  { id: 'red', hex: '#ef4444', name: 'قرمز پرانرژی' },
  { id: 'violet', hex: '#8b5cf6', name: 'یاسی مدرن' },
  { id: 'pink', hex: '#ec4899', name: 'صورتی ملایم' },
  { id: 'zinc', hex: '#71717a', name: 'خاکستری سرد' },
  { id: 'slate', hex: '#64748b', name: 'سنگ لوح' },
];

const INITIAL_HOURS = [
  { id: 1, label: 'شنبه', isOpen: true, start: '11:00', end: '23:00' },
  { id: 2, label: 'یکشنبه', isOpen: true, start: '11:00', end: '23:00' },
  { id: 3, label: 'دوشنبه', isOpen: true, start: '11:00', end: '23:00' },
  { id: 4, label: 'سه‌شنبه', isOpen: true, start: '11:00', end: '23:00' },
  { id: 5, label: 'چهارشنبه', isOpen: true, start: '11:00', end: '23:00' },
  { id: 6, label: 'پنج‌شنبه', isOpen: true, start: '11:00', end: '24:00' },
  { id: 7, label: 'جمعه', isOpen: true, start: '12:00', end: '24:00' },
];

const DAY_KEY_MAP: { [key: number]: string } = {
  1: 'saturday',
  2: 'sunday',
  3: 'monday',
  4: 'tuesday',
  5: 'wednesday',
  6: 'thursday',
  7: 'friday'
};

function parseHoursFromStorage(storedHours: Record<string, string> | any): typeof INITIAL_HOURS {
  if (!storedHours || typeof storedHours !== 'object' || Array.isArray(storedHours)) {
    if (Array.isArray(storedHours)) {
      return storedHours;
    }
    return INITIAL_HOURS;
  }

  return INITIAL_HOURS.map(dayTemplate => {
    const key = DAY_KEY_MAP[dayTemplate.id];
    if (!key || !storedHours[key]) return dayTemplate;

    const val = storedHours[key];
    if (val === 'تعطیل' || val === 'Closed') {
      return {
        ...dayTemplate,
        isOpen: false,
        start: '12:00',
        end: '23:30'
      };
    }

    const parts = val.split('-').map((p: string) => p.trim());
    if (parts.length === 2) {
      return {
        ...dayTemplate,
        isOpen: true,
        start: parts[0],
        end: parts[1]
      };
    }

    return dayTemplate;
  });
}

function serializeHoursToStorage(uiHours: typeof INITIAL_HOURS): Record<string, string> {
  const result: Record<string, string> = {};
  uiHours.forEach(day => {
    const key = DAY_KEY_MAP[day.id];
    if (key) {
      if (day.isOpen) {
        result[key] = `${day.start} - ${day.end}`;
      } else {
        result[key] = 'تعطیل';
      }
    }
  });
  return result;
}

const SettingsPage: React.FC<SettingsPageProps> = ({ 
  restaurantName, 
  setRestaurantName, 
  restaurantLogo,
  setRestaurantLogo,
  brandColor,
  setBrandColor,
  initialTab = 'restaurant',
  onTabChange
}) => {
  const { restaurant, updateInfo } = useTenant();
  const { user, refetchSession } = useAppSession();
  const { tenantRepository, authRepository } = useRepositories();
  const { theme, setTheme } = useTheme();

  // Selected subcategory state
  const [activeTab, setActiveTabState] = useState<'restaurant' | 'branches' | 'account' | 'appearance'>(initialTab);

  useEffect(() => {
    if (initialTab) {
      setActiveTabState(initialTab);
    }
  }, [initialTab]);

  const handleTabChange = (tab: 'restaurant' | 'branches' | 'account' | 'appearance') => {
    setActiveTabState(tab);
    if (onTabChange) {
      onTabChange(tab);
    }
  };

  // 1. Restaurant Settings States
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [description, setDescription] = useState('');
  const [hours, setHours] = useState(INITIAL_HOURS);
  const [restaurantSaving, setRestaurantSaving] = useState(false);
  const [restaurantSuccess, setRestaurantSuccess] = useState(false);

  useEffect(() => {
    if (restaurant) {
      if (restaurant.address) setAddress(restaurant.address);
      if (restaurant.phone) setPhone(restaurant.phone);
      if (restaurant.description) setDescription(restaurant.description);
      if (restaurant.hours) {
        setHours(parseHoursFromStorage(restaurant.hours));
      }
    }
  }, [restaurant]);

  const handleSaveRestaurant = async () => {
    try {
      setRestaurantSaving(true);
      await updateInfo({
        name: restaurantName,
        address,
        phone,
        description,
        hours: serializeHoursToStorage(hours)
      });
      setRestaurantSuccess(true);
      setTimeout(() => setRestaurantSuccess(false), 3000);
    } catch (e) {
      console.error('Error saving restaurant settings:', e);
    } finally {
      setRestaurantSaving(false);
    }
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setRestaurantLogo(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // 2. Branches Settings States
  const [branches, setBranches] = useState<Branch[]>([]);
  const [branchesLoading, setBranchesLoading] = useState(false);
  const [branchesSaving, setBranchesSaving] = useState(false);
  const [branchesError, setBranchesError] = useState<string | null>(null);

  // New branch inputs
  const [isAddingBranch, setIsAddingBranch] = useState(false);
  const [newBranchName, setNewBranchName] = useState('');
  const [newBranchAddress, setNewBranchAddress] = useState('');
  const [newBranchPhone, setNewBranchPhone] = useState('');

  // Editing branch ID
  const [editingBranchId, setEditingBranchId] = useState<string | null>(null);
  const [editBranchName, setEditBranchName] = useState('');
  const [editBranchAddress, setEditBranchAddress] = useState('');
  const [editBranchPhone, setEditBranchPhone] = useState('');

  const loadBranches = async () => {
    try {
      setBranchesLoading(true);
      const list = await tenantRepository.getBranches();
      setBranches(list);
    } catch (err: any) {
      console.error('Error loading branches:', err);
      setBranchesError('خطا در دریافت لیست شعب');
    } finally {
      setBranchesLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'branches') {
      loadBranches();
    }
  }, [activeTab]);

  const handleCreateBranch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBranchName.trim() || !newBranchAddress.trim()) return;
    try {
      setBranchesSaving(true);
      if (tenantRepository.createBranch && restaurant) {
        await tenantRepository.createBranch(restaurant.id, newBranchName, newBranchAddress, newBranchPhone);
        setNewBranchName('');
        setNewBranchAddress('');
        setNewBranchPhone('');
        setIsAddingBranch(false);
        await loadBranches();
        await refetchSession();
      }
    } catch (err: any) {
      setBranchesError('خطا در ثبت شعبه جدید');
    } finally {
      setBranchesSaving(false);
    }
  };

  const handleUpdateBranch = async (branchId: string) => {
    if (!editBranchName.trim() || !editBranchAddress.trim()) return;
    try {
      setBranchesSaving(true);
      if (tenantRepository.updateBranch) {
        await tenantRepository.updateBranch(branchId, {
          name: editBranchName,
          address: editBranchAddress,
          phone: editBranchPhone
        });
        setEditingBranchId(null);
        await loadBranches();
        await refetchSession();
      }
    } catch (err: any) {
      setBranchesError('خطا در بروزرسانی اطلاعات شعبه');
    } finally {
      setBranchesSaving(false);
    }
  };

  const handleDeleteBranch = async (branchId: string) => {
    if (!confirm('آیا از حذف این شعبه اطمینان دارید؟ این عملیات غیرقابل بازگشت است.')) return;
    try {
      setBranchesSaving(true);
      if (tenantRepository.deleteBranch) {
        await tenantRepository.deleteBranch(branchId);
        await loadBranches();
        await refetchSession();
      }
    } catch (err: any) {
      setBranchesError('خطا در حذف شعبه');
    } finally {
      setBranchesSaving(false);
    }
  };

  // 3. User Account Settings States
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [userPhone, setUserPhone] = useState('');
  const [accountSaving, setAccountSaving] = useState(false);
  const [accountSuccess, setAccountSuccess] = useState(false);
  const [accountError, setAccountError] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      setFirstName(user.firstName || '');
      setLastName(user.lastName || '');
      setEmail(user.email || '');
      setUserPhone(user.phone || '');
    }
  }, [user, activeTab]);

  const handleSaveAccount = async () => {
    if (!firstName.trim() || !lastName.trim() || !email.trim()) {
      setAccountError('لطفاً فیلدهای الزامی را تکمیل کنید.');
      return;
    }
    try {
      setAccountSaving(true);
      setAccountError(null);
      if (user && authRepository.updateProfile) {
        await authRepository.updateProfile(user.id, {
          firstName,
          lastName,
          email,
          phone: userPhone
        });
        setAccountSuccess(true);
        await refetchSession();
        setTimeout(() => setAccountSuccess(false), 3000);
      }
    } catch (err: any) {
      setAccountError('خطا در ذخیره‌سازی اطلاعات کاربری');
    } finally {
      setAccountSaving(false);
    }
  };

  const tabs = [
    { id: 'restaurant', label: 'تنظیمات رستوران', icon: Store },
    { id: 'branches', label: 'مدیریت شعب', icon: MapPin },
    { id: 'account', label: 'حساب کاربری', icon: User },
    { id: 'appearance', label: 'ظاهر و تم', icon: Palette }
  ] as const;

  return (
    <div className="h-full bg-slate-50 dark:bg-slate-950 font-['Vazirmatn'] overflow-y-auto p-4 sm:p-6 lg:p-8 pb-24 transition-colors" style={{ direction: 'rtl' }}>
      <div className="max-w-[1440px] mx-auto space-y-6 sm:space-y-8">
        
        {/* Page title area */}
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-slate-100 flex items-center gap-3">
             <Store className={`w-6 h-6 sm:w-7 sm:h-7 text-${brandColor}-600 dark:text-${brandColor}-400`} />
             تنظیمات سیستم
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 dark:text-slate-500 mt-1">شخصی‌سازی برند، مدیریت اطلاعات فروشگاهی، شعب فعال و تنظیمات پوسته پنل مدیریت</p>
        </div>

        {/* Outer Split Layout */}
        <div className="flex flex-col lg:flex-row gap-8 items-start">
          
          {/* 1. Left Side: Navigation Tabs Sidebar (Desktop) or Horizontal Slider (Mobile) */}
          <div className="w-full lg:w-64 shrink-0 flex flex-col gap-2">
            
            {/* Desktop list layout */}
            <div className="hidden lg:flex flex-col gap-1.5 w-full bg-white dark:bg-slate-900/60 p-2 rounded-3xl border border-slate-200/50 dark:border-slate-800">
              {tabs.map(tab => {
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => handleTabChange(tab.id)}
                    className={`w-full text-right px-4 py-3 rounded-2xl text-xs font-bold transition-all flex items-center gap-3 group border ${
                      isActive 
                        ? `bg-${brandColor}-50 dark:bg-${brandColor}-950/20 border-${brandColor}-500/10 dark:border-${brandColor}-500/20 text-${brandColor}-600 dark:text-${brandColor}-400` 
                        : 'border-transparent text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50 hover:text-slate-800 dark:hover:text-slate-200'
                    }`}
                  >
                    <tab.icon className={`w-4.5 h-4.5 shrink-0 ${isActive ? `text-${brandColor}-500` : 'text-slate-400 group-hover:text-slate-500'}`} />
                    <span className="truncate">{tab.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Mobile horizontal scrolling tab slider */}
            <div className="lg:hidden flex overflow-x-auto gap-2 pb-2 w-full scrollbar-hide select-none -mx-4 px-4 sm:mx-0 sm:px-0">
              {tabs.map(tab => {
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => handleTabChange(tab.id)}
                    className={`px-4 py-2.5 rounded-full text-xs font-bold transition-all flex items-center gap-2 border whitespace-nowrap shrink-0 ${
                      isActive 
                        ? `bg-${brandColor}-500 text-white border-transparent shadow-sm` 
                        : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400'
                    }`}
                  >
                    <tab.icon className="w-4 h-4 shrink-0" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 2. Right Side: Tab Panel Content Pane */}
          <div className="flex-1 w-full min-w-0">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                className="w-full"
              >
                
                {/* CATEGORY 1: RESTAURANT SETTINGS */}
                {activeTab === 'restaurant' && (
                  <div className="space-y-6 sm:space-y-8">
                    
                    {/* Visual identity component */}
                    <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200/50 dark:border-slate-800 shadow-sm space-y-6">
                      <div className="flex items-start gap-3 sm:gap-4 border-b border-slate-100 dark:border-slate-800/60 pb-5">
                        <div className={`p-2.5 rounded-2xl bg-${brandColor}-50 dark:bg-${brandColor}-950/30 text-${brandColor}-600 dark:text-${brandColor}-400`}>
                          <Store className="w-5.5 h-5.5" />
                        </div>
                        <div>
                          <h2 className="text-sm sm:text-base font-black text-slate-800 dark:text-slate-100">هویت بصری و برندینگ</h2>
                          <p className="text-[11px] sm:text-xs text-slate-400 dark:text-slate-500 mt-0.5">نام رسمی، نشان تجاری (لوگو) و معرفی کوتاه مجموعه</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-2xl bg-slate-50 dark:bg-slate-950/40 relative group">
                          {restaurantLogo && restaurantLogo.trim() !== '' ? (
                            <img src={restaurantLogo} alt="Logo" className="w-28 h-28 object-cover rounded-full shadow-md mb-4" referrerPolicy="no-referrer" />
                          ) : (
                            <div className="w-28 h-28 bg-slate-200 dark:bg-slate-800 rounded-full flex items-center justify-center text-slate-400 dark:text-slate-500 mb-4">
                              <Camera className="w-9 h-9" />
                            </div>
                          )}
                          <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                            <span className="text-white text-xs font-bold flex items-center gap-2">
                              <Upload className="w-4 h-4" /> تغییر لوگو
                            </span>
                          </div>
                          <input type="file" accept="image/*" onChange={handleLogoUpload} className="absolute inset-0 opacity-0 cursor-pointer" />
                          <p className="text-[10px] text-slate-400 dark:text-slate-500">تصویر با فرمت JPG یا PNG</p>
                        </div>

                        <div className="md:col-span-2 space-y-5">
                          <div>
                            <label className="text-xs font-bold text-slate-500 dark:text-slate-400 block mb-2">نام رستوران <span className="text-rose-500">*</span></label>
                            <input 
                              type="text" 
                              value={restaurantName}
                              onChange={(e) => setRestaurantName(e.target.value)}
                              className={`w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 text-xs focus:border-${brandColor}-500 outline-none transition-colors font-bold text-slate-800 dark:text-slate-100`}
                              placeholder="مثال: رستوران لیمو"
                            />
                          </div>
                          <div>
                            <label className="text-xs font-bold text-slate-500 dark:text-slate-400 block mb-2">توضیحات کوتاه (شعار)</label>
                            <textarea 
                              rows={3}
                              value={description}
                              onChange={(e) => setDescription(e.target.value)}
                              className={`w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 text-xs focus:border-${brandColor}-500 outline-none transition-colors resize-none text-slate-800 dark:text-slate-100`}
                              placeholder="معرفی بسیار کوتاه برای نمایش در منوی مشتریان..."
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Contact and address */}
                    <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200/50 dark:border-slate-800 shadow-sm space-y-6">
                      <div className="flex items-start gap-3 sm:gap-4 border-b border-slate-100 dark:border-slate-800/60 pb-5">
                        <div className={`p-2.5 rounded-2xl bg-${brandColor}-50 dark:bg-${brandColor}-950/30 text-${brandColor}-600 dark:text-${brandColor}-400`}>
                          <MapPin className="w-5.5 h-5.5" />
                        </div>
                        <div>
                          <h2 className="text-sm sm:text-base font-black text-slate-800 dark:text-slate-100">اطلاعات تماس و آدرس</h2>
                          <p className="text-[11px] sm:text-xs text-slate-400 dark:text-slate-500 mt-0.5">راه‌های ارتباطی مشتریان و مکان قرارگیری فیزیکی مجموعه</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="text-xs font-bold text-slate-500 dark:text-slate-400 block mb-2">آدرس کامل</label>
                          <textarea 
                            rows={3}
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                            className={`w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 text-xs focus:border-${brandColor}-500 outline-none transition-colors text-slate-800 dark:text-slate-100 resize-none`}
                            placeholder="تهران، خیابان..."
                          />
                        </div>
                        <div className="space-y-4">
                          <div>
                            <label className="text-xs font-bold text-slate-500 dark:text-slate-400 block mb-2">شماره تماس مجموعه</label>
                            <input 
                              type="text" 
                              value={phone}
                              onChange={(e) => setPhone(e.target.value)}
                              className={`w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 text-xs focus:border-${brandColor}-500 outline-none transition-colors text-slate-800 dark:text-slate-100 font-mono`}
                              dir="ltr"
                              placeholder="021XXXXXXXX"
                            />
                          </div>
                          <div>
                            <label className="text-xs font-bold text-slate-500 dark:text-slate-400 block mb-2">لینک وب‌سایت یا شبکه‌های اجتماعی</label>
                            <input 
                              type="text" 
                              placeholder="example.com"
                              className={`w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 text-xs focus:border-${brandColor}-500 outline-none transition-colors text-slate-800 dark:text-slate-100 font-mono`}
                              dir="ltr"
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Working Hours */}
                    <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200/50 dark:border-slate-800 shadow-sm space-y-6">
                      <div className="flex items-start gap-3 sm:gap-4 border-b border-slate-100 dark:border-slate-800/60 pb-5">
                        <div className={`p-2.5 rounded-2xl bg-${brandColor}-50 dark:bg-${brandColor}-950/30 text-${brandColor}-600 dark:text-${brandColor}-400`}>
                          <Clock className="w-5.5 h-5.5" />
                        </div>
                        <div>
                          <h2 className="text-sm sm:text-base font-black text-slate-800 dark:text-slate-100">ساعات کاری هفتگی</h2>
                          <p className="text-[11px] sm:text-xs text-slate-400 dark:text-slate-500 mt-0.5">زمان‌بندی سرویس‌دهی فعال در روزهای هفته</p>
                        </div>
                      </div>

                      <div className="space-y-3.5">
                        {hours.map((day) => (
                          <div key={day.id} className="flex flex-col sm:flex-row sm:items-center sm:justify-between py-3 gap-3 border-b border-slate-100 dark:border-slate-800/30 last:border-0">
                            
                            {/* Day name & toggle switch */}
                            <div className="flex items-center justify-between sm:justify-start gap-4 sm:w-1/3">
                              <div className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                                 <div className={`w-1.5 h-1.5 rounded-full ${day.isOpen ? `bg-${brandColor}-500` : 'bg-slate-300'}`} />
                                 {day.label}
                              </div>
                              <button 
                                onClick={() => setHours(hours.map(h => h.id === day.id ? { ...h, isOpen: !h.isOpen } : h))} 
                                className={`w-10 h-6 rounded-full relative transition-colors ${day.isOpen ? `bg-${brandColor}-500` : 'bg-slate-200 dark:bg-slate-800'}`}
                                title={day.isOpen ? 'فعال' : 'تعطیل'}
                              >
                                <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all shadow-sm ${day.isOpen ? 'left-1' : 'left-5'}`} />
                              </button>
                            </div>

                            {/* Hour picker fields */}
                            <div className="flex items-center gap-2 justify-start sm:justify-end flex-1">
                              {day.isOpen ? (
                                <div className="flex items-center gap-2 w-full sm:w-auto">
                                  <div className="flex-1 sm:flex-initial">
                                    <input 
                                      type="text" 
                                      value={day.start} 
                                      onChange={(e) => setHours(hours.map(h => h.id === day.id ? { ...h, start: e.target.value } : h))}
                                      className="w-full sm:w-20 text-center text-xs font-bold bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg py-2 focus:border-slate-450 dark:focus:border-slate-700 outline-none transition-colors text-slate-800 dark:text-slate-100 font-mono" 
                                      dir="ltr" 
                                    />
                                  </div>
                                  <span className="text-slate-300 font-bold">-</span>
                                  <div className="flex-1 sm:flex-initial">
                                    <input 
                                      type="text" 
                                      value={day.end} 
                                      onChange={(e) => setHours(hours.map(h => h.id === day.id ? { ...h, end: e.target.value } : h))}
                                      className="w-full sm:w-20 text-center text-xs font-bold bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg py-2 focus:border-slate-450 dark:focus:border-slate-700 outline-none transition-colors text-slate-800 dark:text-slate-100 font-mono" 
                                      dir="ltr" 
                                    />
                                  </div>
                                </div>
                              ) : (
                                <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 bg-slate-100 dark:bg-slate-950/60 px-4 py-2 rounded-lg w-full text-center border border-slate-200/50 dark:border-slate-800/40">تعطیل</span>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Restaurant actions footer bar */}
                    <div className="flex justify-end pt-2">
                      <button 
                         onClick={handleSaveRestaurant}
                         disabled={restaurantSaving}
                         className={`w-full sm:w-auto justify-center px-6 py-3.5 bg-${brandColor}-600 text-white rounded-2xl text-xs font-bold shadow-md hover:bg-${brandColor}-700 transition-all flex items-center gap-2.5`}
                      >
                         {restaurantSaving ? (
                           <Loader2 className="w-4 h-4 animate-spin" />
                         ) : restaurantSuccess ? (
                           <CheckCircle2 className="w-4.5 h-4.5" />
                         ) : (
                           <Save className="w-4.5 h-4.5" />
                         )}
                         {restaurantSaving ? 'در حال ذخیره‌سازی...' : restaurantSuccess ? 'تنظیمات با موفقیت ذخیره شد' : 'ذخیره کل تغییرات'}
                      </button>
                    </div>

                  </div>
                )}

                {/* CATEGORY 2: BRANCH MANAGEMENT */}
                {activeTab === 'branches' && (
                  <div className="space-y-6 sm:space-y-8">
                    
                    {/* List area */}
                    <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200/50 dark:border-slate-800 shadow-sm space-y-6">
                      <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800/60 pb-5 gap-4">
                        <div className="flex items-start gap-3 sm:gap-4">
                          <div className={`p-2.5 rounded-2xl bg-${brandColor}-50 dark:bg-${brandColor}-950/30 text-${brandColor}-600 dark:text-${brandColor}-400`}>
                            <MapPin className="w-5.5 h-5.5" />
                          </div>
                          <div>
                            <h2 className="text-sm sm:text-base font-black text-slate-800 dark:text-slate-100">شعبه‌های فعال رستوران</h2>
                            <p className="text-[11px] sm:text-xs text-slate-400 dark:text-slate-500 mt-0.5">افزودن، ویرایش و مدیریت اطلاعات مکانی شعبات رستوران شما</p>
                          </div>
                        </div>

                        {!isAddingBranch && (
                          <button
                            onClick={() => {
                              setIsAddingBranch(true);
                              setEditingBranchId(null);
                            }}
                            className={`px-4 py-2 bg-${brandColor}-600 text-white rounded-xl text-xs font-black hover:bg-${brandColor}-700 transition-all flex items-center gap-1.5 shrink-0`}
                          >
                            <Plus className="w-4 h-4" />
                            <span>شعبه جدید</span>
                          </button>
                        )}
                      </div>

                      {branchesError && (
                        <div className="p-4 bg-rose-50 dark:bg-rose-950/20 border border-rose-100 dark:border-rose-800 rounded-2xl flex items-center gap-3 text-rose-600 dark:text-rose-400">
                          <AlertCircle className="w-5 h-5 shrink-0" />
                          <span className="text-xs font-bold">{branchesError}</span>
                          <button onClick={() => setBranchesError(null)} className="mr-auto text-rose-400 hover:text-rose-600">
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      )}

                      {/* Add Branch Inline Form */}
                      <AnimatePresence>
                        {isAddingBranch && (
                          <motion.form 
                            onSubmit={handleCreateBranch}
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="p-5 border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/40 rounded-2xl space-y-4 overflow-hidden"
                          >
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-xs font-black text-slate-700 dark:text-slate-300">ثبت اطلاعات شعبه جدید</span>
                              <button 
                                type="button"
                                onClick={() => setIsAddingBranch(false)}
                                className="p-1 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-full transition-colors text-slate-400"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                              <div>
                                <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 block mb-1.5">نام شعبه <span className="text-rose-500">*</span></label>
                                <input
                                  type="text"
                                  required
                                  value={newBranchName}
                                  onChange={(e) => setNewBranchName(e.target.value)}
                                  className={`w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2.5 text-xs outline-none focus:border-${brandColor}-500 font-bold text-slate-800 dark:text-slate-100`}
                                  placeholder="مثال: شعبه جردن"
                                />
                              </div>
                              <div>
                                <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 block mb-1.5">شماره تلفن</label>
                                <input
                                  type="text"
                                  value={newBranchPhone}
                                  onChange={(e) => setNewBranchPhone(e.target.value)}
                                  className={`w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2.5 text-xs outline-none focus:border-${brandColor}-500 text-slate-800 dark:text-slate-100 font-mono`}
                                  dir="ltr"
                                  placeholder="021XXXXXXXX"
                                />
                              </div>
                              <div>
                                <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 block mb-1.5">آدرس فیزیکی شعبه <span className="text-rose-500">*</span></label>
                                <input
                                  type="text"
                                  required
                                  value={newBranchAddress}
                                  onChange={(e) => setNewBranchAddress(e.target.value)}
                                  className={`w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2.5 text-xs outline-none focus:border-${brandColor}-500 text-slate-800 dark:text-slate-100`}
                                  placeholder="خیابان، پلاک، طبقه..."
                                />
                              </div>
                            </div>
                            <div className="flex justify-end gap-2.5 pt-1">
                              <button
                                type="button"
                                onClick={() => setIsAddingBranch(false)}
                                className="px-4 py-2 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 text-xs font-bold rounded-xl transition-colors"
                              >
                                انصراف
                              </button>
                              <button
                                type="submit"
                                disabled={branchesSaving}
                                className={`px-5 py-2 bg-${brandColor}-600 text-white text-xs font-black rounded-xl hover:bg-${brandColor}-700 transition-colors flex items-center gap-1.5`}
                              >
                                {branchesSaving && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                                ثبت نهایی شعبه
                              </button>
                            </div>
                          </motion.form>
                        )}
                      </AnimatePresence>

                      {/* Branches List container */}
                      {branchesLoading ? (
                        <div className="flex flex-col items-center justify-center py-12 gap-3 text-slate-400">
                          <Loader2 className="w-7 h-7 animate-spin text-slate-400" />
                          <span className="text-xs font-bold">در حال دریافت لیست شعبات...</span>
                        </div>
                      ) : branches.length === 0 ? (
                        <div className="p-8 text-center bg-slate-50 dark:bg-slate-950/20 rounded-2xl border border-slate-200/50 dark:border-slate-800">
                          <MapPin className="w-10 h-10 text-slate-300 dark:text-slate-700 mx-auto mb-3" />
                          <p className="text-xs font-bold text-slate-500 dark:text-slate-400">هیچ شعبه فعالی ثبت نشده است.</p>
                          <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-1">با کلیک روی دکمه «شعبه جدید» اولین شعبه رستوران را ایجاد کنید.</p>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          {branches.map(b => {
                            const isEditing = editingBranchId === b.id;
                            return (
                              <div 
                                key={b.id} 
                                className="p-5 border border-slate-100 dark:border-slate-800/80 hover:border-slate-200 dark:hover:border-slate-700/80 bg-white dark:bg-slate-900/40 rounded-2xl transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                              >
                                {isEditing ? (
                                  <div className="flex-1 space-y-4 text-right">
                                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                      <div>
                                        <label className="text-[9px] font-bold text-slate-400 block mb-1">نام شعبه</label>
                                        <input
                                          type="text"
                                          value={editBranchName}
                                          onChange={(e) => setEditBranchName(e.target.value)}
                                          className={`w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs outline-none focus:border-${brandColor}-500 font-bold text-slate-800 dark:text-slate-100`}
                                        />
                                      </div>
                                      <div>
                                        <label className="text-[9px] font-bold text-slate-400 block mb-1">شماره تلفن</label>
                                        <input
                                          type="text"
                                          value={editBranchPhone}
                                          onChange={(e) => setEditBranchPhone(e.target.value)}
                                          className={`w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs outline-none focus:border-${brandColor}-500 text-slate-800 dark:text-slate-100 font-mono`}
                                          dir="ltr"
                                        />
                                      </div>
                                      <div>
                                        <label className="text-[9px] font-bold text-slate-400 block mb-1">آدرس فیزیکی</label>
                                        <input
                                          type="text"
                                          value={editBranchAddress}
                                          onChange={(e) => setEditBranchAddress(e.target.value)}
                                          className={`w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs outline-none focus:border-${brandColor}-500 text-slate-800 dark:text-slate-100`}
                                        />
                                      </div>
                                    </div>
                                    <div className="flex justify-end gap-2">
                                      <button
                                        type="button"
                                        onClick={() => setEditingBranchId(null)}
                                        className="px-3 py-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 text-xs font-bold rounded-lg transition-colors"
                                      >
                                        انصراف
                                      </button>
                                      <button
                                        type="button"
                                        disabled={branchesSaving}
                                        onClick={() => handleUpdateBranch(b.id)}
                                        className={`px-4 py-1.5 bg-${brandColor}-500 text-white text-xs font-black rounded-lg hover:bg-${brandColor}-600 transition-colors flex items-center gap-1`}
                                      >
                                        {branchesSaving && <Loader2 className="w-3 animate-spin" />}
                                        ذخیره شعبه
                                      </button>
                                    </div>
                                  </div>
                                ) : (
                                  <>
                                    {/* Left text part */}
                                    <div className="space-y-1 text-right min-w-0 flex-1">
                                      <div className="flex items-center gap-2.5">
                                        <span className="text-xs font-black text-slate-800 dark:text-slate-100">{b.name}</span>
                                        <span className="text-[9px] px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500 font-mono">شناسه: {b.id}</span>
                                      </div>
                                      <p className="text-[11px] text-slate-400 dark:text-slate-500 font-bold flex items-center gap-1.5 truncate">
                                        <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                                        {b.address}
                                      </p>
                                      {b.phone && (
                                        <p className="text-[10px] text-slate-400 dark:text-slate-500 font-bold flex items-center gap-1.5 font-mono">
                                          <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                                          {b.phone}
                                        </p>
                                      )}
                                    </div>

                                    {/* Actions right buttons */}
                                    <div className="flex items-center gap-2 shrink-0 sm:self-center">
                                      <button
                                        onClick={() => {
                                          setEditingBranchId(b.id);
                                          setEditBranchName(b.name || '');
                                          setEditBranchAddress(b.address || '');
                                          setEditBranchPhone(b.phone || '');
                                          setIsAddingBranch(false);
                                        }}
                                        className="p-2 bg-slate-50 dark:bg-slate-800 text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 rounded-xl transition-colors border border-slate-200/50 dark:border-slate-700/60"
                                        title="ویرایش اطلاعات"
                                      >
                                        <Edit2 className="w-4 h-4" />
                                      </button>
                                      <button
                                        onClick={() => handleDeleteBranch(b.id)}
                                        className="p-2 bg-rose-50 dark:bg-rose-950/20 text-rose-500 hover:text-rose-700 dark:hover:text-rose-400 rounded-xl transition-colors border border-rose-100/40 dark:border-rose-900/30"
                                        title="حذف شعبه"
                                      >
                                        <Trash2 className="w-4 h-4" />
                                      </button>
                                    </div>
                                  </>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* CATEGORY 3: USER ACCOUNT SETTINGS */}
                {activeTab === 'account' && (
                  <div className="space-y-6 sm:space-y-8">
                    <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200/50 dark:border-slate-800 shadow-sm space-y-6">
                      <div className="flex items-start gap-3 sm:gap-4 border-b border-slate-100 dark:border-slate-800/60 pb-5">
                        <div className={`p-2.5 rounded-2xl bg-${brandColor}-50 dark:bg-${brandColor}-950/30 text-${brandColor}-600 dark:text-${brandColor}-400`}>
                          <User className="w-5.5 h-5.5" />
                        </div>
                        <div>
                          <h2 className="text-sm sm:text-base font-black text-slate-800 dark:text-slate-100">اطلاعات حساب کاربری</h2>
                          <p className="text-[11px] sm:text-xs text-slate-400 dark:text-slate-500 mt-0.5">مشخصات هویتی و سطح دسترسی شما در سیستم مدیریت ویترین</p>
                        </div>
                      </div>

                      {accountError && (
                        <div className="p-4 bg-rose-50 dark:bg-rose-950/20 border border-rose-100 dark:border-rose-800 rounded-2xl flex items-center gap-3 text-rose-600 dark:text-rose-400">
                          <AlertCircle className="w-5 h-5 shrink-0" />
                          <span className="text-xs font-bold">{accountError}</span>
                        </div>
                      )}

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-right">
                        <div>
                          <label className="text-xs font-bold text-slate-500 dark:text-slate-400 block mb-2">نام <span className="text-rose-500">*</span></label>
                          <input 
                            type="text" 
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                            className={`w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 text-xs focus:border-${brandColor}-500 outline-none transition-colors text-slate-800 dark:text-slate-100 font-bold`}
                          />
                        </div>
                        <div>
                          <label className="text-xs font-bold text-slate-500 dark:text-slate-400 block mb-2">نام خانوادگی <span className="text-rose-500">*</span></label>
                          <input 
                            type="text" 
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
                            className={`w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 text-xs focus:border-${brandColor}-500 outline-none transition-colors text-slate-800 dark:text-slate-100 font-bold`}
                          />
                        </div>
                        <div>
                          <label className="text-xs font-bold text-slate-500 dark:text-slate-400 block mb-2">آدرس ایمیل <span className="text-rose-500">*</span></label>
                          <input 
                            type="email" 
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className={`w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 text-xs focus:border-${brandColor}-500 outline-none transition-colors text-slate-800 dark:text-slate-100 font-mono`}
                            dir="ltr"
                          />
                        </div>
                        <div>
                          <label className="text-xs font-bold text-slate-500 dark:text-slate-400 block mb-2">شماره همراه</label>
                          <input 
                            type="text" 
                            value={userPhone}
                            onChange={(e) => setUserPhone(e.target.value)}
                            className={`w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 text-xs focus:border-${brandColor}-500 outline-none transition-colors text-slate-800 dark:text-slate-100 font-mono`}
                            dir="ltr"
                            placeholder="09XXXXXXXXX"
                          />
                        </div>

                        {/* Read-only permission block */}
                        <div className="md:col-span-2 p-5 bg-slate-50 dark:bg-slate-950/60 rounded-2xl border border-slate-100 dark:border-slate-800/80 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                          <div className="space-y-1">
                            <span className="block text-xs font-black text-slate-800 dark:text-slate-200">نقش کاربری در سازمان</span>
                            <p className="text-[10px] text-slate-400 dark:text-slate-500 font-bold">سطح دسترسی شما به منو، تراکنش‌ها و شعب به صورت سیستمی تعیین شده است.</p>
                          </div>
                          <span className={`px-4 py-1.5 rounded-xl text-xs font-black text-center sm:w-28 uppercase tracking-wide inline-block ${
                            user?.id === 'mock-manager-id' 
                              ? 'bg-blue-50 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400' 
                              : 'bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400'
                          }`}>
                            {user?.id === 'mock-manager-id' ? 'مدیر سیستم' : 'مالک رستوران'}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Account actions footer */}
                    <div className="flex justify-end pt-2">
                      <button 
                         onClick={handleSaveAccount}
                         disabled={accountSaving}
                         className={`w-full sm:w-auto justify-center px-6 py-3.5 bg-${brandColor}-600 text-white rounded-2xl text-xs font-bold shadow-md hover:bg-${brandColor}-700 transition-all flex items-center gap-2.5`}
                      >
                         {accountSaving ? (
                           <Loader2 className="w-4 h-4 animate-spin" />
                         ) : accountSuccess ? (
                           <CheckCircle2 className="w-4.5 h-4.5" />
                         ) : (
                           <Save className="w-4.5 h-4.5" />
                         )}
                         {accountSaving ? 'در حال ذخیره‌سازی...' : accountSuccess ? 'اطلاعات کاربری بروز شد' : 'ذخیره اطلاعات کاربری'}
                      </button>
                    </div>
                  </div>
                )}

                {/* CATEGORY 4: APPEARANCE & THEMES */}
                {activeTab === 'appearance' && (
                  <div className="space-y-6 sm:space-y-8">
                    
                    {/* Brand color selector */}
                    <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200/50 dark:border-slate-800 shadow-sm space-y-6">
                      <div className="flex items-start gap-3 sm:gap-4 border-b border-slate-100 dark:border-slate-800/60 pb-5">
                        <div className={`p-2.5 rounded-2xl bg-${brandColor}-50 dark:bg-${brandColor}-950/30 text-${brandColor}-600 dark:text-${brandColor}-400`}>
                          <Palette className="w-5.5 h-5.5" />
                        </div>
                        <div>
                          <h2 className="text-sm sm:text-base font-black text-slate-800 dark:text-slate-100">رنگ و نشانه سازمانی</h2>
                          <p className="text-[11px] sm:text-xs text-slate-400 dark:text-slate-500 mt-0.5">رنگ اصلی و تم دکمه‌ها و المان‌های تعاملی پنل مدیریت و منوهای دیجیتال</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                        {COLORS.map(color => {
                          const isSelected = brandColor === color.id;
                          return (
                            <button
                              key={color.id}
                              onClick={() => setBrandColor(color.id)}
                              className={`p-4 rounded-2xl border transition-all flex flex-col items-center gap-3 relative ${
                                isSelected 
                                  ? `border-${brandColor}-500/40 bg-${brandColor}-50/30 dark:bg-${brandColor}-950/10 shadow-sm` 
                                  : 'border-slate-100 dark:border-slate-800 hover:border-slate-200 dark:hover:border-slate-700 bg-slate-50/50 dark:bg-slate-950/20'
                              }`}
                            >
                              <div className="w-10 h-10 rounded-full shadow-inner flex items-center justify-center transition-transform" style={{ backgroundColor: color.hex }}>
                                {isSelected && <Check className="w-5 h-5 text-white" />}
                              </div>
                              <span className="text-[10px] font-bold text-slate-600 dark:text-slate-300">{color.name}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Dark / Light toggle selection */}
                    <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200/50 dark:border-slate-800 shadow-sm space-y-6">
                      <div className="flex items-start gap-3 sm:gap-4 border-b border-slate-100 dark:border-slate-800/60 pb-5">
                        <div className={`p-2.5 rounded-2xl bg-${brandColor}-50 dark:bg-${brandColor}-950/30 text-${brandColor}-600 dark:text-${brandColor}-400`}>
                          <Palette className="w-5.5 h-5.5" />
                        </div>
                        <div>
                          <h2 className="text-sm sm:text-base font-black text-slate-800 dark:text-slate-100">پوسته دیداری پنل مدیریت (تم)</h2>
                          <p className="text-[11px] sm:text-xs text-slate-400 dark:text-slate-500 mt-0.5">انتخاب پوسته پیش‌فرض تیره یا روشن برای پنل مدیریت با توجه به راحتی چشم شما</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        
                        {/* Light theme card */}
                        <button
                          type="button"
                          onClick={() => setTheme('light')}
                          className={`p-6 rounded-2xl border transition-all text-right flex flex-col gap-4 relative group overflow-hidden ${
                            theme === 'light'
                              ? `border-${brandColor}-500 bg-${brandColor}-50/20 dark:bg-slate-800 ring-2 ring-${brandColor}-500/20`
                              : 'border-slate-200 dark:border-slate-850 bg-slate-50/50 dark:bg-slate-900 hover:border-slate-300 dark:hover:border-slate-750'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <div className="p-2 bg-white text-slate-700 rounded-xl shadow-sm border border-slate-100">
                              <Sun className="w-5 h-5" />
                            </div>
                            {theme === 'light' && <CheckCircle2 className={`w-5 h-5 text-${brandColor}-500`} />}
                          </div>
                          <div>
                            <span className="block text-xs font-black text-slate-800 dark:text-slate-100">پوسته روشن</span>
                            <p className="text-[10px] text-slate-400 dark:text-slate-500 font-bold mt-1">مناسب برای محیط‌های با نور زیاد و روز</p>
                          </div>
                        </button>

                        {/* Dark theme card */}
                        <button
                          type="button"
                          onClick={() => setTheme('dark')}
                          className={`p-6 rounded-2xl border transition-all text-right flex flex-col gap-4 relative group overflow-hidden ${
                            theme === 'dark'
                              ? `border-${brandColor}-500 bg-slate-900 dark:bg-${brandColor}-950/20 ring-2 ring-${brandColor}-500/20`
                              : 'border-slate-200 dark:border-slate-850 bg-slate-50/50 dark:bg-slate-900 hover:border-slate-300 dark:hover:border-slate-750'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <div className="p-2 bg-slate-950 text-white rounded-xl shadow-sm border border-slate-800">
                              <Moon className="w-5 h-5" />
                            </div>
                            {theme === 'dark' && <CheckCircle2 className={`w-5 h-5 text-${brandColor}-500`} />}
                          </div>
                          <div>
                            <span className="block text-xs font-black text-slate-800 dark:text-slate-100">پوسته تاریک</span>
                            <p className="text-[10px] text-slate-400 dark:text-slate-500 font-bold mt-1">طراحی شده برای محیط‌های کم‌نور و راحتی چشم در شب</p>
                          </div>
                        </button>

                      </div>
                    </div>

                  </div>
                )}

              </motion.div>
            </AnimatePresence>
          </div>

        </div>

      </div>
    </div>
  );
};

export default SettingsPage;
