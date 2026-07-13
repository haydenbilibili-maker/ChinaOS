import React, { useMemo } from 'react';

const ARC = { start: 180, end: 0 };

function polar(cx, cy, r, deg) {
  const rad = (deg * Math.PI) / 180;
  return { x: cx + r * Math.cos(rad), y: cy - r * Math.sin(rad) };
}

function arcPath(cx, cy, r, startDeg, endDeg) {
  const s = polar(cx, cy, r, startDeg);
  const e = polar(cx, cy, r, endDeg);
  const large = Math.abs(endDeg - startDeg) > 180 ? 1 : 0;
  const sweep = startDeg > endDeg ? 1 : 0;
  return `M ${s.x} ${s.y} A ${r} ${r} 0 ${large} ${sweep} ${e.x} ${e.y}`;
}

/** CSS/SVG 半环仪表 · 替代 ad-hoc width% 进度条（易赢场景） */
export default function OsGauge({
  value = 0,
  max = 100,
  size = 72,
  stroke = 7,
  color = 'var(--cyber-cyan)',
  trackColor = 'var(--border-subtle)',
  label,
  showValue = true,
  className = '',
}) {
  const pct = useMemo(() => {
    const m = Number(max) || 100;
    const v = Number(value) || 0;
    return Math.max(0, Math.min(100, (v / m) * 100));
  }, [value, max]);

  const cx = 50;
  const cy = 52;
  const r = 38;
  const fillEnd = ARC.start - (pct / 100) * (ARC.start - ARC.end);
  const display = showValue ? `${Math.round(pct)}%` : null;

  return (
    <div
      className={`os-gauge inline-flex flex-col items-center ${className}`.trim()}
      style={{ width: size }}
      role="img"
      aria-label={label ? `${label} ${display || pct}` : `仪表 ${display || pct}`}
    >
      <svg viewBox="0 0 100 56" width={size} height={size * 0.56} className="os-gauge__svg">
        <path
          d={arcPath(cx, cy, r, ARC.start, ARC.end)}
          fill="none"
          stroke={trackColor}
          strokeWidth={stroke}
          strokeLinecap="round"
        />
        {pct > 0 && (
          <path
            d={arcPath(cx, cy, r, ARC.start, fillEnd)}
            fill="none"
            stroke={color}
            strokeWidth={stroke}
            strokeLinecap="round"
            className="os-gauge__fill"
          />
        )}
      </svg>
      {display && (
        <div className="os-gauge__value mono text-xs font-bold -mt-2" style={{ color: color || 'var(--text-primary)' }}>
          {display}
        </div>
      )}
      {label && (
        <div className="os-gauge__label text-[10px] mt-0.5 text-center leading-tight" style={{ color: 'var(--text-tertiary)' }}>
          {label}
        </div>
      )}
    </div>
  );
}
