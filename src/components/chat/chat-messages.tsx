'use client';

import { useRef, useEffect } from 'react';
import type { Message, Vertical } from '@/types';
import { VERTICAL_CONFIG, type VerticalArticle } from '@/config/verticals';
import { cn } from '@/lib/utils/cn';

/* ─── Lightweight markdown renderer (no external dep) ──────── */

function renderMarkdown(raw: string): string {
  let html = raw
    // Escape HTML entities
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

  // Code blocks: ```lang\n...\n```
  html = html.replace(
    /```(\w*)\n([\s\S]*?)```/g,
    (_match, lang: string, code: string) =>
      `<pre class="my-2 overflow-x-auto rounded-lg bg-[#0A0A10] p-3 text-xs leading-relaxed"><code class="language-${lang}">${code.trim()}</code></pre>`,
  );

  // Inline code: `...`
  html = html.replace(
    /`([^`]+)`/g,
    '<code class="rounded bg-[#1A1A24] px-1 py-0.5 text-xs text-sal-gold">$1</code>',
  );

  // Headers
  html = html.replace(
    /^#### (.+)$/gm,
    '<h4 class="mb-1 mt-3 text-xs font-semibold text-sal-text">$1</h4>',
  );
  html = html.replace(
    /^### (.+)$/gm,
    '<h3 class="mb-1 mt-3 text-sm font-semibold text-sal-text">$1</h3>',
  );
  html = html.replace(
    /^## (.+)$/gm,
    '<h2 class="mb-1 mt-4 text-base font-semibold text-sal-text">$1</h2>',
  );
  html = html.replace(
    /^# (.+)$/gm,
    '<h1 class="mb-2 mt-4 text-lg font-bold text-sal-text">$1</h1>',
  );

  // Bold + italic
  html = html.replace(/\*\*\*(.+?)\*\*\*/g, '<strong><em>$1</em></strong>');
  html = html.replace(/\*\*(.+?)\*\*/g, '<strong class="text-sal-text">$1</strong>');
  html = html.replace(/\*(.+?)\*/g, '<em>$1</em>');

  // Unordered lists
  html = html.replace(/^- (.+)$/gm, '<li class="ml-4 list-disc">$1</li>');

  // Ordered lists
  html = html.replace(/^\d+\. (.+)$/gm, '<li class="ml-4 list-decimal">$1</li>');

  // Wrap consecutive <li> runs in <ul>/<ol>
  html = html.replace(
    /(<li class="ml-4 list-disc">[\s\S]*?<\/li>(\n|$))+/g,
    (block) => `<ul class="my-1 space-y-0.5">${block}</ul>`,
  );
  html = html.replace(
    /(<li class="ml-4 list-decimal">[\s\S]*?<\/li>(\n|$))+/g,
    (block) => `<ol class="my-1 space-y-0.5">${block}</ol>`,
  );

  // Line breaks (double newline = paragraph, single = br)
  html = html.replace(/\n\n/g, '</p><p class="mt-2">');
  html = html.replace(/\n/g, '<br/>');

  return `<p>${html}</p>`;
}

/* ─── Streaming dots ───────────────────────────────────────── */

function StreamingDots() {
  return (
    <span className="inline-flex items-center gap-0.5">
      <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-sal-gold [animation-delay:0ms]" />
      <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-sal-gold [animation-delay:200ms]" />
      <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-sal-gold [animation-delay:400ms]" />
    </span>
  );
}

/* ─── Article Card ─────────────────────────────────────────── */

function ArticleCard({
  article,
  onClick,
}: {
  article: VerticalArticle;
  onClick: (prompt: string) => void;
}) {
  return (
    <button
      onClick={() => onClick(article.prompt)}
      className="card-hover group flex flex-col overflow-hidden rounded-lg border border-sal-border bg-sal-surface text-left transition-all hover:border-sal-border2"
    >
      <div className="relative h-24 w-full overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={article.imgUrl}
          alt={article.title}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-sal-surface to-transparent" />
      </div>
      <div className="flex flex-col gap-1 p-2.5">
        <span
          className="text-[9px] font-bold uppercase tracking-wider"
          style={{ color: article.catColor }}
        >
          {article.cat}
        </span>
        <span className="text-xs font-medium leading-tight text-sal-text">
          {article.title}
        </span>
      </div>
    </button>
  );
}

/* ─── Props ────────────────────────────────────────────────── */

interface ChatMessagesProps {
  messages: Message[];
  vertical: Vertical;
  onPrompt: (text: string) => void;
}

/* ─── ChatMessages Component ───────────────────────────────── */

export default function ChatMessages({
  messages,
  vertical,
  onPrompt,
}: ChatMessagesProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const config = VERTICAL_CONFIG[vertical];

  // Auto-scroll to bottom on new messages / streaming updates
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollTop = el.scrollHeight;
  }, [messages]);

  const isEmpty = messages.length === 0;

  return (
    <div
      ref={scrollRef}
      className="flex-1 overflow-y-auto px-4 pb-36 pt-4"
    >
      <div className="mx-auto max-w-2xl">
        {isEmpty ? (
          /* ── Empty State ───────────────────────────────── */
          <div className="flex flex-col items-center pt-8">
            {/* Vertical tagline */}
            <div className="mb-6 text-center">
              <h2 className="text-xl font-bold text-sal-text">
                SAL{' '}
                <span style={{ color: config.accent }}>
                  {vertical.charAt(0).toUpperCase() + vertical.slice(1)}
                </span>
              </h2>
              <p className="mt-1 text-sm text-sal-text-muted">
                {config.tagline}
              </p>
            </div>

            {/* Article cards */}
            <div className="mb-6 grid w-full grid-cols-3 gap-3">
              {config.articles.map((article) => (
                <ArticleCard
                  key={article.title}
                  article={article}
                  onClick={onPrompt}
                />
              ))}
            </div>

            {/* Starter prompts */}
            <div className="flex w-full flex-col gap-2">
              {config.starters.map((starter) => (
                <button
                  key={starter}
                  onClick={() => onPrompt(starter)}
                  className="nav-btn rounded-lg border border-sal-border bg-sal-surface px-3 py-2.5 text-left text-xs text-sal-text-muted transition-colors hover:border-sal-border2 hover:text-sal-text"
                >
                  {starter}
                </button>
              ))}
            </div>
          </div>
        ) : (
          /* ── Message List ──────────────────────────────── */
          <div className="flex flex-col gap-4">
            {messages.map((msg, i) => {
              const isUser = msg.role === 'user';
              const isStreaming = msg.streaming && msg.content === '';

              return (
                <div
                  key={i}
                  className={cn(
                    'animate-fade-up flex',
                    isUser ? 'justify-end' : 'justify-start',
                  )}
                  style={{ animationDelay: `${Math.min(i * 30, 150)}ms` }}
                >
                  <div
                    className={cn(
                      'max-w-[85%] rounded-xl px-3.5 py-2.5 text-sm leading-relaxed',
                      isUser
                        ? 'bg-sal-surface text-sal-text'
                        : 'bg-[#0E0E14] text-sal-text-secondary',
                    )}
                  >
                    {isStreaming ? (
                      <StreamingDots />
                    ) : isUser ? (
                      <span>{msg.content}</span>
                    ) : (
                      <div
                        className="prose-sal"
                        dangerouslySetInnerHTML={{
                          __html: renderMarkdown(msg.content),
                        }}
                      />
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
