import { SessionRepository } from '../session.repository';
import { AppSession } from '../../domain';
import { localStore } from './LocalStorageAdapter';
import { RepositoryError } from '../errors';

export class SessionRepositoryImpl implements SessionRepository {
  async getSession(): Promise<AppSession | null> {
    const store = localStore.load();
    if (!store.session.isAuthenticated || !store.session.userId) {
      return null;
    }
    const user = store.users[store.session.userId];
    if (!user) {
      return null;
    }
    return {
      id: 'session_mock_id',
      userId: user.id,
      user: {
        id: user.id,
        email: user.email,
        phone: user.phone,
        firstName: user.firstName,
        lastName: user.lastName,
        status: user.status,
        createdAt: user.createdAt
      },
      token: 'jwt_mock_token',
      expiresAt: new Date(Date.now() + 86400 * 1000).toISOString()
    };
  }

  async signInMock(password: string): Promise<AppSession> {
    const store = localStore.load();
    const adminUser = store.users['usr_admin'];
    if (!adminUser) {
      throw new RepositoryError('NOT_FOUND', 'کاربر پیش‌فرض یافت نشد.');
    }
    
    store.session.isAuthenticated = true;
    store.session.userId = adminUser.id;
    store.session.activeRestaurantId = 'rest_limoo';
    store.session.activeBranchId = 'br_west';
    localStore.save(store);

    return {
      id: 'session_mock_id',
      userId: adminUser.id,
      user: {
        id: adminUser.id,
        email: adminUser.email,
        phone: adminUser.phone,
        firstName: adminUser.firstName,
        lastName: adminUser.lastName,
        status: adminUser.status,
        createdAt: adminUser.createdAt
      },
      token: 'jwt_mock_token',
      expiresAt: new Date(Date.now() + 86400 * 1000).toISOString()
    };
  }

  async signOut(): Promise<void> {
    const store = localStore.load();
    store.session.isAuthenticated = false;
    store.session.userId = null;
    store.session.activeRestaurantId = null;
    store.session.activeBranchId = null;
    localStore.save(store);
  }

  subscribe(listener: (session: AppSession | null) => void): () => void {
    return localStore.subscribe(async () => {
      const session = await this.getSession();
      listener(session);
    });
  }
}
export const sessionRepository = new SessionRepositoryImpl();
