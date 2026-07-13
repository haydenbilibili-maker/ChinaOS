// ============================================================================
// 数字巨网 · 结构化数据
// asOf: 2026-06-11 · 公开资料示意（CNNIC/工信部/平台财报/政策文本整理）
// 刻画网络经济、网络世界、网络传媒、社交舆情、数字治理五维塑造的数字中国
// ============================================================================

import { categoryX, valueY, GRID, LEGEND, radarOpt, AXIS, LABEL } from '../shared/chartHelpers.js';

export const AS_OF = '2026-06-11';

/** 五大研究切面 */
export const DOMAINS = [
  {
    key: 'econ',
    label: '网络经济',
    accent: '#c41e3a',
    thesis: '平台经济从流量红利转向「数据 × 算力 × 规则」的系统竞争：电商规模全球第一，但渗透率见顶后竞争从增量切存量；零工经济成为就业蓄水池，数据要素入表打开新估值通道。',
    metricCards: [
      { value: '57.8 万亿元', label: '数字经济规模' },
      { value: '43.6%', label: '占 GDP 比重' },
      { value: '2.1 亿人', label: '零工劳动者' },
    ],
    tension: '平台权力与国家规制边界反复校准；资本回报与「脱虚向实」之间的张力是长期变量。',
  },
  {
    key: 'world',
    label: '网络世界',
    accent: '#22d3ee',
    thesis: '11 亿网民构筑全球最大单一数字市场；光纤/5G/算力基建完成「物理层」铺设，语义防火墙与数据主权构成「规则层」—— cyberspace sovereignty 不是修辞而是流量路由与合规审查的物理现实。',
    metricCards: [
      { value: '11.08 亿', label: '网民规模' },
      { value: '94%+', label: '行政村光纤' },
      { value: '35%', label: 'IPv6 流量占比' },
    ],
    tension: '开放互联叙事与可控可管诉求并存；跨境数据流动默认收紧、例外放行。',
  },
  {
    key: 'media',
    label: '网络传媒',
    accent: '#e8a317',
    thesis: '算法分发取代门户编辑，短视频/直播重构注意力经济；主流媒体「融媒转型」与商业平台「特殊管理股」并存，形成双轨传播架构——议程设置权仍在上游，流量收割在平台。',
    metricCards: [
      { value: '10.4 亿', label: '短视频用户' },
      { value: '3.2 小时', label: '日均在线' },
      { value: '3 万+', label: 'MCN 机构' },
    ],
    tension: '娱乐化内容与主旋律供给的带宽争夺；出海平台面临域外语义防火墙反向施压。',
  },
  {
    key: 'opinion',
    label: '社交舆情',
    accent: '#f472b6',
    thesis: '社交媒体把分散个体耦合成可观测的「赛博反馈」场：舆情周期从小时级压缩到分钟级，危机传播沿算法推荐链放大；网格化 + 舆情系统构成自上而下的反向闭环。',
    metricCards: [
      { value: '7×24', label: '全网监测' },
      { value: '<2h', label: '口径响应' },
      { value: '百万级', label: '网格员规模' },
    ],
    tension: '民意表达窗口与叙事可控之间的动态平衡；删帖/限流/热搜调控是常态化工具而非例外。',
  },
  {
    key: 'gov',
    label: '数字治理',
    accent: '#8b5cf6',
    thesis: '数字政府从「一网通办」升级到「一网统管」：健康码证明动员能力，社会信用与平台监管构成「语义防火墙」的制度外延；算法备案、数据分类分级把平台纳入科层治理接口。',
    metricCards: [
      { value: '10.6 亿', label: '政务平台用户' },
      { value: '14 亿+', label: '信用体系覆盖' },
      { value: '500+', label: '算法备案' },
    ],
    tension: '治理效率与个体数据权利的平衡未定型；合规成本向中小企业倾斜性碾压。',
  },
];

