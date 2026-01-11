import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function proxy(request: NextRequest) {
  const token = request.cookies.get('accessToken')?.value;
  const { pathname } = request.nextUrl;

  const publicRoutes = ['/', '/login', '/register'];

  const alwaysAccessibleRoutes = ['/courses'];

  //   const adminRoutes = ['/admin'];

  //   const isAdminRoute = adminRoutes.some((route) => pathname.startsWith(route));

  const isAlwaysAccessible = alwaysAccessibleRoutes.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`)
  );

  if (isAlwaysAccessible) {
    return NextResponse.next();
  }

  const isPublicRoute = publicRoutes.includes(pathname);

  if (!token && !isPublicRoute) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('callbackUrl', pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (token && (pathname === '/login' || pathname === '/register')) {
    return NextResponse.redirect(new URL('/student', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - api routes
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico
     * - static files (svg, png, jpg, jpeg, gif, webp)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.svg|.*\\.png|.*\\.jpg|.*\\.jpeg|.*\\.gif|.*\\.webp).*)',
  ],
};
