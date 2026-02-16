
import React from 'react';
import AuthForm from './AuthForm';
import VisualNarrative from './VisualNarrative';

interface LoginPageProps {
  onLogin: () => void;
  brandColor: string;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLogin, brandColor }) => {
  return (
    <div className="flex h-screen w-full bg-white overflow-hidden font-['Vazirmatn']">
      <AuthForm onLogin={onLogin} brandColor={brandColor} />
      <VisualNarrative brandColor={brandColor} />
    </div>
  );
};

export default LoginPage;
