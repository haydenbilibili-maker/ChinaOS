import React from 'react';
import { PageHeader, Card, Grid, Stat } from '../../app/ui.jsx';
import EChart from '../../lib/viz/EChart.jsx';

const costTrend = {
  legend: { data: ['技术介入度', '统治成本指数'], textStyle: { color: '#93a1b5' }, top: 0 },
  grid: { left: 44, right: 16, top: 30, bottom: 24 },
  xAxis: { type: 'category', data: ['2000', '2008', '2016', '2020', '2024'], axisLine: { lineStyle: { color: '#27324a' } } },
  yAxis: { type: 'value', splitLine: { lineStyle: { color: 'rgba(148,163,184,0.1)' } } },
  series: [
    { name: '技术介入度', type: 'line', smooth: true, data: [20, 40, 65, 85, 98], lineStyle: { color: '#22d3ee' }, areaStyle: { color: 'rgba(34,211,238,0.08)' } },
    { name: '统治成本指数', type: 'line', smooth: true, data: [100, 88, 72, 60, 50], lineStyle: { color: '#c41e3a' } },
  ],
};

const KERNEL = [
  ['解释权主权', '垄断对「文明、民主、公正」的定义权，构建语义防御系统。'],
  ['精英筛选算法', '科举制的现代变体：贤能政治；长周期政绩考察与基层筛选。'],
  ['均贫富调节', '历史性的财富再分配逻辑，防止阶层板结导致的系统崩溃。'],
];

export default function Page() {
  return (
    <div>
      <PageHeader badge="Internal Realpolitik" title="中国权力运行逻辑" subtitle="儒表法里 · 指令穿透 · 秩序优先 · 数字利维坦 —— 穿透宏观叙事，直击底层逻辑" />
      <Grid cols={4} className="mb-6">
        <Stat value="98.5%" label="稳定性指数" accent="#c41e3a" />
        <Stat value="HIGH ▲" label="动员穿透力" />
        <Stat value="v2.4.0" label="治理算法版本 · 新质生产力" accent="#22d3ee" />
        <Stat value="ACTIVE" label="风险防火墙" accent="#e8a317" />
      </Grid>

      <Card title="内核协议 · 儒表法里的二元系统" className="mb-6">
        <p className="text-sm leading-relaxed mb-3" style={{ color: 'var(--text-secondary)' }}>
          权力运作的底层不是单一维度，而是一套双内核架构：外层通过<strong style={{ color: 'var(--text-primary)' }}>儒家叙事</strong>提供道德合法性与社会润滑剂；内层通过<strong style={{ color: 'var(--text-primary)' }}>法家技术</strong>实现行政效率与资源汲取。「外圆内方」确保系统在极端压力下仍具物理弹性。
        </p>
        <p className="text-xs italic mb-4" style={{ color: 'var(--text-tertiary)' }}>"Rule by virtue as the surface, rule by law as the machine."</p>
        <Grid cols={3}>
          {KERNEL.map(([t, d]) => (
            <div key={t} style={{ borderLeft: '2px solid #c41e3a', paddingLeft: 10 }}><div className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>{t}</div><p className="text-[11px] mt-1 leading-relaxed" style={{ color: 'var(--text-tertiary)' }}>{d}</p></div>
          ))}
        </Grid>
      </Card>

      <Grid cols={2} className="mb-6">
        <Card title="权力流向建模">
          <div className="space-y-3">
            <div className="flex justify-between text-sm"><span style={{ color: 'var(--text-secondary)' }}>意志传导效率</span><span className="mono" style={{ color: '#10b981' }}>ULTRA-FAST</span></div>
            <div className="flex justify-between text-sm"><span style={{ color: 'var(--text-secondary)' }}>社会反馈时延</span><span className="mono" style={{ color: '#e8a317' }}>MODERATE</span></div>
            <div className="flex justify-between text-sm"><span style={{ color: 'var(--text-secondary)' }}>指令传输延时</span><span className="mono" style={{ color: '#22d3ee' }}>&lt; 1ms</span></div>
          </div>
          <p className="text-xs mt-3 leading-relaxed" style={{ color: 'var(--text-tertiary)' }}>分析：当前中枢对地方的「人事主权」实现了两千年来最高水平的物理覆盖。</p>
        </Card>
        <Card title="数字利维坦 · 代码即秩序">
          <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>在 14 亿人的超大规模社会，治理已不仅是法律问题，更是计算问题。体制通过「算力主权」重构权力末端：每条指令经数字网格精准触达，每个反馈经社交数据实时校准。当技术消解「山高皇帝远」的物理屏障，权力实现真正的<strong style={{ color: 'var(--text-primary)' }}>全时空、全域透视</strong>。</p>
        </Card>
      </Grid>

      <Card title="统治成本与技术介入的相关性（指数 · 示意）" className="mb-6">
        <EChart option={costTrend} style={{ height: 240 }} />
        <p className="text-[11px] mt-1" style={{ color: 'var(--text-tertiary)' }}>技术介入度上升，单位统治成本下降——算法治理压低了超大规模社会的协调摩擦。</p>
      </Card>

      <Card title="调研结论 · 构建确定的未来"><p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>权力逻辑的核心在于对「不确定性」的极度厌恶。无论从「唯 GDP」转向「高质量发展」，还是从「行政干预」转向「法治闭环」，本质都是在优化同一套生存算法——在极致动员力与精准反馈力之间寻求平衡点，为 21 世纪超大规模文明体提供长周期的物理最优解。</p>
        <div className="flex flex-wrap gap-3 mt-4 text-xs mono" style={{ color: 'var(--text-tertiary)' }}><span>// SOVEREIGNTY: 100.00%</span><span>// ORDER: OPTIMIZED</span><span>// FEEDBACK: CALIBRATING...</span></div>
      </Card>
      <p className="text-xs mt-6" style={{ color: 'var(--text-tertiary)' }}>本模块为现实主义视角的结构分析，指标为模型示意 ·「穿透宏观叙事，直击底层逻辑」· 由 china.html「权力逻辑」专题迁移</p>
    </div>
  );
}
