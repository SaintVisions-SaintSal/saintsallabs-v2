'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import {
  RefreshCw,
  Monitor,
  Tablet,
  Smartphone,
  AlertTriangle,
} from 'lucide-react';
import { cn } from '@/lib/utils/cn';

/* ─── Types ────────────────────────────────────────────────── */

type Device = 'desktop' | 'tablet' | 'mobile';

const DEVICE_WIDTHS: Record<Device, string> = {
  desktop: '100%',
  tablet: '768px',
  mobile: '375px',
};

interface PreviewPanelProps {
  html: string;
  loading: boolean;
  error: string | null;
}

/* ─── Component ────────────────────────────────────────────── */

export default function PreviewPanel({
  html,
  loading,
  error,
}: PreviewPanelProps) {
  const [device, setDevice] = useState<Device>('desktop');
  const [key, setKey] = useState(0);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  // Write HTML into iframe via blob URL
  useEffect(() => {
    if (!html || !iframeRef.current) return;
    const blob = new Blob([html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    iframeRef.current.src = url;
    return () => URL.revokeObjectURL(url);
  }, [html, key]);

  const handleRefresh = useCallback(() => setKey((k) => k + 1), []);

  return (
    <div className="flex h-full flex-col overflow-hidden bg-sal-bg">
      {/* Toolbar */}
      <div className="flex h-8 shrink-0 items-center gap-2 border-b border-sal-border bg-sal-surface2 px-2">
        <span className="text-[10px] font-medium uppercase tracking-wider text-sal-text-muted">
          Preview
        </span>

        <div className="flex-1" />

        {/* Device toggles */}
        {([
          ['desktop', Monitor],
          ['tablet', Tablet],
          ['mobile', Smartphone],
        ] as [Device, typeof Monitor][]).map(([d, Icon]) => (
          <button
            key={d}
            onClick={() => setDevice(d)}
            className={cn(
              'rounded p-1 transition-colors',
              device === d
                ? 'text-sal-gold'
                : 'text-sal-text-muted hover:text-sal-text',
            )}
          >
            <Icon size={13} />
          </button>
        ))}

        {/* Refresh */}
        <button
          onClick={handleRefresh}
          className="rounded p-1 text-sal-text-muted transition-colors hover:text-sal-text"
        >
          <RefreshCw size={13} />
        </button>
      </div>

      {/* URL bar */}
      <div className="flex h-7 shrink-0 items-center border-b border-sal-border bg-sal-surface px-2">
        <div className="flex-1 rounded bg-sal-surface2 px-2 py-0.5 text-[10px] text-sal-text-muted">
          https://preview.sal.dev/{device}
        </div>
      </div>

      {/* Preview area */}
      <div className="relative flex flex-1 items-start justify-center overflow-auto bg-[#07070A] p-2">
        {/* Loading skeleton */}
        {loading && (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-sal-bg/80">
            <div className="flex flex-col items-center gap-2">
              <div className="h-5 w-5 animate-spin-fast rounded-full border-2 border-sal-gold border-t-transparent" />
              <span className="text-xs text-sal-text-muted">Building…</span>
            </div>
          </div>
        )}

        {/* Error overlay */}
        {error && (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-sal-bg/90">
            <div className="flex max-w-xs flex-col items-center gap-2 rounded-lg border border-sal-red/30 bg-sal-surface p-4 text-center">
              <AlertTriangle size={20} className="text-sal-red" />
              <span className="text-xs text-sal-red">Preview Error</span>
              <pre className="max-h-32 w-full overflow-auto text-left text-[10px] text-sal-text-muted">
                {error}
              </pre>
            </div>
          </div>
        )}

        {/* iframe */}
        <iframe
          ref={iframeRef}
          key={key}
          title="SAL Builder Preview"
          sandbox="allow-scripts allow-modals"
          className="rounded border border-sal-border bg-white"
          style={{
            width: DEVICE_WIDTHS[device],
            maxWidth: '100%',
            height: '100%',
          }}
        />
      </div>
    </div>
  );
}
