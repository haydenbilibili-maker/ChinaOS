import React, { useState, useMemo } from 'react';
import { PageHeader, Card, Grid, Stat } from '../../app/ui.jsx';
import EChart from '../../lib/viz/EChart.jsx';
import { categoryX, valueY, logY, GRID, donutOpt, radarOpt, stackedBarOpt, AXIS, LABEL } from '../shared/chartHelpers.js';
import { IntroCard, SelectorBar, TimelineBar, FrameworkTrio, ModuleFooter } from '../shared/ModuleParadigm.jsx';

// ============================================================================
// 认知内核 · 委托代理理论（Principal-Agent · 信息不对称）
// ----------------------------------------------------------------------------
// 委托人无法完全观察代理人 → 道德风险(隐藏行动)、逆向选择(隐藏类型)。
// 交互：①监督/激励双滑杆 → 努力度/扭曲度/总成本 + 四象限诊断（古德哈特定律）
//       ②央地委托代理案例选择器 ③科层链条衰减曲线 ④理论时间线
// ============================================================================

const RISKS = [
  ['道德风险 · 隐藏行动', '合约签订后，代理人行动不可观测 → 偷懒、卸责、为部门私利套利（基层执行打折扣）。'],
  ['逆向选择 · 隐藏类型', '签约前，代理人真实能力/意图不可知 → 劣币驱逐良币（带病提拔、数据注水竞标）。'],
];
const SOLUTIONS = [
  ['激励相容', '让代理人「为己即为公」——绩效与报酬挂钩，把代理人利益对齐委托目标。'],
  ['监督', '审计、巡视、督查、留痕——直接压缩信息不对称，但本身有成本。'],
  ['声誉', '重复博弈下，长期声誉资本约束短期机会主义（晋升锦标赛即声誉排序）。'],
  ['绩效合约', '一利五率等可量化指标合约，把不可观测的「努力」替换为可考核的「结果」。'],
];

// 信息不对称两类型 · 事前/事后 + 对应治理工具（精修方向 3）
const ASYM_TYPES = [
  {
    name: '逆向选择 Adverse Selection', timing: '事前 · 隐藏类型', accent: '#e8a317',
    mech: '签约之前，委托人不知道代理人是「好类型」还是「坏类型」——能力、意图、风险偏好均不可观测。市场/组织会被坏类型逐渐占据（柠檬市场）。',
    tools: ['甄别 Screening：设计自选择菜单（公务员考试、试用期、竞争性谈判）让类型自我暴露', '信号 Signaling：好类型主动发出难以伪造的信号（学历、政绩公示、审计报告）'],
    gov: '干部选拔的「凡提四必」、巡视前置考察，本质都是事前甄别装置。',
  },
  {
    name: '道德风险 Moral Hazard', timing: '事后 · 隐藏行动', accent: '#c41e3a',
    mech: '签约之后，代理人的实际行动不可观测——只能看见带噪声的结果。代理人有动机偷懒、卸责、把坏结果归咎于运气。',
    tools: ['监督 Monitoring：审计/巡视/督查/数字留痕，直接压缩行动的不可观测性', '绩效合同 Performance Contract：报酬与可验证结果挂钩，让代理人自担部分风险'],
    gov: '环保督察「回头看」、经济责任审计离任必审，是事后行动还原装置。',
  },
];

