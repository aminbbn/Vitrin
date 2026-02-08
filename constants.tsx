
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
  AlignVerticalSpaceAround
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
  },
  { 
    category: 'اکشن‌ها',
    items: [
      { 
        id: 'act-btn', 
        type: 'action-btn', 
        label: 'دکمه خرید', 
        icon: <MousePointerClick className="w-4 h-4" />,
        defaults: {
          title: 'مشاهده منوی کامل',
          color: '#ffffff',
          fontSize: 16
        }
      },
    ]
  }
];
