import React, { useState, useMemo } from 'react';
import { PageHeader, Card, Grid, Stat } from '../../app/ui.jsx';
import EChart from '../../lib/viz/EChart.jsx';
import { categoryX, valueY, logY, GRID, donutOpt, radarOpt, stackedBarOpt } from '../shared/chartHelpers.js';
import { IntroCard, SelectorBar, TimelineBar, FrameworkTrio, ModuleFooter } from '../shared/ModuleParadigm.jsx';

// ---------------------------------------------------------------------------
// 数据区（示意值 · 公开资料量级整理）
// ---------------------------------------------------------------------------

/** 交互① · 战略通道（六选一）：进展 / 投资 / 战略价值 / 风险三类 */
const CORRIDORS = [
  {
    key: 'cre', label: '中欧班列', accent: '#c41e3a', status: '成熟运营',
    invest: '存量通道 · 边际投资低', value: '陆权动脉 · 海运中断时的唯一规模化陆路备份',
    risk: '俄乌战争下的过境俄罗斯依赖 · 制裁合规与保险成本',
    desc: '横贯欧亚的标准化集装箱班列网络。2024 年开行约 1.9 万列，红海危机期间舱位一度紧张——市场用真金白银为陆路备份定价。短板同样清晰：约九成主力线路过境俄罗斯，地缘单点依赖未解。',
    dims: [92, 55, 90, 62], // 进展 / 投资强度 / 战略价值 / 风险敞口
  },
  {
    key: 'cpec', label: '中巴经济走廊', accent: '#e8a317', status: '深度重资产',
    invest: '累计承诺 ~620 亿$ · 能源占大头', value: '印度洋直达通道 · 绕开马六甲的理论解',
    risk: '安全风险最高（针对中方人员袭击）· 巴方主权债务与电力欠费',
    desc: 'BRI 旗舰走廊与最沉重的资产负债表。瓜达尔港吞吐量长期低迷，能源项目电费拖欠累积；俾路支武装多次袭击中方目标，安保成本已成隐性投资。「旗舰」与「包袱」一线之隔。',
    dims: [58, 88, 72, 90],
  },
  {
    key: 'laos', label: '中老铁路 · 泛亚', accent: '#10b981', status: '已通车 · 延伸中',
    invest: '中老段 ~59 亿$ · 中泰段推进', value: '中南半岛纵深 · 对接 RCEP 产业链转移',
    risk: '老挝主权债务/GDP 比例高企 · 中泰段进度反复',
    desc: '泛亚铁路中线的现实样板：2021 年通车后客货两旺，万象到昆明从 2 天压到 10 小时，老挝由「陆锁国」转向「陆联国」。代价是老挝公共债务率被推高，债务重组谈判常态化——单国小体量与大基建的张力标本。',
    dims: [78, 70, 75, 68],
  },
  {
    key: 'ports', label: '海上丝路港口链', accent: '#22d3ee', status: '网络化运营',
    invest: '数十港口股权/经营权 · 长周期', value: '航运节点控制力 · 中资航运物流网络的物理底座',
    risk: '「珍珠链」叙事引发驻在国与第三方警觉 · 个别港口商业回报存疑',
    desc: '从比雷埃夫斯到钱凯，中资以股权、特许经营权嵌入全球港口网络。多数是招商局/中远海运的商业棋局，但军民两用的想象空间让每一笔收购都自带地缘解读。',
    dims: [82, 75, 85, 58],
  },
  {
    key: 'ckU', label: '中吉乌铁路（在建）', accent: '#a855f7', status: '2024 动工',
    invest: '估算 ~80 亿$ · 三方合资', value: '绕开俄罗斯的中亚-西亚新通道 · 中欧班列南线对冲',
    risk: '高山地质 · 吉国财政承受力 · 沿线政局',
    desc: '讨论了二十多年的项目在俄乌战争后火速落地——时机本身就是地缘信号：为过境俄罗斯的班列主干寻找南线备份。穿越天山的工程难度与吉尔吉斯斯坦的出资能力，是图纸与现实之间的距离。',
    dims: [25, 60, 80, 72],
  },
  {
    key: 'dsr', label: '数字丝路', accent: '#64748b', status: '轻资产扩张',
    invest: '单体投资小 · 规则黏性强', value: '光缆/数据中心/电商/移动支付 · 标准与生态出海',
    risk: '美欧「清洁网络」式排挤 · 数据主权摩擦',
    desc: '从重资产转向轻资产的缩影：一条跨境光缆、一套智慧城市系统的造价远低于铁路，但技术标准与运营生态的锁定效应更持久。这也是美欧防范最严的赛道。',
    dims: [70, 50, 78, 55],
  },
];

