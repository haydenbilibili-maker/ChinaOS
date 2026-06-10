import React, { useState } from 'react';
import { PageHeader, Card, Grid, Stat, CrossLinks } from '../../app/ui.jsx';
import EChart from '../../lib/viz/EChart.jsx';

// ============================================================================
// 认知内核 · 现实主义国际关系理论（含米尔斯海默进攻性现实主义）
// ============================================================================

const SCHOOLS = {
  classical: {
    label: '古典现实主义', rep: '汉斯·摩根索《国家间政治》(1948)', unit: '人性',
    tenet: '权力政治根植于人性之恶（求权意志）。国家如人，永远追逐权力；道德服从于国家利益（national interest defined as power）。',
    pred: '中美博弈是大国求权本性的延续；均势与审慎外交是和平的现实条件。',
    radar: [90, 40, 55, 60, 50],
  },
  structural: {
    label: '结构（防御性）现实主义', rep: '肯尼斯·华尔兹《国际政治理论》(1979)', unit: '体系结构',
    tenet: '冲突源于国际体系的无政府状态，而非人性。国家是安全最大化者，追求「适度」权力即可；过度扩张反招制衡（防御性）。',
    pred: '体系会自发产生制衡；中国理性上应避免过度扩张，守成大国应给予安全空间。',
    radar: [50, 95, 60, 50, 65],
  },
  offensive: {
    label: '进攻性现实主义', rep: '约翰·米尔斯海默《大国政治的悲剧》(2001)', unit: '体系结构（悲观）',
    tenet: '无政府状态下，没有国家能确知他国意图，唯一的安全保障是成为体系霸主。国家是权力最大化者——能多强就多强，直到成为地区霸权并阻止他洲出现对手。',
    pred: '「中国不能和平崛起」：中国必然寻求亚洲地区霸权，美国必然遏制，安全竞争与冲突风险结构性上升——大国政治的悲剧。',
    radar: [55, 90, 98, 40, 85],
  },
};
const RADAR_IND = [{ name: '人性悲观', max: 100 }, { name: '体系决定', max: 100 }, { name: '权力最大化', max: 100 }, { name: '合作空间', max: 100 }, { name: '冲突预期', max: 100 }];

// 中美综合国力（示意，进攻性现实主义读法：逼近交叉=最危险窗口）
const transition = {
  legend: { data: ['美国', '中国'], textStyle: { color: '#93a1b5' }, top: 0 },
  grid: { left: 40, right: 16, top: 30, bottom: 24 },
  xAxis: { type: 'category', data: ['1990', '2000', '2010', '2020', '2030E', '2040E'], axisLine: { lineStyle: { color: '#27324a' } } },
  yAxis: { type: 'value', max: 100, splitLine: { lineStyle: { color: 'rgba(148,163,184,0.1)' } } },
  series: [
    { name: '美国', type: 'line', smooth: true, data: [100, 100, 95, 90, 86, 82], lineStyle: { color: '#22d3ee', width: 2 }, itemStyle: { color: '#22d3ee' } },
    { name: '中国', type: 'line', smooth: true, data: [20, 35, 55, 72, 84, 92], lineStyle: { color: '#c41e3a', width: 2 }, itemStyle: { color: '#c41e3a' }, areaStyle: { color: 'rgba(196,30,58,0.08)' } },
  ],
};

const MEARSHEIMER = [
  ['① 国际体系无政府', '没有凌驾于国家之上的世界政府。'],
  ['② 大国都拥有进攻性军力', '彼此都有伤害对方的能力。'],
  ['③ 意图永远不可确知', '今天的友邦可能是明天的敌人，无法确知。'],
  ['④ 生存是首要目标', '一切其他目标都从属于生存。'],
  ['⑤ 大国是理性行为体', '会战略性地计算如何最大化生存概率。'],
];

