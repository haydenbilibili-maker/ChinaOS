import React from 'react';
import { PageHeader, Card, Grid, Stat } from '../../app/ui.jsx';
import EChart from '../../lib/viz/EChart.jsx';

const selfSufficiency = {
  grid: { left: 40, right: 16, top: 20, bottom: 24 },
  xAxis: { type: 'category', data: ['2019', '2021', '2023', '2025E', '2027E'], axisLine: { lineStyle: { color: '#27324a' } } },
  yAxis: { type: 'value', axisLabel: { formatter: '{value}%' }, max: 40, splitLine: { lineStyle: { color: 'rgba(148,163,184,0.1)' } } },
  series: [{ type: 'line', smooth: true, symbol: 'circle', symbolSize: 6, data: [16, 19, 23, 28, 33], lineStyle: { color: '#22d3ee', width: 2 }, itemStyle: { color: '#22d3ee' }, areaStyle: { color: 'rgba(34,211,238,0.1)' } }],
};

const fundPie = {
  tooltip: { trigger: 'item' },
  legend: { bottom: 0, textStyle: { color: '#93a1b5' } },
  series: [{ type: 'pie', radius: ['40%', '68%'], center: ['50%', '42%'], label: { color: '#93a1b5' }, data: [
    { value: 40, name: '制造产能', itemStyle: { color: '#c41e3a' } },
    { value: 28, name: '设备', itemStyle: { color: '#22d3ee' } },
    { value: 20, name: '材料', itemStyle: { color: '#e8a317' } },
    { value: 12, name: '设计/EDA', itemStyle: { color: '#10b981' } },
  ] }],
};

const CARDS = [
  ['成熟制程防御带', '以成熟制程筑底，先扩大可控产能再向先进制程突破。'],
  ['设计 · EDA · IP', '设计能力相对领先，EDA 工具与高端 IP 仍是卡脖子环节。'],
  ['先进封装 · Chiplet', '以先进封装与 Chiplet 换道，绕开光刻先进制程壁垒。'],
  ['大基金 III 期', '大基金三期重点投向设备、材料等薄弱环节，补链强链。'],
];

export default function Page() {
  return (
    <div>
      <PageHeader badge="Semiconductor" title="半导体 · 芯片主权" subtitle="成熟制程筑底 · 先进封装 · 大基金 —— 以换道与补链对冲先进制程封锁" />
      <Grid cols={4} className="mb-6">
        <Stat value="~4,000 亿$" label="IC 年进口" accent="#c41e3a" />
        <Stat value="~25%" label="自给率" accent="#22d3ee" />
        <Stat value="大基金 III" label="重点补链" accent="#e8a317" />
        <Stat value="TOP 3" label="封测全球位势" />
      </Grid>
      <Grid cols={2} className="mb-6">
        <Card title="IC 自给率走势（% · 示意）"><EChart option={selfSufficiency} style={{ height: 260 }} /></Card>
        <Card title="大基金 III 期投向结构（示意）"><EChart option={fundPie} style={{ height: 260 }} /></Card>
      </Grid>
      <Grid cols={2}>
        {CARDS.map(([t, d]) => (<Card key={t} title={t}><p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{d}</p></Card>))}
      </Grid>
      <p className="text-xs mt-6" style={{ color: 'var(--text-tertiary)' }}>数据为公开信息综合整理，具体数值为示意值，仅供分析参考 · 由 china.html「半导体」专题迁移</p>
    </div>
  );
}
