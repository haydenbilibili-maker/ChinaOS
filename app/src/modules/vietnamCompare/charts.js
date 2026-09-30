import { SERIES } from './seriesGenerated.js';
import { METRICS } from './data.js';
import {
  categoryX, valueY, logY, LEGEND, LABEL, AXIS, GRID_LINE, CHART_TOOLTIP, CHART_SERIES_COLORS,
} from '../shared/chartHelpers.js';

export const VN_COLOR = CHART_SERIES_COLORS.fireGold;
export const CN_COLOR = CHART_SERIES_COLORS.powerRed;

const CAL_FROM = 1980;
const CAL_TO = 2025;

function fmt(v, unit) {
  if (v == null) return '—';
  const n = Math.abs(v) >= 1000 ? Math.round(v).toLocaleString('en-US') : v;
  return unit ? `${n} ${unit}` : `${n}`;
}

function line(name, color, data, extra = {}) {
  return {
    name,
    type: 'line',
    smooth: true,
    connectNulls: true,
    showSymbol: false,
    lineStyle: { width: 2.2, color },
    itemStyle: { color },
    data,
    ...extra,
  };
}

function yAxisFor(meta) {
  return meta.yType === 'log'
    ? logY({ name: meta.unit, scale: true })
    : valueY({ name: meta.unit, scale: true });
}

/** 收入对位：横轴为人均 GDP（PPP，2021 年不变价），两国曲线在同一收入水平上比较 */
function incomeOption(metricKey, meta) {
  const income = SERIES.gdpPcPppKd;
  const src = SERIES[meta.seriesKey];
  const points = (iso) => Object.entries(src[iso] ?? {})
    .filter(([y]) => income[iso]?.[y] != null)
    .map(([y, v]) => ({ value: [income[iso][y], v], year: +y }))
    .sort((a, b) => a.value[0] - b.value[0]);

  return {
    grid: { left: 56, right: 20, top: 40, bottom: 48 },
    legend: { ...LEGEND, top: 0, data: ['越南', '中国'] },
    tooltip: {
      trigger: 'item',
      ...CHART_TOOLTIP,
      formatter: (p) => `${p.marker}${p.seriesName} ${p.data.year}<br/>人均 GDP（PPP）${fmt(p.data.value[0], '国际元')}<br/>${meta.label}：${fmt(p.data.value[1], meta.unit)}`,
    },
    xAxis: {
      type: 'log',
      name: '人均 GDP（PPP，2021 年不变价国际元，对数）',
      nameLocation: 'middle',
      nameGap: 30,
      nameTextStyle: { fontSize: 10 },
      axisLine: AXIS,
      splitLine: GRID_LINE,
      axisLabel: LABEL,
      min: 1500,
      max: 30000,
    },
    yAxis: yAxisFor(meta),
    series: [
      line('越南', VN_COLOR, points('VNM'), {
        showSymbol: true,
        symbolSize: 4,
        smooth: false,
        markLine: {
          silent: true,
          symbol: 'none',
          lineStyle: { type: 'dashed', color: VN_COLOR, width: 1 },
          label: { formatter: '越南 2025 ≈ 中国 2015–16', color: VN_COLOR, fontSize: 10 },
          data: [{ xAxis: income.VNM[2025] }],
        },
      }),
      line('中国', CN_COLOR, points('CHN'), { showSymbol: true, symbolSize: 4, smooth: false }),
    ],
  };
}

/** 中越对位折线：calendar=同日历年；reform/wto=相对对位年 t；income=收入水平横轴 */
export function alignedLineOption(metricKey, mode) {
  const meta = METRICS[metricKey];
  if (mode.income) return incomeOption(metricKey, meta);

  const data = SERIES[meta.seriesKey] ?? { VNM: {}, CHN: {} };
  const calendar = !mode.vnAnchor;

  let categories;
  let vnPoints;
  let cnPoints;
  if (calendar) {
    const years = [];
    for (let y = CAL_FROM; y <= CAL_TO; y += 1) years.push(y);
    categories = years.map(String);
    vnPoints = years.map((y) => ({ value: data.VNM[y] ?? null, year: y }));
    cnPoints = years.map((y) => ({ value: data.CHN[y] ?? null, year: y }));
  } else {
    const ts = [];
    for (let t = mode.tMin; t <= mode.tMax; t += 1) ts.push(t);
    categories = ts.map((t) => (t > 0 ? `+${t}` : String(t)));
    vnPoints = ts.map((t) => ({ value: data.VNM[mode.vnAnchor + t] ?? null, year: mode.vnAnchor + t }));
    cnPoints = ts.map((t) => ({ value: data.CHN[mode.cnAnchor + t] ?? null, year: mode.cnAnchor + t }));
  }

  const zeroMark = calendar ? undefined : {
    silent: true,
    symbol: 'none',
    lineStyle: { type: 'dashed', color: mode.accent, width: 1 },
    label: { formatter: `t=0 · 越${mode.vnAnchor} / 中${mode.cnAnchor}`, color: mode.accent, fontSize: 10 },
    data: [{ xAxis: '0' }],
  };

  return {
    grid: { left: 56, right: 20, top: 40, bottom: 44 },
    legend: { ...LEGEND, top: 0, data: ['越南', '中国'] },
    tooltip: {
      trigger: 'axis',
      ...CHART_TOOLTIP,
      formatter: (params) => {
        const head = calendar ? `${params[0]?.axisValue} 年` : `对位年 t=${params[0]?.axisValue}`;
        const rows = params
          .filter((p) => p.data?.value != null)
          .map((p) => `${p.marker}${p.seriesName} ${p.data.year}：${fmt(p.data.value, meta.unit)}`);
        return [head, ...rows].join('<br/>');
      },
    },
    xAxis: {
      ...categoryX(categories, { interval: 4 }),
      name: calendar ? '年份' : '对位年 t',
      nameLocation: 'middle',
      nameGap: 28,
      nameTextStyle: { fontSize: 10 },
    },
    yAxis: yAxisFor(meta),
    series: [
      line('越南', VN_COLOR, vnPoints, zeroMark ? { markLine: zeroMark } : {}),
      line('中国', CN_COLOR, cnPoints),
    ],
  };
}

