import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { createCheckoutSession } from '@/lib/stripe/checkout'
import { adminSupabase } from '@/lib/sal-admin'
import Stripe from 'stripe'

function getStripe() {
  return new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_placeholder', {
    apiVersion: '2026-02-25.clover',
  })
}

export async function POST(req: NextRequest) {
  try {
    const { priceId } = await req.json()
    if (!priceId) return NextResponse.json({ error: 'priceId required' }, { status: 400 })

    // Get authenticated user
    const cookieStore = await cookies()
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      { cookies: { getAll: () => cookieStore.getAll(), setAll: () => {} } }
    )
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })

    // Get or create Stripe customer from profiles
    const { data: profile } = await adminSupabase
      .from('profiles')
      .select('stripe_customer_id, email, full_name')
      .eq('id', user.id)
      .single()

    let customerId = profile?.stripe_customer_id

    if (!customerId) {
      // Create Stripe customer and save back to profiles
      const customer = await getStripe().customers.create({
        email: profile?.email || user.email || '',
        name: profile?.full_name || '',
        metadata: { supabase_user_id: user.id, platform: 'saintsallabs.com' },
      })
      customerId = customer.id
      await adminSupabase.from('profiles')
        .update({ stripe_customer_id: customerId })
        .eq('id', user.id)
    }

    const origin = req.headers.get('origin') || 'https://saintsallabs.com'
    const url = await createCheckoutSession({
      priceId,
      customerId,
      successUrl: `${origin}/dashboard?upgraded=true&session_id={CHECKOUT_SESSION_ID}`,
      cancelUrl:  `${origin}/pricing`,
      metadata:   { supabase_user_id: user.id, platform: 'saintsallabs.com', price_id: priceId },
    })

    return NextResponse.json({ url })
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err)
    console.error('[checkout/create]', msg)
    return NextResponse.json({ error: 'Checkout failed', detail: msg }, { status: 500 })
  }
}
