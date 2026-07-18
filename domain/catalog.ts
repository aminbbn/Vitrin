export interface Category {
  id: string; // UUID-like string
  name: string;
  image?: string;
  icon?: string;
  order: number;
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
  name: string;
  description: string;
  imageUrl?: string;
  estimatedTime?: string;
  rating?: number;
  tags?: string[];
  modifierGroups: ModifierGroup[];
  createdAt: string;
}

export interface BranchProduct {
  id: string; // UUID-like string
  branchId: string;
  productId: string;
  branchPriceRial: number; // Integer IRR
  branchDiscountPriceRial?: number; // Integer IRR
  isAvailable: boolean;
  orderingEnabled: boolean;
  isVisible: boolean;
}
