import React, { useState, useMemo } from 'react';
import { PageHeader, Card, Grid, Stat } from '../../app/ui.jsx';
import EChart from '../../lib/viz/EChart.jsx';
import { radarOpt } from '../shared/chartHelpers.js';
import { IntroCard, SelectorBar, FrameworkTrio, ModuleFooter } from '../shared/ModuleParadigm.jsx';

const TRACKS = [
  { key: 'semi', label: '半导体材料', accent: '#c41e3a', maturity: 35, desc: '光刻胶、电子特气、大硅片等环节仍面临非对称限制；自主化率约 35%，是卡脖子最集中领域。' },
  { key: 'aero', label: '航空航天', accent: '#22d3ee', maturity: 75, desc: '碳纤维 T800 级稳定量产，高温合金单晶叶片攻关中；航空发动机材料决定产业上限。' },
  { key: 'rare', label: '稀土永磁', accent: '#10b981', maturity: 98, desc: '全球产量占比 70%+，永磁材料全球市场占有率 95%；资源优势转化为磁性、光学器件垄断地位。' },
  { key: 'battery', label: '先进电池', accent: '#e8a317', maturity: 92, desc: '正极、隔膜、电解液国产化率高；固态电池与钠离子是下一代竞争焦点。' },
];

export default function Page() {
  const [track, setTrack] = useState('semi');
  const t = TRACKS.find((x) => x.key === track) || TRACKS[0];

  const maturityRadar = useMemo(() => radarOpt(
    ['半导体材料', '航空航天复合材', '稀土永磁', '先进电池材料', '生物医用材料'],
    track === 'semi' ? [t.maturity, 75, 98, 92, 60]
      : track === 'aero' ? [35, t.maturity, 98, 92, 60]
        : track === 'rare' ? [35, 75, t.maturity, 92, 60]
          : [35, 75, 98, t.maturity, 60],
    { name: '国产成熟度', color: t.accent },
  ), [track, t]);

  const paradigmRadar = radarOpt(['算力驱动', '数据积累', '实验通量', '周期缩短', '成本下降'],
    track === 'semi' ? [95, 85, 92, 98, 80] : [30, 45, 40, 50, 40],
    { name: track === 'semi' ? '2024 材料基因组' : '2020 水平', color: t.accent });

  const dependencyFunnel = {
    tooltip: { trigger: 'item', formatter: '{b}: {c}' },
    series: [{
      type: 'funnel', left: '10%', top: 12, bottom: 12, width: '80%',
      min: 0, max: 100, sort: 'descending', gap: 2,
      label: { show: true, position: 'inside', fontSize: 10, color: '#fff' },
      data: [
        { value: 100, name: '初级原材料（自给）', itemStyle: { color: '#8b0000' } },
        { value: 65, name: '通用工程材料', itemStyle: { color: '#c41e3a' } },
        { value: track === 'semi' ? 25 : 30, name: '特种先进材料', itemStyle: { color: '#e8a317' } },
        { value: track === 'semi' ? 12 : 20, name: '极端核心辅料', itemStyle: { color: t.accent } },
      ],
    }],
  };

  return (
    <div>
      <PageHeader badge="Advanced Materials · 深度透视" title="关键材料 · 卡脖子与国产替代" subtitle="高端材料 · 稀土 · 碳纤维 · 半导体材料" />
      <IntroCard>现实主义逻辑下，材料是所有技术的「容器」。航空发动机高温合金、光刻胶、电子特气及大硅片等环节仍面临<strong style={{ color: 'var(--text-primary)' }}>非对称外部限制</strong>——体制正通过材料基因组工程将研发从试错法推向设计法。</IntroCard>

      <Grid cols={4} className="mb-6">
        <Stat value="7.7 万亿" label="产业产值（2023）" accent="#e8a317" />
        <Stat value={`${t.maturity}%`} label={`${t.label}成熟度 · 切换`} accent={t.accent} />
        <Stat value="1/3" label="研发周期压缩比" accent="#22d3ee" />
        <Stat value="70%+" label="稀土全球产量占比" accent="#10b981" />
      </Grid>

      <Card title="交互 · 材料赛道选择器" className="mb-6">
        <SelectorBar items={TRACKS} activeKey={track} onSelect={setTrack} />
        <div className="os-card p-4 mb-4" style={{ background: 'var(--bg-elevated)', borderLeft: `3px solid ${t.accent}` }}>
          <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{t.desc}</p>
        </div>
        <Grid cols={2}>
          <Card title="子行业自主化率雷达（随赛道切换）"><EChart option={maturityRadar} style={{ height: 240 }} /></Card>
          <Card title="材料自主化漏斗"><EChart option={dependencyFunnel} style={{ height: 240 }} /></Card>
        </Grid>
      </Card>

      <Grid cols={2} className="mb-6">
        <Card title="材料基因组 · 研发范式（随赛道切换）"><EChart option={paradigmRadar} style={{ height: 260 }} /></Card>
        <Card title="核心赛道 · 定义产业上限">
          <div className="space-y-2">
            {[['碳纤维', 'T800 级稳定量产，支撑航空航天减重。', '#c41e3a'],
              ['第三代半导体', 'SiC 主导电动汽车补能革命。', '#22d3ee'],
              ['高性能合金', '单晶叶片攻克航空发动机难关。', '#e8a317'],
              ['稀土功能材料', '资源优势转全球垄断地位。', '#10b981']].map(([tit, d, c]) => (
              <div key={tit} style={{ borderLeft: `2px solid ${c}`, paddingLeft: 10 }}>
                <div className="text-xs font-semibold" style={{ color: 'var(--text-primary)' }}>{tit}</div>
                <p className="text-[11px] mt-0.5" style={{ color: 'var(--text-tertiary)' }}>{d}</p>
              </div>
            ))}
          </div>
        </Card>
      </Grid>

      <FrameworkTrio cards={[
        { title: '卡脖子边界', subtitle: '12% 自主化', body: '极端核心辅料层自主化率仅约 12%，是非对称限制最集中的物理边界；突破路径是材料、设计与制造工艺的深度嵌合。', pillars: [['光刻胶', '半导体短板。'], ['电子特气', '纯度壁垒。'], ['大硅片', '尺寸与缺陷控制。']] },
        { title: '材料基因组', subtitle: 'AI for Science', body: '高通量计算 + AI 预测将研发周期压缩至传统模式约 1/3；算力驱动与实验通量是范式跃迁核心。', pillars: [['65% 计算介入', '高通量筛选。'], ['~88% 预测准确度', 'AI 辅助。'], ['中试基地', '打通死亡之谷。']] },
        { title: '战略筹码', subtitle: '稀土 · 专利', body: '稀土永磁全球市场占有率 95%；石墨烯专利产出 Top 1——资源优势是谈判筹码。', pillars: [['95% 永磁市占', '战略杠杆。'], ['Top 1 石墨烯', '专利布局。'], ['出口管制', '双向博弈工具。']] },
      ]} />

      <ModuleFooter moduleId="materials" sourceNote="由 china.html「关键材料」专题迁移升级" />
    </div>
  );
}
