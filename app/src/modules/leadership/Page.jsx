import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { PageHeader, Card, Grid, Stat, StatGrid } from '../../app/ui.jsx';
import EChart from '../../lib/viz/EChart.jsx';
import { IntroCard, SelectorBar, FrameworkTrio, ModuleFooter } from '../shared/ModuleParadigm.jsx';
import { EraTimeline } from './EraTimeline.jsx';
import { useFigures } from '../../lib/db/useDataset.js';
import {
  LEAD_AS_OF, LEAD_DISCLAIMER, ERA_TIMELINE, TERM_SYSTEM, GOV_MODEL, BRAIN_TRUST, AGENDA, TRADEOFFS,
  SECTION_TABS, ERA_WINDOWS, INSTITUTION_TOOLS, MEETING_TYPES, LEADERSHIP_FRAMEWORK,
  buildPowerPyramid, buildDecisionSankey, buildGenerationTimeline, buildRegionalBar,
  buildMeetingRadar, buildTurnoverHeatmap, buildAuthorityTrend, buildInstitutionSunburst,
  buildGovGraph, buildMeetingFrequency, buildToolIntensity, buildAgendaDonut, buildTermTimeline,
} from './data.js';
import { SIM_NOTE, TOPIC_PARAMS, simAttention, INTL_TERM_COMPARE, INTL_NOTE, buildLeadReport } from './leadershipSim.js';
import LeadershipAiSim from './LeadershipAiSim.jsx';

// ─────────────────────────────────────────────────────────────────────────────
// 领袖统治 · 权力结构 / 决策机制 / 人事布局 / 历史演进
// 口径：公开信息梳理 · 学理分析框架 · 非评价 · 非预测 · 非倡导
// ─────────────────────────────────────────────────────────────────────────────

const CYAN = '#22d3ee';
const GOLD = '#e8a317';
const RED = '#c41e3a';
const GREEN = '#10b981';
const SLATE = '#64748b';

const SCOPE_NOTE = LEAD_DISCLAIMER;

const ERA_HIGHLIGHT = {
  all: [2012, 2026],
  consolidation: [2012, 2017],
  institutional: [2018, 2021],
  renewal: [2022, 2026],
};

function ScopeTag({ extra }) {
  return (
    <p className="text-[11px] mono mt-4 pt-3 border-t" style={{ color: 'var(--text-tertiary)', borderColor: 'var(--border-subtle)' }}>
      {SCOPE_NOTE}{extra ? ` · ${extra}` : ''}
    </p>
  );
}

function pillStyle(c) {
  return {
    display: 'inline-block', fontSize: 11, fontFamily: 'monospace',
    padding: '2px 8px', borderRadius: 20, border: `1px solid ${c}55`,
    background: `${c}14`, color: c, whiteSpace: 'nowrap',
  };
}

function ChartCard({ title, hint, height = 320, children, extra }) {
  return (
    <div className="os-card" style={{ padding: 'var(--card-padding)', background: 'var(--bg-surface)' }}>
      <div className="mb-3">
        <div className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>{title}</div>
        {hint && <p className="text-[11px] mt-1 leading-relaxed" style={{ color: 'var(--text-tertiary)' }}>{hint}</p>}
      </div>
      {children}
      {extra && <ScopeTag extra={extra} />}
    </div>
  );
}

function termItemParts(item) {
  if (typeof item === 'string') return { head: null, body: item };
  return { head: item.title || item.t || item.label || null, body: item.desc || item.d || item.body || item.text || '' };
}

function TermCard({ title, tag, accent, items }) {
  return (
    <div className="os-card" style={{ padding: 'var(--card-padding)', borderTop: `3px solid ${accent}`, background: 'var(--bg-surface)' }}>
      <div className="flex flex-col gap-1 mb-3">
        <span className="text-sm font-semibold" style={{ color: accent }}>{title}</span>
        <span className="text-[11px] mono" style={{ color: 'var(--text-tertiary)' }}>{tag}</span>
      </div>
      <ul className="flex flex-col gap-2.5">
        {(items || []).map((it, i) => {
          const { head, body } = termItemParts(it);
          return (
            <li key={i} className="text-xs leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
              <span className="mono mr-1.5" style={{ color: accent }}>▸</span>
              {head && <span className="font-semibold mr-1" style={{ color: 'var(--text-primary)' }}>{head}</span>}
              {body}
            </li>
          );
        })}
      </ul>
    </div>
  );
}

const PSC_ORDER = ['习近平', '李强', '赵乐际', '王沪宁', '蔡奇', '丁薛祥', '李希'];

function PscGrid({ figures }) {
  const psc = useMemo(() => {
    if (!figures) return null;
    const hit = figures.filter((f) => f.level === '党和国家领导人' && (f.fields?.rank || '').includes('常委'));
    return [...hit].sort((a, b) => {
      const ia = PSC_ORDER.indexOf(a.name);
      const ib = PSC_ORDER.indexOf(b.name);
      return (ia === -1 ? 99 : ia) - (ib === -1 ? 99 : ib);
    });
  }, [figures]);

  if (psc === null) return <p className="text-xs mono py-3" style={{ color: 'var(--text-tertiary)' }}>// 简历库加载中…</p>;
  if (psc.length === 0) {
    return (
      <div className="rounded-md p-4 text-xs" style={{ background: 'var(--bg-elevated)', border: '1px dashed var(--border-subtle)', color: 'var(--text-tertiary)' }}>
        简历库暂无记录 —— 请先到<Link to="/foundation" className="os-link mono mx-1">数据底座</Link>载入政要种子库。
      </div>
    );
  }
  return (
    <div className="grid gap-3" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(190px, 1fr))' }}>
      {psc.map((f) => (
        <div key={f.name} className="rounded-md p-3" style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-subtle)' }}>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>{f.name}</span>
            <span style={pillStyle(RED)}>常委</span>
          </div>
          <p className="text-[11px] leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{f.fields?.title || f.role || '——'}</p>
        </div>
      ))}
    </div>
  );
}

