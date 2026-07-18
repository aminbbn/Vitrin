import { TenantRepository } from '../contracts/TenantRepository';
import { Restaurant, Branch, RestaurantMembership, MembershipRole, MembershipStatus, MembershipPermission } from '../../domain';
import { storageAdapter } from '../storage/StorageAdapter';

const delay = (ms = 150) => new Promise(resolve => setTimeout(resolve, ms));

export class MockTenantRepository implements TenantRepository {
  async getRestaurant(): Promise<Restaurant> {
    await delay();
    const data = storageAdapter.load();
    return {
      id: 'r1',
      name: data.tenant.restaurantName,
      logoUrl: data.tenant.restaurantLogo || undefined,
      description: data.tenant.description,
      address: data.tenant.address,
      phone: data.tenant.phone,
      hours: data.tenant.hours,
      createdAt: new Date().toISOString()
    };
  }

  async getBranch(branchId: string): Promise<Branch | null> {
    await delay();
    const branches = await this.getBranches();
    return branches.find(b => b.id === branchId) || null;
  }

  async getBranches(): Promise<Branch[]> {
    await delay();
    const data = storageAdapter.load();
    return [
      {
        id: 'b1',
        restaurantId: 'r1',
        name: 'شعبه مرکزی',
        address: data.tenant.address,
        phone: data.tenant.phone,
        isActive: true,
        createdAt: new Date().toISOString()
      }
    ];
  }

  async getMemberships(): Promise<RestaurantMembership[]> {
    await delay();
    return [
      {
        id: 'm1',
        restaurantId: 'r1',
        userId: 'mock-admin-id',
        role: MembershipRole.OWNER,
        status: MembershipStatus.ACTIVE,
        permissions: [
          MembershipPermission.MANAGE_MENU,
          MembershipPermission.MANAGE_ORDERS,
          MembershipPermission.MANAGE_SETTINGS
        ],
        createdAt: new Date().toISOString()
      }
    ];
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
    if (updates.name !== undefined) data.tenant.restaurantName = updates.name;
    if (updates.logoUrl !== undefined) data.tenant.restaurantLogo = updates.logoUrl;
    if (updates.description !== undefined) data.tenant.description = updates.description;
    if (updates.address !== undefined) data.tenant.address = updates.address;
    if (updates.phone !== undefined) data.tenant.phone = updates.phone;
    if (updates.hours !== undefined) data.tenant.hours = updates.hours;

    storageAdapter.save(data);

    return {
      id: 'r1',
      name: data.tenant.restaurantName,
      logoUrl: data.tenant.restaurantLogo || undefined,
      description: data.tenant.description,
      address: data.tenant.address,
      phone: data.tenant.phone,
      hours: data.tenant.hours,
      createdAt: new Date().toISOString()
    };
  }

  async getBrandColor(): Promise<string> {
    await delay();
    return storageAdapter.load().tenant.brandColor;
  }

  async updateBrandColor(color: string): Promise<void> {
    await delay();
    const data = storageAdapter.load();
    data.tenant.brandColor = color;
    storageAdapter.save(data);
  }
}
export const mockTenantRepository = new MockTenantRepository();
