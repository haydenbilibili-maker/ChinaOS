import React from 'react';
import { PageHeader, Card, Grid, Stat } from '../../app/ui.jsx';
import EChart from '../../lib/viz/EChart.jsx';

const computeTrend = {
  grid: { left: 48, right: 16, top: 20, bottom: 24 },
  xAxis: { type: 'category', data: ['2021', '2022', '2023', '2024', '2025E'], axisLine: { lineStyle: { color: '#27324a' } } },
  yAxis: { type: 'value', name: 'EFLOPS', nameTextStyle: { color: '#5b6a82' }, splitLine: { lineStyle: { color: 'rgba(148,163,184,0.1)' } } },
  series: [{ type: 'bar', data: [100, 150, 197, 230, 300], barWidth: 28, itemStyle: { color: '#22d3ee', borderRadius: [3, 3, 0, 0] } }],
};

const penetrationRadar = {
  radar: {
    indicator: [{ name: '制造', max: 100 }, { name: '医疗', max: 100 }, { name: '金融', max: 100 }, { name: '政务', max: 100 }, { name: '教育', max: 100 }, { name: '交通', max: 100 }],
    axisName: { color: '#93a1b5' }, splitLine: { lineStyle: { color: 'rgba(148,163,184,0.15)' } }, splitArea: { show: false },
  },
  series: [{ type: 'radar', data: [{ value: [80, 70, 85, 75, 65, 72], name: 'AI+ 渗透', lineStyle: { color: '#c41e3a' }, areaStyle: { color: 'rgba(196,30,58,0.12)' } }] }],
};

const CARDS = [
  ['政策三链', '以「人工智能+」串起算力、模型与行业落地三条产业链。'],
  ['通用与垂直 · 开源与闭源', '通用大模型与行业垂直模型并行；开源与闭源生态分层竞争。'],
  ['智算中心 · 东数西算', '智算中心与东数西算支撑算力底座，破解能效与布局约束。'],
  ['生成式 AI 治理', '备案制 + 内容安全与算法监管，平衡创新与风险。'],
];

export default function Page() {
  return (
    <div>
      <PageHeader badge="AI+" title="人工智能+ 行动" subtitle="智算中心 · 东数西算 · 行业大模型 —— 以算力底座与行业落地驱动新质生产力" />
      <Grid cols={4} className="mb-6">
        <Stat value="4,500+" label="AI 企业（示意）" accent="#c41e3a" />
        <Stat value="190+" label="备案大模型" accent="#22d3ee" />
        <Stat value="~30%" label="核心产业增速" accent="#10b981" />
        <Stat value="230+ E" label="智能算力 FLOPS" accent="#e8a317" />
      </Grid>
      <Grid cols={2} className="mb-6">
        <Card title="智能算力规模走势（EFLOPS · 示意）"><EChart option={computeTrend} style={{ height: 260 }} /></Card>
        <Card title="AI+ 行业渗透（示意）"><EChart option={penetrationRadar} style={{ height: 260 }} /></Card>
      </Grid>
      <Grid cols={2}>
        {CARDS.map(([t, d]) => (<Card key={t} title={t}><p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{d}</p></Card>))}
      </Grid>
      <p className="text-xs mt-6" style={{ color: 'var(--text-tertiary)' }}>数据为公开信息综合整理，具体数值为示意值，仅供分析参考 · 由 china.html「AI+」专题迁移</p>
    </div>
  );
}
