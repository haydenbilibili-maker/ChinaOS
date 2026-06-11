// ============================================================================
// 神州活图 · 实时气象 + 空气质量层（浏览器直连 Open-Meteo）
// ----------------------------------------------------------------------------
// 数据源（免费 · 无 key · 支持 CORS）：
//   1. 天气    https://api.open-meteo.com/v1/forecast        （2m 气温/湿度/降水/天气码/风速）
//   2. 空气质量 https://air-quality-api.open-meteo.com/v1/air-quality （PM2.5 / US AQI）
// 31 省会站点批量拉取（latitude/longitude 逗号分隔，返回为数组；单点为对象需归一化）。
// 免责：公开气象模型 API 读数，非官方气象/生态环境部门发布口径，仅供态势参考。
// ============================================================================

import { useState, useEffect } from 'react';
import { PROVINCE_COORDS, PROVINCE_NAMES } from './liveMapData.js';

/** 实时数据层定义（与 PROVINCE_LAYERS 同构，live:true 标记走实时通道） */
export const REAL_LAYERS = [
  { id: 'liveTemp', label: '实况气温', icon: 'Thermometer', valueName: '气温', unit: '°C', min: -20, max: 40, live: true, source: 'open-meteo', desc: 'Open-Meteo 实时 2m 气温 · 31 省会站点 · 10 分钟自动刷新' },
  { id: 'livePm25', label: '空气 PM2.5', icon: 'Wind', valueName: 'PM2.5', unit: 'µg/m³', min: 0, max: 150, live: true, source: 'open-meteo', desc: 'Open-Meteo 空气质量 · 省会 PM2.5 实测 · 10 分钟自动刷新' },
  { id: 'livePrecip', label: '实况降水', icon: 'CloudRain', valueName: '降水', unit: 'mm', min: 0, max: 20, live: true, source: 'open-meteo', desc: 'Open-Meteo 当前小时降水量 · 省会站点 · 雨带实时可见 · 10 分钟自动刷新' }
];

/** 暗色主题色带：气温（冷→热）/ PM2.5（优→严重污染） */
export const REAL_PALETTES = {
  livePrecip: ['#16203a', '#1e3a8a', '#1d4ed8', '#0891b2', '#22d3ee', '#a5f3fc'],
  liveTemp: ['#312e81', '#1d4ed8', '#0891b2', '#10b981', '#facc15', '#f97316', '#dc2626'],
  livePm25: ['#10b981', '#a3e635', '#facc15', '#fb923c', '#ef4444', '#a855f7'],
};

/** 浅色主题变体（略提亮） */
export const REAL_PALETTES_LIGHT = {
  livePrecip: ['#eef1f6', '#bfdbfe', '#60a5fa', '#2563eb', '#0891b2', '#155e75'],
  liveTemp: ['#4f46e5', '#3b82f6', '#06b6d4', '#34d399', '#fde047', '#fb923c', '#ef4444'],
  livePm25: ['#34d399', '#bef264', '#fde047', '#fdba74', '#f87171', '#c084fc'],
};

/** WMO 天气码 → 中文 + emoji */
export const WEATHER_CODE_LABEL = {
  0: { t: '晴', e: '☀️' },
  1: { t: '大致晴', e: '🌤️' },
  2: { t: '多云', e: '⛅' },
  3: { t: '阴', e: '☁️' },
  45: { t: '雾', e: '🌫️' },
  48: { t: '冻雾', e: '🌫️' },
  51: { t: '轻毛毛雨', e: '🌦️' },
  53: { t: '毛毛雨', e: '🌦️' },
  55: { t: '浓毛毛雨', e: '🌧️' },
  61: { t: '小雨', e: '🌧️' },
  63: { t: '中雨', e: '🌧️' },
  65: { t: '大雨', e: '🌧️' },
  71: { t: '小雪', e: '🌨️' },
  73: { t: '中雪', e: '🌨️' },
  75: { t: '大雪', e: '❄️' },
  77: { t: '霰', e: '🌨️' },
  80: { t: '小阵雨', e: '🌦️' },
  81: { t: '阵雨', e: '🌧️' },
  82: { t: '强阵雨', e: '⛈️' },
  85: { t: '小阵雪', e: '🌨️' },
  86: { t: '大阵雪', e: '❄️' },
  95: { t: '雷暴', e: '⛈️' },
  96: { t: '雷暴伴小冰雹', e: '⛈️' },
  99: { t: '雷暴伴大冰雹', e: '⛈️' },
};

// ---------------------------------------------------------------------------
// 取数管线
// ---------------------------------------------------------------------------

/** 批量经纬度参数（PROVINCE_COORDS 为 [lon,lat]，Open-Meteo 需 latitude=lat&longitude=lon） */
const LATS = PROVINCE_NAMES.map((n) => PROVINCE_COORDS[n][1]).join(',');
const LONS = PROVINCE_NAMES.map((n) => PROVINCE_COORDS[n][0]).join(',');

const WEATHER_URL =
  `https://api.open-meteo.com/v1/forecast?latitude=${LATS}&longitude=${LONS}` +
  '&current=temperature_2m,relative_humidity_2m,precipitation,weather_code,wind_speed_10m' +
  '&timezone=Asia%2FShanghai';
const AIR_URL =
  `https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${LATS}&longitude=${LONS}` +
  '&current=pm2_5,us_aqi&timezone=Asia%2FShanghai';

