import React, { useMemo, useState } from 'react';
import { Card } from '../../app/ui.jsx';
import EChart from '../../lib/viz/EChart.jsx';
import { L_COLORS, signed, trajectoryOption } from './charts.js';
import { applySignals, groupScenarios, lTrajectory } from './modelLogic.js';
import { L_PRIOR_BASE, L_SCENARIOS, L_SIGNALS, L_UPDATES, SCENARIOS } from './model.seed.js';

function StackRow({ label, probs }) {
  return (
    <div className="om-stack">
      <span className="om-stack__label">{label}</span>
      <span className="om-stack__bar">
        {L_SCENARIOS.map((s) => (
          <span key={s.id} style={{ flexBasis: `${probs[s.id]}%`, background: L_COLORS[s.id] }} title={`${s.id} ${s.label}：${probs[s.id]}%`}>
            {probs[s.id] >= 12 ? `${s.id} ${Math.round(probs[s.id])}%` : ''}
          </span>
        ))}
      </span>
    </div>
  );
}

/** 情景概率：已发生事件的轨迹 + 假设信号推演 */
export default function ScenarioPanel() {
  const points = useMemo(() => lTrajectory(L_PRIOR_BASE, L_UPDATES), []);
  const current = points.at(-1).probs;
  const [picked, setPicked] = useState([]);
  const whatIf = picked.length ? applySignals(current, picked.map((k) => L_SIGNALS.find((s) => s.key === k).like)) : null;
  const option = useMemo(() => trajectoryOption(points, whatIf), [points, whatIf]);
  const others = useMemo(() => groupScenarios(SCENARIOS), []);
  const toggle = (key) => setPicked((xs) => (xs.includes(key) ? xs.filter((x) => x !== key) : [...xs, key]));

  return (
    <div className="om-split om-split--even">
      <Card title="领导层情景 · 概率轨迹（按已发生事件更新）" asSection={false}>
        <EChart option={option} style={{ height: 260 }} />
        <ol className="om-updates">
          {L_UPDATES.map((u, i) => (
            <li key={u.date}>
              <div><span className="mono">{u.date}</span> <b>{u.label}</b> · {u.event}</div>
              <div className="om-updates__like mono">
                似然 L1 {u.like.L1} · L2 {u.like.L2} · L3 {u.like.L3} → L1 {points[i + 1].probs.L1}% / L2 {points[i + 1].probs.L2}% / L3 {points[i + 1].probs.L3}%
              </div>
              <div className="om-note" style={{ marginTop: 2 }}>{u.why}</div>
            </li>
          ))}
        </ol>
      </Card>

      <Card title="假设推演 · 如果下列信号出现" asSection={false}>
        <p className="om-note" style={{ marginTop: 0 }}>可多选，按点选顺序依次做贝叶斯更新；图左侧虚线同步显示。似然值为研究者主观设定。</p>
        <div className="om-chips" role="group" aria-label="假设信号">
          {L_SIGNALS.map((s, i) => (
            <button key={s.key} type="button" className={`om-chip ${picked.includes(s.key) ? 'is-on' : ''}`} aria-pressed={picked.includes(s.key)} onClick={() => toggle(s.key)}>
              <span className="mono">{i + 1}</span> {s.label}
            </button>
          ))}
        </div>
        <StackRow label="当前" probs={current} />
        {whatIf ? <StackRow label="信号出现后" probs={whatIf} /> : <p className="om-note">点选上方任一信号，查看概率如何移动。</p>}
        {whatIf && (
          <div className="om-deltas">
            {L_SCENARIOS.map((s) => {
              const d = whatIf[s.id] - current[s.id];
              return (
                <div key={s.id} className="om-delta">
                  <span className="mono" style={{ color: L_COLORS[s.id] }}>{s.id}</span> {s.label}
                  <b className="mono" style={{ color: d > 0.05 ? 'var(--status-positive)' : d < -0.05 ? 'var(--status-negative)' : 'var(--text-tertiary)' }}>{signed(d)} pp</b>
                </div>
              );
            })}
            <button type="button" className="om-link" onClick={() => setPicked([])}>清除假设</button>
          </div>
        )}
        <div className="om-divider" />
        {others.map((g) => (
          <div key={g.dimension} className="om-mini">
            <div className="om-mini__title">{g.dimension}</div>
            {g.items.map((s) => (
              <div key={s.id} className="om-mini__row">
                <span className="mono">{s.id}</span>
                <span className="om-mini__label">{s.label}</span>
                <span className="om-mini__track"><span style={{ width: `${s.p}%` }} /></span>
                <b className="mono">{s.p}%</b>
              </div>
            ))}
          </div>
        ))}
      </Card>
    </div>
  );
}
