import React, { useState, useMemo } from 'react';
import { PageHeader, Card, Grid, Stat } from '../../app/ui.jsx';
import EChart from '../../lib/viz/EChart.jsx';
import { categoryX, valueY, logY, GRID, donutOpt, radarOpt, stackedBarOpt, AXIS, LABEL } from '../shared/chartHelpers.js';
import { IntroCard, SelectorBar, TimelineBar, FrameworkTrio, ModuleFooter } from '../shared/ModuleParadigm.jsx';

/* ============ 品类主数据（示意值） ============ */
const CATS = [
  {
    key: 'cad', label: 'CAD 设计', accent: '#e8a317', local: 32, difficulty: 78, weight: 85,
    monopoly: '达索 / 西门子 / Autodesk / PTC 四家合计 ~90% 高端市场',
    vendors: ['中望软件', '数码大方', '华天软件', '中科辅龙'],
    desc: '三维 CAD 的核心是几何内核（Parasolid / ACIS / CGM），全球商用内核基本被西门子与达索控制。国产 CAD 在 2D 领域已可替代，3D 高端装配 / 曲面 / 大模型场景仍是硬骨头。',
    share: [
      { name: '达索系', value: 30, itemStyle: { color: '#c41e3a' } },
      { name: '西门子系', value: 26, itemStyle: { color: '#e8a317' } },
      { name: 'Autodesk', value: 18, itemStyle: { color: '#22d3ee' } },
      { name: 'PTC', value: 12, itemStyle: { color: '#7c6cf0' } },
      { name: '国产 + 其他', value: 14, itemStyle: { color: '#10b981' } },
    ],
    maturity: [12, 18, 24, 30, 38],
    risk: '断供即停摆：高端制造的图纸、装配、工艺全在外企格式里。',
  },
  {
    key: 'cae', label: 'CAE 仿真', accent: '#c41e3a', local: 8, difficulty: 95, weight: 95,
    monopoly: 'ANSYS / 西门子(Simcenter) / 达索(SIMULIA) / Altair 合计 ~85%',
    vendors: ['安世亚太', '英特仿真', '云道智造', '中仿科技'],
    desc: 'CAE 求解器是数学物理 + 数值方法 + 行业验证的数十年积累。结构 / 流体 / 电磁 / 多物理场耦合，每一个方向都是一座山。国产化率个位数，是工业软件最深的洼地。',
    share: [
      { name: 'ANSYS', value: 32, itemStyle: { color: '#c41e3a' } },
      { name: '西门子 Simcenter', value: 22, itemStyle: { color: '#e8a317' } },
      { name: '达索 SIMULIA', value: 18, itemStyle: { color: '#22d3ee' } },
      { name: 'Altair 等', value: 20, itemStyle: { color: '#7c6cf0' } },
      { name: '国产', value: 8, itemStyle: { color: '#10b981' } },
    ],
    maturity: [3, 5, 7, 9, 14],
    risk: '2020 年哈工大被禁用 MATLAB——民用仿真工具同样可以一夜归零。',
  },
  {
    key: 'eda', label: 'EDA', accent: '#7c6cf0', local: 12, difficulty: 92, weight: 98,
    monopoly: 'Synopsys / Cadence / 西门子 EDA 三巨头合计 ~78%（高端流程 ~95%）',
    vendors: ['华大九天', '概伦电子', '广立微', '芯华章'],
    desc: 'EDA 是芯片设计的唯一通路，与半导体共用同一条卡脖子链。国产在模拟 / 平板等局部点工具突破，数字全流程与先进工艺 PDK 协同仍受制于人。',
    share: [
      { name: 'Synopsys', value: 32, itemStyle: { color: '#c41e3a' } },
      { name: 'Cadence', value: 30, itemStyle: { color: '#e8a317' } },
      { name: '西门子 EDA', value: 16, itemStyle: { color: '#22d3ee' } },
      { name: '国产', value: 12, itemStyle: { color: '#10b981' } },
      { name: '其他', value: 10, itemStyle: { color: '#64748b' } },
    ],
    maturity: [5, 8, 11, 14, 20],
    risk: '出口管制清单上的常客：先进工艺 EDA 已对华受限。',
  },
  {
    key: 'plm', label: 'PLM 管理', accent: '#22d3ee', local: 38, difficulty: 60, weight: 70,
    monopoly: '西门子 Teamcenter / 达索 ENOVIA / PTC Windchill 占据大型制造业主流',
    vendors: ['用友', '华天软件', '能科科技', '湃睿科技'],
    desc: 'PLM 管理产品全生命周期数据，是 CAD/CAE 数据的"户口本"。替代难点不在功能而在迁移——十几年的 BOM 与工艺数据沉在外企数据库里。',
    share: [
      { name: '西门子', value: 28, itemStyle: { color: '#c41e3a' } },
      { name: '达索', value: 24, itemStyle: { color: '#e8a317' } },
      { name: 'PTC', value: 16, itemStyle: { color: '#22d3ee' } },
      { name: '国产', value: 22, itemStyle: { color: '#10b981' } },
      { name: '其他', value: 10, itemStyle: { color: '#64748b' } },
    ],
    maturity: [18, 24, 30, 38, 48],
    risk: '数据格式锁定：换系统等于给整个研发体系做一次心脏手术。',
  },
  {
    key: 'mes', label: 'MES 制造执行', accent: '#10b981', local: 55, difficulty: 45, weight: 65,
    monopoly: '西门子 / 罗克韦尔 / AVEVA 占高端流程行业，离散行业国产已成气候',
    vendors: ['宝信软件', '中控技术', '黑湖科技', '赛意信息'],
    desc: 'MES 贴着产线长，行业 Know-how 重于通用技术，国产厂商靠贴身服务在离散制造反超。难点在半导体 / 石化等高可靠场景的产线级验证。',
    share: [
      { name: '西门子', value: 18, itemStyle: { color: '#c41e3a' } },
      { name: '罗克韦尔', value: 12, itemStyle: { color: '#e8a317' } },
      { name: 'AVEVA 等', value: 15, itemStyle: { color: '#22d3ee' } },
      { name: '国产', value: 45, itemStyle: { color: '#10b981' } },
      { name: '其他', value: 10, itemStyle: { color: '#64748b' } },
    ],
    maturity: [35, 42, 48, 55, 65],
    risk: '产线不容试错：一次宕机的代价让用户天然保守。',
  },
  {
    key: 'erp', label: 'ERP', accent: '#3b82f6', local: 70, difficulty: 35, weight: 55,
    monopoly: 'SAP / Oracle 守住超大型央企与外向型集团，腰部以下国产主导',
    vendors: ['用友', '金蝶', '浪潮', '鼎捷'],
    desc: 'ERP 是国产化率最高的品类——管理软件的壁垒是流程而非算法。剩下的硬仗在大型央企核心账务系统的 SAP 替代（HANA 迁移）。',
    share: [
      { name: 'SAP', value: 22, itemStyle: { color: '#c41e3a' } },
      { name: 'Oracle', value: 8, itemStyle: { color: '#e8a317' } },
      { name: '用友', value: 28, itemStyle: { color: '#10b981' } },
      { name: '金蝶', value: 20, itemStyle: { color: '#22d3ee' } },
      { name: '其他', value: 22, itemStyle: { color: '#64748b' } },
    ],
    maturity: [48, 55, 62, 68, 78],
    risk: '替代最易处已替完，剩余 30% 恰是最关键的央企核心系统。',
  },
  {
    key: 'base', label: '信创基础软件', accent: '#f472b6', local: 48, difficulty: 55, weight: 80,
    monopoly: 'Windows / Oracle DB / VMware 在存量市场仍占多数',
    vendors: ['麒麟软件', '统信 UOS', '达梦数据', 'openEuler 系'],
    desc: '操作系统 / 数据库 / 中间件是工业软件的地基。党政市场已基本国产化，行业市场（金融核心 / 电信计费 / 工业实时库）正在攻坚。',
    share: [
      { name: '微软系', value: 35, itemStyle: { color: '#c41e3a' } },
      { name: 'Oracle/VMware', value: 20, itemStyle: { color: '#e8a317' } },
      { name: '麒麟/统信', value: 22, itemStyle: { color: '#10b981' } },
      { name: '达梦/OB 等', value: 13, itemStyle: { color: '#22d3ee' } },
      { name: '其他', value: 10, itemStyle: { color: '#64748b' } },
    ],
    maturity: [25, 35, 45, 55, 66],
    risk: '存量惯性：换 OS 容易，迁走跑了二十年的业务系统难。',
  },
];

