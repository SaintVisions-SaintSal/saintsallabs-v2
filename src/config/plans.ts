import type { PlanTier } from '@/types';

/* ─── Plan Limits — single source of truth ──────────────────── */

export interface PlanLimits {
  label: string;
  price: string;
  // Messages
  dailyMessages: number | 'unlimited';
  // AI models
  salTier: 'mini' | 'pro' | 'max' | 'max-fast';  // highest SAL tier they can pick
  // Builder
  builderRunsPerDay: number | 'unlimited';
  // Features
  ghlBridge: boolean;
  voiceAI: boolean;
  imageGen: boolean;
  videoGen: boolean;
  premiumSnapshots: boolean;
  teamSeats: number;
  // Upgrade prompt copy
  upgradeHook: string;
}

export const PLAN_LIMITS: Record<PlanTier, PlanLimits> = {
  free: {
    label: 'Free',
    price: '$0',
    dailyMessages: 25,
    salTier: 'mini',
    builderRunsPerDay: 3,
    ghlBridge: false,
    voiceAI: false,
    imageGen: false,
    videoGen: false,
    premiumSnapshots: false,
    teamSeats: 1,
    upgradeHook: "You've used your 25 free messages today. Upgrade to Starter for unlimited — just $27/mo.",
  },
  starter: {
    label: 'Starter',
    price: '$27/mo',
    dailyMessages: 'unlimited',
    salTier: 'mini',               // ← unlimited but basic models only
    builderRunsPerDay: 'unlimited',
    ghlBridge: true,               // basic GHL bridge
    voiceAI: false,
    imageGen: false,
    videoGen: false,
    premiumSnapshots: false,
    teamSeats: 1,
    upgradeHook: 'Unlock Pro AI models (Claude Sonnet, GPT-5, Gemini 2.5 Pro) with Pro — $97/mo.',
  },
  pro: {
    label: 'Pro',
    price: '$97/mo',
    dailyMessages: 'unlimited',
    salTier: 'max',                // full access to Mini, Pro, Max
    builderRunsPerDay: 'unlimited',
    ghlBridge: true,
    voiceAI: true,
    imageGen: true,
    videoGen: true,
    premiumSnapshots: true,
    teamSeats: 1,
    upgradeHook: 'Upgrade to Teams for up to 5 seats and parallel AI processing.',
  },
  teams: {
    label: 'Teams',
    price: '$297/mo',
    dailyMessages: 'unlimited',
    salTier: 'max-fast',           // full access including parallel
    builderRunsPerDay: 'unlimited',
    ghlBridge: true,
    voiceAI: true,
    imageGen: true,
    videoGen: true,
    premiumSnapshots: true,
    teamSeats: 5,
    upgradeHook: 'Upgrade to Enterprise for unlimited seats, custom builds, and dedicated onboarding.',
  },
  enterprise: {
    label: 'Enterprise',
    price: '$497/mo',
    dailyMessages: 'unlimited',
    salTier: 'max-fast',
    builderRunsPerDay: 'unlimited',
    ghlBridge: true,
    voiceAI: true,
    imageGen: true,
    videoGen: true,
    premiumSnapshots: true,
    teamSeats: 999,
    upgradeHook: '',
  },
};

/* ─── Helpers ────────────────────────────────────────────────── */

export function canUseModel(tier: PlanTier, salTierId: string): boolean {
  const order: Record<string, number> = { mini: 0, pro: 1, max: 2, 'max-fast': 3 };
  const allowed = PLAN_LIMITS[tier].salTier;
  return (order[salTierId] ?? 0) <= (order[allowed] ?? 0);
}

export function canUseFeature(tier: PlanTier, feature: keyof Pick<PlanLimits,
  'ghlBridge' | 'voiceAI' | 'imageGen' | 'videoGen' | 'premiumSnapshots'
>): boolean {
  return PLAN_LIMITS[tier][feature] as boolean;
}

/* ─── Nav items that require a specific tier ─────────────────── */

export const NAV_TIER_REQUIREMENTS: Record<string, PlanTier> = {
  'voice-ai':     'pro',
  'career-suite': 'pro',
};

export function minTierFor(navId: string): PlanTier | null {
  return NAV_TIER_REQUIREMENTS[navId] ?? null;
}

/* ─── Tier order for comparisons ─────────────────────────────── */

const TIER_ORDER: PlanTier[] = ['free', 'starter', 'pro', 'teams', 'enterprise'];

export function tierAtLeast(userTier: PlanTier, required: PlanTier): boolean {
  return TIER_ORDER.indexOf(userTier) >= TIER_ORDER.indexOf(required);
}
