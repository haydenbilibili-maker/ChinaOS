import React, { useState, useMemo } from 'react';
import { PageHeader, Card, Grid, Stat } from '../../app/ui.jsx';
import EChart from '../../lib/viz/EChart.jsx';
import { categoryX, valueY, logY, GRID, donutOpt, radarOpt, stackedBarOpt, AXIS, LABEL } from '../shared/chartHelpers.js';
import { IntroCard, SelectorBar, TimelineBar, FrameworkTrio, ModuleFooter } from '../shared/ModuleParadigm.jsx';

// ---------------------------------------------------------------------------
// 一、治理机制库 —— 六大基层治理机制（控制 vs 自治的光谱排布）
// ---------------------------------------------------------------------------
const MECHANISMS = [
  {
    key: 'grid', label: '网格化管理', accent: '#c41e3a',
    principle: '把国土切成数百万个 300–500 户的微观「网格」，每格配 1 名以上专兼职网格员，承担「人地物事情」全要素采集。网格是体制的末梢传感器：权力第一次以物理颗粒度触达每一栋楼、每一户人。',
    scale: '全国约 450 万网格员 · 城乡网格超 400 万个 · 覆盖率接近 100%',
    effect: '风险感知前置：从「事后处置」转向「事前发现」。流动人口、出租屋、独居老人、矛盾苗头被纳入实时台账。',
    tension: '控制端极强：网格员既是服务员也是信息员，「服务」与「监控」共用同一套管线 —— 这是网格化最深的结构性双义。',
    ctrl: 92, auto: 35,
    radar: [90, 78, 72, 60, 85, 38],
  },
  {
    key: 'whistle', label: '吹哨报到', accent: '#22d3ee',
    principle: '北京首创的「街乡吹哨、部门报到」：基层发现问题但无执法权时，可「吹哨」召集区级部门下沉会签处置，考核权倒挂 —— 部门是否报到、问题是否解决，由街道打分。',
    scale: '从北京平谷扩散至全国大中城市 · 已演化为「接诉即办」12345 热线驱动模式',
    effect: '局部矫正了「看得见的管不了、管得了的看不见」的条块断裂：权随事走、费随事转。',
    tension: '哨声本质是「以考核换协同」：部门报到是迫于打分压力而非流程重构，条块矛盾被缓释、未被消解。',
    ctrl: 68, auto: 52,
    radar: [75, 82, 80, 55, 70, 50],
  },
  {
    key: 'center', label: '综治中心', accent: '#e8a317',
    principle: '县乡两级「社会治安综合治理中心」实体化运行：信访接待、人民调解、法律援助、心理服务、网格指挥多窗合一，矛盾纠纷「只进一扇门、最多跑一地」。',
    scale: '县级综治中心规范化建设全覆盖推进中 · 乡镇（街道）综治中心实体化率持续提升',
    effect: '把分散在政法、信访、司法的化解资源物理集中，形成矛盾处置的「急诊分诊台」。',
    tension: '中心化集成提升效率，但也使「化解率」成为硬考核 —— 指标压力下存在「化解」与「摆平」的边界模糊。',
    ctrl: 78, auto: 45,
    radar: [80, 92, 68, 58, 75, 42],
  },
  {
    key: 'fengqiao', label: '枫桥经验', accent: '#10b981',
    principle: '1963 年浙江诸暨枫桥镇的群众工作方法，被反复重提为治理正统：「小事不出村、大事不出镇、矛盾不上交」。本质是把矛盾化解成本压在最低层级，用熟人社会 + 调解网络在源头泄压。',
    scale: '全国人民调解委员会约 69 万个 · 人民调解员超 300 万 · 年化解纠纷千万件级',
    effect: '极低成本的社会减压阀：一件纠纷走调解的财政成本约为走诉讼的 1/10 以下。',
    tension: '「不上交」是结果指标也是政治指标 —— 当化解率成为考核，部分矛盾可能被「按住」而非「解开」。',
    ctrl: 55, auto: 70,
    radar: [70, 95, 60, 75, 40, 72],
  },
  {
    key: 'community', label: '社区自治', accent: '#8b5cf6',
    principle: '居委会/村委会法律上是「基层群众性自治组织」，配套业委会、社区社会组织、协商议事会。理论上是国家与社会的缓冲层，实践中高度「行政吸纳」：80% 以上工时用于承接政府下派任务。',
    scale: '城市社区约 11.6 万个 · 社区社会组织约 175 万个 · 注册志愿者超 2.3 亿人',
    effect: '议事协商、积分制、时间银行等微创新持续出现，自治活力在「行政外包」缝隙中生长。',
    tension: '自治组织的人、财、考核全部向上依附 —— 「自治」更多是治理话语而非权力事实。',
    ctrl: 48, auto: 78,
    radar: [55, 68, 78, 82, 45, 85],
  },
  {
    key: 'smart', label: '智慧社区', accent: '#fb923c',
    principle: '人脸门禁、高空抛物摄像、独居老人水电监测、社区 App 报事 —— 把网格员的「腿」换成传感器的「线」。城市大脑向下延伸的最后一米，治理感知从「人采」转向「机采」。',
    scale: '智慧社区试点覆盖主要城市 · 「一网统管」城市运行平台地级市基本建成',
    effect: '感知密度和响应速度数量级提升：高空抛物溯源、独居老人异常用水预警等场景已常态化。',
    tension: '传感器不疲劳、不遗忘、不讲情面 —— 数字化让「全景敞视」从隐喻变成基础设施，隐私与便利的交换不可逆。',
    ctrl: 88, auto: 30,
    radar: [95, 65, 75, 50, 96, 28],
  },
];

