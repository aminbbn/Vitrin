
import React from 'react';
import { ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import AuthForm from './AuthForm';
import VisualNarrative from './VisualNarrative';
import { useTheme } from './ThemeProvider';

interface LoginPageProps {
  onLogin: (restaurantName?: string) => void;
  brandColor: string;
  onBackToLanding?: () => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLogin, brandColor, onBackToLanding }) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.05
      }
    }
  };

  const buttonVariants = {
    hidden: { opacity: 0, y: -10 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } }
  };

  const backgroundStyle = isDark
    ? 'radial-gradient(circle at 50% 50%, #052F2B 0%, #031F1D 50%, #020F0E 100%)'
    : 'radial-gradient(circle at 50% 50%, #f4fdfb 0%, #f8fafc 100%)';

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="flex min-h-dvh lg:h-screen w-full overflow-y-auto lg:overflow-hidden font-['Vazirmatn'] relative transition-all duration-300" 
      style={{ direction: 'rtl', background: backgroundStyle }}
    >
      {onBackToLanding && (
        <motion.button 
          variants={buttonVariants}
          id="back-to-landing-btn"
          onClick={onBackToLanding}
          className="absolute top-6 left-6 z-50 bg-white/90 dark:bg-[#0d221e]/95 hover:bg-slate-150 dark:hover:bg-[#122e29] backdrop-blur-md text-slate-800 dark:text-slate-200 px-4 py-2.5 rounded-xl shadow-md dark:shadow-xl font-bold text-xs flex items-center gap-2 border border-slate-200 dark:border-emerald-500/20 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/50 active:scale-95 cursor-pointer animate-none"
        >
          <ArrowRight className="w-4 h-4 text-emerald-600 dark:text-emerald-400 transition-colors" />
          <span>برگشت به صفحه اصلی</span>
        </motion.button>
      )}
      <AuthForm onLogin={onLogin} brandColor={brandColor} />
      <VisualNarrative brandColor={brandColor} />
    </motion.div>
  );
};

export default LoginPage;
