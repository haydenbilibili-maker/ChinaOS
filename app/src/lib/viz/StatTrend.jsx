import React from 'react';

const TREND_META = {
  up: { glyph: '↑', color: 'var(--status-positive, #10b981)' },
  down: { glyph: '↓', color: 'var(--status-negative, #c41e3a)' },
  flat: { glyph: '→', color: 'var(--text-tertiary)' },
};

/** 指标趋势箭头 · 配合 Stat 或独立使用 */
export default function StatTrend({ direction = 'flat', value, className = '' }) {
  const meta = TREND_META[direction] || TREND_META.flat;
  return (
    <span
      className={`inline-flex items-center gap-0.5 text-[11px] mono font-semibold ${className}`.trim()}
      style={{ color: meta.color }}
      aria-label={value != null ? `趋势 ${direction} ${value}` : `趋势 ${direction}`}
    >
      <span aria-hidden="true">{meta.glyph}</span>
      {value != null && <span>{value}</span>}
    </span>
  );
}
