import React, { useState, useMemo } from 'react';
import { PageHeader, Card, Grid, Stat } from '../../app/ui.jsx';
import EChart from '../../lib/viz/EChart.jsx';
import { categoryX, valueY, logY, GRID, donutOpt, radarOpt, stackedBarOpt, AXIS, LABEL } from '../shared/chartHelpers.js';
import { IntroCard, SelectorBar, TimelineBar, FrameworkTrio, ModuleFooter } from '../shared/ModuleParadigm.jsx';

// ---------------------------------------------------------------------------
// 制度环节 · 六大切面（确权 → 入表 → 交易 → 公共数据 → 跨境 → 安全）
// ---------------------------------------------------------------------------
const REGIMES = [
  {
    key: 'rights', label: '数据确权 · 三权分置', accent: '#c41e3a',
    design: '「数据二十条」绕开所有权死结：不再争论数据「归谁所有」，而是把产权束拆为资源持有权、加工使用权、产品经营权三束分置流转。所有权悬置，使用权先行——典型的摸石头式制度工程。',
    progress: '顶层设计落地，部分省市出台数据条例与登记办法；数据产权登记试点在北京、深圳、贵州等地展开。',
    blocker: '三权边界在司法实践中尚无判例积累；个人数据与企业数据、公共数据的权属交叉地带模糊；登记证书的对抗效力不明。',
    caseNote: '案例：某车企行驶数据——车主（来源者）、车企（持有者）、地图商（加工者）三方权利如何切分，至今无统一答案。',
    metrics: { maturity: 55, friction: 80 },
  },
  {
    key: 'balance', label: '数据入表', accent: '#e8a317',
    design: '财政部《企业数据资源相关会计处理暂行规定》2024-01 生效：满足资产确认条件的数据资源可计入无形资产或存货。数据第一次有了进资产负债表的合法通道。',
    progress: '上市公司分批试水，首批入表以数据采集加工成本资本化为主；城投平台将公共数据资源入表用于增信融资的冲动强烈。',
    blocker: '入表≠估值：成本法入表金额普遍偏小；公允价值缺乏活跃市场参照；审计与减值测试标准未成熟，虚增资产风险被监管紧盯。',
    caseNote: '案例：部分城投以公共数据「资产化」做大报表撬动贷款——监管担忧其重演土地财政式的抵押品幻觉。',
    metrics: { maturity: 45, friction: 70 },
  },
  {
    key: 'exchange', label: '数据交易所', accent: '#22d3ee',
    design: '场内集中撮合 + 数商生态：交易所提供挂牌、合规审查、交付存证。设计意图是把灰色数据黑市引入阳光化场内。',
    progress: '全国 50+ 家交易场所/平台；上海、深圳、北京、贵阳为头部；挂牌产品数快速增长，金融风控类数据产品最活跃。',
    blocker: '挂牌多、成交少：估算 90%+ 数据流通仍在场外点对点完成。标准化难、复购率低、撮合价值存疑——交易所更像合规背书柜台而非真市场。',
    caseNote: '案例：贵阳大数据交易所 2015 年即挂牌，先发却长期成交清淡——制度先行不等于市场自来。',
    metrics: { maturity: 50, friction: 85 },
  },
  {
    key: 'public', label: '公共数据开放/授权运营', accent: '#10b981',
    design: '公共数据 = 新型国有资源：政务、交通、医疗、气象等数据由政府授权运营主体统一加工运营，收益反哺财政。数字时代的盐铁专营雏形。',
    progress: '多省成立数据集团（云上贵州、上海数据集团等）；授权运营管理办法陆续出台；公共数据产品在场内挂牌渐多。',
    blocker: '部门数据壁垒依旧（各局办「数据私有」惯性）；授权运营定价机制不透明；公共数据收益分配规则未定。',
    caseNote: '案例：气象数据授权运营年化收入可观，但「本应免费的公共品被二次收费」的争议随之而来。',
    metrics: { maturity: 60, friction: 65 },
  },
  {
    key: 'cross', label: '跨境数据流动', accent: '#8b5cf6',
    design: '安全评估 + 标准合同 + 认证三通道出境；自贸区负面清单试点放宽。底层逻辑：数据主权优先，流动是例外，安全是默认。',
    progress: '2024 年《促进和规范数据跨境流动规定》放宽一般数据出境；上海临港、海南、粤港澳探索跨境数据「白名单」。',
    blocker: '重要数据目录界定不清，企业宁可不出境也不愿触线；跨国企业全球数据架构与本地化要求长期紧张。',
    caseNote: '案例：智能汽车与生物医药企业的研发数据出境评估周期以月计——合规成本本身成为竞争变量。',
    metrics: { maturity: 40, friction: 90 },
  },
  {
    key: 'security', label: '数据安全与合规', accent: '#64748b',
    design: '《网络安全法》《数据安全法》《个人信息保护法》三法叠加，分类分级保护 + 重要数据目录 + 安全评估，构成流通的合规天花板。',
    progress: '数据分类分级国标落地；隐私计算（MPC/联邦学习/TEE）成为「可用不可见」的技术解法，头部机构规模化部署。',
    blocker: '合规成本向中小企业倾斜性碾压；隐私计算性能开销与互联互通标准仍是工程瓶颈；安全与流通的钟摆周期性摆向收紧。',
    caseNote: '案例：某出行平台数据安全审查事件后，全行业数据出境与上市合规策略整体转向保守。',
    metrics: { maturity: 65, friction: 75 },
  },
];

