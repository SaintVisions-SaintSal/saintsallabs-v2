'use client';

import { useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { TrendingUp, Building2, ChefHat, CreditCard } from 'lucide-react';
import { useAppStore } from '@/stores/app-store';
import { useAuth } from '@/hooks/use-auth';

const PORTFOLIO_MODULES = [
  { id: 'stocks',    label: 'Stocks & ETFs',    icon: TrendingUp, color: '#22C55E', href: '/finance',      desc: 'Alpaca portfolio · live prices' },
  { id: 'realestate',label: 'Real Estate',      icon: Building2,  color: '#EC4899', href: '/realestate',   desc: 'Property watchlist · RentCast data' },
  { id: 'cards',     label: 'Card Collection',  icon: ChefHat,    color: '#FB923C', href: '/cookin-cards', desc: 'TCG · Sports · PSA graded' },
  { id: 'crypto',    label: 'Crypto',           icon: CreditCard, color: '#818CF8', href: '/finance',      desc: 'Watchlist · DeFi · NFTs' },
];

export default function MySalPage() {
  const { setActivePage } = useAppStore();
  const { user } = useAuth();

  useEffect(() => { setActivePage('my-sal'); }, [setActivePage]);

  return (
    <div className="flex flex-col px-4 pb-40 pt-6">
      <div className="mx-auto w-full max-w-2xl">

        {/* Header */}
        <div className="mb-6 flex items-center gap-3">
          <div className="h-12 w-12 overflow-hidden rounded-2xl ring-2 ring-sal-gold shadow-[0_0_16px_rgba(212,175,55,0.3)]">
            <Image src="/sal-logo-main.png" alt="My SAL" width={48} height={48} className="h-full w-full object-cover" />
          </div>
          <div>
            <h1 className="text-lg font-black text-sal-text">My SAL</h1>
            <p className="text-xs text-sal-text-muted">
              {user?.name ? `${user.name}'s personal portfolio` : 'Your personal intelligence hub'}
            </p>
          </div>
          <div className="ml-auto rounded-full border border-sal-gold/30 bg-sal-gold/10 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-sal-gold">
            {user?.plan_tier ?? 'Free'}
          </div>
        </div>

        {/* Portfolio modules */}
        <div className="mb-6 grid grid-cols-2 gap-3">
          {PORTFOLIO_MODULES.map((mod) => {
            const Icon = mod.icon;
            return (
              <Link
                key={mod.id}
                href={mod.href}
                className="flex flex-col gap-2 rounded-2xl border border-sal-border bg-sal-surface p-4 transition-all hover:border-opacity-50"
                style={{ '--mod-color': mod.color } as React.CSSProperties}
                onMouseEnter={(e) => {
                  const el = e.currentTarget as HTMLElement;
                  el.style.borderColor = mod.color + '50';
                  el.style.background = mod.color + '0a';
                }}
                onMouseLeave={(e) => {
                  const el = e.currentTarget as HTMLElement;
                  el.style.borderColor = '';
                  el.style.background = '';
                }}
              >
                <div className="flex h-9 w-9 items-center justify-center rounded-xl" style={{ background: mod.color + '18' }}>
                  <Icon size={18} style={{ color: mod.color }} />
                </div>
                <div>
                  <div className="text-sm font-bold text-sal-text">{mod.label}</div>
                  <div className="text-[11px] text-sal-text-muted">{mod.desc}</div>
                </div>
              </Link>
            );
          })}
        </div>

        {/* Coming soon banner */}
        <div className="rounded-2xl border border-sal-gold/20 bg-sal-gold/5 p-4 text-center">
          <div className="mb-1 text-sm font-bold text-sal-text">Full Portfolio Dashboard</div>
          <p className="text-xs text-sal-text-muted">
            Unified view of all your assets, alerts, and AI insights — coming soon.
          </p>
          <Link href="/pricing" className="mt-3 inline-block rounded-lg bg-sal-gold px-4 py-1.5 text-xs font-bold text-black hover:bg-sal-gold-hover">
            Unlock with Pro →
          </Link>
        </div>

      </div>
    </div>
  );
}
