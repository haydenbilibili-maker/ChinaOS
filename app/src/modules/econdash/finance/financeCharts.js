// ============================================================================
// 经济大盘 · 资本市场 ECharts option 构建（纯函数 · 零 React）
// ============================================================================

import {
  AXIS, GRID, GRID_LINE, GRID_WIDE, LABEL, LEGEND, CHART_TOOLTIP,
  donutOpt, stackedBarOpt, CHART_SERIES_COLORS,
} from '../../shared/chartHelpers.js';
import {
  MONEY_SUPPLY, CPI_PPI, AFRE_SERIES, RATE_CORRIDOR, FX_USDCNY,
  MARKET_SENTIMENT, CAPITAL_FLOW, TSF_STOCK, FINANCE_MIX,
  SECTOR_AFRE, REGIONAL_AFRE,
} from './financeData.js';

const C = CHART_SERIES_COLORS;

function monthLabel(m) {
  const p = m.split('-');
  return p.length >= 2 ? `${+p[1]}月` : m;
}

/** 1 · 货币供应：M0/M1/M2 柱状 + M1−M2 剪刀差折线 */
export function moneySupplyOption() {
  const months = MONEY_SUPPLY.months.map(monthLabel);
  return {
    tooltip: { trigger: 'axis', ...CHART_TOOLTIP },
    legend: { top: 0, textStyle: { ...LEGEND.textStyle, fontSize: 11 }, data: ['M0 同比', 'M1 同比', 'M2 同比', 'M1−M2 剪刀差'] },
    grid: GRID_WIDE,
    xAxis: { type: 'category', data: months, axisLine: AXIS, axisLabel: { ...LABEL, fontSize: 10 }, axisTick: { show: false } },
    yAxis: [
      { type: 'value', name: '% 同比', nameTextStyle: { ...LABEL, fontSize: 10 }, axisLine: AXIS, axisLabel: LABEL, splitLine: GRID_LINE },
      { type: 'value', name: 'pct', nameTextStyle: { ...LABEL, fontSize: 10 }, axisLine: AXIS, axisLabel: LABEL, splitLine: { show: false } },
    ],
    series: [
      { name: 'M0 同比', type: 'line', smooth: true, symbol: 'circle', symbolSize: 4, data: MONEY_SUPPLY.m0, lineStyle: { width: 2, color: C.emerald }, itemStyle: { color: C.emerald } },
      { name: 'M1 同比', type: 'line', smooth: true, symbol: 'circle', symbolSize: 4, data: MONEY_SUPPLY.m1, lineStyle: { width: 2, color: C.cyberCyan }, itemStyle: { color: C.cyberCyan } },
      { name: 'M2 同比', type: 'line', smooth: true, symbol: 'circle', symbolSize: 5, data: MONEY_SUPPLY.m2, lineStyle: { width: 2, color: C.fireGold }, itemStyle: { color: C.fireGold } },
      {
        name: 'M1−M2 剪刀差', type: 'line', yAxisIndex: 1, smooth: true, symbol: 'diamond', symbolSize: 6,
        data: MONEY_SUPPLY.scissors, lineStyle: { width: 2, color: C.violet, type: 'dashed' }, itemStyle: { color: C.violet },
        markLine: {
          silent: true, symbol: 'none', lineStyle: { type: 'dashed', color: '#c44e3d', opacity: 0.5 },
          label: { formatter: '零轴', fontSize: 10, color: '#c44e3d' },
          data: [{ yAxis: 0 }],
        },
      },
    ],
  };
}

