import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Store, 
  Clock, 
  Palette, 
  Globe, 
  CreditCard, 
  Bell, 
  Image as ImageIcon,
  Check, 
  LogOut,
  User,
  Crown,
  Upload,
  Save
} from 'lucide-react';

// --- CONSTANTS ---

const SECTIONS = [
  { id: 'general', label: 'اطلاعات کلی', icon: Store },
  { id: 'hours', label: 'ساعات کاری', icon: Clock },
  { id: 'appearance', label: 'شخصی‌سازی ظاهر', icon: Palette },
  { id: 'seo', label: 'دامنه و سئو', icon: Globe },
  { id: 'payment', label: 'درگاه پرداخت', icon: CreditCard },
  { id: 'notifications', label: 'اعلان‌ها', icon: Bell },
];

const DAYS = [
  { id: 'sat', label: 'شنبه' },
  { id: 'sun', label: 'یکشنبه' },
  { id: 'mon', label: 'دوشنبه' },
  { id: 'tue', label: 'سه‌شنبه' },
  { id: 'wed', label: 'چهارشنبه' },
  { id: 'thu', label: 'پنج‌شنبه' },
  { id: 'fri', label: 'جمعه' },
];

const COLORS = [
  { id: 'zinc', value: '#3f3f46' },
  { id: 'slate', value: '#0f172a' },
  { id: 'orange', value: '#f97316' },
  { id: 'red', value: '#ef4444' },
  { id: 'blue', value: '#3b82f6' },
  { id: 'emerald', value: '#10b981' },
];

const FONTS = [
  { id: 'vazir', label: 'وزیرمتن', sub: 'پیش‌فرض' },
  { id: 'iransans', label: 'ایران سنس', sub: 'محبوب' },
  { id: 'nazanin', label: 'نازنین', sub: 'کلاسیک' },
];

// --- COMPONENTS ---

interface SectionCardProps {
  id: string;
  title: string;
  subtitle: string;
  children?: React.ReactNode;
}

const SectionCard: React.FC<SectionCardProps> = ({ id, title, subtitle, children }) => (
  <section id={id} className="bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden scroll-mt-24">
    <div className="p-6 border-b border-slate-50">
      <h2 className="text-lg font-black text-slate-800">{title}</h2>
      <p className="text-xs text-slate-400 mt-1">{subtitle}</p>
    </div>
    <div className="p-6">
      {children}
    </div>
  </section>
);

