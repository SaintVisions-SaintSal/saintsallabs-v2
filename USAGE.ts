/* eslint-disable @typescript-eslint/no-unused-vars */
// ============================================================
// SAL MCP GATEWAY — saintsallabs-v2
// One URL. One key. Everything unlocked.
// ============================================================

// All examples are wrapped in an async function for TS compatibility.
// Copy + paste any snippet into your own async context.

async function examples() {
  const GATEWAY = 'https://saintsallabs.com/api/mcp'
  const KEY      = process.env.SAL_GATEWAY_SECRET  // x-sal-key header

  async function sal(route: string, body: object) {
    const res = await fetch(`${GATEWAY}/${route}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-sal-key': KEY! },
      body: JSON.stringify(body),
    })
    return res.json()
  }

  // ============================================================
  // CHAT — All AI models through one endpoint
  // ============================================================

  // Model options:
  // mini     = Claude Haiku  (fast, cheap)
  // pro      = Claude Sonnet (balanced)
  // max      = Claude Opus   (smartest)
  // max_fast = Claude Sonnet (parallel)
  // gemini   = Gemini 2.5 Pro / 2.0 Flash (Google)
  // grok     = Grok-3 (real-time X/web data)

  const reply = await sal('chat', { message: 'Analyze this deal', model: 'pro' })
  console.log(reply.response)

  // Gemini direct
  const gemini = await sal('chat', { message: 'Latest cap rates?', model: 'gemini' })

  // Grok direct (real-time data)
  const grok = await sal('chat', { message: 'What happened today in rates?', model: 'grok' })

  // With conversation history
  const ctx = await sal('chat', {
    message: 'Follow up question',
    model: 'pro',
    history: [
      { role: 'user', content: 'Previous question' },
      { role: 'assistant', content: 'Previous answer' },
    ],
    system: 'You are a lending expert.',
  })

  // Test models:
  // curl https://saintsallabs.com/api/mcp/chat \
  //   -H "x-sal-key: saintvision_gateway_2025" \
  //   -H "Content-Type: application/json" \
  //   -d '{"message":"say hi","model":"gemini"}'
  //
  // curl https://saintsallabs.com/api/mcp/chat \
  //   -H "x-sal-key: saintvision_gateway_2025" \
  //   -H "Content-Type: application/json" \
  //   -d '{"message":"say hi","model":"grok"}'

  // ============================================================
  // CRM — GoHighLevel
  // ============================================================
  const contact = await sal('crm', {
    action: 'create_contact',
    payload: {
      firstName: 'Ryan',
      lastName: 'Smith',
      email: 'ryan@example.com',
      phone: '+19491234567',
      tags: ['snapshot-inquiry', 'pro-tier'],
    }
  })

  const search = await sal('crm', {
    action: 'search_contacts',
    payload: { query: 'ryan@example.com', limit: 5 }
  })

  // ============================================================
  // BROKER — Deal Analysis & Lead Qualification
  // ============================================================
  const qual = await sal('broker', {
    action: 'qualify_lead',
    payload: {
      businessName: 'Acme Roofing',
      loanAmount: 150000,
      timeInBusiness: 36,
      creditScore: 680,
      monthlyRevenue: 45000,
      useOfFunds: 'equipment',
    }
  })
  // → { leadScore: 95, tier: 'A', products: [...], nextStep: 'send_application' }

  const deal = await sal('broker', {
    action: 'analyze_deal',
    payload: {
      purchasePrice: 1200000,
      noi: 84000,
      grossRent: 9000,
      expenses: 26000,
      downPayment: 300000,
      interestRate: 7.5,
      loanTerm: 30,
      annualDebtService: 62400,
    }
  })
  // → { capRate: '7.00%', cashOnCash: '7.20%', dscr: '1.35', verdict: 'DEAL' }

  // ============================================================
  // STRIPE — Subscription & Billing
  // ============================================================
  const access = await sal('stripe', {
    action: 'check_access',
    payload: { customerId: 'cus_xxx', requiredTier: 'pro' }
  })
  if (!access.hasAccess) console.log('Upgrade at:', access.upgradeLink)

  const checkout = await sal('stripe', {
    action: 'create_checkout',
    payload: { customerId: 'cus_xxx', tier: 'pro' }
  })

  // ============================================================
  // SEARCH — Multi-provider web search
  // ============================================================
  const results = await sal('search', {
    query: 'commercial real estate cap rates 2025 California',
    provider: 'multi',
    options: { limit: 5 }
  })
  // provider options: 'auto' | 'multi' | 'exa' | 'tavily' | 'perplexity'
}

// ============================================================
// ENV VARS NEEDED (Vercel → Settings → Environment Variables)
// ============================================================
// SAL_GATEWAY_SECRET     — shared secret for x-sal-key header
// SAL_ENGINE_URL         — https://saintsallabs-api.onrender.com
// SAL_ENGINE_SECRET      — internal SAL Engine auth
// ANTHROPIC_API_KEY      — Claude models
// GEMINI_API_KEY         — Gemini 2.0/2.5
// XAI_API_KEY            — Grok-3
// GHL_API_KEY            — GoHighLevel CRM
// GHL_LOCATION_ID        — GHL sub-account ID
// STRIPE_SECRET_KEY      — Stripe payments
// STRIPE_PRICE_STARTER   — Stripe price ID for starter tier
// STRIPE_PRICE_PRO       — Stripe price ID for pro tier
// STRIPE_PRICE_ELITE     — Stripe price ID for elite tier
// EXA_API_KEY            — Exa search
// TAVILY_API_KEY         — Tavily search
// PERPLEXITY_API_KEY     — Perplexity search

export { examples }
