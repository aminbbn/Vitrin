
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
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
  CheckCircle2
} from 'lucide-react';
import { useTenant } from '../data/useRepositories';

interface SettingsPageProps {
  restaurantName: string;
  setRestaurantName: (name: string) => void;
  restaurantLogo: string;
  setRestaurantLogo: (logo: string) => void;
  brandColor: string;
  setBrandColor: (color: string) => void;
  highlightedItemId?: string | null;
  clearHighlight?: () => void;
}

const COLORS = [
  { id: 'emerald', hex: '#10b981' },
  { id: 'blue', hex: '#3b82f6' },
  { id: 'purple', hex: '#a855f7' },
  { id: 'orange', hex: '#f97316' },
  { id: 'red', hex: '#ef4444' },
  { id: 'violet', hex: '#8b5cf6' },
  { id: 'pink', hex: '#ec4899' },
  { id: 'zinc', hex: '#71717a' },
  { id: 'slate', hex: '#64748b' },
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

const SectionCard = ({ id, title, subtitle, children, icon: Icon, brandColor, isHighlighted }: any) => (
  <section 
    id={id} 
    className={`bg-white dark:bg-slate-900 rounded-[2rem] p-4 sm:p-6 md:p-8 shadow-sm relative overflow-hidden transition-all duration-1000 scroll-mt-24 ${
      isHighlighted 
        ? `border-2 border-${brandColor}-500 ring-4 ring-${brandColor}-500/40 scale-[1.02] z-10` 
         : 'border border-slate-200 dark:border-slate-800'
    }`}
  >
    <div className="flex items-start gap-3 sm:gap-4 mb-6 sm:mb-8">
      <div className={`p-2.5 sm:p-3 rounded-2xl bg-${brandColor}-50 dark:bg-${brandColor}-950/30 text-${brandColor}-600 dark:text-${brandColor}-400`}>
        {Icon && <Icon className="w-5 h-5 sm:w-6 sm:h-6" />}
      </div>
      <div>
        <h2 className="text-base sm:text-lg font-black text-slate-800 dark:text-slate-100">{title}</h2>
        <p className="text-xs sm:text-sm text-slate-400 dark:text-slate-500 mt-1">{subtitle}</p>
      </div>
    </div>
    {children}
  </section>
);

const SettingsPage: React.FC<SettingsPageProps> = ({ 
  restaurantName, 
  setRestaurantName, 
  restaurantLogo,
  setRestaurantLogo,
  brandColor,
  setBrandColor,
  highlightedItemId,
  clearHighlight
}) => {
  const { restaurant, updateInfo } = useTenant();
  const [hours, setHours] = useState(INITIAL_HOURS);
  const [localHighlight, setLocalHighlight] = useState<string | null>(null);

  React.useEffect(() => {
    if (highlightedItemId) {
      setLocalHighlight(highlightedItemId);
      
      // Smoothly scroll to the target setting section
      setTimeout(() => {
        const element = document.getElementById(highlightedItemId);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 100);

      const timer = setTimeout(() => {
        setLocalHighlight(null);
        if (clearHighlight) clearHighlight();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [highlightedItemId, clearHighlight]);
  
  // Local state for other fields loaded from hook or defaults
  const [address, setAddress] = useState('تهران، سعادت آباد، میدان کاج');
  const [phone, setPhone] = useState('021-22xxx');
  const [description, setDescription] = useState('رستورانی با طعم‌های اصیل و به یادماندنی...');
  const [isSaved, setIsSaved] = useState(false);

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

  const handleSave = async () => {
    try {
      await updateInfo({
        address,
        phone,
        description,
        hours: serializeHoursToStorage(hours)
      });
      setIsSaved(true);
      setTimeout(() => setIsSaved(false), 3000);
    } catch (e) {
      console.error('Error saving settings:', e);
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

  return (
    <div className="h-full bg-slate-50 dark:bg-slate-950 font-['Vazirmatn'] overflow-y-auto p-4 sm:p-6 lg:p-8 pb-24 transition-colors">
      <div className="max-w-4xl mx-auto space-y-6 sm:space-y-8">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
           <div>
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-slate-100 flex items-center gap-3">
                 <Store className={`w-6 h-6 sm:w-7 sm:h-7 text-${brandColor}-600 dark:text-${brandColor}-400`} />
                 تنظیمات فروشگاه
              </h1>
              <p className="text-xs sm:text-sm text-slate-400 dark:text-slate-500 mt-1">مدیریت اطلاعات رستوران و شخصی‌سازی پنل</p>
           </div>
           <button 
              onClick={handleSave}
              className={`w-full sm:w-auto justify-center px-6 py-3 bg-${brandColor}-600 text-white rounded-xl text-sm font-bold shadow-lg shadow-${brandColor}-200 dark:shadow-none hover:bg-${brandColor}-700 transition-all flex items-center gap-2`}
           >
              {isSaved ? <CheckCircle2 className="w-4.5 h-4.5" /> : <Save className="w-4.5 h-4.5" />}
              {isSaved ? 'تنظیمات ذخیره شد' : 'ذخیره تغییرات'}
           </button>
        </div>

        {/* IDENTITY SECTION */}
        <SectionCard id="identity" title="هویت بصری" subtitle="نام، لوگو و توضیحات رستوران شما" icon={Store} brandColor={brandColor} isHighlighted={localHighlight === 'identity'}>
           <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-2xl bg-slate-50 dark:bg-slate-900/40 relative group">
                 {restaurantLogo && restaurantLogo.trim() !== '' ? (
                    <img src={restaurantLogo || undefined} alt="Logo" className="w-32 h-32 object-cover rounded-full shadow-md mb-4" />
                 ) : (
                    <div className="w-32 h-32 bg-slate-200 dark:bg-slate-800 rounded-full flex items-center justify-center text-slate-400 dark:text-slate-500 mb-4">
                       <Camera className="w-10 h-10" />
                    </div>
                 )}
                 <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                    <span className="text-white text-xs font-bold flex items-center gap-2">
                       <Upload className="w-4 h-4" /> تغییر لوگو
                    </span>
                 </div>
                 <input type="file" accept="image/*" onChange={handleLogoUpload} className="absolute inset-0 opacity-0 cursor-pointer" />
                 <p className="text-xs text-slate-400 dark:text-slate-500">تصویر با فرمت JPG یا PNG</p>
              </div>

              <div className="md:col-span-2 space-y-6">
                 <div>
                    <label className="text-xs font-bold text-slate-500 dark:text-slate-400 block mb-2">نام رستوران</label>
                    <input 
                       type="text" 
                       value={restaurantName}
                       onChange={(e) => setRestaurantName(e.target.value)}
                       className={`w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 text-sm focus:border-${brandColor}-500 outline-none transition-colors font-bold text-slate-800 dark:text-slate-100`}
                    />
                 </div>
                 <div>
                    <label className="text-xs font-bold text-slate-500 dark:text-slate-400 block mb-2">توضیحات کوتاه (شعار)</label>
                    <textarea 
                       rows={3}
                       value={description}
                       onChange={(e) => setDescription(e.target.value)}
                       className={`w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 text-sm focus:border-${brandColor}-500 outline-none transition-colors resize-none text-slate-800 dark:text-slate-100`}
                    />
                 </div>
              </div>
           </div>
         </SectionCard>

         {/* BRANDING SECTION */}
         <SectionCard id="branding" title="رنگ سازمانی" subtitle="تم رنگی پنل و منوی دیجیتال را انتخاب کنید" icon={Palette} brandColor={brandColor} isHighlighted={localHighlight === 'branding'}>
            <div className="flex flex-wrap gap-4">
               {COLORS.map(color => (
                  <button
                     key={color.id}
                     onClick={() => setBrandColor(color.id)}
                     className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${brandColor === color.id ? 'ring-4 ring-offset-2 ring-slate-200 dark:ring-slate-800 scale-110' : 'hover:scale-105'}`}
                     style={{ backgroundColor: color.hex }}
                  >
                     {brandColor === color.id && <CheckCircle2 className="w-6 h-6 text-white" />}
                  </button>
               ))}
            </div>
         </SectionCard>


         {/* CONTACT SECTION */}
         <SectionCard id="contact" title="اطلاعات تماس" subtitle="آدرس و راه‌های ارتباطی با مشتریان" icon={MapPin} brandColor={brandColor} isHighlighted={localHighlight === 'contact'}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               <div>
                  <label className="text-xs font-bold text-slate-500 dark:text-slate-400 block mb-2">آدرس کامل</label>
                  <div className="relative">
                     <MapPin className="w-5 h-5 absolute right-3 top-3 text-slate-400" />
                     <textarea 
                        rows={2}
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        className={`w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl pr-10 pl-4 py-3 text-sm focus:border-${brandColor}-500 outline-none transition-colors text-slate-800 dark:text-slate-100`}
                     />
                  </div>
               </div>
               <div className="space-y-6">
                  <div>
                     <label className="text-xs font-bold text-slate-500 dark:text-slate-400 block mb-2">شماره تماس</label>
                     <div className="relative">
                        <Phone className="w-5 h-5 absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input 
                           type="text" 
                           value={phone}
                           onChange={(e) => setPhone(e.target.value)}
                           className={`w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl pr-10 pl-4 py-3 text-sm focus:border-${brandColor}-500 outline-none transition-colors text-slate-800 dark:text-slate-100`}
                           dir="ltr"
                           placeholder="021-..."
                        />
                     </div>
                  </div>
                  <div>
                     <label className="text-xs font-bold text-slate-500 dark:text-slate-400 block mb-2">وب‌سایت / اینستاگرام</label>
                     <div className="relative">
                        <Globe className="w-5 h-5 absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input 
                           type="text" 
                           placeholder="@restaurant_name"
                           className={`w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl pr-10 pl-4 py-3 text-sm focus:border-${brandColor}-500 outline-none transition-colors text-slate-800 dark:text-slate-100`}
                           dir="ltr"
                        />
                     </div>
                  </div>
               </div>
            </div>
         </SectionCard>

         {/* HOURS SECTION */}
         <SectionCard id="hours" title="ساعات کاری" subtitle="زمان‌بندی فعالیت رستوران در طول هفته" icon={Clock} brandColor={brandColor} isHighlighted={localHighlight === 'hours'}>
            <div className="space-y-4">
              {hours.map((day) => (
                <div key={day.id} className="flex flex-col sm:flex-row sm:items-center sm:justify-between py-3 gap-3 border-b border-slate-50 dark:border-slate-800/50 last:border-0">
                  
                  {/* Left part: Day name + Switch Toggle */}
                  <div className="flex items-center justify-between sm:justify-start gap-4 sm:w-1/3">
                    <div className="text-sm font-bold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                       <div className={`w-2 h-2 rounded-full ${day.isOpen ? `bg-${brandColor}-500` : 'bg-slate-300'}`} />
                       {day.label}
                    </div>
                    <button 
                      onClick={() => setHours(hours.map(h => h.id === day.id ? { ...h, isOpen: !h.isOpen } : h))} 
                      className={`w-11 h-6.5 rounded-full relative transition-colors ${day.isOpen ? `bg-${brandColor}-500` : 'bg-slate-200 dark:bg-slate-800'}`}
                      title={day.isOpen ? 'فعال' : 'غیرفعال'}
                    >
                      <div className={`absolute top-1 w-4.5 h-4.5 bg-white rounded-full transition-all shadow-sm ${day.isOpen ? 'left-1' : 'left-5.5'}`} />
                    </button>
                  </div>

                  {/* Right part: Hours Input Fields */}
                  <div className="flex items-center gap-2 justify-start sm:justify-end flex-1">
                    {day.isOpen ? (
                      <div className="flex items-center gap-2 w-full sm:w-auto">
                        <div className="flex-1 sm:flex-initial">
                          <input 
                            type="text" 
                            value={day.start} 
                            onChange={(e) => setHours(hours.map(h => h.id === day.id ? { ...h, start: e.target.value } : h))}
                            className="w-full sm:w-24 text-center text-xs font-bold bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg py-2 focus:border-slate-450 dark:focus:border-slate-700 outline-none transition-colors text-slate-800 dark:text-slate-100" 
                            dir="ltr" 
                          />
                        </div>
                        <span className="text-slate-300 font-bold">-</span>
                        <div className="flex-1 sm:flex-initial">
                          <input 
                            type="text" 
                            value={day.end} 
                            onChange={(e) => setHours(hours.map(h => h.id === day.id ? { ...h, end: e.target.value } : h))}
                            className="w-full sm:w-24 text-center text-xs font-bold bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg py-2 focus:border-slate-450 dark:focus:border-slate-700 outline-none transition-colors text-slate-800 dark:text-slate-100" 
                            dir="ltr" 
                          />
                        </div>
                      </div>
                    ) : (
                      <span className="text-xs font-bold text-slate-300 dark:text-slate-600 bg-slate-50/50 dark:bg-slate-950/50 px-4 py-2 rounded-lg w-full text-center border border-slate-200/40 dark:border-slate-800/40">تعطیل</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </SectionCard>

       </div>
     </div>
  );
};

export default SettingsPage;
