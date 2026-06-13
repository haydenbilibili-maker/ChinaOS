// ============================================================================
// 中国政要种子 · 合并数据集（省级 + 中央 + 城市 + 机构扩展）
// ============================================================================
import { FIGURE_PROVINCIAL_2026, FIGURE_CATALOG_META as PROV_META, FIGURE_PROVINCIAL_COUNT as PROV_COUNT } from './figureProvincial2026.js';
import { FIGURE_PROVINCIAL_EXTENDED_2026, FIGURE_PROVINCIAL_EXTENDED_META, FIGURE_PROVINCIAL_EXTENDED_COUNT } from './figureProvincialExtended2026.js';
import { FIGURE_PROVINCIAL_STANDING_2026, FIGURE_PROVINCIAL_STANDING_META, FIGURE_PROVINCIAL_STANDING_COUNT } from './figureProvincialStanding2026.js';
import { FIGURE_CENTRAL_2026, FIGURE_CENTRAL_META, FIGURE_CENTRAL_COUNT } from './figureCentral2026.js';
import { FIGURE_CENTRAL_EXTENDED_2026, FIGURE_CENTRAL_EXTENDED_COUNT } from './figureCentralExtended2026.js';
import { FIGURE_MUNICIPAL_2026, FIGURE_MUNICIPAL_META, FIGURE_MUNICIPAL_COUNT } from './figureMunicipal2026.js';
import { FIGURE_ORG_2026, FIGURE_ORG_META, FIGURE_ORG_COUNT } from './figureOrg2026.js';
import { FIGURE_ORG_TIER2_2026, FIGURE_ORG_TIER2_META, FIGURE_ORG_TIER2_COUNT } from './figureOrgTier22026.js';
import { FIGURE_PREFECTURE_CITY_2026, FIGURE_PREFECTURE_CITY_META, FIGURE_PREFECTURE_CITY_COUNT } from './figurePrefectureCity2026.js';
import { FIGURE_MILITARY_2026, FIGURE_MILITARY_META, FIGURE_MILITARY_COUNT } from './figureMilitary2026.js';
import { FIGURE_POLITICAL_STRUCTURE_2026, FIGURE_POLITICAL_STRUCTURE_META, FIGURE_POLITICAL_STRUCTURE_COUNT } from './figurePoliticalStructure2026.js';
import { FIGURE_EXPANSION_2026 } from './figureExpansion2026.js';
import { FIGURE_MILITARY_EXPANSION_3 } from './talentBulkExpansion2026_part3.js';
import { FIGURE_EXPANSION_4, FIGURE_MILITARY_EXPANSION_4 } from './talentBulkExpansion2026_part4.js';
import { enrichTalentList } from '../talent/talentEnrich.js';

const FIGURE_SEED_BASE = [
  ...FIGURE_PROVINCIAL_2026,
  ...FIGURE_PROVINCIAL_EXTENDED_2026,
  ...FIGURE_PROVINCIAL_STANDING_2026,
  ...FIGURE_CENTRAL_2026,
  ...FIGURE_CENTRAL_EXTENDED_2026,
  ...FIGURE_POLITICAL_STRUCTURE_2026,
  ...FIGURE_MUNICIPAL_2026,
  ...FIGURE_PREFECTURE_CITY_2026,
  ...FIGURE_ORG_2026,
  ...FIGURE_ORG_TIER2_2026,
  ...FIGURE_MILITARY_2026,
  ...FIGURE_MILITARY_EXPANSION_3,
  ...FIGURE_MILITARY_EXPANSION_4,
  ...FIGURE_EXPANSION_4,
  ...FIGURE_EXPANSION_2026,
];

export const FIGURE_SEED = enrichTalentList(FIGURE_SEED_BASE, { queue: 'figures' });

export const FIGURE_CATALOG_META = {
  id: 'figures-2026-06',
  asOf: '2026-06-11',
  label: '全口径中国政要 · 2026-06',
  sources: [...new Set([
    ...PROV_META.sources,
    ...FIGURE_PROVINCIAL_EXTENDED_META.sources,
    ...FIGURE_PROVINCIAL_STANDING_META.sources,
    ...FIGURE_CENTRAL_META.sources,
    ...FIGURE_MUNICIPAL_META.sources,
    ...FIGURE_ORG_META.sources,
    ...FIGURE_ORG_TIER2_META.sources,
    ...FIGURE_PREFECTURE_CITY_META.sources,
    ...FIGURE_MILITARY_META.sources,
    ...FIGURE_POLITICAL_STRUCTURE_META.sources,
    '中国政协网', '海关总署', '国家税务总局', '证监会', '金融监管总局',
  ])],
  scope: `${PROV_META.scope}；${FIGURE_PROVINCIAL_EXTENDED_META.scope}；${FIGURE_PROVINCIAL_STANDING_META.scope}；${FIGURE_CENTRAL_META.scope}；${FIGURE_POLITICAL_STRUCTURE_META.scope}；人大政协/直属机构；${FIGURE_MUNICIPAL_META.scope}；${FIGURE_PREFECTURE_CITY_META.scope}；${FIGURE_ORG_META.scope}；${FIGURE_ORG_TIER2_META.scope}；${FIGURE_MILITARY_META.scope}`,
  notes: [PROV_META.notes, FIGURE_PROVINCIAL_EXTENDED_META.notes, FIGURE_PROVINCIAL_STANDING_META.notes, FIGURE_CENTRAL_META.notes, FIGURE_POLITICAL_STRUCTURE_META.notes, FIGURE_MUNICIPAL_META.notes, FIGURE_PREFECTURE_CITY_META.notes, FIGURE_ORG_META.notes, FIGURE_ORG_TIER2_META.notes, FIGURE_MILITARY_META.notes, '政协主席王沪宁见政治局常委'].filter(Boolean).join(' '),
  breakdown: {
    provincial: PROV_COUNT,
    provincialExtended: FIGURE_PROVINCIAL_EXTENDED_COUNT,
    provincialStanding: FIGURE_PROVINCIAL_STANDING_COUNT,
    central: FIGURE_CENTRAL_COUNT,
    extended: FIGURE_CENTRAL_EXTENDED_COUNT,
    politicalStructure: FIGURE_POLITICAL_STRUCTURE_COUNT,
    municipal: FIGURE_MUNICIPAL_COUNT,
    prefectureCity: FIGURE_PREFECTURE_CITY_COUNT,
    org: FIGURE_ORG_COUNT,
    orgTier2: FIGURE_ORG_TIER2_COUNT,
    military: FIGURE_MILITARY_COUNT,
    total: FIGURE_SEED.length,
  },
};

export { PROV_COUNT as FIGURE_PROVINCIAL_COUNT };
export const FIGURE_SEED_COUNT = FIGURE_SEED.length;
