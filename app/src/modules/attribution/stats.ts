import type { Issue, PowerLayer } from '../../domain/governance.ts';
import { LAYER_META, POWER_LAYERS } from '../../domain/governance.ts';

export interface LayerCounts {
  direction: number;
  decision: number;
  execution: number;
  total: number;
}

export interface LayerStats extends LayerCounts {
  ratios: Record<PowerLayer, number>;
  /** 结构层（路线+决策）占比 */
  structureRatio: number;
  /** 执行层占比 */
  executionRatio: number;
  /** 分裂指数：结构僵持度 − 执行精细度，正数表示宏观结构主导 */
  splitIndex: number;
  diagnosticConclusion: string;
}

export function countByLayer(issues: Issue[]): LayerCounts {
  const counts: LayerCounts = { direction: 0, decision: 0, execution: 0, total: issues.length };
  for (const issue of issues) {
    counts[issue.layer] += 1;
  }
  return counts;
}

export function computeLayerStats(issues: Issue[]): LayerStats {
  const counts = countByLayer(issues);
  const total = Math.max(counts.total, 1);

  const ratios = {
    direction: counts.direction / total,
    decision: counts.decision / total,
    execution: counts.execution / total,
  };

  const structureRatio = ratios.direction + ratios.decision;
  const executionRatio = ratios.execution;
  const splitIndex = structureRatio - executionRatio;

  let diagnosticConclusion: string;
  if (counts.total === 0) {
    diagnosticConclusion = '议题库为空，请从预置库选择或录入自定义议题。';
  } else if (structureRatio >= executionRatio) {
    diagnosticConclusion =
      `当前库 ${counts.total} 条议题中，结构层（路线+决策）占 ${Math.round(structureRatio * 100)}%。` +
      '推论：所有真正棘手的问题，解都在第一、二层；所有能被有效解决的问题，都在第三层。';
  } else {
    diagnosticConclusion =
      `当前库 ${counts.total} 条议题中，执行层占 ${Math.round(executionRatio * 100)}%。` +
      '推论：可落地优化空间集中在执行层，但宏观通缩、模式切换等仍须上溯决策/路线层。';
  }

  return {
    ...counts,
    ratios,
    structureRatio,
    executionRatio,
    splitIndex,
    diagnosticConclusion,
  };
}

export function layerLabel(layer: PowerLayer): string {
  return LAYER_META[layer].label;
}

export function layerColor(layer: PowerLayer): string {
  return LAYER_META[layer].color;
}

export { LAYER_META, POWER_LAYERS };
