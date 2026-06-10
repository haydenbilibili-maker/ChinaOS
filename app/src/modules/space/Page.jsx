import React, { useState, useMemo } from 'react';
import { PageHeader, Card, Grid, Stat } from '../../app/ui.jsx';
import EChart from '../../lib/viz/EChart.jsx';
import { categoryX, valueY, logY, GRID, donutOpt, radarOpt, stackedBarOpt } from '../shared/chartHelpers.js';
import { IntroCard, SelectorBar, TimelineBar, FrameworkTrio, ModuleFooter } from '../shared/ModuleParadigm.jsx';

// ---------------------------------------------------------------------------
// 板块数据 · 六大航天赛道（示意值）
// ---------------------------------------------------------------------------
const SECTORS = [
  {
    key: 'crewed', label: '载人航天 / 空间站', accent: '#c41e3a',
    progress: '天宫空间站 2022 年三舱合体建成，常态化 6 个月轮换驻留；梦天/问天实验柜满负荷运转，神舟与天舟形成「人货双线」补给节奏。国际合作载荷已上行，2030 前载人登月工程（长征十号 + 梦舟 + 揽月）全线立项推进。',
    benchmark: 'ISS 预计 2030 年退役后，天宫可能成为唯一在轨国家级空间站；美国转向商业空间站（Axiom/Orbital Reef），存在 1-3 年的「空间站空窗期」博弈。Artemis 载人登月时间表与中国 2030 目标正面相撞。',
    commercial: '商业化程度低：空间站短期内是科研与主权资产而非生意；微重力制药/材料实验的商业载荷搭载刚起步，对标 ISS 国家实验室模式。',
    strategic: '在轨常驻 = 太空存在权的最高形态。空间站是载人深空的中转站与技术验证场，也是航天员队伍、生保系统、出舱作业等「不可速成能力」的蓄水池。',
    metrics: [['在轨空间站', '1 座（天宫）'], ['年载人发射', '2 次神舟'], ['载人登月节点', '2030 前']],
  },
  {
    key: 'deepspace', label: '深空探测（探月探火）', accent: '#e8a317',
    progress: '嫦娥五号/六号实现月球正面与背面采样返回（人类首次月背取样）；天问一号一次任务完成「绕落巡」，祝融号巡视乌托邦平原。嫦娥七号/八号瞄准月球南极水冰勘查，国际月球科研站（ILRS）拉俄罗斯等十余国签约。',
    benchmark: '美国深空探测总量仍领先（火星采样返回受预算拖累反而落后于天问三号时间表）；月球南极着陆精度与采样返回工程能力上，中国已进入第一梯队。深空测控网（佳木斯/喀什/阿根廷站）是隐形长板。',
    commercial: '基本无商业化，但月球水冰 → 原位推进剂（ISRU）是 2040 年代地月经济的期权；深空测控与行星数据服务可能率先外溢。',
    strategic: '月球南极的永久阴影坑与光照高地是「天上的马六甲」：位置有限、先到先得。ILRS vs Artemis Accords 本质是太空规则制定权的两套联盟体系。',
    metrics: [['月球采样返回', '2 次（含月背）'], ['火星任务', '绕落巡一次成'], ['月球科研站', 'ILRS 2035 基本型']],
  },
  {
    key: 'beidou', label: '北斗导航', accent: '#10b981',
    progress: '北斗三号 2020 年全球组网，30 颗 MEO/IGSO/GEO 混合星座；独有短报文（全球 40 字 / 区域 1000 字）与星基增强。下一代北斗 2035 年前建成，瞄准厘米级实时 + 室内外无缝 + 低轨增强。',
    benchmark: '定位精度与 GPS III 相当（公开服务 2-5 米级），亚太区域因 IGSO 倾斜轨道增强反超；GPS 胜在生态惯性 —— 全球芯片/接收机默认兼容。北斗已进入国际民航（ICAO）、海事（IMO）标准体系。',
    commercial: '商业化最成熟的航天资产：产业总产值 5,700 亿元级（2024），大众消费（手机/穿戴）占比过半；高精度市场（自动驾驶/测绘/无人机）年增 20%+，短报文向大众手机直连下沉。',
    strategic: '时空基准 = 数字主权的物理底座。金融授时、电网同步、军用 PNT 摆脱 GPS 单点依赖；「一带一路」沿线的北斗地面增强站是基础设施外交的硬载体。',
    metrics: [['在轨组网星', '30 颗（北斗三号）'], ['产业产值', '~5,700 亿元'], ['下一代组网', '2035 前']],
  },
  {
    key: 'remote', label: '遥感星座', accent: '#22d3ee',
    progress: '高分专项收官后转入商业放量：吉林一号在轨超 100 颗（全球最大亚米级商业星座），珠海一号、天仪 SAR 等补齐光学/雷达/高光谱谱系。重访周期从「天级」压缩到「小时级」。',
    benchmark: '对标 Planet（每日全球覆盖）与 Maxar（30 厘米级）：中国商业遥感在星座规模上追平 Planet，最高分辨率与数据服务生态仍有差距；SAR 星座（对标 ICEYE/Capella）正在快速补位。',
    commercial: '数据服务模式跑通：农业估产、环保督察、金融另类数据、应急减灾按订阅收费；出口受数据合规与分辨率管制约束，向「一带一路」输出整星 + 地面站打包方案。',
    strategic: '遥感是「开源情报的工业化」：俄乌战争证明商业星座就是侦察体系的弹性冗余。亚米级 + 小时级重访 + AI 判读 = 战场单向透明的入场券。',
    metrics: [['吉林一号在轨', '100+ 颗'], ['最高分辨率', '亚米级商用'], ['重访周期', '小时级']],
  },
  {
    key: 'rocket', label: '商业航天 / 可回收火箭', accent: '#c41e3a',
    progress: '朱雀二号全球首枚入轨液氧甲烷火箭；朱雀三号、天龙三号、力箭二号等不锈钢/可回收构型 2025-2026 密集首飞，多家完成百米级—十公里级垂直起降回收试验。海南商业发射场两个工位投用，打破发射工位瓶颈。',
    benchmark: '与 SpaceX 存在「代差 + 量差」：猎鹰九号单型年发射 130+ 次、一子级复用 20+ 次，星舰迭代逼近完全复用。中国可回收火箭整体处于猎鹰九号 2015-2017 年阶段，落后约 7-9 年，但追赶斜率陡峭 —— 多家并行试错 + 国家订单托底。',
    commercial: '融资热度全行业最高：商业航天首次写入政府工作报告（2024「新增长引擎」），蓝箭/天兵估值进入独角兽序列；商业发射报价向 5,000 美元/kg 演进，但盈利仍依赖星座组网订单。',
    strategic: '可回收火箭 = 轨道资源的「物流成本革命」。没有低成本高频次发射，万颗级星座只是 ITU 档案里的纸面申报；商业火箭同时是国家航天的弹性产能与战时备份。',
    metrics: [['液氧甲烷入轨', '全球首枚（朱雀二号）'], ['回收试验', '十公里级 VTVL'], ['成本目标', '<5,000 美元/kg']],
  },
  {
    key: 'constellation', label: '卫星互联网（千帆 / GW）', accent: '#e8a317',
    progress: '千帆星座（G60）2024 年首批 18 星入轨，一箭 18 星批产节奏建立；国网（GW）首发星 2024 年底升空。垣信、星网两大主体并行，目标 2030 年前各自完成千颗级组网，手机直连卫星（天通 + 低轨）同步推进。',
    benchmark: '残酷的差距：Starlink 在轨 7,000+ 颗、用户 400 万+、已实现现金流为正；中国低轨通信星合计在轨数百颗，落后约 5-6 年。瓶颈不在卫星制造（已具备年产数百颗能力）而在发射运力 —— 这正是可回收火箭的需求闭环。',
    commercial: '商业模式未验证：国内地面光纤过于发达，低轨刚需在海洋/航空/出海场景；真正的市场是「一带一路」沿线未联网人口与数据主权敏感国家 —— 与 Starlink 的地缘竞争先于商业竞争。',
    strategic: 'ITU 频轨「先登先占 + 七年启用」规则下，申报不发射就是作废。低轨是 6G 星地一体的天基段，也是战时通信的抗毁冗余；Starlink 在俄乌的表现已把低轨星座列入各国军备清单。',
    metrics: [['GW 申报规模', '~12,992 颗'], ['千帆规划', '~15,000 颗'], ['Starlink 在轨', '7,000+ 颗']],
  },
];

