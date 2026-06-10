import React, { useState, useMemo } from 'react';
import { PageHeader, Card, Grid, Stat } from '../../app/ui.jsx';
import EChart from '../../lib/viz/EChart.jsx';
import { categoryX, valueY, logY, GRID, donutOpt, radarOpt, stackedBarOpt } from '../shared/chartHelpers.js';
import { IntroCard, SelectorBar, TimelineBar, FrameworkTrio, ModuleFooter } from '../shared/ModuleParadigm.jsx';

// ── 工具选择器：六类绿色金融工具 ───────────────────────────────────────────
const TOOLS = [
  { key: 'loan', label: '绿色信贷', accent: '#10b981', balance: 35.5,
    desc: '本外币绿色贷款余额 ~34 万亿，全球第一；投向清洁交通/能源占比 40%+，是体量最大的工具。',
    mechanism: '人民银行碳减排支持工具提供 1.75% 低成本再贷款，按碳减排量精准滴灌。',
    pain: '统计口径偏宽、部分项目「漂绿」；与传统信贷利差有限，激励仍依赖政策补贴。' },
  { key: 'bond', label: '绿色债券', accent: '#e8a317', balance: 4.2,
    desc: '绿债存量 ~4 万亿，全球发行体量第一；募集资金用途披露趋严，漂绿风险受监管关注。',
    mechanism: '绿色债券原则 100% 募集资金须投向绿色项目，第三方认证 + 存续期信息披露。',
    pain: '与普通债券「绿色溢价(greenium)」偏薄，发行人内生动力不足；标准与国际尚待统一。' },
  { key: 'carbon', label: '碳市场', accent: '#c41e3a', balance: 92,
    desc: '全国碳市场 CEA 均价 90+ 元/吨，覆盖 50 亿吨+ CO₂；电力先行，钢铁水泥扩围抬高合规成本。',
    mechanism: '总量控制 + 配额交易(ETS)；基准线法免费分配为主，逐步引入有偿拍卖。',
    pain: '碳价偏低、流动性弱（多为履约期突击交易）；配额过松削弱减排信号。' },
  { key: 'transition', label: '转型金融', accent: '#a78bfa', balance: 1.2,
    desc: '面向钢铁/建材/航运等「棕色」高碳行业的可信转型资金；存量小但缺口最大。',
    mechanism: '挂钩可持续发展目标(SLB)与转型 KPI，利率随减排进度浮动；目录正在试点。',
    pain: '「既要减碳又不能搞运动式」——转型路径界定难，谨防「假转型」套利与产能误伤。' },
  { key: 'esg', label: 'ESG 投资', accent: '#22d3ee', balance: 45,
    desc: '上市公司可持续发展报告指引推动环境指标可比；A 级领先企业约 15%（示意）。',
    mechanism: '沪深北可持续发展报告指引半强制披露 + ESG 评级/指数 + 责任投资(ESG 基金)。',
    pain: '评级机构口径分化、数据可比性差；「ESG 漂绿」与短期业绩压力下的回撤。' },
  { key: 'deriv', label: '碳金融衍生品', accent: '#f472b6', balance: 0.3,
    desc: '碳远期/碳质押/碳回购等处于试点起步阶段，规模很小，价格发现功能尚未成形。',
    mechanism: '区域试点先行（广碳所等）探索碳远期、碳基金、碳质押融资；全国统一市场暂未放开。',
    pain: '现货市场流动性不足导致衍生品定基缺失；监管对金融化与投机的边界审慎。' },
];

