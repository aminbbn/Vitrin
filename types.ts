import {
  User,
  UserStatus,
  AuthProvider,
  AppSession,
  Restaurant,
  Branch,
  RestaurantMembership,
  MembershipRole,
  MembershipStatus,
  MembershipPermission,
  Category as DomainCategory,
  Product as DomainProduct,
  BranchProduct,
  ModifierGroup as DomainModifierGroup,
  ModifierOption as DomainModifierOption,
  ProductModifierGroup,
  MenuDraft,
  MenuPublication,
  MenuPublicationSnapshot,
  CustomerMenuSource,
  OrderType,
  OrderStatus as DomainOrderStatus,
  CustomerOrder,
  OrderItem,
  OrderItemModifier,
  DineInContext,
  PaymentMethod,
  PaymentStatus,
  Payment,
  isTerminalOrderStatus,
  isActiveMembership,
  hasPermission,
  getBranchProductEffectivePrice
} from './domain';

// --- UI-ONLY & VIEW STATE TYPES ---
export type ViewState = 'dashboard' | 'designer' | 'products' | 'categories' | 'orders' | 'analytics' | 'settings' | 'search-results' | 'notification-archive' | 'customer-menu' | 'notifications';

export interface ComponentItem {
  id: string;
  type: 'hero' | 'product-grid' | 'product-list' | 'featured' | 'action-btn' | 'category-display' | 'footer';
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
  layout?: 'grid' | 'scroll';
  phone?: string;
  address?: string;
  customText?: string;
  showInstagram?: boolean;
  showWhatsapp?: boolean;
  showTwitter?: boolean;
}

export interface ProductReview {
  id: string;
  user: string;
  comment: string;
  rating: number;
  date: string;
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

// --- RE-EXPORT ALL DOMAIN ENTITIES & HELPER GUARDS ---
export * from './domain';

// --- COMPATIBILITY / LEGACY-SHAPED VIEW MODELS (explicit adapters for Old UI) ---

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

export interface Category {
  id: string;
  name: string;
  image?: string;
  icon?: string;
  order: number;
}

// Legacy Product shape representing the combined product view model for the UI
export interface Product {
  id: string;
  name: string;
  category: string;
  categoryId?: string;
  description: string;
  price: number;
  image: string;
  modifiers: ModifierGroup[];
  rawMaterials?: string[]; // Note: legacy rawMaterials is excluded from new domain models, but kept here in the view-model adapter to prevent compilation breakage of the legacy dashboard forms
  estimatedTime?: string;
  rating?: number;
  reviews?: ProductReview[];
  isAvailable?: boolean;
  discountPrice?: number;
  tags?: string[];
}

export type OrderStatus = 'new' | 'preparing' | 'ready' | 'delivered';

export interface Order {
  id: string;
  tableNumber: number;
  customerName?: string;
  items: string[];
  notes?: string;
  totalPrice: number;
  status: OrderStatus;
  timestamp: string;
}

// --- EXPLICIT COMPATIBILITY ADAPTER FUNCTIONS ---

/**
 * Maps clean domain models (Product & BranchProduct) into the legacy view-model Product shape for UI.
 */
export function toProductViewModel(
  domainProduct: DomainProduct,
  branchProduct?: BranchProduct,
  categoryName?: string
): Product {
  const legacyModifiers: ModifierGroup[] = domainProduct.modifierGroups.map(g => ({
    id: g.id,
    name: g.name,
    type: g.type,
    options: g.options.map(opt => ({
      id: opt.id,
      name: opt.name,
      price: opt.priceRial
    }))
  }));

  return {
    id: domainProduct.id,
    name: domainProduct.name,
    category: categoryName || 'دسته بندی نشده',
    categoryId: domainProduct.categoryId,
    description: domainProduct.description,
    price: branchProduct ? branchProduct.branchPriceRial : 0,
    image: domainProduct.imageUrl || '',
    modifiers: legacyModifiers,
    estimatedTime: domainProduct.estimatedTime,
    rating: domainProduct.rating,
    isAvailable: branchProduct ? branchProduct.isAvailable : true,
    discountPrice: branchProduct ? branchProduct.branchDiscountPriceRial : undefined,
    tags: domainProduct.tags,
    rawMaterials: [] // Empty fallback since legacy raw materials are excluded from domain models
  };
}

/**
 * Maps a clean CustomerOrder into the legacy view-model Order shape for UI.
 */
export function toOrderViewModel(customerOrder: CustomerOrder): Order {
  let legacyStatus: OrderStatus = 'new';
  if (customerOrder.status === DomainOrderStatus.PREPARING) {
    legacyStatus = 'preparing';
  } else if (customerOrder.status === DomainOrderStatus.READY) {
    legacyStatus = 'ready';
  } else if (
    customerOrder.status === DomainOrderStatus.COMPLETED ||
    customerOrder.status === DomainOrderStatus.OUT_FOR_DELIVERY
  ) {
    legacyStatus = 'delivered';
  }

  return {
    id: customerOrder.id,
    tableNumber: customerOrder.dineInTable?.tableNumber || 0,
    customerName: customerOrder.customerName,
    items: customerOrder.items.map(item => `${item.name} x${item.quantity}`),
    notes: customerOrder.notes,
    totalPrice: customerOrder.grandTotalRial,
    status: legacyStatus,
    timestamp: customerOrder.createdAt
  };
}