// ---------------------------------------------------------------------------
// 图表 option（示意值）
// ---------------------------------------------------------------------------

// 1. 年发射次数中美对比：中国 vs 美国总计 vs 其中 SpaceX
const launchRace = {
  tooltip: { trigger: 'axis' },
  legend: { top: 0, textStyle: { color: '#93a1b5', fontSize: 10 }, itemWidth: 12 },
  grid: { ...GRID, top: 32 },
  xAxis: categoryX(['2016', '2018', '2020', '2021', '2022', '2023', '2024', '2025(E)']),
  yAxis: valueY(),
  series: [
    { name: '中国', type: 'line', smooth: true, symbol: 'circle', symbolSize: 6, data: [22, 39, 39, 55, 64, 67, 68, 90], lineStyle: { color: '#c41e3a', width: 3 }, itemStyle: { color: '#c41e3a' }, areaStyle: { color: 'rgba(196,30,58,0.1)' } },
    { name: '美国（全部）', type: 'line', smooth: true, symbol: 'circle', symbolSize: 6, data: [22, 31, 44, 51, 87, 116, 158, 175], lineStyle: { color: '#e8a317', width: 2 }, itemStyle: { color: '#e8a317' } },
    { name: '其中 SpaceX', type: 'line', smooth: true, symbol: 'circle', symbolSize: 5, data: [8, 21, 26, 31, 61, 98, 138, 155], lineStyle: { color: '#22d3ee', width: 2, type: 'dashed' }, itemStyle: { color: '#22d3ee' } },
  ],
};

