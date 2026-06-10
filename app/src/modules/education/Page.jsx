import React from 'react';
import { PageHeader, Card, Grid, Stat } from '../../app/ui.jsx';
import EChart from '../../lib/viz/EChart.jsx';

const stemGrowth = {
  grid: { left: 40, right: 20, top: 24, bottom: 28 },
  xAxis: { type: 'category', data: ['2018', '2020', '2022', '2024E'], axisLine: { lineStyle: { color: '#27324a' } }, axisLabel: { color: '#93a1b5' } },
  yAxis: { type: 'value', axisLabel: { formatter: '{value}%', color: '#93a1b5' }, splitLine: { lineStyle: { color: 'rgba(148,163,184,0.1)' } } },
  series: [{ name: 'STEM 毕业生占比', type: 'line', smooth: true, symbol: 'circle', symbolSize: 6, data: [35, 38, 42, 47], lineStyle: { color: '#e8a317', width: 2 }, itemStyle: { color: '#e8a317' }, areaStyle: { color: 'rgba(232,163,23,0.1)' } }],
};
const vocationalRadar = {
  legend: { bottom: 0, textStyle: { color: '#93a1b5', fontSize: 10 } },
  radar: { indicator: [{ name: '社会地位', max: 100 }, { name: '薪酬水平', max: 100 }, { name: '升学通道', max: 100 }, { name: '企业认可度', max: 100 }, { name: '实操设施', max: 100 }], axisName: { color: '#93a1b5' }, splitLine: { lineStyle: { color: 'rgba(148,163,184,0.15)' } }, axisLine: { lineStyle: { color: '#27324a' } }, splitArea: { show: false } },
  series: [{ type: 'radar', data: [
    { value: [30, 45, 20, 55, 50], name: '2020', lineStyle: { color: '#93a1b5' }, itemStyle: { color: '#93a1b5' } },
    { value: [65, 75, 80, 85, 92], name: '2024E', lineStyle: { color: '#22d3ee' }, itemStyle: { color: '#22d3ee' }, areaStyle: { color: 'rgba(34,211,238,0.12)' } },
  ] }],
};
const eduCostRadar = {
  legend: { bottom: 0, textStyle: { color: '#93a1b5', fontSize: 10 } },
  radar: { indicator: [{ name: '校外培训支出', max: 100 }, { name: '素质教育关注度', max: 100 }, { name: '职业技能投资', max: 100 }, { name: '校内资源利用率', max: 100 }, { name: '家庭心理压力', max: 100 }], axisName: { color: '#93a1b5' }, splitLine: { lineStyle: { color: 'rgba(148,163,184,0.15)' } }, axisLine: { lineStyle: { color: '#27324a' } }, splitArea: { show: false } },
  series: [{ type: 'radar', data: [
    { value: [95, 40, 30, 60, 98], name: '「双减」前', lineStyle: { color: '#c41e3a' }, itemStyle: { color: '#c41e3a' } },
    { value: [15, 85, 75, 92, 60], name: '「双减」后预期', lineStyle: { color: '#10b981' }, itemStyle: { color: '#10b981' }, areaStyle: { color: 'rgba(16,185,129,0.15)' } },
  ] }],
};

