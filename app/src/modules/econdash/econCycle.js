// ============================================================================
// 经济观测台 · 历史周期对照层（纯数据 / 纯函数，零 React / 零随机 / 零当前时间）
// ----------------------------------------------------------------------------
// 角色：把当前宏观位置投到三套长短周期坐标上——
//   ① 美林时钟四象限（短周期：增长 × 通胀）；
//   ② 康德拉季耶夫长波（数十年技术革命浪潮，呼应 /cognition 康波四季）；
//   ③ 中等收入陷阱轨迹（发展阶段坐标，呼应 /middleincometrap）。
//   并对照「十四五」收官达成度与「十五五」展望方向。
// 口径声明（最高优先级，全程贯彻）：
//   · 本层为「公开统计梳理 + 示意标定」近似值，标注基准日 CYCLE_ASOF；
//     象限定位、康波相位、陷阱研判均为分析示意，非官方分级、非预测。
//   · 五年规划目标用公开规划纲要口径；达成度（progress）为示意 / 估算，
//     以官方发布为准，绝不杜撰伪精确官方数字。
//   · 人均 GDP、轨迹值、门槛为公开口径近似值（美元，名义）。
//   · 全模块声明：公开统计梳理 · 示意标定 · 非投资建议 · 非预测。
// 确定性铁律：本层零随机、零当前时间；id / 排序 / 计数全程确定，基准日用常量。
// ============================================================================

import { AS_OF_BASELINE } from '../../lib/config/asOfBaseline.js';

// —— 蓝图四色（与 econUI.ECON_COLORS 同步，本层为纯数据故内联常量值）——
const CINNABAR = '#c44e3d'; // 朱砂：收缩 / 滞胀 / 衰退 / 警示
const TEAL = '#62a89e'; // 青：扩张 / 复苏 / 好转
const OCHRE = '#c99a4e'; // 赭：过热 / 财政视角
const INDIGO = '#8090c6'; // 黛：衰退 / 宏观叙事视角

/** 周期对照基准日（与各源层 ASOF 对齐；以官方发布为准） */
export const CYCLE_ASOF = AS_OF_BASELINE;

// ---------------------------------------------------------------------------
// 1. 美林时钟四象限（投资时钟：增长 × 通胀 两轴划四象限）
//    占优资产为经典美林时钟教科书结论的示意标定，非投资建议。
// ---------------------------------------------------------------------------

/**
 * @typedef {Object} ClockQuadrant
 * @property {('复苏'|'过热'|'滞胀'|'衰退')} id
 * @property {string} label  象限名
 * @property {string} color  蓝图四色
 * @property {string} desc   ≤30 字释义
 * @property {string} assets ≤16 字占优资产
 */

/** @type {ClockQuadrant[]} 美林时钟四象限（增长 × 通胀） */
export const CLOCK_QUADRANTS = [
  {
    id: '复苏',
    label: '复苏',
    color: TEAL,
    desc: '增长回升、通胀仍低，宽松渐起、盈利转好。',
    assets: '股票占优',
  },
  {
    id: '过热',
    label: '过热',
    color: OCHRE,
    desc: '增长与通胀双升，央行收紧、需求过旺。',
    assets: '大宗商品占优',
  },
  {
    id: '滞胀',
    label: '滞胀',
    color: CINNABAR,
    desc: '增长走弱而通胀高企，最难捱的两难象限。',
    assets: '现金占优',
  },
  {
    id: '衰退',
    label: '衰退/类衰退',
    color: INDIGO,
    desc: '增长与通胀同步走弱，需求疲、降息可期。',
    assets: '债券占优',
  },
];

// ---------------------------------------------------------------------------
// 2. 当前时钟定位（低通胀 + 弱增长口径 → 衰退 / 类衰退区）
//    x：增长轴 -100..100（负=低于潜在增速）；y：通胀轴 -100..100（负=低通胀/通缩压力）。
// ---------------------------------------------------------------------------

/**
 * @typedef {Object} CyclePosition
 * @property {string}   quadrantId 落点象限（'衰退'）
 * @property {number}   x          增长轴 -100..100
 * @property {number}   y          通胀轴 -100..100
 * @property {string}   text       ≤40 字定位研判
 * @property {string[]} evidence   3 条公开口径依据（≤24 字）
 */

/** @type {CyclePosition} 当前美林时钟定位 */
export const CYCLE_POSITION = {
  quadrantId: '衰退',
  x: -32, // 增长低于潜在增速：实际增速放缓、需求偏弱
  y: -46, // 通胀显著偏低：PPI 连负、核心 CPI 低位徘徊
  text: '低通胀叠加弱增长，落于衰退/类衰退区，宽松对冲与需求修复并行。',
  evidence: [
    'PPI 同比连续多月为负',
    '核心 CPI 长期低位徘徊',
    '社融与信贷脉冲偏弱',
  ],
};

