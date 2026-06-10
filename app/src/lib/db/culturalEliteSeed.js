// ============================================================================
// 文化精英库 · 独立数据集封装（与政治人才 figures 隔离）
// ============================================================================
import {
  CULTURAL_ELITE_2026,
  CULTURAL_ELITE_META,
  CULTURAL_ELITE_COUNT,
} from './figureCulturalElite2026.js';

export const CULTURAL_ELITE_DATASET_ID = CULTURAL_ELITE_META.id;

export const CULTURAL_ELITE_COLUMNS = [
  'name', 'sector', 'category', 'tier', 'region', 'discipline', 'field',
  'institution', 'title', 'works', 'strengths', 'rankNotes', 'decade', 'source', 'notes',
];

export function buildCulturalEliteSeed() {
  return {
    id: CULTURAL_ELITE_DATASET_ID,
    name: CULTURAL_ELITE_META.label,
    category: '文化精英',
    source: CULTURAL_ELITE_META.sources.join(' / '),
    note: `${CULTURAL_ELITE_META.scope}。${CULTURAL_ELITE_META.notes}`,
    columns: CULTURAL_ELITE_COLUMNS,
    rows: CULTURAL_ELITE_2026,
  };
}

export const CULTURAL_ELITE_SEED_PKG = buildCulturalEliteSeed();
export { CULTURAL_ELITE_META, CULTURAL_ELITE_COUNT, CULTURAL_ELITE_2026 };
