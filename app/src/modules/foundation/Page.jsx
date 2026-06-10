import React from 'react';
import { PageHeader, Card, Grid, Stat } from '../../app/ui.jsx';
import EChart from '../../lib/viz/EChart.jsx';

// GDP 增长示意（来源占位，后续接 DataBus.worldBank）
const gdpDemo = {
  grid: { left: 36, right: 16, top: 20, bottom: 24 },
  xAxis: { type: 'category', data: ['2019', '2020', '2021', '2022', '2023', '2024'], axisLine: { lineStyle: { color: '#27324a' } } },
  yAxis: { type: 'value', axisLabel: { formatter: '{value}%' }, splitLine: { lineStyle: { color: 'rgba(148,163,184,0.1)' } } },
  series: [{
    type: 'bar', data: [6.0, 2.2, 8.4, 3.0, 5.2, 5.0], barWidth: 22,
    itemStyle: { color: '#c41e3a', borderRadius: [3, 3, 0, 0] },
  }],
};

export default function Page() {
  return (
    <div>
      <PageHeader
        badge="Foundation"
        title="数据与系统底座"
        subtitle="世行 · 国家统计局 · IMF · 本地库 —— 统一经 DataBus 接入；可视化引擎统一渲染"
      />
      <Grid cols={4} className="mb-6">
        <Stat value="1513" label="世行指标" accent="#22d3ee" />
        <Stat value="3 源" label="WB · NBS · IMF" />
        <Stat value="1960–2024" label="年份覆盖" />
        <Stat value="ECharts" label="可视化引擎" accent="#c41e3a" />
      </Grid>
      <Card title="GDP 增长率（示意 · 后续接 DataBus）">
        <EChart option={gdpDemo} style={{ height: 260 }} />
      </Card>
    </div>
  );
}
