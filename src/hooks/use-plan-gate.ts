'use client';

import { useCallback, useMemo } from 'react';
import { useAppStore } from '@/stores/app-store';
import { PLAN_LIMITS, NAV_TIER_REQUIREMENTS, canUseModel, canUseFeature, tierAtLeast, type PlanLimits } from '@/config/plans';
import type { PlanTier } from '@/types';

const DAILY_KEY = 'sal_daily_msgs';

interface DailyCount { date: string; count: number }

function todayStr() {
  return new Date().toISOString().slice(0, 10); // YYYY-MM-DD
}

function getDailyCount(): DailyCount {
  try {
    const raw = localStorage.getItem(DAILY_KEY);
    if (!raw) return { date: todayStr(), count: 0 };
    const parsed: DailyCount = JSON.parse(raw);
    if (parsed.date !== todayStr()) return { date: todayStr(), count: 0 };
    return parsed;
  } catch {
    return { date: todayStr(), count: 0 };
  }
}

function incrementDailyCount(): number {
  const c = getDailyCount();
  const next = { date: c.date, count: c.count + 1 };
  try { localStorage.setItem(DAILY_KEY, JSON.stringify(next)); } catch { /* ssr */ }
  return next.count;
}

/* ─── Hook ────────────────────────────────────────────────────── */

export interface PlanGate {
  tier: PlanTier;
  limits: PlanLimits;
  // Message gate — call before sending; returns null if ok, or the upgrade message
  checkMessage: () => string | null;
  // Increment counter after a successful message
  recordMessage: () => void;
  // Model access
  canUseModel: (salTierId: string) => boolean;
  // Feature access
  canUseFeature: (f: keyof Pick<PlanLimits,
    'ghlBridge' | 'voiceAI' | 'imageGen' | 'videoGen' | 'premiumSnapshots'>) => boolean;
  // Nav access
  canAccessNav: (navId: string) => boolean;
  // Check if at least a given tier
  isAtLeast: (required: PlanTier) => boolean;
  // Remaining messages today (for display)
  dailyRemaining: number | 'unlimited';
}

export function usePlanGate(): PlanGate {
  const { user } = useAppStore();
  const tier: PlanTier = user?.plan_tier ?? 'free';
  const limits = PLAN_LIMITS[tier];

  const dailyUsed = useMemo(() => {
    if (typeof window === 'undefined') return 0;
    return getDailyCount().count;
  }, []);

  const checkMessage = useCallback((): string | null => {
    if (limits.dailyMessages === 'unlimited') return null;
    const used = getDailyCount().count;
    if (used >= limits.dailyMessages) {
      return limits.upgradeHook;
    }
    return null;
  }, [limits]);

  const recordMessage = useCallback(() => {
    if (limits.dailyMessages !== 'unlimited') {
      incrementDailyCount();
    }
  }, [limits]);

  const dailyRemaining = useMemo((): number | 'unlimited' => {
    if (limits.dailyMessages === 'unlimited') return 'unlimited';
    return Math.max(0, (limits.dailyMessages as number) - dailyUsed);
  }, [limits, dailyUsed]);

  return {
    tier,
    limits,
    checkMessage,
    recordMessage,
    canUseModel: (salTierId) => canUseModel(tier, salTierId),
    canUseFeature: (f) => canUseFeature(tier, f),
    canAccessNav: (navId) => {
      const req: PlanTier | undefined = NAV_TIER_REQUIREMENTS[navId];
      if (!req) return true;
      return tierAtLeast(tier, req);
    },
    isAtLeast: (required) => tierAtLeast(tier, required),
    dailyRemaining,
  };
}