// ── 绿色融资规模趋势（保留原图，扩为三线 + log 可读） ───────────────────────
const growthTrend = {
  legend: { data: ['绿色贷款余额', '绿色债券存量', '碳市场累计成交'], textStyle: { color: '#93a1b5', fontSize: 11 }, top: 0 },
  grid: { ...GRID, top: 32 },
  tooltip: { trigger: 'axis' },
  xAxis: categoryX(['2019', '2020', '2021', '2022', '2023', '2024(E)']),
  yAxis: valueY({ name: '万亿' }),
  series: [
    { name: '绿色贷款余额', type: 'line', smooth: true, symbol: 'circle', symbolSize: 6,
      data: [10.2, 12.0, 15.9, 22.0, 30.1, 35.5], lineStyle: { color: '#10b981', width: 3 }, itemStyle: { color: '#10b981' },
      areaStyle: { color: 'rgba(16,185,129,0.15)' } },
    { name: '绿色债券存量', type: 'line', smooth: true, symbol: 'circle', symbolSize: 5,
      data: [1.1, 1.4, 1.8, 2.8, 3.5, 4.2], lineStyle: { color: '#e8a317', width: 2, type: 'dashed' }, itemStyle: { color: '#e8a317' } },
    { name: '碳市场累计成交', type: 'line', smooth: true, symbol: 'circle', symbolSize: 5,
      data: [0, 0, 0.012, 0.018, 0.025, 0.043], lineStyle: { color: '#c41e3a', width: 2 }, itemStyle: { color: '#c41e3a' } },
  ],
};

// ── 碳价 × 成交量走势（双 Y 轴内联 option） ────────────────────────────────
const carbonPriceTrend = {
  legend: { data: ['CEA 碳价 (元/吨)', '月度成交量 (百万吨)'], textStyle: { color: '#93a1b5', fontSize: 11 }, top: 0 },
  grid: { left: 44, right: 48, top: 32, bottom: 36 },
  tooltip: { trigger: 'axis' },
  xAxis: categoryX(['21H2', '22H1', '22H2', '23H1', '23H2', '24H1', '24H2']),
  yAxis: [
    { type: 'value', name: '元/吨', position: 'left', splitLine: { lineStyle: { color: 'rgba(148,163,184,0.1)' } }, axisLabel: { color: '#93a1b5', fontSize: 10 } },
    { type: 'value', name: '百万吨', position: 'right', splitLine: { show: false }, axisLabel: { color: '#93a1b5', fontSize: 10 } },
  ],
  series: [
    { name: 'CEA 碳价 (元/吨)', type: 'line', smooth: true, symbol: 'circle', symbolSize: 6, yAxisIndex: 0,
      data: [48, 58, 56, 60, 72, 88, 95], lineStyle: { color: '#c41e3a', width: 3 }, itemStyle: { color: '#c41e3a' },
      areaStyle: { color: 'rgba(196,30,58,0.12)' }, markLine: { silent: true, symbol: 'none', lineStyle: { color: '#e8a317', type: 'dashed' }, data: [{ yAxis: 60, label: { formatter: '欧盟 ETS ~600+ 元/吨\n（量级差距）', color: '#e8a317', fontSize: 9 } }] } },
    { name: '月度成交量 (百万吨)', type: 'bar', yAxisIndex: 1, barWidth: 14, itemStyle: { color: 'rgba(34,211,238,0.55)', borderRadius: 2 },
      data: [12, 8, 45, 6, 38, 14, 52] },
  ],
};

// ── 绿色金融体系成熟度雷达（双系列：现状 vs 国际领先，内联 option） ─────────
const SYSTEM_DIMS = ['标准统一', '信息披露', '产品丰富度', '碳定价有效', '激励约束', '国际接轨'];
const systemRadar = {
  legend: { data: ['中国现状', '国际领先基准'], textStyle: { color: '#93a1b5', fontSize: 11 }, top: 0 },
  radar: {
    indicator: SYSTEM_DIMS.map((n) => ({ name: n, max: 100 })),
    axisName: { color: '#93a1b5', fontSize: 10 },
    splitLine: { lineStyle: { color: 'rgba(148,163,184,0.15)' } },
    axisLine: { lineStyle: { color: 'rgba(148,163,184,0.15)' } },
    splitArea: { show: false },
  },
  series: [{
    type: 'radar',
    data: [
      { value: [70, 62, 58, 45, 55, 50], name: '中国现状', lineStyle: { color: '#10b981', width: 2 }, itemStyle: { color: '#10b981' }, areaStyle: { color: 'rgba(16,185,129,0.18)' } },
      { value: [85, 88, 82, 80, 75, 90], name: '国际领先基准', lineStyle: { color: '#e8a317', width: 2, type: 'dashed' }, itemStyle: { color: '#e8a317' }, areaStyle: { color: 'rgba(232,163,23,0.08)' } },
    ],
  }],
};