// ---------------------------------------------------------------------------
// 3. 康德拉季耶夫长波定位（数十年技术革命浪潮，呼应 /cognition 康波四季）
//    第五波（信息技术）红利耗尽，处于「冬→春」过渡，第六波种子孕育中。
// ---------------------------------------------------------------------------

/**
 * @typedef {Object} KondratievPosition
 * @property {string}   wave        当前长波（'第五波·信息技术'）
 * @property {string}   season      康波四季相位
 * @property {string}   seasonColor 相位配色
 * @property {string}   text        ≤44 字研判
 * @property {string}   nextWave    下一波猜想
 * @property {string[]} seedTech    3 个下一波种子技术
 */

/** @type {KondratievPosition} 康波长波定位 */
export const KONDRATIEV = {
  wave: '第五波·信息技术',
  season: '冬·萧条 → 春·回升 过渡',
  seasonColor: INDIGO, // 冬季基调，向春季回暖过渡
  text: '信息技术旧红利渐耗尽，AI 与新能源正孕育下一波动能，处冬春之交。',
  nextWave: '第六波·智能/绿色?',
  seedTech: ['通用人工智能', '新能源与储能', '生物制造/合成生物'],
};

// ---------------------------------------------------------------------------
// 4. 中等收入陷阱轨迹（发展阶段坐标，呼应 /middleincometrap）
//    人均 GDP（美元，名义，公开口径近似）：临近高收入门槛、跨越窗口与陷阱风险并存。
// ---------------------------------------------------------------------------

/**
 * @typedef {Object} MiddleIncomeTrack
 * @property {number}   gdpPerCap     当前人均 GDP（美元，名义近似）
 * @property {number}   highThreshold 高收入门槛（美元，近似）
 * @property {number}   gapPct        距门槛百分比（正=尚差，负=已越）
 * @property {Array<{year:number,value:number}>} trajectory 近 8 年人均 GDP（升序）
 * @property {string[]} risks         3 个跨越风险（≤20 字）
 * @property {string[]} edges         3 个跨越优势（≤20 字）
 * @property {string}   verdict       一句≤36 字研判
 */

/** 当前人均 GDP（美元，名义近似） */
const GDP_PER_CAP = 13300;
/** 高收入门槛（世行口径近似，美元） */
const HIGH_THRESHOLD = 14000;

/** @type {MiddleIncomeTrack} 中等收入陷阱轨迹 */
export const MIDDLE_INCOME = {
  gdpPerCap: GDP_PER_CAP,
  highThreshold: HIGH_THRESHOLD,
  // gapPct：距门槛还差多少（%），正数表示尚未越线
  gapPct: Math.round(((HIGH_THRESHOLD - GDP_PER_CAP) / HIGH_THRESHOLD) * 1000) / 10,
  // 近 8 年人均 GDP（美元，名义，公开口径近似，升序）；
  // 2023 个别年份名义美元值受汇率扰动有微幅波动，此处按平滑近似取单调升序，以官方发布为准。
  trajectory: [
    { year: 2018, value: 9905 },
    { year: 2019, value: 10144 },
    { year: 2020, value: 10409 },
    { year: 2021, value: 12556 },
    { year: 2022, value: 12720 },
    { year: 2023, value: 12750 },
    { year: 2024, value: 13000 },
    { year: 2025, value: 13300 },
  ],
  risks: ['人口老龄化加速', '地方与企业债务高企', '中美科技封锁'],
  edges: ['全产业链配套', '工程师红利', '超大规模统一市场'],
  verdict: '已逼近高收入门槛，跨越窗口与陷阱风险并存，临界点上。',
};

// ---------------------------------------------------------------------------
// 5. 五年规划目标达成度（公开纲要口径；progress 为示意估算，以官方发布为准）
//    binding：约束性（硬指标）/ 预期性（引导性）。
//    status：达标(progress≥100) / 接近(85≤progress<100) / 滞后(progress<85)。
// ---------------------------------------------------------------------------

/**
 * @typedef {Object} PlanTarget
 * @property {string} name     指标名
 * @property {string} target   目标值文本
 * @property {string} latest   最新 / 收官值文本
 * @property {string} unit     单位
 * @property {number} progress 达成度 %（0–120，示意估算）
 * @property {('达标'|'接近'|'滞后')} status
 * @property {('约束性'|'预期性')} binding
 * @property {string} note     备注
 */

