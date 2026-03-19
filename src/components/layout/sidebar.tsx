'use client';

import { useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Plus,
  LayoutDashboard,
  Search,
  Trophy,
  Newspaper,
  Cpu,
  TrendingUp,
  Building2,
  HeartPulse,
  Code2,
  Share2,
  Globe,
  Briefcase,
  GraduationCap,
  Mic,
  FileText,
  Plug,
  CreditCard,
  User,
  X,
  Lock,
  ChefHat,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { NAV } from '@/config/navigation';
import { useAppStore } from '@/stores/app-store';
import { usePlanGate } from '@/hooks/use-plan-gate';
import { cn } from '@/lib/utils/cn';

/* ─── Icon lookup ──────────────────────────────────────────── */

const ICONS: Record<string, LucideIcon> = {
  Lock,
  LayoutDashboard,
  Search,
  Trophy,
  Newspaper,
  Cpu,
  TrendingUp,
  Building2,
  HeartPulse,
  Code2,
  Share2,
  Globe,
  Briefcase,
  GraduationCap,
  Mic,
  FileText,
  Plug,
  CreditCard,
  User,
  ChefHat,
};

/* ─── Sidebar Component ────────────────────────────────────── */

export default function Sidebar() {
  const pathname = usePathname();
  const { activePage, setActivePage, sidebarOpen, toggleSidebar, user } =
    useAppStore();
  const gate = usePlanGate();

  const closeSidebarMobile = useCallback(() => {
    if (window.innerWidth < 768 && sidebarOpen) toggleSidebar();
  }, [sidebarOpen, toggleSidebar]);

  const handleNav = useCallback(
    (id: string) => {
      setActivePage(id);
      closeSidebarMobile();
    },
    [setActivePage, closeSidebarMobile],
  );

  return (
    <>
      {/* Mobile backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 md:hidden"
          onClick={toggleSidebar}
        />
      )}

      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-50 flex w-[184px] flex-col border-r border-sal-border bg-sal-surface2',
          'transition-transform duration-200 ease-out',
          'md:relative md:translate-x-0',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full',
        )}
      >
        {/* ── Logo ─────────────────────────────────────────── */}
        <div className="relative flex items-center justify-center px-3 pb-2 pt-4">
          <Image
            src="/logo-wide.jpg"
            alt="SaintSal Labs"
            width={180}
            height={60}
            className="object-contain"
            priority
          />
          {/* Mobile close */}
          <button
            onClick={toggleSidebar}
            className="absolute right-2 top-3 rounded p-0.5 text-sal-text-muted hover:text-sal-text md:hidden"
          >
            <X size={14} />
          </button>
        </div>

        {/* ── New Chat ─────────────────────────────────────── */}
        <div className="px-2.5 pb-1 pt-2">
          <button className="nav-btn flex w-full items-center gap-1.5 rounded-md bg-sal-gold px-2.5 py-1.5 text-xs font-semibold text-black hover:bg-sal-gold-hover">
            <Plus size={13} strokeWidth={2.5} />
            New Chat
          </button>
        </div>

        {/* ── Navigation ───────────────────────────────────── */}
        <nav className="flex-1 overflow-y-auto px-1.5 pt-2">
          {NAV.map((section) => (
            <div key={section.title} className="mb-1">
              <div className="px-2 pb-0.5 pt-2 text-[8px] font-medium uppercase tracking-wider text-[#222230]">
                {section.title}
              </div>
              {section.items.map((item) => {
                const Icon = ICONS[item.icon];
                const isActive = activePage === item.id || pathname === item.href;
                const locked = !gate.canAccessNav(item.id);
                const href = locked ? '/pricing' : item.href;

                return (
                  <Link
                    key={item.id}
                    href={href}
                    onClick={() => {
                      closeSidebarMobile();
                      if (!locked) setActivePage(item.id);
                    }}
                    title={locked ? `Requires upgrade — click to see plans` : undefined}
                    className={cn(
                      'nav-btn group flex w-full items-center gap-2 rounded-md px-2 py-[5px] text-xs',
                      locked
                        ? 'cursor-pointer text-sal-text-muted/50 hover:bg-[#161620] hover:text-sal-text-muted'
                        : isActive
                          ? 'bg-[#1C1C26] font-medium text-sal-gold'
                          : 'text-sal-text-muted hover:bg-[#161620] hover:text-sal-text',
                    )}
                  >
                    {Icon && (
                      <Icon
                        size={14}
                        className={cn(
                          locked
                            ? 'opacity-40'
                            : isActive
                              ? 'text-sal-gold'
                              : 'text-sal-text-muted group-hover:text-sal-text',
                        )}
                      />
                    )}
                    <span className={cn('truncate', locked && 'opacity-40')}>{item.label}</span>
                    {locked ? (
                      <Lock size={9} className="ml-auto opacity-30" />
                    ) : item.pro ? (
                      <span className="ml-auto rounded bg-sal-gold/15 px-1 py-px text-[8px] font-bold uppercase text-sal-gold">
                        PRO
                      </span>
                    ) : null}
                  </Link>
                );
              })}
            </div>
          ))}
        </nav>

        {/* ── Bottom: Sign In / User ───────────────────────── */}
        <div className="border-t border-sal-border px-2.5 py-2.5">
          {user ? (
            <div className="flex items-center gap-2">
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-br from-sal-gold to-sal-gold-dim text-[10px] font-bold text-black">
                {user.name?.charAt(0).toUpperCase() ?? 'U'}
              </div>
              <div className="flex flex-col leading-none">
                <span className="truncate text-xs text-sal-text">
                  {user.name ?? user.email}
                </span>
                <span className="text-[8px] uppercase text-sal-text-muted">
                  {user.plan_tier}
                </span>
              </div>
            </div>
          ) : (
            <Link
              href="/account"
              onClick={() => handleNav('account')}
              className="flex items-center gap-2"
            >
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-br from-sal-gold to-sal-gold-dim text-[10px] font-bold text-black">
                ?
              </div>
              <div className="flex flex-col leading-none">
                <span className="text-xs text-sal-text">Sign In</span>
                <span className="text-[8px] font-semibold uppercase tracking-wide text-sal-green">
                  FREE
                </span>
              </div>
            </Link>
          )}
        </div>
      </aside>
    </>
  );
}
