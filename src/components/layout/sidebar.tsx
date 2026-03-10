'use client';

import { useCallback } from 'react';
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
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { NAV } from '@/config/navigation';
import { useAppStore } from '@/stores/app-store';
import { cn } from '@/lib/utils/cn';

/* ─── Icon lookup ──────────────────────────────────────────── */

const ICONS: Record<string, LucideIcon> = {
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
};

/* ─── Sidebar Component ────────────────────────────────────── */

export default function Sidebar() {
  const pathname = usePathname();
  const { activePage, setActivePage, sidebarOpen, toggleSidebar, user } =
    useAppStore();

  const handleNav = useCallback(
    (id: string) => {
      setActivePage(id);
      // close sidebar on mobile
      if (window.innerWidth < 768) toggleSidebar();
    },
    [setActivePage, toggleSidebar],
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
        <div className="flex items-center gap-2 px-3 pb-2 pt-4">
          <div className="flex h-7 w-7 items-center justify-center rounded-md bg-gradient-to-br from-sal-gold to-sal-gold-dim">
            <span className="text-sm font-bold text-black">S</span>
          </div>
          <div className="flex flex-col leading-none">
            <div className="flex items-baseline gap-1">
              <span className="text-sm font-semibold text-sal-gold">
                SaintSal
              </span>
              <span className="text-2xs font-semibold uppercase tracking-wider text-sal-green">
                LABS
              </span>
            </div>
            <span className="text-[8px] tracking-wide text-sal-text-muted">
              Responsible Intelligence
            </span>
          </div>
          {/* Mobile close */}
          <button
            onClick={toggleSidebar}
            className="ml-auto rounded p-0.5 text-sal-text-muted hover:text-sal-text md:hidden"
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
                const isActive =
                  activePage === item.id ||
                  pathname === item.href;

                return (
                  <Link
                    key={item.id}
                    href={item.href}
                    onClick={() => handleNav(item.id)}
                    className={cn(
                      'nav-btn group flex w-full items-center gap-2 rounded-md px-2 py-[5px] text-xs',
                      isActive
                        ? 'bg-[#1C1C26] font-medium text-sal-gold'
                        : 'text-sal-text-muted hover:bg-[#161620] hover:text-sal-text',
                    )}
                  >
                    {Icon && (
                      <Icon
                        size={14}
                        className={cn(
                          isActive
                            ? 'text-sal-gold'
                            : 'text-sal-text-muted group-hover:text-sal-text',
                        )}
                      />
                    )}
                    <span className="truncate">{item.label}</span>
                    {item.pro && (
                      <span className="ml-auto rounded bg-sal-gold/15 px-1 py-px text-[8px] font-bold uppercase text-sal-gold">
                        PRO
                      </span>
                    )}
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
