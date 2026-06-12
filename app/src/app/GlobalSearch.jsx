import React, { useEffect, useRef, useState, useMemo, useDeferredValue, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import * as Lucide from 'lucide-react';
import { buildSearchIndex, buildModuleRecords, searchRecords, SEARCH_INDEX_REVISION } from '../lib/search/buildIndex.js';

// 结果类型元信息：标签、配色、图标、分组顺序
const TYPE_META = {
  module: { label: '模块', accent: '#22d3ee', icon: 'LayoutGrid' },
  figure: { label: '中国政要', accent: '#c41e3a', icon: 'UserRound' },
  enterprise: { label: '企业', accent: '#fb923c', icon: 'Building2' },
  anticorruption: { label: '反腐', accent: '#e8a317', icon: 'Gavel' },
  knowledge: { label: '知识精英', accent: '#a78bfa', icon: 'Sparkles' },
  culture: { label: '知识精英', accent: '#a78bfa', icon: 'Sparkles' },
  business: { label: '商业', accent: '#d4af37', icon: 'Briefcase' },
  education: { label: '高等教育', accent: '#10b981', icon: 'GraduationCap' },
  thinktank: { label: '智库', accent: '#22d3ee', icon: 'Landmark' },
  research: { label: '科研院所', accent: '#a78bfa', icon: 'FlaskConical' },
  overseas: { label: '海外人才', accent: '#0ea5e9', icon: 'Globe2' },
  diplomatic: { label: '外交人才', accent: '#f59e0b', icon: 'Landmark' },
  dissident: { label: '异见人士', accent: '#a78bfa', icon: 'Megaphone' },
  taiwan: { label: '港澳台政要', accent: '#38bdf8', icon: 'Landmark' },
  policy: { label: '政策文件', accent: '#ef4444', icon: 'FileText' },
  legal: { label: '法律条文', accent: '#8b5cf6', icon: 'BookMarked' },
};
const TYPE_ORDER = ['module', 'legal', 'figure', 'policy', 'knowledge', 'culture', 'business', 'education', 'thinktank', 'research', 'overseas', 'diplomatic', 'dissident', 'taiwan', 'anticorruption', 'enterprise'];

// 精选入口（空查询时的快捷建议）
const FEATURED = [
  { label: '人才精英库', path: '/talent', icon: 'UsersRound' },
  { label: '军事力量', path: '/military', icon: 'Shield' },
  { label: '民企500强', path: '/enterprise500', icon: 'Building2' },
  { label: '台海局势', path: '/straits', icon: 'Crosshair' },
  { label: '科技树', path: '/techtree', icon: 'GitBranch' },
  { label: '治国沙盒', path: '/sandbox', icon: 'Boxes' },
];

function Icon({ name, size = 16, ...rest }) {
  const Cmp = Lucide[name] || Lucide.Square;
  return <Cmp size={size} strokeWidth={1.75} {...rest} />;
}

// 高亮命中子串（大小写不敏感）
function Highlight({ text, query }) {
  const q = (query || '').trim();
  if (!q) return text;
  const lower = text.toLowerCase();
  const ql = q.toLowerCase();
  const idx = lower.indexOf(ql);
  if (idx === -1) return text;
  return (
    <>
      {text.slice(0, idx)}
      <span style={{ color: 'var(--cyber-cyan)', fontWeight: 600 }}>{text.slice(idx, idx + q.length)}</span>
      {text.slice(idx + q.length)}
    </>
  );
}

export default function GlobalSearch({ open, onClose }) {
  const navigate = useNavigate();
  const inputRef = useRef(null);
  const listRef = useRef(null);
  const [records, setRecords] = useState(() => buildModuleRecords());
  const [counts, setCounts] = useState(null);
  const [indexRevision, setIndexRevision] = useState(null);
  const [loaded, setLoaded] = useState(false);
  const [building, setBuilding] = useState(false);
  const [query, setQuery] = useState('');
  const [active, setActive] = useState(0);
  const deferredQuery = useDeferredValue(query);

  const indexStale = indexRevision != null && indexRevision !== SEARCH_INDEX_REVISION;

  // 首次打开或种子版本变更时重建索引
  useEffect(() => {
    if (!open) return;
    if (indexStale) {
      setLoaded(false);
      setRecords(buildModuleRecords());
      setCounts(null);
    }
    if ((loaded && !indexStale) || building) return;
    setBuilding(true);
    buildSearchIndex().then(({ records: recs, counts: c, revision }) => {
      setRecords(recs);
      setCounts(c);
      setIndexRevision(revision || SEARCH_INDEX_REVISION);
      setLoaded(true);
      setBuilding(false);
    }).catch(() => setBuilding(false));
  }, [open, loaded, building, indexStale]);

  // 打开时聚焦输入框；关闭时重置查询
  useEffect(() => {
    if (open) {
      setActive(0);
      const t = setTimeout(() => inputRef.current?.focus(), 30);
      return () => clearTimeout(t);
    }
    setQuery('');
    return undefined;
  }, [open]);

  const { groups, total } = useMemo(
    () => searchRecords(records, deferredQuery, 6),
    [records, deferredQuery],
  );

  // 扁平化可见结果，供键盘上下选择
  const flat = useMemo(() => groups.flatMap((g) => g.items), [groups]);

  useEffect(() => { setActive(0); }, [deferredQuery]);

  const go = useCallback((path) => {
    if (!path) return;
    onClose?.();
    navigate(path);
  }, [navigate, onClose]);

  const onKeyDown = (e) => {
    if (e.key === 'Escape') { e.preventDefault(); onClose?.(); return; }
    if (!flat.length) return;
    if (e.key === 'ArrowDown') { e.preventDefault(); setActive((i) => Math.min(i + 1, flat.length - 1)); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); setActive((i) => Math.max(i - 1, 0)); }
    else if (e.key === 'Enter') { e.preventDefault(); go(flat[active]?.path); }
  };

  // 选中项滚动进入可视区
  useEffect(() => {
    if (!open) return;
    const el = listRef.current?.querySelector('[data-active="true"]');
    el?.scrollIntoView({ block: 'nearest' });
  }, [active, open]);

  if (!open) return null;

  const hasQuery = deferredQuery.trim().length > 0;
  let flatIndex = -1;

  return (
    <div
      role="dialog"
      aria-modal="true"
      onMouseDown={onClose}
      style={{
        position: 'fixed', inset: 0, zIndex: 1000,
        display: 'flex', alignItems: 'flex-start', justifyContent: 'center',
        padding: '12vh 16px 16px',
        background: 'var(--overlay-backdrop)', backdropFilter: 'blur(6px)',
      }}
    >
      <div
        onMouseDown={(e) => e.stopPropagation()}
        onKeyDown={onKeyDown}
        style={{
          width: '100%', maxWidth: 640, maxHeight: '72vh',
          display: 'flex', flexDirection: 'column',
          background: 'var(--modal-surface)',
          border: '1px solid var(--border-subtle)',
          borderRadius: 'var(--radius-lg)',
          boxShadow: 'var(--modal-shadow)',
          overflow: 'hidden',
        }}
      >
        {/* 输入栏 */}
        <div className="flex items-center gap-2.5 px-4" style={{ borderBottom: '1px solid var(--border-subtle)', height: 54 }}>
          <Icon name="Search" size={18} style={{ color: 'var(--cyber-cyan)' }} />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="搜索模块 / 政要 / 知识精英 / 商业 / 高校 / 智库 / 院所 / 反腐…"
            style={{
              flex: 1, background: 'transparent', border: 'none', outline: 'none',
              color: 'var(--text-primary)', fontSize: 'var(--text-md)',
            }}
          />
          {building && <span className="mono text-xs" style={{ color: 'var(--text-tertiary)' }}>建索引…</span>}
          <kbd className="mono text-[10px] px-1.5 py-0.5 rounded" style={{ background: 'var(--bg-base)', color: 'var(--text-tertiary)', border: '1px solid var(--border-subtle)' }}>Esc</kbd>
        </div>

        {/* 结果区 */}
        <div ref={listRef} style={{ flex: 1, overflowY: 'auto', padding: '8px 8px 10px' }}>
          {!hasQuery ? (
            <div className="px-2 py-2">
              <div className="text-[10px] mono mb-2 px-1" style={{ color: 'var(--text-tertiary)' }}>
                快捷入口{counts ? ` · 已索引 ${records.length} 条` : ''}
              </div>
              <div className="grid gap-1.5" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(160px,1fr))' }}>
                {FEATURED.map((f) => (
                  <button
                    key={f.path}
                    onClick={() => go(f.path)}
                    className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-left"
                    style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-subtle)', color: 'var(--text-secondary)', cursor: 'pointer' }}
                  >
                    <Icon name={f.icon} size={15} style={{ color: 'var(--cyber-cyan)' }} />
                    <span className="text-sm">{f.label}</span>
                  </button>
                ))}
              </div>
              <div className="text-[10px] mono mt-3 px-1" style={{ color: 'var(--text-tertiary)' }}>
                ↑↓ 选择 · Enter 跳转 · Esc 关闭
              </div>
            </div>
          ) : building || !loaded ? (
            <div className="py-14 text-center mono text-sm" style={{ color: 'var(--text-tertiary)' }}>
              // 正在建立搜索索引…
            </div>
          ) : total === 0 ? (
            <div className="py-14 text-center mono text-sm" style={{ color: 'var(--text-tertiary)' }}>
              // 未找到「{deferredQuery}」相关结果
            </div>
          ) : (
            TYPE_ORDER.filter((t) => groups.some((g) => g.type === t)).map((type) => {
              const g = groups.find((gr) => gr.type === type);
              const meta = TYPE_META[type];
              return (
                <div key={type} className="mb-1.5">
                  <div className="flex items-center gap-1.5 px-2 py-1">
                    <span className="w-1.5 h-1.5 rounded-full" style={{ background: meta.accent }} />
                    <span className="text-[11px] font-semibold" style={{ color: 'var(--text-secondary)' }}>{meta.label}</span>
                    <span className="text-[10px] mono" style={{ color: 'var(--text-tertiary)' }}>
                      {g.total > g.items.length ? `${g.items.length} / ${g.total}` : g.total}
                    </span>
                  </div>
                  {g.items.map((r) => {
                    flatIndex += 1;
                    const on = flatIndex === active;
                    const myIndex = flatIndex;
                    return (
                      <button
                        key={r.id}
                        data-active={on}
                        onMouseEnter={() => setActive(myIndex)}
                        onClick={() => go(r.path)}
                        className="os-search-row w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left"
                        style={{
                          background: on ? 'var(--search-highlight-bg)' : 'transparent',
                          border: `1px solid ${on ? 'var(--search-highlight-border)' : 'transparent'}`,
                          cursor: 'pointer',
                        }}
                      >
                        <span
                          className="shrink-0 flex items-center justify-center rounded-md"
                          style={{ width: 28, height: 28, background: 'var(--bg-base)', color: meta.accent }}
                        >
                          <Icon name={r.icon || meta.icon} size={15} />
                        </span>
                        <span className="flex-1 min-w-0">
                          <span className="block text-sm truncate" style={{ color: 'var(--text-primary)' }}>
                            <Highlight text={r.title} query={deferredQuery} />
                          </span>
                          {r.subtitle && (
                            <span className="block text-[11px] truncate" style={{ color: 'var(--text-tertiary)' }}>{r.subtitle}</span>
                          )}
                        </span>
                        {r.badge && (
                          <span
                            className="shrink-0 text-[10px] mono px-1.5 py-0.5 rounded"
                            style={{ background: `${meta.accent}1f`, color: meta.accent }}
                          >
                            {r.badge}
                          </span>
                        )}
                        {on && <Icon name="CornerDownLeft" size={13} style={{ color: 'var(--text-tertiary)' }} />}
                      </button>
                    );
                  })}
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
