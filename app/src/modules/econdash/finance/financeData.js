// ============================================================================
// 经济大盘 · 资本市场 Tab 数据层（公开口径近似 · 示意标定）
// ----------------------------------------------------------------------------
// 来源对齐：econDeflation.js · econData.js · finance/Page.jsx · liveQuotes.js
//           observationData.js · capitalMarket/Page.jsx
// 凡无官方序列处标注「示意 / 近似」；不杜撰伪精确小数。
// 基准日：AS_OF_BASELINE · 非投资建议 · 非预测
// ============================================================================

import { AS_OF_BASELINE } from '../../../lib/config/asOfBaseline.js';
import { HEADLINE_GAUGES } from '../econDeflation.js';
import { INDICATOR_SPARKLINES } from '../econData.js';
import { MARKET_SEED } from '../../../lib/market/liveQuotes.js';

export const FINANCE_AS_OF = AS_OF_BASELINE;

/** 近八期月份标签（升序） */
export const FINANCE_MONTHS = [
  '2025-11', '2025-12', '2026-01', '2026-02',
  '2026-03', '2026-04', '2026-05', '2026-06',
];

// —— M2 同比：econData INDICATOR_SPARKLINES.m2 ——
const M2_YOY = INDICATOR_SPARKLINES.m2;

// —— M1−M2 剪刀差：econDeflation HEADLINE_GAUGES.m1m2 ——
const SCISSORS = (HEADLINE_GAUGES.find((g) => g.id === 'm1m2')?.series) || [];

/** M1 同比 ≈ M2 + 剪刀差（pct 点差，人民银行新口径近似） */
export const M1_YOY = M2_YOY.map((m2, i) => {
  const s = SCISSORS[i];
  return s != null ? Math.round((m2 + s) * 10) / 10 : null;
});

/**
 * M0 同比（流通中现金；人民银行公开口径近似走势）
 * 数字支付替代效应下增速缓降，仍高于 M1 活化读数。
 */
export const M0_YOY = [11.2, 10.8, 10.4, 9.9, 9.5, 9.0, 8.6, 8.3];

export const MONEY_SUPPLY = {
  months: FINANCE_MONTHS,
  m0: M0_YOY,
  m1: M1_YOY,
  m2: M2_YOY,
  scissors: SCISSORS,
  source: '人民银行 货币供应 · 新口径近似（M2/剪刀差同源 econData）',
  note: 'M1 由 M2+剪刀差派生；M0 为公开口径近似走势',
};

// —— CPI / PPI：INDICATOR_SPARKLINES ——
export const CPI_PPI = {
  months: FINANCE_MONTHS,
  cpi: INDICATOR_SPARKLINES.cpi,
  ppi: INDICATOR_SPARKLINES.ppi,
  /** CPI−PPI 剪刀差（传导压力 proxy） */
  spread: INDICATOR_SPARKLINES.cpi.map((c, i) => {
    const p = INDICATOR_SPARKLINES.ppi[i];
    return p != null && c != null ? Math.round((c - p) * 10) / 10 : null;
  }),
  source: 'NBS 月度 · econData INDICATOR_SPARKLINES',
};

/**
 * 社融存量增速 + 社融脉冲（社融同比 − M2 同比，信用扩张超额 proxy）
 * 存量增速末值 8.4% 对齐 KEY_INDICATORS.afre；序列为人行公开口径近似。
 */
export const AFRE_SERIES = {
  months: FINANCE_MONTHS,
  yoy: [9.8, 9.5, 9.2, 8.9, 8.7, 8.5, 8.4, 8.4],
  pulse: [9.8, 9.5, 9.2, 8.9, 8.7, 8.5, 8.4, 8.4].map((a, i) =>
    Math.round((a - M2_YOY[i]) * 10) / 10,
  ),
  source: '人民银行 社融存量 · 近似（末值对齐 observationData.afre 8.4%）',
};

/**
 * 利率走廊（% · 月均值近似）
 * LPR/MLF 对齐 2025–2026 公开下调节奏；DR007 为银行间质押式回购七日加权利率示意。
 */
