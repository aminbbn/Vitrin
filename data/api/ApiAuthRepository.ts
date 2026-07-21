import { AuthRepository } from '../contracts/AuthRepository';
import { User, AppSession } from '../../domain';
import { api, setTokens, clearTokens, hasStoredTokens, getAccessToken } from './client';

// Backend response shapes (matching DTOs exactly)
interface AuthUser {
  id: string;
  email: string;
  fullName: string;
  status: string;
  createdAt: string;
}

interface TokenPair {
  accessToken: string;
  refreshToken: string;
}

interface AuthResponse {
  user: AuthUser;
  tokens: TokenPair;
}

function mapUser(u: AuthUser): User {
  const parts = u.fullName?.split(/\s+/) ?? [];
  return {
    id: u.id,
    email: u.email,
    firstName: parts[0] || u.fullName,
    lastName: parts.slice(1).join(' ') || '',
    status: u.status as any,
    createdAt: u.createdAt,
  };
}

export class ApiAuthRepository implements AuthRepository {
  async isAuthenticated(): Promise<boolean> {
    return hasStoredTokens();
  }

  async getCurrentSession(): Promise<AppSession | null> {
    if (!hasStoredTokens()) return null;

    try {
      const u = await api.get<AuthUser>('/auth/me');
      const user = mapUser(u);
      return {
        id: `session_${u.id}`,
        userId: u.id,
        user,
        token: getAccessToken() ?? '',
        expiresAt: new Date(Date.now() + 15 * 60 * 1000).toISOString(),
      };
    } catch {
      clearTokens();
      return null;
    }
  }

  async login(password: string): Promise<AppSession> {
    throw new Error('Use loginWithEmail instead');
  }

  async loginWithEmail(email: string, password: string): Promise<AppSession> {
    const res = await api.post<AuthResponse>('/auth/login', { email, password });
    setTokens(res.tokens.accessToken, res.tokens.refreshToken);
    const user = mapUser(res.user);
    return {
      id: `session_${res.user.id}`,
      userId: res.user.id,
      user,
      token: res.tokens.accessToken,
      expiresAt: new Date(Date.now() + 15 * 60 * 1000).toISOString(),
    };
  }

  async register(
    email: string,
    password: string,
    firstName: string,
    lastName: string,
  ): Promise<User> {
    const fullName = `${firstName} ${lastName}`.trim();
    const res = await api.post<AuthResponse>('/auth/register', {
      email,
      password,
      fullName,
    });
    setTokens(res.tokens.accessToken, res.tokens.refreshToken);
    return mapUser(res.user);
  }

  async verifyEmail(_userId: string, _code: string): Promise<User> {
    // Backend does not have email-verification endpoint yet; treat as no-op
    const u = await api.get<AuthUser>('/auth/me');
    return mapUser(u);
  }

  async forgotPassword(_email: string): Promise<void> {
    // Not yet implemented on backend
  }

  async resetPassword(
    _email: string,
    _code: string,
    _password: string,
  ): Promise<void> {
    // Not yet implemented on backend
  }

  async onboardOwner(
    _userId: string,
    restaurantName: string,
    _brandColor: string,
    _address: string,
    _phone: string,
  ): Promise<void> {
    // Create a restaurant + default branch for the new owner
    const slug = restaurantName
      .toLowerCase()
      .replace(/[^a-z0-9\u0600-\u06FF]+/g, '-')
      .replace(/^-|-$/g, '');
    const restaurant = await api.post<{ id: string }>('/restaurants', {
      name: restaurantName,
      slug: slug || `rest-${Date.now()}`,
    });
    await api.post(`/restaurants/${restaurant.id}/branches`, {
      name: 'شعبه اصلی',
    });
  }

  async logout(): Promise<void> {
    // Revoke refresh token on server
    const refreshKey = 'vitrin_refresh_token';
    const storedRefresh =
      typeof window !== 'undefined' ? localStorage.getItem(refreshKey) : null;
    if (storedRefresh) {
      try {
        await api.post('/auth/logout', { refreshToken: storedRefresh });
      } catch {
        // Best-effort; clear locally regardless
      }
    }
    clearTokens();
  }
}

export const apiAuthRepository = new ApiAuthRepository();
