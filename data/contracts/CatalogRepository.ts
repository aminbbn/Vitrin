import { Category, Product, BranchProduct } from '../../domain';

export interface CatalogRepository {
  getCategories(): Promise<Category[]>;
  saveCategories(categories: Category[]): Promise<void>;
  getProducts(): Promise<Product[]>;
  getProductById(id: string): Promise<Product | null>;
  saveProducts(products: Product[]): Promise<void>;
  getBranchProduct(productId: string, branchId: string): Promise<BranchProduct | null>;
  saveBranchProduct(branchProduct: BranchProduct): Promise<void>;
  publishBranchProducts(branchId: string): Promise<void>;
  
  // UI Display Settings
  getCategoryPageSettings(): Promise<{ layout: 'grid' | 'list'; columns: number }>;
  updateCategoryPageSettings(settings: { layout?: 'grid' | 'list'; columns?: number }): Promise<void>;
}
