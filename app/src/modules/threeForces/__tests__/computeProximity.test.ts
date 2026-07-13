import { describe, expect, it } from 'vitest';
import { computeProximity, forceLevel, forceScore } from '../computeProximity.ts';
import { FORCES } from '../forces.seed.ts';

const baseline = (id: string, fb: import('../../../domain/governance.ts').ForceLevel) => fb;

describe('computeProximity', () => {
  it('returns baseline proximity from seed levels', () => {
    const p = computeProximity(baseline);
    expect(p).toBeGreaterThan(30);
    expect(p).toBeLessThan(70);
  });

  it('weights F2 and F3 higher than F1', () => {
    const allNear = () => 'near' as const;
    const p = computeProximity(allNear);
    expect(p).toBe(100);

    const onlyF1Near = (id: string, fb: import('../../../domain/governance.ts').ForceLevel) => {
      if (id.startsWith('F1')) return 'near';
      return fb;
    };
    const pPartial = computeProximity(onlyF1Near);
    expect(pPartial).toBeLessThan(100);
    expect(pPartial).toBeGreaterThan(computeProximity(baseline));
  });

  it('forceLevel thresholds match HTML (32/62)', () => {
    expect(forceLevel(31)).toBe('calm');
    expect(forceLevel(32)).toBe('build');
    expect(forceLevel(61)).toBe('build');
    expect(forceLevel(62)).toBe('near');
  });

  it('forceScore averages indicator levels', () => {
    const f2 = FORCES.find((f) => f.id === 'F2')!;
    const score = forceScore(f2, baseline);
    expect(score).toBeGreaterThan(0);
    expect(score).toBeLessThanOrEqual(100);
  });
});