// —— 附加图表 ——————————————————————————————————————————————————————————————

/** 2025 年中—越—美货物流向（亿美元）：中越双向取中国海关，美越双向取美国普查局 */
const TRADE_LINKS = [
  { source: '中国（供给）', target: '越南', value: 1981.5, note: '中国对越出口 · 海关总署' },
  { source: '美国（供给）', target: '越南', value: 156.0, note: '美国对越出口 · 美国普查局' },
  { source: '越南', target: '美国（市场）', value: 1938.8, note: '美国自越进口 · 美国普查局' },
  { source: '越南', target: '中国（市场）', value: 979.9, note: '中国自越进口 · 海关总署' },
];

function tradeFlowOption() {
  const nodeColor = {
    '中国（供给）': CN_COLOR, '中国（市场）': CN_COLOR, 越南: VN_COLOR,
    '美国（供给）': CHART_SERIES_COLORS.cyberCyan, '美国（市场）': CHART_SERIES_COLORS.cyberCyan,
  };
  return {
    tooltip: {
      trigger: 'item',
      ...CHART_TOOLTIP,
      formatter: (p) => (p.dataType === 'edge'
        ? `${p.data.source} → ${p.data.target}<br/>${fmt(p.data.value, '亿美元')}<br/><span style="opacity:.7">${p.data.note}</span>`
        : p.name),
    },
    series: [{
      type: 'sankey',
      left: 8,
      right: 96,
      top: 12,
      bottom: 12,
      nodeGap: 18,
      nodeWidth: 14,
      draggable: false,
      emphasis: { focus: 'adjacency' },
      label: { ...LABEL, fontSize: 11 },
      lineStyle: { color: 'gradient', opacity: 0.35, curveness: 0.5 },
      data: Object.keys(nodeColor).map((name) => ({ name, itemStyle: { color: nodeColor[name] } })),
      links: TRADE_LINKS,
    }],
  };
}

/** 机构 / 区划精简幅度（%）：越南 2025 vs 中国 1998、2023 */
const ADMIN_ROWS = [
  { name: '越南 2025 · 乡级 10,035→3,321', v: 66.9, vn: true },
  { name: '越南 2025 · 省级 63→34', v: 46.0, vn: true },
  { name: '越南 2025 · 政府部委 22→17', v: 22.7, vn: true },
  { name: '中国 1998 · 国务院行政编制 3.23→1.67 万', v: 47.5, vn: false },
  { name: '中国 1998 · 国务院组成部门 40→29', v: 27.5, vn: false },
  { name: '中国 2023 · 中央国家机关编制', v: 5.0, vn: false },
];

function adminReformOption() {
  const rows = [...ADMIN_ROWS].reverse();
  return {
    grid: { left: 8, right: 40, top: 10, bottom: 24, containLabel: true },
    tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' }, ...CHART_TOOLTIP, formatter: (ps) => `${ps[0].name}<br/>精简 ${ps[0].value}%` },
    xAxis: { type: 'value', max: 80, axisLine: AXIS, splitLine: GRID_LINE, axisLabel: { ...LABEL, formatter: '{value}%' } },
    yAxis: { type: 'category', data: rows.map((r) => r.name), axisLine: AXIS, axisLabel: { ...LABEL, fontSize: 10 } },
    series: [{
      type: 'bar',
      barWidth: 14,
      data: rows.map((r) => ({ value: r.v, itemStyle: { color: r.vn ? VN_COLOR : CN_COLOR, borderRadius: [0, 3, 3, 0] } })),
      label: { show: true, position: 'right', ...LABEL, formatter: '−{c}%' },
    }],
  };
}

