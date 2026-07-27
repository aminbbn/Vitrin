
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { CheckCircle2, Sparkles, X, ChevronLeft, ChevronDown, User, Eye, Store, Sun, Moon } from 'lucide-react';
import { ViewState, Notification, ComponentItem } from './types';
import { SIDEBAR_LINKS, SEARCH_ITEMS } from './constants';
import Dashboard from './components/Dashboard';
import CanvasDesigner from './components/CanvasDesigner';
import ProductManager from './components/ProductManager';
import SettingsPage from './components/Settings';
import LoginPage from './components/LoginPage';
import SearchResults from './components/SearchResults';
import NotificationArchive from './components/NotificationArchive';
import NotificationsView from './components/NotificationsView';
import CategoryManager from './components/CategoryManager';
import CustomerMenu from './components/CustomerMenu';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import { OnboardingScreen } from './components/OnboardingScreen';
import { LandingPage } from './components/LandingPage';
import { FeaturesPage } from './components/FeaturesPage';
import { SolutionsPage } from './components/SolutionsPage';
import { ScrollProgress } from './components/MotionSystem';
import { MarketingHeader } from './components/MarketingHeader';
import { useTheme } from './components/ThemeProvider';
import { ReactiveGridBackground } from './components/ReactiveGridBackground';
import { useRepositories } from './data/RepositoryProvider';
import { useTenant, useMenuDraft, useAppSession } from './data/useRepositories';

const INITIAL_NOTIFICATIONS: Notification[] = [
  { id: '1', type: 'system', title: 'خوش آمدید', message: 'به پنل مدیریت ویترین خوش آمدید. منوی دیجیتال آماده طراحی و انتشار است.', time: 'هم‌اکنون', read: false, link: 'dashboard' },
];

