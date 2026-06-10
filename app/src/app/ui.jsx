import React from 'react';

// 共享 UI 原子：模块页统一用这些，保证视觉一致、避免各模块各写一套。

export function PageHeader({ badge, title, subtitle, children }) {
  return (
    <div className="mb-8 pb-5 border-b" style={{ borderColor: 'var(--border-subtle)' }}>
      {badge && (
        <span
          className="inline-block text-[11px] font-semibold tracking-wider uppercase px-2 py-0.5 rounded mb-3 mono"
          style={{ background: 'rgba(196,30,58,0.14)', color: 'var(--china-red)' }}
        >
          {badge}
        </span>
      )}
      <h1 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>{title}</h1>
      {subtitle && <p className="text-sm mt-1.5" style={{ color: 'var(--text-secondary)' }}>{subtitle}</p>}
      {children && <div className="mt-4">{children}</div>}
    </div>
  );
}

export function Card({ title, children, className = '' }) {
  return (
    <div className={`os-card p-5 ${className}`}>
      {title && <h3 className="text-sm font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>{title}</h3>}
      {children}
    </div>
  );
}

export function Stat({ value, label, accent }) {
  return (
    <div className="os-card p-4 text-center">
      <div className="text-2xl font-bold mono" style={{ color: accent || 'var(--text-primary)' }}>{value}</div>
      <div className="text-xs mt-1" style={{ color: 'var(--text-tertiary)' }}>{label}</div>
    </div>
  );
}

export function Grid({ cols = 3, children, className = '' }) {
  return <div className={`grid gap-4 ${className}`} style={{ gridTemplateColumns: `repeat(${cols}, minmax(0,1fr))` }}>{children}</div>;
}

export function Placeholder({ note }) {
  return (
    <div className="os-card p-6 text-sm" style={{ color: 'var(--text-tertiary)' }}>
      <span className="mono" style={{ color: 'var(--cyber-cyan)' }}>// 待建</span> — {note}
    </div>
  );
}
