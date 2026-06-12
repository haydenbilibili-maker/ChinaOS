import React, { useState, useMemo, useEffect, useRef } from 'react';
import { PageHeader, Card, Grid, Stat } from '../../app/ui.jsx';
import { IntroCard, SelectorBar, FrameworkTrio, ModuleFooter } from '../shared/ModuleParadigm.jsx';
import { OFFICIALS, HD_SCENARIOS, HD_DOMAIN_LABELS } from '../handong/handongData.js';
import {
  INSPECT_AS_OF, CLUE_SOURCES,
  buildClues, buildHandoverClues, talkPlan, evidenceChain, issueList, rectifyTrack, buildInspectReport,
} from './inspectData.js';

// ============================================================================
// 中央巡视沙盘 · 进驻虚构汉东省（Page.jsx）
// ----------------------------------------------------------------------------
// 工作流：① 线索研判台（三源 12 条，点选入篮）→ ② 谈话调度（Top8 优先级，
//         点击记笔录）→ ③ 证据链与问题清单（孤证不立，闭链定档）→
//         ④ 整改跟踪（0-4 轮双闸销号）→ ⑤ 巡视工作底稿（Markdown）。
// 声明：虚构省份巡视沙盘，致敬经典政治叙事；与任何真实巡视工作、
//       真实人物无关；不构成对任何机构流程的描述。
// ============================================================================

const BTN = {
  background: 'var(--bg-elevated)', border: '1px solid var(--border-subtle)',
  color: 'var(--text-secondary)', borderRadius: 6, padding: '4px 12px', fontSize: 12, cursor: 'pointer',
};
const BTN_CYAN = { ...BTN, background: 'rgba(34,211,238,0.12)', border: '1px solid rgba(34,211,238,0.35)', color: '#22d3ee', fontWeight: 600 };

const STANCE_COLOR = { 配合: '#10b981', 谨慎: '#e8a317', 回避: '#c41e3a' };
const SEV_COLOR = { 重大: '#c41e3a', 较大: '#e8a317', 一般: '#64748b' };
const STATUS_COLOR = { 未启动: '#64748b', 整改中: '#e8a317', 已销号: '#10b981' };

const sceneOf = (id) => HD_SCENARIOS.find((s) => s.id === id);
const sourceOf = (id) => CLUE_SOURCES.find((s) => s.id === id);

