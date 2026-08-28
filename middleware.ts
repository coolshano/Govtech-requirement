// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const authCookie = request.cookies.get('admin_session')?.value;
  const { pathname } = request.nextUrl;

  // If going to any admin route without a session, redirect to /login
  if (pathname.startsWith('/admin') && authCookie !== 'authenticated') {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};