const RADAR_DIMS = ['风险感知', '矛盾化解', '服务供给', '动员能力', '数字化', '自治活力'];

// ---------------------------------------------------------------------------
// 二、静态图表 —— 治理层级漏斗 / 化解率曲线 / 赛博雷达（保留原资产）
// ---------------------------------------------------------------------------
const depthFunnel = {
  series: [{
    type: 'funnel', left: '10%', top: 16, bottom: 16, width: '80%',
    min: 0, max: 100, minSize: '20%', maxSize: '100%', sort: 'descending', gap: 2,
    label: { show: true, position: 'inside', fontSize: 10, color: '#fff' },
    itemStyle: { borderColor: 'transparent', borderWidth: 0 },
    emphasis: { label: { fontSize: 12 } },
    data: [
      { value: 100, name: '市/州（顶层指挥）', itemStyle: { color: '#c41e3a' } },
      { value: 80, name: '县/区（资源调度）', itemStyle: { color: '#e8a317' } },
      { value: 60, name: '街/镇（阵地前移）', itemStyle: { color: '#22d3ee' } },
      { value: 40, name: '社区（微观网格）', itemStyle: { color: '#10b981' } },
    ],
  }],
};

const conflictLine = {
  grid: { left: 44, right: 16, top: 20, bottom: 24 },
  xAxis: categoryX(['2018', '2020', '2022', '2024']),
  yAxis: valueY({ max: 100, axisLabel: { formatter: '{value}%' } }),
  series: [{ name: '矛盾就地化解率', type: 'line', smooth: true, symbol: 'circle', symbolSize: 6, data: [78, 85, 92, 96.8], lineStyle: { color: '#e8a317', width: 2 }, itemStyle: { color: '#e8a317' }, areaStyle: { color: 'rgba(232,163,23,0.12)' } }],
};

const cyberRadar = radarOpt(
  ['舆情预判', '数据穿透力', '响应速度', '资源触达度', '反馈闭环率'],
  [95, 98, 92, 90, 96],
  { name: '当前治理效能', color: '#22d3ee' },
);

// 网格体系五级结构 donut（数值为示意构成比，%）
const gridDonut = donutOpt([
  { value: 2, name: '市级平台（指挥中枢）', itemStyle: { color: '#c41e3a' } },
  { value: 6, name: '区县综治中心', itemStyle: { color: '#e8a317' } },
  { value: 12, name: '街镇网格化平台', itemStyle: { color: '#22d3ee' } },
  { value: 28, name: '社区（村）工作站', itemStyle: { color: '#8b5cf6' } },
  { value: 52, name: '基础网格（终端单元）', itemStyle: { color: '#10b981' } },
]);

