// ============================================================================
// 神州活图 · 空气质量实况（PM2.5 / AQI）
// ----------------------------------------------------------------------------
// 数据源（免 key 优先）：
//   1. Open-Meteo Air Quality API（CORS 开放）
//      https://air-quality-api.open-meteo.com/v1/air-quality
//   2. Worker /api/live/aqi 代理 + OpenAQ v2 站点兜底
//      https://api.openaq.org/v2/latest
//   3. 本地种子 /data/province-aqi-seed.json（全网失败时）
// 可选：WAQI_TOKEN wrangler secret → Worker 追加 IQAir 读数（不在前端暴露）
// 免责：公开模型/监测聚合，非生态环境部门发布口径。
// ============================================================================

import { useState, useEffect, useRef } from 'react';
import { PROVINCE_COORDS, PROVINCE_NAMES } from './liveMapData.js';
import {
  cachedLiveFetch, fetchLiveJson, liveAbort, round1, asArray, formatLiveTime, DEFAULT_REFRESH_MS,
} from './liveApi.js';

/** 实时空气质量 choropleth 层 */
export const REAL_AQI_LAYERS = [
  {
    id: 'livePm25',
    label: '空气 PM2.5',
    icon: 'Wind',
    valueName: 'PM2.5',
    unit: 'µg/m³',
    min: 0,
    max: 150,
    live: true,
    source: 'open-meteo',
    desc: 'Open-Meteo 空气质量 · 31 省会 PM2.5/US AQI · 10 分钟自动刷新',
  },
];

export const AQI_PALETTES = {
  // WHO 语义序保留绿→黄→橙→红→紫；仅与共享地图夜间底色脱钩
  dark: ['#10b981', '#a3e635', '#facc15', '#fb923c', '#ef4444', '#a855f7'],
  light: ['#34d399', '#bef264', '#fde047', '#fdba74', '#f87171', '#c084fc'],
};

const LATS = PROVINCE_NAMES.map((n) => PROVINCE_COORDS[n][1]).join(',');
const LONS = PROVINCE_NAMES.map((n) => PROVINCE_COORDS[n][0]).join(',');

const AIR_DIRECT =
  `https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${LATS}&longitude=${LONS}` +
  '&current=pm2_5,us_aqi&timezone=Asia%2FShanghai';
const AIR_PROXY = `/api/live/aqi?latitude=${LATS}&longitude=${LONS}&current=pm2_5,us_aqi&timezone=Asia%2FShanghai`;

const SEED_URL = '/data/province-aqi-seed.json';

/**
 * PM2.5 µg/m³ → 中国 AQI 近似色（绿黄橙红紫）
 * @param {number|null} pm25
 * @param {boolean} [isDark]
 */
export function aqiColor(pm25, isDark = true) {
  const v = Number(pm25);
  if (!Number.isFinite(v)) return isDark ? '#64748b' : '#94a3b8';
  if (v <= 35) return '#10b981';
  if (v <= 75) return '#a3e635';
  if (v <= 115) return '#facc15';
  if (v <= 150) return '#fb923c';
  if (v <= 250) return '#ef4444';
  return '#a855f7';
}

/** @param {number|null} pm25 */
export function aqiLabel(pm25) {
  const v = Number(pm25);
  if (!Number.isFinite(v)) return '—';
  if (v <= 35) return '优';
  if (v <= 75) return '良';
  if (v <= 115) return '轻度污染';
  if (v <= 150) return '中度污染';
  if (v <= 250) return '重度污染';
  return '严重污染';
}

async function loadSeed() {
  try {
    const res = await fetch(SEED_URL);
    if (!res.ok) return null;
    const j = await res.json();
    return j?.provinces || null;
  } catch {
    return null;
  }
}

/** @returns {Promise<{ data: Record<string, object>, source: string }>} */
async function fetchAirQuality() {
  const { signal, clear } = liveAbort();
  try {
    const json = await fetchLiveJson(AIR_PROXY, AIR_DIRECT, signal);
    const arr = asArray(json);
    const data = {};
    PROVINCE_NAMES.forEach((name, i) => {
      const cur = arr[i]?.current;
      if (!cur) return;
      data[name] = {
        pm25: round1(cur.pm2_5),
        aqi: round1(cur.us_aqi),
        source: json?.meta?.source || 'open-meteo',
      };
    });
    if (!Object.keys(data).length) throw new Error('empty');
    return { data, source: json?.meta?.source || 'open-meteo' };
  } finally {
    clear();
  }
}

let _state = { data: null, fetchedAt: null, error: null, source: null };
let _pending = null;

async function loadShared(force = false) {
  if (!force && _state.data) return _state;
  if (!_pending) {
    _pending = (async () => {
      try {
        const { data: body } = await cachedLiveFetch('aqi-bundle', fetchAirQuality);
        _state = { data: body.data, fetchedAt: new Date(), error: null, source: body.source };
      } catch (e) {
        const seed = await loadSeed();
        if (seed) {
          _state = {
            data: seed,
            fetchedAt: new Date(),
            error: '实况源不可达 · 已回退种子数据',
            source: 'seed',
          };
        } else {
          _state = {
            ..._state,
            error: e?.name === 'AbortError' ? '请求超时' : '数据暂不可用',
          };
        }
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
export function useLiveAirQuality(refreshMs = DEFAULT_REFRESH_MS, enabled = true) {
  const [state, setState] = useState(() => ({
    ..._state,
    loading: enabled && !_state.data,
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
    const id = setInterval(() => loadShared(true).then(apply), Math.max(refreshMs, 60000));
    return () => {
      aliveRef.current = false;
      clearInterval(id);
    };
  }, [refreshMs, enabled]);

  return state;
}

/**
 * @param {Record<string, object>|null} data
 */
export function buildAqiSeries(data) {
  if (!data) return [];
  return PROVINCE_NAMES.map((name) => {
    const d = data[name];
    const value = d?.pm25 ?? null;
    return { name, value: value == null ? null : value, metrics: d ? { ...d, value } : {} };
  });
}

/**
 * @param {string} name
 * @param {object|null} d
 * @param {Date|null} fetchedAt
 */
export function formatAqiTooltip(name, d, fetchedAt) {
  if (!d) return name;
  const pm = d.pm25;
  const label = aqiLabel(pm);
  const color = aqiColor(pm);
  const hhmm = formatLiveTime(fetchedAt);
  return [
    `<b>${name}</b>`,
    `<span style="color:${color}">PM2.5 ${pm ?? '—'} µg/m³ · ${label}</span>`,
    d.aqi != null ? `US AQI ${d.aqi}` : null,
    `<span style="opacity:.6;font-size:11px">更新 ${hhmm} · ${d.source || 'Open-Meteo'}</span>`,
  ].filter(Boolean).join('<br/>');
}
