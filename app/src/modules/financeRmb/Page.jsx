import React, { useState, useMemo } from 'react';
import { PageHeader, Card, Grid, Stat } from '../../app/ui.jsx';
import EChart from '../../lib/viz/EChart.jsx';
import { categoryX, valueY, logY, GRID, donutOpt, radarOpt, stackedBarOpt, AXIS, LABEL } from '../shared/chartHelpers.js';
import { IntroCard, SelectorBar, TimelineBar, FrameworkTrio, ModuleFooter } from '../shared/ModuleParadigm.jsx';

/* ── 职能维度：人民币国际化的六条战线 ──────────────────────────── */
const FUNCTIONS = [
  {
    key: 'trade', label: '贸易结算', accent: '#e8a317', share: 5.8, ceiling: 30,
    progress: '中等偏上', bottleneck: '计价惯性 · 美元报价合同的网络锁定',
    lever: '把全球第一贸易国的规模优势，转译为结算货币的默认选项',
    desc: '人民币首先以跨境贸易结算切入——这是国际化的「滩头阵地」。中国是 140+ 国家的最大贸易伙伴，贸易顺差为人民币输出提供天然管道。但出口商以人民币计价的比例仍受制于美元报价的合同惯性：货物可用人民币结算，定价权却仍握在芝加哥与伦敦的交易所。',
  },
  {
    key: 'invest', label: '投融资', accent: '#22d3ee', share: 3.4, ceiling: 25,
    progress: '受控开放', bottleneck: '资本项目管制 · 离岸池深度不足',
    lever: '债券通 / 沪深港通 / 熊猫债，以「管道式开放」吸纳外资配置人民币资产',
    desc: '人民币要成为国际货币，必须有人愿意持有人民币计价资产。债券通、沪深港通构建了境外资本进出的「闸门式」管道，熊猫债吸引外国主体来华发债。但资本项目尚未完全可兑换——这是国际化的根本约束：既要资产可投，又要资本可控，二者天然对冲。',
  },
  {
    key: 'reserve', label: '储备货币', accent: '#10b981', share: 2.3, ceiling: 15,
    progress: '缓慢爬升', bottleneck: '深度与信任 · 缺乏避险资产地位',
    lever: '推动各国央行配置人民币外储，SDR 篮子权重提供制度背书',
    desc: '储备货币是货币国际化的「皇冠」——意味着他国央行愿意把国家财富托付于你的信用。2016 年人民币入篮 SDR 是制度里程碑，但全球外储中人民币占比仍仅约 2.3%，远低于美元的近 58%。储备地位的本质是危机时的避险信任，而这需要数十年深度市场与法治信用的积累。',
  },
  {
    key: 'pricing', label: '计价货币', accent: '#c41e3a', share: 1.6, ceiling: 20,
    progress: '突破口', bottleneck: '定价权旁落 · 大宗以美元基准报价',
    lever: '原油期货（上海INE）/ 铁矿石 / 黄金，以本币计价撬动美元铁三角',
    desc: '计价权是货币霸权最深的护城河——只要石油、铁矿石、粮食以美元报价，全球就必须先持有美元。上海原油期货、人民币黄金定盘价是撕开缺口的尝试：从「用人民币结算美元定价的货物」走向「用人民币定价货物本身」。这一步最难，却最致命。',
  },
  {
    key: 'commodity', label: '大宗商品', accent: '#a78bfa', share: 4.1, ceiling: 28,
    progress: '地缘加速', bottleneck: '卖方接受度 · 汇率波动对冲成本',
    lever: '与产油国 / 资源国谈本币结算，地缘脱钩压力下的「被迫去美元」红利',
    desc: '大宗商品本币结算是去美元化最现实的战场。中俄能源贸易大幅本币化，中海合作探讨人民币结算原油，巴西等国接受人民币贸易。逻辑冷峻：当美元成为制裁武器，被制裁与潜在被制裁国对「去美元支付管道」的需求被动激增——制裁的副产品，是替代体系的客户名单。',
  },
  {
    key: 'ecny', label: '数字人民币', accent: '#f472b6', share: 1.2, ceiling: 18,
    progress: '基建先行', bottleneck: '跨境互联 · 他国主权货币的接入意愿',
    lever: 'e-CNY + mBridge 多边央行数字货币桥，绕开 SWIFT 的「最后一百米」',
    desc: '数字人民币是一张面向未来的期权。mBridge 多边央行数字货币桥让多国央行在共享账本上直接清算，理论上可绕开 SWIFT 报文体系与代理行链条。可编程性还允许定向监管资金流向。但跨境 e-CNY 的天花板不在技术，而在他国是否愿意把货币主权的一部分接入中国主导的账本。',
  },
];

