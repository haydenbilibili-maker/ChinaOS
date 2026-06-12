// ============================================================================
// 台湾政治人物库 · 独立数据集封装（与大陆政要/异见人士/海外人才隔离）
// ============================================================================
import {
  TAIWAN_POLITICAL_2026,
  TAIWAN_POLITICAL_META,
  TAIWAN_POLITICAL_COUNT,
} from './figureTaiwanPolitical2026.js';
import { TAIWAN_POLITICAL_EXPANSION } from './talentBulkExpansion2026.js';
import { enrichTalentList } from '../talent/talentEnrich.js';
import { FIGURE_SEED } from './figureSeed.js';
import { DISSIDENT_2026 } from './figureDissident2026.js';

export const TAIWAN_POLITICAL_DATASET_ID = TAIWAN_POLITICAL_META.id;

export const TAIWAN_POLITICAL_COLUMNS = [
  'name', 'nameEn', 'region', 'category', 'party', 'role', 'term', 'status',
  'keyEvents', 'bio', 'tags', 'asOf', 'notes',
];

export const TW_REGIONS = ['tw', 'hk', 'mo'];

export const TW_REGION_LABEL = {
  tw: '台湾',
  hk: '香港',
  mo: '澳门',
};

export const TW_SUB_CATS = ['president', 'premier', 'legislature', 'party', 'local', 'diplomacy', 'executive', 'liaison', 'judiciary', 'other'];

export const TW_TAB_LABEL = {
  president: '总统/副总统',
  premier: '行政院长',
  legislature: '立法院/立法会',
  party: '政党领袖',
  local: '地方首长',
  diplomacy: '外交国防',
  executive: '特区首长/司长',
  liaison: '中央驻港',
  judiciary: '司法',
  other: '其他',
};

export const TW_PARTY_LABEL = {
  DPP: '民进党',
  KMT: '国民党',
  TPP: '台湾民众党',
  PFP: '亲民党',
  NPP: '时代力量',
  '无党籍': '无党籍',
  'KMT→本土派': '国民党→本土派',
  'DPP→无党籍': '民进党→无党籍',
};

const TW_CAT_ALIASES = {
  president: 'president', premier: 'premier', legislature: 'legislature',
  party: 'party', local: 'local', diplomacy: 'diplomacy', executive: 'executive',
  liaison: 'liaison', judiciary: 'judiciary', other: 'other',
  '总统/副总统': 'president', 行政院长: 'premier', 立法院: 'legislature',
  政党领袖: 'party', 地方首长: 'local', 外交国防: 'diplomacy',
  特区首长: 'executive', 其他: 'other',
};

/** 大陆政要 / 异见人士主身份姓名 */
const OTHER_QUEUE_NAMES = new Set([
  ...FIGURE_SEED.map((r) => (r.name || '').trim()),
  ...DISSIDENT_2026.map((r) => (r.name || '').trim()),
]);

export function normalizeName(n) {
  return (n || '').trim().replace(/\s+/g, '');
}

export function normalizeTaiwanCategory(r) {
  if (!r || !r.name) return null;
  const raw = r.category;
  if (raw && TW_CAT_ALIASES[raw]) return TW_CAT_ALIASES[raw];
  if (raw && TW_SUB_CATS.includes(raw)) return raw;
  return null;
}

const TW_CAT_RANK = Object.fromEntries(TW_SUB_CATS.map((k, i) => [k, i]));
const TW_STATUS_RANK = { 在任: 0, 卸任: 1, 已故: 2 };
const DUPE_ID_SUFFIXES = ['-premier', '-mayor', '-diplo', '-speaker', '-fm', '-shi-mai'];

function idScore(id) {
  let score = (id || '').length;
  for (const s of DUPE_ID_SUFFIXES) {
    if ((id || '').includes(s)) score += 1000;
  }
  return score;
}

function rowScore(r) {
  return [
    TW_STATUS_RANK[r.status] ?? 9,
    TW_CAT_RANK[r.category] ?? 99,
    idScore(r.id),
    -(r.bio?.length || 0),
  ];
}

