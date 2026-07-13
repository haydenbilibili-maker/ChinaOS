import { describe, expect, it } from 'vitest';
import { PREMIER_TERMS } from '../premiers.seed.js';
import {
  collectPolicyPoints,
  collectTimelineMarkers,
  countPoliciesByLayer,
  getCoverageSegments,
  verifyMonotonicShrink,
  yearToX,
  TIMELINE_START,
} from '../radiusLogic.js';
import { GLOBAL_INFLECTIONS } from '../premiers.seed.js';

describe('yearToX', () => {
  it('maps start year to left margin', () => {
    const x = yearToX(1998, 900, 70, 30, 1998, 2026);
    expect(x).toBe(70);
  });

  it('maps end year to right edge', () => {
    const x = yearToX(2026, 900, 70, 30, 1998, 2026);
    expect(x).toBe(870);
  });
});

describe('getCoverageSegments', () => {
  it('returns radiusPhases when present', () => {
    const wen = PREMIER_TERMS.find((t) => t.id === 'wen');
    const segs = getCoverageSegments(wen);
    expect(segs).toHaveLength(2);
    expect(segs[0].radius).toContain('decision');
    expect(segs[1].radius).toEqual(['execution']);
  });

  it('marks Zhu direction as partial', () => {
    const zhu = PREMIER_TERMS.find((t) => t.id === 'zhu');
    const segs = getCoverageSegments(zhu);
    expect(segs[0].directionPartial).toBe(true);
  });
});

describe('verifyMonotonicShrink', () => {
  it('confirms non-increasing radius across terms', () => {
    const { ok } = verifyMonotonicShrink(PREMIER_TERMS);
    expect(ok).toBe(true);
  });
});

describe('collectPolicyPoints', () => {
  it('includes all signature policies', () => {
    const points = collectPolicyPoints(PREMIER_TERMS);
    const total = PREMIER_TERMS.reduce((n, t) => n + t.signaturePolicies.length, 0);
    expect(points).toHaveLength(total);
  });

  it('Li Qiang policies are all execution layer', () => {
    const li = PREMIER_TERMS.find((t) => t.id === 'liqiang');
    const execOnly = li.signaturePolicies.every((p) => p.layer === 'execution');
    expect(execOnly).toBe(true);
  });
});

describe('countPoliciesByLayer', () => {
  it('shows Zhu dense in decision/direction', () => {
    const counts = countPoliciesByLayer(PREMIER_TERMS);
    const zhu = PREMIER_TERMS.find((t) => t.id === 'zhu');
    const zhuDecision = zhu.signaturePolicies.filter((p) => p.layer === 'decision').length;
    expect(counts.decision).toBeGreaterThanOrEqual(zhuDecision);
  });
});

describe('collectTimelineMarkers', () => {
  it('includes global inflection years', () => {
    const markers = collectTimelineMarkers(PREMIER_TERMS, GLOBAL_INFLECTIONS);
    const years = markers.map((m) => m.year);
    expect(years).toContain(2008);
    expect(years).toContain(2018);
    expect(years).toContain(2024);
  });
});

describe('timeline bounds', () => {
  it('starts at 1998', () => {
    expect(TIMELINE_START).toBe(1998);
    expect(PREMIER_TERMS[0].start).toBe(1998);
  });
});
