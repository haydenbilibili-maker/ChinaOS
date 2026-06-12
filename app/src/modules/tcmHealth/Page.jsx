import React, { useState, useMemo } from 'react';
import { PageHeader, Card, Grid, Stat } from '../../app/ui.jsx';
import EChart from '../../lib/viz/EChart.jsx';
import { IntroCard, SelectorBar, TimelineBar, FrameworkTrio, ModuleFooter } from '../shared/ModuleParadigm.jsx';
import { categoryX, valueY, GRID, LEGEND, stackedBarOpt, radarOpt } from '../shared/chartHelpers.js';

// ============================================================================
// 中医药振兴 · 重大工程 / 传承创新 / 健康消费
// asOf 2026-06-11 · 公开资料示意
// ============================================================================

const AS_OF = '2026-06-11';

const TRACKS = [
  {
    key: 'industry', label: '产业振兴', accent: '#c41e3a',
    scores: [85, 78, 82, 70, 75],
    thesis: '《中医药振兴发展重大工程》驱动全产业链升级——中药材种植、中成药制造、配方颗粒与经典名方是产业化的主赛道。',
    points: ['中药材种植标准化与 GAP 认证', '中成药集采与质量评价', '中药配方颗粒国标统一', '经典名方免临床加速上市'],
    lever: '国家中医药管理局 + 工信部产业工程。',
  },
  {
    key: 'innovation', label: '传承创新', accent: '#22d3ee',
    scores: [72, 88, 75, 82, 68],
    thesis: '「说明白、讲清楚」中医药机理是现代化的核心命题——循证医学、真实世界研究与 AI 辅助组方是传承创新的技术接口。',
    points: ['中医药循证医学中心建设', '真实世界数据与疗效评价', 'AI 辅助方剂配伍与新药发现', '中西医结合临床路径标准化'],
    lever: '科技部 + 卫健委临床研究体系。',
  },
  {
    key: 'culture', label: '文化出海', accent: '#e8a317',
    scores: [78, 65, 70, 88, 80],
    thesis: '中医药是中华文化「走出去」的独特载体——针灸、推拿、养生理念在 RCEP 与「一带一路」沿线加速渗透。',
    points: ['中医药海外中心与孔子学院联动', '针灸纳入多国医保体系', '中医药服务贸易与旅游康养', 'ISO 中医药国际标准制定参与'],
    lever: '文旅部 + 商务部服务贸易 + 标准委。',
  },
  {
    key: 'consumption', label: '健康消费', accent: '#10b981',
    scores: [80, 72, 68, 75, 85],
    thesis: '银发经济与亚健康人群驱动中医药健康消费扩容——药食同源、保健调理与中医治未病纳入大健康产业链。',
    points: ['药食同源目录扩容与监管', '中医治未病健康工程', '互联网+中医诊疗与慢病管理', '康养旅游与中医药特色小镇'],
    lever: '卫健委治未病工程 + 市场监管总局。',
  },
];

const PHASES = [
  { period: '2016–2019', title: '立法保障', accent: '#64748b', desc: '《中医药法》颁布，中医药发展上升为国家战略，经典名方政策破冰。' },
  { period: '2021–2023', title: '重大工程', accent: '#e8a317', desc: '《中医药振兴发展重大工程》印发，八项工程系统布局产业与传承。' },
  { period: '2024–', title: '健康消费', accent: '#c41e3a', desc: '政府工作报告强调中医药传承创新，银发经济与治未病纳入大健康主线。' },
];

const DIMS = ['产业规模', '创新转化', '文化影响', '健康消费', '政策支撑'];

