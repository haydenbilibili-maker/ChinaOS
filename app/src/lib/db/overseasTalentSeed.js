// ============================================================================
// 海外人才库 · 独立数据集封装（与政治人才 / 境内精英队列隔离）
// ============================================================================
import {
  OVERSEAS_TALENT_2026,
  OVERSEAS_TALENT_META,
  OVERSEAS_TALENT_COUNT,
} from './figureOverseasTalent2026.js';
import { OVERSEAS_TALENT_EXPANSION } from './talentBulkExpansion2026.js';
import { OVERSEAS_TALENT_EXPANSION_2 } from './talentBulkExpansion2026_part2.js';
import { OVERSEAS_TALENT_EXPANSION_4 } from './talentBulkExpansion2026_part4.js';
import { enrichTalentList } from '../talent/talentEnrich.js';
import { CULTURAL_ELITE_2026 } from './figureCulturalElite2026.js';
import { BUSINESS_ELITE_2026 } from './figureBusinessElite2026.js';

export const OVERSEAS_TALENT_DATASET_ID = OVERSEAS_TALENT_META.id;

export const OVERSEAS_TALENT_COLUMNS = [
  'name', 'nameEn', 'category', 'nationality', 'baseCountry', 'region',
  'institution', 'role', 'field', 'bio', 'tags', 'tier', 'asOf', 'source', 'notes',
];

export const OT_SUB_CATS = ['knowledge', 'tech', 'industry', 'culture', 'academic'];

export const OT_TAB_LABEL = {
  knowledge: '知识学术',
  tech: '工程技术',
  industry: '产业资本',
  culture: '文化艺术',
  academic: '游学研修',
};

const OT_CAT_ALIASES = {
  knowledge: 'knowledge', tech: 'tech', industry: 'industry', culture: 'culture', academic: 'academic',
  知识学术: 'knowledge', 工程技术: 'tech', 产业资本: 'industry', 文化艺术: 'culture', 游学研修: 'academic',
};

/** 境内主身份姓名（知识/商业精英库中不以海外驻留为主者） */
const DOMESTIC_PRIMARY = new Set([
  ...CULTURAL_ELITE_2026.filter((r) => !r.notes?.includes('海外') && !r.notes?.includes('华裔')).map((r) => (r.name || '').trim()),
  ...BUSINESS_ELITE_2026.map((r) => (r.name || '').trim()),
]);

export function normalizeName(n) {
  return (n || '').trim().replace(/\s+/g, '');
}

export function normalizeOverseasCategory(r) {
  if (!r || !r.name) return null;
  const id = r.id || '';
  if (!id.startsWith('ot-')) {
    const raw = r.subCategory || r.category;
    if (raw && OT_CAT_ALIASES[raw]) return OT_CAT_ALIASES[raw];
  }
  const raw = r.category;
  if (raw && OT_CAT_ALIASES[raw]) return OT_CAT_ALIASES[raw];
  if (raw && OT_SUB_CATS.includes(raw)) return raw;
  return null;
}

export const otKey = (r) => r.id || `${normalizeName(r.name)}#${normalizeOverseasCategory(r) || ''}`;

function completeness(r) {
  return OVERSEAS_TALENT_COLUMNS.reduce((n, k) => n + (r[k] ? 1 : 0), 0);
}

function pickBest(a, b) {
  return completeness(a) >= completeness(b) ? a : b;
}

/** 排除境内主身份重复（海外主身份保留并标注交叉引用） */
export function filterDomesticDuplicates(list) {
  return (list || []).filter((row) => {
    if (!row.name) return false;
    if (row.overseasPrimary) return true;
    const n = normalizeName(row.name);
    return !DOMESTIC_PRIMARY.has(n);
  });
}

/** @returns {{ rows: object[], dupeCount: number, rawCount: number }} */
export function dedupeOverseasTalent(list) {
  const raw = filterDomesticDuplicates(list);
  const byKey = new Map();
  for (const row of raw) {
    const cat = normalizeOverseasCategory(row);
    if (!cat || !row.name) continue;
    const r = { ...row, category: cat };
    const k = otKey(r);
    const prev = byKey.get(k);
    byKey.set(k, prev ? pickBest(prev, r) : r);
  }
  const rows = [...byKey.values()];
  return { rows, dupeCount: (list || []).length - rows.length, rawCount: (list || []).length };
}

export function buildOverseasTalentSeed() {
  const { rows, dupeCount, rawCount } = dedupeOverseasTalent([...OVERSEAS_TALENT_2026, ...OVERSEAS_TALENT_EXPANSION, ...OVERSEAS_TALENT_EXPANSION_2, ...OVERSEAS_TALENT_EXPANSION_4]);
  return {
    id: OVERSEAS_TALENT_DATASET_ID,
    name: OVERSEAS_TALENT_META.label,
    category: '海外人才',
    source: OVERSEAS_TALENT_META.sources.join(' / '),
    note: `${OVERSEAS_TALENT_META.scope}。${OVERSEAS_TALENT_META.notes}${dupeCount ? ` 种子去重：${rawCount}→${rows.length}（合并${dupeCount}条重复）。` : ''}`,
    columns: OVERSEAS_TALENT_COLUMNS,
    rows: enrichTalentList(rows, { queue: 'overseas' }),
  };
}

export const OVERSEAS_TALENT_SEED_PKG = buildOverseasTalentSeed();

/** 去重后实际条数（展示/统计口径，与种子包一致） */
export const OVERSEAS_TALENT_DEDUPED_COUNT = (() => {
  const rows = OVERSEAS_TALENT_SEED_PKG.rows;
  const counts = Object.fromEntries(OT_SUB_CATS.map((k) => [k, 0]));
  rows.forEach((r) => { if (counts[r.category] != null) counts[r.category] += 1; });
  return { ...counts, total: rows.length };
})();

export { OVERSEAS_TALENT_META, OVERSEAS_TALENT_COUNT, OVERSEAS_TALENT_2026 };
