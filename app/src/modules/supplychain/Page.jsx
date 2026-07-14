import React, { useState, useMemo } from 'react';
import { PageHeader, Card, Grid, Stat, StatGrid } from '../../app/ui.jsx';
import EChart from '../../lib/viz/EChart.jsx';
import { categoryX, valueY, logY, GRID, donutOpt, radarOpt, stackedBarOpt, AXIS, LABEL } from '../shared/chartHelpers.js';
import { IntroCard, SelectorBar, TimelineBar, FrameworkTrio, ModuleFooter } from '../shared/ModuleParadigm.jsx';

// ============================================================================
// 一、链路档案：六大关键链路（中国位置 / 断点 / 备份 / 对手出招）· 示意
// ============================================================================
const CHAINS = [
  {
    key: 'elec', label: '电子信息链', accent: '#22d3ee',
    position: '全球电子组装与中游元器件的绝对枢纽：手机/PC/服务器整机产能占全球过半，PCB、被动元件、显示面板份额领先；但最上游芯片设计工具与先进制程设备受制于人。',
    stats: [['整机组装份额', '~55%', '#22d3ee'], ['中游元器件', '~45%', '#10b981'], ['先进芯片自给', '<15%', '#c41e3a'], ['断链冲击度', '极高', '#c41e3a']],
    breakpoints: [
      ['EUV/先进制程设备', 95, '#c41e3a'],
      ['EDA 全流程工具', 82, '#c41e3a'],
      ['高端芯片（GPU/HBM）', 78, '#e8a317'],
      ['半导体材料（光刻胶等）', 65, '#e8a317'],
      ['成熟制程产能', 30, '#10b981'],
    ],
    backup: '成熟制程极限扩产 + Chiplet/先进封装绕道 + 国产设备「全国产线」验证；以规模与成本优势守住中低端，换取先进端爬坡时间。',
    rival: '美方出招：出口管制清单逐年加码、对盟友设备商施压（ASML/东京电子）、补贴本土建厂（CHIPS 法案）；目标是把中国锁死在 N-2 代以外。',
  },
  {
    key: 'auto', label: '汽车链', accent: '#10b981',
    position: '电动化窗口期完成链位跃迁：从「市场换技术」的下游装配，跃升为电池-电机-电控全链主导者；动力电池全球份额过六成，整车出口跃居世界第一。',
    stats: [['动力电池份额', '~62%', '#10b981'], ['整车出口', '世界第一', '#22d3ee'], ['车规芯片自给', '~10%', '#c41e3a'], ['断链冲击度', '中高', '#e8a317']],
    breakpoints: [
      ['车规级芯片（MCU）', 80, '#c41e3a'],
      ['高端轴承/精密件', 60, '#e8a317'],
      ['车载操作系统生态', 55, '#e8a317'],
      ['电池正负极材料', 20, '#10b981'],
      ['电机电控', 15, '#10b981'],
    ],
    backup: '电池链已形成「中国为中心、海外建厂为卫星」格局；车规芯片走成熟制程国产化 + 整车厂自研双轨；欧洲关税倒逼本地化建厂（匈牙利/西班牙）。',
    rival: '欧美出招：欧盟反补贴关税、美国 IRA 排除中国电池供应链、要求「去中国化」原料溯源；以市场准入为筹码逼迫技术转移与本地建厂。',
  },
  {
    key: 'pharma', label: '医药原料链', accent: '#e8a317',
    position: '全球原料药（API）与关键中间体的隐形链主：抗生素、维生素、解热镇痛类原料全球份额 60-90%；但创新药专利、高端制剂与生物药设备依赖欧美。',
    stats: [['大宗原料药份额', '60-90%', '#e8a317'], ['维生素类', '~80%', '#10b981'], ['创新药管线', '追赶中', '#22d3ee'], ['断链冲击度', '双向', '#a78bfa']],
    breakpoints: [
      ['生物药生产设备/耗材', 75, '#c41e3a'],
      ['创新药专利分子', 70, '#e8a317'],
      ['高端制剂技术', 55, '#e8a317'],
      ['大宗原料药', 10, '#10b981'],
      ['中间体产能', 8, '#10b981'],
    ],
    backup: '原料药是中国手中为数不多的「反向人质」——美欧仿制药体系离开中国 API 数月即休克；备份方向是向制剂与生物类似药上移，对冲 BIOSECURE 法案式脱钩。',
    rival: '美方出招：BIOSECURE 法案点名中国 CXO、激励 API 回流（印度 PLI 计划承接）；但成本与环保约束使回流进度远慢于立法节奏。',
  },
  {
    key: 'mineral', label: '关键矿产链', accent: '#c41e3a',
    position: '链权力最不对称的一环：稀土冶炼分离 ~90%、镓锗 ~80%、石墨 ~70%、锂钴镍精炼过半——上游矿藏未必在华，但「炼」的环节高度集中于中国。',
    stats: [['稀土冶炼分离', '~90%', '#c41e3a'], ['镓/锗精炼', '~80%', '#e8a317'], ['锂精炼', '~65%', '#10b981'], ['断链冲击度', '反制王牌', '#c41e3a']],
    breakpoints: [
      ['高端矿用装备', 45, '#e8a317'],
      ['海外矿权保障', 40, '#e8a317'],
      ['部分稀缺矿源（铌/铂族）', 70, '#c41e3a'],
      ['冶炼分离技术', 5, '#10b981'],
      ['磁材深加工', 8, '#10b981'],
    ],
    backup: '出口管制工具箱化（镓锗锑石墨稀土逐项立法）+ 海外矿权布局（非洲/南美）+ 国家储备收放调节；「炼」的环节技术与环保壁垒构成十年级护城河。',
    rival: '美澳出招：MP Materials/Lynas 重建链条、矿产安全伙伴关系（MSP）拉盟友圈、五角大楼直接入股磁材厂；但冶炼环节重建成本高、周期以十年计。',
  },
  {
    key: 'grain', label: '粮食链', accent: '#a78bfa',
    position: '主粮（稻麦）基本自给、口粮绝对安全；但大豆 ~85% 依赖进口（巴西/美国/阿根廷），饲料蛋白是最大软肋——粮食安全的真实命门在豆粕与种源。',
    stats: [['口粮自给率', '>95%', '#10b981'], ['大豆对外依存', '~85%', '#c41e3a'], ['种业自主化', '推进中', '#e8a317'], ['断链冲击度', '中等', '#e8a317']],
    breakpoints: [
      ['大豆/饲料蛋白', 85, '#c41e3a'],
      ['高端种源（白羽鸡等）', 60, '#e8a317'],
      ['部分农机核心件', 45, '#e8a317'],
      ['化肥产能', 15, '#10b981'],
      ['主粮产能', 5, '#10b981'],
    ],
    backup: '进口多元化（巴西替代美豆已成主轴）+ 国家粮储体系（储备量全球之最）+ 种业振兴行动 + 豆粕减量替代；用储备深度换冲击缓冲时间。',
    rival: '美方筹码弱化：中美贸易战期间大豆武器化反而加速巴西替代；粮食链是中国「去美国化」最成功的一条链。',
  },
  {
    key: 'logistics', label: '航运物流链', accent: '#f97316',
    position: '全球造船 ~50%、集装箱产量 ~95%、港口吞吐前十占七席、岸桥设备 ~80%——物流硬件的链主；但海运保险、结算、海峡通道控制权仍在英美体系手中。',
    stats: [['造船完工量', '~50%', '#10b981'], ['集装箱产量', '~95%', '#22d3ee'], ['马六甲依赖', '油运 ~80%', '#c41e3a'], ['断链冲击度', '高', '#e8a317']],
    breakpoints: [
      ['海峡通道（马六甲/霍尔木兹）', 80, '#c41e3a'],
      ['海运保险/结算体系', 70, '#e8a317'],
      ['高端船用发动机', 50, '#e8a317'],
      ['港口运营网络', 20, '#10b981'],
      ['造船产能', 8, '#10b981'],
    ],
    backup: '中欧班列 + 北极航线试探 + 瓜达尔/皮雷埃夫斯等海外港口节点 + 国产大型 LNG 船突破；通道冗余是军事级备份，平时不经济、战时定生死。',
    rival: '美方出招：301 调查针对中国造船、对中资港口节点施压（巴拿马运河两端）、USTR 拟对中国建造船舶收港口费；把物流硬件优势政治化。',
  },
];

