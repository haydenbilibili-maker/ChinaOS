// ============================================================================
// 领袖统治 · 可视化数据层（data.js）
// asOf: 2026-06-11 · 学理分析示意 · 非官方统计
// 口径：公开信息梳理 · 学理分析框架 · 非评价 · 非预测 · 非倡导
// ============================================================================

import { categoryX, valueY, GRID, GRID_WIDE, CHART_TOOLTIP, donutOpt, stackedBarOpt, timelineMarkAreaOpt, AXIS, LABEL, LEGEND } from '../shared/chartHelpers.js';

export { LEAD_AS_OF, LEAD_DISCLAIMER, ERA_TIMELINE, TERM_SYSTEM, GOV_MODEL, BRAIN_TRUST, AGENDA, TRADEOFFS, agendaById, eraStagesForTimeline } from './leadershipData.js';

// ── 四区 Tab ────────────────────────────────────────────────────────────────
export const SECTION_TABS = [
  { key: 'power', label: '权力结构', accent: '#c41e3a' },
  { key: 'decision', label: '决策机制', accent: '#22d3ee' },
  { key: 'personnel', label: '人事布局', accent: '#e8a317' },
  { key: 'history', label: '历史演进', accent: '#8b5cf6' },
  { key: 'aisim', label: 'AI 推演', accent: '#10b981' },
];

// ── 代际/观察窗口选择器 ───────────────────────────────────────────────────────
export const ERA_WINDOWS = [
  { key: 'all', label: '全周期', range: '2012–2026', accent: '#64748b' },
  { key: 'consolidation', label: '集中强化期', range: '2012–2017', accent: '#c41e3a' },
  { key: 'institutional', label: '制度定型期', range: '2018–2021', accent: '#8b5cf6' },
  { key: 'renewal', label: '再布局期', range: '2022–2026', accent: '#22d3ee' },
];

// ── 制度工具箱（交叉链接） ───────────────────────────────────────────────────
export const INSTITUTION_TOOLS = [
  { key: 'inspection', label: '巡视巡察', accent: '#c41e3a', route: '/sandbox?tab=inspection', note: '全覆盖监督与整改闭环' },
  { key: 'anticorruption', label: '纪检监察', accent: '#64748b', route: '/talent?tab=anticorruption', note: '自我监督机制与案例库' },
  { key: 'personnel', label: '人事任免', accent: '#e8a317', route: '/talent', note: '结构化政要图谱与履历' },
  { key: 'party-school', label: '党校培训', accent: '#10b981', route: '/sandbox?tab=party-school', note: '干部意识形态与能力再生产' },
  { key: 'policy', label: '政令文库', accent: '#22d3ee', route: '/policydocs', note: '政策文本与立法迭代' },
  { key: 'diplomacy', label: '元首外交', accent: '#8b5cf6', route: '/diplomacy', note: '最高层对外校准器' },
];

// ── 权力金字塔层级（示意权重 · 非人数统计） ─────────────────────────────────
export const POWER_TIERS = [
  { name: '总书记 / 军委主席', value: 100, itemStyle: { color: '#c41e3a' } },
  { name: '政治局常委（7）', value: 72, itemStyle: { color: '#e8a317' } },
  { name: '政治局委员（24）', value: 48, itemStyle: { color: '#22d3ee' } },
  { name: '中央委员（205）', value: 28, itemStyle: { color: '#10b981' } },
  { name: '省部级主官', value: 16, itemStyle: { color: '#8b5cf6' } },
  { name: '市/县执行层', value: 8, itemStyle: { color: '#64748b' } },
];

