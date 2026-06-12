import React, { useCallback, useRef, useState } from 'react';
import * as Lucide from 'lucide-react';
import { Card } from '../../app/ui.jsx';
import { Markdown } from '../../lib/ai/markdown.jsx';
import { chat, isConfigured, loadConfig } from '../../lib/ai/client.js';

const CYAN = '#22d3ee';
const RED = '#c41e3a';
const GOLD = '#e8a317';
const SCOPE = '公开信息梳理 · 学理分析框架 · 思想实验 · 非评价 · 非预测 · 非倡导';

const ROLES = [
  {
    id: 'psc',
    label: '政治局常委会',
    accent: RED,
    persona: '你扮演「政治局常委会」集体决策视角的推演助手。以常委会议事逻辑作答：先政治安全与稳定，再经济与民生，再改革与对外。用语克制、书面中文，每条回应 120–220 字，列 2–3 个可观察选项或分歧点，不指名具体人物、不作现实预测。',
  },
  {
    id: 'pb',
    label: '中央政治局',
    accent: GOLD,
    persona: '你扮演「中央政治局」扩大议事视角的推演助手。侧重政策协调、部委博弈与地方执行张力。书面中文，120–220 字，呈现多方诉求如何被压缩为可执行决议，不评价优劣、不倡导路线。',
  },
  {
    id: 'govteam',
    label: '治理团队',
    accent: CYAN,
    persona: '你扮演国务院治理团队（总理领衔的行政执行层）视角的推演助手。聚焦执行算法、部委分工、财政与民生工具箱。书面中文，120–220 字，强调「决策—执行—反馈」链条与物理约束（财政、人口、产业），非预测非倡导。',
  },
];

const SCENARIOS = [
  { id: 'fiscal', label: '地方债务与财政倒挂', prompt: '地方隐性债务化解进入深水区，部分省份财政自给率持续下行，同时中央要求稳增长与保民生。请从本角色视角推演：优先工具、可接受代价、与中央口径如何对齐。' },
  { id: 'tech', label: '科技封锁与产业升级', prompt: '外部技术管制收紧，国内关键产业链存在断供风险，同时需要维持就业与市场预期。请从本角色视角推演：短期稳预期与中长期攻关如何分配注意力与政策资源。' },
  { id: 'demographic', label: '人口负增长与社保压力', prompt: '人口负增长与老龄化加速，社保基金中长期平衡承压，地方生育支持政策效果分化。请从本角色视角推演：可动用的政策杠杆与不可回避的结构约束。' },
  { id: 'reform', label: '改革窗口与风险防控', prompt: '改革需要突破既得利益结构，但经济下行期社会韧性有限。请从本角色视角推演：改革节奏、试点范围与风险熔断机制如何设定。' },
];

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
  const abortRef = useRef(null);

  const toggleRole = (id) => {
    setSelectedRoles((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        if (next.size > 1) next.delete(id);
      } else next.add(id);
      return next;
    });
  };

  const activeScenario = SCENARIOS.find((s) => s.id === scenarioId) || SCENARIOS[0];
  const promptText = (customPrompt.trim() || activeScenario.prompt).trim();

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
    } catch (e) {
      if (e?.name !== 'AbortError') {
        setError(e?.message || '推演请求失败');
        setTurns((prev) => prev.filter((t) => t.role === 'user' || t.content));
      }
    } finally {
      setBusy(false);
      abortRef.current = null;
    }
  }, [busy, promptText, selectedRoles]);

  const stop = () => abortRef.current?.abort();

  const inp = {
    background: 'var(--bg-base)', border: '1px solid var(--border-subtle)',
    color: 'var(--text-primary)', borderRadius: 6, padding: '6px 10px', fontSize: 13,
  };

  return (
    <Card title="AI 多角色治理推演" className="mt-6">
      <p className="text-xs mb-4" style={{ color: 'var(--text-tertiary)' }}>
        选择议事角色与情景，按序生成多视角对话推演。依赖全局 AI 配置（<span className="mono">c2os-ai-config</span>），密钥仅存浏览器本地。{SCOPE}
      </p>

      <div className="mb-4">
        <div className="text-[11px] mono mb-2" style={{ color: 'var(--text-tertiary)' }}>议事角色（可多选）</div>
        <div className="flex flex-wrap gap-2">
          {ROLES.map((r) => {
            const on = selectedRoles.has(r.id);
            return (
              <button key={r.id} type="button" onClick={() => toggleRole(r.id)}
                className="text-xs mono px-3 py-1.5 rounded font-semibold"
                style={{
                  background: on ? `${r.accent}22` : 'var(--bg-elevated)',
                  color: on ? r.accent : 'var(--text-secondary)',
                  border: `1px solid ${on ? `${r.accent}66` : 'var(--border-subtle)'}`,
                  cursor: 'pointer',
                }}>
                {r.label}
              </button>
            );
          })}
        </div>
      </div>

      <div className="mb-4">
        <div className="text-[11px] mono mb-2" style={{ color: 'var(--text-tertiary)' }}>情景模板</div>
        <div className="flex flex-wrap gap-2 mb-2">
          {SCENARIOS.map((s) => {
            const on = scenarioId === s.id;
            return (
              <button key={s.id} type="button" onClick={() => setScenarioId(s.id)}
                className="text-xs px-3 py-1 rounded"
                style={{
                  background: on ? 'rgba(34,211,238,0.14)' : 'var(--bg-elevated)',
                  color: on ? CYAN : 'var(--text-secondary)',
                  border: `1px solid ${on ? 'rgba(34,211,238,0.4)' : 'var(--border-subtle)'}`,
                  cursor: 'pointer',
                }}>
                {s.label}
              </button>
            );
          })}
        </div>
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
        <button type="button" onClick={() => { setTurns([]); setError(null); }} disabled={busy}
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
        <div className="rounded-md p-4" style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-subtle)', maxHeight: 480, overflowY: 'auto' }}>
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
        {SCOPE} · 多角色输出为模型生成之思想实验，不构成对任何机构或人物的评价
      </p>
    </Card>
  );
}