const DIM_LABELS = ['进展成熟度', '投资强度', '战略价值', '风险敞口'];

/** 中欧班列：开行量（千列）+ 回程重箱比例（%） */
const CRE_YEARS = ['2014', '2016', '2018', '2020', '2022', '2023', '2024'];
const CRE_TRIPS = [0.3, 1.7, 6.3, 12.4, 16.0, 17.0, 19.0];
const CRE_RETURN = [18, 35, 48, 55, 58, 60, 62];

/** 投资结构演进（亿$ · 示意）：大基建 → 小而美/绿色/数字 */
const STRUCT_YEARS = ['2015', '2017', '2019', '2021', '2023', '2025E'];
const STRUCT_SERIES = [
  { name: '交通/港口大基建', color: '#64748b', data: [420, 510, 380, 260, 210, 190] },
  { name: '传统能源', color: '#c41e3a', data: [310, 360, 300, 200, 150, 120] },
  { name: '绿色能源', color: '#10b981', data: [30, 60, 90, 150, 230, 290] },
  { name: '数字丝路', color: '#22d3ee', data: [20, 45, 70, 110, 160, 210] },
  { name: '小而美民生', color: '#e8a317', data: [10, 20, 35, 60, 95, 130] },
];

/** 关键港口（示意） */
const PORTS = [
  { name: '比雷埃夫斯', country: '希腊', stake: '中远海运 67%', metric: 88, accent: '#10b981',
    note: '商业最成功样本：吞吐量进入欧洲前列，从濒危港到地中海枢纽。' },
  { name: '钱凯', country: '秘鲁', stake: '中远海运 60%', metric: 72, accent: '#22d3ee',
    note: '2024 年开港，南美直航上海 23 天，绕开北美中转——西半球最受瞩目的新节点。' },
  { name: '瓜达尔', country: '巴基斯坦', stake: '中国海外港控运营', metric: 30, accent: '#e8a317',
    note: '战略叙事远大于商业现实：腹地经济薄弱，吞吐量长期低位。' },
  { name: '汉班托塔', country: '斯里兰卡', stake: '99 年租约 (招商局)', metric: 42, accent: '#c41e3a',
    note: '「债务陷阱论」的标志案例；实证研究多指向斯方主动租赁换流动性，而非违约没收。' },
];

/** 债务构成（低收入受援国外债 · 示意 %） */
const DEBT_DONUT = [
  { value: 26, name: '中国（官方+政策性银行）', itemStyle: { color: '#c41e3a' } },
  { value: 30, name: '多边机构（世行/IMF等）', itemStyle: { color: '#22d3ee' } },
  { value: 24, name: '西方商业债券持有人', itemStyle: { color: '#e8a317' } },
  { value: 12, name: '巴黎俱乐部双边', itemStyle: { color: '#64748b' } },
  { value: 8, name: '其他', itemStyle: { color: '#475569' } },
];

/** 区域投资重心（保留原交互） */
const REGIONS = [
  { key: 'asean', label: '东南亚 ASEAN', accent: '#c41e3a', share: 34, desc: 'RCEP 与产业链转移叠加，投资、本币结算与产能合作最密集区域。' },
  { key: 'mideast', label: '中东/中亚', accent: '#e8a317', share: 22, desc: '能源与互联互通枢纽，承接油气合作与陆海新通道延伸。' },
  { key: 'africa', label: '非洲', accent: '#22d3ee', share: 20, desc: '资源与基建并重，小而美民生项目改善民心相通。' },
  { key: 'europe', label: '欧洲/第三方', accent: '#10b981', share: 14, desc: '中欧班列通道与发达经济体联合开发第三国市场。' },
];

