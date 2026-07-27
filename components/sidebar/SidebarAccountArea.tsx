import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppSession } from '../../data/useRepositories';
import { useRepositories } from '../../data/RepositoryProvider';
import { devSwitchMockUser } from '../../data/mock/MockAuthRepository';
import { Branch } from '../../domain';
import { 
  Store, ChevronDown, User, LogOut, MapPin, Phone, Clock, X, Check
} from 'lucide-react';

interface SidebarAccountAreaProps {
  isCollapsed: boolean;
  brandColor: string;
  onProfileClick: () => void;
  onLogout: () => void;
  restaurantName: string;
  restaurantLogo: string;
  isRestaurantOpen: boolean;
}

export const SidebarAccountArea: React.FC<SidebarAccountAreaProps> = ({
  isCollapsed,
  brandColor,
  onProfileClick,
  onLogout,
  restaurantName,
  restaurantLogo,
  isRestaurantOpen
}) => {
  const {
    user,
    memberships,
    activeRestaurant,
    activeBranch,
    role,
    setActiveRestaurant,
    setActiveBranch
  } = useAppSession();

  const { tenantRepository } = useRepositories();

  const [openPopover, setOpenPopover] = useState<'workspace' | 'profile' | null>(null);
  const [popoverCoords, setPopoverCoords] = useState<{ top: number; left: number }>({ top: 0, left: 0 });
  const [isRestaurantInfoOpen, setIsRestaurantInfoOpen] = useState(false);
  const [availableBranches, setAvailableBranches] = useState<Branch[]>([]);

  const workspaceTriggerRef = useRef<HTMLButtonElement>(null);
  const profileTriggerRef = useRef<HTMLButtonElement>(null);
  const workspacePopoverRef = useRef<HTMLDivElement>(null);
  const profilePopoverRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (activeRestaurant) {
      tenantRepository.getBranches().then(brs => {
        setAvailableBranches(brs);
      }).catch(err => console.error('Error loading branches in Sidebar:', err));
    } else {
      setAvailableBranches([]);
    }
  }, [activeRestaurant, tenantRepository]);

  // Dynamically position the popovers relative to the triggered button coordinates
  useEffect(() => {
    if (!openPopover) return;

    const handleUpdatePosition = () => {
      const triggerEl = openPopover === 'workspace' 
        ? workspaceTriggerRef.current 
        : profileTriggerRef.current;
      const popoverEl = openPopover === 'workspace'
        ? workspacePopoverRef.current
        : profilePopoverRef.current;

      if (!triggerEl) return;

      const triggerRect = triggerEl.getBoundingClientRect();
      const popWidth = openPopover === 'workspace' ? 288 : 240;
      
      // Use the actual popover element height, or fallback to sensible defaults
      const popHeight = popoverEl ? popoverEl.getBoundingClientRect().height : (openPopover === 'workspace' ? 380 : 200);
      const gap = 12;

      let left = 0;
      let top = 0;

      // In RTL layout, position the popover to the left of the trigger button with a clear margin gap.
      if (triggerRect.left > popWidth + 32) {
        left = triggerRect.left - popWidth - gap;
        top = triggerRect.bottom - popHeight;
      } else {
        // Safe viewport fallback for mobile/small screen: center inside the browser viewport.
        left = Math.max(16, (window.innerWidth - popWidth) / 2);
        top = Math.max(16, (window.innerHeight - popHeight) / 2);
      }

      // Keep inside bounds
      top = Math.max(16, Math.min(top, window.innerHeight - popHeight - 16));

      setPopoverCoords({ top, left });
    };

    handleUpdatePosition();
    const frameId = requestAnimationFrame(handleUpdatePosition);

    window.addEventListener('resize', handleUpdatePosition, { passive: true });
    window.addEventListener('scroll', handleUpdatePosition, { passive: true });

    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener('resize', handleUpdatePosition);
      window.removeEventListener('scroll', handleUpdatePosition);
    };
  }, [openPopover, isRestaurantInfoOpen]);

  // Handle outside click and Escape key behavior
  useEffect(() => {
    if (!openPopover) return;

    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      
      const triggerEl = openPopover === 'workspace' 
        ? workspaceTriggerRef.current 
        : profileTriggerRef.current;
      const popoverEl = openPopover === 'workspace'
        ? workspacePopoverRef.current
        : profilePopoverRef.current;

      const clickedTrigger = triggerEl && triggerEl.contains(target);
      const clickedPopover = popoverEl && popoverEl.contains(target);

      if (!clickedTrigger && !clickedPopover) {
        setOpenPopover(null);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOpenPopover(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [openPopover]);

  return (
    <div className={`flex flex-col gap-3 font-['Vazirmatn'] relative shrink-0 ${isCollapsed ? 'px-0' : 'px-2'}`}>
      {/* 1. Workspace Selector Card */}
      <div className="relative">
        {isCollapsed ? (
          <button
            ref={workspaceTriggerRef}
            onClick={() => {
              setOpenPopover(prev => prev === 'workspace' ? null : 'workspace');
            }}
            className={`w-11 h-11 rounded-xl flex items-center justify-center border cursor-pointer transition-all mx-auto shrink-0 ${
              openPopover === 'workspace'
                ? `border-${brandColor}-500 bg-${brandColor}-50/50 dark:bg-${brandColor}-950/20 text-${brandColor}-600 dark:text-${brandColor}-400 shadow-inner` 
                : 'border-slate-200 dark:border-[var(--app-border)] bg-slate-50 dark:bg-[var(--app-surface-elevated)]/40 text-slate-500 hover:bg-slate-100 dark:hover:bg-[var(--app-hover)]'
            }`}
            title={activeRestaurant ? `${activeRestaurant.name} - ${activeBranch ? activeBranch.name : 'بدون شعبه'}` : 'انتخاب فروشگاه'}
          >
            <Store className="w-5 h-5" />
          </button>
        ) : (
          <button
            ref={workspaceTriggerRef}
            onClick={() => {
              setOpenPopover(prev => prev === 'workspace' ? null : 'workspace');
            }}
            className="w-full text-right"
          >
            <div className="bg-slate-50 dark:bg-[var(--app-surface-elevated)]/20 p-1 rounded-2xl border border-slate-200/50 dark:border-[var(--app-border)]">
              <div 
                className={`flex items-center justify-between p-2 rounded-xl transition-all cursor-pointer select-none ${
                  openPopover === 'workspace' 
                    ? `bg-${brandColor}-50/50 dark:bg-${brandColor}-950/20` 
                    : 'hover:bg-slate-100/80 dark:hover:bg-[var(--app-hover)]'
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <div 
                    className={`w-9 h-9 rounded-lg border shadow-sm flex items-center justify-center transition-all overflow-hidden shrink-0 ${
                      openPopover === 'workspace' 
                        ? `border-${brandColor}-500 bg-white dark:bg-[var(--app-surface)] text-${brandColor}-600` 
                        : 'bg-slate-100 dark:bg-[var(--app-surface-elevated)] border-slate-200 dark:border-[var(--app-border)] text-slate-500'
                    }`}
                  >
                    <Store className="w-4 h-4" />
                  </div>
                  <div className="text-right min-w-0">
                    <span className={`block text-xs font-black text-slate-800 dark:text-slate-200 transition-colors truncate`}>
                      {activeRestaurant ? activeRestaurant.name : 'انتخاب فروشگاه'}
                    </span>
                    <span className="block text-[9px] text-slate-400 font-bold uppercase tracking-wider mt-0.5 truncate">
                      {activeBranch ? activeBranch.name : (activeRestaurant ? 'بدون شعبه فعال' : 'بدون حساب')}
                    </span>
                  </div>
                </div>
                <ChevronDown className="w-4 h-4 text-slate-400 transition-transform duration-200 shrink-0" />
              </div>
            </div>
          </button>
        )}
      </div>

      {/* 2. User Profile Card */}
      <div className="relative mb-1">
        {isCollapsed ? (
          <button
            ref={profileTriggerRef}
            onClick={() => {
              setOpenPopover(prev => prev === 'profile' ? null : 'profile');
            }}
            className={`w-11 h-11 rounded-xl flex items-center justify-center border cursor-pointer transition-all mx-auto overflow-hidden shrink-0 ${
              openPopover === 'profile'
                ? `border-${brandColor}-500 bg-${brandColor}-50/50 dark:bg-${brandColor}-950/20` 
                : 'border-slate-200 dark:border-[var(--app-border)] bg-slate-50 dark:bg-[var(--app-surface-elevated)]/40 hover:bg-slate-100 dark:hover:bg-[var(--app-hover)]'
            }`}
            title={user ? `${user.firstName} ${user.lastName}` : 'کاربر مهمان'}
          >
            {restaurantLogo && restaurantLogo.trim() !== '' ? (
              <img src={restaurantLogo} alt="Logo" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
            ) : (
              <User className={`w-5 h-5 ${openPopover === 'profile' ? `text-${brandColor}-600` : 'text-slate-500'}`} />
            )}
          </button>
        ) : (
          <button
            ref={profileTriggerRef}
            onClick={() => {
              setOpenPopover(prev => prev === 'profile' ? null : 'profile');
            }}
            className="w-full text-right"
          >
            <div className="bg-slate-50 dark:bg-[var(--app-surface-elevated)]/20 p-1 rounded-2xl border border-slate-200/50 dark:border-[var(--app-border)]">
              <div 
                className={`flex items-center justify-between p-2 rounded-xl transition-all cursor-pointer select-none ${
                  openPopover === 'profile' 
                    ? `bg-${brandColor}-50/50 dark:bg-${brandColor}-950/20` 
                    : 'hover:bg-slate-100/80 dark:hover:bg-[var(--app-hover)]'
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <div 
                    className={`w-9 h-9 rounded-lg border shadow-sm flex items-center justify-center transition-all overflow-hidden shrink-0 ${
                      openPopover === 'profile' 
                        ? `border-${brandColor}-500 bg-white dark:bg-[var(--app-surface)]` 
                        : 'bg-slate-100 dark:bg-[var(--app-surface-elevated)] border-slate-200 dark:border-[var(--app-border)]'
                    }`}
                  >
                    {restaurantLogo && restaurantLogo.trim() !== '' ? (
                      <img src={restaurantLogo} alt="Logo" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                    ) : (
                      <User className={`w-4 h-4 ${openPopover === 'profile' ? `text-${brandColor}-600` : 'text-slate-400'}`} />
                    )}
                  </div>
                  <div className="text-right min-w-0">
                    <span className={`block text-xs font-black text-slate-800 dark:text-slate-200 transition-colors truncate`}>
                      {user ? `${user.firstName} ${user.lastName}` : 'کاربر مهمان'}
                    </span>
                    <span className="block text-[9px] text-slate-400 font-bold uppercase tracking-wider mt-0.5 truncate font-mono">
                      {role === 'OWNER' ? 'مالک' : role === 'MANAGER' ? 'مدیر' : 'مشتری'}
                    </span>
                  </div>
                </div>
                <ChevronDown className="w-4 h-4 text-slate-400 transition-transform duration-200 shrink-0" />
              </div>
            </div>
          </button>
        )}
      </div>

      {/* PORTALS: Render popover components to body to avoid layout clippings or shifting */}
      {typeof document !== 'undefined' && createPortal(
        <AnimatePresence>
          {openPopover === 'workspace' && (
            <motion.div
              ref={workspacePopoverRef}
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ duration: 0.15 }}
              className="fixed bg-white dark:bg-[var(--app-surface)] rounded-2xl shadow-[0_10px_40px_rgba(0,0,0,0.15)] dark:shadow-[0_10px_40px_rgba(0,0,0,0.3)] border border-slate-200 dark:border-[var(--app-border)] z-[100] p-3 w-72 origin-bottom font-['Vazirmatn'] text-right"
              style={{
                top: `${popoverCoords.top}px`,
                left: `${popoverCoords.left}px`,
                direction: 'rtl',
              }}
            >
              {/* Restaurants Section */}
              <div className="mb-3">
                <span className="block text-[10px] font-black text-slate-400 dark:text-slate-500 px-2 pb-1 text-right uppercase tracking-wider">فروشگاه‌های من</span>
                {memberships.length === 0 ? (
                  <div className="p-4 bg-slate-50 dark:bg-[var(--app-surface-elevated)]/40 rounded-xl text-center">
                    <span className="text-[11px] font-bold text-slate-400 dark:text-slate-500">حساب کاربری مشتری (فاقد عضویت فروشگاهی)</span>
                  </div>
                ) : (
                  <div className="space-y-0.5 max-h-40 overflow-y-auto">
                    {memberships.map(m => {
                      const isSelected = activeRestaurant?.id === m.restaurantId;
                      const restName = m.restaurantId === 'r1' ? 'رستوران ایتالیایی لیمو' : 'کافه قنادی بهار';
                      return (
                        <button
                          key={m.id}
                          onClick={async () => {
                            try {
                              await setActiveRestaurant(m.restaurantId);
                              setOpenPopover(null);
                            } catch (err) {
                              console.error(err);
                            }
                          }}
                          className={`w-full text-right px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-between group ${
                            isSelected 
                              ? `bg-${brandColor}-50 dark:bg-${brandColor}-950/20 text-${brandColor}-600 dark:text-${brandColor}-400` 
                              : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-[var(--app-hover)]'
                          }`}
                        >
                          <span className="truncate">{restName}</span>
                          <div className="flex items-center gap-1.5 shrink-0">
                            <span className={`text-[9px] px-1.5 py-0.5 rounded-md font-black uppercase ${
                              m.role === 'OWNER' ? 'bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400' : 'bg-blue-50 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400'
                            }`}>
                              {m.role === 'OWNER' ? 'مالک' : 'مدیر'}
                            </span>
                            {isSelected && <Check className={`w-3.5 h-3.5 text-${brandColor}-500`} />}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Branches Section */}
              {activeRestaurant && (
                <div className="border-t border-slate-100 dark:border-[var(--app-border)] pt-2.5 mb-2">
                  <span className="block text-[10px] font-black text-slate-400 dark:text-slate-500 px-2 pb-1 text-right uppercase tracking-wider">شعبه‌های فعال</span>
                  {availableBranches.length === 0 ? (
                    <div className="p-3 text-center bg-slate-50 dark:bg-[var(--app-surface-elevated)]/40 rounded-xl">
                      <span className="text-[10px] text-slate-400 dark:text-slate-500 font-bold">این فروشگاه فاقد شعبه فعال است</span>
                    </div>
                  ) : (
                    <div className="space-y-0.5 max-h-32 overflow-y-auto">
                      {availableBranches.map(b => {
                        const isSelected = activeBranch?.id === b.id;
                        return (
                          <button
                            key={b.id}
                            onClick={async () => {
                              try {
                                await setActiveBranch(b.id);
                                setOpenPopover(null);
                              } catch (err) {
                                console.error(err);
                              }
                            }}
                            className={`w-full text-right px-3 py-1.5 rounded-xl text-xs transition-all flex items-center justify-between ${
                              isSelected 
                                ? `bg-${brandColor}-50 dark:bg-${brandColor}-950/20 text-${brandColor}-600 dark:text-${brandColor}-400 font-black` 
                                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-[var(--app-hover)]'
                            }`}
                          >
                            <span className="truncate">{b.name}</span>
                            {isSelected && <Check className={`w-3.5 h-3.5 text-${brandColor}-500`} />}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}

              {/* Dev Switcher Helper */}
              <div className="mt-3 pt-3 border-t border-slate-100 dark:border-[var(--app-border)]">
                <div className="px-2 pb-1.5 flex items-center justify-between">
                  <span className="text-[9px] font-black text-amber-600 dark:text-amber-500 bg-amber-50 dark:bg-amber-950/40 px-2 py-0.5 rounded-md uppercase">شبیه‌ساز کاربر</span>
                </div>
                <div className="grid grid-cols-3 gap-1">
                  {[
                    { id: 'user-owner', label: 'مالک' },
                    { id: 'user-manager', label: 'مدیر' },
                    { id: 'user-customer', label: 'مشتری' }
                  ].map(u => (
                    <button
                      key={u.id}
                      onClick={() => {
                        devSwitchMockUser(u.id as any);
                        setOpenPopover(null);
                      }}
                      className={`text-[10px] py-1 px-1 rounded-lg font-bold transition-all text-center ${
                        user?.id === u.id || (u.id === 'user-owner' && user?.id === 'mock-admin-id')
                          ? 'bg-amber-500 text-white shadow-sm'
                          : 'bg-slate-50 dark:bg-[var(--app-surface-elevated)] text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-[var(--app-hover)]'
                      }`}
                    >
                      {u.label}
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>,
        document.body
      )}

      {typeof document !== 'undefined' && createPortal(
        <AnimatePresence>
          {openPopover === 'profile' && (
            <motion.div
              ref={profilePopoverRef}
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ duration: 0.15 }}
              className="fixed bg-white dark:bg-[var(--app-surface)] rounded-2xl shadow-[0_10px_40px_rgba(0,0,0,0.15)] dark:shadow-[0_10px_40px_rgba(0,0,0,0.3)] border border-slate-200 dark:border-[var(--app-border)] z-[100] p-2 w-60 origin-bottom font-['Vazirmatn'] text-right"
              style={{
                top: `${popoverCoords.top}px`,
                left: `${popoverCoords.left}px`,
                direction: 'rtl',
              }}
            >
              <div className="px-3 py-2 bg-slate-50 dark:bg-[var(--app-surface-elevated)] rounded-xl mb-1.5 text-right">
                <p className="font-black text-xs text-slate-800 dark:text-slate-200 uppercase tracking-tight truncate">
                  {user ? `${user.firstName} ${user.lastName}` : 'کاربر مهمان'}
                </p>
                <p className="text-[9px] text-slate-400 dark:text-slate-500 mt-0.5 truncate font-mono">
                  {user ? user.email : 'guest@vitrin.com'}
                </p>
              </div>
              
              <button 
                onClick={() => { setIsRestaurantInfoOpen(true); setOpenPopover(null); }}
                className="w-full text-right px-3 py-2 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-[var(--app-hover)] transition-colors flex items-center justify-between group mb-1"
              >
                <span>اطلاعات فروشگاه</span>
                <Store className="w-4 h-4 text-slate-400 group-hover:text-slate-600 shrink-0" />
              </button>

              <button 
                onClick={() => { onProfileClick(); setOpenPopover(null); }}
                className="w-full text-right px-3 py-2 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-[var(--app-hover)] transition-colors flex items-center justify-between group mb-1"
              >
                <span>تنظیمات سیستم</span>
                <User className="w-4 h-4 text-slate-400 group-hover:text-slate-600 shrink-0" />
              </button>

              <div className="h-px bg-slate-100 dark:bg-slate-800 my-1 mx-2" />

              <button 
                onClick={() => { onLogout(); setOpenPopover(null); }}
                className="w-full text-right px-3 py-2 rounded-xl text-xs font-black text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/20 transition-colors flex items-center justify-between group"
              >
                <span>خروج از حساب</span>
                <LogOut className="w-4 h-4 transition-transform group-hover:translate-x-1 shrink-0" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>,
        document.body
      )}

      {/* Restaurant Info Modal */}
      <AnimatePresence>
        {isRestaurantInfoOpen && (
          <motion.div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
             <motion.div 
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               exit={{ opacity: 0 }}
               onClick={() => setIsRestaurantInfoOpen(false)}
               className="fixed inset-0 bg-slate-950/80 backdrop-blur-xl"
             />
             
             <motion.div 
               initial={{ scale: 0.9, opacity: 0, y: 20 }}
               animate={{ scale: 1, opacity: 1, y: 0 }}
               exit={{ scale: 0.9, opacity: 0, y: 20 }}
               className="bg-white dark:bg-slate-900 w-full max-w-md rounded-[2.5rem] shadow-2xl relative z-10 overflow-hidden border border-slate-100 dark:border-slate-800 flex flex-col"
               onClick={(e) => e.stopPropagation()}
             >
               <div className="p-8 relative">
                  <div className="flex items-center justify-between mb-8">
                     <div className="flex items-center gap-4">
                        <div className={`p-4 rounded-[1.25rem] bg-${brandColor}-50 dark:bg-${brandColor}-950/30 text-${brandColor}-600 dark:text-${brandColor}-400 shadow-inner`}>
                           <Store className="w-6 h-6" />
                        </div>
                        <h3 className="text-xl font-black text-slate-800 dark:text-slate-100">اطلاعات فروشگاه</h3>
                     </div>
                     <button onClick={() => setIsRestaurantInfoOpen(false)} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors text-slate-400">
                        <X className="w-5 h-5" />
                     </button>
                  </div>

                  <div className="space-y-5 text-right">
                     <div className="flex items-center justify-between p-5 bg-slate-50 dark:bg-slate-850 rounded-2xl border border-slate-200/50 dark:border-slate-800">
                        <div className="flex flex-col">
                           <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 mb-1">نام رسمی</span>
                           <span className="text-lg font-black text-slate-800 dark:text-slate-100">{restaurantName}</span>
                        </div>
                        <div className={`px-3 py-1 rounded-full text-[10px] font-black border ${isRestaurantOpen ? `bg-${brandColor}-100 text-${brandColor}-700 border-${brandColor}-200 dark:bg-${brandColor}-950/50 dark:text-${brandColor}-400 dark:border-${brandColor}-800` : 'bg-rose-100 text-rose-700 border-rose-200'}`}>
                           {isRestaurantOpen ? 'فعال' : 'غیرفعال'}
                        </div>
                     </div>

                     <div className="space-y-2">
                        {[
                          { icon: MapPin, label: "آدرس", value: "تهران، سعادت آباد، میدان کاج، خیابان سرو شرقی" },
                          { icon: Phone, label: "تلفن", value: "021-88990000" },
                          { icon: Clock, label: "ساعت کار", value: "همه روزه 11:00 صبح تا 11:30 شب" }
                        ].map((item, idx) => (
                          <div key={idx} className="flex items-start gap-4 p-4 hover:bg-slate-50 dark:hover:bg-slate-850 rounded-2xl transition-all border border-transparent hover:border-slate-100 dark:hover:border-slate-800">
                             <item.icon className="w-5 h-5 text-slate-400 mt-0.5 shrink-0" />
                             <div>
                                <span className="block text-[10px] font-bold text-slate-400 dark:text-slate-500 mb-0.5">{item.label}</span>
                                <p className="text-xs font-bold text-slate-700 dark:text-slate-300 leading-relaxed">{item.value}</p>
                             </div>
                          </div>
                        ))}
                     </div>

                     <button 
                        onClick={() => { setIsRestaurantInfoOpen(false); onProfileClick(); }} 
                        className={`w-full py-4 bg-slate-900 dark:bg-slate-800 text-white rounded-2xl font-black text-sm hover:bg-slate-800 dark:hover:bg-slate-700 transition-all shadow-xl shadow-slate-900/10 active:scale-95 mt-4`}
                     >
                        ویرایش تنظیمات فروشگاه
                     </button>
                  </div>
               </div>
             </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
