import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { Link } from 'react-router-dom';
import {
  X, ListTree, Type, Focus, ExternalLink, Highlighter, NotebookPen, Copy, Check, Minus, Plus, Trash2,
} from 'lucide-react';
import { parseBlocks, buildToc, countChars, readingMinutes, trimLeadingTitle } from './parse.js';
import { addNote, deleteNote, getNotes, useWorkspace } from '../../lib/workspace/store.js';
import './reader.css';

// ============================================================================
// 专属阅读器（VI 2.0 §10）
// 版心 36em 宋体正文 · 目录与滚动定位 · 进度与剩余时长 · 四档字号 · 三种阅读主题
// · 专注模式 · 选中文本划线 / 记笔记（存入个人工作台）
// ============================================================================

const PREFS_KEY = 'chinaos.reader.prefs.v1';
const SIZES = [16, 18, 20, 22];
const THEMES = [
  { id: 'ink', label: '玄' },
  { id: 'paper', label: '宣' },
  { id: 'sepia', label: '护眼' },
];
const COLORS = [
  { id: 'cinnabar', label: '朱' },
  { id: 'brass', label: '铜' },
  { id: 'celadon', label: '青' },
];

function loadPrefs() {
  try {
    const p = JSON.parse(localStorage.getItem(PREFS_KEY) || '{}');
    return { size: SIZES.includes(p.size) ? p.size : 18, theme: THEMES.some((t) => t.id === p.theme) ? p.theme : null, focus: Boolean(p.focus) };
  } catch {
    return { size: 18, theme: null, focus: false };
  }
}

function savePrefs(p) {
  try { localStorage.setItem(PREFS_KEY, JSON.stringify(p)); } catch { /* ignore */ }
}

/* 行内：**粗** *斜* `码` [文](链) */
function inline(text, key) {
  const out = [];
  const re = /(\*\*[^*]+\*\*|\*[^*]+\*|`[^`]+`|\[[^\]]+\]\([^)]+\))/g;
  let last = 0;
  let m;
  let i = 0;
  while ((m = re.exec(text))) {
    if (m.index > last) out.push(text.slice(last, m.index));
    const t = m[0];
    const k = `${key}-${i += 1}`;
    if (t.startsWith('**')) out.push(<strong key={k}>{t.slice(2, -2)}</strong>);
    else if (t.startsWith('`')) out.push(<code key={k}>{t.slice(1, -1)}</code>);
    else if (t.startsWith('[')) {
      const mm = t.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
      const href = mm?.[2] || '';
      const safe = /^(https?:|\/|#)/.test(href) ? href : '#';
      out.push(<a key={k} href={safe} target={safe.startsWith('http') ? '_blank' : undefined} rel="noreferrer">{mm?.[1]}</a>);
    } else out.push(<em key={k}>{t.slice(1, -1)}</em>);
    last = m.index + t.length;
  }
  if (last < text.length) out.push(text.slice(last));
  return out;
}

/** 在一段原文里给划线片段包 <mark> */
function withHighlights(text, highlights, key) {
  if (!highlights?.length) return inline(text, key);
  const marks = highlights
    .map((h) => ({ h, at: text.indexOf(h.source.quote) }))
    .filter((x) => x.at >= 0)
    .sort((a, b) => a.at - b.at);
  const out = [];
  let pos = 0;
  marks.forEach(({ h, at }, i) => {
    if (at < pos) return;
    if (at > pos) out.push(...inline(text.slice(pos, at), `${key}-t${i}`));
    out.push(
      <mark key={`${key}-m${i}`} className={`rd-hl rd-hl--${h.color || 'brass'}`} data-note={h.id} title={h.body || '划线'}>
        {inline(h.source.quote, `${key}-q${i}`)}
      </mark>,
    );
    pos = at + h.source.quote.length;
  });
  if (pos < text.length) out.push(...inline(text.slice(pos), `${key}-end`));
  return out;
}

function Block({ b, hl, current }) {
  const cls = `rd-block rd-${b.type}${current ? ' is-current' : ''}`;
  const props = { 'data-block': b.id, id: `rd-${b.id}`, className: cls };
  switch (b.type) {
    case 'h1': return <h2 {...props}>{inline(b.text, b.id)}</h2>;
    case 'h2': return <h2 {...props}>{inline(b.text, b.id)}</h2>;
    case 'h3': return <h3 {...props}>{inline(b.text, b.id)}</h3>;
    case 'h4': return <h4 {...props}>{inline(b.text, b.id)}</h4>;
    case 'quote': return <blockquote {...props}>{withHighlights(b.text, hl, b.id)}</blockquote>;
    case 'hr': return <hr {...props} />;
    case 'code': return <pre {...props}><code>{b.text}</code></pre>;
    case 'ul':
    case 'ol': {
      const Tag = b.type;
      return <Tag {...props}>{b.items.map((it, i) => <li key={i}>{withHighlights(it, hl, `${b.id}-${i}`)}</li>)}</Tag>;
    }
    default: return <p {...props}>{withHighlights(b.text, hl, b.id)}</p>;
  }
}