export default function Page() {
  const [track, setTrack] = useState('industry');
  const [phaseIdx, setPhaseIdx] = useState(2);
  const t = TRACKS.find((x) => x.key === track) ?? TRACKS[0];

  const marketOpt = useMemo(() => ({
    grid: GRID, tooltip: { trigger: 'axis' },
    legend: { ...LEGEND, top: 0, data: ['中成药', '中药饮片', '配方颗粒'] },
    xAxis: categoryX(['2018', '2020', '2022', '2024', '2026E']),
    yAxis: valueY({ name: '亿元' }),
    series: [
      { name: '中成药', type: 'line', smooth: true, data: [5800, 6200, 6500, 6800, 7200], lineStyle: { color: '#c41e3a', width: 2 } },
      { name: '中药饮片', type: 'line', smooth: true, data: [2100, 2300, 2500, 2700, 2900], lineStyle: { color: '#e8a317', width: 2 } },
      { name: '配方颗粒', type: 'bar', barWidth: 14, data: [180, 320, 480, 650, 850], itemStyle: { color: '#22d3ee', borderRadius: 3 } },
    ],
  }), []);

  const hospitalOpt = stackedBarOpt({
    categories: ['2015', '2018', '2021', '2024', '2026E'],
    series: [
      { name: '中医类医院', data: [3800, 4200, 4600, 5000, 5400], itemStyle: { color: '#c41e3a' } },
      { name: '中西医结合', data: [1200, 1400, 1600, 1800, 2000], itemStyle: { color: '#22d3ee' } },
      { name: '基层中医馆', data: [800, 1500, 3200, 4800, 6000], itemStyle: { color: '#10b981' } },
    ],
  });

  const exportOpt = useMemo(() => ({
    grid: { left: 56, right: 24, top: 16, bottom: 24 },
    xAxis: valueY({ max: 100 }),
    yAxis: categoryX(['东南亚', '日韩', '欧洲', '北美', '非洲']),
    series: [{
      type: 'bar', barWidth: 14, itemStyle: { borderRadius: 3, color: t.accent },
      data: track === 'culture' ? [92, 85, 55, 35, 70] : [80, 72, 48, 30, 60],
      label: { show: true, position: 'right', color: '#93a1b5', fontSize: 9 },
    }],
  }), [track, t]);

  return (
    <div>
      <PageHeader
        badge="政府工作报告 · 中医药"
        title="中医药 · 振兴与健康消费"
        subtitle="重大工程 · 传承创新 · 治未病"
      />

      <IntroCard>
        中医药是兼具<strong style={{ color: 'var(--text-primary)' }}>文化软实力、健康产业与科技创新</strong>三重属性的战略资源。
        2024—2025 政府工作报告持续强调「促进中医药传承创新」，《中医药振兴发展重大工程》八项工程系统布局——与银发经济、治未病、健康消费深度耦合。
        数据截至 <span className="mono" style={{ color: 'var(--cyber-cyan)' }}>{AS_OF}</span>，公开资料示意。
      </IntroCard>

      <Grid cols={4} className="mb-6">
        <Stat value="~1.1万亿" label="中医药产业规模" accent="#c41e3a" />
        <Stat value="~6000" label="基层中医馆（2026E）" accent="#10b981" />
        <Stat value="~850亿" label="配方颗粒市场" accent="#22d3ee" />
        <Stat value={AS_OF} label="数据截至" accent="#8b5cf6" />
      </Grid>

      <Grid cols={2} className="mb-6">
        <Card title="中医药细分市场（示意 · 亿元）"><EChart option={marketOpt} style={{ height: 240 }} /></Card>
        <Card title="中医医疗服务网络扩张"><EChart option={hospitalOpt} style={{ height: 240 }} /></Card>
      </Grid>

      <Card title="政策演进 · 时间线" className="mb-6">
        <TimelineBar stages={PHASES} activeIdx={phaseIdx} onSelect={setPhaseIdx} />
      </Card>

      <Card title="交互 · 振兴主线" className="mb-4">
        <SelectorBar items={TRACKS} activeKey={track} onSelect={setTrack} />
      </Card>

      <Grid cols={2} className="mb-6">
        <div className="os-card p-5" style={{ background: 'var(--bg-elevated)', borderLeft: `3px solid ${t.accent}` }}>
          <div className="text-[10px] mono uppercase mb-2" style={{ color: t.accent }}>{t.label} · 振兴论点</div>
          <p className="text-sm leading-relaxed mb-3" style={{ color: 'var(--text-secondary)' }}>{t.thesis}</p>
          <div className="space-y-2 mb-3">
            {t.points.map((pt) => (
              <div key={pt} style={{ borderLeft: `2px solid ${t.accent}`, paddingLeft: 10 }}>
                <p className="text-[11px] leading-relaxed" style={{ color: 'var(--text-tertiary)' }}>{pt}</p>
              </div>
            ))}
          </div>
          <div className="text-xs" style={{ color: 'var(--text-tertiary)' }}>
            <span style={{ color: '#e8a317' }}>政策杠杆 · </span>{t.lever}
          </div>
        </div>
        <Card title={`${t.label} · 振兴五维评估`}>
          <EChart option={radarOpt(DIMS, t.scores, { name: t.label, color: t.accent })} style={{ height: 260 }} />
        </Card>
      </Grid>

      <Card title="中医药文化出海渗透度（示意 · 相对指数）" className="mb-6">
        <EChart option={exportOpt} style={{ height: 220 }} />
      </Card>

      <Card title="十五五 · 指标 / 约束 / 路径" className="mb-6">
        <Grid cols={3}>
          <div style={{ borderLeft: '2px solid #22d3ee', paddingLeft: 10 }}>
            <div className="text-xs font-semibold mb-1" style={{ color: '#22d3ee' }}>核心指标</div>
            <p className="text-[11px] leading-relaxed" style={{ color: 'var(--text-tertiary)' }}>中医药产业规模突破 1.5 万亿；基层中医馆全覆盖；经典名方上市加速；中医药国际标准话语权提升。</p>
          </div>
          <div style={{ borderLeft: '2px solid #e8a317', paddingLeft: 10 }}>
            <div className="text-xs font-semibold mb-1" style={{ color: '#e8a317' }}>关键约束</div>
            <p className="text-[11px] leading-relaxed" style={{ color: 'var(--text-tertiary)' }}>循证医学证据体系尚不完善；中药材质量与溯源；中西医体系融合的制度摩擦；国际市场准入与标准壁垒。</p>
          </div>
          <div style={{ borderLeft: '2px solid #10b981', paddingLeft: 10 }}>
            <div className="text-xs font-semibold mb-1" style={{ color: '#10b981' }}>推进路径</div>
            <p className="text-[11px] leading-relaxed" style={{ color: 'var(--text-tertiary)' }}>重大工程落地 → 循证与创新转化 → 健康消费扩容 → 文化出海与标准制定。</p>
          </div>
        </Grid>
      </Card>

      <FrameworkTrio cards={[
        { key: 'salt', title: '盐铁逻辑', subtitle: '战略资源', body: '中医药是文化主权与健康自主的复合资产——从中药材资源到经典名方，关键环节纳入国家战略管控与产业扶持。', pillars: [['资源', '药材基地。'], ['标准', '国标统一。'], ['管控', '质量溯源。']] },
        { key: 'stone', title: '摸石头方法论', subtitle: '循证试验', body: '真实世界研究、经典名方免临床、AI 辅助组方——在现代医学框架内灰度验证中医药疗效与机理。', pillars: [['灰度', '真实世界。'], ['验证', '循证中心。'], ['融合', '中西医结合。']] },
        { key: 'path', title: '升级路径', subtitle: '传承到产业', body: '从经验传承到标准化产业化，再到健康消费与文化出海——中医药振兴是文化、产业、健康三位一体的升级路径。', pillars: [['传承', '经典名方。'], ['产业', '配方颗粒。'], ['出海', '文化载体。']] },
      ]} />

      <Card title="系统结论">
        <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
          中医药振兴的深层逻辑是<strong style={{ color: 'var(--text-primary)' }}>文化自信与健康自主的产业化表达</strong>——重大工程提供制度与资金底座，循证创新解决「说明白、讲清楚」的现代性命题，健康消费与银发经济提供需求侧纵深。
        </p>
      </Card>

      <ModuleFooter moduleId="tcmHealth" sourceNote={`数据截至 ${AS_OF}`} />
    </div>
  );
}
