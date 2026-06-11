import React, { useState, useMemo, useEffect } from 'react';
import { PageHeader, Card, Grid, Stat } from '../../app/ui.jsx';
import EChart from '../../lib/viz/EChart.jsx';
import { IntroCard, SelectorBar, FrameworkTrio, ModuleFooter } from '../shared/ModuleParadigm.jsx';
import { CRISIS_DOMAINS, TOOLS } from '../sandbox/crisisData.js';
import {
  HD_AS_OF, RESOURCE_TYPES, CAPITALS, POSTS, OFFICIALS, HD_SCENARIOS,
  computeBaseline, teamCompetence, hdEngine, meritDelta, promotionJudge, hdReport,
} from './handongData.js';
import { useRealPool, filterPool, topMatches, REAL_POOL_NOTE } from './realPool.js';
import {
  TERM_YEARS, METRICS, initMetrics, yearBudget, evolveMetrics, aftermathOf,
  growthDims, fatiguePenalty, termGrade, buildTermReport,
} from './cycle.js';

// ============================================================================
// 汉东省 · 全要素治理沙盒（虚构推演页）
// ----------------------------------------------------------------------------
// 游戏循环 v2（任期治理周期）：省情配置 → 班子组建 → 年度危机 → 政策配置（财政
//           约束预算）→ 执行年度推演 → 省态三表演化 → 余波传导 → 官员成长/疲劳
//           → 政绩写回 → 五年任期届满大考 → 换届结算。回合即年度，任期即大考。
// 六域沿用 CRISIS_DOMAINS 数组（科技/经济/社会/外交/能源/金融），
// 在省域语境下读作：科技产业/经济/社会民生/外部环境/能源资源/金融财政。
// 五工具沿用 TOOLS，省域语义：财政盘活/金融工具/产业再造/上级协调/社会动员。
// 声明：汉东为虚构省份，人物剧情均为原创致敬式虚构，与任何真实地区/人物无关。
// ============================================================================

const HD_DOMAINS = ['科技产业', '经济', '社会民生', '外部环境', '能源资源', '金融财政'];
const TOOL_HD = { fiscal: '财政盘活', monetary: '金融工具', industry: '产业再造', diplomacy: '上级协调', mobilize: '社会动员' };
const ACT_NAMES = ['起', '承', '转', '合'];
const ACT_CN = ['一', '二', '三', '四'];
const AX = { line: '#27324a', text: '#93a1b5', split: 'rgba(148,163,184,0.1)' };

// 初始省情（与 P0 滑杆初值保持同一来源）：三表懒初始化以此为锚，
// 任期内 P0 变更不重置三表——省情变更只对「下一届」生效。
const INIT_CFG = { pop: 7600, gdpPc: 8, industry: [8, 44, 48], resource: RESOURCE_TYPES[0]?.id || 'energy', capital: CAPITALS[0] };
const initialMetrics = () => initMetrics(computeBaseline(INIT_CFG));

const BTN = {
  background: 'var(--bg-elevated)', border: '1px solid var(--border-subtle)',
  color: 'var(--text-secondary)', borderRadius: 6, padding: '4px 12px', fontSize: 12, cursor: 'pointer',
};
const BTN_RED = { ...BTN, background: 'rgba(196,30,58,0.16)', border: '1px solid rgba(196,30,58,0.4)', color: '#c41e3a', fontWeight: 600 };
const BTN_CYAN = { ...BTN, background: 'rgba(34,211,238,0.12)', border: '1px solid rgba(34,211,238,0.35)', color: '#22d3ee', fontWeight: 600 };

/** 岗位需求 × 官员六维 的匹配分：按需求权重加权平均（0-95 量纲） */
function matchScore(dims, need) {
  const wsum = (need || []).reduce((a, b) => a + b, 0) || 1;
  return Math.round((need || []).reduce((s, w, i) => s + w * (dims[i] || 0), 0) / wsum);
}

/** 双剧情非线性叠加（内联实现）：impact 相加×0.72 截 1.0；mitigation 取均×0.85 */
function compositeScenario(A, B) {
  const impact = CRISIS_DOMAINS.map((_, i) => Math.min(1, (A.impact[i] + B.impact[i]) * 0.72));
  const need = CRISIS_DOMAINS.map((_, i) => Math.min(100, Math.round((A.need[i] + B.need[i]) / 2)));
  const mitigation = {};
  TOOLS.forEach((t) => {
    const ra = A.mitigation[t.id] || [], rb = B.mitigation[t.id] || [];
    mitigation[t.id] = CRISIS_DOMAINS.map((_, i) => Math.round(((ra[i] || 0) + (rb[i] || 0)) / 2 * 0.85));
  });
  return {
    id: `${A.id}+${B.id}`, label: `${A.label} × ${B.label}`, color: '#ef4444',
    intro: '复合情景：两条危机线同时起火，处置资源互相挤占，每件工具的边际效力同步衰减。',
    acts: A.acts, impact, need, mitigation,
    watch: [...A.watch.slice(0, 2), ...(B.watch || []).slice(0, 1)],
  };
}

/** 任免建议措辞（克制版） */
function adviceFor(judge, postId) {
  const j = judge[0];
  if (j === '拟提拔') {
    if (postId === 'secretary') return '建议交流重用：拟推荐至中央部委任职历练';
    if (postId === 'governor') return '建议交流重用：拟接任省委书记';
    if (postId === 'deputy') return '建议进一步使用：拟列入省长人选考察';
    if (postId) return '建议进入省级党政班子吃劲岗位';
    return '建议补入班子，安排重要岗位锻炼';
  }
  if (j === '留任') return '建议继续在岗履职，保持工作连续性';
  if (j === '诫勉') return '建议诫勉谈话，限期整改并跟踪考察';
  return '建议调整岗位，转任非领导职务交流使用';
}

/** 真实人物徽章：库内政要（公开履历画像）统一标识 */
function RealBadge() {
  return (
    <span
      className="text-[10px] mono px-1.5 py-0.5 rounded-full shrink-0"
      style={{ border: '1px solid var(--border-subtle)', color: 'var(--text-tertiary)', background: 'transparent' }}
    >真实 · 公开履历</span>
  );
}

function RangeRow({ label, value, min, max, step = 1, unit = '', accent = '#22d3ee', onChange }) {
  return (
    <div className="mb-3">
      <div className="flex justify-between items-baseline text-xs mb-1">
        <span style={{ color: 'var(--text-secondary)' }}>{label}</span>
        <span className="mono font-semibold" style={{ color: accent }}>{value}{unit}</span>
      </div>
      <input
        type="range" min={min} max={max} step={step} value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full" style={{ accentColor: accent }}
      />
    </div>
  );
}