function EraDetail({ stages, idx, onSelect }) {
  const st = stages[idx];
  if (!st) return null;
  const accent = st.accent || RED;
  const navBtn = (disabled) => ({
    fontSize: 11, fontFamily: 'monospace', padding: '3px 10px', borderRadius: 'var(--radius-sm)',
    border: '1px solid var(--border-subtle)', background: 'var(--bg-base)',
    color: disabled ? 'var(--text-tertiary)' : CYAN, cursor: disabled ? 'default' : 'pointer', opacity: disabled ? 0.5 : 1,
  });
  return (
    <div className="os-card lead-era-tl-detail" style={{ padding: 'var(--card-padding)', background: 'var(--bg-elevated)', borderLeft: `3px solid ${accent}` }}>
      <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
        <div className="flex items-center gap-2.5">
          <span className="mono text-sm font-semibold" style={{ color: accent }}>{st.period}</span>
          <span className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>{st.title}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="mono text-[11px]" style={{ color: 'var(--text-tertiary)' }}>节点 {idx + 1} / {stages.length}</span>
          <button type="button" disabled={idx === 0} onClick={() => onSelect(Math.max(0, idx - 1))} style={navBtn(idx === 0)}>← 前一节点</button>
          <button type="button" disabled={idx === stages.length - 1} onClick={() => onSelect(Math.min(stages.length - 1, idx + 1))} style={navBtn(idx === stages.length - 1)}>后一节点 →</button>
        </div>
      </div>
      <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{st.desc}</p>
    </div>
  );
}

function isMilOrStrait(a) {
  return /tai|strait|mil|defense|army/i.test(a.id || '') || /台|军|国防/.test(a.label || '');
}

function AgendaDetail({ a }) {
  const color = a.color || RED;
  const rows = [
    { key: 'goal', tag: '公开目标口径', accent: GREEN, text: a.goal },
    { key: 'progress', tag: '进展观察', accent: CYAN, text: a.progress },
    { key: 'tension', tag: '张力点 · 学理框架', accent: GOLD, text: a.tension },
  ];
  return (
    <div className="os-card" style={{ padding: 'var(--card-padding)', background: 'var(--bg-elevated)', borderLeft: `3px solid ${color}` }}>
      <div className="flex items-center gap-2.5 mb-4">
        <span className="text-base font-semibold" style={{ color }}>{a.label}</span>
        <span style={pillStyle(color)}>{a.id}</span>
      </div>
      <div className="flex flex-col gap-4">
        {rows.map((r) => (
          <div key={r.key}>
            <span style={pillStyle(r.accent)}>{r.tag}</span>
            <p className="text-sm leading-relaxed mt-2" style={{ color: 'var(--text-secondary)' }}>{r.text}</p>
          </div>
        ))}
      </div>
      {(a.links || []).length > 0 && (
        <div className="mt-5">
          <div className="text-[11px] mono mb-2" style={{ color: 'var(--text-tertiary)' }}>横向直跳</div>
          <div className="grid gap-3" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))' }}>
            {a.links.map((l) => (
              <Link key={l.to} to={l.to} className="os-card-interactive block rounded-md p-3" style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)' }}>
                <span className="text-xs font-semibold" style={{ color: CYAN }}>{l.label} <span className="mono" style={{ color: 'var(--text-tertiary)' }}>↗</span></span>
              </Link>
            ))}
          </div>
        </div>
      )}
      <p className="text-[11px] mono mt-4 pt-3 border-t" style={{ color: 'var(--text-tertiary)', borderColor: 'var(--border-subtle)' }}>
        {isMilOrStrait(a) ? '仅公开政策表述 · 零作战内容 · 非预测非倡导' : '公开目标与进展梳理 · 张力为学理框架 · 非预测非倡导'}
      </p>
    </div>
  );
}

function ToolChips({ activeKey, onSelect }) {
  return (
    <div className="flex flex-wrap gap-2 mb-4">
      {INSTITUTION_TOOLS.map((t) => {
        const active = t.key === activeKey;
        return (
          <button
            key={t.key}
            type="button"
            onClick={() => onSelect(t.key)}
            className={`os-filter-chip mono ${active ? 'is-active' : ''}`}
            style={{ '--chip-accent': t.accent }}
          >{t.label}</button>
        );
      })}
    </div>
  );
}

function ToolLinks({ toolKey }) {
  const tool = INSTITUTION_TOOLS.find((t) => t.key === toolKey) || INSTITUTION_TOOLS[0];
  return (
    <div className="flex flex-wrap items-center gap-3 mt-3">
      <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>{tool.note}</span>
      <Link to={tool.route} className="os-link text-xs mono">跳转 {tool.label} ↗</Link>
    </div>
  );
}

// ── 分区渲染 ─────────────────────────────────────────────────────────────────

