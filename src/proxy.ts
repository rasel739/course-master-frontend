import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function proxy(request: NextRequest) {
    const token = request.cookies.get('accessToken')?.value;
    const { pathname } = request.nextUrl;

    // Public routes that don't require authentication
    const publicRoutes = ['/', '/login', '/register'];

    // Routes that are always accessible (with or without auth)
    const alwaysAccessibleRoutes = ['/courses'];

    // Admin-only routes
    const adminRoutes = ['/admin'];

    // Check if current path starts with any admin routes
    const isAdminRoute = adminRoutes.some(route => pathname.startsWith(route));

    // Check if current path is always accessible
    const isAlwaysAccessible = alwaysAccessibleRoutes.some(route =>
        pathname === route || pathname.startsWith(`${route}/`)
    );

    // Allow always accessible routes
    if (isAlwaysAccessible) {
        return NextResponse.next();
    }

    // Check if it's a public route
    const isPublicRoute = publicRoutes.includes(pathname);

    // If not authenticated and trying to access protected routes
    if (!token && !isPublicRoute) {
        const loginUrl = new URL('/login', request.url);
        loginUrl.searchParams.set('callbackUrl', pathname);
        return NextResponse.redirect(loginUrl);
    }

    // If authenticated and trying to access login/register
    if (token && (pathname === '/login' || pathname === '/register')) {
        // Redirect to dashboard - role-based redirect will happen client-side
        return NextResponse.redirect(new URL('/dashboard', request.url));
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
