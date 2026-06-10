import React, { useState } from 'react';
import { PageHeader, Card, Grid, Stat } from '../../app/ui.jsx';
import EChart from '../../lib/viz/EChart.jsx';
import { categoryX, valueY, GRID, radarOpt } from '../shared/chartHelpers.js';
import { IntroCard, SelectorBar, TimelineBar, FrameworkTrio, ModuleFooter } from '../shared/ModuleParadigm.jsx';

const POLICY_STAGES = [
  { period: '2018', title: '31 条 · 预期修复', accent: '#64748b', desc: '针对民营企业家信心下滑，出台 31 条支持政策，强调「两个毫不动摇」，但执行落差仍存。' },
  { period: '2020–22', title: '平台整治 · 规范与发展', accent: '#e8a317', desc: '平台经济反垄断与数据合规整治，民营资本在扩张领域遭遇结构性收缩，预期管理成为政策核心。' },
  { period: '2023–24', title: '促进法 · 法律确权', accent: '#22d3ee', desc: '《民营经济促进法》立法推进，把平等保护与公平竞争从文件上升为法律义务，降低制度不确定性与可逆性。' },
  { period: '2024–今', title: '准入放宽 · 信心修复', accent: '#10b981', desc: '破除市场准入壁垒、落实公平竞争审查、账款清欠专项行动——从政策善意到可执行的法律与个案。' },
];

const tradeShare = {
  grid: GRID,
  xAxis: categoryX(['2019', '2021', '2023', '2024']),
  yAxis: valueY({ axisLabel: { formatter: '{value}%' } }),
  series: [{ type: 'line', smooth: true, symbol: 'circle', symbolSize: 6, data: [43, 48, 53, 55], lineStyle: { color: '#c41e3a', width: 2 }, areaStyle: { color: 'rgba(196,30,58,0.1)' } }],
};

const contribBar = {
  grid: { left: 90, right: 24, top: 16, bottom: 24 },
  xAxis: valueY({ max: 100 }),
  yAxis: categoryX(['企业数量', '城镇就业', '技术创新', 'GDP', '税收']),
  series: [{ type: 'bar', data: [90, 80, 70, 60, 50], barWidth: 15, itemStyle: { color: '#c41e3a', borderRadius: 3 }, label: { show: true, position: 'right', formatter: '{c}%+', color: '#93a1b5' } }],
};

const SECTORS = [
  { key: 'tech', label: '科技创新', accent: '#22d3ee', share: 70 },
  { key: 'service', label: '服务业', accent: '#10b981', share: 85 },
  { key: 'mfg', label: '制造业', accent: '#c41e3a', share: 55 },
];

export default function Page() {
  const [stageIdx, setStageIdx] = useState(POLICY_STAGES.length - 1);
  const [sectorKey, setSectorKey] = useState('tech');
  const sector = SECTORS.find((s) => s.key === sectorKey) || SECTORS[0];

  const envRadar = radarOpt(['市场准入', '产权保护', '融资可得', '公平竞争', '政策稳定', '账款清欠'], [72, 78, 65, 70, 68, 60], { name: '营商环境', color: '#10b981' });

  return (
    <div>
      <PageHeader badge="Private Economy · 56789" title="民营经济与市场主体贡献" subtitle="民营经济促进法 · 56789 · 产权保护 —— 从「两个毫不动摇」到法律确权" />
      <IntroCard>民营经济贡献了约<strong style={{ color: 'var(--text-primary)' }}>五成税收、六成 GDP、七成技术创新、八成城镇就业、九成市场主体</strong>。其活力取决于稳定预期、公平准入与产权保护三项制度供给是否到位——「五六七八九」描述的是贡献度，而非话语权。</IntroCard>

      <Grid cols={5} className="mb-6">
        <Stat value="50%+" label="税收贡献" accent="#c41e3a" />
        <Stat value="60%+" label="GDP 贡献" />
        <Stat value="70%+" label="技术创新" accent="#22d3ee" />
        <Stat value="80%+" label="城镇就业" accent="#e8a317" />
        <Stat value="90%+" label="市场主体" accent="#10b981" />
      </Grid>

      <Card title="交互① · 政策阶段时间线" className="mb-6">
        <TimelineBar stages={POLICY_STAGES} activeIdx={stageIdx} onSelect={setStageIdx} />
      </Card>

      <Grid cols={2} className="mb-6">
        <Card title="民企进出口占比走势（% · 示意）"><EChart option={tradeShare} style={{ height: 240 }} /></Card>
        <Card title="56789 贡献条形（示意）"><EChart option={contribBar} style={{ height: 240 }} /></Card>
      </Grid>

      <Card title="交互② · 行业渗透切换" className="mb-6">
        <SelectorBar items={SECTORS} activeKey={sectorKey} onSelect={setSectorKey} />
        <Grid cols={2}>
          <EChart option={envRadar} style={{ height: 260 }} />
          <div className="os-card p-4" style={{ background: 'var(--bg-elevated)', borderLeft: `3px solid ${sector.accent}` }}>
            <Stat value={`${sector.share}%+`} label={`${sector.label}民营渗透 · 示意`} accent={sector.accent} />
            <p className="text-sm leading-relaxed mt-3" style={{ color: 'var(--text-secondary)' }}>专精特新、「小巨人」与单项冠军绝大多数为民营。但命脉行业（电网、油气、金融）仍由国资控盘——与国有资本模块的国进民退边界形成对照。</p>
          </div>
        </Grid>
      </Card>

      <FrameworkTrio cards={[
        { title: '两个毫不动摇', subtitle: '制度预期 · 盐铁边界', body: '民营经济的真实地位，最终取决于法律执行与公平竞争能否从条文落到个案。命脉国有、市场竞争民营——盐铁逻辑在当代的分界线。', pillars: [['56789', '贡献度与话语权倒挂。'], ['促进法', '平等保护法律化。'], ['准入', '负面清单与公平竞争审查。']] },
        { title: '摸石头 · 预期管理', subtitle: '31 条 → 促进法', body: '从政策善意到法律确权：信心比黄金更重要。平台整治后的预期修复，是 2024 以来政策重心的核心抓手。', pillars: [['31 条', '2018 预期修复尝试。'], ['整治期', '反垄断与数据合规。'], ['促进法', '降低制度可逆性。']] },
        { title: '升级路径 · 链主协同', subtitle: '国资 ↔ 民营', body: '央企链主 + 民营专精特新构成产业蜂群。民营承担多数研发投入，国资承担战略冗余——二者是互补而非零和。', pillars: [['链主带动', '央企下游万企协同。'], ['小巨人', '分层培育体系。'], ['500 强', '头部民企治理透视。']] },
      ]} />

      <ModuleFooter moduleId="private" sourceNote="由 tabs/private.html 迁移升级" />
    </div>
  );
}
