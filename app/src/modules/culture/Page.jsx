import React, { useState, useMemo } from 'react';
import { PageHeader, Card, Grid, Stat } from '../../app/ui.jsx';
import EChart from '../../lib/viz/EChart.jsx';
import { categoryX, valueY, logY, GRID, donutOpt, radarOpt, stackedBarOpt, AXIS, LABEL } from '../shared/chartHelpers.js';
import { IntroCard, SelectorBar, TimelineBar, FrameworkTrio, ModuleFooter } from '../shared/ModuleParadigm.jsx';

// ---------------------------------------------------------------------------
// 出海赛道数据（示意值）：海外规模 / 代表案例 / 增长逻辑 / 风险
// ---------------------------------------------------------------------------
const TRACKS = [
  {
    key: 'webnovel', label: '网文出海', accent: '#10b981',
    scale: '约 50 亿$', users: '2.5 亿海外读者', growth: '+25%/年',
    cases: ['起点国际 WebNovel', 'AI 翻译批量出海', '本土原创作者生态'],
    logic: '翻译成本被 AI 压到近零，16,000+ 部作品批量铺向东南亚与北美。网文是 IP 之源——影视、游戏、动漫改编都从这里抽水。',
    risk: '单本付费意愿低，盗版严重；价值观审查使部分题材天然无法出海。',
    trend: [8, 12, 18, 26, 35, 44, 52],
    markets: [55, 48, 92, 60, 70],
  },
  {
    key: 'drama', label: '微短剧出海', accent: '#e8a317',
    scale: '约 60 亿$', users: '亿级下载', growth: '+100%+/年',
    cases: ['ReelShort', 'DramaBox', 'ShortMax 竖屏付费'],
    logic: '把网文爽点压缩成 1 分钟一集的多巴胺管线，IAP 付费 + 广告双轮。中国团队写、AI 译、海外拍——文化工业的全球分包。',
    risk: '内容同质化极快，买量成本飙升；平台政策（应用商店抽成、内容分级）随时收紧。',
    trend: [0, 1, 3, 10, 28, 45, 62],
    markets: [88, 60, 75, 70, 80],
  },
  {
    key: 'game', label: '游戏出海', accent: '#c41e3a',
    scale: '约 185 亿$', users: '全球数亿玩家', growth: '+8%/年',
    cases: ['原神 / 米哈游', 'PUBG Mobile / 腾讯', '黑神话：悟空（3A 破圈）'],
    logic: '中国文化出口的真正主力。手游长期占据全球收入头部，原神证明「中国审美 + 全球发行」可以正面赢；黑神话打开 3A 与主机叙事。',
    risk: '各国数据本地化与未成年人监管；地缘紧张下「中国 App」标签本身成为风险资产。',
    trend: [96, 116, 155, 180, 174, 164, 185],
    markets: [78, 72, 92, 85, 68],
  },
  {
    key: 'tiktok', label: '短视频 TikTok', accent: '#22d3ee',
    scale: '广告收入超 200 亿$', users: '15.6 亿+ MAU', growth: '受地缘制约',
    cases: ['TikTok 全球', 'TikTok Shop 电商', 'CapCut 工具链'],
    logic: '不是输出内容，而是输出「分发权力」——算法决定全球十几亿人每天看什么。这是历史上中国公司第一次握住西方注意力的总闸门。',
    risk: '美国「不卖就禁」立法、印度封禁先例——平台越成功，地缘靶子越大。最强的软实力载体也是最脆弱的。',
    trend: [50, 120, 350, 700, 1000, 1300, 1560],
    markets: [88, 72, 90, 78, 82],
  },
  {
    key: 'anime', label: '国漫影视', accent: '#8b5cf6',
    scale: '约 30 亿$', users: '流媒体多区上线', growth: '+15%/年',
    cases: ['《三体》Netflix 改编', '《流浪地球》系列', '哪吒 / 长安三万里'],
    logic: '从「卖片」到「卖宇宙」：科幻与神话宇宙是少数能与好莱坞同台的题材。但国内票房巨头出海后常缩水九成——本土爆款 ≠ 全球爆款。',
    risk: '叙事语法差异：主旋律框架在海外市场天然失效；发行渠道仍被欧美流媒体卡脖子。',
    trend: [5, 8, 10, 14, 18, 24, 30],
    markets: [40, 45, 85, 55, 60],
  },
  {
    key: 'toy', label: '潮玩 IP', accent: '#f472b6',
    scale: '海外营收 50 亿+ RMB', users: 'Z 世代收藏圈层', growth: '+200%+/年',
    cases: ['泡泡玛特 Labubu 全球排队', '名创优品 IP 联名', 'TOP TOY 出海'],
    logic: 'Labubu 让欧美明星自发带货——没有官方推手的纯市场认同，是软实力最硬的形态。盲盒 = 情绪消费 + 社交货币 + 二级市场金融化。',
    risk: 'IP 生命周期短、复制门槛低；潮玩热是周期性消费情绪，不是结构性文化认同。',
    trend: [1, 2, 4, 7, 13, 28, 50],
    markets: [72, 65, 90, 58, 75],
  },
];

