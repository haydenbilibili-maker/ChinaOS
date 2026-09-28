import React from 'react';
import { STAGES_JP, STAGES_CN } from './data.js';
import { JP_COLOR, CN_COLOR } from './charts.js';

const CN_NOW = 2026;

/** 双轴卷轴：日本 1985–2026 与中国 2005–2026 按所选口径对位 */
export default function StageScroll({ mode, activeKey, onSelect }) {
  const calendar = !mode.jpAnchor;
  const toT = (country, y) => {
    if (calendar) return y;
    return country === 'jp' ? y - mode.jpAnchor : y - mode.cnAnchor;
  };

  const all = [
    ...STAGES_JP.flatMap((s) => [toT('jp', s.from), toT('jp', s.to + 1)]),
    ...STAGES_CN.flatMap((s) => [toT('cn', s.from), toT('cn', s.to + 1)]),
  ];
  const min = Math.min(...all);
  const max = Math.max(...all);
  const span = max - min;
  const pct = (t) => `${((t - min) / span) * 100}%`;

  const ticks = [];
  for (let t = Math.ceil(min / 5) * 5; t <= max; t += 5) ticks.push(t);

  const nowT = toT('cn', CN_NOW);
  const jpAtNow = calendar ? CN_NOW : mode.jpAnchor + (CN_NOW - mode.cnAnchor);

  const row = (country, stages, color, label) => (
    <div className="flex items-stretch gap-3 mb-2">
      <div className="w-12 shrink-0 text-xs font-semibold flex items-center" style={{ color }}>{label}</div>
      <div className="relative flex-1" style={{ height: 54 }}>
        <div className="absolute inset-y-0 left-0 right-0 rounded" style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-subtle, rgba(148,163,184,0.12))' }} />
        {stages.map((s) => {
          const on = s.key === activeKey;
          const left = pct(toT(country, s.from));
          const width = `calc(${pct(toT(country, s.to + 1))} - ${pct(toT(country, s.from))})`;
          return (
            <button
              key={s.key}
              type="button"
              onClick={() => onSelect(s.key)}
              aria-pressed={on}
              aria-label={`${label} ${s.from}–${s.to} ${s.title}`}
              title={`${s.from}–${s.to} · ${s.title}`}
              className="absolute top-1 bottom-1 rounded px-1.5 text-left overflow-hidden"
              style={{
                left,
                width,
                background: `color-mix(in srgb, ${s.accent} ${on ? 34 : 16}%, transparent)`,
                border: `1px solid ${on ? s.accent : `color-mix(in srgb, ${s.accent} 45%, transparent)`}`,
                color: 'var(--text-primary)',
              }}
            >
              <span className="block mono text-[10px] leading-tight" style={{ color: s.accent }}>{s.from}–{String(s.to).slice(2)}</span>
              <span className="block text-[11px] leading-tight truncate">{s.title}</span>
            </button>
          );
        })}
      </div>
    </div>
  );

  return (
    <div className="os-table-scroll pb-2">
      <div style={{ minWidth: 760 }}>
        {row('jp', STAGES_JP, JP_COLOR, '日本')}
        {row('cn', STAGES_CN, CN_COLOR, '中国')}
        <div className="flex gap-3">
          <div className="w-12 shrink-0" />
          <div className="relative flex-1" style={{ height: 30 }}>
            {ticks.map((t) => (
              <span key={t} className="absolute mono text-[10px] -translate-x-1/2" style={{ left: pct(t), color: 'var(--text-tertiary)' }}>
                {calendar ? t : (t > 0 ? `+${t}` : t)}
              </span>
            ))}
            <span
              className="absolute top-3 mono text-[10px] -translate-x-1/2 whitespace-nowrap px-1 rounded"
              style={{ left: pct(nowT), color: mode.accent, border: `1px dashed ${mode.accent}` }}
            >
              中国当下 {CN_NOW} ↔ 日本 {jpAtNow}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