// 制度演进时间线
const PHASES = [
  { period: '2015–2019', title: '大数据战略', accent: '#64748b', desc: '国家大数据战略提出，贵阳等地先行试点交易所；数据被视为「资源」而非「要素」，制度供给近乎空白。' },
  { period: '2020', title: '要素市场化配置', accent: '#22d3ee', desc: '中央首次将数据与土地、劳动、资本、技术并列为生产要素——「第五要素」正式获得政治身份。' },
  { period: '2022–2023', title: '数据二十条', accent: '#e8a317', desc: '《关于构建数据基础制度更好发挥数据要素作用的意见》出台：三权分置、收益分配、安全治理四梁八柱立起。' },
  { period: '2023–2024', title: '国家数据局 + 入表', accent: '#c41e3a', desc: '国家数据局挂牌统筹数据要素；数据资产入表新规生效——数据第一次进入资产负债表。' },
  { period: '2025–', title: '全国一体化数据市场', accent: '#10b981', desc: '从城市试点走向全国统一大市场：登记互认、场内互联、公共数据授权运营扩面，东数西算承接算力底座。' },
];

// 东数西算八大枢纽（在建+规划机架规模 · 万标准机架 · 示意）
const HUBS = [
  { name: '京津冀', racks: 95, type: 'east', desc: '低时延业务 · 金融/政务' },
  { name: '长三角', racks: 110, type: 'east', desc: '低时延业务 · 工业互联网' },
  { name: '粤港澳', racks: 90, type: 'east', desc: '低时延业务 · 跨境数据' },
  { name: '成渝', racks: 70, type: 'mid', desc: '双向承接 · 西部门户' },
  { name: '贵州', racks: 80, type: 'west', desc: '后台加工 · 存储备份' },
  { name: '内蒙古', racks: 65, type: 'west', desc: '绿电算力 · 离线训练' },
  { name: '甘肃', racks: 40, type: 'west', desc: '冷数据 · 灾备' },
  { name: '宁夏', racks: 55, type: 'west', desc: '绿电算力 · 一体化示范' },
];
const HUB_COLORS = { east: '#c41e3a', mid: '#e8a317', west: '#22d3ee' };

// 数据交易所对比（挂牌产品数 / 累计交易额 亿元 · 示意）
const EXCHANGES = [
  { name: '上海数交所', listed: 3200, volume: 110, accent: '#c41e3a' },
  { name: '深圳数交所', listed: 2400, volume: 85, accent: '#22d3ee' },
  { name: '北京国际大数据', listed: 1800, volume: 60, accent: '#e8a317' },
  { name: '贵阳大数据', listed: 1500, volume: 45, accent: '#10b981' },
  { name: '广州数交所', listed: 1200, volume: 38, accent: '#8b5cf6' },
  { name: '其他场所合计', listed: 2600, volume: 70, accent: '#64748b' },
];

