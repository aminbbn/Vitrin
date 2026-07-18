import { CatalogRepository } from '../contracts/CatalogRepository';
import { Category, Product, BranchProduct } from '../../domain';
import { storageAdapter } from '../storage/StorageAdapter';

const delay = (ms = 150) => new Promise(resolve => setTimeout(resolve, ms));

export class MockCatalogRepository implements CatalogRepository {
  async getCategories(): Promise<Category[]> {
    await delay();
    return storageAdapter.load().catalog.categories;
  }

  async saveCategories(categories: Category[]): Promise<void> {
    await delay();
    const data = storageAdapter.load();
    data.catalog.categories = categories;
    storageAdapter.save(data);
  }

  async getProducts(): Promise<Product[]> {
    await delay();
    return storageAdapter.load().catalog.products;
  }

  async getProductById(id: string): Promise<Product | null> {
    await delay();
    const products = storageAdapter.load().catalog.products;
    return products.find(p => p.id === id) || null;
  }

  async saveProducts(products: Product[]): Promise<void> {
    await delay();
    const data = storageAdapter.load();
    data.catalog.products = products;
    storageAdapter.save(data);
  }

  async getBranchProduct(productId: string, branchId: string): Promise<BranchProduct | null> {
    await delay();
    const product = await this.getProductById(productId);
    if (!product) return null;
    
    // In our mock, all products are available centrally
    return {
      productId,
      branchId,
      branchPriceRial: product.price,
      isAvailable: product.isAvailable !== false,
      branchDiscountPriceRial: product.discountPrice
    };
  }

  async saveBranchProduct(branchProduct: BranchProduct): Promise<void> {
    await delay();
    const data = storageAdapter.load();
    const index = data.catalog.products.findIndex(p => p.id === branchProduct.productId);
    if (index !== -1) {
      data.catalog.products[index].price = branchProduct.branchPriceRial;
      data.catalog.products[index].isAvailable = branchProduct.isAvailable;
      data.catalog.products[index].discountPrice = branchProduct.branchDiscountPriceRial;
      storageAdapter.save(data);
    }
  }

  async getCategoryPageSettings(): Promise<{ layout: 'grid' | 'list'; columns: number }> {
    await delay();
    const data = storageAdapter.load();
    return {
      layout: data.catalog.categoryPageLayout,
      columns: data.catalog.categoryPageColumns,
    };
  }

  async updateCategoryPageSettings(settings: { layout?: 'grid' | 'list'; columns?: number }): Promise<void> {
    await delay();
    const data = storageAdapter.load();
    if (settings.layout !== undefined) data.catalog.categoryPageLayout = settings.layout;
    if (settings.columns !== undefined) data.catalog.categoryPageColumns = settings.columns;
    storageAdapter.save(data);
  }
}
export const mockCatalogRepository = new MockCatalogRepository();
