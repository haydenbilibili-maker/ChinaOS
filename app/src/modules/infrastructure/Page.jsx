import React, { useState, useMemo } from 'react';
import { PageHeader, Card, Grid, Stat, StatGrid, OsSparkline } from '../../app/ui.jsx';
import EChart from '../../lib/viz/EChart.jsx';
import { categoryX, valueY, logY, GRID, donutOpt, radarOpt, stackedBarOpt } from '../shared/chartHelpers.js';
import { IntroCard, SelectorBar, TimelineBar, FrameworkTrio, ModuleFooter } from '../shared/ModuleParadigm.jsx';

// ----------------------------------------------------------------------------
// 板块选择器数据（示意值）
// ----------------------------------------------------------------------------
const SECTORS = [
  {
    key: 'transport', label: '交通（铁公机港）', accent: '#c41e3a',
    scale: '~3.8 万亿', growth: '+5.2%', saturation: '高（干线趋饱和）',
    funding: '车购税 + 专项债 + 铁路债 + 收费权融资',
    pain: '干线网络基本成型，新增线路客流密度递减；中西部高铁「建得起、养不起」，运营亏损依赖交叉补贴。',
    note: '从「八纵八横」收官转向枢纽改造与既有线提效——增量空间收窄，重资产折旧进入兑现期。',
    trend: [4.1, 4.3, 4.0, 3.9, 3.8],
  },
  {
    key: 'energy', label: '能源水利', accent: '#e8a317',
    scale: '~2.6 万亿', growth: '+12.8%', saturation: '中（结构性缺口）',
    funding: '电网自有资金 + 政策性金融工具 + 专项债（水利）',
    pain: '新能源装机超前而消纳通道滞后；特高压与抽水蓄能投资周期长、回报机制依赖输配电价核定。',
    note: '双碳目标下唯一逆势高增的板块——电网与水网是「十四五」后期最确定的财政发力通道。',
    trend: [1.7, 1.9, 2.1, 2.4, 2.6],
  },
  {
    key: 'municipal', label: '市政管网', accent: '#22d3ee',
    scale: '~2.1 万亿', growth: '+6.5%', saturation: '低（历史欠账）',
    funding: '专项债 + 中央预算内投资 + 城投存量盘活',
    pain: '地下管网更新欠账巨大但无直接现金流，专项债「项目收益自平衡」要求与公益属性天然冲突。',
    note: '燃气/排水/供热老化管网改造是「看不见的基建」——政治账清晰、经济账难算。',
    trend: [1.6, 1.7, 1.8, 2.0, 2.1],
  },
  {
    key: 'newinfra', label: '新基建（5G/算力/充电桩）', accent: '#10b981',
    scale: '~1.5 万亿', growth: '+18.4%', saturation: '低（爬坡期）',
    funding: '运营商资本开支 + 社会资本 + 地方产业基金',
    pain: '数据中心区域性过剩与算力结构性短缺并存；充电桩「有桩无车 / 有车无桩」的空间错配。',
    note: '「东数西算」把算力按电价与气候重新布点——新基建是物理联通向数据联通的切换接口。',
    trend: [0.8, 1.0, 1.1, 1.3, 1.5],
  },
  {
    key: 'dual', label: '平急两用', accent: '#8b5cf6',
    scale: '~0.6 万亿', growth: '+25.0%', saturation: '极低（新设科目）',
    funding: '专项债 + 政策性开发性金融工具定向支持',
    pain: '「平时可用、急时能转换」的双重设计抬高单位造价；平时运营现金流薄弱，回报模型尚未跑通。',
    note: '超大特大城市的「冗余工程」——以防灾名义为基建投资开辟的新合规通道。',
    trend: [0.1, 0.2, 0.3, 0.45, 0.6],
  },
  {
    key: 'renewal', label: '城市更新', accent: '#94a3b8',
    scale: '~1.2 万亿', growth: '+9.6%', saturation: '中（存量时代主战场）',
    funding: '专项债（城中村改造）+ 政策性银行专项借款 + 房企代建',
    pain: '拆迁成本远高于增量开发，资金平衡依赖容积率腾挪与土地二次出让——地产下行期模型失效。',
    note: '从「大拆大建」转向「留改拆」：城市更新本质是把基建投资从郊区增量搬回中心城区存量。',
    trend: [0.9, 1.0, 1.0, 1.1, 1.2],
  },
];

