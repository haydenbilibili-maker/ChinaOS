import React, { useState, useMemo } from 'react';
import { PageHeader, Card, Grid, Stat } from '../../app/ui.jsx';
import EChart from '../../lib/viz/EChart.jsx';
import { categoryX, valueY, logY, GRID, donutOpt, radarOpt, stackedBarOpt } from '../shared/chartHelpers.js';
import { IntroCard, SelectorBar, TimelineBar, FrameworkTrio, ModuleFooter } from '../shared/ModuleParadigm.jsx';

// ---------------------------------------------------------------------------
// 数据层（示意值 · 公开资料量级整理）
// ---------------------------------------------------------------------------

/** 交互① · 算力类型 */
const COMPUTE_TYPES = [
  {
    key: 'general', label: '通用算力', accent: '#22d3ee',
    scale: '~220 EFLOPS', growth: '+15%/年', share: '约 60%',
    desc: 'CPU 为主的通用计算：政企云、网站、数据库、ERP。增速放缓、利用率分化——部分西部 IDC 上架率长期不足 50%，「建得快、用得慢」是通用算力的现实底色。',
    trend: [120, 140, 160, 180, 200, 220],
    demand: [110, 130, 150, 165, 180, 195],
    bottleneck: ['上架率分化：东部紧张、西部闲置并存', '同质化竞争压价，IDC 毛利持续收窄', '存量机房 PUE 改造成本高'],
  },
  {
    key: 'ai', label: '智能算力', accent: '#c41e3a',
    scale: '~750 EFLOPS(FP16)', growth: '+70%/年', share: '约 35%',
    desc: 'GPU/加速卡支撑的训练与推理算力：大模型竞赛的直接燃料。需求曲线近乎垂直，而供给受制于高端 GPU 出口管制——智能算力是中美算力博弈的主战场。',
    trend: [50, 100, 180, 320, 500, 750],
    demand: [60, 130, 260, 480, 800, 1300],
    bottleneck: ['高端训练卡(H100/B200 级)对华禁售', 'CUDA 生态壁垒：迁移成本高于硬件差距', 'HBM 显存、先进封装(CoWoS)产能受限'],
  },
  {
    key: 'super', label: '超算', accent: '#e8a317',
    scale: 'Top 级 ~E 级机', growth: '稳态迭代', share: '约 3%',
    desc: '天河、神威谱系的国家级超算：气象、核模拟、流体力学等战略科学计算。2022 年起退出 TOP500 公开榜单——「不再报榜」本身即是博弈姿态。',
    trend: [80, 85, 90, 95, 100, 110],
    demand: [75, 82, 88, 92, 98, 105],
    bottleneck: ['多家超算中心被列入实体清单', '自主芯片(申威/飞腾)生态应用面窄', '与智算融合(超智融合)路线尚在探索'],
  },
  {
    key: 'edge', label: '边缘算力', accent: '#10b981',
    scale: '快速起量', growth: '+40%/年', share: '约 2%',
    desc: 'MEC 边缘节点：车联网、工业质检、视频结构化的低时延落点。与 5G-A/6G、卫星回传联动，是「全国一体化算力网」的毛细血管层。',
    trend: [10, 18, 28, 42, 60, 85],
    demand: [12, 20, 32, 48, 70, 100],
    bottleneck: ['单点规模小、运维成本摊薄难', '边云协同调度标准未统一', '商业模式依赖运营商与政府项目'],
  },
  {
    key: 'quantum', label: '量子算力(前瞻)', accent: '#8b5cf6',
    scale: '原型机阶段', growth: '前瞻布局', share: '<0.1%',
    desc: '祖冲之号(超导)、九章(光量子)双路线并进：在特定采样问题上宣称量子优越性，但距通用容错量子计算仍有 10 年级距离。卡位意义大于产业意义。',
    trend: [1, 2, 3, 5, 8, 12],
    demand: [1, 2, 4, 6, 10, 15],
    bottleneck: ['纠错码与相干时间是物理硬墙', '低温/光学器件部分依赖进口', '应用场景(密码/化学模拟)尚未闭环'],
  },
];

const YEARS = ['2019', '2020', '2021', '2022', '2023', '2024E'];

