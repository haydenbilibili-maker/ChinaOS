import React from 'react';
import { PageHeader, Card, Grid, Stat } from '../../app/ui.jsx';
import EChart from '../../lib/viz/EChart.jsx';

const costTrend = {
  legend: { data: ['统治成本指数', '技术介入度'], textStyle: { color: '#93a1b5' }, top: 0 },
  grid: { left: 44, right: 16, top: 30, bottom: 24 },
  xAxis: { type: 'category', data: ['2000', '2008', '2016', '2024'], axisLine: { lineStyle: { color: '#27324a' } } },
  yAxis: { type: 'value', splitLine: { lineStyle: { color: 'rgba(148,163,184,0.1)' } } },
  series: [
    { name: '统治成本指数', type: 'line', smooth: true, data: [100, 88, 70, 52], lineStyle: { color: '#c41e3a' }, areaStyle: { color: 'rgba(196,30,58,0.1)' } },
    { name: '技术介入度', type: 'line', smooth: true, data: [10, 35, 65, 95], lineStyle: { color: '#22d3ee' }, areaStyle: { color: 'rgba(34,211,238,0.08)' } },
  ],
};

export default function Page() {
  return (
    <div>
      <PageHeader badge="Internal Realpolitik · SYSTEM_UPTIME 75Y" title="中国权力运行逻辑" subtitle="儒表法里 · 指令穿透 · 秩序优先 · 数字利维坦 —— 穿透宏观叙事，直击底层逻辑" />
      <Grid cols={4} className="mb-6">
        <Stat value="98.5%" label="稳定性指数" accent="#c41e3a" />
        <Stat value="HIGH ▲" label="动员穿透力" accent="#e8a317" />
        <Stat value="< 1ms" label="指令传输延时" accent="#22d3ee" />
        <Stat value="v2.4.0" label="治理算法版本" accent="#10b981" />
      </Grid>

      <Card title="内核协议 · 儒表法里的二元系统" className="mb-6">
        <p className="text-sm leading-relaxed mb-4" style={{ color: 'var(--text-secondary)' }}>
          权力运作不是单一维度，而是双内核架构：外层通过<strong style={{ color: 'var(--text-primary)' }}>「儒家叙事」</strong>提供道德合法性与社会润滑剂；内层通过<strong style={{ color: 'var(--text-primary)' }}>「法家技术」</strong>实现行政效率与资源汲取。「外圆内方」确保系统在极端压力下仍具强大物理弹性。
        </p>
        <p className="text-xs italic mb-4" style={{ color: 'var(--text-tertiary)' }}>"Rule by virtue as the surface, rule by law as the machine."</p>
        <Grid cols={3}>
          {[['解释权主权', '垄断对「文明、民主、公正」的定义权，构建语义防御系统。'],
            ['精英筛选算法', '科举制的现代变体：贤能政治。长周期政绩考察与基层筛选。'],
            ['均贫富调节', '历史性的财富再分配逻辑，防止社会阶层板结导致系统崩溃。']].map(([t, d]) => (
            <div key={t} style={{ borderLeft: '2px solid #c41e3a', paddingLeft: 10 }}><div className="text-xs font-semibold" style={{ color: 'var(--text-primary)' }}>{t}</div><p className="text-[11px] mt-1 leading-relaxed" style={{ color: 'var(--text-tertiary)' }}>{d}</p></div>
          ))}
        </Grid>
      </Card>

      <Grid cols={2} className="mb-6">
        <Card title="权力流向建模">
          <div className="space-y-3">
            <div className="flex justify-between text-sm"><span style={{ color: 'var(--text-secondary)' }}>意志传导效率</span><span className="mono" style={{ color: '#10b981' }}>ULTRA-FAST</span></div>
            <div className="flex justify-between text-sm"><span style={{ color: 'var(--text-secondary)' }}>社会反馈时延</span><span className="mono" style={{ color: '#e8a317' }}>MODERATE</span></div>
          </div>
          <p className="text-xs mt-3" style={{ color: 'var(--text-tertiary)' }}>当前中枢对地方的「人事主权」实现了两千年来最高水平的物理覆盖。</p>
        </Card>
        <Card title="统治成本与技术介入相关性（指数 · 示意）"><EChart option={costTrend} style={{ height: 220 }} /></Card>
      </Grid>

      <Card title="数字利维坦 · 代码即秩序" className="mb-6">
        <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
          在 14 亿人的超大规模社会，治理已不仅是法律问题，更是计算问题。体制通过「算力主权」重构权力末端：每一条指令经数字网格精准触达，每一个反馈经社交数据实时校准。当技术消解了「山高皇帝远」的物理屏障，权力实现了真正的<strong style={{ color: 'var(--text-primary)' }}>全时空、全域透视</strong>。
        </p>
        <div className="flex flex-wrap gap-2 mt-3">{['Algorithmic Governance', 'Total Predictability', '语义防火墙', '数字网格', '算力主权'].map((k) => (<span key={k} className="text-[11px] mono px-2 py-0.5 rounded" style={{ background: 'var(--bg-elevated)', color: 'var(--cyber-cyan)' }}>{k}</span>))}</div>
      </Card>

      <Card title="调研结论 · 构建确定的未来" className="mb-6">
        <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
          权力逻辑的核心在于对「不确定性」的极度厌恶。所有制度创新——从「唯 GDP」转向「高质量发展」，从「行政干预」转向「法治闭环」——本质上都是在优化同一套生存算法。这套算法在极致动员力与精准反馈力之间寻求平衡点，旨在为 21 世纪的超大规模文明体提供长周期的物理最优解。
        </p>
        <div className="flex flex-wrap gap-3 mt-4 text-xs mono" style={{ color: 'var(--text-tertiary)' }}>
          <span>// SOVEREIGNTY: 100.00%</span><span>// ORDER: OPTIMIZED</span><span>// FEEDBACK: CALIBRATING...</span>
        </div>
      </Card>
      <p className="text-xs" style={{ color: 'var(--text-tertiary)' }}>Realpolitik Intelligence — 「穿透宏观叙事，直击底层逻辑」；指标为模型示意 · 由 china.html「权力逻辑」专题迁移</p>
    </div>
  );
}
