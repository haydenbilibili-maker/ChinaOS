import React from 'react';
import { PageHeader, Card, Grid, Stat } from '../../app/ui.jsx';
import EChart from '../../lib/viz/EChart.jsx';

const fdiTrend = {
  grid: { left: 44, right: 16, top: 20, bottom: 24 },
  xAxis: { type: 'category', data: ['2013', '2016', '2019', '2022', '2024E'], axisLine: { lineStyle: { color: '#27324a' } } },
  yAxis: { type: 'value', splitLine: { lineStyle: { color: 'rgba(148,163,184,0.1)' } } },
  series: [{ type: 'line', smooth: true, symbol: 'circle', symbolSize: 6, data: [120, 145, 160, 185, 210], lineStyle: { color: '#c41e3a', width: 2 }, itemStyle: { color: '#c41e3a' }, areaStyle: { color: 'rgba(196,30,58,0.1)' } }],
};
const structurePie = {
  tooltip: { trigger: 'item' }, legend: { bottom: 0, textStyle: { color: '#93a1b5' } },
  series: [{ type: 'pie', radius: ['44%', '70%'], center: ['50%', '44%'], label: { color: '#93a1b5' }, data: [
    { value: 30, name: '能源', itemStyle: { color: '#c41e3a' } },
    { value: 24, name: '交通基建', itemStyle: { color: '#64748b' } },
    { value: 22, name: '数字丝路 DSR', itemStyle: { color: '#22d3ee' } },
    { value: 16, name: '绿色能源', itemStyle: { color: '#10b981' } },
    { value: 8, name: '民生小而美', itemStyle: { color: '#e8a317' } },
  ] }],
};
const regionPie = {
  tooltip: { trigger: 'item' }, legend: { bottom: 0, textStyle: { color: '#93a1b5' } },
  series: [{ type: 'pie', radius: ['44%', '70%'], center: ['50%', '44%'], label: { color: '#93a1b5' }, data: [
    { value: 34, name: '东南亚 ASEAN', itemStyle: { color: '#c41e3a' } },
    { value: 22, name: '中东/中亚', itemStyle: { color: '#e8a317' } },
    { value: 20, name: '非洲', itemStyle: { color: '#22d3ee' } },
    { value: 14, name: '欧洲(班列/第三方)', itemStyle: { color: '#10b981' } },
    { value: 10, name: '拉美', itemStyle: { color: '#64748b' } },
  ] }],
};

const SILK = [
  ['数字丝绸之路（DSR）', '以 5G、数据中心、跨境光缆与电商平台为载体，输出技术标准与数字基础设施，构筑长期规则黏性。'],
  ['绿色丝绸之路', '承诺停止新建境外煤电，转向光伏/风电/储能，回应国际环保压力并对接东道国能源转型。'],
  ['小而美民生项目', '饮水、医疗、农业与职业培训等低成本、见效快项目，分散风险、改善民心相通。'],
];

