import { useCallback, useMemo } from 'react';
import { proximityBand } from '../../domain/governanceVerdict.ts';
import { computeRegime } from '../../modules/signalPanel/computeRegime.ts';
import { allSignals } from '../../modules/signalPanel/signals.seed.ts';
import { useSignalStore } from '../../modules/signalPanel/useSignalStore.ts';
import { computeProximity } from '../../modules/threeForces/computeProximity.ts';
import { FORCES } from '../../modules/threeForces/forces.seed.ts';
import { useForceStore } from '../../modules/threeForces/useForceStore.ts';

/**
 * 双仪表联动 · 消费 signalPanel + threeForces 的 localStorage 读数
 * 供 GovernanceVerdict、PersonalVerdict 等模块共用
 */
export function useGovernanceLinkage() {
  const signalStore = useSignalStore();
  const forceStore = useForceStore();

  const signalDefaults = useMemo(
    () => Object.fromEntries(allSignals().map((s) => [s.id, s.status])),
    [],
  );
  const forceDefaults = useMemo(
    () => Object.fromEntries(FORCES.flatMap((f) => f.inds.map((i) => [i.id, i.lv]))),
    [],
  );

  const resolveSignal = useCallback(
    (id: string, fb: Parameters<typeof signalStore.resolve>[1]) =>
      signalStore.resolve(id, signalDefaults[id] ?? fb),
    [signalStore, signalDefaults],
  );

  const resolveForce = useCallback(
    (id: string, fb: Parameters<typeof forceStore.resolve>[1]) =>
      forceStore.resolve(id, forceDefaults[id] ?? fb),
    [forceStore, forceDefaults],
  );

  const { score: regimeScore, regime, gate } = computeRegime(resolveSignal);
  const proximityScore = computeProximity(resolveForce);
  const proximity = proximityBand(proximityScore);

  const regimeLabel =
    regime === 'defense' ? '防御' : regime === 'watch' ? '观察' : '进攻';
  const proximityLabel =
    proximity === 'quiet' ? '沉寂' : proximity === 'building' ? '积蓄' : '逼近';

  return {
    regimeScore,
    regime,
    gate,
    proximityScore,
    proximity,
    regimeLabel,
    proximityLabel,
    resolveSignal,
    resolveForce,
    signalStore,
    forceStore,
  };
}
