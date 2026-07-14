
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
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
import { ScrollProgress } from './components/MotionSystem';
import { MarketingHeader } from './components/MarketingHeader';
import { useTheme } from './components/ThemeProvider';

const INITIAL_NOTIFICATIONS: Notification[] = [
  { id: '1', type: 'order', title: 'سفارش جدید #12895', message: '2 پیتزا پپرونی، 1 سالاد سزار - میز 5', time: '2 دقیقه پیش', read: false, link: 'orders' },
];

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
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

    return (
      <div className="min-h-screen bg-app-bg text-app-text transition-colors duration-300 font-['Vazirmatn'] selection:bg-[#10b981]/10 selection:text-[#10b981] overflow-x-hidden flex flex-col" style={{ direction: 'rtl' }}>
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
    <div className="flex h-screen bg-app-bg text-app-text overflow-hidden font-['Vazirmatn'] transition-colors duration-300">
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
