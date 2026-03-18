/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest } from 'next/server'
import { validateRequest, gatewayResponse, handleOptions } from '@/lib/gateway-auth'

export const runtime = 'edge'

export async function OPTIONS() { return handleOptions() }

// Model map → primary Claude + fallback
// mini     → claude-haiku-4-5-20251001  (fallback: gemini-2.0-flash)
// pro      → claude-sonnet-4-6          (fallback: grok-3)
// max      → claude-opus-4-6            (fallback: gemini-2.5-pro)
// max_fast → claude-sonnet-4-6          (fallback: grok-3-fast)
// gemini   → gemini-2.0-flash / 2.5-pro (direct)
// grok     → grok-3                     (direct)

const CLAUDE_MODEL_MAP: Record<string, string> = {
  mini:     'claude-haiku-4-5-20251001',
  pro:      'claude-sonnet-4-6',
  max:      'claude-opus-4-6',
  max_fast: 'claude-sonnet-4-6',
}

const FALLBACK_MAP: Record<string, 'gemini' | 'grok'> = {
  mini:     'gemini',
  pro:      'grok',
  max:      'gemini',
  max_fast: 'grok',
}

export async function POST(req: NextRequest) {
  const auth = validateRequest(req)
  if (!auth.valid) return gatewayResponse({ error: auth.error }, 401)

  try {
    const { message, model = 'pro', history = [], system, verticals } = await req.json()
    if (!message) return gatewayResponse({ error: 'message required' }, 400)

    const resolvedSystem = system || buildSystemPrompt(verticals)

    // Direct provider routes
    if (model === 'gemini') return callGeminiDirect(message, model, history, resolvedSystem)
    if (model === 'grok')   return callGrokDirect(message, model, history, resolvedSystem)

    // Try SAL Engine first, then cascade
    try {
      const salRes = await fetch(`${process.env.SAL_ENGINE_URL}/api/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.SAL_ENGINE_SECRET}`,
        },
        body: JSON.stringify({ message, model, history, system: resolvedSystem, stream: false }),
      })
      if (salRes.ok) {
        const data = await salRes.json()
        return gatewayResponse({ ok: true, response: data.response, model: data.model_used, tokens: data.tokens })
      }
    } catch { /* SAL Engine unreachable — cascade */ }

    return callWithCascade(message, model, history, resolvedSystem)

  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err)
    console.error('[MCP /chat]', err)
    return gatewayResponse({ error: 'Chat failed', detail: msg }, 500)
  }
}

async function callWithCascade(message: string, model: string, history: any[], system: string) {
  // 1. Claude direct
  try {
    return await callClaudeDirect(message, model, history, system)
  } catch { console.warn('[MCP /chat] Claude failed, trying fallback...') }

  // 2. Primary fallback (Gemini or Grok based on tier)
  const fallback = FALLBACK_MAP[model] || 'gemini'
  try {
    if (fallback === 'gemini') return await callGeminiDirect(message, model, history, system)
    if (fallback === 'grok')   return await callGrokDirect(message, model, history, system)
  } catch { console.warn(`[MCP /chat] ${fallback} failed, trying final fallback...`) }

  // 3. Final fallback (opposite)
  try {
    if (fallback === 'gemini') return await callGrokDirect(message, model, history, system)
    return await callGeminiDirect(message, model, history, system)
  } catch { console.error('[MCP /chat] All providers failed') }

  return gatewayResponse({ error: 'All AI providers failed', model }, 503)
}

async function callClaudeDirect(message: string, model: string, history: any[], system?: string) {
  const claudeModel = CLAUDE_MODEL_MAP[model] || CLAUDE_MODEL_MAP.pro
  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': process.env.ANTHROPIC_API_KEY!,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: claudeModel,
      max_tokens: 2000,
      system: system || 'You are SAL, the SaintSal Labs AI assistant. Be concise, sharp, and expert.',
      messages: [...history, { role: 'user', content: message }],
    }),
  })
  const data = await res.json()
  if (!res.ok) throw new Error(`Claude error: ${data.error?.message || res.status}`)
  const response = data.content?.[0]?.text || 'No response'
  return gatewayResponse({ ok: true, response, model: claudeModel, fallback: false })
}

async function callGeminiDirect(message: string, model: string, history: any[], system?: string) {
  const geminiModel = model === 'max' ? 'gemini-2.5-pro' : 'gemini-2.0-flash'
  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${geminiModel}:generateContent?key=${process.env.GEMINI_API_KEY}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        system_instruction: { parts: [{ text: system || 'You are SAL, the SaintSal Labs AI.' }] },
        contents: [
          ...history.map((m: any) => ({ role: m.role === 'assistant' ? 'model' : 'user', parts: [{ text: m.content }] })),
          { role: 'user', parts: [{ text: message }] },
        ],
        generationConfig: { maxOutputTokens: 2000, temperature: 0.7 },
      }),
    }
  )
  const data = await res.json()
  if (!res.ok) throw new Error(`Gemini error: ${data.error?.message || res.status}`)
  const response = data.candidates?.[0]?.content?.parts?.[0]?.text || 'No response'
  return gatewayResponse({ ok: true, response, model: geminiModel, fallback: true })
}

async function callGrokDirect(message: string, model: string, history: any[], system?: string) {
  const grokModel = model === 'max_fast' ? 'grok-3-fast' : 'grok-3'
  const res = await fetch('https://api.x.ai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.XAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: grokModel,
      messages: [
        { role: 'system', content: system || 'You are SAL, the SaintSal Labs AI.' },
        ...history,
        { role: 'user', content: message },
      ],
      max_tokens: 2000,
      temperature: 0.7,
    }),
  })
  const data = await res.json()
  if (!res.ok) throw new Error(`Grok error: ${data.error?.message || res.status}`)
  const response = data.choices?.[0]?.message?.content || 'No response'
  return gatewayResponse({ ok: true, response, model: grokModel, fallback: true })
}

function buildSystemPrompt(verticals?: string[]) {
  const base = 'You are SAL, the SaintSal Labs AI. You are expert, direct, and actionable.'
  if (!verticals?.length) return base
  return `${base} Focus on: ${verticals.join(', ')}.`
}
