import { CatalogRepository } from '../catalog.repository';
import { Category, Product, BranchProduct, MenuItemView } from '../../domain';
import { localStore } from './LocalStorageAdapter';
import { RepositoryError } from '../errors';

export class CatalogRepositoryImpl implements CatalogRepository {
  async listCategories(): Promise<Category[]> {
    const store = localStore.load();
    return store.categories;
  }

  async getCategory(id: string): Promise<Category | null> {
    const store = localStore.load();
    const cat = store.categories.find(c => c.id === id);
    return cat || null;
  }

  async createCategory(category: Omit<Category, 'id'>): Promise<Category> {
    const store = localStore.load();
    const id = `cat_${Math.random().toString(36).substring(2, 11)}`;
    const newCat: Category = {
      ...category,
      id
    };
    store.categories.push(newCat);
    localStore.save(store);
    return newCat;
  }

  async updateCategory(id: string, updates: Partial<Category>): Promise<Category> {
    const store = localStore.load();
    const idx = store.categories.findIndex(c => c.id === id);
    if (idx === -1) {
      throw new RepositoryError('NOT_FOUND', 'دسته بندی مورد نظر یافت نشد.');
    }
    const updated: Category = {
      ...store.categories[idx],
      ...updates
    };
    store.categories[idx] = updated;
    localStore.save(store);
    return updated;
  }

  async deleteCategory(id: string): Promise<void> {
    const store = localStore.load();
    store.categories = store.categories.filter(c => c.id !== id);
    localStore.save(store);
  }

  async saveCategories(categories: Category[]): Promise<void> {
    const store = localStore.load();
    store.categories = categories;
    localStore.save(store);
  }

  async listProducts(): Promise<Product[]> {
    const store = localStore.load();
    return store.products;
  }

  async getProduct(id: string): Promise<Product | null> {
    const store = localStore.load();
    const prod = store.products.find(p => p.id === id);
    return prod || null;
  }

  async createProduct(product: Omit<Product, 'id'>): Promise<Product> {
    const store = localStore.load();
    const id = `prod_${Math.random().toString(36).substring(2, 11)}`;
    const newProd: Product = {
      ...product,
      id
    };
    store.products.push(newProd);

    // Create default branch product overrides for existing branches
    const branchIds = Object.keys(store.branches);
    branchIds.forEach(bId => {
      store.branchProducts[`${id}:${bId}`] = {
        id: `bp_${id}_${bId}`,
        branchId: bId,
        productId: id,
        branchPriceIRR: 1200000, // default placeholder
        availability: 'AVAILABLE',
        isVisible: true
      };
    });

    localStore.save(store);
    return newProd;
  }

  async updateProduct(id: string, updates: Partial<Product>): Promise<Product> {
    const store = localStore.load();
    const idx = store.products.findIndex(p => p.id === id);
    if (idx === -1) {
      throw new RepositoryError('NOT_FOUND', 'محصول مورد نظر یافت نشد.');
    }
    const updated: Product = {
      ...store.products[idx],
      ...updates
    };
    store.products[idx] = updated;
    localStore.save(store);
    return updated;
  }

  async deleteProduct(id: string): Promise<void> {
    const store = localStore.load();
    store.products = store.products.filter(p => p.id !== id);
    // Remove matching branch products
    Object.keys(store.branchProducts).forEach(key => {
      if (key.startsWith(`${id}:`)) {
        delete store.branchProducts[key];
      }
    });
    localStore.save(store);
  }

  async saveProducts(products: Product[]): Promise<void> {
    const store = localStore.load();
    store.products = products;
    localStore.save(store);
  }

  async getBranchProduct(productId: string, branchId: string): Promise<BranchProduct | null> {
    const store = localStore.load();
    const key = `${productId}:${branchId}`;
    let bp = store.branchProducts[key];
    if (!bp) {
      // Fallback/Create on demand
      const productExists = store.products.some(p => p.id === productId);
      if (!productExists) return null;

      bp = {
        id: `bp_${productId}_${branchId}`,
        branchId,
        productId,
        branchPriceIRR: 1200000,
        availability: 'AVAILABLE',
        isVisible: true
      };
      store.branchProducts[key] = bp;
      localStore.save(store);
    }
    return bp;
  }

  async saveBranchProduct(branchProduct: BranchProduct): Promise<void> {
    const store = localStore.load();
    const key = `${branchProduct.productId}:${branchProduct.branchId}`;
    store.branchProducts[key] = branchProduct;
    localStore.save(store);
  }

  async listBranchProducts(branchId: string): Promise<BranchProduct[]> {
    const store = localStore.load();
    return Object.values(store.branchProducts).filter(bp => bp.branchId === branchId);
  }

  async publishBranchProducts(branchId: string): Promise<void> {
    // Simply a helper in offline MVP
  }

  async composeMenuItemView(productId: string, branchId: string): Promise<MenuItemView | null> {
    const store = localStore.load();
    const product = store.products.find(p => p.id === productId);
    if (!product) return null;

    const category = store.categories.find(c => c.id === product.categoryId);
    const catName = category ? category.name : 'دسته بندی نشده';

    const bp = await this.getBranchProduct(productId, branchId);
    if (!bp) return null;

    return {
      id: product.id,
      productId: product.id,
      categoryId: product.categoryId,
      categoryName: catName,
      name: product.name,
      displayName: product.displayName || product.name,
      description: product.description,
      imageReference: product.imageReference || product.imageUrl,
      branchPriceIRR: bp.branchPriceIRR,
      branchDiscountPriceIRR: bp.branchDiscountPriceIRR,
      availability: bp.availability,
      isVisible: bp.isVisible,
      modifierGroups: product.modifierGroups || [],
      tags: product.tags || []
    };
  }
}
export const catalogRepository = new CatalogRepositoryImpl();
