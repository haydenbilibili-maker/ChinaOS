// ============================================================================
// 神州活图 · 卫星云图（RainViewer 清单 + NASA GIBS 回退）
// ----------------------------------------------------------------------------
// 数据源（免 key）：
//   1. RainViewer GET /api/live/satellite → weather-maps.json
//      卫星红外已于 2026-01 下线；有帧时优先 RainViewer 瓦片
//   2. NASA GIBS MODIS 真彩色云图（CORS 开放，全球含东亚）
//      https://gibs.earthdata.nasa.gov/wmts/epsg3857/best/...
// 瓦片与 ECharts geo 通过 convertToPixel / georoam 同步（见 SatelliteCloudOverlay）。
// ============================================================================

import { useState, useEffect, useRef } from 'react';
import {
  cachedLiveFetch, fetchLiveJson, liveAbort, formatLiveTime, DEFAULT_REFRESH_MS,
} from './liveApi.js';

export const SATELLITE_OPACITY_KEY = 'shenzhou-live-satellite-opacity';
export const DEFAULT_SATELLITE_OPACITY = 0.55;
export const MIN_SATELLITE_OPACITY = 0.3;
export const MAX_SATELLITE_OPACITY = 0.8;

const SATELLITE_PROXY = '/api/live/satellite';
const RAINVIEWER_DIRECT = 'https://api.rainviewer.com/public/weather-maps.json';

/** @returns {number} */
export function loadSatelliteOpacity() {
  if (typeof localStorage === 'undefined') return DEFAULT_SATELLITE_OPACITY;
  try {
    const v = parseFloat(localStorage.getItem(SATELLITE_OPACITY_KEY));
    if (Number.isFinite(v)) return Math.min(MAX_SATELLITE_OPACITY, Math.max(MIN_SATELLITE_OPACITY, v));
  } catch { /* ignore */ }
  return DEFAULT_SATELLITE_OPACITY;
}

/** @param {number} v */
export function saveSatelliteOpacity(v) {
  if (typeof localStorage === 'undefined') return;
  try {
    localStorage.setItem(SATELLITE_OPACITY_KEY, String(v));
  } catch { /* quota */ }
}

/**
 * @param {object} cfg Worker 返回的瓦片配置
 * @param {number} z
 * @param {number} x
 * @param {number} y
 */
export function buildTileUrl(cfg, z, x, y) {
  if (!cfg) return null;
  if (cfg.source === 'gibs') {
    const host = cfg.host || 'https://gibs.earthdata.nasa.gov';
    const layer = cfg.layer || 'MODIS_Terra_CorrectedReflectance_TrueColor';
    const time = cfg.time || 'default';
    const tms = cfg.tileMatrixSet || 'GoogleMapsCompatible_Level9';
    const ext = cfg.ext || 'jpg';
    return `${host}/wmts/epsg3857/best/${layer}/default/${time}/${tms}/${z}/${y}/${x}.${ext}`;
  }
  if (cfg.source === 'rainviewer-satellite' || cfg.source === 'rainviewer-radar') {
    const host = cfg.host || 'https://tilecache.rainviewer.com';
    const size = cfg.tileSize || 512;
    const color = cfg.color ?? (cfg.source === 'rainviewer-radar' ? 2 : 0);
    const opts = cfg.options || '1_1';
    return `${host}${cfg.path}/${size}/${z}/${x}/${y}/${color}/${opts}.png`;
  }
  return null;
}

/** @param {number} y @param {number} z */
export function tileYToLat(y, z) {
  const n = 2 ** z;
  const mercN = Math.PI - (2 * Math.PI * y) / n;
  return (180 / Math.PI) * Math.atan(0.5 * (Math.exp(mercN) - Math.exp(-mercN)));
}

/** @param {number} lon @param {number} lat @param {number} z */
export function lonLatToTile(lon, lat, z) {
  const n = 2 ** z;
  const x = Math.floor(((lon + 180) / 360) * n);
  const latRad = (lat * Math.PI) / 180;
  const y = Math.floor(
    ((1 - Math.log(Math.tan(latRad) + 1 / Math.cos(latRad)) / Math.PI) / 2) * n,
  );
  return { x, y };
}

