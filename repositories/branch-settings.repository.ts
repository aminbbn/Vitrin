import { TableContext } from '../domain';

export interface BranchSettings {
  brandColor: string;
  categoryPageLayout: 'grid' | 'list';
  categoryPageColumns: number;
  restaurantName: string;
  restaurantLogo: string;
  description: string;
  address: string;
  phone: string;
  hours: Record<string, string>;
}

export interface BranchSettingsRepository {
  getSettings(branchId: string): Promise<BranchSettings>;
  updateSettings(branchId: string, updates: Partial<BranchSettings>): Promise<BranchSettings>;
  
  // Table / QR context mocks
  getTableContext(branchId: string, tableNumber: number): Promise<TableContext>;
  listTables(branchId: string): Promise<TableContext[]>;
  updateTableContext(branchId: string, tableNumber: number, updates: Partial<TableContext>): Promise<TableContext>;
}
