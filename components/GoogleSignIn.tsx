import React, { useEffect, useRef, useCallback } from 'react';
import { useRepositories } from '../data/RepositoryProvider';
import { useAppSession } from '../data/SessionProvider';

declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (config: {
            client_id: string;
            callback: (response: { credential: string }) => void;
            auto_select?: boolean;
            cancel_on_tap_outside?: boolean;
          }) => void;
          prompt: () => void;
          renderButton: (
            container: HTMLElement,
            config: {
              type: 'standard' | 'icon';
              theme?: 'outline' | 'filled_blue' | 'filled_black';
              size?: 'large' | 'medium' | 'small';
              shape?: 'rectangular' | 'pill' | 'circle' | 'square';
              text?: 'signin_with' | 'signup_with' | 'continue_with' | 'signin';
              logo_alignment?: 'left' | 'center';
              width?: number;
            },
          ) => void;
          disableAutoSelect: () => void;
        };
      };
    };
  }
}

const GOOGLE_CLIENT_ID = (import.meta as any).env?.VITE_GOOGLE_CLIENT_ID ?? '';

interface GoogleSignInButtonProps {
  onSuccess?: () => void;
  onError?: (error: string) => void;
  text?: string;
  disabled?: boolean;
}

/**
 * Google Identity Services button component.
 * When VITE_GOOGLE_CLIENT_ID is set, renders a real Google One-Tap / button.
 * When not set, renders a disabled placeholder.
 */
export const GoogleSignInButton: React.FC<GoogleSignInButtonProps> = ({
  onSuccess,
  onError,
  text = 'ورود با حساب گوگل',
  disabled = false,
}) => {
  const { authRepository } = useRepositories();
  const { refetchSession } = useAppSession();
  const buttonRef = useRef<HTMLDivElement>(null);
  const initializedRef = useRef(false);

  const handleCredentialResponse = useCallback(
    async (response: { credential: string }) => {
      try {
        await authRepository.loginWithGoogle(response.credential);
        await refetchSession();
        onSuccess?.();
      } catch (err: any) {
        onError?.(err?.message || 'خطا در اتصال به گوگل');
      }
    },
    [authRepository, refetchSession, onSuccess, onError],
  );

  useEffect(() => {
    if (!GOOGLE_CLIENT_ID || !buttonRef.current || initializedRef.current) return;

    const loadGoogleScript = (): Promise<void> => {
      return new Promise((resolve) => {
        if (window.google?.accounts?.id) {
          resolve();
          return;
        }
        const script = document.createElement('script');
        script.src = 'https://accounts.google.com/gsi/client';
        script.async = true;
        script.defer = true;
        script.onload = () => resolve();
        script.onerror = () => resolve(); // Still resolve to avoid hanging
        document.head.appendChild(script);
      });
    };

    loadGoogleScript().then(() => {
      if (!window.google?.accounts?.id || !buttonRef.current || initializedRef.current) return;
      initializedRef.current = true;

      window.google.accounts.id.initialize({
        client_id: GOOGLE_CLIENT_ID,
        callback: handleCredentialResponse,
        auto_select: false,
        cancel_on_tap_outside: true,
      });

      window.google.accounts.id.renderButton(buttonRef.current, {
        type: 'standard',
        theme: 'outline',
        size: 'large',
        shape: 'pill',
        text: 'continue_with',
        width: buttonRef.current.offsetWidth || 320,
      });
    });
  }, [handleCredentialResponse]);

  // When no Google Client ID is configured, show a placeholder
  if (!GOOGLE_CLIENT_ID) {
    return (
      <button
        type="button"
        disabled
        className="w-full flex items-center justify-center gap-3 py-3.5 px-4 rounded-2xl border border-slate-200 dark:border-white/5 bg-white dark:bg-[#0a1815] text-slate-400 dark:text-slate-600 text-xs font-bold transition-all cursor-not-allowed opacity-60"
      >
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none">
          <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
          <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
          <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05"/>
          <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335"/>
        </svg>
        <span>{text}</span>
      </button>
    );
  }

  return (
    <div className="w-full">
      <div
        ref={buttonRef}
        className="w-full flex items-center justify-center"
        style={{ minHeight: 44 }}
      />
    </div>
  );
};

export default GoogleSignInButton;
