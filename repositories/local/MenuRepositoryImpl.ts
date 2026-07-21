import { MenuRepository } from '../menu.repository';
import { MenuPublication, PublicMenuSnapshot, Category, Product, BranchProduct } from '../../domain';
import { localStore } from './LocalStorageAdapter';
import { RepositoryError } from '../errors';

export class MenuRepositoryImpl implements MenuRepository {
  async getDraft(branchId: string): Promise<unknown[]> {
    const store = localStore.load();
    return store.drafts[branchId] || [];
  }

  async saveDraft(branchId: string, elements: unknown[]): Promise<void> {
    const store = localStore.load();
    store.drafts[branchId] = elements;
    localStore.save(store);
  }

  async previewDraft(branchId: string): Promise<PublicMenuSnapshot> {
    const store = localStore.load();
    const elements = store.drafts[branchId] || [];
    const branchProducts = Object.values(store.branchProducts).filter(bp => bp.branchId === branchId);

    return {
      schemaVersion: 2,
      elements,
      categories: store.categories,
      products: store.products,
      branchProducts,
      snapshotAt: new Date().toISOString()
    };
  }

  async listPublications(branchId: string): Promise<MenuPublication[]> {
    const store = localStore.load();
    return store.publications[branchId] || [];
  }

  async publish(
    branchId: string,
    publishedBy: string,
    elements: unknown[],
    categoriesSnapshot: Category[],
    productsSnapshot: Product[],
    branchProductsSnapshot: BranchProduct[]
  ): Promise<MenuPublication> {
    const store = localStore.load();
    const publications = store.publications[branchId] || [];
    const nextVersion = publications.length + 1;

    const snapshot: PublicMenuSnapshot = {
      schemaVersion: 2,
      elements,
      categories: categoriesSnapshot,
      products: productsSnapshot,
      branchProducts: branchProductsSnapshot,
      snapshotAt: new Date().toISOString()
    };

    const newPublication: MenuPublication = {
      id: `pub_${branchId}_v${nextVersion}_${Math.random().toString(36).substring(2, 9)}`,
      branchId,
      restaurantId: store.branches[branchId]?.restaurantId || 'rest_limoo',
      publishedBy,
      version: nextVersion,
      publishedAt: new Date().toISOString(),
      snapshot
    };

    // Store publication
    publications.unshift(newPublication); // Add newest at front
    store.publications[branchId] = publications;
    
    // Set active
    store.activePublications[branchId] = newPublication.id;
    
    // Save draft elements as well
    store.drafts[branchId] = elements;

    localStore.save(store);
    return newPublication;
  }

  async rollback(branchId: string, targetPublicationId: string): Promise<MenuPublication> {
    const store = localStore.load();
    const publications = store.publications[branchId] || [];
    const found = publications.find(p => p.id === targetPublicationId);
    if (!found) {
      throw new RepositoryError('NOT_FOUND', 'نسخه انتشار مورد نظر یافت نشد.');
    }

    // Set active
    store.activePublications[branchId] = found.id;
    
    // Revert draft elements to match published snapshot
    store.drafts[branchId] = found.snapshot.elements || [];

    localStore.save(store);
    return found;
  }

  async getActivePublication(branchId: string): Promise<MenuPublication | null> {
    const store = localStore.load();
    const activeId = store.activePublications[branchId];
    if (!activeId) return null;

    const publications = store.publications[branchId] || [];
    const found = publications.find(p => p.id === activeId);
    return found || null;
  }

  async getPublicMenuSnapshot(branchId: string): Promise<PublicMenuSnapshot | null> {
    const active = await this.getActivePublication(branchId);
    return active ? active.snapshot : null;
  }

  // --- BACKWARD COMPATIBILITY IMPLEMENTATIONS ---

  async getDesignerDraft(branchId?: string): Promise<unknown[]> {
    return this.getDraft(branchId || 'br_west');
  }

  async saveDesignerDraft(branchId?: string, elements?: unknown[]): Promise<void> {
    return this.saveDraft(branchId || 'br_west', elements || []);
  }

  async publishMenu(
    branchId?: string,
    publishedBy?: string,
    elements?: unknown[],
    categoriesSnapshot?: unknown[],
    productsSnapshot?: unknown[],
    branchProductsSnapshot?: unknown[]
  ): Promise<MenuPublication> {
    return this.publish(
      branchId || 'br_west',
      publishedBy || 'مدیر سیستم',
      elements || [],
      (categoriesSnapshot || []) as Category[],
      (productsSnapshot || []) as Product[],
      (branchProductsSnapshot || []) as BranchProduct[]
    );
  }

  async getPublicationHistory(branchId?: string): Promise<MenuPublication[]> {
    return this.listPublications(branchId || 'br_west');
  }

  async getPublishedDesign(branchId?: string): Promise<unknown[]> {
    const active = await this.getActivePublication(branchId || 'br_west');
    return active?.snapshot.elements || [];
  }
}
export const menuRepository = new MenuRepositoryImpl();