// 矛盾化解漏斗 —— 枫桥分流：进入司法程序前逐级泄压（示意，基数=100）
const resolveFunnel = {
  tooltip: { trigger: 'item', formatter: '{b}: {c}（每 100 件纠纷）' },
  series: [{
    type: 'funnel', left: '8%', top: 12, bottom: 12, width: '84%',
    min: 0, max: 100, minSize: '8%', maxSize: '100%', sort: 'descending', gap: 3,
    label: { show: true, position: 'inside', fontSize: 10, color: '#fff', formatter: '{b} · {c}' },
    itemStyle: { borderColor: 'transparent' },
    data: [
      { value: 100, name: '纠纷发生（网格上报+主动排查）', itemStyle: { color: '#64748b' } },
      { value: 72, name: '村社调解（小事不出村）', itemStyle: { color: '#10b981' } },
      { value: 38, name: '乡镇综治中心（大事不出镇）', itemStyle: { color: '#e8a317' } },
      { value: 14, name: '信访/行政复议分流', itemStyle: { color: '#fb923c' } },
      { value: 5, name: '进入诉讼程序', itemStyle: { color: '#c41e3a' } },
    ],
  }],
};

// 基层负担悖论 —— 考核/台账/政务 App 数量趋势（示意指数，2015=100）
const burdenLines = {
  tooltip: { trigger: 'axis' },
  legend: { top: 0, textStyle: { color: LABEL.color, fontSize: 10 }, itemWidth: 12 },
  grid: { left: 40, right: 16, top: 32, bottom: 24 },
  xAxis: categoryX(['2015', '2017', '2019', '2021', '2023', '2025']),
  yAxis: valueY({ name: '指数(2015=100)' }),
  series: [
    { name: '下派考核事项', type: 'line', smooth: true, data: [100, 145, 190, 168, 152, 160], lineStyle: { color: '#c41e3a', width: 2 }, itemStyle: { color: '#c41e3a' } },
    { name: '台账报表负担', type: 'line', smooth: true, data: [100, 160, 230, 175, 150, 142], lineStyle: { color: '#e8a317', width: 2 }, itemStyle: { color: '#e8a317' } },
    { name: '政务 App/工作群', type: 'line', smooth: true, data: [100, 220, 380, 300, 210, 185], lineStyle: { color: '#8b5cf6', width: 2 }, itemStyle: { color: '#8b5cf6' } },
    { name: '减负文件出台数', type: 'line', smooth: true, data: [100, 110, 180, 260, 320, 360], lineStyle: { color: '#22d3ee', width: 2, type: 'dashed' }, itemStyle: { color: '#22d3ee' } },
  ],
};

// 网格员工作构成 —— 堆叠柱（示意，% 工时）
const gridWorkStack = stackedBarOpt({
  categories: ['信息采集', '矛盾排查', '民生代办', '创建迎检', '台账填报'],
  series: [
    { name: '治理性事务', data: [22, 18, 6, 4, 5], itemStyle: { color: '#c41e3a' } },
    { name: '服务性事务', data: [6, 8, 18, 2, 3], itemStyle: { color: '#10b981' } },
    { name: '行政性事务', data: [4, 2, 4, 12, 14], itemStyle: { color: '#64748b' } },
  ],
});

// 控制—自治散点：六机制在张力光谱上的坐标
const tensionScatter = {
  tooltip: { trigger: 'item', formatter: (p) => `${p.value[2]}<br/>控制强度 ${p.value[0]} · 自治活力 ${p.value[1]}` },
  grid: { left: 44, right: 36, top: 24, bottom: 44 },
  xAxis: valueY({ name: '控制强度 →', max: 100, nameLocation: 'middle', nameGap: 28, nameTextStyle: { color: LABEL.color, fontSize: 10 } }),
  yAxis: valueY({ name: '自治活力 →', max: 100 }),
  series: [{
    type: 'scatter', symbolSize: 18,
    label: { show: true, position: 'top', fontSize: 10, color: LABEL.color, formatter: (p) => p.value[2] },
    data: MECHANISMS.map((m) => ({ value: [m.ctrl, m.auto, m.label], itemStyle: { color: m.accent } })),
  }],
};

