import { describe, expect, it } from 'vitest';
import { computeRegime } from '../computeRegime.ts';
import { allSignals } from '../signals.seed.ts';

const baseline = (id: string, fb: import('../../../domain/governance.ts').SignalStatus) => fb;

describe('computeRegime', () => {
  it('returns defense at baseline seed readouts', () => {
    const { regime, score } = computeRegime(baseline);
    expect(regime).toBe('defense');
    expect(score).toBeLessThan(38);
  });

  it('requires C1 gate (amber+) for offense even with high score', () => {
    const resolve = (id: string, fb: import('../../../domain/governance.ts').SignalStatus) => {
      if (id === 'C1') return 'red';
      return 'green';
    };
    const { regime } = computeRegime(resolve);
    expect(regime).not.toBe('offense');
  });

  it('opens offense when score>=60 and C1 gate open', () => {
    const resolve = (id: string, fb: import('../../../domain/governance.ts').SignalStatus) => {
      if (id === 'C1') return 'amber';
      return 'green';
    };
    const { regime } = computeRegime(resolve);
    expect(regime).toBe('offense');
  });

  it('A1 green + gate forces offense regardless of score band', () => {
    const resolve = (id: string, fb: import('../../../domain/governance.ts').SignalStatus) => {
      if (id === 'A1') return 'green';
      if (id === 'C1') return 'amber';
      return 'red';
    };
    const { regime } = computeRegime(resolve);
    expect(regime).toBe('offense');
  });

  it('watch band between 38 and 59 with gate closed', () => {
    const greens = new Set(['A2', 'A3', 'B1', 'B2', 'C2']);
    const resolve = (id: string, fb: import('../../../domain/governance.ts').SignalStatus) =>
      greens.has(id) ? 'green' : fb;
    const { regime, score } = computeRegime(resolve);
    expect(score).toBeGreaterThanOrEqual(38);
    expect(score).toBeLessThan(60);
    expect(regime).toBe('watch');
  });

  it('uses weighted signals from all tiers', () => {
    expect(allSignals().length).toBe(12);
    const onlyA2 = (id: string, fb: import('../../../domain/governance.ts').SignalStatus) =>
      id === 'A2' ? 'green' : fb;
    const { score: s1 } = computeRegime(onlyA2);
    const allGreen = () => 'green' as const;
    const { score: s2 } = computeRegime(allGreen);
    expect(s2).toBeGreaterThan(s1);
  });
});