/** 2 · 流动性温度计 gauge（M1−M2 剪刀差） */
export function liquidityGaugeOption(latestScissors, latestPulse) {
  const sc = typeof latestScissors === 'number' ? latestScissors : -5;
  const pulse = typeof latestPulse === 'number' ? latestPulse : 1.2;
  const scNorm = Math.max(0, Math.min(100, ((sc + 12) / 14) * 100));
  const pulseNorm = Math.max(0, Math.min(100, (pulse / 3) * 100));
  return {
    series: [
      {
        type: 'gauge', center: ['28%', '58%'], radius: '72%',
        startAngle: 200, endAngle: -20, min: 0, max: 100, splitNumber: 4,
        axisLine: { lineStyle: { width: 14, color: [[0.35, '#c44e3d'], [0.65, '#c99a4e'], [1, '#62a89e']] } },
        pointer: { width: 4, length: '58%', itemStyle: { color: C.violet } },
        axisTick: { show: false }, splitLine: { length: 8, lineStyle: { color: 'auto' } },
        axisLabel: { color: LABEL.color, fontSize: 9, distance: 14, formatter: (v) => (v === 0 ? '冷' : v === 100 ? '热' : '') },
        title: { offsetCenter: [0, '78%'], fontSize: 11, color: LABEL.color },
        detail: { offsetCenter: [0, '48%'], fontSize: 16, fontWeight: 'bold', color: C.violet, formatter: () => `${sc} pct` },
        data: [{ value: scNorm, name: 'M1−M2 剪刀差' }],
      },
      {
        type: 'gauge', center: ['72%', '58%'], radius: '72%',
        startAngle: 200, endAngle: -20, min: 0, max: 100, splitNumber: 4,
        axisLine: { lineStyle: { width: 14, color: [[0.4, '#c44e3d'], [0.7, '#c99a4e'], [1, '#62a89e']] } },
        pointer: { width: 4, length: '58%', itemStyle: { color: C.fireGold } },
        axisTick: { show: false }, splitLine: { length: 8, lineStyle: { color: 'auto' } },
        axisLabel: { show: false },
        title: { offsetCenter: [0, '78%'], fontSize: 11, color: LABEL.color },
        detail: { offsetCenter: [0, '48%'], fontSize: 16, fontWeight: 'bold', color: C.fireGold, formatter: () => `${pulse} pct` },
        data: [{ value: pulseNorm, name: '社融脉冲' }],
      },
    ],
  };
}

/** 3 · CPI-PPI 传导双轴 */
export function cpiPpiOption() {
  const months = CPI_PPI.months.map(monthLabel);
  return {
    tooltip: { trigger: 'axis', ...CHART_TOOLTIP },
    legend: { top: 0, textStyle: { ...LEGEND.textStyle, fontSize: 11 }, data: ['CPI 同比', 'PPI 同比', 'CPI−PPI 剪刀差'] },
    grid: GRID_WIDE,
    xAxis: { type: 'category', data: months, boundaryGap: false, axisLine: AXIS, axisLabel: LABEL, axisTick: { show: false } },
    yAxis: [
      { type: 'value', name: '% 同比', axisLine: AXIS, axisLabel: LABEL, splitLine: GRID_LINE },
      { type: 'value', name: 'pct', axisLine: AXIS, axisLabel: LABEL, splitLine: { show: false } },
    ],
    series: [
      {
        name: 'CPI 同比', type: 'line', smooth: true, symbol: 'circle', symbolSize: 5,
        data: CPI_PPI.cpi, lineStyle: { width: 2, color: C.emerald }, itemStyle: { color: C.emerald },
        markArea: {
          silent: true, itemStyle: { color: 'rgba(196,78,61,0.08)' },
          data: [[{ yAxis: -5 }, { yAxis: 0.5 }]],
        },
      },
      {
        name: 'PPI 同比', type: 'line', smooth: true, symbol: 'circle', symbolSize: 5,
        data: CPI_PPI.ppi, lineStyle: { width: 2, color: C.powerRed }, itemStyle: { color: C.powerRed },
      },
      {
        name: 'CPI−PPI 剪刀差', type: 'bar', yAxisIndex: 1, barWidth: 12,
        data: CPI_PPI.spread, itemStyle: { color: C.violet, opacity: 0.65, borderRadius: [2, 2, 0, 0] },
      },
    ],
  };
}

