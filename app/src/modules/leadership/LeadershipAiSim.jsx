import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import * as Lucide from 'lucide-react';
import { Card } from '../../app/ui.jsx';
import { Markdown } from '../../lib/ai/markdown.jsx';
import { chat, isConfigured, loadConfig } from '../../lib/ai/client.js';
import { LAYER_META } from '../../domain/governance.ts';
import {
  GOV_SIM_CAUTIONS,
  GOV_SIM_METHODOLOGY,
  LEADERSHIP_SIM_STORAGE_KEY,
  scenarioById,
} from './leadershipGovSim.js';

const CYAN = '#22d3ee';
const RED = '#c41e3a';
const GOLD = '#e8a317';
const GREEN = '#10b981';
const SCOPE = '公开信息梳理 · 学理分析框架 · 思想实验 · 非评价 · 非预测 · 非倡导';
const AI_DRAFT_KEY = 'chinaos.leadership.ai-draft.v1';

/** 议事席位：映射权力三层，不指向具体个人 */
const ROLES = [
  {
    id: 'psc',
    label: '政治局常委会',
    layer: 'direction',
    accent: RED,
    hint: '路线层 · 政治安全优先 · 议程排序',
    persona:
      '你扮演「政治局常委会」集体议事视角的推演助手（制度位点，非具体人）。以路线层逻辑作答：先政治安全与稳定，再经济与民生，再改革与对外。书面冷峻中文，120–220 字；列 2–3 个可观察选项，标明意图效果/副作用/不可逆成本的雏形；不指名具体人物、不作现实预测、不做能力评分。',
  },
  {
    id: 'cfe',
    label: '中央财经委',
    layer: 'decision',
    accent: GOLD,
    hint: '决策层 · 经济剂量与处方权位点',
    persona:
      '你扮演「中央财经委员会」议事视角的推演助手。侧重结构性剂量：赤字、化债、产业投入排序。点明诊断权（行政链）与处方权（议事协调）可能分离。书面中文，120–220 字；不评价个人、不倡导路线。',
  },
  {
    id: 'pb',
    label: '中央政治局',
    layer: 'decision',
    accent: GOLD,
    hint: '决策层 · 部委协调与地方对表',
    persona:
      '你扮演「中央政治局」扩大议事视角的推演助手。侧重政策协调、部委博弈与地方执行张力如何被压缩为可执行决议。书面中文，120–220 字；呈现多方建制诉求，非褒贬。',
  },
  {
    id: 'govteam',
    label: '国务院执行层',
    layer: 'execution',
    accent: CYAN,
    hint: '执行层 · 工具箱与体感质量（诊断权常驻）',
    persona:
      '你扮演国务院行政执行层视角的推演助手。聚焦执行算法、部委分工、财政与民生工具箱，以及「看得见问题但未必持有结构性处方权」的约束。书面中文，120–220 字；强调决策—执行—反馈与物理约束，非预测非倡导。',
  },
];

