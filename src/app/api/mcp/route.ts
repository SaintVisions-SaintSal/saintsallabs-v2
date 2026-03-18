import { NextResponse } from 'next/server'

export const runtime = 'edge'

const ROUTES = {
  'POST /api/mcp/chat': {
    description: 'Multi-model AI chat — Claude, Gemini, Grok',
    auth: 'x-sal-key header required',
    body: { message: 'string', model: 'mini|pro|max|max_fast|gemini|grok', history: 'array?', system: 'string?' },
    models: {
      mini:     'Claude Haiku  — fast, cheap',
      pro:      'Claude Sonnet — balanced',
      max:      'Claude Opus   — smartest',
      max_fast: 'Claude Sonnet — parallel',
      gemini:   'Gemini 2.5 Pro / 2.0 Flash — Google',
      grok:     'Grok-3 — real-time X/web data',
    },
  },
  'POST /api/mcp/crm': {
    description: 'GoHighLevel CRM — contacts, tags, opportunities',
    auth: 'x-sal-key header required',
    actions: ['create_contact', 'get_contact', 'update_contact', 'add_tag', 'create_opportunity', 'search_contacts'],
  },
  'POST /api/mcp/broker': {
    description: 'Deal analyzer — lending qualification + real estate',
    auth: 'x-sal-key header required',
    actions: ['qualify_lead', 'analyze_deal', 'calc_payment'],
  },
  'POST /api/mcp/stripe': {
    description: 'Stripe billing — subscriptions, checkout, portal',
    auth: 'x-sal-key header required',
    actions: ['check_access', 'create_checkout', 'create_customer', 'get_customer', 'portal_session'],
  },
  'POST /api/mcp/search': {
    description: 'Web search — Exa + Tavily + Perplexity',
    auth: 'x-sal-key header required',
    body: { query: 'string', provider: 'auto|multi|exa|tavily|perplexity', options: '{ limit: number }' },
  },
}

export async function GET() {
  return NextResponse.json({
    name: 'SAL MCP Gateway',
    version: '2.0.0',
    status: 'live',
    base: 'https://saintsallabs.com/api/mcp',
    routes: ROUTES,
    usage: {
      curl: 'curl -X POST https://saintsallabs.com/api/mcp/chat -H "x-sal-key: YOUR_KEY" -H "Content-Type: application/json" -d \'{"message":"hello","model":"pro"}\'',
    },
  }, {
    headers: { 'Access-Control-Allow-Origin': '*' },
  })
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, x-sal-key',
    },
  })
}