/* ============ 时间线：自主之路 ============ */
const PHASES = [
  { period: '1990s', title: '甩图板运动', accent: '#64748b', desc: '"甩掉图板"国产 2D CAD 普及，曾占半壁江山——随后在 3D 化与盗版冲击中集体掉队，错失内核积累窗口期。' },
  { period: '2000–2017', title: '外企垄断深化', accent: '#3b82f6', desc: '达索 / 西门子 / ANSYS 借中国制造业黄金二十年完成深度绑定：高校教学、企业流程、数据格式全面外企化。国产工业软件研发投入长期不足外企零头。' },
  { period: '2018–2020', title: '断供警钟', accent: '#c41e3a', desc: '中兴 / 华为事件后 EDA 断供成真；2020 年哈工大、哈工程被禁用 MATLAB——"民用软件不会断供"的幻想破灭，工业软件首次进入国家卡脖子清单。' },
  { period: '2020–2024', title: '信创工程铺开', accent: '#e8a317', desc: '党政信创先行，金融 / 电信 / 能源行业信创跟进；国产 CAD/EDA 厂商批量上市融资，资本与政策双轮驱动，但替代仍集中在外围与中低端。' },
  { period: '2024–', title: '内核级攻坚', accent: '#22d3ee', desc: '战场从"可用"转向"好用"：自主几何内核、自主求解器、自主数字全流程 EDA。这是十年起步的长跑——内核没有捷径，只有时间 × 人才 × 真实工程反馈。' },
];

