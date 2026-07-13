import React, { useState, useMemo } from 'react';
import { PageHeader, Card, Grid, Stat } from '../../app/ui.jsx';
import EChart from '../../lib/viz/EChart.jsx';
import { categoryX, valueY, logY, GRID, donutOpt, radarOpt, stackedBarOpt, AXIS, LABEL } from '../shared/chartHelpers.js';
import { IntroCard, SelectorBar, TimelineBar, FrameworkTrio, ModuleFooter } from '../shared/ModuleParadigm.jsx';

// ============================================================================
// 认知内核 · 耗散结构与熵（Dissipative Structure · Prigogine）
// ----------------------------------------------------------------------------
// 孤立系统熵增→无序（热二定律）；开放系统靠「负熵流」在远离平衡态自组织出有序。
// 思想工具页：开放度-熵流模拟器 + 三条件卡 + 系统案例 + 负熵结构 + 涨落相变 + 熵增监控接口。
// ============================================================================

const STEPS = 24;

// 四种命运区间：封闭熵死 / 临界涨落 / 有序窗口 / 过度开放失稳
const REGIMES = [
  ['封闭 · 熵增崩溃', '#c41e3a', '物质/能量/信息交换近乎为零，熵单调上升，结构走向死寂——孤立系统的宿命。'],
  ['临界 · 涨落放大', '#e8a317', '负熵流逼近临界点，微小涨落被放大，系统在有序与无序间剧烈摇摆（相变窗口）。'],
  ['远离平衡 · 有序窗口', '#10b981', '负熵流足以抵消熵增、又未冲垮结构本身——耗散结构的「创造性区间」，自发涌现稳定有序。'],
  ['过度开放 · 失稳震荡', '#7c3aed', '负熵流远超系统的消化吸收能力，外部涨落直接穿透内部结构——有序被冲刷成湍流。'],
];

// 耗散结构三条件 + 社会系统对应物
const CONDITIONS = [
  ['开放系统', '与环境持续交换物质 / 能量 / 信息', '国门、市场、互联网、人才流动——封闭组织只剩内部摩擦生熵。', '#22d3ee'],
  ['远离平衡', '被持续推离热力学平衡的死寂态', '竞争压力、增长目标、危机倒逼——「舒适均衡」恰是熵死的前夜。', '#e8a317'],
  ['非线性涨落放大', '微小扰动经正反馈放大成新宏观结构', '小岗村按手印、深圳试验田——局部试点被制度正反馈放大为全局秩序。', '#10b981'],
];