// 央地委托代理案例（精修方向 2）
const CASES = [
  {
    key: 'gdp', label: 'GDP 锦标赛', accent: '#c41e3a',
    structure: '中央（委托人）→ 省市官员（代理人）：以 GDP 相对增速为核心晋升标尺，构造「政治锦标赛」。',
    asym: '地方真实努力与投资质量不可观测，中央只能看见 GDP 这个带噪声的汇总信号。',
    distortion: '重复建设、土地财政、隐性债务——凡是不进 GDP 的（环保、教育、民生欠账）系统性被牺牲。',
    fix: '考核指标多元化（绿色 GDP、高质量发展指标体系）、终身追责制对冲短期冲动。',
  },
  {
    key: 'env', label: '环保一刀切', accent: '#10b981',
    structure: '中央环保督察（委托人）→ 地方政府（代理人）：环保从软约束变为一票否决式硬约束。',
    asym: '督察组无法逐企业核查整改质量，只能抽查 + 限期验收，地方掌握全部现场信息。',
    distortion: '为确保「过关」，地方宁可错杀：全行业停产、冬季禁煤一刀切——合规形式压倒治理实质。',
    fix: '差异化管控清单、「禁止环保一刀切」专门文件、整改销号制把验收颗粒度做细。',
  },
  {
    key: 'data', label: '数据注水 · 统计造假', accent: '#22d3ee',
    structure: '上级统计/考核系统（委托人）→ 地方填报者（代理人）：考核完全依赖代理人自报数据。',
    asym: '数据生产环节在代理人手中——委托人观测的不是事实，而是代理人加工后的报表。',
    distortion: '辽宁、内蒙古等地 GDP/财政挤水分事件：指标压力直接转化为数字造假激励。',
    fix: '统计垂直管理、第四方核查（电力/税收/卫星灯光交叉验证）、统计造假入刑入责。',
  },
  {
    key: 'jiama', label: '层层加码', accent: '#e8a317',
    structure: '多级委托链：中央→省→市→县，每级既是上级的代理人、又是下级的委托人。',
    asym: '每级都担心下级打折扣，于是把目标向上浮动 10–20% 再下达——以加码对冲衰减。',
    distortion: '指令到基层已严重变形：防疫静默扩大化、双碳运动式减碳，基层承担全部加码成本。',
    fix: '中央「不得层层加码」专项整治、基层减负年、向下问责与向上纠偏并行。',
  },
  {
    key: 'paobu', label: '跑部钱进', accent: '#a78bfa',
    structure: '部委掌握项目/转移支付审批（委托人），地方驻京办游说争取（代理人逆向施动）。',
    asym: '部委不掌握地方真实需求排序，地方不掌握审批标准全貌——双向信息不对称。',
    distortion: '资源流向游说能力而非真实需求；驻京办一度逾万家，寻租空间内嵌于审批裁量。',
    fix: '一般性转移支付占比提高（公式化分配压缩裁量）、驻京办清理、审批权下放与负面清单。',
  },
  {
    key: 'veto', label: '一票否决制', accent: '#f472b6',
    structure: '委托人对无法量化但绝对优先的目标（安全、稳定、计生曾是）设置否决项：触线即全盘归零。',
    asym: '委托人无法连续监测底线事项，于是用极端罚则替代连续监督——以重罚换稀疏观测。',
    distortion: '否决项泛滥后基层全面避责：宁可不作为也不冒险；瞒报压案以避免触发否决。',
    fix: '中央清理规范「一票否决」事项、建立容错纠错机制，把否决收敛到极少数真底线。',
  },
];

// 公司治理 ↔ 央地治理 同构对照（精修方向 6）
const GOV_MAP = [
  ['委托人', '股东（分散所有权）', '中央（人民授权的代理链顶端）'],
  ['代理人', '职业经理人 / CEO', '地方党政主官'],
  ['激励工具', '股权激励 · 期权 · 分红', '晋升锦标赛 · 政治声誉'],
  ['监督工具', '外部审计 · 信息披露', '巡视巡察 · 审计 · 督查'],
  ['独立制衡', '独立董事 · 监事会', '纪委监委 · 人大监督'],
  ['退出机制', '解雇 / 敌意收购 / 用脚投票', '调整交流 / 问责免职'],
  ['典型失灵', '安然式财务造假', '统计数据注水 · 形式主义'],
];

// 理论与制度时间线（精修方向 7）
const STAGES = [
  { period: '1932', title: 'Berle-Means 所有权分离', accent: '#e8a317', desc: '《现代公司与私有财产》指出：股权分散使所有权与控制权分离，经理人实际掌权而股东失控——委托代理问题的现代起点。' },
  { period: '1976', title: 'Jensen-Meckling 代理成本', accent: '#c41e3a', desc: '把代理问题数学化：代理成本 = 监督成本 + 担保成本 + 剩余损失。最优治理不是消灭代理成本，而是在三者间寻找成本最小化的配比——本页模拟器的理论骨架。' },
  { period: '1996/2001/2007', title: '信息经济学诺奖系列', accent: '#22d3ee', desc: 'Mirrlees/Vickrey（机制设计与最优税制）、Akerlof/Spence/Stiglitz（柠檬市场/信号/甄别）、Hurwicz/Maskin/Myerson（机制设计理论）——把「在信息不对称下设计制度」变成精密工程学。' },
  { period: '2007', title: '中国官员晋升锦标赛研究', accent: '#10b981', desc: '周黎安《中国地方官员的晋升锦标赛模式研究》：相对绩效考核 + 胜者晋升，把地方官员变成增长竞赛选手——解释了增长奇迹，也预言了指标博弈的全部副作用。' },
  { period: '2012→', title: '数字监督时代', accent: '#a78bfa', desc: '大数据审计、卫星遥感环保核查、留痕管理、政务穿透式监管——技术压缩信息不对称，但也催生新型形式主义（痕迹主义）：监督技术与博弈策略协同进化。' },
];

