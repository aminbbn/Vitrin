import {
  User,
  UserStatus,
  AuthProvider,
  AppSession,
  UserSession,
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
  MenuDraft,
  MenuPublication,
  MenuPublicationSummary,
  PublicMenuSnapshot,
  TableContext,
  MenuItemView,
  CustomerMenuSource,
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

// Legacy Product shape representing the combined product view model for the UI (excluding rawMaterials/estimatedTime)
export interface Product {
  id: string;
  name: string;
  category: string;
  categoryId?: string;
  description: string;
  price: number;
  image: string;
  modifiers: ModifierGroup[];
  rating?: number;
  reviews?: ProductReview[];
  isAvailable?: boolean;
  discountPrice?: number;
  tags?: string[];
  pendingPrice?: number;
  pendingDiscountPrice?: number;
  hasPendingPublishPrice?: boolean;
  internalName?: string;
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
  const legacyModifiers: ModifierGroup[] = (domainProduct.modifierGroups || []).map(g => ({
    id: g.id,
    name: g.name,
    type: g.type,
    options: (g.options || []).map(opt => ({
      id: opt.id,
      name: opt.name,
      price: opt.priceAdjustmentIRR / 10 // Convert from IRR to Toman for legacy display
    }))
  }));

  return {
    id: domainProduct.id,
    name: domainProduct.name,
    category: categoryName || 'دسته بندی نشده',
    categoryId: domainProduct.categoryId,
    description: domainProduct.description || '',
    price: branchProduct ? (branchProduct.branchPriceIRR / 10) : 0,
    image: domainProduct.imageUrl || domainProduct.imageReference || '',
    modifiers: legacyModifiers,
    rating: 4.5,
    isAvailable: branchProduct ? branchProduct.availability === 'AVAILABLE' : true,
    discountPrice: (branchProduct && branchProduct.branchDiscountPriceIRR) ? (branchProduct.branchDiscountPriceIRR / 10) : undefined,
    tags: domainProduct.tags || [],
    internalName: domainProduct.displayName || domainProduct.name
  };
}

/**
 * Clean adapter helper that creates MenuItemView from Product, Category, and BranchProduct.
 */
export function toMenuItemView(
  product: DomainProduct,
  category: DomainCategory,
  branchProduct: BranchProduct
): MenuItemView {
  return {
    id: product.id,
    productId: product.id,
    categoryId: product.categoryId,
    categoryName: category.name,
    name: product.name,
    displayName: product.displayName,
    description: product.description,
    imageReference: product.imageReference,
    branchPriceIRR: branchProduct.branchPriceIRR,
    branchDiscountPriceIRR: branchProduct.branchDiscountPriceIRR,
    availability: branchProduct.availability,
    isVisible: branchProduct.isVisible,
    modifierGroups: product.modifierGroups || [],
    tags: product.tags
  };
}
