// ============================================================================
// 两院院士库 · 独立数据集封装
// ============================================================================
import {
  ACADEMICIAN_2026,
  ACADEMICIAN_META,
  ACADEMICIAN_COUNT,
} from './figureAcademician2026.js';

export const ACADEMICIAN_DATASET_ID = ACADEMICIAN_META.id;

export const ACADEMICIAN_COLUMNS = [
  'name', 'academy', 'academyCas', 'academyCae', 'field', 'institution',
  'division', 'subfield', 'works', 'decade', 'electedYear', 'region', 'source', 'notes', 'linkedId',
];

export const ACADEMY_TYPES = ['cas', 'cae', 'both'];

export function normalizeAcademyType(r) {
  if (!r || !r.name) return null;
  const a = r.academy;
  if (a && ACADEMY_TYPES.includes(a)) return a;
  if (r.academyCas && r.academyCae) return 'both';
  if (r.academyCas) return 'cas';
  if (r.academyCae) return 'cae';
  return null;
}

export const acKey = (r) => r.id || `${(r.name || '').trim()}#${normalizeAcademyType(r) || ''}`;

function completeness(r) {
  return ACADEMICIAN_COLUMNS.reduce((n, k) => n + (r[k] ? 1 : 0), 0);
}

function pickBest(a, b) {
  return completeness(a) >= completeness(b) ? a : b;
}

/** @returns {{ rows: object[], dupeCount: number, rawCount: number }} */
export function dedupeAcademician(list) {
  const raw = list || [];
  const byKey = new Map();
  for (const row of raw) {
    const type = normalizeAcademyType(row);
    if (!type || !row.name) continue;
    const r = { ...row, academy: type };
    const k = (row.name || '').trim();
    const prev = byKey.get(k);
    if (prev) {
      const cas = prev.academy === 'cas' || prev.academy === 'both' || type === 'cas' || type === 'both';
      const cae = prev.academy === 'cae' || prev.academy === 'both' || type === 'cae' || type === 'both';
      const academy = cas && cae ? 'both' : cas ? 'cas' : cae ? 'cae' : type;
      byKey.set(k, pickBest(prev, { ...r, academy, academyCas: academy === 'cas' || academy === 'both', academyCae: academy === 'cae' || academy === 'both' }));
    } else {
      byKey.set(k, r);
    }
  }
  const rows = [...byKey.values()];
  return { rows, dupeCount: raw.length - rows.length, rawCount: raw.length };
}

export function buildAcademicianSeed() {
  const { rows, dupeCount, rawCount } = dedupeAcademician(ACADEMICIAN_2026);
  return {
    id: ACADEMICIAN_DATASET_ID,
    name: ACADEMICIAN_META.label,
    category: '两院院士',
    source: ACADEMICIAN_META.sources.join(' / '),
    note: `${ACADEMICIAN_META.scope}。${ACADEMICIAN_META.notes}${dupeCount ? ` 种子去重：${rawCount}→${rows.length}（合并${dupeCount}条重复）。` : ''}`,
    columns: ACADEMICIAN_COLUMNS,
    rows,
  };
}

export const ACADEMICIAN_SEED_PKG = buildAcademicianSeed();

export const ACADEMICIAN_DEDUPED_COUNT = (() => {
  const rows = ACADEMICIAN_SEED_PKG.rows;
  const counts = { cas: 0, cae: 0, both: 0 };
  rows.forEach((r) => { if (counts[r.academy] != null) counts[r.academy] += 1; });
  return { ...counts, total: rows.length };
})();

export { ACADEMICIAN_META, ACADEMICIAN_COUNT, ACADEMICIAN_2026 };
