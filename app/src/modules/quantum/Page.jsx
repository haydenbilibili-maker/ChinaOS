import React from 'react';
import { PageHeader, Card, Grid, Stat } from '../../app/ui.jsx';
import EChart from '../../lib/viz/EChart.jsx';

const cnUsRadar = {
  legend: { data: ['中国', '美国'], textStyle: { color: '#93a1b5' }, top: 0 },
  radar: {
    indicator: [{ name: '量子计算', max: 100 }, { name: '量子通信', max: 100 }, { name: '量子测量', max: 100 }, { name: '人才储备', max: 100 }, { name: '仪器自主', max: 100 }],
    axisName: { color: '#93a1b5' }, splitLine: { lineStyle: { color: 'rgba(148,163,184,0.15)' } }, splitArea: { show: false },
  },
  series: [{ type: 'radar', data: [
    { value: [85, 95, 80, 75, 55], name: '中国', lineStyle: { color: '#c41e3a' }, areaStyle: { color: 'rgba(196,30,58,0.12)' } },
    { value: [95, 70, 90, 92, 88], name: '美国', lineStyle: { color: '#22d3ee' }, areaStyle: { color: 'rgba(34,211,238,0.1)' } },
  ] }],
};

const investTrend = {
  grid: { left: 40, right: 16, top: 20, bottom: 24 },
  xAxis: { type: 'category', data: ['2018', '2020', '2022', '2024', '2026E'], axisLine: { lineStyle: { color: '#27324a' } } },
  yAxis: { type: 'value', splitLine: { lineStyle: { color: 'rgba(148,163,184,0.1)' } } },
  series: [{ type: 'line', smooth: true, symbol: 'none', data: [40, 60, 85, 110, 140], lineStyle: { color: '#e8a317', width: 2 }, areaStyle: { color: 'rgba(232,163,23,0.1)' } }],
};

const CARDS = [
  ['量子优越性 · 计算', '「九章」光量子、「祖冲之号」超导双线推进量子计算优越性。'],
  ['量子保密通信 · 通信', '京沪干线与「墨子号」构建量子保密通信骨架，通信领域相对领先。'],
  ['精密测量', '量子精密测量在导航、授时、传感等场景加速工程化。'],
  ['人才与仪器依赖', '高端测控仪器与稀释制冷机等仍存进口依赖，是关键短板。'],
];

export default function Page() {
  return (
    <div>
      <PageHeader badge="Quantum" title="量子信息 · 计算 · 通信 · 测量" subtitle="量子优越性 · 保密通信干线 · 精密测量 —— 计算领域追赶、通信领域相对领先" />
      <Grid cols={4} className="mb-6">
        <Stat value="九章/祖冲之" label="双技术路线" accent="#c41e3a" />
        <Stat value="京沪干线" label="量子保密通信" accent="#22d3ee" />
        <Stat value="通信领先" label="相对位势" accent="#10b981" />
        <Stat value="仪器依赖" label="关键短板" accent="#e8a317" />
      </Grid>
      <Grid cols={2} className="mb-6">
        <Card title="中美量子能力对比（示意）"><EChart option={cnUsRadar} style={{ height: 280 }} /></Card>
        <Card title="量子科研投入走势（亿元 · 示意）"><EChart option={investTrend} style={{ height: 280 }} /></Card>
      </Grid>
      <Grid cols={2}>
        {CARDS.map(([t, d]) => (<Card key={t} title={t}><p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{d}</p></Card>))}
      </Grid>
      <p className="text-xs mt-6" style={{ color: 'var(--text-tertiary)' }}>数据为公开信息综合整理，具体数值为示意值，仅供分析参考 · 由 china.html「量子」专题迁移</p>
    </div>
  );
}
