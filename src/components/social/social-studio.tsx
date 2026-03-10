'use client';

import { useState, useCallback } from 'react';
import { Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import PlatformSelector, { PLATFORMS } from './platform-selector';
import ContentGenerator, { type GeneratedContent } from './content-generator';

/* ─── Tone options ─────────────────────────────────────────── */

const TONES = [
  'Professional',
  'Casual',
  'Humorous',
  'Educational',
  'Promotional',
] as const;

type Tone = (typeof TONES)[number];

/* ─── Component ────────────────────────────────────────────── */

export default function SocialStudio() {
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([
    'twitter',
    'linkedin',
  ]);
  const [topic, setTopic] = useState('');
  const [tone, setTone] = useState<Tone>('Professional');
  const [content, setContent] = useState<GeneratedContent>({});
  const [isGenerating, setIsGenerating] = useState(false);

  /* ── Generate content for all selected platforms ────────── */

  const generate = useCallback(async () => {
    if (!topic.trim() || selectedPlatforms.length === 0) return;

    setIsGenerating(true);
    setContent({});

    try {
      const res = await fetch('/api/social', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic: topic.trim(),
          tone,
          platforms: selectedPlatforms.map((id) => {
            const p = PLATFORMS.find((pl) => pl.id === id);
            return { id, label: p?.label ?? id, charLimit: p?.charLimit ?? 280 };
          }),
        }),
      });

      if (!res.ok) throw new Error(`API error ${res.status}`);

      const json = await res.json();
      setContent(json.results ?? {});
    } catch (err) {
      console.error('Social generation failed:', err);
    } finally {
      setIsGenerating(false);
    }
  }, [topic, tone, selectedPlatforms]);

  /* ── Regenerate a single platform ──────────────────────── */

  const regeneratePlatform = useCallback(
    async (platformId: string) => {
      if (!topic.trim()) return;

      setIsGenerating(true);

      try {
        const p = PLATFORMS.find((pl) => pl.id === platformId);
        const res = await fetch('/api/social', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            topic: topic.trim(),
            tone,
            platforms: [
              {
                id: platformId,
                label: p?.label ?? platformId,
                charLimit: p?.charLimit ?? 280,
              },
            ],
          }),
        });

        if (!res.ok) throw new Error(`API error ${res.status}`);

        const json = await res.json();
        if (json.results?.[platformId]) {
          setContent((prev) => ({
            ...prev,
            [platformId]: json.results[platformId],
          }));
        }
      } catch (err) {
        console.error('Regeneration failed:', err);
      } finally {
        setIsGenerating(false);
      }
    },
    [topic, tone],
  );

  /* ── Edit content for a platform ───────────────────────── */

  const editContent = useCallback(
    (platformId: string, newContent: string) => {
      setContent((prev) => ({
        ...prev,
        [platformId]: {
          ...prev[platformId],
          content: newContent,
        },
      }));
    },
    [],
  );

  return (
    <div className="flex h-full flex-col gap-4 p-4 pb-32 lg:flex-row">
      {/* ── Left: Settings panel ───────────────────────────── */}
      <div className="w-full shrink-0 space-y-4 lg:w-80">
        {/* Topic input */}
        <div>
          <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-sal-text-muted">
            Topic / Prompt
          </label>
          <textarea
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="What do you want to post about?"
            rows={3}
            className="w-full resize-none rounded-lg border border-sal-border bg-sal-input px-3 py-2 text-sm text-sal-text placeholder:text-sal-text-muted focus:border-sal-border2 focus:outline-none"
          />
        </div>

        {/* Tone selector */}
        <div>
          <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-sal-text-muted">
            Tone
          </label>
          <div className="flex flex-wrap gap-1.5">
            {TONES.map((t) => (
              <button
                key={t}
                onClick={() => setTone(t)}
                className={cn(
                  'rounded-full px-3 py-1 text-xs font-medium transition-all',
                  tone === t
                    ? 'bg-sal-gold text-black'
                    : 'border border-sal-border bg-sal-surface text-sal-text-muted hover:border-sal-border2 hover:text-sal-text',
                )}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        {/* Platform selector */}
        <PlatformSelector
          selected={selectedPlatforms}
          onChange={setSelectedPlatforms}
        />

        {/* Generate button */}
        <button
          onClick={generate}
          disabled={!topic.trim() || selectedPlatforms.length === 0 || isGenerating}
          className={cn(
            'flex w-full items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold transition-all',
            topic.trim() && selectedPlatforms.length > 0 && !isGenerating
              ? 'bg-sal-gold text-black hover:bg-sal-gold-hover'
              : 'cursor-not-allowed bg-sal-border text-sal-text-muted',
          )}
        >
          {isGenerating ? (
            <>
              <RefreshIcon /> Generating…
            </>
          ) : (
            <>
              <Sparkles size={14} /> Generate for{' '}
              {selectedPlatforms.length} Platform
              {selectedPlatforms.length !== 1 ? 's' : ''}
            </>
          )}
        </button>
      </div>

      {/* ── Right: Generated content ───────────────────────── */}
      <div className="min-h-0 flex-1 overflow-y-auto">
        <ContentGenerator
          selectedPlatforms={selectedPlatforms}
          content={content}
          isGenerating={isGenerating}
          onEditContent={editContent}
          onRegeneratePlatform={regeneratePlatform}
        />
      </div>
    </div>
  );
}

/* ─── Tiny spinner icon ────────────────────────────────────── */

function RefreshIcon() {
  return (
    <svg
      className="h-3.5 w-3.5 animate-spin-fast"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2.5}
      strokeLinecap="round"
    >
      <path d="M21 12a9 9 0 1 1-6.22-8.56" />
    </svg>
  );
}
