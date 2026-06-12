// ============================================================================
// 神州活图 · 12 个月历史序列（种子示意 · 2025-07 → 2026-06）
// ----------------------------------------------------------------------------
// 确定性生成：同省同层可复现；供时间轴 scrubber 与省份详情 sparkline
// ============================================================================

import { PROVINCE_LAYERS, getLayerById, LAYERS } from './liveMapData.js';

const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));

function hashSeed(s) {
  let h = 2166136261;
  for (let i = 0; i < s.length; i += 1) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return Math.abs(h);
}

/** 时间轴月份标签 */
export const MONTH_LABELS = [
  '2025-07', '2025-08', '2025-09', '2025-10', '2025-11', '2025-12',
  '2026-01', '2026-02', '2026-03', '2026-04', '2026-05', '2026-06',
];

export const MONTH_COUNT = MONTH_LABELS.length;
export const CURRENT_MONTH_INDEX = MONTH_COUNT - 1;

/** 单层单月全国 choropleth（用于时间轴动画） */
const timelineCache = new Map();

function seriesKey(layerId, monthIdx) {
  return `${layerId}:${monthIdx}`;
}

function monthValue(base, layerId, provinceName, monthIdx) {
  const layer = getLayerById(layerId);
  const seed = hashSeed(`${provinceName}:${layerId}`);
  const seasonal = Math.sin((monthIdx / 12) * Math.PI * 2 + (seed % 7) * 0.4) * 6;
  const noise = ((seed >> ((monthIdx * 3) % 12)) & 15) - 7;
  const trend = (monthIdx - 5.5) * 0.45;
  const layerBias = (hashSeed(layerId) % 5) - 2;
  return Math.round(clamp(base + seasonal + noise + trend + layerBias, layer.min, layer.max));
}

/** 单省单层 12 月序列 */
export function getProvinceHistory(provinceName, layerId) {
  const rec = PROVINCE_LAYERS.find((p) => p.name === provinceName);
  if (!rec) return Array(MONTH_COUNT).fill(0);
  const base = rec[layerId]?.value ?? rec.composite.value;
  return MONTH_LABELS.map((_, i) => monthValue(base, layerId, provinceName, i));
}

/** 时间轴某一帧的全国 series */
export function getTimelineSeries(layerId, monthIdx = CURRENT_MONTH_INDEX) {
  const key = seriesKey(layerId, monthIdx);
  if (timelineCache.has(key)) return timelineCache.get(key);

  const data = PROVINCE_LAYERS.map((p) => {
    const base = p[layerId]?.value ?? p.composite.value;
    const value = monthValue(base, layerId, p.name, monthIdx);
    const metrics = { ...(p[layerId] || p.composite), value, month: MONTH_LABELS[monthIdx] };
    return { name: p.name, value, metrics };
  });

  timelineCache.set(key, data);
  return data;
}

/** 全国单层历史均值曲线（时间轴参考线） */
export function getNationalHistory(layerId) {
  return MONTH_LABELS.map((_, mi) => {
    const series = getTimelineSeries(layerId, mi);
    const avg = series.reduce((s, d) => s + d.value, 0) / series.length;
    return Math.round(avg * 10) / 10;
  });
}

export function getAllLayerIds() {
  return LAYERS.map((l) => l.id);
}
