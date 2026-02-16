
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
    const url = new URL(window.location.href);
    url.searchParams.set('view', 'customer-menu');
    window.open(url.toString(), '_blank');
  };

  const renderView = () => {
    switch (activeView) {
      case 'dashboard': return <Dashboard restaurantName={restaurantName} searchQuery={searchQuery} brandColor={brandColor} />;
      case 'designer': return <CanvasDesigner elements={canvasElements} onElementsChange={setCanvasElements} />;
      case 'products': return <ProductManager />;
      case 'orders': return <OrderBoard />;
      case 'analytics': return <Analytics />;
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
      case 'customer-menu': return <CustomerMenu liveElements={canvasElements} />;
      case 'search-results': return <SearchResults query={searchQuery} onBack={() => setActiveView(previousView)} />;
      case 'notification-archive': 
        return (
          <NotificationArchive 
            notifications={notifications}
            onDelete={(id) => setNotifications(prev => prev.filter(n => n.id !== id))}
            onClearAll={() => setNotifications([])}
            onMarkRead={(n) => setNotifications(prev => prev.map(notif => notif.id === n.id ? ({ ...notif, read: true }) : notif))}
            onBack={() => setActiveView(previousView)}
          />
        );
      case 'notifications':
        return (
          <NotificationsView
             notifications={notifications}
             onMarkAllRead={() => setNotifications(prev => prev.map(n => ({ ...n, read: true })))}
             onMarkRead={(id) => setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n))}
             onDelete={(id) => setNotifications(prev => prev.filter(n => n.id !== id))}
          />
        );
      default: return <div className="p-10 text-center text-slate-400">بخش در حال توسعه</div>;
    }
  };

  const isStandaloneCustomerView = new URLSearchParams(window.location.search).get('view') === 'customer-menu';
  if (isStandaloneCustomerView) return <CustomerMenu />;
  if (!isAuthenticated) return <LoginPage onLogin={handleLogin} brandColor={brandColor} />;

  return (
    <div className="flex h-screen bg-slate-50 text-slate-900 overflow-hidden font-['Vazirmatn']">
      <Sidebar 
        isCollapsed={isSidebarCollapsed}
        toggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        activeView={activeView}
        onViewChange={(view) => {
          setPreviousView(activeView);
          setActiveView(view);
        }}
        brandColor={brandColor}
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
        />
        <div className="flex-1 overflow-hidden relative">{renderView()}</div>
      </main>
    </div>
  );
};

export default App;
