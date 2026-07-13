import { useCallback, useMemo, useState } from 'react';
import type { ForceLevel } from '../../domain/governance.ts';
import { THREE_FORCES_STORAGE_KEY } from '../../domain/governance.ts';
import { FORCES } from './forces.seed.ts';
import { nextForceLevel } from './computeProximity.ts';

function loadOverrides(): Record<string, ForceLevel> {
  try {
    return JSON.parse(localStorage.getItem(THREE_FORCES_STORAGE_KEY) || '{}') || {};
  } catch {
    return {};
  }
}

function saveOverrides(ov: Record<string, ForceLevel>) {
  try {
    localStorage.setItem(THREE_FORCES_STORAGE_KEY, JSON.stringify(ov));
  } catch {
    /* noop */
  }
}

const defaults = Object.fromEntries(
  FORCES.flatMap((f) => f.inds.map((i) => [i.id, i.lv])),
);

export function useForceStore() {
  const [overrides, setOverrides] = useState(loadOverrides);

  const resolve = useCallback(
    (id: string, defaultLv: ForceLevel): ForceLevel => overrides[id] ?? defaultLv,
    [overrides],
  );

  const cycle = useCallback((id: string, current: ForceLevel) => {
    setOverrides((prev) => {
      const next = { ...prev, [id]: nextForceLevel(current) };
      saveOverrides(next);
      return next;
    });
  }, []);

  const reset = useCallback(() => {
    setOverrides({});
    saveOverrides({});
  }, []);

  const baseline = useMemo(() => defaults, []);

  return { resolve, cycle, reset, overrides, baseline };
}