// 2. 在轨卫星格局（颗 · 示意）
const orbitalAssets = {
  tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
  grid: { left: 110, right: 40, top: 16, bottom: 24 },
  xAxis: valueY(),
  yAxis: { ...categoryX(['其他国家合计', '中国（全部）', 'Starlink 单星座']), type: 'category', data: ['其他国家合计', '中国（全部）', 'Starlink 单星座'] },
  series: [{
    type: 'bar', barWidth: 22,
    data: [
      { value: 2600, itemStyle: { color: '#93a1b5' } },
      { value: 1000, itemStyle: { color: '#c41e3a' } },
      { value: 7000, itemStyle: { color: '#22d3ee' } },
    ],
    label: { show: true, position: 'right', color: '#93a1b5', fontSize: 10, formatter: '{c} 颗' },
  }],
};

// 3. 航天综合实力雷达（双系列 · 内联）
const powerRadar = {
  legend: { bottom: 0, textStyle: { color: '#93a1b5', fontSize: 10 }, itemWidth: 12 },
  radar: {
    indicator: [
      { name: '运载能力', max: 100 }, { name: '载人航天', max: 100 }, { name: '深空探测', max: 100 },
      { name: '导航星座', max: 100 }, { name: '商业化', max: 100 }, { name: '可复用技术', max: 100 },
    ],
    radius: '62%', axisName: { color: '#93a1b5', fontSize: 10 },
    splitLine: { lineStyle: { color: 'rgba(148,163,184,0.15)' } },
    axisLine: { lineStyle: { color: 'rgba(148,163,184,0.15)' } },
    splitArea: { show: false },
  },
  series: [{ type: 'radar', data: [
    { value: [82, 90, 85, 95, 55, 40], name: '中国', lineStyle: { color: '#c41e3a', width: 2 }, itemStyle: { color: '#c41e3a' }, areaStyle: { color: 'rgba(196,30,58,0.15)' } },
    { value: [98, 92, 95, 92, 98, 98], name: '美国', lineStyle: { color: '#22d3ee', width: 2 }, itemStyle: { color: '#22d3ee' }, areaStyle: { color: 'rgba(34,211,238,0.08)' } },
  ] }],
};

// 4. 北斗产业规模趋势（亿元 · 示意）
const beidouTrend = {
  tooltip: { trigger: 'axis' },
  grid: { left: 56, right: 16, top: 20, bottom: 24 },
  xAxis: categoryX(['2018', '2019', '2020', '2021', '2022', '2023', '2024', '2025(E)']),
  yAxis: valueY(),
  series: [{
    type: 'bar', barWidth: 18,
    data: [3016, 3450, 4033, 4690, 5007, 5362, 5758, 6300],
    itemStyle: { color: '#10b981' },
    label: { show: false },
  }],
};

// 5. 北斗渗透领域 donut
const beidouDonut = donutOpt([
  { value: 52, name: '大众消费（手机/穿戴）', itemStyle: { color: '#10b981' } },
  { value: 16, name: '交通与车联网', itemStyle: { color: '#22d3ee' } },
  { value: 12, name: '测绘与高精度', itemStyle: { color: '#e8a317' } },
  { value: 8, name: '农业与无人机', itemStyle: { color: '#c41e3a' } },
  { value: 7, name: '电力/金融授时', itemStyle: { color: '#8b5cf6' } },
  { value: 5, name: '海事与应急短报文', itemStyle: { color: '#93a1b5' } },
]);

// 6. 商业航天赛道融资结构（亿元 · 示意 · stackedBar）
const trackFunding = stackedBarOpt({
  categories: ['2020', '2021', '2022', '2023', '2024'],
  series: [
    { name: '民营火箭', data: [38, 64, 55, 90, 140], itemStyle: { color: '#c41e3a' } },
    { name: '卫星制造', data: [22, 35, 40, 52, 75], itemStyle: { color: '#22d3ee' } },
    { name: '测控与地面站', data: [8, 12, 15, 18, 26], itemStyle: { color: '#e8a317' } },
    { name: '应用与数据服务', data: [12, 20, 24, 30, 42], itemStyle: { color: '#10b981' } },
  ],
});

