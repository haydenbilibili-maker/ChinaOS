import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import * as Lucide from 'lucide-react';
import {
  AS_OF,
  MODULE_COUNT,
  GROUP_COUNT,
  ENTRY_TOTAL,
  MODULE_GATEWAY,
  SIGNAL_COLORS,
  econTabPath,
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

/** 滚动错落揭示 · IntersectionObserver */
export function useScrollReveal(selector = '.dash-scroll-reveal') {
  useEffect(() => {
    let io = null;

    const bind = () => {
      if (prefersReducedMotion()) {
        document.querySelectorAll(selector).forEach((el) => el.classList.add('is-visible'));
        return;
      }

      const els = document.querySelectorAll(`${selector}:not(.is-visible)`);
      if (!els.length) return;

      io?.disconnect();
      io = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add('is-visible');
              io.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.06, rootMargin: '0px 0px -3% 0px' },
      );
      els.forEach((el) => io.observe(el));
    };

    const raf = requestAnimationFrame(bind);
    return () => {
      cancelAnimationFrame(raf);
      io?.disconnect();
    };
  });
}

/** 轻量数字滚动 · 尊重 prefers-reduced-motion */
export function CountUp({ value, duration = 1100, decimals = 0, className = '', style = {} }) {
  const target = useMemo(() => {
    if (typeof value === 'number') return value;
    const n = parseFloat(String(value).replace(/,/g, ''));
    return Number.isFinite(n) ? n : null;
  }, [value]);

  const formatVal = (n) => (
    decimals > 0 ? n.toFixed(decimals) : fmt(Math.round(n))
  );

  const [display, setDisplay] = useState(() => (
    target == null ? String(value) : formatVal(target)
  ));
  const rafRef = useRef(null);

  useEffect(() => {
    if (target == null) {
      setDisplay(String(value));
      return undefined;
    }
    if (prefersReducedMotion()) {
      setDisplay(formatVal(target));
      return undefined;
    }

    const start = performance.now();
    const from = 0;
    const tick = (now) => {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - (1 - t) ** 3;
      setDisplay(formatVal(from + (target - from) * eased));
      if (t < 1) rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); };
  }, [target, value, duration, decimals]);

  return <span className={className} style={style}>{display}</span>;
}