/** @param {number} x @param {number} y @param {number} z */
export function tileBounds(x, y, z) {
  const n = 2 ** z;
  const west = (x / n) * 360 - 180;
  const east = ((x + 1) / n) * 360 - 180;
  const north = tileYToLat(y, z);
  const south = tileYToLat(y + 1, z);
  return { west, east, north, south };
}

/**
 * geo 坐标变换就绪：地图已 setOption、容器非 0、实例未销毁。
 * 在窄屏布局抖动 / setOption 前调用 convertToPixel 会踩 queryComponents。
 * @param {import('echarts').ECharts | null | undefined} chart
 */
export function isChartReadyForGeo(chart) {
  if (!chart) return false;
  if (typeof chart.isDisposed === 'function' && chart.isDisposed()) return false;
  const w = chart.getWidth?.() ?? 0;
  const h = chart.getHeight?.() ?? 0;
  if (!(w > 0 && h > 0)) return false;
  try {
    const probe = chart.convertToPixel({ geoIndex: 0 }, [105, 35]);
    return Array.isArray(probe) && Number.isFinite(probe[0]) && Number.isFinite(probe[1]);
  } catch {
    return false;
  }
}

/**
 * 安全 convertToPixel；未就绪或 ECharts 内部失败时返回 null。
 * @param {import('echarts').ECharts} chart
 * @param {[number, number]} lonLat
 * @returns {[number, number] | null}
 */
export function safeConvertToPixel(chart, lonLat) {
  if (!chart) return null;
  if (typeof chart.isDisposed === 'function' && chart.isDisposed()) return null;
  const w = chart.getWidth?.() ?? 0;
  const h = chart.getHeight?.() ?? 0;
  if (!(w > 0 && h > 0)) return null;
  try {
    const p = chart.convertToPixel({ geoIndex: 0 }, lonLat);
    if (!Array.isArray(p) || !Number.isFinite(p[0]) || !Number.isFinite(p[1])) return null;
    return /** @type {[number, number]} */ (p);
  } catch {
    return null;
  }
}

/**
 * 安全 convertFromPixel
 * @param {import('echarts').ECharts} chart
 * @param {[number, number]} pixel
 * @returns {[number, number] | null}
 */
export function safeConvertFromPixel(chart, pixel) {
  if (!chart) return null;
  if (typeof chart.isDisposed === 'function' && chart.isDisposed()) return null;
  const w = chart.getWidth?.() ?? 0;
  const h = chart.getHeight?.() ?? 0;
  if (!(w > 0 && h > 0)) return null;
  try {
    const p = chart.convertFromPixel({ geoIndex: 0 }, pixel);
    if (!Array.isArray(p) || !Number.isFinite(p[0]) || !Number.isFinite(p[1])) return null;
    return /** @type {[number, number]} */ (p);
  } catch {
    return null;
  }
}

/**
 * 由 ECharts geo 像素尺度估算 WebMercator 层级
 * @param {import('echarts').ECharts} chart
 */
export function estimateTileZoom(chart) {
  const p1 = safeConvertToPixel(chart, [100, 30]);
  const p2 = safeConvertToPixel(chart, [120, 30]);
  if (!p1 || !p2) return 3;
  const pixelsPerDegLon = Math.abs(p2[0] - p1[0]) / 20;
  if (!pixelsPerDegLon) return 3;
  const worldPx = pixelsPerDegLon * 360;
  const z = Math.round(Math.log2(worldPx / 256));
  return Math.max(1, Math.min(9, z));
}

/**
 * @param {import('echarts').ECharts} chart
 * @param {number} z
 */
