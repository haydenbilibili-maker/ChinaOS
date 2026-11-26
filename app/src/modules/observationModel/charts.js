// 复杂网络观测模型 · ECharts option 构造（纯函数）
import { AXIS, LABEL, GRID_LINE, CHART_TOOLTIP, chartSeriesColor } from '../shared/chartHelpers.js';

export const NEG = '#e5483b';
export const GOLD = '#d4a25a';
export const BLUE = '#6e8cff';
export const TEAL = '#6fc2ae';
export const CYAN = '#4fa3c7';
export const L_COLORS = { L1: GOLD, L2: TEAL, L3: NEG };

export const signed = (v) => `${v > 0 ? '+' : v < 0 ? '−' : ''}${Math.abs(v).toFixed(1)}`;

// ── 网络图 ──────────────────────────────────────────────────────────────────

const CATEGORIES = [
  { name: '枢纽', itemStyle: { color: GOLD } },
  { name: '权力管道', itemStyle: { color: BLUE } },
  { name: '人事圈层', itemStyle: { color: TEAL } },
  { name: '在任', itemStyle: { color: CYAN } },
  { name: '被查处', itemStyle: { color: NEG } },
];
const CAT_INDEX = { hub: 0, pipeline: 1, circle: 2 };

export function networkOption({ nodes, links }, selectedId) {
  const data = nodes.map((n) => {
    const category = n.kind === 'member' ? (n.status === '被查处' ? 4 : 3) : CAT_INDEX[n.kind];
    const psc = n.kind === 'member' && /常委/.test(n.person?.post || '');
    const size = n.kind === 'hub' ? 58 : n.kind === 'pipeline' ? 30 : n.kind === 'circle' ? 16 + n.protect * 6 : psc ? 18 : 12;
    const selected = n.id === selectedId;
    return {
      id: n.id,
      name: n.name,
      category,
      symbol: n.kind === 'pipeline' ? 'roundRect' : n.kind === 'circle' ? 'diamond' : 'circle',
      symbolSize: selected ? size + 8 : size,
      value: n.kind,
      itemStyle: {
        borderColor: selected ? '#ffffff' : 'rgba(0,0,0,0)',
        borderWidth: selected ? 2 : 0,
        opacity: n.kind === 'member' && n.status === '被查处' ? 0.9 : 1,
      },
      label: {
        show: true,
        position: n.kind === 'hub' ? 'inside' : n.kind === 'member' ? 'right' : 'bottom',
        fontSize: n.kind === 'hub' ? 13 : n.kind === 'member' ? 10 : 11,
        fontWeight: n.kind === 'member' ? 400 : 600,
        color: n.kind === 'hub' ? '#0b0f17' : LABEL.color,
        formatter: n.kind === 'pipeline' || n.kind === 'circle' ? n.name.replace('（省/直辖市）', '') : n.name,
      },
    };
  });
  const TIP = {
    'hub-pipe': '权力管道',
    'member-circle': '圈层归属',
    'member-pipe': '岗位所在管道',
  };
  const edges = links.map((l) => ({
    source: l.source,
    target: l.target,
    value: l.weight,
    tip: l.kind === 'hub-circle' ? `边的保护力 ${l.weight} / 3` : `${TIP[l.kind]}${l.broken ? ' · 已断开（被查处）' : ''}`,
    lineStyle: {
      width: l.kind === 'hub-circle' ? Math.max(0.6, l.weight * 1.6) : l.kind === 'hub-pipe' ? 2.4 : 0.8,
      type: l.broken || (l.kind === 'hub-circle' && l.weight < 1) ? 'dashed' : 'solid',
      color: l.broken ? NEG : l.kind.startsWith('hub') ? GOLD : LABEL.color,
      opacity: l.kind === 'member-pipe' ? 0.25 : l.broken ? 0.55 : 0.6,
      curveness: l.kind === 'member-pipe' ? 0.15 : 0,
    },
  }));
  return {
    tooltip: {
      ...CHART_TOOLTIP,
      formatter: (p) => {
        if (p.dataType === 'edge') return p.data.tip;
        return p.name;
      },
    },
    legend: [{ data: CATEGORIES.map((c) => c.name), bottom: 0, textStyle: { color: LABEL.color, fontSize: 11 }, itemWidth: 10, itemHeight: 10 }],
    series: [{
      type: 'graph',
      layout: 'force',
      roam: false,
      draggable: true,
      categories: CATEGORIES,
      data,
      links: edges,
      force: { repulsion: 150, edgeLength: [36, 110], gravity: 0.09, friction: 0.25 },
      emphasis: { focus: 'adjacency', lineStyle: { width: 2.5 } },
      labelLayout: { hideOverlap: true },
    }],
  };
}

