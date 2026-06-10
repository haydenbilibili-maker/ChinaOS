import React, { useState, useMemo } from 'react';
import { PageHeader, Card, Grid, Stat } from '../../app/ui.jsx';
import EChart from '../../lib/viz/EChart.jsx';
import { categoryX, valueY, GRID, donutOpt, radarOpt, stackedBarOpt } from '../shared/chartHelpers.js';
import { IntroCard, SelectorBar, TimelineBar, FrameworkTrio, ModuleFooter } from '../shared/ModuleParadigm.jsx';

/* ── 治理层级：中枢 → 网格，逐级下沉 ───────────────────────────── */
const TIERS = [
  {
    key: 'center', label: '中枢', accent: '#c41e3a', score: 99, span: '1 个',
    task: '设定总目标、分配指标、把控政治方向与安全底线；以五年规划与年度考核为节拍器。',
    lever: '一体化政务大数据平台 · 国家政务服务总门户 · 督查问责系统',
    pressure: '外部博弈 + 内部失衡，任何系统性风险最终上溯至此。',
    pain: '信息层层过滤后失真——上传到顶端的多是「加工过的真相」。',
  },
  {
    key: 'province', label: '省域', accent: '#e8a317', score: 91, span: '31 个',
    task: '承接中枢指标并本地化分解，统筹区域均衡、产业与财政，是「压力转换枢纽」。',
    lever: '省级一网通办 · 数字政府专班 · 营商环境评价',
    pressure: '上要完成考核、下要兜住稳定，财政自给率落差是最大变量。',
    pain: '锦标赛激励下的数据竞赛与重复建设——政绩工程难以根治。',
  },
  {
    key: 'city', label: '市域', accent: '#22d3ee', score: 88, span: '293 个',
    task: '城市运行的总调度：交通、应急、城管、营商一体化处置，城市大脑落地层。',
    lever: '城市运行管理服务平台（CIM）· 12345 热线 · 一网统管',
    pressure: '土地财政退潮后的债务压顶与公共服务刚性支出剪刀差。',
    pain: '多源数据归集易、跨部门协同处置难——「数据墙」比「部门墙」更顽固。',
  },
  {
    key: 'county', label: '县域', accent: '#10b981', score: 82, span: '2843 个',
    task: '「上面千条线、下面一根针」的承压点，政策落地与民生兜底的最后建制层。',
    lever: '县域智治平台 · 雪亮工程 · 综治中心',
    pressure: '事权多、财权少、人手缺——「小马拉大车」是结构性常态。',
    pain: '属地责任无限扩大，基层干部被考核表与留痕台账反向锁死。',
  },
  {
    key: 'street', label: '街道社区', accent: '#a78bfa', score: 78, span: '约 4 万',
    task: '党建引领 + 网格统筹，把行政末梢嵌入居民日常，矛盾化解的前置缓冲带。',
    lever: '社区微信群 · 智慧社区平台 · 党群服务中心',
    pressure: '老龄化、流动人口、物业纠纷叠加，需求碎片化而资源固定化。',
    pain: '行政事务过度下沉，社区自治被「行政化」反噬，自治能力空心。',
  },
  {
    key: 'grid', label: '网格', accent: '#f472b6', score: 96, span: '约 450 万',
    task: '社会的「数字毛细血管」：网格员采集人地物情事，发现-上报-派单-处置-反馈闭环。',
    lever: '网格化 App · 人脸/车牌感知前端 · 微嵌入式数据采集',
    pressure: '一格千人、全时在线，采集口径无限扩张而权责工具有限。',
    pain: '采集即治理的幻觉——把「看得见」当成「治得了」，处置权仍在上层。',
  },
];

/* ── 政务效能：办理时效逐年压缩（保留 effTrend） ───────────────── */
const effTrend = {
  grid: GRID,
  tooltip: { trigger: 'axis' },
  xAxis: categoryX(['2015', '2018', '2021', '2024']),
  yAxis: valueY({ name: '天', nameTextStyle: { color: '#5b6a82' } }),
  series: [{ type: 'line', smooth: true, symbol: 'circle', symbolSize: 6, data: [18, 9, 4, 1.5], lineStyle: { color: '#22d3ee', width: 2 }, areaStyle: { color: 'rgba(34,211,238,0.1)' } }],
};

/* 一网通办 / 最多跑一次 渗透率（示意） */
const onlineTrend = {
  legend: { data: ['一网通办事项占比', '零跑动办结率'], textStyle: { color: '#93a1b5', fontSize: 10 }, top: 0 },
  grid: { left: 40, right: 16, top: 30, bottom: 30 },
  tooltip: { trigger: 'axis' },
  xAxis: categoryX(['2015', '2018', '2021', '2024']),
  yAxis: valueY({ max: 100, axisLabel: { formatter: '{value}%' } }),
  series: [
    { name: '一网通办事项占比', type: 'line', smooth: true, symbol: 'circle', symbolSize: 6, data: [12, 45, 78, 92], lineStyle: { color: '#e8a317', width: 2 }, itemStyle: { color: '#e8a317' } },
    { name: '零跑动办结率', type: 'line', smooth: true, symbol: 'circle', symbolSize: 6, data: [5, 28, 55, 74], lineStyle: { color: '#10b981', width: 2 }, itemStyle: { color: '#10b981' } },
  ],
};

