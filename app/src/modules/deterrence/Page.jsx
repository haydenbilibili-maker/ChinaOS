import React, { useState, useMemo } from 'react';
import { PageHeader, Card, Grid, Stat } from '../../app/ui.jsx';
import EChart from '../../lib/viz/EChart.jsx';

// ============================================================================
// 认知内核 · 威慑与冲突战略（托马斯·谢林 Thomas Schelling）
// ----------------------------------------------------------------------------
// 威慑(阻止行动) vs 强制(迫使行动)；可信承诺、边缘政策、相互确保摧毁(MAD)。
// 威慑有效性 = 能力 × 决心 × 沟通可信度（三滑杆 → 实时威慑指数）。
// ============================================================================

const CONCEPTS = [
  ['威慑 Deterrence', '让对手「不去做」——以可信的惩罚威胁，使行动的预期代价超过收益。被动、维持现状。'],
  ['强制 Compellence', '让对手「去做或停止」——以持续施压迫使其改变行为。主动、需对手可见地让步，更难成功。'],
  ['可信承诺 Commitment', '威胁只有被相信才有效。谢林的悖论：自缚手脚、放弃退路，反而强化可信度（破釜沉舟）。'],
  ['边缘政策 Brinkmanship', '蓄意制造「失控滑向灾难」的共有风险，逼对手先退让——胆小鬼博弈的核心手筋。'],
  ['相互确保摧毁 MAD', '双方都有二次打击能力 → 先发制人无收益，恐怖平衡反而稳定。瞄准平民比瞄准导弹更稳。'],
  ['拴住自己的手 Tying Hands', '把决定权交给自动机制/盟约/民意，使「不报复」在政治上不可能——可信度来自不可逆。'],
];

