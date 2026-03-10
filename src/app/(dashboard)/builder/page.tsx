'use client';

import { useEffect } from 'react';
import { useAppStore } from '@/stores/app-store';
import BuilderIDE from '@/components/builder/builder-ide';

export default function BuilderPage() {
  const setActivePage = useAppStore((s) => s.setActivePage);

  useEffect(() => {
    setActivePage('builder');
  }, [setActivePage]);

  return (
    <div className="h-full">
      <BuilderIDE />
    </div>
  );
}
