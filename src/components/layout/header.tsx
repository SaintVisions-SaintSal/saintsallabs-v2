'use client';

import { useMemo } from 'react';
import { Menu } from 'lucide-react';
import { NAV } from '@/config/navigation';
import { useAppStore } from '@/stores/app-store';

/* ─── Header Component ─────────────────────────────────────── */

export default function Header() {
  const { activePage, toggleSidebar, user } = useAppStore();

  const pageLabel = useMemo(() => {
    for (const section of NAV) {
      const found = section.items.find((i) => i.id === activePage);
      if (found) return found.label;
    }
    return 'Search';
  }, [activePage]);

  const creditsRemaining = user?.credits_remaining ?? 999993;
  const creditsTotal = 999999;
  const creditsPct = (creditsRemaining / creditsTotal) * 100;

  return (
    <header className="flex h-[42px] shrink-0 items-center border-b border-sal-border bg-sal-surface2 px-3">
      {/* Mobile hamburger */}
      <button
        onClick={toggleSidebar}
        className="mr-2 rounded p-1 text-sal-text-muted hover:text-sal-text md:hidden"
      >
        <Menu size={16} />
      </button>

      {/* Page label */}
      <span className="text-xs font-medium text-sal-text">{pageLabel}</span>

      <div className="flex-1" />

      {/* Credits pill */}
      <div className="flex items-center gap-2">
        <div className="flex flex-col items-end">
          <span className="text-[10px] tabular-nums text-sal-text-muted">
            {creditsRemaining.toLocaleString()} /{' '}
            {creditsTotal.toLocaleString()} credits
          </span>
          <div className="mt-0.5 h-[2px] w-24 overflow-hidden rounded-full bg-sal-border">
            <div
              className="h-full rounded-full bg-sal-gold transition-all duration-500"
              style={{ width: `${creditsPct}%` }}
            />
          </div>
        </div>

        {/* Avatar */}
        <div className="flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-br from-sal-gold to-sal-gold-dim text-[10px] font-bold text-black">
          {user?.name?.charAt(0).toUpperCase() ?? '?'}
        </div>
      </div>
    </header>
  );
}
