import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';
export const maxDuration = 30;

const ALPACA_BASE = 'https://paper-api.alpaca.markets/v2';
const DATA_BASE   = 'https://data.alpaca.markets/v2';

function alpacaHeaders() {
  return {
    'APCA-API-KEY-ID': process.env.ALPACA_API_KEY_ID ?? '',
    'APCA-API-SECRET-KEY': process.env.ALPACA_SECRET_KEY ?? '',
    'Content-Type': 'application/json',
  };
}

async function getMarketStatus() {
  try {
    const res = await fetch(`${ALPACA_BASE}/clock`, { headers: alpacaHeaders() });
    if (!res.ok) return null;
    return await res.json();
  } catch { return null; }
}

async function getQuotes(symbols: string[]) {
  if (!symbols.length) return {};
  try {
    const sym = symbols.join(',');
    const res = await fetch(`${DATA_BASE}/stocks/snapshots?symbols=${sym}&feed=iex`, { headers: alpacaHeaders() });
    if (!res.ok) return {};
    return await res.json();
  } catch { return {}; }
}

async function tavilyFinanceNews(): Promise<{ title: string; url: string; snippet: string }[]> {
  const key = process.env.TAVILY_API_KEY;
  if (!key) return [];
  try {
    const res = await fetch('https://api.tavily.com/search', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ api_key: key, query: 'stock market news today S&P 500', max_results: 5, topic: 'finance' }),
    });
    const data = await res.json();
    return (data.results ?? []).slice(0,5).map((r: { title: string; url: string; content: string }) => ({
      title: r.title, url: r.url, snippet: r.content?.slice(0,150),
    }));
  } catch { return []; }
}

const DEFAULT_WATCHLIST = ['AAPL', 'MSFT', 'GOOGL', 'AMZN', 'NVDA', 'TSLA', 'SPY', 'QQQ'];

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const symbolsParam = searchParams.get('symbols');
    const symbols = symbolsParam ? symbolsParam.split(',').map(s => s.trim().toUpperCase()) : DEFAULT_WATCHLIST;

    const [clock, quotes, news] = await Promise.all([
      getMarketStatus(),
      getQuotes(symbols),
      tavilyFinanceNews(),
    ]);

    const watchlist = symbols.map(sym => {
      const snap = (quotes as Record<string, { latestTrade?: { p: number }; dailyBar?: { c: number; o: number } }>)[sym];
      const price = snap?.latestTrade?.p ?? snap?.dailyBar?.c ?? null;
      const open  = snap?.dailyBar?.o ?? null;
      const changePercent = price && open ? (((price - open) / open) * 100).toFixed(2) : null;
      return { symbol: sym, price, changePercent, change: changePercent ? `${Number(changePercent) >= 0 ? '+' : ''}${changePercent}%` : null };
    });

    return NextResponse.json({
      ok: true,
      market: {
        isOpen: clock?.is_open ?? null,
        nextOpen: clock?.next_open ?? null,
        nextClose: clock?.next_close ?? null,
      },
      watchlist,
      news,
      source: 'Alpaca Markets + Tavily',
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    console.error('[/api/finance]', err);
    return NextResponse.json({ error: err instanceof Error ? err.message : 'Server error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { symbols } = await req.json();
    const url = new URL(req.url);
    if (symbols?.length) url.searchParams.set('symbols', symbols.join(','));
    return GET(new NextRequest(url.toString(), { headers: req.headers }));
  } catch {
    return NextResponse.json({ error: 'Bad request' }, { status: 400 });
  }
}