// 数据要素市场规模（亿元 · 示意；2025 后为预测）
const MARKET_YEARS = ['2020', '2021', '2022', '2023', '2024', '2025E', '2026E', '2027E'];
const MARKET_SIZE = [550, 750, 950, 1280, 1600, 2050, 2600, 3300];
const DATA_OUTPUT = [3.9, 6.6, 8.1, 9.9, 12.1, 14.5, 17.5, 21.0]; // 全国数据产量 ZB · 示意

export default function Page() {
  const [regimeKey, setRegimeKey] = useState('rights');
  const [phaseIdx, setPhaseIdx] = useState(3);
  const [hubView, setHubView] = useState('racks'); // racks | flow
  const regime = REGIMES.find((r) => r.key === regimeKey) || REGIMES[0];

  // -- 市场规模：双轴（交易规模 bar + 数据产量 line） ------------------------
  const marketTrend = useMemo(() => ({
    tooltip: { trigger: 'axis' },
    legend: { data: ['交易规模(亿元)', '数据产量(ZB)'], textStyle: { color: LABEL.color, fontSize: 10 }, top: 0 },
    grid: { left: 44, right: 44, top: 30, bottom: 24 },
    xAxis: categoryX(MARKET_YEARS),
    yAxis: [valueY(), { ...valueY(), splitLine: { show: false } }],
    series: [
      { name: '交易规模(亿元)', type: 'bar', barWidth: 18,
        data: MARKET_SIZE.map((v, i) => ({ value: v, itemStyle: { color: i >= 5 ? 'rgba(196,30,58,0.35)' : '#c41e3a', borderRadius: [3, 3, 0, 0] } })) },
      { name: '数据产量(ZB)', type: 'line', yAxisIndex: 1, smooth: true, symbol: 'circle', symbolSize: 5,
        data: DATA_OUTPUT, lineStyle: { color: '#22d3ee', width: 2 }, itemStyle: { color: '#22d3ee' } },
    ],
  }), []);

  // -- 场内 vs 场外（残酷的现实结构 · 堆叠） ---------------------------------
  const onOffMarket = useMemo(() => stackedBarOpt({
    categories: ['2021', '2022', '2023', '2024', '2027E'],
    series: [
      { name: '场内合规交易', data: [2, 4, 6, 9, 25], itemStyle: { color: '#22d3ee' } },
      { name: '场外点对点', data: [58, 61, 64, 66, 55], itemStyle: { color: '#e8a317' } },
      { name: '灰色/黑市流通', data: [40, 35, 30, 25, 20], itemStyle: { color: '#64748b' } },
    ],
  }), []);

  // -- 制度切面：成熟度 vs 摩擦度（横向对比 bar） ----------------------------
  const regimeCompare = useMemo(() => ({
    tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
    legend: { data: ['制度成熟度', '现实摩擦度'], textStyle: { color: LABEL.color, fontSize: 10 }, top: 0 },
    grid: { left: 96, right: 36, top: 30, bottom: 24 },
    xAxis: valueY({ max: 100 }),
    yAxis: categoryX(REGIMES.map((r) => r.label.split(' · ')[0])),
    series: [
      { name: '制度成熟度', type: 'bar', barWidth: 9, itemStyle: { borderRadius: 2 },
        data: REGIMES.map((r) => ({ value: r.metrics.maturity, itemStyle: { color: r.key === regimeKey ? r.accent : 'rgba(34,211,238,0.45)' } })) },
      { name: '现实摩擦度', type: 'bar', barWidth: 9, itemStyle: { borderRadius: 2, color: 'rgba(232,163,23,0.5)' },
        data: REGIMES.map((r) => r.metrics.friction) },
    ],
  }), [regimeKey]);

  // -- 东数西算枢纽 -----------------------------------------------------------
  const hubBar = useMemo(() => {
    if (hubView === 'racks') {
      return {
        tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' }, formatter: (p) => `${p[0].name}<br/>${HUBS[p[0].dataIndex].desc}<br/>机架规模：${p[0].value} 万架（示意）` },
        grid: GRID,
        xAxis: categoryX(HUBS.map((h) => h.name)),
        yAxis: valueY(),
        series: [{ type: 'bar', barWidth: 22,
          data: HUBS.map((h) => ({ value: h.racks, itemStyle: { color: HUB_COLORS[h.type], borderRadius: [3, 3, 0, 0] } })),
          label: { show: true, position: 'top', color: LABEL.color, fontSize: 10 } }],
      };
    }
    // flow：东部需求 vs 西部承接（电价/PUE 套利空间）
    return {
      tooltip: { trigger: 'axis' },
      legend: { data: ['东部算力需求指数', '西部承接能力指数'], textStyle: { color: LABEL.color, fontSize: 10 }, top: 0 },
      grid: { left: 44, right: 24, top: 30, bottom: 24 },
      xAxis: categoryX(['2022', '2023', '2024', '2025E', '2026E', '2027E']),
      yAxis: valueY(),
      series: [
        { name: '东部算力需求指数', type: 'line', smooth: true, data: [100, 130, 175, 230, 300, 385], lineStyle: { color: '#c41e3a', width: 2 }, itemStyle: { color: '#c41e3a' }, areaStyle: { color: 'rgba(196,30,58,0.1)' } },
        { name: '西部承接能力指数', type: 'line', smooth: true, data: [60, 85, 120, 170, 235, 320], lineStyle: { color: '#22d3ee', width: 2 }, itemStyle: { color: '#22d3ee' }, areaStyle: { color: 'rgba(34,211,238,0.1)' } },
      ],
    };
  }, [hubView]);

  // -- 交易所：挂牌 vs 成交（双轴揭示撮合困境） ------------------------------
  const exchangeBar = useMemo(() => ({
    tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
    legend: { data: ['挂牌产品数', '累计交易额(亿元)'], textStyle: { color: LABEL.color, fontSize: 10 }, top: 0 },
    grid: { left: 44, right: 44, top: 30, bottom: 42 },
    xAxis: categoryX(EXCHANGES.map((x) => x.name), { rotate: 20 }),
    yAxis: [valueY(), { ...valueY(), splitLine: { show: false } }],
    series: [
      { name: '挂牌产品数', type: 'bar', barWidth: 16,
        data: EXCHANGES.map((x) => ({ value: x.listed, itemStyle: { color: x.accent, borderRadius: [3, 3, 0, 0] } })) },
      { name: '累计交易额(亿元)', type: 'line', yAxisIndex: 1, symbol: 'diamond', symbolSize: 8,
        data: EXCHANGES.map((x) => x.volume), lineStyle: { color: '#e8a317', width: 2 }, itemStyle: { color: '#e8a317' } },
    ],
  }), []);

  // -- 数据交易行业分布（保留原图） ------------------------------------------
  const sectorDonut = useMemo(() => donutOpt([
    { value: 30, name: '金融风控', itemStyle: { color: '#c41e3a' } },
    { value: 22, name: '政务/公共', itemStyle: { color: '#22d3ee' } },
    { value: 18, name: '互联网营销', itemStyle: { color: '#e8a317' } },
    { value: 16, name: '工业/交通', itemStyle: { color: '#10b981' } },
    { value: 9, name: '医疗健康', itemStyle: { color: '#8b5cf6' } },
    { value: 5, name: '其他', itemStyle: { color: '#64748b' } },
  ]), []);

  // -- 数据要素生态雷达（2024 vs 2021 · 双系列自写内联） ---------------------
  const ecoRadar = useMemo(() => ({
    legend: { data: ['2024', '2021'], textStyle: { color: LABEL.color, fontSize: 10 }, top: 0 },
    radar: {
      indicator: ['确权制度', '交易流通', '安全合规', '技术底座', '入表实践', '跨境机制'].map((n) => ({ name: n, max: 100 })),
      axisName: { color: LABEL.color, fontSize: 10 },
      splitLine: { lineStyle: { color: 'rgba(148,163,184,0.15)' } },
      axisLine: { lineStyle: { color: 'rgba(148,163,184,0.15)' } },
      splitArea: { show: false },
    },
    series: [{ type: 'radar', data: [
      { value: [62, 50, 72, 78, 48, 40], name: '2024', lineStyle: { color: '#c41e3a', width: 2 }, itemStyle: { color: '#c41e3a' }, areaStyle: { color: 'rgba(196,30,58,0.12)' } },
      { value: [25, 22, 45, 50, 5, 20], name: '2021', lineStyle: { color: '#64748b' }, itemStyle: { color: '#64748b' } },
    ] }],
  }), []);

  // -- 隐私计算成熟度（保留 · 单系列 radarOpt） ------------------------------
  const privacyRadar = useMemo(() => radarOpt(
    ['MPC', '联邦学习', 'TEE', '工程性能', '互联互通', '合规适配'],
    [82, 88, 80, 62, 48, 85],
    { name: '隐私计算 2024', color: '#22d3ee' },
  ), []);

  return (
    <div>
      <PageHeader badge="Data Element · Fifth Factor" title="数据要素与数字基础制度" subtitle="数据二十条 · 三权分置 · 入表 · 东数西算 —— 第五大生产要素的制度工程" />
      <IntroCard>
        土地、劳动、资本、技术之后，数据被列为<strong style={{ color: 'var(--text-primary)' }}>第五大生产要素</strong>——但要素必须可确权、可定价、可流通才成其为要素。
        「数据二十条」以<strong style={{ color: 'var(--text-primary)' }}>三权分置</strong>悬置所有权死结，入表新规打开资产化通道，东数西算铺设物理底座，
        国家数据局统筹全局。这是一场用制度工程把沉睡字节炼成生产资料的国家级实验：场内交易仍然清淡，场外流通仍是主流，
        而公共数据授权运营正在长成<strong style={{ color: 'var(--text-primary)' }}>数字时代的盐铁专营</strong>。
      </IntroCard>

      <Grid cols={4} className="mb-6">
        <Stat value="~12 ZB" label="2024 全国数据产量（示意）" accent="#22d3ee" />
        <Stat value="~1,600 亿" label="数据交易规模 (RMB · 示意)" accent="#c41e3a" />
        <Stat value="50+ 家" label="数据交易场所/平台" accent="#e8a317" />
        <Stat value="100+ 家" label="数据资源入表上市公司（示意）" accent="#10b981" />
      </Grid>

      {/* ① 制度环节选择器 */}
      <Card title="交互① · 制度环节切面 — 设计 / 进展 / 堵点 / 案例" className="mb-6">
        <SelectorBar items={REGIMES} activeKey={regimeKey} onSelect={setRegimeKey} />
        <Grid cols={2} className="mb-4">
          <div className="os-card p-4" style={{ background: 'var(--bg-elevated)', borderLeft: `3px solid ${regime.accent}` }}>
            <div className="text-xs font-semibold mb-1 mono" style={{ color: regime.accent }}>制度设计</div>
            <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{regime.design}</p>
          </div>
          <div className="os-card p-4" style={{ background: 'var(--bg-elevated)', borderLeft: '3px solid #10b981' }}>
            <div className="text-xs font-semibold mb-1 mono" style={{ color: '#10b981' }}>落地进展</div>
            <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{regime.progress}</p>
          </div>
          <div className="os-card p-4" style={{ background: 'var(--bg-elevated)', borderLeft: '3px solid #e8a317' }}>
            <div className="text-xs font-semibold mb-1 mono" style={{ color: '#e8a317' }}>现实堵点</div>
            <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{regime.blocker}</p>
          </div>
          <div className="os-card p-4" style={{ background: 'var(--bg-elevated)', borderLeft: '3px solid #64748b' }}>
            <div className="text-xs font-semibold mb-1 mono" style={{ color: LABEL.color }}>切片样本</div>
            <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{regime.caseNote}</p>
          </div>
        </Grid>
        <Card title="六大环节 · 制度成熟度 vs 现实摩擦度（示意评分）">
          <EChart option={regimeCompare} style={{ height: 260 }} />
        </Card>
      </Card>

      {/* ② 市场规模 + 场内场外 */}
      <Grid cols={2} className="mb-6">
        <Card title="数据要素市场：从沉睡资产到生产要素（亿元/ZB · 示意，E 为预测）">
          <EChart option={marketTrend} style={{ height: 250 }} />
          <p className="text-xs mt-2 leading-relaxed" style={{ color: 'var(--text-tertiary)' }}>数据产量指数级膨胀，交易规模却只占其价值释放潜力的零头——要素化的瓶颈不在供给，在制度。</p>
        </Card>
        <Card title="流通结构的现实：场内仍是零头（%份额 · 示意）">
          <EChart option={onOffMarket} style={{ height: 250 }} />
          <p className="text-xs mt-2 leading-relaxed" style={{ color: 'var(--text-tertiary)' }}>估算 90% 以上数据流通发生在场外点对点与灰色地带；交易所的真实角色目前更接近合规存证柜台。</p>
        </Card>
      </Grid>

      {/* ③ 三权分置结构卡 */}
      <Card title="「三权分置」· 绕开所有权死结的产权工程" className="mb-6">
        <p className="text-sm leading-relaxed mb-4" style={{ color: 'var(--text-secondary)' }}>
          数据天然可复制、非排他，传统所有权框架在此失效。「数据二十条」的解法不是回答「数据归谁」，而是把这个问题<strong style={{ color: 'var(--text-primary)' }}>制度性悬置</strong>——拆出三束可分别授权、登记、流转的权利。与农地「三权分置」（所有/承包/经营）同构：所有权不动，使用权先跑。
        </p>
        <div className="grid gap-4" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))' }}>
          {[
            { t: '资源持有权', a: '#c41e3a', who: '数据收集/控制方', what: '对合法获取的数据资源享有自主管控与防侵权的权利。', edge: '边界：来源者（个人/企业）的知情同意与携带权如何对抗持有方。' },
            { t: '加工使用权', a: '#22d3ee', who: '数据加工处理方', what: '经授权对数据清洗、建模、开发，形成增值的权利。', edge: '边界：授权链条层层转包后，原始授权范围如何穿透追溯。' },
            { t: '产品经营权', a: '#e8a317', who: '数据产品运营方', what: '对加工形成的数据产品独立定价、交易、收益的权利。', edge: '边界：产品收益如何向上游持有者与来源者分配——收益分配是未完成章节。' },
          ].map((x) => (
            <div key={x.t} className="os-card p-4" style={{ background: 'var(--bg-surface)', borderTop: `2px solid ${x.a}` }}>
              <div className="text-sm font-semibold mb-1" style={{ color: x.a }}>{x.t}</div>
              <div className="text-[11px] mono mb-2" style={{ color: 'var(--text-tertiary)' }}>{x.who}</div>
              <p className="text-xs leading-relaxed mb-2" style={{ color: 'var(--text-secondary)' }}>{x.what}</p>
              <p className="text-[11px] leading-relaxed" style={{ color: 'var(--text-tertiary)' }}>{x.edge}</p>
            </div>
          ))}
        </div>
      </Card>

      {/* ④ 东数西算 */}
      <Card title="交互② · 东数西算 — 算力的空间再配置" className="mb-6">
        <SelectorBar
          items={[{ key: 'racks', label: '八大枢纽机架规模', accent: '#22d3ee' }, { key: 'flow', label: '东部需求 × 西部承接', accent: '#c41e3a' }]}
          activeKey={hubView} onSelect={setHubView} />
        <EChart option={hubBar} style={{ height: 260 }} />
        <div className="flex flex-wrap gap-4 mt-3 text-[11px] mono" style={{ color: 'var(--text-tertiary)' }}>
          <span><span style={{ color: HUB_COLORS.east }}>■</span> 东部枢纽（低时延在线业务）</span>
          <span><span style={{ color: HUB_COLORS.mid }}>■</span> 成渝（双向承接）</span>
          <span><span style={{ color: HUB_COLORS.west }}>■</span> 西部枢纽（绿电 · 离线训练 · 冷存储）</span>
        </div>
        <p className="text-xs mt-2 leading-relaxed" style={{ color: 'var(--text-tertiary)' }}>
          逻辑同「西电东送」：把东部的算力需求调度到西部的廉价绿电上，时延不敏感的训练与存储西迁，电价差与 PUE 差就是套利空间。大模型训练潮让这一基建从政策驱动转向需求驱动。
        </p>
      </Card>

      {/* ⑤ 交易所 + 行业分布 */}
      <Grid cols={2} className="mb-6">
        <Card title="数据交易所：挂牌繁荣 × 成交清淡（示意）">
          <EChart option={exchangeBar} style={{ height: 250 }} />
        </Card>
        <Card title="场内数据产品行业分布（% · 示意）">
          <EChart option={sectorDonut} style={{ height: 250 }} />
          <p className="text-xs mt-1 leading-relaxed" style={{ color: 'var(--text-tertiary)' }}>金融风控类最活跃——离钱最近的数据最先完成要素化。</p>
        </Card>
      </Grid>

      {/* ⑥ 生态雷达 */}
      <Grid cols={2} className="mb-6">
        <Card title="数据要素生态成熟度雷达（2021 → 2024 · 示意评分）">
          <EChart option={ecoRadar} style={{ height: 260 }} />
        </Card>
        <Card title="隐私计算技术底座 ·「可用不可见」">
          <EChart option={privacyRadar} style={{ height: 260 }} />
          <p className="text-xs mt-1 leading-relaxed" style={{ color: 'var(--text-tertiary)' }}>算法成熟、工程性能与跨平台互联互通仍是短板——技术替制度补位，但替不完。</p>
        </Card>
      </Grid>

      {/* ⑦ 时间线 */}
      <Card title="交互③ · 制度演进时间线 — 从资源到要素的政治升格" className="mb-6">
        <TimelineBar stages={PHASES} activeIdx={phaseIdx} onSelect={setPhaseIdx} />
      </Card>

      {/* ⑧ FrameworkTrio */}
      <FrameworkTrio cards={[
        { title: '第五要素', subtitle: '土地 · 劳动 · 资本 · 技术 · 数据', body: '把数据升格为生产要素是政治经济学动作：在土地财政退潮、人口红利见顶之后，国家需要一种新的、可制度化汲取的增量要素。数据要素化是为增长寻找新抵押品。', pillars: [['要素升格', '2020 年中央文件正式并列五要素。'], ['增长叙事', '数字经济占 GDP 比重持续抬升。'], ['汲取通道', '入表/授权运营打开财政想象。']] },
        { title: '确权破局', subtitle: '三权分置 · 悬置所有权', body: '与农地改革同一套方法论：所有权问题无解就不解，拆出可流转的次级权利先把市场跑起来。摸石头过河在产权领域的最新应用——制度模糊本身是设计特性而非缺陷。', pillars: [['悬置死结', '不争论归属，先分置流转。'], ['登记试点', '产权登记证书探索对抗效力。'], ['司法空窗', '判例缺失，边界靠实践磨。']] },
        { title: '数字盐铁', subtitle: '公共数据 = 新型国有资源', body: '政务、交通、医疗、气象数据由政府授权运营主体专营加工，收益反哺财政——结构上与盐铁专营、土地批租同构：国家垄断关键资源的一级市场，向社会出让二级使用权。', pillars: [['授权运营', '省级数据集团充当专营主体。'], ['财政逻辑', '数据财政被寄望接棒土地财政。'], ['公地争议', '公共品二次收费的正当性之辩。']] },
      ]} />

      {/* ⑨ 研判要点 */}
      <Card title="研判要点 · 系统视角" className="mb-6">
        <Grid cols={3}>
          {[
            ['1 · 制度先于市场', '交易所、登记、入表都是先建制度容器再等市场注水；容器繁荣不等于水流到位，场外流通仍是基本盘。'],
            ['2 · 入表的双刃', '数据资产化打开融资通道，也复刻土地财政式的抵押品幻觉——城投数据入表是下一个需要盯紧的风险敞口。'],
            ['3 · 数据喂养 AI', '大模型把语料从合规问题升格为战略资源；合规高质量语料的供给规模，直接决定本土模型的竞争上限。'],
            ['4 · 安全是天花板', '数据主权逻辑下，安全合规优先于流通效率；跨境通道的松紧是观察整个体系风险偏好的温度计。'],
            ['5 · 算数耦合', '东数西算把数据加工与西部绿电耦合，算力地理 = 新的区域转移支付；枢纽上架率是检验真实需求的硬指标。'],
            ['6 · 收益分配未完成', '三权分置解了流转，没解分配——来源者（个人）几乎缺席收益链条，这是制度工程留白最大的一章。'],
          ].map(([t, d]) => (
            <div key={t}>
              <div className="text-sm font-semibold" style={{ color: 'var(--china-red)' }}>{t}</div>
              <p className="text-xs mt-1 leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{d}</p>
            </div>
          ))}
        </Grid>
      </Card>

      <ModuleFooter moduleId="dataElement" disclaimer="数值均为公开资料整理之示意估算，非官方统计 · 制度评分为分析框架自评，仅供研判参考，非投资建议" sourceNote="由 tabs/dataElement.html 迁移扩容" />
    </div>
  );
}