function mergeKeyEvents(...lists) {
  const seen = new Set();
  const out = [];
  for (const events of lists) {
    for (const ev of events || []) {
      const key = `${ev.from}|${ev.to}|${ev.desc}`;
      if (!seen.has(key)) {
        seen.add(key);
        out.push(ev);
      }
    }
  }
  return out;
}

function mergeTags(...strs) {
  const seen = new Set();
  const parts = [];
  for (const ts of strs) {
    for (const p of (ts || '').replace(/，/g, ',').split(',')) {
      const t = p.trim();
      if (t && !seen.has(t)) {
        seen.add(t);
        parts.push(t);
      }
    }
  }
  return parts.join(',');
}

function pickBestTaiwan(a, b) {
  const sa = rowScore(a);
  const sb = rowScore(b);
  for (let i = 0; i < sa.length; i += 1) {
    if (sa[i] !== sb[i]) return sa[i] < sb[i] ? a : b;
  }
  return completeness(a) >= completeness(b) ? a : b;
}

/** 实体唯一键：canonical id 或规范化姓名 */
export const twKey = (r) => r?.id || normalizeName(r?.name);

function completeness(r) {
  return TAIWAN_POLITICAL_COLUMNS.reduce((n, k) => n + (r[k] ? 1 : 0), 0);
}

/** 排除大陆政要/异见队列主身份重复（港澳台条目亦适用） */
export function filterOtherQueueDuplicates(list) {
  return (list || []).filter((row) => {
    if (!row.name) return false;
    const n = normalizeName(row.name);
    return !OTHER_QUEUE_NAMES.has(n);
  });
}

/** @returns {{ rows: object[], dupeCount: number, rawCount: number }} */
export function dedupeTaiwanPolitical(list) {
  const raw = filterOtherQueueDuplicates(list);
  const byName = new Map();
  for (const row of raw) {
    const cat = normalizeTaiwanCategory(row);
    if (!cat || !row.name) continue;
    const r = { ...row, category: cat };
    const k = normalizeName(r.name);
    const prev = byName.get(k);
    if (!prev) {
      byName.set(k, r);
      continue;
    }
    const best = pickBestTaiwan(prev, r);
    const canonicalId = idScore(prev.id) <= idScore(r.id) ? prev.id : r.id;
    byName.set(k, {
      ...best,
      id: canonicalId,
      keyEvents: mergeKeyEvents(prev.keyEvents, r.keyEvents),
      tags: mergeTags(prev.tags, r.tags),
    });
  }
  const rows = [...byName.values()];
  return { rows, dupeCount: raw.length - rows.length, rawCount: raw.length };
}

export function buildTaiwanPoliticalSeed() {
  const { rows, dupeCount, rawCount } = dedupeTaiwanPolitical([...TAIWAN_POLITICAL_2026, ...TAIWAN_POLITICAL_EXPANSION]);
  return {
    id: TAIWAN_POLITICAL_DATASET_ID,
    name: TAIWAN_POLITICAL_META.label,
    category: '港澳台政要',
    source: TAIWAN_POLITICAL_META.sources.join(' / '),
    note: `${TAIWAN_POLITICAL_META.scope}。${TAIWAN_POLITICAL_META.notes}${dupeCount ? ` 种子去重：${rawCount}→${rows.length}（合并${dupeCount}条重复）。` : ''}`,
    columns: TAIWAN_POLITICAL_COLUMNS,
    rows: enrichTalentList(rows, { queue: 'taiwan' }),
  };
}

export const TAIWAN_POLITICAL_SEED_PKG = buildTaiwanPoliticalSeed();

export const TAIWAN_POLITICAL_DEDUPED_COUNT = (() => {
  const rows = TAIWAN_POLITICAL_SEED_PKG.rows;
  const counts = Object.fromEntries(TW_SUB_CATS.map((k) => [k, 0]));
  const regions = Object.fromEntries(TW_REGIONS.map((k) => [k, 0]));
  rows.forEach((r) => {
    if (counts[r.category] != null) counts[r.category] += 1;
    if (regions[r.region] != null) regions[r.region] += 1;
  });
  return { ...counts, ...regions, total: rows.length };
})();

export { TAIWAN_POLITICAL_META, TAIWAN_POLITICAL_COUNT, TAIWAN_POLITICAL_2026 };
