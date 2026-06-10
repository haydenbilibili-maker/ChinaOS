import React from 'react';
import { PageHeader, Card, Grid, Stat } from '../../app/ui.jsx';
import EChart from '../../lib/viz/EChart.jsx';

const grainChart = {
  grid: { left: 40, right: 16, top: 20, bottom: 24 },
  xAxis: { type: 'category', data: ['口粮', '谷物', '大豆', '食用油'], axisLine: { lineStyle: { color: '#27324a' } } },
  yAxis: { type: 'value', axisLabel: { formatter: '{value}%' }, max: 110, splitLine: { lineStyle: { color: 'rgba(148,163,184,0.1)' } } },
  series: [{ type: 'bar', data: [100, 95, 15, 30], barWidth: 30, itemStyle: { color: (p) => ['#10b981', '#10b981', '#c41e3a', '#e8a317'][p.dataIndex], borderRadius: [3, 3, 0, 0] }, label: { show: true, position: 'top', formatter: '{c}%', color: '#93a1b5' } }],
};

const energyChart = {
  grid: { left: 40, right: 16, top: 16, bottom: 24 },
  xAxis: { type: 'category', data: ['2019', '2021', '2023', '2025E'], axisLine: { lineStyle: { color: '#27324a' } } },
  yAxis: { type: 'value', name: '天', nameTextStyle: { color: '#5b6a82' }, splitLine: { lineStyle: { color: 'rgba(148,163,184,0.1)' } } },
  series: [{ type: 'line', smooth: true, symbol: 'none', data: [60, 75, 90, 110], lineStyle: { color: '#e8a317', width: 2 }, areaStyle: { color: 'rgba(232,163,23,0.1)' } }],
};

const cyberChart = {
  tooltip: { trigger: 'item' },
  legend: { bottom: 0, textStyle: { color: '#93a1b5' } },
  series: [{ type: 'pie', radius: ['44%', '70%'], center: ['50%', '44%'], label: { color: '#93a1b5' }, data: [
    { value: 42, name: '境外 APT', itemStyle: { color: '#c41e3a' } },
    { value: 28, name: '勒索/木马', itemStyle: { color: '#e8a317' } },
    { value: 18, name: '认知渗透', itemStyle: { color: '#22d3ee' } },
    { value: 12, name: '内部风险', itemStyle: { color: '#27324a' } },
  ] }],
};

const PILLARS = [
  ['粮食主权 · 18 亿亩物理红线', '粮食是主权生存的「第一耗材」。以 18 亿亩耕地红线 + 藏粮于地/于技构建终极防线，重心在种业自主化——确保农业底层代码（种子）不被外部锁定。'],
  ['能源战略备份', '原油战略储备持续扩容（SPR 90+ 天），非化石能源占比 50%+；以「电代油」从根本上消解对海上能源通道的过度依赖。'],
  ['网络主权 · 语义防火墙', '主权不仅在地理疆界，更在语义空间与数据流向。自主骨干网 + 根服务器副本 + 跨境数据审查构建「数字护城河」，对冲外部认知渗透。'],
  ['供应链生存冗余', '关键节点国产替代、产业链备份与库存韧性，确保极端制裁下的生存确定性。'],
];

export default function Page() {
  return (
    <div>
      <PageHeader badge="Omni-Security" title="全域安全与主权盾牌" subtitle="粮食 · 能源 · 网络 · 供应链 —— 消灭一切不可控的随机变量，构建极致确定性" />
      <Grid cols={4} className="mb-6">
        <Stat value="100%+" label="口粮自给率" accent="#e8a317" />
        <Stat value="90+ 天" label="能源冗余 (SPR)" />
        <Stat value="99.9%" label="网络攻击拦截率" accent="#22d3ee" />
        <Stat value="HIGH" label="产业链国产替代" accent="#c41e3a" />
      </Grid>

      <Grid cols={2} className="mb-6">
        <Card title="粮食自给率结构（% · 示意）"><EChart option={grainChart} style={{ height: 240 }} /></Card>
        <Card title="能源战略储备冗余天数（示意）"><EChart option={energyChart} style={{ height: 240 }} /></Card>
      </Grid>

      <Card title="网络主权 · 攻击来源与防御响应分布（示意）" className="mb-6">
        <Grid cols={2}>
          <EChart option={cyberChart} style={{ height: 240 }} />
          <div>
            <p className="text-sm leading-relaxed mb-4" style={{ color: 'var(--text-secondary)' }}>
              信息化战争时代，主权存在于语义空间与数据流向中。「语义防火墙」确保国家叙事一致性，对冲外部信息的认知渗透。
            </p>
            <Grid cols={2}>
              <Stat value="100%" label="核心政务系统国产化预期" accent="#e8a317" />
              <Stat value="TByte 级" label="国家级防火墙吞吐" accent="#22d3ee" />
            </Grid>
          </div>
        </Grid>
      </Card>

      <Grid cols={2} className="mb-6">
        {PILLARS.map(([t, d]) => (
          <Card key={t} title={t}><p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{d}</p></Card>
        ))}
      </Grid>

      <Card title="调研结论 · 构建极致的确定性">
        <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
          全域安全战略的本质是「消灭一切不可控的随机变量」。在粮食、能源、技术、认知四个维度同步加固，把整个国家转化为高冗余、高韧性的闭环系统。现实主义博弈中，这种「生存确定性」是顶住极端外部压力、维持战略定力的最核心资产。
        </p>
        <div className="flex flex-wrap gap-3 mt-4 text-xs mono" style={{ color: 'var(--text-tertiary)' }}>
          <span>// SURVIVAL_REDUNDANCY: MAXIMIZED</span><span>// SOVEREIGN_WALL: REINFORCED</span><span>// STATUS: SECURE</span>
        </div>
      </Card>

      <p className="text-xs mt-6" style={{ color: 'var(--text-tertiary)' }}>「安全是所有算法运行的前提条件」· 数据来源：公开安全与战略研报，数值为示意 · 由 china.html「大安全观」专题迁移</p>
    </div>
  );
}
