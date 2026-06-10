import React from 'react';
import { PageHeader, Card, Grid, Stat } from '../../app/ui.jsx';
import EChart from '../../lib/viz/EChart.jsx';

const fdiTrend = {
  grid: { left: 44, right: 16, top: 20, bottom: 24 },
  xAxis: { type: 'category', data: ['2013', '2016', '2019', '2022', '2024E'], axisLine: { lineStyle: { color: '#27324a' } } },
  yAxis: { type: 'value', splitLine: { lineStyle: { color: 'rgba(148,163,184,0.1)' } } },
  series: [{ type: 'line', smooth: true, symbol: 'circle', symbolSize: 6, data: [120, 145, 160, 185, 210], lineStyle: { color: '#c41e3a', width: 2 }, itemStyle: { color: '#c41e3a' }, areaStyle: { color: 'rgba(196,30,58,0.1)' } }],
};

const sectorPie = {
  tooltip: { trigger: 'item' },
  legend: { bottom: 0, textStyle: { color: '#93a1b5' } },
  series: [{ type: 'pie', radius: ['40%', '68%'], center: ['50%', '42%'], label: { color: '#93a1b5' }, data: [
    { value: 32, name: '能源', itemStyle: { color: '#c41e3a' } },
    { value: 28, name: '交通基建', itemStyle: { color: '#22d3ee' } },
    { value: 22, name: '产能合作', itemStyle: { color: '#e8a317' } },
    { value: 18, name: '数字丝路 DSR', itemStyle: { color: '#10b981' } },
  ] }],
};

const CARDS = [
  ['五通 · 互联互通', '政策沟通、设施联通、贸易畅通、资金融通、民心相通的系统框架。'],
  ['六廊六路 · 中欧班列', '陆海通道与中欧班列重塑欧亚物流，海外港口织成节点网络。'],
  ['从大基建到小而美', '由大规模基建转向小而美的民生项目，兼顾债务可持续。'],
  ['第三方市场 · 本币结算', '与发达经济体的第三方市场合作 + 本币结算降低通道与汇率风险。'],
];

export default function Page() {
  return (
    <div>
      <PageHeader badge="BRI" title="一带一路 · 互联互通" subtitle="六廊六路 · 中欧班列 · 第三方市场 —— 以地缘物理重塑欧亚通道" />
      <Grid cols={4} className="mb-6">
        <Stat value="150+ 国" label="共建伙伴" accent="#c41e3a" />
        <Stat value="1 万亿$+" label="累计投资（示意）" />
        <Stat value="42 个" label="经济走廊/港口（示意）" accent="#22d3ee" />
        <Stat value="30+ 条" label="中欧班列线路（示意）" accent="#e8a317" />
      </Grid>
      <Grid cols={2} className="mb-6">
        <Card title="沿线直接投资走势（亿$ · 示意）"><EChart option={fdiTrend} style={{ height: 260 }} /></Card>
        <Card title="投资行业分布（示意）"><EChart option={sectorPie} style={{ height: 260 }} /></Card>
      </Grid>
      <Grid cols={2}>
        {CARDS.map(([t, d]) => (
          <Card key={t} title={t}><p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{d}</p></Card>
        ))}
      </Grid>
      <p className="text-xs mt-6" style={{ color: 'var(--text-tertiary)' }}>数据为公开信息综合整理，具体数值为示意值，仅供分析参考 · 由 tabs/bri.html 迁移而来</p>
    </div>
  );
}
