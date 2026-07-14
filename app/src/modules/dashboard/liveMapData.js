// ============================================================================
// 神州活图 · 省级分层数据（公开统计公报基准 · AS_OF 2026-07-14）
// ----------------------------------------------------------------------------
// 31 省区市 · 十二层指标 · 量级对齐公开统计公报与模块判读基准
// 非实时 API；综合态势由多维度加权合成
// ============================================================================

import { MAP_CHOROPLETH } from '../shared/chartHelpers.js';

import { AS_OF_BASELINE } from '../../lib/config/asOfBaseline.js';

// 勿从 data.js 导入 AS_OF —— data.js 依赖 registry，会形成 lazy 路由循环
export const AS_OF = AS_OF_BASELINE;
export const LAST_UPDATED = `${AS_OF} 08:00 CST`;

/** DataV 全称 · 与 geo JSON name 一致 */
export const PROVINCE_NAMES = [
  '北京市', '天津市', '河北省', '山西省', '内蒙古自治区',
  '辽宁省', '吉林省', '黑龙江省',
  '上海市', '江苏省', '浙江省', '安徽省', '福建省', '江西省', '山东省',
  '河南省', '湖北省', '湖南省', '广东省', '广西壮族自治区', '海南省',
  '重庆市', '四川省', '贵州省', '云南省', '西藏自治区',
  '陕西省', '甘肃省', '青海省', '宁夏回族自治区', '新疆维吾尔自治区',
];

const COASTAL = new Set([
  '辽宁省', '天津市', '河北省', '山东省', '江苏省', '上海市', '浙江省',
  '福建省', '广东省', '广西壮族自治区', '海南省',
]);

const BORDER_PORT = new Set([
  '新疆维吾尔自治区', '西藏自治区', '云南省', '广西壮族自治区', '黑龙江省',
  '内蒙古自治区', '吉林省', '辽宁省',
]);

/** 区域战略标签（政策焦点层） */
export const POLICY_ZONES = {
  '东北全面振兴': ['辽宁省', '吉林省', '黑龙江省'],
  '粤港澳大湾区': ['广东省'],
  '雄安新区': ['河北省'],
  '海南自贸港': ['海南省'],
  '长三角一体化': ['上海市', '江苏省', '浙江省', '安徽省'],
  '成渝双城': ['重庆市', '四川省'],
  '西部陆海新通道': ['广西壮族自治区', '贵州省', '云南省'],
  '黄河流域': ['山西省', '陕西省', '甘肃省', '河南省', '山东省'],
  '新疆核心区': ['新疆维吾尔自治区'],
  '藏区发展': ['西藏自治区'],
};

/** 地图区域缩放预设 */
export const REGION_PRESETS = [
  { id: 'national', label: '全国', center: [104.5, 35.5], zoom: 1.15 },
  { id: 'northeast', label: '东北', center: [126.5, 43.5], zoom: 3.2 },
  { id: 'yrd', label: '长三角', center: [120.2, 31.2], zoom: 4.2 },
  { id: 'gba', label: '大湾区', center: [113.8, 22.6], zoom: 5.5 },
  { id: 'chengyu', label: '成渝', center: [105.5, 30.2], zoom: 3.8 },
];

/** 省份 → 纵深模块链接 */
export const PROVINCE_MODULE_LINKS = {
  '辽宁省': { to: '/northeast', label: '东北振兴' },
  '吉林省': { to: '/northeast', label: '东北振兴' },
  '黑龙江省': { to: '/northeast', label: '东北振兴' },
  '广东省': { to: '/regional', label: '区域协调' },
  '上海市': { to: '/regional', label: '区域协调' },
  '江苏省': { to: '/regional', label: '区域协调' },
  '浙江省': { to: '/regional', label: '区域协调' },
  '四川省': { to: '/regional', label: '区域协调' },
  '重庆市': { to: '/regional', label: '区域协调' },
  '海南省': { to: '/regional', label: '区域协调' },
  '河北省': { to: '/regional', label: '区域协调' },
  '新疆维吾尔自治区': { to: '/regional', label: '区域协调' },
};

export function getProvinceModuleLink(name) {
  return PROVINCE_MODULE_LINKS[name] || { to: '/regional', label: '区域协调' };
}

const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));

