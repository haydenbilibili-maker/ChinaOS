import React from 'react';
import { PageHeader, Card, Grid, Stat } from '../../app/ui.jsx';
import EChart from '../../lib/viz/EChart.jsx';

const rdShare = {
  grid: { left: 40, right: 16, top: 20, bottom: 24 },
  xAxis: { type: 'category', data: ['2019', '2021', '2023', '2025E', '2030E'], axisLine: { lineStyle: { color: '#27324a' } } },
  yAxis: { type: 'value', axisLabel: { formatter: '{value}%' }, max: 12, splitLine: { lineStyle: { color: 'rgba(148,163,184,0.1)' } } },
  series: [{ type: 'line', smooth: true, symbol: 'circle', symbolSize: 6, data: [6.0, 6.5, 6.8, 8.0, 10.0], lineStyle: { color: '#10b981', width: 2 }, itemStyle: { color: '#10b981' }, areaStyle: { color: 'rgba(16,185,129,0.1)' } }],
};

const actorPie = {
  tooltip: { trigger: 'item' },
  legend: { bottom: 0, textStyle: { color: '#93a1b5' } },
  series: [{ type: 'pie', radius: ['40%', '68%'], center: ['50%', '42%'], label: { color: '#93a1b5' }, data: [
    { value: 38, name: '高校', itemStyle: { color: '#22d3ee' } },
    { value: 30, name: '国家实验室', itemStyle: { color: '#c41e3a' } },
    { value: 20, name: '科研院所', itemStyle: { color: '#e8a317' } },
    { value: 12, name: '新型研发机构', itemStyle: { color: '#10b981' } },
  ] }],
};

const CARDS = [
  ['国家实验室体系', '国家实验室 + 高校 + 新型研发机构构成基础研究主力矩阵。'],
  ['评价改革', '破「四唯」、推同行评议，引导科研资源向原始创新再配置。'],
  ['无人区布局', '强化前沿与「卡脖子」基础问题的长周期、稳定投入。'],
  ['仪器自主', '高端科研仪器国产化是基础研究自主可控的关键支撑。'],
];

export default function Page() {
  return (
    <div>
      <PageHeader badge="Basic Research" title="基础研究与研发结构" subtitle="国家实验室 · 评价改革 · 原始创新 —— 提升基础研究占比、向无人区布局" />
      <Grid cols={4} className="mb-6">
        <Stat value="~6.8%" label="基础研究占 R&D" accent="#10b981" />
        <Stat value="10% 目标" label="占比目标" accent="#22d3ee" />
        <Stat value="国家实验室" label="战略科技力量" accent="#c41e3a" />
        <Stat value="20,000+" label="大科学装置/仪器（示意）" accent="#e8a317" />
      </Grid>
      <Grid cols={2} className="mb-6">
        <Card title="基础研究占 R&D 比重（% · 示意）"><EChart option={rdShare} style={{ height: 260 }} /></Card>
        <Card title="基础研究主体结构（示意）"><EChart option={actorPie} style={{ height: 260 }} /></Card>
      </Grid>
      <Grid cols={2}>
        {CARDS.map(([t, d]) => (<Card key={t} title={t}><p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{d}</p></Card>))}
      </Grid>
      <p className="text-xs mt-6" style={{ color: 'var(--text-tertiary)' }}>数据为公开信息综合整理，具体数值为示意值，仅供分析参考 · 由 china.html「基础研究」专题迁移</p>
    </div>
  );
}
