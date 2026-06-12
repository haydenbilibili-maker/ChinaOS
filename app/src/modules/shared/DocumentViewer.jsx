import React, { useEffect, useMemo, useRef, useState, useCallback } from 'react';
import {
  X, Sun, Moon, ExternalLink, Copy, Check, Loader2,
  Search, ChevronUp, ChevronDown, ArrowUpToLine, Minus, Plus,
} from 'lucide-react';
import { Markdown } from '../../lib/ai/markdown.jsx';
import { getTheme, setTheme } from '../../lib/theme.js';
import {
  resolveDocument,
  TIER_BADGE_STYLE,
  corpusTierBadgeStyle,
} from '../../lib/doc/documentContent.js';
import * as legalCorpus from '../../lib/doc/legalCorpus.js';
import * as policyCorpus from '../../lib/doc/policyCorpus.js';

const CORPUS_STUB_THRESHOLD = legalCorpus.CORPUS_STUB_THRESHOLD;
import { countMatches, scrollToMatch } from '../../lib/doc/corpusSearch.js';

const pill = (style) => ({
  fontSize: 10,
  fontFamily: 'monospace',
  padding: '3px 10px',
  borderRadius: 999,
  border: `1px solid ${style.border}`,
  background: style.bg,
  color: style.color,
});

const FONT_STEPS = [0.8125, 0.875, 0.9375, 1, 1.0625, 1.125, 1.1875];
const LINE_STEPS = [1.55, 1.7, 1.85, 2, 2.15, 2.3];
const DEFAULT_FONT_IDX = 2;
const DEFAULT_LINE_IDX = 2;

function ChapterBlock({ chapter, searchQuery, activeMatchIndex }) {
  return (
    <section className="doc-reader-chapter mb-6">
      <h3
        className="text-sm font-semibold mb-3 pb-2"
        style={{
          color: 'var(--text-primary)',
          borderBottom: '1px solid var(--border-subtle)',
        }}
      >
        {chapter.title}
      </h3>
      <div className="space-y-3">
        {chapter.articles.map((art, i) => (
          <article
            key={i}
            className="text-sm leading-relaxed pl-3 doc-reader-article"
            style={{
              color: 'var(--text-secondary)',
              borderLeft: '2px solid rgba(34,211,238,0.35)',
            }}
          >
            <Markdown text={art} searchQuery={searchQuery} activeMatchIndex={activeMatchIndex} />
          </article>
        ))}
      </div>
    </section>
  );
}

function MetaRow({ label, value }) {
  if (!value) return null;
  return (
    <div className="min-w-0">
      <div className="text-[10px] mono mb-0.5" style={{ color: 'var(--text-tertiary)' }}>{label}</div>
      <div className="text-xs leading-snug break-words" style={{ color: 'var(--text-secondary)' }}>{value}</div>
    </div>
  );
}

