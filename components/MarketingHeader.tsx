import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useSpring, useReducedMotion } from 'framer-motion';
import { Menu, X, ArrowLeft } from 'lucide-react';

export type NavigationItem = {
  label: string;
  targetId: string;
};

const NAVIGATION_DATA: NavigationItem[] = [
  {
    label: 'امکانات',
    targetId: 'studio'
  },
  {
    label: 'راهکارها',
    targetId: 'solutions-tabs'
  },
  {
    label: 'سوالات متداول',
    targetId: 'faq'
  }
];

interface MarketingHeaderProps {
  marketingRoute: 'home' | 'features' | 'solutions';
  setMarketingRoute: (route: 'home' | 'features' | 'solutions') => void;
  onLoginClick: () => void;
  onStartFreeClick: () => void;
  onNavigateFeatures?: () => void;
  onNavigateSolutions?: () => void;
}

export const MarketingHeader: React.FC<MarketingHeaderProps> = ({
  marketingRoute,
  setMarketingRoute,
  onLoginClick,
  onStartFreeClick,
  onNavigateFeatures,
  onNavigateSolutions
}) => {
  const shouldReduceMotion = useReducedMotion();
  const [hasScrolled, setHasScrolled] = useState(false);
  const [hoveredLink, setHoveredLink] = useState<string | null>(null);
  const [isLogoHovered, setIsLogoHovered] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeSectionTab, setActiveSectionTab] = useState<string | null>(null);
  const [isWindowLarge, setIsWindowLarge] = useState(true);

  // Monitor window resize
  useEffect(() => {
    const handleResize = () => {
      setIsWindowLarge(window.innerWidth >= 1024);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Monitor scroll for sticky style
  useEffect(() => {
    const handleScroll = () => {
      setHasScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // IntersectionObserver to sync active state with sections
  useEffect(() => {
    const sectionIds = [
      'hero',
      'how-it-works',
      'faq',
      'studio',
      'products',
      'flow',
      'orders',
      'solutions-tabs',
      'demo-form'
    ];
    const observedElements: HTMLElement[] = [];

    const observer = new IntersectionObserver(
      (entries) => {
        const visibleEntry = entries.find((entry) => entry.isIntersecting);
        if (visibleEntry) {
          const id = visibleEntry.target.id;
          if (id === 'hero' || id === 'how-it-works') {
            setActiveSectionTab(null);
          } else if (id === 'faq') {
            setActiveSectionTab('سوالات متداول');
          } else if (['studio', 'products', 'flow', 'orders'].includes(id)) {
            setActiveSectionTab('امکانات');
          } else if (['solutions-tabs', 'demo-form'].includes(id)) {
            setActiveSectionTab('راهکارها');
          }
        }
      },
      {
        rootMargin: '-10% 0px -60% 0px',
        threshold: 0.15
      }
    );

    sectionIds.forEach((id) => {
      const el = document.getElementById(id);
      if (el) {
        observer.observe(el);
        observedElements.push(el);
      }
    });

    return () => {
      observedElements.forEach((el) => observer.unobserve(el));
      observer.disconnect();
    };
  }, []);

  // Lock scroll when mobile menu is active
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobileMenuOpen]);

  // Handle section smooth scroll and sync state
  const handleNavigation = (targetId: string) => {
    setIsMobileMenuOpen(false);

    if (marketingRoute !== 'home') {
      setMarketingRoute('home');
      // Wait for route change to mount LandingPage and render elements
      setTimeout(() => {
        const el = document.getElementById(targetId);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 150);
    } else {
      const el = document.getElementById(targetId);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  };

  const handleLogoClick = () => {
    setIsMobileMenuOpen(false);
    if (marketingRoute !== 'home') {
      setMarketingRoute('home');
      setTimeout(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }, 100);
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    setActiveSectionTab(null);
  };

  // Scroll Progress logic for elegant top beam
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 24,
    restDelta: 0.001
  });

  // Framer Motion Entrance Animation Variants
  const headerEntranceVariants = {
    hidden: { y: shouldReduceMotion ? 0 : -24, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.7,
        ease: [0.16, 1, 0.3, 1],
        staggerChildren: 0.08,
        delayChildren: 0.1
      }
    }
  };

  const staggerItemVariants = {
    hidden: { y: shouldReduceMotion ? 0 : -10, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] }
    }
  };

  return (
    <>
      {/* 1. Sleek Scroll Progress beam at the absolute top */}
      <motion.div
        style={{ scaleX }}
        className="fixed top-0 left-0 right-0 h-[3px] bg-gradient-to-l from-emerald-500 via-[#10b981] to-emerald-300 shadow-[0_1px_10px_rgba(16,185,129,0.5)] z-[9999] origin-right"
      />

      {/* 2. Marketing Sticky Header */}
      <motion.header
        id="marketing-header"
        variants={headerEntranceVariants}
        initial="hidden"
        animate="visible"
        className={`sticky top-0 z-50 w-full transition-all duration-300 font-['Vazirmatn'] ${
          hasScrolled
            ? 'h-14 bg-[#080908]/92 backdrop-blur-[16px] border-b border-[#10b981]/15 shadow-[0_8px_32px_-10px_rgba(0,0,0,0.6)]'
            : 'h-[72px] bg-[#0c0e0d] border-b border-white/[0.03]'
        } text-white flex items-center justify-between select-none`}
        style={{ direction: 'rtl' }}
      >
        <div className="w-full max-w-[1200px] mx-auto px-6 md:px-8 flex items-center justify-between gap-4">
          
          {/* RIGHT SIDE: PREMIUM BRAND LOCKUP */}
          <motion.div
            variants={staggerItemVariants}
            className="flex items-center shrink-0"
          >
            <button
              onClick={handleLogoClick}
              onMouseEnter={() => setIsLogoHovered(true)}
              onMouseLeave={() => setIsLogoHovered(false)}
              className="flex items-center gap-2.5 text-right group focus:outline-none focus-visible:ring-2 focus-visible:ring-[#10b981]/30 rounded-xl p-1 bg-transparent border-0 cursor-pointer text-white"
            >
              {/* Premium monogram tile with concentric gradients */}
              <div
                className={`bg-gradient-to-br from-[#10b981] via-[#059669] to-[#047857] flex items-center justify-center shadow-lg shadow-[#10b981]/10 shrink-0 relative overflow-hidden transition-all duration-300 group-hover:scale-[1.03] group-hover:shadow-[0_0_20px_rgba(16,185,129,0.35)] ${
                  hasScrolled ? 'w-8 h-8 rounded-[10px]' : 'w-10 h-10 rounded-[12px]'
                }`}
              >
                {/* Subtle inner highlight rim */}
                <div className="absolute inset-0 border border-white/20 rounded-[inherit] pointer-events-none" />
                <span className={`text-white font-black leading-none select-none ${
                  hasScrolled ? 'text-xs' : 'text-sm'
                }`}>وی</span>
              </div>

              {/* Wordmark & Tagline */}
              <div className="flex flex-col">
                <span className={`font-black tracking-tight text-white/90 group-hover:text-white transition-all duration-300 ${
                  hasScrolled ? 'text-sm' : 'text-base'
                }`}>
                  ویترین
                </span>
                {isWindowLarge && (
                  <motion.span 
                    animate={{ opacity: hasScrolled ? 0 : 0.8 }}
                    transition={{ duration: 0.2 }}
                    className="text-[9px] font-black text-emerald-400/80 tracking-wide leading-none mt-0.5 select-none"
                  >
                    پلتفرم منوی دیجیتال
                  </motion.span>
                )}
              </div>
            </button>
          </motion.div>

          {/* CENTER: DESKTOP FLOATING NAV RAIL ("Vitrin Signal Header") */}
          {isWindowLarge && (
            <motion.div
              variants={staggerItemVariants}
              className="flex items-center justify-center relative"
            >
              <nav
                className={`bg-white/[0.02] border border-white/[0.05] rounded-full px-1.5 py-1 flex items-center relative shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)] transition-all duration-300 ${
                  hasScrolled ? 'gap-1 h-9' : 'gap-1.5 h-11'
                }`}
              >
                {NAVIGATION_DATA.map((item) => {
                  const isCurrentActive = activeSectionTab === item.label;

                  return (
                    <button
                      key={item.label}
                      onClick={() => handleNavigation(item.targetId)}
                      onMouseEnter={() => setHoveredLink(item.label)}
                      onMouseLeave={() => setHoveredLink(null)}
                      className={`relative text-[13px] font-black px-4 h-full rounded-full transition-colors border-0 bg-transparent cursor-pointer flex items-center justify-center gap-1.5 select-none focus:outline-none focus-visible:ring-1 focus-visible:ring-[#10b981]/50 ${
                        isCurrentActive ? 'text-white' : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      {/* Subtly reacting label */}
                      <span className="relative z-10 transition-transform duration-200">
                        {item.label}
                      </span>

                      {/* ACTIVE STATE: Premium Sliding Signal Capsule */}
                      {isCurrentActive && !shouldReduceMotion && (
                        <motion.div
                          layoutId="activeNavSignalCapsule"
                          transition={{
                            type: 'spring',
                            stiffness: 300,
                            damping: 30
                          }}
                          className="absolute inset-0 bg-[#10b981]/10 border border-[#10b981]/20 rounded-full shadow-[0_0_15px_rgba(16,185,129,0.08)] z-0 flex items-center justify-center"
                        >
                          {/* Inner glowing pulse dot representing signal lock */}
                          <span className="w-1 h-1 rounded-full bg-[#10b981] absolute bottom-0.5 left-1/2 -translate-x-1/2 shadow-[0_0_6px_#10b981] animate-pulse" />
                        </motion.div>
                      )}

                      {/* Backup static layout for reduced motion */}
                      {isCurrentActive && shouldReduceMotion && (
                        <div className="absolute inset-0 bg-[#10b981]/15 border border-[#10b981]/25 rounded-full z-0" />
                      )}

                      {/* HOVER TRACE AURA */}
                      {!isCurrentActive && hoveredLink === item.label && !shouldReduceMotion && (
                        <motion.div
                          layoutId="hoverNavAura"
                          transition={{
                            type: 'spring',
                            stiffness: 400,
                            damping: 32
                          }}
                          className="absolute inset-0 bg-white/[0.03] border border-white/[0.04] rounded-full z-0"
                        />
                      )}
                    </button>
                  );
                })}
              </nav>
            </motion.div>
          )}

          {/* LEFT SIDE: ACTIONS (CTA & LOGIN) */}
          <motion.div
            variants={staggerItemVariants}
            className="flex items-center gap-3"
          >
            {/* Ghost style login button */}
            <button
              onClick={onLoginClick}
              className="hidden sm:inline-flex px-3.5 py-1.5 text-xs font-black text-slate-300 hover:text-white hover:bg-white/[0.04] rounded-xl transition-all border-0 bg-transparent cursor-pointer select-none focus:outline-none focus-visible:ring-1 focus-visible:ring-white/20 active:scale-95"
            >
              ورود به پنل
            </button>

            {/* High-end primary CTA: "شروع رایگان" */}
            <button
              onClick={onStartFreeClick}
              className={`bg-[#10b981] hover:bg-emerald-500 text-white font-black text-xs rounded-xl flex items-center gap-2 shadow-[0_4px_16px_rgba(16,185,129,0.15)] hover:shadow-[0_8px_24px_rgba(16,185,129,0.3)] border-0 cursor-pointer active:scale-95 outline-none focus:ring-2 focus:ring-[#10b981]/50 group transition-all duration-300 ${
                hasScrolled ? 'h-9 px-4 rounded-lg' : 'h-10 px-5'
              }`}
            >
              <span>شروع رایگان</span>
              <span className="w-5 h-5 rounded-full bg-white/10 flex items-center justify-center transition-transform group-hover:-translate-x-0.5">
                <ArrowLeft className="w-3.5 h-3.5 text-white" />
              </span>
            </button>

            {/* Mobile Menu Trigger */}
            {!isWindowLarge && (
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="w-10 h-10 flex items-center justify-center bg-white/[0.03] hover:bg-white/[0.06] active:scale-95 rounded-xl border border-white/10 text-white cursor-pointer focus:outline-none focus-visible:ring-1 focus-visible:ring-[#10b981] transition-all"
              >
                {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            )}
          </motion.div>

        </div>
      </motion.header>

      {/* MOBILE SHEETS PANEL */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            {/* Backdrop Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 z-[190] bg-[#050605]/80 backdrop-blur-md"
            />

            {/* Sliding Panel Drawer */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 26, stiffness: 220 }}
              className="fixed top-0 bottom-0 right-0 w-[85%] max-w-[340px] bg-[#0b0c0b] z-[200] shadow-2xl border-l border-white/[0.06] flex flex-col justify-between overflow-y-auto"
              style={{ direction: 'rtl' }}
            >
              {/* Top lockup block */}
              <div className="p-6 flex items-center justify-between border-b border-white/[0.05]">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 bg-gradient-to-br from-[#10b981] to-[#047857] rounded-xl flex items-center justify-center shadow-md shadow-[#10b981]/15">
                    <span className="text-white font-black text-sm">وی</span>
                  </div>
                  <span className="text-base font-black text-white/95">ویترین</span>
                </div>
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="w-9 h-9 flex items-center justify-center bg-white/5 rounded-xl border border-white/10 text-white cursor-pointer hover:bg-white/10 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Navigation Items (Coherent vertical rails aligned with concept) */}
              <div className="flex-1 py-8 px-6">
                <nav className="flex flex-col gap-3">
                  {NAVIGATION_DATA.map((item, index) => {
                    const isCurrentActive = activeSectionTab === item.label;

                    return (
                      <motion.button
                        key={item.label}
                        initial={{ x: shouldReduceMotion ? 0 : 16, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: shouldReduceMotion ? 0 : index * 0.06, ease: 'easeOut' }}
                        onClick={() => handleNavigation(item.targetId)}
                        className={`w-full py-3.5 px-4 rounded-xl text-right font-black text-sm flex items-center justify-between transition-all border-0 bg-transparent cursor-pointer ${
                          isCurrentActive
                            ? 'bg-[#10b981]/10 text-white border border-[#10b981]/20 shadow-[inset_0_1px_1px_rgba(255,255,255,0.02)]'
                            : 'text-slate-300 hover:text-white hover:bg-white/[0.02]'
                        }`}
                      >
                        <span>{item.label}</span>
                        {isCurrentActive && (
                          <span className="w-1.5 h-1.5 rounded-full bg-[#10b981] shadow-[0_0_8px_#10b981] animate-pulse" />
                        )}
                      </motion.button>
                    );
                  })}
                </nav>
              </div>

              {/* Bottom Actions Block */}
              <div className="p-6 border-t border-white/[0.05] flex flex-col gap-3 bg-white/[0.01]">
                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    onLoginClick();
                  }}
                  className="w-full h-11 border border-white/10 hover:bg-white/5 active:scale-95 text-slate-300 hover:text-white font-black text-xs rounded-xl cursor-pointer bg-transparent transition-all"
                >
                  ورود به پنل کاربری
                </button>
                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    onStartFreeClick();
                  }}
                  className="w-full h-11 bg-[#10b981] hover:bg-emerald-500 active:scale-95 text-white font-black text-xs rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-[#10b981]/15 cursor-pointer border-0 transition-all"
                >
                  <span>شروع رایگان</span>
                  <ArrowLeft className="w-4 h-4 text-white" />
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};
