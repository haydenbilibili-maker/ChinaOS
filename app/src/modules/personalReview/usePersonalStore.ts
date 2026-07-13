import { useCallback, useState } from 'react';
import type { Decision, PersonalReviewState } from '../../domain/personal.ts';
import {
  PERSONAL_STORAGE_KEY,
  blankPersonalState,
} from '../../domain/personal.ts';

function loadState(): PersonalReviewState {
  try {
    const raw = localStorage.getItem(PERSONAL_STORAGE_KEY);
    if (!raw) return blankPersonalState();
    const parsed = JSON.parse(raw) as PersonalReviewState;
    if (!parsed?.decisions?.length) return blankPersonalState();
    return parsed;
  } catch {
    return blankPersonalState();
  }
}

function saveState(state: PersonalReviewState) {
  try {
    localStorage.setItem(PERSONAL_STORAGE_KEY, JSON.stringify(state));
  } catch {
    /* noop */
  }
}

export function usePersonalStore() {
  const [state, setState] = useState<PersonalReviewState>(loadState);

  const persist = useCallback((next: PersonalReviewState) => {
    setState(next);
    saveState(next);
  }, []);

  const updateDecision = useCallback(
    (id: string, patch: Partial<Decision>) => {
      setState((prev) => {
        const next = {
          ...prev,
          decisions: prev.decisions.map((d) => (d.id === id ? { ...d, ...patch } : d)),
        };
        saveState(next);
        return next;
      });
    },
    [],
  );

  const updateDecisionField = useCallback(
    (decisionId: string, fieldKey: string, value: number | '') => {
      setState((prev) => {
        const next = {
          ...prev,
          decisions: prev.decisions.map((d) =>
            d.id !== decisionId
              ? d
              : {
                  ...d,
                  fields: d.fields.map((f) =>
                    f.key === fieldKey ? { ...f, value } : f,
                  ),
                },
          ),
        };
        saveState(next);
        return next;
      });
    },
    [],
  );

  const updateCushionScore = useCallback((index: number, score: number | '') => {
    setState((prev) => {
      const next = {
        ...prev,
        cushions: prev.cushions.map((c, i) => (i === index ? { ...c, score } : c)),
      };
      saveState(next);
      return next;
    });
  }, []);

  const updateRunway = useCallback(
    (patch: Partial<PersonalReviewState['runway']>) => {
      setState((prev) => {
        const next = { ...prev, runway: { ...prev.runway, ...patch } };
        saveState(next);
        return next;
      });
    },
    [],
  );

  const exportJson = useCallback(() => {
    const blob = new Blob([JSON.stringify(state, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `chinaos-personal-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }, [state]);

  const importJson = useCallback((file: File) => {
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const parsed = JSON.parse(String(reader.result)) as PersonalReviewState;
        if (parsed?.decisions?.length) persist(parsed);
      } catch {
        /* invalid file */
      }
    };
    reader.readAsText(file);
  }, [persist]);

  const clearAll = useCallback(() => {
    const blank = blankPersonalState();
    persist(blank);
  }, [persist]);

  return {
    state,
    updateDecision,
    updateDecisionField,
    updateCushionScore,
    updateRunway,
    exportJson,
    importJson,
    clearAll,
  };
}
