import { NextRequest } from 'next/server';

export const runtime = 'edge';

/* ─── Gemini streaming chat — primary AI backend ─────────────── */

export async function POST(req: NextRequest) {
  try {
    const { messages, systemPrompt, model } = await req.json();

    if (!messages || !Array.isArray(messages)) {
      return new Response('Missing messages array', { status: 400 });
    }

    /* ── Try Gemini first (live key), fall back to Anthropic ─── */
    const geminiKey = process.env.GEMINI_API_KEY;
    const anthropicKey = process.env.ANTHROPIC_API_KEY;

    if (geminiKey) {
      return streamGemini({ messages, systemPrompt, model, apiKey: geminiKey });
    }
    if (anthropicKey) {
      return streamAnthropic({ messages, systemPrompt, model, apiKey: anthropicKey });
    }

    return new Response('No AI API key configured (GEMINI_API_KEY or ANTHROPIC_API_KEY)', {
      status: 500,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Internal server error';
    return new Response(message, { status: 500 });
  }
}

/* ─── Gemini streaming ───────────────────────────────────────── */

interface ChatPayload {
  messages: { role: string; content: string }[];
  systemPrompt?: string;
  model?: string;
  apiKey: string;
}

async function streamGemini({ messages, systemPrompt, model, apiKey }: ChatPayload) {
  // Map SAL tiers → Gemini models
  const modelMap: Record<string, string> = {
    'SAL Mini': 'gemini-2.0-flash',
    'SAL Pro': 'gemini-2.5-pro-preview-06-05',
    'SAL Max': 'gemini-2.5-pro-preview-06-05',
    'SAL Max Fast': 'gemini-2.0-flash',
  };
  const geminiModel = modelMap[model ?? ''] ?? 'gemini-2.0-flash';

  // Convert messages to Gemini format
  const contents = messages.map((m: { role: string; content: string }) => ({
    role: m.role === 'assistant' ? 'model' : 'user',
    parts: [{ text: m.content }],
  }));

  const body: Record<string, unknown> = {
    contents,
    generationConfig: {
      maxOutputTokens: 8192,
      temperature: 0.7,
    },
  };

  if (systemPrompt) {
    body.systemInstruction = { parts: [{ text: systemPrompt }] };
  }

  const url = `https://generativelanguage.googleapis.com/v1beta/models/${geminiModel}:streamGenerateContent?alt=sse&key=${apiKey}`;

  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const errText = await response.text().catch(() => 'Unknown error');
    return new Response(`Gemini API error ${response.status}: ${errText}`, {
      status: response.status,
    });
  }

  if (!response.body) {
    return new Response('No response body from Gemini', { status: 502 });
  }

  // Transform Gemini SSE → our normalized SSE format
  const encoder = new TextEncoder();
  const decoder = new TextDecoder();

  const stream = new ReadableStream({
    async start(controller) {
      const reader = response.body!.getReader();
      let buffer = '';

      try {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split('\n');
          buffer = lines.pop() ?? '';

          for (const line of lines) {
            const trimmed = line.trim();
            if (!trimmed || !trimmed.startsWith('data: ')) continue;

            const data = trimmed.slice(6);
            if (data === '[DONE]') continue;

            try {
              const parsed = JSON.parse(data);
              const text =
                parsed.candidates?.[0]?.content?.parts?.[0]?.text;
              if (text) {
                // Emit in Anthropic-compatible format so salStream() client works unchanged
                controller.enqueue(
                  encoder.encode(
                    `data: ${JSON.stringify({ type: 'content_block_delta', delta: { text } })}\n\n`,
                  ),
                );
              }
            } catch {
              // Skip non-JSON
            }
          }
        }

        controller.enqueue(encoder.encode('data: [DONE]\n\n'));
      } catch {
        // Client disconnected
      } finally {
        controller.close();
        reader.releaseLock();
      }
    },
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache, no-transform',
      Connection: 'keep-alive',
    },
  });
}

/* ─── Anthropic streaming (fallback) ─────────────────────────── */

async function streamAnthropic({ messages, systemPrompt, model, apiKey }: ChatPayload) {
  const modelMap: Record<string, string> = {
    'SAL Mini': 'claude-haiku-4-5-20251001',
    'SAL Pro': 'claude-sonnet-4-6-20250514',
    'SAL Max': 'claude-opus-4-6-20250630',
    'SAL Max Fast': 'claude-sonnet-4-6-20250514',
  };
  const anthropicModel = modelMap[model ?? ''] ?? 'claude-sonnet-4-6-20250514';

  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: anthropicModel,
      max_tokens: 4096,
      stream: true,
      system: systemPrompt || undefined,
      messages: messages.map((m: { role: string; content: string }) => ({
        role: m.role,
        content: m.content,
      })),
    }),
  });

  if (!response.ok) {
    const errText = await response.text().catch(() => 'Unknown error');
    return new Response(`Anthropic API error ${response.status}: ${errText}`, {
      status: response.status,
    });
  }

  if (!response.body) {
    return new Response('No response body from Anthropic', { status: 502 });
  }

  const { readable, writable } = new TransformStream();
  const writer = writable.getWriter();
  const reader = response.body.getReader();
  const encoder = new TextEncoder();

  (async () => {
    try {
      while (true) {
        const { done, value } = await reader.read();
        if (done) {
          await writer.write(encoder.encode('data: [DONE]\n\n'));
          break;
        }
        await writer.write(value);
      }
    } catch {
      // Client disconnected
    } finally {
      await writer.close().catch(() => {});
    }
  })();

  return new Response(readable, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache, no-transform',
      Connection: 'keep-alive',
    },
  });
}
