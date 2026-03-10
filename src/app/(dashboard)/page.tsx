'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import {
  Search,
  Code2,
  Share2,
  Trophy,
  Newspaper,
  Cpu,
  TrendingUp,
  Building2,
  HeartPulse,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { useAppStore } from '@/stores/app-store';

/* ─── Pillar cards ─────────────────────────────────────────── */

const PILLARS: {
  label: string;
  desc: string;
  href: string;
  icon: LucideIcon;
  color: string;
}[] = [
  {
    label: 'Builder',
    desc: 'Generate full-stack apps from prompts',
    href: '/builder',
    icon: Code2,
    color: '#F59E0B',
  },
  {
    label: 'Social Studio',
    desc: 'Create content for every platform',
    href: '/social-studio',
    icon: Share2,
    color: '#818CF8',
  },
  {
    label: 'Search',
    desc: 'Patent-backed AI research engine',
    href: '/chat/search',
    icon: Search,
    color: '#F59E0B',
  },
];

/* ─── Vertical quick-actions ───────────────────────────────── */

const QUICK: {
  label: string;
  href: string;
  icon: LucideIcon;
  color: string;
}[] = [
  { label: 'Sports', href: '/chat/sports', icon: Trophy, color: '#22C55E' },
  { label: 'News', href: '/chat/news', icon: Newspaper, color: '#EF4444' },
  { label: 'Tech', href: '/chat/tech', icon: Cpu, color: '#818CF8' },
  { label: 'Finance', href: '/chat/finance', icon: TrendingUp, color: '#22C55E' },
  { label: 'Real Estate', href: '/chat/realestate', icon: Building2, color: '#EC4899' },
  { label: 'Medical', href: '/chat/medical', icon: HeartPulse, color: '#818CF8' },
];

/* ─── Dashboard Home ───────────────────────────────────────── */

export default function DashboardHome() {
  const { setActivePage } = useAppStore();

  useEffect(() => {
    setActivePage('dashboard');
  }, [setActivePage]);

  return (
    <div className="flex flex-col items-center px-4 pb-36 pt-10">
      <div className="w-full max-w-2xl">
        {/* Hero */}
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-bold">
            Welcome to{' '}
            <span className="text-sal-gold">SaintSal Labs</span>
          </h1>
          <p className="mt-1.5 text-sm text-sal-text-muted">
            Responsible Intelligence
          </p>
        </div>

        {/* Pillar cards */}
        <div className="mb-8 grid grid-cols-3 gap-3">
          {PILLARS.map((p) => (
            <Link
              key={p.label}
              href={p.href}
              className="card-hover group flex flex-col items-center gap-2 rounded-xl border border-sal-border bg-sal-surface p-4 text-center transition-all hover:border-sal-border2"
            >
              <div
                className="flex h-10 w-10 items-center justify-center rounded-lg"
                style={{ backgroundColor: `${p.color}15` }}
              >
                <p.icon size={20} style={{ color: p.color }} />
              </div>
              <span className="text-sm font-medium text-sal-text">
                {p.label}
              </span>
              <span className="text-2xs text-sal-text-muted">{p.desc}</span>
            </Link>
          ))}
        </div>

        {/* Verticals grid */}
        <h3 className="mb-3 text-xs font-medium uppercase tracking-wider text-sal-text-muted">
          Intelligence Verticals
        </h3>
        <div className="grid grid-cols-3 gap-2 sm:grid-cols-6">
          {QUICK.map((q) => (
            <Link
              key={q.label}
              href={q.href}
              className="card-hover flex flex-col items-center gap-1.5 rounded-lg border border-sal-border bg-sal-surface p-3 transition-all hover:border-sal-border2"
            >
              <q.icon size={18} style={{ color: q.color }} />
              <span className="text-2xs font-medium text-sal-text-muted">
                {q.label}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
