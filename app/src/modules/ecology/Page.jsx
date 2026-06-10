import React from 'react';
import { PageHeader, Card, Grid, Stat } from '../../app/ui.jsx';
import EChart from '../../lib/viz/EChart.jsx';

const gepTrend = {
  grid: { left: 40, right: 16, top: 20, bottom: 24 },
  xAxis: { type: 'category', data: ['2019', '2020', '2021', '2022', '2023', '2024'], axisLine: { lineStyle: { color: '#27324a' } } },
  yAxis: { type: 'value', splitLine: { lineStyle: { color: 'rgba(148,163,184,0.1)' } } },
  series: [{ type: 'line', smooth: true, symbol: 'none', data: [62, 68, 75, 82, 90, 98], lineStyle: { color: '#10b981', width: 2 }, areaStyle: { color: 'rgba(16,185,129,0.1)' } }],
};

const carbonMix = {
  grid: { left: 40, right: 16, top: 20, bottom: 24 },
  xAxis: { type: 'category', data: ['2020', '2025E', '2030目标'], axisLine: { lineStyle: { color: '#27324a' } } },
  yAxis: { type: 'value', axisLabel: { formatter: '{value}%' }, max: 30, splitLine: { lineStyle: { color: 'rgba(148,163,184,0.1)' } } },
  series: [{ type: 'bar', data: [15.9, 19, 25], barWidth: 30, itemStyle: { color: '#22d3ee', borderRadius: [3, 3, 0, 0] } }],
};

const CARDS = [
  ['国家公园 · 系统治理', '以三江源、大熊猫等国家公园为载体，推进山水林田湖草沙一体化保护修复。'],
  ['物种回归 · 可见信号', '大熊猫、东北虎等旗舰物种种群回升，是生态修复成效的可观测指标。'],
  ['降碳减污 · 增长协同', '环保督察与全国碳市场推动降碳、减污、扩绿与增长的协同。'],
  ['制度创新 · 生态可定价', 'GEP 生态产品价值核算让「绿水青山」成为可量化、可交易的底层资产。'],
];

export default function Page() {
  return (
    <div>
      <PageHeader badge="Ecology" title="生态文明 · 从治理到价值" subtitle="绿水青山 · 双碳 · GEP · 全国碳市场 —— 把生态纳入核算、定价与交易的系统资产" />
      <Grid cols={4} className="mb-6">
        <Stat value="24.02%" label="森林覆盖率" accent="#10b981" />
        <Stat value="25%" label="非化石能源占比目标" accent="#22d3ee" />
        <Stat value="碳达峰" label="2030 / 碳中和 2060" />
        <Stat value="全国" label="碳市场" accent="#e8a317" />
      </Grid>
      <Grid cols={2} className="mb-6">
        <Card title="GEP 生态产品价值（示意）"><EChart option={gepTrend} style={{ height: 260 }} /></Card>
        <Card title="非化石能源占比（%）"><EChart option={carbonMix} style={{ height: 260 }} /></Card>
      </Grid>
      <Grid cols={2}>
        {CARDS.map(([t, d]) => (
          <Card key={t} title={t}><p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{d}</p></Card>
        ))}
      </Grid>
      <p className="text-xs mt-6" style={{ color: 'var(--text-tertiary)' }}>数据为公开信息综合整理，具体数值为示意值，仅供分析参考 · 由 tabs/ecology.html 迁移而来</p>
    </div>
  );
}
