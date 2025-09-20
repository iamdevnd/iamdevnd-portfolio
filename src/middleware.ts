// src/middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const response = NextResponse.next();

  // Add security headers to all requests
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set('X-XSS-Protection', '1; mode=block');
  
  // Additional security for admin routes
  if (request.nextUrl.pathname.startsWith('/admin')) {
    response.headers.set('Cache-Control', 'no-store, max-age=0');
    response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
  }

  // Block suspicious requests
  const userAgent = request.headers.get('user-agent') || '';
  const suspiciousPatterns = [
    'bot', 'crawler', 'spider', 'scraper'
  ];
  
  // Only block if accessing admin without proper user agent
  if (request.nextUrl.pathname.startsWith('/admin') && 
      suspiciousPatterns.some(pattern => userAgent.toLowerCase().includes(pattern))) {
    return new NextResponse('Access Denied', { status: 403 });
  }

  return response;
}

export const config = {
  matcher: [
    '/admin/:path*',
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ]
};