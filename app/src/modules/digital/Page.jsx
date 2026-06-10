import React, { useState, useMemo } from 'react';
import { PageHeader, Card, Grid, Stat } from '../../app/ui.jsx';
import EChart from '../../lib/viz/EChart.jsx';
import { categoryX, valueY, logY, GRID, donutOpt, radarOpt, stackedBarOpt } from '../shared/chartHelpers.js';
import { IntroCard, SelectorBar, TimelineBar, FrameworkTrio, ModuleFooter } from '../shared/ModuleParadigm.jsx';

// ---------------------------------------------------------------------------
// 数据层（示意值 · 公开资料口径整理）
// ---------------------------------------------------------------------------

const YEARS = ['2016', '2018', '2020', '2021', '2022', '2023', '2024'];

// 数字经济总规模（万亿元）与占 GDP 比重（%）
const DE_SCALE = [22.6, 31.3, 39.2, 45.5, 50.2, 53.9, 57.8];
const DE_SHARE = [30.3, 34.8, 38.6, 39.8, 41.5, 42.8, 43.6];

// 数字产业化 / 产业数字化 占数字经济比重（%）—— 结构性此消彼长
const DIGITIZATION_SPLIT = {
  industrialization: [22.4, 21.0, 19.1, 18.3, 18.3, 18.7, 19.0], // 数字产业化
  digitalization: [77.6, 79.0, 80.9, 81.7, 81.7, 81.3, 81.0],   // 产业数字化
};

// 平台监管周期：政策温度指数（0=放任 100=最严）+ 标志事件
const REG_YEARS = ['2014', '2016', '2018', '2019', '2020', '2021', '2022', '2023', '2024', '2025'];
const REG_INDEX = [10, 15, 22, 28, 62, 92, 85, 55, 42, 40];
const REG_EVENTS = [
  { year: '2014', label: '电商平台上市潮', detail: '资本与流量共振，"互联网+"写入政府工作报告。' },
  { year: '2020', label: '蚂蚁 IPO 暂缓', detail: '金融科技纳入审慎监管框架，平台扩张逻辑转折点。' },
  { year: '2021', label: '反垄断罚单 / 数据安全审查', detail: '"二选一"被罚、网络安全审查启动，强监管峰值。' },
  { year: '2023', label: '常态化监管 · 绿灯案例', detail: '政策基调转为"支持平台企业大显身手"，整改阶段收束。' },
  { year: '2025', label: 'AI 重估平台价值', detail: '大模型竞赛重新打开平台资本开支与估值空间。' },
];

// 数实融合渗透率（%）
const FUSION_SECTORS = ['工业互联网', '智能制造', '数字物流', '数字农业', '智慧能源', '数字医疗'];
const FUSION_RATE = [46, 62, 58, 27, 41, 35];
const FUSION_NOTE = ['平台连接设备数 1 亿+', '灯塔工厂数全球第一', '电子面单近乎全覆盖', '渗透最浅 · 政策补课区', '电网数字化先行', '数据孤岛与合规约束并存'];

// 中美数字经济对比（雷达 · 双系列 → 自写内联 option）
const CN_US_DIMS = ['总体规模', '平台全球化', '硬科技底座', '数据资源规模', '数字治理强度', '出海能力'];
const CN_VALUES = [72, 55, 58, 90, 88, 62];
const US_VALUES = [100, 95, 92, 70, 45, 90];

// 电商与新业态（渗透率 % · 直播电商规模 万亿元）
const ECOM_YEARS = ['2017', '2019', '2021', '2023', '2025E'];
const ECOM_PENETRATION = [15.0, 20.7, 24.5, 27.6, 32.0];
const LIVE_ECOM = [0.02, 0.4, 2.3, 4.9, 6.8];

