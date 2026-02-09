
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Bell, 
  ChevronRight, 
  ChevronLeft, 
  Search, 
  Globe, 
  User, 
  Power,
  ConciergeBell,
  CheckCircle2,
  X,
  Package,
  ClipboardList,
  Users,
  LogOut,
  CheckCheck,
  AlertTriangle,
  Info,
  ShoppingBag,
  Settings,
  Lock,
  CreditCard,
  Eye,
  ExternalLink
} from 'lucide-react';
import { ViewState, Notification } from './types';
import { SIDEBAR_LINKS, SEARCH_ITEMS } from './constants';
import Dashboard from './components/Dashboard';
import CanvasDesigner from './components/CanvasDesigner';
import ProductManager from './components/ProductManager';
import OrderBoard from './components/OrderBoard';
import Analytics from './components/Analytics';
import SettingsPage from './components/Settings'; // Renamed to avoid conflict with icon
import LoginPage from './components/LoginPage';
import SearchResults from './components/SearchResults';
import NotificationArchive from './components/NotificationArchive';
import CustomerMenu from './components/CustomerMenu';

const INITIAL_NOTIFICATIONS: Notification[] = [
  { 
    id: '1', 
    type: 'order', 
    title: 'سفارش جدید #12895', 
    message: '۲ پیتزا پپرونی، ۱ سالاد سزار - میز ۵', 
    time: '۲ دقیقه پیش', 
    read: false, 
    link: 'orders' 
  },
  { 
    id: '2', 
    type: 'inventory', 
    title: 'هشدار موجودی', 
    message: 'موجودی "نان برگر" به کمتر از ۱۰ عدد رسیده است.', 
    time: '۱ ساعت پیش', 
    read: false, 
    link: 'products' 
  },
  { 
    id: '3', 
    type: 'system', 
    title: 'بروزرسانی سیستم', 
    message: 'نسخه جدید ۴.۲ با قابلیت‌های جدید در دسترس است.', 
    time: '۱ روز پیش', 
    read: true, 
    link: 'settings' 
  },
  { 
    id: '4', 
    type: 'order', 
    title: 'سفارش جدید #12896', 
    message: '۱ استیک ریب‌آی - بیرون‌بر', 
    time: '۵ دقیقه پیش', 
    read: false, 
    link: 'orders' 
  },
];

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeView, setActiveView] = useState<ViewState>('designer');
  const [previousView, setPreviousView] = useState<ViewState>('dashboard');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isRestaurantOpen, setIsRestaurantOpen] = useState(true);
  const [isPublishing, setIsPublishing] = useState(false);
  const [showPublishSuccess, setShowPublishSuccess] = useState(false);

  // Search State
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [quickResults, setQuickResults] = useState<any[]>([]);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  // Notification State
  const [notifications, setNotifications] = useState<Notification[]>(INITIAL_NOTIFICATIONS);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const notificationRef = useRef<HTMLDivElement>(null);

  // Profile State
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Check for query param to force view (e.g. for previewing customer menu)
    const urlParams = new URLSearchParams(window.location.search);
    const viewParam = urlParams.get('view');
    if (viewParam === 'customer-menu') {
       setActiveView('customer-menu');
       // In a real app we might want to skip authentication for public menu, 
       // but here we just bypass the auth check visually or set it true.
       setIsAuthenticated(true);
       return;
    }

    const auth = localStorage.getItem('vitrin_auth');
    if (auth === 'true') {
      setIsAuthenticated(true);
    }
  }, []);

  // Debounce Logic
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Search Filtering Logic for Dropdown
  useEffect(() => {
    if (debouncedQuery.trim()) {
      const results = SEARCH_ITEMS.filter(item => 
        item.title.toLowerCase().includes(debouncedQuery.toLowerCase()) || 
        item.subtitle.toLowerCase().includes(debouncedQuery.toLowerCase()) ||
        item.id.toLowerCase().includes(debouncedQuery.toLowerCase())
      );
      setQuickResults(results.slice(0, 5)); // Limit to 5 for dropdown
    } else {
      setQuickResults([]);
    }
  }, [debouncedQuery]);

  // Click Outside to Close Dropdowns
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
        setIsSearchFocused(false);
      }
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setIsNotificationsOpen(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogin = () => {
    localStorage.setItem('vitrin_auth', 'true');
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('vitrin_auth');
    setIsAuthenticated(false);
  };

  const handlePublish = () => {
    setIsPublishing(true);
    setTimeout(() => {
      setIsPublishing(false);
      setShowPublishSuccess(true);
      setTimeout(() => setShowPublishSuccess(false), 3000);
    }, 2000);
  };

  const handlePreviewShop = () => {
    const url = new URL(window.location.href);
    url.searchParams.set('view', 'customer-menu');
    window.open(url.toString(), '_blank');
  };

  const handleSearchKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && searchQuery.trim()) {
      if (activeView !== 'search-results') {
        setPreviousView(activeView);
      }
      setActiveView('search-results');
      setIsSearchFocused(false);
    }
  };

  const clearSearch = () => {
    setSearchQuery('');
    setDebouncedQuery('');
    setQuickResults([]);
    if (activeView === 'search-results') {
      setActiveView(previousView);
    }
  };

  // Notification Actions
  const unreadCount = notifications.filter(n => !n.read).length;

  const handleMarkAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const handleNotificationClick = (notification: Notification) => {
    setNotifications(prev => prev.map(n => n.id === notification.id ? ({ ...n, read: true }) : n));
    if (notification.link) {
      setActiveView(notification.link);
    }
    setIsNotificationsOpen(false);
  };

  const handleDeleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const handleClearAllNotifications = () => {
    setNotifications([]);
  };

  const renderView = () => {
    switch (activeView) {
      case 'dashboard': return <Dashboard />;
      case 'designer': return <CanvasDesigner />;
      case 'products': return <ProductManager />;
      case 'orders': return <OrderBoard />;
      case 'analytics': return <Analytics />;
      case 'settings': return <SettingsPage />;
      case 'customer-menu': return <CustomerMenu />;
      case 'search-results': return <SearchResults query={searchQuery} onBack={() => setActiveView(previousView)} />;
      case 'notification-archive': 
        return (
          <NotificationArchive 
            notifications={notifications}
            onDelete={handleDeleteNotification}
            onClearAll={handleClearAllNotifications}
            onMarkRead={handleNotificationClick}
            onBack={() => setActiveView(previousView)}
          />
        );
      default: return (
        <div className="flex items-center justify-center h-full text-slate-400 bg-white m-6 rounded-2xl border border-dashed border-slate-200">
          این بخش در حال توسعه است
        </div>
      );
    }
  };

  // If viewing customer menu directly (via query param), render just that without admin layout
  // Note: We check this inside render but ideally we should conditionally render the Layout vs FullPage.
  // For simplicity within this structure, if activeView is 'customer-menu' AND we are in the 'popup' mode (detected via URL), we might want to hide sidebar/header.
  // Let's check URL again or just rely on state. 
  // However, the prompt asked for "Preview Shop" button action.
  // If the user navigates via sidebar to 'customer-menu', they see it inside the dashboard (as per previous change).
  // If they click "Preview Shop", it opens a new tab. In that new tab, we probably want a full screen view.
  // Let's modify the render to hide sidebar/header if query param view=customer-menu exists.
  
  const isStandaloneCustomerView = new URLSearchParams(window.location.search).get('view') === 'customer-menu';

  if (isStandaloneCustomerView) {
     return <CustomerMenu />;
  }

  if (!isAuthenticated) {
    return <LoginPage onLogin={handleLogin} />;
  }

  return (
    <div className="flex h-screen bg-slate-50 text-slate-900 overflow-hidden font-['Vazirmatn']">
      {/* Global Sidebar */}
      <motion.aside 
        initial={false}
        animate={{ width: isSidebarCollapsed ? 80 : 260 }}
        className="bg-white border-l border-slate-200 flex flex-col z-50 shadow-sm"
      >
        <div className="p-6 flex items-center justify-between overflow-hidden whitespace-nowrap">
          {!isSidebarCollapsed && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-center gap-2"
            >
              <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-emerald-200">
                <ConciergeBell className="w-6 h-6" />
              </div>
              <span className="text-xl font-black text-emerald-900 tracking-tight">ویترین</span>
            </motion.div>
          )}
          {isSidebarCollapsed && (
             <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-emerald-200 mx-auto">
              <ConciergeBell className="w-6 h-6" />
            </div>
          )}
        </div>

        <nav className="flex-1 px-4 space-y-2 mt-4">
          {SIDEBAR_LINKS.map((link) => (
            <button
              key={link.id}
              onClick={() => setActiveView(link.id as ViewState)}
              className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-200 group ${
                activeView === link.id 
                  ? 'bg-emerald-50 text-emerald-700 font-bold' 
                  : 'text-slate-500 hover:bg-slate-50 hover:text-slate-700'
              }`}
            >
              <div className={`${activeView === link.id ? 'text-emerald-600' : 'text-slate-400 group-hover:text-slate-600'}`}>
                {link.icon}
              </div>
              {!isSidebarCollapsed && (
                <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }}>{link.label}</motion.span>
              )}
            </button>
          ))}
        </nav>

        <div className="p-4">
           <button 
            onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
            className="w-full flex items-center justify-center p-2 rounded-lg bg-slate-100 text-slate-500 hover:bg-slate-200 transition-colors"
          >
            {isSidebarCollapsed ? <ChevronLeft className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
          </button>
        </div>
      </motion.aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="h-20 bg-white border-b border-slate-200 flex items-center justify-between px-8 z-40 relative">
          <div className="flex items-center gap-6 flex-1 max-w-xl">
            {/* Functional Search Bar */}
            <div className="relative w-full max-w-sm" ref={searchContainerRef}>
              <Search className="w-5 h-5 absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input 
                type="text" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setIsSearchFocused(true)}
                onKeyDown={handleSearchKeyDown}
                placeholder="جستجو (محصول، سفارش، مشتری)..." 
                className="bg-slate-100 border-none rounded-full pr-10 pl-10 py-2.5 w-full text-sm focus:ring-2 focus:ring-emerald-500/20 focus:bg-white outline-none transition-all"
              />
              
              {searchQuery && (
                <button 
                  onClick={clearSearch}
                  className="absolute left-3 top-1/2 -translate-y-1/2 p-0.5 rounded-full hover:bg-slate-200 text-slate-400 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              )}

              {/* Quick Results Dropdown */}
              <AnimatePresence>
                {isSearchFocused && searchQuery.trim() && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    transition={{ duration: 0.15 }}
                    className="absolute top-full right-0 w-full mt-2 bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden z-50"
                  >
                    <div className="p-3 bg-slate-50 border-b border-slate-100 text-xs font-bold text-slate-500">
                      نتایج پیشنهادی
                    </div>
                    
                    {quickResults.length > 0 ? (
                      <div className="py-2">
                        {quickResults.map((item) => (
                          <div 
                            key={item.id}
                            onClick={() => {
                              if (activeView !== 'search-results') setPreviousView(activeView);
                              setActiveView('search-results');
                              setSearchQuery(item.title);
                              setIsSearchFocused(false);
                            }}
                            className="px-4 py-3 hover:bg-emerald-50 cursor-pointer flex items-center gap-3 group transition-colors"
                          >
                             <div className={`p-2 rounded-lg ${
                                item.type === 'product' ? 'bg-orange-50 text-orange-600' :
                                item.type === 'order' ? 'bg-blue-50 text-blue-600' :
                                'bg-purple-50 text-purple-600'
                             }`}>
                                {item.type === 'product' && <Package className="w-4 h-4" />}
                                {item.type === 'order' && <ClipboardList className="w-4 h-4" />}
                                {item.type === 'customer' && <Users className="w-4 h-4" />}
                             </div>
                             <div className="flex-1">
                                <h4 className="text-sm font-bold text-slate-800 group-hover:text-emerald-700">{item.title}</h4>
                                <span className="text-[10px] text-slate-400">{item.subtitle}</span>
                             </div>
                             <div className="text-[10px] font-medium text-slate-400 bg-slate-100 px-2 py-1 rounded-lg">
                                {item.type === 'product' ? 'محصول' : item.type === 'order' ? 'سفارش' : 'مشتری'}
                             </div>
                          </div>
                        ))}
                        <div 
                          className="px-4 py-3 text-center border-t border-slate-50 cursor-pointer hover:bg-slate-50 text-xs font-bold text-emerald-600"
                          onClick={() => {
                            if (activeView !== 'search-results') setPreviousView(activeView);
                            setActiveView('search-results');
                            setIsSearchFocused(false);
                          }}
                        >
                          مشاهده همه نتایج
                        </div>
                      </div>
                    ) : (
                      <div className="p-8 text-center text-slate-400 text-xs">
                         موردی یافت نشد.
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3 bg-slate-50 px-3 py-1.5 rounded-full border border-slate-100">
              <div className={`w-2 h-2 rounded-full ${isRestaurantOpen ? 'bg-emerald-500' : 'bg-red-500'} animate-pulse`} />
              <span className="text-sm font-medium text-slate-600">
                رستوران {isRestaurantOpen ? 'باز است' : 'بسته است'}
              </span>
              <button 
                onClick={() => setIsRestaurantOpen(!isRestaurantOpen)}
                className="p-1 hover:bg-slate-200 rounded-md transition-colors"
              >
                <Power className="w-4 h-4 text-slate-400" />
              </button>
            </div>

            <div className="h-8 w-[1px] bg-slate-200 mx-2" />

            {/* Preview Shop Button */}
            <button 
               onClick={handlePreviewShop}
               className="p-2.5 rounded-full text-slate-500 hover:text-emerald-600 hover:bg-emerald-50 transition-all relative group"
               title="مشاهده فروشگاه"
            >
               <Eye className="w-5 h-5" />
               <span className="absolute top-full mt-2 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-[10px] py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50">
                  مشاهده فروشگاه
               </span>
            </button>

            <button 
              onClick={handlePublish}
              disabled={isPublishing}
              className={`relative px-6 py-2.5 rounded-full text-sm font-bold flex items-center gap-2 transition-all ${
                isPublishing 
                  ? 'bg-emerald-100 text-emerald-800 cursor-not-allowed' 
                  : 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-md shadow-emerald-100 hover:scale-105 active:scale-95'
              }`}
            >
              {isPublishing ? (
                <>
                  <svg className="animate-spin h-4 w-4 text-emerald-600" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  در حال انتشار...
                </>
              ) : (
                'انتشار تغییرات'
              )}
              
              <AnimatePresence>
                {showPublishSuccess && (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.5, y: 10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.5 }}
                    className="absolute -bottom-12 right-0 bg-slate-900 text-white px-4 py-2 rounded-lg flex items-center gap-2 whitespace-nowrap shadow-xl z-50"
                  >
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    تغییرات با موفقیت منتشر شد
                  </motion.div>
                )}
              </AnimatePresence>
            </button>

            {/* Notification Bell */}
            <div className="relative" ref={notificationRef}>
              <button 
                onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                className={`p-2 rounded-full relative transition-colors ${isNotificationsOpen ? 'bg-emerald-50 text-emerald-600' : 'text-slate-500 hover:bg-slate-100'}`}
              >
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-red-500 rounded-full border-2 border-white flex items-center justify-center text-[9px] font-bold text-white">
                    {unreadCount > 9 ? '+9' : unreadCount}
                  </span>
                )}
              </button>

              {/* Notification Dropdown */}
              <AnimatePresence>
                {isNotificationsOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    transition={{ duration: 0.15 }}
                    className="absolute top-full left-0 mt-3 w-80 bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden z-50 origin-top-left"
                  >
                    {/* Header */}
                    <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                      <h3 className="font-bold text-slate-800 text-sm">اعلان‌ها</h3>
                      {unreadCount > 0 && (
                        <button 
                          onClick={handleMarkAllRead}
                          className="text-[10px] font-bold text-emerald-600 hover:text-emerald-700 flex items-center gap-1"
                        >
                          <CheckCheck className="w-3 h-3" />
                          خوانده‌شدن همه
                        </button>
                      )}
                    </div>

                    {/* List */}
                    <div className="max-h-[320px] overflow-y-auto">
                      {notifications.length > 0 ? (
                        notifications.slice(0, 5).map((notification) => (
                          <div 
                            key={notification.id}
                            onClick={() => handleNotificationClick(notification)}
                            className={`p-4 border-b border-slate-50 last:border-0 hover:bg-slate-50 transition-colors cursor-pointer group relative ${!notification.read ? 'bg-slate-50/60' : ''}`}
                          >
                            <div className="flex items-start gap-3">
                              {/* Icon Indicator */}
                              <div className={`w-2 h-2 rounded-full mt-2 shrink-0 ${
                                notification.type === 'order' ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.4)]' : 
                                notification.type === 'inventory' ? 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.4)]' : 
                                'bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.4)]'
                              }`} />
                              
                              <div className="flex-1">
                                <div className="flex justify-between items-start mb-1">
                                  <h4 className={`text-xs font-bold ${!notification.read ? 'text-slate-800' : 'text-slate-600'}`}>
                                    {notification.title}
                                  </h4>
                                  <span className="text-[9px] text-slate-400">{notification.time}</span>
                                </div>
                                <p className={`text-[11px] leading-relaxed line-clamp-2 ${!notification.read ? 'text-slate-600 font-medium' : 'text-slate-400'}`}>
                                  {notification.message}
                                </p>
                              </div>
                            </div>
                            {!notification.read && (
                              <div className="absolute right-0 top-0 bottom-0 w-0.5 bg-emerald-500" />
                            )}
                          </div>
                        ))
                      ) : (
                        <div className="p-8 text-center text-slate-400">
                          <Bell className="w-8 h-8 mx-auto mb-2 opacity-20" />
                          <p className="text-xs font-medium">هیچ اعلان جدیدی ندارید</p>
                        </div>
                      )}
                    </div>

                    {/* Footer */}
                    <div className="p-2 border-t border-slate-100 bg-slate-50/30 text-center">
                      <button 
                        onClick={() => {
                          if (activeView !== 'notification-archive') setPreviousView(activeView);
                          setActiveView('notification-archive');
                          setIsNotificationsOpen(false);
                        }}
                        className="text-[10px] font-bold text-slate-500 hover:text-emerald-600 transition-colors py-1 w-full"
                      >
                        مشاهده آرشیو کامل
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
              
            {/* User Profile */}
            <div 
              className="relative flex items-center gap-3 pr-2 border-r border-slate-200 mr-2 cursor-pointer group"
              ref={profileRef}
              onMouseEnter={() => setIsProfileOpen(true)}
              onMouseLeave={() => setIsProfileOpen(false)}
              onClick={() => setIsProfileOpen(!isProfileOpen)}
            >
              <div className="text-left hidden md:block">
                <h4 className="text-sm font-bold text-slate-800 group-hover:text-emerald-700 transition-colors">مدیر رستوران</h4>
                <span className="text-[10px] text-slate-400 block group-hover:text-emerald-500/70 transition-colors">شعبه مرکزی</span>
              </div>
              <div className={`w-10 h-10 rounded-full border-2 shadow-sm flex items-center justify-center overflow-hidden transition-all ${isProfileOpen ? 'border-emerald-500 ring-2 ring-emerald-500/20 bg-emerald-50' : 'bg-slate-200 border-white'}`}>
                  <User className={`w-5 h-5 ${isProfileOpen ? 'text-emerald-600' : 'text-slate-400'}`} />
              </div>

              {/* Mini Profile Popover */}
              <AnimatePresence>
                {isProfileOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    transition={{ duration: 0.15 }}
                    className="absolute top-full left-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden z-50 origin-top-left"
                  >
                     <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex items-center gap-3">
                        <div className="w-12 h-12 rounded-full bg-white border-2 border-white shadow-sm flex items-center justify-center overflow-hidden shrink-0">
                           <User className="w-6 h-6 text-slate-300" />
                        </div>
                        <div>
                           <h4 className="font-bold text-slate-800 text-sm">مدیر رستوران</h4>
                           <span className="text-[10px] text-slate-400 font-medium">admin@vitrin.me</span>
                        </div>
                     </div>

                     <div className="p-2 space-y-1">
                        <button 
                           onClick={(e) => {
                             e.stopPropagation();
                             setActiveView('settings');
                             setIsProfileOpen(false);
                           }}
                           className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-slate-50 transition-colors text-xs font-bold text-slate-600 hover:text-emerald-700"
                        >
                           <div className="p-1.5 bg-slate-100 rounded-lg text-slate-500">
                              <Settings className="w-3.5 h-3.5" />
                           </div>
                           تنظیمات حساب
                        </button>
                        <button 
                           onClick={(e) => {
                             e.stopPropagation();
                             setActiveView('settings');
                             setIsProfileOpen(false);
                           }}
                           className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-slate-50 transition-colors text-xs font-bold text-slate-600 hover:text-emerald-700"
                        >
                           <div className="p-1.5 bg-slate-100 rounded-lg text-slate-500">
                              <Lock className="w-3.5 h-3.5" />
                           </div>
                           تغییر رمز عبور
                        </button>
                     </div>

                     <div className="p-2 border-t border-slate-100 mt-1">
                        <button 
                           onClick={(e) => {
                             e.stopPropagation();
                             handleLogout();
                           }}
                           className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-red-50 transition-colors text-xs font-bold text-red-500 hover:text-red-600"
                        >
                           <div className="p-1.5 bg-red-100 rounded-lg text-red-500">
                              <LogOut className="w-3.5 h-3.5" />
                           </div>
                           خروج از حساب
                        </button>
                     </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </header>

        {/* Dynamic View Content */}
        <div className="flex-1 overflow-hidden relative">
          {renderView()}
        </div>
      </main>
    </div>
  );
};

export default App;
