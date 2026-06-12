// ============================================================================
// 科研院所库 · 独立数据集封装
// ============================================================================
import {
  RESEARCH_INSTITUTE_2026,
  RESEARCH_INSTITUTE_META,
  RESEARCH_INSTITUTE_COUNT,
} from './figureResearchInstitute2026.js';

export const RESEARCH_INSTITUTE_DATASET_ID = RESEARCH_INSTITUTE_META.id;

export const RESEARCH_INSTITUTE_COLUMNS = [
  'name', 'type', 'field', 'province', 'tier', 'keyLabs', 'parentCompany', 'founded', 'scale', 'tags', 'asOf', 'source', 'notes',
];

export const RI_STATE_TYPES = ['中科院', '工程院', '部属', '行业'];
export const RI_FACILITY_TYPE = '大科学装置';
export const RI_TYPES = [...RI_STATE_TYPES, '民企科研', RI_FACILITY_TYPE];

export function normalizeResearchInstituteType(r) {
  if (!r || !r.name) return null;
  const raw = r.type;
  if (raw && RI_TYPES.includes(raw)) return raw;
  return null;
}

export const riKey = (r) => r.id || `${(r.name || '').trim()}#ri`;

function completeness(r) {
  return RESEARCH_INSTITUTE_COLUMNS.reduce((n, k) => n + (r[k] ? 1 : 0), 0);
}

function pickBest(a, b) {
  return completeness(a) >= completeness(b) ? a : b;
}

/** @returns {{ rows: object[], dupeCount: number, rawCount: number }} */
export function dedupeResearchInstitute(list) {
  const raw = list || [];
  const byKey = new Map();
  for (const row of raw) {
    const type = normalizeResearchInstituteType(row);
    if (!type || !row.name) continue;
    const r = { ...row, type };
    const k = riKey(r);
    const prev = byKey.get(k);
    byKey.set(k, prev ? pickBest(prev, r) : r);
  }
  const rows = [...byKey.values()];
  return { rows, dupeCount: raw.length - rows.length, rawCount: raw.length };
}

export function buildResearchInstituteSeed() {
  const { rows, dupeCount, rawCount } = dedupeResearchInstitute(RESEARCH_INSTITUTE_2026);
  return {
    id: RESEARCH_INSTITUTE_DATASET_ID,
    name: RESEARCH_INSTITUTE_META.label,
    category: '科研院所',
    source: RESEARCH_INSTITUTE_META.sources.join(' / '),
    note: `${RESEARCH_INSTITUTE_META.scope}。${RESEARCH_INSTITUTE_META.notes}${dupeCount ? ` 种子去重：${rawCount}→${rows.length}（合并${dupeCount}条重复）。` : ''}`,
    columns: RESEARCH_INSTITUTE_COLUMNS,
    rows,
  };
}

export const RESEARCH_INSTITUTE_SEED_PKG = buildResearchInstituteSeed();

export const RESEARCH_INSTITUTE_DEDUPED_COUNT = (() => {
  const rows = RESEARCH_INSTITUTE_SEED_PKG.rows;
  const counts = Object.fromEntries(RI_TYPES.map((k) => [k, 0]));
  rows.forEach((r) => { if (counts[r.type] != null) counts[r.type] += 1; });
  return { ...counts, total: rows.length };
})();

export { RESEARCH_INSTITUTE_META, RESEARCH_INSTITUTE_COUNT, RESEARCH_INSTITUTE_2026 };
