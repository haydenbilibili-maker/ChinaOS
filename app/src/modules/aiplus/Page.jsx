import React, { useState, useMemo } from 'react';
import { PageHeader, Card, Grid, Stat } from '../../app/ui.jsx';
import EChart from '../../lib/viz/EChart.jsx';
import { categoryX, valueY, logY, GRID, donutOpt, radarOpt, stackedBarOpt } from '../shared/chartHelpers.js';
import { IntroCard, SelectorBar, TimelineBar, FrameworkTrio, ModuleFooter } from '../shared/ModuleParadigm.jsx';

// ── 价值链环节（从算力底座到具身智能）──────────────────────────────
const LINKS = [
  {
    key: 'chip', label: '算力芯片', accent: '#8b0000', selfRate: 15, weight: 98,
    status: '训练侧高端 GPU 几近断供：英伟达 H/B 系列受出口管制，国产昇腾/壁仞/寒武纪在制程、HBM 与软件栈三重受限。',
    choke: 'EUV 制程（先进封装可绕、晶体管不可绕）、HBM 高带宽显存、CUDA 生态迁移成本。',
    breakout: '推理侧国产替代率上行，昇腾集群+MindSpore 在政企侧规模铺开；以「算力换制程」堆卡补算力。',
    firms: ['华为昇腾', '寒武纪', '壁仞', '海光', '摩尔线程'],
  },
  {
    key: 'model', label: '大模型', accent: '#a01028', selfRate: 70, weight: 90,
    status: '数量全球第二、顶尖能力差约半代到一代；开源路线（DeepSeek/Qwen）以效率与成本撕开缺口。',
    choke: '顶尖预训练算力规模、对齐与后训练数据质量、超长上下文与多模态稳定性。',
    breakout: 'MoE+蒸馏压低推理成本，开源权重形成生态外溢；行业微调把通用差距转化为场景胜势。',
    firms: ['DeepSeek', 'Qwen(阿里)', '豆包(字节)', '智谱', 'Kimi(月之暗面)'],
  },
  {
    key: 'data', label: '数据语料', accent: '#c41e3a', selfRate: 60, weight: 85,
    status: '中文与行业数据规模是长板，但高质量、清洗对齐、版权合规的「可训练语料」仍是隐性瓶颈。',
    choke: '高质量标注语料、跨境数据流动评估、版权与个人信息合规、行业私域数据壁垒。',
    breakout: '数据要素市场化与公共数据授权运营释放政务/医疗/工业私域数据；合成数据补缺口。',
    firms: ['数据交易所', '海天瑞声', '行业数据空间', '公共数据运营商'],
  },
  {
    key: 'app', label: '行业应用', accent: '#e8a317', selfRate: 80, weight: 75,
    status: '应用与场景密度是中国最强长板：制造、政务、金融落地速度领先，但 ROI 与合规成本制约规模化。',
    choke: '私有化部署成本、幻觉与可靠性审计、与既有信创栈/等保的兼容、付费意愿。',
    breakout: '「AI+」行动以算力券、场景开放清单托底；垂类小模型+RAG 降低落地门槛。',
    firms: ['行业大模型厂', '科大讯飞', '商汤', '云厂商 MaaS'],
  },
  {
    key: 'agent', label: '智能体 Agent', accent: '#22d3ee', selfRate: 55, weight: 70,
    status: '从「问答」转向「干活」：工具调用、多步规划、长程任务执行成为新评测维度，国内追赶中。',
    choke: '可靠的工具调用与规划能力、长程任务的稳定性、Agent 安全与权限边界。',
    breakout: '政企流程自动化（公文/客服/运维）是先落地场景；MCP 等协议标准化加速生态。',
    firms: ['各模型厂 Agent 栈', 'RPA+LLM 厂商', '云厂商 Agent 平台'],
  },
  {
    key: 'embodied', label: '具身智能', accent: '#10b981', selfRate: 50, weight: 88,
    status: '人形机器人+大模型「大脑」整合：硬件供应链（减速器/电机/传感）是长板，运动控制大模型是新高地。',
    choke: '运动控制与操作的数据稀缺、真实世界泛化、本体成本、训练用仿真与真机数据。',
    breakout: '完整机器人供应链+制造场景需求，提供量产与数据飞轮；政策列为未来产业重点。',
    firms: ['宇树', '智元', '优必选', '本体+大脑整合方'],
  },
];

