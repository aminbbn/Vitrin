
export type ViewState = 'dashboard' | 'designer' | 'products' | 'orders' | 'analytics' | 'settings' | 'search-results' | 'notification-archive' | 'customer-menu' | 'notifications';

export interface ComponentItem {
  id: string;
  type: 'hero' | 'product-grid' | 'product-list' | 'featured' | 'action-btn';
  label: string;
  settings: ComponentSettings;
}

export interface ComponentSettings {
  title?: string;
  subtitle?: string;
  color?: string;
  fontSize?: number;
  padding?: number;
  margin?: number;
  animation?: 'fade' | 'slide' | 'bounce';
  imageUrl?: string;
  style?: 'overlay' | 'stack' | 'split';
}

export interface ProductModifier {
  id: string;
  name: string;
  price: number;
}

export interface ModifierGroup {
  id: string;
  name: string;
  type: 'mandatory' | 'optional';
  options: ProductModifier[];
}

export interface ProductReview {
  id: string;
  user: string;
  comment: string;
  rating: number;
  date: string;
}

export interface Product {
  id: string;
  name: string;
  category: string;
  description: string;
  price: number;
  image: string;
  modifiers: ModifierGroup[];
  rawMaterials?: string[];
  estimatedTime?: string;
  rating?: number;
  reviews?: ProductReview[];
}

export type OrderStatus = 'new' | 'preparing' | 'ready' | 'delivered';

export interface Order {
  id: string;
  tableNumber: number;
  customerName?: string; // Added for details
  items: string[];
  notes?: string; // Added for details
  totalPrice: number;
  status: OrderStatus;
  timestamp: string;
}

export interface Notification {
  id: string;
  type: 'order' | 'inventory' | 'system';
  title: string;
  message: string;
  time: string;
  read: boolean;
  link: ViewState;
}
