import React from 'react';
import { PageHeader, Card, Grid, Stat } from '../../app/ui.jsx';
import EChart from '../../lib/viz/EChart.jsx';
import ChinaMap from '../../lib/viz/ChinaMap.jsx';

// 各省常住人口城镇化率（% · 示意，沿海高内陆低）
const URBANIZATION = [
  { name: '上海市', value: 88 }, { name: '北京市', value: 88 }, { name: '天津市', value: 85 },
  { name: '广东省', value: 75 }, { name: '江苏省', value: 74 }, { name: '浙江省', value: 73 },
  { name: '辽宁省', value: 73 }, { name: '黑龙江省', value: 67 }, { name: '福建省', value: 70 },
  { name: '重庆市', value: 71 }, { name: '内蒙古自治区', value: 68 }, { name: '山东省', value: 65 },
  { name: '湖北省', value: 65 }, { name: '陕西省', value: 64 }, { name: '山西省', value: 64 },
  { name: '河北省', value: 62 }, { name: '江西省', value: 62 }, { name: '安徽省', value: 61 },
  { name: '湖南省', value: 60 }, { name: '四川省', value: 59 }, { name: '河南省', value: 57 },
  { name: '广西壮族自治区', value: 56 }, { name: '贵州省', value: 55 }, { name: '甘肃省', value: 54 },
  { name: '云南省', value: 53 }, { name: '新疆维吾尔自治区', value: 58 }, { name: '西藏自治区', value: 38 },
];

const clusterBar = {
  grid: { left: 80, right: 24, top: 16, bottom: 24 },
  xAxis: { type: 'value', splitLine: { lineStyle: { color: 'rgba(148,163,184,0.1)' } } },
  yAxis: { type: 'category', data: ['成渝', '京津冀', '粤港澳', '长三角'], axisLine: { lineStyle: { color: '#27324a' } } },
  series: [{ type: 'bar', data: [9, 11, 13, 17], barWidth: 15, itemStyle: { color: '#22d3ee', borderRadius: 3 }, label: { show: true, position: 'right', formatter: '{c}%GDP', color: '#93a1b5' } }],
};

const CARDS = [
  ['以人为核心', '从土地城镇化转向以人为核心，公共服务向常住人口覆盖。'],
  ['农业转移人口市民化', '推进户籍制度改革，缩小常住与户籍城镇化率的落差。'],
  ['城市群与都市圈', '长三角、粤港澳、京津冀、成渝四极承载主要增量。'],
  ['从增量扩张到存量更新', '县域城镇化 + 城市更新，进入存量提质阶段。'],
];

export default function Page() {
  return (
    <div>
      <PageHeader badge="New Urbanization" title="以人为核心的新型城镇化" subtitle="市民化 · 户籍 · 城市群 · 县域 —— 从土地城镇化转向以人为核心" />
      <Grid cols={4} className="mb-6">
        <Stat value="66.16%" label="常住人口城镇化率" accent="#22d3ee" />
        <Stat value="19 城" label="超大特大城市" />
        <Stat value="~80%" label="目标城镇化率" accent="#10b981" />
        <Stat value="4 极" label="主要城市群" accent="#c41e3a" />
      </Grid>
      <Card title="各省常住人口城镇化率（% · 示意）" className="mb-6">
        <ChinaMap data={URBANIZATION} valueName="城镇化率(%)" max={90} style={{ height: 440 }} />
      </Card>
      <Grid cols={2} className="mb-6">
        <Card title="四大城市群经济权重（示意）"><EChart option={clusterBar} style={{ height: 240 }} /></Card>
        <Card title="格局要点">
          <div className="space-y-3 text-sm" style={{ color: 'var(--text-secondary)' }}>
            {CARDS.slice(0, 2).map(([t, d]) => (<div key={t}><span style={{ color: 'var(--text-primary)' }}>{t}</span> — {d}</div>))}
          </div>
        </Card>
      </Grid>
      <Grid cols={2}>
        {CARDS.slice(2).map(([t, d]) => (
          <Card key={t} title={t}><p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{d}</p></Card>
        ))}
      </Grid>
      <p className="text-xs mt-6" style={{ color: 'var(--text-tertiary)' }}>数据为公开信息综合整理，具体数值为示意值，仅供分析参考 · 由 tabs/urban.html 迁移而来</p>
    </div>
  );
}