// ---------------------------------------------------------------------------
// 文化战略时间线
// ---------------------------------------------------------------------------
const PHASES = [
  { period: '2003–2011', title: '文化体制改革', accent: '#64748b', desc: '经营性文化单位转企改制，文化第一次被承认是「产业」。出版、影视、演艺从事业编制推向市场——为后来一切商业出海铺设制度地基。' },
  { period: '2012–2016', title: '文化产业振兴', accent: '#10b981', desc: '文化产业被列为国民经济支柱性产业目标。资本涌入影视与游戏，手游开始全球化试水；网文平台完成整合，IP 概念第一次被资本市场定价。' },
  { period: '2017–2019', title: '讲好中国故事', accent: '#e8a317', desc: '官方叙事出海体系化（外宣矩阵、孔子学院扩张），但真正破圈的是商业产品：TikTok 海外登顶下载榜，原神立项——官方叙事与市场爆款开始分流。' },
  { period: '2020–2023', title: '国潮崛起 · 出海爆发', accent: '#c41e3a', desc: '国货品牌偏好度反超外资，汉服与文创成为消费现象；原神全球年收破纪录、微短剧出海从零到数十亿美元。市场化内容第一次成规模穿透西方主流人群。' },
  { period: '2024–', title: '文明叙事竞争', accent: '#22d3ee', desc: 'TikTok 法案、黑神话 3A、Labubu 全球排队同年发生——文化出海同时触到天花板（地缘封锁）与新高度（自发认同）。竞争从产品上升到叙事与规则层。' },
];

// ---------------------------------------------------------------------------
// 国潮消费（示意指数）
// ---------------------------------------------------------------------------
const GUOCHAO_YEARS = ['2016', '2018', '2020', '2022', '2024'];
const GUOCHAO = [
  { name: '国货品牌偏好度', color: '#c41e3a', data: [38, 46, 58, 68, 75] },
  { name: '老字号回潮指数', color: '#e8a317', data: [25, 32, 45, 58, 66] },
  { name: '汉服 / 文创热度', color: '#22d3ee', data: [10, 22, 40, 62, 78] },
];

const SOFT_DIMS = ['流行文化输出', '语言传播', '媒体话语权', '学术影响力', '旅游吸引力', '价值观认同'];
const SOFT_CN = [55, 35, 30, 45, 60, 25];
const SOFT_US = [95, 90, 85, 92, 80, 70];

