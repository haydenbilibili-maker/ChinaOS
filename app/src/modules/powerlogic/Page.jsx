import React, { useState, useMemo } from 'react';
import { PageHeader, Card, Grid, Stat } from '../../app/ui.jsx';
import EChart from '../../lib/viz/EChart.jsx';
import { categoryX, valueY, GRID, radarOpt, stackedBarOpt, AXIS, LABEL } from '../shared/chartHelpers.js';
import { IntroCard, SelectorBar, TimelineBar, FrameworkTrio, ModuleFooter } from '../shared/ModuleParadigm.jsx';

// ── 三内核切换（保留原数据）─────────────────────────────
const KERNELS = [
  { key: 'ru', label: '儒 · 表', accent: '#e8a317', desc: '外层儒家叙事提供道德合法性与社会润滑剂——解释权主权、均贫富调节、文明叙事构建语义防御系统。表层负责「为什么服从」，把强制包装成共识。' },
  { key: 'fa', label: '法 · 里', accent: '#c41e3a', desc: '内层法家技术实现行政效率与资源汲取。精英筛选算法（科举现代变体）、压力型执行、数字网格构成权力机器。内核负责「如何执行」，把意志转成可计算的指令流。' },
  { key: 'digital', label: '数字利维坦', accent: '#22d3ee', desc: '算力主权重构权力末端：语义防火墙 + 数字网格 + 赛博反馈，消解「山高皇帝远」的物理屏障，实现全时空全域透视。第三层不是表也不是里，而是承载表与里的新基座。' },
];

// 三内核各自的权力雷达画像（传统/现代/数字）
const KERNEL_RADAR = {
  ru: [72, 60, 95, 78, 65, 70],
  fa: [98, 92, 70, 88, 75, 96],
  digital: [99, 95, 90, 85, 98, 99],
};

// ── 六大权力维度选择器（传统形态 vs 数字形态）──────────
const DIMENSIONS = [
  {
    key: 'legit', label: '合法性来源', accent: '#e8a317',
    trad: '天命 + 德治叙事。皇权受命于天，以「为民」话语换取服从；合法性是周期性、易受天灾人祸冲击的稀缺品。',
    digi: '绩效 + 解释权垄断。以发展成就、秩序供给与文明叙事置换合法性；通过定义「民主/公正/文明」掌握语义主权。',
    logic: '合法性 = 叙事产能 ÷ 现实落差。落差扩大时，要么提升供给，要么收紧叙事。',
    bound: '叙事与现实长期背离 → 合法性贴现率飙升，语义防御失效。',
  },
  {
    key: 'control', label: '控制技术', accent: '#c41e3a',
    trad: '编户齐民 + 保甲连坐。以户籍、里甲把人口锁进可征调的格子，连坐放大违约成本，控制颗粒度到「户」。',
    digi: '网格化 + 一网统管。城市切成万千网格，网格员 + 摄像头 + 数据中台把控制颗粒度推到「人—事—时空点」。',
    logic: '控制力 = 颗粒度 × 触达速度 × 违约成本。数字化同时拉高三项。',
    bound: '颗粒度越细，维护成本与基层负荷越高，边际收益递减。',
  },
  {
    key: 'info', label: '信息架构', accent: '#22d3ee',
    trad: '奏折 + 邸报，逐级上报。信息层层过滤、失真、滞后；皇帝是信息饥渴的中心节点，「下情上达」是结构性难题。',
    digi: '数据中台 + 实时仪表盘。社会运行被传感器化，热力图、舆情、消费、流动实时回流，中心首次接近全知。',
    logic: '决策质量 = 信息保真度 × 时效。传统架构在两端同时打折，数字架构同时拉满。',
    bound: '全量信息 → 中心过载与「数据失真的新形态」（指标造假、算法对抗）。',
  },
  {
    key: 'mobil', label: '动员能力', accent: '#10b981',
    trad: '徭役 + 运动式动员。靠行政命令与意识形态发动，穿透力强但成本高、易反噬，难以长期维持。',
    digi: '组织 + 平台 + 算法推送。党政体系 + 互联网平台 + 推荐流，把动员从「运动」变为「常态化、可调频」的精细操作。',
    logic: '动员效能 = 组织密度 × 信息通道 × 激励对齐。三者数字化后可编程。',
    bound: '高频动员消耗社会信任与基层耐受度，存在「动员疲劳」上限。',
  },
  {
    key: 'feedback', label: '反馈机制', accent: '#8b5cf6',
    trad: '言官 + 民变。正式反馈靠谏官（易被堵），非正式反馈靠抗争与民变——反馈往往以系统崩溃为代价才被听见。',
    digi: '舆情 + 信访 + 大数据画像。舆情监测把民意变成可量化信号，让系统在崩溃前感知压力，但也筛掉「不可见的沉默」。',
    logic: '稳定性 = 反馈灵敏度 × 响应速度。早感知、早泄压，避免压力积累成相变。',
    bound: '反馈被「管理」 → 系统听到的是自己想听的，灵敏度虚高、真实信号衰减。',
  },
  {
    key: 'correct', label: '纠错机制', accent: '#fb923c',
    trad: '改朝换代 + 周期律。重大纠错往往只能靠王朝更替完成，纠错周期以「百年」计，代价巨大。',
    digi: '试点 + 灰度 + 迭代。「摸着石头过河」把纠错拆成可回滚的小步快跑，纠错周期压缩到「年/季」级。',
    logic: '系统寿命 ∝ 纠错频率 × 纠错幅度上限。高频小纠错替代低频大崩溃。',
    bound: '试点可回滚，但核心架构（路径依赖）很难灰度——根目录改不动。',
  },
];