export const RATE_CORRIDOR = {
  months: FINANCE_MONTHS,
  lpr1y: [3.10, 3.10, 3.10, 3.00, 3.00, 3.00, 2.95, 2.95],
  lpr5y: [3.60, 3.60, 3.60, 3.50, 3.50, 3.50, 3.45, 3.45],
  mlf1y: [2.50, 2.50, 2.50, 2.40, 2.40, 2.40, 2.35, 2.35],
  dr007: [1.82, 1.78, 1.85, 1.72, 1.68, 1.75, 1.71, 1.69],
  source: '人民银行 LPR/MLF 公告 · DR007 银行间公开均值近似',
  note: '示意 · 月均值非逐日精确',
};

/**
 * USD/CNY 中间价（元 · 月均值近似）
 * 末值对齐 observationData.usdcny 7.18；走势为外汇交易中心公开口径近似。
 */
export const FX_USDCNY = {
  months: FINANCE_MONTHS,
  mid: [7.24, 7.22, 7.21, 7.20, 7.19, 7.18, 7.18, 7.18],
  source: '外汇交易中心 中间价 · 月均值近似',
};

/**
 * 资本市场情绪 · 股债跷跷板（示意）
 * 股指：上证指数月末收盘近似；10Y 国债：中债估值近似（liveQuotes cn10y 1.68%）
 */
export const MARKET_SENTIMENT = {
  months: FINANCE_MONTHS,
  sse: [3380, 3420, 3480, 3550, 3680, 3820, 3950, 3993],
  cn10y: [1.85, 1.82, 1.79, 1.76, 1.73, 1.70, 1.68, 1.68],
  /** 股债相对强弱：上证归一化 − 10Y×100（示意指数，非官方） */
  seeSaw: null,
  source: '上证/中债估值 · 示意；末值 sse 对齐 liveQuotes MARKET_SEED',
  note: '北向/融资余额见 CAPITAL_FLOW · 均为示意',
};

MARKET_SENTIMENT.seeSaw = MARKET_SENTIMENT.sse.map((s, i) => {
  const b = MARKET_SENTIMENT.cn10y[i];
  const sNorm = (s - 3200) / 800;
  const bNorm = (2.2 - b) / 0.6;
  return Math.round((sNorm - bNorm) * 100) / 100;
});

/** 北向资金净流入 + 融资余额（示意 · 口径待核） */
export const CAPITAL_FLOW = {
  months: FINANCE_MONTHS,
  northbound: [180, -52, 115, 88, -28, 205, 148, 92],
  marginBalance: [1.52, 1.48, 1.45, 1.43, 1.41, 1.44, 1.47, 1.49],
  source: 'Wind/交易所公开口径近似 · 示意',
  note: '北向自 2024-08 起停止实时披露；此处为月度估算示意',
};

/** 社融存量构成（% · 与 finance/Page.jsx TSF_STOCK 同源） */
export const TSF_STOCK = [
  { name: '人民币贷款', value: 62, itemStyle: { color: '#c41e3a' } },
  { name: '政府/企业债券', value: 21, itemStyle: { color: '#e8a317' } },
  { name: '表外融资', value: 9, itemStyle: { color: '#64748b' } },
  { name: '股票融资', value: 4, itemStyle: { color: '#22d3ee' } },
  { name: '其他', value: 4, itemStyle: { color: '#475569' } },
];

/** 直接 vs 间接融资占比演进（% · finance/Page + capitalMarket 同源示意） */
export const FINANCE_MIX = {
  years: ['2010', '2015', '2020', '2024', '2026E'],
  direct: [18, 22, 30, 37, 40],
  indirect: [82, 78, 70, 63, 60],
  source: '人民银行/证监会 公开统计近似 · 示意',
};

/** 社融增量行业/部门结构（% · 2026 H1 近似示意） */
export const SECTOR_AFRE = [
  { name: '政府债券', value: 38, itemStyle: { color: '#e8a317' } },
  { name: '企业中长期贷', value: 26, itemStyle: { color: '#c41e3a' } },
  { name: '居民贷款', value: 14, itemStyle: { color: '#22d3ee' } },
  { name: '票据/短贷冲量', value: 12, itemStyle: { color: '#64748b' } },
  { name: '股权/其他', value: 10, itemStyle: { color: '#10b981' } },
];

