// ============================================================================
// 数据层 · DataBus（骨架）
// ----------------------------------------------------------------------------
// 统一多源数据接入（世界银行 / 国家统计局 / IMF / 本地 CSV）的最小契约：
//   - 带内存缓存的 fetch
//   - 统一错误处理与离线兜底点
// 后续按 PRD「DataBus 2.0」扩展 schema 校验、增量更新、多源对账。
// 现阶段先提供稳定接口，让模块不直接散落 fetch。
// ============================================================================

const cache = new Map();

async function getJSON(url, { ttlMs = 5 * 60 * 1000, timeoutMs = 0 } = {}) {
  const hit = cache.get(url);
  const now = Date.now();
  if (hit && now - hit.t < ttlMs) return hit.v;
  // 可选超时：外部 API（WB 等）慢/不可达时不挂死，优雅降级
  let signal, timer;
  if (timeoutMs > 0 && typeof AbortController !== 'undefined') {
    const ac = new AbortController();
    signal = ac.signal;
    timer = setTimeout(() => ac.abort(), timeoutMs);
  }
  try {
    const res = await fetch(url, signal ? { signal } : undefined);
    if (!res.ok) throw new Error(`DataBus: ${url} -> ${res.status}`);
    const v = await res.json();
    cache.set(url, { v, t: now });
    return v;
  } finally {
    if (timer) clearTimeout(timer);
  }
}

// 世界银行指标（沿用现有 data/ 目录，迁移期复用同一数据源）
async function worldBank(indicator, { country = 'CHN', from = 2018, to = 2024, timeoutMs = 8000 } = {}) {
  const base = 'https://api.worldbank.org/v2/country/';
  const url = `${base}${country}/indicator/${indicator}?format=json&per_page=20&date=${from}:${to}`;
  const json = await getJSON(url, { timeoutMs });
  return Array.isArray(json) ? json[1] || [] : [];
}

// 行政区划地理边界：本地 GeoJSON 优先，DataV CDN 兜底（浏览器端常遇 403/CORS）
const REGION_GEO_URLS = {
  100000: [
    '/geo/china-100000.json',
    'https://geo.datav.aliyun.com/areas_v3/bound/100000_full.json',
  ],
};

async function regionGeo(adcode = '100000') {
  const key = String(adcode);
  const urls = REGION_GEO_URLS[key] || [
    `/geo/china-${key}.json`,
    `https://geo.datav.aliyun.com/areas_v3/bound/${key}_full.json`,
  ];
  let lastErr;
  for (const url of urls) {
    try {
      return await getJSON(url, { ttlMs: 24 * 60 * 60 * 1000 });
    } catch (e) {
      lastErr = e;
    }
  }
  throw lastErr || new Error(`DataBus: region geo ${key} unavailable`);
}

// 世界地图 GeoJSON：本地静态资源优先，CDN 兜底（jsDelivr echarts/map 路径已 404）
const WORLD_GEO_URLS = [
  '/geo/world.json',
  'https://raw.githubusercontent.com/apache/echarts/master/test/data/map/json/world.json',
];

async function worldGeo() {
  let lastErr;
  for (const url of WORLD_GEO_URLS) {
    try {
      return await getJSON(url, { ttlMs: 24 * 60 * 60 * 1000 });
    } catch (e) {
      lastErr = e;
    }
  }
  throw lastErr || new Error('DataBus: world geo unavailable');
}

// 省级统计数据：远程优先 + 本地快照兜底 + 数据源标注。
// 省级粒度无免费公开实时 API，故默认本地快照；配置 remote 后自动切换并标注「实时」。
// remote 可指向自建代理 / NBS 数据网关 / 托管 JSON（同 schema：{meta, provinces[]}）。
async function provinceStats({ remote } = {}) {
  if (remote) {
    try {
      const j = await getJSON(remote, { ttlMs: 10 * 60 * 1000 });
      if (j && Array.isArray(j.provinces)) return { source: 'live', remote, meta: j.meta || {}, provinces: j.provinces };
    } catch (_) { /* 远程失败 → 兜底 */ }
  }
  const j = await getJSON('data/province-stats.json', { ttlMs: 30 * 60 * 1000 });
  return { source: 'local', meta: j.meta || {}, provinces: j.provinces };
}

// 全国实时基线：直接打世界银行 API（真·实时），取各指标最新非空值。
async function chinaIndicators() {
  const pick = (rows) => (rows || []).filter((r) => r && r.value != null).sort((a, b) => b.date - a.date)[0] || null;
  const [gdpG, pop, gdp] = await Promise.all([
    worldBank('NY.GDP.MKTP.KD.ZG', { from: 2019, to: 2024 }).catch(() => []),
    worldBank('SP.POP.TOTL', { from: 2019, to: 2024 }).catch(() => []),
    worldBank('NY.GDP.MKTP.CD', { from: 2019, to: 2024 }).catch(() => []),
  ]);
  return { gdpGrowth: pick(gdpG), population: pick(pop), gdp: pick(gdp), fetchedAt: undefined };
}

export const DataBus = {
  getJSON,
  worldBank,
  regionGeo,
  worldGeo,
  provinceStats,
  chinaIndicators,
  clearCache: () => cache.clear(),
};

export default DataBus;