// ── 控制技术演进时间线 ────────────────────────────────
const TIMELINE = [
  { period: '秦—清', accent: '#64748b', title: '编户齐民', desc: '户籍 + 保甲连坐。把人口锁进可征调的格子，控制颗粒度到「户」，靠连坐放大违约成本。物理屏障「山高皇帝远」长期存在。' },
  { period: '1950s—80s', accent: '#e8a317', title: '单位制 · 人民公社', desc: '单位 / 公社成为社会的基本细胞，承担身份、福利、控制三重功能。组织密度史上最高，动员穿透力达到峰值，但汲取与僵化并存。' },
  { period: '1990s—2010s', accent: '#22d3ee', title: '网格化管理', desc: '单位制解体后，城市以「网格」重建末端控制。网格员 + 综治中心填补真空，把控制颗粒度从「单位」重新细分到「网格」。' },
  { period: '2015—', accent: '#10b981', title: '数字治理 · 一网统管', desc: '数据中台 + 摄像头 + 算法把网格升级为实时计算系统。城市运行图、舆情、流动全量回流，「山高皇帝远」的物理屏障被算力消解。' },
  { period: '2020s+', accent: '#c41e3a', title: '算法治理 · 全域透视', desc: '从「看得见」到「算得出」：风险预测、信用评分、自动化派单。权力从被动响应转向主动预判，逼近全时空全域透视的物理极限。' },
];

// ── 静态图表数据 ──────────────────────────────────────
const costTrend = {
  legend: { data: ['统治成本指数', '技术介入度'], textStyle: { color: LABEL.color }, top: 0 },
  grid: { left: 44, right: 16, top: 30, bottom: 24 },
  xAxis: categoryX(['2000', '2008', '2016', '2024']),
  yAxis: valueY(),
  series: [
    { name: '统治成本指数', type: 'line', smooth: true, data: [100, 88, 70, 52], lineStyle: { color: '#c41e3a' }, areaStyle: { color: 'rgba(196,30,58,0.1)' } },
    { name: '技术介入度', type: 'line', smooth: true, data: [10, 35, 65, 95], lineStyle: { color: '#22d3ee' }, areaStyle: { color: 'rgba(34,211,238,0.08)' } },
  ],
};