// ── 决策 Sankey 节点 ─────────────────────────────────────────────────────────
// ECharts Sankey 要求有向无环（DAG）：「巡视反馈→调研论证」会形成
// 议题输入→…→执行督查→巡视反馈→调研论证→… 的闭环，直接渲染会抛 cycle 错误并使整页崩溃。
// 解决：反馈边导向「↺反馈」镜像汇点（与 redweb / digitalGiantWeb 同模式）。
const SANKEY_NODES = [
  { name: '议题输入' }, { name: '调研论证' }, { name: '部际协调' },
  { name: '政治局常委会' }, { name: '中央全会' }, { name: '国务院常务' },
  { name: '立法/发布' }, { name: '执行督查' }, { name: '巡视反馈' },
  { name: '调研论证 ↺反馈' },
];
const SANKEY_LINKS = [
  { source: '议题输入', target: '调研论证', value: 45 },
  { source: '调研论证', target: '部际协调', value: 38 },
  { source: '部际协调', target: '政治局常委会', value: 28 },
  { source: '部际协调', target: '国务院常务', value: 22 },
  { source: '政治局常委会', target: '中央全会', value: 12 },
  { source: '政治局常委会', target: '立法/发布', value: 18 },
  { source: '国务院常务', target: '立法/发布', value: 20 },
  { source: '中央全会', target: '立法/发布', value: 10 },
  { source: '立法/发布', target: '执行督查', value: 42 },
  { source: '执行督查', target: '巡视反馈', value: 15 },
  { source: '巡视反馈', target: '调研论证 ↺反馈', value: 8 },
];

// ── 代际时间线（公开代际框架 · 示意节点） ───────────────────────────────────
export const GENERATION_MARKS = [
  { year: 1978, gen: '改革开放启动', leader: '第二代', accent: '#64748b' },
  { year: 1989, gen: '第三代集体', leader: '第三代', accent: '#64748b' },
  { year: 2002, gen: '第四代交接', leader: '第四代', accent: '#64748b' },
  { year: 2012, gen: '十八大', leader: '第五代', accent: '#c41e3a' },
  { year: 2017, gen: '十九大入章', leader: '第五代', accent: '#c41e3a' },
  { year: 2022, gen: '二十大连任', leader: '第五代', accent: '#c41e3a' },
  { year: 2026, gen: '观察窗口', leader: '第五代', accent: '#22d3ee' },
];

// ── 地域集群（公开晋升通道地域分布 · 示意占比） ─────────────────────────────
export const REGION_CLUSTERS = [
  { name: '京畿/中央机关', value: 22, color: '#c41e3a' },
  { name: '长三角', value: 18, color: '#22d3ee' },
  { name: '珠三角', value: 12, color: '#e8a317' },
  { name: '成渝/西部', value: 14, color: '#10b981' },
  { name: '东北', value: 8, color: '#64748b' },
  { name: '中部', value: 11, color: '#8b5cf6' },
  { name: '边疆/民族地区', value: 15, color: '#fb923c' },
];

// ── 会议机制雷达维度 ─────────────────────────────────────────────────────────
export const MEETING_DIMS = ['频次', '议程权重', '执行穿透', '公开透明度', '跨部门协调', '纠错反馈'];

export const MEETING_BY_ERA = {
  all: { label: '全周期均值', values: [78, 92, 85, 42, 72, 58] },
  consolidation: { label: '2012–2017', values: [72, 85, 78, 38, 65, 52] },
  institutional: { label: '2018–2021', values: [80, 90, 82, 40, 70, 55] },
  renewal: { label: '2022–2026', values: [82, 95, 88, 45, 78, 62] },
};

export const MEETING_TYPES = [
  { key: 'psc', label: '政治局常委会', accent: '#c41e3a', values: [85, 98, 95, 35, 88, 55] },
  { key: 'state', label: '国务院常务', accent: '#22d3ee', values: [90, 75, 88, 55, 82, 60] },
  { key: 'plenum', label: '中央全会', accent: '#e8a317', values: [25, 95, 80, 70, 65, 45] },
  { key: 'commission', label: '议事协调机构', accent: '#10b981', values: [70, 82, 75, 30, 92, 50] },
];

// ── 人事轮换热力（岗位 × 年份 · 示意轮换强度 0–10） ─────────────────────────
export const TURNOVER_POSITIONS = ['书记/省长', '部委正职', '大军区/战区', '央企一把手', '驻外大使', '省级常委'];
export const TURNOVER_YEARS = ['2018', '2019', '2020', '2021', '2022', '2023', '2024', '2025'];
export const TURNOVER_MATRIX = [
  [4, 5, 6, 5, 8, 7, 6, 5],
  [3, 4, 5, 6, 7, 8, 6, 4],
  [5, 4, 3, 4, 6, 5, 4, 3],
  [2, 3, 4, 5, 6, 7, 8, 5],
  [3, 3, 4, 4, 5, 6, 5, 4],
  [4, 5, 5, 6, 7, 8, 7, 6],
];

