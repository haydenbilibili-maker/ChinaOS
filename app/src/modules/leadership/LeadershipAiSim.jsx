import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import * as Lucide from 'lucide-react';
import { Card } from '../../app/ui.jsx';
import { Markdown } from '../../lib/ai/markdown.jsx';
import { chat, isConfigured, loadConfig } from '../../lib/ai/client.js';

const CYAN = '#22d3ee';
const RED = '#c41e3a';
const GOLD = '#e8a317';
const GREEN = '#10b981';
const SCOPE = '公开信息梳理 · 学理分析框架 · 思想实验 · 非评价 · 非预测 · 非倡导';

const ROLES = [
  {
    id: 'psc',
    label: '政治局常委会',
    accent: RED,
    hint: '政治安全优先 · 议题排序与口径收敛',
    persona: '你扮演「政治局常委会」集体决策视角的推演助手。以常委会议事逻辑作答：先政治安全与稳定，再经济与民生，再改革与对外。用语克制、书面中文，每条回应 120–220 字，列 2–3 个可观察选项或分歧点，不指名具体人物、不作现实预测。',
  },
  {
    id: 'pb',
    label: '中央政治局',
    accent: GOLD,
    hint: '部委协调 · 地方执行张力压缩',
    persona: '你扮演「中央政治局」扩大议事视角的推演助手。侧重政策协调、部委博弈与地方执行张力。书面中文，120–220 字，呈现多方诉求如何被压缩为可执行决议，不评价优劣、不倡导路线。',
  },
  {
    id: 'govteam',
    label: '治理团队',
    accent: CYAN,
    hint: '执行算法 · 财政与民生工具箱',
    persona: '你扮演国务院治理团队（总理领衔的行政执行层）视角的推演助手。聚焦执行算法、部委分工、财政与民生工具箱。书面中文，120–220 字，强调「决策—执行—反馈」链条与物理约束（财政、人口、产业），非预测非倡导。',
  },
];

/** 场景舞台元数据：地点 / 张力表 / 议事相位（学理框架，非现实预判） */
const SCENARIOS = [
  {
    id: 'fiscal',
    label: '地方债务与财政倒挂',
    venue: 'SCENE · 财政协调场域',
    locale: '中央—地方财政联席 · 示意议程台',
    tag: '财政',
    accent: GOLD,
    stakes: [
      { key: 'urgency', label: '议程紧迫度', value: 82, accent: RED },
      { key: 'fiscal', label: '财政约束压强', value: 88, accent: GOLD },
      { key: 'social', label: '民生暴露面', value: 64, accent: CYAN },
      { key: 'coord', label: '央地协调成本', value: 76, accent: GREEN },
    ],
    phases: ['议题导入', '部委对表', '常委权衡', '口径收敛'],
    prompt: '地方隐性债务化解进入深水区，部分省份财政自给率持续下行，同时中央要求稳增长与保民生。请从本角色视角推演：优先工具、可接受代价、与中央口径如何对齐。',
  },
  {
    id: 'tech',
    label: '科技封锁与产业升级',
    venue: 'SCENE · 科技攻关场域',
    locale: '供应链安全议题台 · 示意战役图',
    tag: '科技',
    accent: CYAN,
    stakes: [
      { key: 'urgency', label: '议程紧迫度', value: 79, accent: RED },
      { key: 'fiscal', label: '研发投入张力', value: 71, accent: GOLD },
      { key: 'social', label: '就业预期敏感', value: 68, accent: CYAN },
      { key: 'coord', label: '产业链耦合', value: 84, accent: GREEN },
    ],
    phases: ['风险识别', '资源重配', '条块会商', '节奏裁定'],
    prompt: '外部技术管制收紧，国内关键产业链存在断供风险，同时需要维持就业与市场预期。请从本角色视角推演：短期稳预期与中长期攻关如何分配注意力与政策资源。',
  },
  {
    id: 'demographic',
    label: '人口负增长与社保压力',
    venue: 'SCENE · 人口结构场域',
    locale: '社保与生育政策联席 · 示意账本',
    tag: '人口',
    accent: GREEN,
    stakes: [
      { key: 'urgency', label: '议程紧迫度', value: 70, accent: RED },
      { key: 'fiscal', label: '社保平衡承压', value: 86, accent: GOLD },
      { key: 'social', label: '代际分配摩擦', value: 80, accent: CYAN },
      { key: 'coord', label: '地方试点分化', value: 72, accent: GREEN },
    ],
    phases: ['趋势对账', '杠杆盘点', '试点边界', '长期约束'],
    prompt: '人口负增长与老龄化加速，社保基金中长期平衡承压，地方生育支持政策效果分化。请从本角色视角推演：可动用的政策杠杆与不可回避的结构约束。',
  },
  {
    id: 'reform',
    label: '改革窗口与风险防控',
    venue: 'SCENE · 改革节奏场域',
    locale: '突破—熔断双轨 · 示意风控台',
    tag: '改革',
    accent: RED,
    stakes: [
      { key: 'urgency', label: '议程紧迫度', value: 74, accent: RED },
      { key: 'fiscal', label: '转型摩擦成本', value: 69, accent: GOLD },
      { key: 'social', label: '社会韧性上限', value: 77, accent: CYAN },
      { key: 'coord', label: '利益结构阻力', value: 83, accent: GREEN },
    ],
    phases: ['窗口研判', '范围划定', '熔断预置', '节奏拍板'],
    prompt: '改革需要突破既得利益结构，但经济下行期社会韧性有限。请从本角色视角推演：改革节奏、试点范围与风险熔断机制如何设定。',
  },
];

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
      {/* 抽象地平 / 行政楼廓线 */}
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
      {/* 示意经纬弧 — 非真实地图 */}
      <ellipse cx="620" cy="95" rx="140" ry="72" fill="none" stroke={accent} strokeOpacity="0.22" strokeWidth="1" strokeDasharray="4 5" />
      <ellipse cx="620" cy="95" rx="90" ry="46" fill="none" stroke={CYAN} strokeOpacity="0.18" strokeWidth="1" />
      <circle cx="620" cy="95" r="3.5" fill={accent} fillOpacity="0.7" />
    </svg>
  );
}