// 系统案例：开放度 / 负熵来源 / 熵积累点 / 系统命运 + 五维评分（用于雷达）
const CASES = [
  {
    key: 'plan', label: '计划经济（封闭趋熵死）', accent: '#c41e3a', openness: 12,
    negentropy: '苏联技术援助（156 项）一次性注入，此后近乎断流',
    entropyPoint: '价格信号失真 → 信息熵爆炸；激励钝化 → 组织熵积累',
    fate: '负熵断流后熵增不可逆：短缺、僵化、票证配给——典型的「准封闭系统滑向平衡死寂」。',
    radar: [12, 25, 18, 70, 15], // 开放度/负熵流入/有序度/熵积累/涨落容忍
  },
  {
    key: 'reform', label: '改革开放（打开负熵流）', accent: '#10b981', openness: 68,
    negentropy: '外资 + 技术引进 + 出口市场 + 制度学习 + 留学回流——五路负熵并进',
    entropyPoint: '双轨制寻租、区域分化——开放转型期的「局部熵积累」',
    fate: '系统性负熵工程：把濒临平衡死寂的结构推入远离平衡的自组织区间，四十年维持高有序。',
    radar: [68, 88, 80, 35, 75],
  },
  {
    key: 'haijin', label: '明清海禁（主动封闭）', accent: '#e8a317', openness: 18,
    negentropy: '朝贡贸易窄口径输入，民间海路被制度性掐断',
    entropyPoint: '技术停滞、信息隔绝——与同期大航海欧洲的负熵摄入差持续拉大',
    fate: '主动关闭负熵入口换取短期治安有序，长期支付「文明级熵债」——1840 年一次性清算。',
    radar: [18, 15, 45, 62, 20],
  },
  {
    key: 'valley', label: '硅谷创新区（高耗散高有序）', accent: '#22d3ee', openness: 88,
    negentropy: '全球人才虹吸 + 风险资本 + 大学知识溢出 + 高流动劳动市场',
    entropyPoint: '高淘汰率：~90% 创业死亡——熵以「企业死亡」形式快速排出系统',
    fate: '极高吞吐的耗散结构：大量吸入负熵、大量排出废熵，结构层面反而长期稳定有序。',
    radar: [88, 92, 85, 30, 90],
  },
  {
    key: 'invol', label: '内卷组织（伪开放）', accent: '#7c3aed', openness: 40,
    negentropy: '名义上对外招聘 / 对标学习，实际新信息进不了决策回路',
    entropyPoint: '文山会海、流程空转、向内竞争——能量在内部摩擦中全数转化为熵',
    fate: '伪开放：接口在、流量为零。表面忙碌（高能耗）≠ 负熵流入，加速滑向组织熵死。',
    radar: [40, 22, 35, 78, 25],
  },
  {
    key: 'platform', label: '数字平台生态（持续吞吐）', accent: '#1e90ff', openness: 76,
    negentropy: '开发者生态 + 用户数据 + 跨界并购——以 API 为负熵入口持续吞吐',
    entropyPoint: '算法茧房、生态垄断后创新衰减——平台成熟期的熵增回潮',
    fate: '前期靠开放生态高速建序；垄断成形后若关闭接口「向内收租」，熵增曲线重新抬头。',
    radar: [76, 78, 72, 45, 65],
  },
];

// 负熵来源结构（改革开放 = 系统性负熵工程）
const NEG_SOURCES = [
  { name: '对外贸易（出口市场）', value: 30, itemStyle: { color: '#c41e3a' } },
  { name: '技术引进（设备/专利）', value: 24, itemStyle: { color: '#22d3ee' } },
  { name: '人才流动（留学/打工潮）', value: 18, itemStyle: { color: '#10b981' } },
  { name: '制度学习（特区试错）', value: 16, itemStyle: { color: '#e8a317' } },
  { name: '资本流入（FDI）', value: 12, itemStyle: { color: '#7c3aed' } },
];

// 涨落放大：小岗村 → 全国家庭联产承包（采用率 %，示意）
const FLUCT_YEARS = ['1978', '1979', '1980', '1981', '1982', '1983', '1984'];
const FLUCT_ADOPT = [0.02, 1, 14, 45, 80, 94, 99];

// 熵增监控代理指标（与治国沙盒「熵增指数」接口）
const ENTROPY_PROXIES = [
  ['文山会海指数', '会议/发文数量 ÷ 实际决策产出', '信息熵：信号被流程噪声淹没', '#c41e3a'],
  ['流程繁冗度', '一件事的审批环节数 × 平均时滞', '结构熵：组织自由能被内耗锁死', '#e8a317'],
  ['创新衰减率', '新立项/新业务占比的逐年降幅', '活性熵：系统对新涨落的放大能力衰退', '#7c3aed'],
];

