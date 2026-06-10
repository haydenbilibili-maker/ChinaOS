import React, { useState, useMemo } from 'react';
import { PageHeader, Card, Grid, Stat } from '../../app/ui.jsx';
import EChart from '../../lib/viz/EChart.jsx';

// ============================================================================
// 认知内核 · 路径依赖与锁定（Path Dependence · David / Arthur）
// ----------------------------------------------------------------------------
// 历史小事件经报酬递增（学习/网络/协调/适应性预期）被放大并锁定，未必最优。
// 关键节点 → 自我强化 → 锁定 → 解锁需外部冲击。交互：选初始路径看分叉曲线。
// ============================================================================

const SCENARIOS = {
  standard: {
    label: '技术标准：自主 vs 跟随', a: '自主标准', b: '跟随国际标准',
    lock: 7, // 第 7 期锁定
    note: '早期采用人数的微小领先，经网络效应自我放大；一旦越过临界规模，跟随者再优也难翻盘（VHS 击败 Betamax、QWERTY 锁定）。',
  },
  energy: {
    label: '能源：煤电锁定 vs 新能源换道', a: '煤电既有路径', b: '新能源换道',
    lock: 8,
    note: '存量电网、设备折旧、产业工人与配套构成巨大协调成本，把系统锁在化石路径；换道需在新路径报酬尚未递增前以政策冲击强行抬升。',
  },
  currency: {
    label: '货币：美元霸权惯性 vs 多极', a: '美元结算惯性', b: '多极结算',
    lock: 9,
    note: '结算网络、计价习惯、储备资产的适应性预期相互强化，形成「越多人用越值得用」的锁定，挑战者面对的不是技术差距而是协调难题。',
  },
};

// 报酬递增分叉：两条 S 形曲线，胜者越锁越高、败者被压制
function buildPaths(sc, boost) {
  const T = 12;
  const x = Array.from({ length: T }, (_, i) => `T${i}`);
  const sig = (i, mid, k, cap) => cap / (1 + Math.exp(-k * (i - mid)));
  // 路径 A（默认胜者）报酬递增；boost 表示外部冲击对 B 的扶持力度（换道）
  const winner = x.map((_, i) => Math.round(sig(i, sc.lock - 2, 0.7, 100)));
  const loser = x.map((_, i) => {
    const base = sig(i, sc.lock, 0.45, 100 - boost * 0.5);
    const supress = i > sc.lock ? (100 - boost) * 0.004 * (i - sc.lock) * 12 : 0;
    return Math.round(Math.max(2, base + boost * 0.6 - supress));
  });
  return { x, winner, loser };
}