// ── 权威指数趋势（2012–2026 示意） ───────────────────────────────────────────
export const AUTH_YEARS = ['2012', '2013', '2014', '2015', '2016', '2017', '2018', '2019', '2020', '2021', '2022', '2023', '2024', '2025', '2026'];
export const AUTH_SERIES = {
  decision: { name: '决策集中度', color: '#c41e3a', data: [62, 65, 68, 72, 75, 78, 82, 84, 86, 88, 90, 91, 92, 93, 94] },
  execution: { name: '执行穿透力', color: '#22d3ee', data: [55, 58, 62, 65, 68, 72, 75, 78, 80, 82, 85, 86, 87, 88, 89] },
  institutional: { name: '制度刚性', color: '#e8a317', data: [48, 50, 52, 55, 58, 62, 72, 75, 78, 82, 85, 86, 87, 88, 90] },
  feedback: { name: '纠错反馈', color: '#10b981', data: [42, 44, 45, 48, 50, 52, 55, 58, 60, 62, 65, 66, 68, 70, 72] },
};

// ── 机构权责 Sunburst ─────────────────────────────────────────────────────────
export const INSTITUTION_TREE = {
  name: '中央',
  children: [
    {
      name: '党中央',
      children: [
        { name: '政治局/常委会', value: 30 },
        { name: '书记处', value: 8 },
        { name: '深改/财经/国安委', value: 18 },
        { name: '中央办公厅', value: 12 },
      ],
    },
    {
      name: '国家机构',
      children: [
        { name: '全国人大/常委会', value: 10 },
        { name: '国务院', value: 25 },
        { name: '国家监察委', value: 8 },
        { name: '最高法/最高检', value: 6 },
      ],
    },
    {
      name: '军队',
      children: [
        { name: '中央军委', value: 20 },
        { name: '五大战区', value: 15 },
      ],
    },
  ],
};

// ── 治理 OS 关系图 ───────────────────────────────────────────────────────────
export const GOV_GRAPH = {
  nodes: [
    { name: '集中统一领导', symbolSize: 52, itemStyle: { color: '#c41e3a' } },
    { name: '顶层设计', symbolSize: 42, itemStyle: { color: '#22d3ee' } },
    { name: '全面从严治党', symbolSize: 40, itemStyle: { color: '#10b981' } },
    { name: '总体国家安全', symbolSize: 38, itemStyle: { color: '#e8a317' } },
    { name: '新发展理念', symbolSize: 36, itemStyle: { color: '#8b5cf6' } },
    { name: '意识形态', symbolSize: 34, itemStyle: { color: '#64748b' } },
  ],
  links: [
    { source: '集中统一领导', target: '顶层设计' },
    { source: '集中统一领导', target: '全面从严治党' },
    { source: '集中统一领导', target: '总体国家安全' },
    { source: '顶层设计', target: '新发展理念' },
    { source: '全面从严治党', target: '意识形态' },
    { source: '总体国家安全', target: '新发展理念' },
    { source: '意识形态', target: '集中统一领导' },
  ],
};

// ── 全会/常委会频次（示意 · 次/年） ─────────────────────────────────────────
export const MEETING_FREQ = {
  years: ['2018', '2019', '2020', '2021', '2022', '2023', '2024', '2025'],
  psc: [48, 50, 46, 48, 52, 50, 48, 46],
  state: [36, 38, 34, 36, 38, 36, 34, 32],
  plenum: [1, 0, 0, 1, 1, 0, 1, 0],
};

// ── 工具箱使用强度（按工具 key） ─────────────────────────────────────────────
export const TOOL_INTENSITY = {
  inspection: { label: '巡视巡察', values: [65, 72, 78, 85, 88, 90, 92] },
  anticorruption: { label: '纪检监察', values: [70, 75, 80, 82, 85, 86, 88] },
  personnel: { label: '人事任免', values: [55, 58, 62, 68, 72, 75, 78] },
  'party-school': { label: '党校培训', values: [60, 62, 65, 68, 70, 72, 74] },
  policy: { label: '政令发布', values: [58, 62, 65, 70, 75, 78, 80] },
  diplomacy: { label: '元首外交', values: [45, 48, 42, 50, 55, 58, 60] },
};