/** 各省核心指标（公开资料整理 · 2024 公报/决算量级） */
const RAW = {
  '北京市': { gdpG: 5.0, indHeat: 78, invHeat: 72, tempA: 1.8, precipA: -12, flow: 88, load: 82, policy: 85, rdPct: 6.8, patent: 88, hitech: 82, tradeIdx: 72, carbon: 42, renewPct: 28, tourSpend: 4200, tourRec: 92, disaster: 22, supply: 18 },
  '天津市': { gdpG: 4.5, indHeat: 65, invHeat: 58, tempA: 1.5, precipA: -18, flow: 62, load: 74, policy: 55, rdPct: 3.2, patent: 58, hitech: 55, tradeIdx: 78, carbon: 48, renewPct: 18, tourSpend: 2100, tourRec: 85, disaster: 28, supply: 32 },
  '河北省': { gdpG: 5.2, indHeat: 70, invHeat: 68, tempA: 2.1, precipA: -22, flow: 58, load: 76, policy: 92, rdPct: 2.1, patent: 52, hitech: 58, tradeIdx: 55, carbon: 58, renewPct: 22, tourSpend: 6800, tourRec: 88, disaster: 35, supply: 38 },
  '山西省': { gdpG: 4.8, indHeat: 62, invHeat: 55, tempA: 2.4, precipA: -28, flow: 48, load: 78, policy: 68, rdPct: 1.4, patent: 38, hitech: 42, tradeIdx: 32, carbon: 72, renewPct: 15, tourSpend: 5200, tourRec: 82, disaster: 32, supply: 35 },
  '内蒙古自治区': { gdpG: 5.5, indHeat: 68, invHeat: 72, tempA: 2.8, precipA: -15, flow: 42, load: 82, policy: 62, rdPct: 1.2, patent: 35, hitech: 48, tradeIdx: 45, carbon: 65, renewPct: 32, tourSpend: 4800, tourRec: 86, disaster: 38, supply: 28 },
  '辽宁省': { gdpG: 4.2, indHeat: 58, invHeat: 52, tempA: 1.6, precipA: -8, flow: 55, load: 70, policy: 88, rdPct: 2.0, patent: 48, hitech: 52, tradeIdx: 62, carbon: 55, renewPct: 20, tourSpend: 5800, tourRec: 84, disaster: 30, supply: 42 },
  '吉林省': { gdpG: 4.0, indHeat: 52, invHeat: 48, tempA: 1.4, precipA: -5, flow: 38, load: 65, policy: 86, rdPct: 1.6, patent: 32, hitech: 45, tradeIdx: 28, carbon: 52, renewPct: 25, tourSpend: 3200, tourRec: 80, disaster: 28, supply: 40 },
  '黑龙江省': { gdpG: 3.8, indHeat: 48, invHeat: 45, tempA: 1.2, precipA: -3, flow: 35, load: 68, policy: 84, rdPct: 1.3, patent: 28, hitech: 40, tradeIdx: 35, carbon: 50, renewPct: 28, tourSpend: 3800, tourRec: 78, disaster: 32, supply: 38 },
  '上海市': { gdpG: 5.0, indHeat: 85, invHeat: 78, tempA: 1.6, precipA: -10, flow: 95, load: 88, policy: 82, rdPct: 4.2, patent: 92, hitech: 88, tradeIdx: 95, carbon: 38, renewPct: 22, tourSpend: 5200, tourRec: 94, disaster: 18, supply: 22 },
  '江苏省': { gdpG: 5.5, indHeat: 92, invHeat: 85, tempA: 1.9, precipA: -14, flow: 82, load: 90, policy: 75, rdPct: 3.1, patent: 95, hitech: 90, tradeIdx: 92, carbon: 45, renewPct: 18, tourSpend: 11800, tourRec: 93, disaster: 24, supply: 28 },
  '浙江省': { gdpG: 5.8, indHeat: 90, invHeat: 88, tempA: 1.7, precipA: -16, flow: 86, load: 87, policy: 78, rdPct: 3.0, patent: 90, hitech: 92, tradeIdx: 88, carbon: 42, renewPct: 20, tourSpend: 10200, tourRec: 95, disaster: 22, supply: 25 },
  '安徽省': { gdpG: 5.6, indHeat: 78, invHeat: 82, tempA: 2.0, precipA: -18, flow: 65, load: 80, policy: 72, rdPct: 2.4, patent: 62, hitech: 72, tradeIdx: 58, carbon: 52, renewPct: 24, tourSpend: 7200, tourRec: 90, disaster: 30, supply: 32 },
  '福建省': { gdpG: 5.4, indHeat: 75, invHeat: 70, tempA: 1.5, precipA: -8, flow: 72, load: 76, policy: 65, rdPct: 2.2, patent: 58, hitech: 68, tradeIdx: 72, carbon: 48, renewPct: 26, tourSpend: 6800, tourRec: 91, disaster: 35, supply: 30 },
  '江西省': { gdpG: 5.0, indHeat: 68, invHeat: 72, tempA: 2.2, precipA: -5, flow: 58, load: 72, policy: 58, rdPct: 1.8, patent: 45, hitech: 55, tradeIdx: 42, carbon: 55, renewPct: 22, tourSpend: 5800, tourRec: 87, disaster: 38, supply: 34 },
  '山东省': { gdpG: 5.3, indHeat: 82, invHeat: 75, tempA: 2.0, precipA: -20, flow: 75, load: 85, policy: 70, rdPct: 2.5, patent: 72, hitech: 75, tradeIdx: 78, carbon: 58, renewPct: 16, tourSpend: 9800, tourRec: 92, disaster: 32, supply: 30 },
  '河南省': { gdpG: 5.1, indHeat: 72, invHeat: 68, tempA: 2.3, precipA: -25, flow: 68, load: 78, policy: 68, rdPct: 1.9, patent: 55, hitech: 62, tradeIdx: 48, carbon: 62, renewPct: 18, tourSpend: 8200, tourRec: 89, disaster: 36, supply: 35 },
  '湖北省': { gdpG: 5.4, indHeat: 76, invHeat: 74, tempA: 2.1, precipA: -12, flow: 70, load: 77, policy: 62, rdPct: 2.3, patent: 65, hitech: 70, tradeIdx: 55, carbon: 52, renewPct: 22, tourSpend: 7500, tourRec: 90, disaster: 40, supply: 32 },
  '湖南省': { gdpG: 5.2, indHeat: 70, invHeat: 68, tempA: 2.0, precipA: -6, flow: 64, load: 74, policy: 55, rdPct: 2.1, patent: 58, hitech: 65, tradeIdx: 45, carbon: 54, renewPct: 24, tourSpend: 6800, tourRec: 88, disaster: 42, supply: 30 },
  '广东省': { gdpG: 5.0, indHeat: 95, invHeat: 92, tempA: 1.4, precipA: -5, flow: 98, load: 92, policy: 95, rdPct: 3.2, patent: 98, hitech: 95, tradeIdx: 100, carbon: 40, renewPct: 20, tourSpend: 12800, tourRec: 96, disaster: 28, supply: 26 },
  '广西壮族自治区': { gdpG: 4.8, indHeat: 58, invHeat: 65, tempA: 1.8, precipA: 8, flow: 62, load: 68, policy: 78, rdPct: 1.1, patent: 32, hitech: 48, tradeIdx: 52, carbon: 48, renewPct: 30, tourSpend: 5200, tourRec: 86, disaster: 45, supply: 32 },
  '海南省': { gdpG: 6.0, indHeat: 55, invHeat: 82, tempA: 1.2, precipA: 12, flow: 78, load: 62, policy: 96, rdPct: 0.8, patent: 22, hitech: 55, tradeIdx: 48, carbon: 35, renewPct: 35, tourSpend: 8800, tourRec: 98, disaster: 48, supply: 28 },
  '重庆市': { gdpG: 5.5, indHeat: 72, invHeat: 70, tempA: 2.2, precipA: -10, flow: 74, load: 75, policy: 80, rdPct: 2.2, patent: 55, hitech: 68, tradeIdx: 58, carbon: 50, renewPct: 22, tourSpend: 6200, tourRec: 91, disaster: 38, supply: 30 },
  '四川省': { gdpG: 5.8, indHeat: 78, invHeat: 76, tempA: 1.9, precipA: -8, flow: 80, load: 76, policy: 82, rdPct: 2.0, patent: 52, hitech: 72, tradeIdx: 52, carbon: 46, renewPct: 38, tourSpend: 9800, tourRec: 93, disaster: 52, supply: 28 },
  '贵州省': { gdpG: 5.2, indHeat: 55, invHeat: 72, tempA: 1.6, precipA: 5, flow: 52, load: 65, policy: 72, rdPct: 1.0, patent: 28, hitech: 52, tradeIdx: 32, carbon: 42, renewPct: 42, tourSpend: 7200, tourRec: 90, disaster: 55, supply: 32 },
  '云南省': { gdpG: 5.0, indHeat: 52, invHeat: 58, tempA: 1.5, precipA: 6, flow: 68, load: 62, policy: 60, rdPct: 1.2, patent: 30, hitech: 45, tradeIdx: 38, carbon: 38, renewPct: 45, tourSpend: 8200, tourRec: 94, disaster: 48, supply: 30 },
  '西藏自治区': { gdpG: 8.0, indHeat: 28, invHeat: 85, tempA: 2.6, precipA: -18, flow: 45, load: 42, policy: 88, rdPct: 0.5, patent: 12, hitech: 35, tradeIdx: 18, carbon: 22, renewPct: 68, tourSpend: 6800, tourRec: 96, disaster: 58, supply: 35 },
  '陕西省': { gdpG: 5.0, indHeat: 68, invHeat: 72, tempA: 2.5, precipA: -22, flow: 60, load: 74, policy: 66, rdPct: 2.4, patent: 48, hitech: 62, tradeIdx: 42, carbon: 58, renewPct: 28, tourSpend: 5800, tourRec: 87, disaster: 38, supply: 34 },
  '甘肃省': { gdpG: 5.5, indHeat: 48, invHeat: 62, tempA: 2.8, precipA: -30, flow: 40, load: 70, policy: 58, rdPct: 1.1, patent: 25, hitech: 42, tradeIdx: 28, carbon: 62, renewPct: 32, tourSpend: 4200, tourRec: 84, disaster: 42, supply: 36 },
  '青海省': { gdpG: 5.0, indHeat: 35, invHeat: 55, tempA: 3.0, precipA: -25, flow: 32, load: 58, policy: 52, rdPct: 0.8, patent: 18, hitech: 32, tradeIdx: 15, carbon: 35, renewPct: 72, tourSpend: 2800, tourRec: 82, disaster: 45, supply: 32 },
  '宁夏回族自治区': { gdpG: 5.2, indHeat: 52, invHeat: 58, tempA: 2.6, precipA: -28, flow: 38, load: 72, policy: 55, rdPct: 1.0, patent: 22, hitech: 38, tradeIdx: 25, carbon: 68, renewPct: 35, tourSpend: 2200, tourRec: 80, disaster: 35, supply: 38 },
  '新疆维吾尔自治区': { gdpG: 6.0, indHeat: 62, invHeat: 78, tempA: 2.2, precipA: -20, flow: 48, load: 75, policy: 90, rdPct: 0.9, patent: 25, hitech: 48, tradeIdx: 55, carbon: 55, renewPct: 38, tourSpend: 4800, tourRec: 88, disaster: 42, supply: 40 },
};

