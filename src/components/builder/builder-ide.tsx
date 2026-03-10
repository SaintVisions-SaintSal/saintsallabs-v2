'use client';

import {
  useState,
  useRef,
  useCallback,
  useEffect,
  type KeyboardEvent,
} from 'react';
import { Send } from 'lucide-react';
import type { BuilderFile } from '@/types';
import { parseFiles, buildPreviewHTML } from '@/lib/ai/file-parser';
import BuilderToolbar, { type Framework } from './builder-toolbar';
import FileTree from './file-tree';
import CodeEditor from './code-editor';
import PreviewPanel from './preview-panel';
import { cn } from '@/lib/utils/cn';

/* ─── Default starter files ───────────────────────────────── */

const DEFAULT_FILES: BuilderFile[] = [
  {
    name: 'index.html',
    lang: 'html',
    content: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>My App</title>
  <link rel="stylesheet" href="styles.css" />
</head>
<body>
  <div id="root">
    <h1>Welcome to SAL Builder</h1>
    <p>Describe what you want to build below.</p>
  </div>
  <script src="script.js"></script>
</body>
</html>`,
  },
  {
    name: 'styles.css',
    lang: 'css',
    content: `* { margin: 0; padding: 0; box-sizing: border-box; }
body {
  font-family: system-ui, sans-serif;
  background: #0a0a0a;
  color: #e5e5e5;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  text-align: center;
}
h1 { color: #F59E0B; margin-bottom: 0.5rem; }
p { color: #888; }`,
  },
  {
    name: 'script.js',
    lang: 'javascript',
    content: `// Main application logic
console.log('SAL Builder initialized');

document.addEventListener('DOMContentLoaded', () => {
  const root = document.getElementById('root');
  if (root) {
    console.log('App mounted');
  }
});`,
  },
  {
    name: 'App.tsx',
    lang: 'typescript',
    content: `import React from 'react';

export default function App() {
  return (
    <div className="app">
      <h1>Hello from SAL Builder</h1>
    </div>
  );
}`,
  },
  {
    name: 'package.json',
    lang: 'json',
    content: `{
  "name": "my-app",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start"
  },
  "dependencies": {
    "react": "^18",
    "react-dom": "^18",
    "next": "14"
  }
}`,
  },
];

/* ─── Drag resize hook ─────────────────────────────────────── */

function usePanelResize(
  initialWidth: number,
  minWidth: number,
  maxWidth: number,
  invert = false,
) {
  const [width, setWidth] = useState(initialWidth);
  const dragging = useRef(false);
  const startX = useRef(0);
  const startW = useRef(0);

  const onMouseDown = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      dragging.current = true;
      startX.current = e.clientX;
      startW.current = width;

      const onMouseMove = (ev: MouseEvent) => {
        if (!dragging.current) return;
        const delta = ev.clientX - startX.current;
        const next = invert ? startW.current - delta : startW.current + delta;
        setWidth(Math.max(minWidth, Math.min(maxWidth, next)));
      };

      const onMouseUp = () => {
        dragging.current = false;
        window.removeEventListener('mousemove', onMouseMove);
        window.removeEventListener('mouseup', onMouseUp);
      };

      window.addEventListener('mousemove', onMouseMove);
      window.addEventListener('mouseup', onMouseUp);
    },
    [width, minWidth, maxWidth, invert],
  );

  return { width, onMouseDown };
}

/* ─── BuilderIDE Component ─────────────────────────────────── */

