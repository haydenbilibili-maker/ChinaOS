// ============================================================================
// 阅读器 · HTML 卷页 → Markdown（无依赖）。
// 供史鉴卷 / 静态报告的「阅读模式」：抽出标题、段落、列表、引用、表格为可读文本，
// 交互图示以占位提示代替（原卷仍可在页内查看）。
// 输入为 DOM 节点（浏览器 DOMParser 产物）；测试时用最小节点桩。
// ============================================================================

const SKIP = new Set(['script', 'style', 'noscript', 'template', 'nav', 'button', 'form', 'input', 'select', 'textarea', 'canvas', 'iframe', 'video', 'audio', 'link', 'meta', 'head']);
const BLOCK = new Set(['address', 'article', 'aside', 'blockquote', 'dd', 'details', 'div', 'dl', 'dt', 'fieldset', 'figcaption', 'figure', 'footer', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'header', 'hr', 'li', 'main', 'ol', 'p', 'pre', 'section', 'summary', 'table', 'ul', 'svg']);
const TEXT_NODE = 3;
const MEANINGFUL = /[\p{L}\p{N}]/u;
const UI_HINT = /^(点击|点选|轻触|拖动|悬停)/;
const ELEMENT_NODE = 1;

const tag = (n) => String(n?.tagName || '').toLowerCase();
const attr = (n, k) => (typeof n?.getAttribute === 'function' ? n.getAttribute(k) : null);
const kids = (n) => Array.from(n?.childNodes || []);
const squash = (s) => String(s || '').replace(/[\s ]+/g, ' ').trim();

function hidden(n) {
  if (attr(n, 'aria-hidden') === 'true' || attr(n, 'hidden') != null) return true;
  const cls = String(attr(n, 'class') || '');
  return /\b(no-read|sr-only|visually-hidden)\b/.test(cls);
}

/** 行内文本：保留 **粗体**，忽略其余标签 */
function inlineText(n) {
  if (n.nodeType === TEXT_NODE) return n.textContent || '';
  if (n.nodeType !== ELEMENT_NODE) return '';
  const t = tag(n);
  if (SKIP.has(t) || t === 'svg' || hidden(n)) return '';
  if (t === 'br') return ' ';
  const inner = kids(n).map(inlineText).join('');
  if ((t === 'strong' || t === 'b') && squash(inner)) return `**${squash(inner)}**`;
  return inner;
}

const hasBlockChild = (n) => kids(n).some((c) => c.nodeType === ELEMENT_NODE && BLOCK.has(tag(c)) && !hidden(c));

function svgLabel(n) {
  const titleEl = kids(n).find((c) => tag(c) === 'title');
  return squash(attr(n, 'aria-label') || titleEl?.textContent || '');
}

/**
 * @param {Node} root
 * @returns {string} markdown
 */
export function htmlToMarkdown(root) {
  const out = [];
  const para = (s) => {
    const t = squash(s);
    if (!t || !MEANINGFUL.test(t)) return; // 纯图标 / 符号
    if (t.length < 20 && UI_HINT.test(t)) return; // 交互提示（「点击揭开」）
    out.push(t, '');
  };

  const walk = (n) => {
    if (n.nodeType === TEXT_NODE) { para(n.textContent); return; }
    if (n.nodeType !== ELEMENT_NODE) return;
    const t = tag(n);
    if (SKIP.has(t) || hidden(n)) return;

    const h = t.match(/^h([1-6])$/);
    if (h) {
      const text = squash(kids(n).map(inlineText).join('').replace(/\*\*/g, ''));
      if (text) out.push(`${'#'.repeat(Math.min(4, Number(h[1])))} ${text}`, '');
      return;
    }
    if (t === 'svg') {
      const label = svgLabel(n);
      if (label) out.push(`> 〔图示〕${label}（交互图见原卷）`, '');
      return;
    }
    if (t === 'hr') { out.push('---', ''); return; }
    if (t === 'pre') { out.push('```', String(n.textContent || '').replace(/\n+$/, ''), '```', ''); return; }
    if (t === 'blockquote') {
      const text = squash(kids(n).map(inlineText).join(' '));
      if (text) out.push(`> ${text}`, '');
      return;
    }
    if (t === 'ul' || t === 'ol') {
      let i = 0;
      kids(n).forEach((li) => {
        if (tag(li) !== 'li' || hidden(li)) return;
        const text = squash(kids(li).map(inlineText).join(' '));
        if (!text) return;
        i += 1;
        out.push(t === 'ol' ? `${i}. ${text}` : `- ${text}`);
      });
      if (i) out.push('');
      return;
    }
    if (t === 'table') {
      const rows = [];
      const collect = (x) => kids(x).forEach((c) => {
        const ct = tag(c);
        if (ct === 'tr') rows.push(kids(c).filter((d) => /^t[hd]$/.test(tag(d))).map((d) => squash(kids(d).map(inlineText).join(' '))));
        else if (/^(thead|tbody|tfoot)$/.test(ct)) collect(c);
      });
      collect(n);
      const cap = kids(n).find((c) => tag(c) === 'caption');
      if (cap) para(`**${squash(cap.textContent)}**`);
      const [head, ...body] = rows;
      if (!head) return;
      if (!body.length) { out.push(`- ${head.join('｜')}`, ''); return; }
      body.forEach((r) => {
        const cells = r.map((c, i) => (head[i] && i > 0 && c ? `${head[i]}：${c}` : c)).filter(Boolean);
        if (cells.length) out.push(`- ${cells[0] ? `**${cells[0]}**` : ''}${cells.length > 1 ? `　${cells.slice(1).join('；')}` : ''}`);
      });
      out.push('');
      return;
    }
    if (t === 'p' || t === 'figcaption' || t === 'dt' || t === 'dd' || t === 'summary' || !hasBlockChild(n)) {
      para(kids(n).map(inlineText).join(''));
      return;
    }
    // 容器：行内碎片按段收集，块级子节点递归
    let buf = '';
    kids(n).forEach((c) => {
      const isBlock = c.nodeType === ELEMENT_NODE && BLOCK.has(tag(c));
      if (isBlock) { para(buf); buf = ''; walk(c); } else buf += inlineText(c);
    });
    para(buf);
  };

  walk(root);
  return out.join('\n').replace(/\n{3,}/g, '\n\n').trim();
}

/** 在已解析文档里挑正文根：唯一的 main，否则 body（article 常是卡片，不作根） */
export function pickContentRoot(doc) {
  const mains = doc?.querySelectorAll?.('main');
  if (mains && mains.length === 1) return mains[0];
  return doc?.body || doc;
}
