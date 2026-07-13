import { useCallback, useMemo, useState } from 'react';
import type { SignalStatus } from '../../domain/governance.ts';
import { SIGNAL_STORAGE_KEY } from '../../domain/governance.ts';
import { allSignals } from './signals.seed.ts';
import { nextSignalStatus } from './computeRegime.ts';

function loadOverrides(): Record<string, SignalStatus> {
  try {
    return JSON.parse(localStorage.getItem(SIGNAL_STORAGE_KEY) || '{}') || {};
  } catch {
    return {};
  }
}

function saveOverrides(ov: Record<string, SignalStatus>) {
  try {
    localStorage.setItem(SIGNAL_STORAGE_KEY, JSON.stringify(ov));
  } catch {
    /* noop */
  }
}

const defaults = Object.fromEntries(allSignals().map((s) => [s.id, s.status]));

export function useSignalStore() {
  const [overrides, setOverrides] = useState(loadOverrides);

  const resolve = useCallback(
    (id: string, defaultStatus: SignalStatus): SignalStatus => overrides[id] ?? defaultStatus,
    [overrides],
  );

  const cycle = useCallback((id: string, current: SignalStatus) => {
    setOverrides((prev) => {
      const next = { ...prev, [id]: nextSignalStatus(current) };
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
