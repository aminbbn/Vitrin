import { RestaurantsRepository } from '../restaurants.repository';
import { Restaurant, Branch, RestaurantMembership } from '../../domain';
import { localStore } from './LocalStorageAdapter';
import { RepositoryError } from '../errors';

export class RestaurantsRepositoryImpl implements RestaurantsRepository {
  async listAccessibleRestaurants(): Promise<Restaurant[]> {
    const store = localStore.load();
    return Object.values(store.restaurants);
  }

  async getRestaurant(id: string): Promise<Restaurant | null> {
    const store = localStore.load();
    const rest = store.restaurants[id];
    return rest || null;
  }

  async listBranches(restaurantId: string): Promise<Branch[]> {
    const store = localStore.load();
    return Object.values(store.branches).filter(b => b.restaurantId === restaurantId);
  }

  async getBranch(id: string): Promise<Branch | null> {
    const store = localStore.load();
    const branch = store.branches[id];
    return branch || null;
  }

  async getMemberships(): Promise<RestaurantMembership[]> {
    const store = localStore.load();
    return store.memberships;
  }

  async createRestaurant(name: string, brandColor: string, address: string, phone: string): Promise<Restaurant> {
    const store = localStore.load();
    const id = `rest_${Math.random().toString(36).substring(2, 11)}`;
    const newRest = {
      id,
      name,
      slug: name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      logoUrl: '',
      description: '',
      address,
      phone,
      hours: {
        saturday: '12:00 - 23:30',
        sunday: '12:00 - 23:30',
        monday: '12:00 - 23:30',
        tuesday: '12:00 - 23:30',
        wednesday: '12:00 - 23:30',
        thursday: '12:00 - 24:00',
        friday: '13:00 - 24:00',
      },
      createdAt: new Date().toISOString()
    };
    store.restaurants[id] = newRest;
    
    store.memberships.push({
      id: `mem_${id}_admin`,
      userId: store.session.userId || 'usr_admin',
      restaurantId: id,
      role: 'OWNER' as any,
      status: 'ACTIVE' as any,
      permissions: [
        'MENU_PUBLISH' as any,
        'MENU_ROLLBACK' as any,
        'CATALOG_MANAGE' as any,
        'ORDER_MANAGE' as any,
        'PAYMENT_MANAGE' as any
      ],
      createdAt: new Date().toISOString()
    });

    const branchId = `br_${id}_default`;
    store.branches[branchId] = {
      id: branchId,
      restaurantId: id,
      name: 'شعبه اصلی',
      address,
      phone,
      createdAt: new Date().toISOString(),
      activeMenuPublicationId: null
    };

    store.settings[branchId] = {
      brandColor,
      categoryPageLayout: 'grid',
      categoryPageColumns: 2
    };

    localStore.save(store);
    return newRest;
  }

  async createBranch(restaurantId: string, name: string, address: string, phone?: string): Promise<Branch> {
    const store = localStore.load();
    const id = `br_${Math.random().toString(36).substring(2, 11)}`;
    const newBranch = {
      id,
      restaurantId,
      name,
      address,
      phone,
      createdAt: new Date().toISOString(),
      activeMenuPublicationId: null
    };
    store.branches[id] = newBranch;
    store.settings[id] = {
      brandColor: 'emerald',
      categoryPageLayout: 'grid',
      categoryPageColumns: 2
    };
    localStore.save(store);
    return newBranch;
  }
}
export const restaurantsRepository = new RestaurantsRepositoryImpl();
