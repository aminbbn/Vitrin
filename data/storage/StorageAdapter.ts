import { INITIAL_CATEGORIES, INITIAL_PRODUCTS } from '../../constants';

export interface VitrinStorageSchema {
  version: number;
  auth: {
    isAuthenticated: boolean;
    userId: string | null;
  };
  tenant: {
    restaurantName: string;
    restaurantLogo: string;
    brandColor: string;
    address: string;
    phone: string;
    description: string;
    hours: Record<string, string>;
  };
  catalog: {
    categories: any[];
    products: any[];
    categoryPageLayout: 'grid' | 'list';
    categoryPageColumns: number;
  };
  menu: {
    designerDraft: any[];
    publishedDesign: any[];
  };
  orders: {
    orders: any[];
    customerName: string;
    customerPhone: string;
    customerTable: string;
  };
}

const STORAGE_KEY = 'vitrin_platform_storage';
const CURRENT_VERSION = 1;

const DEFAULT_HOURS = {
  saturday: '12:00 - 23:30',
  sunday: '12:00 - 23:30',
  monday: '12:00 - 23:30',
  tuesday: '12:00 - 23:30',
  wednesday: '12:00 - 23:30',
  thursday: '12:00 - 24:00',
  friday: '13:00 - 24:00',
};

const DEFAULT_SCHEMA: VitrinStorageSchema = {
  version: CURRENT_VERSION,
  auth: {
    isAuthenticated: false,
    userId: null,
  },
  tenant: {
    restaurantName: 'رستوران ایتالیایی لیمو',
    restaurantLogo: '',
    brandColor: 'emerald',
    address: 'تهران، سعادت آباد، میدان کاج',
    phone: '021-22xxx',
    description: 'رستورانی با طعم‌های اصیل و به یادماندنی...',
    hours: DEFAULT_HOURS,
  },
  catalog: {
    categories: INITIAL_CATEGORIES,
    products: INITIAL_PRODUCTS,
    categoryPageLayout: 'grid',
    categoryPageColumns: 2,
  },
  menu: {
    designerDraft: [],
    publishedDesign: [],
  },
  orders: {
    orders: [],
    customerName: '',
    customerPhone: '',
    customerTable: '5',
  },
};

type StorageListener = (schema: VitrinStorageSchema) => void;

class StorageAdapter {
  private listeners: Set<StorageListener> = new Set();

  constructor() {
    if (typeof window !== 'undefined') {
      window.addEventListener('storage', (e) => {
        if (e.key === STORAGE_KEY) {
          const updated = this.load();
          this.notify(updated);
        }
      });
    }
  }

  public load(): VitrinStorageSchema {
    if (typeof window === 'undefined') {
      return DEFAULT_SCHEMA;
    }

    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) {
        // Safe migration from individual keys
        const legacySchema = this.migrateFromLegacy();
        this.save(legacySchema);
        return legacySchema;
      }

      const parsed = JSON.parse(raw);
      if (!parsed || parsed.version !== CURRENT_VERSION) {
        // Upgrade migration logic can be placed here if version changes
        return { ...DEFAULT_SCHEMA, ...parsed, version: CURRENT_VERSION };
      }

