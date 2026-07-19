import { MenuRepository } from '../contracts/MenuRepository';
import { storageAdapter } from '../storage/StorageAdapter';
import { MenuPublication } from '../../domain';

const delay = (ms = 150) => new Promise(resolve => setTimeout(resolve, ms));

export class MockMenuRepository implements MenuRepository {
  async getDesignerDraft(branchId?: string): Promise<any[]> {
    await delay();
    const bId = branchId || 'b1';
    const data = storageAdapter.load();
    
    if (!data.menu.drafts) {
      data.menu.drafts = {};
    }
    
    const draft = data.menu.drafts[bId];
    if (draft) {
      return draft;
    }
    
    // Fallback to legacy global designerDraft
    return data.menu.designerDraft || [];
  }

  async saveDesignerDraft(branchId?: string, elements?: any[]): Promise<void> {
    await delay();
    const bId = branchId || 'b1';
    const data = storageAdapter.load();
    
    if (!data.menu.drafts) {
      data.menu.drafts = {};
    }
    
    const elems = elements || [];
    data.menu.drafts[bId] = elems;
    
    // For backward compatibility if it's the main branch
    if (bId === 'b1') {
      data.menu.designerDraft = elems;
    }
    
    storageAdapter.save(data);
  }

  async publishMenu(
    branchId?: string,
    publishedBy?: string,
    elements?: any[],
    categoriesSnapshot?: any[],
    productsSnapshot?: any[],
    branchProductsSnapshot?: any[]
  ): Promise<MenuPublication> {
    await delay(600); // simulate slightly longer publish operation
    const bId = branchId || 'b1';
    const pubBy = publishedBy || 'مدیر سیستم';
    const data = storageAdapter.load();
    
    if (!data.menu.publications) {
      data.menu.publications = {};
    }
    if (!data.menu.activePublications) {
      data.menu.activePublications = {};
    }
    
    const branchPubs = data.menu.publications[bId] || [];
    const version = branchPubs.length + 1;
    const pubId = `pub-${bId}-${Date.now()}`;
    
    // If elements not passed, use the current draft
    const finalElements = elements || data.menu.drafts?.[bId] || data.menu.designerDraft || [];
    
    // Create an immutable versioned snapshot of the catalog
    const snapshot = {
      schemaVersion: 1,
      elements: JSON.parse(JSON.stringify(finalElements)),
      categories: JSON.parse(JSON.stringify(categoriesSnapshot || data.catalog.categories || [])),
      products: JSON.parse(JSON.stringify(productsSnapshot || data.catalog.products || [])),
      branchProducts: JSON.parse(JSON.stringify(branchProductsSnapshot || data.catalog.branchProducts || [])),
      snapshotAt: new Date().toISOString()
    };
    
    const newPub: MenuPublication = {
      id: pubId,
      branchId: bId,
      restaurantId: data.auth.activeRestaurantId || 'r1',
      publishedBy: pubBy,
      version,
      publishedAt: new Date().toISOString(),
      snapshot
    };
    
    branchPubs.push(newPub);
    data.menu.publications[bId] = branchPubs;
    data.menu.activePublications[bId] = pubId;
    
    // Ensure draft is updated/saved as well
    if (!data.menu.drafts) {
      data.menu.drafts = {};
    }
    data.menu.drafts[bId] = finalElements;
    
    // For backward compatibility if b1
    if (bId === 'b1') {
      data.menu.designerDraft = finalElements;
      data.menu.publishedDesign = finalElements;
    }
    
    storageAdapter.save(data);
    return newPub;
  }

  async getActivePublication(branchId?: string): Promise<MenuPublication | null> {
    await delay();
    const bId = branchId || 'b1';
    const data = storageAdapter.load();
    
    const activeId = data.menu.activePublications?.[bId];
    if (!activeId) return null;
    
    const branchPubs = data.menu.publications?.[bId] || [];
    const found = branchPubs.find((p: any) => p.id === activeId);
    return found || null;
  }

  async getPublicationHistory(branchId?: string): Promise<MenuPublication[]> {
    await delay();
    const bId = branchId || 'b1';
    const data = storageAdapter.load();
    return data.menu.publications?.[bId] || [];
  }

  async getPublishedDesign(branchId?: string): Promise<any[]> {
    await delay();
    const bId = branchId || 'b1';
    const data = storageAdapter.load();
    
    const activeId = data.menu.activePublications?.[bId];
    if (activeId) {
      const branchPubs = data.menu.publications?.[bId] || [];
      const found = branchPubs.find((p: any) => p.id === activeId);
      if (found) {
        return found.snapshot.elements;
      }
    }
    
    return data.menu.publishedDesign || [];
  }
}

export const mockMenuRepository = new MockMenuRepository();
