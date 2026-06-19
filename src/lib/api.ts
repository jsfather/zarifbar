import type { User } from '../types';

const TOKEN_KEY = 'zarifbar_auth_token';
const USER_KEY = 'zarifbar_admin_user';

export function getAuthToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function setAuthSession(token: string, user: User) {
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(USER_KEY, JSON.stringify(user));
}

export function clearAuthSession() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
}

export function getStoredUser(): User | null {
  const raw = localStorage.getItem(USER_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as User;
  } catch {
    clearAuthSession();
    return null;
  }
}

type ApiFetchInit = RequestInit & { skipAuth?: boolean };

export async function apiFetch(input: string, init: ApiFetchInit = {}) {
  const { skipAuth, headers, ...rest } = init;
  const mergedHeaders = new Headers(headers);

  if (!skipAuth) {
    const token = getAuthToken();
    if (token) mergedHeaders.set('Authorization', `Bearer ${token}`);
  }

  if (rest.body && !(rest.body instanceof FormData) && !mergedHeaders.has('Content-Type')) {
    mergedHeaders.set('Content-Type', 'application/json');
  }

  const response = await fetch(input, { ...rest, headers: mergedHeaders });

  if (response.status === 401 && !skipAuth) {
    clearAuthSession();
  }

  return response;
}

export async function validateStoredSession(): Promise<User | null> {
  const token = getAuthToken();
  if (!token) {
    clearAuthSession();
    return null;
  }

  try {
    const res = await apiFetch('/api/auth/me');
    if (!res.ok) {
      clearAuthSession();
      return null;
    }
    const data = await res.json();
    if (data.user) {
      localStorage.setItem(USER_KEY, JSON.stringify(data.user));
      return data.user as User;
    }
    clearAuthSession();
    return null;
  } catch {
    return getStoredUser();
  }
}
