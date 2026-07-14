import React, { useState, useMemo } from 'react';
import { PageHeader, Card, Grid, Stat, StatGrid } from '../../app/ui.jsx';
import EChart from '../../lib/viz/EChart.jsx';
import { categoryX, valueY, logY, GRID, donutOpt, radarOpt, stackedBarOpt, AXIS, LABEL } from '../shared/chartHelpers.js';
import { IntroCard, SelectorBar, TimelineBar, FrameworkTrio, ModuleFooter } from '../shared/ModuleParadigm.jsx';

// ──────────────────────────────────────────────────────────────────────────
// 运输方式：货运量份额 / 成本 / 效率 / 结构痛点。份额示意，量级取自公开统计口径。
// 物流的第一性问题是「质量×距离」的物理账：单位周转量的能耗与成本决定了结构是否合理。
// 公路以门到门灵活性垄断了短途与时效，却以最高的单位成本与能耗承担了本不该承担的中长途干线——
// 这正是「公转铁、公转水」的全部动机：把不该走公路的货，赶回轨道与水面。
// ──────────────────────────────────────────────────────────────────────────
const MODES = [
  { key: 'road', label: '公路', accent: '#c41e3a',
    volShare: 73.5, turnShare: 32.0, cost: 100, speed: 88, density: 95,
    pain: '占货运量近 3/4，单位周转成本与能耗最高；大量中长途货「该上铁不上铁」，是费用率偏高的结构性主因。' },
  { key: 'rail', label: '铁路', accent: '#22d3ee',
    volShare: 9.5, turnShare: 17.0, cost: 38, speed: 70, density: 55,
    pain: '能耗仅为公路约 1/7，却长期占比偏低；大宗与集装箱「公转铁」是降本与降碳的同一张账单。' },
  { key: 'water', label: '水运', accent: '#3b82f6',
    volShare: 8.0, turnShare: 47.0, cost: 22, speed: 35, density: 30,
    pain: '周转量占比近半、单位成本最低，但受地理与时效约束；铁水联运的「最后一公里」仍是瓶颈。' },
  { key: 'air', label: '航空', accent: '#e8a317',
    volShare: 0.07, turnShare: 0.3, cost: 600, speed: 99, density: 25,
    pain: '量级极小但货值极高；高时效溢价商品的命脉，受腹舱与全货机运力波动影响大。' },
  { key: 'pipe', label: '管道', accent: '#a78bfa',
    volShare: 8.9, turnShare: 3.7, cost: 18, speed: 50, density: 18,
    pain: '油气专线、连续低成本，但只服务单一介质；属能源安全的隐形骨架，不参与通用货运竞争。' },
  { key: 'multimodal', label: '多式联运', accent: '#10b981',
    volShare: 3.5, turnShare: 6.0, cost: 55, speed: 78, density: 60,
    pain: '一单制压缩干线时效与在途不确定性，但换装标准、关务与责任划分仍未完全打通，渗透率偏低。' },
  { key: 'express', label: '快递', accent: '#f472b6',
    volShare: 4.0, turnShare: 1.2, cost: 140, speed: 96, density: 90,
    pain: '业务量全球第一、单票价格逐年探底；末端共配与驿站摊薄成本，但 CR8 高位、价格战吞噬利润。' },
];

// 社会物流总费用占 GDP 比重：中国仍显著高于发达经济体，结构性降本空间清晰。
const COST_RATIO_YEARS = ['2012', '2015', '2018', '2020', '2022', '2023', '2024E', '2027目标'];
const CN_RATIO = [18.0, 16.0, 14.8, 14.7, 14.7, 14.4, 14.1, 12.5];
const US_RATIO = [8.5, 8.0, 7.9, 8.0, 8.7, 8.4, 8.3, 8.2];
const JP_RATIO = [9.0, 8.8, 8.5, 8.5, 8.4, 8.3, 8.2, 8.1];