/** PISA 三科：越南 2012 / 2022、OECD 平均 2022、中国京沪苏浙 2018 */
function pisaOption() {
  const subjects = ['数学', '阅读', '科学'];
  const bar = (name, color, data) => ({ name, type: 'bar', barGap: '12%', itemStyle: { color, borderRadius: [3, 3, 0, 0] }, data, label: { show: true, position: 'top', ...LABEL, fontSize: 9 } });
  return {
    grid: { left: 44, right: 12, top: 44, bottom: 28 },
    legend: { ...LEGEND, top: 0 },
    tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' }, ...CHART_TOOLTIP },
    xAxis: categoryX(subjects),
    yAxis: valueY({ min: 400, max: 620, name: '分' }),
    series: [
      bar('越南 2012', 'rgba(232,163,23,0.5)', [511, 508, 528]),
      bar('越南 2022', VN_COLOR, [469, 462, 472]),
      bar('OECD 平均 2022', CHART_SERIES_COLORS.slate, [472, 476, 485]),
      bar('中国京沪苏浙 2018', CN_COLOR, [591, 555, 590]),
    ],
  };
}

/** 越南全面战略伙伴累计（截至 2026-09） */
export const CSP = [
  ['中国', '2008-05-30'], ['俄罗斯', '2012-07-27'], ['印度', '2016-09-03'], ['韩国', '2022-12-05'],
  ['美国', '2023-09-10'], ['日本', '2023-11-27'], ['澳大利亚', '2024-03-07'], ['法国', '2024-10-08'],
  ['马来西亚', '2024-11-21'], ['新西兰', '2025-02-26'], ['印尼', '2025-03-10'], ['新加坡', '2025-03-12'],
  ['泰国', '2025-05-16'], ['英国', '2025-10-29'], ['欧盟', '2026-01-29'],
];

function cspTimelineOption() {
  const highlight = { 中国: CN_COLOR, 美国: CHART_SERIES_COLORS.cyberCyan };
  const data = CSP.map(([name, date], i) => ({
    name,
    value: [date, i + 1],
    itemStyle: { color: highlight[name] ?? VN_COLOR },
    symbolSize: highlight[name] ? 12 : 8,
    label: { show: true, formatter: name, position: i % 2 ? 'bottom' : 'top', ...LABEL, fontSize: 10, color: highlight[name] ?? LABEL.color },
  }));
  return {
    grid: { left: 40, right: 20, top: 24, bottom: 36 },
    tooltip: { trigger: 'item', ...CHART_TOOLTIP, formatter: (p) => `${p.name} · ${p.value[0].slice(0, 7)}<br/>累计第 ${p.value[1]} 个全面战略伙伴` },
    xAxis: { type: 'time', min: '2007-01-01', max: '2026-12-31', axisLine: AXIS, splitLine: { show: false }, axisLabel: LABEL },
    yAxis: valueY({ min: 0, max: 16, interval: 4, name: '累计' }),
    series: [{
      type: 'line',
      step: 'end',
      symbol: 'circle',
      lineStyle: { color: VN_COLOR, width: 1.6 },
      data,
    }],
  };
}

export const EXTRA_CHARTS = {
  tradeFlow: {
    title: '2025 年中—越—美货物流向（亿美元）',
    note: '中越双向取中国海关总署口径，美越双向取美国普查局口径（各对双边取同一方统计，避免镜像差混用）。越方口径自华进口约 1,860 亿美元、对美出口约 1,532 亿美元，差异来自计价（CIF/FOB）、转口与统计时点。',
    height: 300,
    build: tradeFlowOption,
  },
  adminReform: {
    title: '机构与区划精简幅度：越南 2025 vs 中国 1998 / 2023',
    note: '越南：第 176/2025/QH15（部委）、202/2025/QH15（省级）号决议及越南政府门户网站（乡级）；中国：1998 年国务院机构改革（上海市编办史料）、2023 年党和国家机构改革方案（中国政府网）。精简对象口径不同（单位数 vs 编制数），仅比较力度量级。',
    height: 280,
    build: adminReformOption,
  },
  pisa: {
    title: 'PISA 三科成绩对照',
    note: 'OECD PISA。越南 2018 年因作答数据与模型拟合异常被排除出国际比较；2022 年阅读量表与国际联结较弱、样本约覆盖 68% 的 15 岁人口。中国仅京沪苏浙四省市参加，2022 年因停课未能采集数据。年份不同、样本不同，仅作量级参考。',
    height: 280,
    build: pisaOption,
  },
  cspTimeline: {
    title: '越南全面战略伙伴累计（2008–2026）',
    note: '越南政府门户网站 2026-02-03 信息图（15 个）；分项日期部分来自越通社与维基百科转引。2026 年菲律宾为「加强版战略伙伴」，不计入。',
    height: 280,
    build: cspTimelineOption,
  },
};
