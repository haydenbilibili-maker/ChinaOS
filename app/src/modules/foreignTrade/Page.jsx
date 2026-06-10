import React from 'react';
import { PageHeader, Card, Grid, Stat } from '../../app/ui.jsx';
import EChart from '../../lib/viz/EChart.jsx';

const tradeTrend = {
  grid: { left: 48, right: 16, top: 20, bottom: 24 },
  xAxis: { type: 'category', data: ['2015', '2017', '2019', '2021', '2023', '2024'], axisLine: { lineStyle: { color: '#27324a' } } },
  yAxis: { type: 'value', splitLine: { lineStyle: { color: 'rgba(148,163,184,0.1)' } } },
  series: [{ type: 'line', smooth: true, symbol: 'none', data: [24.6, 27.8, 31.5, 39.1, 41.8, 43.9], lineStyle: { color: '#22d3ee', width: 2 }, areaStyle: { color: 'rgba(34,211,238,0.1)' } }],
};
const partnerPie = {
  tooltip: { trigger: 'item' }, legend: { bottom: 0, textStyle: { color: '#93a1b5' } },
  series: [{ type: 'pie', radius: ['44%', '70%'], center: ['50%', '44%'], label: { color: '#93a1b5' }, data: [
    { value: 15.5, name: '东盟 ASEAN', itemStyle: { color: '#c41e3a' } },
    { value: 13, name: '欧盟', itemStyle: { color: '#22d3ee' } },
    { value: 11, name: '美国', itemStyle: { color: '#e8a317' } },
    { value: 12, name: '日韩', itemStyle: { color: '#64748b' } },
    { value: 48.5, name: '一带一路/新兴', itemStyle: { color: '#10b981' } },
  ] }],
};
const newThreeBar = {
  grid: { left: 60, right: 24, top: 16, bottom: 24 },
  xAxis: { type: 'category', data: ['2019', '2021', '2023', '2024'], axisLine: { lineStyle: { color: '#27324a' } } },
  yAxis: { type: 'value', axisLabel: { formatter: '{value}%' }, splitLine: { lineStyle: { color: 'rgba(148,163,184,0.1)' } } },
  series: [
    { name: '新三样', type: 'line', smooth: true, data: [3, 5, 9, 12], lineStyle: { color: '#10b981' }, areaStyle: { color: 'rgba(16,185,129,0.1)' } },
    { name: '传统劳密', type: 'line', smooth: true, data: [22, 19, 16, 14], lineStyle: { color: '#64748b' } },
  ],
  legend: { data: ['新三样', '传统劳密'], textStyle: { color: '#93a1b5' }, top: 0 },
};

const NEW3 = [
  ['电动汽车 (EV)', '从整车到三电的完整产业链支撑出口爆发，自主品牌在欧洲/东南亚/拉美快速渗透。', '出口增速 70%+ · 主销欧洲/东南亚'],
  ['锂离子电池', '动力与储能双轮驱动，正负极/电解液/电芯全链条优势，巩固全球供应主导。', '全球份额 ~60% · 主销欧美及亚洲'],
  ['光伏产品', '硅料/硅片/电池片/组件，全球产能集中度超 80%，规模效应压低成本。', '产能 N 成以上 · 覆盖全球 200+ 市场'],
];

