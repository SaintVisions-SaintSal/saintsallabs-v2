'use client';

import { useState } from 'react';
import {
  ChefHat, Search, Zap, BookOpen, Loader2,
  Star, DollarSign, BarChart2, Plus, ExternalLink,
} from 'lucide-react';
import { useAppStore } from '@/stores/app-store';
import { cn } from '@/lib/utils/cn';

type Action = 'search' | 'price' | 'deal' | 'scan';

interface CardResult {
  name?: string;
  set?: string;
  market_price?: number | string;
  raw_price?: number | string;
  psa_10?: number | string;
  psa_9?: number | string;
  analysis?: string;
  source?: string;
  deals?: { title: string; price: string; url?: string }[];
}

const ACTIONS: { id: Action; label: string; icon: typeof Search; desc: string }[] = [
  { id: 'price',  label: 'Price Check',  icon: DollarSign, desc: 'Market + PSA values' },
  { id: 'search', label: 'Research',     icon: BookOpen,   desc: 'Full card intel' },
  { id: 'deal',   label: 'Deal Scanner', icon: Zap,        desc: 'Find undervalued cards' },
  { id: 'scan',   label: 'Identify',     icon: Search,     desc: 'Describe to identify' },
];

const PLACEHOLDERS: Record<Action, string> = {
  price:  'e.g. Charizard Base Set Unlimited',
  search: 'e.g. 1st Edition Blastoise PSA 10',
  deal:   'e.g. Shadowless Charizard under $500',
  scan:   'Describe the card — set, art, condition…',
};

const SUGGESTIONS = [
  'Charizard Base Set', 'Pikachu Illustrator',
  '1st Edition Blastoise PSA 10', 'Black Lotus MTG',
  'LeBron James Rookie PSA 10', 'Mike Trout Bowman Chrome',
];

