import { useState, useMemo } from 'react';
import { timelineMarkAreaOpt } from './chartHelpers.js';

/**
 * 阶段时间线 ↔ 趋势图 markArea 联动
 * @param {Array} phases - [{ id, label, range, color, desc, ... }]
 * @param {string[]} trendYears
 * @param {number[]} trendValues
 * @param {Array<[number,number]>} phaseSpans - 各阶段在 trendYears 中的索引区间
 */
export function useTimelineChartLink(phases, trendYears, trendValues, phaseSpans, initialIdx) {
  const [activeIdx, setActiveIdx] = useState(initialIdx ?? phases.length - 1);
  const active = phases[activeIdx];
  const chartOption = useMemo(
    () => timelineMarkAreaOpt({ years: trendYears, values: trendValues, span: phaseSpans[activeIdx] || [0, 0] }),
    [activeIdx, trendYears, trendValues, phaseSpans],
  );
  return { activeIdx, setActiveIdx, active, chartOption };
}
