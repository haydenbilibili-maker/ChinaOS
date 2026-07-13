import React, { useState, useMemo } from 'react';
import { PageHeader, Card, Grid, Stat } from '../../app/ui.jsx';
import EChart from '../../lib/viz/EChart.jsx';
import { categoryX, valueY, logY, GRID, donutOpt, radarOpt, stackedBarOpt } from '../shared/chartHelpers.js';
import { IntroCard, SelectorBar, TimelineBar, FrameworkTrio, ModuleFooter } from '../shared/ModuleParadigm.jsx';

// 学科领域：切换看投入 / 论文 / 专利 / 国际地位 / 短板
const FIELDS = [
  { key: 'math', label: '数学物理', accent: '#22d3ee',
    funding: 18, papers: 22, patents: 8, rank: 72, gap: 65,
    note: '量子、凝聚态、高能领域论文体量大；底层数学原创与重大装置长周期产出仍待沉淀。',
    short: '原创理论稀缺 · 重大实验装置依赖国际合作' },
  { key: 'chem', label: '化学材料', accent: '#c41e3a',
    funding: 24, papers: 31, patents: 30, rank: 84, gap: 48,
    note: '化学论文与材料专利全球居前；高端电子化学品、光刻胶等关键材料仍受制于人。',
    short: '工程化领先 · 高纯试剂与关键单体卡脖子' },
  { key: 'life', label: '生命科学', accent: '#10b981',
    funding: 22, papers: 24, patents: 18, rank: 70, gap: 60,
    note: '论文增速最快，结构生物学与基因编辑发力；新药原创靶点与高端试剂仪器短板明显。',
    short: '跟随式创新为主 · 原创靶点与高端仪器依赖进口' },
  { key: 'info', label: '信息科学', accent: '#e8a317',
    funding: 21, papers: 16, patents: 32, rank: 78, gap: 55,
    note: 'AI / 通信论文与专利双高；EDA、高端芯片设计理论与基础算法框架仍有代差。',
    short: '应用爆发 · EDA 与底层算力架构受限' },
  { key: 'earth', label: '地球与空间', accent: '#8b5cf6',
    funding: 9, papers: 5, patents: 6, rank: 60, gap: 70,
    note: '深空、深海、极地观测体系成型；地学原始数据积累与高端传感探测仍偏弱。',
    short: '观测体系扩张 · 高端探测载荷与长序列数据不足' },
  { key: 'eng', label: '工程与交叉', accent: '#64748b',
    funding: 6, papers: 2, patents: 6, rank: 75, gap: 58,
    note: '交叉学科与有组织科研重点扩容；从论文到样机的中试衔接是主要瓶颈。',
    short: '中试断层 · 死亡之谷阶段制度时滞偏长' },
];

// 创新主体（保留原数据，作为体制视角）
const ACTORS = [
  { key: 'lab', label: '国家实验室', accent: '#c41e3a', share: 40, desc: '面向芯片、材料、生命健康、空天等长周期领域，跨单位攻关与稳定经费。' },
  { key: 'uni', label: '高校体系', accent: '#22d3ee', share: 35, desc: '双一流与交叉学科扩容支撑原始创新；挑战在评价改革与重复研究治理。' },
  { key: 'inst', label: '新型研发机构', accent: '#10b981', share: 25, desc: '地方与央企共建，承担死亡之谷阶段工艺验证与首台套。' },
];

const PHASES = [
  { period: '1988', title: '第一生产力', accent: '#64748b', desc: '"科学技术是第一生产力"确立，科技体制改革破冰，奠定后续投入逻辑。' },
  { period: '1986–1997', title: '863 / 973 计划', accent: '#8b5cf6', desc: '高技术研究发展计划与重点基础研究发展计划并行，国家层面布局前沿。' },
  { period: '2018–2020', title: '实验室重组', accent: '#e8a317', desc: '国家实验室体系重组启动，大科学装置开放共享，战略科技力量重塑。' },
  { period: '2021–2023', title: '破四唯评价改革', accent: '#22d3ee', desc: '破四唯、立新标，青年经费倾斜与有组织科研并行，长周期容错机制试点。' },
  { period: '2024–', title: '基础研究十年行动', accent: '#c41e3a', desc: '基础研究占比 6.9% 向两位数爬坡，从 1 到 0 补原始创新短板。' },
];

