import { MenuPublication, PublicMenuSnapshot, Category, Product, BranchProduct } from '../domain';

export interface MenuRepository {
  // Designer Draft
  getDraft(branchId: string): Promise<unknown[]>;
  saveDraft(branchId: string, elements: unknown[]): Promise<void>;
  previewDraft(branchId: string): Promise<PublicMenuSnapshot>;
  
  // Backward compatibility signatures
  getDesignerDraft(branchId?: string): Promise<unknown[]>;
  saveDesignerDraft(branchId?: string, elements?: unknown[]): Promise<void>;

  // Publications
  listPublications(branchId: string): Promise<MenuPublication[]>;
  publish(
    branchId: string,
    publishedBy: string,
    elements: unknown[],
    categoriesSnapshot: Category[],
    productsSnapshot: Product[],
    branchProductsSnapshot: BranchProduct[]
  ): Promise<MenuPublication>;
  rollback(branchId: string, targetPublicationId: string): Promise<MenuPublication>;
  getActivePublication(branchId: string): Promise<MenuPublication | null>;
  getPublicMenuSnapshot(branchId: string): Promise<PublicMenuSnapshot | null>;

  // Backward compatibility signatures
  publishMenu(
    branchId?: string,
    publishedBy?: string,
    elements?: unknown[],
    categoriesSnapshot?: unknown[],
    productsSnapshot?: unknown[],
    branchProductsSnapshot?: unknown[]
  ): Promise<MenuPublication>;
  getPublicationHistory(branchId?: string): Promise<MenuPublication[]>;
  getPublishedDesign(branchId?: string): Promise<unknown[]>;
}
