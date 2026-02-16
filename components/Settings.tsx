
import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { 
  Store, 
  Clock, 
  Palette, 
  CreditCard, 
  Bell, 
  Image as ImageIcon,
  Check, 
  Upload,
  Smartphone,
  Mail,
  Volume2
} from 'lucide-react';

const SECTIONS = [
  { id: 'general', label: 'اطلاعات کلی', icon: Store },
  { id: 'hours', label: 'ساعات کاری', icon: Clock },
  { id: 'appearance', label: 'شخصی‌سازی ظاهر', icon: Palette },
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
  { id: 'zinc', value: '#3f3f46', label: 'خاکستری' },
  { id: 'slate', value: '#0f172a', label: 'سرمه‌ای' },
  { id: 'orange', value: '#f97316', label: 'نارنجی' },
  { id: 'red', value: '#ef4444', label: 'قرمز' },
  { id: 'blue', value: '#3b82f6', label: 'آبی' },
  { id: 'emerald', value: '#10b981', label: 'زمردی' },
  { id: 'violet', value: '#8b5cf6', label: 'بنفش' },
  { id: 'pink', value: '#ec4899', label: 'صورتی' },
];

const FONTS = [
  { id: 'vazir', label: 'وزیرمتن', sub: 'استاندارد و خوانا' },
  { id: 'iransans', label: 'ایران سنس', sub: 'مدرن و محبوب' },
  { id: 'yekan', label: 'یکان بخ', sub: 'هندسی و جذاب' },
];

const GATEWAYS = [
  { id: 'zarinpal', label: 'زرین‌پال' },
  { id: 'nextpay', label: 'نکست‌پی' },
  { id: 'idpay', label: 'آیدی‌پی' },
  { id: 'saman', label: 'بانک سامان' },
  { id: 'mellat', label: 'بانک ملت' },
];

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
    <div className="p-6">{children}</div>
  </section>
);

interface ToggleProps {
  label: string;
  description?: string;
  checked: boolean;
  onChange: (val: boolean) => void;
  icon?: any;
  brandColor: string;
}

const Toggle: React.FC<ToggleProps> = ({ label, description, checked, onChange, icon: Icon, brandColor }) => (
  <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
    <div className="flex items-center gap-3">
      {Icon && <div className={`p-2 rounded-xl ${checked ? `bg-${brandColor}-100 text-${brandColor}-600` : 'bg-slate-200 text-slate-500'}`}><Icon className="w-5 h-5" /></div>}
      <div>
        <div className="text-sm font-bold text-slate-700">{label}</div>
        {description && <div className="text-[10px] text-slate-400 mt-0.5">{description}</div>}
      </div>
    </div>
    <button 
      onClick={() => onChange(!checked)}
      className={`w-12 h-7 rounded-full relative transition-colors ${checked ? `bg-${brandColor}-500` : 'bg-slate-300'}`}
    >
      <div className={`absolute top-1 w-5 h-5 bg-white rounded-full shadow-sm transition-all ${checked ? 'left-1' : 'left-6'}`} />
    </button>
  </div>
);

interface SettingsProps {
  restaurantName: string;
  setRestaurantName: (val: string) => void;
  restaurantLogo: string;
  setRestaurantLogo: (val: string) => void;
  brandColor: string;
  setBrandColor: (val: string) => void;
}