/** @type {{current:Object, next:Object}} 五年规划对照 */
export const FIVE_YEAR_PLANS = {
  current: {
    id: '十四五',
    span: '2021–2025',
    targets: [
      {
        name: '研发经费投入',
        target: '年均增长 >7%',
        latest: '年均增长约 8%+',
        unit: '%（年均）',
        progress: 105,
        status: '达标',
        binding: '预期性',
        note: 'R&D 经费持续高于 GDP 增速，达成度示意，以官方发布为准。',
      },
      {
        name: '常住人口城镇化率',
        target: '65',
        latest: '约 67',
        unit: '%',
        progress: 103,
        status: '达标',
        binding: '预期性',
        note: '城镇化率稳步抬升并越过目标线，估算值。',
      },
      {
        name: '单位 GDP 能耗下降',
        target: '13.5',
        latest: '累计降约 11–12',
        unit: '%（累计）',
        progress: 85,
        status: '接近',
        binding: '约束性',
        note: '能耗强度收官冲刺，进度偏紧，达成度示意。',
      },
      {
        name: '单位 GDP CO₂ 排放下降',
        target: '18',
        latest: '累计降约 14–15',
        unit: '%（累计）',
        progress: 81,
        status: '滞后',
        binding: '约束性',
        note: '碳强度下降进度承压，估算值，以官方发布为准。',
      },
      {
        name: '森林覆盖率',
        target: '24.1',
        latest: '约 24.5+',
        unit: '%',
        progress: 102,
        status: '达标',
        binding: '约束性',
        note: '森林覆盖率提前达标，估算值。',
      },
      {
        name: '数字经济核心产业增加值占 GDP',
        target: '10',
        latest: '约 9.5–10',
        unit: '%',
        progress: 96,
        status: '接近',
        binding: '预期性',
        note: '数字经济核心产业占比逼近目标，达成度示意。',
      },
      {
        name: '居民人均可支配收入增长',
        target: '与 GDP 增长同步',
        latest: '基本同步、略偏弱',
        unit: '同步性',
        progress: 95,
        status: '接近',
        binding: '预期性',
        note: '收入增速与 GDP 大体同步，结构性偏弱，示意判定。',
      },
      {
        name: '每万人口高价值发明专利',
        target: '12',
        latest: '约 13–14',
        unit: '件',
        progress: 110,
        status: '达标',
        binding: '预期性',
        note: '高价值发明专利密度提前超额，估算值。',
      },
    ],
  },
  next: {
    id: '十五五',
    span: '2026–2030',
    outlook: [
      { name: '科技自立自强', aim: '攻坚关键核心技术、补链强链' },
      { name: '新质生产力', aim: 'AI＋制造、未来产业育新动能' },
      { name: '内需与消费', aim: '扩内需提振消费、畅通大循环' },
      { name: '绿色低碳转型', aim: '稳步迈向碳达峰、能源结构调优' },
      { name: '人口与民生', aim: '应对老龄化、健全生育与养老' },
      { name: '高水平开放', aim: '稳外贸外资、制度型开放扩围' },
    ],
  },
};

// ---------------------------------------------------------------------------
// 6. 纯函数：规划达成度盘点
// ---------------------------------------------------------------------------

/**
 * planTally — 统计一份规划（含 targets）的达成度分布。
 * @param {{targets:PlanTarget[]}} plan
 * @returns {{total:number, 达标:number, 接近:number, 滞后:number, rate:number, text:string}}
 */
export function planTally(plan) {
  const targets = (plan && Array.isArray(plan.targets)) ? plan.targets : [];
  const total = targets.length;
  let ok = 0;
  let near = 0;
  let lag = 0;
  for (const t of targets) {
    if (t.status === '达标') ok += 1;
    else if (t.status === '接近') near += 1;
    else if (t.status === '滞后') lag += 1;
  }
  const rate = total > 0 ? Math.round((ok / total) * 1000) / 10 : 0;
  const text = `共 ${total} 项：达标 ${ok} · 接近 ${near} · 滞后 ${lag}，达标率约 ${rate}%（示意估算，以官方发布为准）。`;
  return { total, 达标: ok, 接近: near, 滞后: lag, rate, text };
}

// ---------------------------------------------------------------------------
// 7. 纯函数：三套坐标合成研判
// ---------------------------------------------------------------------------

/**
 * cycleSummary — 把时钟 / 康波 / 中等收入三坐标各凝成一句合成研判。
 * @returns {{clock:string, kondratiev:string, middleIncome:string}}
 */
export function cycleSummary() {
  const quad = CLOCK_QUADRANTS.find((q) => q.id === CYCLE_POSITION.quadrantId);
  const quadLabel = quad ? quad.label : CYCLE_POSITION.quadrantId;
  return {
    clock: `美林时钟落于「${quadLabel}」象限：${CYCLE_POSITION.text}`,
    kondratiev: `康波处「${KONDRATIEV.season}」（${KONDRATIEV.wave}）：${KONDRATIEV.text}`,
    middleIncome: `人均 GDP 约 ${MIDDLE_INCOME.gdpPerCap} 美元，距高收入门槛约 ${MIDDLE_INCOME.gapPct}%——${MIDDLE_INCOME.verdict}`,
  };
}
