// ============================================================================
// 阅读器 · Markdown → 块（无依赖）。每块带稳定 id，供目录、进度与划线定位。
// 支持：frontmatter（剔除）、# ~ ####、段落、有序 / 无序列表、引用、分隔线、代码块。
// ============================================================================

/** @typedef {{ id: string, type: 'h1'|'h2'|'h3'|'h4'|'p'|'ul'|'ol'|'quote'|'hr'|'code', text?: string, items?: string[] }} Block */

export function stripFrontmatter(md) {
  const s = String(md || '').replace(/\r\n/g, '\n');
  if (!s.startsWith('---\n')) return s;
  const end = s.indexOf('\n---', 4);
  return end === -1 ? s : s.slice(end + 4).replace(/^\n+/, '');
}

/** @returns {Block[]} */
export function parseBlocks(md) {
  const lines = stripFrontmatter(md).split('\n');
  /** @type {Block[]} */
  const blocks = [];
  let para = [];
  let list = null;
  let quote = [];
  let code = null;
  const push = (b) => blocks.push({ id: `b${blocks.length}`, ...b });
  const flushPara = () => { if (para.length) { push({ type: 'p', text: para.join('') }); para = []; } };
  const flushList = () => { if (list) { push({ type: list.ordered ? 'ol' : 'ul', items: list.items }); list = null; } };
  const flushQuote = () => { if (quote.length) { push({ type: 'quote', text: quote.join('') }); quote = []; } };
  const flushAll = () => { flushPara(); flushList(); flushQuote(); };

  for (const raw of lines) {
    const line = raw.replace(/\s+$/, '');
    if (code) {
      if (/^```/.test(line)) { push({ type: 'code', text: code.join('\n') }); code = null; } else code.push(raw);
      continue;
    }
    if (/^```/.test(line)) { flushAll(); code = []; continue; }
    if (!line.trim()) { flushAll(); continue; }

    const h = line.match(/^(#{1,4})\s+(.*)$/);
    if (h) { flushAll(); push({ type: `h${h[1].length}`, text: h[2].trim() }); continue; }
    if (/^(-{3,}|\*{3,}|_{3,})$/.test(line.trim())) { flushAll(); push({ type: 'hr' }); continue; }

    const q = line.match(/^>\s?(.*)$/);
    if (q) { flushPara(); flushList(); quote.push(q[1]); continue; }

    const ul = line.match(/^\s*[-*+]\s+(.*)$/);
    const ol = line.match(/^\s*\d+[.、)]\s+(.*)$/);
    if (ul || ol) {
      flushPara(); flushQuote();
      const ordered = Boolean(ol);
      if (!list || list.ordered !== ordered) { flushList(); list = { ordered, items: [] }; }
      list.items.push((ul || ol)[1]);
      continue;
    }

    flushList(); flushQuote();
    para.push(line.trim());
  }
  if (code) push({ type: 'code', text: code.join('\n') });
  flushAll();
  return blocks;
}

/** 目录：h2 / h3 */
export function buildToc(blocks) {
  return blocks.filter((b) => b.type === 'h2' || b.type === 'h3').map((b) => ({ id: b.id, level: b.type === 'h2' ? 2 : 3, text: b.text }));
}

/** 正文字数（去 markdown 记号） */
export function countChars(blocks) {
  return blocks.reduce((n, b) => n + (b.text || '').replace(/[*_`#>[\]()]/g, '').length + (b.items || []).join('').length, 0);
}

/** 中文约每分钟 450 字 */
export function readingMinutes(chars) {
  return Math.max(1, Math.round(chars / 450));
}

/** 语料文件开头常重复标题（# …）与元信息引用（> 日期 · 机关），阅读器页头已展示，去掉 */
export function trimLeadingTitle(blocks) {
  let start = 0;
  if (blocks[start]?.type === 'h1') start += 1;
  if (start > 0 && blocks[start]?.type === 'quote' && (blocks[start].text || '').length <= 80) start += 1;
  return start ? blocks.slice(start) : blocks;
}