/** toFixed(1) 后转回数字；缺测给 null */
function round1(v) {
  const n = Number(v);
  return v == null || Number.isNaN(n) ? null : Number(n.toFixed(1));
}

/** fetch + JSON + 归一化为数组（单点返回对象） */
async function fetchArr(url, signal) {
  const res = await fetch(url, { signal });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const json = await res.json();
  return Array.isArray(json) ? json : [json];
}

/** 两个 API 并行拉取并拼装为 { 省全名: 读数 }；失败返回 { error }，不抛异常 */
async function fetchLive() {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), 10000); // 10s 超时
  try {
    const [wxArr, aqArr] = await Promise.all([
      fetchArr(WEATHER_URL, ctrl.signal),
      fetchArr(AIR_URL, ctrl.signal),
    ]);
    const data = {};
    PROVINCE_NAMES.forEach((name, i) => {
      const w = wxArr[i] && wxArr[i].current;
      if (!w) return; // 该点无天气读数则跳过
      const a = (aqArr[i] && aqArr[i].current) || {};
      const code = w.weather_code;
      data[name] = {
        temp: round1(w.temperature_2m),
        humidity: round1(w.relative_humidity_2m),
        precip: round1(w.precipitation),
        wind: round1(w.wind_speed_10m),
        code,
        codeLabel: WEATHER_CODE_LABEL[code] || { t: '未知', e: '🌐' },
        pm25: round1(a.pm2_5), // 空气质量可能缺某点 → null
        aqi: round1(a.us_aqi),
      };
    });
    if (!Object.keys(data).length) throw new Error('empty');
    return { data, fetchedAt: new Date(), error: null };
  } catch (e) {
    const msg = e && e.name === 'AbortError' ? '请求超时（10 秒）' : '气象数据获取失败';
    return { data: null, fetchedAt: null, error: msg };
  } finally {
    clearTimeout(timer);
  }
}

// 模块级缓存：多个组件实例共享，避免重复请求
let _cache = { data: null, fetchedAt: null, error: null };
let _pending = null; // 进行中的请求 Promise（并发去重）

function loadShared(force = false) {
  if (!force && _cache.data) return Promise.resolve(_cache);
  if (!_pending) {
    _pending = fetchLive().then((res) => {
      _pending = null;
      if (res.data) _cache = res; // 仅成功才覆盖缓存
      return res;
    });
  }
  return _pending;
}

/**
 * 实时气象 Hook
 * @param {number} refreshMs 自动刷新间隔（默认 10 分钟）
 * @returns {{ data: object|null, fetchedAt: Date|null, loading: boolean, error: string|null }}
 */
export function useLiveWeather(refreshMs = 600000) {
  const [state, setState] = useState(() => ({
    data: _cache.data,
    fetchedAt: _cache.fetchedAt,
    loading: !_cache.data,
    error: null,
  }));

  useEffect(() => {
    let alive = true;
    const apply = (res) => {
      if (!alive) return;
      setState({ data: res.data, fetchedAt: res.fetchedAt, loading: false, error: res.error });
    };
    loadShared().then(apply); // 首次挂载即取数（命中缓存则直接回填）
    const timer = setInterval(() => loadShared(true).then(apply), refreshMs);
    return () => {
      alive = false;
      clearInterval(timer);
    };
  }, [refreshMs]);

  return state;
}

/**
 * 组装 ECharts map series 数据
 * @param {'liveTemp'|'livePm25'} layerId
 * @param {object|null} data useLiveWeather 返回的 data
 * @returns {{ name: string, value: number|null, metrics: object }[]}
 */
export function buildRealSeries(layerId, data) {
  if (!data) return [];
  return PROVINCE_NAMES.map((name) => {
    const d = data[name];
    const value = d ? (layerId === 'livePm25' ? d.pm25 : layerId === 'livePrecip' ? d.precip : d.temp) : null;
    return { name, value: value == null ? null : value, metrics: d ? { ...d } : {} };
  });
}

const pad2 = (n) => String(n).padStart(2, '0');

/**
 * 实时层 tooltip 富文本（HTML）
 * @param {string} name 省全名
 * @param {string} layerId 当前层 id（保留参数，便于按层高亮）
 * @param {object|null} d 该省读数对象
 * @param {Date|null} fetchedAt 数据时间
 */
export function formatRealTooltip(name, layerId, d, fetchedAt) {
  if (!d) return name;
  const cl = d.codeLabel || { t: '—', e: '' };
  const hhmm = fetchedAt instanceof Date ? `${pad2(fetchedAt.getHours())}:${pad2(fetchedAt.getMinutes())}` : '--:--';
  const fmt = (v, unit) => (v == null ? '—' : `${v}${unit}`);
  const pmLine = d.pm25 == null
    ? 'PM2.5 —'
    : `PM2.5 ${d.pm25} µg/m³${d.aqi != null ? ` (AQI ${d.aqi})` : ''}`;
  return [
    `<b>${name}</b>　${cl.e} ${cl.t}`,
    `气温 ${fmt(d.temp, '°C')}　湿度 ${fmt(d.humidity, '%')}`,
    `风速 ${fmt(d.wind, ' km/h')}　降水 ${fmt(d.precip, ' mm')}`,
    pmLine,
    `<span style="opacity:.6;font-size:11px">数据时间 ${hhmm} · Open-Meteo</span>`,
  ].join('<br/>');
}