/** 4 · 利率走廊 */
export function rateCorridorOption() {
  const months = RATE_CORRIDOR.months.map(monthLabel);
  return {
    tooltip: { trigger: 'axis', ...CHART_TOOLTIP },
    legend: { top: 0, textStyle: { ...LEGEND.textStyle, fontSize: 10 }, data: ['1Y LPR', '5Y LPR', 'MLF 1Y', 'DR007'] },
    grid: GRID_WIDE,
    xAxis: { type: 'category', data: months, boundaryGap: false, axisLine: AXIS, axisLabel: LABEL, axisTick: { show: false } },
    yAxis: { type: 'value', name: '%', scale: true, min: 1.2, axisLine: AXIS, axisLabel: LABEL, splitLine: GRID_LINE },
    series: [
      { name: '1Y LPR', type: 'line', smooth: true, data: RATE_CORRIDOR.lpr1y, lineStyle: { width: 2, color: C.powerRed }, itemStyle: { color: C.powerRed } },
      { name: '5Y LPR', type: 'line', smooth: true, data: RATE_CORRIDOR.lpr5y, lineStyle: { width: 2, color: C.fireGold }, itemStyle: { color: C.fireGold } },
      { name: 'MLF 1Y', type: 'line', smooth: true, data: RATE_CORRIDOR.mlf1y, lineStyle: { width: 2, color: C.violet, type: 'dashed' }, itemStyle: { color: C.violet } },
      { name: 'DR007', type: 'line', smooth: true, data: RATE_CORRIDOR.dr007, lineStyle: { width: 2, color: C.cyberCyan }, itemStyle: { color: C.cyberCyan }, areaStyle: { color: 'rgba(34,211,238,0.08)' } },
    ],
  };
}

/** 5 · USD/CNY 走势 */
export function fxOption() {
  const months = FX_USDCNY.months.map(monthLabel);
  return {
    tooltip: { trigger: 'axis', ...CHART_TOOLTIP },
    grid: { left: 48, right: 24, top: 24, bottom: 28 },
    xAxis: { type: 'category', data: months, boundaryGap: false, axisLine: AXIS, axisLabel: LABEL, axisTick: { show: false } },
    yAxis: { type: 'value', scale: true, name: '元', axisLine: AXIS, axisLabel: { ...LABEL, formatter: (v) => v.toFixed(2) }, splitLine: GRID_LINE },
    series: [{
      type: 'line', smooth: true, symbol: 'circle', symbolSize: 6,
      data: FX_USDCNY.mid, lineStyle: { width: 2, color: C.emerald }, itemStyle: { color: C.emerald },
      areaStyle: { color: 'rgba(16,185,129,0.1)' },
      markLine: {
        silent: true, symbol: 'none', lineStyle: { type: 'dashed', color: C.fireGold, opacity: 0.6 },
        label: { formatter: '7.0 心理关口', fontSize: 10, color: C.fireGold },
        data: [{ yAxis: 7.0 }],
      },
    }],
  };
}

/** 6 · 股债跷跷板 + 北向/融资 */
export function sentimentOption() {
  const months = MARKET_SENTIMENT.months.map(monthLabel);
  return {
    tooltip: { trigger: 'axis', ...CHART_TOOLTIP },
    legend: { top: 0, textStyle: { ...LEGEND.textStyle, fontSize: 10 }, data: ['上证指数', '10Y 国债 %', '股债相对强弱', '北向净流入'] },
    grid: GRID_WIDE,
    xAxis: { type: 'category', data: months, axisLine: AXIS, axisLabel: LABEL, axisTick: { show: false } },
    yAxis: [
      { type: 'value', name: '上证/10Y', axisLine: AXIS, axisLabel: LABEL, splitLine: GRID_LINE },
      { type: 'value', name: '亿元', axisLine: AXIS, axisLabel: LABEL, splitLine: { show: false } },
    ],
    series: [
      { name: '上证指数', type: 'line', smooth: true, data: MARKET_SENTIMENT.sse, lineStyle: { width: 2, color: C.powerRed }, itemStyle: { color: C.powerRed } },
      { name: '10Y 国债 %', type: 'line', smooth: true, data: MARKET_SENTIMENT.cn10y, lineStyle: { width: 2, color: C.fireGold }, itemStyle: { color: C.fireGold } },
      { name: '股债相对强弱', type: 'bar', barWidth: 10, data: MARKET_SENTIMENT.seeSaw, itemStyle: { color: C.violet, opacity: 0.5 } },
      {
        name: '北向净流入', type: 'bar', yAxisIndex: 1, barWidth: 8,
        data: CAPITAL_FLOW.northbound,
        itemStyle: {
          color: (p) => (p.data >= 0 ? C.emerald : C.powerRed),
          borderRadius: [2, 2, 0, 0],
        },
      },
    ],
  };
}

