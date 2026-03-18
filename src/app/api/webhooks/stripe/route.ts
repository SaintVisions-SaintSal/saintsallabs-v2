import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';
import type { PlanTier } from '@/types';
import { upsertGHLContact, triggerGHLWorkflow, GHL_WELCOME_WORKFLOWS } from '@/lib/ghl/saas';
import { welcomeEmailHTML } from '@/lib/email/templates';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_placeholder', {
  apiVersion: '2026-02-25.clover',
});

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET || '';

/* ─── Stripe Price ID → Plan Tier ──────────────────────────── */
/* Monthly and Annual variants for every plan                   */

const PRICE_TO_TIER: Record<string, PlanTier> = {
  // ── Monthly ──────────────────────────────────────────────
  price_1T7p1sL47U80vDLAgU2shcQO: 'starter',  // $27/mo
  price_1T7p1tL47U80vDLAVC0N4N4J: 'pro',      // $97/mo
  price_1T7p1uL47U80vDLA9QF62BKS: 'teams',    // $297/mo
  price_1T7p1uL47U80vDLAR4Wk6uW0: 'enterprise', // $497/mo

  // ── Annual ───────────────────────────────────────────────
  price_1T7p1sL47U80vDLAYEEv8Kmg: 'starter',
  price_1T7p1tL47U80vDLAk5HK8YcR: 'pro',
  price_1T7p1uL47U80vDLAjlnLTuul: 'teams',
  price_1T7p1uL47U80vDLAk9UA0lnr: 'enterprise',
};

const TIER_CREDITS: Record<PlanTier, number> = {
  free:       100,
  starter:    500,
  pro:        2000,
  teams:      10000,
  enterprise: 999999,
};

/* ─── Supabase admin ─────────────────────────────────────────── */

function getAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_KEY!,
  );
}

/* ─── Update Supabase profile ────────────────────────────────── */

async function updateUserPlan(customerId: string, tier: PlanTier) {
  const supabase = getAdminClient();
  const credits = TIER_CREDITS[tier];

  await supabase
    .from('profiles')
    .update({ plan_tier: tier, credits_remaining: credits })
    .eq('stripe_customer_id', customerId);

  await supabase
    .from('user_profiles')
    .update({ tier, compute_minutes_limit: credits })
    .eq('stripe_customer_id', customerId);
}

/* ─── Resolve tier from subscription ────────────────────────── */

function resolveTierFromSub(sub: Stripe.Subscription): PlanTier {
  const priceId = sub.items.data[0]?.price?.id;
  return (priceId && PRICE_TO_TIER[priceId]) ? PRICE_TO_TIER[priceId] : 'free';
}

/* ─── Send Resend welcome email ──────────────────────────────── */

async function sendWelcomeEmail(email: string, name: string, tier: string) {
  const resendKey = process.env.RESEND_API_KEY;
  if (!resendKey) return;

  const tierLabels: Record<string, string> = {
    starter: 'Starter',
    pro: 'Pro',
    teams: 'Teams',
    enterprise: 'Enterprise',
  };

  await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${resendKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: 'SaintSal Labs <welcome@saintsallabs.com>',
      to: email,
      subject: `⚡ Welcome to SaintSal™ ${tierLabels[tier] ?? 'Labs'} — Your Account Is Live`,
      html: welcomeEmailHTML(name, tier),
    }),
  }).catch((e) => console.error('[Resend]', e));
}

/* ─── Handle checkout.session.completed ────────────────────────
   This fires when payment succeeds. We:
   1. Resolve the tier from the purchased price
   2. Update Supabase profile
   3. Upsert GHL contact + tag with plan
   4. Send Resend branded welcome email
   5. Trigger GHL welcome workflow
──────────────────────────────────────────────────────────────── */

async function handleCheckoutComplete(session: Stripe.Checkout.Session) {
  const customerId =
    typeof session.customer === 'string' ? session.customer : session.customer?.id;
  if (!customerId) return;

  const customerEmail = session.customer_details?.email ?? '';
  const customerName  = session.customer_details?.name ?? '';

  // Resolve tier from subscription
  let tier: PlanTier = 'free';
  if (session.subscription) {
    const subId = typeof session.subscription === 'string'
      ? session.subscription
      : session.subscription.id;
    const sub = await stripe.subscriptions.retrieve(subId);
    tier = resolveTierFromSub(sub);
  } else if (session.metadata?.price_id) {
    tier = PRICE_TO_TIER[session.metadata.price_id] ?? 'free';
  }

  // 1. Supabase
  await updateUserPlan(customerId, tier);

  // 2. GHL contact
  const [firstName, ...lastParts] = customerName.trim().split(' ');
  await upsertGHLContact({
    email: customerEmail,
    firstName: firstName ?? '',
    lastName: lastParts.join(' '),
    tier,
    stripeCustomerId: customerId,
  }).catch((e) => console.error('[GHL upsert]', e));

  // 3. Resend welcome email
  await sendWelcomeEmail(customerEmail, customerName, tier);

  // 4. GHL welcome workflow
  const workflowId = GHL_WELCOME_WORKFLOWS[tier];
  if (workflowId) {
    await triggerGHLWorkflow(customerEmail, workflowId)
      .catch((e) => console.error('[GHL workflow]', e));
  }
}

/* ─── POST handler ───────────────────────────────────────────── */

export async function POST(req: NextRequest) {
  const body = await req.text();
  const sig  = req.headers.get('stripe-signature');

  if (!sig) {
    return NextResponse.json({ error: 'Missing stripe-signature' }, { status: 400 });
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, webhookSecret);
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Unknown error';
    console.error('Webhook signature failed:', msg);
    return NextResponse.json({ error: `Signature failed: ${msg}` }, { status: 400 });
  }

  try {
    switch (event.type) {

      case 'checkout.session.completed':
        await handleCheckoutComplete(event.data.object as Stripe.Checkout.Session);
        break;

      case 'customer.subscription.created':
      case 'customer.subscription.updated': {
        const sub = event.data.object as Stripe.Subscription;
        const cid = typeof sub.customer === 'string' ? sub.customer : sub.customer.id;
        await updateUserPlan(cid, resolveTierFromSub(sub));
        break;
      }

      case 'customer.subscription.deleted': {
        const sub = event.data.object as Stripe.Subscription;
        const cid = typeof sub.customer === 'string' ? sub.customer : sub.customer.id;
        await updateUserPlan(cid, 'free');
        // Remove GHL paid tags on cancel
        await upsertGHLContact({
          email: '',
          tier: 'free',
          stripeCustomerId: cid,
        }).catch(() => {});
        break;
      }

      default:
        break;
    }
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Unknown error';
    console.error(`[Stripe webhook] ${event.type} failed:`, msg);
    return NextResponse.json({ error: msg }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}
