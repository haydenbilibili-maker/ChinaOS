import React, { useState, useMemo } from 'react';
import { PageHeader, Card, Grid, Stat } from '../../app/ui.jsx';
import EChart from '../../lib/viz/EChart.jsx';
import { categoryX, valueY, logY, GRID, donutOpt, radarOpt, stackedBarOpt, AXIS, LABEL } from '../shared/chartHelpers.js';
import { IntroCard, SelectorBar, TimelineBar, FrameworkTrio, ModuleFooter } from '../shared/ModuleParadigm.jsx';

// ── 技术路线（六条）：原理 / 成熟度 / 应用 / 风险伦理 ────────────────────────
const TRACKS = [
  {
    key: 'invasive', label: '侵入式电极', accent: '#c41e3a',
    principle: '微电极阵列穿透皮层，直接记录单神经元放电——带宽与分辨率的物理天花板。',
    maturity: 35, bandwidth: 96, trauma: 92,
    apps: '高位截瘫运动重建、皮层言语解码、闭环深部脑刺激。',
    risk: '开颅创伤、胶质瘢痕致信号衰减、电极长期生物相容性未解；伦理门槛最高。',
    metric: [96, 92, 30, 40, 35],
  },
  {
    key: 'semi', label: '半侵入式', accent: '#e8a317',
    principle: '皮层表面或硬膜下 ECoG 电极，不穿透神经元——创伤与带宽的折中带。',
    maturity: 48, bandwidth: 72, trauma: 58,
    apps: '癫痫灶定位、运动皮层解码临床试点、术中脑功能映射。',
    risk: '仍需开颅放置，感染与异物反应风险中等；空间分辨率逊于穿透式。',
    metric: [72, 68, 55, 62, 55],
  },
  {
    key: 'noninv', label: '非侵入式', accent: '#22d3ee',
    principle: '头皮 EEG / fNIRS / MEG，隔颅骨采集群体电位——零创伤但信号被严重衰减。',
    maturity: 72, bandwidth: 40, trauma: 8,
    apps: '消费级神经反馈、康复训练、疲劳与注意力监测、脑控外设。',
    risk: '信噪比低、空间分辨率粗；伦理风险更多在数据滥用而非生物安全。',
    metric: [40, 35, 92, 95, 80],
  },
  {
    key: 'decode', label: '神经信号解码', accent: '#8b5cf6',
    principle: '深度学习将神经放电序列映射为意图/语义——算力与数据决定上限。',
    maturity: 55, bandwidth: 78, trauma: 20,
    apps: '想象语音转文本、运动意图实时控制、情绪与认知状态识别。',
    risk: '解码模型可被逆向推断心理状态——「读心」灰区；训练数据即神经隐私。',
    metric: [78, 80, 60, 50, 45],
  },
  {
    key: 'stim', label: '神经调控', accent: '#10b981',
    principle: '电/磁/超声向特定脑区写入信号——从「读」走向「写」的权力跃迁。',
    maturity: 50, bandwidth: 60, trauma: 45,
    apps: '帕金森 DBS、抑郁与成瘾闭环刺激、超声无创神经调制。',
    risk: '「写入」能力触及人格与意志边界——认知操控与责任归属的伦理深水区。',
    metric: [60, 58, 50, 48, 30],
  },
  {
    key: 'chip', label: '类脑芯片', accent: '#ec4899',
    principle: '神经形态计算模拟脉冲神经网络——为 BCI 提供低功耗边缘解码底座。',
    maturity: 42, bandwidth: 70, trauma: 5,
    apps: '植入端实时解码、超低功耗边缘 AI、感知-决策一体化。',
    risk: '生态与工具链不成熟；标准未定，长期路线尚在收敛。',
    metric: [70, 65, 70, 75, 50],
  },
];

