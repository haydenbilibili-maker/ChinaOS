import React, { useState, useMemo } from 'react';
import { PageHeader, Card, Grid, Stat } from '../../app/ui.jsx';
import EChart from '../../lib/viz/EChart.jsx';
import { categoryX, valueY, GRID, radarOpt, AXIS, LABEL } from '../shared/chartHelpers.js';
import { IntroCard, SelectorBar, TimelineBar, FrameworkTrio, ModuleFooter } from '../shared/ModuleParadigm.jsx';

// ============================================================================
// 认知内核 · 威慑与冲突战略（托马斯·谢林 Thomas Schelling）
// ----------------------------------------------------------------------------
// 威慑(阻止) vs 强制(迫使)；可信度 = 能力 × 决心 × 沟通（乘法模型，短板决定）。
// 模拟器：可信度计算器 / 边缘政策曲线 / 威慑类型 / 经典案例复盘。
// ============================================================================

const CONCEPTS = [
  ['威慑 Deterrence', '让对手「不去做」——以可信的惩罚威胁，使行动的预期代价超过收益。被动、维持现状。'],
  ['强制 Compellence', '让对手「去做或停止」——以持续施压迫使其改变行为。主动、需对手可见地让步，更难成功。'],
  ['可信承诺 Commitment', '威胁只有被相信才有效。谢林的悖论：自缚手脚、放弃退路，反而强化可信度（破釜沉舟）。'],
  ['边缘政策 Brinkmanship', '蓄意制造「失控滑向灾难」的共有风险，逼对手先退让——胆小鬼博弈的核心手筋。'],
  ['相互确保摧毁 MAD', '双方都有二次打击能力 → 先发制人无收益，恐怖平衡反而稳定。瞄准平民比瞄准导弹更稳。'],
  ['焦点 Focal Point', '无沟通条件下双方自然汇聚的默契点（谢林点）——「不越过鸭绿江」「不用核武器」皆是默认红线。'],
];

const DETERRENCE_TYPES = [
  { key: 'denial', label: '拒止威慑', accent: '#22d3ee', mech: '让对手「打不成」——通过防御能力使其行动在军事上无法达成目标，预期收益归零。', req: '前沿防御纵深、A2/AD 体系、持续消耗能力；不依赖对方对你决心的判断，可信度天然较高。', fail: '技术突袭绕过拒止体系；对手改打「既成事实」速决战，在拒止生效前完成目标。', case: '台海 A2/AD：反舰弹道导弹 + 防空网抬高外部介入成本，使干预方算不出「能赢」的方案。' },
  { key: 'punish', label: '惩罚威慑', accent: '#c41e3a', mech: '让对手「不敢打」——不阻止行动本身，而威胁施加无法承受的事后报复，抬高预期代价。', req: '可生存的报复力量 + 动手的决心 + 让对手相信你会动手；三者乘法关系，短板决定全局。', fail: '决心被质疑（「你真会为此承受反噬吗」）；报复力量可被先发解除；威胁过度反而不被相信。', case: '冷战核报复：大规模报复学说——任何进攻换来城市级毁灭，代价无限大压倒一切收益计算。' },
  { key: 'extended', label: '延伸威慑', accent: '#e8a317', mech: '为盟友撑伞——承诺为第三方利益动用本国力量报复，把别人的安全纳入自己的威胁射程。', req: '比自卫威慑多一道可信度折扣：「你真会为柏林/首尔交换自己的城市吗」；需驻军等「绊网」自缚。', fail: '保护人与被保护人利益分歧暴露；对手切香肠式试探，每步都不足以触发大国下场。', case: '美日美韩核保护伞：驻军即人质——前沿部队伤亡使「不介入」在国内政治上不可能。' },
  { key: 'nuclear', label: '核威慑', accent: '#a78bfa', mech: '终极惩罚威慑——毁灭是确定且无限的，威慑不靠概率计算而靠「不可承受」本身。', req: '二次打击能力（核潜艇/机动发射/预警体系）是关键：报复力量必须在挨打后仍然存在。', fail: '指挥链误判与事故（误警报）；「有限核战争」幻想侵蚀禁忌；技术突破威胁二次打击生存性。', case: 'MAD 均衡：瞄准城市而非导弹反而更稳——反力打击能力会诱发对方「用掉或失去」的先发冲动。' },
  { key: 'gray', label: '灰色地带', accent: '#10b981', mech: '威慑的反面应用——行动者把每步切得低于报复门槛，让防守方「为这点小事动武不值得」。', req: '应对要件：把模糊地带画清（明示红线）、发展对称的低烈度反制工具、累积成本回敬。', fail: '防守方红线模糊或不断后退 → 切香肠持续推进；单次容忍累积成既成事实。', case: '海上民兵、海警对峙、网络渗透：每一步都「够不上开战」，但十年累积改变现状。' },
  { key: 'cumulative', label: '累积威慑', accent: '#f472b6', mech: '不求一次吓止，而以反复的、可预期的反制行动建立「每次都会还手」的声誉记录。', req: '长期一致性是全部资本：一次不还手即贬值；行动须成比例、可重复、不至升级失控。', fail: '反制力度被对手当作「可承受成本」计入预算；声誉逻辑诱使为小事过度升级。', case: '以色列式逐次报复、经济反制清单化：用行为记录而非单次声明来书写可信度。' },
];

