import { 
  Category, 
  Product, 
  Restaurant, 
  Branch, 
  RestaurantMembership, 
  User, 
  UserStatus, 
  MembershipRole, 
  MembershipStatus, 
  MembershipPermission,
  BranchProduct,
  TableContext,
  MenuPublication
} from '../../domain';
import { INITIAL_CATEGORIES, INITIAL_PRODUCTS } from '../../constants';
import { RepositoryError } from '../errors';

export interface LocalStorageSchema {
  version: number;
  session: {
    isAuthenticated: boolean;
    userId: string | null;
    activeRestaurantId: string | null;
    activeBranchId: string | null;
  };
  users: Record<string, User & { password?: string }>;
  restaurants: Record<string, Restaurant & { description?: string; address?: string; phone?: string; hours?: Record<string, string> }>;
  branches: Record<string, Branch>;
  memberships: RestaurantMembership[];
  categories: Category[];
  products: Product[];
  branchProducts: Record<string, BranchProduct>; // key is "productId:branchId"
  drafts: Record<string, any[]>; // key is branchId
  publications: Record<string, MenuPublication[]>; // key is branchId
  activePublications: Record<string, string>; // branchId -> publicationId
  settings: Record<string, {
    brandColor: string;
    categoryPageLayout: 'grid' | 'list';
    categoryPageColumns: number;
  }>;
  tables: Record<string, TableContext>; // key is "branchId:tableNumber"
  orders: any[];
  customerContext: { name: string; phone: string; table: string };
}

const STORAGE_KEY = 'vitrin_mvp_v2_storage';
const CURRENT_VERSION = 2;

const DEFAULT_HOURS = {
  saturday: '12:00 - 23:30',
  sunday: '12:00 - 23:30',
  monday: '12:00 - 23:30',
  tuesday: '12:00 - 23:30',
  wednesday: '12:00 - 23:30',
  thursday: '12:00 - 24:00',
  friday: '13:00 - 24:00',
};

