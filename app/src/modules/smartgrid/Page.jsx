import React, { useState, useMemo } from 'react';
import { PageHeader, Card, Grid, Stat, StatGrid } from '../../app/ui.jsx';
import EChart from '../../lib/viz/EChart.jsx';
import { categoryX, valueY, GRID, donutOpt, radarOpt, stackedBarOpt, AXIS, LABEL } from '../shared/chartHelpers.js';
import { IntroCard, SelectorBar, TimelineBar, FrameworkTrio, ModuleFooter } from '../shared/ModuleParadigm.jsx';

// 环节选择器：从输到配到储到市场，每一环都是一种「调得动」的能力缺口
const LINKS = [
  {
    key: 'uhv', label: '特高压输电', accent: '#22d3ee', score: 92,
    status: '±800/1100kV 直流 + 1000kV 交流混联骨干已成网，跨区输送能力约 3 亿 kW。',
    scale: '在运特高压工程 40+ 条，线路里程 4.8 万 km 量级，全球唯一规模化商运。',
    pain: '送端窝电、受端拒电的省间博弈；直流闭锁瞬时冲击大电网频率，依赖安稳切机切负荷。',
    pos: '空间错配的物理解法——把西部风光水电秒级搬到东部负荷中心，是「西电东送」的钢筋骨架。',
  },
  {
    key: 'distribution', label: '配电网', accent: '#10b981', score: 78,
    status: '城市配网可靠率 99.9%+，但县域与农网薄弱；分布式光伏倒送让单向潮流变双向。',
    scale: '10kV 及以下配网占电网资产大头，数字化覆盖不均，台区智能终端加速铺设。',
    pain: '分布式高渗透下电压越限、反向重载；保护整定与计量结算在「源荷不分」时失灵。',
    pos: '新型电力系统的毛细血管——承接整县光伏与充电桩，是源网荷储互动的最后一公里。',
  },
  {
    key: 'storage', label: '储能', accent: '#c41e3a', score: 85,
    status: '新型储能装机突破，抽蓄仍是主力；独立储能、共享储能商业模式分化。',
    scale: '抽水蓄能在运 5000 万 kW+，新型储能（以锂电为主）规模快速攀升，时长 2–4h 为主。',
    pain: '强制配储利用率低、「建而不用」；锂电安全与循环寿命、长时储能经济性尚未跑通。',
    pos: '波动性的解药——为转动惯量下降的系统提供爬坡、调频与跨时段搬运，平抑风光出力。',
  },
  {
    key: 'vpp', label: '虚拟电厂', accent: '#e8a317', score: 68,
    status: '聚合工商业可调负荷、储能与分布式电源参与辅助服务；渗透约 5% 负荷，试点省先行。',
    scale: '上海、广东、冀北等地 VPP 容量百万 kW 级，调节能力随现货市场成熟而放大。',
    pain: '可调资源计量与基线认定难；激励不足、响应不确定，平台与电网调度协议待标准化。',
    pos: '不建电厂的电厂——用信息聚合替代物理新建，把分散负荷变成系统级灵活性资源。',
  },
  {
    key: 'dr', label: '需求侧响应', accent: '#8b5cf6', score: 62,
    status: '尖峰电价、有序用电与激励型响应并行；从「拉闸限电」转向价格信号引导。',
    scale: '可中断负荷与可转移负荷规模随现货推进扩大，工商业用户为响应主体。',
    pain: '响应深度有限、用户参与意愿低；行政性限电仍是极端缺电时的兜底手段。',
    pos: '需求的弹性——在缺电与弃电的两端削峰填谷，是最低成本的「虚拟装机」。',
  },
  {
    key: 'market', label: '电力市场', accent: '#64748b', score: 70,
    status: '现货试点扩容，中长期 + 现货 + 辅助服务的市场体系成型，绿电绿证交易启动。',
    scale: '南方区域、山西、山东等现货连续运行，跨省跨区交易电量占比上升。',
    pain: '省间壁垒与价格双轨；煤电容量电价、辅助服务分摊与新能源入市的利益再分配敏感。',
    pos: '调得动的定价机制——决定储能、灵活性与需求响应的经济性，是制度层的总开关。',
  },
];