export default function Page() {
  const [k, setK] = useState('standard');
  const [boost, setBoost] = useState(20); // 外部冲击力度（换道扶持）
  const sc = SCENARIOS[k];
  const { x, winner, loser } = useMemo(() => buildPaths(sc, boost), [k, boost]);

  // 解锁判定：冲击越大、且在锁定点前介入，换道越可能成功
  const overtake = useMemo(() => loser.some((v, i) => v >= winner[i] && i <= sc.lock + 2), [winner, loser, sc]);
  const lockStrength = useMemo(() => Math.max(0, 100 - boost), [boost]);

  const option = {
    legend: { data: [sc.a, sc.b], textStyle: { color: '#93a1b5' }, top: 0 },
    grid: { left: 40, right: 16, top: 30, bottom: 24 },
    xAxis: { type: 'category', data: x, axisLine: { lineStyle: { color: '#27324a' } }, axisLabel: { color: '#93a1b5' } },
    yAxis: { type: 'value', max: 100, name: '累计报酬', nameTextStyle: { color: '#93a1b5' }, axisLine: { lineStyle: { color: '#27324a' } }, axisLabel: { color: '#93a1b5' }, splitLine: { lineStyle: { color: 'rgba(148,163,184,0.1)' } } },
    series: [
      { name: sc.a, type: 'line', smooth: true, data: winner, lineStyle: { color: '#c41e3a', width: 2 }, itemStyle: { color: '#c41e3a' }, areaStyle: { color: 'rgba(196,30,58,0.08)' },
        markLine: { silent: true, symbol: 'none', data: [{ xAxis: `T${sc.lock}`, label: { formatter: '锁定点', color: '#e8a317', fontSize: 10 }, lineStyle: { color: '#e8a317', type: 'dashed' } }] } },
      { name: sc.b, type: 'line', smooth: true, data: loser, lineStyle: { color: overtake ? '#10b981' : '#22d3ee', width: 2 }, itemStyle: { color: overtake ? '#10b981' : '#22d3ee' } },
    ],
  };

  const FORCES = [
    ['学习效应', '用得越多越熟练、单位成本越低 —— 经验沿既有路径累积。'],
    ['网络效应', '采用者越多，每个采用者的收益越大（电话、标准、平台）。'],
    ['协调效应', '与他人选同一方案才省事 —— 配套、规范、上下游绑定。'],
    ['适应性预期', '人们预期某方案将胜出，便提前倒向它，预期自我实现。'],
  ];

  return (
    <div>
      <PageHeader badge="Cognition · 路径依赖" title="路径依赖与锁定 · 历史为何不可逆"
        subtitle="David / Arthur —— 历史小事件经报酬递增被放大并锁定，未必最优；解锁需外部冲击或换道抢占" />
      <Card className="mb-6"><p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
        路径依赖指：一个由<strong style={{ color: 'var(--text-primary)' }}>偶然小事件</strong>启动的选择，经报酬递增（increasing returns）不断自我强化，最终把系统<strong style={{ color: 'var(--text-primary)' }}>锁定（lock-in）</strong>在某条轨道上——即便存在更优方案也难以切换。QWERTY 键盘、VHS、美元霸权、技术标准都是经典案例。机制链条：<span className="mono" style={{ color: 'var(--cyber-cyan)' }}>关键节点 → 自我强化 → 锁定 → 外部冲击解锁</span>。
      </p></Card>

      <Grid cols={3} className="mb-6">
        <Stat value={`T${sc.lock}`} label="预计锁定点（critical juncture 之后）" accent="#e8a317" />
        <Stat value={lockStrength} label="锁定强度（冲击越大越低）" accent="#c41e3a" />
        <Stat value={overtake ? '换道成功' : '维持锁定'} label="后发路径能否反超" accent={overtake ? '#10b981' : '#22d3ee'} />
      </Grid>

      <Grid cols={2} className="mb-6">
        <Card title="情景与外部冲击 · 调参">
          <div className="flex gap-1 flex-wrap mb-3">
            {Object.entries(SCENARIOS).map(([key, v]) => (
              <button key={key} onClick={() => setK(key)} className="text-xs px-3 py-1.5 rounded mono"
                style={{ background: key === k ? 'rgba(196,30,58,0.2)' : 'var(--bg-elevated)', color: key === k ? '#fff' : 'var(--text-secondary)', border: `1px solid ${key === k ? 'var(--china-red)' : 'transparent'}`, cursor: 'pointer' }}>{v.label}</button>
            ))}
          </div>
          <div className="flex justify-between text-xs mb-1"><span style={{ color: 'var(--text-secondary)' }}>外部冲击 / 换道扶持力度</span><span className="mono" style={{ color: 'var(--cyber-cyan)' }}>{boost}</span></div>
          <input type="range" min="0" max="100" value={boost} onChange={(e) => setBoost(Number(e.target.value))} style={{ width: '100%', accentColor: '#c41e3a' }} />
          <p className="text-sm leading-relaxed mt-3" style={{ color: 'var(--text-secondary)' }}>{sc.note}</p>
          <p className="text-[11px] mt-2" style={{ color: 'var(--text-tertiary)' }}>提示：拖大冲击力度，后发路径（{sc.b}）的曲线被抬升、有机会反超——但若错过锁定点窗口，再大的力气也难撬动既有轨道。</p>
        </Card>
        <Card title="报酬递增分叉曲线（示意）">
          <EChart option={option} style={{ height: 300 }} />
          <p className="text-[11px] mt-1" style={{ color: 'var(--text-tertiary)' }}>红线为先发路径（自我强化、越锁越高），青/绿线为后发路径；黄色虚线为锁定点。绿色表示在窗口内成功换道。</p>
        </Card>
      </Grid>

      <Card title="报酬递增的四种机制 · 锁定的发动机" className="mb-6">
        <Grid cols={2}>
          {FORCES.map(([t, d]) => (
            <div key={t} style={{ borderLeft: '2px solid var(--china-red)', paddingLeft: 10 }}>
              <div className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>{t}</div>
              <p className="text-xs mt-1 leading-relaxed" style={{ color: 'var(--text-tertiary)' }}>{d}</p>
            </div>
          ))}
        </Grid>
      </Card>

      <Card title="项目映射 · 换道超车的时机论">
        <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
          路径依赖给「<strong style={{ color: 'var(--text-primary)' }}>换道超车</strong>」提供了精确的时机论：在旧路径尚未完成报酬递增、新路径尚未被他人锁定的<strong style={{ color: 'var(--china-red)' }}>关键节点窗口</strong>，以举国冲击抢先确立新标准——这正是<span className="mono" style={{ color: 'var(--cyber-cyan)' }}>科技树 / 半导体 / 能源</span>诸模块的共同棋路。被卡脖子的本质是被锁在他人主导的旧路径里；破局之道不是在旧路径上追赶，而是在新路径上先达到临界规模、反向锁定对手。
        </p>
      </Card>
      <p className="text-xs mt-6" style={{ color: 'var(--text-tertiary)' }}>本模块为路径依赖理论的思想工具，分叉曲线与锁定点为示意，用于结构化思考而非实证测量。</p>
    </div>
  );
}
