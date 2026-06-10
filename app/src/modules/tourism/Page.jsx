import React, { useState, useMemo } from 'react';
import { PageHeader, Card, Grid, Stat } from '../../app/ui.jsx';
import EChart from '../../lib/viz/EChart.jsx';
import { categoryX, valueY, logY, GRID, donutOpt, radarOpt, stackedBarOpt } from '../shared/chartHelpers.js';
import { IntroCard, SelectorBar, TimelineBar, FrameworkTrio, ModuleFooter } from '../shared/ModuleParadigm.jsx';

// ============================================================================
// 一、业态选择器 · 六大热点业态（规模/爆点/增长逻辑/瓶颈，示意值）
// ============================================================================
const SECTORS = [
  {
    key: 'inbound', label: '入境游 · 免签红利', accent: '#e8a317',
    scale: '约 1.32 亿人次 (2024E 入出境合计口径示意)', growth: '+60%+ (同比示意)',
    cases: 'China Travel 视频流量现象 · 144 小时过境免签 · 上海/北京/成都口岸',
    logic: '免签是「用脚投票」的国家形象工程：签证摩擦每降一格，转化漏斗放大一截。外国博主第一视角内容成为零成本国家公关，覆盖西方媒体叙事的缝隙。',
    bottleneck: '支付（外卡绑定/现金兑换）、多语种服务、酒店涉外资质存量不足；流量集中在头部口岸城市，腹地分流机制缺位。',
    bars: { label: '入境外国人次（万 · 示意）', cats: ['2019', '2022', '2023', '2024E'], data: [3188, 230, 1378, 2694], color: '#e8a317' },
  },
  {
    key: 'county', label: '县域游 · 小城游', accent: '#22d3ee',
    scale: '县域旅游订单占比持续抬升（示意）', growth: '订单增速跑赢一二线 (示意)',
    cases: '天水麻辣烫 · 榕江村超 · 隰县小西天（黑神话联动）',
    logic: '高线城市贵且挤，价格敏感的年轻客群「向下淘金」：县城物价 + 短视频种草 = 高性价比情绪消费。本质是消费降级与体验升级的合流。',
    bottleneck: '交通末梢可达性、住宿供给弹性、服务标准化能力薄弱；单品爆红后承接力不足，复购与口碑极易透支。',
    bars: { label: '县域游热度指数（示意）', cats: ['2021', '2022', '2023', '2024'], data: [100, 118, 165, 230], color: '#22d3ee' },
  },
  {
    key: 'show', label: '演艺赛事经济', accent: '#c41e3a',
    scale: '营业性演出票房 500 亿+ 级（2023 示意）', growth: '大型演唱会场次翻倍级 (示意)',
    cases: '「跟着演出去旅行」· 太原/海口抢演唱会 · 村超/村 BA · 马拉松井喷',
    logic: '一张票根撬动「交通+住宿+餐饮」3–5 倍杠杆（示意），异地观演占比过半。地方政府把审批与安保能力当招商资源，演唱会成为城市间存量竞争的新战场。',
    bottleneck: '场馆供给与审批节奏、黄牛与票务治理、安全事故的政治成本；中小城市「办得起、接不住」。',
    bars: { label: '演出市场规模（亿元 · 示意）', cats: ['2019', '2021', '2023', '2024E'], data: [200, 140, 502, 580], color: '#c41e3a' },
  },
  {
    key: 'ice', label: '冰雪经济', accent: '#60a5fa',
    scale: '冰雪休闲旅游人次 4 亿+ 级（季 · 示意）', growth: '哈尔滨冰雪季客流峰值创纪录',
    cases: '哈尔滨冰雪大世界 · 「南方小土豆」叙事 · 亚冬会 · 新疆阿勒泰滑雪',
    logic: '冬奥遗产 + 政策目标（万亿级冰雪经济规划）+ 社交媒体宠粉叙事，把东北「资源诅咒」的冬天变成资产。雪场渗透率低 = 长坡厚雪的增量市场。',
    bottleneck: '季节性极强（一季养三季）、南方客群复购存疑、雪场重资产回收周期长；气候变暖是隐性长期风险。',
    bars: { label: '冰雪旅游人次（亿 · 季 · 示意）', cats: ['21/22', '22/23', '23/24', '24/25E'], data: [3.05, 3.12, 3.85, 4.3], color: '#60a5fa' },
  },
  {
    key: 'museum', label: '文博热', accent: '#10b981',
    scale: '博物馆年接待 12 亿+ 人次级（示意）', growth: '热门馆「一票难求」常态化',
    cases: '故宫/国博预约秒空 · 三星堆 · 马面裙国潮 · 簪花围 · 博物馆文创雪糕',
    logic: '文化自信叙事与年轻人身份消费共振：逛馆是低成本高格调的社交货币。文创二次消费把「门票免费」的事业单位逻辑改写为 IP 运营逻辑。',
    bottleneck: '预约黄牛、讲解供给不足、头部馆虹吸 vs 县级馆门可罗雀；IP 开发能力极度分化。',
    bars: { label: '博物馆接待人次（亿 · 示意）', cats: ['2019', '2021', '2023', '2024E'], data: [12.3, 7.5, 12.9, 14.0], color: '#10b981' },
  },
  {
    key: 'night', label: '夜间经济', accent: '#a78bfa',
    scale: '国家级夜间文旅消费集聚区 345 处（示意）', growth: '夜游订单占比持续上行 (示意)',
    cases: '长安十二时辰街区 · 大唐不夜城 · 夜游锦江 / 黄浦江 · 夜市烟火气叙事',
    logic: '白天的景区是存量，夜晚的城市是增量：延长停留 1 晚 = 客单价倍增。灯光秀与沉浸式街区是地方政府最容易出手的「显绩」型投资。',
    bottleneck: '同质化（人造古镇 + 灯光秀模板复制）、噪音扰民与安全治理成本、淡季空置；部分项目沦为债务驱动的形象工程。',
    bars: { label: '夜游消费指数（示意）', cats: ['2021', '2022', '2023', '2024'], data: [100, 96, 142, 168], color: '#a78bfa' },
  },
];

