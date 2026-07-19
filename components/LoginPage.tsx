import React from 'react';
import { AuthContainer } from './AuthContainer';
import { useAppSession } from '../data/SessionProvider';

interface LoginPageProps {
  onLogin?: (restaurantName?: string) => void;
  brandColor: string;
  onBackToLanding?: () => void;
  onProceedAsCustomer?: () => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ brandColor, onBackToLanding, onProceedAsCustomer }) => {
  const { refetchSession } = useAppSession();

  return (
    <AuthContainer 
      brandColor={brandColor} 
      onBackToLanding={onBackToLanding}
      onSuccess={refetchSession}
      onProceedAsCustomer={onProceedAsCustomer}
    />
  );
};

export default LoginPage;
