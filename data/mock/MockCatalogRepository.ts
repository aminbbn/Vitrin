import { CatalogRepository } from '../contracts/CatalogRepository';
import { Category, Product, BranchProduct } from '../../domain';
import { catalogRepository } from '../../repositories/local/CatalogRepositoryImpl';
import { branchSettingsRepository } from '../../repositories/local/BranchSettingsRepositoryImpl';
import { localStore } from '../../repositories/local/LocalStorageAdapter';

export class MockCatalogRepository implements CatalogRepository {
  async getCategories(): Promise<Category[]> {
    return catalogRepository.listCategories();
  }

  async saveCategories(categories: Category[]): Promise<void> {
    await catalogRepository.saveCategories(categories);
  }

  async getProducts(): Promise<Product[]> {
    return catalogRepository.listProducts();
  }

  async getProductById(id: string): Promise<Product | null> {
    return catalogRepository.getProduct(id);
  }

  async saveProducts(products: Product[]): Promise<void> {
    await catalogRepository.saveProducts(products);
  }

  async getBranchProduct(productId: string, branchId: string): Promise<BranchProduct | null> {
    const bp = await catalogRepository.getBranchProduct(productId, branchId);
    if (!bp) return null;
    
    return {
      ...bp,
      branchPriceRial: (bp as any).branchPriceRial ?? bp.branchPriceIRR,
      branchDiscountPriceRial: (bp as any).branchDiscountPriceRial ?? bp.branchDiscountPriceIRR,
    } as any;
  }

  async saveBranchProduct(branchProduct: BranchProduct): Promise<void> {
    const bp: any = {
      ...branchProduct,
      branchPriceIRR: branchProduct.branchPriceIRR ?? (branchProduct as any).branchPriceRial,
      branchDiscountPriceIRR: branchProduct.branchDiscountPriceIRR ?? (branchProduct as any).branchDiscountPriceRial,
      branchPriceRial: (branchProduct as any).branchPriceRial ?? branchProduct.branchPriceIRR,
      branchDiscountPriceRial: (branchProduct as any).branchDiscountPriceRial ?? branchProduct.branchDiscountPriceIRR,
    };
    await catalogRepository.saveBranchProduct(bp);
  }

  async publishBranchProducts(branchId: string): Promise<void> {
    // Intentionally no-op in local stage
  }

  async getCategoryPageSettings(): Promise<{ layout: 'grid' | 'list'; columns: number }> {
    const store = localStore.load();
    const branchId = store.session.activeBranchId || 'br_west';
    const settings = await branchSettingsRepository.getSettings(branchId);
    return {
      layout: settings.categoryPageLayout,
      columns: settings.categoryPageColumns
    };
  }

  async updateCategoryPageSettings(settings: { layout?: 'grid' | 'list'; columns?: number }): Promise<void> {
    const store = localStore.load();
    const branchId = store.session.activeBranchId || 'br_west';
    await branchSettingsRepository.updateSettings(branchId, {
      categoryPageLayout: settings.layout,
      categoryPageColumns: settings.columns
    });
  }
}

export const mockCatalogRepository = new MockCatalogRepository();
