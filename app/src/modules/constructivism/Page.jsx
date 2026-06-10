import React, { useState } from 'react';
import { PageHeader, Card, Grid, Stat } from '../../app/ui.jsx';
import EChart from '../../lib/viz/EChart.jsx';

// ============================================================================
// 认知内核 · 建构主义国际关系理论（亚历山大·温特 Alexander Wendt）
// ----------------------------------------------------------------------------
// 核心：利益由身份建构、身份由互动建构；「无政府状态是国家造就的」。
// 三种无政府文化（霍布斯/洛克/康德）决定国家如何看待彼此与安全含义。
// ============================================================================

const CULTURES = {
  hobbes: {
    label: '霍布斯文化 · 敌人', role: '敌人 (Enemy)', accent: '#c41e3a',
    logic: '彼此视为不承认对方生存权的死敌。逻辑是「你死我活」，国家追求消灭或征服对手；自助与生存压倒一切。',
    security: '安全是零和的：一方所得即另一方所失。军备竞赛、先发制人、势力范围争夺成为常态。',
    radar: [95, 20, 90, 10],
  },
  locke: {
    label: '洛克文化 · 对手', role: '对手 (Rival)', accent: '#e8a317',
    logic: '彼此视为竞争对手，但承认对方的生存权与主权。可以激烈竞争，却不以消灭对方为目标——主权与边界被普遍尊重。',
    security: '安全是竞争性但有底线的：默认遵守不灭国的「生存红线」，冲突被规范约束在有限范围内（当今体系的主流文化）。',
    radar: [55, 60, 55, 45],
  },
  kant: {
    label: '康德文化 · 朋友', role: '朋友 (Friend)', accent: '#10b981',
    logic: '彼此视为朋友：争端不诉诸暴力（非暴力规范），且在受到第三方威胁时相互援助（互助规范）。',
    security: '安全是集体的：形成安全共同体，战争从「选项之一」变为「不可想象」。利益被重新定义为共同利益。',
    radar: [15, 95, 20, 90],
  },
};
const RADAR_IND = [
  { name: '冲突倾向', max: 100 }, { name: '合作倾向', max: 100 },
  { name: '自助程度', max: 100 }, { name: '集体认同', max: 100 },
];

// 三种文化的冲突 / 合作倾向对比
const compare = {
  legend: { data: ['冲突倾向', '合作倾向'], textStyle: { color: '#93a1b5' }, top: 0 },
  grid: { left: 40, right: 16, top: 30, bottom: 24 },
  xAxis: { type: 'category', data: ['霍布斯 · 敌人', '洛克 · 对手', '康德 · 朋友'], axisLine: { lineStyle: { color: '#27324a' } }, axisLabel: { color: '#93a1b5' } },
  yAxis: { type: 'value', max: 100, splitLine: { lineStyle: { color: 'rgba(148,163,184,0.1)' } }, axisLabel: { color: '#93a1b5' } },
  series: [
    { name: '冲突倾向', type: 'bar', data: [95, 55, 15], itemStyle: { color: '#c41e3a' } },
    { name: '合作倾向', type: 'bar', data: [20, 60, 95], itemStyle: { color: '#10b981' } },
  ],
};

const CHAIN = [
  ['① 互动', '国家在反复互动中形成对彼此的预期。'],
  ['② 身份', '互动沉淀为身份：敌人 / 对手 / 朋友。'],
  ['③ 利益', '身份界定利益——「我是谁」决定「我要什么」。'],
  ['④ 行为', '利益驱动行为，行为又反馈进下一轮互动。'],
];

