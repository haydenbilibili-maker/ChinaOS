import React, { useState } from 'react';
import { PageHeader, Card, Grid, Stat } from '../../app/ui.jsx';
import EChart from '../../lib/viz/EChart.jsx';
import { categoryX, valueY, GRID, radarOpt } from '../shared/chartHelpers.js';
import { IntroCard, SelectorBar, FrameworkTrio, ModuleFooter } from '../shared/ModuleParadigm.jsx';

const SECTORS = [
  { key: 'fish', label: '渔 · 渔业', accent: '#22d3ee', gopShare: 45, desc: '远洋捕捞与海水养殖规模全球第一，深蓝渔业与远洋基地持续拓展。产量 10,000m+ · 占比 95%。' },
  { key: 'ship', label: '船 · 造船', accent: '#c41e3a', gopShare: 18, desc: '三大指标（完工 50.2% / 新接 66.6% / 手持 55.0%）全面领先。LNG 船等高附加值船型国产化突破。' },
  { key: 'wind', label: '风 · 海上风电', accent: '#10b981', gopShare: 12, desc: '装机与新增装机居全球前列，沿海省份布局海上风电基地，对接双碳与能源压舱石。' },
  { key: 'route', label: '通 · 通道', accent: '#e8a317', gopShare: 15, desc: '能源与贸易海运依赖度高，通道安全为战略必争，与海军前沿存在、岛链突破紧密绑定。' },
];

const gopTrend = {
  grid: GRID,
  xAxis: categoryX(['2012', '2015', '2018', '2020', '2022', '2023']),
  yAxis: valueY({ axisLabel: { formatter: '{value} 万亿' } }),
  series: [{ type: 'line', smooth: true, symbol: 'circle', symbolSize: 6, data: [5.0, 6.5, 8.3, 8.0, 9.5, 9.9], lineStyle: { color: '#22d3ee', width: 2 }, areaStyle: { color: 'rgba(34,211,238,0.12)' } }],
};

const shipCompare = {
  grid: { left: 44, right: 16, top: 30, bottom: 24 },
  legend: { top: 0, textStyle: { color: '#93a1b5', fontSize: 10 } },
  xAxis: categoryX(['造船完工量', '新接订单量', '手持订单量']),
  yAxis: valueY({ max: 100, axisLabel: { formatter: '{value}%' } }),
  series: [
    { name: '中国', type: 'bar', data: [50.2, 66.6, 55.0], barWidth: 16, itemStyle: { color: '#c41e3a', borderRadius: 3 } },
    { name: '韩国', type: 'bar', data: [28.5, 25.5, 31.0], barWidth: 16, itemStyle: { color: '#22d3ee', borderRadius: 3 } },
    { name: '日本', type: 'bar', data: [15.0, 6.0, 12.0], barWidth: 16, itemStyle: { color: '#e8a317', borderRadius: 3 } },
  ],
};

const deepSeaRadar = radarOpt(['深潜技术', 'ROV/AUV', '海洋观测', '钻探开采', '深海生物', '装备制造'], [98, 85, 92, 78, 88, 95], { name: '深蓝产业能力', color: '#22d3ee' });

export default function Page() {
  const [sectorKey, setSectorKey] = useState('ship');
  const sector = SECTORS.find((s) => s.key === sectorKey) || SECTORS[1];

  const sectorPie = {
    tooltip: { trigger: 'item' },
    series: [{ type: 'pie', radius: ['44%', '68%'], center: ['50%', '50%'],
      data: SECTORS.map((s) => ({ value: s.gopShare, name: s.label, itemStyle: { color: s.key === sectorKey ? s.accent : `${s.accent}66` } })),
    }],
  };

  return (
    <div>
      <PageHeader badge="Marine Economy · 海权" title="海权与深蓝 · 海洋经济" subtitle="GOP · 造船 · EEZ · 海军前沿存在 · 岛链突破" />
      <IntroCard>中国拥有约 300 万平方公里主张管辖海域。海洋经济既关系就业与<strong style={{ color: 'var(--text-primary)' }}>能源压舱石</strong>，也关系海上通道与远海存在能力——海洋强国与经略海洋为长期战略方向，与台海、海外资源模块形成海权三角。</IntroCard>

      <Grid cols={4} className="mb-6">
        <Stat value="~10 万亿" label="海洋生产总值 GOP" accent="#22d3ee" />
        <Stat value="50.2%" label="造船全球份额" accent="#c41e3a" />
        <Stat value="300 万 km²" label="主张管辖海域" accent="#e8a317" />
        <Stat value={`${sector.gopShare}%`} label={`${sector.label}产业占比`} accent={sector.accent} />
      </Grid>

      <Card title="交互 · 海洋产业四支柱切换" className="mb-6">
        <SelectorBar items={SECTORS} activeKey={sectorKey} onSelect={setSectorKey} />
        <Grid cols={2}>
          <EChart option={sectorPie} style={{ height: 220 }} />
          <div className="os-card p-4" style={{ background: 'var(--bg-elevated)', borderLeft: `3px solid ${sector.accent}` }}>
            <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{sector.desc}</p>
          </div>
        </Grid>
      </Card>

      <Grid cols={2} className="mb-6">
        <Card title="海洋生产总值 GOP 趋势 · 万亿元"><EChart option={gopTrend} style={{ height: 250 }} /></Card>
        <Card title="造船三大指标全球份额（2023 · %）"><EChart option={shipCompare} style={{ height: 250 }} /></Card>
      </Grid>

      <Grid cols={2} className="mb-6">
        <Card title="深蓝产业能力雷达"><EChart option={deepSeaRadar} style={{ height: 260 }} /></Card>
        <Card title="通道安全与蓝碳">
          <p className="text-sm leading-relaxed mb-3" style={{ color: 'var(--text-secondary)' }}>海上通道安全与海军前沿存在能力紧密绑定。蓝碳（红树林、海草床、盐沼）纳入双碳与生态补偿体系，固碳评估与碳汇交易机制起步。</p>
          <Grid cols={2}>
            <Stat value="马六甲" label="能源贸易命脉通道" accent="#c41e3a" />
            <Stat value="蓝碳 85" label="生态监测指数 · 示意" accent="#10b981" />
          </Grid>
        </Card>
      </Grid>

      <FrameworkTrio cards={[
        { title: '海权逻辑', subtitle: '经略海洋', body: '海洋经济不仅是 GDP 板块，更是海权物理载体：造船能力 = 运力主权，通道安全 = 贸易生命线，深蓝技术 = 资源开发权。', pillars: [['造船第一', '三大指标全球过半。'], ['通道绑定', '能源与贸易海运依赖。'], ['远海存在', '护航与保障点网络。']] },
        { title: '岛链突破接口', subtitle: '第一岛链 · 台海', body: '海洋经济与台海局势、海外资源形成三角：突破岛链封锁需要海军前沿存在 + 民用航运冗余 + 资源通道备份。', pillars: [['台海', '地缘重力与通道交汇。'], ['资源', '亚丁湾护航链路。'], ['贸易', 'RCEP 海运流量。']] },
        { title: '升级路径 · 深蓝 2024', subtitle: '渔船风通', body: '从近海养殖到深蓝勘探，从散货船到 LNG 高附加值船型，海洋产业升级与双碳、能源安全多重目标叠加。', pillars: [['渔业', '远洋基地拓展。'], ['造船', 'LNG ~40% 接单。'], ['风电', '沿海绿电基地。']] },
      ]} />

      <ModuleFooter moduleId="marine" sourceNote="由 china.html「海洋经济」专题迁移升级" />
    </div>
  );
}
