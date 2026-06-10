import React, { useState, useMemo } from 'react';
import { PageHeader, Card, Grid, Stat } from '../../app/ui.jsx';
import EChart from '../../lib/viz/EChart.jsx';

// ============================================================================
// 认知内核 · 博弈论（Game Theory）交互模型
// ----------------------------------------------------------------------------
// 经典 2×2 博弈选择器 + 收益矩阵（原生 table）+ 纳什均衡 + 现实映射；
// 重复博弈贴现因子滑杆 → 以牙还牙（Tit-for-Tat）合作率随轮数演化。
// ============================================================================

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
  const game = GAMES[g];

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

  const line = {
    grid: { left: 40, right: 16, top: 24, bottom: 28 },
    xAxis: { type: 'category', name: '博弈轮数', nameTextStyle: { color: '#93a1b5' }, data: rounds, axisLine: { lineStyle: { color: '#27324a' } }, axisLabel: { color: '#93a1b5' } },
    yAxis: { type: 'value', max: 100, name: '合作率%', nameTextStyle: { color: '#93a1b5' }, splitLine: { lineStyle: { color: 'rgba(148,163,184,0.1)' } }, axisLabel: { color: '#93a1b5' } },
    series: [{ type: 'line', smooth: true, data: coopSeries, lineStyle: { color: stable ? '#10b981' : '#e8a317', width: 2 }, itemStyle: { color: stable ? '#10b981' : '#e8a317' }, areaStyle: { color: stable ? 'rgba(16,185,129,0.1)' : 'rgba(232,163,23,0.08)' } }],
  };

  return (
    <div>
      <PageHeader badge="Cognition · 博弈论" title="博弈论 · 当理性遭遇理性"
        subtitle="囚徒困境 / 猎鹿 / 胆小鬼 / 重复博弈 —— 用 2×2 收益矩阵推演大国为何困在次优均衡，又如何走向合作" />
      <Card className="mb-6"><p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
        博弈论研究<strong style={{ color: 'var(--text-primary)' }}>相互依赖的理性决策</strong>：每一方的最优选择取决于对方怎么选。其核心概念<strong style={{ color: 'var(--text-primary)' }}>纳什均衡</strong>——没有任何一方能通过单方面改变策略而获益。冷峻之处在于：理性的个体选择，常常导致集体的次优结局。
      </p></Card>

      <div className="flex gap-1 flex-wrap mb-4">
        {Object.entries(GAMES).map(([k, v]) => (
          <button key={k} onClick={() => setG(k)} className="text-sm px-3 py-1.5 rounded mono"
            style={{ background: k === g ? 'rgba(196,30,58,0.2)' : 'var(--bg-elevated)', color: k === g ? '#fff' : 'var(--text-secondary)', border: `1px solid ${k === g ? 'var(--china-red)' : 'transparent'}`, cursor: 'pointer' }}>{v.label}</button>
        ))}
      </div>

      <Grid cols={2} className="mb-6">
        <Card title={`${game.label} · 收益矩阵（我方, 对方）`}>
          <table className="w-full text-sm mono" style={{ borderCollapse: 'collapse', color: 'var(--text-secondary)' }}>
            <thead>
              <tr>
                <th style={{ padding: 8, border: '1px solid #27324a', color: '#93a1b5' }}></th>
                <th colSpan={2} style={{ padding: 8, border: '1px solid #27324a', color: 'var(--cyber-cyan)' }}>对方 ↓</th>
              </tr>
              <tr>
                <th style={{ padding: 8, border: '1px solid #27324a', color: '#c41e3a' }}>我方 →</th>
                {game.cols.map((c) => <th key={c} style={{ padding: 8, border: '1px solid #27324a', color: '#93a1b5' }}>{c}</th>)}
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

      <Card title="用法 · 与各模块的接口">
        <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
          博弈论是<span className="mono" style={{ color: 'var(--cyber-cyan)' }}>现实主义 / 权力物理学 / 大国战略</span>的微观决策底层：现实主义讲「为什么竞争」，博弈论讲「在给定结构下如何选」。把中美关系拆成一连串重复博弈，就能看清「报复预期」与「未来阴影」如何把死局撬成合作的可能。
        </p>
      </Card>
      <p className="text-xs mt-6" style={{ color: 'var(--text-tertiary)' }}>本模块为博弈论思想工具，收益数值与合作率曲线为示意，用于结构化推演而非实证测量。</p>
    </div>
  );
}
