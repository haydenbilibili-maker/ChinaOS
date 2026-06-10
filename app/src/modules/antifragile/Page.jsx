import React, { useState, useMemo } from 'react';
import { PageHeader, Card, Grid, Stat } from '../../app/ui.jsx';
import EChart from '../../lib/viz/EChart.jsx';
import { categoryX, valueY, logY, GRID, donutOpt, radarOpt, stackedBarOpt } from '../shared/chartHelpers.js';
import { IntroCard, SelectorBar, TimelineBar, FrameworkTrio, ModuleFooter } from '../shared/ModuleParadigm.jsx';

// ============================================================================
// 认知内核 · 反脆弱（Antifragility · 纳西姆·塔勒布）
// ----------------------------------------------------------------------------
// 三态：脆弱(凹·惧波动) / 强韧(平·不变) / 反脆弱(凸·从波动获益)。
// 交互：凸性模拟器（波动滑杆 × 聚焦态） + 杠铃配置器 + 林迪曲线
//      + 系统案例选择器 + 过度干预卡 + 中国系统两面评估 + 思想谱系时间线。
// ============================================================================

const STATES = {
  fragile: { label: '脆弱 Fragile', color: '#c41e3a', k: -0.06, shape: '凹（concave）',
    desc: '收益对波动凹向下：小波动尚可，大波动带来不成比例的崩塌损失。怕黑天鹅。',
    proj: '过度杠杆 · 单一供应链 · 极限去库存（JIT 无冗余） · 政绩工程的债务雪球。' },
  robust: { label: '强韧 Robust', color: '#22d3ee', k: 0, shape: '平（flat）',
    desc: '收益对波动近乎不变：抗住冲击但也不从中获益。是「不坏」，不是「更好」。',
    proj: '战略储备 · 防御工事 · 冗余电网 · 维稳态——求确定性，付出机会成本。' },
  antifragile: { label: '反脆弱 Antifragile', color: '#10b981', k: 0.06, shape: '凸（convex）',
    desc: '收益对波动凸向上：从混乱、压力、试错中获益，波动越大上行越多（有下限保护）。',
    proj: '能源/供应链冗余 + 多元试点 · 压力测试 · 杠铃式财政 · 小步快试的改革。' },
};

const CONCEPTS = [
  ['黑天鹅 Black Swan', '极罕见、极高冲击、事后才被解释的事件。脆弱系统的命运由它一次决定。'],
  ['杠铃策略 Barbell', '90% 极保守 + 10% 高风险高上行，掏空中间。封住下行、敞开上行。'],
  ['凸性 Convexity', '反脆弱的数学本质：收益函数凸 → 波动的期望收益为正（詹森不等式）。'],
  ['林迪效应 Lindy', '非易逝事物的预期寿命随已存活时长增长——活得越久的，越可能继续活。'],
  ['过度优化即脆弱', '把一切冗余压榨成「效率」，系统失去缓冲，在尾部风险前不堪一击。'],
];

