import React, { useState, useMemo } from 'react';
import { PageHeader, Card, Grid, Stat } from '../../app/ui.jsx';
import EChart from '../../lib/viz/EChart.jsx';
import ChinaMap from '../../lib/viz/ChinaMap.jsx';
import { categoryX, valueY, GRID } from '../shared/chartHelpers.js';
import { IntroCard, SelectorBar, FrameworkTrio, ModuleFooter } from '../shared/ModuleParadigm.jsx';

const GRAIN = [
  { name: '黑龙江省', value: 7700 }, { name: '河南省', value: 6600 }, { name: '山东省', value: 5700 },
  { name: '安徽省', value: 4100 }, { name: '吉林省', value: 4000 }, { name: '内蒙古自治区', value: 3900 },
  { name: '河北省', value: 3800 }, { name: '江苏省', value: 3700 }, { name: '四川省', value: 3500 },
  { name: '湖南省', value: 2900 }, { name: '湖北省', value: 2700 }, { name: '辽宁省', value: 2500 },
  { name: '江西省', value: 2200 },
];

const CROPS = [
  { key: 'staple', label: '口粮', accent: '#10b981', selfRate: 100, import: 2, desc: '稻谷与小麦自给率维持 100% 左右，库存充裕，端牢「中国饭碗」——大安全观第一支柱。' },
  { key: 'soybean', label: '大豆', accent: '#e8a317', selfRate: 15, import: 85, desc: '大豆进口依存约 85%，来源集中于巴西、美国、阿根廷，是饲料粮结构性短板。' },
  { key: 'corn', label: '玉米', accent: '#22d3ee', selfRate: 92, import: 8, desc: '玉米自给率较高但饲用需求增长快，进口补充与生物燃料争粮构成边际压力。' },
];

export default function Page() {
  const [crop, setCrop] = useState('staple');
  const c = CROPS.find((x) => x.key === crop) || CROPS[0];

  const selfSufficiency = useMemo(() => ({
    grid: GRID,
    xAxis: categoryX(['2019', '2020', '2021', '2022', '2023', '2024']),
    yAxis: valueY({ min: 0, max: 105 }),
    series: [{ type: 'line', smooth: true, symbol: 'circle', symbolSize: 6,
      data: crop === 'soybean' ? [16, 15, 14, 15, 15, 15] : crop === 'corn' ? [94, 93, 92, 92, 91, 92] : [99, 100, 101, 100, 101, 100],
      lineStyle: { color: c.accent, width: 2 }, itemStyle: { color: c.accent },
      areaStyle: { color: `${c.accent}18` } }],
  }), [crop, c]);

  const soybeanSource = {
    grid: { left: 70, right: 24, top: 16, bottom: 24 },
    xAxis: valueY({ max: 100 }),
    yAxis: categoryX(['阿根廷', '其他', '美国', '巴西']),
    series: [{ type: 'bar', data: [10, 12, 30, 48], barWidth: 14, itemStyle: { color: c.accent, borderRadius: 3 },
      label: { show: true, position: 'right', formatter: '{c}%', color: '#93a1b5' } }],
  };

  return (
    <div>
      <PageHeader badge="Food Security · 大安全观" title="大国粮仓 · 粮食安全主权" subtitle="藏粮于地 · 藏粮于技 · 耕地红线 · 大食物观" />
      <IntroCard>粮食安全呈现<strong style={{ color: 'var(--text-primary)' }}>「口粮绝对安全、饲料粮结构性依赖」</strong>的双重现实：18 亿亩耕地红线是物理底线，大豆等饲料粮进口依存是地缘风险敞口。</IntroCard>

      <Grid cols={4} className="mb-6">
        <Stat value="18 亿亩" label="耕地红线" accent="#c41e3a" />
        <Stat value={`${c.selfRate}%`} label={`${c.label}自给率 · 切换`} accent={c.accent} />
        <Stat value={`${c.import}%`} label="进口依存（示意）" accent="#e8a317" />
        <Stat value="1.3 亿吨" label="大豆年进口" accent="#22d3ee" />
      </Grid>

      <Card title="交互 · 粮食品类选择器" className="mb-6">
        <SelectorBar items={CROPS} activeKey={crop} onSelect={setCrop} />
        <div className="os-card p-4 mb-4" style={{ background: 'var(--bg-elevated)', borderLeft: `3px solid ${c.accent}` }}>
          <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{c.desc}</p>
        </div>
        <Grid cols={2}>
          <Card title="自给率走势（随品类切换）"><EChart option={selfSufficiency} style={{ height: 240 }} /></Card>
          <Card title="大豆进口来源结构"><EChart option={soybeanSource} style={{ height: 240 }} /></Card>
        </Grid>
      </Card>

      <Card title="粮食主产区产量分布（万吨 · 示意）" className="mb-6">
        <ChinaMap metrics={[{ key: 'grain', label: '粮食产量', valueName: '粮食产量(万吨)', max: 8000, data: GRAIN }]} style={{ height: 460 }} />
      </Card>

      <FrameworkTrio cards={[
        { title: '藏粮于地', subtitle: '18 亿亩红线', body: '永久基本农田与高标准农田建设，把耕地保护从政策口号变成物理约束。', pillars: [['黑土地保护', '东北粮仓。'], ['占补平衡', '质量同等。'], ['非农化禁限', '执法强化。']] },
        { title: '藏粮于技', subtitle: '种业 · 农机', body: '种子是农业芯片；生物育种产业化与智能农机提升单产天花板。', pillars: [['种业振兴', '自主品种。'], ['智慧农业', '精准灌溉。'], ['大食物观', '多元供给。']] },
        { title: '海外粮仓', subtitle: '进口多元化', body: '一带一路农业合作与海外农业投资，分散单一来源地缘风险。', pillars: [['巴西 48%', '最大来源。'], ['RCEP', '区域贸易。'], ['储备调节', '吞吐机制。']] },
      ]} />

      <ModuleFooter moduleId="foodSecurity" sourceNote="由 tabs/foodSecurity.html 迁移升级" />
    </div>
  );
}
