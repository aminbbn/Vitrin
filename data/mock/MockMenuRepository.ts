import { MenuRepository } from '../contracts/MenuRepository';
import { MenuPublication } from '../../domain';
import { menuRepository } from '../../repositories/local/MenuRepositoryImpl';

export class MockMenuRepository implements MenuRepository {
  async getDesignerDraft(branchId?: string): Promise<any[]> {
    const bId = branchId || 'br_west';
    const draft = await menuRepository.getDraft(bId);
    return draft as any[];
  }

  async saveDesignerDraft(branchId?: string, elements?: any[]): Promise<void> {
    const bId = branchId || 'br_west';
    await menuRepository.saveDraft(bId, elements || []);
  }

  async publishMenu(
    branchId?: string,
    publishedBy?: string,
    elements?: any[],
    categoriesSnapshot?: any[],
    productsSnapshot?: any[],
    branchProductsSnapshot?: any[]
  ): Promise<MenuPublication> {
    const bId = branchId || 'br_west';
    return menuRepository.publish(
      bId,
      publishedBy || 'مدیر سیستم',
      elements || [],
      categoriesSnapshot || [],
      productsSnapshot || [],
      branchProductsSnapshot || []
    );
  }

  async getActivePublication(branchId?: string): Promise<MenuPublication | null> {
    const bId = branchId || 'br_west';
    return menuRepository.getActivePublication(bId);
  }

  async getPublicationHistory(branchId?: string): Promise<MenuPublication[]> {
    const bId = branchId || 'br_west';
    return menuRepository.listPublications(bId);
  }

  async getPublishedDesign(branchId?: string): Promise<any[]> {
    const bId = branchId || 'br_west';
    const active = await menuRepository.getActivePublication(bId);
    return (active?.snapshot?.elements || []) as any[];
  }
}

export const mockMenuRepository = new MockMenuRepository();
