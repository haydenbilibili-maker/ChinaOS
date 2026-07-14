// ============================================================================
// 经济观测台 · 当前主线：通缩与资金活化 + 背离监测（纯数据 / 纯函数）
// ----------------------------------------------------------------------------
// 口径声明（最高优先级，全程贯彻）：
//   · 本文件为「国家统计局（NBS）/ 人民银行 公开口径快照」近似走势，标注 ASOF；
//     以官方最新发布为准。
//   · 主线指标 series 为公开口径近似走势（平减指数与 PPI 走低转负、核心 CPI 低位、
//     M1−M2 剪刀差收敛），数值合理即可，凡不确定的精确值一律标注「近似 / 示意」，
//     不杜撰伪精确官方小数。
//   · 「背离张力」（TENSIONS 的 left/right/gap/note）为分析示意，非官方分级、非预测。
//   · 全模块声明：公开统计梳理 · 示意标定 · 非投资建议 · 非预测。
// 确定性铁律：本层零随机、零当前时间；基准日用常量 DEFLATION_ASOF。
// ----------------------------------------------------------------------------
// 设计语言（与「中国经济观测台结构蓝图」对齐）：
//   四色语义 —— 朱砂 cinnabar #c44e3d（收缩/通缩/背离/警示）、青 teal #62a89e（扩张/
//   名义/好转）、赭 amber #c99a4e（区域/财政视角）、黛 indigo #8090c6（宏观叙事视角）。
//   视角 lens 三态 —— 叙 narrative(黛) / 域 regional(赭) / 双 both(黛+赭)。
// ============================================================================

import { AS_OF_BASELINE } from '../../lib/config/asOfBaseline.js';

/** 基准快照日（所有 asOf 默认对齐此日；以官方发布为准） */
export const DEFLATION_ASOF = AS_OF_BASELINE;

/** 四色语义令牌（与蓝图一致；供主线程接线复用，避免硬编码散落） */
export const SIGNAL_COLORS = {
  cinnabar: '#c44e3d', // 朱砂：收缩 / 通缩 / 背离 / 警示
  teal: '#62a89e',     // 青：扩张 / 名义 / 好转
  amber: '#c99a4e',    // 赭：区域 / 财政视角
  indigo: '#8090c6',   // 黛：宏观叙事视角
};

/** 视角 lens 三态令牌（叙=黛 / 域=赭 / 双=黛+赭） */
export const LENS = {
  narrative: { id: 'narrative', label: '叙', full: '宏观叙事', color: SIGNAL_COLORS.indigo },
  regional: { id: 'regional', label: '域', full: '区域财政', color: SIGNAL_COLORS.amber },
  both: { id: 'both', label: '双', full: '叙×域', colors: [SIGNAL_COLORS.indigo, SIGNAL_COLORS.amber] },
};

// ---------------------------------------------------------------------------
// 1. 主线指标盘（四个）—— 通缩与资金活化的直接证据
//    series 为近八期、按时间升序的公开口径近似走势；zero 标注是否「零轴指标」
//    （穿越 0 即由扩张转收缩，绘图时建议加 0 基准线）。
// ---------------------------------------------------------------------------

/**
 * @typedef {Object} HeadlineGauge
 * @property {string}  id
 * @property {string}  label
 * @property {string}  sub    一句副标（≤14 字）
 * @property {number[]} series 近八期数值，按时间升序（长度恰为 8）
 * @property {string}  unit   单位
 * @property {('cinnabar'|'teal'|'amber')} signal 四色语义档位
 * @property {string}  source 数据来源 / 口径
 * @property {string}  freq   频率（季 / 月）
 * @property {string}  note   口径备注（≤20 字）
 * @property {boolean} zero   是否为零轴指标（穿越 0 即扩张↔收缩）
 */

