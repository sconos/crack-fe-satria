// src/proxy.ts
import { NextRequest, NextResponse } from 'next/server';
import { SESSION_HINT_COOKIE, ROLE_HINT_COOKIE, homePathForRole } from './lib/session';

const AUTH_PATHS = ['/login', '/forgot-password', '/reset-password'];

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const hasSession = request.cookies.has(SESSION_HINT_COOKIE);

  if (AUTH_PATHS.includes(pathname)) {
    if (hasSession) {
      const role = request.cookies.get(ROLE_HINT_COOKIE)?.value ?? null;
      return NextResponse.redirect(new URL(homePathForRole(role), request.url));
    }
    return NextResponse.next();
  }

  if (pathname === '/') {
    return NextResponse.next();
  }

  if (!hasSession) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};