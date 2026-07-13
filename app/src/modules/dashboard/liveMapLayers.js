// ============================================================================
// 神州活图 · 可扩展图层插件架构
// ----------------------------------------------------------------------------
// 扩展新图层（信息增密）：
//   1. 在 MAP_LAYER_DEFS 追加条目（id / name / type / zIndex / dataSource）
//   2. 在 buildOverlaySeries(id, ctx) 实现 ECharts series 片段
//   3. 若需异步数据，在 fetchLayerData(id) 返回 Promise，由 useLiveMapLayers 拉取
//   4. toggleable: false 的底图层不可关闭；其余默认可见性写入 localStorage
//
// 图层类型 type：
//   base       — 省界底图（geo + map series，始终渲染）
//   choropleth — 指标着色（主数据层，与 metric layerId 联动）
//   labels     — 省名标注
//   scatter    — 点位（省会等）
//   flow       — 弧线（迁徙/贸易）
//   overlay    — 其他叠加（地震、空情等）
// ============================================================================

import { PROVINCE_COORDS, PROVINCE_NAMES } from './liveMapData.js';
import { shortProvinceName } from './liveMapGeo.js';
import DataBus from '../../lib/data/DataBus.js';

export const LAYER_PREFS_KEY = 'shenzhou-live-layer-prefs';

/** @typedef {'base'|'choropleth'|'labels'|'scatter'|'flow'|'overlay'} MapLayerType */

/**
 * @typedef {Object} MapLayerDef
 * @property {string} id
 * @property {string} name
 * @property {MapLayerType} type
 * @property {number} zIndex
 * @property {boolean} defaultVisible
 * @property {boolean} [toggleable=true]
 * @property {string} [dataSource]
 * @property {string} [legend]
 * @property {string} [icon]
 * @property {string} [desc]
 */

/** 叠加图层注册表（底图 + 着色由主组件驱动，此处管可切换叠加层） */
export const MAP_LAYER_DEFS = /** @type {MapLayerDef[]} */ ([
  {
    id: 'base',
    name: '省界底图',
    type: 'base',
    zIndex: 0,
    defaultVisible: true,
    toggleable: false,
    dataSource: 'geo.datav.aliyun.com',
    legend: '阿里云 DataV 区划边界',
    icon: 'Map',
    desc: '全国省级边界 · 网络加载，失败回退本地 GeoJSON',
  },
  {
    id: 'choropleth',
    name: '指标着色',
    type: 'choropleth',
    zIndex: 1,
    defaultVisible: true,
    toggleable: false,
    legend: '选中指标层的省级色阶',
    icon: 'Layers',
    desc: '与上方指标条联动 · 种子/实测/网络财政等',
  },
  {
    id: 'labels',
    name: '省名标注',
    type: 'labels',
    zIndex: 10,
    defaultVisible: true,
    toggleable: true,
    icon: 'Type',
    desc: '省级简称标注 · 随缩放漫游',
  },
  {
    id: 'fiscal-network',
    name: '财政自给率',
    type: 'choropleth',
    zIndex: 1,
    defaultVisible: false,
    toggleable: true,
    dataSource: '/data/province-stats.json',
    legend: '一般公共预算收入/支出 (%)',
    icon: 'Landmark',
    desc: '网络拉取省级财政快照 · DataBus.provinceStats',
  },
  {
    id: 'scatter-capitals',
    name: '省会点位',
    type: 'scatter',
    zIndex: 5,
    defaultVisible: false,
    toggleable: true,
    dataSource: 'local:PROVINCE_COORDS',
    legend: '31 省省会/中心坐标',
    icon: 'MapPin',
    desc: '省会城市散点 · 后续可换 API 城市库',
  },
  {
    id: 'flow-migration',
    name: '迁徙弧线',
    type: 'flow',
    zIndex: 3,
    defaultVisible: false,
    toggleable: true,
    dataSource: 'seed:MIGRATION_FLOWS',
    legend: '七普口径主通道示意',
    icon: 'GitBranch',
    desc: '省际人口迁徙弧线 · 权重驱动线宽',
  },
  {
    id: 'overlay-quakes',
    name: '地震目录',
    type: 'overlay',
    zIndex: 4,
    defaultVisible: false,
    toggleable: true,
    dataSource: 'USGS API',
    legend: '30 天 M4+ · 周边 bbox',
    icon: 'Activity',
    desc: 'USGS 地震实时叠加',
  },
  {
    id: 'overlay-flights',
    name: '空情 ADS-B',
    type: 'overlay',
    zIndex: 5,
    defaultVisible: false,
    toggleable: true,
    dataSource: 'airplanes.live',
    legend: '可见航班散点（稀疏）',
    icon: 'Plane',
    desc: '社区 ADS-B 航班叠加',
  },
]);

const DEFAULT_PREFS = Object.fromEntries(
  MAP_LAYER_DEFS.filter((d) => d.toggleable).map((d) => [d.id, d.defaultVisible]),
);

/** @returns {Record<string, boolean>} */
export function loadLayerPrefs() {
  if (typeof localStorage === 'undefined') return { ...DEFAULT_PREFS };
  try {
    const raw = localStorage.getItem(LAYER_PREFS_KEY);
    if (!raw) return { ...DEFAULT_PREFS };
    const parsed = JSON.parse(raw);
    return { ...DEFAULT_PREFS, ...parsed };
  } catch {
    return { ...DEFAULT_PREFS };
  }
}