/** @type {HeadlineGauge[]} 主线四指标（series 长 8；公开口径近似走势，以官方发布为准） */
export const HEADLINE_GAUGES = [
  {
    id: 'gdpDeflator',
    label: 'GDP 平减指数',
    sub: '名义减实际·通缩总量证据',
    // 近八季同比（%）：连续为负、低位徘徊——名义增速被价格拖低的总量级证据
    series: [-0.5, -0.7, -1.0, -1.2, -0.9, -1.1, -0.8, -0.6],
    unit: '% 同比',
    signal: 'cinnabar',
    source: 'NBS 季度核算近似口径',
    freq: '近八季',
    note: '名义−实际之差，连负即通缩；近似',
    zero: true,
  },
  {
    id: 'coreCpi',
    label: '核心 CPI',
    sub: '剔除食品能源·内需冷热',
    // 近八月同比（%）：低位窄幅，内需偏冷但未陷负值
    series: [0.6, 0.5, 0.4, 0.4, 0.5, 0.5, 0.6, 0.5],
    unit: '% 同比',
    signal: 'amber',
    source: 'NBS 核心 CPI 公开口径',
    freq: '月',
    note: '剔除食品能源，测内需热度；近似',
    zero: false,
  },
  {
    id: 'ppi',
    label: 'PPI 工业品出厂',
    sub: '工业品通缩直接证据',
    // 近八月同比（%）：深度负值、底部震荡——工业品通缩最直接证据
    series: [-2.5, -2.7, -3.0, -2.8, -3.1, -2.9, -2.8, -2.6],
    unit: '% 同比',
    signal: 'cinnabar',
    source: 'NBS PPI 公开口径',
    freq: '月',
    note: '工业品出厂价，连负挤利润；近似',
    zero: true,
  },
  {
    id: 'm1m2',
    label: 'M1−M2 剪刀差',
    sub: '新口径·资金趴还是动',
    // 近八月差值（pct）：深度负差缓慢收敛——资金趴账、活化偏弱但边际修复
    series: [-9.5, -9.0, -8.4, -7.8, -7.0, -6.3, -5.6, -5.0],
    unit: 'pct（M1−M2）',
    signal: 'teal',
    source: '人民银行 货币供应新口径近似',
    freq: '月',
    note: '负差=钱趴账，收敛=活化；近似',
    zero: true,
  },
];

// ---------------------------------------------------------------------------
// 2. 背离监测（六对）—— 名义×实际、体制×市场、总量×私人的张力
//    left + right = 100；right 越大代表「现实越弱 / 价格越塌 / 内生越乏力」。
//    left/right 为分析示意的张力配比，非官方分级、非预测。
// ---------------------------------------------------------------------------

/**
 * @typedef {Object} Tension
 * @property {string} id
 * @property {string} a    左项（指标 A）
 * @property {string} as   左项注解（≤6 字）
 * @property {string} b    右项（指标 B）
 * @property {string} bs   右项注解（≤6 字）
 * @property {number} left  左侧张力配比（0–100）
 * @property {number} right 右侧张力配比（0–100；left+right=100）
 * @property {string} gap  张力一句（≤22 字）
 * @property {string} note 解读（≤28 字）
 * @property {('narrative'|'regional'|'both')} lens 观察视角
 */

/** @type {Tension[]} 六对背离（left+right=100；张力配比为分析示意） */
export const TENSIONS = [
  {
    id: 'gdp_vs_deflator',
    a: '实际 GDP 增速',
    as: '官方实际',
    b: 'GDP 平减指数',
    bs: '价格在塌',
    left: 42,
    right: 58,
    gap: '实际尚稳，名义被价格拖低',
    note: '名义实际背离：增长靠量、价格塌方，企业含金量缩水',
    lens: 'narrative',
  },
  {
    id: 'pmi_official_vs_caixin',
    a: '官方制造业 PMI',
    as: '体制内大',
    b: '财新制造业 PMI',
    bs: '外向中小',
    left: 48,
    right: 52,
    gap: '大厂与中小企业冷热不均',
    note: '体制内×外向中小：财新更贴外贸民企，景气分层',
    lens: 'both',
  },
  {
    id: 'bill_rate_vs_credit',
    a: '月末票据贴现利率',
    as: '贴现跳水',
    b: '新增信贷',
    bs: '靠票凑量',
    left: 35,
    right: 65,
    gap: '贴现利率跳水，信贷靠票据冲量',
    note: '贴现跳水=信贷凑量：实体真实融资需求偏弱',
    lens: 'narrative',
  },
  {
    id: 'completion_vs_start',
    a: '房屋竣工面积',
    as: '保交楼',
    b: '房屋新开工面积',
    bs: '拿地停滞',
    left: 38,
    right: 62,
    gap: '竣工保交楼，新开工持续探底',
    note: '竣工强开工弱=拿地停滞：地产投资缺接续动能',
    lens: 'regional',
  },
  {
    id: 'income_vs_consumption',
    a: '名义收入增速',
    as: '账面在升',
    b: '实际消费增速',
    bs: '不敢花',
    left: 44,
    right: 56,
    gap: '收入账面升，消费仍迟疑',
    note: '收入升消费滞=预期收缩：储蓄防御、内需难起',
    lens: 'narrative',
  },
  {
    id: 'afre_vs_household_loan',
    a: '社融总量',
    as: '政府债撑',
    b: '居民中长贷',
    bs: '内生乏力',
    left: 45,
    right: 55,
    gap: '社融靠政府债，私人加杠杆乏力',
    note: '总量稳私人弱=内生乏力：信用扩张未传到居民端',
    lens: 'both',
  },
];

