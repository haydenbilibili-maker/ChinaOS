import { describe, expect, it } from 'vitest';
import {
  buildObservatoryReading,
  computeObservatoryTrigger,
  computeObservatoryVerdict,
  proximityDisplay,
  regimeDisplay,
} from '../../../domain/observatory.ts';

const ROUTES = {
  threeForces: '/modules/three-forces',
  cognition: '/cognition',
  signalPanel: '/modules/signal-panel',
  attribution: '/modules/attribution',
  premierRadius: '/modules/premier-radius',
  cushionMonitor: '/modules/cushion-monitor',
  personalReview: '/modules/personal-review',
  huangfeizhai: '/modules/huangfeizhai',
};

describe('computeObservatoryVerdict', () => {
  it('defense + building → 僵局代价累积（默认种子读数）', () => {
    const v = computeObservatoryVerdict('defense', 54);
    expect(v.key).toBe('defense+building');
    expect(v.headline).toContain('僵局代价累积');
    expect(v.headline).toContain('备战');
  });

  it('defense + imminent', () => {
    const v = computeObservatoryVerdict('defense', 70);
    expect(v.key).toBe('defense+imminent');
    expect(v.headline).toContain('表面未改');
  });

  it('offense + any proximity', () => {
    expect(computeObservatoryVerdict('offense', 10).key).toBe('offense+any');
    expect(computeObservatoryVerdict('offense', 90).headline).toContain('治本确认');
  });
});

describe('computeObservatoryTrigger', () => {
  it('reflects C1 gate state', () => {
    expect(computeObservatoryTrigger(false).c1Label).toBe('关闭');
    expect(computeObservatoryTrigger(true).c1Label).toBe('开启');
  });
});

describe('display helpers', () => {
  it('regimeDisplay maps defense to red 防御', () => {
    expect(regimeDisplay('defense').word).toBe('防御');
    expect(regimeDisplay('defense').color).toBe('var(--red)');
  });

  it('proximityDisplay maps building to amber 积蓄', () => {
    expect(proximityDisplay('building').word).toBe('积蓄');
  });
});

describe('buildObservatoryReading', () => {
  it('wires narrative chain routes and dynamic scores', () => {
    const reading = buildObservatoryReading({
      regime: 'defense',
      regimeScore: 28,
      regimeLabel: '防御',
      proximity: 'building',
      proximityScore: 54,
      proximityLabel: '积蓄',
      c1GateOpen: false,
      attributionIssueCount: 18,
      cushionSummary: '中国四层皆薄',
      cushionColor: 'var(--red)',
      personalReadout: '账本在长 · 已在"有为"格',
      personalColor: 'var(--green)',
      routes: ROUTES,
    });

    expect(reading.signalGauge.score).toBe(28);
    expect(reading.forceGauge.score).toBe(54);
    expect(reading.trigger.c1Label).toBe('关闭');
    expect(reading.actions).toHaveLength(4);
    expect(reading.stages).toHaveLength(4);
    expect(reading.stages[0].modules[0].route).toBe('/modules/three-forces');
    expect(reading.stages[1].modules[1].readout.text).toContain('18 条已判定');
    expect(reading.stages[3].modules[0].route).toBe('/modules/personal-review');
    expect(reading.stages[3].modules[1].route).toBe('/modules/huangfeizhai');
  });
});