// 板块选择器：六大板块
const SECTORS = [
  {
    key: 'platform', label: '平台经济', accent: '#c41e3a',
    scale: '市值前十平台合计超 2 万亿美元', cases: '腾讯 / 阿里 / 拼多多 / 字节 / 美团',
    cycle: '野蛮生长 → 强监管 → 常态化（红绿灯）',
    tension: '平台权力与国家规制的边界反复校准；资本回报与"脱虚向实"政策目标之间的张力是长期变量。',
    trend: { unit: '指数', data: [100, 168, 230, 190, 150, 175, 210], note: '平台市值指数（2016=100）：2021 监管峰值回撤近 40%，AI 叙事驱动修复。' },
    donut: [
      { value: 38, name: '电商交易', itemStyle: { color: '#c41e3a' } },
      { value: 24, name: '社交内容', itemStyle: { color: '#e8a317' } },
      { value: 18, name: '本地生活', itemStyle: { color: '#22d3ee' } },
      { value: 12, name: '金融科技', itemStyle: { color: '#10b981' } },
      { value: 8, name: '云与企服', itemStyle: { color: '#a78bfa' } },
    ],
    donutTitle: '平台收入结构（示意 %）',
  },
  {
    key: 'ecom', label: '电子商务', accent: '#e8a317',
    scale: '网络零售额约 15.5 万亿元 · 全球第一', cases: '淘天 / 京东 / 拼多多 / 抖音电商',
    cycle: '货架电商 → 社交拼购 → 直播/兴趣电商 → 即时零售',
    tension: '渗透率逼近天花板后，竞争从增量转向存量；低价内卷与商家生态健康度互为代价。',
    trend: { unit: '万亿元', data: [5.2, 9.0, 11.8, 13.1, 13.8, 15.4, 15.5], note: '网络零售额：增速从 30%+ 降至个位数，规模红利收敛。' },
    donut: [
      { value: 52, name: '传统货架', itemStyle: { color: '#e8a317' } },
      { value: 28, name: '直播/兴趣电商', itemStyle: { color: '#c41e3a' } },
      { value: 12, name: '即时零售', itemStyle: { color: '#22d3ee' } },
      { value: 8, name: '跨境电商', itemStyle: { color: '#10b981' } },
    ],
    donutTitle: '电商业态结构（示意 %）',
  },
  {
    key: 'digi-ind', label: '数字产业化', accent: '#22d3ee',
    scale: '核心产业增加值约 10 万亿元', cases: '华为 / 中芯 / 三大运营商 / 智算中心',
    cycle: '通信设备 → 消费电子 → 云计算 → 智算基建',
    tension: '占数字经济比重不足两成但卡位最关键；芯片/操作系统等底座环节仍受外部供给约束。',
    trend: { unit: 'EFLOPS', data: [30, 60, 100, 140, 180, 230, 280], note: '智能算力规模：东数西算 + 大模型训练驱动陡峭爬坡。' },
    donut: [
      { value: 35, name: '电子信息制造', itemStyle: { color: '#22d3ee' } },
      { value: 25, name: '电信业', itemStyle: { color: '#c41e3a' } },
      { value: 22, name: '软件服务', itemStyle: { color: '#e8a317' } },
      { value: 18, name: '互联网行业', itemStyle: { color: '#10b981' } },
    ],
    donutTitle: '核心产业构成（示意 %）',
  },
  {
    key: 'ind-digi', label: '产业数字化', accent: '#10b981',
    scale: '约 44 万亿元 · 占数字经济八成', cases: '灯塔工厂 / 工业互联网双跨平台',
    cycle: '信息化补课 → 上云用数 → 智改数转 → AI 赋能',
    tension: '大企业样板易做、中小企业渗透难；"数字化转型"补贴与真实生产率提升之间存在落差。',
    trend: { unit: '万亿元', data: [17.5, 24.9, 31.7, 37.2, 41.0, 43.8, 46.8], note: '产业数字化规模：数字经济增长的绝对主引擎。' },
    donut: [
      { value: 44, name: '服务业数字化', itemStyle: { color: '#10b981' } },
      { value: 33, name: '工业数字化', itemStyle: { color: '#22d3ee' } },
      { value: 13, name: '商贸流通', itemStyle: { color: '#e8a317' } },
      { value: 10, name: '农业数字化', itemStyle: { color: '#c41e3a' } },
    ],
    donutTitle: '产业数字化分布（示意 %）',
  },
  {
    key: 'e-gov', label: '数字政府', accent: '#a78bfa',
    scale: '一体化政务平台注册用户 10 亿+', cases: '浙里办 / 粤省事 / 随申办 / 健康码遗产',
    cycle: '政务上网 → 一网通办 → 数据共享 → 城市大脑',
    tension: '治理效率与个体数据权利的平衡未定型；健康码证明了动员能力，也留下了权力边界议题。',
    trend: { unit: '亿人', data: [2.4, 3.9, 8.1, 9.2, 9.7, 10.2, 10.6], note: '在线政务服务用户规模：疫情三年完成强制性普及。' },
    donut: [
      { value: 40, name: '一网通办', itemStyle: { color: '#a78bfa' } },
      { value: 25, name: '监管与执法数字化', itemStyle: { color: '#c41e3a' } },
      { value: 20, name: '城市运行中枢', itemStyle: { color: '#22d3ee' } },
      { value: 15, name: '公共数据开放', itemStyle: { color: '#10b981' } },
    ],
    donutTitle: '数字政府投入结构（示意 %）',
  },
  {
    key: 'silk', label: '数字丝路出海', accent: '#f97316',
    scale: '跨境电商进出口约 2.6 万亿元', cases: 'TikTok / Temu / SHEIN / 速卖通 / 华为云出海',
    cycle: '产品出海 → 平台出海 → 基建与规则出海',
    tension: '商业全球化与地缘审查同步升级；TikTok 法案表明数字主权博弈已从市场竞争升维为立法对抗。',
    trend: { unit: '万亿元', data: [0.5, 1.0, 1.7, 1.9, 2.1, 2.4, 2.6], note: '跨境电商规模：四小龙重塑全球零售供应链。' },
    donut: [
      { value: 45, name: '跨境电商', itemStyle: { color: '#f97316' } },
      { value: 25, name: '内容与社交出海', itemStyle: { color: '#c41e3a' } },
      { value: 18, name: '云与数字基建', itemStyle: { color: '#22d3ee' } },
      { value: 12, name: '游戏出海', itemStyle: { color: '#10b981' } },
    ],
    donutTitle: '数字出海结构（示意 %）',
  },
];

