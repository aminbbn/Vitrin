import React, { useState, useMemo, useEffect, useRef } from 'react';
import { motion, AnimatePresence, Reorder } from 'framer-motion';
import { 
  Smartphone, 
  Tablet, 
  Plus, 
  Trash2, 
  Settings2, 
  Maximize2, 
  Minimize2,
  ZoomIn, 
  ZoomOut,
  GripVertical,
  Layers,
  Sparkles,
  ChevronUp,
  ChevronDown,
  Star,
  ShoppingBag,
  ArrowLeft,
  X,
  Minus,
  Check,
  Clock,
  ChefHat,
  Send,
  User,
  LayoutGrid,
  List,
  Copy,
  Edit2,
  Eye,
  EyeOff
} from 'lucide-react';
import { COMPONENT_LIBRARY } from '../constants';
import { ComponentItem, Product } from '../types';
import { INITIAL_PRODUCTS, INITIAL_CATEGORIES } from '../constants';
import { useCatalog } from '../data/useRepositories';

// --- Types for Local State ---
interface CartItem {
  id: string;
  qty: number;
}

type DeviceType = 'mobile' | 'tablet';

import { 
  HeroBlock, 
  CategoryDisplayBlock, 
  FeaturedBlock, 
  FooterBlock, 
  CategoryProductsScreen, 
  ProductDetailSheet, 
  CartBar, 
  CartDrawer 
} from './menu-blocks';

// Added props interface for CanvasDesigner to receive state from App
interface CanvasDesignerProps {
  elements: ComponentItem[];
  onElementsChange: React.Dispatch<React.SetStateAction<ComponentItem[]>>;
  brandColor: string;
}

// Mobile Slide-up Sheet Component
interface MobileSheetProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

const MobileSheet: React.FC<MobileSheetProps> = ({ isOpen, onClose, title, children }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.6 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-950/50 z-[100] lg:hidden backdrop-blur-[2px]"
          />
          {/* Sheet wrapper */}
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 26, stiffness: 240 }}
            className="fixed bottom-0 left-0 right-0 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 rounded-t-[2rem] z-[101] lg:hidden max-h-[85dvh] flex flex-col overflow-hidden shadow-2xl pb-safe"
            dir="rtl"
          >
            {/* Grab Handle */}
            <div className="flex justify-center py-3 shrink-0 cursor-pointer" onClick={onClose}>
              <div className="w-12 h-1 bg-slate-300 dark:bg-slate-700 rounded-full" />
            </div>
            
            {/* Header */}
            <div className="px-5 pb-3 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between shrink-0">
              <h4 className="font-black text-slate-800 dark:text-slate-100 text-xs text-right flex-1">{title}</h4>
              <button 
                onClick={onClose}
                className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            
            {/* Body */}
            <div className="flex-1 overflow-y-auto p-5 pb-12 space-y-6">
              {children}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

