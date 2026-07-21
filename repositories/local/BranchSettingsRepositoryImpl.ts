import { BranchSettingsRepository, BranchSettings } from '../branch-settings.repository';
import { TableContext } from '../../domain';
import { localStore } from './LocalStorageAdapter';
import { RepositoryError } from '../errors';

export class BranchSettingsRepositoryImpl implements BranchSettingsRepository {
  async getSettings(branchId: string): Promise<BranchSettings> {
    const store = localStore.load();
    const branch = store.branches[branchId];
    if (!branch) {
      throw new RepositoryError('NOT_FOUND', 'شعبه یافت نشد.');
    }
    const restaurant = store.restaurants[branch.restaurantId];
    if (!restaurant) {
      throw new RepositoryError('NOT_FOUND', 'رستوران یافت نشد.');
    }
    const bSettings = store.settings[branchId] || {
      brandColor: 'emerald',
      categoryPageLayout: 'grid',
      categoryPageColumns: 2
    };

    return {
      brandColor: bSettings.brandColor,
      categoryPageLayout: bSettings.categoryPageLayout,
      categoryPageColumns: bSettings.categoryPageColumns,
      restaurantName: restaurant.name,
      restaurantLogo: restaurant.logoUrl || '',
      description: restaurant.description || '',
      address: branch.address || restaurant.address || '',
      phone: branch.phone || restaurant.phone || '',
      hours: restaurant.hours || {}
    };
  }

  async updateSettings(branchId: string, updates: Partial<BranchSettings>): Promise<BranchSettings> {
    const store = localStore.load();
    const branch = store.branches[branchId];
    if (!branch) {
      throw new RepositoryError('NOT_FOUND', 'شعبه یافت نشد.');
    }
    const restaurant = store.restaurants[branch.restaurantId];
    if (!restaurant) {
      throw new RepositoryError('NOT_FOUND', 'رستوران یافت نشد.');
    }

    let restUpdated = false;
    if (updates.restaurantName !== undefined && updates.restaurantName !== restaurant.name) {
      restaurant.name = updates.restaurantName;
      restUpdated = true;
    }
    if (updates.restaurantLogo !== undefined && updates.restaurantLogo !== restaurant.logoUrl) {
      restaurant.logoUrl = updates.restaurantLogo;
      restUpdated = true;
    }
    if (updates.description !== undefined && updates.description !== restaurant.description) {
      restaurant.description = updates.description;
      restUpdated = true;
    }
    if (updates.hours !== undefined) {
      restaurant.hours = updates.hours;
      restUpdated = true;
    }
    if (restUpdated) {
      store.restaurants[branch.restaurantId] = restaurant;
    }

    let branchUpdated = false;
    if (updates.address !== undefined && updates.address !== branch.address) {
      branch.address = updates.address;
      branchUpdated = true;
    }
    if (updates.phone !== undefined && updates.phone !== branch.phone) {
      branch.phone = updates.phone;
      branchUpdated = true;
    }
    if (branchUpdated) {
      store.branches[branchId] = branch;
    }

    const bSettings = store.settings[branchId] || {
      brandColor: 'emerald',
      categoryPageLayout: 'grid',
      categoryPageColumns: 2
    };

    if (updates.brandColor !== undefined) {
      bSettings.brandColor = updates.brandColor;
    }
    if (updates.categoryPageLayout !== undefined) {
      bSettings.categoryPageLayout = updates.categoryPageLayout;
    }
    if (updates.categoryPageColumns !== undefined) {
      bSettings.categoryPageColumns = updates.categoryPageColumns;
    }
    store.settings[branchId] = bSettings;

    localStore.save(store);

    return {
      brandColor: bSettings.brandColor,
      categoryPageLayout: bSettings.categoryPageLayout,
      categoryPageColumns: bSettings.categoryPageColumns,
      restaurantName: restaurant.name,
      restaurantLogo: restaurant.logoUrl || '',
      description: restaurant.description || '',
      address: branch.address,
      phone: branch.phone || '',
      hours: restaurant.hours || {}
    };
  }

  async getTableContext(branchId: string, tableNumber: number): Promise<TableContext> {
    const store = localStore.load();
    const key = `${branchId}:${tableNumber}`;
    const table = store.tables[key];
    if (!table) {
      throw new RepositoryError('NOT_FOUND', 'میز مورد نظر یافت نشد.');
    }
    return table;
  }

  async listTables(branchId: string): Promise<TableContext[]> {
    const store = localStore.load();
    return Object.keys(store.tables)
      .filter(key => key.startsWith(`${branchId}:`))
      .map(key => store.tables[key]);
  }

  async updateTableContext(branchId: string, tableNumber: number, updates: Partial<TableContext>): Promise<TableContext> {
    const store = localStore.load();
    const key = `${branchId}:${tableNumber}`;
    const table = store.tables[key];
    if (!table) {
      throw new RepositoryError('NOT_FOUND', 'میز مورد نظر یافت نشد.');
    }
    const updated = {
      ...table,
      ...updates
    };
    store.tables[key] = updated;
    localStore.save(store);
    return updated;
  }
}
export const branchSettingsRepository = new BranchSettingsRepositoryImpl();
