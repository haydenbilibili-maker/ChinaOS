import React, { useState, useMemo } from 'react';
import { PageHeader, Card, Grid, Stat } from '../../app/ui.jsx';
import EChart from '../../lib/viz/EChart.jsx';
import { categoryX, valueY, logY, GRID, donutOpt, radarOpt, stackedBarOpt, AXIS, LABEL } from '../shared/chartHelpers.js';
import { IntroCard, SelectorBar, TimelineBar, FrameworkTrio, ModuleFooter } from '../shared/ModuleParadigm.jsx';

// ============================================================================
// 住房地产 · 周期出清 / 土地财政 / 保障房新模式（china.html「住房」专题扩容）
// ----------------------------------------------------------------------------
// 冷峻现实主义视角：把住房还原为「土地财政—居民资产负债表—金融杠杆」三体博弈。
// 所有数值为公开资料示意（asOf 2026-06），非官方统计，非投资建议。
// ============================================================================

const RED = '#c41e3a';
const GOLD = '#e8a317';
const CYAN = '#22d3ee';
const GREEN = '#10b981';
const VIOLET = '#8b5cf6';

// ---- 议题选择器 ----
const ISSUES = [
  { key: 'cycle', label: '行业周期', accent: RED },
  { key: 'land', label: '土地财政', accent: GOLD },
  { key: 'debt', label: '房企债务', accent: VIOLET },
  { key: 'affordable', label: '保障房', accent: CYAN },
  { key: 'rent', label: '租购并举', accent: GREEN },
  { key: 'village', label: '城中村改造', accent: '#f97316' },
];

// ---- 房地产周期：销售面积/销售额双轴（2015→2025E）----
const cycleYears = ['2015', '2017', '2019', '2021', '2023', '2025E'];
const salesArea = [12.8, 14.4, 17.2, 17.9, 11.2, 8.6];   // 亿㎡ 商品房销售面积
const salesValue = [8.7, 11.0, 16.0, 18.2, 11.7, 9.4];   // 万亿元 销售额
const cycleOpt = {
  tooltip: { trigger: 'axis' },
  legend: { top: 0, textStyle: { color: LABEL.color, fontSize: 10 }, itemWidth: 14 },
  grid: { left: 44, right: 48, top: 30, bottom: 24 },
  xAxis: categoryX(cycleYears),
  yAxis: [
    valueY({ name: '亿㎡', nameTextStyle: { color: LABEL.color, fontSize: 9 } }),
    valueY({ name: '万亿元', nameTextStyle: { color: LABEL.color, fontSize: 9 }, position: 'right', splitLine: { show: false } }),
  ],
  series: [
    { name: '销售面积(亿㎡)', type: 'bar', data: salesArea, barWidth: 16, itemStyle: { color: RED, borderRadius: 3 } },
    { name: '销售额(万亿元)', type: 'line', yAxisIndex: 1, smooth: true, symbol: 'circle', symbolSize: 6, data: salesValue, lineStyle: { color: GOLD, width: 2 }, itemStyle: { color: GOLD }, areaStyle: { color: 'rgba(232,163,23,0.08)' } },
  ],
};

// ---- 房地产投资增速：从两位数到负增长 ----
const investGrowthOpt = {
  tooltip: { trigger: 'axis', formatter: '{b}: {c}%' },
  grid: GRID,
  xAxis: categoryX(['2015', '2017', '2019', '2021', '2023', '2025E']),
  yAxis: valueY({ axisLabel: { formatter: '{value}%' } }),
  series: [{
    type: 'bar', barWidth: 22,
    data: [1.0, 7.0, 9.9, 4.4, -9.6, -8.0].map((v) => ({ value: v, itemStyle: { color: v < 0 ? RED : CYAN, borderRadius: 3 } })),
    markLine: { silent: true, symbol: 'none', lineStyle: { color: '#64748b', type: 'dashed' }, data: [{ yAxis: 0 }] },
  }],
};