const CASES = [
  { key: 'cuba', label: '古巴导弹危机 1962', cap: 90, res: 85, com: 80, win: true, accent: '#22d3ee', read: '威慑成功（双向）。美方海上隔离展示决心而留有退路，私下以撤土耳其导弹交换——边缘政策推到悬崖边又给对方搭好下行台阶。教训：胜利不是压垮对手，而是让退让可以被体面接受。' },
  { key: 'coldwar', label: '冷战核均衡 1949-91', cap: 95, res: 80, com: 75, win: true, accent: '#a78bfa', read: '威慑成功（四十年无大战）。MAD 把先发收益归零；热线、军控条约持续修补「沟通」短板。但成功掩盖多次误警报险情——结构稳定 ≠ 过程安全。' },
  { key: 'taiwan96', label: '台海危机 1996', cap: 55, res: 75, com: 60, win: false, accent: '#e8a317', read: '威慑部分失效。导弹演习展示决心，但当年能力短板（两个航母战斗群即可压制）使威胁打折——乘法模型现形：决心无法补足能力缺口。此后二十余年军改即是对这块短板的长期回填。' },
  { key: 'ukraine', label: '乌克兰战前 2021-22', cap: 70, res: 35, com: 40, win: false, accent: '#c41e3a', read: '威慑失败的教科书。西方预先排除直接军事介入（「不派兵」公开说死）——能力虽在，决心被自己亲手清零；制裁威胁的模糊性又让对手低估代价。短板归零，乘积归零。' },
  { key: 'taiwanNow', label: '当前台海格局', cap: 80, res: 70, com: 55, win: null, accent: '#10b981', read: '进行时的双向威慑。一方以 A2/AD 威慑「独」与外部介入，另一方以战略模糊威慑「武统」。最薄弱处在沟通：危机管控渠道时断时续，误判风险高于冷战美苏。判读：未定，取决于三要素的此消彼长。' },
];

const COMMIT_DEVICES = [
  { t: '烧船 Burning Boats', s: '科尔特斯 · 破釜沉舟', d: '物理消灭退路，使「撤退」不再是选项。对手知道你只能向前，威胁便无需再被怀疑。代价：彻底放弃灵活性，误判时无法回头。', a: '#c41e3a' },
  { t: '自缚双手 Tying Hands', s: '国内立法 · 公开承诺', d: '把不报复的政治成本抬到不可承受——公开划红线、写入法律、绑定民意。退缩等于政权信誉破产，对手据此推断你必然行动。', a: '#e8a317' },
  { t: '自动化反应 Automation', s: '末日机器 · 绊网驻军', d: '把报复决定权交给机器或既成机制（核警报自动反击、前沿驻军即人质），从根上移除「临阵犹豫」的可能。最可信，也最危险。', a: '#a78bfa' },
];

