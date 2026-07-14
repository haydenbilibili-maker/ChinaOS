import React, { useState, useMemo } from 'react';
import { PageHeader, Card, Grid, Stat, StatGrid, OsSparkline } from '../../app/ui.jsx';
import EChart from '../../lib/viz/EChart.jsx';
import { categoryX, valueY, logY, GRID, donutOpt, radarOpt, stackedBarOpt, AXIS, LABEL } from '../shared/chartHelpers.js';
import { IntroCard, SelectorBar, TimelineBar, FrameworkTrio, ModuleFooter } from '../shared/ModuleParadigm.jsx';

/* ============================================================
 * 数据层（示意值 · 见 footer disclaimer）
 * ============================================================ */

// —— 交互① 价值链选择器：六环节的中国地位 / 卡点 / 代表企业 ——
const CHAIN = [
  {
    key: 'oem', label: '整车', accent: '#c41e3a',
    position: '全球最大产销国 · 新能源整车定义权转移中', shareCN: 62, shareLabel: '全球 NEV 整车份额（示意 %）',
    stats: [['3100 万+', '年产销量（辆）'], ['~62%', '全球 NEV 份额'], ['100+', '在售 NEV 品牌'], ['<2 年', '车型迭代周期']],
    choke: '品牌溢价与高端市场认知仍弱于德系豪华；海外渠道与售后网络处于补课期。',
    firms: ['比亚迪', '吉利', '奇瑞', '长安', '理想', '小米汽车'],
    bars: [
      { name: '中国', value: 62, color: '#c41e3a' }, { name: '欧洲', value: 18, color: '#64748b' },
      { name: '北美', value: 12, color: '#22d3ee' }, { name: '其他', value: 8, color: '#8b5cf6' },
    ],
    verdict: '整车不再是「市场换技术」的弱势方——电动平台的定义权第一次握在中国厂商手里，但权力要折算成全球品牌还需十年。',
  },
  {
    key: 'battery', label: '动力电池', accent: '#22d3ee',
    position: '全产业链垄断级优势 · 新能源时代的「石油」', shareCN: 65, shareLabel: '全球动力电池装机份额（示意 %）',
    stats: [['~65%', '全球装机份额'], ['Top10 占 6', '中国企业席位'], ['~90%', '正/负极材料份额'], ['¥0.4/Wh', '电芯成本（示意）']],
    choke: '上游锂钴镍资源对外依存度高；欧美以 IRA / 本地化条款逼迫产能外迁与技术换市场。',
    firms: ['宁德时代', '比亚迪弗迪', '中创新航', '亿纬锂能', '国轩高科', '欣旺达'],
    bars: [
      { name: '宁德时代', value: 37, color: '#22d3ee' }, { name: '比亚迪', value: 16, color: '#c41e3a' },
      { name: '其他中企', value: 12, color: '#e8a317' }, { name: 'LG/三星/SK', value: 20, color: '#64748b' },
      { name: '松下', value: 7, color: '#8b5cf6' }, { name: '其他', value: 8, color: '#fb923c' },
    ],
    verdict: '电池是这场产业战争中中国唯一接近「不可替代」的环节——从矿到回收的全链条控制，议价权类似 1970 年代的 OPEC。',
  },
  {
    key: 'adas', label: '智能驾驶', accent: '#e8a317',
    position: '应用与数据领先 · 底层算力受制', shareCN: 48, shareLabel: '城区 NOA 落地车型份额（示意 %）',
    stats: [['300+ 城', '城区 NOA 开通'], ['~48%', 'NOA 车型中国占比'], ['10 亿+ km', '年智驾数据回传'], ['2-3 家', '端到端第一梯队']],
    choke: '云端训练算力依赖英伟达受限供应；端到端范式下数据闭环与算力成本成为分水岭。',
    firms: ['华为乾崑', 'Momenta', '地平线', '小鹏', '理想', '元戎启行'],
    bars: [
      { name: '华为系', value: 22, color: '#c41e3a' }, { name: '自研车企', value: 26, color: '#e8a317' },
      { name: '第三方方案', value: 18, color: '#22d3ee' }, { name: '特斯拉 FSD', value: 20, color: '#64748b' },
      { name: '其他海外', value: 14, color: '#8b5cf6' },
    ],
    verdict: '智驾上半场拼工程落地中国占优；下半场拼训练算力与数据飞轮——而训练芯片恰好卡在对手手里。',
  },
  {
    key: 'chip', label: '车规芯片', accent: '#8b5cf6',
    position: '低端自给加速 · 高算力 SoC 仍是软肋', shareCN: 15, shareLabel: '车规芯片国产化率（示意 %）',
    stats: [['~15%', '整体国产化率'], ['~8%', '智驾 SoC 国产率'], ['500+ TOPS', '国产旗舰算力'], ['28nm+', '可控成熟制程']],
    choke: '7nm 以下先进制程受出口管制；MCU、功率器件国产替代快，但高算力 SoC 与车规认证周期是双重门槛。',
    firms: ['地平线', '黑芝麻', '华为昇腾', '芯擎科技', '比亚迪半导体', '斯达半导'],
    bars: [
      { name: '功率器件', value: 45, color: '#10b981' }, { name: 'MCU', value: 25, color: '#e8a317' },
      { name: '座舱 SoC', value: 18, color: '#22d3ee' }, { name: '智驾 SoC', value: 8, color: '#c41e3a' },
      { name: '存储/模拟', value: 12, color: '#8b5cf6' },
    ],
    verdict: '车规芯片是整条价值链上唯一中国处于明确守势的环节——SiC 功率器件在反超，智驾大算力 SoC 在补课。',
  },
  {
    key: 'charging', label: '充换电网络', accent: '#10b981',
    position: '全球最大补能基础设施 · 标准输出窗口', shareCN: 70, shareLabel: '全球公共充电桩份额（示意 %）',
    stats: [['1200 万+', '充电桩保有量'], ['~70%', '全球公共桩份额'], ['5 分钟', '兆瓦闪充补能'], ['4000+', '换电站规模']],
    choke: '县乡覆盖与高速节假日峰值仍紧张；海外建桩受电网、标准（CCS/NACS）与地缘审查掣肘。',
    firms: ['国家电网', '特来电', '星星充电', '蔚来能源', '华为数字能源', '南方电网'],
    bars: [
      { name: '中国', value: 70, color: '#10b981' }, { name: '欧洲', value: 16, color: '#64748b' },
      { name: '北美', value: 9, color: '#22d3ee' }, { name: '其他', value: 5, color: '#8b5cf6' },
    ],
    verdict: '补能网络是中国体制优势的具象化：电网国有 + 基建动员能力，让「里程焦虑」在中国先于全球被工程化消灭。',
  },
  {
    key: 'export', label: '出海', accent: '#fb923c',
    position: '出口量全球第一 · 从卖车到输出产能与标准', shareCN: 41, shareLabel: '全球汽车出口份额（示意 %）',
    stats: [['640 万+', '年出口量（辆）'], ['#1', '连续超日本'], ['20+ 座', '海外整车工厂'], ['~30%', 'NEV 占出口比']],
    choke: '欧盟反补贴税（17%–35.3%）、美国 100% 关税与「软件安全」禁令；被迫从出口转向本地建厂与技术授权。',
    firms: ['奇瑞', '上汽 MG', '比亚迪', '长城', '吉利', '宁德时代（产能出海）'],
    bars: [
      { name: '欧洲', value: 28, color: '#c41e3a' }, { name: '东南亚', value: 24, color: '#e8a317' },
      { name: '拉美', value: 18, color: '#10b981' }, { name: '中东非', value: 16, color: '#22d3ee' },
      { name: '俄罗斯/中亚', value: 14, color: '#8b5cf6' },
    ],
    verdict: '出海的真实剧本不是贸易而是产业权力再分配：关税墙逼出的本地建厂，正复制当年日本车企应对美国的路径。',
  },
];