// ── 阶段时间线 ─────────────────────────────────────────────────────────────
const PHASES = [
  { period: '—2010', title: '基础神经科学', accent: '#64748b', desc: '电生理与皮层编码机制奠基；猴脑运动皮层解码原理验证。' },
  { period: '2011–2018', title: '非侵入式康复', accent: '#22d3ee', desc: 'EEG 神经反馈、脑控轮椅/外骨骼进入康复临床与消费级。' },
  { period: '2019–2024', title: '侵入式临床试验', accent: '#e8a317', desc: '全植入式运动/言语解码人体试验启动，国内「北脑」等团队跟进。' },
  { period: '2024–2030', title: '神经数据治理', accent: '#c41e3a', desc: '神经数据列为新型敏感数据，分类分级、伦理审查与跨境管制成型。' },
  { period: '2030+', title: '认知增强 · 人机融合', accent: '#8b5cf6', desc: '记忆/感知增强与高带宽融合进入远期议程——伦理与权力边界前置博弈。' },
];

// ── 应用场景 donut ─────────────────────────────────────────────────────────
const APP_SHARE = [
  { name: '医疗康复（瘫痪/渐冻/言语）', value: 52, itemStyle: { color: '#10b981' } },
  { name: '感知替代（视/听觉假体）', value: 16, itemStyle: { color: '#22d3ee' } },
  { name: '认知增强（注意/记忆）', value: 12, itemStyle: { color: '#8b5cf6' } },
  { name: '工业军事（脑控/人机一体）', value: 12, itemStyle: { color: '#c41e3a' } },
  { name: '消费（神经反馈/娱乐）', value: 8, itemStyle: { color: '#e8a317' } },
];

// ── 临床/产业进展趋势（示意） ──────────────────────────────────────────────
const TRIAL_YEARS = ['2018', '2019', '2020', '2021', '2022', '2023', '2024', '2025'];
const GLOBAL_TRIALS = [38, 52, 71, 98, 135, 188, 256, 340];
const CN_TRIALS = [4, 7, 12, 21, 38, 64, 108, 175];
const CN_IMPLANTS = [0, 0, 1, 2, 5, 11, 24, 52];

