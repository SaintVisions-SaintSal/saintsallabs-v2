import { NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { adminSupabase, TIER_CONFIG } from '@/lib/sal-admin'

/**
 * Called after first login to ensure a profiles row exists.
 * Safe to call on every login — uses upsert so it's idempotent.
 */
export async function POST() {
  try {
    const cookieStore = await cookies()
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      { cookies: { getAll: () => cookieStore.getAll(), setAll: () => {} } }
    )
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })

    const freeConfig = TIER_CONFIG.free

    // upsert — only sets defaults if row doesn't exist yet
    const { error } = await adminSupabase.from('profiles').upsert({
      id: user.id,
      email: user.email ?? '',
      full_name: user.user_metadata?.full_name ?? user.user_metadata?.name ?? '',
      avatar_url: user.user_metadata?.avatar_url ?? '',
      tier: 'free',
      compute_tier: freeConfig.compute_tier,
      request_limit: freeConfig.request_limit,
      monthly_requests: 0,
      last_request_reset: new Date().toISOString().split('T')[0],
      updated_at: new Date().toISOString(),
    }, {
      onConflict: 'id',
      ignoreDuplicates: true,   // don't overwrite existing rows
    })

    if (error) {
      console.error('[profile-init] upsert error:', error.message)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ ok: true })
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err)
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}

// Allow GET as a health probe (no-op)
export async function GET() {
  return NextResponse.json({ ok: true })
}