const CanvasDesigner: React.FC<CanvasDesignerProps> = ({ elements: canvasElements, onElementsChange: setCanvasElements, brandColor }) => {
  const [device, setDevice] = useState<DeviceType>('mobile');
  const [zoom, setZoom] = useState(100);
  const [isAutoFit, setIsAutoFit] = useState(true); // Default to automatic canvas fitting
  const [selectedElementId, setSelectedElementId] = useState<string | null>(null);
  const [selectedElementIds, setSelectedElementIds] = useState<string[]>([]);
  const [editingLayerId, setEditingLayerId] = useState<string | null>(null);
  const [editingLayerLabel, setEditingLayerLabel] = useState<string>('');
  const [draggingId, setDraggingId] = useState<string | null>(null);
  
  // Workspace Measurement & Fullscreen Refs
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerSize, setContainerSize] = useState({ width: 800, height: 600 });
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Mobile navigation active sheet
  const [mobileActiveSheet, setMobileActiveSheet] = useState<'library' | 'layers' | 'inspector' | null>(null);

  // Listen to container resizing
  useEffect(() => {
    if (!containerRef.current) return;
    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        setContainerSize({
          width: entry.contentRect.width,
          height: entry.contentRect.height
        });
      }
    });
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  // Logical device size calculations
  const logicalWidth = device === 'mobile' ? 375 : 768;
  const logicalHeight = device === 'mobile' ? 812 : 1024;

  const calculatedFitScale = useMemo(() => {
    const padding = window.innerWidth < 768 ? 16 : 32;
    const maxAvailableWidth = Math.max(containerSize.width - padding * 2, 280);
    const maxAvailableHeight = Math.max(containerSize.height - padding * 2, 280);
    const scaleX = maxAvailableWidth / logicalWidth;
    const scaleY = maxAvailableHeight / logicalHeight;
    return Math.min(scaleX, scaleY, 1); // Limit fitted scale to a maximum of 100%
  }, [containerSize, device, logicalWidth, logicalHeight]);

  // Sync zoom when auto-fitting is active
  useEffect(() => {
    if (isAutoFit) {
      setZoom(Math.floor(calculatedFitScale * 100));
    }
  }, [calculatedFitScale, isAutoFit]);

  const handleZoomIn = () => {
    setIsAutoFit(false);
    setZoom(prev => Math.min(200, prev + 10));
  };

  const handleZoomOut = () => {
    setIsAutoFit(false);
    setZoom(prev => Math.max(25, prev - 10));
  };

  const handleResetZoom = () => {
    setIsAutoFit(true);
  };

  const handleToggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().then(() => {
        setIsFullscreen(true);
      }).catch((err) => {
        console.error('Error enabling fullscreen:', err);
      });
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  const handleElementClick = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (e.shiftKey && selectedElementId) {
      const anchorIndex = canvasElements.findIndex(el => el.id === selectedElementId);
      const targetIndex = canvasElements.findIndex(el => el.id === id);
      if (anchorIndex !== -1 && targetIndex !== -1) {
        const start = Math.min(anchorIndex, targetIndex);
        const end = Math.max(anchorIndex, targetIndex);
        const selectedRange = canvasElements.slice(start, end + 1).map(el => el.id);
        setSelectedElementIds(selectedRange);
      }
    } else {
      setSelectedElementId(id);
      setSelectedElementIds([id]);
      // On mobile viewports, auto open inspector sheet when clicking a component
      if (window.innerWidth < 1024) {
        setMobileActiveSheet('inspector');
      }
    }
  };

  const toggleVisibility = (id: string) => {
    const isTargetSelected = selectedElementIds.includes(id);
    setCanvasElements(canvasElements.map(el => {
      if (el.id === id) {
        return { ...el, hidden: !el.hidden };
      }
      if (isTargetSelected && selectedElementIds.includes(el.id)) {
        return { ...el, hidden: !el.hidden };
      }
      return el;
    }));
  };

  const moveElement = (index: number, direction: 'up' | 'down') => {
    const newElements = [...canvasElements];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex >= 0 && targetIndex < newElements.length) {
      const temp = newElements[index];
      newElements[index] = newElements[targetIndex];
      newElements[targetIndex] = temp;
      setCanvasElements(newElements);
    }
  };

  const duplicateElement = (index: number) => {
    const elementToCopy = canvasElements[index];
    const newEl: ComponentItem = {
      ...elementToCopy,
      id: Math.random().toString(36).substr(2, 9),
      settings: JSON.parse(JSON.stringify(elementToCopy.settings)),
      label: `${elementToCopy.label} (کپی)`
    };
    const newElements = [...canvasElements];
    newElements.splice(index + 1, 0, newEl);
    setCanvasElements(newElements);
    setSelectedElementId(newEl.id);
    setSelectedElementIds([newEl.id]);
  };

  const startEditingLabel = (id: string, currentLabel: string) => {
    setEditingLayerId(id);
    setEditingLayerLabel(currentLabel);
  };

  const saveEditingLabel = (id: string) => {
    if (editingLayerLabel.trim()) {
      setCanvasElements(canvasElements.map(el => 
        el.id === id ? { ...el, label: editingLayerLabel.trim() } : el
      ));
    }
    setEditingLayerId(null);
  };
  
  const [inspectorTab, setInspectorTab] = useState<'home' | 'categories'>('home');
  const [previewCategoryId, setPreviewCategoryId] = useState<string | null>(null);

  const {
    categories: cats,
    products,
    layoutSettings,
    updateCategoryPageSettings
  } = useCatalog();

  const categoryPageLayout = layoutSettings?.layout || 'grid';
  const categoryPageColumns = layoutSettings?.columns || 2;

  const setCategoryPageLayout = (layout: 'grid' | 'list') => {
    updateCategoryPageSettings({ layout });
  };

  const setCategoryPageColumns = (columns: number) => {
    updateCategoryPageSettings({ columns });
  };
  
  // Preview State
  const [cart, setCart] = useState<CartItem[]>([]);
  const [activeProduct, setActiveProduct] = useState<Product | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);

  const addToCart = (id: string, qty: number) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === id);
      if (existing) {
        return prev.map(item => item.id === id ? { ...item, qty: item.qty + qty } : item);
      }
      return [...prev, { id, qty }];
    });
  };

  const removeFromCart = (id: string) => {
    setCart(prev => prev.filter(item => item.id !== id));
  };

  const updateCartQty = (id: string, qty: number) => {
    setCart(prev => prev.map(item => item.id === id ? { ...item, qty } : item));
  };

  const addElement = (item: any) => {
    const newEl: ComponentItem = {
      id: Math.random().toString(36).substr(2, 9),
      type: item.type,
      label: item.label,
      settings: item.defaults ? { ...item.defaults } : {
        title: item.label,
        fontSize: 16,
        padding: 16,
        animation: 'fade'
      }
    };
    setCanvasElements([...canvasElements, newEl]);
    setSelectedElementId(newEl.id);
    setSelectedElementIds([newEl.id]);

    // Close the mobile sheet automatically to reveal the added component on mobile
    if (window.innerWidth < 1024) {
      setMobileActiveSheet(null);
    }
  };

  const removeElement = (id: string) => {
    const idsToRemove = selectedElementIds.includes(id) ? selectedElementIds : [id];
    setCanvasElements(canvasElements.filter(el => !idsToRemove.includes(el.id)));
    if (idsToRemove.includes(selectedElementId!)) {
      setSelectedElementId(null);
    }
    setSelectedElementIds(prev => prev.filter(item => !idsToRemove.includes(item)));
  };

  const selectedElement = canvasElements.find(el => el.id === selectedElementId);

  // Dynamic Styles based on Device size
  const getDeviceFrameStyles = () => {
    switch (device) {
      case 'mobile':
        return {
           width: 375,
           height: 812,
           className: "bg-white dark:bg-slate-950 rounded-[3rem] border-[8px] border-slate-900 dark:border-slate-800 transition-colors duration-300"
        };
      case 'tablet':
        return {
           width: 768,
           height: 1024,
           className: "bg-white dark:bg-slate-950 rounded-[2rem] border-[8px] border-slate-900 dark:border-slate-800 transition-colors duration-300"
        };
    }
  };

  const frameStyle = getDeviceFrameStyles();

  // Calculated physical size of the scaled frame inside the workspace
  const scaledWidth = logicalWidth * (zoom / 100);
  const scaledHeight = logicalHeight * (zoom / 100);

  // --- Sub-components for sidebar render to prevent duplication ---
  const renderLibraryContent = () => (
    <div className="flex-grow overflow-y-auto space-y-6">
      {COMPONENT_LIBRARY.map((cat, idx) => (
        <div key={idx} className="space-y-3">
          <span className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">{cat.category}</span>
          <div className="grid grid-cols-2 gap-2">
            {cat.items.map((item) => (
              <button 
                key={item.id}
                onClick={() => addElement(item)}
                className={`flex flex-col items-center justify-center p-3 border border-slate-100 dark:border-slate-800/80 rounded-xl bg-slate-50 dark:bg-slate-950/40 hover:bg-${brandColor}-50 dark:hover:bg-${brandColor}-950/20 hover:border-${brandColor}-200 dark:hover:border-${brandColor}-800 transition-all group text-center gap-2`}
              >
                <div className={`p-2 bg-white dark:bg-slate-800 rounded-lg shadow-sm text-slate-500 dark:text-slate-400 group-hover:text-${brandColor}-600 dark:group-hover:text-${brandColor}-400 transition-colors`}>
                  {item.icon}
                </div>
                <span className={`text-[10px] font-medium text-slate-600 dark:text-slate-300 group-hover:text-${brandColor}-700 dark:group-hover:text-${brandColor}-300`}>{item.label}</span>
              </button>
            ))}
          </div>
        </div>
      ))}
    </div>
  );

  const renderLayersContent = () => (
    <div className="flex-1 overflow-hidden flex flex-col">
      {canvasElements.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center p-8 text-center opacity-40">
          <Layers className="w-8 h-8 text-slate-300 dark:text-slate-650 mb-2" />
          <p className="text-xs font-bold text-slate-500 dark:text-slate-400">هیچ لایه‌ای وجود ندارد</p>
        </div>
      ) : (
        <Reorder.Group
          axis="y"
          values={canvasElements}
          onReorder={setCanvasElements}
          className="flex-1 overflow-y-auto p-1 space-y-2 select-none"
        >
          {canvasElements.map((el, index) => {
            const isSelected = selectedElementIds.includes(el.id);
            const isActiveSelected = selectedElementId === el.id;
            const isEditing = editingLayerId === el.id;
            
            return (
              <Reorder.Item
                key={el.id}
                value={el}
                dragListener={!isEditing}
                onDragStart={() => setDraggingId(el.id)}
                onDragEnd={() => setDraggingId(null)}
                initial={{ scale: 1, rotate: 0, zIndex: 1, boxShadow: "0px 0px 0px rgba(0,0,0,0)" }}
                animate={{
                  scale: draggingId === el.id ? 1.04 : 1,
                  rotate: draggingId === el.id ? -3.5 : 0,
                  zIndex: draggingId === el.id ? 50 : 1,
                  boxShadow: draggingId === el.id 
                    ? "0 15px 30px -10px rgba(0, 0, 0, 0.15), 0 10px 15px -5px rgba(0, 0, 0, 0.1)" 
                    : "0px 0px 0px rgba(0, 0, 0, 0)"
                }}
                style={{
                  cursor: draggingId === el.id ? "grabbing" : "grab"
                }}
                transition={{
                  type: "spring",
                  stiffness: 400,
                  damping: 28,
                  mass: 0.5
                }}
                onClick={(e) => handleElementClick(e, el.id)}
                className={`flex items-center justify-between p-2.5 rounded-xl border transition-colors duration-200 cursor-pointer group select-none ${
                  isActiveSelected
                    ? `bg-${brandColor}-50/90 dark:bg-${brandColor}-950/40 border-${brandColor}-500 shadow-sm`
                    : isSelected
                    ? `bg-${brandColor}-50/40 dark:bg-${brandColor}-950/20 border-${brandColor}-200 dark:border-${brandColor}-800/60`
                    : 'bg-white dark:bg-slate-950 border-slate-100 dark:border-slate-800/80 hover:border-slate-200 dark:hover:border-slate-750 hover:bg-slate-50/50 dark:hover:bg-slate-850/50'
                }`}
              >
                <div className="flex items-center gap-2 min-w-0 flex-1">
                  {/* Order indicator */}
                  <div className="text-[10px] text-slate-300 dark:text-slate-600 font-bold w-4 text-center shrink-0">
                    {index + 1}
                  </div>

                  {/* Visibility Toggle */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleVisibility(el.id);
                    }}
                    className={`p-1.5 rounded transition-colors shrink-0 cursor-pointer ${
                      el.hidden 
                        ? 'text-slate-300 hover:text-slate-500 dark:text-slate-600 dark:hover:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-850' 
                        : `text-${brandColor}-500 hover:text-${brandColor}-600 hover:bg-${brandColor}-50 dark:hover:bg-${brandColor}-950/40`
                    }`}
                    title={el.hidden ? "نمایش لایه" : "مخفی کردن لایه"}
                  >
                    {el.hidden ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                  
                  {/* Icon */}
                  <div className={`p-1.5 rounded-lg shrink-0 ${isSelected ? `bg-white dark:bg-slate-850 text-${brandColor}-600 shadow-sm` : 'bg-slate-100 dark:bg-slate-800/80 text-slate-500 dark:text-slate-400'}`}>
                    {el.type === 'hero' && <Sparkles className="w-3.5 h-3.5" />}
                    {el.type === 'featured' && <Star className="w-3.5 h-3.5" />}
                    {el.type === 'category-display' && <LayoutGrid className="w-3.5 h-3.5" />}
                    {el.type === 'footer' && <Smartphone className="w-3.5 h-3.5" />}
                    {el.type !== 'hero' && el.type !== 'featured' && el.type !== 'category-display' && el.type !== 'footer' && <List className="w-3.5 h-3.5" />}
                  </div>

                  {/* Name / Rename Input */}
                  <div className="min-w-0 flex-1 text-right">
                    {isEditing ? (
                      <input
                        type="text"
                        value={editingLayerLabel}
                        onChange={(e) => setEditingLayerLabel(e.target.value)}
                        onBlur={() => saveEditingLabel(el.id)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') saveEditingLabel(el.id);
                          if (e.key === 'Escape') setEditingLayerId(null);
                        }}
                        autoFocus
                        className="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-100 rounded px-1.5 py-0.5 text-[11px] font-bold outline-none text-right"
                        onClick={(e) => e.stopPropagation()}
                      />
                    ) : (
                      <div className="flex items-center justify-end gap-1 group/text">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            startEditingLabel(el.id, el.label);
                          }}
                          className="lg:opacity-0 lg:group-hover/text:opacity-100 text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300 p-1 transition-opacity shrink-0"
                          title="ویرایش نام لایه"
                        >
                          <Edit2 className="w-2.5 h-2.5" />
                        </button>
                        <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300 truncate block">
                          {el.label}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Layer Actions */}
                <div className="flex items-center gap-1 shrink-0 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity" onClick={(e) => e.stopPropagation()}>
                  {/* Move up / down arrows always visible on touch sizes to ensure robust usability */}
                  <button
                    onClick={() => moveElement(index, 'up')}
                    disabled={index === 0}
                    className="p-1 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded disabled:opacity-20 shrink-0"
                    title="انتقال به بالا"
                  >
                    <ChevronUp className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => moveElement(index, 'down')}
                    disabled={index === canvasElements.length - 1}
                    className="p-1 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded disabled:opacity-20 shrink-0"
                    title="انتقال به پایین"
                  >
                    <ChevronDown className="w-3.5 h-3.5" />
                  </button>

                  {/* Duplicate */}
                  <button
                    onClick={() => duplicateElement(index)}
                    className="p-1 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded transition-colors cursor-pointer shrink-0"
                    title="کپی کردن"
                  >
                    <Copy className="w-3 h-3" />
                  </button>

                  {/* Delete */}
                  <button
                    onClick={() => removeElement(el.id)}
                    className="p-1 text-rose-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 rounded transition-colors cursor-pointer shrink-0"
                    title="حذف لایه"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              </Reorder.Item>
            );
          })}
        </Reorder.Group>
      )}
    </div>
  );

  const renderInspectorContent = () => (
    <div className="space-y-6 text-right" dir="rtl">
      {/* Sub-tab switcher inside sheet or sidebar */}
      <div className="flex border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 rounded-xl p-1 mb-2">
        <button 
          onClick={() => setInspectorTab('home')}
          className={`flex-1 py-2 text-xs font-black rounded-lg transition-all flex items-center justify-center gap-1.5 ${
            inspectorTab === 'home' ? `bg-white dark:bg-slate-800 text-${brandColor}-600 dark:text-${brandColor}-400 shadow-xs` : 'text-slate-400 dark:text-slate-500 hover:text-slate-600'
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          تنظیمات بلوک‌ها
        </button>
        <button 
          onClick={() => setInspectorTab('categories')}
          className={`flex-1 py-2 text-xs font-black rounded-lg transition-all flex items-center justify-center gap-1.5 ${
            inspectorTab === 'categories' ? `bg-white dark:bg-slate-800 text-${brandColor}-600 dark:text-${brandColor}-400 shadow-xs` : 'text-slate-400 dark:text-slate-500 hover:text-slate-600'
          }`}
        >
          <LayoutGrid className="w-3.5 h-3.5" />
          صفحه دسته‌بندی‌ها
        </button>
      </div>

      <AnimatePresence mode="wait">
        {inspectorTab === 'categories' ? (
          <motion.div
            key="categories-screen-settings"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-6"
          >
            <div className="p-4 bg-slate-50 dark:bg-slate-950/40 rounded-2xl border border-slate-100 dark:border-slate-800/50">
              <h4 className="font-black text-slate-800 dark:text-slate-100 text-xs mb-1.5 flex items-center gap-1.5">
                <LayoutGrid className={`w-3.5 h-3.5 text-${brandColor}-600`} />
                تنظیمات صفحه دسته‌بندی محصولات
              </h4>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 font-bold leading-relaxed">این تنظیمات نحوه نمایش محصولات را هنگامی که مشتری یکی از دسته‌ها را باز می‌کند به صورت سراسری کنترل می‌کنند.</p>
            </div>

            <div className="space-y-3">
              <label className="text-xs font-black text-slate-700 dark:text-slate-300 block">چیدمان نمایش محصولات (Layout Style)</label>
              <div className="grid grid-cols-2 gap-2">
                <button 
                  onClick={() => setCategoryPageLayout('grid')}
                  className={`py-2 px-3 border rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                    categoryPageLayout === 'grid' 
                      ? `bg-${brandColor}-50 dark:bg-${brandColor}-950/40 border-${brandColor}-200 dark:border-${brandColor}-800 text-${brandColor}-700 dark:text-${brandColor}-300 shadow-sm` 
                      : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-850'
                  }`}
                >
                  <LayoutGrid className="w-3.5 h-3.5" />
                  نمای شبکه‌ای
                </button>
                <button 
                  onClick={() => setCategoryPageLayout('list')}
                  className={`py-2 px-3 border rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                    categoryPageLayout === 'list' 
                      ? `bg-${brandColor}-50 dark:bg-${brandColor}-950/40 border-${brandColor}-200 dark:border-${brandColor}-800 text-${brandColor}-700 dark:text-${brandColor}-300 shadow-sm` 
                      : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-850'
                  }`}
                >
                  <List className="w-3.5 h-3.5" />
                  نمای لیستی
                </button>
              </div>
            </div>

            {categoryPageLayout === 'grid' && (
              <div className="space-y-3">
                <label className="text-xs font-black text-slate-700 dark:text-slate-300 block">تعداد ستون‌ها در نمای شبکه‌ای</label>
                <div className="flex gap-2">
                  {[2, 3, 4].map(num => (
                    <button 
                      key={num}
                      onClick={() => setCategoryPageColumns(num)}
                      className={`flex-1 py-2 border rounded-xl text-xs font-bold transition-all ${
                        categoryPageColumns === num 
                          ? `bg-${brandColor}-50 dark:bg-${brandColor}-950/40 border-${brandColor}-200 dark:border-${brandColor}-800 text-${brandColor}-700 dark:text-${brandColor}-300 shadow-sm` 
                          : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-850'
                      }`}
                    >
                      {num} ستونه
                    </button>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        ) : selectedElement ? (
          <motion.div
            key={selectedElement.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-6"
          >
            {/* Header section with active element details */}
            <div className="p-3 bg-slate-50 dark:bg-slate-950/40 rounded-xl border border-slate-100 dark:border-slate-800/50 mb-4 flex items-center justify-between">
              <span className="text-xs font-black text-slate-700 dark:text-slate-300">{selectedElement.label}</span>
              <span className={`text-[10px] bg-${brandColor}-500/10 text-${brandColor}-600 dark:text-${brandColor}-400 px-2 py-0.5 rounded-full border border-${brandColor}-500/20 font-bold`}>المان انتخابی</span>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-black text-slate-505 dark:text-slate-400">عنوان المان</label>
              <input 
                type="text" 
                value={selectedElement.settings.title}
                onChange={(e) => {
                  const val = e.target.value;
                  setCanvasElements(prev => prev.map(el => el.id === selectedElement.id ? { ...el, settings: { ...el.settings, title: val }} : el));
                }}
                className={`w-full px-4 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-sm text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-${brandColor}-500 outline-none`}
              />
            </div>

            {selectedElement.settings.subtitle !== undefined && (
               <div className="space-y-2">
                <label className="text-xs font-black text-slate-505 dark:text-slate-400">توضیحات کوتاه</label>
                <input 
                  type="text" 
                  value={selectedElement.settings.subtitle}
                  onChange={(e) => {
                    const val = e.target.value;
                    setCanvasElements(prev => prev.map(el => el.id === selectedElement.id ? { ...el, settings: { ...el.settings, subtitle: val }} : el));
                  }}
                  className={`w-full px-4 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-sm text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-${brandColor}-500 outline-none`}
                />
              </div>
            )}

            {/* Category Display Settings inside property inspector */}
            {selectedElement.type === 'category-display' && (
              <>
                <div className="space-y-3">
                  <label className="text-xs font-black text-slate-700 dark:text-slate-300 block">چیدمان دسته‌ها در صفحه اصلی</label>
                  <div className="grid grid-cols-2 gap-2">
                    <button 
                      onClick={() => {
                        setCanvasElements(prev => prev.map(el => el.id === selectedElement.id ? { ...el, settings: { ...el.settings, layout: 'grid' }} : el));
                      }}
                      className={`py-2 px-3 border rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                        selectedElement.settings.layout === 'grid' || !selectedElement.settings.layout
                          ? `bg-${brandColor}-50 dark:bg-${brandColor}-950/40 border-${brandColor}-200 dark:border-${brandColor}-800 text-${brandColor}-700 dark:text-${brandColor}-300 shadow-sm` 
                          : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-850'
                      }`}
                    >
                      <LayoutGrid className="w-3.5 h-3.5" />
                      نمای شبکه‌ای
                    </button>
                    <button 
                      onClick={() => {
                        setCanvasElements(prev => prev.map(el => el.id === selectedElement.id ? { ...el, settings: { ...el.settings, layout: 'scroll' }} : el));
                      }}
                      className={`py-2 px-3 border rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                        selectedElement.settings.layout === 'scroll' 
                          ? `bg-${brandColor}-50 dark:bg-${brandColor}-950/40 border-${brandColor}-200 dark:border-${brandColor}-800 text-${brandColor}-700 dark:text-${brandColor}-300 shadow-sm` 
                          : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-850'
                      }`}
                    >
                      <List className="w-3.5 h-3.5" />
                      اسکرول افقی
                    </button>
                  </div>
                </div>

                {(selectedElement.settings.layout === 'grid' || !selectedElement.settings.layout) && (
                  <div className="space-y-3">
                    <label className="text-xs font-black text-slate-700 dark:text-slate-300 block">تعداد ستون‌ها</label>
                    <div className="flex gap-2">
                      {[2, 3, 4].map(num => (
                        <button 
                          key={num}
                          onClick={() => {
                            setCanvasElements(prev => prev.map(el => el.id === selectedElement.id ? { ...el, settings: { ...el.settings, columns: num }} : el));
                          }}
                          className={`flex-1 py-2 border rounded-xl text-xs font-bold transition-all ${
                            (selectedElement.settings.columns || 2) === num 
                              ? `bg-${brandColor}-50 dark:bg-${brandColor}-950/40 border-${brandColor}-200 dark:border-${brandColor}-800 text-${brandColor}-700 dark:text-${brandColor}-300 shadow-sm` 
                              : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-850'
                          }`}
                        >
                          {num} ستونه
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <div className="space-y-3">
                  <label className="text-xs font-black text-slate-700 dark:text-slate-300 block border-b border-slate-100 dark:border-slate-800 pb-2">مدیریت و چیدمان دسته‌بندی‌ها</label>
                  <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                    {(() => {
                      const orderList = selectedElement.settings.categoriesOrder || cats.map(c => c.id);
                      const visibleList = selectedElement.settings.visibleCategories || cats.map(c => c.id);

                      const sortedCats = [...cats].sort((a, b) => {
                        const idxA = orderList.indexOf(a.id);
                        const idxB = orderList.indexOf(b.id);
                        if (idxA === -1 && idxB === -1) return a.order - b.order;
                        if (idxA === -1) return 1;
                        if (idxB === -1) return -1;
                        return idxA - idxB;
                      });

                      return sortedCats.map((cat, idxCat) => {
                        const isVisible = visibleList.includes(cat.id);
                        
                        const handleToggleVisibility = () => {
                          let nextVisible = [...visibleList];
                          if (isVisible) {
                            nextVisible = nextVisible.filter(id => id !== cat.id);
                          } else {
                            nextVisible = [...nextVisible, cat.id];
                          }
                          setCanvasElements(prev => prev.map(el => el.id === selectedElement.id ? { ...el, settings: { ...el.settings, visibleCategories: nextVisible }} : el));
                        };

                        const handleMove = (direction: 'up' | 'down') => {
                          const currentOrder = orderList.length > 0 ? [...orderList] : cats.map(c => c.id);
                          const idx = currentOrder.indexOf(cat.id);
                          if (idx === -1) return;
                          
                          if (direction === 'up' && idx > 0) {
                            const temp = currentOrder[idx - 1];
                            currentOrder[idx - 1] = currentOrder[idx];
                            currentOrder[idx] = temp;
                          } else if (direction === 'down' && idx < currentOrder.length - 1) {
                            const temp = currentOrder[idx + 1];
                            currentOrder[idx + 1] = currentOrder[idx];
                            currentOrder[idx] = temp;
                          }
                          
                          setCanvasElements(prev => prev.map(el => el.id === selectedElement.id ? { ...el, settings: { ...el.settings, categoriesOrder: currentOrder }} : el));
                        };

                        return (
                          <div key={cat.id} className="flex items-center justify-between p-2 bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 rounded-xl">
                            <div className="flex items-center gap-2">
                              <input 
                                type="checkbox" 
                                checked={isVisible} 
                                onChange={handleToggleVisibility}
                                className={`rounded border-slate-300 dark:border-slate-700 accent-${brandColor}-600 cursor-pointer h-4 w-4 bg-transparent`}
                              />
                              <div className="w-8 h-8 rounded-lg overflow-hidden border border-slate-200 dark:border-slate-800">
                                <img src={cat.image || undefined} className="w-full h-full object-cover" />
                              </div>
                              <span className="text-xs font-bold text-slate-700 dark:text-slate-300">{cat.name}</span>
                            </div>
                            <div className="flex gap-1">
                              <button 
                                onClick={() => handleMove('up')} 
                                disabled={idxCat === 0}
                                className="p-1 text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-200/50 dark:hover:bg-slate-800 rounded disabled:opacity-30"
                              >
                                <ChevronUp className="w-3.5 h-3.5" />
                              </button>
                              <button 
                                onClick={() => handleMove('down')} 
                                disabled={idxCat === sortedCats.length - 1}
                                className="p-1 text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-200/50 dark:hover:bg-slate-800 rounded disabled:opacity-30"
                              >
                                <ChevronDown className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        );
                      });
                    })()}
                  </div>
                </div>
              </>
            )}

            {/* Footer block settings inside property inspector */}
            {selectedElement.type === 'footer' && (
              <>
                <div className="space-y-2">
                  <label className="text-xs font-black text-slate-505 dark:text-slate-400">متن دلخواه فوتر</label>
                  <textarea 
                    value={selectedElement.settings.customText || ''}
                    onChange={(e) => {
                      const val = e.target.value;
                      setCanvasElements(prev => prev.map(el => el.id === selectedElement.id ? { ...el, settings: { ...el.settings, customText: val }} : el));
                    }}
                    className={`w-full px-4 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-sm text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-${brandColor}-500 outline-none h-20 resize-none`}
                  />
                </div>

                <div className="space-y-3">
                  <label className="text-xs font-black text-slate-700 dark:text-slate-300 block border-b border-slate-100 dark:border-slate-800 pb-2">اطلاعات تماس و شبکه‌های اجتماعی</label>
                  <div className="space-y-2">
                    {[
                      { key: 'phone', label: 'تلفن تماس رستوران' },
                      { key: 'address', label: 'آدرس حضوری' },
                      { key: 'showInstagram', label: 'آیکون اینستاگرام' },
                      { key: 'showTwitter', label: 'آیکون توییتر' },
                      { key: 'showWhatsapp', label: 'آیکون واتس‌اپ' }
                    ].map((item) => {
                      const isChecked = !!selectedElement.settings[item.key];
                      return (
                        <label key={item.key} className="flex items-center justify-between p-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 rounded-xl cursor-pointer hover:bg-slate-100/50 dark:hover:bg-slate-850/50">
                          <span className="text-xs font-bold text-slate-700 dark:text-slate-300">{item.label}</span>
                          <input 
                            type="checkbox" 
                            checked={isChecked}
                            onChange={(e) => {
                              const val = e.target.checked;
                              setCanvasElements(prev => prev.map(el => el.id === selectedElement.id ? { ...el, settings: { ...el.settings, [item.key]: val }} : el));
                            }}
                            className={`rounded border-slate-300 dark:border-slate-700 accent-${brandColor}-600 h-4 w-4 bg-transparent`}
                          />
                        </label>
                      );
                    })}
                  </div>
                </div>
              </>
            )}

            {selectedElement.settings.imageUrl !== undefined && (
               <div className="space-y-2">
                <label className="text-xs font-black text-slate-505 dark:text-slate-400">لینک تصویر</label>
                <input 
                  type="text" 
                  value={selectedElement.settings.imageUrl}
                  onChange={(e) => {
                    const val = e.target.value;
                    setCanvasElements(prev => prev.map(el => el.id === selectedElement.id ? { ...el, settings: { ...el.settings, imageUrl: val }} : el));
                  }}
                  className={`w-full px-4 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-sm text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-${brandColor}-500 outline-none text-left`}
                  dir="ltr"
                />
              </div>
            )}

            <div className="space-y-2">
              <label className="text-xs font-black text-slate-505 dark:text-slate-400">رنگ متن</label>
              <div className="flex gap-2">
                {['#ffffff', '#0f172a', '#10b981', '#3b82f6', '#f59e0b', '#ef4444'].map(color => (
                  <button 
                    key={color}
                    style={{ backgroundColor: color }}
                    className={`w-8 h-8 rounded-full border-2 shadow-sm ${selectedElement.settings.color === color ? 'border-slate-800 dark:border-slate-100 scale-110' : 'border-slate-200 dark:border-slate-700'} transition-transform`}
                    onClick={() => {
                      setCanvasElements(prev => prev.map(el => el.id === selectedElement.id ? { ...el, settings: { ...el.settings, color }} : el));
                    }}
                  />
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between">
                <label className="text-xs font-black text-slate-505 dark:text-slate-400">اندازه فونت</label>
                <span className="text-xs text-slate-400 dark:text-slate-500 font-mono">{selectedElement.settings.fontSize}px</span>
              </div>
              <input 
                type="range" 
                min="12" 
                max="64" 
                value={selectedElement.settings.fontSize}
                onChange={(e) => {
                  const val = parseInt(e.target.value);
                  setCanvasElements(prev => prev.map(el => el.id === selectedElement.id ? { ...el, settings: { ...el.settings, fontSize: val }} : el));
                }}
                className={`w-full h-1.5 bg-slate-100 dark:bg-slate-850 rounded-lg appearance-none cursor-pointer accent-${brandColor}-600`}
              />
            </div>

            <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
              <button 
                onClick={() => removeElement(selectedElement.id)}
                className="w-full py-3 bg-red-50 dark:bg-red-950/20 text-red-600 dark:text-red-400 rounded-xl text-sm font-bold flex items-center justify-center gap-2 hover:bg-red-100 dark:hover:bg-red-950/40 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
                حذف المان
              </button>
            </div>
          </motion.div>
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-center opacity-45 py-12">
            <Smartphone className="w-10 h-10 mb-3 text-slate-300 dark:text-slate-650" />
            <p className="text-xs font-black text-slate-600 dark:text-slate-400 leading-relaxed">برای ویرایش هر بخش، روی آن در گوشی کلیک کنید یا یک المان انتخاب کنید.</p>
          </div>
        )}
      </AnimatePresence>
    </div>
  );

  return (
    <div className="flex h-full w-full bg-slate-50 dark:bg-slate-950 overflow-hidden select-none relative flex-col lg:flex-row">
      {/* 1. Right Sidebar (Desktop only): Library & Design Layers */}
      <div className="hidden lg:flex w-72 shrink-0 bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-850 flex-col shadow-xs h-full overflow-hidden">
        {/* Upper Panel: Component Library */}
        <div className="h-[55%] flex flex-col border-b border-slate-200 dark:border-slate-850 overflow-hidden">
          <div className="p-4 border-b border-slate-100 dark:border-slate-850 flex items-center justify-between shrink-0">
            <h3 className="font-bold text-slate-800 dark:text-slate-100 text-xs flex items-center gap-2">
              <Sparkles className={`w-4 h-4 text-${brandColor}-600`} />
              اجزای منو
            </h3>
            <span className="text-[10px] bg-slate-50 dark:bg-slate-850 text-slate-400 dark:text-slate-300 border border-slate-100 dark:border-slate-800 px-2.5 py-1 rounded-full font-bold">
              قابل افزودن
            </span>
          </div>
          <div className="flex-grow overflow-y-auto p-4">
            {renderLibraryContent()}
          </div>
        </div>

        {/* Lower Panel: Reorderable Layers list */}
        <div className="h-[45%] flex flex-col bg-slate-50/50 dark:bg-slate-900/50 overflow-hidden">
          <div className="p-4 bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-850 flex items-center justify-between shrink-0">
            <h3 className="font-black text-slate-800 dark:text-slate-100 text-xs flex items-center gap-2">
              <Layers className={`w-4 h-4 text-${brandColor}-600`} />
              لایه‌های طراحی (بخش‌ها)
            </h3>
            <span className={`text-[10px] bg-${brandColor}-50 dark:bg-${brandColor}-950/40 text-${brandColor}-700 dark:text-${brandColor}-300 border border-${brandColor}-100 dark:border-${brandColor}-800 px-2 py-0.5 rounded-full font-bold`}>
              {canvasElements.length} لایه
            </span>
          </div>
          <div className="flex-grow overflow-hidden flex flex-col p-3">
            {renderLayersContent()}
          </div>
        </div>
      </div>

      {/* 2. Center Workspace Area (Responsive across all screen sizes) */}
      <div className="flex-1 flex flex-col bg-slate-100 dark:bg-slate-950/45 relative overflow-hidden h-full">
        {/* Responsive Workspace Toolbar */}
        <div className="h-14 bg-white/90 dark:bg-slate-900/90 backdrop-blur border-b border-slate-200 dark:border-slate-850 flex items-center justify-between px-4 sm:px-6 z-20 shrink-0 select-none">
          {/* Right section: Responsive frame device switch */}
          <div className="flex items-center gap-2 bg-slate-200/50 dark:bg-slate-800/50 p-1 rounded-xl">
            <button 
              onClick={() => {
                setDevice('mobile');
                setIsAutoFit(true);
              }} 
              className={`p-2 rounded-lg transition-all flex items-center gap-1 ${device === 'mobile' ? `bg-white dark:bg-slate-700 shadow-xs text-${brandColor}-600 dark:text-${brandColor}-400` : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'}`}
              title="نمای موبایل"
            >
              <Smartphone className="w-4 h-4" />
              <span className="hidden sm:inline text-[10px] font-black">موبایل</span>
            </button>
            <button 
              onClick={() => {
                setDevice('tablet');
                setIsAutoFit(true);
              }} 
              className={`p-2 rounded-lg transition-all flex items-center gap-1 ${device === 'tablet' ? `bg-white dark:bg-slate-700 shadow-xs text-${brandColor}-600 dark:text-${brandColor}-400` : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'}`}
              title="نمای تبلت"
            >
              <Tablet className="w-4 h-4" />
              <span className="hidden sm:inline text-[10px] font-black">تبلت</span>
            </button>
          </div>

          {/* Center section: Scale fitting status & percentage */}
          <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800/30 border border-slate-200/30 dark:border-slate-800/80 px-2.5 py-1.5 rounded-full text-[11px] font-black">
            <span className="text-slate-400 dark:text-slate-500">اندازه:</span>
            <span className={`font-mono text-xs ${isAutoFit ? `text-${brandColor}-600 dark:text-${brandColor}-400` : 'text-slate-700 dark:text-slate-200'}`}>
              {zoom}%
            </span>
            {isAutoFit && (
              <span className="text-[9px] bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 px-1.5 py-0.5 rounded-md font-bold">خودکار</span>
            )}
          </div>

          {/* Left section: Zoom Controllers + Fullscreen */}
          <div className="flex items-center gap-1.5">
            <div className="flex items-center gap-1 bg-slate-200/40 dark:bg-slate-800/40 p-1 rounded-xl">
              <button 
                onClick={handleZoomOut} 
                className="p-1.5 text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 transition-colors cursor-pointer"
                title="کوچک‌نمایی"
              >
                <ZoomOut className="w-3.5 h-3.5" />
              </button>
              
              <button 
                onClick={handleResetZoom}
                className={`px-2 py-1 text-[10px] font-black rounded-lg transition-all ${isAutoFit ? `bg-${brandColor}-500 text-white shadow-xs` : 'text-slate-500 hover:text-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800'}`}
                title="تناسب صفحه"
              >
                Fit
              </button>

              <button 
                onClick={handleZoomIn} 
                className="p-1.5 text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 transition-colors cursor-pointer"
                title="بزرگ‌نمایی"
              >
                <ZoomIn className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Standard document fullscreen toggle with correct support check fallback */}
            <button 
              onClick={handleToggleFullscreen}
              className="p-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 rounded-xl transition-all shadow-2xs cursor-pointer flex items-center justify-center"
              title={isFullscreen ? "خروج از تمام‌صفحه" : "پیش‌نمایش تمام‌صفحه"}
            >
              {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Responsive, Elastic Interactive Workspace Canvas */}
        <div 
          ref={containerRef}
          className="flex-grow overflow-auto relative flex items-center justify-center p-3 sm:p-6 bg-[#f0f2f1] dark:bg-[#0b0e0c]"
          style={{ minHeight: 0 }}
        >
          {/* Interactive container sizing to perfectly center scaled elements without clipping */}
          <div
            className="relative flex items-center justify-center shrink-0 transition-all duration-300 ease-out"
            style={{
              width: Math.max(containerSize.width, scaledWidth + 48),
              height: Math.max(containerSize.height, scaledHeight + 48),
            }}
          >
            <motion.div 
              layout
              style={{ 
                width: logicalWidth, 
                height: logicalHeight,
                scale: zoom / 100,
                transformOrigin: 'center center',
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
              }}
              className={`${frameStyle.className} overflow-hidden relative group shrink-0`}
            >
              {/* Device Notch Indicator - Only for Mobile size */}
              {device === 'mobile' && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-slate-900 rounded-b-2xl z-30 pointer-events-none" />
              )}

              {/* Designer Grid overlay */}
              <div className="absolute inset-0 pointer-events-none opacity-5 group-hover:opacity-8 transition-opacity z-0">
                <div className="w-full h-full" style={{ backgroundImage: 'linear-gradient(to right, #ccc 1px, transparent 1px), linear-gradient(to bottom, #ccc 1px, transparent 1px)', backgroundSize: '20px 20px' }} />
              </div>

              {/* Dynamic Scrollable Simulated Frame Viewport */}
              <div className="p-4 pt-10 h-full overflow-y-auto space-y-4 relative z-10 scrollbar-hide pb-28">
                {canvasElements.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center p-10 space-y-4 opacity-35">
                    <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center">
                      <Plus className="w-8 h-8 text-slate-400 dark:text-slate-500" />
                    </div>
                    <p className="text-xs font-black text-slate-600 dark:text-slate-400 leading-relaxed max-w-[200px]">برای شروع طراحی، روی دکمه اضافه کردن بخش کلیک کرده و اجزا را بچینید</p>
                  </div>
                ) : (
                  canvasElements.map((el) => {
                    if (el.hidden) return null;
                    
                    const isElSelected = selectedElementIds.includes(el.id);
                    const isElActive = selectedElementId === el.id;

                    if (el.type === 'hero') {
                      return (
                        <HeroBlock 
                          key={el.id} 
                          element={el} 
                          brandColor={brandColor} 
                          mode="edit" 
                          isSelected={isElSelected} 
                          onClick={(e) => handleElementClick(e, el.id)} 
                          device={device} 
                        />
                      );
                    }

                    if (el.type === 'featured') {
                      return (
                        <FeaturedBlock 
                          key={el.id} 
                          element={el} 
                          brandColor={brandColor} 
                          mode="edit" 
                          isSelected={isElSelected} 
                          onClick={(e) => handleElementClick(e, el.id)} 
                          onProductClick={setActiveProduct}
                          cart={cart}
                          device={device}
                        />
                      );
                    }

                    if (el.type === 'category-display') {
                      return (
                        <CategoryDisplayBlock 
                          key={el.id} 
                          element={el} 
                          brandColor={brandColor} 
                          mode="edit" 
                          isSelected={isElSelected} 
                          onClick={(e) => handleElementClick(e, el.id)} 
                          onCategoryClick={(catId) => setPreviewCategoryId(catId)} 
                        />
                      );
                    }

                    if (el.type === 'footer') {
                      return (
                        <FooterBlock 
                          key={el.id} 
                          element={el} 
                          brandColor={brandColor} 
                          mode="edit" 
                          isSelected={isElSelected} 
                          onClick={(e) => handleElementClick(e, el.id)} 
                        />
                      );
                    }

                    // Default Fallback section design inside preview frame
                    return (
                      <motion.div 
                        key={el.id}
                        layoutId={el.id}
                        onClick={(e) => handleElementClick(e, el.id)}
                        className={`relative p-6 rounded-2xl cursor-pointer border-2 transition-all bg-white text-center ${
                          isElActive 
                            ? `border-${brandColor}-500 bg-${brandColor}-50/30 shadow-md` 
                            : isElSelected 
                            ? `border-${brandColor}-300 bg-${brandColor}-50/10` 
                            : `border-transparent hover:border-${brandColor}-200 shadow-xs`
                        }`}
                      >
                        <div className="flex items-center justify-between mb-4">
                          <span className={`text-[10px] font-bold text-${brandColor}-600 bg-${brandColor}-50 px-2 py-0.5 rounded shadow-sm border border-${brandColor}-100`}>{el.label}</span>
                          <GripVertical className="w-4 h-4 text-slate-300" />
                        </div>
                        <div className="py-4">
                          <h3 style={{ color: el.settings.color || 'black', fontSize: el.settings.fontSize }} className="font-bold">
                            {el.settings.title}
                          </h3>
                           {el.type === 'action-btn' && (
                              <button className={`mt-3 bg-${brandColor}-600 text-white px-6 py-2 rounded-xl text-sm font-bold w-full`}>
                                  کلیک کنید
                              </button>
                           )}
                        </div>
                      </motion.div>
                    );
                  })
                )}
              </div>

              {/* Live Category Products Screen Slide-in View inside preview frame */}
              <AnimatePresence>
                {previewCategoryId && (
                  <CategoryProductsScreen
                    categoryId={previewCategoryId}
                    onBack={() => setPreviewCategoryId(null)}
                    onProductClick={setActiveProduct}
                    brandColor={brandColor}
                    mode="edit"
                    layoutStyle={categoryPageLayout}
                    columns={categoryPageColumns}
                  />
                )}
              </AnimatePresence>

              {/* Overlays inside device preview frame */}
              <CartBar 
                cart={cart} 
                products={products} 
                brandColor={brandColor} 
                mode="edit" 
                device={device} 
                onClick={() => setIsCartOpen(true)} 
              />
              
              <ProductDetailSheet 
                product={activeProduct} 
                isOpen={!!activeProduct} 
                onClose={() => setActiveProduct(null)} 
                onAddToCart={addToCart}
                brandColor={brandColor}
                mode="edit"
                device={device}
              />

              <CartDrawer 
                 isOpen={isCartOpen}
                 onClose={() => setIsCartOpen(false)}
                 cart={cart}
                 products={products}
                 onRemoveItem={removeFromCart}
                 onUpdateQty={updateCartQty}
                 device={device}
                 brandColor={brandColor}
                 mode="edit"
              />
            </motion.div>
          </div>
        </div>

        {/* 3. Floating Glass Bottom Bar Navigation (Mobile & Tablet sizes) */}
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border border-slate-200/50 dark:border-slate-800/80 px-4 py-2 rounded-full shadow-lg flex items-center gap-1.5 z-40 lg:hidden max-w-[95vw] w-max select-none">
          <button
            onClick={() => setMobileActiveSheet(mobileActiveSheet === 'library' ? null : 'library')}
            className={`px-3.5 py-2 rounded-full text-xs font-black transition-all flex items-center gap-1.5 border border-transparent ${mobileActiveSheet === 'library' ? `bg-${brandColor}-500 text-white shadow-xs` : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'}`}
          >
            <Plus className="w-4 h-4 shrink-0" />
            <span>افزودن بخش</span>
          </button>
          
          <button
            onClick={() => setMobileActiveSheet(mobileActiveSheet === 'layers' ? null : 'layers')}
            className={`px-3.5 py-2 rounded-full text-xs font-black transition-all flex items-center gap-1.5 border border-transparent ${mobileActiveSheet === 'layers' ? `bg-${brandColor}-500 text-white shadow-xs` : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'}`}
          >
            <Layers className="w-4 h-4 shrink-0" />
            <span>لایه‌ها</span>
            <span className="text-[10px] bg-slate-100 dark:bg-slate-800 text-slate-500 px-1.5 py-0.5 rounded-full font-bold">
              {canvasElements.length}
            </span>
          </button>

          <button
            onClick={() => setMobileActiveSheet(mobileActiveSheet === 'inspector' ? null : 'inspector')}
            className={`px-3.5 py-2 rounded-full text-xs font-black transition-all flex items-center gap-1.5 border border-transparent ${mobileActiveSheet === 'inspector' ? `bg-${brandColor}-500 text-white shadow-xs` : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'}`}
          >
            <Settings2 className="w-4 h-4 shrink-0" />
            <span>تنظیمات</span>
            {selectedElement && (
              <span className={`w-1.5 h-1.5 rounded-full bg-${brandColor}-500 animate-pulse`} />
            )}
          </button>
        </div>
      </div>

      {/* 4. Left Sidebar (Desktop only): Property Inspector */}
      <div className="hidden lg:flex w-80 shrink-0 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-850 flex-col shadow-xs h-full overflow-hidden">
        {/* Tab switcher at the top of Left Property Inspector */}
        <div className="flex border-b border-slate-100 dark:border-slate-850 bg-slate-50/50 dark:bg-slate-900/50 shrink-0">
          <button 
            onClick={() => setInspectorTab('home')}
            className={`flex-1 py-3 text-xs font-black transition-all border-b-2 flex items-center justify-center gap-1.5 ${
              inspectorTab === 'home' ? `border-${brandColor}-500 text-${brandColor}-600 dark:text-${brandColor}-400 bg-white dark:bg-slate-900` : 'border-transparent text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            بلوک‌های صفحه اصلی
          </button>
          <button 
            onClick={() => setInspectorTab('categories')}
            className={`flex-1 py-3 text-xs font-black transition-all border-b-2 flex items-center justify-center gap-1.5 ${
              inspectorTab === 'categories' ? `border-${brandColor}-500 text-${brandColor}-600 dark:text-${brandColor}-400 bg-white dark:bg-slate-900` : 'border-transparent text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300'
            }`}
          >
            <LayoutGrid className="w-3.5 h-3.5" />
            صفحه دسته‌بندی‌ها
          </button>
        </div>
        
        <div className="flex-grow overflow-y-auto p-5">
          {renderInspectorContent()}
        </div>
      </div>

      {/* 5. Mobile Drawers & Sheets Overlay (Only mounted & visible under 1024px viewport sizes) */}
      <MobileSheet 
        isOpen={mobileActiveSheet === 'library'} 
        onClose={() => setMobileActiveSheet(null)} 
        title="افزودن بخش جدید به منو"
      >
        {renderLibraryContent()}
      </MobileSheet>

      <MobileSheet 
        isOpen={mobileActiveSheet === 'layers'} 
        onClose={() => setMobileActiveSheet(null)} 
        title="ترتیب و مدیریت لایه‌های منو"
      >
        {renderLayersContent()}
      </MobileSheet>

      <MobileSheet 
        isOpen={mobileActiveSheet === 'inspector'} 
        onClose={() => setMobileActiveSheet(null)} 
        title={selectedElement ? `تنظیمات بلوک ${selectedElement.label}` : "تنظیمات طراحی ویترین"}
      >
        {renderInspectorContent()}
      </MobileSheet>
    </div>
  );
};

export default CanvasDesigner;
