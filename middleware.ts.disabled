import { type NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip middleware for static files and API routes
  if (pathname.startsWith('/_next') || 
      pathname.startsWith('/api') ||
      pathname.match(/\.(?:svg|png|jpg|jpeg|gif|webp|ico|css|js)$/)) {
    return NextResponse.next();
  }

  // Check auth token from cookies
  const token = request.cookies.get('auth-token')?.value;
  const isAuthenticated = !!token;

  // Protect dashboard routes
  if (pathname.startsWith('/dashboard') || 
      pathname.startsWith('/admin') ||
      (pathname.startsWith('/business') && pathname.includes('/refer'))) {
    if (!isAuthenticated) {
      return NextResponse.redirect(new URL('/auth/login', request.url));
    }
  }

  // Redirect authenticated users away from auth pages
  if (isAuthenticated && (pathname.startsWith('/auth/login') || 
               pathname.startsWith('/auth/register'))) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