export default function Page() {
  const [c, setC] = useState('locke');
  const cu = CULTURES[c];
  return (
    <div>
      <PageHeader badge="Cognition · 建构主义" title="建构主义 · 无政府状态是国家造就的"
        subtitle="温特：利益由身份建构、身份由互动建构 —— 观念与规范，而非物理实力，塑造大国关系" />
      <Card className="mb-6"><p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
        建构主义反对现实主义把无政府状态当作给定的物理事实。温特的名言是<strong style={{ color: 'var(--text-primary)' }}>「无政府状态是国家造就的」(Anarchy is what states make of it)</strong>：同样的无政府结构，国家可以演化出敌人、对手或朋友三种迥异的文化。<strong style={{ color: 'var(--text-primary)' }}>利益不是先天给定的，而是由身份建构；身份又在互动中被建构。</strong>
      </p></Card>

      <div className="flex gap-1 flex-wrap mb-4">
        {Object.entries(CULTURES).map(([k, v]) => (
          <button key={k} onClick={() => setC(k)} className="text-sm px-3 py-1.5 rounded mono"
            style={{ background: k === c ? 'rgba(196,30,58,0.2)' : 'var(--bg-elevated)', color: k === c ? '#fff' : 'var(--text-secondary)', border: `1px solid ${k === c ? cu.accent : 'transparent'}`, cursor: 'pointer' }}>{v.label}</button>
        ))}
      </div>

      <Grid cols={3} className="mb-6">
        <Stat value={cu.role} label="角色定位（互动建构的身份）" accent={cu.accent} />
        <Stat value={cu.radar[0]} label="冲突倾向（示意）" accent="#c41e3a" />
        <Stat value={cu.radar[1]} label="合作倾向（示意）" accent="#10b981" />
      </Grid>

      <Grid cols={2} className="mb-6">
        <Card title={cu.label}>
          <p className="text-sm leading-relaxed mb-3" style={{ color: 'var(--text-secondary)' }}>{cu.logic}</p>
          <div className="p-3 rounded" style={{ background: 'rgba(34,211,238,0.06)', border: '1px solid rgba(34,211,238,0.2)' }}>
            <span className="text-[10px] mono uppercase" style={{ color: 'var(--cyber-cyan)' }}>安全含义</span>
            <p className="text-xs mt-1" style={{ color: 'var(--text-secondary)' }}>{cu.security}</p>
          </div>
        </Card>
        <Card title="该文化的行为画像（示意）">
          <EChart option={{ radar: { indicator: RADAR_IND, axisName: { color: '#93a1b5' }, splitLine: { lineStyle: { color: 'rgba(148,163,184,0.15)' } }, splitArea: { show: false } }, series: [{ type: 'radar', data: [{ value: cu.radar, name: cu.role, lineStyle: { color: cu.accent }, areaStyle: { color: 'rgba(196,30,58,0.1)' } }] }] }} style={{ height: 260 }} />
        </Card>
      </Grid>

      <Card title="建构链条 · 互动 → 身份 → 利益 → 行为" className="mb-6">
        <Grid cols={4} className="mb-3">
          {CHAIN.map(([t, d]) => (
            <div key={t} className="os-card p-3" style={{ background: 'var(--bg-elevated)' }}>
              <div className="text-xs font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>{t}</div>
              <p className="text-[11px]" style={{ color: 'var(--text-tertiary)' }}>{d}</p>
            </div>
          ))}
        </Grid>
        <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
          这条链是一个<strong style={{ color: 'var(--text-primary)' }}>自我强化的循环</strong>：把对方当敌人对待，对方便回以敌意，敌人身份被坐实；反之，善意互动也能逐步重塑身份。结构不是铁笼，而是被实践不断再生产的<strong style={{ color: 'var(--text-primary)' }}>「社会事实」</strong>。
        </p>
      </Card>

      <Card title="三种无政府文化 · 冲突 vs 合作倾向（示意）" className="mb-6">
        <EChart option={compare} style={{ height: 240 }} />
        <p className="text-[11px] mt-1" style={{ color: 'var(--text-tertiary)' }}>同一无政府结构下，三种文化的行为倾向截然不同——决定性变量是观念与规范，而非物质力量分布。柱值为示意。</p>
      </Card>

      <Card title="对中美关系 · 修昔底德陷阱可被观念重构">
        <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
          与进攻性现实主义（中国「不能和平崛起」是结构必然）相对照，建构主义给出截然不同的读法：<strong style={{ color: 'var(--text-primary)' }}>修昔底德陷阱不是物理定律，而是一种「敌人」身份的社会建构</strong>。中美若持续以对手而非敌人互动、培育共享规范，体系文化可从霍布斯滑向洛克乃至康德——陷阱因此<strong style={{ color: 'var(--china-red)' }}>可被观念重构，而非命中注定</strong>。当然，建构主义也被批评为低估了物质实力与安全困境的刚性：身份的重塑漫长且脆弱，恶性循环同样会自我实现。
        </p>
      </Card>
      <p className="text-xs mt-6" style={{ color: 'var(--text-tertiary)' }}>本模块为国际关系理论梳理与思想工具，雷达/柱状为示意，旨在结构化思考而非倡导任何立场或预测现实事件。</p>
    </div>
  );
}