// ── 情景概率 ────────────────────────────────────────────────────────────────

/** 领导层情景轨迹；whatIf 为假设信号后的后验（可空），以虚线延伸 */
export function trajectoryOption(points, whatIf) {
  const labels = points.map((p) => (p.date ? `${p.label}\n${p.date.slice(5)}` : '五中全会前'));
  if (whatIf) labels.push('假设信号');
  const ids = ['L1', 'L2', 'L3'];
  const solid = ids.map((id) => ({
    name: id,
    type: 'line',
    data: points.map((p) => p.probs[id]),
    lineStyle: { color: L_COLORS[id], width: 2.5 },
    itemStyle: { color: L_COLORS[id] },
    symbolSize: 8,
    label: { show: true, position: 'top', color: LABEL.color, fontSize: 10, formatter: (q) => (q.dataIndex === points.length - 1 ? `${q.value}%` : '') },
  }));
  const dashed = whatIf ? ids.map((id) => ({
    name: `${id} 假设`,
    type: 'line',
    data: [...points.slice(0, -1).map(() => null), points.at(-1).probs[id], whatIf[id]],
    lineStyle: { color: L_COLORS[id], width: 2, type: 'dashed' },
    itemStyle: { color: L_COLORS[id] },
    symbol: 'emptyCircle',
    symbolSize: 8,
    label: { show: true, position: 'right', color: L_COLORS[id], fontSize: 10, formatter: (q) => (q.dataIndex === labels.length - 1 ? `${q.value}%` : '') },
    tooltip: { show: false },
  })) : [];
  return {
    tooltip: {
      ...CHART_TOOLTIP,
      trigger: 'axis',
      formatter: (ps) => {
        const i = ps[0].dataIndex;
        const p = points[i];
        const head = p ? (p.event ? `${p.date} · ${p.event}` : '起点（五中全会前主观先验）') : '假设所选信号出现';
        const rows = ps.filter((x) => x.value != null).map((x) => `${x.marker}${x.seriesName} ${x.value}%`).join('<br/>');
        return `${head}<br/>${rows}`;
      },
    },
    legend: { data: ids, top: 0, right: 0, textStyle: { color: LABEL.color, fontSize: 11 }, itemWidth: 12, itemHeight: 8 },
    grid: { left: 36, right: 48, top: 30, bottom: 36 },
    xAxis: { type: 'category', data: labels, axisLine: AXIS, axisLabel: { ...LABEL, fontSize: 10 }, boundaryGap: false },
    yAxis: { type: 'value', min: 0, max: 100, splitLine: GRID_LINE, axisLabel: { ...LABEL, formatter: '{value}%' } },
    series: [...solid, ...dashed],
  };
}

// ── 事件时间轴 ──────────────────────────────────────────────────────────────

export const LANES = ['政治', '军队', '经济', '外部', '话语'];

export function timelineOption(events, { selectedKey, highlightKeys }) {
  const laneOf = (t) => LANES.indexOf(String(t).split('/')[0]);
  return {
    tooltip: {
      ...CHART_TOOLTIP,
      formatter: (p) => `${p.data.date} · ${p.data.type}<br/>${p.data.event}<br/>方向：${p.data.direction}`,
    },
    grid: { left: 44, right: 16, top: 12, bottom: 28 },
    xAxis: {
      type: 'time',
      min: '2026-01-01',
      max: '2026-12-31',
      axisLine: AXIS,
      splitLine: GRID_LINE,
      axisLabel: { ...LABEL, formatter: (v) => `${new Date(v).getUTCMonth() + 1}月` },
    },
    yAxis: { type: 'category', data: LANES, axisLine: AXIS, axisLabel: LABEL, inverse: true },
    series: [{
      type: 'scatter',
      data: events.map((e) => {
        const key = `${e.date}|${e.event}`;
        const on = !highlightKeys || highlightKeys.has(key);
        const sel = key === selectedKey;
        return {
          ...e,
          key,
          value: [e.date, laneOf(e.type)],
          symbolSize: sel ? 20 : 13,
          itemStyle: {
            color: chartSeriesColor(laneOf(e.type)),
            opacity: on ? 0.95 : 0.18,
            borderColor: sel ? '#ffffff' : 'rgba(0,0,0,0)',
            borderWidth: sel ? 2 : 0,
          },
        };
      }),
    }],
  };
}

