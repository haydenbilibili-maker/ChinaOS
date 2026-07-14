import React from 'react';
import { fmtYoY } from './liveWorldBank.js';
import { indicatorVerdict, indicatorSparkline } from './econData.js';
import { macroReadForIndicator } from './econMacroBridge.js';
import { Sparkline } from './econUI.jsx';

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

const VERDICT_META = {
  positive: { color: '#10b981', label: '好转' },
  caution: { color: '#e8a317', label: '警示' },
  negative: { color: '#c41e3a', label: '承压' },
  neutral: { color: '#64748b', label: '中性' },
};

export function IndicatorCard({ k }) {
  const verdict = indicatorVerdict ? indicatorVerdict(k) : null;
  const vMeta = VERDICT_META[verdict?.tone] || VERDICT_META.neutral;
  const vTone = vMeta.color;
  const isPmi = /pmi|景气|荣枯/i.test(`${k.id}${k.label}`) || k.threshold === 50;
  const sparkPts = indicatorSparkline(k.id);
  const sparkColor = toneOf(k.trend ?? k.yoy);
  const sparkZero = k.group === '物价' || k.threshold === 0;
  const macroCtx = macroReadForIndicator(k.id);

  return (
    <div className="os-card p-3 econ-indicator-card" style={{ borderLeft: `3px solid ${vTone}` }}>
      <div className="flex items-start justify-between gap-2 mb-1.5">
        <span className="text-xs font-semibold" style={{ color: 'var(--text-secondary)' }}>{k.label}</span>
        {verdict?.text && (
          <span
            className="text-[10px] mono px-1.5 py-0.5 rounded shrink-0"
            style={{ background: `${vTone}1f`, color: vTone, border: `1px solid ${vTone}45` }}
          >
            {vMeta.label}
          </span>
        )}
      </div>
      <div className="flex items-end justify-between gap-2 mb-1">
        <div className="flex items-baseline gap-1.5 flex-wrap min-w-0">
          <span className="mono text-xl font-bold" style={{ color: 'var(--text-primary)' }}>{k.value}</span>
          {k.unit && <span className="text-[11px] mono" style={{ color: 'var(--text-tertiary)' }}>{k.unit}</span>}
          <span className="mono text-sm ml-1" style={{ color: toneOf(k.trend ?? k.yoy) }}>{ARROW(k.trend ?? k.yoy)}</span>
        </div>
        {sparkPts && (
          <Sparkline
            points={sparkPts}
            color={sparkColor}
            zero={sparkZero}
            width={88}
            height={26}
          />
        )}
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
      {verdict?.text && (
        <p className="text-[11px] leading-relaxed mt-1.5" style={{ color: 'var(--text-tertiary)' }}>{verdict.text}</p>
      )}
      {macroCtx && (
        <p className="text-[10px] leading-relaxed mt-1.5 pt-1.5" style={{ color: 'var(--text-tertiary)', borderTop: '1px solid var(--border-subtle)' }}>
          <span className="mono" style={{ color: '#8090c6' }}>{macroCtx.tag}</span>
          {' · '}
          {macroCtx.read}
        </p>
      )}
    </div>
  );
}

export const CANARY_LIGHT = {
  green: { c: '#10b981', t: '正常' },
  amber: { c: '#e8a317', t: '警示' },
  red: { c: '#c41e3a', t: '告警' },
};
