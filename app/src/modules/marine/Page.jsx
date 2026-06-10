import React from 'react';
import { PageHeader, Card, Grid, Stat } from '../../app/ui.jsx';
import EChart from '../../lib/viz/EChart.jsx';

const gopTrend = {
  grid: { left: 44, right: 16, top: 20, bottom: 24 },
  xAxis: { type: 'category', data: ['2012', '2015', '2018', '2020', '2022', '2023'], axisLine: { lineStyle: { color: '#27324a' } }, axisLabel: { color: '#93a1b5' } },
  yAxis: { type: 'value', axisLabel: { formatter: '{value} 万亿', color: '#93a1b5' }, splitLine: { lineStyle: { color: 'rgba(148,163,184,0.1)' } } },
  series: [{ type: 'line', smooth: true, symbol: 'circle', symbolSize: 6, data: [5.0, 6.5, 8.3, 8.0, 9.5, 9.9], lineStyle: { color: '#22d3ee', width: 2 }, itemStyle: { color: '#22d3ee' }, areaStyle: { color: 'rgba(34,211,238,0.12)' } }],
};
const shipCompare = {
  grid: { left: 44, right: 16, top: 30, bottom: 24 },
  legend: { top: 0, textStyle: { color: '#93a1b5', fontSize: 10 }, itemWidth: 12, itemHeight: 8 },
  xAxis: { type: 'category', data: ['造船完工量', '新接订单量', '手持订单量'], axisLine: { lineStyle: { color: '#27324a' } }, axisLabel: { color: '#93a1b5' } },
  yAxis: { type: 'value', max: 100, axisLabel: { formatter: '{value}%', color: '#93a1b5' }, splitLine: { lineStyle: { color: 'rgba(148,163,184,0.1)' } } },
  series: [
    { name: '中国', type: 'bar', data: [50.2, 66.6, 55.0], barWidth: 16, itemStyle: { color: '#c41e3a', borderRadius: 3 } },
    { name: '韩国', type: 'bar', data: [28.5, 25.5, 31.0], barWidth: 16, itemStyle: { color: '#22d3ee', borderRadius: 3 } },
    { name: '日本', type: 'bar', data: [15.0, 6.0, 12.0], barWidth: 16, itemStyle: { color: '#e8a317', borderRadius: 3 } },
  ],
};
const deepSeaRadar = {
  radar: { indicator: [{ name: '深潜技术', max: 100 }, { name: 'ROV/AUV 无人潜航器', max: 100 }, { name: '海洋观测（浮/潜标）', max: 100 }, { name: '钻探开采', max: 100 }, { name: '深海生物勘探', max: 100 }, { name: '装备制造', max: 100 }], axisName: { color: '#93a1b5', fontSize: 10 }, splitLine: { lineStyle: { color: 'rgba(148,163,184,0.15)' } }, axisLine: { lineStyle: { color: '#27324a' } }, splitArea: { show: false } },
  series: [{ type: 'radar', data: [{ value: [98, 85, 92, 78, 88, 95], name: '深蓝产业能力', lineStyle: { color: '#22d3ee' }, itemStyle: { color: '#22d3ee' }, areaStyle: { color: 'rgba(34,211,238,0.12)' } }] }],
};

