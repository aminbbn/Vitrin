
export type ViewState = 'dashboard' | 'designer' | 'products' | 'orders' | 'analytics' | 'settings';

export interface ComponentItem {
  id: string;
  type: 'hero' | 'product-grid' | 'product-list' | 'featured' | 'action-btn' | 'footer-cart' | 'spin-win' | 'countdown';
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

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  modifiers: ModifierGroup[];
}

export type OrderStatus = 'new' | 'preparing' | 'ready' | 'delivered';

export interface Order {
  id: string;
  tableNumber: number;
  items: string[];
  totalPrice: number;
  status: OrderStatus;
  timestamp: string;
}