// ----------------------------------------------------------------------------
// 新老基建结构演进（投资占比 %，示意）
// ----------------------------------------------------------------------------
const STRUCT_YEARS = ['2008', '2012', '2016', '2020', '2023', '2025E'];
const structOpt = stackedBarOpt({
  categories: STRUCT_YEARS,
  series: [
    { name: '传统基建（铁公机港/市政）', data: [96, 94, 90, 84, 78, 72], itemStyle: { color: '#475569' } },
    { name: '能源水利', data: [3, 4, 6, 8, 11, 14], itemStyle: { color: '#e8a317' } },
    { name: '新基建（5G/算力/充电桩）', data: [1, 2, 4, 8, 11, 14], itemStyle: { color: '#10b981' } },
  ],
});

// ----------------------------------------------------------------------------
// 基建投资增速 vs GDP 增速（双线，示意）
// ----------------------------------------------------------------------------
const CYCLE_YEARS = ['2008', '2010', '2012', '2014', '2016', '2018', '2020', '2022', '2024'];
const cycleOpt = {
  tooltip: { trigger: 'axis' },
  legend: { top: 0, textStyle: { color: '#93a1b5', fontSize: 10 }, itemWidth: 12 },
  grid: { ...GRID, top: 30 },
  xAxis: categoryX(CYCLE_YEARS),
  yAxis: valueY({ axisLabel: { formatter: '{value}%' } }),
  series: [
    {
      name: '基建投资增速', type: 'line', smooth: true, symbol: 'circle', symbolSize: 5,
      data: [23.6, 18.6, 13.7, 20.3, 15.7, 3.8, 3.4, 11.5, 9.2],
      lineStyle: { color: '#c41e3a', width: 2 }, itemStyle: { color: '#c41e3a' },
      areaStyle: { color: 'rgba(196,30,58,0.08)' },
    },
    {
      name: 'GDP 增速', type: 'line', smooth: true, symbol: 'circle', symbolSize: 5,
      data: [9.7, 10.6, 7.9, 7.4, 6.8, 6.7, 2.2, 3.0, 5.0],
      lineStyle: { color: '#22d3ee', width: 2, type: 'dashed' }, itemStyle: { color: '#22d3ee' },
    },
  ],
};

// ----------------------------------------------------------------------------
// 资金来源结构 donut（示意 %）
// ----------------------------------------------------------------------------
const fundingDonut = donutOpt([
  { value: 32, name: '地方专项债', itemStyle: { color: '#c41e3a' } },
  { value: 22, name: '城投平台融资', itemStyle: { color: '#475569' } },
  { value: 18, name: '一般公共预算', itemStyle: { color: '#e8a317' } },
  { value: 16, name: '政策性金融工具', itemStyle: { color: '#22d3ee' } },
  { value: 12, name: '社会资本（PPP/特许经营）', itemStyle: { color: '#10b981' } },
]);

// ----------------------------------------------------------------------------
// REITs 存量盘活（按资产类型发行规模，示意 亿元）
// ----------------------------------------------------------------------------
const reitsOpt = {
  tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
  grid: { left: 76, right: 36, top: 16, bottom: 24 },
  xAxis: valueY({ axisLabel: { formatter: '{value}' } }),
  yAxis: { ...categoryX(['消费基础设施', '保障性租赁住房', '生态环保', '能源', '园区', '仓储物流', '高速公路']), type: 'category' },
  series: [{
    type: 'bar', barWidth: 14,
    data: [
      { value: 110, itemStyle: { color: '#94a3b8' } },
      { value: 130, itemStyle: { color: '#8b5cf6' } },
      { value: 150, itemStyle: { color: '#10b981' } },
      { value: 210, itemStyle: { color: '#e8a317' } },
      { value: 280, itemStyle: { color: '#22d3ee' } },
      { value: 320, itemStyle: { color: '#475569' } },
      { value: 540, itemStyle: { color: '#c41e3a' } },
    ],
    itemStyle: { borderRadius: 3 },
    label: { show: true, position: 'right', color: '#93a1b5', fontSize: 10 },
  }],
};

