// ============================================================================
// 神州活图 · 航运实况（主要港口 + 可选 AIS 船位）
// ----------------------------------------------------------------------------
// 数据源：
//   1. 内置主要枢纽港坐标（上海/宁波/深圳/青岛/天津/广州/大连/厦门等）
//   2. Worker GET /api/live/shipping
//      - 尝试 AISHub（需 wrangler secret AIS_HUB_USERNAME，免费注册）
//      - 失败则仅返回港口锚点 + vessels:[]
// 社区 AIS 覆盖沿海稀疏，点位代表「可见船位」而非全量船队。
// ============================================================================

import { useState, useEffect, useRef } from 'react';
import {
  cachedLiveFetch, fetchLiveJson, liveAbort, formatLiveTime, DEFAULT_REFRESH_MS,
} from './liveApi.js';

/** 中国主要集装箱/散货枢纽港（示意吞吐量权重 1–10） */
export const MAJOR_PORTS = [
  { id: 'sha', name: '上海港', lon: 121.47, lat: 31.23, rank: 10, teuM: 47 },
  { id: 'nbg', name: '宁波舟山港', lon: 121.55, lat: 29.87, rank: 9, teuM: 35 },
  { id: 'szn', name: '深圳港', lon: 114.05, lat: 22.52, rank: 9, teuM: 30 },
  { id: 'qdg', name: '青岛港', lon: 120.32, lat: 36.07, rank: 8, teuM: 27 },
  { id: 'tjg', name: '天津港', lon: 117.73, lat: 38.98, rank: 8, teuM: 22 },
  { id: 'gzn', name: '广州港', lon: 113.45, lat: 23.10, rank: 7, teuM: 25 },
  { id: 'dlc', name: '大连港', lon: 121.65, lat: 38.92, rank: 6, teuM: 5 },
  { id: 'xmn', name: '厦门港', lon: 118.04, lat: 24.45, rank: 6, teuM: 12 },
  { id: 'ytn', name: '烟台港', lon: 121.39, lat: 37.55, rank: 5, teuM: 4 },
  { id: 'lzh', name: '连云港', lon: 119.22, lat: 34.76, rank: 5, teuM: 5 },
  { id: 'zjg', name: '湛江港', lon: 110.40, lat: 21.20, rank: 4, teuM: 3 },
  { id: 'hko', name: '海口港', lon: 110.33, lat: 20.03, rank: 3, teuM: 2 },
];

const SHIPPING_PROXY = '/api/live/shipping';
const FETCH_TIMEOUT_MS = 15000;

/** @typedef {{ mmsi?: string, name: string, lon: number, lat: number, sog?: number, cog?: number }} VesselItem */

/**
 * @param {number} rank
 * @param {boolean} [isDark]
 */
export function portSymbolSize(rank, isDark = true) {
  const base = 10 + (rank || 1) * 1.8;
  return Math.min(28, base);
}

/** @param {boolean} [isDark] */
export function portColor(isDark = true) {
  return isDark ? '#38bdf8' : '#0284c7';
}

/** @param {boolean} [isDark] */
export function vesselColor(isDark = true) {
  return isDark ? '#fbbf24' : '#d97706';
}

async function fetchShipping() {
  const { signal, clear } = liveAbort(FETCH_TIMEOUT_MS);
  try {
    const json = await fetchLiveJson(SHIPPING_PROXY, null, signal);
    return {
      ports: Array.isArray(json?.ports) ? json.ports : MAJOR_PORTS,
      vessels: Array.isArray(json?.vessels) ? json.vessels : [],
      source: json?.source || 'ports',
      note: json?.note || null,
    };
  } catch {
    return { ports: MAJOR_PORTS, vessels: [], source: 'local', note: '数据暂不可用 · 仅显示港口锚点' };
  } finally {
    clear();
  }
}

let _state = { ports: MAJOR_PORTS, vessels: [], fetchedAt: null, error: null, source: 'local', note: null };
let _pending = null;

