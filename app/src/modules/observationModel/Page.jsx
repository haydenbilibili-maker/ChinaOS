import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { PageHeader, Card, Grid, Stat, StatGrid, ChartCard, DistBar } from '../../app/ui.jsx';
import EChart from '../../lib/viz/EChart.jsx';
import { AXIS, LABEL, GRID_LINE, CHART_TOOLTIP, chartSeriesColor } from '../shared/chartHelpers.js';
import { IntroCard, SelectorBar, ModuleFooter } from '../shared/ModuleParadigm.jsx';
import {
  MODEL_AS_OF, CC_BASE, ATTENDANCE_ALERT, INDICATOR_GROUPS, INDICATORS, POLITBURO, CMC,
  PLENUMS, SCENARIOS, L_SIGNALS, ECON, PROPERTY_TREND, EVENTS, MODEL_SOURCES,
} from './model.seed.js';
import { plenumRates, eliteKpis, bayesUpdate, groupScenarios, circleCounts } from './modelLogic.js';
import './observationModel.css';

// ============================================================================
// 治理结构 · 复杂网络观测模型
// ----------------------------------------------------------------------------
// 以总书记为枢纽的星型—层级网络：四条权力管道 × 四个人事圈层。
// 本页把模型的可观测层落地：精英稳定性 · 情景概率（含似然更新器）·
// 经济信号 · 指标字典 · 节点表 · 事件日志。方法见 docs/observation-model/。
// ============================================================================

const NEG = '#e5483b';
const STATUS_COLOR = {
  预警: 'var(--status-negative)',
  关注: 'var(--status-caution)',
  正常: 'var(--status-positive)',
  待评: 'var(--text-tertiary)',
};

const signed = (v) => `${v > 0 ? '+' : v < 0 ? '−' : ''}${Math.abs(v).toFixed(1)}`;

function StatusPill({ status }) {
  const color = STATUS_COLOR[status] || 'var(--text-tertiary)';
  return <span className="om-pill mono" style={{ color, borderColor: color }}>{status}</span>;
}

function DataTable({ caption, head, children }) {
  return (
    <div className="os-table-scroll">
      <table className="om-table">
        <caption className="sr-only">{caption}</caption>
        <thead><tr>{head.map((h) => <th key={h} scope="col">{h}</th>)}</tr></thead>
        <tbody>{children}</tbody>
      </table>
    </div>
  );
}

function plenumOption(rows) {
  return {
    tooltip: {
      ...CHART_TOOLTIP,
      trigger: 'axis',
      formatter: (ps) => {
        const r = rows[ps[0].dataIndex];
        return `${r.plenum}全会（${r.date}）<br/>出席 ${r.total} 人 · ${r.share.toFixed(1)}%<br/>中委 ${r.full} · 候补 ${r.alternates}`;
      },
    },
    grid: { left: 40, right: 16, top: 28, bottom: 30 },
    xAxis: { type: 'category', data: rows.map((r) => `${r.plenum} · ${r.date}`), axisLine: AXIS, axisLabel: LABEL },
    yAxis: { type: 'value', max: 400, splitLine: GRID_LINE, axisLabel: LABEL },
    series: [{
      type: 'bar',
      barWidth: '46%',
      data: rows.map((r) => ({ value: r.total, itemStyle: { color: r.share < ATTENDANCE_ALERT ? NEG : chartSeriesColor(0), borderRadius: [4, 4, 0, 0] } })),
      label: { show: true, position: 'top', formatter: (p) => `${rows[p.dataIndex].share.toFixed(1)}%`, color: LABEL.color },
      markLine: {
        symbol: 'none',
        lineStyle: { type: 'dashed', color: LABEL.color, opacity: 0.6 },
        label: { formatter: `二十大选出 ${CC_BASE} 人`, color: LABEL.color, position: 'insideEndTop' },
        data: [{ yAxis: CC_BASE }],
      },
    }],
  };
}

