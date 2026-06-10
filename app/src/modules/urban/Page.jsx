import React, { useState, useMemo } from 'react';
import { PageHeader, Card, Grid, Stat } from '../../app/ui.jsx';
import EChart from '../../lib/viz/EChart.jsx';
import ChinaMap from '../../lib/viz/ChinaMap.jsx';
import { categoryX, valueY, logY, GRID, donutOpt, radarOpt, stackedBarOpt } from '../shared/chartHelpers.js';
import { IntroCard, SelectorBar, TimelineBar, FrameworkTrio, ModuleFooter } from '../shared/ModuleParadigm.jsx';

// ---------------------------------------------------------------------------
// 空间格局 · 省际数据（示意）
// ---------------------------------------------------------------------------
const URBANIZATION = [
  { name: '上海市', value: 88 }, { name: '北京市', value: 88 }, { name: '天津市', value: 85 },
  { name: '广东省', value: 75 }, { name: '江苏省', value: 74 }, { name: '浙江省', value: 73 },
  { name: '辽宁省', value: 73 }, { name: '黑龙江省', value: 67 }, { name: '福建省', value: 70 },
  { name: '重庆市', value: 71 }, { name: '内蒙古自治区', value: 68 }, { name: '山东省', value: 65 },
  { name: '湖北省', value: 65 }, { name: '陕西省', value: 64 }, { name: '山西省', value: 64 },
  { name: '河北省', value: 62 }, { name: '江西省', value: 62 }, { name: '安徽省', value: 61 },
  { name: '湖南省', value: 60 }, { name: '四川省', value: 59 }, { name: '河南省', value: 57 },
  { name: '广西壮族自治区', value: 56 }, { name: '贵州省', value: 55 }, { name: '甘肃省', value: 54 },
  { name: '云南省', value: 53 }, { name: '新疆维吾尔自治区', value: 58 }, { name: '西藏自治区', value: 38 },
];
const POPULATION = [
  { name: '广东省', value: 12700 }, { name: '山东省', value: 10100 }, { name: '河南省', value: 9800 },
  { name: '江苏省', value: 8500 }, { name: '四川省', value: 8400 }, { name: '河北省', value: 7400 },
  { name: '浙江省', value: 6600 }, { name: '湖南省', value: 6600 }, { name: '安徽省', value: 6100 },
  { name: '湖北省', value: 5800 }, { name: '广西壮族自治区', value: 5000 }, { name: '云南省', value: 4700 },
  { name: '江西省', value: 4500 }, { name: '辽宁省', value: 4200 }, { name: '福建省', value: 4200 },
  { name: '陕西省', value: 4000 }, { name: '贵州省', value: 3850 }, { name: '山西省', value: 3500 },
  { name: '重庆市', value: 3200 }, { name: '黑龙江省', value: 3100 }, { name: '新疆维吾尔自治区', value: 2600 },
  { name: '甘肃省', value: 2500 }, { name: '上海市', value: 2480 }, { name: '北京市', value: 2180 },
  { name: '内蒙古自治区', value: 2400 }, { name: '吉林省', value: 2350 }, { name: '天津市', value: 1360 },
];

