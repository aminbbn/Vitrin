
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
  Layers,
  SplitSquareHorizontal,
  AlignVerticalSpaceAround,
  Smartphone
} from 'lucide-react';

export const SIDEBAR_LINKS = [
  { id: 'dashboard', label: 'داشبورد', icon: <LayoutDashboard className="w-5 h-5" /> },
  { id: 'designer', label: 'طراحی منو', icon: <Palette className="w-5 h-5" /> },
  { id: 'products', label: 'محصولات', icon: <Package className="w-5 h-5" /> },
  { id: 'orders', label: 'سفارشات', icon: <ClipboardList className="w-5 h-5" /> },
  { id: 'analytics', label: 'تحلیل و آمار', icon: <BarChart3 className="w-5 h-5" /> },
  { id: 'settings', label: 'تنظیمات', icon: <Settings className="w-5 h-5" /> },
];

export const COMPONENT_LIBRARY = [
  { 
    category: 'هیرو (بخش معرفی رستوران)',
    items: [
      { 
        id: 'hero-overlay', 
        type: 'hero', 
        label: 'معرفی بصری (Ambiance)', 
        icon: <Layers className="w-4 h-4" />,
        defaults: {
          style: 'overlay',
          title: 'تجربه‌ای فراتر از یک طعم',
          subtitle: 'به دنیای اصالت و کیفیت رستوران لیمو خوش آمدید',
          imageUrl: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=1000&auto=format&fit=crop',
          color: '#ffffff',
          fontSize: 32
        }
      },
      { 
        id: 'hero-stack', 
        type: 'hero', 
        label: 'اصالت و تاریخچه (Legacy)', 
        icon: <AlignVerticalSpaceAround className="w-4 h-4" />,
        defaults: {
          style: 'stack',
          title: 'میراثی از طعم‌های ماندگار',
          subtitle: 'بیش از دو دهه همراهی و میزبانی صمیمانه از ذائقه‌ی شما',
          imageUrl: 'https://images.unsplash.com/photo-1552566626-52f8b828add9?q=80&w=1000&auto=format&fit=crop',
          color: '#0f172a',
          fontSize: 24
        }
      },
      { 
        id: 'hero-split', 
        type: 'hero', 
        label: 'فضا و اتمسفر (Vibe)', 
        icon: <SplitSquareHorizontal className="w-4 h-4" />,
        defaults: {
          style: 'split',
          title: 'فضایی آرام و دلنشین',
          subtitle: 'طراحی مدرن در کنار اصالت، مناسب برای دورهمی‌های خاص شما',
          imageUrl: 'https://images.unsplash.com/photo-1550966841-3ee32386e885?q=80&w=1000&auto=format&fit=crop',
          color: '#0f172a',
          fontSize: 28
        }
      },
    ]
  },
  { 
    category: 'چیدمان محصولات (Menu Layout)',
    items: [
      { 
        id: 'prod-grid', 
        type: 'product-grid', 
        label: 'نمای شبکه‌ای', 
        icon: <LayoutGrid className="w-4 h-4" />,
        defaults: {
          title: 'پیشنهادات ویژه',
          subtitle: 'انتخاب‌های محبوب مشتریان ما',
          fontSize: 18
        }
      },
      { 
        id: 'prod-list', 
        type: 'product-list', 
        label: 'نمای لیستی (کلاسیک)', 
        icon: <ListIcon className="w-4 h-4" />,
        defaults: {
          title: 'نوشیدنی‌های سرد و گرم',
          subtitle: 'طعم‌های تازه و طبیعی',
          fontSize: 18
        }
      },
      { 
        id: 'prod-feat', 
        type: 'featured', 
        label: 'محصول ویژه (Spotlight)', 
        icon: <Star className="w-4 h-4" />,
        defaults: {
          title: 'امضای سرآشپز',
          subtitle: 'هنری از ترکیب طعم‌های اصیل و مدرن',
          imageUrl: 'https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=1000&auto=format&fit=crop',
          color: '#ffffff',
          fontSize: 24
        }
      },
    ]
  }
];

export const SEARCH_ITEMS = [
  { id: 'p1', type: 'product', title: 'پیتزا پپرونی', subtitle: 'پیتزا', detail: '245,000 تومان', icon: 'pizza' },
  { id: 'p2', type: 'product', title: 'برگر کلاسیک', subtitle: 'برگر', detail: '185,000 تومان', icon: 'burger' },
  { id: 'p3', type: 'product', title: 'سالاد سزار', subtitle: 'سالاد', detail: '120,000 تومان', icon: 'salad' },
  { id: 'p4', type: 'product', title: 'سیب‌زمینی سرخ‌کرده', subtitle: 'پیش‌غذا', detail: '85,000 تومان', icon: 'fries' },
  { id: 'p5', type: 'product', title: 'پاستا آلفردو', subtitle: 'پاستا', detail: '190,000 تومان', icon: 'pasta' },
  { id: 'p6', type: 'product', title: 'نوشابه کوکا', subtitle: 'نوشیدنی', detail: '25,000 تومان', icon: 'drink' },
  { id: 'o1', type: 'order', title: 'سفارش #12890', subtitle: 'میز ۵', detail: 'در انتظار', status: 'new' },
  { id: 'o2', type: 'order', title: 'سفارش #12891', subtitle: 'میز ۱۲', detail: 'در حال آماده‌سازی', status: 'preparing' },
  { id: 'o3', type: 'order', title: 'سفارش #12888', subtitle: 'میز ۸', detail: 'آماده تحویل', status: 'ready' },
  { id: 'c1', type: 'customer', title: 'محمد رضایی', subtitle: 'مشتری وفادار', detail: '۰۹۱۲۳۴۵۶۷۸۹', visits: 15 },
  { id: 'c2', type: 'customer', title: 'سارا احمدی', subtitle: 'مشتری جدید', detail: '۰۹۳۵۰۰۰۰۰۰۰', visits: 1 },
  { id: 'c3', type: 'customer', title: 'علی کمالی', subtitle: 'مشتری وفادار', detail: '۰۹۱۲۹۹۹۸۸۷۷', visits: 24 },
];