/** 演进时间线 · 五阶段 */
export const PHASES = [
  { period: '1994–2008', title: '接入普及', accent: '#64748b', desc: '拨号上网到宽带入户；门户三巨头与搜索引擎登场，网民规模完成原始积累，网络空间仍属「新技术」叙事。' },
  { period: '2009–2019', title: '移动平台爆发', accent: '#22d3ee', desc: '智能手机 + 移动支付双轮驱动；微信/支付宝/外卖/共享单车重塑日常生活，平台经济无序扩张，监管整体宽容。' },
  { period: '2020–2022', title: '强监管整改', accent: '#e8a317', desc: '反垄断、数据安全三法、算法治理密集落地；蚂蚁 IPO 暂缓与网络安全审查标志资本无序扩张时代终结，语义防火墙工程化。' },
  { period: '2023–2024', title: '常态化 · 数实融合', accent: '#c41e3a', desc: '红绿灯机制明确边界，支持平台「大显身手」；增长引擎从消费互联网切换至产业数字化，东数西算承接算力底座。' },
  { period: '2025–', title: 'AI 巨网 2.0', accent: '#10b981', desc: '大模型重估平台与传媒价值；算力主权、语料合规、出海审查同步升级，数字竞争升维为国家系统对抗。' },
];

// --- 网络经济 ---
export const ECON_YEARS = ['2018', '2019', '2020', '2021', '2022', '2023', '2024', '2025E'];
export const DE_SCALE = [31.3, 35.8, 39.2, 45.5, 50.2, 53.9, 57.8, 62.5]; // 万亿元
export const DE_SHARE = [34.8, 36.2, 38.6, 39.8, 41.5, 42.8, 43.6, 44.5]; // % GDP

export const PLATFORM_SPLIT = [
  { value: 32, name: '电商交易', itemStyle: { color: '#c41e3a' } },
  { value: 26, name: '广告与营销', itemStyle: { color: '#e8a317' } },
  { value: 18, name: '本地生活', itemStyle: { color: '#22d3ee' } },
  { value: 14, name: '金融科技', itemStyle: { color: '#10b981' } },
  { value: 10, name: '云与企业服务', itemStyle: { color: '#8b5cf6' } },
];

export const GIG_YEARS = ['2018', '2020', '2022', '2024', '2026E'];
export const GIG_WORKERS = [0.78, 1.2, 1.65, 2.05, 2.35]; // 亿人
export const GIG_PLATFORMS = ['外卖配送', '网约车', '快递物流', '直播/内容', '众包设计', '家政服务'];
export const GIG_SHARE = [28, 18, 22, 12, 8, 12]; // 占比 %

// --- 网络世界 ---
export const NET_YEARS = ['2010', '2015', '2020', '2022', '2024', '2026E'];
export const NET_USERS = [4.57, 6.88, 9.89, 10.67, 11.08, 11.25]; // 亿人
export const NET_PENETRATION = [34.0, 50.3, 70.4, 75.6, 78.6, 79.5]; // %
export const BANDWIDTH = [1.8, 4.0, 10.2, 22.0, 28.5, 35.0]; // 户均 Mbps

export const INFRA_ITEMS = ['5G 基站(万)', '数据中心机架(万)', 'IPv6 活跃(亿)', '国际出口带宽(Tbps)'];
export const INFRA_2024 = [425, 830, 8.2, 18.5];
export const INFRA_2020 = [77, 520, 4.6, 11.5];

// 语义防火墙层级示意（雷达维）
export const SOVEREIGNTY_DIMS = ['接入管控', '内容审查', '数据本地化', '算法可解释', '跨境流动', '平台合规'];
export const SOVEREIGNTY_CN = [88, 92, 85, 78, 82, 90];
export const SOVEREIGNTY_US = [35, 40, 45, 55, 70, 50];
export const SOVEREIGNTY_EU = [50, 55, 75, 72, 68, 78];

