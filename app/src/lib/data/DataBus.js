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

async function getJSON(url, { ttlMs = 5 * 60 * 1000 } = {}) {
  const hit = cache.get(url);
  const now = Date.now();
  if (hit && now - hit.t < ttlMs) return hit.v;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`DataBus: ${url} -> ${res.status}`);
  const v = await res.json();
  cache.set(url, { v, t: now });
  return v;
}

// 世界银行指标（沿用现有 data/ 目录，迁移期复用同一数据源）
async function worldBank(indicator, { country = 'CHN', from = 2018, to = 2024 } = {}) {
  const base = 'https://api.worldbank.org/v2/country/';
  const url = `${base}${country}/indicator/${indicator}?format=json&per_page=20&date=${from}:${to}`;
  const json = await getJSON(url);
  return Array.isArray(json) ? json[1] || [] : [];
}

// 行政区划地理边界（DataV）：adcode='100000' 为全国，省/市用各自 adcode
async function regionGeo(adcode = '100000') {
  const url = `https://geo.datav.aliyun.com/areas_v3/bound/${adcode}_full.json`;
  return getJSON(url, { ttlMs: 24 * 60 * 60 * 1000 });
}

export const DataBus = {
  getJSON,
  worldBank,
  regionGeo,
  clearCache: () => cache.clear(),
};

export default DataBus;