function ReaderToolbar({
  searchQuery,
  onSearchChange,
  matchCount,
  activeMatchIndex,
  onPrev,
  onNext,
  fontIdx,
  lineIdx,
  onFontDown,
  onFontUp,
  onLineDown,
  onLineUp,
  onScrollTop,
}) {
  const btnStyle = {
    background: 'var(--bg-elevated)',
    border: '1px solid var(--border-subtle)',
    color: 'var(--text-secondary)',
    cursor: 'pointer',
  };
  const disabled = matchCount === 0;

  return (
    <div
      className="doc-reader-toolbar shrink-0 px-3 py-2 flex flex-wrap items-center gap-2"
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 3,
        background: 'var(--bg-base)',
        borderBottom: '1px solid var(--border-subtle)',
        backdropFilter: 'blur(8px)',
      }}
    >
      <div className="flex items-center gap-1.5 flex-1 min-w-[180px]">
        <Search size={14} style={{ color: 'var(--text-tertiary)', flexShrink: 0 }} />
        <input
          type="search"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="文内搜索…"
          className="flex-1 min-w-0 px-2 py-1 rounded text-xs mono"
          style={{
            background: 'var(--bg-elevated)',
            border: '1px solid var(--border-subtle)',
            color: 'var(--text-primary)',
          }}
          aria-label="文内关键词搜索"
        />
        {searchQuery.trim() && (
          <span className="text-[10px] mono shrink-0" style={{ color: 'var(--text-tertiary)' }}>
            {matchCount > 0 ? `${activeMatchIndex + 1}/${matchCount}` : '0/0'}
          </span>
        )}
      </div>

      <div className="flex items-center gap-1">
        <button type="button" title="上一处" disabled={disabled} onClick={onPrev} className="p-1.5 rounded" style={{ ...btnStyle, opacity: disabled ? 0.4 : 1 }}>
          <ChevronUp size={14} />
        </button>
        <button type="button" title="下一处" disabled={disabled} onClick={onNext} className="p-1.5 rounded" style={{ ...btnStyle, opacity: disabled ? 0.4 : 1 }}>
          <ChevronDown size={14} />
        </button>
      </div>

      <div className="flex items-center gap-1" title="字号">
        <button type="button" onClick={onFontDown} disabled={fontIdx <= 0} className="p-1.5 rounded" style={{ ...btnStyle, opacity: fontIdx <= 0 ? 0.4 : 1 }}>
          <Minus size={14} />
        </button>
        <span className="text-[10px] mono px-1" style={{ color: 'var(--text-tertiary)' }}>字</span>
        <button type="button" onClick={onFontUp} disabled={fontIdx >= FONT_STEPS.length - 1} className="p-1.5 rounded" style={{ ...btnStyle, opacity: fontIdx >= FONT_STEPS.length - 1 ? 0.4 : 1 }}>
          <Plus size={14} />
        </button>
      </div>

      <div className="flex items-center gap-1" title="行距">
        <button type="button" onClick={onLineDown} disabled={lineIdx <= 0} className="p-1.5 rounded text-[10px] mono" style={{ ...btnStyle, opacity: lineIdx <= 0 ? 0.4 : 1 }}>行−</button>
        <button type="button" onClick={onLineUp} disabled={lineIdx >= LINE_STEPS.length - 1} className="p-1.5 rounded text-[10px] mono" style={{ ...btnStyle, opacity: lineIdx >= LINE_STEPS.length - 1 ? 0.4 : 1 }}>行+</button>
      </div>

      <button type="button" title="回到顶部" onClick={onScrollTop} className="p-1.5 rounded" style={btnStyle}>
        <ArrowUpToLine size={14} />
      </button>
    </div>
  );
}

/**
 * 法律 / 政策原文阅读器
 * @param {{ record: object, kind: 'legal'|'policy', open: boolean, onClose: () => void, mode?: 'overlay'|'inline' }} props
 */