const buildDefaultSchema = (): LocalStorageSchema => {
  const users: Record<string, User & { password?: string }> = {
    'usr_admin': {
      id: 'usr_admin',
      email: 'admin@vitrin.ir',
      phone: '09123456789',
      firstName: 'مرتضی',
      lastName: 'احمدی',
      status: UserStatus.ACTIVE,
      createdAt: new Date().toISOString()
    }
  };

  const restaurants: Record<string, Restaurant & { description?: string; address?: string; phone?: string; hours?: Record<string, string> }> = {
    'rest_limoo': {
      id: 'rest_limoo',
      name: 'رستوران ایتالیایی لیمو',
      slug: 'limoo-italian',
      logoUrl: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?q=80&w=1000&auto=format&fit=crop',
      description: 'رستورانی با طعم‌های اصیل و به یادماندنی ایتالیایی و باکیفیت‌ترین مواد اولیه.',
      address: 'تهران، سعادت آباد، میدان کاج، خیابان سرو غربی',
      phone: '021-22001122',
      hours: DEFAULT_HOURS,
      createdAt: new Date().toISOString()
    }
  };

  const branches: Record<string, Branch> = {
    'br_west': {
      id: 'br_west',
      restaurantId: 'rest_limoo',
      name: 'شعبه غرب (سعادت‌آباد)',
      address: 'تهران، سعادت آباد، میدان کاج، پلاک ۱۲',
      phone: '021-22001122',
      createdAt: new Date().toISOString(),
      activeMenuPublicationId: null
    },
    'br_east': {
      id: 'br_east',
      restaurantId: 'rest_limoo',
      name: 'شعبه شرق (تهرانپارس)',
      address: 'تهران، فلکه اول تهرانپارس، مجتمع لیمو',
      phone: '021-77889900',
      createdAt: new Date().toISOString(),
      activeMenuPublicationId: null
    }
  };

  const memberships: RestaurantMembership[] = [
    {
      id: 'mem_admin_limoo',
      userId: 'usr_admin',
      restaurantId: 'rest_limoo',
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
    }
  ];

  const categories: Category[] = INITIAL_CATEGORIES.map(c => ({
    id: c.id,
    restaurantId: 'rest_limoo',
    name: c.name,
    displayOrder: c.order,
    isActive: true,
    image: c.image,
    icon: c.icon
  }));

  const products: Product[] = INITIAL_PRODUCTS.map(p => ({
    id: p.id,
    restaurantId: 'rest_limoo',
    categoryId: p.categoryId,
    name: p.name,
    displayName: p.name,
    description: p.description || '',
    imageReference: p.image || '',
    imageUrl: p.image || '',
    isActive: true,
    modifierGroups: (p.modifiers || []).map((m: any) => ({
      id: m.id,
      name: m.name,
      type: m.type as 'mandatory' | 'optional',
      options: (m.options || []).map((o: any) => ({
        id: o.id,
        name: o.name,
        priceAdjustmentIRR: o.price * 10 // Toman to IRR
      }))
    })),
    tags: p.tags || []
  }));

  const branchProducts: Record<string, BranchProduct> = {};
  products.forEach(p => {
    const legacyProd = INITIAL_PRODUCTS.find(ip => ip.id === p.id);
    const priceToman = legacyProd ? legacyProd.price : 100000;
    const branchPriceIRR = priceToman * 10; // Convert Toman to IRR

    // Add for West branch
    branchProducts[`${p.id}:br_west`] = {
      id: `bp_${p.id}_west`,
      branchId: 'br_west',
      productId: p.id,
      branchPriceIRR,
      availability: 'AVAILABLE',
      isVisible: true
    };

    // Add for East branch
    branchProducts[`${p.id}:br_east`] = {
      id: `bp_${p.id}_east`,
      branchId: 'br_east',
      productId: p.id,
      branchPriceIRR: branchPriceIRR + 10000, // slightly different price for variety
      availability: 'AVAILABLE',
      isVisible: true
    };
  });

  const settings: Record<string, { brandColor: string; categoryPageLayout: 'grid' | 'list'; categoryPageColumns: number }> = {
    'br_west': {
      brandColor: 'emerald',
      categoryPageLayout: 'grid',
      categoryPageColumns: 2
    },
    'br_east': {
      brandColor: 'orange',
      categoryPageLayout: 'list',
      categoryPageColumns: 1
    }
  };

  const tables: Record<string, TableContext> = {};
  for (let i = 1; i <= 10; i++) {
    tables[`br_west:${i}`] = {
      tableNumber: i,
      capacity: i % 2 === 0 ? 4 : 6,
      qrCodeUrl: `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=https://vitrin.ir/r/limoo-italian/b/br_west/t/${i}`
    };
    tables[`br_east:${i}`] = {
      tableNumber: i,
      capacity: i % 2 === 0 ? 2 : 8,
      qrCodeUrl: `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=https://vitrin.ir/r/limoo-italian/b/br_east/t/${i}`
    };
  }

  return {
    version: CURRENT_VERSION,
    session: {
      isAuthenticated: false,
      userId: null,
      activeRestaurantId: null,
      activeBranchId: null
    },
    users,
    restaurants,
    branches,
    memberships,
    categories,
    products,
    branchProducts,
    drafts: {},
    publications: {},
    activePublications: {},
    settings,
    tables,
    orders: [],
    customerContext: { name: '', phone: '', table: '5' }
  };
};

type StorageListener = (schema: LocalStorageSchema) => void;

class LocalStorageAdapter {
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

  public load(): LocalStorageSchema {
    if (typeof window === 'undefined') {
      return buildDefaultSchema();
    }

    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) {
        const schema = buildDefaultSchema();
        this.save(schema);
        return schema;
      }

      const parsed = JSON.parse(raw);
      if (!parsed || parsed.version !== CURRENT_VERSION) {
        // Upgrade or re-create safely on version discrepancy
        const freshSchema = buildDefaultSchema();
        this.save(freshSchema);
        return freshSchema;
      }

      return parsed as LocalStorageSchema;
    } catch (e) {
      console.error('Error parsing storage safely. Falling back to default:', e);
      return buildDefaultSchema();
    }
  }

  public save(schema: LocalStorageSchema): void {
    if (typeof window === 'undefined') return;

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(schema));
      this.notify(schema);
    } catch (e) {
      console.error('Failed to persist state in storage:', e);
      throw new RepositoryError('STORAGE_FAILURE', 'امکان ذخیره‌سازی داده در حافظه مرورگر وجود ندارد.');
    }
  }

  public subscribe(listener: StorageListener): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notify(schema: LocalStorageSchema): void {
    this.listeners.forEach((listener) => {
      try {
        listener(schema);
      } catch (e) {
        console.error('Storage listener callback failed:', e);
      }
    });
  }
}

export const localStore = new LocalStorageAdapter();