/** 倡议演进时间线（五段） */
const PHASES = [
  { period: '2013', title: '倡议提出', accent: '#64748b', desc: '哈萨克斯坦与雅加达两场演讲定调「丝绸之路经济带」与「21 世纪海上丝绸之路」。彼时外储高位、产能过剩、马六甲焦虑三重动因叠加——资本需要出口，地缘需要纵深。' },
  { period: '2014–2017', title: '高峰论坛 · 大基建潮', accent: '#c41e3a', desc: '亚投行、丝路基金相继成立，首届高峰论坛 29 国元首与会。政策性银行信贷井喷，重资产项目沿六廊六路铺开，签约金额以「万亿」计——速度优先于回报测算。' },
  { period: '2018–2020', title: '债务争议与回调', accent: '#e8a317', desc: '汉班托塔租约引爆「债务陷阱」叙事，马来西亚东海岸铁路重谈、多国项目缩水。叠加疫情冲击，政策性银行海外信贷断崖式收缩——扩张期的坏账开始进入消化期。' },
  { period: '2021–2022', title: '小而美转向', accent: '#10b981', desc: '官方话语转为「小而美、惠民生」；承诺停建境外煤电，绿色与数字项目占比抬升。单体规模缩小、回报周期缩短、ESG 合规前置——从规模叙事转向风控叙事。' },
  { period: '2023–至今', title: '高质量共建 2.0', accent: '#22d3ee', desc: '十周年峰会确立「高质量共建」框架；意大利退出、美欧推出 PGII/全球门户对冲。BRI 进入存量运营+精准增量阶段：班列扩容、钱凯开港、中吉乌动工——少签约、多落地。' },
];

// ---------------------------------------------------------------------------