function policyTags(name) {
  return Object.entries(POLICY_ZONES)
    .filter(([, list]) => list.includes(name))
    .map(([tag]) => tag);
}

function compositeScore(r) {
  const climateStress = clamp(Math.abs(r.tempA) * 8 + Math.abs(r.precipA) * 0.6, 0, 100);
  const econ = (r.gdpG - 3) * 12 + r.indHeat * 0.35 + r.invHeat * 0.15;
  const blend = r.flow * 0.28 + econ * 0.32 + r.load * 0.15 + r.policy * 0.15 + climateStress * 0.1;
  return Math.round(clamp(blend, 20, 98));
}

function portBoost(name, r) {
  let boost = r.tradeIdx ?? 50;
  if (COASTAL.has(name)) boost += 12;
  if (BORDER_PORT.has(name)) boost += 8;
  return Math.round(clamp(boost, 15, 100));
}

/** 构建各省完整分层记录 */
export const PROVINCE_LAYERS = PROVINCE_NAMES.map((name) => {
  const r = RAW[name] || {};
  const tags = policyTags(name);
  const composite = compositeScore(r);
  const rdIndex = Math.round(clamp(r.rdPct * 12 + r.patent * 0.25, 15, 98));
  const portIdx = portBoost(name, r);
  const carbonIdx = Math.round(clamp(r.carbon * 0.85 + (100 - (r.renewPct ?? 20)) * 0.15, 18, 95));
  const tourIdx = Math.round(clamp((r.tourRec ?? 85) * 0.55 + (r.tourSpend ?? 5000) / 200, 25, 98));
  const riskIdx = Math.round(clamp((r.disaster ?? 30) * 0.55 + (r.supply ?? 30) * 0.45, 12, 88));
  const industryIdx = Math.round(clamp(r.invHeat * 0.55 + r.indHeat * 0.35 + (r.gdpG - 3) * 8, 18, 98));

  return {
    name,
    composite: {
      value: composite,
      gdpGrowth: r.gdpG,
      flowIndex: r.flow,
      loadIndex: r.load,
      policyScore: r.policy,
      climateStress: Math.round(clamp(Math.abs(r.tempA) * 18 + Math.abs(r.precipA) * 0.8, 8, 95)),
      summary: `综合 ${composite} · GDP ${r.gdpG}% · 人流 ${r.flow}`,
    },
    climate: {
      value: Math.round(clamp(Math.abs(r.tempA) * 18 + Math.abs(r.precipA) * 0.8, 8, 95)),
      tempAnomaly: r.tempA,
      precipAnomaly: r.precipA,
      droughtIndex: Math.round(clamp(Math.abs(r.precipA) * 1.2 + r.tempA * 5, 5, 85)),
      heatwaveDays: Math.round(clamp(r.tempA * 12 + 8, 8, 45)),
      summary: `温距平 +${r.tempA}°C · 降水 ${r.precipA > 0 ? '+' : ''}${r.precipA}%`,
    },
    economy: {
      value: Math.round(clamp((r.gdpG - 3) * 15 + r.indHeat * 0.45 + r.invHeat * 0.25, 15, 98)),
      gdpGrowth: r.gdpG,
      industrialHeat: r.indHeat,
      investmentHeat: r.invHeat,
      retailMomentum: Math.round(clamp(r.flow * 0.6 + r.gdpG * 6, 20, 95)),
      summary: `GDP ${r.gdpG}% · 工业 ${r.indHeat} · 投资 ${r.invHeat}`,
    },
    migration: {
      value: r.flow,
      flowIndex: r.flow,
      tourismIntensity: Math.round(r.flow * 0.85 + (r.precipA > 0 ? 5 : 0)),
      holidayPeak: Math.round(clamp(r.flow * 0.92 + 5, 30, 100)),
      urbanMobility: Math.round(clamp(r.flow * 0.78 + r.indHeat * 0.1, 25, 98)),
      summary: `人流 ${r.flow} · 旅游景气 ${Math.round(r.flow * 0.85)}`,
    },
    energy: {
      value: r.load,
      gridLoad: r.load,
      peakMargin: Math.round(100 - r.load * 0.35),
      coalShare: Math.round(clamp(100 - (r.renewPct ?? 20) - 15, 25, 75)),
      renewShare: r.renewPct ?? 20,
      summary: `负荷 ${r.load} · 裕度 ${Math.round(100 - r.load * 0.35)}%`,
    },
    policy: {
      value: r.policy,
      tags,
      activeStrategies: tags.length,
      fiscalSupport: Math.round(clamp(r.policy * 0.7 + r.invHeat * 0.2, 20, 98)),
      summary: tags.length ? tags.join(' · ') : '—',
    },
    industry: {
      value: industryIdx,
      fixedAssetGrowth: Math.round(clamp(r.invHeat * 0.65 + r.gdpG * 4, 12, 88)),
      manufacturingIdx: r.indHeat,
      strategicSector: Math.round(clamp(r.invHeat * 0.5 + r.indHeat * 0.4, 20, 95)),
      summary: `产业投资热度 ${industryIdx} · 固投景气 ${Math.round(r.invHeat * 0.65)}`,
    },
    innovation: {
      value: rdIndex,
      rdIntensity: r.rdPct,
      patentIndex: r.patent,
      hitechZone: r.hitech,
      summary: `R&D ${r.rdPct}% · 专利指数 ${r.patent}`,
    },
    portflow: {
      value: portIdx,
      tradeVolume: Math.round(portIdx * 1.15),
      exportIntensity: Math.round(clamp(portIdx * 0.85 + (COASTAL.has(name) ? 15 : 0), 15, 100)),
      borderThroughput: BORDER_PORT.has(name) ? Math.round(portIdx * 0.72) : Math.round(portIdx * 0.25),
      summary: `口岸流量 ${portIdx} · 外贸强度 ${Math.round(portIdx * 0.85)}`,
    },
    carbon: {
      value: carbonIdx,
      carbonIntensity: r.carbon,
      coalDependence: Math.round(clamp(100 - (r.renewPct ?? 20) - 15, 25, 75)),
      renewShare: r.renewPct ?? 20,
      summary: `碳强度指数 ${carbonIdx} · 可再生 ${r.renewPct ?? 20}%`,
    },
    tourism: {
      value: tourIdx,
      spendIndex: r.tourSpend,
      recoveryPct: r.tourRec,
      overnightGuests: Math.round(clamp((r.tourRec ?? 85) * 0.8 + r.flow * 0.15, 30, 98)),
      summary: `消费 ${(r.tourSpend ?? 5000) / 100}百亿 · 恢复率 ${r.tourRec ?? 85}%`,
    },
    risk: {
      value: riskIdx,
      disasterRisk: r.disaster ?? 30,
      supplyChainRisk: r.supply ?? 30,
      climateExposure: Math.round(clamp((r.disaster ?? 30) * 0.6 + Math.abs(r.precipA) * 0.4, 10, 80)),
      summary: `灾害 ${r.disaster ?? 30} · 供应链 ${r.supply ?? 30}`,
    },
  };
});

