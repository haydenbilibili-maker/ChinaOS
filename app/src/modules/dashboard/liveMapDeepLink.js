// ============================================================================
// 神州活图 · URL 深链状态（prov / layer / view）
// 独立模块，避免 liveMapData ↔ registry 循环依赖
// ============================================================================

import { PROVINCE_NAMES, LAYERS } from './liveMapData.js';

export const LIVE_MAP_VIEWS = ['situation', 'heatmap', 'signals', 'timeline', 'analysis'];

/** 种子层 + 实况层 id（与 LiveChinaMap ALL_LAYERS 对齐） */
export const DEEP_LINK_LAYER_IDS = [
  'composite',
  'liveTemp', 'livePrecip', 'livePm25',
  ...LAYERS.slice(1).map((l) => l.id),
];

/**
 * @param {string|null|undefined} raw
 * @returns {string|null}
 */
export function resolveProvinceParam(raw) {
  if (!raw) return null;
  let decoded = raw;
  try {
    decoded = decodeURIComponent(raw);
  } catch {
    decoded = raw;
  }
  if (PROVINCE_NAMES.includes(decoded)) return decoded;
  const hit = PROVINCE_NAMES.find((n) => n.includes(decoded) || decoded.includes(n.replace(/(省|市|自治区|壮族|回族|维吾尔)/g, '')));
  return hit || null;
}

/**
 * @param {string|null|undefined} raw
 * @returns {string|null}
 */
export function resolveLayerParam(raw) {
  if (!raw) return null;
  const id = raw.trim();
  if (!DEEP_LINK_LAYER_IDS.includes(id)) return null;
  return id;
}

/**
 * @param {URLSearchParams} params
 * @returns {{ province: string|null, layer: string|null }}
 */
export function readDeepLinkFromParams(params) {
  return {
    province: resolveProvinceParam(params.get('prov')),
    layer: resolveLayerParam(params.get('layer')),
  };
}

/**
 * 写入 prov/layer 到 URLSearchParams（空值则删除键）
 * @param {URLSearchParams} params
 * @param {{ province?: string|null, layer?: string|null }} patch
 */
export function writeDeepLinkToParams(params, { province, layer }) {
  if (province) params.set('prov', province);
  else params.delete('prov');
  if (layer && layer !== 'composite') params.set('layer', layer);
  else params.delete('layer');
}