/* ============ 信创替代节奏（行业 × 替代深度，示意%） ============ */
const SECTOR_NAMES = ['党政', '金融', '电信', '能源', '制造'];
const SECTOR_STACK = stackedBarOpt({
  categories: SECTOR_NAMES,
  series: [
    { name: '已替代', data: [80, 45, 40, 32, 18], itemStyle: { color: '#10b981' } },
    { name: '替代中', data: [15, 35, 35, 38, 30], itemStyle: { color: '#e8a317' } },
    { name: '未启动', data: [5, 20, 25, 30, 52], itemStyle: { color: '#334155' } },
  ],
});

/* ============ 能力雷达（中国 vs 国际，双系列内联） ============ */
const RADAR_INDICATORS = ['几何内核', '求解器', '数据格式', '生态兼容', '行业积累', '人才储备'];
const CAPABILITY_RADAR = {
  legend: { bottom: 0, textStyle: { color: LABEL.color, fontSize: 10 }, itemWidth: 12 },
  radar: {
    indicator: RADAR_INDICATORS.map((n) => ({ name: n, max: 100 })),
    axisName: { color: LABEL.color, fontSize: 10 },
    splitLine: { lineStyle: { color: 'rgba(148,163,184,0.25)' } },
    axisLine: { lineStyle: { color: 'rgba(148,163,184,0.25)' } },
    splitArea: { show: false },
    radius: '62%',
  },
  series: [{
    type: 'radar',
    data: [
      { value: [25, 15, 30, 40, 35, 45], name: '中国（示意）', lineStyle: { color: '#c41e3a', width: 2 }, itemStyle: { color: '#c41e3a' }, areaStyle: { color: 'rgba(196,30,58,0.15)' } },
      { value: [95, 95, 90, 92, 95, 80], name: '国际头部', lineStyle: { color: '#22d3ee', width: 2 }, itemStyle: { color: '#22d3ee' }, areaStyle: { color: 'rgba(34,211,238,0.08)' } },
    ],
  }],
};

/* ============ 国产化率全景（分档着色） ============ */
function localColor(v) {
  if (v >= 60) return '#10b981';
  if (v >= 30) return '#e8a317';
  return '#c41e3a';
}
const LOCAL_BAR = {
  tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' }, formatter: '{b}: {c}%' },
  grid: { left: 96, right: 48, top: 12, bottom: 24 },
  xAxis: valueY({ max: 100, axisLabel: { formatter: '{value}%' } }),
  yAxis: categoryX([...CATS].sort((a, b) => a.local - b.local).map((c) => c.label)),
  series: [{
    type: 'bar', barWidth: 16,
    data: [...CATS].sort((a, b) => a.local - b.local).map((c) => ({
      value: c.local, itemStyle: { color: localColor(c.local), borderRadius: 3 },
    })),
    label: { show: true, position: 'right', formatter: '{c}%', color: LABEL.color, fontSize: 10 },
  }],
};