export const LAYERS = [
  { id: 'composite', label: '综合态势', icon: 'Layers', valueName: '综合指数', unit: '', min: 0, max: 100, desc: '经济 · 人流 · 能源 · 政策 · 气候应力加权', source: 'seed' },
  { id: 'climate', label: '气候态势', icon: 'CloudSun', valueName: '异常强度', unit: '', min: 0, max: 100, desc: '温/降水距平 · 干旱/高温代理', source: 'seed' },
  { id: 'economy', label: '经济热度', icon: 'TrendingUp', valueName: '经济热度', unit: '', min: 0, max: 100, desc: 'GDP 增速 · 工业 · 投资 · 消费动能', source: 'seed' },
  { id: 'migration', label: '人流热力', icon: 'Users', valueName: '人流强度', unit: '', min: 0, max: 100, desc: '迁徙/出行/旅游合成热力', source: 'seed' },
  { id: 'energy', label: '能源负荷', icon: 'Zap', valueName: '负荷指数', unit: '', min: 0, max: 100, desc: '电网负荷 · 煤电占比 · 可再生', source: 'seed' },
  { id: 'policy', label: '政策焦点', icon: 'Landmark', valueName: '战略强度', unit: '', min: 0, max: 100, desc: '区域战略叠加 · 财政支持代理', source: 'seed' },
  { id: 'industry', label: '产业投资', icon: 'Factory', valueName: '投资热度', unit: '', min: 0, max: 100, desc: '分省产业/固投景气 · 战略赛道', source: 'seed' },
  { id: 'innovation', label: '科创密度', icon: 'Microscope', valueName: '科创指数', unit: '', min: 0, max: 100, desc: 'R&D 强度 · 专利 · 高新区代理', source: 'seed' },
  { id: 'portflow', label: '口岸流量', icon: 'Ship', valueName: '流量指数', unit: '', min: 0, max: 100, desc: '港口/陆路口岸 · 外贸吞吐代理', source: 'seed' },
  { id: 'carbon', label: '电力碳排', icon: 'Leaf', valueName: '碳强度', unit: '', min: 0, max: 100, desc: '碳强度 · 煤电依赖 · 可再生占比', source: 'seed' },
  { id: 'tourism', label: '文旅消费', icon: 'Palmtree', valueName: '消费热度', unit: '', min: 0, max: 100, desc: '旅游消费 · 恢复率 · 过夜客流', source: 'seed' },
  { id: 'risk', label: '风险态势', icon: 'ShieldAlert', valueName: '风险指数', unit: '', min: 0, max: 100, desc: '灾害暴露 · 供应链脆弱性（分析示意）', source: 'seed' },
];

