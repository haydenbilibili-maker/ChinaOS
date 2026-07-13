import React, { useState, useMemo } from 'react';
import { CrossLinks, PageHeader, Card, Grid, Stat } from '../../app/ui.jsx';
import EChart from '../../lib/viz/EChart.jsx';
import { categoryX, valueY, GRID, LEGEND } from '../shared/chartHelpers.js';
import { IntroCard, SelectorBar, TimelineBar, FrameworkTrio, ModuleFooter } from '../shared/ModuleParadigm.jsx';

// ============================================================================
// 认知内核 · 现实主义国际关系理论（含米尔斯海默进攻性现实主义）
// ============================================================================

const SCHOOLS = {
  classical: {
    label: '古典现实主义', rep: '汉斯·摩根索《国家间政治》(1948)', unit: '人性',
    tenet: '权力政治根植于人性之恶（求权意志）。国家如人，永远追逐权力；道德服从于国家利益（national interest defined as power）。',
    pred: '中美博弈是大国求权本性的延续；均势与审慎外交是和平的现实条件。',
    radar: [90, 40, 55, 60, 50],
  },
  structural: {
    label: '结构（防御性）现实主义', rep: '肯尼斯·华尔兹《国际政治理论》(1979)', unit: '体系结构',
    tenet: '冲突源于国际体系的无政府状态，而非人性。国家是安全最大化者，追求「适度」权力即可；过度扩张反招制衡（防御性）。',
    pred: '体系会自发产生制衡；中国理性上应避免过度扩张，守成大国应给予安全空间。',
    radar: [50, 95, 60, 50, 65],
  },
  offensive: {
    label: '进攻性现实主义', rep: '约翰·米尔斯海默《大国政治的悲剧》(2001)', unit: '体系结构（悲观）',
    tenet: '无政府状态下，没有国家能确知他国意图，唯一的安全保障是成为体系霸主。国家是权力最大化者——能多强就多强，直到成为地区霸权并阻止他洲出现对手。',
    pred: '「中国不能和平崛起」：中国必然寻求亚洲地区霸权，美国必然遏制，安全竞争与冲突风险结构性上升——大国政治的悲剧。',
    radar: [55, 90, 98, 40, 85],
  },
};
const RADAR_IND = [{ name: '人性悲观', max: 100 }, { name: '体系决定', max: 100 }, { name: '权力最大化', max: 100 }, { name: '合作空间', max: 100 }, { name: '冲突预期', max: 100 }];

// 中美综合国力（示意，进攻性现实主义读法：逼近交叉=最危险窗口）
const transition = {
  legend: { data: ['美国', '中国'], textStyle: { color: LABEL.color }, top: 0 },
  grid: { left: 40, right: 16, top: 30, bottom: 24 },
  xAxis: { type: 'category', data: ['1990', '2000', '2010', '2020', '2030E', '2040E'], axisLine: { lineStyle: { color: AXIS.lineStyle.color } } },
  yAxis: { type: 'value', max: 100, splitLine: { lineStyle: { color: 'rgba(148,163,184,0.1)' } } },
  series: [
    { name: '美国', type: 'line', smooth: true, data: [100, 100, 95, 90, 86, 82], lineStyle: { color: '#22d3ee', width: 2 }, itemStyle: { color: '#22d3ee' } },
    { name: '中国', type: 'line', smooth: true, data: [20, 35, 55, 72, 84, 92], lineStyle: { color: '#c41e3a', width: 2 }, itemStyle: { color: '#c41e3a' }, areaStyle: { color: 'rgba(196,30,58,0.08)' } },
  ],
};

const MEARSHEIMER = [
  ['① 国际体系无政府', '没有凌驾于国家之上的世界政府。'],
  ['② 大国都拥有进攻性军力', '彼此都有伤害对方的能力。'],
  ['③ 意图永远不可确知', '今天的友邦可能是明天的敌人，无法确知。'],
  ['④ 生存是首要目标', '一切其他目标都从属于生存。'],
  ['⑤ 大国是理性行为体', '会战略性地计算如何最大化生存概率。'],
];

