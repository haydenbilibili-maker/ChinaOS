// ============================================================================
// 外交人才库 · 独立数据集封装（与政要/海外人才/知识精英队列隔离）
// ============================================================================
import {
  DIPLOMATIC_CORPS_2026,
  DIPLOMATIC_CORPS_META,
  DIPLOMATIC_CORPS_COUNT,
} from './figureDiplomaticCorps2026.js';
import { enrichTalentList } from '../talent/talentEnrich.js';
import { FIGURE_SEED } from './figureSeed.js';

export const DIPLOMATIC_CORPS_DATASET_ID = DIPLOMATIC_CORPS_META.id;

export const DIPLOMATIC_CORPS_COLUMNS = [
  'name', 'nameEn', 'gender', 'role', 'hostCountry', 'hostCity', 'region',
  'appointedDate', 'credentialsDate', 'previousPosts', 'careerHighlights',
  'rank', 'lat', 'lng', 'asOf', 'source', 'verifyTier', 'provenance', 'notes',
];

export const DC_REGIONS = ['亚太', '欧洲', '北美', '拉美', '非洲', '中东', '国际组织'];

export const DC_REGION_LABEL = Object.fromEntries(DC_REGIONS.map((r) => [r, r]));

export const DC_ROLE_TYPES = ['大使', '特命全权大使', '公使', '总领事', '公署特派员', '常驻代表', '驻欧盟使团团长', '代表', '办事处主任'];

export const DC_TAB_LABEL = {
  亚太: '亚太',
  欧洲: '欧洲',
  北美: '北美',
  拉美: '拉美',
  非洲: '非洲',
  中东: '中东',
  国际组织: '国际组织',
};

/** 境内主职（外交部长等）保留在中国政要队列 */
const DOMESTIC_PRIMARY = new Set(
  FIGURE_SEED.filter((f) => f.role === '外交部长' || f.org === '外交部' && f.level === '副国级')
    .map((f) => (f.name || '').trim()),
);

export function normalizeName(n) {
  return (n || '').trim().replace(/\s+/g, '');
}

export const dcKey = (r) => r.id || `${normalizeName(r.name)}#${r.hostCountry || ''}#${r.role || ''}`;

function completeness(r) {
  return DIPLOMATIC_CORPS_COLUMNS.reduce((n, k) => n + (r[k] ? 1 : 0), 0);
}

function pickBest(a, b) {
  return completeness(a) >= completeness(b) ? a : b;
}

export function filterDomesticDuplicates(list) {
  return (list || []).filter((row) => {
    if (!row.name) return false;
    if (row.diplomaticPrimary) return true;
    return !DOMESTIC_PRIMARY.has(normalizeName(row.name));
  });
}

/** @returns {{ rows: object[], dupeCount: number, rawCount: number }} */
export function dedupeDiplomaticCorps(list) {
  const raw = filterDomesticDuplicates(list);
  const byKey = new Map();
  for (const row of raw) {
    if (!row.name || !row.region) continue;
    const k = dcKey(row);
    const prev = byKey.get(k);
    byKey.set(k, prev ? pickBest(prev, row) : row);
  }
  const rows = [...byKey.values()];
  return { rows, dupeCount: (list || []).length - rows.length, rawCount: (list || []).length };
}

export function buildDiplomaticCorpsSeed() {
  const { rows, dupeCount, rawCount } = dedupeDiplomaticCorps(DIPLOMATIC_CORPS_2026);
  return {
    id: DIPLOMATIC_CORPS_DATASET_ID,
    name: DIPLOMATIC_CORPS_META.label,
    category: '外交人才',
    source: DIPLOMATIC_CORPS_META.sources.join(' / '),
    note: `${DIPLOMATIC_CORPS_META.scope}。${DIPLOMATIC_CORPS_META.notes}${dupeCount ? ` 种子去重：${rawCount}→${rows.length}（合并${dupeCount}条重复）。` : ''}`,
    columns: DIPLOMATIC_CORPS_COLUMNS,
    rows: enrichTalentList(rows, { queue: 'diplomatic' }),
  };
}

export const DIPLOMATIC_CORPS_SEED_PKG = buildDiplomaticCorpsSeed();

export const DIPLOMATIC_CORPS_DEDUPED_COUNT = (() => {
  const rows = DIPLOMATIC_CORPS_SEED_PKG.rows;
  const counts = Object.fromEntries(DC_REGIONS.map((k) => [k, 0]));
  rows.forEach((r) => { if (counts[r.region] != null) counts[r.region] += 1; });
  return { ...counts, total: rows.length };
})();

export { DIPLOMATIC_CORPS_META, DIPLOMATIC_CORPS_COUNT, DIPLOMATIC_CORPS_2026 };
