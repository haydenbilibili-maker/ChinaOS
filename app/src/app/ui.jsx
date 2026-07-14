import React, { useRef, useLayoutEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import StatTrend from '../lib/viz/StatTrend.jsx';
export { default as OsGauge } from '../lib/viz/OsGauge.jsx';
export { default as OsSparkline } from '../lib/viz/OsSparkline.jsx';
export { default as StatTrend } from '../lib/viz/StatTrend.jsx';

// 共享 UI 原子：模块页统一用这些，保证视觉一致、避免各模块各写一套。

/** 统一表单控件 inline style（模块可 spread 或改用 .os-input class） */
export const OS_INPUT = {
  background: 'var(--bg-base)',
  border: '1px solid var(--border-subtle)',
  color: 'var(--text-primary)',
  borderRadius: 'var(--radius-sm)',
  padding: '6px 10px',
  fontSize: 'var(--text-sm)',
};

export const OS_BTN_PRIMARY = {
  background: 'var(--btn-primary-bg)',
  color: 'var(--cyber-cyan)',
  border: '1px solid var(--accent-border)',
  borderRadius: 'var(--radius-sm)',
  padding: '6px 14px',
  fontSize: 'var(--text-sm)',
  cursor: 'pointer',
};

/** 模块内 chip/tab 激活态文字色（随日览/夜览切换） */
export const CHIP_ACTIVE_TEXT = 'var(--chip-active-text)';

// 横向互链：把抽象理论工具直接接到具体业务模块（反之亦然）。
export function CrossLinks({ title = '横向打通 · 关联模块', links = [], className = '' }) {
  if (!links.length) return null;
  return (
    <div className={`os-card os-section ${className}`} style={{ padding: 'var(--card-padding)' }}>
      <h3 className="os-card-title mb-1">{title}</h3>
      <p className="text-xs mb-3" style={{ color: 'var(--text-tertiary)' }}>把这套框架落到具体盘面 —— 点击直跳。</p>
      <div className="grid gap-3 md:gap-4" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(220px,1fr))' }}>
        {links.map((l) => (
          <Link
            key={l.to}
            to={l.to}
            className="os-card-interactive block rounded-lg p-3 transition-colors"
            style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-subtle)' }}
          >
            <div className="text-sm font-semibold flex items-center gap-1.5" style={{ color: 'var(--cyber-cyan)' }}>
              {l.label}<span className="mono text-xs" style={{ color: 'var(--text-tertiary)' }}>↗</span>
            </div>
            {l.note && <p className="text-xs mt-1 leading-snug" style={{ color: 'var(--text-tertiary)' }}>{l.note}</p>}
          </Link>
        ))}
      </div>
    </div>
  );
}

export function PageHeader({ badge, title, subtitle, children, noAccent = false }) {
  return (
    <header className={`os-page-header os-section ${noAccent ? 'os-page-header--no-accent' : ''}`}>
      {badge && (
        <span className="os-page-badge mono">
          {badge}
        </span>
      )}
      <h1 className="os-page-title">{title}</h1>
      {subtitle && <p className="os-page-subtitle">{subtitle}</p>}
      {children && <div className="os-page-header__actions">{children}</div>}
    </header>
  );
}

export function Card({ title, children, className = '', hover = false, asSection = true }) {
  const sectionCls = asSection ? 'os-section mb-8' : '';
  const hoverCls = hover ? 'os-card-lift' : '';
  return (
    <div className={`os-card ${sectionCls} ${hoverCls} ${className}`} style={{ padding: 'var(--card-padding)' }}>
      {title && <h3 className="os-card-title mb-4">{title}</h3>}
      {children}
    </div>
  );
}

export function Stat({ value, label, accent, sub, trend, trendValue }) {
  return (
    <div className="os-card os-card-lift os-stat-card p-4 text-center" style={{ padding: 'var(--card-padding) 1rem' }}>
      <div className="flex items-center justify-center gap-1.5 flex-wrap">
        <div className="os-stat-value mono os-mono-tabular" style={{ color: accent || 'var(--text-primary)' }}>{value}</div>
        {trend && <StatTrend direction={trend} value={trendValue} />}
      </div>
      <div className="os-stat-label os-label-slot">{label}</div>
      {sub && <div className="text-[10px] mono os-mono-tabular mt-0.5 leading-snug" style={{ color: 'var(--text-tertiary)' }}>{sub}</div>}
    </div>
  );
}

export function StatGrid({ children, className = '', stagger = true }) {
  return (
    <div className={`os-stat-grid ${stagger ? 'os-section-stagger' : ''} ${className}`}>
      {children}
    </div>
  );
}

/** @typedef {{ sm?: number; md?: number; lg?: number; xl?: number; '2xl'?: number; '3xl'?: number; default?: number }} ResponsiveCols */

/**
 * 模块栅格 · 支持固定列数或断点对象
 * @example <Grid cols={3} />
 * @example <Grid cols={{ sm: 1, md: 2, lg: 3, '2xl': 4 }} />
 */
