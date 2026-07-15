// ============================================================================
// 经济驾驶舱 · NBS 公开口径指标层 + 金丝雀领先指标 + 三次产业（纯数据 / 纯函数）
// ----------------------------------------------------------------------------
// 口径声明（最高优先级，全程贯彻）：
//   · 本文件为「国家统计局（NBS）公开口径快照」+「公开数据派生的领先信号示意」，
//     标注 AS_OF；以官方最新发布为准。
//   · 三次产业占比/增速、收入分配、新经济占比均为公开口径近似值；
//     凡不确定的精确值一律标注「估算 / 示意 / 预估」，不杜撰伪官方小数。
//   · 金丝雀 / 领先指标的红绿研判（signal）为示意标定，非官方分级、非预测。
//   · 全模块声明：公开统计梳理 · 示意标定 · 非投资建议 · 非预测。
// 确定性铁律：本层零随机、零当前时间；基准日用常量 ECON_AS_OF。
// ============================================================================

import { AS_OF_BASELINE } from '../../lib/config/asOfBaseline.js';

/** 基准快照日（所有 asOf 默认对齐此日；以官方发布为准） */
export const ECON_AS_OF = AS_OF_BASELINE;

/**
 * 数据实际更新时点（最近一次纳入官方发布的日期）。
 * ----------------------------------------------------------------------------
 * 与全局基准日 ECON_AS_OF（2026-07-14，看板口径基准）刻意分离：本值追踪「经济
 * 大盘数据最近一次对齐官方发布的时点」。2026-07-15 国家统计局公布 2026 上半年
 * （H1）数据，本层 KEY_INDICATORS / SECTOR_STRUCTURE / INCOME_DIST 已同步至该批
 * 发布，故取发布日 2026-07-15。陈旧判定（见 lib/time/dataFreshness.js）以此值为
 * 数据时间戳，计算「实时时间 − 数据时间戳」间隔。后续每次纳入新一轮官方发布，
 * 只需上调此常量。
 */
export const ECON_DATA_AS_OF = '2026-07-15';

// ---------------------------------------------------------------------------
// 1. 三次产业结构（2018–2025，占 GDP 比重 % + 实际 GDP 增速 %）
//    占比为公开口径近似值，三产之和经四舍五入后落在 98–102 区间；
//    2025 为预估标注（estimated:true）。
// ---------------------------------------------------------------------------

/**
 * @typedef {Object} SectorYear
 * @property {number}  year      年份
 * @property {number}  agri      第一产业占 GDP 比重（%，近似）
 * @property {number}  ind       第二产业占 GDP 比重（%，近似）
 * @property {number}  srv       第三产业占 GDP 比重（%，近似）
 * @property {number}  gdpGrowth 实际 GDP 增速（%，公开口径）
 * @property {boolean} [estimated] 是否为预估值
 */

/** @type {SectorYear[]} 三次产业近 8 年（占比 %，和≈100；增速 %） */
export const SECTOR_STRUCTURE = [
  { year: 2018, agri: 7.0, ind: 40.7, srv: 52.3, gdpGrowth: 6.7 },
  { year: 2019, agri: 7.1, ind: 38.6, srv: 54.3, gdpGrowth: 6.0 },
  { year: 2020, agri: 7.7, ind: 37.8, srv: 54.5, gdpGrowth: 2.2 },
  { year: 2021, agri: 7.3, ind: 39.4, srv: 53.3, gdpGrowth: 8.4 },
  { year: 2022, agri: 7.3, ind: 39.9, srv: 52.8, gdpGrowth: 3.0 },
  { year: 2023, agri: 7.1, ind: 38.3, srv: 54.6, gdpGrowth: 5.2 },
  { year: 2024, agri: 6.8, ind: 36.5, srv: 56.7, gdpGrowth: 5.0 },
  { year: 2025, agri: 6.7, ind: 36.0, srv: 57.3, gdpGrowth: 4.8, estimated: true },
  { year: 2026, agri: 6.6, ind: 35.8, srv: 57.6, gdpGrowth: 4.7, estimated: true, note: '2026 上半年实际同比 +4.7%（一季 5.0 / 二季 4.3，二季环比 +0.9%）· 占比为全年估算 · 十五五开局' },
];

