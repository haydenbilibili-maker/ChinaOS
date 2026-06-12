import React from 'react';
import { splitByMatches } from '../doc/corpusSearch.js';

// ============================================================================
// 轻量 Markdown 渲染（无第三方依赖，主题自适应 · 用 CSS 变量）
// 支持：标题 / 列表 / 引用 / 代码块 / 行内代码 / 加粗 / 斜体 / 链接 / 分隔线
// 目标：覆盖 AI 结构化输出（背景/现状/数据/推演/结论、选项/成本/风险/建议）。
// ============================================================================

function renderMark(text, keyBase, matchIndex, activeMatchIndex) {
  const active = matchIndex === activeMatchIndex;
  return (
    <mark
      key={`${keyBase}-mk${matchIndex}`}
      data-search-match={matchIndex}
      className={active ? 'doc-search-active' : 'doc-search-hit'}
    >
      {text}
    </mark>
  );
}

// 行内：**bold** *italic* `code` [text](url) · 可选 searchQuery 高亮
function renderInline(text, keyBase, searchQuery, matchCounter, activeMatchIndex) {
  const segments = searchQuery?.trim()
    ? splitByMatches(text, searchQuery)
    : [{ text, match: false }];

  const nodes = [];
  segments.forEach((seg, si) => {
    if (seg.match) {
      const idx = matchCounter.n++;
      nodes.push(renderMark(seg.text, `${keyBase}-s${si}`, idx, activeMatchIndex));
      return;
    }
    const chunk = seg.text;
    const re = /(\*\*([^*]+)\*\*)|(\*([^*]+)\*)|(`([^`]+)`)|(\[([^\]]+)\]\(([^)]+)\))/g;
    let last = 0;
    let m;
    let i = 0;
    while ((m = re.exec(chunk)) !== null) {
      if (m.index > last) {
        const plain = chunk.slice(last, m.index);
        if (searchQuery?.trim()) {
          splitByMatches(plain, searchQuery).forEach((p, pi) => {
            if (p.match) {
              const idx = matchCounter.n++;
              nodes.push(renderMark(p.text, `${keyBase}-p${si}-${i}-${pi}`, idx, activeMatchIndex));
            } else if (p.text) nodes.push(p.text);
          });
        } else {
          nodes.push(plain);
        }
      }
      if (m[2]) {
        nodes.push(<strong key={`${keyBase}-b${si}-${i}`} style={{ color: 'var(--text-primary)' }}>{m[2]}</strong>);
      } else if (m[4]) {
        nodes.push(<em key={`${keyBase}-i${si}-${i}`}>{m[4]}</em>);
      } else if (m[6]) {
        nodes.push(
          <code key={`${keyBase}-c${si}-${i}`} style={{
            background: 'var(--bg-base)', border: '1px solid var(--border-subtle)',
            borderRadius: 4, padding: '1px 5px', fontSize: '0.85em',
          }} className="mono">{m[6]}</code>
        );
      } else if (m[8]) {
        nodes.push(
          <a key={`${keyBase}-a${si}-${i}`} href={m[9]} target="_blank" rel="noreferrer"
            style={{ color: 'var(--cyber-cyan)', textDecoration: 'underline' }}>{m[8]}</a>
        );
      }
      last = m.index + m[0].length;
      i++;
    }
    if (last < chunk.length) {
      const tail = chunk.slice(last);
      if (searchQuery?.trim()) {
        splitByMatches(tail, searchQuery).forEach((p, pi) => {
          if (p.match) {
            const idx = matchCounter.n++;
            nodes.push(renderMark(p.text, `${keyBase}-t${si}-${pi}`, idx, activeMatchIndex));
          } else if (p.text) nodes.push(p.text);
        });
      } else {
        nodes.push(tail);
      }
    }
  });
  return nodes;
}

export function Markdown({
  text = '',
  searchQuery = '',
  activeMatchIndex = -1,
  onMatchCount,
}) {
  const matchCounter = { n: 0 };
  const lines = String(text).replace(/\r\n/g, '\n').split('\n');
  const blocks = [];
  let list = null;        // { ordered, items: [] }
  let code = null;        // { lines: [] }
  let para = [];

  const flushPara = () => {
    if (para.length) {
      const key = `p${blocks.length}`;
      blocks.push(
        <p key={key} style={{ margin: '0.5em 0', lineHeight: 1.7, color: 'var(--text-secondary)' }}>
          {renderInline(para.join(' '), key, searchQuery, matchCounter, activeMatchIndex)}
        </p>
      );
      para = [];
    }
  };
  const flushList = () => {
    if (list) {
      const key = `l${blocks.length}`;
      const Tag = list.ordered ? 'ol' : 'ul';
      blocks.push(
        <Tag key={key} style={{
          margin: '0.5em 0', paddingLeft: '1.4em', lineHeight: 1.7,
          color: 'var(--text-secondary)', listStyle: list.ordered ? 'decimal' : 'disc',
        }}>
          {list.items.map((it, idx) => (
            <li key={`${key}-${idx}`} style={{ margin: '0.2em 0' }}>
              {renderInline(it, `${key}-${idx}`, searchQuery, matchCounter, activeMatchIndex)}
            </li>
          ))}
        </Tag>
      );
      list = null;
    }
  };

  lines.forEach((rawLine) => {
    const line = rawLine;

    // 代码围栏
    const fence = line.match(/^```(.*)$/);
    if (fence) {
      if (code) {
        const key = `code${blocks.length}`;
        blocks.push(
          <pre key={key} className="mono" style={{
            background: 'var(--bg-base)', border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-sm)', padding: '10px 12px', overflowX: 'auto',
            fontSize: '0.82em', color: 'var(--text-primary)', margin: '0.6em 0',
          }}><code>{code.lines.join('\n')}</code></pre>
        );
        code = null;
      } else {
        flushPara(); flushList();
        code = { lines: [] };
      }
      return;
    }
    if (code) { code.lines.push(line); return; }

    // 空行
    if (!line.trim()) { flushPara(); flushList(); return; }

    // 分隔线
    if (/^(\s*[-*_]){3,}\s*$/.test(line)) {
      flushPara(); flushList();
      blocks.push(<hr key={`hr${blocks.length}`} style={{ border: 'none', borderTop: '1px solid var(--border-subtle)', margin: '0.8em 0' }} />);
      return;
    }

    // 标题
    const h = line.match(/^(#{1,4})\s+(.*)$/);
    if (h) {
      flushPara(); flushList();
      const level = h[1].length;
      const sizes = { 1: '1.25rem', 2: '1.1rem', 3: '1rem', 4: '0.95rem' };
      const key = `h${blocks.length}`;
      blocks.push(
        React.createElement(`h${Math.min(level + 1, 6)}`, {
          key,
          style: { margin: '0.7em 0 0.3em', fontWeight: 700, fontSize: sizes[level], color: 'var(--text-primary)' },
        }, renderInline(h[2], key, searchQuery, matchCounter, activeMatchIndex))
      );
      return;
    }

    // 引用
    const q = line.match(/^>\s?(.*)$/);
    if (q) {
      flushPara(); flushList();
      const key = `q${blocks.length}`;
      blocks.push(
        <blockquote key={key} style={{
          borderLeft: '3px solid var(--cyber-cyan)', paddingLeft: 12, margin: '0.5em 0',
          color: 'var(--text-tertiary)', fontStyle: 'italic',
        }}>{renderInline(q[1], key, searchQuery, matchCounter, activeMatchIndex)}</blockquote>
      );
      return;
    }

    // 列表
    const ol = line.match(/^\s*\d+\.\s+(.*)$/);
    const ul = line.match(/^\s*[-*+]\s+(.*)$/);
    if (ol || ul) {
      flushPara();
      const ordered = Boolean(ol);
      if (!list || list.ordered !== ordered) { flushList(); list = { ordered, items: [] }; }
      list.items.push((ol || ul)[1]);
      return;
    }

    // 普通段落
    flushList();
    para.push(line.trim());
  });

  flushPara();
  flushList();
  if (code) {
    blocks.push(
      <pre key={`code${blocks.length}`} className="mono" style={{
        background: 'var(--bg-base)', border: '1px solid var(--border-subtle)',
        borderRadius: 'var(--radius-sm)', padding: '10px 12px', overflowX: 'auto',
        fontSize: '0.82em', color: 'var(--text-primary)', margin: '0.6em 0',
      }}><code>{code.lines.join('\n')}</code></pre>
    );
  }

  const totalMatches = matchCounter.n;
  if (onMatchCount) onMatchCount(totalMatches);

  return <div className="os-md" style={{ fontSize: 'inherit' }}>{blocks}</div>;
}

export default Markdown;
