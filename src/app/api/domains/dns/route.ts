import { NextRequest, NextResponse } from 'next/server';

const GODADDY_API = 'https://api.godaddy.com/v1';

function headers() {
  return {
    Authorization: `sso-key ${process.env.GODADDY_API_KEY}:${process.env.GODADDY_API_SECRET}`,
    'Content-Type': 'application/json',
  };
}

/* ─── GET: List DNS records for a domain ───────────────────── */

export async function GET(req: NextRequest) {
  const domain = req.nextUrl.searchParams.get('domain');

  if (!domain) {
    return NextResponse.json(
      { error: 'Missing domain parameter' },
      { status: 400 },
    );
  }

  try {
    const res = await fetch(
      `${GODADDY_API}/domains/${encodeURIComponent(domain)}/records`,
      { headers: headers() },
    );

    if (!res.ok) {
      const err = await res.json();
      return NextResponse.json(
        { error: err.message ?? 'Failed to fetch DNS records' },
        { status: res.status },
      );
    }

    const records = await res.json();
    return NextResponse.json({ domain, records });
  } catch (error) {
    console.error('GoDaddy DNS fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch DNS records' },
      { status: 500 },
    );
  }
}

/* ─── PUT: Update DNS records for a domain ─────────────────── */

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const { domain, records } = body;

    if (!domain || !records) {
      return NextResponse.json(
        { error: 'Missing domain or records' },
        { status: 400 },
      );
    }

    const res = await fetch(
      `${GODADDY_API}/domains/${encodeURIComponent(domain)}/records`,
      {
        method: 'PUT',
        headers: headers(),
        body: JSON.stringify(records),
      },
    );

    if (!res.ok) {
      const err = await res.json();
      return NextResponse.json(
        { error: err.message ?? 'Failed to update DNS records' },
        { status: res.status },
      );
    }

    return NextResponse.json({ success: true, domain });
  } catch (error) {
    console.error('GoDaddy DNS update error:', error);
    return NextResponse.json(
      { error: 'Failed to update DNS records' },
      { status: 500 },
    );
  }
}
