// ============================================================================
// 中枢看板 · USGS 地震实况数据源
// ----------------------------------------------------------------------------
// 数据为 USGS（美国地质调查局）公开地震目录（FDSN Event API），免费无 key、
// CORS 开放；范围限定中国及周边 bbox（15–55N / 70–140E），近 30 天 M4.0+，
// 按震级降序取前 60 条。仅作态势参考，不构成防灾依据。
// 端点：https://earthquake.usgs.gov/fdsnws/event/1/query
// ============================================================================
import { useState, useEffect, useRef } from 'react';

/** @typedef {{ mag: number, place: string, time: Date, lon: number, lat: number, depth: number }} QuakeItem */

const USGS_BASE = 'https://earthquake.usgs.gov/fdsnws/event/1/query';
const FETCH_TIMEOUT_MS = 12000;
const WINDOW_DAYS = 30;
const MIN_MAG = 4.0;
const LIMIT = 60;
/** 中国及周边经纬度包络框 */
const BBOX = { minLat: 15, maxLat: 55, minLon: 70, maxLon: 140 };

let cache = /** @type {{ quakes: QuakeItem[], fetchedAt: number } | null} */ (null);

/** 30 天前的 YYYY-MM-DD（UTC），作为查询起始日 */
function windowStartDate() {
  const d = new Date(Date.now() - WINDOW_DAYS * 24 * 60 * 60 * 1000);
  return d.toISOString().slice(0, 10);
}

/** 拼装 USGS FDSN 查询 URL */
function buildQuakeUrl() {
  const params = new URLSearchParams({
    format: 'geojson',
    starttime: windowStartDate(),
    minmagnitude: String(MIN_MAG),
    minlatitude: String(BBOX.minLat),
    maxlatitude: String(BBOX.maxLat),
    minlongitude: String(BBOX.minLon),
    maxlongitude: String(BBOX.maxLon),
    orderby: 'magnitude',
    limit: String(LIMIT),
  });
  return `${USGS_BASE}?${params.toString()}`;
}

/** GeoJSON features → 内部条目；坏数据逐条丢弃不抛 */
function parseFeatures(json) {
  if (!json || !Array.isArray(json.features)) return [];
  const out = [];
  for (const f of json.features) {
    const props = f?.properties;
    const coords = f?.geometry?.coordinates;
    if (!props || !Array.isArray(coords) || coords.length < 2) continue;
    const mag = Number(props.mag);
    const lon = Number(coords[0]);
    const lat = Number(coords[1]);
    if (!Number.isFinite(mag) || !Number.isFinite(lon) || !Number.isFinite(lat)) continue;
    out.push({
      mag,
      place: typeof props.place === 'string' && props.place ? props.place : '未知位置',
      time: new Date(props.time || 0),
      lon,
      lat,
      depth: Number.isFinite(Number(coords[2])) ? Number(coords[2]) : 0,
    });
  }
  return out;
}

/** 拉取近 30 天地震目录；失败抛错由调用方兜底 */
async function fetchQuakes() {
  const ac = new AbortController();
  const timer = setTimeout(() => ac.abort(), FETCH_TIMEOUT_MS);
  try {
    const res = await fetch(buildQuakeUrl(), { signal: ac.signal });
    if (!res.ok) throw new Error(`USGS HTTP ${res.status}`);
    const json = await res.json();
    return parseFeatures(json);
  } finally {
    clearTimeout(timer);
  }
}

/**
 * React hook：USGS 地震实况（中国及周边 · 近 30 天 M4.0+）。
 * 模块级缓存 + 定时刷新；任何失败都不抛，仅置 error。
 * @param {number} [refreshMs=900000] 刷新间隔（默认 15 分钟）
 * @returns {{ quakes: QuakeItem[] | null, fetchedAt: Date | null, loading: boolean, error: string | null }}
 */
