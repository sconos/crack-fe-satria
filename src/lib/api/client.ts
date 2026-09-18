// src/lib/api/client.ts
import { SESSION_HINT_COOKIE, ROLE_HINT_COOKIE } from '@/lib/session';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export const API_BASE_URL = BASE_URL;

interface ApiErrorBody {
  message?: string;
  errors?: Record<string, string[]>;
}

export class ApiError extends Error {
  constructor(public status: number, public body: ApiErrorBody | null, message: string) {
    super(message);
  }
}

let accessToken: string | null = null;

export function setAccessToken(token: string | null) {
  accessToken = token;
}

export function getAccessToken() {
  return accessToken;
}

export function setSessionHint(active: boolean) {
  if (typeof document === 'undefined') return; 
  document.cookie = active
    ? `${SESSION_HINT_COOKIE}=1; path=/; max-age=${60 * 60 * 24 * 7}; samesite=lax`
    : `${SESSION_HINT_COOKIE}=; path=/; max-age=0; samesite=lax`;
}

export function setRoleHint(role: string | null) {
  if (typeof document === 'undefined') return;
  document.cookie = role
    ? `${ROLE_HINT_COOKIE}=${role}; path=/; max-age=${60 * 60 * 24 * 7}; samesite=lax`
    : `${ROLE_HINT_COOKIE}=; path=/; max-age=0; samesite=lax`;
}

interface RequestOptions extends Omit<RequestInit, 'body'> {
  body?: unknown;
  skipAuth?: boolean;
}

async function request<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { body, skipAuth, headers, ...rest } = options;

  const isFormData = typeof FormData !== 'undefined' && body instanceof FormData;

  const res = await fetch(`${BASE_URL}${path}`, {
    ...rest,
    method: options.method ?? (body ? 'POST' : 'GET'),
    credentials: 'include',
    headers: {
      ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
      ...(accessToken && !skipAuth ? { Authorization: `Bearer ${accessToken}` } : {}),
      ...headers,
    },
    body: isFormData ? (body as FormData) : body ? JSON.stringify(body) : undefined,
  });

  if (res.status === 401 && !skipAuth && path !== '/auth/refresh') {
    const refreshed = await tryRefresh();
    if (refreshed) return request<T>(path, options);
  }

  const contentType = res.headers.get('content-type');
  const data = contentType?.includes('application/json') ? await res.json() : null;

  if (!res.ok) {
    throw new ApiError(res.status, data, data?.message ?? 'Request failed');
  }

  return data as T;
}

async function tryRefresh(): Promise<boolean> {
  try {
    const res = await fetch(`${BASE_URL}/auth/refresh`, {
      method: 'POST',
      credentials: 'include',
    });
    if (!res.ok) {
      setSessionHint(false);
      return false;
    }
    const data = await res.json();
    setAccessToken(data.accessToken);
    setSessionHint(true);
    return true;
  } catch {
    setSessionHint(false);
    return false;
  }
}

export const api = {
  get: <T>(path: string, options?: RequestOptions) => request<T>(path, { ...options, method: 'GET' }),
  post: <T>(path: string, body?: unknown, options?: RequestOptions) =>
    request<T>(path, { ...options, method: 'POST', body }),
  patch: <T>(path: string, body?: unknown, options?: RequestOptions) =>
    request<T>(path, { ...options, method: 'PATCH', body }),
  delete: <T>(path: string, options?: RequestOptions) => request<T>(path, { ...options, method: 'DELETE' }),
};