// 数字利维坦三能力随时间上升（堆叠）
const leviathanOpt = stackedBarOpt({
  categories: ['2010', '2014', '2018', '2022', '2026'],
  series: [
    { name: '监控覆盖', data: [12, 28, 50, 72, 88], itemStyle: { color: '#c41e3a' } },
    { name: '数据归集', data: [8, 22, 45, 68, 85], itemStyle: { color: '#22d3ee' } },
    { name: '算法治理', data: [3, 10, 28, 52, 80], itemStyle: { color: '#8b5cf6' } },
  ],
});

// 传统系统 vs 数字系统 · 权力运行雷达（双系列）
const dualRadarOpt = {
  radar: {
    indicator: [
      { name: '汲取', max: 100 }, { name: '渗透', max: 100 }, { name: '动员', max: 100 },
      { name: '监控', max: 100 }, { name: '反馈', max: 100 }, { name: '纠错', max: 100 },
    ],
    axisName: { color: LABEL.color, fontSize: 10 },
    splitLine: { lineStyle: { color: 'rgba(148,163,184,0.15)' } },
    axisLine: { lineStyle: { color: 'rgba(148,163,184,0.15)' } },
    splitArea: { show: false },
  },
  legend: { textStyle: { color: LABEL.color, fontSize: 10 }, top: 0 },
  series: [{
    type: 'radar',
    data: [
      { value: [82, 55, 90, 40, 35, 25], name: '传统形态', lineStyle: { color: '#64748b', width: 2 }, itemStyle: { color: '#64748b' }, areaStyle: { color: 'rgba(100,116,139,0.12)' } },
      { value: [95, 92, 88, 96, 80, 78], name: '数字形态', lineStyle: { color: '#22d3ee', width: 2 }, itemStyle: { color: '#22d3ee' }, areaStyle: { color: 'rgba(34,211,238,0.14)' } },
    ],
  }],
};