// ----------------------------------------------------------------------------
// 人均基建存量国际对比（指数，美国=100，示意）
// ----------------------------------------------------------------------------
const intlOpt = {
  tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
  grid: GRID,
  xAxis: categoryX(['中国', '美国', '日本', '德国']),
  yAxis: valueY({ max: 140 }),
  series: [{
    type: 'bar', barWidth: 30,
    data: [
      { value: 42, itemStyle: { color: '#c41e3a' } },
      { value: 100, itemStyle: { color: '#475569' } },
      { value: 128, itemStyle: { color: '#475569' } },
      { value: 96, itemStyle: { color: '#475569' } },
    ],
    itemStyle: { borderRadius: 3 },
    label: { show: true, position: 'top', color: '#93a1b5', fontSize: 10 },
  }],
};

// ----------------------------------------------------------------------------
// 基建投资乘数效应递减（示意曲线）
// ----------------------------------------------------------------------------
const multiplierOpt = {
  tooltip: { trigger: 'axis' },
  grid: { ...GRID, top: 24 },
  xAxis: categoryX(['1998', '2003', '2008', '2013', '2018', '2023']),
  yAxis: valueY({ name: '投资乘数', nameTextStyle: { color: '#93a1b5', fontSize: 10 } }),
  series: [{
    type: 'line', smooth: true, symbol: 'circle', symbolSize: 6,
    data: [3.2, 2.8, 2.4, 1.8, 1.3, 0.9],
    lineStyle: { color: '#e8a317', width: 2 },
    itemStyle: { color: '#e8a317' },
    areaStyle: { color: 'rgba(232,163,23,0.1)' },
    markLine: {
      silent: true, symbol: 'none',
      lineStyle: { color: 'rgba(196,30,58,0.6)', type: 'dashed' },
      label: { color: '#93a1b5', fontSize: 10, formatter: '乘数=1 · 投入产出临界线' },
      data: [{ yAxis: 1 }],
    },
  }],
};

// ----------------------------------------------------------------------------
// 保留：高铁系统 radar / 全球枢纽 bar / 低空经济 treemap
// ----------------------------------------------------------------------------
const railRadar = radarOpt(
  ['通达度', '平均速度', '调度智能化', '成本控制', '安全冗余'],
  [98, 95, 92, 88, 96],
  { name: '中国高铁系统 (2024)', color: '#c41e3a' },
);

const hubBar = {
  grid: { left: 40, right: 16, top: 20, bottom: 28 },
  xAxis: categoryX(['洋山港', '宁波舟山', '新加坡', '鹿特丹']),
  yAxis: valueY({ max: 100 }),
  series: [{
    type: 'bar',
    barWidth: 26,
    data: [
      { value: 95, itemStyle: { color: '#c41e3a' } },
      { value: 92, itemStyle: { color: '#c41e3a' } },
      { value: 88, itemStyle: { color: '#475569' } },
      { value: 82, itemStyle: { color: '#475569' } },
    ],
    itemStyle: { borderRadius: 3 },
    label: { show: true, position: 'top', color: '#93a1b5', fontSize: 10 },
  }],
};

const lowAltTreemap = {
  tooltip: { trigger: 'item' },
  series: [{
    type: 'treemap',
    top: 8, left: 0, right: 0, bottom: 8,
    breadcrumb: { show: false },
    roam: false,
    nodeClick: false,
    data: [
      { name: '物流配送', value: 40, itemStyle: { color: '#c41e3a' } },
      { name: '个人出行(eVTOL)', value: 25, itemStyle: { color: '#22d3ee' } },
      { name: '应急救援', value: 15, itemStyle: { color: '#e8a317' } },
      { name: '农林植保', value: 12, itemStyle: { color: '#10b981' } },
      { name: '空域管理软件', value: 8, itemStyle: { color: '#475569' } },
    ],
    label: { show: true, formatter: '{b}\n{c}%', fontSize: 11, color: '#f8fafc' },
  }],
};

