// ============================================================================
// 神州活图 · 行政区划边界加载（网络优先 · 本地兜底）
// ----------------------------------------------------------------------------
// 加载顺序：DataV CDN → Worker /api/geo 代理 → 本地 /geo/china-*.json
// ============================================================================

import * as echarts from 'echarts';
import DataBus from '../../lib/data/DataBus.js';

const registered = new Set();

const GEO_URL_CHAIN = (adcode) => [
  `https://geo.datav.aliyun.com/areas_v3/bound/${adcode}_full.json`,
  `/api/geo/${adcode}`,
  `/geo/china-${adcode}.json`,
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
  let lastErr;
  for (const url of urls) {
    try {
      const geo = await DataBus.getJSON(url, { ttlMs: 24 * 60 * 60 * 1000, timeoutMs: 12000 });
      echarts.registerMap(mapName, geo);
      registered.add(mapName);
      const source = url.includes('datav.aliyun') ? 'network'
        : url.startsWith('/api/geo') ? 'proxy'
          : 'local';
      return { mapName, source, url };
    } catch (e) {
      lastErr = e;
    }
  }
  throw lastErr || new Error(`神州活图：区划 ${key} 边界不可用`);
}

export function shortProvinceName(name) {
  return name.replace(/(省|市|自治区|壮族|回族|维吾尔)/g, '');
}
