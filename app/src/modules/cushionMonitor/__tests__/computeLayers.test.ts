import { describe, expect, it } from 'vitest';
import {
  chinaCushionAverage,
  chinaThinnerThanJapanAllLayers,
  cushionBand,
  sortCushionBars,
} from '../computeLayers.ts';
import { CUSHION_LAYERS } from '../cushionLayers.seed.ts';

describe('computeLayers', () => {
  it('sortCushionBars orders by score descending', () => {
    const sorted = sortCushionBars(CUSHION_LAYERS[0].vals);
    expect(sorted[0][0]).toBe('jp');
    expect(sorted[sorted.length - 1][0]).toBe('kr');
    for (let i = 1; i < sorted.length; i += 1) {
      expect(sorted[i - 1][1].s).toBeGreaterThanOrEqual(sorted[i][1].s);
    }
  });

  it('chinaThinnerThanJapanAllLayers holds for seed data', () => {
    expect(chinaThinnerThanJapanAllLayers(CUSHION_LAYERS)).toBe(true);
  });

  it('chinaCushionAverage reflects thin composite cushion', () => {
    const avg = chinaCushionAverage(CUSHION_LAYERS);
    expect(avg).toBeGreaterThan(0);
    expect(avg).toBeLessThan(50);
    expect(cushionBand(avg)).toBe('thin');
  });

  it('cushionBand thresholds align with thin/mid/thick CSS bands', () => {
    expect(cushionBand(34)).toBe('thin');
    expect(cushionBand(35)).toBe('mid');
    expect(cushionBand(64)).toBe('mid');
    expect(cushionBand(65)).toBe('thick');
  });
});
