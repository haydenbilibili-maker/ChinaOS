import {
  categoryX, valueY, LEGEND, CHART_TOOLTIP, CHART_SERIES_COLORS, AXIS, LABEL, GRID_LINE, chartTextColor,
} from '../shared/chartHelpers.js';

// 学者看板通用 ECharts option：只依赖 data.js 的数据形状（契约见 schema.js / docs/scholars/README.md）

const yearOf = (d) => Number(String(d).slice(0, 4));

/** 年 × 领域热力：文库讲话/文章 + 著作的领域标注计数（非全部公开发言） */
export function themeHeatmapOption(D) {
  const { THEMES, THEME_KEYS, CORPUS, BOOKS } = D;
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

/** 履历甘特：透明底条 + 任期条；颜色取 CAREER_GROUPS[group] */
export function careerGanttOption(D) {
  const { CAREER, CAREER_GROUPS, AS_OF } = D;
  const nowYear = yearOf(AS_OF) + 0.7;
  const rows = [...CAREER].reverse();
  const cats = rows.map((r) => (r.role.length > 16 ? `${r.role.slice(0, 16)}…` : r.role));
  const minStart = Math.floor(Math.min(...CAREER.map((r) => r.start)) / 4) * 4;
  return {
    tooltip: {
      ...CHART_TOOLTIP,
      trigger: 'item',
      formatter: (p) => {
        const r = rows[p.dataIndex];
        const f = (v) => `${Math.floor(v)}.${String(Math.min(12, Math.round((v % 1) * 12) + 1)).padStart(2, '0')}`;
        return `${r.role}<br/>${f(r.start)} — ${r.end >= nowYear ? '至今' : f(r.end)}${r.note ? `<br/><span style="opacity:.75">${r.note}</span>` : ''}`;
      },
    },
    grid: { left: 150, right: 20, top: 8, bottom: 28 },
    xAxis: { type: 'value', min: minStart, max: yearOf(AS_OF) + 1, interval: 4, axisLine: AXIS, splitLine: GRID_LINE, axisLabel: { ...LABEL } },
    yAxis: { type: 'category', data: cats, axisLine: AXIS, axisLabel: { ...LABEL, fontSize: 10 } },
    series: [
      { type: 'bar', stack: 'g', silent: true, itemStyle: { color: 'transparent' }, data: rows.map((r) => r.start), tooltip: { show: false } },
      {
        type: 'bar', stack: 'g', barWidth: 12,
        data: rows.map((r) => ({
          value: Math.max(0.3, r.end - r.start),
          itemStyle: {
            color: CAREER_GROUPS[r.group]?.color ?? CHART_SERIES_COLORS.slate,
            opacity: r.note?.includes('存疑') ? 0.45 : 0.9,
            borderRadius: 3,
          },
        })),
      },
    ],
  };
}

/** 著作时间线：散点 */
export function bookTimelineOption(D) {
  const books = D.BOOKS.filter((b) => b.year);
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
  const years = books.map((b) => b.year);
  const lo = Math.min(...years) - 2;
  const hi = Math.max(...years) + 2;
  const maxStack = Math.max(1, ...Object.values(seen));
  return {
    tooltip: {
      ...CHART_TOOLTIP,
      formatter: (p) => `《${p.data.book.title}》<br/>${p.data.book.publisher} · ${p.data.book.date ?? p.data.book.year}${p.data.book.note ? `<br/><span style="opacity:.75">${p.data.book.note}</span>` : ''}`,
    },
    grid: { left: 24, right: 24, top: 16, bottom: 28 },
    xAxis: { type: 'value', min: lo, max: hi, minInterval: 1, axisLine: AXIS, splitLine: GRID_LINE, axisLabel: { ...LABEL } },
    yAxis: { type: 'value', min: 0, max: maxStack + 1, show: false },
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
export function numericDeviationOption(D) {
  const rows = D.NUMERIC_CHECKS ?? [];
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
export function frameworkGraphOption(D) {
  const { FRAMEWORK } = D;
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
