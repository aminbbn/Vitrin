import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronUp, ChevronDown } from 'lucide-react';
import { ComponentItem } from '../../types';

interface HeroBlockProps {
  element?: ComponentItem;
  brandColor: string;
  mode: 'edit' | 'live';
  isSelected?: boolean;
  onClick?: () => void;
  device?: 'mobile' | 'tablet';
}

export const HeroBlock: React.FC<HeroBlockProps> = ({
  element,
  brandColor,
  mode,
  isSelected = false,
  onClick,
  device = 'mobile',
}) => {
  const settings = element?.settings || {};
  const { style = 'stack', imageUrl = '', title = '', subtitle = '', color = '', fontSize } = settings;
  const [isExpanded, setIsExpanded] = useState(false);
  const [isOpenOverlap, setIsOpenOverlap] = useState(true);

  const handleSplitClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsExpanded(!isExpanded);
  };

  const isEdit = mode === 'edit';
  const isMobile = device === 'mobile';

  // Selection border styling for edit mode
  const containerClasses = isEdit
    ? `relative w-full rounded-2xl overflow-hidden cursor-pointer transition-all border-2 bg-white dark:bg-slate-900 ${
        isSelected
          ? `border-${brandColor}-500 ring-4 ring-${brandColor}-500/10`
          : `border-transparent hover:border-${brandColor}-200 dark:hover:border-${brandColor}-800`
      }`
    : 'relative overflow-hidden rounded-2xl mx-4 my-2 border border-slate-100 dark:border-slate-800 shadow-sm bg-white dark:bg-slate-900 transition-colors duration-300';

  const widthStyle = isEdit ? undefined : { width: 'calc(100% - 2rem)' };

  if (style === 'overlay') {
    const aspectClass = isEdit
      ? isMobile
        ? 'aspect-square'
        : 'aspect-[21/9] h-[400px]'
      : 'aspect-[16/11]';

    return (
      <motion.div
        layoutId={isEdit ? element.id : undefined}
        onClick={onClick}
        className={`${containerClasses} ${aspectClass}`}
        style={widthStyle}
      >
        <div className="absolute inset-0">
          <img
            referrerPolicy="no-referrer"
            src={imageUrl || undefined}
            alt="Hero"
            className="w-full h-full object-cover"
          />
          <div className="absolute bottom-0 left-0 right-0 h-2/3 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
        </div>
        <div className="absolute bottom-0 left-0 right-0 p-6 z-10 text-right">
          <h3
            style={{ color: color || undefined, fontSize: fontSize || 24 }}
            className={`font-black leading-tight mb-2 drop-shadow-sm ${!color ? 'text-white' : ''}`}
          >
            {title}
          </h3>
          {subtitle && (
            <p className="text-white/80 text-xs font-bold leading-relaxed drop-shadow-sm">
              {subtitle}
            </p>
          )}
        </div>
      </motion.div>
    );
  }

  if (style === 'stack') {
    const heightClass = isEdit
      ? isMobile
        ? 'aspect-square'
        : 'h-[300px]'
      : 'aspect-[16/10]';

    return (
      <motion.div
        layoutId={isEdit ? element.id : undefined}
        onClick={onClick}
        className={`${containerClasses} flex flex-col`}
        style={widthStyle}
      >
        <div className={`${heightClass} w-full relative overflow-hidden`}>
          <img
            referrerPolicy="no-referrer"
            src={imageUrl || undefined}
            alt="Hero"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="p-6 text-center">
          <h3
            style={{ color: color || undefined, fontSize: fontSize || 20 }}
            className={`font-black mb-2 ${!color ? 'text-slate-900 dark:text-slate-100' : ''}`}
          >
            {title}
          </h3>
          {subtitle && (
            <p className="text-slate-500 dark:text-slate-400 text-xs font-bold leading-relaxed">
              {subtitle}
            </p>
          )}
        </div>
      </motion.div>
    );
  }

  if (style === 'split') {
    const heightClass = isEdit
      ? isMobile
        ? 'aspect-square'
        : 'h-[400px]'
      : 'aspect-[16/10]';

    return (
      <motion.div
        layout
        layoutId={isEdit ? element.id : undefined}
        onClick={onClick}
        className={`${containerClasses} ${heightClass}`}
        style={widthStyle}
      >
        <div className="w-full h-full relative">
          <motion.div
            layout
            onClick={handleSplitClick}
            className="absolute top-0 bottom-0 left-0 bg-cover bg-center cursor-pointer z-10 transition-all duration-500 ease-spring"
            style={{
              backgroundImage: `url(${imageUrl})`,
              width: isExpanded ? '100%' : '50%',
            }}
          >
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: isExpanded ? 1 : 0 }}
              className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent"
            />
          </motion.div>

          <div
            className={`absolute top-0 bottom-0 right-0 w-1/2 flex flex-col items-start justify-center p-6 text-right transition-opacity duration-300 ${
              isExpanded ? 'opacity-0 pointer-events-none' : 'opacity-100'
            }`}
          >
            <h3
              style={{ color: color || undefined, fontSize: fontSize || 18 }}
              className={`font-black mb-2 leading-tight ${!color ? 'text-slate-900 dark:text-slate-100' : ''}`}
            >
              {title}
            </h3>
            {subtitle && (
              <p className="text-slate-400 dark:text-slate-500 text-[10px] font-bold leading-relaxed">
                {subtitle}
              </p>
            )}
            <button
              onClick={handleSplitClick}
              className={`mt-4 px-4 py-2 bg-${brandColor}-50 dark:bg-${brandColor}-950/35 text-${brandColor}-600 dark:text-${brandColor}-400 rounded-lg text-xs font-bold hover:bg-${brandColor}-100 dark:hover:bg-${brandColor}-900/40 transition-colors`}
            >
              سفارش دهید
            </button>
          </div>

          <AnimatePresence>
            {isExpanded && (
              <motion.div
                initial={{ y: 60, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 60, opacity: 0 }}
                transition={{
                  type: 'spring',
                  damping: 20,
                  stiffness: 300,
                  delay: 0.1,
                }}
                className="absolute bottom-0 left-0 right-0 p-8 z-20 text-right text-white pointer-events-none"
              >
                <h3
                  style={{ color: 'white', fontSize: (fontSize || 18) + 4 }}
                  className="font-black mb-2 leading-tight drop-shadow-lg"
                >
                  {title}
                </h3>
                {subtitle && (
                  <p className="text-white/90 text-xs font-medium drop-shadow-md leading-relaxed">
                    {subtitle}
                  </p>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    );
  }

  // Fallback overlap style
  return (
    <div className={`relative w-full ${isEdit ? '' : 'mb-6'}`} onClick={onClick}>
      <div
        className={`w-full h-[45vh] relative z-0 transition-all duration-700 ${
          isOpenOverlap && !isEdit ? 'blur-sm scale-[1.02]' : 'blur-0 scale-100'
        }`}
      >
        <img
          referrerPolicy="no-referrer"
          src={imageUrl || undefined}
          alt="Hero"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-60" />
      </div>

      <AnimatePresence>
        {isOpenOverlap && !isEdit && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="fixed inset-0 bg-slate-900/40 backdrop-blur-md z-40 pointer-events-auto cursor-default"
              onClick={() => setIsOpenOverlap(false)}
            />

            <motion.div
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 60, opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="relative z-50 -mt-16 px-4"
            >
              <div className="bg-white dark:bg-slate-900 rounded-[2rem] p-8 text-center shadow-2xl border border-slate-100/80 dark:border-slate-800/80 transition-colors duration-300">
                <h1
                  style={{ color: color || undefined, fontSize: fontSize || 28 }}
                  className={`font-black mb-3 leading-tight ${!color ? 'text-slate-900 dark:text-slate-100' : ''}`}
                >
                  {title}
                </h1>
                {subtitle && (
                  <p className="text-slate-500 dark:text-slate-400 text-sm mb-6 font-medium leading-relaxed">
                    {subtitle}
                  </p>
                )}
                <button
                  onClick={() => setIsOpenOverlap(false)}
                  className={`bg-black dark:bg-slate-100 text-white dark:text-slate-900 px-8 py-4 rounded-2xl font-black text-sm w-full shadow-lg shadow-black/20 dark:shadow-none hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer`}
                >
                  شروع سفارش
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};
