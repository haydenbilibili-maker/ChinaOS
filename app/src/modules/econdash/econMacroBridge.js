// ============================================================================
// 经济大盘 · 宏观指标域对齐（minimal bridge → domain/macro-indicators.ts）
// ----------------------------------------------------------------------------
// 把 KEY_INDICATORS 与信号灯 / 三力 / 垫子层共享的域级读数挂钩，避免文案漂移。
// 口径：公开统计梳理 · 示意标定 · 非投资建议 · 非预测。
// ============================================================================

import {
  MACRO_DEFLATION_GATE,
  MACRO_CONSUMPTION_SHARE,
  MACRO_HOUSEHOLD_LOANS,
} from '../../domain/macro-indicators.ts';

/** KEY_INDICATOR.id → 域级宏观指标（与 signal-panel / three-forces 同源） */
export const INDICATOR_MACRO_LINKS = {
  cpi: { macro: MACRO_DEFLATION_GATE, tag: '通缩闸门' },
  ppi: { macro: MACRO_DEFLATION_GATE, tag: '通缩闸门' },
  gdp_h1: { macro: MACRO_DEFLATION_GATE, tag: '平减指数' },
  retail: { macro: MACRO_CONSUMPTION_SHARE, tag: '消费率病根' },
  new_afre: { macro: MACRO_HOUSEHOLD_LOANS, tag: '信用体温' },
  afre: { macro: MACRO_HOUSEHOLD_LOANS, tag: '信用体温' },
};

/** @param {string} indicatorId */
export function macroReadForIndicator(indicatorId) {
  const link = INDICATOR_MACRO_LINKS[indicatorId];
  if (!link?.macro?.read) return null;
  return { read: link.macro.read, tag: link.tag, name: link.macro.name };
}
