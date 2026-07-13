import React, { useState, useMemo } from 'react';
import { PageHeader, Card, Grid, Stat, StatGrid } from '../../app/ui.jsx';
import EChart from '../../lib/viz/EChart.jsx';
import { categoryX, valueY, logY, GRID, donutOpt, radarOpt, stackedBarOpt } from '../shared/chartHelpers.js';
import { IntroCard, SelectorBar, TimelineBar, FrameworkTrio, ModuleFooter } from '../shared/ModuleParadigm.jsx';

// ---------------------------------------------------------------------------
// 数据层（示意值 · 公开资料量级整理）
// ---------------------------------------------------------------------------

const SECTORS = [
  {
    key: 'new3', label: '新三样', accent: '#c41e3a',
    title: '新三样 · 电动车 / 锂电 / 光伏',
    scale: '出口合计 >1 万亿元', growth: '2023 同比 +30% 量级', pattern: '从「衬衫换飞机」到绿色资本品输出',
    friction: '欧盟反补贴税、美国 301 关税叠加 100% EV 关税；产能外溢（匈牙利/泰国/摩洛哥建厂）成为绕行通道。',
    note: '新三样是出口篮子质变的标志：单价高、技术密集、且嵌入全球碳中和需求曲线 —— 但也因此撞上最硬的政治墙。规模优势在前，规则封锁在后。',
    years: ['2019', '2020', '2021', '2022', '2023', '2024'],
    series: [{ name: '出口额(千亿元)', data: [2.1, 2.7, 4.6, 7.7, 10.6, 10.4], color: '#c41e3a' }],
  },
  {
    key: 'mech', label: '机电产品', accent: '#22d3ee',
    title: '机电产品 · 出口基本盘',
    scale: '占出口 ~59%', growth: '稳态个位数增长', pattern: '从组装贴牌到自有品牌与中间品输出',
    friction: '半导体设备与高端零部件进口受限；「小院高墙」迫使部分供应链在岸/友岸重组。',
    note: '机电是出口的压舱石：手机、计算机、集成电路、通用机械。结构信号在于中间品出口占比上升 —— 中国正在从终端组装者变成亚洲生产网络的供货中枢。',
    years: ['2015', '2017', '2019', '2021', '2023', '2024'],
    series: [{ name: '出口占比(%)', data: [57.6, 58.4, 58.8, 59.0, 58.6, 59.4], color: '#22d3ee' }],
  },
  {
    key: 'ecom', label: '跨境电商', accent: '#e8a317',
    title: '跨境电商 · 全托管出海',
    scale: '进出口 ~2.6 万亿元', growth: '年均两位数增长', pattern: 'SHEIN/Temu 全托管模式重写贸易链路',
    friction: '美国取消 800 美元小额免税(de minimis)、欧盟海关改革；数据合规与平台审查成为新关税。',
    note: '全托管模式把「工厂—平台—海外消费者」压缩成一条直链，绕开了传统外贸的中间商与品牌商。它的脆弱点也在这里：链路越短，单点政策打击越致命。',
    years: ['2019', '2020', '2021', '2022', '2023', '2024'],
    series: [{ name: '进出口(万亿元)', data: [1.0, 1.6, 1.9, 2.1, 2.4, 2.6], color: '#e8a317' }],
  },
  {
    key: 'service', label: '服务贸易', accent: '#10b981',
    title: '服务贸易 · 长期逆差项',
    scale: '总额 ~7.5 万亿元', growth: '旅行服务恢复性反弹', pattern: '货物巨额顺差 vs 服务持续逆差的镜像',
    friction: '旅行/留学/知识产权使用费构成逆差主体；数字服务出口受数据跨境规则掣肘。',
    note: '服务贸易逆差是中国国际收支的另一面：货物赚回的顺差，相当一部分经由旅行、留学与 IP 费用回流发达经济体。知识与体验，仍是进口品。',
    years: ['2015', '2017', '2019', '2021', '2023', '2024'],
    series: [{ name: '总额(万亿元)', data: [4.5, 4.7, 5.4, 5.3, 6.6, 7.5], color: '#10b981' }],
  },
  {
    key: 'rcep', label: 'RCEP 区域', accent: '#8b5cf6',
    title: 'RCEP · 全球最大自贸区',
    scale: '对成员国贸易 ~13 万亿元', growth: '占外贸 ~31%', pattern: '原产地累积规则织密亚洲生产网络',
    friction: '区域内产业同构竞争（越南/印尼承接转移）；CPTPP 高标准条款（国企/数据/劳工）仍是门槛。',
    note: 'RCEP 是中国第一次以「规则主导方之一」身份参与的巨型自贸区。原产地累积让「中国中间品 + 东盟组装」获得关税优惠 —— 产能外溢由此从威胁变成杠杆。',
    years: ['2020', '2021', '2022', '2023', '2024'],
    series: [{ name: '对RCEP贸易(万亿元)', data: [10.2, 12.1, 12.9, 12.6, 13.0], color: '#8b5cf6' }],
  },
  {
    key: 'us', label: '对美贸易', accent: '#64748b',
    title: '对美贸易 · 管控下的再挂钩',
    scale: '双边 ~4.7 万亿元', growth: '份额持续下行', pattern: '直接贸易降、经第三地转口升',
    friction: '301 关税覆盖逾 3000 亿美元商品；实体清单与出口管制双向加码；墨西哥/越南成为「洗产地」审查焦点。',
    note: '对美出口占比从 ~19% 降至 ~15%，但经墨西哥、越南、东盟的间接敞口在上升。脱钩的统计表象之下，是供应链的绕行与加价 —— 谁都没有真正离开谁。',
    years: ['2017', '2018', '2019', '2021', '2023', '2024'],
    series: [{ name: '对美出口占比(%)', data: [19.0, 19.2, 16.8, 17.2, 14.8, 14.7], color: '#64748b' }],
  },
];