/** AI 舞台元数据：与结构化推演台情景 id 对齐 */
const SCENARIO_STAGE = {
  'local-debt': {
    venue: 'SCENE · 财政协调场域',
    locale: '中央—地方财政联席 · 示意议程台',
    phases: ['议题导入', '部委对表', '剂量权衡', '口径收敛'],
    stakes: [
      { key: 'urgency', label: '议程紧迫度', value: 82, accent: RED },
      { key: 'fiscal', label: '财政约束压强', value: 88, accent: GOLD },
      { key: 'social', label: '民生暴露面', value: 64, accent: CYAN },
      { key: 'coord', label: '央地协调成本', value: 76, accent: GREEN },
    ],
  },
  'tech-blockade': {
    venue: 'SCENE · 科技攻关场域',
    locale: '供应链安全议题台 · 示意战役图',
    phases: ['风险识别', '资源重配', '条块会商', '节奏裁定'],
    stakes: [
      { key: 'urgency', label: '议程紧迫度', value: 79, accent: RED },
      { key: 'fiscal', label: '研发投入张力', value: 71, accent: GOLD },
      { key: 'social', label: '就业预期敏感', value: 68, accent: CYAN },
      { key: 'coord', label: '产业链耦合', value: 84, accent: GREEN },
    ],
  },
  'demo-pressure': {
    venue: 'SCENE · 人口结构场域',
    locale: '社保与生育政策联席 · 示意账本',
    phases: ['趋势对账', '杠杆盘点', '试点边界', '长期约束'],
    stakes: [
      { key: 'urgency', label: '议程紧迫度', value: 70, accent: RED },
      { key: 'fiscal', label: '社保平衡承压', value: 86, accent: GOLD },
      { key: 'social', label: '代际分配摩擦', value: 80, accent: CYAN },
      { key: 'coord', label: '地方试点分化', value: 72, accent: GREEN },
    ],
  },
  'reform-window': {
    venue: 'SCENE · 改革节奏场域',
    locale: '突破—熔断双轨 · 示意风控台',
    phases: ['窗口研判', '范围划定', '熔断预置', '节奏拍板'],
    stakes: [
      { key: 'urgency', label: '议程紧迫度', value: 74, accent: RED },
      { key: 'fiscal', label: '转型摩擦成本', value: 69, accent: GOLD },
      { key: 'social', label: '社会韧性上限', value: 77, accent: CYAN },
      { key: 'coord', label: '利益结构阻力', value: 83, accent: GREEN },
    ],
  },
};

function loadDraft() {
  try {
    const raw = JSON.parse(localStorage.getItem(AI_DRAFT_KEY) || 'null');
    if (!raw || typeof raw !== 'object') return null;
    return raw;
  } catch {
    return null;
  }
}

function saveDraft(payload) {
  try {
    localStorage.setItem(AI_DRAFT_KEY, JSON.stringify(payload));
  } catch { /* ignore */ }
}

function SceneBackdrop({ accent }) {
  return (
    <svg className="lead-sim-stage__backdrop" viewBox="0 0 800 280" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <defs>
        <linearGradient id="leadSimSky" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={accent} stopOpacity="0.18" />
          <stop offset="55%" stopColor="#0b1220" stopOpacity="0.05" />
          <stop offset="100%" stopColor="#0b1220" stopOpacity="0.35" />
        </linearGradient>
        <linearGradient id="leadSimHorizon" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={accent} stopOpacity="0.25" />
          <stop offset="100%" stopColor="transparent" stopOpacity="0" />
        </linearGradient>
      </defs>
      <rect width="800" height="280" fill="url(#leadSimSky)" />
      <path
        d="M0 210 L60 190 L90 200 L140 160 L180 175 L230 145 L280 168 L340 130 L390 155 L450 120 L510 150 L560 125 L620 145 L680 118 L740 140 L800 125 L800 280 L0 280 Z"
        fill="url(#leadSimHorizon)"
        opacity="0.9"
      />
      <path
        d="M40 210 V165 H70 V210 M85 210 V150 H130 V210 M150 210 V175 H195 V210 M250 210 V140 H310 V210 M360 210 V155 H420 V210 M480 210 V130 H560 V210 M600 210 V160 H680 V210 M720 210 V145 H770 V210"
        fill="none"
        stroke={accent}
        strokeOpacity="0.35"
        strokeWidth="1.2"
      />
      <ellipse cx="620" cy="95" rx="140" ry="72" fill="none" stroke={accent} strokeOpacity="0.22" strokeWidth="1" strokeDasharray="4 5" />
      <ellipse cx="620" cy="95" rx="90" ry="46" fill="none" stroke={CYAN} strokeOpacity="0.18" strokeWidth="1" />
      <circle cx="620" cy="95" r="3.5" fill={accent} fillOpacity="0.7" />
    </svg>
  );
}

