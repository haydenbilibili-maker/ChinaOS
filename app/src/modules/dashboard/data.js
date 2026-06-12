// ============================================================================
// China OS · 看板数据聚合层
// ----------------------------------------------------------------------------
// 以「种子计数」为唯一真相来源（不依赖 IndexedDB 是否已载入），
// 汇总各数据集规模、人才分层、反腐趋势、500强省份、军衔结构、模块覆盖。
// 所有口径均为公开资料整理与估算示意，详见各数据集 META。
// ============================================================================
import { GROUPS, MODULES } from '../../app/registry.js';
import { FIGURE_CATALOG_META, FIGURE_SEED_COUNT } from '../../lib/db/figureSeed.js';
import { ANTI_CORRUPTION_COUNT, ANTI_CORRUPTION_SEED_PKG } from '../../lib/db/antiCorruptionSeed.js';
import { CULTURAL_ELITE_DEDUPED_COUNT } from '../../lib/db/culturalEliteSeed.js';
import { BUSINESS_ELITE_DEDUPED_COUNT } from '../../lib/db/businessEliteSeed.js';
import { HIGHER_EDUCATION_DEDUPED_COUNT } from '../../lib/db/higherEducationSeed.js';
import { RESEARCH_INSTITUTE_DEDUPED_COUNT } from '../../lib/db/researchInstituteSeed.js';
import { OVERSEAS_TALENT_DEDUPED_COUNT } from '../../lib/db/overseasTalentSeed.js';
import { SELF_MEDIA_DEDUPED_COUNT } from '../../lib/db/selfMediaSeed.js';
import { DOC_CATALOG_META } from '../../lib/db/docSeed.js';
import { LEGAL_STATUTE_DEDUPED_COUNT } from '../../lib/db/legalStatuteSeed.js';
import { PRIVATE_ENTERPRISE_META, PE500_COMPANIES, PE500_DATASETS } from '../../lib/db/privateEnterpriseSeed.js';
import { RANK_PYRAMID, MILITARY_INTEL_META } from '../../lib/db/militaryIntel2026.js';
import { AS_OF_BASELINE } from '../../lib/config/asOfBaseline.js';

export const AS_OF = AS_OF_BASELINE;

// ── 基础计数 ──────────────────────────────────────────────
const HOME_GROUP = 'home';
export const TOPIC_MODULES = MODULES.filter((m) => m.group !== HOME_GROUP);
export const MODULE_COUNT = TOPIC_MODULES.length;
export const GROUP_COUNT = GROUPS.filter((g) => g.id !== HOME_GROUP).length;

const PE_PEOPLE = PE500_DATASETS.people?.rows?.length || 0;
const PE_EQUITY = PE500_DATASETS.equity?.rows?.length || 0;
const PE_COMPANIES = PE500_COMPANIES.length;

// 人物画像总条目（中国政要 + 反腐 + 知识精英 + 商业 + 500强人物）
export const ENTRY_TOTAL =
  FIGURE_SEED_COUNT +
  ANTI_CORRUPTION_COUNT +
  CULTURAL_ELITE_DEDUPED_COUNT.total +
  BUSINESS_ELITE_DEDUPED_COUNT.total +
  PE_COMPANIES +
  PE_PEOPLE +
  PE_EQUITY;

// ── 数据集规模对比（横向条形）─────────────────────────────
export const DATASET_SCALE = [
  { key: '中国政要', value: FIGURE_SEED_COUNT, to: '/talent', color: '#22d3ee' },
  { key: '知识精英', value: CULTURAL_ELITE_DEDUPED_COUNT.total, to: '/talent?tab=knowledge', color: '#f0abfc' },
  { key: '政策文件', value: DOC_CATALOG_META.total, to: '/policydocs', color: '#ef4444' },
  { key: '法律条文', value: LEGAL_STATUTE_DEDUPED_COUNT.total, to: '/policydocs?tab=legal', color: '#8b5cf6' },
  { key: '民企500强', value: PE_COMPANIES, to: '/enterprise500', color: '#fb923c' },
  { key: '反腐名单', value: ANTI_CORRUPTION_COUNT, to: '/talent?tab=anticorruption', color: '#c41e3a' },
  { key: '商业精英', value: BUSINESS_ELITE_DEDUPED_COUNT.total, to: '/talent?tab=business', color: '#d4af37' },
  { key: '科研院所', value: RESEARCH_INSTITUTE_DEDUPED_COUNT.total, to: '/talent?tab=research', color: '#a78bfa' },
  { key: '高等教育', value: HIGHER_EDUCATION_DEDUPED_COUNT.total, to: '/talent?tab=education', color: '#10b981' },
  { key: '海外人才', value: OVERSEAS_TALENT_DEDUPED_COUNT.total, to: '/talent?tab=overseas', color: '#0ea5e9' },
  { key: '自媒体人', value: SELF_MEDIA_DEDUPED_COUNT.total, to: '/talent?tab=self-media', color: '#f472b6' },
  { key: '500强股权', value: PE_EQUITY, to: '/enterprise500', color: '#64748b' },
].sort((a, b) => b.value - a.value);

