import { LAYER_META, POWER_LAYERS } from '../../domain/governance';

export const TIMELINE_START = 1998;
export const CURRENT_YEAR = new Date().getFullYear();
export const TIMELINE_END = CURRENT_YEAR;

const LAYER_ORDER = ['direction', 'decision', 'execution'];

/** 年份 → SVG x 坐标 */
export function yearToX(year, chartWidth, marginLeft, marginRight, startYear = TIMELINE_START, endYear = TIMELINE_END) {
  const inner = chartWidth - marginLeft - marginRight;
  const span = endYear - startYear || 1;
  return marginLeft + ((year - startYear) / span) * inner;
}

/** 层级 → 带状区 y 中心 */
export function layerToBandIndex(layer) {
  return LAYER_ORDER.indexOf(layer);
}

/** 获取任期覆盖分段（支持前强后弱、决策收缩） */
export function getCoverageSegments(term, endYear = TIMELINE_END) {
  if (term.radiusPhases?.length) {
    return term.radiusPhases.map((phase) => ({
      ...phase,
      end: phase.end ?? endYear,
    }));
  }
  return [
    {
      start: term.start,
      end: term.end ?? endYear,
      radius: term.radius,
      directionPartial: term.radius.includes('direction') && term.id === 'zhu',
    },
  ];
}

/** 收集全部政策散点 */
export function collectPolicyPoints(terms) {
  const points = [];
  for (const term of terms) {
    for (const policy of term.signaturePolicies) {
      points.push({
        ...policy,
        premierId: term.id,
        premierName: term.name,
      });
    }
  }
  return points.sort((a, b) => a.year - b.year);
}

/** 收集全局 + 任内 inflection 标注 */
export function collectTimelineMarkers(terms, globalInflections = []) {
  const markers = globalInflections.map((m) => ({ ...m, source: 'global' }));
  for (const term of terms) {
    for (const inf of term.inflectionPoints) {
      if (inf.global) {
        const exists = markers.some((m) => m.year === inf.year && m.event === inf.event);
        if (!exists) markers.push({ ...inf, source: term.id });
      }
    }
  }
  return markers.sort((a, b) => a.year - b.year);
}

/** 单调收缩验证：后任覆盖层数 ≤ 前任（制度轨迹，非能力排序） */
export function verifyMonotonicShrink(terms) {
  const sorted = [...terms].sort((a, b) => a.start - b.start);
  const violations = [];
  for (let i = 1; i < sorted.length; i += 1) {
    const prev = new Set(sorted[i - 1].radius);
    const curr = new Set(sorted[i].radius);
    for (const layer of prev) {
      if (!curr.has(layer) && layer !== 'direction') {
        /* direction 可能从未完整覆盖，跳过 */
      }
    }
    if (curr.size > prev.size) {
      violations.push({
        prev: sorted[i - 1].name,
        curr: sorted[i].name,
        message: `${sorted[i].name} 覆盖层数多于 ${sorted[i - 1].name}`,
      });
    }
  }
  return { ok: violations.length === 0, violations };
}

/** 各层政策密度（用于散点图图例统计） */
export function countPoliciesByLayer(terms) {
  const counts = { direction: 0, decision: 0, execution: 0, total: 0 };
  for (const term of terms) {
    for (const p of term.signaturePolicies) {
      counts[p.layer] += 1;
      counts.total += 1;
    }
  }
  return counts;
}

export function layerColor(layer) {
  return LAYER_META[layer]?.color ?? '#93a6a4';
}

export function layerLabel(layer) {
  return LAYER_META[layer]?.shortLabel ?? layer;
}

export { LAYER_META, POWER_LAYERS, LAYER_ORDER };
