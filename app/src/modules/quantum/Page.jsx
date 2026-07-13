import React, { useState, useMemo } from 'react';
import { PageHeader, Card, Grid, Stat } from '../../app/ui.jsx';
import EChart from '../../lib/viz/EChart.jsx';
import { categoryX, valueY, logY, GRID, donutOpt, radarOpt, stackedBarOpt, AXIS, LABEL } from '../shared/chartHelpers.js';
import { IntroCard, SelectorBar, TimelineBar, FrameworkTrio, ModuleFooter } from '../shared/ModuleParadigm.jsx';

const ROUTES = [
  { key: 'compute', label: '量子计算', accent: '#e8a317', maturity: 40, desc: 'NISQ 时代算法、纠错编码与低温测控决定有效算力；与经典超算混合编排是近期接口。容错门槛——逻辑比特——仍在远处，工程化是十年量级长跑。' },
  { key: 'comm', label: '量子通信', accent: '#10b981', maturity: 85, desc: '城域与城际 QKD 网络、量子卫星与地面站协同；与 PQC 形成互补与替代之争。这是中国唯一在全球处于明确领先位置的量子赛道。' },
  { key: 'sense', label: '量子精密测量', accent: '#22d3ee', maturity: 70, desc: '原子钟、重力仪、磁力计服务导航、资源勘探与基础物理。最快变现、却最少被叙事关注的「沉默赛道」。' },
  { key: 'timefreq', label: '量子精密时频', accent: '#8b5cf6', maturity: 60, desc: '光钟与时间基准是 GPS 自主、金融授时、引力波探测的底层物理设施；时频体系是国家主权基础设施的隐形地基。' },
];

const PHASES = [
  { period: '2007–2015', title: '量子通信实验', accent: '#64748b', desc: '自由空间与光纤 QKD 验证、合肥城域网，确立通信路线先发卡位。' },
  { period: '2016–2017', title: '墨子号卫星', accent: '#10b981', desc: '全球首颗量子科学实验卫星，星地千公里级纠缠分发与密钥分发。' },
  { period: '2019–2021', title: '量子优越性', accent: '#e8a317', desc: '九章光量子采样、祖冲之超导比特,两条路线同年达到优越性里程碑。' },
  { period: '2022–2025', title: '计算工程化', accent: '#c41e3a', desc: '京沪干线扩展、超算混合编排、纠错码与稀释制冷自主攻坚。' },
  { period: '2030s+', title: '容错量子计算', accent: '#8b5cf6', desc: '逻辑比特规模化——颠覆密码学与算力格局的奇点级终极赌注。' },
];

// 量子计算技术路线：比特数 vs 相干性/可扩展性（散点示意）
const HW_PLATFORMS = [
  { name: '超导(祖冲之/IBM)', qubits: 433, coherence: 35, scale: 78, color: '#e8a317', cn: '祖冲之三号 105 比特' },
  { name: '光量子(九章)', qubits: 255, coherence: 90, scale: 55, color: '#22d3ee', cn: '九章三号 255 光子' },
  { name: '离子阱', qubits: 56, coherence: 95, scale: 42, color: '#10b981', cn: 'IonQ/启科量子' },
  { name: '中性原子', qubits: 256, coherence: 70, scale: 68, color: '#fb923c', cn: 'QuEra/中科大' },
  { name: '拓扑(理论)', qubits: 8, coherence: 99, scale: 25, color: '#8b5cf6', cn: 'Microsoft 押注' },
];

// 量子通信骨干节点/里程（示意）
const COMM_NODES = [
  { name: '京沪干线', value: 2032, kind: '城际光纤' },
  { name: '武合干线', value: 680, kind: '城际光纤' },
  { name: '沪杭/沪苏', value: 460, kind: '城际光纤' },
  { name: '墨子号星地', value: 1200, kind: '星地链路' },
  { name: '合肥城域', value: 280, kind: '城域网' },
  { name: '北京城域', value: 320, kind: '城域网' },
];