export default function Page() {
  const [corridor, setCorridor] = useState('cre');
  const [region, setRegion] = useState('asean');
  const [phaseIdx, setPhaseIdx] = useState(4);
  const c = CORRIDORS.find((x) => x.key === corridor) || CORRIDORS[0];
  const r = REGIONS.find((x) => x.key === region) || REGIONS[0];

  // 通道四维画像（随通道切换）
  const corridorDims = useMemo(() => ({
    grid: { left: 84, right: 40, top: 16, bottom: 24 },
    xAxis: valueY({ max: 100 }),
    yAxis: categoryX(DIM_LABELS),
    series: [{
      type: 'bar', barWidth: 16, itemStyle: { borderRadius: 3 },
      data: c.dims.map((v, i) => ({
        value: v,
        itemStyle: { color: i === 3 ? '#c41e3a' : c.accent, opacity: i === 3 ? 0.9 : 1 },
      })),
      label: { show: true, position: 'right', color: '#93a1b5', fontSize: 10 },
    }],
  }), [c]);

  // 六通道战略价值对比（高亮选中）
  const corridorCompare = useMemo(() => ({
    grid: { left: 36, right: 16, top: 16, bottom: 56 },
    xAxis: categoryX(CORRIDORS.map((x) => x.label), { rotate: 24, fontSize: 9 }),
    yAxis: valueY({ max: 100 }),
    series: [{
      type: 'bar', barWidth: 18, itemStyle: { borderRadius: 3 },
      data: CORRIDORS.map((x) => ({
        value: x.dims[2],
        itemStyle: { color: x.accent, opacity: x.key === corridor ? 1 : 0.4 },
      })),
      label: { show: true, position: 'top', color: '#93a1b5', fontSize: 9 },
    }],
  }), [corridor]);

  // 中欧班列：开行量（柱）+ 回程比例（线 · 右轴）
  const creOpt = useMemo(() => ({
    tooltip: { trigger: 'axis' },
    legend: { textStyle: { color: '#93a1b5', fontSize: 10 }, itemWidth: 12, top: 0 },
    grid: { left: 44, right: 44, top: 30, bottom: 24 },
    xAxis: categoryX(CRE_YEARS),
    yAxis: [
      valueY({ name: '千列', nameTextStyle: { color: '#93a1b5', fontSize: 9 } }),
      valueY({ max: 100, splitLine: { show: false }, name: '%', nameTextStyle: { color: '#93a1b5', fontSize: 9 } }),
    ],
    series: [
      { name: '年开行量（千列）', type: 'bar', barWidth: 16, data: CRE_TRIPS,
        itemStyle: { color: '#c41e3a', borderRadius: 3 } },
      { name: '回程重箱率 %', type: 'line', yAxisIndex: 1, smooth: true, symbol: 'circle', symbolSize: 6,
        data: CRE_RETURN, lineStyle: { color: '#22d3ee', width: 2 }, itemStyle: { color: '#22d3ee' } },
    ],
  }), []);

  // 投资结构演进 stackedBar
  const structOpt = useMemo(() => stackedBarOpt({
    categories: STRUCT_YEARS,
    series: STRUCT_SERIES.map((s) => ({ name: s.name, data: s.data, itemStyle: { color: s.color } })),
  }), []);

  // 港口运营指数 bar
  const portBar = useMemo(() => ({
    grid: { left: 72, right: 40, top: 16, bottom: 24 },
    xAxis: valueY({ max: 100 }),
    yAxis: categoryX(PORTS.map((p) => p.name)),
    series: [{
      type: 'bar', barWidth: 16, itemStyle: { borderRadius: 3 },
      data: PORTS.map((p) => ({ value: p.metric, itemStyle: { color: p.accent } })),
      label: { show: true, position: 'right', color: '#93a1b5', fontSize: 10 },
    }],
  }), []);

  // 债务构成 donut
  const debtDonut = useMemo(() => donutOpt(DEBT_DONUT), []);

  // BRI 五通+双转型 雷达（单系列）
  const briRadar = useMemo(() => radarOpt(
    ['基建联通', '贸易畅通', '资金融通', '民心相通', '数字丝路', '绿色转型'],
    [82, 76, 58, 52, 66, 60],
    { name: 'BRI 进展（示意）', color: '#c41e3a' },
  ), []);

  // 区域投资走势（保留原交互）
  const fdiTrend = useMemo(() => ({
    grid: GRID,
    xAxis: categoryX(['2013', '2016', '2019', '2022', '2024E']),
    yAxis: valueY(),
    series: [{ type: 'line', smooth: true, symbol: 'circle', symbolSize: 6,
      data: [120, 145, 160, 185, region === 'asean' ? 220 : 210],
      lineStyle: { color: r.accent, width: 2 }, itemStyle: { color: r.accent },
      areaStyle: { color: `${r.accent}18` } }],
  }), [region, r]);

  const regionDonut = useMemo(() => donutOpt(REGIONS.map((x) => ({
    value: x.share, name: x.label.split(' ')[0],
    itemStyle: { color: x.accent, opacity: x.key === region ? 1 : 0.5 },
  }))), [region]);

  return (
    <div>
      <PageHeader badge="BRI · 系统视角" title="一带一路 · 重塑欧亚的互联互通" subtitle="六廊六路多国多港 —— 以设施联通撬动产能、标准与货币的外溢" />
      <IntroCard>
        自 2013 年提出以来，倡议依托六廊六路多国多港骨架，将港口、铁路、电网与数字基建嵌入沿线经济体。它既是产能与资本的<strong style={{ color: 'var(--text-primary)' }}>输出通道</strong>，也是人民币区域化与规则话语权的试验场。十余年后，它正从「万亿签约」的扩张叙事，切换到「债务消化 + 小而美 + 高质量 2.0」的风控叙事——读懂这条切换曲线，比记住任何单一项目都重要。
      </IntroCard>

      <Grid cols={4} className="mb-6">
        <Stat value="150+ 国" label="签署合作文件国家（示意）" accent="#c41e3a" />
        <Stat value="9 万列+" label="中欧班列累计开行（示意）" accent="#e8a317" />
        <Stat value="40+ 个" label="参与投建运营海外港口（示意）" accent="#22d3ee" />
        <Stat value="1 万亿$+" label="累计投资与工程承包（示意）" accent="#10b981" />
      </Grid>

      {/* ----------------------------------------------------------------- */}
      <Card title="交互① · 战略通道选择器 — 进展 / 投资 / 价值 / 风险" className="mb-6">
        <SelectorBar items={CORRIDORS} activeKey={corridor} onSelect={setCorridor} />
        <div className="os-card p-4 mb-4" style={{ background: 'var(--bg-elevated)', borderLeft: `3px solid ${c.accent}` }}>
          <div className="flex flex-wrap items-baseline gap-2 mb-2">
            <span className="text-sm font-semibold" style={{ color: c.accent }}>{c.label}</span>
            <span className="text-[11px] mono px-2 py-0.5 rounded" style={{ background: 'var(--bg-surface)', color: 'var(--text-tertiary)', border: '1px solid var(--border-subtle)' }}>{c.status}</span>
          </div>
          <p className="text-sm leading-relaxed mb-3" style={{ color: 'var(--text-secondary)' }}>{c.desc}</p>
          <Grid cols={3}>
            {[['投资', c.invest, c.accent], ['战略价值', c.value, '#22d3ee'], ['风险', c.risk, '#c41e3a']].map(([t, d, col]) => (
              <div key={t}>
                <div className="text-xs font-semibold mb-1" style={{ color: col }}>{t}</div>
                <p className="text-[11px] leading-relaxed" style={{ color: 'var(--text-tertiary)' }}>{d}</p>
              </div>
            ))}
          </Grid>
        </div>
        <Grid cols={2}>
          <Card title={`通道四维画像 — ${c.label}（风险敞口恒以红色标示）`}><EChart option={corridorDims} style={{ height: 220 }} /></Card>
          <Card title="六通道战略价值对比（高亮选中 · 示意指数）"><EChart option={corridorCompare} style={{ height: 220 }} /></Card>
        </Grid>
      </Card>

      {/* ----------------------------------------------------------------- */}
      <Card title="中欧班列 · 陆权动脉的真实成色" className="mb-6">
        <Grid cols={2}>
          <div>
            <EChart option={creOpt} style={{ height: 260 }} />
            <p className="text-xs mt-2 leading-relaxed" style={{ color: 'var(--text-tertiary)' }}>开行量（左轴 · 千列）与回程重箱率（右轴 · %）· 示意值</p>
          </div>
          <div className="space-y-3">
            {[
              ['回程问题的实质', '早期「去十回三」的空箱率是补贴依赖的注脚；回程重箱率爬升到六成以上，意味着欧洲对华出口与中亚回程货开始填实这条通道——商业逻辑在缓慢接管补贴逻辑。', '#e8a317'],
              ['红海危机的压力测试', '2023 年末红海航线中断后，班列询价与订舱量跳升。海运每多一次系统性中断，陆路备份的期权价值就被市场重估一次——这是 BRI 最硬核的存在理由之一。', '#c41e3a'],
              ['单点依赖未解', '主力线路约九成过境俄罗斯。制裁合规、保险加价与潜在的政治风险，使中吉乌南线与跨里海中间走廊的对冲价值持续上升。', '#22d3ee'],
            ].map(([t, d, col]) => (
              <div key={t} className="os-card p-3" style={{ background: 'var(--bg-elevated)', borderLeft: `3px solid ${col}` }}>
                <div className="text-xs font-semibold mb-1" style={{ color: col }}>{t}</div>
                <p className="text-[11px] leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{d}</p>
              </div>
            ))}
          </div>
        </Grid>
      </Card>

      {/* ----------------------------------------------------------------- */}
      <Card title="投资结构演进 · 从大基建到小而美（亿$ · 示意）" className="mb-6">
        <EChart option={structOpt} style={{ height: 280 }} />
        <p className="text-xs mt-3 leading-relaxed" style={{ color: 'var(--text-tertiary)' }}>
          灰色与红色（交通大基建 + 传统能源）的萎缩，与绿/青/金（绿色、数字、民生）的抬升构成同一条曲线的两面：不是收缩，是<span style={{ color: 'var(--text-secondary)' }}>资产负债表的再定价</span>——重资产长周期项目的坏账教训，被转译为轻资产、短周期、强黏性的投资纪律。
        </p>
      </Card>

      {/* ----------------------------------------------------------------- */}
      <Card title="海上丝路港口链 · 节点与「珍珠链」之辩" className="mb-6">
        <Grid cols={2} className="mb-4">
          <Card title="关键港口运营成色指数（示意 · 0-100）"><EChart option={portBar} style={{ height: 220 }} /></Card>
          <div className="space-y-2">
            {PORTS.map((p) => (
              <div key={p.name} className="os-card p-3" style={{ background: 'var(--bg-elevated)', borderLeft: `3px solid ${p.accent}` }}>
                <div className="flex flex-wrap items-baseline gap-2">
                  <span className="text-xs font-semibold" style={{ color: p.accent }}>{p.name} · {p.country}</span>
                  <span className="text-[10px] mono" style={{ color: 'var(--text-tertiary)' }}>{p.stake}</span>
                </div>
                <p className="text-[11px] mt-1 leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{p.note}</p>
              </div>
            ))}
          </div>
        </Grid>
        <p className="text-xs leading-relaxed" style={{ color: 'var(--text-tertiary)' }}>
          关于「珍珠链」：将商业港口网络读作军事基地链，目前缺乏与吉布提之外案例匹配的实证；但港口天然军民两用，驻在国与第三方的警觉本身就是真实的地缘成本——无论初衷如何，都已计入定价。
        </p>
      </Card>

      {/* ----------------------------------------------------------------- */}
      <Card title="债务可持续争议 · 「陷阱论」与实证" className="mb-6">
        <Grid cols={2}>
          <Card title="典型低收入受援国外债构成（示意 %）"><EChart option={debtDonut} style={{ height: 250 }} /></Card>
          <div className="space-y-3">
            {[
              ['「债务陷阱」叙事', '以汉班托塔 99 年租约为图腾：高息贷款 → 违约 → 资产没收。叙事简洁有力，在西方政策圈与受援国反对派中传播极广。', '#e8a317'],
              ['实证侧的反驳', '约翰·霍普金斯 CARI、查塔姆研究所等多项研究指向：斯里兰卡债务危机主因是国际主权债券（高息商业债）而非中国贷款；租赁系斯方主动换取流动性，未发生「没收」。多数受援国对华债务占外债比重低于多边与商业债权人。', '#10b981'],
              ['真问题在哪', '不在「陷阱」而在「定价」：项目可行性评估让位于政治进度、贷款合同保密条款削弱重组协调、中方长期游离于巴黎俱乐部框架外。债务重组中的「同等受偿」拉锯（如赞比亚案）才是制度层面的真实摩擦。', '#c41e3a'],
            ].map(([t, d, col]) => (
              <div key={t} className="os-card p-3" style={{ background: 'var(--bg-elevated)', borderLeft: `3px solid ${col}` }}>
                <div className="text-xs font-semibold mb-1" style={{ color: col }}>{t}</div>
                <p className="text-[11px] leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{d}</p>
              </div>
            ))}
          </div>
        </Grid>
      </Card>

      {/* ----------------------------------------------------------------- */}
      <Card title="交互② · 倡议演进时间线（2013 → 高质量 2.0）" className="mb-6">
        <TimelineBar stages={PHASES} activeIdx={phaseIdx} onSelect={setPhaseIdx} />
      </Card>

      {/* ----------------------------------------------------------------- */}
      <Card title="交互③ · 区域投资重心选择器" className="mb-6">
        <SelectorBar items={REGIONS} activeKey={region} onSelect={setRegion} />
        <div className="os-card p-4 mb-4" style={{ background: 'var(--bg-elevated)', borderLeft: `3px solid ${r.accent}` }}>
          <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{r.desc}</p>
        </div>
        <Grid cols={2}>
          <Card title="沿线直接投资走势（亿$ · 随区域切换）"><EChart option={fdiTrend} style={{ height: 220 }} /></Card>
          <Card title="各区域投资占比（高亮选中）"><EChart option={regionDonut} style={{ height: 220 }} /></Card>
        </Grid>
      </Card>

      {/* ----------------------------------------------------------------- */}
      <Card title="BRI 进展雷达 · 五通 + 双转型（示意指数）" className="mb-6">
        <Grid cols={2}>
          <EChart option={briRadar} style={{ height: 280 }} />
          <div className="space-y-3">
            {[
              ['强项：硬联通', '铁路、港口、电网是工程能力的主场，进展最实——这也是中国比较优势所在：成本、速度与全产业链交付。', '#c41e3a'],
              ['短板：资金融通与民心', '人民币结算扩围仍受资本项目管制约束；民心相通受劳工本地化率、环保争议与信息透明度拖累，是雷达上最凹的两个角。', '#e8a317'],
              ['变量：数字与绿色', '双转型赛道既是增量空间也是中美欧规则竞争的正面战场——进展曲线将更多由地缘摩擦而非工程能力决定。', '#22d3ee'],
            ].map(([t, d, col]) => (
              <div key={t} className="os-card p-3" style={{ background: 'var(--bg-elevated)', borderLeft: `3px solid ${col}` }}>
                <div className="text-xs font-semibold mb-1" style={{ color: col }}>{t}</div>
                <p className="text-[11px] leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{d}</p>
              </div>
            ))}
          </div>
        </Grid>
      </Card>

      {/* ----------------------------------------------------------------- */}
      <FrameworkTrio cards={[
        { title: '陆权对冲', subtitle: '麦金德的现实回声', body: '马六甲困局的陆路解法：班列、管道与走廊把部分海权风险转译为可控的陆权成本。它解不掉海运的运量级差，但买到了「海上中断时不至于窒息」的保险。', pillars: [['班列主干', '过境俄罗斯的规模化通道。'], ['南线对冲', '中吉乌 + 跨里海中间走廊。'], ['能源管道', '中俄/中亚油气陆路冗余。']] },
        { title: '产能与标准出海', subtitle: '基建是载体不是目的', body: '一条铁路带出去的是机车、信号系统、施工标准、运营规范与人民币计价合同。基建签约是一次性收入，标准锁定是几十年的现金流与话语权。', pillars: [['装备出海', '高铁/电力/通信成套输出。'], ['标准黏性', '中国标准写进东道国规范。'], ['货币渗透', '本币结算与熊猫债扩围。']] },
        { title: '风险定价', subtitle: '真实成本的总账', body: '主权债务重组损耗、安保与保险加价、政权更迭重谈、声誉折价——扩张期未入账的成本正在 2.0 阶段集中计提。小而美不是退缩，是定价能力的修复。', pillars: [['主权风险', '债务重组的「同等受偿」拉锯。'], ['安全成本', '走廊安保已成隐性资本开支。'], ['政局变量', '选举周期 ≈ 项目重谈周期。']] },
      ]} />

      {/* ----------------------------------------------------------------- */}
      <Card title="研判要点" className="mb-6">
        <Grid cols={3}>
          {[['1 · 叙事切换已完成', '从「万亿签约」到「小而美 + 高质量 2.0」：单体缩小、周期缩短、回报与合规前置。判断 BRI 不能再用 2017 年的尺子。'],
            ['2 · 对冲与反对冲', 'PGII、全球门户、印度中东欧走廊（IMEC）构成西方对冲组合；沿线国家乐见竞价——多方议价时代，独家通道溢价正在消失。'],
            ['3 · 真实考题在债务桌上', '债务重组的制度摩擦（保密条款、受偿顺位、IMF 协调）比任何单一项目更能决定 BRI 的长期信用——这是「陷阱论」之外更难的题。']].map(([t, d]) => (
            <div key={t}><div className="text-sm font-semibold" style={{ color: 'var(--china-red)' }}>{t}</div><p className="text-xs mt-1 leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{d}</p></div>
          ))}
        </Grid>
      </Card>

      <ModuleFooter moduleId="bri" disclaimer="公开资料整理 · 数值为示意量级非精确统计 · 债务与港口议题呈现多方观点，仅供分析框架参考" sourceNote="由 tabs/bri.html 迁移并扩容" />
    </div>
  );
}