/* ============ 替代难度 × 战略权重散点 ============ */
const SCATTER_OPT = {
  tooltip: { formatter: (p) => `${p.data[3]}<br/>替代难度 ${p.data[0]} · 战略权重 ${p.data[1]} · 国产化率 ${p.data[2]}%` },
  grid: { left: 48, right: 32, top: 32, bottom: 44 },
  xAxis: {
    type: 'value', name: '替代难度 →', nameLocation: 'middle', nameGap: 28, min: 20, max: 100,
    nameTextStyle: { color: LABEL.color, fontSize: 10 },
    splitLine: { lineStyle: { color: 'rgba(148,163,184,0.12)' } }, axisLabel: { color: LABEL.color, fontSize: 10 },
  },
  yAxis: {
    type: 'value', name: '战略权重 →', nameLocation: 'middle', nameGap: 34, min: 40, max: 105,
    nameTextStyle: { color: LABEL.color, fontSize: 10 },
    splitLine: { lineStyle: { color: 'rgba(148,163,184,0.12)' } }, axisLabel: { color: LABEL.color, fontSize: 10 },
  },
  series: [{
    type: 'scatter',
    symbolSize: (d) => Math.max(14, 44 - d[2] * 0.4),
    data: CATS.map((c) => ({ value: [c.difficulty, c.weight, c.local, c.label], itemStyle: { color: c.accent } })),
    label: { show: true, position: 'top', formatter: (p) => p.data.value[3], color: '#cbd5e1', fontSize: 10 },
    markLine: {
      silent: true, symbol: 'none',
      lineStyle: { color: 'rgba(148,163,184,0.35)', type: 'dashed' },
      label: { color: '#64748b', fontSize: 9 },
      data: [{ xAxis: 70, label: { formatter: '难度分界' } }, { yAxis: 80, label: { formatter: '咽喉线' } }],
    },
  }],
};

/* ============ 市场规模（log 轴，示意 亿元） ============ */
const SCALE_LOG = {
  tooltip: { trigger: 'axis' },
  grid: GRID,
  xAxis: categoryX(['2019', '2020', '2021', '2022', '2023', '2025E']),
  yAxis: logY({ axisLabel: { formatter: '{value}' } }),
  series: [
    { type: 'line', name: '工业软件市场（亿元）', smooth: true, symbol: 'circle', symbolSize: 6,
      data: [1720, 1974, 2414, 2600, 2800, 3500],
      itemStyle: { color: '#c41e3a' }, lineStyle: { color: '#c41e3a', width: 2 }, areaStyle: { color: 'rgba(196,30,58,0.10)' } },
    { type: 'line', name: '研发设计类（亿元）', smooth: true, symbol: 'circle', symbolSize: 6,
      data: [180, 210, 250, 295, 350, 480],
      itemStyle: { color: '#22d3ee' }, lineStyle: { color: '#22d3ee', width: 2 } },
  ],
  legend: { top: 0, textStyle: { color: LABEL.color, fontSize: 10 }, itemWidth: 12 },
};

