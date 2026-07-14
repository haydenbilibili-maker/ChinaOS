import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import * as Lucide from 'lucide-react';
import { Card } from '../../app/ui.jsx';
import EChart from '../../lib/viz/EChart.jsx';
import { LAYER_META } from '../../domain/governance.ts';
import { radarOpt, AXIS, LABEL } from '../shared/chartHelpers.js';
import {
  CONSTRAINT_DEFS,
  FLOW_STEPS,
  GOV_SCENARIOS,
  GOV_SIM_CAUTIONS,
  GOV_SIM_METHODOLOGY,
  INSTITUTIONAL_LOCI,
  LEADERSHIP_SIM_STORAGE_KEY,
  buildGovSimExport,
  compareGovRuns,
  readConstraintPressure,
  runGovernanceSim,
  scenarioById,
} from './leadershipGovSim.js';
import {
  appendSimRun,
  computeCurrentResult,
  loadLeadershipSimState,
  removeSimRun,
  resetLeadershipSimState,
  saveLeadershipSimState,
  toggleCompareId,
} from './useLeadershipSimStore.js';

const CYAN = '#22d3ee';
const RED = '#c41e3a';
const GOLD = '#e8a317';
const GREEN = '#10b981';
const SLATE = '#64748b';

function pill(c) {
  return {
    display: 'inline-block',
    fontSize: 11,
    fontFamily: 'monospace',
    padding: '2px 8px',
    borderRadius: 20,
    border: `1px solid ${c}55`,
    background: `${c}14`,
    color: c,
    whiteSpace: 'nowrap',
  };
}

const btnBase = {
  fontSize: 12,
  fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace',
  padding: '6px 12px',
  borderRadius: 6,
  border: '1px solid var(--border-subtle)',
  background: 'var(--bg-base)',
  color: 'var(--text-secondary)',
  cursor: 'pointer',
};

function StepRail({ step, onSelect }) {
  const idx = FLOW_STEPS.findIndex((s) => s.key === step);
  return (
    <ol className="lead-gov-steps" aria-label="推演流程">
      {FLOW_STEPS.map((s, i) => {
        const active = s.key === step;
        const done = i < idx;
        return (
          <li key={s.key}>
            <button
              type="button"
              className={`lead-gov-step${active ? ' is-active' : ''}${done ? ' is-done' : ''}`}
              onClick={() => onSelect(s.key)}
            >
              <span className="lead-gov-step__n">{i + 1}</span>
              <span className="lead-gov-step__body">
                <span className="lead-gov-step__label">{s.label}</span>
                <span className="lead-gov-step__hint">{s.hint}</span>
              </span>
            </button>
          </li>
        );
      })}
    </ol>
  );
}