export default function Page() {
  const [kernelKey, setKernelKey] = useState('fa');
  const [dimKey, setDimKey] = useState('control');
  const [tlIdx, setTlIdx] = useState(3);

  const k = KERNELS.find((x) => x.key === kernelKey) || KERNELS[1];
  const dim = DIMENSIONS.find((x) => x.key === dimKey) || DIMENSIONS[1];

  const powerRadar = useMemo(
    () => radarOpt(['意志传导', '资源汲取', '语义防御', '精英筛选', '反馈校准', '动员穿透'], KERNEL_RADAR[kernelKey], { name: k.label, color: k.accent }),
    [kernelKey, k.label, k.accent],
  );

  return (
    <div>
      <PageHeader badge="Internal Realpolitik · SYSTEM_UPTIME 75Y" title="中国权力运行逻辑" subtitle="儒表法里 · 指令穿透 · 秩序优先 · 数字利维坦 —— 穿透宏观叙事，直击底层逻辑" />
      <IntroCard>权力运作是<strong style={{ color: 'var(--text-primary)' }}>双内核架构</strong>：外层儒家叙事提供合法性与润滑剂；内层法家技术实现效率与汲取。「外圆内方」确保系统在极端压力下仍具强大物理弹性。如今第三层正在生长——<strong style={{ color: 'var(--text-primary)' }}>数字利维坦</strong>：技术介入度上升，统治成本指数下降，算力主权是 21 世纪的负熵流，把「山高皇帝远」从结构性约束改写为历史名词。</IntroCard>

      <Grid cols={4} className="mb-6">
        <Stat value="5 级" label="治理层级 · 中央→村居" accent="#c41e3a" />
        <Stat value="≈100%" label="城市网格覆盖 · 示意" accent="#e8a317" />
        <Stat value="0.79" label="数字政府指数 · 示意" accent="#22d3ee" />
        <Stat value="HIGH" label="监控密度 · 示意" accent="#10b981" />
      </Grid>

      {/* ── 六维权力维度选择器 ── */}
      <Card title="交互 · 六大权力维度 · 传统形态 vs 数字形态" className="mb-6">
        <SelectorBar items={DIMENSIONS} activeKey={dimKey} onSelect={setDimKey} />
        <Grid cols={2}>
          <div className="os-card p-4" style={{ background: 'var(--bg-elevated)', borderLeft: '3px solid #64748b' }}>
            <div className="text-xs mono mb-1" style={{ color: '#64748b' }}>传统形态</div>
            <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{dim.trad}</p>
          </div>
          <div className="os-card p-4" style={{ background: 'var(--bg-elevated)', borderLeft: `3px solid ${dim.accent}` }}>
            <div className="text-xs mono mb-1" style={{ color: dim.accent }}>数字形态</div>
            <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{dim.digi}</p>
          </div>
        </Grid>
        <Grid cols={2} className="mt-3">
          <div className="os-card p-4" style={{ background: 'var(--bg-surface)' }}>
            <div className="text-xs font-semibold mb-1" style={{ color: 'var(--cyber-cyan)' }}>运行逻辑</div>
            <p className="text-[13px] leading-relaxed mono" style={{ color: 'var(--text-secondary)' }}>{dim.logic}</p>
          </div>
          <div className="os-card p-4" style={{ background: 'var(--bg-surface)' }}>
            <div className="text-xs font-semibold mb-1" style={{ color: 'var(--china-red)' }}>约束 / 边界</div>
            <p className="text-[13px] leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{dim.bound}</p>
          </div>
        </Grid>
      </Card>

      {/* ── 三内核切换 + 权力雷达联动 ── */}
      <Card title="交互 · 三内核切换 · 权力雷达联动" className="mb-6">
        <SelectorBar items={KERNELS} activeKey={kernelKey} onSelect={setKernelKey} />
        <Grid cols={2}>
          <div className="os-card p-4" style={{ background: 'var(--bg-elevated)', borderLeft: `3px solid ${k.accent}` }}>
            <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{k.desc}</p>
          </div>
          <EChart option={powerRadar} style={{ height: 240 }} />
        </Grid>
      </Card>

      {/* ── 儒表法里 双层结构 ── */}
      <Card title="儒表法里 · 双层结构解剖（呼应 文明透视 · 卷二）" className="mb-6">
        <Grid cols={2}>
          <div className="os-card p-5" style={{ background: 'var(--bg-elevated)', borderLeft: '3px solid #e8a317' }}>
            <div className="text-sm font-semibold mb-2" style={{ color: '#e8a317' }}>表层 · 儒家合法性话语</div>
            <p className="text-sm leading-relaxed mb-3" style={{ color: 'var(--text-secondary)' }}>对外呈现的是道德、文明与「为民」的语义外壳。它回答「为什么应当服从」，把强制转译成共识，降低汲取与控制的摩擦系数。</p>
            <div className="flex flex-wrap gap-2">{['德治叙事', '解释权主权', '均贫富', '文明话语', '语义防御'].map((t) => (
              <span key={t} className="text-[11px] mono px-2 py-0.5 rounded" style={{ background: 'var(--bg-surface)', color: '#e8a317' }}>{t}</span>
            ))}</div>
          </div>
          <div className="os-card p-5" style={{ background: 'var(--bg-elevated)', borderLeft: '3px solid #c41e3a' }}>
            <div className="text-sm font-semibold mb-2" style={{ color: '#c41e3a' }}>内核 · 法家强制技术</div>
            <p className="text-sm leading-relaxed mb-3" style={{ color: 'var(--text-secondary)' }}>真正运转的是编户、考成、连坐、网格——把意志拆成可执行、可考核、可追责的指令流。它回答「如何确保被执行」，是冷峻的权力物理。</p>
            <div className="flex flex-wrap gap-2">{['编户齐民', '考成法', '压力型体制', '数字网格', '精英筛选'].map((t) => (
              <span key={t} className="text-[11px] mono px-2 py-0.5 rounded" style={{ background: 'var(--bg-surface)', color: '#c41e3a' }}>{t}</span>
            ))}</div>
          </div>
        </Grid>
        <div className="os-card p-3 mt-3" style={{ background: 'var(--bg-surface)' }}>
          <p className="text-[13px] leading-relaxed mono text-center" style={{ color: 'var(--text-tertiary)' }}>外圆（儒 · 减摩擦） × 内方（法 · 保执行） → 极端压力下仍不解体的物理弹性。表里互为对方的存在条件。</p>
        </div>
      </Card>

      {/* ── 控制技术演进时间线 ── */}
      <Card title="控制技术演进 · 编户齐民 → 一网统管 → 全域透视" className="mb-6">
        <TimelineBar stages={TIMELINE} activeIdx={tlIdx} onSelect={setTlIdx} />
      </Card>

      {/* ── 双系列雷达 + 数字利维坦堆叠 ── */}
      <Grid cols={2} className="mb-6">
        <Card title="权力运行雷达 · 传统形态 vs 数字形态">
          <EChart option={dualRadarOpt} style={{ height: 260 }} />
        </Card>
        <Card title="数字利维坦演进 · 监控 / 数据 / 算法（示意）">
          <EChart option={leviathanOpt} style={{ height: 260 }} />
        </Card>
      </Grid>

      {/* ── 统治成本 vs 技术介入 + 代码即秩序 ── */}
      <Grid cols={2} className="mb-6">
        <Card title="统治成本 vs 技术介入（指数 · 示意）"><EChart option={costTrend} style={{ height: 240 }} /></Card>
        <Card title="数字利维坦 · 代码即秩序">
          <p className="text-sm leading-relaxed mb-3" style={{ color: 'var(--text-secondary)' }}>治理已是计算问题：每一条指令经数字网格精准触达，每一个反馈经社交数据实时校准。当技术消解物理屏障，权力实现真正的全时空透视——「看得见」升级为「算得出」，被动响应升级为主动预判。</p>
          <div className="flex flex-wrap gap-2">{['Algorithmic Governance', '语义防火墙', '算力主权', '赛博反馈', '风险预判', '信用评分'].map((t) => (
            <span key={t} className="text-[11px] mono px-2 py-0.5 rounded" style={{ background: 'var(--bg-elevated)', color: 'var(--cyber-cyan)' }}>{t}</span>
          ))}</div>
        </Card>
      </Grid>

      {/* ── 三框架卡 ── */}
      <FrameworkTrio cards={[
        { title: '儒表法里', subtitle: '合法性外壳 + 强制内核', body: 'Rule by virtue as the surface, rule by law as the machine. 表层垄断文明/民主/公正的定义权构建语义防御；内核负责汲取与执行。外圆减摩擦，内方保执行。', pillars: [['表 · 解释权', '语义防御系统。'], ['里 · 执行', '考成与连坐。'], ['弹性', '极压不解体。']] },
        { title: '数字利维坦', subtitle: '监控 + 算法 + 数据', body: '算力主权重构权力末端：监控提供全量感知，数据归集打通信息回流，算法把治理变成可计算、可预判的实时系统。物理屏障被代码消解。', pillars: [['监控', '全时空感知。'], ['数据', '中台归集回流。'], ['算法', '预判与派单。']] },
        { title: '压力型传导', subtitle: '层层加码与变通', body: '指令自上而下逐级加码以求达标，执行自下而上软化变通以求自保。一个系统同时存在「加码」与「变通」两股反向力，是中央集权与基层弹性的动态均衡。', pillars: [['加码', '逐级抬高指标。'], ['变通', '基层选择性执行。'], ['均衡', '紧—松周期摆动。']] },
      ]} />

      <ModuleFooter moduleId="powerlogic" disclaimer="公开资料整理 · 数据与指数均为示意性建模，非官方统计 · 仅供分析框架参考，非任何政治或投资建议" sourceNote="由 china.html「权力逻辑」专题迁移并大幅升级" />
    </div>
  );
}
