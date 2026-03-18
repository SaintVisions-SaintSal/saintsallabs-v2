import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { adminSupabase, PRICE_TO_TIER, TIER_CONFIG } from '@/lib/sal-admin'
import { sendWelcomeEmail } from '@/lib/email/resend'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2026-02-25.clover',
})

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET || ''

/* ─── Write tier update to profiles (Ritik's exact schema) ─── */

async function updateProfileByCustomer(customerId: string, tier: string, stripeSubId?: string) {
  const tierConfig = TIER_CONFIG[tier] || TIER_CONFIG.free
  const update: Record<string, unknown> = {
    tier,
    compute_tier: tierConfig.compute_tier,
    request_limit: tierConfig.request_limit,
    updated_at: new Date().toISOString(),
  }
  if (stripeSubId) update.stripe_subscription_id = stripeSubId

  const { error } = await adminSupabase
    .from('profiles')
    .update(update)
    .eq('stripe_customer_id', customerId)

  if (error) console.error('[webhook] profiles update failed:', error.message)
}

/* ─── POST ─────────────────────────────────────────────────── */

export async function POST(req: NextRequest) {
  const body = await req.text()
  const sig = req.headers.get('stripe-signature')

  if (!sig) return NextResponse.json({ error: 'Missing stripe-signature' }, { status: 400 })

  let event: Stripe.Event
  try {
    event = stripe.webhooks.constructEvent(body, sig, webhookSecret)
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err)
    console.error('[webhook] signature failed:', msg)
    return NextResponse.json({ error: `Signature failed: ${msg}` }, { status: 400 })
  }

  try {
    switch (event.type) {

      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session
        const customerId = typeof session.customer === 'string' ? session.customer : session.customer?.id
        const subId      = typeof session.subscription === 'string' ? session.subscription : session.subscription?.id

        if (!customerId) break

        let priceId = session.metadata?.price_id
        if (!priceId && subId) {
          const sub = await stripe.subscriptions.retrieve(subId)
          priceId = sub.items.data[0]?.price?.id
        }

        const tier = priceId ? (PRICE_TO_TIER[priceId] || 'free') : 'free'

        const supabaseUserId = session.metadata?.supabase_user_id
        if (supabaseUserId) {
          const tierConfig = TIER_CONFIG[tier] || TIER_CONFIG.free
          await adminSupabase.from('profiles').update({
            tier,
            compute_tier: tierConfig.compute_tier,
            request_limit: tierConfig.request_limit,
            stripe_customer_id: customerId,
            stripe_subscription_id: subId || null,
            billing_cycle_start: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          }).eq('id', supabaseUserId)
        } else {
          await updateProfileByCustomer(customerId, tier, subId)
        }
        // Send welcome/upgrade email
        try {
          const customer = await stripe.customers.retrieve(customerId) as Stripe.Customer
          const email = customer.email || ''
          const name  = (customer.name || email).split('@')[0]
          if (email) await sendWelcomeEmail(email, name, tier)
        } catch (emailErr) {
          console.warn('[webhook] welcome email failed:', emailErr)
        }

        console.log(`[webhook] checkout.completed → tier=${tier} customer=${customerId}`)
        break
      }

      case 'customer.subscription.updated': {
        const sub = event.data.object as Stripe.Subscription
        const customerId = typeof sub.customer === 'string' ? sub.customer : sub.customer.id
        const priceId    = sub.items.data[0]?.price?.id
        const tier       = priceId ? (PRICE_TO_TIER[priceId] || 'free') : 'free'
        await updateProfileByCustomer(customerId, tier, sub.id)
        console.log(`[webhook] subscription.updated → tier=${tier}`)
        break
      }

      case 'customer.subscription.deleted': {
        const sub = event.data.object as Stripe.Subscription
        const customerId = typeof sub.customer === 'string' ? sub.customer : sub.customer.id
        await updateProfileByCustomer(customerId, 'free')
        console.log(`[webhook] subscription.deleted → reverted to free`)
        break
      }

      default:
        break
    }
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err)
    console.error(`[webhook] handler error for ${event.type}:`, msg)
    return NextResponse.json({ error: msg }, { status: 500 })
  }

  return NextResponse.json({ received: true })
}