/* ── 多元主体演进：1990 vs 2024（保留 actorTrend，升级为堆叠条） ─ */
const actorTrend = stackedBarOpt({
  categories: ['1990', '2024'],
  horizontal: true,
  series: [
    { name: '科层行政', data: [70, 35], itemStyle: { color: '#c41e3a' } },
    { name: '市场/平台', data: [10, 25], itemStyle: { color: '#22d3ee' } },
    { name: '基层自治', data: [15, 25], itemStyle: { color: '#10b981' } },
    { name: '社会组织', data: [5, 15], itemStyle: { color: '#e8a317' } },
  ],
});

/* 网格化事件处置结构（示意 donut） */
const gridDonut = donutOpt([
  { name: '网格内自处置', value: 62, itemStyle: { color: '#f472b6' } },
  { name: '街道吹哨派单', value: 24, itemStyle: { color: '#a78bfa' } },
  { name: '区县协同处置', value: 11, itemStyle: { color: '#22d3ee' } },
  { name: '上行未闭环', value: 3, itemStyle: { color: '#27324a' } },
]);

/* ── 治理范式时间线 ───────────────────────────────────────────── */
const STAGES = [
  { period: '1949–1978', title: '运动式治理', accent: '#c41e3a', desc: '以政治动员替代制度运转，单位制 + 群众运动直达个体，高动员但高震荡——治理靠周期性的「再激活」而非常态机制。' },
  { period: '1978–2003', title: '科层制重建', accent: '#e8a317', desc: '改革开放后行政理性化，条块体系、职能分工与编制管理回归。效率上升但「部门墙」「信息孤岛」同步固化。' },
  { period: '2003–2013', title: '网格化治理', accent: '#22d3ee', desc: '北京东城首创网格管理，城市切分为微观单元、网格员实时巡查。社会被第一次系统性地「数字切片」。' },
  { period: '2013–2020', title: '一网统管', accent: '#10b981', desc: '放管服 + 电子政务深化，一网通办、最多跑一次重塑政务流程。数据从「采集」走向「服务」。' },
  { period: '2020– ', title: '数字治理 · 城市大脑', accent: '#a78bfa', desc: 'AI + 多源融合实现城市全息感知与预判式处置。治理从「事后响应」转向「事前拆弹」——赛博反馈闭环成形。' },
];

