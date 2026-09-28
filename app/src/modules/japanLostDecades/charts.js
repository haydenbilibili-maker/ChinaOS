import { SERIES } from './seriesGenerated.js';
import { METRICS, JP_UNI_RATE } from './data.js';
import {
  categoryX, valueY, logY, LEGEND, CHART_TOOLTIP, CHART_SERIES_COLORS,
} from '../shared/chartHelpers.js';

export const JP_COLOR = CHART_SERIES_COLORS.cyberCyan;
export const CN_COLOR = CHART_SERIES_COLORS.powerRed;

const T_MIN = -20;
const T_MAX = 35;

function rawSeries(metricKey) {
  if (metricKey === 'eduRates') return { JPN: JP_UNI_RATE.data, CHN: SERIES.tertiary.CHN };
  const key = METRICS[metricKey]?.seriesKey;
  return SERIES[key] ?? { JPN: {}, CHN: {} };
}

function transformed(metricKey) {
  const { transform } = METRICS[metricKey] ?? {};
  const src = rawSeries(metricKey);
  const out = {};
  for (const iso of ['JPN', 'CHN']) {
    const entries = Object.entries(src[iso] ?? {});
    if (transform === 'peakIndex') {
      const peak = Math.max(...entries.map(([, v]) => v));
      out[iso] = Object.fromEntries(entries.map(([y, v]) => [y, Math.round((v / peak) * 1000) / 10]));
    } else if (transform === 'wan') {
      out[iso] = Object.fromEntries(entries.map(([y, v]) => [y, Math.round(v / 100) / 100]));
    } else {
      out[iso] = Object.fromEntries(entries);
    }
  }
  return out;
}

function fmt(v, unit) {
  if (v == null) return '—';
  const n = Math.abs(v) >= 1000 ? Math.round(v).toLocaleString('en-US') : v;
  return unit ? `${n} ${unit}` : `${n}`;
}

/** 中日对位折线：mode.offset=0 时按日历年，否则按相对对位年 t */
export function alignedLineOption(metricKey, mode) {
  const meta = METRICS[metricKey];
  const data = transformed(metricKey);
  const calendar = !mode.jpAnchor;

  let categories;
  let jpPoints;
  let cnPoints;
  if (calendar) {
    const years = [];
    for (let y = 1980; y <= 2025; y += 1) years.push(y);
    categories = years.map(String);
    jpPoints = years.map((y) => ({ value: data.JPN[y] ?? null, year: y }));
    cnPoints = years.map((y) => ({ value: data.CHN[y] ?? null, year: y }));
  } else {
    const ts = [];
    for (let t = T_MIN; t <= T_MAX; t += 1) ts.push(t);
    categories = ts.map((t) => (t > 0 ? `+${t}` : String(t)));
    jpPoints = ts.map((t) => ({ value: data.JPN[mode.jpAnchor + t] ?? null, year: mode.jpAnchor + t }));
    cnPoints = ts.map((t) => ({ value: data.CHN[mode.cnAnchor + t] ?? null, year: mode.cnAnchor + t }));
  }

  const line = (name, color, points, extra = {}) => ({
    name,
    type: 'line',
    smooth: true,
    connectNulls: true,
    showSymbol: false,
    lineStyle: { width: 2.2, color },
    itemStyle: { color },
    data: points,
    ...extra,
  });

  const zeroMark = calendar ? undefined : {
    silent: true,
    symbol: 'none',
    lineStyle: { type: 'dashed', color: mode.accent, width: 1 },
    label: { formatter: `t=0 · 日${mode.jpAnchor} / 中${mode.cnAnchor}`, color: mode.accent, fontSize: 10 },
    data: [{ xAxis: '0' }],
  };

  return {
    grid: { left: 52, right: 20, top: 40, bottom: 44 },
    legend: { ...LEGEND, top: 0, data: ['日本', '中国'] },
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
    yAxis: meta.yType === 'log'
      ? logY({ name: meta.unit, scale: true })
      : valueY({ name: meta.unit, scale: true }),
    series: [
      line('日本', JP_COLOR, jpPoints, zeroMark ? { markLine: zeroMark } : {}),
      line('中国', CN_COLOR, cnPoints),
    ],
  };
}