/** 主题色带 · 每层独立尺度 */
export const PALETTES = {
  dark: {
    composite: [MAP_CHOROPLETH.dark[0], '#134e4a', '#0e7490', '#22d3ee', '#e8a317'],
    climate: [MAP_CHOROPLETH.dark[0], '#1e3a5f', '#0369a1', '#38bdf8', '#bae6fd'],
    economy: [MAP_CHOROPLETH.dark[0], '#431407', '#9a3412', '#fb923c', '#fde68a'],
    migration: [MAP_CHOROPLETH.dark[0], '#14532d', '#15803d', '#22c55e', '#86efac'],
    energy: [MAP_CHOROPLETH.dark[0], '#312e81', '#4338ca', '#818cf8', '#c4b5fd'],
    policy: [MAP_CHOROPLETH.dark[0], '#450a0a', '#991b1b', '#c41e3a', '#fca5a5'],
    industry: [MAP_CHOROPLETH.dark[0], '#3b0764', '#6b21a8', '#a855f7', '#e9d5ff'],
    innovation: [MAP_CHOROPLETH.dark[0], '#0c4a6e', '#0284c7', '#38bdf8', '#7dd3fc'],
    portflow: [MAP_CHOROPLETH.dark[0], '#164e63', '#0e7490', '#22d3ee', '#a5f3fc'],
    carbon: [MAP_CHOROPLETH.dark[0], '#365314', '#4d7c0f', '#84cc16', '#d9f99d'],
    tourism: [MAP_CHOROPLETH.dark[0], '#713f12', '#b45309', '#f59e0b', '#fde68a'],
    risk: [MAP_CHOROPLETH.dark[0], '#422006', '#92400e', '#f97316', '#fed7aa'],
  },
  light: {
    composite: ['#f1f5f9', '#99f6e4', '#22d3ee', '#0891b2', '#0e7490'],
    climate: ['#f8fafc', '#dbeafe', '#60a5fa', '#2563eb', '#1e40af'],
    economy: ['#fff7ed', '#fed7aa', '#fb923c', '#ea580c', '#9a3412'],
    migration: ['#f0fdf4', '#bbf7d0', '#4ade80', '#16a34a', '#14532d'],
    energy: ['#eef2ff', '#c7d2fe', '#818cf8', '#4f46e5', '#312e81'],
    policy: ['#fef2f2', '#fecaca', '#f87171', '#dc2626', '#991b1b'],
    industry: ['#faf5ff', '#e9d5ff', '#c084fc', '#9333ea', '#6b21a8'],
    innovation: ['#f0f9ff', '#bae6fd', '#38bdf8', '#0284c7', '#075985'],
    portflow: ['#ecfeff', '#a5f3fc', '#22d3ee', '#0891b2', '#155e75'],
    carbon: ['#f7fee7', '#d9f99d', '#84cc16', '#4d7c0f', '#365314'],
    tourism: ['#fffbeb', '#fde68a', '#f59e0b', '#d97706', '#92400e'],
    risk: ['#fff7ed', '#fed7aa', '#fb923c', '#ea580c', '#9a3412'],
  },
};