export default function Page() {
  const [tierKey, setTierKey] = useState('grid');
  const [stageIdx, setStageIdx] = useState(STAGES.length - 1);

  const tier = useMemo(() => TIERS.find((t) => t.key === tierKey) || TIERS[0], [tierKey]);

  /* 治理能力雷达：随层级联动（保留 govRadar 维度并扩展数值差异） */
  const govRadar = useMemo(() => {
    const profiles = {
      center:   [99, 70, 75, 96, 90, 78],
      province: [90, 78, 82, 90, 85, 80],
      city:     [88, 82, 86, 84, 82, 84],
      county:   [80, 85, 88, 70, 72, 76],
      street:   [72, 90, 80, 60, 65, 82],
      grid:     [96, 95, 92, 55, 80, 70],
    };
    return radarOpt(
      ['危机响应', '民意感知', '执行穿透', '资源调配', '风险预判', '协同赋能'],
      profiles[tierKey] || profiles.grid,
      { name: `${tier.label}治理能力`, color: tier.accent },
    );
  }, [tierKey, tier]);

  return (
    <div>
      <PageHeader badge="National Governance" title="国家治理现代化与赛博协同" subtitle="治理层级 · 网格体系 · 数字政府 · 效能评估 —— 治理作为一种「熵减算法」" />
      <IntroCard>面对 14 亿人口的超大规模社会，治理现代化的本质是<strong style={{ color: 'var(--text-primary)' }}>熵减过程</strong>。体制通过数字化把社会运作转化为可监测的数据流，实现中枢意志在微观层面的低摩擦穿透——这不是简单自动化，而是<strong style={{ color: 'var(--text-primary)' }}>权力的重新编程</strong>：效率与可控性同时被拉满，而代价是末梢的留痕负荷与数据失真风险。</IntroCard>

      {/* 概览 4 Stat */}
      <Grid cols={4} className="mb-6">
        <Stat value="6 层" label="中枢 → 网格 治理纵深" accent="#c41e3a" />
        <Stat value="约 450 万" label="基层网格 · 数字毛细血管" accent="#f472b6" />
        <Stat value="92%" label="一网通办高频事项渗透" accent="#e8a317" />
        <Stat value="18→1.5 天" label="政务办理时效压缩（示意）" accent="#22d3ee" />
      </Grid>

      {/* 1. 治理层级选择器 + 雷达联动 */}
      <Card title="交互 · 治理层级穿透 · 能力雷达联动" className="mb-6">
        <SelectorBar items={TIERS} activeKey={tierKey} onSelect={setTierKey} />
        <Grid cols={2}>
          <div className="os-card p-4" style={{ background: 'var(--bg-elevated)', borderLeft: `3px solid ${tier.accent}` }}>
            <div className="flex items-baseline gap-2 mb-3">
              <span className="text-base font-semibold" style={{ color: tier.accent }}>{tier.label}</span>
              <span className="text-[11px] mono" style={{ color: 'var(--text-tertiary)' }}>建制规模 · {tier.span} · 能力指数 {tier.score}</span>
            </div>
            <p className="text-xs mb-1" style={{ color: 'var(--text-tertiary)' }}>治理任务</p>
            <p className="text-sm leading-relaxed mb-3" style={{ color: 'var(--text-secondary)' }}>{tier.task}</p>
            <p className="text-xs mb-1" style={{ color: 'var(--text-tertiary)' }}>数字化抓手</p>
            <p className="text-sm leading-relaxed mb-3 mono" style={{ color: '#22d3ee' }}>{tier.lever}</p>
            <Grid cols={2}>
              <div>
                <p className="text-xs mb-1" style={{ color: 'var(--text-tertiary)' }}>压力来源</p>
                <p className="text-[12px] leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{tier.pressure}</p>
              </div>
              <div>
                <p className="text-xs mb-1" style={{ color: '#c41e3a' }}>结构性痛点</p>
                <p className="text-[12px] leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{tier.pain}</p>
              </div>
            </Grid>
          </div>
          <div>
            <EChart option={govRadar} style={{ height: 280 }} />
            <p className="text-[11px] text-center mt-1" style={{ color: 'var(--text-tertiary)' }}>切换层级观察六维能力的此消彼长——民意感知向下浓、资源调配向上集</p>
          </div>
        </Grid>
      </Card>

      {/* 2. 治理范式时间线 */}
      <Card title="演进 · 治理范式七十年迁移" className="mb-6">
        <TimelineBar stages={STAGES} activeIdx={stageIdx} onSelect={setStageIdx} />
      </Card>

      {/* 3. 政务效能双图 */}
      <Grid cols={2} className="mb-6">
        <Card title="政务事项办理时效演进（天 · 示意）"><EChart option={effTrend} style={{ height: 240 }} /></Card>
        <Card title="一网通办 / 零跑动 渗透率（示意）"><EChart option={onlineTrend} style={{ height: 240 }} /></Card>
      </Grid>

      {/* 4. 多元主体演进 + 网格处置结构 */}
      <Grid cols={2} className="mb-6">
        <Card title="治理参与主体权重演变（1990 → 2024 · 堆叠）"><EChart option={actorTrend} style={{ height: 240 }} /></Card>
        <Card title="网格化事件处置流向（示意）"><EChart option={gridDonut} style={{ height: 240 }} /></Card>
      </Grid>

      {/* 5. 三框架 */}
      <FrameworkTrio cards={[
        { title: '熵减算法', subtitle: '网格 · 数据流', body: '穿透式网格把国土划分为约 450 万微观单元，实现发现-上报-派单-处置-反馈闭环。官僚反应速度由天级缩短至小时级——社会被转译为可计算的数据流。', pillars: [['枫桥 2.0', '矛盾不上交、就地化解。'], ['闭环处置', '算法化自动流转派单。'], ['全覆盖', '物理空间数字化切片。']] },
        { title: '压力型传导', subtitle: '指标 · 考核 · 留痕', body: '中枢目标经省-市-县逐级分解为可量化指标，以考核与问责反向驱动执行。优点是穿透力强，副作用是数据竞赛、形式留痕与末梢失真。', pillars: [['锦标赛', '排名激励驱动增长。'], ['属地责任', '出事即追责到底。'], ['留痕台账', '看得见 ≠ 治得了。']] },
        { title: '协同赋能', subtitle: '多元共治 · 1990→2024', body: '科层行政权重从 70% 降至 35%，市场/平台与社会组织上升——开放系统借企业技术能力支撑公共治理，从「政府独唱」走向「党建引领下的合奏」。', pillars: [['一网统管', '从人跑到数跑。'], ['城市大脑', '城市运行全息感知。'], ['安全阈值', '效率服从稳定底线。']] },
      ]} />

      <ModuleFooter moduleId="governance" disclaimer="公开资料整理，数值为示意框架非官方统计 · 仅供治理逻辑分析参考" sourceNote="由 china.html「国家治理现代化」专题迁移升级" />
    </div>
  );
}
