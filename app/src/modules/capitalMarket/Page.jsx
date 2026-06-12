import React, { useState, useMemo } from 'react';
import { PageHeader, Card, Grid, Stat } from '../../app/ui.jsx';
import EChart from '../../lib/viz/EChart.jsx';
import { IntroCard, SelectorBar, TimelineBar, FrameworkTrio, ModuleFooter } from '../shared/ModuleParadigm.jsx';
import { categoryX, valueY, GRID, LEGEND, stackedBarOpt, radarOpt } from '../shared/chartHelpers.js';

// ============================================================================
// 资本市场 · 耐心资本 / 注册制 / 中长期资金入市
// asOf 2026-06-11 · 公开资料示意
// ============================================================================

const AS_OF = '2026-06-11';

const CHANNELS = [
  {
    key: 'pension', label: '养老金', accent: '#c41e3a',
    scores: [75, 88, 70, 82, 65],
    thesis: '基本养老保险基金、企业年金与职业年金构成「耐心资本」基石——入市比例提升是资本市场长期稳定器的制度性安排。',
    points: ['基本养老保险基金委托投资扩容', '企业年金覆盖率提升与自动加入', '个人养老金账户税优激励', '全国社保基金战略储备'],
    lever: '人社部 + 证监会协同，投资比例与风控指引。',
  },
  {
    key: 'insurance', label: '保险资金', accent: '#e8a317',
    scores: [80, 85, 75, 78, 72],
    thesis: '保险资金久期长、负债稳定，是最天然的耐心资本——权益投资比例上限放宽与长期考核机制是关键制度变量。',
    points: ['保险资金权益投资比例上限调整', '长期考核与薪酬递延机制', '另类投资与基础设施 REITs', '偿付能力监管改革（偿二代）'],
    lever: '金融监管总局投资指引 + 偿付能力约束。',
  },
  {
    key: 'vc', label: '创投', accent: '#22d3ee',
    scores: [70, 65, 92, 60, 78],
    thesis: '创业投资与股权投资是科技创新与产业孵化的「毛细血管」——政府引导基金与社会资本「投早投小投硬科技」的政策导向明确。',
    points: ['政府引导基金让利与容错机制', '私募股权创投基金备案改革', '科创板/北交所退出通道', '国有创投考核周期延长'],
    lever: '发改委 + 证监会 + 地方政府引导基金。',
  },
  {
    key: 'retail', label: '居民财富', accent: '#10b981',
    scores: [55, 50, 65, 70, 60],
    thesis: '居民储蓄向投资转化是资本市场增量资金的长期来源——但散户结构与情绪驱动仍是波动放大器，「保护投资者」与「活跃市场」需精细平衡。',
    points: ['公募基金费率改革与投资者保护', '指数化投资与 ETF 扩容', '程序化交易监管与异常交易监控', '分红约束与减持规则硬化'],
    lever: '证监会投资者保护 + 交易所交易规则。',
  },
];

const PHASES = [
  { period: '2019–2021', title: '注册制改革', accent: '#64748b', desc: '科创板注册制试点，创业板改革，退市常态化启动。' },
  { period: '2022–2023', title: '活跃市场', accent: '#e8a317', desc: '「活跃资本市场」政策组合拳，印花税下调，中长期资金入市指引。' },
  { period: '2024–', title: '耐心资本', accent: '#c41e3a', desc: '政府工作报告「壮大耐心资本」，创投与养老金入市成为政策主线。' },
];

const DIMS = ['资金久期', '政策可撬动', '风险承受', '创新赋能', '市场稳定'];

