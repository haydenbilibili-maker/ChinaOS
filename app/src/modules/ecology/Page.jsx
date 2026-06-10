import React, { useState, useMemo } from 'react';
import { PageHeader, Card, Grid, Stat } from '../../app/ui.jsx';
import EChart from '../../lib/viz/EChart.jsx';
import { categoryX, valueY, logY, GRID, donutOpt, radarOpt, stackedBarOpt } from '../shared/chartHelpers.js';
import { IntroCard, SelectorBar, TimelineBar, FrameworkTrio, ModuleFooter } from '../shared/ModuleParadigm.jsx';

// ----------------------------------------------------------------------------
// 数据层（示意值 · 公开口径整理）
// ----------------------------------------------------------------------------

const PILLARS = [
  { key: 'green', label: '扩绿增汇', accent: '#10b981', score: 95, desc: '森林覆盖率 24.02%，全球新增绿化贡献 30%+；国家公园体系重构保护地边界。' },
  { key: 'carbon', label: '降碳减污', accent: '#22d3ee', score: 88, desc: '单位 GDP 能耗指数较 2015 年降 30%；碳排放强度较峰值降幅超 25%。' },
  { key: 'value', label: '价值实现', accent: '#e8a317', score: 72, desc: 'GEP 核算与生态补偿、碳汇交易把外部性内化为可量化、可交易的制度安排。' },
];

const PARKS = [
  ['三江源', '长江/黄河/澜沧江发源地，「中华水塔」。'],
  ['大熊猫', '栖息地走廊连通，野外种群 1900+ 只。'],
  ['东北虎豹', '跨境连通 + 红外监测，野生东北虎破 30 只。'],
  ['海南热带雨林', '长臂猿等热带物种，岛屿生态完整性。'],
  ['武夷山', '世界双遗产，亚热带森林多样性。'],
];

// 六大战役：指标改善 / 机制 / 难点
const CAMPAIGNS = [
  {
    key: 'air', label: '蓝天保卫战', accent: '#22d3ee',
    metric: 'PM2.5 全国均值', from: '72 μg/m³ (2013)', to: '29.3 μg/m³ (2024)', delta: '-59%',
    mechanism: '「大气十条」量化军令状 + 京津冀煤改气/煤改电 + 重点行业超低排放改造 + 重污染天气应急联动。指标层层分解到城市，排名公开、约谈问责。',
    pain: '秋冬季静稳天气下的反弹压力；臭氧（O₃）污染不降反升成为第二战场；煤改气的民生成本与气源保供矛盾。',
    bars: { cats: ['2013', '2017', '2020', '2024'], vals: [72, 47, 33, 29.3], unit: 'μg/m³' },
  },
  {
    key: 'water', label: '碧水攻坚', accent: '#3b82f6',
    metric: '地表水 I–III 类断面比例', from: '64.5% (2015)', to: '90.4% (2024)', delta: '+25.9pp',
    mechanism: '河长制/湖长制把每条河流的责任落到具体官员头上；长江「十年禁渔」+ 排污口溯源整治；城市黑臭水体限期销号。',
    pain: '面源污染（农业化肥/农村污水）治理远难于点源；地下水超采与污染的长周期修复；治理资金对地方财政的持续压力。',
    bars: { cats: ['2015', '2018', '2021', '2024'], vals: [64.5, 71, 84.9, 90.4], unit: '%' },
  },
  {
    key: 'soil', label: '净土防治', accent: '#a16207',
    metric: '受污染耕地安全利用率', from: '~70% (2015)', to: '92%+ (2024)', delta: '风险管控',
    mechanism: '「土十条」+ 土壤污染防治法确立「风险管控」而非「全面修复」路线——优先保障农产品安全与人居安全，按地块分类管理。',
    pain: '土壤修复成本极高（单地块可达数亿元），底数调查仍在补课；重金属历史欠账集中在湘赣等老工矿区，责任主体多已灭失。',
    bars: { cats: ['修复成本', '管控成本'], vals: [100, 18], unit: '相对成本=100' },
  },
  {
    key: 'dual', label: '双碳行动', accent: '#10b981',
    metric: '碳排放强度（较 2005）', from: '基准 100', to: '约 -51% (2024)', delta: '超额承诺',
    mechanism: '「1+N」政策体系：顶层双碳意见 + 能源/工业/交通/建筑分领域施工图；能耗双控转向碳排放双控；先立后破，新能源先成体系再退煤。',
    pain: '达峰平台期的总量仍在高位；电力系统对煤电的兜底依赖（保供 vs 减碳）；地方「运动式减碳」与「一刀切限电」的纠偏成本。',
    bars: { cats: ['2005', '2010', '2015', '2020', '2024'], vals: [100, 79, 62, 52, 49], unit: '强度指数' },
  },
  {
    key: 'bio', label: '生物多样性', accent: '#8b5cf6',
    metric: '国家重点保护物种种群', from: '多数濒危', to: '旗舰物种回升', delta: '3030 框架',
    mechanism: '生态保护红线（陆域 ~30%）把开发边界写进国土空间规划；国家公园 + 昆明-蒙特利尔框架「3030」目标（2030 保护 30% 陆海）。',
    pain: '保护红线与地方开发冲突的执行博弈；生物多样性难以像碳一样被单一指标定价；外来物种入侵与栖息地碎片化。',
    bars: { cats: ['藏羚羊', '朱鹮', '东北虎', '大熊猫'], vals: [300, 250, 180, 165], unit: '2000=100' },
  },
  {
    key: 'gep', label: '生态产品价值(GEP)', accent: '#e8a317',
    metric: 'GEP 核算试点', from: '概念 (2013)', to: '省市县三级试点', delta: '制度化中',
    mechanism: '把生态系统的供给/调节/文化服务折算为货币价值（GEP），与 GDP 并行考核；浙江丽水、福建三明等地试点「两山银行」、生态信用。',
    pain: '核算口径未全国统一，「算得出」不等于「卖得掉」；生态产品交易缺乏需求侧强约束；横向生态补偿仍依赖上级转移支付撮合。',
    bars: { cats: ['丽水', '三明', '抚州', '阿坝'], vals: [5.2, 3.9, 3.6, 2.8], unit: '千亿元级（示意）' },
  },
];

