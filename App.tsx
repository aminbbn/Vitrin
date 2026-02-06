
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Bell, 
  ChevronRight, 
  ChevronLeft, 
  Search, 
  Globe, 
  User, 
  Power,
  Zap,
  CheckCircle2
} from 'lucide-react';
import { ViewState } from './types';
import { SIDEBAR_LINKS } from './constants';
import Dashboard from './components/Dashboard';
import CanvasDesigner from './components/CanvasDesigner';
import ProductManager from './components/ProductManager';
import OrderBoard from './components/OrderBoard';

const App: React.FC = () => {
  const [activeView, setActiveView] = useState<ViewState>('designer');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isRestaurantOpen, setIsRestaurantOpen] = useState(true);
  const [isPublishing, setIsPublishing] = useState(false);
  const [showPublishSuccess, setShowPublishSuccess] = useState(false);

  const handlePublish = () => {
    setIsPublishing(true);
    setTimeout(() => {
      setIsPublishing(false);
      setShowPublishSuccess(true);
      setTimeout(() => setShowPublishSuccess(false), 3000);
    }, 2000);
  };

  const renderView = () => {
    switch (activeView) {
      case 'dashboard': return <Dashboard />;
      case 'designer': return <CanvasDesigner />;
      case 'products': return <ProductManager />;
      case 'orders': return <OrderBoard />;
      default: return (
        <div className="flex items-center justify-center h-full text-slate-400 bg-white m-6 rounded-2xl border border-dashed border-slate-200">
          این بخش در حال توسعه است
        </div>
      );
    }
  };

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
                <Zap className="w-6 h-6 fill-current" />
              </div>
              <span className="text-xl font-black text-emerald-900 tracking-tight">ویترین</span>
            </motion.div>
          )}
          {isSidebarCollapsed && (
             <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-emerald-200 mx-auto">
              <Zap className="w-6 h-6 fill-current" />
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
        <header className="h-20 bg-white border-b border-slate-200 flex items-center justify-between px-8 z-40">
          <div className="flex items-center gap-6">
            <div className="relative">
              <Search className="w-5 h-5 absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input 
                type="text" 
                placeholder="جستجو در پنل..." 
                className="bg-slate-100 border-none rounded-full pr-10 pl-4 py-2 w-64 text-sm focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
              />
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
                    className="absolute -bottom-12 right-0 bg-slate-900 text-white px-4 py-2 rounded-lg flex items-center gap-2 whitespace-nowrap shadow-xl"
                  >
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    تغییرات با موفقیت منتشر شد
                  </motion.div>
                )}
              </AnimatePresence>
            </button>

            <div className="flex items-center gap-2">
              <button className="p-2 text-slate-500 hover:bg-slate-100 rounded-full relative">
                <Bell className="w-5 h-5" />
                <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 border-2 border-white rounded-full" />
              </button>
              <button className="p-2 text-slate-500 hover:bg-slate-100 rounded-full">
                <Globe className="w-5 h-5" />
              </button>
              <div className="h-10 w-10 rounded-full bg-slate-200 border-2 border-white shadow-sm overflow-hidden flex items-center justify-center">
                <User className="w-6 h-6 text-slate-400" />
              </div>
            </div>
          </div>
        </header>

        {/* View Container */}
        <section className="flex-1 overflow-hidden relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeView}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="h-full"
            >
              {renderView()}
            </motion.div>
          </AnimatePresence>
        </section>
      </main>
    </div>
  );
};

export default App;