// ── FrameworkTrio 领袖主题 ───────────────────────────────────────────────────
export const LEADERSHIP_FRAMEWORK = {
  salt: {
    title: '盐铁逻辑',
    subtitle: '人事垄断 · 决策中枢',
    accent: 'var(--fire-gold)',
    border: 'var(--fire-gold)',
    body: '干部任免权与政策议程设定权构成体制「专营接口」——组织部档案、常委会拍板、巡视反馈形成闭环，非公开渠道不参与核心决策。',
    pillars: [['人事专营', '任免建议权'], ['议程设定', '常委会拍板'], ['监督闭环', '巡视督查']],
  },
  stone: {
    title: '摸石头方法论',
    subtitle: '试点 · 委员会化 · 迭代',
    accent: 'var(--cyber-cyan)',
    border: 'var(--cyber-cyan)',
    body: '深改委、财经委等议事协调机构是「灰度试点」的制度化：跨部门议程先在小范围论证，再以全会/立法形式固化，失败成本由试点吸收。',
    pillars: [['委员会试点', '跨部协调'], ['地方试验', '自贸区/示范区'], ['上升固化', '立法/规划']],
  },
  path: {
    title: '升级路径',
    subtitle: '从集中到穿透',
    accent: 'var(--china-red)',
    border: 'var(--china-red)',
    body: '决策权向中央汇聚的同时，数字化督查与巡视全覆盖试图提升执行穿透——效率与信息过滤的张力是这一路径的核心代价。',
    pillars: [['决策集中', '顶层设计'], ['执行穿透', '督查/巡视'], ['反馈通道', '统计垂管/舆情']],
  },
};

// ── 图表构建函数 ─────────────────────────────────────────────────────────────

export function buildPowerPyramid() {
  return {
    tooltip: { trigger: 'item', formatter: '{b}<br/>层级权重示意: {c}', ...CHART_TOOLTIP },
    series: [{
      type: 'funnel',
      left: '8%', top: 12, bottom: 12, width: '84%',
      min: 0, max: 100, minSize: '8%', maxSize: '100%',
      sort: 'descending', gap: 3,
      label: { show: true, position: 'inside', fontSize: 10, color: '#fff' },
      itemStyle: { borderColor: 'transparent' },
      emphasis: { label: { fontSize: 11 } },
      data: POWER_TIERS,
    }],
  };
}

export function buildDecisionSankey() {
  return {
    tooltip: { trigger: 'item', ...CHART_TOOLTIP },
    series: [{
      type: 'sankey',
      left: 8, right: 100, top: 10, bottom: 10,
      data: SANKEY_NODES,
      links: SANKEY_LINKS,
      nodeWidth: 14, nodeGap: 10,
      emphasis: { focus: 'adjacency' },
      label: { color: LABEL.color, fontSize: 10 },
      lineStyle: { color: 'gradient', curveness: 0.5, opacity: 0.45 },
    }],
  };
}

export function buildGenerationTimeline(highlightFrom = 2012, highlightTo = 2026) {
  const gens = [...new Set(GENERATION_MARKS.map((m) => m.leader))];
  return {
    grid: { left: 48, right: 24, top: 24, bottom: 36 },
    tooltip: {
      trigger: 'item',
      formatter: (p) => {
        const m = GENERATION_MARKS[p.dataIndex];
        return m ? `${m.year} · ${m.gen}<br/>${m.leader}` : '';
      },
      ...CHART_TOOLTIP,
    },
    xAxis: categoryX(GENERATION_MARKS.map((m) => String(m.year))),
    yAxis: {
      type: 'category',
      data: gens,
      axisLine: { lineStyle: { color: AXIS.lineStyle.color } },
      axisLabel: { color: LABEL.color, fontSize: 10 },
    },
    series: [{
      type: 'scatter',
      symbolSize: (val) => 12 + val[2] * 2,
      data: GENERATION_MARKS.map((m, i) => ({
        value: [i, gens.indexOf(m.leader), 8],
        itemStyle: {
          color: m.year >= highlightFrom && m.year <= highlightTo ? m.accent : '#64748b',
          borderColor: '#fff',
          borderWidth: m.year >= highlightFrom && m.year <= highlightTo ? 2 : 0,
        },
      })),
      markArea: {
        silent: true,
        itemStyle: { color: 'rgba(34,211,238,0.06)' },
        data: [[
          { xAxis: String(highlightFrom) },
          { xAxis: String(highlightTo) },
        ]],
      },
    }],
  };
}

