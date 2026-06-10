import React, { useState } from 'react';
import { PageHeader, Card, Grid, Stat } from '../../app/ui.jsx';
import EChart from '../../lib/viz/EChart.jsx';
import { categoryX, valueY, GRID, radarOpt } from '../shared/chartHelpers.js';
import { IntroCard, SelectorBar, FrameworkTrio, ModuleFooter } from '../shared/ModuleParadigm.jsx';

const KERNELS = [
  { key: 'ru', label: '儒 · 表', accent: '#e8a317', desc: '外层儒家叙事提供道德合法性与社会润滑剂——解释权主权、均贫富调节、文明叙事构建语义防御系统。' },
  { key: 'fa', label: '法 · 里', accent: '#c41e3a', desc: '内层法家技术实现行政效率与资源汲取。精英筛选算法（科举现代变体）、压力型执行、数字网格构成权力机器。' },
  { key: 'digital', label: '数字利维坦', accent: '#22d3ee', desc: '算力主权重构权力末端：语义防火墙 + 数字网格 + 赛博反馈，消解「山高皇帝远」的物理屏障，实现全时空全域透视。' },
];

const costTrend = {
  legend: { data: ['统治成本指数', '技术介入度'], textStyle: { color: '#93a1b5' }, top: 0 },
  grid: { left: 44, right: 16, top: 30, bottom: 24 },
  xAxis: categoryX(['2000', '2008', '2016', '2024']),
  yAxis: valueY(),
  series: [
    { name: '统治成本指数', type: 'line', smooth: true, data: [100, 88, 70, 52], lineStyle: { color: '#c41e3a' }, areaStyle: { color: 'rgba(196,30,58,0.1)' } },
    { name: '技术介入度', type: 'line', smooth: true, data: [10, 35, 65, 95], lineStyle: { color: '#22d3ee' }, areaStyle: { color: 'rgba(34,211,238,0.08)' } },
  ],
};

export default function Page() {
  const [kernelKey, setKernelKey] = useState('fa');
  const k = KERNELS.find((x) => x.key === kernelKey) || KERNELS[1];

  const powerRadar = radarOpt(['意志传导', '资源汲取', '语义防御', '精英筛选', '反馈校准', '动员穿透'], [98, 92, 88, 85, 75, 96], { name: k.label, color: k.accent });

  return (
    <div>
      <PageHeader badge="Internal Realpolitik · SYSTEM_UPTIME 75Y" title="中国权力运行逻辑" subtitle="儒表法里 · 指令穿透 · 秩序优先 · 数字利维坦 —— 穿透宏观叙事，直击底层逻辑" />
      <IntroCard>权力运作是<strong style={{ color: 'var(--text-primary)' }}>双内核架构</strong>：外层儒家叙事提供合法性与润滑剂；内层法家技术实现效率与汲取。「外圆内方」确保系统在极端压力下仍具强大物理弹性。技术介入度上升，统治成本指数下降——算力主权是 21 世纪的负熵流。</IntroCard>

      <Grid cols={4} className="mb-6">
        <Stat value="98.5%" label="稳定性指数 · 示意" accent="#c41e3a" />
        <Stat value="ULTRA" label="动员穿透力" accent="#e8a317" />
        <Stat value="52" label="统治成本指数 · 2024" accent="#22d3ee" />
        <Stat value="95" label="技术介入度 · 2024" accent="#10b981" />
      </Grid>

      <Card title="交互 · 三内核切换 · 权力雷达联动" className="mb-6">
        <SelectorBar items={KERNELS} activeKey={kernelKey} onSelect={setKernelKey} />
        <Grid cols={2}>
          <div className="os-card p-4" style={{ background: 'var(--bg-elevated)', borderLeft: `3px solid ${k.accent}` }}>
            <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{k.desc}</p>
          </div>
          <EChart option={powerRadar} style={{ height: 220 }} />
        </Grid>
      </Card>

      <Grid cols={2} className="mb-6">
        <Card title="统治成本 vs 技术介入（指数 · 示意）"><EChart option={costTrend} style={{ height: 240 }} /></Card>
        <Card title="数字利维坦 · 代码即秩序">
          <p className="text-sm leading-relaxed mb-3" style={{ color: 'var(--text-secondary)' }}>治理已是计算问题：每一条指令经数字网格精准触达，每一个反馈经社交数据实时校准。当技术消解物理屏障，权力实现真正的全时空透视。</p>
          <div className="flex flex-wrap gap-2">{['Algorithmic Governance', '语义防火墙', '算力主权', '赛博反馈'].map((t) => (
            <span key={t} className="text-[11px] mono px-2 py-0.5 rounded" style={{ background: 'var(--bg-elevated)', color: 'var(--cyber-cyan)' }}>{t}</span>
          ))}</div>
        </Card>
      </Grid>

      <FrameworkTrio cards={[
        { title: '儒表法里', subtitle: '外圆内方 · 两千年', body: 'Rule by virtue as the surface, rule by law as the machine. 解释权主权垄断文明/民主/公正的定义权，构建语义防御；法家内核负责汲取与执行。', pillars: [['解释权', '语义防御系统。'], ['精英筛选', '科举现代变体。'], ['均贫富', '防阶层板结崩溃。']] },
        { title: '摸石头 · 算法演进', subtitle: 'GDP → 高质量', body: '从唯 GDP 转向高质量发展，从行政干预转向法治闭环——本质都是优化同一套生存算法，在极致动员力与精准反馈力之间求平衡。', pillars: [['2000', '成本指数 100。'], ['2016', '技术介入 65。'], ['2024', '成本指数 52。']] },
        { title: '升级路径 · 数字利维坦', subtitle: 'v2.4.0', body: '权力逻辑的核心是对不确定性的极度厌恶。数字网格 + 算力主权是 21 世纪超大规模文明体的长周期物理最优解。', pillars: [['网格', '意志直达末梢。'], ['反馈', '社交数据校准。'], ['透视', '全时空全域覆盖。']] },
      ]} />

      <ModuleFooter moduleId="powerlogic" sourceNote="由 china.html「权力逻辑」专题迁移升级" />
    </div>
  );
}