// ============================================================================
// 二、恢复曲线 · 人次 vs 收入（对 2019 基线，结构变化双线）
// ============================================================================
const recoveryDual = {
  grid: { left: 44, right: 16, top: 36, bottom: 24 },
  tooltip: { trigger: 'axis' },
  legend: { top: 0, textStyle: { color: '#93a1b5', fontSize: 10 }, itemWidth: 10, itemHeight: 10 },
  xAxis: categoryX(['2019', '2020', '2021', '2022', '2023', '2024E', '2025E']),
  yAxis: valueY({ name: '恢复度 %（2019=100）', nameTextStyle: { color: '#93a1b5', fontSize: 10 } }),
  series: [
    { name: '出游人次恢复度', type: 'line', smooth: true, symbol: 'circle', symbolSize: 6, data: [100, 39, 51, 36, 86, 98, 106], lineStyle: { color: '#e8a317', width: 3 }, itemStyle: { color: '#e8a317' }, areaStyle: { color: 'rgba(232,163,23,0.12)' } },
    { name: '旅游收入恢复度', type: 'line', smooth: true, symbol: 'circle', symbolSize: 6, data: [100, 35, 46, 32, 76, 91, 100], lineStyle: { color: '#c41e3a', width: 3 }, itemStyle: { color: '#c41e3a' } },
    { name: '人均花费恢复度', type: 'line', smooth: true, symbol: 'none', data: [100, 90, 90, 89, 88, 93, 94], lineStyle: { color: '#22d3ee', width: 2, type: 'dashed' }, itemStyle: { color: '#22d3ee' } },
  ],
};

// 原有人次绝对值曲线（保留）
const recoveryLine = {
  grid: { left: 40, right: 16, top: 20, bottom: 24 },
  tooltip: { trigger: 'axis' },
  xAxis: categoryX(['2019', '2020', '2021', '2022', '2023', '2024E']),
  yAxis: valueY({ name: '亿人次', nameTextStyle: { color: '#93a1b5', fontSize: 10 } }),
  series: [{ type: 'line', smooth: true, symbol: 'circle', symbolSize: 7, data: [60.1, 28.8, 32.5, 25.3, 48.9, 56.2], lineStyle: { color: '#e8a317', width: 3 }, itemStyle: { color: '#e8a317' }, areaStyle: { color: 'rgba(232,163,23,0.15)' } }],
};

