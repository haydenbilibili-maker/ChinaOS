// ============================================================================
// 商业精英库 · 独立数据集封装（与政治人才 figures / 文化精英隔离）
// ============================================================================
import {
  BUSINESS_ELITE_2026,
  BUSINESS_ELITE_META,
  BUSINESS_ELITE_COUNT,
} from './figureBusinessElite2026.js';
import { BUSINESS_ELITE_EXPANSION } from './talentBulkExpansion2026.js';
import { BUSINESS_ELITE_EXPANSION_2 } from './talentBulkExpansion2026_part2.js';
import { BUSINESS_ELITE_EXPANSION_4 } from './talentBulkExpansion2026_part4.js';
import { mergeAcademiciansIntoBusinessElite } from './academicianMerge.js';
import { enrichTalentList } from '../talent/talentEnrich.js';
import {
  BE_ROLE_CATS,
  BE_ROLE_LEGACY_ALIASES,
  BE_ROLE_LABEL,
  BE_SECTOR_CATS,
  BE_SECTOR_LABEL,
  normalizeBusinessEliteCategory,
  resolveBeRoleKey,
  resolveBeSectorKey,
  enrichBusinessEliteRow,
  classifyBusinessSector,
  BE_OWNERSHIP_CATS,
  BE_OWNERSHIP_LABEL,
} from './beCategory.js';

export {
  BE_ROLE_CATS,
  BE_ROLE_LEGACY_ALIASES,
  BE_ROLE_LABEL,
  BE_SECTOR_CATS,
  BE_SECTOR_LABEL,
  normalizeBusinessEliteCategory,
  resolveBeRoleKey,
  resolveBeSectorKey,
  enrichBusinessEliteRow,
  classifyBusinessSector,
  BE_OWNERSHIP_CATS,
  BE_OWNERSHIP_LABEL,
};

/** @deprecated 兼容旧引用 */
export const BE_SUB_CATS = BE_ROLE_CATS;

export const BUSINESS_ELITE_DATASET_ID = BUSINESS_ELITE_META.id;

export const BUSINESS_ELITE_COLUMNS = [
  'name', 'sector', 'category', 'industry', 'sectorKey', 'company', 'province', 'title',
  'achievements', 'honors', 'background', 'asOf', 'source', 'sources', 'notes',
  'academy', 'academyCas', 'academyCae', 'academyDivision', 'electedYear',
  'verifiedAt', 'verifyTier', 'provenance', 'lastPublicActivity', 'confidence', 'publicRecordNote',
  'bio', 'keyEvents', 'tags', 'crossRefs',
];

export const beKey = (r) => r.id || `${(r.name || '').trim()}#${normalizeBusinessEliteCategory(r) || ''}`;

function completeness(r) {
  return BUSINESS_ELITE_COLUMNS.reduce((n, k) => n + (r[k] ? 1 : 0), 0);
}

function pickBest(a, b) {
  return completeness(a) >= completeness(b) ? a : b;
}

/** @returns {{ rows: object[], dupeCount: number, rawCount: number }} */
export function dedupeBusinessElite(list) {
  const raw = list || [];
  const byKey = new Map();
  for (const row of raw) {
    const cat = normalizeBusinessEliteCategory(row);
    if (!cat || !row.name) continue;
    const r = enrichBusinessEliteRow({ ...row, sector: '商业', category: cat });
    const k = beKey(r);
    const prev = byKey.get(k);
    byKey.set(k, prev ? pickBest(prev, r) : r);
  }
  const rows = [...byKey.values()];
  return { rows, dupeCount: raw.length - rows.length, rawCount: raw.length };
}

export function buildBusinessEliteSeed() {
  const merged = mergeAcademiciansIntoBusinessElite([...BUSINESS_ELITE_2026, ...BUSINESS_ELITE_EXPANSION, ...BUSINESS_ELITE_EXPANSION_2, ...BUSINESS_ELITE_EXPANSION_4]);
  const { rows, dupeCount, rawCount } = dedupeBusinessElite(merged);
  return {
    id: BUSINESS_ELITE_DATASET_ID,
    name: BUSINESS_ELITE_META.label,
    category: '商业精英',
    source: BUSINESS_ELITE_META.sources.join(' / '),
    note: `${BUSINESS_ELITE_META.scope}。${BUSINESS_ELITE_META.notes}${dupeCount ? ` 种子去重：${rawCount}→${rows.length}（合并${dupeCount}条重复）。` : ''}`,
    columns: BUSINESS_ELITE_COLUMNS,
    rows: enrichTalentList(rows, { queue: 'business' }),
  };
}

export const BUSINESS_ELITE_SEED_PKG = buildBusinessEliteSeed();

function tallyCats(rows, keys) {
  const counts = Object.fromEntries(keys.map((k) => [k, 0]));
  rows.forEach((r) => { if (counts[r.category] != null) counts[r.category] += 1; });
  return counts;
}

function tallySectors(rows) {
  const counts = Object.fromEntries(BE_SECTOR_CATS.map((k) => [k, 0]));
  rows.forEach((r) => {
    const sk = r.sectorKey || classifyBusinessSector(r.industry);
    if (counts[sk] != null) counts[sk] += 1;
  });
  return counts;
}

/** 去重后实际条数（展示/统计口径，与种子包一致） */
export const BUSINESS_ELITE_DEDUPED_COUNT = (() => {
  const rows = BUSINESS_ELITE_SEED_PKG.rows;
  const role = tallyCats(rows, BE_ROLE_CATS);
  const sector = tallySectors(rows);
  return { ...role, sector, total: rows.length };
})();

export { BUSINESS_ELITE_META, BUSINESS_ELITE_COUNT, BUSINESS_ELITE_2026 };