// 现实主义思想谱系
const LINEAGE = [
  { period: '前5世纪', title: '修昔底德', accent: '#d4a017', desc: '《伯罗奔尼撒战争史》：「雅典的崛起与斯巴达的恐惧使战争不可避免」——权力转移与恐惧心理的原型叙事；米洛斯对话写下「强者为所能为，弱者受所必受」的冷酷公理。' },
  { period: '16-17世纪', title: '马基雅维利 / 霍布斯', accent: '#d4a017', desc: '马基雅维利把政治从道德中剥离（国家理由 raison d\'État）；霍布斯的「自然状态=一切人对一切人的战争」成为「国际无政府状态」的哲学母体——国内有利维坦，国际没有。' },
  { period: '1948', title: '摩根索 · 古典现实主义', accent: '#c41e3a', desc: '《国家间政治》六原则：政治受根植于人性的客观法则支配；利益以权力定义；审慎是最高政治美德。现实主义从史学叙事变成系统理论。' },
  { period: '1979', title: '华尔兹 · 结构现实主义', accent: '#22d3ee', desc: '《国际政治理论》：把分析单元从人性搬到体系结构——无政府状态+能力分布决定行为。国家是安全最大化者；两极结构最稳定。理论实现「科学化」。' },
  { period: '2001', title: '米尔斯海默 · 进攻性现实主义', accent: '#c41e3a', desc: '《大国政治的悲剧》：同样的结构前提推出更悲观结论——意图不可确知逼迫国家权力最大化，地区霸权是唯一终点，故「中国不能和平崛起」。' },
  { period: '1998-', title: '新古典现实主义', accent: '#7c8aa0', desc: 'Rose/Schweller/Zakaria：结构压力要经过国内政治、领导人认知、国家汲取能力的「传导带」才变成外交政策——为结构理论补回能动性与误判空间。' },
];

// 极性配置：基础稳定性 + 判读
const POLARITY = {
  uni: { label: '单极（霸权）', base: 72, note: '霸权稳定论：单极下无大国战争，但霸权护持成本递增、单边主义诱惑大；衰落期（单极→两极过渡）反而是高危窗口。' },
  bi: { label: '两极', base: 80, note: '华尔兹：两极最稳——只需盯住一个对手，误判通道最少、责任无从推卸、联盟纪律内化（冷战「长和平」为例证）。' },
  multi: { label: '多极', base: 52, note: '多极的辩护：联盟弹性提供缓冲、权力分散抑制单一霸权野心；但误判通道随大国数平方级增长，推卸责任与连锁动员风险高（1914 为反例）。' },
};

// 联盟动力学三反应
const ALLIANCE = [
  { t: '制衡 Balancing', c: '#c41e3a', d: '与弱方结盟对抗最强（或最具威胁）国家。华尔兹视为体系默认反应；沃尔特修正为「威胁制衡」——制衡的是威胁感知而非纯实力。', ex: '美日同盟强化、AUKUS、美菲基地扩展。' },
  { t: '追随 Bandwagoning', c: '#d4a017', d: '加入更强/上升的一方分享利益或避祸。施韦勒指出「利益追随」常被低估——小国跟随崛起国是为了搭便车而非屈服。', ex: '柬埔寨、巴基斯坦深度靠近中国阵营。' },
  { t: '推卸 Buck-passing', c: '#22d3ee', d: '让别国去承担制衡成本，自己保存实力。米尔斯海默认为多极下大国的首选策略——也是绥靖与连锁失灵的温床。', ex: '部分欧洲国家在印太「经济照旧、安全旁观」。' },
];

