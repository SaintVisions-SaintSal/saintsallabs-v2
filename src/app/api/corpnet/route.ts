import { NextRequest, NextResponse } from 'next/server';
import { STRIPE_PRICES } from '@/lib/stripe/checkout';

/* ─── CorpNet product → Stripe price mapping ───────────────── */

const CORPNET_STRIPE_MAP: Record<string, Record<string, string>> = {
  llc: {
    basic: STRIPE_PRICES.corpnet_llc_basic,
    deluxe: STRIPE_PRICES.corpnet_llc_deluxe,
    complete: STRIPE_PRICES.corpnet_llc_complete,
  },
  corporation: {
    basic: STRIPE_PRICES.corpnet_corp_basic,
    deluxe: STRIPE_PRICES.corpnet_corp_deluxe,
    complete: STRIPE_PRICES.corpnet_corp_complete,
  },
  dba: { standard: STRIPE_PRICES.corpnet_dba },
  registered_agent: { standard: STRIPE_PRICES.corpnet_registered_agent },
  scorp_election: { standard: STRIPE_PRICES.corpnet_scorp_election },
  annual_report: { standard: STRIPE_PRICES.corpnet_annual_report },
  foreign_llc: { standard: STRIPE_PRICES.corpnet_foreign_llc },
  business_license: { standard: STRIPE_PRICES.corpnet_business_license },
  nonprofit: { standard: STRIPE_PRICES.corpnet_nonprofit },
  amendment: { standard: STRIPE_PRICES.corpnet_amendment },
  dissolution: { standard: STRIPE_PRICES.corpnet_dissolution },
};

/* ─── CorpNet pricing data ─────────────────────────────────── */

const CORPNET_PRODUCTS = {
  llc: {
    name: 'LLC Formation',
    tiers: [
      { id: 'basic', name: 'Basic', price: 0, fee: 'State fee only', features: ['Name availability check', 'Articles of Organization', 'Standard processing'] },
      { id: 'deluxe', name: 'Deluxe', price: 99, fee: '+ state fee', features: ['Everything in Basic', 'EIN / Tax ID', 'Operating Agreement', 'Banking Resolution', 'Expedited processing'] },
      { id: 'complete', name: 'Complete', price: 249, fee: '+ state fee', features: ['Everything in Deluxe', 'Registered Agent (1 year)', 'Compliance alerts', 'Business License research', 'Priority processing'] },
    ],
  },
  corporation: {
    name: 'Corporation',
    tiers: [
      { id: 'basic', name: 'Basic', price: 0, fee: 'State fee only', features: ['Name availability check', 'Articles of Incorporation', 'Standard processing'] },
      { id: 'deluxe', name: 'Deluxe', price: 99, fee: '+ state fee', features: ['Everything in Basic', 'EIN / Tax ID', 'Bylaws & Resolutions', 'Stock Certificates', 'Expedited processing'] },
      { id: 'complete', name: 'Complete', price: 249, fee: '+ state fee', features: ['Everything in Deluxe', 'Registered Agent (1 year)', 'Compliance alerts', 'S-Corp election prep', 'Priority processing'] },
    ],
  },
};

/* ─── POST handler ─────────────────────────────────────────── */

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { action } = body;

    switch (action) {
      /* ── Check name availability ──────────────────────── */
      case 'check-availability': {
        const { entityName, state, entityType } = body;
        if (!entityName || !state) {
          return NextResponse.json(
            { error: 'Missing entityName or state' },
            { status: 400 },
          );
        }
        // In production, this would call the CorpNet API.
        // For now, return a simulated response.
        return NextResponse.json({
          available: true,
          entityName,
          state,
          entityType: entityType ?? 'llc',
          suggestions: [
            `${entityName} LLC`,
            `${entityName} Holdings LLC`,
            `${entityName} Group LLC`,
          ],
        });
      }

      /* ── Create order → Stripe checkout ───────────────── */
      case 'create-order': {
        const { product, tier, state: filingState, entityName: name, successUrl, cancelUrl } = body;

        if (!product || !tier) {
          return NextResponse.json(
            { error: 'Missing product or tier' },
            { status: 400 },
          );
        }

        const priceMap = CORPNET_STRIPE_MAP[product];
        if (!priceMap || !priceMap[tier]) {
          return NextResponse.json(
            { error: `Unknown product/tier: ${product}/${tier}` },
            { status: 400 },
          );
        }

        const priceId = priceMap[tier];

        // Create Stripe checkout session
        const { createCheckoutSession } = await import('@/lib/stripe/checkout');
        const url = await createCheckoutSession({
          priceId,
          successUrl: successUrl ?? `${process.env.NEXT_PUBLIC_APP_URL ?? 'https://saintsallabs.com'}/business-center?success=true`,
          cancelUrl: cancelUrl ?? `${process.env.NEXT_PUBLIC_APP_URL ?? 'https://saintsallabs.com'}/business-center`,
          mode: 'payment',
          metadata: {
            type: 'corpnet',
            product,
            tier,
            state: filingState ?? '',
            entityName: name ?? '',
          },
        });

        return NextResponse.json({ url });
      }

      /* ── Get product catalog ──────────────────────────── */
      case 'get-products': {
        return NextResponse.json({ products: CORPNET_PRODUCTS });
      }

      default:
        return NextResponse.json(
          { error: `Unknown action: ${action}` },
          { status: 400 },
        );
    }
  } catch (error) {
    console.error('CorpNet API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 },
    );
  }
}