/** 各层 tooltip 附加字段 */
export const LAYER_TOOLTIP_FIELDS = {
  composite: [
    { key: 'gdpGrowth', label: 'GDP 增速', fmt: (v) => `${v}%` },
    { key: 'flowIndex', label: '人流指数', fmt: (v) => v },
    { key: 'loadIndex', label: '能源负荷', fmt: (v) => v },
    { key: 'climateStress', label: '气候应力', fmt: (v) => v },
  ],
  climate: [
    { key: 'tempAnomaly', label: '温度距平', fmt: (v) => `+${v}°C` },
    { key: 'precipAnomaly', label: '降水距平', fmt: (v) => `${v > 0 ? '+' : ''}${v}%` },
    { key: 'droughtIndex', label: '干旱指数', fmt: (v) => v },
    { key: 'heatwaveDays', label: '高温日数', fmt: (v) => `${v}天` },
  ],
  economy: [
    { key: 'gdpGrowth', label: 'GDP 增速', fmt: (v) => `${v}%` },
    { key: 'industrialHeat', label: '工业热度', fmt: (v) => v },
    { key: 'investmentHeat', label: '投资热度', fmt: (v) => v },
    { key: 'retailMomentum', label: '消费动能', fmt: (v) => v },
  ],
  migration: [
    { key: 'flowIndex', label: '人流强度', fmt: (v) => v },
    { key: 'tourismIntensity', label: '旅游景气', fmt: (v) => v },
    { key: 'holidayPeak', label: '假日峰值', fmt: (v) => v },
    { key: 'urbanMobility', label: '城市出行', fmt: (v) => v },
  ],
  energy: [
    { key: 'gridLoad', label: '电网负荷', fmt: (v) => v },
    { key: 'peakMargin', label: '峰值裕度', fmt: (v) => `${v}%` },
    { key: 'coalShare', label: '煤电占比', fmt: (v) => `${v}%` },
    { key: 'renewShare', label: '可再生', fmt: (v) => `${v}%` },
  ],
  policy: [
    { key: 'activeStrategies', label: '战略标签', fmt: (v) => `${v}项` },
    { key: 'fiscalSupport', label: '财政支持', fmt: (v) => v },
    { key: 'summary', label: '焦点', fmt: (v) => v },
  ],
  industry: [
    { key: 'fixedAssetGrowth', label: '固投景气', fmt: (v) => v },
    { key: 'manufacturingIdx', label: '制造业', fmt: (v) => v },
    { key: 'strategicSector', label: '战略赛道', fmt: (v) => v },
  ],
  innovation: [
    { key: 'rdIntensity', label: 'R&D 强度', fmt: (v) => `${v}%` },
    { key: 'patentIndex', label: '专利指数', fmt: (v) => v },
    { key: 'hitechZone', label: '高新区', fmt: (v) => v },
  ],
  portflow: [
    { key: 'tradeVolume', label: '贸易量', fmt: (v) => v },
    { key: 'exportIntensity', label: '出口强度', fmt: (v) => v },
    { key: 'borderThroughput', label: '口岸吞吐', fmt: (v) => v },
  ],
  carbon: [
    { key: 'carbonIntensity', label: '碳强度', fmt: (v) => v },
    { key: 'coalDependence', label: '煤电依赖', fmt: (v) => `${v}%` },
    { key: 'renewShare', label: '可再生', fmt: (v) => `${v}%` },
  ],
  tourism: [
    { key: 'spendIndex', label: '消费规模', fmt: (v) => `${(v / 100).toFixed(0)}百亿` },
    { key: 'recoveryPct', label: '恢复率', fmt: (v) => `${v}%` },
    { key: 'overnightGuests', label: '过夜客流', fmt: (v) => v },
  ],
  risk: [
    { key: 'disasterRisk', label: '灾害风险', fmt: (v) => v },
    { key: 'supplyChainRisk', label: '供应链', fmt: (v) => v },
    { key: 'climateExposure', label: '气候暴露', fmt: (v) => v },
  ],
};

