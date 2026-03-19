import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';
export const maxDuration = 30;

async function tavilyNews(query: string): Promise<{ title: string; url: string; content: string; publishedDate?: string }[]> {
  const key = process.env.TAVILY_API_KEY;
  if (!key) return [];
  try {
    const res = await fetch('https://api.tavily.com/search', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ api_key: key, query, max_results: 10, topic: 'news' }),
    });
    const data = await res.json();
    return data.results ?? [];
  } catch { return []; }
}

const CATEGORY_QUERIES: Record<string, string> = {
  tech:    'latest technology AI news today',
  finance: 'stock market financial news today',
  sports:  'sports news scores highlights today',
  general: 'top world news headlines today',
  ai:      'artificial intelligence news 2025',
};

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get('category') ?? 'general';
    const q = searchParams.get('q') ?? CATEGORY_QUERIES[category] ?? CATEGORY_QUERIES.general;

    const results = await tavilyNews(q);

    return NextResponse.json({
      ok: true,
      category,
      articles: results.map(r => ({
        title: r.title,
        url: r.url,
        snippet: r.content?.slice(0, 200),
        publishedDate: r.publishedDate,
      })),
      count: results.length,
      source: 'Tavily News',
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    console.error('[/api/news]', err);
    return NextResponse.json({ error: err instanceof Error ? err.message : 'Server error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { query, category } = await req.json();
    const url = new URL(req.url);
    if (query) url.searchParams.set('q', query);
    if (category) url.searchParams.set('category', category);
    return GET(new NextRequest(url.toString(), { headers: req.headers }));
  } catch {
    return NextResponse.json({ error: 'Bad request' }, { status: 400 });
  }
}
