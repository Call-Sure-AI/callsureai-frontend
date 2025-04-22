// middleware.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const ALLOWED_EMAILS = [
    'callsureai@gmail.com',
    '10topnotch7007@gmail.com',
]

export function middleware(request: NextRequest) {
    const path = request.nextUrl.pathname;
    if (path === '/' || path === '/auth' || path.startsWith('/api/')) {
        return NextResponse.next();
    }

    console.log("ALL COOKIES", request.cookies);

    const userCookie = request.cookies.get('user');

    console.log('userCookie', userCookie);

    // if (!userCookie) {
    //     console.log('No user cookie found, redirecting to homepage');
    //     return NextResponse.redirect(new URL('/', request.url));
    // }

    try {
        // const authData = JSON.parse(userCookie.value);
        // const userEmail = authData.email;

        // if (!ALLOWED_EMAILS.includes(userEmail)) {
        //     console.log('Email not in allowed list:', userEmail);
        //     return NextResponse.redirect(new URL('/', request.url));
        // }

        return NextResponse.next()
    } catch (error) {
        console.error('Error parsing auth cookie:', error);
        return NextResponse.redirect(new URL('/', request.url));
    }
}

export const config = {
    matcher: [
        /*
         * Match all request paths except:
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         * - public files (public folder)
         */
        '/((?!_next/static|_next/image|favicon.ico|public).*)',
    ],
}