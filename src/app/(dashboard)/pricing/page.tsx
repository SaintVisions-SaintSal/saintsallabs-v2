'use client';

import { useEffect } from 'react';
import { Check, Star } from 'lucide-react';
import { useAppStore } from '@/stores/app-store';
import { cn } from '@/lib/utils/cn';
import type { PlanTier } from '@/types';

/* ─── Tier data ────────────────────────────────────────────── */

interface PricingTier {
  id: PlanTier;
  name: string;
  price: string;
  period: string;
  credits: string;
  modelAccess: string;
  popular?: boolean;
  features: string[];
  cta: 'current' | 'upgrade' | 'contact';
}

const TIERS: PricingTier[] = [
  {
    id: 'free',
    name: 'Free',
    price: '$0',
    period: 'forever',
    credits: '100',
    modelAccess: 'SAL Mini',
    features: [
      'Basic chat across all verticals',
      'SAL Mini models (Haiku, GPT-5 Fast, Flash)',
      '3 builder runs per day',
      'Community support',
    ],
    cta: 'current',
  },
  {
    id: 'starter',
    name: 'Starter',
    price: '$9.99',
    period: '/mo',
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
  },
  {
    id: 'pro',
    name: 'Pro',
    price: '$29.99',
    period: '/mo',
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
  },
  {
    id: 'teams',
    name: 'Teams',
    price: '$79.99',
    period: '/mo per seat',
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
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    price: 'Custom',
    period: '',
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
  },
];

/* ─── Component ────────────────────────────────────────────── */

export default function PricingPage() {
  const setActivePage = useAppStore((s) => s.setActivePage);
  const userPlan = useAppStore((s) => s.user?.plan_tier ?? 'free');

  useEffect(() => {
    setActivePage('pricing');
  }, [setActivePage]);

  return (
    <div className="px-4 py-8 pb-32">
      {/* Heading */}
      <div className="mb-8 text-center">
        <h1 className="text-2xl font-bold text-sal-text">
          Choose Your Plan
        </h1>
        <p className="mt-1 text-sm text-sal-text-muted">
          Scale your intelligence with SAL
        </p>
      </div>

      {/* Tier grid */}
      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        {TIERS.map((tier) => {
          const isCurrent = userPlan === tier.id;

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
                <span className="text-2xl font-bold text-sal-text">
                  {tier.price}
                </span>
                {tier.period && (
                  <span className="text-xs text-sal-text-muted">
                    {tier.period}
                  </span>
                )}
              </div>

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
                    className={cn(
                      'w-full rounded-md px-3 py-2 text-xs font-semibold transition-colors',
                      tier.popular
                        ? 'bg-sal-gold text-black hover:bg-sal-gold-hover'
                        : 'bg-sal-gold/10 text-sal-gold hover:bg-sal-gold/20',
                    )}
                  >
                    Upgrade
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
