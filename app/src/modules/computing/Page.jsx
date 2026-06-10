import React, { useState, useMemo } from 'react';
import { PageHeader, Card, Grid, Stat } from '../../app/ui.jsx';
import EChart from '../../lib/viz/EChart.jsx';
import { categoryX, valueY, GRID, radarOpt, donutOpt } from '../shared/chartHelpers.js';
import { IntroCard, SelectorBar, TimelineBar, FrameworkTrio, ModuleFooter } from '../shared/ModuleParadigm.jsx';

const HUBS = [
  { key: 'west', label: '西部枢纽', accent: '#c41e3a', heat: 95, pue: 1.15, desc: '内蒙古、贵州、宁夏、甘肃：风光水电优势 + 冷源 + 土地成本，算力西移与电价差套利的物理落点。' },
  { key: 'east', label: '东部集群', accent: '#22d3ee', heat: 68, pue: 1.35, desc: '长三角、粤港澳：贴近用户与出海光缆，实时业务布局首选；电价与土地约束更紧。' },
  { key: 'central', label: '成渝备份', accent: '#10b981', heat: 75, pue: 1.25, desc: '承接东部备份与西南数字产业，枢纽间毫秒级时延目标下的中间节点。' },
];

const PHASES = [
  { period: '2016–2020', title: 'IDC 规模扩张', accent: '#64748b', desc: '通用算力先行，PUE 约束宽松，东部沿海集中建设。' },
  { period: '2021–2023', title: '东数西算启动', accent: '#e8a317', desc: '八大枢纽、十集群顶层设计出台，算力布局与西部绿电耦合。' },
  { period: '2024–至今', title: '智算主权攻坚', accent: '#c41e3a', desc: '大模型训练推高 GPU 需求；国产加速卡与语义防火墙并行推进。' },
];

const demandDonut = donutOpt([
  { value: 35, name: '大模型训练', itemStyle: { color: '#c41e3a' } },
  { value: 20, name: '推理', itemStyle: { color: '#22d3ee' } },
  { value: 15, name: '政企云', itemStyle: { color: '#e8a317' } },
  { value: 12, name: '渲染', itemStyle: { color: '#10b981' } },
  { value: 18, name: '其他', itemStyle: { color: '#64748b' } },
]);

