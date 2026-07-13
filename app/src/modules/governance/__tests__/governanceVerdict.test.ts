import { describe, expect, it } from 'vitest';
import { computeGovernanceVerdict, proximityBand } from '../../../domain/governanceVerdict.ts';

describe('proximityBand', () => {
  it('segments at 34 and 62', () => {
    expect(proximityBand(33)).toBe('quiet');
    expect(proximityBand(34)).toBe('building');
    expect(proximityBand(61)).toBe('building');
    expect(proximityBand(62)).toBe('imminent');
  });
});

describe('computeGovernanceVerdict matrix', () => {
  it('defense + imminent', () => {
    const v = computeGovernanceVerdict('defense', 70);
    expect(v.key).toBe('defense+imminent');
    expect(v.headline).toContain('表面未改');
    expect(v.reformTiming).toContain('改革时序');
  });

  it('defense + quiet', () => {
    const v = computeGovernanceVerdict('defense', 20);
    expect(v.key).toBe('defense+quiet');
    expect(v.headline).toContain('双低读数');
  });

  it('offense + any proximity', () => {
    const quiet = computeGovernanceVerdict('offense', 10);
    const imminent = computeGovernanceVerdict('offense', 90);
    expect(quiet.key).toBe('offense+any');
    expect(imminent.key).toBe('offense+any');
    expect(quiet.headline).toContain('治本确认');
  });

  it('watch + building', () => {
    const v = computeGovernanceVerdict('watch', 45);
    expect(v.key).toBe('watch+building');
    expect(v.headline).toContain('临界僵持');
  });

  it('fallback for non-matrix combos', () => {
    const v = computeGovernanceVerdict('watch', 80);
    expect(v.key).toBe('fallback');
  });
});
