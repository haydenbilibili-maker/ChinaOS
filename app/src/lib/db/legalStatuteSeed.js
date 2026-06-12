// ============================================================================
// 法律条文库 · 独立数据集封装
// ============================================================================
import {
  LEGAL_STATUTE_2026,
  LEGAL_STATUTE_META,
  LEGAL_STATUTE_COUNT,
  LS_TYPE_MAP,
  LS_DOMAINS,
} from './figureLegalStatute2026.js';

export const LEGAL_STATUTE_DATASET_ID = LEGAL_STATUTE_META.id;

export const LEGAL_STATUTE_COLUMNS = [
  'id', 'title', 'type', 'issuer', 'effectiveDate', 'revisedDate', 'status',
  'domain', 'summary', 'keyArticles', 'relatedPolicyLinks', 'body', 'bodyTier', 'sourceUrl', 'asOf',
];

export const LS_TYPES = Object.keys(LS_TYPE_MAP);

export function lsKey(r) {
  return r?.id || `${(r?.title || '').trim()}#ls`;
}

export function normalizeLegalStatuteType(r) {
  if (!r?.title) return null;
  if (r.type && LS_TYPES.includes(r.type)) return r.type;
  return null;
}

function completeness(r) {
  return LEGAL_STATUTE_COLUMNS.reduce((n, k) => n + (r[k] ? 1 : 0), 0);
}

function pickBest(a, b) {
  return completeness(a) >= completeness(b) ? a : b;
}

/** @returns {{ rows: object[], dupeCount: number, rawCount: number }} */
export function dedupeLegalStatute(list) {
  const raw = list || [];
  const byKey = new Map();
  for (const row of raw) {
    const type = normalizeLegalStatuteType(row);
    if (!type || !row.title) continue;
    const r = { ...row, type };
    const k = lsKey(r);
    const prev = byKey.get(k);
    byKey.set(k, prev ? pickBest(prev, r) : r);
  }
  const rows = [...byKey.values()];
  return { rows, dupeCount: raw.length - rows.length, rawCount: raw.length };
}

export function buildLegalStatuteSeed() {
  const { rows, dupeCount, rawCount } = dedupeLegalStatute(LEGAL_STATUTE_2026);
  return {
    id: LEGAL_STATUTE_DATASET_ID,
    name: LEGAL_STATUTE_META.label,
    category: '法律条文',
    source: LEGAL_STATUTE_META.sources.join(' / '),
    note: `${LEGAL_STATUTE_META.scope.replace('{law}', String(LEGAL_STATUTE_COUNT.law)).replace('{admin}', String(LEGAL_STATUTE_COUNT.admin_regulation)).replace('{ji}', String(LEGAL_STATUTE_COUNT.judicial_interpretation)).replace('{domain}', String(Object.keys(LEGAL_STATUTE_COUNT.byDomain).length))}。${LEGAL_STATUTE_META.notes.replace('{as_of}', LEGAL_STATUTE_META.asOf)}${dupeCount ? ` 种子去重：${rawCount}→${rows.length}（合并${dupeCount}条重复）。` : ''}`,
    columns: LEGAL_STATUTE_COLUMNS,
    rows,
  };
}

export const LEGAL_STATUTE_SEED_PKG = buildLegalStatuteSeed();

export const LEGAL_STATUTE_DEDUPED_COUNT = (() => {
  const rows = LEGAL_STATUTE_SEED_PKG.rows;
  const counts = Object.fromEntries(LS_TYPES.map((k) => [k, 0]));
  const byDomain = Object.fromEntries(LS_DOMAINS.map((d) => [d, 0]));
  rows.forEach((r) => {
    if (counts[r.type] != null) counts[r.type] += 1;
    (r.domain || []).forEach((d) => { if (byDomain[d] != null) byDomain[d] += 1; });
  });
  return { ...counts, byDomain, total: rows.length };
})();

export {
  LEGAL_STATUTE_META,
  LEGAL_STATUTE_COUNT,
  LEGAL_STATUTE_2026,
  LS_TYPE_MAP,
  LS_DOMAINS,
};
