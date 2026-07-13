// ============================================================================
// 神州活图 · 实况 API 公共取数（Worker 代理优先 · 直连兜底）
// ----------------------------------------------------------------------------
// Worker 路由（worker/index.js）：
//   GET /api/live/weather  → Open-Meteo forecast（免 key）
//   GET /api/live/aqi      → Open-Meteo air-quality + OpenAQ 兜底
//   GET /api/live/shipping → 主要港口 + 可选 AIS（AIS_HUB_USERNAME wrangler secret）
// 内存缓存 10 分钟；失败不抛，由调用方展示「数据暂不可用」。
// ============================================================================

const FETCH_TIMEOUT_MS = 12000;
const DEFAULT_REFRESH_MS = 600000;

/** @type {Map<string, { body: unknown, fetchedAt: number }>} */
const memCache = new Map();

/**
 * @param {string} key
 * @param {() => Promise<unknown>} loader
 * @param {number} [ttlMs]
 */
export async function cachedLiveFetch(key, loader, ttlMs = DEFAULT_REFRESH_MS) {
  const hit = memCache.get(key);
  if (hit && Date.now() - hit.fetchedAt < ttlMs) {
    return { data: hit.body, fetchedAt: new Date(hit.fetchedAt), fromCache: true };
  }
  const body = await loader();
  memCache.set(key, { body, fetchedAt: Date.now() });
  return { data: body, fetchedAt: new Date(), fromCache: false };
}

/**
 * @param {string} path  e.g. `/api/live/weather?...`
 * @param {string} [directUrl]  CORS 开放时的直连 URL
 * @param {AbortSignal} [signal]
 */
export async function fetchLiveJson(path, directUrl, signal) {
  const urls = [path, directUrl].filter(Boolean);
  let lastErr;
  for (const url of urls) {
    try {
      const res = await fetch(url, { signal });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return await res.json();
    } catch (e) {
      lastErr = e;
    }
  }
  throw lastErr || new Error('fetch failed');
}

/** @param {number} [ms] */
export function liveAbort(ms = FETCH_TIMEOUT_MS) {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), ms);
  return { signal: ctrl.signal, clear: () => clearTimeout(timer) };
}

/** @param {Date | null} d */
export function formatLiveTime(d) {
  if (!(d instanceof Date) || Number.isNaN(d.getTime())) return '--:--';
  return d.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' });
}

/** @param {number} v */
export function round1(v) {
  const n = Number(v);
  return v == null || Number.isNaN(n) ? null : Number(n.toFixed(1));
}

/** GeoJSON / API 单点或数组归一化 */
export function asArray(json) {
  return Array.isArray(json) ? json : [json];
}

export { FETCH_TIMEOUT_MS, DEFAULT_REFRESH_MS };