function MethodologyBanner() {
  const [open, setOpen] = useState(false);
  return (
    <div className="lead-gov-method">
      <button type="button" className="lead-gov-method__toggle" onClick={() => setOpen((v) => !v)}>
        <Lucide.BookOpen size={14} />
        方法论边界 · 本仿真模拟什么 / 不声称什么
        <span className="mono" style={{ color: 'var(--text-tertiary)', marginLeft: 8 }}>
          {open ? '收起' : '展开'}
        </span>
      </button>
      {open && (
        <div className="lead-gov-method__body">
          <div>
            <div className="text-[11px] mono mb-2" style={{ color: GREEN }}>模拟</div>
            <ul className="lead-gov-method__list">
              {GOV_SIM_METHODOLOGY.models.map((m) => (
                <li key={m}>{m}</li>
              ))}
            </ul>
          </div>
          <div>
            <div className="text-[11px] mono mb-2" style={{ color: GOLD }}>不声称</div>
            <ul className="lead-gov-method__list">
              {GOV_SIM_METHODOLOGY.doesNotClaim.map((m) => (
                <li key={m}>{m}</li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}

function ConstraintSliders({ constraints, onChange, pressure }) {
  return (
    <div className="grid gap-6" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 320px), 1fr))' }}>
      <div>
        {CONSTRAINT_DEFS.map((def) => (
          <div key={def.key} className="mb-4">
            <div className="flex justify-between items-baseline gap-2 text-xs mb-1">
              <span style={{ color: 'var(--text-secondary)' }}>{def.label}</span>
              <span className="mono font-semibold" style={{ color: def.accent }}>{constraints[def.key]}</span>
            </div>
            <input
              type="range"
              min={0}
              max={100}
              step={1}
              value={constraints[def.key]}
              onChange={(e) => onChange(def.key, Number(e.target.value))}
              className="w-full"
              style={{ accentColor: def.accent }}
              aria-label={def.label}
            />
            <p className="text-[11px] leading-relaxed mt-1" style={{ color: 'var(--text-tertiary)' }}>{def.note}</p>
          </div>
        ))}
      </div>
      <div>
        {pressure && (
          <div className="rounded-md p-4 mb-4" style={{ background: `${pressure.color}12`, border: `1px solid ${pressure.color}55` }}>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span style={pill(pressure.color)}>{pressure.band}</span>
              <span className="mono text-sm font-semibold" style={{ color: pressure.color }}>
                复合压力 {pressure.composite}
              </span>
            </div>
            <p className="text-xs leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{pressure.note}</p>
          </div>
        )}
        {pressure && (
          <EChart
            option={radarOpt(
              ['财政紧缩', '稳定风险', '容量缺口', '信息迷雾'],
              [
                pressure.axes.fiscalTight,
                pressure.axes.stabilityRisk,
                pressure.axes.capacityGap,
                pressure.axes.fog,
              ],
              { name: '约束压力', color: pressure.color },
            )}
            style={{ height: 260 }}
          />
        )}
      </div>
    </div>
  );
}

function OutcomeCharts({ result }) {
  const radar = useMemo(() => {
    if (!result?.ok) return null;
    const m = result.metrics;
    return radarOpt(
      ['系统风险', '增长脉冲', '改革深度', '执行质量', '社会摩擦', '财政紧张'],
      [
        m.systemicRisk,
        m.growthImpulse,
        m.reformDepth,
        m.executionQuality,
        m.socialFriction,
        m.fiscalStrain,
      ],
      { name: '后果剖面', color: result.verdict.color },
    );
  }, [result]);

  const bar = useMemo(() => {
    if (!result?.ok) return null;
    const before = result.constraints;
    const after = result.postConstraints;
    const keys = ['fiscalSpace', 'socialStability', 'cadreCapacity', 'infoAsymmetry'];
    const labels = ['财政空间', '稳定缓冲', '干部容量', '信息不对称'];
    return {
      tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
      legend: { data: ['运行前', '运行后'], textStyle: { color: LABEL.color, fontSize: 11 }, top: 0 },
      grid: { left: 8, right: 12, top: 28, bottom: 4, containLabel: true },
      xAxis: {
        type: 'value', max: 100,
        axisLabel: { color: LABEL.color, fontSize: 10 },
        splitLine: { lineStyle: { color: 'rgba(148,163,184,0.1)' } },
      },
      yAxis: {
        type: 'category', data: labels, inverse: true,
        axisLabel: { color: LABEL.color, fontSize: 11 },
        axisLine: { lineStyle: { color: AXIS.lineStyle.color } },
      },
      series: [
        {
          name: '运行前', type: 'bar', barWidth: 8,
          data: keys.map((k) => before[k]),
          itemStyle: { color: 'rgba(148,163,184,0.35)', borderRadius: [0, 3, 3, 0] },
        },
        {
          name: '运行后', type: 'bar', barWidth: 8,
          data: keys.map((k) => after[k]),
          itemStyle: { color: CYAN, borderRadius: [0, 3, 3, 0] },
        },
      ],
    };
  }, [result]);

  if (!result?.ok) return null;
  return (
    <div className="grid gap-4 mt-4" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 280px), 1fr))' }}>
      <EChart option={radar} style={{ height: 280 }} />
      <EChart option={bar} style={{ height: 280 }} />
    </div>
  );
}

