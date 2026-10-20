import { describe, it, expect } from 'vitest';
import { normalizeDashLayout, moveDashSection, toggleDashSection } from '../store.js';

const IDS = ['a', 'b', 'c', 'd'];

describe('dashboard layout', () => {
  it('defaults to declared order', () => {
    expect(normalizeDashLayout(null, IDS)).toEqual({ order: IDS, hidden: [] });
  });

  it('drops unknown ids and inserts new sections after their default predecessor', () => {
    const n = normalizeDashLayout({ order: ['c', 'x', 'a', 'c'], hidden: ['x', 'b'] }, IDS);
    expect(n.order).toEqual(['c', 'd', 'a', 'b']);
    expect(n.hidden).toEqual(['b']);
  });

  it('moves within bounds only', () => {
    const l = { order: IDS, hidden: [] };
    expect(moveDashSection(l, 'b', -1).order).toEqual(['b', 'a', 'c', 'd']);
    expect(moveDashSection(l, 'a', -1)).toBe(l);
    expect(moveDashSection(l, 'd', 1)).toBe(l);
  });

  it('toggles visibility', () => {
    const l = toggleDashSection({ order: IDS, hidden: [] }, 'c');
    expect(l.hidden).toEqual(['c']);
    expect(toggleDashSection(l, 'c').hidden).toEqual([]);
  });
});
