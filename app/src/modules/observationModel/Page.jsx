import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { PageHeader, Card, Stat, StatGrid } from '../../app/ui.jsx';
import EChart from '../../lib/viz/EChart.jsx';
import { ModuleFooter } from '../shared/ModuleParadigm.jsx';
import { econOption, plenumOption, propertyOption, signed } from './charts.js';
import {
  ATTENDANCE_ALERT, CC_BASE, CMC, ECON, INDICATORS, L_PRIOR_BASE, L_UPDATES, MODEL_AS_OF, MODEL_SOURCES,
  PLENUMS, POLITBURO, PROPERTY_TREND, SUCCESSOR_BIRTH_RANGE,
} from './model.seed.js';
import { eliteKpis, lTrajectory, plenumRates, successorPool } from './modelLogic.js';
import NetworkPanel from './NetworkPanel.jsx';
import ScenarioPanel from './ScenarioPanel.jsx';
import IndicatorBoard from './IndicatorBoard.jsx';
import EventPanel from './EventPanel.jsx';
import './observationModel.css';

// ============================================================================
// 治理结构 · 复杂网络观测模型（v2 观测驾驶舱）
// ----------------------------------------------------------------------------
// 第一屏即判读：读数条 + 六项核心读数；随后是可交互的网络结构（2022/2026 快照对照）、
// 情景概率轨迹与假设推演、指标看板 ↔ 事件时间轴联动、精英与经济底层读数。
// 数据：model.seed.js（单一数据源）；方法：docs/observation-model/。图表配置在 charts.js（含 chartHelpers）。
// ============================================================================

const ORIGINAL_POOL = 10; // 二十大组成时接班候选池人数（口径见 SUCCESSOR_BIRTH_RANGE）