export function getLayerById(id) {
  return LAYERS.find((l) => l.id === id) || LAYERS[0];
}

export function getProvinceByName(name) {
  return PROVINCE_LAYERS.find((p) => p.name === name);
}

/** 模拟实时抖动 ±2% */
export function applyJitter(value, seed, magnitude = 0.02) {
  const noise = ((seed % 200) - 100) / 100 * magnitude;
  return Math.round(value * (1 + noise) * 10) / 10;
}

/** 当前层的 choropleth 数据 */
export function getMapSeries(layerId, opts = {}) {
  const { jitterSeed = 0, jitter = false } = opts;
  const layer = getLayerById(layerId);
  return PROVINCE_LAYERS.map((p, i) => {
    const m = p[layerId] || p.composite;
    let value = m.value;
    if (jitter) {
      value = applyJitter(value, jitterSeed + i * 17, 0.02);
      value = clamp(value, layer.min, layer.max);
    }
    return { name: p.name, value, metrics: { ...m, value } };
  });
}

/** 全国统计摘要 */
export function getNationalStats(layerId, series) {
  const data = series || getMapSeries(layerId);
  const vals = data.map((d) => d.value);
  const avg = vals.reduce((s, v) => s + v, 0) / vals.length;
  const max = Math.max(...vals);
  const min = Math.min(...vals);
  const maxProv = data.find((d) => d.value === max);
  const minProv = data.find((d) => d.value === min);
  return {
    avg: Math.round(avg * 10) / 10,
    max,
    min,
    maxProv: maxProv?.name,
    minProv: minProv?.name,
  };
}

