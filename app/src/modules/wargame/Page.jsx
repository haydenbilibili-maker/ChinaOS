import React, { useState, useMemo, useEffect, useRef } from 'react';
import { PageHeader, Card, Grid, Stat, StatGrid } from '../../app/ui.jsx';
import EChart from '../../lib/viz/EChart.jsx';
import { IntroCard, SelectorBar, FrameworkTrio, ModuleFooter } from '../shared/ModuleParadigm.jsx';
import {
  WG_AS_OF, SIDES, CARDS, STRATEGIES, INIT, MAX_TURNS, AP_PER_TURN,
  THIRD_PARTIES, TECH_TRACKS, TILT_TIPPING, TILT_SIDED,
  makeInitialState, usMove, resolveTurn, judge, buildWarReport, tallyCnPlays, applyTechPlans,
} from './wargameData.js';

// ============================================================================
// 大国博弈推演桌 · 中美科技-经贸博弈的回合制思想实验
// ----------------------------------------------------------------------------
// 安全红线：仅科技/经贸/产业维度的抽象博弈，不涉军事冲突情景；
//          牌名一律中性术语，不出现任何具体真实企业名。
// 声明：思想实验 / 分析框架 · 非预测 · 非政策倡导 · 双方收益矩阵为示意标定。
// 引擎全在 wargameData.js（确定性纯函数）；本页只做选牌-结算-呈现。
// ============================================================================

const AX = { line: '#27324a', text: '#93a1b5', split: 'rgba(148,163,184,0.1)' };

const BTN = {
  background: 'var(--bg-elevated)', border: '1px solid var(--border-subtle)',
  color: 'var(--text-secondary)', borderRadius: 6, padding: '4px 12px', fontSize: 12, cursor: 'pointer',
};
const BTN_RED = { ...BTN, background: 'rgba(196,30,58,0.16)', border: '1px solid rgba(196,30,58,0.4)', color: '#c41e3a', fontWeight: 600 };
const BTN_CYAN = { ...BTN, background: 'rgba(34,211,238,0.12)', border: '1px solid rgba(34,211,238,0.35)', color: '#22d3ee', fontWeight: 600 };

const STRAT_ACCENT = { hawk: '#c41e3a', tit: '#e8a317', deal: '#10b981' };
// 攻关线配色：键为 techtree 领域 k（TECH_TRACKS 派生 id）；旧档 litho/soft/aero 查无即走灰色兜底
const TRACK_ACCENT = { semi: '#c41e3a', bci: '#8b5cf6', ai: '#22d3ee', space: '#e8a317', robot: '#10b981' };
const SIDE_LABEL = { cn: '中方', us: '美方', both: '通用' };
const SIDE_COLOR = { cn: '#c41e3a', us: '#22d3ee', both: '#8b5cf6' };

// 中方可出手牌（side cn/both），牌库顺序即手牌顺序
const CN_HAND = CARDS.filter((c) => c.side === 'cn' || c.side === 'both');

const sgn = (v) => (v > 0 ? `+${v}` : `${v}`);
const dColor = (v) => (v > 0 ? '#10b981' : v < 0 ? '#c41e3a' : 'var(--text-tertiary)');

// —— 图谱方案回写：科技图谱攻关推演页写入的账本（只读消费） ——
const PLANS_KEY = 'cos-tech-plans';

/** 读取图谱方案账本的 plans 字段：缺失 / 解析失败 / 结构异常一律降级为 null（零变化） */
function readTechPlans() {
  try {
    const obj = JSON.parse(localStorage.getItem(PLANS_KEY) || 'null');
    if (!obj || typeof obj !== 'object' || !obj.plans || typeof obj.plans !== 'object') return null;
    return obj.plans;
  } catch {
    return null;
  }
}

// —— 策略实验室：对局存档（独立键 · 数组 cap 10 · 新进先出） ——
const RUNS_KEY = 'cos-wargame-runs';

/** 读档：解析失败 / 结构异常一律降级为空数组 */
function readRuns() {
  try {
    const arr = JSON.parse(localStorage.getItem(RUNS_KEY) || '[]');
    if (!Array.isArray(arr)) return [];
    return arr.filter((r) => r && typeof r === 'object' && r.judge && r.final).slice(0, 10);
  } catch {
    return [];
  }
}

