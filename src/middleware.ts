import { NextRequest, NextResponse } from 'next/server';

const ALLOWED_ORIGINS = [
  'https://saintsallabs.com',
  'https://www.saintsallabs.com',
  'https://saintsal.ai',
  'https://www.saintsal.ai',
];

export function middleware(request: NextRequest) {
  const origin = request.headers.get('origin') ?? '';
  const isAllowed = ALLOWED_ORIGINS.includes(origin);

  // Handle preflight
  if (request.method === 'OPTIONS') {
    const response = new NextResponse(null, { status: 204 });
    if (isAllowed) {
      response.headers.set('Access-Control-Allow-Origin', origin);
      response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
      response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization, x-sal-key, stripe-signature');
      response.headers.set('Access-Control-Max-Age', '86400');
    }
    return response;
  }

  const response = NextResponse.next();

  if (isAllowed) {
    response.headers.set('Access-Control-Allow-Origin', origin);
    response.headers.set('Vary', 'Origin');
  }

  return response;
}

export const config = {
  matcher: '/api/:path*',
};