// 理论与应用时间线
const TIMELINE = [
  { period: '1865', title: '克劳修斯 · 热寂论', accent: '#5b6a82', desc: '熵概念提出：孤立系统熵恒增，宇宙终将「热寂」——有序的宿命论第一版。热二定律自此成为悬在一切封闭结构头上的物理判决。' },
  { period: '1944', title: '薛定谔 · 负熵', accent: '#22d3ee', desc: '《生命是什么》：生命以「负熵为食」——有机体靠从环境摄取有序（食物/阳光）来对抗自身熵增。第一次把热力学指向了生命与组织。' },
  { period: '1977', title: '普里高津 · 耗散结构（诺奖）', accent: '#c41e3a', desc: '证明开放系统在远离平衡态可以自发产生有序结构：负熵流 + 非线性 + 涨落放大 = 「混沌中诞生秩序」。获诺贝尔化学奖。' },
  { period: '1984—', title: '复杂系统科学', accent: '#10b981', desc: '圣塔菲研究所成立，自组织/涌现/相变成为跨学科范式——经济、城市、生态、互联网都被当作耗散结构重新理解。' },
  { period: '2010s—', title: '组织管理应用（华为熵减）', accent: '#e8a317', desc: '任正非把熵减写进华为管理纲领：开放架构、人才流动、自我批判、远离平衡的危机感——企业版「负熵工程」的自觉实践。' },
];