/* ── 时间线：人民币国际化关键节点 ──────────────────────────────── */
const PHASES = [
  { period: '2009', title: '跨境贸易结算试点', accent: '#64748b', desc: '上海等五城市启动跨境贸易人民币结算试点，人民币首次以官方管道走出国门。彼时全球支付份额几乎不可见，国际化从「贸易货币」的滩头起步。' },
  { period: '2014–2015', title: 'CIPS 一期上线', accent: '#22d3ee', desc: '人民币跨境支付系统（CIPS）一期投产，构建独立于 SWIFT 的清算报文与资金通道——这是「去依赖」基础设施的奠基，主权货币的备份协议。' },
  { period: '2016', title: '纳入 IMF SDR 篮子', accent: '#e8a317', desc: '人民币以约 10.92% 权重入篮特别提款权，成为继美元、欧元、日元、英镑后的第五种篮子货币。制度背书完成，储备货币职能获得 IMF 认证。' },
  { period: '2019–2021', title: 'e-CNY 试点扩大', accent: '#10b981', desc: '数字人民币在深圳、苏州、雄安等地大规模试点，从民生红包走向政务发放与供应链场景，为可编程主权货币与跨境互联探路。' },
  { period: '2022–至今', title: '大宗本币结算加速', accent: '#c41e3a', desc: '地缘脱钩与制裁外溢压力下，中俄能源、中海原油、与多国贸易本币结算扩大，CIPS 参与者突破 1400 家，全球支付份额逼近 5%——去美元化从理念走向账本。' },
];

/* 六维货币国际化能级（示意打分，0–100）—— CNY vs USD */
const RADAR_DIMS = ['贸易结算', '资本可兑换', '离岸市场深度', '储备地位', '金融市场深度', '政治信任/法治'];
const RADAR_CNY = [62, 38, 48, 24, 52, 40];
const RADAR_USD = [85, 96, 98, 95, 99, 88];