/**
 * @typedef {Object} SectorMeta
 * @property {('agri'|'ind'|'srv')} id
 * @property {string} label
 * @property {string} color
 * @property {string} desc
 */

/** @type {SectorMeta[]} 三次产业元信息（id / 标签 / 配色 / 释义） */
export const SECTORS = [
  {
    id: 'agri',
    label: '第一产业',
    color: '#10b981',
    desc: '农林牧渔。占比长期下滑但绝对值刚性，关乎口粮安全与城乡剪刀差的底盘。',
  },
  {
    id: 'ind',
    label: '第二产业',
    color: '#e8a317',
    desc: '工业与建筑业。从地产-基建拉动转向制造业与高技术装备，是出口与就业的承重墙。',
  },
  {
    id: 'srv',
    label: '第三产业',
    color: '#22d3ee',
    desc: '服务业。占比过半且持续抬升，吸纳新增就业的主通道，景气随消费与信心起伏。',
  },
];

// ---------------------------------------------------------------------------
// 2. 主要月度 / 季度经济指标快照（NBS 公开口径近似值，标注 asOf）
//    PMI 类 threshold=50（荣枯线）；good 表示该指标「越高越好 / 越低越好 / 落在
//    合意区间为好」。值为公开口径近似快照，以官方发布为准。
// ---------------------------------------------------------------------------

/**
 * @typedef {Object} KeyIndicator
 * @property {string} id
 * @property {string} label
 * @property {('物价'|'景气'|'就业'|'货币'|'需求')} group
 * @property {number} value      最新读数
 * @property {string} unit       单位
 * @property {number} yoy        同比（%）
 * @property {number|null} mom    环比（%；无环比口径则 null）
 * @property {('up'|'down'|'flat')} trend 近月趋势（示意研判）
 * @property {number|null} threshold 荣枯 / 警戒线（无则 null）
 * @property {('high'|'low'|'band')} good 好的方向
 * @property {string} asOf       数据基准日
 * @property {string} note       口径备注
 */

