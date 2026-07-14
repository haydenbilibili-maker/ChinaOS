// ============================================================================
// 领袖统治 · 推演状态持久化（chinaos.leadership.sim.v1）
// ----------------------------------------------------------------------------
import {
  DEFAULT_CONSTRAINTS,
  LEADERSHIP_SIM_STORAGE_KEY,
  runGovernanceSim,
} from './leadershipGovSim.js';

const MAX_RUNS = 12;

function emptyState() {
  return {
    version: 1,
    step: 'scenario',
    scenarioId: 'local-debt',
    optionId: null,
    constraints: { ...DEFAULT_CONSTRAINTS },
    lastResult: null,
    runs: [],
    compareIds: [],
    updatedAt: null,
  };
}

function safeParse(raw) {
  try {
    const obj = JSON.parse(raw);
    if (!obj || typeof obj !== 'object') return null;
    return obj;
  } catch {
    return null;
  }
}

export function loadLeadershipSimState() {
  if (typeof localStorage === 'undefined') return emptyState();
  const parsed = safeParse(localStorage.getItem(LEADERSHIP_SIM_STORAGE_KEY));
  if (!parsed || parsed.version !== 1) return emptyState();
  return {
    ...emptyState(),
    ...parsed,
    constraints: { ...DEFAULT_CONSTRAINTS, ...(parsed.constraints || {}) },
    runs: Array.isArray(parsed.runs) ? parsed.runs.slice(0, MAX_RUNS) : [],
    compareIds: Array.isArray(parsed.compareIds) ? parsed.compareIds.slice(0, 2) : [],
  };
}

export function saveLeadershipSimState(state) {
  if (typeof localStorage === 'undefined') return;
  const next = {
    ...emptyState(),
    ...state,
    version: 1,
    updatedAt: new Date().toISOString(),
  };
  try {
    localStorage.setItem(LEADERSHIP_SIM_STORAGE_KEY, JSON.stringify(next));
    window.dispatchEvent(new CustomEvent('cos-ledger-change', { detail: { key: LEADERSHIP_SIM_STORAGE_KEY } }));
  } catch {
    /* quota / private mode — 静默降级 */
  }
}

export function resetLeadershipSimState() {
  const fresh = emptyState();
  saveLeadershipSimState(fresh);
  return fresh;
}

/** 固化一次运行到 runs[] */
export function appendSimRun(state, result, label) {
  if (!result?.ok) return state;
  const run = {
    id: `run-${Date.now().toString(36)}`,
    ts: new Date().toISOString(),
    label: label || `${result.scenarioLabel} · ${result.optionLabel}`,
    scenarioId: result.scenarioId,
    optionId: result.optionId,
    constraints: { ...result.constraints },
    result,
  };
  const runs = [run, ...(state.runs || [])].slice(0, MAX_RUNS);
  return { ...state, runs, lastResult: result };
}

export function removeSimRun(state, runId) {
  const runs = (state.runs || []).filter((r) => r.id !== runId);
  const compareIds = (state.compareIds || []).filter((id) => id !== runId);
  return { ...state, runs, compareIds };
}

export function toggleCompareId(state, runId) {
  const prev = state.compareIds || [];
  if (prev.includes(runId)) {
    return { ...state, compareIds: prev.filter((id) => id !== runId) };
  }
  const next = [...prev, runId].slice(-2);
  return { ...state, compareIds: next };
}

/** 根据当前选题/选项/约束重算（不自动入库） */
export function computeCurrentResult(state) {
  if (!state.optionId) return null;
  const out = runGovernanceSim({
    scenarioId: state.scenarioId,
    optionId: state.optionId,
    constraints: state.constraints,
  });
  return out.ok ? out : null;
}

export { emptyState as emptyLeadershipSimState };
