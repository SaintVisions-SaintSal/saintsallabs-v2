import { NextRequest } from 'next/server'
import { validateRequest, gatewayResponse, handleOptions } from '@/lib/gateway-auth'

export const runtime = 'edge'

export async function OPTIONS() { return handleOptions() }

const TIER_PRICE_MAP: Record<string, string> = {
  starter: process.env.STRIPE_PRICE_STARTER || '',
  pro:     process.env.STRIPE_PRICE_PRO || '',
  elite:   process.env.STRIPE_PRICE_ELITE || '',
}

export async function POST(req: NextRequest) {
  const auth = validateRequest(req)
  if (!auth.valid) return gatewayResponse({ error: auth.error }, 401)

  try {
    const { action, payload } = await req.json()
    if (!action) return gatewayResponse({ error: 'action required' }, 400)

    const STRIPE_KEY = process.env.STRIPE_SECRET_KEY
    if (!STRIPE_KEY) return gatewayResponse({ error: 'Stripe not configured' }, 503)

    const stripe = (method: string, path: string, body?: Record<string, any>) => {
      const params = body ? new URLSearchParams(flattenStripeParams(body)).toString() : undefined
      return fetch(`https://api.stripe.com/v1${path}`, {
        method,
        headers: {
          'Authorization': `Bearer ${STRIPE_KEY}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: params,
      }).then(r => r.json())
    }

    switch (action) {
      case 'check_access': {
        const { customerId, requiredTier } = payload
        const subs = await stripe('GET', `/subscriptions?customer=${customerId}&status=active&limit=10`)
        const activeSubs = subs.data || []

        const tierPriority: Record<string, number> = { starter: 1, pro: 2, elite: 3 }
        const required = tierPriority[requiredTier] || 1

        let hasAccess = false
        let currentTier = 'none'

        for (const sub of activeSubs) {
          for (const item of sub.items?.data || []) {
            for (const [tier, priceId] of Object.entries(TIER_PRICE_MAP)) {
              if (item.price?.id === priceId && tierPriority[tier] >= required) {
                hasAccess = true
                currentTier = tier
              }
            }
          }
        }

        return gatewayResponse({
          ok: true,
          hasAccess,
          currentTier,
          requiredTier,
          upgradeLink: hasAccess ? null : `${process.env.NEXT_PUBLIC_APP_URL || 'https://saintsallabs.com'}/upgrade`,
        })
      }

      case 'create_checkout': {
        const { customerId, tier, successUrl, cancelUrl } = payload
        const priceId = TIER_PRICE_MAP[tier]
        if (!priceId) return gatewayResponse({ error: `Unknown tier: ${tier}` }, 400)

        const session = await stripe('POST', '/checkout/sessions', {
          customer: customerId,
          mode: 'subscription',
          'line_items[0][price]': priceId,
          'line_items[0][quantity]': '1',
          success_url: successUrl || 'https://saintsallabs.com/dashboard?upgraded=true',
          cancel_url: cancelUrl || 'https://saintsallabs.com/upgrade',
        })
        return gatewayResponse({ ok: true, url: session.url, sessionId: session.id })
      }

      case 'get_customer': {
        const customer = await stripe('GET', `/customers/${payload.customerId}`)
        return gatewayResponse({ ok: true, customer })
      }

      case 'create_customer': {
        const { email, name, metadata } = payload
        const customer = await stripe('POST', '/customers', { email, name, ...metadata })
        return gatewayResponse({ ok: true, customer })
      }

      case 'portal_session': {
        const { customerId, returnUrl } = payload
        const session = await stripe('POST', '/billing_portal/sessions', {
          customer: customerId,
          return_url: returnUrl || 'https://saintsallabs.com/dashboard',
        })
        return gatewayResponse({ ok: true, url: session.url })
      }

      default:
        return gatewayResponse({ error: `Unknown action: ${action}` }, 400)
    }

  } catch (err: any) {
    console.error('[MCP /stripe]', err)
    return gatewayResponse({ error: 'Stripe request failed', detail: err.message }, 500)
  }
}

// Stripe wants flat key=value pairs, not JSON
function flattenStripeParams(obj: Record<string, any>, prefix = ''): Record<string, string> {
  const result: Record<string, string> = {}
  for (const [key, val] of Object.entries(obj)) {
    const k = prefix ? `${prefix}[${key}]` : key
    if (val !== null && val !== undefined) {
      result[k] = String(val)
    }
  }
  return result
}
