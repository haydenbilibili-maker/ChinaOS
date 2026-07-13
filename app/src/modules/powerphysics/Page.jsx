import React, { useState, useMemo } from 'react';
import { PageHeader, Card, Grid, Stat } from '../../app/ui.jsx';
import EChart from '../../lib/viz/EChart.jsx';
import { categoryX, valueY, logY, GRID, donutOpt, radarOpt, stackedBarOpt, AXIS, LABEL } from '../shared/chartHelpers.js';
import { IntroCard, SelectorBar, TimelineBar, FrameworkTrio, ModuleFooter } from '../shared/ModuleParadigm.jsx';

// ============================================================================
// 认知内核 · 权力物理学（Power Physics）
// ----------------------------------------------------------------------------
// 把权力当作可计算的「力场」：有效权力 = f(强制力, 合法性, 信息穿透) − 社会摩擦。
// 本次扩容：统治成本模拟器（过控临界点）/ 权力三定律 / 历史政权案例力学画像 /
// 力场空间衰减（控制技术改变衰减常数）/ 控制-活力散点。思想工具，非历史决定论。
// ============================================================================

const PRESETS = {
  mobilize: { label: '动员态', coercion: 75, legit: 70, penetration: 80, friction: 35, note: '集中力量办大事：强制与穿透拉满，以绩效合法性对冲摩擦。' },
  stable: { label: '维稳态', coercion: 60, legit: 75, penetration: 90, friction: 40, note: '常态化治理：信息穿透最大化（数字利维坦），追求极致确定性。' },
  depression: { label: '萧条态', coercion: 55, legit: 50, penetration: 85, friction: 70, note: '增长换挡：绩效合法性递减、社会摩擦抬升，统治成本上行。' },
};

const LAWS_SIGNATURE = [
  ['收支倒挂 · 压力传导', '财权上收、事权下沉 → 基层财政缺口被层层加压传导，是治理摩擦的主源。'],
  ['锦标赛竞争 · 分布式算力', '以晋升锦标赛把发展动能分配给地方，竞争即母系统的生产力算力。'],
  ['语义防火墙 · 解释权主权', '垄断「文明/民主/公正」的定义权，构建认知层防御、降低维稳成本。'],
  ['磁盘碎片整理 · 反腐', '反腐既清理山头主义、也是对权力结构的周期性「碎片整理」，重收确定性。'],
];

// 权力三定律：系统化表述 + 历史注脚
const THREE_LAWS = [
  { num: '第一定律', title: '权力守恒 · 转移不灭', accent: '#c41e3a',
    body: '权力不会凭空消失，只会在主体间转移与变形：中央放掉的，地方接走；正式制度退出的，非正式网络填补。任何「去权力化」叙事，物理上等价于权力换了载体。',
    note: '历史注脚：东汉削弱外戚则宦官起，唐削藩镇则牙兵自立节度——真空从不存在，只有再分配。' },
  { num: '第二定律', title: '控制成本随距离/层级递增', accent: '#e8a317',
    body: '控制力随空间距离与科层层级指数衰减，而维持同等控制的成本指数上升。每多一级代理，就多一层信息失真与激励偏移——「天高皇帝远」是衰减函数，不是修辞。',
    note: '历史注脚：明代驿递一道奏折往返云南数月，皇权到县已是「与士绅共治」；郡县制本质是用官僚密度对冲衰减。' },
  { num: '第三定律', title: '高压系统的反弹势能积累', accent: '#8b5cf6',
    body: '压强不会消灭张力，只会把动能转为势能储存。控制强度越高、持续越久，系统内积累的反弹势能越大；释放往往不是线性泄压，而是相变式崩解。',
    note: '历史注脚：秦法密于凝脂，戍卒一呼而七庙隳——二世而亡不是偶然，是势能方程的解。' },
];