// 物流演进阶段
const STAGES = [
  { period: '计划经济', title: '仓储运输分割', accent: '#6b7280',
    desc: '物资按计划调拨，仓储与运输条块分割、各管一段；「物流」尚未作为一个整体系统存在，效率服从于分配秩序。' },
  { period: '1990s–2000s', title: '现代物流引入', accent: '#3b82f6',
    desc: '第三方物流、供应链概念引入，高速公路网爆发式扩张；公路以灵活性迅速成为绝对主力，也埋下结构失衡的种子。' },
  { period: '2010s', title: '多式联运 · 降本增效', accent: '#22d3ee',
    desc: '「降低物流成本」上升为国家议题，公转铁公转水、国家物流枢纽布局推进；规模红利见顶，竞争转向效率。' },
  { period: '2018–', title: '智慧物流 · 数字货运', accent: '#10b981',
    desc: '无人仓、自动分拣、即时配送、数字货运平台规模化；数据成为新的调度燃料，履约闭环可审计、可优化。' },
  { period: '2025→', title: '物流强国 · 供应链安全', accent: '#c41e3a',
    desc: '从「成本中心」转向「战略资产」：枢纽+通道+应急三位一体，国产替代与备份通道成为韧性的隐性成本。' },
];

const fmtVol = (v) => (v < 1 ? `${v}%` : `${v}%`);

