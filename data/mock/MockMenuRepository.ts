import { MenuRepository } from '../contracts/MenuRepository';
import { storageAdapter } from '../storage/StorageAdapter';

const delay = (ms = 150) => new Promise(resolve => setTimeout(resolve, ms));

export class MockMenuRepository implements MenuRepository {
  async getDesignerDraft(): Promise<any[]> {
    await delay();
    return storageAdapter.load().menu.designerDraft;
  }

  async saveDesignerDraft(elements: any[]): Promise<void> {
    await delay();
    const data = storageAdapter.load();
    data.menu.designerDraft = elements;
    storageAdapter.save(data);
  }

  async publishMenu(elements: any[]): Promise<void> {
    await delay(500); // simulate slightly longer publish operation
    const data = storageAdapter.load();
    data.menu.designerDraft = elements;
    data.menu.publishedDesign = elements;
    storageAdapter.save(data);
  }

  async getPublishedDesign(): Promise<any[]> {
    await delay();
    return storageAdapter.load().menu.publishedDesign;
  }
}
export const mockMenuRepository = new MockMenuRepository();