// 演进时间线：五阶段
const PHASES = [
  { period: '1994–2008', title: '互联网普及', accent: '#64748b', desc: '从拨号上网到门户三巨头；数字经济作为"新经济"叙事登场，基础设施与网民规模完成原始积累。' },
  { period: '2009–2019', title: '移动互联网 / 平台爆发', accent: '#22d3ee', desc: '智能手机 + 移动支付双轮驱动，平台经济无序扩张期；流量红利造就全球第二大数字经济体，监管整体宽容。' },
  { period: '2020–2022', title: '强监管整改', accent: '#e8a317', desc: '反垄断、数据安全、算法备案密集落地；蚂蚁 IPO 暂缓与网络安全审查标志资本无序扩张时代终结。' },
  { period: '2023–2024', title: '数实融合 / 常态化监管', accent: '#c41e3a', desc: '红绿灯机制明确边界，政策转向"支持平台大显身手"；增长引擎从消费互联网切换至产业数字化与数据要素。' },
  { period: '2025–', title: 'AI 驱动数字经济 2.0', accent: '#10b981', desc: '大模型重估平台价值与算力基建；数字经济竞争升维为"算力 × 数据 × 规则"的国家系统对抗。' },
];

// ---------------------------------------------------------------------------
// 页面
// ---------------------------------------------------------------------------

