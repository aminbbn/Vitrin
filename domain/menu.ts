import { Category, Product, BranchProduct } from './catalog';

export interface MenuDraft {
  id: string;
  branchId: string;
  restaurantId: string;
  elements: unknown[]; // replace any with unknown to comply with "no any"
  lastUpdatedBy: string;
  updatedAt: string;
}

export interface PublicMenuSnapshot {
  schemaVersion: number;
  elements?: unknown[]; // optional designer elements
  categories: Category[];
  products: Product[];
  branchProducts: BranchProduct[];
  snapshotAt: string;
}

export interface MenuPublication {
  id: string;
  branchId: string;
  restaurantId: string;
  publishedBy: string;
  version: number;
  publishedAt: string;
  snapshot: PublicMenuSnapshot;
}

export interface MenuPublicationSummary {
  id: string;
  branchId: string;
  version: number;
  publishedAt: string;
  publishedBy: string;
}

export interface TableContext {
  tableNumber: number;
  qrCodeUrl?: string;
  capacity?: number;
}

export interface CustomerMenuSource {
  branchId: string;
  restaurantId: string;
  publicationId: string;
  versionSnapshot: PublicMenuSnapshot;
  sourceMode: 'PREVIEW_DRAFT' | 'PUBLICATION';
}

