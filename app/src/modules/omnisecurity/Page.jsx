import React, { useState } from 'react';
import { PageHeader, Card, Grid, Stat } from '../../app/ui.jsx';
import EChart from '../../lib/viz/EChart.jsx';
import { categoryX, valueY, GRID, donutOpt, radarOpt } from '../shared/chartHelpers.js';
import { IntroCard, SelectorBar, FrameworkTrio, ModuleFooter } from '../shared/ModuleParadigm.jsx';

const PILLARS = [
  { key: 'grain', label: '粮食', accent: '#10b981', selfRate: [100, 95, 15, 30], spr: null, cyber: null,
    desc: '18 亿亩耕地红线 + 藏粮于地/于技。口粮绝对安全，大豆/食用油对外依存是结构性短板。' },
  { key: 'energy', label: '能源', accent: '#e8a317', selfRate: null, spr: [60, 75, 90, 110], cyber: null,
    desc: 'SPR 扩容至 90+ 天，非化石装机 50%+。「电代油」消解对马六甲海峡的过度依赖——能源压舱石逻辑。' },
  { key: 'cyber', label: '网络', accent: '#22d3ee', selfRate: null, spr: null, cyber: [42, 28, 18, 12],
    desc: '语义防火墙 + 自主骨干网 + 跨境数据审查。主权存在于数据流向与认知空间，对冲境外 APT 与认知渗透。' },
  { key: 'chain', label: '供应链', accent: '#c41e3a', selfRate: null, spr: null, cyber: null,
    desc: '关键节点国产替代、产业链备份与库存韧性。极端制裁下的生存确定性——收支倒挂的物理解。' },
];

const grainChart = (rates) => ({
  grid: GRID,
  xAxis: categoryX(['口粮', '谷物', '大豆', '食用油']),
  yAxis: valueY({ max: 110, axisLabel: { formatter: '{value}%' } }),
  series: [{ type: 'bar', data: rates || [100, 95, 15, 30], barWidth: 28,
    itemStyle: { color: (p) => ['#10b981', '#10b981', '#c41e3a', '#e8a317'][p.dataIndex], borderRadius: [3, 3, 0, 0] },
    label: { show: true, position: 'top', formatter: '{c}%', color: '#93a1b5' } }],
});

const sprChart = (days) => ({
  grid: GRID,
  xAxis: categoryX(['2019', '2021', '2023', '2025E']),
  yAxis: valueY({ name: '天', nameTextStyle: { color: '#5b6a82' } }),
  series: [{ type: 'line', smooth: true, data: days || [60, 75, 90, 110], lineStyle: { color: '#e8a317', width: 2 }, areaStyle: { color: 'rgba(232,163,23,0.1)' } }],
});

const cyberDonut = (data) => donutOpt([
  { value: data?.[0] ?? 42, name: '境外 APT', itemStyle: { color: '#c41e3a' } },
  { value: data?.[1] ?? 28, name: '勒索/木马', itemStyle: { color: '#e8a317' } },
  { value: data?.[2] ?? 18, name: '认知渗透', itemStyle: { color: '#22d3ee' } },
  { value: data?.[3] ?? 12, name: '内部风险', itemStyle: { color: '#64748b' } },
]);

const resilienceRadar = radarOpt(['粮食', '能源', '网络', '供应链', '金融', '认知'], [98, 85, 92, 78, 88, 90], { name: '全域冗余', color: '#c41e3a' });