// 历史政权案例：控制强度/统治成本/合法性/系统活力/存续（年）
const REGIMES = {
  qin: { label: '秦 · 高压短命', accent: '#c41e3a', control: 95, cost: 90, legit: 35, vitality: 30, span: 15,
    verdict: '控制强度逼近物理极限，统治成本吞噬产出，合法性账户透支——净确定性为负，势能在十五年内一次性释放。过控临界点的标本。' },
  han: { label: '汉 · 儒法相济', accent: '#e8a317', control: 60, cost: 45, legit: 75, vitality: 65, span: 407,
    verdict: '外儒内法：用意识形态合法性替代部分强制成本，把统治成本会计从「强制项」转记到「合法性项」——单位确定性的价格大幅下降，系统存续拉长一个数量级。' },
  tang: { label: '唐 · 开放盛世', accent: '#10b981', control: 50, cost: 40, legit: 80, vitality: 90, span: 289,
    verdict: '控制强度主动让渡换取系统活力峰值：开放科举、胡汉并用、藩镇分权。代价是衰减常数失守——安史之后，力场半径收缩回关中。开放红利与控制风险的同一枚硬币。' },
  mingqing: { label: '明清 · 内卷收缩', accent: '#64748b', control: 80, cost: 65, legit: 60, vitality: 40, span: 543,
    verdict: '以海禁、文字狱、密折制把控制强度推高，换取超长存续——但活力被锁死，确定性以「停滞」形式实现。低熵≠繁荣：这是用降低系统温度换取的秩序。' },
  reform: { label: '改革开放 · 放权增长', accent: '#22d3ee', control: 55, cost: 35, legit: 80, vitality: 88, span: 47,
    verdict: '主动下调控制强度（放权让利、双轨制），用绩效合法性回填——统治成本/产出比降至历史低位。证明力场方程存在「少控多得」区间：控制不是越多越好，是越准越好。' },
};

// 控制技术演进：每代技术改变力场衰减常数 λ（越小衰减越慢）
const TECH_STAGES = [
  { period: '先秦—汉', title: '烽火驿站', accent: '#64748b', lambda: 0.55, desc: '信息以马速传播，控制半径数百里。皇权止于郡治，县以下靠豪强与宗族代理——衰减常数最大，「天高皇帝远」是硬约束。' },
  { period: '隋唐—清', title: '科举官僚', accent: '#e8a317', lambda: 0.40, desc: '科举把全国精英纳入同一激励回路：不传输命令，传输「想当官的人」。意识形态预装降低每层失真——用人的标准化部分对冲了空间衰减。' },
  { period: '晚清—民国', title: '电报铁路', accent: '#fb923c', lambda: 0.28, desc: '信息传播首次与马速脱钩：电报让边疆事变次日达于中枢，铁路让兵力投送以日计。衰减常数断崖式下降，但硬件先于组织——有穿透无整合。' },
  { period: '1949—1990s', title: '广播组织', accent: '#8b5cf6', lambda: 0.18, desc: '单位制+广播体系：组织毛细血管下沉到车间与生产队，意志首次直达个人。衰减被组织密度强行压平——代价是全社会刚性化、摩擦无处缓冲。' },
  { period: '2000s—今', title: '数字实时', accent: '#22d3ee', lambda: 0.08, desc: '数据实时回传、政令实时下达：衰减常数趋近于零，「天高皇帝远」在物理上被消灭。新问题随之而来——穿透的边际成本归零后，过控临界点比任何时代都更容易越过。' },
];

const LEVELS = ['中枢', '省', '市', '县', '乡镇', '村/社区', '个体'];

// 统治成本模拟器核心：给定控制强度 c(0-100)，返回 {cost, rebound, gross, net}
function simulate(c) {
  const cost = Math.round(8 + c * 0.5 + 42 * Math.exp((c - 72) / 11)); // 过 72 后指数爆炸
  const rebound = Math.round(100 * Math.pow(c / 100, 3)); // 势能 ∝ 压强³
  const gross = Math.round(100 * (1 - Math.exp(-c / 35))); // 确定性边际递减
  const net = Math.round(gross - rebound * 0.45 - Math.max(0, cost - 60) * 0.35);
  return { cost: Math.min(300, cost), rebound, gross, net };
}

