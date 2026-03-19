'use client';

import { useRef, useCallback, useMemo } from 'react';
import { X } from 'lucide-react';
import type { BuilderFile } from '@/types';
import { cn } from '@/lib/utils/cn';

/* ─── Syntax highlighting ──────────────────────────────────── */

/* ── colour constants so Tailwind purge doesn't matter ─────── */
const C = {
  comment: 'color:#666;font-style:italic',
  string:  'color:#22C55E',
  tag:     'color:#D4AF37',
  keyword: 'color:#818CF8',
  number:  'color:#EC4899',
};

function highlightLine(line: string, lang: string): string {
  let s = line
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

  // Comments
  s = s.replace(/(\/\/.*$)/gm, `<span style="${C.comment}">$1</span>`);
  s = s.replace(/(\/\*[\s\S]*?\*\/)/g, `<span style="${C.comment}">$1</span>`);

  // Strings
  s = s.replace(/(&quot;|")((?:\\.|(?!\1).)*?)\1/g, `<span style="${C.string}">"$2"</span>`);
  s = s.replace(/(')((?:\\.|[^'])*?)(')/g, `<span style="${C.string}">$1$2$3</span>`);
  s = s.replace(/(`)((?:\\.|[^`])*?)(`)/g, `<span style="${C.string}">$1$2$3</span>`);

  // HTML tags
  if (lang === 'html' || lang === 'javascript' || lang === 'typescript') {
    s = s.replace(/(&lt;\/?)([\w.-]+)/g, `$1<span style="${C.tag}">$2</span>`);
  }

  // Keywords
  s = s.replace(
    /\b(const|let|var|function|return|import|export|from|if|else|for|while|switch|case|break|default|class|extends|new|this|typeof|async|await|try|catch|throw|interface|type|enum)\b/g,
    `<span style="${C.keyword}">$1</span>`,
  );

  // Numbers
  s = s.replace(/\b(\d+\.?\d*)\b/g, `<span style="${C.number}">$1</span>`);

  return s;
}

/* ─── Props ────────────────────────────────────────────────── */

interface CodeEditorProps {
  openTabs: BuilderFile[];
  activeFile: string | null;
  onSelectTab: (name: string) => void;
  onCloseTab: (name: string) => void;
  onContentChange: (name: string, content: string) => void;
}

/* ─── Component ────────────────────────────────────────────── */

export default function CodeEditor({
  openTabs,
  activeFile,
  onSelectTab,
  onCloseTab,
  onContentChange,
}: CodeEditorProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const gutterRef = useRef<HTMLDivElement>(null);

  const currentFile = openTabs.find((f) => f.name === activeFile);

  const lines = useMemo(
    () => (currentFile?.content ?? '').split('\n'),
    [currentFile?.content],
  );

  const highlighted = useMemo(
    () =>
      lines.map((line) =>
        highlightLine(line, currentFile?.lang ?? 'plaintext'),
      ),
    [lines, currentFile?.lang],
  );

  const handleScroll = useCallback((e: React.UIEvent<HTMLTextAreaElement>) => {
    if (gutterRef.current) {
      gutterRef.current.scrollTop = (e.target as HTMLTextAreaElement).scrollTop;
    }
  }, []);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      if (activeFile) onContentChange(activeFile, e.target.value);
    },
    [activeFile, onContentChange],
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      // Tab inserts 2 spaces
      if (e.key === 'Tab') {
        e.preventDefault();
        const ta = e.currentTarget;
        const start = ta.selectionStart;
        const end = ta.selectionEnd;
        const val = ta.value;
        const newVal = val.substring(0, start) + '  ' + val.substring(end);
        if (activeFile) onContentChange(activeFile, newVal);
        requestAnimationFrame(() => {
          ta.selectionStart = ta.selectionEnd = start + 2;
        });
      }
    },
    [activeFile, onContentChange],
  );

  return (
    <div className="flex h-full flex-col overflow-hidden bg-sal-bg">
      {/* Tab bar */}
      <div className="flex h-8 shrink-0 items-center gap-0 overflow-x-auto border-b border-sal-border bg-sal-surface2">
        {openTabs.map((file) => {
          const isActive = file.name === activeFile;
          return (
            <div
              key={file.name}
              className={cn(
                'group flex h-full shrink-0 items-center gap-1.5 border-r border-sal-border px-3 text-xs',
                isActive
                  ? 'bg-sal-bg text-sal-text'
                  : 'bg-sal-surface2 text-sal-text-muted hover:text-sal-text',
              )}
            >
              <button
                onClick={() => onSelectTab(file.name)}
                className="truncate"
              >
                {file.name.split('/').pop()}
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onCloseTab(file.name);
                }}
                className="rounded p-0.5 opacity-0 hover:bg-sal-border group-hover:opacity-100"
              >
                <X size={10} />
              </button>
            </div>
          );
        })}
      </div>

      {/* Editor area */}
      {currentFile ? (
        <div className="relative flex flex-1 overflow-hidden">
          {/* Line numbers gutter */}
          <div
            ref={gutterRef}
            className="shrink-0 overflow-hidden border-r border-sal-border bg-sal-surface2 py-3 pr-2 text-right font-mono"
            style={{ width: '48px' }}
          >
            {lines.map((_, i) => (
              <div
                key={i}
                className="h-[20px] px-2 text-2xs leading-[20px] text-sal-text-dim select-none"
              >
                {i + 1}
              </div>
            ))}
          </div>

          {/* Code layers */}
          <div className="relative flex-1 overflow-hidden">
            {/* Highlighted layer (visual) */}
            <div
              className="pointer-events-none absolute inset-0 overflow-auto whitespace-pre py-3 pl-3 font-mono text-xs leading-[20px] text-sal-text"
              aria-hidden
            >
              {highlighted.map((html, i) => (
                <div
                  key={i}
                  className="h-[20px]"
                  dangerouslySetInnerHTML={{ __html: html || ' ' }}
                />
              ))}
            </div>

            {/* Textarea (editable, transparent text) */}
            <textarea
              ref={textareaRef}
              value={currentFile.content}
              onChange={handleChange}
              onScroll={handleScroll}
              onKeyDown={handleKeyDown}
              spellCheck={false}
              className="absolute inset-0 h-full w-full resize-none overflow-auto whitespace-pre bg-transparent py-3 pl-3 font-mono text-xs leading-[20px] text-transparent caret-sal-gold outline-none selection:bg-sal-gold/20"
            />
          </div>
        </div>
      ) : (
        <div className="flex flex-1 items-center justify-center text-xs text-sal-text-muted">
          Select a file to start editing
        </div>
      )}
    </div>
  );
}
