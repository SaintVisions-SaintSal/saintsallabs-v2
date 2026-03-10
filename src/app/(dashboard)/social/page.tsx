'use client';

import { useEffect } from 'react';
import { useAppStore } from '@/stores/app-store';
import SocialStudio from '@/components/social/social-studio';

export default function SocialPage() {
  const setActivePage = useAppStore((s) => s.setActivePage);

  useEffect(() => {
    setActivePage('social-studio');
  }, [setActivePage]);

  return (
    <div className="h-full">
      <SocialStudio />
    </div>
  );
}