export default function Page() {
  const [pillarKey, setPillarKey] = useState('grain');
  const p = PILLARS.find((x) => x.key === pillarKey) || PILLARS[0];

  return (
    <div>
      <PageHeader badge="Omni-Security · 大安全观" title="全域安全与主权盾牌" subtitle="粮食 · 能源 · 网络 · 供应链 —— 消灭不可控随机变量，构建极致确定性" />
      <IntroCard>大安全观的本质是<strong style={{ color: 'var(--text-primary)' }}>生存冗余最大化</strong>：在粮食、能源、技术、认知四个维度同步加固，把整个国家转化为高韧性闭环系统。现实主义博弈中，这种确定性是顶住极端外部压力、维持战略定力的最核心资产——安全是所有算法运行的前提条件。</IntroCard>

      <Grid cols={4} className="mb-6">
        <Stat value="100%+" label="口粮自给率" accent="#10b981" />
        <Stat value="90+ 天" label="能源 SPR 冗余" accent="#e8a317" />
        <Stat value="99.9%" label="核心攻击拦截率 · 示意" accent="#22d3ee" />
        <Stat value="四维加固" label="粮能网链同步" accent="#c41e3a" />
      </Grid>

      <Card title="交互 · 四大支柱切换 · 图表联动" className="mb-6">
        <SelectorBar items={PILLARS} activeKey={pillarKey} onSelect={setPillarKey} />
        <div className="os-card p-4 mb-4" style={{ background: 'var(--bg-elevated)', borderLeft: `3px solid ${p.accent}` }}>
          <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{p.desc}</p>
        </div>
        <Grid cols={2}>
          {pillarKey === 'grain' && <><Card title="粮食自给率结构（%）"><EChart option={grainChart(p.selfRate)} style={{ height: 240 }} /></Card><Card title="全域冗余雷达"><EChart option={resilienceRadar} style={{ height: 240 }} /></Card></>}
          {pillarKey === 'energy' && <><Card title="SPR 冗余天数演进"><EChart option={sprChart(p.spr)} style={{ height: 240 }} /></Card><Card title="全域冗余雷达"><EChart option={resilienceRadar} style={{ height: 240 }} /></Card></>}
          {pillarKey === 'cyber' && <><Card title="攻击来源分布"><EChart option={cyberDonut(p.cyber)} style={{ height: 240 }} /></Card><Card title="语义防火墙 · 赛博反馈"><p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>跨境数据审查 + 根服务器副本 + 政务系统国产化，构成数字护城河。认知渗透与 APT 攻击在<strong style={{ color: 'var(--cyber-cyan)' }}>赛博反馈</strong>闭环中被持续迭代封堵。</p></Card></>}
          {pillarKey === 'chain' && <><Card title="供应链韧性雷达"><EChart option={radarOpt(['芯片', '材料', '装备', '软件', '物流', '金融'], [65, 72, 80, 58, 85, 75], { color: '#c41e3a' })} style={{ height: 240 }} /></Card><Card title="国产替代进度"><p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>关键节点备份 + 库存韧性 + 多源采购，确保极端制裁下 90 天+ 生存确定性。与半导体、关键材料模块形成交叉验证。</p></Card></>}
        </Grid>
      </Card>

      <Grid cols={2} className="mb-6">
        <Card title="粮食自给率（% · 示意）"><EChart option={grainChart()} style={{ height: 220 }} /></Card>
        <Card title="能源 SPR 天数（示意）"><EChart option={sprChart()} style={{ height: 220 }} /></Card>
      </Grid>

      <FrameworkTrio cards={[
        { title: '压舱石逻辑', subtitle: '粮能双锚', body: '口粮绝对安全 + 能源 SPR 构成物理生存底线。大豆/原油对外依存是结构性收支倒挂，以多元化进口、战略储备与非化石转型对冲。', pillars: [['18 亿亩', '耕地红线是不可谈判的物理约束。'], ['SPR', '90+ 天储备是极端断供的缓冲带。'], ['种业', '种子是农业底层代码，自主化是长期攻坚。']] },
        { title: '语义防火墙', subtitle: '网络 · 认知', body: '主权不仅在地理疆界，更在语义空间与数据流向。自主骨干网与跨境审查构成数字护城河，对冲外部认知渗透与信息战。', pillars: [['APT 防御', '国家级防火墙与态势感知。'], ['政务国产化', '核心系统去外部依赖。'], ['叙事一致', '语义空间的国家可控性。']] },
        { title: '升级路径 · 四维闭环', subtitle: '2014 → 统筹发展与安全', body: '从单点安全到总体国家安全观，再到统筹发展与安全。四维同步加固，消除不可控随机变量。', pillars: [['2014', '总体国家安全观确立。'], ['2020', '双循环 + 供应链备份。'], ['2024', '新质生产力与安全冗余并重。']] },
      ]} />

      <Card title="调研结论 · 构建极致确定性">
        <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>全域安全战略的本质是消灭一切不可控的随机变量。在粮食、能源、技术、认知四个维度同步加固，把整个国家转化为高冗余、高韧性的闭环系统。</p>
        <div className="flex flex-wrap gap-3 mt-4 text-xs mono" style={{ color: 'var(--text-tertiary)' }}>
          <span>{'// SURVIVAL_REDUNDANCY: MAXIMIZED'}</span><span>{'// SOVEREIGN_WALL: REINFORCED'}</span>
        </div>
      </Card>

      <ModuleFooter moduleId="omnisecurity" sourceNote="由 china.html「大安全观」专题迁移升级" />
    </div>
  );
}