// ---------------------------------------------------------------------------
// 3. 纯函数：单背离研判
//    right 越大（现实越弱）越偏 negative；接近均衡（≈50）偏 neutral。
// ---------------------------------------------------------------------------

/**
 * 依据 right（现实越弱越大）给出张力研判。
 * @param {Tension} t
 * @returns {{tone:('caution'|'negative'|'neutral'), text:string}}
 */
export function tensionVerdict(t) {
  if (!t || typeof t !== 'object' || typeof t.right !== 'number') {
    return { tone: 'neutral', text: '无有效张力配比，无法研判。' };
  }
  const r = t.right;
  const aName = t.a || '前项';
  const bName = t.b || '后项';

  if (r >= 60) {
    return {
      tone: 'negative',
      text: `${bName}显著弱于${aName}，背离张力偏大，现实端承压明显。`,
    };
  }
  if (r >= 53) {
    return {
      tone: 'caution',
      text: `${bName}略弱于${aName}，背离已现，需警惕张力进一步张开。`,
    };
  }
  if (r <= 47) {
    return {
      tone: 'caution',
      text: `${aName}相对偏强，但${bName}的滞后仍是隐忧，背离未消。`,
    };
  }
  return {
    tone: 'neutral',
    text: `${aName}与${bName}大体均衡，背离张力暂不显著。`,
  };
}

// ---------------------------------------------------------------------------
// 4. 纯函数：通缩与资金活化总体研判
//    平减/PPI 为负且剪刀差未修复 → 价格仍在通缩区、资金活化偏弱。
// ---------------------------------------------------------------------------

/** 取序列末值（最新一期）；空数组返回 null */
function lastOf(series) {
  return Array.isArray(series) && series.length ? series[series.length - 1] : null;
}

/**
 * 综合平减指数 / PPI / 核心 CPI / M1−M2 剪刀差末值，给出总体研判。
 * @param {HeadlineGauge[]} gauges
 * @returns {{label:string, tone:('caution'|'negative'|'neutral'), text:string}}
 */
export function deflationMood(gauges) {
  const list = Array.isArray(gauges) ? gauges : [];
  const byId = (id) => list.find((g) => g?.id === id);

  const deflator = lastOf(byId('gdpDeflator')?.series);
  const ppi = lastOf(byId('ppi')?.series);
  const core = lastOf(byId('coreCpi')?.series);
  const scissors = lastOf(byId('m1m2')?.series);

  if (deflator === null && ppi === null && scissors === null) {
    return { label: '研判暂缺', tone: 'neutral', text: '无主线指标读数，通缩与资金活化研判暂缺。' };
  }

  const priceNeg = (typeof deflator === 'number' && deflator < 0) || (typeof ppi === 'number' && ppi < 0);
  const bothPriceNeg = typeof deflator === 'number' && deflator < 0 && typeof ppi === 'number' && ppi < 0;
  const scissorsUnhealed = typeof scissors === 'number' && scissors < 0; // 负差=资金趴账未修复
  const coreCold = typeof core === 'number' && core <= 0.6; // 核心 CPI 低位=内需偏冷

  // —— 价格双负 + 剪刀差未修复：最重 ——
  if (bothPriceNeg && scissorsUnhealed) {
    return {
      label: '通缩区·资金活化偏弱',
      tone: 'negative',
      text: '平减指数与 PPI 同处负值，M1−M2 剪刀差仍为负差，价格仍在通缩区、资金活化偏弱，需求侧自我强化的冷意未解。',
    };
  }
  // —— 价格仍负，但剪刀差转正/收敛到位：边际改善 ——
  if (priceNeg && !scissorsUnhealed) {
    return {
      label: '价格仍冷·资金边际活化',
      tone: 'caution',
      text: '价格端仍在负区，但 M1−M2 剪刀差已修复转正，资金开始活化，价格回暖尚待需求确认。',
    };
  }
  // —— 价格仍负 + 剪刀差仍负但核心 CPI 未塌：偏弱待观察 ——
  if (priceNeg && scissorsUnhealed) {
    return {
      label: '通缩压力未消',
      tone: 'negative',
      text: '价格端处于负值、剪刀差仍为负差，通缩压力未消、资金活化不足，弱复苏缺乏价格与信用的双重确认。',
    };
  }
  // —— 价格转正：通缩压力缓解 ——
  if (!priceNeg) {
    return {
      label: '通缩压力缓解',
      tone: coreCold ? 'caution' : 'neutral',
      text: coreCold
        ? '平减指数与 PPI 已回正，但核心 CPI 仍低位，内需热度不足，复苏成色待夯实。'
        : '价格端回正、核心 CPI 企稳，通缩压力明显缓解，需求侧动能边际改善。',
    };
  }

  return { label: '方向待确认', tone: 'neutral', text: '主线指标方向交织，通缩与资金活化研判维持观望。' };
}
