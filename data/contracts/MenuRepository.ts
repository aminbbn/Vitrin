import { MenuPublication } from '../../domain';

export interface MenuRepository {
  getDesignerDraft(branchId?: string): Promise<any[]>;
  saveDesignerDraft(branchId?: string, elements?: any[]): Promise<void>;
  publishMenu(
    branchId?: string,
    publishedBy?: string,
    elements?: any[],
    categoriesSnapshot?: any[],
    productsSnapshot?: any[],
    branchProductsSnapshot?: any[]
  ): Promise<MenuPublication>;
  getActivePublication(branchId?: string): Promise<MenuPublication | null>;
  getPublicationHistory(branchId?: string): Promise<MenuPublication[]>;
  getPublishedDesign(branchId?: string): Promise<any[]>;
}

