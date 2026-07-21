import { Restaurant, Branch, RestaurantMembership } from '../domain';

export interface RestaurantsRepository {
  listAccessibleRestaurants(): Promise<Restaurant[]>;
  getRestaurant(id: string): Promise<Restaurant | null>;
  listBranches(restaurantId: string): Promise<Branch[]>;
  getBranch(id: string): Promise<Branch | null>;
  getMemberships(): Promise<RestaurantMembership[]>;
  createRestaurant?(name: string, brandColor: string, address: string, phone: string): Promise<Restaurant>;
  createBranch?(restaurantId: string, name: string, address: string, phone?: string): Promise<Branch>;
}