/** @type {KeyIndicator[]} 主要经济指标快照（≥10 项；近似值，以官方发布为准） */
export const KEY_INDICATORS = [
  {
    id: 'cpi',
    label: 'CPI 居民消费价格',
    group: '物价',
    value: 1.0,
    unit: '% 同比',
    yoy: 1.0,
    mom: -0.3,
    trend: 'up',
    threshold: null,
    good: 'band',
    asOf: ECON_AS_OF,
    note: '上半年同比 +1.0%，核心 CPI +1.2%；6 月同比 +1.0%、环比 -0.3%。温和上涨，猪肉 -13.4% 拖累食品，服务与耐用品带动核心回暖。（2026 上半年·NBS）',
  },
  {
    id: 'ppi',
    label: 'PPI 工业生产者出厂价',
    group: '物价',
    value: 4.1,
    unit: '% 同比',
    yoy: 4.1,
    mom: -0.3,
    trend: 'up',
    threshold: 0,
    good: 'band',
    asOf: ECON_AS_OF,
    note: '6 月同比 +4.1%（涨幅扩大 0.2pct），上半年累计 +1.5%，结束长期通缩转正；生产资料 +2.2%、采掘 +4.8% 领涨，生活资料仍 -1.2%。（2026 上半年·NBS）',
  },
  {
    id: 'pmi_mfg',
    label: '制造业 PMI',
    group: '景气',
    value: 50.3,
    unit: '点',
    yoy: 0.5,
    mom: 0.3,
    trend: 'up',
    threshold: 50,
    good: 'high',
    asOf: ECON_AS_OF,
    note: '6 月制造业 PMI 50.3，较上月升 0.3pct 重回荣枯线上方；生产经营活动预期指数 54.3。（2026 6 月·NBS）',
  },
  {
    id: 'pmi_nonmfg',
    label: '非制造业 PMI',
    group: '景气',
    value: 50.4,
    unit: '点',
    yoy: 0.2,
    mom: 0.1,
    trend: 'up',
    threshold: 50,
    good: 'high',
    asOf: ECON_AS_OF,
    note: '6 月服务业商务活动指数 50.4（升 0.1pct）；电信/互联网/货币金融/保险等位于 55 以上高景气区间。（2026 6 月·NBS）',
  },
  {
    id: 'urban_unemp',
    label: '城镇调查失业率',
    group: '就业',
    value: 5.0,
    unit: '%',
    yoy: 0.0,
    mom: -0.1,
    trend: 'down',
    threshold: 5.5,
    good: 'low',
    asOf: ECON_AS_OF,
    note: '6 月 5.0%（环比 -0.1pct），上半年均值 5.2%；31 大城市 5.0%。总量平稳，青年与结构性压力另见金丝雀盘。（2026 上半年·NBS）',
  },
  {
    id: 'm2',
    label: 'M2 货币供应增速',
    group: '货币',
    value: 7.2,
    unit: '% 同比',
    yoy: 7.2,
    mom: null,
    trend: 'flat',
    threshold: null,
    good: 'band',
    asOf: ECON_AS_OF,
    note: '广义货币增速；高于名义 GDP 即偏宽松，但传导到实体仍偏弱；近似值。',
  },
  {
    id: 'afre',
    label: '社融存量增速',
    group: '货币',
    value: 8.4,
    unit: '% 同比',
    yoy: 8.4,
    mom: null,
    trend: 'flat',
    threshold: null,
    good: 'high',
    asOf: ECON_AS_OF,
    note: '社会融资规模存量同比；政府债拉动为主，企业中长贷需求偏弱；近似值。',
  },
  {
    id: 'retail',
    label: '社会消费品零售总额',
    group: '需求',
    value: 1.3,
    unit: '% 同比累计',
    yoy: 1.3,
    mom: 0.38,
    trend: 'down',
    threshold: null,
    good: 'high',
    asOf: ECON_AS_OF,
    note: '上半年社零 248722 亿元 +1.3%（6 月 +1.0%、环比 +0.38%）；服务零售 +5.3% 明显强于商品 +1.1%，通讯器材 +14.4%、餐饮 +2.8%。需求侧仍偏弱。（2026 上半年·NBS）',
  },
  {
    id: 'fai',
    label: '固定资产投资',
    group: '需求',
    value: -5.7,
    unit: '% 同比累计',
    yoy: -5.7,
    mom: -0.37,
    trend: 'down',
    threshold: null,
    good: 'high',
    asOf: ECON_AS_OF,
    note: '上半年固投（不含农户）226370 亿元 -5.7%（扣除地产 -2.7%）；地产开发投资 -18.0%、制造业 -1.2%、基建 -2.4%、民间 -8.5% 齐拖累；知识产权产品投资 +9.4%、高技术产业投资 +4.6% 逆势。（2026 上半年·NBS）',
  },
  {
    id: 'gdp_h1',
    label: 'GDP 累计增速',
    group: '需求',
    value: 4.7,
    unit: '% H1 同比',
    yoy: 4.7,
    mom: 0.9,
    trend: 'down',
    threshold: null,
    good: 'high',
    asOf: ECON_AS_OF,
    note: '上半年 GDP 695704 亿元 +4.7%（一季 5.0、二季 4.3，二季环比 +0.9%）；增量 3.6 万亿元为近五年同期最大。十五五开局运行在合理区间。（2026 上半年·NBS）',
  },
  {
    id: 'iva',
    label: '规上工业增加值',
    group: '需求',
    value: 5.4,
    unit: '% 同比累计',
    yoy: 5.4,
    mom: 0.76,
    trend: 'up',
    threshold: null,
    good: 'high',
    asOf: ECON_AS_OF,
    note: '上半年规上工业 +5.4%（6 月 +5.3%、环比 +0.76%）；装备制造 +9.3%、高技术制造 +13.3%；3D 打印 +48.5%、锂电池 +39.3%、工业机器人 +28.0%。供给端偏强。（2026 上半年·NBS）',
  },
  {
    id: 'export',
    label: '出口（人民币计）',
    group: '需求',
    value: 13.4,
    unit: '% 同比',
    yoy: 13.4,
    mom: null,
    trend: 'up',
    threshold: null,
    good: 'high',
    asOf: ECON_AS_OF,
    note: '上半年出口 14.73 万亿元 +13.4%（进口 +22.1%、进出口 25.47 万亿元 +16.9%）；机电产品出口 +20.1% 占比 63.5%，民企占进出口 57.0%。（2026 上半年·NBS，海关口径）',
  },
  {
    id: 'new_afre',
    label: '新增社会融资',
    group: '货币',
    value: 2.1,
    unit: '万亿元/月',
    yoy: -8.0,
    mom: null,
    trend: 'down',
    threshold: null,
    good: 'high',
    asOf: ECON_AS_OF,
    note: '当月新增社融；总量受季节与政府债节奏影响，同比波动大；近似值。',
  },
];

