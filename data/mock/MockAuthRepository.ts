import { AuthRepository } from '../contracts/AuthRepository';
import { User, UserStatus, AuthProvider, AppSession } from '../../domain';
import { storageAdapter } from '../storage/StorageAdapter';

const delay = (ms = 150) => new Promise(resolve => setTimeout(resolve, ms));

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

    const mockUser: User = {
      id: data.auth.userId,
      email: 'edmundchatterton@gmail.com',
      firstName: 'ادمون',
      lastName: 'چترتون',
      status: UserStatus.ACTIVE,
      createdAt: new Date().toISOString()
    };

    return {
      id: 'mock-session-id',
      userId: data.auth.userId,
      user: mockUser,
      token: 'mock-jwt-token-xyz',
      expiresAt: new Date(Date.now() + 86400 * 1000).toISOString()
    };
  }

  async login(password: string, customRestaurantName?: string): Promise<AppSession> {
    await delay(300); // slightly longer for authentication
    const data = storageAdapter.load();
    
    data.auth.isAuthenticated = true;
    data.auth.userId = 'mock-admin-id';
    
    if (customRestaurantName) {
      data.tenant.restaurantName = customRestaurantName;
    }
    
    storageAdapter.save(data);

    const mockUser: User = {
      id: 'mock-admin-id',
      email: 'edmundchatterton@gmail.com',
      firstName: 'ادمون',
      lastName: 'چترتون',
      status: UserStatus.ACTIVE,
      createdAt: new Date().toISOString()
    };

    return {
      id: 'mock-session-id',
      userId: 'mock-admin-id',
      user: mockUser,
      token: 'mock-jwt-token-xyz',
      expiresAt: new Date(Date.now() + 86400 * 1000).toISOString()
    };
  }

  async logout(): Promise<void> {
    await delay(100);
    const data = storageAdapter.load();
    data.auth.isAuthenticated = false;
    data.auth.userId = null;
    storageAdapter.save(data);
  }
}
export const mockAuthRepository = new MockAuthRepository();
