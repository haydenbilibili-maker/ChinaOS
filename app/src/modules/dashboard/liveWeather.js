// ============================================================================
// 神州活图 · 实时气象层（浏览器 / Worker 代理 Open-Meteo）
// ----------------------------------------------------------------------------
// 数据源（免费 · 无 key · 支持 CORS）：
//   https://api.open-meteo.com/v1/forecast
//   Worker 代理：GET /api/live/weather（10 分钟内存缓存）
// 31 省会站点批量拉取（latitude/longitude 逗号分隔）。
// 空气质量见 liveAirQuality.js（Open-Meteo Air Quality + OpenAQ 兜底）。
// 免责：公开气象模型 API，非官方气象部门发布口径。
// ============================================================================

import { useState, useEffect, useRef } from 'react';
import { PROVINCE_COORDS, PROVINCE_NAMES } from './liveMapData.js';
import { MAP_CHOROPLETH } from '../shared/chartHelpers.js';
import {
  cachedLiveFetch, fetchLiveJson, liveAbort, round1, asArray, formatLiveTime, DEFAULT_REFRESH_MS,
} from './liveApi.js';
import { WEATHER_CODE_LABEL } from './liveWeatherCodes.js';

/** 实时气象 choropleth 层（PM2.5 见 liveAirQuality.js） */
export const REAL_LAYERS = [
  {
    id: 'liveTemp',
    label: '实况气温',
    icon: 'Thermometer',
    valueName: '气温',
    unit: '°C',
    min: -20,
    max: 40,
    live: true,
    source: 'open-meteo',
    desc: 'Open-Meteo 实时 2m 气温 · 31 省会站点 · 10 分钟自动刷新',
  },
  {
    id: 'livePrecip',
    label: '实况降水',
    icon: 'CloudRain',
    valueName: '降水',
    unit: 'mm',
    min: 0,
    max: 20,
    live: true,
    source: 'open-meteo',
    desc: 'Open-Meteo 当前小时降水量 · 省会站点 · 10 分钟自动刷新',
  },
];

export const REAL_PALETTES = {
  livePrecip: [MAP_CHOROPLETH.dark[0], '#1e3a8a', '#1d4ed8', '#0891b2', '#22d3ee', '#a5f3fc'],
  liveTemp: [MAP_CHOROPLETH.dark[0], '#1d4ed8', '#0891b2', '#10b981', '#facc15', '#f97316', '#dc2626'],
};

export const REAL_PALETTES_LIGHT = {
  livePrecip: [MAP_CHOROPLETH.light[0], '#bfdbfe', '#60a5fa', '#2563eb', '#0891b2', '#155e75'],
  liveTemp: [MAP_CHOROPLETH.light[0], '#3b82f6', '#06b6d4', '#34d399', '#fde047', '#fb923c', '#ef4444'],
};

export { WEATHER_CODE_LABEL };

const LATS = PROVINCE_NAMES.map((n) => PROVINCE_COORDS[n][1]).join(',');
const LONS = PROVINCE_NAMES.map((n) => PROVINCE_COORDS[n][0]).join(',');

const WX_PARAMS =
  '&current=temperature_2m,relative_humidity_2m,precipitation,weather_code,wind_speed_10m' +
  '&timezone=Asia%2FShanghai';
const WEATHER_DIRECT =
  `https://api.open-meteo.com/v1/forecast?latitude=${LATS}&longitude=${LONS}${WX_PARAMS}`;
const WEATHER_PROXY = `/api/live/weather?latitude=${LATS}&longitude=${LONS}${WX_PARAMS}`;

async function fetchWeather() {
  const { signal, clear } = liveAbort();
  try {
    const json = await fetchLiveJson(WEATHER_PROXY, WEATHER_DIRECT, signal);
    const wxArr = asArray(json);
    const data = {};
    PROVINCE_NAMES.forEach((name, i) => {
      const w = wxArr[i]?.current;
      if (!w) return;
      const code = w.weather_code;
      data[name] = {
        temp: round1(w.temperature_2m),
        humidity: round1(w.relative_humidity_2m),
        precip: round1(w.precipitation),
        wind: round1(w.wind_speed_10m),
        code,
        codeLabel: WEATHER_CODE_LABEL[code] || { t: '未知', e: '🌐' },
      };
    });
    if (!Object.keys(data).length) throw new Error('empty');
    return { data };
  } finally {
    clear();
  }
}

let _state = { data: null, fetchedAt: null, error: null };
let _pending = null;

async function loadShared(force = false) {
  if (!force && _state.data) return _state;
  if (!_pending) {
    _pending = (async () => {
      try {
        const { data: body, fetchedAt } = await cachedLiveFetch('weather', fetchWeather);
        _state = { data: body.data, fetchedAt, error: null };
      } catch (e) {
        _state = {
          ..._state,
          error: e?.name === 'AbortError' ? '请求超时（10 秒）' : '数据暂不可用',
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
export function useLiveWeather(refreshMs = DEFAULT_REFRESH_MS, enabled = true) {
  const [state, setState] = useState(() => ({
    data: _state.data,
    fetchedAt: _state.fetchedAt,
    loading: enabled && !_state.data,
    error: null,
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
      setState({ data: res.data, fetchedAt: res.fetchedAt, loading: false, error: res.error });
    };
    loadShared().then(apply);
    const timer = setInterval(() => loadShared(true).then(apply), Math.max(refreshMs, 60000));
    return () => {
      aliveRef.current = false;
      clearInterval(timer);
    };
  }, [refreshMs, enabled]);

  return state;
}

/**
 * @param {'liveTemp'|'livePrecip'} layerId
 * @param {object|null} data
 */
export function buildRealSeries(layerId, data) {
  if (!data) return [];
  return PROVINCE_NAMES.map((name) => {
    const d = data[name];
    const value = d
      ? (layerId === 'livePrecip' ? d.precip : d.temp)
      : null;
    return { name, value: value == null ? null : value, metrics: d ? { ...d } : {} };
  });
}

const pad2 = (n) => String(n).padStart(2, '0');

/**
 * @param {string} name
 * @param {string} layerId
 * @param {object|null} d
 * @param {Date|null} fetchedAt
 * @param {object|null} [aqiData] 可选：来自 useLiveAirQuality 的该省读数
 */
export function formatRealTooltip(name, layerId, d, fetchedAt, aqiData = null) {
  if (!d) return name;
  const cl = d.codeLabel || { t: '—', e: '' };
  const hhmm = fetchedAt instanceof Date ? `${pad2(fetchedAt.getHours())}:${pad2(fetchedAt.getMinutes())}` : '--:--';
  const fmt = (v, unit) => (v == null ? '—' : `${v}${unit}`);
  const aq = aqiData || {};
  const pmLine = aq.pm25 == null
    ? null
    : `PM2.5 ${aq.pm25} µg/m³${aq.aqi != null ? ` (AQI ${aq.aqi})` : ''}`;
  return [
    `<b>${name}</b>　${cl.e} ${cl.t}`,
    `气温 ${fmt(d.temp, '°C')}　湿度 ${fmt(d.humidity, '%')}`,
    `风速 ${fmt(d.wind, ' km/h')}　降水 ${fmt(d.precip, ' mm')}`,
    pmLine,
    `<span style="opacity:.6;font-size:11px">数据时间 ${hhmm} · Open-Meteo</span>`,
  ].filter(Boolean).join('<br/>');
}

export { formatLiveTime };
