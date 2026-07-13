/**
 * 重构河山 · 拟省合并地图 GeoJSON 加载
 * 省级保留单元 + 拆分省地级面合并为单一 registerMap 源
 */
import * as echarts from 'echarts';
import DataBus from '../../lib/data/DataBus.js';
import {
  SPLIT_PROVINCE_ADCODES,
  KEPT_PROVINCE_NAMES,
  HESHAN_UNIT_SLUGS,
  resolveFeatureUnit,
} from './heshanProvinceGroups.js';

const MAP_NAME = 'heshan-reform';

/** @type {{ mapName: string, features: Array<{ name: string, unit: string|null, slug: string|null, kept: boolean }> } | null} */
let cache = null;

async function fetchProvinceGeo(adcode) {
  return DataBus.regionGeo(String(adcode));
}

/**
 * 合并全国省级底图与拆分省地级边界
 * @returns {Promise<{ mapName: string, source: string, featureCount: number, features: object[] }>}
 */
export async function loadHeshanReformGeo() {
  if (cache) {
    return { ...cache, source: 'cache' };
  }

  const national = await fetchProvinceGeo('100000');
  const splitSet = new Set(SPLIT_PROVINCE_ADCODES);
  const features = [];
  const meta = [];

  const kept = national.features.filter((f) => {
    const adcode = f.properties?.adcode;
    return !splitSet.has(adcode);
  });

  for (const f of kept) {
    const name = f.properties?.name || '';
    const isKept = KEPT_PROVINCE_NAMES.has(name);
    features.push({
      ...f,
      properties: { ...f.properties, heshanKept: isKept },
    });
    meta.push({ name, unit: null, slug: null, kept: isKept });
  }

  const splitResults = await Promise.all(
    SPLIT_PROVINCE_ADCODES.map(async (adcode) => {
      try {
        const geo = await fetchProvinceGeo(adcode);
        return geo.features || [];
      } catch (e) {
        console.warn('[heshanMapGeo] split province failed', adcode, e);
        const fallback = national.features.find((x) => x.properties?.adcode === adcode);
        return fallback ? [fallback] : [];
      }
    }),
  );

  for (const chunk of splitResults) {
    for (const f of chunk) {
      const name = f.properties?.name || '';
      const resolved = resolveFeatureUnit(f.properties || {});
      const slug = resolved.unit ? HESHAN_UNIT_SLUGS[resolved.unit] : null;
      features.push({
        ...f,
        properties: {
          ...f.properties,
          heshanUnit: resolved.unit,
          heshanRegionColor: resolved.regionColor,
          heshanKept: false,
          heshanCityKey: resolved.cityKey,
        },
      });
      meta.push({ name, unit: resolved.unit, slug, kept: false });
    }
  }

  const merged = { type: 'FeatureCollection', features };
  echarts.registerMap(MAP_NAME, merged);

  cache = { mapName: MAP_NAME, features: meta, featureCount: features.length };
  return { ...cache, source: 'network' };
}

export { MAP_NAME as HESHAN_MAP_NAME };