// 7. 入轨成本演进（美元/kg · 对数轴）
const costEvolution = {
  tooltip: { trigger: 'axis' },
  grid: { left: 56, right: 16, top: 20, bottom: 24 },
  xAxis: categoryX(['2010', '2015', '2020', '2023', '2025(E)', '2030(E)']),
  yAxis: logY({ axisLabel: { formatter: '${value}' } }),
  series: [
    { name: '中国（主力构型）', type: 'line', smooth: true, symbol: 'circle', symbolSize: 6, data: [20000, 15000, 8000, 6000, 4500, 1500], lineStyle: { color: '#c41e3a', width: 2 }, itemStyle: { color: '#c41e3a' }, areaStyle: { color: 'rgba(196,30,58,0.1)' } },
    { name: 'SpaceX（猎鹰/星舰）', type: 'line', smooth: true, symbol: 'circle', symbolSize: 5, data: [10000, 4000, 2700, 2200, 1500, 200], lineStyle: { color: '#22d3ee', width: 2, type: 'dashed' }, itemStyle: { color: '#22d3ee' } },
  ],
  legend: { top: 0, textStyle: { color: '#93a1b5', fontSize: 10 }, itemWidth: 12 },
};

// 8. 民营火箭主力构型对比（LEO 运力 · 吨 · 示意）
const rocketLineup = {
  tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
  grid: { left: 40, right: 16, top: 20, bottom: 40 },
  xAxis: categoryX(['朱雀三号', '天龙三号', '力箭二号', '引力二号', '猎鹰九号', '星舰(目标)'], { rotate: 25 }),
  yAxis: valueY(),
  series: [{
    type: 'bar', barWidth: 20,
    data: [
      { value: 21, itemStyle: { color: '#c41e3a' } },
      { value: 17, itemStyle: { color: '#c41e3a' } },
      { value: 12, itemStyle: { color: '#c41e3a' } },
      { value: 21, itemStyle: { color: '#c41e3a' } },
      { value: 22, itemStyle: { color: '#22d3ee' } },
      { value: 150, itemStyle: { color: 'rgba(34,211,238,0.45)' } },
    ],
    label: { show: true, position: 'top', color: '#93a1b5', fontSize: 10, formatter: '{c}t' },
  }],
};

// 综合实力雷达旁的单系列雷达：产业链自主度
const supplyChainRadar = radarOpt(
  ['发动机', '箭体结构', '航电', '星载芯片', '地面测控', '发射场'],
  [85, 92, 80, 70, 95, 88],
  { name: '产业链自主度（示意）', color: '#e8a317' },
);

// ---------------------------------------------------------------------------
// 时间线 · 航天之路
// ---------------------------------------------------------------------------
const TIMELINE = [
  { period: '1956-1970', title: '两弹一星', accent: '#93a1b5', desc: '从导弹仿制起步，1970 年东方红一号入轨 —— 在工业基础近乎为零的条件下，以举国体制凿出航天工业的第一块基石。钱学森归国与「国防部五院」是整个体系的原点。' },
  { period: '1992-2005', title: '载人航天三步走', accent: '#22d3ee', desc: '921 工程立项：飞船（神舟五号 2003 杨利伟）→ 出舱与交会对接 → 空间站。三步走战略的纪律性是中国航天最被低估的资产 —— 三十年没有改过路线图。' },
  { period: '2007-2020', title: '北斗组网 / 探月起步', accent: '#10b981', desc: '北斗从区域到全球三步组网，2020 年收官；嫦娥工程「绕落回」逐级推进，2020 嫦娥五号采样返回。两大工程同年闭环，标志国家航天从「跟跑」转入「并跑」。' },
  { period: '2021-2024', title: '空间站建成 / 探火 / 商业元年', accent: '#e8a317', desc: '天宫三舱合体、天问一号火星「绕落巡」一次成功、嫦娥六号月背采样；商业航天写入政府工作报告，朱雀二号液氧甲烷全球首入轨，千帆/GW 星座首批组网星升空。' },
  { period: '2025-2030', title: '可回收火箭 / 载人登月', accent: '#c41e3a', desc: '可回收火箭批量首飞与复飞验证、万颗级星座进入组网快车道、2030 前载人登月 —— 三条线同时收敛。能否把发射成本与频次压到 SpaceX 量级，决定整个轨道资产叙事的成色。' },
];