export default function Page() {
  const [channel, setChannel] = useState('vc');
  const [phaseIdx, setPhaseIdx] = useState(2);
  const c = CHANNELS.find((x) => x.key === channel) ?? CHANNELS[0];

  const directFinanceOpt = stackedBarOpt({
    categories: ['2015', '2018', '2021', '2024', '2026E'],
    series: [
      { name: '直接融资（股+债）', data: [18, 22, 28, 32, 36], itemStyle: { color: '#c41e3a' } },
      { name: '间接融资（贷款）', data: [82, 78, 72, 68, 64], itemStyle: { color: '#27324a' } },
    ],
  });

  const marketCapOpt = useMemo(() => ({
    grid: GRID, tooltip: { trigger: 'axis' },
    legend: { ...LEGEND, top: 0, data: ['A股市值', '科创板+北交所'] },
    xAxis: categoryX(['2018', '2020', '2022', '2024', '2026E']),
    yAxis: valueY({ name: '万亿元' }),
    series: [
      { name: 'A股市值', type: 'line', smooth: true, data: [44, 79, 88, 72, 85], lineStyle: { color: '#64748b', width: 2 } },
      { name: '科创板+北交所', type: 'bar', barWidth: 18, data: [0, 8.5, 12, 15, 22], itemStyle: { color: c.accent, borderRadius: 3 } },
    ],
  }), [c]);

  const ipoOpt = useMemo(() => ({
    grid: GRID,
    xAxis: categoryX(['2019', '2020', '2021', '2022', '2023', '2024']),
    yAxis: valueY({ name: '家' }),
    series: [{
      type: 'bar', barWidth: 20,
      data: [203, 396, 542, 428, 313, 98],
      itemStyle: { color: channel === 'vc' ? '#22d3ee' : '#c41e3a', borderRadius: 3 },
    }],
  }), [channel]);

  return (
    <div>
      <PageHeader
        badge="政府工作报告 · 资本市场"
        title="资本市场 · 耐心资本壮大"
        subtitle="注册制 · 中长期资金 · 投早投小"
      />

      <IntroCard>
        资本市场改革主线从「融资功能」扩展到<strong style={{ color: 'var(--text-primary)' }}>投资功能与耐心资本培育</strong>。
        2024—2025 政府工作报告强调「壮大耐心资本」「增强资本市场内在稳定性」——养老金、保险资金、创投是三大制度性增量来源。
        数据截至 <span className="mono" style={{ color: 'var(--cyber-cyan)' }}>{AS_OF}</span>，公开资料示意，非投资建议。
      </IntroCard>

      <Grid cols={4} className="mb-6">
        <Stat value="~85万亿" label="A股总市值（示意）" accent="#c41e3a" />
        <Stat value="~36%" label="直接融资占比（2026E）" accent="#22d3ee" />
        <Stat value="~2.8万亿" label="政府引导基金规模" accent="#e8a317" />
        <Stat value={AS_OF} label="数据截至" accent="#8b5cf6" />
      </Grid>

      <Grid cols={2} className="mb-6">
        <Card title="直接融资 vs 间接融资结构（示意 %）"><EChart option={directFinanceOpt} style={{ height: 240 }} /></Card>
        <Card title="A股市值与硬科技板块"><EChart option={marketCapOpt} style={{ height: 240 }} /></Card>
      </Grid>

      <Card title="IPO 节奏（示意 · 家/年）" className="mb-6">
        <EChart option={ipoOpt} style={{ height: 200 }} />
        <p className="text-[11px] mt-2" style={{ color: 'var(--text-tertiary)' }}>
          注册制下 IPO 节奏随市场环境与监管取向动态调整——「活跃市场」与「防风险」之间的平衡是政策核心变量。
        </p>
      </Card>

      <Card title="政策演进 · 时间线" className="mb-6">
        <TimelineBar stages={PHASES} activeIdx={phaseIdx} onSelect={setPhaseIdx} />
      </Card>

      <Card title="交互 · 耐心资本渠道" className="mb-4">
        <SelectorBar items={CHANNELS} activeKey={channel} onSelect={setChannel} />
      </Card>

      <Grid cols={2} className="mb-6">
        <div className="os-card p-5" style={{ background: 'var(--bg-elevated)', borderLeft: `3px solid ${c.accent}` }}>
          <div className="text-[10px] mono uppercase mb-2" style={{ color: c.accent }}>{c.label} · 资本论点</div>
          <p className="text-sm leading-relaxed mb-3" style={{ color: 'var(--text-secondary)' }}>{c.thesis}</p>
          <div className="space-y-2 mb-3">
            {c.points.map((pt) => (
              <div key={pt} style={{ borderLeft: `2px solid ${c.accent}`, paddingLeft: 10 }}>
                <p className="text-[11px] leading-relaxed" style={{ color: 'var(--text-tertiary)' }}>{pt}</p>
              </div>
            ))}
          </div>
          <div className="text-xs" style={{ color: 'var(--text-tertiary)' }}>
            <span style={{ color: '#e8a317' }}>政策杠杆 · </span>{c.lever}
          </div>
        </div>
        <Card title={`${c.label} · 耐心资本五维评估`}>
          <EChart option={radarOpt(DIMS, c.scores, { name: c.label, color: c.accent })} style={{ height: 260 }} />
        </Card>
      </Grid>

      <Card title="十五五 · 指标 / 约束 / 路径" className="mb-6">
        <Grid cols={3}>
          <div style={{ borderLeft: '2px solid #22d3ee', paddingLeft: 10 }}>
            <div className="text-xs font-semibold mb-1" style={{ color: '#22d3ee' }}>核心指标</div>
            <p className="text-[11px] leading-relaxed" style={{ color: 'var(--text-tertiary)' }}>直接融资占比持续提升；中长期资金入市比例扩大；科创板/北交所硬科技企业上市活跃；创投「投早投小」规模增长。</p>
          </div>
          <div style={{ borderLeft: '2px solid #e8a317', paddingLeft: 10 }}>
            <div className="text-xs font-semibold mb-1" style={{ color: '#e8a317' }}>关键约束</div>
            <p className="text-[11px] leading-relaxed" style={{ color: 'var(--text-tertiary)' }}>散户结构与情绪驱动放大波动；房企与城投风险向资本市场传导；外资信心与地缘政治；退市与投资者保护的执行力度。</p>
          </div>
          <div style={{ borderLeft: '2px solid #10b981', paddingLeft: 10 }}>
            <div className="text-xs font-semibold mb-1" style={{ color: '#10b981' }}>推进路径</div>
            <p className="text-[11px] leading-relaxed" style={{ color: 'var(--text-tertiary)' }}>注册制深化 → 耐心资本入市指引 → 分红与退市硬化 → 投资者保护与市场稳定机制完善。</p>
          </div>
        </Grid>
      </Card>

      <FrameworkTrio cards={[
        { key: 'salt', title: '盐铁逻辑', subtitle: '资金阀门', body: '资本市场是国家战略的融资通道与居民财富的分配器——注册制、IPO 节奏、中长期资金入市比例都是国家可控的「阀门」。', pillars: [['通道', '融资功能。'], ['阀门', '节奏调控。'], ['分配', '财富效应。']] },
        { key: 'stone', title: '摸石头方法论', subtitle: '注册制试验', body: '科创板→创业板→全市场注册制——分板块灰度推进，在真实市场中测试退市、定价与投资者保护的制度边界。', pillars: [['灰度', '板块试点。'], ['验证', '退市常态化。'], ['推广', '全市场注册。']] },
        { key: 'path', title: '升级路径', subtitle: '短钱到长钱', body: '从散户短钱与情绪驱动，转向养老金、保险、创投等耐心资本主导——「壮大耐心资本」是资本市场内在稳定性的制度基础。', pillars: [['短钱', '散户情绪。'], ['长钱', '养老保险。'], ['稳定', '内在稳定性。']] },
      ]} />

      <Card title="系统结论">
        <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
          资本市场改革的深层逻辑是<strong style={{ color: 'var(--text-primary)' }}>从「融资市」向「投资市」转型</strong>——壮大耐心资本、硬化退市与分红、保护中小投资者，是「活跃市场」与「防风险」的同构要求。
          创投与硬科技上市是科技创新与产业孵化的金融接口，与十五五新质生产力主线深度耦合。
        </p>
      </Card>

      <ModuleFooter moduleId="capitalMarket" sourceNote={`数据截至 ${AS_OF} · 非投资建议`} />
    </div>
  );
}
