import type { BuilderFile } from '@/types';

/* ─── Parse code blocks from markdown into BuilderFile[] ───── */

const LANG_MAP: Record<string, string> = {
  js: 'javascript',
  jsx: 'javascript',
  ts: 'typescript',
  tsx: 'typescript',
  py: 'python',
  rb: 'ruby',
  sh: 'bash',
  yml: 'yaml',
  md: 'markdown',
};

function detectLang(filename: string, hint?: string): string {
  if (hint && hint !== '') {
    return LANG_MAP[hint] ?? hint;
  }
  const ext = filename.split('.').pop()?.toLowerCase() ?? '';
  return LANG_MAP[ext] ?? (ext || 'plaintext');
}

/**
 * Extracts code blocks from AI-generated markdown into BuilderFile objects.
 * Supports formats:
 *   ```lang:filename
 *   ```filename
 *   // filename at start of code block
 */
export function parseFiles(text: string): BuilderFile[] {
  const files: BuilderFile[] = [];
  // Match fenced code blocks: ```lang:filename or ```filename
  const regex = /```(\w*?)(?::|\s+)?([^\n`]*)\n([\s\S]*?)```/g;
  let match: RegExpExecArray | null;

  while ((match = regex.exec(text)) !== null) {
    const langHint = match[1].trim();
    let name = match[2].trim();
    let content = match[3];

    // If no filename was captured in the header, check first line of content
    if (!name && content) {
      const firstLine = content.split('\n')[0].trim();
      // Check for // filename.ext or # filename.ext patterns
      const commentFile = firstLine.match(/^(?:\/\/|#|\/\*)\s*(.+\.\w+)/);
      if (commentFile) {
        name = commentFile[1].trim();
        content = content.split('\n').slice(1).join('\n');
      }
    }

    // Skip blocks with no identifiable filename
    if (!name) {
      name = `file-${files.length + 1}.${langHint || 'txt'}`;
    }

    // Clean up leading/trailing whitespace but preserve internal formatting
    content = content.replace(/^\n+/, '').replace(/\n+$/, '');

    files.push({
      name,
      lang: detectLang(name, langHint),
      content,
    });
  }

  return files;
}

/* ─── Build a nested tree from flat file paths ─────────────── */

export interface TreeNode {
  name: string;
  path: string;
  isDir: boolean;
  children: TreeNode[];
  file?: BuilderFile;
}

export function buildTree(files: BuilderFile[]): TreeNode[] {
  const root: TreeNode[] = [];

  for (const file of files) {
    const parts = file.name.split('/');
    let current = root;

    for (let i = 0; i < parts.length; i++) {
      const part = parts[i];
      const path = parts.slice(0, i + 1).join('/');
      const isDir = i < parts.length - 1;

      let existing = current.find((n) => n.name === part);

      if (!existing) {
        existing = {
          name: part,
          path,
          isDir,
          children: [],
          ...(isDir ? {} : { file }),
        };
        current.push(existing);
      }

      current = existing.children;
    }
  }

  return root;
}

/* ─── Build preview HTML from files ────────────────────────── */

export function buildPreviewHTML(files: BuilderFile[]): string {
  const htmlFile = files.find(
    (f) => f.name.endsWith('.html') || f.name.endsWith('.htm'),
  );
  const cssFiles = files.filter((f) => f.name.endsWith('.css'));
  const jsFiles = files.filter(
    (f) =>
      f.name.endsWith('.js') ||
      f.name.endsWith('.jsx') ||
      f.name.endsWith('.ts') ||
      f.name.endsWith('.tsx'),
  );

  // If there's an HTML file, inject CSS and JS into it
  if (htmlFile) {
    let html = htmlFile.content;

    // Inject CSS before </head> or at start
    if (cssFiles.length > 0) {
      const cssBlock = cssFiles
        .map((f) => `<style>/* ${f.name} */\n${f.content}</style>`)
        .join('\n');
      if (html.includes('</head>')) {
        html = html.replace('</head>', `${cssBlock}\n</head>`);
      } else {
        html = cssBlock + '\n' + html;
      }
    }

    // Inject JS before </body> or at end
    if (jsFiles.length > 0) {
      const jsBlock = jsFiles
        .map((f) => `<script>/* ${f.name} */\n${f.content}</script>`)
        .join('\n');
      if (html.includes('</body>')) {
        html = html.replace('</body>', `${jsBlock}\n</body>`);
      } else {
        html = html + '\n' + jsBlock;
      }
    }

    return html;
  }

  // No HTML file — build a minimal document
  const css = cssFiles.map((f) => f.content).join('\n\n');
  const js = jsFiles.map((f) => f.content).join('\n\n');

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>SAL Builder Preview</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: system-ui, sans-serif; background: #0a0a0a; color: #e5e5e5; padding: 2rem; }
    ${css}
  </style>
</head>
<body>
  <div id="root"></div>
  <script type="module">
    ${js}
  </script>
</body>
</html>`;
}