// ---------------------------------------------------------------------------
// 三、治理演进时间线
// ---------------------------------------------------------------------------
const EVOLUTION = [
  { period: '1950s–90s', title: '单位制', accent: '#64748b', desc: '「单位」是国家与个人之间唯一的接口：住房、医疗、子女入学、政治审查全部经由单位完成。社会被组织进生产建制，几乎不存在「治理」概念 —— 因为不存在体制外的社会。' },
  { period: '1990s–2003', title: '社区制', accent: '#8b5cf6', desc: '国企改制甩出数千万「单位人」，街居体系仓促接盘。「社区建设」运动启动：居委会从看门大妈式的辅助组织，被改造为承接下岗安置、低保发放、流动人口管理的全功能末梢。' },
  { period: '2004–2012', title: '网格化', accent: '#22d3ee', desc: '北京东城区首创「万米单元网格」，奥运维稳与汶川应急加速推广。物理空间被切片编码，「人地物事情」入库 —— 治理第一次拥有了统一的空间坐标系与责任到人的颗粒度。' },
  { period: '2013–2019', title: '吹哨报到 / 接诉即办', accent: '#e8a317', desc: '条块矛盾倒逼机制创新：街乡吹哨、部门报到，12345 热线成为「以民呼为令」的考核指挥棒。治理重心从「不出事」转向「快响应」，市民投诉成为体制内部的纠错信号源。' },
  { period: '2020–', title: '智慧治理 / 全要素网格', accent: '#c41e3a', desc: '疫情三年完成了治理基础设施的压力测试与极限扩容：健康码、门磁、社区团购链路证明网格可在 48 小时内切换为战时动员模式。此后「全要素网格」「一网统管」常态化 —— 传感器密度与数据穿透力成为治理能力的硬通货。' },
];