// ---- 土地财政：土地出让收入 + 占地方财政比重（双轴）----
const landYears = ['2015', '2017', '2019', '2021', '2022', '2023', '2025E'];
const landRevenue = [3.3, 5.2, 7.3, 8.7, 6.7, 5.8, 4.6]; // 万亿元
const landShare = [38, 46, 53, 56, 48, 42, 34];           // % 占地方综合财力
const landOpt = {
  tooltip: { trigger: 'axis' },
  legend: { top: 0, textStyle: { color: LABEL.color, fontSize: 10 }, itemWidth: 14 },
  grid: { left: 44, right: 48, top: 30, bottom: 24 },
  xAxis: categoryX(landYears),
  yAxis: [
    valueY({ name: '万亿元', nameTextStyle: { color: LABEL.color, fontSize: 9 } }),
    valueY({ name: '占比%', nameTextStyle: { color: LABEL.color, fontSize: 9 }, position: 'right', max: 60, splitLine: { show: false }, axisLabel: { formatter: '{value}%' } }),
  ],
  series: [
    { name: '土地出让收入', type: 'bar', data: landRevenue, barWidth: 16, itemStyle: { color: GOLD, borderRadius: 3 } },
    { name: '占地方财力比重', type: 'line', yAxisIndex: 1, smooth: true, symbol: 'circle', symbolSize: 6, data: landShare, lineStyle: { color: RED, width: 2 }, itemStyle: { color: RED } },
  ],
};

// ---- 各省土地财政依赖度差异（横向条形 · 示意）----
const provDepOpt = {
  tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' }, formatter: '{b}: {c}%' },
  grid: { left: 56, right: 24, top: 12, bottom: 24 },
  xAxis: valueY({ axisLabel: { formatter: '{value}%' } }),
  yAxis: { type: 'category', data: ['江苏', '浙江', '福建', '安徽', '四川', '辽宁'], axisLine: { lineStyle: { color: AXIS.lineStyle.color } }, axisLabel: { color: LABEL.color, fontSize: 10 } },
  series: [{
    type: 'bar', barWidth: 14,
    data: [58, 55, 51, 49, 38, 24].map((v) => ({ value: v, itemStyle: { color: v > 50 ? RED : v > 40 ? GOLD : CYAN, borderRadius: 3 } })),
  }],
};

// ---- 房企杠杆出清 + 交付率（保留原 riskClear）----
const riskClearOpt = {
  tooltip: { trigger: 'axis' },
  grid: { left: 44, right: 16, top: 30, bottom: 24 },
  legend: { top: 0, textStyle: { color: LABEL.color, fontSize: 10 }, itemWidth: 14 },
  xAxis: categoryX(['2021', '2022', '2023', '2024', '2025E']),
  yAxis: valueY(),
  series: [
    { name: '房企净负债率(%)', type: 'line', smooth: true, symbol: 'circle', symbolSize: 6, data: [120, 95, 82, 73, 68], lineStyle: { color: RED, width: 2 }, itemStyle: { color: RED }, areaStyle: { color: 'rgba(196,30,58,0.1)' } },
    { name: '保交楼交付率(%)', type: 'bar', data: [40, 65, 88, 94, 97], barWidth: 16, itemStyle: { color: GOLD, borderRadius: 3 } },
  ],
};

// ---- 房企到位资金来源结构（堆叠 · 示意）----
const fundingOpt = stackedBarOpt({
  categories: ['2019', '2021', '2023', '2025E'],
  series: [
    { name: '国内贷款', data: [25, 21, 16, 14], itemStyle: { color: VIOLET } },
    { name: '自筹资金', data: [33, 32, 35, 36], itemStyle: { color: CYAN } },
    { name: '定金及预收款', data: [30, 33, 28, 26], itemStyle: { color: GOLD } },
    { name: '个人按揭', data: [12, 14, 12, 10], itemStyle: { color: GREEN } },
  ],
});

// ---- 住房供给「双轨制」结构（保留原 dualTrack）----
const supplyOpt = donutOpt([
  { value: 50, name: '市场化商品房', itemStyle: { color: RED } },
  { value: 25, name: '保租房', itemStyle: { color: CYAN } },
  { value: 15, name: '配售型保障房', itemStyle: { color: GOLD } },
  { value: 10, name: '共有产权', itemStyle: { color: GREEN } },
], { radius: ['52%', '74%'] });

