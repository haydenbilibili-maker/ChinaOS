import React, { useState, useMemo } from 'react';
import { PageHeader, Card, Grid, Stat } from '../../app/ui.jsx';
import EChart from '../../lib/viz/EChart.jsx';

// ============================================================================
// 认知内核 · 反脆弱（Antifragility · 纳西姆·塔勒布）
// ----------------------------------------------------------------------------
// 三态：脆弱(凹·惧波动) / 强韧(平·不变) / 反脆弱(凸·从波动获益)。
// 交互：拖动「波动强度」滑杆 → 三条 payoff 曲线随之分化；切换聚焦某一态。
// ============================================================================

const STATES = {
  fragile: { label: '脆弱 Fragile', color: '#c41e3a', k: -0.06, shape: '凹（concave）',
    desc: '收益对波动凹向下：小波动尚可，大波动带来不成比例的崩塌损失。怕黑天鹅。',
    proj: '过度杠杆 · 单一供应链 · 极限去库存（JIT 无冗余） · 政绩工程的债务雪球。' },
  robust: { label: '强韧 Robust', color: '#22d3ee', k: 0, shape: '平（flat）',
    desc: '收益对波动近乎不变：抗住冲击但也不从中获益。是「不坏」，不是「更好」。',
    proj: '战略储备 · 防御工事 · 冗余电网 · 维稳态——求确定性，付出机会成本。' },
  antifragile: { label: '反脆弱 Antifragile', color: '#10b981', k: 0.06, shape: '凸（convex）',
    desc: '收益对波动凸向上：从混乱、压力、试错中获益，波动越大上行越多（有下限保护）。',
    proj: '能源/供应链冗余 + 多元试点 · 压力测试 · 杠铃式财政 · 小步快试的改革。' },
};

const CONCEPTS = [
  ['黑天鹅 Black Swan', '极罕见、极高冲击、事后才被解释的事件。脆弱系统的命运由它一次决定。'],
  ['杠铃策略 Barbell', '90% 极保守 + 10% 高风险高上行，掏空中间。封住下行、敞开上行。'],
  ['凸性 Convexity', '反脆弱的数学本质：收益函数凸 → 波动的期望收益为正（詹森不等式）。'],
  ['林迪效应 Lindy', '非易逝事物的预期寿命随已存活时长增长——活得越久的，越可能继续活。'],
  ['过度优化即脆弱', '把一切冗余压榨成「效率」，系统失去缓冲，在尾部风险前不堪一击。'],
];

// payoff(波动 v) = 基线 + k·v² （凹 k<0 / 平 k=0 / 凸 k>0），反脆弱含下限保护
function curve(k, vmax) {
  const pts = [];
  for (let v = 0; v <= vmax; v += vmax / 24) {
    let y = 50 + k * v * v;
    if (k > 0) y = Math.max(38, y);        // 反脆弱：杠铃下限保护
    pts.push([Number(v.toFixed(1)), Number(y.toFixed(1))]);
  }
  return pts;
}