// 系统案例：脆弱源 / 波动暴露 / 学习回路 三维判读
const CASES = [
  { key: 'restaurant', label: '餐饮业', color: '#10b981', verdict: '行业反脆弱', tone: '#10b981',
    fragile: '单店极脆弱：现金流薄、口味试错成本全由店主承担，年倒闭率高。',
    expose: '每家店都直面市场波动，失败信号即时、局部、不可隐藏。',
    loop: '单店之死是行业之师——存活配方/选址/模式被迅速复制，整体口味与效率持续进化。',
    note: '塔勒布经典案例：个体的脆弱性，构成了总体的反脆弱性。' },
  { key: 'aviation', label: '航空业', color: '#22d3ee', verdict: '设计型反脆弱', tone: '#22d3ee',
    fragile: '单次事故代价极高，但事故彼此独立、不传染（一架坠毁不会拖垮其它航班）。',
    expose: '黑匣子强制把每次波动转化为公开信息，错误暴露被制度化。',
    loop: '每次事故 → 全行业改规程/改机型 → 事故率逐年下降。错误的代价被全行业吸收为知识。',
    note: '关键设计：错误小型化 + 不传染 + 强制学习。这是反脆弱工程的模板。' },
  { key: 'banking', label: '银行体系', color: '#c41e3a', verdict: '隐藏的脆弱', tone: '#c41e3a',
    fragile: '高杠杆 + 深度互联：风险不独立、会传染。平日波动被风控「熨平」，表面稳健。',
    expose: '波动被隐藏而非消除——坏账滚动、表外腾挪，信息回路被切断。',
    loop: '无学习回路：救助（bailout）让犯错者免于代价，脆弱性原封不动地累积到下一次。',
    note: '2008 教训：表面最平稳的系统，往往是把尾部风险压缩进一次总爆发。' },
  { key: 'startup', label: '创业生态', color: '#e8a317', verdict: '生态级反脆弱', tone: '#10b981',
    fragile: '单个创业公司九死一生，失败是常态而非例外。',
    expose: '大量小赌注并行试错，每个失败都便宜、快速、信息量大。',
    loop: '资本与人才向存活者再配置；失败经验随创始人/工程师流动复用。硅谷=制度化的杠铃。',
    note: '生态的上行无上限（一个超级赢家覆盖千次失败），下行有限（单次损失封顶）。' },
  { key: 'dualtrack', label: '中国双轨制改革', color: '#10b981', verdict: '反脆弱设计', tone: '#10b981',
    fragile: '旧体制整体切换风险极高（参照休克疗法的崩溃案例）。',
    expose: '特区/试点把波动限制在局部：错了关掉一个试验田，对了全国推广。',
    loop: '摸着石头过河=凸性期权组合——下行封顶（试点可逆），上行敞开（成功可复制）。',
    note: '增量赛跑存量、灰度替代切换：这是国家尺度上罕见的反脆弱工程实践。' },
  { key: 'planned', label: '计划单一制', color: '#c41e3a', verdict: '结构性脆弱', tone: '#c41e3a',
    fragile: '单中心定价/配置：一处算错，全局错配，没有局部失败的「防火隔间」。',
    expose: '价格信号被取消 → 波动（短缺/过剩）不可见，误差无法被市场暴露。',
    loop: '反馈回路断裂：计划者听不到代价信号，错误逐年复利，直到不可纠正。',
    note: '不是「执行不力」的问题，而是把全部鸡蛋焊死在一个篮子里的结构问题。' },
];

// 思想谱系：斯多葛 → 凸性期权 → 黑天鹅 → 反脆弱 → 风险共担
const LINEAGE = [
  { period: '古典', title: '斯多葛 Stoicism', accent: '#93a1b5',
    desc: '塞涅卡：财富在手而心已预演失去——把下行心理成本提前折旧，上行照单全收。这是杠铃策略的精神原型：情绪上极保守，行动上敢冒险。' },
  { period: '1980s–90s', title: '凸性期权 · 交易员期', accent: '#e8a317',
    desc: '塔勒布在交易所做期权做市商：长期持有便宜的深度虚值期权，平日小亏（权利金），崩盘日巨赚。亲身验证「凸性头寸从波动获益」，1987 股灾一战成名。' },
  { period: '2007', title: '《黑天鹅》', accent: '#c41e3a',
    desc: '命题：历史由极端事件驱动，但统计工具假装它们不存在（高斯分布的「平均斯坦」幻觉）。次年金融危机为本书做了昂贵的实证。' },
  { period: '2012', title: '《反脆弱》', accent: '#10b981',
    desc: '从「识别黑天鹅」推进到「设计受益于黑天鹅的系统」：凸性、杠铃、冗余、小而多的试错。黑天鹅不可预测，但凸凹性可以设计。' },
  { period: '2018', title: '风险共担 Skin in the Game', accent: '#22d3ee',
    desc: '伦理收口：建议者必须分担后果，否则脆弱性会被转嫁（银行家拿奖金、纳税人买单）。无切肤之痛的系统，必然累积隐藏脆弱。' },
];

