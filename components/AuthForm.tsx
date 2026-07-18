
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  ConciergeBell, 
  Mail,
  Lock, 
  ArrowLeft, 
  Eye, 
  EyeOff, 
  Store,
  Check
} from 'lucide-react';

const ModernInput = ({ label, type, value, onChange, placeholder, icon: Icon, showPasswordToggle, error, brandColor }: any) => {
  const [showPassword, setShowPassword] = useState(false);
  const inputType = showPassword ? 'text' : type;

  return (
    <div className="space-y-1.5 w-full">
      <div className="flex justify-between items-end">
        <label className={`text-xs font-bold block ${error ? 'text-red-500 dark:text-red-400' : 'text-slate-700 dark:text-slate-300'}`}>{label}</label>
        {error && (
          <motion.span 
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-[10px] font-bold text-red-500 dark:text-red-400"
          >
            {error}
          </motion.span>
        )}
      </div>
      <div className="relative group">
        <div className={`absolute left-3.5 top-1/2 -translate-y-1/2 transition-colors z-10 ${error ? 'text-red-400' : `text-slate-400 dark:text-slate-500 group-focus-within:text-${brandColor}-600 dark:group-focus-within:text-emerald-400`}`}>
          <Icon className="w-5 h-5" />
        </div>
        <input 
          type={inputType}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className={`w-full bg-white dark:bg-[#0d221e] text-slate-900 dark:text-slate-100 text-sm font-medium border rounded-xl py-3 pl-11 outline-none transition-all placeholder:text-slate-400/70 dark:placeholder:text-slate-500
            ${showPasswordToggle ? 'pr-11' : 'pr-4'}
            ${error 
              ? 'border-red-200 dark:border-red-500/30 focus:border-red-500 focus:ring-4 focus:ring-red-500/10' 
              : `border-slate-200 dark:border-white/10 focus:border-${brandColor}-500 focus:ring-4 focus:ring-${brandColor}-500/10 dark:focus:border-emerald-500 dark:focus:ring-emerald-500/15`
            }
          `}
          dir="ltr" 
          style={{ textAlign: 'left' }}
        />
        {showPasswordToggle && (
           <button 
             type="button"
             onClick={() => setShowPassword(!showPassword)}
             className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300 p-1 border-0 bg-transparent cursor-pointer"
           >
             {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
           </button>
        )}
      </div>
    </div>
  );
};

const WELCOME_MESSAGES = [
  "خوش آمدید! 👋",
  "امروز چه چیزی می‌سازیم؟ 🚀",
  "مدیریت حرفه‌ای رستوران 💎",
  "همراه شما در رشد 📈",
  "به ویترین خوش آمدید ✨"
];

const TypewriterText = ({ brandColor }: { brandColor: string }) => {
  const [index, setIndex] = useState(0);
  const [subIndex, setSubIndex] = useState(0);
  const [reverse, setReverse] = useState(false);
  const [blink, setBlink] = useState(true);

  useEffect(() => {
    const timeout2 = setTimeout(() => {
      setBlink((prev) => !prev);
    }, 500);
    return () => clearTimeout(timeout2);
  }, [blink]);

  useEffect(() => {
    if (subIndex === WELCOME_MESSAGES[index].length + 1 && !reverse) {
      setTimeout(() => setReverse(true), 2000);
      return;
    }

    if (subIndex === 0 && reverse) {
      setReverse(false);
      setIndex((prev) => (prev + 1) % WELCOME_MESSAGES.length);
      return;
    }

    const timeout = setTimeout(() => {
      setSubIndex((prev) => prev + (reverse ? -1 : 1));
    }, reverse ? 30 : 80);

    return () => clearTimeout(timeout);
  }, [subIndex, index, reverse]);

  return (
    <span className="inline-block min-h-[40px] text-2xl font-black text-slate-900 dark:text-white">
      {WELCOME_MESSAGES[index].substring(0, subIndex)}
      <span className={`${blink ? 'opacity-100' : 'opacity-0'} text-${brandColor}-500 dark:text-emerald-400`}>|</span>
    </span>
  );
};

interface AuthFormProps {
  onLogin: (restaurantName?: string) => void;
  brandColor: string;
}

const AuthForm: React.FC<AuthFormProps> = ({ onLogin, brandColor }) => {
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');
  const [isLoading, setIsLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  
  // Form State
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [restaurantName, setRestaurantName] = useState(''); // Only for signup
  
  // Errors
  const [errors, setErrors] = useState<{ email?: string; password?: string; restaurantName?: string }>({});

  const validateForm = () => {
    const newErrors: any = {};
    let isValid = true;

    if (!email) {
      newErrors.email = 'ایمیل الزامی است';
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'فرمت ایمیل صحیح نیست';
      isValid = false;
    }

    if (!password) {
      newErrors.password = 'رمز عبور الزامی است';
      isValid = false;
    } else if (password.length < 6) {
      newErrors.password = 'حداقل 6 کاراکتر باشد';
      isValid = false;
    }

    if (authMode === 'signup') {
      if (!restaurantName) {
        newErrors.restaurantName = 'نام رستوران الزامی است';
        isValid = false;
      }
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleAuthAction = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      onLogin(authMode === 'signup' ? restaurantName.trim() : undefined);
    }, 1500);
  };

  const switchMode = (mode: 'login' | 'signup') => {
    setAuthMode(mode);
    setErrors({});
    setEmail('');
    setPassword('');
    setRestaurantName('');
  };

  const formPanelVariants = {
    hidden: { opacity: 0, x: 30 },
    visible: { 
      opacity: 1, 
      x: 0, 
      transition: { 
        duration: 0.65, 
        ease: [0.16, 1, 0.3, 1] 
      } 
    }
  };

  return (
    <motion.div 
      variants={formPanelVariants}
      className="w-full lg:w-1/2 flex flex-col justify-center items-center p-8 lg:p-12 bg-transparent relative min-h-dvh lg:min-h-0 transition-colors duration-300"
    >
      <motion.div 
        key={authMode}
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: -10 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-[400px]"
      >
        {/* Header */}
        <div className="text-center mb-10">
          <div className={`inline-flex items-center justify-center w-14 h-14 bg-${brandColor}-600 dark:bg-emerald-500 rounded-2xl shadow-lg shadow-${brandColor}-200/80 dark:shadow-none dark:ring-1 dark:ring-emerald-500/30 mb-6`}>
            <ConciergeBell className="w-7 h-7 text-white dark:text-slate-950" />
          </div>
          <div className="h-16 flex items-center justify-center mb-2">
             <TypewriterText brandColor={brandColor} />
          </div>
          <p className="text-slate-500 dark:text-slate-400 text-sm">
            {authMode === 'login' ? 'لطفا برای ورود به پنل، مشخصات خود را وارد کنید' : 'برای شروع، اطلاعات رستوران خود را ثبت کنید'}
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleAuthAction} className="space-y-5">
          
          {authMode === 'signup' && (
            <ModernInput 
              label="نام رستوران"
              type="text"
              icon={Store}
              placeholder="رستوران ایتالیایی..."
              value={restaurantName}
              onChange={(e: any) => {
                setRestaurantName(e.target.value);
                if (errors.restaurantName) setErrors({ ...errors, restaurantName: undefined });
              }}
              error={errors.restaurantName}
              brandColor={brandColor}
            />
          )}

          <ModernInput 
            label="ایمیل"
            type="email"
            icon={Mail}
            placeholder="name@company.com"
            value={email}
            onChange={(e: any) => {
              setEmail(e.target.value);
              if (errors.email) setErrors({ ...errors, email: undefined });
            }}
            error={errors.email}
            brandColor={brandColor}
          />

          <ModernInput 
            label="رمز عبور"
            type="password"
            icon={Lock}
            placeholder="••••••••"
            value={password}
            onChange={(e: any) => {
              setPassword(e.target.value);
              if (errors.password) setErrors({ ...errors, password: undefined });
            }}
            showPasswordToggle
            error={errors.password}
            brandColor={brandColor}
          />

          {authMode === 'login' && (
            <div className="flex items-center justify-between mt-2">
               <label className="flex items-center gap-2 cursor-pointer group select-none">
                  <div className="relative">
                     <input 
                        type="checkbox" 
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                        className="sr-only"
                     />
                     <div className={`w-5 h-5 rounded-lg border-2 transition-all duration-200 flex items-center justify-center ${
                        rememberMe 
                           ? `bg-${brandColor}-500 border-${brandColor}-500 dark:bg-emerald-500 dark:border-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.3)] dark:shadow-none` 
                           : `bg-white dark:bg-[#0d221e] border-slate-200 dark:border-white/10 group-hover:border-${brandColor}-200 dark:group-hover:border-emerald-500/50`
                     }`}>
                        <Check className={`w-3.5 h-3.5 text-white transition-all duration-200 ${rememberMe ? 'opacity-100 scale-100' : 'opacity-0 scale-50'}`} strokeWidth={3} />
                     </div>
                  </div>
                  <span className={`text-xs font-bold transition-colors ${rememberMe ? 'text-slate-800 dark:text-slate-200' : 'text-slate-500 dark:text-slate-400'}`}>مرا به خاطر بسپار</span>
               </label>
               <a href="#" className={`text-xs font-bold text-${brandColor}-600 hover:text-${brandColor}-700 dark:text-emerald-400 dark:hover:text-emerald-300 transition-colors`}>رمز عبور را فراموش کردید؟</a>
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full text-sm font-bold rounded-xl py-4 flex items-center justify-center gap-2 mt-4 transition-all active:scale-[0.98] cursor-pointer bg-slate-900 text-white hover:bg-slate-800 shadow-xl shadow-slate-900/10 dark:bg-emerald-500 dark:text-slate-950 dark:hover:bg-emerald-400 dark:shadow-lg dark:shadow-emerald-500/15 border-0"
          >
            {isLoading ? (
               <>
                 <div className="w-4 h-4 border-2 border-white/30 border-t-white dark:border-slate-950/30 dark:border-t-slate-950 rounded-full animate-spin" />
                 <span>در حال پردازش...</span>
               </>
            ) : (
               <>
                 {authMode === 'login' ? 'ورود به پنل' : 'ثبت نام رایگان'}
                 <ArrowLeft className="w-4 h-4" />
               </>
            )}
          </button>
        </form>

        {/* Footer / Toggle Mode */}
        <div className="text-center mt-10">
           {authMode === 'login' ? (
              <p className="text-xs text-slate-500 dark:text-slate-400">
                 حساب کاربری ندارید؟ <button type="button" onClick={() => switchMode('signup')} className={`font-bold bg-transparent border-0 text-${brandColor}-600 dark:text-emerald-400 hover:underline cursor-pointer`}>ثبت‌نام کنید</button>
              </p>
           ) : (
              <p className="text-xs text-slate-500 dark:text-slate-400">
                 قبلاً ثبت‌نام کرده‌اید؟ <button type="button" onClick={() => switchMode('login')} className={`font-bold bg-transparent border-0 text-${brandColor}-600 dark:text-emerald-400 hover:underline cursor-pointer`}>وارد شوید</button>
              </p>
           )}
        </div>

      </motion.div>
      <div className="absolute bottom-6 left-0 right-0 text-center pointer-events-none">
         <p className="text-[10px] text-slate-400 dark:text-slate-500 font-medium">
            © 2025 ویترین. تمامی حقوق محفوظ است.
         </p>
      </div>
    </motion.div>
  );
};

export default AuthForm;