/** 交互② · 东数西算八大枢纽 */
const HUB_GROUPS = [
  { key: 'west', label: '西部承接型', accent: '#c41e3a', desc: '内蒙古、贵州、甘肃、宁夏：风光水电 + 自然冷源 + 土地成本，定位「后台算力」——离线训练、备份存储、渲染等对时延不敏感的负载西移，本质是数据要素的空间再配置与绿电套利。' },
  { key: 'east', label: '东部需求型', accent: '#22d3ee', desc: '京津冀、长三角、粤港澳：贴近用户与出海光缆，承载金融交易、实时推理等毫秒级业务；电力、土地双重约束下只保「前台算力」，增量严控 PUE。' },
  { key: 'central', label: '成渝枢纽', accent: '#10b981', desc: '成渝：东西之间的中继与备份节点，承接东部容灾与西南数字产业，是「全国一体化算力网」调度拓扑上的中间锚点。' },
];

const HUB_NODES = [
  { name: '京津冀', value: 82, group: 'east', pos: '实时业务 · 政务云' },
  { name: '长三角', value: 90, group: 'east', pos: '金融 · 出海光缆' },
  { name: '粤港澳', value: 86, group: 'east', pos: '互联网 · 跨境数据' },
  { name: '成渝', value: 74, group: 'central', pos: '容灾备份 · 西南腹地' },
  { name: '内蒙古', value: 78, group: 'west', pos: '风电 + 冷源 · 绿色算力' },
  { name: '贵州', value: 80, group: 'west', pos: '水电 + 山洞机房 · 存储' },
  { name: '甘肃', value: 58, group: 'west', pos: '光伏 · 低电价承接' },
  { name: '宁夏', value: 66, group: 'west', pos: '风光 + 一体化示范' },
];

/** 国产 AI 芯片格局 */
const CHIP_VENDORS = [
  { name: '英伟达(对照)', eco: 98, ship: 80, accent: '#64748b', note: 'CUDA 生态 18 年积累；对华特供版(H20 级)性能阉割但生态完整。' },
  { name: '华为昇腾', eco: 62, ship: 12, accent: '#c41e3a', note: '910B/910C + CANN 软件栈；政企智算中心采购主力，制程受限于国产产线。' },
  { name: '寒武纪', eco: 38, ship: 3, accent: '#e8a317', note: '思元系列；被列实体清单后转向国产供应链，互联网客户验证中。' },
  { name: '海光', eco: 42, ship: 4, accent: '#22d3ee', note: 'DCU 兼容 ROCm 类生态，x86 授权渊源使迁移成本相对低。' },
  { name: '摩尔线程等新势力', eco: 25, ship: 1, accent: '#10b981', note: '全功能 GPU 路线对标更难；融资驱动，量产与生态双重爬坡。' },
];

/** 算力演进时间线 */
const PHASES = [
  { period: '1983–2009', title: '超算起步', accent: '#64748b', desc: '银河 → 天河一号登顶 TOP500：举国体制下的样板工程，证明「能造」，但算力尚未成为通用生产要素。' },
  { period: '2010–2020', title: '云数据中心潮', accent: '#22d3ee', desc: '移动互联网 + 云计算驱动 IDC 规模扩张，东部沿海集中建设；PUE 约束宽松，电力成本矛盾开始累积。' },
  { period: '2021–2022', title: '东数西算工程', accent: '#e8a317', desc: '八大枢纽、十大集群顶层设计落地：算力布局首次与国土空间、能源结构统筹——西部绿电为东部数据降碳。' },
  { period: '2023–2024', title: '智算中心爆发', accent: '#c41e3a', desc: 'ChatGPT 冲击 + 出口管制收紧：各地智算中心立项潮，国产卡「算力券」托底；需求真实性与利用率开始分化。' },
  { period: '2025–', title: '一体化算力网', accent: '#8b5cf6', desc: '从「建算力」转向「调度算力」：全国一体化算力网 + 算力交易所试点，目标是让算力像电力一样可计量、可流通。' },
];

