import { TenantRepository } from '../contracts/TenantRepository';
import { Restaurant, Branch, RestaurantMembership, MembershipRole, MembershipStatus, MembershipPermission } from '../../domain';
import { api } from './client';
import { localStore } from '../../repositories/local/LocalStorageAdapter';

// Backend response shapes
interface RestaurantResponse {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  status: string;
  createdAt: string;
  userRole: string;
}

interface BranchResponse {
  id: string;
  restaurantId: string;
  name: string;
  address: string | null;
  timezone: string;
  currencyCode: string;
  status: string;
  publicMenuEnabled: boolean;
  createdAt: string;
}

// State for the active restaurant/branch context (set after restaurant list is fetched)
let _activeRestaurantId: string | null = null;
let _activeBranchId: string | null = null;

// Simple request-level cache to avoid redundant /restaurants calls during session sync
let _restaurantsCache: RestaurantResponse[] | null = null;
let _restaurantsCacheTs = 0;
const CACHE_TTL_MS = 5_000;

function mapRestaurant(r: RestaurantResponse): Restaurant {
  return {
    id: r.id,
    name: r.name,
    slug: r.slug,
    createdAt: r.createdAt,
  };
}

function mapBranch(b: BranchResponse): Branch {
  return {
    id: b.id,
    restaurantId: b.restaurantId,
    name: b.name,
    address: b.address || '',
    createdAt: b.createdAt,
  };
}

// Derive memberships from restaurant list (backend doesn't expose standalone memberships)
function buildMembership(r: RestaurantResponse, userId: string): RestaurantMembership {
  return {
    id: `mem_${userId}_${r.id}`,
    userId,
    restaurantId: r.id,
    role: (r.userRole as MembershipRole) || MembershipRole.OWNER,
    status: MembershipStatus.ACTIVE,
    permissions: [
      MembershipPermission.MENU_PUBLISH,
      MembershipPermission.MENU_ROLLBACK,
      MembershipPermission.CATALOG_MANAGE,
      MembershipPermission.ORDER_MANAGE,
      MembershipPermission.PAYMENT_MANAGE,
    ],
    createdAt: r.createdAt,
  };
}

async function fetchRestaurants(): Promise<RestaurantResponse[]> {
  const now = Date.now();
  if (_restaurantsCache && now - _restaurantsCacheTs < CACHE_TTL_MS) {
    return _restaurantsCache;
  }
  const data = await api.get<RestaurantResponse[]>('/restaurants');
  _restaurantsCache = data;
  _restaurantsCacheTs = now;
  return data;
}

function invalidateCache(): void {
  _restaurantsCache = null;
}

export class ApiTenantRepository implements TenantRepository {
  async getRestaurant(): Promise<Restaurant> {
    if (!_activeRestaurantId) {
      throw new Error('No active restaurant selected');
    }
    const r = await api.get<RestaurantResponse>(`/restaurants/${_activeRestaurantId}`);
    return mapRestaurant(r);
  }

  async getBranch(branchId: string): Promise<Branch | null> {
    if (!_activeRestaurantId) return null;
    try {
      const branches = await api.get<BranchResponse[]>(
        `/restaurants/${_activeRestaurantId}/branches`,
      );
      const found = branches.find((b) => b.id === branchId);
      return found ? mapBranch(found) : null;
    } catch {
      return null;
    }
  }

  async getBranches(): Promise<Branch[]> {
    if (!_activeRestaurantId) return [];
    const branches = await api.get<BranchResponse[]>(
      `/restaurants/${_activeRestaurantId}/branches`,
    );
    return branches.map(mapBranch);
  }

  async getMemberships(): Promise<RestaurantMembership[]> {
    const user = await api.get<{ id: string }>('/auth/me');
    const restaurants = await fetchRestaurants();
    return restaurants.map((r) => buildMembership(r, user.id));
  }

  async updateRestaurantInfo(_updates: {
    name?: string;
    logoUrl?: string;
    description?: string;
    address?: string;
    phone?: string;
    hours?: Record<string, string>;
  }): Promise<Restaurant> {
    return this.getRestaurant();
  }

  async getBrandColor(): Promise<string> {
    // Persist brand color per-branch in localStorage (no backend endpoint yet)
    const branchId = _activeBranchId || 'br_west';
    try {
      const store = localStore.load();
      const settings = (store as any).settings;
      if (settings && settings[branchId]) {
        return settings[branchId].brandColor || 'emerald';
      }
    } catch {}
    return 'emerald';
  }

  async updateBrandColor(color: string): Promise<void> {
    const branchId = _activeBranchId || 'br_west';
    try {
      const store = localStore.load();
      if (!(store as any).settings) (store as any).settings = {};
      if (!(store as any).settings[branchId]) {
        (store as any).settings[branchId] = { brandColor: 'emerald', categoryPageLayout: 'grid', categoryPageColumns: 2 };
      }
      (store as any).settings[branchId].brandColor = color;
      localStore.save(store);
    } catch {}
  }

  async createRestaurant(
    name: string,
    _brandColor: string,
    _address: string,
    _phone: string,
  ): Promise<Restaurant> {
    const slug = name
      .toLowerCase()
      .replace(/[^a-z0-9\u0600-\u06FF]+/g, '-')
      .replace(/^-|-$/g, '');
    const r = await api.post<RestaurantResponse>('/restaurants', {
      name,
      slug: slug || `rest-${Date.now()}`,
    });
    invalidateCache();
    return mapRestaurant(r);
  }

  async createBranch(
    restaurantId: string,
    name: string,
    address: string,
    _phone?: string,
  ): Promise<Branch> {
    const b = await api.post<BranchResponse>(
      `/restaurants/${restaurantId}/branches`,
      { name, address },
    );
    return mapBranch(b);
  }

  async listAccessibleRestaurants(): Promise<Restaurant[]> {
    const restaurants = await fetchRestaurants();
    return restaurants.map(mapRestaurant);
  }

  /** Set the active restaurant context. */
  static setActiveRestaurant(id: string | null): void {
    _activeRestaurantId = id;
  }

  /** Set the active branch context. */
  static setActiveBranch(id: string | null): void {
    _activeBranchId = id;
  }

  static getActiveRestaurantId(): string | null {
    return _activeRestaurantId;
  }

  static getActiveBranchId(): string | null {
    return _activeBranchId;
  }
}

export const apiTenantRepository = new ApiTenantRepository();