// ---------------------------------------------------------------------------
// 2b. 核心指标近程序列（公开口径近似 · 近八期升序；无序列者不杜撰）
//     gdp_h1 取自 SECTOR_STRUCTURE 增速；其余与 dashboard / 通缩主线同源。
// ---------------------------------------------------------------------------

/** @type {Record<string, number[]>} KEY_INDICATORS.id → 近八期读数（升序） */
export const INDICATOR_SPARKLINES = {
  gdp_h1: SECTOR_STRUCTURE.slice(-8).map((s) => s.gdpGrowth),
  cpi: [-0.1, 0.1, 0.3, 0.5, 0.6, 0.8, 0.9, 1.0],
  ppi: [-2.8, -2.6, -1.8, -0.6, 0.4, 1.5, 2.8, 4.1],
  pmi_mfg: [49.4, 49.7, 49.8, 49.6, 49.9, 50.0, 50.1, 50.3],
  retail: [4.8, 4.6, 3.9, 3.2, 2.6, 2.0, 1.5, 1.3],
  m2: [8.3, 8.1, 7.9, 7.6, 7.4, 7.1, 7.0, 7.2],
};

/** Tab 深链白名单（worldbank 别名 wb 在 Page 路由层解析） */
export const ECON_TAB_IDS = ['macro', 'structure', 'finance', 'regional', 'canary', 'worldbank'];

/** 经济大盘路由 · tab=canary|worldbank|macro|… */
export function econTabPath(tab = 'macro') {
  const id = tab === 'wb' ? 'worldbank' : tab;
  if (!id || id === 'macro' || !ECON_TAB_IDS.includes(id)) return '/econ-dashboard';
  return `/econ-dashboard?tab=${id}`;
}

/** 取指标火花线序列（无则 null） */
export function indicatorSparkline(id) {
  const pts = INDICATOR_SPARKLINES[id];
  return Array.isArray(pts) && pts.length ? pts : null;
}

// ---------------------------------------------------------------------------
// 3. 金丝雀 / 领先指标盘（公开数据派生的领先信号示意，非官方分级）
//    signal 三档示意研判：green 稳 / amber 转弱 / red 承压。
// ---------------------------------------------------------------------------

/**
 * @typedef {Object} CanarySignal
 * @property {string} id
 * @property {string} label
 * @property {string} proxy   代理含义（≤16 字）
 * @property {('green'|'amber'|'red')} signal 示意研判
 * @property {string} reading 读数文本（≤18 字）
 * @property {string} lead    领先意义（≤24 字）
 * @property {string} source  数据来源
 */

