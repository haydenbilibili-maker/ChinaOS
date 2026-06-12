import React from 'react';
import { Link } from 'react-router-dom';

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

export function PageHeader({ badge, title, subtitle, children }) {
  return (
    <header className="os-page-header mb-8 pb-5 border-b os-section" style={{ borderColor: 'var(--border-subtle)' }}>
      {badge && (
        <span
          className="inline-block text-xs font-semibold uppercase px-2 py-0.5 rounded mb-3 mono"
          style={{
            background: 'rgba(196,30,58,0.14)',
            color: 'var(--china-red)',
            letterSpacing: '0.08em',
          }}
        >
          {badge}
        </span>
      )}
      <h1 className="os-page-title">{title}</h1>
      {subtitle && <p className="os-page-subtitle mt-2 max-w-3xl">{subtitle}</p>}
      {children && <div className="mt-4">{children}</div>}
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

export function Stat({ value, label, accent }) {
  return (
    <div className="os-card os-card-lift p-4 text-center" style={{ padding: 'var(--card-padding) 1rem' }}>
      <div className="os-stat-value mono" style={{ color: accent || 'var(--text-primary)' }}>{value}</div>
      <div className="os-stat-label">{label}</div>
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

export function Grid({ cols = 3, children, className = '', gap }) {
  const gapCls = gap ? '' : 'gap-6 md:gap-6 lg:gap-8';
  return (
    <div
      className={`grid os-grid ${gapCls} ${className}`}
      style={{
        gridTemplateColumns: `repeat(${cols}, minmax(0,1fr))`,
        ...(gap ? { gap } : {}),
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
  const barCls = variant === 'segment' ? 'os-tab-bar os-tab-bar-segment' : 'os-tab-bar';
  const wrapCls = sticky ? 'os-tab-sticky' : 'mb-6';

  return (
    <div className={`${wrapCls} ${className}`}>
      <div className={barCls} role="tablist">
        {normalized.map(({ id, label, accent: tabAccent, bg }) => {
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
                background: bg || 'rgba(196, 30, 58, 0.22)',
                color: tabAccent && tabAccent.startsWith('#') ? 'var(--tab-active-text)' : (tabAccent ? activeColor : 'var(--tab-active-text)'),
                borderColor: activeColor,
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
  return (
    <div className="os-loading-block" role="status" aria-live="polite">
      <Skeleton className="os-skeleton-line" />
      <Skeleton className="os-skeleton-line short" />
      <span className="mono text-sm" style={{ color: 'var(--cyber-cyan)' }}>{label}</span>
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
