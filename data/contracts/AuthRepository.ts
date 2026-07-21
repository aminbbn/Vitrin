import { User, AppSession } from '../../domain';

export interface AuthRepository {
  isAuthenticated(): Promise<boolean>;
  getCurrentSession(): Promise<AppSession | null>;
  login(password: string, customRestaurantName?: string): Promise<AppSession>;
  loginWithEmail(email: string, password: string): Promise<AppSession>;
  loginWithGoogle(idToken: string): Promise<AppSession>;
  register(email: string, password: string, firstName: string, lastName: string): Promise<User>;
  verifyEmail(userId: string, code: string): Promise<User>;
  forgotPassword(email: string): Promise<void>;
  resetPassword(email: string, code: string, password: string): Promise<void>;
  onboardOwner(userId: string, restaurantName: string, brandColor: string, address: string, phone: string): Promise<void>;
  logout(): Promise<void>;
}