export default function Page() {
  const [fn, setFn] = useState('trade');
  const [phaseIdx, setPhaseIdx] = useState(PHASES.length - 1);
  const [shareMetric, setShareMetric] = useState('swift');
  const f = FUNCTIONS.find((x) => x.key === fn) || FUNCTIONS[0];

  /* 交互② · 国际货币份额对比（三个口径切换：SWIFT 支付 / 全球外储 / 外汇交易额） */
  const SHARE_METRICS = [
    { key: 'swift', label: 'SWIFT 跨境支付', unit: '%', note: '全球报文支付占比（美元主导报文网络，人民币缓慢爬升至第 4–5 位）' },
    { key: 'reserve', label: '全球官方外储', unit: '%', note: 'IMF COFER 口径，人民币储备占比长期低位徘徊' },
    { key: 'fx', label: '外汇交易额', unit: '%', note: 'BIS 三年期调查（双边计 200%），人民币交易腿占比快速上升' },
  ];
  const SHARE_DATA = {
    swift: { USD: 47.0, EUR: 22.5, GBP: 7.0, JPY: 4.0, CNY: 4.7, OTHER: 14.8 },
    reserve: { USD: 57.8, EUR: 20.0, JPY: 5.5, GBP: 4.9, CNY: 2.3, OTHER: 9.5 },
    fx: { USD: 44.0, EUR: 15.3, JPY: 8.3, GBP: 6.5, CNY: 3.5, OTHER: 22.4 },
  };
  const sm = SHARE_METRICS.find((x) => x.key === shareMetric) || SHARE_METRICS[0];
  const shareBar = useMemo(() => {
    const d = SHARE_DATA[shareMetric];
    const order = ['USD', 'EUR', 'JPY', 'GBP', 'CNY', 'OTHER'];
    const colorMap = { USD: '#64748b', EUR: '#22d3ee', JPY: '#a78bfa', GBP: '#10b981', CNY: '#c41e3a', OTHER: '#3a4254' };
    return {
      grid: { left: 48, right: 36, top: 16, bottom: 24 },
      tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' }, valueFormatter: (v) => `${v}%` },
      xAxis: valueY({ axisLabel: { formatter: '{value}%' } }),
      yAxis: categoryX(order.slice().reverse()),
      series: [{
        type: 'bar', barWidth: 16, itemStyle: { borderRadius: 3 },
        data: order.slice().reverse().map((k) => ({ value: d[k], itemStyle: { color: colorMap[k] } })),
        label: { show: true, position: 'right', color: LABEL.color, fontSize: 10, formatter: '{c}%' },
      }],
    };
  }, [shareMetric]);

  /* 交互③ · CIPS vs SWIFT 对比（自建管道的去依赖落差，示意） */
  const cipsVsSwift = useMemo(() => stackedBarOpt({
    categories: ['参与机构(百家)', '覆盖国家/地区(十国)', '日均处理(万亿$,×10)'],
    series: [
      { name: 'CIPS', data: [14, 11.4, 0.05], itemStyle: { color: '#c41e3a' }, stack: 'a' },
      { name: 'SWIFT', data: [110, 20, 50], itemStyle: { color: '#64748b' }, stack: 'b' },
    ],
    horizontal: false,
  }), []);

  /* 交互④ · 人民币国际化指数趋势（多线：结算 / 储备 / 计价，2010→2025 示意） */
  const rmbIndex = useMemo(() => ({
    grid: GRID,
    tooltip: { trigger: 'axis' },
    legend: { top: 0, textStyle: { color: LABEL.color, fontSize: 10 }, itemWidth: 12 },
    xAxis: categoryX(['2010', '2013', '2016', '2019', '2022', '2025E']),
    yAxis: valueY(),
    series: [
      { name: '结算职能', type: 'line', smooth: true, symbol: 'circle', symbolSize: 6, data: [0.5, 1.6, 2.3, 2.8, 3.9, 5.1], lineStyle: { color: '#e8a317', width: 2 }, itemStyle: { color: '#e8a317' } },
      { name: '储备职能', type: 'line', smooth: true, symbol: 'circle', symbolSize: 6, data: [0.1, 0.4, 1.1, 1.9, 2.7, 3.0], lineStyle: { color: '#10b981', width: 2 }, itemStyle: { color: '#10b981' } },
      { name: '计价职能', type: 'line', smooth: true, symbol: 'circle', symbolSize: 6, data: [0.2, 0.5, 0.8, 1.0, 1.4, 2.1], lineStyle: { color: '#c41e3a', width: 2 }, itemStyle: { color: '#c41e3a' } },
    ],
  }), []);

  /* 交互⑤ · 六维货币权力雷达 CNY vs USD */
  const powerRadar = useMemo(() => ({
    tooltip: { trigger: 'item' },
    legend: { bottom: 0, textStyle: { color: LABEL.color, fontSize: 10 }, itemWidth: 12 },
    radar: {
      indicator: RADAR_DIMS.map((n) => ({ name: n, max: 100 })),
      axisName: { color: LABEL.color, fontSize: 10 },
      splitLine: { lineStyle: { color: 'rgba(148,163,184,0.15)' } },
      axisLine: { lineStyle: { color: 'rgba(148,163,184,0.15)' } },
      splitArea: { show: false },
    },
    series: [{
      type: 'radar',
      data: [
        { value: RADAR_USD, name: 'USD 美元', lineStyle: { color: '#64748b', width: 2 }, itemStyle: { color: '#64748b' }, areaStyle: { color: 'rgba(100,116,139,0.12)' } },
        { value: RADAR_CNY, name: 'CNY 人民币', lineStyle: { color: '#c41e3a', width: 2 }, itemStyle: { color: '#c41e3a' }, areaStyle: { color: 'rgba(196,30,58,0.15)' } },
      ],
    }],
  }), []);

  /* 职能进度：当前份额 vs 估算天花板（随职能切换） */
  const progressGauge = useMemo(() => ({
    grid: { left: 8, right: 36, top: 8, bottom: 8 },
    xAxis: valueY({ max: f.ceiling, show: false, splitLine: { show: false } }),
    yAxis: { type: 'category', data: ['天花板', '当前'], axisLine: { show: false }, axisTick: { show: false }, axisLabel: { color: LABEL.color, fontSize: 10 } },
    series: [{
      type: 'bar', barWidth: 18, itemStyle: { borderRadius: 3 },
      data: [
        { value: f.ceiling, itemStyle: { color: 'rgba(148,163,184,0.18)' } },
        { value: f.share, itemStyle: { color: f.accent } },
      ],
      label: { show: true, position: 'right', color: LABEL.color, fontSize: 11, formatter: '{c}%' },
    }],
  }), [f]);

  /* 离岸人民币存款分布（示意 donut） */
  const offshorePool = useMemo(() => donutOpt([
    { value: 42, name: '香港 (CNH 枢纽)', itemStyle: { color: '#c41e3a' } },
    { value: 16, name: '新加坡', itemStyle: { color: '#22d3ee' } },
    { value: 12, name: '伦敦', itemStyle: { color: '#10b981' } },
    { value: 9, name: '台湾', itemStyle: { color: '#e8a317' } },
    { value: 8, name: '澳门', itemStyle: { color: '#a78bfa' } },
    { value: 13, name: '其他离岸中心', itemStyle: { color: '#3a4254' } },
  ]), []);

  return (
    <div>
      <PageHeader badge="RMB Intl · 金融主权" title="人民币国际化 · CIPS · e-CNY · 去美元化" subtitle="贸易结算 / 投融资 / 储备 / 计价 / 大宗 / 数字人民币 —— 六条战线的货币权力博弈" />
      <IntroCard>
        在现实主义的世界里，货币是<strong style={{ color: 'var(--text-primary)' }}>主权信用的算法载体</strong>，也是一种可被武器化的权力。美元霸权的真正护城河不是汇率，而是
        <strong style={{ color: 'var(--text-primary)' }}>结算网络（SWIFT）、计价惯性（大宗以美元报价）与避险信任（危机时买美债）</strong>三重锁定。
        人民币国际化的本质，是用全球第一贸易国的规模优势，沿六条战线缓慢侵蚀这三重锁定，构建一套<strong style={{ color: 'var(--text-primary)' }}>平行于美元、可在制裁场景下独立运转的备份体系</strong>——
        而它最深的悖论在于：要让世界持有人民币，必须开放资本项目；要守住金融安全，又必须保留资本管制。国际化与可控性，天然对冲。
      </IntroCard>

      <Grid cols={4} className="mb-6">
        <Stat value="4.7%" label="SWIFT 跨境支付份额 · 第 4–5 位" accent="#c41e3a" />
        <Stat value="2.3%" label="全球官方外储占比 · IMF COFER" accent="#10b981" />
        <Stat value="1400+" label="CIPS 参与机构 · 覆盖 114 国/地区" accent="#22d3ee" />
        <Stat value="~50 万亿" label="跨境人民币结算规模(年,元) · 示意" accent="#e8a317" />
      </Grid>

      {/* ── 交互① 职能维度选择器 ── */}
      <Card title="交互① · 职能维度选择器 —— 六条战线的进展 / 瓶颈 / 抓手" className="mb-6">
        <SelectorBar items={FUNCTIONS} activeKey={fn} onSelect={setFn} />
        <div className="os-card p-4 mb-4" style={{ background: 'var(--bg-elevated)', borderLeft: `3px solid ${f.accent}` }}>
          <div className="flex flex-wrap items-baseline gap-3 mb-2">
            <span className="text-base font-semibold" style={{ color: f.accent }}>{f.label}</span>
            <span className="text-[11px] mono px-2 py-0.5 rounded" style={{ background: 'rgba(255,255,255,0.04)', color: 'var(--text-secondary)' }}>进展 · {f.progress}</span>
            <span className="text-[11px] mono" style={{ color: 'var(--text-tertiary)' }}>当前份额示意 {f.share}%</span>
          </div>
          <p className="text-sm leading-relaxed mb-3" style={{ color: 'var(--text-secondary)' }}>{f.desc}</p>
          <Grid cols={2}>
            <div className="text-xs p-2 rounded" style={{ background: 'rgba(196,30,58,0.06)', borderLeft: '2px solid #c41e3a' }}>
              <span className="font-semibold" style={{ color: '#c41e3a' }}>瓶颈 · </span>
              <span style={{ color: 'var(--text-tertiary)' }}>{f.bottleneck}</span>
            </div>
            <div className="text-xs p-2 rounded" style={{ background: 'rgba(16,185,129,0.06)', borderLeft: '2px solid #10b981' }}>
              <span className="font-semibold" style={{ color: '#10b981' }}>抓手 · </span>
              <span style={{ color: 'var(--text-tertiary)' }}>{f.lever}</span>
            </div>
          </Grid>
        </div>
        <Card title={`${f.label} · 当前份额 vs 估算天花板（示意）`}>
          <EChart option={progressGauge} style={{ height: 140 }} />
        </Card>
      </Card>

      {/* ── 交互② 国际货币份额对比 ── */}
      <Card title="交互② · 国际货币份额对比 —— 三口径切换" className="mb-6">
        <SelectorBar items={SHARE_METRICS} activeKey={shareMetric} onSelect={setShareMetric} />
        <div className="text-xs mb-3 mono" style={{ color: 'var(--text-tertiary)' }}>{sm.note}</div>
        <Grid cols={2}>
          <Card title={`各货币份额 · ${sm.label}`}><EChart option={shareBar} style={{ height: 240 }} /></Card>
          <Card title="离岸人民币(CNH)存款分布 · 示意">
            <EChart option={offshorePool} style={{ height: 240 }} />
          </Card>
        </Grid>
        <div className="text-[11px] italic p-3 mt-4" style={{ color: 'var(--text-tertiary)', borderLeft: '2px solid #e8a317', background: 'rgba(232,163,23,0.06)' }}>
          冷峻的现实：人民币在三个口径中均稳居第 4–5 位，但与美元（外储近 58%）之间是数量级的差距。份额的缓慢爬升不是失败，而是货币国际化本就以「十年」为刻度——美元取代英镑用了半个世纪。
        </div>
      </Card>

      {/* ── 交互③ 阶段时间线 ── */}
      <Card title="交互③ · 国际化阶段时间线 —— 从滩头到账本" className="mb-6">
        <TimelineBar stages={PHASES} activeIdx={phaseIdx} onSelect={setPhaseIdx} />
      </Card>

      {/* ── 图表区：CIPS vs SWIFT + 国际化指数趋势 ── */}
      <Grid cols={2} className="mb-6">
        <Card title="CIPS vs SWIFT —— 自建支付管道的「去依赖」落差">
          <EChart option={cipsVsSwift} style={{ height: 240 }} />
          <p className="text-[11px] leading-relaxed mt-2" style={{ color: 'var(--text-tertiary)' }}>
            CIPS 仍是 SWIFT 的小弟（机构数、覆盖、处理量均有数量级差距），但它的价值不在规模，而在<strong style={{ color: 'var(--text-secondary)' }}>「制裁场景下仍能清算」</strong>的冗余——一条不依赖对手善意的备份管道。柱状已等比缩放，单位见横轴。
          </p>
        </Card>
        <Card title="人民币国际化指数趋势 —— 结算 / 储备 / 计价 三维爬升">
          <EChart option={rmbIndex} style={{ height: 240 }} />
          <p className="text-[11px] leading-relaxed mt-2" style={{ color: 'var(--text-tertiary)' }}>
            三条曲线斜率不同：<strong style={{ color: '#e8a317' }}>结算</strong>最快（贸易规模驱动），<strong style={{ color: '#10b981' }}>储备</strong>次之（SDR 背书），<strong style={{ color: '#c41e3a' }}>计价</strong>最慢（美元定价铁三角最难撼动）。三者的剪刀差，正是国际化的真实瓶颈所在。
          </p>
        </Card>
      </Grid>

      {/* ── 六维货币权力雷达 ── */}
      <Grid cols={2} className="mb-6">
        <Card title="货币国际化六维雷达 —— CNY vs USD（示意打分）">
          <EChart option={powerRadar} style={{ height: 300 }} />
        </Card>
        <Card title="核心逻辑 · 货币权力的三重护城河">
          <p className="text-sm leading-relaxed mb-3" style={{ color: 'var(--text-secondary)' }}>
            雷达图揭示残酷的非对称：人民币在<strong style={{ color: 'var(--text-primary)' }}>贸易结算</strong>维度已接近美元，但在<strong style={{ color: 'var(--text-primary)' }}>资本可兑换、市场深度、储备地位</strong>三个维度差距悬殊。
            这不是政策力度问题，而是结构问题——储备货币地位的本质是<strong style={{ color: 'var(--text-primary)' }}>危机时刻的避险信任</strong>，它无法被「推动」，只能被数十年的法治、深度与开放慢慢「赢得」。
          </p>
          <div className="text-xs italic p-3" style={{ color: 'var(--text-tertiary)', borderLeft: '2px solid #c41e3a', background: 'rgba(196,30,58,0.06)' }}>
            "货币霸权是一种沉默的税收：只要世界用你的货币交易，全球就在为你的赤字融资。挑战它，等于挑战一个国家收取铸币税与豁免金融制裁的特权。"
          </div>
        </Card>
      </Grid>

      {/* ── FrameworkTrio ── */}
      <FrameworkTrio cards={[
        {
          title: '货币权力', subtitle: '铸币权 · 制裁豁免', accent: '#e8a317', border: '#e8a317',
          body: '国际货币地位是一种结构性特权：发行者享有铸币税（全球持有你的现金等于无息贷款），并对金融制裁天然豁免。美元的真正武器不是汇率，而是切断 SWIFT 接入的「核选项」。',
          pillars: [['铸币税', '全球为赤字融资。'], ['制裁豁免', '掌网者不被踢出网。'], ['计价锚', '大宗美元报价惯性。']],
        },
        {
          title: '双轨悖论', subtitle: '管制 vs 国际化', accent: '#22d3ee', border: '#22d3ee',
          body: '人民币国际化最深的张力：要让世界持有人民币资产，必须放开资本项目；要守住不发生系统性风险的底线，又必须保留资本管制。开放与安全天然对冲，故只能「管道式」灰度推进。',
          pillars: [['管道式开放', '债券通/沪深港通。'], ['离岸缓冲', 'CNH 定价隔离窗。'], ['有序可兑换', '速度服从冗余。']],
        },
        {
          title: '去美元化', subtitle: '三路并进', accent: '#c41e3a', border: '#c41e3a',
          body: '去美元化不是宣言，而是基础设施竞赛：本币结算（绕开美元中间货币）+ CIPS（绕开 SWIFT 报文）+ 数字货币（绕开代理行链条）三路并进。制裁外溢，反而为替代体系递上客户名单。',
          pillars: [['本币结算', '中俄/中海能源。'], ['CIPS 清算', '主权备份协议。'], ['mBridge', '多边 CBDC 桥。']],
        },
      ]} />

      <ModuleFooter moduleId="financeRmb" disclaimer="公开资料整理，份额/打分/规模均为示意非官方口径 · 仅供货币国际化分析框架参考，非投资建议" sourceNote="由 china.html「人民币国际化」专题迁移升级" />
    </div>
  );
}
