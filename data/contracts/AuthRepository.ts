import { User, AppSession } from '../../domain';

export interface AuthRepository {
  isAuthenticated(): Promise<boolean>;
  getCurrentSession(): Promise<AppSession | null>;
  login(password: string, customRestaurantName?: string): Promise<AppSession>;
  logout(): Promise<void>;
}
