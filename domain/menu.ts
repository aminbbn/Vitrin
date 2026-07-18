import { Category, Product, BranchProduct } from './catalog';

export interface MenuDraft {
  id: string; // UUID-like string
  restaurantId: string;
  lastUpdatedBy: string;
  updatedAt: string;
}

export interface MenuPublicationSnapshot {
  categories: Category[];
  products: Product[];
  branchProducts: BranchProduct[];
  snapshotAt: string;
}

export interface MenuPublication {
  id: string; // UUID-like string
  restaurantId: string;
  publishedBy: string;
  version: number;
  publishedAt: string;
  snapshot: MenuPublicationSnapshot; // Immutable versioned snapshot of the menu catalog
}

export interface CustomerMenuSource {
  branchId: string;
  restaurantId: string;
  publicationId: string;
  versionSnapshot: MenuPublicationSnapshot;
}
