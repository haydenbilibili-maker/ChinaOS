import React, { useState, useMemo } from 'react';
import { PageHeader, Card, Grid, Stat } from '../../app/ui.jsx';
import EChart from '../../lib/viz/EChart.jsx';
import ChinaMap from '../../lib/viz/ChinaMap.jsx';
import { categoryX, valueY, GRID, donutOpt, stackedBarOpt } from '../shared/chartHelpers.js';
import { IntroCard, SelectorBar, TimelineBar, FrameworkTrio, ModuleFooter } from '../shared/ModuleParadigm.jsx';

const GRAIN = [
  { name: '黑龙江省', value: 7700 }, { name: '河南省', value: 6600 }, { name: '山东省', value: 5700 },
  { name: '安徽省', value: 4100 }, { name: '吉林省', value: 4000 }, { name: '内蒙古自治区', value: 3900 },
  { name: '河北省', value: 3800 }, { name: '江苏省', value: 3700 }, { name: '四川省', value: 3500 },
  { name: '湖南省', value: 2900 }, { name: '湖北省', value: 2700 }, { name: '辽宁省', value: 2500 },
  { name: '江西省', value: 2200 }, { name: '云南省', value: 1900 }, { name: '广西壮族自治区', value: 1400 },
];

// 粮食「调出 / 调入 / 平衡」格局：示意值，正为净调出，负为净调入
const FLOW = [
  { name: '黑龙江省', value: 90 }, { name: '吉林省', value: 80 }, { name: '内蒙古自治区', value: 70 },
  { name: '河南省', value: 55 }, { name: '安徽省', value: 40 }, { name: '江西省', value: 25 },
  { name: '辽宁省', value: 10 }, { name: '河北省', value: 5 }, { name: '山东省', value: 0 },
  { name: '湖北省', value: -10 }, { name: '湖南省', value: -5 }, { name: '四川省', value: -15 },
  { name: '江苏省', value: -10 }, { name: '广东省', value: -90 }, { name: '浙江省', value: -85 },
  { name: '福建省', value: -75 }, { name: '上海市', value: -80 }, { name: '北京市', value: -78 },
  { name: '天津市', value: -60 }, { name: '广西壮族自治区', value: -20 }, { name: '云南省', value: -25 },
];

const CROPS = [
  {
    key: 'staple', label: '口粮(稻麦)', accent: '#10b981', selfRate: 100, dep: 2,
    position: '绝对自给 · 红线',
    desc: '稻谷与小麦自给率维持 100% 左右，库存消费比远超 17%–18% 的国际安全线，端牢「中国饭碗」——大安全观第一支柱、不可退让的政治底线。',
    choke: '高端种质资源、节水稻品种局部仍需引进；丰年仍须防「丰收返贫」与种粮意愿下滑。',
    self: [99, 100, 101, 100, 101, 100],
  },
  {
    key: 'corn', label: '玉米', accent: '#22d3ee', selfRate: 92, dep: 8,
    position: '基本自给 · 适度进口',
    desc: '玉米自给率较高但饲用与深加工需求增长快，进口补充与生物燃料「与人争粮、与粮争地」构成边际压力，价格随生猪存栏剧烈波动。',
    choke: '高产抗逆品种、转基因玉米产业化进度；进口配额内外价差与乌克兰、美洲到港节奏。',
    self: [94, 93, 92, 92, 91, 92],
  },
  {
    key: 'soybean', label: '大豆', accent: '#e8a317', selfRate: 15, dep: 85,
    position: '高度依赖 · 战略软肋',
    desc: '大豆进口依存约 85%，年进口逾 1 亿吨,来源集中于巴西、美国、阿根廷,是饲料粮与食用油的结构性短板,亦是中美博弈与海运通道风险的最大敞口。',
    choke: '亩产仅为美洲一半,单产与压榨效率受制;南美雨季、巴拿马运河与马六甲海峡通道风险叠加。',
    self: [16, 15, 14, 15, 15, 15],
  },
  {
    key: 'oil', label: '食用油', accent: '#fb923c', selfRate: 32, dep: 68,
    position: '依赖进口 · 油瓶风险',
    desc: '食用植物油自给率约三成,棕榈油几乎全部进口、菜油豆油原料高度依赖大豆与油菜籽进口,「油瓶子」安全跟随「大豆软肋」共振。',
    choke: '油料作物与粮争地,扩种油菜、花生空间有限;棕榈油来源高度集中于印尼、马来。',
    self: [33, 32, 31, 32, 32, 32],
  },
  {
    key: 'meat', label: '肉类', accent: '#c41e3a', selfRate: 95, dep: 5,
    position: '基本自给 · 饲料拉动',
    desc: '猪牛羊禽肉总体基本自给,但「肉的自给」建立在「豆粕进口」之上——肉类安全本质上是被大豆进口托底的派生安全,牛肉进口依存上升较快。',
    choke: '饲料蛋白（豆粕）对外依存传导;种猪、白羽肉鸡祖代种源曾长期依赖进口。',
    self: [96, 95, 94, 95, 95, 95],
  },
  {
    key: 'seed', label: '种业', accent: '#8b5cf6', selfRate: 70, dep: 30,
    position: '攻坚卡脖子 · 农业芯片',
    desc: '「种子是农业的芯片」。口粮种源自主可控,但部分蔬菜、白羽肉鸡、生猪、玉米大豆高端品种与育种工具仍受制于人,种业振兴是藏粮于技的核心战场。',
    choke: '生物育种基础专利、高通量表型与基因编辑工具;部分高端蔬菜种子进口占比仍高。',
    self: [66, 67, 68, 69, 70, 71],
  },
];