const PHASES = [
  { period: '2001–2008', title: '入世红利', accent: '#64748b', desc: '关税壁垒拆除 + 全球化顺风，加工贸易与劳密产品驱动出口年均 20%+ 增长，「世界工厂」定型。沿海每一个集装箱码头都是增长引擎。' },
  { period: '2009–2017', title: '世界工厂巅峰', accent: '#22d3ee', desc: '金融危机后全球份额不降反升至 ~13%；机电超越劳密成为主力，一般贸易占比开始反超加工贸易 —— 增加值留在境内的比例上升。' },
  { period: '2018–2021', title: '贸易战与关税', accent: '#e8a317', desc: '301 关税逐轮加码覆盖数千亿美元商品；「脱钩」从口号变成供应链事实。企业以产能外迁、转口、汇率消化对冲，出口反而在疫情中创新高。' },
  { period: '2022–2024', title: '新三样 / RCEP', accent: '#c41e3a', desc: 'EV/锂电/光伏接棒成为出口引擎，东盟登顶第一大伙伴，RCEP 生效织密区域网络。出口篮子从消费品转向绿色资本品 —— 摩擦也随之升级。' },
  { period: '2025→', title: '规则博弈期', accent: '#8b5cf6', desc: '内外贸一体化、申请 CPTPP、数字贸易规则谈判。竞争从商品价格转向规则话语权：谁定标准，谁定原产地，谁就定下一轮分工。' },
];

const NEW3_LINES = [
  { name: '电动汽车', color: '#c41e3a', data: [120, 240, 1100, 3100, 5100, 5300] },
  { name: '锂离子电池', color: '#22d3ee', data: [950, 1100, 1840, 3430, 4570, 4400] },
  { name: '光伏产品', color: '#10b981', data: [1280, 1400, 2100, 3500, 2900, 2500] },
];
const NEW3_YEARS = ['2019', '2020', '2021', '2022', '2023', '2024'];

const PARTNER_YEARS = ['2010', '2015', '2018', '2020', '2022', '2024'];
const PARTNER_STACK = [
  { name: '美国', color: '#64748b', data: [18.0, 18.0, 19.2, 17.4, 16.2, 14.7] },
  { name: '欧盟', color: '#22d3ee', data: [19.7, 15.6, 16.4, 15.1, 15.6, 14.4] },
  { name: '东盟', color: '#c41e3a', data: [8.8, 12.2, 12.8, 14.7, 15.8, 16.4] },
  { name: '一带一路/其他', color: '#e8a317', data: [53.5, 54.2, 51.6, 52.8, 52.4, 54.5] },
];

