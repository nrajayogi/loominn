import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
    // In a real app, verify session token here.
    // For this mock, we'll check for a cookie or just rely on client-side context (which is weaker but works for mock).
    // However, pure client-side redirect allows "flicker".
    // Let's implement a simple cookie check if possible, or skip middleware enforcement for now and rely on AuthContext for the mock.
    // BUT the user asked for "proper security system".
    // I will check for a cookie 'loominn_session' (which I should set in AuthContext).

    const hasSession = request.cookies.has('loominn_session'); // Mock session cookie
    const isAuthPage = request.nextUrl.pathname.startsWith('/login') || request.nextUrl.pathname.startsWith('/signup');
    const isPublicPage = request.nextUrl.pathname === '/';

    // Protected Routes
    if (!hasSession && !isAuthPage && !isPublicPage && !request.nextUrl.pathname.startsWith('/_next') && !request.nextUrl.pathname.startsWith('/api')) {
        // Redirect to login
        return NextResponse.redirect(new URL('/login', request.url));
    }

    // If already logged in, redirect away from login/signup
    if (hasSession && isAuthPage) {
        return NextResponse.redirect(new URL('/feed', request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - api (API routes)
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         * - public folder files (images etc)
         */
        '/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)',
    ],
};