// ============================================================================
// 二、「中国+1」转移监测：制造份额多线（示意 %）
// ============================================================================
const plusOneYears = ['2018', '2019', '2020', '2021', '2022', '2023', '2024', '2025E'];
const plusOneOpt = {
  tooltip: { trigger: 'axis' },
  legend: { top: 0, textStyle: { color: LABEL.color, fontSize: 10 }, itemWidth: 12, itemHeight: 8 },
  grid: { left: 40, right: 16, top: 30, bottom: 24 },
  xAxis: categoryX(plusOneYears),
  yAxis: valueY({ axisLabel: { formatter: '{value}%' } }),
  series: [
    { name: '中国（全球制造份额）', type: 'line', smooth: true, symbol: 'circle', symbolSize: 5, data: [28.5, 28.8, 29.8, 30.2, 30.5, 30.2, 29.8, 29.5], lineStyle: { color: '#c41e3a', width: 3 }, itemStyle: { color: '#c41e3a' }, areaStyle: { color: 'rgba(196,30,58,0.07)' } },
    { name: '越南', type: 'line', smooth: true, symbol: 'circle', symbolSize: 4, data: [0.6, 0.7, 0.8, 0.9, 1.1, 1.2, 1.3, 1.4], lineStyle: { color: '#22d3ee', width: 2 }, itemStyle: { color: '#22d3ee' } },
    { name: '印度', type: 'line', smooth: true, symbol: 'circle', symbolSize: 4, data: [3.0, 3.0, 2.9, 3.1, 3.2, 3.3, 3.5, 3.7], lineStyle: { color: '#e8a317', width: 2 }, itemStyle: { color: '#e8a317' } },
    { name: '墨西哥', type: 'line', smooth: true, symbol: 'circle', symbolSize: 4, data: [1.5, 1.5, 1.4, 1.5, 1.6, 1.7, 1.7, 1.8], lineStyle: { color: '#10b981', width: 2 }, itemStyle: { color: '#10b981' } },
  ],
};

