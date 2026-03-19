import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';
export const maxDuration = 30;

async function tavilySearch(query: string): Promise<{ title: string; url: string; content: string }[]> {
  const key = process.env.TAVILY_API_KEY;
  if (!key) return [];
  try {
    const res = await fetch('https://api.tavily.com/search', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ api_key: key, query, max_results: 8, topic: 'news' }),
    });
    const data = await res.json();
    return data.results ?? [];
  } catch { return []; }
}

async function grokAnalyze(prompt: string): Promise<string> {
  const key = process.env.XAI_API_KEY;
  if (!key) return '';
  try {
    const res = await fetch('https://api.x.ai/v1/chat/completions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${key}` },
      body: JSON.stringify({
        model: 'grok-3',
        messages: [
          { role: 'system', content: 'You are SAL Sports Intelligence. Summarize sports news and scores concisely.' },
          { role: 'user', content: prompt },
        ],
        max_tokens: 500,
        temperature: 0.3,
      }),
    });
    const data = await res.json();
    return data.choices?.[0]?.message?.content ?? '';
  } catch { return ''; }
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const sport = searchParams.get('sport') ?? 'all sports';
    const query = searchParams.get('q') ?? `${sport} scores standings highlights today`;

    const results = await tavilySearch(query);
    const summary = results.length > 0
      ? await grokAnalyze(`Summarize these sports headlines:\n${results.slice(0,5).map(r => `${r.title}: ${r.content?.slice(0,200)}`).join('\n')}`)
      : '';

    return NextResponse.json({
      ok: true,
      sport,
      summary: summary || 'Live scores and standings unavailable — check ESPN or Bleacher Report.',
      headlines: results.slice(0, 8).map(r => ({
        title: r.title,
        url: r.url,
        snippet: r.content?.slice(0, 150),
      })),
      source: 'Tavily + Grok',
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    console.error('[/api/sports]', err);
    return NextResponse.json({ error: err instanceof Error ? err.message : 'Server error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { query, sport } = await req.json();
    return GET(new NextRequest(req.url + `?q=${encodeURIComponent(query ?? '')}&sport=${encodeURIComponent(sport ?? 'sports')}`, { headers: req.headers }));
  } catch {
    return NextResponse.json({ error: 'Bad request' }, { status: 400 });
  }
}