/** 两局对比的一句自动结论（只替中方两线记账） */
function compareVerdict(a, b) {
  const dT = a.final.cnTech - b.final.cnTech;
  const dE = a.final.cnEcon - b.final.cnEcon;
  const A = `#${a.id}「${a.strategyLabel}」`;
  const B = `#${b.id}「${b.strategyLabel}」`;
  if (dT === 0 && dE === 0) return `${A} 与 ${B} 两局中方科技、经贸双线打平——对手性格不同，账面殊途同归。`;
  if (dT > 0 && dE < 0) return `${A} 局在科技线多保了 ${dT} 点，代价是经贸线少 ${-dE} 点——攻关换血条的经典账。`;
  if (dT < 0 && dE > 0) return `${B} 局在科技线多保了 ${-dT} 点，代价是经贸线少 ${dE} 点——${A} 局用科技斜率换了经贸体面。`;
  if (dT >= 0 && dE >= 0) return `${A} 局科技线多 ${dT} 点、经贸线多 ${dE} 点，中方两线全面不劣——这一档对手没让中方付出额外代价。`;
  return `${B} 局科技线多 ${-dT} 点、经贸线多 ${-dE} 点，中方两线全面不劣——${A} 局的牌路整体吃亏。`;
}

/** effect 四值小字：己科技/己经贸/对科技/对经贸 */
function EffectRow({ effect }) {
  const cells = [
    ['己科技', effect.selfTech], ['己经贸', effect.selfEcon],
    ['对科技', effect.oppTech], ['对经贸', effect.oppEcon],
  ];
  return (
    <div className="flex flex-wrap gap-x-2.5 gap-y-0.5 mt-1.5">
      {cells.map(([k, v]) => (
        <span key={k} className="text-[10px] mono" style={{ color: 'var(--text-tertiary)' }}>
          {k} <span style={{ color: dColor(v), fontWeight: 600 }}>{sgn(v)}</span>
        </span>
      ))}
    </div>
  );
}

