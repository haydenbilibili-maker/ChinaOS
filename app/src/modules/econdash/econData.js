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
 * 与全局基准日 ECON_AS_OF（看板口径基准）刻意分离：本值追踪「经济大盘数据最近
 * 一次对齐官方发布的时点」。2026-10-19 国家统计局公布 2026 年前三季度国民经济运行
 * 情况（含三季度 GDP 初步核算；CPI/PPI 2026-10-14、PMI 2026-09-30、央行前三季度
 * 金融数据 2026-10-14 同批纳入），本层 KEY_INDICATORS 已同步至该批读数；财政部
 * 1–9 月财政收支与 9 月分年龄组失业率截至 10-20 未发布，相关金丝雀项保留 8 月口径。
 * 故取最晚发布日 2026-10-19。
 * 陈旧判定（见 lib/time/dataFreshness.js）以此值为数据时间戳。后续每次纳入新一
 * 轮官方发布，只需上调此常量。
 */
export const ECON_DATA_AS_OF = '2026-10-19';

// ---------------------------------------------------------------------------
// 1. 三次产业结构（2018–2026，占 GDP 比重 % + 实际 GDP 增速 %）
//    占比为公开口径近似值，三产之和经四舍五入后落在 98–102 区间；
//    2025 为国家统计局统计公报（2026-02-28）官方值；2026 为预估标注（estimated:true）。
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
  { year: 2025, agri: 6.7, ind: 35.6, srv: 57.7, gdpGrowth: 5.0, note: '国家统计局 2025 年统计公报（2026-02-28）：GDP 1401879 亿元，不变价 +5.0%；三产比重 6.7 / 35.6 / 57.7' },
  { year: 2026, agri: 6.6, ind: 35.8, srv: 57.6, gdpGrowth: 4.6, estimated: true, note: '2026 前三季度实际同比 +4.6%（一季 5.0 / 二季 4.3 / 三季 4.5，三季环比 +1.2%；NBS 2026-10-19）· 占比为全年估算 · 十五五开局' },
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
    value: 0.9,
    unit: '% 同比累计',
    yoy: 0.9,
    mom: 0.2,
    trend: 'up',
    threshold: null,
    good: 'band',
    asOf: ECON_AS_OF,
    note: '1–9 月同比 +0.9%；9 月同比 +0.9%（涨幅较 8 月扩大 0.1pct）、环比 +0.2%；核心 CPI 9 月 +1.0%、1–9 月 +1.1%。1–9 月猪肉 −12.9% 仍拖累食品，医疗保健 +2.3%、交通通信 +2.0% 领涨。（2026 1–9 月·NBS 2026-10-14/10-19）',
  },
  {
    id: 'ppi',
    label: 'PPI 工业生产者出厂价',
    group: '物价',
    value: 5.0,
    unit: '% 同比',
    yoy: 5.0,
    mom: 1.2,
    trend: 'up',
    threshold: 0,
    good: 'band',
    asOf: ECON_AS_OF,
    note: '9 月同比 +5.0%（涨幅扩大 1.2pct）、环比 +1.2%，1–9 月累计 +2.3%；购进价格 9 月 +6.9%、累计 +3.6%。9 月 PMI 原材料购进价格指数 60.8，国际原油等大宗涨价输入为主。（2026 9 月·NBS 2026-10-14/10-19）',
  },
  {
    id: 'pmi_mfg',
    label: '制造业 PMI',
    group: '景气',
    value: 50.1,
    unit: '点',
    yoy: 0.3,
    mom: 0.3,
    trend: 'up',
    threshold: 50,
    good: 'high',
    asOf: ECON_AS_OF,
    note: '9 月制造业 PMI 50.1，较上月升 0.3pct，重回扩张区间；生产指数 51.7、新订单 50.5；大型企业 50.6、中型 49.7、小型 48.9；生产经营活动预期 53.8。（2026 9 月·NBS 2026-09-30）',
  },
  {
    id: 'pmi_nonmfg',
    label: '非制造业 PMI',
    group: '景气',
    value: 50.2,
    unit: '点',
    yoy: 1.2,
    mom: 1.2,
    trend: 'up',
    threshold: 50,
    good: 'high',
    asOf: ECON_AS_OF,
    note: '9 月非制造业商务活动指数 50.2（升 1.2pct）；服务业 50.2（升 0.9pct）、建筑业 50.3（升 3.4pct）；综合 PMI 产出指数 50.7（升 1.2pct）。（2026 9 月·NBS 2026-09-30）',
  },
  {
    id: 'urban_unemp',
    label: '城镇调查失业率',
    group: '就业',
    value: 5.2,
    unit: '%',
    yoy: 0.0,
    mom: -0.1,
    trend: 'down',
    threshold: 5.5,
    good: 'low',
    asOf: ECON_AS_OF,
    note: '9 月 5.2%（环比 −0.1pct），1–9 月均值 5.2% 与上年同期持平；31 大城市 5.2%；外来农业户籍 5.0%。9 月分年龄组数据截至 10-20 未发布，青年口径见金丝雀盘。（2026 1–9 月·NBS 2026-10-19）',
  },
  {
    id: 'm2',
    label: 'M2 货币供应增速',
    group: '货币',
    value: 7.2,
    unit: '% 同比',
    yoy: 7.2,
    mom: null,
    trend: 'down',
    threshold: null,
    good: 'band',
    asOf: ECON_AS_OF,
    note: '9 月末 M2 余额 359.63 万亿元 +7.2%（前值 7.5%）；M1 116.76 万亿元 +3.2%（前值 4.1%），M2−M1 剪刀差扩大至 4.0pct；M0 15.02 万亿元 +10.6%。（央行 2026-10-14 前三季度金融统计数据报告）',
  },
  {
    id: 'afre',
    label: '社融存量增速',
    group: '货币',
    value: 7.1,
    unit: '% 同比',
    yoy: 7.1,
    mom: null,
    trend: 'down',
    threshold: null,
    good: 'high',
    asOf: ECON_AS_OF,
    note: '9 月末社融存量 468.17 万亿元 +7.1%（前值 7.2%）；政府债券余额 105.23 万亿元 +13.7% 为主支撑，对实体人民币贷款余额 +4.8%，企业债 +9.3%——直接融资替代信贷。（央行 2026-10-14）',
  },
  {
    id: 'retail',
    label: '社会消费品零售总额',
    group: '需求',
    value: 1.1,
    unit: '% 同比累计',
    yoy: 1.1,
    mom: 0.35,
    trend: 'flat',
    threshold: null,
    good: 'high',
    asOf: ECON_AS_OF,
    note: '1–9 月社零 370001 亿元 +1.1%（9 月 42433 亿元 +1.1%、较 8 月加快 0.7pct，环比 +0.35%）；社会消费商品和服务零售总额 +2.6%，其中服务零售 +5.0% 强于商品 +1.0%；网上零售 +4.4%、限上通讯器材 +18.1%。（2026 1–9 月·NBS 2026-10-19）',
  },
  {
    id: 'fai',
    label: '固定资产投资',
    group: '需求',
    value: -7.2,
    unit: '% 同比累计',
    yoy: -7.2,
    mom: 0.07,
    trend: 'flat',
    threshold: null,
    good: 'high',
    asOf: ECON_AS_OF,
    note: '1–9 月固投（不含农户）334115 亿元 −7.2%（与 1–8 月持平；扣除地产 −4.2%）；地产开发投资 −20.6%、制造业 −2.1%、基建 −4.2%、民间 −10.4%；知识产权产品投资 +9.3%、高技术产业投资 +4.9% 逆势。新房销售额 −13.9%、二手房成交面积 +10.7%。（2026 1–9 月·NBS 2026-10-19）',
  },
  {
    id: 'gdp_h1',
    label: 'GDP 累计增速',
    group: '需求',
    value: 4.6,
    unit: '% 前三季度同比',
    yoy: 4.6,
    mom: 1.2,
    trend: 'down',
    threshold: null,
    good: 'high',
    asOf: ECON_AS_OF,
    note: '前三季度 GDP 1071071 亿元 +4.6%（一季 5.0、二季 4.3、三季 4.5，三季环比 +1.2%）；一二三产 +3.7% / +3.8% / +5.2%；最终消费支出贡献率 46.7%。（2026 前三季度·NBS 2026-10-19）',
  },
  {
    id: 'iva',
    label: '规上工业增加值',
    group: '需求',
    value: 5.3,
    unit: '% 同比累计',
    yoy: 5.3,
    mom: 0.61,
    trend: 'up',
    threshold: null,
    good: 'high',
    asOf: ECON_AS_OF,
    note: '1–9 月规上工业 +5.3%（9 月 +5.5%、较上月加快 0.3pct，环比 +0.61%）；1–9 月装备制造 +10.2%、高技术制造 +14.3%；3D 打印设备 +62.5%、锂电池 +39.5%、工业机器人 +29.1%；1–8 月规上工业利润 +15.7%。（2026 1–9 月·NBS 2026-10-19）',
  },
  {
    id: 'export',
    label: '出口（人民币计）',
    group: '需求',
    value: 16.4,
    unit: '% 同比累计',
    yoy: 16.4,
    mom: null,
    trend: 'up',
    threshold: null,
    good: 'high',
    asOf: ECON_AS_OF,
    note: '1–9 月出口 23.20 万亿元 +16.4%（进口 +22.3%、进出口 39.94 万亿元 +18.8%）；机电产品出口 +23.7%，民企进出口 +19.1%。9 月出口当月 30344 亿元 +29.6%。（2026 1–9 月·NBS/海关，2026-10-19）',
  },
  {
    id: 'new_afre',
    label: '新增社会融资',
    group: '货币',
    value: 3.55,
    unit: '万亿元/月',
    yoy: -8.7,
    mom: null,
    trend: 'down',
    threshold: null,
    good: 'high',
    asOf: ECON_AS_OF,
    note: '9 月新增社融约 3.55 万亿元（前三季度累计 27.46 万亿元减前 8 月 23.91 万亿元，推算）；前三季度累计同比少增 2.63 万亿元（≈ −8.7%）；9 月新增人民币贷款约 1.08 万亿元（前三季度 11.52 万亿减前 8 月 10.44 万亿，推算），前三季度住户贷款减少 1.03 万亿元。（央行 2026-10-14 · 单月值为累计差推算）',
  },
];