// 特高压线路（已建工程，按电压等级与类型拆分，示意值）
const UHV_LINES = [
  { type: '±800kV 直流', count: 22, accent: '#22d3ee' },
  { type: '±1100kV 直流', count: 2, accent: '#0ea5e9' },
  { type: '1000kV 交流', count: 18, accent: '#10b981' },
];

// 储能技术路线占比（按装机容量，示意）
const STORAGE_MIX = [
  { value: 58, name: '抽水蓄能', itemStyle: { color: '#22d3ee' } },
  { value: 28, name: '锂离子电池', itemStyle: { color: '#c41e3a' } },
  { value: 5, name: '钠离子电池', itemStyle: { color: '#e8a317' } },
  { value: 4, name: '液流电池', itemStyle: { color: '#10b981' } },
  { value: 5, name: '压缩空气/其他', itemStyle: { color: '#64748b' } },
];

// 电网演进时间线
const PHASES = [
  { period: '1980s–2000s', title: '大机组大电网', accent: '#64748b',
    desc: '以大型火电、大水电与区域互联为主，单向潮流、计划调度；「输得出」靠提升机组容量与网架电压等级。' },
  { period: '2009–2018', title: '特高压骨干成网', accent: '#22d3ee',
    desc: '±800kV 直流与 1000kV 交流规模化投运，跨区大动脉打通，西电东送从概念变为秒级实送的物理通道。' },
  { period: '2018–2024', title: '新能源大规模接入', accent: '#10b981',
    desc: '风光装机跃居主力电源候选，整县光伏与分布式倒送冲击配网；转动惯量下降，消纳与调峰成为主矛盾。' },
  { period: '2024–2030', title: '新型电力系统 · 源网荷储', accent: '#c41e3a',
    desc: '储能、虚拟电厂、需求响应与数字化调度组网，瓶颈从「输得出」转向「调得动」，市场机制定价灵活性。' },
];