// 碳排放路径：2030 达峰 → 平台期 → 2060 中和（示意，亿吨 CO2）
const CARBON_PATH = {
  years: ['2005', '2010', '2015', '2020', '2025', '2030', '2035', '2040', '2045', '2050', '2055', '2060'],
  emissions: [54, 83, 93, 99, 116, 121, 118, 102, 78, 50, 24, 8],
  peakIdx: 5, plateauEnd: 6,
};

// 空气质量：PM2.5 vs 优良天数
const AIR_YEARS = ['2015', '2017', '2019', '2021', '2023', '2024'];
const AIR_PM25 = [50, 47, 36, 30, 30, 29.3];
const AIR_GOOD = [76.7, 78, 82, 87.5, 85.5, 87.2];

// 能源结构：煤炭占比 vs 非化石占比
const ENERGY_YEARS = ['2010', '2013', '2016', '2019', '2022', '2025E', '2030E'];
const COAL_SHARE = [69.2, 67.4, 62.0, 57.7, 56.2, 53.0, 46.0];
const NONFOSSIL_SHARE = [9.4, 10.2, 13.3, 15.3, 17.5, 20.0, 25.0];

// 碳价对比（示意，折合 €/吨）
const CARBON_PRICE = [
  { name: 'EU ETS', val: 70, color: '#3b82f6' },
  { name: '英国 ETS', val: 45, color: '#8b5cf6' },
  { name: '韩国 K-ETS', val: 9, color: '#22d3ee' },
  { name: '全国碳市场(CN)', val: 12, color: '#c41e3a' },
];

const CARBON_MECHANISMS = [
  { title: '全国碳市场 (ETS)', accent: '#c41e3a', body: '2021 启动，覆盖电力行业 ~45 亿吨/年，全球最大单一碳市场。基于强度的免费配额分配，正向水泥/钢铁/电解铝扩围。', tag: '强制 · 配额' },
  { title: 'CCER 自愿减排', accent: '#10b981', body: '2024 重启。林业碳汇/可再生能源等项目产生核证减排量，可抵销配额清缴 5%。把生态系统固碳能力变成可交易资产。', tag: '自愿 · 抵销' },
  { title: '绿证 / 绿电交易', accent: '#22d3ee', body: '绿证对应 1MWh 非化石电量的环境权益；与碳市场并行的「双轨定价」。出口企业应对 CBAM（欧盟碳关税）的合规接口。', tag: '环境权益' },
];

