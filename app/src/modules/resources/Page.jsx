import React, { useState } from 'react';
import { PageHeader, Card, Grid, Stat } from '../../app/ui.jsx';
import EChart from '../../lib/viz/EChart.jsx';
import { categoryX, valueY, GRID, radarOpt } from '../shared/chartHelpers.js';
import { IntroCard, SelectorBar, FrameworkTrio, ModuleFooter } from '../shared/ModuleParadigm.jsx';

const REGIONS = [
  { key: 'africa', label: '非洲', accent: '#c41e3a', weight: 30, minerals: '钴/铁/铜', desc: '刚果(金)钴矿、几内亚西芒杜铁矿构成电池金属与钢铁的非洲锚点。政局波动是主要风险变量。' },
  { key: 'sea', label: '东南亚', accent: '#e8a317', weight: 35, minerals: '镍/铝', desc: '印尼镍铁园区、菲律宾/马来铝土矿。与中国冶炼产能形成「资源—加工」一体化闭环。' },
  { key: 'latam', label: '拉美', accent: '#22d3ee', weight: 25, minerals: '锂/铜/铁', desc: '锂三角（智利/阿根廷/玻利维亚）与秘鲁铜矿。长协 + 股权对冲价格武器化风险。' },
  { key: 'central', label: '中亚', accent: '#10b981', weight: 10, minerals: '油气/铀', desc: '中亚管道与铀资源，陆路通道对冲马六甲单一依赖。' },
];

const dependencyRadar = radarOpt(['铁矿石', '原油', '锂金属', '精炼铜', '天然气', '大豆'], [82, 72, 65, 78, 45, 85], { name: '对外依存度 (%)', color: '#e8a317' });

const mineralTreemap = (region) => ({
  series: [{
    type: 'treemap', breadcrumb: { show: false }, roam: false, nodeClick: false,
    label: { show: true, fontSize: 11, color: '#f8fafc' },
    data: REGIONS.map((r) => ({
      name: `${r.label} (${r.minerals}) ${r.weight}%`,
      value: r.key === region.key ? r.weight + 15 : r.weight,
      itemStyle: { color: r.accent, opacity: r.key === region.key ? 1 : 0.45 },
    })),
  }],
});

const resilienceTrend = {
  grid: GRID,
  legend: { bottom: 0, textStyle: { color: '#93a1b5', fontSize: 10 } },
  xAxis: categoryX(['2016', '2018', '2020', '2022', '2024']),
  yAxis: valueY({ max: 100 }),
  series: [
    { name: '纯进口依赖指数', type: 'line', smooth: true, data: [80, 75, 60, 50, 40], lineStyle: { color: '#93a1b5', type: 'dashed' }, itemStyle: { color: '#93a1b5' } },
    { name: '海外权益+冶炼覆盖', type: 'line', smooth: true, data: [10, 25, 40, 70, 95], lineStyle: { color: '#e8a317', width: 3 }, itemStyle: { color: '#e8a317' }, areaStyle: { color: 'rgba(232,163,23,0.08)' } },
  ],
};

const assetBar = {
  grid: GRID,
  xAxis: categoryX(['资源获取', '初级加工', '物流枢纽', '安保投入']),
  yAxis: valueY({ max: 100 }),
  series: [{ type: 'bar', data: [95, 78, 62, 45], barWidth: 26,
    itemStyle: { color: (p) => ['#c41e3a', '#e8a317', '#22d3ee', '#10b981'][p.dataIndex], borderRadius: 3 },
    label: { show: true, position: 'top', formatter: '{c}%', color: '#93a1b5', fontSize: 10 } }],
};

