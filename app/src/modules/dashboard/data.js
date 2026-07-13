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
import { ECON_AS_OF, KEY_INDICATORS, CANARY_SIGNALS } from '../econdash/econData.js';

export const AS_OF = AS_OF_BASELINE;
export const MACRO_AS_OF = ECON_AS_OF;

/** 宏观 KPI 自动刷新间隔（秒级倒计时 + DataBus 拉取） */
export const DASHBOARD_REFRESH_MS = 60_000;

const KPI_COLORS = {
  warm: '#10b981',
  hold: '#e8a317',
  cool: '#c41e3a',
  steel: '#22d3ee',
};

function pickIndicator(id) {
  return KEY_INDICATORS.find((i) => i.id === id);
}

function fmtPct(v, digits = 1) {
  if (v == null || Number.isNaN(v)) return '—';
  return `${Number(v).toFixed(digits)}%`;
}

function fmtPoint(v, digits = 1) {
  if (v == null || Number.isNaN(v)) return '—';
  return Number(v).toFixed(digits);
}

/** 看板 Hero 宏观条 · 对齐经济大盘 KEY_INDICATORS 快照 */
export function buildMacroKpiSnapshot() {
  const gdp = pickIndicator('gdp_h1');
  const cpi = pickIndicator('cpi');
  const pmi = pickIndicator('pmi_mfg');
  const retail = pickIndicator('retail');
  const m2 = pickIndicator('m2');
  const youth = CANARY_SIGNALS.find((s) => s.id === 'youth_unemp');

  return [
    {
      id: 'gdp_h1',
      k: 'GDP H1',
      v: gdp ? fmtPct(gdp.value) : '5.3%',
      note: '累计同比 · 十五五开局',
      c: KPI_COLORS.cool,
      asOf: gdp?.asOf || MACRO_AS_OF,
      liveKey: 'gdpGrowth',
      live: false,
    },
    {
      id: 'cpi',
      k: 'CPI 5月',
      v: cpi ? fmtPct(cpi.value) : '0.3%',
      note: '同比近零 · 通缩压力',
      c: KPI_COLORS.steel,
      asOf: cpi?.asOf || MACRO_AS_OF,
      liveKey: null,
      live: false,
    },
    {
      id: 'pmi_mfg',
      k: 'PMI 5月',
      v: pmi ? fmtPoint(pmi.value) : '49.8',
      note: '制造业 · 荣枯线下',
      c: KPI_COLORS.hold,
      asOf: pmi?.asOf || MACRO_AS_OF,
      liveKey: null,
      live: false,
    },
    {
      id: 'retail',
      k: '社零 5月',
      v: retail ? `+${fmtPct(retail.value)}` : '+4.6%',
      note: '以旧换新支撑',
      c: KPI_COLORS.warm,
      asOf: retail?.asOf || MACRO_AS_OF,
      liveKey: null,
      live: false,
    },
    {
      id: 'm2',
      k: 'M2 5月',
      v: m2 ? fmtPct(m2.value) : '7.2%',
      note: '宽货币 · 窄信用',
      c: KPI_COLORS.steel,
      asOf: m2?.asOf || MACRO_AS_OF,
      liveKey: null,
      live: false,
    },
    {
      id: 'youth_unemp',
      k: '青年失业',
      v: youth?.reading?.match(/[\d.]+%/)?.[0] || '16.8%',
      note: '16–24 岁 · 5月',
      c: KPI_COLORS.cool,
      asOf: MACRO_AS_OF,
      liveKey: null,
      live: false,
    },
  ];
}

export const MACRO_KPI_SNAPSHOT = buildMacroKpiSnapshot();

/** 活模块快捷跳转 · 带实时状态标注 */
export const LIVE_MODULE_CHIPS = [
  {
    id: 'shenzhou-live',
    title: '神州活图',
    path: '/shenzhou-live',
    icon: 'Map',
    live: true,
    note: '多源图层 · 60s 刷新',
  },
  {
    id: 'econdash',
    title: '经济大盘',
    path: '/econ-dashboard',
    icon: 'LineChart',
    live: false,
    note: `NBS 快照 · ${MACRO_AS_OF}`,
  },
  {
    id: 'observatory',
    title: '观象台',
    path: '/modules/observatory',
    icon: 'Telescope',
    live: true,
    note: '治理链 · 双仪表合成',
  },
];

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