// ============================================================================
// 三、入境游免签效应 · 免签国家数 + 入境人次 双轴
// ============================================================================
const visaFreeDual = {
  grid: { left: 48, right: 56, top: 36, bottom: 24 },
  tooltip: { trigger: 'axis' },
  legend: { top: 0, textStyle: { color: '#93a1b5', fontSize: 10 }, itemWidth: 10, itemHeight: 10 },
  xAxis: categoryX(['2023H1', '2023H2', '2024H1', '2024H2', '2025H1E', '2025H2E']),
  yAxis: [
    valueY({ name: '入境外国人（百万 · 示意）', nameTextStyle: { color: '#93a1b5', fontSize: 10 } }),
    { type: 'value', name: '免签国家数', nameTextStyle: { color: '#93a1b5', fontSize: 10 }, axisLabel: { color: '#93a1b5', fontSize: 10 }, splitLine: { show: false } },
  ],
  series: [
    { name: '入境外国人次', type: 'bar', barWidth: 18, data: [5.8, 8.0, 14.6, 12.3, 18.5, 20.0], itemStyle: { color: '#e8a317', borderRadius: 3 } },
    { name: '单方面免签 + 全面互免国家数', type: 'line', yAxisIndex: 1, smooth: true, symbol: 'circle', symbolSize: 7, data: [10, 18, 26, 38, 47, 54], lineStyle: { color: '#22d3ee', width: 3 }, itemStyle: { color: '#22d3ee' } },
  ],
};

const chinaTravelChips = [
  ['144h→240h 过境免签', '中转客流变深度游客流，口岸城市先吃红利', '#e8a317'],
  ['「City 不 City」热梗', '外国博主第一视角视频成为零成本国家公关', '#22d3ee'],
  ['外卡支付改造', '支付宝/微信外卡绑定打通，最大体验断点修补中', '#10b981'],
  ['离境退税即买即退', '把观光客流变购物客流，对冲奢侈品消费外流', '#c41e3a'],
];

// ============================================================================
// 四、消费分层 donut · 人均消费降级、总量升级
// ============================================================================
const tierDonut = donutOpt([
  { value: 12, name: '高端度假 / 出境替代', itemStyle: { color: '#e8a317' } },
  { value: 41, name: '大众观光 / 家庭游', itemStyle: { color: '#22d3ee' } },
  { value: 29, name: '穷游 / 特种兵式打卡', itemStyle: { color: '#c41e3a' } },
  { value: 18, name: '银发旅居 / 康养候鸟', itemStyle: { color: '#10b981' } },
]);

const ageDonut = donutOpt([
  { value: 35, name: 'Z 世代 (18–28)', itemStyle: { color: '#e8a317' } },
  { value: 25, name: '中青年 (29–35)', itemStyle: { color: '#22d3ee' } },
  { value: 22, name: '中年 (36–45)', itemStyle: { color: '#c41e3a' } },
  { value: 18, name: '银发 (55+)', itemStyle: { color: '#10b981' } },
]);

// ============================================================================
// 五、区域品牌爆款 · 流量持续性 + 案例卡（保留原数据并扩充）
// ============================================================================
const hotspotBar = {
  grid: { left: 44, right: 16, top: 36, bottom: 24 },
  tooltip: { trigger: 'axis' },
  legend: { top: 0, textStyle: { color: '#93a1b5', fontSize: 10 }, itemWidth: 10, itemHeight: 10 },
  xAxis: categoryX(['起势月', '爆发月', '峰值月', '回落月', '+6 个月']),
  yAxis: valueY({ name: '热度指数', nameTextStyle: { color: '#93a1b5', fontSize: 10 } }),
  series: [
    { name: '淄博烧烤', type: 'bar', data: [120, 480, 520, 310, 95], barWidth: 10, itemStyle: { color: '#e8a317', borderRadius: 3 } },
    { name: '哈尔滨冰雪', type: 'bar', data: [85, 620, 890, 450, 160], barWidth: 10, itemStyle: { color: '#22d3ee', borderRadius: 3 } },
    { name: '天水麻辣烫', type: 'bar', data: [40, 65, 780, 610, 70], barWidth: 10, itemStyle: { color: '#c41e3a', borderRadius: 3 } },
    { name: '榕江村超', type: 'bar', data: [30, 350, 560, 380, 210], barWidth: 10, itemStyle: { color: '#10b981', borderRadius: 3 } },
  ],
};

const hotCities = [
  ['淄博（2023 Q2 烧烤）', '#现象级 #政府宠客', '搜索指数 3 月 120 → 5 月峰值 520；「政府全员服务」承接流量，话题退潮后热度回落至基线附近 —— 单品出圈难以独力改写城市基本面。', '#e8a317'],
  ['哈尔滨（2023–24 冰雪季）', '#季节性峰值', '客流 11 月 85 → 1 月峰值 890；冰雪大世界 + 「南方小土豆」叙事，次年复购验证了产品力，但季节性天花板清晰、淡季续接仍是命门。', '#22d3ee'],
  ['天水（2024 Q1 麻辣烫）', '#县域出圈 #承载极限', '热度 1 月 40 → 3 月 780；县域凭单品出圈，交通承载与服务供给被瞬间击穿，热度半年内基本归零 —— 流量是压力测试，不是发展战略。', '#c41e3a'],
  ['榕江（村超 2023–）', '#群众体育 #长红样本', '无明星、无门票的草根足球反而具备可重复的赛事节律，+6 个月仍维持 210 指数（示意）：内容由本地人持续生产，是少见的「长红」结构。', '#10b981'],
];