export default function Reader({
  open,
  onClose,
  docId,
  title,
  meta = [],
  badge,
  markdown = '',
  loading = false,
  error = '',
  sourceUrl,
  sourcePath,
  disclaimer,
}) {
  const [prefs, setPrefs] = useState(loadPrefs);
  const [progress, setProgress] = useState(0);
  const [currentId, setCurrentId] = useState(null);
  const [tocOpen, setTocOpen] = useState(false);
  const [typeOpen, setTypeOpen] = useState(false);
  const [chromeHidden, setChromeHidden] = useState(false);
  const [sel, setSel] = useState(null); // { x, y, quote, block }
  const [noteDraft, setNoteDraft] = useState(null);
  const [copied, setCopied] = useState(false);
  const scrollRef = useRef(null);
  const notes = useWorkspace(getNotes);

  const blocks = useMemo(() => trimLeadingTitle(parseBlocks(markdown)), [markdown]);
  const toc = useMemo(() => buildToc(blocks), [blocks]);
  const minutes = useMemo(() => readingMinutes(countChars(blocks)), [blocks]);
  const docHighlights = useMemo(() => notes.filter((n) => n.source?.docId && n.source.docId === docId), [notes, docId]);
  const hlByBlock = useMemo(() => {
    const m = {};
    docHighlights.forEach((n) => { (m[n.source.block] ||= []).push(n); });
    return m;
  }, [docHighlights]);

  const siteTheme = typeof document !== 'undefined' && document.documentElement.getAttribute('data-theme') === 'light' ? 'paper' : 'ink';
  const theme = prefs.theme || siteTheme;

  const updatePrefs = useCallback((patch) => {
    setPrefs((p) => { const n = { ...p, ...patch }; savePrefs(n); return n; });
  }, []);

  // 打开时锁定页面滚动
  useEffect(() => {
    if (!open) return undefined;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    scrollRef.current?.scrollTo({ top: 0 });
    return () => { document.body.style.overflow = prev; };
  }, [open, docId]);

  // 进度 + 当前块
  useEffect(() => {
    const el = scrollRef.current;
    if (!open || !el) return undefined;
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const max = el.scrollHeight - el.clientHeight;
        setProgress(max > 0 ? Math.min(1, el.scrollTop / max) : 1);
        const mid = el.getBoundingClientRect().top + el.clientHeight * 0.35;
        const nodes = el.querySelectorAll('[data-block]');
        let cur = null;
        for (const n of nodes) {
          if (n.getBoundingClientRect().top <= mid) cur = n.getAttribute('data-block');
          else break;
        }
        setCurrentId(cur);
      });
    };
    onScroll();
    el.addEventListener('scroll', onScroll, { passive: true });
    return () => { el.removeEventListener('scroll', onScroll); cancelAnimationFrame(raf); };
  }, [open, blocks]);

  // 键盘
  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e) => {
      if (e.target instanceof HTMLElement && /input|textarea/i.test(e.target.tagName)) return;
      if (e.key === 'Escape') { if (sel || noteDraft) { setSel(null); setNoteDraft(null); } else onClose?.(); }
      if (e.key === '+' || e.key === '=') updatePrefs({ size: SIZES[Math.min(SIZES.length - 1, SIZES.indexOf(prefs.size) + 1)] });
      if (e.key === '-') updatePrefs({ size: SIZES[Math.max(0, SIZES.indexOf(prefs.size) - 1)] });
      if (e.key === 'f') updatePrefs({ focus: !prefs.focus });
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose, prefs, updatePrefs, sel, noteDraft]);

  // 选区 → 划线工具条
  const onPointerUp = useCallback(() => {
    const s = window.getSelection?.();
    const text = s?.toString().trim();
    if (!s || !text || s.rangeCount === 0) {
      setSel(null);
      return;
    }
    const range = s.getRangeAt(0);
    const startBlock = range.startContainer.parentElement?.closest('[data-block]');
    const endBlock = range.endContainer.parentElement?.closest('[data-block]');
    if (!startBlock || startBlock !== endBlock || /^h\d$/.test(startBlock.tagName.toLowerCase())) {
      setSel(null);
      return;
    }
    const rect = range.getBoundingClientRect();
    setSel({ x: rect.left + rect.width / 2, y: rect.top, quote: text.slice(0, 600), block: startBlock.getAttribute('data-block') });
  }, []);

  const saveHighlight = (color, body = '') => {
    if (!sel) return;
    addNote({
      title: title || '阅读摘录',
      body,
      color,
      source: { docId, block: sel.block, quote: sel.quote, path: sourcePath || '', label: title || '' },
    });
    window.getSelection?.()?.removeAllRanges();
    setSel(null);
    setNoteDraft(null);
  };

  const copySel = async () => {
    if (!sel) return;
    try {
      await navigator.clipboard?.writeText(`${sel.quote}\n——《${title}》`);
      setCopied(true);
      setTimeout(() => setCopied(false), 1200);
    } catch { /* ignore */ }
  };

  const jump = (id) => {
    const el = scrollRef.current?.querySelector(`#rd-${id}`);
    if (el) scrollRef.current.scrollTo({ top: el.offsetTop - 80, behavior: 'smooth' });
    setTocOpen(false);
  };

  if (!open) return null;

  const remaining = Math.max(0, Math.round(minutes * (1 - progress)));
  const activeTocId = (() => {
    if (!currentId) return toc[0]?.id;
    const idx = blocks.findIndex((b) => b.id === currentId);
    let hit = toc[0]?.id;
    for (const t of toc) {
      if (blocks.findIndex((b) => b.id === t.id) <= idx) hit = t.id;
    }
    return hit;
  })();

  const ui = (
    <div
      className={`rd rd--${theme}${prefs.focus ? ' rd--focus' : ''}${chromeHidden ? ' rd--immersive' : ''}`}
      style={{ '--rd-size': `${prefs.size}px` }}
      role="dialog"
      aria-modal="true"
      aria-label={`阅读：${title}`}
    >
      <header className="rd-bar">
        <button type="button" className="rd-btn" onClick={onClose} aria-label="关闭阅读器"><X size={18} /></button>
        <div className="rd-bar__title" title={title}>{title}</div>
        <div className="rd-bar__tools">
          <span className="rd-bar__time">约剩 {remaining} 分钟</span>
          {toc.length > 0 && (
            <button type="button" className={`rd-btn rd-btn--toc${tocOpen ? ' is-on' : ''}`} onClick={() => setTocOpen((v) => !v)} aria-label="目录" aria-pressed={tocOpen}><ListTree size={18} /></button>
          )}
          <div className="rd-pop-anchor">
            <button type="button" className={`rd-btn${typeOpen ? ' is-on' : ''}`} onClick={() => setTypeOpen((v) => !v)} aria-label="字号与主题" aria-expanded={typeOpen}><Type size={18} /></button>
            {typeOpen && (
              <div className="rd-pop" role="dialog" aria-label="字号与主题">
                <div className="rd-pop__row">
                  <button type="button" className="rd-btn" onClick={() => updatePrefs({ size: SIZES[Math.max(0, SIZES.indexOf(prefs.size) - 1)] })} aria-label="缩小字号"><Minus size={16} /></button>
                  <div className="rd-sizes">
                    {SIZES.map((s) => (
                      <button key={s} type="button" className={`rd-size${prefs.size === s ? ' is-on' : ''}`} onClick={() => updatePrefs({ size: s })} style={{ fontSize: s * 0.8 }} aria-label={`${s} 号`}>文</button>
                    ))}
                  </div>
                  <button type="button" className="rd-btn" onClick={() => updatePrefs({ size: SIZES[Math.min(SIZES.length - 1, SIZES.indexOf(prefs.size) + 1)] })} aria-label="放大字号"><Plus size={16} /></button>
                </div>
                <div className="rd-pop__row rd-themes">
                  {THEMES.map((t) => (
                    <button key={t.id} type="button" className={`rd-theme rd-theme--${t.id}${theme === t.id ? ' is-on' : ''}`} onClick={() => updatePrefs({ theme: t.id })}>{t.label}</button>
                  ))}
                </div>
              </div>
            )}
          </div>
          <button type="button" className={`rd-btn${prefs.focus ? ' is-on' : ''}`} onClick={() => updatePrefs({ focus: !prefs.focus })} aria-label="专注模式" aria-pressed={prefs.focus}><Focus size={18} /></button>
        </div>
        <span className="rd-progress" style={{ transform: `scaleX(${progress})` }} aria-hidden="true" />
      </header>

      <div className="rd-body">
        {toc.length > 0 && (
          <nav className={`rd-toc${tocOpen ? ' is-open' : ''}`} aria-label="目录">
            <span className="rd-toc__head">目录</span>
            <ol>
              {toc.map((t) => (
                <li key={t.id} className={`rd-toc__item rd-toc__item--l${t.level}${activeTocId === t.id ? ' is-on' : ''}`}>
                  <button type="button" onClick={() => jump(t.id)}>{t.text.replace(/[*`]/g, '')}</button>
                </li>
              ))}
            </ol>
            {docHighlights.length > 0 && (
              <div className="rd-toc__hl">
                <span className="rd-toc__head">我的划线 · {docHighlights.length}</span>
                <ul>
                  {docHighlights.map((n) => (
                    <li key={n.id} className={`rd-toc__hl-item rd-toc__hl-item--${n.color || 'brass'}`}>
                      <button type="button" onClick={() => jump(n.source.block)}>{n.source.quote}</button>
                      <button type="button" className="rd-btn rd-btn--xs" onClick={() => deleteNote(n.id)} aria-label="删除划线"><Trash2 size={12} /></button>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </nav>
        )}

        <div
          ref={scrollRef}
          className="rd-scroll"
          onMouseUp={onPointerUp}
          onTouchEnd={() => setTimeout(onPointerUp, 0)}
          onClick={(e) => {
            if (e.target instanceof Element && e.target.closest('a,button,mark')) return;
            if (window.getSelection?.()?.toString()) return;
            if (window.matchMedia?.('(max-width: 767px)').matches) setChromeHidden((v) => !v);
          }}
        >
          <article className="rd-article">
            <header className="rd-head">
              {badge && <span className="rd-badge">{badge}</span>}
              <h1 className="rd-title">{title}</h1>
              {meta.length > 0 && <p className="rd-meta">{meta.filter(Boolean).join(' · ')}</p>}
              <p className="rd-meta rd-meta--time">约 {minutes} 分钟读完{docHighlights.length ? ` · 已划线 ${docHighlights.length} 处` : ''}</p>
            </header>

            {loading && <div className="rd-state" role="status">正在展卷…</div>}
            {error && <div className="rd-state rd-state--err" role="alert">{error}</div>}
            {!loading && !error && blocks.map((b) => (
              <Block key={b.id} b={b} hl={hlByBlock[b.id]} current={b.id === currentId} />
            ))}

            {(sourceUrl || disclaimer) && (
              <footer className="rd-foot">
                {sourceUrl && <a href={sourceUrl} target="_blank" rel="noreferrer" className="rd-foot__src">查看原始出处 <ExternalLink size={13} /></a>}
                {disclaimer && <p>{disclaimer}</p>}
                <Link to="/workspace" className="rd-foot__src" onClick={onClose}>在工作台查看全部笔记</Link>
              </footer>
            )}
          </article>
        </div>
      </div>

      {sel && !noteDraft && (
        <div className="rd-selbar" style={{ left: sel.x, top: sel.y }} role="toolbar" aria-label="划线">
          {COLORS.map((c) => (
            <button key={c.id} type="button" className={`rd-selbar__c rd-selbar__c--${c.id}`} onMouseDown={(e) => e.preventDefault()} onClick={() => saveHighlight(c.id)} aria-label={`${c.label}色划线`}>
              <Highlighter size={14} />{c.label}
            </button>
          ))}
          <span className="rd-selbar__sep" />
          <button type="button" onMouseDown={(e) => e.preventDefault()} onClick={() => setNoteDraft({ color: 'brass', body: '' })}><NotebookPen size={14} />笔记</button>
          <button type="button" onMouseDown={(e) => e.preventDefault()} onClick={copySel}>{copied ? <Check size={14} /> : <Copy size={14} />}{copied ? '已复制' : '复制'}</button>
        </div>
      )}

      {sel && noteDraft && (
        <div className="rd-notebox" style={{ left: sel.x, top: sel.y }} role="dialog" aria-label="写笔记">
          <blockquote>{sel.quote}</blockquote>
          <textarea autoFocus rows={3} value={noteDraft.body} onChange={(e) => setNoteDraft((d) => ({ ...d, body: e.target.value }))} placeholder="你的判断…" aria-label="笔记内容" />
          <div className="rd-notebox__row">
            <div className="rd-notebox__colors">
              {COLORS.map((c) => (
                <button key={c.id} type="button" className={`rd-dot rd-dot--${c.id}${noteDraft.color === c.id ? ' is-on' : ''}`} onClick={() => setNoteDraft((d) => ({ ...d, color: c.id }))} aria-label={c.label} />
              ))}
            </div>
            <button type="button" className="rd-btn rd-btn--text" onClick={() => { setNoteDraft(null); setSel(null); }}>取消</button>
            <button type="button" className="rd-btn rd-btn--primary" onClick={() => saveHighlight(noteDraft.color, noteDraft.body.trim())}>保存</button>
          </div>
        </div>
      )}
    </div>
  );

  return createPortal(ui, document.body);
}
