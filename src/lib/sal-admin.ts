import { createClient } from '@supabase/supabase-js'

// Service-role client — server only, never expose to browser
export const adminSupabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!,
  { auth: { persistSession: false } }
)

// Tier → request_limit + compute_tier (fallback if profile missing these)
export const TIER_CONFIG: Record<string, { request_limit: number; compute_tier: string }> = {
  free:       { request_limit: 50,    compute_tier: 'mini' },
  starter:    { request_limit: 500,   compute_tier: 'mini' },
  pro:        { request_limit: 2000,  compute_tier: 'pro'  },
  teams:      { request_limit: 10000, compute_tier: 'max_fast' },
  enterprise: { request_limit: 99999, compute_tier: 'max' },
}

export const PRICE_TO_TIER: Record<string, string> = {
  // Monthly
  price_1T5bkAL47U80vDLAaChP4Hqg: 'starter',
  price_1T5bkBL47U80vDLALiVDkOgb: 'pro',
  price_1T5bkCL47U80vDLANsCa647K: 'teams',
  price_1T5bkDL47U80vDLANXWF33A7: 'enterprise',
  // Annual
  price_1T7p1sL47U80vDLAYEEv8Kmg: 'starter',
  price_1T7p1tL47U80vDLAk5HK8YcR: 'pro',
  price_1T7p1uL47U80vDLAjlnLTuul: 'teams',
  price_1T7p1uL47U80vDLAk9UA0lnr: 'enterprise',
}

export interface MeteringResult {
  allowed: boolean
  tier: string
  compute_tier: string
  monthly_requests: number
  request_limit: number
  error?: string
}

/**
 * Check if user is under their request limit, then increment.
 * Call this BEFORE every AI request.
 */
export async function checkAndMeter(userId: string): Promise<MeteringResult> {
  const { data: profile, error } = await adminSupabase
    .from('profiles')
    .select('tier, compute_tier, monthly_requests, request_limit, last_request_reset, billing_cycle_start')
    .eq('id', userId)
    .single()

  if (error || !profile) {
    return { allowed: false, tier: 'free', compute_tier: 'mini', monthly_requests: 0, request_limit: 50, error: 'Profile not found' }
  }

  const tier = profile.tier || 'free'
  const compute_tier = profile.compute_tier || TIER_CONFIG[tier]?.compute_tier || 'mini'
  const request_limit = profile.request_limit ?? TIER_CONFIG[tier]?.request_limit ?? 50

  // Reset on 30-day rolling window anchored to billing_cycle_start (not calendar month).
  // Free users with no billing_cycle_start fall back to last_request_reset as anchor.
  // This prevents revenue leakage: a user billed on the 15th resets on the 15th, not the 1st.
  const now = new Date()
  const lastReset = profile.last_request_reset
    ? new Date(profile.last_request_reset)
    : new Date(0)
  let monthly_requests = profile.monthly_requests || 0

  const daysSinceReset = Math.floor(
    (now.getTime() - lastReset.getTime()) / (1000 * 60 * 60 * 24)
  )

  if (daysSinceReset >= 30) {
    monthly_requests = 0
    await adminSupabase.from('profiles').update({
      monthly_requests: 0,
      last_request_reset: now.toISOString().split('T')[0],
    }).eq('id', userId)
  }

  // Gate check
  if (request_limit > 0 && monthly_requests >= request_limit) {
    return { allowed: false, tier, compute_tier, monthly_requests, request_limit, error: 'Monthly request limit reached' }
  }

  // Increment
  await adminSupabase.from('profiles')
    .update({ monthly_requests: monthly_requests + 1 })
    .eq('id', userId)

  return { allowed: true, tier, compute_tier, monthly_requests: monthly_requests + 1, request_limit }
}

/**
 * Update profile after Stripe checkout — tier + compute + Stripe IDs
 */
export async function updateProfileTier(userId: string, priceId: string, stripeCustomerId: string, stripeSubId: string) {
  const tier = PRICE_TO_TIER[priceId] || 'free'
  const tierConfig = TIER_CONFIG[tier]

  await adminSupabase.from('profiles').update({
    tier,
    compute_tier: tierConfig.compute_tier,
    request_limit: tierConfig.request_limit,
    stripe_customer_id: stripeCustomerId,
    stripe_subscription_id: stripeSubId,
    billing_cycle_start: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }).eq('id', userId)
}