// ── 绿色资金投向 donut ──────────────────────────────────────────────────
const flowDonut = donutOpt([
  { value: 32, name: '清洁能源', itemStyle: { color: '#10b981' } },
  { value: 24, name: '绿色交通', itemStyle: { color: '#22d3ee' } },
  { value: 20, name: '节能环保', itemStyle: { color: '#e8a317' } },
  { value: 14, name: '绿色建筑', itemStyle: { color: '#a78bfa' } },
  { value: 10, name: '其他/生态修复', itemStyle: { color: 'rgba(148,163,184,0.3)' } },
]);

// ── 转型金融：高碳行业资金需求 vs 供给缺口（堆叠 + 缺口标注） ──────────────
const transitionGap = stackedBarOpt({
  categories: ['钢铁', '建材/水泥', '石化/化工', '有色金属', '航运/航空', '造纸'],
  series: [
    { name: '已落地转型资金', data: [0.32, 0.24, 0.28, 0.15, 0.08, 0.06], itemStyle: { color: '#a78bfa' } },
    { name: '未满足资金缺口', data: [1.18, 0.96, 0.82, 0.55, 0.62, 0.34], itemStyle: { color: 'rgba(196,30,58,0.55)' } },
  ],
});

// ── 绿色金融演进时间线 ──────────────────────────────────────────────────
const STAGES = [
  { period: '2012', title: '绿色信贷指引', accent: '#10b981', desc: '原银监会发布《绿色信贷指引》，首次系统要求银行将环境社会风险纳入授信全流程——绿色金融从概念走向监管框架。' },
  { period: '2016', title: '绿色金融体系指导意见', accent: '#22d3ee', desc: '七部委《关于构建绿色金融体系的指导意见》，确立绿色信贷/债券/基金/保险/碳金融五大支柱，绿色金融上升为国家战略。' },
  { period: '2021', title: '全国碳市场上线', accent: '#c41e3a', desc: '全国碳排放权交易市场启动，电力行业 2000+ 家重点排放单位先行；碳排放第一次被定价为企业财务报表上的刚性成本。' },
  { period: '2022', title: '转型金融框架试点', accent: '#a78bfa', desc: 'G20 转型金融框架获采纳，国内启动转型金融目录试点——从「纯绿」扩展到棕色行业可信转型，回应「运动式减碳」教训。' },
  { period: '2024+', title: '碳定价深化 · 国际接轨', accent: '#e8a317', desc: '碳市场扩围至钢铁/水泥/电解铝，CCER 重启；对接欧盟 CBAM 与可持续披露(ISSB)，中欧分类法趋同推进——碳价向有效水平爬升。' },
];