// 各国对华姿态归类（理论示意）
const POSTURE = [
  ['美国', '制衡（主导者）', '全政府对华竞争：科技管制+联盟体系+前沿威慑。'],
  ['日本 / 澳大利亚', '制衡（追随美国制衡）', '安保转型、防卫预算倍增、QUAD/AUKUS 支柱。'],
  ['印度', '软制衡 + 战略自主', '边境对峙后倾向 QUAD，但拒绝正式同盟、保留摇摆。'],
  ['东盟多数', '对冲 Hedging', '经济靠中国、安全靠美国——拒绝选边的中间策略。'],
  ['俄罗斯', '追随（背靠背协作）', '被西方制裁后向中国靠拢，结成「无上限」准联盟。'],
  ['欧盟', '推卸 + 局部制衡', '「去风险」修辞下经济照旧，安全投入主要留给美国。'],
];

// 米尔斯海默 vs 华尔兹 对照
const MW_VS = [
  ['国家目标', '安全最大化（适度权力即可）', '权力最大化（能多强就多强）'],
  ['权力的角色', '手段——过多反而招致制衡', '目的性手段——多多益善直至霸权'],
  ['体系倾向', '均势自动生成，维持现状者占优', '修正主义常态，地区霸权是唯一安全态'],
  ['扩张的后果', '过度扩张自我惩罚（拿破仑/希特勒败因）', '扩张常常有利可图（理性大国会算成本）'],
  ['最稳结构', '两极（误判通道最少）', '均衡多极>失衡多极；潜在霸权国出现最危险'],
  ['对华结论', '中国理性上应自我克制，美国可适度让渡空间', '中国必然谋求亚洲霸权，美国必然遏制——悲剧'],
];

