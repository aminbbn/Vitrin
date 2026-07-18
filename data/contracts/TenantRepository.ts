import { Restaurant, Branch, RestaurantMembership } from '../../domain';

export interface TenantRepository {
  getRestaurant(): Promise<Restaurant>;
  getBranch(branchId: string): Promise<Branch | null>;
  getBranches(): Promise<Branch[]>;
  getMemberships(): Promise<RestaurantMembership[]>;
  updateRestaurantInfo(updates: {
    name?: string;
    logoUrl?: string;
    description?: string;
    address?: string;
    phone?: string;
    hours?: Record<string, string>;
  }): Promise<Restaurant>;
  getBrandColor(): Promise<string>;
  updateBrandColor(color: string): Promise<void>;
}
