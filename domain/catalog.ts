export interface Category {
  id: string; // UUID-like string
  name: string;
  image?: string;
  icon?: string;
  order: number;
  state?: 'active' | 'archived';
}

export interface ModifierOption {
  id: string; // UUID-like string
  name: string;
  priceRial: number; // Integer IRR
}

export interface ModifierGroup {
  id: string; // UUID-like string
  name: string;
  type: 'mandatory' | 'optional';
  options: ModifierOption[];
}

export interface ProductModifierGroup {
  productId: string;
  modifierGroupId: string;
  order: number;
}

export interface Product {
  id: string; // UUID-like string
  categoryId: string; // A Product belongs to exactly one Category
  internalName?: string; // Master identity internal name
  name: string; // Customer-facing display name
  description: string;
  imageUrl?: string;
  estimatedTime?: string;
  rating?: number;
  tags?: string[];
  modifierGroups: ModifierGroup[];
  createdAt: string;
  state?: 'active' | 'archived';
}

export interface BranchProduct {
  id: string; // UUID-like string
  branchId: string;
  productId: string;
  branchPriceRial: number; // Integer IRR (Published)
  branchDiscountPriceRial?: number; // Integer IRR (Published)
  pendingPriceRial?: number; // Integer IRR (Unpublished)
  pendingDiscountPriceRial?: number; // Integer IRR (Unpublished)
  hasPendingPublishPrice?: boolean; // Subtle pending-publish indicator flag
  isAvailable: boolean; // Immediate status
  availability: 'AVAILABLE' | 'UNAVAILABLE'; // Immediate status presented as AVAILABLE/UNAVAILABLE
  orderingEnabled: boolean;
  isVisible: boolean;
}
