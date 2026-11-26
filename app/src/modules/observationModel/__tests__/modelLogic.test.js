import { describe, expect, it } from 'vitest';
import {
  applySignals, bayesUpdate, buildNetwork, circleCounts, eliteKpis, eventsForIndicator, groupScenarios,
  indicatorDimSummary, lTrajectory, plenumRates, successorPool,
} from '../modelLogic.js';
import {
  CC_BASE, CIRCLE_ALIAS, CIRCLES, CMC, EVENTS, EXTRA_NODES, INDICATOR_GROUPS, INDICATORS, L_PRIOR_BASE, L_UPDATES,
  PIPELINES, PLENUMS, POLITBURO, SCENARIOS, SUCCESSOR_BIRTH_RANGE,
} from '../model.seed.js';

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
    expect(k).toMatchObject({ cmcRetained: 2, cmcTotal: 7, pbPurged: 4, pbOriginal: 24, warnCount: 6, indTotal: 20 });
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

  it('领导层概率轨迹由更新记录逐次计算', () => {
    const t = lTrajectory(L_PRIOR_BASE, L_UPDATES);
    expect(t).toHaveLength(L_UPDATES.length + 1);
    expect(t[1].probs).toEqual({ L1: 75.4, L2: 21.7, L3: 2.9 });
    expect(t.at(-1).probs).toEqual({ L1: 85, L2: 12.2, L3: 2.7 });
  });

  it('多信号假设推演等于逐次更新', () => {
    const p = { L1: 85, L2: 12.2, L3: 2.7 };
    const a = { L1: 0.1, L2: 0.7, L3: 0.3 };
    const b = { L1: 0.3, L2: 0.7, L3: 0.4 };
    expect(applySignals(p, [a, b])).toEqual(bayesUpdate(bayesUpdate(p, a), b));
  });

  it('接班候选池：未到龄、1960 年代生、在任', () => {
    const pool = successorPool(POLITBURO, SUCCESSOR_BIRTH_RANGE).map((r) => r.name);
    expect(pool).toHaveLength(9);
    expect(pool).not.toContain('陈吉宁');
  });

  it('网络：每个成员都连到圈层与管道；2022 快照无被查处节点', () => {
    const args = { politburo: POLITBURO, extra: EXTRA_NODES, pipelines: PIPELINES, circles: CIRCLES, alias: CIRCLE_ALIAS };
    const now = buildNetwork(args);
    const members = now.nodes.filter((n) => n.kind === 'member');
    for (const m of members) {
      expect(now.links.some((l) => l.source === m.id && l.kind === 'member-circle')).toBe(true);
      expect(now.links.some((l) => l.source === m.id && l.kind === 'member-pipe')).toBe(true);
    }
    expect(members.filter((m) => m.status === '被查处').length).toBe(7);
    const then = buildNetwork({ ...args, snapshot: '2022' });
    expect(then.nodes.some((n) => n.status === '被查处')).toBe(false);
  });

  it('指标分组汇总与事件关联', () => {
    const sum = indicatorDimSummary(INDICATORS, INDICATOR_GROUPS);
    expect(sum.reduce((a, s) => a + s.total, 0)).toBe(INDICATORS.length);
    expect(eventsForIndicator(EVENTS, 'P2').length).toBeGreaterThanOrEqual(3);
  });
});
