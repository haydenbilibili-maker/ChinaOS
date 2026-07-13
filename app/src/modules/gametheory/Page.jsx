import React, { useState, useMemo } from 'react';
import { PageHeader, Card, Grid, Stat } from '../../app/ui.jsx';
import EChart from '../../lib/viz/EChart.jsx';
import { categoryX, valueY, logY, GRID, donutOpt, radarOpt, stackedBarOpt, AXIS, LABEL } from '../shared/chartHelpers.js';
import { IntroCard, SelectorBar, TimelineBar, FrameworkTrio, ModuleFooter } from '../shared/ModuleParadigm.jsx';

// ============================================================================
// 认知内核 · 博弈论（Game Theory）交互模型
// ----------------------------------------------------------------------------
// 经典 2×2 博弈选择器 + 收益矩阵（原生 table）+ 纳什均衡 + 现实映射；
// 重复博弈贴现因子滑杆 → 以牙还牙（Tit-for-Tat）合作率随轮数演化；
// 策略锦标赛模拟器（阿克塞尔罗德复刻，固定种子 PRNG）；
// 自定义收益矩阵求解器（T/R/P/S → 博弈类型 + 纯策略纳什 + δ* 阈值）；
// 信号博弈卡 + 谢林点（焦点）卡。
// ============================================================================