// ---------------------------------------------------------------------------
// 页面
// ---------------------------------------------------------------------------
export default function Page() {
  const [sectorKey, setSectorKey] = useState('rocket');
  const [stageIdx, setStageIdx] = useState(4);
  const sector = useMemo(() => SECTORS.find((s) => s.key === sectorKey) || SECTORS[0], [sectorKey]);

  return (
    <div>
      <PageHeader badge="Space · 高边疆" title="航天 · 北斗与商业航天" subtitle="发射竞赛 · 轨道资产 · 北斗产业化 · 可回收火箭 —— 太空权力的成本结构与占位规则" />
      <IntroCard>太空竞争的本质是两条曲线的赛跑：每公斤入轨成本的下降曲线，与轨道/频谱资源的耗尽曲线。国家队完成空间站、探月探火与北斗三大主权工程后，竞争重心转向商业航天 —— 可回收火箭决定发射通量，发射通量决定万颗级星座能否在 ITU「先登先占」规则下兑现。SpaceX 一家的发射次数超过其余所有国家之和，这是本模块所有图表的现实底色。</IntroCard>

      {/* 概览 Stat */}
      <Grid cols={4} className="mb-6">
        <Stat value="68 → 90+" label="年发射次数（2024→2025E · 示意）" accent="#c41e3a" />
        <Stat value="~1,000 颗" label="在轨卫星总量（量级）" accent="#22d3ee" />
        <Stat value="1 座" label="在轨空间站（天宫 · 常驻 3 人）" accent="#e8a317" />
        <Stat value="~5,700 亿" label="北斗产业产值（元 · 2024 示意）" accent="#10b981" />
      </Grid>

      {/* ------------------------------------------------------------------ */}
      {/* 板块选择器：六大赛道 */}
      {/* ------------------------------------------------------------------ */}
      <Card title="赛道透视 · 进展 / 对标 / 商业化 / 战略意义" className="mb-6">
        <SelectorBar items={SECTORS} activeKey={sectorKey} onSelect={setSectorKey} />
        <div className="os-card p-5 mb-4" style={{ background: 'var(--bg-elevated)', borderLeft: `3px solid ${sector.accent}` }}>
          <div className="text-sm font-semibold mb-3" style={{ color: sector.accent }}>{sector.label}</div>
          <Grid cols={2}>
            <div>
              <div className="text-xs font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>进展</div>
              <p className="text-xs leading-relaxed mb-3" style={{ color: 'var(--text-secondary)' }}>{sector.progress}</p>
              <div className="text-xs font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>对标（美国 / SpaceX / Starlink）</div>
              <p className="text-xs leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{sector.benchmark}</p>
            </div>
            <div>
              <div className="text-xs font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>商业化</div>
              <p className="text-xs leading-relaxed mb-3" style={{ color: 'var(--text-secondary)' }}>{sector.commercial}</p>
              <div className="text-xs font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>战略意义</div>
              <p className="text-xs leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{sector.strategic}</p>
            </div>
          </Grid>
        </div>
        <Grid cols={3}>
          {sector.metrics.map(([k, v]) => (
            <div key={k} className="text-center">
              <div className="text-base font-bold mono" style={{ color: sector.accent }}>{v}</div>
              <div className="text-[10px] mt-1" style={{ color: 'var(--text-tertiary)' }}>{k}</div>
            </div>
          ))}
        </Grid>
      </Card>

      {/* ------------------------------------------------------------------ */}
      {/* 发射竞赛与轨道资产 */}
      {/* ------------------------------------------------------------------ */}
      <Grid cols={2} className="mb-6">
        <Card title="年发射次数：中国 vs 美国（次 · 示意）">
          <EChart option={launchRace} style={{ height: 260 }} />
          <p className="text-[11px] mt-2 italic" style={{ color: 'var(--text-tertiary)' }}>2022 年起美国曲线被 SpaceX 一家拉开 —— 这不是国家间差距，而是一家公司对全行业的差距。中国 2025E 的 90 次中商业发射占比预计首超三成。</p>
        </Card>
        <Card title="在轨卫星格局（颗 · 示意）：低轨轨道资源竞赛">
          <EChart option={orbitalAssets} style={{ height: 260 }} />
          <p className="text-[11px] mt-2 italic" style={{ color: 'var(--text-tertiary)' }}>Starlink 单星座数量是中国全部在轨卫星的约 7 倍；低轨「黄金壳层」（500-600km）的轨道面正在被实际占有 —— ITU 申报不构成产权，入轨才构成。</p>
        </Card>
      </Grid>

      {/* ------------------------------------------------------------------ */}
      {/* 综合实力雷达 + 产业链自主度 */}
      {/* ------------------------------------------------------------------ */}
      <Grid cols={2} className="mb-6">
        <Card title="航天综合实力对标（示意 · 中国 vs 美国）">
          <EChart option={powerRadar} style={{ height: 300 }} />
          <p className="text-[11px] mt-1 text-center italic" style={{ color: 'var(--text-tertiary)' }}>导航与载人接近持平；商业化与可复用技术是两块最深的洼地，恰好都指向 SpaceX。</p>
        </Card>
        <Card title="航天产业链自主度（示意 · 单系列）">
          <EChart option={supplyChainRadar} style={{ height: 300 }} />
          <p className="text-[11px] mt-1 text-center italic" style={{ color: 'var(--text-tertiary)' }}>测控与发射场是体制内长板；星载宇航级芯片仍有进口暴露面，是制裁情景下的脆弱点。</p>
        </Card>
      </Grid>

      {/* ------------------------------------------------------------------ */}
      {/* 北斗产业化 */}
      {/* ------------------------------------------------------------------ */}
      <Grid cols={2} className="mb-6">
        <Card title="北斗产业总产值（亿元 · 示意）">
          <EChart option={beidouTrend} style={{ height: 240 }} />
          <p className="text-[11px] mt-2 italic" style={{ color: 'var(--text-tertiary)' }}>年均增速约 8-10%，已是商业闭环最完整的国家级航天资产；下一轮增量在「北斗 + 低轨增强」的厘米级实时服务。</p>
        </Card>
        <Card title="北斗应用渗透结构（% · 示意）">
          <EChart option={beidouDonut} style={{ height: 240 }} />
          <p className="text-[11px] mt-2 italic" style={{ color: 'var(--text-tertiary)' }}>大众消费占半壁江山意味着北斗已从「工程」变成「基础设施」；金融授时与电网同步占比小，但属于不可中断的主权刚需。</p>
        </Card>
      </Grid>

      {/* ------------------------------------------------------------------ */}
      {/* 商业航天赛道 */}
      {/* ------------------------------------------------------------------ */}
      <Grid cols={2} className="mb-6">
        <Card title="商业航天融资结构（亿元 · 示意 · 按赛道）">
          <EChart option={trackFunding} style={{ height: 260 }} />
          <p className="text-[11px] mt-2 italic" style={{ color: 'var(--text-tertiary)' }}>民营火箭吸金最多但烧钱也最快 —— 在复飞验证成功前，所有估值都是对「中国版猎鹰九号」的期权定价。</p>
        </Card>
        <Card title="主力火箭 LEO 运力对比（吨 · 示意）">
          <EChart option={rocketLineup} style={{ height: 260 }} />
          <p className="text-[11px] mt-2 italic" style={{ color: 'var(--text-tertiary)' }}>朱雀三号/天龙三号/引力二号在运力纸面参数上对齐猎鹰九号；真正的差距在复飞次数与年发射节奏，而星舰把目标线又抬高了一个数量级。</p>
        </Card>
      </Grid>

      {/* ------------------------------------------------------------------ */}
      {/* 入轨成本：双线对数轴 */}
      {/* ------------------------------------------------------------------ */}
      <Card title="每公斤入轨成本演进（美元/kg · 对数轴 · 示意）" className="mb-6">
        <EChart option={costEvolution} style={{ height: 260 }} />
        <p className="text-[11px] mt-2 italic" style={{ color: 'var(--text-tertiary)' }}>对数轴上两条线的纵向距离就是「成本代差」：当前约 2-3 倍，若星舰达成 200 美元/kg 而国内停留在化学火箭一子级复用，代差将拉大到 7 倍以上 —— 这是所有星座经济模型的分母。</p>
      </Card>

      {/* ------------------------------------------------------------------ */}
      {/* 巨型星座与频轨规则（保留原版块） */}
      {/* ------------------------------------------------------------------ */}
      <Card title="巨型星座与频谱/轨道 · ITU「先登先占」" className="mb-6">
        <p className="text-sm leading-relaxed mb-4" style={{ color: 'var(--text-secondary)' }}>轨道位与无线电频率是「非再生性战略资源」；ITU 规则要求申报后七年内启用、且按节奏完成部署比例，否则档案作废 —— 申报是入场券，发射才是产权。星间链路与地面站布局决定时延与抗毁性。国网（GW）申报约 1.3 万颗，与千帆（G60）合计规划逾 2.5 万颗。</p>
        <Grid cols={3}>
          {[['千帆 (G60)', '长三角产业配套；面向宽带与物联网载荷，与地面 5G/6G 协同。规划：约 1.5 万颗 · 场景：低时延宽带。', '#22d3ee'],
            ['国网 (GW/SatNet)', '国家队星座，强调普遍服务与应急通信；与「一带一路」信息通道联动。规模：约 1.3 万颗 · 对象：国土全域 + 出海。', '#c41e3a'],
            ['遥感星座', '对地观测数据服务农业、环保与防务；分辨率与重访周期竞争白热化。商业：放量 · 出口：数据合规约束。', '#e8a317']].map(([t, d, c]) => (
            <div key={t} style={{ borderLeft: `2px solid ${c}`, paddingLeft: 10 }}><div className="text-xs font-semibold" style={{ color: 'var(--text-primary)' }}>{t}</div><p className="text-[11px] mt-1 leading-relaxed" style={{ color: 'var(--text-tertiary)' }}>{d}</p></div>
          ))}
        </Grid>
      </Card>

      {/* ------------------------------------------------------------------ */}
      {/* 星座能力对比（保留） */}
      {/* ------------------------------------------------------------------ */}
      <Card title="星座能力对比（示意 · 国内星座 2025E vs Starlink）" className="mb-6">
        <Grid cols={5}>
          {[['覆盖', 60, 95], ['时延', 75, 95], ['抗毁', 70, 95], ['成本', 80, 90], ['用户规模', 20, 95]].map(([dim, cn, sl]) => (
            <div key={dim} className="text-center">
              <div className="text-xs font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>{dim}</div>
              <div className="text-lg font-bold mono" style={{ color: '#c41e3a' }}>{cn}</div>
              <div className="text-[10px]" style={{ color: 'var(--text-tertiary)' }}>国内星座</div>
              <div className="text-lg font-bold mono mt-1" style={{ color: '#22d3ee' }}>{sl}</div>
              <div className="text-[10px]" style={{ color: 'var(--text-tertiary)' }}>Starlink</div>
            </div>
          ))}
        </Grid>
        <p className="text-[11px] mt-3 italic" style={{ color: 'var(--text-tertiary)' }}>差距的根因是组网密度，组网密度的根因是发射通量 —— 所有指标最终都收敛到火箭问题。</p>
      </Card>

      {/* ------------------------------------------------------------------ */}
      {/* 北斗主权底座 + 深空叙事（保留并加密） */}
      {/* ------------------------------------------------------------------ */}
      <Grid cols={2} className="mb-6">
        <Card title="北斗导航 · 时空基准底座">
          <p className="text-sm leading-relaxed mb-3" style={{ color: 'var(--text-secondary)' }}>北斗三号全球组网提供独立时空基准，是轨道资产中最早完成商业与主权双闭环的国家星座；短报文与高精度增值服务向交通、电力、金融授时与大众消费渗透。</p>
          <div className="space-y-2">
            <div style={{ borderLeft: '2px solid #c41e3a', paddingLeft: 10 }}><div className="text-xs font-semibold" style={{ color: 'var(--text-primary)' }}>授时与定位主权</div><p className="text-[11px]" style={{ color: 'var(--text-tertiary)' }}>摆脱对 GPS 单一依赖；金融交易撮合、电网相位同步、5G 基站授时的安全自主可控 —— GPS 信号拒止情景下的国家级冗余。</p></div>
            <div style={{ borderLeft: '2px solid #e8a317', paddingLeft: 10 }}><div className="text-xs font-semibold" style={{ color: 'var(--text-primary)' }}>独有短报文</div><p className="text-[11px]" style={{ color: 'var(--text-tertiary)' }}>无地面网络时的双向通信能力（远洋/应急/边远），GPS/Galileo 均不具备；正下沉到大众手机直连。</p></div>
            <div style={{ borderLeft: '2px solid #10b981', paddingLeft: 10 }}><div className="text-xs font-semibold" style={{ color: 'var(--text-primary)' }}>产业外溢</div><p className="text-[11px]" style={{ color: 'var(--text-tertiary)' }}>高精度位置服务与低轨通信星座互补，构成「通导遥」一体化底座；地面增强站随「一带一路」输出。</p></div>
          </div>
        </Card>
        <Card title="深空与月球资源叙事">
          <p className="text-sm leading-relaxed mb-3" style={{ color: 'var(--text-secondary)' }}>月球南极水冰与氦-3 开发仍处探测阶段；工程可行性取决于运载成本与原位资源利用（ISRU）。冷峻判断：2040 年前深空没有生意，只有占位。</p>
          <div className="space-y-2">
            {[['月球科研站 (ILRS)', '2035 年基本型；科研站与资源勘查先行，本质是规则联盟的物理锚点 —— 与 Artemis Accords 形成两套地月秩序方案。'],
              ['水冰 → 推进剂', '若南极水冰可工程化开采，地月转移成本结构将被改写；嫦娥七号/八号的勘查结果是这条期权的定价依据。'],
              ['小行星采矿', '远期期权，受制于运载成本与外空资源法律真空；当前价值是牵引深空测控与自主导航技术。']].map(([t, d]) => (
              <div key={t} style={{ borderLeft: '2px solid #22d3ee', paddingLeft: 10 }}><div className="text-xs font-semibold" style={{ color: 'var(--text-primary)' }}>{t}</div><p className="text-[11px] mt-1" style={{ color: 'var(--text-tertiary)' }}>{d}</p></div>
            ))}
          </div>
        </Card>
      </Grid>

      {/* ------------------------------------------------------------------ */}
      {/* 时间线 · 航天之路 */}
      {/* ------------------------------------------------------------------ */}
      <Card title="航天之路 · 从两弹一星到载人登月" className="mb-6">
        <TimelineBar stages={TIMELINE} activeIdx={stageIdx} onSelect={setStageIdx} />
      </Card>

      {/* ------------------------------------------------------------------ */}
      {/* 研判要点 + 系统观察（保留并扩充） */}
      {/* ------------------------------------------------------------------ */}
      <Card title="研判要点" className="mb-6">
        <Grid cols={3}>
          {[['1 · 轨道与频谱', '「不可再生」战略资源；低轨黄金壳层正被 Starlink 实际占有，国际协调与碰撞规避成本逐年上升。'],
            ['2 · 可复用代差', '与 SpaceX 约 7-9 年的工程差距 + 一个数量级的发射通量差距；复飞验证是 2026-2027 最关键的单点事件。'],
            ['3 · 出口与制裁', '宇航级器件与遥感数据跨境流动面临合规审查；ITAR 体系外的「全自主供应链」既是约束也是出口卖点。'],
            ['4 · 星地一体', '与 6G 标准、手机直连卫星强耦合，牵动运营商与设备商生态；天基段成为通信标准竞争的新前线。'],
            ['5 · 军民融合', '商业火箭与商业星座是国家航天的弹性产能与战时冗余；俄乌战争后低轨星座已进入各国军备序列。'],
            ['6 · 资本节奏', '商业航天估值依赖星座订单与复飞里程碑；若 2027 年前无稳定复飞，赛道将经历一轮出清。']].map(([t, d]) => (
            <div key={t}><div className="text-sm font-semibold" style={{ color: 'var(--china-red)' }}>{t}</div><p className="text-xs mt-1 leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{d}</p></div>
          ))}
        </Grid>
      </Card>

      <Card title="系统观察" className="mb-6">
        <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>太空权力的终局公式很冷：<span className="mono" style={{ color: 'var(--text-primary)' }}>轨道占有量 = 发射通量 × 时间</span>。国家队解决了「能不能上去」（空间站/探月/北斗全部闭环），商业航天要解决「能不能便宜地、每周都上去」。星网建设的本质是物流效率 —— 谁先把每公斤入轨成本压到位，谁就拥有轨道面与频谱的实际占有权；这场竞赛的胜负不在天上，而在火箭工厂的产线节拍与发射场的周转率。北斗证明了中国能用二十年纪律性完成一个主权星座，现在的问题是：能否用七年（ITU 时限）完成一个比北斗大四百倍的。</p>
      </Card>

      <FrameworkTrio cards={[
        { key: 'salt', title: '太空高边疆', subtitle: '轨道与频谱 · 主权资产', body: '轨道位与频谱是不可再生的战略资源：北斗/空间站是主权底牌的轨道延伸，ITU「先登先占」把太空变成一场有截止日期的圈地运动。', pillars: [['北斗', '时空基准自主'], ['空间站', '在轨存在权'], ['频轨', '七年启用时限']] },
        { key: 'stone', title: '可复用差距', subtitle: '成本代差 · 追赶斜率', body: '与 SpaceX 的差距不是单点技术而是「成本 × 频次」的复利：猎鹰九号每复飞一次代差就加深一分。多家民营并行试错 + 国家订单托底，是用体制冗余换追赶斜率。', pillars: [['代差', '约 7-9 年'], ['路径', '液氧甲烷+VTVL'], ['节点', '复飞验证 2026-27']] },
        { key: 'path', title: '军民融合', subtitle: '弹性产能 · 战时冗余', body: '商业航天 = 国家航天的弹性产能：平时卷成本、战时保通量。低轨星座既是 6G 天基段，也是抗毁通信冗余 —— 商业逻辑与国防逻辑在轨道上合流。', pillars: [['产能', '商业发射场扩容'], ['冗余', '低轨抗毁通信'], ['出海', '一带一路星座服务']] },
      ]} />

      <ModuleFooter moduleId="space" disclaimer="公开资料整理 · 发射次数/卫星数量/产值/成本均为量级示意，非精确统计 · 仅供战略分析框架参考，非投资建议" />
    </div>
  );
}
