import React, { useState } from 'react';
import { PageHeader, Card, Grid, Stat } from '../../app/ui.jsx';
import EChart from '../../lib/viz/EChart.jsx';
import { categoryX, valueY, GRID, radarOpt } from '../shared/chartHelpers.js';
import { IntroCard, SelectorBar, FrameworkTrio, ModuleFooter } from '../shared/ModuleParadigm.jsx';

const PRESSURE_MODES = [
  { key: 'target', label: '目标承包', accent: '#c41e3a', desc: '中枢设定核心目标（脱贫、双碳、GDP），逐级签「责任状」，完成情况挂钩行政资源与政治晋升——压力层层传递。' },
  { key: 'urgent', label: '限期拆弹', accent: '#e8a317', desc: '针对突发系统性风险，即时响应、驻场办公、督查回访特战模式，资源饱和式打击。' },
  { key: 'inspect', label: '督查回头看', accent: '#22d3ee', desc: '中枢直接指挥的督查系统，不定期穿透式抽检，防执行末端的过滤效应与打折扣。' },
];

const distortionTrend = {
  grid: GRID,
  xAxis: categoryX(['2012', '2016', '2020', '2024']),
  yAxis: valueY({ name: '损耗指数', nameTextStyle: { color: '#5b6a82' } }),
  series: [{ type: 'line', smooth: true, data: [100, 72, 50, 35], lineStyle: { color: '#c41e3a', width: 2 }, areaStyle: { color: 'rgba(196,30,58,0.1)' } }],
};

const costTrend = {
  grid: GRID,
  xAxis: categoryX(['2013', '2017', '2021', '2024']),
  yAxis: valueY({ axisLabel: { formatter: '{value}%' } }),
  series: [{ type: 'bar', data: [18, 15, 13, 11], barWidth: 28, itemStyle: { color: '#10b981', borderRadius: [3, 3, 0, 0] } }],
};

export default function Page() {
  const [modeKey, setModeKey] = useState('target');
  const mode = PRESSURE_MODES.find((m) => m.key === modeKey) || PRESSURE_MODES[0];

  const efficacyRadar = {
    legend: { data: ['中国', '发达经济体均值'], textStyle: { color: '#93a1b5' }, top: 0 },
    radar: { indicator: [{ name: '动员广度', max: 100 }, { name: '执行速度', max: 100 }, { name: '资源调配', max: 100 }, { name: '政策修正', max: 100 }, { name: '透明度', max: 100 }, { name: '容错弹性', max: 100 }], axisName: { color: '#93a1b5' }, splitLine: { lineStyle: { color: 'rgba(148,163,184,0.15)' } }, splitArea: { show: false } },
    series: [{ type: 'radar', data: [
      { value: [98, 92, 95, 80, 55, 60], name: '中国', lineStyle: { color: mode.accent }, areaStyle: { color: 'rgba(196,30,58,0.12)' } },
      { value: [60, 55, 65, 80, 88, 82], name: '发达经济体均值', lineStyle: { color: '#22d3ee' } },
    ] }],
  };

  return (
    <div>
      <PageHeader badge="Administrative System" title="政府体系与行政执行逻辑" subtitle="权力架构 · 压力传导 · 组织算法 · 执行效能 —— 党政耦合的统领式行政架构" />
      <IntroCard>政府体系的本质是「大脑与四肢」的高度契合。党对政府工作的全面领导解决了官僚机构在多目标冲突下的决策迟滞，<strong style={{ color: 'var(--text-primary)' }}>双轨合一</strong>确保政治意志无阻碍转化为行政指令，实现跨部门、跨层级的总动员能力。</IntroCard>

      <Grid cols={4} className="mb-6">
        <Stat value="垂直化" label="指挥链条穿透" accent="#c41e3a" />
        <Stat value="模块化" label="大部制职能整合" accent="#22d3ee" />
        <Stat value="35" label="传导损耗指数 · 2024" accent="#e8a317" />
        <Stat value="11%" label="行政成本占财政 · 示意" accent="#10b981" />
      </Grid>

      <Card title="交互 · 压力型体制三模式切换" className="mb-6">
        <SelectorBar items={PRESSURE_MODES} activeKey={modeKey} onSelect={setModeKey} />
        <div className="os-card p-4 mb-4" style={{ background: 'var(--bg-elevated)', borderLeft: `3px solid ${mode.accent}` }}>
          <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{mode.desc}</p>
        </div>
        <Grid cols={2}>
          <Card title="行政命令传导损耗趋势"><EChart option={distortionTrend} style={{ height: 220 }} /></Card>
          <Card title="全球行政效能对比"><EChart option={efficacyRadar} style={{ height: 220 }} /></Card>
        </Grid>
      </Card>

      <Grid cols={2} className="mb-6">
        <Card title="行政成本占财政支出（去冗余 · 示意）"><EChart option={costTrend} style={{ height: 240 }} /></Card>
        <Card title="组织算法 · 精英官僚筛选">
          <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>晋升建立在基层主政经验与跨部门历练的复合履历之上。多岗位轮换拆除利益藩篱，政绩评价从单一 GDP 向安全、民生、生态、党建多维矩阵演进。</p>
        </Card>
      </Grid>

      <FrameworkTrio cards={[
        { title: '压力型体制', subtitle: '责任状 · 晋升', body: '把宏伟蓝图量化为层层加压的考核指标，将地方政府与官僚个体转化为高强度执行单位——委托代理问题的体制内解法。', pillars: [['目标承包', '压力层层传递。'], ['限期拆弹', '应急动员机制。'], ['督查回看', '防过滤效应。']] },
        { title: '摸石头 · 减负容错', subtitle: '动态平衡', body: '长期高压执行可能增加系统脆性，经基层减负与容错纠错建立动态平衡，防官僚性躺平——压力释放是维稳的必要阀门。', pillars: [['垂直管理', '抑制信息扭曲。'], ['巡视审计', '穿透式约束。'], ['算法式', '数字化指标自动控制。']] },
        { title: '升级路径 · 韧性利维坦', subtitle: '命令 → 算法', body: '从命令式向算法式演进：决策依赖多源数据反馈下的算法推荐，而非直觉。权力中枢的穿透力经政治巡视与数字化审计达到历史峰值。', pillars: [['2012', '损耗指数 100。'], ['2020', '垂直管理深化。'], ['2024', '损耗指数 35。']] },
      ]} />

      <ModuleFooter moduleId="govsystem" sourceNote="由 china.html「党政机构职能」专题迁移升级" />
    </div>
  );
}