const ECOM_BARS = [
  { name: '出口', color: '#e8a317', data: [0.8, 1.2, 1.4, 1.6, 1.8, 2.0] },
  { name: '进口', color: '#22d3ee', data: [0.2, 0.4, 0.5, 0.5, 0.6, 0.6] },
];
const ECOM_YEARS = ['2019', '2020', '2021', '2022', '2023', '2024'];

const RADAR_DIMS = ['规模', '结构升级', '品牌溢价', '定价权', '规则话语', '伙伴多元'];
const RADAR_VALUES = [95, 78, 45, 40, 50, 72];

// ---------------------------------------------------------------------------
// 页面
// ---------------------------------------------------------------------------

export default function Page() {
  const [sector, setSector] = useState('new3');
  const [phaseIdx, setPhaseIdx] = useState(3);
  const [partnerView, setPartnerView] = useState('stack'); // stack | donut
  const s = SECTORS.find((x) => x.key === sector) || SECTORS[0];

  // 交互① 板块规模走势（随选择器切换）
  const sectorTrend = useMemo(() => ({
    grid: GRID,
    tooltip: { trigger: 'axis' },
    xAxis: categoryX(s.years),
    yAxis: valueY(),
    series: s.series.map((ln) => ({
      name: ln.name, type: 'line', smooth: true, symbol: 'circle', symbolSize: 5,
      data: ln.data,
      lineStyle: { color: ln.color, width: 2 },
      itemStyle: { color: ln.color },
      areaStyle: { color: `${ln.color}18` },
    })),
  }), [s]);

  // 交互② 伙伴重构：堆叠柱（出口占比演进）
  const partnerStacked = useMemo(() => stackedBarOpt({
    categories: PARTNER_YEARS,
    series: PARTNER_STACK.map((p) => ({ name: p.name, data: p.data, itemStyle: { color: p.color } })),
  }), []);

  const partnerDonut = useMemo(() => donutOpt(PARTNER_STACK.map((p) => ({
    value: p.data[p.data.length - 1], name: p.name, itemStyle: { color: p.color },
  }))), []);

  // 东盟 vs 美国 交叉线
  const aseanVsUs = useMemo(() => ({
    grid: GRID,
    tooltip: { trigger: 'axis' },
    legend: { data: ['东盟', '美国'], textStyle: { color: '#93a1b5', fontSize: 10 }, top: 0 },
    xAxis: categoryX(PARTNER_YEARS),
    yAxis: valueY({ axisLabel: { formatter: '{value}%' } }),
    series: [
      { name: '东盟', type: 'line', smooth: true, symbol: 'circle', symbolSize: 5, data: PARTNER_STACK[2].data, lineStyle: { color: '#c41e3a', width: 2 }, itemStyle: { color: '#c41e3a' }, areaStyle: { color: 'rgba(196,30,58,0.1)' } },
      { name: '美国', type: 'line', smooth: true, symbol: 'circle', symbolSize: 5, data: PARTNER_STACK[0].data, lineStyle: { color: '#64748b', width: 2, type: 'dashed' }, itemStyle: { color: '#64748b' } },
    ],
  }), []);

  // 交互③ 新三样多线（logY · 出口额亿元 示意）
  const new3Lines = useMemo(() => ({
    grid: GRID,
    tooltip: { trigger: 'axis' },
    legend: { data: NEW3_LINES.map((l) => l.name), textStyle: { color: '#93a1b5', fontSize: 10 }, top: 0 },
    xAxis: categoryX(NEW3_YEARS),
    yAxis: logY({ axisLabel: { formatter: '{value}' } }),
    series: NEW3_LINES.map((l) => ({
      name: l.name, type: 'line', smooth: true, symbol: 'circle', symbolSize: 5,
      data: l.data, lineStyle: { color: l.color, width: 2 }, itemStyle: { color: l.color },
    })),
  }), []);

  // 结构升级：一般贸易 vs 加工贸易 + 高技术占比
  const structureLines = useMemo(() => ({
    grid: GRID,
    tooltip: { trigger: 'axis' },
    legend: { data: ['一般贸易', '加工贸易', '高新技术产品'], textStyle: { color: '#93a1b5', fontSize: 10 }, top: 0 },
    xAxis: categoryX(['2010', '2014', '2018', '2020', '2022', '2024']),
    yAxis: valueY({ axisLabel: { formatter: '{value}%' } }),
    series: [
      { name: '一般贸易', type: 'line', smooth: true, symbol: 'circle', symbolSize: 5, data: [50.1, 53.8, 57.8, 59.9, 63.7, 64.9], lineStyle: { color: '#c41e3a', width: 2 }, itemStyle: { color: '#c41e3a' }, areaStyle: { color: 'rgba(196,30,58,0.08)' } },
      { name: '加工贸易', type: 'line', smooth: true, symbol: 'circle', symbolSize: 5, data: [38.9, 32.7, 27.4, 23.8, 20.1, 17.8], lineStyle: { color: '#64748b', width: 2, type: 'dashed' }, itemStyle: { color: '#64748b' } },
      { name: '高新技术产品', type: 'line', smooth: true, symbol: 'circle', symbolSize: 5, data: [31.2, 28.2, 30.0, 29.8, 26.6, 25.4], lineStyle: { color: '#22d3ee', width: 2 }, itemStyle: { color: '#22d3ee' } },
    ],
  }), []);

  // 顺差与依存：顺差 bar + 外贸依存度 line（双轴）
  const surplusOpt = useMemo(() => ({
    grid: { ...GRID, right: 44 },
    tooltip: { trigger: 'axis' },
    legend: { data: ['贸易顺差(千亿美元)', '外贸依存度(%)'], textStyle: { color: '#93a1b5', fontSize: 10 }, top: 0 },
    xAxis: categoryX(['2006', '2010', '2015', '2019', '2022', '2024']),
    yAxis: [
      valueY(),
      { type: 'value', position: 'right', splitLine: { show: false }, axisLabel: { color: '#93a1b5', fontSize: 10, formatter: '{value}%' } },
    ],
    series: [
      { name: '贸易顺差(千亿美元)', type: 'bar', barWidth: 18, data: [1.8, 1.8, 5.9, 4.2, 8.4, 9.9], itemStyle: { color: 'rgba(232,163,23,0.85)' } },
      { name: '外贸依存度(%)', type: 'line', yAxisIndex: 1, smooth: true, symbol: 'circle', symbolSize: 5, data: [64, 49, 36, 32, 35, 33], lineStyle: { color: '#22d3ee', width: 2 }, itemStyle: { color: '#22d3ee' } },
    ],
  }), []);

  // 竞争力雷达（单系列 · radarOpt）
  const powerRadar = useMemo(() => radarOpt(RADAR_DIMS, RADAR_VALUES, { name: '贸易权力画像', color: '#c41e3a' }), []);

  // 跨境电商：堆叠 bar
  const ecomBars = useMemo(() => stackedBarOpt({
    categories: ECOM_YEARS,
    series: ECOM_BARS.map((b) => ({ name: b.name, data: b.data, itemStyle: { color: b.color } })),
  }), []);

  return (
    <div>
      <PageHeader badge="Foreign Trade" title="对外贸易 · 从世界工厂到规则博弈" subtitle="出口篮子的质变 · 伙伴版图的再平衡 · 顺差权力的双刃" />

      <IntroCard>
        贸易从来不只是买卖，它是权力的延伸。中国用二十年完成了从「衬衫换飞机」到「新三样换市场」的篮子切换：
        出口结构爬上资本与技术密集的阶梯，东盟取代美国登顶第一大伙伴，一般贸易占比升至约 <strong style={{ color: 'var(--text-primary)' }}>65%</strong>。
        但近 <strong style={{ color: 'var(--text-primary)' }}>1 万亿美元</strong> 的货物顺差同时是实力证明与全球失衡的靶心 ——
        当你的出口开始替代别人的产业而不只是别人的商品，关税、反补贴与规则封锁就不再是意外，而是常态。
        本页以板块、伙伴、结构、顺差四条线索拆解这台贸易机器的运转与软肋。
      </IntroCard>

      <StatGrid className="mb-6">
        <Stat value="~44.5 万亿" label="进出口总额 (2025 · 元)" accent="#22d3ee" />
        <Stat value="~1.05 万亿$" label="货物贸易顺差 (2025)" accent="#e8a317" />
        <Stat value="H1 +4.2%" label="2026 上半年出口增速 (示意)" accent="#c41e3a" />
        <Stat value="~2.8 万亿" label="跨境电商进出口 (2025 · 元)" accent="#10b981" />
      </StatGrid>

      <Grid cols={3} className="mb-6">
        {[['RCEP 生效第四年', '区域内贸易占比升至 ~36% · 东盟稳居第一大伙伴', '#8b5cf6'],
          ['新三样 H1', 'EV/锂电/光伏合计 ~5800 亿 · 量增额减持续', '#c41e3a'],
          ['十五五开局', '内外贸一体化 · CPTPP 申请 · 数字贸易规则谈判并行', '#22d3ee']].map(([t, d, c]) => (
          <div key={t} className="os-card p-4" style={{ borderLeft: `3px solid ${c}` }}>
            <div className="text-xs font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>{t}</div>
            <p className="text-[11px] leading-relaxed" style={{ color: 'var(--text-tertiary)' }}>{d}</p>
          </div>
        ))}
      </Grid>

      {/* ① 贸易板块选择器 ------------------------------------------------ */}
      <Card title="交互① · 贸易板块选择器 — 六条战线各看各的账" className="mb-6">
        <SelectorBar items={SECTORS} activeKey={sector} onSelect={setSector} />
        <div className="os-card p-4 mb-4" style={{ background: 'var(--bg-elevated)', borderLeft: `3px solid ${s.accent}` }}>
          <div className="text-sm font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>{s.title}</div>
          <Grid cols={3} className="mb-3">
            {[['规模', s.scale], ['增速', s.growth], ['格局', s.pattern]].map(([t, d]) => (
              <div key={t}>
                <div className="text-[11px] mono mb-1" style={{ color: 'var(--text-tertiary)' }}>{t}</div>
                <div className="text-xs leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{d}</div>
              </div>
            ))}
          </Grid>
          <p className="text-sm leading-relaxed mb-2" style={{ color: 'var(--text-secondary)' }}>{s.note}</p>
          <div className="text-xs leading-relaxed" style={{ color: s.accent }}>
            <span className="mono">摩擦点 ▸ </span>{s.friction}
          </div>
        </div>
        <Card title={`${s.label} · 规模走势（示意）`}>
          <EChart option={sectorTrend} style={{ height: 240 }} />
        </Card>
      </Card>

      {/* ② 伙伴重构 ------------------------------------------------------ */}
      <Card title="交互② · 贸易伙伴重构 — 去美国化的再平衡" className="mb-6">
        <SelectorBar
          items={[
            { key: 'stack', label: '占比演进 (堆叠)', accent: '#22d3ee' },
            { key: 'donut', label: '当前结构 (环形)', accent: '#e8a317' },
          ]}
          activeKey={partnerView} onSelect={setPartnerView}
        />
        <Grid cols={2}>
          <Card title={partnerView === 'stack' ? '对主要伙伴出口占比演进（% · 示意）' : '2024 出口市场结构（%）'}>
            <EChart option={partnerView === 'stack' ? partnerStacked : partnerDonut} style={{ height: 260 }} />
          </Card>
          <Card title="东盟超越美国 · 交叉点（出口占比 %）">
            <EChart option={aseanVsUs} style={{ height: 260 }} />
          </Card>
        </Grid>
        <div className="os-card p-4 mt-4" style={{ background: 'var(--bg-elevated)', borderLeft: '3px solid #c41e3a' }}>
          <p className="text-xs leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
            <strong style={{ color: 'var(--text-primary)' }}>再平衡的真相：</strong>
            对美直接出口份额五年降了约 4 个百分点，但其中相当部分只是改走东盟与墨西哥的「绕行航线」——
            中国中间品先到第三地，组装贴牌后再入美国。统计上的多元化，实质上是供应链的拉长与加价。
            真正的多元增量来自中东、拉美与非洲：那里买的是基建、整车与光伏，不是转口的替身。
          </p>
        </div>
      </Card>

      {/* ③ 新三样爆发 ---------------------------------------------------- */}
      <Card title="③ · 新三样出口爆发 — 出口篮子的质变（对数轴）" className="mb-6">
        <Grid cols={2}>
          <Card title="EV / 锂电 / 光伏 出口额（亿元 · logY · 示意）">
            <EChart option={new3Lines} style={{ height: 260 }} />
          </Card>
          <div className="os-card p-4" style={{ background: 'var(--bg-elevated)' }}>
            <div className="text-sm font-semibold mb-2" style={{ color: 'var(--china-red)' }}>从衬衫换飞机，到新三样换关税</div>
            <p className="text-xs leading-relaxed mb-3" style={{ color: 'var(--text-secondary)' }}>
              电动车出口额五年放大约 40 倍 —— 对数轴上那条近乎直线的红线，是中国制造爬出微笑曲线底部的轨迹。
              新三样的共同点：技术密集、嵌入碳中和长期需求、且产业链几乎完整留在境内。
            </p>
            <p className="text-xs leading-relaxed mb-3" style={{ color: 'var(--text-secondary)' }}>
              但 2024 年三条线同时走平甚至回落：光伏因全球产能过剩价格腰斩（量增额减），
              EV 撞上欧盟反补贴税与美国 100% 关税。爆发期结束，进入「以海外建厂换市场准入」的消耗战。
            </p>
            <Grid cols={3}>
              {[['EV', '~40×', '5年放大'], ['锂电', '~4.6×', '动力+储能'], ['光伏', '价格-50%', '量增额减']].map(([t, v, d]) => (
                <div key={t}>
                  <div className="text-[11px] mono" style={{ color: 'var(--text-tertiary)' }}>{t}</div>
                  <div className="text-sm font-semibold" style={{ color: 'var(--china-red)' }}>{v}</div>
                  <div className="text-[11px]" style={{ color: 'var(--text-tertiary)' }}>{d}</div>
                </div>
              ))}
            </Grid>
          </div>
        </Grid>
      </Card>

      {/* ④ 结构升级 + ⑤ 顺差与依存 -------------------------------------- */}
      <Grid cols={2} className="mb-6">
        <Card title="④ · 贸易结构升级 — 一般贸易反超加工贸易（% · 示意）">
          <EChart option={structureLines} style={{ height: 250 }} />
          <p className="text-xs mt-3 leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
            一般贸易占比从 50% 升至约 65%，加工贸易腰斩至不足 18% —— 「两头在外、赚加工费」的旧模式退场，
            更多增加值留在境内。高新技术产品占比微降则提示另一面：部分高端环节正随管制与外迁流出。
          </p>
        </Card>
        <Card title="⑤ · 顺差与依存 — 巨额顺差的双刃（示意）">
          <EChart option={surplusOpt} style={{ height: 250 }} />
          <p className="text-xs mt-3 leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
            顺差逼近 1 万亿美元，外贸依存度却从 64% 降到约 33%：经济对外需的依赖在下降，世界对中国供给的依赖在上升。
            这正是摩擦的结构性根源 —— 顺差是别国的逆差，产能是别国的去工业化焦虑。顺差越大，规则的反作用力越强。
          </p>
        </Card>
      </Grid>

      {/* ⑥ 竞争力雷达 + ⑦ 跨境电商 -------------------------------------- */}
      <Grid cols={2} className="mb-6">
        <Card title="⑥ · 贸易权力雷达 — 规模满格，定价权短板">
          <EChart option={powerRadar} style={{ height: 250 }} />
          <p className="text-xs mt-3 leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
            规模 95 / 定价权 40 / 品牌 45 —— 这张雷达就是「贸易大国 ≠ 贸易强国」的画像。
            卖得最多的人不一定定价；定规则的人才定价。短板补齐的路径不在海关，在标准组织与自贸协定谈判桌。
          </p>
        </Card>
        <Card title="⑦ · 跨境电商 — 全托管模式出海（万亿元 · 示意）">
          <EChart option={ecomBars} style={{ height: 250 }} />
          <p className="text-xs mt-3 leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
            SHEIN/Temu 的全托管模式让珠三角工厂直连海外消费者，五年规模翻 2.6 倍、占外贸约 6%。
            但 2025 年美国小额免税豁免取消是一记精准打击：链路最短的模式，对单点政策最敏感。
            海外仓（2500+ 节点）与本地化履约是下一道护城河。
          </p>
        </Card>
      </Grid>

      {/* ⑧ 时间线 -------------------------------------------------------- */}
      <Card title="交互⑧ · 贸易演进时间线 — 从入世红利到规则博弈" className="mb-6">
        <TimelineBar stages={PHASES} activeIdx={phaseIdx} onSelect={setPhaseIdx} />
      </Card>

      {/* ⑨ 框架三卡 ------------------------------------------------------ */}
      <FrameworkTrio cards={[
        {
          title: '出口结构跃迁', subtitle: '劳动密集 → 资本技术密集',
          body: '出口篮子沿「服装玩具 → 机电组装 → 中间品与新三样」逐级爬梯，每一级的单位重量价值与政治敏感度同步上升。',
          pillars: [['劳密退潮', '占比 22%→14%，让位东南亚。'], ['机电压舱', '~59% 基本盘，中间品化。'], ['新三样登顶', '绿色资本品成新名片。']],
        },
        {
          title: '市场再平衡', subtitle: '去美国化的多元布局',
          body: '对美份额降至 ~15%，东盟登顶、带路新兴市场吸纳过半出口；直接脱钩与间接转口并存，多元化半真半假但方向不可逆。',
          pillars: [['东盟枢纽', 'RCEP 原产地累积红利。'], ['新兴纵深', '中东/拉美/非洲增量。'], ['绕行通道', '墨西哥/越南转口缓冲。']],
        },
        {
          title: '规则博弈', subtitle: '从接受者到出题人',
          body: '入世时是规则接受者，RCEP 中是共同主导方，申请 CPTPP 则是主动对标最高标准 —— 贸易战争的下半场打的是规则而非关税。',
          pillars: [['RCEP 主导', '全球最大自贸区落子。'], ['CPTPP 闯关', '国企/数据条款攻坚。'], ['标准输出', '充电桩到光伏的事实标准。']],
        },
      ]} />

      {/* 研判要点 -------------------------------------------------------- */}
      <Card title="研判要点 · 冷峻清单" className="mb-6">
        <Grid cols={2}>
          {[
            ['1 · 顺差即靶心', '近万亿美元顺差在重商主义回潮的世界里是头号政治标靶。出口的尽头不是更多出口，而是海外产能与本币结算。'],
            ['2 · 绕行有半衰期', '经墨西哥/越南的转口缓冲正在被原产地审查逐步关闭；「洗产地」红利是借来的时间，不是结构性答案。'],
            ['3 · 量增额减陷阱', '光伏已示范了内卷出海的终局：份额 80%、利润归零。新三样若复制国内价格战，将把产业优势打成财政包袱。'],
            ['4 · 规则是终极关税', 'CBAM、数据跨境、劳工条款 —— 下一代壁垒不写在税则里。能否进入 CPTPP 级别规则圈，决定 2030 后的市场准入半径。'],
          ].map(([t, d]) => (
            <div key={t} className="mb-3">
              <div className="text-sm font-semibold" style={{ color: 'var(--china-red)' }}>{t}</div>
              <p className="text-xs mt-1 leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{d}</p>
            </div>
          ))}
        </Grid>
      </Card>

      <ModuleFooter
        moduleId="foreignTrade"
        sourceNote="由 tabs/foreignTrade.html 迁移并扩容"
        disclaimer="数据为公开资料整理的示意量级，非官方统计 · 分析框架仅供研究参考，不构成任何投资或政策建议"
      />
    </div>
  );
}
