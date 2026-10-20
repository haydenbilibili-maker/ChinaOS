// 共享 ECharts 样式 · 各专题模块统一轴/网格/图例 token
// ----------------------------------------------------------------------------
// 主题适配：AXIS/GRID_LINE/LABEL/LEGEND 为「原地可变」对象（各模块以引用方式
// 引入），applyChartTheme(theme) 在日览/夜览切换时就地改写其颜色字段；配合
// EChart 监听主题事件重渲染，无需各模块改写。series 配色保持各自定义。

// 双主题调色板：夜览(dark) 沿用既有冷峻深色，日览(light) 提升对比度但保持冷灰基调
const CHART_PALETTE = {
  dark: {
    axis: '#2a2d36',
    label: '#a29c91',
    split: 'rgba(162, 156, 145,0.1)',
    splitStrong: 'rgba(162, 156, 145,0.15)',
    tooltipBg: 'rgba(20, 23, 31, 0.94)',
    tooltipBorder: 'rgba(162, 156, 145, 0.22)',
    tooltipText: '#ede8df',
    pointBorder: '#ffffff',
  },
  light: {
    axis: '#cfc6b5',
    label: '#5a544b',
    split: 'rgba(22, 19, 15, 0.08)',
    splitStrong: 'rgba(22, 19, 15, 0.14)',
    tooltipBg: 'rgba(255, 255, 255, 0.98)',
    tooltipBorder: 'rgba(22, 19, 15, 0.14)',
    tooltipText: '#16130f',
    pointBorder: '#ffffff',
  },
};

// 当前生效调色板（默认夜览），functions 在渲染期读取
let C = CHART_PALETTE.dark;

function readCssChartVar(name, fallback) {
  if (typeof document === 'undefined') return fallback;
  const v = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  return v || fallback;
}

/** 专题模块统一系列色 · power-red → cyber-cyan → fire-gold 语义序 */
export const CHART_SERIES_COLORS = {
  powerRed: '#e5483b',
  cyberCyan: '#6e8cff',
  fireGold: '#d4a25a',
  emerald: '#6fc2ae',
  violet: '#b07cc6',
  orange: '#c07a4a',
  slate: '#8a8578',
};

/** VI 2.0 数据可视化有序色板（§1.4）：option 未指定 color 时的默认序 */
export const VI_DATA_PALETTE = ['#6e8cff', '#d4a25a', '#6fc2ae', '#e5483b', '#b07cc6', '#4fa3c7', '#c07a4a', '#8a8578'];

/** 画布无法解析 CSS 变量，图表字体必须写字面量 */
export const CHART_FONT_FAMILY = 'Inter, "Noto Sans SC", "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", system-ui, sans-serif';

export const CHART_SERIES_PALETTE = [
  CHART_SERIES_COLORS.powerRed,
  CHART_SERIES_COLORS.cyberCyan,
  CHART_SERIES_COLORS.fireGold,
  CHART_SERIES_COLORS.emerald,
  CHART_SERIES_COLORS.violet,
  CHART_SERIES_COLORS.orange,
  CHART_SERIES_COLORS.slate,
];

/** 地图 choropleth 日/夜视觉序 · 河山拟省图 & 神州活图可共用 */
export const MAP_CHOROPLETH = {
  dark: ['#1e2a30', '#3d5560', '#9a6a40', '#d06058'],
  light: ['#f0e6d4', '#e0c090', '#c47a3a', '#9e2b25'],
};

export function mapChoropleth(theme = 'dark') {
  return MAP_CHOROPLETH[theme === 'light' ? 'light' : 'dark'];
}

/** Δ12 月发散序：降温蓝 → 中性底 → 升温暖（对齐 MAP_CHOROPLETH 端点） */
export const MAP_DELTA_CHOROPLETH = {
  dark: ['#6e8cff', MAP_CHOROPLETH.dark[0], MAP_CHOROPLETH.dark[3]],
  light: ['#2563eb', MAP_CHOROPLETH.light[0], MAP_CHOROPLETH.light[3]],
};

export function mapDeltaChoropleth(theme = 'dark') {
  return MAP_DELTA_CHOROPLETH[theme === 'light' ? 'light' : 'dark'];
}

/** 未着色省区 idle 底色 · 与 choropleth 低端同系 */
export const MAP_AREA_IDLE = {
  dark: MAP_CHOROPLETH.dark[0],
  light: '#e8edf4',
};

export function mapAreaIdle(theme = 'dark') {
  return MAP_AREA_IDLE[theme === 'light' ? 'light' : 'dark'];
}

export const AXIS = { lineStyle: { color: C.axis } };
export const GRID_LINE = { lineStyle: { color: C.split } };
export const LABEL = { color: C.label, fontSize: 11 };
export const LEGEND = { textStyle: { color: C.label, fontSize: 11 }, itemWidth: 12, itemHeight: 8, icon: 'roundRect' };
export const GRID = { left: 36, right: 16, top: 16, bottom: 42 };
export const GRID_WIDE = { left: 44, right: 44, top: 30, bottom: 24 };

/** 统一 tooltip 皮肤 · EChart 与模块 option 可 spread */
export const CHART_TOOLTIP = {
  backgroundColor: C.tooltipBg,
  borderColor: C.tooltipBorder,
  borderWidth: 1,
  textStyle: { color: C.tooltipText, fontSize: 12, fontFamily: CHART_FONT_FAMILY },
  extraCssText: 'border-radius: 12px; padding: 10px 12px; line-height: 1.55; backdrop-filter: blur(14px); -webkit-backdrop-filter: blur(14px); box-shadow: 0 18px 40px -16px rgba(0,0,0,0.45);',
};

