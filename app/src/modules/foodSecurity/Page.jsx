import React from 'react';
import { PageHeader, Card, Grid, Stat } from '../../app/ui.jsx';
import EChart from '../../lib/viz/EChart.jsx';
import ChinaMap from '../../lib/viz/ChinaMap.jsx';

// 粮食主产区产量（万吨 · 示意，量级贴近公开数据）
const GRAIN = [
  { name: '黑龙江省', value: 7700 }, { name: '河南省', value: 6600 }, { name: '山东省', value: 5700 },
  { name: '安徽省', value: 4100 }, { name: '吉林省', value: 4000 }, { name: '内蒙古自治区', value: 3900 },
  { name: '河北省', value: 3800 }, { name: '江苏省', value: 3700 }, { name: '四川省', value: 3500 },
  { name: '湖南省', value: 2900 }, { name: '湖北省', value: 2700 }, { name: '辽宁省', value: 2500 },
  { name: '江西省', value: 2200 },
];

// 口粮自给率走势（%）
const selfSufficiency = {
  grid: { left: 36, right: 16, top: 20, bottom: 24 },
  xAxis: { type: 'category', data: ['2019', '2020', '2021', '2022', '2023', '2024'], axisLine: { lineStyle: { color: '#27324a' } } },
  yAxis: { type: 'value', min: 90, max: 105, axisLabel: { formatter: '{value}' }, splitLine: { lineStyle: { color: 'rgba(148,163,184,0.1)' } } },
  series: [{
    type: 'line', smooth: true, symbol: 'circle', symbolSize: 6,
    data: [99, 100, 101, 100, 101, 100],
    lineStyle: { color: '#10b981', width: 2 }, itemStyle: { color: '#10b981' },
    areaStyle: { color: 'rgba(16,185,129,0.1)' },
  }],
};

// 大豆进口来源结构（%，示意）
const soybeanSource = {
  grid: { left: 70, right: 24, top: 16, bottom: 24 },
  xAxis: { type: 'value', max: 100, splitLine: { lineStyle: { color: 'rgba(148,163,184,0.1)' } } },
  yAxis: { type: 'category', data: ['阿根廷', '其他', '美国', '巴西'], axisLine: { lineStyle: { color: '#27324a' } } },
  series: [{
    type: 'bar', data: [10, 12, 30, 48], barWidth: 14,
    itemStyle: { color: '#e8a317', borderRadius: 3 },
    label: { show: true, position: 'right', formatter: '{c}%', color: '#93a1b5' },
  }],
};

export default function Page() {
  return (
    <div>
      <PageHeader
        badge="迁移样板 · Food Security"
        title="大国粮仓 · 粮食安全主权"
        subtitle="藏粮于地 · 藏粮于技 · 耕地红线 · 大食物观 —— 主粮自主与饲料粮对外依赖的双重现实"
      />
      <Grid cols={4} className="mb-6">
        <Stat value="18 亿亩" label="耕地红线" />
        <Stat value="100%+" label="口粮自给率" accent="#10b981" />
        <Stat value="~85%" label="大豆进口依存" accent="#e8a317" />
        <Stat value="1.3 亿吨" label="大豆年进口" />
      </Grid>

      <Card title="粮食主产区产量分布（万吨 · 示意 · 点省下钻）" className="mb-6">
        <ChinaMap
          metrics={[{ key: 'grain', label: '粮食产量', valueName: '粮食产量(万吨)', max: 8000, data: GRAIN }]}
          style={{ height: 460 }}
        />
      </Card>

      <Grid cols={2} className="mb-6">
        <Card title="口粮自给率走势（%）">
          <EChart option={selfSufficiency} style={{ height: 260 }} />
        </Card>
        <Card title="大豆进口来源结构（示意）">
          <EChart option={soybeanSource} style={{ height: 260 }} />
        </Card>
      </Grid>

      <Grid cols={2}>
        <Card title="饲料粮 · 结构性短板">
          <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
            大豆进口依存约 85%，来源集中于巴西、美国、阿根廷，易受国际市场与地缘波动传导。
          </p>
        </Card>
        <Card title="口粮 · 绝对安全">
          <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
            稻谷与小麦自给率维持 100% 左右，库存充裕，端牢「中国饭碗」。
          </p>
        </Card>
      </Grid>

      <p className="text-xs mt-6" style={{ color: 'var(--text-tertiary)' }}>
        数据为公开信息综合整理，具体数值为示意值，仅供分析参考 · 由 tabs/foodSecurity.html 迁移而来
      </p>
    </div>
  );
}
