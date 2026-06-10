import React from 'react';
import { Link } from 'react-router-dom';

// 共享 UI 原子：模块页统一用这些，保证视觉一致、避免各模块各写一套。

// 横向互链：把抽象理论工具直接接到具体业务模块（反之亦然）。
// links: [{ to:'/straits', label:'台海局势', note:'一句话说明为何相关' }, ...]
export function CrossLinks({ title = '横向打通 · 关联模块', links = [], className = '' }) {
  if (!links.length) return null;
  return (
    <div className={`os-card p-5 ${className}`}>
      <h3 className="text-sm font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>{title}</h3>
      <p className="text-[11px] mb-3" style={{ color: 'var(--text-tertiary)' }}>把这套框架落到具体盘面 —— 点击直跳。</p>
      <div className="grid gap-2" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(220px,1fr))' }}>
        {links.map((l) => (
          <Link key={l.to} to={l.to} className="block rounded-lg p-3 transition-colors"
            style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-subtle)' }}>
            <div className="text-sm font-semibold flex items-center gap-1.5" style={{ color: 'var(--cyber-cyan)' }}>
              {l.label}<span className="mono text-xs" style={{ color: 'var(--text-tertiary)' }}>↗</span>
            </div>
            {l.note && <p className="text-[11px] mt-1 leading-snug" style={{ color: 'var(--text-tertiary)' }}>{l.note}</p>}
          </Link>
        ))}
      </div>
    </div>
  );
}

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
