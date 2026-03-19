import { NextRequest, NextResponse } from 'next/server';

export const runtime    = 'nodejs';
export const maxDuration = 30;

type Action = 'search' | 'price' | 'deal' | 'scan';

/* ─── Web research helpers ──────────────────────────────────── */

async function exaSearch(query: string): Promise<string> {
  const key = process.env.EXA_API_KEY ?? process.env.EXA_SERVICE_KEY;
  if (!key) return '';
  try {
    const res = await fetch('https://api.exa.ai/search', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-api-key': key },
      body: JSON.stringify({ query, num_results: 5, use_autoprompt: true, text: { max_characters: 800 } }),
    });
    const data = await res.json();
    return (data.results ?? [])
      .map((r: { title?: string; text?: string }) => `${r.title ?? ''}\n${r.text ?? ''}`)
      .join('\n\n');
  } catch { return ''; }
}

async function tavilySearch(query: string): Promise<string> {
  const key = process.env.TAVILY_API_KEY;
  if (!key) return '';
  try {
    const res = await fetch('https://api.tavily.com/search', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ api_key: key, query, max_results: 5 }),
    });
    const data = await res.json();
    return (data.results ?? [])
      .map((r: { title?: string; content?: string; url?: string }) =>
        `${r.title ?? ''}: ${r.content ?? ''} (${r.url ?? ''})`)
      .join('\n\n');
  } catch { return ''; }
}

async function xaiAnalyze(system: string, user: string): Promise<string> {
  const key = process.env.XAI_API_KEY;
  if (!key) return '';
  try {
    const res = await fetch('https://api.x.ai/v1/chat/completions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${key}` },
      body: JSON.stringify({
        model: 'grok-3',
        messages: [{ role: 'system', content: system }, { role: 'user', content: user }],
        max_tokens: 600,
        temperature: 0.3,
      }),
    });
    const data = await res.json();
    return data.choices?.[0]?.message?.content ?? '';
  } catch { return ''; }
}

/* ─── JUSTTCG price lookup ──────────────────────────────────── */

async function justtcgPrice(name: string) {
  const key = process.env.JUSTTCG_API_KEY;
  if (!key || key.includes('_KEY_HERE')) return null;
  try {
    const res = await fetch(
      `https://api.justtcg.com/v1/cards/search?name=${encodeURIComponent(name)}`,
      { headers: { Authorization: `Bearer ${key}` } },
    );
    if (!res.ok) return null;
    const data = await res.json();
    const card = Array.isArray(data) ? data[0] : data?.cards?.[0];
    if (!card) return null;
    return {
      market: card.market_price ?? card.price ?? card.marketPrice,
      raw: card.low_price ?? card.lowPrice,
    };
  } catch { return null; }
}

/* ─── PSA graded lookup ─────────────────────────────────────── */

async function psaPrice(name: string) {
  const key = process.env.PSA_API_KEY;
  if (!key || key.includes('_KEY_HERE')) return null;
  try {
    const res = await fetch(
      `https://api.psacard.com/publicapi/cert/GetPopReportByCert?specNo=${encodeURIComponent(name)}`,
      { headers: { Authorization: `bearer ${key}` } },
    );
    if (!res.ok) return null;
    const data = await res.json();
    return { psa10: data?.PSAGrade10, psa9: data?.PSAGrade9 };
  } catch { return null; }
}

/* ─── Price extraction from text ────────────────────────────── */

function extractFromText(text: string) {
  const prices = text.match(/\$[\d,]+(?:\.\d{2})?/g) ?? [];
  const deals = text.split('\n')
    .filter((l) => l.includes('$'))
    .slice(0, 4)
    .map((l) => ({
      title: l.replace(/https?:\/\/[^\s)]+/g, '').replace(/\$[\d,]+(?:\.\d{2})?/g, '').trim().slice(0, 60),
      price: l.match(/\$[\d,]+(?:\.\d{2})?/)?.[0] ?? '',
      url: l.match(/https?:\/\/[^\s)]+/)?.[0],
    }))
    .filter((d) => d.price);
  return { market: prices[0], deals };
}

/* ─── Handler ───────────────────────────────────────────────── */

export async function POST(req: NextRequest) {
  try {
    const { query, action }: { query: string; action: Action } = await req.json();
    if (!query?.trim()) return NextResponse.json({ error: 'query required' }, { status: 400 });

    const SAL_SYSTEM = 'You are CookinCards™, an elite AI for trading card and sports card market intelligence. Be concise, specific, and data-driven.';

    switch (action) {

      case 'price': {
        const [tcg, psa, exa, tav] = await Promise.all([
          justtcgPrice(query),
          psaPrice(query),
          exaSearch(`${query} price value market 2025`),
          tavilySearch(`${query} card price PSA graded value 2025`),
        ]);
        const combined  = `${exa}\n\n${tav}`;
        const extracted = extractFromText(combined);
        const analysis  = await xaiAnalyze(SAL_SYSTEM,
          `Summarize pricing for: "${query}"\n\nData:\n${combined.slice(0, 2000)}`);
        return NextResponse.json({
          name: query,
          market_price: tcg?.market ?? extracted.market,
          raw_price:    tcg?.raw,
          psa_10:       psa?.psa10,
          psa_9:        psa?.psa9,
          analysis:     analysis || 'Price data gathered from market sources.',
          deals:        extracted.deals,
          source:       tcg ? 'JustTCG + PSA + Exa + Tavily' : 'Exa + Tavily + Grok',
        });
      }

      case 'search': {
        const [exa, tav] = await Promise.all([
          exaSearch(`${query} collectible card history population value`),
          tavilySearch(`${query} card collectors market rare value`),
        ]);
        const combined  = `${exa}\n\n${tav}`;
        const extracted = extractFromText(combined);
        const analysis  = await xaiAnalyze(SAL_SYSTEM,
          `Research: "${query}"\n\nSources:\n${combined.slice(0, 2500)}\n\nCover: history, rarity, investment potential, key variants.`);
        return NextResponse.json({
          name: query, analysis,
          market_price: extracted.market,
          deals: extracted.deals,
          source: 'Exa + Tavily + Grok',
        });
      }

      case 'deal': {
        const [exa, tav] = await Promise.all([
          exaSearch(`${query} for sale cheap undervalued buy 2025`),
          tavilySearch(`${query} card deal price undervalued buy now`),
        ]);
        const combined  = `${exa}\n\n${tav}`;
        const extracted = extractFromText(combined);
        const analysis  = await xaiAnalyze(SAL_SYSTEM,
          `Find best deals for: "${query}"\n\nData:\n${combined.slice(0, 2000)}\n\nIdentify undervalued opportunities.`);
        return NextResponse.json({
          name: query, analysis,
          deals: extracted.deals.length > 0 ? extracted.deals : [
            { title: 'Check eBay sold listings for comps', price: 'See market' },
            { title: 'PWCC Marketplace auction data',      price: 'See market' },
          ],
          source: 'Exa + Tavily + Grok Deal Analysis',
        });
      }

      case 'scan': {
        const analysis = await xaiAnalyze(SAL_SYSTEM,
          `Identify this card from description: "${query}"\n\nProvide: name, set, year, estimated PSA 10 value, raw value, and why collectors care about it.`);
        const exa       = await exaSearch(`${query} card price identification`);
        const extracted = extractFromText(exa);
        return NextResponse.json({
          name: query, analysis,
          market_price: extracted.market,
          source: 'Grok Analysis + Exa',
        });
      }

      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }
  } catch (err) {
    console.error('[/api/cookin-cards]', err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Server error' },
      { status: 500 },
    );
  }
}
