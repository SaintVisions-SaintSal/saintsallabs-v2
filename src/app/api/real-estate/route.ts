import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';
export const maxDuration = 30;

const RENTCAST_BASE = 'https://api.rentcast.io/v1';

function rentcastHeaders() {
  return {
    'X-Api-Key': process.env.RENTCAST_API_KEY ?? '',
    'Content-Type': 'application/json',
  };
}

async function getRentalEstimate(address: string) {
  try {
    const res = await fetch(
      `${RENTCAST_BASE}/avm/rent/long-term?address=${encodeURIComponent(address)}&propertyType=Single Family`,
      { headers: rentcastHeaders() },
    );
    if (!res.ok) return null;
    return await res.json();
  } catch { return null; }
}

async function getPropertyValue(address: string) {
  try {
    const res = await fetch(
      `${RENTCAST_BASE}/avm/value?address=${encodeURIComponent(address)}`,
      { headers: rentcastHeaders() },
    );
    if (!res.ok) return null;
    return await res.json();
  } catch { return null; }
}

async function tavilyRENews(): Promise<{ title: string; url: string; snippet: string }[]> {
  const key = process.env.TAVILY_API_KEY;
  if (!key) return [];
  try {
    const res = await fetch('https://api.tavily.com/search', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ api_key: key, query: 'real estate housing market news 2025', max_results: 5 }),
    });
    const data = await res.json();
    return (data.results ?? []).slice(0,5).map((r: { title: string; url: string; content: string }) => ({
      title: r.title, url: r.url, snippet: r.content?.slice(0,150),
    }));
  } catch { return []; }
}

export async function GET(req: NextRequest) {
  try {
    const news = await tavilyRENews();
    return NextResponse.json({
      ok: true,
      message: 'POST with {address} for property analysis',
      market_news: news,
      source: 'RentCast + Tavily',
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    return NextResponse.json({ error: err instanceof Error ? err.message : 'Server error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { address } = await req.json();
    if (!address?.trim()) return NextResponse.json({ error: 'address required' }, { status: 400 });

    const [rental, value, news] = await Promise.all([
      getRentalEstimate(address),
      getPropertyValue(address),
      tavilyRENews(),
    ]);

    return NextResponse.json({
      ok: true,
      address,
      rental_estimate: rental ? {
        rent_low:  rental.rentRangeLow,
        rent_mid:  rental.rent,
        rent_high: rental.rentRangeHigh,
        bedrooms:  rental.bedrooms,
      } : null,
      value_estimate: value ? {
        value_low:  value.valuationRangeLow,
        value_mid:  value.price,
        value_high: value.valuationRangeHigh,
      } : null,
      market_news: news,
      source: 'RentCast AVM + Tavily',
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    console.error('[/api/real-estate]', err);
    return NextResponse.json({ error: err instanceof Error ? err.message : 'Server error' }, { status: 500 });
  }
}