// ----------------------------------------------------------------------------
// 基建演进时间线
// ----------------------------------------------------------------------------
const STAGES = [
  { period: '1998–2008', title: '铁公机大会战', accent: '#475569', desc: '亚洲金融危机后以国债搞基建开启范式：高速公路从零到全球第一，「要想富先修路」成为地方政府的第一性原理。基建是工业化与城镇化的物理先导，乘数效应处于历史峰值。' },
  { period: '2008–2014', title: '四万亿刺激', accent: '#c41e3a', desc: '全球金融危机触发史上最大规模逆周期基建：高铁网络从规划提前十年落地，城投平台与土地财政完成制度耦合。增长被保住，代价是地方隐性债务的总开关从此打开。' },
  { period: '2015–2019', title: '补短板 / 防风险', accent: '#e8a317', desc: '增速换挡后基建转向「补短板」叙事：中西部交通、农村水利、城市地下管网。同期 PPP 大起大落、专项债登场——融资纪律开始约束投资冲动，乘数递减首次被正面承认。' },
  { period: '2020–2022', title: '新基建定调', accent: '#10b981', desc: '5G、数据中心、特高压、充电桩被列为「新基建」七大领域，「东数西算」启动。基建的对象从物理空间切换到数据与算力——财政发力的通道换了赛道，逆周期逻辑未变。' },
  { period: '2023– ', title: '平急两用 / 存量运营时代', accent: '#22d3ee', desc: '增量空间收窄后转向三条出路：平急两用工程开辟新合规科目、城中村改造接续投资量、公募 REITs 把存量资产证券化回收资金。从「修出来」到「转起来」，基建进入运营本位。' },
  { period: '2026– ', title: '十五五 · 算力基建切换', accent: '#c41e3a', desc: '规划纲要明确智算中心、特高压、新型储能与低空数字航路为新一轮发力通道。专项债额度维持高位，但投向从「铁公机」进一步向算力主权与能源压舱石倾斜。' },
];

