import { NextRequest, NextResponse } from 'next/server';
import { updateSession } from '@/lib/supabase/middleware';

const ALLOWED_ORIGINS = [
  'https://saintsallabs.com',
  'https://www.saintsallabs.com',
  'https://saintsal.ai',
  'https://www.saintsal.ai',
];

// Routes that don't require authentication
const PUBLIC_PATHS = [
  '/login',
  '/signup',
  '/callback',
  '/privacy',
  '/terms',
  '/app-clip',
];

function isPublic(pathname: string) {
  return PUBLIC_PATHS.some((p) => pathname === p || pathname.startsWith(p + '/'));
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const origin = request.headers.get('origin') ?? '';
  const isAllowedOrigin = ALLOWED_ORIGINS.includes(origin);

  // ── CORS preflight ──────────────────────────────────────────────────────────
  if (request.method === 'OPTIONS') {
    const res = new NextResponse(null, { status: 204 });
    if (isAllowedOrigin) {
      res.headers.set('Access-Control-Allow-Origin', origin);
      res.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
      res.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization, x-sal-key, stripe-signature');
      res.headers.set('Access-Control-Max-Age', '86400');
    }
    return res;
  }

  // ── Refresh Supabase session cookies on every request ──────────────────────
  const { user, supabaseResponse } = await updateSession(request);

  // ── CORS response header for actual requests ────────────────────────────────
  if (isAllowedOrigin) {
    supabaseResponse.headers.set('Access-Control-Allow-Origin', origin);
    supabaseResponse.headers.set('Vary', 'Origin');
  }

  // ── Route protection ────────────────────────────────────────────────────────
  // API routes: no redirect, just let them 401 from the handler
  if (pathname.startsWith('/api/')) {
    return supabaseResponse;
  }

  // Authenticated users hitting login/signup → send to dashboard
  if (user && isPublic(pathname)) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  // Unauthenticated users hitting protected routes → send to login
  if (!user && !isPublic(pathname)) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('next', pathname);
    return NextResponse.redirect(loginUrl);
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization)
     * - favicon.ico, sitemap.xml, robots.txt
     * - public folder assets
     */
    '/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|mp4|woff2?)$).*)',
  ],
};
