'use client';

import { useState, useCallback } from 'react';
import { Copy, RefreshCw, Check, ClipboardCopy } from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import { PLATFORMS, type Platform } from './platform-selector';

/* ─── Types ────────────────────────────────────────────────── */

export interface GeneratedPost {
  content: string;
  hashtags: string[];
}

export type GeneratedContent = Record<string, GeneratedPost>;

interface ContentGeneratorProps {
  selectedPlatforms: string[];
  content: GeneratedContent;
  isGenerating: boolean;
  onEditContent: (platformId: string, content: string) => void;
  onRegeneratePlatform: (platformId: string) => void;
}

/* ─── Component ────────────────────────────────────────────── */

export default function ContentGenerator({
  selectedPlatforms,
  content,
  isGenerating,
  onEditContent,
  onRegeneratePlatform,
}: ContentGeneratorProps) {
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [copiedAll, setCopiedAll] = useState(false);

  const platformMap = PLATFORMS.reduce<Record<string, Platform>>(
    (acc, p) => ({ ...acc, [p.id]: p }),
    {},
  );

  const copyToClipboard = useCallback(
    async (text: string, id: string) => {
      await navigator.clipboard.writeText(text);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 1500);
    },
    [],
  );

  const copyAll = useCallback(async () => {
    const allText = selectedPlatforms
      .filter((id) => content[id])
      .map((id) => {
        const p = platformMap[id];
        const post = content[id];
        const hashtags =
          post.hashtags.length > 0 ? `\n${post.hashtags.join(' ')}` : '';
        return `── ${p?.label ?? id} ──\n${post.content}${hashtags}`;
      })
      .join('\n\n');
    await navigator.clipboard.writeText(allText);
    setCopiedAll(true);
    setTimeout(() => setCopiedAll(false), 1500);
  }, [selectedPlatforms, content, platformMap]);

  const hasContent = selectedPlatforms.some((id) => content[id]);

  if (selectedPlatforms.length === 0) {
    return (
      <div className="flex h-full items-center justify-center">
        <p className="text-sm text-sal-text-muted">
          Select platforms to get started
        </p>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-sal-text-muted">
          Generated Content
        </h3>
        {hasContent && (
          <button
            onClick={copyAll}
            className="flex items-center gap-1 rounded-md px-2 py-0.5 text-[10px] font-medium text-sal-gold transition-colors hover:bg-sal-gold/10"
          >
            {copiedAll ? (
              <>
                <Check size={10} /> Copied!
              </>
            ) : (
              <>
                <ClipboardCopy size={10} /> Copy All
              </>
            )}
          </button>
        )}
      </div>

      {/* Cards */}
      <div className="space-y-3">
        {selectedPlatforms.map((id) => {
          const platform = platformMap[id];
          if (!platform) return null;

          const post = content[id];
          const isDark = id === 'tiktok' || id === 'threads';
          const isCopied = copiedId === id;

          /* ── Skeleton while generating ── */
          if (isGenerating && !post) {
            return (
              <div
                key={id}
                className="animate-pulse rounded-lg border border-sal-border bg-sal-surface p-3"
              >
                <div className="mb-2 flex items-center gap-2">
                  <div
                    className={cn(
                      'h-6 w-6 rounded',
                      isDark ? 'border border-sal-border2 bg-sal-surface2' : '',
                    )}
                    style={{
                      backgroundColor: isDark ? undefined : platform.color,
                    }}
                  />
                  <div className="h-3 w-20 rounded bg-sal-border" />
                </div>
                <div className="space-y-1.5">
                  <div className="h-3 w-full rounded bg-sal-border" />
                  <div className="h-3 w-4/5 rounded bg-sal-border" />
                  <div className="h-3 w-3/5 rounded bg-sal-border" />
                </div>
              </div>
            );
          }

          if (!post) return null;

          const fullText =
            post.content +
            (post.hashtags.length > 0
              ? `\n\n${post.hashtags.join(' ')}`
              : '');
          const charCount = fullText.length;
          const overLimit = charCount > platform.charLimit;

          return (
            <div
              key={id}
              className="rounded-lg border border-sal-border bg-sal-surface p-3"
            >
              {/* Platform header */}
              <div className="mb-2 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div
                    className={cn(
                      'flex h-6 w-6 items-center justify-center rounded text-[10px] font-bold',
                      isDark ? 'border border-sal-border2' : '',
                    )}
                    style={{
                      backgroundColor: isDark ? '#111116' : platform.color,
                      color: isDark ? '#E8E6E1' : '#fff',
                    }}
                  >
                    {platform.letter}
                  </div>
                  <span className="text-xs font-medium text-sal-text">
                    {platform.label}
                  </span>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => onRegeneratePlatform(id)}
                    disabled={isGenerating}
                    className="rounded p-1 text-sal-text-muted transition-colors hover:bg-sal-surface2 hover:text-sal-text disabled:opacity-40"
                    title="Regenerate"
                  >
                    <RefreshCw
                      size={12}
                      className={isGenerating ? 'animate-spin-fast' : ''}
                    />
                  </button>
                  <button
                    onClick={() => copyToClipboard(fullText, id)}
                    className="rounded p-1 text-sal-text-muted transition-colors hover:bg-sal-surface2 hover:text-sal-text"
                    title="Copy"
                  >
                    {isCopied ? (
                      <Check size={12} className="text-sal-green" />
                    ) : (
                      <Copy size={12} />
                    )}
                  </button>
                </div>
              </div>

              {/* Editable textarea */}
              <textarea
                value={post.content}
                onChange={(e) => onEditContent(id, e.target.value)}
                rows={4}
                className="w-full resize-none rounded-md border border-sal-border bg-sal-input px-2.5 py-2 text-sm text-sal-text placeholder:text-sal-text-muted focus:border-sal-border2 focus:outline-none"
              />

              {/* Hashtags */}
              {post.hashtags.length > 0 && (
                <div className="mt-1.5 flex flex-wrap gap-1">
                  {post.hashtags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded bg-sal-surface2 px-1.5 py-0.5 text-[10px] text-sal-purple"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}

              {/* Character count */}
              <div className="mt-1.5 flex items-center justify-end">
                <span
                  className={cn(
                    'text-[10px] tabular-nums',
                    overLimit ? 'text-sal-red' : 'text-sal-text-muted',
                  )}
                >
                  {charCount.toLocaleString()} / {platform.charLimit.toLocaleString()}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