// ---------------------------------------------------------------------------
// 页面
// ---------------------------------------------------------------------------
export default function Page() {
  const [mechKey, setMechKey] = useState('grid');
  const [stageIdx, setStageIdx] = useState(4);

  const mech = useMemo(() => MECHANISMS.find((m) => m.key === mechKey) || MECHANISMS[0], [mechKey]);

  // 当前机制能力雷达（单系列，走共享 helper）
  const mechRadar = useMemo(
    () => radarOpt(RADAR_DIMS, mech.radar, { name: mech.label, color: mech.accent }),
    [mech],
  );

  // 双系列对比雷达：当前机制 vs 网格化基线（自写内联 option）
  const compareRadar = useMemo(() => {
    const base = MECHANISMS[0];
    return {
      legend: { top: 0, textStyle: { color: LABEL.color, fontSize: 10 }, itemWidth: 12, data: [base.label + '（基线）', mech.label] },
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
          { value: base.radar, name: base.label + '（基线）', lineStyle: { color: '#64748b', width: 1.5, type: 'dashed' }, itemStyle: { color: '#64748b' }, areaStyle: { color: 'rgba(100,116,139,0.08)' } },
          { value: mech.radar, name: mech.label, lineStyle: { color: mech.accent, width: 2 }, itemStyle: { color: mech.accent }, areaStyle: { color: 'rgba(34,211,238,0.0)' } },
        ],
      }],
    };
  }, [mech]);

  // 当前机制 控制/自治 条形对比
  const mechBar = useMemo(() => ({
    grid: { left: 72, right: 32, top: 12, bottom: 24 },
    xAxis: valueY({ max: 100 }),
    yAxis: { type: 'category', data: ['自治活力', '控制强度'], axisLine: { lineStyle: { color: AXIS.lineStyle.color } }, axisLabel: { color: LABEL.color, fontSize: 10 } },
    series: [{
      type: 'bar', barWidth: 16,
      label: { show: true, position: 'right', fontSize: 10, color: LABEL.color },
      data: [
        { value: mech.auto, itemStyle: { color: '#10b981' } },
        { value: mech.ctrl, itemStyle: { color: mech.accent } },
      ],
    }],
  }), [mech]);

  return (
    <div>
      <PageHeader badge="Social Governance · 一网统管" title="基层网格 · 综治与数字政务" subtitle="网格化 · 信访 · 矛盾化解 · 一网统管 —— 社会治理与网格化穿透" />
      <IntroCard>
        现实主义逻辑下，社会治理的难点在于<strong style={{ color: 'var(--text-primary)' }}>「超大规模」</strong>。体制通过将国土划分为数百万个微观「网格」实现权力的物理级下沉：每一个网格员都是系统的「终端传感器」，负责采集人、地、物、事、情的实时数据，消解「山高皇帝远」的传统治理瓶颈；再以数字化反馈完成非代议制的民意校准。但同一套管线既输送服务也输送控制 —— <strong style={{ color: 'var(--text-primary)' }}>「上面千条线、下面一根针」</strong>的属地责任压实，与「基层减负」的反向运动，构成这一系统最持久的内部张力。
      </IntroCard>

      {/* ============ 概览 Stat ============ */}
      <Grid cols={4} className="mb-6">
        <Stat value="450 万+" label="网格员总数 · 城乡网格超 400 万个" accent="#e8a317" />
        <Stat value="96.8%" label="矛盾就地化解率 · 矛盾不上交（示意）" accent="#10b981" />
        <Stat value="175 万" label="社区社会组织 · 自治活力载体（示意）" accent="#8b5cf6" />
        <Stat value="98.1%" label="群众安全感 · 世界领先水平" accent="#c41e3a" />
      </Grid>

      {/* ============ 一、治理机制选择器 ============ */}
      <Card title="治理机制矩阵 · 六种穿透方式（点击切换）" className="mb-6">
        <SelectorBar items={MECHANISMS} activeKey={mechKey} onSelect={setMechKey} />
        <div className="os-card p-5 mb-4" style={{ background: 'var(--bg-elevated)', borderLeft: `3px solid ${mech.accent}` }}>
          <div className="text-sm font-semibold mb-2" style={{ color: mech.accent }}>{mech.label} · 机制原理</div>
          <p className="text-sm leading-relaxed mb-3" style={{ color: 'var(--text-secondary)' }}>{mech.principle}</p>
          <Grid cols={3}>
            <div>
              <div className="text-[11px] mono mb-1" style={{ color: 'var(--text-tertiary)' }}>覆盖规模</div>
              <p className="text-xs leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{mech.scale}</p>
            </div>
            <div>
              <div className="text-[11px] mono mb-1" style={{ color: 'var(--text-tertiary)' }}>治理效果</div>
              <p className="text-xs leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{mech.effect}</p>
            </div>
            <div>
              <div className="text-[11px] mono mb-1" style={{ color: '#fb923c' }}>结构性张力</div>
              <p className="text-xs leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{mech.tension}</p>
            </div>
          </Grid>
        </div>
        <Grid cols={3}>
          <div>
            <div className="text-[11px] mono mb-2" style={{ color: 'var(--text-tertiary)' }}>能力雷达 · {mech.label}</div>
            <EChart option={mechRadar} style={{ height: 230 }} />
          </div>
          <div>
            <div className="text-[11px] mono mb-2" style={{ color: 'var(--text-tertiary)' }}>vs 网格化基线（虚线）</div>
            <EChart option={compareRadar} style={{ height: 230 }} />
          </div>
          <div>
            <div className="text-[11px] mono mb-2" style={{ color: 'var(--text-tertiary)' }}>控制 — 自治 张力刻度</div>
            <EChart option={mechBar} style={{ height: 110 }} />
            <p className="text-[11px] mt-2 leading-relaxed" style={{ color: 'var(--text-tertiary)' }}>控制强度与自治活力近似负相关：穿透越深的机制，留给社会自组织的空间越窄。六机制并非替代关系，而是同一治理操作系统上并行运行的进程。</p>
          </div>
        </Grid>
      </Card>

      {/* ============ 二、控制—自治散点 + 网格体系结构 ============ */}
      <Grid cols={2} className="mb-6">
        <Card title="控制 — 自治张力光谱 · 六机制坐标">
          <EChart option={tensionScatter} style={{ height: 260 }} />
          <p className="text-xs mt-2 leading-relaxed" style={{ color: 'var(--text-tertiary)' }}>右下象限（高控制 · 低自治）聚集了智慧社区与网格化；左上的社区自治与枫桥经验依赖社会自身的化解能量。系统设计的核心命题：行政吸纳到什么程度，社会活力开始坏死。</p>
        </Card>
        <Card title="网格体系五级结构 · 治理单元构成（示意 %）">
          <EChart option={gridDonut} style={{ height: 230 }} />
          <Grid cols={2} className="mt-2">
            <Stat value="300–500 户" label="单个基础网格的标准颗粒度" accent="#10b981" />
            <Stat value="五级贯通" label="市—区—街—社区—网格 指令链" accent="#22d3ee" />
          </Grid>
        </Card>
      </Grid>

      {/* ============ 三、网格穿透 + 矛盾化解（保留原资产） ============ */}
      <Grid cols={2} className="mb-6">
        <Card title="网格化：物理空间的数字化切片">
          <p className="text-sm leading-relaxed mb-3" style={{ color: 'var(--text-secondary)' }}>「一格多元、一员多能」（One Grid, Many Functions）：网格不只承担综治维稳，还叠加民生服务、应急动员与数字政务入口，权力穿透到社区微观单元。</p>
          <div className="text-[11px] mono mb-2" style={{ color: 'var(--text-tertiary)' }}>治理层级穿透深度评估</div>
          <EChart option={depthFunnel} style={{ height: 220 }} />
        </Card>
        <Card title="矛盾化解算法 · 新时代「枫桥经验」">
          <EChart option={conflictLine} style={{ height: 200 }} />
          <p className="text-xs mt-3 leading-relaxed" style={{ color: 'var(--text-tertiary)' }}>分析：新时代「枫桥经验」的本质是建立一套低摩擦的压力释放机制 —— 通过基层自治与法治结合，把信访与纠纷在源头消化，将风险坍缩在萌芽状态。</p>
        </Card>
      </Grid>

      {/* ============ 四、矛盾化解漏斗 + 网格员工时 ============ */}
      <Grid cols={2} className="mb-6">
        <Card title="矛盾分流漏斗 · 「小事不出村」的逐级泄压（每 100 件）">
          <EChart option={resolveFunnel} style={{ height: 250 }} />
          <p className="text-xs mt-2 leading-relaxed" style={{ color: 'var(--text-tertiary)' }}>系统视角：每向下化解一级，单件处置成本下降一个量级；最终进入诉讼的约 5%，是体制刻意保持的「司法稀缺性」。漏斗的政治含义同样直白 —— 矛盾被空间封闭在发生地，不形成跨区域共振。</p>
        </Card>
        <Card title="网格员工时构成 · 一根针上的千条线（示意 %）">
          <EChart option={gridWorkStack} style={{ height: 250 }} />
          <p className="text-xs mt-2 leading-relaxed" style={{ color: 'var(--text-tertiary)' }}>灰色块（行政性事务：创建迎检 + 台账填报）侵占了近三成工时 —— 末梢传感器被迫把带宽用于向上证明自己在工作，而非工作本身。这正是「基层减负」要切除的部分。</p>
        </Card>
      </Grid>

      {/* ============ 五、基层负担悖论 ============ */}
      <Card title="基层负担悖论 · 压实 vs 减负的拉锯（指数，2015=100，示意）" className="mb-6">
        <EChart option={burdenLines} style={{ height: 260 }} />
        <Grid cols={3} className="mt-3">
          {[['属地责任压实', '「层层签责任状」把无限责任压到有限权力的末端：出事追责到社区，但执法权、财权、人事权都不在社区。', '#c41e3a'],
            ['痕迹主义通胀', '考核依赖「留痕」，台账与 App 数量在 2019 年前后达峰：一名社区工作者同时维护数十个工作群、上报十余套系统。', '#e8a317'],
            ['减负的西西弗斯', '2019 年「基层减负年」以来减负文件持续加码，台账确有压降；但只要考核逻辑不变，负担便以新形态再生 —— 减负本身也成了需要留痕的工作。', '#22d3ee']].map(([t, d, c]) => (
            <div key={t} style={{ borderLeft: `2px solid ${c}`, paddingLeft: 10 }}>
              <div className="text-xs font-semibold" style={{ color: 'var(--text-primary)' }}>{t}</div>
              <p className="text-[11px] mt-1 leading-relaxed" style={{ color: 'var(--text-tertiary)' }}>{d}</p>
            </div>
          ))}
        </Grid>
      </Card>

      {/* ============ 六、治理演进时间线 ============ */}
      <Card title="治理形态演进 · 从单位制到全要素网格（点击切换）" className="mb-6">
        <TimelineBar stages={EVOLUTION} activeIdx={stageIdx} onSelect={setStageIdx} />
      </Card>

      {/* ============ 七、赛博反馈（保留原资产） ============ */}
      <Grid cols={2} className="mb-6">
        <Card title="赛博治理系统的风险校准雷达"><EChart option={cyberRadar} style={{ height: 280 }} /></Card>
        <Card title="赛博反馈：非代议制的民意校准">
          <p className="text-sm leading-relaxed mb-4" style={{ color: 'var(--text-secondary)' }}>数字化治理实现了对社会不满的「量化监测」。当特定区域的投诉、矛盾或舆情超过预设阈值，系统自动启动「预防性维护」程序，释放治理红利或实施行政干预。这种基于大数据反馈的决策模型，正尝试取代效率较低的传统代议机制，构建一套极速响应的「智能合意系统」。</p>
          <Grid cols={2}>
            <Stat value="92%" label="民生诉求办结满意率" accent="#e8a317" />
            <Stat value="秒级" label="网格化指令流转时耗" accent="#22d3ee" />
          </Grid>
        </Card>
      </Grid>

      {/* ============ 八、四大支柱 + 数字政务 ============ */}
      <Card title="四大支柱 · 治理穿透的运行结构" className="mb-6">
        <Grid cols={4}>
          {[['01 · 网格化穿透逻辑', '数百万微观网格 + 450 万网格员，把「人地物事情」采集为实时数据流，权力下沉至物理级。', '#c41e3a'],
            ['02 · 矛盾化解算法', '枫桥经验数字化：调解、信访、诉源治理逐级过滤，96.8% 矛盾就地化解、不上交。', '#e8a317'],
            ['03 · 赛博反馈校准', '投诉/舆情阈值触发预防性维护，以量化监测替代代议反馈，秒级指令流转闭环。', '#22d3ee'],
            ['04 · 基层韧性底座', '全域安全感知网络、社区积分制自治与数字化信用体系，构建高内聚、自修复的社会有机体。', '#10b981']].map(([t, d, c]) => (
            <div key={t} style={{ borderLeft: `2px solid ${c}`, paddingLeft: 10 }}>
              <div className="text-xs font-semibold" style={{ color: 'var(--text-primary)' }}>{t}</div>
              <p className="text-[11px] mt-1 leading-relaxed" style={{ color: 'var(--text-tertiary)' }}>{d}</p>
            </div>
          ))}
        </Grid>
      </Card>

      <Card title="数字政务 · 从「一网通办」到「一网统管」" className="mb-6">
        <Grid cols={3}>
          {[['一网通办（服务侧）', '政务服务事项线上集成办理，网格员兼任「数字政务代办员」，将服务入口前移至社区网格。', '#22d3ee'],
            ['一网统管（治理侧）', '城市运行体征指标接入城市大脑，跨部门指令经网格化平台秒级派单、闭环考核。', '#c41e3a'],
            ['信访法治化', '信访纳入诉源治理与矛盾排查闭环：依法分类处理、就地化解，减少越级上行的制度压力。', '#e8a317']].map(([t, d, c]) => (
            <div key={t} style={{ borderLeft: `2px solid ${c}`, paddingLeft: 10 }}>
              <div className="text-xs font-semibold" style={{ color: 'var(--text-primary)' }}>{t}</div>
              <p className="text-[11px] mt-1 leading-relaxed" style={{ color: 'var(--text-tertiary)' }}>{d}</p>
            </div>
          ))}
        </Grid>
      </Card>

      {/* ============ 九、韧性底座 + 系统观察 ============ */}
      <Card title="韧性底座：消灭「意外」的系统设计" className="mb-6">
        <p className="text-sm leading-relaxed mb-3" style={{ color: 'var(--text-secondary)' }}>中国社会治理的终极目标是实现「极致的确定性」。通过全域安全感知网络、社区积分制自治及数字化信用体系，体制正构建起一套高内聚、自修复的社会有机体；在面临外部冲击时，这一底座能提供极高的动员效率与生存冗余。</p>
        <div className="flex flex-wrap gap-2">
          {['Predictive Policing', 'Social Credit Alignment', 'Emergency Response Grid', 'Whole-Element Grid', 'Fengqiao 2.0'].map((tag) => (
            <span key={tag} className="text-[10px] mono px-2 py-1 rounded" style={{ border: '1px solid var(--border-subtle)', color: 'var(--text-tertiary)' }}>{tag}</span>
          ))}
        </div>
      </Card>

      <Card title="系统观察" className="mb-6">
        <p className="text-sm leading-relaxed mb-3" style={{ color: 'var(--text-secondary)' }}>网格化把治理成本摊薄到「人」这一最小单元，换来的是对超大规模社会的实时感知与快速响应；但「一网统管」的效能边界，最终取决于反馈数据能否真实上传、矛盾能否真正化解而非仅仅「不上交」。</p>
        <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>更深一层的权力物理：当考核指标本身成为治理对象，系统会优先优化指标而非现实 —— 化解率、办结率、满意率的渐近线越漂亮，越需要追问被指标排除在外的剩余项。基层治理的真实健康度，藏在没有进入任何台账的那部分社会里。</p>
      </Card>

      <FrameworkTrio cards={[
        {
          title: '枫桥经验', subtitle: '矛盾就地化解的低成本治理',
          body: '把化解成本压在最低层级：调解一件纠纷的财政成本不足诉讼的十分之一，且矛盾被空间封闭、不形成共振。这是超大规模治理在「司法资源稀缺」约束下的最优解，也是把社会减压阀做成政治指标的开端。',
          pillars: [['源头泄压', '72% 纠纷止步于村社调解'], ['空间封闭', '矛盾不出村镇、不跨区共振'], ['指标异化', '「不上交」可能是按住而非解开']],
        },
        {
          title: '网格物理', subtitle: '治理单元的最小颗粒化',
          body: '300–500 户的网格是权力的「普朗克长度」：再细分则管理成本超过收益，再放粗则感知出现盲区。450 万网格员构成体制的分布式传感网 —— 服务与监控共用同一套采集管线，这是网格化最深的结构双义。',
          pillars: [['全要素采集', '人地物事情 五维实时入库'], ['五级贯通', '市区街社格 指令链秒级穿透'], ['传感器化', '智慧社区把人采换成机采']],
        },
        {
          title: '控制与自治张力', subtitle: '行政吸纳 vs 社会活力',
          body: '居委会法律上是自治组织，实践中八成工时承接行政下派 —— 自治被「行政吸纳」。系统的长期命题：穿透做到极致后，社会自组织能力坏死，所有矛盾只能向体制回流；减负与放权因此不是恩惠，而是系统自我维护的必需。',
          pillars: [['行政吸纳', '人财物考核全部向上依附'], ['活力残量', '175 万社区社会组织在缝隙生长'], ['回流风险', '自治坏死则全部压力归于体制']],
        },
      ]} />
      <ModuleFooter moduleId="socialgov" disclaimer="本页数据均为公开资料整理之示意值（网格员规模、化解率、工时构成、负担指数等不构成统计口径），仅供治理结构分析参考，非官方数据。" />
    </div>
  );
}
