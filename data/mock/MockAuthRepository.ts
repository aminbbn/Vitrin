import { AuthRepository } from '../contracts/AuthRepository';
import { User, AppSession, UserStatus } from '../../domain';
import { sessionRepository } from '../../repositories/local/SessionRepositoryImpl';
import { localStore } from '../../repositories/local/LocalStorageAdapter';

export class MockAuthRepository implements AuthRepository {
  async isAuthenticated(): Promise<boolean> {
    const session = await sessionRepository.getSession();
    return session !== null;
  }

  async getCurrentSession(): Promise<AppSession | null> {
    return sessionRepository.getSession();
  }

  async login(password: string, customRestaurantName?: string): Promise<AppSession> {
    return sessionRepository.signInMock(password);
  }

  async loginWithEmail(email: string, password: string): Promise<AppSession> {
    const store = localStore.load();
    const emailLower = email.toLowerCase();
    
    let userKey = Object.keys(store.users).find(k => store.users[k].email.toLowerCase() === emailLower);
    let userId = userKey || `usr_${Math.random().toString(36).substring(2, 11)}`;
    
    if (!userKey) {
      store.users[userId] = {
        id: userId,
        email: emailLower,
        phone: '09123456789',
        firstName: emailParts(emailLower),
        lastName: 'کاربر',
        status: UserStatus.ACTIVE,
        createdAt: new Date().toISOString()
      };
    }
    
    store.session.isAuthenticated = true;
    store.session.userId = userId;
    store.session.activeRestaurantId = 'rest_limoo';
    store.session.activeBranchId = 'br_west';
    localStore.save(store);

    return {
      id: 'session_mock_id',
      userId,
      user: store.users[userId],
      token: 'jwt_mock_token',
      expiresAt: new Date(Date.now() + 86400 * 1000).toISOString()
    };
  }

  async register(email: string, password: string, firstName: string, lastName: string): Promise<User> {
    const store = localStore.load();
    const id = `usr_${Math.random().toString(36).substring(2, 11)}`;
    const user = {
      id,
      email: email.toLowerCase(),
      firstName,
      lastName,
      status: UserStatus.ACTIVE,
      createdAt: new Date().toISOString()
    };
    store.users[id] = user;
    localStore.save(store);
    return user;
  }

  async verifyEmail(userId: string, code: string): Promise<User> {
    const store = localStore.load();
    const user = store.users[userId];
    if (!user) throw new Error('کاربر یافت نشد');
    user.status = UserStatus.ACTIVE;
    store.users[userId] = user;
    localStore.save(store);
    return user;
  }

  async forgotPassword(email: string): Promise<void> {}

  async resetPassword(email: string, code: string, password: string): Promise<void> {}

  async onboardOwner(userId: string, restaurantName: string, brandColor: string, address: string, phone: string): Promise<void> {
    const store = localStore.load();
    const restId = 'rest_limoo';
    const branchId = 'br_west';
    
    if (store.restaurants[restId]) {
      store.restaurants[restId].name = restaurantName;
      store.restaurants[restId].address = address;
      store.restaurants[restId].phone = phone;
    }
    if (store.branches[branchId]) {
      store.branches[branchId].address = address;
      store.branches[branchId].phone = phone;
    }
    if (store.settings[branchId]) {
      store.settings[branchId].brandColor = brandColor;
    }
    localStore.save(store);
  }

  async logout(): Promise<void> {
    await sessionRepository.signOut();
  }
}

function emailParts(email: string): string {
  return email.split('@')[0] || 'کاربر';
}

export const mockAuthRepository = new MockAuthRepository();

export function devSwitchMockUser(userId: 'user-owner' | 'user-manager' | 'user-customer') {
  const store = localStore.load();
  if (userId === 'user-owner') {
    store.session.isAuthenticated = true;
    store.session.userId = 'mock-admin-id';
    store.session.activeRestaurantId = 'rest_limoo';
    store.session.activeBranchId = 'br_west';
  } else if (userId === 'user-manager') {
    store.session.isAuthenticated = true;
    store.session.userId = 'mock-manager-id';
    store.session.activeRestaurantId = 'rest_limoo';
    store.session.activeBranchId = 'br_west';
  } else {
    // Customer
    store.session.isAuthenticated = true;
    store.session.userId = 'mock-customer-id';
    store.session.activeRestaurantId = null;
    store.session.activeBranchId = null;
  }
  localStore.save(store);
}
