import React from 'react';
import { PageHeader, Card, Grid, Stat } from '../../app/ui.jsx';
import EChart from '../../lib/viz/EChart.jsx';

const exchangeBar = {
  grid: { left: 90, right: 24, top: 16, bottom: 24 },
  xAxis: { type: 'value', splitLine: { lineStyle: { color: 'rgba(148,163,184,0.1)' } } },
  yAxis: { type: 'category', data: ['区域/行业平台', '北京国际', '深圳所', '上海所'], axisLine: { lineStyle: { color: '#27324a' } } },
  series: [{ type: 'bar', data: [30, 18, 22, 28], barWidth: 14, itemStyle: { color: '#22d3ee', borderRadius: 3 }, label: { show: true, position: 'right', color: '#93a1b5' } }],
};

const privacyRadar = {
  radar: {
    indicator: [{ name: 'MPC', max: 100 }, { name: '联邦学习', max: 100 }, { name: 'TEE', max: 100 }, { name: '性能', max: 100 }, { name: '合规', max: 100 }],
    axisName: { color: '#93a1b5' }, splitLine: { lineStyle: { color: 'rgba(148,163,184,0.15)' } }, splitArea: { show: false },
  },
  series: [{ type: 'radar', data: [{ value: [85, 90, 80, 70, 88], name: '隐私计算', lineStyle: { color: '#c41e3a' }, areaStyle: { color: 'rgba(196,30,58,0.12)' } }] }],
};

const CARDS = [
  ['数据二十条 · 三权分置', '持有权、使用权、经营权分置，破解数据确权难题。'],
  ['数据资产入表', '数据作为资产计入报表，推动数据要素市场化定价。'],
  ['交易所与流通设施', '上海、深圳、北京国际等数据交易所 + 公共数据授权运营。'],
  ['隐私计算 · 数据喂养大模型', 'MPC / 联邦学习 / TEE 支撑「可用不可见」；东数西算调度算力。'],
];

export default function Page() {
  return (
    <div>
      <PageHeader badge="Data Element" title="数据要素 · 要素市场化" subtitle="数据二十条 · 确权 · 入表 · 东数西算 —— 让数据成为可流通、可定价的生产要素" />
      <Grid cols={4} className="mb-6">
        <Stat value="三权分置" label="持有/使用/经营" accent="#22d3ee" />
        <Stat value="数据入表" label="资产化" accent="#c41e3a" />
        <Stat value="40+ 家" label="数据交易所（示意）" />
        <Stat value="东数西算" label="算力调度" accent="#e8a317" />
      </Grid>
      <Grid cols={2} className="mb-6">
        <Card title="主要数据交易所活跃度（示意）"><EChart option={exchangeBar} style={{ height: 260 }} /></Card>
        <Card title="隐私计算能力（示意）"><EChart option={privacyRadar} style={{ height: 260 }} /></Card>
      </Grid>
      <Grid cols={2}>
        {CARDS.map(([t, d]) => (
          <Card key={t} title={t}><p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{d}</p></Card>
        ))}
      </Grid>
      <p className="text-xs mt-6" style={{ color: 'var(--text-tertiary)' }}>数据为公开信息综合整理，具体数值为示意值，仅供分析参考 · 由 tabs/dataElement.html 迁移而来</p>
    </div>
  );
}
