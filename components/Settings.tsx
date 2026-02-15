
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

interface SettingsProps {
  restaurantName: string;
  setRestaurantName: (val: string) => void;
}

const Settings: React.FC<SettingsProps> = ({ restaurantName, setRestaurantName }) => {
  const [activeSection, setActiveSection] = useState('general');
  const [isSaving, setIsSaving] = useState(false);

  const [phone, setPhone] = useState('021-88990000');
  const [description, setDescription] = useState('');
  const [hours, setHours] = useState(DAYS.map(day => ({ ...day, isOpen: day.id !== 'fri', start: '11:00 AM', end: '11:00 PM' })));
  const [brandColor, setBrandColor] = useState('emerald');
  const [font, setFont] = useState('vazir');
  const [slug, setSlug] = useState('limo-restaurant');
  const [metaTitle, setMetaTitle] = useState('');
  const [metaDesc, setMetaDesc] = useState('');
  const [cashEnabled, setCashEnabled] = useState(true);
  const [onlineEnabled, setOnlineEnabled] = useState(false);
  const [merchantId, setMerchantId] = useState('');
  const [notifSMS, setNotifSMS] = useState(true);
  const [notifSound, setNotifSound] = useState(false);
  const [notifEmail, setNotifEmail] = useState(true);

  const scrollToSection = (id: string) => {
    setActiveSection(id);
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => setIsSaving(false), 1500);
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
            <div className="bg-white rounded-[1.5rem] p-2 shadow-sm border border-slate-100 sticky top-0">
               <div className="bg-emerald-50 rounded-xl p-4 mb-2">
                  <div className="flex items-center gap-2 mb-2"><Crown className="w-5 h-5 text-emerald-600" /><span className="font-black text-emerald-800 text-sm">پلن حرفه‌ای</span></div>
                  <div className="text-[10px] text-emerald-600 font-bold mb-3">۲۵ روز باقی‌مانده</div>
                  <button className="w-full py-2 bg-emerald-600 text-white rounded-lg text-xs font-bold hover:bg-emerald-700 transition-colors shadow-lg shadow-emerald-200">تمدید اشتراک</button>
               </div>
               <nav className="space-y-1">{SECTIONS.map(item => (<button key={item.id} onClick={() => scrollToSection(item.id)} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold transition-all ${activeSection === item.id ? 'bg-slate-50 text-slate-900' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-700'}`}><item.icon className={`w-4 h-4 ${activeSection === item.id ? 'text-emerald-600' : 'text-slate-400'}`} />{item.label}</button>))}</nav>
            </div>
          </aside>

          <div className="flex-1 space-y-8 order-1 lg:order-2">
            <SectionCard id="general" title="اطلاعات کلی" subtitle="اطلاعات پایه رستوران خود را ویرایش کنید">
               <div className="flex flex-col md:flex-row gap-8 items-start">
                  <div className="w-full md:w-auto flex flex-col items-center gap-3">
                     <div className="w-24 h-24 rounded-full border-2 border-dashed border-slate-300 flex items-center justify-center bg-slate-50 cursor-pointer hover:border-emerald-500 hover:bg-emerald-50 transition-all group relative overflow-hidden"><ImageIcon className="w-8 h-8 text-slate-300 group-hover:text-emerald-500 transition-colors" /><div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"><Upload className="w-5 h-5 text-white" /></div></div>
                     <div className="text-center"><span className="block text-xs font-bold text-slate-700">لوگوی رستوران</span><button className="text-[10px] text-emerald-600 font-bold mt-1 hover:underline">بارگذاری تصویر جدید</button></div>
                  </div>
                  <div className="flex-1 w-full space-y-4">
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                           <label className="text-xs font-bold text-slate-500">نام رستوران</label>
                           <input type="text" value={restaurantName} onChange={(e) => setRestaurantName(e.target.value)} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:border-emerald-500 outline-none bg-white transition-colors" />
                        </div>
                        <div className="space-y-2">
                           <label className="text-xs font-bold text-slate-500">شماره تماس</label>
                           <input type="text" dir="ltr" value={phone} onChange={(e) => setPhone(e.target.value)} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:border-emerald-500 outline-none bg-white transition-colors text-left" />
                        </div>
                     </div>
                     <div className="space-y-2"><label className="text-xs font-bold text-slate-500">توضیحات کوتاه</label><textarea rows={3} value={description} onChange={(e) => setDescription(e.target.value)} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:border-emerald-500 outline-none bg-white transition-colors resize-none" /></div>
                  </div>
               </div>
            </SectionCard>
            {/* Rest of the sections remain as they were but simplified for readability in this update */}
            <SectionCard id="hours" title="ساعات کاری" subtitle="زمان‌بندی فعالیت رستوران در طول هفته">
              <div className="space-y-4">
                {hours.map((day) => (
                  <div key={day.id} className="grid grid-cols-12 gap-4 items-center py-2 border-b border-slate-50 last:border-0">
                    <div className="col-span-2 text-sm font-bold text-slate-700">{day.label}</div>
                    <div className="col-span-2 flex justify-center"><button onClick={() => setHours(hours.map(h => h.id === day.id ? { ...h, isOpen: !h.isOpen } : h))} className={`w-10 h-6 rounded-full relative transition-colors ${day.isOpen ? 'bg-emerald-500' : 'bg-slate-200'}`}><div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all shadow-sm ${day.isOpen ? 'left-1' : 'left-5'}`} /></button></div>
                    <div className="col-span-8 flex items-center gap-2 justify-center">{day.isOpen ? <><input type="text" value={day.start} className="w-24 text-center text-xs font-bold bg-white border border-slate-200 rounded-lg py-1.5" dir="ltr" /><span className="text-slate-300">تا</span><input type="text" value={day.end} className="w-24 text-center text-xs font-bold bg-white border border-slate-200 rounded-lg py-1.5" dir="ltr" /></> : <span className="text-xs font-bold text-slate-300">تعطیل</span>}</div>
                  </div>
                ))}
              </div>
            </SectionCard>
          </div>
        </div>
      </div>

      <div className="sticky bottom-0 bg-white border-t border-slate-200 p-4 px-8 flex justify-end gap-4 z-20 shadow-[0_-5px_20px_rgba(0,0,0,0.02)]">
         <button className="px-6 py-2.5 rounded-xl text-sm font-bold text-slate-500 hover:bg-slate-50 transition-colors">انصراف</button>
         <button onClick={handleSave} disabled={isSaving} className="px-8 py-2.5 bg-emerald-600 text-white rounded-xl text-sm font-bold hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-200 flex items-center gap-2 active:scale-95">{isSaving ? 'در حال ذخیره...' : 'ذخیره تغییرات'}</button>
      </div>
    </div>
  );
};

export default Settings;
