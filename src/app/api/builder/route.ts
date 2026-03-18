import { NextRequest } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { checkAndMeter } from '@/lib/sal-admin';
import { BUILDER_SYSTEM_PROMPT } from '@/config/verticals';

interface BuilderRequestBody {
  prompt: string;
  files?: { name: string; lang: string; content: string }[];
  framework?: string;
}

export async function POST(req: NextRequest) {
  // Auth + metering
  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { getAll: () => cookieStore.getAll(), setAll: () => {} } }
  );
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return new Response(JSON.stringify({ error: 'Not authenticated' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const meter = await checkAndMeter(user.id);
  if (!meter.allowed) {
    return new Response(
      JSON.stringify({ error: meter.error || 'Request limit reached', upgrade: '/pricing' }),
      { status: 402, headers: { 'Content-Type': 'application/json' } }
    );
  }

  const geminiKey = process.env.GEMINI_API_KEY;
  const anthropicKey = process.env.ANTHROPIC_API_KEY;

  if (!geminiKey && !anthropicKey) {
    return new Response('No AI API key configured', { status: 500 });
  }

  let body: BuilderRequestBody;
  try {
    body = await req.json();
  } catch {
    return new Response('Invalid JSON body', { status: 400 });
  }

  const { prompt, files, framework } = body;

  if (!prompt || typeof prompt !== 'string') {
    return new Response('prompt is required', { status: 400 });
  }

  // Build context from existing files
  let fileContext = '';
  if (files && files.length > 0) {
    fileContext =
      '\n\nExisting project files:\n' +
      files
        .map((f) => `--- ${f.name} ---\n${f.content}`)
        .join('\n\n');
  }

  const frameworkHint = framework
    ? `\nTarget framework: ${framework}.`
    : '';

  const userMessage = `${prompt}${frameworkHint}${fileContext}

IMPORTANT: Return all code files as markdown code blocks with filenames. Example:
\`\`\`tsx App.tsx
// code here
\`\`\``;

  // Pro+ gets gemini-2.5-pro, mini gets flash
  const useProModel = meter.compute_tier !== 'mini';

  if (geminiKey) {
    return streamGeminiBuilder(userMessage, geminiKey, useProModel);
  }
  return streamAnthropicBuilder(userMessage, anthropicKey!, useProModel);
}

/* ─── Gemini streaming ───────────────────────────────────────── */

async function streamGeminiBuilder(userMessage: string, apiKey: string, pro: boolean) {
  const model = pro ? 'gemini-2.5-pro-preview-06-05' : 'gemini-2.0-flash';
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:streamGenerateContent?alt=sse&key=${apiKey}`;

  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      systemInstruction: { parts: [{ text: BUILDER_SYSTEM_PROMPT }] },
      contents: [{ role: 'user', parts: [{ text: userMessage }] }],
      generationConfig: { maxOutputTokens: 16384, temperature: 0.4 },
    }),
  });

  if (!response.ok) {
    const errText = await response.text().catch(() => 'Unknown error');
    return new Response(`Gemini API error: ${errText}`, { status: response.status });
  }

  if (!response.body) {
    return new Response('No response body from Gemini', { status: 502 });
  }

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
              const text = parsed.candidates?.[0]?.content?.parts?.[0]?.text;
              if (text) {
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
      'Cache-Control': 'no-cache',
      Connection: 'keep-alive',
    },
  });
}

/* ─── Anthropic streaming (fallback) ─────────────────────────── */

async function streamAnthropicBuilder(userMessage: string, apiKey: string, pro: boolean) {
  const model = pro ? 'claude-sonnet-4-6-20250514' : 'claude-haiku-4-5-20251001';
  const anthropicRes = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model,
      max_tokens: 8192,
      stream: true,
      system: BUILDER_SYSTEM_PROMPT,
      messages: [{ role: 'user', content: userMessage }],
    }),
  });

  if (!anthropicRes.ok) {
    const errText = await anthropicRes.text().catch(() => 'Unknown error');
    return new Response(`Anthropic API error: ${errText}`, { status: anthropicRes.status });
  }

  if (!anthropicRes.body) {
    return new Response('No response body from Anthropic', { status: 502 });
  }

  const encoder = new TextEncoder();
  const decoder = new TextDecoder();

  const stream = new ReadableStream({
    async start(controller) {
      const reader = anthropicRes.body!.getReader();
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
            if (!trimmed) continue;

            if (trimmed.startsWith('data: ')) {
              controller.enqueue(encoder.encode(trimmed + '\n\n'));
            }
          }
        }

        controller.enqueue(encoder.encode('data: [DONE]\n\n'));
      } catch (e) {
        const msg = e instanceof Error ? e.message : 'Stream error';
        controller.enqueue(
          encoder.encode(
            `data: ${JSON.stringify({ type: 'error', error: { message: msg } })}\n\n`,
          ),
        );
      } finally {
        controller.close();
        reader.releaseLock();
      }
    },
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      Connection: 'keep-alive',
    },
  });
}