export default function Page() {
  // —— P0 省情配置 ——
  const [pop, setPop] = useState(INIT_CFG.pop);            // 常住人口（万）
  const [gdpPc, setGdpPc] = useState(INIT_CFG.gdpPc);      // 人均 GDP（万元）
  const [industry, setIndustry] = useState([...INIT_CFG.industry]); // 三产结构 Σ=100
  const [resource, setResource] = useState(INIT_CFG.resource);
  const [capital, setCapital] = useState(INIT_CFG.capital);
  // —— 班子 ——
  const [assign, setAssign] = useState(() => Object.fromEntries(POSTS.map((p) => [p.id, null])));
  const [merits, setMerits] = useState(() => Object.fromEntries(OFFICIALS.map((o) => [o.id, o.merit])));
  // —— 候选池：虚构官员库 / 真实政要库（人才库公开履历画像）双池 ——
  const [poolMode, setPoolMode] = useState('fiction'); // 'fiction' | 'real'
  const [poolQuery, setPoolQuery] = useState('');
  const realPool = useRealPool();
  // —— 剧情与政策 ——
  const [scenKey, setScenKey] = useState(HD_SCENARIOS[0]?.id);
  const [secondKey, setSecondKey] = useState('');
  const [intensity, setIntensity] = useState(55);
  const [alloc, setAlloc] = useState({ fiscal: 20, monetary: 15, industry: 20, diplomacy: 15, mobilize: 20 });
  // —— 回合与报告 ——
  const [rounds, setRounds] = useState([]);
  const [reportMd, setReportMd] = useState('');
  const [copied, setCopied] = useState(false);
  // —— 任期治理周期 v2：三表/年度/余波/成长/疲劳/届满 ——
  const [metrics, setMetrics] = useState(initialMetrics);          // 省态三表（任期内持续演化，不随 P0 滑杆重置）
  const [metricsStart, setMetricsStart] = useState(initialMetrics); // 任期起点快照（届满对账）
  const [prevMetrics, setPrevMetrics] = useState(initialMetrics);   // 上一年三表（Δ chips）
  const [year, setYear] = useState(1);                   // 任期第几年（1-TERM_YEARS）
  const [aftermath, setAftermath] = useState(null);      // 在途余波（null = 无）
  const [engagedAftermath, setEngagedAftermath] = useState(''); // 已装填「应对余波」的源剧情 id
  const [boost, setBoost] = useState({});                // 官员六维成长增量 {id:[6]}
  const [streaks, setStreaks] = useState({});            // 连续在岗年数 {id:n}（连任疲劳）
  const [termDone, setTermDone] = useState(false);       // 任期届满
  const [termReportMd, setTermReportMd] = useState('');  // 任期总结 Markdown
  const [termCopied, setTermCopied] = useState(false);

  const resourceObj = useMemo(() => RESOURCE_TYPES.find((r) => r.id === resource) || RESOURCE_TYPES[0], [resource]);
  // 当前生效候选池：real 模式取人才库政要池（加载中/为空时为 []），fiction 取原创虚构 14 人
  const basePool = useMemo(
    () => (poolMode === 'real' ? (realPool.pool || []) : OFFICIALS),
    [poolMode, realPool.pool]
  );
  // 叠加层：基础 dims + 成长 boost + 连任疲劳，夹在 [5,95]；fatigued 标记供班子行渲染
  const officialsLive = useMemo(
    () => basePool.map((o) => {
      const b = boost[o.id];
      const fat = fatiguePenalty(streaks[o.id] || 0);
      const dims = (o.dims || []).map((v, i) => Math.max(5, Math.min(95, v + (b?.[i] || 0) + fat)));
      return { ...o, dims, merit: merits[o.id] ?? o.merit, fatigued: fat < 0 };
    }),
    [basePool, merits, boost, streaks]
  );
  // 搜索范围（仅 real 模式生效；fiction 恒等于全量池）
  const filteredLive = useMemo(
    () => (poolMode === 'real' ? filterPool(officialsLive, poolQuery) : officialsLive),
    [poolMode, officialsLive, poolQuery]
  );
  // 切池：两池 id 不互通 → 清空 assign；merits 保留（同池回切后政绩档案仍在）
  const switchPool = (mode) => {
    if (mode === poolMode) return;
    setPoolMode(mode);
    setAssign(Object.fromEntries(POSTS.map((p) => [p.id, null])));
  };

  // 三产结构联动约束：改一根滑杆，剩余两根按原比例分摊（Σ 恒 = 100）
  const setIndustryAt = (idx, val) => {
    setIndustry((prev) => {
      const v = Math.max(0, Math.min(100, val));
      const rest = 100 - v;
      const others = [0, 1, 2].filter((i) => i !== idx);
      const osum = prev[others[0]] + prev[others[1]];
      const next = [...prev];
      next[idx] = v;
      if (osum <= 0) {
        next[others[0]] = Math.round(rest / 2);
      } else {
        next[others[0]] = Math.round(rest * prev[others[0]] / osum);
      }
      next[others[1]] = rest - next[others[0]];
      return next;
    });
  };

  // 政策预算约束 v2：Σ ≤ budgetCap（由金融财政三表折算，60-130）——
  // 引擎 relief 分母固定 100，cap<100 时缓解力自然缩水，无需改引擎
  const budgetCap = useMemo(() => yearBudget(metrics.fiscal), [metrics]);
  const setAllocAt = (id, val) => {
    setAlloc((prev) => {
      const others = TOOLS.reduce((s, t) => s + (t.id === id ? 0 : prev[t.id] || 0), 0);
      return { ...prev, [id]: Math.max(0, Math.min(val, budgetCap - others)) };
    });
  };
  const allocUsed = useMemo(() => TOOLS.reduce((s, t) => s + (alloc[t.id] || 0), 0), [alloc]);
  // 财政收缩导致 cap 下降时：超额配置等比缩回上限内（地板取整保证 Σ ≤ cap）
  useEffect(() => {
    setAlloc((prev) => {
      const used = TOOLS.reduce((s, t) => s + (prev[t.id] || 0), 0);
      if (used <= budgetCap) return prev;
      const k = budgetCap / used;
      const next = {};
      TOOLS.forEach((t) => { next[t.id] = Math.floor((prev[t.id] || 0) * k); });
      return next;
    });
  }, [budgetCap]);

  // —— 核心计算链：省情 → 班子 → 场景 → 引擎 ——
  const baselineMods = useMemo(
    () => computeBaseline({ pop, gdpPc, industry, resource, capital }),
    [pop, gdpPc, industry, resource, capital]
  );
  const team = useMemo(() => teamCompetence(assign, officialsLive), [assign, officialsLive]);
  const primary = useMemo(() => HD_SCENARIOS.find((s) => s.id === scenKey) || HD_SCENARIOS[0], [scenKey]);
  const secondary = useMemo(
    () => (secondKey && secondKey !== scenKey ? HD_SCENARIOS.find((s) => s.id === secondKey) : null),
    [secondKey, scenKey]
  );
  const activeScenario = useMemo(
    () => (secondary ? compositeScenario(primary, secondary) : primary),
    [primary, secondary]
  );
  const result = useMemo(
    () => hdEngine({ scenario: activeScenario, intensity, alloc, baselineMods, mult: team.mult }),
    [activeScenario, intensity, alloc, baselineMods, team]
  );
  const actIdx = Math.min(3, Math.floor(intensity / 25)); // 烈度 0-25-50-75-100 → 点亮到第几幕

  const emptyPosts = useMemo(() => POSTS.filter((p) => !assign[p.id]), [assign]);

  // 省情判读一句话
  const baselineRead = useMemo(() => {
    let hi = 0, lo = 0;
    baselineMods.forEach((v, i) => {
      if (v > baselineMods[hi]) hi = i;
      if (v < baselineMods[lo]) lo = i;
    });
    const sHi = baselineMods[hi] > 0 ? `+${baselineMods[hi]}` : `${baselineMods[hi]}`;
    return `第一受力面在「${HD_DOMAINS[hi]}」（修正 ${sHi}），最厚缓冲在「${HD_DOMAINS[lo]}」（${baselineMods[lo]}）——${resourceObj?.label || ''}的底色加上省会${capital}，决定了危机砸下来时的传导次序。`;
  }, [baselineMods, resourceObj, capital]);

  // 自动荐配：按岗位权重从高到低，贪心匹配 need×dims 最高且未被占用的官员
  // real 模式作用于搜索范围（filteredLive）——实质是「搜索范围内荐配」
  const autoAssign = () => {
    const taken = new Set();
    const next = {};
    [...POSTS].sort((a, b) => b.weight - a.weight).forEach((p) => {
      let best = null, bestS = -1;
      filteredLive.forEach((o) => {
        if (taken.has(o.id)) return;
        const s = matchScore(o.dims, p.need);
        if (s > bestS) { bestS = s; best = o.id; }
      });
      if (best) { taken.add(best); next[p.id] = best; }
    });
    setAssign(Object.fromEntries(POSTS.map((p) => [p.id, next[p.id] || null])));
  };

  // 应对小组：未入班子的官员按当前场景 need 匹配 Top4（real 模式同样跟随搜索范围）
  const reserves = useMemo(() => {
    const inCabinet = new Set(Object.values(assign).filter(Boolean));
    return filteredLive
      .filter((o) => !inCabinet.has(o.id))
      .map((o) => {
        let top = 0;
        o.dims.forEach((v, i) => { if (v > o.dims[top]) top = i; });
        return { ...o, match: matchScore(o.dims, activeScenario.need), topDim: top };
      })
      .sort((a, b) => b.match - a.match)
      .slice(0, 4);
  }, [assign, filteredLive, activeScenario]);

  // 任免/报告名册：fiction 全量；real 只列「登场过」的人（在班子里，或政绩档案有 ≠50 记录）
  const rosterLive = useMemo(() => {
    if (poolMode !== 'real') return officialsLive;
    const inCabinet = new Set(Object.values(assign).filter(Boolean));
    return officialsLive
      .filter((o) => inCabinet.has(o.id) || (merits[o.id] != null && merits[o.id] !== 50))
      .sort((a, b) => b.merit - a.merit);
  }, [poolMode, officialsLive, assign, merits]);

  // 执行年度推演：政绩写回 + 三表演化 + 在岗成长/疲劳 + 余波写入 + 年度推进
  const runRound = () => {
    if (termDone) return;
    const [chiefD, teamD] = meritDelta(result.score);
    setMerits((prev) => {
      const next = { ...prev };
      POSTS.forEach((p) => {
        const oid = assign[p.id];
        if (!oid) return;
        const d = (p.id === 'secretary' || p.id === 'governor') ? chiefD : teamD;
        next[oid] = Math.max(0, Math.min(100, (next[oid] ?? 50) + d));
      });
      return next;
    });
    // a. 三表演化（先存上一年，供省态运行台 Δ 展示）
    setPrevMetrics(metrics);
    const nextMetrics = evolveMetrics(metrics, result.net, allocUsed);
    setMetrics(nextMetrics);
    // b. 在岗成长：主官（书记/省长）top+2 second+1，其余班子 top+1——封顶由 officialsLive 的 clamp 兜底
    const [gTop, gSecond] = growthDims(activeScenario.need);
    setBoost((prev) => {
      const next = { ...prev };
      POSTS.forEach((p) => {
        const oid = assign[p.id];
        if (!oid) return;
        const arr = [...(next[oid] || [0, 0, 0, 0, 0, 0])];
        if (p.id === 'secretary' || p.id === 'governor') { arr[gTop] += 2; arr[gSecond] += 1; }
        else { arr[gTop] += 1; }
        next[oid] = arr;
      });
      return next;
    });
    // c. 连任疲劳：在岗者 +1 年，不在岗者清零
    setStreaks((prev) => {
      const next = {};
      Object.values(assign).filter(Boolean).forEach((oid) => { next[oid] = (prev[oid] || 0) + 1; });
      return next;
    });
    // d. 余波写入：治理失分留尾巴，下一年回头讨账
    setAftermath(aftermathOf(activeScenario, result.score, intensity));
    // 回合入账（year/fiscal 字段供年度曲线与任期结算；余波处置回合打标）
    const isAftermathRound = engagedAftermath && activeScenario.id === engagedAftermath;
    setEngagedAftermath('');
    setRounds((prev) => [...prev, {
      n: prev.length + 1, year,
      label: isAftermathRound ? `${activeScenario.label} · 余波处置` : activeScenario.label,
      intensity, score: result.score, verdict: result.verdict[0], color: result.verdict[1],
      fiscal: Math.round(nextMetrics.fiscal),
    }]);
    // e. 年度推进：第 TERM_YEARS 年执行完即届满，不再 +1
    if (year >= TERM_YEARS) setTermDone(true);
    else setYear(year + 1);
  };

  // 应对余波：把在途余波装填为当前剧情（清复合叠加 · 锁定余波烈度）
  const engageAftermath = () => {
    if (!aftermath) return;
    setScenKey(aftermath.sourceId);
    setIntensity(aftermath.intensity);
    setSecondKey('');
    setEngagedAftermath(aftermath.sourceId);
    setAftermath(null);
  };

  // 重开新任期：三表按「当前」省情重置——P0 变更在此刻才生效；政绩档案直接归 50
  const restartTerm = () => {
    const m0 = initMetrics(baselineMods);
    setMetrics(m0);
    setMetricsStart({ ...m0 });
    setPrevMetrics({ ...m0 });
    setYear(1); setRounds([]); setAftermath(null); setEngagedAftermath('');
    setBoost({}); setStreaks({}); setTermDone(false);
    setTermReportMd(''); setTermCopied(false);
    setMerits(Object.fromEntries(basePool.map((o) => [o.id, 50])));
  };

  // 任期届满考核：S/A/B/C 大徽章
  const grade = useMemo(() => (termDone && rounds.length ? termGrade(rounds) : null), [termDone, rounds]);

  // 任期总结：在任名册 + 三表起止 + 余波处置次数 → Markdown
  const genTermReport = () => {
    try {
      const roster = POSTS.map((p) => {
        const oid = assign[p.id];
        const o = oid ? officialsLive.find((x) => x.id === oid) : null;
        return o ? { name: o.name, postLabel: p.label, merit: o.merit, judge: promotionJudge(o.merit), real: !!o.real } : null;
      }).filter(Boolean);
      const aftermathCount = rounds.filter((r) => (r.label || '').includes('余波')).length;
      let md = buildTermReport({
        startYear: 2026, history: rounds, metricsStart, metricsEnd: metrics,
        grade: termGrade(rounds), roster, aftermathCount,
      });
      if (poolMode === 'real') md += '\n\n*' + REAL_POOL_NOTE + '*';
      setTermReportMd(md);
    } catch (e) {
      setTermReportMd(`# 任期总结生成异常\n\n${String(e)}`);
    }
    setTermCopied(false);
  };
  const copyTermReport = () => {
    navigator.clipboard?.writeText(termReportMd).then(() => {
      setTermCopied(true);
      setTimeout(() => setTermCopied(false), 1600);
    });
  };

  const genReport = () => {
    try {
      let md = hdReport({
        scenario: activeScenario, intensity,
        cfg: { pop, gdpPc, industry, resource, capital },
        assign, alloc, officials: rosterLive, result,
      });
      if (poolMode === 'real') md += '\n\n*' + REAL_POOL_NOTE + '*';
      setReportMd(md);
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

  // —— 图表 option（轴色统一 #27324a / #93a1b5 / rgba(148,163,184,0.1)） ——
  const baselineOption = useMemo(() => ({
    grid: { left: 70, right: 42, top: 8, bottom: 22 },
    xAxis: {
      type: 'value', min: -15, max: 15,
      axisLine: { lineStyle: { color: AX.line } }, axisLabel: { color: AX.text },
      splitLine: { lineStyle: { color: AX.split } },
    },
    yAxis: {
      type: 'category', data: HD_DOMAINS,
      axisLine: { lineStyle: { color: AX.line } }, axisLabel: { color: AX.text },
    },
    series: [{
      type: 'bar', barWidth: 10,
      data: baselineMods.map((v) => ({ value: v, itemStyle: { color: v > 0 ? '#c41e3a' : '#10b981', borderRadius: 2 } })),
      label: { show: true, position: 'right', color: AX.text, formatter: ({ value }) => (value > 0 ? `+${value}` : `${value}`) },
    }],
  }), [baselineMods]);

  const teamRadarOption = useMemo(() => ({
    radar: {
      indicator: HD_DOMAINS.map((n) => ({ name: n, max: 100 })),
      axisName: { color: AX.text },
      axisLine: { lineStyle: { color: AX.line } },
      splitLine: { lineStyle: { color: AX.split } },
      splitArea: { show: false },
    },
    series: [{
      type: 'radar',
      data: [{
        value: team.dims, name: '班子合成',
        lineStyle: { color: '#e8a317', width: 2 },
        areaStyle: { color: 'rgba(232,163,23,0.16)' },
        itemStyle: { color: '#e8a317' },
      }],
    }],
  }), [team]);

  const impactOption = useMemo(() => ({
    legend: { data: ['应对前', '应对后'], textStyle: { color: AX.text }, top: 0 },
    grid: { left: 40, right: 14, top: 32, bottom: 24 },
    xAxis: {
      type: 'category', data: HD_DOMAINS,
      axisLine: { lineStyle: { color: AX.line } }, axisLabel: { color: AX.text, fontSize: 10, interval: 0 },
    },
    yAxis: {
      type: 'value', max: 100,
      axisLabel: { color: AX.text }, splitLine: { lineStyle: { color: AX.split } },
    },
    series: [
      { name: '应对前', type: 'bar', data: result.raw, barWidth: 11, itemStyle: { color: '#c41e3a', borderRadius: 2 } },
      { name: '应对后', type: 'bar', data: result.net, barWidth: 11, itemStyle: { color: '#22d3ee', borderRadius: 2 } },
    ],
  }), [result]);

  // 年度曲线：净冲击（红实线 + 30/60 阈值虚线）vs 财政余力（金虚线）
  const termCurveOption = useMemo(() => ({
    legend: { data: ['净冲击', '财政余力'], textStyle: { color: AX.text }, top: 0 },
    grid: { left: 40, right: 16, top: 30, bottom: 24 },
    xAxis: {
      type: 'category', data: rounds.map((r) => `第${r.year ?? r.n}年`),
      axisLine: { lineStyle: { color: AX.line } }, axisLabel: { color: AX.text },
    },
    yAxis: {
      type: 'value', min: 0, max: 100,
      axisLine: { lineStyle: { color: AX.line } }, axisLabel: { color: AX.text },
      splitLine: { lineStyle: { color: AX.split } },
    },
    series: [
      {
        name: '净冲击', type: 'line', data: rounds.map((r) => r.score),
        lineStyle: { color: '#c41e3a', width: 2 }, itemStyle: { color: '#c41e3a' }, symbolSize: 7,
        markLine: {
          silent: true, symbol: 'none',
          lineStyle: { type: 'dashed', color: '#64748b' },
          label: { color: AX.text, fontSize: 10, formatter: '{c}' },
          data: [{ yAxis: 30 }, { yAxis: 60 }],
        },
      },
      {
        name: '财政余力', type: 'line', data: rounds.map((r) => r.fiscal ?? null),
        lineStyle: { color: '#e8a317', width: 2, type: 'dashed' }, itemStyle: { color: '#e8a317' }, symbolSize: 6,
      },
    ],
  }), [rounds]);

  return (
    <div>
      {/* 0 —— 页头与虚构声明 */}
      <PageHeader
        badge="Simulation · 汉东省治理沙盘（虚构）"
        title="汉东省 · 全要素治理沙盒"
        subtitle="配置一个省 → 组一套班子 → 年复一年扛危机 → 省态三表持续演化 → 五年任期届满大考与换届结算"
      />
      <IntroCard>
        <strong style={{ color: 'var(--text-primary)' }}>虚构声明：</strong>汉东省及其下辖京州、吕州、林城均为虚构地名，十四名官员与六段剧情均为原创虚构，致敬经典政治叙事，与任何真实地区、机构、人物无关。本页把治国沙盒的四件套——省情参数、班子乘数、危机引擎、政策预算——装进同一个可配置省份，跑通「配置省情 → 组班子 → 年度危机 → 省态演化 → 五年大考」的任期治理周期：回合即年度，省态三表逐年演化、财政约束政策弹药、治理失分留余波、官员在岗成长亦会连任疲劳；你拧的每一根滑杆都是国情，你放的每一个人都是变量，五年届满交卷换届。班子可选接入人才库真实政要（仅公开履历生成的算法画像）；即便选用真实人物，全部推演、政绩与任免仍为虚构游戏机制。
      </IntroCard>
      <Grid cols={4} className="mb-8">
        <Stat value={HD_AS_OF} label="推演基准日" accent="#22d3ee" />
        <Stat
          value={poolMode === 'real' ? `${realPool.count ?? basePool.length} 人` : `${OFFICIALS.length} 人`}
          label={poolMode === 'real' ? '真实政要库（公开履历画像）' : '原创虚构官员库'}
          accent="#e8a317"
        />
        <Stat value={`${HD_SCENARIOS.length} 段`} label="剧情情景（可叠加）" accent="#c41e3a" />
        <Stat
          value={termDone ? '任期届满' : `第 ${year}/${TERM_YEARS} 年`}
          label={`任期进度 · 已推演 ${rounds.length} 年`}
          accent="#10b981"
        />
      </Grid>

      {/* 1 —— 省情配置器 P0 */}
      <Card title="① 省情配置器 · 配置即国情">
        <div className="grid gap-6" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))' }}>
          <div>
            <RangeRow label="常住人口（万）" value={pop} min={3000} max={12000} step={100} unit=" 万" accent="#22d3ee" onChange={setPop} />
            <RangeRow label="人均 GDP（万元）" value={gdpPc} min={4} max={16} step={0.5} unit=" 万" accent="#e8a317" onChange={setGdpPc} />
            <div className="text-xs mb-1" style={{ color: 'var(--text-secondary)' }}>三产结构（联动约束 Σ=100）</div>
            {['一产 · 农业', '二产 · 工业', '三产 · 服务业'].map((lab, i) => (
              <RangeRow
                key={lab} label={lab} value={industry[i]} min={0} max={100} unit="%"
                accent={['#10b981', '#8b5cf6', '#22d3ee'][i]}
                onChange={(v) => setIndustryAt(i, v)}
              />
            ))}
            <div className="text-xs mb-2 mt-3" style={{ color: 'var(--text-secondary)' }}>资源禀赋（决定六域受力修正）</div>
            <SelectorBar
              items={RESOURCE_TYPES} activeKey={resource} onSelect={setResource}
              getKey={(i) => i.id} getLabel={(i) => i.label} getAccent={() => '#e8a317'}
            />
            {resourceObj?.desc && (
              <p className="text-[11px] -mt-2 mb-3" style={{ color: 'var(--text-tertiary)' }}>{resourceObj.desc}</p>
            )}
            <div className="text-xs mb-2" style={{ color: 'var(--text-secondary)' }}>省会（行政中枢所在）</div>
            <SelectorBar
              items={CAPITALS.map((c) => ({ key: c, label: c }))} activeKey={capital} onSelect={setCapital}
              getAccent={() => '#c41e3a'}
            />
          </div>
          <div>
            <div className="text-xs mb-2 mono" style={{ color: 'var(--text-tertiary)' }}>
              六域脆弱度修正（正红=更脆弱 · 负绿=更抗压）
            </div>
            <EChart option={baselineOption} style={{ height: 220 }} />
            <p className="text-xs leading-relaxed mt-3 p-3 rounded" style={{ color: 'var(--text-secondary)', background: 'var(--bg-elevated)' }}>
              {baselineRead}
            </p>
            <p className="text-[10px] mono mt-2" style={{ color: 'var(--text-tertiary)' }}>
              六域口径：{CRISIS_DOMAINS.map((d, i) => `${d}→${HD_DOMAINS[i]}`).join(' · ')}
            </p>
          </div>
        </div>
      </Card>

      {/* 1.5 —— 省态运行台（任期治理周期 v2：三表持续演化 · 财政决定弹药） */}
      <Card title="①.5 省态运行台 · 三表演化与财政弹药">
        <div className="grid gap-6" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))' }}>
          <div>
            <div className="flex items-baseline gap-3 flex-wrap">
              <span className="mono text-xl font-bold" style={{ color: '#22d3ee' }}>任期第 {year}/{TERM_YEARS} 年</span>
              <span className="mono text-xs" style={{ color: 'var(--text-tertiary)' }}>{2025 + year} 年度</span>
              {termDone && (
                <span className="text-[10px] mono px-2 py-0.5 rounded" style={{ background: 'rgba(196,30,58,0.16)', color: '#c41e3a' }}>
                  任期已届满 · 待换届结算
                </span>
              )}
            </div>
            <div className="mt-4">
              <div className="text-xs mb-1" style={{ color: 'var(--text-secondary)' }}>本年度政策预算上限（由金融财政余力折算）</div>
              <div className="mono font-bold" style={{ fontSize: 38, lineHeight: 1.1, color: budgetCap < 100 ? '#e8a317' : '#10b981' }}>
                {budgetCap}<span className="text-sm font-normal ml-1" style={{ color: 'var(--text-tertiary)' }}>点</span>
              </div>
              {budgetCap < 100 && (
                <p className="text-[11px] mono mt-1" style={{ color: '#e8a317' }}>
                  ⚠ 财政余力不足，弹药缩水——同样的危机，今年能摆上桌的政策更少。
                </p>
              )}
            </div>
            <div className="flex items-center gap-2 flex-wrap mt-4">
              <button type="button" style={BTN} onClick={restartTerm}>↻ 重开新任期</button>
              <span className="text-[10px] flex-1" style={{ color: 'var(--text-tertiary)', minWidth: 180 }}>
                P0 省情变更只对新任期生效；重开将按当前省情重置三表与年度，政绩档案全员归 50。
              </span>
            </div>
          </div>
          <div>
            <div className="text-xs mb-3 mono" style={{ color: 'var(--text-tertiary)' }}>省态三表（年度演化 · Δ 与上一年比）</div>
            {METRICS.map((m) => {
              const v = metrics[m.id] ?? 0;
              const d = +(v - (prevMetrics[m.id] ?? v)).toFixed(1);
              return (
                <div key={m.id} className="mb-3">
                  <div className="flex justify-between items-baseline text-xs mb-1 gap-2">
                    <span style={{ color: 'var(--text-secondary)' }}>
                      {m.label}
                      <span className="text-[10px] ml-1.5" style={{ color: 'var(--text-tertiary)' }}>{m.desc}</span>
                    </span>
                    <span className="mono font-semibold shrink-0" style={{ color: m.color }}>
                      {Math.round(v)}
                      <span
                        className="text-[10px] px-1.5 py-0.5 rounded ml-1.5"
                        style={{
                          background: d > 0 ? 'rgba(16,185,129,0.14)' : d < 0 ? 'rgba(196,30,58,0.14)' : 'var(--bg-elevated)',
                          color: d > 0 ? '#10b981' : d < 0 ? '#c41e3a' : 'var(--text-tertiary)',
                        }}
                      >{d > 0 ? `▲+${d}` : d < 0 ? `▼${d}` : '—'}</span>
                    </span>
                  </div>
                  <div className="h-2.5 rounded overflow-hidden" style={{ background: 'var(--bg-elevated)' }}>
                    <div style={{ width: `${Math.max(0, Math.min(100, v))}%`, height: '100%', background: m.color, transition: 'width .4s' }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </Card>

      {/* 2 —— 班子组建 */}
      <Card title="② 班子组建 · 人是变量">
        <div className="mb-4">
          <div className="flex items-center gap-2 flex-wrap">
            <button
              type="button"
              onClick={() => switchPool('fiction')}
              style={poolMode === 'fiction' ? { ...BTN_CYAN, borderRadius: 999 } : { ...BTN, borderRadius: 999 }}
            >虚构官员库 ×{OFFICIALS.length}</button>
            <button
              type="button"
              disabled={realPool.loading}
              onClick={() => switchPool('real')}
              style={{
                ...(poolMode === 'real' ? BTN_CYAN : BTN), borderRadius: 999,
                opacity: realPool.loading ? 0.5 : 1, cursor: realPool.loading ? 'not-allowed' : 'pointer',
              }}
            >{realPool.loading ? '真实政要库 · 载入中…' : `真实政要库 ×${realPool.count}（公开履历画像）`}</button>
            {poolMode === 'real' && (
              <input
                value={poolQuery}
                onChange={(e) => setPoolQuery(e.target.value)}
                placeholder="搜索姓名 / 省份 / 职务 / 标签…"
                className="os-input text-xs flex-1"
                style={{ minWidth: 180, maxWidth: 320 }}
              />
            )}
          </div>
          {poolMode === 'real' && (
            <p className="text-[11px] mt-2" style={{ color: 'var(--text-tertiary)' }}>{REAL_POOL_NOTE}</p>
          )}
          {poolMode === 'real' && !realPool.loading && basePool.length === 0 && (
            <p className="text-xs mono mt-2" style={{ color: '#e8a317' }}>
              人才库政要队列为空——请先到 人才库 或 数据与系统底座 载入政要数据
            </p>
          )}
        </div>
        <div className="grid gap-6" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))' }}>
          <div>
            <div className="flex gap-2 mb-3">
              <button type="button" style={BTN_CYAN} onClick={autoAssign}>自动荐配（need×dims 贪心）</button>
              <button type="button" style={BTN} onClick={() => setAssign(Object.fromEntries(POSTS.map((p) => [p.id, null])))}>清空</button>
            </div>
            {POSTS.map((p) => {
              const oid = assign[p.id];
              const o = oid ? officialsLive.find((x) => x.id === oid) : null;
              // real 池上千人不全量塞 select：每岗只列搜索范围内 need 匹配 Top30（排除他岗已占，不排自己当前值）
              let options;
              if (poolMode === 'real') {
                const taken = new Set(POSTS.filter((pp) => pp.id !== p.id).map((pp) => assign[pp.id]).filter(Boolean));
                options = topMatches(filteredLive, p.need, taken, 30);
                if (oid && o && !options.some((x) => x.id === oid)) {
                  options = [{ ...o, match: matchScore(o.dims, p.need) }, ...options];
                }
              } else {
                options = officialsLive;
              }
              return (
                <div key={p.id} className="flex items-center gap-2 mb-2 flex-wrap">
                  <span className="text-xs mono shrink-0" style={{ color: 'var(--text-secondary)', width: 84 }}>
                    {p.label}<span style={{ color: 'var(--text-tertiary)' }}> ·{Math.round(p.weight * 100)}%</span>
                  </span>
                  <select
                    value={oid || ''}
                    onChange={(e) => setAssign((prev) => ({ ...prev, [p.id]: e.target.value || null }))}
                    className="text-xs rounded px-2 py-1 flex-1"
                    style={{ background: 'var(--bg-base)', border: '1px solid var(--border-subtle)', color: 'var(--text-primary)', minWidth: 120 }}
                  >
                    <option value="">— 空缺 —</option>
                    {options.map((cand) => {
                      const usedBy = POSTS.find((pp) => pp.id !== p.id && assign[pp.id] === cand.id);
                      return (
                        <option key={cand.id} value={cand.id} disabled={!!usedBy}>
                          {poolMode === 'real'
                            ? `${cand.name} · ${cand.archetype} · 匹配${cand.match}`
                            : `${cand.name}${usedBy ? `（已任${usedBy.label}）` : ''}`}
                        </option>
                      );
                    })}
                  </select>
                  <span className="text-[11px] mono shrink-0" style={{ color: o ? 'var(--text-tertiary)' : 'var(--text-tertiary)', width: 150 }}>
                    {o ? `${o.archetype} · ${o.age}岁 · 绩${o.merit}` : '待配置'}
                  </span>
                  {o?.real && <RealBadge />}
                  {o?.fatigued && (
                    <span
                      className="text-[10px] mono px-1.5 py-0.5 rounded-full shrink-0"
                      style={{ background: 'rgba(196,30,58,0.14)', color: '#c41e3a' }}
                    >疲劳 {streaks[o.id] || 0}年</span>
                  )}
                </div>
              );
            })}
            {emptyPosts.length > 0 && (
              <p className="text-[11px] mono mt-2" style={{ color: '#e8a317' }}>
                ⚠ 空岗 {emptyPosts.length}：{emptyPosts.map((p) => p.label).join('、')} —— 空岗按 40 分计，直接拖低全域乘数。
              </p>
            )}
          </div>
          <div>
            <EChart option={teamRadarOption} style={{ height: 230 }} />
            <div className="flex flex-wrap gap-1.5 mt-2">
              {team.mult.map((m, i) => (
                <span
                  key={HD_DOMAINS[i]} className="text-[10px] mono px-2 py-0.5 rounded"
                  style={{
                    background: m > 1 ? 'rgba(16,185,129,0.14)' : m < 1 ? 'rgba(196,30,58,0.14)' : 'var(--bg-elevated)',
                    color: m > 1 ? '#10b981' : m < 1 ? '#c41e3a' : 'var(--text-tertiary)',
                  }}
                >
                  {HD_DOMAINS[i]} ×{m.toFixed(2)}
                </span>
              ))}
            </div>
            <p className="text-[11px] mt-2" style={{ color: 'var(--text-tertiary)' }}>
              班子乘数 0.70—1.27：同样的政策资源，经过不同班子之手，对各域的实际缓解效力可以差近一倍。
            </p>
          </div>
        </div>
      </Card>

      {/* 3 —— 剧情场景 */}
      <Card title="③ 剧情场景 · 四幕推演">
        {aftermath && (
          <div
            className="flex items-center gap-3 flex-wrap text-xs p-3 rounded mb-3"
            style={{ border: '1px solid rgba(196,30,58,0.45)', background: 'rgba(196,30,58,0.07)' }}
          >
            <span className="flex-1 leading-relaxed" style={{ color: '#c41e3a', minWidth: 220 }}>
              ⚠ 余波在途：{aftermath.label}（烈度 {aftermath.intensity}）—— {aftermath.note}
            </span>
            <button type="button" style={BTN_RED} onClick={engageAftermath}>应对余波</button>
          </div>
        )}
        <SelectorBar
          items={HD_SCENARIOS} activeKey={scenKey}
          onSelect={(k) => { setScenKey(k); if (k === secondKey) setSecondKey(''); }}
          getKey={(i) => i.id} getLabel={(i) => i.label} getAccent={(i) => i.color}
        />
        <p className="text-xs leading-relaxed mb-3" style={{ color: 'var(--text-secondary)' }}>{activeScenario.intro}</p>
        <RangeRow label="冲击烈度" value={intensity} min={0} max={100} accent={primary.color || '#c41e3a'} onChange={setIntensity} />
        <div className="flex items-center flex-wrap gap-1.5 mb-4">
          <span className="text-[11px] mono mr-1" style={{ color: 'var(--text-tertiary)' }}>复合叠加（相加×0.72 截顶 · 工具效力×0.85）：</span>
          <button
            type="button" onClick={() => setSecondKey('')}
            style={secondKey === '' ? BTN_CYAN : BTN}
          >无叠加</button>
          {HD_SCENARIOS.filter((s) => s.id !== scenKey).map((s) => (
            <button
              key={s.id} type="button"
              onClick={() => setSecondKey(secondKey === s.id ? '' : s.id)}
              style={secondKey === s.id ? { ...BTN, background: `${s.color}22`, border: `1px solid ${s.color}66`, color: s.color, fontWeight: 600 } : BTN}
            >{s.label}</button>
          ))}
        </div>
        <div className="grid gap-3" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))' }}>
          {primary.acts.map((text, i) => {
            const lit = i <= actIdx;
            return (
              <div
                key={i} className="rounded p-3"
                style={{
                  background: 'var(--bg-elevated)',
                  border: lit ? `1px solid ${primary.color}88` : '1px solid var(--border-subtle)',
                  borderTop: lit ? `3px solid ${primary.color}` : '3px solid var(--border-subtle)',
                  opacity: lit ? 1 : 0.55,
                }}
              >
                <div className="text-[10px] mono mb-1" style={{ color: lit ? primary.color : 'var(--text-tertiary)' }}>
                  第{ACT_CN[i]}幕 · {ACT_NAMES[i]}{i === actIdx ? '　◀ 当前烈度' : ''}
                </div>
                <p className="text-[11px] leading-relaxed" style={{ color: lit ? 'var(--text-secondary)' : 'var(--text-tertiary)' }}>{text}</p>
              </div>
            );
          })}
        </div>
        <div className="flex flex-wrap gap-1.5 mt-3">
          {(activeScenario.watch || []).map((w) => (
            <span key={w} className="text-[10px] mono px-2 py-0.5 rounded" style={{ background: 'var(--bg-elevated)', color: '#22d3ee' }}>
              先行指标 · {w}
            </span>
          ))}
          {secondary && (
            <span className="text-[10px] mono px-2 py-0.5 rounded" style={{ background: 'rgba(239,68,68,0.14)', color: '#ef4444' }}>
              复合中 · 四幕时间线按主剧情《{primary.label}》展示
            </span>
          )}
        </div>
      </Card>

      {/* 4 —— 政策资源配置器 */}
      <Card title={`④ 政策资源配置器 · 五件工具 Σ≤${budgetCap}`}>
        <div className="grid gap-6" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))' }}>
          <div>
            <div className="flex justify-between items-center text-xs mb-1">
              <span style={{ color: 'var(--text-secondary)' }}>政策资源池（上限随财政余力逐年浮动）</span>
              <span className="flex items-center gap-2">
                <span className="mono" style={{ color: allocUsed >= budgetCap ? '#e8a317' : 'var(--text-tertiary)' }}>
                  已投 {allocUsed} / {budgetCap} 点 · 余 {budgetCap - allocUsed}
                </span>
                <button
                  style={{ ...BTN, padding: '2px 8px', fontSize: 11 }}
                  onClick={() => setAlloc(Object.fromEntries(TOOLS.map((t) => [t.id, 0])))}
                >清零</button>
              </span>
            </div>
            {budgetCap < 100 ? (
              <p className="text-[10px] mono mb-3" style={{ color: '#e8a317' }}>⚠ 财政余力不足，弹药缩水——缓解力分母仍按 100 计，预算不满额即天然减效。</p>
            ) : (
              <div className="mb-3" />
            )}
            {TOOLS.map((t) => (
              <div key={t.id} className="mb-3">
                <div className="flex justify-between items-baseline text-xs mb-1">
                  <span style={{ color: 'var(--text-secondary)' }}>
                    {TOOL_HD[t.id]}
                    <span className="text-[10px] mono ml-1.5" style={{ color: 'var(--text-tertiary)' }}>← {t.label}</span>
                  </span>
                  <span className="mono font-semibold" style={{ color: t.color }}>{alloc[t.id] || 0} 点</span>
                </div>
                <input
                  type="range" min={0} max={budgetCap} value={alloc[t.id] || 0}
                  onChange={(e) => setAllocAt(t.id, Number(e.target.value))}
                  className="w-full" style={{ accentColor: t.color }}
                />
              </div>
            ))}
          </div>
          <div>
            <EChart option={impactOption} style={{ height: 240 }} />
            <div className="flex items-center gap-3 mt-3 flex-wrap">
              <span
                className="text-xs mono font-bold px-3 py-1 rounded"
                style={{ background: `${result.verdict[1]}1f`, color: result.verdict[1], border: `1px solid ${result.verdict[1]}55` }}
              >
                综合净冲击 {result.score} · {result.verdict[0]}
              </span>
              <span className="text-[11px] flex-1" style={{ color: 'var(--text-tertiary)', minWidth: 180 }}>{result.verdict[2]}</span>
            </div>
          </div>
        </div>
      </Card>

      {/* 5 —— 应对小组（自动） */}
      <Card title="⑤ 应对小组 · 在野官员自动匹配 Top4">
        <Grid cols={4}>
          {reserves.map((o) => (
            <div key={o.id} className="os-card p-3" style={{ background: 'var(--bg-elevated)', borderTop: `2px solid ${o.color || '#22d3ee'}` }}>
              <div className="flex items-baseline justify-between">
                <span className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>{o.name}</span>
                <span className="text-[10px] mono" style={{ color: '#10b981' }}>匹配 {o.match}</span>
              </div>
              <div className="text-[11px] mt-0.5" style={{ color: 'var(--text-tertiary)' }}>{o.archetype} · {o.age}岁</div>
              {o.real && (
                <div className="flex items-center gap-1 mt-1 flex-wrap">
                  <RealBadge />
                  {(o.tags || []).map((t) => (
                    <span key={t} className="text-[10px] mono px-1.5 py-0.5 rounded" style={{ background: 'var(--bg-base)', color: '#22d3ee' }}>{t}</span>
                  ))}
                </div>
              )}
              {o.real && o.bio && (
                <p className="text-[10px] mt-1 leading-snug" style={{ color: 'var(--text-tertiary)', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{o.bio}</p>
              )}
              <div className="text-[10px] mono mt-1.5" style={{ color: '#e8a317' }}>
                最强维 {HD_DOMAINS[o.topDim]} {o.dims[o.topDim]}
              </div>
            </div>
          ))}
        </Grid>
        <p className="text-[11px] mt-3" style={{ color: 'var(--text-tertiary)' }}>
          按当前场景的六域应对需求，对未入班子的官员加权匹配——临时工作组不占岗位编制，但提示了下一轮任免的方向。
        </p>
      </Card>

      {/* 6 —— 执行推演回合（年度制） */}
      <Card title={(
        <>⑥ 执行推演回合 · 政绩写回 <span className="text-[11px] font-normal" style={{ color: 'var(--text-tertiary)' }}>年度推演 · 省态演化 · 余波传导</span></>
      )}>
        <div className="flex items-center gap-3 flex-wrap mb-3">
          <button
            type="button"
            disabled={termDone}
            style={{
              ...BTN_RED, padding: '8px 20px', fontSize: 13,
              opacity: termDone ? 0.5 : 1, cursor: termDone ? 'not-allowed' : 'pointer',
            }}
            onClick={runRound}
          >
            {termDone ? '任期已届满 · 请换届结算' : `▶ 执行推演（任期第 ${year} 年）`}
          </button>
          <span className="text-[11px]" style={{ color: 'var(--text-tertiary)' }}>
            当前手牌：{activeScenario.label} · 烈度 {intensity} · 预计净冲击 {result.score}（{result.verdict[0]}）
            —— 回合即年度：执行后三表演化、在岗者成长且疲劳累积、治理失分留余波；主官吃主官Δ，其余班子吃班子Δ。
          </span>
        </div>
        {rounds.length >= 2 && (
          <div className="mb-3">
            <EChart option={termCurveOption} style={{ height: 200 }} />
          </div>
        )}
        {rounds.length === 0 ? (
          <p className="text-xs mono" style={{ color: 'var(--text-tertiary)' }}>// 尚无推演历史——配好班子与政策后按下执行，年度开始走表，政绩开始记账。</p>
        ) : (
          <div className="space-y-1.5">
            {[...rounds].reverse().map((r) => (
              <div key={r.n} className="flex items-center gap-3 text-xs py-1.5 px-2 rounded" style={{ background: 'var(--bg-elevated)' }}>
                <span className="mono shrink-0" style={{ color: 'var(--text-tertiary)' }}>第 {r.year ?? r.n} 年</span>
                <span className="flex-1" style={{ color: 'var(--text-secondary)' }}>{r.label}</span>
                <span className="mono shrink-0" style={{ color: 'var(--text-tertiary)' }}>烈度 {r.intensity}</span>
                <span className="mono shrink-0" style={{ color: r.color }}>净冲击 {r.score}</span>
                <span className="text-[10px] mono px-2 py-0.5 rounded shrink-0" style={{ background: `${r.color}1f`, color: r.color }}>{r.verdict}</span>
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* 6.5 —— 任期届满结算（五年大考与换届） */}
      {termDone && grade && (
        <Card title="⑥.5 任期届满结算 · 五年大考与换届">
          <div className="flex items-center gap-5 flex-wrap mb-4">
            <div
              className="flex items-center justify-center rounded shrink-0"
              style={{ width: 84, height: 84, border: `2px solid ${grade.color}`, background: `${grade.color}14` }}
            >
              <span className="mono font-bold" style={{ fontSize: 44, color: grade.color }}>{grade.grade}</span>
            </div>
            <div className="flex-1" style={{ minWidth: 220 }}>
              <div className="text-base font-bold" style={{ color: grade.color }}>{grade.title}</div>
              <p className="text-xs leading-relaxed mt-1" style={{ color: 'var(--text-secondary)' }}>{grade.note}</p>
              <p className="text-[11px] mono mt-2" style={{ color: 'var(--text-tertiary)' }}>
                五年净冲击/财政余力曲线见上方年度曲线 · 余波处置 {rounds.filter((r) => (r.label || '').includes('余波')).length} 次
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <button type="button" style={BTN_CYAN} onClick={genTermReport}>📄 生成任期总结</button>
            {termReportMd && (
              <button type="button" style={termCopied ? { ...BTN, color: '#10b981' } : BTN} onClick={copyTermReport}>
                {termCopied ? '已复制 ✓' : '复制 Markdown'}
              </button>
            )}
            <button type="button" style={BTN_RED} onClick={restartTerm}>↻ 重开新任期（按当前省情重置三表 · 政绩归 50）</button>
          </div>
          {termReportMd && (
            <pre
              className="text-[11px] leading-relaxed p-4 rounded mt-3 mono overflow-auto"
              style={{
                background: 'var(--bg-base)', border: '1px solid var(--border-subtle)',
                color: 'var(--text-secondary)', maxHeight: 420, whiteSpace: 'pre-wrap',
              }}
            >{termReportMd}</pre>
          )}
        </Card>
      )}

      {/* 7 —— 任免面板 */}
      <Card title={poolMode === 'real' ? (
        <>⑦ 任免面板 · 政绩档案与组织判定 <span className="text-[11px] font-normal" style={{ color: 'var(--text-tertiary)' }}>（虚构推演机制 · 非真实人事评价）</span></>
      ) : '⑦ 任免面板 · 政绩档案与组织判定'}>
        <div className="mb-4">
          {poolMode === 'real' && rosterLive.length === 0 && (
            <p className="text-xs mono" style={{ color: 'var(--text-tertiary)' }}>
              // 尚无真实政要登场——组建班子并执行推演后，此处生成沙盘政绩档案
            </p>
          )}
          {rosterLive.map((o) => {
            const post = POSTS.find((p) => assign[p.id] === o.id);
            const judge = promotionJudge(o.merit);
            const grown = (boost[o.id] || []).reduce((a, b) => a + b, 0);
            return (
              <div key={o.id} className="flex items-center gap-3 py-2 flex-wrap" style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                <span className="text-sm font-semibold shrink-0" style={{ color: 'var(--text-primary)', width: 64 }}>{o.name}</span>
                <span className="text-[11px] mono shrink-0" style={{ color: post ? '#22d3ee' : 'var(--text-tertiary)', width: 90 }}>
                  {post ? post.label : '在野'}
                </span>
                {o.real && <RealBadge />}
                <div className="h-2 rounded overflow-hidden shrink-0" style={{ background: 'var(--bg-base)', width: 120 }}>
                  <div style={{ width: `${o.merit}%`, height: '100%', background: judge[1], transition: 'width .3s' }} />
                </div>
                <span className="mono text-xs shrink-0 text-right" style={{ color: judge[1], width: 28 }}>{o.merit}</span>
                <span className="text-[10px] mono px-2 py-0.5 rounded shrink-0 text-center" style={{ background: `${judge[1]}1f`, color: judge[1], width: 56 }}>
                  {judge[0]}
                </span>
                <span className="text-[11px] flex-1" style={{ color: 'var(--text-tertiary)', minWidth: 200 }}>
                  {adviceFor(judge, post?.id)}
                </span>
                {grown > 0 && (
                  <span className="text-[10px] mono shrink-0" style={{ color: '#10b981' }}>成长 +{grown}</span>
                )}
              </div>
            );
          })}
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <button type="button" style={BTN_CYAN} onClick={genReport}>📄 报告生成（含任免建议全量）</button>
          {reportMd && (
            <button type="button" style={copied ? { ...BTN, color: '#10b981' } : BTN} onClick={copyReport}>
              {copied ? '已复制 ✓' : '复制 Markdown'}
            </button>
          )}
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

      {/* 8 —— 框架三卡 + 页脚 */}
      <FrameworkTrio cards={[
        {
          title: '全要素沙盘', subtitle: '配置即国情', accent: 'var(--fire-gold)', border: 'var(--fire-gold)',
          body: '人口、人均产出、三产结构、资源禀赋、省会——五个旋钮拧出一张六域脆弱度曲面。同一场危机砸在能源大省和沿海开放省身上，第一受力面完全不同。',
          pillars: [['参数', '滑杆即国情变量。'], ['修正', '六域脆弱度实时算。'], ['底色', '禀赋决定受力面。']],
        },
        {
          title: '班子乘数', subtitle: '人是变量', accent: 'var(--cyber-cyan)', border: 'var(--cyber-cyan)',
          body: '六岗按权重合成班子六维，再折算成 0.70—1.27 的缓解乘数：同样一百点政策资源，经过不同班子之手，落地效力可以差近一倍——空岗按 40 分计，是最贵的奢侈。',
          pillars: [['六岗', '权重加权合成。'], ['乘数', '0.70—1.27 区间。'], ['空岗', '全域效力惩罚。']],
        },
        {
          title: '政绩闭环', subtitle: '推演-考核-任免', accent: 'var(--china-red)', border: 'var(--china-red)',
          body: '每执行一回合，净冲击得分按 meritDelta 写回官员政绩档案；政绩穿过阈值即触发拟提拔/留任/诫勉/调整四档判定——治理被压缩成一个可重复、可复盘的游戏循环。',
          pillars: [['推演', '场景×烈度×配置。'], ['考核', '得分写回档案。'], ['任免', '四档判定出口。']],
        },
      ]} />
      <ModuleFooter
        moduleId="handong"
        disclaimer="虚构省份推演，致敬经典政治叙事，与任何真实地区/人物无关"
      />
    </div>
  );
}
