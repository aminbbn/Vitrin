import { TenantRepository } from '../contracts/TenantRepository';
import { Restaurant, Branch, RestaurantMembership, MembershipRole, MembershipStatus, MembershipPermission } from '../../domain';
import { storageAdapter } from '../storage/StorageAdapter';

const delay = (ms = 150) => new Promise(resolve => setTimeout(resolve, ms));

export const ALL_BRANCHES: Branch[] = [
  {
    id: 'b1',
    restaurantId: 'r1',
    name: 'شعبه مرکزی (کاج)',
    address: 'تهران، سعادت آباد، میدان کاج',
    phone: '021-22xxx',
    createdAt: new Date().toISOString()
  },
  {
    id: 'b2',
    restaurantId: 'r1',
    name: 'شعبه سعادت‌آباد (سرو)',
    address: 'تهران، سعادت‌آباد، خیابان سرو شرقی',
    phone: '021-2211xxxx',
    createdAt: new Date().toISOString()
  },
  {
    id: 'b3',
    restaurantId: 'r2',
    name: 'شعبه پاسداران',
    address: 'تهران، پاسداران، گلستان پنجم',
    phone: '021-2288xxxx',
    createdAt: new Date().toISOString()
  }
];

export const ALL_RESTAURANTS: Restaurant[] = [
  {
    id: 'r1',
    name: 'رستوران سنتی لیمو',
    slug: 'limoo',
    logoUrl: undefined,
    description: 'لذت طعم غذای اصیل ایرانی',
    address: 'تهران، سعادت آباد، میدان کاج، سرو شرقی',
    phone: '021-88990000',
    createdAt: new Date().toISOString()
  },
  {
    id: 'r2',
    name: 'کافه قنادی بهار',
    slug: 'bahar-cafe',
    logoUrl: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=120&auto=format&fit=crop&q=60',
    description: 'بهترین شیرینی‌ها و قهوه در محله پاسداران',
    address: 'تهران، خیابان پاسداران، گلستان پنجم',
    phone: '021-2288xxxx',
    createdAt: new Date().toISOString()
  }
];

export class MockTenantRepository implements TenantRepository {
  async getRestaurant(): Promise<Restaurant> {
    await delay();
    const data = storageAdapter.load();
    const activeRestId = data.auth.activeRestaurantId || 'r1';

    // 1. Check custom restaurants in storage
    const customRest = data.auth.customRestaurants?.find(r => r.id === activeRestId);
    if (customRest) {
      return {
        id: customRest.id,
        name: customRest.name,
        slug: customRest.slug,
        logoUrl: customRest.logoUrl,
        description: customRest.description || 'توضیحاتی برای این رستوران ثبت نشده است.',
        address: customRest.address || '',
        phone: customRest.phone || '',
        createdAt: customRest.createdAt
      };
    }

    if (activeRestId === 'r1') {
      return {
        id: 'r1',
        name: data.tenant.restaurantName,
        slug: 'limoo',
        logoUrl: data.tenant.restaurantLogo || undefined,
        description: data.tenant.description,
        address: data.tenant.address,
        phone: data.tenant.phone,
        createdAt: new Date().toISOString()
      };
    }

    const found = ALL_RESTAURANTS.find(r => r.id === activeRestId);
    return found || ALL_RESTAURANTS[0];
  }

  async getBranch(branchId: string): Promise<Branch | null> {
    await delay();
    const data = storageAdapter.load();
    const customBranch = data.auth.customBranches?.find(b => b.id === branchId);
    if (customBranch) {
      return {
        id: customBranch.id,
        restaurantId: customBranch.restaurantId,
        name: customBranch.name,
        address: customBranch.address,
        phone: customBranch.phone,
        createdAt: customBranch.createdAt
      };
    }
    return ALL_BRANCHES.find(b => b.id === branchId) || null;
  }