export default function Page() {
  const [tool, setTool] = useState('carbon');
  const [stage, setStage] = useState(2);
  const t = TOOLS.find((x) => x.key === tool) || TOOLS[2];

  const carbonSector = useMemo(() => ({
    legend: { data: ['配额缺口压力 (%)', '履约完成度'], textStyle: { color: '#93a1b5', fontSize: 11 }, bottom: 0 },
    grid: { left: 100, right: 24, top: 12, bottom: 32 },
    tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
    xAxis: valueY(),
    yAxis: categoryX(['航空/航运', '造纸', '有色/化工', '水泥/建材', '钢铁', '电力']),
    series: [
      { name: '配额缺口压力 (%)', type: 'bar', barWidth: 10, itemStyle: { color: t.accent, borderRadius: 3 },
        data: tool === 'carbon' ? [5, 8, 10, 12, 15, 45] : [3, 5, 6, 8, 10, 30] },
      { name: '履约完成度', type: 'bar', barWidth: 10, itemStyle: { color: '#22d3ee', borderRadius: 3 },
        data: [55, 65, 70, 78, 92, 85] },
    ],
  }), [tool, t]);

  const esgDonut = donutOpt([
    { value: 15, name: 'A 级 (领先)', itemStyle: { color: '#10b981' } },
    { value: 30, name: 'B 级 (中等)', itemStyle: { color: '#22d3ee' } },
    { value: 35, name: 'C 级 (滞后)', itemStyle: { color: '#e8a317' } },
    { value: 10, name: 'D 级 (高风险)', itemStyle: { color: '#c41e3a' } },
    { value: 10, name: '未覆盖', itemStyle: { color: 'rgba(148,163,184,0.25)' } },
  ]);

  return (
    <div>
      <PageHeader badge="Green Finance · 双碳金融" title="绿色信贷债券 · 转型金融" subtitle="碳定价 · ESG · 绿债市场 · 碳金融工具" />
      <IntroCard>把环境外部性「定价」写进资产负债表：绿色贷款、绿色债券、碳市场与转型金融工具并行，目标是在<strong style={{ color: 'var(--text-primary)' }}>双碳约束</strong>下，用百万亿级资金的再配置撬动产业低碳化，同时<strong style={{ color: 'var(--text-primary)' }}>避免运动式减碳</strong>带来的转型风险。绿色金融，是宏观审慎、产业政策与气候目标的交叉接口。</IntroCard>

      <Grid cols={4} className="mb-6">
        <Stat value={`${t.balance}${tool === 'carbon' ? ' 元/吨' : ' 万亿'}`} label={`${t.label} · 切换`} accent={t.accent} />
        <Stat value="35.5 万亿" label="绿色信贷余额 · 全球第一" accent="#10b981" />
        <Stat value="90+ 元/吨" label="CEA 碳价（仍偏低）" accent="#c41e3a" />
        <Stat value="50 亿吨+" label="碳市场年覆盖排放" accent="#e8a317" />
      </Grid>

      {/* 1 · 工具选择器 */}
      <Card title="交互 · 绿色金融工具选择器" className="mb-6">
        <SelectorBar items={TOOLS} activeKey={tool} onSelect={setTool} />
        <div className="os-card p-4 mb-4" style={{ background: 'var(--bg-elevated)', borderLeft: `3px solid ${t.accent}` }}>
          <p className="text-sm leading-relaxed mb-3" style={{ color: 'var(--text-secondary)' }}>{t.desc}</p>
          <Grid cols={2}>
            <div style={{ borderLeft: '2px solid rgba(16,185,129,0.5)', paddingLeft: 10 }}>
              <div className="text-[11px] font-semibold mono mb-0.5" style={{ color: '#10b981' }}>运作机制</div>
              <p className="text-xs leading-relaxed" style={{ color: 'var(--text-tertiary)' }}>{t.mechanism}</p>
            </div>
            <div style={{ borderLeft: '2px solid rgba(196,30,58,0.5)', paddingLeft: 10 }}>
              <div className="text-[11px] font-semibold mono mb-0.5" style={{ color: '#c41e3a' }}>痛点 / 待完善</div>
              <p className="text-xs leading-relaxed" style={{ color: 'var(--text-tertiary)' }}>{t.pain}</p>
            </div>
          </Grid>
        </div>
        <Grid cols={2}>
          <Card title="绿色融资规模趋势（信贷/绿债/碳市场）"><EChart option={growthTrend} style={{ height: 240 }} /></Card>
          <Card title="分行业配额压力（随工具切换）"><EChart option={carbonSector} style={{ height: 240 }} /></Card>
        </Grid>
      </Card>

      {/* 2 · 碳市场专栏 */}
      <Grid cols={2} className="mb-6">
        <Card title="全国碳市场 · 碳价 × 成交量走势">
          <EChart option={carbonPriceTrend} style={{ height: 250 }} />
          <p className="text-[11px] mt-2 leading-relaxed" style={{ color: 'var(--text-tertiary)' }}>
            碳价自 48 元缓升至 90+ 元/吨，但仍显著低于欧盟 ETS；成交高度集中在年度履约期（柱状脉冲），日常流动性偏弱——价格信号尚未充分内化为持续减排激励。
          </p>
        </Card>
        <Card title="绿色资金投向结构">
          <EChart option={flowDonut} style={{ height: 250 }} />
          <p className="text-[11px] mt-2 leading-relaxed" style={{ color: 'var(--text-tertiary)' }}>
            清洁能源与绿色交通合计超半数；绿色建筑、生态修复等长周期低回报领域仍依赖政策性资金补位。
          </p>
        </Card>
      </Grid>

      {/* 3 · 体系成熟度 + 转型金融缺口 */}
      <Grid cols={2} className="mb-6">
        <Card title="绿色金融体系成熟度 · 现状 vs 国际领先">
          <EChart option={systemRadar} style={{ height: 280 }} />
          <p className="text-[11px] mt-2 leading-relaxed" style={{ color: 'var(--text-tertiary)' }}>
            规模/标准已具优势，短板集中在<strong style={{ color: 'var(--text-secondary)' }}>碳定价有效性</strong>与<strong style={{ color: 'var(--text-secondary)' }}>信息披露质量</strong>——量大而价未到位，是当前最关键的「缺口」。
          </p>
        </Card>
        <Card title="转型金融 · 高碳行业资金需求 vs 缺口（万亿，示意）">
          <EChart option={transitionGap} style={{ height: 280 }} />
          <p className="text-[11px] mt-2 leading-relaxed" style={{ color: 'var(--text-tertiary)' }}>
            棕色行业转型需求远超已落地供给（红色为缺口）。难点在「既要减碳、又要不搞运动式」：资金须绑定<strong style={{ color: 'var(--text-secondary)' }}>可信转型 KPI</strong>，既避免「假转型」套利，也防止一刀切误伤产能。
          </p>
        </Card>
      </Grid>

      {/* 4 · A 股 ESG + MRV 三要素 */}
      <Grid cols={2} className="mb-6">
        <Card title="A 股 ESG 评级分布"><EChart option={esgDonut} style={{ height: 250 }} /></Card>
        <Card title="全国碳市场 · MRV 三要素">
          <div className="space-y-2">
            {[['配 · 碳排放配额', '年度基准线法分配 + 有偿拍卖；电力覆盖 99%+。', '#10b981'],
              ['证 · CCER 自愿减排', '抵消比例上限约 5%，2024 年重启，避免低价冲抵。', '#e8a317'],
              ['测 · MRV 监测核查', 'CEMS + 第三方核查；数据造假入刑——核查是碳价可信的地基。', '#22d3ee']].map(([tit, d, c]) => (
              <div key={tit} style={{ borderLeft: `2px solid ${c}`, paddingLeft: 10 }}>
                <div className="text-xs font-semibold" style={{ color: 'var(--text-primary)' }}>{tit}</div>
                <p className="text-[11px] mt-0.5" style={{ color: 'var(--text-tertiary)' }}>{d}</p>
              </div>
            ))}
          </div>
        </Card>
      </Grid>

      {/* 5 · 演进时间线 */}
      <Card title="演进 · 绿色金融十二年（2012 → 2024+）" className="mb-6">
        <TimelineBar stages={STAGES} activeIdx={stage} onSelect={setStage} />
      </Card>

      {/* 6 · 三框架 */}
      <FrameworkTrio cards={[
        { title: '双碳金融引擎', subtitle: '百万亿级撬动', accent: '#10b981', border: '#10b981', body: '碳中和投资需求达百万亿量级，财政难以独力承担。绿色金融的本质是用价格与利率信号，把社会资本「导流」到低碳资产上。', pillars: [['百万亿', '中长期资金需求。'], ['1.75%', '碳减排再贷款利率。'], ['全球#1', '绿色信贷/绿债体量。']] },
        { title: '碳定价机制', subtitle: 'CEA · CCER', accent: '#c41e3a', border: '#c41e3a', body: '当「排碳有价、减碳有偿」成为财务报表的刚性约束，工业转型从行政命令驱动转向内生经济利益驱动——但前提是碳价升到有效水平。', pillars: [['90+ 元/吨', '当前 CEA 基准。'], ['50 亿吨+', '覆盖排放量。'], ['扩围', '钢铁水泥纳入。']] },
        { title: '转型平衡', subtitle: '不搞运动式', accent: '#a78bfa', border: '#a78bfa', body: '从「纯绿」扩展到棕色行业可信转型，核心是把握节奏：避免一刀切式「拉闸限产」，也防止以转型之名行套利之实。', pillars: [['KPI 绑定', '可信转型计划。'], ['防假转型', '目录 + 披露约束。'], ['CBAM 外溢', '出口碳足迹核算。']] },
      ]} />

      <ModuleFooter moduleId="greenfinance" disclaimer="公开资料整理，数值为示意非官方 · 仅供分析框架参考，非投资建议" sourceNote="由 china.html「绿色金融」专题迁移升级" />
    </div>
  );
}