// ── AI 发展时间线（专用 → 感知 → 大模型 → AI+ → AGI 探索）──────────
const PHASES = [
  { period: '~2012', title: '专用 AI / 感知智能', accent: '#64748b', desc: '深度学习引爆图像/语音识别，安防、人脸、语音转写规模商用；AI 是「单点感知工具」，每个任务一个专用模型。' },
  { period: '2017–2022', title: '深度学习浪潮', accent: '#8b6914', desc: 'Transformer 奠基，预训练范式崛起；算法、算力、数据三要素被反复强调，但能力仍碎片化、垂直化。' },
  { period: '2023–2024', title: '大模型 / 生成式 AI', accent: '#e8a317', desc: 'GPT 冲击引爆「百模大战」，生成式 AI 备案制度落地；通用基座替代专用模型，能力从感知跃向生成与推理。' },
  { period: '2025–', title: 'AI+ 行动 / 智能体', accent: '#c41e3a', desc: '国务院「人工智能+」行动推动全行业融合，重心从「炼模型」转向「用模型」；Agent 从问答转向执行任务。' },
  { period: '远景', title: '通用人工智能 AGI 探索', accent: '#22d3ee', desc: '具身智能+世界模型+长程规划被视为通往 AGI 的路径；算力、能源与安全治理成为新的物理与制度约束。' },
];

// ── 中美 AI 实力六维（雷达，示意）──────────────────────────────────
const POWER_DIMS = ['算力', '算法/模型', '数据', '人才', '资本', '应用生态'];
const POWER_CN = [55, 75, 80, 70, 68, 90];
const POWER_US = [95, 95, 78, 92, 95, 75];

// ── 主要大模型能力对标（散点：能力指数 × 推理成本，示意）──────────
const MODELS = [
  { name: 'GPT-5 级', cap: 96, cost: 90, origin: 'us' },
  { name: 'Gemini 旗舰', cap: 94, cost: 82, origin: 'us' },
  { name: 'Claude 旗舰', cap: 95, cost: 80, origin: 'us' },
  { name: 'DeepSeek', cap: 88, cost: 25, origin: 'cn' },
  { name: 'Qwen', cap: 86, cost: 30, origin: 'cn' },
  { name: '豆包', cap: 82, cost: 28, origin: 'cn' },
  { name: '智谱 GLM', cap: 83, cost: 35, origin: 'cn' },
  { name: 'Kimi', cap: 81, cost: 32, origin: 'cn' },
];

// ── 「AI+」行业渗透率（横向 bar，示意）────────────────────────────
const PENETRATION = [
  { name: '互联网/科技', rate: 65 }, { name: '金融', rate: 48 }, { name: '制造', rate: 35 },
  { name: '政务', rate: 40 }, { name: '医疗', rate: 28 }, { name: '教育', rate: 32 },
  { name: '科研(AI4S)', rate: 30 }, { name: '能源/电力', rate: 25 },
].sort((a, b) => a.rate - b.rate);