// 生态治理六维雷达
const GOV_RADAR_DIMS = ['大气治理', '水环境', '土壤管控', '固废与无废城市', '生态修复', '制度建设'];
const GOV_RADAR_VALS = [88, 85, 68, 72, 80, 90];

// GEP 核算三层
const GEP_LAYERS = [
  ['核算', '物质供给 + 调节服务 + 文化服务三账并立，丽水首发市级 GEP 报告。'],
  ['定价', '「两山银行」收储碎片化生态资源，打包成可抵押、可入股的资产包。'],
  ['交易', '水权/排污权/碳汇/生态券进场交易；横向补偿（新安江模式）按水质对赌结算。'],
];

// 生态文明制度演进时间线
const ECO_TIMELINE = [
  { period: '1983–2002', title: '环保基本国策', accent: '#64748b', desc: '1983 年环境保护被确立为基本国策，但实践中长期让位于增长优先；「先污染后治理」的路径在高速工业化期被默认。监管以环保局体系点状执法为主，约束力有限。' },
  { period: '2003–2011', title: '科学发展观', accent: '#3b82f6', desc: '「两型社会」（资源节约型/环境友好型）与节能减排约束性指标首次写入五年规划——环境从口号变成可考核数字。但 GDP 锦标赛仍是主轴，数据真实性与执行刚性不足。' },
  { period: '2012–2017', title: '生态文明入宪 · 大部制', accent: '#10b981', desc: '生态文明写入党章（2012）与宪法（2018）；「绿水青山就是金山银山」上升为执政理念。中央环保督察启动，地方党政「一岗双责」；2018 组建生态环境部，统一监管职能。' },
  { period: '2020–2024', title: '双碳目标', accent: '#22d3ee', desc: '2020 年「3060」承诺（2030 碳达峰 / 2060 碳中和）把气候议题升格为国家战略；「1+N」政策体系铺开，全国碳市场开市，能耗双控转向碳排放双控，新能源产业与减碳目标互为飞轮。' },
  { period: '2025–2035', title: '美丽中国 2035', accent: '#e8a317', desc: '目标设定：2035 美丽中国基本建成——PM2.5 降至 25 μg/m³ 以下、碳排放达峰后稳中有降、生态系统服务功能显著提升。治理重心从末端达标转向 GEP 核算、生态资本化与全民行动体系。' },
];

// ----------------------------------------------------------------------------
// 页面
// ----------------------------------------------------------------------------

