// ============================================================================
// 空情实况 · airplanes.live 社区 ADS-B 公开数据（CORS 开放、免 key）
// ----------------------------------------------------------------------------
// OpenSky 匿名接口浏览器端无 CORS（已实测 Failed to fetch），改用 airplanes.live
// /v2/point/{lat}/{lon}/{radius_nm}（≤250nm）；六大枢纽多点采样合并去重，
// 覆盖京津冀/长三角/珠三角/成渝/关中/云贵走廊。大陆社区 ADS-B 接收点稀疏，
// 数量代表「可见空情」而非全量航班——沿海与国际走廊覆盖最好，仅作活跃度示意。
// 实测（2026-07-14）：上海点 250nm 半径 16 架（status 200, ACAO:*）。
// ============================================================================
import { useState, useEffect } from 'react';

const HUBS = [
  [40, 116], // 京津冀
  [31, 121], // 长三角
  [23, 113], // 珠三角
  [30.5, 104], // 成渝
  [34, 109], // 关中
  [25, 103], // 云贵
];
const RADIUS_NM = 250;
const TIMEOUT_MS = 10000;
const GAP_MS = 350; // 顺序请求间隔，尊重匿名限频（~1 req/s）

let _cache = { flights: null, fetchedAt: null, error: null };
let _pending = null;

async function fetchPoint(lat, lon, signal) {
  const res = await fetch(`https://api.airplanes.live/v2/point/${lat}/${lon}/${RADIUS_NM}`, { signal });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const j = await res.json();
  return j.ac || [];
}

async function fetchFlights() {
  if (_pending) return _pending;
  _pending = (async () => {
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), TIMEOUT_MS * HUBS.length);
    try {
      const byHex = new Map();
      let okPoints = 0;
      for (const [lat, lon] of HUBS) {
        try {
          const acs = await fetchPoint(lat, lon, ctrl.signal);
          okPoints += 1;
          for (const a of acs) {
            if (a.lat == null || a.lon == null) continue;
            if (a.alt_baro === 'ground') continue;
            byHex.set(a.hex, {
              icao: a.hex,
              callsign: (a.flight || '').trim() || a.r || '—',
              type: a.t || '',
              lon: a.lon,
              lat: a.lat,
              alt: typeof a.alt_baro === 'number' ? Math.round(a.alt_baro * 0.3048) : null, // ft→m
              vel: a.gs != null ? Math.round(a.gs * 1.852) : null, // kt→km/h
              track: a.track != null ? Math.round(a.track) : 0,
            });
          }
        } catch (_) { /* 单点失败不致命，继续其余枢纽 */ }
        await new Promise((r) => setTimeout(r, GAP_MS));
      }
      if (!okPoints) throw new Error('全部采样点失败');
      const flights = [...byHex.values()].sort((a, b) => (b.alt || 0) - (a.alt || 0)).slice(0, 400);
      _cache = { flights, fetchedAt: new Date(), error: null };
    } catch (e) {
      _cache = { ..._cache, error: e.name === 'AbortError' ? '请求超时' : (e.message || '网络错误') };
    } finally {
      clearTimeout(timer);
      _pending = null;
    }
    return _cache;
  })();
  return _pending;
}

/** 空情快照 hook：{ flights, fetchedAt, loading, error }，多实例共享缓存 */
export function useLiveFlights(refreshMs = 600000, enabled = true) {
  const [state, setState] = useState({ ..._cache, loading: enabled && !_cache.flights });
  useEffect(() => {
    if (!enabled) {
      setState((s) => ({ ...s, loading: false }));
      return undefined;
    }
    let alive = true;
    const load = () => fetchFlights().then((c) => { if (alive) setState({ ...c, loading: false }); });
    load();
    const id = setInterval(load, refreshMs);
    return () => { alive = false; clearInterval(id); };
  }, [refreshMs, enabled]);
  return state;
}

/** ECharts scatter 数据：三角 symbol 默认朝上(0°=北)，取负航向角顺时针对齐航迹 */
export function buildFlightSeries(flights) {
  return (flights || []).map((f) => ({
    name: f.callsign,
    value: [f.lon, f.lat],
    symbolRotate: -f.track,
    icao: f.icao,
    type: f.type,
    alt: f.alt,
    vel: f.vel,
    track: f.track,
  }));
}

/** 空情统计：可见总数 / 平均高度 km / 最快航班 */
export function flightStats(flights) {
  const fs = flights || [];
  if (!fs.length) return { total: 0, avgAlt: 0, fastest: null };
  const alts = fs.filter((f) => f.alt != null);
  const avgAlt = alts.length ? +(alts.reduce((s, f) => s + f.alt, 0) / alts.length / 1000).toFixed(1) : 0;
  const fastest = fs.reduce((m, f) => ((f.vel || 0) > (m?.vel || 0) ? f : m), null);
  return { total: fs.length, avgAlt, fastest };
}

/** tooltip 富文本 */
export function formatFlightTooltip(p) {
  const d = p.data || {};
  const lines = [
    `<b>${p.name || '—'}</b>${d.type ? ` · ${d.type}` : ''}`,
    d.alt != null ? `高度 ${d.alt.toLocaleString()} m` : null,
    d.vel != null ? `速度 ${d.vel} km/h` : null,
    `航向 ${d.track}°`,
    `<span style="opacity:.6;font-size:10px">airplanes.live · 社区 ADS-B 可见空情（大陆覆盖稀疏，示意）</span>`,
  ].filter(Boolean);
  return lines.join('<br/>');
}