// ============================================================================
// 六、文旅竞争力雷达（单系列 radarOpt × 选择器切换城市）
// ============================================================================
const RADAR_INDICATORS = ['资源禀赋', '基础设施', '服务质量', '品牌营销', '数字化', '国际可达'];
const RADAR_CITIES = [
  { key: 'sh', label: '上海（口岸门户型）', color: '#e8a317', values: [62, 95, 85, 80, 92, 96], note: '入境游第一站：枢纽 + 支付 + 多语种全要素齐备，短板反而是「自然资源禀赋」—— 靠都市文化与消费力补。' },
  { key: 'xa', label: '西安（文化 IP 型）', color: '#22d3ee', values: [92, 78, 72, 88, 74, 60], note: '十三朝古都的资源禀赋 + 大唐不夜城式营销满分，但国际航线与涉外服务是明显短板，入境红利吃得不充分。' },
  { key: 'hrb', label: '哈尔滨（季节爆款型）', color: '#60a5fa', values: [85, 64, 70, 90, 58, 45], note: '冰雪禀赋与营销爆发力极强，数字化与国际可达拖后腿；「一季养三季」的结构性脆弱写在雷达图上。' },
  { key: 'county', label: '网红县域（天水类）', color: '#c41e3a', values: [70, 38, 45, 82, 32, 15], note: '营销分与禀赋分虚高、基础设施与数字化垫底 —— 雷达图的「不对称」正是爆红即过载、过载即翻车的结构解释。' },
];

// ============================================================================
// 七、演艺与赛事经济 · 拉动倍数 bar
// ============================================================================
const eventEconBar = {
  grid: { left: 48, right: 16, top: 36, bottom: 24 },
  tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
  legend: { top: 0, textStyle: { color: '#93a1b5', fontSize: 10 }, itemWidth: 10, itemHeight: 10 },
  xAxis: categoryX(['头部演唱会', '音乐节', '城市马拉松', '电竞赛事', '村超/村BA']),
  yAxis: valueY({ name: '拉动倍数（票根=1 · 示意）', nameTextStyle: { color: '#93a1b5', fontSize: 10 } }),
  series: [
    { name: '直接票务', type: 'bar', stack: 't', barWidth: 22, data: [1, 1, 1, 1, 0.2], itemStyle: { color: '#c41e3a', borderRadius: 0 } },
    { name: '交通住宿', type: 'bar', stack: 't', barWidth: 22, data: [2.4, 2.0, 1.8, 1.2, 1.6], itemStyle: { color: '#e8a317' } },
    { name: '餐饮购物', type: 'bar', stack: 't', barWidth: 22, data: [1.4, 1.6, 1.0, 0.8, 1.8], itemStyle: { color: '#22d3ee', borderRadius: 3 } },
  ],
};

const eventNotes = [
  ['跟着演出去旅行', '异地观演占比过半（示意）：一线开票、周边城市抢人，太原、海口靠演唱会审批速度实现「弯道截流」。', '#c41e3a'],
  ['马拉松 = 城市路演', '一场城马即一次 42 公里的城市直播；报名费不挣钱，挣的是住宿餐饮与「宜居城市」的人才叙事。', '#e8a317'],
  ['村超的反商业悖论', '不收门票、不引资本，反而长红 —— 群众自发内容生产降低了运营成本，也规避了流量经济的透支机制。', '#10b981'],
];

// ============================================================================
// 八、原有保留：业态卡 / 数字化渗透 / 运营工具箱
// ============================================================================
const formats = [
  ['行 · City Walk / 城市微度假', '低客单价、高分享率；依赖公共交通与街区商业更新。', '#e8a317'],
  ['展 · 博物馆热 / 文博预约', '国潮与考古 IP 带动二次消费；承载「文化出口」叙事。', '#22d3ee'],
  ['野 · 露营 / 精致露营 (Glamping)', '周边游与亲子客群；季节性强，对营地标准与环保提出监管需求。', '#10b981'],
  ['演 · 演唱会 / 赛事经济', '票根带动交通、住宿与餐饮；地方政府以审批与安保能力换增量税收。', '#c41e3a'],
];

const digiOps = [
  ['数 · 大数据客流预警', '与交通、公安数据联动，节假日提前限流与公交加密。'],
  ['IP · 城市 IP 与二次消费', '从「打卡」到文创与演艺，延长停留时间与 ARPU。'],
  ['乡 · 乡村旅游 + 民宿规范', '与乡村振兴考核衔接，注意环保与土地合规。'],
  ['虚 · 数字藏品与 AR 导览', '提升年轻客群体验；需防范炒作与合规风险。'],
];

