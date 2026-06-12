// ============================================================================
// 自媒体人库 · 独立数据集封装（与政要/知识精英/商业精英隔离）
// ============================================================================
import {
  SELF_MEDIA_2026,
  SELF_MEDIA_META,
  SELF_MEDIA_COUNT,
} from './figureSelfMedia2026.js';
import { enrichTalentList } from '../talent/talentEnrich.js';
import {
  SM_SUB_CATS,
  SM_TAB_LABEL,
  SM_PLATFORM_LABEL,
  SM_TIER_LABEL,
  normalizeSelfMediaCategory,
  enrichSelfMediaRow,
} from './smCategory.js';
import { isSelfMediaPrimary, normalizeSelfMediaName } from './selfMediaPrimary.js';
import { buildMigratedSelfMediaRows, MIGRATED_SELF_MEDIA_COUNT } from './selfMediaMigrate.js';

export {
  SM_SUB_CATS,
  SM_TAB_LABEL,
  SM_PLATFORM_LABEL,
  SM_TIER_LABEL,
  MIGRATED_SELF_MEDIA_COUNT,
};

export const SELF_MEDIA_DATASET_ID = SELF_MEDIA_META.id;

export const SELF_MEDIA_COLUMNS = [
  'name', 'platform', 'platformKey', 'niche', 'category', 'followers',
  'bio', 'keyWorks', 'controversies', 'tier', 'asOf', 'source', 'sources', 'notes',
  'migratedFrom', 'crossRefs',
  'verifiedAt', 'verifyTier', 'provenance', 'lastPublicActivity', 'confidence', 'publicRecordNote',
  'tags', 'keyEvents',
];

export const smKey = (r) => r.id || `${normalizeSelfMediaName(r.name)}#${normalizeSelfMediaCategory(r) || ''}`;

const SM_TIER_RANK = { S: 0, A: 1, B: 2, C: 3 };

function completeness(r) {
  return SELF_MEDIA_COLUMNS.reduce((n, k) => n + (r[k] ? 1 : 0), 0);
}

function pickBest(a, b) {
  return completeness(a) >= completeness(b) ? a : b;
}

/** @returns {{ rows: object[], dupeCount: number, rawCount: number }} */
export function dedupeSelfMedia(list) {
  const raw = list || [];
  const byName = new Map();
  const byKey = new Map();
  for (const row of raw) {
    const cat = normalizeSelfMediaCategory(row);
    if (!cat || !row.name) continue;
    const r = enrichSelfMediaRow({ ...row, category: cat });
    const k = smKey(r);
    const n = normalizeSelfMediaName(r.name);
    const prevKey = byKey.get(k);
    byKey.set(k, prevKey ? pickBest(prevKey, r) : r);
    const prevName = byName.get(n);
    if (!prevName || (SM_TIER_RANK[r.tier] ?? 9) < (SM_TIER_RANK[prevName.tier] ?? 9)) {
      byName.set(n, byKey.get(k));
    }
  }
  const rows = [...byName.values()];
  return { rows, dupeCount: raw.length - rows.length, rawCount: raw.length };
}

export function buildSelfMediaSeed() {
  const migrated = buildMigratedSelfMediaRows();
  const { rows, dupeCount, rawCount } = dedupeSelfMedia([...SELF_MEDIA_2026, ...migrated]);
  return {
    id: SELF_MEDIA_DATASET_ID,
    name: SELF_MEDIA_META.label,
    category: '自媒体人',
    source: SELF_MEDIA_META.sources.join(' / '),
    note: `${SELF_MEDIA_META.scope}。${SELF_MEDIA_META.notes}${migrated.length ? ` 自知识精英迁出 ${migrated.length} 条。` : ''}${dupeCount ? ` 种子去重：${rawCount}→${rows.length}（合并${dupeCount}条重复）。` : ''}`,
    columns: SELF_MEDIA_COLUMNS,
    rows: enrichTalentList(rows, { queue: 'selfMedia' }),
  };
}

export const SELF_MEDIA_SEED_PKG = buildSelfMediaSeed();

/** 去重后实际条数（展示/统计口径，与种子包一致） */
export const SELF_MEDIA_DEDUPED_COUNT = (() => {
  const rows = SELF_MEDIA_SEED_PKG.rows;
  const counts = Object.fromEntries(SM_SUB_CATS.map((k) => [k, 0]));
  rows.forEach((r) => { if (counts[r.category] != null) counts[r.category] += 1; });
  return { ...counts, total: rows.length, migrated: MIGRATED_SELF_MEDIA_COUNT };
})();

/** 搜索索引用：自媒体主身份姓名集合（归一化） */
export const SELF_MEDIA_INDEX_NAMES = new Set(
  SELF_MEDIA_SEED_PKG.rows.map((r) => normalizeSelfMediaName(r.name)),
);

export { SELF_MEDIA_META, SELF_MEDIA_COUNT, SELF_MEDIA_2026, isSelfMediaPrimary };
