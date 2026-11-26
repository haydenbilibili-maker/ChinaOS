import React, { useCallback, useMemo, useRef, useState } from 'react';
import { Card } from '../../app/ui.jsx';
import EChart from '../../lib/viz/EChart.jsx';
import { timelineOption } from './charts.js';
import { eventsForIndicator } from './modelLogic.js';
import { EVENTS } from './model.seed.js';

const keyOf = (e) => `${e.date}|${e.event}`;

/** 事件时间轴（按类型分泳道）+ 事件详情；指标看板选中某指标时只高亮相关事件 */
export default function EventPanel({ indicatorId, onClearIndicator }) {
  const [selectedKey, setSelectedKey] = useState(keyOf(EVENTS[0]));
  const related = useMemo(() => (indicatorId ? eventsForIndicator(EVENTS, indicatorId) : null), [indicatorId]);
  const highlightKeys = useMemo(() => (related ? new Set(related.map(keyOf)) : null), [related]);
  const option = useMemo(() => timelineOption(EVENTS, { selectedKey, highlightKeys }), [selectedKey, highlightKeys]);
  const selectRef = useRef(setSelectedKey);
  selectRef.current = setSelectedKey;
  const onReady = useCallback((chart) => {
    chart.on('click', (p) => { if (p.data?.key) selectRef.current(p.data.key); });
  }, []);
  const selected = EVENTS.find((e) => keyOf(e) === selectedKey);
  const list = related || EVENTS;

  return (
    <div className="om-split">
      <Card title="2026 年事件时间轴 · 按类型分泳道" className="om-split__main" asSection={false}>
        {indicatorId && (
          <div className="om-filter-note">
            仅高亮影响 <b className="mono">{indicatorId}</b> 的 {related.length} 个事件
            <button type="button" className="om-link" onClick={onClearIndicator}>显示全部</button>
          </div>
        )}
        <EChart option={option} onReady={onReady} style={{ height: 230 }} />
        {selected && (
          <div className="om-event-detail">
            <div className="om-detail__kicker">{selected.date} · {selected.type} · 信源 {selected.grade}</div>
            <div className="om-event-detail__title">{selected.event}</div>
            <div className="om-sub">影响指标 <span className="mono">{selected.indicators}</span> · 对情景的方向 <b>{selected.direction}</b></div>
          </div>
        )}
      </Card>
      <Card title={indicatorId ? `相关事件（${indicatorId}）` : '事件日志'} className="om-split__side" asSection={false}>
        <ul className="om-evlist om-evlist--click">
          {list.map((e) => (
            <li key={keyOf(e)}>
              <button type="button" className={keyOf(e) === selectedKey ? 'is-on' : ''} onClick={() => setSelectedKey(keyOf(e))}>
                <span className="mono">{e.date}</span>
                <span>{e.event}</span>
                <span className="om-sub">{e.direction}</span>
              </button>
            </li>
          ))}
        </ul>
      </Card>
    </div>
  );
}