function econOption(rows) {
  const data = [...rows].reverse();
  return {
    tooltip: {
      ...CHART_TOOLTIP,
      trigger: 'axis',
      axisPointer: { type: 'shadow' },
      formatter: (ps) => { const r = data[ps[0].dataIndex]; return `${r.metric}（${r.period}）：${signed(r.value)}%`; },
    },
    grid: { left: 112, right: 48, top: 8, bottom: 24 },
    xAxis: { type: 'value', splitLine: GRID_LINE, axisLabel: { ...LABEL, formatter: '{value}%' } },
    yAxis: { type: 'category', data: data.map((r) => r.metric), axisLine: AXIS, axisLabel: LABEL },
    series: [{
      type: 'bar',
      barWidth: '55%',
      data: data.map((r) => ({
        value: r.value,
        itemStyle: { color: r.value < 0 ? NEG : chartSeriesColor(0) },
        label: { position: r.value < 0 ? 'left' : 'right' },
      })),
      label: { show: true, formatter: (p) => signed(p.value), color: LABEL.color },
    }],
  };
}

function propertyOption(rows) {
  return {
    tooltip: { ...CHART_TOOLTIP, trigger: 'axis', formatter: (ps) => `${rows[ps[0].dataIndex].period}：${signed(ps[0].value)}%` },
    grid: { left: 44, right: 20, top: 28, bottom: 40 },
    xAxis: {
      type: 'category',
      data: rows.map((r) => r.period.replace(' 年 ', '\n')),
      axisLine: AXIS,
      axisLabel: LABEL,
    },
    yAxis: { type: 'value', max: 0, min: -25, splitLine: GRID_LINE, axisLabel: { ...LABEL, formatter: '{value}%' } },
    series: [{
      type: 'line',
      data: rows.map((r, i) => ({ value: r.value, itemStyle: { color: i === 0 ? LABEL.color : NEG } })),
      lineStyle: { color: NEG, width: 2 },
      symbolSize: 9,
      label: { show: true, position: 'bottom', formatter: (p) => signed(p.value), color: LABEL.color },
    }],
  };
}