/** 算力成本结构 donut（西部智算中心 · 示意） */
const costDonut = donutOpt([
  { value: 45, name: '电力（绿电直供降本）', itemStyle: { color: '#e8a317' } },
  { value: 30, name: '设备折旧（GPU 占大头）', itemStyle: { color: '#c41e3a' } },
  { value: 12, name: '带宽 / 网络', itemStyle: { color: '#22d3ee' } },
  { value: 9, name: '运维 / 人力', itemStyle: { color: '#10b981' } },
  { value: 4, name: '土地 / 其他', itemStyle: { color: '#64748b' } },
]);

/** 算力需求结构 donut（沿用原模块 · 示意） */
const demandDonut = donutOpt([
  { value: 35, name: '大模型训练', itemStyle: { color: '#c41e3a' } },
  { value: 20, name: '推理', itemStyle: { color: '#22d3ee' } },
  { value: 15, name: '政企云', itemStyle: { color: '#e8a317' } },
  { value: 12, name: '渲染', itemStyle: { color: '#10b981' } },
  { value: 18, name: '其他', itemStyle: { color: '#64748b' } },
]);

/** 中美算力竞争力雷达（双系列 · 自写内联，radarOpt 仅支持单系列） */
const rivalryRadar = {
  legend: { bottom: 0, textStyle: { color: '#93a1b5', fontSize: 10 }, itemWidth: 12 },
  radar: {
    indicator: ['总规模', '智算规模', '芯片自主', '网络时延', '绿电比例', '调度能力'].map((n) => ({ name: n, max: 100 })),
    axisName: { color: '#93a1b5', fontSize: 10 },
    splitLine: { lineStyle: { color: 'rgba(148,163,184,0.15)' } },
    axisLine: { lineStyle: { color: 'rgba(148,163,184,0.15)' } },
    splitArea: { show: false },
  },
  series: [{
    type: 'radar',
    data: [
      { value: [80, 55, 40, 78, 62, 85], name: '中国', lineStyle: { color: '#c41e3a', width: 2 }, itemStyle: { color: '#c41e3a' }, areaStyle: { color: 'rgba(196,30,58,0.12)' } },
      { value: [95, 95, 92, 85, 45, 60], name: '美国', lineStyle: { color: '#22d3ee', width: 2 }, itemStyle: { color: '#22d3ee' }, areaStyle: { color: 'rgba(34,211,238,0.10)' } },
    ],
  }],
};

/** 总算力 + 智算占比 双轴 */
const scaleTrendOpt = {
  tooltip: { trigger: 'axis' },
  legend: { top: 0, textStyle: { color: '#93a1b5', fontSize: 10 }, itemWidth: 12 },
  grid: { left: 48, right: 48, top: 30, bottom: 24 },
  xAxis: categoryX(YEARS),
  yAxis: [
    valueY({ name: 'EFLOPS', nameTextStyle: { color: '#93a1b5', fontSize: 10 } }),
    valueY({ max: 60, splitLine: { show: false }, axisLabel: { formatter: '{value}%' }, name: '智算占比', nameTextStyle: { color: '#93a1b5', fontSize: 10 } }),
  ],
  series: [
    { name: '总算力(EFLOPS)', type: 'bar', barWidth: 18, data: [134, 150, 202, 280, 380, 520], itemStyle: { color: '#22d3ee', borderRadius: 3 } },
    { name: '智算占比(%)', type: 'line', yAxisIndex: 1, smooth: true, symbol: 'circle', symbolSize: 7, data: [9, 14, 21, 25, 30, 41], lineStyle: { color: '#c41e3a', width: 2 }, itemStyle: { color: '#c41e3a' } },
  ],
};

/** 供需缺口 · 对数轴（训练需求指数级 vs 国产供给线性爬坡） */
const gapOpt = {
  tooltip: { trigger: 'axis' },
  legend: { top: 0, textStyle: { color: '#93a1b5', fontSize: 10 }, itemWidth: 12 },
  grid: { left: 48, right: 16, top: 30, bottom: 24 },
  xAxis: categoryX(YEARS),
  yAxis: logY(),
  series: [
    { name: 'AI 训练需求（指数）', type: 'line', smooth: true, symbol: 'circle', symbolSize: 6, data: [10, 25, 70, 200, 600, 1800], lineStyle: { color: '#c41e3a', width: 2 }, itemStyle: { color: '#c41e3a' }, areaStyle: { color: 'rgba(196,30,58,0.10)' } },
    { name: '国产芯片有效供给（指数）', type: 'line', smooth: true, symbol: 'rect', symbolSize: 6, data: [8, 14, 25, 50, 110, 260], lineStyle: { color: '#10b981', width: 2, type: 'dashed' }, itemStyle: { color: '#10b981' } },
    { name: '进口卡补缺（含管制前囤货）', type: 'line', smooth: true, symbol: 'triangle', symbolSize: 6, data: [5, 12, 40, 130, 380, 700], lineStyle: { color: '#e8a317', width: 1.5 }, itemStyle: { color: '#e8a317' } },
  ],
};