// --- 网络传媒 ---
export const MEDIA_CHANNELS = ['短视频', '长视频', '图文/公众号', '直播', '音频播客', '传统媒体融媒'];
export const MEDIA_TIME_SHARE = [38, 14, 12, 18, 5, 13]; // 日均注意力占比 %
export const MEDIA_AD_SHARE = [42, 11, 8, 22, 3, 14]; // 广告收入占比 %

export const SHORT_VIDEO_YEARS = ['2018', '2020', '2022', '2024', '2026E'];
export const SHORT_VIDEO_USERS = [6.5, 8.7, 10.1, 10.4, 10.6];
export const SHORT_VIDEO_DAU_TIME = [88, 110, 125, 128, 130]; // 分钟/日

// --- 社交舆情 ---
export const SENTIMENT_YEARS = ['2020', '2021', '2022', '2023', '2024', '2025E'];
export const SENTIMENT_POS = [42, 45, 38, 44, 46, 47];
export const SENTIMENT_NEG = [18, 22, 28, 20, 18, 17];
export const SENTIMENT_NEU = [40, 33, 34, 36, 36, 36];

export const CRISIS_STAGES = ['潜伏', '爆发', '峰值', '回落', '沉淀'];
export const CRISIS_HOURS = [0, 2, 8, 24, 72, 168]; // 小时轴
export const CRISIS_VOLUME = [5, 45, 100, 62, 28, 12]; // 相对声量指数

export const FEEDBACK_LOOP = [
  { name: '网民表达' },
  { name: '网民表达 ⟲' }, // 镜像节点：ECharts Sankey 仅支持 DAG，用镜像收尾表达回环
  { name: '平台采集' },
  { name: '舆情系统' },
  { name: '口径生成' },
  { name: '算法调控' },
  { name: '网格反馈' },
  { name: '决策内核' },
];
export const FEEDBACK_LINKS = [
  { source: '网民表达', target: '平台采集', value: 100 },
  { source: '平台采集', target: '舆情系统', value: 85 },
  { source: '舆情系统', target: '口径生成', value: 70 },
  { source: '口径生成', target: '算法调控', value: 65 },
  { source: '算法调控', target: '网民表达 ⟲', value: 55 },
  { source: '舆情系统', target: '网格反馈', value: 45 },
  { source: '网格反馈', target: '决策内核', value: 50 },
  { source: '决策内核', target: '口径生成', value: 60 },
];

// --- 数字治理 ---
export const REG_YEARS = ['2016', '2018', '2020', '2021', '2022', '2023', '2024', '2025'];
export const REG_INDEX = [12, 18, 55, 95, 88, 52, 45, 42]; // 监管温度 0-100

export const GOV_SERVICES = ['一网通办', '一网统管', '城市大脑', '信用监管', '执法数字化', '数据开放'];
export const GOV_MATURITY = [92, 68, 72, 75, 70, 48]; // 成熟度示意

export const PLATFORM_REG_ITEMS = ['反垄断', '数据安全', '算法备案', '未成年人', '金融合规', '用工保障'];
export const PLATFORM_REG_SCORE = [85, 88, 72, 80, 75, 65]; // 执法强度示意

/** 五维综合雷达 */
export const GIANT_WEB_RADAR = {
  dims: ['网络经济', '网络世界', '网络传媒', '社交舆情', '数字治理', '算力底座'],
  cn2024: [88, 92, 85, 78, 86, 82],
  cn2018: [65, 70, 58, 52, 48, 55],
  globalAvg: [72, 68, 70, 60, 62, 75],
};

