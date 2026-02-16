
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, Sparkles } from 'lucide-react';
import { ViewState, Notification, ComponentItem } from '../types';
import { SIDEBAR_LINKS, SEARCH_ITEMS } from '../constants';
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
import CustomerMenu from './components/CustomerMenu';
import Sidebar from './components/Sidebar';
import Header from './components/Header';

const INITIAL_NOTIFICATIONS: Notification[] = [
  { id: '1', type: 'order', title: 'سفارش جدید #12895', message: '۲ پیتزا پپرونی، ۱ سالاد سزار - میز ۵', time: '۲ دقیقه پیش', read: false, link: 'orders' },
  { id: '2', type: 'inventory', title: 'هشدار موجودی', message: 'موجودی "نان برگر" به کمتر از ۱۰ عدد رسیده است.', time: '۱ ساعت پیش', read: false, link: 'products' },
];

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeView, setActiveView] = useState<ViewState>('dashboard');
  const [previousView, setPreviousView] = useState<ViewState>('dashboard');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isRestaurantOpen, setIsRestaurantOpen] = useState(true);
  const [isPublishing, setIsPublishing] = useState(false);
  const [showPublishSuccess, setShowPublishSuccess] = useState(false);
  
  // Logout animation state
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  // GLOBAL RESTAURANT INFO
  const [restaurantName, setRestaurantName] = useState(() => {
    return localStorage.getItem('vitrin_restaurant_name') || 'رستوران ایتالیایی لیمو';
  });

  useEffect(() => {
    localStorage.setItem('vitrin_restaurant_name', restaurantName);
  }, [restaurantName]);

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

  const handleLogin = () => { localStorage.setItem('vitrin_auth', 'true'); setIsAuthenticated(true); };

  const handleLogout = () => {
    setIsLoggingOut(true);
    setTimeout(() => {
      localStorage.removeItem('vitrin_auth');
      setIsAuthenticated(false);
      setActiveView('dashboard');
      setIsLoggingOut(false);
    }, 600); // Small delay for fade effect
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
    const url = new URL(window.location.href);
    url.searchParams.set('view', 'customer-menu');
    window.open(url.toString(), '_blank');
  };

  // Notification Handlers
  const handleMarkAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const handleMarkRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const handleDeleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const renderView = () => {
    switch (activeView) {
      case 'dashboard': return <Dashboard restaurantName={restaurantName} searchQuery={searchQuery} />;
      case 'designer': return <CanvasDesigner elements={canvasElements} onElementsChange={setCanvasElements} />;
      case 'products': return <ProductManager />;
      case 'orders': return <OrderBoard />;
      case 'analytics': return <Analytics />;
      case 'settings': return <SettingsPage restaurantName={restaurantName} setRestaurantName={setRestaurantName} />;
      case 'customer-menu': return <CustomerMenu liveElements={canvasElements} />;
      case 'search-results': return <SearchResults query={searchQuery} onBack={() => setActiveView(previousView)} />;
      case 'notification-archive': 
        return (
          <NotificationArchive 
            notifications={notifications}
            onDelete={handleDeleteNotification}
            onClearAll={() => setNotifications([])}
            onMarkRead={(n) => handleMarkRead(n.id)}
            onBack={() => setActiveView(previousView)}
          />
        );
      case 'notifications':
        return (
          <NotificationsView
             notifications={notifications}
             onMarkAllRead={handleMarkAllRead}
             onMarkRead={handleMarkRead}
             onDelete={handleDeleteNotification}
          />
        );
      default: return <div className="p-10 text-center text-slate-400">بخش در حال توسعه</div>;
    }
  };

  const isStandaloneCustomerView = new URLSearchParams(window.location.search).get('view') === 'customer-menu';
  if (isStandaloneCustomerView) return <CustomerMenu />;
  if (!isAuthenticated) return <LoginPage onLogin={handleLogin} />;

  return (
    <div className="flex h-screen bg-slate-50 text-slate-900 overflow-hidden font-['Vazirmatn'] relative">
      <AnimatePresence>
        {isLoggingOut && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-white z-[100] flex items-center justify-center"
          >
            <div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
          </motion.div>
        )}
      </AnimatePresence>

      <Sidebar 
        isCollapsed={isSidebarCollapsed}
        toggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        activeView={activeView}
        onViewChange={(view) => {
          setPreviousView(activeView);
          setActiveView(view);
        }}
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
          onViewAllNotifications={() => setActiveView('notifications')}
        />
        <div className="flex-1 overflow-hidden relative">{renderView()}</div>
      </main>
    </div>
  );
};

export default App;
