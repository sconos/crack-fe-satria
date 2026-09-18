// src/lib/api/auth.ts
import { api, setAccessToken, setSessionHint, setRoleHint } from './client';

export interface AuthUser {
  id: string;
  email: string;
  role: 'ADMIN' | 'HR' | 'EMPLOYEE';
}

interface AuthResponse {
  accessToken: string;
  user: AuthUser;
}

export async function login(email: string, password: string) {
  const data = await api.post<AuthResponse>('/auth/login', { email, password }, { skipAuth: true });
  setAccessToken(data.accessToken);
  setSessionHint(true);
  setRoleHint(data.user.role);
  return data.user;
}

export async function forgotPassword(email: string) {
  return api.post<{ message: string; resetToken?: string }>(
    '/auth/forgot-password',
    { email },
    { skipAuth: true },
  );
}

export async function resetPassword(token: string, password: string) {
  return api.post<{ message: string }>('/auth/reset-password', { token, password }, { skipAuth: true });
}

export async function logout() {
  await api.post('/auth/logout');
  setAccessToken(null);
  setSessionHint(false);
  setRoleHint(null);
}