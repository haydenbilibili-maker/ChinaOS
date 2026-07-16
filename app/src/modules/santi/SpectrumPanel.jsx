import React, { useMemo, useState, useEffect, useCallback, useRef } from 'react';
import { Link } from 'react-router-dom';
import { CANON, DIMS, WORKS, countFullCards } from './santiCanon.js';

const LEDGER_LABELS = {
  realized: '已兑现',
  open: '未决',
  caution: '慎用',
};

function prefersReducedMotion() {
  return typeof window !== 'undefined'
    && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

function DimChips({ dims }) {
  return (
    <span className="st-dims" aria-label={`映射维 ${dims.join(' ')}`}>
      {dims.map((d) => {
        const meta = DIMS.find((x) => x.key === d);
        return (
          <span key={d} className="st-dim-chip mono" data-dim={d} title={meta?.label || d}>
            {d}
          </span>
        );
      })}
    </span>
  );
}

function ConceptDetail({ card, onClose }) {
  useEffect(() => {
    function onKey(e) {
      if (e.key === 'Escape') onClose();
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  const isIndex = card.maturity === 'index';

  return (
    <div
      className="st-drawer-backdrop"
      role="presentation"
      onClick={onClose}
    >
      <aside
        className="st-drawer"
        role="dialog"
        aria-modal="true"
        aria-labelledby={`st-card-title-${card.id}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="st-drawer__head">
          <div>
            <span className="st-drawer__id mono">{card.id}</span>
            {isIndex && <span className="st-badge-index mono">索引</span>}
            {card.uncertainty && <span className="st-badge-doubt mono">〔存疑〕</span>}
            <h3 id={`st-card-title-${card.id}`}>{card.title}</h3>
            <p className="st-drawer__work">{card.work}</p>
          </div>
          <button type="button" className="st-icon-btn" onClick={onClose} aria-label="关闭详情">
            ×
          </button>
        </div>

        <p className="st-drawer__oneliner">{card.oneLiner}</p>
        <DimChips dims={card.dims} />

        {isIndex && card.indexNote && (
          <p className="st-index-note">{card.indexNote}</p>
        )}

        {!isIndex && (
          <>
            <h4 className="st-drawer__h">思想实验前提</h4>
            <ul className="st-precond">
              {card.preconditions.map((p) => (
                <li key={p}>{p}</li>
              ))}
            </ul>
          </>
        )}

        <div className="st-dual">
          <div className="st-dual__col st-dual__similar">
            <h4>相似机制</h4>
            <ul>
              {card.similarMechanisms.map((m) => (
                <li key={m.text}>
                  {m.to ? <Link to={m.to}>{m.text}</Link> : m.text}
                </li>
              ))}
            </ul>
          </div>
          <div className="st-dual__col st-dual__diff">
            <h4>关键差异</h4>
            <ul>
              {card.criticalDiffs.map((d) => (
                <li key={d}>{d}</li>
              ))}
            </ul>
          </div>
        </div>

        <h4 className="st-drawer__h">台账判定</h4>
        <div className="st-ledger">
          {Object.entries(LEDGER_LABELS).map(([k, label]) => (
            <div key={k} className={`st-ledger__cell st-ledger__${k}`}>
              <span className="mono">{label}</span>
              <p>{card.ledger[k]}</p>
            </div>
          ))}
        </div>

        <p className="st-source mono">{card.sourcesNote}</p>
      </aside>
    </div>
  );
}

function ConceptCard({ card, onOpen, highlighted, cardRef }) {
  const isIndex = card.maturity === 'index';
  return (
    <button
      ref={cardRef}
      type="button"
      id={`st-card-${card.id}`}
      data-st-id={card.id}
      className={`st-card${isIndex ? ' st-card--index' : ''}${highlighted ? ' is-highlighted' : ''}`}
      onClick={() => onOpen(card)}
      aria-label={`打开概念卡 ${card.id} ${card.title}`}
    >
      <div className="st-card__meta">
        <span className="mono">{card.id}</span>
        <DimChips dims={card.dims} />
      </div>
      <h3 className="st-card__title">{card.title}</h3>
      <p className="st-card__work">{card.work}</p>
      <p className="st-card__line">{card.oneLiner}</p>
      <div className="st-card__preview" aria-hidden="true">
        <span>相似机制</span>
        <span>关键差异</span>
      </div>
      {isIndex && <span className="st-card__index-tag mono">索引 · R3 深描</span>}
    </button>
  );
}

/**
 * @param {{ highlightIds?: string[], focusId?: string, onHighlightConsumed?: () => void }} props
 */
export default function SpectrumPanel({ highlightIds = [], focusId = null, onHighlightConsumed }) {
  const [work, setWork] = useState('all');
  const [dim, setDim] = useState('all');
  const [active, setActive] = useState(null);
  const [localHighlight, setLocalHighlight] = useState(() => new Set(highlightIds));
  const cardRefs = useRef({});

  useEffect(() => {
    if (!highlightIds?.length) return;
    setLocalHighlight(new Set(highlightIds));
    setWork('all');
    setDim('all');
  }, [highlightIds]);

  useEffect(() => {
    if (!focusId) return;
    const el = cardRefs.current[focusId];
    if (!el) return;
    const behavior = prefersReducedMotion() ? 'auto' : 'smooth';
    const t = window.setTimeout(() => {
      el.scrollIntoView({ behavior, block: 'center' });
      el.focus({ preventScroll: true });
      onHighlightConsumed?.();
    }, 60);
    return () => window.clearTimeout(t);
  }, [focusId, work, dim, onHighlightConsumed]);

  const filtered = useMemo(() => {
    return CANON.filter((c) => {
      if (work !== 'all' && c.workKey !== work) return false;
      if (dim !== 'all' && !c.dims.includes(dim)) return false;
      return true;
    });
  }, [work, dim]);

  const fullN = countFullCards(CANON);
  const onClose = useCallback(() => setActive(null), []);

  return (
    <section className="st-spectrum" aria-labelledby="st-spectrum-h">
      <div className="st-sec-head">
        <h2 id="st-spectrum-h">理论光谱</h2>
        <span className="st-sec-tag mono">公理设定 · 概念卡片 · 双栏对照</span>
      </div>
      <p className="st-lede">
        每张卡强制「相似机制 + 关键差异」双栏。当前母本 {CANON.length} 条，其中完整双栏 {fullN} 张；
        敏感条目以降级索引呈现。点击卡片展开四步映射与台账。
        {localHighlight.size > 0 && (
          <>
            {' '}
            <button
              type="button"
              className="st-inline-clear"
              onClick={() => setLocalHighlight(new Set())}
            >
              清除图 A 高亮（{localHighlight.size}）
            </button>
          </>
        )}
      </p>

      <div className="st-filters" role="toolbar" aria-label="光谱筛选">
        <div className="st-filter-group">
          <span className="st-filter-label mono">作品</span>
          <button type="button" className={`os-filter-chip mono${work === 'all' ? ' is-active' : ''}`} style={{ '--chip-accent': 'var(--st-signal)' }} onClick={() => setWork('all')}>全部</button>
          {WORKS.map((w) => (
            <button
              key={w.key}
              type="button"
              className={`os-filter-chip mono${work === w.key ? ' is-active' : ''}`}
              style={{ '--chip-accent': 'var(--st-signal)' }}
              onClick={() => setWork(w.key)}
            >
              {w.label}
            </button>
          ))}
        </div>
        <div className="st-filter-group">
          <span className="st-filter-label mono">映射维</span>
          <button type="button" className={`os-filter-chip mono${dim === 'all' ? ' is-active' : ''}`} style={{ '--chip-accent': 'var(--st-ice)' }} onClick={() => setDim('all')}>全部</button>
          {DIMS.map((d) => (
            <button
              key={d.key}
              type="button"
              className={`os-filter-chip mono${dim === d.key ? ' is-active' : ''}`}
              style={{ '--chip-accent': 'var(--st-ice)' }}
              onClick={() => setDim(d.key)}
            >
              {d.key} · {d.label}
            </button>
          ))}
        </div>
      </div>

      <div className="st-card-grid">
        {filtered.map((card) => (
          <ConceptCard
            key={card.id}
            card={card}
            onOpen={setActive}
            highlighted={localHighlight.has(card.id)}
            cardRef={(el) => {
              if (el) cardRefs.current[card.id] = el;
              else delete cardRefs.current[card.id];
            }}
          />
        ))}
      </div>

      {filtered.length === 0 && (
        <p className="st-empty">当前筛选无结果，请调整作品或映射维。</p>
      )}

      {active && <ConceptDetail card={active} onClose={onClose} />}
    </section>
  );
}