export default function Page() {
  const [cat, setCat] = useState('cae');
  const [phaseIdx, setPhaseIdx] = useState(4);
  const c = CATS.find((x) => x.key === cat) || CATS[0];

  /* 品类成熟度爬坡（随选择切换） */
  const maturityBar = useMemo(() => ({
    grid: GRID,
    xAxis: categoryX(['2020', '2021', '2022', '2023', '2025E']),
    yAxis: valueY({ min: 0, max: 100, axisLabel: { formatter: '{value}%' } }),
    series: [{
      type: 'bar', data: c.maturity, barWidth: '52%',
      itemStyle: { color: c.accent, borderRadius: [4, 4, 0, 0] },
      label: { show: true, position: 'top', formatter: '{c}%', color: LABEL.color, fontSize: 10 },
    }],
  }), [c]);

  /* 全球垄断格局 donut（随选择切换） */
  const monopolyDonut = useMemo(() => donutOpt(c.share), [c]);

  return (
    <div>
      <PageHeader badge="Industrial Software · 软件主权" title="工业软件 · 隐形咽喉" subtitle="CAD/CAE/EDA · 信创替代 · 内核攻坚 · 卡脖子全景" />

      <IntroCard>
        如果半导体是工业的心脏，工业软件就是它的灵魂。一架飞机、一颗芯片、一座电站，在被制造出来之前，先在工业软件里被设计、仿真、验证一万次。谁掌握<strong style={{ color: 'var(--text-primary)' }}>几何内核与求解器</strong>，谁就拥有物理世界在数字空间的解释权与修改权。冷峻的现实是：这个 2,800 亿的市场里，最关键的 CAE/EDA 国产化率不足 12%——制造大国的"操作系统"，装在别人的服务器上。
      </IntroCard>

      <Grid cols={4} className="mb-6">
        <Stat value="2,800 亿" label="工业软件市场规模 (2023, 示意)" accent="#c41e3a" />
        <Stat value="~30%" label="整体国产化率（按品类加权, 示意）" accent="#e8a317" />
        <Stat value="<10%" label="CAE 仿真国产化率（示意）" accent="#7c6cf0" />
        <Stat value="80%" label="党政信创渗透 / 制造仅 ~18%（示意）" accent="#22d3ee" />
      </Grid>

      {/* ============ 交互① 品类选择器 ============ */}
      <Card title="交互① · 品类透视：七条战线，七种难度" className="mb-6">
        <SelectorBar items={CATS} activeKey={cat} onSelect={setCat} />
        <div className="os-card p-4 mb-4" style={{ background: 'var(--bg-elevated)', borderLeft: `3px solid ${c.accent}` }}>
          <div className="flex flex-wrap items-baseline gap-3 mb-2">
            <span className="text-base font-semibold" style={{ color: c.accent }}>{c.label}</span>
            <span className="text-xs mono" style={{ color: 'var(--text-tertiary)' }}>
              国产化率 {c.local}% · 替代难度 {c.difficulty}/100 · 战略权重 {c.weight}/100
            </span>
          </div>
          <p className="text-sm leading-relaxed mb-2" style={{ color: 'var(--text-secondary)' }}>{c.desc}</p>
          <p className="text-xs leading-relaxed mb-2" style={{ color: 'var(--text-tertiary)' }}>
            垄断格局：{c.monopoly}
          </p>
          <div className="flex flex-wrap gap-2 mb-2">
            {c.vendors.map((v) => (
              <span key={v} className="text-[11px] mono px-2 py-0.5 rounded" style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', color: 'var(--text-secondary)' }}>{v}</span>
            ))}
          </div>
          <p className="text-xs leading-relaxed" style={{ color: c.accent }}>⚠ {c.risk}</p>
        </div>
        <Grid cols={2}>
          <Card title={`${c.label} · 全球份额格局（示意%）`}><EChart option={monopolyDonut} style={{ height: 260 }} /></Card>
          <Card title={`${c.label} · 国产成熟度爬坡（示意）`}><EChart option={maturityBar} style={{ height: 260 }} /></Card>
        </Grid>
      </Card>

      {/* ============ 国产化率全景 + 定位矩阵 ============ */}
      <Grid cols={2} className="mb-6">
        <Card title="国产化率全景：管理软件易，内核软件难（示意%）">
          <EChart option={LOCAL_BAR} style={{ height: 280 }} />
          <p className="text-xs mt-2 leading-relaxed" style={{ color: 'var(--text-tertiary)' }}>
            <span style={{ color: '#10b981' }}>■ ≥60%</span> 替代成气候 ·
            <span style={{ color: '#e8a317' }}> ■ 30–60%</span> 拉锯战 ·
            <span style={{ color: '#c41e3a' }}> ■ &lt;30%</span> 深度卡脖子。
            规律：离"流程"越近越好替，离"物理与数学"越近越难替。
          </p>
        </Card>
        <Card title="定位矩阵：替代难度 × 战略权重（气泡=国产化率倒数）">
          <EChart option={SCATTER_OPT} style={{ height: 280 }} />
          <p className="text-xs mt-2 leading-relaxed" style={{ color: 'var(--text-tertiary)' }}>
            右上象限（CAE / EDA）是真正的咽喉：战略权重最高、替代难度最大、国产化率最低——三重叠加，攻坚以十年计。
          </p>
        </Card>
      </Grid>

      {/* ============ 能力雷达 + 市场规模 ============ */}
      <Grid cols={2} className="mb-6">
        <Card title="工业软件能力雷达：中国 vs 国际头部（示意）">
          <EChart option={CAPABILITY_RADAR} style={{ height: 300 }} />
          <p className="text-xs mt-2 leading-relaxed" style={{ color: 'var(--text-tertiary)' }}>
            差距最深处是几何内核与求解器——它们不靠资本砸出来，靠数十年数学家 + 工程师 + 真实工程反馈的复利积累。
          </p>
        </Card>
        <Card title="市场规模与研发设计类增长（亿元，log 轴，示意）">
          <EChart option={SCALE_LOG} style={{ height: 300 }} />
          <p className="text-xs mt-2 leading-relaxed" style={{ color: 'var(--text-tertiary)' }}>
            研发设计类（CAD/CAE/EDA）仅占整体约 1/8，却承载最高战略权重——市场结构与战略结构严重错配。
          </p>
        </Card>
      </Grid>

      {/* ============ 信创替代节奏 ============ */}
      <Card title="信创替代节奏：从党政到制造的渗透梯度（示意%）" className="mb-6">
        <EChart option={SECTOR_STACK} style={{ height: 260 }} />
        <Grid cols={3} className="mt-3">
          <div className="os-card p-3" style={{ borderLeft: '3px solid #10b981' }}>
            <div className="text-xs font-semibold mb-1" style={{ color: '#10b981' }}>党政先行（已基本完成）</div>
            <p className="text-[11px] leading-relaxed" style={{ color: 'var(--text-tertiary)' }}>办公场景容错高、采购可控，是信创的练兵场——但它验证不了工业内核。</p>
          </div>
          <div className="os-card p-3" style={{ borderLeft: '3px solid #e8a317' }}>
            <div className="text-xs font-semibold mb-1" style={{ color: '#e8a317' }}>金融/电信/能源（攻坚中）</div>
            <p className="text-[11px] leading-relaxed" style={{ color: 'var(--text-tertiary)' }}>核心交易与计费系统替代进入深水区，国产数据库在此完成高可靠成人礼。</p>
          </div>
          <div className="os-card p-3" style={{ borderLeft: '3px solid #c41e3a' }}>
            <div className="text-xs font-semibold mb-1" style={{ color: '#c41e3a' }}>制造（最后也最难）</div>
            <p className="text-[11px] leading-relaxed" style={{ color: 'var(--text-tertiary)' }}>CAD/CAE 替代意味着重建整条研发流程——没有行政指令能替企业承担试错成本。</p>
          </div>
        </Grid>
      </Card>

      {/* ============ 交互② 时间线 ============ */}
      <Card title="交互② · 自主之路：从甩图板到内核攻坚" className="mb-6">
        <TimelineBar stages={PHASES} activeIdx={phaseIdx} onSelect={setPhaseIdx} />
      </Card>

      {/* ============ 框架三卡 ============ */}
      <FrameworkTrio cards={[
        {
          title: '隐形咽喉', subtitle: '制造业的操作系统',
          body: '工业软件不直接出现在任何产品上，却定义了一切产品如何被设计与制造。它是比芯片更隐蔽的咽喉：断芯片是断供给，断软件是断认知——你将失去描述和修改自己产品的能力。',
          pillars: [['格式锁定', '数据沉淀在外企私有格式中，迁移成本即护城河。'], ['教育绑定', '高校用什么教，工程师就用什么干。'], ['断供先例', 'MATLAB / EDA 已证明民用软件同样是武器。']],
        },
        {
          title: '内核之困', subtitle: '数十年积累的硬壁垒',
          body: '几何内核与求解器是数学、物理与工程反馈的复利产物。Parasolid 迭代近四十年，ANSYS 求解器经数百万真实工程校准。这种壁垒无法并购获得（审查必否），只能用时间自己长出来。',
          pillars: [['人才断层', '计算几何/数值方法人才长期流向互联网与金融。'], ['验证闭环', '没有用户敢用，就没有反馈让软件变好——死循环。'], ['破局点', '国家重大工程强制采用，以真实载荷喂养国产内核。']],
        },
        {
          title: '信创梯度', subtitle: '从办公替代到工业内核',
          body: '信创的次序是一条精确的难度爬坡曲线：党政办公 → 行业核心系统 → 工业研发内核。前两级靠政策与采购可以推动，最后一级只能靠产品力本身——这是政策红利的边界，也是真正较量的起点。',
          pillars: [['可用阶段', '2020–2024：替得上，性能与生态打折可忍。'], ['好用阶段', '2024–2030：工程师不抱怨，才算真替代。'], ['领先阶段', '2030+：AI 原生 CAE/EDA 或是换道超车窗口。']],
        },
      ]} />

      <ModuleFooter
        moduleId="industrysoftware"
        sourceNote="由 china.html「工业软件」专题迁移并扩容"
        disclaimer="本页数据为公开资料整理之示意值（份额/国产化率/渗透率均为量级示意，非精确统计）· 仅供分析框架参考，非投资建议"
      />
    </div>
  );
}