/** @type {CanarySignal[]} 金丝雀盘（≥8 项；红绿为示意标定） */
export const CANARY_SIGNALS = [
  {
    id: 'power',
    label: '全社会用电量',
    proxy: '实体生产真实活跃度',
    signal: 'green',
    reading: '同比约 +6.1%，工业用电回暖',
    lead: '比工业增加值更难注水，先于产出回升',
    source: '能源局 / 中电联 公开口径',
  },
  {
    id: 'rail',
    label: '铁路货运量',
    proxy: '大宗与重工业运输',
    signal: 'amber',
    reading: '同比微增 +1.8%，煤炭运输偏弱',
    lead: '反映重工业与基建实物量节奏',
    source: '国铁集团 公开口径',
  },
  {
    id: 'midloan',
    label: '中长期贷款',
    proxy: '企业扩张投资意愿',
    signal: 'red',
    reading: '企业中长贷同比少增',
    lead: '领先制造业投资与产能扩张 1–2 季',
    source: '人民银行 信贷收支表',
  },
  {
    id: 'excavator',
    label: '挖掘机开工小时',
    proxy: '基建与地产实物开工',
    signal: 'amber',
    reading: '开工小时同比仍在荣枯下方',
    lead: '领先基建投资落地约 1 季',
    source: '工程机械协会 公开口径',
  },
  {
    id: 'pmi_order',
    label: 'PMI 新订单',
    proxy: '制造业需求前瞻',
    signal: 'amber',
    reading: '新订单分项 49.2 · 荣枯线下',
    lead: '领先工业产出与出口交货约 1–2 月',
    source: 'NBS 制造业 PMI 分项',
  },
  {
    id: 'land',
    label: '土地出让收入',
    proxy: '地方财力与地产预期',
    signal: 'red',
    reading: '同比深度下滑，房企拿地谨慎',
    lead: '领先地产投资与地方支出 2–3 季',
    source: '财政部 政府性基金口径',
  },
  {
    id: 'house_price',
    label: '百城房价',
    proxy: '居民资产负债表信心',
    signal: 'red',
    reading: '二手房价环比仍在探底',
    lead: '领先消费与按揭意愿，拖累内需',
    source: '中指院 / 公开监测口径',
  },
  {
    id: 'port',
    label: '港口集装箱吞吐',
    proxy: '外贸实物量景气',
    signal: 'green',
    reading: '吞吐量同比稳增，出口韧性',
    lead: '领先出口金额数据约半月',
    source: '交通运输部 港口口径',
  },
  {
    id: 'youth_unemp',
    label: '青年失业率',
    proxy: '结构性就业压力',
    signal: 'red',
    reading: '16–24 岁失业率 16.8%',
    lead: '领先消费信心与社会预期',
    source: 'NBS 分年龄调查口径',
  },
  {
    id: 'consumer_heat',
    label: '票房 / 餐饮景气',
    proxy: '居民消费意愿温度',
    signal: 'amber',
    reading: '票房 H1 同比 −8% · 餐饮客单承压',
    lead: '高频反映服务消费冷热，先于零售月报',
    source: '猫眼 / 餐饮协会 公开口径',
  },
  {
    id: 'export_resilience',
    label: '出口交货值',
    proxy: '外需与产业链韧性',
    signal: 'green',
    reading: 'H1 同比 +9.7% · 机电/新三样支撑',
    lead: '领先海关金额约 2 周，反映外需温度',
    source: 'NBS 工业企业口径',
  },
  {
    id: 'fiscal_pulse',
    label: '广义财政支出',
    proxy: '逆周期发力强度',
    signal: 'amber',
    reading: 'H1 支出 +3.8% · 专项债前置',
    lead: '领先基建实物量 1–2 季，十五五开局财政靠前',
    source: '财政部 公开口径',
  },
];

// ---------------------------------------------------------------------------
// 4. 收入分配（基尼系数近 10 年序列 + 城乡比 + 五分位倍数，公开口径近似）
// ---------------------------------------------------------------------------

/** 收入分配快照（公开口径近似 / 估算示意） */
export const INCOME_DIST = {
  /** @type {{year:number, value:number}[]} 基尼系数近 10 年（公开口径近似） */
  giniSeries: [
    { year: 2016, value: 0.465 },
    { year: 2017, value: 0.467 },
    { year: 2018, value: 0.468 },
    { year: 2019, value: 0.465 },
    { year: 2020, value: 0.468 },
    { year: 2021, value: 0.466 },
    { year: 2022, value: 0.467 },
    { year: 2023, value: 0.465 },
    { year: 2024, value: 0.463 },
    { year: 2025, value: 0.462 },
  ],
  urbanRuralRatio: 2.37,        // 城乡居民人均可支配收入比（2026 上半年口径，以农村为1）
  top20bottom20: 10.2,          // 高低 20% 收入五分位倍数（估算示意）
  residentIncomeGrowth: 4.2,    // 居民人均可支配收入实际增速（%；2026 上半年 22981 元，名义 +5.2%）
  note: '基尼系数长期在 0.46–0.47 高位窄幅波动，国际警戒线 0.4；2026 上半年居民人均可支配收入 22981 元、实际增长 4.2%（农村 5.5% 快于城镇 3.4%），城乡比缩至 2.37 但绝对差距仍大；五分位倍数为估算示意。以官方发布为准。',
};

