'use client';

import {
  useState,
  useRef,
  useCallback,
  useEffect,
  type KeyboardEvent,
} from 'react';
import {
  Plus,
  Mic,
  Send,
  ChevronUp,
  Zap,
  Cpu,
  Flame,
  Bolt,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { SAL_TIERS } from '@/config/models';
import { useAppStore } from '@/stores/app-store';
import { cn } from '@/lib/utils/cn';

/* ─── Tier icons ───────────────────────────────────────────── */

const TIER_ICONS: Record<string, LucideIcon> = {
  'SAL Mini': Zap,
  'SAL Pro': Cpu,
  'SAL Max': Flame,
  'SAL Max Fast': Bolt,
};

/* ─── Placeholder per page ─────────────────────────────────── */

const PLACEHOLDERS: Record<string, string> = {
  search: 'Ask SAL anything…',
  sports: 'Ask SAL Sports…',
  news: 'Ask SAL News…',
  tech: 'Ask SAL Tech…',
  finance: 'Ask SAL Finance…',
  realestate: 'Ask SAL Real Estate…',
  medical: 'Ask SAL Medical…',
  builder: 'Describe what you want to build…',
  'social-studio': 'Create a social media post…',
  'business-plan': 'Describe your business idea…',
  'career-suite': 'Ask about career strategies…',
  'voice-ai': 'Type or speak your message…',
  dashboard: 'Ask SAL anything…',
};

/* ─── Props ────────────────────────────────────────────────── */

interface InputBarProps {
  onSend: (text: string) => void;
}

/* ─── InputBar Component ───────────────────────────────────── */

export default function InputBar({ onSend }: InputBarProps) {
  const { activePage, model, setModel } = useAppStore();
  const [text, setText] = useState('');
  const [showModels, setShowModels] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const placeholder = PLACEHOLDERS[activePage] ?? 'Ask SAL anything…';
  const hasText = text.trim().length > 0;

  /* auto-resize textarea */
  useEffect(() => {
    const ta = textareaRef.current;
    if (!ta) return;
    ta.style.height = 'auto';
    ta.style.height = `${Math.min(ta.scrollHeight, 160)}px`;
  }, [text]);

  /* close dropdown on outside click */
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setShowModels(false);
      }
    }
    if (showModels) document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [showModels]);

  const handleSend = useCallback(() => {
    const trimmed = text.trim();
    if (!trimmed) return;
    onSend(trimmed);
    setText('');
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  }, [text, onSend]);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        handleSend();
      }
    },
    [handleSend],
  );

  return (
    <div className="w-full shrink-0">
      {/* Gradient fade */}
      <div className="pointer-events-none h-8 bg-gradient-to-t from-sal-bg to-transparent" />

      {/* Input container */}
      <div className="bg-sal-bg px-3 pb-3">
        <div className="relative mx-auto max-w-2xl">
          {/* Model selector dropdown */}
          {showModels && (
            <div
              ref={dropdownRef}
              className="absolute bottom-full left-0 mb-2 w-56 rounded-lg border border-sal-border bg-sal-surface p-1 shadow-2xl"
            >
              {SAL_TIERS.map((tier) => {
                const TierIcon = TIER_ICONS[tier.label] ?? Cpu;
                const isActive = model === tier.label;
                return (
                  <button
                    key={tier.id}
                    onClick={() => {
                      setModel(tier.label);
                      setShowModels(false);
                    }}
                    className={cn(
                      'flex w-full items-center gap-2 rounded-md px-2.5 py-1.5 text-left text-xs transition-colors',
                      isActive
                        ? 'bg-[#1C1C26] text-sal-gold'
                        : 'text-sal-text-muted hover:bg-[#161620] hover:text-sal-text',
                    )}
                  >
                    <TierIcon
                      size={13}
                      className={isActive ? 'text-sal-gold' : 'text-sal-text-muted'}
                    />
                    <div className="flex flex-col">
                      <span className="font-medium">{tier.label}</span>
                      <span className="text-[9px] text-sal-text-muted">
                        {tier.description}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          )}

          {/* Input box */}
          <div className="flex items-end gap-1.5 rounded-xl border border-sal-border2 bg-sal-input px-2.5 py-2">
            {/* Plus button */}
            <button className="mb-0.5 shrink-0 rounded p-1 text-sal-text-muted transition-colors hover:text-sal-text">
              <Plus size={16} />
            </button>

            {/* Textarea */}
            <textarea
              ref={textareaRef}
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={placeholder}
              rows={1}
              className="max-h-40 min-h-[20px] flex-1 resize-none bg-transparent text-sm text-sal-text placeholder:text-sal-text-muted focus:outline-none"
            />

            {/* Model selector trigger */}
            <button
              onClick={() => setShowModels((v) => !v)}
              className="mb-0.5 flex shrink-0 items-center gap-1 rounded-md border border-sal-border px-1.5 py-0.5 text-[10px] font-medium text-sal-text-muted transition-colors hover:border-sal-border2 hover:text-sal-text"
            >
              {model}
              <ChevronUp
                size={10}
                className={cn(
                  'transition-transform',
                  showModels && 'rotate-180',
                )}
              />
            </button>

            {/* Mic button */}
            <button className="mb-0.5 shrink-0 rounded p-1 text-sal-text-muted transition-colors hover:text-sal-text">
              <Mic size={16} />
            </button>

            {/* Send button */}
            <button
              onClick={handleSend}
              disabled={!hasText}
              className={cn(
                'mb-0.5 shrink-0 rounded-lg p-1.5 transition-colors',
                hasText
                  ? 'bg-sal-gold text-black hover:bg-sal-gold-hover'
                  : 'bg-sal-border text-sal-text-muted',
              )}
            >
              <Send size={14} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