function PowerSection({ eraKey }) {
  const [from, to] = ERA_HIGHLIGHT[eraKey] || ERA_HIGHLIGHT.all;
  const pyramidOpt = useMemo(() => buildPowerPyramid(), []);
  const sunburstOpt = useMemo(() => buildInstitutionSunburst(), []);
  const regionalOpt = useMemo(() => buildRegionalBar(), []);
  const graphOpt = useMemo(() => buildGovGraph(), []);
  const timelineOpt = useMemo(() => buildGenerationTimeline(from, to), [from, to]);

  return (
    <div className="grid gap-6 mb-8" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 420px), 1fr))' }}>
      <ChartCard title="权力金字塔" hint="层级权重示意 · 决策权向顶端汇聚的结构性描述" extra="非人数统计">
        <EChart option={pyramidOpt} style={{ height: 340 }} />
      </ChartCard>
      <ChartCard title="机构权责 Sunburst" hint="党中央 / 国家机构 / 军队三极结构 · 公开建制梳理">
        <EChart option={sunburstOpt} style={{ height: 340 }} />
      </ChartCard>
      <ChartCard title="地域集群分布" hint="公开晋升通道的地域集群占比示意 · 非派系八卦">
        <EChart option={regionalOpt} style={{ height: 300 }} />
      </ChartCard>
      <ChartCard title="治理 OS 关系图" hint="六组件互联 · 可拖拽缩放 · OS 隐喻仅为认知压缩">
        <EChart option={graphOpt} style={{ height: 300 }} />
      </ChartCard>
      <ChartCard title="代际时间线" hint="公开代际框架节点 · 高亮当前观察窗口" extra="代际划分属公开史学框架">
        <EChart option={timelineOpt} style={{ height: 280 }} />
      </ChartCard>
    </div>
  );
}

function DecisionSection({ eraKey, toolKey, setToolKey, meetingKey, setMeetingKey }) {
  const sankeyOpt = useMemo(() => buildDecisionSankey(), []);
  const radarOpt = useMemo(() => buildMeetingRadar(eraKey, meetingKey), [eraKey, meetingKey]);
  const freqOpt = useMemo(() => buildMeetingFrequency(), []);
  const toolOpt = useMemo(() => buildToolIntensity(toolKey), [toolKey]);
  const agendaOpt = useMemo(() => buildAgendaDonut(), []);

  return (
    <>
      <Card title="制度工具箱 · 交叉模块">
        <p className="text-xs mb-3" style={{ color: 'var(--text-tertiary)' }}>点选工具查看示意强度曲线，并直跳关联模块。</p>
        <ToolChips activeKey={toolKey} onSelect={setToolKey} />
        <EChart option={toolOpt} style={{ height: 260 }} />
        <ToolLinks toolKey={toolKey} />
        <ScopeTag extra="强度指数为学理示意 · 非官方统计" />
      </Card>

      <div className="grid gap-6 mb-8 mt-6" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 420px), 1fr))' }}>
        <ChartCard title="决策流程 Sankey" hint="议题输入→调研→协调→拍板→发布→督查→反馈 · 可悬停高亮相邻节点">
          <EChart option={sankeyOpt} style={{ height: 360 }} />
        </ChartCard>
        <ChartCard title="会议机制雷达">
          <SelectorBar items={MEETING_TYPES} activeKey={meetingKey} onSelect={setMeetingKey} getKey={(i) => i.key} getLabel={(i) => i.label} getAccent={(i) => i.accent} />
          <EChart option={radarOpt} style={{ height: 300 }} />
        </ChartCard>
        <ChartCard title="会议频次堆叠" hint="常委会 / 国常务 / 全会 · 次/年示意">
          <EChart option={freqOpt} style={{ height: 300 }} />
        </ChartCard>
        <ChartCard title="议程权重分布" hint="六大治理课题相对权重示意">
          <EChart option={agendaOpt} style={{ height: 300 }} />
        </ChartCard>
      </div>
    </>
  );
}