export default function BuilderIDE() {
  /* ── state ─────────────────────────────────────────── */
  const [files, setFiles] = useState<BuilderFile[]>(DEFAULT_FILES);
  const [activeFile, setActiveFile] = useState<string | null>('index.html');
  const [openTabs, setOpenTabs] = useState<BuilderFile[]>([
    DEFAULT_FILES[0],
    DEFAULT_FILES[3],
  ]);
  const [previewHtml, setPreviewHtml] = useState('');
  const [previewError, setPreviewError] = useState<string | null>(null);
  const [building, setBuilding] = useState(false);
  const [projectName, setProjectName] = useState('my-app');
  const [framework, setFramework] = useState<Framework>('React');
  const [prompt, setPrompt] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  /* ── panel sizing ──────────────────────────────────── */
  const fileTree = usePanelResize(200, 120, 360);
  const preview = usePanelResize(400, 200, 800, true);

  /* ── build preview on file change ──────────────────── */
  useEffect(() => {
    try {
      const html = buildPreviewHTML(files);
      setPreviewHtml(html);
      setPreviewError(null);
    } catch (e) {
      setPreviewError(e instanceof Error ? e.message : 'Build error');
    }
  }, [files]);

  /* ── file operations ───────────────────────────────── */
  const selectFile = useCallback(
    (name: string) => {
      setActiveFile(name);
      const file = files.find((f) => f.name === name);
      if (file && !openTabs.find((t) => t.name === name)) {
        setOpenTabs((tabs) => [...tabs, file]);
      }
    },
    [files, openTabs],
  );

  const closeTab = useCallback(
    (name: string) => {
      setOpenTabs((tabs) => {
        const next = tabs.filter((t) => t.name !== name);
        if (activeFile === name) {
          setActiveFile(next.length > 0 ? next[next.length - 1].name : null);
        }
        return next;
      });
    },
    [activeFile],
  );

  const updateContent = useCallback(
    (name: string, content: string) => {
      setFiles((prev) =>
        prev.map((f) => (f.name === name ? { ...f, content } : f)),
      );
      setOpenTabs((tabs) =>
        tabs.map((f) => (f.name === name ? { ...f, content } : f)),
      );
    },
    [],
  );

  const addFile = useCallback(
    (name: string) => {
      const existing = files.find((f) => f.name === name);
      if (existing) {
        selectFile(name);
        return;
      }
      const ext = name.split('.').pop() ?? 'txt';
      const newFile: BuilderFile = { name, lang: ext, content: '' };
      setFiles((prev) => [...prev, newFile]);
      setOpenTabs((tabs) => [...tabs, newFile]);
      setActiveFile(name);
    },
    [files, selectFile],
  );

  const addFolder = useCallback(
    (name: string) => {
      const placeholder: BuilderFile = {
        name: `${name}/.gitkeep`,
        lang: 'plaintext',
        content: '',
      };
      setFiles((prev) => [...prev, placeholder]);
    },
    [],
  );

  const deleteFile = useCallback(
    (name: string) => {
      setFiles((prev) => prev.filter((f) => !f.name.startsWith(name)));
      setOpenTabs((tabs) => tabs.filter((t) => !t.name.startsWith(name)));
      if (activeFile && activeFile.startsWith(name)) {
        setActiveFile(null);
      }
    },
    [activeFile],
  );

  const renameFile = useCallback(
    (oldName: string, newName: string) => {
      setFiles((prev) =>
        prev.map((f) => {
          if (f.name === oldName) return { ...f, name: newName };
          if (f.name.startsWith(oldName + '/')) {
            return { ...f, name: f.name.replace(oldName, newName) };
          }
          return f;
        }),
      );
      setOpenTabs((tabs) =>
        tabs.map((f) => (f.name === oldName ? { ...f, name: newName } : f)),
      );
      if (activeFile === oldName) setActiveFile(newName);
    },
    [activeFile],
  );

  /* ── run preview ───────────────────────────────────── */
  const runPreview = useCallback(() => {
    try {
      const html = buildPreviewHTML(files);
      setPreviewHtml(html);
      setPreviewError(null);
    } catch (e) {
      setPreviewError(e instanceof Error ? e.message : 'Build error');
    }
  }, [files]);

  /* ── AI prompt ─────────────────────────────────────── */
  const handleSend = useCallback(async () => {
    const trimmed = prompt.trim();
    if (!trimmed || building) return;

    setBuilding(true);
    setPrompt('');
    let accumulated = '';

    try {
      const res = await fetch('/api/builder', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: trimmed,
          files,
          framework,
        }),
      });

      if (!res.ok) {
        throw new Error(`API error ${res.status}`);
      }

      if (!res.body) {
        throw new Error('No response body');
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() ?? '';

        for (const line of lines) {
          const trimmedLine = line.trim();
          if (!trimmedLine || !trimmedLine.startsWith('data: ')) continue;

          const data = trimmedLine.slice(6);
          if (data === '[DONE]') break;

          try {
            const parsed = JSON.parse(data);
            if (parsed.type === 'content_block_delta' && parsed.delta?.text) {
              accumulated += parsed.delta.text;
            } else if (parsed.text) {
              accumulated += parsed.text;
            }
          } catch {
            // skip non-JSON lines
          }
        }
      }

      // Parse generated files from the response
      if (accumulated) {
        const generated = parseFiles(accumulated);
        if (generated.length > 0) {
          setFiles((prev) => {
            const merged = [...prev];
            for (const gen of generated) {
              const idx = merged.findIndex((f) => f.name === gen.name);
              if (idx >= 0) {
                merged[idx] = gen;
              } else {
                merged.push(gen);
              }
            }
            return merged;
          });

          // Open and select the first generated file
          const first = generated[0];
          setOpenTabs((tabs) => {
            if (tabs.find((t) => t.name === first.name)) {
              return tabs.map((t) =>
                t.name === first.name ? first : t,
              );
            }
            return [...tabs, first];
          });
          setActiveFile(first.name);
        }
      }
    } catch (e) {
      setPreviewError(e instanceof Error ? e.message : 'Generation error');
    } finally {
      setBuilding(false);
    }
  }, [prompt, building, files, framework]);

  /* ── textarea auto-resize ──────────────────────────── */
  useEffect(() => {
    const ta = textareaRef.current;
    if (!ta) return;
    ta.style.height = 'auto';
    ta.style.height = `${Math.min(ta.scrollHeight, 120)}px`;
  }, [prompt]);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        handleSend();
      }
    },
    [handleSend],
  );

  /* ── render ────────────────────────────────────────── */
  return (
    <div className="flex h-full flex-col overflow-hidden">
      <BuilderToolbar
        projectName={projectName}
        onProjectNameChange={setProjectName}
        framework={framework}
        onFrameworkChange={setFramework}
        onRun={runPreview}
        onDeploy={() => {}}
        building={building}
      />

      {/* Main IDE panels */}
      <div className="flex flex-1 overflow-hidden">
        {/* File tree */}
        <div className="shrink-0" style={{ width: fileTree.width }}>
          <FileTree
            files={files}
            activeFile={activeFile}
            onSelect={selectFile}
            onNewFile={addFile}
            onNewFolder={addFolder}
            onDelete={deleteFile}
            onRename={renameFile}
          />
        </div>

        {/* Drag handle: file tree / editor */}
        <div
          onMouseDown={fileTree.onMouseDown}
          className="w-1 shrink-0 cursor-col-resize bg-sal-border transition-colors hover:bg-sal-gold/50"
        />

        {/* Code editor */}
        <div className="flex-1 overflow-hidden">
          <CodeEditor
            openTabs={openTabs}
            activeFile={activeFile}
            onSelectTab={selectFile}
            onCloseTab={closeTab}
            onContentChange={updateContent}
          />
        </div>

        {/* Drag handle: editor / preview */}
        <div
          onMouseDown={preview.onMouseDown}
          className="w-1 shrink-0 cursor-col-resize bg-sal-border transition-colors hover:bg-sal-gold/50"
        />

        {/* Preview */}
        <div className="shrink-0" style={{ width: preview.width }}>
          <PreviewPanel
            html={previewHtml}
            loading={building}
            error={previewError}
          />
        </div>
      </div>

      {/* Builder chat input */}
      <div className="shrink-0 border-t border-sal-border bg-sal-surface2 px-3 py-2">
        <div className="mx-auto flex max-w-3xl items-end gap-2 rounded-lg border border-sal-border2 bg-sal-input px-2.5 py-2">
          <textarea
            ref={textareaRef}
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Describe what you want to build…"
            rows={1}
            className="max-h-28 min-h-[20px] flex-1 resize-none bg-transparent text-sm text-sal-text placeholder:text-sal-text-muted focus:outline-none"
          />
          <button
            onClick={handleSend}
            disabled={!prompt.trim() || building}
            className={cn(
              'shrink-0 rounded-lg p-1.5 transition-colors',
              prompt.trim() && !building
                ? 'bg-sal-gold text-black hover:bg-sal-gold-hover'
                : 'bg-sal-border text-sal-text-muted',
            )}
          >
            <Send size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}