/** 枢纽算力构成 stacked bar */
const hubMixOpt = stackedBarOpt({
  categories: HUB_NODES.map((n) => n.name),
  series: [
    { name: '通用算力', data: [48, 55, 50, 38, 30, 36, 24, 26], itemStyle: { color: '#22d3ee' } },
    { name: '智能算力', data: [26, 30, 32, 22, 36, 30, 22, 28], itemStyle: { color: '#c41e3a' } },
    { name: '超算/其他', data: [8, 5, 4, 14, 12, 14, 12, 12], itemStyle: { color: '#e8a317' } },
  ],
});

/** 芯片生态 vs 出货 bar */
const chipBarOpt = {
  tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
  legend: { top: 0, textStyle: { color: '#93a1b5', fontSize: 10 }, itemWidth: 12 },
  grid: { left: 110, right: 36, top: 30, bottom: 16 },
  xAxis: valueY({ max: 100 }),
  yAxis: categoryX(CHIP_VENDORS.map((v) => v.name)),
  series: [
    { name: '软件生态成熟度', type: 'bar', barWidth: 10, data: CHIP_VENDORS.map((v) => ({ value: v.eco, itemStyle: { color: v.accent, borderRadius: 3 } })), label: { show: true, position: 'right', color: '#93a1b5', fontSize: 10 } },
    { name: '国内智算出货份额(%)', type: 'bar', barWidth: 10, data: CHIP_VENDORS.map((v) => v.ship), itemStyle: { color: 'rgba(148,163,184,0.45)', borderRadius: 3 } },
  ],
};

// ---------------------------------------------------------------------------
// 页面
// ---------------------------------------------------------------------------

