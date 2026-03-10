import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2026-02-25.clover',
});

/* ─── Price IDs (configure in Stripe Dashboard) ────────────── */

export const PRICE_IDS = {
  starter_monthly: 'price_starter_monthly',
  pro_monthly: 'price_pro_monthly',
  teams_monthly: 'price_teams_monthly',
} as const;

/* ─── Create checkout session ──────────────────────────────── */

export async function createCheckoutSession(
  priceId: string,
  customerId: string,
  successUrl: string,
  cancelUrl: string,
): Promise<string> {
  const session = await stripe.checkout.sessions.create({
    customer: customerId,
    mode: 'subscription',
    line_items: [{ price: priceId, quantity: 1 }],
    success_url: successUrl,
    cancel_url: cancelUrl,
    allow_promotion_codes: true,
  });

  if (!session.url) {
    throw new Error('Stripe session created without URL');
  }

  return session.url;
}