export default function Page() {
  const [pillar, setPillar] = useState('green');
  const [campKey, setCampKey] = useState('air');
  const [stageIdx, setStageIdx] = useState(3);
  const p = PILLARS.find((x) => x.key === pillar) || PILLARS[0];
  const camp = CAMPAIGNS.find((c) => c.key === campKey) || CAMPAIGNS[0];

  // —— 战役指标 bar（随选择器切换）——
  const campBarOpt = useMemo(() => ({
    grid: { left: 48, right: 16, top: 28, bottom: 24 },
    tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
    xAxis: categoryX(camp.bars.cats),
    yAxis: valueY({ name: camp.bars.unit, nameTextStyle: { color: '#93a1b5', fontSize: 10 } }),
    series: [{
      type: 'bar', barWidth: 22,
      data: camp.bars.vals,
      itemStyle: { color: camp.accent, borderRadius: [3, 3, 0, 0] },
      label: { show: true, position: 'top', color: '#93a1b5', fontSize: 10 },
    }],
  }), [camp]);

  // —— 碳排放路径：达峰 → 平台 → 中和 ——
  const carbonPathOpt = useMemo(() => ({
    grid: { left: 44, right: 20, top: 30, bottom: 24 },
    tooltip: { trigger: 'axis' },
    legend: { data: ['碳排放总量（亿吨 · 示意）'], textStyle: { color: '#93a1b5', fontSize: 10 }, top: 0 },
    xAxis: categoryX(CARBON_PATH.years),
    yAxis: valueY(),
    series: [{
      name: '碳排放总量（亿吨 · 示意）',
      type: 'line', smooth: true, symbol: 'circle', symbolSize: 5,
      data: CARBON_PATH.emissions,
      lineStyle: { color: '#10b981', width: 2.5 },
      itemStyle: { color: '#10b981' },
      areaStyle: { color: 'rgba(16,185,129,0.1)' },
      markPoint: {
        symbolSize: 52,
        data: [{ coord: ['2030', 121], value: '达峰', itemStyle: { color: '#e8a317' }, label: { fontSize: 10, color: '#0b1220' } }],
      },
      markArea: {
        silent: true,
        itemStyle: { color: 'rgba(232,163,23,0.08)' },
        data: [[{ xAxis: '2030', name: '峰值平台期' }, { xAxis: '2035' }]],
        label: { color: '#e8a317', fontSize: 10 },
      },
      markLine: {
        silent: true, symbol: 'none',
        lineStyle: { color: '#22d3ee', type: 'dashed' },
        label: { color: '#22d3ee', fontSize: 10, formatter: '2060 中和（净零）' },
        data: [{ yAxis: 8 }],
      },
    }],
  }), []);

  // —— 空气质量双轴：PM2.5 下行 vs 优良天数上行 ——
  const airOpt = useMemo(() => ({
    grid: { left: 44, right: 48, top: 30, bottom: 24 },
    tooltip: { trigger: 'axis' },
    legend: { data: ['PM2.5 均值 (μg/m³)', '优良天数比例 (%)'], textStyle: { color: '#93a1b5', fontSize: 10 }, top: 0 },
    xAxis: categoryX(AIR_YEARS),
    yAxis: [
      valueY({ name: 'μg/m³', nameTextStyle: { color: '#93a1b5', fontSize: 10 } }),
      { type: 'value', min: 60, max: 100, splitLine: { show: false }, axisLabel: { color: '#93a1b5', fontSize: 10, formatter: '{value}%' } },
    ],
    series: [
      { name: 'PM2.5 均值 (μg/m³)', type: 'bar', barWidth: 16, data: AIR_PM25, itemStyle: { color: '#22d3ee', borderRadius: [3, 3, 0, 0] } },
      { name: '优良天数比例 (%)', type: 'line', yAxisIndex: 1, smooth: true, symbol: 'circle', symbolSize: 6, data: AIR_GOOD, lineStyle: { color: '#10b981', width: 2 }, itemStyle: { color: '#10b981' } },
    ],
  }), []);

  // —— 能源结构脱碳双线 ——
  const energyOpt = useMemo(() => ({
    grid: { left: 44, right: 20, top: 30, bottom: 24 },
    tooltip: { trigger: 'axis' },
    legend: { data: ['煤炭占一次能源消费 %', '非化石能源占比 %'], textStyle: { color: '#93a1b5', fontSize: 10 }, top: 0 },
    xAxis: categoryX(ENERGY_YEARS),
    yAxis: valueY({ axisLabel: { formatter: '{value}%' } }),
    series: [
      { name: '煤炭占一次能源消费 %', type: 'line', smooth: true, symbol: 'circle', symbolSize: 5, data: COAL_SHARE, lineStyle: { color: '#a16207', width: 2 }, itemStyle: { color: '#a16207' }, areaStyle: { color: 'rgba(161,98,7,0.08)' } },
      { name: '非化石能源占比 %', type: 'line', smooth: true, symbol: 'circle', symbolSize: 5, data: NONFOSSIL_SHARE, lineStyle: { color: '#10b981', width: 2 }, itemStyle: { color: '#10b981' }, areaStyle: { color: 'rgba(16,185,129,0.1)' },
        markLine: { silent: true, symbol: 'none', lineStyle: { color: '#22d3ee', type: 'dashed' }, label: { color: '#22d3ee', fontSize: 10, formatter: '2030 目标 25%' }, data: [{ yAxis: 25 }] } },
    ],
  }), []);

  // —— 碳价对比 ——
  const carbonPriceOpt = useMemo(() => ({
    grid: { left: 96, right: 36, top: 16, bottom: 24 },
    tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
    xAxis: valueY({ name: '€/t（折合 · 示意）', nameTextStyle: { color: '#93a1b5', fontSize: 10 } }),
    yAxis: categoryX(CARBON_PRICE.map((d) => d.name)),
    series: [{
      type: 'bar', barWidth: 14,
      data: CARBON_PRICE.map((d) => ({ value: d.val, itemStyle: { color: d.color, borderRadius: [0, 3, 3, 0] } })),
      label: { show: true, position: 'right', color: '#93a1b5', fontSize: 10, formatter: '€{c}' },
    }],
  }), []);

  // —— 生态治理六维雷达 ——
  const govRadar = radarOpt(GOV_RADAR_DIMS, GOV_RADAR_VALS, { name: '治理强度（示意）', color: '#10b981' });

  // —— GEP 试点规模 bar（随 GEP 战役复用数据，独立呈现）——
  const gepBarOpt = useMemo(() => {
    const g = CAMPAIGNS.find((c) => c.key === 'gep');
    return {
      grid: { left: 44, right: 16, top: 28, bottom: 24 },
      tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
      xAxis: categoryX(g.bars.cats),
      yAxis: valueY({ name: '相对规模（示意）', nameTextStyle: { color: '#93a1b5', fontSize: 10 } }),
      series: [{
        type: 'bar', barWidth: 24,
        data: g.bars.vals,
        itemStyle: { color: '#e8a317', borderRadius: [3, 3, 0, 0] },
        label: { show: true, position: 'top', color: '#93a1b5', fontSize: 10 },
      }],
    };
  }, []);

  // —— 既有：三支柱 ——
  const forestTrend = useMemo(() => ({
    grid: GRID,
    xAxis: categoryX(['1949', '1980', '2000', '2010', '2020', '2024']),
    yAxis: valueY({ axisLabel: { formatter: '{value}%' } }),
    series: [{ type: 'line', smooth: true, symbol: 'circle', symbolSize: 5,
      data: [8.6, 12, 16.6, 20.4, 23.0, 24.02],
      lineStyle: { color: p.accent, width: 2 }, itemStyle: { color: p.accent },
      areaStyle: { color: `${p.accent}18` } }],
  }), [p]);

  const speciesChart = {
    legend: { data: ['2000 基准', '2024 现状'], textStyle: { color: '#93a1b5' }, top: 0 },
    grid: { left: 60, right: 16, top: 30, bottom: 24 },
    xAxis: valueY(),
    yAxis: categoryX(['藏羚羊', '东北虎', '大熊猫', '朱鹮']),
    series: [
      { name: '2000 基准', type: 'bar', data: [100, 100, 100, 100], barWidth: 9, itemStyle: { color: '#27324a' } },
      { name: '2024 现状', type: 'bar', data: [300, 180, 165, 250], barWidth: 9, itemStyle: { color: p.accent } },
    ],
  };

  const pillarRadar = radarOpt(['国土绿化', '物种保护', '碳市场', 'GEP 核算', '国际承诺'],
    pillar === 'green' ? [95, 92, 70, 65, 88] : pillar === 'carbon' ? [80, 75, 95, 70, 85] : [85, 80, 75, 95, 90],
    { name: p.label, color: p.accent });

  return (
    <div>
      <PageHeader badge="Ecology · 双碳" title="生态文明 · 从治理到价值" subtitle="绿水青山 · 双碳目标 · GEP · 碳市场" />
      <IntroCard>生态不再只是被保护的对象，而是被纳入<strong style={{ color: 'var(--text-primary)' }}>核算、定价与交易</strong>的系统资产——把外部性内化为可量化、可激励的制度安排。本页拆解六大战役的指标—机制—难点结构、双碳路径的物理约束，以及碳市场与 GEP 把「绿水青山」资本化的制度接口。</IntroCard>

      <Grid cols={4} className="mb-6">
        <Stat value="29.3 μg/m³" label="PM2.5 全国均值（较 2013 -59%）" accent="#22d3ee" />
        <Stat value="~18%" label="非化石能源消费占比" accent="#10b981" />
        <Stat value="24.02%" label="森林覆盖率" accent="#10b981" />
        <Stat value="45 亿吨/年" label="全国碳市场覆盖排放量级" accent="#e8a317" />
      </Grid>

      {/* ① 六大战役选择器 */}
      <Card title="交互 · 六大战役选择器（指标 / 机制 / 难点）" className="mb-6">
        <SelectorBar items={CAMPAIGNS} activeKey={campKey} onSelect={setCampKey} />
        <Grid cols={3} className="mb-4">
          <div className="os-card p-4" style={{ background: 'var(--bg-elevated)', borderLeft: `3px solid ${camp.accent}` }}>
            <div className="text-[11px] mono mb-1" style={{ color: 'var(--text-tertiary)' }}>指标改善</div>
            <div className="text-sm font-semibold mb-1" style={{ color: camp.accent }}>{camp.metric}</div>
            <p className="text-xs leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
              {camp.from} → {camp.to}　<span className="mono" style={{ color: camp.accent }}>{camp.delta}</span>
            </p>
          </div>
          <div className="os-card p-4" style={{ background: 'var(--bg-elevated)', borderLeft: '3px solid var(--cyber-cyan)' }}>
            <div className="text-[11px] mono mb-1" style={{ color: 'var(--text-tertiary)' }}>核心机制</div>
            <p className="text-xs leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{camp.mechanism}</p>
          </div>
          <div className="os-card p-4" style={{ background: 'var(--bg-elevated)', borderLeft: '3px solid var(--china-red)' }}>
            <div className="text-[11px] mono mb-1" style={{ color: 'var(--text-tertiary)' }}>未解难点</div>
            <p className="text-xs leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{camp.pain}</p>
          </div>
        </Grid>
        <Card title={`战役量化轨迹 · ${camp.label}（示意）`}>
          <EChart option={campBarOpt} style={{ height: 220 }} />
        </Card>
      </Card>

      {/* ② 碳排放路径 */}
      <Card title="双碳路径 · 2030 达峰 → 平台期 → 2060 中和（示意）" className="mb-6">
        <EChart option={carbonPathOpt} style={{ height: 280 }} />
        <Grid cols={3} className="mt-4">
          {[
            ['达峰 ≠ 拐点即下行', '工程预期是「达峰后平台期」：2030–2035 总量在高位徘徊，电力需求增量先由新能源吸收，存量煤电再逐步退出——「先立后破」。', '#e8a317'],
            ['30 年 vs 60–70 年', '欧美从达峰到中和有 60–70 年缓冲；中国承诺只用 30 年完成同样跨度——这是全球最陡的减碳斜率，也是全部产业政策的硬约束。', '#22d3ee'],
            ['负排放兜底', '2060 净零不等于零排放：钢铁/水泥/航空的残余排放，依赖 CCUS 与林业碳汇等负排放技术对冲——这正是 CCER 的远期定价逻辑。', '#10b981'],
          ].map(([t, d, c]) => (
            <div key={t} style={{ borderLeft: `2px solid ${c}`, paddingLeft: 10 }}>
              <div className="text-xs font-semibold mb-1" style={{ color: c }}>{t}</div>
              <p className="text-[11px] leading-relaxed" style={{ color: 'var(--text-tertiary)' }}>{d}</p>
            </div>
          ))}
        </Grid>
      </Card>

      {/* ③ 空气质量 + 能源脱碳 */}
      <Grid cols={2} className="mb-6">
        <Card title="空气质量改善 · PM2.5 vs 优良天数（双轴）">
          <EChart option={airOpt} style={{ height: 240 }} />
          <div className="os-card p-3 mt-3" style={{ background: 'var(--bg-elevated)', borderLeft: '3px solid #22d3ee' }}>
            <p className="text-[11px] leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
              <strong style={{ color: 'var(--text-primary)' }}>「北京蓝」样本：</strong>北京 PM2.5 从 2013 年 89.5 降至 2024 年 30.5 μg/m³——燃煤锅炉清零、国 VI 排放、区域联防联控三线并进。被 UNEP 称为「特大城市大气治理的可复制案例」；代价是上千亿治理投入与周边产业转移成本。
            </p>
          </div>
        </Card>
        <Card title="能源结构脱碳 · 煤降 vs 非化石升">
          <EChart option={energyOpt} style={{ height: 240 }} />
          <div className="os-card p-3 mt-3" style={{ background: 'var(--bg-elevated)', borderLeft: '3px solid #a16207' }}>
            <p className="text-[11px] leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
              <strong style={{ color: 'var(--text-primary)' }}>剪刀差的另一面：</strong>占比下降不等于总量下降——煤炭消费绝对量在保供周期仍创新高。脱碳的真实战场在电力系统：风光装机已超煤电，但出力波动让煤电从「主力电源」转为「兜底调节」，退役曲线取决于储能与电网改造速度（与能源模块呼应）。
            </p>
          </div>
        </Card>
      </Grid>

      {/* ④ 碳市场机制 */}
      <Card title="碳市场机制 · 配额 / CCER / 绿证三轨" className="mb-6">
        <Grid cols={3} className="mb-4">
          {CARBON_MECHANISMS.map((m) => (
            <div key={m.title} className="os-card p-4" style={{ background: 'var(--bg-elevated)', borderLeft: `3px solid ${m.accent}` }}>
              <div className="flex items-baseline gap-2 mb-1">
                <span className="text-sm font-semibold" style={{ color: m.accent }}>{m.title}</span>
                <span className="text-[10px] mono" style={{ color: 'var(--text-tertiary)' }}>{m.tag}</span>
              </div>
              <p className="text-[11px] leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{m.body}</p>
            </div>
          ))}
        </Grid>
        <Grid cols={2}>
          <Card title="碳价对比（折合 €/t · 示意）">
            <EChart option={carbonPriceOpt} style={{ height: 200 }} />
          </Card>
          <Card title="价差即政策空间">
            <div className="space-y-2">
              {[
                ['为何中国碳价低', '免费配额 + 仅覆盖电力 + 强度基准而非总量封顶——碳价被刻意压在企业可承受区间，优先保证机制存活与数据真实。', '#c41e3a'],
                ['CBAM 倒逼收敛', '欧盟碳关税按欧中碳价差补税：价差越大，出口端被欧盟「代收」的碳成本越多——倒逼国内碳价上行与行业扩围。', '#3b82f6'],
                ['有偿分配是下一步', '配额从免费到拍卖、行业从电力到八大行业、总量从强度到绝对封顶——三步走完，碳价才成为真正的减排信号。', '#e8a317'],
              ].map(([t, d, c]) => (
                <div key={t} style={{ borderLeft: `2px solid ${c}`, paddingLeft: 10 }}>
                  <div className="text-xs font-semibold" style={{ color: c }}>{t}</div>
                  <p className="text-[11px] leading-relaxed" style={{ color: 'var(--text-tertiary)' }}>{d}</p>
                </div>
              ))}
            </div>
          </Card>
        </Grid>
      </Card>

      {/* ⑤ 治理雷达 + GEP */}
      <Grid cols={2} className="mb-6">
        <Card title="生态治理六维雷达（强度示意）">
          <EChart option={govRadar} style={{ height: 240 }} />
          <p className="text-[11px] mt-2 leading-relaxed" style={{ color: 'var(--text-tertiary)' }}>
            大气/水/制度建设已成体系；土壤管控与固废是明显短板——前者贵在修复成本，后者难在全链条闭环。雷达的不均衡即「十五五」环保投资的方向指引。
          </p>
        </Card>
        <Card title="GEP 核算 · 给绿水青山定价">
          <div className="space-y-2 mb-3">
            {GEP_LAYERS.map(([t, d]) => (
              <div key={t} style={{ borderLeft: '2px solid #e8a317', paddingLeft: 10 }}>
                <div className="text-xs font-semibold" style={{ color: 'var(--text-primary)' }}>{t}</div>
                <p className="text-[11px] leading-relaxed" style={{ color: 'var(--text-tertiary)' }}>{d}</p>
              </div>
            ))}
          </div>
          <EChart option={gepBarOpt} style={{ height: 170 }} />
        </Card>
      </Grid>

      {/* ⑥ 制度演进时间线 */}
      <Card title="交互 · 生态文明制度演进时间线" className="mb-6">
        <TimelineBar stages={ECO_TIMELINE} activeIdx={stageIdx} onSelect={setStageIdx} />
      </Card>

      {/* ⑦ 既有：三支柱选择器 */}
      <Card title="交互 · 生态文明三支柱选择器" className="mb-6">
        <SelectorBar items={PILLARS} activeKey={pillar} onSelect={setPillar} />
        <div className="os-card p-4 mb-4" style={{ background: 'var(--bg-elevated)', borderLeft: `3px solid ${p.accent}` }}>
          <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{p.desc}</p>
        </div>
        <Grid cols={2}>
          <Card title="森林覆盖率变迁"><EChart option={forestTrend} style={{ height: 220 }} /></Card>
          <Card title="支柱能力雷达（随切换）"><EChart option={pillarRadar} style={{ height: 220 }} /></Card>
        </Grid>
      </Card>

      <Card title="国家公园 · 系统治理" className="mb-6">
        <Grid cols={5}>
          {PARKS.map(([t, d]) => (
            <div key={t} style={{ borderLeft: '2px solid #10b981', paddingLeft: 10 }}>
              <div className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>{t}</div>
              <p className="text-[11px] mt-1 leading-relaxed" style={{ color: 'var(--text-tertiary)' }}>{d}</p>
            </div>
          ))}
        </Grid>
      </Card>

      <Grid cols={2} className="mb-6">
        <Card title="物种回归（指数 2000=100）"><EChart option={speciesChart} style={{ height: 200 }} /></Card>
        <Card title="制度创新 · 生态资产可定价">
          <div className="space-y-2">
            {[['GEP 核算', '生态系统生产总值量化入账。'], ['碳汇交易', '把固碳服务转化为现金流。'], ['COP15', '昆明-蒙特利尔框架 3030 目标。']].map(([t, d]) => (
              <div key={t} style={{ borderLeft: '2px solid #e8a317', paddingLeft: 10 }}>
                <div className="text-xs font-semibold" style={{ color: 'var(--text-primary)' }}>{t}</div>
                <p className="text-[11px]" style={{ color: 'var(--text-tertiary)' }}>{d}</p>
              </div>
            ))}
          </div>
        </Card>
      </Grid>

      {/* ⑧ FrameworkTrio：再平衡 / 督察 / 资本化 */}
      <FrameworkTrio cards={[
        { title: '增长与减碳的再平衡', subtitle: '先立后破 · 能源安全优先', body: '减碳不被允许冲击增长与保供底线：新能源体系先立、煤电兜底后破。2021 限电潮后「运动式减碳」被点名纠偏——双碳是 30 年工程，不是政绩竞赛。', pillars: [['能耗→碳排双控', '考核口径换轨。'], ['保供红线', '煤电仍是压舱石。'], ['新能源飞轮', '减碳目标喂养产业。']] },
        { title: '环保督察利剑', subtitle: '中央督察 · 压力传导', body: '中央生态环保督察直插省级党委政府，公开通报 + 个案问责 + 回头看，把环保从「环保局的事」变成「书记省长的事」——官僚系统内最锋利的纵向压力传导装置之一。', pillars: [['党政同责', '一岗双责入考核。'], ['公开曝光', '典型案例点名到地市。'], ['一刀切反噬', '过度执行需二次纠偏。']] },
        { title: '生态资本化', subtitle: 'GEP · 碳汇 · 绿色金融', body: '终局是让生态保护自带现金流：GEP 把生态算成资产，碳汇/绿证把固碳变成收入，绿色信贷与转型债券把资金导向减排——保护从财政供养转向市场闭环。', pillars: [['两山转化', '丽水/三明试点先行。'], ['CCER 重启', '林业碳汇可抵销。'], ['绿色金融', '碳定价的资金接口。']] },
      ]} />

      <ModuleFooter moduleId="ecology" sourceNote="由 tabs/ecology.html 迁移升级" disclaimer="公开资料整理，数值为示意非官方口径 · 仅供分析框架参考，非投资建议" />
    </div>
  );
}