// ---------------------------------------------------------------------------
// 交互① · 城镇化议题（户籍/城市群/收缩/更新/县城/智慧城市）
// ---------------------------------------------------------------------------
const ISSUES = [
  {
    key: 'hukou', label: '户籍改革 / 市民化', accent: '#c41e3a',
    progress: '城区 300 万以下城市落户全面放开，500 万以下大幅放宽；居住证持有量超 1.3 亿张；都市圈内户籍准入年限互认试点铺开。',
    tension: '放开的恰是人口流出的，卡住的恰是人想去的。超大城市积分落户名额以万计，排队者以百万计——户籍含金量与开放度成反比，这不是技术问题，是公共服务成本的分配问题。',
    policy: '「人地钱挂钩」：转移支付、建设用地指标与农业转移人口落户数挂钩，试图让吸纳人口的城市拿到买单的钱。执行中地方更愿意要地、要钱，落户指标完成口径弹性极大。',
    metric: ['18.2pp', '常住—户籍剪刀差'],
  },
  {
    key: 'cluster', label: '城市群 / 都市圈', accent: '#22d3ee',
    progress: '「19+2」城市群格局成型，承载全国 ~75% 人口、~85% GDP；国家级都市圈批复超 14 个，跨市轨道、社保互认、产业飞地推进。',
    tension: '规划上的城市群是连绵的，财政上的城市群是割裂的。GDP 核算、税收分成、用地指标全部以行政区为单元，断头路与重复建设是分税制在空间上的投影。',
    policy: '都市圈同城化：中心城市放开落户辐射圈层，轨道上的都市圈承担住房压力外溢。本质是用空间换价格——把买不起核心区的人运到 50 公里外。',
    metric: ['19+2', '城市群格局'],
  },
  {
    key: 'shrink', label: '收缩城市', accent: '#64748b',
    progress: '官方语境首次承认「收缩型中小城市」（2019 年发改委文件），要求其瘦身强体、严控增量。东北、西北资源型城市进入存量规划时代。',
    tension: '人口在收缩，建成区还在扩张——不少收缩城市的土地财政惯性仍驱动新城新区。鹤岗化的房价是市场对人口流向的诚实定价，规划话语接受得更慢。',
    policy: '从「增长规划」转向「收缩规划」：基础设施收缩归并、公共服务向县城和中心城区集中。承认收缩是第一步，有序收缩的财政工具还在路上。',
    metric: ['1/3+', '区县常住人口下降'],
  },
  {
    key: 'renewal', label: '城市更新', accent: '#e8a317',
    progress: '城市更新写入国家规划，老旧小区改造累计开工超 25 万个；城中村改造在 35 城铺开；地下管网更新成为新一轮投资主线。',
    tension: '大拆大建的利润模型失效后，微更新的钱从哪来成为真问题。改造不产生土地出让金，物业增值难以回收，更新很容易退化为财政工程。',
    policy: '从「房地产化更新」转向「运营型更新」：片区统筹、做地模式、REITs 退出。能否跑通取决于租金现金流能否覆盖改造资本——多数三四线跑不通。',
    metric: ['25 万+', '老旧小区改造开工'],
  },
  {
    key: 'county', label: '县城城镇化', accent: '#10b981',
    progress: '县城作为城镇化「重要载体」获专门文件（2022）；1800 余个县与县级市承载全国近 30% 城镇常住人口；农民「就近城镇化」成本最低。',
    tension: '县城是农民买得起房的地方，却不是有工作的地方。产业空心的县城城镇化，容易变成「教育驱动的被动进城」——为孩子上学进城，收入仍依赖外出务工。',
    policy: '分类引导：大城市周边县城卫星化、专业功能县城产业化、农产品主产区县城服务化、人口流失县城收缩化。纸面分类清晰，财政能力决定执行成色。',
    metric: ['~30%', '城镇人口居于县域'],
  },
  {
    key: 'smart', label: '智慧城市', accent: '#7c6fd6',
    progress: '城市大脑、一网统管、CIM 平台在数百城市落地；政务服务「一网通办」覆盖面快速扩张；数字孪生从概念走向市政管线等垂直场景。',
    tension: '屏幕做得越来越大，治理颗粒度未必更细。智慧城市的真实考题不是大屏，而是数据能否跨部门流动——条块分割在数字空间被原样复制。',
    policy: '从「建平台」转向「保运营」：智慧城市进入续费周期，财政紧缩下大量项目面临停摆。能活下来的是嵌入业务流程的系统，不是展示用的驾驶舱。',
    metric: ['500+', '试点智慧城市'],
  },
];

// ---------------------------------------------------------------------------
// 剪刀差 · 常住 vs 户籍城镇化率（示意）
// ---------------------------------------------------------------------------
const GAP_YEARS = ['2012', '2014', '2016', '2018', '2020', '2022', '2024'];
const RESIDENT_RATE = [52.6, 54.8, 57.4, 59.6, 63.9, 65.2, 67.0];
const HUKOU_RATE = [35.3, 37.1, 41.2, 43.4, 45.4, 47.7, 48.8];

