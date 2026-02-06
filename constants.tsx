
import React from 'react';
import { 
  LayoutDashboard, 
  Palette, 
  Package, 
  ClipboardList, 
  BarChart3, 
  Settings,
  Image as ImageIcon,
  LayoutGrid,
  List as ListIcon,
  Star,
  MousePointerClick,
  ShoppingCart,
  RotateCcw,
  Timer
} from 'lucide-react';

export const SIDEBAR_LINKS = [
  { id: 'dashboard', label: 'داشبورد', icon: <LayoutDashboard className="w-5 h-5" /> },
  { id: 'designer', label: 'طراحی منو', icon: <Palette className="w-5 h-5" /> },
  { id: 'products', label: 'محصولات', icon: <Package className="w-5 h-5" /> },
  { id: 'orders', label: 'سفارشات زنده', icon: <ClipboardList className="w-5 h-5" /> },
  { id: 'analytics', label: 'تحلیل و آمار', icon: <BarChart3 className="w-5 h-5" /> },
  { id: 'settings', label: 'تنظیمات', icon: <Settings className="w-5 h-5" /> },
];

export const COMPONENT_LIBRARY = [
  { 
    category: 'هیرو (Hero)',
    items: [
      { id: 'hero-img', type: 'hero', label: 'تصویر تمام صفحه', icon: <ImageIcon className="w-4 h-4" /> },
      { id: 'hero-vid', type: 'hero', label: 'پس‌زمینه ویدیو', icon: <ImageIcon className="w-4 h-4" /> },
    ]
  },
  { 
    category: 'محصولات',
    items: [
      { id: 'prod-grid', type: 'product-grid', label: 'نمای شبکه‌ای', icon: <LayoutGrid className="w-4 h-4" /> },
      { id: 'prod-list', type: 'product-list', label: 'نمای لیستی', icon: <ListIcon className="w-4 h-4" /> },
      { id: 'prod-feat', type: 'featured', label: 'محصول ویژه', icon: <Star className="w-4 h-4" /> },
    ]
  },
  { 
    category: 'اکشن‌ها',
    items: [
      { id: 'act-btn', type: 'action-btn', label: 'دکمه خرید', icon: <MousePointerClick className="w-4 h-4" /> },
      { id: 'act-cart', type: 'footer-cart', label: 'سبد خرید ثابت', icon: <ShoppingCart className="w-4 h-4" /> },
    ]
  },
  { 
    category: 'تعاملی',
    items: [
      { id: 'int-spin', type: 'spin-win', label: 'گردونه شانس', icon: <RotateCcw className="w-4 h-4" /> },
      { id: 'int-count', type: 'countdown', label: 'شمارش معکوس', icon: <Timer className="w-4 h-4" /> },
    ]
  }
];