/** 图表构建器 */
export const CHARTS = {
  deScaleTrend: () => ({
    grid: { left: 44, right: 44, top: 30, bottom: 24 },
    tooltip: { trigger: 'axis' },
    legend: { ...LEGEND, top: 0, data: ['规模(万亿元)', '占GDP(%)'] },
    xAxis: categoryX(ECON_YEARS),
    yAxis: [valueY({ name: '万亿元' }), { ...valueY({ name: '%' }), splitLine: { show: false } }],
    series: [
      { name: '规模(万亿元)', type: 'bar', barWidth: 16,
        data: DE_SCALE.map((v, i) => ({ value: v, itemStyle: { color: i >= 7 ? 'rgba(196,30,58,0.35)' : '#c41e3a', borderRadius: [3, 3, 0, 0] } })) },
      { name: '占GDP(%)', type: 'line', yAxisIndex: 1, smooth: true, data: DE_SHARE,
        lineStyle: { color: '#22d3ee', width: 2 }, itemStyle: { color: '#22d3ee' } },
    ],
  }),

  netPenetration: () => ({
    grid: GRID,
    tooltip: { trigger: 'axis' },
    legend: { ...LEGEND, top: 0, data: ['网民(亿人)', '普及率(%)', '户均带宽(Mbps)'] },
    xAxis: categoryX(NET_YEARS),
    yAxis: [valueY({ name: '亿人' }), { ...valueY({ name: '%/Mbps' }), splitLine: { show: false } }],
    series: [
      { name: '网民(亿人)', type: 'bar', barWidth: 14, data: NET_USERS, itemStyle: { color: '#22d3ee' } },
      { name: '普及率(%)', type: 'line', yAxisIndex: 1, smooth: true, data: NET_PENETRATION, lineStyle: { color: '#10b981' } },
      { name: '户均带宽(Mbps)', type: 'line', yAxisIndex: 1, smooth: true, data: BANDWIDTH, lineStyle: { color: '#e8a317', type: 'dashed' } },
    ],
  }),

  infraCompare: () => ({
    grid: { left: 72, right: 16, top: 16, bottom: 24 },
    tooltip: { trigger: 'axis' },
    legend: { ...LEGEND, top: 0, data: ['2020', '2024'] },
    xAxis: categoryX(INFRA_ITEMS, { rotate: 12 }),
    yAxis: valueY(),
    series: [
      { name: '2020', type: 'bar', barGap: '30%', data: INFRA_2020, itemStyle: { color: 'rgba(100,116,139,0.6)' } },
      { name: '2024', type: 'bar', data: INFRA_2024, itemStyle: { color: '#22d3ee' } },
    ],
  }),

  mediaAttention: () => ({
    grid: { left: 72, right: 16, top: 30, bottom: 24 },
    tooltip: { trigger: 'axis' },
    legend: { ...LEGEND, top: 0, data: ['注意力占比', '广告收入占比'] },
    xAxis: categoryX(MEDIA_CHANNELS, { rotate: 18 }),
    yAxis: valueY({ name: '%' }),
    series: [
      { name: '注意力占比', type: 'bar', data: MEDIA_TIME_SHARE, itemStyle: { color: '#e8a317' } },
      { name: '广告收入占比', type: 'bar', data: MEDIA_AD_SHARE, itemStyle: { color: '#c41e3a' } },
    ],
  }),

  shortVideoTrend: () => ({
    grid: GRID,
    tooltip: { trigger: 'axis' },
    legend: { ...LEGEND, top: 0, data: ['用户(亿人)', '日均时长(分钟)'] },
    xAxis: categoryX(SHORT_VIDEO_YEARS),
    yAxis: [valueY({ name: '亿人' }), { ...valueY({ name: '分钟' }), splitLine: { show: false } }],
    series: [
      { name: '用户(亿人)', type: 'line', smooth: true, data: SHORT_VIDEO_USERS, lineStyle: { color: '#e8a317', width: 2 },
        areaStyle: { color: 'rgba(232,163,23,0.08)' } },
      { name: '日均时长(分钟)', type: 'line', yAxisIndex: 1, smooth: true, data: SHORT_VIDEO_DAU_TIME, lineStyle: { color: '#f472b6' } },
    ],
  }),

  sentimentCycle: () => ({
    grid: GRID,
    tooltip: { trigger: 'axis' },
    legend: { ...LEGEND, top: 0, data: ['正面', '负面', '中性'] },
    xAxis: categoryX(SENTIMENT_YEARS),
    yAxis: valueY({ name: '%', max: 50 }),
    series: [
      { name: '正面', type: 'line', stack: 'total', smooth: true, data: SENTIMENT_POS, areaStyle: { color: 'rgba(16,185,129,0.2)' }, lineStyle: { color: '#10b981' } },
      { name: '负面', type: 'line', stack: 'total', smooth: true, data: SENTIMENT_NEG, areaStyle: { color: 'rgba(196,30,58,0.2)' }, lineStyle: { color: '#c41e3a' } },
      { name: '中性', type: 'line', stack: 'total', smooth: true, data: SENTIMENT_NEU, areaStyle: { color: 'rgba(100,116,139,0.15)' }, lineStyle: { color: '#64748b' } },
    ],
  }),

  crisisPropagation: () => ({
    grid: GRID,
    tooltip: { trigger: 'axis', formatter: (p) => `${p[0].axisValue}h · 声量指数 ${p[0].data}` },
    xAxis: { ...categoryX(CRISIS_HOURS.map((h) => `${h}h`)), name: '传播时序' },
    yAxis: valueY({ name: '声量指数', max: 110 }),
    series: [{
      type: 'line', smooth: true, data: CRISIS_VOLUME,
      lineStyle: { color: '#f472b6', width: 2 },
      areaStyle: { color: 'rgba(244,114,182,0.12)' },
      markArea: {
        silent: true,
        data: [
          [{ xAxis: '0h', itemStyle: { color: 'rgba(100,116,139,0.06)' } }, { xAxis: '2h' }],
          [{ xAxis: '2h', itemStyle: { color: 'rgba(196,30,58,0.08)' } }, { xAxis: '8h' }],
          [{ xAxis: '24h', itemStyle: { color: 'rgba(34,211,238,0.06)' } }, { xAxis: '168h' }],
        ],
      },
      markPoint: {
        data: [
          { coord: ['8h', 100], name: '峰值', symbolSize: 42, itemStyle: { color: '#c41e3a' } },
        ],
      },
    }],
  }),

  regTemperature: () => ({
    grid: GRID,
    tooltip: { trigger: 'axis' },
    xAxis: categoryX(REG_YEARS),
    yAxis: valueY({ name: '监管温度', max: 100 }),
    series: [{
      type: 'line', smooth: true, data: REG_INDEX,
      lineStyle: { color: '#8b5cf6', width: 2 },
      areaStyle: { color: 'rgba(139,92,246,0.1)' },
      markLine: {
        silent: true,
        data: [
          { yAxis: 80, label: { formatter: '强监管带', color: LABEL.color }, lineStyle: { color: '#c41e3a', type: 'dashed' } },
        ],
      },
    }],
  }),

  govMaturity: () => ({
    grid: { left: 72, right: 16, top: 16, bottom: 24 },
    tooltip: { trigger: 'axis' },
    xAxis: categoryX(GOV_SERVICES, { rotate: 15 }),
    yAxis: valueY({ name: '成熟度', max: 100 }),
    series: [{
      type: 'bar', barWidth: 18,
      data: GOV_MATURITY.map((v, i) => ({
        value: v,
        itemStyle: { color: i === 0 ? '#8b5cf6' : i < 4 ? '#22d3ee' : '#64748b', borderRadius: [3, 3, 0, 0] },
      })),
      label: { show: true, position: 'top', color: LABEL.color, fontSize: 10 },
    }],
  }),

  gigEconomy: () => ({
    grid: GRID,
    tooltip: { trigger: 'axis' },
    legend: { ...LEGEND, top: 0, data: ['零工劳动者(亿人)'] },
    xAxis: categoryX(GIG_YEARS),
    yAxis: valueY({ name: '亿人' }),
    series: [{
      name: '零工劳动者(亿人)', type: 'line', smooth: true, data: GIG_WORKERS,
      lineStyle: { color: '#c41e3a', width: 2 },
      areaStyle: { color: 'rgba(196,30,58,0.08)' },
    }],
  }),
};

