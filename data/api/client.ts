/**
 * Centralised HTTP client for the Vitrin backend API.
 *
 * Responsibilities:
 * - Attach Bearer access-token to every request
 * - Transparently refresh on 401 (with mutex to prevent thundering-herd)
 * - Persist tokens in localStorage
 * - Expose helpers used by all Api*Repository implementations
 */

const API_BASE_URL: string =
  (import.meta as any).env?.VITE_API_BASE_URL ?? 'http://localhost:3000/api/v1';

// ── token persistence ──────────────────────────────────────────────
const ACCESS_KEY = 'vitrin_access_token';
const REFRESH_KEY = 'vitrin_refresh_token';

let _accessToken: string | null = null;
let _refreshToken: string | null = null;

function loadTokens(): void {
  if (typeof window === 'undefined') return;
  _accessToken = localStorage.getItem(ACCESS_KEY);
  _refreshToken = localStorage.getItem(REFRESH_KEY);
}
loadTokens();

export function setTokens(access: string, refresh: string): void {
  _accessToken = access;
  _refreshToken = refresh;
  if (typeof window !== 'undefined') {
    localStorage.setItem(ACCESS_KEY, access);
    localStorage.setItem(REFRESH_KEY, refresh);
  }
}

export function clearTokens(): void {
  _accessToken = null;
  _refreshToken = null;
  if (typeof window !== 'undefined') {
    localStorage.removeItem(ACCESS_KEY);
    localStorage.removeItem(REFRESH_KEY);
  }
}

export function getAccessToken(): string | null {
  return _accessToken;
}

export function hasStoredTokens(): boolean {
  return !!_accessToken && !!_refreshToken;
}

// ── refresh mutex ──────────────────────────────────────────────────
let _refreshPromise: Promise<boolean> | null = null;

async function doRefresh(): Promise<boolean> {
  if (!_refreshToken) return false;

  try {
    const res = await fetch(`${API_BASE_URL}/auth/refresh`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken: _refreshToken }),
    });

    if (!res.ok) {
      clearTokens();
      return false;
    }

    const data = await res.json();
    setTokens(data.accessToken, data.refreshToken);
    return true;
  } catch {
    clearTokens();
    return false;
  }
}

async function refreshAccessToken(): Promise<boolean> {
  if (_refreshPromise) return _refreshPromise;
  _refreshPromise = doRefresh().finally(() => {
    _refreshPromise = null;
  });
  return _refreshPromise;
}

// ── error type ─────────────────────────────────────────────────────
export interface ApiError {
  statusCode: number;
  message: string | string[];
}

export class ApiRequestError extends Error {
  constructor(public statusCode: number, message: string) {
    super(message);
    this.name = 'ApiRequestError';
  }
}

// ── core request helper ────────────────────────────────────────────
async function request<T = unknown>(
  path: string,
  options: RequestInit = {},
  _retried = false,
): Promise<T> {
  const url = `${API_BASE_URL}${path}`;
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...((options.headers as Record<string, string>) ?? {}),
  };

  if (_accessToken) {
    headers['Authorization'] = `Bearer ${_accessToken}`;
  }

  const res = await fetch(url, { ...options, headers });

  // Handle 204 No Content
  if (res.status === 204) {
    return undefined as T;
  }

  // Parse response body
  let body: unknown;
  const contentType = res.headers.get('content-type') ?? '';
  if (contentType.includes('application/json')) {
    body = await res.json();
  } else {
    body = await res.text();
  }

  if (!res.ok) {
    // Attempt single refresh on 401
    if (res.status === 401 && !_retried && _refreshToken) {
      const ok = await refreshAccessToken();
      if (ok) {
        return request<T>(path, options, true);
      }
    }
    const msg =
      typeof body === 'object' && body !== null && 'message' in body
        ? String((body as any).message)
        : `API error ${res.status}`;
    throw new ApiRequestError(res.status, msg);
  }

  return body as T;
}

// ── typed helpers ──────────────────────────────────────────────────
export const api = {
  get: <T = unknown>(path: string) => request<T>(path, { method: 'GET' }),
  post: <T = unknown>(path: string, data?: unknown) =>
    request<T>(path, {
      method: 'POST',
      body: data !== undefined ? JSON.stringify(data) : undefined,
    }),
  put: <T = unknown>(path: string, data?: unknown) =>
    request<T>(path, {
      method: 'PUT',
      body: data !== undefined ? JSON.stringify(data) : undefined,
    }),
  patch: <T = unknown>(path: string, data?: unknown) =>
    request<T>(path, {
      method: 'PATCH',
      body: data !== undefined ? JSON.stringify(data) : undefined,
    }),
  delete: <T = unknown>(path: string) => request<T>(path, { method: 'DELETE' }),
};

export { API_BASE_URL };
