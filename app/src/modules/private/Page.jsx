import React from 'react';
import { PageHeader, Card, Grid, Stat } from '../../app/ui.jsx';
import EChart from '../../lib/viz/EChart.jsx';

const contribBar = {
  grid: { left: 90, right: 24, top: 16, bottom: 24 },
  xAxis: { type: 'value', max: 100, splitLine: { lineStyle: { color: 'rgba(148,163,184,0.1)' } } },
  yAxis: { type: 'category', data: ['企业数量', '城镇就业', '技术创新', 'GDP', '税收'], axisLine: { lineStyle: { color: '#27324a' } } },
  series: [{ type: 'bar', data: [90, 80, 70, 60, 50], barWidth: 15, itemStyle: { color: '#c41e3a', borderRadius: 3 }, label: { show: true, position: 'right', formatter: '{c}%+', color: '#93a1b5' } }],
};

const confidenceTrend = {
  grid: { left: 40, right: 16, top: 20, bottom: 24 },
  xAxis: { type: 'category', data: ['2021', '2022', '2023', '2024', '2025E'], axisLine: { lineStyle: { color: '#27324a' } } },
  yAxis: { type: 'value', splitLine: { lineStyle: { color: 'rgba(148,163,184,0.1)' } } },
  series: [{ type: 'line', smooth: true, symbol: 'circle', symbolSize: 6, data: [52, 46, 50, 55, 60], lineStyle: { color: '#10b981', width: 2 }, itemStyle: { color: '#10b981' }, areaStyle: { color: 'rgba(16,185,129,0.1)' } }],
};

const CARDS = [
  ['民营经济促进法', '以立法稳定预期、明确平等地位与产权保护的制度托底。'],
  ['公平竞争 · 市场准入', '破除隐性壁垒，推动要素获取、准入许可、招投标的公平。'],
  ['账款拖欠治理', '清理拖欠民营企业账款，改善现金流与营商环境。'],
  ['专精特新 · 技术策源地', '从就业蓄水池升级为技术创新策源地，培育专精特新群体。'],
];

export default function Page() {
  return (
    <div>
      <PageHeader badge="Private Economy" title="民营经济 · 信心与公平竞争" subtitle="民营经济促进法 · 56789 · 产权保护 —— 以制度稳预期、提信心" />
      <Grid cols={4} className="mb-6">
        <Stat value="50%+" label="税收贡献" accent="#c41e3a" />
        <Stat value="60%+" label="GDP 贡献" />
        <Stat value="70%+" label="技术创新" accent="#22d3ee" />
        <Stat value="80/90%+" label="就业 / 企业数量" accent="#e8a317" />
      </Grid>
      <Grid cols={2} className="mb-6">
        <Card title="民营经济「56789」贡献（示意）"><EChart option={contribBar} style={{ height: 260 }} /></Card>
        <Card title="民营信心/预期指数（示意）"><EChart option={confidenceTrend} style={{ height: 260 }} /></Card>
      </Grid>
      <Grid cols={2}>
        {CARDS.map(([t, d]) => (
          <Card key={t} title={t}><p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{d}</p></Card>
        ))}
      </Grid>
      <p className="text-xs mt-6" style={{ color: 'var(--text-tertiary)' }}>数据为公开信息综合整理，具体数值为示意值，仅供分析参考 · 由 tabs/private.html 迁移而来</p>
    </div>
  );
}
