
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
  { id: 'customer-menu', label: 'نمای مشتری', icon: <Smartphone className="w-5 h-5" /> },
  { id: 'settings', label: 'تنظیمات', icon: <Settings className="w-5 h-5" /> },
];

export const COMPONENT_LIBRARY = [
  { 
    category: 'هیرو (Hero Styles)',
    items: [
      { 
        id: 'hero-overlay', 
        type: 'hero', 
        label: 'متن روی تصویر', 
        icon: <Layers className="w-4 h-4" />,
        defaults: {
          style: 'overlay',
          title: 'بهترین برگر شهر',
          subtitle: 'طعم واقعی گوشت تازه گریل شده',
          imageUrl: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=1000&auto=format&fit=crop',
          color: '#ffffff',
          fontSize: 24
        }
      },
      { 
        id: 'hero-stack', 
        type: 'hero', 
        label: 'متن زیر تصویر', 
        icon: <AlignVerticalSpaceAround className="w-4 h-4" />,
        defaults: {
          style: 'stack',
          title: 'پیتزاهای ایتالیایی',
          subtitle: 'پخت در تنور سنگی با رسپی اصیل',
          imageUrl: 'https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?q=80&w=1000&auto=format&fit=crop',
          color: '#0f172a',
          fontSize: 20
        }
      },
      { 
        id: 'hero-split', 
        type: 'hero', 
        label: 'هیرو تعاملی (Split)', 
        icon: <SplitSquareHorizontal className="w-4 h-4" />,
        defaults: {
          style: 'split',
          title: 'پیشنهاد سرآشپز',
          subtitle: 'یک تجربه متفاوت برای شام امشب',
          imageUrl: 'https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=1000&auto=format&fit=crop',
          color: '#0f172a',
          fontSize: 22
        }
      },
    ]
  },
  { 
    category: 'چیدمان (Layout)',
    items: [
      { 
        id: 'prod-grid', 
        type: 'product-grid', 
        label: 'نمای شبکه‌ای', 
        icon: <LayoutGrid className="w-4 h-4" />,
        defaults: {
          title: 'پیتزاها',
          subtitle: 'انتخاب مشتریان',
          fontSize: 18
        }
      },
      { 
        id: 'prod-list', 
        type: 'product-list', 
        label: 'نمای لیستی', 
        icon: <ListIcon className="w-4 h-4" />,
        defaults: {
          title: 'نوشیدنی‌ها',
          subtitle: 'خنک بنوشید',
          fontSize: 18
        }
      },
      { 
        id: 'prod-feat', 
        type: 'featured', 
        label: 'محصول ویژه', 
        icon: <Star className="w-4 h-4" />,
        defaults: {
          title: 'استیک ریب‌آی مخصوص',
          subtitle: 'گریل شده با سس قارچ',
          imageUrl: 'https://images.unsplash.com/photo-1546964124-0cce460f38ef?q=80&w=1000&auto=format&fit=crop',
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
