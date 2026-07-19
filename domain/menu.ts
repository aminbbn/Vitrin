import { Category, Product, BranchProduct } from './catalog';

export interface MenuDraft {
  id: string; // UUID-like string
  branchId: string;
  restaurantId: string;
  elements: any[]; // Designer elements/blocks
  lastUpdatedBy: string;
  updatedAt: string;
}

export interface MenuPublicationSnapshot {
  schemaVersion: number; // Snapshot schema version
  elements: any[]; // Immutable layout elements
  categories: Category[]; // Immutable category list snapshot
  products: Product[]; // Immutable product catalog snapshot
  branchProducts: BranchProduct[]; // Immutable branch-specific pricing snapshots
  snapshotAt: string;
}

export interface MenuPublication {
  id: string; // UUID-like string
  branchId: string;
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
  sourceMode: 'PREVIEW_DRAFT' | 'PUBLICATION';
}

