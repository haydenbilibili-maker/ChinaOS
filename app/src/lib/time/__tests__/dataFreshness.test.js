import { describe, expect, it } from 'vitest';
import {
  STALE_THRESHOLD_DAYS,
  toMillis,
  daysBetween,
  assessFreshness,
  formatCstParts,
} from '../dataFreshness.js';

describe('toMillis', () => {
  it('parses Date / number / ISO string', () => {
    const d = new Date('2026-07-15T00:00:00Z');
    expect(toMillis(d)).toBe(d.getTime());
    expect(toMillis(d.getTime())).toBe(d.getTime());
    expect(toMillis('2026-07-15T00:00:00Z')).toBe(d.getTime());
  });

  it('returns NaN for invalid input', () => {
    expect(Number.isNaN(toMillis(null))).toBe(true);
    expect(Number.isNaN(toMillis(undefined))).toBe(true);
    expect(Number.isNaN(toMillis('not-a-date'))).toBe(true);
    expect(Number.isNaN(toMillis({}))).toBe(true);
  });
});

describe('daysBetween', () => {
  it('computes fractional day difference (to - from)', () => {
    expect(daysBetween('2026-07-15T00:00:00Z', '2026-07-20T00:00:00Z')).toBe(5);
    expect(daysBetween('2026-07-15T00:00:00Z', '2026-07-15T12:00:00Z')).toBe(0.5);
  });

  it('can be negative and NaN', () => {
    expect(daysBetween('2026-07-20T00:00:00Z', '2026-07-15T00:00:00Z')).toBe(-5);
    expect(Number.isNaN(daysBetween('bad', '2026-07-15'))).toBe(true);
  });
});

describe('assessFreshness', () => {
  const dataAsOf = '2026-07-15T00:00:00Z';

  it('flags fresh within 0.6 x threshold', () => {
    const now = '2026-07-25T00:00:00Z'; // 10 天
    const r = assessFreshness(dataAsOf, now);
    expect(r.level).toBe('fresh');
    expect(r.isStale).toBe(false);
    expect(r.ageDaysWhole).toBe(10);
    expect(r.thresholdDays).toBe(STALE_THRESHOLD_DAYS);
  });

  it('flags aging between 0.6 x threshold and threshold', () => {
    const now = '2026-08-13T00:00:00Z'; // 29 天（>21 且 <35）
    const r = assessFreshness(dataAsOf, now);
    expect(r.level).toBe('aging');
    expect(r.isStale).toBe(false);
    expect(r.daysUntilStale).toBeGreaterThan(0);
  });

  it('flags stale beyond threshold', () => {
    const now = '2026-08-25T00:00:00Z'; // 41 天 > 35
    const r = assessFreshness(dataAsOf, now);
    expect(r.level).toBe('stale');
    expect(r.isStale).toBe(true);
    expect(r.daysUntilStale).toBeLessThan(0);
    expect(r.label).toMatch(/可能已过期|建议更新/);
  });

  it('honors a custom threshold', () => {
    const now = '2026-07-25T00:00:00Z'; // 10 天
    const r = assessFreshness(dataAsOf, now, 7);
    expect(r.isStale).toBe(true);
    expect(r.thresholdDays).toBe(7);
  });

  it('treats future data timestamp as age 0 (fresh)', () => {
    const now = '2026-07-10T00:00:00Z'; // now 早于数据日
    const r = assessFreshness(dataAsOf, now);
    expect(r.ageDays).toBe(0);
    expect(r.level).toBe('fresh');
    expect(r.isStale).toBe(false);
  });

  it('returns unknown for unparseable timestamp', () => {
    const r = assessFreshness('not-a-date', '2026-07-25T00:00:00Z');
    expect(r.level).toBe('unknown');
    expect(Number.isNaN(r.ageDays)).toBe(true);
    expect(r.isStale).toBe(false);
  });

  it('falls back to default threshold when given invalid one', () => {
    const r = assessFreshness(dataAsOf, '2026-07-25T00:00:00Z', -5);
    expect(r.thresholdDays).toBe(STALE_THRESHOLD_DAYS);
  });
});

describe('formatCstParts', () => {
  it('formats an instant into Asia/Shanghai parts', () => {
    // 2026-07-15T13:56:03Z == 2026-07-15 21:56:03 (UTC+8)
    const p = formatCstParts('2026-07-15T13:56:03Z');
    expect(p.date).toBe('2026-07-15');
    expect(p.time).toBe('21:56:03');
    expect(p.full).toBe('2026-07-15 21:56:03');
    expect(p.weekday.startsWith('周')).toBe(true);
  });

  it('rolls date forward across the UTC+8 boundary', () => {
    // 2026-07-15T20:00:00Z == 2026-07-16 04:00:00 (UTC+8)
    const p = formatCstParts('2026-07-15T20:00:00Z');
    expect(p.date).toBe('2026-07-16');
    expect(p.time).toBe('04:00:00');
  });

  it('is resilient to invalid input (no throw)', () => {
    const p = formatCstParts('bad-date');
    expect(typeof p.full).toBe('string');
    expect(p.time).toMatch(/^\d{2}:\d{2}:\d{2}$/);
  });
});