export default function Page({ embedded = false }) {
  // —— 线索台账（确定性生成，挂载期一次） ——
  const baseClues = useMemo(() => buildClues(), []);
  // —— 工作流状态 ——
  const [sourceKey, setSourceKey] = useState('all');   // 四源筛选
  const [selected, setSelected] = useState([]);        // 研判篮：线索 id
  const [talked, setTalked] = useState([]);            // 已谈话：官员 id
  const [rounds, setRounds] = useState(0);             // 整改轮次 0-4
  const [reportMd, setReportMd] = useState('');
  const [copied, setCopied] = useState(false);

  // —— 汉东账本（cos-hd-ledger）：mount 读一次 + storage / cos-ledger-change 双监听 ——
  const [hdFailures, setHdFailures] = useState([]);
  useEffect(() => {
    const readLedger = () => {
      try {
        const raw = localStorage.getItem('cos-hd-ledger');
        const data = raw ? JSON.parse(raw) : null;
        const fails = data && Array.isArray(data.failures) ? data.failures : [];
        setHdFailures((prev) => (JSON.stringify(prev) === JSON.stringify(fails) ? prev : fails));
      } catch {
        setHdFailures((prev) => (prev.length ? [] : prev));
      }
    };
    readLedger();
    window.addEventListener('storage', readLedger);
    window.addEventListener('cos-ledger-change', readLedger);
    return () => {
      window.removeEventListener('storage', readLedger);
      window.removeEventListener('cos-ledger-change', readLedger);
    };
  }, []);

  // —— 全量线索池：三源 12 条 + 沙盘移送 ≤4 条（id 段独立，天然不冲突） ——
  const handoverClues = useMemo(() => {
    try { return buildHandoverClues(hdFailures); } catch { return []; }
  }, [hdFailures]);
  const clues = useMemo(() => [...baseClues, ...handoverClues], [baseClues, handoverClues]);

  // —— 计算链：线索 → 谈话 → 证据链 → 问题 → 整改 ——
  const visibleClues = useMemo(
    () => (sourceKey === 'all' ? clues : clues.filter((c) => c.source === sourceKey)),
    [clues, sourceKey]
  );
  const plan = useMemo(() => talkPlan(OFFICIALS, clues, selected), [clues, selected]);
  const chain = useMemo(() => evidenceChain(selected, clues, talked, plan), [selected, clues, talked, plan]);
  const issues = useMemo(() => issueList(selected, clues, chain.formedSceneIds), [selected, clues, chain]);
  const track = useMemo(() => rectifyTrack(issues, rounds), [issues, rounds]);
  const talkedInPlan = useMemo(
    () => plan.filter((p) => talked.includes(p.officialId)).length,
    [plan, talked]
  );

  // —— 回写跨模块账本（cos-inspect-issues）：问题清单 + 整改轮次 → 汉东沙盘 ——
  // 只在载荷 JSON 与上次写入不同才写（useRef 缓存），避免写入循环；
  // stamp 用上次值 +1（首次 1），不取随机数、不取当前时间。
  const lastIssuesSig = useRef('');
  useEffect(() => {
    const payload = {
      issues: issues.map((it) => ({ sceneId: it.sceneId, label: it.label, severity: it.severity })),
      rounds: Math.max(0, Math.min(4, Math.round(rounds || 0))),
    };
    const sig = JSON.stringify(payload);
    if (sig === lastIssuesSig.current) return;
    lastIssuesSig.current = sig;
    try {
      let prevStamp = 0;
      try {
        const raw = localStorage.getItem('cos-inspect-issues');
        const prev = raw ? JSON.parse(raw) : null;
        if (prev && Number.isFinite(prev.stamp)) prevStamp = Math.round(prev.stamp);
      } catch { prevStamp = 0; }
      localStorage.setItem('cos-inspect-issues', JSON.stringify({ ...payload, stamp: prevStamp + 1 }));
      window.dispatchEvent(new CustomEvent('cos-ledger-change'));
    } catch { /* 存储不可用时静默降级 */ }
  }, [issues, rounds]);

  const toggleClue = (id) => {
    setSelected((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  };
  const toggleTalk = (id) => {
    setTalked((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  };

  const genReport = () => {
    try {
      setReportMd(buildInspectReport({
        clues, selectedClueIds: selected, plan, talkedIds: talked,
        chain, issues, track, rounds,
      }));
    } catch (e) {
      setReportMd(`# 底稿生成异常\n\n${String(e)}`);
    }
    setCopied(false);
  };
  const copyReport = () => {
    navigator.clipboard?.writeText(reportMd).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    });
  };

  const activeSource = sourceKey === 'all' ? null : sourceOf(sourceKey);

  return (
    <div>
      {!embedded && (
      <PageHeader
        badge="Simulation · 中央巡视沙盘（虚构）"
        title="中央巡视沙盘 · 进驻汉东"
        subtitle="三源线索入篮 → 谈话优先级调度 → 证据链闭合定档 → 整改双闸销号 → 一份可复盘的巡视工作底稿"
      />
      )}
      <IntroCard>
        <strong style={{ color: 'var(--text-primary)' }}>虚构声明：</strong>
        本页为虚构省份巡视沙盘，致敬经典政治叙事；汉东省与全部官员均为原创虚构，
        与任何真实巡视工作、真实人物无关；不构成对任何机构流程的描述。
        沙盘把巡视压缩成一条可推演的证据流水线：信访、审计、舆情三源各给一种信噪比，
        线索入篮后排出谈话优先级——关联度决定先谈谁，姿态暴露利害关系；
        孤证不立，同案线索成对且笔录到位，证据链才闭合、问题才定档；
        而定档只是开始——重大问题两轮才启动整改、四轮才销号，
        制度修复的速度永远慢于破坏的速度，这个时间差就是整改跟踪要盯住的东西。
        全部逻辑为确定性纯函数，同样的操作永远复现同样的底稿。
      </IntroCard>
      <Grid cols={4} className="mb-8">
        <Stat value={INSPECT_AS_OF} label="进驻基准日" accent="#22d3ee" />
        <Stat value={`${clues.length} 条`} label="线索台账（三源 + 沙盘移送）" accent="#c41e3a" />
        <Stat value={`${OFFICIALS.length} 名`} label="虚构官员库（谈话对象池）" accent="#e8a317" />
        <Stat value="4 轮" label="整改销号周期" accent="#10b981" />
      </Grid>

      {/* 1 —— 线索研判台 */}
      <Card title={`① 线索研判台 · 三源 12 条 + 沙盘移送 ${handoverClues.length} 条 —— 已入研判篮 ${selected.length}/${clues.length}`}>
        {handoverClues.length === 0 && (
          <p className="text-[11px] mono mb-3" style={{ color: 'var(--text-tertiary)' }}>
            // 汉东沙盘暂无移送线索——沙盘里治理失分的回合会自动移送到这里。
          </p>
        )}
        <SelectorBar
          items={[
            { key: 'all', label: '全部线索', accent: '#64748b' },
            ...CLUE_SOURCES.map((s) => ({ key: s.id, label: s.label, accent: s.color })),
          ]}
          activeKey={sourceKey}
          onSelect={setSourceKey}
        />
        <p className="text-xs leading-relaxed mb-4" style={{ color: 'var(--text-secondary)' }}>
          {activeSource
            ? activeSource.desc
            : '线索不是证据，是证据的概率云——点选入篮即纳入研判；可信度由台账哈希定值，孤证永远不立。'}
        </p>
        <div className="grid gap-3" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))' }}>
          {visibleClues.map((c) => {
            const on = selected.includes(c.id);
            const src = sourceOf(c.source);
            const scene = sceneOf(c.sceneId);
            return (
              <button
                key={c.id}
                type="button"
                onClick={() => toggleClue(c.id)}
                className="text-left rounded p-3"
                style={{
                  background: on ? `${src.color}14` : 'var(--bg-elevated)',
                  border: on ? `1px solid ${src.color}88` : '1px solid var(--border-subtle)',
                  borderTop: on ? `3px solid ${src.color}` : '3px solid var(--border-subtle)',
                  cursor: 'pointer',
                }}
              >
                <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                  <span
                    className="text-[10px] mono px-1.5 py-0.5 rounded shrink-0"
                    style={{ background: `${src.color}1f`, color: src.color }}
                  >{src.label}</span>
                  <span className="text-[10px] mono flex items-center gap-1" style={{ color: 'var(--text-tertiary)' }}>
                    <span
                      className="inline-block rounded-full shrink-0"
                      style={{ width: 7, height: 7, background: scene?.color || '#64748b' }}
                    />
                    {scene?.label || c.sceneId}
                  </span>
                  {on && <span className="mono text-xs ml-auto shrink-0" style={{ color: src.color }}>✓ 在篮</span>}
                </div>
                <p className="text-[11px] leading-relaxed mb-2" style={{ color: on ? 'var(--text-primary)' : 'var(--text-secondary)' }}>
                  {c.label}
                </p>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] mono shrink-0" style={{ color: 'var(--text-tertiary)' }}>可信度</span>
                  <div className="h-1.5 rounded overflow-hidden flex-1" style={{ background: 'var(--bg-base)' }}>
                    <div style={{ width: `${c.cred}%`, height: '100%', background: src.color, transition: 'width .3s' }} />
                  </div>
                  <span className="text-[10px] mono shrink-0 font-semibold" style={{ color: src.color }}>{c.cred}</span>
                </div>
                <div className="text-[10px] mono mt-1.5" style={{ color: 'var(--text-tertiary)' }}>
                  指向域 · {HD_DOMAIN_LABELS[c.domain]}
                </div>
              </button>
            );
          })}
        </div>
      </Card>

      {/* 2 —— 谈话调度 */}
      <Card title={`② 谈话调度 · 优先级 Top8 —— 已谈 ${talkedInPlan}/${plan.length}`}>
        <p className="text-xs leading-relaxed mb-3" style={{ color: 'var(--text-secondary)' }}>
          按研判篮内线索的指向域，对全部虚构官员加权排序——关联度越高的人离问题越近；
          姿态是利害关系的投影：<span style={{ color: STANCE_COLOR['配合'] }}>配合</span> /
          <span style={{ color: STANCE_COLOR['谨慎'] }}> 谨慎</span> /
          <span style={{ color: STANCE_COLOR['回避'] }}> 回避</span>。点击一行记入谈话笔录。
          {selected.length === 0 && ' 当前研判篮为空——按全量台账摸排，进驻初期的全面谈话。'}
        </p>
        <div className="space-y-1.5">
          {plan.map((p, idx) => {
            const on = talked.includes(p.officialId);
            return (
              <button
                key={p.officialId}
                type="button"
                onClick={() => toggleTalk(p.officialId)}
                className="w-full flex items-center gap-3 text-xs py-2 px-3 rounded flex-wrap"
                style={{
                  background: on ? 'rgba(34,211,238,0.08)' : 'var(--bg-elevated)',
                  border: on ? '1px solid rgba(34,211,238,0.4)' : '1px solid var(--border-subtle)',
                  cursor: 'pointer', textAlign: 'left',
                }}
              >
                <span className="mono shrink-0" style={{ color: 'var(--text-tertiary)', width: 22 }}>#{idx + 1}</span>
                <span className="font-semibold shrink-0" style={{ color: 'var(--text-primary)', width: 56 }}>{p.name}</span>
                <span className="text-[11px] mono shrink-0" style={{ color: 'var(--text-tertiary)', width: 64 }}>{p.archetype}</span>
                <div className="flex items-center gap-2 flex-1" style={{ minWidth: 140 }}>
                  <div className="h-2 rounded overflow-hidden flex-1" style={{ background: 'var(--bg-base)' }}>
                    <div style={{ width: `${p.relevance}%`, height: '100%', background: p.color || '#22d3ee', transition: 'width .3s' }} />
                  </div>
                  <span className="mono shrink-0 font-semibold" style={{ color: p.color || '#22d3ee', width: 56 }}>
                    关联 {p.relevance}
                  </span>
                </div>
                <span
                  className="text-[10px] mono px-2 py-0.5 rounded shrink-0 text-center"
                  style={{ background: `${STANCE_COLOR[p.stance]}1f`, color: STANCE_COLOR[p.stance], width: 44 }}
                >{p.stance}</span>
                <span className="mono shrink-0 text-right" style={{ color: on ? '#22d3ee' : 'var(--text-tertiary)', width: 64 }}>
                  {on ? '✓ 已谈话' : '未谈话'}
                </span>
              </button>
            );
          })}
        </div>
        <p className="text-[11px] mt-3" style={{ color: 'var(--text-tertiary)' }}>
          谈话不是程序性走场：同案线索成对之后，一份相关官员的笔录就是把证据链钉死的最后一颗钉子。
        </p>
      </Card>

      {/* 3 —— 证据链与问题清单 */}
      <Card title="③ 证据链与问题清单 · 孤证不立，闭链定档">
        <div className="grid gap-6" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))' }}>
          <div>
            <div className="text-xs mb-1" style={{ color: 'var(--text-secondary)' }}>证据链整体进度（在研案链均值）</div>
            <div
              className="mono font-bold"
              style={{ fontSize: 44, lineHeight: 1.1, color: chain.progress >= 100 ? '#10b981' : chain.progress >= 60 ? '#e8a317' : '#c41e3a' }}
            >
              {chain.progress}
              <span className="text-sm font-normal ml-1" style={{ color: 'var(--text-tertiary)' }}>/100</span>
            </div>
            {selected.length === 0 && (
              <p className="text-xs mono mt-2" style={{ color: 'var(--text-tertiary)' }}>
                // 研判篮为空——线索入篮后，这里开始走表。
              </p>
            )}
            {chain.formed.length > 0 && (
              <div className="mt-3 space-y-1.5">
                {chain.formed.map((t) => (
                  <p key={t} className="text-[11px] leading-relaxed p-2 rounded" style={{ color: '#10b981', background: 'rgba(16,185,129,0.08)' }}>
                    ✓ {t}
                  </p>
                ))}
              </div>
            )}
            {chain.missing.length > 0 && (
              <div className="mt-3 space-y-1.5">
                {chain.missing.map((t) => (
                  <p key={t} className="text-[11px] leading-relaxed p-2 rounded" style={{ color: '#e8a317', background: 'rgba(232,163,23,0.08)' }}>
                    ⚠ {t}
                  </p>
                ))}
              </div>
            )}
          </div>
          <div>
            <div className="text-xs mb-2" style={{ color: 'var(--text-secondary)' }}>
              问题清单（仅对已闭合证据链定档 · 可信度均值 ≥75 重大 / ≥55 较大 / 其余一般）
            </div>
            {issues.length === 0 ? (
              <p className="text-xs mono" style={{ color: 'var(--text-tertiary)' }}>
                // 证据链尚未闭合，暂不形成问题清单——孤证不立是底稿的纪律。
              </p>
            ) : (
              <div className="space-y-1.5">
                {issues.map((it) => (
                  <div key={it.sceneId} className="flex items-start gap-2.5 text-xs py-2 px-3 rounded flex-wrap" style={{ background: 'var(--bg-elevated)' }}>
                    <span
                      className="text-[10px] mono px-2 py-0.5 rounded shrink-0 text-center"
                      style={{ background: `${SEV_COLOR[it.severity]}1f`, color: SEV_COLOR[it.severity], width: 40 }}
                    >{it.severity}</span>
                    <div className="flex-1" style={{ minWidth: 200 }}>
                      <div style={{ color: 'var(--text-primary)' }}>{it.label}</div>
                      <div className="text-[10px] mono mt-0.5" style={{ color: 'var(--text-tertiary)' }}>
                        可信度均值 {it.cred} · {it.advice}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </Card>

      {/* 4 —— 整改跟踪 */}
      <Card title="④ 整改跟踪 · 双闸销号（重大 2 起步 4 销号 / 较大 1-3 / 一般 1-2）">
        <div className="mb-4" style={{ maxWidth: 420 }}>
          <div className="flex justify-between items-baseline text-xs mb-1">
            <span style={{ color: 'var(--text-secondary)' }}>整改轮次（巡视反馈后的回头看节奏）</span>
            <span className="mono font-semibold" style={{ color: '#e8a317' }}>第 {rounds}/4 轮</span>
          </div>
          <input
            type="range" min={0} max={4} step={1} value={rounds}
            onChange={(e) => setRounds(Number(e.target.value))}
            style={{ width: '100%', accentColor: '#e8a317' }}
          />
        </div>
        {track.length === 0 ? (
          <p className="text-xs mono" style={{ color: 'var(--text-tertiary)' }}>
            // 问题清单为空，整改不开账——先把证据链闭合，再谈销号。
          </p>
        ) : (
          <div className="space-y-1.5">
            {track.map((t) => (
              <div key={t.label} className="flex items-center gap-3 text-xs py-2 px-3 rounded flex-wrap" style={{ background: 'var(--bg-elevated)' }}>
                <span
                  className="text-[10px] mono px-2 py-0.5 rounded shrink-0 text-center"
                  style={{ background: `${SEV_COLOR[t.severity]}1f`, color: SEV_COLOR[t.severity], width: 40 }}
                >{t.severity}</span>
                <span className="flex-1" style={{ color: 'var(--text-secondary)', minWidth: 200 }}>{t.label}</span>
                <div className="h-2 rounded overflow-hidden shrink-0" style={{ background: 'var(--bg-base)', width: 120 }}>
                  <div style={{ width: `${t.pct}%`, height: '100%', background: STATUS_COLOR[t.status], transition: 'width .3s' }} />
                </div>
                <span className="mono shrink-0 text-right" style={{ color: STATUS_COLOR[t.status], width: 32 }}>{t.pct}%</span>
                <span
                  className="text-[10px] mono px-2 py-0.5 rounded shrink-0 text-center"
                  style={{ background: `${STATUS_COLOR[t.status]}1f`, color: STATUS_COLOR[t.status], width: 52 }}
                >{t.status}</span>
              </div>
            ))}
          </div>
        )}
        <p className="text-[11px] mt-3" style={{ color: 'var(--text-tertiary)' }}>
          定档那一刻只是开始：问题越重，启动越迟、销号越慢——整改跟踪追的是制度修复速度与破坏速度之间的时间差。
        </p>
        <p className="text-[11px] mt-1.5" style={{ color: 'var(--text-tertiary)' }}>
          整改进度会同步回汉东沙盘：重大问题未销号期间拖累其财政恢复。
        </p>
      </Card>

      {/* 5 —— 巡视报告 */}
      <Card title="⑤ 巡视工作底稿 · 进驻概况到整改销号的全链路存档">
        <div className="flex items-center gap-2 flex-wrap">
          <button type="button" style={BTN_CYAN} onClick={genReport}>📄 生成巡视底稿</button>
          {reportMd && (
            <button type="button" style={copied ? { ...BTN, color: '#10b981' } : BTN} onClick={copyReport}>
              {copied ? '已复制 ✓' : '复制 Markdown'}
            </button>
          )}
          <span className="text-[11px]" style={{ color: 'var(--text-tertiary)' }}>
            当前状态：在篮 {selected.length} 条 · 已谈 {talkedInPlan} 人 · 闭链 {chain.formed.length} 条 · 问题 {issues.length} 项 · 第 {rounds}/4 轮
          </span>
        </div>
        {reportMd && (
          <pre
            className="text-[11px] leading-relaxed p-4 rounded mt-3 mono overflow-auto"
            style={{
              background: 'var(--bg-base)', border: '1px solid var(--border-subtle)',
              color: 'var(--text-secondary)', maxHeight: 420, whiteSpace: 'pre-wrap',
            }}
          >{reportMd}</pre>
        )}
      </Card>

      {/* 6 —— 框架三卡 + 页脚 */}
      <FrameworkTrio cards={[
        {
          title: '线索的物理', subtitle: '三源信噪比 · 孤证不立', accent: 'var(--fire-gold)', border: 'var(--fire-gold)',
          body: '线索不是证据，是证据的概率云。三源各有物性：信访滚烫但杂讯多，审计冷静但天然滞后，舆情迅捷却容易蒸发——研判台做的事，是把概率云压缩成可核查的事实点。',
          pillars: [['三源', '信访/审计/舆情各有信噪比。'], ['可信度', '哈希定值，台账不说谎。'], ['指向域', '每条线索都有受力面。']],
        },
        {
          title: '谈话的博弈', subtitle: '关联度 · 姿态 · 先谈谁', accent: 'var(--cyber-cyan)', border: 'var(--cyber-cyan)',
          body: '谈话室里没有中立者：关联度越高的人离真相越近，也离风险越近。配合、谨慎、回避三种姿态，是利害关系在表情管理上的投影——调度的全部艺术，浓缩成一个排序问题：先谈谁。',
          pillars: [['排序', '关联度决定优先级。'], ['姿态', '立场是利害的函数。'], ['咬合', '笔录与书证互为钉子。']],
        },
        {
          title: '整改的时间差', subtitle: '双闸销号 · 回头看', accent: 'var(--china-red)', border: 'var(--china-red)',
          body: '问题定档那一刻只是开始：重大问题两轮才启动、四轮才销号——制度的修复速度天然慢于破坏速度，整改跟踪盯住的正是这个时间差里的衰减与反弹。',
          pillars: [['定档', '严重度决定整改节奏。'], ['双闸', '启动与销号两道闸门。'], ['销号', '回头看核验才算闭环。']],
        },
      ]} />
      {!embedded && (
      <ModuleFooter
        moduleId="inspection"
        links={[
          { to: '/sandbox?tab=handong', label: '汉东省沙盘', note: '同一虚构省份：从巡视底稿回到全要素治理推演' },
          { to: '/sandbox?tab=org-dept', label: '组织画像引擎', note: '全库六维画像——谈话对象的能力底数从这里来' },
        ]}
        disclaimer="虚构省份巡视沙盘，致敬经典政治叙事；与任何真实巡视工作、真实人物无关；不构成对任何机构流程的描述"
      />
      )}
    </div>
  );
}