const Settings: React.FC<SettingsProps> = ({ 
  restaurantName, 
  setRestaurantName, 
  restaurantLogo, 
  setRestaurantLogo,
  brandColor,
  setBrandColor
}) => {
  const [activeSection, setActiveSection] = useState('general');
  const [isSaving, setIsSaving] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // General State
  const [phone, setPhone] = useState('021-88990000');
  const [description, setDescription] = useState('');
  
  // Hours State
  const [hours, setHours] = useState(DAYS.map(day => ({ ...day, isOpen: day.id !== 'fri', start: '11:00 AM', end: '11:00 PM' })));
  
  // Appearance State (brandColor comes from props)
  const [font, setFont] = useState('vazir');

  // Payment State
  const [cashEnabled, setCashEnabled] = useState(true);
  const [cardReaderEnabled, setCardReaderEnabled] = useState(true);
  const [onlineEnabled, setOnlineEnabled] = useState(false);
  const [gateway, setGateway] = useState('zarinpal');
  const [merchantId, setMerchantId] = useState('');
  const [taxRate, setTaxRate] = useState('9');
  const [deliveryFee, setDeliveryFee] = useState('25000');

  // Notifications State
  const [notifSMSOrder, setNotifSMSOrder] = useState(true);
  const [notifSMSCustomer, setNotifSMSCustomer] = useState(true);
  const [notifDashboardSound, setNotifDashboardSound] = useState(true);
  const [notifEmailReport, setNotifEmailReport] = useState(false);

  const scrollToSection = (id: string) => {
    setActiveSection(id);
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => setIsSaving(false), 1500);
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert('File size too large (max 5MB)');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        if (reader.result) {
          setRestaurantLogo(reader.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerFileUpload = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="flex flex-col h-full bg-slate-50 font-['Vazirmatn'] relative">
      <div className="p-8 pb-4 shrink-0">
         <h1 className="text-2xl font-black text-slate-900">تنظیمات فروشگاه</h1>
         <p className="text-sm text-slate-400 mt-1">اطلاعات و پیکربندی‌های عمومی رستوران خود را مدیریت کنید</p>
      </div>

      <div className="flex-1 overflow-y-auto px-8 pb-24">
        <div className="flex flex-col lg:flex-row gap-8">
          <aside className="w-full lg:w-72 shrink-0 space-y-6 order-2 lg:order-1">
            <div className="bg-white rounded-[1.5rem] p-2 shadow-sm border border-slate-100 sticky top-4">
               <nav className="space-y-1">
                 {SECTIONS.map(item => (
                   <button 
                     key={item.id} 
                     onClick={() => scrollToSection(item.id)} 
                     className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold transition-all ${activeSection === item.id ? 'bg-slate-50 text-slate-900' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-700'}`}
                   >
                     <item.icon className={`w-4 h-4 ${activeSection === item.id ? `text-${brandColor}-600` : 'text-slate-400'}`} />
                     {item.label}
                   </button>
                 ))}
               </nav>
            </div>
          </aside>

          <div className="flex-1 space-y-8 order-1 lg:order-2">
            
            {/* GENERAL SECTION */}
            <SectionCard id="general" title="اطلاعات کلی" subtitle="اطلاعات پایه رستوران خود را ویرایش کنید">
               <div className="flex flex-col md:flex-row gap-8 items-start">
                  <div className="w-full md:w-auto flex flex-col items-center gap-3">
                     <div 
                        onClick={triggerFileUpload}
                        className={`w-24 h-24 rounded-full border-2 border-dashed border-slate-300 flex items-center justify-center bg-slate-50 cursor-pointer hover:border-${brandColor}-500 hover:bg-${brandColor}-50 transition-all group relative overflow-hidden`}
                     >
                       {restaurantLogo ? (
                         <img src={restaurantLogo} alt="Logo" className="w-full h-full object-cover" />
                       ) : (
                         <ImageIcon className={`w-8 h-8 text-slate-300 group-hover:text-${brandColor}-500 transition-colors`} />
                       )}
                       <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                          <Upload className="w-5 h-5 text-white" />
                       </div>
                     </div>
                     <input 
                       ref={fileInputRef}
                       type="file" 
                       accept="image/*" 
                       onChange={handleLogoUpload} 
                       className="hidden" 
                     />
                     <div className="text-center">
                        <span className="block text-xs font-bold text-slate-700">لوگوی رستوران</span>
                        <button 
                          onClick={triggerFileUpload}
                          className={`text-[10px] text-${brandColor}-600 font-bold mt-1 hover:underline`}
                        >
                          بارگذاری تصویر جدید
                        </button>
                     </div>
                  </div>
                  <div className="flex-1 w-full space-y-4">
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                           <label className="text-xs font-bold text-slate-500">نام رستوران</label>
                           <input type="text" value={restaurantName} onChange={(e) => setRestaurantName(e.target.value)} className={`w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:border-${brandColor}-500 outline-none bg-white transition-colors`} />
                        </div>
                        <div className="space-y-2">
                           <label className="text-xs font-bold text-slate-500">شماره تماس</label>
                           <input type="text" dir="ltr" value={phone} onChange={(e) => setPhone(e.target.value)} className={`w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:border-${brandColor}-500 outline-none bg-white transition-colors text-left`} />
                        </div>
                     </div>
                     <div className="space-y-2"><label className="text-xs font-bold text-slate-500">توضیحات کوتاه</label><textarea rows={3} value={description} onChange={(e) => setDescription(e.target.value)} className={`w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:border-${brandColor}-500 outline-none bg-white transition-colors resize-none`} /></div>
                  </div>
               </div>
            </SectionCard>
            
            {/* HOURS SECTION */}
            <SectionCard id="hours" title="ساعات کاری" subtitle="زمان‌بندی فعالیت رستوران در طول هفته">
              <div className="space-y-4">
                {hours.map((day) => (
                  <div key={day.id} className="grid grid-cols-12 gap-4 items-center py-2 border-b border-slate-50 last:border-0">
                    <div className="col-span-2 text-sm font-bold text-slate-700">{day.label}</div>
                    <div className="col-span-2 flex justify-center"><button onClick={() => setHours(hours.map(h => h.id === day.id ? { ...h, isOpen: !h.isOpen } : h))} className={`w-10 h-6 rounded-full relative transition-colors ${day.isOpen ? `bg-${brandColor}-500` : 'bg-slate-200'}`}><div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all shadow-sm ${day.isOpen ? 'left-1' : 'left-5'}`} /></button></div>
                    <div className="col-span-8 flex items-center gap-2 justify-center">{day.isOpen ? <><input type="text" value={day.start} className="w-24 text-center text-xs font-bold bg-white border border-slate-200 rounded-lg py-1.5" dir="ltr" /><span className="text-slate-300">تا</span><input type="text" value={day.end} className="w-24 text-center text-xs font-bold bg-white border border-slate-200 rounded-lg py-1.5" dir="ltr" /></> : <span className="text-xs font-bold text-slate-300">تعطیل</span>}</div>
                  </div>
                ))}
              </div>
            </SectionCard>

            {/* APPEARANCE SECTION */}
            <SectionCard id="appearance" title="شخصی‌سازی ظاهر" subtitle="رنگ و فونت منوی دیجیتال خود را انتخاب کنید">
               <div className="space-y-8">
                  <div className="space-y-3">
                     <label className="text-sm font-bold text-slate-700">رنگ اصلی برند</label>
                     <div className="flex flex-wrap gap-4">
                        {COLORS.map(color => (
                           <button 
                             key={color.id}
                             onClick={() => setBrandColor(color.id)}
                             className={`group relative w-12 h-12 rounded-full flex items-center justify-center transition-all ${brandColor === color.id ? 'ring-4 ring-slate-100 scale-110' : 'hover:scale-105'}`}
                             style={{ backgroundColor: color.value }}
                           >
                              {brandColor === color.id && <Check className="w-5 h-5 text-white" />}
                              <span className="absolute -bottom-8 text-[10px] font-bold text-slate-500 opacity-0 group-hover:opacity-100 transition-opacity bg-white px-2 py-1 rounded-md shadow-sm border border-slate-100 whitespace-nowrap z-10">{color.label}</span>
                           </button>
                        ))}
                     </div>
                  </div>

                  <div className="space-y-3">
                     <label className="text-sm font-bold text-slate-700">قلم نمایشی (فونت)</label>
                     <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {FONTS.map(f => (
                           <button
                              key={f.id}
                              onClick={() => setFont(f.id)}
                              className={`p-4 rounded-2xl border text-right transition-all ${
                                 font === f.id 
                                 ? `bg-${brandColor}-50 border-${brandColor}-500 ring-4 ring-${brandColor}-500/10` 
                                 : `bg-white border-slate-200 hover:border-${brandColor}-200`
                              }`}
                           >
                              <div className="font-black text-slate-800 text-lg mb-1">{f.label}</div>
                              <div className="text-xs text-slate-400 font-medium">{f.sub}</div>
                           </button>
                        ))}
                     </div>
                  </div>
               </div>
            </SectionCard>

            {/* PAYMENT SECTION */}
            <SectionCard id="payment" title="درگاه پرداخت و مالی" subtitle="روش‌های پرداخت و تنظیمات مالی سفارشات">
               <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                     <Toggle 
                        label="پرداخت نقدی" 
                        description="امکان پرداخت در محل به صورت نقدی" 
                        checked={cashEnabled} 
                        onChange={setCashEnabled} 
                        brandColor={brandColor}
                     />
                     <Toggle 
                        label="دستگاه کارتخوان" 
                        description="همراه داشتن کارتخوان سیار پیک" 
                        checked={cardReaderEnabled} 
                        onChange={setCardReaderEnabled} 
                        brandColor={brandColor}
                     />
                  </div>
                  
                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-4">
                     <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                           <div className={`p-2 rounded-xl ${onlineEnabled ? `bg-${brandColor}-100 text-${brandColor}-600` : 'bg-slate-200 text-slate-500'}`}>
                              <CreditCard className="w-5 h-5" />
                           </div>
                           <div>
                              <div className="text-sm font-bold text-slate-700">پرداخت آنلاین</div>
                              <div className="text-[10px] text-slate-400 mt-0.5">اتصال به درگاه بانکی برای پرداخت سفارشات</div>
                           </div>
                        </div>
                        <button 
                           onClick={() => setOnlineEnabled(!onlineEnabled)}
                           className={`w-12 h-7 rounded-full relative transition-colors ${onlineEnabled ? `bg-${brandColor}-500` : 'bg-slate-300'}`}
                        >
                           <div className={`absolute top-1 w-5 h-5 bg-white rounded-full shadow-sm transition-all ${onlineEnabled ? 'left-1' : 'left-6'}`} />
                        </button>
                     </div>

                     {onlineEnabled && (
                        <motion.div 
                           initial={{ height: 0, opacity: 0 }}
                           animate={{ height: 'auto', opacity: 1 }}
                           className="pt-4 border-t border-slate-200 grid grid-cols-1 md:grid-cols-2 gap-4"
                        >
                           <div className="space-y-2">
                              <label className="text-xs font-bold text-slate-500">انتخاب درگاه</label>
                              <select 
                                 value={gateway}
                                 onChange={(e) => setGateway(e.target.value)}
                                 className={`w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:border-${brandColor}-500 outline-none bg-white`}
                              >
                                 {GATEWAYS.map(g => <option key={g.id} value={g.id}>{g.label}</option>)}
                              </select>
                           </div>
                           <div className="space-y-2">
                              <label className="text-xs font-bold text-slate-500">مرچنت کد (Merchant ID)</label>
                              <input 
                                 type="text" 
                                 dir="ltr"
                                 value={merchantId}
                                 onChange={(e) => setMerchantId(e.target.value)}
                                 className={`w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:border-${brandColor}-500 outline-none bg-white text-left font-mono`}
                                 placeholder="XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX"
                              />
                           </div>
                        </motion.div>
                     )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                     <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-500">مالیات بر ارزش افزوده (٪)</label>
                        <input 
                           type="number" 
                           dir="ltr"
                           value={taxRate}
                           onChange={(e) => setTaxRate(e.target.value)}
                           className={`w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:border-${brandColor}-500 outline-none bg-white text-center`}
                        />
                     </div>
                     <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-500">هزینه ارسال ثابت (تومان)</label>
                        <input 
                           type="number" 
                           dir="ltr"
                           value={deliveryFee}
                           onChange={(e) => setDeliveryFee(e.target.value)}
                           className={`w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:border-${brandColor}-500 outline-none bg-white text-center`}
                        />
                     </div>
                  </div>
               </div>
            </SectionCard>

            {/* NOTIFICATIONS SECTION */}
            <SectionCard id="notifications" title="تنظیمات اعلان‌ها" subtitle="مدیریت روش‌های اطلاع‌رسانی رخدادها">
               <div className="space-y-4">
                  <Toggle 
                     label="پیامک ثبت سفارش جدید" 
                     description="ارسال پیامک به مدیر رستوران هنگام ثبت سفارش جدید" 
                     checked={notifSMSOrder} 
                     onChange={setNotifSMSOrder} 
                     icon={Smartphone}
                     brandColor={brandColor}
                  />
                  <Toggle 
                     label="پیامک وضعیت سفارش به مشتری" 
                     description="ارسال پیامک تغییر وضعیت (تایید، ارسال) به مشتری" 
                     checked={notifSMSCustomer} 
                     onChange={setNotifSMSCustomer} 
                     icon={Smartphone}
                     brandColor={brandColor}
                  />
                  <Toggle 
                     label="صدای هشدار داشبورد" 
                     description="پخش صدای زنگ هنگام دریافت سفارش جدید در پنل مدیریت" 
                     checked={notifDashboardSound} 
                     onChange={setNotifDashboardSound} 
                     icon={Volume2}
                     brandColor={brandColor}
                  />
                  <Toggle 
                     label="ایمیل گزارش هفتگی" 
                     description="ارسال خلاصه عملکرد فروشگاه در پایان هر هفته" 
                     checked={notifEmailReport} 
                     onChange={setNotifEmailReport} 
                     icon={Mail}
                     brandColor={brandColor}
                  />
               </div>
            </SectionCard>

          </div>
        </div>
      </div>

      <div className="sticky bottom-0 bg-white border-t border-slate-200 p-4 px-8 flex justify-end gap-4 z-20 shadow-[0_-5px_20px_rgba(0,0,0,0.02)]">
         <button className="px-6 py-2.5 rounded-xl text-sm font-bold text-slate-500 hover:bg-slate-50 transition-colors">انصراف</button>
         <button onClick={handleSave} disabled={isSaving} className={`px-8 py-2.5 bg-${brandColor}-600 text-white rounded-xl text-sm font-bold hover:bg-${brandColor}-700 transition-all shadow-lg shadow-${brandColor}-200 flex items-center gap-2 active:scale-95`}>{isSaving ? 'در حال ذخیره...' : 'ذخیره تغییرات'}</button>
      </div>
    </div>
  );
};

export default Settings;
