import type { Message } from '@/types';

interface SalStreamOptions {
  messages: Message[];
  systemPrompt: string;
  onChunk: (text: string) => void;
  onDone: () => void;
  model?: string;
  signal?: AbortSignal;
}

export async function salStream({
  messages,
  systemPrompt,
  onChunk,
  onDone,
  model,
  signal,
}: SalStreamOptions): Promise<void> {
  const res = await fetch('/api/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ messages, systemPrompt, model }),
    signal,
  });

  if (!res.ok) {
    const err = await res.text().catch(() => 'Unknown error');
    throw new Error(`Chat API error ${res.status}: ${err}`);
  }

  if (!res.body) {
    throw new Error('No response body');
  }

  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  let buffer = '';

  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });

      const lines = buffer.split('\n');
      // Keep the last (potentially incomplete) line in the buffer
      buffer = lines.pop() ?? '';

      for (const line of lines) {
        const trimmed = line.trim();
        if (!trimmed || !trimmed.startsWith('data: ')) continue;

        const data = trimmed.slice(6);
        if (data === '[DONE]') {
          onDone();
          return;
        }

        try {
          const parsed = JSON.parse(data);

          // Handle Anthropic SSE format
          if (parsed.type === 'content_block_delta' && parsed.delta?.text) {
            onChunk(parsed.delta.text);
          }

          // Handle generic text delta format
          if (parsed.text) {
            onChunk(parsed.text);
          }

          // Handle error events
          if (parsed.type === 'error') {
            throw new Error(parsed.error?.message ?? 'Stream error');
          }
        } catch (e) {
          // Skip non-JSON lines (e.g., event: lines, comments)
          if (e instanceof SyntaxError) continue;
          throw e;
        }
      }
    }
  } finally {
    reader.releaseLock();
  }

  onDone();
}