/** 区域社融占比（% · 示意 · 对齐 econRegional 梯度叙事） */
export const REGIONAL_AFRE = [
  { region: '东部沿海', share: 42, yoy: 8.2 },
  { region: '中部', share: 22, yoy: 8.8 },
  { region: '西部', share: 18, yoy: 9.1 },
  { region: '东北', share: 8, yoy: 7.5 },
  { region: '其他', share: 10, yoy: 8.0 },
];

/** 货币政策/资本市场关键节点（2023–2026 · 公开政策梳理示意） */
export const POLICY_NODES = [
  { y: 2023, m: 8, title: '存量房贷利率下调', accent: '#62a89e', desc: '商业银行统一调降存量按揭利率，减轻居民付息负担、稳定资产负债表。' },
  { y: 2023, m: 10, title: '特殊再融资债重启', accent: '#c99a4e', desc: '一揽子化债启动，特殊再融资债券置换隐性债务，缓释城投流动性。' },
  { y: 2024, m: 9, title: '活跃资本市场组合拳', accent: '#8090c6', desc: '印花税下调、中长期资金入市指引，政策重心转向投资功能。' },
  { y: 2024, m: 12, title: 'LPR 年内第三次下调', accent: '#c44e3d', desc: '1Y/5Y LPR 同步下行，宽货币向宽信用传导，银行息差承压。' },
  { y: 2025, m: 3, title: '政府工作报告 · 耐心资本', accent: '#22d3ee', desc: '「壮大耐心资本」写入报告，创投/养老金/保险资金入市成为主线。' },
  { y: 2025, m: 7, title: '对等关税冲击与汇率管理', accent: '#10b981', desc: '外部约束抬升，宏观审慎工具平滑 USD/CNY 与跨境资本波动。' },
  { y: 2026, m: 3, title: '十五五开局 · 双主线', accent: '#e8a317', desc: '科技自立自强 + 扩大内需；社融政府债前置、私人信用仍偏弱。' },
];

/** 金融指标 ↔ 金丝雀/宏观域 联动（econMacroBridge 扩展） */
export const FINANCE_CANARY_LINKS = [
  { id: 'm1m2', label: 'M1−M2 剪刀差', canaryId: 'midloan', macroTag: '信用体温', signal: 'red', reading: '资金趴账、活化偏弱' },
  { id: 'afre', label: '社融脉冲', canaryId: 'land', macroTag: '通缩闸门', signal: 'amber', reading: '政府债撑总量、私人加杠杆乏力' },
  { id: 'cpi_ppi', label: 'CPI−PPI 剪刀差', canaryId: 'house_price', macroTag: '通缩闸门', signal: 'red', reading: '价格传导阻滞、企业利润受挤' },
  { id: 'rate', label: '实际利率', canaryId: 'consumer_heat', macroTag: '消费率病根', signal: 'amber', reading: '名义低通胀下实际利率偏高，抑制消费' },
];

/** KPI 条读数（末值/最新） */
export function financeKpis() {
  const m2 = M2_YOY[M2_YOY.length - 1];
  const scissors = SCISSORS[SCISSORS.length - 1];
  const afre = AFRE_SERIES.yoy[AFRE_SERIES.yoy.length - 1];
  const cpi = CPI_PPI.cpi[CPI_PPI.cpi.length - 1];
  const sse = MARKET_SEED.find((q) => q.id === 'sse');
  const usdcny = MARKET_SEED.find((q) => q.id === 'usdcny');
  return {
    m2,
    scissors,
    afre,
    cpi,
    sse: sse?.price ?? null,
    usdcny: usdcny?.price ?? null,
  };
}

/** 子导航锚点 */
export const FINANCE_SECTIONS = [
  { id: 'money', label: '货币供应' },
  { id: 'liquidity', label: '流动性' },
  { id: 'price', label: '物价传导' },
  { id: 'rates', label: '利率走廊' },
  { id: 'fx', label: '汇率约束' },
  { id: 'sentiment', label: '市场情绪' },
  { id: 'structure', label: '金融结构' },
  { id: 'sector', label: '资金流向' },
  { id: 'canary', label: '金丝雀联动' },
  { id: 'timeline', label: '政策时间轴' },
];