const penetration = [['智慧预约 / 分流', 88], ['多语种服务', 76], ['电子支付覆盖（入境客群）', 42], ['外卡 POS / 现金兑换点', 35]];

// ============================================================================
// 九、TimelineBar · 文旅演进五阶段
// ============================================================================
const STAGES = [
  { period: '1990s–2007', title: '观光时代', accent: '#93a1b5', desc: '门票经济 + 旅行社包团：景区是稀缺品，游客是流水线上的「人头」。黄金周制度（1999）第一次把假期变成宏观工具，旅游从外事接待转向内需引擎。' },
  { period: '2008–2019', title: '黄金周大众游', accent: '#e8a317', desc: '高铁网 + 智能手机 + OTA 平台重构供需：出游人次从 17 亿冲向 60 亿。出境游同步井喷，中国游客成为全球免税店的支柱客源 —— 也埋下消费外流的伏笔。' },
  { period: '2020–2022', title: '疫情冰封', accent: '#60a5fa', desc: '出游人次腰斩再腰斩（2022 仅 25.3 亿）：旅行社、航司、酒店现金流断裂，从业者大规模流失。被压抑的不止需求，还有供给侧的服务能力 —— 复苏期的服务质量争议多源于此。' },
  { period: '2023–2024', title: '报复性复苏 / 网红城市', accent: '#c41e3a', desc: '人次先于收入恢复、人均花费持续低于 2019（示意）—— 「消费降级、总量升级」。淄博、哈尔滨、天水轮番出圈，流量经济成为地方政府的新锦标赛，长红者寥寥。' },
  { period: '2024–', title: '入境红利 / 深度体验时代', accent: '#10b981', desc: '免签扩围 + 240 小时过境免签 + 支付改造，入境游成为服务贸易出口与国家叙事的双重抓手；国内侧从打卡转向旅居、研学、康养的长停留深度消费 —— 文旅被正式定位为服务消费扩容的主战场。' },
];