// ---- 房地产及上下游占 GDP 比重（趋势 · 支柱与拖累）----
const gdpPullOpt = {
  tooltip: { trigger: 'axis', formatter: '{b}: {c}%' },
  grid: GRID,
  xAxis: categoryX(['2015', '2018', '2020', '2022', '2024', '2025E']),
  yAxis: valueY({ axisLabel: { formatter: '{value}%' }, max: 30 }),
  series: [{
    type: 'line', smooth: true, symbol: 'circle', symbolSize: 6,
    data: [25, 27, 26, 22, 18, 16],
    lineStyle: { color: RED, width: 2 }, itemStyle: { color: RED },
    areaStyle: { color: 'rgba(196,30,58,0.12)' },
    markLine: { silent: true, symbol: 'none', lineStyle: { color: GOLD, type: 'dashed' }, label: { color: GOLD, fontSize: 9, formatter: '峰值~27%' }, data: [{ yAxis: 27 }] },
  }],
};

// ---- 未来住房投向权重（保留原 investMix radar）----
const investRadarOpt = radarOpt(
  ['城中村改造', '保租房建设', '高品质改善', '数字化社区', '平急两用基建'],
  [95, 88, 75, 92, 80],
  { name: '未来投向权重（2024–2030 · 示意）', color: GOLD },
);

// ---- 租购并举：租赁人口占比演进 ----
const rentOpt = {
  tooltip: { trigger: 'axis', formatter: '{b}: {c}%' },
  grid: GRID,
  xAxis: categoryX(['2015', '2020', '2025E', '2030目标']),
  yAxis: valueY({ axisLabel: { formatter: '{value}%' }, max: 50 }),
  series: [{
    type: 'bar', barWidth: 28,
    data: [18, 23, 28, 40].map((v, i) => ({ value: v, itemStyle: { color: i === 3 ? GREEN : CYAN, borderRadius: 4 } })),
    markLine: { silent: true, symbol: 'none', lineStyle: { color: GREEN, type: 'dashed' }, label: { color: GREEN, fontSize: 9 }, data: [{ yAxis: 40, name: '目标' }] },
  }],
};

// ---- 城中村改造：21 城投资强度（雷达双维 · 自写内联）----
const villageOpt = {
  tooltip: {},
  legend: { bottom: 0, textStyle: { color: LABEL.color, fontSize: 10 }, itemWidth: 12 },
  radar: {
    indicator: [
      { name: '净地出让', max: 100 }, { name: '房票安置', max: 100 },
      { name: '产业导入', max: 100 }, { name: '配套补短板', max: 100 }, { name: '原住民回迁', max: 100 },
    ],
    axisName: { color: LABEL.color, fontSize: 10 },
    splitLine: { lineStyle: { color: 'rgba(148,163,184,0.15)' } },
    axisLine: { lineStyle: { color: 'rgba(148,163,184,0.15)' } },
    splitArea: { show: false },
  },
  series: [{
    type: 'radar',
    data: [
      { value: [90, 85, 70, 80, 75], name: '一线城市', lineStyle: { color: RED, width: 2 }, itemStyle: { color: RED }, areaStyle: { color: 'rgba(196,30,58,0.12)' } },
      { value: [60, 70, 55, 65, 82], name: '强二线城市', lineStyle: { color: CYAN, width: 2 }, itemStyle: { color: CYAN }, areaStyle: { color: 'rgba(34,211,238,0.10)' } },
    ],
  }],
};