export function Grid({ cols = 3, children, className = '', gap, stagger = false }) {
  const gapCls = gap ? '' : 'gap-6 md:gap-6 lg:gap-8';
  const gapStyle = gap ? { gap } : {};
  const staggerCls = stagger ? 'os-section-stagger' : '';

  if (cols && typeof cols === 'object') {
    const base = cols.default ?? cols.sm ?? 1;
    const style = {
      '--og-cols': base,
      ...(cols.sm != null ? { '--og-cols-sm': cols.sm } : {}),
      ...(cols.md != null ? { '--og-cols-md': cols.md } : {}),
      ...(cols.lg != null ? { '--og-cols-lg': cols.lg } : {}),
      ...(cols.xl != null ? { '--og-cols-xl': cols.xl } : {}),
      ...(cols['2xl'] != null ? { '--og-cols-2xl': cols['2xl'] } : {}),
      ...(cols['3xl'] != null ? { '--og-cols-3xl': cols['3xl'] } : {}),
      ...gapStyle,
    };
    return (
      <div className={`grid os-grid os-grid-r ${gapCls} ${staggerCls} ${className}`} style={style}>
        {children}
      </div>
    );
  }

  return (
    <div
      className={`grid os-grid ${gapCls} ${staggerCls} ${className}`}
      style={{
        gridTemplateColumns: `repeat(${cols}, minmax(0,1fr))`,
        ...gapStyle,
      }}
    >
      {children}
    </div>
  );
}

export function Section({ children, className = '', stagger = false }) {
  return (
    <div className={`os-section ${stagger ? 'os-section-stagger' : ''} ${className}`}>
      {children}
    </div>
  );
}

/**
 * 统一 Tab 切换条
 * tabs: [{ id, label, accent?, bg? }] 或 [[id, label], ...]
 */
