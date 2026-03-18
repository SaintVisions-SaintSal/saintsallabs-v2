import { NextRequest } from 'next/server'
import { validateRequest, gatewayResponse, handleOptions } from '@/lib/gateway-auth'

export const runtime = 'edge'

export async function OPTIONS() { return handleOptions() }

export async function POST(req: NextRequest) {
  const auth = validateRequest(req)
  if (!auth.valid) return gatewayResponse({ error: auth.error }, 401)

  try {
    const { action, payload } = await req.json()
    if (!action) return gatewayResponse({ error: 'action required' }, 400)

    const GHL_API_KEY = process.env.GHL_API_KEY
    const GHL_LOCATION_ID = process.env.GHL_LOCATION_ID

    if (!GHL_API_KEY || !GHL_LOCATION_ID) {
      return gatewayResponse({ error: 'GHL not configured' }, 503)
    }

    const ghl = (method: string, path: string, body?: object) =>
      fetch(`https://services.leadconnectorhq.com${path}`, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${GHL_API_KEY}`,
          'Version': '2021-07-28',
        },
        body: body ? JSON.stringify(body) : undefined,
      }).then(r => r.json())

    switch (action) {
      case 'create_contact': {
        const { firstName, lastName, email, phone, tags } = payload
        const contact = await ghl('POST', '/contacts/', {
          firstName, lastName, email, phone,
          locationId: GHL_LOCATION_ID,
          tags: tags || [],
        })
        return gatewayResponse({ ok: true, contact })
      }

      case 'get_contact': {
        const contact = await ghl('GET', `/contacts/${payload.contactId}`)
        return gatewayResponse({ ok: true, contact })
      }

      case 'update_contact': {
        const { contactId, ...updates } = payload
        const contact = await ghl('PUT', `/contacts/${contactId}`, updates)
        return gatewayResponse({ ok: true, contact })
      }

      case 'add_tag': {
        const { contactId, tags } = payload
        const result = await ghl('POST', `/contacts/${contactId}/tags`, { tags })
        return gatewayResponse({ ok: true, result })
      }

      case 'create_opportunity': {
        const opp = await ghl('POST', '/opportunities/', {
          ...payload,
          locationId: GHL_LOCATION_ID,
        })
        return gatewayResponse({ ok: true, opportunity: opp })
      }

      case 'search_contacts': {
        const { query, limit = 20 } = payload
        const results = await ghl('GET', `/contacts/?locationId=${GHL_LOCATION_ID}&query=${encodeURIComponent(query)}&limit=${limit}`)
        return gatewayResponse({ ok: true, contacts: results.contacts || [], total: results.total })
      }

      default:
        return gatewayResponse({ error: `Unknown action: ${action}` }, 400)
    }

  } catch (err: any) {
    console.error('[MCP /crm]', err)
    return gatewayResponse({ error: 'CRM request failed', detail: err.message }, 500)
  }
}
