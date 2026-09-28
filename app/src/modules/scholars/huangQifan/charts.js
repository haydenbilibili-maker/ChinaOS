import {
  categoryX, valueY, LEGEND, CHART_TOOLTIP, CHART_SERIES_COLORS, AXIS, LABEL, GRID_LINE, chartTextColor,
} from '../../shared/chartHelpers.js';
import {
  THEMES, THEME_KEYS, CORPUS, BOOKS, CAREER, NUMERIC_CHECKS, FRAMEWORK,
} from './data.js';

const yearOf = (d) => Number(String(d).slice(0, 4));

/** 年 × 主题热力：文库讲话/文章 + 著作的主题标注计数（非全部公开发言） */
export function themeHeatmapOption() {
  const years = [...new Set([...CORPUS.map((k) => yearOf(k.date)), ...BOOKS.filter((b) => b.year).map((b) => b.year)])]
    .sort((a, b) => a - b);
  const counts = new Map();
  const bump = (y, t) => counts.set(`${y}|${t}`, (counts.get(`${y}|${t}`) ?? 0) + 1);
  CORPUS.forEach((k) => k.themes.forEach((t) => bump(yearOf(k.date), t)));
  BOOKS.filter((b) => b.year).forEach((b) => b.themes.forEach((t) => bump(b.year, t)));

  const data = [];
  years.forEach((y, xi) => THEME_KEYS.forEach((t, yi) => {
    const v = counts.get(`${y}|${t}`) ?? 0;
    data.push([xi, yi, v || '-']);
  }));
  const max = Math.max(1, ...counts.values());

  return {
    tooltip: {
      ...CHART_TOOLTIP,
      formatter: (p) => `${years[p.value[0]]} · ${THEMES[THEME_KEYS[p.value[1]]].label}<br/>样本计数：${p.value[2] === '-' ? 0 : p.value[2]}`,
    },
    grid: { left: 108, right: 16, top: 8, bottom: 64 },
    xAxis: { ...categoryX(years.map(String)), splitArea: { show: false } },
    yAxis: {
      type: 'category',
      data: THEME_KEYS.map((t) => THEMES[t].label),
      axisLine: AXIS,
      axisLabel: { ...LABEL },
    },
    visualMap: {
      min: 0, max, calculable: false, orient: 'horizontal', left: 'center', bottom: 4,
      itemWidth: 10, itemHeight: 120, textStyle: { ...LABEL },
      inRange: { color: ['rgba(34,211,238,0.08)', CHART_SERIES_COLORS.cyberCyan, CHART_SERIES_COLORS.fireGold] },
    },
    series: [{
      type: 'heatmap', data,
      label: { show: true, fontSize: 10 },
      itemStyle: { borderColor: 'rgba(15,22,35,0.6)', borderWidth: 1 },
      emphasis: { itemStyle: { shadowBlur: 8, shadowColor: 'rgba(0,0,0,0.4)' } },
    }],
  };
}

const CITY_COLOR = {
  sh: CHART_SERIES_COLORS.cyberCyan,
  cq: CHART_SERIES_COLORS.powerRed,
  bj: CHART_SERIES_COLORS.fireGold,
  tk: CHART_SERIES_COLORS.emerald,
};

/** 履历甘特：透明底条 + 任期条 */
export function careerGanttOption() {
  const rows = [...CAREER].reverse();
  const cats = rows.map((r) => r.role.length > 16 ? `${r.role.slice(0, 16)}…` : r.role);
  return {
    tooltip: {
      ...CHART_TOOLTIP,
      trigger: 'item',
      formatter: (p) => {
        const r = rows[p.dataIndex];
        const f = (v) => `${Math.floor(v)}.${String(Math.round((v % 1) * 12) + 1).padStart(2, '0')}`;
        return `${r.role}<br/>${f(r.start)} — ${r.end >= 2026.7 ? '至今' : f(r.end)}${r.note ? `<br/><span style="opacity:.75">${r.note}</span>` : ''}`;
      },
    },
    grid: { left: 150, right: 20, top: 8, bottom: 28 },
    xAxis: { type: 'value', min: 1968, max: 2027, interval: 4, axisLine: AXIS, splitLine: GRID_LINE, axisLabel: { ...LABEL } },
    yAxis: { type: 'category', data: cats, axisLine: AXIS, axisLabel: { ...LABEL, fontSize: 10 } },
    series: [
      { type: 'bar', stack: 'g', silent: true, itemStyle: { color: 'transparent' }, data: rows.map((r) => r.start), tooltip: { show: false } },
      {
        type: 'bar', stack: 'g', barWidth: 12,
        data: rows.map((r) => ({
          value: r.end - r.start,
          itemStyle: { color: CITY_COLOR[r.city], opacity: r.note?.includes('存疑') ? 0.45 : 0.9, borderRadius: 3 },
        })),
      },
    ],
  };
}

