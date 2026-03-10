/* ─── Core Types ─────────────────────────────────────────────── */

export type Vertical =
  | 'search'
  | 'sports'
  | 'news'
  | 'tech'
  | 'finance'
  | 'realestate'
  | 'medical';

export type PlanTier = 'free' | 'starter' | 'pro' | 'teams' | 'enterprise';

export interface Message {
  role: 'user' | 'assistant';
  content: string;
  streaming?: boolean;
}

export interface UserProfile {
  id: string;
  email: string;
  name?: string;
  avatar_url?: string;
  plan_tier: PlanTier;
  credits_remaining: number;
  stripe_customer_id?: string;
}

export interface BuilderFile {
  name: string;
  lang: string;
  content: string;
}

export interface SocialPlatform {
  id: string;
  label: string;
  color: string;
  hint: string;
}

export interface ConversationMeta {
  id: string;
  title: string;
  vertical: string;
  updated_at: string;
}
