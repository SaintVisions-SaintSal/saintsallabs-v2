/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest } from 'next/server'
import { validateRequest, gatewayResponse, handleOptions } from '@/lib/gateway-auth'

export const runtime = 'edge'

export async function OPTIONS() { return handleOptions() }

export async function POST(req: NextRequest) {
  const auth = validateRequest(req)
  if (!auth.valid) return gatewayResponse({ error: auth.error }, 401)

  try {
    const { query, provider = 'auto', options = {} } = await req.json()
    if (!query) return gatewayResponse({ error: 'query required' }, 400)

    const { limit = 5 } = options

    // Auto-select best available provider
    if (provider === 'auto' || provider === 'multi') {
      return runMultiSearch(query, limit)
    }
    if (provider === 'exa')       return runExa(query, limit)
    if (provider === 'tavily')    return runTavily(query, limit)
    if (provider === 'perplexity') return runPerplexity(query)

    return gatewayResponse({ error: `Unknown provider: ${provider}` }, 400)

  } catch (err: any) {
    console.error('[MCP /search]', err)
    return gatewayResponse({ error: 'Search failed', detail: err.message }, 500)
  }
}

async function runMultiSearch(query: string, limit: number) {
  const results = await Promise.allSettled([
    process.env.EXA_API_KEY    ? runExa(query, limit).then(r => r.json())    : Promise.reject('no key'),
    process.env.TAVILY_API_KEY ? runTavily(query, limit).then(r => r.json()) : Promise.reject('no key'),
  ])

  const combined: any[] = []
  for (const r of results) {
    if (r.status === 'fulfilled' && r.value?.results) {
      combined.push(...r.value.results)
    }
  }

  // Deduplicate by URL
  const seen = new Set<string>()
  const deduped = combined.filter(r => {
    if (seen.has(r.url)) return false
    seen.add(r.url)
    return true
  }).slice(0, limit * 2)

  return gatewayResponse({ ok: true, query, results: deduped, provider: 'multi', count: deduped.length })
}

async function runExa(query: string, limit: number) {
  const EXA_KEY = process.env.EXA_API_KEY
  if (!EXA_KEY) return gatewayResponse({ error: 'EXA_API_KEY not configured' }, 503)

  const res = await fetch('https://api.exa.ai/search', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'x-api-key': EXA_KEY },
    body: JSON.stringify({ query, numResults: limit, useAutoprompt: true, contents: { text: { maxCharacters: 500 } } }),
  })
  const data = await res.json()
  const results = (data.results || []).map((r: any) => ({
    title: r.title,
    url: r.url,
    snippet: r.text?.slice(0, 300) || '',
    score: r.score,
    publishedDate: r.publishedDate,
  }))
  return gatewayResponse({ ok: true, query, results, provider: 'exa', count: results.length })
}

async function runTavily(query: string, limit: number) {
  const TAVILY_KEY = process.env.TAVILY_API_KEY
  if (!TAVILY_KEY) return gatewayResponse({ error: 'TAVILY_API_KEY not configured' }, 503)

  const res = await fetch('https://api.tavily.com/search', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ api_key: TAVILY_KEY, query, max_results: limit, search_depth: 'basic' }),
  })
  const data = await res.json()
  const results = (data.results || []).map((r: any) => ({
    title: r.title,
    url: r.url,
    snippet: r.content?.slice(0, 300) || '',
    score: r.score,
  }))
  return gatewayResponse({ ok: true, query, results, provider: 'tavily', count: results.length })
}

async function runPerplexity(query: string) {
  const PERP_KEY = process.env.PERPLEXITY_API_KEY
  if (!PERP_KEY) return gatewayResponse({ error: 'PERPLEXITY_API_KEY not configured' }, 503)

  const res = await fetch('https://api.perplexity.ai/chat/completions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${PERP_KEY}` },
    body: JSON.stringify({
      model: 'llama-3.1-sonar-small-128k-online',
      messages: [{ role: 'user', content: query }],
      max_tokens: 1000,
    }),
  })
  const data = await res.json()
  const answer = data.choices?.[0]?.message?.content || ''
  const citations = data.citations || []
  return gatewayResponse({
    ok: true, query,
    results: [{ title: 'Perplexity Answer', url: '', snippet: answer, citations }],
    provider: 'perplexity',
    count: 1,
  })
}
