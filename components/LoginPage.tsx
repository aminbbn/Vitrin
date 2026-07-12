
import React from 'react';
import { ArrowRight } from 'lucide-react';
import AuthForm from './AuthForm';
import VisualNarrative from './VisualNarrative';

interface LoginPageProps {
  onLogin: (restaurantName?: string) => void;
  brandColor: string;
  onBackToLanding?: () => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLogin, brandColor, onBackToLanding }) => {
  return (
    <div className="flex h-screen w-full bg-white overflow-hidden font-['Vazirmatn'] relative" style={{ direction: 'rtl' }}>
      {onBackToLanding && (
        <button 
          id="back-to-landing-btn"
          onClick={onBackToLanding}
          className="absolute top-6 right-6 z-50 bg-white hover:bg-slate-50 text-slate-700 hover:text-[#E11D48] px-4 py-2.5 rounded-xl shadow-lg font-bold text-xs flex items-center gap-2 border border-slate-100 transition-all active:scale-95 cursor-pointer"
        >
          <ArrowRight className="w-4 h-4 text-[#E11D48]" />
          <span>برگشت به صفحه اصلی</span>
        </button>
      )}
      <AuthForm onLogin={onLogin} brandColor={brandColor} />
      <VisualNarrative brandColor={brandColor} />
    </div>
  );
};

export default LoginPage;
