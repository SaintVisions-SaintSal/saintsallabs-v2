import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { adminSupabase, TIER_CONFIG } from '@/lib/sal-admin'

export async function GET(req: NextRequest) {
  const { searchParams, origin } = new URL(req.url)
  const code = searchParams.get('code')
  const next = searchParams.get('next') ?? '/chat/search'

  if (code) {
    const cookieStore = await cookies()
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll: () => cookieStore.getAll(),
          setAll: (cookiesToSet) => {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          },
        },
      }
    )

    const { data: { user }, error } = await supabase.auth.exchangeCodeForSession(code)

    if (!error && user) {
      // Ensure profiles row exists (idempotent upsert)
      const freeConfig = TIER_CONFIG.free
      await adminSupabase.from('profiles').upsert({
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
        ignoreDuplicates: true,
      })

      return NextResponse.redirect(`${origin}${next}`)
    }
  }

  // Auth failure → back to login
  return NextResponse.redirect(`${origin}/login?error=auth_callback_failed`)
}
