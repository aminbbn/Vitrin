import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ConciergeBell, 
  Mail, 
  Lock, 
  ArrowLeft, 
  ArrowRight,
  Eye, 
  EyeOff, 
  Store, 
  Check, 
  User, 
  Sparkles, 
  Smartphone, 
  MapPin, 
  Phone,
  RefreshCw
} from 'lucide-react';
import { useRepositories } from '../data/RepositoryProvider';
import { useAppSession } from '../data/SessionProvider';
import { UserStatus } from '../domain';
import VisualNarrative from './VisualNarrative';
import { useTheme } from './ThemeProvider';
import { GoogleSignInButton } from './GoogleSignIn';

// Custom double-bezel input helper
const ModernInput = ({ label, type, value, onChange, placeholder, icon: Icon, showPasswordToggle, error, brandColor, dir = 'ltr' }: any) => {
  const [showPassword, setShowPassword] = useState(false);
  const inputType = showPassword ? 'text' : type;

  return (
    <div className="space-y-1.5 w-full text-right" style={{ direction: 'rtl' }}>
      <div className="flex justify-between items-end">
        <label className={`text-xs font-black block ${error ? 'text-rose-500' : 'text-slate-700 dark:text-slate-300'}`}>
          {label}
        </label>
        {error && (
          <motion.span 
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-[10px] font-bold text-rose-500"
          >
            {error}
          </motion.span>
        )}
      </div>
      <div className="relative group">
        <div className={`absolute left-3.5 top-1/2 -translate-y-1/2 transition-colors z-10 ${error ? 'text-rose-400' : 'text-slate-400 dark:text-slate-500 group-focus-within:text-emerald-500'}`}>
          <Icon className="w-4 h-4" />
        </div>
        <input 
          type={inputType}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className={`w-full bg-white dark:bg-[#0a1815] text-slate-950 dark:text-slate-50 text-xs font-medium border rounded-2xl py-3.5 pl-11 outline-none transition-all placeholder:text-slate-400/70 dark:placeholder:text-slate-500
            ${showPasswordToggle ? 'pr-11' : 'pr-4'}
            ${error 
              ? 'border-rose-200 dark:border-rose-500/30 focus:border-rose-500 focus:ring-4 focus:ring-rose-500/10' 
              : 'border-slate-200 dark:border-white/5 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 dark:focus:border-emerald-500 dark:focus:ring-emerald-500/15'
            }
          `}
          dir={dir}
          style={{ textAlign: dir === 'ltr' ? 'left' : 'right' }}
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

// Google Button representation - now uses real Google Identity Services
const MockGoogleButton = ({ onClick, isLoading }: any) => null; // Deprecated: replaced by GoogleSignInButton

interface AuthContainerProps {
  brandColor: string;
  onBackToLanding?: () => void;
  onSuccess?: () => void;
  initialIntent?: 'checkout' | 'normal';
  onProceedAsCustomer?: () => void;
}

export const AuthContainer: React.FC<AuthContainerProps> = ({ brandColor, onBackToLanding, onSuccess, initialIntent = 'normal', onProceedAsCustomer }) => {
  const { authRepository } = useRepositories();
  const { user, isAuthenticated, isEmailVerified, memberships, refetchSession } = useAppSession();
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  // Screen State
  const [activeScreen, setActiveScreen] = useState<'login' | 'register' | 'verify' | 'forgot' | 'reset' | 'choice' | 'onboarding'>('login');
  const [isLoading, setIsLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [globalError, setGlobalError] = useState('');

  // Form Fields
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [verificationCode, setVerificationCode] = useState('');
  const [resendTimer, setResendTimer] = useState(60);

  // Onboarding Fields
  const [onboardName, setOnboardName] = useState('');
  const [onboardColor, setOnboardColor] = useState('emerald');
  const [onboardAddress, setOnboardAddress] = useState('');
  const [onboardPhone, setOnboardPhone] = useState('');

  // Validation Errors
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Reset Timer Countdown for Resend Verification Code
  useEffect(() => {
    if (activeScreen === 'verify' && resendTimer > 0) {
      const interval = setInterval(() => setResendTimer(p => p - 1), 1000);
      return () => clearInterval(interval);
    }
  }, [activeScreen, resendTimer]);

  // Handle route matching or redirect based on session status
  useEffect(() => {
    if (isAuthenticated) {
      if (!isEmailVerified) {
        setActiveScreen('verify');
      } else if (memberships.length === 0) {
        if (activeScreen !== 'onboarding') {
          setActiveScreen('choice');
        }
      } else {
        if (onSuccess) onSuccess();
      }
    } else {
      // Clear screens back to login if they logged out
      if (activeScreen === 'verify' || activeScreen === 'choice' || activeScreen === 'onboarding') {
        setActiveScreen('login');
      }
    }
  }, [isAuthenticated, isEmailVerified, memberships, onSuccess]);

  const clearForm = () => {
    setEmail('');
    setPassword('');
    setFullName('');
    setPasswordConfirm('');
    setAcceptTerms(false);
    setVerificationCode('');
    setGlobalError('');
    setSuccessMsg('');
    setErrors({});
  };

  const switchScreen = (screen: any) => {
    setActiveScreen(screen);
    clearForm();
  };

  // ─── Actions ───

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setGlobalError('');
    const errs: Record<string, string> = {};
    if (!email) errs.email = 'ایمیل الزامی است';
    if (!password) errs.password = 'رمز عبور الزامی است';
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }

    setIsLoading(true);
    try {
      await authRepository.loginWithEmail(email, password);
      await refetchSession();
    } catch (err: any) {
      setGlobalError(err.message || 'خطا در برقراری ارتباط');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setGlobalError('');
    const errs: Record<string, string> = {};

    if (!fullName) errs.fullName = 'نام کامل الزامی است';
    if (!email) errs.email = 'ایمیل الزامی است';
    else if (!/\S+@\S+\.\S+/.test(email)) errs.email = 'فرمت ایمیل نامعتبر است';
    if (!password) errs.password = 'رمز عبور الزامی است';
    else if (password.length < 6) errs.password = 'حداقل ۶ کاراکتر باشد';
    if (password !== passwordConfirm) errs.passwordConfirm = 'تکرار رمز عبور مطابقت ندارد';
    if (!acceptTerms) errs.acceptTerms = 'باید قوانین و مقررات را بپذیرید';

    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }

    setIsLoading(true);
    try {
      const parts = fullName.trim().split(/\s+/);
      const first = parts[0] || 'کاربر';
      const last = parts.slice(1).join(' ') || 'جدید';
      
      await authRepository.register(email, password, first, last);
      await refetchSession();
      setResendTimer(60);
      setActiveScreen('verify');
    } catch (err: any) {
      setGlobalError(err.message || 'خطا در ثبت نام');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setGlobalError('');
    if (!verificationCode) {
      setErrors({ code: 'کد تایید الزامی است' });
      return;
    }

    setIsLoading(true);
    try {
      if (user) {
        await authRepository.verifyEmail(user.id, verificationCode);
        await refetchSession();
      }
    } catch (err: any) {
      setGlobalError(err.message || 'کد تایید نامعتبر است');
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgot = async (e: React.FormEvent) => {
    e.preventDefault();
    setGlobalError('');
    if (!email) {
      setErrors({ email: 'ایمیل الزامی است' });
      return;
    }

    setIsLoading(true);
    try {
      await authRepository.forgotPassword(email);
      setSuccessMsg('کد بازیابی رمز عبور به ایمیل شما ارسال شد.');
      setTimeout(() => {
        setActiveScreen('reset');
        setSuccessMsg('');
      }, 2000);
    } catch (err: any) {
      setGlobalError(err.message || 'ایمیل یافت نشد');
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setGlobalError('');
    const errs: Record<string, string> = {};
    if (!email) errs.email = 'ایمیل الزامی است';
    if (!verificationCode) errs.code = 'کد بازیابی الزامی است';
    if (!password) errs.password = 'رمز عبور جدید الزامی است';
    else if (password.length < 6) errs.password = 'حداقل ۶ کاراکتر باشد';

    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }

    setIsLoading(true);
    try {
      await authRepository.resetPassword(email, verificationCode, password);
      setSuccessMsg('رمز عبور با موفقیت تغییر کرد. در حال انتقال به صفحه ورود...');
      setTimeout(() => {
        switchScreen('login');
      }, 2000);
    } catch (err: any) {
      setGlobalError(err.message || 'عملیات ناموفق بود');
    } finally {
      setIsLoading(false);
    }
  };

  const handleOnboarding = async (e: React.FormEvent) => {
    e.preventDefault();
    setGlobalError('');
    const errs: Record<string, string> = {};
    if (!onboardName) errs.onboardName = 'نام فروشگاه الزامی است';
    if (!onboardAddress) errs.onboardAddress = 'آدرس الزامی است';
    if (!onboardPhone) errs.onboardPhone = 'شماره تماس الزامی است';

    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }

    setIsLoading(true);
    try {
      if (user) {
        await authRepository.onboardOwner(user.id, onboardName, onboardColor, onboardAddress, onboardPhone);
        await refetchSession();
        if (onSuccess) onSuccess();
      }
    } catch (err: any) {
      setGlobalError(err.message || 'خطا در ثبت فروشگاه');
    } finally {
      setIsLoading(false);
    }
  };

  // Style helper for dynamic theme backgrounds
  const backgroundStyle = isDark
    ? 'radial-gradient(circle at 50% 50%, #052F2B 0%, #031F1D 50%, #020F0E 100%)'
    : 'radial-gradient(circle at 50% 50%, #f4fdfb 0%, #f8fafc 100%)';

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.15 } }
  };

  const formPanelVariants = {
    hidden: { opacity: 0, x: 30 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.65, ease: [0.16, 1, 0.3, 1] } }
  };

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="flex min-h-dvh lg:h-screen w-full overflow-y-auto lg:overflow-hidden font-['Vazirmatn'] relative transition-all duration-300 bg-transparent" 
      style={{ direction: 'rtl', background: backgroundStyle }}
    >
      {onBackToLanding && (
        <motion.button 
          id="back-to-landing-btn"
          onClick={onBackToLanding}
          className="absolute top-6 left-6 z-50 bg-white/95 dark:bg-[#0b1815]/95 hover:bg-slate-100 dark:hover:bg-[#122e29] backdrop-blur-md text-slate-800 dark:text-slate-200 px-4 py-2.5 rounded-full shadow-md dark:shadow-xl font-bold text-xs flex items-center gap-2 border border-slate-200 dark:border-emerald-500/20 transition-all active:scale-95 cursor-pointer"
        >
          <ArrowRight className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          <span>برگشت به صفحه اصلی</span>
        </motion.button>
      )}

      {/* Form Area */}
      <motion.div 
        variants={formPanelVariants}
        className="w-full lg:w-1/2 flex flex-col justify-center items-center p-6 lg:p-12 relative min-h-dvh lg:min-h-0"
      >
        <div className="w-full max-w-[420px] bg-white/50 dark:bg-black/20 backdrop-blur-md p-8 rounded-[2.5rem] border border-white/20 dark:border-white/5 shadow-2xl">
          <AnimatePresence mode="wait">
            
            {/* SCREEN 1: LOGIN */}
            {activeScreen === 'login' && (
              <motion.div
                key="login"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.35 }}
                className="space-y-6"
              >
                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-14 h-14 bg-emerald-600 dark:bg-emerald-500 rounded-2xl shadow-lg mb-4">
                    <ConciergeBell className="w-7 h-7 text-white dark:text-slate-950" />
                  </div>
                  <h2 className="text-xl font-black text-slate-900 dark:text-white">ورود به پنل مدیریت</h2>
                  <p className="text-slate-500 dark:text-slate-400 text-xs mt-1.5 font-medium">لطفاً اطلاعات حساب کاربری خود را وارد کنید</p>
                </div>

                {globalError && (
                  <div className="p-3 bg-rose-50 dark:bg-rose-950/20 text-rose-600 dark:text-rose-400 text-xs font-bold rounded-xl text-center border border-rose-100 dark:border-rose-950/30">
                    {globalError}
                  </div>
                )}

                <form onSubmit={handleLogin} className="space-y-4">
                  <ModernInput 
                    label="نشانی ایمیل"
                    type="email"
                    icon={Mail}
                    placeholder="name@company.com"
                    value={email}
                    onChange={(e: any) => {
                      setEmail(e.target.value);
                      if (errors.email) setErrors({ ...errors, email: '' });
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
                      if (errors.password) setErrors({ ...errors, password: '' });
                    }}
                    showPasswordToggle
                    error={errors.password}
                    brandColor={brandColor}
                  />

                  <div className="flex items-center justify-between mt-2 flex-row-reverse">
                    <button 
                      type="button"
                      onClick={() => switchScreen('forgot')}
                      className="text-xs font-bold text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 hover:underline bg-transparent border-0 cursor-pointer"
                    >
                      رمز عبور را فراموش کرده‌اید؟
                    </button>
                    <div className="flex items-center gap-2">
                      <input type="checkbox" id="rememberMe" className="rounded border-slate-300 dark:border-slate-800 text-emerald-500 focus:ring-emerald-500" />
                      <label htmlFor="rememberMe" className="text-xs text-slate-500 dark:text-slate-400 font-bold cursor-pointer select-none">مرا به خاطر بسپار</label>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-4 bg-slate-900 hover:bg-slate-800 text-white dark:bg-emerald-500 dark:text-slate-950 dark:hover:bg-emerald-400 rounded-2xl font-black text-xs transition-all active:scale-[0.98] cursor-pointer shadow-lg flex items-center justify-center gap-2"
                  >
                    {isLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <span>ورود به ویترین</span>}
                  </button>
                </form>

                <div className="relative flex py-2 items-center">
                  <div className="flex-grow border-t border-slate-200 dark:border-white/5"></div>
                  <span className="flex-shrink mx-4 text-slate-400 dark:text-slate-600 text-[10px] font-bold">یا</span>
                  <div className="flex-grow border-t border-slate-200 dark:border-white/5"></div>
                </div>

                <GoogleSignInButton
                  onSuccess={refetchSession}
                  onError={(err) => setGlobalError(err)}
                />

                <div className="text-center pt-2">
                  <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                    هنوز حساب کاربری ایجاد نکرده‌اید؟{' '}
                    <button 
                      onClick={() => switchScreen('register')}
                      className="font-black text-emerald-600 dark:text-emerald-400 hover:underline bg-transparent border-0 cursor-pointer"
                    >
                      ثبت نام رایگان
                    </button>
                  </p>
                </div>
              </motion.div>
            )}

            {/* SCREEN 2: REGISTER */}
            {activeScreen === 'register' && (
              <motion.div
                key="register"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.35 }}
                className="space-y-5"
              >
                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-14 h-14 bg-emerald-600 dark:bg-emerald-500 rounded-2xl shadow-lg mb-4">
                    <User className="w-7 h-7 text-white dark:text-slate-950" />
                  </div>
                  <h2 className="text-xl font-black text-slate-900 dark:text-white">ایجاد حساب کاربری</h2>
                  <p className="text-slate-500 dark:text-slate-400 text-xs mt-1.5 font-medium">کسب و کار هوشمند خود را از امروز راه اندازی کنید</p>
                </div>

                {globalError && (
                  <div className="p-3 bg-rose-50 dark:bg-rose-950/20 text-rose-600 dark:text-rose-400 text-xs font-bold rounded-xl text-center border border-rose-100 dark:border-rose-950/30">
                    {globalError}
                  </div>
                )}

                <form onSubmit={handleRegister} className="space-y-4">
                  <ModernInput 
                    label="نام و نام خانوادگی"
                    type="text"
                    icon={User}
                    placeholder="مثال: امیر صاحبی"
                    value={fullName}
                    onChange={(e: any) => {
                      setFullName(e.target.value);
                      if (errors.fullName) setErrors({ ...errors, fullName: '' });
                    }}
                    error={errors.fullName}
                    brandColor={brandColor}
                    dir="rtl"
                  />

                  <ModernInput 
                    label="آدرس ایمیل"
                    type="email"
                    icon={Mail}
                    placeholder="name@company.com"
                    value={email}
                    onChange={(e: any) => {
                      setEmail(e.target.value);
                      if (errors.email) setErrors({ ...errors, email: '' });
                    }}
                    error={errors.email}
                    brandColor={brandColor}
                  />

                  <ModernInput 
                    label="رمز عبور"
                    type="password"
                    icon={Lock}
                    placeholder="حداقل ۶ کاراکتر"
                    value={password}
                    onChange={(e: any) => {
                      setPassword(e.target.value);
                      if (errors.password) setErrors({ ...errors, password: '' });
                    }}
                    showPasswordToggle
                    error={errors.password}
                    brandColor={brandColor}
                  />

                  <ModernInput 
                    label="تکرار رمز عبور"
                    type="password"
                    icon={Lock}
                    placeholder="تکرار مجدد رمز عبور"
                    value={passwordConfirm}
                    onChange={(e: any) => {
                      setPasswordConfirm(e.target.value);
                      if (errors.passwordConfirm) setErrors({ ...errors, passwordConfirm: '' });
                    }}
                    showPasswordToggle
                    error={errors.passwordConfirm}
                    brandColor={brandColor}
                  />

                  <div className="flex items-start gap-2.5 pt-1 flex-row-reverse text-right">
                    <input 
                      type="checkbox" 
                      id="acceptTerms" 
                      checked={acceptTerms}
                      onChange={(e) => {
                        setAcceptTerms(e.target.checked);
                        if (errors.acceptTerms) setErrors({ ...errors, acceptTerms: '' });
                      }}
                      className="mt-1 rounded border-slate-300 dark:border-slate-800 text-emerald-500 focus:ring-emerald-500 cursor-pointer" 
                    />
                    <label htmlFor="acceptTerms" className={`text-[11px] leading-relaxed font-bold cursor-pointer select-none ${errors.acceptTerms ? 'text-rose-500' : 'text-slate-500 dark:text-slate-400'}`}>
                      تمامی شرایط، قوانین و ضوابط عضویت در سامانه مدیریت رستوران ویترین را می‌پذیرم.
                    </label>
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-4 bg-slate-900 hover:bg-slate-800 text-white dark:bg-emerald-500 dark:text-slate-950 dark:hover:bg-emerald-400 rounded-2xl font-black text-xs transition-all active:scale-[0.98] cursor-pointer shadow-lg flex items-center justify-center gap-2"
                  >
                    {isLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <span>ثبت نام و ادامه</span>}
                  </button>
                </form>

                <div className="relative flex py-2 items-center">
                  <div className="flex-grow border-t border-slate-200 dark:border-white/5"></div>
                  <span className="flex-shrink mx-4 text-slate-400 dark:text-slate-600 text-[10px] font-bold">یا</span>
                  <div className="flex-grow border-t border-slate-200 dark:border-white/5"></div>
                </div>

                <GoogleSignInButton
                  onSuccess={refetchSession}
                  onError={(err) => setGlobalError(err)}
                />

                <div className="text-center pt-2">
                  <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                    قبلاً ثبت نام کرده‌اید؟{' '}
                    <button 
                      onClick={() => switchScreen('login')}
                      className="font-black text-emerald-600 dark:text-emerald-400 hover:underline bg-transparent border-0 cursor-pointer"
                    >
                      وارد شوید
                    </button>
                  </p>
                </div>
              </motion.div>
            )}

            {/* SCREEN 3: VERIFY EMAIL */}
            {activeScreen === 'verify' && (
              <motion.div
                key="verify"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.35 }}
                className="space-y-6"
              >
                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-14 h-14 bg-amber-500/10 text-amber-500 rounded-2xl shadow-lg mb-4">
                    <Mail className="w-7 h-7" />
                  </div>
                  <h2 className="text-xl font-black text-slate-900 dark:text-white">تأیید نشانی ایمیل</h2>
                  <p className="text-slate-500 dark:text-slate-400 text-xs mt-1.5 font-medium">کد تایید ۶ رقمی به نشانی ایمیل شما ارسال گردید</p>
                  {user?.email && (
                    <span className="inline-block mt-2 px-3 py-1 bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-300 rounded-lg text-xs font-bold font-mono">
                      {user.email}
                    </span>
                  )}
                </div>

                {globalError && (
                  <div className="p-3 bg-rose-50 dark:bg-rose-950/20 text-rose-600 dark:text-rose-400 text-xs font-bold rounded-xl text-center border border-rose-100 dark:border-rose-950/30">
                    {globalError}
                  </div>
                )}

                <form onSubmit={handleVerify} className="space-y-5">
                  <div className="space-y-2 text-right">
                    <label className="text-xs font-black text-slate-700 dark:text-slate-300 block">کد تأیید ۶ رقمی</label>
                    <input 
                      type="text"
                      maxLength={6}
                      placeholder="کد نمونه: 123456"
                      value={verificationCode}
                      onChange={(e) => {
                        setVerificationCode(e.target.value);
                        if (errors.code) setErrors({});
                      }}
                      className="w-full bg-white dark:bg-[#0a1815] text-slate-950 dark:text-slate-50 text-base font-black tracking-[0.4em] text-center border border-slate-200 dark:border-white/5 rounded-2xl py-4 outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10"
                    />
                    {errors.code && <p className="text-[10px] font-bold text-rose-500">{errors.code}</p>}
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-4 bg-slate-900 hover:bg-slate-800 text-white dark:bg-emerald-500 dark:text-slate-950 dark:hover:bg-emerald-400 rounded-2xl font-black text-xs transition-all active:scale-[0.98] cursor-pointer shadow-lg flex items-center justify-center gap-2"
                  >
                    {isLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <span>تأیید ایمیل و ورود</span>}
                  </button>
                </form>

                <div className="text-center">
                  {resendTimer > 0 ? (
                    <p className="text-xs text-slate-400 dark:text-slate-500 font-bold">
                      ارسال مجدد کد تایید تا {resendTimer} ثانیه دیگر
                    </p>
                  ) : (
                    <button
                      onClick={() => setResendTimer(60)}
                      className="text-xs font-black text-emerald-600 dark:text-emerald-400 hover:underline bg-transparent border-0 cursor-pointer"
                    >
                      ارسال مجدد کد تایید
                    </button>
                  )}
                </div>

                <div className="text-center border-t border-slate-200 dark:border-white/5 pt-4">
                  <button 
                    onClick={async () => {
                      await authRepository.logout();
                      await refetchSession();
                      switchScreen('login');
                    }}
                    className="text-xs font-black text-slate-500 dark:text-slate-400 hover:text-slate-700 bg-transparent border-0 cursor-pointer flex items-center justify-center gap-1.5 w-full"
                  >
                    <ArrowRight className="w-4 h-4" />
                    <span>خروج و بازگشت به ورود</span>
                  </button>
                </div>
              </motion.div>
            )}

            {/* SCREEN 4: FORGOT PASSWORD */}
            {activeScreen === 'forgot' && (
              <motion.div
                key="forgot"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.35 }}
                className="space-y-6"
              >
                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-14 h-14 bg-amber-500/10 text-amber-500 rounded-2xl shadow-lg mb-4">
                    <Lock className="w-7 h-7" />
                  </div>
                  <h2 className="text-xl font-black text-slate-900 dark:text-white">فراموشی رمز عبور</h2>
                  <p className="text-slate-500 dark:text-slate-400 text-xs mt-1.5 font-medium">نشانی ایمیل خود را برای دریافت کد بازیابی وارد کنید</p>
                </div>

                {globalError && (
                  <div className="p-3 bg-rose-50 dark:bg-rose-950/20 text-rose-600 dark:text-rose-400 text-xs font-bold rounded-xl text-center border border-rose-100 dark:border-rose-950/30">
                    {globalError}
                  </div>
                )}

                {successMsg && (
                  <div className="p-3 bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400 text-xs font-bold rounded-xl text-center border border-emerald-100 dark:border-emerald-950/30">
                    {successMsg}
                  </div>
                )}

                <form onSubmit={handleForgot} className="space-y-4">
                  <ModernInput 
                    label="نشانی ایمیل"
                    type="email"
                    icon={Mail}
                    placeholder="name@company.com"
                    value={email}
                    onChange={(e: any) => {
                      setEmail(e.target.value);
                      if (errors.email) setErrors({});
                    }}
                    error={errors.email}
                    brandColor={brandColor}
                  />

                  <button
                    type="submit"
                    disabled={isLoading || !!successMsg}
                    className="w-full py-4 bg-slate-900 hover:bg-slate-800 text-white dark:bg-emerald-500 dark:text-slate-950 dark:hover:bg-emerald-400 rounded-2xl font-black text-xs transition-all active:scale-[0.98] cursor-pointer shadow-lg flex items-center justify-center gap-2"
                  >
                    {isLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <span>ارسال لینک بازیابی</span>}
                  </button>
                </form>

                <div className="text-center border-t border-slate-200 dark:border-white/5 pt-4">
                  <button 
                    onClick={() => switchScreen('login')}
                    className="text-xs font-black text-emerald-600 dark:text-emerald-400 hover:underline bg-transparent border-0 cursor-pointer flex items-center justify-center gap-1.5 w-full"
                  >
                    <ArrowRight className="w-4 h-4" />
                    <span>بازگشت به صفحه ورود</span>
                  </button>
                </div>
              </motion.div>
            )}

            {/* SCREEN 5: RESET PASSWORD */}
            {activeScreen === 'reset' && (
              <motion.div
                key="reset"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.35 }}
                className="space-y-5"
              >
                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-14 h-14 bg-emerald-600 dark:bg-emerald-500 rounded-2xl shadow-lg mb-4">
                    <Lock className="w-7 h-7 text-white dark:text-slate-950" />
                  </div>
                  <h2 className="text-xl font-black text-slate-900 dark:text-white">تعیین رمز عبور جدید</h2>
                  <p className="text-slate-500 dark:text-slate-400 text-xs mt-1.5 font-medium">کد بازیابی ایمیل شده و رمز جدید خود را وارد کنید</p>
                </div>

                {globalError && (
                  <div className="p-3 bg-rose-50 dark:bg-rose-950/20 text-rose-600 dark:text-rose-400 text-xs font-bold rounded-xl text-center border border-rose-100 dark:border-rose-950/30">
                    {globalError}
                  </div>
                )}

                {successMsg && (
                  <div className="p-3 bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400 text-xs font-bold rounded-xl text-center border border-emerald-100 dark:border-emerald-950/30">
                    {successMsg}
                  </div>
                )}

                <form onSubmit={handleReset} className="space-y-4">
                  <ModernInput 
                    label="آدرس ایمیل تایید شده"
                    type="email"
                    icon={Mail}
                    placeholder="name@company.com"
                    value={email}
                    onChange={(e: any) => {
                      setEmail(e.target.value);
                      if (errors.email) setErrors({ ...errors, email: '' });
                    }}
                    error={errors.email}
                    brandColor={brandColor}
                  />

                  <ModernInput 
                    label="کد بازیابی ۶ رقمی"
                    type="text"
                    icon={Sparkles}
                    placeholder="کد نمونه: 123456"
                    value={verificationCode}
                    onChange={(e: any) => {
                      setVerificationCode(e.target.value);
                      if (errors.code) setErrors({ ...errors, code: '' });
                    }}
                    error={errors.code}
                    brandColor={brandColor}
                  />

                  <ModernInput 
                    label="رمز عبور جدید"
                    type="password"
                    icon={Lock}
                    placeholder="حداقل ۶ کاراکتر"
                    value={password}
                    onChange={(e: any) => {
                      setPassword(e.target.value);
                      if (errors.password) setErrors({ ...errors, password: '' });
                    }}
                    showPasswordToggle
                    error={errors.password}
                    brandColor={brandColor}
                  />

                  <button
                    type="submit"
                    disabled={isLoading || !!successMsg}
                    className="w-full py-4 bg-slate-900 hover:bg-slate-800 text-white dark:bg-emerald-500 dark:text-slate-950 dark:hover:bg-emerald-400 rounded-2xl font-black text-xs transition-all active:scale-[0.98] cursor-pointer shadow-lg flex items-center justify-center gap-2"
                  >
                    {isLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <span>ذخیره رمز عبور جدید</span>}
                  </button>
                </form>

                <div className="text-center border-t border-slate-200 dark:border-white/5 pt-4">
                  <button 
                    onClick={() => switchScreen('login')}
                    className="text-xs font-black text-emerald-600 dark:text-emerald-400 hover:underline bg-transparent border-0 cursor-pointer flex items-center justify-center gap-1.5 w-full"
                  >
                    <ArrowRight className="w-4 h-4" />
                    <span>بازگشت به صفحه ورود</span>
                  </button>
                </div>
              </motion.div>
            )}

            {/* SCREEN 6: OWNER ONBOARDING */}
            {activeScreen === 'onboarding' && (
              <motion.div
                key="onboarding"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.35 }}
                className="space-y-6"
              >
                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-14 h-14 bg-emerald-600 dark:bg-emerald-500 rounded-2xl shadow-lg mb-4">
                    <Store className="w-7 h-7 text-white dark:text-slate-950" />
                  </div>
                  <h2 className="text-xl font-black text-slate-900 dark:text-white">راه‌اندازی فروشگاه جدید</h2>
                  <p className="text-slate-500 dark:text-slate-400 text-xs mt-1.5 font-medium">مشخصات اولیه رستوران خود را جهت ایجاد پنل وارد کنید</p>
                </div>

                {globalError && (
                  <div className="p-3 bg-rose-50 dark:bg-rose-950/20 text-rose-600 dark:text-rose-400 text-xs font-bold rounded-xl text-center border border-rose-100 dark:border-rose-950/30">
                    {globalError}
                  </div>
                )}

                <form onSubmit={handleOnboarding} className="space-y-4">
                  <ModernInput 
                    label="نام رستوران / فروشگاه"
                    type="text"
                    icon={Store}
                    placeholder="مثال: رستوران سنتی لیمو"
                    value={onboardName}
                    onChange={(e: any) => {
                      setOnboardName(e.target.value);
                      if (errors.onboardName) setErrors({ ...errors, onboardName: '' });
                    }}
                    error={errors.onboardName}
                    brandColor={brandColor}
                    dir="rtl"
                  />

                  {/* Brand Color Selector */}
                  <div className="space-y-2 text-right">
                    <label className="text-xs font-black text-slate-700 dark:text-slate-300">انتخاب رنگ سازمانی</label>
                    <div className="flex gap-2 justify-start flex-wrap pt-1">
                      {[
                        { name: 'emerald', label: 'زمردی', bg: 'bg-emerald-500' },
                        { name: 'blue', label: 'آبی', bg: 'bg-blue-500' },
                        { name: 'orange', label: 'نارنجی', bg: 'bg-orange-500' },
                        { name: 'rose', label: 'سرخ', bg: 'bg-rose-500' },
                        { name: 'purple', label: 'بنفش', bg: 'bg-purple-500' }
                      ].map((col) => (
                        <button
                          key={col.name}
                          type="button"
                          onClick={() => setOnboardColor(col.name)}
                          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-black transition-all border cursor-pointer ${onboardColor === col.name ? 'border-slate-800 dark:border-white ring-2 ring-emerald-500/15' : 'border-slate-200 dark:border-white/5 bg-transparent'}`}
                        >
                          <span className={`w-2.5 h-2.5 rounded-full ${col.bg}`} />
                          <span className="text-slate-700 dark:text-slate-300">{col.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <ModernInput 
                    label="نشانی دقیق فروشگاه"
                    type="text"
                    icon={MapPin}
                    placeholder="تهران، سعادت آباد، میدان کاج"
                    value={onboardAddress}
                    onChange={(e: any) => {
                      setOnboardAddress(e.target.value);
                      if (errors.onboardAddress) setErrors({ ...errors, onboardAddress: '' });
                    }}
                    error={errors.onboardAddress}
                    brandColor={brandColor}
                    dir="rtl"
                  />

                  <ModernInput 
                    label="شماره تماس رستوران"
                    type="tel"
                    icon={Phone}
                    placeholder="02122345678"
                    value={onboardPhone}
                    onChange={(e: any) => {
                      setOnboardPhone(e.target.value);
                      if (errors.onboardPhone) setErrors({ ...errors, onboardPhone: '' });
                    }}
                    error={errors.onboardPhone}
                    brandColor={brandColor}
                  />

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-4 bg-slate-900 hover:bg-slate-800 text-white dark:bg-emerald-500 dark:text-slate-950 dark:hover:bg-emerald-400 rounded-2xl font-black text-xs transition-all active:scale-[0.98] cursor-pointer shadow-lg flex items-center justify-center gap-2"
                  >
                    {isLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <span>تکمیل و راه‌اندازی منو</span>}
                  </button>
                </form>

                <div className="relative flex py-2 items-center">
                  <div className="flex-grow border-t border-slate-200 dark:border-white/5"></div>
                  <span className="flex-shrink mx-4 text-slate-400 dark:text-slate-600 text-[10px] font-bold">یا</span>
                  <div className="flex-grow border-t border-slate-200 dark:border-white/5"></div>
                </div>

                <div className="text-center pt-1">
                  <button 
                    onClick={() => setActiveScreen('choice')}
                    className="font-black text-xs text-slate-500 dark:text-emerald-400 hover:underline bg-transparent border-0 cursor-pointer flex items-center justify-center gap-1.5 w-full"
                  >
                    <ArrowRight className="w-4 h-4" />
                    <span>برگشت به صفحه انتخاب نوع کاربری</span>
                  </button>
                </div>
              </motion.div>
            )}

            {/* SCREEN 7: CHOICE SCREEN */}
            {activeScreen === 'choice' && (
              <motion.div
                key="choice"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.35 }}
                className="space-y-6 text-right"
              >
                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-14 h-14 bg-emerald-600/10 dark:bg-emerald-500/10 rounded-2xl text-emerald-600 dark:text-emerald-400 mb-4 animate-pulse">
                    <Sparkles className="w-7 h-7" />
                  </div>
                  <h2 className="text-xl font-black text-slate-900 dark:text-white">انتخاب نوع کاربری</h2>
                  <p className="text-slate-500 dark:text-slate-400 text-xs mt-1.5 font-medium leading-relaxed">ایمیل شما تایید شد. مایلید چگونه در ویترین ادامه دهید؟</p>
                </div>

                <div className="space-y-4">
                  {/* Option 1: Owner Onboarding */}
                  <button
                    type="button"
                    onClick={() => setActiveScreen('onboarding')}
                    className="w-full text-right p-5 rounded-[1.75rem] border border-slate-200 dark:border-white/5 bg-white dark:bg-[#0a1815] hover:border-emerald-500/50 dark:hover:border-emerald-500/50 hover:bg-slate-50 dark:hover:bg-slate-900/40 shadow-xs transition-all group flex gap-4 select-none cursor-pointer"
                  >
                    <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950/20 text-[#10b981] dark:text-emerald-400 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                      <Store className="w-6 h-6" />
                    </div>
                    <div className="space-y-1">
                      <h4 className="text-xs font-black text-slate-800 dark:text-slate-100 flex items-center gap-1.5">
                        <span>راه‌اندازی رستوران و فروشگاه جدید</span>
                        <ArrowLeft className="w-3.5 h-3.5 text-slate-400 group-hover:translate-x-1 transition-transform" />
                      </h4>
                      <p className="text-[10px] text-slate-500 dark:text-slate-400 leading-relaxed font-bold">می‌خواهم منوی دیجیتال بسازم، سفارش دریافت کنم و کسب‌وکارم را مدیریت کنم.</p>
                    </div>
                  </button>

                  {/* Option 2: Browse as Customer */}
                  <button
                    type="button"
                    onClick={() => {
                      if (onProceedAsCustomer) {
                        onProceedAsCustomer();
                      } else if (onSuccess) {
                        onSuccess();
                      }
                    }}
                    className="w-full text-right p-5 rounded-[1.75rem] border border-slate-200 dark:border-white/5 bg-white dark:bg-[#0a1815] hover:border-emerald-500/50 dark:hover:border-emerald-500/50 hover:bg-slate-50 dark:hover:bg-slate-900/40 shadow-xs transition-all group flex gap-4 select-none cursor-pointer"
                  >
                    <div className="w-12 h-12 rounded-2xl bg-slate-50 dark:bg-slate-950/20 text-slate-500 dark:text-slate-400 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                      <User className="w-6 h-6" />
                    </div>
                    <div className="space-y-1">
                      <h4 className="text-xs font-black text-slate-800 dark:text-slate-100 flex items-center gap-1.5">
                        <span>ورود مستقیم به عنوان مشتری / کاربر مهمان</span>
                        <ArrowLeft className="w-3.5 h-3.5 text-slate-400 group-hover:translate-x-1 transition-transform" />
                      </h4>
                      <p className="text-[10px] text-slate-500 dark:text-slate-400 leading-relaxed font-bold">می‌خواهم منوی دیجیتال لایو رستوران را بررسی کرده و سفارش ثبت کنم.</p>
                    </div>
                  </button>
                </div>

                <div className="text-center border-t border-slate-200 dark:border-white/5 pt-4">
                  <button 
                    onClick={async () => {
                      await authRepository.logout();
                      await refetchSession();
                      switchScreen('login');
                    }}
                    className="text-xs font-black text-slate-500 dark:text-slate-400 hover:text-slate-700 bg-transparent border-0 cursor-pointer flex items-center justify-center gap-1.5 w-full"
                  >
                    <ArrowRight className="w-4 h-4" />
                    <span>خروج و بازگشت به صفحه ورود</span>
                  </button>
                </div>
              </motion.div>
            )}

          </AnimatePresence>
        </div>
      </motion.div>

      {/* Narrative Panel (Visual Orbit) */}
      <VisualNarrative brandColor={onboardColor} />
    </motion.div>
  );
};