export function buildGiantWebRadar() {
  return {
    tooltip: { trigger: 'item' },
    legend: { type: 'scroll', bottom: 0, textStyle: { color: LABEL.color, fontSize: 10 }, icon: 'circle' },
    radar: {
      indicator: GIANT_WEB_RADAR.dims.map((n) => ({ name: n, max: 100 })),
      axisName: { color: LABEL.color, fontSize: 10 },
      splitLine: { lineStyle: { color: 'rgba(148,163,184,0.15)' } },
      axisLine: { lineStyle: { color: 'rgba(148,163,184,0.15)' } },
      splitArea: { show: false },
    },
    series: [{
      type: 'radar',
      data: [
        { value: GIANT_WEB_RADAR.cn2024, name: '中国 2024', lineStyle: { color: '#c41e3a' }, itemStyle: { color: '#c41e3a' }, areaStyle: { color: 'rgba(196,30,58,0.08)' } },
        { value: GIANT_WEB_RADAR.cn2018, name: '中国 2018', lineStyle: { color: '#64748b' }, itemStyle: { color: '#64748b' }, areaStyle: { opacity: 0.04 } },
        { value: GIANT_WEB_RADAR.globalAvg, name: '全球均值(示意)', lineStyle: { color: '#22d3ee', type: 'dashed' }, itemStyle: { color: '#22d3ee' } },
      ],
    }],
  };
}