export default function GovernanceSimLab() {
  const [state, setState] = useState(() => loadLeadershipSimState());
  const [hydrated, setHydrated] = useState(false);
  const [exportPreview, setExportPreview] = useState('');
  const [copied, setCopied] = useState(false);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return undefined;
    saveLeadershipSimState(state);
  }, [state, hydrated]);

  const scenario = scenarioById(state.scenarioId) || GOV_SCENARIOS[0];
  const pressure = useMemo(
    () => readConstraintPressure(state.constraints),
    [state.constraints],
  );
  const liveResult = useMemo(() => {
    if (state.step !== 'outcome' && !state.optionId) return state.lastResult;
    return computeCurrentResult(state) || state.lastResult;
  }, [state]);

  const compare = useMemo(() => {
    const ids = state.compareIds || [];
    if (ids.length !== 2) return null;
    const a = (state.runs || []).find((r) => r.id === ids[0]);
    const b = (state.runs || []).find((r) => r.id === ids[1]);
    return compareGovRuns(a, b);
  }, [state.compareIds, state.runs]);

  const layerMeta = LAYER_META[scenario.layer] || LAYER_META.decision;
  const primaryLocus = INSTITUTIONAL_LOCI.find((l) => l.id === scenario.primaryLocus);

  const patch = (partial) => setState((prev) => ({ ...prev, ...partial }));

  const setConstraint = (key, val) => {
    setState((prev) => ({
      ...prev,
      constraints: { ...prev.constraints, [key]: val },
    }));
  };

  const goStep = (key) => patch({ step: key });

  const selectScenario = (id) => {
    setState((prev) => ({
      ...prev,
      scenarioId: id,
      optionId: null,
      lastResult: null,
      step: 'scenario',
    }));
  };

  const selectOption = (optionId) => {
    setState((prev) => {
      const next = { ...prev, optionId, step: 'outcome' };
      const result = runGovernanceSim({
        scenarioId: next.scenarioId,
        optionId,
        constraints: next.constraints,
      });
      return { ...next, lastResult: result.ok ? result : null };
    });
  };

  const persistRun = () => {
    const result = computeCurrentResult(state) || state.lastResult;
    if (!result?.ok) {
      setToast('尚无有效结果可固化');
      return;
    }
    setState((prev) => appendSimRun(prev, result));
    setToast('已写入本地存档');
  };

  const doReset = () => {
    if (!window.confirm('重置当前推演参数与流程？已固化存档将保留。')) return;
    setState((prev) => ({
      ...resetLeadershipSimState(),
      runs: prev.runs || [],
      compareIds: [],
    }));
    setExportPreview('');
    setToast('已重置当前局');
  };

  const doExport = () => {
    const result = computeCurrentResult(state) || state.lastResult;
    const md = buildGovSimExport({ result });
    setExportPreview(md);
    navigator.clipboard?.writeText(md).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    });
  };

  useEffect(() => {
    if (!toast) return undefined;
    const t = setTimeout(() => setToast(null), 2200);
    return () => clearTimeout(t);
  }, [toast]);

  if (!hydrated) {
    return (
      <Card title="治理结构推演台" className="mt-6 lead-gov">
        <p className="text-xs mono py-6" style={{ color: 'var(--text-tertiary)' }}>// 加载本地存档…</p>
      </Card>
    );
  }

  return (
    <Card title="治理结构推演台 · 选题 → 约束 → 选项 → 后果" className="mt-6 lead-gov">
      <p className="text-xs mb-3 leading-relaxed" style={{ color: 'var(--text-tertiary)' }}>
        结构化思想实验：把公开议题锚定到制度位点与权力三层，在财政/稳定/干部/信息四约束下选择可执行组合，并生成后果矩阵。
        状态键 <span className="mono" style={{ color: CYAN }}>{LEADERSHIP_SIM_STORAGE_KEY}</span> ·
        与<span style={{ color: GOLD }}> 三层归因 / 总理权限半径 / 信号灯 </span>命题同源 · 非评价 · 非预测 · 非倡导。
      </p>

      <MethodologyBanner />

      <div className="lead-gov-caution" role="note">
        <Lucide.AlertTriangle size={14} style={{ flexShrink: 0, color: GOLD }} />
        <div>
          <div className="text-[11px] mono mb-1" style={{ color: GOLD }}>使用告诫</div>
          <ul className="m-0 pl-4 text-[11px] leading-relaxed" style={{ color: 'var(--text-tertiary)' }}>
            {GOV_SIM_CAUTIONS.map((c) => (
              <li key={c} className="mb-0.5">{c}</li>
            ))}
          </ul>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2 mb-4">
        <button type="button" style={btnBase} onClick={doReset}>
          <span className="inline-flex items-center gap-1"><Lucide.RotateCcw size={13} />重置本局</span>
        </button>
        <button type="button" style={btnBase} onClick={persistRun} disabled={!liveResult?.ok}>
          <span className="inline-flex items-center gap-1"><Lucide.Save size={13} />固化存档</span>
        </button>
        <button type="button" style={btnBase} onClick={doExport} disabled={!liveResult?.ok}>
          <span className="inline-flex items-center gap-1"><Lucide.Download size={13} />{copied ? '已复制' : '导出 Markdown'}</span>
        </button>
        {toast && <span className="text-[11px] mono" style={{ color: GREEN }}>{toast}</span>}
      </div>

      <StepRail step={state.step} onSelect={goStep} />

      {/* ── 1 选题 ───────────────────────────────────────── */}
      {state.step === 'scenario' && (
        <section className="mt-4">
          <div className="lead-gov-loc-grid mb-4">
            {GOV_SCENARIOS.map((s) => {
              const on = state.scenarioId === s.id;
              const meta = LAYER_META[s.layer];
              return (
                <button
                  key={s.id}
                  type="button"
                  className={`lead-gov-card${on ? ' is-on' : ''}`}
                  style={{ '--card-accent': s.accent }}
                  onClick={() => selectScenario(s.id)}
                >
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <span style={pill(s.accent)}>{s.tag}</span>
                    <span style={pill(meta.color)}>{meta.shortLabel}层</span>
                  </div>
                  <div className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>{s.label}</div>
                  <p className="text-[11px] mt-1 leading-relaxed" style={{ color: 'var(--text-tertiary)' }}>{s.stakes}</p>
                </button>
              );
            })}
          </div>

          {scenario && (
            <div className="lead-gov-brief">
              <div className="flex flex-wrap items-center gap-2 mb-3">
                <span style={pill(scenario.accent)}>{scenario.tag}</span>
                <span style={pill(layerMeta.color)}>{layerMeta.label}</span>
                {primaryLocus && <span style={pill(CYAN)}>{primaryLocus.label}</span>}
              </div>
              <h4 className="text-base font-semibold m-0 mb-2" style={{ color: 'var(--text-primary)' }}>
                情景简报 · {scenario.label}
              </h4>
              <p className="text-sm leading-relaxed mb-3" style={{ color: 'var(--text-secondary)' }}>{scenario.brief}</p>
              <div className="grid gap-3 mb-3" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 200px), 1fr))' }}>
                <div>
                  <div className="text-[11px] mono mb-1" style={{ color: 'var(--text-tertiary)' }}>利害结构</div>
                  <p className="text-xs leading-relaxed m-0" style={{ color: 'var(--text-secondary)' }}>{scenario.stakes}</p>
                </div>
                <div>
                  <div className="text-[11px] mono mb-1" style={{ color: 'var(--text-tertiary)' }}>行动者（建制）</div>
                  <p className="text-xs leading-relaxed m-0" style={{ color: 'var(--text-secondary)' }}>
                    {(scenario.actors || []).join(' · ')}
                  </p>
                </div>
                <div>
                  <div className="text-[11px] mono mb-1" style={{ color: 'var(--text-tertiary)' }}>法律/制度框架</div>
                  <p className="text-xs leading-relaxed m-0" style={{ color: 'var(--text-secondary)' }}>{scenario.legalFrame}</p>
                </div>
              </div>
              <div className="rounded-md p-3 mb-3" style={{ background: 'var(--bg-base)', border: '1px solid var(--border-subtle)' }}>
                <div className="text-[11px] mono mb-2" style={{ color: GOLD }}>诊断权 vs 处方权</div>
                <p className="text-xs leading-relaxed mb-1" style={{ color: 'var(--text-secondary)' }}>
                  {scenario.diagnosisPrescription.diagnosis}
                </p>
                <p className="text-xs leading-relaxed m-0" style={{ color: 'var(--text-secondary)' }}>
                  {scenario.diagnosisPrescription.prescription}
                </p>
              </div>
              <div className="flex flex-wrap gap-2 mb-3">
                {(scenario.relatedRoutes || []).map((r) => (
                  <Link key={r.to} to={r.to} className="os-link text-xs mono">{r.label} ↗</Link>
                ))}
              </div>
              <ul className="text-[11px] m-0 pl-4" style={{ color: 'var(--text-tertiary)' }}>
                {(scenario.footnotes || []).map((f) => (
                  <li key={f}>{f}</li>
                ))}
              </ul>
              <div className="mt-4">
                <button
                  type="button"
                  onClick={() => goStep('constraints')}
                  className="text-xs mono px-3 py-1.5 rounded font-semibold"
                  style={{ background: 'rgba(34,211,238,0.12)', color: CYAN, border: '1px solid rgba(34,211,238,0.45)', cursor: 'pointer' }}
                >
                  下一步 · 设定约束 →
                </button>
              </div>
            </div>
          )}
        </section>
      )}

      {/* ── 2 约束 ───────────────────────────────────────── */}
      {state.step === 'constraints' && (
        <section className="mt-4">
          <p className="text-xs mb-4" style={{ color: 'var(--text-tertiary)' }}>
            拖动滑杆即时观察复合压力。四参量为思想实验刻度，非官方统计——用于暴露选项对物理上限的依赖。
          </p>
          <ConstraintSliders constraints={state.constraints} onChange={setConstraint} pressure={pressure} />
          <div className="flex flex-wrap gap-2 mt-4">
            <button type="button" style={btnBase} onClick={() => goStep('scenario')}>← 返回选题</button>
            <button
              type="button"
              onClick={() => goStep('options')}
              className="text-xs mono px-3 py-1.5 rounded font-semibold"
              style={{ background: 'rgba(34,211,238,0.12)', color: CYAN, border: '1px solid rgba(34,211,238,0.45)', cursor: 'pointer' }}
            >
              下一步 · 选择方案 →
            </button>
          </div>
        </section>
      )}

      {/* ── 3 选项 ───────────────────────────────────────── */}
      {state.step === 'options' && (
        <section className="mt-4">
          <p className="text-xs mb-3" style={{ color: 'var(--text-tertiary)' }}>
            当前情景「{scenario.label}」· 复合压力 <span className="mono" style={{ color: pressure.color }}>{pressure.composite}</span>
            （{pressure.band}）。选项映射到公开制度位点，不含个人褒贬。
          </p>
          <div className="lead-gov-options">
            {(scenario.options || []).map((opt) => {
              const locus = INSTITUTIONAL_LOCI.find((l) => l.id === opt.locus);
              const on = state.optionId === opt.id;
              return (
                <button
                  key={opt.id}
                  type="button"
                  className={`lead-gov-option${on ? ' is-on' : ''}`}
                  style={{ '--card-accent': scenario.accent }}
                  onClick={() => selectOption(opt.id)}
                >
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    {locus && <span style={pill(CYAN)}>{locus.label}</span>}
                    {locus && <span style={pill(LAYER_META[locus.layer].color)}>{LAYER_META[locus.layer].shortLabel}</span>}
                  </div>
                  <div className="text-sm font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>{opt.label}</div>
                  <p className="text-xs leading-relaxed m-0" style={{ color: 'var(--text-secondary)' }}>{opt.summary}</p>
                </button>
              );
            })}
          </div>
          {!scenario.options?.length && (
            <p className="text-xs mono py-4" style={{ color: RED }}>// 该情景选项数据缺失</p>
          )}
          <div className="flex flex-wrap gap-2 mt-4">
            <button type="button" style={btnBase} onClick={() => goStep('constraints')}>← 返回约束</button>
            {state.optionId && (
              <button
                type="button"
                onClick={() => goStep('outcome')}
                className="text-xs mono px-3 py-1.5 rounded font-semibold"
                style={{ background: 'rgba(196,30,58,0.12)', color: RED, border: '1px solid rgba(196,30,58,0.45)', cursor: 'pointer' }}
              >
                查看后果 →
              </button>
            )}
          </div>
        </section>
      )}

      {/* ── 4 后果 ───────────────────────────────────────── */}
      {state.step === 'outcome' && (
        <section className="mt-4">
          {!liveResult?.ok ? (
            <div className="rounded-md p-4 text-xs" style={{ background: 'var(--bg-elevated)', border: '1px dashed var(--border-subtle)', color: 'var(--text-tertiary)' }}>
              尚无推演结果。请先完成「选题 → 约束 → 选项」。
              <div className="mt-3">
                <button type="button" style={btnBase} onClick={() => goStep('options')}>前往选项</button>
              </div>
            </div>
          ) : (
            <>
              <div
                className="rounded-md p-4 mb-4"
                style={{ background: `${liveResult.verdict.color}10`, border: `1px solid ${liveResult.verdict.color}55` }}
              >
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  <span className="text-sm font-semibold mono px-3 py-1 rounded" style={{ background: `${liveResult.verdict.color}22`, color: liveResult.verdict.color, border: `1px solid ${liveResult.verdict.color}66` }}>
                    {liveResult.verdict.label}
                  </span>
                  <span style={pill(SLATE)}>{liveResult.layerLabel}</span>
                  {liveResult.primaryLocus && <span style={pill(CYAN)}>{liveResult.primaryLocus.label}</span>}
                  <span className="mono text-[11px]" style={{ color: 'var(--text-tertiary)' }}>张力指数 {liveResult.tension}</span>
                </div>
                <p className="text-xs leading-relaxed m-0" style={{ color: 'var(--text-secondary)' }}>{liveResult.verdict.note}</p>
              </div>

              <div className="lead-gov-matrix">
                <div className="lead-gov-matrix__cell">
                  <div className="text-[11px] mono mb-1" style={{ color: GREEN }}>意图效果</div>
                  <p className="text-xs leading-relaxed m-0" style={{ color: 'var(--text-secondary)' }}>{liveResult.matrix.intended}</p>
                </div>
                <div className="lead-gov-matrix__cell">
                  <div className="text-[11px] mono mb-1" style={{ color: GOLD }}>伴生副作用</div>
                  <p className="text-xs leading-relaxed m-0" style={{ color: 'var(--text-secondary)' }}>{liveResult.matrix.sideEffects}</p>
                </div>
                <div className="lead-gov-matrix__cell">
                  <div className="text-[11px] mono mb-1" style={{ color: RED }}>不可逆成本</div>
                  <p className="text-xs leading-relaxed m-0" style={{ color: 'var(--text-secondary)' }}>{liveResult.matrix.irreversible}</p>
                </div>
              </div>

              <OutcomeCharts result={liveResult} />

              <p className="text-[11px] mono mt-3" style={{ color: 'var(--text-tertiary)' }}>
                {liveResult.asOfNote}
              </p>

              {/* 约束可在后果页微调并即时重算 */}
              <details className="mt-4">
                <summary className="text-xs mono cursor-pointer" style={{ color: CYAN }}>微调约束并即时重算</summary>
                <div className="mt-3">
                  <ConstraintSliders constraints={state.constraints} onChange={setConstraint} pressure={pressure} />
                </div>
              </details>

              <div className="flex flex-wrap gap-2 mt-4">
                <button type="button" style={btnBase} onClick={() => goStep('options')}>← 改选方案</button>
                <button type="button" style={btnBase} onClick={persistRun}>固化本局</button>
                <button type="button" style={btnBase} onClick={doExport}>{copied ? '已复制 ✓' : '导出'}</button>
              </div>
            </>
          )}
        </section>
      )}

      {/* ── 存档与对照 ───────────────────────────────────── */}
      <section className="mt-6 pt-4" style={{ borderTop: '1px solid var(--border-subtle)' }}>
        <div className="flex flex-wrap items-baseline justify-between gap-2 mb-3">
          <h4 className="text-sm font-semibold m-0" style={{ color: 'var(--text-primary)' }}>存档对照 · 最多 {12} 条</h4>
          <span className="text-[11px] mono" style={{ color: 'var(--text-tertiary)' }}>勾选恰好 2 条进行对照</span>
        </div>
        {(state.runs || []).length === 0 ? (
          <p className="text-xs mono py-3" style={{ color: 'var(--text-tertiary)' }}>
            // 空态：尚未固化推演。完成一局后点击「固化存档」。
          </p>
        ) : (
          <ul className="lead-gov-runs">
            {(state.runs || []).map((run) => {
              const checked = (state.compareIds || []).includes(run.id);
              return (
                <li key={run.id} className="lead-gov-run">
                  <label className="lead-gov-run__check">
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => setState((prev) => toggleCompareId(prev, run.id))}
                    />
                    <span>
                      <span className="text-xs font-semibold" style={{ color: 'var(--text-primary)' }}>{run.label}</span>
                      <span className="block text-[10px] mono" style={{ color: 'var(--text-tertiary)' }}>
                        {run.ts?.slice(0, 19)?.replace('T', ' ')} · {run.result?.verdict?.label}
                      </span>
                    </span>
                  </label>
                  <button
                    type="button"
                    style={{ ...btnBase, padding: '4px 8px', fontSize: 11 }}
                    onClick={() => setState((prev) => removeSimRun(prev, run.id))}
                  >
                    删除
                  </button>
                </li>
              );
            })}
          </ul>
        )}

        {compare?.ok && (
          <div className="mt-4 overflow-x-auto">
            <p className="text-xs mb-2" style={{ color: 'var(--text-tertiary)' }}>
              A：{compare.aLabel} · B：{compare.bLabel}
            </p>
            <table className="w-full text-xs" style={{ borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ color: 'var(--text-tertiary)' }}>
                  {['指标', 'A', 'B', 'Δ(B−A)'].map((h) => (
                    <th key={h} className="text-left mono font-normal py-2 pr-3 border-b" style={{ borderColor: 'var(--border-subtle)' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {compare.rows.map((row) => (
                  <tr key={row.key}>
                    <td className="py-2 pr-3 border-b" style={{ borderColor: 'var(--border-subtle)', color: 'var(--text-secondary)' }}>{row.label}</td>
                    <td className="py-2 pr-3 border-b mono" style={{ borderColor: 'var(--border-subtle)', color: 'var(--text-primary)' }}>{row.a}</td>
                    <td className="py-2 pr-3 border-b mono" style={{ borderColor: 'var(--border-subtle)', color: 'var(--text-primary)' }}>{row.b}</td>
                    <td className="py-2 border-b mono" style={{ borderColor: 'var(--border-subtle)', color: row.delta > 0 ? RED : row.delta < 0 ? GREEN : SLATE }}>
                      {row.delta > 0 ? `+${row.delta}` : row.delta}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p className="text-[11px] mt-2" style={{ color: 'var(--text-tertiary)' }}>{compare.note}</p>
          </div>
        )}
        {compare && !compare.ok && (
          <p className="text-xs mono mt-2" style={{ color: GOLD }}>// {compare.error}</p>
        )}
      </section>

      {exportPreview && (
        <pre
          className="text-[11px] leading-relaxed p-4 rounded mt-4 mono overflow-auto"
          style={{ background: 'var(--bg-base)', border: '1px solid var(--border-subtle)', color: 'var(--text-secondary)', maxHeight: 280, whiteSpace: 'pre-wrap' }}
        >
          {exportPreview}
        </pre>
      )}

      <p className="text-[11px] mono mt-4 pt-3 border-t" style={{ color: 'var(--text-tertiary)', borderColor: 'var(--border-subtle)' }}>
        公开制度事实 / 不以个人褒贬评分 · 思想实验可复现 · {LEADERSHIP_SIM_STORAGE_KEY}
      </p>
    </Card>
  );
}
