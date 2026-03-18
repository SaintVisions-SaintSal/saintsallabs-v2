import { NextResponse, type NextRequest } from 'next/server';
import { updateSession } from '@/lib/supabase/middleware';

// Marketing + legal pages — always public, no auth required
const PUBLIC_PATHS = [
  '/',
  '/login',
  '/signup',
  '/callback',
  '/privacy',
  '/terms',
  '/app-clip',
];

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip static files and API routes
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.includes('.')
  ) {
    return NextResponse.next();
  }

  const isPublic = PUBLIC_PATHS.some((p) =>
    p === '/' ? pathname === '/' : pathname.startsWith(p),
  );

  // If Supabase env vars aren't set, fail open (don't crash the whole site)
  if (
    !process.env.NEXT_PUBLIC_SUPABASE_URL ||
    !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  ) {
    return NextResponse.next();
  }

  try {
    const { user, supabaseResponse } = await updateSession(request);

    // Unauthenticated on protected route → login
    if (!user && !isPublic) {
      const url = request.nextUrl.clone();
      url.pathname = '/login';
      return NextResponse.redirect(url);
    }

    // Authenticated on auth pages → app
    if (user && (pathname === '/login' || pathname === '/signup')) {
      const url = request.nextUrl.clone();
      url.pathname = '/chat/search';
      return NextResponse.redirect(url);
    }

    return supabaseResponse;
  } catch {
    // Supabase unreachable — fail open so landing page still renders
    return NextResponse.next();
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization)
     * - favicon.ico
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};