// ----------------------------------------------------------------------------
// Page
// ----------------------------------------------------------------------------
export default function Page() {
  const [sectorKey, setSectorKey] = useState('transport');
  const [stageIdx, setStageIdx] = useState(4);

  const sector = useMemo(() => SECTORS.find((s) => s.key === sectorKey) ?? SECTORS[0], [sectorKey]);

  const sectorTrendOpt = useMemo(() => ({
    tooltip: { trigger: 'axis' },
    grid: { ...GRID, top: 20 },
    xAxis: categoryX(['2020', '2021', '2022', '2023', '2024']),
    yAxis: valueY({ name: '万亿元', nameTextStyle: { color: '#93a1b5', fontSize: 10 } }),
    series: [{
      type: 'bar', barWidth: 24,
      data: sector.trend,
      itemStyle: { color: sector.accent, borderRadius: 3 },
      label: { show: true, position: 'top', color: '#93a1b5', fontSize: 10 },
    }],
  }), [sector]);

  return (
    <div>
      <PageHeader badge="Infrastructure · 现代化基建" title="新老基建 · 投资与回报" subtitle="专项债 · 逆周期 · 回报机制 —— 从铁公机到算力底座，从增量建设到存量运营的财政发力通道" />

      <IntroCard>现实主义逻辑下，基建不只是交通工具，更是中枢对国土空间实施「物理级对齐」的工具——「Infrastructure as the hard operating system of a continental economy」。它同时是逆周期工具箱的核心抓手：每一轮增长失速，财政都通过这条通道向实体注入需求。但三十年高强度建设之后，乘数效应递减与债务约束构成双重天花板——投资的回报机制正从直接收费转向时空压缩带来的交易成本下降，发力对象正从物理联通切换到算力与数据联通，资产逻辑正从「修出来」转向「转起来」。</IntroCard>

      <StatGrid className="mb-6">
        <Stat value="~24 万亿" label="年基建投资 (2025 · 广义示意)" accent="#c41e3a" />
        <Stat value="4.0 万亿" label="专项债新增额度 (2026 预算 · 示意)" accent="#e8a317" />
        <Stat value="~2,100 亿" label="公募 REITs 累计发行 (2025 · 示意)" accent="#22d3ee" />
        <Stat value="19.5 万km" label="高速公路里程 · 全球第一" accent="#10b981" />
      </StatGrid>

      <Grid cols={3} className="mb-6">
        {[['十五五新基建', '算力/储能/低空数字航路写入规划纲要 · 东数西算节点扩容', '#22d3ee'],
          ['能源压舱石', '特高压外送 + 新型储能装机突破 100GW 量级 (示意)', '#e8a317'],
          ['平急两用', '2026 预算靠前发力 · 城中村改造与 REITs 盘活存量并行', '#10b981']].map(([t, d, c]) => (
          <div key={t} className="os-card p-4" style={{ borderLeft: `3px solid ${c}` }}>
            <div className="text-xs font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>{t}</div>
            <p className="text-[11px] leading-relaxed" style={{ color: 'var(--text-tertiary)' }}>{d}</p>
          </div>
        ))}
      </Grid>

      {/* ------------------------------------------------------------ */}
      <Card title="01 板块透视 · 六大基建战场（点选切换）" className="mb-6">
        <SelectorBar items={SECTORS} activeKey={sectorKey} onSelect={setSectorKey} />
        <Grid cols={2}>
          <div>
            <div className="grid grid-cols-3 gap-3 mb-4">
              <div className="p-3 rounded" style={{ background: 'var(--bg-elevated)', border: `1px solid ${sector.accent}40` }}>
                <div className="text-[10px] mono uppercase" style={{ color: 'var(--text-tertiary)' }}>年投资规模</div>
                <div className="text-base font-bold mono mt-1" style={{ color: sector.accent }}>{sector.scale}</div>
              </div>
              <div className="p-3 rounded" style={{ background: 'var(--bg-elevated)', border: `1px solid ${sector.accent}40` }}>
                <div className="text-[10px] mono uppercase" style={{ color: 'var(--text-tertiary)' }}>近年增速</div>
                <div className="flex items-center justify-between gap-2 mt-1">
                  <div className="text-base font-bold mono" style={{ color: sector.accent }}>{sector.growth}</div>
                  <OsSparkline points={sector.trend} color={sector.accent} width={72} height={22} fill />
                </div>
              </div>
              <div className="p-3 rounded" style={{ background: 'var(--bg-elevated)', border: `1px solid ${sector.accent}40` }}>
                <div className="text-[10px] mono uppercase" style={{ color: 'var(--text-tertiary)' }}>饱和度</div>
                <div className="text-sm font-bold mt-1" style={{ color: sector.accent }}>{sector.saturation}</div>
              </div>
            </div>
            <div className="text-xs mb-1 font-semibold" style={{ color: 'var(--china-red)' }}>资金来源</div>
            <p className="text-xs leading-relaxed mb-3" style={{ color: 'var(--text-secondary)' }}>{sector.funding}</p>
            <div className="text-xs mb-1 font-semibold" style={{ color: 'var(--fire-gold)' }}>结构性痛点</div>
            <p className="text-xs leading-relaxed mb-3" style={{ color: 'var(--text-secondary)' }}>{sector.pain}</p>
            <p className="text-[11px] italic leading-relaxed" style={{ color: 'var(--text-tertiary)' }}>{sector.note}</p>
          </div>
          <div>
            <div className="text-xs mb-2 mono" style={{ color: 'var(--text-tertiary)' }}>// {sector.label} · 年投资额走势（万亿元，示意）</div>
            <EChart option={sectorTrendOpt} style={{ height: 240 }} />
          </div>
        </Grid>
      </Card>

      {/* ------------------------------------------------------------ */}
      <Grid cols={2} className="mb-6">
        <Card title="02 新老基建结构演进 · 投资占比（%，示意）">
          <EChart option={structOpt} style={{ height: 240 }} />
          <p className="text-[11px] mt-3 italic" style={{ color: 'var(--text-tertiary)' }}>从铁公机到算力底座：传统基建占比十五年下行约 24 个百分点。切换不是退场——而是财政发力的通道换了物理介质。</p>
        </Card>
        <Card title="03 逆周期之锚 · 基建增速 vs GDP 增速（%）">
          <EChart option={cycleOpt} style={{ height: 240 }} />
          <p className="text-[11px] mt-3 italic" style={{ color: 'var(--text-tertiary)' }}>三次明显的剪刀差（2008/2014/2022）对应三轮稳增长：每当 GDP 失速，基建增速便被拉起对冲——这是中国宏观调控最古老的肌肉记忆。</p>
        </Card>
      </Grid>

      {/* ------------------------------------------------------------ */}
      <Grid cols={2} className="mb-6">
        <Card title="04 资金来源结构 · 谁在为基建买单（示意 %）">
          <EChart option={fundingDonut} style={{ height: 250 }} />
          <p className="text-[11px] mt-2 italic" style={{ color: 'var(--text-tertiary)' }}>专项债已成主力渠道——「项目收益自平衡」的纪律设计，与大量基建的公益属性之间存在天然张力；土地出让收入下行后，平衡表的缺口由政策性金融补位。</p>
        </Card>
        <Card title="05 存量资产盘活 · 公募 REITs 发行结构（亿元，示意）">
          <EChart option={reitsOpt} style={{ height: 250 }} />
          <p className="text-[11px] mt-2 italic" style={{ color: 'var(--text-tertiary)' }}>从增量建设到存量运营的转身：REITs 把沉淀在高速公路与园区里的资本重新抽出，注入下一轮项目——基建的「资产负债表循环」开始闭环。</p>
        </Card>
      </Grid>

      {/* ------------------------------------------------------------ */}
      <Grid cols={2} className="mb-6">
        <Card title="06 基建饱和度国际对比 · 人均基建存量指数（美国=100，示意）">
          <EChart option={intlOpt} style={{ height: 220 }} />
          <p className="text-[11px] mt-3 italic" style={{ color: 'var(--text-tertiary)' }}>总量全球第一，人均仍不足美国一半——「修不动了」与「还没修够」同时为真：东部干线饱和、中西部与地下管网仍是洼地。问题不是空间，是回报。</p>
        </Card>
        <Card title="07 边际效益递减 · 基建投资乘数演变（示意）">
          <EChart option={multiplierOpt} style={{ height: 220 }} />
          <p className="text-[11px] mt-3 italic" style={{ color: 'var(--text-tertiary)' }}>每一元基建投资撬动的 GDP 持续走低，正逼近投入产出临界线。当乘数跌破 1，「基建拉动增长」从经济命题退化为债务命题——这是「修不动了」的真问题。</p>
        </Card>
      </Grid>

      {/* ------------------------------------------------------------ */}
      <Card title="08 基建演进时间线 · 从大会战到运营时代" className="mb-6">
        <TimelineBar stages={STAGES} activeIdx={stageIdx} onSelect={setStageIdx} />
      </Card>

      {/* ------------------------------------------------------------ */}
      <Grid cols={2} className="mb-6">
        <Card title="09 轨道重构 · 大一统物理学的时空压缩">
          <p className="text-sm leading-relaxed mb-3" style={{ color: 'var(--text-secondary)' }}>通过「八纵八横」主通道建设，中国实现了从「省域经济」向「城市群一体化」的逻辑跨越。时空的压缩降低了行政与经济的交易成本，确立了超大规模市场在物理层面的「高粘性流转」。</p>
          <EChart option={railRadar} style={{ height: 230 }} />
        </Card>
        <Card title="10 全球枢纽效能对比（效率综合指数）">
          <EChart option={hubBar} style={{ height: 200 }} />
          <div className="mt-3 space-y-1.5">
            <div className="flex justify-between text-xs"><span style={{ color: 'var(--text-tertiary)' }}>洋山四期自动化率</span><span className="font-bold mono" style={{ color: '#10b981' }}>100.0%</span></div>
            <div className="flex justify-between text-xs"><span style={{ color: 'var(--text-tertiary)' }}>中欧班列年开行量</span><span className="font-bold mono" style={{ color: '#e8a317' }}>1.7 万列</span></div>
          </div>
          <p className="text-[11px] mt-3 italic" style={{ color: 'var(--text-tertiary)' }}>智慧港口与铁海联运正成为中国掌控全球价值链流向的物理关口。</p>
        </Card>
      </Grid>

      {/* ------------------------------------------------------------ */}
      <Grid cols={2} className="mb-6">
        <Card title="11 低空经济应用场景与市场潜力矩阵"><EChart option={lowAltTreemap} style={{ height: 280 }} /></Card>
        <Card title="低空经济 · 万亿级「向上」空间">
          <p className="text-sm leading-relaxed mb-4" style={{ color: 'var(--text-secondary)' }}>低空经济（3000 米以下）被定义为新质生产力的重要支柱。中国在 eVTOL（电动垂直起降飞行器）与工业无人机领域已占据先发优势——谁定义了低空空域的规则与航路，谁就掌握了未来的三维交通主权。通过「数字航路」建设，中国正尝试在城市上空构建一套平行的无人化高效物流网。</p>
          <Grid cols={2}>
            <div className="p-3 rounded" style={{ background: 'rgba(196,30,58,0.08)', border: '1px solid rgba(196,30,58,0.2)' }}>
              <div className="text-base font-bold mono" style={{ color: '#e8a317' }}>EH216-S</div>
              <div className="text-[11px] mt-1" style={{ color: 'var(--text-tertiary)' }}>全球首张无人驾驶适航证</div>
            </div>
            <div className="p-3 rounded" style={{ background: 'rgba(196,30,58,0.08)', border: '1px solid rgba(196,30,58,0.2)' }}>
              <div className="text-base font-bold mono" style={{ color: '#e8a317' }}>200 万+</div>
              <div className="text-[11px] mt-1" style={{ color: 'var(--text-tertiary)' }}>全国无人机持有量</div>
            </div>
          </Grid>
        </Card>
      </Grid>

      {/* ------------------------------------------------------------ */}
      <Card title="投资与回报的制度逻辑" className="mb-6">
        <Grid cols={3}>
          {[['专项债 · 项目收益自平衡', '新基建以专项债与政策性金融为主渠道，要求项目现金流覆盖本息；回报从「土地溢价」转向「运营收益 + 网络外部性」。'],
            ['逆周期 · 托底与挤出之辩', '基建投资是逆周期工具箱的核心抓手；边际回报递减下，重心从「铁公基」增量转向存量提效与数字化改造。'],
            ['回报机制 · 时空压缩红利', '高铁与枢纽的真实回报体现在交易成本下降、要素流转加速与城市群一体化，难以被单一项目报表完全捕捉。']].map(([t, d]) => (
            <div key={t}><div className="text-sm font-semibold" style={{ color: 'var(--china-red)' }}>{t}</div><p className="text-xs mt-1 leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{d}</p></div>
          ))}
        </Grid>
      </Card>

      <Card title="12 调研结论 · 构建全域流转体系" className="mb-6">
        <p className="text-sm leading-relaxed mb-4" style={{ color: 'var(--text-secondary)' }}>现代化基建不仅是钢筋水泥的堆砌，它是国家权力的物理延伸。随着低空空域的开放与数字化，中国正构建一个涵盖「地、海、空、天」的全域流转网络。这一网络的最终目的是实现生产要素的「零摩擦移动」，为超大规模文明体提供支撑其长周期运行的物理底座。但底座的扩建已逼近回报临界线：下一个十年的主命题不是修更多的路，而是让已修的路、已铺的网、已建的算力中心在资产负债表上「转得起来」。</p>
        <div className="flex flex-wrap gap-4 text-[10px] mono uppercase" style={{ color: 'var(--text-tertiary)' }}>
          <span>// INFRA_NETWORK: CONNECTED</span>
          <span>// MULTIPLIER: DECAYING</span>
          <span>// ASSET_CYCLE: REITS_ENABLED</span>
          <span>// LOW_ALTITUDE_AIRSPACE: REFORMING</span>
          <span>// STATUS: OPTIMIZING_STOCK</span>
        </div>
      </Card>

      <FrameworkTrio cards={[
        { key: 'salt', title: '逆周期之锚', subtitle: '财政发力 · 传统通道', body: '基建 = 财政发力的传统通道：每轮增长失速，专项债与政策性金融便经由这条管道向实体注入需求——高铁/港口/电网本质是跨周期投资工具。' },
        { key: 'stone', title: '乘数衰减', subtitle: '边际递减 · 债务约束', body: '边际效益递减与债务约束构成双重天花板：乘数逼近 1 之后，「基建拉动增长」退化为债务命题——出路是 REITs 盘活存量与运营本位转型。' },
        { key: 'path', title: '新基建切换', subtitle: '物理联通 → 算力联通', body: '从物理联通到算力数据联通：5G/数据中心/充电桩/低空数字航路成为新一代物理锚点，「东数西算」按电价与气候重排国土上的计算版图。' },
      ]} />
      <ModuleFooter moduleId="infrastructure" disclaimer="本页投资规模/增速/乘数/REITs 等数值均为公开资料整理后的示意值，非官方统计 · 仅供分析框架参考，非投资建议" />
    </div>
  );
}