export default function Page() {
  const [hub, setHub] = useState('west');
  const [phaseIdx, setPhaseIdx] = useState(PHASES.length - 1);
  const h = HUBS.find((x) => x.key === hub) || HUBS[0];

  const scaleLine = useMemo(() => ({
    grid: GRID,
    xAxis: categoryX(['2019', '2020', '2021', '2022', '2023', '2024E']),
    yAxis: valueY(),
    series: [{ type: 'line', smooth: true, symbol: 'circle', symbolSize: 6,
      data: [90, 135, 150, 180, 230, hub === 'west' ? 320 : 280],
      lineStyle: { color: h.accent, width: 2 }, itemStyle: { color: h.accent },
      areaStyle: { color: `${h.accent}18` } }],
  }), [hub, h]);

  const hubBar = useMemo(() => ({
    grid: { left: 56, right: 36, top: 16, bottom: 24 },
    xAxis: valueY({ max: 100 }),
    yAxis: categoryX(['京津冀', '长三角', '粤港澳', '成渝', '甘肃', '贵州', '宁夏', '内蒙']),
    series: [{ type: 'bar', barWidth: 14, itemStyle: { borderRadius: 3 },
      data: [58, 65, 70, 75, 88, 92, 95, hub === 'west' ? 98 : 88].map((v, i) => ({
        value: v, itemStyle: { color: i >= 4 ? h.accent : '#22d3ee' },
      })),
      label: { show: true, position: 'right', color: '#93a1b5' } }],
  }), [hub, h]);

  const competenceRadar = radarOpt(['芯片', '框架', 'IDC', '网络', '人才', '绿电'],
    hub === 'west' ? [68, 90, 92, 85, 80, 98] : [78, 95, 88, 92, 88, 75],
    { name: '2024 评估', color: h.accent });

  return (
    <div>
      <PageHeader badge="Computing · 算力主权" title="算力基础设施 · 东数西算" subtitle="枢纽节点 · 智算中心 · 能效约束 · 语义防火墙" />
      <IntroCard>智算中心与绿色电力绑定：大模型训练推高 GPU/加速卡需求，「东数西算」把算力布局与西部风光、水电耦合。PUE、水耗与<strong style={{ color: 'var(--text-primary)' }}>芯片对外依存</strong>构成长期约束——算力主权是 AI 时代的能源压舱石。</IntroCard>

      <Grid cols={4} className="mb-6">
        <Stat value="230+ EF" label="智能算力（EFLOPS · 区间）" accent="#22d3ee" />
        <Stat value={`PUE ${h.pue}`} label={`${h.label} · 切换`} accent={h.accent} />
        <Stat value="#2" label="算力规模排名" accent="#e8a317" />
        <Stat value="~40%" label="国产加速卡渗透（示意）" accent="#10b981" />
      </Grid>

      <Card title="交互① · 枢纽类型选择器（投资热度 / PUE）" className="mb-6">
        <SelectorBar items={HUBS} activeKey={hub} onSelect={setHub} />
        <div className="os-card p-4 mb-4" style={{ background: 'var(--bg-elevated)', borderLeft: `3px solid ${h.accent}` }}>
          <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{h.desc}</p>
        </div>
        <Grid cols={2}>
          <Card title="智能算力规模（EFLOPS · 随枢纽切换）"><EChart option={scaleLine} style={{ height: 220 }} /></Card>
          <Card title="枢纽投资热度指数"><EChart option={hubBar} style={{ height: 220 }} /></Card>
        </Grid>
      </Card>

      <Card title="交互② · 算力政策阶段时间线" className="mb-6">
        <TimelineBar stages={PHASES} activeIdx={phaseIdx} onSelect={setPhaseIdx} />
      </Card>

      <Grid cols={2} className="mb-6">
        <Card title="算力产业链能力（随枢纽切换）"><EChart option={competenceRadar} style={{ height: 260 }} /></Card>
        <Card title="算力需求结构（示意）"><EChart option={demandDonut} style={{ height: 260 }} /></Card>
      </Grid>

      <FrameworkTrio cards={[
        { title: '算力即主权', subtitle: '东数西算 · 枢纽', body: '八大枢纽、十集群引导算力西移与电价差套利；网络时延决定实时业务能否留在东部。', pillars: [['西部枢纽', '风光水电 + 冷源成本优势。'], ['东部集群', '用户 proximity + 出海光缆。'], ['时延约束', '毫秒级骨干网优化目标。']] },
        { title: '算电协同', subtitle: '绿电 · PUE', body: '数据中心年耗电占全社会用电比重持续上升；绿证、绿电交易与自备新能源是降碳路径。', pillars: [['绿电直供', '园区级源网荷储一体化。'], ['液冷渗透', '高功率 GPU 推动液冷。'], ['碳足迹', '出口算力面临 CBAM 压力。']] },
        { title: '芯片与框架', subtitle: '供应链安全', body: '高端 GPU 仍受出口管制；国产加速卡与开源框架生态决定替代节奏。', pillars: [['推理先行', '国产卡 ~40%+ 渗透。'], ['训练攻坚', '仍依赖高端进口卡。'], ['算力券', '政府采购托底需求。']] },
      ]} />

      <Card title="研判要点" className="mb-6">
        <Grid cols={3}>
          {[['1 · 算力即服务', '云厂商 Capex 周期与模型迭代强相关，存在产能过剩风险。'],
            ['2 · 电价与碳成本', '进入模型 TCO；出口算力服务面临碳边境规则压力。'],
            ['3 · 边缘与 6G', '低时延业务驱动 MEC；与卫星回传、车联网联动。']].map(([t, d]) => (
            <div key={t}><div className="text-sm font-semibold" style={{ color: 'var(--china-red)' }}>{t}</div><p className="text-xs mt-1 leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{d}</p></div>
          ))}
        </Grid>
      </Card>

      <ModuleFooter moduleId="computing" sourceNote="由 china.html「算力」专题迁移升级" />
    </div>
  );
}
