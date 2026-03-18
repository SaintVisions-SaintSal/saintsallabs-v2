import { NextRequest, NextResponse } from 'next/server'

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, x-sal-key',
}

export function validateRequest(req: NextRequest): { valid: boolean; error?: string } {
  const key = req.headers.get('x-sal-key')
  if (!key) return { valid: false, error: 'Missing x-sal-key header' }
  if (key !== process.env.SAL_GATEWAY_SECRET) return { valid: false, error: 'Invalid API key' }
  return { valid: true }
}

export function gatewayResponse(data: object, status = 200): NextResponse {
  return NextResponse.json(data, { status, headers: CORS_HEADERS })
}

export function handleOptions(): NextResponse {
  return new NextResponse(null, { status: 204, headers: CORS_HEADERS })
}
