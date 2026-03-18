import type { PlanTier } from '@/types';

export interface ModelSpec {
  name: string;
  provider: string;
  apiModel: string;
  speed: 'fast' | 'medium' | 'slow';
  costPer1MTokens: string;
}

export interface SalTier {
  id: string;
  label: string;
  description: string;
  models: ModelSpec[];
}

export const SAL_TIERS: SalTier[] = [
  {
    id: 'mini',
    label: 'SAL Mini',
    description: 'Fast, lightweight models for everyday tasks',
    models: [
      {
        name: 'Claude Haiku 4.5',
        provider: 'anthropic',
        apiModel: 'claude-haiku-4-5-20251001',
        speed: 'fast',
        costPer1MTokens: '$0.25 / $1.25',
      },
      {
        name: 'GPT-5 Fast',
        provider: 'openai',
        apiModel: 'gpt-5-fast',
        speed: 'fast',
        costPer1MTokens: '$0.50 / $1.50',
      },
      {
        name: 'Gemini 2.0 Flash',
        provider: 'google',
        apiModel: 'gemini-2.0-flash',
        speed: 'fast',
        costPer1MTokens: '$0.10 / $0.40',
      },
      {
        name: 'Grok-3 Mini',
        provider: 'xai',
        apiModel: 'grok-3-mini',
        speed: 'fast',
        costPer1MTokens: '$0.30 / $0.50',
      },
    ],
  },
  {
    id: 'pro',
    label: 'SAL Pro',
    description: 'Balanced power and speed for professional use',
    models: [
      {
        name: 'Claude Sonnet 4.6',
        provider: 'anthropic',
        apiModel: 'claude-sonnet-4-6-20250514',
        speed: 'medium',
        costPer1MTokens: '$3.00 / $15.00',
      },
      {
        name: 'GPT-5 Core',
        provider: 'openai',
        apiModel: 'gpt-5-core',
        speed: 'medium',
        costPer1MTokens: '$5.00 / $15.00',
      },
      {
        name: 'Gemini 2.5 Pro',
        provider: 'google',
        apiModel: 'gemini-2.5-pro',
        speed: 'medium',
        costPer1MTokens: '$1.25 / $10.00',
      },
      {
        name: 'Grok-3 Biz',
        provider: 'xai',
        apiModel: 'grok-3-biz',
        speed: 'medium',
        costPer1MTokens: '$3.00 / $15.00',
      },
    ],
  },
  {
    id: 'max',
    label: 'SAL Max',
    description: 'Maximum intelligence for complex reasoning',
    models: [
      {
        name: 'Claude Opus 4.6',
        provider: 'anthropic',
        apiModel: 'claude-opus-4-6-20250630',
        speed: 'slow',
        costPer1MTokens: '$15.00 / $75.00',
      },
      {
        name: 'GPT-5 Core Extended',
        provider: 'openai',
        apiModel: 'gpt-5-core-extended',
        speed: 'slow',
        costPer1MTokens: '$10.00 / $30.00',
      },
      {
        name: 'Gemini 2.5 Pro Deep',
        provider: 'google',
        apiModel: 'gemini-2.5-pro-deep-think',
        speed: 'slow',
        costPer1MTokens: '$5.00 / $25.00',
      },
    ],
  },
  {
    id: 'max-fast',
    label: 'SAL Max Fast',
    description: 'Parallel processing for high-throughput workloads',
    models: [
      {
        name: 'Claude Sonnet 4.6 Parallel',
        provider: 'anthropic',
        apiModel: 'claude-sonnet-4-6-20250514',
        speed: 'fast',
        costPer1MTokens: '$3.00 / $15.00',
      },
      {
        name: 'GPT-5 Fast Batch',
        provider: 'openai',
        apiModel: 'gpt-5-fast-batch',
        speed: 'fast',
        costPer1MTokens: '$2.50 / $7.50',
      },
      {
        name: 'Grok-3 Biz Parallel',
        provider: 'xai',
        apiModel: 'grok-3-biz-parallel',
        speed: 'fast',
        costPer1MTokens: '$3.00 / $15.00',
      },
    ],
  },
];

// Must match PLAN_LIMITS[tier].salTier in src/config/plans.ts
export const PLAN_MODEL_ACCESS: Record<PlanTier, string> = {
  free:       'mini',    // basic only — 25 msg/day
  starter:    'mini',    // unlimited usage but basic models only
  pro:        'max',     // full model access — give them the world
  teams:      'max-fast',
  enterprise: 'max-fast',
};
