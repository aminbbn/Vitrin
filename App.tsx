
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, Sparkles, X, ChevronLeft, ChevronDown } from 'lucide-react';
import { ViewState, Notification, ComponentItem } from './types';
import { SIDEBAR_LINKS, SEARCH_ITEMS } from './constants';
import Dashboard from './components/Dashboard';
import CanvasDesigner from './components/CanvasDesigner';
import ProductManager from './components/ProductManager';
import OrderBoard from './components/OrderBoard';
import Analytics from './components/Analytics';
import SettingsPage from './components/Settings';
import LoginPage from './components/LoginPage';
import SearchResults from './components/SearchResults';
import NotificationArchive from './components/NotificationArchive';
import NotificationsView from './components/NotificationsView';
import CategoryManager from './components/CategoryManager';
import CustomerMenu from './components/CustomerMenu';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import { LandingPage } from './components/LandingPage';
import { FeaturesPage } from './components/FeaturesPage';
import { SolutionsPage } from './components/SolutionsPage';

const INITIAL_NOTIFICATIONS: Notification[] = [
  { id: '1', type: 'order', title: 'سفارش جدید #12895', message: '۲ پیتزا پپرونی، ۱ سالاد سزار - میز ۵', time: '۲ دقیقه پیش', read: false, link: 'orders' },
];

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showLoginFlow, setShowLoginFlow] = useState(false);
  const [marketingRoute, setMarketingRoute] = useState<'home' | 'features' | 'solutions'>('home');
  const [activeDropdown, setActiveDropdown] = useState<'features' | 'solutions' | null>(null);
  const [activeView, setActiveView] = useState<ViewState>('dashboard');
  const [previousView, setPreviousView] = useState<ViewState>('dashboard');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isRestaurantOpen, setIsRestaurantOpen] = useState(true);
  const [isPublishing, setIsPublishing] = useState(false);
  const [showPublishSuccess, setShowPublishSuccess] = useState(false);
  
  // Responsive Mobile Sidebar State
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  // Dark/Light Theme State
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    return (localStorage.getItem('vitrin_theme') as 'light' | 'dark') || 'light';
  });

  useEffect(() => {
    localStorage.setItem('vitrin_theme', theme);
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  // GLOBAL RESTAURANT INFO
  const [restaurantName, setRestaurantName] = useState(() => {
    return localStorage.getItem('vitrin_restaurant_name') || 'رستوران ایتالیایی لیمو';
  });

  const [restaurantLogo, setRestaurantLogo] = useState(() => {
    return localStorage.getItem('vitrin_restaurant_logo') || '';
  });

  const [brandColor, setBrandColor] = useState(() => {
    return localStorage.getItem('vitrin_brand_color') || 'emerald';
  });

  useEffect(() => {
    localStorage.setItem('vitrin_restaurant_name', restaurantName);
  }, [restaurantName]);

  useEffect(() => {
    localStorage.setItem('vitrin_restaurant_logo', restaurantLogo);
  }, [restaurantLogo]);

  useEffect(() => {
    localStorage.setItem('vitrin_brand_color', brandColor);
  }, [brandColor]);

  // SHARED CANVAS STATE
  const [canvasElements, setCanvasElements] = useState<ComponentItem[]>(() => {
    const savedDraft = localStorage.getItem('vitrin_designer_draft');
    return savedDraft ? JSON.parse(savedDraft) : [];
  });

  useEffect(() => {
    localStorage.setItem('vitrin_designer_draft', JSON.stringify(canvasElements));
  }, [canvasElements]);

  // Search State
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [highlightedItemId, setHighlightedItemId] = useState<string | null>(null);

  // Notification State
  const [notifications, setNotifications] = useState<Notification[]>(INITIAL_NOTIFICATIONS);

  useEffect(() => {
    const auth = localStorage.getItem('vitrin_auth');
    if (auth === 'true') setIsAuthenticated(true);
  }, []);

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

  const handleLogin = (name?: string) => { 
    localStorage.setItem('vitrin_auth', 'true'); 
    if (name) {
      setRestaurantName(name);
      localStorage.setItem('vitrin_restaurant_name', name);
    }
    setIsAuthenticated(true); 
  };

  const handleLogout = () => {
    localStorage.removeItem('vitrin_auth');
    setIsAuthenticated(false);
    setActiveView('dashboard');
  };

  const handlePublish = () => {
    setIsPublishing(true);
    localStorage.setItem('vitrin_published_design', JSON.stringify(canvasElements));
    setTimeout(() => {
      setIsPublishing(false);
      setShowPublishSuccess(true);
      setTimeout(() => setShowPublishSuccess(false), 3000);
    }, 1500);
  };

  const handlePreviewShop = () => {
    setPreviousView(activeView);
    setActiveView('customer-menu');
  };

  const renderView = () => {
    switch (activeView) {
      case 'dashboard': return <Dashboard restaurantName={restaurantName} searchQuery={searchQuery} brandColor={brandColor} theme={theme} />;
      case 'designer': return <CanvasDesigner elements={canvasElements} onElementsChange={setCanvasElements} brandColor={brandColor} />;
      case 'products': return <ProductManager brandColor={brandColor} highlightedItemId={highlightedItemId} clearHighlight={() => setHighlightedItemId(null)} />;
      case 'categories': return <CategoryManager brandColor={brandColor} />;
      case 'orders': return <OrderBoard brandColor={brandColor} highlightedItemId={highlightedItemId} clearHighlight={() => setHighlightedItemId(null)} />;
      case 'analytics': return <Analytics brandColor={brandColor} theme={theme} />;
      case 'settings': 
        return (
          <SettingsPage 
            restaurantName={restaurantName} 
            setRestaurantName={setRestaurantName} 
            restaurantLogo={restaurantLogo}
            setRestaurantLogo={setRestaurantLogo}
            brandColor={brandColor}
            setBrandColor={setBrandColor}
          />
        );
      case 'customer-menu': return <CustomerMenu liveElements={canvasElements} theme={theme} toggleTheme={() => setTheme(prev => prev === 'light' ? 'dark' : 'light')} />;
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
  
  if (!isAuthenticated) {
    if (showLoginFlow) {
      return (
        <LoginPage 
          onLogin={handleLogin} 
          brandColor={brandColor} 
          onBackToLanding={() => setShowLoginFlow(false)} 
        />
      );
    }
    const navigateAndScroll = (route: 'home' | 'features' | 'solutions', hash?: string) => {
      setMarketingRoute(route);
      setActiveDropdown(null);
      if (hash) {
        setTimeout(() => {
          const element = document.getElementById(hash);
          if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        }, 150);
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    };

    return (
      <div className="min-h-screen bg-[#F7F7F8] text-[#18181B] font-['Vazirmatn'] selection:bg-[#10b981]/10 selection:text-[#10b981] overflow-x-hidden flex flex-col" style={{ direction: 'rtl' }}>
        {/* Unified Top Sticky Navigation */}
        <nav id="marketing-navbar" className="sticky top-0 z-50 bg-[#0A0A0A]/95 backdrop-blur-md border-b border-white/10 px-6 py-4 text-white shadow-lg shrink-0">
          <div className="max-w-7xl mx-auto w-full flex items-center justify-between">
            
            {/* Logo Section (Right Side in RTL) */}
            <div className="flex items-center gap-3">
              <button 
                onClick={() => navigateAndScroll('home')}
                className="flex items-center gap-3 text-right group focus:outline-none focus:ring-2 focus:ring-[#10b981]/30 rounded-xl p-1 bg-transparent border-0 cursor-pointer text-white"
              >
                <div className="w-10 h-10 bg-[#10b981] rounded-xl flex items-center justify-center shadow-lg shadow-[#10b981]/20 group-hover:scale-105 transition-transform">
                  <span className="text-white font-black text-xl tracking-tighter">وی</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-lg font-black tracking-tight leading-none text-white">ویترین</span>
                  <span className="text-[9px] uppercase tracking-[0.15em] font-medium text-[#71717A] mt-0.5">STUDIO PLATFORM</span>
                </div>
              </button>
            </div>

            {/* Fixed Center Navigation Links with Dropdowns */}
            <div className="hidden md:flex items-center gap-6">
              {/* صفحه اصلی */}
              <button 
                onClick={() => navigateAndScroll('home')}
                className={`text-sm font-bold px-3 py-1.5 rounded-lg transition-all border-0 bg-transparent cursor-pointer ${marketingRoute === 'home' ? 'text-[#10b981]' : 'text-slate-400 hover:text-white'}`}
              >
                صفحه اصلی
              </button>

              {/* امکانات ▾ */}
              <div 
                className="relative"
                onMouseEnter={() => setActiveDropdown('features')}
                onMouseLeave={() => setActiveDropdown(null)}
              >
                <button 
                  onClick={() => navigateAndScroll('features')}
                  className={`text-sm font-bold px-3 py-1.5 rounded-lg transition-all border-0 bg-transparent cursor-pointer flex items-center gap-1 ${marketingRoute === 'features' ? 'text-[#10b981]' : 'text-slate-400 hover:text-white'}`}
                >
                  امکانات
                  <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${activeDropdown === 'features' ? 'rotate-180' : ''}`} />
                </button>
                
                <AnimatePresence>
                  {activeDropdown === 'features' && (
                    <motion.div 
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.95 }}
                      transition={{ duration: 0.15, ease: 'easeOut' }}
                      className="absolute right-0 top-full mt-2 w-64 bg-[#0A0A0A] border border-white/10 rounded-2xl shadow-2xl p-2.5 z-[100] text-right"
                    >
                      <button 
                        onClick={() => navigateAndScroll('features')}
                        className="w-full text-right px-4 py-2.5 rounded-xl text-xs font-black text-slate-100 hover:text-[#10b981] hover:bg-white/5 transition-all cursor-pointer border-0 bg-transparent block"
                      >
                        امکانات فوق‌پیشرفته (نمای کلی)
                      </button>
                      <div className="h-[1px] bg-white/10 my-1.5" />
                      <button 
                        onClick={() => navigateAndScroll('features', 'studio')}
                        className="w-full text-right px-4 py-2.5 rounded-xl text-xs font-bold text-slate-300 hover:text-[#10b981] hover:bg-white/5 transition-all cursor-pointer border-0 bg-transparent block"
                      >
                        استودیو طراحی زنده
                      </button>
                      <button 
                        onClick={() => navigateAndScroll('features', 'products')}
                        className="w-full text-right px-4 py-2.5 rounded-xl text-xs font-bold text-slate-300 hover:text-[#10b981] hover:bg-white/5 transition-all cursor-pointer border-0 bg-transparent block"
                      >
                        سیستم مدیریت منو و غذاها
                      </button>
                      <button 
                        onClick={() => navigateAndScroll('features', 'flow')}
                        className="w-full text-right px-4 py-2.5 rounded-xl text-xs font-bold text-slate-300 hover:text-[#10b981] hover:bg-white/5 transition-all cursor-pointer border-0 bg-transparent block"
                      >
                        شبیه‌ساز سفارش مشتری
                      </button>
                      <button 
                        onClick={() => navigateAndScroll('features', 'orders')}
                        className="w-full text-right px-4 py-2.5 rounded-xl text-xs font-bold text-slate-300 hover:text-[#10b981] hover:bg-white/5 transition-all cursor-pointer border-0 bg-transparent block"
                      >
                        داشبورد سفارشات هوشمند
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* راهکارها ▾ */}
              <div 
                className="relative"
                onMouseEnter={() => setActiveDropdown('solutions')}
                onMouseLeave={() => setActiveDropdown(null)}
              >
                <button 
                  onClick={() => navigateAndScroll('solutions')}
                  className={`text-sm font-bold px-3 py-1.5 rounded-lg transition-all border-0 bg-transparent cursor-pointer flex items-center gap-1 ${marketingRoute === 'solutions' ? 'text-[#10b981]' : 'text-slate-400 hover:text-white'}`}
                >
                  راهکارها
                  <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${activeDropdown === 'solutions' ? 'rotate-180' : ''}`} />
                </button>
                
                <AnimatePresence>
                  {activeDropdown === 'solutions' && (
                    <motion.div 
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.95 }}
                      transition={{ duration: 0.15, ease: 'easeOut' }}
                      className="absolute right-0 top-full mt-2 w-64 bg-[#0A0A0A] border border-white/10 rounded-2xl shadow-2xl p-2.5 z-[100] text-right"
                    >
                      <button 
                        onClick={() => navigateAndScroll('solutions')}
                        className="w-full text-right px-4 py-2.5 rounded-xl text-xs font-black text-slate-100 hover:text-[#10b981] hover:bg-white/5 transition-all cursor-pointer border-0 bg-transparent block"
                      >
                        راهکارهای اختصاصی (نمای کلی)
                      </button>
                      <div className="h-[1px] bg-white/10 my-1.5" />
                      <button 
                        onClick={() => navigateAndScroll('solutions', 'solutions-tabs')}
                        className="w-full text-right px-4 py-2.5 rounded-xl text-xs font-bold text-slate-300 hover:text-[#10b981] hover:bg-white/5 transition-all cursor-pointer border-0 bg-transparent block"
                      >
                        طبقه‌بندی بر اساس صنف
                      </button>
                      <button 
                        onClick={() => navigateAndScroll('solutions', 'demo-form')}
                        className="w-full text-right px-4 py-2.5 rounded-xl text-xs font-bold text-slate-300 hover:text-[#10b981] hover:bg-white/5 transition-all cursor-pointer border-0 bg-transparent block"
                      >
                        ثبت درخواست دمو آنلاین
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* درخواست دمو و تماس */}
              <button 
                onClick={() => {
                  if (marketingRoute === 'solutions') {
                    navigateAndScroll('solutions', 'demo-form');
                  } else {
                    navigateAndScroll('home', 'contact');
                  }
                }}
                className="text-sm font-bold text-slate-400 hover:text-[#10b981] transition-colors cursor-pointer bg-transparent border-0"
              >
                درخواست دمو و تماس
              </button>
            </div>

            {/* Left Buttons Group */}
            <div className="flex items-center gap-3">
              <button 
                id="nav-login-btn"
                onClick={() => setShowLoginFlow(true)}
                className="px-4 py-2.5 rounded-xl text-sm font-bold text-white hover:bg-white/5 border border-transparent active:scale-95 focus:outline-none focus:ring-2 focus:ring-white/20 transition-all cursor-pointer bg-transparent"
              >
                ورود به پنل
              </button>
              <button 
                id="nav-start-free-btn"
                onClick={() => setShowLoginFlow(true)}
                className="px-5 py-2.5 bg-[#10b981] hover:bg-[#10b981]/90 text-white rounded-xl text-sm font-black shadow-lg shadow-[#10b981]/20 hover:shadow-xl hover:shadow-[#10b981]/30 active:scale-95 focus:outline-none focus:ring-2 focus:ring-[#10b981]/40 transition-all cursor-pointer flex items-center gap-2 group border-0"
              >
                شروع رایگان
                <span className="w-5 h-5 rounded-full bg-white/10 flex items-center justify-center transition-transform group-hover:translate-x-[-2px]">
                  <ChevronLeft className="w-3 h-3 text-white" />
                </span>
              </button>
            </div>
          </div>
        </nav>

        {/* Marketing Page Content */}
        <div className="flex-grow">
          {marketingRoute === 'features' ? (
            <FeaturesPage 
              onLoginClick={() => setShowLoginFlow(true)}
              onStartFreeClick={() => setShowLoginFlow(true)}
              onNavigateHome={() => setMarketingRoute('home')}
              onNavigateSolutions={() => setMarketingRoute('solutions')}
            />
          ) : marketingRoute === 'solutions' ? (
            <SolutionsPage 
              onLoginClick={() => setShowLoginFlow(true)}
              onStartFreeClick={() => setShowLoginFlow(true)}
              onNavigateHome={() => setMarketingRoute('home')}
              onNavigateFeatures={() => setMarketingRoute('features')}
            />
          ) : (
            <LandingPage 
              onLoginClick={() => setShowLoginFlow(true)} 
              onStartFreeClick={() => setShowLoginFlow(true)} 
              onNavigateFeatures={() => setMarketingRoute('features')}
              onNavigateSolutions={() => setMarketingRoute('solutions')}
            />
          )}
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
        <CustomerMenu liveElements={canvasElements} theme={theme} toggleTheme={() => setTheme(prev => prev === 'light' ? 'dark' : 'light')} />
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 overflow-hidden font-['Vazirmatn'] transition-colors duration-300">
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
          onProfileClick={() => setActiveView('settings')}
          onLogout={handleLogout}
          restaurantName={restaurantName}
          restaurantLogo={restaurantLogo}
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
        <div className="flex-1 overflow-hidden relative">{renderView()}</div>
      </main>
    </div>
  );
};

export default App;
