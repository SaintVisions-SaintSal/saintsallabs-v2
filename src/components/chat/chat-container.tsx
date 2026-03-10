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

        // Show error in the assistant message
        setMessages((prev) => {
          const updated = [...prev];
          const last = updated[updated.length - 1];
          updated[updated.length - 1] = {
            ...last,
            content:
              last.content ||
              `Error: ${(err as Error).message ?? 'Failed to get response'}`,
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