/** 折线/散点高亮描边色 */
export function chartPointBorder() {
  return C.pointBorder;
}

/** 图表主文本色（供 EChart 全局 textStyle 使用） */
export function chartTextColor() {
  return C.label;
}

/** 主题切换时就地更新共享 token，使已被各模块引用的对象同步变色 */
export function applyChartTheme(theme) {
  C = CHART_PALETTE[theme === 'light' ? 'light' : 'dark'];
  AXIS.lineStyle.color = C.axis;
  GRID_LINE.lineStyle.color = C.split;
  LABEL.color = C.label;
  LEGEND.textStyle.color = C.label;
  CHART_TOOLTIP.backgroundColor = readCssChartVar('--chart-tooltip-bg', C.tooltipBg);
  CHART_TOOLTIP.borderColor = readCssChartVar('--chart-tooltip-border', C.tooltipBorder);
  CHART_TOOLTIP.textStyle.color = readCssChartVar('--chart-tooltip-text', C.tooltipText);
}

export function categoryX(data, opts = {}) {
  return { type: 'category', data, axisLine: AXIS, axisLabel: { ...LABEL, ...opts } };
}

export function valueY(opts = {}) {
  return { type: 'value', splitLine: GRID_LINE, axisLabel: { ...LABEL, ...opts.axisLabel }, ...opts };
}

export function logY(opts = {}) {
  return { type: 'log', splitLine: GRID_LINE, axisLabel: { ...LABEL, ...opts.axisLabel }, ...opts };
}

export function donutOpt(data, { center = ['50%', '44%'], radius = ['42%', '68%'] } = {}) {
  return {
    tooltip: { trigger: 'item', formatter: '{b}: {c}%', ...CHART_TOOLTIP },
    legend: { type: 'scroll', bottom: 0, textStyle: { color: C.label }, icon: 'circle' },
    series: [{ type: 'pie', radius, center, label: { show: false }, data }],
  };
}

function hexAlpha(hex, a = 0.12) {
  const h = hex.replace('#', '');
  return `rgba(${parseInt(h.slice(0, 2), 16)},${parseInt(h.slice(2, 4), 16)},${parseInt(h.slice(4, 6), 16)},${a})`;
}

/** 星条旗蓝 · 中美对比图美国侧（日览 Old Glory Blue / 夜览提亮以保证可读） */
export const US_FLAG_BLUE = {
  light: '#002868',
  dark: '#5b8fd9',
};

export function usFlagBlue(theme = 'dark') {
  return US_FLAG_BLUE[theme === 'light' ? 'light' : 'dark'];
}

export function usFlagBlueAlpha(theme = 'dark', alpha = 0.12) {
  return hexAlpha(usFlagBlue(theme), alpha);
}

export function radarOpt(indicators, values, { name = '综合', color = '#e5483b' } = {}) {
  return {
    radar: {
      indicator: indicators.map((n) => (typeof n === 'string' ? { name: n, max: 100 } : n)),
      axisName: { color: C.label, fontSize: 10 },
      splitLine: { lineStyle: { color: C.splitStrong } },
      axisLine: { lineStyle: { color: C.splitStrong } },
      splitArea: { show: false },
    },
    series: [{ type: 'radar', data: [{ value: values, name, lineStyle: { color, width: 2 }, itemStyle: { color }, areaStyle: { color: hexAlpha(color) } }] }],
  };
}

/** GDP/趋势图 + markArea 高亮阶段区间 */
export function timelineMarkAreaOpt({ years, values, span, highlightColor = '#6e8cff', lineColor = '#e5483b' }) {
  const [a, b] = span;
  return {
    grid: { left: 48, right: 16, top: 16, bottom: 24 },
    tooltip: { trigger: 'axis', ...CHART_TOOLTIP },
    xAxis: categoryX(years),
    yAxis: logY(),
    series: [{
      type: 'line', smooth: true, symbol: 'circle',
      data: values.map((v, i) => ({
        value: v,
        itemStyle: { color: (i >= a && i <= b) ? highlightColor : lineColor, borderWidth: (i >= a && i <= b) ? 2 : 0, borderColor: C.pointBorder },
        symbolSize: (i >= a && i <= b) ? 9 : 5,
      })),
      lineStyle: { color: lineColor, width: 2 },
      areaStyle: { color: 'rgba(229, 72, 59,0.1)' },
      markArea: { silent: true, itemStyle: { color: 'rgba(110, 140, 255,0.08)' }, data: [[{ xAxis: years[a] }, { xAxis: years[b] }]] },
    }],
  };
}

export function chartSeriesColor(index = 0) {
  return CHART_SERIES_PALETTE[((index % CHART_SERIES_PALETTE.length) + CHART_SERIES_PALETTE.length) % CHART_SERIES_PALETTE.length];
}

export function stackedBarOpt({ categories, series, horizontal = false }) {
  const cat = horizontal ? 'yAxis' : 'xAxis';
  const val = horizontal ? 'xAxis' : 'yAxis';
  return {
    tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' }, ...CHART_TOOLTIP },
    legend: { ...LEGEND, top: 0 },
    grid: { left: horizontal ? 72 : 36, right: 24, top: 30, bottom: 16 },
    [cat]: { type: 'category', data: categories, axisLine: AXIS, axisLabel: LABEL },
    [val]: { type: 'value', splitLine: GRID_LINE, axisLabel: LABEL },
    series: series.map((s) => ({ type: 'bar', stack: 'total', barWidth: 14, ...s })),
  };
}
