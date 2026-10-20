import React from 'react';
import Signal from './Signal.jsx';

/** 迷你走势：末点放大并标值（VI 2.0 §8.1） */
export function Spark({ data = [], width = 160, height = 44, level = 'unknown' }) {
  if (data.length < 2) return null;
  const lo = Math.min(...data);
  const hi = Math.max(...data);
  const span = hi - lo || 1;
  const pad = 4;
  const x = (i) => pad + (i / (data.length - 1)) * (width - pad * 2);
  const y = (v) => pad + (1 - (v - lo) / span) * (height - pad * 2);
  const line = data.map((v, i) => `${i ? 'L' : 'M'}${x(i).toFixed(1)} ${y(v).toFixed(1)}`).join(' ');
  const area = `${line} L${x(data.length - 1).toFixed(1)} ${height} L${x(0).toFixed(1)} ${height} Z`;
  const lx = x(data.length - 1);
  const ly = y(data[data.length - 1]);
  const gid = `vi-spark-${level}`;
  return (
    <svg className={`vi-spark vi-spark--${level}`} viewBox={`0 0 ${width} ${height}`} width="100%" height={height} preserveAspectRatio="none" aria-hidden="true">
      <defs>
        <linearGradient id={gid} x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="currentColor" stopOpacity="0.28" />
          <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={area} fill={`url(#${gid})`} />
      <path d={line} fill="none" stroke="currentColor" strokeWidth="1.5" vectorEffect="non-scaling-stroke" strokeLinejoin="round" />
      <circle cx={lx} cy={ly} r="3" fill="currentColor" className="vi-spark__end" />
    </svg>
  );
}

/**
 * KPI 单元：眉题 → 主数值 → 变化 → 走势 → 来源。
 * delta: 数值（正负决定箭头）；good: 'up' | 'down' 决定语义色
 */
export default function Kpi({
  label,
  period,
  value,
  unit,
  delta,
  deltaUnit = 'pct',
  deltaLabel = '较上期',
  good = 'up',
  level = 'unknown',
  spark,
  source,
  size = 'm',
}) {
  const hasDelta = typeof delta === 'number' && !Number.isNaN(delta);
  const dir = hasDelta ? (delta > 0 ? 'up' : delta < 0 ? 'down' : 'flat') : 'flat';
  const tone = dir === 'flat' ? 'flat' : dir === good ? 'good' : 'bad';
  return (
    <article className={`vi-kpi vi-kpi--${size} os-card`}>
      <header className="vi-kpi__head">
        <Signal level={level} size="s" showLabel={false} />
        <span className="vi-kpi__label">{label}</span>
        {period && <span className="vi-kpi__period">{period}</span>}
      </header>
      <div className="vi-kpi__value vi-figure">
        {value}
        {unit && <span className="vi-unit">{unit}</span>}
      </div>
      {hasDelta && (
        <div className={`vi-kpi__delta vi-kpi__delta--${tone}`}>
          <span aria-hidden="true">{dir === 'up' ? '▲' : dir === 'down' ? '▼' : '■'}</span>
          <span className="vi-figure">{delta > 0 ? '+' : ''}{delta}{deltaUnit === 'pct' ? 'pct' : deltaUnit}</span>
          <span className="vi-kpi__delta-label">{deltaLabel}</span>
        </div>
      )}
      {spark && <Spark data={spark} level={level} />}
      {source && <footer className="vi-kpi__source">{source}</footer>}
    </article>
  );
}