export default function Page() {
  const [track, setTrack] = useState('game');
  const [phaseIdx, setPhaseIdx] = useState(4);
  const t = TRACKS.find((x) => x.key === track) || TRACKS[0];

  // -- 交互① 赛道出口趋势（随选择切换）
  const trackTrend = useMemo(() => ({
    grid: GRID,
    tooltip: { trigger: 'axis' },
    xAxis: categoryX(['2018', '2019', '2020', '2021', '2022', '2023', '2024']),
    yAxis: valueY(),
    series: [{ type: 'line', smooth: true, symbol: 'circle', symbolSize: 5,
      data: t.trend,
      lineStyle: { color: t.accent, width: 2 }, itemStyle: { color: t.accent },
      areaStyle: { color: `${t.accent}18` } }],
  }), [t]);

  const marketBar = useMemo(() => ({
    grid: { left: 56, right: 40, top: 16, bottom: 24 },
    tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
    xAxis: valueY({ max: 100 }),
    yAxis: categoryX(['北美', '欧洲', '东南亚', '中东', '拉美']),
    series: [{ type: 'bar', barWidth: 14,
      data: t.markets.map((v) => ({ value: v, itemStyle: { color: t.accent, borderRadius: 3 } })),
      label: { show: true, position: 'right', color: LABEL.color, fontSize: 10 } }],
  }), [t]);

  // -- 新文化出口三件套（多线，log 轴跨度大）
  const trioTrend = useMemo(() => ({
    grid: { ...GRID, top: 34 },
    tooltip: { trigger: 'axis' },
    legend: { top: 0, textStyle: { color: LABEL.color, fontSize: 10 }, itemWidth: 12 },
    xAxis: categoryX(['2018', '2019', '2020', '2021', '2022', '2023', '2024']),
    yAxis: logY({ min: 1 }),
    series: [
      { name: '游戏出海（亿$）', type: 'line', smooth: true, symbol: 'none', data: [96, 116, 155, 180, 174, 164, 185], lineStyle: { color: '#c41e3a', width: 2 } },
      { name: '微短剧海外（亿$）', type: 'line', smooth: true, symbol: 'none', data: [1, 1, 3, 10, 28, 45, 62], lineStyle: { color: '#e8a317', width: 2 } },
      { name: '网文海外（亿$）', type: 'line', smooth: true, symbol: 'none', data: [8, 12, 18, 26, 35, 44, 52], lineStyle: { color: '#10b981', width: 2 } },
    ],
  }), []);

  // -- 国潮消费 bar
  const guochaoBar = useMemo(() => ({
    grid: { ...GRID, top: 34 },
    tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
    legend: { top: 0, textStyle: { color: LABEL.color, fontSize: 10 }, itemWidth: 12 },
    xAxis: categoryX(GUOCHAO_YEARS),
    yAxis: valueY({ max: 100 }),
    series: GUOCHAO.map((s) => ({ name: s.name, type: 'bar', barWidth: 14, data: s.data, itemStyle: { color: s.color, borderRadius: [3, 3, 0, 0] } })),
  }), []);

  // -- 软实力雷达：中美双系列（radarOpt 仅单系列，故内联）
  const softRadar = useMemo(() => ({
    tooltip: { trigger: 'item' },
    legend: { bottom: 0, textStyle: { color: LABEL.color, fontSize: 10 }, itemWidth: 12 },
    radar: {
      indicator: SOFT_DIMS.map((n) => ({ name: n, max: 100 })),
      axisName: { color: LABEL.color, fontSize: 10 },
      splitLine: { lineStyle: { color: 'rgba(148,163,184,0.15)' } },
      axisLine: { lineStyle: { color: 'rgba(148,163,184,0.15)' } },
      splitArea: { show: false },
      radius: '62%', center: ['50%', '46%'],
    },
    series: [{
      type: 'radar',
      data: [
        { value: SOFT_CN, name: '中国', lineStyle: { color: '#c41e3a', width: 2 }, itemStyle: { color: '#c41e3a' }, areaStyle: { color: 'rgba(196,30,58,0.15)' } },
        { value: SOFT_US, name: '美国', lineStyle: { color: '#22d3ee', width: 2 }, itemStyle: { color: '#22d3ee' }, areaStyle: { color: 'rgba(34,211,238,0.08)' } },
      ],
    }],
  }), []);

  // -- 赛道格局雷达（单系列，随赛道切换）
  const trackRadar = useMemo(() => radarOpt(
    ['海外规模', '增长动能', '认同深度', '地缘抗性', 'IP 衍生力', '盈利能力'],
    {
      webnovel: [45, 60, 55, 75, 90, 40],
      drama: [55, 95, 30, 70, 45, 75],
      game: [95, 55, 80, 60, 75, 90],
      tiktok: [98, 65, 70, 15, 50, 85],
      anime: [40, 55, 65, 55, 70, 35],
      toy: [42, 92, 60, 80, 55, 80],
    }[track],
    { name: t.label, color: t.accent },
  ), [track, t]);

  // -- 文化贸易结构：产品顺差 vs 内容逆差（stacked bar）
  const tradeStruct = useMemo(() => stackedBarOpt({
    categories: ['文化产品（硬件/印刷/工艺）', '文化服务（版权/内容/IP）'],
    horizontal: true,
    series: [
      { name: '出口（亿$）', data: [1700, 280], itemStyle: { color: '#c41e3a', borderRadius: [0, 3, 3, 0] } },
      { name: '进口（亿$）', data: [-350, -460], itemStyle: { color: '#22d3ee', borderRadius: [3, 0, 0, 3] } },
    ],
  }), []);

  // -- 文化产业内部结构 donut
  const industryDonut = useMemo(() => donutOpt([
    { value: 32, name: '游戏与电竞', itemStyle: { color: '#c41e3a' } },
    { value: 24, name: '短视频与直播', itemStyle: { color: '#22d3ee' } },
    { value: 14, name: '影视与动漫', itemStyle: { color: '#8b5cf6' } },
    { value: 12, name: '网文与出版', itemStyle: { color: '#10b981' } },
    { value: 10, name: '潮玩与文创', itemStyle: { color: '#f472b6' } },
    { value: 8, name: '演艺与文旅', itemStyle: { color: '#e8a317' } },
  ]), []);

  return (
    <div>
      <PageHeader badge="Culture · Digital Soft Power" title="文化产业与数字软实力" subtitle="国潮 · 出海六赛道 · 叙事权力 · 地缘风险" />
      <IntroCard>
        软实力的残酷之处在于：它无法被计划出来。官方外宣经营数十年，真正穿透西方主流人群的却是
        <strong style={{ color: 'var(--text-primary)' }}>游戏、短视频、微短剧与盲盒</strong>
        ——商业爆款先于国家叙事完成了「让人自愿喜欢」这件事。本页沿六条出海赛道与国潮消费两条线，
        冷峻拆解：哪些是结构性认同，哪些只是周期性热度，以及最强的载体为何同时是最脆弱的地缘靶子。
      </IntroCard>

      {/* 概览 4 Stat */}
      <Grid cols={4} className="mb-6">
        <Stat value="185 亿$" label="游戏出海年收入（示意）" accent="#c41e3a" />
        <Stat value="60 亿$" label="微短剧海外规模（示意）" accent="#e8a317" />
        <Stat value="15.6 亿+" label="TikTok 全球 MAU" accent="#22d3ee" />
        <Stat value="~4.5%" label="文化产业占 GDP（示意）" accent="#10b981" />
      </Grid>

      {/* 交互① 出海赛道选择器 */}
      <Card title="交互① · 出海六赛道选择器 — 规模 / 案例 / 逻辑 / 风险" className="mb-6">
        <SelectorBar items={TRACKS} activeKey={track} onSelect={setTrack} />
        <Grid cols={3} className="mb-4">
          <Stat value={t.scale} label="海外规模（示意）" accent={t.accent} />
          <Stat value={t.users} label="海外用户体量" accent={t.accent} />
          <Stat value={t.growth} label="增长态势" accent={t.accent} />
        </Grid>
        <div className="os-card p-4 mb-4" style={{ background: 'var(--bg-elevated)', borderLeft: `3px solid ${t.accent}` }}>
          <div className="text-xs mono mb-2" style={{ color: t.accent }}>代表案例</div>
          <div className="flex flex-wrap gap-2 mb-3">
            {t.cases.map((c) => (
              <span key={c} className="text-xs px-2 py-1 rounded" style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', color: 'var(--text-secondary)' }}>{c}</span>
            ))}
          </div>
          <div className="text-xs mono mb-1" style={{ color: 'var(--cyber-cyan)' }}>增长逻辑</div>
          <p className="text-sm leading-relaxed mb-3" style={{ color: 'var(--text-secondary)' }}>{t.logic}</p>
          <div className="text-xs mono mb-1" style={{ color: 'var(--china-red)' }}>风险（监管 / 地缘）</div>
          <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{t.risk}</p>
        </div>
        <Grid cols={2}>
          <Card title={`${t.label} · 海外规模趋势（示意，亿$/相对值）`}><EChart option={trackTrend} style={{ height: 220 }} /></Card>
          <Card title="海外市场渗透指数（示意）"><EChart option={marketBar} style={{ height: 220 }} /></Card>
        </Grid>
        <Grid cols={2} className="mt-4">
          <Card title="赛道六维体检（随选择切换）"><EChart option={trackRadar} style={{ height: 240 }} /></Card>
          <Card title="文化产业出海结构（示意 %）"><EChart option={industryDonut} style={{ height: 240 }} /></Card>
        </Grid>
      </Card>

      {/* 新文化出口三件套 */}
      <Card title="新文化出口三件套 — 游戏 / 微短剧 / 网文（对数轴，示意）" className="mb-6">
        <EChart option={trioTrend} style={{ height: 260 }} />
        <p className="text-xs mt-3 leading-relaxed" style={{ color: 'var(--text-tertiary)' }}>
          对数轴下三条线的斜率即增速：游戏是高位平台期的「现金牛」，微短剧是从零到数十亿美元的「爆发体」，
          网文是低调但持续的「IP 母矿」。三者共享同一套底层能力——工业化内容管线 + 全球买量发行。
        </p>
      </Card>

      {/* 国潮消费 + 软实力雷达 */}
      <Grid cols={2} className="mb-6">
        <Card title="国潮消费 — 文化自信的消费表达（示意指数）">
          <EChart option={guochaoBar} style={{ height: 240 }} />
          <p className="text-xs mt-3 leading-relaxed" style={{ color: 'var(--text-tertiary)' }}>
            国货偏好度反超外资品牌、老字号回潮、汉服从亚文化走向街头——国潮首先是消费现象，
            其次才是认同叙事。需要警惕的是：偏好国货 ≠ 文化输出能力，前者是内需，后者要在别人的市场里被自愿选择。
          </p>
        </Card>
        <Card title="软实力多维对比 — 中国 vs 美国（示意评分）">
          <EChart option={softRadar} style={{ height: 240 }} />
          <p className="text-xs mt-3 leading-relaxed" style={{ color: 'var(--text-tertiary)' }}>
            客观差距：流行文化与旅游两维在收窄，媒体话语权与价值观认同两维仍是数量级落差。
            软实力（约瑟夫·奈）的定义是「让人自愿认同」——这恰是行政力量最难直接生产的东西。
          </p>
        </Card>
      </Grid>

      {/* 平台型 vs 内容型 */}
      <Card title="两种出海路径 — 平台型 vs 内容型" className="mb-6">
        <Grid cols={2}>
          <div className="os-card p-4" style={{ background: 'var(--bg-elevated)', borderLeft: '3px solid #22d3ee' }}>
            <div className="text-sm font-semibold mb-1" style={{ color: '#22d3ee' }}>平台型 · 输出分发权力（TikTok / SHEIN 模式）</div>
            <p className="text-sm leading-relaxed mb-2" style={{ color: 'var(--text-secondary)' }}>
              不输出某个具体内容，而是占住「全球十几亿人每天看什么」的总闸门。算法即权力，
              网络效应一旦形成几乎不可逆——所以它换来的不是市场竞争，而是国家级立法围剿。
            </p>
            <p className="text-xs leading-relaxed" style={{ color: 'var(--text-tertiary)' }}>上限：重构全球注意力秩序 · 下限：一纸禁令归零。</p>
          </div>
          <div className="os-card p-4" style={{ background: 'var(--bg-elevated)', borderLeft: '3px solid #c41e3a' }}>
            <div className="text-sm font-semibold mb-1" style={{ color: 'var(--china-red)' }}>内容型 · 输出认同符号（原神 / 黑神话 / Labubu 模式）</div>
            <p className="text-sm leading-relaxed mb-2" style={{ color: 'var(--text-secondary)' }}>
              单个爆款穿透文化壁垒：玩家为璃月学中国神话，欧美明星为 Labubu 排队。
              地缘抗性远高于平台——禁一个 App 容易，禁「喜欢」很难。但爆款不可计划、不可复制。
            </p>
            <p className="text-xs leading-relaxed" style={{ color: 'var(--text-tertiary)' }}>上限：自发文化认同 · 下限：爆款断档即沉寂。</p>
          </div>
        </Grid>
      </Card>

      {/* 文化贸易结构 */}
      <Card title="文化贸易结构 — 产品顺差，内容逆差（示意，亿$）" className="mb-6">
        <EChart option={tradeStruct} style={{ height: 200 }} />
        <p className="text-xs mt-3 leading-relaxed" style={{ color: 'var(--text-tertiary)' }}>
          结构性真相：文化「产品」贸易（硬件、印刷、工艺品）长期巨额顺差——但那是制造业顺差，不是文化顺差；
          文化「服务」贸易（版权、内容、IP 授权）长期逆差。游戏与短剧的爆发正在第一次扭转后者——
          从卖「装文化的盒子」转向卖「文化本身」。
        </p>
      </Card>

      {/* 交互② 时间线 */}
      <Card title="交互② · 文化战略演进时间线" className="mb-6">
        <TimelineBar stages={PHASES} activeIdx={phaseIdx} onSelect={setPhaseIdx} />
      </Card>

      {/* 框架三卡 */}
      <FrameworkTrio cards={[
        { title: '叙事权力', subtitle: '约瑟夫·奈 · 软实力', body: '软实力 = 让人自愿认同的能力，而非宣传音量。能被预算买到的是曝光，买不到的是喜欢——这正是官方外宣与商业爆款效果分流的根本原因。', pillars: [['吸引非强制', '认同无法被命令。'], ['信誉是货币', '说教折损信用。'], ['文化先于政治', '先喜欢再倾听。']] },
        { title: '市场化出海', subtitle: '无心插柳 · 商业先行', body: '真正出圈的载体（TikTok / 原神 / Labubu / 短剧）没有一个诞生于外宣规划——商业公司追逐利润，顺手完成了国家叙事做不到的渗透。', pillars: [['爆款不可计划', '只能养土壤。'], ['利润即制导', '市场自动找需求。'], ['去官方化', '越不像宣传越有效。']] },
        { title: '地缘风险', subtitle: 'TikTok 困局 · 数字冷战', body: 'TikTok 困局是数字时代文化地缘冲突的样板：当一国公司握住他国注意力闸门，市场逻辑让位于安全逻辑。文化出海越成功，越快撞上主权天花板。', pillars: [['平台被狙', '不卖就禁的先例。'], ['内容韧性', '认同难以立法禁止。'], ['规则竞争', '从产品到叙事层。']] },
      ]} />

      {/* 研判要点 */}
      <Card title="研判要点" className="mb-6">
        <Grid cols={3}>
          {[['1 · 顺差换轨', '从「装文化的盒子」到「文化本身」——服务贸易逆差收窄是比规模更关键的指标。'],
            ['2 · 双轨分化', '平台型上限高但地缘脆弱，内容型韧性强但不可计划；组合而非二选一。'],
            ['3 · 认同滞后', '消费端国潮 ≠ 输出端认同；价值观维度的差距是十年量级的长线变量。']].map(([t2, d]) => (
            <div key={t2}><div className="text-sm font-semibold" style={{ color: 'var(--china-red)' }}>{t2}</div><p className="text-xs mt-1 leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{d}</p></div>
          ))}
        </Grid>
      </Card>

      <ModuleFooter moduleId="culture" disclaimer="公开资料整理，数值均为示意 · 软实力评分为主观分析框架，非官方统计 · 仅供研究参考" sourceNote="由 tabs/culture.html 迁移扩容" />
    </div>
  );
}
