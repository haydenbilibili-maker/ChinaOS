// ============================================================================
// 公开履历种子 · 合并数据集（省级 + 中央 + 城市 + 机构扩展）
// ============================================================================
import { FIGURE_PROVINCIAL_2026, FIGURE_CATALOG_META as PROV_META, FIGURE_PROVINCIAL_COUNT as PROV_COUNT } from './figureProvincial2026.js';
import { FIGURE_CENTRAL_2026, FIGURE_CENTRAL_META, FIGURE_CENTRAL_COUNT } from './figureCentral2026.js';
import { FIGURE_CENTRAL_EXTENDED_2026, FIGURE_CENTRAL_EXTENDED_COUNT } from './figureCentralExtended2026.js';
import { FIGURE_MUNICIPAL_2026, FIGURE_MUNICIPAL_META, FIGURE_MUNICIPAL_COUNT } from './figureMunicipal2026.js';
import { FIGURE_ORG_2026, FIGURE_ORG_META, FIGURE_ORG_COUNT } from './figureOrg2026.js';
import { FIGURE_ORG_TIER2_2026, FIGURE_ORG_TIER2_META, FIGURE_ORG_TIER2_COUNT } from './figureOrgTier22026.js';
import { FIGURE_PREFECTURE_CITY_2026, FIGURE_PREFECTURE_CITY_META, FIGURE_PREFECTURE_CITY_COUNT } from './figurePrefectureCity2026.js';

export const FIGURE_SEED = [
  ...FIGURE_PROVINCIAL_2026,
  ...FIGURE_CENTRAL_2026,
  ...FIGURE_CENTRAL_EXTENDED_2026,
  ...FIGURE_MUNICIPAL_2026,
  ...FIGURE_PREFECTURE_CITY_2026,
  ...FIGURE_ORG_2026,
  ...FIGURE_ORG_TIER2_2026,
];

export const FIGURE_CATALOG_META = {
  id: 'figures-2026-06',
  asOf: '2026-06-11',
  label: '全口径公开履历 · 2026-06',
  sources: [...new Set([
    ...PROV_META.sources,
    ...FIGURE_CENTRAL_META.sources,
    ...FIGURE_MUNICIPAL_META.sources,
    ...FIGURE_ORG_META.sources,
    ...FIGURE_ORG_TIER2_META.sources,
    ...FIGURE_PREFECTURE_CITY_META.sources,
    '中国政协网', '海关总署', '国家税务总局', '证监会', '金融监管总局',
  ])],
  scope: `${PROV_META.scope}；${FIGURE_CENTRAL_META.scope}；人大政协/直属机构；${FIGURE_MUNICIPAL_META.scope}；${FIGURE_PREFECTURE_CITY_META.scope}；${FIGURE_ORG_META.scope}；${FIGURE_ORG_TIER2_META.scope}`,
  notes: [PROV_META.notes, FIGURE_CENTRAL_META.notes, FIGURE_MUNICIPAL_META.notes, FIGURE_PREFECTURE_CITY_META.notes, FIGURE_ORG_META.notes, FIGURE_ORG_TIER2_META.notes, '政协主席王沪宁见政治局常委'].filter(Boolean).join(' '),
  breakdown: {
    provincial: PROV_COUNT,
    central: FIGURE_CENTRAL_COUNT,
    extended: FIGURE_CENTRAL_EXTENDED_COUNT,
    municipal: FIGURE_MUNICIPAL_COUNT,
    prefectureCity: FIGURE_PREFECTURE_CITY_COUNT,
    org: FIGURE_ORG_COUNT,
    orgTier2: FIGURE_ORG_TIER2_COUNT,
    total: FIGURE_SEED.length,
  },
};

export { PROV_COUNT as FIGURE_PROVINCIAL_COUNT };
export const FIGURE_SEED_COUNT = FIGURE_SEED.length;