export function getVisibleTileRange(chart, z) {
  const w = chart.getWidth?.() ?? 0;
  const h = chart.getHeight?.() ?? 0;
  if (!(w > 0 && h > 0) || !isChartReadyForGeo(chart)) {
    const tl = lonLatToTile(70, 55, z);
    const br = lonLatToTile(140, 15, z);
    return {
      xMin: Math.min(tl.x, br.x),
      xMax: Math.max(tl.x, br.x),
      yMin: Math.min(tl.y, br.y),
      yMax: Math.max(tl.y, br.y),
      z,
    };
  }
  const pts = [
    safeConvertFromPixel(chart, [0, 0]),
    safeConvertFromPixel(chart, [w, 0]),
    safeConvertFromPixel(chart, [0, h]),
    safeConvertFromPixel(chart, [w, h]),
  ].filter((p) => Array.isArray(p) && Number.isFinite(p[0]) && Number.isFinite(p[1]));

  if (!pts.length) {
    const tl = lonLatToTile(70, 55, z);
    const br = lonLatToTile(140, 15, z);
    return {
      xMin: Math.min(tl.x, br.x),
      xMax: Math.max(tl.x, br.x),
      yMin: Math.min(tl.y, br.y),
      yMax: Math.max(tl.y, br.y),
      z,
    };
  }

  const lons = pts.map((p) => p[0]);
  const lats = pts.map((p) => p[1]);
  const west = Math.min(...lons);
  const east = Math.max(...lons);
  const south = Math.min(...lats);
  const north = Math.max(...lats);
  const tl = lonLatToTile(west, north, z);
  const br = lonLatToTile(east, south, z);
  const maxIdx = 2 ** z - 1;
  return {
    xMin: Math.max(0, Math.min(tl.x, br.x)),
    xMax: Math.min(maxIdx, Math.max(tl.x, br.x)),
    yMin: Math.max(0, Math.min(tl.y, br.y)),
    yMax: Math.min(maxIdx, Math.max(tl.y, br.y)),
    z,
  };
}

async function fetchSatelliteManifest() {
  const { signal, clear } = liveAbort();
  try {
    const json = await fetchLiveJson(SATELLITE_PROXY, RAINVIEWER_DIRECT, signal);
    if (!json?.source) throw new Error('invalid manifest');
    return {
      config: json,
      legend: json.legend || '卫星云图',
      timestamp: json.timestamp || null,
      note: json.note || null,
    };
  } finally {
    clear();
  }
}

let _state = { config: null, fetchedAt: null, error: null, legend: null, timestamp: null, note: null };
let _pending = null;

async function loadShared(force = false) {
  if (!force && _state.config) return _state;
  if (!_pending) {
    _pending = (async () => {
      try {
        const { data: body, fetchedAt } = await cachedLiveFetch('satellite', fetchSatelliteManifest, DEFAULT_REFRESH_MS);
        _state = {
          config: body.config,
          legend: body.legend,
          timestamp: body.timestamp,
          note: body.note,
          fetchedAt,
          error: null,
        };
      } catch (e) {
        _state = {
          ..._state,
          error: e?.name === 'AbortError' ? '请求超时' : '云图暂不可用',
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
export function useLiveSatellite(refreshMs = DEFAULT_REFRESH_MS, enabled = true) {
  const [state, setState] = useState(() => ({
    config: _state.config,
    fetchedAt: _state.fetchedAt,
    legend: _state.legend,
    timestamp: _state.timestamp,
    note: _state.note,
    loading: enabled && !_state.config,
    error: _state.error,
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
      setState({
        config: res.config,
        fetchedAt: res.fetchedAt,
        legend: res.legend,
        timestamp: res.timestamp,
        note: res.note,
        loading: false,
        error: res.error,
      });
    };
    loadShared().then(apply);
    const id = setInterval(() => loadShared(true).then(apply), Math.max(refreshMs, 300000));
    return () => {
      aliveRef.current = false;
      clearInterval(id);
    };
  }, [refreshMs, enabled]);

  return state;
}

/** @param {number|null} unixSec */
export function formatSatelliteTime(unixSec) {
  if (!unixSec) return null;
  const d = new Date(unixSec * 1000);
  if (Number.isNaN(d.getTime())) return null;
  return d.toLocaleString('zh-CN', {
    month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit',
  });
}

export { formatLiveTime };
