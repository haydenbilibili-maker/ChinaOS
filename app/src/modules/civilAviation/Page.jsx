import React from 'react';
import { PageHeader, Card, Grid, Stat } from '../../app/ui.jsx';
import EChart from '../../lib/viz/EChart.jsx';

const fleetTrend = {
  grid: { left: 44, right: 16, top: 20, bottom: 24 },
  xAxis: { type: 'category', data: ['2023', '2025E', '2030E', '2035E'], axisLine: { lineStyle: { color: '#27324a' } } },
  yAxis: { type: 'value', axisLabel: { formatter: '{value}%' }, splitLine: { lineStyle: { color: 'rgba(148,163,184,0.1)' } } },
  series: [{ type: 'line', smooth: true, symbol: 'circle', symbolSize: 6, data: [1, 4, 9, 15], lineStyle: { color: '#22d3ee', width: 2 }, itemStyle: { color: '#22d3ee' }, areaStyle: { color: 'rgba(34,211,238,0.1)' } }],
};

const trlBar = {
  grid: { left: 90, right: 24, top: 16, bottom: 24 },
  xAxis: { type: 'value', max: 9, name: 'TRL', nameTextStyle: { color: '#5b6a82' }, splitLine: { lineStyle: { color: 'rgba(148,163,184,0.1)' } } },
  yAxis: { type: 'category', data: ['CJ-1000A 发动机', 'C929 宽体', 'ARJ21 支线', 'C919 窄体'], axisLine: { lineStyle: { color: '#27324a' } } },
  series: [{ type: 'bar', data: [5, 4, 9, 8], barWidth: 14, itemStyle: { borderRadius: 3, color: (p) => ['#e8a317', '#e8a317', '#10b981', '#22d3ee'][p.dataIndex] }, label: { show: true, position: 'right', formatter: 'TRL {c}', color: '#93a1b5' } }],
};

const CARDS = [
  ['C919 · 窄体干线', '国产窄体干线客机交付放量，逐步进入主流航司机队。'],
  ['C929 宽体 / ARJ21', 'C929 宽体研制推进，ARJ21 支线已规模运营。'],
  ['CJ-1000A 发动机攻坚', '国产航发是产业链最硬的卡脖子环节，仍处攻坚期。'],
  ['EASA 适航 · 低空经济', '适航出海打开国际市场；低空经济与 eVTOL、数字航路成新增长极。'],
];

export default function Page() {
  return (
    <div>
      <PageHeader badge="Civil Aviation" title="民航 · 国产大飞机与低空经济" subtitle="C919 · 数字航路 · eVTOL · 低空经济 —— 国产化攻坚与适航出海" />
      <Grid cols={4} className="mb-6">
        <Stat value="158–192 座" label="C919 座级" accent="#22d3ee" />
        <Stat value="TRL 7–8" label="C919 成熟度" accent="#10b981" />
        <Stat value="审定推进中" label="EASA 适航" accent="#e8a317" />
        <Stat value="~15%" label="2035 国产机队占比" accent="#c41e3a" />
      </Grid>
      <Grid cols={2} className="mb-6">
        <Card title="国产机队占比演进（% · 示意）"><EChart option={fleetTrend} style={{ height: 260 }} /></Card>
        <Card title="国产机型/动力成熟度 TRL（示意）"><EChart option={trlBar} style={{ height: 260 }} /></Card>
      </Grid>
      <Grid cols={2}>
        {CARDS.map(([t, d]) => (
          <Card key={t} title={t}><p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{d}</p></Card>
        ))}
      </Grid>
      <p className="text-xs mt-6" style={{ color: 'var(--text-tertiary)' }}>数据为公开信息综合整理，具体数值为示意值，仅供分析参考 · 由 tabs/civilAviation.html 迁移而来</p>
    </div>
  );
}
