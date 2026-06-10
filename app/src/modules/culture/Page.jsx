import React from 'react';
import { PageHeader, Card, Grid, Stat } from '../../app/ui.jsx';
import EChart from '../../lib/viz/EChart.jsx';

const trackBar = {
  grid: { left: 70, right: 24, top: 16, bottom: 24 },
  xAxis: { type: 'value', splitLine: { lineStyle: { color: 'rgba(148,163,184,0.1)' } } },
  yAxis: { type: 'category', data: ['网文', '游戏', '短视频/TikTok', '微短剧'], axisLine: { lineStyle: { color: '#27324a' } } },
  series: [{ type: 'bar', data: [40, 100, 160, 75], barWidth: 14, itemStyle: { color: '#c41e3a', borderRadius: 3 }, label: { show: true, position: 'right', formatter: '{c}', color: '#93a1b5' } }],
};

const overseasTrend = {
  grid: { left: 44, right: 16, top: 20, bottom: 24 },
  xAxis: { type: 'category', data: ['2020', '2021', '2022', '2023', '2024', '2025E'], axisLine: { lineStyle: { color: '#27324a' } } },
  yAxis: { type: 'value', splitLine: { lineStyle: { color: 'rgba(148,163,184,0.1)' } } },
  series: [{ type: 'line', smooth: true, symbol: 'none', data: [30, 55, 90, 140, 200, 280], lineStyle: { color: '#e8a317', width: 2 }, areaStyle: { color: 'rgba(232,163,23,0.1)' } }],
};

const CARDS = [
  ['微短剧出海 · Short Drama', '工业化的内容生产 + 算法分发，微短剧成为出海增速最快的赛道之一。'],
  ['短视频全球化 · TikTok', '以 TikTok 为代表的短视频重塑全球内容分发与 Z 世代消费。'],
  ['国潮与文创 IP', '依托传统文化资源，国潮文创 IP 崛起，带动衍生消费与 AIGC 内容工业化。'],
  ['从内容出海到生态出海', '2030 视角：从单点内容走向平台、工具与标准的生态级出海。'],
];

export default function Page() {
  return (
    <div>
      <PageHeader badge="Culture" title="文化产业 · 数字软实力" subtitle="国潮 · 短剧出海 · TikTok · Z 世代 —— 内容工业化与文化折扣的穿透" />
      <Grid cols={4} className="mb-6">
        <Stat value="1,600 亿$" label="文化贸易（示意）" accent="#e8a317" />
        <Stat value="16,000 部" label="微短剧年产（示意）" accent="#c41e3a" />
        <Stat value="10 亿+" label="海外用户（示意）" accent="#22d3ee" />
        <Stat value="#1" label="短视频出海" />
      </Grid>
      <Grid cols={2} className="mb-6">
        <Card title="内容出海四赛道热度（示意）"><EChart option={trackBar} style={{ height: 260 }} /></Card>
        <Card title="文化出海规模走势（示意）"><EChart option={overseasTrend} style={{ height: 260 }} /></Card>
      </Grid>
      <Grid cols={2}>
        {CARDS.map(([t, d]) => (
          <Card key={t} title={t}><p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{d}</p></Card>
        ))}
      </Grid>
      <p className="text-xs mt-6" style={{ color: 'var(--text-tertiary)' }}>数据为公开信息综合整理，具体数值为示意值，仅供分析参考 · 由 tabs/culture.html 迁移而来</p>
    </div>
  );
}
