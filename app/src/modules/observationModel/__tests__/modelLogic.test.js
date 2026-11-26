import { describe, expect, it } from 'vitest';
import { bayesUpdate, circleCounts, eliteKpis, groupScenarios, plenumRates } from '../modelLogic.js';
import { CC_BASE, CMC, INDICATORS, PLENUMS, POLITBURO, SCENARIOS } from '../model.seed.js';

describe('observationModel · modelLogic', () => {
  it('全会出席率按 376 人口径计算，并给出较上次全会变化', () => {
    const rows = plenumRates(PLENUMS, CC_BASE);
    const last = rows.at(-1);
    expect(last.total).toBe(279);
    expect(last.share).toBe(74.2);
    expect(last.change).toBe(-9.6);
    expect(rows[0].change).toBeNull();
  });

  it('精英稳定性汇总与种子一致', () => {
    const k = eliteKpis({ cmc: CMC, politburo: POLITBURO, indicators: INDICATORS });
    expect(k).toMatchObject({ cmcRetained: 2, cmcTotal: 7, pbPurged: 3, pbOriginal: 24, warnCount: 6, indTotal: 20 });
  });

  it('贝叶斯更新复现文档第 17 节示例', () => {
    const post = bayesUpdate({ L1: 65, L2: 25, L3: 10 }, { L1: 0.8, L2: 0.6, L3: 0.2 });
    expect(post).toEqual({ L1: 75.4, L2: 21.7, L3: 2.9 });
  });

  it('每个情景维度概率之和为 100', () => {
    for (const g of groupScenarios(SCENARIOS)) {
      expect(g.items.reduce((a, s) => a + s.p, 0)).toBe(100);
    }
  });

  it('圈层计数只统计在任者', () => {
    const total = circleCounts(POLITBURO).reduce((a, [, n]) => a + n, 0);
    expect(total).toBe(POLITBURO.filter((r) => r.status === '在任').length);
  });
});
