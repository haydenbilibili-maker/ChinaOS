import React, { useEffect, useState } from 'react';

/**
 * 浑仪仪表（VI 2.0 §8.2）：270° 刻度弧 + 区间色带 + 铜针。
 * bands: [{ to, level }]，level ∈ ok | watch | alert，按数值升序
 */
const START = 135; // 左下起
const SWEEP = 270;

function polar(c, r, deg) {
  const a = (deg * Math.PI) / 180;
  return [c + r * Math.cos(a), c + r * Math.sin(a)];
}

function arcPath(c, r, from, to) {
  const [x1, y1] = polar(c, r, from);
  const [x2, y2] = polar(c, r, to);
  const large = to - from > 180 ? 1 : 0;
  return `M${x1.toFixed(2)} ${y1.toFixed(2)} A${r} ${r} 0 ${large} 1 ${x2.toFixed(2)} ${y2.toFixed(2)}`;
}

export default function Armillary({
  value,
  min = 0,
  max = 100,
  bands = [],
  label,
  period,
  unit = '',
  digits = 1,
  majorStep,
  size = 200,
  note,
}) {
  const c = size / 2;
  const clamp = (v) => Math.min(max, Math.max(min, v));
  const toDeg = (v) => START + ((clamp(v) - min) / (max - min)) * SWEEP;
  const [shown, setShown] = useState(min);

  useEffect(() => {
    const id = requestAnimationFrame(() => setShown(value));
    return () => cancelAnimationFrame(id);
  }, [value]);

  const step = majorStep ?? (max - min) / 5;
  const majors = [];
  for (let v = min; v <= max + 1e-9; v += step) majors.push(Number(v.toFixed(6)));
  const minors = [];
  for (let v = min; v <= max + 1e-9; v += step / 5) minors.push(Number(v.toFixed(6)));

  let from = min;
  const bandArcs = bands.map((b) => {
    const seg = { from, to: Math.min(b.to, max), level: b.level };
    from = seg.to;
    return seg;
  });

  const level = (bands.find((b) => value <= b.to) || bands[bands.length - 1] || {}).level || 'unknown';
  const needleDeg = toDeg(shown) + 90; // 指针图形朝上绘制

  return (
    <figure className={`vi-armillary vi-armillary--${level}`} style={{ width: size }}>
      <svg viewBox={`0 0 ${size} ${size}`} width={size} height={size} role="img" aria-label={`${label}：${value}${unit}`}>
        <path d={arcPath(c, c - 8, START, START + SWEEP)} className="vi-armillary__rim" fill="none" />
        {minors.map((v) => {
          const deg = toDeg(v);
          const [x1, y1] = polar(c, c - 12, deg);
          const [x2, y2] = polar(c, c - 17, deg);
          return <line key={`m${v}`} x1={x1} y1={y1} x2={x2} y2={y2} className="vi-armillary__tick" />;
        })}
        {majors.map((v) => {
          const deg = toDeg(v);
          const [x1, y1] = polar(c, c - 12, deg);
          const [x2, y2] = polar(c, c - 24, deg);
          const [tx, ty] = polar(c, c - 36, deg);
          return (
            <g key={`M${v}`}>
              <line x1={x1} y1={y1} x2={x2} y2={y2} className="vi-armillary__tick vi-armillary__tick--major" />
              <text x={tx} y={ty + 3.5} textAnchor="middle" className="vi-armillary__scale">{v}</text>
            </g>
          );
        })}
        {bandArcs.map((b) => (
          <path
            key={`${b.from}-${b.to}`}
            d={arcPath(c, c - 50, toDeg(b.from) + 0.6, toDeg(b.to) - 0.6)}
            className={`vi-armillary__band vi-armillary__band--${b.level}`}
            fill="none"
          />
        ))}
        <g className="vi-armillary__needle" style={{ transform: `rotate(${needleDeg}deg)`, transformOrigin: `${c}px ${c}px` }}>
          <path d={`M${c - 2.2} ${c + 10} L${c} ${16} L${c + 2.2} ${c + 10} Z`} />
        </g>
        <circle cx={c} cy={c} r="7" className="vi-armillary__rivet" />
        <circle cx={c} cy={c} r="2.5" className="vi-armillary__rivet-core" />
      </svg>
      <figcaption className="vi-armillary__readout">
        <span className="vi-armillary__value vi-figure">
          {Number(value).toFixed(digits)}
          {unit && <span className="vi-unit">{unit}</span>}
        </span>
        <span className="vi-armillary__label">{label}{period ? ` · ${period}` : ''}</span>
        {note && <span className="vi-armillary__note">{note}</span>}
      </figcaption>
    </figure>
  );
}
