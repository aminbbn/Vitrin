import { CatalogRepository } from '../contracts/CatalogRepository';
import { Category, Product, BranchProduct, MenuItemView } from '../../domain';
import { api } from './client';
import { ApiTenantRepository } from './ApiTenantRepository';

// ── Backend DTO shapes ─────────────────────────────────────────────
interface CategoryResponse {
  id: string;
  restaurantId: string;
  name: string;
  displayOrder: number;
  isActive: boolean;
  createdAt: string;
}

interface ProductResponse {
  id: string;
  restaurantId: string;
  categoryId: string;
  name: string;
  displayName: string;
  description: string | null;
  isActive: boolean;
  createdAt: string;
}

interface BranchProductResponse {
  id: string;
  branchId: string;
  productId: string;
  branchPrice: number;
  branchDiscountPrice: number | null;
  availability: string;
  isVisible: boolean;
  createdAt: string;
  updatedAt: string;
}

interface BranchCatalogProductResponse {
  productId: string;
  name: string;
  displayName: string;
  description: string | null;
  categoryId: string;
  categoryName: string;
  isActive: boolean;
  productCreatedAt: string;
  branchPrice: number | null;
  branchDiscountPrice: number | null;
  availability: string | null;
  isVisible: boolean | null;
  isConfigured: boolean;
}

// ── Mappers ────────────────────────────────────────────────────────
function mapCategory(c: CategoryResponse): Category {
  return {
    id: c.id,
    restaurantId: c.restaurantId,
    name: c.name,
    displayOrder: c.displayOrder,
    isActive: c.isActive,
  };
}

function mapProduct(p: ProductResponse): Product {
  return {
    id: p.id,
    restaurantId: p.restaurantId,
    categoryId: p.categoryId,
    name: p.name,
    displayName: p.displayName,
    description: p.description ?? undefined,
    isActive: p.isActive,
    modifierGroups: [],
    tags: [],
  };
}

function mapBranchProduct(bp: BranchProductResponse): BranchProduct {
  return {
    id: bp.id,
    branchId: bp.branchId,
    productId: bp.productId,
    branchPriceIRR: bp.branchPrice,
    branchDiscountPriceIRR: bp.branchDiscountPrice ?? undefined,
    availability: bp.availability as 'AVAILABLE' | 'UNAVAILABLE',
    isVisible: bp.isVisible,
  };
}

function activeRestaurantId(): string {
  const id = ApiTenantRepository.getActiveRestaurantId();
  if (!id) throw new Error('No active restaurant');
  return id;
}

function activeBranchId(): string {
  const id = ApiTenantRepository.getActiveBranchId();
  if (!id) throw new Error('No active branch');
  return id;
}

// ── Storage for category page settings (localStorage, no backend endpoint) ──
const SETTINGS_KEY = 'vitrin_category_settings';

interface CategorySettings {
  layout: 'grid' | 'list';
  columns: number;
}

function loadSettings(): CategorySettings {
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return { layout: 'grid', columns: 2 };
}

function saveSettings(s: CategorySettings): void {
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(s));
}

// ── Implementation ─────────────────────────────────────────────────
export class ApiCatalogRepository implements CatalogRepository {
  // ── Categories ───────────────────────────────────────────────────
  async getCategories(): Promise<Category[]> {
    const restId = activeRestaurantId();
    const cats = await api.get<CategoryResponse[]>(
      `/restaurants/${restId}/categories`,
    );
    return cats.map(mapCategory);
  }

  async saveCategories(categories: Category[]): Promise<void> {
    // Backend doesn't have bulk update; categories are managed individually via CRUD
    // This is called for backward compatibility; no-op
  }

  async getProducts(): Promise<Product[]> {
    const restId = activeRestaurantId();
    const prods = await api.get<ProductResponse[]>(
      `/restaurants/${restId}/products`,
    );
    return prods.map(mapProduct);
  }

  async getProductById(id: string): Promise<Product | null> {
    const restId = activeRestaurantId();
    try {
      const p = await api.get<ProductResponse>(
        `/restaurants/${restId}/products/${id}`,
      );
      return mapProduct(p);
    } catch {
      return null;
    }
  }

  async saveProducts(products: Product[]): Promise<void> {
    // Backward compatibility no-op
  }

  async getBranchProduct(
    productId: string,
    branchId: string,
  ): Promise<BranchProduct | null> {
    const restId = activeRestaurantId();
    try {
      const bp = await api.get<BranchProductResponse>(
        `/restaurants/${restId}/branches/${branchId}/products/${productId}`,
      );
      return mapBranchProduct(bp);
    } catch {
      return null;
    }
  }

  async saveBranchProduct(branchProduct: BranchProduct): Promise<void> {
    const restId = activeRestaurantId();
    const { branchId, productId, branchPriceIRR, branchDiscountPriceIRR, availability, isVisible } =
      branchProduct;
    await api.put(`/restaurants/${restId}/branches/${branchId}/products/${productId}`, {
      branchPrice: branchPriceIRR,
      branchDiscountPrice: branchDiscountPriceIRR ?? undefined,
      availability: availability ?? 'AVAILABLE',
      isVisible: isVisible ?? true,
    });
  }

  async publishBranchProducts(_branchId: string): Promise<void> {
    // No-op; backend publications handle this
  }

  async getCategoryPageSettings(): Promise<{
    layout: 'grid' | 'list';
    columns: number;
  }> {
    return loadSettings();
  }

  async updateCategoryPageSettings(settings: {
    layout?: 'grid' | 'list';
    columns?: number;
  }): Promise<void> {
    const current = loadSettings();
    saveSettings({ ...current, ...settings });
  }

  // ── New: Branch catalog products (enriched view) ─────────────────
  async listBranchProducts(branchId: string): Promise<any[]> {
    const restId = activeRestaurantId();
    return api.get<BranchCatalogProductResponse[]>(
      `/restaurants/${restId}/branches/${branchId}/products`,
    );
  }
}

export const apiCatalogRepository = new ApiCatalogRepository();