export default function Page() {
  const [openness, setOpenness] = useState(55); // 系统开放度 0–100
  const [caseKey, setCaseKey] = useState('reform');
  const [stageIdx, setStageIdx] = useState(2);

  // ── 开放度-熵流模拟器：内部熵积累 / 负熵流入 / 净有序度 三曲线 ──
  // 封闭(低开放)：负熵≈0，熵单调积累 → 熵死；
  // 适度开放：负熵抵消熵增，有序度在高位稳态；
  // 过度开放：外部涨落穿透，负熵流剧烈震荡 → 有序度失稳。
  const sim = useMemo(() => {
    const o = openness / 100;
    const entropyRate = 5.5 - o * 2.0;                       // 开放降低内部熵积累速率（信息流通）
    const negGain = o * 9.5;                                  // 负熵流入随开放度上升
    const overshoot = Math.max(0, openness - 78) / 22;        // 过度开放的震荡因子 0–1
    const critNoise = Math.max(0, 10 - Math.abs(openness - 42) * 0.7); // 临界点≈42 附近涨落最大
    const entropy = [], negFlow = [], order = [];
    let E = 30, O = 55;
    for (let t = 0; t < STEPS; t++) {
      const shock = Math.sin(t * 2.3) * overshoot * 16;       // 外部冲击穿透
      const fluct = Math.sin(t * 1.7) * critNoise * 0.7;      // 临界涨落
      const n = Math.max(0, negGain + shock);
      E = Math.max(0, Math.min(100, E + entropyRate - n * 0.55));
      O = Math.max(0, Math.min(100, O + n * 0.6 - entropyRate - Math.abs(shock) * 0.5 + fluct));
      entropy.push(Math.round(E));
      negFlow.push(Math.round(Math.min(100, n * 8)));
      order.push(Math.round(O));
    }
    return { entropy, negFlow, order };
  }, [openness]);

  const finalOrder = sim.order[STEPS - 1];
  const finalEntropy = sim.entropy[STEPS - 1];
  const verdict = openness < 30 ? 0 : openness < 52 ? 1 : openness <= 78 ? 2 : 3;
  const [vTitle, vColor, vDesc] = REGIMES[verdict];

  const simOpt = {
    tooltip: { trigger: 'axis' },
    legend: { top: 0, textStyle: { color: LABEL.color, fontSize: 10 }, itemWidth: 12 },
    grid: { left: 36, right: 16, top: 30, bottom: 24 },
    xAxis: categoryX(sim.order.map((_, i) => `t${i}`), { interval: 3 }),
    yAxis: valueY({ max: 100, min: 0 }),
    series: [
      { name: '净有序度', type: 'line', smooth: true, showSymbol: false, data: sim.order, lineStyle: { color: vColor, width: 2.5 }, itemStyle: { color: vColor }, areaStyle: { color: `${vColor}1f` } },
      { name: '内部熵积累', type: 'line', smooth: true, showSymbol: false, data: sim.entropy, lineStyle: { color: '#c41e3a', width: 1.5, type: 'dashed' }, itemStyle: { color: '#c41e3a' } },
      { name: '负熵流入', type: 'line', smooth: true, showSymbol: false, data: sim.negFlow, lineStyle: { color: '#22d3ee', width: 1.5 }, itemStyle: { color: '#22d3ee' } },
    ],
  };

  const activeCase = CASES.find((c) => c.key === caseKey) || CASES[1];
  const caseRadarOpt = radarOpt(
    ['开放度', '负熵流入', '净有序度', '熵积累', '涨落容忍'],
    activeCase.radar,
    { name: activeCase.label, color: activeCase.accent },
  );

  const fluctOpt = {
    tooltip: { trigger: 'axis', formatter: (p) => `${p[0].name} 年：采用率 ${p[0].value}%` },
    grid: { left: 40, right: 16, top: 24, bottom: 24 },
    xAxis: categoryX(FLUCT_YEARS),
    yAxis: valueY({ max: 100, name: '采用率 %', nameTextStyle: { color: LABEL.color } }),
    series: [{
      type: 'line', smooth: true, data: FLUCT_ADOPT, symbol: 'circle', symbolSize: 7,
      lineStyle: { color: '#10b981', width: 2.5 }, itemStyle: { color: '#10b981' },
      areaStyle: { color: 'rgba(16,185,129,0.12)' },
      markPoint: { data: [{ coord: ['1978', 0.02], value: '小岗村 18 户', itemStyle: { color: '#e8a317' }, label: { fontSize: 9, color: '#0a0f1a' } }] },
      markLine: { silent: true, symbol: 'none', lineStyle: { color: '#22d3ee', type: 'dashed' }, data: [{ xAxis: '1980', label: { formatter: '中央背书=正反馈接通', color: '#22d3ee', fontSize: 9 } }] },
    }],
  };

  const donut = donutOpt(NEG_SOURCES.map(({ name, value, itemStyle }) => ({ name, value, itemStyle })));

  return (
    <div>
      <PageHeader badge="Cognition · 耗散结构" title="耗散结构与熵 · 治理即持续对抗熵增"
        subtitle="孤立系统熵增走向死寂；开放系统靠负熵流在远离平衡态自组织出有序 —— 拖动开放度，看系统是熵死、失稳，还是落入有序窗口" />
      <IntroCard>
        普里高津（Prigogine）的<strong style={{ color: 'var(--text-primary)' }}>耗散结构</strong>理论：孤立系统遵循热力学第二定律，熵只增不减，终归无序与死寂。但<strong style={{ color: 'var(--text-primary)' }}>开放系统</strong>可以通过与环境交换物质、能量、信息引入<strong style={{ color: 'var(--cyber-cyan)' }}>负熵流</strong>；当系统被推到<strong style={{ color: 'var(--text-primary)' }}>远离平衡态</strong>、负熵流足以抵消熵增时，涨落会被放大，系统跨过临界点自发涌现稳定有序结构。封闭必然熵死，但开放也非越多越好——有序只存在于「远离平衡的窗口」之中。
      </IntroCard>

      <Grid cols={4} className="mb-6">
        <Stat value={finalOrder} label="稳态净有序度（实时）" accent={vColor} />
        <Stat value={finalEntropy} label="内部熵积累（实时）" accent="#c41e3a" />
        <Stat value={openness} label="系统开放度" accent="#22d3ee" />
        <Stat value="42–78" label="有序窗口（开放度区间）" accent="#10b981" />
      </Grid>

      {/* ① 开放度-熵流模拟器 */}
      <Grid cols={2} className="mb-6">
        <Card title="开放度调参 · 拖动看系统命运">
          <div className="flex justify-between text-xs mb-1">
            <span style={{ color: 'var(--text-secondary)' }}>系统开放度（物质 / 能量 / 信息交换强度）</span>
            <span className="mono" style={{ color: 'var(--cyber-cyan)' }}>{openness}</span>
          </div>
          <input type="range" min="0" max="100" value={openness} onChange={(e) => setOpenness(Number(e.target.value))}
            style={{ width: '100%', accentColor: '#c41e3a' }} />
          <div className="flex justify-between text-[10px] mono mt-1" style={{ color: 'var(--text-tertiary)' }}>
            <span>0 封闭熵死</span><span>≈42 临界涨落</span><span>42–78 有序窗口</span><span>100 失稳湍流</span>
          </div>
          <div className="mt-3 p-3 rounded" style={{ background: `${vColor}14`, border: `1px solid ${vColor}40` }}>
            <span className="text-[10px] mono uppercase" style={{ color: vColor }}>{vTitle}</span>
            <p className="text-xs mt-1 leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{vDesc}</p>
          </div>
          <p className="text-[11px] mt-2 leading-relaxed" style={{ color: 'var(--text-tertiary)' }}>
            三曲线含义：<span style={{ color: '#22d3ee' }}>负熵流入</span>随开放度上升；<span style={{ color: '#c41e3a' }}>内部熵积累</span>在封闭时单调爬升；<span style={{ color: '#10b981' }}>净有序度</span>只在两者平衡的「远离平衡窗口」内维持高位——开放不足熵死，开放过度外部冲击穿透结构。
          </p>
        </Card>
        <Card title="三曲线演化 · 内部熵积累 vs 负熵流入 vs 净有序度">
          <EChart option={simOpt} style={{ height: 300 }} />
        </Card>
      </Grid>

      {/* ② 耗散结构三条件 */}
      <Card title="耗散结构三条件 · 缺一不可" className="mb-6">
        <Grid cols={3}>
          {CONDITIONS.map(([t, phys, social, c]) => (
            <div key={t} className="os-card p-3" style={{ background: 'var(--bg-elevated)', borderLeft: `2px solid ${c}` }}>
              <div className="text-sm font-semibold" style={{ color: c }}>{t}</div>
              <p className="text-[11px] mt-1 leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{phys}</p>
              <p className="text-[11px] mt-1 leading-relaxed" style={{ color: 'var(--text-tertiary)' }}>社会对应物：{social}</p>
            </div>
          ))}
        </Grid>
      </Card>

      {/* ③ 系统案例选择器 */}
      <Card title="系统案例 · 六种「开放-熵」命运" className="mb-6">
        <SelectorBar items={CASES} activeKey={caseKey} onSelect={setCaseKey} />
        <Grid cols={2}>
          <div>
            <Grid cols={2} className="mb-3">
              <Stat value={activeCase.openness} label="系统开放度" accent={activeCase.accent} />
              <Stat value={activeCase.radar[3]} label="熵积累水位" accent="#c41e3a" />
            </Grid>
            <div className="space-y-2">
              {[['负熵来源', activeCase.negentropy, '#22d3ee'], ['熵积累点', activeCase.entropyPoint, '#c41e3a'], ['系统命运', activeCase.fate, activeCase.accent]].map(([t, d, c]) => (
                <div key={t} style={{ borderLeft: `2px solid ${c}`, paddingLeft: 10 }}>
                  <div className="text-xs font-semibold" style={{ color: c }}>{t}</div>
                  <p className="text-xs mt-0.5 leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{d}</p>
                </div>
              ))}
            </div>
          </div>
          <EChart option={caseRadarOpt} style={{ height: 280 }} />
        </Grid>
      </Card>

      {/* ④ 负熵来源结构 + ⑤ 涨落与相变 */}
      <Grid cols={2} className="mb-6">
        <Card title="负熵来源结构 · 改革开放 = 系统性负熵工程（示意权重 %）">
          <EChart option={donut} style={{ height: 240 }} />
          <p className="text-[11px] mt-2 leading-relaxed" style={{ color: 'var(--text-tertiary)' }}>
            把改革开放读成一项「负熵工程」：贸易换入市场信号、技术换入知识有序、人才换入活性、制度学习换入组织有序、资本换入做功能量——五路并进，把一个濒临平衡死寂的系统整体推入远离平衡的自组织区间。
          </p>
        </Card>
        <Card title="涨落放大 · 小岗村 → 全国家庭联产承包（示意）">
          <EChart option={fluctOpt} style={{ height: 240 }} />
          <p className="text-[11px] mt-2 leading-relaxed" style={{ color: 'var(--text-tertiary)' }}>
            1978 年 18 户按手印只是统计噪声级的「微涨落」；但系统恰处远离平衡的临界态——旧序参量（人民公社）已失效，中央背书接通正反馈，六年内涨落被放大为覆盖 99% 农户的全国新秩序。相变只发生在临界点附近：同样的涨落在平衡态会被耗散归零。
          </p>
        </Card>
      </Grid>

      {/* ⑥ 熵增监控接口 */}
      <Card title="熵增监控接口 · 组织熵增的可观测代理指标（与治国沙盒「熵增指数」同构）" className="mb-6">
        <Grid cols={3}>
          {ENTROPY_PROXIES.map(([t, formula, meaning, c]) => (
            <div key={t} className="os-card p-3" style={{ background: 'var(--bg-elevated)', borderLeft: `2px solid ${c}` }}>
              <div className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>{t}</div>
              <p className="text-[11px] mt-1 mono leading-relaxed" style={{ color: c }}>{formula}</p>
              <p className="text-[11px] mt-1 leading-relaxed" style={{ color: 'var(--text-tertiary)' }}>{meaning}</p>
            </div>
          ))}
        </Grid>
        <p className="text-[11px] mt-3 leading-relaxed" style={{ color: 'var(--text-tertiary)' }}>
          熵不可直接观测，只能用代理指标逼近：三项指标任意一项持续抬升，都意味着组织正在向「平衡死寂」滑动——此时的处方不是加强管控（管控本身生熵），而是重开负熵入口：简政、放权、引入外部人才与信息。
        </p>
      </Card>

      {/* ⑦ 理论与应用时间线 */}
      <Card title="理论与应用 · 从热寂论到华为熵减" className="mb-6">
        <TimelineBar stages={TIMELINE} activeIdx={stageIdx} onSelect={setStageIdx} />
      </Card>

      {/* ⑧ FrameworkTrio */}
      <FrameworkTrio cards={[
        { key: 'salt', title: '熵死定律', subtitle: '封闭系统的宿命', body: '热二定律对组织同样冷酷：不与外界交换的系统，熵只增不减——官僚化、信息失真、利益固化都是熵的社会形态，封闭只是把死寂推迟成必然。' },
        { key: 'stone', title: '负熵工程', subtitle: '开放 = 向环境购买秩序', body: '开放不是姿态而是热力学操作：用贸易、技术、人才、制度学习换入负熵。特区/试点是低成本的负熵入口实验——先开一个口，测得住再放大。' },
        { key: 'path', title: '涨落相变', subtitle: '远离平衡处的创造性混沌', body: '新秩序从不诞生于平衡态：只有当系统被推到远离平衡、旧结构松动时，一个微小涨落（小岗村、深圳）才可能被正反馈放大成全局新结构。' },
      ]} />

      <Card title="用法 · 与各模块的接口" className="mb-6">
        <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
          耗散结构是<span className="mono" style={{ color: 'var(--cyber-cyan)' }}>治国沙盒·熵增监控 / 治理现代化·熵减</span>的物理学母本：任何组织若不持续引入负熵流（改革、开放、信息流通、人才更替），都会滑向官僚化的熵增死寂。调参即在脑中预演——多大的开放强度，才足以让一个庞大系统持续维持有序而不被外部冲击撕裂。
        </p>
      </Card>

      <ModuleFooter moduleId="dissipative" disclaimer="物理隐喻 / 思想工具，非严格社会科学定律 · 案例数据为示意性刻画，仅供分析框架参考" />
    </div>
  );
}
