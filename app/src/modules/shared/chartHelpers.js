// 共享 ECharts 样式 · 各专题模块统一轴/网格/图例 token
// ----------------------------------------------------------------------------
// 主题适配：AXIS/GRID_LINE/LABEL/LEGEND 为「原地可变」对象（各模块以引用方式
// 引入），applyChartTheme(theme) 在日览/夜览切换时就地改写其颜色字段；配合
// EChart 监听主题事件重渲染，无需各模块改写。series 配色保持各自定义。

// 双主题调色板：夜览(dark) 沿用既有冷峻深色，日览(light) 提升对比度但保持冷灰基调
const CHART_PALETTE = {
  dark: {
    axis: '#27324a',
    label: '#93a1b5',
    split: 'rgba(148,163,184,0.1)',
    splitStrong: 'rgba(148,163,184,0.15)',
    tooltipBg: 'rgba(15, 22, 35, 0.94)',
    tooltipBorder: 'rgba(148, 163, 184, 0.22)',
    tooltipText: '#e8edf6',
    pointBorder: '#ffffff',
  },
  light: {
    axis: '#b8c4d4',
    label: '#3a4659',
    split: 'rgba(58, 70, 89, 0.1)',
    splitStrong: 'rgba(58, 70, 89, 0.16)',
    tooltipBg: 'rgba(252, 253, 255, 0.98)',
    tooltipBorder: 'rgba(15, 23, 42, 0.12)',
    tooltipText: '#121820',
    pointBorder: '#ffffff',
  },
};

// 当前生效调色板（默认夜览），functions 在渲染期读取
let C = CHART_PALETTE.dark;

export const AXIS = { lineStyle: { color: C.axis } };
export const GRID_LINE = { lineStyle: { color: C.split } };
export const LABEL = { color: C.label, fontSize: 10 };
export const LEGEND = { textStyle: { color: C.label, fontSize: 10 }, itemWidth: 12 };
export const GRID = { left: 36, right: 16, top: 16, bottom: 42 };
export const GRID_WIDE = { left: 44, right: 44, top: 30, bottom: 24 };

/** 统一 tooltip 皮肤 · EChart 与模块 option 可 spread */
export const CHART_TOOLTIP = {
  backgroundColor: C.tooltipBg,
  borderColor: C.tooltipBorder,
  borderWidth: 1,
  textStyle: { color: C.tooltipText, fontSize: 11 },
  extraCssText: 'border-radius: 8px; box-shadow: 0 4px 16px -4px rgba(15,23,42,0.15);',
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
  CHART_TOOLTIP.backgroundColor = C.tooltipBg;
  CHART_TOOLTIP.borderColor = C.tooltipBorder;
  CHART_TOOLTIP.textStyle.color = C.tooltipText;
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

export function radarOpt(indicators, values, { name = '综合', color = '#c41e3a' } = {}) {
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
export function timelineMarkAreaOpt({ years, values, span, highlightColor = '#22d3ee', lineColor = '#c41e3a' }) {
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
      areaStyle: { color: 'rgba(196,30,58,0.1)' },
      markArea: { silent: true, itemStyle: { color: 'rgba(34,211,238,0.08)' }, data: [[{ xAxis: years[a] }, { xAxis: years[b] }]] },
    }],
  };
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