// ── 人才库分层构成（环形）─────────────────────────────────
const bd = FIGURE_CATALOG_META.breakdown || {};
export const TALENT_LAYERS = [
  { name: '省级班子', value: (bd.provincial || 0) + (bd.provincialExtended || 0) + (bd.provincialStanding || 0), color: '#c41e3a' },
  { name: '中央国家机关', value: (bd.central || 0) + (bd.extended || 0), color: '#e8a317' },
  { name: '地级市', value: (bd.municipal || 0) + (bd.prefectureCity || 0), color: '#22d3ee' },
  { name: '直属机构', value: (bd.org || 0) + (bd.orgTier2 || 0), color: '#8b5cf6' },
  { name: '军事将领', value: bd.military || 0, color: '#10b981' },
].filter((d) => d.value > 0);

// ── 反腐历年趋势（按年计数，2012 起）──────────────────────
export const ANTICORRUPTION_TREND = (() => {
  const tally = new Map();
  for (const r of ANTI_CORRUPTION_SEED_PKG.rows) {
    const y = +(r.year || 0);
    if (y >= 2012) tally.set(y, (tally.get(y) || 0) + 1);
  }
  const years = [...tally.keys()].sort((a, b) => a - b);
  return {
    years: years.map(String),
    values: years.map((y) => tally.get(y)),
  };
})();

// ── 民企500强省份分布（Top 12）────────────────────────────
export const PE500_PROVINCES = (() => {
  const tally = new Map();
  for (const c of PE500_COMPANIES) {
    const p = (c.province || '其他').replace(/省|市|自治区|壮族|回族|维吾尔|（.*?）/g, '') || '其他';
    tally.set(p, (tally.get(p) || 0) + 1);
  }
  return [...tally.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 12)
    .map(([name, value]) => ({ name, value }));
})();

// ── 军衔结构（漏斗 · 对数量级）────────────────────────────
export const RANK_STRUCTURE = {
  note: RANK_PYRAMID.note,
  asOf: RANK_PYRAMID.asOf,
  levels: RANK_PYRAMID.levels.map((l) => ({ name: l.rank, value: l.count, label: l.label, color: l.color })),
};

// ── 模块分组覆盖（树图：分组 → 模块数）────────────────────
export const GROUP_COVERAGE = GROUPS
  .filter((g) => g.id !== HOME_GROUP)
  .map((g) => ({
    name: g.label,
    value: MODULES.filter((m) => m.group === g.id).length,
    itemStyle: { color: g.accent },
  }))
  .filter((d) => d.value > 0)
  .sort((a, b) => b.value - a.value);

// ── 重点模块精选 ──────────────────────────────────────────
const pick = (id) => MODULES.find((m) => m.id === id);
export const FEATURED = [
  'talent', 'military', 'redweb', 'civilization',
  'enterprise500', 'contradictions', 'straits', 'powerlogic',
]
  .map(pick)
  .filter(Boolean);

// ── 数据来源与免责声明 ────────────────────────────────────
export const SOURCES = {
  asOf: AS_OF,
  pe500: PRIVATE_ENTERPRISE_META.listSource,
  military: MILITARY_INTEL_META.disclaimer,
  note: '本看板汇总均来自公开资料整理与估算示意，非官方发布；条目计数以内置种子为准，与 IndexedDB 实时载入状态无关。研究用途，不代表任何机构立场。',
};
