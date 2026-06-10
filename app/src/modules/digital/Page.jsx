import React from 'react';
import { PageHeader, Card, Grid, Stat } from '../../app/ui.jsx';
import EChart from '../../lib/viz/EChart.jsx';

const shareTrend = {
  grid: { left: 44, right: 16, top: 20, bottom: 24 },
  xAxis: { type: 'category', data: ['2019', '2020', '2021', '2022', '2023', '2024'], axisLine: { lineStyle: { color: '#27324a' } } },
  yAxis: { type: 'value', axisLabel: { formatter: '{value}%' }, splitLine: { lineStyle: { color: 'rgba(148,163,184,0.1)' } } },
  series: [{ type: 'line', smooth: true, symbol: 'none', data: [36.2, 38.6, 39.8, 41.0, 41.5, 42.8], lineStyle: { color: '#22d3ee', width: 2 }, areaStyle: { color: 'rgba(34,211,238,0.1)' } }],
};
const computeTrend = {
  grid: { left: 48, right: 16, top: 20, bottom: 24 },
  xAxis: { type: 'category', data: ['2020', '2022', '2024', '2026E', '2028E', '2030E'], axisLine: { lineStyle: { color: '#27324a' } } },
  yAxis: { type: 'value', name: 'EFLOPS', nameTextStyle: { color: '#5b6a82' }, splitLine: { lineStyle: { color: 'rgba(148,163,184,0.1)' } } },
  series: [{ type: 'bar', data: [100, 150, 230, 360, 520, 700], barWidth: 24, itemStyle: { color: '#c41e3a', borderRadius: [3, 3, 0, 0] } }],
};
const govRadar = {
  radar: { indicator: [{ name: '反垄断', max: 100 }, { name: '数据安全', max: 100 }, { name: '算法监管', max: 100 }, { name: '金融合规', max: 100 }, { name: '用工保障', max: 100 }], axisName: { color: '#93a1b5' }, splitLine: { lineStyle: { color: 'rgba(148,163,184,0.15)' } }, splitArea: { show: false } },
  series: [{ type: 'radar', data: [{ value: [95, 80, 85, 90, 75], name: '平台治理', lineStyle: { color: '#c41e3a' }, areaStyle: { color: 'rgba(196,30,58,0.12)' } }] }],
};

const TRACKS = [
  ['电子商务', '数字消费基本盘，进入存量竞争；动能从交易规模转向供应链效率、跨境出海与下沉市场，C2M 反向重构制造端。', '15.4 万亿 · 渗透率 27.6%'],
  ['金融科技', '移动支付与数字金融基础设施成熟，重心转向合规化与普惠化。', '常态化监管'],
  ['云计算与算力', '公有云与智算并进，承接 AI 训练与产业数字化的算力需求。', '东数西算底座'],
  ['人工智能 (AI)', '大模型与行业落地驱动，从消费互联网转向产业纵深与实体融合。', '行业大模型'],
];

export default function Page() {
  return (
    <div>
      <PageHeader badge="Digital Economy" title="数字经济 · 数实融合" subtitle="从规模扩张到深度融合的结构转型 —— 总量破 50 万亿、占 GDP 逼近 40%" />
      <Card className="mb-6"><p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>数字经济正从消费互联网的流量红利，转向产业数字化与数据要素驱动的实体融合；占 GDP 比重的边际变化比总量更值得关注。</p></Card>
      <Grid cols={4} className="mb-6">
        <Stat value="53.9 T" label="数字经济规模 (元)" accent="#22d3ee" />
        <Stat value="41.5%" label="GDP 占比" accent="#c41e3a" />
        <Stat value="10.9 亿" label="网民规模" />
        <Stat value="18.2%" label="核心产业增加值占比" accent="#e8a317" />
      </Grid>
      <Grid cols={2} className="mb-6">
        <Card title="数字经济占 GDP 比重（% · 示意）"><EChart option={shareTrend} style={{ height: 240 }} /></Card>
        <Card title="平台经济治理维度（示意）"><EChart option={govRadar} style={{ height: 240 }} /></Card>
      </Grid>

      <Card title="数字产业化的四大支柱赛道" className="mb-6">
        <p className="text-xs mb-4" style={{ color: 'var(--text-tertiary)' }}>从电商到云计算与 AI，核心产业重心正从规模扩张转向技术纵深与产业渗透。</p>
        <Grid cols={2}>
          {TRACKS.map(([t, d, tag]) => (
            <div key={t} className="os-card p-4" style={{ background: 'var(--bg-elevated)' }}>
              <div className="text-sm font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>{t}</div>
              <p className="text-xs leading-relaxed mb-2" style={{ color: 'var(--text-tertiary)' }}>{d}</p>
              <span className="text-[10px] mono" style={{ color: 'var(--cyber-cyan)' }}>{tag}</span>
            </div>
          ))}
        </Grid>
      </Card>

      <Card title="平台经济 · 从无序扩张到常态化监管" className="mb-6">
        <p className="text-sm leading-relaxed mb-3" style={{ color: 'var(--text-secondary)' }}>监管从专项整治转向常态化、制度化；基调从遏制资本无序扩张，转向支持平台在规范前提下发挥引擎作用，以确定性预期重塑生态。</p>
        <Grid cols={3}>
          {[['反垄断与公平竞争', '遏制二选一、大数据杀熟，重建可竞争的市场秩序。'],
            ['数据安全与跨境流动', '围绕数据分类分级与出境评估，划定平台数据合规边界。'],
            ['红绿灯 · 规范中促发展', '以红绿灯机制明确边界，引导平台投向硬科技与实体经济。']].map(([t, d]) => (
            <div key={t} style={{ borderLeft: '2px solid #c41e3a', paddingLeft: 10 }}><div className="text-xs font-semibold" style={{ color: 'var(--text-primary)' }}>{t}</div><p className="text-[11px] mt-1" style={{ color: 'var(--text-tertiary)' }}>{d}</p></div>
          ))}
        </Grid>
      </Card>

      <Grid cols={2}>
        <Card title="算力规模增长趋势（EFLOPS · 示意）"><EChart option={computeTrend} style={{ height: 240 }} /></Card>
        <Card title="下一阶段 · 算力底座与数据要素">
          <p className="text-sm leading-relaxed mb-3" style={{ color: 'var(--text-secondary)' }}>未来十年的增长引擎由数字基础设施与数据要素市场化共同支撑。</p>
          <div className="space-y-2">
            <div style={{ borderLeft: '2px solid #22d3ee', paddingLeft: 10 }}><div className="text-xs font-semibold" style={{ color: 'var(--text-primary)' }}>东数西算与智算</div><p className="text-[11px]" style={{ color: 'var(--text-tertiary)' }}>八大枢纽节点统筹算力供需，智算中心成为大模型训练的核心基础设施。</p></div>
            <div style={{ borderLeft: '2px solid #10b981', paddingLeft: 10 }}><div className="text-xs font-semibold" style={{ color: 'var(--text-primary)' }}>数据要素</div><p className="text-[11px]" style={{ color: 'var(--text-tertiary)' }}>通过确权、流通与入表推动数据资产化，赋能千行百业的实体融合。</p></div>
          </div>
        </Card>
      </Grid>
      <p className="text-xs mt-6" style={{ color: 'var(--text-tertiary)' }}>数据为公开信息综合整理与示意值，部分含获客成本(CAC)等口径差异 · 由 tabs/digital.html 迁移</p>
    </div>
  );
}
