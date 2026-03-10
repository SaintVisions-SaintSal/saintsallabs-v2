'use client';

import { useEffect, useState, useCallback } from 'react';
import { Check, Star } from 'lucide-react';
import { useAppStore } from '@/stores/app-store';
import { cn } from '@/lib/utils/cn';
import type { PlanTier } from '@/types';

/* ─── Tier data ────────────────────────────────────────────── */

interface PricingTier {
  id: PlanTier;
  name: string;
  monthlyPrice: number;
  annualPrice: number;
  credits: string;
  modelAccess: string;
  popular?: boolean;
  features: string[];
  cta: 'current' | 'upgrade' | 'contact';
  monthlyPriceId: string;
  annualPriceId: string;
}

const TIERS: PricingTier[] = [
  {
    id: 'free',
    name: 'Free',
    monthlyPrice: 0,
    annualPrice: 0,
    credits: '100',
    modelAccess: 'SAL Mini',
    features: [
      'Basic chat across all verticals',
      'SAL Mini models (Haiku, GPT-5 Fast, Flash)',
      '3 builder runs per day',
      'Community support',
    ],
    cta: 'current',
    monthlyPriceId: 'price_1T5bkAL47U80vDLAslOm3HoX',
    annualPriceId: 'price_1T7p1tL47U80vDLAnxtkrGV4',
  },
  {
    id: 'starter',
    name: 'Starter',
    monthlyPrice: 27,
    annualPrice: 270,
    credits: '500',
    modelAccess: 'SAL Pro',
    features: [
      'Everything in Free',
      'SAL Pro models (Sonnet, GPT-5 Core, Gemini Pro)',
      'Social Studio access',
      '10 builder runs per day',
      'Conversation history',
      'Email support',
    ],
    cta: 'upgrade',
    monthlyPriceId: 'price_1T5bkAL47U80vDLAaChP4Hqg',
    annualPriceId: 'price_1T7p1sL47U80vDLAYEEv8Kmg',
  },
  {
    id: 'pro',
    name: 'Pro',
    monthlyPrice: 97,
    annualPrice: 970,
    credits: '2,000',
    modelAccess: 'SAL Max',
    popular: true,
    features: [
      'Everything in Starter',
      'SAL Max models (Opus, GPT-5 Extended, Deep Think)',
      'All features unlocked',
      'Unlimited builder runs',
      'Voice AI access',
      'Career Suite access',
      'Business Plan generator',
      'Priority support',
    ],
    cta: 'upgrade',
    monthlyPriceId: 'price_1T5bkBL47U80vDLALiVDkOgb',
    annualPriceId: 'price_1T7p1tL47U80vDLAk5HK8YcR',
  },
  {
    id: 'teams',
    name: 'Teams',
    monthlyPrice: 297,
    annualPrice: 2970,
    credits: '10,000',
    modelAccess: 'SAL Max Fast',
    features: [
      'Everything in Pro',
      'SAL Max Fast (parallel processing)',
      'Team workspace & management',
      'Shared conversation library',
      'Admin dashboard',
      'Priority support with SLA',
      'Custom integrations',
    ],
    cta: 'upgrade',
    monthlyPriceId: 'price_1T5bkCL47U80vDLANsCa647K',
    annualPriceId: 'price_1T7p1uL47U80vDLAjlnLTuul',
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    monthlyPrice: 497,
    annualPrice: 4970,
    credits: 'Unlimited',
    modelAccess: 'All Models',
    features: [
      'Everything in Teams',
      'All model tiers included',
      'Unlimited credits',
      'SSO / SAML integration',
      'Custom SLA',
      'Dedicated account manager',
      'On-premise deployment option',
      'Custom model fine-tuning',
    ],
    cta: 'contact',
    monthlyPriceId: 'price_1T5bkDL47U80vDLANXWF33A7',
    annualPriceId: 'price_1T7p1uL47U80vDLAk9UA0lnr',
  },
];

/* ─── Component ────────────────────────────────────────────── */