export default function Page() {
  const [track, setTrack] = useState('invasive');
  const [phaseIdx, setPhaseIdx] = useState(3);
  const t = TRACKS.find((x) => x.key === track) || TRACKS[0];

  // 路线能力曲线：成熟度 / 带宽 / 创伤（创伤越低越好，反相展示「安全度」）
  const trackBars = useMemo(() => ({
    grid: GRID,
    tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
    xAxis: categoryX(['成熟度', '信号带宽', '安全度', '应用广度']),
    yAxis: valueY({ max: 100 }),
    series: [{
      type: 'bar', barWidth: 30,
      data: [t.maturity, t.bandwidth, 100 - t.trauma, t.metric[2]].map((v) => ({
        value: v, itemStyle: { color: t.accent, borderRadius: [4, 4, 0, 0] },
      })),
      label: { show: true, position: 'top', color: LABEL.color, fontSize: 10 },
    }],
  }), [t]);

  // 路线能力雷达：当前路线 vs 行业均值
  const trackRadar = useMemo(() => ({
    legend: { top: 0, textStyle: { color: LABEL.color }, data: [t.label, '行业均值'] },
    ...radarOpt(['信号带宽', '通道密度', '佩戴便利', '生物安全', '产业化'], t.metric, { name: t.label, color: t.accent }),
    series: [{
      type: 'radar', data: [
        { value: t.metric, name: t.label, lineStyle: { color: t.accent, width: 2 }, areaStyle: { color: `${t.accent}22` } },
        { value: [66, 62, 65, 62, 50], name: '行业均值', lineStyle: { color: '#64748b', type: 'dashed' } },
      ],
    }],
  }), [t]);

  // 技术路线对比散点：信号质量(x) vs 创伤/风险(y)，气泡=成熟度
  const tradeoffScatter = useMemo(() => ({
    tooltip: {
      trigger: 'item',
      formatter: (d) => `${d.data[2]}<br/>信号质量 ${d.data[0]} · 创伤风险 ${d.data[1]} · 成熟度 ${d.data[3]}`,
    },
    grid: { left: 48, right: 24, top: 24, bottom: 40 },
    xAxis: valueY({ name: '信号质量 →', min: 0, max: 100, nameTextStyle: { color: LABEL.color } }),
    yAxis: valueY({ name: '创伤/风险 →', min: 0, max: 100, nameTextStyle: { color: LABEL.color } }),
    series: [{
      type: 'scatter',
      symbolSize: (d) => 12 + d[3] * 0.4,
      data: TRACKS.map((x) => ({
        value: [x.bandwidth, x.trauma, x.label, x.maturity],
        itemStyle: { color: x.accent, opacity: x.key === track ? 1 : 0.45, borderColor: '#fff', borderWidth: x.key === track ? 1.5 : 0 },
      })),
      label: {
        show: true, position: 'right', fontSize: 10, color: LABEL.color,
        formatter: (d) => d.data.value[2],
      },
      markLine: {
        silent: true, symbol: 'none', lineStyle: { color: '#64748b', type: 'dashed' },
        data: [{ yAxis: 50 }, { xAxis: 50 }],
      },
    }],
  }), [track]);

  // 中美 BCI 实力雷达（双系列内联）
  const cnUsRadar = useMemo(() => ({
    legend: { top: 0, textStyle: { color: LABEL.color }, data: ['美国', '中国'] },
    radar: {
      indicator: ['电极材料', '芯片解码', '解码算法', '临床转化', '伦理治理', '产业化'].map((n) => ({ name: n, max: 100 })),
      axisName: { color: LABEL.color, fontSize: 10 },
      splitLine: { lineStyle: { color: 'rgba(148,163,184,0.15)' } },
      axisLine: { lineStyle: { color: 'rgba(148,163,184,0.15)' } },
      splitArea: { show: false },
    },
    series: [{
      type: 'radar', data: [
        { value: [88, 90, 92, 85, 72, 80], name: '美国', lineStyle: { color: '#22d3ee', width: 2 }, itemStyle: { color: '#22d3ee' }, areaStyle: { color: 'rgba(34,211,238,0.12)' } },
        { value: [70, 72, 80, 68, 65, 78], name: '中国', lineStyle: { color: '#c41e3a', width: 2 }, itemStyle: { color: '#c41e3a' }, areaStyle: { color: 'rgba(196,30,58,0.12)' } },
      ],
    }],
  }), []);

  // 应用场景 donut
  const appDonut = useMemo(() => donutOpt(APP_SHARE), []);

  // 临床/产业进展趋势（log 轴：全球 vs 中国试验 + 中国植入案例）
  const trialTrend = useMemo(() => ({
    tooltip: { trigger: 'axis' },
    legend: { top: 0, textStyle: { color: LABEL.color, fontSize: 10 }, data: ['全球临床试验', '中国临床试验', '中国植入案例'] },
    grid: { left: 44, right: 16, top: 30, bottom: 24 },
    xAxis: categoryX(TRIAL_YEARS),
    yAxis: logY({ name: '累计（示意）' }),
    series: [
      { name: '全球临床试验', type: 'line', smooth: true, symbol: 'circle', data: GLOBAL_TRIALS, lineStyle: { color: '#22d3ee', width: 2 }, itemStyle: { color: '#22d3ee' } },
      { name: '中国临床试验', type: 'line', smooth: true, symbol: 'circle', data: CN_TRIALS, lineStyle: { color: '#c41e3a', width: 2 }, itemStyle: { color: '#c41e3a' }, areaStyle: { color: 'rgba(196,30,58,0.1)' } },
      { name: '中国植入案例', type: 'line', smooth: true, symbol: 'diamond', data: CN_IMPLANTS.map((v) => v || 0.5), lineStyle: { color: '#e8a317', width: 2, type: 'dashed' }, itemStyle: { color: '#e8a317' } },
    ],
  }), []);

  // 伦理规制成熟度（堆叠：已立 / 在研 / 缺口）
  const ethicsStack = useMemo(() => stackedBarOpt({
    categories: ['知情同意', '神经数据分级', '跨境传输', '临床伦理审查', '出口管制', '认知操控红线'],
    horizontal: true,
    series: [
      { name: '已确立', data: [70, 45, 35, 75, 40, 20], itemStyle: { color: '#10b981' } },
      { name: '在研', data: [20, 35, 38, 18, 35, 30], itemStyle: { color: '#e8a317' } },
      { name: '缺口', data: [10, 20, 27, 7, 25, 50], itemStyle: { color: '#c41e3a' } },
    ],
  }), []);

  return (
    <div>
      <PageHeader badge="Neural Sovereignty · 神经主权" title="脑机接口 · 神经数据主权" subtitle="侵入/非侵入 · 神经解码与调控 · 类脑芯片 · 伦理规制" />
      <IntroCard>
        BCI 是理解大脑这一<strong style={{ color: 'var(--text-primary)' }}>终极科学前沿</strong>的工程化兑现。其核心张力恒在三处：
        <strong style={{ color: 'var(--text-primary)' }}>信号带宽 vs 生物创伤</strong>、<strong style={{ color: 'var(--text-primary)' }}>「读」神经 vs 「写」神经</strong>、
        以及神经数据这一终极隐私的<strong style={{ color: 'var(--text-primary)' }}>主权归属</strong>。从医疗康复的福祉到认知操控的风险，技术的双刃在此处尤为锋利——伦理治理必须先行。
      </IntroCard>

      <Grid cols={4} className="mb-6">
        <Stat value="340+" label="全球 BCI 临床试验（累计·示意）" accent="#22d3ee" />
        <Stat value="52" label="中国植入案例（累计·示意）" accent="#c41e3a" />
        <Stat value="类脑芯片" label="低功耗边缘解码底座" accent="#ec4899" />
        <Stat value="神经数据" label="新型敏感数据 · 待立规" accent="#10b981" />
      </Grid>

      <Card title="交互① · 技术路线选择器" className="mb-6">
        <SelectorBar items={TRACKS} activeKey={track} onSelect={setTrack} />
        <div className="os-card p-4 mb-4" style={{ background: 'var(--bg-elevated)', borderLeft: `3px solid ${t.accent}` }}>
          <div className="text-sm font-semibold mb-2" style={{ color: t.accent }}>{t.label} · 原理</div>
          <p className="text-sm leading-relaxed mb-3" style={{ color: 'var(--text-secondary)' }}>{t.principle}</p>
          <Grid cols={2}>
            <div>
              <div className="text-xs font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>应用</div>
              <p className="text-xs leading-relaxed" style={{ color: 'var(--text-tertiary)' }}>{t.apps}</p>
            </div>
            <div>
              <div className="text-xs font-semibold mb-1" style={{ color: '#c41e3a' }}>风险 / 伦理</div>
              <p className="text-xs leading-relaxed" style={{ color: 'var(--text-tertiary)' }}>{t.risk}</p>
            </div>
          </Grid>
        </div>
        <Grid cols={2}>
          <Card title="路线能力四维（成熟度/带宽/安全/广度）"><EChart option={trackBars} style={{ height: 240 }} /></Card>
          <Card title="路线能力雷达 vs 行业均值"><EChart option={trackRadar} style={{ height: 240 }} /></Card>
        </Grid>
      </Card>

      <Card title="交互② · BCI 技术路线权衡 · 信号质量 vs 创伤风险" className="mb-6">
        <div className="os-card p-4 mb-4" style={{ background: 'var(--bg-elevated)', borderLeft: '3px solid #8b5cf6' }}>
          <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
            BCI 的根本物理约束：<strong style={{ color: 'var(--text-primary)' }}>信号带宽与生物创伤正相关</strong>。
            侵入式占据「高带宽-高风险」象限，非侵入式落在「安全-低带宽」象限——没有免费的分辨率。气泡大小代表技术成熟度，当前选中路线高亮。
          </p>
        </div>
        <EChart option={tradeoffScatter} style={{ height: 300 }} />
      </Card>

      <Card title="交互③ · 中美 BCI 实力雷达" className="mb-6">
        <div className="os-card p-4 mb-4" style={{ background: 'var(--bg-elevated)', borderLeft: '3px solid #c41e3a' }}>
          <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
            美国在<strong style={{ color: 'var(--text-primary)' }}>电极材料、芯片解码与临床转化</strong>上保持先发；中国在<strong style={{ color: 'var(--text-primary)' }}>解码算法与产业化规模</strong>上快速逼近，伦理治理框架同步构建。差距非鸿沟，而是时间窗。
          </p>
        </div>
        <Grid cols={2}>
          <Card title="六维国家能力对比"><EChart option={cnUsRadar} style={{ height: 260 }} /></Card>
          <Card title="应用场景结构（近期·示意）"><EChart option={appDonut} style={{ height: 260 }} /></Card>
        </Grid>
      </Card>

      <Card title="交互④ · 临床与产业进展趋势" className="mb-6">
        <div className="os-card p-4 mb-4" style={{ background: 'var(--bg-elevated)', borderLeft: '3px solid #e8a317' }}>
          <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
            全球 BCI 临床试验自 2018 年起呈指数攀升，中国试验数与植入案例后发追赶、增速更陡（「北脑」等团队推动）。对数轴显示量级差异——中国正从演示走向规模化临床。
          </p>
        </div>
        <EChart option={trialTrend} style={{ height: 280 }} />
      </Card>

      <Card title="交互⑤ · BCI 规制演进时间线" className="mb-6">
        <TimelineBar stages={PHASES} activeIdx={phaseIdx} onSelect={setPhaseIdx} />
      </Card>

      <Card title="神经数据主权与伦理红线" className="mb-6">
        <Grid cols={2}>
          <div className="os-card p-5" style={{ background: 'var(--bg-surface)', borderLeft: '3px solid #c41e3a' }}>
            <div className="text-sm font-semibold mb-2" style={{ color: '#c41e3a' }}>神经数据 = 终极隐私</div>
            <p className="text-sm leading-relaxed mb-3" style={{ color: 'var(--text-secondary)' }}>
              神经信号直接编码意图、情绪与认知状态——它不是「关于你」的数据，它就是你本身。一旦泄露或被解码逆向，
              心理状态、潜在意图乃至人格特征皆可被推断。神经数据须被认定为<strong style={{ color: 'var(--text-primary)' }}>最高敏感级别</strong>，其主权属于个体，不可默认让渡。
            </p>
            <div className="grid gap-3" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
              {[['数据主权', '采集即授权，个体保有删除与拒绝解码权。'], ['伦理红线', '禁止认知操控、强制读取与意志写入。'], ['治理框架', '分类分级 · 伦理审查 · 跨境管制前置。']].map(([k, v]) => (
                <div key={k}>
                  <div className="text-xs font-semibold mb-1" style={{ color: '#c41e3a' }}>{k}</div>
                  <p className="text-[11px] leading-relaxed" style={{ color: 'var(--text-tertiary)' }}>{v}</p>
                </div>
              ))}
            </div>
          </div>
          <Card title="伦理规制成熟度（已确立/在研/缺口·示意）">
            <EChart option={ethicsStack} style={{ height: 240 }} />
          </Card>
        </Grid>
      </Card>

      <FrameworkTrio cards={[
        {
          title: '终极前沿卡位', subtitle: '长波 · 理解大脑', accent: 'var(--cyber-cyan)', border: 'var(--cyber-cyan)',
          body: '理解大脑是科学的最后疆域。谁先工程化兑现高带宽神经接口，谁就握住认知时代的底层接口。',
          pillars: [['长波', '数十年科学积累的工程收口。'], ['底座', '类脑芯片+解码算法。'], ['卡位', '标准与伦理同步博弈。']],
        },
        {
          title: '双刃剑', subtitle: '福祉 vs 操控', accent: 'var(--fire-gold)', border: 'var(--fire-gold)',
          body: '同一套「写入」能力，既能让瘫痪者重新行走，也能逼近认知操控与意志干预的边界。',
          pillars: [['医疗福祉', '运动/言语重建、神经调控。'], ['认知风险', '操控、读心、数据滥用。'], ['责任归属', '写入即介入人格边界。']],
        },
        {
          title: '伦理治理先行', subtitle: '神经权利 · 数据红线', accent: 'var(--china-red)', border: 'var(--china-red)',
          body: '在能力爆发前确立神经权利与数据红线——治理不是技术的刹车，而是其可持续的轨道。',
          pillars: [['神经权利', '心理隐私与意志自主。'], ['数据红线', '不可强制读取/写入。'], ['前置规制', '分级·审查·跨境管制。']],
        },
      ]} />

      <ModuleFooter
        moduleId="neural"
        disclaimer="数据为示意值，仅供分析框架参考，非医疗建议、非投资建议 · 临床决策请遵医嘱"
        sourceNote="由 china.html「脑机接口」专题迁移并扩容"
      />
    </div>
  );
}
