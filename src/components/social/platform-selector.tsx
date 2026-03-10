'use client';

import { Check } from 'lucide-react';
import { cn } from '@/lib/utils/cn';

/* ─── Platform definitions ─────────────────────────────────── */

export interface Platform {
  id: string;
  label: string;
  color: string;
  charLimit: number;
  letter: string;
}

export const PLATFORMS: Platform[] = [
  { id: 'twitter', label: 'Twitter / X', color: '#1DA1F2', charLimit: 280, letter: 'X' },
  { id: 'linkedin', label: 'LinkedIn', color: '#0A66C2', charLimit: 3000, letter: 'in' },
  { id: 'instagram', label: 'Instagram', color: '#E4405F', charLimit: 2200, letter: 'Ig' },
  { id: 'facebook', label: 'Facebook', color: '#1877F2', charLimit: 63206, letter: 'f' },
  { id: 'tiktok', label: 'TikTok', color: '#000000', charLimit: 2200, letter: 'Tk' },
  { id: 'youtube', label: 'YouTube', color: '#FF0000', charLimit: 5000, letter: 'Yt' },
  { id: 'reddit', label: 'Reddit', color: '#FF4500', charLimit: 40000, letter: 'R' },
  { id: 'threads', label: 'Threads', color: '#000000', charLimit: 500, letter: '@' },
];

/* ─── Props ────────────────────────────────────────────────── */

interface PlatformSelectorProps {
  selected: string[];
  onChange: (ids: string[]) => void;
}

/* ─── Component ────────────────────────────────────────────── */

export default function PlatformSelector({
  selected,
  onChange,
}: PlatformSelectorProps) {
  const allSelected = selected.length === PLATFORMS.length;

  function toggle(id: string) {
    onChange(
      selected.includes(id)
        ? selected.filter((s) => s !== id)
        : [...selected, id],
    );
  }

  function selectAll() {
    onChange(allSelected ? [] : PLATFORMS.map((p) => p.id));
  }

  return (
    <div>
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-sal-text-muted">
          Platforms
        </h3>
        <button
          onClick={selectAll}
          className="rounded-md px-2 py-0.5 text-[10px] font-medium text-sal-gold transition-colors hover:bg-sal-gold/10"
        >
          {allSelected ? 'Deselect All' : 'Select All'}
        </button>
      </div>

      <div className="grid grid-cols-2 gap-2">
        {PLATFORMS.map((p) => {
          const isSelected = selected.includes(p.id);
          const isDark = p.id === 'tiktok' || p.id === 'threads';

          return (
            <button
              key={p.id}
              onClick={() => toggle(p.id)}
              className={cn(
                'nav-btn relative flex items-center gap-2.5 rounded-lg border px-3 py-2.5 transition-all',
                isSelected
                  ? 'border-sal-gold bg-sal-gold/5'
                  : 'border-sal-border bg-sal-surface hover:border-sal-border2',
              )}
            >
              {/* Platform icon */}
              <div
                className={cn(
                  'flex h-8 w-8 shrink-0 items-center justify-center rounded-md text-xs font-bold',
                  isDark ? 'border border-sal-border2' : '',
                )}
                style={{
                  backgroundColor: isDark ? '#111116' : p.color,
                  color: isDark ? '#E8E6E1' : '#fff',
                }}
              >
                {p.letter}
              </div>

              <div className="flex flex-col items-start text-left">
                <span className="text-xs font-medium text-sal-text">
                  {p.label}
                </span>
                <span className="text-[10px] text-sal-text-muted">
                  {p.charLimit.toLocaleString()} chars
                </span>
              </div>

              {/* Checkmark overlay */}
              {isSelected && (
                <div className="absolute right-2 top-2 flex h-4 w-4 items-center justify-center rounded-full bg-sal-gold">
                  <Check size={10} className="text-black" strokeWidth={3} />
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
