// 共享 ECharts 样式 · 各专题模块统一轴/网格/图例 token
export const AXIS = { lineStyle: { color: '#27324a' } };
export const GRID_LINE = { lineStyle: { color: 'rgba(148,163,184,0.1)' } };
export const LABEL = { color: '#93a1b5', fontSize: 10 };
export const LEGEND = { textStyle: { color: '#93a1b5', fontSize: 10 }, itemWidth: 12 };
export const GRID = { left: 36, right: 16, top: 16, bottom: 42 };
export const GRID_WIDE = { left: 44, right: 44, top: 30, bottom: 24 };

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
    tooltip: { trigger: 'item', formatter: '{b}: {c}%' },
    legend: { type: 'scroll', bottom: 0, textStyle: { color: '#93a1b5' }, icon: 'circle' },
    series: [{ type: 'pie', radius, center, label: { show: false }, data }],
  };
}

function hexAlpha(hex, a = 0.12) {
  const h = hex.replace('#', '');
  return `rgba(${parseInt(h.slice(0, 2), 16)},${parseInt(h.slice(2, 4), 16)},${parseInt(h.slice(4, 6), 16)},${a})`;
}

export function radarOpt(indicators, values, { name = '综合', color = '#c41e3a' } = {}) {
  return {
    radar: {
      indicator: indicators.map((n) => (typeof n === 'string' ? { name: n, max: 100 } : n)),
      axisName: { color: '#93a1b5', fontSize: 10 },
      splitLine: { lineStyle: { color: 'rgba(148,163,184,0.15)' } },
      axisLine: { lineStyle: { color: 'rgba(148,163,184,0.15)' } },
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
    tooltip: { trigger: 'axis' },
    xAxis: categoryX(years),
    yAxis: logY(),
    series: [{
      type: 'line', smooth: true, symbol: 'circle',
      data: values.map((v, i) => ({
        value: v,
        itemStyle: { color: (i >= a && i <= b) ? highlightColor : lineColor, borderWidth: (i >= a && i <= b) ? 2 : 0, borderColor: '#fff' },
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
    tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
    legend: { ...LEGEND, top: 0 },
    grid: { left: horizontal ? 72 : 36, right: 24, top: 30, bottom: 16 },
    [cat]: { type: 'category', data: categories, axisLine: AXIS, axisLabel: LABEL },
    [val]: { type: 'value', splitLine: GRID_LINE, axisLabel: LABEL },
    series: series.map((s) => ({ type: 'bar', stack: 'total', barWidth: 14, ...s })),
  };
}
