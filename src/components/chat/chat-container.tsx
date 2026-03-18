'use client';

import { useState, useCallback, useRef } from 'react';
import type { Message, Vertical } from '@/types';
import { VERTICAL_CONFIG } from '@/config/verticals';
import { salStream } from '@/lib/ai/stream';
import { useAppStore } from '@/stores/app-store';
import ChatMessages from './chat-messages';
import InputBar from '@/components/layout/input-bar';

/* ─── Props ────────────────────────────────────────────────── */

interface ChatContainerProps {
  vertical: Vertical;
}

/* ─── ChatContainer Component ──────────────────────────────── */

export default function ChatContainer({ vertical }: ChatContainerProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const abortRef = useRef<AbortController | null>(null);
  const { model } = useAppStore();

  const config = VERTICAL_CONFIG[vertical];

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
        // Detect Render cold-start (503/502) — show friendly warmup message
        const isWarmup =
          rawMsg.includes('503') ||
          rawMsg.includes('502') ||
          rawMsg.toLowerCase().includes('starting up');

        const displayMsg = isWarmup
          ? '⚡ AI backend is warming up — please resend your message in ~30 seconds. (This only happens after periods of inactivity.)'
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