// ---- 议题详情数据 ----
const ISSUE_DETAIL = {
  cycle: {
    accent: RED,
    现状: '商品房销售面积自 2021 年约 17.9 亿㎡ 的历史高点深度回落，2025 年预计跌至 8–9 亿㎡ 区间，腰斩级调整；销售额同步从 18 万亿向 9 万亿收敛。',
    风险: '高杠杆、高周转、高负债的「三高」开发模式终结，期房预售制下的信用循环断裂，去化周期拉长至历史高位，二手房挂牌量堆积压制新房定价。',
    政策: '从「认房又认贷」松绑到首付比例下调、利率下行、「白名单」融资协调机制，需求侧与供给侧同时托底，目标是「止跌回稳」而非重启上涨。',
    charts: [
      { title: '商品房销售面积 vs 销售额（2015–2025E · 示意）', opt: cycleOpt, h: 250 },
      { title: '房地产开发投资增速（同比% · 转负 · 示意）', opt: investGrowthOpt, h: 250 },
    ],
  },
  land: {
    accent: GOLD,
    现状: '土地出让收入自 2021 年约 8.7 万亿峰值回落至 2025 年约 4.6 万亿，占地方综合财力比重从 56% 降至 34% 区间，地方政府的「隐性税基」急速收缩。',
    风险: '卖地收入下滑直接冲击地方政府性基金预算与城投偿债能力，依赖度越高的省份财政缺口越大，土地财政与城投债务形成共振脆弱点。',
    政策: '化债（一揽子置换方案）+ 培育消费税/房地产税等替代税源 + 中央财政事权上收，逐步为地方财政「断奶」土地依赖寻找新锚。',
    charts: [
      { title: '土地出让收入与占地方财力比重（双轴 · 示意）', opt: landOpt, h: 250 },
      { title: '各省土地财政依赖度差异（% · 示意）', opt: provDepOpt, h: 250 },
    ],
  },
  debt: {
    accent: VIOLET,
    现状: '头部房企接连出险，行业净负债率从约 120% 压降至 70% 区间；「三道红线」强制去杠杆后，房企从主动加杠杆扩张转为被动缩表求生。',
    风险: '债务展期、境外债重组、停工楼盘构成「保交楼」社会风险源；到位资金中定金及预收款占比偏高，意味着风险高度绑定购房者资产负债表。',
    政策: '「白名单」项目融资协调、保交楼专项借款、收购存量商品房转保障房，以项目制隔离风险，而非对房企主体无差别救助。',
    charts: [
      { title: '房企净负债率出清与保交楼交付率（示意）', opt: riskClearOpt, h: 250 },
      { title: '房企到位资金来源结构（% · 堆叠 · 示意）', opt: fundingOpt, h: 250 },
    ],
  },
  affordable: {
    accent: CYAN,
    现状: '供给体系向保障倾斜：市场化商品房约占一半，保租房、配售型保障房、共有产权组成的「保障轨」逐步扩容，规划性住房成为逆周期投资支点。',
    风险: '保障房供给速度若跑不赢商品房出清速度，则保民生与稳市场的双目标互相挤压；配售型保障房的封闭流转削弱了住房的资产属性预期。',
    政策: '「三大工程」——保障性住房建设、城中村改造、平急两用基建——以中央加杠杆、政策性金融工具（PSL）托底，对冲商品房投资缺口。',
    charts: [
      { title: '住房「双轨制」供给结构（% · 示意）', opt: supplyOpt, h: 260 },
      { title: '房地产及上下游占 GDP 比重（% · 示意）', opt: gdpPullOpt, h: 260 },
    ],
  },
  rent: {
    accent: GREEN,
    现状: '「租购并举」从口号走向制度：保障性租赁住房大规模筹建，租赁人口占比从 2015 年约 18% 向 2030 年 40% 目标推进，租赁权益与购房权益逐步「同权」。',
    风险: '租赁回报率长期偏低制约社会资本进入，「租售比」失衡使长租运营难以自负盈亏；租客权益保障（稳定租期、子女入学）落地仍不均衡。',
    政策: '保租房 REITs 打通退出通道、税收优惠引导机构持有运营、租赁同权（公共服务挂钩）推进，构建「租得起、住得稳」的居住确定性。',
    charts: [
      { title: '租赁人口占比演进（% · 向 2030 目标 · 示意）', opt: rentOpt, h: 260 },
      { title: '未来住房投向权重（2024–2030 · 示意）', opt: investRadarOpt, h: 260 },
    ],
  },
  village: {
    accent: '#f97316',
    现状: '城中村改造聚焦 21 个超大特大城市，以「净地出让 + 房票安置」替代大拆大建，是未来住房投向权重最高的板块，深挖城市内部存量空间。',
    风险: '改造资金平衡高度依赖后续土地与物业溢价，在房价下行周期中算账难度上升；货币化安置若再度放量，可能重蹈刺激短期需求、透支中长期的覆辙。',
    政策: '专项借款 + 政策性金融工具 + 房票安置闭环，强调「拆建并举、留改拆结合」，把产业导入与配套补短板嵌入改造，避免单纯地产化。',
    charts: [
      { title: '城中村改造投资强度（一线 vs 强二线 · 示意）', opt: villageOpt, h: 260 },
      { title: '住房「双轨制」供给结构（% · 示意）', opt: supplyOpt, h: 260 },
    ],
  },
};