function Bubble({ role, content, streaming }) {
  const meta = ROLES.find((r) => r.id === role);
  const accent = meta?.accent || 'var(--text-tertiary)';
  return (
    <div className="mb-3" style={{ borderLeft: `3px solid ${accent}`, paddingLeft: 10 }}>
      <div className="text-[11px] mono mb-1" style={{ color: accent }}>{meta?.label || role}</div>
      <div className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
        <Markdown text={content || (streaming ? '…' : '')} />
      </div>
    </div>
  );
}

export default function LeadershipAiSim() {
  const [selectedRoles, setSelectedRoles] = useState(() => new Set(['psc', 'pb']));
  const [scenarioId, setScenarioId] = useState('fiscal');
  const [customPrompt, setCustomPrompt] = useState('');
  const [turns, setTurns] = useState([]);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);
  const [phaseIdx, setPhaseIdx] = useState(0);
  const [stakesReady, setStakesReady] = useState(false);
  const abortRef = useRef(null);
  const phaseTimer = useRef(null);

  const toggleRole = (id) => {
    setSelectedRoles((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        if (next.size > 1) next.delete(id);
      } else next.add(id);
      return next;
    });
  };

  const activeScenario = useMemo(
    () => SCENARIOS.find((s) => s.id === scenarioId) || SCENARIOS[0],
    [scenarioId],
  );
  const promptText = (customPrompt.trim() || activeScenario.prompt).trim();

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
      setPhaseIdx((i) => Math.min(i + 1, (activeScenario.phases?.length || 1) - 1));
    }, 2200);
    return () => {
      if (phaseTimer.current) clearInterval(phaseTimer.current);
    };
  }, [busy, activeScenario.phases]);

  const runSimulation = useCallback(async () => {
    if (busy) return;
    if (!isConfigured()) {
      setError('请先在右下角全局 AI 助手 · 设置中配置 API Key、模型与 baseURL（密钥仅存浏览器本地）。');
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
    const baseSystem = `你是 China OS 领袖统治模块的多角色治理推演助手。${SCOPE}。以下对话为思想实验，不对应任何现实决策。`;

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
          content: '（继续）下一位议事者请基于上文补充本视角的权衡与可执行选项，避免重复。',
        });
      }
      setPhaseIdx((activeScenario.phases?.length || 1) - 1);
    } catch (e) {
      if (e?.name !== 'AbortError') {
        setError(e?.message || '推演请求失败');
        setTurns((prev) => prev.filter((t) => t.role === 'user' || t.content));
      }
    } finally {
      setBusy(false);
      abortRef.current = null;
    }
  }, [busy, promptText, selectedRoles, activeScenario.phases]);

  const stop = () => abortRef.current?.abort();

  const inp = {
    background: 'var(--bg-base)', border: '1px solid var(--border-subtle)',
    color: 'var(--text-primary)', borderRadius: 6, padding: '6px 10px', fontSize: 13,
  };

  return (
    <Card title="AI 多角色治理推演 · 情景舞台" className="mt-6 lead-sim">
      <p className="text-xs mb-4" style={{ color: 'var(--text-tertiary)' }}>
        选择场域情景与议事席位，按序生成多视角推演。舞台要素（地点卡、议程相位、张力表）为学理示意，不对应任何现实会议。依赖全局 AI 配置（<span className="mono">c2os-ai-config</span>），密钥仅存浏览器本地。{SCOPE}
      </p>

      {/* 场域选择卡 */}
      <div className="text-[11px] mono mb-2" style={{ color: 'var(--text-tertiary)' }}>场域情景 · 地点卡</div>
      <div className="lead-sim-locations">
        {SCENARIOS.map((s) => {
          const on = scenarioId === s.id;
          return (
            <button
              key={s.id}
              type="button"
              className={`lead-sim-loc${on ? ' is-on' : ''}`}
              style={{ '--loc-accent': s.accent }}
              onClick={() => setScenarioId(s.id)}
            >
              <div className="lead-sim-loc__tag">{s.tag}</div>
              <div className="lead-sim-loc__title">{s.label}</div>
              <div className="lead-sim-loc__sub">{s.locale}</div>
            </button>
          );
        })}
      </div>

      {/* 场景舞台 */}
      <div className="lead-sim-stage mb-4">
        <SceneBackdrop accent={activeScenario.accent} />
        <div className="lead-sim-stage__grid" aria-hidden="true" />
        <div
          className="lead-sim-stage__glow"
          style={{ background: `radial-gradient(circle, ${activeScenario.accent}66, transparent 70%)` }}
          aria-hidden="true"
        />
        <div className="lead-sim-stage__body">
          <div className="lead-sim-stage__top">
            <div>
              <div className="lead-sim-stage__venue" style={{ color: activeScenario.accent }}>
                {activeScenario.venue}
                {busy && (
                  <span className="ml-2" style={{ color: RED }}>
                    <span className="lead-sim-live-dot" />推演中
                  </span>
                )}
              </div>
              <h4 className="lead-sim-stage__title">{activeScenario.label}</h4>
              <p className="lead-sim-stage__locale">{activeScenario.locale}</p>
            </div>
            <div className="lead-sim-timeline" role="list" aria-label="议事相位">
              {(activeScenario.phases || []).map((p, i) => {
                const active = i === phaseIdx;
                const done = i < phaseIdx;
                return (
                  <span
                    key={p}
                    role="listitem"
                    className={`lead-sim-phase${active ? ' is-active' : ''}${done ? ' is-done' : ''}`}
                    style={{ '--phase-accent': activeScenario.accent }}
                  >
                    {i + 1}. {p}
                  </span>
                );
              })}
            </div>
          </div>

          <div className="lead-sim-stakes" aria-label="张力表">
            {(activeScenario.stakes || []).map((st) => (
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
            张力表为思想实验标定（0–100）· 随场域切换刷新 · 非官方指数
          </p>
        </div>
      </div>

      {/* 议事席位看板 */}
      <div className="text-[11px] mono mb-2" style={{ color: 'var(--text-tertiary)' }}>议事席位 · 决策看板（可多选）</div>
      <div className="lead-sim-board">
        {ROLES.map((r) => {
          const on = selectedRoles.has(r.id);
          return (
            <button
              key={r.id}
              type="button"
              className={`lead-sim-seat${on ? ' is-on' : ''}`}
              style={{ '--seat-accent': r.accent }}
              onClick={() => toggleRole(r.id)}
            >
              <div className="lead-sim-seat__label" style={{ color: on ? r.accent : 'var(--text-primary)' }}>{r.label}</div>
              <div className="lead-sim-seat__hint">{r.hint}</div>
            </button>
          );
        })}
      </div>

      <div className="mb-4">
        <div className="text-[11px] mono mb-2" style={{ color: 'var(--text-tertiary)' }}>情景输入 · 可覆盖模板</div>
        <textarea
          value={customPrompt}
          onChange={(e) => setCustomPrompt(e.target.value)}
          placeholder={activeScenario.prompt}
          rows={3}
          style={{ ...inp, width: '100%', resize: 'vertical', lineHeight: 1.5 }}
        />
      </div>

      <div className="flex items-center gap-2 flex-wrap mb-4">
        <button type="button" onClick={runSimulation} disabled={busy}
          className="text-xs mono px-3 py-1.5 rounded font-semibold flex items-center gap-1.5"
          style={{ background: 'rgba(196,30,58,0.14)', color: RED, border: '1px solid rgba(196,30,58,0.45)', cursor: busy ? 'wait' : 'pointer', opacity: busy ? 0.7 : 1 }}>
          <Lucide.Sparkles size={14} />{busy ? '推演中…' : '启动多角色推演'}
        </button>
        {busy && (
          <button type="button" onClick={stop} className="text-xs mono px-3 py-1.5 rounded"
            style={{ ...inp, cursor: 'pointer' }}>停止</button>
        )}
        <button type="button" onClick={() => { setTurns([]); setError(null); setPhaseIdx(0); }} disabled={busy}
          className="text-xs mono px-3 py-1.5 rounded"
          style={{ ...inp, cursor: 'pointer', color: 'var(--text-tertiary)' }}>
          清空
        </button>
        {!isConfigured() && (
          <span className="text-[11px] mono" style={{ color: GOLD }}>未配置 API · 请打开右下角 AI 助手设置</span>
        )}
      </div>

      {error && (
        <p className="text-xs mono mb-3" style={{ color: RED }}>// {error}</p>
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
        {SCOPE} · 场域舞台与多角色输出均为思想实验，不构成对任何机构或人物的评价
      </p>
    </Card>
  );
}