/** 7 · 社融存量 donut */
export function tsfDonutOption() {
  return donutOpt(TSF_STOCK, { radius: ['44%', '68%'] });
}

/** 8 · 直接 vs 间接融资 */
export function financeMixOption() {
  return stackedBarOpt({
    categories: FINANCE_MIX.years,
    series: [
      { name: '间接融资（贷款）', data: FINANCE_MIX.indirect, itemStyle: { color: C.powerRed } },
      { name: '直接融资（债+股）', data: FINANCE_MIX.direct, itemStyle: { color: C.cyberCyan } },
    ],
  });
}

/** 9 · 行业社融 treemap */
export function sectorTreemapOption() {
  return {
    tooltip: { trigger: 'item', formatter: '{b}: {c}%', ...CHART_TOOLTIP },
    series: [{
      type: 'treemap',
      roam: false,
      nodeClick: false,
      breadcrumb: { show: false },
      label: { show: true, formatter: '{b}\n{c}%', fontSize: 11, color: LABEL.color },
      itemStyle: { borderColor: 'var(--bg-surface)', borderWidth: 2, gapWidth: 2 },
      data: SECTOR_AFRE,
    }],
  };
}

/** 10 · 区域社融占比 bar */
export function regionalAfreOption() {
  return {
    tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' }, ...CHART_TOOLTIP },
    legend: { top: 0, textStyle: { ...LEGEND.textStyle, fontSize: 10 }, data: ['存量占比 %', '增速 %'] },
    grid: { left: 72, right: 24, top: 30, bottom: 16 },
    xAxis: { type: 'value', axisLine: AXIS, axisLabel: LABEL, splitLine: GRID_LINE },
    yAxis: { type: 'category', data: REGIONAL_AFRE.map((r) => r.region), inverse: true, axisLine: AXIS, axisLabel: { ...LABEL, fontSize: 10 }, axisTick: { show: false } },
    series: [
      { name: '存量占比 %', type: 'bar', barWidth: 10, data: REGIONAL_AFRE.map((r) => r.share), itemStyle: { color: C.cyberCyan, borderRadius: [0, 3, 3, 0] } },
      { name: '增速 %', type: 'bar', barWidth: 10, data: REGIONAL_AFRE.map((r) => r.yoy), itemStyle: { color: C.fireGold, borderRadius: [0, 3, 3, 0] } },
    ],
  };
}

/** 11 · 融资余额 sparkline */
export function marginSparkOption() {
  const months = CAPITAL_FLOW.months.map(monthLabel);
  return {
    tooltip: { trigger: 'axis', ...CHART_TOOLTIP },
    grid: { left: 40, right: 16, top: 16, bottom: 24 },
    xAxis: { type: 'category', data: months, axisLine: AXIS, axisLabel: { ...LABEL, fontSize: 9 }, axisTick: { show: false } },
    yAxis: { type: 'value', scale: true, name: '万亿', nameTextStyle: { ...LABEL, fontSize: 9 }, axisLine: AXIS, axisLabel: LABEL, splitLine: GRID_LINE },
    series: [{
      type: 'line', smooth: true, symbol: 'circle', symbolSize: 5,
      data: CAPITAL_FLOW.marginBalance, lineStyle: { width: 2, color: C.violet }, itemStyle: { color: C.violet },
      areaStyle: { color: 'rgba(139,92,246,0.12)' },
    }],
  };
}
