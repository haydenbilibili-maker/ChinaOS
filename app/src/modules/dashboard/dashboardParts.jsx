import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import * as Lucide from 'lucide-react';
import {
  AS_OF,
  MODULE_COUNT,
  GROUP_COUNT,
  ENTRY_TOTAL,
  DEEP_LINK_PILLARS,
  SIGNAL_COLORS,
} from './data.js';
import { CANARY_SIGNALS } from '../econdash/econData.js';

function Icon({ name, size = 16 }) {
  const Cmp = Lucide[name] || Lucide.Square;
  return <Cmp size={size} strokeWidth={1.75} />;
}

const fmt = (n) => n.toLocaleString('en-US');

function prefersReducedMotion() {
  return typeof window !== 'undefined'
    && window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches;
}

/** 轻量数字滚动 · 尊重 prefers-reduced-motion */
export function CountUp({ value, duration = 1100, className = '', style = {} }) {
  const target = useMemo(() => {
    if (typeof value === 'number') return value;
    const n = parseFloat(String(value).replace(/,/g, ''));
    return Number.isFinite(n) ? n : null;
  }, [value]);

  const [display, setDisplay] = useState(() => (
    target == null ? String(value) : fmt(Math.round(target))
  ));
  const rafRef = useRef(null);

  useEffect(() => {
    if (target == null) {
      setDisplay(String(value));
      return undefined;
    }
    if (prefersReducedMotion()) {
      setDisplay(fmt(target));
      return undefined;
    }

    const start = performance.now();
    const from = 0;
    const tick = (now) => {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - (1 - t) ** 3;
      setDisplay(fmt(Math.round(from + (target - from) * eased)));
      if (t < 1) rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); };
  }, [target, value, duration]);

  return <span className={className} style={style}>{display}</span>;
}

/** 迷你火花线 SVG */
export function KpiSparkline({ data = [], color = '#22d3ee', height = 28 }) {
  const { path, area, gradId } = useMemo(() => {
    const pts = (data || []).filter((v) => v != null && !Number.isNaN(v));
    if (pts.length < 2) return { path: '', area: '', gradId: 'dash-spark-empty' };
    const w = 80;
    const h = height - 4;
    const min = Math.min(...pts);
    const max = Math.max(...pts);
    const span = max - min || 1;
    const coords = pts.map((v, i) => {
      const x = (i / (pts.length - 1)) * w;
      const y = h - ((v - min) / span) * h + 2;
      return [x, y];
    });
    const line = coords.map(([x, y], i) => `${i ? 'L' : 'M'}${x.toFixed(1)},${y.toFixed(1)}`).join(' ');
    const areaPath = `${line} L${w},${h + 2} L0,${h + 2} Z`;
    return { path: line, area: areaPath, gradId: `dash-spark-${color.replace('#', '')}` };
  }, [data, color, height]);

  if (!path) return null;

  return (
    <svg className="dash-kpi-spark" viewBox={`0 0 80 ${height}`} preserveAspectRatio="none" aria-hidden="true">
      <defs>
        <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.35" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path className="spark-area" d={area} fill={`url(#${gradId})`} />
      <path d={path} stroke={color} />
    </svg>
  );
}

/** 顶栏 · 项目身份 + AS_OF + 系统健康 + 快捷操作 */
export function StatusStrip({
  asOf,
  lastRefresh,
  isRefreshing,
  onRefresh,
  liveKpiCount = 0,
}) {
  const fmtTs = lastRefresh
    ? lastRefresh.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })
    : '—';

  const canaryCounts = useMemo(() => {
    const c = { green: 0, amber: 0, red: 0 };
    for (const s of CANARY_SIGNALS) {
      if (s.signal === 'green') c.green += 1;
      else if (s.signal === 'amber') c.amber += 1;
      else c.red += 1;
    }
    return c;
  }, []);

  return (
    <header className="dash-status-strip" aria-label="系统状态">
      <Link to="/dashboard" className="dash-status-strip__brand">
        <img src="/logo.svg" alt="" width={28} height={28} className="dash-status-strip__logo" aria-hidden="true" />
        <span className="dash-status-strip__title">
          观象圆仪
          <span>CHINA OS · 中枢看板</span>
        </span>
      </Link>

      <div className="dash-status-strip__meta">
        <span className="dash-status-pill">
          <span className="dash-status-pill__dot is-live" style={{ background: '#10b981' }} aria-hidden="true" />
          AS_OF <span className="mono">{asOf || AS_OF}</span>
        </span>
        <span className="dash-status-pill">
          <span className="dash-status-pill__dot" style={{ background: '#22d3ee' }} aria-hidden="true" />
          {MODULE_COUNT} 模块 · {GROUP_COUNT} 分组
        </span>
        <span className="dash-status-pill">
          <span
            className={`dash-status-pill__dot${liveKpiCount > 0 ? ' is-live' : ''}`}
            style={{ background: liveKpiCount > 0 ? '#10b981' : '#64748b' }}
            aria-hidden="true"
          />
          {isRefreshing ? '信号刷新中' : `上次刷新 ${fmtTs}`}
        </span>
        <span className="dash-status-pill">
          金丝雀
          <span style={{ color: SIGNAL_COLORS.green }}>{canaryCounts.green}</span>/
          <span style={{ color: SIGNAL_COLORS.amber }}>{canaryCounts.amber}</span>/
          <span style={{ color: SIGNAL_COLORS.red }}>{canaryCounts.red}</span>
        </span>
      </div>

      <div className="dash-status-strip__actions">
        <button
          type="button"
          className="dash-quick-btn"
          onClick={onRefresh}
          disabled={isRefreshing}
          aria-label="刷新宏观信号"
        >
          <Lucide.RefreshCw size={12} className={isRefreshing ? 'animate-spin' : ''} />
          拉取信号
        </button>
        <Link to="/modules/observatory" className="dash-quick-btn dash-quick-btn--primary">
          <Lucide.Telescope size={12} />
          观象台
        </Link>
        <Link to="/modules/signal-panel" className="dash-quick-btn">
          <Lucide.Radio size={12} />
          信号灯
        </Link>
      </div>
    </header>
  );
}