export default function Page() {
  const [s, setS] = useState('offensive');
  const [stage, setStage] = useState(4);
  const [pol, setPol] = useState('bi');
  const [powers, setPowers] = useState(5);
  const [offdef, setOffdef] = useState(40); // 0=极度攻优 100=极度防优
  const sc = SCHOOLS[s];

  // 极性稳定性模拟：基础分 + 防御占优加成 - 误判通道惩罚
  const sim = useMemo(() => {
    const n = pol === 'uni' ? 2 : pol === 'bi' ? 2 : Math.max(3, powers);
    const channels = (n * (n - 1)) / 2;
    const defBonus = (offdef - 50) * 0.4; // 防优 → 加稳
    const chPenalty = (channels - 1) * 3.5;
    const idx = Math.round(Math.min(95, Math.max(8, POLARITY[pol].base + defBonus - (pol === 'multi' ? chPenalty : 0))));
    const verdict = idx >= 75
      ? '体系稳定区：威慑清晰、责任明确，大国战争概率低——但「稳定」不等于「和善」，竞争烈度可以很高。'
      : idx >= 50
        ? '紧张均衡区：结构尚可支撑和平，但攻防天平或大国数量的边际变化足以打开危机窗口——危机管控机制的价值最大。'
        : '高危区：误判通道多 + 先发制人诱惑大，1914 式连锁动员风险——华尔兹会说「这正是多极+攻优的最坏组合」。';
    return { n, channels, idx, verdict };
  }, [pol, powers, offdef]);

  // 安全困境螺旋：A/B 军备水平交替抬升 + 「可分辨防御」出口线
  const spiral = useMemo(() => ({
    legend: { ...LEGEND, data: ['A 国军备', 'B 国军备', '可分辨防御出口'], top: 0 },
    grid: { ...GRID, top: 30 },
    xAxis: categoryX(['T0', 'T1', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7']),
    yAxis: valueY({ name: '军备/紧张度', nameTextStyle: { color: '#7c8aa0', fontSize: 10 } }),
    series: [
      { name: 'A 国军备', type: 'line', step: 'end', data: [20, 34, 34, 52, 52, 74, 74, 96], lineStyle: { color: '#c41e3a', width: 2 }, itemStyle: { color: '#c41e3a' } },
      { name: 'B 国军备', type: 'line', step: 'end', data: [20, 20, 40, 40, 60, 60, 84, 84], lineStyle: { color: '#22d3ee', width: 2 }, itemStyle: { color: '#22d3ee' } },
      { name: '可分辨防御出口', type: 'line', smooth: true, data: [20, 26, 30, 33, 35, 36, 37, 38], lineStyle: { color: '#34d399', width: 2, type: 'dashed' }, itemStyle: { color: '#34d399' } },
    ],
  }), []);

  return (
    <div>
      <PageHeader badge="Cognition · 现实主义" title="现实主义 · 大国政治的力量逻辑"
        subtitle="古典 / 结构（防御性） / 进攻性 —— 剥离叙事，以权力与体系结构推演大国行为" />
      <IntroCard>
        现实主义把国际政治理解为<strong style={{ color: 'var(--text-primary)' }}>无政府状态下的权力竞争</strong>：国家的首要目标是生存，道德与制度从属于实力与利益。三大流派对「国家求权的程度」给出不同答案——从人性、到体系、到霸权逻辑，悲观程度递增。本页在流派对照之外，进一步拆解四个核心机制：<strong style={{ color: 'var(--text-primary)' }}>极性与稳定、攻防平衡、联盟动力学、安全困境螺旋</strong>。
      </IntroCard>

      <Card title="思想谱系 · 从修昔底德到新古典" className="mb-6">
        <TimelineBar stages={LINEAGE} activeIdx={stage} onSelect={setStage} />
      </Card>

      <div className="flex gap-1 flex-wrap mb-4">
        {Object.entries(SCHOOLS).map(([k, v]) => (
          <button key={k} onClick={() => setS(k)} className="text-sm px-3 py-1.5 rounded mono"
            style={{ background: k === s ? 'rgba(196,30,58,0.2)' : 'var(--bg-elevated)', color: k === s ? '#fff' : 'var(--text-secondary)', border: `1px solid ${k === s ? 'var(--china-red)' : 'transparent'}`, cursor: 'pointer' }}>{v.label}</button>
        ))}
      </div>

      <Grid cols={2} className="mb-6">
        <Card title={sc.label}>
          <div className="text-xs mono mb-2" style={{ color: 'var(--cyber-cyan)' }}>{sc.rep} · 分析单元：{sc.unit}</div>
          <p className="text-sm leading-relaxed mb-3" style={{ color: 'var(--text-secondary)' }}>{sc.tenet}</p>
          <div className="p-3 rounded" style={{ background: 'rgba(196,30,58,0.08)', border: '1px solid rgba(196,30,58,0.2)' }}>
            <span className="text-[10px] mono uppercase" style={{ color: 'var(--china-red)' }}>对中美博弈的预测</span>
            <p className="text-xs mt-1" style={{ color: 'var(--text-secondary)' }}>{sc.pred}</p>
          </div>
        </Card>
        <Card title="流派立场画像（示意）">
          <EChart option={{ radar: { indicator: RADAR_IND, axisName: { color: LABEL.color }, splitLine: { lineStyle: { color: 'rgba(148,163,184,0.15)' } }, splitArea: { show: false } }, series: [{ type: 'radar', data: [{ value: sc.radar, name: sc.label, lineStyle: { color: '#c41e3a' }, areaStyle: { color: 'rgba(196,30,58,0.14)' } }] }] }} style={{ height: 260 }} />
        </Card>
      </Grid>

      {s === 'offensive' && (
        <Card title="米尔斯海默 · 五大假设 → 必然结论" className="mb-6">
          <Grid cols={5} className="mb-3">
            {MEARSHEIMER.map(([t, d]) => (
              <div key={t} className="os-card p-3" style={{ background: 'var(--bg-elevated)' }}>
                <div className="text-xs font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>{t}</div>
                <p className="text-[11px]" style={{ color: 'var(--text-tertiary)' }}>{d}</p>
              </div>
            ))}
          </Grid>
          <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
            五个假设单独看都温和，叠加却推出冷酷结论：<strong style={{ color: 'var(--text-primary)' }}>每个大国都被迫追求权力最大化，直到成为本地区霸主</strong>，并阻止其他地区出现对等霸权。由此，米尔斯海默断言「<strong style={{ color: 'var(--china-red)' }}>中国不能和平崛起</strong>」——这不是道德判断，而是结构推演。
          </p>
        </Card>
      )}

      <Card title="极性稳定性模拟器 · 华尔兹「两极最稳」之辩（理论示意）" className="mb-6">
        <SelectorBar items={Object.entries(POLARITY).map(([k, v]) => ({ key: k, label: v.label }))} activeKey={pol} onSelect={setPol} />
        <Grid cols={2} className="mb-4">
          <div>
            <label className="text-xs mono block mb-1" style={{ color: 'var(--text-tertiary)' }}>大国数量（多极时生效）：{powers}</label>
            <input type="range" min={2} max={7} step={1} value={powers} onChange={(e) => setPowers(+e.target.value)} className="w-full" disabled={pol !== 'multi'} />
          </div>
          <div>
            <label className="text-xs mono block mb-1" style={{ color: 'var(--text-tertiary)' }}>攻防平衡：{offdef < 35 ? '攻势占优' : offdef > 65 ? '防御占优' : '大致均衡'}（{offdef}）</label>
            <input type="range" min={0} max={100} step={5} value={offdef} onChange={(e) => setOffdef(+e.target.value)} className="w-full" />
          </div>
        </Grid>
        <Grid cols={3} className="mb-3">
          <Stat label="体系稳定性指数" value={String(sim.idx)} sub="0-100 · 理论合成" />
          <Stat label="双边误判通道" value={String(sim.channels)} sub={`n(n−1)/2，n=${sim.n}`} />
          <Stat label="结构判读" value={sim.idx >= 75 ? '稳定' : sim.idx >= 50 ? '紧张均衡' : '高危'} sub={POLARITY[pol].label} />
        </Grid>
        <div className="p-3 rounded mb-2" style={{ background: 'var(--bg-elevated)', borderLeft: '3px solid var(--cyber-cyan)' }}>
          <p className="text-xs leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{sim.verdict}</p>
        </div>
        <p className="text-[11px] leading-relaxed" style={{ color: 'var(--text-tertiary)' }}>{POLARITY[pol].note} 指数为教学合成，非实证测量。</p>
      </Card>

      <Card title="攻防平衡理论 · 技术如何拨动战争天平" className="mb-6">
        <Grid cols={2} className="mb-3">
          <div className="os-card p-4" style={{ background: 'rgba(196,30,58,0.06)', borderLeft: '3px solid var(--china-red)' }}>
            <div className="text-sm font-semibold mb-1" style={{ color: 'var(--china-red)' }}>攻势占优 → 战争易发</div>
            <p className="text-xs leading-relaxed" style={{ color: 'var(--text-secondary)' }}>进攻成本低于防御时，先动手者得利——<strong style={{ color: 'var(--text-primary)' }}>先发制人诱惑</strong>与「动员竞赛」主导危机（1914 年的进攻崇拜 + 铁路时刻表）。征服看似廉价，修正主义更划算。</p>
          </div>
          <div className="os-card p-4" style={{ background: 'rgba(52,211,153,0.06)', borderLeft: '3px solid #34d399' }}>
            <div className="text-sm font-semibold mb-1" style={{ color: '#34d399' }}>防御占优 → 维持现状稳定</div>
            <p className="text-xs leading-relaxed" style={{ color: 'var(--text-secondary)' }}>防御成本远低于进攻时，征服得不偿失——国家可以「适度武装」而不威胁他人，安全困境被钝化（杰维斯 1978）。维持现状成为理性选择。</p>
          </div>
        </Grid>
        <Grid cols={3}>
          <div>
            <div className="text-xs font-semibold mb-1" style={{ color: 'var(--fire-gold)' }}>核武器 = 终极防御占优</div>
            <p className="text-[11px] leading-relaxed" style={{ color: 'var(--text-tertiary)' }}>二次打击能力让征服核大国本土在理论上不可能——大国战争被「冻结」在常规与灰色地带层面。</p>
          </div>
          <div>
            <div className="text-xs font-semibold mb-1" style={{ color: 'var(--fire-gold)' }}>网络 / 高超音速 = 攻势回摆</div>
            <p className="text-[11px] leading-relaxed" style={{ color: 'var(--text-tertiary)' }}>网络攻击溯源难、防御面无限大；高超音速压缩预警时间——两者都在把天平拨回攻势，侵蚀危机稳定性。</p>
          </div>
          <div>
            <div className="text-xs font-semibold mb-1" style={{ color: 'var(--fire-gold)' }}>攻防可分辨性是第二变量</div>
            <p className="text-[11px] leading-relaxed" style={{ color: 'var(--text-tertiary)' }}>武器若能被识别为「纯防御」（岸防导弹 vs 两栖舰队），军备增长可不触发螺旋——这是安全困境的技术出口。</p>
          </div>
        </Grid>
      </Card>

      <Card title="安全困境螺旋 · 与「可分辨防御」的出口（示意）" className="mb-6">
        <EChart option={spiral} style={{ height: 250 }} />
        <p className="text-[11px] mt-1 leading-relaxed" style={{ color: 'var(--text-tertiary)' }}>
          阶梯线：A 增军备 → B 不安而增 → A 更不安再增——双方都自认防御，紧张度却交替抬升（赫茨/杰维斯）。虚线为理论出口：若军备姿态<strong style={{ color: 'var(--text-secondary)' }}>可被分辨为防御性</strong>（部署位置、武器类型、透明度机制），增长无需触发对等回应，螺旋可被截断。
        </p>
      </Card>

      <Card title="联盟动力学 · 面对崛起国的三种反应" className="mb-6">
        <Grid cols={3} className="mb-4">
          {ALLIANCE.map((a) => (
            <div key={a.t} className="os-card p-4" style={{ background: 'var(--bg-elevated)', borderLeft: `3px solid ${a.c}` }}>
              <div className="text-sm font-semibold mb-1" style={{ color: a.c }}>{a.t}</div>
              <p className="text-xs leading-relaxed mb-2" style={{ color: 'var(--text-secondary)' }}>{a.d}</p>
              <p className="text-[11px]" style={{ color: 'var(--text-tertiary)' }}>示例：{a.ex}</p>
            </div>
          ))}
        </Grid>
        <div className="overflow-x-auto">
          <table className="w-full text-xs" style={{ borderCollapse: 'collapse' }}>
            <thead><tr style={{ color: 'var(--text-tertiary)', borderBottom: '1px solid var(--border-subtle)' }}>
              <th className="text-left py-2 pr-3">行为体</th><th className="text-left py-2 pr-3">理论归类（示意）</th><th className="text-left py-2">姿态要点</th>
            </tr></thead>
            <tbody>
              {POSTURE.map(([a, c, d]) => (
                <tr key={a} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                  <td className="py-2 pr-3 font-semibold" style={{ color: 'var(--text-primary)' }}>{a}</td>
                  <td className="py-2 pr-3 mono" style={{ color: 'var(--cyber-cyan)' }}>{c}</td>
                  <td className="py-2" style={{ color: 'var(--text-secondary)' }}>{d}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-[11px] mt-2" style={{ color: 'var(--text-tertiary)' }}>归类为理论标签的粗略映射；现实中多数国家是「对冲」混合策略，且随事件动态漂移。</p>
      </Card>

      <Card title="米尔斯海默 vs 华尔兹 · 逐项对照" className="mb-6">
        <div className="overflow-x-auto">
          <table className="w-full text-xs" style={{ borderCollapse: 'collapse' }}>
            <thead><tr style={{ color: 'var(--text-tertiary)', borderBottom: '1px solid var(--border-subtle)' }}>
              <th className="text-left py-2 pr-3">维度</th>
              <th className="text-left py-2 pr-3" style={{ color: 'var(--cyber-cyan)' }}>华尔兹（防御性）</th>
              <th className="text-left py-2" style={{ color: 'var(--china-red)' }}>米尔斯海默（进攻性）</th>
            </tr></thead>
            <tbody>
              {MW_VS.map(([dim, w, m]) => (
                <tr key={dim} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                  <td className="py-2 pr-3 font-semibold" style={{ color: 'var(--text-primary)' }}>{dim}</td>
                  <td className="py-2 pr-3" style={{ color: 'var(--text-secondary)' }}>{w}</td>
                  <td className="py-2" style={{ color: 'var(--text-secondary)' }}>{m}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-[11px] mt-2 leading-relaxed" style={{ color: 'var(--text-tertiary)' }}>两人共享全部结构前提，分歧只在「无政府状态逼国家要多少权力」——一个变量的不同取值，导出对华政策的两套世界。</p>
      </Card>

      <Card title="权力转移 · 中美综合国力（示意 · 进攻性现实主义读法）" className="mb-6">
        <EChart option={transition} style={{ height: 240 }} />
        <p className="text-[11px] mt-1" style={{ color: 'var(--text-tertiary)' }}>进攻性现实主义认为：守成霸权与崛起大国的实力曲线<strong style={{ color: 'var(--text-secondary)' }}>逼近交叉的窗口期</strong>最危险（修昔底德陷阱）。曲线为示意，非预测。</p>
      </Card>

      <Card title="批判与边界" className="mb-6">
        <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
          现实主义被批评为低估了经济相互依赖、国际制度、国内政治与观念（建构主义）的作用；进攻性现实主义尤其被指过度悲观、自我实现。作为思想工具，它的价值在于<strong style={{ color: 'var(--text-primary)' }}>提供一个「最坏情况」的结构基线</strong>——理解对手如何用这套逻辑思考，本身就是战略素养。
        </p>
      </Card>

      <FrameworkTrio cards={[
        { title: '自助体系逻辑', subtitle: 'Mearsheimer · 进攻性', body: '无政府状态下国家只能自助——权力是生存的唯一可靠保障。进攻性现实主义读出「中国不能和平崛起」，结构决定悲剧倾向。', pillars: [['权力', '生存的唯一保障。'], ['制衡', '均势自动形成。'], ['窗口期', '实力交叉最危险。']] },
        { title: '最坏情况基线', subtitle: '思想工具 · 非预测', body: '现实主义的价值在于提供最坏情况的结构基线——理解对手如何用这套逻辑思考，本身就是战略素养。经济相互依赖与制度被低估。', pillars: [['结构基线', '非实证预测。'], ['修昔底德', '可规避的反例。'], ['建构主义', '观念改写身份。']] },
        { title: '升级路径 · 理论对照', subtitle: '结构 vs 能动', body: '与修昔底德陷阱、建构主义、外交博弈模块形成理论三角——结构约束与能动空间之争是认知内核的核心张力。', pillars: [['外交盘', '自助体系操作化。'], ['台海', '结构高危现场。'], ['博弈论', '重复均衡求解。']] },
      ]} />

      <CrossLinks className="mt-6" links={[
        { to: '/diplomacy', label: '外交全局框架盘', note: '四圈层布局与张力轴，正是现实主义「自助体系」的操作化。' },
        { to: '/thucydides', label: '修昔底德陷阱', note: '结构现实主义在霸权过渡情境下的悲观推论与反例。' },
        { to: '/constructivism', label: '建构主义', note: '对照阵营：观念与身份如何改写「无政府状态」的含义。' },
      ]} />
      <ModuleFooter moduleId="realism" links={[
        { to: '/diplomacy', label: '外交全局框架盘', note: '四圈层布局与张力轴，正是现实主义「自助体系」的操作化。' },
        { to: '/thucydides', label: '修昔底德陷阱', note: '结构现实主义在霸权过渡情境下的悲观推论与反例。' },
        { to: '/constructivism', label: '建构主义', note: '对照阵营：观念与身份如何改写「无政府状态」的含义。' },
      ]} disclaimer="本模块为国际关系理论梳理与思想工具，曲线/雷达/指数均为示意，不构成对现实事件的预测" />
    </div>
  );
}