const TIMELINE = [
  { period: '1950s', title: '大规模报复', desc: '艾森豪威尔时期：任何级别的进攻都以全面核打击回应。便宜但僵硬——威胁过重反而在小冲突中不可信，对手吃准你不会为局部摩擦按按钮。', accent: '#c41e3a' },
  { period: '1960s', title: '灵活反应', desc: '麦克纳马拉修正：建立从常规到核的完整升级阶梯，每个烈度都有相称回应——让威胁在每一层都可信，代价是体系昂贵且升级路径更复杂。', accent: '#e8a317' },
  { period: '1965-90', title: '相互确保摧毁 MAD', desc: '二次打击能力成熟 → 先发制人无收益。《反导条约》以「互相不设防」锁定恐怖平衡：脆弱性本身成为稳定器——谢林逻辑的制度化巅峰。', accent: '#a78bfa' },
  { period: '1990s-2010s', title: '战区与延伸威慑', desc: '单极时代焦点转向地区：核保护伞、导弹防御、前沿驻军「绊网」。延伸威慑的可信度难题凸显——为盟友承受多大代价，始终被对手反复测算。', accent: '#22d3ee' },
  { period: '2010s-今', title: '跨域威慑', desc: '太空、网络、经济制裁进入威慑工具箱：归因困难、门槛模糊、升级阶梯交错。灰色地带行动专门绕开传统威慑的触发线——理论正在被重写。', accent: '#10b981' },
];

