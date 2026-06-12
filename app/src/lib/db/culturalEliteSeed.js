// ============================================================================
// 知识精英库 · 独立数据集封装（与政治人才 figures 隔离）
// ============================================================================
import {
  CULTURAL_ELITE_2026,
  CULTURAL_ELITE_META,
  CULTURAL_ELITE_COUNT,
} from './figureCulturalElite2026.js';
import { CULTURAL_ELITE_EXPANSION } from './talentBulkExpansion2026.js';
import { CULTURAL_ELITE_EXPANSION_2 } from './talentBulkExpansion2026_part2.js';
import { mergeAcademiciansIntoCulturalElite } from './academicianMerge.js';
import { enrichTalentList } from '../talent/talentEnrich.js';
import {
  CE_SUB_CATS,
  CE_TAB_LEGACY_ALIASES,
  CE_TAB_LABEL,
  normalizeCulturalEliteCategory,
  resolveCeTabKey,
} from './ceCategory.js';

export {
  CE_SUB_CATS,
  CE_TAB_LEGACY_ALIASES,
  CE_TAB_LABEL,
  normalizeCulturalEliteCategory,
  resolveCeTabKey,
};

export const CULTURAL_ELITE_DATASET_ID = CULTURAL_ELITE_META.id;

export const CULTURAL_ELITE_COLUMNS = [
  'name', 'sector', 'category', 'tier', 'region', 'discipline', 'field',
  'institution', 'title', 'works', 'strengths', 'rankNotes', 'decade', 'source', 'sources', 'notes',
  'academy', 'academyCas', 'academyCae', 'academyDivision', 'electedYear',
  'asOf', 'verifiedAt', 'verifyTier', 'provenance', 'lastPublicActivity', 'confidence', 'publicRecordNote',
  'bio', 'keyEvents', 'tags', 'crossRefs',
];

export const ceKey = (r) => r.id || `${(r.name || '').trim()}#${normalizeCulturalEliteCategory(r) || ''}`;

function completeness(r) {
  return CULTURAL_ELITE_COLUMNS.reduce((n, k) => n + (r[k] ? 1 : 0), 0);
}

function pickBest(a, b) {
  return completeness(a) >= completeness(b) ? a : b;
}

/** @returns {{ rows: object[], dupeCount: number, rawCount: number }} */
export function dedupeCulturalElite(list) {
  const raw = list || [];
  const byKey = new Map();
  for (const row of raw) {
    const cat = normalizeCulturalEliteCategory(row);
    if (!cat || !row.name) continue;
    const r = { ...row, category: cat };
    const k = ceKey(r);
    const prev = byKey.get(k);
    byKey.set(k, prev ? pickBest(prev, r) : r);
  }
  const rows = [...byKey.values()];
  return { rows, dupeCount: raw.length - rows.length, rawCount: raw.length };
}

export function buildCulturalEliteSeed() {
  const merged = mergeAcademiciansIntoCulturalElite([...CULTURAL_ELITE_2026, ...CULTURAL_ELITE_EXPANSION, ...CULTURAL_ELITE_EXPANSION_2]);
  const { rows, dupeCount, rawCount } = dedupeCulturalElite(merged);
  return {
    id: CULTURAL_ELITE_DATASET_ID,
    name: CULTURAL_ELITE_META.label,
    category: '知识精英',
    source: CULTURAL_ELITE_META.sources.join(' / '),
    note: `${CULTURAL_ELITE_META.scope}。${CULTURAL_ELITE_META.notes}${dupeCount ? ` 种子去重：${rawCount}→${rows.length}（合并${dupeCount}条重复）。` : ''}`,
    columns: CULTURAL_ELITE_COLUMNS,
    rows: enrichTalentList(rows, { queue: 'knowledge' }),
  };
}

export const CULTURAL_ELITE_SEED_PKG = buildCulturalEliteSeed();

/** 去重后实际条数（展示/统计口径，与种子包一致） */
export const CULTURAL_ELITE_DEDUPED_COUNT = (() => {
  const rows = CULTURAL_ELITE_SEED_PKG.rows;
  const counts = Object.fromEntries(CE_SUB_CATS.map((k) => [k, 0]));
  rows.forEach((r) => { if (counts[r.category] != null) counts[r.category] += 1; });
  return { ...counts, total: rows.length };
})();

export { CULTURAL_ELITE_META, CULTURAL_ELITE_COUNT, CULTURAL_ELITE_2026 };