// ============================================================================
// 三、断链情景压力测试：断供冲击度（示意指数 · 分档着色）
// ============================================================================
const stressOpt = {
  tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' }, formatter: '{b}: 冲击指数 {c}' },
  grid: { left: 110, right: 44, top: 16, bottom: 24 },
  xAxis: valueY({ max: 100 }),
  yAxis: { type: 'category', data: ['航运通道封锁', '大豆全面断供', '关键矿产反制(对美)', '原料药断供(对美)', '高端芯片全面断供'], axisLine: { lineStyle: { color: AXIS.lineStyle.color } }, axisLabel: { color: LABEL.color, fontSize: 11 } },
  series: [{
    type: 'bar', barWidth: 16, itemStyle: { borderRadius: 3 },
    label: { show: true, position: 'right', color: LABEL.color, fontSize: 10 },
    data: [
      { value: 88, itemStyle: { color: '#c41e3a' } },
      { value: 62, itemStyle: { color: '#e8a317' } },
      { value: 75, itemStyle: { color: '#a78bfa' } },
      { value: 70, itemStyle: { color: '#a78bfa' } },
      { value: 92, itemStyle: { color: '#c41e3a' } },
    ],
  }],
};

// ============================================================================
// 四、供应链韧性雷达：中国 vs 美国（双系列 · 内联 option）
// ============================================================================
const resilienceRadarOpt = {
  legend: { top: 0, textStyle: { color: LABEL.color, fontSize: 10 }, itemWidth: 12, itemHeight: 8, data: ['中国', '美国'] },
  radar: {
    indicator: [
      { name: '采购多元化', max: 100 }, { name: '库存冗余', max: 100 }, { name: '国产备份深度', max: 100 },
      { name: '物流通道冗余', max: 100 }, { name: '盟友网络可用度', max: 100 }, { name: '数字可视化', max: 100 },
    ],
    radius: '62%',
    axisName: { color: LABEL.color, fontSize: 10 },
    splitLine: { lineStyle: { color: 'rgba(148,163,184,0.15)' } },
    axisLine: { lineStyle: { color: 'rgba(148,163,184,0.15)' } },
    splitArea: { show: false },
  },
  series: [{
    type: 'radar',
    data: [
      { value: [68, 82, 70, 55, 35, 75], name: '中国', lineStyle: { color: '#c41e3a', width: 2 }, itemStyle: { color: '#c41e3a' }, areaStyle: { color: 'rgba(196,30,58,0.12)' } },
      { value: [72, 50, 45, 78, 90, 80], name: '美国', lineStyle: { color: '#22d3ee', width: 2 }, itemStyle: { color: '#22d3ee' }, areaStyle: { color: 'rgba(34,211,238,0.10)' } },
    ],
  }],
};