// ---------------------------------------------------------------------------
// 2b. 核心指标近程序列（公开口径近似 · 近八期升序；无序列者不杜撰）
//     gdp_h1 取自 SECTOR_STRUCTURE 增速；其余与 dashboard / 通缩主线同源。
// ---------------------------------------------------------------------------

/** @type {Record<string, number[]>} KEY_INDICATORS.id → 近八期读数（升序） */
export const INDICATOR_SPARKLINES = {
  gdp_h1: SECTOR_STRUCTURE.slice(-8).map((s) => s.gdpGrowth),
  cpi: [0.5, 0.6, 0.8, 0.9, 1.0, 0.9, 0.9, 0.9],
  ppi: [-0.6, 0.4, 1.5, 2.8, 4.1, 3.5, 3.8, 5.0],
  pmi_mfg: [49.6, 49.9, 50.0, 50.1, 50.3, 49.2, 49.8, 50.1],
  retail: [3.2, 2.6, 2.0, 1.5, 1.3, 1.2, 1.1, 1.1],
  m2: [7.6, 7.4, 7.1, 7.0, 7.2, 7.7, 7.5, 7.2],
};

/** Tab 深链白名单（worldbank 别名 wb 在 Page 路由层解析） */
export const ECON_TAB_IDS = ['macro', 'structure', 'finance', 'regional', 'canary', 'worldbank', 'consume15', 'h1review'];

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
    reading: '前三季度住户贷款减 1.03 万亿',
    lead: '领先制造业投资与产能扩张 1–2 季',
    source: '人民银行 2026-10-14 前三季度金融统计（9 月新增贷款约 1.08 万亿，累计差推算）',
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
    signal: 'green',
    reading: '9 月新订单 50.5 · 维持扩张',
    lead: '领先工业产出与出口交货约 1–2 月',
    source: 'NBS 2026-09-30 制造业 PMI 分项（较上月降 0.1pct）',
  },
  {
    id: 'land',
    label: '土地出让收入',
    proxy: '地方财力与地产预期',
    signal: 'red',
    reading: '1–8 月土地出让 −28.6%',
    lead: '领先地产投资与地方支出 2–3 季',
    source: '财政部 2026-09-18 政府性基金口径（13753 亿元）',
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
    reading: '8月 16–24 岁失业率 18.9%',
    lead: '领先消费信心与社会预期',
    source: 'NBS 2026-09-17 分年龄组（不含在校生，升 1pct）',
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
    reading: '1–9 月 +10.7% · 9 月 +17.0%',
    lead: '领先海关金额约 2 周，反映外需温度',
    source: 'NBS 2026-10-19 规上工业出口交货值',
  },
  {
    id: 'fiscal_pulse',
    label: '广义财政支出',
    proxy: '逆周期发力强度',
    signal: 'amber',
    reading: '1–8月支出 +1.2% · 基金 −17%',
    lead: '领先基建实物量 1–2 季，十五五开局财政靠前',
    source: '财政部 2026-09-18 1–8 月财政收支',
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