export default function DocumentViewer({ record, kind, open, onClose, mode = 'overlay' }) {
  const scrollRef = useRef(null);
  const [readerTheme, setReaderTheme] = useState(() => getTheme());
  const [copied, setCopied] = useState(false);
  const [corpusEntry, setCorpusEntry] = useState(null);
  const [corpusBody, setCorpusBody] = useState(null);
  const [corpusLoading, setCorpusLoading] = useState(false);
  const [corpusError, setCorpusError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeMatchIndex, setActiveMatchIndex] = useState(0);
  const [fontIdx, setFontIdx] = useState(DEFAULT_FONT_IDX);
  const [lineIdx, setLineIdx] = useState(DEFAULT_LINE_IDX);

  useEffect(() => {
    if (!open || !record) {
      setCorpusEntry(null);
      setCorpusBody(null);
      setCorpusLoading(false);
      setCorpusError(null);
      return undefined;
    }

    const getEntry = kind === 'legal' ? legalCorpus.getCorpusEntry : policyCorpus.getCorpusEntry;
    const fetchBody = kind === 'legal' ? legalCorpus.fetchCorpusBody : policyCorpus.fetchCorpusBody;

    let cancelled = false;
    setCorpusLoading(true);
    setCorpusError(null);
    setCorpusBody(null);

    (async () => {
      try {
        const entry = await getEntry(record.id);
        if (cancelled) return;
        setCorpusEntry(entry);
        if (!entry?.corpusFile) {
          setCorpusLoading(false);
          return;
        }
        const body = await fetchBody(record.id);
        if (cancelled) return;
        setCorpusBody(body);
        setCorpusLoading(false);
      } catch (err) {
        if (cancelled) return;
        setCorpusError(err?.message || '原文加载失败');
        setCorpusLoading(false);
      }
    })();

    return () => { cancelled = true; };
  }, [open, record?.id, kind]);

  useEffect(() => {
    if (!open) {
      setSearchQuery('');
      setActiveMatchIndex(0);
      setFontIdx(DEFAULT_FONT_IDX);
      setLineIdx(DEFAULT_LINE_IDX);
    }
  }, [open, record?.id]);

  const content = useMemo(
    () => (record ? resolveDocument(record, kind, corpusEntry, corpusBody) : null),
    [record, kind, corpusEntry, corpusBody],
  );

  const searchableText = useMemo(() => {
    if (!content) return '';
    const parts = [
      content.body,
      ...(content.chapters || []).flatMap((ch) => [ch.title, ...(ch.articles || [])]),
    ].filter(Boolean);
    return parts.join('\n');
  }, [content]);

  const matchCount = useMemo(
    () => countMatches(searchableText, searchQuery),
    [searchableText, searchQuery],
  );

  useEffect(() => {
    if (matchCount === 0) setActiveMatchIndex(0);
    else if (activeMatchIndex >= matchCount) setActiveMatchIndex(0);
  }, [matchCount, activeMatchIndex]);

  useEffect(() => {
    if (!open || !searchQuery.trim() || matchCount === 0) return undefined;
    const t = requestAnimationFrame(() => {
      scrollToMatch(scrollRef.current, activeMatchIndex);
    });
    return () => cancelAnimationFrame(t);
  }, [open, searchQuery, activeMatchIndex, matchCount]);

  useEffect(() => {
    if (!open) return undefined;
    const prev = document.body.style.overflow;
    if (mode === 'overlay') document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = prev; };
  }, [open, mode]);

  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e) => {
      if (e.key === 'Escape') onClose?.();
      if (e.key === 'Enter' && e.shiftKey && matchCount > 0) {
        e.preventDefault();
        setActiveMatchIndex((i) => (i - 1 + matchCount) % matchCount);
      }
      if (e.key === 'Enter' && !e.shiftKey && document.activeElement?.type === 'search' && matchCount > 0) {
        e.preventDefault();
        setActiveMatchIndex((i) => (i + 1) % matchCount);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose, matchCount]);

  const scrollToTop = useCallback(() => {
    scrollRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const goPrev = useCallback(() => {
    if (matchCount === 0) return;
    setActiveMatchIndex((i) => (i - 1 + matchCount) % matchCount);
  }, [matchCount]);

  const goNext = useCallback(() => {
    if (matchCount === 0) return;
    setActiveMatchIndex((i) => (i + 1) % matchCount);
  }, [matchCount]);

  if (!open || !record) return null;
  if (!content && !corpusLoading) return null;

  const badgeStyle = content?.tier === 'corpus'
    ? corpusTierBadgeStyle(content.corpusTier)
    : (TIER_BADGE_STYLE[content?.tier] || TIER_BADGE_STYLE.fallback);
  const corpusIsStub = content?.tier === 'corpus' && (
    content.corpusTier === 'stub'
    || (corpusBody && corpusBody.length < CORPUS_STUB_THRESHOLD)
  );
  const issuer = kind === 'legal' ? record.issuer : record.org;
  const effective = kind === 'legal' ? record.effectiveDate : record.date;
  const plainText = [
    record.title,
    issuer && `制定机关：${issuer}`,
    effective && `生效/发布：${effective}`,
    content?.body,
    ...(content?.chapters || []).flatMap((ch) => [ch.title, ...ch.articles]),
    ...(content?.attachments || []),
  ].filter(Boolean).join('\n\n');

  const toggleReaderTheme = () => {
    const next = readerTheme === 'dark' ? 'light' : 'dark';
    setReaderTheme(next);
    setTheme(next);
  };

  const copyAll = async () => {
    try {
      await navigator.clipboard.writeText(plainText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard unavailable */
    }
  };

  const shellClass = mode === 'overlay'
    ? 'doc-reader-overlay fixed inset-0 z-[120] flex flex-col md:flex-row md:items-stretch md:justify-end p-0 md:p-4'
    : 'doc-reader-inline flex flex-col h-full min-h-0';

  const panelClass = mode === 'overlay'
    ? 'doc-reader-panel flex flex-col w-full h-full md:max-w-3xl md:rounded-xl md:shadow-2xl overflow-hidden'
    : 'doc-reader-panel flex flex-col h-full min-h-0 overflow-hidden rounded-lg';

  const proseStyle = {
    fontSize: `${FONT_STEPS[fontIdx]}rem`,
    lineHeight: LINE_STEPS[lineIdx],
  };

  return (
    <div
      className={shellClass}
      data-reader-theme={readerTheme}
      role="dialog"
      aria-modal={mode === 'overlay'}
      aria-label={`阅读：${record.title}`}
    >
      {mode === 'overlay' && (
        <button
          type="button"
          aria-label="关闭阅读器"
          onClick={onClose}
          className="absolute inset-0 md:relative md:flex-1 md:min-w-0"
          style={{ background: 'rgba(2,6,23,0.72)', border: 'none', cursor: 'pointer' }}
        />
      )}

      <div
        className={panelClass}
        style={{
          background: 'var(--bg-base)',
          border: mode === 'overlay' ? '1px solid var(--border-subtle)' : '1px solid rgba(34,211,238,0.2)',
        }}
      >
        <header
          className="shrink-0 px-4 py-3 flex items-start gap-3"
          style={{
            background: 'var(--bg-base)',
            borderBottom: '1px solid var(--border-subtle)',
          }}
        >
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2 mb-1">
              {content && <span style={pill(badgeStyle)}>{content.label}</span>}
              {record.status && kind === 'legal' && (
                <span style={pill(TIER_BADGE_STYLE.fallback)}>{record.status}</span>
              )}
            </div>
            <h2 className="text-sm font-semibold leading-snug" style={{ color: 'var(--text-primary)' }}>
              {record.title}
            </h2>
          </div>
          <div className="flex items-center gap-1 shrink-0">
            <button
              type="button"
              onClick={toggleReaderTheme}
              title={readerTheme === 'dark' ? '切换日览' : '切换夜览'}
              className="p-2 rounded"
              style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-subtle)', color: 'var(--text-secondary)', cursor: 'pointer' }}
            >
              {readerTheme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
            </button>
            <button
              type="button"
              onClick={copyAll}
              title="复制全文"
              className="p-2 rounded"
              style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-subtle)', color: 'var(--text-secondary)', cursor: 'pointer' }}
            >
              {copied ? <Check size={16} style={{ color: '#10b981' }} /> : <Copy size={16} />}
            </button>
            <button
              type="button"
              onClick={onClose}
              aria-label="关闭"
              className="p-2 rounded"
              style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-subtle)', color: 'var(--text-secondary)', cursor: 'pointer' }}
            >
              <X size={16} />
            </button>
          </div>
        </header>

        <ReaderToolbar
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          matchCount={matchCount}
          activeMatchIndex={activeMatchIndex}
          onPrev={goPrev}
          onNext={goNext}
          fontIdx={fontIdx}
          lineIdx={lineIdx}
          onFontDown={() => setFontIdx((i) => Math.max(0, i - 1))}
          onFontUp={() => setFontIdx((i) => Math.min(FONT_STEPS.length - 1, i + 1))}
          onLineDown={() => setLineIdx((i) => Math.max(0, i - 1))}
          onLineUp={() => setLineIdx((i) => Math.min(LINE_STEPS.length - 1, i + 1))}
          onScrollTop={scrollToTop}
        />

        <div
          ref={scrollRef}
          className="doc-reader-body flex-1 overflow-y-auto px-4 py-4 min-h-0"
          style={{ WebkitOverflowScrolling: 'touch', scrollBehavior: 'smooth' }}
        >
          <div
            className="grid gap-3 mb-5 p-3 rounded-lg"
            style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', background: 'var(--bg-elevated)' }}
          >
            <MetaRow label="制定机关 / 发布机构" value={issuer} />
            <MetaRow label="生效 / 发布日期" value={effective} />
            {record.type && <MetaRow label="文件类型" value={typeof record.type === 'string' ? record.type : undefined} />}
            {record.category && <MetaRow label="分类" value={record.category} />}
          </div>

          {content?.sourceUrl && (
            <a
              href={content.sourceUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 text-xs mono mb-5 px-2.5 py-1.5 rounded"
              style={{ background: 'rgba(34,211,238,0.1)', color: 'var(--cyber-cyan)', border: '1px solid rgba(34,211,238,0.25)' }}
            >
              <ExternalLink size={13} />
              查阅官方发布渠道
            </a>
          )}

          {corpusLoading && (
            <div className="flex items-center gap-2 py-8 justify-center text-xs mono" style={{ color: 'var(--text-tertiary)' }}>
              <Loader2 size={16} className="animate-spin" />
              正在加载本地原文…
            </div>
          )}

          {corpusError && !corpusLoading && (
            <div className="mb-4 px-3 py-2 rounded text-xs" style={{ background: 'rgba(232,163,23,0.12)', color: '#e8a317', border: '1px solid rgba(232,163,23,0.35)' }}>
              本地原文加载失败，已回退至要点汇编。{corpusError}
            </div>
          )}

          {corpusIsStub && !corpusLoading && !corpusError && (
            <div className="mb-4 px-3 py-2 rounded text-xs" style={{ background: 'rgba(249,115,22,0.12)', color: '#f97316', border: '1px solid rgba(249,115,22,0.35)' }}>
              本地存档篇幅较短（不足 {CORPUS_STUB_THRESHOLD} 字），可能仅为节选或待扩充条目；正式引用请以官方公布全文为准。
            </div>
          )}

          {!corpusLoading && content && (
          <div className="doc-reader-prose" style={proseStyle}>
            {content.chapters?.length > 0 && content.chapters.map((ch) => (
              <ChapterBlock
                key={ch.title}
                chapter={ch}
                searchQuery={searchQuery}
                activeMatchIndex={activeMatchIndex}
              />
            ))}
            {content.body && (
              <div className="doc-reader-markdown">
                <Markdown
                  text={content.body}
                  searchQuery={searchQuery}
                  activeMatchIndex={activeMatchIndex}
                />
              </div>
            )}
          </div>
          )}

          {!corpusLoading && content?.attachments?.length > 0 && (
            <section className="mt-6 pt-4" style={{ borderTop: '1px solid var(--border-subtle)' }}>
              <h3 className="text-xs font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>附件要点</h3>
              <ul className="space-y-1.5">
                {content.attachments.map((a) => (
                  <li
                    key={a}
                    className="text-xs leading-relaxed pl-2"
                    style={{ color: 'var(--text-secondary)', borderLeft: '2px solid rgba(232,163,23,0.5)' }}
                  >
                    {a}
                  </li>
                ))}
              </ul>
            </section>
          )}
        </div>

        <footer
          className="shrink-0 px-4 py-2.5 text-[10px] leading-relaxed"
          style={{
            borderTop: '1px solid var(--border-subtle)',
            color: 'var(--text-tertiary)',
            background: 'var(--bg-elevated)',
          }}
        >
          {content?.disclaimer}
        </footer>
      </div>
    </div>
  );
}

/** 详情面板内「阅读原文」按钮 */
export function ReadDocumentButton({ onClick, hasBody, hasCorpus, className = '' }) {
  const label = hasCorpus ? '阅读原文' : hasBody ? '阅读原文' : '阅读要点汇编';
  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex items-center gap-1.5 text-xs mono px-3 py-1.5 rounded ${className}`}
      style={{
        background: hasCorpus ? 'rgba(16,185,129,0.14)' : 'rgba(196,30,58,0.14)',
        color: hasCorpus ? '#10b981' : 'var(--china-red)',
        border: hasCorpus ? '1px solid rgba(16,185,129,0.35)' : '1px solid rgba(196,30,58,0.35)',
        cursor: 'pointer',
      }}
    >
      {label}
    </button>
  );
}