// ============================================================================
// 五、在华供应链黏性：不可替代性 bar（示意指数）
// ============================================================================
const stickinessOpt = {
  tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
  grid: { left: 100, right: 44, top: 16, bottom: 24 },
  xAxis: valueY({ max: 100 }),
  yAxis: { type: 'category', data: ['汇率/政策稳定性', '内需市场就近', '响应速度(打样-量产)', '工程师红利', '基础设施密度', '产业集群完整度'], axisLine: { lineStyle: { color: AXIS.lineStyle.color } }, axisLabel: { color: LABEL.color, fontSize: 11 } },
  series: [{
    type: 'bar', barWidth: 14, itemStyle: { borderRadius: 3 },
    label: { show: true, position: 'right', color: LABEL.color, fontSize: 10 },
    data: [
      { value: 60, itemStyle: { color: '#e8a317' } },
      { value: 78, itemStyle: { color: '#10b981' } },
      { value: 88, itemStyle: { color: '#10b981' } },
      { value: 82, itemStyle: { color: '#10b981' } },
      { value: 90, itemStyle: { color: '#22d3ee' } },
      { value: 92, itemStyle: { color: '#22d3ee' } },
    ],
  }],
};

// ============================================================================
// 六、原有图表：供给依存 / 卡脖子 / 韧性爬坡（保留）
// ============================================================================
const supplyRiskBar = stackedBarOpt({
  categories: ['半导体/装备', '稀土/材料', '医药', '汽车电子', '化工', '能源装备'],
  horizontal: true,
  series: [
    { name: '国内供给', data: [45, 72, 88, 38, 35, 62], itemStyle: { color: '#10b981', borderRadius: [3, 0, 0, 3] } },
    { name: '进口依存', data: [55, 28, 12, 62, 65, 38], itemStyle: { color: '#e8a317', borderRadius: [0, 3, 3, 0] } },
  ],
});
const chokeBar = {
  grid: { left: 90, right: 40, top: 16, bottom: 24 },
  xAxis: valueY({ max: 100 }),
  yAxis: { type: 'category', data: ['成熟制程产能', '特种材料', '工业软件', 'EDA 全流程', 'EUV 光刻机'], axisLine: { lineStyle: { color: AXIS.lineStyle.color } }, axisLabel: { color: LABEL.color, fontSize: 11 } },
  series: [{ type: 'bar', data: [
    { value: 45, itemStyle: { color: '#10b981' } },
    { value: 70, itemStyle: { color: '#e8a317' } },
    { value: 75, itemStyle: { color: '#e8a317' } },
    { value: 82, itemStyle: { color: '#e8a317' } },
    { value: 95, itemStyle: { color: '#c41e3a' } },
  ], barWidth: 14, itemStyle: { borderRadius: 3 }, label: { show: true, position: 'right', color: LABEL.color, fontSize: 10 } }],
};
const resilienceLine = {
  grid: { left: 44, right: 16, top: 28, bottom: 24 },
  legend: { top: 0, textStyle: { color: LABEL.color, fontSize: 11 }, itemWidth: 12, itemHeight: 8 },
  xAxis: categoryX(['2020', '2021', '2022', '2023', '2024', '2025(E)']),
  yAxis: valueY({ max: 100 }),
  series: [
    { name: '国产替代指数', type: 'line', smooth: true, symbol: 'circle', symbolSize: 5, data: [38, 44, 52, 58, 64, 70], lineStyle: { color: '#c41e3a', width: 2 }, itemStyle: { color: '#c41e3a' }, areaStyle: { color: 'rgba(196,30,58,0.08)' } },
    { name: '多元采购覆盖', type: 'line', smooth: true, symbol: 'circle', symbolSize: 5, data: [30, 38, 50, 60, 68, 74], lineStyle: { color: '#22d3ee', width: 2 }, itemStyle: { color: '#22d3ee' } },
  ],
};

// ============================================================================
// 七、策略选择器（保留扩写）
// ============================================================================
const STRATEGIES = [
  { key: 'stock', label: '库存冗余', accent: '#e8a317', desc: '战略储备 + 安全库存拉长周转天数，换取极端情景下的可启动性——韧性税的物理形态。原油/粮食/铜钴锂的国家储备是「时间银行」：断供不可怕，可怕的是没有缓冲期内的反应能力。' },
  { key: 'friend', label: '友岸外包', accent: '#22d3ee', desc: '在合规框架下分散采购国别，降低单一司法辖区的断供概率。但中国版「友岸」名单短于美国版——真正可托付的法域有限，故更多表现为「多岸」而非「友岸」：巴西大豆、俄国能源、中亚矿产、东盟中转。' },
  { key: 'local', label: '国产替代', accent: '#10b981', desc: '成熟制程与材料端先行，先进制程依赖研发摊销与生态迁移——举国体制 + 市场订单双轮。替代的真实门槛不在「造得出」而在「用得起、敢于用」：良率、成本、生态三关，缺一不可。' },
];

