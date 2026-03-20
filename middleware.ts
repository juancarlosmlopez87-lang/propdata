import { NextRequest, NextResponse } from 'next/server';

const rateMap = new Map<string, { count: number; resetAt: number }>();

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = rateMap.get(ip);

  if (!entry || now > entry.resetAt) {
    rateMap.set(ip, { count: 1, resetAt: now + 60_000 });
    return false;
  }

  entry.count++;
  if (entry.count > 60) return true;
  return false;
}

if (typeof setInterval !== 'undefined') {
  setInterval(() => {
    const now = Date.now();
    Array.from(rateMap.keys()).forEach((ip) => {
      const entry = rateMap.get(ip);
      if (entry && now > entry.resetAt) rateMap.delete(ip);
    });
  }, 60_000);
}

// The landing page (/) is public. Login/register are public. Auth API is public.
// Protected routes: /dashboard and any future app routes.
const PUBLIC_PATHS = [
  '/',
  '/login',
  '/registro',
  '/api/auth/',
  '/api/checkout',
  '/api/leads',
  '/_next/',
  '/favicon.ico',
  '/robots.txt',
  '/sitemap.xml',
];

function isPublicPath(pathname: string): boolean {
  return PUBLIC_PATHS.some((p) => pathname === p || pathname.startsWith(p));
}

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Rate limit API routes
  if (pathname.startsWith('/api/')) {
    const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || req.ip || 'unknown';
    if (isRateLimited(ip)) {
      return NextResponse.json(
        { error: 'Demasiadas solicitudes. Intentalo en un minuto.' },
        { status: 429 }
      );
    }
  }

  // Allow public paths
  if (isPublicPath(pathname)) {
    const res = NextResponse.next();
    addSecurityHeaders(res);
    return res;
  }

  // Allow static files
  if (pathname.includes('.') && !pathname.endsWith('/')) {
    const res = NextResponse.next();
    addSecurityHeaders(res);
    return res;
  }

  // Protected routes: check for auth cookie
  const token = req.cookies.get('propdata_user')?.value;
  if (!token) {
    const loginUrl = new URL('/login', req.url);
    return NextResponse.redirect(loginUrl);
  }

  const res = NextResponse.next();
  addSecurityHeaders(res);
  return res;
}

function addSecurityHeaders(res: NextResponse) {
  res.headers.set('X-Content-Type-Options', 'nosniff');
  res.headers.set('X-Frame-Options', 'DENY');
  res.headers.set('X-XSS-Protection', '1; mode=block');
  res.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image).*)',
  ],
};