export function buildRegionalBar() {
  return {
    grid: GRID,
    tooltip: { trigger: 'axis', ...CHART_TOOLTIP },
    xAxis: categoryX(REGION_CLUSTERS.map((r) => r.name), { rotate: 25, fontSize: 9 }),
    yAxis: valueY({ name: '占比%' }),
    series: [{
      type: 'bar',
      barWidth: 22,
      data: REGION_CLUSTERS.map((r) => ({ value: r.value, itemStyle: { color: r.color } })),
    }],
  };
}

export function buildMeetingRadar(eraKey = 'all', meetingKey = 'psc') {
  const era = MEETING_BY_ERA[eraKey] || MEETING_BY_ERA.all;
  const mt = MEETING_TYPES.find((m) => m.key === meetingKey) || MEETING_TYPES[0];
  const indicators = MEETING_DIMS.map((n) => ({ name: n, max: 100 }));
  return {
    tooltip: { ...CHART_TOOLTIP },
    legend: { ...LEGEND, top: 0, data: [era.label, mt.label] },
    radar: {
      indicator: indicators,
      axisName: { color: LABEL.color, fontSize: 10 },
      splitLine: { lineStyle: { color: 'rgba(148,163,184,0.15)' } },
      axisLine: { lineStyle: { color: 'rgba(148,163,184,0.15)' } },
      splitArea: { show: false },
    },
    series: [{
      type: 'radar',
      data: [
        { value: era.values, name: era.label, lineStyle: { color: '#64748b', width: 1, type: 'dashed' }, itemStyle: { color: '#64748b' }, areaStyle: { color: 'rgba(100,116,139,0.08)' } },
        { value: mt.values, name: mt.label, lineStyle: { color: mt.accent, width: 2 }, itemStyle: { color: mt.accent }, areaStyle: { color: `${mt.accent}22` } },
      ],
    }],
  };
}

export function buildTurnoverHeatmap() {
  const data = [];
  TURNOVER_POSITIONS.forEach((_, yi) => {
    TURNOVER_YEARS.forEach((_, xi) => {
      data.push([xi, yi, TURNOVER_MATRIX[yi][xi]]);
    });
  });
  return {
    grid: { left: 88, right: 16, top: 16, bottom: 56 },
    tooltip: { position: 'top', formatter: (p) => `${TURNOVER_POSITIONS[p.value[1]]} · ${TURNOVER_YEARS[p.value[0]]}<br/>轮换强度: ${p.value[2]}`, ...CHART_TOOLTIP },
    xAxis: { type: 'category', data: TURNOVER_YEARS, axisLabel: { color: LABEL.color, fontSize: 10 } },
    yAxis: { type: 'category', data: TURNOVER_POSITIONS, axisLabel: { color: LABEL.color, fontSize: 10 } },
    visualMap: {
      min: 0, max: 10, calculable: true,
      orient: 'horizontal', left: 'center', bottom: 0,
      inRange: { color: ['#1e293b', '#22d3ee', '#c41e3a'] },
      textStyle: { color: LABEL.color, fontSize: 10 },
    },
    series: [{ type: 'heatmap', data, label: { show: true, fontSize: 10, color: '#e8edf6' }, emphasis: { itemStyle: { shadowBlur: 6 } } }],
  };
}

export function buildAuthorityTrend(eraKey = 'all') {
  const spanMap = {
    all: [0, 14],
    consolidation: [0, 5],
    institutional: [6, 9],
    renewal: [10, 14],
  };
  const [a, b] = spanMap[eraKey] || spanMap.all;
  const series = Object.values(AUTH_SERIES).map((s) => ({
    name: s.name,
    type: 'line',
    smooth: true,
    symbol: 'circle',
    symbolSize: 5,
    data: s.data,
    lineStyle: { color: s.color, width: 2 },
    itemStyle: { color: s.color },
  }));
  return {
    grid: GRID_WIDE,
    tooltip: { trigger: 'axis', ...CHART_TOOLTIP },
    legend: { ...LEGEND, top: 0 },
    xAxis: categoryX(AUTH_YEARS),
    yAxis: valueY({ name: '指数', min: 30, max: 100 }),
    series,
    ...(eraKey !== 'all' ? {
      series: series.map((s) => ({
        ...s,
        markArea: {
          silent: true,
          itemStyle: { color: 'rgba(34,211,238,0.06)' },
          data: [[{ xAxis: AUTH_YEARS[a] }, { xAxis: AUTH_YEARS[b] }]],
        },
      })),
    } : {}),
  };
}