export function buildSovereigntyRadar() {
  return {
    tooltip: { trigger: 'item' },
    legend: { bottom: 0, textStyle: { color: LABEL.color, fontSize: 10 } },
    radar: {
      indicator: SOVEREIGNTY_DIMS.map((n) => ({ name: n, max: 100 })),
      axisName: { color: LABEL.color, fontSize: 10 },
      splitLine: { lineStyle: { color: 'rgba(148,163,184,0.15)' } },
      splitArea: { show: false },
    },
    series: [{
      type: 'radar',
      data: [
        { value: SOVEREIGNTY_CN, name: '中国', lineStyle: { color: '#c41e3a' }, itemStyle: { color: '#c41e3a' }, areaStyle: { color: 'rgba(196,30,58,0.06)' } },
        { value: SOVEREIGNTY_US, name: '美国', lineStyle: { color: '#22d3ee' }, itemStyle: { color: '#22d3ee' } },
        { value: SOVEREIGNTY_EU, name: '欧盟', lineStyle: { color: '#e8a317' }, itemStyle: { color: '#e8a317' } },
      ],
    }],
  };
}

export function buildFeedbackSankey() {
  return {
    tooltip: { trigger: 'item', triggerOn: 'mousemove' },
    series: [{
      type: 'sankey',
      layout: 'none',
      emphasis: { focus: 'adjacency' },
      nodeAlign: 'left',
      lineStyle: { color: 'gradient', curveness: 0.5, opacity: 0.35 },
      label: { color: LABEL.color, fontSize: 10 },
      data: FEEDBACK_LOOP.map((n) => ({ name: n.name })),
      links: FEEDBACK_LINKS,
      itemStyle: { borderWidth: 0 },
      levels: [
        { depth: 0, itemStyle: { color: '#f472b6' } },
        { depth: 1, itemStyle: { color: '#22d3ee' } },
        { depth: 2, itemStyle: { color: '#e8a317' } },
        { depth: 3, itemStyle: { color: '#8b5cf6' } },
      ],
    }],
  };
}

export function buildPlatformRegRadar() {
  return radarOpt(
    PLATFORM_REG_ITEMS,
    PLATFORM_REG_SCORE,
    { name: '执法强度', color: '#8b5cf6' },
  );
}

export function getDomain(key) {
  return DOMAINS.find((d) => d.key === key) || DOMAINS[0];
}
