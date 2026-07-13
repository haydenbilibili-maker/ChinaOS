import { describe, expect, it } from 'vitest';
import {
  blankDecisionTemplates,
  calcDecisionStats,
  calcRunway,
  classifyCompassQuadrant,
  computePersonalVerdict,
} from '../../../domain/personal.ts';
import { seedPersonalState } from '../personalDefaults.seed.ts';
import {
  buildCompassDots,
  buildCushionBarData,
  buildDecisionMetricBars,
  buildRunwayBarData,
  buildVerdictLinkageCells,
} from '../personalChartData.ts';

describe('calcDecisionStats', () => {
  it('computes pension payback years and ROI', () => {
    const pension = blankDecisionTemplates().find((d) => d.id === 'pension')!;
    const withValues = {
      ...pension,
      fields: [
        { key: 'cost' as const, label: '一次性投入（万元）', value: 15 },
        { key: 'flow' as const, label: '每月现金流（元）', value: 2600 },
      ],
    };
    const stats = calcDecisionStats(withValues);
    expect(stats.value1).toBe('4.8 年');
    expect(stats.value2).toBe('20.8%');
  });

  it('computes store payback months and ROI', () => {
    const store = blankDecisionTemplates().find((d) => d.id === 'store')!;
    const withValues = {
      ...store,
      fields: [
        { key: 'cost' as const, label: '投入（万元）', value: 15 },
        { key: 'flow' as const, label: '每月分红（元）', value: 20000 },
      ],
    };
    const stats = calcDecisionStats(withValues);
    expect(stats.value1).toBe('7.5 个月');
    expect(stats.value2).toBe('160%');
  });

  it('computes house book gain and zero monthly burden', () => {
    const house = blankDecisionTemplates().find((d) => d.id === 'house')!;
    const withValues = {
      ...house,
      fields: [
        { key: 'cost' as const, label: '购入（万元）', value: 35 },
        { key: 'now' as const, label: '现估值（万元）', value: 50 },
      ],
    };
    const stats = calcDecisionStats(withValues);
    expect(stats.value1).toBe('+43%');
    expect(stats.value2).toBe('¥0');
  });
});

describe('classifyCompassQuadrant', () => {
  it('maps transferable × hasCashflow to quadrants', () => {
    expect(classifyCompassQuadrant(false, true)).toBe('anchor');
    expect(classifyCompassQuadrant(true, true)).toBe('productive');
    expect(classifyCompassQuadrant(false, false)).toBe('valueTrap');
    expect(classifyCompassQuadrant(true, false)).toBe('pending');
  });
});

describe('calcRunway', () => {
  it('runs 3-scenario stress test matching reference HTML', () => {
    const result = calcRunway({
      cash: 20,
      expense: 15000,
      divid: 20000,
      stress: 30,
    });

    expect(result.scenarios).toHaveLength(3);
    expect(result.scenarios[0].display).toBe('∞');
    expect(result.scenarios[1].display).toBe('22.2 月');
    expect(result.scenarios[2].display).toBe('13.3 月');
    expect(result.gapDisplay).toBe('已达标');
  });

  it('computes gap when cash insufficient for 12 months full stop', () => {
    const result = calcRunway({
      cash: 5,
      expense: 15000,
      divid: 0,
      stress: 30,
    });
    expect(result.scenarios[2].display).toBe('3.3 月');
    expect(result.gapDisplay).toBe('¥13.0万');
  });
});

describe('computePersonalVerdict linkage matrix', () => {
  it('defense+quiet → 守成', () => {
    const v = computePersonalVerdict('defense', 20);
    expect(v.stance).toBe('守成');
    expect(v.key).toBe('defense+quiet');
  });

  it('defense+building → 守成', () => {
    const v = computePersonalVerdict('defense', 45);
    expect(v.stance).toBe('守成');
    expect(v.key).toBe('defense+building');
  });

  it('defense+imminent → 备战', () => {
    const v = computePersonalVerdict('defense', 70);
    expect(v.stance).toBe('备战');
    expect(v.key).toBe('defense+imminent');
  });

  it('watch+building → 预热', () => {
    const v = computePersonalVerdict('watch', 45);
    expect(v.stance).toBe('预热');
    expect(v.key).toBe('watch+building');
  });

  it('offense+any → 进攻', () => {
    const v = computePersonalVerdict('offense', 10);
    expect(v.stance).toBe('进攻');
    expect(v.key).toBe('offense+any');
  });
});

describe('seedPersonalState', () => {
  it('loads Hayden demo defaults from reference HTML', () => {
    const seed = seedPersonalState();
    const pension = seed.decisions.find((d) => d.id === 'pension')!;
    const store = seed.decisions.find((d) => d.id === 'store')!;
    const house = seed.decisions.find((d) => d.id === 'house')!;

    expect(pension.fields.find((f) => f.key === 'cost')?.value).toBe(15);
    expect(pension.fields.find((f) => f.key === 'flow')?.value).toBe(2600);
    expect(store.fields.find((f) => f.key === 'flow')?.value).toBe(20000);
    expect(house.fields.find((f) => f.key === 'now')?.value).toBe(50);
    expect(seed.cushions.find((c) => c.name === '制度垫')?.score).toBe(68);
    expect(seed.runway.cash).toBe(20);
    expect(seed.runway.stress).toBe(30);
    expect(seed.pendingItems).toHaveLength(1);
  });
});

describe('chart data builders', () => {
  it('builds decision metric bars from seed', () => {
    const bars = buildDecisionMetricBars(seedPersonalState().decisions);
    expect(bars).toHaveLength(3);
    expect(bars.find((b) => b.id === 'store')?.roiLabel).toBe('160%');
  });

  it('builds compass dots in productive/anchor quadrants', () => {
    const dots = buildCompassDots(seedPersonalState().decisions);
    expect(dots).toHaveLength(3);
    expect(dots.some((d) => d.x > 0.5)).toBe(true);
  });

  it('builds cushion bar data with four layers', () => {
    const bars = buildCushionBarData(seedPersonalState().cushions);
    expect(bars).toHaveLength(4);
    expect(bars.find((b) => b.name === '时间垫')?.score).toBe(72);
  });

  it('builds runway stress bars with capped infinity', () => {
    const result = calcRunway(seedPersonalState().runway);
    const bars = buildRunwayBarData(result);
    expect(bars[0].months).toBe(Infinity);
    expect(bars[0].cappedMonths).toBe(24);
    expect(bars[2].display).toBe('13.3 月');
  });

  it('highlights defense+quiet cell for default governance read', () => {
    const cells = buildVerdictLinkageCells('defense', 20);
    expect(cells.find((c) => c.key === 'defense+quiet')?.active).toBe(true);
  });
});
