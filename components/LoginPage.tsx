
import React from 'react';
import AuthForm from './AuthForm';
import VisualNarrative from './VisualNarrative';

interface LoginPageProps {
  onLogin: () => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
  return (
    <div className="flex h-screen w-full bg-white overflow-hidden font-['Vazirmatn']">
      <AuthForm onLogin={onLogin} />
      <VisualNarrative />
    </div>
  );
};

export default LoginPage;