// ── 精英与经济 ──────────────────────────────────────────────────────────────

export function plenumOption(rows, { base, alert }) {
  return {
    tooltip: {
      ...CHART_TOOLTIP,
      trigger: 'axis',
      formatter: (ps) => {
        const r = rows[ps[0].dataIndex];
        return `${r.plenum}全会（${r.date}）<br/>出席 ${r.total} 人 · ${r.share.toFixed(1)}%<br/>中委 ${r.full} · 候补 ${r.alternates}`;
      },
    },
    grid: { left: 36, right: 12, top: 26, bottom: 26 },
    xAxis: { type: 'category', data: rows.map((r) => r.plenum), axisLine: AXIS, axisLabel: LABEL },
    yAxis: { type: 'value', max: 400, splitLine: GRID_LINE, axisLabel: LABEL },
    series: [{
      type: 'bar',
      barWidth: '50%',
      data: rows.map((r) => ({ value: r.total, itemStyle: { color: r.share < alert ? NEG : chartSeriesColor(0), borderRadius: [4, 4, 0, 0] } })),
      label: { show: true, position: 'top', formatter: (p) => `${rows[p.dataIndex].share.toFixed(1)}%`, color: LABEL.color, fontSize: 10 },
      markLine: {
        symbol: 'none',
        lineStyle: { type: 'dashed', color: LABEL.color, opacity: 0.5 },
        label: { formatter: `${base} 人`, color: LABEL.color, position: 'insideEndTop', fontSize: 10 },
        data: [{ yAxis: base }],
      },
    }],
  };
}

export function econOption(rows) {
  const data = [...rows].reverse();
  return {
    tooltip: {
      ...CHART_TOOLTIP,
      trigger: 'axis',
      axisPointer: { type: 'shadow' },
      formatter: (ps) => { const r = data[ps[0].dataIndex]; return `${r.metric}（${r.period}）：${signed(r.value)}%`; },
    },
    grid: { left: 104, right: 40, top: 4, bottom: 20 },
    xAxis: { type: 'value', splitLine: GRID_LINE, axisLabel: { ...LABEL, fontSize: 10, formatter: '{value}%' } },
    yAxis: { type: 'category', data: data.map((r) => r.metric), axisLine: AXIS, axisLabel: { ...LABEL, fontSize: 10 } },
    series: [{
      type: 'bar',
      barWidth: '58%',
      data: data.map((r) => ({
        value: r.value,
        itemStyle: { color: r.value < 0 ? NEG : chartSeriesColor(0) },
        label: { position: r.value < 0 ? 'left' : 'right' },
      })),
      label: { show: true, formatter: (p) => signed(p.value), color: LABEL.color, fontSize: 10 },
    }],
  };
}

export function propertyOption(rows) {
  return {
    tooltip: { ...CHART_TOOLTIP, trigger: 'axis', formatter: (ps) => `${rows[ps[0].dataIndex].period}：${signed(ps[0].value)}%` },
    grid: { left: 40, right: 16, top: 22, bottom: 36 },
    xAxis: { type: 'category', data: rows.map((r) => r.period.replace(' 年 ', '\n')), axisLine: AXIS, axisLabel: { ...LABEL, fontSize: 10 } },
    yAxis: { type: 'value', max: 0, min: -25, splitLine: GRID_LINE, axisLabel: { ...LABEL, fontSize: 10, formatter: '{value}%' } },
    series: [{
      type: 'line',
      data: rows.map((r, i) => ({ value: r.value, itemStyle: { color: i === 0 ? LABEL.color : NEG } })),
      lineStyle: { color: NEG, width: 2 },
      symbolSize: 8,
      label: { show: true, position: 'bottom', formatter: (p) => signed(p.value), color: LABEL.color, fontSize: 10 },
    }],
  };
}