export default function Page() {
  const [p, setP] = useState({ capability: 80, resolve: 60, credibility: 55 });
  // 威慑指数 = 能力 × 决心 × 沟通可信度（几何均值，任一项趋零则整体崩溃）
  const idx = useMemo(() => Math.round(Math.cbrt(p.capability * p.resolve * p.credibility)), [p]);
  const weakest = useMemo(() => Object.entries({ 能力: p.capability, 决心: p.resolve, 可信度: p.credibility }).sort((a, b) => a[1] - b[1])[0], [p]);
  const verdict = idx > 70 ? '稳态威慑' : idx > 45 ? '脆弱威慑' : '威慑失效';
  const vcolor = idx > 70 ? '#10b981' : idx > 45 ? '#e8a317' : '#c41e3a';

  const gauge = {
    series: [{ type: 'gauge', min: 0, max: 100, progress: { show: true, width: 14, itemStyle: { color: vcolor } },
      axisLine: { lineStyle: { width: 14, color: [[1, '#1a2333']] } }, axisLabel: { color: '#5b6a82', fontSize: 10 }, axisTick: { show: false }, splitLine: { show: false },
      pointer: { itemStyle: { color: '#93a1b5' } }, detail: { valueAnimation: true, color: '#e8edf6', fontSize: 28, offsetCenter: [0, '40%'] }, data: [{ value: idx }] }],
  };
  const radar = {
    radar: { indicator: [{ name: '能力 Capability', max: 100 }, { name: '决心 Resolve', max: 100 }, { name: '沟通可信度 Credibility', max: 100 }], axisName: { color: '#93a1b5' }, splitLine: { lineStyle: { color: 'rgba(148,163,184,0.15)' } }, splitArea: { show: false } },
    series: [{ type: 'radar', data: [{ value: [p.capability, p.resolve, p.credibility], name: '威慑三要素', lineStyle: { color: '#c41e3a' }, areaStyle: { color: 'rgba(196,30,58,0.14)' } }] }],
  };
  const Slider = ({ k, label, hint }) => (
    <div className="mb-3">
      <div className="flex justify-between text-xs mb-1"><span style={{ color: 'var(--text-secondary)' }}>{label}</span><span className="mono" style={{ color: '#22d3ee' }}>{p[k]}</span></div>
      <input type="range" min="0" max="100" value={p[k]} onChange={(e) => setP({ ...p, [k]: Number(e.target.value) })} style={{ width: '100%', accentColor: '#c41e3a' }} />
      <div className="text-[10px] mt-0.5" style={{ color: 'var(--text-tertiary)' }}>{hint}</div>
    </div>
  );

  return (
    <div>
      <PageHeader badge="Cognition · 威慑战略" title="威慑与冲突战略 · 谢林的可信博弈"
        subtitle="威慑(阻止) vs 强制(迫使) —— 威慑有效性 = 能力 × 决心 × 沟通可信度，三者缺一不可" />
      <Card className="mb-6"><p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
        托马斯·谢林把冲突当作<strong style={{ color: 'var(--text-primary)' }}>讨价还价</strong>：胜负不取决于谁更强，而取决于谁的威胁更<strong style={{ color: 'var(--text-primary)' }}>可信</strong>。最反直觉的洞见——<strong style={{ color: 'var(--china-red)' }}>「拴住自己的手」反而增强可信度</strong>：放弃退路、把报复交给自动机制，使「不动手」在政治上不可能，对手便不敢试探。
      </p></Card>

      <Grid cols={3} className="mb-6">
        <Stat value={idx} label="威慑指数（能力×决心×可信度）" accent={vcolor} />
        <Stat value={verdict} label="威慑状态判定" accent={vcolor} />
        <Stat value={weakest[0]} label={`最薄弱环节（${weakest[1]}）`} accent="#e8a317" />
      </Grid>

      <Grid cols={2} className="mb-6">
        <Card title="威慑三要素 · 拖动调参">
          <Slider k="capability" label="能力 Capability" hint="有没有实施惩罚的实力（军力 / 经济筹码）" />
          <Slider k="resolve" label="决心 Resolve" hint="愿不愿意承受代价真的动手（意志、利益攸关度）" />
          <Slider k="credibility" label="沟通可信度 Credibility" hint="对手是否相信你会做——信号、承诺、不可逆" />
          <p className="text-[11px] mt-2" style={{ color: 'var(--text-tertiary)' }}>提示：指数取三者几何均值——任一要素趋零，整条威慑链就崩溃。强大军力若无人相信你会用，等于零威慑。</p>
        </Card>
        <Card title="威慑画像 + 威慑指数表">
          <EChart option={radar} style={{ height: 190 }} />
          <EChart option={gauge} style={{ height: 150 }} />
        </Card>
      </Grid>

      <Card title="谢林核心概念 · 冲突即讨价还价" className="mb-6">
        <Grid cols={2}>
          {CONCEPTS.map(([t, d]) => (
            <div key={t} style={{ borderLeft: '2px solid var(--china-red)', paddingLeft: 10 }}>
              <div className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>{t}</div>
              <p className="text-xs mt-1 leading-relaxed" style={{ color: 'var(--text-tertiary)' }}>{d}</p>
            </div>
          ))}
        </Grid>
      </Card>

      <Card title="现实映射 · 三个威慑现场">
        <Grid cols={3}>
          <div className="p-3 rounded" style={{ background: 'rgba(196,30,58,0.08)', border: '1px solid rgba(196,30,58,0.2)' }}>
            <span className="text-[10px] mono uppercase" style={{ color: 'var(--china-red)' }}>台海 A2/AD</span>
            <p className="text-xs mt-1" style={{ color: 'var(--text-secondary)' }}>反介入/区域拒止以「抬高外部干预成本」实施威慑；战略模糊则是刻意保留可信度的「不拴手」打法。</p>
          </div>
          <div className="p-3 rounded" style={{ background: 'rgba(34,211,238,0.08)', border: '1px solid rgba(34,211,238,0.2)' }}>
            <span className="text-[10px] mono uppercase" style={{ color: '#22d3ee' }}>核威慑 MAD</span>
            <p className="text-xs mt-1" style={{ color: 'var(--text-secondary)' }}>二次打击能力（核潜艇/机动发射）保证恐怖平衡；瞄准对方城市而非导弹，反而让威慑更稳定。</p>
          </div>
          <div className="p-3 rounded" style={{ background: 'rgba(232,163,23,0.08)', border: '1px solid rgba(232,163,23,0.2)' }}>
            <span className="text-[10px] mono uppercase" style={{ color: '#e8a317' }}>关税边缘博弈</span>
            <p className="text-xs mt-1" style={{ color: 'var(--text-secondary)' }}>互加关税是经济版边缘政策：制造共有的「脱钩」风险逼对方先退，用国内立法「拴手」提高威胁可信度。</p>
          </div>
        </Grid>
      </Card>
      <p className="text-xs mt-6" style={{ color: 'var(--text-tertiary)' }}>本模型为博弈论分析框架与思想工具，参数与权重为示意，用于结构化思考而非实证测量。</p>
    </div>
  );
}