/** 著作时间线：散点 */
export function bookTimelineOption() {
  const books = BOOKS.filter((b) => b.year);
  const seen = {};
  const data = books.map((b) => {
    seen[b.year] = (seen[b.year] ?? 0) + 1;
    return {
      value: [b.year, seen[b.year]],
      name: b.title,
      book: b,
      itemStyle: { color: b.verified === 'primary' ? CHART_SERIES_COLORS.fireGold : CHART_SERIES_COLORS.slate },
    };
  });
  return {
    tooltip: {
      ...CHART_TOOLTIP,
      formatter: (p) => `《${p.data.book.title}》<br/>${p.data.book.publisher} · ${p.data.book.date ?? p.data.book.year}${p.data.book.note ? `<br/><span style="opacity:.75">${p.data.book.note}</span>` : ''}`,
    },
    grid: { left: 24, right: 24, top: 16, bottom: 28 },
    xAxis: { type: 'value', min: 1993, max: 2026, interval: 3, axisLine: AXIS, splitLine: GRID_LINE, axisLabel: { ...LABEL } },
    yAxis: { type: 'value', min: 0, max: 4, show: false },
    series: [{
      type: 'scatter', symbolSize: 18, data,
      label: {
        show: true, position: 'top', color: 'inherit', fontSize: 10,
        formatter: (p) => (p.data.book.title.length > 8 ? `${p.data.book.title.slice(0, 8)}…` : p.data.book.title),
      },
    }],
  };
}

/** 数字口径偏离：(表述 − 官方) / 官方 */
export function numericDeviationOption() {
  const rows = NUMERIC_CHECKS;
  return {
    tooltip: {
      ...CHART_TOOLTIP,
      trigger: 'axis',
      axisPointer: { type: 'shadow' },
      formatter: (ps) => {
        const r = rows[ps[0].dataIndex];
        return `${r.label}<br/>表述：${r.said} ${r.unit}（${r.saidSrc}）<br/>官方：${r.official} ${r.unit}（${r.offSrc}）<br/>偏离：${r.deviation > 0 ? '+' : ''}${r.deviation}%${r.comparable ? '' : '<br/>⚠ 时间窗口不同，仅作参考'}`;
      },
    },
    legend: { show: false, ...LEGEND },
    grid: { left: 112, right: 40, top: 8, bottom: 28 },
    xAxis: valueY({ axisLabel: { formatter: '{value}%' } }),
    yAxis: { ...categoryX(rows.map((r) => r.label)), inverse: true },
    series: [{
      type: 'bar', barWidth: 14,
      data: rows.map((r) => ({
        value: r.deviation,
        itemStyle: {
          color: r.deviation >= 0 ? CHART_SERIES_COLORS.fireGold : CHART_SERIES_COLORS.cyberCyan,
          opacity: r.comparable ? 0.9 : 0.4,
          borderRadius: 3,
        },
      })),
      label: { show: true, position: 'right', color: 'inherit', fontSize: 10, formatter: (p) => `${p.value > 0 ? '+' : ''}${p.value}%` },
      markLine: { silent: true, symbol: 'none', lineStyle: { color: '#64748b', type: 'dashed' }, data: [{ xAxis: 0 }] },
    }],
  };
}

const CAT_COLORS = [
  CHART_SERIES_COLORS.fireGold,
  CHART_SERIES_COLORS.powerRed,
  '#94a3b8',
  CHART_SERIES_COLORS.cyberCyan,
  CHART_SERIES_COLORS.emerald,
  CHART_SERIES_COLORS.violet,
];

/** 思想框架力导图 */
export function frameworkGraphOption() {
  return {
    tooltip: { ...CHART_TOOLTIP, formatter: (p) => (p.dataType === 'node' ? `${p.data.name.replace('\n', '')} · ${FRAMEWORK.categories[p.data.category]}` : '') },
    legend: { ...LEGEND, bottom: 0, data: FRAMEWORK.categories.slice(1) },
    color: CAT_COLORS,
    series: [{
      type: 'graph', layout: 'force', roam: true, draggable: true,
      force: { repulsion: 220, edgeLength: [50, 110], gravity: 0.08 },
      categories: FRAMEWORK.categories.map((name) => ({ name })),
      data: FRAMEWORK.nodes.map((n) => ({ id: n.id, name: n.name, category: n.cat, symbolSize: n.size })),
      links: FRAMEWORK.links.map(([source, target]) => ({ source, target })),
      label: { show: true, color: chartTextColor(), fontSize: 10 },
      lineStyle: { color: 'source', opacity: 0.45, width: 1.2, curveness: 0.12 },
      emphasis: { focus: 'adjacency', lineStyle: { width: 2.4 } },
    }],
  };
}