// ---------------------------------------------------------------------------
// 城市群体系 · 「19+2」（示意：人口/GDP 全国占比 %）
// ---------------------------------------------------------------------------
const CLUSTERS19 = [
  { name: '长三角', pop: 17, gdp: 24, tier: 1 },
  { name: '粤港澳', pop: 6, gdp: 12, tier: 1 },
  { name: '京津冀', pop: 8, gdp: 10, tier: 1 },
  { name: '成渝', pop: 7, gdp: 8, tier: 1 },
  { name: '长江中游', pop: 9, gdp: 9, tier: 2 },
  { name: '中原', pop: 11, gdp: 8, tier: 2 },
  { name: '山东半岛', pop: 7, gdp: 7, tier: 2 },
  { name: '关中平原', pop: 3, gdp: 2.5, tier: 2 },
  { name: '北部湾', pop: 3, gdp: 2, tier: 2 },
  { name: '其余 10 群', pop: 12, gdp: 10, tier: 3 },
];
const TIER_COLOR = { 1: '#c41e3a', 2: '#e8a317', 3: '#64748b' };

// ---------------------------------------------------------------------------
// 人口流动方向 · 分档（示意：年均常住人口增量 万人）
// ---------------------------------------------------------------------------
const FLOW_TIERS = [
  { name: '一线城市', value: 25, color: '#c41e3a', note: '严控人口后增速放缓，但虹吸未止' },
  { name: '强二线 / 省会', value: 180, color: '#22d3ee', note: '抢人大战主战场，落户即送户口' },
  { name: '普通地级市', value: -40, color: '#e8a317', note: '总体微降，分化剧烈' },
  { name: '县城 / 县级市', value: 30, color: '#10b981', note: '就近城镇化承接，教育驱动进城' },
  { name: '收缩城市带', value: -120, color: '#64748b', note: '东北/资源型为主，名单持续扩大' },
];

// ---------------------------------------------------------------------------
// 市民化成本账 · 人均成本构成（示意 %）
// ---------------------------------------------------------------------------
const COST_DONUT = [
  { name: '随迁子女教育', value: 28, itemStyle: { color: '#c41e3a' } },
  { name: '保障性住房', value: 26, itemStyle: { color: '#e8a317' } },
  { name: '社保与养老', value: 22, itemStyle: { color: '#22d3ee' } },
  { name: '医疗卫生', value: 14, itemStyle: { color: '#10b981' } },
  { name: '市政设施分摊', value: 10, itemStyle: { color: '#64748b' } },
];

// ---------------------------------------------------------------------------
// 时间线 · 城镇化之路
// ---------------------------------------------------------------------------
const PHASES = [
  { period: '1984–1997', title: '离土不离乡', accent: '#64748b', desc: '乡镇企业异军突起，农民「进厂不进城」。城镇化率从 23% 爬到 32%，户籍闸门未开，城乡二元结构原样保留——工业化先于城镇化的中国特色起点。' },
  { period: '1998–2012', title: '农民工潮 · 土地城镇化', accent: '#e8a317', desc: '住房商品化 + 入世订单 + 土地财政三轮驱动。2.6 亿农民工撑起世界工厂，城市以每年 2000 平方公里的速度摊大饼。土地城镇化速度约为人口城镇化的 1.8 倍——城市要地不要人。' },
  { period: '2014–2019', title: '新型城镇化规划', accent: '#22d3ee', desc: '《国家新型城镇化规划》首提「以人为核心」，1 亿非户籍人口落户目标写入文件。承认了问题，但买单机制（人地钱挂钩）落地缓慢，剪刀差仅小幅收窄。' },
  { period: '2019–2023', title: '都市圈落户放开', accent: '#10b981', desc: '300 万以下城区落户全面取消，强二线抢人大战白热化。落户门槛从「控制人口」转向「争夺人口」——人口红利见顶后，人本身成了被争夺的资源。' },
  { period: '2023–', title: '县城载体 · 存量更新', accent: '#c41e3a', desc: '增量扩张时代终结：城市更新替代新城建设，县城承接就近城镇化，收缩城市进入瘦身规划。城镇化率逼近 70% 天花板，剩下的题目全是硬骨头——市民化欠账与存量债务。' },
];

