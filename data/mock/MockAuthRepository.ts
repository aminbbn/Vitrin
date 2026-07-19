import { AuthRepository } from '../contracts/AuthRepository';
import { User, UserStatus, AppSession, MembershipRole, MembershipStatus, MembershipPermission } from '../../domain';
import { storageAdapter } from '../storage/StorageAdapter';

const delay = (ms = 150) => new Promise(resolve => setTimeout(resolve, ms));

export const MOCK_USERS: Record<string, User> = {
  'user-owner': {
    id: 'user-owner',
    email: 'owner@vitrin.ir',
    firstName: 'امیر',
    lastName: 'صاحبی',
    status: UserStatus.ACTIVE,
    createdAt: new Date().toISOString()
  },
  'mock-admin-id': {
    id: 'mock-admin-id',
    email: 'owner@vitrin.ir',
    firstName: 'امیر',
    lastName: 'صاحبی',
    status: UserStatus.ACTIVE,
    createdAt: new Date().toISOString()
  },
  'user-manager': {
    id: 'user-manager',
    email: 'manager@vitrin.ir',
    firstName: 'سارا',
    lastName: 'رضایی',
    status: UserStatus.ACTIVE,
    createdAt: new Date().toISOString()
  },
  'user-customer': {
    id: 'user-customer',
    email: 'customer@gmail.com',
    firstName: 'حمید',
    lastName: 'احمدی',
    status: UserStatus.ACTIVE,
    createdAt: new Date().toISOString()
  }
};

/**
 * Isolated development-only helper to switch active mock session/user
 */
export function devSwitchMockUser(userId: 'user-owner' | 'user-manager' | 'user-customer' | 'mock-admin-id'): void {
  const data = storageAdapter.load();
  data.auth.isAuthenticated = true;
  data.auth.userId = userId;
  data.auth.activeRestaurantId = null;
  data.auth.activeBranchId = null;
  storageAdapter.save(data);
}

export class MockAuthRepository implements AuthRepository {
  async isAuthenticated(): Promise<boolean> {
    await delay();
    return storageAdapter.load().auth.isAuthenticated;
  }

  async getCurrentSession(): Promise<AppSession | null> {
    await delay();
    const data = storageAdapter.load();
    if (!data.auth.isAuthenticated || !data.auth.userId) {
      return null;
    }

    const userId = data.auth.userId;
    const customUser = data.auth.users?.[userId];
    let user: User;

    if (customUser) {
      user = {
        id: customUser.id,
        email: customUser.email,
        firstName: customUser.firstName,
        lastName: customUser.lastName,
        status: customUser.status as UserStatus,
        createdAt: new Date().toISOString()
      };
    } else {
      user = MOCK_USERS[userId] || MOCK_USERS['mock-admin-id'];
    }

    return {
      id: 'mock-session-id',
      userId: user.id,
      user,
      token: 'mock-jwt-token-xyz',
      expiresAt: new Date(Date.now() + 86400 * 1000).toISOString()
    };
  }

  async login(password: string, customRestaurantName?: string): Promise<AppSession> {
    await delay(300);
    const data = storageAdapter.load();
    
    data.auth.isAuthenticated = true;
    data.auth.userId = 'mock-admin-id';
    
    if (customRestaurantName) {
      data.tenant.restaurantName = customRestaurantName;
    }
    
    storageAdapter.save(data);

    const mockUser = MOCK_USERS['mock-admin-id'];

    return {
      id: 'mock-session-id',
      userId: 'mock-admin-id',
      user: mockUser,
      token: 'mock-jwt-token-xyz',
      expiresAt: new Date(Date.now() + 86400 * 1000).toISOString()
    };
  }

  async loginWithEmail(email: string, password: string): Promise<AppSession> {
    await delay(300);
    const data = storageAdapter.load();
    
    let foundUser = Object.values(data.auth.users || {}).find(u => u.email.toLowerCase() === email.toLowerCase());
    
    if (!foundUser) {
      const staticUser = Object.values(MOCK_USERS).find(u => u.email.toLowerCase() === email.toLowerCase());
      if (staticUser) {
        foundUser = {
          id: staticUser.id,
          email: staticUser.email,
          firstName: staticUser.firstName,
          lastName: staticUser.lastName,
          status: staticUser.status
        };
      }
    }

    if (!foundUser) {
      throw new Error('کاربری با این مشخصات یافت نشد');
    }

    if (foundUser.password && foundUser.password !== password) {
      throw new Error('رمز عبور وارد شده نادرست است');
    }

    data.auth.isAuthenticated = true;
    data.auth.userId = foundUser.id;
    storageAdapter.save(data);

    const user: User = {
      id: foundUser.id,
      email: foundUser.email,
      firstName: foundUser.firstName,
      lastName: foundUser.lastName,
      status: foundUser.status as UserStatus,
      createdAt: new Date().toISOString()
    };

    return {
      id: 'mock-session-id',
      userId: user.id,
      user,
      token: 'mock-jwt-token-xyz',
      expiresAt: new Date(Date.now() + 86400 * 1000).toISOString()
    };
  }

