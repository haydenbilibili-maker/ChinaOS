import React, { useState, useMemo } from 'react';
import { PageHeader, Card, Grid, Stat } from '../../app/ui.jsx';
import EChart from '../../lib/viz/EChart.jsx';
import { categoryX, valueY, logY, GRID, donutOpt, radarOpt, stackedBarOpt, AXIS, LABEL } from '../shared/chartHelpers.js';
import { IntroCard, SelectorBar, TimelineBar, FrameworkTrio, ModuleFooter } from '../shared/ModuleParadigm.jsx';

// ============================================================================
// 认知内核 · 路径依赖与锁定（Path Dependence · David / Arthur）
// ----------------------------------------------------------------------------
// 偶然小事件经报酬递增（学习/网络/协调/适应性预期）被放大并锁定，未必最优。
// 关键节点 → 自我强化 → 锁定 → 解锁需窗口期内的冲击或边缘突破。
// 交互：Polya 壶式锁定模拟器 / 经典案例选择器 / 关键节点时间线 / 换道成本曲线。
// ============================================================================

// —— 确定性伪随机（mulberry32）：同一种子可复现「同一段历史」 ——
function mulberry32(seed) {
  let a = seed >>> 0;
  return () => {
    a |= 0; a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// —— Polya 壶式两技术竞争：B 内在质量更优（55:45），但 A 可能靠偶然领先 + 报酬递增锁定 ——
function simulateLockIn(strength, seed) {
  const rand = mulberry32(seed);
  const T = 60; const w = strength / 100; // w=报酬递增权重
  const qualA = 0.45, qualB = 0.55; // B 是「更优技术」
  let nA = 1, nB = 1; const shareA = [], shareB = [];
  for (let i = 0; i < T; i++) {
    const sA = nA / (nA + nB);
    const pA = (1 - w) * qualA + w * sA; // 低强度→质量主导；高强度→存量主导
    if (rand() < pA) nA++; else nB++;
    shareA.push(Math.round((nA / (nA + nB)) * 1000) / 10);
    shareB.push(Math.round((nB / (nA + nB)) * 1000) / 10);
  }
  const lockIdx = shareA.findIndex((v) => v >= 80 || v <= 20);
  const winner = shareA[T - 1] >= 50 ? 'A（劣者）' : 'B（优者）';
  return { shareA, shareB, lockIdx, winner, inferiorWins: shareA[T - 1] >= 50 };
}

// —— 经典锁定案例库 ——
const CASES = [
  { key: 'qwerty', label: 'QWERTY 键盘', accent: '#22d3ee', status: '锁定至今 · 150 年',
    mech: '打字员培训（学习效应）+ 厂商兼容（协调效应）：1873 年为防卡键的次优布局，借早期打字学校批量产出技能存量，Dvorak 等更优布局再无翻盘窗口。',
    cost: '全球数十亿人的肌肉记忆 + 全部硬软件生态 —— 转换成本随用户基数线性放大。',
    exit: '未解锁。语音/触屏输入是「绕开」而非「替换」—— 边缘突破让锁定问题失去意义。' },
  { key: 'vhs', label: 'VHS vs Beta', accent: '#10b981', status: '1988 年 Beta 退场',
    mech: '内容协调效应：VHS 录制时长更长 + 开放授权拉拢厂商与租赁店，片源越多→买家越多→片源更多，画质更优的 Betamax 被正反馈甩出。',
    cost: '消费者持有的播放设备与录像带存量；租赁店的库存承诺。',
    exit: '已解锁——但靠的是 DVD 整体换代（外部技术冲击把双方一起清零），而非 Beta 反攻。' },
  { key: 'carbon', label: '碳基能源体系', accent: '#e8a317', status: '解锁进行时',
    mech: '大规模固定成本之王：电网/管网/炼化/内燃机产业链百年沉淀，设备折旧周期 30-50 年，配套就业与财税深度绑定。',
    cost: '全球数百万亿美元存量资产 + 产油国与能源利益集团的政治阻力。',
    exit: '双碳 = 政策外部冲击 + 光伏风电成本曲线（学习率 ~20%）跌破临界点，新路径自身开始报酬递增。' },
  { key: 'keju', label: '科举制度', accent: '#c41e3a', status: '锁定约 1300 年',
    mech: '适应性预期的极致：全社会人力资本投向八股 —— 因为预期它是唯一上升通道，预期自我实现；士绅阶层（受益者）同时是制度维护者。',
    cost: '废科举=作废千万读书人的终身投资，动摇王朝合法性根基 —— 转换成本即政权稳定本身。',
    exit: '1905 年废止 —— 但靠的是甲午/庚子的外部冲击把旧路径的报酬直接打穿，属「休克替代」，代价是士绅离心。' },
  { key: 'land', label: '土地财政', accent: '#8b5cf6', status: '当代锁定 · 换道中',
    mech: '1994 分税制 + 2003 招拍挂确立的自我强化环：卖地→基建→地价升→再卖地；地方债务、银行抵押、居民财富全部押注同一资产。',
    cost: '换道=同时重写央地财税契约、化解隐性债务、承接居民财富预期 —— 三重转换成本叠加。',
    exit: '房产税/转移支付改革是「双轨并行」式试探：旧轨未敢拆、新轨尚未递增，正处最昂贵的换道窗口。' },
  { key: 'cuda', label: 'CUDA 生态', accent: '#f97316', status: '锁定进行时',
    mech: '学习效应 + 协调效应的当代样本：15 年开发者工具链沉淀，框架/论文/人才全部默认 CUDA，每篇新论文都在为护城河添砖。',
    cost: '迁移=重写算子库 + 重训工程师 + 容忍生态空窗 —— 对追赶者是「在别人的递增曲线上爬坡」。',
    exit: '解锁路径只剩边缘突破：抓住新计算范式（推理芯片/存算一体）的关键节点，在 CUDA 未覆盖处先建临界规模。' },
];

// —— Arthur 四种自我强化机制 ——
const FORCES = [
  ['大规模固定成本', '产量越大单位成本越低，先行者借规模筑壁垒。', '案例：电网/高铁/晶圆厂 —— 碳基能源体系百年难拆的根源。', '#c41e3a'],
  ['学习效应', '用得越多越熟练，经验沿既有路径累积、改良只发生在轨道内。', '案例：QWERTY 打字技能、CUDA 工程师存量、八股文应试技艺。', '#e8a317'],
  ['协调效应', '与他人选同一方案才省事 —— 配套、标准、上下游互相绑定。', '案例：VHS 片源生态、美元结算网络、安卓应用商店。', '#22d3ee'],
  ['适应性预期', '人们预期某方案将胜出便提前倒向它，预期自我实现。', '案例：科举千年人力资本投向、房价「永涨」信仰、技术标准之争中的站队。', '#10b981'],
];

// —— 关键节点时间线：每个分岔点锁定了什么 ——
const JUNCTURES = [
  { period: '1978', title: '改革开放', accent: '#c41e3a',
    desc: '锁定「以经济建设为中心」的国家目标函数与对外开放的基本盘 —— 后续一切政策辩论都在这条轨道内进行，回头成本随每年增长复利上升。' },
  { period: '1994', title: '分税制', accent: '#e8a317',
    desc: '锁定央地财政契约：财权上收、事权留地 —— 地方被迫开辟预算外财源，为土地财政这条次生路径埋下分岔种子。' },
  { period: '2001', title: '入世 WTO', accent: '#22d3ee',
    desc: '锁定「世界工厂」分工位置与出口导向增长模式：沿海产业集群、农民工流动、外储积累全部沿此轨道自我强化二十年。' },
  { period: '2008', title: '四万亿', accent: '#8b5cf6',
    desc: '锁定基建—地产—信贷的逆周期工具箱：每次下行都重启同一药方，剂量递增、药效递减 —— 工具本身被路径依赖捕获。' },
  { period: '2020s', title: '双碳 / 自主', accent: '#10b981',
    desc: '主动制造新的关键节点：在新能源与半导体两条新路径上抢在他人锁定前投入临界规模 —— 用国家力量对冲旧路径的报酬递增。' },
];

// —— 解锁策略库 ——
const UNLOCKS = [
  ['休克替代', '一次性拆除旧轨、强制切换。速度快但承担全部转换成本与反弹风险。', '废科举（1905）/ 苏东休克疗法 —— 成败取决于新轨能否立刻接住存量预期。', '#c41e3a'],
  ['双轨并行', '旧轨照旧、新轨试点，待新轨报酬递增后自然吸走存量 —— 把转换成本摊薄到时间里。', '价格双轨制 / 经济特区：中国改革的经典解锁术，用增量绕过存量利益集团。', '#e8a317'],
  ['边缘突破', '不在旧轨上正面竞争，在旧锁定未覆盖的新场景先建临界规模、反向包抄。', '移动支付绕开信用卡 / 新能源车绕开内燃机专利墙 / 推理芯片绕开 CUDA。', '#22d3ee'],
  ['外部冲击', '战争、危机、技术革命把旧路径报酬强行打穿，锁定瞬间失效 —— 不可设计、只可利用。', '甲午之于科举 / DVD 之于录像带战争 —— 智者的功课是在冲击来临时备好新轨。', '#10b981'],
];

// —— 制度锁定 vs 技术锁定对照 ——
const CONTRAST_DIMS = ['解锁难度', '利益集团阻力', '退出成本', '可试点性(逆)', '冲击依赖度'];
const CONTRAST_INST = [90, 92, 88, 75, 85];
const CONTRAST_TECH = [62, 55, 70, 35, 45];

// —— 换道成本：锁定每多一期，转换成本指数上升；窗口期内成本尚平 ——
function buildSwitchCost() {
  const x = Array.from({ length: 16 }, (_, i) => `T${i}`);
  const cost = x.map((_, i) => Math.round(8 * Math.exp(i * 0.32)));
  const benefit = x.map(() => 100); // 换道收益近似恒定 → 成本曲线穿越点即最后窗口
  return { x, cost, benefit };
}

export default function Page() {
  const [strength, setStrength] = useState(70); // 报酬递增强度
  const [seed, setSeed] = useState(42);          // 历史的偶然
  const [caseKey, setCaseKey] = useState('qwerty');
  const [junctureIdx, setJunctureIdx] = useState(0);

  const sim = useMemo(() => simulateLockIn(strength, seed), [strength, seed]);
  const { x: cx, cost, benefit } = useMemo(buildSwitchCost, []);
  const activeCase = CASES.find((c) => c.key === caseKey);

  // —— 图1：Polya 壶两技术竞争 ——
  const simOpt = {
    legend: { data: ['技术A（质量较劣）', '技术B（质量较优）'], top: 0, textStyle: { color: LABEL.color, fontSize: 10 } },
    tooltip: { trigger: 'axis' },
    grid: { ...GRID, top: 30 },
    xAxis: categoryX(Array.from({ length: 60 }, (_, i) => i + 1), { interval: 9 }),
    yAxis: valueY({ max: 100, name: '市场份额 %', nameTextStyle: { color: LABEL.color, fontSize: 10 } }),
    series: [
      { name: '技术A（质量较劣）', type: 'line', smooth: true, symbol: 'none', data: sim.shareA,
        lineStyle: { color: '#c41e3a', width: 2 }, itemStyle: { color: '#c41e3a' }, areaStyle: { color: 'rgba(196,30,58,0.07)' },
        markLine: sim.lockIdx >= 0 ? { silent: true, symbol: 'none', data: [{ xAxis: sim.lockIdx, label: { formatter: '锁定点', color: '#e8a317', fontSize: 10 }, lineStyle: { color: '#e8a317', type: 'dashed' } }] } : undefined },
      { name: '技术B（质量较优）', type: 'line', smooth: true, symbol: 'none', data: sim.shareB,
        lineStyle: { color: '#22d3ee', width: 2 }, itemStyle: { color: '#22d3ee' } },
    ],
  };

  // —— 图2：换道成本指数曲线 ——
  const costOpt = {
    legend: { data: ['转换成本', '换道收益（近似恒定）'], top: 0, textStyle: { color: LABEL.color, fontSize: 10 } },
    tooltip: { trigger: 'axis' },
    grid: { ...GRID, top: 30, left: 44 },
    xAxis: categoryX(cx),
    yAxis: logY({ name: '成本（对数轴）', nameTextStyle: { color: LABEL.color, fontSize: 10 } }),
    series: [
      { name: '转换成本', type: 'line', smooth: true, symbol: 'none', data: cost,
        lineStyle: { color: '#c41e3a', width: 2 }, itemStyle: { color: '#c41e3a' }, areaStyle: { color: 'rgba(196,30,58,0.07)' },
        markArea: { silent: true, itemStyle: { color: 'rgba(16,185,129,0.08)' }, label: { show: true, formatter: '改革窗口期', color: '#10b981', fontSize: 10, position: 'insideTop' }, data: [[{ xAxis: 'T0' }, { xAxis: 'T8' }]] } },
      { name: '换道收益（近似恒定）', type: 'line', symbol: 'none', data: benefit,
        lineStyle: { color: '#10b981', width: 2, type: 'dashed' }, itemStyle: { color: '#10b981' } },
    ],
  };

  // —— 图3：制度 vs 技术锁定对照（分组 bar，非堆叠） ——
  const contrastOpt = {
    legend: { data: ['制度锁定', '技术锁定'], top: 0, textStyle: { color: LABEL.color, fontSize: 10 } },
    tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
    grid: { ...GRID, top: 30 },
    xAxis: categoryX(CONTRAST_DIMS),
    yAxis: valueY({ max: 100 }),
    series: [
      { name: '制度锁定', type: 'bar', barWidth: 16, data: CONTRAST_INST, itemStyle: { color: '#c41e3a', borderRadius: [3, 3, 0, 0] } },
      { name: '技术锁定', type: 'bar', barWidth: 16, data: CONTRAST_TECH, itemStyle: { color: '#22d3ee', borderRadius: [3, 3, 0, 0] } },
    ],
  };

  return (
    <div>
      <PageHeader badge="Cognition · 路径依赖" title="路径依赖与锁定 · 历史为何不可逆"
        subtitle="David / Arthur —— 偶然小事件经报酬递增被放大成不可逆锁定，未必最优；解锁要靠窗口期、双轨与边缘突破" />
      <IntroCard>
        路径依赖指：一个由<strong style={{ color: 'var(--text-primary)' }}>偶然小事件</strong>启动的选择，经报酬递增（increasing returns）不断自我强化，最终把系统<strong style={{ color: 'var(--text-primary)' }}>锁定（lock-in）</strong>在某条轨道上——即便存在更优方案也难以切换，史称「劣者可以胜出」。机制链条：<span className="mono" style={{ color: 'var(--cyber-cyan)' }}>关键节点 → 自我强化 → 锁定 → 窗口期解锁</span>。下方模拟器复现 Arthur 的 Polya 壶模型：质量更优的技术 B，在递增强度足够高时照样被偶然领先的 A 锁死。
      </IntroCard>

      <Grid cols={4} className="mb-6">
        <Stat value={sim.lockIdx >= 0 ? `第${sim.lockIdx + 1}期` : '未锁定'} label="模拟锁定时点（份额越过 80%）" accent="#e8a317" />
        <Stat value={sim.inferiorWins ? '劣者胜出' : '优者胜出'} label="本次模拟结局" accent={sim.inferiorWins ? '#c41e3a' : '#10b981'} />
        <Stat value="4 种" label="报酬递增机制（Arthur）" accent="#22d3ee" />
        <Stat value="T8" label="换道成本曲线的窗口期上限（示意）" accent="#10b981" />
      </Grid>

      {/* ① 锁定模拟器 */}
      <Grid cols={2} className="mb-6">
        <Card title="锁定模拟器 · Polya 壶两技术竞争">
          <div className="flex justify-between text-xs mb-1">
            <span style={{ color: 'var(--text-secondary)' }}>报酬递增强度（0=质量主导 → 100=存量主导）</span>
            <span className="mono" style={{ color: 'var(--cyber-cyan)' }}>{strength}</span>
          </div>
          <input type="range" min="0" max="100" value={strength} onChange={(e) => setStrength(Number(e.target.value))} style={{ width: '100%', accentColor: '#c41e3a' }} />
          <div className="flex items-center gap-2 mt-3">
            <button onClick={() => setSeed((s) => s + 1)} className="text-xs px-3 py-1.5 rounded mono"
              style={{ background: 'rgba(34,211,238,0.15)', color: 'var(--cyber-cyan)', border: '1px solid var(--cyber-cyan)', cursor: 'pointer' }}>重掷历史（换一段偶然）</button>
            <span className="text-[11px] mono" style={{ color: 'var(--text-tertiary)' }}>seed #{seed}</span>
          </div>
          <p className="text-sm leading-relaxed mt-3" style={{ color: 'var(--text-secondary)' }}>
            设定：技术 B 内在质量优于 A（55 : 45）。强度低时质量说话、B 几乎必胜；强度拉高后，谁先偶然领先谁就被正反馈放大——同一组参数下「重掷历史」可得不同赢家，<strong style={{ color: 'var(--china-red)' }}>结果由历史而非效率决定</strong>，这正是路径依赖区别于新古典均衡的核心。
          </p>
        </Card>
        <Card title="份额演化曲线 · 偶然如何变成必然">
          <EChart option={simOpt} style={{ height: 280 }} />
          <p className="text-[11px] mt-1" style={{ color: 'var(--text-tertiary)' }}>红线=质量较劣的技术 A，青线=较优的 B；黄虚线为锁定点（一方份额越过 80%）。强度 ≥70 时多数种子下出现「劣者胜出」。</p>
        </Card>
      </Grid>

      {/* ② 经典案例选择器 */}
      <Card title="经典锁定案例库 · 从打字机到 CUDA" className="mb-6">
        <SelectorBar items={CASES} activeKey={caseKey} onSelect={setCaseKey} />
        <div className="mt-4 p-4 rounded" style={{ background: 'var(--bg-elevated)', borderLeft: `3px solid ${activeCase.accent}` }}>
          <div className="flex items-baseline gap-2 mb-2">
            <span className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>{activeCase.label}</span>
            <span className="text-[11px] mono" style={{ color: activeCase.accent }}>{activeCase.status}</span>
          </div>
          <Grid cols={3}>
            <div>
              <div className="text-xs font-semibold mb-1" style={{ color: '#e8a317' }}>锁定机制</div>
              <p className="text-xs leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{activeCase.mech}</p>
            </div>
            <div>
              <div className="text-xs font-semibold mb-1" style={{ color: '#c41e3a' }}>转换成本</div>
              <p className="text-xs leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{activeCase.cost}</p>
            </div>
            <div>
              <div className="text-xs font-semibold mb-1" style={{ color: '#10b981' }}>解锁条件 / 结局</div>
              <p className="text-xs leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{activeCase.exit}</p>
            </div>
          </Grid>
        </div>
      </Card>

      {/* ③ Arthur 四机制 */}
      <Card title="报酬递增的四种机制 · 锁定的发动机（Arthur, 1989）" className="mb-6">
        <Grid cols={2}>
          {FORCES.map(([t, d, c, accent]) => (
            <div key={t} style={{ borderLeft: `2px solid ${accent}`, paddingLeft: 10 }}>
              <div className="text-sm font-semibold" style={{ color: accent }}>{t}</div>
              <p className="text-xs mt-1 leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{d}</p>
              <p className="text-[11px] mt-1 leading-relaxed" style={{ color: 'var(--text-tertiary)' }}>{c}</p>
            </div>
          ))}
        </Grid>
      </Card>

      {/* ④ 换道成本 + ⑥ 制度vs技术对照 */}
      <Grid cols={2} className="mb-6">
        <Card title="换道成本曲线 · 转换成本=历史的利息">
          <EChart option={costOpt} style={{ height: 280 }} />
          <p className="text-[11px] mt-1" style={{ color: 'var(--text-tertiary)' }}>锁定每多存续一期，配套投资与利益集团随之加厚，转换成本近似指数增长（对数轴上为直线）；绿色虚线为换道收益。两线交点之前是「早改革早便宜」的窗口期——错过后改革在算术上不再划算，只能等外部冲击重置账本。</p>
        </Card>
        <Card title="制度锁定 vs 技术锁定 · 解锁难度对照（示意评分）">
          <EChart option={contrastOpt} style={{ height: 280 }} />
          <p className="text-[11px] mt-1" style={{ color: 'var(--text-tertiary)' }}>制度锁定（科举/土地财政）全面难于技术锁定（QWERTY/CUDA）：利益集团就是制度本身、退出成本含政治合法性、且几乎无法局部试点——这正是中国改革偏爱「双轨制」的结构原因。</p>
        </Card>
      </Grid>

      {/* ⑤ 关键节点时间线 */}
      <Card title="关键节点（Critical Juncture）· 每个分岔点收窄了之后的选择集" className="mb-6">
        <TimelineBar stages={JUNCTURES} activeIdx={junctureIdx} onSelect={setJunctureIdx} />
        <p className="text-[11px] mt-3" style={{ color: 'var(--text-tertiary)' }}>关键节点理论（Collier & Collier）：分岔时刻的选择空间最大，节点过后报酬递增启动、可行选项迅速收窄——读懂时间线的关键不是看选了什么，而是看每次选择之后什么从此选不了了。</p>
      </Card>

      {/* ⑦ 解锁策略卡 */}
      <Card title="解锁策略库 · 四条出狱路径" className="mb-6">
        <Grid cols={2}>
          {UNLOCKS.map(([t, d, c, accent]) => (
            <div key={t} className="p-3 rounded" style={{ background: 'var(--bg-elevated)', borderLeft: `3px solid ${accent}` }}>
              <div className="text-sm font-semibold" style={{ color: accent }}>{t}</div>
              <p className="text-xs mt-1 leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{d}</p>
              <p className="text-[11px] mt-1 leading-relaxed" style={{ color: 'var(--text-tertiary)' }}>{c}</p>
            </div>
          ))}
        </Grid>
        <p className="text-sm leading-relaxed mt-4" style={{ color: 'var(--text-secondary)' }}>
          中国改革的招牌解锁术是<strong style={{ color: 'var(--text-primary)' }}>双轨并行</strong>：价格双轨制、经济特区、增量股改——都不正面拆旧轨，而是让新轨先在边缘完成报酬递增，再回头吸收存量。它把休克替代的一次性成本，置换成可控的长期摩擦（呼应改革开放模块的「摸石头」方法论）。
        </p>
      </Card>

      <FrameworkTrio cards={[
        { key: 'salt', title: '报酬递增', subtitle: 'increasing returns', body: '正反馈把偶然放大成必然：四种机制（固定成本/学习/协调/预期）任一启动，历史便开始复利。' },
        { key: 'stone', title: '锁定经济学', subtitle: 'lock-in & switching cost', body: '转换成本=历史的利息，随锁定时间指数累积；制度锁定比技术锁定多一重政治合法性成本。' },
        { key: 'path', title: '换道时机', subtitle: 'window & edge', body: '窗口期内早改革早便宜；窗口关闭后正面追赶不如边缘突破——在旧锁定未覆盖处先建临界规模。' },
      ]} />
      <ModuleFooter moduleId="pathdependence" disclaimer="思想工具 / 分析框架 · 模拟与评分均为教学示意，非实证测算" />
    </div>
  );
}
