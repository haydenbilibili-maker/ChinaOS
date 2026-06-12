// ============================================================================
// 高等教育库 · 独立数据集封装（与政治人才 / 文化精英隔离）
// ============================================================================
import {
  HIGHER_EDUCATION_2026,
  HIGHER_EDUCATION_META,
  HIGHER_EDUCATION_COUNT,
} from './figureHigherEducation2026.js';

export const HIGHER_EDUCATION_DATASET_ID = HIGHER_EDUCATION_META.id;

export const HIGHER_EDUCATION_COLUMNS = [
  'name', 'sector', 'tier', 'tags', 'type', 'region', 'discipline', 'strengths',
  'rankNotes', 'foundingYear', 'institution', 'title', 'asOf', 'source', 'notes',
];

export const HE_TIERS = ['C9', '985', '211', '双一流'];

const HE_TIER_RANK = { C9: 0, '985': 1, '211': 2, 双一流: 3 };

const HE_TIER_ALIASES = {
  C9: 'C9', '985': '985', '211': '211', 双一流: '双一流',
};

/** Parse comma-separated or array tags */
export function parseHeTags(r) {
  if (!r) return [];
  const raw = r.tags || r.tier || '';
  if (Array.isArray(raw)) return raw.filter((t) => HE_TIERS.includes(t));
  if (typeof raw === 'string' && raw.includes(',')) {
    return raw.split(',').map((t) => t.trim()).filter((t) => HE_TIERS.includes(t));
  }
  const single = HE_TIER_ALIASES[raw] || (HE_TIERS.includes(raw) ? raw : null);
  return single ? [single] : [];
}

export function primaryHeTier(tags) {
  const arr = tags || [];
  return [...arr].sort((a, b) => (HE_TIER_RANK[a] ?? 9) - (HE_TIER_RANK[b] ?? 9))[0] || '双一流';
}

export function normalizeHigherEducationTier(r) {
  if (!r || (r.id || '').startsWith('ce-')) return null;
  const tags = parseHeTags(r);
  if (tags.length) return primaryHeTier(tags);
  const raw = r.tier;
  if (raw && HE_TIER_ALIASES[raw]) return HE_TIER_ALIASES[raw];
  if (raw && HE_TIERS.includes(raw)) return raw;
  if ((r.id || '').startsWith('he-')) return raw || '双一流';
  return null;
}

export function heHasTag(r, tag) {
  return parseHeTags(r).includes(tag);
}

export const heKey = (r) => r.id || `${(r.name || '').trim()}#he`;

function completeness(r) {
  return HIGHER_EDUCATION_COLUMNS.reduce((n, k) => n + (r[k] ? 1 : 0), 0);
}

function mergeTags(a, b) {
  const set = new Set([...parseHeTags(a), ...parseHeTags(b)]);
  const tags = [...set].sort((x, y) => (HE_TIER_RANK[x] ?? 9) - (HE_TIER_RANK[y] ?? 9));
  return tags.join(',');
}

function pickBest(a, b) {
  const merged = { ...a, ...b, tags: mergeTags(a, b), tier: primaryHeTier(parseHeTags({ tags: mergeTags(a, b) })) };
  return completeness(merged) >= completeness(a) && completeness(merged) >= completeness(b) ? merged : (completeness(a) >= completeness(b) ? a : b);
}

/** @returns {{ rows: object[], dupeCount: number, rawCount: number }} */
export function dedupeHigherEducation(list) {
  const raw = list || [];
  const byKey = new Map();
  for (const row of raw) {
    if (!row.name) continue;
    const tier = normalizeHigherEducationTier(row);
    if (!tier && !(row.id || '').startsWith('he-')) continue;
    const tags = parseHeTags(row);
    const r = {
      ...row,
      sector: '高等教育',
      tags: tags.length ? tags.join(',') : (row.tags || row.tier || ''),
      tier: tier || row.tier,
    };
    const k = heKey(r);
    const prev = byKey.get(k);
    byKey.set(k, prev ? pickBest(prev, r) : r);
  }
  const rows = [...byKey.values()];
  return { rows, dupeCount: raw.length - rows.length, rawCount: raw.length };
}

export function buildHigherEducationSeed() {
  const { rows, dupeCount, rawCount } = dedupeHigherEducation(HIGHER_EDUCATION_2026);
  return {
    id: HIGHER_EDUCATION_DATASET_ID,
    name: HIGHER_EDUCATION_META.label,
    category: '高等教育',
    source: HIGHER_EDUCATION_META.sources.join(' / '),
    note: `${HIGHER_EDUCATION_META.scope}。${HIGHER_EDUCATION_META.notes}${dupeCount ? ` 种子去重：${rawCount}→${rows.length}（合并${dupeCount}条重复）。` : ''}`,
    columns: HIGHER_EDUCATION_COLUMNS,
    rows,
  };
}

export const HIGHER_EDUCATION_SEED_PKG = buildHigherEducationSeed();

export const HIGHER_EDUCATION_DEDUPED_COUNT = (() => {
  const rows = HIGHER_EDUCATION_SEED_PKG.rows;
  const counts = Object.fromEntries(HE_TIERS.map((k) => [k, 0]));
  rows.forEach((r) => {
    parseHeTags(r).forEach((t) => { if (counts[t] != null) counts[t] += 1; });
  });
  return { ...counts, total: rows.length };
})();

export { HIGHER_EDUCATION_META, HIGHER_EDUCATION_COUNT, HIGHER_EDUCATION_2026 };