export default function Page() {
  const [route, setRoute] = useState('comm');
  const [phaseIdx, setPhaseIdx] = useState(3);
  const [hwMetric, setHwMetric] = useState('qubits');
  const r = ROUTES.find((x) => x.key === route) || ROUTES[0];

  const qubitTrend = useMemo(() => ({
    grid: GRID,
    xAxis: categoryX(['2018', '2020', '2021', '2022', '2023', '2024']),
    yAxis: valueY({ name: '规模(示意)' }),
    series: [{ type: 'line', smooth: true, symbol: 'circle', symbolSize: 5,
      data: route === 'compute' ? [12, 24, 66, 113, 176, 255]
        : route === 'comm' ? [8, 15, 30, 50, 80, 120]
        : route === 'sense' ? [20, 35, 48, 62, 78, 95]
        : [15, 28, 42, 55, 70, 88],
      lineStyle: { color: r.accent, width: 2 }, itemStyle: { color: r.accent },
      areaStyle: { color: `${r.accent}18` } }],
  }), [route, r]);

  const maturityBar = useMemo(() => ({
    grid: { left: 88, right: 28, top: 16, bottom: 24 },
    xAxis: valueY({ max: 100, axisLabel: { formatter: '{value}%' } }),
    yAxis: categoryX(ROUTES.map((x) => x.label)),
    series: [{ type: 'bar', barWidth: 16, data: ROUTES.map((x) => ({
      value: x.key === route ? x.maturity + 8 : x.maturity,
      itemStyle: { color: x.accent, borderRadius: 3 },
    })),
    label: { show: true, position: 'right', formatter: '{c}%', color: LABEL.color } }],
  }), [route]);

  // 量子计算硬件路线对比（散点：比特数 × 相干/可扩展性）
  const hwScatter = useMemo(() => ({
    grid: { left: 56, right: 28, top: 28, bottom: 40 },
    tooltip: { trigger: 'item', formatter: (p) => `${p.data.name}<br/>比特:${p.data.value[0]} / 相干:${p.data.value[1]} / 扩展:${p.data.value[2]}<br/>${p.data.cn}` },
    xAxis: { type: 'log', name: '比特/光子数(log)', nameTextStyle: { color: LABEL.color }, axisLabel: { color: LABEL.color }, splitLine: { lineStyle: { color: 'rgba(148,163,184,0.08)' } } },
    yAxis: { type: 'value', name: hwMetric === 'qubits' ? '相干质量' : '可扩展性', min: 0, max: 100, nameTextStyle: { color: LABEL.color }, axisLabel: { color: LABEL.color }, splitLine: { lineStyle: { color: 'rgba(148,163,184,0.08)' } } },
    series: [{ type: 'scatter',
      data: HW_PLATFORMS.map((p) => ({ name: p.name, cn: p.cn, value: [p.qubits, hwMetric === 'qubits' ? p.coherence : p.scale, p.scale], itemStyle: { color: p.color, opacity: 0.85 } })),
      symbolSize: (v) => 14 + v[2] / 4,
      label: { show: true, position: 'top', formatter: (p) => p.data.name.split('(')[0], color: LABEL.color, fontSize: 10 } }],
  }), [hwMetric]);

  const cnUsRadar = useMemo(() => ({
    legend: { data: ['中国', '美国'], textStyle: { color: LABEL.color }, top: 0 },
    ...radarOpt(['量子计算', '量子通信', '量子测量', '人才储备', '专利产出', '工程化'],
      [88, 96, 85, 72, 90, 58],
      { name: '基准', color: '#c41e3a' }),
    series: [{ type: 'radar', data: [
      { value: route === 'comm' ? [78, 98, 82, 70, 92, 60] : route === 'compute' ? [88, 85, 78, 72, 90, 55] : route === 'sense' ? [80, 90, 95, 68, 86, 62] : [76, 88, 90, 66, 84, 58],
        name: '中国', lineStyle: { color: '#c41e3a' }, itemStyle: { color: '#c41e3a' }, areaStyle: { color: 'rgba(196,30,58,0.14)' } },
      { value: [96, 68, 92, 95, 88, 90], name: '美国', lineStyle: { color: '#22d3ee' }, itemStyle: { color: '#22d3ee' }, areaStyle: { color: 'rgba(34,211,238,0.08)' } },
    ] }],
  }), [route]);

  // 量子通信骨干里程 bar
  const commBar = useMemo(() => ({
    grid: { left: 80, right: 44, top: 16, bottom: 24 },
    tooltip: { trigger: 'axis', formatter: (ps) => `${ps[0].name}<br/>${ps[0].value} km · ${COMM_NODES[ps[0].dataIndex].kind}` },
    xAxis: valueY({ name: 'km' }),
    yAxis: categoryX(COMM_NODES.map((x) => x.name)),
    series: [{ type: 'bar', barWidth: 14, itemStyle: { borderRadius: 3 },
      data: COMM_NODES.map((x) => ({ value: x.value, itemStyle: { color: x.kind === '星地链路' ? '#8b5cf6' : x.kind === '城域网' ? '#22d3ee' : '#10b981' } })),
      label: { show: true, position: 'right', color: LABEL.color, formatter: '{c}' } }],
  }), []);

  // 中美量子专利逐年趋势（多线）
  const patentTrend = useMemo(() => ({
    grid: GRID,
    legend: { data: ['中国专利', '美国专利', '中国论文(右)'], textStyle: { color: LABEL.color }, top: 0 },
    tooltip: { trigger: 'axis' },
    xAxis: categoryX(['2016', '2018', '2020', '2022', '2024']),
    yAxis: [valueY({ name: '专利(件)' }), valueY({ name: '论文(篇)', position: 'right' })],
    series: [
      { name: '中国专利', type: 'line', smooth: true, data: [820, 1450, 2680, 4100, 5600], lineStyle: { color: '#c41e3a', width: 2 }, itemStyle: { color: '#c41e3a' }, areaStyle: { color: 'rgba(196,30,58,0.10)' } },
      { name: '美国专利', type: 'line', smooth: true, data: [950, 1380, 1900, 2400, 2900], lineStyle: { color: '#22d3ee', width: 2 }, itemStyle: { color: '#22d3ee' } },
      { name: '中国论文(右)', type: 'line', smooth: true, yAxisIndex: 1, data: [1200, 2100, 3400, 4900, 6300], lineStyle: { color: '#e8a317', width: 1.5, type: 'dashed' }, itemStyle: { color: '#e8a317' } },
    ],
  }), []);

  // 投入结构 donut
  const investDonut = useMemo(() => donutOpt(
    route === 'compute'
      ? [{ name: '国家专项', value: 95 }, { name: '高校科研', value: 88 }, { name: '地方产业园', value: 70 }, { name: '民企试点', value: 45 }]
      : route === 'comm'
      ? [{ name: '国家专项', value: 90 }, { name: '高校科研', value: 75 }, { name: '地方产业园', value: 65 }, { name: '民企试点', value: 55 }]
      : [{ name: '国家专项', value: 80 }, { name: '高校科研', value: 85 }, { name: '地方产业园', value: 60 }, { name: '民企试点', value: 50 }],
    { center: ['50%', '54%'] }
  ), [route]);

  // 全球量子玩家比特竞赛（堆叠 bar：路线分布）
  const playerStack = useMemo(() => stackedBarOpt({
    categories: ['中国', '美国', '欧盟', '其他'],
    series: [
      { name: '超导', data: [105, 433, 50, 20], itemStyle: { color: '#e8a317' } },
      { name: '光量子', data: [255, 216, 24, 0], itemStyle: { color: '#22d3ee' } },
      { name: '离子阱', data: [20, 56, 32, 12], itemStyle: { color: '#10b981' } },
      { name: '中性原子', data: [60, 256, 100, 0], itemStyle: { color: '#fb923c' } },
    ],
  }), []);

  return (
    <div>
      <PageHeader badge="Quantum · 国家专项" title="量子计算 · 通信 · 测量 · 时频" subtitle="第二次量子革命 · 不对称卡位 · 容错奇点的终极赌注" />
      <IntroCard>第二次量子革命三线并进——计算、通信、测量。中国在 <strong style={{ color: 'var(--text-primary)' }}>量子通信(QKD)全球唯一领先</strong>，计算路线追赶且与美国差距集中在<strong style={{ color: 'var(--text-primary)' }}>工程化、软件栈与仪器自主</strong>。这是一场赌注极重、回报极远的长波竞赛：谁先抵达容错量子计算，谁就重写密码与算力的物理基础。</IntroCard>

      <Grid cols={4} className="mb-6">
        <Stat value="255 光子" label="九章三号最大规模(示意)" accent="#22d3ee" />
        <Stat value="4,600 km+" label="量子保密通信干线" accent="#10b981" />
        <Stat value="≈40%" label="全球量子专利占比(示意)" accent="#c41e3a" />
        <Stat value="2+ 国家级" label="量子信息国家实验室(示意)" accent="#8b5cf6" />
      </Grid>

      <Card title="交互① · 四条赛道选择器（计算/通信/测量/时频）" className="mb-6">
        <SelectorBar items={ROUTES} activeKey={route} onSelect={setRoute} />
        <div className="os-card p-4 mb-4" style={{ background: 'var(--bg-elevated)', borderLeft: `3px solid ${r.accent}` }}>
          <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{r.desc}</p>
        </div>
        <Grid cols={2}>
          <Card title="赛道规模趋势(随赛道切换)"><EChart option={qubitTrend} style={{ height: 220 }} /></Card>
          <Card title="四赛道技术成熟度对比"><EChart option={maturityBar} style={{ height: 220 }} /></Card>
        </Grid>
      </Card>

      <Card title="交互② · 量子计算硬件路线对比（散点 · 切换纵轴）" className="mb-6">
        <SelectorBar
          items={[{ key: 'qubits', label: '比特数 × 相干质量', accent: '#e8a317' }, { key: 'scale', label: '比特数 × 可扩展性', accent: '#22d3ee' }]}
          activeKey={hwMetric} onSelect={setHwMetric} />
        <EChart option={hwScatter} style={{ height: 300 }} />
        <Grid cols={5} className="mt-4">
          {HW_PLATFORMS.map((p) => (
            <div key={p.name} className="os-card p-3" style={{ borderLeft: `3px solid ${p.color}` }}>
              <div className="text-xs font-semibold" style={{ color: 'var(--text-primary)' }}>{p.name.split('(')[0]}</div>
              <div className="text-[11px] mt-1" style={{ color: 'var(--text-secondary)' }}>{p.cn}</div>
            </div>
          ))}
        </Grid>
        <p className="text-xs mt-3 leading-relaxed" style={{ color: 'var(--text-tertiary)' }}>
          中国「祖冲之」(超导) 与「九章」(光量子) 并行押注两条路线——超导比特更可控、光量子相干更优；拓扑路线相干理论最优但工程几乎从零，是高赔率的远期期权。
        </p>
      </Card>

      <Card title="交互③ · 量子之路时间线（通信实验 → 墨子号 → 优越性 → 工程化 → 容错奇点）" className="mb-6">
        <TimelineBar stages={PHASES} activeIdx={phaseIdx} onSelect={setPhaseIdx} />
      </Card>

      <Grid cols={2} className="mb-6">
        <Card title="中美量子综合实力雷达（随赛道切换 · 中 vs 美）"><EChart option={cnUsRadar} style={{ height: 300 }} /></Card>
        <Card title="量子通信骨干里程（京沪干线/墨子号/城域网）"><EChart option={commBar} style={{ height: 300 }} /></Card>
      </Grid>

      <Grid cols={2} className="mb-6">
        <Card title="中美量子专利/论文逐年趋势（双轴多线）"><EChart option={patentTrend} style={{ height: 280 }} /></Card>
        <Card title="投入结构占比（随赛道切换）"><EChart option={investDonut} style={{ height: 280 }} /></Card>
      </Grid>

      <Card title="全球量子比特竞赛 · 路线分布（堆叠 · 示意峰值)" className="mb-6">
        <EChart option={playerStack} style={{ height: 260 }} />
        <p className="text-xs mt-3 leading-relaxed" style={{ color: 'var(--text-tertiary)' }}>
          美国在硬件比特总量与平台多样性上领先（超导+中性原子双强），中国在光量子单点突出且通信侧不对称领跑。比特数是营销显眼数字，逻辑比特与纠错率才是真实算力分水岭。
        </p>
      </Card>

      <FrameworkTrio cards={[
        { title: '第二次量子革命', subtitle: '计算·通信·测量三线并进', body: '从「观测量子」到「调控量子」——单量子态的相干操控同时打开计算、保密通信、精密传感三个代际窗口，是百年一遇的物理基础重置。', pillars: [['计算', 'NISQ→容错的算力跃迁。'], ['通信', 'QKD 无条件安全。'], ['测量', '原子级灵敏度。']] },
        { title: '不对称优势卡位', subtitle: '通信领先 · 计算追赶', body: '中国选择在通信侧建立全球唯一领先、在计算侧并行追赶的差异化卡位：用已变现的通信与传感对冲计算的长周期不确定性。', pillars: [['先发通信', '墨子号+京沪干线。'], ['差异押注', '光量子单点突破。'], ['对冲风险', '测量近期变现。']] },
        { title: '长波终极赌注', subtitle: '容错量子计算=奇点', body: '逻辑比特规模化将颠覆 RSA/ECC 密码体系与组合优化算力——这是十年量级、赔率极高的国运级赌注，也是仪器自主被纳入国家安全叙事的根因。', pillars: [['密码颠覆', 'Shor 算法威胁。'], ['算力跃迁', '化学/材料模拟。'], ['仪器自主', '稀释制冷管制。']] },
      ]} />

      <Card title="研判要点" className="mb-6">
        <Grid cols={3}>
          {[['1 · 通信先行变现', 'QKD 与量子传感更易嵌入电力、金融、政务基础设施，是近期唯一现金流。'],
            ['2 · 标准与密码迁移', 'NIST PQC 标准化与 QKD 路线博弈直接影响专网采购与全球话语权争夺。'],
            ['3 · 警惕叙事泡沫', '产业园化与「比特数竞赛」掩盖了仪器、低温测控与交叉人才的底层空心化。'],
            ['4 · 工程化是真瓶颈', '中美差距已不在原理演示，而在稀释制冷、测控电子与软件编译栈的全栈自主。'],
            ['5 · 容错是十年长跑', '逻辑比特规模化前的所有「优越性」都不构成实用算力，需抵御短期估值狂热。'],
            ['6 · 时频是隐形主权', '光钟与时间基准支撑授时、导航与引力探测，是最被低估的国家安全设施。']].map(([t, d]) => (
            <div key={t}><div className="text-sm font-semibold" style={{ color: 'var(--china-red)' }}>{t}</div><p className="text-xs mt-1 leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{d}</p></div>
          ))}
        </Grid>
      </Card>

      <ModuleFooter moduleId="quantum" disclaimer="本页比特数、里程、专利/论文与投入数据均为示意值，用于结构化呈现量子信息竞争格局，非精确统计；不构成投资或政策建议。" sourceNote="由 china.html「量子」专题迁移并扩容" />
    </div>
  );
}