function PersonnelSection({ figures }) {
  const heatOpt = useMemo(() => buildTurnoverHeatmap(), []);

  return (
    <>
      <div className="grid gap-6 mb-6" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 420px), 1fr))' }}>
        <ChartCard title="人事轮换矩阵" hint="岗位 × 年份轮换强度热力 · 0–10 示意" extra="非真实任免数据库">
          <EChart option={heatOpt} style={{ height: 320 }} />
        </ChartCard>
        <ChartCard title="智囊机构 · 公开建制">
          <div className="overflow-x-auto">
            <table className="w-full text-xs" style={{ borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ color: 'var(--text-tertiary)' }}>
                  {['机构', '职能定位', '现任主任', '备注'].map((h) => (
                    <th key={h} className="text-left mono font-normal py-2 pr-4 border-b" style={{ borderColor: 'var(--border-subtle)' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {BRAIN_TRUST.map((b) => (
                  <tr key={b.org} className="align-top">
                    <td className="py-2.5 pr-4 border-b font-semibold" style={{ borderColor: 'var(--border-subtle)', color: 'var(--text-primary)', whiteSpace: 'nowrap' }}>{b.org}</td>
                    <td className="py-2.5 pr-4 border-b" style={{ borderColor: 'var(--border-subtle)', color: 'var(--text-secondary)' }}>{b.role}</td>
                    <td className="py-2.5 pr-4 border-b mono" style={{ borderColor: 'var(--border-subtle)', color: b.head === '——' ? 'var(--text-tertiary)' : CYAN, whiteSpace: 'nowrap' }}>{b.head}</td>
                    <td className="py-2.5 border-b" style={{ borderColor: 'var(--border-subtle)', color: 'var(--text-tertiary)' }}>{b.note}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <ScopeTag extra="仅公开机构与公开职务" />
        </ChartCard>
      </div>

      <Card title="政治局常委 · 公开分工">
        <div className="flex items-center gap-2 mb-3">
          <span style={pillStyle(SLATE)}>简历库实时同源</span>
          <Link to="/talent" className="os-link text-xs mono">中国政要 ↗</Link>
        </div>
        <PscGrid figures={figures} />
        <ScopeTag />
      </Card>
    </>
  );
}

function HistorySection({ eraIdx, setEraIdx, agendaId, setAgendaId }) {
  const authOpt = useMemo(() => buildAuthorityTrend('all'), []);
  const termOpt = useMemo(() => buildTermTimeline(), []);
  const eraStages = useMemo(() => ERA_TIMELINE.map((e) => ({ period: String(e.year), title: e.title, desc: e.desc, accent: e.accent })), []);
  const activeAgenda = AGENDA.find((a) => a.id === agendaId) || AGENDA[0];

  return (
    <>
      <div className="grid gap-6 mb-6" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 420px), 1fr))' }}>
        <ChartCard title="权威指数趋势" hint="2012–2026 四维度示意 · 决策集中/执行穿透/制度刚性/纠错反馈" extra="指数为学理示意 · 非民调">
          <EChart option={authOpt} style={{ height: 320 }} />
        </ChartCard>
        <ChartCard title="任期制长周期" hint="1980–2026 对数刻度 · 2018 宪法修正案高亮">
          <EChart option={termOpt} style={{ height: 320 }} />
        </ChartCard>
      </div>

      <Card title="执政时间轴 · 公开节点">
        <EraTimeline
          stages={eraStages}
          activeIdx={eraIdx}
          onSelect={setEraIdx}
          renderDetail={(_, idx) => <EraDetail stages={eraStages} idx={idx} onSelect={setEraIdx} />}
        />
        <ScopeTag extra="节点事实均可于公报多源核验" />
      </Card>

      <Card title="任期制变更 · 1982→2018" className="mt-6">
        <div className="grid gap-4" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))' }}>
          <TermCard title="1982 · 任期制起源" tag="八二宪法 · 公开条文" accent={CYAN} items={TERM_SYSTEM.origin} />
          <TermCard title="2018 · 宪法修正案" tag="十三届全国人大 · 公开程序" accent={RED} items={TERM_SYSTEM.change2018} />
          <TermCard title="制度事实 · 现行框架" tag="描述性梳理" accent={GREEN} items={TERM_SYSTEM.institutional} />
          <TermCard title="制度张力 · 讨论框架" tag="学界公开讨论 · 中性" accent={GOLD} items={TERM_SYSTEM.debate} />
        </div>
        <ScopeTag />
      </Card>

      <Card title="治理课题作战盘" className="mt-6">
        <SelectorBar items={AGENDA} activeKey={agendaId} onSelect={setAgendaId} getKey={(i) => i.id} getLabel={(i) => i.label} getAccent={(i) => i.color} />
        {activeAgenda && <AgendaDetail a={activeAgenda} />}
        <ScopeTag />
      </Card>
    </>
  );
}

// ════════════════════════════════════════════════════════════════════════════
// 二次升级 · 追加区块（注意力配置器 / 任期国际比较 / 议程活回执 / 解构报告）
// 全部插在治理课题作战盘之后、张力分析 FrameworkTrio 之前；账本只读零写入；
// 模拟器层 import 自 leadershipSim.js（契约：simAttention / buildLeadReport 纯函数）。
// ════════════════════════════════════════════════════════════════════════════

const ATTN_NOTE = '议程设置理论的思想实验 · 抽象权衡演示 · 不对应任何现实决策推断';
// TOPIC_PARAMS 为 { [agendaId]: {difficulty,urgency,coupling,note} } 字典；
// 滑杆课题清单取 AGENDA ∩ TOPIC_PARAMS 键（label/color 沿用 AGENDA 既定配色）
const ATTN_TOPICS = AGENDA.filter((t) => TOPIC_PARAMS && typeof TOPIC_PARAMS === 'object' && TOPIC_PARAMS[t.id]);
const round1 = (v) => Math.round((Number(v) || 0) * 10) / 10;

// 初始注意力份额：n 课题近似均分（floor + 余数从头补齐，Σ 恰 = 100）
function initAttnAlloc() {
  const n = ATTN_TOPICS.length;
  if (!n) return {};
  const base = Math.floor(100 / n);
  const rem = 100 - base * n;
  return Object.fromEntries(ATTN_TOPICS.map((t, i) => [t.id, base + (i < rem ? 1 : 0)]));
}

// flags 徽章配色：单点过载→红 / 议程暴露→金 / 其余→灰
function flagColor(f) {
  const s = String(f || '');
  if (s.includes('过载')) return RED;
  if (s.includes('暴露')) return GOLD;
  return SLATE;
}

/** 双系列横向 bar：推进指数（绿）/ 张力残量（红），per 课题并排 */
function buildAttnBarOption(rows) {
  return {
    tooltip: {
      trigger: 'axis', axisPointer: { type: 'shadow' },
      backgroundColor: 'rgba(15,23,42,0.92)', borderColor: '#27324a', textStyle: { color: '#e2e8f0' },
    },
    legend: { data: ['推进指数', '张力残量'], top: 0, textStyle: { color: '#93a1b5', fontSize: 11 }, itemWidth: 12, itemHeight: 8 },
    grid: { left: 8, right: 18, top: 30, bottom: 4, containLabel: true },
    xAxis: {
      type: 'value',
      axisLine: { lineStyle: { color: '#27324a' } },
      axisLabel: { color: '#93a1b5', fontSize: 10 },
      splitLine: { lineStyle: { color: 'rgba(148,163,184,0.1)' } },
    },
    yAxis: {
      type: 'category', data: rows.map((r) => r.label), inverse: true,
      axisLine: { lineStyle: { color: '#27324a' } },
      axisLabel: { color: '#93a1b5', fontSize: 11 },
    },
    series: [
      { name: '推进指数', type: 'bar', barWidth: 9, itemStyle: { color: GREEN, borderRadius: [0, 3, 3, 0] }, data: rows.map((r) => round1(r.progress)) },
      { name: '张力残量', type: 'bar', barWidth: 9, itemStyle: { color: RED, borderRadius: [0, 3, 3, 0] }, data: rows.map((r) => round1(r.strain)) },
    ],
  };
}

/** ⚖ 注意力配置器：六杆 Σ=100 联动 + 双系列 bar + flags 徽章 + verdict + spill */
function AttentionLab({ alloc, setAllocAt, sim }) {
  const barOpt = useMemo(() => (sim?.rows?.length ? buildAttnBarOption(sim.rows) : null), [sim]);
  const total = ATTN_TOPICS.reduce((s, t) => s + (alloc[t.id] || 0), 0);
  return (
    <Card title="⚖ 注意力配置器 · 思想实验" className="mt-6">
      <p className="text-[11px] mono mb-1" style={{ color: GOLD }}>{SIM_NOTE || ATTN_NOTE}</p>
      <p className="text-xs mb-4" style={{ color: 'var(--text-tertiary)' }}>
        六课题滑杆联动约束 Σ=100：拉高一杆，其余按既有比例回缩——最高决策层最稀缺的资源是注意力，这正是议程设置理论的核心命题。
      </p>
      <div className="grid gap-6" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 380px), 1fr))' }}>
        <div>
          <div className="flex justify-between items-baseline text-xs mb-2">
            <span style={{ color: 'var(--text-secondary)' }}>注意力份额（%）</span>
            <span className="mono font-semibold" style={{ color: total === 100 ? GREEN : GOLD }}>Σ = {total} / 100</span>
          </div>
          {ATTN_TOPICS.map((t) => {
            const row = sim?.rows?.find((r) => r.id === t.id);
            return (
              <div key={t.id} className="mb-3">
                <div className="flex justify-between items-baseline gap-2 text-xs mb-1">
                  <span className="flex items-center gap-1.5 flex-wrap">
                    <span style={{ color: 'var(--text-secondary)' }}>{row?.label || t.label}</span>
                    {(row?.flags || []).map((f) => (
                      <span key={f} style={pillStyle(flagColor(f))}>{f}</span>
                    ))}
                  </span>
                  <span className="mono font-semibold" style={{ color: t.color || CYAN }}>{alloc[t.id] || 0}%</span>
                </div>
                <input
                  type="range" min={0} max={100} step={1} value={alloc[t.id] || 0}
                  onChange={(e) => setAllocAt(t.id, Number(e.target.value))}
                  className="w-full" style={{ accentColor: t.color || CYAN }}
                />
              </div>
            );
          })}
        </div>
        <div>
          {barOpt ? (
            <EChart option={barOpt} style={{ height: 300 }} />
          ) : (
            <p className="text-xs mono py-3" style={{ color: 'var(--text-tertiary)' }}>// 模拟器数据未就绪——契约缺失时本图自动降级，不影响其余区块。</p>
          )}
          {sim?.verdict && (
            <div className="flex flex-wrap items-center gap-3 mt-4 rounded-md p-3" style={{ background: `${sim.verdict.color}10`, border: `1px solid ${sim.verdict.color}55` }}>
              <span className="text-sm font-semibold mono px-3 py-1 rounded" style={{ background: `${sim.verdict.color}22`, color: sim.verdict.color, border: `1px solid ${sim.verdict.color}66` }}>
                {sim.verdict.label}
              </span>
              <span className="text-xs leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{sim.verdict.note}</span>
            </div>
          )}
          {sim?.spill != null && (
            <p className="text-xs leading-relaxed mt-2" style={{ color: 'var(--text-tertiary)' }}>
              <span className="mono mr-1" style={{ color: GOLD }}>溢出判读</span>{String(sim.spill)}
            </p>
          )}
        </div>
      </div>
      <ScopeTag extra={ATTN_NOTE} />
    </Card>
  );
}

