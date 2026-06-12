// ============================================================================
// 异见人士库 · 独立数据集封装（与政要/知识精英/商业精英/反腐透视隔离）
// ============================================================================
import {
  DISSIDENT_2026,
  DISSIDENT_META,
  DISSIDENT_COUNT,
} from './figureDissident2026.js';
import { DISSIDENT_EXPANSION } from './talentBulkExpansion2026.js';
import { enrichTalentList } from '../talent/talentEnrich.js';
import { FIGURE_SEED } from './figureSeed.js';
import { CULTURAL_ELITE_2026 } from './figureCulturalElite2026.js';
import { BUSINESS_ELITE_2026 } from './figureBusinessElite2026.js';
import { ANTI_CORRUPTION_2026 } from './figureAntiCorruption2026.js';

export const DISSIDENT_DATASET_ID = DISSIDENT_META.id;

export const DISSIDENT_COLUMNS = [
  'name', 'nameEn', 'category', 'subCategory', 'background', 'field', 'knownFor',
  'status', 'location', 'keyEvents', 'tags', 'tier', 'asOf', 'source', 'bio', 'notes',
];

export const DV_SUB_CATS = ['lawyer', 'journalist', 'writer', 'movement', 'religion', 'labor', 'online', 'exile'];

export const DV_TAB_LABEL = {
  lawyer: '维权律师',
  journalist: '记者',
  writer: '作家',
  movement: '民运',
  religion: '宗教',
  labor: '劳工',
  online: '网络异议',
  exile: '流亡海外',
};

const DV_CAT_ALIASES = {
  lawyer: 'lawyer', journalist: 'journalist', writer: 'writer', movement: 'movement',
  religion: 'religion', labor: 'labor', online: 'online', exile: 'exile',
  维权律师: 'lawyer', 记者: 'journalist', 作家: 'writer', 民运: 'movement',
  宗教: 'religion', 劳工: 'labor', 网络异议: 'online', 流亡海外: 'exile',
};

/** 其他队列主身份姓名（政要/知识精英/商业精英/反腐） */
const OTHER_QUEUE_NAMES = new Set([
  ...FIGURE_SEED.map((r) => (r.name || '').trim()),
  ...CULTURAL_ELITE_2026.map((r) => (r.name || '').trim()),
  ...BUSINESS_ELITE_2026.map((r) => (r.name || '').trim()),
  ...ANTI_CORRUPTION_2026.map((r) => (r.name || '').trim()),
]);

export function normalizeName(n) {
  return (n || '').trim().replace(/\s+/g, '');
}

export function normalizeDissidentCategory(r) {
  if (!r || !r.name) return null;
  const raw = r.subCategory || r.category;
  if (raw && DV_CAT_ALIASES[raw]) return DV_CAT_ALIASES[raw];
  if (raw && DV_SUB_CATS.includes(raw)) return raw;
  return null;
}

export const dvKey = (r) => r.id || `${normalizeName(r.name)}#${normalizeDissidentCategory(r) || ''}`;

function completeness(r) {
  return DISSIDENT_COLUMNS.reduce((n, k) => n + (r[k] ? 1 : 0), 0);
}

function pickBest(a, b) {
  return completeness(a) >= completeness(b) ? a : b;
}

/** 排除其他队列主身份重复 */
export function filterOtherQueueDuplicates(list) {
  return (list || []).filter((row) => {
    if (!row.name) return false;
    if (row.dissentPrimary) return true;
    const n = normalizeName(row.name);
    return !OTHER_QUEUE_NAMES.has(n);
  });
}

/** @returns {{ rows: object[], dupeCount: number, rawCount: number }} */
export function dedupeDissident(list) {
  const raw = filterOtherQueueDuplicates(list);
  const byKey = new Map();
  for (const row of raw) {
    const cat = normalizeDissidentCategory(row);
    if (!cat || !row.name) continue;
    const r = { ...row, category: cat };
    const k = dvKey(r);
    const prev = byKey.get(k);
    byKey.set(k, prev ? pickBest(prev, r) : r);
  }
  const rows = [...byKey.values()];
  return { rows, dupeCount: (list || []).length - rows.length, rawCount: (list || []).length };
}

export function buildDissidentSeed() {
  const { rows, dupeCount, rawCount } = dedupeDissident([...DISSIDENT_2026, ...DISSIDENT_EXPANSION]);
  return {
    id: DISSIDENT_DATASET_ID,
    name: DISSIDENT_META.label,
    category: '异见人士',
    source: DISSIDENT_META.sources.join(' / '),
    note: `${DISSIDENT_META.scope}。${DISSIDENT_META.notes}${dupeCount ? ` 种子去重：${rawCount}→${rows.length}（合并${dupeCount}条重复）。` : ''}`,
    columns: DISSIDENT_COLUMNS,
    rows: enrichTalentList(rows, { queue: 'dissident' }),
  };
}

export const DISSIDENT_SEED_PKG = buildDissidentSeed();

export const DISSIDENT_DEDUPED_COUNT = (() => {
  const rows = DISSIDENT_SEED_PKG.rows;
  const counts = Object.fromEntries(DV_SUB_CATS.map((k) => [k, 0]));
  rows.forEach((r) => { if (counts[r.category] != null) counts[r.category] += 1; });
  return { ...counts, total: rows.length };
})();

export { DISSIDENT_META, DISSIDENT_COUNT, DISSIDENT_2026 };
