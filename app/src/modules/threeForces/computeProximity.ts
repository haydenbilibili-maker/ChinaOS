import type { ForceLevel } from '../../domain/governance.ts';
import { FORCE_LV, FORCES, PROXIMITY_META } from './forces.seed.ts';

export type LevelResolver = (id: string, defaultLv: ForceLevel) => ForceLevel;

export function forceScore(force: (typeof FORCES)[0], resolve: LevelResolver): number {
  const s = force.inds.reduce((a, i) => a + FORCE_LV[resolve(i.id, i.lv)], 0) / force.inds.length;
  return Math.round(s * 100);
}

export function forceLevel(score: number): ForceLevel {
  if (score >= 62) return 'near';
  if (score >= 32) return 'build';
  return 'calm';
}

/** computeProximity — EXACT algorithm from chinaos-three-forces-monitor1.html */
export function computeProximity(resolve: LevelResolver): number {
  let num = 0;
  let den = 0;
  FORCES.forEach((f) => {
    num += forceScore(f, resolve) * f.w;
    den += f.w;
  });
  return Math.round(num / den);
}

export function getProximityMeta(score: number) {
  return PROXIMITY_META.find((x) => score < x.max) ?? PROXIMITY_META[PROXIMITY_META.length - 1];
}

export function nextForceLevel(current: ForceLevel): ForceLevel {
  const order: ForceLevel[] = ['calm', 'build', 'near'];
  return order[(order.indexOf(current) + 1) % 3];
}

export function levelColor(lv: ForceLevel): string {
  if (lv === 'near') return 'var(--near)';
  if (lv === 'build') return 'var(--build)';
  return 'var(--calm)';
}