export default function Page() {
  const [s, setS] = useState('offensive');
  const sc = SCHOOLS[s];
  return (
    <div>
      <PageHeader badge="Cognition · 现实主义" title="现实主义 · 大国政治的力量逻辑"
        subtitle="古典 / 结构（防御性） / 进攻性 —— 剥离叙事，以权力与体系结构推演大国行为" />
      <Card className="mb-6"><p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
        现实主义把国际政治理解为<strong style={{ color: 'var(--text-primary)' }}>无政府状态下的权力竞争</strong>：国家的首要目标是生存，道德与制度从属于实力与利益。三大流派对「国家求权的程度」给出不同答案——从人性、到体系、到霸权逻辑，悲观程度递增。
      </p></Card>
      <div className="flex gap-1 flex-wrap mb-4">
        {Object.entries(SCHOOLS).map(([k, v]) => (
          <button key={k} onClick={() => setS(k)} className="text-sm px-3 py-1.5 rounded mono"
            style={{ background: k === s ? 'rgba(196,30,58,0.2)' : 'var(--bg-elevated)', color: k === s ? '#fff' : 'var(--text-secondary)', border: `1px solid ${k === s ? 'var(--china-red)' : 'transparent'}`, cursor: 'pointer' }}>{v.label}</button>
        ))}
      </div>

      <Grid cols={2} className="mb-6">
        <Card title={sc.label}>
          <div className="text-xs mono mb-2" style={{ color: 'var(--cyber-cyan)' }}>{sc.rep} · 分析单元：{sc.unit}</div>
          <p className="text-sm leading-relaxed mb-3" style={{ color: 'var(--text-secondary)' }}>{sc.tenet}</p>
          <div className="p-3 rounded" style={{ background: 'rgba(196,30,58,0.08)', border: '1px solid rgba(196,30,58,0.2)' }}>
            <span className="text-[10px] mono uppercase" style={{ color: 'var(--china-red)' }}>对中美博弈的预测</span>
            <p className="text-xs mt-1" style={{ color: 'var(--text-secondary)' }}>{sc.pred}</p>
          </div>
        </Card>
        <Card title="流派立场画像（示意）">
          <EChart option={{ radar: { indicator: RADAR_IND, axisName: { color: '#93a1b5' }, splitLine: { lineStyle: { color: 'rgba(148,163,184,0.15)' } }, splitArea: { show: false } }, series: [{ type: 'radar', data: [{ value: sc.radar, name: sc.label, lineStyle: { color: '#c41e3a' }, areaStyle: { color: 'rgba(196,30,58,0.14)' } }] }] }} style={{ height: 260 }} />
        </Card>
      </Grid>

      {s === 'offensive' && (
        <Card title="米尔斯海默 · 五大假设 → 必然结论" className="mb-6">
          <Grid cols={5} className="mb-3">
            {MEARSHEIMER.map(([t, d]) => (
              <div key={t} className="os-card p-3" style={{ background: 'var(--bg-elevated)' }}>
                <div className="text-xs font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>{t}</div>
                <p className="text-[11px]" style={{ color: 'var(--text-tertiary)' }}>{d}</p>
              </div>
            ))}
          </Grid>
          <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
            五个假设单独看都温和，叠加却推出冷酷结论：<strong style={{ color: 'var(--text-primary)' }}>每个大国都被迫追求权力最大化，直到成为本地区霸主</strong>，并阻止其他地区出现对等霸权。由此，米尔斯海默断言「<strong style={{ color: 'var(--china-red)' }}>中国不能和平崛起</strong>」——这不是道德判断，而是结构推演。
          </p>
        </Card>
      )}

      <Card title="权力转移 · 中美综合国力（示意 · 进攻性现实主义读法）" className="mb-6">
        <EChart option={transition} style={{ height: 240 }} />
        <p className="text-[11px] mt-1" style={{ color: 'var(--text-tertiary)' }}>进攻性现实主义认为：守成霸权与崛起大国的实力曲线<strong style={{ color: 'var(--text-secondary)' }}>逼近交叉的窗口期</strong>最危险（修昔底德陷阱）。曲线为示意，非预测。</p>
      </Card>

      <Card title="批判与边界">
        <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
          现实主义被批评为低估了经济相互依赖、国际制度、国内政治与观念（建构主义）的作用；进攻性现实主义尤其被指过度悲观、自我实现。作为思想工具，它的价值在于<strong style={{ color: 'var(--text-primary)' }}>提供一个「最坏情况」的结构基线</strong>——理解对手如何用这套逻辑思考，本身就是战略素养。
        </p>
      </Card>
      <CrossLinks className="mt-6" links={[
        { to: '/diplomacy', label: '外交全局框架盘', note: '四圈层布局与张力轴，正是现实主义「自助体系」的操作化。' },
        { to: '/thucydides', label: '修昔底德陷阱', note: '结构现实主义在霸权过渡情境下的悲观推论与反例。' },
        { to: '/constructivism', label: '建构主义', note: '对照阵营：观念与身份如何改写「无政府状态」的含义。' },
      ]} />
      <p className="text-xs mt-6" style={{ color: 'var(--text-tertiary)' }}>本模块为国际关系理论梳理与思想工具，曲线/雷达为示意，不构成对现实事件的预测。</p>
    </div>
  );
}