      return parsed as VitrinStorageSchema;
    } catch (e) {
      console.error('Error loading storage schema, falling back to default:', e);
      return DEFAULT_SCHEMA;
    }
  }

  public save(schema: VitrinStorageSchema): void {
    if (typeof window === 'undefined') return;

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(schema));
      this.notify(schema);
    } catch (e) {
      console.error('Error saving storage schema:', e);
    }
  }

  public subscribe(listener: StorageListener): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notify(schema: VitrinStorageSchema): void {
    this.listeners.forEach((listener) => {
      try {
        listener(schema);
      } catch (e) {
        console.error('Error in storage subscription listener:', e);
      }
    });
  }

  private migrateFromLegacy(): VitrinStorageSchema {
    if (typeof window === 'undefined') {
      return DEFAULT_SCHEMA;
    }

    try {
      const legacyAuth = localStorage.getItem('vitrin_auth') === 'true';
      const legacyRestaurantName = localStorage.getItem('vitrin_restaurant_name') || DEFAULT_SCHEMA.tenant.restaurantName;
      const legacyLogo = localStorage.getItem('vitrin_restaurant_logo') || DEFAULT_SCHEMA.tenant.restaurantLogo;
      const legacyBrandColor = localStorage.getItem('vitrin_brand_color') || DEFAULT_SCHEMA.tenant.brandColor;
      const legacyAddress = localStorage.getItem('vitrin_restaurant_address') || DEFAULT_SCHEMA.tenant.address;
      const legacyPhone = localStorage.getItem('vitrin_restaurant_phone') || DEFAULT_SCHEMA.tenant.phone;
      const legacyDesc = localStorage.getItem('vitrin_restaurant_description') || DEFAULT_SCHEMA.tenant.description;
      
      let legacyHours = DEFAULT_HOURS;
      const rawHours = localStorage.getItem('vitrin_restaurant_hours');
      if (rawHours) {
        try {
          legacyHours = JSON.parse(rawHours);
        } catch (_) {}
      }

      let legacyCategories = INITIAL_CATEGORIES;
      const rawCats = localStorage.getItem('vitrin_categories');
      if (rawCats) {
        try {
          legacyCategories = JSON.parse(rawCats);
        } catch (_) {}
      }

      let legacyProducts = INITIAL_PRODUCTS;
      const rawProds = localStorage.getItem('vitrin_products');
      if (rawProds) {
        try {
          legacyProducts = JSON.parse(rawProds);
        } catch (_) {}
      }

      const legacyLayout = (localStorage.getItem('vitrin_category_products_layout') as 'grid' | 'list') || DEFAULT_SCHEMA.catalog.categoryPageLayout;
      const legacyColumns = Number(localStorage.getItem('vitrin_category_products_columns')) || DEFAULT_SCHEMA.catalog.categoryPageColumns;

      let legacyDraft = [];
      const rawDraft = localStorage.getItem('vitrin_designer_draft');
      if (rawDraft) {
        try {
          legacyDraft = JSON.parse(rawDraft);
        } catch (_) {}
      }

      let legacyPublished = [];
      const rawPublished = localStorage.getItem('vitrin_published_design');
      if (rawPublished) {
        try {
          legacyPublished = JSON.parse(rawPublished);
        } catch (_) {}
      }

      let legacyOrders = [];
      const rawOrders = localStorage.getItem('vitrin_orders');
      if (rawOrders) {
        try {
          legacyOrders = JSON.parse(rawOrders);
        } catch (_) {}
      }

      const legacyCustomerName = localStorage.getItem('vitrin_customer_name') || '';
      const legacyCustomerPhone = localStorage.getItem('vitrin_customer_phone') || '';
      const legacyCustomerTable = localStorage.getItem('vitrin_customer_table') || '5';

      return {
        version: CURRENT_VERSION,
        auth: {
          isAuthenticated: legacyAuth,
          userId: legacyAuth ? 'mock-admin-id' : null,
        },
        tenant: {
          restaurantName: legacyRestaurantName,
          restaurantLogo: legacyLogo,
          brandColor: legacyBrandColor,
          address: legacyAddress,
          phone: legacyPhone,
          description: legacyDesc,
          hours: legacyHours,
        },
        catalog: {
          categories: legacyCategories,
          products: legacyProducts,
          categoryPageLayout: legacyLayout,
          categoryPageColumns: legacyColumns,
        },
        menu: {
          designerDraft: legacyDraft,
          publishedDesign: legacyPublished,
        },
        orders: {
          orders: legacyOrders,
          customerName: legacyCustomerName,
          customerPhone: legacyCustomerPhone,
          customerTable: legacyCustomerTable,
        },
      };
    } catch (e) {
      console.error('Error during legacy storage migration:', e);
      return DEFAULT_SCHEMA;
    }
  }
}

export const storageAdapter = new StorageAdapter();