export default function Page() {
  const [mode, setMode] = useState('road');
  const [stage, setStage] = useState(2);
  const m = MODES.find((x) => x.key === mode) || MODES[0];

  // 业务量/指数走势（随模式切换）—— 保留并扩展原 express/通用双线逻辑
  const TREND = {
    road: [38.5, 40.1, 40.0, 39.0, 38.0, 37.5],
    rail: [3.9, 4.0, 4.5, 4.8, 5.0, 5.2],
    water: [6.6, 6.8, 7.0, 7.2, 7.5, 7.8],
    air: [0.7, 0.7, 0.6, 0.7, 0.8, 0.85],
    pipe: [0.8, 0.85, 0.9, 0.95, 1.0, 1.05],
    multimodal: [100, 145, 220, 310, 380, 450],
    express: [312, 507, 833, 1106, 1320, 1500],
  };
  const trendUnit = mode === 'express' ? '亿件' : mode === 'multimodal' ? '指数' : '亿吨';
  const modeTrend = useMemo(() => ({
    grid: GRID,
    tooltip: { trigger: 'axis' },
    xAxis: categoryX(['2016', '2018', '2020', '2022', '2023', '2024E']),
    yAxis: valueY({ name: trendUnit }),
    series: [{ type: 'line', smooth: true, symbol: 'circle', symbolSize: 6,
      data: TREND[mode] || TREND.road,
      lineStyle: { color: m.accent, width: 2 }, itemStyle: { color: m.accent },
      areaStyle: { color: `${m.accent}18` } }],
  }), [mode, m, trendUnit]);

  // 货运量份额 vs 周转量份额 —— 结构错配的核心一图（双系列内联）
  const shareCompare = useMemo(() => ({
    grid: { left: 44, right: 16, top: 30, bottom: 24 },
    tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' }, formatter: (p) => p.map((x) => `${x.seriesName}: ${x.value}%`).join('<br/>') },
    legend: { top: 0, textStyle: { color: LABEL.color, fontSize: 10 } },
    xAxis: categoryX(MODES.map((x) => x.label)),
    yAxis: valueY({ name: '%' }),
    series: [
      { name: '货运量份额', type: 'bar', barWidth: 12, itemStyle: { color: '#c41e3a', borderRadius: 2 },
        data: MODES.map((x) => ({ value: x.volShare, itemStyle: { color: x.key === mode ? '#fff' : '#c41e3a' } })) },
      { name: '周转量份额', type: 'bar', barWidth: 12, itemStyle: { color: '#22d3ee', borderRadius: 2 },
        data: MODES.map((x) => ({ value: x.turnShare, itemStyle: { color: x.key === mode ? '#f472b6' : '#22d3ee' } })) },
    ],
  }), [mode]);

  // 货运量结构 donut
  const volDonut = useMemo(() => donutOpt(
    MODES.filter((x) => x.volShare >= 0.5).map((x) => ({ name: x.label, value: x.volShare, itemStyle: { color: x.accent } })),
  ), []);

  // 社会物流费用率：中美日对比 + 目标
  const costRatio = useMemo(() => ({
    grid: { left: 40, right: 16, top: 30, bottom: 24 },
    tooltip: { trigger: 'axis', valueFormatter: (v) => `${v}%` },
    legend: { top: 0, textStyle: { color: LABEL.color, fontSize: 10 } },
    xAxis: categoryX(COST_RATIO_YEARS, { rotate: 24 }),
    yAxis: valueY({ name: '% of GDP' }),
    series: [
      { name: '中国', type: 'line', smooth: true, symbol: 'circle', symbolSize: 6, data: CN_RATIO,
        lineStyle: { color: '#c41e3a', width: 2.5 }, itemStyle: { color: '#c41e3a' }, areaStyle: { color: 'rgba(196,30,58,0.1)' },
        markLine: { silent: true, symbol: 'none', lineStyle: { color: '#e8a317', type: 'dashed' },
          data: [{ yAxis: 12.5, label: { formatter: '2027 目标 ~12.5%', color: '#e8a317', fontSize: 9 } }] } },
      { name: '美国', type: 'line', smooth: true, symbol: 'circle', symbolSize: 5, data: US_RATIO,
        lineStyle: { color: '#22d3ee', width: 1.8 }, itemStyle: { color: '#22d3ee' } },
      { name: '日本', type: 'line', smooth: true, symbol: 'circle', symbolSize: 5, data: JP_RATIO,
        lineStyle: { color: '#10b981', width: 1.8 }, itemStyle: { color: '#10b981' } },
    ],
  }), []);

  // 多式联运 / 枢纽布局 bar
  const hubBar = useMemo(() => ({
    grid: { left: 44, right: 28, top: 16, bottom: 24 },
    tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
    xAxis: categoryX(['国家物流枢纽\n(座)', '中欧班列\n(万列/年)', '港口铁水联运\n(百万TEU)', '示范园区\n(十座)', '一单制试点\n(项)'], { interval: 0, fontSize: 9 }),
    yAxis: valueY(),
    series: [{ type: 'bar', barWidth: 26, itemStyle: { borderRadius: 3 },
      data: [
        { value: 125, itemStyle: { color: '#c41e3a' } },
        { value: 1.9, itemStyle: { color: '#22d3ee' } },
        { value: 11.5, itemStyle: { color: '#10b981' } },
        { value: 12, itemStyle: { color: '#e8a317' } },
        { value: 8, itemStyle: { color: '#a78bfa' } },
      ],
      label: { show: true, position: 'top', color: LABEL.color, fontSize: 10 } }],
  }), []);

  // 物流效率雷达（随模式切换，单系列 radarOpt）
  const effRadar = useMemo(() => radarOpt(
    ['时效', '成本优势', '可靠性', '数字化', '网络密度', '绿色化'],
    [
      m.speed,
      120 - m.cost > 100 ? 100 : Math.max(8, 120 - m.cost / 2),
      m.key === 'rail' || m.key === 'pipe' ? 92 : m.key === 'water' ? 80 : 72,
      m.density,
      m.density,
      m.key === 'rail' || m.key === 'water' || m.key === 'pipe' ? 90 : m.key === 'multimodal' ? 78 : 45,
    ],
    { name: m.label, color: m.accent },
  ), [m]);

  // 智慧物流渗透率 bar
  const smartBar = useMemo(() => stackedBarOpt({
    categories: ['无人仓', '自动分拣', '即时配送', '数字货运平台', '无人配送车', '智能调度TMS'],
    series: [{ name: '渗透率', data: [28, 65, 42, 55, 6, 48], itemStyle: { color: '#22d3ee' }, barWidth: 18 }],
  }), []);

  return (
    <div>
      <PageHeader badge="Logistics · 多式联运 / 降本增效" title="社会物流 · 运输结构与供应链韧性"
        subtitle="物流费用率 · 公转铁公转水 · 枢纽网络 · 智慧物流 · 供应链安全" />

      <IntroCard>
        物流是经济体的循环系统，而<strong style={{ color: 'var(--text-primary)' }}>社会物流总费用占 GDP 比重</strong>是它的体温计——
        中国约 <strong style={{ color: '#c41e3a' }}>14.4%</strong>，仍显著高于美日欧的 ~8%。这 6 个百分点的差距，大半不在单环节效率，而在
        <strong style={{ color: 'var(--text-primary)' }}>结构</strong>：近 3/4 的货运量压在单位成本与能耗最高的公路上。
        「公转铁、公转水」不是口号，而是一笔能耗、成本与碳的同一张账单。规模红利见顶之后，竞争从「跑得多」转向「调得准、扛得住」。
      </IntroCard>

      <StatGrid className="mb-6">
        <Stat value="352 万亿" label="社会物流总额 (2023 示意)" accent="#c41e3a" />
        <Stat value="14.4%" label="物流总费用 / GDP" accent="#e8a317" />
        <Stat value="125 座" label="国家物流枢纽 (示意)" accent="#22d3ee" />
        <Stat value="1,320+ 亿件" label="快递业务量 · 全球第一" accent="#10b981" />
      </StatGrid>

      {/* 运输方式选择器 */}
      <Card title="交互 · 运输方式选择器（份额 / 成本 / 效率 / 痛点）" className="mb-6">
        <SelectorBar items={MODES} activeKey={mode} onSelect={setMode} />
        <div className="os-card p-4 mb-4" style={{ background: 'var(--bg-elevated)', borderLeft: `3px solid ${m.accent}` }}>
          <div className="flex flex-wrap gap-6 mb-2">
            <div><span className="text-[11px]" style={{ color: 'var(--text-tertiary)' }}>货运量份额</span>
              <div className="text-lg font-semibold mono" style={{ color: m.accent }}>{fmtVol(m.volShare)}</div></div>
            <div><span className="text-[11px]" style={{ color: 'var(--text-tertiary)' }}>周转量份额</span>
              <div className="text-lg font-semibold mono" style={{ color: 'var(--text-primary)' }}>{m.turnShare}%</div></div>
            <div><span className="text-[11px]" style={{ color: 'var(--text-tertiary)' }}>单位成本指数</span>
              <div className="text-lg font-semibold mono" style={{ color: '#e8a317' }}>{m.cost}</div></div>
            <div><span className="text-[11px]" style={{ color: 'var(--text-tertiary)' }}>时效得分</span>
              <div className="text-lg font-semibold mono" style={{ color: '#22d3ee' }}>{m.speed}</div></div>
          </div>
          <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{m.pain}</p>
        </div>
        <Grid cols={2}>
          <Card title="量份额走势（随模式切换）"><EChart option={modeTrend} style={{ height: 220 }} /></Card>
          <Card title="运输效率雷达（随模式切换）"><EChart option={effRadar} style={{ height: 220 }} /></Card>
        </Grid>
      </Card>

      {/* 货运结构 */}
      <Grid cols={2} className="mb-6">
        <Card title="货运量份额 vs 周转量份额 · 结构错配">
          <EChart option={shareCompare} style={{ height: 240 }} />
          <p className="text-[11px] mt-2" style={{ color: 'var(--text-tertiary)' }}>
            公路在「量」上占绝对主力，水运在「周转量」上反超——说明大量短途货压在公路、长途货本应更多走水铁。错配即成本。
          </p>
        </Card>
        <Card title="货运量结构（公转铁公转水的起点）">
          <EChart option={volDonut} style={{ height: 240 }} />
        </Card>
      </Grid>

      {/* 费用率趋势 */}
      <Card title="社会物流总费用占 GDP 比重 · 中美日对比与降本目标" className="mb-6">
        <EChart option={costRatio} style={{ height: 260 }} />
        <p className="text-[11px] mt-2" style={{ color: 'var(--text-tertiary)' }}>
          中国费用率十年缓降但仍高于美日近 6 个点；十四五以来政策目标向 12.5% 区间收敛，差距主要在运输结构与库存周转，而非单环节装卸效率。
        </p>
      </Card>

      {/* 枢纽 + 智慧物流 */}
      <Grid cols={2} className="mb-6">
        <Card title="多式联运 / 枢纽布局（示意量级）"><EChart option={hubBar} style={{ height: 240 }} /></Card>
        <Card title="智慧物流渗透率（示意 %）">
          <EChart option={smartBar} style={{ height: 240 }} />
          <p className="text-[11px] mt-2" style={{ color: 'var(--text-tertiary)' }}>
            自动分拣已近成熟，无人仓与无人配送车仍在规模化早期；数字货运平台把分散运力重新组织为可调度的网络。
          </p>
        </Card>
      </Grid>

      {/* 时间线 */}
      <Card title="物流演进 · 从仓储运输分割到供应链安全" className="mb-6">
        <TimelineBar stages={STAGES} activeIdx={stage} onSelect={setStage} />
      </Card>

      {/* 仓配能力 */}
      <Card title="仓配自动化与智能调度" className="mb-6">
        <Grid cols={3}>
          {[['立体仓与机器人', 'AGV/AMR + WMS/TMS 联动，把人找货变为货找人，形成可审计的履约闭环。', '#22d3ee'],
            ['预测补货 AI', '多步需求预测压低安全库存，命中率示意 ~98%，库存周转是费用率的第二战场。', '#e8a317'],
            ['数字货运平台', '把零散车货撮合为可调度运力池，降低空驶率，重塑公路这一最大成本项的效率。', '#10b981'],
            ['多式联运关务', '口岸数字化与一单制缩短在途不确定性，是公转铁公转水真正落地的软件底座。', '#3b82f6'],
            ['即时配送网络', '30 分钟达把仓配压到城市毛细血管，时效溢价换取末端密度护城河。', '#f472b6'],
            ['绿色与新能源运力', '新能源货车与铁水替代进入 KPI 核心，降碳与降本在中长途上是同一笔账。', '#a78bfa']].map(([t, d, c]) => (
            <div key={t} style={{ borderLeft: `2px solid ${c}`, paddingLeft: 10 }}>
              <div className="text-xs font-semibold" style={{ color: 'var(--text-primary)' }}>{t}</div>
              <p className="text-[11px] mt-0.5 leading-relaxed" style={{ color: 'var(--text-tertiary)' }}>{d}</p>
            </div>
          ))}
        </Grid>
      </Card>

      <FrameworkTrio cards={[
        { title: '降本即增效', subtitle: '14.4% → 12.5%', accent: 'var(--fire-gold)', border: 'var(--fire-gold)',
          body: '物流费用率是经济效率的体温计：每降一个百分点，对应万亿级的全社会节约。差距主要在结构而非单环节，降本的本质是把货放回正确的运输方式上。',
          pillars: [['结构', '公转铁公转水。'], ['库存', '预测 AI 降周转。'], ['数字化', '全链路可视可调。']] },
        { title: '结构优化', subtitle: '公转铁 · 公转水', accent: 'var(--cyber-cyan)', border: 'var(--cyber-cyan)',
          body: '一笔能耗与成本的物理账：铁路单位能耗约为公路 1/7，水运单位成本最低。把中长途大宗从公路赶回轨道与水面，降本与降碳是同一张账单。',
          pillars: [['能耗账', '铁水更省。'], ['联运', '一单制打通换装。'], ['碳约束', '进入考核核心。']] },
        { title: '网络韧性', subtitle: '枢纽 + 通道 + 应急', accent: 'var(--china-red)', border: 'var(--china-red)',
          body: '物流从成本中心升级为战略资产：供应链安全短板在数字化与应急两维，极端情景下备份通道、国产替代与冗余库存构成隐性但必要的成本。',
          pillars: [['枢纽', '干支衔接血管。'], ['通道', '陆海双向冗余。'], ['自主', '关键软件替代。']] },
      ]} />

      <ModuleFooter moduleId="logistics"
        disclaimer="份额/费用率/枢纽数均为公开口径整理后的示意值，非官方统计 · 仅供分析框架参考"
        sourceNote="由 china.html「物流」专题迁移并大幅扩容" />
    </div>
  );
}
