import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useRepositories } from '../data/RepositoryProvider';
import { useAppSession } from '../data/SessionProvider';
import { Store, Palette, MapPin, Phone, ArrowLeft, Loader2, Sparkles } from 'lucide-react';

interface OnboardingScreenProps {
  onLogout: () => void;
}

const BRAND_COLORS = [
  { name: 'emerald', label: 'سبز نعنایی', class: 'bg-emerald-500 hover:bg-emerald-600' },
  { name: 'blue', label: 'آبی اقیانوسی', class: 'bg-blue-500 hover:bg-blue-600' },
  { name: 'orange', label: 'نارنجی خورشیدی', class: 'bg-orange-500 hover:bg-orange-600' },
  { name: 'red', label: 'قرمز گیلاسی', class: 'bg-red-500 hover:bg-red-600' },
  { name: 'purple', label: 'بنفش ارغوانی', class: 'bg-purple-500 hover:bg-purple-600' },
];

export const OnboardingScreen: React.FC<OnboardingScreenProps> = ({ onLogout }) => {
  const { tenantRepository } = useRepositories();
  const { refetchSession } = useAppSession();

  const [name, setName] = useState('');
  const [color, setColor] = useState('emerald');
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('نام رستوران نمی‌تواند خالی باشد');
      return;
    }
    if (!address.trim()) {
      setError('آدرس رستوران الزامی است');
      return;
    }
    if (!phone.trim()) {
      setError('شماره تماس رستوران الزامی است');
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      if (tenantRepository.createRestaurant) {
        await tenantRepository.createRestaurant(name, color, address, phone);
        await refetchSession();
      } else {
        throw new Error('ایجاد رستوران در این نسخه پشتیبانی نمی‌شود.');
      }
    } catch (err: any) {
      setError(err?.message || 'خطا در ثبت اطلاعات رستوران');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col items-center justify-center p-6 relative font-['Vazirmatn'] select-none overflow-hidden" style={{ direction: 'rtl' }}>
      {/* Background Orbs */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-emerald-500/5 dark:bg-emerald-500/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500/5 dark:bg-blue-500/10 rounded-full blur-[100px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 200, damping: 25 }}
        className="w-full max-w-xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[2.5rem] p-8 md:p-10 shadow-xl relative z-10"
      >
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 flex items-center justify-center">
              <Store className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl font-black text-slate-800 dark:text-slate-100">راه‌اندازی رستوران جدید</h1>
              <p className="text-xs text-slate-400 mt-1">با وارد کردن مشخصات زیر، اولین ویترین خود را بسازید</p>
            </div>
          </div>
          <button
            onClick={onLogout}
            className="p-2.5 hover:bg-slate-50 dark:hover:bg-slate-850 rounded-xl transition-colors text-slate-400 flex items-center gap-2 text-xs font-bold"
          >
            خروج از حساب
            <ArrowLeft className="w-4 h-4" />
          </button>
        </div>

        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 bg-rose-50 dark:bg-rose-950/20 text-rose-600 dark:text-rose-400 rounded-2xl text-xs font-bold border border-rose-100 dark:border-rose-950/30"
          >
            {error}
          </motion.div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Restaurant Name */}
          <div className="space-y-2">
            <label className="text-xs font-black text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-amber-500" />
              نام رستوران یا کافی‌شاپ
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="مثال: رستوران ایتالیایی لیمو"
              className="w-full bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 rounded-2xl px-4 py-3.5 text-sm focus:border-emerald-500 outline-none transition-colors dark:text-slate-100"
            />
          </div>

          {/* Brand Color */}
          <div className="space-y-3">
            <label className="text-xs font-black text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
              <Palette className="w-4 h-4 text-indigo-500" />
              رنگ سازمانی و تم رنگی منو
            </label>
            <div className="flex flex-wrap gap-3">
              {BRAND_COLORS.map((col) => (
                <button
                  key={col.name}
                  type="button"
                  onClick={() => setColor(col.name)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-full text-xs font-bold border transition-all ${
                    color === col.name
                      ? 'border-slate-800 dark:border-white ring-2 ring-emerald-500/20 bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-white'
                      : 'border-slate-200 dark:border-slate-800 bg-transparent text-slate-500 dark:text-slate-400'
                  }`}
                >
                  <span className={`w-3 h-3 rounded-full ${col.class}`} />
                  {col.label}
                </button>
              ))}
            </div>
          </div>

          {/* Address */}
          <div className="space-y-2">
            <label className="text-xs font-black text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-emerald-500" />
              آدرس کامل
            </label>
            <textarea
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="مثال: تهران، سعادت آباد، خیابان سرو غربی، پلاک ۱۲"
              rows={2}
              className="w-full bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 rounded-2xl px-4 py-3 text-sm focus:border-emerald-500 outline-none transition-colors dark:text-slate-100 resize-none"
            />
          </div>

          {/* Phone */}
          <div className="space-y-2">
            <label className="text-xs font-black text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
              <Phone className="w-4 h-4 text-blue-500" />
              شماره تماس
            </label>
            <input
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="مثال: 02122001122"
              className="w-full bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 rounded-2xl px-4 py-3.5 text-sm focus:border-emerald-500 outline-none transition-colors dark:text-slate-100"
            />
          </div>

          {/* Action button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-4 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs rounded-2xl shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 disabled:opacity-80 active:scale-95"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                در حال ثبت اطلاعات...
              </>
            ) : (
              'ثبت و شروع مدیریت منو'
            )}
          </button>
        </form>
      </motion.div>
    </div>
  );
};
