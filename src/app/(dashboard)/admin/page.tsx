'use client';

import { useEffect } from 'react';
import {
  Users,
  CreditCard,
  DollarSign,
  Zap,
  TrendingUp,
  TrendingDown,
  CheckCircle,
  XCircle,
  MoreHorizontal,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { useAppStore } from '@/stores/app-store';
import { cn } from '@/lib/utils/cn';

/* ─── Stat cards data ──────────────────────────────────────── */

interface StatCard {
  icon: LucideIcon;
  label: string;
  value: string;
  trend: string;
  up: boolean;
}

const STATS: StatCard[] = [
  { icon: Users, label: 'Total Users', value: '12,847', trend: '+14.2%', up: true },
  { icon: CreditCard, label: 'Active Subscriptions', value: '3,291', trend: '+8.7%', up: true },
  { icon: DollarSign, label: 'Revenue (MTD)', value: '$148,320', trend: '+22.1%', up: true },
  { icon: Zap, label: 'API Calls (today)', value: '2.4M', trend: '-3.1%', up: false },
];

/* ─── User data ────────────────────────────────────────────── */

interface AdminUser {
  email: string;
  plan: string;
  credits: number;
  joined: string;
  status: 'active' | 'suspended' | 'trial';
}

const USERS: AdminUser[] = [
  { email: 'james@saintsallabs.com', plan: 'Enterprise', credits: 999999, joined: '2024-01-15', status: 'active' },
  { email: 'sarah@techcorp.io', plan: 'Pro', credits: 48200, joined: '2024-06-22', status: 'active' },
  { email: 'mike@startup.dev', plan: 'Starter', credits: 12450, joined: '2025-01-08', status: 'active' },
  { email: 'elena@design.co', plan: 'Pro', credits: 0, joined: '2025-02-14', status: 'suspended' },
  { email: 'alex@newuser.com', plan: 'Free', credits: 1000, joined: '2026-03-01', status: 'trial' },
];

/* ─── System services ──────────────────────────────────────── */

interface SystemService {
  name: string;
  healthy: boolean;
  latency: string;
}

const SERVICES: SystemService[] = [
  { name: 'SAL API', healthy: true, latency: '42ms' },
  { name: 'Supabase', healthy: true, latency: '18ms' },
  { name: 'Stripe', healthy: true, latency: '89ms' },
  { name: 'ElevenLabs', healthy: true, latency: '124ms' },
  { name: 'Anthropic', healthy: true, latency: '210ms' },
  { name: 'GoDaddy API', healthy: false, latency: 'timeout' },
];

/* ─── Simple CSS bar chart ─────────────────────────────────── */

function BarChart({ data, label }: { data: number[]; label: string }) {
  const max = Math.max(...data);
  return (
    <div className="rounded-lg border border-sal-border bg-sal-surface p-4">
      <span className="text-xs font-medium text-sal-text-muted">{label}</span>
      <div className="mt-3 flex items-end gap-[3px]" style={{ height: 80 }}>
        {data.map((val, i) => (
          <div
            key={i}
            className="flex-1 rounded-t bg-sal-gold/70 transition-all hover:bg-sal-gold"
            style={{ height: `${(val / max) * 100}%` }}
            title={`${val.toLocaleString()}`}
          />
        ))}
      </div>
      <div className="mt-1.5 flex justify-between text-[9px] text-sal-text-dim">
        <span>Mon</span>
        <span>Tue</span>
        <span>Wed</span>
        <span>Thu</span>
        <span>Fri</span>
        <span>Sat</span>
        <span>Sun</span>
      </div>
    </div>
  );
}

/* ─── Page ─────────────────────────────────────────────────── */

export default function AdminPage() {
  const setActivePage = useAppStore((s) => s.setActivePage);

  useEffect(() => {
    setActivePage('admin');
  }, [setActivePage]);

  return (
    <div className="px-6 pb-32 pt-6">
      <h1 className="text-2xl font-bold text-sal-text">Admin Dashboard</h1>

      {/* Stat cards */}
      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {STATS.map((stat) => {
          const Icon = stat.icon;
          const TrendIcon = stat.up ? TrendingUp : TrendingDown;
          return (
            <div
              key={stat.label}
              className="rounded-lg border border-sal-border bg-sal-surface p-5"
            >
              <div className="flex items-center justify-between">
                <Icon size={16} className="text-sal-text-muted" />
                <div
                  className={cn(
                    'flex items-center gap-0.5 text-[10px] font-medium',
                    stat.up ? 'text-sal-green' : 'text-sal-red',
                  )}
                >
                  <TrendIcon size={10} />
                  {stat.trend}
                </div>
              </div>
              <div className="mt-2 text-xl font-bold text-sal-text">{stat.value}</div>
              <div className="mt-0.5 text-xs text-sal-text-muted">{stat.label}</div>
            </div>
          );
        })}
      </div>

      {/* Charts */}
      <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
        <BarChart
          label="Revenue (last 7 days)"
          data={[18400, 22100, 19800, 24300, 21700, 16200, 25800]}
        />
        <BarChart
          label="New Users (last 7 days)"
          data={[142, 189, 156, 210, 178, 98, 234]}
        />
      </div>

      {/* User management table */}
      <div className="mt-6">
        <h2 className="mb-3 text-sm font-semibold text-sal-text">User Management</h2>
        <div className="overflow-hidden rounded-lg border border-sal-border">
          <div className="grid grid-cols-[1fr_80px_90px_90px_70px_40px] gap-2 border-b border-sal-border bg-sal-surface2 px-4 py-2 text-[10px] font-medium uppercase tracking-wider text-sal-text-muted">
            <span>Email</span>
            <span>Plan</span>
            <span>Credits</span>
            <span>Joined</span>
            <span>Status</span>
            <span />
          </div>
          {USERS.map((u) => (
            <div
              key={u.email}
              className="grid grid-cols-[1fr_80px_90px_90px_70px_40px] items-center gap-2 border-b border-sal-border px-4 py-2.5 last:border-b-0 hover:bg-[#1C1C26]"
            >
              <span className="truncate text-xs text-sal-text">{u.email}</span>
              <span
                className={cn(
                  'rounded-full px-2 py-0.5 text-center text-[10px] font-medium',
                  u.plan === 'Enterprise' && 'bg-sal-gold/15 text-sal-gold',
                  u.plan === 'Pro' && 'bg-sal-purple/15 text-sal-purple',
                  u.plan === 'Starter' && 'bg-sal-green/15 text-sal-green',
                  u.plan === 'Free' && 'bg-sal-border text-sal-text-muted',
                )}
              >
                {u.plan}
              </span>
              <span className="text-xs tabular-nums text-sal-text-muted">
                {u.credits.toLocaleString()}
              </span>
              <span className="text-xs text-sal-text-muted">{u.joined}</span>
              <span>
                {u.status === 'active' && (
                  <span className="flex items-center gap-1 text-[10px] text-sal-green">
                    <CheckCircle size={10} /> Active
                  </span>
                )}
                {u.status === 'suspended' && (
                  <span className="flex items-center gap-1 text-[10px] text-sal-red">
                    <XCircle size={10} /> Suspended
                  </span>
                )}
                {u.status === 'trial' && (
                  <span className="text-[10px] text-sal-gold">Trial</span>
                )}
              </span>
              <button className="rounded p-1 text-sal-text-muted hover:text-sal-text">
                <MoreHorizontal size={14} />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* System status */}
      <div className="mt-6">
        <h2 className="mb-3 text-sm font-semibold text-sal-text">System Status</h2>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {SERVICES.map((svc) => (
            <div
              key={svc.name}
              className="rounded-lg border border-sal-border bg-sal-surface p-3"
            >
              <div className="flex items-center gap-1.5">
                <span
                  className={cn(
                    'h-2 w-2 rounded-full',
                    svc.healthy ? 'bg-sal-green' : 'bg-sal-red',
                  )}
                />
                <span className="text-xs font-medium text-sal-text">{svc.name}</span>
              </div>
              <div
                className={cn(
                  'mt-1 text-[10px]',
                  svc.healthy ? 'text-sal-text-muted' : 'text-sal-red',
                )}
              >
                {svc.latency}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
