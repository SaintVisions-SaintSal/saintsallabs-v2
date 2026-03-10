'use client';

import { useState } from 'react';
import {
  Play,
  Rocket,
  Github,
  ChevronDown,
} from 'lucide-react';
import { cn } from '@/lib/utils/cn';

/* ─── Types ────────────────────────────────────────────────── */

const FRAMEWORKS = ['React', 'Next.js', 'Vue', 'Svelte', 'HTML'] as const;
type Framework = (typeof FRAMEWORKS)[number];

interface BuilderToolbarProps {
  projectName: string;
  onProjectNameChange: (name: string) => void;
  framework: Framework;
  onFrameworkChange: (fw: Framework) => void;
  onRun: () => void;
  onDeploy: () => void;
  building: boolean;
}

/* ─── Component ────────────────────────────────────────────── */

export type { Framework };

export default function BuilderToolbar({
  projectName,
  onProjectNameChange,
  framework,
  onFrameworkChange,
  onRun,
  onDeploy,
  building,
}: BuilderToolbarProps) {
  const [showFw, setShowFw] = useState(false);

  return (
    <div className="flex h-10 shrink-0 items-center gap-2 border-b border-sal-border bg-sal-surface2 px-3">
      {/* Project name */}
      <input
        value={projectName}
        onChange={(e) => onProjectNameChange(e.target.value)}
        spellCheck={false}
        className="w-32 rounded-md border border-sal-border bg-sal-surface px-2 py-1 text-xs text-sal-text outline-none focus:border-sal-border2"
      />

      {/* Framework selector */}
      <div className="relative">
        <button
          onClick={() => setShowFw((v) => !v)}
          className="flex items-center gap-1 rounded-md border border-sal-border bg-sal-surface px-2 py-1 text-xs text-sal-text-muted hover:text-sal-text"
        >
          {framework}
          <ChevronDown size={11} />
        </button>
        {showFw && (
          <div className="absolute left-0 top-full z-50 mt-1 w-32 rounded-md border border-sal-border bg-sal-surface py-1 shadow-xl">
            {FRAMEWORKS.map((fw) => (
              <button
                key={fw}
                onClick={() => {
                  onFrameworkChange(fw);
                  setShowFw(false);
                }}
                className={cn(
                  'block w-full px-3 py-1 text-left text-xs',
                  fw === framework
                    ? 'text-sal-gold'
                    : 'text-sal-text-muted hover:bg-[#161620] hover:text-sal-text',
                )}
              >
                {fw}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="flex-1" />

      {/* Run */}
      <button
        onClick={onRun}
        disabled={building}
        className={cn(
          'flex items-center gap-1 rounded-md border px-2.5 py-1 text-xs font-medium transition-colors',
          building
            ? 'border-sal-border text-sal-text-muted'
            : 'border-sal-green/30 text-sal-green hover:bg-sal-green/10',
        )}
      >
        <Play size={11} />
        {building ? 'Building…' : 'Run'}
      </button>

      {/* Deploy */}
      <button
        onClick={onDeploy}
        className="flex items-center gap-1 rounded-md border border-sal-gold/30 px-2.5 py-1 text-xs font-medium text-sal-gold transition-colors hover:bg-sal-gold/10"
      >
        <Rocket size={11} />
        Deploy
      </button>

      {/* GitHub */}
      <button className="flex items-center gap-1 rounded-md border border-sal-border px-2.5 py-1 text-xs text-sal-text-muted transition-colors hover:text-sal-text">
        <Github size={11} />
        GitHub
      </button>
    </div>
  );
}
