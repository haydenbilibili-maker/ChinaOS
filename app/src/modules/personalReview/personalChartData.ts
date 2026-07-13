import type { Decision, PersonalCushionLayer, RunwayResult } from '../../domain/personal.ts';
import { calcDecisionStats, calcRunway, classifyCompassQuadrant } from '../../domain/personal.ts';
import type { Regime } from '../../domain/governance.ts';
import { proximityBand } from '../../domain/governanceVerdict.ts';

export interface DecisionMetricBar {
  id: string;
  shortName: string;
  paybackMonths: number;
  paybackLabel: string;
  roiPercent: number;
  roiLabel: string;
  color: string;
}

const SHORT_NAMES: Record<string, string> = {
  pension: '养老金',
  store: '门店',
  house: '房产',
};

const KIND_COLOR: Record<string, string> = {
  defense: 'var(--def)',
  offense: 'var(--off)',
  option: 'var(--opt)',
  anchor: 'var(--def)',
};

function num(v: number | ''): number {
  if (v === '' || v == null) return 0;
  return Number(v) || 0;
}

/** 三笔决策 · 柱状图数据（回收期统一为月，回报率统一为 %） */
export function buildDecisionMetricBars(decisions: Decision[]): DecisionMetricBar[] {
  return decisions
    .map((d) => {
      const stats = calcDecisionStats(d);
      const costField = d.fields.find((f) => f.key === 'cost');
      const flowField = d.fields.find((f) => f.key === 'flow');
      const nowField = d.fields.find((f) => f.key === 'now');

      if (d.id === 'pension') {
        const pc = num(costField?.value) * 10000;
        const pf = num(flowField?.value);
        const pYr = pf * 12;
        const paybackMonths = pYr > 0 ? (pc / pYr) * 12 : 0;
        const roi = pc > 0 ? (pYr / pc) * 100 : 0;
        if (!paybackMonths && !roi) return null;
        return {
          id: d.id,
          shortName: SHORT_NAMES[d.id] ?? d.name,
          paybackMonths,
          paybackLabel: stats.value1,
          roiPercent: roi,
          roiLabel: stats.value2,
          color: KIND_COLOR[d.kind] ?? 'var(--def)',
        };
      }

      if (d.id === 'store') {
        const sc = num(costField?.value) * 10000;
        const sf = num(flowField?.value);
        const sYr = sf * 12;
        const paybackMonths = sYr > 0 ? (sc / sYr) * 12 : 0;
        const roi = sc > 0 ? (sYr / sc) * 100 : 0;
        if (!paybackMonths && !roi) return null;
        return {
          id: d.id,
          shortName: SHORT_NAMES[d.id] ?? d.name,
          paybackMonths,
          paybackLabel: stats.value1,
          roiPercent: roi,
          roiLabel: stats.value2,
          color: KIND_COLOR[d.kind] ?? 'var(--off)',
        };
      }

      const hc = num(costField?.value);
      const hn = num(nowField?.value);
      const gain = hc > 0 ? ((hn - hc) / hc) * 100 : 0;
      if (!hc) return null;
      return {
        id: d.id,
        shortName: SHORT_NAMES[d.id] ?? d.name,
        paybackMonths: Math.max(gain, 1),
        paybackLabel: stats.value1,
        roiPercent: Math.max(gain, 1),
        roiLabel: stats.value2,
        color: KIND_COLOR[d.kind] ?? 'var(--def)',
      };
    })
    .filter(Boolean);
}

export interface CompassDot {
  id: string;
  name: string;
  x: number;
  y: number;
  color: string;
  size: number;
}

const QUADRANT_CENTER: Record<string, { x: number; y: number }> = {
  anchor: { x: 0.25, y: 0.25 },
  productive: { x: 0.75, y: 0.25 },
  valueTrap: { x: 0.25, y: 0.75 },
  pending: { x: 0.75, y: 0.75 },
};

/** 罗盘 2×2 · 象限内散点偏移（避免重叠） */
export function buildCompassDots(decisions: Decision[]): CompassDot[] {
  const bucketCount: Record<string, number> = {};
  return decisions.map((d) => {
    const q = classifyCompassQuadrant(d.transferable, d.hasCashflow);
    const idx = bucketCount[q] ?? 0;
    bucketCount[q] = idx + 1;
    const center = QUADRANT_CENTER[q];
    const cost = num(d.fields.find((f) => f.key === 'cost')?.value);
    const size = 6 + Math.min(cost / 10, 8);
    const jitterX = (idx % 2) * 0.08 - 0.04;
    const jitterY = Math.floor(idx / 2) * 0.1 - 0.05;
    return {
      id: d.id,
      name: d.name,
      x: center.x + jitterX,
      y: center.y + jitterY,
      color: KIND_COLOR[d.kind] ?? 'var(--def)',
      size,
    };
  });
}

export interface CushionBarDatum {
  name: string;
  score: number;
  color: string;
}

export function buildCushionBarData(layers: PersonalCushionLayer[]): CushionBarDatum[] {
  return layers
    .map((l) => ({
      name: l.name,
      score: l.score === '' ? 0 : Number(l.score),
      color: l.color,
    }))
    .filter((l) => l.score > 0);
}

export interface RunwayBarDatum {
  label: string;
  months: number;
  display: string;
  color: string;
  cappedMonths: number;
}

const RUNWAY_CAP = 24;

export function buildRunwayBarData(result: RunwayResult): RunwayBarDatum[] {
  return result.scenarios.map((s) => ({
    label: s.label.replace('情景', '').trim(),
    months: s.months,
    display: s.display,
    color: s.color,
    cappedMonths: s.months === Infinity ? RUNWAY_CAP : Math.min(s.months, RUNWAY_CAP),
  }));
}

export { RUNWAY_CAP };

export interface VerdictCell {
  key: string;
  regime: Regime;
  band: string;
  stance: string;
  label: string;
  active: boolean;
}

/** PersonalVerdict 联动矩阵 · 当前读数高亮 */
export function buildVerdictLinkageCells(
  regime: Regime,
  proximityScore: number,
): VerdictCell[] {
  const band = proximityBand(proximityScore);
  const cells: Omit<VerdictCell, 'active'>[] = [
    { key: 'defense+quiet', regime: 'defense', band: 'quiet', stance: '守成', label: '防御·远' },
    { key: 'defense+building', regime: 'defense', band: 'building', stance: '守成', label: '防御·蓄' },
    { key: 'defense+imminent', regime: 'defense', band: 'imminent', stance: '备战', label: '防御·迫' },
    { key: 'watch+building', regime: 'watch', band: 'building', stance: '预热', label: '观察·蓄' },
    { key: 'offense+any', regime: 'offense', band: 'any', stance: '进攻', label: '治本·开' },
  ];

  let activeKey: string | null = null;
  if (regime === 'offense') activeKey = 'offense+any';
  else if (regime === 'defense' && band === 'imminent') activeKey = 'defense+imminent';
  else if (regime === 'defense' && band === 'quiet') activeKey = 'defense+quiet';
  else if (regime === 'defense' && band === 'building') activeKey = 'defense+building';
  else if (regime === 'watch' && band === 'building') activeKey = 'watch+building';

  return cells.map((c) => ({
    ...c,
    active: c.key === activeKey,
  }));
}

export function buildRunwayChartData(runway: Parameters<typeof calcRunway>[0]) {
  return buildRunwayBarData(calcRunway(runway));
}