async function loadShared(force = false) {
  if (!force && _state.fetchedAt) return _state;
  if (!_pending) {
    _pending = (async () => {
      try {
        const { data: body, fetchedAt } = await cachedLiveFetch('shipping', fetchShipping, DEFAULT_REFRESH_MS);
        _state = {
          ports: body.ports,
          vessels: body.vessels,
          fetchedAt,
          error: body.vessels.length ? null : (body.note || null),
          source: body.source,
          note: body.note,
        };
      } catch (e) {
        _state = {
          ..._state,
          fetchedAt: _state.fetchedAt || new Date(),
          error: e?.name === 'AbortError' ? '请求超时' : '数据暂不可用',
          note: '仅显示港口锚点',
        };
      } finally {
        _pending = null;
      }
      return _state;
    })();
  }
  return _pending;
}

/**
 * @param {number} [refreshMs]
 * @param {boolean} [enabled=true]
 */
export function useLiveShipping(refreshMs = DEFAULT_REFRESH_MS, enabled = true) {
  const [state, setState] = useState(() => ({
    ..._state,
    loading: enabled && !_state.fetchedAt,
  }));
  const aliveRef = useRef(true);

  useEffect(() => {
    if (!enabled) {
      setState((s) => ({ ...s, loading: false }));
      return undefined;
    }
    aliveRef.current = true;
    const apply = (res) => {
      if (!aliveRef.current) return;
      setState({ ...res, loading: false });
    };
    loadShared().then(apply);
    const id = setInterval(() => loadShared(true).then(apply), Math.max(refreshMs, 120000));
    return () => {
      aliveRef.current = false;
      clearInterval(id);
    };
  }, [refreshMs, enabled]);

  return state;
}

/**
 * @param {typeof MAJOR_PORTS} ports
 * @param {boolean} [isDark]
 */
export function buildPortSeries(ports, isDark = true) {
  const list = ports?.length ? ports : MAJOR_PORTS;
  return list.map((p) => ({
    name: p.name,
    value: [p.lon, p.lat, p.rank || p.teuM || 1],
    rank: p.rank,
    teuM: p.teuM,
    itemStyle: { color: portColor(isDark) },
  }));
}

/**
 * @param {VesselItem[]} vessels
 * @param {boolean} [isDark]
 */
export function buildVesselSeries(vessels, isDark = true) {
  return (vessels || []).map((v) => ({
    name: v.name || v.mmsi || '船舶',
    value: [v.lon, v.lat],
    sog: v.sog,
    cog: v.cog,
    mmsi: v.mmsi,
    symbolRotate: v.cog != null ? -v.cog : 0,
    itemStyle: { color: vesselColor(isDark) },
  }));
}

/** @param {{ data?: object }} p */
export function formatPortTooltip(p) {
  const d = p.data || {};
  const rank = d.rank ?? d.value?.[2];
  return [
    `<b>${p.name}</b>`,
    rank != null ? `枢纽等级 ${rank}/10` : null,
    d.teuM != null ? `年集装箱约 ${d.teuM}M TEU（示意）` : null,
    '<span style="opacity:.6;font-size:10px">主要港口锚点 · 公开坐标</span>',
  ].filter(Boolean).join('<br/>');
}

/** @param {{ data?: object }} p */
export function formatVesselTooltip(p) {
  const d = p.data || {};
  return [
    `<b>${p.name || '船舶'}</b>`,
    d.mmsi ? `MMSI ${d.mmsi}` : null,
    d.sog != null ? `航速 ${d.sog} kn` : null,
    d.cog != null ? `航向 ${Math.round(d.cog)}°` : null,
    '<span style="opacity:.6;font-size:10px">AIS 可见船位（稀疏覆盖）</span>',
  ].filter(Boolean).join('<br/>');
}

/** @param {number} ports @param {number} vessels */
export function shippingStats(ports, vessels) {
  return {
    ports: ports?.length || MAJOR_PORTS.length,
    vessels: vessels?.length || 0,
  };
}

export { formatLiveTime };