const LEVELS = ['中央', '省', '市', '县', '乡镇'];

export default function Page() {
  const [m, setM] = useState(40); // 监督强度
  const [w, setW] = useState(50); // 激励比例（绩效占报酬比）
  const [caseKey, setCaseKey] = useState('gdp');
  const [stageIdx, setStageIdx] = useState(3);

  // 代理人努力：随激励上升、随监督上升（但监督边际递减），上限 100
  const effort = useMemo(() => Math.round(Math.min(100, 20 + w * 0.6 + Math.sqrt(m) * 4)), [m, w]);
  // 监督成本随强度凸性上升；激励成本 = 让渡给代理人的剩余索取权
  const monCost = useMemo(() => Math.round((m * m) / 100), [m]);
  const incCost = useMemo(() => Math.round((w * effort) / 100), [w, effort]);
  // 代理损失：努力越低、损失越大（未实现的委托价值）
  const agencyLoss = useMemo(() => Math.round((100 - effort) * 0.9), [effort]);
  // 行为扭曲度（古德哈特）：激励越强而监督越弱，指标博弈空间越大
  const distortion = useMemo(() => Math.round(Math.max(0, w * (1 - m / 100) * 0.9)), [m, w]);
  const total = monCost + incCost + agencyLoss + Math.round(distortion * 0.5); // 委托总成本（越低越好）

  // 四象限诊断（精修方向 1）
  const quadrant = useMemo(() => {
    const hiM = m >= 50, hiW = w >= 50;
    if (!hiM && !hiW) return { name: '躺平区 · 弱监督弱激励', color: '#64748b', desc: '既看不见也不奖惩——代理人理性选择最低努力，组织进入低水平均衡（大锅饭时代的国企/机关病）。' };
    if (hiM && !hiW) return { name: '形式主义区 · 强监督弱激励', color: '#e8a317', desc: '只有检查没有甜头——代理人把努力投向「应付检查」：留痕、台账、迎检表演。监督越密，痕迹主义越盛。' };
    if (!hiM && hiW) return { name: '数据注水区 · 弱激励监督+强指标激励', color: '#c41e3a', desc: '重赏之下必有「数字」——指标决定命运而无人核实指标，操纵指标比创造实绩便宜得多（统计造假温床）。' };
    return { name: '高产出区 · 强监督强激励', color: '#10b981', desc: '努力高、扭曲被压制——但监督成本与激励让渡都很昂贵：高绩效组织的代价是高治理开销，不可能处处复制。' };
  }, [m, w]);

  // 扫描激励比例 0–100，固定当前监督，画 成本/努力/扭曲 三曲线找最优点
  const sweep = useMemo(() => {
    const xs = [], cost = [], eff = [], dis = [];
    for (let ww = 0; ww <= 100; ww += 5) {
      const e = Math.min(100, 20 + ww * 0.6 + Math.sqrt(m) * 4);
      const d = Math.max(0, ww * (1 - m / 100) * 0.9);
      const c = Math.round((m * m) / 100 + (ww * e) / 100 + (100 - e) * 0.9 + d * 0.5);
      xs.push(ww); cost.push(c); eff.push(Math.round(e)); dis.push(Math.round(d));
    }
    return { xs, cost, eff, dis };
  }, [m]);
  const optIdx = sweep.cost.indexOf(Math.min(...sweep.cost));
  const optW = sweep.xs[optIdx];

  const chart = {
    legend: { data: ['委托总成本', '代理人努力', '行为扭曲'], textStyle: { color: LABEL.color }, top: 0 },
    grid: { left: 44, right: 44, top: 30, bottom: 28 },
    tooltip: { trigger: 'axis' },
    xAxis: { type: 'category', name: '激励比例 %', nameTextStyle: { color: LABEL.color }, data: sweep.xs, axisLine: { lineStyle: { color: AXIS.lineStyle.color } } },
    yAxis: [
      { type: 'value', name: '成本', splitLine: { lineStyle: { color: 'rgba(148,163,184,0.1)' } }, axisLine: { lineStyle: { color: AXIS.lineStyle.color } } },
      { type: 'value', name: '努力/扭曲', max: 100, splitLine: { show: false }, axisLine: { lineStyle: { color: AXIS.lineStyle.color } } },
    ],
    series: [
      { name: '委托总成本', type: 'line', smooth: true, data: sweep.cost, lineStyle: { color: '#c41e3a', width: 2 }, itemStyle: { color: '#c41e3a' }, areaStyle: { color: 'rgba(196,30,58,0.08)' },
        markPoint: { symbolSize: 44, data: [{ name: '最优', coord: [optIdx, sweep.cost[optIdx]], itemStyle: { color: '#10b981' }, label: { formatter: '最优', color: '#fff', fontSize: 10 } }] } },
      { name: '代理人努力', type: 'line', smooth: true, yAxisIndex: 1, data: sweep.eff, lineStyle: { color: '#22d3ee', width: 2 }, itemStyle: { color: '#22d3ee' } },
      { name: '行为扭曲', type: 'line', smooth: true, yAxisIndex: 1, data: sweep.dis, lineStyle: { color: '#e8a317', width: 2, type: 'dashed' }, itemStyle: { color: '#e8a317' } },
    ],
  };

  // 科层链条衰减曲线（精修方向 5）：每级保真率受监督/激励影响，复利衰减
  const chainOpt = useMemo(() => {
    const retain = Math.min(0.97, 0.62 + (m / 100) * 0.22 + (w / 100) * 0.1); // 单级保真率
    const fidelity = LEVELS.map((_, i) => Math.round(100 * Math.pow(retain, i) * 10) / 10);
    const weak = LEVELS.map((_, i) => Math.round(100 * Math.pow(0.66, i) * 10) / 10);
    return {
      legend: { data: ['当前参数下保真度', '弱治理基准(66%/级)'], textStyle: { color: LABEL.color }, top: 0 },
      tooltip: { trigger: 'axis', valueFormatter: (v) => v + '%' },
      grid: { ...GRID, top: 30, right: 24 },
      xAxis: categoryX(LEVELS),
      yAxis: valueY({ max: 100, axisLabel: { formatter: '{value}%' } }),
      series: [
        { name: '当前参数下保真度', type: 'line', smooth: true, data: fidelity, lineStyle: { color: '#22d3ee', width: 3 }, itemStyle: { color: '#22d3ee' }, areaStyle: { color: 'rgba(34,211,238,0.1)' }, label: { show: true, color: '#22d3ee', fontSize: 10, formatter: '{c}%' } },
        { name: '弱治理基准(66%/级)', type: 'line', smooth: true, data: weak, lineStyle: { color: '#64748b', width: 2, type: 'dashed' }, itemStyle: { color: '#64748b' } },
      ],
    };
  }, [m, w]);

  const cur = CASES.find((c) => c.key === caseKey);

  const Slider = ({ val, set, label, hint }) => (
    <div className="mb-3">
      <div className="flex justify-between text-xs mb-1"><span style={{ color: 'var(--text-secondary)' }}>{label}</span><span className="mono" style={{ color: 'var(--cyber-cyan)' }}>{val}%</span></div>
      <input type="range" min="0" max="100" value={val} onChange={(e) => set(Number(e.target.value))} style={{ width: '100%', accentColor: '#c41e3a' }} />
      <p className="text-[11px] mt-1" style={{ color: 'var(--text-tertiary)' }}>{hint}</p>
    </div>
  );

  return (
    <div>
      <PageHeader badge="Cognition · 委托代理" title="委托代理理论 · 信息不对称下的治理成本"
        subtitle="委托人看不见代理人 → 道德风险与逆向选择 —— 调监督与激励，看努力、扭曲与委托总成本如何权衡" />
      <IntroCard>
        当委托人（上级/股东）的目标依赖代理人（下级/经理）执行，而代理人的<strong style={{ color: 'var(--text-primary)' }}>行动与类型不可完全观测</strong>时，便产生委托代理问题：代理人有动机追逐自身利益、对委托目标打折扣。治理的核心，就是用<strong style={{ color: 'var(--text-primary)' }}>激励、监督、声誉、合约</strong>四种手段压低代理成本——但每种手段都有代价，故存在最优配比。而古德哈特定律警告：<strong style={{ color: 'var(--text-primary)' }}>指标一旦成为目标，就不再是好指标</strong>——激励越强，扭曲越凶。
      </IntroCard>

      <Grid cols={4} className="mb-6">
        <Stat value={effort} label="代理人努力水平（实时）" accent={effort > 75 ? '#10b981' : effort > 50 ? '#e8a317' : '#c41e3a'} />
        <Stat value={distortion} label="行为扭曲度 · 指标博弈" accent={distortion > 40 ? '#c41e3a' : distortion > 20 ? '#e8a317' : '#10b981'} />
        <Stat value={total} label="委托总成本（越低越好）" accent="#e8a317" />
        <Stat value={optW + '%'} label="当前监督下的最优激励比例" accent="#22d3ee" />
      </Grid>

      <Grid cols={2} className="mb-6">
        <Card title="治理参数 · 拖动调参">
          <Slider val={m} set={setM} label="监督强度 Monitoring" hint="审计/巡视/留痕的力度。压缩信息不对称，但成本随强度凸性上升（边际递减）。" />
          <Slider val={w} set={setW} label="激励强度 Incentive" hint="绩效占报酬之比。提升努力最有效，但需让渡剩余索取权——且监督不足时催生指标博弈。" />
          <div className="grid grid-cols-4 gap-2 mt-3 text-center">
            <div><div className="mono text-sm" style={{ color: '#e8a317' }}>{monCost}</div><div className="text-[10px]" style={{ color: 'var(--text-tertiary)' }}>监督成本</div></div>
            <div><div className="mono text-sm" style={{ color: '#e8a317' }}>{incCost}</div><div className="text-[10px]" style={{ color: 'var(--text-tertiary)' }}>激励成本</div></div>
            <div><div className="mono text-sm" style={{ color: '#c41e3a' }}>{agencyLoss}</div><div className="text-[10px]" style={{ color: 'var(--text-tertiary)' }}>代理损失</div></div>
            <div><div className="mono text-sm" style={{ color: '#c41e3a' }}>{distortion}</div><div className="text-[10px]" style={{ color: 'var(--text-tertiary)' }}>扭曲损失</div></div>
          </div>
          <div className="mt-3 p-3 rounded" style={{ background: 'var(--bg-elevated)', borderLeft: `3px solid ${quadrant.color}` }}>
            <div className="text-xs font-semibold mb-1" style={{ color: quadrant.color }}>四象限诊断：{quadrant.name}</div>
            <p className="text-[11px] leading-relaxed" style={{ color: 'var(--text-tertiary)' }}>{quadrant.desc}</p>
          </div>
        </Card>
        <Card title="激励—成本—扭曲 三曲线（固定当前监督）">
          <EChart option={chart} style={{ height: 280 }} />
          <p className="text-[11px] mt-2 leading-relaxed" style={{ color: 'var(--text-tertiary)' }}>
            古德哈特定律的几何呈现：激励（横轴）右移时，努力（青线）趋于饱和，而扭曲（黄虚线）在监督不足时持续上扬——总成本曲线的「最优点」正是三种力量的拔河结果。提高监督强度，看最优激励点如何右移。
          </p>
        </Card>
      </Grid>

      <Card title="央地委托代理案例库 · 选一例拆结构" className="mb-6">
        <SelectorBar items={CASES} activeKey={caseKey} onSelect={setCaseKey} />
        <Grid cols={4} className="mt-4">
          {[['委托结构', cur.structure, '#22d3ee'], ['信息不对称点', cur.asym, '#e8a317'], ['激励扭曲', cur.distortion, '#c41e3a'], ['制度修补', cur.fix, '#10b981']].map(([t, d, c]) => (
            <div key={t} className="os-card p-3" style={{ background: 'var(--bg-elevated)', borderTop: `2px solid ${c}` }}>
              <div className="text-xs font-semibold mb-1" style={{ color: c }}>{t}</div>
              <p className="text-[11px] leading-relaxed" style={{ color: 'var(--text-tertiary)' }}>{d}</p>
            </div>
          ))}
        </Grid>
      </Card>

      <Grid cols={2} className="mb-6">
        <Card title="两类信息不对称 · 事前 vs 事后">
          {RISKS.map(([t, d]) => (
            <div key={t} className="mb-3" style={{ borderLeft: '2px solid var(--china-red)', paddingLeft: 10 }}>
              <div className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>{t}</div>
              <p className="text-xs mt-1 leading-relaxed" style={{ color: 'var(--text-tertiary)' }}>{d}</p>
            </div>
          ))}
          {ASYM_TYPES.map((a) => (
            <div key={a.name} className="os-card p-3 mb-2" style={{ background: 'var(--bg-elevated)', borderLeft: `3px solid ${a.accent}` }}>
              <div className="flex justify-between items-center mb-1">
                <span className="text-xs font-semibold" style={{ color: a.accent }}>{a.name}</span>
                <span className="text-[10px] mono" style={{ color: 'var(--text-tertiary)' }}>{a.timing}</span>
              </div>
              <p className="text-[11px] leading-relaxed mb-1" style={{ color: 'var(--text-secondary)' }}>{a.mech}</p>
              {a.tools.map((t) => (
                <div key={t} className="text-[11px] leading-relaxed" style={{ color: 'var(--text-tertiary)' }}>· {t}</div>
              ))}
              <p className="text-[11px] mt-1" style={{ color: a.accent }}>{a.gov}</p>
            </div>
          ))}
        </Card>
        <div>
          <Card title="四种解法 · 压低代理成本" className="mb-4">
            <Grid cols={2}>
              {SOLUTIONS.map(([t, d]) => (
                <div key={t} className="os-card p-3" style={{ background: 'var(--bg-elevated)' }}>
                  <div className="text-xs font-semibold mb-1" style={{ color: '#10b981' }}>{t}</div>
                  <p className="text-[11px] leading-relaxed" style={{ color: 'var(--text-tertiary)' }}>{d}</p>
                </div>
              ))}
            </Grid>
          </Card>
          <Card title="多任务代理问题 · Holmstrom–Milgrom (1991)">
            <p className="text-xs leading-relaxed mb-2" style={{ color: 'var(--text-secondary)' }}>
              当代理人同时承担<strong style={{ color: 'var(--text-primary)' }}>可测任务</strong>（GDP、税收、信访量）与<strong style={{ color: 'var(--text-primary)' }}>不可测任务</strong>（生态、长期人力资本、制度建设）时，对可测任务加大激励，会把努力从不可测任务<strong style={{ color: '#c41e3a' }}>系统性挤出</strong>——这不是觉悟问题，而是激励合同的数学必然。
            </p>
            <div className="grid grid-cols-2 gap-2">
              <div className="os-card p-2.5" style={{ background: 'var(--bg-elevated)' }}>
                <div className="text-[11px] font-semibold" style={{ color: '#c41e3a' }}>考核 GDP → 牺牲环保</div>
                <p className="text-[10px] leading-relaxed mt-1" style={{ color: 'var(--text-tertiary)' }}>增长可测、污染滞后不可测：激励权重全压在前者，后者被理性放弃。</p>
              </div>
              <div className="os-card p-2.5" style={{ background: 'var(--bg-elevated)' }}>
                <div className="text-[11px] font-semibold" style={{ color: '#10b981' }}>考核环保 → 一刀切</div>
                <p className="text-[10px] leading-relaxed mt-1" style={{ color: 'var(--text-tertiary)' }}>达标可测、精准治理不可测：最便宜的达标方式是全面停产——任务结构未变，扭曲只是换了方向。</p>
              </div>
            </div>
            <p className="text-[11px] mt-2 leading-relaxed" style={{ color: 'var(--text-tertiary)' }}>
              理论处方：对多任务代理人应<strong style={{ color: 'var(--text-secondary)' }}>压低单一指标激励强度</strong>、改用宽职责弱激励（固定薪+声誉），或把任务拆给不同代理人分别考核——「高质量发展指标体系」正是对单一锦标赛的多任务修正。
            </p>
          </Card>
        </div>
      </Grid>

      <Grid cols={2} className="mb-6">
        <Card title="科层链条衰减 · 五级委托链保真度（联动滑杆）">
          <EChart option={chainOpt} style={{ height: 260 }} />
          <p className="text-[11px] mt-2 leading-relaxed" style={{ color: 'var(--text-tertiary)' }}>
            委托链每加一级，信息损耗与激励衰减按<strong style={{ color: 'var(--text-secondary)' }}>复利</strong>叠加：单级保真 90% 时五级后仅剩 ~66%，单级 66% 时仅剩 ~19%。这解释了「层层加码」的理性根源——上级以加码预补衰减；也解释了为何中央要用巡视、督察等<strong style={{ color: 'var(--text-secondary)' }}>跨级直插</strong>工具绕开链条（呼应政府体系模块的条块结构）。
          </p>
        </Card>
        <Card title="公司治理 ↔ 央地治理 · 委托代理同构对照">
          <table className="w-full text-[11px]" style={{ borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ color: 'var(--text-secondary)' }}>
                <th className="text-left py-1.5" style={{ borderBottom: '1px solid var(--border-subtle)' }}>维度</th>
                <th className="text-left py-1.5" style={{ borderBottom: '1px solid var(--border-subtle)', color: '#22d3ee' }}>股东—经理人</th>
                <th className="text-left py-1.5" style={{ borderBottom: '1px solid var(--border-subtle)', color: '#c41e3a' }}>中央—地方</th>
              </tr>
            </thead>
            <tbody>
              {GOV_MAP.map(([dim, corp, state]) => (
                <tr key={dim} style={{ color: 'var(--text-tertiary)' }}>
                  <td className="py-1.5 font-semibold" style={{ borderBottom: '1px solid var(--border-subtle)', color: 'var(--text-secondary)' }}>{dim}</td>
                  <td className="py-1.5 pr-2" style={{ borderBottom: '1px solid var(--border-subtle)' }}>{corp}</td>
                  <td className="py-1.5" style={{ borderBottom: '1px solid var(--border-subtle)' }}>{state}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className="text-[11px] mt-2 leading-relaxed" style={{ color: 'var(--text-tertiary)' }}>
            同构性意味着工具可互鉴：股权激励的「让渡剩余索取权」逻辑对应晋升锦标赛的「让渡政治前途期权」；安然之后的萨班斯法案，与统计造假之后的垂直管理改革，是同一种制度免疫反应。
          </p>
        </Card>
      </Grid>

      <Card title="理论与制度时间线 · 从所有权分离到数字监督" className="mb-6">
        <TimelineBar stages={STAGES} activeIdx={stageIdx} onSelect={setStageIdx} />
      </Card>

      <Card title="现实映射 · 与政府体系 / 国资模块呼应">
        <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
          <strong style={{ color: 'var(--text-primary)' }}>央地关系（压力型体制）</strong>：中央是委托人、地方是代理人，目标考核层层加码以对抗执行打折扣；
          <strong style={{ color: 'var(--text-primary)' }}>官僚执行</strong>：政策在传导链上被信息不对称稀释，「上有政策、下有对策」即典型道德风险；
          <strong style={{ color: 'var(--text-primary)' }}>国企「一利五率」</strong>：国资委以可量化绩效合约替代不可观测努力，正是激励相容 + 绩效合约的制度落地。调参即在脑中预演不同监督/激励组合的治理代价。
        </p>
      </Card>
<FrameworkTrio cards={[
        { key: 'salt', body: '委托人目标 vs 代理人自利：信息不对称根源。' },
        { key: 'stone', body: '监督+激励相容：考核、审计、数字化穿透。' },
        { key: 'path', body: '央地/国企/官僚链：压低代理成本的制度组合。' },
      ]} />
<ModuleFooter moduleId="principalagent" disclaimer="本页为思想工具与分析框架演示，模型参数为教学示意，不构成对任何机构的事实评价。" />
    </div>
  );
}