export function buildInstitutionSunburst() {
  return {
    tooltip: { trigger: 'item', formatter: '{b}: {c}', ...CHART_TOOLTIP },
    series: [{
      type: 'sunburst',
      radius: ['12%', '90%'],
      data: [INSTITUTION_TREE],
      label: { color: LABEL.color, fontSize: 10, rotate: 'radial' },
      itemStyle: { borderWidth: 1, borderColor: 'rgba(15,22,35,0.6)' },
      emphasis: { focus: 'ancestor' },
      levels: [
        {},
        { r0: '12%', r: '42%', itemStyle: { color: '#c41e3a' } },
        { r0: '42%', r: '72%', itemStyle: { color: '#22d3ee' } },
        { r0: '72%', r: '90%', itemStyle: { color: '#64748b' } },
      ],
    }],
  };
}

export function buildGovGraph() {
  return {
    tooltip: { ...CHART_TOOLTIP },
    series: [{
      type: 'graph',
      layout: 'circular',
      roam: true,
      label: { show: true, fontSize: 10, color: LABEL.color },
      data: GOV_GRAPH.nodes,
      links: GOV_GRAPH.links,
      lineStyle: { color: '#64748b', width: 1.5, curveness: 0.15, opacity: 0.7 },
      emphasis: { focus: 'adjacency', lineStyle: { width: 3 } },
    }],
  };
}

export function buildMeetingFrequency() {
  const { years, psc, state, plenum } = MEETING_FREQ;
  return stackedBarOpt({
    categories: years,
    series: [
      { name: '政治局常委会', data: psc, itemStyle: { color: '#c41e3a' } },
      { name: '国务院常务', data: state, itemStyle: { color: '#22d3ee' } },
      { name: '中央全会', data: plenum, itemStyle: { color: '#e8a317' } },
    ],
  });
}

export function buildToolIntensity(toolKey = 'inspection') {
  const tool = TOOL_INTENSITY[toolKey] || TOOL_INTENSITY.inspection;
  const years = ['2019', '2020', '2021', '2022', '2023', '2024', '2025'];
  return {
    grid: GRID,
    tooltip: { trigger: 'axis', ...CHART_TOOLTIP },
    xAxis: categoryX(years),
    yAxis: valueY({ name: '强度指数' }),
    series: [{
      type: 'line',
      smooth: true,
      name: tool.label,
      data: tool.values,
      lineStyle: { color: '#c41e3a', width: 2 },
      areaStyle: { color: 'rgba(196,30,58,0.12)' },
      itemStyle: { color: '#c41e3a' },
      markPoint: { data: [{ type: 'max', name: '峰值' }] },
    }],
  };
}

export function buildAgendaDonut() {
  return donutOpt([
    { name: '军事现代化', value: 18, itemStyle: { color: '#c41e3a' } },
    { name: '台海/统一', value: 16, itemStyle: { color: '#e8a317' } },
    { name: '中美博弈', value: 17, itemStyle: { color: '#22d3ee' } },
    { name: '科技自立', value: 20, itemStyle: { color: '#10b981' } },
    { name: '共同富裕', value: 14, itemStyle: { color: '#8b5cf6' } },
    { name: '风险防范', value: 15, itemStyle: { color: '#fb923c' } },
  ]);
}

export function buildTermTimeline() {
  return timelineMarkAreaOpt({
    years: ['1980', '1982', '2002', '2012', '2018', '2022', '2026'],
    values: [100, 120, 280, 850, 920, 980, 1020],
    span: [4, 6],
    highlightColor: '#8b5cf6',
    lineColor: '#c41e3a',
  });
}