/** @param {Record<string, boolean>} prefs */
export function saveLayerPrefs(prefs) {
  if (typeof localStorage === 'undefined') return;
  try {
    localStorage.setItem(LAYER_PREFS_KEY, JSON.stringify(prefs));
  } catch { /* quota / private mode */ }
}

/** @param {string} id @param {Record<string, boolean>} prefs */
export function isLayerVisible(id, prefs) {
  const def = MAP_LAYER_DEFS.find((d) => d.id === id);
  if (!def) return false;
  if (!def.toggleable) return true;
  return prefs[id] ?? def.defaultVisible;
}

/** 省际迁徙流（七普口径主通道 · 权重示意） */
export const MIGRATION_FLOWS = [
  ['河南省', '广东省', 10], ['湖南省', '广东省', 9], ['广西壮族自治区', '广东省', 9],
  ['四川省', '广东省', 8], ['安徽省', '江苏省', 8], ['河南省', '浙江省', 8],
  ['黑龙江省', '广东省', 8], ['河北省', '北京市', 7], ['安徽省', '上海市', 6],
  ['江西省', '浙江省', 6], ['贵州省', '浙江省', 6], ['湖北省', '广东省', 6],
  ['辽宁省', '北京市', 5], ['吉林省', '广东省', 5], ['黑龙江省', '山东省', 5],
  ['甘肃省', '新疆维吾尔自治区', 4],
];

/**
 * 网络财政层 choropleth 序列
 * @returns {Promise<{ series: { name: string, value: number, metrics: object }[], meta: object, source: string }>}
 */
export async function fetchFiscalChoropleth() {
  const { source, meta, provinces } = await DataBus.provinceStats();
  const series = PROVINCE_NAMES.map((name) => {
    const row = provinces.find((p) => p.name === name);
    const value = row?.fiscal_self ?? null;
    return {
      name,
      value,
      metrics: {
        value,
        fiscal_self: value,
        pop: row?.pop,
        pop_change: row?.pop_change,
        debt_ratio: row?.debt_ratio,
      },
    };
  }).filter((d) => d.value != null);
  return { series, meta, source };
}

/**
 * @param {string} layerId
 * @param {object} ctx
 * @returns {object[]|null} ECharts series 片段
 */
export function buildOverlaySeries(layerId, ctx) {
  const {
    theme, isCompact, STEEL, HOLD,
    quakesState, flightsState,
    buildQuakeSeries, quakeSymbolSize, quakeColor,
    buildFlightSeries,
  } = ctx;
  const isDark = theme !== 'light';

  switch (layerId) {
    case 'scatter-capitals':
      if (isCompact) return null;
      return [{
        name: 'scatter-capitals',
        type: 'scatter',
        coordinateSystem: 'geo',
        zlevel: 5,
        symbolSize: 6,
        data: PROVINCE_NAMES
          .filter((n) => PROVINCE_COORDS[n])
          .map((n) => ({ name: n, value: [...PROVINCE_COORDS[n], 1] })),
        itemStyle: { color: isDark ? '#a5f3fc' : '#0891b2', opacity: 0.75 },
        label: {
          show: false,
        },
        emphasis: {
          label: { show: true, formatter: (p) => shortProvinceName(p.name), fontSize: 9, color: HOLD },
          itemStyle: { color: HOLD },
        },
      }];

    case 'flow-migration':
      if (isCompact) return null;
      return [{
        name: 'flow-migration',
        type: 'lines',
        coordinateSystem: 'geo',
        zlevel: 3,
        silent: true,
        effect: { show: true, period: 5, trailLength: 0.45, symbol: 'arrow', symbolSize: 4.5, color: HOLD },
        lineStyle: { color: HOLD, opacity: 0.22, curveness: 0.32 },
        data: MIGRATION_FLOWS
          .filter(([f, t]) => PROVINCE_COORDS[f] && PROVINCE_COORDS[t])
          .map(([f, t, w]) => ({
            coords: [PROVINCE_COORDS[f], PROVINCE_COORDS[t]],
            lineStyle: { width: 0.5 + w * 0.16 },
          })),
      }];

    case 'overlay-quakes':
      if (isCompact || !quakesState?.quakes?.length) return null;
      return [{
        name: 'quakes',
        type: 'effectScatter',
        coordinateSystem: 'geo',
        zlevel: 4,
        data: buildQuakeSeries(quakesState.quakes).map((q) => ({ ...q, itemStyle: { color: quakeColor(q.mag) } })),
        symbolSize: quakeSymbolSize,
        rippleEffect: { scale: 2.4, brushType: 'stroke', period: 4 },
        itemStyle: { shadowBlur: 10, shadowColor: 'rgba(239,68,68,0.5)' },
      }];

    case 'overlay-flights':
      if (isCompact || !flightsState?.flights?.length) return null;
      return [{
        name: 'flights',
        type: 'scatter',
        coordinateSystem: 'geo',
        zlevel: 5,
        symbol: 'path://M0,-7 L5,7 L0,4 L-5,7 Z',
        symbolSize: 7,
        data: buildFlightSeries(flightsState.flights),
        itemStyle: { color: isDark ? '#a5f3fc' : '#0e7490', opacity: 0.85, shadowBlur: 4, shadowColor: 'rgba(34,211,238,0.6)' },
        emphasis: { itemStyle: { color: HOLD, opacity: 1 } },
      }];

    default:
      return null;
  }
}

/** geo.label 配置（labels 图层） */
export function buildGeoLabelOption(showLabels, labelColor) {
  if (!showLabels) {
    return { show: false };
  }
  return {
    show: true,
    color: labelColor,
    fontSize: 9,
    formatter: (p) => shortProvinceName(p.name),
  };
}