export default function Page() {
  const [sectorKey, setSectorKey] = useState('platform');
  const [phaseIdx, setPhaseIdx] = useState(3);
  const [regIdx, setRegIdx] = useState(2);
  const sector = SECTORS.find((s) => s.key === sectorKey) || SECTORS[0];
  const regEvent = REG_EVENTS[regIdx];

  // 图① 数字经济总规模（柱）+ GDP 占比（线 · 双轴）
  const scaleOpt = useMemo(() => ({
    tooltip: { trigger: 'axis' },
    legend: { top: 0, textStyle: { color: '#93a1b5', fontSize: 10 }, itemWidth: 12 },
    grid: { left: 44, right: 44, top: 30, bottom: 24 },
    xAxis: categoryX(YEARS),
    yAxis: [
      valueY({ name: '万亿元' }),
      valueY({ name: '%', max: 50, splitLine: { show: false } }),
    ],
    series: [
      { name: '总规模', type: 'bar', data: DE_SCALE, barWidth: 18, itemStyle: { color: '#22d3ee', borderRadius: [3, 3, 0, 0] } },
      { name: 'GDP 占比', type: 'line', yAxisIndex: 1, smooth: true, data: DE_SHARE, lineStyle: { color: '#c41e3a', width: 2 }, itemStyle: { color: '#c41e3a' } },
    ],
  }), []);

  // 图② 数字产业化 vs 产业数字化 结构占比（堆叠）
  const splitOpt = useMemo(() => stackedBarOpt({
    categories: YEARS,
    series: [
      { name: '产业数字化', data: DIGITIZATION_SPLIT.digitalization, itemStyle: { color: '#10b981' } },
      { name: '数字产业化', data: DIGITIZATION_SPLIT.industrialization, itemStyle: { color: '#22d3ee' } },
    ],
  }), []);

  // 图③ 平台监管周期曲线（政策温度指数 + 事件标注）
  const regCycleOpt = useMemo(() => ({
    tooltip: { trigger: 'axis' },
    grid: { left: 40, right: 24, top: 24, bottom: 24 },
    xAxis: categoryX(REG_YEARS),
    yAxis: valueY({ max: 100, name: '政策温度' }),
    series: [{
      type: 'line', smooth: true,
      data: REG_INDEX.map((v, i) => {
        const hit = REG_EVENTS.find((e) => e.year === REG_YEARS[i]);
        const active = hit && hit.year === regEvent.year;
        return { value: v, symbolSize: hit ? (active ? 12 : 8) : 4, itemStyle: { color: active ? '#e8a317' : hit ? '#c41e3a' : '#64748b' } };
      }),
      lineStyle: { color: '#c41e3a', width: 2 },
      areaStyle: { color: 'rgba(196,30,58,0.12)' },
      markArea: {
        silent: true, itemStyle: { color: 'rgba(232,163,23,0.07)' },
        data: [[{ xAxis: '2020' }, { xAxis: '2022' }]],
        label: { show: false },
      },
    }],
  }), [regEvent]);

  // 图④ 数实融合渗透率（横向 bar）
  const fusionOpt = useMemo(() => ({
    tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' }, formatter: (ps) => `${ps[0].name}：${ps[0].value}%<br/>${FUSION_NOTE[ps[0].dataIndex]}` },
    grid: { left: 76, right: 40, top: 16, bottom: 24 },
    xAxis: valueY({ max: 100, axisLabel: { formatter: '{value}%' } }),
    yAxis: categoryX(FUSION_SECTORS),
    series: [{
      type: 'bar', barWidth: 14,
      data: FUSION_RATE.map((v) => ({ value: v, itemStyle: { color: v >= 50 ? '#10b981' : v >= 35 ? '#e8a317' : '#c41e3a', borderRadius: 3 } })),
      label: { show: true, position: 'right', color: '#93a1b5', formatter: '{c}%' },
    }],
  }), []);

  // 图⑤ 中美数字经济对比雷达（双系列 → 内联 option）
  const cnUsRadarOpt = useMemo(() => ({
    legend: { top: 0, textStyle: { color: '#93a1b5', fontSize: 10 }, itemWidth: 12, data: ['中国', '美国'] },
    radar: {
      indicator: CN_US_DIMS.map((n) => ({ name: n, max: 100 })),
      axisName: { color: '#93a1b5', fontSize: 10 },
      splitLine: { lineStyle: { color: 'rgba(148,163,184,0.15)' } },
      axisLine: { lineStyle: { color: 'rgba(148,163,184,0.15)' } },
      splitArea: { show: false },
      radius: '62%',
    },
    series: [{
      type: 'radar',
      data: [
        { value: CN_VALUES, name: '中国', lineStyle: { color: '#c41e3a', width: 2 }, itemStyle: { color: '#c41e3a' }, areaStyle: { color: 'rgba(196,30,58,0.15)' } },
        { value: US_VALUES, name: '美国', lineStyle: { color: '#22d3ee', width: 2 }, itemStyle: { color: '#22d3ee' }, areaStyle: { color: 'rgba(34,211,238,0.10)' } },
      ],
    }],
  }), []);

  // 图⑥ 电商渗透率 + 直播电商规模（双轴）
  const ecomOpt = useMemo(() => ({
    tooltip: { trigger: 'axis' },
    legend: { top: 0, textStyle: { color: '#93a1b5', fontSize: 10 }, itemWidth: 12 },
    grid: { left: 44, right: 44, top: 30, bottom: 24 },
    xAxis: categoryX(ECOM_YEARS),
    yAxis: [
      valueY({ name: '渗透率 %', max: 40 }),
      valueY({ name: '万亿元', splitLine: { show: false } }),
    ],
    series: [
      { name: '网络零售渗透率', type: 'line', smooth: true, data: ECOM_PENETRATION, lineStyle: { color: '#e8a317', width: 2 }, itemStyle: { color: '#e8a317' }, areaStyle: { color: 'rgba(232,163,23,0.10)' } },
      { name: '直播电商规模', type: 'bar', yAxisIndex: 1, data: LIVE_ECOM, barWidth: 16, itemStyle: { color: '#c41e3a', borderRadius: [3, 3, 0, 0] } },
    ],
  }), []);

  // 板块联动：规模趋势
  const sectorTrendOpt = useMemo(() => ({
    tooltip: { trigger: 'axis' },
    grid: GRID,
    xAxis: categoryX(YEARS),
    yAxis: valueY({ name: sector.trend.unit }),
    series: [{
      type: 'line', smooth: true, symbol: 'circle', symbolSize: 5,
      data: sector.trend.data,
      lineStyle: { color: sector.accent, width: 2 },
      itemStyle: { color: sector.accent },
      areaStyle: { color: `${sector.accent}1f` },
    }],
  }), [sector]);

  // 板块联动：结构 donut
  const sectorDonutOpt = useMemo(() => donutOpt(sector.donut), [sector]);

  // 板块治理雷达（单系列 → radarOpt）
  const sectorGovOpt = useMemo(() => {
    const profiles = {
      platform: [92, 88, 90, 80, 78], ecom: [88, 72, 85, 60, 82], 'digi-ind': [50, 75, 55, 45, 40],
      'ind-digi': [42, 68, 50, 38, 55], 'e-gov': [60, 95, 80, 70, 50], silk: [70, 90, 65, 55, 60],
    };
    return radarOpt(['反垄断压力', '数据合规强度', '算法监管', '金融审慎', '用工/生态责任'], profiles[sector.key], { name: sector.label, color: sector.accent });
  }, [sector]);

  return (
    <div>
      <PageHeader badge="Digital Economy" title="数字经济 · 数实融合" subtitle="从流量红利到系统竞争 —— 总量近 60 万亿、占 GDP 超四成的权力与产业重构" />
      <IntroCard>
        数字经济的叙事已经换轨三次：消费互联网吃流量红利，强监管重划平台与国家的权力边界，如今的主线是
        <strong style={{ color: 'var(--text-primary)' }}>数实融合 + 数据要素 + AI 算力</strong>。
        总量数字仍在增长，但真正值得盯的是三个结构变量：产业数字化对数字产业化的比例（实体渗透深度）、
        监管温度曲线的斜率（资本与权力的均衡点）、以及出海板块遭遇的规则对抗烈度（数字主权竞争）。
        平台不再是法外的增长机器，而是被纳入国家系统的功能组件——这是理解一切数字经济政策的前提。
      </IntroCard>

      {/* 概览 Stat */}
      <Grid cols={4} className="mb-6">
        <Stat value="57.8 T" label="数字经济规模 (元 · 示意)" accent="#22d3ee" />
        <Stat value="43.6%" label="占 GDP 比重" accent="#c41e3a" />
        <Stat value="30+" label="百亿美元级平台企业" accent="#e8a317" />
        <Stat value="27.6%" label="网络零售渗透率" accent="#10b981" />
      </Grid>

      {/* 交互① 六板块选择器 */}
      <Card title="交互① · 数字经济六板块选择器（规模 / 案例 / 政策周期 / 张力联动）" className="mb-6">
        <SelectorBar items={SECTORS} activeKey={sectorKey} onSelect={setSectorKey} />
        <div className="os-card p-4 mb-4" style={{ background: 'var(--bg-elevated)', borderLeft: `3px solid ${sector.accent}` }}>
          <div className="grid gap-3 mb-3" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))' }}>
            {[['规模坐标', sector.scale], ['代表企业 / 案例', sector.cases], ['政策周期', sector.cycle]].map(([k, v]) => (
              <div key={k}>
                <div className="text-[11px] mono mb-1" style={{ color: 'var(--text-tertiary)' }}>{k}</div>
                <div className="text-sm" style={{ color: 'var(--text-primary)' }}>{v}</div>
              </div>
            ))}
          </div>
          <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
            <span className="mono text-[11px]" style={{ color: sector.accent }}>结构张力 · </span>{sector.tension}
          </p>
        </div>
        <Grid cols={3}>
          <Card title={`规模趋势（${sector.trend.unit}）`}>
            <EChart option={sectorTrendOpt} style={{ height: 220 }} />
            <p className="text-[11px] mt-2 leading-relaxed" style={{ color: 'var(--text-tertiary)' }}>{sector.trend.note}</p>
          </Card>
          <Card title={sector.donutTitle}>
            <EChart option={sectorDonutOpt} style={{ height: 240 }} />
          </Card>
          <Card title="监管压力画像（随板块切换）">
            <EChart option={sectorGovOpt} style={{ height: 240 }} />
          </Card>
        </Grid>
      </Card>

      {/* 总量与结构 */}
      <Grid cols={2} className="mb-6">
        <Card title="数字经济总规模与 GDP 占比（万亿元 / %）">
          <EChart option={scaleOpt} style={{ height: 260 }} />
          <p className="text-[11px] mt-2 leading-relaxed" style={{ color: 'var(--text-tertiary)' }}>
            占比增速正在放缓——总量叙事见顶，结构升级（产业渗透 + 数据要素）接棒为唯一可信的增长来源。
          </p>
        </Card>
        <Card title="数字产业化 vs 产业数字化（占数字经济 %）">
          <EChart option={splitOpt} style={{ height: 260 }} />
          <p className="text-[11px] mt-2 leading-relaxed" style={{ color: 'var(--text-tertiary)' }}>
            八二格局长期稳定：产业数字化是规模主体，数字产业化是控制权所在——比重小，但芯片/算力/系统软件决定整个体系的上限。
          </p>
        </Card>
      </Grid>

      {/* 交互② 平台监管周期 */}
      <Card title="交互② · 平台经济监管周期（政策温度指数 · 点选标志事件）" className="mb-6">
        <SelectorBar
          items={REG_EVENTS.map((e, i) => ({ key: String(i), label: `${e.year} ${e.label}`, accent: i === 2 ? '#e8a317' : '#c41e3a' }))}
          activeKey={String(regIdx)} onSelect={(k) => setRegIdx(Number(k))} />
        <Grid cols={2}>
          <EChart option={regCycleOpt} style={{ height: 250 }} />
          <div className="os-card p-5" style={{ background: 'var(--bg-elevated)', borderLeft: '3px solid var(--china-red)' }}>
            <div className="text-sm font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>{regEvent.year} · {regEvent.label}</div>
            <p className="text-sm leading-relaxed mb-3" style={{ color: 'var(--text-secondary)' }}>{regEvent.detail}</p>
            <p className="text-[11px] leading-relaxed" style={{ color: 'var(--text-tertiary)' }}>
              周期解读：监管不是开关而是温度计——2021 年的峰值校正了资本与权力的相对位置，此后的"常态化"意味着边界已划定、
              博弈转入规则内进行。绿灯案例的本质是：平台被允许做大，但方向由系统设定。
            </p>
          </div>
        </Grid>
      </Card>

      {/* 数实融合渗透 + 中美对比 */}
      <Grid cols={2} className="mb-6">
        <Card title="数实融合渗透率（% · 示意）">
          <EChart option={fusionOpt} style={{ height: 260 }} />
          <p className="text-[11px] mt-2 leading-relaxed" style={{ color: 'var(--text-tertiary)' }}>
            渗透梯度即政策梯度：智能制造样板充足，数字农业是最深的洼地——下一轮财政与数据要素政策的指向标。
          </p>
        </Card>
        <Card title="中美数字经济实力对比（综合指数 · 示意）">
          <EChart option={cnUsRadarOpt} style={{ height: 260 }} />
          <p className="text-[11px] mt-2 leading-relaxed" style={{ color: 'var(--text-tertiary)' }}>
            非对称格局：中国赢在数据规模与治理动员，美国赢在硬科技底座与平台全球化——双方都在补对方的长板，竞争因此升维。
          </p>
        </Card>
      </Grid>

      {/* 电商与新业态 */}
      <Card title="电商与新业态：渗透率见顶 · 直播电商接棒（示意）" className="mb-6">
        <EChart option={ecomOpt} style={{ height: 260 }} />
        <Grid cols={3} className="mt-3">
          {[['渗透天花板', '网络零售渗透率逼近 30% 后边际趋缓，电商从增长故事变为效率与供应链故事。'],
            ['业态轮替', '货架 → 拼购 → 直播/兴趣 → 即时零售，每一轮业态创新都是对存量流量的再分配而非增量创造。'],
            ['出海溢出', '国内内卷的直接产物是 Temu/SHEIN 式全托管出海——把供应链效率优势输出为全球价格权力。']].map(([t, d]) => (
            <div key={t}>
              <div className="text-xs font-semibold mb-1" style={{ color: 'var(--fire-gold)' }}>{t}</div>
              <p className="text-[11px] leading-relaxed" style={{ color: 'var(--text-tertiary)' }}>{d}</p>
            </div>
          ))}
        </Grid>
      </Card>

      {/* 交互③ 演进时间线 */}
      <Card title="交互③ · 数字经济演进五阶段" className="mb-6">
        <TimelineBar stages={PHASES} activeIdx={phaseIdx} onSelect={setPhaseIdx} />
      </Card>

      {/* 框架三卡 */}
      <FrameworkTrio cards={[
        {
          title: '数实融合主线', subtitle: '数字技术 × 实体产业的乘数',
          body: '数字经济 2.0 的核心命题不是"线上替代线下"，而是数字技术对全要素生产率的乘数效应——渗透率每深入一层，就重写一个行业的成本曲线。',
          pillars: [['工业互联网', '设备连接是入口，工艺知识数字化才是壁垒。'], ['数据要素', '确权、入表、交易——把数据变成可计价的生产资料。'], ['AI 赋能', '行业大模型把渗透从"上云"推进到"换脑"。']],
        },
        {
          title: '平台权力与规制', subtitle: '从资本无序扩张到红绿灯',
          body: '平台监管周期本质是一次权力再校准：资本曾借流量垄断获得准主权能力（支付、信用、舆论），强监管将其重新嵌入国家系统，常态化意味着新均衡达成。',
          pillars: [['反垄断', '拆除"二选一"等私权力围墙，恢复竞争秩序。'], ['数据安全', '数据出境与安全审查——平台数据被界定为国家资源。'], ['绿灯机制', '允许做大，但投向由系统引导：硬科技与实体经济。']],
        },
        {
          title: '数字主权', subtitle: '数据 / 平台 / 规则的国家竞争',
          body: '数字经济的终局竞争不在市场份额而在规则制定权：谁定义数据跨境规则、谁掌握算力底座、谁的平台嵌入他国日常生活——TikTok 法案是这场竞争的显影剂。',
          pillars: [['数据主权', '分类分级 + 出境评估，数据被纳入主权资产负债表。'], ['算力底座', '东数西算 + 国产芯片——底座自主是主权的物理前提。'], ['规则出海', 'DEPA/数字丝路：用市场规模换取规则话语权。']],
        },
      ]} />

      {/* 研判要点 */}
      <Card title="研判要点" className="mb-6">
        <Grid cols={4}>
          {[['1 · 看结构不看总量', 'GDP 占比增速放缓，数字产业化比重才是技术主权的真实刻度。'],
            ['2 · 监管温度趋稳', '红绿灯框架成型后，政策风险从"方向不确定"降级为"执行波动"。'],
            ['3 · 融合洼地即机会', '数字农业、中小制造的低渗透率是下一轮政策资源的确定流向。'],
            ['4 · 出海即前线', '数字出海的天花板由地缘立法而非商业竞争决定，需按对抗情景定价。']].map(([t, d]) => (
            <div key={t}>
              <div className="text-sm font-semibold" style={{ color: 'var(--china-red)' }}>{t}</div>
              <p className="text-xs mt-1 leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{d}</p>
            </div>
          ))}
        </Grid>
      </Card>

      <ModuleFooter moduleId="digital" disclaimer="数据为公开资料整理之示意值，规模/占比/指数均非官方统计口径 · 仅供分析框架参考，非投资建议" sourceNote="由 tabs/digital.html 迁移并扩容" />
    </div>
  );
}
