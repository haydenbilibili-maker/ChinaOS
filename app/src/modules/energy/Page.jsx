import React, { useState } from 'react';
import { PageHeader, Card, Grid, Stat } from '../../app/ui.jsx';
import EChart from '../../lib/viz/EChart.jsx';
import { categoryX, valueY, GRID, donutOpt, radarOpt } from '../shared/chartHelpers.js';
import { IntroCard, SelectorBar, FrameworkTrio, ModuleFooter } from '../shared/ModuleParadigm.jsx';

const TRANSITIONS = [
  { key: 'coal', label: '煤炭压舱', accent: '#64748b', share: 52, desc: '煤炭占比由 64% 降至 52%，从「主力电源」转向「调节电源」，为绿电突围腾挪系统空间——能源压舱石的角色转换。' },
  { key: 'renew', label: '风光绿电', accent: '#10b981', share: 18.5, desc: '非化石能源消费比 ~18.5%，可再生能源装机占比 50%+。饱和式风光装机是应对马六甲困境的物理方案。' },
  { key: 'nuclear', label: '核电基荷', accent: '#8b5cf6', share: 5, desc: '华龙一号四代核电提供稳定基荷，与风光随机性形成「源网荷储」互补。' },
  { key: 'grid', label: '特高压网', accent: '#22d3ee', share: null, desc: '特高压西电东送是西部绿电秒级输送至东部负荷中心的物理大动脉，消解能源供需地理错配。' },
];

const mixShift = {
  tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
  legend: { bottom: 0, textStyle: { color: '#93a1b5', fontSize: 10 }, itemWidth: 12 },
  grid: GRID,
  xAxis: categoryX(['2015', '2018', '2021', '2024']),
  yAxis: valueY({ max: 100, axisLabel: { formatter: '{value}%' } }),
  series: [
    { name: '煤炭占比', type: 'bar', stack: 'total', data: [64, 59, 56, 52], itemStyle: { color: '#c41e3a' }, barWidth: 26 },
    { name: '油气及其他', type: 'bar', stack: 'total', data: [24, 27, 28, 29.5], itemStyle: { color: '#22d3ee' } },
    { name: '非化石能源', type: 'bar', stack: 'total', data: [12, 14, 16, 18.5], itemStyle: { color: '#10b981' } },
  ],
};

const carbonMarket = {
  tooltip: { trigger: 'axis' },
  legend: { bottom: 0, textStyle: { color: '#93a1b5', fontSize: 10 } },
  grid: GRID,
  xAxis: categoryX(['2021', '2022', '2023', '2024']),
  yAxis: valueY(),
  series: [
    { name: '交易均价（元/吨）', type: 'line', smooth: true, data: [45, 58, 72, 92], lineStyle: { color: '#10b981', width: 2 }, areaStyle: { color: 'rgba(16,185,129,0.15)' } },
    { name: '累计成交量（指数）', type: 'bar', data: [30, 45, 85, 120], barWidth: 18, itemStyle: { color: '#22d3ee', opacity: 0.55, borderRadius: 3 } },
  ],
};

export default function Page() {
  const [transKey, setTransKey] = useState('renew');
  const t = TRANSITIONS.find((x) => x.key === transKey) || TRANSITIONS[1];

  const uhvRadar = radarOpt(['跨区输电', '数字化调度', '绿电消纳', '网损控制', '应急恢复'], [95, 88, 92, 85, 98], { name: '电网能级', color: '#e8a317' });

  return (
    <div>
      <PageHeader badge="Energy · 双碳" title="一次能源结构 · 绿色转型" subtitle="能源压舱石 · 对外依存 · 双碳 · 新型电力系统" />
      <IntroCard>现实主义逻辑下，能源转型是应对<strong style={{ color: 'var(--text-primary)' }}>马六甲困境</strong>的物理方案：通过饱和式风电、光伏装机，把能源生产从依赖进口化石燃料转向利用本土气候资源。挑战在于用「源网荷储」一体化，化解可再生能源随机性与电网稳定性的矛盾。</IntroCard>

      <Grid cols={4} className="mb-6">
        <Stat value="~72%" label="原油对外依存 · 攻坚点" accent="#c41e3a" />
        <Stat value="50.4%" label="可再生能源装机占比" accent="#10b981" />
        <Stat value="~18.5%" label="非化石能源消费比" accent="#22d3ee" />
        <Stat value={t.share ? `${t.share}%` : 'UHV'} label={`${t.label} · 切换`} accent={t.accent} />
      </Grid>

      <Card title="交互 · 能源转型四模块切换" className="mb-6">
        <SelectorBar items={TRANSITIONS} activeKey={transKey} onSelect={setTransKey} />
        <div className="os-card p-4 mb-4" style={{ background: 'var(--bg-elevated)', borderLeft: `3px solid ${t.accent}` }}>
          <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{t.desc}</p>
        </div>
        <Grid cols={2}>
          <Card title="一次能源消费结构迁徙（%）"><EChart option={mixShift} style={{ height: 220 }} /></Card>
          <Card title="特高压电网能级评估"><EChart option={uhvRadar} style={{ height: 220 }} /></Card>
        </Grid>
      </Card>

      <Grid cols={2} className="mb-6">
        <Card title="碳排放权交易趋势"><EChart option={carbonMarket} style={{ height: 260 }} /></Card>
        <Card title="碳交易 · 财务理性">
          <p className="text-sm leading-relaxed mb-4" style={{ color: 'var(--text-secondary)' }}>当「排碳有价、减碳有偿」成为财务报表的刚性约束，工业转型将从行政命令驱动转向内生的经济利益驱动。碳价从 45 元升至 90+ 元。</p>
          <Grid cols={2}>
            <Stat value="90+ 元" label="当前碳价基准（CEA）" accent="#e8a317" />
            <Stat value="50 亿吨+" label="覆盖 CO₂ 排放量" accent="#10b981" />
          </Grid>
        </Card>
      </Grid>

      <FrameworkTrio cards={[
        { title: '能源压舱石', subtitle: '煤转调 · 油依存', body: '原油对外依存 ~72% 仍是重点攻坚风险点。煤电压舱石从主力转向调节，为绿电突围腾挪空间——压舱石不是消失，而是换角色。', pillars: [['煤炭 52%', '从主力到调节。'], ['SPR 90+ 天', '油气战略储备。'], ['电代油', '消解通道依赖。']] },
        { title: '摸石头 · 双碳路径', subtitle: '源网荷储', body: '双碳不是道德叙事，是彻底摆脱油气进口依赖、规避地缘断供的唯一物理路径。风光随机性靠特高压 + 储能 + 核电基荷对冲。', pillars: [['RENEWABLES_FIRST', '饱和式风光装机。'], ['UHV 西电东送', '地理错配消解。'], ['碳市场', '市场定价减排。']] },
        { title: '升级路径 · 新型电力系统', subtitle: '2025 → 2060', body: '未来竞争不仅是能源量的竞争，更是全生命周期效率与电网调度算法的竞争——多能互补构建极高抗冲击性的现代化能源体系。', pillars: [['2025', '非化石 20% 跨越。'], ['2030', '新型电力系统成型。'], ['2060', '碳中和物理路径。']] },
      ]} />

      <ModuleFooter moduleId="energy" sourceNote="由 china.html「能源」专题迁移升级" />
    </div>
  );
}
