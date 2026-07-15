import React from 'react';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';

export interface JourneyStep {
  id: string;
  number: string;
  title: string;
  description: string;
  shortLabel: string;
  sceneType: string;
  benefits: string[];
  note: string;
}

interface JourneyProgressProps {
  steps: JourneyStep[];
  activeIndex: number;
  onStepSelect: (index: number) => void;
}

export const JourneyProgress: React.FC<JourneyProgressProps> = ({
  steps,
  activeIndex,
  onStepSelect,
}) => {
  return (
    <div 
      dir="rtl" 
      className="journey-progress w-full grid items-center select-none"
      style={{
        // 5 steps and 4 connectors
        gridTemplateColumns: 'auto 1fr auto 1fr auto 1fr auto 1fr auto',
      }}
    >
      {steps.map((step, index) => {
        const isActive = index === activeIndex;
        const isCompleted = index < activeIndex;

        return (
          <React.Fragment key={step.id}>
            {/* Step Circle Node */}
            <button
              onClick={() => onStepSelect(index)}
              className="flex flex-col items-center group relative cursor-pointer focus:outline-none border-0 bg-transparent py-2"
            >
              {/* Circle element with precise dimensions and centerY alignment */}
              <motion.div
                animate={{
                  scale: isActive ? 1.15 : 1,
                  borderColor: isActive 
                    ? '#10b981' 
                    : isCompleted 
                    ? '#10b981' 
                    : 'rgba(203, 213, 225, 0.6)',
                }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                className={`w-11 h-11 rounded-full border-2 flex items-center justify-center shadow-md relative z-10 transition-colors duration-300 ${
                  isActive
                    ? 'bg-[#10b981] dark:bg-[#19C78C] text-white border-[#10b981] dark:border-[#19C78C]'
                    : isCompleted
                    ? 'bg-[#e6fbf4] dark:bg-[#19C78C]/10 text-emerald-600 dark:text-[#19C78C] border-[#10b981] dark:border-[#19C78C]'
                    : 'bg-white dark:bg-[#161B18] border-slate-300 dark:border-white/10 text-slate-500 dark:text-slate-400'
                }`}
              >
                {isCompleted ? (
                  <Check className="w-5 h-5 text-emerald-600 dark:text-[#19C78C] stroke-[3.5px]" />
                ) : (
                  <span className={`text-xs font-black ${isActive ? 'text-white' : 'text-slate-500 dark:text-slate-400'}`}>
                    {index + 1}
                  </span>
                )}
              </motion.div>

              {/* Step label - absolutely positioned below to avoid disrupting centerY of row */}
              <div className="absolute top-[52px] left-1/2 -translate-x-1/2 w-max text-center">
                <span 
                  className={`text-[11px] md:text-xs font-black tracking-tight transition-colors duration-300 block ${
                    isActive 
                      ? 'text-slate-900 dark:text-white font-extrabold' 
                      : 'text-slate-400 group-hover:text-slate-600 dark:text-slate-500 dark:group-hover:text-slate-400'
                  }`}
                >
                  {step.shortLabel}
                </span>
              </div>
            </button>

            {/* Step Connector Line Segment (only if not the last item) */}
            {index < steps.length - 1 && (
              <div className="self-center h-[1px] bg-slate-200 dark:bg-white/10 mx-2 rounded-full relative overflow-hidden">
                <motion.div
                  className="absolute inset-y-0 right-0 bg-gradient-to-l from-emerald-500 to-teal-400 origin-right h-[1.5px]"
                  initial={{ width: '0%' }}
                  animate={{ width: isCompleted ? '100%' : '0%' }}
                  transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                />
              </div>
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
};
