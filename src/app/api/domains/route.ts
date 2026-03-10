import { NextRequest, NextResponse } from 'next/server';

const GODADDY_API = 'https://api.godaddy.com/v1';

function headers() {
  return {
    Authorization: `sso-key ${process.env.GODADDY_API_KEY}:${process.env.GODADDY_API_SECRET}`,
    'Content-Type': 'application/json',
  };
}

/* ─── GET: Search available domains ────────────────────────── */

export async function GET(req: NextRequest) {
  const domain = req.nextUrl.searchParams.get('domain');

  if (!domain) {
    return NextResponse.json(
      { error: 'Missing domain parameter' },
      { status: 400 },
    );
  }

  try {
    // Check exact availability
    const availRes = await fetch(
      `${GODADDY_API}/domains/available?domain=${encodeURIComponent(domain)}`,
      { headers: headers() },
    );
    const availability = await availRes.json();

    // Get suggestions
    const suggestRes = await fetch(
      `${GODADDY_API}/domains/suggest?query=${encodeURIComponent(domain.split('.')[0])}&limit=6`,
      { headers: headers() },
    );
    const suggestions = await suggestRes.json();

    return NextResponse.json({
      domain: availability.domain ?? domain,
      available: availability.available ?? false,
      price: availability.price
        ? (availability.price / 1_000_000).toFixed(2)
        : null,
      currency: availability.currency ?? 'USD',
      suggestions: Array.isArray(suggestions)
        ? suggestions.map((s: { domain: string }) => s.domain)
        : [],
    });
  } catch (error) {
    console.error('GoDaddy search error:', error);
    return NextResponse.json(
      { error: 'Failed to search domains' },
      { status: 500 },
    );
  }
}

/* ─── POST: Register a domain ──────────────────────────────── */

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { domain, contact } = body;

    if (!domain) {
      return NextResponse.json(
        { error: 'Missing domain' },
        { status: 400 },
      );
    }

    const purchaseBody = {
      domain,
      consent: {
        agreedAt: new Date().toISOString(),
        agreedBy: contact?.email ?? 'user@saintsallabs.com',
        agreementKeys: ['DNRA'],
      },
      contactAdmin: contact,
      contactBilling: contact,
      contactRegistrant: contact,
      contactTech: contact,
      period: 1,
      privacy: true,
      renewAuto: true,
    };

    const res = await fetch(`${GODADDY_API}/domains/purchase`, {
      method: 'POST',
      headers: headers(),
      body: JSON.stringify(purchaseBody),
    });

    const data = await res.json();

    if (!res.ok) {
      return NextResponse.json(
        { error: data.message ?? 'Registration failed' },
        { status: res.status },
      );
    }

    return NextResponse.json({
      success: true,
      orderId: data.orderId,
      domain,
    });
  } catch (error) {
    console.error('GoDaddy registration error:', error);
    return NextResponse.json(
      { error: 'Failed to register domain' },
      { status: 500 },
    );
  }
}
