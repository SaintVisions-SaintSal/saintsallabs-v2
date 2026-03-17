import Stripe from 'stripe';

// Lazy init — avoids build-time crash when env var not set
let _stripe: Stripe | null = null;
function getStripe() {
  if (!_stripe) {
    _stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_placeholder', {
      apiVersion: '2026-02-25.clover',
    });
  }
  return _stripe;
}
const stripe = { get: getStripe };

/* ─── Real Stripe Price IDs ────────────────────────────────── */

export const STRIPE_PRICES = {
  // Monthly subscription tiers
  free_monthly: 'price_1T5bkAL47U80vDLAslOm3HoX',
  starter_monthly: 'price_1T5bkAL47U80vDLAaChP4Hqg',
  pro_monthly: 'price_1T5bkBL47U80vDLALiVDkOgb',
  teams_monthly: 'price_1T5bkCL47U80vDLANsCa647K',
  enterprise_monthly: 'price_1T5bkDL47U80vDLANXWF33A7',

  // Annual subscription tiers
  free_annual: 'price_1T7p1tL47U80vDLAnxtkrGV4',
  starter_annual: 'price_1T7p1sL47U80vDLAYEEv8Kmg',
  pro_annual: 'price_1T7p1tL47U80vDLAk5HK8YcR',
  teams_annual: 'price_1T7p1uL47U80vDLAjlnLTuul',
  enterprise_annual: 'price_1T7p1uL47U80vDLAk9UA0lnr',

  // Metered compute
  sal_mini_compute: 'price_1T5bkVL47U80vDLAHHAjXmJh',
  sal_pro_compute: 'price_1T5bkWL47U80vDLA4EI3dylp',
  sal_max_compute: 'price_1T5bkXL47U80vDLAh6DLuS0j',
  sal_max_fast_compute: 'price_1T5bkYL47U80vDLAVOs5fj75',

  // CorpNet products
  corpnet_llc_basic: 'price_1T84WEL47U80vDLAYfgh6tne',
  corpnet_llc_deluxe: 'price_1T84WFL47U80vDLAB1q3I1Me',
  corpnet_llc_complete: 'price_1T84WGL47U80vDLAM7AVMeWV',
  corpnet_corp_basic: 'price_1T84WHL47U80vDLA9xXux4cI',
  corpnet_corp_deluxe: 'price_1T84WIL47U80vDLAKaIYgJNq',
  corpnet_corp_complete: 'price_1T84WJL47U80vDLAj35gfAvk',
  corpnet_dba: 'price_1T84WKL47U80vDLAbXKZPWwK',
  corpnet_registered_agent: 'price_1T84WLL47U80vDLAjC6OBz5s',
  corpnet_scorp_election: 'price_1T84WML47U80vDLAhXUDMw0u',
  corpnet_annual_report: 'price_1T84WNL47U80vDLArGpX7xno',
  corpnet_foreign_llc: 'price_1T84WOL47U80vDLAXsI6xTBY',
  corpnet_business_license: 'price_1T84WQL47U80vDLAufdYUp75',
  corpnet_nonprofit: 'price_1T84WRL47U80vDLA1Al99kvx',
  corpnet_amendment: 'price_1T84WSL47U80vDLAtOOfNUiH',
  corpnet_dissolution: 'price_1T84WTL47U80vDLAnWkmbE7L',
} as const;

export type StripePriceKey = keyof typeof STRIPE_PRICES;

/* ─── Create checkout session ──────────────────────────────── */

export async function createCheckoutSession({
  priceId,
  customerId,
  successUrl,
  cancelUrl,
  mode = 'subscription',
  metadata,
}: {
  priceId: string;
  customerId?: string;
  successUrl: string;
  cancelUrl: string;
  mode?: 'subscription' | 'payment';
  metadata?: Record<string, string>;
}): Promise<string> {
  const params: Stripe.Checkout.SessionCreateParams = {
    mode,
    line_items: [{ price: priceId, quantity: 1 }],
    success_url: successUrl,
    cancel_url: cancelUrl,
    allow_promotion_codes: true,
    ...(metadata && { metadata }),
  };

  if (customerId) {
    params.customer = customerId;
  }

  const session = await stripe.get().checkout.sessions.create(params);

  if (!session.url) {
    throw new Error('Stripe session created without URL');
  }

  return session.url;
}

/* ─── Create portal session ────────────────────────────────── */

export async function createPortalSession(
  customerId: string,
  returnUrl: string,
): Promise<string> {
  const session = await stripe.get().billingPortal.sessions.create({
    customer: customerId,
    return_url: returnUrl,
  });
  return session.url;
}