/** Top N 热/冷省份 */
export function getRankings(layerId, n = 5, series) {
  const data = (series || getMapSeries(layerId)).slice().sort((a, b) => b.value - a.value);
  return {
    hot: data.slice(0, n),
    cold: data.slice(-n).reverse(),
  };
}

/** 省份中心坐标（示意 · 用于脉冲散点） */
export const PROVINCE_COORDS = {
  '北京市': [116.4, 39.9], '天津市': [117.2, 39.1], '河北省': [114.5, 38.0],
  '山西省': [112.5, 37.8], '内蒙古自治区': [111.7, 40.8],
  '辽宁省': [123.4, 41.8], '吉林省': [125.3, 43.9], '黑龙江省': [126.6, 45.8],
  '上海市': [121.5, 31.2], '江苏省': [118.8, 32.1], '浙江省': [120.2, 30.3],
  '安徽省': [117.3, 31.8], '福建省': [119.3, 26.1], '江西省': [115.9, 28.7],
  '山东省': [117.0, 36.7], '河南省': [113.6, 34.8], '湖北省': [114.3, 30.6],
  '湖南省': [112.9, 28.2], '广东省': [113.3, 23.1], '广西壮族自治区': [108.3, 22.8],
  '海南省': [110.3, 20.0], '重庆市': [106.5, 29.6], '四川省': [104.1, 30.7],
  '贵州省': [106.7, 26.6], '云南省': [102.7, 25.0], '西藏自治区': [91.1, 29.6],
  '陕西省': [108.9, 34.3], '甘肃省': [103.8, 36.1], '青海省': [101.8, 36.6],
  '宁夏回族自治区': [106.3, 38.5], '新疆维吾尔自治区': [87.6, 43.8],
};

/** 雷达图维度（省份详情） */
export const RADAR_DIMS = [
  { key: 'economy', label: '经济' },
  { key: 'migration', label: '人流' },
  { key: 'energy', label: '能源' },
  { key: 'innovation', label: '科创' },
  { key: 'portflow', label: '口岸' },
  { key: 'risk', label: '风险' },
];

export function getProvinceRadar(name) {
  const p = getProvinceByName(name);
  if (!p) return [];
  return RADAR_DIMS.map((d) => p[d.key]?.value ?? 0);
}