// 中国系统两面评估
const CN_ASSESS = {
  anti: { title: '反脆弱设计（凸性资产）', color: '#10b981', items: [
    ['灰度试点', '特区→沿海→全国的梯度推广 = 期权组合：单点失败可逆，成功全网复制。'],
    ['双轨制', '增量绕开存量硬碰撞，旧轨平稳折旧、新轨竞争进化，避免一次性切换的尾部风险。'],
    ['产业冗余', '多基地布局、备份供应链、超前基建——平日被讥为「过剩」，冲击日即为凸性。'],
    ['央地竞争', '地方政府锦标赛=并行试错引擎，治理创新在省际竞争中被筛选放大。'],
  ] },
  fragile: { title: '脆弱性积累（凹性负债）', color: '#c41e3a', items: [
    ['刚性兑付', '隐性担保熨平了违约的小波动，让风险定价失灵，坏资产在水面下连成大陆。'],
    ['维稳怪圈', '把一切局部摩擦按住不让冒头——短期波动消失，长期张力无处释放、持续累积。'],
    ['土地财政依赖', '单一收入引擎 + 高杠杆链条：地价单边预期一旦反转，传染路径深而长。'],
    ['信息回路衰减', '报喜不报忧的层层过滤=切断学习回路，与反脆弱所需的「错误可见」相反。'],
  ] },
};

// payoff(波动 v) = 基线 + k·v² （凹 k<0 / 平 k=0 / 凸 k>0），反脆弱含下限保护
function curve(k, vmax) {
  const pts = [];
  for (let v = 0; v <= vmax; v += vmax / 24) {
    let y = 50 + k * v * v;
    if (k > 0) y = Math.max(38, y);        // 反脆弱：杠铃下限保护
    pts.push([Number(v.toFixed(1)), Number(y.toFixed(1))]);
  }
  return pts;
}

// 林迪效应：E[剩余寿命] ∝ 已存活时长（非易逝事物）
const LINDY_CASES = [
  { name: '《论语》等经典文本', age: 2500 }, { name: '罗马法传统', age: 1500 },
  { name: '大学制度', age: 930 }, { name: '复式记账', age: 530 },
  { name: '中央银行', age: 330 }, { name: '互联网', age: 55 }, { name: '某社交 App', age: 12 },
];

