'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import {
  Search, Code2, MoreHorizontal, X, Plus, Lock,
  LayoutDashboard, Trophy, Newspaper, Cpu, TrendingUp,
  Building2, HeartPulse, Share2, Globe, Briefcase,
  GraduationCap, Mic, FileText, Plug, CreditCard, User, ChefHat,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { NAV } from '@/config/navigation';
import { useAppStore } from '@/stores/app-store';
import { usePlanGate } from '@/hooks/use-plan-gate';
import { cn } from '@/lib/utils/cn';

const ICONS: Record<string, LucideIcon> = {
  LayoutDashboard, Search, Trophy, Newspaper, Cpu, TrendingUp, Building2,
  HeartPulse, Code2, Share2, Globe, Briefcase, GraduationCap, Mic, FileText,
  Plug, CreditCard, User, Lock, ChefHat,
};

export default function BottomNav() {
  const pathname  = usePathname();
  const [moreOpen, setMoreOpen] = useState(false);
  const { setActivePage, activePage } = useAppStore();
  const gate = usePlanGate();

  const isSearch  = pathname.startsWith('/chat/search') || pathname.includes('/search');
  const isBuilder = pathname.startsWith('/builder');
  const isSal     = pathname === '/dashboard' || activePage === 'dashboard';

  return (
    <>
      {/* ── Bottom Bar ─────────────────────────────────────────── */}
      <nav
        className="fixed bottom-0 left-0 right-0 z-40 border-t border-sal-border bg-sal-surface2/95 backdrop-blur-xl md:left-[184px]"
        style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
      >
        <div className="flex items-stretch justify-around">

          {/* Search */}
          <Link
            href="/chat/search"
            onClick={() => { setActivePage('search'); setMoreOpen(false); }}
            className={cn(
              'flex flex-1 flex-col items-center gap-1 px-2 py-2.5 transition-colors',
              isSearch ? 'text-sal-gold' : 'text-sal-text-muted hover:text-sal-text',
            )}
          >
            <Search size={20} strokeWidth={isSearch ? 2.5 : 1.8} />
            <span className="text-[10px] font-medium">Search</span>
          </Link>

          {/* Builder */}
          <Link
            href="/builder"
            onClick={() => { setActivePage('builder'); setMoreOpen(false); }}
            className={cn(
              'flex flex-1 flex-col items-center gap-1 px-2 py-2.5 transition-colors',
              isBuilder ? 'text-sal-gold' : 'text-sal-text-muted hover:text-sal-text',
            )}
          >
            <Code2 size={20} strokeWidth={isBuilder ? 2.5 : 1.8} />
            <span className="text-[10px] font-medium">Builder</span>
          </Link>

          {/* More */}
          <button
            onClick={() => setMoreOpen((v) => !v)}
            className={cn(
              'flex flex-1 flex-col items-center gap-1 px-2 py-2.5 transition-colors',
              moreOpen ? 'text-sal-gold' : 'text-sal-text-muted hover:text-sal-text',
            )}
          >
            <MoreHorizontal size={20} strokeWidth={moreOpen ? 2.5 : 1.8} />
            <span className="text-[10px] font-medium">More</span>
          </button>

          {/* Sal™ Favorite */}
          <Link
            href="/dashboard"
            onClick={() => { setActivePage('dashboard'); setMoreOpen(false); }}
            className="flex flex-1 flex-col items-center gap-0.5 px-2 py-2 transition-opacity hover:opacity-80"
          >
            <div
              className={cn(
                'h-8 w-8 overflow-hidden rounded-xl transition-all',
                isSal
                  ? 'ring-2 ring-sal-gold shadow-[0_0_10px_rgba(212,175,55,0.4)]'
                  : 'ring-1 ring-sal-border/40',
              )}
            >
              <Image
                src="/images/sal-logo-main.png"
                alt="SaintSal™"
                width={32}
                height={32}
                className="h-full w-full object-cover"
              />
            </div>
            <span className={cn('text-[10px] font-semibold', isSal ? 'text-sal-gold' : 'text-sal-text-muted')}>
              Sal™
            </span>
          </Link>

        </div>
      </nav>

      {/* ── Backdrop ───────────────────────────────────────────── */}
      {moreOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm"
          onClick={() => setMoreOpen(false)}
        />
      )}

      {/* ── More Sheet ─────────────────────────────────────────── */}
      <div
        className={cn(
          'fixed bottom-0 left-0 right-0 z-50 rounded-t-2xl border-t border-sal-border bg-[#0E0E16]',
          'transition-transform duration-300 ease-out md:left-[184px]',
          moreOpen ? 'translate-y-0' : 'translate-y-full',
        )}
        style={{ paddingBottom: 'env(safe-area-inset-bottom, 8px)' }}
      >
        {/* Drag handle */}
        <div className="flex justify-center pt-2.5 pb-0.5">
          <div className="h-1 w-10 rounded-full bg-sal-border" />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between px-4 pt-2 pb-1">
          <div className="flex items-center gap-2">
            <Image src="/images/sal-logo-main.png" alt="SaintSal™" width={22} height={22} className="rounded-lg" />
            <span className="text-sm font-bold text-sal-text">SaintSal™ Labs</span>
          </div>
          <button onClick={() => setMoreOpen(false)} className="rounded-lg p-1.5 text-sal-text-muted hover:text-sal-text">
            <X size={16} />
          </button>
        </div>

        {/* New Chat */}
        <div className="px-4 py-2">
          <Link
            href="/chat/search"
            onClick={() => { setActivePage('search'); setMoreOpen(false); }}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-sal-gold py-2.5 text-sm font-bold text-black hover:bg-sal-gold-hover"
          >
            <Plus size={15} strokeWidth={3} />
            New Chat
          </Link>
        </div>

        {/* Nav grid */}
        <div className="overflow-y-auto px-3 pb-4" style={{ maxHeight: '58vh' }}>
          {NAV.map((section) => (
            <div key={section.title} className="mb-3">
              <div className="px-2 py-1 text-[8px] font-semibold uppercase tracking-widest text-[#333345]">
                {section.title}
              </div>
              <div className="grid grid-cols-4 gap-1">
                {section.items.map((item) => {
                  const Icon = ICONS[item.icon];
                  const locked = !gate.canAccessNav(item.id);
                  const href = locked ? '/pricing' : item.href;
                  const isActive = pathname === item.href;

                  return (
                    <Link
                      key={item.id}
                      href={href}
                      onClick={() => { if (!locked) setActivePage(item.id); setMoreOpen(false); }}
                      className={cn(
                        'relative flex flex-col items-center gap-1 rounded-xl p-2.5 transition-all',
                        locked ? 'opacity-40'
                          : isActive ? 'bg-[#1C1C28] text-sal-gold'
                          : 'text-sal-text-muted hover:bg-[#161622] hover:text-sal-text',
                      )}
                    >
                      {Icon && <Icon size={17} className={isActive ? 'text-sal-gold' : ''} strokeWidth={isActive ? 2.2 : 1.7} />}
                      <span className="text-center text-[9px] leading-tight">{item.label}</span>
                      {item.pro && !locked && (
                        <span className="absolute -right-0.5 -top-0.5 rounded bg-sal-gold/20 px-1 py-px text-[6px] font-bold uppercase text-sal-gold">PRO</span>
                      )}
                      {locked && <Lock size={8} className="absolute right-1 top-1 opacity-25" />}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