export default function Page() {
  const [typeKey, setTypeKey] = useState('ai');
  const [hubGroup, setHubGroup] = useState('west');
  const [phaseIdx, setPhaseIdx] = useState(PHASES.length - 1);

  const T = COMPUTE_TYPES.find((x) => x.key === typeKey) || COMPUTE_TYPES[0];
  const G = HUB_GROUPS.find((x) => x.key === hubGroup) || HUB_GROUPS[0];

  /** 所选算力类型 · 规模趋势 */
  const typeTrendOpt = useMemo(() => ({
    tooltip: { trigger: 'axis' },
    grid: GRID,
    xAxis: categoryX(YEARS),
    yAxis: valueY(),
    series: [{
      type: 'line', smooth: true, symbol: 'circle', symbolSize: 6, data: T.trend,
      lineStyle: { color: T.accent, width: 2 }, itemStyle: { color: T.accent },
      areaStyle: { color: `${T.accent}1f` },
    }],
  }), [T]);

  /** 所选算力类型 · 供需对比 */
  const typeGapOpt = useMemo(() => ({
    tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
    legend: { top: 0, textStyle: { color: '#93a1b5', fontSize: 10 }, itemWidth: 12 },
    grid: { left: 40, right: 16, top: 30, bottom: 24 },
    xAxis: categoryX(YEARS),
    yAxis: valueY(),
    series: [
      { name: '需求', type: 'bar', barWidth: 12, data: T.demand, itemStyle: { color: 'rgba(148,163,184,0.4)', borderRadius: 3 } },
      { name: '供给', type: 'bar', barWidth: 12, data: T.trend, itemStyle: { color: T.accent, borderRadius: 3 } },
    ],
  }), [T]);

  /** 枢纽规模 bar（按所选分组高亮） */
  const hubBarOpt = useMemo(() => ({
    tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' }, formatter: (ps) => { const n = HUB_NODES[ps[0].dataIndex]; return `${n.name} · ${n.pos}<br/>规模指数：${n.value}`; } },
    grid: { left: 56, right: 40, top: 16, bottom: 24 },
    xAxis: valueY({ max: 100 }),
    yAxis: categoryX(HUB_NODES.map((n) => n.name)),
    series: [{
      type: 'bar', barWidth: 14,
      data: HUB_NODES.map((n) => ({
        value: n.value,
        itemStyle: { color: n.group === hubGroup ? G.accent : 'rgba(148,163,184,0.35)', borderRadius: 3 },
      })),
      label: { show: true, position: 'right', color: '#93a1b5', fontSize: 10 },
    }],
  }), [hubGroup, G]);

  /** 单系列雷达：所选枢纽分组能力画像（radarOpt 单系列用法） */
  const groupRadar = useMemo(() => radarOpt(
    ['绿电比例', '电价优势', '冷源条件', '网络时延', '人才密度', '需求贴近'],
    hubGroup === 'west' ? [92, 95, 90, 45, 35, 30]
      : hubGroup === 'east' ? [40, 30, 35, 95, 92, 96]
        : [70, 65, 60, 70, 62, 58],
    { name: G.label, color: G.accent },
  ), [hubGroup, G]);

  return (
    <div>
      <PageHeader badge="Computing · 算力主权" title="算力基础设施 · 东数西算" subtitle="算力类型 · 八大枢纽 · 供需缺口 · 国产芯片 · 一体化算力网" />
      <IntroCard>
        算力是数字时代的电力：大模型把它从「成本项」抬升为<strong style={{ color: 'var(--text-primary)' }}>国力变量</strong>。中国的算力叙事有两条主线——空间上，「东数西算」把数据要素重新配置到西部绿电富集区；供给上，高端 GPU 出口管制把智能算力压进「国产替代 + 囤货 + 算力调度」的三角腾挪。硬件缺口可以用堆卡和工程化弥补，<strong style={{ color: 'var(--text-primary)' }}>CUDA 生态壁垒</strong>才是更深的护城河——算力主权之争，下半场打的是软件栈。
      </IntroCard>

      {/* 概览 Stat */}
      <Grid cols={4} className="mb-6">
        <Stat value="~520 EF" label="算力总规模（EFLOPS · 示意）" accent="#22d3ee" />
        <Stat value="~41%" label="智能算力占比（升势）" accent="#c41e3a" />
        <Stat value="8 + 10" label="枢纽节点 + 数据中心集群" accent="#e8a317" />
        <Stat value="250+" label="在建/已建智算中心（口径宽 · 示意）" accent="#10b981" />
      </Grid>

      {/* 交互① 算力类型选择器 */}
      <Card title="交互① · 算力类型选择器（规模 / 增速 / 供需 / 瓶颈）" className="mb-6">
        <SelectorBar items={COMPUTE_TYPES} activeKey={typeKey} onSelect={setTypeKey} />
        <div className="os-card p-4 mb-4" style={{ background: 'var(--bg-elevated)', borderLeft: `3px solid ${T.accent}` }}>
          <div className="flex flex-wrap gap-x-6 gap-y-1 mb-2 text-xs mono">
            <span style={{ color: T.accent }}>规模 {T.scale}</span>
            <span style={{ color: 'var(--text-tertiary)' }}>增速 {T.growth}</span>
            <span style={{ color: 'var(--text-tertiary)' }}>占比 {T.share}</span>
          </div>
          <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{T.desc}</p>
        </div>
        <Grid cols={2} className="mb-4">
          <Card title={`${T.label} · 规模趋势（指数 · 示意）`}><EChart option={typeTrendOpt} style={{ height: 220 }} /></Card>
          <Card title={`${T.label} · 需求 vs 供给`}><EChart option={typeGapOpt} style={{ height: 220 }} /></Card>
        </Grid>
        <div className="os-card p-4" style={{ background: 'var(--bg-elevated)' }}>
          <div className="text-xs font-semibold mb-2 mono" style={{ color: T.accent }}>核心瓶颈</div>
          <Grid cols={3}>
            {T.bottleneck.map((b, i) => (
              <div key={b} className="flex gap-2">
                <span className="text-xs mono" style={{ color: 'var(--text-tertiary)' }}>{`0${i + 1}`}</span>
                <p className="text-xs leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{b}</p>
              </div>
            ))}
          </Grid>
        </div>
      </Card>

      {/* 交互② 八大枢纽 */}
      <Card title="交互② · 东数西算八大枢纽（点选分组高亮）" className="mb-6">
        <SelectorBar items={HUB_GROUPS} activeKey={hubGroup} onSelect={setHubGroup} />
        <div className="os-card p-4 mb-4" style={{ background: 'var(--bg-elevated)', borderLeft: `3px solid ${G.accent}` }}>
          <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{G.desc}</p>
        </div>
        <Grid cols={2} className="mb-4">
          <Card title="八大枢纽规模指数（所选分组高亮）"><EChart option={hubBarOpt} style={{ height: 250 }} /></Card>
          <Card title="枢纽分组能力画像（随选择切换）"><EChart option={groupRadar} style={{ height: 250 }} /></Card>
        </Grid>
        <Card title="枢纽算力构成（通用 / 智算 / 超算 · 示意）"><EChart option={hubMixOpt} style={{ height: 240 }} /></Card>
        <p className="text-xs mt-3 leading-relaxed" style={{ color: 'var(--text-tertiary)' }}>
          空间逻辑：东部出「数」、西部出「算」——离线训练、存储备份等时延不敏感负载西移吃绿电低电价；实时推理与交易类负载留在东部贴用户。骨干网时延（枢纽间 ~20ms、集群内 ~5ms 目标）是这套空间分工能否成立的物理前提。
        </p>
      </Card>

      {/* 规模趋势 + 供需缺口 */}
      <Grid cols={2} className="mb-6">
        <Card title="算力规模趋势：总量(EFLOPS) × 智算占比（双轴 · 示意）">
          <EChart option={scaleTrendOpt} style={{ height: 260 }} />
          <p className="text-xs mt-2 leading-relaxed" style={{ color: 'var(--text-tertiary)' }}>通用算力进入平台期，增量几乎全部来自智算——「算力大盘」的成色正在被 GPU 重新定义。</p>
        </Card>
        <Card title="供需缺口：训练需求 vs 国产供给（对数轴 · 示意）">
          <EChart option={gapOpt} style={{ height: 260 }} />
          <p className="text-xs mt-2 leading-relaxed" style={{ color: 'var(--text-tertiary)' }}>对数轴上仍在张开的剪刀差：需求按大模型代际指数攀升，国产有效供给受制程与软件栈拖累线性爬坡，中间靠管制前囤货与特供版进口卡补缺——缺口本身就是战略暴露面。</p>
        </Card>
      </Grid>

      {/* 成本结构 + 需求结构 + 中美雷达 */}
      <Grid cols={3} className="mb-6">
        <Card title="算力成本结构（西部智算中心 · 示意）">
          <EChart option={costDonut} style={{ height: 240 }} />
          <p className="text-xs mt-2 leading-relaxed" style={{ color: 'var(--text-tertiary)' }}>电力占近半：这正是「算力西移 + 绿电直供」的全部经济学——西部风光电价可比东部低 0.2 元/度以上，叠加自然冷源压低 PUE。</p>
        </Card>
        <Card title="算力需求结构（示意）">
          <EChart option={demandDonut} style={{ height: 240 }} />
          <p className="text-xs mt-2 leading-relaxed" style={{ color: 'var(--text-tertiary)' }}>训练 + 推理已过半且推理占比持续上升——推理是国产卡渗透的主突破口。</p>
        </Card>
        <Card title="中美算力竞争力雷达（双系列 · 评估示意）">
          <EChart option={rivalryRadar} style={{ height: 240 }} />
          <p className="text-xs mt-2 leading-relaxed" style={{ color: 'var(--text-tertiary)' }}>中国在调度能力与绿电耦合上占优，芯片自主与智算规模是明确短板——非对称竞争格局。</p>
        </Card>
      </Grid>

      {/* 国产 AI 芯片格局 */}
      <Card title="国产 AI 芯片格局 · 硬件可替，生态难破" className="mb-6">
        <EChart option={chipBarOpt} style={{ height: 240 }} />
        <Grid cols={3} className="mt-4">
          {CHIP_VENDORS.map((v) => (
            <div key={v.name} className="os-card p-4" style={{ background: 'var(--bg-elevated)', borderLeft: `3px solid ${v.accent}` }}>
              <div className="text-xs font-semibold mb-1" style={{ color: v.accent }}>{v.name}</div>
              <p className="text-[11px] leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{v.note}</p>
            </div>
          ))}
          <div className="os-card p-4" style={{ background: 'var(--bg-elevated)', borderLeft: '3px solid #8b5cf6' }}>
            <div className="text-xs font-semibold mb-1" style={{ color: '#8b5cf6' }}>CUDA 壁垒（关键变量）</div>
            <p className="text-[11px] leading-relaxed" style={{ color: 'var(--text-secondary)' }}>算子库、编译器、分布式框架与十余年开发者习惯构成的软壁垒：国产卡单点性能可逼近，但「换卡即换栈」的迁移税让客户用脚投票——生态突围比流片更慢。</p>
          </div>
        </Grid>
      </Card>

      {/* 交互③ 时间线 */}
      <Card title="交互③ · 算力演进时间线（超算 → 云 → 东数西算 → 智算 → 算力网）" className="mb-6">
        <TimelineBar stages={PHASES} activeIdx={phaseIdx} onSelect={setPhaseIdx} />
      </Card>

      {/* 框架三卡 */}
      <FrameworkTrio cards={[
        { title: '算力即国力', subtitle: '数字时代的电力', body: '算力之于 AI 时代，如电力之于工业时代：模型能力≈算力×数据×算法，而算力是其中唯一可被禁运的要素。算力规模、自主率与调度能力共同构成数字主权底盘。', pillars: [['可计量', 'EFLOPS 成为新的「装机容量」。'], ['可禁运', '出口管制使其成为博弈筹码。'], ['可调度', '一体化算力网=算力电网化。']] },
        { title: '东数西算', subtitle: '数据要素的空间再配置', body: '把对时延不敏感的算力负载迁往西部绿电富集区：一手解东部电力土地约束，一手给西部新能源找消纳出口——算力工程同时是能源工程与区域政策。', pillars: [['绿电耦合', '风光水电直供 + 源网荷储一体化。'], ['时延分层', '前台留东部、后台去西部。'], ['利用率拷问', '部分西部节点上架率仍偏低。']] },
        { title: '生态突围', subtitle: '硬件可替 · 软壁垒难破', body: '制程封锁可用 Chiplet、堆卡与系统工程部分对冲；真正的长期约束是 CUDA 生态——开发者迁移成本构成复利型壁垒，国产软件栈的成熟速度决定替代的真实节奏。', pillars: [['推理先行', '国产卡从推理侧撕开口子。'], ['框架自立', 'CANN/统一算子生态攻坚。'], ['算力券托底', '政府采购为生态买时间。']] },
      ]} />

      {/* 研判要点 */}
      <Card title="研判要点" className="mb-6">
        <Grid cols={3}>
          {[['1 · 过剩与短缺并存', '通用算力区域性过剩、智算训练卡结构性短缺——「算力荒」是结构问题而非总量问题，警惕智算中心立项潮的利用率泡沫。'],
            ['2 · 电与碳进入 TCO', '电价、绿证与碳足迹全面进入模型训练成本函数；出口算力服务还将面对碳边境规则——绿电算力是成本项也是合规项。'],
            ['3 · 调度即权力', '算力交易所与一体化调度平台决定谁能用、用什么价的算力；当算力像电一样并网，调度规则本身就是产业政策。']].map(([t, d]) => (
            <div key={t}><div className="text-sm font-semibold" style={{ color: 'var(--china-red)' }}>{t}</div><p className="text-xs mt-1 leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{d}</p></div>
          ))}
        </Grid>
      </Card>

      <ModuleFooter moduleId="computing" disclaimer="规模/份额/成本均为示意量级，非官方统计 · 公开资料整理，仅供分析框架参考，非投资建议" sourceNote="由 china.html「算力」专题迁移升级" />
    </div>
  );
}