export default function Page() {
  return (
    <div>
      <PageHeader badge="Foreign Trade" title="对外贸易 · 结构升级与韧性重构" subtitle="从规模扩张到质量跃迁 —— 出口篮子向高附加值迁移、伙伴多元化、供应链韧性增强" />
      <Card className="mb-6"><p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>外需放缓与地缘摩擦双重压力下，外贸已从单纯追求规模转向追求质量。一般贸易占进出口比重已升至约 58%，新业态与高技术产品占比同步抬升。</p></Card>
      <Grid cols={4} className="mb-6">
        <Stat value="~42 万亿" label="进出口总额 (2023)" accent="#22d3ee" />
        <Stat value="14%" label="占全球货物出口" />
        <Stat value="60 万家+" label="有进出口实绩企业" accent="#e8a317" />
        <Stat value="#1" label="120 多国最大伙伴" accent="#c41e3a" />
      </Grid>
      <Grid cols={2} className="mb-6">
        <Card title="货物贸易进出口走势（万亿 · 示意）"><EChart option={tradeTrend} style={{ height: 240 }} /></Card>
        <Card title="主要贸易伙伴占比结构（2024E · 示意）"><EChart option={partnerPie} style={{ height: 240 }} /></Card>
      </Grid>

      <Card title="出口新动能 ·「新三样」" className="mb-6">
        <p className="text-xs mb-4" style={{ color: 'var(--text-tertiary)' }}>电动汽车、锂电池、光伏三类绿色产品，2023 年合计出口首次突破万亿，成为出口结构升级的标志性引擎。</p>
        <Grid cols={3}>
          {NEW3.map(([t, d, tag]) => (
            <div key={t} className="os-card p-4" style={{ background: 'var(--bg-elevated)' }}>
              <div className="text-sm font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>{t}</div>
              <p className="text-xs leading-relaxed mb-2" style={{ color: 'var(--text-tertiary)' }}>{d}</p>
              <span className="text-[10px] mono" style={{ color: 'var(--cyber-cyan)' }}>{tag}</span>
            </div>
          ))}
        </Grid>
      </Card>

      <Grid cols={2} className="mb-6">
        <Card title="传统劳密 vs 新三样出口占比（% · 示意）"><EChart option={newThreeBar} style={{ height: 240 }} /></Card>
        <Card title="贸易伙伴多元化 · 东盟登顶与 RCEP">
          <p className="text-sm leading-relaxed mb-3" style={{ color: 'var(--text-secondary)' }}>东盟已超越传统市场成为第一大贸易伙伴；对美欧占比下降，对一带一路、中东、拉美与非洲份额上升。RCEP 降低区域内关税与原产地门槛，重塑产业链分工。</p>
          <div className="space-y-2">
            <div style={{ borderLeft: '2px solid #c41e3a', paddingLeft: 10 }}><div className="text-xs font-semibold" style={{ color: 'var(--text-primary)' }}>RCEP 红利释放</div><p className="text-[11px]" style={{ color: 'var(--text-tertiary)' }}>区域累积原产地规则下，中间品贸易与区域内分工加速深化。</p></div>
            <div style={{ borderLeft: '2px solid #10b981', paddingLeft: 10 }}><div className="text-xs font-semibold" style={{ color: 'var(--text-primary)' }}>市场结构再平衡</div><p className="text-[11px]" style={{ color: 'var(--text-tertiary)' }}>对单一市场依赖度下降，对新兴市场出口合计占比已接近甚至超过 50%。</p></div>
          </div>
        </Card>
      </Grid>

      <Card title="外贸新业态 · 跨境电商与海外仓" className="mb-6">
        <p className="text-sm leading-relaxed mb-3" style={{ color: 'var(--text-secondary)' }}>以「平台出海+独立站+海外仓」为支撑的跨境电商，改写中小制造商触达终端的路径。Temu、Shein、TikTok Shop 带动小单快返与全托管模式，压缩中间环节。</p>
        <Grid cols={2}>
          <Stat value="~7.1%" label="跨境电商占外贸比重" accent="#e8a317" />
          <Stat value="2,500+ 个" label="海外仓数量" accent="#22d3ee" />
        </Grid>
      </Card>

      <Card title="供应链韧性与风险对冲" className="mb-6">
        <Grid cols={3}>
          {[['1 · 一般贸易占比提升', '加工贸易占比回落，本土完整产业链使更多增加值留在境内，降低对外部中间品依赖。'],
            ['2 · 产能与市场双重分散', '部分制造环节向东南亚、墨西哥外溢，叠加伙伴多元化，缓冲单一市场关税与脱钩冲击。'],
            ['3 · 制度型开放配套', 'FTZ、跨境电商综试区与海外仓网络，为新业态提供通关、退税与本地履约的制度基础设施。']].map(([t, d]) => (
            <div key={t}><div className="text-sm font-semibold" style={{ color: 'var(--china-red)' }}>{t}</div><p className="text-xs mt-1 leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{d}</p></div>
          ))}
        </Grid>
      </Card>
      <Card title="系统视角"><p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>外贸竞争已从单一商品价格，转向产业链完整度、要素配置效率与抗冲击能力的综合较量；结构升级与韧性建设，决定能否在外部不确定性中守住份额并向价值链上游攀升。</p></Card>
      <p className="text-xs mt-6" style={{ color: 'var(--text-tertiary)' }}>数据为公开信息综合及示意值，部分参考海关总署、WTO、UNCTAD 口径 · 由 tabs/foreignTrade.html 迁移</p>
    </div>
  );
}
