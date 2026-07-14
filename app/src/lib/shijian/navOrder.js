/** 史鉴侧栏五柱 IA：总论 → 方法论 → 周期机制 → 案例库 → 古今对照 */
export const SHIJIAN_SUBGROUPS = [
  { id: 'overview', label: '总论', order: 0 },
  { id: 'method', label: '方法论', order: 1 },
  { id: 'cycle', label: '周期机制', order: 2 },
  { id: 'cases', label: '案例库', order: 3 },
  { id: 'mirror', label: '古今对照', order: 4 },
];

const SUBGROUP_ORDER = Object.fromEntries(
  SHIJIAN_SUBGROUPS.map((s) => [s.id, s.order]),
);

/**
 * @param {{ subgroup?: string, navOrder?: number, title?: string }} a
 * @param {{ subgroup?: string, navOrder?: number, title?: string }} b
 */
export function shijianNavCompare(a, b) {
  const sa = SUBGROUP_ORDER[a.subgroup] ?? 99;
  const sb = SUBGROUP_ORDER[b.subgroup] ?? 99;
  if (sa !== sb) return sa - sb;
  const na = a.navOrder ?? 0;
  const nb = b.navOrder ?? 0;
  if (na !== nb) return na - nb;
  return (a.title || '').localeCompare(b.title || '', 'zh-CN');
}

export function shijianSubgroupLabel(subgroupId) {
  return SHIJIAN_SUBGROUPS.find((s) => s.id === subgroupId)?.label ?? subgroupId;
}
