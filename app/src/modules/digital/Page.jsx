import React from 'react';
import { PageHeader, Card, Grid, Stat } from '../../app/ui.jsx';
import EChart from '../../lib/viz/EChart.jsx';

const scaleTrend = {
  grid: { left: 44, right: 16, top: 20, bottom: 24 },
  xAxis: { type: 'category', data: ['2019', '2020', '2021', '2022', '2023', '2024'], axisLine: { lineStyle: { color: '#27324a' } } },
  yAxis: { type: 'value', splitLine: { lineStyle: { color: 'rgba(148,163,184,0.1)' } } },
  series: [{ type: 'line', smooth: true, symbol: 'none', data: [35.8, 39.2, 45.5, 50.2, 53.9, 57.5], lineStyle: { color: '#22d3ee', width: 2 }, areaStyle: { color: 'rgba(34,211,238,0.1)' } }],
};

const govRadar = {
  radar: {
    indicator: [{ name: '反垄断', max: 100 }, { name: '数据安全', max: 100 }, { name: '算法监管', max: 100 }, { name: '金融合规', max: 100 }, { name: '用工保障', max: 100 }],
    axisName: { color: '#93a1b5' }, splitLine: { lineStyle: { color: 'rgba(148,163,184,0.15)' } }, splitArea: { show: false },
  },
  series: [{ type: 'radar', data: [{ value: [95, 80, 85, 90, 75], name: '平台常态化监管', lineStyle: { color: '#c41e3a' }, areaStyle: { color: 'rgba(196,30,58,0.12)' } }] }],
};

const CARDS = [
  ['数实融合', '数字经济与实体经济深度融合，数字产业化 + 产业数字化双轮驱动。'],
  ['平台经济常态化监管', '从无序扩张转向反垄断、数据安全与算法监管的常态化。'],
  ['四大赛道', '电子商务、移动支付、云计算、行业 AI 构成数字产业化支柱。'],
  ['算力底座 · 数据要素x', '智算中心与东数西算支撑算力，数据要素 x 释放乘数效应。'],
];

export default function Page() {
  return (
    <div>
      <PageHeader badge="Digital Economy" title="数字经济 · 数实融合" subtitle="平台经济 · 智算 · 东数西算 —— 数字产业化与产业数字化双轮驱动" />
      <Grid cols={4} className="mb-6">
        <Stat value="53.9 T" label="数字经济规模（元）" accent="#22d3ee" />
        <Stat value="41.5%" label="占 GDP 比重" accent="#c41e3a" />
        <Stat value="10.9 亿" label="网民规模" />
        <Stat value="18.2%" label="核心产业增加值占比" accent="#e8a317" />
      </Grid>
      <Grid cols={2} className="mb-6">
        <Card title="数字经济规模占 GDP（% · 示意）"><EChart option={scaleTrend} style={{ height: 260 }} /></Card>
        <Card title="平台经济监管维度（示意）"><EChart option={govRadar} style={{ height: 260 }} /></Card>
      </Grid>
      <Grid cols={2}>
        {CARDS.map(([t, d]) => (
          <Card key={t} title={t}><p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{d}</p></Card>
        ))}
      </Grid>
      <p className="text-xs mt-6" style={{ color: 'var(--text-tertiary)' }}>数据为公开信息综合整理，具体数值为示意值，仅供分析参考 · 由 tabs/digital.html 迁移而来</p>
    </div>
  );
}
