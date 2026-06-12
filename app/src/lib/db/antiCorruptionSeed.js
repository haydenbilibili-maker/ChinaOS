// ============================================================================
// 反腐名单 · 独立数据集封装（与人才库 figures 隔离）
// ============================================================================
import { ANTI_CORRUPTION_2026, ANTI_CORRUPTION_META, ANTI_CORRUPTION_RAW_COUNT as RAW_IN_FILE } from './figureAntiCorruption2026.js';

export const ANTI_CORRUPTION_DATASET_ID = ANTI_CORRUPTION_META.id;

export const ANTI_CORRUPTION_COLUMNS = [
  'name', 'level', 'formerRole', 'org', 'province', 'sector',
  'announcementDate', 'year', 'yearBucket', 'category', 'status', 'source', 'notes', 'caseType',
];

/** 稳定去重键：同一人合并为一条，保留首次官宣记录 */
export const acKey = (r) => `${(r.name || '').trim()}#${(r.formerRole || '').trim().slice(0, 24)}`;

function completeness(r) {
  return ANTI_CORRUPTION_COLUMNS.reduce((n, k) => n + (r[k] ? 1 : 0), 0);
}

function pickBest(a, b) {
  const da = a.announcementDate || '9999-99-99';
  const db = b.announcementDate || '9999-99-99';
  if (da !== db) return da <= db ? a : b;
  return completeness(a) >= completeness(b) ? a : b;
}

/** @returns {{ rows: object[], dupeCount: number, rawCount: number }} */
export function dedupeAntiCorruption(list) {
  const byName = new Map();
  const raw = list || [];
  for (const r of raw) {
    const k = (r.name || '').trim();
    if (!k) continue;
    const prev = byName.get(k);
    byName.set(k, prev ? pickBest(prev, r) : r);
  }
  const rows = [...byName.values()];
  return { rows, dupeCount: raw.length - rows.length, rawCount: raw.length };
}

export function buildAntiCorruptionSeed() {
  const { rows, dupeCount, rawCount } = dedupeAntiCorruption(ANTI_CORRUPTION_2026);
  return {
    id: ANTI_CORRUPTION_DATASET_ID,
    name: ANTI_CORRUPTION_META.label,
    category: '人才精英',
    source: ANTI_CORRUPTION_META.sources.join(' / '),
    note: `${ANTI_CORRUPTION_META.scope}。${ANTI_CORRUPTION_META.notes}${dupeCount ? ` 种子去重：${rawCount}→${rows.length}（合并${dupeCount}条重复）。` : ''}`,
    columns: ANTI_CORRUPTION_COLUMNS,
    rows,
  };
}

export const ANTI_CORRUPTION_SEED_PKG = buildAntiCorruptionSeed();
export const ANTI_CORRUPTION_COUNT = ANTI_CORRUPTION_SEED_PKG.rows.length;
export const ANTI_CORRUPTION_RAW_COUNT = RAW_IN_FILE ?? ANTI_CORRUPTION_2026.length;
export const ANTI_CORRUPTION_DUPE_COUNT = ANTI_CORRUPTION_RAW_COUNT - ANTI_CORRUPTION_COUNT;
export { ANTI_CORRUPTION_META, ANTI_CORRUPTION_2026 };