/** 六大深度专题支柱卡 */
export function DeepLinkLattice() {
  return (
    <section className="dash-pillar-section" aria-labelledby="dash-pillar-heading">
      <div className="os-section-heading mb-3">
        <Lucide.Compass size={16} style={{ color: 'var(--china-red)' }} />
        <h2 id="dash-pillar-heading" className="os-section-heading__title m-0">深度专题 · 六大支柱</h2>
        <span className="os-section-heading__meta min-w-0">// 权力 · 台海 · 军事 · 河山 · 人才 · 领袖</span>
      </div>
      <div className="dash-pillar-grid os-section-stagger">
        {DEEP_LINK_PILLARS.map((p) => (
          <Link
            key={p.id}
            to={p.path}
            className="dash-pillar-card os-reveal"
            style={{ '--pillar-accent': p.accent }}
          >
            <div className="dash-pillar-card__head">
              <span className="dash-pillar-card__icon">
                <Icon name={p.icon} size={16} />
              </span>
              <span
                className={`dash-pillar-card__signal${p.live ? ' is-pulse' : ''}`}
                style={{ background: p.accent }}
                title={p.signalLabel}
                aria-label={p.signalLabel}
              />
            </div>
            <span className="dash-pillar-card__tag">{p.tag}</span>
            <span className="dash-pillar-card__title">{p.title}</span>
            <span className="dash-pillar-card__desc">{p.desc}</span>
            <span className="dash-pillar-card__go">进入专题 →</span>
          </Link>
        ))}
      </div>
    </section>
  );
}

/** 金丝雀信号新鲜度可视化 */
export function SignalFreshnessBar() {
  const signals = CANARY_SIGNALS;
  const counts = useMemo(() => {
    const c = { green: 0, amber: 0, red: 0 };
    for (const s of signals) c[s.signal] = (c[s.signal] || 0) + 1;
    return c;
  }, [signals]);

  const segs = signals.map((s) => ({
    id: s.id,
    color: SIGNAL_COLORS[s.signal] || SIGNAL_COLORS.amber,
    label: s.label,
    pulse: s.signal === 'red',
  }));

  return (
    <div className="dash-signal-bar" role="region" aria-label="金丝雀信号新鲜度">
      <div className="dash-signal-bar__head">
        <span className="dash-signal-bar__title">
          <Lucide.Activity size={13} style={{ color: '#22d3ee' }} />
          信号新鲜度 · 能源压舱石与实体景气
        </span>
        <span className="dash-signal-bar__counts">
          <span style={{ color: SIGNAL_COLORS.green }}>绿 {counts.green}</span>
          <span style={{ color: SIGNAL_COLORS.amber }}>黄 {counts.amber}</span>
          <span style={{ color: SIGNAL_COLORS.red }}>红 {counts.red}</span>
        </span>
      </div>
      <div className="dash-signal-bar__track" aria-hidden="true">
        {segs.map((s) => (
          <span
            key={s.id}
            className={`dash-signal-bar__seg${s.pulse ? ' is-pulse' : ''}`}
            style={{ background: s.color, flex: 1 }}
          />
        ))}
      </div>
      <div className="dash-signal-bar__chips">
        {signals.slice(0, 6).map((s) => (
          <Link
            key={s.id}
            to="/econ-dashboard"
            className="dash-signal-chip"
            style={{ '--chip-color': SIGNAL_COLORS[s.signal] }}
            title={`${s.reading} · ${s.lead}`}
          >
            <span className="dash-signal-chip__dot" aria-hidden="true" />
            {s.label}
          </Link>
        ))}
        <Link to="/econ-dashboard" className="dash-signal-chip" style={{ '--chip-color': '#22d3ee' }}>
          经济大盘 →
        </Link>
      </div>
    </div>
  );
}

/** Hero 侧栏系统健康读数 */
export function SystemHealthPanel({ entryTotal = ENTRY_TOTAL, refreshCount = 0 }) {
  const rows = [
    { label: '数据底座', val: `${fmt(entryTotal)} 条`, color: '#22d3ee' },
    { label: '专题覆盖', val: `${MODULE_COUNT} 模块`, color: '#e8a317' },
    { label: '信号脉冲', val: refreshCount > 0 ? `第 ${refreshCount} 轮` : '待命', color: '#10b981', live: refreshCount > 0 },
    { label: '算力主权', val: '本地 IndexedDB', color: '#8b5cf6' },
  ];

  return (
    <aside className="dash-hero-v2__health" aria-label="系统健康">
      <span className="dash-hero-v2__health-title">系统态势</span>
      {rows.map((r) => (
        <div key={r.label} className="dash-health-row">
          <span className="dash-health-row__label">{r.label}</span>
          <span className="dash-health-row__val" style={{ color: r.color }}>
            {r.live && <span className="os-live-dot inline-block w-1.5 h-1.5 rounded-full mr-1" style={{ background: r.color }} aria-hidden="true" />}
            {r.val}
          </span>
        </div>
      ))}
    </aside>
  );
}
