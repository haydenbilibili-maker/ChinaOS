/**
 * 三力监测仪 · 外部维度读数注册表
 * 允许治理链模块向指定维度供给结构性读数（不修改 FORCES 种子本体）。
 */

export type ThreeForcesDimension = 'external_pressure' | 'internal_crisis' | 'cognitive_iteration';

export interface ThreeForcesInput {
  dimension: ThreeForcesDimension;
  source: string;
  label: string;
  reading: () => number;
  rationale: string;
}

const registry: ThreeForcesInput[] = [];

export function registerThreeForcesInput(input: ThreeForcesInput): void {
  const idx = registry.findIndex((r) => r.source === input.source && r.dimension === input.dimension);
  if (idx >= 0) registry[idx] = input;
  else registry.push(input);
}

export function getThreeForcesInputs(dimension?: ThreeForcesDimension): ThreeForcesInput[] {
  if (!dimension) return [...registry];
  return registry.filter((r) => r.dimension === dimension);
}

export function clearThreeForcesInputs(): void {
  registry.length = 0;
}