// —— 确定性伪随机（mulberry32，固定种子，可复现）——
function mulberry32(seed) {
  let a = seed >>> 0;
  return function () {
    a |= 0; a = (a + 0x6D2B79F5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// —— 锦标赛策略集（C=合作 D=背叛）——
const STRATEGIES = [
  { key: 'TFT', name: '以牙还牙', color: '#10b981', desc: '首轮合作，之后复制对方上一步' },
  { key: 'Grim', name: '冷酷触发', color: '#22d3ee', desc: '合作直到对方背叛一次，此后永远背叛' },
  { key: 'AllC', name: '永远合作', color: LABEL.color, desc: '无条件合作——善良但可被剥削' },
  { key: 'AllD', name: '永远背叛', color: '#c41e3a', desc: '无条件背叛——短期占便宜，长期被孤立' },
  { key: 'Random', name: '随机策略', color: '#e8a317', desc: '每轮 50% 合作（固定种子伪随机）' },
  { key: 'Tester', name: '试探者', color: '#a78bfa', desc: '先背叛试探；对方报复就道歉并转向合作，不报复就持续剥削（阿克塞尔罗德 TESTER 型参赛者）' },
];

function nextMove(key, myHist, oppHist, rng) {
  switch (key) {
    case 'TFT': return oppHist.length === 0 ? 'C' : oppHist[oppHist.length - 1];
    case 'Grim': return oppHist.includes('D') ? 'D' : 'C';
    case 'AllC': return 'C';
    case 'AllD': return 'D';
    case 'Random': return rng() < 0.5 ? 'C' : 'D';
    case 'Tester': {
      const firstD = oppHist.indexOf('D');
      if (firstD === -1) {
        // 对方从未报复：首轮背叛试探，之后 D/C 交替持续剥削
        return myHist.length === 0 ? 'D' : (myHist.length % 2 === 0 ? 'D' : 'C');
      }
      // 对方报复了：道歉（连续合作两轮），然后转入以牙还牙
      const detect = firstD + 1;
      if (myHist.length < detect + 2) return 'C';
      return oppHist[oppHist.length - 1];
    }
    default: return 'C';
  }
}

// 标准囚徒困境收益：T=5 R=3 P=1 S=0
function pdPayoff(a, b) {
  if (a === 'C' && b === 'C') return [3, 3];
  if (a === 'C' && b === 'D') return [0, 5];
  if (a === 'D' && b === 'C') return [5, 0];
  return [1, 1];
}

function runTournament(roundsPerMatch) {
  const scores = Object.fromEntries(STRATEGIES.map((s) => [s.key, 0]));
  for (let i = 0; i < STRATEGIES.length; i++) {
    for (let j = i; j < STRATEGIES.length; j++) {
      const A = STRATEGIES[i].key, B = STRATEGIES[j].key;
      const rng = mulberry32(1949 + i * 31 + j); // 固定种子：同参数结果可复现
      const ha = [], hb = [];
      let sa = 0, sb = 0;
      for (let r = 0; r < roundsPerMatch; r++) {
        const ma = nextMove(A, ha, hb, rng);
        const mb = nextMove(B, hb, ha, rng);
        const [pa, pb] = pdPayoff(ma, mb);
        sa += pa; sb += pb;
        ha.push(ma); hb.push(mb);
      }
      if (i === j) { scores[A] += sa; } else { scores[A] += sa; scores[B] += sb; }
    }
  }
  return STRATEGIES.map((s) => ({ ...s, score: scores[s.key] })).sort((a, b) => b.score - a.score);
}

// —— TFT 四性质（阿克塞尔罗德归纳）——
const TFT_TRAITS = [
  { t: '善良 Nice', d: '绝不率先背叛——锦标赛前八名全是善良策略，善意是入场券。' },
  { t: '可激怒 Provocable', d: '对方背叛立即报复——不报复的「永远合作」会被 AllD 吃干抹净。' },
  { t: '宽容 Forgiving', d: '对方回头就既往不咎——冷酷触发记仇到底，在噪声环境会陷入互相报复。' },
  { t: '清晰 Clear', d: '规则简单到对手一眼看懂——可预期性本身就是合作的邀请函。' },
];

const GAMES = {
  prisoner: {
    label: '囚徒困境', rows: ['合作', '背叛'], cols: ['合作', '背叛'],
    // [我方收益, 对方收益]
    payoff: [[[3, 3], [0, 5]], [[5, 0], [1, 1]]],
    ne: '唯一纳什均衡 =（背叛, 背叛）。背叛是占优策略：无论对方如何选，背叛收益都更高——但双方背叛 (1,1) 远劣于双方合作 (3,3)，个体理性导致集体次优。',
    real: '中美关税战 = 典型囚徒困境：双方都加征关税 (1,1) 优于单方退让 (0,5)，但都不敢先合作，最终困在双输均衡。',
  },
  stag: {
    label: '猎鹿博弈', rows: ['猎鹿', '猎兔'], cols: ['猎鹿', '猎兔'],
    payoff: [[[4, 4], [0, 3]], [[3, 0], [3, 3]]],
    ne: '两个纯策略纳什均衡：（猎鹿, 猎鹿）= 收益最高的合作均衡；（猎兔, 猎兔）= 安全但低效。属于「信任博弈」——合作有更高回报，但需双方都相信对方不背叛。',
    real: '全球气候合作 = 猎鹿：齐心减排 (4,4) 远胜各自只顾自己 (3,3)，但只要怀疑对方搭便车，就退回低效的「各猎各的兔」。',
  },
  chicken: {
    label: '胆小鬼博弈', rows: ['强硬', '退让'], cols: ['强硬', '退让'],
    payoff: [[[-9, -9], [2, -2]], [[-2, 2], [0, 0]]],
    ne: '两个纯策略纳什均衡：（强硬, 退让）与（退让, 强硬）。双方都强硬 (-9,-9) 是灾难性的相撞；理性是「让对方先眨眼」——制造不可逆的强硬承诺反而占优。',
    real: '台海与核威慑 = 胆小鬼博弈：双方都强硬则两败俱伤，谁先释放「我不会退」的可信信号，谁就逼对方退让——边缘政策（brinkmanship）。',
  },
  repeated: {
    label: '重复博弈', rows: ['合作', '背叛'], cols: ['合作', '背叛'],
    payoff: [[[3, 3], [0, 5]], [[5, 0], [1, 1]]],
    ne: '单轮看与囚徒困境同构，但无限重复且贴现因子 δ 足够大时，「以牙还牙」可支撑长期合作为均衡——未来报复的阴影 (shadow of the future) 让当下背叛不划算。',
    real: '大国长期共存 / 贸易关系：一次性交易倾向背叛，但反复打交道（WTO、气候轮谈）时，声誉与报复预期使合作可持续。',
  },
};

export default function Page() {
  const [g, setG] = useState('prisoner');
  const [delta, setDelta] = useState(70); // 贴现因子 δ ×100，也驱动合作可持续性
  const [tRounds, setTRounds] = useState(200); // 锦标赛每场轮数
  const [T, setT] = useState(5); // 诱惑 Temptation
  const [R, setR] = useState(3); // 奖励 Reward
  const [P, setP] = useState(1); // 惩罚 Punishment
  const [S, setS] = useState(0); // 受骗 Sucker
  const game = GAMES[g];

  // —— 策略锦标赛（确定性：固定种子 + 固定轮数 → 同结果）——
  const ranking = useMemo(() => runTournament(tRounds), [tRounds]);
  const champion = ranking[0];

  const tourneyBar = useMemo(() => ({
    grid: { ...GRID, left: 90 },
    xAxis: { type: 'value', axisLabel: { color: LABEL.color }, splitLine: { lineStyle: { color: 'rgba(147,161,181,0.12)' } }, name: '总得分', nameTextStyle: { color: LABEL.color } },
    yAxis: { type: 'category', data: [...ranking].reverse().map((s) => s.name), axisLabel: { color: '#cdd6e4' }, axisLine: { lineStyle: { color: AXIS.lineStyle.color } } },
    series: [{
      type: 'bar', barWidth: 16,
      data: [...ranking].reverse().map((s) => ({ value: s.score, itemStyle: { color: s.color } })),
      label: { show: true, position: 'right', color: LABEL.color, fontSize: 11 },
    }],
    tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
  }), [ranking]);

  // —— 自定义收益矩阵求解器 ——
  // 对称 2×2：(C,C)=(R,R) (C,D)=(S,T) (D,C)=(T,S) (D,D)=(P,P)
  const solver = useMemo(() => {
    // 纯策略纳什 = 双方互为最优反应（弱不等式）
    const ne = [];
    if (R >= T) ne.push('（合作, 合作）');               // 对方合作时，C 得 R ≥ 偏离得 T
    if (T >= R && S >= P) ne.push('（合作, 背叛）', '（背叛, 合作）'); // 非对称均衡（胆小鬼型）
    if (P >= S) ne.push('（背叛, 背叛）');               // 对方背叛时，D 得 P ≥ 偏离得 S
    if (ne.length === 0) ne.push('无纯策略均衡（仅存混合策略均衡）');
    let type, typeDesc, typeColor;
    if (T > R && R > P && P > S) { type = '囚徒困境'; typeDesc = 'T>R>P>S：背叛占优，唯一均衡 (背叛,背叛)，个体理性 → 集体次优。'; typeColor = '#c41e3a'; }
    else if (R > T && P > S) { type = '猎鹿博弈'; typeDesc = 'R>T 且 P>S：(合作,合作) 与 (背叛,背叛) 双均衡，合作回报更高但需要信任。'; typeColor = '#10b981'; }
    else if (T > R && S > P) { type = '胆小鬼博弈'; typeDesc = 'T>R 且 S>P：两个非对称均衡，比拼谁先「不可逆地强硬」逼对方退让。'; typeColor = '#e8a317'; }
    else if (R >= T && S >= P) { type = '和谐博弈'; typeDesc = '合作直接占优——根本没有困境，现实中罕见。'; typeColor = '#22d3ee'; }
    else { type = '混合结构'; typeDesc = '当前排序不属于四大经典类型，逐格检验最优反应即可。'; typeColor = '#93a1b5'; }
    const dStar = T - P !== 0 ? (T - R) / (T - P) : NaN;
    return { type, typeDesc, typeColor, ne, dStar };
  }, [T, R, P, S]);

  const dStarOk = Number.isFinite(solver.dStar) && solver.dStar >= 0 && solver.dStar <= 1;

  // 以牙还牙：合作率随轮数上升。δ 越高，长期合作越稳定（收敛上限更高、爬升更快）。
  const rounds = Array.from({ length: 20 }, (_, i) => i + 1);
  const d = delta / 100;
  const coopSeries = useMemo(() => rounds.map((r) => {
    const ceiling = 100 * d;                       // 合作率上限随 δ 提升
    const v = ceiling * (1 - Math.exp(-r * (0.15 + d * 0.35)));
    return Math.round(Math.max(0, Math.min(100, v)));
  }), [d]);
  const sustain = coopSeries[coopSeries.length - 1];
  // 合作阈值：囚徒困境(3/5/1/0)下 TFT 成均衡需 δ ≥ (T−R)/(T−P) = (5−3)/(5−1) = 0.5
  const stable = d >= 0.5;

  const gameItems = Object.entries(GAMES).map(([key, v]) => ({ key, label: v.label }));

  const line = {
    grid: GRID,
    xAxis: { ...categoryX(rounds), name: '博弈轮数', nameTextStyle: { color: LABEL.color } },
    yAxis: { ...valueY({ max: 100 }), name: '合作率%', nameTextStyle: { color: LABEL.color } },
    series: [{ type: 'line', smooth: true, data: coopSeries, lineStyle: { color: stable ? '#10b981' : '#e8a317', width: 2 }, itemStyle: { color: stable ? '#10b981' : '#e8a317' }, areaStyle: { color: stable ? 'rgba(16,185,129,0.1)' : 'rgba(232,163,23,0.08)' } }],
  };

  return (
    <div>
      <PageHeader badge="Cognition · 博弈论" title="博弈论 · 当理性遭遇理性"
        subtitle="囚徒困境 / 猎鹿 / 胆小鬼 / 重复博弈 —— 用 2×2 收益矩阵推演大国为何困在次优均衡，又如何走向合作" />
      <IntroCard>博弈论研究<strong style={{ color: 'var(--text-primary)' }}>相互依赖的理性决策</strong>：每一方的最优选择取决于对方怎么选。其核心概念<strong style={{ color: 'var(--text-primary)' }}>纳什均衡</strong>——没有任何一方能通过单方面改变策略而获益。冷峻之处在于：理性的个体选择，常常导致集体的次优结局。</IntroCard>

      <Card title="交互 · 经典博弈选择器" className="mb-6">
        <SelectorBar items={gameItems} activeKey={g} onSelect={setG} />
      </Card>

      <Grid cols={2} className="mb-6">
        <Card title={`${game.label} · 收益矩阵（我方, 对方）`}>
          <table className="w-full text-sm mono" style={{ borderCollapse: 'collapse', color: 'var(--text-secondary)' }}>
            <thead>
              <tr>
                <th style={{ padding: 8, border: '1px solid #27324a', color: LABEL.color }}></th>
                <th colSpan={2} style={{ padding: 8, border: '1px solid #27324a', color: 'var(--cyber-cyan)' }}>对方 ↓</th>
              </tr>
              <tr>
                <th style={{ padding: 8, border: '1px solid #27324a', color: '#c41e3a' }}>我方 →</th>
                {game.cols.map((c) => <th key={c} style={{ padding: 8, border: '1px solid #27324a', color: LABEL.color }}>{c}</th>)}
              </tr>
            </thead>
            <tbody>
              {game.rows.map((rname, i) => (
                <tr key={rname}>
                  <th style={{ padding: 8, border: '1px solid #27324a', color: '#c41e3a' }}>{rname}</th>
                  {game.cols.map((_, j) => (
                    <td key={j} style={{ padding: 10, border: '1px solid #27324a', textAlign: 'center', color: 'var(--text-primary)' }}>
                      ({game.payoff[i][j][0]}, {game.payoff[i][j][1]})
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
          <div className="p-3 rounded mt-3" style={{ background: 'rgba(196,30,58,0.08)', border: '1px solid rgba(196,30,58,0.2)' }}>
            <span className="text-[10px] mono uppercase" style={{ color: 'var(--china-red)' }}>纳什均衡</span>
            <p className="text-xs mt-1" style={{ color: 'var(--text-secondary)' }}>{game.ne}</p>
          </div>
        </Card>
        <Card title="现实映射 + 重复博弈滑杆（以牙还牙）">
          <div className="p-3 rounded mb-3" style={{ background: 'rgba(34,211,238,0.06)', border: '1px solid rgba(34,211,238,0.2)' }}>
            <span className="text-[10px] mono uppercase" style={{ color: 'var(--cyber-cyan)' }}>现实映射</span>
            <p className="text-xs mt-1" style={{ color: 'var(--text-secondary)' }}>{game.real}</p>
          </div>
          <div className="flex justify-between text-xs mb-1"><span style={{ color: 'var(--text-secondary)' }}>贴现因子 δ（对未来的看重）</span><span className="mono" style={{ color: 'var(--cyber-cyan)' }}>{d.toFixed(2)}</span></div>
          <input type="range" min="0" max="100" value={delta} onChange={(e) => setDelta(Number(e.target.value))} style={{ width: '100%', accentColor: '#c41e3a' }} />
          <Grid cols={2} className="mt-3">
            <Stat value={sustain + '%'} label="第20轮合作率" accent={stable ? '#10b981' : '#e8a317'} />
            <Stat value={stable ? '可持续' : '会崩溃'} label={`合作阈值 δ≥0.50（现 ${d.toFixed(2)}）`} accent={stable ? '#10b981' : '#c41e3a'} />
          </Grid>
        </Card>
      </Grid>

      <Card title="以牙还牙 · 合作率随博弈轮数演化（示意）" className="mb-6">
        <EChart option={line} style={{ height: 240 }} />
        <p className="text-[11px] mt-1" style={{ color: 'var(--text-tertiary)' }}>
          阿克塞尔罗德的重复博弈竞赛中，<strong style={{ color: 'var(--text-secondary)' }}>以牙还牙</strong>（首轮合作、之后复制对方上一步）最稳健：善意、可激怒、宽容、清晰。当 δ &lt; 0.50（曲线转黄），未来折损太大，合作无法支撑、退回背叛。
        </p>
      </Card>

      <Card title="模拟器 · 策略锦标赛（阿克塞尔罗德复刻）" className="mb-6">
        <p className="text-xs mb-3" style={{ color: 'var(--text-secondary)' }}>
          6 种策略两两循环赛（含自我对局），每场进行 N 轮标准囚徒困境（T=5 R=3 P=1 S=0），累计总分排行。
          关键角色是<strong style={{ color: 'var(--text-primary)' }}>试探者</strong>：它先背叛试探，对手报复就道歉回归合作——以牙还牙吃到道歉后的长期合作（约 3 分/轮），而冷酷触发记仇到底、与它同归于尽（约 1 分/轮），这正是宽容的价值。
          随机策略采用<strong style={{ color: 'var(--text-primary)' }}>固定种子伪随机（mulberry32）</strong>——同参数下结果完全可复现。
        </p>
        <div className="flex justify-between text-xs mb-1">
          <span style={{ color: 'var(--text-secondary)' }}>每场对局轮数 N</span>
          <span className="mono" style={{ color: 'var(--cyber-cyan)' }}>{tRounds} 轮</span>
        </div>
        <input type="range" min="50" max="500" step="10" value={tRounds} onChange={(e) => setTRounds(Number(e.target.value))} style={{ width: '100%', accentColor: '#c41e3a' }} />
        <Grid cols={2} className="mt-3 mb-3">
          <Stat value={champion.name} label="当前冠军策略" accent={champion.color} />
          <Stat value={champion.score.toLocaleString()} label="冠军总得分" accent="#22d3ee" />
        </Grid>
        <EChart option={tourneyBar} style={{ height: 240 }} />
        <div className="grid grid-cols-2 gap-2 mt-3">
          {STRATEGIES.map((s) => (
            <div key={s.key} className="p-2 rounded text-xs" style={{ background: 'rgba(34,211,238,0.04)', border: '1px solid #27324a' }}>
              <span className="mono" style={{ color: s.color }}>{s.name}</span>
              <span style={{ color: 'var(--text-tertiary)' }}> — {s.desc}</span>
            </div>
          ))}
        </div>
        <div className="p-3 rounded mt-3" style={{ background: 'rgba(16,185,129,0.06)', border: '1px solid rgba(16,185,129,0.2)' }}>
          <span className="text-[10px] mono uppercase" style={{ color: '#10b981' }}>TFT 为何夺冠 · 四性质</span>
          <Grid cols={2} className="mt-2">
            {TFT_TRAITS.map((x) => (
              <div key={x.t} className="text-xs">
                <strong style={{ color: 'var(--text-primary)' }}>{x.t}</strong>
                <p style={{ color: 'var(--text-secondary)' }}>{x.d}</p>
              </div>
            ))}
          </Grid>
        </div>
      </Card>

      <Card title="求解器 · 自定义收益矩阵（T/R/P/S）" className="mb-6">
        <p className="text-xs mb-3" style={{ color: 'var(--text-secondary)' }}>
          拖动四个收益参数，实时判定博弈类型、纯策略纳什均衡与重复博弈合作阈值 δ* =（T−R）/（T−P）。
          T=诱惑（我背叛你合作）、R=奖励（双合作）、P=惩罚（双背叛）、S=受骗（我合作你背叛）。
        </p>
        <Grid cols={2}>
          <div>
            {[['T 诱惑', T, setT, '#c41e3a'], ['R 奖励', R, setR, '#10b981'], ['P 惩罚', P, setP, '#e8a317'], ['S 受骗', S, setS, '#22d3ee']].map(([lbl, val, set, col]) => (
              <div key={lbl} className="mb-2">
                <div className="flex justify-between text-xs mb-1">
                  <span style={{ color: 'var(--text-secondary)' }}>{lbl}</span>
                  <span className="mono" style={{ color: col }}>{val}</span>
                </div>
                <input type="range" min="-5" max="10" value={val} onChange={(e) => set(Number(e.target.value))} style={{ width: '100%', accentColor: col }} />
              </div>
            ))}
            <table className="w-full text-sm mono mt-2" style={{ borderCollapse: 'collapse', color: 'var(--text-secondary)' }}>
              <tbody>
                <tr>
                  <th style={{ padding: 6, border: '1px solid #27324a', color: LABEL.color }}></th>
                  <th style={{ padding: 6, border: '1px solid #27324a', color: LABEL.color }}>对方合作</th>
                  <th style={{ padding: 6, border: '1px solid #27324a', color: LABEL.color }}>对方背叛</th>
                </tr>
                <tr>
                  <th style={{ padding: 6, border: '1px solid #27324a', color: LABEL.color }}>我合作</th>
                  <td style={{ padding: 6, border: '1px solid #27324a', textAlign: 'center', color: 'var(--text-primary)' }}>({R}, {R})</td>
                  <td style={{ padding: 6, border: '1px solid #27324a', textAlign: 'center', color: 'var(--text-primary)' }}>({S}, {T})</td>
                </tr>
                <tr>
                  <th style={{ padding: 6, border: '1px solid #27324a', color: LABEL.color }}>我背叛</th>
                  <td style={{ padding: 6, border: '1px solid #27324a', textAlign: 'center', color: 'var(--text-primary)' }}>({T}, {S})</td>
                  <td style={{ padding: 6, border: '1px solid #27324a', textAlign: 'center', color: 'var(--text-primary)' }}>({P}, {P})</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div>
            <div className="p-3 rounded mb-3" style={{ background: 'rgba(34,211,238,0.06)', border: `1px solid ${solver.typeColor}55` }}>
              <span className="text-[10px] mono uppercase" style={{ color: solver.typeColor }}>判定 · 博弈类型</span>
              <p className="text-lg mono mt-1" style={{ color: solver.typeColor }}>{solver.type}</p>
              <p className="text-xs mt-1" style={{ color: 'var(--text-secondary)' }}>{solver.typeDesc}</p>
            </div>
            <div className="p-3 rounded mb-3" style={{ background: 'rgba(196,30,58,0.08)', border: '1px solid rgba(196,30,58,0.2)' }}>
              <span className="text-[10px] mono uppercase" style={{ color: 'var(--china-red)' }}>纯策略纳什均衡</span>
              <p className="text-xs mt-1 mono" style={{ color: 'var(--text-primary)' }}>{solver.ne.join('　')}</p>
            </div>
            <Grid cols={2}>
              <Stat value={dStarOk ? solver.dStar.toFixed(2) : 'N/A'} label="合作阈值 δ*=(T−R)/(T−P)" accent={dStarOk ? (d >= solver.dStar ? '#10b981' : '#e8a317') : '#93a1b5'} />
              <Stat value={dStarOk ? (d >= solver.dStar ? '可支撑' : '撑不住') : '—'} label={`按上方 δ=${d.toFixed(2)} 对照`} accent={dStarOk && d >= solver.dStar ? '#10b981' : '#c41e3a'} />
            </Grid>
            <p className="text-[11px] mt-2" style={{ color: 'var(--text-tertiary)' }}>
              δ* 仅在囚徒困境型排序（T&gt;R&gt;P）下有意义：δ ≥ δ* 时以牙还牙可把合作支撑为均衡。
            </p>
          </div>
        </Grid>
      </Card>

      <Grid cols={2} className="mb-6">
        <Card title="不完全信息 · 信号博弈">
          <p className="text-xs mb-2" style={{ color: 'var(--text-secondary)' }}>
            当对手不知道你的「类型」（强硬派还是软弱派），博弈的关键变成<strong style={{ color: 'var(--text-primary)' }}>让对方相信你是哪种类型</strong>——威慑的本质不是实力，而是关于实力与决心的信念管理。
          </p>
          <div className="p-2 rounded mb-2 text-xs" style={{ background: 'rgba(232,163,23,0.06)', border: '1px solid rgba(232,163,23,0.25)' }}>
            <span className="mono" style={{ color: '#e8a317' }}>廉价磋商 Cheap Talk</span>
            <p style={{ color: 'var(--text-secondary)' }}>不花成本的声明（外交辞令、口头警告）——任何类型都说得出口，因此信息量趋近于零。</p>
          </div>
          <div className="p-2 rounded mb-2 text-xs" style={{ background: 'rgba(196,30,58,0.06)', border: '1px solid rgba(196,30,58,0.25)' }}>
            <span className="mono" style={{ color: 'var(--china-red)' }}>烧钱信号 Costly Signal</span>
            <p style={{ color: 'var(--text-secondary)' }}>只有真强硬派才付得起的代价：前沿驻军、军演实弹、立法承诺——成本本身就是可信度。</p>
          </div>
          <p className="text-[11px]" style={{ color: 'var(--text-tertiary)' }}>
            与「威慑」模块呼应：威慑成立 = 让对手在贝叶斯更新后，仍认为你「会打」的概率高到不值得赌。
          </p>
        </Card>
        <Card title="协调难题 · 谢林点（焦点）">
          <p className="text-xs mb-2" style={{ color: 'var(--text-secondary)' }}>
            谢林（Schelling）发现：在无法沟通的协调博弈中，人们会向<strong style={{ color: 'var(--text-primary)' }}>显著、对称、有历史惯性的「焦点」</strong>收敛——默契均衡不靠协议，靠共同的想象。
          </p>
          <div className="p-2 rounded mb-2 text-xs" style={{ background: 'rgba(34,211,238,0.06)', border: '1px solid rgba(34,211,238,0.25)' }}>
            <span className="mono" style={{ color: 'var(--cyber-cyan)' }}>海峡中线</span>
            <p style={{ color: 'var(--text-secondary)' }}>从无法律效力，却长期充当默契分界——一旦被常态化跨越，焦点消失，新均衡需在更危险处重新摸索。</p>
          </div>
          <div className="p-2 rounded mb-2 text-xs" style={{ background: 'rgba(34,211,238,0.06)', border: '1px solid rgba(34,211,238,0.25)' }}>
            <span className="mono" style={{ color: 'var(--cyber-cyan)' }}>不首先使用核武</span>
            <p style={{ color: 'var(--text-secondary)' }}>「零次使用」是核时代最坚固的焦点：任何一次突破都会让全体玩家失去坐标。</p>
          </div>
          <p className="text-[11px]" style={{ color: 'var(--text-tertiary)' }}>
            焦点的力量在于「大家都相信大家都相信」——也因此格外脆弱：侵蚀它的不是炮火，而是一次次小步的越线。
          </p>
        </Card>
      </Grid>

      <FrameworkTrio cards={[
        { title: '纳什均衡', subtitle: '结构约束', body: '给定收益矩阵下，没有任何一方能通过单方面改变策略而获益——个体理性导致集体次优。', pillars: [['囚徒困境', '背叛是占优策略。'], ['猎鹿博弈', '信任决定合作。'], ['胆小鬼博弈', '边缘政策占优。']] },
        { title: '重复博弈', subtitle: '以牙还牙', body: '无限重复且贴现因子 δ 足够大时，「以牙还牙」可支撑长期合作为均衡。', pillars: [['未来阴影', 'δ≥0.50 阈值。'], ['声誉机制', '报复预期约束。'], ['阿克塞尔罗德', '善意·可激怒·宽容。']] },
        { title: '大国接口', subtitle: '竞合管控', body: '现实主义讲为什么竞争，博弈论讲在给定结构下如何选。', pillars: [['台海', '胆小鬼+重复博弈。'], ['关税战', '囚徒困境结构。'], ['气候合作', '猎鹿博弈映射。']] },
      ]} />

      <Card title="用法 · 与各模块的接口">
        <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
          博弈论是<span className="mono" style={{ color: 'var(--cyber-cyan)' }}>现实主义 / 权力物理学 / 大国战略</span>的微观决策底层：现实主义讲「为什么竞争」，博弈论讲「在给定结构下如何选」。把中美关系拆成一连串重复博弈，就能看清「报复预期」与「未来阴影」如何把死局撬成合作的可能。
        </p>
      </Card>
      <ModuleFooter moduleId="gametheory" disclaimer="本模块为博弈论思想工具，收益数值与合作率曲线为示意，用于结构化推演而非实证测量" />
    </div>
  );
}
