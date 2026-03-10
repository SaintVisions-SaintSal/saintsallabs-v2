'use client';

import { useEffect, useState } from 'react';
import { useAppStore } from '@/stores/app-store';

/* ─── Static market placeholders (replaced by live data on mount) ─ */

interface TickerItem {
  label: string;
  value: string;
  change: string;
  up: boolean;
}

const MARKET_DEFAULTS: TickerItem[] = [
  { label: 'S&P 500', value: '5,892.41', change: '+0.68%', up: true },
  { label: 'NASDAQ', value: '19,321.08', change: '+1.12%', up: true },
  { label: 'DOW', value: '43,210.67', change: '+0.31%', up: true },
  { label: 'BTC', value: '—', change: '—', up: true },
  { label: '10Y', value: '4.27%', change: '-0.03', up: false },
  { label: 'VIX', value: '14.82', change: '-1.21', up: false },
  { label: 'OIL', value: '78.32', change: '+0.45%', up: true },
];

const VERTICAL_NEWS: Record<string, string[]> = {
  search: [
    'SAL Search: 12M queries processed today',
    'HACP Protocol cited in 47 new research papers',
    'SaintSal Labs announces SAL Pro tier expansion',
  ],
  sports: [
    'NBA: Playoffs bracket predictions updated',
    'NFL Draft: Top 10 mock analysis live',
    'MLB: Opening day lineups released',
  ],
  news: [
    'Breaking: Federal Reserve holds rates steady',
    'Global summit on AI regulation concludes',
    'Geopolitical tensions ease in Eastern Europe',
  ],
  tech: [
    'AI chip demand surges 340% year-over-year',
    'New zero-day vulnerability patched in major OS',
    'Quantum computing milestone reached at 1,000 qubits',
  ],
  finance: [
    'Fed minutes signal potential rate cut in Q3',
    'Institutional flows pivot toward AI sector',
    'Treasury yields invert for third consecutive session',
  ],
  realestate: [
    'Housing starts jump 8.2% in latest data',
    'Commercial office vacancy hits post-pandemic low',
    'Mortgage rates dip below 6% threshold',
  ],
  medical: [
    'FDA fast-tracks new Alzheimer treatment',
    'mRNA vaccine platform expanded to cancer therapy',
    'Clinical trial results exceed expectations for GLP-1 class',
  ],
};

/* ─── Ticker Component ─────────────────────────────────────── */

export default function Ticker() {
  const { activePage } = useAppStore();
  const [markets, setMarkets] = useState<TickerItem[]>(MARKET_DEFAULTS);

  // Fetch live BTC price from Coinbase on mount
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch(
          'https://api.coinbase.com/v2/prices/BTC-USD/spot',
        );
        if (!res.ok) return;
        const json = await res.json();
        const price = parseFloat(json.data.amount);
        if (cancelled || isNaN(price)) return;
        setMarkets((prev) =>
          prev.map((m) =>
            m.label === 'BTC'
              ? {
                  ...m,
                  value: price.toLocaleString('en-US', {
                    style: 'currency',
                    currency: 'USD',
                    maximumFractionDigits: 0,
                  }),
                  change: '+0.00%',
                  up: true,
                }
              : m,
          ),
        );
      } catch {
        // silently fail — keep placeholder
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const news =
    VERTICAL_NEWS[activePage] ?? VERTICAL_NEWS.search ?? [];

  const tickerContent = (
    <>
      {markets.map((m) => (
        <span key={m.label} className="mx-3 inline-flex items-center gap-1.5 whitespace-nowrap">
          <span className="font-medium text-sal-text-muted">{m.label}</span>
          <span className="text-sal-text">{m.value}</span>
          <span className={m.up ? 'text-sal-green' : 'text-sal-red'}>
            {m.change}
          </span>
        </span>
      ))}
      {news.map((n, i) => (
        <span
          key={i}
          className="mx-3 inline-flex items-center gap-1.5 whitespace-nowrap"
        >
          <span className="text-sal-text-muted">|</span>
          <span className="text-sal-text">{n}</span>
        </span>
      ))}
    </>
  );

  return (
    <div className="flex h-[30px] shrink-0 items-center overflow-hidden border-b border-[#131320] bg-[#07070A] text-[10px]">
      {/* LIVE indicator */}
      <div className="flex shrink-0 items-center gap-1.5 border-r border-[#131320] px-2.5">
        <span className="h-1.5 w-1.5 animate-pulse-dot rounded-full bg-sal-red" />
        <span className="text-[9px] font-semibold uppercase tracking-wide text-sal-red">
          LIVE
        </span>
      </div>

      {/* Scrolling ticker — duplicated for seamless loop */}
      <div className="relative flex-1 overflow-hidden">
        <div className="animate-ticker inline-flex">
          {tickerContent}
          {tickerContent}
        </div>
      </div>
    </div>
  );
}
