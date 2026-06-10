import React, { useState, useMemo } from 'react';
import { PageHeader, Card, Grid, Stat } from '../../app/ui.jsx';
import EChart from '../../lib/viz/EChart.jsx';
import { categoryX, valueY, GRID, donutOpt, radarOpt } from '../shared/chartHelpers.js';
import { IntroCard, SelectorBar, TimelineBar, FrameworkTrio, ModuleFooter } from '../shared/ModuleParadigm.jsx';

const SCENARIOS = [
  { key: 'status', label: '维持现状', accent: '#64748b', certainty: 72, cost: 35, desc: '外部干预维持离岸平衡，大陆以经济重力与常态化巡航消耗对方意志。成本在于战略窗口持续收窄。' },
  { key: 'blockade', label: '封控施压', accent: '#e8a317', certainty: 85, cost: 55, desc: '非热战式海空封控，以 A2/AD 气泡切断补给与外援通道。硅盾与全球产业链停摆构成介入方的隐性成本上限。' },
  { key: 'amphib', label: '两栖统一', accent: '#c41e3a', certainty: 95, cost: 88, desc: '热战路径的终局选项。确定性最高但物理成本与全球震荡最大——仅在重力场收敛至临界点时进入可行域。' },
];

const PHASES = [
  { period: '2008–2016', title: '防独 · 红线威慑', accent: '#64748b', desc: '《反分裂国家法》+ 导弹覆盖形成底线。重心在阻止法理台独，军事准备以威慑为主。' },
  { period: '2016–2022', title: '促统 · 常态化巡航', accent: '#e8a317', desc: '绕岛巡航、越过海峡中线成为新常态。从「防独」转向压缩离岸活动空间，重力场开始显性化。' },
  { period: '2022–至今', title: '收网 · 融合发展', accent: '#c41e3a', desc: '福建两岸融合发展示范区、大湾区融合样本。算法从军事威慑扩展到制度性吸纳——测试未来治理接口。' },
];

const siliconDonut = donutOpt([
  { value: 90, name: '台湾（10nm以下）', itemStyle: { color: '#c41e3a' } },
  { value: 6, name: '韩国', itemStyle: { color: '#22d3ee' } },
  { value: 4, name: '其他', itemStyle: { color: '#64748b' } },
]);

const tradeBar = {
  tooltip: { trigger: 'axis' },
  grid: GRID,
  xAxis: categoryX(['2015', '2018', '2021', '2024']),
  yAxis: valueY({ axisLabel: { formatter: '{value}%' } }),
  series: [
    { name: '两岸贸易占台湾外贸', type: 'bar', data: [22, 24, 25, 23], barWidth: 22, itemStyle: { color: '#22d3ee', borderRadius: [3, 3, 0, 0] } },
    { name: '大陆占台湾出口', type: 'line', smooth: true, data: [40, 41, 42, 35], lineStyle: { color: '#c41e3a' }, itemStyle: { color: '#c41e3a' } },
  ],
};

