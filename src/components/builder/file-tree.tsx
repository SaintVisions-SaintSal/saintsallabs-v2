'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import {
  Folder,
  FolderOpen,
  FileCode,
  FileText,
  FileJson,
  Palette,
  Globe,
  FilePlus,
  FolderPlus,
  ChevronRight,
  ChevronDown,
  Trash2,
  Pencil,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import type { BuilderFile } from '@/types';
import { buildTree, type TreeNode } from '@/lib/ai/file-parser';
import { cn } from '@/lib/utils/cn';

/* ─── File icon lookup ─────────────────────────────────────── */

function fileIcon(name: string): LucideIcon {
  const ext = name.split('.').pop()?.toLowerCase();
  switch (ext) {
    case 'tsx':
    case 'jsx':
    case 'ts':
    case 'js':
      return FileCode;
    case 'css':
    case 'scss':
    case 'sass':
      return Palette;
    case 'html':
    case 'htm':
      return Globe;
    case 'json':
      return FileJson;
    default:
      return FileText;
  }
}

/* ─── Props ────────────────────────────────────────────────── */

interface FileTreeProps {
  files: BuilderFile[];
  activeFile: string | null;
  onSelect: (name: string) => void;
  onNewFile: (name: string) => void;
  onNewFolder: (name: string) => void;
  onDelete: (name: string) => void;
  onRename: (oldName: string, newName: string) => void;
}

/* ─── Tree Node Renderer ───────────────────────────────────── */

function TreeItem({
  node,
  depth,
  activeFile,
  onSelect,
  contextTarget,
  onContext,
}: {
  node: TreeNode;
  depth: number;
  activeFile: string | null;
  onSelect: (name: string) => void;
  contextTarget: string | null;
  onContext: (path: string, x: number, y: number) => void;
}) {
  const [open, setOpen] = useState(true);
  const isActive = !node.isDir && node.path === activeFile;

  const handleClick = () => {
    if (node.isDir) {
      setOpen((v) => !v);
    } else {
      onSelect(node.path);
    }
  };

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    onContext(node.path, e.clientX, e.clientY);
  };

  const DirIcon = open ? FolderOpen : Folder;
  const DirChevron = open ? ChevronDown : ChevronRight;
  const FIcon = fileIcon(node.name);

  return (
    <>
      <button
        onClick={handleClick}
        onContextMenu={handleContextMenu}
        className={cn(
          'flex w-full items-center gap-1 rounded px-1 py-[3px] text-left text-xs',
          isActive
            ? 'bg-[#1C1C26] text-sal-gold'
            : 'text-sal-text-muted hover:bg-[#161620] hover:text-sal-text',
        )}
        style={{ paddingLeft: `${depth * 12 + 4}px` }}
      >
        {node.isDir ? (
          <>
            <DirChevron size={12} className="shrink-0 text-sal-text-dim" />
            <DirIcon size={13} className="shrink-0 text-sal-gold/60" />
          </>
        ) : (
          <>
            <span className="w-3 shrink-0" />
            <FIcon size={13} className="shrink-0" />
          </>
        )}
        <span className="truncate">{node.name}</span>
      </button>

      {node.isDir && open && (
        <div>
          {node.children.map((child) => (
            <TreeItem
              key={child.path}
              node={child}
              depth={depth + 1}
              activeFile={activeFile}
              onSelect={onSelect}
              contextTarget={contextTarget}
              onContext={onContext}
            />
          ))}
        </div>
      )}
    </>
  );
}

/* ─── FileTree Component ───────────────────────────────────── */