export default function Page() {
  return (
    <div>
      <PageHeader badge="BRI · 系统视角" title="一带一路 · 重塑欧亚的互联互通" subtitle="六廊六路多国多港 —— 以设施联通撬动产能与市场的外溢" />
      <Card className="mb-6"><p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>自 2013 年提出以来，倡议依托六廊六路多国多港骨架，将港口、铁路、电网与数字基建嵌入沿线经济体。它既是产能与资本的输出通道，也是人民币区域化与规则话语权的试验场；中欧班列累计开行已超 2,000 班次的节点城市持续扩容。</p></Card>
      <Grid cols={4} className="mb-6">
        <Stat value="150+ 国" label="签署合作国家" accent="#c41e3a" />
        <Stat value="1 万亿$+" label="累计投资承诺" />
        <Stat value="42 个" label="海外港口布局" accent="#22d3ee" />
        <Stat value="30+ 条" label="中欧班列线路" accent="#e8a317" />
      </Grid>
      <Grid cols={2} className="mb-6">
        <Card title="沿线直接投资走势（亿$ · 示意）"><EChart option={fdiTrend} style={{ height: 240 }} /></Card>
        <Card title="投资行业结构变化（2024E · 示意）"><EChart option={structurePie} style={{ height: 240 }} /></Card>
      </Grid>

      <Card title="从大基建走向小而美" className="mb-6">
        <p className="text-xs mb-4" style={{ color: 'var(--text-tertiary)' }}>债务可持续性压力下，投资重心由能源/交通等重资产，逐步转向数字、绿色与民生导向的小而美项目，结构趋于多元。</p>
        <Grid cols={3}>
          {SILK.map(([t, d]) => (
            <div key={t} style={{ borderLeft: '2px solid #22d3ee', paddingLeft: 10 }}>
              <div className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>{t}</div>
              <p className="text-[11px] mt-1 leading-relaxed" style={{ color: 'var(--text-tertiary)' }}>{d}</p>
            </div>
          ))}
        </Grid>
      </Card>

      <Grid cols={2} className="mb-6">
        <Card title="各区域投资占比（2024 · 示意）"><EChart option={regionPie} style={{ height: 240 }} /></Card>
        <Card title="区域重心与第三方市场">
          <p className="text-sm leading-relaxed mb-3" style={{ color: 'var(--text-secondary)' }}>东南亚已成为投资与产能合作的核心腹地，中东/中亚承接能源与互联互通，非洲侧重资源与基建，欧洲更多体现为班列通道与第三方市场合作。</p>
          <div className="space-y-2">
            <div style={{ borderLeft: '2px solid #c41e3a', paddingLeft: 10 }}><div className="text-xs font-semibold" style={{ color: 'var(--text-primary)' }}>ASEAN 枢纽</div><p className="text-[11px]" style={{ color: 'var(--text-tertiary)' }}>RCEP 与产业链转移叠加，使东南亚成为投资、本币结算与产能合作最密集的区域。</p></div>
            <div style={{ borderLeft: '2px solid #10b981', paddingLeft: 10 }}><div className="text-xs font-semibold" style={{ color: 'var(--text-primary)' }}>第三方市场合作</div><p className="text-[11px]" style={{ color: 'var(--text-tertiary)' }}>与发达经济体企业联合开发第三国项目，分担融资与政治风险。</p></div>
          </div>
        </Card>
      </Grid>

      <Card title="资金融通 · 谁为通道买单" className="mb-6">
        <p className="text-sm leading-relaxed mb-3" style={{ color: 'var(--text-secondary)' }}>丝路基金、政策性银行与多边机构构成融资骨架，但债务可持续性、汇率波动与 ESG 标准正成为再贷款和项目展期的硬约束。</p>
        <Grid cols={2}>
          <div style={{ borderLeft: '2px solid #e8a317', paddingLeft: 10 }}><div className="text-xs font-semibold" style={{ color: 'var(--text-primary)' }}>多边融资</div><p className="text-[11px]" style={{ color: 'var(--text-tertiary)' }}>亚投行(AIIB)等机构提供股权与联合贷款，分散单一主权风险。</p></div>
          <div style={{ borderLeft: '2px solid #22d3ee', paddingLeft: 10 }}><div className="text-xs font-semibold" style={{ color: 'var(--text-primary)' }}>本币结算扩围</div><p className="text-[11px]" style={{ color: 'var(--text-tertiary)' }}>推动人民币计价与双边货币互换，降低美元依赖与汇兑风险。</p></div>
        </Grid>
      </Card>

      <Card title="系统视角下的三重张力" className="mb-6">
        <Grid cols={3}>
          {[['1 · 债务与可持续性', '部分东道国偿债压力上升，倒逼项目从规模扩张转向质量与可回收性的再平衡。'],
            ['2 · 地缘对冲', '美欧推出全球基建倡议形成竞争，沿线国家在多方之间寻求议价空间与平衡。'],
            ['3 · 规则话语权', '技术标准、数字基建与本币结算的渗透，正重塑沿线长期规则依赖，影响远超单个工程。']].map(([t, d]) => (
            <div key={t}><div className="text-sm font-semibold" style={{ color: 'var(--china-red)' }}>{t}</div><p className="text-xs mt-1 leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{d}</p></div>
          ))}
        </Grid>
      </Card>
      <Card title="系统研判"><p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>一带一路已从基建驱动的扩张期，进入以风险管控、规则输出与民心相通为主线的精细化运营期；政策沟通与资金融通的制度安排将决定其下一阶段的韧性。</p></Card>
      <p className="text-xs mt-6" style={{ color: 'var(--text-tertiary)' }}>数据为公开信息综合整理与示意值，涉及 AIIB 等机构口径 · 由 tabs/bri.html 迁移</p>
    </div>
  );
}
