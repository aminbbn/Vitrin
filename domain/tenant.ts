export enum MembershipRole {
  OWNER = 'OWNER',
  MANAGER = 'MANAGER'
}

export enum MembershipStatus {
  ACTIVE = 'ACTIVE',
  INVITED = 'INVITED',
  SUSPENDED = 'SUSPENDED'
}

export enum MembershipPermission {
  MENU_PUBLISH = 'MENU_PUBLISH',
  MENU_ROLLBACK = 'MENU_ROLLBACK',
  CATALOG_MANAGE = 'CATALOG_MANAGE',
  ORDER_MANAGE = 'ORDER_MANAGE',
  PAYMENT_MANAGE = 'PAYMENT_MANAGE'
}

export interface Restaurant {
  id: string; // UUID-like identifier
  name: string;
  slug: string;
  logoUrl?: string;
  createdAt: string;
}

export interface Branch {
  id: string; // UUID-like identifier
  restaurantId: string;
  name: string;
  address: string;
  phone?: string;
  createdAt: string;
  activeMenuPublicationId?: string | null;
}

export interface RestaurantMembership {
  id: string; // UUID-like identifier
  userId: string;
  restaurantId: string;
  role: MembershipRole;
  status: MembershipStatus;
  permissions: MembershipPermission[];
  createdAt: string;
}

export interface RestaurantSummary {
  id: string;
  name: string;
  slug: string;
  description?: string;
  status: 'ACTIVE' | 'SUSPENDED' | 'PENDING';
  currentRole: MembershipRole;
}

export interface BranchSummary {
  id: string;
  restaurantId: string;
  name: string;
  address?: string;
  timezone: string;
  currencyCode: 'IRR' | 'TOMAN';
  publicMenuEnabled: boolean;
  status: 'ACTIVE' | 'INACTIVE';
}
