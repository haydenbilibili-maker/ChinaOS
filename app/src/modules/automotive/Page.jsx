import React from 'react';
import { PageHeader, Card, Grid, Stat } from '../../app/ui.jsx';
import EChart from '../../lib/viz/EChart.jsx';

const powertrainTrend = {
  grid: { left: 40, right: 16, top: 20, bottom: 24 },
  xAxis: { type: 'category', data: ['2019', '2020', '2021', '2022', '2023', '2024'], axisLine: { lineStyle: { color: '#27324a' } } },
  yAxis: { type: 'value', axisLabel: { formatter: '{value}%' }, splitLine: { lineStyle: { color: 'rgba(148,163,184,0.1)' } } },
  series: [{ type: 'line', smooth: true, symbol: 'circle', symbolSize: 6, data: [5, 6, 14, 26, 36, 48], lineStyle: { color: '#22d3ee', width: 2 }, itemStyle: { color: '#22d3ee' }, areaStyle: { color: 'rgba(34,211,238,0.1)' } }],
};

const sdvRadar = {
  radar: {
    indicator: [{ name: '智能驾驶', max: 100 }, { name: '三电', max: 100 }, { name: '智舱', max: 100 }, { name: '电子电气架构', max: 100 }, { name: '车规芯片', max: 100 }, { name: '补能网络', max: 100 }],
    axisName: { color: '#93a1b5' }, splitLine: { lineStyle: { color: 'rgba(148,163,184,0.15)' } }, splitArea: { show: false },
  },
  series: [{ type: 'radar', data: [{ value: [82, 95, 88, 80, 65, 85], name: '中国新能源', lineStyle: { color: '#c41e3a' }, areaStyle: { color: 'rgba(196,30,58,0.12)' } }] }],
};

const CARDS = [
  ['SDV · 软件定义汽车', '城区 NOA 智能驾驶、智能座舱与集中式电子电气架构成为主战场。'],
  ['三电本土化', '电池、电机、电控高度自主；SiC 等器件加速国产替代。'],
  ['换道超车', '以电动化绕开发动机壁垒，新能源渗透率快速抬升、整车出口跃居全球前列。'],
  ['出海升级', '从整车出口走向本地建厂，应对关税壁垒与本地化要求。'],
];

export default function Page() {
  return (
    <div>
      <PageHeader badge="Automotive" title="汽车主权 · 新能源换道超车" subtitle="电动化 · 智能化 · 三电 · 出海 —— 以电动化绕开燃油车壁垒，重构产业链位势" />
      <Grid cols={4} className="mb-6">
        <Stat value="全球 #1" label="新能源销量" accent="#c41e3a" />
        <Stat value="~48%" label="新能源渗透率" accent="#22d3ee" />
        <Stat value="L3" label="智驾演进" />
        <Stat value="1000+ TOPS" label="自研算力" accent="#e8a317" />
      </Grid>
      <Grid cols={2} className="mb-6">
        <Card title="新能源渗透率走势（%）"><EChart option={powertrainTrend} style={{ height: 260 }} /></Card>
        <Card title="SDV 能力矩阵（示意）"><EChart option={sdvRadar} style={{ height: 260 }} /></Card>
      </Grid>
      <Grid cols={2}>
        {CARDS.map(([t, d]) => (
          <Card key={t} title={t}><p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{d}</p></Card>
        ))}
      </Grid>
      <p className="text-xs mt-6" style={{ color: 'var(--text-tertiary)' }}>数据为公开信息综合整理，具体数值为示意值，仅供分析参考 · 由 tabs/automotive.html 迁移而来</p>
    </div>
  );
}