export default function Page() {
  const [issueKey, setIssueKey] = useState('hukou');
  const [phaseIdx, setPhaseIdx] = useState(4);
  const issue = ISSUES.find((x) => x.key === issueKey) || ISSUES[0];

  // 剪刀差双线（自写内联：双系列）
  const scissorsChart = useMemo(() => ({
    tooltip: { trigger: 'axis' },
    legend: { data: ['常住人口城镇化率', '户籍人口城镇化率'], textStyle: { color: '#93a1b5', fontSize: 10 }, top: 0 },
    grid: { left: 40, right: 16, top: 30, bottom: 24 },
    xAxis: categoryX(GAP_YEARS),
    yAxis: valueY({ min: 30, max: 75, axisLabel: { formatter: '{value}%' } }),
    series: [
      { name: '常住人口城镇化率', type: 'line', smooth: true, symbol: 'circle', symbolSize: 6, data: RESIDENT_RATE, lineStyle: { color: '#22d3ee', width: 2 }, itemStyle: { color: '#22d3ee' }, areaStyle: { color: 'rgba(34,211,238,0.08)' } },
      { name: '户籍人口城镇化率', type: 'line', smooth: true, symbol: 'circle', symbolSize: 6, data: HUKOU_RATE, lineStyle: { color: '#c41e3a', width: 2 }, itemStyle: { color: '#c41e3a' }, areaStyle: { color: 'rgba(196,30,58,0.08)' } },
    ],
  }), []);

  // 剪刀差宽度 bar（半市民化群体的几何表达）
  const gapWidthChart = useMemo(() => ({
    tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
    grid: GRID,
    xAxis: categoryX(GAP_YEARS),
    yAxis: valueY({ axisLabel: { formatter: '{value}pp' } }),
    series: [{
      type: 'bar', barWidth: 22,
      data: GAP_YEARS.map((_, i) => +(RESIDENT_RATE[i] - HUKOU_RATE[i]).toFixed(1)),
      itemStyle: { color: '#e8a317', borderRadius: [3, 3, 0, 0] },
      label: { show: true, position: 'top', color: '#93a1b5', fontSize: 9, formatter: '{c}' },
    }],
  }), []);

  // 城市群「19+2」人口/GDP 集中度（双系列分组 bar）
  const clusterChart = useMemo(() => ({
    tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' }, formatter: (ps) => ps.map((p) => `${p.seriesName} ${p.name}: ${p.value}%`).join('<br/>') },
    legend: { data: ['人口占比', 'GDP 占比'], textStyle: { color: '#93a1b5', fontSize: 10 }, top: 0 },
    grid: { left: 36, right: 16, top: 30, bottom: 50 },
    xAxis: categoryX(CLUSTERS19.map((x) => x.name), { rotate: 32, fontSize: 9 }),
    yAxis: valueY({ axisLabel: { formatter: '{value}%' } }),
    series: [
      { name: '人口占比', type: 'bar', barWidth: 10, data: CLUSTERS19.map((x) => ({ value: x.pop, itemStyle: { color: TIER_COLOR[x.tier], opacity: 0.55, borderRadius: [2, 2, 0, 0] } })) },
      { name: 'GDP 占比', type: 'bar', barWidth: 10, data: CLUSTERS19.map((x) => ({ value: x.gdp, itemStyle: { color: TIER_COLOR[x.tier], borderRadius: [2, 2, 0, 0] } })) },
    ],
  }), []);

  // 人口流动方向（正负分档着色 bar）
  const flowChart = useMemo(() => ({
    tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' }, formatter: (ps) => { const p = ps[0]; const t = FLOW_TIERS[p.dataIndex]; return `${t.name}: ${t.value > 0 ? '+' : ''}${t.value} 万/年<br/><span style="color:#93a1b5">${t.note}</span>`; } },
    grid: { left: 44, right: 16, top: 16, bottom: 50 },
    xAxis: categoryX(FLOW_TIERS.map((x) => x.name), { rotate: 24, fontSize: 9 }),
    yAxis: valueY({ axisLabel: { formatter: '{value}万' } }),
    series: [{
      type: 'bar', barWidth: 28,
      data: FLOW_TIERS.map((x) => ({ value: x.value, itemStyle: { color: x.color, borderRadius: x.value >= 0 ? [3, 3, 0, 0] : [0, 0, 3, 3] } })),
      label: { show: true, position: 'top', color: '#93a1b5', fontSize: 9, formatter: ({ value }) => (value > 0 ? `+${value}` : `${value}`) },
      markLine: { silent: true, symbol: 'none', lineStyle: { color: 'rgba(148,163,184,0.4)', type: 'dashed' }, label: { show: false }, data: [{ yAxis: 0 }] },
    }],
  }), []);

  // 市民化成本 donut
  const costDonut = useMemo(() => donutOpt(COST_DONUT), []);

  // 成本买单方（stackedBar：中央/省级/市县/企业个人 分摊示意）
  const payerChart = useMemo(() => stackedBarOpt({
    categories: ['教育', '住房', '社保', '医疗', '市政'],
    series: [
      { name: '中央财政', data: [35, 15, 30, 30, 10], itemStyle: { color: '#c41e3a' } },
      { name: '省级统筹', data: [20, 15, 25, 25, 15], itemStyle: { color: '#e8a317' } },
      { name: '市县兜底', data: [40, 45, 25, 35, 65], itemStyle: { color: '#22d3ee' } },
      { name: '企业/个人', data: [5, 25, 20, 10, 10], itemStyle: { color: '#64748b' } },
    ],
  }), []);

  // 城镇化质量雷达（radarOpt 单系列）
  const qualityRadar = useMemo(() => radarOpt(
    ['户籍开放', '公共服务', '住房可负担', '就业容量', '基础设施', '治理能力'],
    [58, 62, 45, 70, 85, 64],
    { name: '城镇化质量（示意）', color: '#22d3ee' },
  ), []);

  return (
    <div>
      <PageHeader badge="New Urbanization" title="以人为核心的新型城镇化" subtitle="市民化 · 户籍 · 城市群 · 县域 · 存量时代" />
      <IntroCard>
        中国城镇化是一场尚未结清的账：常住人口城镇化率 <strong style={{ color: 'var(--text-primary)' }}>~67%</strong>，户籍城镇化率不足 <strong style={{ color: 'var(--text-primary)' }}>49%</strong>——中间约
        <strong style={{ color: 'var(--china-red)' }}> 2.5 亿人</strong>住在城市、工作在城市、纳税在城市，却不被城市的公共服务体系完整接纳。
        土地城镇化先于人的城镇化跑了二十年，留下摊大饼的城区与半市民化的人口；如今增量时代落幕，剩下的全是结构题——谁为市民化买单，人口流向哪些城市，收缩的城市如何体面瘦身。
      </IntroCard>

      <Grid cols={4} className="mb-6">
        <Stat value="~67%" label="常住人口城镇化率" accent="#22d3ee" />
        <Stat value="~49%" label="户籍人口城镇化率" accent="#64748b" />
        <Stat value="19+2" label="城市群格局（承载 ~85% GDP）" accent="#e8a317" />
        <Stat value="~2.5 亿" label="半市民化群体（剪刀差对应人口）" accent="#c41e3a" />
      </Grid>

      {/* ------------------------------------------------------------------ */}
      {/* 空间格局 · 中国地图 */}
      {/* ------------------------------------------------------------------ */}
      <Card title="空间格局 · 省际城镇化分布（示意 · 可切换指标）" className="mb-6">
        <p className="text-xs mb-3" style={{ color: 'var(--text-tertiary)' }}>
          东部沿海与直辖市率先越过 70–88%，中西部多数省份仍在 53–65% 区间爬坡，西藏不足 40%——城镇化的空间梯度，就是公共财政能力的空间梯度。
        </p>
        <ChinaMap metrics={[
          { key: 'rate', label: '城镇化率', valueName: '城镇化率(%)', max: 90, data: URBANIZATION },
          { key: 'pop', label: '常住人口', valueName: '常住人口(万人)', max: 13000, data: POPULATION },
        ]} style={{ height: 470 }} />
      </Card>

      {/* ------------------------------------------------------------------ */}
      {/* 交互① · 议题选择器 */}
      {/* ------------------------------------------------------------------ */}
      <Card title="交互① · 城镇化六大议题（进展 / 矛盾 / 政策走向）" className="mb-6">
        <SelectorBar items={ISSUES} activeKey={issueKey} onSelect={setIssueKey} />
        <div className="os-card p-5 mb-4" style={{ background: 'var(--bg-elevated)', borderLeft: `3px solid ${issue.accent}` }}>
          <div className="flex items-baseline gap-3 mb-3">
            <span className="text-base font-semibold" style={{ color: issue.accent }}>{issue.label}</span>
            <span className="text-xs mono" style={{ color: 'var(--text-tertiary)' }}>{issue.metric[0]} · {issue.metric[1]}</span>
          </div>
          <Grid cols={3}>
            <div>
              <div className="text-xs font-semibold mb-1" style={{ color: '#10b981' }}>进展</div>
              <p className="text-[12px] leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{issue.progress}</p>
            </div>
            <div>
              <div className="text-xs font-semibold mb-1" style={{ color: '#e8a317' }}>结构性矛盾</div>
              <p className="text-[12px] leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{issue.tension}</p>
            </div>
            <div>
              <div className="text-xs font-semibold mb-1" style={{ color: '#22d3ee' }}>政策走向</div>
              <p className="text-[12px] leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{issue.policy}</p>
            </div>
          </Grid>
        </div>
        <p className="text-[11px]" style={{ color: 'var(--text-tertiary)' }}>
          六个议题共用一个底层约束：财政。户籍开多大、更新走多远、县城接多少人，最终都折算成地方政府资产负债表上的一行。
        </p>
      </Card>

      {/* ------------------------------------------------------------------ */}
      {/* 剪刀差 · 两个城镇化率 */}
      {/* ------------------------------------------------------------------ */}
      <Card title="两个城镇化率的剪刀差 · 半市民化的几何表达（示意）" className="mb-6">
        <Grid cols={2}>
          <div>
            <EChart option={scissorsChart} style={{ height: 250 }} />
            <p className="text-[11px] mt-2" style={{ color: 'var(--text-tertiary)' }}>常住率与户籍率双双上行，但两线之间的空隙才是问题本体。</p>
          </div>
          <div>
            <EChart option={gapWidthChart} style={{ height: 250 }} />
            <p className="text-[11px] mt-2" style={{ color: 'var(--text-tertiary)' }}>剪刀差长期徘徊在 17–18 个百分点——每 1pp 约对应 1400 万人的「半市民」存量。</p>
          </div>
        </Grid>
        <div className="os-card p-4 mt-4" style={{ background: 'var(--bg-elevated)', borderLeft: '3px solid #c41e3a' }}>
          <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
            这 2.5 亿人构成了一种独特的政治经济安排：劳动力按市场价进城，公共服务按户籍价供给。城市拿走了他们的生产率，把养老、教育、医疗的成本留给了输出地的农村——这笔账过去叫「人口红利」，现在到了偿付期。
          </p>
        </div>
      </Card>

      {/* ------------------------------------------------------------------ */}
      {/* 城市群体系 + 人口流动 */}
      {/* ------------------------------------------------------------------ */}
      <Grid cols={2} className="mb-6">
        <Card title="「19+2」城市群体系 · 人口/GDP 集中度（示意）">
          <EChart option={clusterChart} style={{ height: 260 }} />
          <p className="text-[11px] mt-2" style={{ color: 'var(--text-tertiary)' }}>
            红=优化提升四极，金=发展壮大梯队，灰=其余培育群。前四极以约 38% 人口产出约 54% GDP——集聚不是政策选择，是政策追认。
          </p>
        </Card>
        <Card title="人口流动方向 · 城市分档年均增减（示意）">
          <EChart option={flowChart} style={{ height: 260 }} />
          <p className="text-[11px] mt-2" style={{ color: 'var(--text-tertiary)' }}>
            强二线是最大赢家，收缩城市带是最大输家；县城靠就近城镇化托底。收缩城市名单持续扩大，规划界从回避到承认用了十年。
          </p>
        </Card>
      </Grid>

      {/* ------------------------------------------------------------------ */}
      {/* 市民化成本账 */}
      {/* ------------------------------------------------------------------ */}
      <Card title="市民化成本账 · 一个人变成市民要花多少钱，谁来出（示意）" className="mb-6">
        <Grid cols={2}>
          <div>
            <div className="text-xs font-semibold mb-2" style={{ color: 'var(--text-secondary)' }}>人均市民化成本构成（口径不一，约 10–18 万元/人）</div>
            <EChart option={costDonut} style={{ height: 250 }} />
          </div>
          <div>
            <div className="text-xs font-semibold mb-2" style={{ color: 'var(--text-secondary)' }}>各项成本的买单结构（% · 示意）</div>
            <EChart option={payerChart} style={{ height: 250 }} />
          </div>
        </Grid>
        <p className="text-[11px] mt-3" style={{ color: 'var(--text-tertiary)' }}>
          市县是最大兜底方，恰恰也是土地财政退潮后最缺钱的一级。「人地钱挂钩」试图让钱跟人走，但激励错位仍在：吸纳一个落户人口是确定的支出，对应的转移支付是滞后且打折的收入。
        </p>
      </Card>

      {/* ------------------------------------------------------------------ */}
      {/* 城镇化质量雷达 + 半市民化判断 */}
      {/* ------------------------------------------------------------------ */}
      <Grid cols={2} className="mb-6">
        <Card title="城镇化质量雷达（示意）">
          <EChart option={qualityRadar} style={{ height: 260 }} />
          <p className="text-[11px] mt-2" style={{ color: 'var(--text-tertiary)' }}>
            基础设施一骑绝尘，住房可负担垫底——硬件城镇化与制度城镇化的落差，正是「量到质」转段的难点。
          </p>
        </Card>
        <Card title="判断 · 城镇化下半场的三个事实">
          <div className="space-y-3">
            <div style={{ borderLeft: '2px solid #c41e3a', paddingLeft: 10 }}>
              <div className="text-xs font-semibold mb-0.5">速度不可逆地放缓</div>
              <p className="text-[11px] leading-relaxed" style={{ color: 'var(--text-tertiary)' }}>年提升幅度从 1.4pp 降到 0.7pp 以下；70% 之后每一个百分点都更贵、更慢。</p>
            </div>
            <div style={{ borderLeft: '2px solid #e8a317', paddingLeft: 10 }}>
              <div className="text-xs font-semibold mb-0.5">分化取代普涨</div>
              <p className="text-[11px] leading-relaxed" style={{ color: 'var(--text-tertiary)' }}>城市群核心继续吸人，收缩带继续失血；「城镇化率」这个全国平均数正在失去信息量。</p>
            </div>
            <div style={{ borderLeft: '2px solid #22d3ee', paddingLeft: 10 }}>
              <div className="text-xs font-semibold mb-0.5">市民化即内需</div>
              <p className="text-[11px] leading-relaxed" style={{ color: 'var(--text-tertiary)' }}>让 2.5 亿人敢消费的前提是公共服务确权——市民化是成本，也是被反复点名的最大内需储备。</p>
            </div>
          </div>
        </Card>
      </Grid>

      {/* ------------------------------------------------------------------ */}
      {/* 交互② · 时间线 */}
      {/* ------------------------------------------------------------------ */}
      <Card title="交互② · 城镇化之路 · 五个阶段" className="mb-6">
        <TimelineBar stages={PHASES} activeIdx={phaseIdx} onSelect={setPhaseIdx} />
      </Card>

      {/* ------------------------------------------------------------------ */}
      {/* 框架三卡 */}
      {/* ------------------------------------------------------------------ */}
      <FrameworkTrio cards={[
        {
          title: '半市民化的红利与债务', subtitle: '一笔尚未结清的账',
          body: '农民工以市民的生产率工作，以农民的成本被供养——这套安排压低了世界工厂的价格，也积累了 2.5 亿人的公共服务欠账。红利已经吃完，债务进入偿付期。',
          pillars: [['红利端', '低成本劳动力补贴了出口与基建三十年。'], ['债务端', '留守儿童、异地养老、教育断档的社会成本递延。'], ['偿付方式', '落户、随迁教育、社保转续——每项都是真金白银。']],
        },
        {
          title: '土地城镇化先于人', subtitle: '摊大饼模式的纠偏',
          body: '土地财政激励下，城市扩张速度长期约为人口流入的 1.8 倍：要地不要人、要 GDP 不要市民。新城新区库存与收缩城市并存，是这套模式的空间遗产。',
          pillars: [['驱动机制', '卖地收入 + 用地指标 + 政绩考核的三重激励。'], ['空间后果', '建成区超前、人口滞后，鬼城与睡城并生。'], ['纠偏方向', '严控增量、盘活存量、人地钱挂钩。']],
        },
        {
          title: '都市圈化', subtitle: '从摊大饼到网络化',
          body: '单中心摊大饼撞上通勤极限后，空间组织转向「中心城市 + 轨道圈层 + 节点县城」的网络形态。这不是规划美学，是用空间结构消化高房价与拥堵的工程方案。',
          pillars: [['轨道先行', '市域铁路把一小时通勤圈拉到 50 公里。'], ['同城化', '社保互认、落户互通、产业分工跨市重组。'], ['县城节点', '圈层末端承接制造外溢与就近市民化。']],
        },
      ]} />

      <ModuleFooter moduleId="urban" sourceNote="由 tabs/urban.html 迁移并扩容" disclaimer="数据为公开资料整理的示意值，非官方统计口径 · 仅供分析框架参考" />
    </div>
  );
}
