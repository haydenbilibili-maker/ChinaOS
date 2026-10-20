import React from 'react';

/**
 * 信号灯（VI 2.0 §7）：颜色 + 形状 + 文字三重编码。
 * level: ok 稳 ● | watch 观 ◆ | alert 警 ▲ | unknown 未明 ○
 */
export const SIGNAL_META = {
  ok: { label: '稳', shape: 'circle' },
  watch: { label: '观', shape: 'diamond' },
  alert: { label: '警', shape: 'triangle' },
  unknown: { label: '未明', shape: 'ring' },
};

const SIZE = { s: 8, m: 14, l: 40 };

function Shape({ shape, d }) {
  const c = d / 2;
  if (shape === 'diamond') {
    const r = d * 0.5;
    return <path d={`M${c} ${c - r} L${c + r} ${c} L${c} ${c + r} L${c - r} ${c} Z`} />;
  }
  if (shape === 'triangle') {
    const r = d * 0.52;
    const h = r * 1.5;
    return <path d={`M${c} ${c - r} L${c + h * 0.577} ${c + r * 0.5} L${c - h * 0.577} ${c + r * 0.5} Z`} strokeLinejoin="round" />;
  }
  if (shape === 'ring') {
    return <circle cx={c} cy={c} r={d * 0.36} fill="none" strokeWidth={Math.max(1.2, d * 0.12)} />;
  }
  return <circle cx={c} cy={c} r={d * 0.42} />;
}

export default function Signal({ level = 'unknown', size = 'm', label, showLabel = true, title, className = '' }) {
  const meta = SIGNAL_META[level] || SIGNAL_META.unknown;
  const d = SIZE[size] || SIZE.m;
  const text = label ?? meta.label;
  return (
    <span
      className={`vi-signal vi-signal--${level} vi-signal--${size} ${className}`.trim()}
      title={title || text}
      role="img"
      aria-label={`信号：${text}`}
    >
      <span className="vi-signal__lamp" style={{ width: d, height: d }}>
        {size === 'l' && <span className="vi-signal__ring" aria-hidden="true" />}
        <svg viewBox={`0 0 ${d} ${d}`} width={d} height={d} aria-hidden="true">
          <Shape shape={meta.shape} d={d} />
        </svg>
      </span>
      {showLabel && <span className="vi-signal__label">{text}</span>}
    </span>
  );
}

/**
 * 天灯（XL）：三道同心环分别代表短 / 中 / 长期判断，中心写结论。
 * rings: [{ label, level }] 由外到内
 */
export function SkyLamp({ rings = [], verdict, caption, size = 220 }) {
  const c = size / 2;
  const widths = [10, 10, 10];
  const gap = 10;
  return (
    <figure className="vi-skylamp" style={{ width: size }} aria-label={`天灯：${verdict || ''}`}>
      <svg viewBox={`0 0 ${size} ${size}`} width={size} height={size} role="img">
        <defs>
          <radialGradient id="vi-skylamp-core" cx="50%" cy="45%" r="60%">
            <stop offset="0%" stopColor="var(--vi-bg-3)" />
            <stop offset="100%" stopColor="var(--vi-bg-1)" />
          </radialGradient>
        </defs>
        {rings.slice(0, 3).map((ring, i) => {
          const r = c - 6 - i * (widths[i] + gap) - widths[i] / 2;
          const circ = 2 * Math.PI * r;
          return (
            <g key={ring.label} className={`vi-skylamp__ring vi-skylamp__ring--${ring.level}`}>
              <circle cx={c} cy={c} r={r} fill="none" strokeWidth={widths[i]} className="vi-skylamp__track" />
              <circle
                cx={c}
                cy={c}
                r={r}
                fill="none"
                strokeWidth={widths[i]}
                strokeLinecap="round"
                strokeDasharray={`${circ * 0.82} ${circ}`}
                transform={`rotate(${-90 + i * 18} ${c} ${c})`}
                className="vi-skylamp__arc"
                style={{ animationDelay: `${i * 120}ms` }}
              />
            </g>
          );
        })}
        <circle cx={c} cy={c} r={c - 6 - 3 * (10 + gap) + 4} fill="url(#vi-skylamp-core)" className="vi-skylamp__core" />
      </svg>
      <figcaption className="vi-skylamp__center">
        <span className="vi-skylamp__verdict">{verdict}</span>
        {caption && <span className="vi-skylamp__caption">{caption}</span>}
      </figcaption>
      <ul className="vi-skylamp__legend">
        {rings.slice(0, 3).map((ring) => (
          <li key={ring.label}>
            <Signal level={ring.level} size="s" showLabel={false} />
            <span>{ring.label}</span>
            <span className="vi-skylamp__legend-level">{SIGNAL_META[ring.level]?.label}</span>
          </li>
        ))}
      </ul>
    </figure>
  );
}