export default function CookinCardsPage() {
  const { user } = useAppStore();
  const [action, setAction]   = useState<Action>('price');
  const [query, setQuery]     = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult]   = useState<CardResult | null>(null);
  const [error, setError]     = useState<string | null>(null);
  const [portfolio, setPortfolio] = useState<CardResult[]>([]);

  const handleSubmit = async (q = query) => {
    if (!q.trim()) return;
    setLoading(true); setError(null); setResult(null);
    try {
      const res  = await fetch('/api/cookin-cards', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: q.trim(), action, userId: user?.id }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Request failed');
      setResult(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col px-4 pb-40 pt-6">
      <div className="mx-auto w-full max-w-2xl">

        {/* Header */}
        <div className="mb-6 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-500/15">
            <ChefHat size={20} className="text-orange-400" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-sal-text">
              CookinCards™
              <span className="ml-2 rounded-full bg-orange-500/15 px-2 py-0.5 text-[9px] font-semibold uppercase tracking-wider text-orange-400">
                AI Intelligence
              </span>
            </h1>
            <p className="text-xs text-sal-text-muted">TCG · Sports · Graded Cards · Market Research</p>
          </div>
        </div>

        {/* Action tabs */}
        <div className="mb-4 flex gap-1.5 overflow-x-auto pb-1">
          {ACTIONS.map((a) => (
            <button
              key={a.id}
              onClick={() => { setAction(a.id); setResult(null); setError(null); }}
              className={cn(
                'flex shrink-0 items-center gap-1.5 rounded-xl px-3 py-2 text-xs font-medium transition-all',
                action === a.id
                  ? 'bg-orange-500/20 text-orange-400 ring-1 ring-orange-500/30'
                  : 'bg-sal-surface text-sal-text-muted hover:bg-sal-surface2 hover:text-sal-text',
              )}
            >
              <a.icon size={13} strokeWidth={1.8} />
              {a.label}
            </button>
          ))}
        </div>

        {/* Search input */}
        <div className="mb-4 flex gap-2">
          <div className="relative flex-1">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-sal-text-muted/50" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
              placeholder={PLACEHOLDERS[action]}
              className="w-full rounded-xl border border-sal-border bg-sal-surface py-2.5 pl-8 pr-3 text-sm text-sal-text placeholder-sal-text-muted/40 outline-none focus:border-orange-500/40 focus:ring-1 focus:ring-orange-500/20"
            />
          </div>
          <button
            onClick={() => handleSubmit()}
            disabled={loading || !query.trim()}
            className="flex items-center gap-1.5 rounded-xl bg-orange-500 px-4 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-40"
          >
            {loading ? <Loader2 size={14} className="animate-spin" /> : <Zap size={14} />}
            {loading ? 'Cooking…' : 'Cook It'}
          </button>
        </div>

        {/* Suggestions */}
        {!result && !loading && (
          <div className="mb-5 flex flex-wrap gap-1.5">
            {SUGGESTIONS.map((s) => (
              <button
                key={s}
                onClick={() => { setQuery(s); handleSubmit(s); }}
                className="rounded-full border border-sal-border bg-sal-surface px-3 py-1 text-[11px] text-sal-text-muted transition-all hover:border-orange-500/30 hover:text-orange-400"
              >
                {s}
              </button>
            ))}
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="mb-4 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
            {error}
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div className="mb-4 flex flex-col items-center gap-3 py-8">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-500/15">
              <ChefHat size={22} className="animate-bounce text-orange-400" />
            </div>
            <p className="text-sm text-sal-text-muted">Sal is cooking up the data…</p>
          </div>
        )}

        {/* Result */}
        {result && (
          <div className="mb-4 rounded-2xl border border-sal-border bg-sal-surface p-4">
            {(result.name || result.set) && (
              <div className="mb-4 border-b border-sal-border pb-3">
                <h2 className="font-bold text-sal-text">{result.name ?? query}</h2>
                {result.set && <p className="text-xs text-sal-text-muted">{result.set}</p>}
              </div>
            )}

            {/* Price pills */}
            {(result.market_price || result.raw_price || result.psa_10 || result.psa_9) && (
              <div className="mb-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
                {result.market_price && <PricePill label="Market"  value={result.market_price} color="orange" />}
                {result.raw_price    && <PricePill label="Raw"     value={result.raw_price}    color="gray" />}
                {result.psa_10       && <PricePill label="PSA 10"  value={result.psa_10}       color="gold" />}
                {result.psa_9        && <PricePill label="PSA 9"   value={result.psa_9}        color="gray" />}
              </div>
            )}

            {/* Deals */}
            {result.deals && result.deals.length > 0 && (
              <div className="mb-4">
                <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-sal-text-muted">Deals Found</h3>
                <div className="flex flex-col gap-1.5">
                  {result.deals.map((d, i) => (
                    <div key={i} className="flex items-center justify-between rounded-lg border border-sal-border px-3 py-2">
                      <span className="flex-1 truncate text-sm text-sal-text">{d.title}</span>
                      <div className="ml-3 flex items-center gap-2">
                        <span className="text-sm font-semibold text-orange-400">{d.price}</span>
                        {d.url && <a href={d.url} target="_blank" rel="noreferrer"><ExternalLink size={12} className="text-sal-text-muted/50" /></a>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Analysis */}
            {result.analysis && (
              <div className="mb-4 rounded-xl bg-sal-surface2 p-3">
                <p className="mb-1 text-[10px] font-semibold uppercase tracking-wider text-orange-400/70">Sal&apos;s Take</p>
                <p className="text-sm leading-relaxed text-sal-text-muted">{result.analysis}</p>
              </div>
            )}

            <div className="flex items-center justify-between">
              {result.source && <span className="text-[10px] text-sal-text-muted/40">via {result.source}</span>}
              <button
                onClick={() => result && setPortfolio((p) => [result, ...p.slice(0, 9)])}
                className="ml-auto flex items-center gap-1.5 rounded-lg bg-sal-gold/10 px-3 py-1.5 text-xs font-medium text-sal-gold hover:bg-sal-gold/20"
              >
                <Plus size={12} /> Save to Portfolio
              </button>
            </div>
          </div>
        )}

        {/* Portfolio */}
        {portfolio.length > 0 && (
          <div>
            <div className="mb-2 flex items-center gap-2">
              <BarChart2 size={13} className="text-sal-text-muted" />
              <h2 className="text-xs font-semibold uppercase tracking-wider text-sal-text-muted">Session Portfolio ({portfolio.length})</h2>
            </div>
            <div className="flex flex-col gap-1.5">
              {portfolio.map((c, i) => (
                <div key={i} className="flex items-center justify-between rounded-xl border border-sal-border bg-sal-surface px-3 py-2.5">
                  <div className="flex items-center gap-2">
                    <Star size={12} className="text-orange-400" />
                    <span className="text-sm text-sal-text">{c.name ?? 'Card'}</span>
                    {c.set && <span className="text-xs text-sal-text-muted">· {c.set}</span>}
                  </div>
                  {c.market_price && (
                    <span className="text-sm font-semibold text-orange-400">
                      {typeof c.market_price === 'number' ? `$${c.market_price.toLocaleString()}` : c.market_price}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Rare Candy */}
        <div className="mt-8 rounded-2xl border border-orange-500/20 bg-orange-500/5 p-4">
          <div className="mb-2 flex items-center gap-2">
            <span className="text-lg">🍬</span>
            <h3 className="font-bold text-sal-text">Rare Candy</h3>
            <span className="rounded-full bg-orange-500/20 px-2 py-0.5 text-[9px] font-semibold uppercase tracking-wide text-orange-400">Pokémon</span>
          </div>
          <p className="mb-3 text-xs text-sal-text-muted">Dedicated Pokémon TCG intelligence — Base Set, Neo, EX, and modern sets.</p>
          <div className="grid grid-cols-3 gap-2">
            {['Base Set', 'Legendary', 'Modern'].map((cat) => (
              <button
                key={cat}
                onClick={() => { setQuery(`${cat} Pokemon cards price`); handleSubmit(`${cat} Pokemon cards price`); }}
                className="rounded-xl border border-orange-500/20 bg-orange-500/10 py-2 text-xs text-orange-300 transition-all hover:bg-orange-500/20"
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}

function PricePill({ label, value, color }: { label: string; value: number | string; color: 'orange' | 'gray' | 'gold' }) {
  const colors = {
    orange: 'bg-orange-500/10 text-orange-400 border-orange-500/20',
    gray:   'bg-sal-surface2 text-sal-text border-sal-border',
    gold:   'bg-sal-gold/10 text-sal-gold border-sal-gold/20',
  };
  const fmt = typeof value === 'number' ? `$${value.toLocaleString()}` : value;
  return (
    <div className={cn('rounded-xl border p-2.5 text-center', colors[color])}>
      <div className="mb-0.5 text-[9px] font-semibold uppercase tracking-wider opacity-60">{label}</div>
      <div className="text-sm font-bold">{fmt}</div>
    </div>
  );
}