/** 🌐 任期制度国际比较：六行教科书级宪制事实，中性并列无褒贬 */
function IntlTermTable() {
  const rows = Array.isArray(INTL_TERM_COMPARE) ? INTL_TERM_COMPARE : [];
  return (
    <Card title="🌐 任期制度国际比较 · 中性并列" className="mt-6">
      <p className="text-xs mb-3" style={{ color: 'var(--text-tertiary)' }}>
        承接上方任期制专题（历史演进分区 · 「任期制变更 1982→2018」四联卡）——六种宪制安排的教科书级制度事实并列呈现，无任何优劣排序。
      </p>
      {rows.length === 0 ? (
        <p className="text-xs mono py-3" style={{ color: 'var(--text-tertiary)' }}>// 比较数据未就绪。</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-xs" style={{ borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ color: 'var(--text-tertiary)' }}>
                {['国家', '政体类型', '任期规则', '制度事实'].map((h) => (
                  <th key={h} className="text-left mono font-normal py-2 pr-4 border-b" style={{ borderColor: 'var(--border-subtle)' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.country} className="align-top">
                  <td className="py-2.5 pr-4 border-b font-semibold" style={{ borderColor: 'var(--border-subtle)', color: 'var(--text-primary)', whiteSpace: 'nowrap' }}>{r.country}</td>
                  <td className="py-2.5 pr-4 border-b mono" style={{ borderColor: 'var(--border-subtle)', color: CYAN, whiteSpace: 'nowrap' }}>{r.system}</td>
                  <td className="py-2.5 pr-4 border-b" style={{ borderColor: 'var(--border-subtle)', color: 'var(--text-secondary)' }}>{r.rule}</td>
                  <td className="py-2.5 border-b" style={{ borderColor: 'var(--border-subtle)', color: 'var(--text-tertiary)' }}>{r.fact}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {INTL_NOTE ? <p className="text-[11px] mt-3 leading-relaxed" style={{ color: 'var(--text-tertiary)' }}>{INTL_NOTE}</p> : null}
      <ScopeTag extra="教科书级宪法制度事实 · 中性并列 · 无褒贬" />
    </Card>
  );
}

// ── 📡 议程活回执：三本跨模块账本只读（mount 读一次 + storage/cos-ledger-change 双监听）──
const RECEIPT_META = [
  { key: 'war', topicId: 'us-china', source: '博弈推演桌', route: '/wargame', routeLabel: '大国博弈推演桌' },
  { key: 'tech', topicId: 'tech-selfreliance', source: '攻关推演', route: '/techtree', routeLabel: '科技图谱' },
  { key: 'watch', topicId: 'risk-defuse', source: '监测台', route: '/watchtower', routeLabel: '风险监测台' },
];
const RECEIPT_EMPTY = '尚无推演回执——去对应沙盘跑一局';

function buildReceiptText(meta, r) {
  let text = RECEIPT_EMPTY;
  if (meta.key === 'war' && r) text = `最近一局：美方策略「${r.strategy}」→ 终局判定「${r.judge}」`;
  if (meta.key === 'tech' && r) text = `在档攻关方案 ${r.count} 个 · ${r.year ? `最早突破年 ${r.year}` : '推演期内尚无突破年'}`;
  if (meta.key === 'watch' && r) text = `监测告警：红 ${r.red} 条 · 橙 ${r.orange} 条（共 ${r.total} 条）`;
  return text;
}

/** 三账本只读 hook：坏档/缺档一律降级 null；useRef JSON 比对防循环 */
function useAgendaReceipts() {
  const [state, setState] = useState({ war: null, tech: null, watch: null });
  const sigRef = useRef('');
  useEffect(() => {
    const load = () => {
      let war = null;
      try {
        const arr = JSON.parse(localStorage.getItem('cos-wargame-runs') || 'null');
        if (Array.isArray(arr)) {
          const r = arr.find((x) => x && typeof x === 'object' && x.judge);
          if (r) war = { strategy: String(r.strategyLabel || r.strategy || '——'), judge: String(r.judge?.label || '——') };
        }
      } catch { war = null; }
      let tech = null;
      try {
        const obj = JSON.parse(localStorage.getItem('cos-tech-plans') || 'null');
        if (obj && typeof obj === 'object' && obj.plans && typeof obj.plans === 'object') {
          const plans = Object.values(obj.plans).filter((p) => p && typeof p === 'object');
          if (plans.length) {
            const years = plans.map((p) => Number(p.breakthrough)).filter((y) => Number.isFinite(y) && y > 0);
            tech = { count: plans.length, year: years.length ? Math.min(...years) : null };
          }
        }
      } catch { tech = null; }
      let watch = null;
      try {
        const obj = JSON.parse(localStorage.getItem('cos-watch-alerts') || 'null');
        if (obj && Array.isArray(obj.alerts)) {
          const red = obj.alerts.filter((a) => a && String(a.level || '').includes('红')).length;
          const orange = obj.alerts.filter((a) => a && String(a.level || '').includes('橙')).length;
          watch = { red, orange, total: obj.alerts.length };
        }
      } catch { watch = null; }
      const next = { war, tech, watch };
      const sig = JSON.stringify(next);
      if (sig !== sigRef.current) { sigRef.current = sig; setState(next); }
    };
    load();
    window.addEventListener('storage', load);
    window.addEventListener('cos-ledger-change', load);
    return () => {
      window.removeEventListener('storage', load);
      window.removeEventListener('cos-ledger-change', load);
    };
  }, []);
  return state;
}

function AgendaReceipts({ receipts, texts }) {
  return (
    <Card title="📡 议程活回执 · 全站推演动态" className="mt-6">
      <p className="text-xs mb-4" style={{ color: 'var(--text-tertiary)' }}>
        只读三本跨模块账本——博弈沙盘对局、科技图谱攻关方案、风险监测台告警——把全站推演动态挂回对应治理课题。本卡零写入。
      </p>
      <div className="grid gap-3" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 250px), 1fr))' }}>
        {RECEIPT_META.map((m, i) => {
          const topic = AGENDA.find((a) => a.id === m.topicId) || { label: m.topicId, color: SLATE };
          const has = !!receipts[m.key];
          return (
            <div key={m.key} className="rounded-md p-3 flex flex-col gap-2" style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-subtle)', borderLeft: `3px solid ${topic.color}` }}>
              <div className="flex items-center gap-2 flex-wrap">
                <span style={{ width: 8, height: 8, borderRadius: '50%', background: topic.color, display: 'inline-block', flexShrink: 0 }} />
                <span className="text-xs font-semibold" style={{ color: 'var(--text-primary)' }}>{topic.label}</span>
                <span style={pillStyle(topic.color)}>{m.source}</span>
              </div>
              <p className="text-xs leading-relaxed" style={{ color: has ? 'var(--text-secondary)' : 'var(--text-tertiary)' }}>{texts[i]}</p>
              <Link to={m.route} className="os-link text-xs mono mt-auto">{has ? `跳转 ${m.routeLabel} ↗` : `去 ${m.routeLabel} 跑一局 ↗`}</Link>
            </div>
          );
        })}
      </div>
      <ScopeTag extra="只读账本回执 · 跨模块联动 · 非评价非预测" />
    </Card>
  );
}

/** 📄 解构报告：buildLeadReport → pre + 复制（1.6s 惯例） */
function LeadReportCard({ eraLabel, agendaLabel, alloc, sim, receiptTexts }) {
  const [report, setReport] = useState('');
  const [copied, setCopied] = useState(false);
  const genReport = () => {
    try {
      // buildLeadReport 契约：receipts 为 {wargame,tech,alerts} 三回执文本对象
      setReport(String(buildLeadReport({
        eraLabel: eraLabel || '全周期',
        agendaTopic: agendaLabel,
        alloc,
        sim,
        receipts: { wargame: receiptTexts[0], tech: receiptTexts[1], alerts: receiptTexts[2] },
      }) || ''));
    } catch {
      setReport('// 报告生成失败：模拟器契约数据未就绪。');
    }
  };
  const copyReport = () => {
    navigator.clipboard?.writeText(report).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    });
  };
  return (
    <Card title="📄 解构报告 · 一键固化" className="mt-6">
      <p className="text-xs mb-3" style={{ color: 'var(--text-tertiary)' }}>
        把当前观察窗口（{eraLabel || '全周期'}）、作战盘课题（{agendaLabel}）、注意力配置与三张账本回执固化为一页 Markdown——参数即口径，复制即归档。
      </p>
      <div className="flex items-center gap-2 flex-wrap">
        <button
          type="button" onClick={genReport}
          className="text-xs mono px-3 py-1.5 rounded font-semibold"
          style={{ background: 'rgba(34,211,238,0.12)', color: CYAN, border: '1px solid rgba(34,211,238,0.45)', cursor: 'pointer' }}
        >生成解构报告</button>
        {report && (
          <button
            type="button" onClick={copyReport}
            className="text-xs mono px-3 py-1.5 rounded font-semibold"
            style={{ background: 'rgba(148,163,184,0.1)', color: copied ? GREEN : 'var(--text-secondary)', border: '1px solid var(--border-subtle)', cursor: 'pointer' }}
          >{copied ? '已复制 ✓' : '复制 Markdown'}</button>
        )}
      </div>
      {report && (
        <pre
          className="text-[11px] leading-relaxed p-4 rounded mt-3 mono overflow-auto"
          style={{ background: 'var(--bg-base)', border: '1px solid var(--border-subtle)', color: 'var(--text-secondary)', maxHeight: 420, whiteSpace: 'pre-wrap' }}
        >{report}</pre>
      )}
      <ScopeTag extra="报告内容=页面参数+账本回执 · 非评价非预测非倡导" />
    </Card>
  );
}