// —— NEV 渗透率曲线（月度口径年化 · 示意）——
const PEN_YEARS = ['2015', '2017', '2019', '2020', '2021', '2022', '2023', '2024', '2025E'];
const PEN_VALUES = [1.4, 2.7, 4.7, 5.4, 13.4, 25.6, 31.6, 47.6, 55];

// —— 全球格局：中国 vs 日本 vs 德国 出口量（万辆 · 示意）——
const EXP_YEARS = ['2019', '2020', '2021', '2022', '2023', '2024', '2025E'];
const EXP_CN = [102, 99, 201, 311, 491, 586, 640];
const EXP_JP = [482, 374, 382, 381, 442, 421, 410];
const EXP_DE = [340, 265, 230, 261, 310, 300, 295];

// —— 比亚迪 vs 特斯拉（全球 NEV 销量 · 万辆 · 示意）——
const BT_YEARS = ['2020', '2021', '2022', '2023', '2024', '2025E'];
const BT_BYD = [19, 60, 186, 302, 427, 500];
const BT_TSLA = [50, 94, 131, 181, 179, 185];

// —— 动力电池全球装机份额（示意 %）——
const BATTERY_DONUT = [
  { value: 37, name: '宁德时代', itemStyle: { color: '#22d3ee' } },
  { value: 16, name: '比亚迪', itemStyle: { color: '#c41e3a' } },
  { value: 12, name: '其他中国企业', itemStyle: { color: '#e8a317' } },
  { value: 13, name: 'LG 新能源', itemStyle: { color: '#64748b' } },
  { value: 7, name: '松下', itemStyle: { color: '#8b5cf6' } },
  { value: 7, name: 'SK On / 三星', itemStyle: { color: '#fb923c' } },
  { value: 8, name: '其他', itemStyle: { color: AXIS.lineStyle.color } },
];