// 各品种自给率横向对比（按依赖度排序，凸显大豆/食用油软肋）
const SELF_BARS = [
  { key: 'staple', label: '口粮', rate: 100 }, { key: 'meat', label: '肉类', rate: 95 },
  { key: 'corn', label: '玉米', rate: 92 }, { key: 'seed', label: '种业', rate: 70 },
  { key: 'oil', label: '食用油', rate: 32 }, { key: 'soybean', label: '大豆', rate: 15 },
];

const STAGES = [
  { period: '1949–1978', title: '以粮为纲', accent: '#64748b', desc: '统购统销 + 集体化,在低生产力下以行政手段保口粮、压消费,饥荒记忆塑造了「手中有粮、心中不慌」的国家本能。' },
  { period: '1978–2004', title: '市场化改革', accent: '#22d3ee', desc: '家庭联产承包释放产能,粮食流通逐步市场化,购销价格双轨并轨,温饱问题总体解决,告别票证时代。' },
  { period: '2004–2013', title: '谷物基本自给 · 口粮绝对安全', accent: '#10b981', desc: '取消农业税 + 粮食直补 + 最低收购价,确立「谷物基本自给、口粮绝对安全」新粮食安全观,产量「十二连增」。' },
  { period: '2013–2020', title: '藏粮于地 · 藏粮于技', accent: '#e8a317', desc: '划定 18 亿亩耕地红线与永久基本农田,高标准农田与黑土地保护立法,从「保产量」转向「保产能」。' },
  { period: '2021–', title: '种业振兴 · 大食物观', accent: '#8b5cf6', desc: '《种子法》修订 + 生物育种产业化破冰,提出「大食物观」向森林海洋设施要食物,把饭碗主权升级为大安全观支柱。' },
];

