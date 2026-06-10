// ============================================================================
// 商业精英库 · 独立数据集封装（与政治人才 figures / 文化精英隔离）
// ============================================================================
import {
  BUSINESS_ELITE_2026,
  BUSINESS_ELITE_META,
  BUSINESS_ELITE_COUNT,
} from './figureBusinessElite2026.js';

export const BUSINESS_ELITE_DATASET_ID = BUSINESS_ELITE_META.id;

export const BUSINESS_ELITE_COLUMNS = [
  'name', 'sector', 'category', 'industry', 'company', 'province', 'title',
  'achievements', 'honors', 'background', 'asOf', 'source', 'notes',
];

export function buildBusinessEliteSeed() {
  return {
    id: BUSINESS_ELITE_DATASET_ID,
    name: BUSINESS_ELITE_META.label,
    category: '商业精英',
    source: BUSINESS_ELITE_META.sources.join(' / '),
    note: `${BUSINESS_ELITE_META.scope}。${BUSINESS_ELITE_META.notes}`,
    columns: BUSINESS_ELITE_COLUMNS,
    rows: BUSINESS_ELITE_2026,
  };
}

export const BUSINESS_ELITE_SEED_PKG = buildBusinessEliteSeed();
export { BUSINESS_ELITE_META, BUSINESS_ELITE_COUNT, BUSINESS_ELITE_2026 };