export function TabBar({
  tabs,
  value,
  onChange,
  variant = 'pill',
  sticky = false,
  accent = 'var(--china-red)',
  className = '',
}) {
  const normalized = tabs.map((t) => (Array.isArray(t) ? { id: t[0], label: t[1] } : t));
  const barRef = useRef(null);
  const tabRefs = useRef([]);
  const [indicator, setIndicator] = useState({ width: 0, left: 0, color: accent });
  const isPill = variant === 'pill';
  const barCls = variant === 'segment' ? 'os-tab-bar os-tab-bar-segment' : 'os-tab-bar os-tab-bar-pill';
  const wrapCls = sticky ? 'os-tab-sticky' : 'mb-6';

  const activeIdx = normalized.findIndex((t) => t.id === value);
  const activeTab = activeIdx >= 0 ? normalized[activeIdx] : null;
  const indicatorColor = activeTab?.accent || accent;

  useLayoutEffect(() => {
    if (!isPill) return;
    const el = tabRefs.current[activeIdx];
    const bar = barRef.current;
    if (!el || !bar || activeIdx < 0) return;
    const barRect = bar.getBoundingClientRect();
    const tabRect = el.getBoundingClientRect();
    setIndicator({
      width: tabRect.width,
      left: tabRect.left - barRect.left,
      color: indicatorColor,
    });
  }, [value, activeIdx, indicatorColor, isPill, normalized.length]);

  return (
    <div className={`${wrapCls} ${className}`}>
      <div
        className={barCls}
        role="tablist"
        ref={isPill ? barRef : undefined}
        style={isPill ? { '--tab-indicator-color': indicatorColor } : undefined}
      >
        {isPill && indicator.width > 0 ? (
          <span
            className="os-tab-indicator"
            aria-hidden="true"
            style={{
              width: indicator.width,
              transform: `translateX(${indicator.left}px)`,
              background: `color-mix(in srgb, ${indicator.color} 22%, transparent)`,
              borderColor: indicator.color,
            }}
          />
        ) : null}
        {normalized.map(({ id, label, accent: tabAccent, bg }, idx) => {
          const on = value === id;
          const activeColor = tabAccent || accent;
          let activeStyle;
          if (on) {
            if (variant === 'segment') {
              activeStyle = {
                background: bg || `color-mix(in srgb, ${activeColor} 16%, var(--bg-base))`,
                color: activeColor,
              };
            } else {
              activeStyle = {
                color: tabAccent && tabAccent.startsWith('#') ? 'var(--tab-active-text)' : (tabAccent ? activeColor : 'var(--tab-active-text)'),
                background: 'transparent',
                borderColor: 'transparent',
              };
            }
          } else if (variant === 'segment') {
            activeStyle = { background: 'var(--bg-base)' };
          }
          return (
            <button
              key={id}
              type="button"
              role="tab"
              aria-selected={on}
              ref={(node) => { tabRefs.current[idx] = node; }}
              onClick={() => onChange(id)}
              className={`os-tab-item ${on ? 'is-active' : ''}`}
              style={activeStyle}
            >
              {label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export function Button({
  children,
  variant = 'default',
  size = 'md',
  className = '',
  style,
  ...props
}) {
  const cls = [
    'os-btn',
    variant === 'primary' && 'os-btn-primary',
    variant === 'ghost' && 'os-btn-ghost',
    size === 'sm' && 'os-btn-sm',
    className,
  ].filter(Boolean).join(' ');
  return (
    <button type="button" className={cls} style={style} {...props}>
      {children}
    </button>
  );
}

export function OsLink({ to, children, className = '', ...props }) {
  return (
    <Link to={to} className={`os-link mono text-xs ${className}`} {...props}>
      {children}
    </Link>
  );
}

export function Placeholder({ note }) {
  return (
    <div className="os-card p-6 text-sm os-section" style={{ color: 'var(--text-tertiary)' }}>
      <span className="mono" style={{ color: 'var(--cyber-cyan)' }}>// 待建</span> — {note}
    </div>
  );
}

export function Skeleton({ className = '', style }) {
  return <div className={`os-skeleton ${className}`} style={style} aria-hidden="true" />;
}

export function LoadingBlock({ label = '加载模块…' }) {
  return <LoadingSkeleton label={label} />;
}

export function LoadingSkeleton({ rows = 2, label, className = '' }) {
  return (
    <div className={`os-loading-skeleton os-card ${className}`} role="status" aria-live="polite">
      {Array.from({ length: rows }, (_, i) => (
        <Skeleton
          key={i}
          className={`os-skeleton-line${i === rows - 1 ? ' short' : ''}`}
        />
      ))}
      {label && <span className="os-loading-skeleton__label">{label}</span>}
    </div>
  );
}

const BADGE_LABELS = { cas: '中科院院士', cae: '工程院院士', both: '两院院士' };
const BADGE_COMPACT = { cas: 'CAS', cae: 'CAE', both: '两院' };

/** 两院徽章 · CAS / CAE / BOTH（复用 --badge-* 令牌） */
export function Badge({ kind, label, compact = false, size = 'sm', className = '', title }) {
  if (!kind || !BADGE_LABELS[kind]) return null;
  const display = label || (compact ? BADGE_COMPACT[kind] : BADGE_LABELS[kind]);
  return (
    <span
      className={`os-badge mono ${size === 'md' ? 'os-badge--md' : 'os-badge--sm'} ${className}`}
      data-kind={kind}
      title={title || BADGE_LABELS[kind]}
    >
      {display}
    </span>
  );
}

/** 数据源徽章：实时（绿点）/ 快照（琥珀点） */
export function SourceBadge({ live, asOf, className = '' }) {
  const kind = live ? 'live' : 'snapshot';
  const text = live ? 'World Bank · 实时' : `快照 · ${asOf}`;
  return (
    <span className={`os-source-badge mono ${className}`} data-kind={kind}>
      <span className="os-source-badge__dot" aria-hidden="true" />
      {text}
    </span>
  );
}

/** 横向分布条 · 点选筛选（talent DistBars 模式） */
export function DistBar({
  data = [],
  color = 'var(--cyber-cyan)',
  max,
  onPick,
  active,
  labelWidth = 70,
  labelFn = (k) => k,
  className = '',
}) {
  const top = max || (data[0]?.[1] || 1);
  return (
    <div className={`os-dist-bar ${className}`} style={{ '--dist-bar-accent': color }}>
      {data.map(([k, n]) => {
        const clickable = Boolean(onPick);
        const isActive = active === k;
        const isDimmed = active && active !== k;
        const Row = clickable ? 'button' : 'div';
        return (
          <Row
            key={k}
            type={clickable ? 'button' : undefined}
            onClick={clickable ? () => onPick(k) : undefined}
            className={`os-dist-bar__row${clickable ? ' is-clickable' : ''}${isActive ? ' is-active' : ''}${isDimmed ? ' is-dimmed' : ''}`}
          >
            <span className="os-dist-bar__label" style={{ width: labelWidth }}>{labelFn(k)}</span>
            <span className="os-dist-bar__track">
              <span className="os-dist-bar__fill" style={{ width: `${(n / top) * 100}%` }} />
            </span>
            <span className="os-dist-bar__count">{n}</span>
          </Row>
        );
      })}
    </div>
  );
}

/** 空状态占位 */
export function EmptyState({ title = '暂无数据', description, action, className = '' }) {
  return (
    <div className={`os-empty-state os-card os-section ${className}`} role="status">
      <div className="os-empty-state__title">{title}</div>
      {description && <p className="os-empty-state__desc">{description}</p>}
      {action && <div className="mt-3">{action}</div>}
    </div>
  );
}

export function ChartCard({ title, children, className = '' }) {
  return (
    <Card title={title} className={className} hover>
      <div className="os-chart rounded-md overflow-hidden">
        {children}
      </div>
    </Card>
  );
}
