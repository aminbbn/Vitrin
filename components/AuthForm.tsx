
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  ConciergeBell, 
  Mail,
  Lock, 
  ArrowLeft, 
  Eye, 
  EyeOff, 
  Store 
} from 'lucide-react';

const ModernInput = ({ label, type, value, onChange, placeholder, icon: Icon, showPasswordToggle, error }: any) => {
  const [showPassword, setShowPassword] = useState(false);
  const inputType = showPassword ? 'text' : type;

  return (
    <div className="space-y-1.5">
      <div className="flex justify-between items-end">
        <label className={`text-xs font-bold block ${error ? 'text-red-500' : 'text-slate-700'}`}>{label}</label>
        {error && (
          <motion.span 
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-[10px] font-bold text-red-500"
          >
            {error}
          </motion.span>
        )}
      </div>
      <div className="relative group">
        <div className={`absolute left-3.5 top-1/2 -translate-y-1/2 transition-colors ${error ? 'text-red-400' : 'text-slate-400 group-focus-within:text-emerald-600'}`}>
          <Icon className="w-5 h-5" />
        </div>
        <input 
          type={inputType}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className={`w-full bg-white text-slate-900 text-sm font-medium border rounded-xl py-3 pl-11 outline-none transition-all placeholder:text-slate-400/70 
            ${showPasswordToggle ? 'pr-11' : 'pr-4'}
            ${error ? 'border-red-200 focus:border-red-500 focus:ring-4 focus:ring-red-500/10' : 'border-slate-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10'}
          `}
          dir="ltr" 
          style={{ textAlign: 'left' }}
        />
        {showPasswordToggle && (
           <button 
             type="button"
             onClick={() => setShowPassword(!showPassword)}
             className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
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

const TypewriterText = () => {
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
    <span className="inline-block min-h-[40px] text-2xl font-black text-slate-900">
      {WELCOME_MESSAGES[index].substring(0, subIndex)}
      <span className={`${blink ? 'opacity-100' : 'opacity-0'} text-emerald-500`}>|</span>
    </span>
  );
};

interface AuthFormProps {
  onLogin: () => void;
}

const AuthForm: React.FC<AuthFormProps> = ({ onLogin }) => {
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');
  const [isLoading, setIsLoading] = useState(false);
  
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
      newErrors.password = 'حداقل ۶ کاراکتر باشد';
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
      onLogin();
    }, 1500);
  };

  const switchMode = (mode: 'login' | 'signup') => {
    setAuthMode(mode);
    setErrors({});
    setEmail('');
    setPassword('');
    setRestaurantName('');
  };

  return (
    <div className="w-full lg:w-1/2 flex flex-col justify-center items-center p-6 bg-slate-50/50">
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
          <div className="inline-flex items-center justify-center w-14 h-14 bg-emerald-600 rounded-2xl shadow-lg shadow-emerald-200 mb-6">
            <ConciergeBell className="w-7 h-7 text-white" />
          </div>
          <div className="h-16 flex items-center justify-center mb-2">
             <TypewriterText />
          </div>
          <p className="text-slate-500 text-sm">
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
          />

          {authMode === 'login' && (
            <div className="flex items-center justify-between">
               <label className="flex items-center gap-2 cursor-pointer">
                  <div className="relative flex items-center">
                     {/* Added bg-white to ensure checkbox background is white when unchecked */}
                     <input type="checkbox" className="peer w-4 h-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500 bg-white" />
                  </div>
                  <span className="text-xs font-bold text-slate-500">مرا به خاطر بسپار</span>
               </label>
               <a href="#" className="text-xs font-bold text-emerald-600 hover:text-emerald-700">رمز عبور را فراموش کردید؟</a>
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-slate-900 text-white rounded-xl py-4 font-bold text-sm shadow-xl shadow-slate-900/20 hover:bg-slate-800 active:scale-[0.98] transition-all flex items-center justify-center gap-2 mt-4"
          >
            {isLoading ? (
               <>
                 <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
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
              <p className="text-xs text-slate-500">
                 حساب کاربری ندارید؟ <button onClick={() => switchMode('signup')} className="font-bold text-emerald-600 hover:underline">ثبت‌نام کنید</button>
              </p>
           ) : (
              <p className="text-xs text-slate-500">
                 قبلاً ثبت‌نام کرده‌اید؟ <button onClick={() => switchMode('login')} className="font-bold text-emerald-600 hover:underline">وارد شوید</button>
              </p>
           )}
        </div>

        <div className="mt-8 pt-6 border-t border-slate-200 text-center">
           <p className="text-[10px] text-slate-400 font-medium">
              © ۲۰۲۵ ویترین. تمامی حقوق محفوظ است.
           </p>
        </div>
      </motion.div>
    </div>
  );
};

export default AuthForm;
