import React, { useState } from 'react';
import { PageHeader, Card, Grid, Stat } from '../../app/ui.jsx';
import EChart from '../../lib/viz/EChart.jsx';
import { categoryX, valueY, GRID, radarOpt } from '../shared/chartHelpers.js';
import { IntroCard, SelectorBar, FrameworkTrio, ModuleFooter } from '../shared/ModuleParadigm.jsx';

const LAYERS = [
  { key: 'grid', label: '网格穿透', accent: '#c41e3a', score: 96, desc: '数百万微观网格实现对社会毛细血管的实时感应。网格员采集人地物情事，是物理世界的数字化映射。' },
  { key: 'digital', label: '数字政府', accent: '#22d3ee', score: 88, desc: '一网通办 + 一网统管打破部门墙。AI 审核代替人工，40%+ 高频事项零人工干预自动办结。' },
  { key: 'brain', label: '城市大脑', accent: '#e8a317', score: 85, desc: '集成交通、城管、环保多源数据，24 小时全息感知城市运行体征——赛博反馈闭环。' },
];

const effTrend = {
  grid: GRID,
  xAxis: categoryX(['2015', '2018', '2021', '2024']),
  yAxis: valueY({ name: '天', nameTextStyle: { color: '#5b6a82' } }),
  series: [{ type: 'line', smooth: true, symbol: 'circle', symbolSize: 6, data: [18, 9, 4, 1.5], lineStyle: { color: '#22d3ee', width: 2 }, areaStyle: { color: 'rgba(34,211,238,0.1)' } }],
};

const actorTrend = {
  legend: { data: ['1990', '2024'], textStyle: { color: '#93a1b5' }, top: 0 },
  grid: { left: 60, right: 16, top: 30, bottom: 24 },
  xAxis: valueY({ max: 100 }),
  yAxis: categoryX(['社会组织', '市场/平台', '基层自治', '科层行政']),
  series: [
    { name: '1990', type: 'bar', data: [5, 10, 15, 70], barWidth: 9, itemStyle: { color: '#27324a' } },
    { name: '2024', type: 'bar', data: [15, 25, 25, 35], barWidth: 9, itemStyle: { color: '#22d3ee' } },
  ],
};

export default function Page() {
  const [layerKey, setLayerKey] = useState('grid');
  const layer = LAYERS.find((l) => l.key === layerKey) || LAYERS[0];
  const govRadar = radarOpt(['危机响应', '民意感知', '执行穿透', '资源调配', '风险预判', '协同赋能'], [96, 88, 92, 90, 85, 80], { name: '治理竞争力', color: layer.accent });

  return (
    <div>
      <PageHeader badge="National Governance" title="国家治理现代化与赛博协同" subtitle="治理逻辑 · 网格体系 · 数字政府 · 效能评估 —— 治理作为一种「熵减算法」" />
      <IntroCard>面对 14 亿人口的超大规模社会，治理现代化的本质是<strong style={{ color: 'var(--text-primary)' }}>熵减过程</strong>。体制通过数字化把社会运作转化为可监测的数据流，实现中枢意志在微观层面的低摩擦穿透——这不是简单自动化，而是权力的重新编程。</IntroCard>

      <Grid cols={4} className="mb-6">
        <Stat value="扁平化" label="压缩指挥层级" accent="#c41e3a" />
        <Stat value="全天候" label="实时赛博反馈" accent="#22d3ee" />
        <Stat value={`${layer.score}`} label={`${layer.label}指数 · 切换`} accent={layer.accent} />
        <Stat value="预判式" label="风险前置拆弹" accent="#10b981" />
      </Grid>

      <Card title="交互 · 治理三层切换 · 雷达联动" className="mb-6">
        <SelectorBar items={LAYERS} activeKey={layerKey} onSelect={setLayerKey} />
        <Grid cols={2}>
          <div className="os-card p-4" style={{ background: 'var(--bg-elevated)', borderLeft: `3px solid ${layer.accent}` }}>
            <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{layer.desc}</p>
          </div>
          <EChart option={govRadar} style={{ height: 220 }} />
        </Grid>
      </Card>

      <Grid cols={2} className="mb-6">
        <Card title="政务事项办理时效演进（天 · 示意）"><EChart option={effTrend} style={{ height: 240 }} /></Card>
        <Card title="治理参与主体权重演变"><EChart option={actorTrend} style={{ height: 240 }} /></Card>
      </Grid>

      <FrameworkTrio cards={[
        { title: '熵减算法', subtitle: '网格 · 数据流', body: '穿透式网格把国土划分为数百万微观单元，实现发现-上报-派单-处置-反馈闭环。官僚反应速度由天级缩短至小时级。', pillars: [['枫桥 2.0', '矛盾不上交。'], ['闭环处置', '算法化自动流转。'], ['100% 覆盖', '物理空间数字化切片。']] },
        { title: '摸石头 · 数字法治', subtitle: '规则数据化', body: '算法部分替代自由裁量，经数字化程序约束减少基层随意性。从行政封闭到社会开放——党建引领 + 平台技术合流。', pillars: [['一网通办', '从人跑到数跑。'], ['City Brain', '城市运行全息感知。'], ['安全阈值', '效率服从稳定性。']] },
        { title: '升级路径 · 共治韧性', subtitle: '1990 → 2024', body: '科层行政权重从 70% 降至 35%，市场/平台与社会组织权重上升——开放系统利用企业技术能力支撑公共治理。', pillars: [['1990', '科层封闭主导。'], ['2010s', '网格 + 电子政务。'], ['2024', 'AI + 城市大脑。']] },
      ]} />

      <ModuleFooter moduleId="governance" sourceNote="由 china.html「国家治理现代化」专题迁移升级" />
    </div>
  );
}