const Settings: React.FC = () => {
  // --- STATE ---
  const [activeSection, setActiveSection] = useState('general');
  const [isSaving, setIsSaving] = useState(false);

  // General
  const [restaurantName, setRestaurantName] = useState('رستوران ایتالیایی لیمو');
  const [phone, setPhone] = useState('021-88990000');
  const [description, setDescription] = useState('');

  // Hours
  const [hours, setHours] = useState(
    DAYS.map(day => ({ ...day, isOpen: day.id !== 'fri', start: '11:00 AM', end: '11:00 PM' }))
  );

  // Appearance
  const [brandColor, setBrandColor] = useState('emerald');
  const [font, setFont] = useState('vazir');

  // SEO
  const [slug, setSlug] = useState('limo-restaurant');
  const [metaTitle, setMetaTitle] = useState('');
  const [metaDesc, setMetaDesc] = useState('');

  // Payment
  const [cashEnabled, setCashEnabled] = useState(true);
  const [onlineEnabled, setOnlineEnabled] = useState(false);
  const [merchantId, setMerchantId] = useState('');

  // Notifications
  const [notifSMS, setNotifSMS] = useState(true);
  const [notifSound, setNotifSound] = useState(false);
  const [notifEmail, setNotifEmail] = useState(true);

  // --- HANDLERS ---
  const scrollToSection = (id: string) => {
    setActiveSection(id);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const toggleDay = (id: string) => {
    setHours(hours.map(h => h.id === id ? { ...h, isOpen: !h.isOpen } : h));
  };

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => setIsSaving(false), 1500);
  };

  return (
    <div className="flex flex-col h-full bg-slate-50 font-['Vazirmatn'] relative">
      
      {/* HEADER */}
      <div className="p-8 pb-4 shrink-0">
         <h1 className="text-2xl font-black text-slate-900">تنظیمات فروشگاه</h1>
         <p className="text-sm text-slate-400 mt-1">اطلاعات و پیکربندی‌های عمومی رستوران خود را مدیریت کنید</p>
      </div>

      <div className="flex-1 overflow-y-auto px-8 pb-24">
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* --- SIDEBAR NAVIGATION --- */}
          <aside className="w-full lg:w-72 shrink-0 space-y-6 order-2 lg:order-1">
            <div className="bg-white rounded-[1.5rem] p-2 shadow-sm border border-slate-100 sticky top-0">
               <div className="bg-emerald-50 rounded-xl p-4 mb-2">
                  <div className="flex items-center gap-2 mb-2">
                     <Crown className="w-5 h-5 text-emerald-600" />
                     <span className="font-black text-emerald-800 text-sm">پلن حرفه‌ای</span>
                  </div>
                  <div className="text-[10px] text-emerald-600 font-bold mb-3">۲۵ روز باقی‌مانده</div>
                  <button className="w-full py-2 bg-emerald-600 text-white rounded-lg text-xs font-bold hover:bg-emerald-700 transition-colors shadow-lg shadow-emerald-200">
                     تمدید اشتراک
                  </button>
               </div>

               <nav className="space-y-1">
                  {SECTIONS.map(item => (
                     <button
                        key={item.id}
                        onClick={() => scrollToSection(item.id)}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold transition-all ${
                           activeSection === item.id 
                              ? 'bg-slate-50 text-slate-900' 
                              : 'text-slate-500 hover:bg-slate-50 hover:text-slate-700'
                        }`}
                     >
                        <item.icon className={`w-4 h-4 ${activeSection === item.id ? 'text-emerald-600' : 'text-slate-400'}`} />
                        {item.label}
                     </button>
                  ))}
               </nav>
            </div>

            <div className="flex items-center gap-3 px-4">
               <div className="w-10 h-10 rounded-full bg-slate-200 border-2 border-white shadow-sm flex items-center justify-center">
                  <User className="w-5 h-5 text-slate-400" />
               </div>
               <div className="flex-1">
                  <h4 className="text-xs font-black text-slate-800">مدیر رستوران</h4>
                  <span className="text-[10px] text-slate-400">ادمین اصلی</span>
               </div>
               <button className="text-slate-400 hover:text-red-500 transition-colors flex items-center gap-1 text-[10px] font-bold">
                  <LogOut className="w-3 h-3" /> خروج
               </button>
            </div>
          </aside>

          {/* --- MAIN CONTENT FORMS --- */}
          <div className="flex-1 space-y-8 order-1 lg:order-2">
            
            {/* 1. GENERAL INFO */}
            <SectionCard id="general" title="اطلاعات کلی" subtitle="اطلاعات پایه رستوران خود را ویرایش کنید">
               <div className="flex flex-col md:flex-row gap-8 items-start">
                  <div className="w-full md:w-auto flex flex-col items-center gap-3">
                     <div className="w-24 h-24 rounded-full border-2 border-dashed border-slate-300 flex items-center justify-center bg-slate-50 cursor-pointer hover:border-emerald-500 hover:bg-emerald-50 transition-all group relative overflow-hidden">
                        <ImageIcon className="w-8 h-8 text-slate-300 group-hover:text-emerald-500 transition-colors" />
                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                           <Upload className="w-5 h-5 text-white" />
                        </div>
                     </div>
                     <div className="text-center">
                        <span className="block text-xs font-bold text-slate-700">لوگوی رستوران</span>
                        <span className="text-[9px] text-slate-400 mt-1 block">فرمت‌های مجاز: JPG, PNG. حداکثر حجم: ۲ مگابایت</span>
                        <button className="text-[10px] text-emerald-600 font-bold mt-1 hover:underline">بارگذاری تصویر جدید</button>
                     </div>
                  </div>

                  <div className="flex-1 w-full space-y-4">
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                           <label className="text-xs font-bold text-slate-500">نام رستوران</label>
                           <input 
                              type="text" 
                              value={restaurantName}
                              onChange={(e) => setRestaurantName(e.target.value)}
                              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:border-emerald-500 outline-none bg-white transition-colors"
                           />
                        </div>
                        <div className="space-y-2">
                           <label className="text-xs font-bold text-slate-500">شماره تماس</label>
                           <input 
                              type="text" 
                              dir="ltr"
                              value={phone}
                              onChange={(e) => setPhone(e.target.value)}
                              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:border-emerald-500 outline-none bg-white transition-colors text-left"
                           />
                        </div>
                     </div>
                     <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-500">توضیحات کوتاه</label>
                        <textarea 
                           rows={3}
                           value={description}
                           onChange={(e) => setDescription(e.target.value)}
                           placeholder="درباره رستوران بنویسید..."
                           className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:border-emerald-500 outline-none bg-white transition-colors resize-none"
                        />
                     </div>
                  </div>
               </div>
            </SectionCard>

            {/* 2. HOURS */}
            <SectionCard id="hours" title="ساعات کاری" subtitle="زمان‌بندی فعالیت رستوران در طول هفته">
               <div className="space-y-4">
                  <div className="grid grid-cols-12 gap-4 text-[10px] font-bold text-slate-400 px-2">
                     <div className="col-span-2">روز هفته</div>
                     <div className="col-span-2 text-center">وضعیت</div>
                     <div className="col-span-8 text-center">ساعات</div>
                  </div>
                  {hours.map((day) => (
                     <div key={day.id} className="grid grid-cols-12 gap-4 items-center py-2 border-b border-slate-50 last:border-0">
                        <div className="col-span-2 text-sm font-bold text-slate-700">{day.label}</div>
                        <div className="col-span-2 flex justify-center">
                           <button 
                              onClick={() => toggleDay(day.id)}
                              className={`w-10 h-6 rounded-full relative transition-colors ${day.isOpen ? 'bg-emerald-500' : 'bg-slate-200'}`}
                           >
                              <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all shadow-sm ${day.isOpen ? 'left-1' : 'left-5'}`} />
                           </button>
                        </div>
                        <div className="col-span-8 flex items-center gap-2 justify-center">
                           {day.isOpen ? (
                              <>
                                 <input type="text" value={day.start} onChange={() => {}} className="w-24 text-center text-xs font-bold bg-white border border-slate-200 rounded-lg py-1.5 outline-none focus:border-emerald-500" dir="ltr" />
                                 <span className="text-slate-300">تا</span>
                                 <input type="text" value={day.end} onChange={() => {}} className="w-24 text-center text-xs font-bold bg-white border border-slate-200 rounded-lg py-1.5 outline-none focus:border-emerald-500" dir="ltr" />
                              </>
                           ) : (
                              <span className="text-xs font-bold text-slate-300">تعطیل</span>
                           )}
                        </div>
                     </div>
                  ))}
               </div>
            </SectionCard>

            {/* 3. APPEARANCE */}
            <SectionCard id="appearance" title="شخصی‌سازی ظاهر" subtitle="رنگ‌بندی و فونت منوی دیجیتال خود را انتخاب کنید">
               <div className="space-y-6">
                  <div>
                     <label className="text-xs font-bold text-slate-500 block mb-3">رنگ اصلی برند</label>
                     <div className="flex flex-wrap gap-4">
                        {COLORS.map(color => (
                           <button
                              key={color.id}
                              onClick={() => setBrandColor(color.id)}
                              className={`w-10 h-10 rounded-full flex items-center justify-center transition-transform hover:scale-110 ${brandColor === color.id ? 'ring-2 ring-offset-2 ring-slate-200 scale-110' : ''}`}
                              style={{ backgroundColor: color.value }}
                           >
                              {brandColor === color.id && <Check className="w-5 h-5 text-white" />}
                           </button>
                        ))}
                        <button className="w-10 h-10 rounded-full border border-slate-200 flex items-center justify-center text-slate-400 hover:bg-slate-50">
                           +
                        </button>
                     </div>
                  </div>
                  <div>
                     <label className="text-xs font-bold text-slate-500 block mb-3">فونت منو</label>
                     <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {FONTS.map(f => (
                           <button
                              key={f.id}
                              onClick={() => setFont(f.id)}
                              className={`p-4 rounded-xl border transition-all text-center group ${
                                 font === f.id 
                                    ? 'border-emerald-500 bg-emerald-50/30 ring-1 ring-emerald-500' 
                                    : 'border-slate-200 hover:border-emerald-200 hover:bg-slate-50'
                              }`}
                           >
                              <span className="block text-lg font-black text-slate-800 mb-1">{f.label}</span>
                              <span className={`text-[10px] font-bold ${font === f.id ? 'text-emerald-600' : 'text-slate-400'}`}>{f.sub}</span>
                           </button>
                        ))}
                     </div>
                  </div>
               </div>
            </SectionCard>

            {/* 4. DOMAIN & SEO */}
            <SectionCard id="seo" title="دامنه و سئو" subtitle="آدرس اینترنتی و تنظیمات موتورهای جستجو">
               <div className="space-y-6">
                  <div className="space-y-2">
                     <label className="text-xs font-bold text-slate-500">آدرس اختصاصی</label>
                     <div className="flex bg-slate-50 border border-slate-200 rounded-xl overflow-hidden focus-within:border-emerald-500 focus-within:ring-1 focus-within:ring-emerald-500 transition-all">
                        <div className="bg-slate-100 px-3 py-2.5 text-xs font-bold text-slate-500 border-l border-slate-200 shrink-0" dir="ltr">
                           /vitrin.me
                        </div>
                        <input 
                           type="text" 
                           dir="ltr"
                           value={slug}
                           onChange={(e) => setSlug(e.target.value)}
                           className="flex-1 bg-transparent border-none outline-none px-4 text-sm font-bold text-slate-700 text-left"
                        />
                     </div>
                     <p className="text-[10px] text-slate-400">این آدرس برای دسترسی مشتریان به منوی دیجیتال شما استفاده می‌شود.</p>
                  </div>
                  
                  <div className="space-y-2">
                     <label className="text-xs font-bold text-slate-500">عنوان صفحه (Title Tag)</label>
                     <input 
                        type="text" 
                        value={metaTitle}
                        onChange={(e) => setMetaTitle(e.target.value)}
                        placeholder="مثال: منوی آنلاین رستوران لیمو"
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:border-emerald-500 outline-none bg-white transition-colors"
                     />
                  </div>

                  <div className="space-y-2">
                     <label className="text-xs font-bold text-slate-500">توضیحات متا (Meta Description)</label>
                     <textarea 
                        rows={3}
                        value={metaDesc}
                        onChange={(e) => setMetaDesc(e.target.value)}
                        placeholder="توضیحاتی که در گوگل نمایش داده می‌شود..."
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:border-emerald-500 outline-none bg-white transition-colors resize-none"
                     />
                  </div>
               </div>
            </SectionCard>

            {/* 5. PAYMENT */}
            <SectionCard id="payment" title="درگاه پرداخت" subtitle="روش‌های پرداخت مشتریان را مدیریت کنید">
               <div className="space-y-4">
                  {/* Cash Method */}
                  <div className={`p-4 rounded-2xl border transition-all flex items-center justify-between ${cashEnabled ? 'bg-emerald-50/30 border-emerald-200' : 'bg-white border-slate-200'}`}>
                     <div className="flex items-center gap-4">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${cashEnabled ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-100 text-slate-400'}`}>
                           <CreditCard className="w-5 h-5" />
                        </div>
                        <div>
                           <h4 className="text-sm font-bold text-slate-800">پرداخت در محل (نقدی/کارتخوان)</h4>
                           <p className="text-[10px] text-slate-500">مشتری هنگام تحویل سفارش پرداخت می‌کند</p>
                        </div>
                     </div>
                     <button 
                        onClick={() => setCashEnabled(!cashEnabled)}
                        className={`w-10 h-6 rounded-full relative transition-colors ${cashEnabled ? 'bg-emerald-500' : 'bg-slate-200'}`}
                     >
                        <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all shadow-sm ${cashEnabled ? 'left-1' : 'left-5'}`} />
                     </button>
                  </div>

                  {/* Online Method */}
                  <div className={`p-4 rounded-2xl border transition-all ${onlineEnabled ? 'bg-white border-blue-200 shadow-md shadow-blue-50' : 'bg-white border-slate-200'}`}>
                     <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-4">
                           <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${onlineEnabled ? 'bg-blue-100 text-blue-600' : 'bg-slate-100 text-slate-400'}`}>
                              <CreditCard className="w-5 h-5" />
                           </div>
                           <div>
                              <h4 className="text-sm font-bold text-slate-800">پرداخت آنلاین (زرین‌پال)</h4>
                              <p className="text-[10px] text-slate-500">اتصال مستقیم به درگاه بانکی</p>
                           </div>
                        </div>
                        <button 
                           onClick={() => setOnlineEnabled(!onlineEnabled)}
                           className={`w-10 h-6 rounded-full relative transition-colors ${onlineEnabled ? 'bg-blue-500' : 'bg-slate-200'}`}
                        >
                           <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all shadow-sm ${onlineEnabled ? 'left-1' : 'left-5'}`} />
                        </button>
                     </div>
                     
                     <motion.div 
                        initial={false}
                        animate={{ height: onlineEnabled ? 'auto' : 0, opacity: onlineEnabled ? 1 : 0 }}
                        className="overflow-hidden"
                     >
                        <div className="pt-2 border-t border-slate-100 mt-2">
                           <label className="text-[10px] font-bold text-slate-500 block mb-2">کد مرچنت (Merchant ID)</label>
                           <input 
                              type="text" 
                              value={merchantId}
                              onChange={(e) => setMerchantId(e.target.value)}
                              placeholder="xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
                              className="w-full px-4 py-2 rounded-lg border border-slate-200 text-xs font-mono focus:border-blue-500 outline-none bg-slate-50 transition-colors"
                              dir="ltr"
                           />
                        </div>
                     </motion.div>
                  </div>
               </div>
            </SectionCard>

            {/* 6. NOTIFICATIONS */}
            <SectionCard id="notifications" title="اعلان‌ها" subtitle="تنظیم نحوه اطلاع‌رسانی سفارش‌های جدید">
               <div className="space-y-4">
                  <label className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 cursor-pointer transition-colors">
                     <span className="text-sm font-bold text-slate-700">ارسال پیامک (SMS) برای سفارش‌های جدید</span>
                     <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${notifSMS ? 'bg-emerald-500 border-emerald-500' : 'border-slate-300 bg-white'}`}>
                        {notifSMS && <Check className="w-3.5 h-3.5 text-white" />}
                     </div>
                     <input type="checkbox" checked={notifSMS} onChange={() => setNotifSMS(!notifSMS)} className="hidden" />
                  </label>
                  
                  <div className="h-px bg-slate-50 w-full" />

                  <label className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 cursor-pointer transition-colors">
                     <span className="text-sm font-bold text-slate-700">پخش صدای هشدار در پنل مدیریت</span>
                     <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${notifSound ? 'bg-emerald-500 border-emerald-500' : 'border-slate-300 bg-white'}`}>
                        {notifSound && <Check className="w-3.5 h-3.5 text-white" />}
                     </div>
                     <input type="checkbox" checked={notifSound} onChange={() => setNotifSound(!notifSound)} className="hidden" />
                  </label>

                   <div className="h-px bg-slate-50 w-full" />

                  <label className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 cursor-pointer transition-colors">
                     <span className="text-sm font-bold text-slate-700">ارسال ایمیل گزارش روزانه</span>
                     <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${notifEmail ? 'bg-emerald-500 border-emerald-500' : 'border-slate-300 bg-white'}`}>
                        {notifEmail && <Check className="w-3.5 h-3.5 text-white" />}
                     </div>
                     <input type="checkbox" checked={notifEmail} onChange={() => setNotifEmail(!notifEmail)} className="hidden" />
                  </label>
               </div>
            </SectionCard>

          </div>
        </div>
      </div>

      {/* --- BOTTOM ACTION BAR --- */}
      <div className="sticky bottom-0 bg-white border-t border-slate-200 p-4 px-8 flex justify-end gap-4 z-20 shadow-[0_-5px_20px_rgba(0,0,0,0.02)]">
         <button className="px-6 py-2.5 rounded-xl text-sm font-bold text-slate-500 hover:bg-slate-50 transition-colors">
            انصراف
         </button>
         <button 
            onClick={handleSave}
            disabled={isSaving}
            className="px-8 py-2.5 bg-emerald-600 text-white rounded-xl text-sm font-bold hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-200 flex items-center gap-2 active:scale-95"
         >
            {isSaving ? (
               <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>در حال ذخیره...</span>
               </>
            ) : (
               'ذخیره تغییرات'
            )}
         </button>
      </div>

    </div>
  );
};

export default Settings;