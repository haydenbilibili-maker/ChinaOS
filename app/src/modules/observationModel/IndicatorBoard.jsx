import React, { useMemo } from 'react';
import { Card } from '../../app/ui.jsx';
import { eventsForIndicator, indicatorDimSummary } from './modelLogic.js';
import { EVENTS, INDICATOR_GROUPS, INDICATORS } from './model.seed.js';
import StatusPill from './StatusPill.jsx';

const STATUS_BAR = { 预警: 'var(--status-negative)', 关注: 'var(--status-caution)', 正常: 'var(--status-positive)', 待评: 'var(--text-tertiary)' };

/** 指标看板：五组状态磁贴（点选筛选）+ 指标表（点选联动事件时间轴） */
export default function IndicatorBoard({ group, onGroup, selectedId, onSelect }) {
  const summary = useMemo(() => indicatorDimSummary(INDICATORS, INDICATOR_GROUPS), []);
  const rows = group ? INDICATORS.filter((r) => r.group === group) : INDICATORS;

  return (
    <Card title="指标看板 · 20 项，点磁贴筛选、点行联动事件" asSection={false}>
      <div className="om-tiles" role="group" aria-label="指标分组">
        {summary.map((s) => (
          <button key={s.group} type="button" className={`om-tile ${group === s.group ? 'is-on' : ''}`} aria-pressed={group === s.group} onClick={() => onGroup(group === s.group ? null : s.group)}>
            <span className="om-tile__name">{s.group}</span>
            <span className="om-tile__counts mono">
              <i style={{ color: 'var(--status-negative)' }}>{s.warn}<small>预警</small></i>
              <i style={{ color: 'var(--status-caution)' }}>{s.watch}<small>关注</small></i>
              <i style={{ color: 'var(--status-positive)' }}>{s.ok}<small>正常</small></i>
            </span>
            <span className="om-tile__bar">
              {['预警', '关注', '正常', '待评'].map((k) => {
                const n = { 预警: s.warn, 关注: s.watch, 正常: s.ok, 待评: s.pending }[k];
                return n ? <span key={k} style={{ flexGrow: n, background: STATUS_BAR[k] }} /> : null;
              })}
            </span>
          </button>
        ))}
      </div>
      <div className="os-table-scroll">
        <table className="om-table om-table--dense">
          <caption className="sr-only">观测指标</caption>
          <thead>
            <tr><th scope="col">编号</th><th scope="col">指标</th><th scope="col">当前值</th><th scope="col">预警阈值</th><th scope="col">状态</th><th scope="col">关联事件</th><th scope="col">来源 · 频率</th></tr>
          </thead>
          <tbody>
            {rows.map((r) => {
              const n = eventsForIndicator(EVENTS, r.id).length;
              const on = selectedId === r.id;
              return (
                <tr
                  key={r.id}
                  className={`om-row-click ${on ? 'is-on' : ''}`}
                  style={{ '--row-accent': STATUS_BAR[r.status] }}
                  tabIndex={0}
                  aria-selected={on}
                  onClick={() => onSelect(on ? null : r.id)}
                  onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onSelect(on ? null : r.id); } }}
                >
                  <th scope="row" className="mono">{r.id}</th>
                  <td><div>{r.name}</div><div className="om-sub">{r.definition}</div></td>
                  <td className="mono">{r.current}</td>
                  <td>{r.threshold}</td>
                  <td><StatusPill status={r.status} /></td>
                  <td className="mono">{n || '—'}</td>
                  <td className="om-sub">{r.source} · {r.frequency}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