// ── 战略态势矢量（镜像 diplomacy/Page.jsx · 看板排序与分组） ──
export const DIPLOMACY_TONES = {
  warm: KPI_COLORS.warm,
  hold: KPI_COLORS.hold,
  cool: KPI_COLORS.cool,
  steel: KPI_COLORS.steel,
};

export const STRATEGY_VECTOR_GROUPS = {
  power: '大国关系',
  periphery: '周边',
  hotspot: '热点',
  global_south: '全球南方',
};

/** @typedef {{ id: string; name: string; group: keyof STRATEGY_VECTOR_GROUPS; role: string; status: string; tone: keyof DIPLOMACY_TONES; trend: string; note: string; priority: number }} StrategyVector */

/** @type {StrategyVector[]} */
export const STRATEGY_VECTORS = [
  { id: 'us-cn', name: '中美', group: 'power', role: '总牵引', status: '竞合管控', tone: 'hold', trend: '→', note: '301 关税续期 · 科技出口管制未松', priority: 100 },
  { id: 'eu-cn', name: '中欧', group: 'power', role: '争夺地', status: '摩擦中维系', tone: 'cool', trend: '→', note: 'EV 反补贴终裁 · 去风险阵线分化', priority: 90 },
  { id: 'ru-cn', name: '中俄', group: 'power', role: '背靠背', status: '深度协作', tone: 'warm', trend: '→', note: '能源与稀土互补 · 不结盟红线未动', priority: 85 },
  { id: 'tw', name: '台海', group: 'hotspot', role: '首要周边', status: '高压常态化', tone: 'hold', trend: '↗', note: '巡航成新常态 · 未越升级阈值', priority: 95 },
  { id: 'dprk', name: '中朝', group: 'hotspot', role: '半岛', status: '管控型同盟', tone: 'warm', trend: '↗', note: '高规格再锚定 · 对冲平壤漂移', priority: 88 },
  { id: 'ne-asia', name: '东北亚', group: 'periphery', role: '分线操作', status: '对朝↗·对日紧', tone: 'hold', trend: '↗', note: '日韩摇摆 · 朝俄热度对冲', priority: 75 },
  { id: 'asean', name: '东盟', group: 'periphery', role: '经济整合', status: '经济拉动', tone: 'warm', trend: '↗', note: '自贸区 3.0 · 南海摩擦双轨', priority: 70 },
  { id: 'in-cn', name: '中印', group: 'periphery', role: '慢解冻', status: '谨慎回暖', tone: 'hold', trend: '↗', note: '边境脱离接触 · 多向结盟变量', priority: 65 },
  { id: 'global-south', name: '全球南方', group: 'global_south', role: '票仓', status: '系统加码', tone: 'warm', trend: '↗', note: '金砖扩容 · 对非零关税', priority: 60 },
];

const VECTOR_GROUP_ORDER = { power: 0, periphery: 1, hotspot: 2, global_south: 3 };
const VECTOR_TONE_SEVERITY = { cool: 3, hold: 2, steel: 2, warm: 1 };

/** 态势速览排序：圈层分组 → 紧张度（竞争>管控>合作）→ 优先级 */
export function sortStrategyVectors(vectors = STRATEGY_VECTORS) {
  return [...vectors].sort((a, b) => {
    const g = VECTOR_GROUP_ORDER[a.group] - VECTOR_GROUP_ORDER[b.group];
    if (g !== 0) return g;
    const s = (VECTOR_TONE_SEVERITY[b.tone] ?? 0) - (VECTOR_TONE_SEVERITY[a.tone] ?? 0);
    if (s !== 0) return s;
    return b.priority - a.priority;
  });
}

/** 按语义分组后的矢量（用于看板分组展示） */
export function groupStrategyVectors(vectors = sortStrategyVectors()) {
  /** @type {{ id: string; label: string; items: StrategyVector[] }[]} */
  const groups = [];
  for (const v of vectors) {
    const last = groups[groups.length - 1];
    if (!last || last.id !== v.group) {
      groups.push({ id: v.group, label: STRATEGY_VECTOR_GROUPS[v.group], items: [v] });
    } else {
      last.items.push(v);
    }
  }
  return groups;
}

// ── 数据来源与免责声明 ────────────────────────────────────
export const SOURCES = {
  asOf: AS_OF,
  pe500: PRIVATE_ENTERPRISE_META.listSource,
  military: MILITARY_INTEL_META.disclaimer,
  note: '本看板汇总均来自公开资料整理与估算示意，非官方发布；条目计数以内置种子为准，与 IndexedDB 实时载入状态无关。研究用途，不代表任何机构立场。',
};