  async getBranches(): Promise<Branch[]> {
    await delay();
    const data = storageAdapter.load();
    const activeRestId = data.auth.activeRestaurantId || 'r1';
    
    // Get custom branches
    const customBranches = (data.auth.customBranches || []).filter(b => b.restaurantId === activeRestId);
    if (customBranches.length > 0) {
      return customBranches.map(b => ({
        id: b.id,
        restaurantId: b.restaurantId,
        name: b.name,
        address: b.address,
        phone: b.phone,
        createdAt: b.createdAt
      }));
    }

    return ALL_BRANCHES.filter(b => b.restaurantId === activeRestId);
  }

  async getMemberships(): Promise<RestaurantMembership[]> {
    await delay();
    const data = storageAdapter.load();
    const userId = data.auth.userId;
    if (!userId) return [];

    // Get custom memberships
    const customMems = (data.auth.customMemberships || []).filter(m => m.userId === userId).map(m => ({
      id: m.id,
      userId: m.userId,
      restaurantId: m.restaurantId,
      role: m.role as MembershipRole,
      status: m.status as MembershipStatus,
      permissions: m.permissions as MembershipPermission[],
      createdAt: m.createdAt
    }));

    let staticMems: RestaurantMembership[] = [];
    if (userId === 'user-owner' || userId === 'mock-admin-id') {
      staticMems = [
        {
          id: 'm1',
          restaurantId: 'r1',
          userId: userId,
          role: MembershipRole.OWNER,
          status: MembershipStatus.ACTIVE,
          permissions: [
            MembershipPermission.MENU_PUBLISH,
            MembershipPermission.MENU_ROLLBACK,
            MembershipPermission.CATALOG_MANAGE,
            MembershipPermission.ORDER_MANAGE,
            MembershipPermission.PAYMENT_MANAGE
          ],
          createdAt: new Date().toISOString()
        },
        {
          id: 'm2',
          restaurantId: 'r2',
          userId: userId,
          role: MembershipRole.MANAGER,
          status: MembershipStatus.ACTIVE,
          permissions: [
            MembershipPermission.CATALOG_MANAGE,
            MembershipPermission.ORDER_MANAGE
          ],
          createdAt: new Date().toISOString()
        }
      ];
    } else if (userId === 'user-manager') {
      staticMems = [
        {
          id: 'm3',
          restaurantId: 'r2',
          userId: userId,
          role: MembershipRole.MANAGER,
          status: MembershipStatus.ACTIVE,
          permissions: [
            MembershipPermission.CATALOG_MANAGE,
            MembershipPermission.ORDER_MANAGE
          ],
          createdAt: new Date().toISOString()
        }
      ];
    }

    return [...staticMems, ...customMems];
  }

  async updateRestaurantInfo(updates: {
    name?: string;
    logoUrl?: string;
    description?: string;
    address?: string;
    phone?: string;
    hours?: Record<string, string>;
  }): Promise<Restaurant> {
    await delay(200);
    const data = storageAdapter.load();
    const activeRestId = data.auth.activeRestaurantId || 'r1';

    if (activeRestId === 'r1') {
      if (updates.name !== undefined) data.tenant.restaurantName = updates.name;
      if (updates.logoUrl !== undefined) data.tenant.restaurantLogo = updates.logoUrl;
      if (updates.description !== undefined) data.tenant.description = updates.description;
      if (updates.address !== undefined) data.tenant.address = updates.address;
      if (updates.phone !== undefined) data.tenant.phone = updates.phone;
      if (updates.hours !== undefined) data.tenant.hours = updates.hours;
      storageAdapter.save(data);
    }

    return this.getRestaurant();
  }

  async getBrandColor(): Promise<string> {
    await delay();
    const data = storageAdapter.load();
    const activeRestId = data.auth.activeRestaurantId || 'r1';
    if (activeRestId === 'r2') {
      return 'blue'; // Bakery blue
    }
    return data.tenant.brandColor;
  }

  async updateBrandColor(color: string): Promise<void> {
    await delay();
    const data = storageAdapter.load();
    const activeRestId = data.auth.activeRestaurantId || 'r1';
    if (activeRestId === 'r1') {
      data.tenant.brandColor = color;
      storageAdapter.save(data);
    }
  }
}
export const mockTenantRepository = new MockTenantRepository();