export default function Page() {
  return (
    <div>
      <PageHeader badge="Marine Economy · Deep Sea 2024" title="海权与深蓝 · 海洋经济" subtitle="GOP · 造船 · EEZ · 海军前沿存在" />
      <Card className="mb-6"><p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>中国拥有约 300 万平方公里主张管辖海域，海洋渔业、造船、海上风电与海洋油气等产业规模居全球前列。海洋经济既关系就业与能源安全，也关系海上通道与远海存在能力——海洋强国与经略海洋为长期战略方向。</p></Card>
      <Grid cols={4} className="mb-6">
        <Stat value="~10 万亿" label="海洋生产总值 GOP（2023）" accent="#22d3ee" />
        <Stat value="~8%" label="占 GDP 比" />
        <Stat value="10,909m" label="造船完工量" accent="#c41e3a" />
        <Stat value="50.2%" label="全球份额（载重吨）" accent="#e8a317" />
      </Grid>
      <Grid cols={2} className="mb-6">
        <Card title="海洋生产总值（GOP）趋势 · 万亿元"><EChart option={gopTrend} style={{ height: 250 }} /></Card>
        <Card title="造船三大指标全球份额对比（2023 · %）"><EChart option={shipCompare} style={{ height: 250 }} /></Card>
      </Grid>

      <Card title="海洋产业三大支柱" className="mb-6">
        <p className="text-sm leading-relaxed mb-4" style={{ color: 'var(--text-secondary)' }}>渔业、造船与海上风电构成海洋经济主体，深水油气与蓝色碳汇为新兴赛道。</p>
        <Grid cols={3}>
          {[['渔 · 海洋渔业', '远洋捕捞与海水养殖规模全球第一，深蓝渔业与远洋基地持续拓展。产量 10,000m+ · 占比 95%。', '#22d3ee'],
            ['船 · 船舶制造', '造船完工量、新接订单与手持订单三大指标多年居全球第一。完工量 3,658m · 份额约 50%。', '#c41e3a'],
            ['风 · 海上风电', '装机与新增装机居全球前列，沿海省份竞相布局海上风电基地，对接双碳目标。', '#10b981']].map(([t, d, c]) => (
            <div key={t} style={{ borderLeft: `2px solid ${c}`, paddingLeft: 10 }}><div className="text-xs font-semibold" style={{ color: 'var(--text-primary)' }}>{t}</div><p className="text-[11px] mt-1 leading-relaxed" style={{ color: 'var(--text-tertiary)' }}>{d}</p></div>
          ))}
        </Grid>
      </Card>

      <Grid cols={2} className="mb-6">
        <Card title="深蓝产业能力雷达（2024）"><EChart option={deepSeaRadar} style={{ height: 280 }} /></Card>
        <Card title="海洋产业构成与通道安全">
          <p className="text-sm leading-relaxed mb-3" style={{ color: 'var(--text-secondary)' }}>海洋产业构成（占比）：海洋渔业 45% · 海洋油气业 18% · 海洋交通运输业 15% · 海洋旅游业 12% · 海洋工程业 10%。</p>
          <div className="space-y-2">
            <div style={{ borderLeft: '2px solid #c41e3a', paddingLeft: 10 }}><div className="text-xs font-semibold" style={{ color: 'var(--text-primary)' }}>通 · 海上通道安全</div><p className="text-[11px]" style={{ color: 'var(--text-tertiary)' }}>能源与贸易海运依赖度高，通道安全为战略必争，与海军前沿存在能力紧密绑定。</p></div>
            <div style={{ borderLeft: '2px solid #10b981', paddingLeft: 10 }}><div className="text-xs font-semibold" style={{ color: 'var(--text-primary)' }}>蓝 · 蓝色碳汇</div><p className="text-[11px]" style={{ color: 'var(--text-tertiary)' }}>红树林修复（92）、海草床保护（75）、盐沼湿地（80）等蓝碳纳入双碳与生态补偿体系，固碳评估（85）与生态监测（88）领先，碳汇交易机制（70）起步。</p></div>
          </div>
        </Card>
      </Grid>

      <Card title="造船份额与 LNG 船突破" className="mb-6">
        <p className="text-sm leading-relaxed mb-4" style={{ color: 'var(--text-secondary)' }}>中国造船完工量、新接订单与手持订单全球份额过半，LNG 船等高附加值船型接单与交付能力快速提升。</p>
        <Grid cols={2}>
          {[['全球份额 > 50%', '三大指标（完工 50.2% / 新接 66.6% / 手持 55.0%）全面领先韩国与日本。', '#22d3ee'],
            ['LNG 接单占比 ~40%', 'LNG 船与大型集装箱船等高附加值船型实现国产化突破，订单结构持续升级。', '#e8a317']].map(([t, d, c]) => (
            <div key={t} style={{ borderLeft: `2px solid ${c}`, paddingLeft: 10 }}><div className="text-xs font-semibold" style={{ color: 'var(--text-primary)' }}>{t}</div><p className="text-[11px] mt-1 leading-relaxed" style={{ color: 'var(--text-tertiary)' }}>{d}</p></div>
          ))}
        </Grid>
      </Card>

      <Card title="调研结论" className="mb-6">
        <Grid cols={3}>
          {[['1 · 海洋经济压舱石', '海洋生产总值占 GDP 约 8%，沿海省份 30 个以上将海洋列为支柱产业。'],
            ['2 · 造船全球第一', '三大指标份额过半，LNG 与大型集装箱船等高附加值船型国产化突破。'],
            ['3 · 深蓝与通道安全', '经略海洋与海上通道安全、远海存在能力紧密绑定，为能源与贸易韧性支撑。']].map(([t, d]) => (
            <div key={t}><div className="text-sm font-semibold" style={{ color: 'var(--china-red)' }}>{t}</div><p className="text-xs mt-1 leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{d}</p></div>
          ))}
        </Grid>
      </Card>
      <Card title="终评"><p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>海洋强国战略与双碳、能源安全、产业链安全多重目标叠加，海洋经济为长期战略板块。</p></Card>
      <p className="text-xs mt-6" style={{ color: 'var(--text-tertiary)' }}>数据来源：自然资源部、统计公报及克拉克森（Clarkson）等 · 由 china.html「海洋经济」专题迁移</p>
    </div>
  );
}