// ---------------------------------------------------------------------------
// 5. 新经济占比（公开口径近似 + 示意标定）
// ---------------------------------------------------------------------------

/**
 * @typedef {Object} NewEconomyItem
 * @property {string} id
 * @property {string} label
 * @property {number} share   占 GDP / 相关比重（%，近似）
 * @property {number} growth  增速（%，近似）
 * @property {string} note
 */

/** @type {NewEconomyItem[]} 新经济六维（占比/增速为公开口径近似+示意标定） */
export const NEW_ECONOMY = [
  { id: 'digital', label: '数字经济', share: 43.5, growth: 8.5, note: '占 GDP 比重近四成半，为增长第一引擎；口径含数字产业化与产业数字化，近似值。' },
  { id: 'platform', label: '平台经济', share: 13.0, growth: 6.0, note: '电商/外卖/出行等平台增加值占比，监管常态化后回归温和增长；估算示意。' },
  { id: 'nev', label: '新能源汽车', share: 3.5, growth: 28.0, note: '产销渗透率已过半，相关产业链增加值占比；高增速但基数渐大，近似值。' },
  { id: 'green', label: '绿色低碳', share: 8.0, growth: 12.0, note: '清洁能源/节能环保/碳市场相关，新三样出口的底盘；占比为估算示意。' },
  { id: 'biopharma', label: '生物医药', share: 3.2, growth: 9.0, note: '创新药/医疗器械/CXO，受集采与出海双重影响；占比近似、示意标定。' },
  { id: 'silver', label: '银发经济', share: 6.5, growth: 10.0, note: '养老/康养/适老消费，随老龄化扩容的长坡赛道；规模占比为估算示意。' },
];

// ---------------------------------------------------------------------------
// 6. 纯函数：单指标研判
// ---------------------------------------------------------------------------

/**
 * 综合 good 方向 + 是否越过 threshold + trend，给出一句冷峻研判。
 * @param {KeyIndicator} ind
 * @returns {{tone:('positive'|'caution'|'negative'|'neutral'), text:string}}
 */
export function indicatorVerdict(ind) {
  if (!ind || typeof ind !== 'object') {
    return { tone: 'neutral', text: '无有效读数，无法研判。' };
  }
  const { good, threshold, trend, value, label } = ind;
  const name = label || '该指标';
  const up = trend === 'up';
  const down = trend === 'down';

  // —— good:'high'（越高越好，含荣枯线类）——
  if (good === 'high') {
    const overLine = typeof threshold === 'number' ? value >= threshold : null;
    if (overLine === true) {
      if (up) return { tone: 'positive', text: `${name}站上荣枯线并继续上行，景气扩张得到确认。` };
      if (down) return { tone: 'caution', text: `${name}虽在荣枯线上方，但动能转弱，扩张基础不稳。` };
      return { tone: 'positive', text: `${name}守在荣枯线上方，景气勉力维持扩张。` };
    }
    if (overLine === false) {
      if (down) return { tone: 'negative', text: `${name}跌破荣枯线且仍在下探，收缩压力加剧。` };
      if (up) return { tone: 'caution', text: `${name}仍在荣枯线下方，但已现回升迹象，等待确认。` };
      return { tone: 'caution', text: `${name}在荣枯线下方徘徊，景气偏弱。` };
    }
    // 无阈值的「越高越好」类（消费/投资/出口/社融增速）
    if (up) return { tone: 'positive', text: `${name}增速回升，需求侧动能改善。` };
    if (down) return { tone: 'negative', text: `${name}增速回落，需求侧动能走弱。` };
    return { tone: 'neutral', text: `${name}增速大体平稳，缺乏方向。` };
  }

  // —— good:'low'（越低越好，如失业率）——
  if (good === 'low') {
    const overLine = typeof threshold === 'number' ? value >= threshold : null;
    if (overLine === true) {
      return { tone: 'negative', text: `${name}已触及警戒区，压力显性化。` };
    }
    if (up) return { tone: 'caution', text: `${name}抬升，压力累积但尚未破线。` };
    if (down) return { tone: 'positive', text: `${name}回落，压力边际缓解。` };
    return { tone: 'neutral', text: `${name}基本平稳，压力可控。` };
  }

  // —— good:'band'（落在合意区间为好，如 CPI/PPI/M2）——
  if (good === 'band') {
    // 物价类：明显低于合意（≤0.5% 同比附近）且下行 → 通缩警示
    const isPrice = ind.group === '物价';
    if (isPrice && typeof value === 'number' && value <= 0.5) {
      if (down) return { tone: 'negative', text: `${name}低位且继续下行，通缩压力正在自我强化。` };
      return { tone: 'caution', text: `${name}贴近零轴，需求偏冷、通缩风险未消。` };
    }
    if (isPrice && typeof value === 'number' && value < 0) {
      return down
        ? { tone: 'negative', text: `${name}负增长且仍在下探，价格通缩深化。` }
        : { tone: 'caution', text: `${name}处于负值，价格端持续承压。` };
    }
    if (up) return { tone: 'caution', text: `${name}抬升，需关注是否偏离合意区间。` };
    if (down) return { tone: 'caution', text: `${name}回落，需关注是否偏冷。` };
    return { tone: 'neutral', text: `${name}处于合意区间内，暂无明显偏离。` };
  }

  return { tone: 'neutral', text: `${name}方向不明，维持观望。` };
}