export default function Page() {
  return (
    <div>
      <PageHeader badge="Education · Talent Supply Chain" title="普职分流 · 高教与人才供给" subtitle="双减 · 职教 · 研发人才 · 学历通胀 —— 教育改革与人才算法重构" />
      <Card className="mb-6"><p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>中国正通过「新工科」建设重塑人才算法，目标是解决高校输出与产业需求之间的「错位」：引导资源向集成电路、人工智能、新能源等战略性领域倾斜，将海量大学毕业生转化为支撑复杂工业体系的「卓越工程师兵团」——从学历红利转向能力溢价。</p></Card>
      <Grid cols={4} className="mb-6">
        <Stat value="60.2%" label="高等教育毛入学率" accent="#e8a317" />
        <Stat value="1,179 万" label="年毕业生规模 · 全球最大工程师池" accent="#c41e3a" />
        <Stat value="635 万" label="研发人员总量 · 世界第一" accent="#22d3ee" />
        <Stat value="ACTIVE" label="职业教育预算增幅 · 技能型社会转型中" accent="#10b981" />
      </Grid>
      <Grid cols={2} className="mb-6">
        <Card title="STEM 毕业生占比趋势（% · 示意）"><EChart option={stemGrowth} style={{ height: 250 }} /></Card>
        <Card title="职教「地位升格」多维评估（2020 vs 2024E · 示意）"><EChart option={vocationalRadar} style={{ height: 250 }} /></Card>
      </Grid>

      <Card title="01 · 工程师红利算法 — 从学历红利到能力溢价" className="mb-6">
        <p className="text-sm leading-relaxed mb-4" style={{ color: 'var(--text-secondary)' }}>"Shifting from academic filters to industrial precision supply." 体制正在把教育系统从「学历筛选器」改造为「产业精准供给链」。</p>
        <Grid cols={3}>
          {[['新工科建设', '资源向集成电路、人工智能、新能源等战略领域倾斜，重塑高校专业结构以对接产业需求。'],
            ['卓越工程师兵团', '将年均千万级毕业生转化为支撑复杂工业体系的工程师群体，人才密度持续上升。'],
            ['错位修复', '核心问题是高校输出与产业需求的结构性错位 —— 学历通胀的另一面是技能缺口。']].map(([t, d]) => (
            <div key={t} style={{ borderLeft: '2px solid #22d3ee', paddingLeft: 10 }}><div className="text-xs font-semibold" style={{ color: 'var(--text-primary)' }}>{t}</div><p className="text-[11px] mt-1 leading-relaxed" style={{ color: 'var(--text-tertiary)' }}>{d}</p></div>
          ))}
        </Grid>
      </Card>

      <Grid cols={2} className="mb-6">
        <Card title="02 · 职教价值重构">
          <p className="text-sm leading-relaxed mb-3" style={{ color: 'var(--text-secondary)' }}>职教本科的建立正在打破蓝领阶层的「成长天花板」：升学通道、薪酬水平与企业认可度全面抬升，普职分流从「淘汰赛」转向「分轨制」。</p>
          <div className="space-y-2">
            <div className="flex justify-between text-xs"><span style={{ color: 'var(--text-tertiary)' }}>职教高考制度</span><span className="font-semibold" style={{ color: 'var(--text-primary)' }}>已确立</span></div>
            <div className="flex justify-between text-xs"><span style={{ color: 'var(--text-tertiary)' }}>产教融合共同体</span><span className="font-semibold" style={{ color: '#22d3ee' }}>加速布局</span></div>
            <div className="flex justify-between text-xs"><span style={{ color: 'var(--text-tertiary)' }}>职教本科通道</span><span className="font-semibold" style={{ color: '#10b981' }}>打破天花板</span></div>
          </div>
        </Card>
        <Card title="03 · 存量焦虑消解 — 家庭教育投入预期变化（示意）"><EChart option={eduCostRadar} style={{ height: 240 }} /></Card>
      </Grid>

      <Card title="「双减」政策：消解内耗的系统校准" className="mb-6">
        <p className="text-sm leading-relaxed mb-4" style={{ color: 'var(--text-secondary)' }}>「双减」（减轻学生作业负担和校外培训负担）在现实主义视角下是一场「社会总成本的结构性去杠杆」：取缔资本化的教培市场，阻止中等收入家庭把绝大部分资源投入「内卷式」教育军备竞赛，释放家庭消费潜力，并把教育竞争引回公共教育资源的公平轨道。</p>
        <Grid cols={2}>
          {[['De-commodification of Education', '教育去商品化 —— 校外培训支出与家庭心理压力大幅回落，校内资源利用率回升。'],
            ['Social Capital Reset', '社会资本重置 —— 素质教育关注度与职业技能投资取代「军备竞赛式」补课支出。']].map(([t, d]) => (
            <div key={t} style={{ borderLeft: '2px solid #c41e3a', paddingLeft: 10 }}><div className="text-xs font-semibold" style={{ color: 'var(--text-primary)' }}>{t}</div><p className="text-[11px] mt-1 leading-relaxed" style={{ color: 'var(--text-tertiary)' }}>{d}</p></div>
          ))}
        </Grid>
      </Card>

      <Card title="04 · AI 时代的育人范式 — 构建终身技能体系" className="mb-6">
        <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>教育改革的终极目标是实现「人的现代化」与「产业智能化」的同步。随着 AIGC 技术对传统认知的冲击，中国教育正从「知识灌输」转向「批判性思维与人机协作」；未来的教育不仅发生在校园，而是通过数字基建实现全生命周期的技能实时刷新，确保 14 亿人作为生产要素的持续性增值。</p>
        <div className="flex gap-6 flex-wrap mt-4 text-[10px] mono" style={{ color: 'var(--text-tertiary)' }}>
          <span>// TALENT_DENSITY: RISING</span>
          <span>// VOCATIONAL_VALUE: UPGRADING</span>
          <span>// AI_READY: CALIBRATING...</span>
        </div>
      </Card>
      <Card title="系统观察"><p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>「教育主权是人才红利的最终防御壁垒」—— 普职分流与双减重塑供给结构，但学历通胀与技能缺口的错位修复，仍取决于职教社会地位能否真正落地。</p></Card>
      <p className="text-xs mt-6" style={{ color: 'var(--text-tertiary)' }}>数据为公开信息综合整理与示意值，仅供结构性参考 · 由 china.html「教育」专题迁移</p>
    </div>
  );
}
