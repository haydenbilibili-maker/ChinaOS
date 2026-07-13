import { useCallback, useMemo, useState } from 'react';
import { ATTRIBUTION_STORAGE_KEY } from '../../domain/governance.ts';
import { SEED_ISSUES } from './data/issues.seed.ts';

function loadCustomIssues() {
  try {
    const raw = localStorage.getItem(ATTRIBUTION_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function saveCustomIssues(custom) {
  try {
    localStorage.setItem(ATTRIBUTION_STORAGE_KEY, JSON.stringify(custom));
  } catch {
    /* 存储不可用时静默 */
  }
}

/** 三层归因 · 议题库状态（React 替代 Pinia） */
export function useAttributionStore() {
  const [customIssues, setCustomIssues] = useState(loadCustomIssues);

  const allIssues = useMemo(
    () => [...SEED_ISSUES, ...customIssues],
    [customIssues],
  );

  const addCustomIssue = useCallback((issue) => {
    const next = { ...issue, id: issue.id || `custom-${Date.now()}`, custom: true };
    setCustomIssues((prev) => {
      const updated = [...prev, next];
      saveCustomIssues(updated);
      return updated;
    });
    return next;
  }, []);

  const removeCustomIssue = useCallback((id) => {
    setCustomIssues((prev) => {
      const updated = prev.filter((i) => i.id !== id);
      saveCustomIssues(updated);
      return updated;
    });
  }, []);

  const exportJson = useCallback(() => {
    const payload = {
      version: 1,
      exportedAt: new Date().toISOString(),
      seedCount: SEED_ISSUES.length,
      customIssues,
      allIssues,
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `chinaos-attribution-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }, [allIssues, customIssues]);

  return {
    seedIssues: SEED_ISSUES,
    customIssues,
    allIssues,
    addCustomIssue,
    removeCustomIssue,
    exportJson,
  };
}