// ---------------------------------------------------------------------------
// 7. 纯函数：金丝雀盘点 + 总体景气研判
// ---------------------------------------------------------------------------

/**
 * 统计金丝雀红绿琥珀计数并给出一句总体景气研判。
 * @param {CanarySignal[]} signals
 * @returns {{green:number, amber:number, red:number, mood:string}}
 */
export function canaryTally(signals) {
  const list = Array.isArray(signals) ? signals : [];
  let green = 0, amber = 0, red = 0;
  for (const s of list) {
    if (s?.signal === 'green') green += 1;
    else if (s?.signal === 'amber') amber += 1;
    else if (s?.signal === 'red') red += 1;
  }
  const total = green + amber + red;

  let mood;
  if (total === 0) {
    mood = '无领先指标读数，景气研判暂缺。';
  } else if (red === 0 && amber <= green) {
    mood = '金丝雀普遍报绿，领先信号指向景气企稳回升。';
  } else if (red >= Math.ceil(total / 2)) {
    mood = '逾半金丝雀报红，地产-财政链条仍是主要拖累，复苏缺乏弹性。';
  } else if (red >= green) {
    mood = '红多于绿，结构性承压明显，弱复苏在生产端与外贸的韧性中艰难维持。';
  } else {
    mood = '红绿交织、琥珀居多，景气处于政策托底下的低位震荡，方向尚未明朗。';
  }
  return { green, amber, red, mood };
}

// ---------------------------------------------------------------------------
// 8. 纯函数：经济全景速读（Markdown）
// ---------------------------------------------------------------------------

/** 格式化带符号百分数：3.6 → '+3.6%'，-2.8 → '-2.8%' */
function fmtPct(n, unit = '%') {
  if (typeof n !== 'number' || !Number.isFinite(n)) return '--';
  const sign = n > 0 ? '+' : '';
  return `${sign}${n}${unit}`;
}

/**
 * 生成经济全景速读 Markdown（三次产业 / 核心指标异常项 / 金丝雀景气 /
 * 收入分配 / 尾注口径声明）。
 * @param {Object} [ctx]
 * @param {string} [ctx.asOf]
 * @param {SectorYear[]} [ctx.sectors]
 * @param {KeyIndicator[]} [ctx.indicators]
 * @param {CanarySignal[]} [ctx.canaries]
 * @param {typeof INCOME_DIST} [ctx.income]
 * @returns {string} Markdown 文本
 */
