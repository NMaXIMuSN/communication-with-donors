import {NextRequest, NextResponse} from 'next/server';

export function middleware(request: NextRequest) {
    const response = NextResponse.next();

    const {pathname} = request.nextUrl;

    // Исключаем маршруты /login и /register из проверки
    if (pathname === '/login' || pathname === '/register') {
        return NextResponse.next();
    }

    const accessToken = request.cookies.get('accessToken');

    if (!accessToken) {
        return NextResponse.redirect(new URL('/login', request.url));
    }

    return response;
}

export const config = {
    matcher: ['/((?!api|login|_next/static|_next/image|favicon.ico).*)'],
};
