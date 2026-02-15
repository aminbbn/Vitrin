
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
  ExternalLink,
  Sparkles
} from 'lucide-react';
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
import CustomerMenu from './components/CustomerMenu';

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
    const auth = localStorage.getItem('vitrin_auth');
    if (auth === 'true') setIsAuthenticated(true);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedQuery(searchQuery), 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  useEffect(() => {
    if (debouncedQuery.trim()) {
      const results = SEARCH_ITEMS.filter(item => 
        item.title.toLowerCase().includes(debouncedQuery.toLowerCase()) || 
        item.subtitle.toLowerCase().includes(debouncedQuery.toLowerCase())
      );
      setQuickResults(results.slice(0, 5));
    } else setQuickResults([]);
  }, [debouncedQuery]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) setIsSearchFocused(false);
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) setIsNotificationsOpen(false);
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) setIsProfileOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogin = () => { localStorage.setItem('vitrin_auth', 'true'); setIsAuthenticated(true); };
  const handleLogout = () => { localStorage.removeItem('vitrin_auth'); setIsAuthenticated(false); };

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
      case 'dashboard': return <Dashboard restaurantName={restaurantName} />;
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
            onDelete={(id) => setNotifications(prev => prev.filter(n => n.id !== id))}
            onClearAll={() => setNotifications([])}
            onMarkRead={(n) => setNotifications(prev => prev.map(notif => notif.id === n.id ? ({ ...notif, read: true }) : notif))}
            onBack={() => setActiveView(previousView)}
          />
        );
      default: return <div className="p-10 text-center text-slate-400">بخش در حال توسعه</div>;
    }
  };

  const isStandaloneCustomerView = new URLSearchParams(window.location.search).get('view') === 'customer-menu';
  if (isStandaloneCustomerView) return <CustomerMenu />;
  if (!isAuthenticated) return <LoginPage onLogin={handleLogin} />;

  return (
    <div className="flex h-screen bg-slate-50 text-slate-900 overflow-hidden font-['Vazirmatn']">
      <motion.aside 
        initial={false}
        animate={{ width: isSidebarCollapsed ? 80 : 260 }}
        className="bg-white border-l border-slate-200 flex flex-col z-50 shadow-sm"
      >
        <div className="p-6 flex items-center justify-between overflow-hidden whitespace-nowrap">
          {!isSidebarCollapsed ? (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-2">
              <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-emerald-200">
                <ConciergeBell className="w-6 h-6" />
              </div>
              <span className="text-xl font-black text-emerald-900 tracking-tight">ویترین</span>
            </motion.div>
          ) : (
            <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-emerald-200 mx-auto">
              <ConciergeBell className="w-6 h-6" />
            </div>
          )}
        </div>
        <nav className="flex-1 px-4 space-y-2 mt-4">
          {SIDEBAR_LINKS.map((link) => (
            <button
              key={link.id}
              onClick={() => { setPreviousView(activeView); setActiveView(link.id as ViewState); }}
              className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-200 group ${
                activeView === link.id ? 'bg-emerald-50 text-emerald-700 font-bold' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-700'
              }`}
            >
              <div className={`${activeView === link.id ? 'text-emerald-600' : 'text-slate-400 group-hover:text-slate-600'}`}>{link.icon}</div>
              {!isSidebarCollapsed && <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }}>{link.label}</motion.span>}
            </button>
          ))}
        </nav>
        <div className="p-4">
           <button onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)} className="w-full flex items-center justify-center p-2 rounded-lg bg-slate-100 text-slate-500 hover:bg-slate-200 transition-colors">
            {isSidebarCollapsed ? <ChevronLeft className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
          </button>
        </div>
      </motion.aside>

      <main className="flex-1 flex flex-col min-w-0">
        <header className="h-20 bg-white border-b border-slate-200 flex items-center justify-between px-8 z-40 relative">
          <div className="flex items-center gap-6 flex-1 max-w-xl">
            <div className="relative w-full max-w-sm" ref={searchContainerRef}>
              <Search className="w-5 h-5 absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input 
                type="text" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setIsSearchFocused(true)}
                placeholder="جستجو (محصول، سفارش، مشتری)..." 
                className="bg-slate-100 border-none rounded-full pr-10 pl-10 py-2.5 w-full text-sm focus:ring-2 focus:ring-emerald-500/20 focus:bg-white outline-none transition-all"
              />
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3 bg-slate-50 px-3 py-1.5 rounded-full border border-slate-100">
              <div className={`w-2 h-2 rounded-full ${isRestaurantOpen ? 'bg-emerald-500' : 'bg-red-500'} animate-pulse`} />
              <span className="text-sm font-medium text-slate-600">رستوران {isRestaurantOpen ? 'باز است' : 'بسته است'}</span>
              <button onClick={() => setIsRestaurantOpen(!isRestaurantOpen)} className="p-1 hover:bg-slate-200 rounded-md transition-colors"><Power className="w-4 h-4 text-slate-400" /></button>
            </div>
            <div className="h-8 w-[1px] bg-slate-200 mx-2" />
            <button onClick={handlePreviewShop} className="p-2.5 rounded-full text-slate-500 hover:text-emerald-600 hover:bg-emerald-50 transition-all relative group" title="مشاهده فروشگاه"><Eye className="w-5 h-5" /></button>
            <button onClick={handlePublish} disabled={isPublishing} className={`relative px-6 py-2.5 rounded-full text-sm font-bold flex items-center gap-2 transition-all ${isPublishing ? 'bg-emerald-100 text-emerald-800 cursor-not-allowed' : 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-md shadow-emerald-100 hover:scale-105 active:scale-95'}`}>
              {isPublishing ? 'در حال انتشار...' : <><Sparkles className="w-4 h-4" /><span>انتشار تغییرات</span></>}
              <AnimatePresence>{showPublishSuccess && <motion.div initial={{ opacity: 0, scale: 0.5, y: 10 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.5 }} className="absolute -bottom-12 right-0 bg-slate-900 text-white px-4 py-2 rounded-lg flex items-center gap-2 whitespace-nowrap shadow-xl z-50"><CheckCircle2 className="w-4 h-4 text-emerald-400" />تغییرات با موفقیت منتشر شد</motion.div>}</AnimatePresence>
            </button>
            <div className="relative" ref={notificationRef}>
              <button onClick={() => setIsNotificationsOpen(!isNotificationsOpen)} className={`p-2 rounded-full relative transition-colors ${isNotificationsOpen ? 'bg-emerald-50 text-emerald-600' : 'text-slate-500 hover:bg-slate-100'}`}><Bell className="w-5 h-5" />{notifications.filter(n => !n.read).length > 0 && <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-red-500 rounded-full border-2 border-white flex items-center justify-center text-[9px] font-bold text-white">{notifications.filter(n => !n.read).length}</span>}</button>
            </div>
            <div className="relative" ref={profileRef} onMouseEnter={() => setIsProfileOpen(true)} onMouseLeave={() => setIsProfileOpen(false)}>
              <div className="flex items-center gap-3 pr-2 border-r border-slate-200 mr-2 cursor-pointer group">
                <div className="text-left hidden md:block">
                  <h4 className="text-sm font-bold text-slate-800 group-hover:text-emerald-700 transition-colors">مدیر رستوران</h4>
                  <span className="text-[10px] text-slate-400 block group-hover:text-emerald-500/70 transition-colors">شعبه مرکزی</span>
                </div>
                <div className={`w-10 h-10 rounded-full border-2 shadow-sm flex items-center justify-center overflow-hidden transition-all ${isProfileOpen ? 'border-emerald-500 ring-2 ring-emerald-500/20 bg-emerald-50' : 'bg-slate-200 border-white'}`}><User className={`w-5 h-5 ${isProfileOpen ? 'text-emerald-600' : 'text-slate-400'}`} /></div>
              </div>
            </div>
          </div>
        </header>
        <div className="flex-1 overflow-hidden relative">{renderView()}</div>
      </main>
    </div>
  );
};

export default App;
