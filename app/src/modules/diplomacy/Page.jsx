import React from 'react';
import { PageHeader, Card, Grid, Stat } from '../../app/ui.jsx';
import EChart from '../../lib/viz/EChart.jsx';

// 中美综合实力对比（示意值，多维雷达）
const sinoUsRadar = {
  legend: { data: ['中国', '美国'], textStyle: { color: '#93a1b5' }, top: 0 },
  radar: {
    indicator: [
      { name: '经济体量', max: 100 }, { name: '科技前沿', max: 100 },
      { name: '军事投送', max: 100 }, { name: '金融主导', max: 100 },
      { name: '制造产能', max: 100 }, { name: '盟友体系', max: 100 },
    ],
    axisName: { color: '#93a1b5' },
    splitLine: { lineStyle: { color: 'rgba(148,163,184,0.15)' } },
    splitArea: { show: false },
  },
  series: [{
    type: 'radar',
    data: [
      { value: [88, 78, 70, 45, 98, 55], name: '中国', lineStyle: { color: '#c41e3a' }, areaStyle: { color: 'rgba(196,30,58,0.12)' } },
      { value: [100, 95, 98, 95, 60, 92], name: '美国', lineStyle: { color: '#22d3ee' }, areaStyle: { color: 'rgba(34,211,238,0.1)' } },
    ],
  }],
};

// 关键能源航道对外依存（示意）
const chokepointBar = {
  grid: { left: 80, right: 24, top: 16, bottom: 24 },
  xAxis: { type: 'value', max: 100, splitLine: { lineStyle: { color: 'rgba(148,163,184,0.1)' } } },
  yAxis: { type: 'category', data: ['霍尔木兹海峡', '马六甲海峡', '曼德海峡', '苏伊士运河'], axisLine: { lineStyle: { color: '#27324a' } } },
  series: [{
    type: 'bar', data: [42, 80, 18, 12], barWidth: 14,
    itemStyle: { color: '#e8a317', borderRadius: 3 },
    label: { show: true, position: 'right', formatter: '{c}%', color: '#93a1b5' },
  }],
};

const ARENAS = [
  { t: '中美博弈', d: '科技脱钩、关税、金融与规则之争；长期战略相持。' },
  { t: '重点区域', d: '中东、东北亚、东南亚、一带一路沿线的地缘支点。' },
  { t: '能源航道', d: '石油航道与燃气管道：马六甲困局与陆上替代布局。' },
];

export default function Page() {
  return (
    <div>
      <PageHeader
        badge="Geopolitical Game"
        title="外交博弈 · 大国地缘"
        subtitle="中美博弈 · 重点区域 · 石油航道与燃气管道 —— 以现实主义计算相对实力与成本收益"
      />
      <Grid cols={3} className="mb-6">
        {ARENAS.map((a) => (
          <Card key={a.t} title={a.t}>
            <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{a.d}</p>
          </Card>
        ))}
      </Grid>
      <Grid cols={4} className="mb-6">
        <Stat value="≈42%" label="原油海运经马六甲" accent="#e8a317" />
        <Stat value="2 大" label="陆上管道替代" />
        <Stat value="多极" label="全球南方接口" accent="#22d3ee" />
        <Stat value="相持" label="中美态势" accent="#c41e3a" />
      </Grid>
      <Grid cols={2}>
        <Card title="中美综合实力对比（示意）">
          <EChart option={sinoUsRadar} style={{ height: 300 }} />
        </Card>
        <Card title="关键航道对外依存（示意）">
          <EChart option={chokepointBar} style={{ height: 300 }} />
        </Card>
      </Grid>
    </div>
  );
}