export default function Page({ embedded = false }) {
  // —— 对局状态 ——
  const [strategy, setStrategy] = useState('tit');             // 美方策略档位
  const [track, setTrack] = useState(TECH_TRACKS[0].id);       // 攻关目标线（重开对局保留），缺省=派生第一条
  const [game, setGame] = useState(makeInitialState);  // 引擎 state（turn 0 起步）
  const [selected, setSelected] = useState([]);        // 本回合已选中方牌 id
  const [reportMd, setReportMd] = useState('');
  const [copied, setCopied] = useState(false);

  // —— 图谱方案账本：mount 读一次 + storage / cos-ledger-change 双监听，JSON 比对防循环 ——
  const [techPlans, setTechPlans] = useState(readTechPlans);
  const plansSigRef = useRef(JSON.stringify(readTechPlans() ?? null));
  useEffect(() => {
    const sync = () => {
      const next = readTechPlans();
      const sig = JSON.stringify(next ?? null);
      if (sig === plansSigRef.current) return;
      plansSigRef.current = sig;
      setTechPlans(next);
    };
    window.addEventListener('storage', sync);
    window.addEventListener('cos-ledger-change', sync);
    return () => {
      window.removeEventListener('storage', sync);
      window.removeEventListener('cos-ledger-change', sync);
    };
  }, []);

  // 加成后的攻关线：无账本 / 坏档时 applyTechPlans 原样返回 TECH_TRACKS（零变化）
  const activeTracks = useMemo(() => applyTechPlans(TECH_TRACKS, techPlans), [techPlans]);
  const boostedTracks = useMemo(() => activeTracks.filter((t) => (t.boosted || 0) > 0), [activeTracks]);

  const finished = game.turn >= MAX_TURNS;
  const strat = useMemo(() => STRATEGIES.find((s) => s.id === strategy) || STRATEGIES[0], [strategy]);
  const trackObj = useMemo(() => activeTracks.find((t) => t.id === track) || activeTracks[0], [track, activeTracks]);

  // 已选行动点
  const apUsed = useMemo(
    () => selected.reduce((s, id) => s + (CN_HAND.find((c) => c.id === id)?.cost || 0), 0),
    [selected]
  );

  // 中方持续牌驻留集合（驻留中的牌再点出会被引擎弃置——直接禁选并标注）
  const cnPersist = useMemo(
    () => new Set(game.persist.filter((p) => p.side === 'cn').map((p) => p.cardId)),
    [game.persist]
  );

  const toggleCard = (card) => {
    if (finished) return;
    setSelected((prev) => {
      if (prev.includes(card.id)) return prev.filter((x) => x !== card.id);
      if (apUsed + card.cost > AP_PER_TURN) return prev;     // 行动点不够，不收
      if (cnPersist.has(card.id)) return prev;               // 已驻留，重复出牌无效
      return [...prev, card.id];
    });
  };

  // 出牌结算：美方按策略同步出牌，引擎一次性推进一个回合
  // （攻关线随 opts 传入；曲线用 activeTracks 中选中线的加成后曲线覆盖查表）
  const settleTurn = () => {
    if (finished) return;
    const usCards = usMove(strategy, game, game.turn + 1);
    setGame((prev) => resolveTurn(prev, selected, usCards, { track, curveOverride: trackObj.curve }));
    setSelected([]);
  };

  // 重开对局：策略与攻关目标线均保留，只清盘面
  const restart = () => {
    setGame(makeInitialState());
    setSelected([]);
    setReportMd('');
    setCopied(false);
  };

  // 终局判定（仅 5 回合打满后）
  const verdict = useMemo(() => (finished ? judge(game) : null), [finished, game]);

  // —— 策略实验室：存档列表 / 选中对比（最多 2 局） ——
  const [runs, setRuns] = useState(readRuns);   // mount 时读档恢复列表
  const [picked, setPicked] = useState([]);     // 选中的存档 id（≤2）
  const savedRef = useRef(false);               // 本局是否已入档（防重复写）

  // 终局自动存档：turn 打满且 judge 非空时写一次；重开对局后标记复位
  useEffect(() => {
    if (!finished || !verdict) { savedRef.current = false; return; }
    if (savedRef.current) return;
    savedRef.current = true;
    try {
      const prev = readRuns();
      const maxId = prev.reduce((m, r) => Math.max(m, Number(r.id) || 0), 0);
      const run = {
        id: maxId + 1,
        strategy,
        strategyLabel: strat.label,
        track,                                // 增量字段：攻关目标线 id（旧档无此字段不影响读取）
        tilts: { ...(game.tilts || {}) },     // 增量字段：终局第三方天平
        judge: { label: verdict.label, color: verdict.color },
        final: { cnTech: game.cn.tech, cnEcon: game.cn.econ, usTech: game.us.tech, usEcon: game.us.econ },
        cardsPlayed: tallyCnPlays(game.log),
      };
      const next = [run, ...prev].slice(0, 10);
      localStorage.setItem(RUNS_KEY, JSON.stringify(next));
      setRuns(next);
      window.dispatchEvent(new CustomEvent('cos-ledger-change'));
    } catch {
      /* 存档失败：本局按未入档处理，不打断对局 */
    }
  }, [finished, verdict, game, strategy, strat, track]);

  const togglePick = (id) => {
    setPicked((prev) => {
      if (prev.includes(id)) return prev.filter((x) => x !== id);
      if (prev.length >= 2) return prev;   // 已选满 2 局：先取消一局再换
      return [...prev, id];
    });
  };

  const clearRuns = () => {
    try {
      localStorage.removeItem(RUNS_KEY);
      window.dispatchEvent(new CustomEvent('cos-ledger-change'));
    } catch { /* 清档失败按已清处理 */ }
    setRuns([]);
    setPicked([]);
  };

  const pickedRuns = useMemo(
    () => picked.map((id) => runs.find((r) => r.id === id)).filter(Boolean),
    [picked, runs]
  );

  const genReport = () => {
    try {
      setReportMd(buildWarReport({ strategy, state: game, track, tracks: activeTracks }));
    } catch (e) {
      setReportMd(`# 报告生成异常\n\n${String(e)}`);
    }
    setCopied(false);
  };
  const copyReport = () => {
    navigator.clipboard?.writeText(reportMd).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    });
  };

  // —— 战局曲线：四线（中科技/中经贸/美科技/美经贸），回合 0..5 ——
  const curveOption = useMemo(() => {
    const lines = [
      ['中方科技', 'cnTech', '#c41e3a', 'solid'],
      ['中方经贸', 'cnEcon', '#fb923c', 'dashed'],
      ['美方科技', 'usTech', '#22d3ee', 'solid'],
      ['美方经贸', 'usEcon', '#8b5cf6', 'dashed'],
    ];
    return {
      legend: { data: lines.map((l) => l[0]), textStyle: { color: AX.text }, top: 0 },
      grid: { left: 40, right: 18, top: 34, bottom: 26 },
      xAxis: {
        type: 'category',
        data: game.history.map((h) => (h.turn === 0 ? '开局' : `第${h.turn}回合`)),
        axisLine: { lineStyle: { color: AX.line } }, axisLabel: { color: AX.text },
      },
      yAxis: {
        type: 'value', min: 0, max: 100,
        axisLine: { lineStyle: { color: AX.line } }, axisLabel: { color: AX.text },
        splitLine: { lineStyle: { color: AX.split } },
      },
      series: lines.map(([name, key, color, type]) => ({
        name, type: 'line', data: game.history.map((h) => h[key]),
        lineStyle: { color, width: 2, type }, itemStyle: { color }, symbolSize: 6,
      })),
    };
  }, [game.history]);

  return (
    <div>
      {!embedded && (
      <PageHeader
        badge="Simulation · 大国博弈推演桌"
        title="大国博弈推演桌 · 科技-经贸回合制思想实验"
        subtitle="八张中性牌 × 五个回合 × 三档对手策略 + 两个摇摆方——博弈不是棋盘上的胜负，是两条供应链的耐力赛"
      />
      )}
      <IntroCard>
        <strong style={{ color: 'var(--text-primary)' }}>思想实验声明：</strong>
        本页是中美科技-经贸博弈的抽象推演框架——非预测、非政策倡导，双方收益矩阵为示意标定，仅覆盖科技/经贸/产业维度，不涉任何军事冲突情景。
        把宏大叙事压缩成一张 2×2×5 的账本：每一回合，双方各持 {AP_PER_TURN} 个行动点，从管制、关税、攻关、谈判这些中性术语牌里挑出自己的组合；管制牌伤对方科技但反噬己方经贸，攻关牌慢热而持续，谈判与开放双正但小——出牌的瞬间爽感和五回合后的四线对账，往往是两回事。
        博弈不是棋盘上的胜负，是两条供应链的耐力赛：谁的血条厚、谁的时间结构有利、谁先把敌意变现，比谁嗓门大重要得多。
        本轮扩容把两体博弈改成三体：欧盟与东盟作为摇摆方上桌——缓和与开放把它们拉过来，管制与胁迫把它们推出去，倾斜到位就逐回合给倾向侧的经贸线记账；「自主攻关」也不再是匀速直线，五条攻关目标线直接派生自科技树作战盘——受制卡脖子领域全员上桌，再补并跑区战略权重最高的几条，总量接近、时间结构天差地别——选哪条线，就是选押注哪一种耐心。
      </IntroCard>
      <StatGrid className="mb-8">
        <Stat value={WG_AS_OF} label="推演基准日" accent="#22d3ee" />
        <Stat value={`${CARDS.length} 张`} label="中性术语牌库" accent="#e8a317" />
        <Stat value={`${MAX_TURNS} 回合`} label={`回合制 · 每回合 ${AP_PER_TURN} 行动点`} accent="#c41e3a" />
        <Stat value={`${STRATEGIES.length} 档`} label="美方 AI 策略" accent="#10b981" />
      </StatGrid>

      {/* 1 —— 对局设定 */}
      <Card title="① 对局设定 · 选定对手的性格">
        <SelectorBar
          items={STRATEGIES} activeKey={strategy} onSelect={setStrategy}
          getKey={(s) => s.id} getLabel={(s) => s.label} getAccent={(s) => STRAT_ACCENT[s.id]}
        />
        <p className="text-xs leading-relaxed mb-4" style={{ color: 'var(--text-secondary)' }}>
          <span className="font-semibold" style={{ color: STRAT_ACCENT[strategy] }}>{strat.label}：</span>{strat.desc}
          {game.turn > 0 && !finished && ' —— 中途换档即时生效：对手的性格，本来就是局中变量。'}
        </p>
        <div className="text-[11px] mono mb-2" style={{ color: 'var(--text-tertiary)' }}>攻关目标线 · 「自主攻关」驻留后走哪条增益曲线（5 条 · 派生自科技树作战盘）</div>
        <SelectorBar
          items={activeTracks} activeKey={track} onSelect={setTrack}
          getKey={(t) => t.id} getLabel={(t) => t.label} getAccent={(t) => TRACK_ACCENT[t.id] || '#64748b'}
        />
        {boostedTracks.length > 0 && (
          <div className="flex flex-wrap items-center gap-1.5 -mt-2 mb-3">
            {boostedTracks.map((t) => (
              <span
                key={t.id}
                title="来自科技图谱攻关推演的回写方案"
                className="text-[10px] mono px-1.5 py-0.5 rounded"
                style={{ background: 'rgba(232,163,23,0.14)', color: '#e8a317', border: '1px solid rgba(232,163,23,0.4)' }}
              >{t.label} · {t.planNote}</span>
            ))}
            <span className="text-[10px]" style={{ color: 'var(--text-tertiary)' }}>来自科技图谱攻关推演的回写方案</span>
          </div>
        )}
        <p className="text-xs leading-relaxed mb-4" style={{ color: 'var(--text-secondary)' }}>
          <span className="font-semibold" style={{ color: TRACK_ACCENT[track] || '#64748b' }}>{trackObj.label}：</span>
          <span className="text-[11px]" style={{ color: 'var(--text-tertiary)' }}>卡点：{trackObj.neck}</span>
          <span className="mono text-[11px]" style={{ color: 'var(--text-tertiary)' }}>　逐回合增益 {trackObj.curve.join(' / ')}（合计 +{trackObj.curve.reduce((s, v) => s + v, 0)}） · 重开对局保留所选线</span>
          {trackObj.boosted > 0 && (
            <span
              title="来自科技图谱攻关推演的回写方案"
              className="text-[10px] mono px-1.5 py-0.5 rounded ml-1.5"
              style={{ background: 'rgba(232,163,23,0.14)', color: '#e8a317', border: '1px solid rgba(232,163,23,0.4)' }}
            >{trackObj.planNote}</span>
          )}
        </p>
        <div className="flex items-center gap-3 flex-wrap">
          <span className="mono text-xl font-bold" style={{ color: finished ? '#e8a317' : '#22d3ee' }}>
            {finished ? '对局终了' : `第 ${game.turn + 1} / ${MAX_TURNS} 回合`}
          </span>
          <span className="text-[11px] mono" style={{ color: 'var(--text-tertiary)' }}>
            已结算 {game.turn} 回合 · 持续牌驻留 {game.persist.length} 张
          </span>
          <button type="button" style={BTN} onClick={restart}>↻ 重开对局</button>
        </div>
        <div className="flex flex-wrap gap-1.5 mt-3">
          {SIDES.map((s) => (
            <span key={s.id} className="text-[10px] mono px-2 py-0.5 rounded" style={{ background: `${s.color}1f`, color: s.color }}>
              {s.label} 开局 科技 {INIT[s.id].tech} / 经贸 {INIT[s.id].econ}{s.id === 'cn' ? ' · 追赶者设定' : ''}
            </span>
          ))}
        </div>
      </Card>

      {/* 2 —— 我方手牌 */}
      <Card title={`② 我方手牌 · 行动点 ${apUsed}/${AP_PER_TURN}`}>
        <div className="grid gap-3 mb-4" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))' }}>
          {CN_HAND.map((c) => {
            const sel = selected.includes(c.id);
            const parked = cnPersist.has(c.id);
            const unaffordable = !sel && apUsed + c.cost > AP_PER_TURN;
            const blocked = finished || parked || unaffordable;
            // 自主攻关：己科技按所选攻关线曲线显示下一回合的真实增益
            const eff = c.id === 'selfdev'
              ? { ...c.effect, selfTech: trackObj.curve[Math.min(game.turn, MAX_TURNS - 1)] }
              : c.effect;
            return (
              <button
                key={c.id} type="button" onClick={() => toggleCard(c)}
                className="text-left rounded p-3"
                style={{
                  background: sel ? 'rgba(196,30,58,0.10)' : 'var(--bg-elevated)',
                  border: sel ? '1px solid rgba(196,30,58,0.55)' : '1px solid var(--border-subtle)',
                  borderTop: sel ? '3px solid #c41e3a' : `3px solid ${SIDE_COLOR[c.side]}55`,
                  opacity: blocked && !sel ? 0.45 : 1,
                  cursor: blocked && !sel ? 'not-allowed' : 'pointer',
                }}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="text-sm font-semibold" style={{ color: sel ? '#c41e3a' : 'var(--text-primary)' }}>{c.label}</span>
                  <span
                    className="text-[10px] mono px-1.5 py-0.5 rounded shrink-0"
                    style={{ background: 'var(--bg-base)', color: '#e8a317', border: '1px solid var(--border-subtle)' }}
                  >费 {c.cost}</span>
                </div>
                <div className="flex flex-wrap gap-1.5 mt-1">
                  <span className="text-[10px] mono" style={{ color: SIDE_COLOR[c.side] }}>{SIDE_LABEL[c.side]}牌</span>
                  <span className="text-[10px] mono" style={{ color: c.decay === '持续' ? '#10b981' : 'var(--text-tertiary)' }}>{c.decay}</span>
                  {c.id === 'selfdev' && (
                    <span className="text-[10px] mono" style={{ color: TRACK_ACCENT[track] || '#64748b' }}>走「{trackObj.label}」线</span>
                  )}
                  {parked && <span className="text-[10px] mono" style={{ color: '#10b981' }}>已驻留生效中</span>}
                </div>
                <EffectRow effect={eff} />
                <p className="text-[10px] leading-snug mt-1.5" style={{ color: 'var(--text-tertiary)' }}>{c.desc}</p>
              </button>
            );
          })}
        </div>
        <div className="flex items-center gap-3 flex-wrap">
          <button
            type="button"
            disabled={finished}
            style={{ ...BTN_RED, padding: '8px 20px', fontSize: 13, opacity: finished ? 0.5 : 1, cursor: finished ? 'not-allowed' : 'pointer' }}
            onClick={settleTurn}
          >
            {finished ? '五回合已打满 · 看终局判定' : `▶ 出牌结算本回合（第 ${game.turn + 1} 回合）`}
          </button>
          <span className="text-[11px] flex-1" style={{ color: 'var(--text-tertiary)', minWidth: 200 }}>
            {selected.length === 0
              ? '可空手过回合：按兵不动也是一手牌——科技线自然增长 +1 仍在走。'
              : `本回合出牌：${selected.map((id) => CN_HAND.find((c) => c.id === id)?.label).join(' + ')} · 结算时美方按「${strat.label}」同步出牌。`}
          </span>
        </div>
      </Card>

      {/* 3 —— 战局曲线 */}
      <Card title="③ 战局曲线 · 四线对账">
        <EChart option={curveOption} style={{ height: 300 }} />
        <p className="text-[11px] mt-2" style={{ color: 'var(--text-tertiary)' }}>
          实线为科技线、虚线为经贸线。看的不是单点高低，是斜率：管制把对方科技线斜率打负，代价是己方经贸线同步走低——四条线没有一条是免费的。
        </p>
      </Card>

      {/* 3.5 —— 第三方天平 */}
      <Card title="③.5 第三方天平 · 摇摆方往哪边倒">
        <div className="space-y-4 mb-3">
          {THIRD_PARTIES.map((tp) => {
            const tilt = (game.tilts || {})[tp.id] ?? tp.init;
            const abs = Math.abs(tilt);
            return (
              <div key={tp.id}>
                <div className="flex items-center gap-2 flex-wrap mb-1.5">
                  <span className="text-sm font-semibold" style={{ color: tp.color }}>{tp.label}</span>
                  <span className="text-[10px] mono px-1.5 py-0.5 rounded" style={{ background: `${tp.color}1f`, color: tp.color, border: `1px solid ${tp.color}55` }}>
                    tilt {tilt > 0 ? '+' : ''}{tilt}
                  </span>
                  {abs >= TILT_TIPPING && (
                    <span
                      className="text-[10px] mono px-1.5 py-0.5 rounded"
                      style={{ background: 'rgba(232,163,23,0.14)', color: '#e8a317', border: '1px solid rgba(232,163,23,0.4)' }}
                    >已倾斜 · 每回合{tilt > 0 ? '中' : '美'}方经贸 +{tp.id === 'eu' ? 2 : 1}</span>
                  )}
                  {abs >= TILT_SIDED && (
                    <span className="text-[10px] font-bold" style={{ color: '#c41e3a' }}>实质选边</span>
                  )}
                </div>
                <div className="relative rounded" style={{ height: 14, background: 'var(--bg-elevated)', border: '1px solid var(--border-subtle)' }}>
                  {/* 中点刻度 + ±40/±60 阈值刻度 */}
                  <div className="absolute" style={{ left: '50%', top: 0, bottom: 0, width: 2, background: '#27324a' }} />
                  {[-TILT_SIDED, -TILT_TIPPING, TILT_TIPPING, TILT_SIDED].map((m) => (
                    <div key={m} className="absolute" style={{ left: `${50 + m / 2}%`, top: 3, bottom: 3, width: 1, background: 'rgba(148,163,184,0.25)' }} />
                  ))}
                  <div
                    className="absolute rounded-sm"
                    style={{
                      top: 2, bottom: 2,
                      left: tilt >= 0 ? '50%' : `${50 - abs / 2}%`,
                      width: `${abs / 2}%`,
                      background: tp.color, opacity: 0.85,
                    }}
                  />
                </div>
                <div className="flex justify-between text-[10px] mono mt-0.5" style={{ color: 'var(--text-tertiary)' }}>
                  <span>-100 亲美</span><span>0 中立</span><span>+100 亲中</span>
                </div>
              </div>
            );
          })}
        </div>
        <p className="text-[11px]" style={{ color: 'var(--text-tertiary)' }}>
          缓和与开放把摇摆方拉过来，管制与胁迫把它们推出去——|tilt|≥{TILT_TIPPING} 起每回合给倾向侧经贸加成（欧盟 +2 / 东盟 +1），≥{TILT_SIDED} 视为实质选边。摇摆方不投票，只用供应链下注。
        </p>
      </Card>

      {/* 4 —— 回合纪要 */}
      <Card title="④ 回合纪要 · 出牌与效果">
        {game.log.length === 0 ? (
          <p className="text-xs mono" style={{ color: 'var(--text-tertiary)' }}>
            // 尚无纪要——选好手牌按下结算，第一回合开始记账。
          </p>
        ) : (
          <div className="space-y-1.5">
            {[...game.log].reverse().map((r) => (
              <div key={r.turn} className="flex items-center gap-3 text-xs py-1.5 px-2 rounded flex-wrap" style={{ background: 'var(--bg-elevated)' }}>
                <span className="mono shrink-0" style={{ color: 'var(--text-tertiary)' }}>第 {r.turn} 回合</span>
                <span className="shrink-0" style={{ color: '#c41e3a' }}>中方 {r.cn.join('+')}</span>
                <span className="shrink-0" style={{ color: '#22d3ee' }}>美方 {r.us.join('+')}</span>
                <span className="mono flex-1 text-right" style={{ minWidth: 200 }}>
                  <span style={{ color: dColor(r.delta.cnTech) }}>中科技{sgn(r.delta.cnTech)}</span>
                  <span className="mx-1" style={{ color: dColor(r.delta.cnEcon) }}>中经贸{sgn(r.delta.cnEcon)}</span>
                  <span className="mx-1" style={{ color: dColor(r.delta.usTech) }}>美科技{sgn(r.delta.usTech)}</span>
                  <span style={{ color: dColor(r.delta.usEcon) }}>美经贸{sgn(r.delta.usEcon)}</span>
                </span>
                {Array.isArray(r.tiltNotes) && r.tiltNotes.length > 0 && (
                  <span className="text-[10px] mono w-full" style={{ color: '#e8a317' }}>⚖ {r.tiltNotes.join(' · ')}</span>
                )}
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* 5 —— 终局判定（5 回合打满后显示） */}
      {finished && verdict && (
        <Card title="⑤ 终局判定 · 五回合对账">
          <div className="flex items-center gap-5 flex-wrap mb-4">
            <div
              className="flex items-center justify-center rounded shrink-0 px-5"
              style={{ minWidth: 130, height: 84, border: `2px solid ${verdict.color}`, background: `${verdict.color}14` }}
            >
              <span className="font-bold" style={{ fontSize: 26, color: verdict.color }}>{verdict.label}</span>
            </div>
            <div className="flex-1" style={{ minWidth: 240 }}>
              <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{verdict.note}</p>
              <p className="text-[11px] mono mt-2" style={{ color: 'var(--text-tertiary)' }}>
                终局四线：中方 科技 {game.cn.tech}（{sgn(game.cn.tech - INIT.cn.tech)}）/ 经贸 {game.cn.econ}（{sgn(game.cn.econ - INIT.cn.econ)}） ·
                美方 科技 {game.us.tech}（{sgn(game.us.tech - INIT.us.tech)}）/ 经贸 {game.us.econ}（{sgn(game.us.econ - INIT.us.econ)}）
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <button type="button" style={BTN_CYAN} onClick={genReport}>📄 生成推演报告</button>
            {reportMd && (
              <button type="button" style={copied ? { ...BTN, color: '#10b981' } : BTN} onClick={copyReport}>
                {copied ? '已复制 ✓' : '复制 Markdown'}
              </button>
            )}
            <button type="button" style={BTN_RED} onClick={restart}>↻ 重开对局（换策略再推一盘）</button>
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
      )}

      {/* 6 —— 策略实验室：对局存档与对比复盘（存档 ≥1 才显示） */}
      {runs.length > 0 && (
        <Card title="⑥ 策略实验室 · 对局复盘">
          <p className="text-[11px] mb-3" style={{ color: 'var(--text-tertiary)' }}>
            每盘打满五回合自动入档（仅留最近 10 局）。点击存档行选中，选满 2 局自动出对比表，再点一次取消。
          </p>
          <div className="space-y-1.5 mb-4">
            {runs.map((r) => {
              const sel = picked.includes(r.id);
              return (
                <button
                  key={r.id} type="button" onClick={() => togglePick(r.id)}
                  className="w-full text-left flex items-center gap-3 flex-wrap text-xs py-1.5 px-2 rounded"
                  style={{
                    background: sel ? 'rgba(34,211,238,0.10)' : 'var(--bg-elevated)',
                    border: sel ? '1px solid rgba(34,211,238,0.45)' : '1px solid var(--border-subtle)',
                    cursor: 'pointer',
                  }}
                >
                  <span className="mono shrink-0 font-semibold" style={{ color: sel ? '#22d3ee' : 'var(--text-tertiary)' }}>#{r.id}</span>
                  <span className="shrink-0 font-semibold" style={{ color: STRAT_ACCENT[r.strategy] || 'var(--text-secondary)' }}>{r.strategyLabel}</span>
                  {r.track && (
                    <span className="text-[10px] mono shrink-0" style={{ color: TRACK_ACCENT[r.track] || 'var(--text-tertiary)' }}>
                      {(activeTracks.find((t) => t.id === r.track) || { label: r.track }).label}
                    </span>
                  )}
                  <span
                    className="text-[10px] mono px-1.5 py-0.5 rounded shrink-0"
                    style={{ background: `${r.judge.color}1f`, color: r.judge.color, border: `1px solid ${r.judge.color}55` }}
                  >{r.judge.label}</span>
                  <span className="mono text-[10px] flex-1" style={{ color: 'var(--text-tertiary)', minWidth: 220 }}>
                    中科技 {r.final.cnTech} · 中经贸 {r.final.cnEcon} · 美科技 {r.final.usTech} · 美经贸 {r.final.usEcon}
                  </span>
                  {Array.isArray(r.cardsPlayed) && r.cardsPlayed.length > 0 && (
                    <span className="text-[10px] shrink-0" style={{ color: 'var(--text-tertiary)' }}>{r.cardsPlayed.join(' / ')}</span>
                  )}
                </button>
              );
            })}
          </div>
          {pickedRuns.length === 1 && (
            <p className="text-[11px] mono mb-4" style={{ color: '#22d3ee' }}>
              已选 #{pickedRuns[0].id}「{pickedRuns[0].strategyLabel}」——再选一局即可对比复盘。
            </p>
          )}
          {pickedRuns.length === 2 && (
            <div className="rounded p-3 mb-4" style={{ background: 'var(--bg-base)', border: '1px solid var(--border-subtle)' }}>
              <div className="grid text-[11px] mono items-center" style={{ gridTemplateColumns: '76px 1fr 1fr 72px', rowGap: 5 }}>
                <span style={{ color: 'var(--text-tertiary)' }}>线 / 对局</span>
                {pickedRuns.map((r) => (
                  <span key={r.id} className="text-right font-semibold" style={{ color: STRAT_ACCENT[r.strategy] || 'var(--text-primary)' }}>
                    #{r.id} {r.strategyLabel} · {r.judge.label}
                  </span>
                ))}
                <span className="text-right" style={{ color: 'var(--text-tertiary)' }}>Δ 前−后</span>
                {[
                  ['中方科技', 'cnTech', true], ['中方经贸', 'cnEcon', true],
                  ['美方科技', 'usTech', false], ['美方经贸', 'usEcon', false],
                ].map(([label, key, cnLine]) => {
                  const d = pickedRuns[0].final[key] - pickedRuns[1].final[key];
                  return (
                    <React.Fragment key={key}>
                      <span style={{ color: 'var(--text-secondary)' }}>{label}</span>
                      <span className="text-right" style={{ color: 'var(--text-primary)' }}>{pickedRuns[0].final[key]}</span>
                      <span className="text-right" style={{ color: 'var(--text-primary)' }}>{pickedRuns[1].final[key]}</span>
                      <span className="text-right font-semibold" style={{ color: cnLine ? dColor(d) : 'var(--text-tertiary)' }}>{sgn(d)}</span>
                    </React.Fragment>
                  );
                })}
              </div>
              <p className="text-xs leading-relaxed mt-3" style={{ color: 'var(--text-secondary)' }}>
                {compareVerdict(pickedRuns[0], pickedRuns[1])}
              </p>
              <p className="text-[10px] mt-1" style={{ color: 'var(--text-tertiary)' }}>
                Δ 着色：中方两线前者高着绿、低着红；美方两线中性灰——实验室只替中方记账。
              </p>
            </div>
          )}
          <div className="flex items-center gap-3 flex-wrap">
            <button type="button" style={BTN} onClick={clearRuns}>🗑 清空实验室</button>
            <span className="text-[10px]" style={{ color: 'var(--text-tertiary)' }}>
              点击即清空全部对局存档，不可恢复，无二次确认。
            </span>
          </div>
        </Card>
      )}

      {/* 7 —— 框架三卡 + 页脚 */}
      <FrameworkTrio cards={[
        {
          title: '筹码的不对称', subtitle: '管制快 · 反噬慢', accent: 'var(--fire-gold)', border: 'var(--fire-gold)',
          body: '管制牌对对方科技线立竿见影，对己方经贸线却是分期付款的反噬——出牌瞬间的烈度，永远高估了五回合后的净收益。筹码的真实价格，要等账期走完才看得见。',
          pillars: [['立竿见影', '对方科技线当回合走低。'], ['分期反噬', '己方经贸逐回合还账。'], ['底牌损耗', '稀土类筹码打一张少一张。']],
        },
        {
          title: '时滞与耐力', subtitle: '慢热牌的复利', accent: 'var(--cyber-cyan)', border: 'var(--cyber-cyan)',
          body: '攻关与标准联盟单回合数字难看，但驻留效果按回合复利——五回合的耐力赛里，胜负手不在最响的那张牌，在最沉得住气的那张。追赶者的时间结构，靠持续牌一格一格垫出来。',
          pillars: [['驻留生效', '持续牌效果逐回合累计。'], ['自然增长', '科技线每回合 +1 不靠出牌。'], ['斜率思维', '看曲线斜率，不看单点。']],
        },
        {
          title: '缓和的窗口期', subtitle: '双正但小的难处', accent: 'var(--china-red)', border: 'var(--china-red)',
          body: '谈判与开放双正但小，单回合永远不如对抗醒目——它买的不是分数，是把博弈拖入对自己有利的时间结构。窗口期不是和解，是双方同时算清了对抗的边际成本；能开多久，取决于谁先变现敌意。',
          pillars: [['双正但小', '缓和收益不如对抗伤害醒目。'], ['时间换档', '把耐力赛拖进己方节奏。'], ['窗口易碎', '一张管制牌就能关上。']],
        },
      ]} />
      {!embedded && (
      <ModuleFooter
        moduleId="wargame"
        links={[
          { to: '/diplomacy', label: '外交全局框架盘', note: '推演桌上的策略档位，对应现实里四圈层布局与张力轴的操作选择。' },
          { to: '/techtree', label: '科技攻坚树', note: '攻关线的数据源头：五条目标线即作战盘领域派生，卡点与曲线同步联动。' },
          { to: '/sandbox?tab=macro', label: '宏观调控驾驶舱', note: '经贸线血条的现实读数——耐力赛拼的就是这张底盘。' },
        ]}
        disclaimer="思想实验 / 分析框架 · 非预测 · 非政策倡导 · 仅科技/经贸维度抽象博弈，双方收益矩阵为示意标定，不构成对任何现实主体的评价"
      />
      )}
    </div>
  );
}
