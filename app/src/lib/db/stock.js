// ============================================================================
// 存量数据目录 · 已落在各模块的数据，登记为可一键录入数据库的「存量队列」
// ----------------------------------------------------------------------------
// 真实数据（省级财政/人口）从 public/data 加载；其余为各模块内嵌的示意数据快照。
// ============================================================================
import DataBus from '../data/DataBus.js';
import { PE500_DATASETS, PRIVATE_ENTERPRISE_META } from './privateEnterpriseSeed.js';
import { buildAntiCorruptionSeed, ANTI_CORRUPTION_META } from './antiCorruptionSeed.js';
import { buildCulturalEliteSeed, CULTURAL_ELITE_META } from './culturalEliteSeed.js';
import { buildBusinessEliteSeed, BUSINESS_ELITE_META } from './businessEliteSeed.js';
import { buildHigherEducationSeed, HIGHER_EDUCATION_META } from './higherEducationSeed.js';
import { buildThinkTankSeed, THINK_TANK_META } from './thinkTankSeed.js';
import { buildResearchInstituteSeed, RESEARCH_INSTITUTE_META } from './researchInstituteSeed.js';
import { buildWorldBankSeed, WORLD_BANK_META } from './worldBankSeed.js';
import { buildAcademicianSeed, ACADEMICIAN_META } from './academicianSeed.js';
import { buildOverseasTalentSeed, OVERSEAS_TALENT_META } from './overseasTalentSeed.js';
import { buildLegalStatuteSeed, LEGAL_STATUTE_META } from './legalStatuteSeed.js';
import { buildDissidentSeed, DISSIDENT_META } from './dissidentSeed.js';
import { buildTaiwanPoliticalSeed, TAIWAN_POLITICAL_META } from './taiwanPoliticalSeed.js';

// 各模块内嵌的代表性数据快照（origin=stock）
const EMBEDDED = {
  grain: {
    name: '粮食主产区产量', category: '经济运行', source: '粮食安全模块 · 示意',
    rows: [
      { 省份: '黑龙江省', 产量万吨: 7700 }, { 省份: '河南省', 产量万吨: 6600 }, { 省份: '山东省', 产量万吨: 5700 },
      { 省份: '安徽省', 产量万吨: 4100 }, { 省份: '吉林省', 产量万吨: 4000 }, { 省份: '内蒙古自治区', 产量万吨: 3900 },
      { 省份: '河北省', 产量万吨: 3800 }, { 省份: '江苏省', 产量万吨: 3700 }, { 省份: '四川省', 产量万吨: 3500 },
      { 省份: '湖南省', 产量万吨: 2900 }, { 省份: '湖北省', 产量万吨: 2700 }, { 省份: '辽宁省', 产量万吨: 2500 }, { 省份: '江西省', 产量万吨: 2200 },
    ],
  },
  semiTrl: {
    name: '重大科技成熟度 TRL', category: '科技指标', source: '科技树模块 · 示意',
    rows: [
      { 技术: '大模型 AI', TRL: 8 }, { 技术: '太空/重型运载', TRL: 7 }, { 技术: '先进半导体', TRL: 6 },
      { 技术: '军事 AI', TRL: 6 }, { 技术: '量子计算', TRL: 5 }, { 技术: '可控核聚变', TRL: 4 },
    ],
  },
  privateContrib: {
    name: '民营经济 56789 贡献', category: '经济运行', source: '民营经济模块 · 公开口径',
    rows: [
      { 维度: '税收', 占比百分: 50 }, { 维度: 'GDP', 占比百分: 60 }, { 维度: '技术创新', 占比百分: 70 },
      { 维度: '城镇就业', 占比百分: 80 }, { 维度: '企业数量', 占比百分: 90 },
    ],
  },
  chokepoint: {
    name: '关键能源航道依存', category: '地缘指标', source: '外交博弈模块 · 示意',
    rows: [
      { 航道: '马六甲海峡', 依存百分: 80 }, { 航道: '霍尔木兹海峡', 依存百分: 42 },
      { 航道: '曼德海峡', 依存百分: 18 }, { 航道: '苏伊士运河', 依存百分: 12 },
    ],
  },
};

