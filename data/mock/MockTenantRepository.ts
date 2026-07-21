import { TenantRepository } from '../contracts/TenantRepository';
import { Restaurant, Branch, RestaurantMembership } from '../../domain';
import { restaurantsRepository } from '../../repositories/local/RestaurantsRepositoryImpl';
import { branchSettingsRepository } from '../../repositories/local/BranchSettingsRepositoryImpl';
import { localStore } from '../../repositories/local/LocalStorageAdapter';

export class MockTenantRepository implements TenantRepository {
  private getActiveRestaurantId(): string {
    const store = localStore.load();
    return store.session.activeRestaurantId || 'rest_limoo';
  }

  private getActiveBranchId(): string {
    const store = localStore.load();
    return store.session.activeBranchId || 'br_west';
  }

  async getRestaurant(): Promise<Restaurant> {
    const restId = this.getActiveRestaurantId();
    const rest = await restaurantsRepository.getRestaurant(restId);
    if (!rest) {
      throw new Error('رستوران یافت نشد.');
    }
    return rest;
  }

  async getBranch(branchId: string): Promise<Branch | null> {
    return restaurantsRepository.getBranch(branchId);
  }

  async getBranches(): Promise<Branch[]> {
    const restId = this.getActiveRestaurantId();
    return restaurantsRepository.listBranches(restId);
  }

  async getMemberships(): Promise<RestaurantMembership[]> {
    return restaurantsRepository.getMemberships();
  }

  async updateRestaurantInfo(updates: {
    name?: string;
    logoUrl?: string;
    description?: string;
    address?: string;
    phone?: string;
    hours?: Record<string, string>;
  }): Promise<Restaurant> {
    const branchId = this.getActiveBranchId();
    
    // Adapt legacy updates to BranchSettings updates
    await branchSettingsRepository.updateSettings(branchId, {
      restaurantName: updates.name,
      restaurantLogo: updates.logoUrl,
      description: updates.description,
      address: updates.address,
      phone: updates.phone,
      hours: updates.hours
    });

    return this.getRestaurant();
  }

  async getBrandColor(): Promise<string> {
    const branchId = this.getActiveBranchId();
    const settings = await branchSettingsRepository.getSettings(branchId);
    return settings.brandColor;
  }

  async updateBrandColor(color: string): Promise<void> {
    const branchId = this.getActiveBranchId();
    await branchSettingsRepository.updateSettings(branchId, { brandColor: color });
  }

  async createRestaurant(name: string, brandColor: string, address: string, phone: string): Promise<Restaurant> {
    return restaurantsRepository.createRestaurant!(name, brandColor, address, phone);
  }

  async createBranch(restaurantId: string, name: string, address: string, phone?: string): Promise<Branch> {
    return restaurantsRepository.createBranch!(restaurantId, name, address, phone);
  }

  async listAccessibleRestaurants(): Promise<Restaurant[]> {
    return restaurantsRepository.listAccessibleRestaurants();
  }
}

export const mockTenantRepository = new MockTenantRepository();
