// ============================================================================
// 公开履历种子 · 合并数据集（省级 + 中央部委 + 人大政协 + 直属机构）
// ============================================================================
import { FIGURE_PROVINCIAL_2026, FIGURE_CATALOG_META as PROV_META, FIGURE_PROVINCIAL_COUNT as PROV_COUNT } from './figureProvincial2026.js';
import { FIGURE_CENTRAL_2026, FIGURE_CENTRAL_META, FIGURE_CENTRAL_COUNT } from './figureCentral2026.js';
import { FIGURE_CENTRAL_EXTENDED_2026, FIGURE_CENTRAL_EXTENDED_COUNT } from './figureCentralExtended2026.js';

export const FIGURE_SEED = [
  ...FIGURE_PROVINCIAL_2026,
  ...FIGURE_CENTRAL_2026,
  ...FIGURE_CENTRAL_EXTENDED_2026,
];

export const FIGURE_CATALOG_META = {
  id: 'figures-2026-06',
  asOf: '2026-06-11',
  label: '全口径公开履历 · 2026-06',
  sources: [...new Set([...PROV_META.sources, ...FIGURE_CENTRAL_META.sources, '中国政协网', '海关总署', '国家税务总局'])],
  scope: `${PROV_META.scope}；${FIGURE_CENTRAL_META.scope}；人大副委员长13人+秘书长、政协副主席22人+秘书长、国务院直属机构10家`,
  notes: [PROV_META.notes, FIGURE_CENTRAL_META.notes, '政协主席王沪宁见政治局常委条目；石泰峰、李鸿忠已录入中央库'].filter(Boolean).join(' '),
  breakdown: {
    provincial: PROV_COUNT,
    central: FIGURE_CENTRAL_COUNT,
    extended: FIGURE_CENTRAL_EXTENDED_COUNT,
    total: FIGURE_SEED.length,
  },
};

export { PROV_COUNT as FIGURE_PROVINCIAL_COUNT };
export const FIGURE_SEED_COUNT = FIGURE_SEED.length;