export default function Page() {
  const [p, setP] = useState({ cap: 80, res: 60, com: 55 });
  const [typeKey, setTypeKey] = useState('denial');
  const [caseKey, setCaseKey] = useState('cuba');
  const [brink, setBrink] = useState(40);
  const [tlIdx, setTlIdx] = useState(2);

  // ---- 可信度计算器：乘法模型（短板决定）+ 误判风险 ----
  const calc = useMemo(() => {
    const succ = Math.round((p.cap / 100) * (p.res / 100) * (p.com / 100) * 100);
    const weakest = Object.entries({ 能力: p.cap, 决心: p.res, 沟通: p.com }).sort((a, b) => a[1] - b[1])[0];
    // 误判风险：沟通缺口为主因，能力-决心错位（强能力弱决心诱使试探）为放大项
    const misread = Math.min(100, Math.round((100 - p.com) * 0.6 + Math.abs(p.cap - p.res) * 0.4));
    // 三因子敏感度曲线：分别扫描某一因子 0→100，其余固定
    const xs = Array.from({ length: 11 }, (_, i) => i * 10);
    const sweep = (which) => xs.map((v) => {
      const q = { ...p, [which]: v };
      return Math.round((q.cap / 100) * (q.res / 100) * (q.com / 100) * 100);
    });
    return { succ, weakest, misread, xs, capLine: sweep('cap'), resLine: sweep('res'), comLine: sweep('com') };
  }, [p]);
  const verdict = calc.succ > 45 ? '稳态威慑' : calc.succ > 20 ? '脆弱威慑' : '威慑失效';
  const vcolor = calc.succ > 45 ? '#10b981' : calc.succ > 20 ? '#e8a317' : '#c41e3a';

  const sweepOpt = {
    tooltip: { trigger: 'axis' },
    legend: { textStyle: { color: LABEL.color, fontSize: 10 }, top: 0 },
    grid: { ...GRID, top: 28 },
    xAxis: categoryX(calc.xs),
    yAxis: valueY({ max: 100 }),
    series: [
      { name: '扫描能力', type: 'line', smooth: true, symbol: 'none', data: calc.capLine, lineStyle: { color: '#22d3ee', width: 2 } },
      { name: '扫描决心', type: 'line', smooth: true, symbol: 'none', data: calc.resLine, lineStyle: { color: '#c41e3a', width: 2 } },
      { name: '扫描沟通', type: 'line', smooth: true, symbol: 'none', data: calc.comLine, lineStyle: { color: '#e8a317', width: 2 } },
    ],
  };

  // ---- 边缘政策：风险 vs 筹码 的倒 U + 失控概率 ----
  const brinkData = useMemo(() => {
    const xs = Array.from({ length: 21 }, (_, i) => i * 5);
    const leverage = xs.map((r) => Math.round((r * (100 - r)) / 25)); // 倒 U，峰值在 50
    const loss = xs.map((r) => Math.round(Math.pow(r / 100, 2) * 100)); // 凸性上升
    const lev = Math.round((brink * (100 - brink)) / 25);
    const ls = Math.round(Math.pow(brink / 100, 2) * 100);
    return { xs, leverage, loss, lev, ls };
  }, [brink]);

  const brinkOpt = {
    tooltip: { trigger: 'axis' },
    legend: { textStyle: { color: LABEL.color, fontSize: 10 }, top: 0 },
    grid: { ...GRID, top: 28 },
    xAxis: categoryX(brinkData.xs, { interval: 3 }),
    yAxis: valueY({ max: 100 }),
    series: [
      { name: '谈判筹码（倒U）', type: 'line', smooth: true, symbol: 'none', data: brinkData.leverage, lineStyle: { color: '#22d3ee', width: 2 }, areaStyle: { color: 'rgba(34,211,238,0.08)' } },
      { name: '失控概率', type: 'line', smooth: true, symbol: 'none', data: brinkData.loss, lineStyle: { color: '#c41e3a', width: 2, type: 'dashed' } },
      { name: '当前位置', type: 'scatter', symbolSize: 14, itemStyle: { color: '#e8a317' }, data: [[Math.round(brink / 5), brinkData.lev]] },
    ],
  };

  const dt = DETERRENCE_TYPES.find((t) => t.key === typeKey);
  const cs = CASES.find((c) => c.key === caseKey);
  const csVerdict = cs.win === true ? '威慑成功' : cs.win === false ? '威慑失败' : '判读未定';
  const csColor = cs.win === true ? '#10b981' : cs.win === false ? '#c41e3a' : '#e8a317';

  const Slider = ({ k, label, hint, val, onChange }) => (
    <div className="mb-3">
      <div className="flex justify-between text-xs mb-1"><span style={{ color: 'var(--text-secondary)' }}>{label}</span><span className="mono" style={{ color: '#22d3ee' }}>{val}</span></div>
      <input type="range" min="0" max="100" value={val} onChange={onChange} style={{ width: '100%', accentColor: '#c41e3a' }} />
      <div className="text-[10px] mt-0.5" style={{ color: 'var(--text-tertiary)' }}>{hint}</div>
    </div>
  );

  return (
    <div>
      <PageHeader badge="Cognition · 威慑战略" title="威慑与冲突战略 · 谢林的可信博弈"
        subtitle="威慑(阻止) vs 强制(迫使) —— 威慑有效性 = 能力 × 决心 × 沟通，乘法关系，短板决定全局" />
      <IntroCard>
        托马斯·谢林把冲突当作<strong style={{ color: 'var(--text-primary)' }}>讨价还价</strong>：胜负不取决于谁更强，而取决于谁的威胁更<strong style={{ color: 'var(--text-primary)' }}>可信</strong>。最反直觉的洞见——<strong style={{ color: 'var(--china-red)' }}>「拴住自己的手」反而增强可信度</strong>：放弃退路、把报复交给自动机制，使「不动手」在政治上不可能，对手便不敢试探。本页以乘法模型、边缘政策曲线与五个经典案例，把这套冷峻的可信博弈拆成可推演的部件。
      </IntroCard>

      <Grid cols={4} className="mb-6">
        <Stat value={`${calc.succ}%`} label="威慑成功率（乘法模型）" accent={vcolor} />
        <Stat value={verdict} label="威慑状态判定" accent={vcolor} />
        <Stat value={calc.weakest[0]} label={`最薄弱环节（${calc.weakest[1]}）`} accent="#e8a317" />
        <Stat value={`${calc.misread}%`} label="误判风险（沟通缺口+能力决心错位）" accent={calc.misread > 50 ? '#c41e3a' : '#22d3ee'} />
      </Grid>

      <Grid cols={2} className="mb-6">
        <Card title="威慑可信度计算器 · 三滑杆">
          <Slider k="cap" label="能力 Capability" hint="有没有实施惩罚的实力（军力 / 经济筹码 / 二次打击）" val={p.cap} onChange={(e) => setP({ ...p, cap: Number(e.target.value) })} />
          <Slider k="res" label="决心 Resolve" hint="愿不愿意承受代价真的动手（意志、利益攸关度）" val={p.res} onChange={(e) => setP({ ...p, res: Number(e.target.value) })} />
          <Slider k="com" label="沟通 Communication" hint="对手是否准确接收并相信你的威胁——信号、渠道、不可逆承诺" val={p.com} onChange={(e) => setP({ ...p, com: Number(e.target.value) })} />
          <div className="p-2 rounded mt-2" style={{ background: 'rgba(196,30,58,0.08)', border: '1px solid rgba(196,30,58,0.2)' }}>
            <p className="text-[11px] leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
              <strong style={{ color: 'var(--china-red)' }}>乘法不是加法：</strong>把能力推到 100、决心压到 20，成功率仍归于失效——强大军力若无人相信你会用，等于零威慑。乌克兰战前的西方就是教材：能力在，决心被自己公开清零。
            </p>
          </div>
        </Card>
        <Card title="敏感度扫描 · 哪个因子最值得补">
          <EChart option={sweepOpt} style={{ height: 200 }} />
          <p className="text-[11px] mt-2" style={{ color: 'var(--text-tertiary)' }}>三条线分别把某一因子从 0 扫到 100（其余固定为当前滑杆值）。最陡的线 = 当前的短板因子——边际投入应砸向它，而非已经满格的强项。</p>
        </Card>
      </Grid>

      <Card title="威慑画像 · 三要素雷达" className="mb-6">
        <Grid cols={2}>
          <EChart option={radarOpt(['能力 Capability', '决心 Resolve', '沟通 Communication'], [p.cap, p.res, p.com], { name: '威慑三要素', color: vcolor })} style={{ height: 220 }} />
          <div>
            <div className="text-sm font-semibold mb-2" style={{ color: vcolor }}>{verdict} · 成功率 {calc.succ}%</div>
            <p className="text-xs leading-relaxed mb-2" style={{ color: 'var(--text-secondary)' }}>雷达面积不是关键，<strong style={{ color: 'var(--text-primary)' }}>最短的轴才是</strong>。威慑链条上任一环节断裂即全链失效——这是几何均值/乘法模型与「综合实力加权平均」思维的根本分野。</p>
            <p className="text-xs leading-relaxed" style={{ color: 'var(--text-tertiary)' }}>误判风险 {calc.misread}%：沟通缺口让对手读不准你的红线；能力与决心错位（账面强、意志疑）则诱使对手「试一把」——多数威慑失败不是实力不够，而是被试探出了底牌。</p>
          </div>
        </Grid>
      </Card>

      <Card title="威慑类型选择器 · 六种机理" className="mb-6">
        <SelectorBar items={DETERRENCE_TYPES} activeKey={typeKey} onSelect={setTypeKey} />
        <div className="os-card p-4" style={{ background: 'var(--bg-elevated)', borderLeft: `3px solid ${dt.accent}` }}>
          <div className="text-sm font-semibold mb-2" style={{ color: dt.accent }}>{dt.label}</div>
          <Grid cols={2}>
            <div>
              <div className="text-[10px] mono uppercase mb-1" style={{ color: 'var(--text-tertiary)' }}>机理</div>
              <p className="text-xs leading-relaxed mb-3" style={{ color: 'var(--text-secondary)' }}>{dt.mech}</p>
              <div className="text-[10px] mono uppercase mb-1" style={{ color: 'var(--text-tertiary)' }}>关键要件</div>
              <p className="text-xs leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{dt.req}</p>
            </div>
            <div>
              <div className="text-[10px] mono uppercase mb-1" style={{ color: '#c41e3a' }}>失效模式</div>
              <p className="text-xs leading-relaxed mb-3" style={{ color: 'var(--text-secondary)' }}>{dt.fail}</p>
              <div className="text-[10px] mono uppercase mb-1" style={{ color: '#22d3ee' }}>当代案例</div>
              <p className="text-xs leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{dt.case}</p>
            </div>
          </Grid>
        </div>
      </Card>

      <Card title="经典案例复盘 · 三维评分与成败判读" className="mb-6">
        <SelectorBar items={CASES} activeKey={caseKey} onSelect={setCaseKey} />
        <Grid cols={2}>
          <EChart option={radarOpt(['能力', '决心', '沟通'], [cs.cap, cs.res, cs.com], { name: cs.label, color: cs.accent })} style={{ height: 220 }} />
          <div>
            <div className="flex items-baseline gap-2 mb-2">
              <span className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>{cs.label}</span>
              <span className="text-xs mono px-2 py-0.5 rounded" style={{ color: csColor, border: `1px solid ${csColor}` }}>{csVerdict}</span>
            </div>
            <div className="text-[11px] mono mb-2" style={{ color: 'var(--text-tertiary)' }}>能力 {cs.cap} · 决心 {cs.res} · 沟通 {cs.com} → 乘积指数 {Math.round((cs.cap / 100) * (cs.res / 100) * (cs.com / 100) * 100)}%</div>
            <p className="text-xs leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{cs.read}</p>
          </div>
        </Grid>
      </Card>

      <Card title="边缘政策模拟 · 推到悬崖边的收益曲线" className="mb-6">
        <Grid cols={2}>
          <div>
            <Slider k="brink" label="风险水平 Risk Level（共担失控风险）" hint="0 = 完全安全无压力；100 = 悬崖之外，灾难必然" val={brink} onChange={(e) => setBrink(Number(e.target.value))} />
            <Grid cols={2} className="mb-2">
              <Stat value={brinkData.lev} label="谈判筹码" accent="#22d3ee" />
              <Stat value={`${brinkData.ls}%`} label="失控概率" accent={brinkData.ls > 36 ? '#c41e3a' : '#e8a317'} />
            </Grid>
            <p className="text-[11px] leading-relaxed" style={{ color: 'var(--text-tertiary)' }}>谢林的「制造共担风险」：边缘政策不是威胁「我将毁灭你」，而是制造「我们可能一起滑下去」的局面，逼神经更弱的一方先退。筹码呈倒 U——风险太低无人理会，太高则失控概率压倒收益。古巴导弹危机停在曲线峰值附近，然后双方各搭台阶下行。</p>
          </div>
          <EChart option={brinkOpt} style={{ height: 230 }} />
        </Grid>
      </Card>

      <Card title="承诺装置 · 限制自己反而更强的悖论" className="mb-6">
        <Grid cols={3}>
          {COMMIT_DEVICES.map((d) => (
            <div key={d.t} className="p-3 rounded" style={{ background: 'var(--bg-elevated)', borderTop: `2px solid ${d.a}` }}>
              <div className="text-sm font-semibold" style={{ color: d.a }}>{d.t}</div>
              <div className="text-[10px] mono mb-1" style={{ color: 'var(--text-tertiary)' }}>{d.s}</div>
              <p className="text-xs leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{d.d}</p>
            </div>
          ))}
        </Grid>
        <p className="text-[11px] mt-3" style={{ color: 'var(--text-tertiary)' }}>共同逻辑：博弈中「保留选项」常是弱点——对手会赌你选择软的那条路。砍掉软选项，剩下的硬选项自动获得可信度。这是谢林对「理性=灵活」直觉的最大颠覆。</p>
      </Card>

      <Card title="稳定-不稳定悖论 · 威慑的层级泄漏" className="mb-6">
        <Grid cols={2}>
          <div className="p-3 rounded" style={{ background: 'rgba(167,139,250,0.08)', border: '1px solid rgba(167,139,250,0.25)' }}>
            <span className="text-[10px] mono uppercase" style={{ color: '#a78bfa' }}>核层面 · 稳定</span>
            <p className="text-xs mt-1 leading-relaxed" style={{ color: 'var(--text-secondary)' }}>MAD 锁死最高烈度：双方都确知全面战争等于共同毁灭，于是大战概率被压到极低。恐怖平衡在「天花板」上是真稳定。</p>
          </div>
          <div className="p-3 rounded" style={{ background: 'rgba(196,30,58,0.08)', border: '1px solid rgba(196,30,58,0.25)' }}>
            <span className="text-[10px] mono uppercase" style={{ color: '#c41e3a' }}>常规/灰色层面 · 更不稳定</span>
            <p className="text-xs mt-1 leading-relaxed" style={{ color: 'var(--text-secondary)' }}>正因为确信不会升级到核战，双方在天花板之下反而更敢冒险：代理人战争、边境摩擦、灰色地带蚕食——威慑在顶层成功，把冲突挤压泄漏到了底层。</p>
          </div>
        </Grid>
        <p className="text-[11px] mt-3" style={{ color: 'var(--text-tertiary)' }}>印巴是教科书案例：双双拥核后大战绝迹，但低烈度冲突与跨境袭击反而频密。对核大国关系的推论冷峻而清楚——核威慑的成功不等于和平，只是改变了冲突的形态与楼层。</p>
      </Card>

      <Card title="威慑理论演进 · 七十年的学说迭代" className="mb-6">
        <TimelineBar stages={TIMELINE} activeIdx={tlIdx} onSelect={setTlIdx} />
      </Card>

      <Card title="谢林核心概念 · 冲突即讨价还价" className="mb-6">
        <Grid cols={2}>
          {CONCEPTS.map(([t, d]) => (
            <div key={t} style={{ borderLeft: '2px solid var(--china-red)', paddingLeft: 10 }}>
              <div className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>{t}</div>
              <p className="text-xs mt-1 leading-relaxed" style={{ color: 'var(--text-tertiary)' }}>{d}</p>
            </div>
          ))}
        </Grid>
      </Card>

      <Card title="现实映射 · 三个威慑现场" className="mb-6">
        <Grid cols={3}>
          <div className="p-3 rounded" style={{ background: 'rgba(196,30,58,0.08)', border: '1px solid rgba(196,30,58,0.2)' }}>
            <span className="text-[10px] mono uppercase" style={{ color: 'var(--china-red)' }}>台海 A2/AD</span>
            <p className="text-xs mt-1" style={{ color: 'var(--text-secondary)' }}>反介入/区域拒止以「抬高外部干预成本」实施拒止威慑；战略模糊则是刻意保留可信度的「不拴手」打法。</p>
          </div>
          <div className="p-3 rounded" style={{ background: 'rgba(34,211,238,0.08)', border: '1px solid rgba(34,211,238,0.2)' }}>
            <span className="text-[10px] mono uppercase" style={{ color: '#22d3ee' }}>核威慑 MAD</span>
            <p className="text-xs mt-1" style={{ color: 'var(--text-secondary)' }}>二次打击能力（核潜艇/机动发射）保证恐怖平衡；瞄准对方城市而非导弹，反而让威慑更稳定。</p>
          </div>
          <div className="p-3 rounded" style={{ background: 'rgba(232,163,23,0.08)', border: '1px solid rgba(232,163,23,0.2)' }}>
            <span className="text-[10px] mono uppercase" style={{ color: '#e8a317' }}>关税边缘博弈</span>
            <p className="text-xs mt-1" style={{ color: 'var(--text-secondary)' }}>互加关税是经济版边缘政策：制造共有的「脱钩」风险逼对方先退，用国内立法「拴手」提高威胁可信度。</p>
          </div>
        </Grid>
      </Card>

      <FrameworkTrio cards={[
        { title: '可信度三要素', subtitle: '能力 × 决心 × 沟通', body: '乘法不是加法：任一因子趋零，整条威慑链崩溃。多数威慑失败不是实力不够，而是决心被质疑或信号被误读——被对手试探出了底牌。', pillars: [['能力', '有没有实施惩罚的实力。'], ['决心', '愿不愿意承受代价动手。'], ['沟通', '对手是否接收并相信。']] },
        { title: '承诺装置', subtitle: '自缚之手的力量', body: '谢林悖论：砍掉自己的软选项，剩下的硬选项自动获得可信度。烧船、立法拴手、自动化反应是同一逻辑的三种实现——可信度来自不可逆。', pillars: [['烧船', '物理消灭退路。'], ['拴手', '抬高退缩的政治成本。'], ['自动化', '移除临阵犹豫的可能。']] },
        { title: '稳定-不稳定悖论', subtitle: '威慑的层级泄漏', body: '核层面锁死大战，常规与灰色层面反而更敢冒险——威慑在顶层成功，冲突向底层泄漏。核威慑的成功不等于和平，只是改变冲突的楼层。', pillars: [['天花板', 'MAD 压低大战概率。'], ['泄漏', '低烈度冲突更频密。'], ['灰色地带', '切香肠绕开触发线。']] },
      ]} />

      <ModuleFooter moduleId="deterrence" disclaimer="本页为博弈论思想工具与结构推演，案例评分为示意性框架打分，非预测、非立场、非实证测量" />
    </div>
  );
}