// —— 产业实力雷达：中国 vs 德日传统强国（示意 0-100）——
const RADAR_INDS = ['整车制造', '动力电池', '智能驾驶', '车规芯片', '品牌溢价', '全球渠道'];
const RADAR_CN = [88, 95, 82, 45, 55, 60];
const RADAR_DEJP = [85, 35, 50, 70, 92, 95];

// —— 出海壁垒事件 ——
const BARRIERS = [
  { region: '欧盟', accent: '#e8a317', measure: '反补贴税 17%–35.3%（2024.10 终裁）', response: '匈牙利/西班牙/土耳其建厂；价格承诺谈判' },
  { region: '美国', accent: '#c41e3a', measure: '301 关税 100% + 网联汽车软件禁令', response: '基本放弃直接进入；经墨西哥路径亦被堵' },
  { region: '土耳其/巴西/印度', accent: '#8b5cf6', measure: '附加关税 / 本地化率要求', response: '以投资换市场，CKD 组装先行' },
  { region: '俄罗斯', accent: '#64748b', measure: '2024 起报废税大幅上调', response: '从平行出口转向本地组装' },
];

// —— TimelineBar：换道之路 ——
const PHASES = [
  { period: '1984–2000', title: '市场换技术', accent: '#64748b', desc: '合资模式引入产线却没换来核心技术。三大件（发动机/变速箱/底盘）专利墙下，自主品牌长期困于 10 万元以下市场。' },
  { period: '2001–2014', title: '燃油弯道失败', accent: '#8b5cf6', desc: '逆向开发与低价竞争触顶：燃油动力总成的百年积累无法速成。结论残酷而清晰——在对手的赛道上永远追不上对手。' },
  { period: '2009–2020', title: '新能源国家战略', accent: '#e8a317', desc: '十城千辆 → 补贴退坡 → 双积分制。万亿级补贴换来三电产业链成型；2014 特斯拉开放专利、2019 上海超级工厂引入鲶鱼。' },
  { period: '2021–2024', title: '渗透率反超 · 出口第一', accent: '#c41e3a', desc: '渗透率从 13% 飙到 50%+，燃油车在中国市场进入不可逆衰退；2023 出口超日本登顶全球，合资品牌份额腰斩。' },
  { period: '2025–', title: '智能化下半场', accent: '#22d3ee', desc: '电动化红利见顶，竞争转向端到端智驾、SDV 与生态。价格战出清弱者，行业从百家混战走向 5–8 家寡头格局。' },
];

// —— 渗透率阶段联动注解 ——
const PHASE_NOTES = [
  '此阶段渗透率不足 1%：政策尚未入场，电动车还是高尔夫球车的同义词。',
  '渗透率 1%–3% 间徘徊：燃油赛道的追赶宣告失败，换道成为唯一选项。',
  '渗透率从 1% 爬到 5%：补贴催熟产业链，骗补与洗牌同步发生。',
  '渗透率 13% → 50%+：S 曲线陡升段，燃油替代拐点（2023）被跨越。',
  '渗透率向 60%+ 演进：增量博弈结束，存量绞杀与智能化定生死。',
];

