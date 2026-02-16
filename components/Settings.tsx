
import React, { useState } from 'react';
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

interface SettingsPageProps {
  restaurantName: string;
  setRestaurantName: (name: string) => void;
  restaurantLogo: string;
  setRestaurantLogo: (logo: string) => void;
  brandColor: string;
  setBrandColor: (color: string) => void;
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

const SectionCard = ({ id, title, subtitle, children, icon: Icon, brandColor }: any) => (
  <section id={id} className="bg-white rounded-[2rem] border border-slate-200 p-8 shadow-sm relative overflow-hidden">
    <div className="flex items-start gap-4 mb-8">
      <div className={`p-3 rounded-2xl bg-${brandColor}-50 text-${brandColor}-600`}>
        {Icon && <Icon className="w-6 h-6" />}
      </div>
      <div>
        <h2 className="text-lg font-black text-slate-800">{title}</h2>
        <p className="text-sm text-slate-400 mt-1">{subtitle}</p>
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
  setBrandColor 
}) => {
  const [hours, setHours] = useState(INITIAL_HOURS);
  
  // Local state for other fields not passed from App
  const [address, setAddress] = useState('تهران، سعادت آباد، میدان کاج');
  const [phone, setPhone] = useState('۰۲۱-۲۲xxx');
  const [description, setDescription] = useState('رستورانی با طعم‌های اصیل و به یادماندنی...');

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
    <div className="h-full bg-slate-50 font-['Vazirmatn'] overflow-y-auto p-8 pb-24">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="flex items-center justify-between">
           <div>
              <h1 className="text-2xl font-black text-slate-900 flex items-center gap-3">
                 <Store className={`w-7 h-7 text-${brandColor}-600`} />
                 تنظیمات فروشگاه
              </h1>
              <p className="text-sm text-slate-400 mt-2">مدیریت اطلاعات رستوران و شخصی‌سازی پنل</p>
           </div>
           <button className={`px-6 py-3 bg-${brandColor}-600 text-white rounded-xl text-sm font-bold shadow-lg shadow-${brandColor}-200 hover:bg-${brandColor}-700 transition-all flex items-center gap-2`}>
              <Save className="w-4 h-4" />
              ذخیره تغییرات
           </button>
        </div>

        {/* IDENTITY SECTION */}
        <SectionCard id="identity" title="هویت بصری" subtitle="نام، لوگو و توضیحات رستوران شما" icon={Store} brandColor={brandColor}>
           <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-slate-200 rounded-2xl bg-slate-50 relative group">
                 {restaurantLogo ? (
                    <img src={restaurantLogo} alt="Logo" className="w-32 h-32 object-cover rounded-full shadow-md mb-4" />
                 ) : (
                    <div className="w-32 h-32 bg-slate-200 rounded-full flex items-center justify-center text-slate-400 mb-4">
                       <Camera className="w-10 h-10" />
                    </div>
                 )}
                 <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                    <span className="text-white text-xs font-bold flex items-center gap-2">
                       <Upload className="w-4 h-4" /> تغییر لوگو
                    </span>
                 </div>
                 <input type="file" accept="image/*" onChange={handleLogoUpload} className="absolute inset-0 opacity-0 cursor-pointer" />
                 <p className="text-xs text-slate-400">تصویر با فرمت JPG یا PNG</p>
              </div>

              <div className="md:col-span-2 space-y-6">
                 <div>
                    <label className="text-xs font-bold text-slate-500 block mb-2">نام رستوران</label>
                    <input 
                       type="text" 
                       value={restaurantName}
                       onChange={(e) => setRestaurantName(e.target.value)}
                       className={`w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:border-${brandColor}-500 outline-none transition-colors font-bold text-slate-800`}
                    />
                 </div>
                 <div>
                    <label className="text-xs font-bold text-slate-500 block mb-2">توضیحات کوتاه (شعار)</label>
                    <textarea 
                       rows={3}
                       value={description}
                       onChange={(e) => setDescription(e.target.value)}
                       className={`w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:border-${brandColor}-500 outline-none transition-colors resize-none`}
                    />
                 </div>
              </div>
           </div>
        </SectionCard>

        {/* BRANDING SECTION */}
        <SectionCard id="branding" title="رنگ سازمانی" subtitle="تم رنگی پنل و منوی دیجیتال را انتخاب کنید" icon={Palette} brandColor={brandColor}>
           <div className="flex flex-wrap gap-4">
              {COLORS.map(color => (
                 <button
                    key={color.id}
                    onClick={() => setBrandColor(color.id)}
                    className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${brandColor === color.id ? 'ring-4 ring-offset-2 ring-slate-200 scale-110' : 'hover:scale-105'}`}
                    style={{ backgroundColor: color.hex }}
                 >
                    {brandColor === color.id && <CheckCircle2 className="w-6 h-6 text-white" />}
                 </button>
              ))}
           </div>
        </SectionCard>

        {/* CONTACT SECTION */}
        <SectionCard id="contact" title="اطلاعات تماس" subtitle="آدرس و راه‌های ارتباطی با مشتریان" icon={MapPin} brandColor={brandColor}>
           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                 <label className="text-xs font-bold text-slate-500 block mb-2">آدرس کامل</label>
                 <div className="relative">
                    <MapPin className="w-5 h-5 absolute right-3 top-3 text-slate-400" />
                    <textarea 
                       rows={2}
                       value={address}
                       onChange={(e) => setAddress(e.target.value)}
                       className={`w-full bg-slate-50 border border-slate-200 rounded-xl pr-10 pl-4 py-3 text-sm focus:border-${brandColor}-500 outline-none transition-colors`}
                    />
                 </div>
              </div>
              <div className="space-y-6">
                 <div>
                    <label className="text-xs font-bold text-slate-500 block mb-2">شماره تماس</label>
                    <div className="relative">
                       <Phone className="w-5 h-5 absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" />
                       <input 
                          type="text" 
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          className={`w-full bg-slate-50 border border-slate-200 rounded-xl pr-10 pl-4 py-3 text-sm focus:border-${brandColor}-500 outline-none transition-colors`}
                          dir="ltr"
                          placeholder="021-..."
                       />
                    </div>
                 </div>
                 <div>
                    <label className="text-xs font-bold text-slate-500 block mb-2">وب‌سایت / اینستاگرام</label>
                    <div className="relative">
                       <Globe className="w-5 h-5 absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" />
                       <input 
                          type="text" 
                          placeholder="@restaurant_name"
                          className={`w-full bg-slate-50 border border-slate-200 rounded-xl pr-10 pl-4 py-3 text-sm focus:border-${brandColor}-500 outline-none transition-colors`}
                          dir="ltr"
                       />
                    </div>
                 </div>
              </div>
           </div>
        </SectionCard>

        {/* HOURS SECTION */}
        <SectionCard id="hours" title="ساعات کاری" subtitle="زمان‌بندی فعالیت رستوران در طول هفته" icon={Clock} brandColor={brandColor}>
          <div className="space-y-4">
            {hours.map((day) => (
              <div key={day.id} className="grid grid-cols-12 gap-4 items-center py-2 border-b border-slate-50 last:border-0">
                <div className="col-span-3 text-sm font-bold text-slate-700 flex items-center gap-2">
                   <div className={`w-2 h-2 rounded-full ${day.isOpen ? `bg-${brandColor}-500` : 'bg-slate-300'}`} />
                   {day.label}
                </div>
                <div className="col-span-2 flex justify-center">
                  <button 
                    onClick={() => setHours(hours.map(h => h.id === day.id ? { ...h, isOpen: !h.isOpen } : h))} 
                    className={`w-10 h-6 rounded-full relative transition-colors ${day.isOpen ? `bg-${brandColor}-500` : 'bg-slate-200'}`}
                  >
                    <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all shadow-sm ${day.isOpen ? 'left-1' : 'left-5'}`} />
                  </button>
                </div>
                <div className="col-span-7 flex items-center gap-2 justify-end">
                  {day.isOpen ? (
                    <>
                      <div className="relative">
                        <input 
                          type="text" 
                          value={day.start} 
                          onChange={(e) => setHours(hours.map(h => h.id === day.id ? { ...h, start: e.target.value } : h))}
                          className="w-20 text-center text-xs font-bold bg-slate-50 border border-slate-200 rounded-lg py-2 focus:border-slate-400 outline-none transition-colors" 
                          dir="ltr" 
                        />
                      </div>
                      <span className="text-slate-300 font-bold">-</span>
                      <div className="relative">
                        <input 
                          type="text" 
                          value={day.end} 
                          onChange={(e) => setHours(hours.map(h => h.id === day.id ? { ...h, end: e.target.value } : h))}
                          className="w-20 text-center text-xs font-bold bg-slate-50 border border-slate-200 rounded-lg py-2 focus:border-slate-400 outline-none transition-colors" 
                          dir="ltr" 
                        />
                      </div>
                    </>
                  ) : (
                    <span className="text-xs font-bold text-slate-300 bg-slate-50 px-4 py-2 rounded-lg w-full text-center">تعطیل</span>
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
