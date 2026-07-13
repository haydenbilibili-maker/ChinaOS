/**
 * 宏观指标单一数据源
 * C1/C3/C4（信号灯）与 F2a/F2d（三力）共享读数，避免两处文案漂移。
 * 基准：2026 政府工作报告 / 预算报告口径
 */

export interface MacroIndicator {
  id: string;
  name: string;
  read: string;
  /** 关联的信号 id（signal-panel） */
  signalIds: string[];
  /** 关联的三力指标 id（three-forces） */
  forceIds: string[];
}

export const MACRO_DEFLATION_GATE: MacroIndicator = {
  id: 'macro-gdp-deflator',
  name: 'GDP 平减指数',
  read: '连续三年为负。报告称"有望 2026 二季度走出通缩"——当承诺核对。',
  signalIds: ['C1'],
  forceIds: ['F2a'],
};

export const MACRO_CONSUMPTION_SHARE: MacroIndicator = {
  id: 'macro-consumption-gdp',
  name: '居民消费占 GDP 比重',
  read: '约 39%，主要经济体最低档（病根指标）。',
  signalIds: ['C3'],
  forceIds: [],
};

export const MACRO_HOUSEHOLD_LOANS: MacroIndicator = {
  id: 'macro-residential-loans',
  name: '居民中长期贷款',
  read: '信心体温计；资产负债表衰退是否缓解看此项。房价较峰值跌约 30%。',
  signalIds: ['C4'],
  forceIds: ['F2d'],
};

export const MACRO_INDICATORS: MacroIndicator[] = [
  MACRO_DEFLATION_GATE,
  MACRO_CONSUMPTION_SHARE,
  MACRO_HOUSEHOLD_LOANS,
];

export const MACRO_BY_SIGNAL = Object.fromEntries(
  MACRO_INDICATORS.flatMap((m) => m.signalIds.map((sid) => [sid, m])),
) as Record<string, MacroIndicator>;

export const MACRO_BY_FORCE = Object.fromEntries(
  MACRO_INDICATORS.flatMap((m) => m.forceIds.map((fid) => [fid, m])),
) as Record<string, MacroIndicator>;