export default function Page() {
  const [vol, setVol] = useState(60);          // 波动强度 0–100
  const [focus, setFocus] = useState('antifragile');
  const [safePct, setSafePct] = useState(85);  // 杠铃保守端占比 60–95
  const [caseKey, setCaseKey] = useState('dualtrack');
  const [stageIdx, setStageIdx] = useState(3);

  // 各态在当前波动下的收益（取曲线末端值）
  const payoffs = useMemo(() => {
    const at = (k) => { let y = 50 + k * vol * vol / 40; return k > 0 ? Math.max(38, y) : y; };
    return { fragile: at(STATES.fragile.k), robust: at(STATES.robust.k), antifragile: at(STATES.antifragile.k) };
  }, [vol]);
  const fmt = (n) => Math.round(n);

  const series = Object.entries(STATES).map(([key, s]) => ({
    name: s.label, type: 'line', smooth: true, symbol: 'none',
    data: curve(s.k, vol / 25 + 0.5),
    lineStyle: { color: s.color, width: focus === key ? 3.5 : 1.5, opacity: focus === key ? 1 : 0.45 },
    areaStyle: key === focus ? { color: s.color + '22' } : undefined,
  }));

  const chart = {
    legend: { data: Object.values(STATES).map((s) => s.label), textStyle: { color: '#93a1b5' }, top: 0 },
    grid: { left: 44, right: 18, top: 34, bottom: 30 },
    xAxis: { type: 'value', name: '波动 →', nameTextStyle: { color: '#93a1b5' }, axisLine: { lineStyle: { color: '#27324a' } }, splitLine: { show: false } },
    yAxis: { type: 'value', name: '收益', min: 20, max: 100, nameTextStyle: { color: '#93a1b5' }, splitLine: { lineStyle: { color: 'rgba(148,163,184,0.1)' } }, axisLine: { lineStyle: { color: '#27324a' } } },
    series,
  };

  // ── 杠铃策略配置器：保守端占比 → 平稳期 / 黑天鹅期 表现对照 ──
  const barbell = useMemo(() => {
    const c = safePct / 100, r = 1 - c;
    return {
      calm: { barbell: c * 3 + r * 18, middle: 9 },                       // 平稳期年化
      swan: { barbell: c * 2 + r * 160 - 5, middle: -42 },                // 黑天鹅期：凸性期权爆发 vs 中庸重创
      worst: { barbell: -(r * 100).toFixed(0), middle: -55 },             // 最大回撤（激进端全损封顶）
    };
  }, [safePct]);

  const barbellChart = useMemo(() => ({
    tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' }, valueFormatter: (v) => v.toFixed(1) + '%' },
    legend: { data: ['杠铃配置', '中庸均衡'], textStyle: { color: '#93a1b5' }, top: 0 },
    grid: { ...GRID, top: 30 },
    xAxis: categoryX(['平稳期收益', '黑天鹅期收益', '最大回撤']),
    yAxis: valueY({ axisLabel: { formatter: '{value}%' } }),
    series: [
      { name: '杠铃配置', type: 'bar', barWidth: 26, itemStyle: { color: '#10b981' },
        data: [barbell.calm.barbell, barbell.swan.barbell, Number(barbell.worst.barbell)].map((v) => Number(v.toFixed(1))) },
      { name: '中庸均衡', type: 'bar', barWidth: 26, itemStyle: { color: '#c41e3a' },
        data: [barbell.calm.middle, barbell.swan.middle, barbell.worst.middle] },
    ],
  }), [barbell]);

  // ── 林迪效应：line(E[剩余]=已存活) + scatter 案例标注（双系列内联） ──
  const lindyChart = useMemo(() => ({
    tooltip: { trigger: 'item', formatter: (p) => p.seriesType === 'scatter'
      ? `${p.data[2]}<br/>已存活 ${p.data[0]} 年 → 预期再活 ≈ ${p.data[1]} 年` : '' },
    grid: { left: 56, right: 24, top: 28, bottom: 40 },
    xAxis: { type: 'log', name: '已存活（年，对数）', nameLocation: 'middle', nameGap: 26, nameTextStyle: { color: '#93a1b5' },
      min: 8, max: 4000, axisLine: { lineStyle: { color: '#27324a' } }, axisLabel: { color: '#93a1b5', fontSize: 10 }, splitLine: { show: false } },
    yAxis: logY({ name: 'E[剩余寿命]（年）', nameTextStyle: { color: '#93a1b5' }, min: 8, max: 4000 }),
    series: [
      { name: '林迪线 E[剩余]∝已存活', type: 'line', symbol: 'none',
        data: [[8, 8], [30, 30], [100, 100], [400, 400], [1200, 1200], [4000, 4000]],
        lineStyle: { color: '#e8a317', width: 2, type: 'dashed' } },
      { name: '案例', type: 'scatter', symbolSize: 11, itemStyle: { color: '#22d3ee' },
        label: { show: true, position: 'right', color: '#93a1b5', fontSize: 10, formatter: (p) => p.data[2] },
        data: LINDY_CASES.map((c) => [c.age, c.age, c.name]) },
    ],
  }), []);

  const cs = CASES.find((c) => c.key === caseKey);

  return (
    <div>
      <PageHeader badge="Cognition · 反脆弱" title="反脆弱 · 从波动与混乱中获益"
        subtitle="塔勒布三态：脆弱(凹·惧波动) / 强韧(平·不变) / 反脆弱(凸·受益) —— 拖动波动看收益如何分化" />
      <IntroCard>
        反脆弱不是「强韧」的同义词。强韧只是<strong style={{ color: 'var(--text-primary)' }}>抗住</strong>冲击；反脆弱是<strong style={{ color: 'var(--text-primary)' }}>从冲击中变得更强</strong>。判据看收益对波动的<strong style={{ color: 'var(--text-primary)' }}>凸凹性</strong>：凹则脆弱、平则强韧、凸则反脆弱。系统设计的目标，是把脆弱性挪到敌人那边，把凸性留给自己。
      </IntroCard>

      <Grid cols={3} className="mb-6">
        <Stat value={fmt(payoffs.fragile)} label="脆弱态收益（当前波动）" accent="#c41e3a" />
        <Stat value={fmt(payoffs.robust)} label="强韧态收益（近乎不变）" accent="#22d3ee" />
        <Stat value={fmt(payoffs.antifragile)} label="反脆弱态收益（上行）" accent="#10b981" />
      </Grid>

      <Grid cols={2} className="mb-6">
        <Card title="凸性模拟器 · 拖动波动强度 + 选择聚焦态">
          <div className="flex justify-between text-xs mb-1"><span style={{ color: 'var(--text-secondary)' }}>波动强度 Volatility</span><span className="mono" style={{ color: 'var(--cyber-cyan)' }}>{vol}</span></div>
          <input type="range" min="0" max="100" value={vol} onChange={(e) => setVol(Number(e.target.value))} style={{ width: '100%', accentColor: '#e8a317' }} />
          <div className="flex gap-1 flex-wrap mt-3 mb-3">
            {Object.entries(STATES).map(([k, v]) => (
              <button key={k} onClick={() => setFocus(k)} className="text-xs px-3 py-1 rounded mono"
                style={{ background: k === focus ? v.color + '33' : 'var(--bg-elevated)', color: k === focus ? '#fff' : 'var(--text-secondary)', border: `1px solid ${k === focus ? v.color : 'transparent'}`, cursor: 'pointer' }}>{v.label}</button>
            ))}
          </div>
          <EChart option={chart} style={{ height: 220 }} />
          <p className="text-[11px] mt-2" style={{ color: 'var(--text-tertiary)' }}>波动是信息：每次小波动都在暴露系统的真实弱点。压抑波动 = 切断信息 = 把无数次小代价兑换成一次尾部总清算。</p>
        </Card>
        <Card title={STATES[focus].label + ' · 解读'}>
          <div className="text-xs mono mb-2" style={{ color: STATES[focus].color }}>曲率：{STATES[focus].shape}</div>
          <p className="text-sm leading-relaxed mb-3" style={{ color: 'var(--text-secondary)' }}>{STATES[focus].desc}</p>
          <div className="p-3 rounded" style={{ background: STATES[focus].color + '14', border: `1px solid ${STATES[focus].color}33` }}>
            <span className="text-[10px] mono uppercase" style={{ color: STATES[focus].color }}>项目映射</span>
            <p className="text-xs mt-1" style={{ color: 'var(--text-secondary)' }}>{STATES[focus].proj}</p>
          </div>
          <p className="text-[11px] mt-3" style={{ color: 'var(--text-tertiary)' }}>提示：波动拉满时，脆弱态加速下坠、反脆弱态借势上行——同一个冲击，凸凹决定生死。</p>
        </Card>
      </Grid>

      <Grid cols={2} className="mb-6">
        <Card title="杠铃策略配置器 · 掏空中间地带">
          <div className="flex justify-between text-xs mb-1">
            <span style={{ color: 'var(--text-secondary)' }}>极端保守端占比（国债/现金级）</span>
            <span className="mono" style={{ color: 'var(--cyber-cyan)' }}>{safePct}% 保守 + {100 - safePct}% 极激进</span>
          </div>
          <input type="range" min="60" max="95" value={safePct} onChange={(e) => setSafePct(Number(e.target.value))} style={{ width: '100%', accentColor: '#10b981' }} />
          <EChart option={barbellChart} style={{ height: 230 }} />
        </Card>
        <Card title="为什么「中间地带」最危险">
          <Grid cols={2} className="mb-3">
            <Stat value={barbell.worst.barbell + '%'} label="杠铃最大回撤（激进端全损封顶）" accent="#10b981" />
            <Stat value={barbell.worst.middle + '%'} label="中庸配置黑天鹅回撤（无封顶）" accent="#c41e3a" />
          </Grid>
          <p className="text-sm leading-relaxed mb-2" style={{ color: 'var(--text-secondary)' }}>
            「中等风险」资产的风险其实<strong style={{ color: 'var(--text-primary)' }}>不可测</strong>——它的安全性建立在模型假设上，黑天鹅一来假设全崩。杠铃则不依赖任何预测：保守端的安全是<em>确定的</em>（损失上限 = 激进端仓位），激进端的上行是<em>敞开的</em>。
          </p>
          <p className="text-[11px]" style={{ color: 'var(--text-tertiary)' }}>同构应用：90% 稳定主业 + 10% 疯狂副业；财政 90% 保民生 + 10% 投前沿试点；写作 90% 经典阅读 + 10% 野路子。结构相同：封死下行，买入凸性。</p>
        </Card>
      </Grid>

      <Card title="林迪效应 · 已存活时长 = 最好的寿命预测器" className="mb-6">
        <Grid cols={2}>
          <EChart option={lindyChart} style={{ height: 260 }} />
          <div>
            <p className="text-sm leading-relaxed mb-3" style={{ color: 'var(--text-secondary)' }}>
              对<strong style={{ color: 'var(--text-primary)' }}>非易逝事物</strong>（思想、制度、技术、书），每多存活一年，预期剩余寿命<strong style={{ color: 'var(--text-primary)' }}>不减反增</strong>——与生物相反。原因：时间是唯一不可贿赂的压力测试，存活两千年的文本已经历两千年的波动筛选。
            </p>
            <div className="p-3 rounded mb-2" style={{ background: 'rgba(34,211,238,0.08)', border: '1px solid rgba(34,211,238,0.25)' }}>
              <span className="text-[10px] mono uppercase" style={{ color: '#22d3ee' }}>判读规则</span>
              <p className="text-xs mt-1" style={{ color: 'var(--text-secondary)' }}>《论语》比任何畅销书更可能再传五百年；纸质书大概率活过当前任何 App；存在千年的制度形态（科举式选拔、央地分层）不会因一轮技术浪潮消失，只会换壳。</p>
            </div>
            <p className="text-[11px]" style={{ color: 'var(--text-tertiary)' }}>推论：研究中国系统，对存活最久的制度基因（郡县、文官、试点）下注，比对最新概念下注更符合林迪。</p>
          </div>
        </Grid>
      </Card>

      <Card title="系统案例判读 · 脆弱源 / 波动暴露 / 学习回路" className="mb-6">
        <SelectorBar items={CASES} activeKey={caseKey} onSelect={setCaseKey} />
        <div className="os-card p-5" style={{ background: 'var(--bg-elevated)', borderLeft: `3px solid ${cs.tone}` }}>
          <div className="flex items-baseline gap-3 mb-3">
            <span className="text-base font-semibold" style={{ color: 'var(--text-primary)' }}>{cs.label}</span>
            <span className="text-xs mono px-2 py-0.5 rounded" style={{ background: cs.tone + '22', color: cs.tone }}>{cs.verdict}</span>
          </div>
          <Grid cols={3} className="mb-3">
            <div>
              <div className="text-xs font-semibold mb-1" style={{ color: '#c41e3a' }}>脆弱源</div>
              <p className="text-xs leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{cs.fragile}</p>
            </div>
            <div>
              <div className="text-xs font-semibold mb-1" style={{ color: '#e8a317' }}>波动暴露</div>
              <p className="text-xs leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{cs.expose}</p>
            </div>
            <div>
              <div className="text-xs font-semibold mb-1" style={{ color: '#10b981' }}>学习回路</div>
              <p className="text-xs leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{cs.loop}</p>
            </div>
          </Grid>
          <p className="text-[11px]" style={{ color: 'var(--text-tertiary)' }}>{cs.note}</p>
        </div>
      </Card>

      <Card title="过度干预 Iatrogenics · 医源性损害" className="mb-6">
        <Grid cols={3}>
          <div className="os-card p-4" style={{ background: 'var(--bg-elevated)' }}>
            <div className="text-xs font-semibold mb-1" style={{ color: '#e8a317' }}>森林防火悖论</div>
            <p className="text-[11px] leading-relaxed" style={{ color: 'var(--text-tertiary)' }}>扑灭每场小火 → 枯木燃料逐年堆积 → 终于来一场扑不灭的超级大火。小火是森林的新陈代谢，禁绝小火等于预订大火。</p>
          </div>
          <div className="os-card p-4" style={{ background: 'var(--bg-elevated)' }}>
            <div className="text-xs font-semibold mb-1" style={{ color: '#c41e3a' }}>大缓和 → 2008</div>
            <p className="text-[11px] leading-relaxed" style={{ color: 'var(--text-tertiary)' }}>央行精准熨平每次小衰退（Great Moderation），市场误读为「风险已死」→ 杠杆登峰造极 → 被压抑的波动以系统性崩溃一次性返还。</p>
          </div>
          <div className="os-card p-4" style={{ background: 'var(--bg-elevated)' }}>
            <div className="text-xs font-semibold mb-1" style={{ color: '#22d3ee' }}>干预者的不对称</div>
            <p className="text-[11px] leading-relaxed" style={{ color: 'var(--text-tertiary)' }}>干预的收益即时可见（政绩），代价延迟且归因模糊（下任埋单）——激励结构天然偏向过度干预。解药是风险共担：让决策者留在自己制造的尾部里。</p>
          </div>
        </Grid>
        <p className="text-[11px] mt-3" style={{ color: 'var(--text-tertiary)' }}>判据：干预消除的是波动本身，还是波动携带的信息？前者偶尔必要，后者必然致命。</p>
      </Card>

      <Card title="中国系统反脆弱评估 · 两面账本" className="mb-6">
        <Grid cols={2}>
          {[CN_ASSESS.anti, CN_ASSESS.fragile].map((side) => (
            <div key={side.title} className="os-card p-4" style={{ background: 'var(--bg-elevated)', borderTop: `2px solid ${side.color}` }}>
              <div className="text-sm font-semibold mb-3" style={{ color: side.color }}>{side.title}</div>
              {side.items.map(([t, d]) => (
                <div key={t} className="mb-2">
                  <span className="text-xs font-semibold" style={{ color: 'var(--text-primary)' }}>{t}</span>
                  <p className="text-[11px] leading-relaxed" style={{ color: 'var(--text-tertiary)' }}>{d}</p>
                </div>
              ))}
            </div>
          ))}
        </Grid>
        <p className="text-[11px] mt-3" style={{ color: 'var(--text-tertiary)' }}>净判读：同一系统两套基因并存——试点机制是凸性资产，刚兑与信息过滤是凹性负债。改革的实质 = 资产端扩张、负债端出清的赛跑。</p>
      </Card>

      <Card title="思想谱系 · 从斯多葛到风险共担" className="mb-6">
        <TimelineBar stages={LINEAGE} activeIdx={stageIdx} onSelect={setStageIdx} />
      </Card>

      <Card title="五个核心概念 · 反脆弱工具箱" className="mb-6">
        <Grid cols={5}>
          {CONCEPTS.map(([t, d]) => (
            <div key={t} className="os-card p-3" style={{ background: 'var(--bg-elevated)' }}>
              <div className="text-xs font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>{t}</div>
              <p className="text-[11px]" style={{ color: 'var(--text-tertiary)' }}>{d}</p>
            </div>
          ))}
        </Grid>
      </Card>

      <Card title="用法 · 与各模块的接口" className="mb-6">
        <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
          反脆弱是<span className="mono" style={{ color: 'var(--cyber-cyan)' }}>能源安全 / 供应链 / 财政体系 / 治国沙盒</span>的压力测试视角：冗余不是浪费而是凸性期权；过度去杠杆化的「效率」是把系统推向凹性。设计制度时先问一句——<strong style={{ color: 'var(--text-primary)' }}>这个安排，在尾部冲击下是凹还是凸？</strong>
        </p>
      </Card>
<FrameworkTrio cards={[
        { key: 'salt', body: '凹性脆弱：过度优化与单一供应链。' },
        { key: 'stone', body: '强韧冗余：储备/电网/维稳态的机会成本。' },
        { key: 'path', body: '凸性反脆弱：试点、杠铃财政、压力测试获益。' },
      ]} />
<ModuleFooter moduleId="antifragile" disclaimer="思想工具 / 概念示意，非投资建议 · 公开资料整理，仅供分析框架参考" />
    </div>
  );
}
