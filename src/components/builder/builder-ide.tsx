'use client';

import {
  useState,
  useRef,
  useCallback,
  useEffect,
  type KeyboardEvent,
} from 'react';
import { Send, Code2, Eye, ChevronRight, Sparkles } from 'lucide-react';
import type { BuilderFile } from '@/types';
import { parseFiles, buildPreviewHTML } from '@/lib/ai/file-parser';
import FileTree from './file-tree';
import CodeEditor from './code-editor';
import PreviewPanel from './preview-panel';

/* ─── Types ────────────────────────────────────────────────── */

interface ChatMsg {
  role: 'user' | 'assistant';
  content: string;
  streaming?: boolean;
}

/* ─── Default starter files ────────────────────────────────── */

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
h1 { color: #D4AF37; margin-bottom: 0.5rem; }
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
];

/* ─── Starter prompts ───────────────────────────────────────── */

const STARTERS = [
  'Build a landing page with a hero section and pricing table',
  'Create a dashboard with charts and a sidebar',
  'Build a to-do app with local storage',
  'Design a portfolio page with dark theme',
];

/* ─── BuilderIDE Component ─────────────────────────────────── */

export default function BuilderIDE() {
  const [files, setFiles] = useState<BuilderFile[]>(DEFAULT_FILES);
  const [activeFile, setActiveFile] = useState<string | null>('index.html');
  const [openTabs, setOpenTabs] = useState<BuilderFile[]>([DEFAULT_FILES[0]]);
  const [previewHtml, setPreviewHtml] = useState('');
  const [previewError, setPreviewError] = useState<string | null>(null);
  const [building, setBuilding] = useState(false);
  const [prompt, setPrompt] = useState('');
  const [messages, setMessages] = useState<ChatMsg[]>([]);
  const [rightTab, setRightTab] = useState<'code' | 'preview'>('preview');
  const [showFiles, setShowFiles] = useState(false);

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);

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

  /* ── scroll chat to bottom ──────────────────────────── */
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  /* ── textarea auto-resize ──────────────────────────── */
  useEffect(() => {
    const ta = textareaRef.current;
    if (!ta) return;
    ta.style.height = 'auto';
    ta.style.height = `${Math.min(ta.scrollHeight, 120)}px`;
  }, [prompt]);

  /* ── file operations ───────────────────────────────── */
  const selectFile = useCallback(
    (name: string) => {
      setActiveFile(name);
      const file = files.find((f) => f.name === name);
      if (file && !openTabs.find((t) => t.name === name)) {
        setOpenTabs((tabs) => [...tabs, file]);
      }
      setRightTab('code');
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

  const updateContent = useCallback((name: string, content: string) => {
    setFiles((prev) => prev.map((f) => (f.name === name ? { ...f, content } : f)));
    setOpenTabs((tabs) => tabs.map((f) => (f.name === name ? { ...f, content } : f)));
  }, []);

  /* ── AI send ────────────────────────────────────────── */
  const handleSend = useCallback(async (text?: string) => {
    const trimmed = (text ?? prompt).trim();
    if (!trimmed || building) return;

    setBuilding(true);
    setPrompt('');

    setMessages((prev) => [
      ...prev,
      { role: 'user', content: trimmed },
      { role: 'assistant', content: '', streaming: true },
    ]);

    let accumulated = '';

    try {
      const res = await fetch('/api/builder', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: trimmed, files, framework: 'HTML/CSS/JS' }),
      });

      if (!res.ok) throw new Error(`API error ${res.status}`);
      if (!res.body) throw new Error('No response body');

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
            setMessages((prev) => {
              const updated = [...prev];
              updated[updated.length - 1] = {
                role: 'assistant',
                content: accumulated,
                streaming: true,
              };
              return updated;
            });
          } catch { /* skip */ }
        }
      }

      // Finalise message
      setMessages((prev) => {
        const updated = [...prev];
        updated[updated.length - 1] = { role: 'assistant', content: accumulated, streaming: false };
        return updated;
      });

      // Parse generated files
      if (accumulated) {
        const generated = parseFiles(accumulated);
        if (generated.length > 0) {
          setFiles((prev) => {
            const merged = [...prev];
            for (const gen of generated) {
              const idx = merged.findIndex((f) => f.name === gen.name);
              if (idx >= 0) merged[idx] = gen;
              else merged.push(gen);
            }
            return merged;
          });
          const first = generated[0];
          setOpenTabs((tabs) => {
            if (tabs.find((t) => t.name === first.name))
              return tabs.map((t) => (t.name === first.name ? first : t));
            return [...tabs, first];
          });
          setActiveFile(first.name);
          setRightTab('preview');
        }
      }
    } catch (e) {
      setMessages((prev) => {
        const updated = [...prev];
        updated[updated.length - 1] = {
          role: 'assistant',
          content: `Sorry, something went wrong: ${e instanceof Error ? e.message : 'Unknown error'}`,
          streaming: false,
        };
        return updated;
      });
    } finally {
      setBuilding(false);
    }
  }, [prompt, building, files]);

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
    <div style={{ display: 'flex', height: '100%', background: '#0f0f0f', overflow: 'hidden' }}>

      {/* ── LEFT: Chat panel ──────────────────────────── */}
      <div style={{
        width: '360px', minWidth: '280px', maxWidth: '420px',
        display: 'flex', flexDirection: 'column',
        borderRight: '1px solid rgba(255,255,255,0.06)',
        background: '#0a0a0a',
      }}>
        {/* Header */}
        <div style={{
          padding: '14px 16px', borderBottom: '1px solid rgba(255,255,255,0.06)',
          display: 'flex', alignItems: 'center', gap: 8,
        }}>
          <div style={{
            width: 28, height: 28, borderRadius: 8,
            background: 'rgba(212,175,55,0.12)',
            border: '1px solid rgba(212,175,55,0.2)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Sparkles size={14} color="#D4AF37" />
          </div>
          <div>
            <div style={{ fontSize: 13, fontWeight: 700, color: 'white' }}>SAL Builder</div>
            <div style={{ fontSize: 10, color: '#555', letterSpacing: 1 }}>Describe it. Ship it.</div>
          </div>
          <button
            onClick={() => setShowFiles(!showFiles)}
            style={{
              marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 4,
              background: showFiles ? 'rgba(212,175,55,0.1)' : 'rgba(255,255,255,0.04)',
              border: `1px solid ${showFiles ? 'rgba(212,175,55,0.3)' : 'rgba(255,255,255,0.08)'}`,
              borderRadius: 6, padding: '4px 10px',
              color: showFiles ? '#D4AF37' : '#666', fontSize: 11, fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            <Code2 size={11} /> Files
          </button>
        </div>

        {/* File tree (toggleable) */}
        {showFiles && (
          <div style={{ borderBottom: '1px solid rgba(255,255,255,0.06)', maxHeight: 200, overflowY: 'auto' }}>
            <FileTree
              files={files}
              activeFile={activeFile}
              onSelect={selectFile}
              onNewFile={(name) => {
                const ext = name.split('.').pop() ?? 'txt';
                const f: BuilderFile = { name, lang: ext, content: '' };
                setFiles((prev) => [...prev, f]);
                setOpenTabs((tabs) => [...tabs, f]);
                setActiveFile(name);
              }}
              onNewFolder={(name) => {
                const f: BuilderFile = { name: `${name}/.gitkeep`, lang: 'plaintext', content: '' };
                setFiles((prev) => [...prev, f]);
              }}
              onDelete={(name) => {
                setFiles((prev) => prev.filter((f) => !f.name.startsWith(name)));
                setOpenTabs((tabs) => tabs.filter((t) => !t.name.startsWith(name)));
                if (activeFile?.startsWith(name)) setActiveFile(null);
              }}
              onRename={(oldName, newName) => {
                setFiles((prev) => prev.map((f) =>
                  f.name === oldName ? { ...f, name: newName } : f,
                ));
                setOpenTabs((tabs) => tabs.map((f) =>
                  f.name === oldName ? { ...f, name: newName } : f,
                ));
                if (activeFile === oldName) setActiveFile(newName);
              }}
            />
          </div>
        )}

        {/* Chat messages */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '16px 14px', display: 'flex', flexDirection: 'column', gap: 14 }}>
          {messages.length === 0 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 8 }}>
              <div style={{ fontSize: 11, color: '#444', letterSpacing: 2, textTransform: 'uppercase', marginBottom: 4 }}>
                Try a prompt
              </div>
              {STARTERS.map((s) => (
                <button
                  key={s}
                  onClick={() => handleSend(s)}
                  style={{
                    textAlign: 'left', padding: '10px 12px', borderRadius: 8,
                    background: 'rgba(255,255,255,0.02)',
                    border: '1px solid rgba(255,255,255,0.06)',
                    color: '#888', fontSize: 12, cursor: 'pointer',
                    display: 'flex', alignItems: 'center', gap: 8,
                    transition: 'all 0.15s',
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLElement).style.borderColor = 'rgba(212,175,55,0.3)';
                    (e.currentTarget as HTMLElement).style.color = '#ccc';
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.06)';
                    (e.currentTarget as HTMLElement).style.color = '#888';
                  }}
                >
                  <ChevronRight size={12} color="#D4AF37" />
                  {s}
                </button>
              ))}
            </div>
          )}

          {messages.map((msg, i) => (
            <div key={i} style={{
              display: 'flex',
              flexDirection: msg.role === 'user' ? 'row-reverse' : 'row',
              gap: 8, alignItems: 'flex-start',
            }}>
              {msg.role === 'assistant' && (
                <div style={{
                  width: 24, height: 24, borderRadius: 6, flexShrink: 0,
                  background: 'rgba(212,175,55,0.12)',
                  border: '1px solid rgba(212,175,55,0.2)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <Sparkles size={11} color="#D4AF37" />
                </div>
              )}
              <div style={{
                maxWidth: '85%', padding: '8px 12px', borderRadius: 10,
                fontSize: 12, lineHeight: 1.6,
                background: msg.role === 'user'
                  ? 'rgba(212,175,55,0.1)'
                  : 'rgba(255,255,255,0.04)',
                border: msg.role === 'user'
                  ? '1px solid rgba(212,175,55,0.2)'
                  : '1px solid rgba(255,255,255,0.06)',
                color: msg.role === 'user' ? '#e0c97e' : '#bbb',
                whiteSpace: 'pre-wrap',
                wordBreak: 'break-word',
              }}>
                {msg.content || (msg.streaming ? (
                  <span style={{ color: '#D4AF37', opacity: 0.7 }}>Building…</span>
                ) : '')}
                {msg.streaming && msg.content && (
                  <span style={{
                    display: 'inline-block', width: 2, height: 12,
                    background: '#D4AF37', marginLeft: 2,
                    animation: 'blink 0.9s step-end infinite',
                    verticalAlign: 'text-bottom',
                  }} />
                )}
              </div>
            </div>
          ))}
          <div ref={chatEndRef} />
        </div>

        {/* Chat input */}
        <div style={{
          padding: '10px 12px',
          borderTop: '1px solid rgba(255,255,255,0.06)',
          background: '#080808',
        }}>
          <div style={{
            display: 'flex', alignItems: 'flex-end', gap: 8,
            background: '#111',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: 10, padding: '8px 10px',
          }}>
            <textarea
              ref={textareaRef}
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Describe what you want to build…"
              rows={1}
              style={{
                flex: 1, resize: 'none', background: 'transparent',
                border: 'none', outline: 'none',
                fontSize: 12, color: '#e0e0e0', lineHeight: 1.5,
                maxHeight: 100, fontFamily: 'inherit',
              }}
            />
            <button
              onClick={() => handleSend()}
              disabled={!prompt.trim() || building}
              style={{
                flexShrink: 0, width: 28, height: 28, borderRadius: 7,
                background: prompt.trim() && !building
                  ? 'linear-gradient(135deg,#D4AF37,#8A7129)'
                  : 'rgba(255,255,255,0.05)',
                border: 'none', cursor: prompt.trim() && !building ? 'pointer' : 'default',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                transition: 'all 0.15s',
              }}
            >
              <Send size={13} color={prompt.trim() && !building ? '#080808' : '#444'} />
            </button>
          </div>
        </div>
      </div>

      {/* ── RIGHT: Code + Preview ──────────────────────── */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        {/* Tab bar */}
        <div style={{
          height: 38, display: 'flex', alignItems: 'center',
          borderBottom: '1px solid rgba(255,255,255,0.06)',
          background: '#0d0d0d', padding: '0 12px', gap: 4,
        }}>
          {(['code', 'preview'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setRightTab(tab)}
              style={{
                display: 'flex', alignItems: 'center', gap: 6,
                padding: '4px 12px', borderRadius: 6,
                background: rightTab === tab ? 'rgba(212,175,55,0.1)' : 'transparent',
                border: `1px solid ${rightTab === tab ? 'rgba(212,175,55,0.3)' : 'transparent'}`,
                color: rightTab === tab ? '#D4AF37' : '#555',
                fontSize: 12, fontWeight: 600, cursor: 'pointer',
                letterSpacing: 0.5, textTransform: 'capitalize',
                transition: 'all 0.15s',
              }}
            >
              {tab === 'code' ? <Code2 size={12} /> : <Eye size={12} />}
              {tab === 'code' ? 'Code' : 'Preview'}
            </button>
          ))}
          {activeFile && rightTab === 'code' && (
            <span style={{
              marginLeft: 8, fontSize: 11, color: '#444',
              fontFamily: 'monospace',
            }}>
              {activeFile}
            </span>
          )}
        </div>

        {/* Panel content */}
        <div style={{ flex: 1, overflow: 'hidden' }}>
          {rightTab === 'code' ? (
            <CodeEditor
              openTabs={openTabs}
              activeFile={activeFile}
              onSelectTab={selectFile}
              onCloseTab={closeTab}
              onContentChange={updateContent}
            />
          ) : (
            <PreviewPanel
              html={previewHtml}
              loading={building}
              error={previewError}
            />
          )}
        </div>
      </div>
    </div>
  );
}
