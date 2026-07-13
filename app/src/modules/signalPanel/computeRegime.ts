import type { Regime, SignalStatus } from '../../domain/governance.ts';
import {
  allSignals,
  REGIME_META,
  SIGNAL_SECTIONS,
  SIGNAL_VAL,
} from './signals.seed.ts';

export interface RegimeResult {
  score: number;
  regime: Regime;
  gate: boolean;
}

export type StatusResolver = (id: string, defaultStatus: SignalStatus) => SignalStatus;

/** computeRegime — EXACT algorithm from chinaos-signal-dashboard1.html (C1 gate + A1 override) */
export function computeRegime(resolve: StatusResolver): RegimeResult {
  const signals = allSignals();
  let n = 0;
  let d = 0;
  signals.forEach((s) => {
    const st = resolve(s.id, s.status);
    n += SIGNAL_VAL[st] * s.w;
    d += s.w;
  });
  const score = Math.round((n / d) * 100);

  const c1 = resolve(SIGNAL_SECTIONS[2].signals[0].id, SIGNAL_SECTIONS[2].signals[0].status);
  const a1 = resolve(SIGNAL_SECTIONS[0].signals[0].id, SIGNAL_SECTIONS[0].signals[0].status);
  const gate = SIGNAL_VAL[c1] >= 0.5;

  let regime: Regime = score >= 60 && gate ? 'offense' : score >= 38 ? 'watch' : 'defense';
  if (a1 === 'green' && gate) regime = 'offense';

  return { score, regime, gate };
}

export function getRegimeMeta(regime: Regime) {
  return REGIME_META[regime];
}

export function nextSignalStatus(current: SignalStatus): SignalStatus {
  const order: SignalStatus[] = ['red', 'amber', 'green'];
  return order[(order.indexOf(current) + 1) % 3];
}

export function statusBadge(status: SignalStatus): { label: string; cls: string } {
  if (status === 'red') return { label: '未启动', cls: 'b-red' };
  if (status === 'amber') return { label: '观察中', cls: 'b-amber' };
  return { label: '已启动', cls: 'b-green' };
}