/** 追加区块编排：状态全部收敛在本组件内，主页面只挂一个入口 */
function UpgradeSections({ eraLabel, agendaLabel }) {
  const [alloc, setAlloc] = useState(initAttnAlloc);
  // Σ=100 联动约束：改一杆，其余按原比例回缩（逐项夹紧 + 末项兜底，Σ 恒 = 100）
  const setAllocAt = (id, val) => {
    setAlloc((prev) => {
      const ids = ATTN_TOPICS.map((t) => t.id);
      if (!ids.includes(id)) return prev;
      const v = Math.max(0, Math.min(100, Math.round(Number(val) || 0)));
      const others = ids.filter((k) => k !== id);
      const osum = others.reduce((s, k) => s + (prev[k] || 0), 0);
      const rest = 100 - v;
      const next = { ...prev, [id]: v };
      let acc = 0;
      others.forEach((k, i) => {
        let u;
        if (i === others.length - 1) u = rest - acc;
        else if (osum <= 0) u = Math.floor(rest / others.length);
        else u = Math.min(rest - acc, Math.round((rest * (prev[k] || 0)) / osum));
        u = Math.max(0, u);
        next[k] = u;
        acc += u;
      });
      return next;
    });
  };
  const sim = useMemo(() => {
    try { return typeof simAttention === 'function' ? simAttention(alloc) : null; } catch { return null; }
  }, [alloc]);
  const receipts = useAgendaReceipts();
  const receiptTexts = useMemo(() => RECEIPT_META.map((m) => buildReceiptText(m, receipts[m.key])), [receipts]);

  return (
    <>
      <div className="os-section mb-2 mt-8">
        <h3 className="os-card-title mb-1">专题扩展 · 思想实验 / 国际比较 / 全站回执 / 解构报告</h3>
        <p className="text-xs" style={{ color: 'var(--text-tertiary)' }}>四个追加区块全部沿用本模块既定口径：{SCOPE_NOTE}。</p>
      </div>
      <AttentionLab alloc={alloc} setAllocAt={setAllocAt} sim={sim} />
      <IntlTermTable />
      <AgendaReceipts receipts={receipts} texts={receiptTexts} />
      <LeadReportCard
        eraLabel={eraLabel} agendaLabel={agendaLabel} alloc={alloc} sim={sim}
        receiptTexts={receiptTexts}
      />
    </>
  );
}