export default function Page() {
  const [scenario, setScenario] = useState('blockade');
  const [phaseIdx, setPhaseIdx] = useState(PHASES.length - 1);
  const sc = SCENARIOS.find((s) => s.key === scenario) || SCENARIOS[1];

  const gravityChart = useMemo(() => ({
    grid: { left: 44, right: 16, top: 20, bottom: 24 },
    xAxis: categoryX(['2012', '2016', '2020', '2024', '2028E']),
    yAxis: valueY({ max: 100, name: '统一确定性', nameTextStyle: { color: '#5b6a82' } }),
    series: [{
      type: 'line', smooth: true, symbol: 'circle', symbolSize: 6,
      data: [55, 64, 75, 88, sc.certainty + 4],
      lineStyle: { color: sc.accent, width: 2 },
      areaStyle: { color: `${sc.accent}22` },
      markArea: { silent: true, itemStyle: { color: 'rgba(196,30,58,0.06)' }, data: [[{ xAxis: '2020' }, { xAxis: '2028E' }]] },
    }],
  }), [sc]);

  const deterrenceRadar = radarOpt(['高超声速', '反舰打击', '态势感知', '区域拒止', '常态巡航'], [92, 88, 100, 90, 95], { name: 'A2/AD 气泡', color: '#e8a317' });

  const costCertainty = useMemo(() => ({
    grid: GRID,
    xAxis: valueY({ max: 100, name: '物理成本' }),
    yAxis: categoryX(SCENARIOS.map((s) => s.label)),
    series: [{
      type: 'bar', barWidth: 16,
      data: SCENARIOS.map((s) => ({
        value: s.cost,
        itemStyle: { color: s.key === scenario ? s.accent : 'rgba(100,116,139,0.4)', borderRadius: 3 },
      })),
    }, {
      type: 'scatter', symbolSize: (d) => (d[2] === scenario ? 18 : 10),
      data: SCENARIOS.map((s) => [s.cost, s.label, s.key, s.certainty]),
      itemStyle: { color: (p) => SCENARIOS.find((x) => x.key === p.data[2])?.accent },
    }],
  }), [scenario]);

  return (
    <div>
      <PageHeader badge="Taiwan Straits · 岛链突破" title="台海局势与地缘重力博弈" subtitle="地缘引力 · 物理威慑 · 硅盾 · 终局吸纳 —— 剥离叙事，以成本收益计算地缘坍缩" />
      <IntroCard>现实主义框架下，台湾归属是突破<strong style={{ color: 'var(--text-primary)' }}>第一岛链</strong>、获取太平洋深水出海口的物理前提。算法逻辑已从「防独」转向「促统」——以经济重力场与 A2/AD 气泡，迫使离岸系统在生存层面与在岸系统实现最终物理坍缩。外部干预方必须计入<strong style={{ color: 'var(--cyber-cyan)' }}>硅盾</strong>与全球电子产业链停摆的极端风险。</IntroCard>

      <Grid cols={4} className="mb-6">
        <Stat value={`${sc.certainty}%`} label="统一确定性（场景切换）" accent={sc.accent} />
        <Stat value="3,000km" label="A2/AD 覆盖半径" accent="#22d3ee" />
        <Stat value="90%+" label="10nm 以下芯片份额 · 硅盾" accent="#e8a317" />
        <Stat value="岛链突破" label="战略物理目标" accent="#c41e3a" />
      </Grid>

      <Card title="交互① · 终局场景选择器（成本—确定性权衡）" className="mb-6">
        <SelectorBar items={SCENARIOS} activeKey={scenario} onSelect={setScenario} />
        <Grid cols={2}>
          <div className="os-card p-4" style={{ background: 'var(--bg-elevated)', borderLeft: `3px solid ${sc.accent}` }}>
            <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{sc.desc}</p>
            <Grid cols={2} className="mt-3">
              <Stat value={sc.certainty} label="统一确定性指数" accent={sc.accent} />
              <Stat value={sc.cost} label="物理成本指数" accent="#64748b" />
            </Grid>
          </div>
          <EChart option={costCertainty} style={{ height: 200 }} />
        </Grid>
      </Card>

      <Grid cols={2} className="mb-6">
        <Card title="地缘重力曲线 · 随场景动态（示意）"><EChart option={gravityChart} style={{ height: 220 }} /></Card>
        <Card title="物理威慑 · A2/AD 气泡"><EChart option={deterrenceRadar} style={{ height: 220 }} /></Card>
      </Grid>

      <Card title="交互② · 对台战略阶段时间线" className="mb-6">
        <TimelineBar stages={PHASES} activeIdx={phaseIdx} onSelect={setPhaseIdx} />
      </Card>

      <Card title="硅盾 · 非对称产业链人质" className="mb-6">
        <Grid cols={2}>
          <EChart option={siliconDonut} style={{ height: 240 }} />
          <div>
            <p className="text-sm leading-relaxed mb-3" style={{ color: 'var(--text-secondary)' }}>台积电等先进制程产能高度集中于台海——外部干预方在计算行动收益时，必须面对全球电子产业链瞬间停摆的「同归于尽」式威慑。这是<strong style={{ color: 'var(--text-primary)' }}>收支倒挂</strong>的地缘版：军事收益 vs 经济系统崩溃成本。</p>
            <EChart option={tradeBar} style={{ height: 160 }} />
          </div>
        </Grid>
      </Card>

      <FrameworkTrio cards={[
        { title: '岛链突破逻辑', subtitle: '第一岛链 · 深水通道', body: '统一不仅是主权叙事，更是获取太平洋战略纵深的物理计算。岛链封锁若不能解除，海军远洋存在与能源通道安全始终处于被钳制状态。', pillars: [['重力场', '经济融合 + 军事常态巡航，消耗离岸系统的独立意志。'], ['A2/AD', '区域拒止抬高外部干预的物理成本上限。'], ['硅盾', '产业链人质让热战选项对全球系统不可承受。']] },
        { title: '摸石头 · 融合试点', subtitle: '福建 · 大湾区', body: '先在物理边界测试未来治理接口——两岸融合发展示范区、大湾区制度衔接，为终局吸纳积累可复制的治理模块，降低统一后的整合摩擦。', pillars: [['制度接口', '测试离岸规则与在岸规则的兼容层。'], ['经济绑定', '贸易、投资、产业链深度嵌套。'], ['认知收编', '语义空间逐步纳入统一叙事框架。']] },
        { title: '升级路径 · 促统算法', subtitle: '2022 → 终局', body: '从防独红线 → 常态化巡航 → 融合发展收网。确定性随时间单调上升，成本函数取决于外部干预意愿与硅盾约束的交点。', pillars: [['非热战优先', '封控施压优于热战——成本可控。'], ['窗口期', '实力曲线逼近交叉，时间站在崛起国一侧。'], ['终局吸纳', '统一不是是否，而是何时、以何种成本达成。']] },
      ]} />

      <Card title="调研结论 · 构建终局算法" className="mb-6">
        <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>对台战略进入系统性收网阶段：以大湾区为融合样本、推进福建两岸融合发展示范区，在物理边界上测试未来治理模式。现实主义眼中，统一不是「是否」的问题，而是「何时、以何种成本达成」的物理计算过程。</p>
        <div className="flex flex-wrap gap-3 mt-4 text-xs mono" style={{ color: 'var(--text-tertiary)' }}>
          <span>{'// SOVEREIGN_INTERFACE: READY'}</span><span>{'// INTERVENTION_COST: MAXIMIZED'}</span><span>{'// STATUS: CONVERGING'}</span>
        </div>
      </Card>

      <ModuleFooter moduleId="straits" sourceNote="由 china.html「台海」专题迁移升级" />
    </div>
  );
}