export default function Page() {
  const [link, setLink] = useState('chip');
  const [phaseIdx, setPhaseIdx] = useState(3);
  const L = LINKS.find((x) => x.key === link) || LINKS[0];

  // 中美实力雷达（双系列，内联 option）
  const powerRadar = useMemo(() => ({
    tooltip: { trigger: 'item' },
    legend: { data: ['中国', '美国'], textStyle: { color: '#93a1b5', fontSize: 10 }, top: 0, itemWidth: 12 },
    radar: {
      indicator: POWER_DIMS.map((n) => ({ name: n, max: 100 })),
      axisName: { color: '#93a1b5', fontSize: 10 },
      splitLine: { lineStyle: { color: 'rgba(148,163,184,0.15)' } },
      axisLine: { lineStyle: { color: 'rgba(148,163,184,0.15)' } },
      splitArea: { show: false },
    },
    series: [{
      type: 'radar',
      data: [
        { value: POWER_CN, name: '中国', lineStyle: { color: '#c41e3a', width: 2 }, itemStyle: { color: '#c41e3a' }, areaStyle: { color: 'rgba(196,30,58,0.14)' } },
        { value: POWER_US, name: '美国', lineStyle: { color: '#22d3ee', width: 2 }, itemStyle: { color: '#22d3ee' }, areaStyle: { color: 'rgba(34,211,238,0.08)' } },
      ],
    }],
  }), []);

  // 大模型格局散点：能力指数(x) × 推理成本(y)，颜色区分中美
  const modelScatter = useMemo(() => ({
    grid: { left: 48, right: 28, top: 24, bottom: 48 },
    tooltip: { trigger: 'item', formatter: (p) => `${p.data[3]}<br/>能力指数 ${p.data[0]} · 推理成本 ${p.data[1]}` },
    xAxis: valueY({ min: 70, max: 100, name: '能力指数 →', nameLocation: 'middle', nameGap: 28, nameTextStyle: { color: '#93a1b5', fontSize: 10 } }),
    yAxis: valueY({ min: 0, max: 100, name: '推理成本', nameTextStyle: { color: '#93a1b5', fontSize: 10 } }),
    series: [{
      type: 'scatter',
      symbolSize: 18,
      label: { show: true, formatter: (p) => p.data[3], position: 'right', fontSize: 9, color: '#93a1b5' },
      data: MODELS.map((m) => [m.cap, m.cost, m.origin, m.name]),
      itemStyle: {
        color: (p) => (p.data[2] === 'cn' ? '#c41e3a' : '#22d3ee'),
        borderColor: '#fff', borderWidth: 0.5,
      },
      markArea: {
        silent: true, itemStyle: { color: 'rgba(16,185,129,0.06)' },
        data: [[{ xAxis: 80, yAxis: 0 }, { xAxis: 92, yAxis: 40 }]],
      },
    }],
  }), []);

  // 智算供给缺口：算力需求 vs 国产芯片供给（多线，示意）
  const supplyGap = useMemo(() => ({
    grid: { left: 48, right: 16, top: 30, bottom: 24 },
    tooltip: { trigger: 'axis' },
    legend: { data: ['训练算力需求', '国产芯片可供', '受限缺口'], textStyle: { color: '#93a1b5', fontSize: 10 }, top: 0, itemWidth: 12 },
    xAxis: categoryX(['2022', '2023', '2024', '2025E', '2026E', '2027E']),
    yAxis: valueY({ name: 'EFLOPS' }),
    series: [
      { name: '训练算力需求', type: 'line', smooth: true, data: [80, 160, 300, 520, 820, 1200], lineStyle: { color: '#c41e3a', width: 2 }, areaStyle: { color: 'rgba(196,30,58,0.08)' } },
      { name: '国产芯片可供', type: 'line', smooth: true, data: [30, 70, 150, 300, 540, 880], lineStyle: { color: '#10b981', width: 2 } },
      { name: '受限缺口', type: 'bar', barWidth: 14, data: [50, 90, 150, 220, 280, 320], itemStyle: { color: 'rgba(139,0,0,0.55)', borderRadius: [3, 3, 0, 0] } },
    ],
  }), []);

  // AI 算力规模趋势（logY，智算/总算力/智算占比）
  const computeTrend = useMemo(() => ({
    grid: { left: 52, right: 44, top: 30, bottom: 24 },
    tooltip: { trigger: 'axis' },
    legend: { data: ['总算力 EFLOPS', '智能算力 EFLOPS', '智算占比 %'], textStyle: { color: '#93a1b5', fontSize: 10 }, top: 0, itemWidth: 12 },
    xAxis: categoryX(['2021', '2022', '2023', '2024', '2025E']),
    yAxis: [logY({ name: 'EFLOPS(log)' }), valueY({ axisLabel: { formatter: '{value}%' }, splitLine: { show: false }, max: 60 })],
    series: [
      { name: '总算力 EFLOPS', type: 'line', smooth: true, data: [202, 302, 410, 246 + 290, 650], lineStyle: { color: '#64748b', width: 2 } },
      { name: '智能算力 EFLOPS', type: 'line', smooth: true, data: [40, 90, 197, 290, 420], lineStyle: { color: '#c41e3a', width: 2 }, areaStyle: { color: 'rgba(196,30,58,0.08)' } },
      { name: '智算占比 %', type: 'line', yAxisIndex: 1, smooth: true, data: [20, 30, 48, 55, 60], lineStyle: { color: '#e8a317', type: 'dashed' } },
    ],
  }), []);

  // 「AI+」行业渗透率横向 bar
  const penetrationBar = useMemo(() => ({
    grid: { left: 84, right: 36, top: 12, bottom: 16 },
    tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' }, formatter: (p) => `${p[0].name}: ${p[0].value}%` },
    xAxis: valueY({ max: 80 }),
    yAxis: categoryX(PENETRATION.map((r) => r.name)),
    series: [{
      type: 'bar', barWidth: 13,
      data: PENETRATION.map((r) => ({
        value: r.rate,
        itemStyle: { color: r.rate >= 45 ? '#10b981' : r.rate >= 32 ? '#e8a317' : '#c41e3a', borderRadius: [0, 3, 3, 0] },
        label: { show: true, position: 'right', formatter: '{c}%', color: '#93a1b5', fontSize: 9 },
      })),
    }],
  }), []);

  // 价值链各环节自给率 vs 缺口（堆叠 bar）
  const linkGapBar = useMemo(() => stackedBarOpt({
    categories: LINKS.map((x) => x.label),
    series: [
      { name: '自主/长板', data: LINKS.map((x) => x.selfRate), itemStyle: { color: '#10b981' } },
      { name: '受制缺口', data: LINKS.map((x) => 100 - x.selfRate), itemStyle: { color: 'rgba(196,30,58,0.5)' } },
    ],
  }), []);

  // 重点领域 AI 投入结构 donut
  const investDonut = useMemo(() => donutOpt([
    { name: '算力基础设施', value: 38, itemStyle: { color: '#8b0000' } },
    { name: '大模型研发', value: 24, itemStyle: { color: '#c41e3a' } },
    { name: '行业应用落地', value: 22, itemStyle: { color: '#e8a317' } },
    { name: '数据与语料', value: 9, itemStyle: { color: '#22d3ee' } },
    { name: '具身/前沿', value: 7, itemStyle: { color: '#10b981' } },
  ]), []);

  const longboard = LINKS.filter((x) => x.selfRate >= 60).length;
  const choke = LINKS.filter((x) => x.selfRate < 50).length;

  return (
    <div>
      <PageHeader badge="AI+ · 智算主权 · 价值链权力物理" title="人工智能+（AI+）· 智算与行业大模型" subtitle="算力芯片 → 大模型 → 数据语料 → 行业应用 → 智能体 → 具身智能 —— 剥离口号，沿价值链逐环节衡量谁受制、谁是长板、突破口在哪" />
      <IntroCard>
        「人工智能+」的本质不是某个模型，而是一条<strong style={{ color: 'var(--text-primary)' }}>价值链上的非对称分布</strong>：底座的<strong style={{ color: '#c41e3a' }}>高端训练芯片</strong>是最深短板（制程+HBM+生态三重受限），而上层的<strong style={{ color: '#10b981' }}>应用场景与数据规模</strong>则是中国最强长板。开源模型（DeepSeek/Qwen）以效率与成本撕开能力差距，把「炼模型」的劣势对冲为「用模型」的优势。下面沿价值链逐环节拆解：现状、卡脖子点、突破口。
      </IntroCard>

      <Grid cols={4} className="mb-6">
        <Stat value="190+" label="主要大模型/备案厂商（示意）" accent="#c41e3a" />
        <Stat value="290+ E" label="智能算力规模 EFLOPS（示意）" accent="#e8a317" />
        <Stat value="~6,000 亿" label="AI 核心产业规模（元 · 示意）" accent="#22d3ee" />
        <Stat value="~15%" label="高端训练 AI 芯片自给率（示意）" accent="#8b0000" />
      </Grid>

      <Card title="交互① · AI 价值链环节选择器（受制 ↔ 长板）" className="mb-6">
        <SelectorBar items={LINKS} activeKey={link} onSelect={setLink} />
        <div className="os-card p-4 mb-4" style={{ background: 'var(--bg-elevated)', borderLeft: `3px solid ${L.accent}` }}>
          <div className="flex items-baseline gap-2 mb-2 flex-wrap">
            <span className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>{L.label}</span>
            <span className="text-[11px] mono" style={{ color: 'var(--text-tertiary)' }}>自主/长板度 {L.selfRate}% · 战略权重 {L.weight}</span>
          </div>
          <p className="text-xs leading-relaxed mb-1.5" style={{ color: 'var(--text-secondary)' }}><strong style={{ color: 'var(--text-primary)' }}>现状：</strong>{L.status}</p>
          <p className="text-xs leading-relaxed mb-1.5" style={{ color: 'var(--text-secondary)' }}><strong style={{ color: '#c41e3a' }}>卡脖子点：</strong>{L.choke}</p>
          <p className="text-xs leading-relaxed mb-2" style={{ color: 'var(--text-secondary)' }}><strong style={{ color: '#10b981' }}>突破口：</strong>{L.breakout}</p>
          <div className="flex flex-wrap gap-1.5 mt-2">
            {L.firms.map((f) => (
              <span key={f} className="text-[10px] mono px-1.5 py-0.5 rounded" style={{ background: 'var(--bg-surface)', color: 'var(--text-tertiary)', border: '1px solid var(--border-subtle)' }}>{f}</span>
            ))}
          </div>
        </div>
        <Grid cols={2}>
          <Card title="价值链各环节 · 自主长板 vs 受制缺口"><EChart option={linkGapBar} style={{ height: 240 }} /></Card>
          <Card title="重点领域 AI 投入结构（示意）"><EChart option={investDonut} style={{ height: 240 }} /></Card>
        </Grid>
      </Card>

      <Grid cols={2} className="mb-6">
        <Card title="交互② · 中美 AI 实力六维雷达（中国 vs 美国）">
          <p className="text-[11px] mb-2 mono" style={{ color: 'var(--text-tertiary)' }}>红=中国 · 青=美国 · 算力/资本/人才是差距，应用生态/数据是长板</p>
          <EChart option={powerRadar} style={{ height: 260 }} />
        </Card>
        <Card title="大模型格局 · 能力指数 × 推理成本（红=中 · 青=美）">
          <p className="text-[11px] mb-2 mono" style={{ color: 'var(--text-tertiary)' }}>绿区=「高性价比甜区」：能力追至一线、成本压至零头——开源路线的杀手锏</p>
          <EChart option={modelScatter} style={{ height: 260 }} />
        </Card>
      </Grid>

      <Grid cols={2} className="mb-6">
        <Card title="智算供给瓶颈 · 算力需求 vs 国产芯片可供">
          <p className="text-[11px] mb-2 mono" style={{ color: 'var(--text-tertiary)' }}>高端 GPU 受限下，需求曲线陡升、国产供给追赶，红柱=受限缺口（示意）</p>
          <EChart option={supplyGap} style={{ height: 260 }} />
        </Card>
        <Card title="AI 算力规模趋势 · 智算占比攀升（log 轴）">
          <p className="text-[11px] mb-2 mono" style={{ color: 'var(--text-tertiary)' }}>智能算力增速远超总算力，占比从约 20% 升向 60%（示意）</p>
          <EChart option={computeTrend} style={{ height: 260 }} />
        </Card>
      </Grid>

      <Card title="「AI+」行业渗透率 · 谁先被重塑（示意）" className="mb-6">
        <p className="text-[11px] mb-2 mono" style={{ color: 'var(--text-tertiary)' }}>绿≥45% 深度渗透 · 黄 32—45% 加速期 · 红&lt;32% 早期试点</p>
        <EChart option={penetrationBar} style={{ height: 280 }} />
      </Card>

      <Card title="交互③ · AI 发展时间线（感知 → 大模型 → AI+ → AGI 探索）" className="mb-6">
        <TimelineBar stages={PHASES} activeIdx={phaseIdx} onSelect={setPhaseIdx} />
        <Grid cols={5} className="mt-4">
          {PHASES.map((p, i) => (
            <div key={p.title} className="os-card p-3" style={{ background: 'var(--bg-elevated)', borderTop: `2px solid ${p.accent}`, opacity: i === phaseIdx ? 1 : 0.5, transition: 'opacity .15s' }}>
              <div className="text-[10px] mono mb-1" style={{ color: p.accent }}>{p.period}</div>
              <div className="text-[11px] font-semibold" style={{ color: 'var(--text-primary)' }}>{p.title}</div>
            </div>
          ))}
        </Grid>
      </Card>

      <Grid cols={2} className="mb-6">
        <Card title="长板 · 场景与数据规模">
          <div className="space-y-2">
            {[['应用场景密度', '制造/政务/金融落地速度全球领先，超大单一市场提供训练与迭代飞轮。', '#10b981'],
              ['中文与行业数据', '人口与产业规模带来海量私域数据，数据要素市场化进一步释放供给。', '#34d399'],
              ['开源生态', 'DeepSeek/Qwen 以效率与低成本形成全球外溢，把劣势转为生态杠杆。', '#22d3ee'],
              ['机器人供应链', '具身智能本体（减速器/电机/传感）供应链完整，支撑量产与数据采集。', '#e8a317']].map(([tit, d, c]) => (
              <div key={tit} style={{ borderLeft: `2px solid ${c}`, paddingLeft: 10 }}>
                <div className="text-xs font-semibold" style={{ color: 'var(--text-primary)' }}>{tit}</div>
                <p className="text-[11px] mt-0.5" style={{ color: 'var(--text-tertiary)' }}>{d}</p>
              </div>
            ))}
          </div>
        </Card>
        <Card title="短板 · 算力卡脖子链路">
          <div className="space-y-3">
            {[['制程断点', '高端训练 GPU 受出口管制，国产芯片卡在先进制程与 HBM 高带宽显存，单卡性能与互联带宽落后。'],
              ['生态迁移', 'CUDA 十余年生态护城河深，昇腾/MindSpore 等替代栈需重建算子、框架与开发者习惯。'],
              ['以量补质', '当前以「堆卡换制程」补算力规模，但能耗、互联与良率约束抬高训练成本曲线，绿电与东数西算成为缓冲。']].map(([tit, d]) => (
              <div key={tit}>
                <div className="text-xs font-semibold mb-1" style={{ color: 'var(--china-red)' }}>{tit}</div>
                <p className="text-[11px] leading-relaxed" style={{ color: 'var(--text-tertiary)' }}>{d}</p>
              </div>
            ))}
          </div>
        </Card>
      </Grid>

      <FrameworkTrio cards={[
        { title: '场景与数据优势', subtitle: '应用规模 = 中国长板', accent: '#10b981', border: '#10b981', body: '超大单一市场 + 完整产业体系，使中国在「用 AI」一端拥有全球最密的场景与数据飞轮。应用落地速度领先，数据要素市场化进一步把政务/医疗/工业私域数据转为训练供给。', pillars: [['场景密度', '制造/政务先行。'], ['数据规模', '私域数据飞轮。'], ['开源外溢', '生态杠杆。']] },
        { title: '算力卡脖子', subtitle: '高端芯片 = 最深短板', accent: '#c41e3a', border: '#c41e3a', body: '价值链最底座的训练芯片受制程、HBM 与 CUDA 生态三重约束，是「人工智能+」的物理上限。以堆卡补算力、以推理替训练、以开源压成本，是当前的对冲组合，但训练侧差距短期难补。', pillars: [['制程+HBM', '硬约束。'], ['CUDA 生态', '迁移成本。'], ['以量补质', '能耗代价。']] },
        { title: 'AI+ 赋能', subtitle: '通用技术 · 乘数效应', accent: '#22d3ee', border: '#22d3ee', body: 'AI 作为通用目的技术，其价值在于对全产业的乘数效应而非单点。「人工智能+」行动以算力券、场景开放清单、数据授权托底，把模型能力转化为制造、政务、科研（AI4S）与具身智能的全局生产力。', pillars: [['通用技术', '全产业乘数。'], ['政策托底', '算力券/清单。'], ['AI4S/具身', '前沿增量。']] },
      ]} />

      <Card title="研判要点" className="mb-6">
        <Grid cols={3}>
          {[['1 · 非对称分布', `价值链一端受制（算力芯片）、一端领先（应用场景）；当前长板 ${longboard} 环、高危短板 ${choke} 环。`],
            ['2 · 用模型 > 炼模型', '重心从顶尖能力竞赛转向行业渗透与成本工程，开源+微调是把劣势对冲为胜势的路径。'],
            ['3 · 强耦合约束', '与半导体、能源（绿电/PUE）、数据要素深度联动，合规与算力成本共同决定渗透节奏。']].map(([t, d]) => (
            <div key={t}><div className="text-sm font-semibold" style={{ color: 'var(--china-red)' }}>{t}</div><p className="text-xs mt-1 leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{d}</p></div>
          ))}
        </Grid>
      </Card>

      <ModuleFooter moduleId="aiplus" disclaimer="示意数据非官方统计，自主率/渗透率/能力对标均为公开资料整理的分析框架估值 · 仅供研究参考，非投资建议" sourceNote="由 china.html「AI+」专题迁移并大幅扩容" />
    </div>
  );
}