function ScenarioBars({ groups }) {
  return (
    <div className="om-scen">
      {groups.map((g) => (
        <div key={g.dimension} className="om-scen__block">
          <div className="om-scen__title">{g.dimension}</div>
          <div className="om-scen__bar" role="img" aria-label={`${g.dimension}情景概率`}>
            {g.items.map((s, i) => (
              <span key={s.id} className="om-scen__seg" style={{ flexBasis: `${s.p}%`, background: chartSeriesColor(i) }} title={`${s.id} ${s.label}：${s.p}%`} />
            ))}
          </div>
          <ul className="om-scen__legend">
            {g.items.map((s, i) => (
              <li key={s.id}>
                <span className="om-swatch" style={{ background: chartSeriesColor(i) }} />
                <span className="mono">{s.id}</span> {s.label}
                <span className="mono om-scen__p">{s.p}%</span>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}

function SignalUpdater() {
  const prior = useMemo(
    () => Object.fromEntries(SCENARIOS.filter((s) => s.id.startsWith('L')).map((s) => [s.id, s.p])),
    [],
  );
  const labels = useMemo(() => Object.fromEntries(SCENARIOS.map((s) => [s.id, s.label])), []);
  const [key, setKey] = useState(L_SIGNALS[0].key);
  const signal = L_SIGNALS.find((s) => s.key === key) ?? L_SIGNALS[0];
  const post = bayesUpdate(prior, signal.like);

  return (
    <div>
      <p className="om-note">选择一个尚未发生的信号，看它一旦出现会把二十一大领导层情景的概率推向哪里（似然值为研究者主观设定）。</p>
      <SelectorBar
        items={L_SIGNALS.map((s, i) => ({ key: s.key, label: `信号 ${i + 1}` }))}
        activeKey={key}
        onSelect={setKey}
      />
      <p className="om-signal">{signal.label}</p>
      <DataTable caption="信号出现前后的情景概率" head={['情景', 'P(信号|情景)', '当前', '信号出现后', '变化']}>
        {Object.keys(prior).map((id) => {
          const d = post[id] - prior[id];
          return (
            <tr key={id}>
              <th scope="row"><span className="mono">{id}</span> {labels[id]}</th>
              <td className="mono">{signal.like[id]}</td>
              <td className="mono">{prior[id]}%</td>
              <td className="mono">{post[id].toFixed(1)}%</td>
              <td className="mono" style={{ color: d > 0.05 ? 'var(--status-positive)' : d < -0.05 ? 'var(--status-negative)' : 'var(--text-tertiary)' }}>{signed(d)}</td>
            </tr>
          );
        })}
      </DataTable>
    </div>
  );
}

/** 复杂网络观测模型 · 治理结构 */
export default function ObservationModelPage() {
  const plenums = useMemo(() => plenumRates(PLENUMS, CC_BASE), []);
  const latest = plenums.at(-1);
  const k = useMemo(() => eliteKpis({ cmc: CMC, politburo: POLITBURO, indicators: INDICATORS }), []);
  const groups = useMemo(() => groupScenarios(SCENARIOS), []);
  const l1 = SCENARIOS.find((s) => s.id === 'L1');
  const circles = useMemo(() => circleCounts(POLITBURO), []);

  const [group, setGroup] = useState('全部');
  const [circle, setCircle] = useState(null);
  const indicators = group === '全部' ? INDICATORS : INDICATORS.filter((r) => r.group === group);
  const members = circle ? POLITBURO.filter((r) => r.circle === circle && r.status === '在任') : POLITBURO;

  return (
    <div className="observation-model-page">
      <PageHeader
        badge="治理结构 · 观测模型"
        title="复杂网络观测模型"
        subtitle="以总书记为枢纽的星型—层级网络 · 精英稳定性 · 情景概率 · 指标预警 · 事件日志"
      />

      <IntroCard>
        当前读数：<b className="mono">{k.warnCount}</b> 个指标处于预警区；二十届中央军委原 <b className="mono">{k.cmcTotal}</b> 人中仅
        <b className="mono"> {k.cmcRetained} </b>人仍在任；模型对二十一大“{l1.label}”的主观概率为 <b className="mono">{l1.p}%</b>。
        模型只观测“结果的痕迹”（任免、通报、措辞、数据），不推断高层决策过程；情景概率与圈层划分属主观判断。
        模型数据截至 <span className="mono">{MODEL_AS_OF}</span>。
      </IntroCard>

      <StatGrid>
        <Stat value={`${latest.share.toFixed(1)}%`} label={`中央全会出席率（${latest.plenum}）`} sub={`较上次 ${signed(latest.change)} pp · 预警线 ${ATTENDANCE_ALERT}%`} accent={latest.share < ATTENDANCE_ALERT ? 'var(--status-negative)' : undefined} />
        <Stat value={`${k.cmcRetained} / ${k.cmcTotal}`} label="军委原成员仍在任" sub="二十届军委 · 2022 年组成" accent="var(--status-negative)" />
        <Stat value={`${k.pbPurged} / ${k.pbOriginal}`} label="政治局原委员被查处" sub="二十届政治局 · 2022 年组成" />
        <Stat value={`${k.warnCount} / ${k.indTotal}`} label="处于预警的指标" sub="政治 · 军队 · 经济 · 外部 · 话语" accent="var(--status-caution)" />
        <Stat value={`${l1.p}%`} label="L1 连任且不明确接班" sub="主观概率 · 按事件更新" />
      </StatGrid>

      <Grid cols={{ sm: 1, lg: 2 }}>
        <ChartCard title="二十届中央全会出席人数">
          <EChart option={plenumOption(plenums)} style={{ height: 260 }} />
          <p className="om-note">柱高为出席中委与候补之和，柱顶为占 {CC_BASE} 人比例；低于 {ATTENDANCE_ALERT}% 标红。</p>
        </ChartCard>
        <Card title="二十届中央军委原成员现状" hover>
          <DataTable caption="二十届中央军委原成员现状" head={['姓名', '2022 年职务', '现状']}>
            {CMC.map((r) => (
              <tr key={r.name}>
                <th scope="row">{r.name}</th>
                <td>{r.role2022}</td>
                <td style={{ color: r.inOffice ? 'var(--status-positive)' : 'var(--status-negative)' }}>{r.status}</td>
              </tr>
            ))}
          </DataTable>
        </Card>
      </Grid>

      <Grid cols={{ sm: 1, lg: 2 }}>
        <Card title="情景概率（三个独立维度）" hover>
          <ScenarioBars groups={groups} />
        </Card>
        <Card title="似然更新器 · 领导层维度" hover>
          <SignalUpdater />
        </Card>
      </Grid>

      <Grid cols={{ sm: 1, lg: 2 }}>
        <ChartCard title="2026 年主要指标同比（%）">
          <EChart option={econOption(ECON)} style={{ height: 280 }} />
          <p className="om-note">GDP、CPI、PPI 为前三季度；投资与销售为 1–10 月。来源：国家统计局。</p>
        </ChartCard>
        <ChartCard title="房地产开发投资累计同比（%）">
          <EChart option={propertyOption(PROPERTY_TREND)} style={{ height: 280 }} />
          <p className="om-note">灰点为 2025 年同期对照。</p>
        </ChartCard>
      </Grid>

      <Card title="指标字典 · 口径 / 阈值 / 状态">
        <SelectorBar
          items={['全部', ...INDICATOR_GROUPS].map((g) => ({ key: g, label: g }))}
          activeKey={group}
          onSelect={setGroup}
        />
        <DataTable caption="观测指标字典" head={['编号', '指标', '口径', '当前值', '预警阈值', '状态', '来源', '频率']}>
          {indicators.map((r) => (
            <tr key={r.id}>
              <th scope="row" className="mono">{r.id}</th>
              <td>{r.name}</td>
              <td>{r.definition}</td>
              <td className="mono">{r.current}</td>
              <td>{r.threshold}</td>
              <td><StatusPill status={r.status} /></td>
              <td>{r.source}</td>
              <td>{r.frequency}</td>
            </tr>
          ))}
        </DataTable>
      </Card>

      <Card title="二十届政治局节点表">
        <Grid cols={{ sm: 1, lg: 3 }}>
          <div>
            <p className="om-note">在任委员圈层分布（点选筛选）</p>
            <DistBar data={circles} active={circle} onPick={(c) => setCircle(circle === c ? null : c)} labelWidth={96} />
          </div>
          <div className="om-span2">
            <DataTable caption="二十届政治局成员现状" head={['姓名', '出生年', '职务或处理', '圈层', '2027 到龄', '核实']}>
              {members.map((r) => (
                <tr key={r.name} className={r.status === '被查处' ? 'om-dim' : ''}>
                  <th scope="row">{r.name}</th>
                  <td className="mono">{r.birthYear ?? '—'}</td>
                  <td style={r.status === '被查处' ? { color: 'var(--status-negative)' } : undefined}>{r.post}</td>
                  <td>{r.circle}</td>
                  <td style={r.ageOut2027 ? { color: 'var(--status-caution)' } : undefined}>{r.ageOut2027 == null ? '—' : r.ageOut2027 ? '是' : '否'}</td>
                  <td className="mono">{r.grade}</td>
                </tr>
              ))}
            </DataTable>
          </div>
        </Grid>
        <p className="om-note">到龄：按“七上八下”惯例，2027 年大会时满 68 岁。核实：A 为已核对官方报道，B 为公开履历未逐一复核。圈层依据公开共事、籍贯与系统履历划分，不代表政治归属。</p>
      </Card>

      <Card title="2026 年事件日志（编码协议）">
        <DataTable caption="2026 年事件日志" head={['日期', '事件', '类型', '影响指标', '对情景的方向', '信源']}>
          {EVENTS.map((r) => (
            <tr key={`${r.date}-${r.event}`}>
              <th scope="row" className="mono">{r.date}</th>
              <td>{r.event}</td>
              <td>{r.type}</td>
              <td className="mono">{r.indicators}</td>
              <td>{r.direction}</td>
              <td className="mono">{r.grade}</td>
            </tr>
          ))}
        </DataTable>
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