/* ============================================================
 * 组件
 * ============================================================ */

export default function Page() {
  const [chain, setChain] = useState('oem');
  const [phaseIdx, setPhaseIdx] = useState(3);
  const seg = CHAIN.find((x) => x.key === chain) || CHAIN[0];

  // —— 渗透率曲线 + 50% markLine + 拐点 markPoint ——
  const penetrationOpt = useMemo(() => ({
    grid: { left: 44, right: 24, top: 24, bottom: 24 },
    tooltip: { trigger: 'axis', formatter: (p) => `${p[0].name}：${p[0].value}%` },
    xAxis: categoryX(PEN_YEARS),
    yAxis: valueY({ max: 70, axisLabel: { formatter: '{value}%' } }),
    series: [{
      type: 'line', smooth: true, symbol: 'circle', symbolSize: 7,
      data: PEN_VALUES.map((v, i) => ({
        value: v,
        itemStyle: { color: i <= phaseIdx + 3 ? '#c41e3a' : '#3a4a63' },
      })),
      lineStyle: { color: '#c41e3a', width: 2.5 },
      areaStyle: { color: 'rgba(196,30,58,0.12)' },
      markLine: {
        silent: true, symbol: 'none',
        lineStyle: { color: '#22d3ee', type: 'dashed' },
        label: { color: '#22d3ee', fontSize: 10, formatter: '50% 燃油替代拐点' },
        data: [{ yAxis: 50 }],
      },
      markPoint: {
        symbolSize: 44,
        label: { fontSize: 9, color: '#fff' },
        itemStyle: { color: '#e8a317' },
        data: [{ coord: ['2024', 47.6], name: '反超', value: '过半' }],
      },
    }],
  }), [phaseIdx]);

  // —— 渗透率对数视角（增长速率）——
  const penetrationLogOpt = useMemo(() => ({
    grid: { left: 44, right: 24, top: 16, bottom: 24 },
    tooltip: { trigger: 'axis' },
    xAxis: categoryX(PEN_YEARS),
    yAxis: logY({ axisLabel: { formatter: '{value}%' } }),
    series: [{
      type: 'line', smooth: false, symbol: 'diamond', symbolSize: 7,
      data: PEN_VALUES,
      lineStyle: { color: '#22d3ee', width: 2 },
      itemStyle: { color: '#22d3ee' },
    }],
  }), []);

  // —— 三国出口竞赛 ——
  const exportRaceOpt = useMemo(() => ({
    grid: { left: 44, right: 24, top: 32, bottom: 24 },
    tooltip: { trigger: 'axis' },
    legend: { data: ['中国', '日本', '德国'], textStyle: { color: LABEL.color, fontSize: 10 }, top: 0 },
    xAxis: categoryX(EXP_YEARS),
    yAxis: valueY({ name: '万辆', nameTextStyle: { color: LABEL.color, fontSize: 10 } }),
    series: [
      { name: '中国', type: 'line', smooth: true, symbol: 'circle', symbolSize: 6, data: EXP_CN, lineStyle: { color: '#c41e3a', width: 2.5 }, itemStyle: { color: '#c41e3a' }, areaStyle: { color: 'rgba(196,30,58,0.10)' },
        markPoint: { symbolSize: 46, label: { fontSize: 9, color: '#fff' }, itemStyle: { color: '#c41e3a' }, data: [{ coord: ['2023', 491], name: '登顶', value: '超日本' }] } },
      { name: '日本', type: 'line', smooth: true, symbol: 'circle', symbolSize: 5, data: EXP_JP, lineStyle: { color: '#64748b', width: 2 }, itemStyle: { color: '#64748b' } },
      { name: '德国', type: 'line', smooth: true, symbol: 'circle', symbolSize: 5, data: EXP_DE, lineStyle: { color: '#e8a317', width: 2 }, itemStyle: { color: '#e8a317' } },
    ],
  }), []);

  // —— 比亚迪 vs 特斯拉 ——
  const bydTeslaOpt = useMemo(() => ({
    grid: { left: 44, right: 24, top: 32, bottom: 24 },
    tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
    legend: { data: ['比亚迪', '特斯拉'], textStyle: { color: LABEL.color, fontSize: 10 }, top: 0 },
    xAxis: categoryX(BT_YEARS),
    yAxis: valueY({ name: '万辆', nameTextStyle: { color: LABEL.color, fontSize: 10 } }),
    series: [
      { name: '比亚迪', type: 'bar', barWidth: 14, data: BT_BYD, itemStyle: { color: '#c41e3a', borderRadius: [3, 3, 0, 0] } },
      { name: '特斯拉', type: 'bar', barWidth: 14, data: BT_TSLA, itemStyle: { color: '#64748b', borderRadius: [3, 3, 0, 0] } },
    ],
  }), []);

  // —— 电池霸权 donut ——
  const batteryOpt = useMemo(() => donutOpt(BATTERY_DONUT, { center: ['50%', '46%'] }), []);

  // —— 电池材料环节国产份额（stackedBar：中国 vs 海外）——
  const materialOpt = useMemo(() => stackedBarOpt({
    categories: ['正极材料', '负极材料', '电解液', '隔膜', '电芯制造', '锂资源精炼'],
    series: [
      { name: '中国份额', data: [88, 92, 86, 80, 73, 68], itemStyle: { color: '#22d3ee', borderRadius: 0 } },
      { name: '海外份额', data: [12, 8, 14, 20, 27, 32], itemStyle: { color: AXIS.lineStyle.color } },
    ],
    horizontal: true,
  }), []);

  // —— 双系列产业实力雷达（自写内联）——
  const powerRadarOpt = useMemo(() => ({
    tooltip: { trigger: 'item' },
    legend: { data: ['中国', '德日传统强国'], textStyle: { color: LABEL.color, fontSize: 10 }, top: 0 },
    radar: {
      indicator: RADAR_INDS.map((n) => ({ name: n, max: 100 })),
      center: ['50%', '56%'], radius: '62%',
      axisName: { color: LABEL.color, fontSize: 10 },
      splitLine: { lineStyle: { color: AXIS.lineStyle.color } },
      axisLine: { lineStyle: { color: AXIS.lineStyle.color } },
      splitArea: { show: false },
    },
    series: [{
      type: 'radar',
      data: [
        { value: RADAR_CN, name: '中国', lineStyle: { color: '#c41e3a', width: 2 }, itemStyle: { color: '#c41e3a' }, areaStyle: { color: 'rgba(196,30,58,0.14)' } },
        { value: RADAR_DEJP, name: '德日传统强国', lineStyle: { color: '#64748b', width: 2 }, itemStyle: { color: '#64748b' }, areaStyle: { color: 'rgba(100,116,139,0.10)' } },
      ],
    }],
  }), []);

  // —— 价值链环节份额 bar（随选择器切换）——
  const chainBarOpt = useMemo(() => ({
    grid: { left: 76, right: 44, top: 16, bottom: 24 },
    tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
    xAxis: valueY({ max: Math.max(...seg.bars.map((b) => b.value)) + 12, axisLabel: { formatter: '{value}%' } }),
    yAxis: { type: 'category', data: seg.bars.map((b) => b.name).reverse(), axisLine: { lineStyle: { color: AXIS.lineStyle.color } }, axisLabel: { color: LABEL.color, fontSize: 10 } },
    series: [{
      type: 'bar', barWidth: 14,
      data: seg.bars.map((b) => ({ value: b.value, itemStyle: { color: b.color, borderRadius: 3 } })).reverse(),
      label: { show: true, position: 'right', color: LABEL.color, fontSize: 10, formatter: '{c}%' },
    }],
  }), [seg]);

  // —— 价值链六环节中国控制力总览（随选择器高亮）——
  const chainControlOpt = useMemo(() => ({
    grid: { left: 36, right: 16, top: 24, bottom: 42 },
    tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' }, formatter: (p) => `${p[0].name}：中国份额/自给率 ${p[0].value}%` },
    xAxis: categoryX(CHAIN.map((c) => c.label)),
    yAxis: valueY({ max: 100, axisLabel: { formatter: '{value}%' } }),
    series: [{
      type: 'bar', barWidth: 22,
      data: CHAIN.map((c) => ({
        value: c.shareCN,
        itemStyle: { color: c.key === chain ? c.accent : AXIS.lineStyle.color, borderRadius: [4, 4, 0, 0] },
      })),
      label: { show: true, position: 'top', color: LABEL.color, fontSize: 10, formatter: '{c}%' },
      markLine: {
        silent: true, symbol: 'none',
        lineStyle: { color: '#e8a317', type: 'dashed' },
        label: { color: '#e8a317', fontSize: 9, formatter: '50% 控制线' },
        data: [{ yAxis: 50 }],
      },
    }],
  }), [chain]);

  return (
    <div>
      <PageHeader badge="Automotive · Sovereignty" title="汽车主权 · 新能源换道超车" subtitle="价值链 · 渗透率 · 电池霸权 · 出海壁垒 —— 一场以国家为单位的产业权力转移" />

      <IntroCard>
        汽车是工业王冠：上牵钢铁化工、下连芯片软件，养活十分之一的就业。燃油时代中国追了四十年没追上；新能源时代中国直接<strong style={{ color: 'var(--text-primary)' }}>换掉了赛道</strong>——渗透率率先过半、出口量超越日本、动力电池握住六成五的全球份额。这不是单一企业的胜利，而是<strong style={{ color: 'var(--text-primary)' }}>产业权力从底特律—斯图加特—丰田城向长三角—珠三角的系统性转移</strong>。但权力的另一面是反制：关税墙、芯片管制与品牌天花板，决定这场超车的最终高度。
      </IntroCard>

      {/* ====== 概览 Stat ====== */}
      <StatGrid className="mb-6">
        <Stat value="50%+" label="NEV 渗透率（2024 起常态过半）" accent="#c41e3a" />
        <Stat value="640 万+" label="年汽车出口量 · 全球第一" accent="#e8a317" />
        <Stat value="~65%" label="动力电池全球装机份额" accent="#22d3ee" />
        <Stat value="100+" label="在售新能源品牌（出清中）" accent="#8b5cf6" />
      </StatGrid>

      {/* ====== 交互① 价值链选择器 ====== */}
      <Card title="交互① · 价值链权力地图（六环节）" className="mb-6">
        <SelectorBar items={CHAIN} activeKey={chain} onSelect={setChain} />
        <div className="os-card p-4 mb-4" style={{ background: 'var(--bg-elevated)', borderLeft: `3px solid ${seg.accent}` }}>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-sm font-semibold" style={{ color: seg.accent }}>{seg.label}</span>
            <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>{seg.position}</span>
          </div>
          <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{seg.verdict}</p>
        </div>
        <StatGrid className="mb-4">
          {seg.stats.map(([v, l]) => <Stat key={l} value={v} label={l} accent={seg.accent} />)}
        </StatGrid>
        <Grid cols={2} className="mb-4">
          <Card title={seg.shareLabel}>
            <EChart option={chainBarOpt} style={{ height: 230 }} />
          </Card>
          <Card title="六环节中国控制力总览（份额/自给率 · 示意）">
            <EChart option={chainControlOpt} style={{ height: 230 }} />
          </Card>
        </Grid>
        <Grid cols={2}>
          <div className="os-card p-4" style={{ borderLeft: '3px solid #fb923c' }}>
            <div className="text-xs font-semibold mb-1" style={{ color: '#fb923c' }}>卡点 / 反制风险</div>
            <p className="text-xs leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{seg.choke}</p>
          </div>
          <div className="os-card p-4" style={{ borderLeft: `3px solid ${seg.accent}` }}>
            <div className="text-xs font-semibold mb-2" style={{ color: seg.accent }}>代表玩家</div>
            <div className="flex flex-wrap gap-2">
              {seg.firms.map((f) => (
                <span key={f} className="text-xs px-2 py-1 rounded" style={{ background: 'var(--bg-elevated)', color: 'var(--text-secondary)', border: '1px solid var(--border-default)' }}>{f}</span>
              ))}
            </div>
          </div>
        </Grid>
      </Card>

      {/* ====== 交互② 换道之路时间线（联动渗透率曲线）====== */}
      <Card title="交互② · 换道之路 —— 四十年追赶与一次范式转移" className="mb-6">
        <TimelineBar stages={PHASES} activeIdx={phaseIdx} onSelect={setPhaseIdx} />
        <div className="os-card p-4 mb-4" style={{ background: 'var(--bg-elevated)', borderLeft: `3px solid ${PHASES[phaseIdx].accent}` }}>
          <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
            <strong style={{ color: PHASES[phaseIdx].accent }}>{PHASES[phaseIdx].title}</strong> —— {PHASE_NOTES[phaseIdx]}
          </p>
        </div>
        <Grid cols={2}>
          <Card title="NEV 渗透率曲线（% · 50% 替代拐点 markLine）">
            <div className="flex items-center justify-end mb-1">
              <OsSparkline points={PEN_VALUES} color="#c41e3a" width={88} height={22} fill />
            </div>
            <EChart option={penetrationOpt} style={{ height: 250 }} />
          </Card>
          <Card title="对数视角 · 渗透率十年百倍（log 轴）">
            <EChart option={penetrationLogOpt} style={{ height: 250 }} />
          </Card>
        </Grid>
      </Card>

      {/* ====== 全球市场格局 ====== */}
      <Card title="全球格局 · 出口登顶与头部对决" className="mb-6">
        <Grid cols={2}>
          <Card title="汽车出口三国竞赛（万辆 · 2023 超日本）">
            <EChart option={exportRaceOpt} style={{ height: 260 }} />
          </Card>
          <Card title="比亚迪 vs 特斯拉 · 全球 NEV 销量（万辆）">
            <EChart option={bydTeslaOpt} style={{ height: 260 }} />
          </Card>
        </Grid>
        <p className="text-xs mt-3 leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
          注：出口登顶包含俄罗斯市场的一次性窗口与燃油车份额；真正的结构性变量是 NEV 出口占比持续抬升。比亚迪与特斯拉的剪刀差，本质是「全价格带垂直整合」对「单品爆款」的范式碾压——但特斯拉的利润率与 FSD 期权仍未被定价进这张销量图。
        </p>
      </Card>

      {/* ====== 电池霸权 ====== */}
      <Card title="动力电池霸权 · 新能源时代的「石油」" className="mb-6">
        <Grid cols={2}>
          <Card title="全球动力电池装机份额（中国系合计 ~65%）">
            <EChart option={batteryOpt} style={{ height: 260 }} />
          </Card>
          <Card title="电池材料链中国份额（% · 全环节过半）">
            <EChart option={materialOpt} style={{ height: 260 }} />
          </Card>
        </Grid>
        <p className="text-xs mt-3 leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
          从锂矿精炼到正负极、隔膜、电解液、电芯再到回收，中国是全球唯一闭环的电池工业体。欧美的应对——IRA 补贴、欧盟电池护照、强制本地化——本质是承认：在电化学这条赛道上，脱钩的成本高到只能选择「管制下的依赖」。
        </p>
      </Card>

      {/* ====== 产业实力雷达 ====== */}
      <Card title="产业实力对比 · 中国 vs 德日传统强国（示意评分）" className="mb-6">
        <Grid cols={2}>
          <Card title="六维实力雷达">
            <EChart option={powerRadarOpt} style={{ height: 280 }} />
          </Card>
          <div className="os-card p-5">
            <div className="text-sm font-semibold mb-3" style={{ color: 'var(--china-red)' }}>雷达解读 · 强弱项的权力含义</div>
            {[
              ['动力电池 95 vs 35', '最大代差所在。德日押注氢能与固态的「下一局」，但当下这一局已经输了。', '#22d3ee'],
              ['品牌溢价 55 vs 92', '保时捷一辆车的利润≈自主品牌十辆。品牌是用几十年时间和赛道历史买的，无法靠补贴速成。', '#e8a317'],
              ['车规芯片 45 vs 70', '德日同样不掌握先进制程，但其供应链不受出口管制——这是「短板」与「软肋」的区别。', '#8b5cf6'],
              ['全球渠道 60 vs 95', '丰田在 170 个国家有半个世纪的经销与售后网络。这是中国车企出海真正要翻越的山。', '#fb923c'],
            ].map(([t, d, c]) => (
              <div key={t} className="mb-3">
                <div className="text-xs font-semibold" style={{ color: c }}>{t}</div>
                <p className="text-xs mt-0.5 leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{d}</p>
              </div>
            ))}
          </div>
        </Grid>
      </Card>

      {/* ====== 出海与壁垒 ====== */}
      <Card title="出海与壁垒 · 关税墙下的产能再布局" className="mb-6">
        <Grid cols={2} className="mb-4">
          {BARRIERS.map((b) => (
            <div key={b.region} className="os-card p-4" style={{ borderLeft: `3px solid ${b.accent}` }}>
              <div className="text-sm font-semibold mb-1" style={{ color: b.accent }}>{b.region}</div>
              <p className="text-xs leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                <strong style={{ color: 'var(--text-primary)' }}>壁垒：</strong>{b.measure}
              </p>
              <p className="text-xs leading-relaxed mt-1" style={{ color: 'var(--text-secondary)' }}>
                <strong style={{ color: 'var(--text-primary)' }}>应对：</strong>{b.response}
              </p>
            </div>
          ))}
        </Grid>
        <p className="text-xs leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
          冷峻的事实：每一道关税墙都在重演 1980 年代美日汽车摩擦的剧本——出口受阻 → 本地建厂 → 技术与就业落地 → 政治压力缓释。区别在于这次叠加了地缘安全叙事：网联汽车被定义为「带轮子的数据终端」，使汽车出海第一次与数据主权、国家安全审查直接绑定。
        </p>
      </Card>

      {/* ====== FrameworkTrio ====== */}
      <FrameworkTrio cards={[
        {
          title: '换道超车', subtitle: '范式转移而非追赶',
          body: '燃油三大件的百年专利墙追不动，就把竞争重新定义为三电与软件——让对手的护城河一夜之间变成沉没成本。',
          pillars: [['赛道重置', '发动机积累归零，电池积累称王。'], ['国家意志', '十五年补贴 + 双积分逼出产业链。'], ['鲶鱼引入', '特斯拉国产化倒逼全链条升级。']],
        },
        {
          title: '电池即石油', subtitle: '能源权力的载体更替',
          body: '动力电池之于电动时代，等于石油之于内燃机时代——谁控制电化学产业链，谁就握有新能源时代的能源定价权。',
          pillars: [['全链闭环', '矿—材料—电芯—回收唯一闭环国。'], ['成本霸权', '规模效应使海外自建成本高 30%+。'], ['标准输出', '产能出海附带中国技术标准。']],
        },
        {
          title: '智能化下半场', subtitle: '电动化只是入场券',
          body: '上半场（电动化）胜负已分，下半场（智能化）开局未定：端到端智驾、舱驾一体与 AI 生态决定终局座次——而算力卡点恰在此处。',
          pillars: [['数据飞轮', '亿级公里回传 vs 训练算力受限。'], ['寡头出清', '价格战淘汰赛 → 5–8 家终局。'], ['生态决战', '车从交通工具变 AI 终端入口。']],
        },
      ]} />

      {/* ====== 研判要点 ====== */}
      <Card title="研判要点 · 冷峻清单" className="mb-6">
        <Grid cols={3}>
          {[
            ['1 · 渗透率过半 ≠ 战争结束', '燃油替代是确定性，但行业利润率被价格战压到历史低位——赢了赛道，还没赢到钱。'],
            ['2 · 电池是唯一的「王牌」', '六环节中只有电池接近不可替代；整车与智驾的优势是领先身位，不是结构性垄断。'],
            ['3 · 芯片是唯一的「死穴」', '智驾 SoC 与训练算力双卡点：管制收紧一档，智能化下半场的节奏就慢一拍。'],
            ['4 · 关税墙倒逼产能出海', '出口数字会见顶，海外本地化产量将接棒——统计口径的「出口第一」让位于「海外产能版图」。'],
            ['5 · 品牌是十年期作业', '份额可以靠性价比速取，溢价必须靠时间沉淀；高端化失败则利润永远留在德系手里。'],
            ['6 · 出清即国运的缩影', '百余品牌终局只剩个位数；出清的烈度与秩序，检验的是产业政策退出的成熟度。'],
          ].map(([t, d]) => (
            <div key={t} className="mb-2">
              <div className="text-sm font-semibold" style={{ color: 'var(--china-red)' }}>{t}</div>
              <p className="text-xs mt-1 leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{d}</p>
            </div>
          ))}
        </Grid>
      </Card>

      <ModuleFooter moduleId="automotive" disclaimer="本页份额/销量/评分均为公开资料整理后的示意值，非官方统计；评分为分析框架性主观赋值，仅供研究参考，非投资建议" sourceNote="由 tabs/automotive.html 迁移并扩容" />
    </div>
  );
}
