'use client';

import { useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { VERTICALS } from '@/config/navigation';
import type { Vertical } from '@/types';
import { useAppStore } from '@/stores/app-store';
import ChatContainer from '@/components/chat/chat-container';

const VALID_VERTICALS = new Set<string>(VERTICALS);

export default function VerticalChatPage() {
  const params = useParams<{ vertical: string }>();
  const router = useRouter();
  const { setActivePage } = useAppStore();

  const slug = params.vertical;
  const isValid = VALID_VERTICALS.has(slug);

  useEffect(() => {
    if (!isValid) {
      router.replace('/chat/search');
      return;
    }
    setActivePage(slug);
  }, [slug, isValid, router, setActivePage]);

  if (!isValid) return null;

  return <ChatContainer vertical={slug as Vertical} />;
}
