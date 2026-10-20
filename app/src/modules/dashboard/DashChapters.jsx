import React, { useCallback, useEffect, useState } from 'react';
import { ArrowDown, ArrowUp, Eye, EyeOff, RotateCcw, SlidersHorizontal, X } from 'lucide-react';
import {
  getDashLayout, moveDashSection, resetDashLayout, setDashLayout, toggleDashSection, useWorkspace,
} from '../../lib/workspace/store.js';
import './dashChapters.css';

// ============================================================================
// 中枢看板 · 章节化：编号章节 + 吸顶章节轨（滚动定位）+ 定制面板（显隐 / 排序，本地保存）
// ============================================================================

export const DASH_CHAPTERS = [
  { id: 'overview', title: '总揽', kicker: '宏观读数 · 治理研判 · 信号流' },
  { id: 'gateway', title: '门户', kicker: '八大板块直达' },
  { id: 'map', title: '活图', kicker: '神州活图紧凑预览' },
  { id: 'situation', title: '态势', kicker: '外交矢量 · 施政基准 · 本地库' },
  { id: 'briefing', title: '简报', kicker: '一键生成今日简报' },
  { id: 'screens', title: '大屏', kicker: '人物 · 企业 · 军事数据集' },
  { id: 'toolbox', title: '工具', kicker: '认知内核 · 快速跳转' },
];

const IDS = DASH_CHAPTERS.map((c) => c.id);
const META = Object.fromEntries(DASH_CHAPTERS.map((c) => [c.id, c]));
const anchor = (id) => `dash-ch-${id}`;

export function useDashLayout() {
  const layout = useWorkspace(() => getDashLayout(IDS));
  const commit = useCallback((fn) => setDashLayout(fn(getDashLayout(IDS))), []);
  return {
    layout,
    visible: layout.order.filter((id) => !layout.hidden.includes(id)),
    move: (id, dir) => commit((l) => moveDashSection(l, id, dir)),
    toggle: (id) => commit((l) => toggleDashSection(l, id)),
    reset: resetDashLayout,
  };
}

/** 章节滚动定位：以 #main-content 为根，取越过上沿 30% 的最后一章 */
function useScrollSpy(ids) {
  const [active, setActive] = useState(ids[0]);
  useEffect(() => {
    const root = document.getElementById('main-content');
    if (!root) return undefined;
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const line = root.getBoundingClientRect().top + root.clientHeight * 0.3;
        let cur = ids[0];
        ids.forEach((id) => {
          const el = document.getElementById(anchor(id));
          if (el && el.getBoundingClientRect().top <= line) cur = id;
        });
        setActive(cur);
      });
    };
    root.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => { root.removeEventListener('scroll', onScroll); cancelAnimationFrame(raf); };
  }, [ids.join('|')]); // eslint-disable-line react-hooks/exhaustive-deps
  return active;
}

function jumpTo(id) {
  document.getElementById(anchor(id))?.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

/** 吸顶章节轨 */
export function ChapterRail({ ids, onCustomize }) {
  const active = useScrollSpy(ids);
  return (
    <nav className="dch-rail" aria-label="看板章节">
      <ol className="dch-rail__list">
        {ids.map((id, i) => (
          <li key={id}>
            <button
              type="button"
              className={`dch-rail__item${active === id ? ' is-on' : ''}`}
              aria-current={active === id ? 'true' : undefined}
              onClick={() => jumpTo(id)}
            >
              <span className="dch-rail__no vi-figure">{String(i + 1).padStart(2, '0')}</span>
              {META[id].title}
            </button>
          </li>
        ))}
      </ol>
      <button type="button" className="dch-rail__custom" onClick={onCustomize}>
        <SlidersHorizontal size={14} aria-hidden="true" />
        <span>定制</span>
      </button>
    </nav>
  );
}

/** 章节容器：编号 + 标题 + 眉注 */
export function Chapter({ id, index, children, aside }) {
  const meta = META[id];
  return (
    <section id={anchor(id)} className="dch" aria-labelledby={`${anchor(id)}-t`}>
      <header className="dch__head">
        <span className="dch__no vi-figure" aria-hidden="true">{String(index + 1).padStart(2, '0')}</span>
        <h2 id={`${anchor(id)}-t`} className="dch__title">{meta.title}</h2>
        <span className="dch__kicker">{meta.kicker}</span>
        {aside && <span className="dch__aside">{aside}</span>}
      </header>
      {children}
    </section>
  );
}

/** 定制面板：显隐与排序 */
export function CustomizePanel({ open, onClose, dash }) {
  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);
  if (!open) return null;
  const { layout, move, toggle, reset } = dash;
  return (
    <div className="dch-panel" role="dialog" aria-modal="false" aria-label="定制看板">
      <header className="dch-panel__head">
        <div>
          <p className="dch-panel__eyebrow">我的看板</p>
          <h3>章节显隐与顺序</h3>
        </div>
        <button type="button" className="dch-icon-btn" onClick={onClose} aria-label="关闭"><X size={16} /></button>
      </header>
      <ol className="dch-panel__list">
        {layout.order.map((id, i) => {
          const off = layout.hidden.includes(id);
          return (
            <li key={id} className={`dch-panel__row${off ? ' is-off' : ''}`}>
              <span className="dch-panel__no vi-figure">{String(i + 1).padStart(2, '0')}</span>
              <span className="dch-panel__name">
                <b>{META[id].title}</b>
                <small>{META[id].kicker}</small>
              </span>
              <button type="button" className="dch-icon-btn" onClick={() => move(id, -1)} disabled={i === 0} aria-label={`${META[id].title} 上移`}><ArrowUp size={14} /></button>
              <button type="button" className="dch-icon-btn" onClick={() => move(id, 1)} disabled={i === layout.order.length - 1} aria-label={`${META[id].title} 下移`}><ArrowDown size={14} /></button>
              <button type="button" className={`dch-icon-btn${off ? '' : ' is-on'}`} onClick={() => toggle(id)} aria-pressed={!off} aria-label={`${off ? '显示' : '隐藏'} ${META[id].title}`}>
                {off ? <EyeOff size={14} /> : <Eye size={14} />}
              </button>
            </li>
          );
        })}
      </ol>
      <footer className="dch-panel__foot">
        <span>保存在本机浏览器</span>
        <button type="button" className="dch-text-btn" onClick={reset}><RotateCcw size={13} aria-hidden="true" /> 恢复默认</button>
      </footer>
    </div>
  );
}
