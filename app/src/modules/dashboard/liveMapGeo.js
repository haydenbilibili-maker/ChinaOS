// ============================================================================
// 神州活图 · 行政区划边界加载（本地优先 · 网络可选）
// ----------------------------------------------------------------------------
// 加载顺序：本地 /geo/china-*.json → Worker /api/geo → DataV CDN（Referer 403 时跳过）
// 全部失败时抛出可读错误，由 UI 展示 EmptyState 横幅
// ============================================================================

import * as echarts from 'echarts';
import DataBus from '../../lib/data/DataBus.js';

const registered = new Set();

/** @param {unknown} geo */
export function isValidChinaGeo(geo) {
  return !!(
    geo
    && typeof geo === 'object'
    && geo.type === 'FeatureCollection'
    && Array.isArray(geo.features)
    && geo.features.length > 0
  );
}

/** 站点根路径绝对 URL，避免 HashRouter / base:'./' 下相对路径误解析 */
export function resolveGeoAssetUrl(adcode) {
  const path = `/geo/china-${adcode}.json`;
  if (typeof window !== 'undefined' && window.location?.origin) {
    return `${window.location.origin}${path}`;
  }
  return path;
}

const GEO_URL_CHAIN = (adcode) => [
  resolveGeoAssetUrl(adcode),
  `/api/geo/${adcode}`,
  `https://geo.datav.aliyun.com/areas_v3/bound/${adcode}_full.json`,
];

/**
 * @param {string} [adcode='100000']
 * @returns {Promise<{ mapName: string, source: string, url: string }>}
 */
export async function loadChinaGeo(adcode = '100000') {
  const key = String(adcode);
  const mapName = key === '100000' ? 'china' : `china-${key}`;

  if (registered.has(mapName)) {
    return { mapName, source: 'cache', url: '' };
  }

  const urls = GEO_URL_CHAIN(key);
  const errors = [];
  for (const url of urls) {
    try {
      const geo = await DataBus.getJSON(url, { ttlMs: 24 * 60 * 60 * 1000, timeoutMs: 12000 });
      if (!isValidChinaGeo(geo)) {
        throw new Error(`GeoJSON 结构无效：${url}`);
      }
      echarts.registerMap(mapName, geo);
      registered.add(mapName);
      const source = url.includes('/geo/china-') || url.includes('/geo/china')
        ? 'local'
        : url.startsWith('/api/geo') || url.includes('/api/geo/')
          ? 'proxy'
          : 'network';
      return { mapName, source, url };
    } catch (e) {
      errors.push(`${url}: ${e?.message || e}`);
    }
  }
  throw new Error(
    `神州活图：区划 ${key} 边界不可用（已尝试本地 / Worker / DataV）。${errors[errors.length - 1] || ''}`,
  );
}

export function shortProvinceName(name) {
  return name.replace(/(省|市|自治区|壮族|回族|维吾尔)/g, '');
}
