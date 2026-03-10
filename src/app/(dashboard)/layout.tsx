'use client';

import { useCallback } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Sidebar from '@/components/layout/sidebar';
import Header from '@/components/layout/header';
import Ticker from '@/components/layout/ticker';
import InputBar from '@/components/layout/input-bar';
import { useAppStore } from '@/stores/app-store';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { activePage } = useAppStore();

  // Chat pages render their own InputBar via ChatContainer,
  // so hide the layout-level InputBar on /chat/* routes.
  const isChatPage = pathname.startsWith('/chat/');

  const handleSend = useCallback(
    (text: string) => {
      // On non-chat pages, navigate to the appropriate chat vertical
      // and let the page handle the first message.
      // Default to search if on a non-vertical page.
      const vertical = activePage === 'dashboard' ? 'search' : activePage;
      const encoded = encodeURIComponent(text);
      router.push(`/chat/${vertical}?q=${encoded}`);
    },
    [activePage, router],
  );

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-sal-bg">
      <Sidebar />

      <div className="flex flex-1 flex-col overflow-hidden">
        <Header />
        <Ticker />

        {/* Main content area — relative for InputBar overlay */}
        <main className="relative flex-1 overflow-y-auto">
          {children}
          {!isChatPage && <InputBar onSend={handleSend} />}
        </main>
      </div>
    </div>
  );
}