export default function Page() {
  const [p, setP] = useState({ ...PRESETS.stable });
  const [ctrl, setCtrl] = useState(58); // 统治成本模拟器：控制强度
  const [regimeKey, setRegimeKey] = useState('qin');
  const [techIdx, setTechIdx] = useState(4);

  // —— 原力场模型（保留） ——
  const eff = useMemo(() => Math.max(0, Math.min(100, Math.round(p.coercion * 0.3 + p.legit * 0.4 + p.penetration * 0.3 - p.friction * 0.5))), [p]);
  const cost = useMemo(() => Math.round((p.friction / Math.max(20, eff)) * 100), [p, eff]);
  const certainty = useMemo(() => Math.round((p.penetration * p.legit) / 100), [p]);

  // —— 统治成本模拟器 ——
  const sim = useMemo(() => simulate(ctrl), [ctrl]);
  const simCurves = useMemo(() => {
    const xs = []; const costs = []; const rebounds = []; const nets = [];
    let peakX = 0; let peakNet = -Infinity;
    for (let c = 0; c <= 100; c += 2) {
      const s = simulate(c);
      xs.push(c); costs.push(s.cost); rebounds.push(s.rebound); nets.push(s.net);
      if (s.net > peakNet) { peakNet = s.net; peakX = c; }
    }
    return { xs, costs, rebounds, nets, peakX, peakNet };
  }, []);
  const overCritical = ctrl > simCurves.peakX;

  const simOpt = useMemo(() => ({
    tooltip: { trigger: 'axis' },
    legend: { textStyle: { color: LABEL.color, fontSize: 10 }, top: 0, itemWidth: 12 },
    grid: { ...GRID, top: 28 },
    xAxis: categoryX(simCurves.xs, { interval: 9 }),
    yAxis: valueY(),
    series: [
      { name: '统治成本', type: 'line', smooth: true, symbol: 'none', data: simCurves.costs, lineStyle: { color: '#e8a317', width: 2 } },
      { name: '反弹势能', type: 'line', smooth: true, symbol: 'none', data: simCurves.rebounds, lineStyle: { color: '#8b5cf6', width: 2 } },
      { name: '净确定性', type: 'line', smooth: true, symbol: 'none', data: simCurves.nets, lineStyle: { color: '#10b981', width: 2.5 }, areaStyle: { color: 'rgba(16,185,129,0.08)' },
        markLine: { silent: true, symbol: 'none', label: { color: LABEL.color, fontSize: 10 },
          data: [
            { xAxis: String(simCurves.peakX), label: { formatter: `临界点 ${simCurves.peakX}` }, lineStyle: { color: '#c41e3a', type: 'dashed' } },
            { xAxis: String(Math.round(ctrl / 2) * 2), label: { formatter: `当前 ${ctrl}` }, lineStyle: { color: '#22d3ee', type: 'solid' } },
          ] } },
    ],
  }), [simCurves, ctrl]);

  // —— 历史政权案例 ——
  const regime = REGIMES[regimeKey];
  const regimeRadar = useMemo(() => radarOpt(
    ['控制强度', '统治成本', '合法性', '系统活力'],
    [regime.control, regime.cost, regime.legit, regime.vitality],
    { name: regime.label, color: regime.accent }
  ), [regime]);
  const spanOpt = useMemo(() => ({
    tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
    grid: { left: 96, right: 32, top: 16, bottom: 24 },
    xAxis: logY({ name: '存续(年,对数)', nameTextStyle: { color: '#5b6a82', fontSize: 10 } }),
    yAxis: categoryX(Object.values(REGIMES).map((r) => r.label.split(' ')[0])),
    series: [{ type: 'bar', barWidth: 12, data: Object.entries(REGIMES).map(([k, r]) => ({ value: r.span, itemStyle: { color: k === regimeKey ? r.accent : 'rgba(100,116,139,0.45)' } })), label: { show: true, position: 'right', color: LABEL.color, fontSize: 10, formatter: '{c} 年' } }],
  }), [regimeKey]);

  // —— 力场空间衰减：P(d) = 100·e^(−λd)，λ 由控制技术决定 ——
  const decayOpt = useMemo(() => ({
    tooltip: { trigger: 'axis' },
    legend: { textStyle: { color: LABEL.color, fontSize: 10 }, top: 0, itemWidth: 12, type: 'scroll' },
    grid: { ...GRID, top: 28 },
    xAxis: categoryX(LEVELS),
    yAxis: valueY({ max: 100 }),
    series: TECH_STAGES.map((t, i) => ({
      name: t.title, type: 'line', smooth: true,
      symbol: i === techIdx ? 'circle' : 'none', symbolSize: 7,
      data: LEVELS.map((_, d) => Math.round(100 * Math.exp(-t.lambda * d))),
      lineStyle: { color: t.accent, width: i === techIdx ? 3 : 1, opacity: i === techIdx ? 1 : 0.35 },
      itemStyle: { color: t.accent },
      areaStyle: i === techIdx ? { color: 'rgba(34,211,238,0.07)' } : undefined,
    })),
  }), [techIdx]);
  const villageReach = Math.round(100 * Math.exp(-TECH_STAGES[techIdx].lambda * 5));

  // —— 控制-活力散点 ——
  const scatterOpt = useMemo(() => ({
    tooltip: { trigger: 'item', formatter: (pt) => `${pt.data[3]}<br/>控制 ${pt.data[0]} · 活力 ${pt.data[1]} · 存续 ${pt.data[2]} 年` },
    grid: { left: 44, right: 24, top: 24, bottom: 36 },
    xAxis: valueY({ name: '控制强度 →', nameLocation: 'middle', nameGap: 24, nameTextStyle: { color: '#5b6a82', fontSize: 10 }, min: 20, max: 100 }),
    yAxis: valueY({ name: '系统活力', nameTextStyle: { color: '#5b6a82', fontSize: 10 }, min: 0, max: 100 }),
    series: [{
      type: 'scatter',
      symbolSize: (d) => 12 + Math.sqrt(d[2]) * 1.6, // 气泡 ∝ √存续
      data: Object.entries(REGIMES).map(([k, r]) => ({
        value: [r.control, r.vitality, r.span, r.label],
        itemStyle: { color: r.accent, opacity: k === regimeKey ? 0.95 : 0.45, borderColor: k === regimeKey ? '#e8edf6' : 'transparent', borderWidth: 1.5 },
        label: { show: true, position: 'top', color: LABEL.color, fontSize: 10, formatter: r.label.split(' ')[0] },
      })),
      markLine: { silent: true, symbol: 'none', lineStyle: { color: 'rgba(196,30,58,0.5)', type: 'dashed' }, label: { color: '#5b6a82', fontSize: 10, formatter: '过控警戒线' }, data: [{ xAxis: 75 }] },
    }],
  }), [regimeKey]);

  // —— 原力场雷达 + 仪表（保留） ——
  const radar = useMemo(() => ({
    radar: { indicator: [{ name: '强制力', max: 100 }, { name: '合法性', max: 100 }, { name: '信息穿透', max: 100 }, { name: '社会摩擦', max: 100 }], axisName: { color: LABEL.color }, splitLine: { lineStyle: { color: 'rgba(148,163,184,0.15)' } }, splitArea: { show: false } },
    series: [{ type: 'radar', data: [{ value: [p.coercion, p.legit, p.penetration, p.friction], name: '力场', lineStyle: { color: '#c41e3a' }, areaStyle: { color: 'rgba(196,30,58,0.14)' } }] }],
  }), [p]);
  const gauge = useMemo(() => ({
    series: [{ type: 'gauge', min: 0, max: 100, progress: { show: true, width: 14, itemStyle: { color: eff > 70 ? '#10b981' : eff > 45 ? '#e8a317' : '#c41e3a' } },
      axisLine: { lineStyle: { width: 14, color: [[1, '#1a2333']] } }, axisLabel: { color: '#5b6a82', fontSize: 10 }, axisTick: { show: false }, splitLine: { show: false },
      pointer: { itemStyle: { color: LABEL.color } }, detail: { valueAnimation: true, color: '#e8edf6', fontSize: 28, offsetCenter: [0, '40%'] }, data: [{ value: eff }] }],
  }), [eff]);

  const Slider = ({ k, label }) => (
    <div className="mb-2">
      <div className="flex justify-between text-xs mb-1"><span style={{ color: 'var(--text-secondary)' }}>{label}</span><span className="mono" style={{ color: 'var(--cyber-cyan)' }}>{p[k]}</span></div>
      <input type="range" min="0" max="100" value={p[k]} onChange={(e) => setP({ ...p, [k]: Number(e.target.value) })} style={{ width: '100%', accentColor: '#c41e3a' }} />
    </div>
  );

  return (
    <div>
      <PageHeader badge="Cognition · 权力物理学" title="权力物理学 · 把权力当作力场来计算"
        subtitle="有效权力 = 强制力 · 合法性 · 信息穿透 − 社会摩擦 —— 调参看系统确定性与统治成本如何变化" />
      <IntroCard>
        权力物理学是本项目的冷峻内核：把权力运行从道德叙事中剥离，当作<strong style={{ color: 'var(--text-primary)' }}>可计算的力场</strong>——强制力提供下限、合法性降低维稳成本、信息穿透决定意志直达末梢的效率，三者对冲社会摩擦。系统的终极偏好是<strong style={{ color: 'var(--text-primary)' }}>「确定性」</strong>。但确定性有价格：控制强度越过临界点后，统治成本指数上升、反弹势能立方积累——净确定性不升反降。本页提供两台模拟器与五个历史样本，把这条曲线画给你看。
      </IntroCard>
      <Grid cols={4} className="mb-6">
        <Stat value="3+2" label="理论模块：三定律 + 双模拟器" accent="#c41e3a" />
        <Stat value="5" label="历史政权力学样本" accent="#e8a317" />
        <Stat value="7" label="可调模拟参数" accent="#22d3ee" />
        <Stat value={simCurves.peakX} label="过控临界点（净确定性峰值）" accent="#10b981" />
      </Grid>

      {/* ① 权力三定律 */}
      <Card title="权力三定律 · 系统化表述" className="mb-6">
        <Grid cols={3}>
          {THREE_LAWS.map((l) => (
            <div key={l.num} style={{ borderLeft: `2px solid ${l.accent}`, paddingLeft: 12 }}>
              <div className="text-[11px] mono mb-1" style={{ color: l.accent }}>{l.num}</div>
              <div className="text-sm font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>{l.title}</div>
              <p className="text-xs leading-relaxed mb-2" style={{ color: 'var(--text-secondary)' }}>{l.body}</p>
              <p className="text-[11px] leading-relaxed" style={{ color: 'var(--text-tertiary)' }}>{l.note}</p>
            </div>
          ))}
        </Grid>
      </Card>

      {/* ② 统治成本模拟器 */}
      <Card title="统治成本模拟器 · 控制强度的边际账本" className="mb-6">
        <Grid cols={2}>
          <div>
            <div className="flex justify-between text-xs mb-1">
              <span style={{ color: 'var(--text-secondary)' }}>控制强度 Control Intensity</span>
              <span className="mono" style={{ color: overCritical ? '#c41e3a' : '#22d3ee' }}>{ctrl}{overCritical ? ' · 已越过临界点' : ''}</span>
            </div>
            <input type="range" min="0" max="100" value={ctrl} onChange={(e) => setCtrl(Number(e.target.value))} style={{ width: '100%', accentColor: '#c41e3a' }} />
            <Grid cols={2} className="mt-3">
              <Stat value={sim.cost} label="统治成本（强制+监督）" accent="#e8a317" />
              <Stat value={sim.rebound} label="反弹势能（∝ 压强³）" accent="#8b5cf6" />
              <Stat value={sim.gross} label="毛确定性（边际递减）" accent="#22d3ee" />
              <Stat value={sim.net} label="净确定性 = 毛 − 势能 − 超额成本" accent={sim.net >= simCurves.peakNet - 5 ? '#10b981' : '#c41e3a'} />
            </Grid>
            <p className="text-[11px] mt-3 leading-relaxed" style={{ color: 'var(--text-tertiary)' }}>
              判读：毛确定性随控制强度边际递减（先易后难），统治成本在 ~72 后指数爆炸（监督监督者问题），反弹势能按压强立方积累。三者叠加，净确定性在 <span className="mono" style={{ color: '#10b981' }}>{simCurves.peakX}</span> 附近见顶——继续加压，买到的不是秩序，是更贵的脆弱。秦在 95，改革开放在 55。
            </p>
          </div>
          <EChart option={simOpt} style={{ height: 280 }} />
        </Grid>
      </Card>

      {/* ③ 历史政权案例选择器 */}
      <Card title="历史政权力学画像 · 五个样本" className="mb-6">
        <SelectorBar items={Object.entries(REGIMES).map(([key, r]) => ({ key, label: r.label, accent: r.accent }))} activeKey={regimeKey} onSelect={setRegimeKey} />
        <Grid cols={2}>
          <EChart option={regimeRadar} style={{ height: 230 }} />
          <EChart option={spanOpt} style={{ height: 230 }} />
        </Grid>
        <div className="os-card p-4 mt-4" style={{ background: 'var(--bg-elevated)', borderLeft: `3px solid ${regime.accent}` }}>
          <div className="text-xs mono mb-1" style={{ color: regime.accent }}>权力物理判读 · {regime.label}（存续 {regime.span} 年）</div>
          <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{regime.verdict}</p>
        </div>
      </Card>

      {/* ④⑤ 控制-活力散点 + 力场衰减 */}
      <Grid cols={2} className="mb-6">
        <Card title="控制-活力权衡平面 · 气泡 ∝ √存续">
          <EChart option={scatterOpt} style={{ height: 260 }} />
          <p className="text-[11px] mt-2 leading-relaxed" style={{ color: 'var(--text-tertiary)' }}>
            高控制低活力（秦/明清）与低控制高活力（唐/改革开放）构成权衡前沿；汉居中庸位。注意：长存续出现在中等控制带，而非控制极值——秩序的最优解在内点，不在边界。
          </p>
        </Card>
        <Card title="力场空间衰减 · P(d)=100·e^(−λd)">
          <EChart option={decayOpt} style={{ height: 260 }} />
          <p className="text-[11px] mt-2 leading-relaxed" style={{ color: 'var(--text-tertiary)' }}>
            当前选中 <span className="mono" style={{ color: TECH_STAGES[techIdx].accent }}>{TECH_STAGES[techIdx].title}（λ={TECH_STAGES[techIdx].lambda}）</span>：中枢意志抵达村/社区一级时剩余 <span className="mono" style={{ color: '#22d3ee' }}>{villageReach}%</span>。从烽火到数字，五代控制技术做的是同一件事——压低 λ。
          </p>
        </Card>
      </Grid>

      {/* ⑥ 控制技术演进时间线 */}
      <Card title="控制技术演进 · 谁在改写衰减常数 λ" className="mb-6">
        <TimelineBar stages={TECH_STAGES} activeIdx={techIdx} onSelect={setTechIdx} />
      </Card>

      {/* 原力场调参模拟器（保留） */}
      <Grid cols={3} className="mb-6">
        <Stat value={eff} label="有效权力指数（实时）" accent={eff > 70 ? '#10b981' : eff > 45 ? '#e8a317' : '#c41e3a'} />
        <Stat value={certainty} label="确定性指数（穿透×合法）" accent="#22d3ee" />
        <Stat value={cost + '%'} label="相对统治成本" accent="#e8a317" />
      </Grid>
      <Grid cols={2} className="mb-6">
        <Card title="力场参数 · 拖动调参（或选预设态）">
          <SelectorBar items={Object.entries(PRESETS).map(([key, v]) => ({ key, label: v.label }))} activeKey={Object.entries(PRESETS).find(([, v]) => v.coercion === p.coercion && v.legit === p.legit)?.[0] || 'stable'} onSelect={(key) => setP({ ...PRESETS[key] })} />
          <Slider k="coercion" label="强制力 Coercion" />
          <Slider k="legit" label="合法性 Legitimacy" />
          <Slider k="penetration" label="信息穿透 Penetration" />
          <Slider k="friction" label="社会摩擦 Friction" />
          <p className="text-[11px] mt-2" style={{ color: 'var(--text-tertiary)' }}>提示：摩擦每升 10，有效权力降 5、统治成本陡增——这就是为什么体制极度厌恶不确定性。</p>
        </Card>
        <Card title="力场画像 + 有效权力表">
          <EChart option={radar} style={{ height: 180 }} />
          <EChart option={gauge} style={{ height: 150 }} />
        </Card>
      </Grid>

      <Card title="权力物理学四定律 · 项目签名隐喻" className="mb-6">
        <Grid cols={2}>
          {LAWS_SIGNATURE.map(([t, d]) => (
            <div key={t} style={{ borderLeft: '2px solid var(--china-red)', paddingLeft: 10 }}>
              <div className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>{t}</div>
              <p className="text-xs mt-1 leading-relaxed" style={{ color: 'var(--text-tertiary)' }}>{d}</p>
            </div>
          ))}
        </Grid>
      </Card>

      <Card title="用法 · 与各模块的接口" className="mb-6">
        <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
          权力物理学是<span className="mono" style={{ color: 'var(--cyber-cyan)' }}>权力逻辑 / 政府体系 / 治理现代化 / 治国沙盒</span>的抽象底层：压力型体制是「摩擦传导」，数字利维坦是「穿透拉满」，反腐是「碎片整理」，人才配置是「在给定力场下求最优解」。调参即在脑中预演不同治理态的代价。
        </p>
      </Card>

      <FrameworkTrio cards={[
        { title: '力场模型', subtitle: '权力 = 场 · 随距离衰减', body: '权力不是实体而是场：强度由源点输出（强制/合法性/穿透）决定，随空间距离与科层层级按 e^(−λd) 衰减。控制技术史就是一部压低 λ 的工程史。',
          pillars: [['场强', '三要素合成的有效权力'], ['衰减', 'λ 由通信/组织技术决定'], ['半径', '场强降至阈值前的有效疆域']] },
        { title: '统治成本会计', subtitle: '强制 / 监督 / 合法性 三种货币', body: '同一单位的确定性可以用三种成本购买：强制最贵且激发摩擦，监督随层级指数增长（谁来监督监督者），合法性最便宜但充值最慢。高明的系统不断把账目从前两项转记到第三项。',
          pillars: [['强制成本', '即时见效，按³计息'], ['监督成本', '随层级指数增长'], ['合法性成本', '慢充值、低利率']] },
        { title: '反弹动力学', subtitle: '压强 → 势能 → 释放', body: '高压不消灭张力，只改变其形态：动能被压成势能储存于系统内部。势能积累不可见、释放呈相变——这是高压系统「看起来最稳的时刻恰是最脆的时刻」的物理学解释。',
          pillars: [['积累', '势能 ∝ 压强³ × 时长'], ['遮蔽', '高压同时压制了预警信号'], ['释放', '非线性相变而非缓慢泄压']] },
      ]} />
      <ModuleFooter moduleId="powerphysics" disclaimer="思想工具 / 分析框架：模拟参数与历史评分均为示意性建模，非历史决定论，亦非对任何现实政体的预测 · 公开资料整理，仅供分析参考" />
    </div>
  );
}