/** 宏观 KPI 值动画 · 解析 ±数字+后缀 */
export function AnimatedMetric({ value, className = '', style = {}, duration = 900 }) {
  const parsed = useMemo(() => {
    const m = String(value).match(/^([+\-]?)([\d.]+)(.*)$/);
    if (!m) return null;
    const num = parseFloat(m[2]);
    if (!Number.isFinite(num)) return null;
    const dec = m[2].includes('.') ? (m[2].split('.')[1]?.length || 0) : 0;
    return { sign: m[1], num, suffix: m[3], decimals: dec };
  }, [value]);

  if (!parsed) {
    return <span className={className} style={style}>{value}</span>;
  }

  return (
    <span className={className} style={style}>
      {parsed.sign}
      <CountUp value={parsed.num} decimals={parsed.decimals} duration={duration} />
      {parsed.suffix}
    </span>
  );
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

/** 信号新鲜度半圆仪表 */
export function FreshnessGauge({ signals = CANARY_SIGNALS }) {
  const { green, amber, red, score, color } = useMemo(() => {
    const c = { green: 0, amber: 0, red: 0 };
    for (const s of signals) c[s.signal] = (c[s.signal] || 0) + 1;
    const total = signals.length || 1;
    const sc = Math.round(((c.green * 1 + c.amber * 0.5) / total) * 100);
    const col = sc >= 70 ? SIGNAL_COLORS.green : sc >= 40 ? SIGNAL_COLORS.amber : SIGNAL_COLORS.red;
    return { ...c, score: sc, color: col };
  }, [signals]);

  const arcPath = useMemo(() => {
    const r = 36;
    const cx = 40;
    const cy = 40;
    const startAngle = Math.PI;
    const endAngle = startAngle + (score / 100) * Math.PI;
    const x1 = cx + r * Math.cos(startAngle);
    const y1 = cy + r * Math.sin(startAngle);
    const x2 = cx + r * Math.cos(endAngle);
    const y2 = cy + r * Math.sin(endAngle);
    const large = score > 50 ? 1 : 0;
    return `M ${x1} ${y1} A ${r} ${r} 0 ${large} 1 ${x2} ${y2}`;
  }, [score]);

  return (
    <div className="dash-freshness-gauge" aria-label={`信号新鲜度 ${score}%`}>
      <svg viewBox="0 0 80 48" className="dash-freshness-gauge__svg" aria-hidden="true">
        <path
          d="M 4 40 A 36 36 0 0 1 76 40"
          fill="none"
          stroke="var(--bg-base)"
          strokeWidth="6"
          strokeLinecap="round"
        />
        <path
          d={arcPath}
          fill="none"
          stroke={color}
          strokeWidth="6"
          strokeLinecap="round"
          className="dash-freshness-gauge__arc"
        />
      </svg>
      <span className="dash-freshness-gauge__score mono" style={{ color }}>{score}%</span>
      <span className="dash-freshness-gauge__legend">
        <span style={{ color: SIGNAL_COLORS.green }}>{green}</span>
        <span style={{ color: SIGNAL_COLORS.amber }}>{amber}</span>
        <span style={{ color: SIGNAL_COLORS.red }}>{red}</span>
      </span>
    </div>
  );
}

/** 顶栏 · 项目身份 + AS_OF + 系统健康 + 快捷操作 */
export function StatusStrip({
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
          AS_OF <span className="mono">{AS_OF}</span>
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
        <span className="dash-status-pill dash-status-pill--canary">
          金丝雀
          <span className="dash-canary-dot is-green">{canaryCounts.green}</span>
          <span className="dash-canary-dot is-amber is-pulse">{canaryCounts.amber}</span>
          <span className="dash-canary-dot is-red is-pulse">{canaryCounts.red}</span>
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
        <Link to="/governance" className="dash-quick-btn">
          <Lucide.Landmark size={12} />
          治理
        </Link>
      </div>
    </header>
  );
}

/** 八大模块门户卡 */
export function ModuleGatewayLattice() {
  return (
    <section className="dash-pillar-section dash-scroll-reveal" aria-labelledby="dash-gateway-heading">
      <div className="os-section-heading mb-3">
        <Lucide.Compass size={16} style={{ color: 'var(--china-red)' }} />
        <h2 id="dash-gateway-heading" className="os-section-heading__title m-0">模块门户</h2>
        <span className="os-section-heading__meta min-w-0">// 权力 · 台海 · 军事 · 河山 · 人才 · 领袖 · 信号 · 治理</span>
      </div>
      <div className="dash-gateway-grid">
        {MODULE_GATEWAY.map((p, i) => (
          <Link
            key={p.id}
            to={p.path}
            className="dash-pillar-card os-reveal"
            style={{ '--pillar-accent': p.accent, '--reveal-delay': `${0.04 + i * 0.04}s` }}
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

/** @deprecated 使用 ModuleGatewayLattice */
export function DeepLinkLattice() {
  return <ModuleGatewayLattice />;
}

/** 近期金丝雀信号 · 二级读数 */
export function RecentSignalsStrip({ className = '' }) {
  const recent = useMemo(
    () => CANARY_SIGNALS.slice(0, 5).map((s) => ({
      ...s,
      color: SIGNAL_COLORS[s.signal] || SIGNAL_COLORS.amber,
      pulse: s.signal === 'red' || s.signal === 'amber',
    })),
    [],
  );

  return (
    <aside className={`dash-recent-signals ${className}`.trim()} aria-label="近期金丝雀信号">
      <div className="dash-recent-signals__head">
        <Lucide.Bell size={13} style={{ color: '#e8a317' }} />
        <span>近期信号</span>
        <Link to={econTabPath('canary')} className="dash-recent-signals__more mono">经济大盘 →</Link>
      </div>
      <ul className="dash-recent-signals__list">
        {recent.map((s) => (
          <li key={s.id}>
            <Link
              to={econTabPath('canary')}
              className="dash-recent-signals__item"
              title={`${s.reading} · ${s.lead}`}
            >
              <span
                className={`dash-recent-signals__dot${s.pulse ? ' is-pulse' : ''}`}
                style={{ background: s.color }}
                aria-hidden="true"
              />
              <span className="dash-recent-signals__label">{s.label}</span>
              <span className="dash-recent-signals__reading mono" style={{ color: s.color }}>{s.reading}</span>
            </Link>
          </li>
        ))}
      </ul>
    </aside>
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
    pulse: s.signal === 'red' || s.signal === 'amber',
  }));

  return (
    <div className="dash-signal-bar" role="region" aria-label="金丝雀信号新鲜度">
      <div className="dash-signal-bar__head">
        <span className="dash-signal-bar__title">
          <Lucide.Activity size={13} style={{ color: '#22d3ee' }} />
          信号新鲜度 · 能源压舱石与实体景气
        </span>
        <FreshnessGauge signals={signals} />
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
            to={econTabPath('canary')}
            className="dash-signal-chip"
            style={{ '--chip-color': SIGNAL_COLORS[s.signal] }}
            title={`${s.reading} · ${s.lead}`}
          >
            <span className={`dash-signal-chip__dot${s.signal !== 'green' ? ' is-pulse' : ''}`} aria-hidden="true" />
            {s.label}
          </Link>
        ))}
        <Link to="/modules/signal-panel" className="dash-signal-chip" style={{ '--chip-color': '#22d3ee' }}>
          信号灯 →
        </Link>
      </div>
    </div>
  );
}

/** Hero 侧栏系统健康读数 */
export function SystemHealthPanel({ entryTotal = ENTRY_TOTAL, refreshCount = 0 }) {
  const rows = [
    { label: '数据底座', val: entryTotal, color: '#22d3ee', countUp: true, suffix: ' 条' },
    { label: '专题覆盖', val: MODULE_COUNT, color: '#e8a317', countUp: true, suffix: ' 模块' },
    { label: '信号脉冲', val: refreshCount, color: '#10b981', live: refreshCount > 0, display: refreshCount > 0 ? null : '待命' },
    { label: '算力主权', val: null, color: '#8b5cf6', display: '本地 IndexedDB' },
  ];

  return (
    <aside className="dash-hero-v2__health" aria-label="系统健康">
      <span className="dash-hero-v2__health-title">系统态势</span>
      {rows.map((r) => (
        <div key={r.label} className="dash-health-row">
          <span className="dash-health-row__label">{r.label}</span>
          <span className="dash-health-row__val" style={{ color: r.color }}>
            {r.live && <span className="os-live-dot inline-block w-1.5 h-1.5 rounded-full mr-1" style={{ background: r.color }} aria-hidden="true" />}
            {r.display ?? (
              <>
                <CountUp value={r.val} duration={1000} />
                {r.suffix || ''}
              </>
            )}
          </span>
        </div>
      ))}
    </aside>
  );
}
