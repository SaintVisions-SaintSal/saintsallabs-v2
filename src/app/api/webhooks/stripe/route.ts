import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';
import type { PlanTier } from '@/types';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2026-02-25.clover',
});

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

/* ─── Map Stripe price → plan tier ─────────────────────────── */

const PRICE_TO_TIER: Record<string, PlanTier> = {
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
};

const TIER_CREDITS: Record<PlanTier, number> = {
  free: 100,
  starter: 500,
  pro: 2000,
  teams: 10000,
  enterprise: 999999,
};

/* ─── Supabase admin client ────────────────────────────────── */

function getAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_KEY!,
  );
}

/* ─── Update user profile ──────────────────────────────────── */

async function updateUserPlan(
  customerId: string,
  tier: PlanTier,
) {
  const supabase = getAdminClient();

  // Update profiles table
  await supabase
    .from('profiles')
    .update({ plan_tier: tier, credits_remaining: TIER_CREDITS[tier] })
    .eq('stripe_customer_id', customerId);

  // Also sync to user_profiles (shared table used by Labs iOS app)
  await supabase
    .from('user_profiles')
    .update({ tier, compute_minutes_limit: TIER_CREDITS[tier] })
    .eq('stripe_customer_id', customerId);
}

/* ─── Resolve tier from subscription ───────────────────────── */

function resolveTier(subscription: Stripe.Subscription): PlanTier {
  const priceId = subscription.items.data[0]?.price?.id;
  if (priceId && PRICE_TO_TIER[priceId]) {
    return PRICE_TO_TIER[priceId];
  }
  return 'free';
}

/* ─── POST handler ─────────────────────────────────────────── */

export async function POST(req: NextRequest) {
  const body = await req.text();
  const sig = req.headers.get('stripe-signature');

  if (!sig) {
    return NextResponse.json(
      { error: 'Missing stripe-signature header' },
      { status: 400 },
    );
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, webhookSecret);
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    console.error('Webhook signature verification failed:', message);
    return NextResponse.json(
      { error: `Webhook signature verification failed: ${message}` },
      { status: 400 },
    );
  }

  try {
    switch (event.type) {
      case 'customer.subscription.created':
      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription;
        const customerId =
          typeof subscription.customer === 'string'
            ? subscription.customer
            : subscription.customer.id;
        const tier = resolveTier(subscription);
        await updateUserPlan(customerId, tier);
        break;
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription;
        const customerId =
          typeof subscription.customer === 'string'
            ? subscription.customer
            : subscription.customer.id;
        await updateUserPlan(customerId, 'free');
        break;
      }

      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        const customerId =
          typeof session.customer === 'string'
            ? session.customer
            : session.customer?.id;
        if (customerId && session.subscription) {
          const subId =
            typeof session.subscription === 'string'
              ? session.subscription
              : session.subscription.id;
          const subscription = await stripe.subscriptions.retrieve(subId);
          const tier = resolveTier(subscription);
          await updateUserPlan(customerId, tier);
        }
        break;
      }

      default:
        // Unhandled event type — acknowledge silently
        break;
    }
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    console.error(`Webhook handler error for ${event.type}:`, message);
    return NextResponse.json(
      { error: `Webhook handler failed: ${message}` },
      { status: 500 },
    );
  }

  return NextResponse.json({ received: true });
}
