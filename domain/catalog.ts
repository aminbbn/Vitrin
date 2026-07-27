export interface ModifierOption {
  id: string; // UUID-like string
  name: string;
  priceAdjustmentIRR: number; // Integer IRR display-only price adjustment
}

export interface ModifierGroup {
  id: string; // UUID-like string
  name: string;
  type: 'mandatory' | 'optional';
  options: ModifierOption[];
}

export interface Category {
  id: string;
  restaurantId: string;
  name: string;
  displayOrder: number;
  isActive: boolean;
  archivedAt?: string;
  image?: string; // fallback
  icon?: string; // fallback
}

export interface Product {
  id: string;
  restaurantId: string;
  categoryId: string;
  name: string;
  displayName: string;
  description?: string;
  imageReference?: string; // image reference optional
  imageUrl?: string; // fallback for legacy views
  isActive: boolean;
  archivedAt?: string;
  modifierGroups?: ModifierGroup[];
  tags?: string[];
}

export interface BranchProduct {
  id: string;
  branchId: string;
  productId: string;
  branchPriceIRR: number;
  branchDiscountPriceIRR?: number;
  availability: 'AVAILABLE' | 'UNAVAILABLE';
  isVisible: boolean;
  // Pending price fields (client-side tracking before publish)
  pendingPriceIRR?: number;
  pendingDiscountPriceIRR?: number;
  hasPendingPublishPrice?: boolean;
}

export interface MenuItemView {
  id: string; // unique item view or product ID
  productId: string;
  categoryId: string;
  categoryName: string;
  name: string;
  displayName: string;
  description?: string;
  imageReference?: string;
  branchPriceIRR: number;
  branchDiscountPriceIRR?: number;
  availability: 'AVAILABLE' | 'UNAVAILABLE';
  isVisible: boolean;
  modifierGroups: ModifierGroup[];
  tags?: string[];
}