// 存量目录：每项含一个 loader 返回 { columns?, rows, source }
export const STOCK_CATALOG = [
  {
    key: 'higher-education',
    id: buildHigherEducationSeed().id,
    name: buildHigherEducationSeed().name,
    category: '高等教育',
    source: HIGHER_EDUCATION_META.sources[0],
    real: false,
    load: async () => {
      const s = buildHigherEducationSeed();
      return { rows: s.rows, source: s.source };
    },
  },
  {
    key: 'think-tank',
    id: buildThinkTankSeed().id,
    name: buildThinkTankSeed().name,
    category: '顶级智库',
    source: THINK_TANK_META.sources[0],
    real: false,
    load: async () => {
      const s = buildThinkTankSeed();
      return { rows: s.rows, source: s.source };
    },
  },
  {
    key: 'research-institute',
    id: buildResearchInstituteSeed().id,
    name: buildResearchInstituteSeed().name,
    category: '科研院所',
    source: RESEARCH_INSTITUTE_META.sources[0],
    real: false,
    load: async () => {
      const s = buildResearchInstituteSeed();
      return { rows: s.rows, source: s.source };
    },
  },
  {
    key: 'academician',
    id: buildAcademicianSeed().id,
    name: buildAcademicianSeed().name,
    category: '两院院士',
    source: ACADEMICIAN_META.sources[0],
    real: false,
    load: async () => {
      const s = buildAcademicianSeed();
      return { rows: s.rows, source: s.source };
    },
  },
  {
    key: 'cultural-elite',
    id: buildCulturalEliteSeed().id,
    name: buildCulturalEliteSeed().name,
    category: '知识精英',
    source: CULTURAL_ELITE_META.sources[0],
    real: false,
    load: async () => {
      const s = buildCulturalEliteSeed();
      return { rows: s.rows, source: s.source };
    },
  },
  {
    key: 'business-elite',
    id: buildBusinessEliteSeed().id,
    name: buildBusinessEliteSeed().name,
    category: '商业精英',
    source: BUSINESS_ELITE_META.sources[0],
    real: false,
    load: async () => {
      const s = buildBusinessEliteSeed();
      return { rows: s.rows, source: s.source };
    },
  },
  {
    key: 'overseas-talent',
    id: buildOverseasTalentSeed().id,
    name: buildOverseasTalentSeed().name,
    category: '海外人才',
    source: OVERSEAS_TALENT_META.sources[0],
    real: false,
    load: async () => {
      const s = buildOverseasTalentSeed();
      return { rows: s.rows, source: s.source };
    },
  },
  {
    key: 'legal-statute',
    id: buildLegalStatuteSeed().id,
    name: buildLegalStatuteSeed().name,
    category: '法律条文',
    source: LEGAL_STATUTE_META.sources[0],
    real: false,
    load: async () => {
      const s = buildLegalStatuteSeed();
      return { rows: s.rows, source: s.source };
    },
  },
  {
    key: 'anticorruption',
    id: buildAntiCorruptionSeed().id,
    name: buildAntiCorruptionSeed().name,
    category: '人才精英',
    source: ANTI_CORRUPTION_META.sources[0],
    real: false,
    load: async () => {
      const s = buildAntiCorruptionSeed();
      return { rows: s.rows, source: s.source };
    },
  },
  {
    key: 'dissident',
    id: buildDissidentSeed().id,
    name: buildDissidentSeed().name,
    category: '异见人士',
    source: DISSIDENT_META.sources[0],
    real: false,
    load: async () => {
      const s = buildDissidentSeed();
      return { rows: s.rows, source: s.source };
    },
  },
  {
    key: 'taiwan-political',
    id: buildTaiwanPoliticalSeed().id,
    name: buildTaiwanPoliticalSeed().name,
    category: '港澳台政要',
    source: TAIWAN_POLITICAL_META.sources[0],
    real: false,
    load: async () => {
      const s = buildTaiwanPoliticalSeed();
      return { rows: s.rows, source: s.source };
    },
  },
  {
    key: 'province-stats', name: '省级财政/人口/债务（实测）', category: '经济运行',
    source: '国家统计局 / 财政决算 2023（public/data）', real: true,
    load: async () => {
      const j = await DataBus.getJSON('data/province-stats.json');
      return { rows: j.provinces, source: j.meta?.source || '统计公报 2023' };
    },
  },
  {
    key: 'wb-indicators', name: '世界银行 · 全国核心指标（实时）', category: '世界银行', real: true,
    source: 'api.worldbank.org',
    load: async () => {
      const n = await DataBus.chinaIndicators();
      const rows = [];
      if (n.gdpGrowth) rows.push({ 指标: 'GDP 增速(%)', 年份: n.gdpGrowth.date, 数值: n.gdpGrowth.value });
      if (n.population) rows.push({ 指标: '总人口', 年份: n.population.date, 数值: n.population.value });
      if (n.gdp) rows.push({ 指标: 'GDP 现价(US$)', 年份: n.gdp.date, 数值: n.gdp.value });
      if (!rows.length) throw new Error('WB API 暂不可达');
      return { rows, source: 'World Bank API（实时拉取）' };
    },
  },
  {
    key: 'worldbank-wdi',
    id: WORLD_BANK_META.id,
    name: WORLD_BANK_META.label,
    category: '世界银行',
    source: WORLD_BANK_META.source,
    real: true,
    load: async () => {
      const s = buildWorldBankSeed();
      return { columns: s.columns, rows: s.rows, source: s.source };
    },
  },
  ...Object.entries(EMBEDDED).map(([key, v]) => ({
    key, name: v.name, category: v.category, source: v.source, real: false,
    load: async () => ({ rows: v.rows, source: v.source }),
  })),
  {
    key: 'pe500-companies', name: '民营经济500强 · 企业榜单', category: '民营经济', real: true,
    source: PRIVATE_ENTERPRISE_META.listSource,
    load: async () => ({ rows: PE500_DATASETS.companies.rows, source: PRIVATE_ENTERPRISE_META.listSource }),
  },
  {
    key: 'pe500-people', name: '民营经济500强 · 创始人与职业经理人', category: '民营经济', real: true,
    source: '年报/招股书/公开报道',
    load: async () => ({ rows: PE500_DATASETS.people.rows, source: '年报/招股书/公开报道' }),
  },
  {
    key: 'pe500-equity', name: '民营经济500强 · 股权架构', category: '民营经济', real: true,
    source: '年报/招股书/公开报道',
    load: async () => ({ rows: PE500_DATASETS.equity.rows, source: '年报/招股书/公开报道' }),
  },
];
