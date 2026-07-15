import { getShijianEventYear, isSynthesisCase } from './caseYears.js';

/** 史鉴侧栏五柱 IA：总论 → 方法论 → 周期机制 → 案例库 → 古今对照 */
export const SHIJIAN_SUBGROUPS = [
  { id: 'overview', label: '总论', order: 0 },
  { id: 'method', label: '方法论', order: 1 },
  { id: 'cycle', label: '周期机制', order: 2 },
  { id: 'cases', label: '案例库', order: 3 },
  { id: 'mirror', label: '古今对照', order: 4 },
];

/** 案例库子段：单案按 eventYear 升序，综合矩阵固定底 */
export const SHIJIAN_CASES_BANDS = [
  { id: 'single', label: '单案（时间序）', order: 0 },
  { id: 'synthesis', label: '综合矩阵', order: 1 },
];

const SUBGROUP_ORDER = Object.fromEntries(
  SHIJIAN_SUBGROUPS.map((s) => [s.id, s.order]),
);

const CASES_BAND_ORDER = Object.fromEntries(
  SHIJIAN_CASES_BANDS.map((s) => [s.id, s.order]),
);

const SYNTHESIS_NAV_ORDER = {
  shijianSJ07: 7,
  shijianSJ16: 16,
  shijianSJ17: 17,
  shijianSJ18: 18,
  shijianSJ19: 19,
};

function casesBand(mod) {
  return isSynthesisCase(mod) ? 'synthesis' : 'single';
}

/**
 * @param {{ id?: string, subgroup?: string, navOrder?: number, title?: string, casesBand?: string }} a
 * @param {{ id?: string, subgroup?: string, navOrder?: number, title?: string, casesBand?: string }} b
 */
export function shijianNavCompare(a, b) {
  const sa = SUBGROUP_ORDER[a.subgroup] ?? 99;
  const sb = SUBGROUP_ORDER[b.subgroup] ?? 99;
  if (sa !== sb) return sa - sb;

  if (a.subgroup === 'cases' && b.subgroup === 'cases') {
    const ba = CASES_BAND_ORDER[a.casesBand ?? casesBand(a)] ?? 0;
    const bb = CASES_BAND_ORDER[b.casesBand ?? casesBand(b)] ?? 0;
    if (ba !== bb) return ba - bb;
    if (ba === 0) {
      const ya = getShijianEventYear(a);
      const yb = getShijianEventYear(b);
      if (ya !== yb) return ya - yb;
    } else {
      const na = SYNTHESIS_NAV_ORDER[a.id] ?? a.navOrder ?? 0;
      const nb = SYNTHESIS_NAV_ORDER[b.id] ?? b.navOrder ?? 0;
      if (na !== nb) return na - nb;
    }
  }

  const na = a.navOrder ?? 0;
  const nb = b.navOrder ?? 0;
  if (na !== nb) return na - nb;
  return (a.title || '').localeCompare(b.title || '', 'zh-CN');
}

export function shijianSubgroupLabel(subgroupId) {
  return SHIJIAN_SUBGROUPS.find((s) => s.id === subgroupId)?.label ?? subgroupId;
}

export function shijianCasesBandLabel(bandId) {
  return SHIJIAN_CASES_BANDS.find((s) => s.id === bandId)?.label ?? bandId;
}
