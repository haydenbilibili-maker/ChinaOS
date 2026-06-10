import React, { useState, useMemo } from 'react';
import { PageHeader, Card, Grid, Stat } from '../../app/ui.jsx';
import EChart from '../../lib/viz/EChart.jsx';
import { categoryX, valueY, GRID, radarOpt } from '../shared/chartHelpers.js';
import { IntroCard, SelectorBar, FrameworkTrio, ModuleFooter } from '../shared/ModuleParadigm.jsx';

const SGLS = [
  { key: 'source', label: '源 · 多能互补', accent: '#10b981', score: 95, desc: '风光火储一体化降低弃电率；水电与抽蓄提供快速爬坡，预测精度 95%+ 服务省级调度。' },
  { key: 'grid', label: '网 · 主网架', accent: '#22d3ee', score: 92, desc: '特高压直流与交流混联；故障隔离与潮流重分配依赖保护整定，N-1 准则为极端天气底线。' },
  { key: 'load', label: '荷 · 虚拟电厂', accent: '#e8a317', score: 75, desc: '聚合工商业可调负荷与分布式资源参与辅助服务市场；渗透约 5% 负荷，现货试点省先行。' },
  { key: 'storage', label: '储 · 多技术', accent: '#c41e3a', score: 88, desc: '锂电、抽蓄、压缩空气、液流等按时长与功率分层配置；独立储能目标 100%+ 利用率。' },
];

export default function Page() {
  const [sgls, setSgls] = useState('grid');
  const s = SGLS.find((x) => x.key === sgls) || SGLS[1];

  const uhvTrend = useMemo(() => ({
    grid: GRID,
    xAxis: categoryX(['2015', '2017', '2019', '2021', '2023', '2025E']),
    yAxis: valueY(),
    series: [{ type: 'line', smooth: true, symbol: 'circle', symbolSize: 6,
      data: sgls === 'source' ? [0.6, 1.2, 1.9, 2.8, 4.0, 5.5] : [0.6, 1.2, 1.9, 2.8, 4.0, 6.2],
      lineStyle: { color: s.accent, width: 2 }, itemStyle: { color: s.accent },
      areaStyle: { color: `${s.accent}18` } }],
  }), [sgls, s]);

  const digitalImpact = useMemo(() => ({
    grid: { left: 40, right: 40, top: 30, bottom: 24 },
    legend: { bottom: 0, textStyle: { color: '#93a1b5', fontSize: 10 } },
    xAxis: categoryX(['预测', '调度', '保护', '计量', '市场']),
    yAxis: [valueY({ max: 100, axisLabel: { formatter: '{value}%' } }), { type: 'value', splitLine: { show: false }, axisLabel: { color: '#93a1b5' } }],
    series: [
      { name: '数字化覆盖', type: 'bar', barWidth: 18, data: [85, 72, 60, 45, 92].map((v) => ({ value: v + (s.score - 88) / 10, itemStyle: { color: s.accent, borderRadius: 3 } })) },
      { name: '线损系数', type: 'line', yAxisIndex: 1, smooth: true, data: [1.2, 1.5, 2.1, 1.8, 1.1], lineStyle: { color: '#e8a317', width: 2 }, itemStyle: { color: '#e8a317' } },
    ],
  }), [s]);

  const resilienceRadar = radarOpt(['备用', '黑启动', '网架', '数字化', '储能', '跨区'],
    sgls === 'storage' ? [80, 85, 90, 88, 95, 88] : [75, 82, s.score, 88, 90, 92],
    { name: '2024 评估', color: s.accent });

  return (
    <div>
      <PageHeader badge="Smart Grid · 新型电力系统" title="特高压骨干 · 储能调度" subtitle="特高压 · 配网数字化 · 新型储能 · 虚拟电厂" />
      <IntroCard>特高压把西部风光搬到东部负荷中心。风光渗透率提高后，系统转动惯量下降；抽蓄、储能、需求响应与<strong style={{ color: 'var(--text-primary)' }}>数字化调度</strong>共同构成柔性电网，与「东数西算」形成电力协同。</IntroCard>

      <Grid cols={4} className="mb-6">
        <Stat value="35 万+ km" label="输电线路（量级）" accent="#e8a317" />
        <Stat value={`${s.score}%`} label={`${s.label}能级 · 切换`} accent={s.accent} />
        <Stat value="#1" label="特高压工程规模" accent="#c41e3a" />
        <Stat value="~3 亿 kW" label="跨区输送能力" accent="#22d3ee" />
      </Grid>

      <Card title="交互 · 源网荷储四模块选择器" className="mb-6">
        <SelectorBar items={SGLS} activeKey={sgls} onSelect={setSgls} />
        <div className="os-card p-4 mb-4" style={{ background: 'var(--bg-elevated)', borderLeft: `3px solid ${s.accent}` }}>
          <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{s.desc}</p>
        </div>
        <Grid cols={2}>
          <Card title="跨区输送电量（随模块切换）"><EChart option={uhvTrend} style={{ height: 220 }} /></Card>
          <Card title="数字化对消纳与安全的影响"><EChart option={digitalImpact} style={{ height: 220 }} /></Card>
        </Grid>
      </Card>

      <Grid cols={2} className="mb-6">
        <Card title="电网韧性六维（随模块切换）"><EChart option={resilienceRadar} style={{ height: 260 }} /></Card>
        <Card title="调度大脑 · AI 与边缘计算">
          <p className="text-sm leading-relaxed mb-3" style={{ color: 'var(--text-secondary)' }}>超短期功率预测、网络拓扑优化与故障定位依赖数据融合；虚拟电厂与分布式交易对计量与结算提出合规要求。</p>
          <Grid cols={2}>
            <Stat value="99.9%" label="城市配网供电可靠率" accent="#10b981" />
            <Stat value="VPP 5%" label="可调负荷渗透（示意）" accent="#e8a317" />
          </Grid>
        </Card>
      </Grid>

      <FrameworkTrio cards={[
        { title: '特高压大动脉', subtitle: '西电东送', body: '跨区输送能力是西部绿电秒级送达东部负荷中心的物理前提，消解能源供需地理错配。', pillars: [['35 万 km', '输电线路规模。'], ['混联网架', '直流 + 交流。'], ['N-1 准则', '极端天气底线。']] },
        { title: '现货与辅助服务', subtitle: '定价机制', body: '定价机制决定储能、火电灵活性与用户侧响应的经济性；跨省输电与地方利益分配敏感。', pillars: [['现货试点', '价格信号发现。'], ['辅助服务', '调峰调频市场。'], ['送受端博弈', '电价与环保责任。']] },
        { title: '投资优先级', subtitle: '调得动', body: '瓶颈从「输得出」转向「调得动」——数字化、储能、需求响应投资优先级上升。', pillars: [['数字化 420', '投资指数最高。'], ['储能 350', '多技术并行。'], ['网络安全', '工控设备保护。']] },
      ]} />

      <ModuleFooter moduleId="smartgrid" sourceNote="由 china.html「智能电网」专题迁移升级" />
    </div>
  );
}