function Bubble({ role, content, streaming }) {
  const meta = ROLES.find((r) => r.id === role);
  const accent = meta?.accent || 'var(--text-tertiary)';
  const layer = meta ? LAYER_META[meta.layer] : null;
  return (
    <div className="mb-3" style={{ borderLeft: `3px solid ${accent}`, paddingLeft: 10 }}>
      <div className="flex items-center gap-2 mb-1 flex-wrap">
        <span className="text-[11px] mono" style={{ color: accent }}>{meta?.label || role}</span>
        {layer && (
          <span className="text-[10px] mono" style={{ color: layer.color }}>
            {layer.shortLabel}层
          </span>
        )}
      </div>
      <div className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
        <Markdown text={content || (streaming ? '…' : '')} />
      </div>
    </div>
  );
}

export default function LeadershipAiSim({ onGotoGovSim }) {
  const draft = useMemo(() => loadDraft(), []);
  const [selectedRoles, setSelectedRoles] = useState(() => new Set(draft?.roles || ['psc', 'cfe']));
  const [scenarioId, setScenarioId] = useState(draft?.scenarioId || 'local-debt');
  const [customPrompt, setCustomPrompt] = useState(draft?.customPrompt || '');
  const [turns, setTurns] = useState(() => (Array.isArray(draft?.turns) ? draft.turns : []));
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);
  const [phaseIdx, setPhaseIdx] = useState(0);
  const [stakesReady, setStakesReady] = useState(false);
  const abortRef = useRef(null);
  const phaseTimer = useRef(null);

  const scenario = useMemo(() => scenarioById(scenarioId), [scenarioId]);
  const stage = SCENARIO_STAGE[scenarioId] || SCENARIO_STAGE['local-debt'];
  const defaultPrompt = scenario
    ? `${scenario.brief}\n\n请从本制度位点视角推演：优先工具、可接受代价、意图效果/副作用/不可逆成本，并注明诊断权与处方权分别落在何处。`
    : '';
  const promptText = (customPrompt.trim() || defaultPrompt).trim();

  useEffect(() => {
    saveDraft({
      scenarioId,
      roles: [...selectedRoles],
      customPrompt,
      turns: turns.filter((t) => t.role === 'user' || (t.content && t.content.length)),
    });
  }, [scenarioId, selectedRoles, customPrompt, turns]);

  const toggleRole = (id) => {
    setSelectedRoles((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        if (next.size > 1) next.delete(id);
      } else next.add(id);
      return next;
    });
  };

  useEffect(() => {
    setStakesReady(false);
    setPhaseIdx(0);
    const t = requestAnimationFrame(() => setStakesReady(true));
    return () => cancelAnimationFrame(t);
  }, [scenarioId]);

  useEffect(() => {
    if (!busy) {
      if (phaseTimer.current) clearInterval(phaseTimer.current);
      return undefined;
    }
    setPhaseIdx(0);
    phaseTimer.current = setInterval(() => {
      setPhaseIdx((i) => Math.min(i + 1, (stage.phases?.length || 1) - 1));
    }, 2200);
    return () => {
      if (phaseTimer.current) clearInterval(phaseTimer.current);
    };
  }, [busy, stage.phases]);

  const runSimulation = useCallback(async () => {
    if (busy) return;
    if (!isConfigured()) {
      setError('未配置 API：请打开右下角全局 AI 助手 · 设置（密钥仅存浏览器本地）。亦可先用「治理推演」分区完成结构化推演，无需模型。');
      return;
    }
    const roleList = ROLES.filter((r) => selectedRoles.has(r.id));
    if (!roleList.length || !promptText) return;

    setError(null);
    setBusy(true);
    setTurns([{ role: 'user', content: promptText }]);
    const controller = new AbortController();
    abortRef.current = controller;

    const cfg = loadConfig();
    const baseSystem = [
      '你是 China OS 领袖统治模块的多角色治理推演助手。',
      SCOPE,
      '以下为思想实验，不对应任何现实会议。',
      '禁止：个人能力/性格评分、派系八卦、非公开内幕、作战方案、政策倡导。',
      '必须：冷峻书面简体中文；锚定制度位点；区分诊断权与处方权；点出财政/稳定/干部容量/信息不对称约束。',
      `方法论·模拟：${GOV_SIM_METHODOLOGY.models.join(' ')}`,
      `方法论·不声称：${GOV_SIM_METHODOLOGY.doesNotClaim.join(' ')}`,
    ].join('\n');

    try {
      const transcript = [{ role: 'user', content: `情景：${promptText}` }];
      for (const role of roleList) {
        setTurns((prev) => [...prev, { role: role.id, content: '' }]);
        let acc = '';
        await chat({
          config: cfg,
          signal: controller.signal,
          messages: [
            { role: 'system', content: `${baseSystem}\n\n${role.persona}` },
            ...transcript,
          ],
          onToken: (delta) => {
            acc += delta;
            setTurns((prev) => {
              const copy = prev.slice();
              copy[copy.length - 1] = { role: role.id, content: acc };
              return copy;
            });
          },
        });
        transcript.push({ role: 'assistant', content: acc });
        transcript.push({
          role: 'user',
          content: '（继续）下一位议事位点请基于上文补充本视角的权衡与可执行选项，避免重复；标明与上文的分歧点。',
        });
      }
      setPhaseIdx((stage.phases?.length || 1) - 1);
    } catch (e) {
      if (e?.name !== 'AbortError') {
        setError(e?.message || '推演请求失败');
        setTurns((prev) => prev.filter((t) => t.role === 'user' || t.content));
      }
    } finally {
      setBusy(false);
      abortRef.current = null;
    }
  }, [busy, promptText, selectedRoles, stage.phases]);

  const stop = () => abortRef.current?.abort();

  const clearAll = () => {
    setTurns([]);
    setError(null);
    setPhaseIdx(0);
    setCustomPrompt('');
    try { localStorage.removeItem(AI_DRAFT_KEY); } catch { /* ignore */ }
  };

  const inp = {
    background: 'var(--bg-base)', border: '1px solid var(--border-subtle)',
    color: 'var(--text-primary)', borderRadius: 6, padding: '6px 10px', fontSize: 13,
  };

  const scenarios = ['local-debt', 'tech-blockade', 'demo-pressure', 'reform-window']
    .map((id) => scenarioById(id))
    .filter(Boolean);

  return (
    <Card title="AI 多位点治理推演 · 情景舞台" className="mt-6 lead-sim">
      <p className="text-xs mb-3 leading-relaxed" style={{ color: 'var(--text-tertiary)' }}>
        与「治理推演」分区共用情景与制度位点口径；本区用模型生成多视角书面推演。
        草稿键 <span className="mono" style={{ color: CYAN }}>{AI_DRAFT_KEY}</span> ·
        结构化存档键 <span className="mono" style={{ color: CYAN }}>{LEADERSHIP_SIM_STORAGE_KEY}</span>。
        {SCOPE}
      </p>

      <div className="lead-gov-caution mb-4" role="note">
        <Lucide.AlertTriangle size={14} style={{ flexShrink: 0, color: GOLD }} />
        <ul className="m-0 pl-4 text-[11px] leading-relaxed" style={{ color: 'var(--text-tertiary)' }}>
          {GOV_SIM_CAUTIONS.slice(0, 3).map((c) => (
            <li key={c}>{c}</li>
          ))}
          <li>语言模型输出不可审计为「官方表态」；结构化推演台的确定性函数更适合作对照底稿。</li>
        </ul>
      </div>

      <div className="text-[11px] mono mb-2" style={{ color: 'var(--text-tertiary)' }}>1 · 选题（与治理推演台对齐）</div>
      <div className="lead-sim-locations">
        {scenarios.map((s) => {
          const on = scenarioId === s.id;
          return (
            <button
              key={s.id}
              type="button"
              className={`lead-sim-loc${on ? ' is-on' : ''}`}
              style={{ '--loc-accent': s.accent }}
              onClick={() => setScenarioId(s.id)}
            >
              <div className="lead-sim-loc__tag">{s.tag} · {LAYER_META[s.layer]?.shortLabel}层</div>
              <div className="lead-sim-loc__title">{s.label}</div>
              <div className="lead-sim-loc__sub">{s.stakes}</div>
            </button>
          );
        })}
      </div>

      <div className="lead-sim-stage mb-4">
        <SceneBackdrop accent={scenario?.accent || RED} />
        <div className="lead-sim-stage__grid" aria-hidden="true" />
        <div
          className="lead-sim-stage__glow"
          style={{ background: `radial-gradient(circle, ${scenario?.accent || RED}66, transparent 70%)` }}
          aria-hidden="true"
        />
        <div className="lead-sim-stage__body">
          <div className="lead-sim-stage__top">
            <div>
              <div className="lead-sim-stage__venue" style={{ color: scenario?.accent || RED }}>
                {stage.venue}
                {busy && (
                  <span className="ml-2" style={{ color: RED }}>
                    <span className="lead-sim-live-dot" />推演中
                  </span>
                )}
              </div>
              <h4 className="lead-sim-stage__title">{scenario?.label}</h4>
              <p className="lead-sim-stage__locale">{stage.locale}</p>
            </div>
            <div className="lead-sim-timeline" role="list" aria-label="议事相位">
              {(stage.phases || []).map((p, i) => {
                const active = i === phaseIdx;
                const done = i < phaseIdx;
                return (
                  <span
                    key={p}
                    role="listitem"
                    className={`lead-sim-phase${active ? ' is-active' : ''}${done ? ' is-done' : ''}`}
                    style={{ '--phase-accent': scenario?.accent || RED }}
                  >
                    {i + 1}. {p}
                  </span>
                );
              })}
            </div>
          </div>

          {scenario && (
            <p className="text-xs leading-relaxed m-0 mb-2" style={{ color: 'var(--text-secondary)' }}>
              {scenario.brief}
            </p>
          )}

          <div className="lead-sim-stakes" aria-label="张力表">
            {(stage.stakes || []).map((st) => (
              <div key={st.key} className="lead-sim-stake" style={{ '--stake-accent': st.accent }}>
                <div className="lead-sim-stake__head">
                  <span className="lead-sim-stake__label">{st.label}</span>
                  <span className="lead-sim-stake__val">{st.value}</span>
                </div>
                <div className="lead-sim-stake__track">
                  <div
                    className="lead-sim-stake__fill"
                    style={{ width: stakesReady ? `${st.value}%` : '0%' }}
                  />
                </div>
              </div>
            ))}
          </div>
          <p className="text-[10px] mono m-0" style={{ color: 'var(--text-tertiary)' }}>
            张力表为思想实验标定（0–100）· 非官方指数 · 可在治理推演台调节真实约束参量
          </p>
        </div>
      </div>

      <div className="text-[11px] mono mb-2" style={{ color: 'var(--text-tertiary)' }}>2 · 议事位点（权力三层 · 可多选）</div>
      <div className="lead-sim-board">
        {ROLES.map((r) => {
          const on = selectedRoles.has(r.id);
          const layer = LAYER_META[r.layer];
          return (
            <button
              key={r.id}
              type="button"
              className={`lead-sim-seat${on ? ' is-on' : ''}`}
              style={{ '--seat-accent': r.accent }}
              onClick={() => toggleRole(r.id)}
            >
              <div className="lead-sim-seat__label" style={{ color: on ? r.accent : 'var(--text-primary)' }}>{r.label}</div>
              <div className="text-[10px] mono mt-0.5" style={{ color: layer.color }}>{layer.label}</div>
              <div className="lead-sim-seat__hint">{r.hint}</div>
            </button>
          );
        })}
      </div>

      <div className="mb-4">
        <div className="text-[11px] mono mb-2" style={{ color: 'var(--text-tertiary)' }}>3 · 情景输入 · 可覆盖模板</div>
        <textarea
          value={customPrompt}
          onChange={(e) => setCustomPrompt(e.target.value)}
          placeholder={defaultPrompt}
          rows={4}
          style={{ ...inp, width: '100%', resize: 'vertical', lineHeight: 1.5 }}
        />
      </div>

      <div className="flex items-center gap-2 flex-wrap mb-4">
        <button type="button" onClick={runSimulation} disabled={busy}
          className="text-xs mono px-3 py-1.5 rounded font-semibold flex items-center gap-1.5"
          style={{ background: 'rgba(196,30,58,0.14)', color: RED, border: '1px solid rgba(196,30,58,0.45)', cursor: busy ? 'wait' : 'pointer', opacity: busy ? 0.7 : 1 }}>
          <Lucide.Play size={14} />{busy ? '推演中…' : '启动多位点推演'}
        </button>
        {busy && (
          <button type="button" onClick={stop} className="text-xs mono px-3 py-1.5 rounded"
            style={{ ...inp, cursor: 'pointer' }}>停止</button>
        )}
        <button type="button" onClick={clearAll} disabled={busy}
          className="text-xs mono px-3 py-1.5 rounded"
          style={{ ...inp, cursor: 'pointer', color: 'var(--text-tertiary)' }}>
          清空草稿
        </button>
        {typeof onGotoGovSim === 'function' && (
          <button
            type="button"
            onClick={onGotoGovSim}
            className="text-xs mono px-3 py-1.5 rounded"
            style={{ ...inp, cursor: 'pointer', color: CYAN }}
          >
            无需 API · 打开治理推演台
          </button>
        )}
        {!isConfigured() && (
          <span className="text-[11px] mono" style={{ color: GOLD }}>未配置 API</span>
        )}
      </div>

      {error && (
        <div className="rounded-md p-3 mb-3 text-xs leading-relaxed" style={{ background: `${RED}10`, border: `1px solid ${RED}44`, color: 'var(--text-secondary)' }}>
          <span className="mono" style={{ color: RED }}>// </span>{error}
        </div>
      )}

      {busy && turns.length === 0 && (
        <p className="text-xs mono py-3" style={{ color: 'var(--text-tertiary)' }}>// 加载中：正在按位点顺序请求模型…</p>
      )}

      {!busy && turns.length === 0 && (
        <div className="rounded-md p-4 text-xs" style={{ background: 'var(--bg-elevated)', border: '1px dashed var(--border-subtle)', color: 'var(--text-tertiary)' }}>
          空态：选择情景与议事位点后启动推演。若无 API，请使用「治理推演」分区完成选题→约束→选项→后果全流程。
        </div>
      )}

      {turns.length > 0 && (
        <div className={`lead-sim-transcript${busy ? ' is-live' : ''}`}>
          {turns.map((t, i) => (
            t.role === 'user'
              ? (
                <div key={i} className="mb-3 pb-3" style={{ borderBottom: '1px dashed var(--border-subtle)' }}>
                  <div className="text-[11px] mono mb-1" style={{ color: 'var(--text-tertiary)' }}>情景输入</div>
                  <p className="text-sm leading-relaxed" style={{ color: 'var(--text-primary)' }}>{t.content}</p>
                </div>
              )
              : <Bubble key={i} role={t.role} content={t.content} streaming={busy && i === turns.length - 1} />
          ))}
        </div>
      )}

      <p className="text-[11px] mono mt-3 pt-3 border-t" style={{ color: 'var(--text-tertiary)', borderColor: 'var(--border-subtle)' }}>
        {SCOPE} · 制度位点推演 · 公开制度事实 / 不以个人褒贬评分
      </p>
    </Card>
  );
}
