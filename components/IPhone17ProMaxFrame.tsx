import React from 'react';
import { useTheme } from './ThemeProvider';

interface IPhone17ProMaxFrameProps {
  children: React.ReactNode;
  variant?: 'compact' | 'standard' | 'showcase';
  className?: string;
}

export const IPhone17ProMaxFrame: React.FC<IPhone17ProMaxFrameProps> = ({
  children,
  variant = 'standard',
  className = '',
}) => {
  const { isDark } = useTheme();

  // Width mapping
  const widthClasses = {
    compact: 'w-[240px] max-w-full',
    standard: 'w-[295px] md:w-[clamp(270px,24vw,340px)] max-w-full',
    showcase: 'w-[360px] max-w-full',
  };

  return (
    <div className={`relative flex flex-col items-center justify-center ${className}`}>
      {/* Outer physical hardware container with double bezel feel */}
      <div
        className={`
          relative
          ${widthClasses[variant]}
          aspect-[1320/2868]
          rounded-[50px]
          p-[8px]
          transition-all
          duration-300
          ${
            isDark
              ? 'bg-gradient-to-b from-[#1c221e] to-[#0c100e] ring-1 ring-white/10 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.8)]'
              : 'bg-gradient-to-b from-[#d1d8d5] to-[#adb4b1] ring-1 ring-black/15 shadow-[0_25px_60px_-15px_rgba(17,31,24,0.12)]'
          }
        `}
      >
        {/* Physical side button highlights */}
        {/* Left Action & Vol buttons */}
        <div className="absolute left-[-2px] top-[18%] w-[2px] h-[32px] bg-neutral-600 rounded-l" />
        <div className="absolute left-[-2px] top-[26%] w-[2px] h-[50px] bg-neutral-600 rounded-l" />
        <div className="absolute left-[-2px] top-[34%] w-[2px] h-[50px] bg-neutral-600 rounded-l" />
        {/* Right Power button */}
        <div className="absolute right-[-2px] top-[24%] w-[2px] h-[75px] bg-neutral-600 rounded-r" />

        {/* Inner high-contrast deep black screen edge bezel */}
        <div className="w-full h-full rounded-[43px] overflow-hidden bg-[#000000] p-[5px] relative flex flex-col">
          
          {/* Inner content viewport with accurate corner-radius */}
          <div className="w-full h-full rounded-[38px] overflow-hidden relative bg-app-bg text-app-text flex flex-col z-10 select-none">
            
            {/* Dynamic Island Container */}
            <div className="absolute top-[10px] left-1/2 -translate-x-1/2 w-[85px] h-[24px] bg-[#000000] rounded-full z-50 flex items-center justify-between px-3 select-none">
              {/* Camera Lens Refraction */}
              <div className="w-2.5 h-2.5 rounded-full bg-[#0d1326] ring-1 ring-white/10" />
              <div className="w-1.5 h-1.5 rounded-full bg-[#05070a] opacity-60" />
            </div>

            {/* Custom IPhone Status Bar */}
            <div className="h-[38px] pt-[12px] px-6 flex justify-between items-center text-[10px] font-semibold select-none z-40 bg-transparent shrink-0">
              <span className="font-mono tracking-tight text-neutral-500 dark:text-neutral-400" style={{ direction: 'ltr' }}>09:41</span>
              <div className="flex items-center gap-1.5 text-neutral-500 dark:text-neutral-400">
                <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 3c-4.97 0-9 4.03-9 9 0 2.12.74 4.07 1.97 5.61L4.35 19.4c-.39.39-.39 1.02 0 1.41.39.39 1.02.39 1.41 0l1.79-1.79C9.09 19.66 10.5 20 12 20c4.97 0 9-4.03 9-9s-4.03-9-9-9zm0 15c-3.31 0-6-2.69-6-6s2.69-6 6-6 6 2.69 6 6-2.69 6-6 6z" />
                </svg>
                <div className="flex items-center gap-0.5" style={{ direction: 'ltr' }}>
                  <div className="w-1 h-1.5 bg-neutral-400 dark:bg-neutral-500 rounded-sm" />
                  <div className="w-1 h-2 bg-neutral-400 dark:bg-neutral-500 rounded-sm" />
                  <div className="w-1 h-2.5 bg-neutral-400 dark:bg-neutral-500 rounded-sm" />
                  <div className="w-1 h-3.5 bg-neutral-400 dark:bg-neutral-500 rounded-sm" />
                </div>
                {/* Battery */}
                <div className="w-5 h-2.5 border border-neutral-400 dark:border-neutral-500 rounded-[3px] p-[1px] flex items-center relative">
                  <div className="h-full w-[80%] bg-neutral-500 dark:bg-neutral-400 rounded-[1px]" />
                  <div className="absolute right-[-2px] top-1/2 -translate-y-1/2 w-[1px] h-1.5 bg-neutral-400 dark:bg-neutral-500 rounded-r-sm" />
                </div>
              </div>
            </div>

            {/* Screen Content */}
            <div className="flex-1 overflow-hidden relative flex flex-col">
              {children}
            </div>

            {/* iOS Home Indicator */}
            <div className="h-[14px] bg-transparent flex justify-center items-center shrink-0 z-40">
              <div className="w-[85px] h-[4px] bg-neutral-400 dark:bg-neutral-600 rounded-full" />
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};