// ---- 政策时间线 ----
const TIMELINE = [
  { period: '1998', title: '住房商品化改革', accent: '#64748b', desc: '取消福利分房、启动住房市场化与按揭体系，土地出让金成为地方财政增量来源，房地产开启货币化与金融化进程。' },
  { period: '2003–2015', title: '黄金十年 · 调控加码', accent: GOLD, desc: '城镇化 + 货币宽松驱动房价长牛，限购限贷限价等行政调控反复加码，土地财政依赖度攀升至历史高位，居民杠杆快速抬升。' },
  { period: '2016', title: '房住不炒', accent: CYAN, desc: '「房子是用来住的、不是用来炒的」定调，开启去金融化的政策转向，预期管理从「保涨」转向「稳价」。' },
  { period: '2020–2022', title: '三道红线 · 出险出清', accent: RED, desc: '以「三道红线」限制房企融资，叠加销售下行触发头部房企连环出险，行业进入深度去杠杆与信用收缩阶段。' },
  { period: '2023–今', title: '保交楼 · 止跌回稳 + 保障房', accent: GREEN, desc: '保交楼守底线，「白名单」融资协调，需求侧全面松绑求「止跌回稳」；同步推进保障性住房与「三大工程」，构建新发展模式。' },
];

export default function Page() {
  const [issue, setIssue] = useState('cycle');
  const [stageIdx, setStageIdx] = useState(4);
  const detail = useMemo(() => ISSUE_DETAIL[issue], [issue]);

  return (
    <div>
      <PageHeader
        badge="Housing · De-financialization & New Model"
        title="商品房周期 · 土地财政与保障房新模式"
        subtitle="房住不炒 · 三道红线 · 保交楼 · 租购并举 · 城中村改造 —— 从「金融杠杆中心」到「民生保障中心」"
      />

      <IntroCard>
        住房不是孤立的资产，而是<strong style={{ color: 'var(--text-primary)' }}>「土地财政 — 居民资产负债表 — 金融杠杆」</strong>的三体博弈。
        体制通过限制开发商融资（三道红线）与引导预期下行，主动切断房价单边上涨的系统动力——这种「主动刺破」旨在防止资产泡沫对制造业与科技创新的虹吸效应，
        把国家资本从「钢筋水泥」腾挪向新质生产力。代价由土地财政与居民资产负债表共同承担；新模式能否成立，取决于<strong style={{ color: 'var(--text-primary)' }}>保障轨的供给速度能否跑赢市场轨的出清速度</strong>。
      </IntroCard>

      <Grid cols={4} className="mb-6">
        <Stat value="~8.6 亿㎡" label="商品房销售面积（2025E · 较峰值腰斩）" accent={RED} />
        <Stat value="~34%" label="土地财政占地方财力（自 56% 回落）" accent={GOLD} />
        <Stat value="~68%" label="房企净负债率（自 120% 去杠杆）" accent={VIOLET} />
        <Stat value="ACTIVE" label="保障性住房建设（三大工程逆周期托底）" accent={CYAN} />
      </Grid>

      {/* ===== 议题选择器 ===== */}
      <Card title="议题透视 · 周期 / 财政 / 债务 / 保障" className="mb-6">
        <SelectorBar items={ISSUES} activeKey={issue} onSelect={setIssue} />
        <Grid cols={3} className="mb-4">
          {[['现状', detail.现状], ['风险', detail.风险], ['政策', detail.政策]].map(([t, d]) => (
            <div key={t} className="os-card p-4" style={{ background: 'var(--bg-surface)', borderLeft: `3px solid ${detail.accent}` }}>
              <div className="text-xs font-semibold mb-2" style={{ color: detail.accent }}>{t}</div>
              <p className="text-[11px] leading-relaxed" style={{ color: 'var(--text-tertiary)' }}>{d}</p>
            </div>
          ))}
        </Grid>
        <Grid cols={2}>
          {detail.charts.map((ch) => (
            <div key={ch.title}>
              <div className="text-[11px] mono mb-1" style={{ color: 'var(--text-tertiary)' }}>{ch.title}</div>
              <EChart option={ch.opt} style={{ height: ch.h }} />
            </div>
          ))}
        </Grid>
      </Card>

      {/* ===== 风险传导链 ===== */}
      <Card title="风险传导链 · 一条断不开的信用环" className="mb-6">
        <p className="text-sm leading-relaxed mb-4" style={{ color: 'var(--text-secondary)' }}>
          地产风险并非孤立爆点，而是沿「房企 — 楼盘 — 信心 — 销售 — 土地 — 城投」一条链条层层传导，每一环都既是受害者也是放大器。
        </p>
        <div className="flex flex-wrap items-stretch gap-2">
          {[
            ['房企暴雷', '融资断流、债务展期、境外债重组', RED],
            ['停工 · 保交楼', '期房交付风险转为社会维稳压力', GOLD],
            ['购房信心下挫', '观望情绪蔓延，预期自我实现', VIOLET],
            ['销售面积下滑', '回款萎缩、去化周期拉长', RED],
            ['土地财政承压', '卖地收入下滑、基金预算缺口', GOLD],
            ['城投债务共振', '地方偿债能力削弱、化债压力上升', CYAN],
          ].map(([t, d, c], i, arr) => (
            <React.Fragment key={t}>
              <div className="os-card p-3" style={{ flex: '1 1 140px', minWidth: 140, borderTop: `2px solid ${c}`, background: 'var(--bg-surface)' }}>
                <div className="text-[10px] mono mb-1" style={{ color: c }}>{String(i + 1).padStart(2, '0')}</div>
                <div className="text-xs font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>{t}</div>
                <p className="text-[10px] leading-relaxed" style={{ color: 'var(--text-tertiary)' }}>{d}</p>
              </div>
              {i < arr.length - 1 && <div className="self-center text-sm" style={{ color: 'var(--text-tertiary)' }}>→</div>}
            </React.Fragment>
          ))}
        </div>
        <p className="text-[11px] mt-3 leading-relaxed" style={{ color: 'var(--text-tertiary)' }}>
          政策干预点在于<strong style={{ color: detail.accent }}>切断链条传导</strong>：「白名单」隔离项目风险、保交楼守住信心底线、化债缓释城投共振——以项目制阻断系统性蔓延。
        </p>
      </Card>

      {/* ===== 核心逻辑 ===== */}
      <Card title="核心逻辑 · 去金融化与系统重启" className="mb-6">
        <Grid cols={3}>
          {[['三道红线 · 切断杠杆', '以剔除预收款资产负债率、净负债率、现金短债比三条线限制房企融资，行业净负债率从约 120% 回落至 70% 区间，强制去金融化。'],
            ['保交楼 · 守住底线', '以城市政府为主体、专项借款与白名单机制兜底交付，将期房违约的社会风险压缩在可控阈值内。'],
            ['土地财政脱钩', 'Decoupling land finance from local governance——切断地方治理对土地出让金的依赖，是恢复产业竞争力的前提，也是转型最痛的环节，呼应文明透视中的盐铁财政逻辑。']].map(([t, d]) => (
            <div key={t} style={{ borderLeft: `2px solid ${RED}`, paddingLeft: 10 }}>
              <div className="text-xs font-semibold" style={{ color: 'var(--text-primary)' }}>{t}</div>
              <p className="text-[11px] mt-1 leading-relaxed" style={{ color: 'var(--text-tertiary)' }}>{d}</p>
            </div>
          ))}
        </Grid>
      </Card>

      {/* ===== 双轨制 + 三大工程 ===== */}
      <Grid cols={2} className="mb-6">
        <Card title="住房双轨制 · 市场归市场，保障归保障">
          <p className="text-sm leading-relaxed mb-3" style={{ color: 'var(--text-secondary)' }}>
            新体系把住房拆成两条轨道：市场轨（商品房）回归高品质、高溢价的改善逻辑；保障轨（保租房、共有产权、配售型保障房）走普惠化、封闭化管理。
          </p>
          <div className="space-y-2">
            <div style={{ borderLeft: `2px solid ${RED}`, paddingLeft: 10 }}>
              <div className="text-xs font-semibold" style={{ color: 'var(--text-primary)' }}>市场轨（商品房 · 约 50%）</div>
              <p className="text-[11px]" style={{ color: 'var(--text-tertiary)' }}>取消限购限价后回归供需定价，竞争维度转向品质、物业与社区运营。</p>
            </div>
            <div style={{ borderLeft: `2px solid ${CYAN}`, paddingLeft: 10 }}>
              <div className="text-xs font-semibold" style={{ color: 'var(--text-primary)' }}>保障轨（保租房/配售 · 约 50%）</div>
              <p className="text-[11px]" style={{ color: 'var(--text-tertiary)' }}>封闭流转、不可上市套利——保障房的闭环管理正消解住房的「投机红利」。</p>
            </div>
          </div>
        </Card>
        <Card title="三大工程 · 存量博弈的新支点">
          <p className="text-sm leading-relaxed mb-3" style={{ color: 'var(--text-secondary)' }}>
            「三大工程」——保障性住房建设、城中村改造、平急两用基建——是房地产新模式的物理载体，深挖超大特大城市的内部存量空间，是消化存量杠杆的最后王牌。
          </p>
          <div className="space-y-2">
            {[['保障性住房建设', '锚定新市民/青年「上车」预期，为收缩中的开发投资逆周期托底。', GOLD],
              ['城中村改造', '聚焦 21 个超大特大城市，净地出让 + 房票安置替代大拆大建。', '#f97316'],
              ['平急两用基建', '平时文旅康养、急时隔离保障，把韧性基建嵌入城市更新。', GREEN]].map(([t, d, c]) => (
              <div key={t} style={{ borderLeft: `2px solid ${c}`, paddingLeft: 10 }}>
                <div className="text-xs font-semibold" style={{ color: 'var(--text-primary)' }}>{t}</div>
                <p className="text-[11px]" style={{ color: 'var(--text-tertiary)' }}>{d}</p>
              </div>
            ))}
          </div>
        </Card>
      </Grid>

      {/* ===== 政策时间线 ===== */}
      <Card title="政策演进时间线 · 从商品化到新模式" className="mb-6">
        <TimelineBar stages={TIMELINE} activeIdx={stageIdx} onSelect={setStageIdx} />
      </Card>

      {/* ===== 高品质居住进化 ===== */}
      <Card title="高品质居住进化 · 构建居住确定性" className="mb-6">
        <Grid cols={3}>
          {[['1 · 历史性回摆', '房地产从「高速增长」向「平稳运营」回摆：市场泡沫缓释（MARKET_BUBBLE: MITIGATED）、双轨制落地、城市韧性重构同步推进。'],
            ['2 · 好房子标准', '未来居住生态由数字化社区管理、适老化硬件标准与绿色低碳能耗共同定义——竞争从「有没有」转向「好不好」。'],
            ['3 · 战略腾挪', '平衡资产价值不仅是支柱产业更迭，更是为新一轮全要素生产率爆发腾挪物理空间与金融资源。']].map(([t, d]) => (
            <div key={t}>
              <div className="text-sm font-semibold" style={{ color: 'var(--china-red)' }}>{t}</div>
              <p className="text-xs mt-1 leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{d}</p>
            </div>
          ))}
        </Grid>
      </Card>

      <Card title="系统观察" className="mb-6">
        <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
          「住房属性的回归是系统稳定的最终保障。」去金融化的代价由土地财政与居民资产负债表共同承担——这是一场用短期阵痛换长期腾挪的主动手术。
          新模式能否成立，不取决于房价何时反弹，而取决于<strong style={{ color: 'var(--text-primary)' }}>保障轨的供给速度能否跑赢市场轨的出清速度</strong>，以及地方财政能否在「断奶」土地依赖后找到新税基。
        </p>
      </Card>

      <FrameworkTrio cards={[
        { key: 'salt', body: '土地财政 = 地方政府的隐性税基（呼应盐铁财政）：卖地收入曾占地方财力 56%，去金融化的最痛环节正是为它「断奶」。' },
        { key: 'stone', body: '周期与去化：高杠杆、高周转开发模式终结，「三道红线」主动刺破，以试点—白名单—化债灰度推进出清。' },
        { key: 'path', body: '新模式：租购并举 + 保障房 + 城中村改造的「软着陆」，从增量扩张转向存量更新与民生托底。' },
      ]} />

      <ModuleFooter
        moduleId="housing"
        disclaimer="公开资料整理，数值示意非官方统计 · 仅供分析框架参考，不构成投资建议"
        sourceNote="由 china.html「住房」专题迁移并扩容"
      />
    </div>
  );
}