export function buildEconReport(ctx = {}) {
  const asOf = ctx.asOf || ECON_AS_OF;
  const sectors = Array.isArray(ctx.sectors) && ctx.sectors.length ? ctx.sectors : SECTOR_STRUCTURE;
  const indicators = Array.isArray(ctx.indicators) && ctx.indicators.length ? ctx.indicators : KEY_INDICATORS;
  const canaries = Array.isArray(ctx.canaries) && ctx.canaries.length ? ctx.canaries : CANARY_SIGNALS;
  const income = ctx.income || INCOME_DIST;

  const latest = sectors[sectors.length - 1];
  const first = sectors[0];
  const lines = [];

  // —— 标题 ——
  lines.push('# 中国经济全景速读');
  lines.push('');
  lines.push(`> 数据基准：${asOf} · 公开统计梳理 · 示意标定 · 非投资建议 · 非预测`);
  lines.push('');

  // —— 三次产业 ——
  lines.push('## 一、三次产业：服务业过半，工业守底盘');
  lines.push('');
  if (latest && first) {
    const estTag = latest.estimated ? '（预估）' : '';
    lines.push(
      `${latest.year} 年${estTag}三次产业占比约为 第一产业 ${latest.agri}% / 第二产业 ${latest.ind}% / ` +
      `第三产业 ${latest.srv}%，实际 GDP 增速 ${fmtPct(latest.gdpGrowth)}。`,
    );
    const srvShift = +(latest.srv - first.srv).toFixed(1);
    const indShift = +(latest.ind - first.ind).toFixed(1);
    lines.push('');
    lines.push(
      `较 ${first.year} 年，第三产业占比变动 ${fmtPct(srvShift, ' pct')}、第二产业 ${fmtPct(indShift, ' pct')}，` +
      '结构由地产-基建拉动转向服务业与高技术制造，但工业仍是就业与出口的承重墙。',
    );
  }
  lines.push('');

  // —— 核心指标异常项 ——
  lines.push('## 二、核心指标：异常项扫描');
  lines.push('');
  const flagged = indicators
    .map((ind) => ({ ind, v: indicatorVerdict(ind) }))
    .filter(({ v }) => v.tone === 'negative' || v.tone === 'caution');
  if (flagged.length === 0) {
    lines.push('- 暂无触发警示的指标，主要读数落在合意区间。');
  } else {
    for (const { ind, v } of flagged) {
      const mark = v.tone === 'negative' ? '🔴' : '🟠';
      lines.push(`- ${mark} **${ind.label}**：${ind.value}${ind.unit}（同比 ${fmtPct(ind.yoy)}）—— ${v.text}`);
    }
  }
  lines.push('');

  // —— 金丝雀景气 ——
  const tally = canaryTally(canaries);
  lines.push('## 三、金丝雀盘：领先信号景气');
  lines.push('');
  lines.push(`绿灯 ${tally.green} · 琥珀 ${tally.amber} · 红灯 ${tally.red}。${tally.mood}`);
  lines.push('');
  const reds = canaries.filter((c) => c?.signal === 'red');
  if (reds.length) {
    lines.push('报红的领先指标：');
    for (const c of reds) {
      lines.push(`- **${c.label}**（${c.proxy}）：${c.reading}；领先意义——${c.lead}。`);
    }
    lines.push('');
  }

  // —— 收入分配 ——
  lines.push('## 四、收入分配：高位窄幅，差距刚性');
  lines.push('');
  if (income && Array.isArray(income.giniSeries) && income.giniSeries.length) {
    const g = income.giniSeries[income.giniSeries.length - 1];
    lines.push(
      `最新基尼系数约 ${g.value}（${g.year}），长期在国际警戒线 0.4 上方的 0.46–0.47 区间窄幅波动；` +
      `城乡收入比约 ${income.urbanRuralRatio}，高低 20% 五分位倍数约 ${income.top20bottom20}（估算），` +
      `居民人均可支配收入实际增速约 ${fmtPct(income.residentIncomeGrowth)}。`,
    );
    lines.push('');
    lines.push(`> ${income.note}`);
  }
  lines.push('');

  // —— 尾注口径声明 ——
  lines.push('## 尾注 · 口径声明');
  lines.push('');
  lines.push('- 指标为「国家统计局公开口径快照」近似值，标注基准日，以官方最新发布为准。');
  lines.push('- 金丝雀 / 领先指标的红绿研判为「公开数据派生的领先信号示意」，非官方分级。');
  lines.push('- 三次产业占比、收入分配、新经济占比含估算 / 示意 / 预估成分，不构成精确官方数字。');
  lines.push('- 全文：公开统计梳理 · 示意标定 · 非投资建议 · 非预测。');

  return lines.join('\n');
}