// ── 主页面 ───────────────────────────────────────────────────────────────────

export default function Page() {
  const [section, setSection] = useState('power');
  const [eraKey, setEraKey] = useState('all');
  const [toolKey, setToolKey] = useState('inspection');
  const [meetingKey, setMeetingKey] = useState('psc');
  const [eraIdx, setEraIdx] = useState(ERA_TIMELINE.length ? ERA_TIMELINE.length - 1 : 0);
  const [agendaId, setAgendaId] = useState(AGENDA[0]?.id || '');
  const figures = useFigures();

  const activeEra = ERA_WINDOWS.find((e) => e.key === eraKey) || ERA_WINDOWS[0];
  const authTrendOpt = useMemo(() => buildAuthorityTrend(eraKey), [eraKey]);

  return (
    <div>
      <PageHeader
        badge="Sim · 领袖统治"
        title="领袖统治 · 权力结构与决策机制"
        subtitle="权力金字塔 · 决策 Sankey · 人事矩阵 · 权威趋势 · 四区交互分析"
      />

      <IntroCard>
        <span className="font-semibold" style={{ color: 'var(--text-primary)' }}>定位声明：</span>
        本模块以<span style={{ color: CYAN }}>公开信息梳理与学理分析框架</span>解构最高领导层的权力结构、决策机制与人事布局——
        事实层取自党代会公报、宪法修正案、公开职务任免；分析层呈现制度逻辑与学界公开讨论的张力，两面都讲。
        基准日 <span className="mono" style={{ color: GOLD }}>{LEAD_AS_OF}</span> ·
        <span style={{ color: GOLD }}> 非评价 · 非预测 · 非倡导</span>。
      </IntroCard>

      <StatGrid className="os-section mb-6">
        <Stat value={LEAD_AS_OF} label="基准日" accent={CYAN} />
        <Stat value="12" label="ECharts 可视化" accent={RED} />
        <Stat value={SECTION_TABS.length} label="分析分区" accent={GOLD} />
        <Stat value={INSTITUTION_TOOLS.length} label="制度工具箱" accent={GREEN} />
      </StatGrid>

      <FrameworkTrio cards={[LEADERSHIP_FRAMEWORK.salt, LEADERSHIP_FRAMEWORK.stone, LEADERSHIP_FRAMEWORK.path]} />

      <Card title="分析分区 · 观察窗口">
        <SelectorBar items={SECTION_TABS} activeKey={section} onSelect={setSection} getKey={(i) => i.key} getLabel={(i) => i.label} getAccent={(i) => i.accent} />
        <SelectorBar items={ERA_WINDOWS} activeKey={eraKey} onSelect={setEraKey} getKey={(i) => i.key} getLabel={(i) => `${i.label} (${i.range})`} getAccent={(i) => i.accent} />
        <p className="text-xs mb-4" style={{ color: 'var(--text-tertiary)' }}>
          当前窗口：<span className="mono" style={{ color: activeEra.accent }}>{activeEra.label} · {activeEra.range}</span>
          —— 影响会议雷达、权威趋势高亮等联动图表。
        </p>
        {(section === 'power' || section === 'decision') && (
          <ChartCard title="权威指数 · 窗口联动" hint={`高亮 ${activeEra.range}`}>
            <EChart option={authTrendOpt} style={{ height: 280 }} />
          </ChartCard>
        )}
      </Card>

      {section === 'power' && <PowerSection eraKey={eraKey} />}
      {section === 'decision' && (
        <DecisionSection eraKey={eraKey} toolKey={toolKey} setToolKey={setToolKey} meetingKey={meetingKey} setMeetingKey={setMeetingKey} />
      )}
      {section === 'personnel' && <PersonnelSection figures={figures} />}
      {section === 'history' && (
        <HistorySection eraIdx={eraIdx} setEraIdx={setEraIdx} agendaId={agendaId} setAgendaId={setAgendaId} />
      )}
      {section === 'aisim' && <LeadershipAiSim />}

      <UpgradeSections
        eraLabel={activeEra?.label || '全周期'}
        agendaLabel={(AGENDA.find((a) => a.id === agendaId) || AGENDA[0] || {}).label || '——'}
      />

      <div className="os-section mb-2 mt-8">
        <h3 className="os-card-title mb-1">张力分析 · 学界公开讨论的三组权衡</h3>
        <p className="text-xs mb-4" style={{ color: 'var(--text-tertiary)' }}>每组权衡两端都呈现公开理据——不构成对任何一端的背书或否定。</p>
      </div>
      <FrameworkTrio cards={TRADEOFFS} />
      <p className="text-[11px] mono -mt-4 mb-8" style={{ color: 'var(--text-tertiary)' }}>{SCOPE_NOTE}</p>

      <ModuleFooter
        moduleId="leadership"
        disclaimer={SCOPE_NOTE}
        sourceNote="事实口径：党代会公报/宪法修正案/政府公开发布；班子信息与人才库同源"
      />
    </div>
  );
}