export default function Page() {
  const [vol, setVol] = useState(60);      // 波动强度 0–100
  const [focus, setFocus] = useState('antifragile');

  // 各态在当前波动下的收益（取曲线末端值）
  const payoffs = useMemo(() => {
    const at = (k) => { let y = 50 + k * vol * vol / 40; return k > 0 ? Math.max(38, y) : y; };
    return { fragile: at(STATES.fragile.k), robust: at(STATES.robust.k), antifragile: at(STATES.antifragile.k) };
  }, [vol]);
  const fmt = (n) => Math.round(n);

  const series = Object.entries(STATES).map(([key, s]) => ({
    name: s.label, type: 'line', smooth: true, symbol: 'none',
    data: curve(s.k, vol / 25 + 0.5),
    lineStyle: { color: s.color, width: focus === key ? 3.5 : 1.5, opacity: focus === key ? 1 : 0.45 },
    areaStyle: key === focus ? { color: s.color + '22' } : undefined,
  }));

  const chart = {
    legend: { data: Object.values(STATES).map((s) => s.label), textStyle: { color: '#93a1b5' }, top: 0 },
    grid: { left: 44, right: 18, top: 34, bottom: 30 },
    xAxis: { type: 'value', name: '波动 →', nameTextStyle: { color: '#93a1b5' }, axisLine: { lineStyle: { color: '#27324a' } }, splitLine: { show: false } },
    yAxis: { type: 'value', name: '收益', min: 20, max: 100, nameTextStyle: { color: '#93a1b5' }, splitLine: { lineStyle: { color: 'rgba(148,163,184,0.1)' } }, axisLine: { lineStyle: { color: '#27324a' } } },
    series,
  };

  return (
    <div>
      <PageHeader badge="Cognition · 反脆弱" title="反脆弱 · 从波动与混乱中获益"
        subtitle="塔勒布三态：脆弱(凹·惧波动) / 强韧(平·不变) / 反脆弱(凸·受益) —— 拖动波动看收益如何分化" />
      <Card className="mb-6"><p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
        反脆弱不是「强韧」的同义词。强韧只是<strong style={{ color: 'var(--text-primary)' }}>抗住</strong>冲击；反脆弱是<strong style={{ color: 'var(--text-primary)' }}>从冲击中变得更强</strong>。判据看收益对波动的<strong style={{ color: 'var(--text-primary)' }}>凸凹性</strong>：凹则脆弱、平则强韧、凸则反脆弱。系统设计的目标，是把脆弱性挪到敌人那边，把凸性留给自己。
      </p></Card>

      <Grid cols={3} className="mb-6">
        <Stat value={fmt(payoffs.fragile)} label="脆弱态收益（当前波动）" accent="#c41e3a" />
        <Stat value={fmt(payoffs.robust)} label="强韧态收益（近乎不变）" accent="#22d3ee" />
        <Stat value={fmt(payoffs.antifragile)} label="反脆弱态收益（上行）" accent="#10b981" />
      </Grid>

      <Grid cols={2} className="mb-6">
        <Card title="收益曲线 · 拖动波动强度 + 选择聚焦态">
          <div className="flex justify-between text-xs mb-1"><span style={{ color: 'var(--text-secondary)' }}>波动强度 Volatility</span><span className="mono" style={{ color: 'var(--cyber-cyan)' }}>{vol}</span></div>
          <input type="range" min="0" max="100" value={vol} onChange={(e) => setVol(Number(e.target.value))} style={{ width: '100%', accentColor: '#e8a317' }} />
          <div className="flex gap-1 flex-wrap mt-3 mb-3">
            {Object.entries(STATES).map(([k, v]) => (
              <button key={k} onClick={() => setFocus(k)} className="text-xs px-3 py-1 rounded mono"
                style={{ background: k === focus ? v.color + '33' : 'var(--bg-elevated)', color: k === focus ? '#fff' : 'var(--text-secondary)', border: `1px solid ${k === focus ? v.color : 'transparent'}`, cursor: 'pointer' }}>{v.label}</button>
            ))}
          </div>
          <EChart option={chart} style={{ height: 220 }} />
        </Card>
        <Card title={STATES[focus].label + ' · 解读'}>
          <div className="text-xs mono mb-2" style={{ color: STATES[focus].color }}>曲率：{STATES[focus].shape}</div>
          <p className="text-sm leading-relaxed mb-3" style={{ color: 'var(--text-secondary)' }}>{STATES[focus].desc}</p>
          <div className="p-3 rounded" style={{ background: STATES[focus].color + '14', border: `1px solid ${STATES[focus].color}33` }}>
            <span className="text-[10px] mono uppercase" style={{ color: STATES[focus].color }}>项目映射</span>
            <p className="text-xs mt-1" style={{ color: 'var(--text-secondary)' }}>{STATES[focus].proj}</p>
          </div>
          <p className="text-[11px] mt-3" style={{ color: 'var(--text-tertiary)' }}>提示：波动拉满时，脆弱态加速下坠、反脆弱态借势上行——同一个冲击，凸凹决定生死。</p>
        </Card>
      </Grid>

      <Card title="五个核心概念 · 反脆弱工具箱" className="mb-6">
        <Grid cols={5}>
          {CONCEPTS.map(([t, d]) => (
            <div key={t} className="os-card p-3" style={{ background: 'var(--bg-elevated)' }}>
              <div className="text-xs font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>{t}</div>
              <p className="text-[11px]" style={{ color: 'var(--text-tertiary)' }}>{d}</p>
            </div>
          ))}
        </Grid>
      </Card>

      <Card title="用法 · 与各模块的接口">
        <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
          反脆弱是<span className="mono" style={{ color: 'var(--cyber-cyan)' }}>能源安全 / 供应链 / 财政体系 / 治国沙盒</span>的压力测试视角：冗余不是浪费而是凸性期权；过度去杠杆化的「效率」是把系统推向凹性。设计制度时先问一句——<strong style={{ color: 'var(--text-primary)' }}>这个安排，在尾部冲击下是凹还是凸？</strong>
        </p>
      </Card>
      <p className="text-xs mt-6" style={{ color: 'var(--text-tertiary)' }}>本模型为分析框架与思想工具，payoff 曲线与参数为示意，用于结构化思考而非实证测量。</p>
    </div>
  );
}