  async register(email: string, password: string, firstName: string, lastName: string): Promise<User> {
    await delay(300);
    const data = storageAdapter.load();
    const emailLower = email.toLowerCase();
    
    const existsInCustom = Object.values(data.auth.users || {}).some(u => u.email.toLowerCase() === emailLower);
    const existsInStatic = Object.values(MOCK_USERS).some(u => u.email.toLowerCase() === emailLower);
    
    if (existsInCustom || existsInStatic) {
      throw new Error('این ایمیل قبلاً ثبت نام کرده است');
    }

    const userId = 'u-' + Math.floor(10000 + Math.random() * 90000);
    const newUser = {
      id: userId,
      email,
      firstName,
      lastName,
      status: UserStatus.PENDING,
      password
    };

    if (!data.auth.users) {
      data.auth.users = {};
    }
    data.auth.users[userId] = newUser;
    
    data.auth.isAuthenticated = true;
    data.auth.userId = userId;
    storageAdapter.save(data);

    return {
      id: newUser.id,
      email: newUser.email,
      firstName: newUser.firstName,
      lastName: newUser.lastName,
      status: UserStatus.PENDING,
      createdAt: new Date().toISOString()
    };
  }

  async verifyEmail(userId: string, code: string): Promise<User> {
    await delay(300);
    const data = storageAdapter.load();
    const customUser = data.auth.users?.[userId];
    
    if (!customUser) {
      throw new Error('کاربر یافت نشد');
    }

    if (code !== '123456' && code.length !== 6) {
      throw new Error('کد تأیید نادرست است. کد نمونه 123456 را وارد کنید.');
    }

    customUser.status = UserStatus.ACTIVE;
    data.auth.users![userId] = customUser;
    storageAdapter.save(data);

    return {
      id: customUser.id,
      email: customUser.email,
      firstName: customUser.firstName,
      lastName: customUser.lastName,
      status: UserStatus.ACTIVE,
      createdAt: new Date().toISOString()
    };
  }

  async forgotPassword(email: string): Promise<void> {
    await delay(300);
    const data = storageAdapter.load();
    const exists = Object.values(data.auth.users || {}).some(u => u.email.toLowerCase() === email.toLowerCase()) || 
                   Object.values(MOCK_USERS).some(u => u.email.toLowerCase() === email.toLowerCase());
    
    if (!exists) {
      throw new Error('کاربری با این ایمیل یافت نشد');
    }
  }

  async resetPassword(email: string, code: string, password: string): Promise<void> {
    await delay(300);
    const data = storageAdapter.load();
    
    if (code !== '123456' && code.length !== 6) {
      throw new Error('کد بازیابی نادرست است. کد نمونه 123456 را وارد کنید.');
    }

    const foundUser = Object.values(data.auth.users || {}).find(u => u.email.toLowerCase() === email.toLowerCase());
    if (foundUser) {
      foundUser.password = password;
      data.auth.users![foundUser.id] = foundUser;
      storageAdapter.save(data);
    } else {
      const staticUser = Object.values(MOCK_USERS).find(u => u.email.toLowerCase() === email.toLowerCase());
      if (staticUser) {
        const userId = staticUser.id;
        if (!data.auth.users) data.auth.users = {};
        data.auth.users[userId] = {
          id: userId,
          email: staticUser.email,
          firstName: staticUser.firstName,
          lastName: staticUser.lastName,
          status: UserStatus.ACTIVE,
          password: password
        };
        storageAdapter.save(data);
      }
    }
  }

  async onboardOwner(userId: string, restaurantName: string, brandColor: string, address: string, phone: string): Promise<void> {
    await delay(300);
    const data = storageAdapter.load();
    
    const restId = 'r-' + Math.floor(10000 + Math.random() * 90000);
    const branchId = 'b-' + Math.floor(10000 + Math.random() * 90000);
    const membershipId = 'm-' + Math.floor(10000 + Math.random() * 90000);

    const newRestaurant = {
      id: restId,
      name: restaurantName,
      slug: restaurantName.toLowerCase().replace(/\s+/g, '-'),
      description: 'رستوران و کسب‌وکار جدید من در پلتفرم ویترین',
      address,
      phone,
      createdAt: new Date().toISOString()
    };

    const newBranch = {
      id: branchId,
      restaurantId: restId,
      name: 'شعبه مرکزی',
      address,
      phone,
      createdAt: new Date().toISOString()
    };

    const newMembership = {
      id: membershipId,
      userId,
      restaurantId: restId,
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
    };

    if (!data.auth.customRestaurants) data.auth.customRestaurants = [];
    data.auth.customRestaurants.push(newRestaurant);

    if (!data.auth.customBranches) data.auth.customBranches = [];
    data.auth.customBranches.push(newBranch);

    if (!data.auth.customMemberships) data.auth.customMemberships = [];
    data.auth.customMemberships.push(newMembership);

    data.auth.activeRestaurantId = restId;
    data.auth.activeBranchId = branchId;
    
    data.tenant.restaurantName = restaurantName;
    data.tenant.brandColor = brandColor;
    data.tenant.address = address;
    data.tenant.phone = phone;

    storageAdapter.save(data);
  }

  async logout(): Promise<void> {
    await delay(100);
    const data = storageAdapter.load();
    data.auth.isAuthenticated = false;
    data.auth.userId = null;
    data.auth.activeRestaurantId = null;
    data.auth.activeBranchId = null;
    storageAdapter.save(data);
  }
}
export const mockAuthRepository = new MockAuthRepository();