// ============================================================================
// 八、链权演进时间线（TimelineBar）
// ============================================================================
const TIMELINE = [
  { period: '2001-2017', title: '世界工厂成型', accent: '#10b981', desc: '入世后以成本与规模优势吸纳全球产能转移，形成「集群引力」：珠三角电子、长三角装备、华北化工。这一阶段供应链是纯经济议题，效率是唯一标尺——没有人讨论「韧性」。' },
  { period: '2018-2019', title: '贸易战关税冲击', accent: '#e8a317', desc: '301 关税首次把供应链政治化。中兴/华为事件暴露「芯片人质」结构；「中国+1」从企业避险口号变为董事会议题。大豆武器化反向教育了中国：对手会用，自己也要会用。' },
  { period: '2020-2021', title: '疫情断链警示', accent: '#22d3ee', desc: '全球断链反而凸显中国产能的不可替代性——率先复工承接了订单回流，制造份额不降反升。但口罩/呼吸机的全球争夺也让各国意识到：关键物资的产地集中即战略脆弱。' },
  { period: '2022-2024', title: '去风险/友岸外包', accent: '#a78bfa', desc: '俄乌战争 + 芯片法案 + 对华管制升级，「De-risking」取代「Decoupling」成为西方官方话语。转移真实发生但低于预期：越南/墨西哥承接的多为末端组装，中间品仍从中国进口——「转移」很大程度上是「绕道」。' },
  { period: '2024-至今', title: '双循环 + 链主备份体系', accent: '#c41e3a', desc: '中国转入体系化应对：链长制逐链建档、出口管制工具箱化（镓锗锑稀土）、备份系统「极端情景可启动」标准化。供应链从经济议题完成向安全议题的范式转换——链权力进入双向威慑均势期。' },
];

// ============================================================================
// 九、断链清单 / 友岸权衡（静态数据）
// ============================================================================
const chokeList = [
  ['EUV 光刻机', '极高', '#c41e3a'],
  ['EDA 全流程', '高', '#e8a317'],
  ['成熟制程产能', '中等', '#10b981'],
];

const TRADEOFF = [
  { t: '成本侧 · 韧性税', c: '#e8a317', d: '友岸/近岸产能的单位成本普遍高于中国 15-40%（示意）：墨西哥人工 + 治安成本、越南基建与电力瓶颈、印度营商摩擦。重复建设的资本开支最终由消费者与股东分摊——通胀的供应链成分。' },
  { t: '收益侧 · 断供期权', c: '#22d3ee', d: '多元化买的不是日常效率，是极端情景下的「可启动性」期权。期权平时一直在付费（库存、双供应商、认证成本），只在断链发生的那一刻兑现——而决策者永远无法事前证明这笔保费是否值得。' },
  { t: '现实解 · 中国+1 ≠ 中国-1', c: '#10b981', d: '多数跨国企业的真实选择是「在中国为中国、在外为西方」的双轨制：中国产能服务中国与非美市场，新产能服务美欧合规市场。结果不是中国份额坍塌，而是全球供应链总成本系统性抬升。' },
];

