import React from 'react';
import { fmtYoY } from './liveWorldBank.js';
import { indicatorVerdict } from './econData.js';

/** 涨跌着色：增长型涨绿跌红 */
export function toneOf(v) {
  if (v == null || v === 0) return '#64748b';
  return v > 0 ? '#10b981' : '#c41e3a';
}

export const ARROW = (v) => (v == null || v === 0 ? '→' : v > 0 ? '↑' : '↓');

export const INDICATOR_GROUPS = [
  { key: 'all', label: '全部', accent: '#64748b' },
  { key: 'price', label: '物价', accent: '#c41e3a' },
  { key: 'climate', label: '景气', accent: '#22d3ee' },
  { key: 'employ', label: '就业', accent: '#e8a317' },
  { key: 'money', label: '货币', accent: '#8b5cf6' },
  { key: 'demand', label: '需求', accent: '#10b981' },
];

export const BTN = {
  background: 'var(--bg-elevated)',
  border: '1px solid var(--border-subtle)',
  color: 'var(--text-secondary)',
  borderRadius: 6,
  padding: '4px 12px',
  fontSize: 12,
  cursor: 'pointer',
};

export const BTN_CYAN = {
  ...BTN,
  background: 'var(--btn-primary-bg)',
  border: '1px solid var(--accent-border)',
  color: 'var(--cyber-cyan)',
  fontWeight: 600,
};

const GROUP_MAP = {
  price: '物价',
  climate: '景气',
  employ: '就业',
  money: '货币',
  demand: '需求',
};

export function filterIndicators(list, groupKey) {
  if (!list?.length) return [];
  if (groupKey === 'all') return list;
  const g = GROUP_MAP[groupKey];
  return g ? list.filter((k) => k.group === g) : list;
}

export function IndicatorCard({ k }) {
  const verdict = indicatorVerdict ? indicatorVerdict(k) : null;
  const vTone = verdict?.tone || '#64748b';
  const isPmi = /pmi|景气|荣枯/i.test(`${k.id}${k.label}`) || k.threshold === 50;

  return (
    <div className="os-card p-3" style={{ borderLeft: `3px solid ${vTone}` }}>
      <div className="flex items-center justify-between gap-2 mb-1.5">
        <span className="text-xs font-semibold" style={{ color: 'var(--text-secondary)' }}>{k.label}</span>
        {verdict?.label && (
          <span
            className="text-[10px] mono px-1.5 py-0.5 rounded"
            style={{ background: `${vTone}1f`, color: vTone, border: `1px solid ${vTone}45` }}
          >
            {verdict.label}
          </span>
        )}
      </div>
      <div className="flex items-baseline gap-1.5 mb-1">
        <span className="mono text-xl font-bold" style={{ color: 'var(--text-primary)' }}>{k.value}</span>
        {k.unit && <span className="text-[11px] mono" style={{ color: 'var(--text-tertiary)' }}>{k.unit}</span>}
        <span className="mono text-sm ml-1" style={{ color: toneOf(k.trend ?? k.yoy) }}>{ARROW(k.trend ?? k.yoy)}</span>
      </div>
      <div className="flex items-center gap-3 flex-wrap">
        {k.yoy != null && (
          <span className="text-[11px] mono" style={{ color: toneOf(k.yoy) }}>
            同比 {fmtYoY ? fmtYoY(k.yoy) : `${k.yoy > 0 ? '+' : ''}${k.yoy}%`}
          </span>
        )}
        {k.mom != null && (
          <span className="text-[11px] mono" style={{ color: toneOf(k.mom) }}>
            环比 {k.mom > 0 ? '+' : ''}{k.mom}%
          </span>
        )}
        {isPmi && (
          <span className="text-[10px] mono" style={{ color: (k.value >= 50 ? '#10b981' : '#c41e3a') }}>
            荣枯线 50 {k.value >= 50 ? '上方·扩张' : '下方·收缩'}
          </span>
        )}
      </div>
      {verdict?.note && (
        <p className="text-[11px] leading-relaxed mt-1.5" style={{ color: 'var(--text-tertiary)' }}>{verdict.note}</p>
      )}
    </div>
  );
}

export const CANARY_LIGHT = {
  green: { c: '#10b981', t: '正常' },
  amber: { c: '#e8a317', t: '警示' },
  red: { c: '#c41e3a', t: '告警' },
};