export default function Page() {
  const [field, setField] = useState('chem');
  const [actor, setActor] = useState('lab');
  const [phaseIdx, setPhaseIdx] = useState(4);
  const f = FIELDS.find((x) => x.key === field) || FIELDS[0];
  const a = ACTORS.find((x) => x.key === actor) || ACTORS[0];

  // ① 学科：投入 / 论文 / 专利 三维条形（随领域切换）
  const fieldBar = useMemo(() => ({
    grid: { left: 64, right: 36, top: 16, bottom: 24 },
    tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
    xAxis: valueY({ axisLabel: { formatter: '{value}%' } }),
    yAxis: categoryX(['经费占比', 'SCI 论文份额', '发明专利份额']),
    series: [{ type: 'bar', barWidth: 16,
      data: [f.funding, f.papers, f.patents].map((v) => ({ value: v, itemStyle: { color: f.accent, borderRadius: 3 } })),
      label: { show: true, position: 'right', formatter: '{c}%', color: LABEL.color } }],
  }), [f]);

  // ① 学科：国际地位 vs 短板缺口 仪表式对照
  const fieldGap = useMemo(() => ({
    grid: { left: 64, right: 36, top: 16, bottom: 24 },
    tooltip: { trigger: 'axis' },
    xAxis: valueY({ max: 100 }),
    yAxis: categoryX(['国际地位指数', '原始创新缺口']),
    series: [{ type: 'bar', barWidth: 18,
      data: [
        { value: f.rank, itemStyle: { color: '#22d3ee', borderRadius: 3 } },
        { value: f.gap, itemStyle: { color: '#c41e3a', borderRadius: 3 } },
      ],
      label: { show: true, position: 'right', color: LABEL.color } }],
  }), [f]);

  // ② R&D 三层结构 donut（基础研究占比偏低）
  const rdDonut = useMemo(() => donutOpt([
    { value: 6.9, name: '基础研究', itemStyle: { color: '#c41e3a' } },
    { value: 12, name: '应用研究', itemStyle: { color: '#22d3ee' } },
    { value: 81.1, name: '试验发展', itemStyle: { color: AXIS.lineStyle.color } },
  ]), []);

  // ② 国际对照：基础研究占 R&D 比重（中国偏低）
  const intlShareBar = useMemo(() => ({
    grid: { left: 56, right: 36, top: 16, bottom: 24 },
    tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
    xAxis: valueY({ max: 25, axisLabel: { formatter: '{value}%' } }),
    yAxis: categoryX(['中国', '韩国', '日本', '德国', '美国', '法国']),
    series: [{ type: 'bar', barWidth: 14,
      data: [6.9, 14.9, 12.3, 15.0, 16.6, 22.5].map((v, i) => ({
        value: v, itemStyle: { color: i === 0 ? '#c41e3a' : '#64748b', borderRadius: 3 } })),
      label: { show: true, position: 'right', formatter: '{c}%', color: LABEL.color } }],
  }), []);

  // ③ 基础研究投入趋势：经费(柱) + 占 R&D 比重(线) 双轴
  const fundingTrend = useMemo(() => {
    const years = ['2015', '2017', '2019', '2021', '2022', '2023', '2024'];
    const amount = [716, 920, 1336, 1817, 2024, 2259, 2501]; // 亿元
    const ratio = [5.05, 5.54, 6.03, 6.50, 6.57, 6.65, 6.91]; // %
    return {
      grid: { left: 52, right: 52, top: 24, bottom: 24 },
      tooltip: { trigger: 'axis', axisPointer: { type: 'cross' } },
      legend: { textStyle: { color: LABEL.color, fontSize: 10 }, top: 0, icon: 'circle' },
      xAxis: categoryX(years),
      yAxis: [
        valueY({ name: '亿元', nameTextStyle: { color: LABEL.color, fontSize: 9 } }),
        valueY({ max: 8, min: 4, position: 'right', splitLine: { show: false }, axisLabel: { formatter: '{value}%' } }),
      ],
      series: [
        { name: '基础研究经费', type: 'bar', barWidth: 16, yAxisIndex: 0,
          data: amount, itemStyle: { color: '#c41e3a', borderRadius: 3 } },
        { name: '占 R&D 比重', type: 'line', smooth: true, yAxisIndex: 1, symbol: 'circle', symbolSize: 6,
          data: ratio, lineStyle: { color: '#e8a317', width: 2 }, itemStyle: { color: '#e8a317' } },
      ],
    };
  }, []);

  // ④ 科研产出与质量：高被引 / 自然指数 / 顶刊 国际对照（分组柱）
  const qualityBar = useMemo(() => ({
    grid: { left: 40, right: 16, top: 30, bottom: 24 },
    tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
    legend: { textStyle: { color: LABEL.color, fontSize: 10 }, top: 0, icon: 'circle' },
    xAxis: categoryX(['中国', '美国', '英国', '德国']),
    yAxis: valueY({ name: '指数', nameTextStyle: { color: LABEL.color, fontSize: 9 } }),
    series: [
      { name: '高被引论文', type: 'bar', barWidth: 12, data: [42, 45, 14, 12], itemStyle: { color: '#c41e3a', borderRadius: 2 } },
      { name: '自然指数', type: 'bar', barWidth: 12, data: [24, 22, 9, 8], itemStyle: { color: '#22d3ee', borderRadius: 2 } },
      { name: '顶刊正刊数', type: 'bar', barWidth: 12, data: [13, 38, 10, 7], itemStyle: { color: '#e8a317', borderRadius: 2 } },
    ],
  }), []);

  // ④ 数量领先 / 质量追赶 缺口（横向堆叠：已达成 vs 缺口）
  const quantQualBar = useMemo(() => stackedBarOpt({
    horizontal: true,
    categories: ['论文总量', '高被引论文', '自然指数', '诺奖级原创', '高端仪器自给'],
    series: [
      { name: '已达成', data: [98, 75, 70, 12, 35], itemStyle: { color: '#22d3ee' } },
      { name: '缺口', data: [2, 25, 30, 88, 65], itemStyle: { color: AXIS.lineStyle.color } },
    ],
  }), []);

  // ⑤ 创新体系雷达（单系列）
  const sysRadar = useMemo(() => radarOpt(
    ['原始创新', '人才厚度', '经费强度', '国家实验室', '评价机制', '国际合作'],
    [42, 70, 65, 60, 48, 55],
    { name: '创新体系成熟度', color: '#c41e3a' },
  ), []);

  // 体制视角（保留）：改革维度推进度（随主体切换）
  const reformBar = useMemo(() => ({
    grid: { left: 100, right: 24, top: 16, bottom: 24 },
    tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
    xAxis: valueY({ max: 100, axisLabel: { formatter: '{value}%' } }),
    yAxis: categoryX(['大科学装置开放', '青年经费倾斜', '破四唯评价', '有组织科研']),
    series: [{ type: 'bar',
      data: (actor === 'lab' ? [80, 60, 65, 90] : actor === 'uni' ? [55, 75, 85, 70] : [65, 50, 70, 75])
        .map((v) => ({ value: v, itemStyle: { color: a.accent, borderRadius: 3 } })),
      label: { show: true, position: 'right', formatter: '{c}%', color: LABEL.color } }],
  }), [actor, a]);

  // 体制视角（保留）：技术就绪度 TRL 曲线
  const trlLine = useMemo(() => ({
    grid: GRID,
    tooltip: { trigger: 'axis' },
    xAxis: categoryX(['TRL 1', 'TRL 3', 'TRL 5', 'TRL 7', 'TRL 9']),
    yAxis: valueY({ max: 100 }),
    series: [{ type: 'line', smooth: true, symbol: 'circle', symbolSize: 6,
      data: actor === 'lab' ? [90, 85, 70, 50, 30] : actor === 'inst' ? [60, 70, 85, 75, 55] : [80, 75, 60, 40, 25],
      lineStyle: { color: a.accent, width: 2 }, areaStyle: { color: `${a.accent}18` } }],
  }), [actor, a]);

  return (
    <div>
      <PageHeader badge="Basic Science · 制度演进" title="基础研究与研发结构" subtitle="原始创新 · 国家实验室重组 · 破四唯评价改革" />
      <IntroCard>
        2024 年 R&D 经费约 3.63 万亿元，其中基础研究约 2,501 亿元、占 <strong style={{ color: 'var(--text-primary)' }}>6.9%</strong>；
        而美国、法国基础研究占比长期在 <strong style={{ color: 'var(--text-primary)' }}>15–22%</strong>。
        论文与专利体量全球居前，但卡脖子的根在基础——从 1 到 0 的原始创新、高端仪器与原创靶点仍是短板。国家实验室重组、揭榜挂帅、破四唯评价改革并行，压缩从论文到样机的制度时滞。
      </IntroCard>

      <Grid cols={4} className="mb-6">
        <Stat value="~2.68%" label="R&D 投入强度（占 GDP）" accent="#22d3ee" />
        <Stat value="~6.9%" label="基础研究占 R&D 比重" accent="#c41e3a" />
        <Stat value="20+" label="重组国家实验室（示意）" accent="#e8a317" />
        <Stat value="#1" label="高被引 / 自然指数排名" accent="#10b981" />
      </Grid>

      <Card title="交互① · 学科领域诊断（投入 / 产出 / 国际地位 / 短板）" className="mb-6">
        <SelectorBar items={FIELDS} activeKey={field} onSelect={setField} />
        <div className="os-card p-4 mb-4" style={{ background: 'var(--bg-elevated)', borderLeft: `3px solid ${f.accent}` }}>
          <p className="text-sm leading-relaxed mb-2" style={{ color: 'var(--text-secondary)' }}>{f.note}</p>
          <p className="text-xs mono" style={{ color: f.accent }}>短板 · {f.short}</p>
        </div>
        <Grid cols={2}>
          <Card title="投入与产出份额（%·示意）"><EChart option={fieldBar} style={{ height: 240 }} /></Card>
          <Card title="国际地位 vs 原始创新缺口"><EChart option={fieldGap} style={{ height: 240 }} /></Card>
        </Grid>
      </Card>

      <Grid cols={2} className="mb-6">
        <Card title="交互② · R&D 经费三层结构（%）">
          <EChart option={rdDonut} style={{ height: 240 }} />
          <p className="text-xs mt-2" style={{ color: 'var(--text-tertiary)' }}>基础研究占比偏低，长期被试验发展（产业化阶段）主导。</p>
        </Card>
        <Card title="基础研究占 R&D 比重 · 国际对照">
          <EChart option={intlShareBar} style={{ height: 240 }} />
          <p className="text-xs mt-2" style={{ color: 'var(--text-tertiary)' }}>与发达国家 15–22% 仍有结构性差距。</p>
        </Card>
      </Grid>

      <Card title="交互③ · 基础研究投入趋势（经费 + 占比双轴）" className="mb-6">
        <EChart option={fundingTrend} style={{ height: 280 }} />
        <p className="text-xs mt-2" style={{ color: 'var(--text-tertiary)' }}>经费十年增长逾 3 倍，占比从 5% 缓步爬向 7%——量在涨，结构占比仍偏低。</p>
      </Card>

      <Grid cols={2} className="mb-6">
        <Card title="交互④ · 科研产出与质量 · 国际对照（示意）">
          <EChart option={qualityBar} style={{ height: 260 }} />
          <p className="text-xs mt-2" style={{ color: 'var(--text-tertiary)' }}>高被引与自然指数已居前，顶刊正刊与诺奖级原创仍是质量追赶项。</p>
        </Card>
        <Card title="数量领先 / 质量追赶 · 缺口图（%）">
          <EChart option={quantQualBar} style={{ height: 260 }} />
          <p className="text-xs mt-2" style={{ color: 'var(--text-tertiary)' }}>论文数量近饱和，原创与高端仪器自给的缺口最深。</p>
        </Card>
      </Grid>

      <Card title="交互⑤ · 创新体系成熟度雷达" className="mb-6">
        <Grid cols={2}>
          <EChart option={sysRadar} style={{ height: 280 }} />
          <div className="flex flex-col justify-center gap-2">
            <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
              六维评估冷峻地指向同一结论：<strong style={{ color: 'var(--text-primary)' }}>人才与经费强度已具规模，但原始创新与评价机制是最短的两块板。</strong>
            </p>
            <p className="text-xs leading-relaxed" style={{ color: 'var(--text-tertiary)' }}>
              举国体制 2.0 解决的是"集中力量办大事"的组织问题，破四唯解决的是"长周期容错"的激励问题——二者都绕不开原始创新的厚度积累。
            </p>
          </div>
        </Grid>
      </Card>

      <Card title="交互⑥ · 体制视角 · 创新主体推进度" className="mb-6">
        <SelectorBar items={ACTORS} activeKey={actor} onSelect={setActor} />
        <div className="os-card p-4 mb-4" style={{ background: 'var(--bg-elevated)', borderLeft: `3px solid ${a.accent}` }}>
          <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{a.desc}</p>
        </div>
        <Grid cols={2}>
          <Card title="改革维度推进度（随主体切换）"><EChart option={reformBar} style={{ height: 240 }} /></Card>
          <Card title="技术就绪度 TRL 曲线"><EChart option={trlLine} style={{ height: 240 }} /></Card>
        </Grid>
      </Card>

      <Card title="交互⑦ · 科技体制演进时间线" className="mb-6">
        <TimelineBar stages={PHASES} activeIdx={phaseIdx} onSelect={setPhaseIdx} />
      </Card>

      <FrameworkTrio cards={[
        { title: '从 1 到 0 的短板', subtitle: '应用强 · 基础弱', accent: '#c41e3a', border: '#c41e3a',
          body: '论文与专利体量全球居前，卡脖子的根却在基础——原始创新、原创靶点、高端仪器仍依赖外部。',
          pillars: [['原始创新', '从 0 起步的理论与方法稀缺。'], ['高端仪器', '科研设备自给率偏低。'], ['制度时滞', '论文到样机周期偏长。']] },
        { title: '举国体制 2.0', subtitle: '国家实验室 · 新型举国体制', accent: '#22d3ee', border: '#22d3ee',
          body: '以战略领域重组国家实验室，新型举国体制集中力量，揭榜挂帅与有组织科研并行攻关。',
          pillars: [['国家实验室', '稳定经费 · 任务导向。'], ['揭榜挂帅', '不论资历论贡献。'], ['大装置', '开放共享 · 跨单位攻关。']] },
        { title: '评价改革', subtitle: '破四唯 · 立新标', accent: '#e8a317', border: '#e8a317',
          body: '破唯论文 / 唯职称 / 唯学历 / 唯奖项，转向贡献与任务导向，配套长周期容错机制。',
          pillars: [['破四唯', '多元分类评价。'], ['长周期', '容错与稳定支持。'], ['青年倾斜', '经费向青年人才下沉。']] },
      ]} />

      <ModuleFooter moduleId="basicResearch"
        disclaimer="公开资料整理，数值为示意非官方 · 仅供分析框架参考，非投资建议"
        sourceNote="由 china.html「基础研究」专题迁移扩容" />
    </div>
  );
}
