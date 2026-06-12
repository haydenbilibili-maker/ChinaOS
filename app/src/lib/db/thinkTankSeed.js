// ============================================================================
// 顶级智库库 · 独立数据集封装
// ============================================================================
import {
  THINK_TANK_2026,
  THINK_TANK_META,
  THINK_TANK_COUNT,
} from './figureThinkTank2026.js';
import { THINK_TANK_EXPANSION } from './talentBulkExpansion2026.js';
import { enrichTalentList } from '../talent/talentEnrich.js';

export const THINK_TANK_DATASET_ID = THINK_TANK_META.id;

export const THINK_TANK_COLUMNS = [
  'name', 'type', 'affiliation', 'province', 'focusAreas', 'tier', 'honors', 'asOf', 'source', 'notes',
];

export const TT_TYPES = ['国家级智库', '高校智库', '社会智库', '部委智库'];

export function normalizeThinkTankType(r) {
  if (!r || !r.name) return null;
  const raw = r.type;
  if (raw && TT_TYPES.includes(raw)) return raw;
  return null;
}

export const ttKey = (r) => r.id || `${(r.name || '').trim()}#tt`;

function completeness(r) {
  return THINK_TANK_COLUMNS.reduce((n, k) => n + (r[k] ? 1 : 0), 0);
}

function pickBest(a, b) {
  return completeness(a) >= completeness(b) ? a : b;
}

/** @returns {{ rows: object[], dupeCount: number, rawCount: number }} */
export function dedupeThinkTank(list) {
  const raw = list || [];
  const byKey = new Map();
  for (const row of raw) {
    const type = normalizeThinkTankType(row);
    if (!type || !row.name) continue;
    const r = { ...row, type };
    const k = ttKey(r);
    const prev = byKey.get(k);
    byKey.set(k, prev ? pickBest(prev, r) : r);
  }
  const rows = [...byKey.values()];
  return { rows, dupeCount: raw.length - rows.length, rawCount: raw.length };
}

export function buildThinkTankSeed() {
  const { rows, dupeCount, rawCount } = dedupeThinkTank([...THINK_TANK_2026, ...THINK_TANK_EXPANSION]);
  return {
    id: THINK_TANK_DATASET_ID,
    name: THINK_TANK_META.label,
    category: '顶级智库',
    source: THINK_TANK_META.sources.join(' / '),
    note: `${THINK_TANK_META.scope}。${THINK_TANK_META.notes}${dupeCount ? ` 种子去重：${rawCount}→${rows.length}（合并${dupeCount}条重复）。` : ''}`,
    columns: THINK_TANK_COLUMNS,
    rows: enrichTalentList(rows, { queue: 'thinktank' }),
  };
}

export const THINK_TANK_SEED_PKG = buildThinkTankSeed();

export const THINK_TANK_DEDUPED_COUNT = (() => {
  const rows = THINK_TANK_SEED_PKG.rows;
  const counts = Object.fromEntries(TT_TYPES.map((k) => [k, 0]));
  rows.forEach((r) => { if (counts[r.type] != null) counts[r.type] += 1; });
  return { ...counts, total: rows.length };
})();

export { THINK_TANK_META, THINK_TANK_COUNT, THINK_TANK_2026 };
