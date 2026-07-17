import { getShijianEventYear, isSynthesisCase } from './caseYears.js';

/**
 * 史鉴侧栏 IA（2026-07-17）
 * ────────────────────────────────────────────────────────────
 * 一级：`shijian`（史鉴·中华）与 `shijianWorld`（史鉴·世界）并列，
 *       不再挤在同一 GROUP 用 subgroup 区分双线。
 *
 * 中华五柱：总论 / 方法论 / 周期机制 / 案例库 / 古今对照（不变）
 * 世界七带：总览 + 六主题带（每卷只属一个主 subgroup）
 *
 * 世界组内排序：专题逻辑序（navOrder），见 SHIJIAN_WORLD_SUBGROUPS 注释；
 * 中华案例库：单案 eventYear 升序 + 综合矩阵底栏。
 */

/** 史鉴·中华二级 */
export const SHIJIAN_CHINA_SUBGROUPS = [
  { id: 'overview', label: '总论', order: 0 },
  { id: 'method', label: '方法论', order: 1 },
  { id: 'cycle', label: '周期机制', order: 2 },
  { id: 'cases', label: '案例库', order: 3 },
  { id: 'mirror', label: '古今对照', order: 4 },
];

/**
 * 史鉴·世界二级（主题带）
 * 成员（每卷唯一主带）：
 *   world-hub  总览         · 00
 *   world-rise 崛起与霸权   · 01, 11, 07, 13（总论→工业基座→英美交接→矩阵）
 *   world-war  大战与秩序   · 12, 19, 20, 02, 08, 31（维也纳→革命→德国→大战→核→联合国）
 *   world-civ  文明与地缘   · 04, 06, 09, 14, 21, 30
 *   world-ideo 主义与运动   · 05, 03, 10, 17, 22
 *   world-dev  发展型国家   · 15, 24, 27, 29, 28, 25, 23（单案→矩阵底）
 *   world-tech 货币/科技/能源 · 16, 26, 18, 32
 */
export const SHIJIAN_WORLD_SUBGROUPS = [
  { id: 'world-hub', label: '总览', order: 0 },
  { id: 'world-rise', label: '崛起与霸权', order: 1 },
  { id: 'world-war', label: '大战与秩序', order: 2 },
  { id: 'world-civ', label: '文明与地缘', order: 3 },
  { id: 'world-ideo', label: '主义与运动', order: 4 },
  { id: 'world-dev', label: '发展型国家', order: 5 },
  { id: 'world-tech', label: '货币/科技/能源', order: 6 },
];

/** 标签查找用并集（Shell subgroup header） */
export const SHIJIAN_SUBGROUPS = [
  ...SHIJIAN_CHINA_SUBGROUPS,
  ...SHIJIAN_WORLD_SUBGROUPS,
];

/** 案例库子段：单案按 eventYear 升序，综合矩阵固定底 */
export const SHIJIAN_CASES_BANDS = [
  { id: 'single', label: '单案（时间序）', order: 0 },
  { id: 'synthesis', label: '综合矩阵', order: 1 },
];

const CHINA_SUBGROUP_ORDER = Object.fromEntries(
  SHIJIAN_CHINA_SUBGROUPS.map((s) => [s.id, s.order]),
);

const WORLD_SUBGROUP_ORDER = Object.fromEntries(
  SHIJIAN_WORLD_SUBGROUPS.map((s) => [s.id, s.order]),
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
 * 史鉴·中华侧栏排序
 * @param {{ id?: string, subgroup?: string, navOrder?: number, title?: string, casesBand?: string }} a
 * @param {{ id?: string, subgroup?: string, navOrder?: number, title?: string, casesBand?: string }} b
 */
export function shijianNavCompare(a, b) {
  const sa = CHINA_SUBGROUP_ORDER[a.subgroup] ?? 99;
  const sb = CHINA_SUBGROUP_ORDER[b.subgroup] ?? 99;
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

/**
 * 史鉴·世界侧栏排序：先主题带，组内按 navOrder（专题逻辑序）
 * @param {{ subgroup?: string, navOrder?: number, title?: string }} a
 * @param {{ subgroup?: string, navOrder?: number, title?: string }} b
 */
export function shijianWorldNavCompare(a, b) {
  const sa = WORLD_SUBGROUP_ORDER[a.subgroup] ?? 99;
  const sb = WORLD_SUBGROUP_ORDER[b.subgroup] ?? 99;
  if (sa !== sb) return sa - sb;
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