// ============================================================================
// 页面
// ============================================================================
export default function Page() {
  const [sectorKey, setSectorKey] = useState('inbound');
  const [radarKey, setRadarKey] = useState('sh');
  const [stageIdx, setStageIdx] = useState(4);

  const sector = SECTORS.find((s) => s.key === sectorKey) || SECTORS[0];
  const radarCity = RADAR_CITIES.find((c) => c.key === radarKey) || RADAR_CITIES[0];

  const sectorBarOpt = useMemo(() => ({
    grid: { ...GRID, top: 24 },
    tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
    xAxis: categoryX(sector.bars.cats),
    yAxis: valueY(),
    series: [{ type: 'bar', barWidth: 26, data: sector.bars.data, itemStyle: { color: sector.bars.color, borderRadius: 3 } }],
  }), [sectorKey]);

  const radarOption = useMemo(
    () => radarOpt(RADAR_INDICATORS, radarCity.values, { name: radarCity.label, color: radarCity.color }),
    [radarKey]
  );

  return (
    <div>
      <PageHeader badge="Tourism · 文旅消费" title="文旅消费 · 入境游与区域品牌" subtitle="服务消费主战场 · 免签红利 · 流量经济学" />

      <IntroCard>文旅是这一轮服务消费扩容的主战场，但繁荣的成色需要拆开看：出游人次先于收入恢复、人均花费迟迟回不到 2019 —— 「总量升级、客单降级」是底色。流量侧，淄博、哈尔滨、天水轮番出圈证明「爆红」可以速成，而「长红」取决于公共服务与承载力的长期供给；开放侧，免签扩围与 240 小时过境免签把入境游变成服务贸易出口与国家形象工程的双重抓手。本页以业态切换、恢复曲线、免签双轴、消费分层、竞争力雷达与赛事经济六个切口，给出冷峻的结构视图（数据均为公开资料整理的示意值）。</IntroCard>

      <Grid cols={4} className="mb-6">
        <Stat value="56.2 亿" label="国内出游人次 (2024E · 示意)" accent="#e8a317" />
        <Stat value="5.75 万亿" label="国内旅游收入（元 · 2024E 示意）" accent="#c41e3a" />
        <Stat value="2694 万" label="入境外国人次 (2024E · 示意)" accent="#22d3ee" />
        <Stat value="38+" label="单方面免签国家数（示意）" accent="#10b981" />
      </Grid>

      {/* ① 业态选择器 */}
      <Card title="① 六大热点业态 · 规模 / 爆点 / 增长逻辑 / 瓶颈（点选切换）" className="mb-6">
        <SelectorBar items={SECTORS} activeKey={sectorKey} onSelect={setSectorKey} />
        <Grid cols={2}>
          <div>
            <div className="os-card p-4 mb-3" style={{ borderLeft: `3px solid ${sector.accent}` }}>
              <div className="flex flex-wrap gap-x-6 gap-y-1 mb-2">
                <span className="text-xs mono" style={{ color: sector.accent }}>规模：{sector.scale}</span>
                <span className="text-xs mono" style={{ color: 'var(--text-tertiary)' }}>增速：{sector.growth}</span>
              </div>
              <div className="text-xs font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>爆点案例</div>
              <p className="text-[11px] leading-relaxed mb-2" style={{ color: 'var(--text-tertiary)' }}>{sector.cases}</p>
              <div className="text-xs font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>增长逻辑</div>
              <p className="text-[11px] leading-relaxed mb-2" style={{ color: 'var(--text-secondary)' }}>{sector.logic}</p>
              <div className="text-xs font-semibold mb-1" style={{ color: '#c41e3a' }}>结构性瓶颈</div>
              <p className="text-[11px] leading-relaxed" style={{ color: 'var(--text-tertiary)' }}>{sector.bottleneck}</p>
            </div>
          </div>
          <div>
            <div className="text-xs mono mb-2" style={{ color: 'var(--text-tertiary)' }}>{sector.bars.label}</div>
            <EChart option={sectorBarOpt} style={{ height: 240 }} />
          </div>
        </Grid>
      </Card>

      {/* ② 恢复曲线 */}
      <Grid cols={2} className="mb-6">
        <Card title="② 旅游消费恢复曲线 · 人次 vs 收入 vs 人均（2019=100 · 示意）">
          <EChart option={recoveryDual} style={{ height: 260 }} />
          <p className="text-[11px] mt-2 leading-relaxed" style={{ color: 'var(--text-tertiary)' }}>人次先回、钱包后回：人均花费曲线（虚线）始终压在 100 之下 —— 复苏是真的，降级也是真的。</p>
        </Card>
        <Card title="国内出游人次绝对值（亿 · 2024 为示意预测）">
          <EChart option={recoveryLine} style={{ height: 260 }} />
          <p className="text-[11px] mt-2 leading-relaxed" style={{ color: 'var(--text-tertiary)' }}>2022 年 25.3 亿的深坑解释了供给侧的服务能力断层：从业者流失后，复苏期的「价格刺客」与服务争议是结构性后遗症。</p>
        </Card>
      </Grid>

      {/* ③ 入境游免签效应 */}
      <Card title="③ 入境游免签效应 · 免签扩围 × 入境人次（双轴 · 示意）" className="mb-6">
        <Grid cols={2}>
          <EChart option={visaFreeDual} style={{ height: 270 }} />
          <div>
            <p className="text-sm leading-relaxed mb-3" style={{ color: 'var(--text-secondary)' }}>免签每扩一轮，入境曲线抬一截 —— 签证是国家间最直接的「价格信号」。「China Travel」成为海外平台流量标签：外国博主的第一视角视频，比任何官方宣传片更能对冲外媒叙事。</p>
            <div className="space-y-2">
              {chinaTravelChips.map(([t, d, c]) => (
                <div key={t} style={{ borderLeft: `2px solid ${c}`, paddingLeft: 10 }}>
                  <div className="text-xs font-semibold" style={{ color: 'var(--text-primary)' }}>{t}</div>
                  <p className="text-[11px] mt-0.5 leading-relaxed" style={{ color: 'var(--text-tertiary)' }}>{d}</p>
                </div>
              ))}
            </div>
          </div>
        </Grid>
      </Card>

      {/* ④ 消费分层 */}
      <Grid cols={2} className="mb-6">
        <Card title="④ 消费分层结构（% · 示意）">
          <EChart option={tierDonut} style={{ height: 240 }} />
          <p className="text-[11px] mt-2 leading-relaxed" style={{ color: 'var(--text-tertiary)' }}>「穷游特种兵」近三成 + 银发旅居崛起：客单价被两端结构性拉低，总盘子靠频次与人次撑大 —— 人均消费降级、总量升级。</p>
        </Card>
        <Card title="出游人群年龄结构（% · 示意）">
          <EChart option={ageDonut} style={{ height: 240 }} />
          <p className="text-[11px] mt-2 leading-relaxed" style={{ color: 'var(--text-tertiary)' }}>Z 世代贡献话题与内容、银发贡献时长与淡季客流：前者决定一个城市能不能红，后者决定它能不能活。</p>
        </Card>
      </Grid>

      {/* ⑤ 区域品牌爆款 */}
      <Grid cols={2} className="mb-6">
        <Card title="⑤ 现象级目的地 · 流量持续性对比（热度指数 · 示意）"><EChart option={hotspotBar} style={{ height: 290 }} /></Card>
        <Card title="爆款复盘 · 话题—客流—承载的极短链条">
          <p className="text-sm leading-relaxed mb-3" style={{ color: 'var(--text-secondary)' }}>短视频把「话题→客流→服务承压」的传导压缩到以周计。看「+6 个月」那根柱：绝大多数爆款回归基线，长红是结构问题而非营销问题。</p>
          <div className="space-y-2">
            {hotCities.map(([t, tag, d, c]) => (
              <div key={t} style={{ borderLeft: `2px solid ${c}`, paddingLeft: 10 }}>
                <div className="text-xs font-semibold" style={{ color: 'var(--text-primary)' }}>{t} <span className="mono text-[10px]" style={{ color: c }}>{tag}</span></div>
                <p className="text-[11px] mt-0.5 leading-relaxed" style={{ color: 'var(--text-tertiary)' }}>{d}</p>
              </div>
            ))}
          </div>
        </Card>
      </Grid>

      {/* ⑥ 竞争力雷达 */}
      <Card title="⑥ 文旅竞争力雷达 · 四类目的地画像（点选切换 · 示意评分）" className="mb-6">
        <SelectorBar items={RADAR_CITIES} activeKey={radarKey} onSelect={setRadarKey} getAccent={(c) => c.color} />
        <Grid cols={2}>
          <EChart option={radarOption} style={{ height: 280 }} />
          <div className="os-card p-4" style={{ borderLeft: `3px solid ${radarCity.color}` }}>
            <div className="text-sm font-semibold mb-2" style={{ color: radarCity.color }}>{radarCity.label}</div>
            <p className="text-sm leading-relaxed mb-3" style={{ color: 'var(--text-secondary)' }}>{radarCity.note}</p>
            <div className="space-y-1.5">
              {RADAR_INDICATORS.map((ind, i) => (
                <div key={ind} className="flex items-center gap-2">
                  <span className="text-[11px] mono" style={{ color: 'var(--text-tertiary)', width: 64 }}>{ind}</span>
                  <div style={{ flex: 1, height: 5, borderRadius: 3, background: 'rgba(148,163,184,0.15)', overflow: 'hidden' }}>
                    <div style={{ width: `${radarCity.values[i]}%`, height: '100%', borderRadius: 3, background: radarCity.color }} />
                  </div>
                  <span className="text-[11px] mono" style={{ color: radarCity.color, width: 24, textAlign: 'right' }}>{radarCity.values[i]}</span>
                </div>
              ))}
            </div>
          </div>
        </Grid>
      </Card>

      {/* ⑦ 演艺与赛事 */}
      <Grid cols={2} className="mb-6">
        <Card title="⑦ 演艺与赛事经济 · 消费拉动倍数（票根=1 · 堆叠 · 示意）"><EChart option={eventEconBar} style={{ height: 280 }} /></Card>
        <Card title="「跟着演出去旅行」· 三个观察">
          <p className="text-sm leading-relaxed mb-3" style={{ color: 'var(--text-secondary)' }}>演出与赛事是「时间确定、地点指定」的消费契约 —— 比景区更能锁定异地过夜。地方政府把审批与安保能力当成招商资源投放，演艺经济成为城市存量竞争的新战场。</p>
          <div className="space-y-2">
            {eventNotes.map(([t, d, c]) => (
              <div key={t} style={{ borderLeft: `2px solid ${c}`, paddingLeft: 10 }}>
                <div className="text-xs font-semibold" style={{ color: 'var(--text-primary)' }}>{t}</div>
                <p className="text-[11px] mt-0.5 leading-relaxed" style={{ color: 'var(--text-tertiary)' }}>{d}</p>
              </div>
            ))}
          </div>
        </Card>
      </Grid>

      {/* 业态卡 + 数字化（保留） */}
      <Card title="客群结构与新兴业态" className="mb-6">
        <p className="text-sm leading-relaxed mb-4" style={{ color: 'var(--text-secondary)' }}>Z 世代贡献话题与内容；家庭与银发客群更重舒适与安全。业态从观光向体验迁移，催生四类高传播供给。</p>
        <Grid cols={2}>
          {formats.map(([t, d, c]) => (
            <div key={t} style={{ borderLeft: `2px solid ${c}`, paddingLeft: 10 }}>
              <div className="text-xs font-semibold" style={{ color: 'var(--text-primary)' }}>{t}</div>
              <p className="text-[11px] mt-1 leading-relaxed" style={{ color: 'var(--text-tertiary)' }}>{d}</p>
            </div>
          ))}
        </Grid>
      </Card>

      <Grid cols={2} className="mb-6">
        <Card title="目的地数字化渗透（示意 %）">
          <p className="text-sm leading-relaxed mb-4" style={{ color: 'var(--text-secondary)' }}>预约、支付与客流监测越成熟，越利于平抑峰值与舆情风险；外卡支付与多语种服务是入境游体验的两大短板，也是免签红利能否兑现的「最后一公里」。</p>
          <div className="space-y-3">
            {penetration.map(([t, v]) => (
              <div key={t}>
                <div className="flex justify-between text-[11px] mb-1" style={{ color: 'var(--text-tertiary)' }}><span>{t}</span><span className="mono">{v}%</span></div>
                <div style={{ height: 6, borderRadius: 3, background: 'rgba(148,163,184,0.15)', overflow: 'hidden' }}>
                  <div style={{ width: `${v}%`, height: '100%', borderRadius: 3, background: '#c41e3a' }} />
                </div>
              </div>
            ))}
          </div>
        </Card>
        <Card title="目的地运营工具箱">
          <Grid cols={2}>
            {digiOps.map(([t, d]) => (
              <div key={t}>
                <div className="text-xs font-semibold" style={{ color: 'var(--text-primary)' }}>{t}</div>
                <p className="text-[11px] mt-1 leading-relaxed" style={{ color: 'var(--text-tertiary)' }}>{d}</p>
              </div>
            ))}
          </Grid>
        </Card>
      </Grid>

      {/* ⑧ 演进时间线 */}
      <Card title="⑧ 文旅消费演进 · 五个时代（点选切换）" className="mb-6">
        <TimelineBar stages={STAGES} activeIdx={stageIdx} onSelect={setStageIdx} />
      </Card>

      <Card title="系统观察" className="mb-6"><p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>流量是入口而非终点：淄博、哈尔滨与天水证明「出圈」可以速成，榕江证明「长红」依赖可重复的内容生产结构；人次与收入的剪刀差提醒我们，这轮复苏的成色是「降级中的扩容」。文旅消费的真正杠杆，在于把一次性话题转化为县域品牌、把免签窗口转化为支付与服务的可复用基础设施 —— 前者考验地方政府的耐心，后者考验开放的诚意。</p></Card>

      <FrameworkTrio cards={[
        { key: 'salt', title: '消费压舱石', subtitle: '服务消费扩容主战场', body: '商品消费见顶后，文旅是服务消费扩容最大的弹性空间：不依赖地产链、吸纳低技能就业、下沉到县域 —— 政策把它当作内需的压舱石与就业的海绵，但人均花费的剪刀差说明压舱石的密度仍在恢复中。', pillars: [['就业海绵', '住宿餐饮导览等低门槛岗位吸纳青年与县域就业'], ['县域抓手', '文旅是少数能直达县域的消费下沉通道'], ['假日工具', '调休与黄金周仍是宏观逆周期的廉价杠杆']] },
        { key: 'stone', title: '流量经济学', subtitle: '爆红与长红之辨', body: '网红城市是一场对地方治理的压力测试：话题→客流→承载的链条以周计，绝大多数爆款半年归零。长红的充要条件不是营销，而是「可重复的内容生产结构 + 不被击穿的公共服务」—— 这恰是摸石头式渐进供给最难速成的部分。', pillars: [['爆红易', '短视频把出圈成本降到一个单品、一条热梗'], ['承接难', '交通/住宿/价格治理决定流量留存率'], ['长红稀缺', '村超式本地内容自生产是少见的长红结构']] },
        { key: 'path', title: '入境游再开放', subtitle: '免签 = 用脚投票的形象工程', body: '免签扩围把入境游从旅游议题升格为国家叙事工程：每一段 China Travel 视频都是去中介化的国家公关，每一笔外卡消费都是服务贸易出口。从过境免签到离境退税，路径是把「来过」变成「消费过」、把「消费过」变成「会再来」。', pillars: [['签证信号', '免签是国家间最直接的开放价格信号'], ['支付断点', '外卡/现金/多语种是红利兑现的最后一公里'], ['叙事出口', '博主第一视角内容对冲外媒框架']] },
      ]} />

      <ModuleFooter moduleId="tourism" disclaimer="公开资料整理 · 全部数据为示意值非官方统计 · 仅供分析框架参考，非投资建议" />
    </div>
  );
}
