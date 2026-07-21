import { Category, Product, BranchProduct, MenuItemView } from '../domain';

export interface CatalogRepository {
  // Categories CRUD
  listCategories(): Promise<Category[]>;
  getCategory(id: string): Promise<Category | null>;
  createCategory(category: Omit<Category, 'id'>): Promise<Category>;
  updateCategory(id: string, updates: Partial<Category>): Promise<Category>;
  deleteCategory(id: string): Promise<void>;
  saveCategories(categories: Category[]): Promise<void>; // compatibility helper

  // Products CRUD
  listProducts(): Promise<Product[]>;
  getProduct(id: string): Promise<Product | null>;
  createProduct(product: Omit<Product, 'id'>): Promise<Product>;
  updateProduct(id: string, updates: Partial<Product>): Promise<Product>;
  deleteProduct(id: string): Promise<void>;
  saveProducts(products: Product[]): Promise<void>; // compatibility helper

  // Branch-product configuration CRUD
  getBranchProduct(productId: string, branchId: string): Promise<BranchProduct | null>;
  saveBranchProduct(branchProduct: BranchProduct): Promise<void>;
  listBranchProducts(branchId: string): Promise<BranchProduct[]>;
  publishBranchProducts?(branchId: string): Promise<void>; // compatibility helper

  // Compose MenuItemView
  composeMenuItemView(productId: string, branchId: string): Promise<MenuItemView | null>;
}
