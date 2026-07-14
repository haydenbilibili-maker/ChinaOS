import { describe, expect, it } from 'vitest';
import {
  compareGovRuns,
  readConstraintPressure,
  runGovernanceSim,
  scenarioById,
} from './leadershipGovSim.js';

describe('leadershipGovSim', () => {
  it('loads public scenarios without personal scores', () => {
    const s = scenarioById('local-debt');
    expect(s).toBeTruthy();
    expect(s.primaryLocus).toBe('cfe');
    expect(s.options.length).toBeGreaterThan(0);
    expect(JSON.stringify(s)).not.toMatch(/能力分|性格|内幕/);
  });

  it('reads constraint pressure deterministically', () => {
    const a = readConstraintPressure({
      fiscalSpace: 20,
      socialStability: 20,
      cadreCapacity: 20,
      infoAsymmetry: 90,
    });
    const b = readConstraintPressure({
      fiscalSpace: 20,
      socialStability: 20,
      cadreCapacity: 20,
      infoAsymmetry: 90,
    });
    expect(a.composite).toBe(b.composite);
    expect(a.band).toBe('高压受限');
  });

  it('runs option → outcome matrix', () => {
    const out = runGovernanceSim({
      scenarioId: 'reform-window',
      optionId: 'reform-exec-only',
      constraints: {
        fiscalSpace: 50,
        socialStability: 60,
        cadreCapacity: 40,
        infoAsymmetry: 55,
      },
    });
    expect(out.ok).toBe(true);
    expect(out.matrix.intended).toBeTruthy();
    expect(out.matrix.sideEffects).toBeTruthy();
    expect(out.matrix.irreversible).toBeTruthy();
    expect(out.verdict.label).toBeTruthy();
  });

  it('compares two runs', () => {
    const r1 = runGovernanceSim({
      scenarioId: 'local-debt',
      optionId: 'debt-extend',
      constraints: { fiscalSpace: 40, socialStability: 55, cadreCapacity: 50, infoAsymmetry: 60 },
    });
    const r2 = runGovernanceSim({
      scenarioId: 'local-debt',
      optionId: 'debt-hard',
      constraints: { fiscalSpace: 40, socialStability: 55, cadreCapacity: 50, infoAsymmetry: 60 },
    });
    const cmp = compareGovRuns(
      { result: r1 },
      { result: r2 },
    );
    expect(cmp.ok).toBe(true);
    expect(cmp.rows.length).toBe(6);
  });
});
