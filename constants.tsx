
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
  { id: 'p1', type: 'product', title: 'پیتزا پپرونی', subtitle: 'پیتزا', detail: '245,000 تومان', icon: 'pizza', keywords: 'پیتزا پپرونی فست فود pepperoni pizza' },
  { id: 'p2', type: 'product', title: 'برگر کلاسیک', subtitle: 'برگر', detail: '185,000 تومان', icon: 'burger', keywords: 'برگر کلاسیک همبرگر فست فود burger' },
  { id: 'p3', type: 'product', title: 'سالاد سزار', subtitle: 'سالاد', detail: '120,000 تومان', icon: 'salad', keywords: 'سالاد سزار پیش غذا salad cesar' },
  { id: 'p4', type: 'product', title: 'سیب‌زمینی سرخ‌کرده', subtitle: 'پیش‌غذا', detail: '85,000 تومان', icon: 'fries', keywords: 'سیب‌زمینی سرخ‌کرده سیب زمینی سرخ کرده پیش غذا fries potato' },
  { id: 'p5', type: 'product', title: 'پاستا آلفردو', subtitle: 'پاستا', detail: '190,000 تومان', icon: 'pasta', keywords: 'پاستا آلفردو پنه مرغ قارچ pasta alfredo' },
  { id: 'p6', type: 'product', title: 'نوشابه کوکا', subtitle: 'نوشیدنی', detail: '25,000 تومان', icon: 'drink', keywords: 'نوشابه کوکا نوشیدنی گازدار کوکاکولا coke drink soda' },
  { id: 'o1', type: 'order', title: 'سفارش #12890', subtitle: 'میز ۵', detail: 'در انتظار', status: 'new', keywords: 'سفارش میز ۵ در انتظار جدید order table 5 wait' },
  { id: 'o2', type: 'order', title: 'سفارش #12891', subtitle: 'میز ۱۲', detail: 'در حال آماده‌سازی', status: 'preparing', keywords: 'سفارش میز ۱۲ در حال آماده‌سازی آماده سازی آماده سازی سفارش order table 12 prep' },
  { id: 'o3', type: 'order', title: 'سفارش #12888', subtitle: 'میز ۸', detail: 'آماده تحویل', status: 'ready', keywords: 'سفارش میز ۸ آماده تحویل آماده تحویل آماده سفارش order table 8 ready' },
  { id: 'c1', type: 'customer', title: 'محمد رضایی', subtitle: 'مشتری وفادار', detail: '۰۹۱۲۳۴۵۶۷۸۹', visits: 15, phone: '۰۹۱۲۳۴۵۶۷۸۹', email: 'm.rezaei@gmail.com', joinDate: '۱۴۰۱/۱۰/۱۲', orders: 15, spent: '۳,۲۰۰,۰۰۰', favorite: 'برگر کلاسیک', keywords: 'محمد رضایی مشتری وفادار تلفن شماره موبایل customer rezaei' },
  { id: 'c2', type: 'customer', title: 'سارا احمدی', subtitle: 'مشتری جدید', detail: '۰۹۳۵۰۰۰۰۰۰۰', visits: 1, phone: '۰۹۳۵۰۰۰۰۰۰۰', email: 'sara.ahmadi@yahoo.com', joinDate: '۱۴۰۲/۰6/۰۱', orders: 1, spent: '۲۴۰,۰۰۰', favorite: 'پیتزا سبزیجات', keywords: 'سارا احمدی مشتری جدید تلفن شماره موبایل customer ahmadi' },
  { id: 'c3', type: 'customer', title: 'علی کمالی', subtitle: 'مشتری وفادار', detail: '۰۹۱۲۹۹۹۸۸۷۷', visits: 24, phone: '۰۹۱۲۹۹۹۸۸۷۷', email: 'ali.kamali@gmail.com', joinDate: '۱۴۰۱/۰۴/۱۵', orders: 24, spent: '۵,۴۰۰,۰۰۰', favorite: 'پاستا آلفردو', keywords: 'علی کمالی مشتری وفادار تلفن شماره موبایل customer kamali' },
  
  // Settings sections (which are searchable and navigate directly)
  { id: 'identity', type: 'setting', title: 'هویت بصری (نام و لوگوی رستوران)', subtitle: 'تنظیمات > بخش اطلاعات اصلی و هویت بصری', detail: 'تنظیمات', icon: 'store', keywords: 'نام لوگو شعار تصویر عکس رستوران مشخصات هویت بصری لوگوی رستوران نام رستوران توضیحات کوتاه هویت اصلی identity logo name brand profile' },
  { id: 'branding', type: 'setting', title: 'رنگ سازمانی و تم رنگی', subtitle: 'تنظیمات > تم رنگی پنل و منو', detail: 'تنظیمات', icon: 'palette', keywords: 'رنگ تم رنگ سازمانی پوسته تم رنگی پنل منو برند رنگی رنگها رنگها رنگهای سازمانی emerald blue purple orange red color theme brand' },
  { id: 'contact', type: 'setting', title: 'اطلاعات تماس و آدرس رستوران', subtitle: 'تنظیمات > آدرس کامل، تلفن و شبکه‌های اجتماعی', detail: 'تنظیمات', icon: 'map', keywords: 'آدرس تلفن تماس شماره اینستاگرام سایت وبسایت نقشه لوکیشن ارتباط راه ارتباطی شماره تماس آدرس کامل phone contact address location map' },
  { id: 'hours', type: 'setting', title: 'ساعات کاری و زمان‌بندی', subtitle: 'تنظیمات > زمان‌بندی فعالیت و روزهای کاری رستوران', detail: 'تنظیمات', icon: 'clock', keywords: 'ساعت ساعت کاری زمانبندی تعطیل روزهای کاری زمان کارکرد ساعات کاری هفته clock hours timing open close work hours' },
  
  // App views/pages
  { id: 'dashboard', type: 'navigation', title: 'صفحه داشبورد مدیریت', subtitle: 'منوی اصلی > خلاصه عملکرد روزانه رستوران', detail: 'صفحات و منوها', icon: 'dashboard', keywords: 'داشبورد خلاصه گزارش خانه صفحه اصلی آمار روزانه داشبورد مدیریت dashboard home stats' },
  { id: 'designer', type: 'navigation', title: 'طراحی بصری منو و قالب', subtitle: 'منوی اصلی > ویرایشگر هیرو، قالب و چیدمان محصولات', detail: 'صفحات و منوها', icon: 'palette', keywords: 'طراحی طراحی منو قالب هیرو چیدمان محصولات ظاهر منو ویرایشگر بصری هیرو بخش معرفی designer menu templates layout canvas designer' },
  { id: 'products', type: 'navigation', title: 'مدیریت محصولات و منو', subtitle: 'منوی اصلی > تعریف غذاها، قیمت‌ها و دسته‌بندی‌ها', detail: 'صفحات و منوها', icon: 'package', keywords: 'محصولات منو غذا غذاها قیمت دسته بندی قیمت ها محصولات مدیر کالا کالاها تعریف غذاها محصولات و منو products items category price' },
  { id: 'orders', type: 'navigation', title: 'برد مدیریت سفارشات', subtitle: 'منوی اصلی > پیگیری سفارش‌های دریافتی، میزها و وضعیت آماده‌سازی', detail: 'صفحات و منوها', icon: 'clipboard', keywords: 'سفارشات برد سفارشات پیگیری سفارش میز وضعیت آماده سازی سفارش ها مدیریت سفارشات orders board status tables' },
  { id: 'analytics', type: 'navigation', title: 'تحلیل، آمار و گزارشات', subtitle: 'منوی اصلی > گزارش فروش، درآمد و رفتار مشتریان', detail: 'صفحات و منوها', icon: 'barchart', keywords: 'تحلیل آمار گزارش نمودار فروش درآمد سود مشتریان گزارشات عملکرد آمارها تحلیل و آمار analytics charts sales revenue reports' },
  { id: 'settings', type: 'navigation', title: 'تنظیمات فروشگاه و سیستم', subtitle: 'منوی اصلی > مدیریت اطلاعات رستوران و شخصی‌سازی پنل', detail: 'صفحات و منوها', icon: 'settings', keywords: 'تنظیمات تنظیمات فروشگاه سیستم مدیریت اطلاعات رستوران شخصی‌سازی پنل settings configuration system shop setup' },
];
