import React from 'react';
import { PageHeader, Card, Grid, Stat } from '../../app/ui.jsx';
import EChart from '../../lib/viz/EChart.jsx';

const tradeTrend = {
  grid: { left: 48, right: 16, top: 20, bottom: 24 },
  xAxis: { type: 'category', data: ['2015', '2017', '2019', '2021', '2023', '2024'], axisLine: { lineStyle: { color: '#27324a' } } },
  yAxis: { type: 'value', splitLine: { lineStyle: { color: 'rgba(148,163,184,0.1)' } } },
  series: [{ type: 'line', smooth: true, symbol: 'none', data: [24.6, 27.8, 31.5, 39.1, 41.8, 43.9], lineStyle: { color: '#22d3ee', width: 2 }, areaStyle: { color: 'rgba(34,211,238,0.1)' } }],
};

const partnerBar = {
  grid: { left: 70, right: 24, top: 16, bottom: 24 },
  xAxis: { type: 'value', splitLine: { lineStyle: { color: 'rgba(148,163,184,0.1)' } } },
  yAxis: { type: 'category', data: ['日韩', '美国', '欧盟', '东盟'], axisLine: { lineStyle: { color: '#27324a' } } },
  series: [{ type: 'bar', data: [12, 11, 13, 15.5], barWidth: 14, itemStyle: { color: '#e8a317', borderRadius: 3 }, label: { show: true, position: 'right', formatter: '{c}%', color: '#93a1b5' } }],
};

const CARDS = [
  ['新三样 · 出口新动能', '电动汽车、锂电池、光伏产品成为出口增长的新引擎。'],
  ['东盟登顶 · RCEP', '东盟成为第一大贸易伙伴，RCEP 深化区域产业链一体化。'],
  ['跨境电商 · 海外仓', 'Temu / Shein / TikTok Shop 等带动外贸新业态与海外仓网络。'],
  ['供应链韧性', '一般贸易占比提升、伙伴多元化，对冲关税战与脱钩风险。'],
];

export default function Page() {
  return (
    <div>
      <PageHeader badge="Foreign Trade" title="对外贸易 · 结构升级与韧性" subtitle="新三样 · 跨境电商 · RCEP · 多元化 —— 出口结构升级与供应链韧性重构" />
      <Grid cols={4} className="mb-6">
        <Stat value="~42 万亿" label="货物贸易（元）" accent="#22d3ee" />
        <Stat value="#1" label="东盟为第一大伙伴" accent="#e8a317" />
        <Stat value="60 万家+" label="跨境电商主体（示意）" />
        <Stat value="2,500+ 个" label="海外仓（示意）" accent="#c41e3a" />
      </Grid>
      <Grid cols={2} className="mb-6">
        <Card title="货物贸易进出口走势（万亿 · 示意）"><EChart option={tradeTrend} style={{ height: 260 }} /></Card>
        <Card title="主要贸易伙伴占比（示意）"><EChart option={partnerBar} style={{ height: 260 }} /></Card>
      </Grid>
      <Grid cols={2}>
        {CARDS.map(([t, d]) => (
          <Card key={t} title={t}><p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{d}</p></Card>
        ))}
      </Grid>
      <p className="text-xs mt-6" style={{ color: 'var(--text-tertiary)' }}>数据为公开信息综合整理，具体数值为示意值，仅供分析参考 · 由 tabs/foreignTrade.html 迁移而来</p>
    </div>
  );
}
