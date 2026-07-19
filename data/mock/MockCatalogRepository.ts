import { CatalogRepository } from '../contracts/CatalogRepository';
import { Category, Product, BranchProduct } from '../../domain';
import { storageAdapter } from '../storage/StorageAdapter';

const delay = (ms = 150) => new Promise(resolve => setTimeout(resolve, ms));

// Helper to strip branch fields from Product to ensure clean master identity
function cleanProductDomain(p: any): Product {
  const { price, isAvailable, discountPrice, rawMaterials, ...rest } = p;
  return {
    ...rest,
    imageUrl: p.imageUrl || p.image || '',
    internalName: p.internalName || p.name,
    state: p.state || 'active',
    modifierGroups: p.modifierGroups || p.modifiers?.map((m: any) => ({
      id: m.id,
      name: m.name,
      type: m.type,
      options: m.options?.map((o: any) => ({
        id: o.id,
        name: o.name,
        priceRial: o.priceRial ?? ((o.price || 0) * 10)
      })) || []
    })) || []
  };
}

export class MockCatalogRepository implements CatalogRepository {
  private ensureBranchProductsInitialized(data: any) {
    if (!data.catalog.branchProducts) {
      data.catalog.branchProducts = [];
    }
    
    // Seed branch products if empty, mapping from initial legacy product values
    if (data.catalog.branchProducts.length === 0 && data.catalog.products && data.catalog.products.length > 0) {
      data.catalog.products.forEach((p: any) => {
        const isAvail = p.isAvailable !== false;
        // Central branch (b1)
        data.catalog.branchProducts.push({
          id: `bp-${p.id}-b1`,
          branchId: 'b1',
          productId: p.id,
          branchPriceRial: (p.price || 0) * 10,
          branchDiscountPriceRial: p.discountPrice ? p.discountPrice * 10 : undefined,
          isAvailable: isAvail,
          availability: isAvail ? 'AVAILABLE' : 'UNAVAILABLE',
          orderingEnabled: true,
          isVisible: true
        });
        
        // Branch 2 (b2) gets a higher price
        data.catalog.branchProducts.push({
          id: `bp-${p.id}-b2`,
          branchId: 'b2',
          productId: p.id,
          branchPriceRial: Math.round((p.price || 0) * 1.1 * 10),
          branchDiscountPriceRial: undefined,
          isAvailable: isAvail,
          availability: isAvail ? 'AVAILABLE' : 'UNAVAILABLE',
          orderingEnabled: true,
          isVisible: true
        });

        // Branch 3 (b3)
        data.catalog.branchProducts.push({
          id: `bp-${p.id}-b3`,
          branchId: 'b3',
          productId: p.id,
          branchPriceRial: (p.price || 0) * 10,
          branchDiscountPriceRial: undefined,
          isAvailable: isAvail,
          availability: isAvail ? 'AVAILABLE' : 'UNAVAILABLE',
          orderingEnabled: true,
          isVisible: true
        });
      });
      storageAdapter.save(data);
    }
  }

  async getCategories(): Promise<Category[]> {
    await delay();
    const data = storageAdapter.load();
    const cats = data.catalog.categories || [];
    return cats.map((c: any) => ({
      ...c,
      state: c.state || 'active'
    }));
  }

  async saveCategories(categories: Category[]): Promise<void> {
    await delay();
    const data = storageAdapter.load();
    const currentCats = data.catalog.categories || [];
    
    // Check constraint: block destructive deletion when active Products reference the Category
    const removedCats = currentCats.filter(oldCat => !categories.some(newCat => newCat.id === oldCat.id));
    if (removedCats.length > 0) {
      const products = data.catalog.products || [];
      for (const removed of removedCats) {
        const hasReferencingActiveProducts = products.some(p => p.categoryId === removed.id && p.state !== 'archived');
        if (hasReferencingActiveProducts) {
          throw new Error(`امکان حذف دسته‌بندی "${removed.name}" وجود ندارد زیرا محصولاتی به آن منتسب هستند.`);
        }
      }
    }

    data.catalog.categories = categories;
    storageAdapter.save(data);
  }

  async getProducts(): Promise<Product[]> {
    await delay();
    const data = storageAdapter.load();
    this.ensureBranchProductsInitialized(data);
    return (data.catalog.products || []).map(cleanProductDomain);
  }

  async getProductById(id: string): Promise<Product | null> {
    await delay();
    const products = await this.getProducts();
    return products.find(p => p.id === id) || null;
  }

  async saveProducts(products: Product[]): Promise<void> {
    await delay();
    const data = storageAdapter.load();
    
    data.catalog.products = products.map(p => {
      const cleaned = cleanProductDomain(p);
      return {
        id: cleaned.id,
        categoryId: cleaned.categoryId,
        internalName: cleaned.internalName || cleaned.name,
        name: cleaned.name,
        description: cleaned.description,
        imageUrl: cleaned.imageUrl,
        estimatedTime: cleaned.estimatedTime,
        rating: cleaned.rating,
        tags: cleaned.tags,
        modifierGroups: cleaned.modifierGroups,
        createdAt: cleaned.createdAt,
        state: cleaned.state || 'active'
      };
    });
    
    storageAdapter.save(data);
  }

  async getBranchProduct(productId: string, branchId: string): Promise<BranchProduct | null> {
    await delay();
    const data = storageAdapter.load();
    this.ensureBranchProductsInitialized(data);
    const branchProducts = data.catalog.branchProducts || [];
    const found = branchProducts.find(bp => bp.productId === productId && bp.branchId === branchId);
    return found || null;
  }

  async saveBranchProduct(branchProduct: BranchProduct): Promise<void> {
    await delay();
    const data = storageAdapter.load();
    this.ensureBranchProductsInitialized(data);
    const branchProducts = data.catalog.branchProducts || [];
    const index = branchProducts.findIndex(bp => bp.productId === branchProduct.productId && bp.branchId === branchProduct.branchId);
    
    if (index !== -1) {
      branchProducts[index] = branchProduct;
    } else {
      branchProducts.push(branchProduct);
    }
    
    data.catalog.branchProducts = branchProducts;
    storageAdapter.save(data);
  }

  async publishBranchProducts(branchId: string): Promise<void> {
    await delay(300);
    const data = storageAdapter.load();
    this.ensureBranchProductsInitialized(data);
    const branchProducts = data.catalog.branchProducts || [];
    
    let updated = false;
    branchProducts.forEach((bp: any) => {
      if (bp.branchId === branchId && bp.hasPendingPublishPrice) {
        if (bp.pendingPriceRial !== undefined) {
          bp.branchPriceRial = bp.pendingPriceRial;
          delete bp.pendingPriceRial;
        }
        if (bp.pendingDiscountPriceRial !== undefined) {
          bp.branchDiscountPriceRial = bp.pendingDiscountPriceRial;
          delete bp.pendingDiscountPriceRial;
        } else {
          bp.branchDiscountPriceRial = undefined;
          delete bp.pendingDiscountPriceRial;
        }
        bp.hasPendingPublishPrice = false;
        updated = true;
      }
    });
    
    if (updated) {
      data.catalog.branchProducts = branchProducts;
      storageAdapter.save(data);
    }
  }

  async getCategoryPageSettings(): Promise<{ layout: 'grid' | 'list'; columns: number }> {
    await delay();
    const data = storageAdapter.load();
    return {
      layout: data.catalog.categoryPageLayout || 'grid',
      columns: data.catalog.categoryPageColumns || 2,
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