export default function Page() {
  const [crop, setCrop] = useState('staple');
  const [stage, setStage] = useState(4);
  const [mapView, setMapView] = useState('grain');
  const c = CROPS.find((x) => x.key === crop) || CROPS[0];

  // 自给率走势（随品类切换）
  const selfSufficiency = useMemo(() => ({
    grid: GRID,
    xAxis: categoryX(['2019', '2020', '2021', '2022', '2023', '2024']),
    yAxis: valueY({ min: 0, max: 105 }),
    series: [{ type: 'line', smooth: true, symbol: 'circle', symbolSize: 6,
      data: c.self,
      lineStyle: { color: c.accent, width: 2 }, itemStyle: { color: c.accent },
      areaStyle: { color: `${c.accent}18` },
      markLine: { silent: true, symbol: 'none', label: { formatter: '安全线 95%', color: '#64748b', fontSize: 10 },
        lineStyle: { color: '#64748b', type: 'dashed' }, data: [{ yAxis: 95 }] } }],
  }), [c]);

  // 各品种自给率横向对比 bar
  const selfBars = useMemo(() => ({
    grid: { left: 64, right: 36, top: 12, bottom: 24 },
    xAxis: valueY({ max: 105 }),
    yAxis: categoryX(SELF_BARS.map((x) => x.label)),
    series: [{ type: 'bar', barWidth: 16, data: SELF_BARS.map((x) => ({
      value: x.rate,
      itemStyle: { color: x.rate >= 90 ? '#10b981' : x.rate >= 50 ? '#e8a317' : '#c41e3a', borderRadius: 3 },
    })), label: { show: true, position: 'right', formatter: '{c}%', color: '#93a1b5', fontSize: 11 },
      markLine: { silent: true, symbol: 'none', label: { formatter: '95%', color: '#64748b', fontSize: 10 },
        lineStyle: { color: '#64748b', type: 'dashed' }, data: [{ xAxis: 95 }] } }],
  }), []);

  // 进口依存度（随品类切换）小环
  const depDonut = useMemo(() => donutOpt(
    [{ name: '国产自给', value: c.selfRate }, { name: '进口依存', value: Math.max(0, 100 - c.selfRate) }],
    { center: ['50%', '50%'] },
  ), [c]);

  // 大豆进口来源多元化 donut
  const soybeanSource = useMemo(() => donutOpt(
    [
      { name: '巴西 48%', value: 48 }, { name: '美国 30%', value: 30 },
      { name: '阿根廷 10%', value: 10 }, { name: '其他 12%', value: 12 },
    ],
    { center: ['50%', '50%'] },
  ), []);

  // 粮食安全多维雷达（随品类对比「当前品类 vs 总盘子」）
  const radar = useMemo(() => {
    const inds = [
      { name: '产量产能', max: 100 }, { name: '耕地保障', max: 100 }, { name: '种子自主', max: 100 },
      { name: '水利灌溉', max: 100 }, { name: '储备调节', max: 100 }, { name: '进口多元', max: 100 },
    ];
    const overall = [92, 85, 78, 80, 90, 60];
    const byCrop = {
      staple: [98, 90, 88, 85, 95, 70], corn: [88, 82, 70, 78, 80, 55],
      soybean: [40, 50, 55, 60, 65, 45], oil: [45, 48, 52, 58, 60, 40],
      meat: [85, 70, 60, 72, 75, 50], seed: [70, 75, 60, 70, 70, 58],
    };
    const ringColor = 'rgba(148,163,184,0.25)';
    return {
      legend: { data: ['粮食总盘子', c.label], textStyle: { color: '#93a1b5', fontSize: 10 }, top: 0, itemWidth: 12 },
      radar: {
        indicator: inds, axisName: { color: '#93a1b5', fontSize: 10 },
        splitLine: { lineStyle: { color: ringColor } }, axisLine: { lineStyle: { color: ringColor } },
        splitArea: { show: false }, center: ['50%', '54%'], radius: '62%',
      },
      series: [{
        type: 'radar',
        data: [
          { value: overall, name: '粮食总盘子', lineStyle: { color: '#22d3ee', width: 2 }, itemStyle: { color: '#22d3ee' }, areaStyle: { color: 'rgba(34,211,238,0.10)' } },
          { value: byCrop[crop] || overall, name: c.label, lineStyle: { color: c.accent, width: 2 }, itemStyle: { color: c.accent }, areaStyle: { color: `${c.accent}1f` } },
        ],
      }],
    };
  }, [crop, c]);

  // 耕地红线 + 粮食总产趋势（双轴）
  const acreageYield = useMemo(() => ({
    grid: { ...GRID, right: 56 },
    legend: { data: ['粮食总产(亿吨)', '耕地面积(亿亩)'], textStyle: { color: '#93a1b5' }, top: 0 },
    xAxis: categoryX(['2015', '2017', '2019', '2021', '2023', '2024']),
    yAxis: [
      { type: 'value', name: '总产/亿吨', min: 6, max: 7, position: 'left',
        axisLabel: { color: '#93a1b5' }, splitLine: { lineStyle: { color: 'rgba(148,163,184,0.12)' } },
        nameTextStyle: { color: '#64748b' } },
      { type: 'value', name: '耕地/亿亩', min: 18, max: 20, position: 'right',
        axisLabel: { color: '#93a1b5' }, splitLine: { show: false }, nameTextStyle: { color: '#64748b' } },
    ],
    series: [
      { name: '粮食总产(亿吨)', type: 'bar', yAxisIndex: 0, barWidth: 22,
        data: [6.21, 6.18, 6.64, 6.83, 6.95, 7.06],
        itemStyle: { color: '#10b981', borderRadius: [3, 3, 0, 0] } },
      { name: '耕地面积(亿亩)', type: 'line', yAxisIndex: 1, smooth: true, symbol: 'circle', symbolSize: 6,
        data: [20.25, 20.23, 19.18, 19.14, 19.14, 19.13],
        lineStyle: { color: '#c41e3a', width: 2 }, itemStyle: { color: '#c41e3a' },
        markLine: { silent: true, symbol: 'none', label: { formatter: '18 亿亩红线', color: '#c41e3a', fontSize: 10 },
          lineStyle: { color: '#c41e3a', type: 'dashed' }, data: [{ yAxis: 18 }] } },
    ],
  }), []);

  // 进口依存品类堆叠（国产 vs 进口）
  const importStack = useMemo(() => stackedBarOpt({
    categories: ['口粮', '玉米', '肉类', '种业', '食用油', '大豆'],
    series: [
      { name: '国产自给', data: [100, 92, 95, 70, 32, 15], itemStyle: { color: '#10b981' } },
      { name: '进口依存', data: [0, 8, 5, 30, 68, 85], itemStyle: { color: '#c41e3a' } },
    ],
  }), []);

  const mapMetrics = mapView === 'grain'
    ? [{ key: 'grain', label: '粮食产量', valueName: '粮食产量(万吨)', max: 8000, data: GRAIN }]
    : [{ key: 'flow', label: '调出/调入', valueName: '净调出指数(示意)', max: 100, data: FLOW }];

  return (
    <div>
      <PageHeader badge="Food Security · 大安全观" title="大国粮仓 · 粮食安全主权" subtitle="藏粮于地 · 藏粮于技 · 耕地红线 · 大食物观 · 种业振兴" />
      <IntroCard>粮食安全呈现<strong style={{ color: 'var(--text-primary)' }}>「口粮绝对安全、饲料粮结构性依赖」</strong>的双重现实:18 亿亩耕地红线是物理底线,口粮库存消费比远超国际安全线;而大豆进口依存约 <strong style={{ color: 'var(--text-primary)' }}>85%</strong>、食用油约 68%,构成地缘风险敞口。安全不是产量数字,而是<strong style={{ color: 'var(--text-primary)' }}>「极端断供下饭碗端在谁手里」</strong>的权力物理。</IntroCard>

      <Grid cols={4} className="mb-6">
        <Stat value="7.06 亿吨" label="粮食总产(2024 示意)" accent="#10b981" />
        <Stat value="95%+" label="谷物自给率" accent="#22d3ee" />
        <Stat value="85%" label="大豆进口依存" accent="#e8a317" />
        <Stat value="19.13 亿亩" label="耕地面积 · 守住红线" accent="#c41e3a" />
      </Grid>

      <Card title="交互 · 粮食品类选择器（口粮 / 玉米 / 大豆 / 食用油 / 肉类 / 种业）" className="mb-6">
        <SelectorBar items={CROPS} activeKey={crop} onSelect={setCrop} />
        <div className="os-card p-4 mb-4" style={{ background: 'var(--bg-elevated)', borderLeft: `3px solid ${c.accent}` }}>
          <div className="flex items-center gap-3 mb-2">
            <span className="text-sm font-semibold" style={{ color: c.accent }}>{c.label}</span>
            <span className="text-xs px-2 py-0.5 rounded" style={{ background: `${c.accent}1a`, color: c.accent }}>战略定位 · {c.position}</span>
          </div>
          <p className="text-sm leading-relaxed mb-2" style={{ color: 'var(--text-secondary)' }}>{c.desc}</p>
          <p className="text-xs leading-relaxed" style={{ color: 'var(--text-muted)' }}><strong style={{ color: '#fb923c' }}>卡脖子点:</strong> {c.choke}</p>
        </div>
        <Grid cols={3} className="mb-4">
          <Stat value={`${c.selfRate}%`} label={`${c.label} · 自给率`} accent={c.accent} />
          <Stat value={`${c.dep}%`} label="进口依存(示意)" accent="#e8a317" />
          <Stat value={c.position.split(' · ')[0]} label="安全定位" accent="#8b5cf6" />
        </Grid>
        <Grid cols={2}>
          <Card title="自给率走势（随品类切换 · 95% 安全线）"><EChart option={selfSufficiency} style={{ height: 240 }} /></Card>
          <Card title="国产 vs 进口依存（随品类切换）"><EChart option={depDonut} style={{ height: 240 }} /></Card>
        </Grid>
      </Card>

      <Grid cols={2} className="mb-6">
        <Card title="各品种自给率横向对比（绿=安全 / 黄=承压 / 红=软肋）">
          <EChart option={selfBars} style={{ height: 260 }} />
        </Card>
        <Card title="国产 vs 进口依存 · 品类堆叠">
          <EChart option={importStack} style={{ height: 260 }} />
        </Card>
      </Grid>

      <Grid cols={2} className="mb-6">
        <Card title="粮食安全多维雷达（总盘子 vs 当前品类）">
          <EChart option={radar} style={{ height: 280 }} />
        </Card>
        <Card title="耕地红线与粮食总产（双轴 · 18 亿亩硬约束）">
          <EChart option={acreageYield} style={{ height: 280 }} />
        </Card>
      </Grid>

      <Card title="区域格局 · 粮食主产区与调出调入版图" className="mb-6">
        <SelectorBar
          items={[
            { key: 'grain', label: '主产区产量', accent: '#10b981' },
            { key: 'flow', label: '调出/调入格局', accent: '#22d3ee' },
          ]}
          activeKey={mapView}
          onSelect={setMapView}
        />
        <div className="os-card p-4 mb-4" style={{ background: 'var(--bg-elevated)', borderLeft: '3px solid #10b981' }}>
          <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
            {mapView === 'grain'
              ? '产量高度集中:黑龙江、河南、山东、安徽、吉林五省贡献全国近半产量,「北粮南运」格局固化——粮食安全的空间结构本身就是一种战略纵深。'
              : '净调出省仅余东北、内蒙古、河南、安徽等少数;粤、浙、闽、沪、京、津高度净调入。主销区粮食自给率持续下滑,「产销平衡区」逐步退化为「调入区」,空间脆弱性上升。'}
          </p>
        </div>
        <ChinaMap metrics={mapMetrics} style={{ height: 460 }} />
      </Card>

      <Card title="粮食战略演进 · 从「以粮为纲」到「种业振兴」" className="mb-6">
        <TimelineBar stages={STAGES} activeIdx={stage} onSelect={setStage} />
      </Card>

      <FrameworkTrio cards={[
        {
          title: '饭碗端在自己手里', subtitle: '口粮绝对安全底线',
          body: '谷物基本自给、口粮绝对安全是不可退让的政治底线;库存消费比远超国际安全线,极端断供下口粮可自主闭环。',
          pillars: [['100% 自给', '稻麦闭环。'], ['18 亿亩红线', '物理约束。'], ['托市收储', '种粮意愿。']],
        },
        {
          title: '结构性软肋', subtitle: '大豆 · 油料对外依存',
          body: '大豆 85%、食用油 68% 依赖进口,且来源集中、通道暴露;肉类自给建立在豆粕进口之上,是被托底的派生安全。',
          pillars: [['大豆 85%', '最大敞口。'], ['通道风险', '海运 / 海峡。'], ['来源集中', '巴美阿三国。']],
        },
        {
          title: '藏粮于技', subtitle: '种业 · 高标准农田 · 科技',
          body: '把产能锁进土地与技术:种业振兴破解农业芯片,高标准农田提升旱涝保收,智慧农业与大食物观拓展供给边界。',
          pillars: [['种业振兴', '生物育种。'], ['高标准农田', '旱涝保收。'], ['大食物观', '森林海洋。']],
        },
      ]} />

      <ModuleFooter moduleId="foodSecurity" disclaimer="本模块数据为示意值,用于结构与趋势演示,不代表精确统计口径。" sourceNote="由 tabs/foodSecurity.html 迁移升级" />
    </div>
  );
}