// ============================================================================
// 页面
// ============================================================================
export default function Page() {
  const [chainKey, setChainKey] = useState('elec');
  const [stratKey, setStratKey] = useState('local');
  const [stageIdx, setStageIdx] = useState(4);
  const chain = CHAINS.find((c) => c.key === chainKey) || CHAINS[0];
  const strat = STRATEGIES.find((s) => s.key === stratKey) || STRATEGIES[2];

  // 当前链路断点风险 bar（随选择器切换）
  const chainBreakOpt = useMemo(() => ({
    tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' }, formatter: '{b}: 受制指数 {c}' },
    grid: { left: 140, right: 40, top: 12, bottom: 24 },
    xAxis: valueY({ max: 100 }),
    yAxis: {
      type: 'category',
      data: chain.breakpoints.map((b) => b[0]).reverse(),
      axisLine: { lineStyle: { color: AXIS.lineStyle.color } },
      axisLabel: { color: LABEL.color, fontSize: 10 },
    },
    series: [{
      type: 'bar', barWidth: 13, itemStyle: { borderRadius: 3 },
      label: { show: true, position: 'right', color: LABEL.color, fontSize: 10 },
      data: chain.breakpoints.map((b) => ({ value: b[1], itemStyle: { color: b[2] } })).reverse(),
    }],
  }), [chainKey]);

  return (
    <div>
      <PageHeader badge="Supply Chain · 链权力" title="产业链备份 · 库存韧性 · 链权博弈" subtitle="供应链 = 和平时期的威慑武器 —— 中国位置 · 断点风险 · 备份体系 · 黏性拉锯" />
      <IntroCard>
        供应链已从效率议题变成<strong style={{ color: 'var(--china-red)' }}>权力议题</strong>：谁控制断点，谁就握有和平时期的威慑筹码。中国的应对是三层叠加——<strong style={{ color: '#10b981' }}>国产替代</strong>（终局解）、<strong style={{ color: '#e8a317' }}>库存冗余</strong>（时间银行）、<strong style={{ color: '#22d3ee' }}>通道多元</strong>（空间分散）；同时把自身链主地位（稀土/原料药/造船）工具箱化为反向威慑。冗余是新效率，黏性是新护城河——本页全部为示意值，用于呈现分析框架。
      </IntroCard>

      {/* 概览 Stat */}
      <StatGrid className="mb-6">
        <Stat value="~30%" label="全球制造业增加值份额（示意）" accent="#c41e3a" />
        <Stat value="~20%" label="全球中间品出口占比（示意）" accent="#22d3ee" />
        <Stat value="200+" label="国家级先进制造业集群/基地（示意）" accent="#10b981" />
        <Stat value="60%+" label="重点链路备份覆盖率（目标 · 示意）" accent="#e8a317" />
      </StatGrid>

      {/* ============ 链路选择器：六大关键链路 ============ */}
      <Card title="交互 · 六大关键链路扫描（中国位置 / 断点 / 备份 / 对手出招）" className="mb-6">
        <SelectorBar items={CHAINS} activeKey={chainKey} onSelect={setChainKey} />
        <div className="os-card p-4 mb-4" style={{ background: 'var(--bg-elevated)', borderLeft: `3px solid ${chain.accent}` }}>
          <div className="text-sm font-semibold mb-1" style={{ color: chain.accent }}>{chain.label} · 中国的链上位置</div>
          <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{chain.position}</p>
        </div>
        <Grid cols={4} className="mb-4">
          {chain.stats.map(([label, value, c]) => (
            <div key={label} className="os-card p-3" style={{ background: 'rgba(148,163,184,0.05)' }}>
              <div className="text-base font-bold mono" style={{ color: c }}>{value}</div>
              <div className="text-[11px] mt-0.5" style={{ color: 'var(--text-tertiary)' }}>{label}</div>
            </div>
          ))}
        </Grid>
        <Grid cols={2}>
          <div>
            <div className="text-xs font-semibold mb-2 mono" style={{ color: 'var(--text-tertiary)' }}>断点风险 · 受制于外部指数（0-100 · 示意）</div>
            <EChart option={chainBreakOpt} style={{ height: 210 }} />
          </div>
          <div className="space-y-3">
            <div className="os-card p-3" style={{ background: 'rgba(16,185,129,0.06)', borderLeft: '3px solid #10b981' }}>
              <div className="text-xs font-semibold mb-1" style={{ color: '#10b981' }}>备份策略</div>
              <p className="text-xs leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{chain.backup}</p>
            </div>
            <div className="os-card p-3" style={{ background: 'rgba(196,30,58,0.06)', borderLeft: '3px solid #c41e3a' }}>
              <div className="text-xs font-semibold mb-1" style={{ color: '#c41e3a' }}>对手出招</div>
              <p className="text-xs leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{chain.rival}</p>
            </div>
          </div>
        </Grid>
      </Card>

      {/* ============ 「中国+1」转移监测 ============ */}
      <Grid cols={2} className="mb-6">
        <Card title="「中国+1」转移监测 · 全球制造份额多线（示意 %）">
          <EChart option={plusOneOpt} style={{ height: 250 }} />
          <p className="text-[11px] leading-relaxed mt-2" style={{ color: 'var(--text-tertiary)' }}>
            转移的真实幅度远小于话语热度：越南七年仅 +0.8 个百分点，且其对华中间品进口同步暴增——「转移」很大程度上是末端组装的绕道出口。天花板在于：承接国的电力、港口、工程师与集群密度均需以十年计的建设周期。
          </p>
        </Card>
        <Card title="断链情景压力测试 · 断供冲击指数（示意）">
          <EChart option={stressOpt} style={{ height: 250 }} />
          <p className="text-[11px] leading-relaxed mt-2" style={{ color: 'var(--text-tertiary)' }}>
            <span style={{ color: '#c41e3a' }}>红</span> = 系统性冲击（无短期替代）；<span style={{ color: '#a78bfa' }}>紫</span> = 中国手中的反制选项（冲击对手）；<span style={{ color: '#e8a317' }}>黄</span> = 可用储备 + 多元化缓冲。注意：压力测试的真正变量不是冲击峰值，而是缓冲库存能撑多少个月。
          </p>
        </Card>
      </Grid>

      {/* ============ 韧性雷达 + 黏性 ============ */}
      <Grid cols={2} className="mb-6">
        <Card title="供应链韧性雷达 · 中国 vs 美国（示意）">
          <EChart option={resilienceRadarOpt} style={{ height: 280 }} />
          <p className="text-[11px] leading-relaxed mt-1" style={{ color: 'var(--text-tertiary)' }}>
            结构性差异：中国长于库存冗余与国产备份（行政动员力），美国长于盟友网络与通道控制（海权 + 同盟体系）。中国最大的短板是「盟友网络可用度」——可托付的法域数量不在一个量级。
          </p>
        </Card>
        <Card title="在华供应链黏性 · 不可替代性指数（示意）">
          <EChart option={stickinessOpt} style={{ height: 280 }} />
          <p className="text-[11px] leading-relaxed mt-1" style={{ color: 'var(--text-tertiary)' }}>
            「搬不走的中国」论：集群完整度与基建密度是十年级资产，政治推力推不动物理引力。反论：黏性是存量逻辑——新增产能的选址已在改变，黏性锁得住今天、锁不住下一轮资本开支周期。
          </p>
        </Card>
      </Grid>

      {/* ============ 友岸外包 vs 效率：权衡说明 ============ */}
      <Card title="友岸外包 vs 效率 · 韧性税的会计学" className="mb-6">
        <Grid cols={3}>
          {TRADEOFF.map(({ t, c, d }) => (
            <div key={t} className="os-card p-4" style={{ background: 'var(--bg-elevated)', borderTop: `2px solid ${c}` }}>
              <div className="text-sm font-semibold mb-1" style={{ color: c }}>{t}</div>
              <p className="text-xs leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{d}</p>
            </div>
          ))}
        </Grid>
      </Card>

      {/* ============ 原有：供给依存 / 卡脖子 ============ */}
      <Grid cols={2} className="mb-6">
        <Card title="国内供给 vs 进口依存（示意 %）"><EChart option={supplyRiskBar} style={{ height: 260 }} /></Card>
        <Card title="典型卡脖子环节 · 风险强度（示意）"><EChart option={chokeBar} style={{ height: 260 }} /></Card>
      </Grid>

      {/* ============ 策略切换 ============ */}
      <Card title="交互 · 三类应对策略切换" className="mb-6">
        <SelectorBar items={STRATEGIES} activeKey={stratKey} onSelect={setStratKey} />
        <div className="os-card p-4" style={{ background: 'var(--bg-elevated)', borderLeft: `3px solid ${strat.accent}` }}>
          <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{strat.desc}</p>
        </div>
      </Card>

      <Grid cols={2} className="mb-6">
        <Card title="典型卡脖子环节 · 定性分级">
          <div className="space-y-2">
            {chokeList.map(([name, level, c]) => (
              <div key={name} className="flex items-center justify-between py-2 px-3 rounded-lg" style={{ background: 'rgba(148,163,184,0.06)' }}>
                <span className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{name}</span>
                <span className="text-xs font-bold mono px-2 py-0.5 rounded" style={{ color: c, background: `${c}1a` }}>{level}</span>
              </div>
            ))}
            <p className="text-[11px] leading-relaxed mt-2" style={{ color: 'var(--text-tertiary)' }}>先进制程设备与 EDA 工具链受出口管制约束最深；成熟制程产能已具备规模优势，竞争焦点转向良率与成本。</p>
          </div>
        </Card>
        <Card title="韧性建设节奏（指数 · 示意）"><EChart option={resilienceLine} style={{ height: 240 }} /></Card>
      </Grid>

      {/* ============ 链权演进时间线 ============ */}
      <Card title="交互 · 链权演进时间线（点击切换阶段）" className="mb-6">
        <TimelineBar stages={TIMELINE} activeIdx={stageIdx} onSelect={setStageIdx} />
      </Card>

      {/* ============ 制度逻辑（保留） ============ */}
      <Card title="链长制与备份系统 · 制度逻辑" className="mb-6">
        <Grid cols={3}>
          {[['1 · 链长制挂帅', '由地方与部委「链长」对重点产业链逐链建档，识别断点、卡点并匹配订单与资本，形成行政协调 + 市场验证的双轨推进。'],
            ['2 · 备份不等于替代', '备份系统追求「极端情景可启动」，允许成本与性能折让；替代追求商业闭环，两者节奏与考核标准不同。'],
            ['3 · 双供应商成为默认', '企业端表现为双供应商、近岸仓储与长单锁价，效率最优让位于可控性与冗余的「韧性税」。']].map(([t, d]) => (
            <div key={t}>
              <div className="text-sm font-semibold" style={{ color: 'var(--china-red)' }}>{t}</div>
              <p className="text-xs mt-1 leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{d}</p>
            </div>
          ))}
        </Grid>
      </Card>

      {/* ============ 研判 ============ */}
      <Card title="研判" className="mb-6">
        <p className="text-sm leading-relaxed mb-2" style={{ color: 'var(--text-secondary)' }}>
          供应链安全已从「效率最优」让位于「可控性与冗余」；企业端表现为双供应商、近岸仓储与长单锁价。宏观上与大基金、设备首台套政策形成共振——库存韧性与友岸外包是过渡形态，终局取决于国产替代的良率曲线能否在管制窗口期内爬坡。
        </p>
        <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
          链权博弈的当前均势：美方握有「技术断点」（芯片/设备/EDA），中方握有「物料断点」（稀土/原料药/集装箱产能）——双向人质结构使彻底脱钩对双方都是不可承受之重。真正的风险窗口不在常态博弈，而在台海级地缘事件触发的同时断链：届时所有备份体系将首次接受实战检验，而压力测试从未在真实断链中校准过。
        </p>
      </Card>

      {/* ============ FrameworkTrio：链权力 / 备份哲学 / 黏性博弈 ============ */}
      <FrameworkTrio cards={[
        { title: '链权力', subtitle: '供应链 = 和平时期的威慑武器', body: '断点即筹码：谁控制不可替代环节，谁就拥有不开火的胁迫能力。芯片管制与稀土管制是同一逻辑的镜像——链权力的行使成本远低于军事力量，故成为大国博弈的首选武器。', pillars: [['技术断点', '美方握芯片/设备/EDA。'], ['物料断点', '中方握稀土/原料药/箱。'], ['双向人质', '彻底脱钩双方均不可承受。']] },
        { title: '备份哲学', subtitle: '冗余是新效率', body: 'JIT（准时制）让位于 JIC（以防万一）：库存从成本项重估为期权资产。备份系统的考核标准不是商业回报而是「极端情景可启动」——允许性能折让、允许平时亏损，这是军事采购逻辑对民用产业的渗透。', pillars: [['时间银行', '储备买的是反应窗口。'], ['韧性税', '保费永远无法事前证明值得。'], ['双轨考核', '备份≠替代，节奏不同。']] },
        { title: '黏性博弈', subtitle: '集群引力 vs 政治推力的拉锯', body: '物理世界的迁移速度远慢于政策文件的签发速度：集群、基建、工程师是十年级资产。但黏性是存量逻辑——增量资本开支的选址已在转向，胜负手在于中国能否在存量黏性耗尽前完成向链主与标准制定者的跃迁。', pillars: [['存量锁定', '今天的产能搬不走。'], ['增量分流', '下一轮厂房未必建在中国。'], ['跃迁窗口', '从世界工厂到链主的赛跑。']] },
      ]} />

      <ModuleFooter moduleId="supplychain" disclaimer="全页数值均为示意性框架值，非统计口径数据 · 公开资料整理，仅供分析框架参考，非投资建议" sourceNote="由 china.html「供应链」专题迁移升级 · 链权力扩容版" />
    </div>
  );
}