export default function PricingPage() {
  const setActivePage = useAppStore((s) => s.setActivePage);
  const userPlan = useAppStore((s) => s.user?.plan_tier ?? 'free');
  const [annual, setAnnual] = useState(false);
  const [loadingTier, setLoadingTier] = useState<string | null>(null);

  useEffect(() => {
    setActivePage('pricing');
  }, [setActivePage]);

  const handleUpgrade = useCallback(
    async (tier: PricingTier) => {
      setLoadingTier(tier.id);
      try {
        const priceId = annual ? tier.annualPriceId : tier.monthlyPriceId;
        const res = await fetch('/api/webhooks/stripe', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            action: 'create-checkout',
            priceId,
            successUrl: `${window.location.origin}/pricing?success=true`,
            cancelUrl: `${window.location.origin}/pricing`,
          }),
        });
        const data = await res.json();
        if (data.url) {
          window.location.href = data.url;
        }
      } catch (err) {
        console.error('Checkout error:', err);
      } finally {
        setLoadingTier(null);
      }
    },
    [annual],
  );

  return (
    <div className="px-4 py-8 pb-32">
      {/* Heading */}
      <div className="mb-6 text-center">
        <h1 className="text-2xl font-bold text-sal-text">Choose Your Plan</h1>
        <p className="mt-1 text-sm text-sal-text-muted">
          Scale your intelligence with SAL
        </p>
      </div>

      {/* Annual / Monthly toggle */}
      <div className="mb-8 flex items-center justify-center gap-3">
        <span
          className={cn(
            'text-xs font-medium',
            !annual ? 'text-sal-text' : 'text-sal-text-muted',
          )}
        >
          Monthly
        </span>
        <button
          onClick={() => setAnnual((v) => !v)}
          className={cn(
            'relative h-6 w-11 rounded-full transition-colors',
            annual ? 'bg-sal-gold' : 'bg-sal-border',
          )}
        >
          <span
            className={cn(
              'absolute top-1 h-4 w-4 rounded-full bg-white transition-transform',
              annual ? 'left-[22px]' : 'left-1',
            )}
          />
        </button>
        <span
          className={cn(
            'text-xs font-medium',
            annual ? 'text-sal-text' : 'text-sal-text-muted',
          )}
        >
          Annual
        </span>
        {annual && (
          <span className="rounded-full bg-sal-green/15 px-2 py-0.5 text-[10px] font-bold text-sal-green">
            Save ~17%
          </span>
        )}
      </div>

      {/* Tier grid */}
      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        {TIERS.map((tier) => {
          const isCurrent = userPlan === tier.id;
          const price = annual ? tier.annualPrice : tier.monthlyPrice;
          const isLoading = loadingTier === tier.id;

          return (
            <div
              key={tier.id}
              className={cn(
                'relative flex flex-col rounded-lg border p-5 transition-all',
                tier.popular
                  ? 'border-sal-gold bg-sal-gold/[0.03] shadow-[0_0_24px_rgba(245,158,11,0.08)]'
                  : 'border-sal-border bg-sal-surface',
              )}
            >
              {/* Popular badge */}
              {tier.popular && (
                <div className="absolute -top-3 left-1/2 flex -translate-x-1/2 items-center gap-1 rounded-full bg-sal-gold px-3 py-0.5 text-[10px] font-bold uppercase tracking-wide text-black">
                  <Star size={10} fill="currentColor" /> Most Popular
                </div>
              )}

              {/* Name */}
              <h2 className="text-lg font-bold text-sal-text">{tier.name}</h2>

              {/* Price */}
              <div className="mt-2 flex items-baseline gap-1">
                {price === 0 ? (
                  <span className="text-2xl font-bold text-sal-text">$0</span>
                ) : (
                  <>
                    <span className="text-2xl font-bold text-sal-text">
                      ${annual ? Math.round(price / 12) : price}
                    </span>
                    <span className="text-xs text-sal-text-muted">/mo</span>
                  </>
                )}
              </div>
              {annual && price > 0 && (
                <div className="mt-0.5 text-[10px] text-sal-text-muted">
                  ${price.toLocaleString()}/yr billed annually
                </div>
              )}
              {!annual && price === 0 && (
                <div className="mt-0.5 text-[10px] text-sal-text-muted">
                  forever
                </div>
              )}

              {/* Credits & model access */}
              <div className="mt-3 space-y-1 border-b border-sal-border pb-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-sal-text-muted">Credits / month</span>
                  <span className="font-medium text-sal-text">
                    {tier.credits}
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-sal-text-muted">Model access</span>
                  <span className="font-medium text-sal-gold">
                    {tier.modelAccess}
                  </span>
                </div>
              </div>

              {/* Feature list */}
              <ul className="mt-3 flex-1 space-y-1.5">
                {tier.features.map((feature) => (
                  <li
                    key={feature}
                    className="flex items-start gap-1.5 text-xs text-sal-text-muted"
                  >
                    <Check
                      size={12}
                      className="mt-0.5 shrink-0 text-sal-green"
                    />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              {/* CTA */}
              <div className="mt-4">
                {isCurrent ? (
                  <button
                    disabled
                    className="w-full rounded-md bg-sal-surface2 px-3 py-2 text-xs font-semibold text-sal-text-muted"
                  >
                    Current Plan
                  </button>
                ) : tier.cta === 'contact' ? (
                  <button className="w-full rounded-md border border-sal-border px-3 py-2 text-xs font-semibold text-sal-text transition-colors hover:border-sal-gold hover:text-sal-gold">
                    Contact Sales
                  </button>
                ) : (
                  <button
                    onClick={() => handleUpgrade(tier)}
                    disabled={isLoading}
                    className={cn(
                      'w-full rounded-md px-3 py-2 text-xs font-semibold transition-colors disabled:opacity-60',
                      tier.popular
                        ? 'bg-sal-gold text-black hover:bg-sal-gold-hover'
                        : 'bg-sal-gold/10 text-sal-gold hover:bg-sal-gold/20',
                    )}
                  >
                    {isLoading ? 'Redirecting…' : 'Upgrade'}
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer note */}
      <p className="mt-6 text-center text-[10px] text-sal-text-muted">
        All plans include access to every vertical (Search, Sports, News, Tech,
        Finance, Real Estate, Medical). Prices in USD. Cancel anytime.
      </p>
    </div>
  );
}