/** 复杂网络观测模型 · 治理结构 */
export default function ObservationModelPage() {
  const plenums = useMemo(() => plenumRates(PLENUMS, CC_BASE), []);
  const latest = plenums.at(-1);
  const k = useMemo(() => eliteKpis({ cmc: CMC, politburo: POLITBURO, indicators: INDICATORS }), []);
  const pool = useMemo(() => successorPool(POLITBURO, SUCCESSOR_BIRTH_RANGE), []);
  const traj = useMemo(() => lTrajectory(L_PRIOR_BASE, L_UPDATES), []);
  const nowL = traj.at(-1).probs;
  const prevL = traj.at(-2).probs;
  const lastUpdate = L_UPDATES.at(-1);

  const [group, setGroup] = useState(null);
  const [indicatorId, setIndicatorId] = useState(null);

  const plenumOpt = useMemo(() => plenumOption(plenums, { base: CC_BASE, alert: ATTENDANCE_ALERT }), [plenums]);
  const econOpt = useMemo(() => econOption(ECON), []);
  const propOpt = useMemo(() => propertyOption(PROPERTY_TREND), []);

  return (
    <div className="observation-model-page">
      <PageHeader
        badge="治理结构 · 观测模型"
        title="复杂网络观测模型"
        subtitle="以总书记为枢纽的星型—层级网络 · 网络结构 · 情景概率 · 指标预警 · 事件编码"
      />

      <div className="os-card om-readout" role="status">
        <div className="om-readout__head">
          <span className="om-readout__tag mono">读数 · {MODEL_AS_OF}</span>
          <span className="om-readout__latest">最新更新：<b>{lastUpdate.date}</b> {lastUpdate.event}</span>
        </div>
        <p className="om-readout__line">
          政治局原委员被查 <b className="mono">{k.pbPurged}/{k.pbOriginal}</b>，军委原成员在任仅 <b className="mono">{k.cmcRetained}/{k.cmcTotal}</b>，
          接班候选池由 <b className="mono">{ORIGINAL_POOL}</b> 人收缩至 <b className="mono">{pool.length}</b> 人；
          二十一大“连任且不明确接班”的主观概率升至 <b className="mono">{nowL.L1}%</b>（上次 {prevL.L1}%，{signed(nowL.L1 - prevL.L1)} pp）。
          <b className="mono"> {k.warnCount}/{k.indTotal}</b> 项指标处于预警区。
        </p>
      </div>

      <StatGrid>
        <Stat value={`${k.pbPurged}/${k.pbOriginal}`} label="政治局原委员被查处" sub="二十届 · 2022 年组成" accent="var(--status-negative)" />
        <Stat value={`${k.cmcRetained}/${k.cmcTotal}`} label="军委原成员仍在任" sub="二十届军委" accent="var(--status-negative)" />
        <Stat value={`${pool.length}`} label="接班候选池" sub={`未到龄 · 1960 年代生 · 原 ${ORIGINAL_POOL} 人`} accent="var(--status-caution)" />
        <Stat value={`${latest.share.toFixed(1)}%`} label={`全会出席率（${latest.plenum}）`} sub={`较上次 ${signed(latest.change)} pp`} accent={latest.share < ATTENDANCE_ALERT ? 'var(--status-negative)' : undefined} />
        <Stat value={`${nowL.L1}%`} label="L1 连任不明确接班" sub={`${signed(nowL.L1 - prevL.L1)} pp · ${lastUpdate.label}`} />
        <Stat value={`${k.warnCount}/${k.indTotal}`} label="预警指标" sub="政治 · 军队 · 经济 · 外部 · 话语" accent="var(--status-caution)" />
      </StatGrid>

      <section className="om-section" id="om-network"><NetworkPanel /></section>

      <section className="om-section" id="om-scenarios"><ScenarioPanel /></section>

      <section className="om-section" id="om-indicators">
        <IndicatorBoard group={group} onGroup={setGroup} selectedId={indicatorId} onSelect={setIndicatorId} />
      </section>

      <section className="om-section" id="om-events">
        <EventPanel indicatorId={indicatorId} onClearIndicator={() => setIndicatorId(null)} />
      </section>

      <section className="om-section om-trio" id="om-base">
        <Card title="中央全会出席人数" asSection={false}>
          <EChart option={plenumOpt} style={{ height: 210 }} />
          <p className="om-note">柱顶为占 {CC_BASE} 人比例，低于 {ATTENDANCE_ALERT}% 标红。</p>
        </Card>
        <Card title="2026 年主要指标同比" asSection={false}>
          <EChart option={econOpt} style={{ height: 210 }} />
          <p className="om-note">GDP、CPI、PPI 为前三季度；投资与销售为 1–10 月。</p>
        </Card>
        <Card title="房地产开发投资累计同比" asSection={false}>
          <EChart option={propOpt} style={{ height: 210 }} />
          <p className="om-note">灰点为 2025 年同期对照。</p>
        </Card>
      </section>

      <Card title="口径与来源" asSection={false} className="om-section">
        <p className="om-note" style={{ marginTop: 0 }}>
          模型只观测“结果的痕迹”（任免、通报、措辞、数据），不推断高层决策过程。情景概率、似然值与圈层划分属主观判断；
          核实等级 A 为已核对官方一手来源，B 为权威媒体转述或公开履历。接班候选池口径：2027 年未到龄、1960 年代出生的在任政治局委员。
        </p>
        <p className="om-note">
          主要来源：
          {MODEL_SOURCES.map((s, i) => (
            <React.Fragment key={s.url}>
              {i > 0 ? ' · ' : ''}
              <a href={s.url} target="_blank" rel="noreferrer">{s.label}</a>
            </React.Fragment>
          ))}
        </p>
        <Link to="/modules/signal-panel" className="om-cross">关联：宏观再平衡信号灯 · 经济维度的 A/B/C 信号 ↗</Link>
      </Card>

      <ModuleFooter moduleId="observationModel" sourceNote={`模型数据截至 ${MODEL_AS_OF}`} />
    </div>
  );
}
