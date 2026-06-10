import React, { useState, useMemo } from 'react';
import { PageHeader, Card, Grid, Stat } from '../../app/ui.jsx';
import EChart from '../../lib/viz/EChart.jsx';
import { categoryX, valueY, GRID, radarOpt } from '../shared/chartHelpers.js';
import { IntroCard, SelectorBar, TimelineBar, FrameworkTrio, ModuleFooter } from '../shared/ModuleParadigm.jsx';

const CHANNELS = [
  { key: 'cips', label: 'CIPS 清算', accent: '#22d3ee', share: 4.6, desc: '人民币跨境支付系统覆盖 114 国/地区，提供独立于 SWIFT 的清算通道——极端制裁场景下的主权备份协议。' },
  { key: 'swap', label: '货币互换', accent: '#10b981', share: 3.2, desc: '与 40+ 央行签署双边本币互换协议，降低美元中间货币依赖，构建「非对称货币引力场」。' },
  { key: 'trade', label: '本币结算', accent: '#e8a317', share: 5.8, desc: '石油、大宗商品本币结算试点扩大，把贸易规模优势转译为货币话语权——从贸易货币向储备货币渐进。' },
  { key: 'ecny', label: 'e-CNY 跨境', accent: '#c41e3a', share: 1.2, desc: '数字人民币 mBridge 多边试验，为跨境支付「最后一百米」提供可编程主权货币方案。' },
];

const PHASES = [
  { period: '2009–2015', title: '跨境贸易结算', accent: '#64748b', desc: '人民币纳入跨境贸易结算试点，离岸市场起步，份额低于 2%。' },
  { period: '2016–2020', title: 'SDR 入篮', accent: '#e8a317', desc: '2016 年纳入 IMF SDR 篮子，全球支付份额突破 2%，CIPS 一期上线。' },
  { period: '2021–至今', title: '去美元化加速', accent: '#c41e3a', desc: '地缘脱钩压力下本币结算扩大，CIPS 参与者超 1400 家，支付份额逼近 5%。' },
];

export default function Page() {
  const [channel, setChannel] = useState('cips');
  const [phaseIdx, setPhaseIdx] = useState(PHASES.length - 1);
  const ch = CHANNELS.find((x) => x.key === channel) || CHANNELS[0];

  const rmbShare = useMemo(() => ({
    grid: GRID,
    xAxis: categoryX(['2019', '2020', '2021', '2022', '2023', '2024E']),
    yAxis: valueY({ axisLabel: { formatter: '{value}%' } }),
    series: [{ type: 'line', smooth: true, symbol: 'circle', symbolSize: 6,
      data: [1.8, 2.1, 2.4, 2.8, 4.1, ch.share],
      lineStyle: { color: ch.accent, width: 2 }, itemStyle: { color: ch.accent },
      areaStyle: { color: `${ch.accent}22` } }],
  }), [ch]);

  const ecnyRadar = radarOpt(['民生支付', '跨境结算', '政务发放', '供应链金融', '智能合约'],
    channel === 'ecny' ? [95, 88, 92, 85, 90] : [85, 72, 88, 75, 70],
    { name: '试点能级', color: ch.accent });

  const cipsNodes = {
    grid: { left: 90, right: 36, top: 16, bottom: 24 },
    xAxis: valueY({ max: 100 }),
    yAxis: categoryX(['日均交易额', '结算行覆盖', '间接参与者', '直接参与者']),
    series: [{ type: 'bar', barWidth: 14, itemStyle: { borderRadius: 3 },
      data: [88, 78, 92, 85].map((v) => ({ value: v, itemStyle: { color: ch.accent } })),
      label: { show: true, position: 'right', color: '#93a1b5' } }],
  };

  return (
    <div>
      <PageHeader badge="RMB Intl · 金融主权" title="人民币国际化 · CIPS 与数字货币" subtitle="跨境支付 · 本币结算 · e-CNY · 去美元化博弈" />
      <IntroCard>在现实主义博弈中，货币是<strong style={{ color: 'var(--text-primary)' }}>主权信用的算法载体</strong>。中国正利用全球最大贸易国地位，构建平行于美元体系的「非对称货币引力场」，对冲单极霸权带来的金融脱钩风险。</IntroCard>

      <Grid cols={4} className="mb-6">
        <Stat value={`${ch.share}%`} label={`${ch.label}贡献 · 切换`} accent={ch.accent} />
        <Stat value="114" label="CIPS 覆盖国家/地区" accent="#22d3ee" />
        <Stat value="3.2 万亿$" label="外汇储备规模" accent="#e8a317" />
        <Stat value="SDR" label="IMF 篮子权重 ~12%" accent="#10b981" />
      </Grid>

      <Card title="交互① · 国际化通道选择器" className="mb-6">
        <SelectorBar items={CHANNELS} activeKey={channel} onSelect={setChannel} />
        <div className="os-card p-4 mb-4" style={{ background: 'var(--bg-elevated)', borderLeft: `3px solid ${ch.accent}` }}>
          <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{ch.desc}</p>
        </div>
        <Grid cols={2}>
          <Card title="RMB 全球支付份额（随通道切换）"><EChart option={rmbShare} style={{ height: 220 }} /></Card>
          <Card title="CIPS 网络节点能级"><EChart option={cipsNodes} style={{ height: 220 }} /></Card>
        </Grid>
      </Card>

      <Card title="交互② · 国际化阶段时间线" className="mb-6">
        <TimelineBar stages={PHASES} activeIdx={phaseIdx} onSelect={setPhaseIdx} />
      </Card>

      <Grid cols={2} className="mb-6">
        <Card title="数字人民币试点场景（随通道切换）"><EChart option={ecnyRadar} style={{ height: 280 }} /></Card>
        <Card title="核心逻辑 · 信用体系竞争">
          <p className="text-sm leading-relaxed mb-3" style={{ color: 'var(--text-secondary)' }}>人民币国际化本质不是汇率竞争，而是信用体系竞争：先以贸易结算渗透，再以离岸清算与储备货币职能逐级跃迁。</p>
          <div className="text-xs italic p-3" style={{ color: 'var(--text-tertiary)', borderLeft: '2px solid #e8a317', background: 'rgba(232,163,23,0.06)' }}>"Currency is the digital extension of a nation's kinetic power."</div>
        </Card>
      </Grid>

      <FrameworkTrio cards={[
        { title: 'CIPS 备份协议', subtitle: 'SWIFT 替代', body: '独立报文与清算体系，确保极端制裁场景下跨境结算不中断——从备用选项进化为全球南方贸易底层基座。', pillars: [['114 国覆盖', '清算网络扩张。'], ['实时化', '跨境延时缩短。'], ['mBridge', '多边央行数字货币桥。']] },
        { title: 'e-CNY 沙盒', subtitle: '可编程货币', body: '数字人民币是可编程的主权货币：智能合约实现资金流向穿透式监管，拦截资本外逃与洗钱。', pillars: [['2.0 T+ 交易', '累计规模放量。'], ['民生场景', '红包与政务发放。'], ['离岸接口', '跨境最后一百米。']] },
        { title: '金融防火墙', subtitle: '风险隔离', body: '资本项目有序开放与风险隔离并行，守住不发生系统性风险的底线——开放节奏服从安全冗余。', pillars: [['管道式开放', '渐进可兑换。'], ['离岸/onshore', 'CNH 定价窗口。'], ['储备职能', 'SDR 权重提升。']] },
      ]} />

      <ModuleFooter moduleId="financeRmb" sourceNote="由 china.html「人民币国际化」专题迁移升级" />
    </div>
  );
}
