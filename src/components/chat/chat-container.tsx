'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import type { Message, Vertical } from '@/types';
import { VERTICAL_CONFIG } from '@/config/verticals';
import { salStream } from '@/lib/ai/stream';
import { useAppStore } from '@/stores/app-store';
import ChatMessages from './chat-messages';
import InputBar from '@/components/layout/input-bar';

const WARMUP_MSG = '⚡ AI backend is warming up — retrying in a moment…';

/* ─── Props ────────────────────────────────────────────────── */

interface ChatContainerProps {
  vertical: Vertical;
}

/* ─── ChatContainer Component ──────────────────────────────── */

export default function ChatContainer({ vertical }: ChatContainerProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const abortRef = useRef<AbortController | null>(null);
  const retryRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const { model } = useAppStore();

  const config = VERTICAL_CONFIG[vertical];

  // Cleanup retry timer on unmount
  useEffect(() => () => { if (retryRef.current) clearTimeout(retryRef.current); }, []);

  const handleSend = useCallback(
    async (text: string) => {
      // Abort any in-flight stream
      abortRef.current?.abort();
      const controller = new AbortController();
      abortRef.current = controller;

      const userMsg: Message = { role: 'user', content: text };
      const assistantMsg: Message = {
        role: 'assistant',
        content: '',
        streaming: true,
      };

      setMessages((prev) => [...prev, userMsg, assistantMsg]);

      // Build the message history for the API (without the streaming placeholder)
      const apiMessages = [...messages, userMsg].map(({ role, content }) => ({
        role,
        content,
      }));

      try {
        await salStream({
          messages: apiMessages,
          systemPrompt: config.systemPrompt,
          model,
          signal: controller.signal,
          onChunk: (chunk) => {
            setMessages((prev) => {
              const updated = [...prev];
              const last = updated[updated.length - 1];
              updated[updated.length - 1] = {
                ...last,
                content: last.content + chunk,
                streaming: true,
              };
              return updated;
            });
          },
          onDone: () => {
            setMessages((prev) => {
              const updated = [...prev];
              const last = updated[updated.length - 1];
              updated[updated.length - 1] = {
                ...last,
                streaming: false,
              };
              return updated;
            });
          },
        });
      } catch (err) {
        if ((err as Error).name === 'AbortError') return;

        const rawMsg = (err as Error).message ?? '';
        // Detect Render cold-start / 503 — auto-retry once after 20s
        const isWarmup =
          rawMsg.includes('503') ||
          rawMsg.includes('502') ||
          rawMsg.toLowerCase().includes('starting up') ||
          rawMsg.toLowerCase().includes('starting');

        const displayMsg = isWarmup
          ? WARMUP_MSG
          : `Error: ${rawMsg || 'Failed to get response'}`;

        setMessages((prev) => {
          const updated = [...prev];
          const last = updated[updated.length - 1];
          updated[updated.length - 1] = {
            ...last,
            content: last.content || displayMsg,
            streaming: false,
          };
          return updated;
        });

        // Auto-retry on warmup after 20 seconds
        if (isWarmup) {
          retryRef.current = setTimeout(() => {
            handleSend(text);
          }, 20_000);
        }
      }
    },
    [messages, config.systemPrompt, model],
  );

  return (
    <>
      <ChatMessages
        messages={messages}
        vertical={vertical}
        onPrompt={handleSend}
      />
      <InputBar onSend={handleSend} />
    </>
  );
}
