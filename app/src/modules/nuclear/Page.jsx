import React, { useState, useMemo } from 'react';
import { PageHeader, Card, Grid, Stat } from '../../app/ui.jsx';
import EChart from '../../lib/viz/EChart.jsx';
import { categoryX, valueY, GRID, radarOpt } from '../shared/chartHelpers.js';
import { IntroCard, SelectorBar, TimelineBar, FrameworkTrio, ModuleFooter } from '../shared/ModuleParadigm.jsx';

const GENS = [
  { key: 'hualong', label: '华龙一号', accent: '#c41e3a', maturity: 98, desc: '自主三代压水堆，在运与核准规模居全球前列；设计总包与设备国产化率接近 100%，是基荷电源的主力路线。' },
  { key: 'htr', label: '高温气冷堆', accent: '#22d3ee', maturity: 92, desc: '石球燃料 + 氦气冷却，HTR-PM 示范验证固有安全；适合热电联供与工业供热场景。' },
  { key: 'fast', label: '快中子堆', accent: '#e8a317', maturity: 95, desc: '提高铀资源利用率，闭合燃料循环与后处理、嬗变长寿命核素联动——数十年尺度的能源主权布局。' },
  { key: 'smr', label: '小型堆 SMR', accent: '#10b981', maturity: 42, desc: '面向工业供热、海岛与数据中心供电；审批、安全壳与应急体系是制度成本。' },
];

const PHASES = [
  { period: '2005–2015', title: '三代引进消化', accent: '#64748b', desc: 'AP1000/EPR 引进 + 华龙一号自主研发并行，在运装机 ~26 GW。' },
  { period: '2016–2022', title: '核准重启', accent: '#e8a317', desc: '核准节奏恢复，华龙一号批量化建设，装机突破 50 GW。' },
  { period: '2023–至今', title: '四代示范', accent: '#c41e3a', desc: '高温气冷堆、快堆示范投运；小型堆与聚变研发长周期并行。' },
];