export default function FileTree({
  files,
  activeFile,
  onSelect,
  onNewFile,
  onNewFolder,
  onDelete,
  onRename,
}: FileTreeProps) {
  const tree = buildTree(files);

  const [ctx, setCtx] = useState<{
    path: string;
    x: number;
    y: number;
  } | null>(null);
  const [renaming, setRenaming] = useState<string | null>(null);
  const [renameVal, setRenameVal] = useState('');
  const renameRef = useRef<HTMLInputElement>(null);

  /* close context menu on outside click */
  useEffect(() => {
    if (!ctx) return;
    const close = () => setCtx(null);
    window.addEventListener('click', close);
    return () => window.removeEventListener('click', close);
  }, [ctx]);

  /* auto-focus rename input */
  useEffect(() => {
    if (renaming) renameRef.current?.focus();
  }, [renaming]);

  const handleContext = useCallback(
    (path: string, x: number, y: number) => {
      setCtx({ path, x, y });
    },
    [],
  );

  const commitRename = useCallback(() => {
    if (renaming && renameVal.trim() && renameVal.trim() !== renaming) {
      onRename(renaming, renameVal.trim());
    }
    setRenaming(null);
  }, [renaming, renameVal, onRename]);

  const handleNewFile = useCallback(() => {
    const name = `new-file-${Date.now() % 10000}.tsx`;
    onNewFile(name);
  }, [onNewFile]);

  const handleNewFolder = useCallback(() => {
    const name = `folder-${Date.now() % 10000}`;
    onNewFolder(name);
  }, [onNewFolder]);

  return (
    <div className="flex h-full flex-col overflow-hidden bg-sal-surface2">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-sal-border px-2 py-1.5">
        <span className="text-[10px] font-medium uppercase tracking-wider text-sal-text-muted">
          Files
        </span>
        <div className="flex items-center gap-0.5">
          <button
            onClick={handleNewFile}
            className="rounded p-0.5 text-sal-text-muted hover:text-sal-text"
            title="New File"
          >
            <FilePlus size={13} />
          </button>
          <button
            onClick={handleNewFolder}
            className="rounded p-0.5 text-sal-text-muted hover:text-sal-text"
            title="New Folder"
          >
            <FolderPlus size={13} />
          </button>
        </div>
      </div>

      {/* Tree */}
      <div className="flex-1 overflow-y-auto px-1 py-1">
        {tree.map((node) => (
          <TreeItem
            key={node.path}
            node={node}
            depth={0}
            activeFile={activeFile}
            onSelect={onSelect}
            contextTarget={ctx?.path ?? null}
            onContext={handleContext}
          />
        ))}
      </div>

      {/* Rename input (inline) */}
      {renaming && (
        <div className="border-t border-sal-border px-2 py-1.5">
          <input
            ref={renameRef}
            value={renameVal}
            onChange={(e) => setRenameVal(e.target.value)}
            onBlur={commitRename}
            onKeyDown={(e) => {
              if (e.key === 'Enter') commitRename();
              if (e.key === 'Escape') setRenaming(null);
            }}
            className="w-full rounded border border-sal-border2 bg-sal-input px-1.5 py-0.5 text-xs text-sal-text outline-none"
          />
        </div>
      )}

      {/* Context menu */}
      {ctx && (
        <div
          className="fixed z-[100] min-w-[120px] rounded-md border border-sal-border bg-sal-surface py-1 shadow-xl"
          style={{ left: ctx.x, top: ctx.y }}
        >
          <button
            onClick={() => {
              setRenameVal(ctx.path.split('/').pop() ?? ctx.path);
              setRenaming(ctx.path);
              setCtx(null);
            }}
            className="flex w-full items-center gap-2 px-3 py-1 text-left text-xs text-sal-text-muted hover:bg-[#161620] hover:text-sal-text"
          >
            <Pencil size={11} />
            Rename
          </button>
          <button
            onClick={() => {
              onDelete(ctx.path);
              setCtx(null);
            }}
            className="flex w-full items-center gap-2 px-3 py-1 text-left text-xs text-sal-red hover:bg-sal-red/10"
          >
            <Trash2 size={11} />
            Delete
          </button>
        </div>
      )}
    </div>
  );
}
