'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import {
  Trophy, TrendingUp, Building2, Newspaper, Cpu,
  HeartPulse, ChefHat, Globe,
} from 'lucide-react';
import { useAppStore } from '@/stores/app-store';
import { useAuth } from '@/hooks/use-auth';

const VERTICALS = [
  { label: 'Sports',      href: '/chat/sports',     icon: Trophy,    color: '#22C55E' },
  { label: 'News',        href: '/chat/news',        icon: Newspaper, color: '#EF4444' },
  { label: 'Tech',        href: '/chat/tech',        icon: Cpu,       color: '#818CF8' },
  { label: 'Finance',     href: '/chat/finance',     icon: TrendingUp,color: '#F59E0B' },
  { label: 'Real Estate', href: '/chat/realestate',  icon: Building2, color: '#EC4899' },
  { label: 'Medical',     href: '/chat/medical',     icon: HeartPulse,color: '#06B6D4' },
  { label: 'CookinCards', href: '/cookin-cards',     icon: ChefHat,   color: '#FB923C' },
  { label: 'Search',      href: '/chat/search',      icon: Globe,     color: '#D4AF37' },
];

function greeting(name?: string) {
  const h = new Date().getHours();
  const time = h < 12 ? 'Morning' : h < 17 ? 'Afternoon' : 'Evening';
  return `Good ${time}${name ? ', ' + name.split(' ')[0] : ''}`;
}

export default function DashboardHome() {
  const { setActivePage } = useAppStore();
  const { user } = useAuth();

  useEffect(() => { setActivePage('dashboard'); }, [setActivePage]);

  return (
    <div className="flex h-full flex-col items-center justify-center px-4 pb-32 pt-8">
      <div className="w-full max-w-2xl">

        {/* Wordmark */}
        <div className="mb-2 text-center">
          <div className="text-[11px] font-bold tracking-[4px] uppercase text-sal-gold">
            SaintSal™ Labs
          </div>
        </div>

        {/* Greeting */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-black text-sal-text tracking-tight">
            {greeting(user?.name)}
          </h1>
          <p className="mt-1 text-sm text-sal-text-muted">
            Ask anything below — SAL routes it to the right intelligence.
          </p>
        </div>

        {/* Vertical chips — horizontal scroll */}
        <div className="mb-8">
          <p className="mb-3 text-center text-[10px] font-semibold uppercase tracking-widest text-sal-text-muted/50">
            Intelligence Verticals
          </p>
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide justify-center flex-wrap">
            {VERTICALS.map((v) => {
              const Icon = v.icon;
              return (
                <Link
                  key={v.label}
                  href={v.href}
                  className="flex shrink-0 items-center gap-1.5 rounded-full border border-sal-border bg-sal-surface px-3 py-1.5 text-xs font-medium text-sal-text-muted transition-all hover:text-sal-text"
                  style={{ '--chip-color': v.color } as React.CSSProperties}
                  onMouseEnter={(e) => {
                    const el = e.currentTarget as HTMLElement;
                    el.style.borderColor = v.color + '50';
                    el.style.color = v.color;
                    el.style.background = v.color + '12';
                  }}
                  onMouseLeave={(e) => {
                    const el = e.currentTarget as HTMLElement;
                    el.style.borderColor = '';
                    el.style.color = '';
                    el.style.background = '';
                  }}
                >
                  <Icon size={12} style={{ color: v.color }} />
                  {v.label}
                </Link>
              );
            })}
          </div>
        </div>

        {/* Platform status */}
        <div className="rounded-xl border border-sal-border bg-sal-surface/50 px-4 py-3">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-green-500 shadow-[0_0_6px_#22C55E]" />
              <span className="text-xs text-sal-text-muted">All systems operational</span>
            </div>
            <div className="flex items-center gap-4">
              {['Claude', 'Gemini', 'Grok', 'Perplexity'].map((m) => (
                <div key={m} className="flex items-center gap-1.5">
                  <div className="h-1.5 w-1.5 rounded-full bg-green-500" />
                  <span className="text-[10px] font-semibold text-sal-text-muted/70">{m}</span>
                </div>
              ))}
            </div>
            <Link
              href="/pricing"
              className="rounded-md border border-sal-gold/20 px-3 py-1 text-[11px] font-bold tracking-wide text-sal-gold hover:bg-sal-gold/10"
            >
              UPGRADE →
            </Link>
          </div>
        </div>

        {/* Patent / branding strip */}
        <div className="mt-6 flex items-center justify-center gap-4">
          <span className="text-[9px] font-semibold uppercase tracking-widest text-sal-text-muted/30">HACP™</span>
          <span className="text-sal-text-muted/20">·</span>
          <span className="text-[9px] font-semibold uppercase tracking-widest text-sal-text-muted/30">US Patent #10,290,222</span>
          <span className="text-sal-text-muted/20">·</span>
          <span className="text-[9px] font-semibold uppercase tracking-widest text-sal-text-muted/30">Responsible Intelligence™</span>
        </div>

      </div>
    </div>
  );
}
