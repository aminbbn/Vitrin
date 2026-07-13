import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useSpring, useReducedMotion } from 'framer-motion';
import { ChevronDown, ChevronLeft, Menu, X, ArrowLeft } from 'lucide-react';

export type NavigationChild = {
  label: string;
  targetId?: string;
  route?: 'home' | 'features' | 'solutions';
};

export type NavigationItem = {
  label: string;
  route?: 'home' | 'features' | 'solutions';
  targetId?: string;
  children?: NavigationChild[];
};

const NAVIGATION_DATA: NavigationItem[] = [
  {
    label: 'صفحه اصلی',
    route: 'home',
    targetId: 'hero'
  },
  {
    label: 'امکانات',
    route: 'features',
    targetId: 'studio',
    children: [
      { label: 'امکانات فوق‌پیشرفته', route: 'features' },
      { label: 'استودیو طراحی زنده', route: 'features', targetId: 'studio' },
      { label: 'مدیریت منو و غذاها', route: 'features', targetId: 'products' },
      { label: 'شبیه‌ساز سفارش مشتری', route: 'features', targetId: 'flow' },
      { label: 'داشبورد سفارشات هوشمند', route: 'features', targetId: 'orders' }
    ]
  },
  {
    label: 'راهکارها',
    route: 'solutions',
    targetId: 'solutions-tabs',
    children: [
      { label: 'کافه‌ها', route: 'solutions', targetId: 'solutions-tabs' },
      { label: 'رستوران‌ها', route: 'solutions', targetId: 'solutions-tabs' },
      { label: 'فست‌فودها', route: 'solutions', targetId: 'solutions-tabs' },
      { label: 'فودکورت‌ها', route: 'solutions', targetId: 'solutions-tabs' },
      { label: 'مجموعه‌های زنجیره‌ای', route: 'solutions', targetId: 'solutions-tabs' }
    ]
  },
  {
    label: 'تعرفه‌ها',
    route: 'home',
    targetId: 'pricing'
  },
  {
    label: 'منابع',
    children: [
      { label: 'مرکز راهنما', route: 'home', targetId: 'faq' },
      { label: 'درخواست دمو', route: 'solutions', targetId: 'demo-form' },
      { label: 'تماس با ما', route: 'solutions', targetId: 'demo-form' },
      { label: 'قوانین و مقررات', route: 'home', targetId: 'faq' }
    ]
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
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [expandedMobileGroup, setExpandedMobileGroup] = useState<string | null>(null);
  const [activeSectionTab, setActiveSectionTab] = useState<string>('صفحه اصلی');
  const [isWindowLarge, setIsWindowLarge] = useState(true);

  const dropdownRef = useRef<HTMLDivElement>(null);

  // Monitor viewport size to switch mobile breakpoints gracefully
  useEffect(() => {
    const handleResize = () => {
      setIsWindowLarge(window.innerWidth >= 950);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Sticky header scroll monitoring
  useEffect(() => {
    const handleScroll = () => {
      setHasScrolled(window.scrollY > 60);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // IntersectionObserver to sync active state with sections
  useEffect(() => {
    const sectionIds = [
      'hero',
      'how-it-works',
      'pricing',
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
            setActiveSectionTab('صفحه اصلی');
          } else if (id === 'pricing' || id === 'faq') {
            setActiveSectionTab('تعرفه‌ها');
          } else if (['studio', 'products', 'flow', 'orders'].includes(id)) {
            setActiveSectionTab('امکانات');
          } else if (['solutions-tabs', 'demo-form'].includes(id)) {
            setActiveSectionTab('راهکارها');
          }
        }
      },
      {
        rootMargin: '-80px 0px -60% 0px',
        threshold: 0.1
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
  }, [marketingRoute]);

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

  // Escape key closes menus
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setActiveDropdown(null);
        setIsMobileMenuOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Click outside to close dropdowns
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setActiveDropdown(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Universal Navigation and Scroll logic
  const handleNavigation = (item: NavigationItem | NavigationChild) => {
    setActiveDropdown(null);
    setIsMobileMenuOpen(false);

    const targetRoute = item.route;
    const targetId = item.targetId;

    if (targetRoute) {
      if (targetRoute === 'features' && onNavigateFeatures) {
        onNavigateFeatures();
      } else if (targetRoute === 'solutions' && onNavigateSolutions) {
        onNavigateSolutions();
      } else {
        setMarketingRoute(targetRoute);
      }
    }

    if (targetId) {
      setTimeout(() => {
        const el = document.getElementById(targetId);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 150);
    } else if (targetRoute) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Scroll Progress calculations
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  // Animation constants for entrance sequence
  const entranceTransition = (delay: number) => ({
    y: shouldReduceMotion ? 0 : 0,
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.5,
      ease: [0.16, 1, 0.3, 1],
      delay: shouldReduceMotion ? 0 : delay
    }
  });

  return (
    <>
      {/* 2px Page scroll indicator at the absolute top */}
      <motion.div
        style={{ scaleX }}
        className="fixed top-0 left-0 right-0 h-[2px] bg-emerald-500 z-[9999] origin-right"
      />

      <motion.header
        id="marketing-header"
        initial={{ y: shouldReduceMotion ? 0 : -12, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className={`sticky top-0 z-50 w-full transition-all duration-300 font-['Vazirmatn'] ${
          hasScrolled
            ? 'h-16 bg-[#111312]/88 backdrop-blur-[20px] border-b border-white/[0.08] shadow-[0_8px_30px_rgb(0,0,0,0.3)]'
            : 'h-[76px] bg-[#111312] border-b border-white/[0.06]'
        } text-white flex items-center justify-between select-none`}
        style={{ direction: 'rtl' }}
      >
        <div className="w-full max-w-[1280px] mx-auto px-6 md:px-8 flex items-center justify-between gap-4">
          
          {/* RIGHT SIDE: BRAND LOCKUP */}
          <motion.div
            initial={{ scale: shouldReduceMotion ? 1 : 0.92, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="flex items-center shrink-0"
          >
            <button
              onClick={() => handleNavigation({ route: 'home', targetId: 'hero' })}
              onMouseEnter={() => setIsLogoHovered(true)}
              onMouseLeave={() => setIsLogoHovered(false)}
              className="flex items-center gap-3 text-right group focus:outline-none focus:ring-2 focus:ring-[#10b981]/30 rounded-xl p-1 bg-transparent border-0 cursor-pointer text-white"
            >
              <motion.div
                animate={{
                  y: isLogoHovered && !shouldReduceMotion ? -1 : 0,
                  scale: isLogoHovered && !shouldReduceMotion ? 1.03 : 1,
                  boxShadow: isLogoHovered && !shouldReduceMotion
                    ? '0 0 16px rgba(16, 185, 129, 0.45)'
                    : '0 2px 8px rgba(16, 185, 129, 0.15)'
                }}
                className={`transition-all bg-[#10b981] rounded-[11px] flex items-center justify-center shadow-lg shadow-[#10b981]/20 shrink-0 ${
                  hasScrolled ? 'w-[36px] h-[36px]' : 'w-[40px] h-[40px]'
                }`}
              >
                <span className="text-white font-extrabold text-lg leading-none select-none">وی</span>
              </motion.div>
              <div className="flex flex-col">
                <motion.span
                  animate={{
                    color: isLogoHovered ? '#ffffff' : 'rgba(255, 255, 255, 0.95)'
                  }}
                  className="text-base md:text-lg font-black tracking-tight leading-none text-white select-none"
                >
                  ویترین
                </motion.span>
                {isWindowLarge && (
                  <span className="text-[9px] font-medium text-slate-400 mt-0.5 select-none tracking-normal">
                    پلتفرم منوی دیجیتال
                  </span>
                )}
              </div>
            </button>
          </motion.div>

          {/* CENTER: DESKTOP NAVIGATION */}
          {isWindowLarge ? (
            <nav className="flex items-center" ref={dropdownRef}>
              <div className={`flex items-center transition-all duration-300 ${hasScrolled ? 'gap-6' : 'gap-8'}`}>
                {NAVIGATION_DATA.map((item, index) => {
                  const hasChildren = !!item.children;
                  const isCurrentActive =
                    marketingRoute === item.route || activeSectionTab === item.label;

                  return (
                    <div
                      key={item.label}
                      className="relative"
                      onMouseEnter={() => {
                        setHoveredLink(item.label);
                        if (hasChildren) setActiveDropdown(item.label);
                      }}
                      onMouseLeave={() => {
                        setHoveredLink(null);
                        if (hasChildren) setActiveDropdown(null);
                      }}
                    >
                      <motion.button
                        aria-expanded={activeDropdown === item.label}
                        aria-haspopup={hasChildren ? 'true' : undefined}
                        initial={{ y: shouldReduceMotion ? 0 : -8, opacity: 0 }}
                        animate={entranceTransition(0.2 + index * 0.08)}
                        onClick={() => !hasChildren && handleNavigation(item)}
                        className={`relative text-[13px] md:text-sm font-bold py-2 px-1 rounded-lg transition-colors border-0 bg-transparent cursor-pointer flex items-center gap-1.5 focus:outline-none focus:ring-1 focus:ring-[#10b981]/30 ${
                          isCurrentActive ? 'text-emerald-400' : 'text-slate-300 hover:text-white'
                        }`}
                      >
                        <motion.span
                          animate={{
                            y: hoveredLink === item.label && !shouldReduceMotion ? -1 : 0
                          }}
                          transition={{ duration: 0.18, ease: 'easeOut' }}
                          className="inline-flex items-center gap-1"
                        >
                          {item.label}
                          {hasChildren && (
                            <ChevronDown
                              className={`w-3.5 h-3.5 transition-transform duration-200 text-slate-400 group-hover:text-white ${
                                activeDropdown === item.label ? 'rotate-180' : ''
                              }`}
                            />
                          )}
                        </motion.span>

                        {/* UNDERLINE ACTIVE NAVIGATION STATE */}
                        {isCurrentActive && (
                          <motion.span
                            layoutId="activeNavUnderline"
                            className="absolute bottom-0 right-1/2 translate-x-1/2 w-5 h-[3px] bg-emerald-500 rounded-full shadow-[0_0_8px_rgba(16,185,129,0.5)]"
                          />
                        )}

                        {/* NORMAL HOVER UNDERLINE */}
                        {!isCurrentActive && hoveredLink === item.label && (
                          <span className="absolute bottom-0 right-0 left-0 h-[1.5px] bg-white/40 origin-right transition-transform duration-150" />
                        )}
                      </motion.button>

                      {/* DROPDOWN MENU */}
                      <AnimatePresence>
                        {hasChildren && activeDropdown === item.label && (
                          <motion.div
                            initial={{ opacity: 0, y: shouldReduceMotion ? 0 : -6, scale: shouldReduceMotion ? 1 : 0.98 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: shouldReduceMotion ? 0 : -4, scale: shouldReduceMotion ? 1 : 0.98 }}
                            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                            className="absolute right-0 top-full mt-2 w-[240px] bg-[#121413] border border-white/10 rounded-2xl shadow-2xl p-2 z-[100] text-right overflow-hidden backdrop-blur-xl"
                          >
                            <div className="flex flex-col gap-1">
                              {item.children?.map((child) => (
                                <button
                                  key={child.label}
                                  onClick={() => handleNavigation(child)}
                                  className="group flex items-center justify-between w-full h-11 px-3.5 rounded-xl text-right text-[13px] font-bold text-slate-300 hover:text-white hover:bg-white/[0.05] transition-all cursor-pointer border-0 bg-transparent"
                                >
                                  <span>{child.label}</span>
                                  <ChevronLeft className="w-3.5 h-3.5 text-[#10b981] opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-150" />
                                </button>
                              ))}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                })}
              </div>
            </nav>
          ) : (
            <div />
          )}

          {/* LEFT SIDE: ACTIONS (CTA & LOGIN) */}
          <div className="flex items-center gap-3">
            {/* Login button: hidden on small views, visible if there's enough space */}
            <motion.button
              initial={{ x: shouldReduceMotion ? 0 : -10, opacity: 0 }}
              animate={entranceTransition(0.7)}
              onClick={onLoginClick}
              className="hidden sm:inline-flex px-4 py-2 text-[13px] font-bold text-white/[0.8] hover:text-white hover:bg-white/[0.05] active:scale-[0.98] transition-all rounded-xl cursor-pointer bg-transparent border-0 outline-none focus:ring-2 focus:ring-white/15"
            >
              ورود به پنل
            </motion.button>

            {/* Primary CTA: "شروع رایگان" */}
            <motion.button
              initial={{ scale: shouldReduceMotion ? 1 : 0.95, opacity: 0 }}
              animate={entranceTransition(0.8)}
              onClick={onStartFreeClick}
              className={`bg-[#10b981] hover:bg-[#12cb8d] text-white font-extrabold text-[13px] rounded-xl flex items-center gap-2 group shadow-lg shadow-[#10b981]/20 border-0 cursor-pointer active:scale-[0.97] outline-none focus:ring-2 focus:ring-[#10b981] transition-all ${
                hasScrolled ? 'h-[38px] px-4' : 'h-[42px] px-5'
              }`}
            >
              <span>شروع رایگان</span>
              <span className="w-5 h-5 rounded-full bg-white/10 flex items-center justify-center transition-transform group-hover:-translate-x-1">
                <ArrowLeft className="w-3 h-3 text-white" />
              </span>
            </motion.button>

            {/* Mobile menu trigger */}
            {!isWindowLarge && (
              <motion.button
                aria-expanded={isMobileMenuOpen}
                aria-label="منوی اصلی"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="w-10 h-10 flex items-center justify-center bg-white/[0.05] hover:bg-white/[0.08] active:scale-[0.96] rounded-xl border border-white/10 text-white cursor-pointer focus:outline-none focus:ring-1 focus:ring-[#10b981]"
              >
                {isMobileMenuOpen ? (
                  <X className="w-5 h-5" />
                ) : (
                  <Menu className="w-5 h-5" />
                )}
              </motion.button>
            )}
          </div>
        </div>
      </motion.header>

      {/* MOBILE SHEETS PANEL */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            {/* Backdrop overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 z-[190] bg-[#050505]/80 backdrop-blur-md"
            />

            {/* Right side sheet drawer */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 220 }}
              className="fixed top-0 bottom-0 right-0 w-[88%] max-w-[400px] bg-[#0e100f] z-[200] shadow-2xl border-l border-white/10 flex flex-col justify-between overflow-y-auto"
              style={{ direction: 'rtl' }}
            >
              {/* Top Bar with brand and close action */}
              <div className="p-6 flex items-center justify-between border-b border-white/[0.08]">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 bg-[#10b981] rounded-xl flex items-center justify-center">
                    <span className="text-white font-extrabold text-sm">وی</span>
                  </div>
                  <span className="text-base font-black text-white">ویترین</span>
                </div>
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="w-9 h-9 flex items-center justify-center bg-white/5 rounded-xl border border-white/10 text-white cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Navigation list */}
              <div className="flex-1 py-6 px-6 overflow-y-auto">
                <nav className="flex flex-col gap-4">
                  {NAVIGATION_DATA.map((item, index) => {
                    const hasChildren = !!item.children;
                    const isExpanded = expandedMobileGroup === item.label;

                    return (
                      <motion.div
                        initial={{ x: shouldReduceMotion ? 0 : 20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: shouldReduceMotion ? 0 : index * 0.05 }}
                        key={item.label}
                        className="flex flex-col"
                      >
                        {hasChildren ? (
                          <>
                            <button
                              onClick={() =>
                                setExpandedMobileGroup(isExpanded ? null : item.label)
                              }
                              className="flex items-center justify-between py-3.5 text-right font-black text-base text-slate-100 hover:text-white border-0 bg-transparent cursor-pointer"
                            >
                              <span>{item.label}</span>
                              <ChevronDown
                                className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${
                                  isExpanded ? 'rotate-180' : ''
                                }`}
                              />
                            </button>

                            <AnimatePresence initial={false}>
                              {isExpanded && (
                                <motion.div
                                  initial={{ height: 0, opacity: 0 }}
                                  animate={{ height: 'auto', opacity: 1 }}
                                  exit={{ height: 0, opacity: 0 }}
                                  transition={{ duration: 0.25, ease: 'easeInOut' }}
                                  className="overflow-hidden pr-4 mr-1 border-r border-white/10 flex flex-col gap-2 mt-1 mb-2"
                                >
                                  {item.children?.map((child) => (
                                    <button
                                      key={child.label}
                                      onClick={() => handleNavigation(child)}
                                      className="py-2.5 text-right font-bold text-sm text-slate-400 hover:text-[#10b981] border-0 bg-transparent cursor-pointer block"
                                    >
                                      {child.label}
                                    </button>
                                  ))}
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </>
                        ) : (
                          <button
                            onClick={() => handleNavigation(item)}
                            className="py-3.5 text-right font-black text-base text-slate-100 hover:text-white border-0 bg-transparent cursor-pointer block"
                          >
                            {item.label}
                          </button>
                        )}
                      </motion.div>
                    );
                  })}
                </nav>
              </div>

              {/* Bottom Actions Area */}
              <div className="p-6 border-t border-white/[0.08] flex flex-col gap-3 bg-white/[0.02]">
                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    onLoginClick();
                  }}
                  className="w-full h-11 border border-white/10 hover:bg-white/5 active:scale-95 text-white font-bold text-sm rounded-xl cursor-pointer bg-transparent transition-all"
                >
                  ورود به پنل کاربری
                </button>
                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    onStartFreeClick();
                  }}
                  className="w-full h-11 bg-[#10b981] hover:bg-[#12cb8d] active:scale-95 text-white font-black text-sm rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-[#10b981]/15 cursor-pointer border-0 transition-all"
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