export default function Page() {
  const [regionKey, setRegionKey] = useState('africa');
  const region = REGIONS.find((r) => r.key === regionKey) || REGIONS[0];

  return (
    <div>
      <PageHeader badge="Overseas Resources · 权益矿" title="海外战略资源 · 权益矿与运输安全" subtitle="锂钴镍 · 铁矿 · 权益矿布局 · 航道安全" />
      <IntroCard>资源主权是工业文明的生命线。中国通过「海外权益矿」战略将生产关系延伸至全球资源腹地——这不仅为平抑大宗商品价格波动，更是在地缘极端封锁时，凭借对矿山的<strong style={{ color: 'var(--text-primary)' }}>决策主权</strong>确保工业机器的最低限度运转。收支倒挂的物理解：进口依存 vs 权益+冶炼覆盖。</IntroCard>

      <Grid cols={4} className="mb-6">
        <Stat value="80%+" label="铁矿石对外依存 · 风险点" accent="#c41e3a" />
        <Stat value="1.8 万亿" label="海外资源累计投资" accent="#e8a317" />
        <Stat value="~75%" label="关键矿产加工全球占比" accent="#22d3ee" />
        <Stat value={`${region.weight}%`} label={`${region.label}区域权重`} accent={region.accent} />
      </Grid>

      <Card title="交互 · 资源区域切换 · 布局图谱联动" className="mb-6">
        <SelectorBar items={REGIONS} activeKey={regionKey} onSelect={setRegionKey} />
        <Grid cols={2}>
          <EChart option={mineralTreemap(region)} style={{ height: 240 }} />
          <div className="os-card p-4" style={{ background: 'var(--bg-elevated)', borderLeft: `3px solid ${region.accent}` }}>
            <div className="text-sm font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>{region.label} · {region.minerals}</div>
            <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{region.desc}</p>
          </div>
        </Grid>
      </Card>

      <Grid cols={2} className="mb-6">
        <Card title="资源进口依赖度矩阵（% · 示意）"><EChart option={dependencyRadar} style={{ height: 240 }} /></Card>
        <Card title="海外基建与资源项目地域集中度"><EChart option={assetBar} style={{ height: 240 }} /></Card>
      </Grid>

      <Card title="供应链韧性冗余 · 权益+冶炼覆盖（示意）" className="mb-6">
        <EChart option={resilienceTrend} style={{ height: 220 }} />
        <p className="text-xs mt-3" style={{ color: 'var(--text-tertiary)' }}>纯进口依赖指数下行，海外权益与冶炼加工覆盖升至 95——定价与加工环节的掌控力替代了单纯的买卖关系。</p>
      </Card>

      <FrameworkTrio cards={[
        { title: '权益矿逻辑', subtitle: 'Upstream Sovereignty', body: '从「单纯买卖」向「深度嵌合」转变：股权 + 长协 + 本土冶炼构成三重冗余。无法防御的资产本质上是他人的财富——护航与卫星感知是下半场。', pillars: [['非洲锚点', '钴铁铜 + 西芒杜铁矿。'], ['东南亚闭环', '镍铁园区 + 冶炼一体化。'], ['拉美对冲', '锂三角长协议锁价。']] },
        { title: '航道安全 · 摸石头', subtitle: '亚丁湾 · 吉布提', body: '马六甲—印度洋—亚丁湾是铁矿与油气运输命脉。远海护航 + 海外保障点 + 安保协作，把物理安全嵌入资源资产负债表。', pillars: [['护航编队', '非战争军事行动频率提升。'], ['风险算法', '政局/债务/社区动态评分。'], ['一带一路', '陆海通道备份。']] },
        { title: '升级路径 · 重力场', subtitle: '非对称相互依赖', body: '目标：构建以中国需求和技术为核心的「资源重力场」。外部断供时，本土加工权使全球制造业面临不可承受的崩溃成本。', pillars: [['2010s', '纯进口为主。'], ['2020s', '权益矿 + 冶炼覆盖。'], ['2030s', '定价权筹码化。']] },
      ]} />

      <Card title="调研结论 · 构建重力场制衡"><p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>通过在印尼建设镍铁园区、在几内亚开发西芒杜铁矿，正在全球制造以中国需求和技术为核心的「资源重力场」。最终目标是构建「非对称相互依赖」：外部断供时，中国掌控的初级加工权将使全球制造业面临不可承受的崩溃成本。</p></Card>

      <ModuleFooter moduleId="resources" sourceNote="由 china.html「海外资源」专题迁移升级" />
    </div>
  );
}