export default function Page() {
  const [gen, setGen] = useState('hualong');
  const [phaseIdx, setPhaseIdx] = useState(PHASES.length - 1);
  const g = GENS.find((x) => x.key === gen) || GENS[0];

  const scaleLine = useMemo(() => ({
    grid: GRID,
    xAxis: categoryX(['2015', '2018', '2021', '2023', '2025E', '2030E']),
    yAxis: valueY({ axisLabel: { formatter: '{value} GW' } }),
    series: [{ type: 'line', smooth: true, symbol: 'circle', symbolSize: 6,
      data: gen === 'smr' ? [26, 42, 53, 57, 65, 85] : [26, 42, 53, 57, 72, 110],
      lineStyle: { color: g.accent, width: 2 }, itemStyle: { color: g.accent },
      areaStyle: { color: `${g.accent}18` } }],
  }), [gen, g]);

  const genEvolution = useMemo(() => ({
    grid: { ...GRID, bottom: 50 },
    legend: { bottom: 0, textStyle: { color: '#93a1b5', fontSize: 10 } },
    xAxis: categoryX(['华龙/M310+', '高温气冷堆', '快堆示范', '熔盐堆', '小型堆']),
    yAxis: valueY({ max: 100, axisLabel: { formatter: '{value}%' } }),
    series: [
      { name: '2020', type: 'bar', barWidth: 12, data: [85, 70, 30, 25, 15], itemStyle: { color: '#e8a317', borderRadius: 3 } },
      { name: '2024E', type: 'bar', barWidth: 12,
        data: gen === 'hualong' ? [98, 92, 95, 55, 42] : [85, g.maturity, 90, 50, g.maturity],
        itemStyle: { color: g.accent, borderRadius: 3 } },
    ],
  }), [gen, g]);

  const competenceRadar = radarOpt(['设计总包', '设备', '燃料', '运维', '融资', '出口'],
    [95, 100, 98, 95, 88, gen === 'hualong' ? 70 : 55],
    { name: '产业链能力', color: g.accent });

  return (
    <div>
      <PageHeader badge="Nuclear · 基荷 · 低碳" title="核电核准装机 · 四代堆" subtitle="华龙一号 · HTR-PM · 燃料循环 · 基荷主权" />
      <IntroCard>在风光波动之后「稳定出力」的制度安排：核电提供年利用小时数高、碳排低的<strong style={{ color: 'var(--text-primary)' }}>基荷电力</strong>，与抽水蓄能、特高压共同构成新型电力系统的物理底盘。</IntroCard>

      <Grid cols={4} className="mb-6">
        <Stat value="55+ 台" label="在运机组（量级）" accent="#c41e3a" />
        <Stat value={`${g.maturity}%`} label={`${g.label}成熟度 · 切换`} accent={g.accent} />
        <Stat value="~5%" label="全国发电量占比" accent="#e8a317" />
        <Stat value="#1" label="在建核电规模" accent="#22d3ee" />
      </Grid>

      <Card title="交互① · 技术路线选择器" className="mb-6">
        <SelectorBar items={GENS} activeKey={gen} onSelect={setGen} />
        <div className="os-card p-4 mb-4" style={{ background: 'var(--bg-elevated)', borderLeft: `3px solid ${g.accent}` }}>
          <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{g.desc}</p>
        </div>
        <Grid cols={2}>
          <Card title="装机与规划（随路线切换）"><EChart option={scaleLine} style={{ height: 220 }} /></Card>
          <Card title="技术成熟度对比"><EChart option={genEvolution} style={{ height: 220 }} /></Card>
        </Grid>
      </Card>

      <Card title="交互② · 核电发展阶段时间线" className="mb-6">
        <TimelineBar stages={PHASES} activeIdx={phaseIdx} onSelect={setPhaseIdx} />
      </Card>

      <Grid cols={2} className="mb-6">
        <Card title="产业链能力雷达"><EChart option={competenceRadar} style={{ height: 260 }} /></Card>
        <Card title="聚变研发 · 人造太阳">
          <p className="text-sm leading-relaxed mb-3" style={{ color: 'var(--text-secondary)' }}>EAST、HL-3 等装置持续刷新等离子体参数；ITER 与 CFETR 路线牵动全球供应链。聚变商用仍受材料、能量增益约束，宜与裂变基荷解耦评估。</p>
          <div className="space-y-2">
            {[['EAST 长脉冲', '高约束模式积累运行窗口数据。'], ['ITER 国际合作', '工程进度牵动全球部件交付。']].map(([t, d]) => (
              <div key={t} style={{ borderLeft: '2px solid #22d3ee', paddingLeft: 10 }}>
                <div className="text-xs font-semibold" style={{ color: 'var(--text-primary)' }}>{t}</div>
                <p className="text-[11px]" style={{ color: 'var(--text-tertiary)' }}>{d}</p>
              </div>
            ))}
          </div>
        </Card>
      </Grid>

      <FrameworkTrio cards={[
        { title: '基荷压舱石', subtitle: '稳定出力', body: '年利用小时数 7000+，碳排低于煤电；与风光随机性形成源网荷储互补。', pillars: [['华龙批量化', '三代主力。'], ['~5% 发电占比', '仍有提升空间。'], ['沿海厂址', '冷却水约束。']] },
        { title: '四代堆分工', subtitle: '安全 · 燃料', body: '高温气冷堆固有安全；快堆闭合燃料循环；熔盐堆探索钍基循环——各路线工程化进度不一。', pillars: [['HTR-PM', '石球 + 氦冷。'], ['快堆', 'MOX 燃料循环。'], ['SMR', '供热与海岛。']] },
        { title: '燃料主权', subtitle: '铀 · 浓缩', body: '天然铀对外依存与浓缩能力构成能源主权子议题；快堆与闭式循环拉长博弈周期。', pillars: [['铀进口', '对外依存。'], ['浓缩能力', '自主可控。'], ['后处理', '闭式循环。']] },
      ]} />

      <ModuleFooter moduleId="nuclear" sourceNote="由 china.html「核电」专题迁移升级" />
    </div>
  );
}
