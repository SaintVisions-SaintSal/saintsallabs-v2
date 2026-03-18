import { NextRequest } from 'next/server'
import { validateRequest, gatewayResponse, handleOptions } from '@/lib/gateway-auth'

export const runtime = 'edge'

export async function OPTIONS() { return handleOptions() }

export async function POST(req: NextRequest) {
  const auth = validateRequest(req)
  if (!auth.valid) return gatewayResponse({ error: auth.error }, 401)

  try {
    const { query = 'latest news', limit = 5 } = await req.json()

    // Try Perplexity first (best for real-time news)
    const perplexityKey = process.env.PERPLEXITY_API_KEY
    if (perplexityKey) {
      const res = await fetch('https://api.perplexity.ai/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${perplexityKey}`,
        },
        body: JSON.stringify({
          model: 'sonar',
          messages: [{ role: 'user', content: `Give me the top ${limit} news stories about: ${query}. Return as JSON array with fields: title, summary, source, url` }],
          max_tokens: 1000,
        }),
      })
      if (res.ok) {
        const data = await res.json()
        const text = data.choices?.[0]?.message?.content || ''
        return gatewayResponse({ ok: true, query, results: text, provider: 'perplexity', citations: data.citations || [] })
      }
    }

    // Fallback: Tavily news search
    const tavilyKey = process.env.TAVILY_API_KEY
    if (tavilyKey) {
      const res = await fetch('https://api.tavily.com/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          api_key: tavilyKey,
          query,
          search_depth: 'basic',
          topic: 'news',
          max_results: limit,
        }),
      })
      if (res.ok) {
        const data = await res.json()
        return gatewayResponse({ ok: true, query, results: data.results || [], provider: 'tavily' })
      }
    }

    return gatewayResponse({ error: 'No search provider available' }, 503)

  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err)
    return gatewayResponse({ error: 'News fetch failed', detail: msg }, 500)
  }
}

export async function GET(req: NextRequest) {
  const auth = validateRequest(req)
  if (!auth.valid) return gatewayResponse({ error: auth.error }, 401)

  const { searchParams } = new URL(req.url)
  const query = searchParams.get('q') || 'latest news'
  const limit = parseInt(searchParams.get('limit') || '5')

  const mockReq = new Request(req.url, {
    method: 'POST',
    headers: req.headers,
    body: JSON.stringify({ query, limit }),
  })
  return POST(mockReq as NextRequest)
}
