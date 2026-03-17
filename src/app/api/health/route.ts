import { NextResponse } from 'next/server';

export const runtime = 'edge';

export async function GET() {
  return NextResponse.json({
    status: 'ok',
    app: 'SaintSal™ Labs v2',
    version: '2.0.0',
    backend: process.env.NEXT_PUBLIC_API_URL,
    timestamp: new Date().toISOString(),
  });
}