const App: React.FC = () => {
  // REPOSITORIES & HOOKS
  const { authRepository } = useRepositories();
  const {
    user,
    isAuthenticated,
    isEmailVerified,
    memberships,
    activeRestaurant,
    activeBranch,
    role,
    loading: sessionLoading,
    refetchSession
  } = useAppSession();

  const { restaurant, brandColor, updateInfo, updateBrandColor, loading: tenantLoading } = useTenant();
  const { draftElements: canvasElements, saveDraft: setCanvasElements, publishMenu, loading: menuLoading } = useMenuDraft();
  const [authLoading, setAuthLoading] = useState(false);

  const [showLoginFlow, setShowLoginFlow] = useState(false);
  const [marketingRoute, setMarketingRoute] = useState<'home' | 'features' | 'solutions'>('home');
  const [pendingSection, setPendingSection] = useState<string | null>(null);
  const shouldReduceMotion = useReducedMotion();

  const handleNavigate = (route: 'home' | 'features' | 'solutions') => {
    setMarketingRoute(route);
    window.scrollTo({
      top: 0,
      behavior: shouldReduceMotion ? 'auto' : 'smooth'
    });
  };

  const handleNavigateToSection = (route: 'home', sectionId: string) => {
    if (marketingRoute !== 'home') {
      setPendingSection(sectionId);
      setMarketingRoute('home');
    } else {
      const el = document.getElementById(sectionId);
      if (el) {
        el.scrollIntoView({ behavior: shouldReduceMotion ? 'auto' : 'smooth', block: 'start' });
      }
    }
  };

  // Scroll to section after landing page mounts
  useEffect(() => {
    if (marketingRoute === 'home' && pendingSection) {
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          const el = document.getElementById(pendingSection);
          if (el) {
            el.scrollIntoView({ behavior: shouldReduceMotion ? 'auto' : 'smooth', block: 'start' });
          }
          setPendingSection(null);
        });
      });
    }
  }, [marketingRoute, pendingSection, shouldReduceMotion]);

  const [activeView, setActiveView] = useState<ViewState>('dashboard');
  const [previousView, setPreviousView] = useState<ViewState>('dashboard');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isRestaurantOpen, setIsRestaurantOpen] = useState(true);
  const [isPublishing, setIsPublishing] = useState(false);
  const [showPublishSuccess, setShowPublishSuccess] = useState(false);
  
  // Responsive Mobile Sidebar State
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  // Dark/Light Theme State from global ThemeProvider
  const { theme, setTheme, toggleTheme } = useTheme();

  // Synchronize CSS variables with the brand color and theme
  useEffect(() => {
    const COLORS = [
      { id: 'emerald', hex: '#10b981' },
      { id: 'blue', hex: '#3b82f6' },
      { id: 'purple', hex: '#a855f7' },
      { id: 'orange', hex: '#f97316' },
      { id: 'red', hex: '#ef4444' },
      { id: 'violet', hex: '#8b5cf6' },
      { id: 'pink', hex: '#ec4899' },
      { id: 'zinc', hex: '#71717a' },
      { id: 'slate', hex: '#64748b' },
    ];
    const colorObj = COLORS.find(c => c.id === brandColor) || COLORS[0];
    const hex = colorObj.hex;
    const root = document.documentElement;

    root.style.setProperty('--app-accent', hex);
    root.style.setProperty('--accent', hex);

    if (theme === 'dark') {
      root.style.setProperty('--app-bg', `color-mix(in oklab, ${hex} 4%, #050605)`);
      root.style.setProperty('--page-bg', `color-mix(in oklab, ${hex} 4%, #050605)`);
      root.style.setProperty('--app-sidebar', `color-mix(in oklab, ${hex} 7%, #070908)`);
      root.style.setProperty('--app-surface', `color-mix(in oklab, ${hex} 10%, #0a0d0b)`);
      root.style.setProperty('--surface-bg', `color-mix(in oklab, ${hex} 10%, #0a0d0b)`);
      root.style.setProperty('--app-surface-elevated', `color-mix(in oklab, ${hex} 14%, #0d110f)`);
      root.style.setProperty('--app-border', `color-mix(in srgb, ${hex} 12%, transparent)`);
      root.style.setProperty('--app-hover', `color-mix(in srgb, ${hex} 8%, transparent)`);
      root.style.setProperty('--app-active-bg', `color-mix(in srgb, ${hex} 12%, transparent)`);
      root.style.setProperty('--app-active-border', `color-mix(in srgb, ${hex} 30%, transparent)`);
    } else {
      root.style.setProperty('--app-bg', '#F5F7F6');
      root.style.setProperty('--page-bg', '#F5F7F6');
      root.style.setProperty('--app-sidebar', '#FFFFFF');
      root.style.setProperty('--app-surface', '#FFFFFF');
      root.style.setProperty('--surface-bg', '#FFFFFF');
      root.style.setProperty('--app-surface-elevated', '#FFFFFF');
      root.style.setProperty('--app-border', 'rgba(17, 31, 24, 0.08)');
      root.style.setProperty('--app-hover', `color-mix(in srgb, ${hex} 5%, transparent)`);
      root.style.setProperty('--app-active-bg', `color-mix(in srgb, ${hex} 8%, transparent)`);
      root.style.setProperty('--app-active-border', `color-mix(in srgb, ${hex} 20%, transparent)`);
    }
  }, [brandColor, theme]);

  // Prevent background scrolling on mobile when sidebar drawer is open
  useEffect(() => {
    if (isMobileSidebarOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobileSidebarOpen]);

  // Set local state for backward compatibility if needed, though we can use restaurant info directly
  const restaurantName = activeRestaurant?.name || restaurant?.name || 'رستوران ایتالیایی لیمو';
  const restaurantLogo = activeRestaurant?.logoUrl || restaurant?.logoUrl || '';

  // Search State
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [highlightedItemId, setHighlightedItemId] = useState<string | null>(null);

  // Notification State
  const [notifications, setNotifications] = useState<Notification[]>(INITIAL_NOTIFICATIONS);

  // Session updates already handled by AppSessionProvider

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedQuery(searchQuery), 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  useEffect(() => {
    if (debouncedQuery.trim() && activeView !== 'search-results') {
      setPreviousView(activeView);
      setActiveView('search-results');
    } else if (!debouncedQuery.trim() && activeView === 'search-results') {
      setActiveView(previousView);
    }
  }, [debouncedQuery]);

  const handleLogin = async (_email?: string, _password?: string) => {
    // Login is handled by AuthContainer → loginWithEmail / loginWithGoogle.
    // This handler is kept for backward compatibility only.
    await refetchSession();
  };

  const handleLogout = async () => {
    setAuthLoading(true);
    try {
      await authRepository.logout();
      await refetchSession();
      setActiveView('dashboard');
    } catch (e) {
      console.error('Error logging out:', e);
    } finally {
      setAuthLoading(false);
    }
  };

  const handlePublish = async () => {
    setIsPublishing(true);
    try {
      await publishMenu(canvasElements);
      setShowPublishSuccess(true);
      setTimeout(() => setShowPublishSuccess(false), 3000);
    } catch (e) {
      console.error('Error publishing:', e);
    } finally {
      setIsPublishing(false);
    }
  };

  const handlePreviewShop = () => {
    setPreviousView(activeView);
    setActiveView('customer-menu');
  };

  const renderView = () => {
    if (tenantLoading || menuLoading || authLoading || sessionLoading) {
      return (
        <div className="flex items-center justify-center h-full w-full bg-app-bg">
          <div className="flex flex-col items-center gap-4">
            <div className="w-12 h-12 rounded-full border-4 border-slate-200 border-t-emerald-500 animate-spin" />
            <p className="text-sm text-slate-400 font-medium">در حال بارگذاری اطلاعات...</p>
          </div>
        </div>
      );
    }

    if (isAuthenticated && memberships.length === 0) {
      return (
        <div className="flex items-center justify-center h-full w-full bg-app-bg p-8 font-['Vazirmatn'] text-right">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-10 rounded-[2rem] max-w-lg shadow-2xl flex flex-col items-center gap-6">
            <div className="w-16 h-16 rounded-2xl bg-amber-500/10 text-amber-500 flex items-center justify-center">
              <Store className="w-8 h-8" />
            </div>
            <div className="text-center space-y-2">
              <h3 className="text-xl font-black text-slate-800 dark:text-slate-100">پنل مدیریت فروشگاه</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                حساب کاربری شما (**{user?.firstName} {user?.lastName}**) به عنوان حساب مشتری ثبت شده است و فاقد هرگونه عضویت یا دسترسی مدیریتی به فروشگاه‌ها است.
              </p>
              <p className="text-xs text-slate-400 dark:text-slate-500">
                در صورت نیاز، می‌توانید از شبیه‌ساز بالای صفحه برای تغییر نقش خود به مالک یا مدیر سیستم استفاده کنید.
              </p>
            </div>
            <button 
              onClick={handlePreviewShop}
              className="px-6 py-3 bg-emerald-600 text-white rounded-2xl font-black text-xs hover:bg-emerald-700 transition-all shadow-lg active:scale-95"
            >
              مشاهده منوی مشتریان
            </button>
          </div>
        </div>
      );
    }

    switch (activeView) {
      case 'dashboard': 
        return (
          <Dashboard 
            onNavigateDesigner={() => setActiveView('designer')}
            onNavigateCatalog={() => setActiveView('products')}
            onNavigateSettings={() => setActiveView('settings')}
            brandColor={brandColor} 
            theme={theme} 
          />
        );
      case 'designer': return <CanvasDesigner elements={canvasElements} onElementsChange={setCanvasElements} brandColor={brandColor} />;
      case 'products': return <ProductManager brandColor={brandColor} highlightedItemId={highlightedItemId} clearHighlight={() => setHighlightedItemId(null)} />;
      case 'categories': return <CategoryManager brandColor={brandColor} />;
      case 'settings': 
        return (
          <SettingsPage 
            restaurantName={restaurantName} 
            setRestaurantName={(name) => updateInfo({ name })} 
            restaurantLogo={restaurantLogo}
            setRestaurantLogo={(logoUrl) => updateInfo({ logoUrl })}
            brandColor={brandColor}
            setBrandColor={(color) => updateBrandColor(color)}
          />
        );
      case 'customer-menu': return <CustomerMenu source="PREVIEW_DRAFT" liveElements={canvasElements} theme={theme} toggleTheme={() => setTheme(prev => prev === 'light' ? 'dark' : 'light')} />;
      case 'search-results': return <SearchResults query={searchQuery} onBack={() => setActiveView(previousView)} onNavigate={(view, itemId) => {
        setActiveView(view as ViewState);
        if (itemId) setHighlightedItemId(itemId);
      }} />;
      case 'notification-archive': 
        return (
          <NotificationArchive 
            notifications={notifications}
            onDelete={(id) => setNotifications(prev => prev.filter(n => n.id !== id))}
            onClearAll={() => setNotifications([])}
            onMarkRead={(n) => {
              setNotifications(prev => prev.map(notif => notif.id === n.id ? ({ ...notif, read: true }) : notif));
              if (n.link) setActiveView(n.link);
            }}
            onBack={() => setActiveView(previousView)}
          />
        );
      case 'notifications':
        return (
          <NotificationsView
             notifications={notifications}
             onMarkAllRead={() => setNotifications(prev => prev.map(n => ({ ...n, read: true })))}
             onMarkRead={(id) => {
               setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
               const found = notifications.find(n => n.id === id);
               if (found && found.link) setActiveView(found.link);
             }}
             onDelete={(id) => setNotifications(prev => prev.filter(n => n.id !== id))}
          />
        );
      default: return <div className="p-10 text-center text-slate-400">بخش در حال توسعه</div>;
    }
  };

  const isStandaloneCustomerView = new URLSearchParams(window.location.search).get('view') === 'customer-menu';
  if (isStandaloneCustomerView) return <CustomerMenu />;

  if (isAuthenticated && memberships.length === 0) {
    if (activeView === 'customer-menu') {
      return <CustomerMenu source="PREVIEW_DRAFT" liveElements={canvasElements} theme={theme} toggleTheme={() => setTheme(prev => prev === 'light' ? 'dark' : 'light')} />;
    }
    return <OnboardingScreen onLogout={handleLogout} />;
  }
  
  if (isAuthenticated && !isEmailVerified) {
    return (
      <LoginPage 
        brandColor={brandColor} 
        onBackToLanding={async () => {
          await authRepository.logout();
          await refetchSession();
          setShowLoginFlow(false);
        }}
      />
    );
  }

  if (!isAuthenticated) {
    if (showLoginFlow) {
      return (
        <LoginPage 
          brandColor={brandColor} 
          onBackToLanding={() => setShowLoginFlow(false)} 
        />
      );
    }

    return (
      <div className="min-h-screen bg-app-bg text-app-text transition-colors duration-300 font-['Vazirmatn'] selection:bg-[#10b981]/10 selection:text-[#10b981] overflow-x-hidden flex flex-col relative" style={{ direction: 'rtl' }}>
        {/* Global persistent reactive grid background across all public marketing pages */}
        <div className="fixed inset-0 w-full h-full pointer-events-none z-0">
          <ReactiveGridBackground intensity="normal" />
        </div>

        <div className="relative z-10 flex flex-col min-h-screen bg-transparent">
          <MarketingHeader
            theme={theme}
            toggleTheme={toggleTheme}
            marketingRoute={marketingRoute}
            onNavigate={handleNavigate}
            onNavigateToSection={handleNavigateToSection}
            onLoginClick={() => setShowLoginFlow(true)}
            onStartFreeClick={() => setShowLoginFlow(true)}
          />

          {/* Marketing Page Content */}
          <div className="flex-grow">
            <AnimatePresence mode="wait">
              <motion.main
                key={marketingRoute}
                initial={
                  shouldReduceMotion
                    ? { opacity: 0 }
                    : { opacity: 0, y: 12, filter: 'blur(4px)' }
                }
                animate={{
                  opacity: 1,
                  y: 0,
                  filter: 'blur(0px)'
                }}
                exit={
                  shouldReduceMotion
                    ? { opacity: 0 }
                    : { opacity: 0, y: -8, filter: 'blur(3px)' }
                }
                transition={{
                  duration: 0.28,
                  ease: [0.16, 1, 0.3, 1]
                }}
              >
                {marketingRoute === 'features' ? (
                  <FeaturesPage 
                    onLoginClick={() => setShowLoginFlow(true)}
                    onStartFreeClick={() => setShowLoginFlow(true)}
                    onNavigateHome={() => handleNavigate('home')}
                    onNavigateSolutions={() => handleNavigate('solutions')}
                    theme={theme}
                  />
                ) : marketingRoute === 'solutions' ? (
                  <SolutionsPage 
                    onLoginClick={() => setShowLoginFlow(true)}
                    onStartFreeClick={() => setShowLoginFlow(true)}
                    onNavigateHome={() => handleNavigate('home')}
                    onNavigateFeatures={() => handleNavigate('features')}
                  />
                ) : (
                  <LandingPage 
                    onLoginClick={() => setShowLoginFlow(true)} 
                    onStartFreeClick={() => setShowLoginFlow(true)} 
                    onNavigateFeatures={() => handleNavigate('features')}
                    onNavigateSolutions={() => handleNavigate('solutions')}
                  />
                )}
              </motion.main>
            </AnimatePresence>
          </div>
        </div>
      </div>
    );
  }

  // Special full-screen render for internal preview
  if (activeView === 'customer-menu') {
    return (
      <div className="relative bg-slate-200 min-h-screen">
        <button 
          onClick={() => setActiveView(previousView === 'customer-menu' ? 'dashboard' : previousView)}
          className="fixed top-6 right-6 z-50 bg-white text-slate-800 px-4 py-2 rounded-xl shadow-lg font-bold text-xs flex items-center gap-2 hover:bg-slate-50 transition-colors border border-slate-200"
        >
           <X className="w-4 h-4" /> بستن پیش‌نمایش
        </button>
        <CustomerMenu source="PREVIEW_DRAFT" liveElements={canvasElements} theme={theme} toggleTheme={() => setTheme(prev => prev === 'light' ? 'dark' : 'light')} />
      </div>
    );
  }

  return (
    <div className="flex h-screen h-[100dvh] bg-app-bg text-app-text overflow-hidden font-['Vazirmatn'] transition-colors duration-300">
      {/* Mobile Sidebar Backdrop */}
      {isMobileSidebarOpen && (
        <div 
          onClick={() => setIsMobileSidebarOpen(false)}
          className="fixed inset-0 bg-slate-950/40 backdrop-blur-sm z-[45] md:hidden"
        />
      )}

      <Sidebar 
        isCollapsed={isSidebarCollapsed}
        toggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        activeView={activeView}
        onViewChange={(view) => {
          setPreviousView(activeView);
          setActiveView(view);
          setIsMobileSidebarOpen(false); // Close mobile menu after navigation
        }}
        brandColor={brandColor}
        isOpenOnMobile={isMobileSidebarOpen}
        onCloseMobile={() => setIsMobileSidebarOpen(false)}
        onProfileClick={() => setActiveView('settings')}
        onLogout={handleLogout}
        restaurantName={restaurantName}
        restaurantLogo={restaurantLogo}
        isRestaurantOpen={isRestaurantOpen}
      />

      <main className="flex-1 flex flex-col min-w-0">
        <Header 
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          isRestaurantOpen={isRestaurantOpen}
          setIsRestaurantOpen={setIsRestaurantOpen}
          isPublishing={isPublishing}
          onPublish={handlePublish}
          showPublishSuccess={showPublishSuccess}
          notifications={notifications}
          onPreviewShop={handlePreviewShop}
          onViewAllNotifications={() => setActiveView('notifications')}
          brandColor={brandColor}
          onNotificationClick={(n) => {
            setNotifications(prev => prev.map(notif => notif.id === n.id ? { ...notif, read: true } : notif));
            if (n.link) setActiveView(n.link);
          }}
          onMarkRead={(id) => setNotifications(prev => prev.map(notif => notif.id === id ? { ...notif, read: true } : notif))}
          onDelete={(id) => setNotifications(prev => prev.filter(notif => notif.id !== id))}
          theme={theme}
          toggleTheme={() => setTheme(prev => prev === 'light' ? 'dark' : 'light')}
          onMenuToggle={() => setIsMobileSidebarOpen(true)}
        />
        <div className="flex-1 overflow-hidden relative">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={activeView}
              initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 8, filter: 'blur(2px)' }}
              animate={shouldReduceMotion ? { opacity: 1 } : { opacity: 1, y: 0, filter: 'blur(0px)' }}
              exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: -5, filter: 'blur(2px)' }}
              transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="w-full h-full"
            >
              {renderView()}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
};

export default App;