export default function Page() {
  const [link, setLink] = useState('uhv');
  const [phaseIdx, setPhaseIdx] = useState(2);
  const L = LINKS.find((x) => x.key === link) || LINKS[0];

  // 跨区输送 / 环节规模随选择器切换的趋势
  const linkTrend = useMemo(() => ({
    grid: GRID,
    tooltip: { trigger: 'axis' },
    xAxis: categoryX(['2015', '2017', '2019', '2021', '2023', '2025E']),
    yAxis: valueY(),
    series: [{
      type: 'line', smooth: true, symbol: 'circle', symbolSize: 6,
      data: link === 'uhv' ? [1.2, 1.8, 2.2, 2.6, 2.9, 3.4]
        : link === 'storage' ? [0.3, 0.4, 0.6, 1.1, 2.2, 4.5]
        : link === 'vpp' ? [0.1, 0.2, 0.4, 0.8, 1.5, 2.8]
        : link === 'distribution' ? [0.8, 1.0, 1.3, 1.7, 2.1, 2.6]
        : link === 'dr' ? [0.2, 0.3, 0.5, 0.9, 1.4, 2.0]
        : [0.5, 0.9, 1.4, 2.0, 2.9, 4.0],
      lineStyle: { color: L.accent, width: 2 }, itemStyle: { color: L.accent },
      areaStyle: { color: `${L.accent}18` },
    }],
  }), [link, L]);

  // 数字化对消纳与安全的影响（双轴：覆盖率 + 线损）
  const digitalImpact = useMemo(() => ({
    grid: { left: 40, right: 40, top: 30, bottom: 24 },
    tooltip: { trigger: 'axis' },
    legend: { bottom: 0, textStyle: { color: LABEL.color, fontSize: 10 } },
    xAxis: categoryX(['预测', '调度', '保护', '计量', '市场']),
    yAxis: [valueY({ max: 100, axisLabel: { formatter: '{value}%' } }), { type: 'value', splitLine: { show: false }, axisLabel: { color: LABEL.color } }],
    series: [
      { name: '数字化覆盖', type: 'bar', barWidth: 18, data: [85, 72, 60, 45, 92].map((v) => ({ value: Math.round(v + (L.score - 80) / 4), itemStyle: { color: L.accent, borderRadius: 3 } })) },
      { name: '线损系数', type: 'line', yAxisIndex: 1, smooth: true, data: [1.2, 1.5, 2.1, 1.8, 1.1], lineStyle: { color: '#e8a317', width: 2 }, itemStyle: { color: '#e8a317' } },
    ],
  }), [L]);

  // 特高压线路条数 bar
  const uhvBar = useMemo(() => ({
    grid: { left: 90, right: 36, top: 16, bottom: 24 },
    tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
    xAxis: valueY({ max: 26 }),
    yAxis: categoryX(UHV_LINES.map((x) => x.type)),
    series: [{
      type: 'bar', barWidth: 18, itemStyle: { borderRadius: 3 },
      data: UHV_LINES.map((x) => ({ value: x.count, itemStyle: { color: x.accent } })),
      label: { show: true, position: 'right', color: LABEL.color, formatter: '{c} 条' },
    }],
  }), []);

  // 新能源消纳难题：风光装机 vs 消纳率（双轴）
  const consumeChart = useMemo(() => ({
    grid: { left: 44, right: 48, top: 30, bottom: 24 },
    tooltip: { trigger: 'axis' },
    legend: { bottom: 0, textStyle: { color: LABEL.color, fontSize: 10 } },
    xAxis: categoryX(['2018', '2020', '2022', '2024', '2026E', '2028E']),
    yAxis: [
      valueY({ name: '装机 亿kW', nameTextStyle: { color: LABEL.color, fontSize: 9 } }),
      { type: 'value', min: 90, max: 100, splitLine: { show: false }, axisLabel: { color: LABEL.color, formatter: '{value}%' } },
    ],
    series: [
      { name: '风光累计装机', type: 'bar', barWidth: 16, data: [3.6, 5.3, 7.6, 11.0, 14.5, 18.0], itemStyle: { color: '#10b981', borderRadius: 3 } },
      { name: '消纳利用率', type: 'line', yAxisIndex: 1, smooth: true, symbol: 'circle', symbolSize: 6, data: [95.0, 96.5, 96.1, 95.0, 94.2, 95.5], lineStyle: { color: '#e8a317', width: 2 }, itemStyle: { color: '#e8a317' } },
    ],
  }), []);

  // 储能技术路线 donut
  const storageDonut = useMemo(() => donutOpt(STORAGE_MIX), []);

  // 新型电力系统六维雷达
  const systemRadar = useMemo(() => radarOpt(
    ['清洁化', '灵活性', '数字化', '安全性', '市场化', '互动性'],
    link === 'storage' ? [78, 92, 80, 82, 70, 75]
      : link === 'vpp' ? [78, 88, 90, 75, 78, 92]
      : link === 'market' ? [78, 82, 80, 80, 90, 85]
      : [82, 70, 80, 90, 72, 68],
    { name: '2025 评估', color: L.accent },
  ), [link, L]);

  // 灵活性资源结构（堆叠条：各环节贡献的调节能力，示意）
  const flexStack = useMemo(() => stackedBarOpt({
    categories: ['2022', '2024', '2026E', '2028E'],
    series: [
      { name: '抽蓄+新型储能', data: [55, 80, 130, 210], itemStyle: { color: '#22d3ee' } },
      { name: '火电灵活性改造', data: [120, 150, 175, 195], itemStyle: { color: '#c41e3a' } },
      { name: '虚拟电厂', data: [8, 20, 50, 95], itemStyle: { color: '#e8a317' } },
      { name: '需求侧响应', data: [12, 25, 45, 80], itemStyle: { color: '#8b5cf6' } },
    ],
  }), []);

  return (
    <div>
      <PageHeader badge="Smart Grid · 新型电力系统" title="特高压骨干 · 储能调度" subtitle="特高压 · 配网数字化 · 新型储能 · 虚拟电厂 · 需求响应 · 电力市场" />
      <IntroCard>特高压把西部风光秒级搬到东部负荷中心，消解能源供需的<strong style={{ color: 'var(--text-primary)' }}>空间错配</strong>。但风光渗透率提高后，系统转动惯量下降，瓶颈从「输得出」转向「调得动」——抽蓄、储能、虚拟电厂、需求响应与数字化调度共同构成柔性电网，而市场机制是为这些灵活性<strong style={{ color: 'var(--text-primary)' }}>定价的总开关</strong>，与「东数西算」形成电力协同。</IntroCard>

      <StatGrid className="mb-6">
        <Stat value="4.8 万 km" label="特高压线路里程（量级）" accent="#22d3ee" />
        <Stat value="14 亿 kW+" label="新能源装机（风光，示意）" accent="#10b981" />
        <Stat value="9000 万 kW" label="新型+抽蓄储能（量级）" accent="#c41e3a" />
        <Stat value="95%+" label="风光消纳利用率" accent="#e8a317" />
      </StatGrid>

      <Card title="交互 · 电网六环节选择器" className="mb-6">
        <SelectorBar items={LINKS} activeKey={link} onSelect={setLink} />
        <div className="os-card p-4 mb-4" style={{ background: 'var(--bg-elevated)', borderLeft: `3px solid ${L.accent}` }}>
          <div className="flex items-baseline gap-3 mb-2">
            <span className="text-base font-semibold" style={{ color: L.accent }}>{L.label}</span>
            <span className="text-[11px] mono" style={{ color: 'var(--text-tertiary)' }}>成熟度 {L.score}</span>
          </div>
          <Grid cols={2}>
            <div>
              <div className="text-[11px] font-semibold mb-1" style={{ color: 'var(--text-tertiary)' }}>技术现状</div>
              <p className="text-sm leading-relaxed mb-3" style={{ color: 'var(--text-secondary)' }}>{L.status}</p>
              <div className="text-[11px] font-semibold mb-1" style={{ color: 'var(--text-tertiary)' }}>规模量级</div>
              <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{L.scale}</p>
            </div>
            <div>
              <div className="text-[11px] font-semibold mb-1" style={{ color: '#c41e3a' }}>结构性痛点</div>
              <p className="text-sm leading-relaxed mb-3" style={{ color: 'var(--text-secondary)' }}>{L.pain}</p>
              <div className="text-[11px] font-semibold mb-1" style={{ color: L.accent }}>战略定位</div>
              <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{L.pos}</p>
            </div>
          </Grid>
        </div>
        <Grid cols={2}>
          <Card title="环节规模/输送趋势（随选择器切换）"><EChart option={linkTrend} style={{ height: 220 }} /></Card>
          <Card title="数字化对消纳与安全的影响"><EChart option={digitalImpact} style={{ height: 220 }} /></Card>
        </Grid>
      </Card>

      <Grid cols={2} className="mb-6">
        <Card title="特高压线路 · 按电压等级与类型（已建，示意）">
          <p className="text-xs leading-relaxed mb-3" style={{ color: 'var(--text-tertiary)' }}>±800/1100kV 直流承担远距离大容量送电，1000kV 交流负责区域加强与潮流疏导——「西电东送」空间错配的钢筋骨架。</p>
          <EChart option={uhvBar} style={{ height: 200 }} />
        </Card>
        <Card title="新能源消纳难题 · 装机 vs 利用率">
          <p className="text-xs leading-relaxed mb-3" style={{ color: 'var(--text-tertiary)' }}>装机指数级攀升而消纳利用率在 95% 红线附近震荡——弃风弃光的压力靠储能与灵活性「兜底」，否则增量装机变沉没成本。</p>
          <EChart option={consumeChart} style={{ height: 200 }} />
        </Card>
      </Grid>

      <Grid cols={2} className="mb-6">
        <Card title="储能技术路线占比（按装机，示意）">
          <p className="text-xs leading-relaxed mb-3" style={{ color: 'var(--text-tertiary)' }}>抽水蓄能仍是规模主力；锂电主导新型储能增量，钠电、液流与压缩空气按时长与功率分层补位长时调节。</p>
          <EChart option={storageDonut} style={{ height: 220 }} />
        </Card>
        <Card title="新型电力系统六维（随环节切换）">
          <p className="text-xs leading-relaxed mb-3" style={{ color: 'var(--text-tertiary)' }}>清洁化与安全性是底线约束，灵活性与互动性是当前最大短板——不同环节投资如何挪移雷达形状，决定系统能否「调得动」。</p>
          <EChart option={systemRadar} style={{ height: 220 }} />
        </Card>
      </Grid>

      <Card title="灵活性资源结构演进 · 谁来平抑波动（堆叠，示意）" className="mb-6">
        <p className="text-xs leading-relaxed mb-3" style={{ color: 'var(--text-tertiary)' }}>调节能力的来源正从「火电灵活性改造」单极，向储能、虚拟电厂、需求响应多元裂变——这是「源网荷储」从口号变成可调度容量的物理过程。</p>
        <EChart option={flexStack} style={{ height: 240 }} />
      </Card>

      <Card title="演进 · 大机组大电网 → 新型电力系统" className="mb-6">
        <TimelineBar stages={PHASES} activeIdx={phaseIdx} onSelect={setPhaseIdx} />
      </Card>

      <Grid cols={2} className="mb-6">
        <Card title="调度大脑 · AI 与边缘计算">
          <p className="text-sm leading-relaxed mb-3" style={{ color: 'var(--text-secondary)' }}>超短期功率预测、网络拓扑优化与故障定位依赖数据融合；虚拟电厂与分布式交易对计量与结算提出合规要求。源荷不分的双向潮流，让保护整定与状态估计从静态走向实时博弈。</p>
          <StatGrid>
            <Stat value="99.9%" label="城市配网供电可靠率" accent="#10b981" />
            <Stat value="VPP 5%" label="可调负荷渗透（示意）" accent="#e8a317" />
            <Stat value="95%+" label="超短期功率预测精度" accent="#22d3ee" />
            <Stat value="N-1" label="安稳极端天气底线" accent="#c41e3a" />
          </StatGrid>
        </Card>
        <Card title="送受端博弈 · 调得动的制度成本">
          <p className="text-sm leading-relaxed mb-3" style={{ color: 'var(--text-secondary)' }}>特高压「输得出」之后，矛盾转入省间利益分配：送端要消纳窝电、受端要保本地电厂与就业，跨省现货与辅助服务分摊把物理潮流变成财政博弈。市场机制不通，物理灵活性就「建而不用」。</p>
          <StatGrid>
            <Stat value="省间壁垒" label="跨区交易最大摩擦" accent="#64748b" />
            <Stat value="容量电价" label="煤电托底机制" accent="#c41e3a" />
            <Stat value="辅助服务" label="调峰调频定价" accent="#e8a317" />
            <Stat value="绿电绿证" label="环境价值变现" accent="#10b981" />
          </StatGrid>
        </Card>
      </Grid>

      <FrameworkTrio cards={[
        { title: '空间错配的解法', subtitle: '特高压跨区输送', body: '风光水电富集在西部，负荷集中在东部——特高压直流是把绿电秒级跨越数千公里送达的物理前提，消解能源供需的地理错配。', pillars: [['4.8 万 km', '线路里程。'], ['混联网架', '直流 + 交流。'], ['3 亿 kW', '跨区输送能力。']] },
        { title: '波动性的解法', subtitle: '储能 + 虚拟电厂', body: '风光出力随天而变、转动惯量随渗透率下降——储能提供爬坡与跨时段搬运，虚拟电厂以信息聚合替代物理新建，把分散负荷变成系统级灵活性。', pillars: [['多技术储能', '按时长分层。'], ['VPP 聚合', '不建电厂的电厂。'], ['需求响应', '最低成本装机。']] },
        { title: '双碳的载体', subtitle: '新型电力系统', body: '从「输得出」到「调得动」，瓶颈转向灵活性与市场化——新型电力系统是双碳目标落到电力侧的总载体，源网荷储与现货市场互为前提。', pillars: [['源网荷储', '协同可调度。'], ['现货定价', '灵活性变现。'], ['数字化', '调度大脑底座。']] },
      ]} />

      <ModuleFooter moduleId="smartgrid" disclaimer="公开资料整理，规模与占比均为示意量级，非官方统计 · 仅供分析框架参考，非投资建议" sourceNote="由 china.html「智能电网」专题迁移升级" />
    </div>
  );
}
