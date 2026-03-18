import { adminSupabase } from '@/lib/sal-admin'

export async function GET() {
  const start = Date.now()

  const { error } = await adminSupabase
    .from('profiles')
    .select('id')
    .limit(1)

  const dbOk = !error
  const latency = Date.now() - start

  return Response.json({
    status: dbOk ? 'ok' : 'degraded',
    timestamp: new Date().toISOString(),
    platform: 'saintsallabs.com',
    db: dbOk ? 'connected' : error?.message,
    latency_ms: latency,
    version: process.env.npm_package_version ?? '1.0.0',
  }, { status: dbOk ? 200 : 503 })
}