export function useLiveQuakes(refreshMs = 900000) {
  const [state, setState] = useState(() => (cache
    ? { quakes: cache.quakes, fetchedAt: new Date(cache.fetchedAt), loading: false, error: null }
    : { quakes: null, fetchedAt: null, loading: true, error: null }));
  const aliveRef = useRef(true);

  useEffect(() => {
    aliveRef.current = true;

    const load = async (force = false) => {
      // 命中缓存（未过刷新周期）则直接使用，避免重复请求
      if (!force && cache && Date.now() - cache.fetchedAt < refreshMs) {
        if (aliveRef.current) {
          setState({ quakes: cache.quakes, fetchedAt: new Date(cache.fetchedAt), loading: false, error: null });
        }
        return;
      }
      if (aliveRef.current) setState((s) => ({ ...s, loading: true }));
      try {
        const quakes = await fetchQuakes();
        cache = { quakes, fetchedAt: Date.now() };
        if (aliveRef.current) {
          setState({ quakes, fetchedAt: new Date(cache.fetchedAt), loading: false, error: null });
        }
      } catch (e) {
        if (!aliveRef.current) return;
        // 失败兜底：有旧缓存则继续展示旧数据，否则返回空态
        if (cache) {
          setState({
            quakes: cache.quakes,
            fetchedAt: new Date(cache.fetchedAt),
            loading: false,
            error: e?.name === 'AbortError' ? 'USGS 请求超时（沿用缓存）' : 'USGS 拉取失败（沿用缓存）',
          });
        } else {
          setState({
            quakes: null,
            fetchedAt: null,
            loading: false,
            error: e?.name === 'AbortError' ? 'USGS 请求超时' : 'USGS 拉取失败',
          });
        }
      }
    };

    load(false);
    const timer = setInterval(() => load(true), Math.max(refreshMs, 60000));
    return () => {
      aliveRef.current = false;
      clearInterval(timer);
    };
  }, [refreshMs]);

  return state;
}

/**
 * 转 ECharts effectScatter 数据。
 * @param {QuakeItem[] | null} quakes
 * @returns {{ name: string, value: [number, number, number], mag: number, time: Date }[]}
 */
export function buildQuakeSeries(quakes) {
  if (!Array.isArray(quakes)) return [];
  return quakes.map((q) => ({
    name: q.place,
    value: [q.lon, q.lat, q.mag],
    mag: q.mag,
    time: q.time,
  }));
}

/**
 * 震级 → 散点像素：M4≈6px，每 +1 级 ×1.8，封顶 30。
 * 兼容 ECharts symbolSize 回调（val 可为 value 数组，震级在 [2]）。
 * @param {number | number[]} val
 */
export function quakeSymbolSize(val) {
  const mag = Array.isArray(val) ? Number(val[2]) : Number(val);
  if (!Number.isFinite(mag)) return 6;
  return Math.min(30, 6 * Math.pow(1.8, Math.max(0, mag - 4)));
}

/**
 * 震级配色：<5 黄 / 5–6 橙 / ≥6 红。
 * @param {number} mag
 */
export function quakeColor(mag) {
  const m = Number(mag);
  if (!Number.isFinite(m) || m < 5) return '#facc15';
  if (m < 6) return '#fb923c';
  return '#ef4444';
}

/** UTC 时刻 → 北京时间（UTC+8）「MM-DD HH:MM」 */
function formatBeijingTime(time) {
  const t = time instanceof Date ? time : new Date(time || 0);
  if (Number.isNaN(t.getTime())) return '--';
  const bj = new Date(t.getTime() + 8 * 60 * 60 * 1000);
  const pad = (n) => String(n).padStart(2, '0');
  return `${pad(bj.getUTCMonth() + 1)}-${pad(bj.getUTCDate())} ${pad(bj.getUTCHours())}:${pad(bj.getUTCMinutes())}`;
}

/**
 * ECharts tooltip 格式化（formatter: formatQuakeTooltip）。
 * @param {{ data?: { name?: string, mag?: number, time?: Date, value?: number[] }, name?: string }} p
 * @returns {string} HTML
 */
export function formatQuakeTooltip(p) {
  const d = p?.data || p || {};
  const mag = Number.isFinite(Number(d.mag)) ? Number(d.mag) : Number(d.value?.[2]);
  const magText = Number.isFinite(mag) ? mag.toFixed(1) : '--';
  const place = d.name || p?.name || '未知位置';
  const depth = Number.isFinite(Number(d.value?.[3])) ? Number(d.value[3]) : null;
  // 系列数据 value 仅 [lon,lat,mag]；深度走 d.depth（若调用方附带）
  const depthVal = Number.isFinite(Number(d.depth)) ? Number(d.depth) : depth;
  const depthText = depthVal == null ? '--' : `${depthVal.toFixed(0)} km`;
  return [
    `<div style="font-weight:700;color:${quakeColor(mag)}">M${magText}</div>`,
    `<div style="margin-top:2px">${place}</div>`,
    `<div style="color:#94a3b8">深度 ${depthText}</div>`,
    `<div style="color:#94a3b8">北京时间 ${formatBeijingTime(d.time)}</div>`,
    '<div style="margin-top:4px;font-size:10px;color:#64748b">USGS · 30 天窗口</div>',
  ].join('');
}
