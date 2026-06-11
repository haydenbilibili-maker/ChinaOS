// ============================================================================
// 宏观调控推演引擎（思想工具 / 分析框架）
// ----------------------------------------------------------------------------
// 声明：全部系数为示意标定，不对任何真实经济体做测算或拟合；
//       非投资建议、非预测。纯函数、零 React、零随机、零当前时间。
// 模型：四状态（增长/物价/就业/杠杆）× 五政策杆 的季度差分方程，
//       核心是「时滞结构」——财政当季见效、杠杆账单 +2 季计提；
//       降息 +1 季拉增长、+3 季抬通胀；产业政策 +3 季起效但不衰减；
//       汇率弹性高则外部冲击传导小、短期波动大。
// ============================================================================

export const MACRO_AS_OF = '2026-06-11';

/** 五根政策杆（init 即「中性参考」组合） */
export const POLICY_LEVERS = [
  {
    id: 'fiscal', label: '赤字率', min: 2.5, max: 5.0, step: 0.1, init: 3.0, unit: '%', color: '#c41e3a',
    desc: '一般公共预算赤字率：当季直接拉动增长，但杠杆账单从第 3 季开始计提——刺激先到，利息后到。',
  },
  {
    id: 'rate', label: '政策利率调整', min: -100, max: 50, step: 5, init: 0, unit: 'bp', color: '#22d3ee',
    desc: '相对中性水平的利率变动：降息第 2 季起拉动增长、第 4 季起抬升通胀；加息镜像反向并压缩信用。',
  },
  {
    id: 'bonds', label: '专项债额度', min: 2, max: 6, step: 0.5, init: 3.9, unit: ' 万亿', color: '#e8a317',
    desc: '地方政府专项债年度额度：当季托底基建投资，杠杆账单同样滞后两季——和赤字是同一张资产负债表。',
  },
  {
    id: 'fx', label: '汇率弹性', min: 0, max: 100, step: 5, init: 50, unit: '', color: '#8b5cf6',
    desc: '0=严格管制 ↔ 100=自由浮动：弹性越高，外部冲击传导进国内越少，但汇率自身的短期波动越大。',
  },
  {
    id: 'industry', label: '产业政策强度', min: 0, max: 100, step: 5, init: 40, unit: '', color: '#10b981',
    desc: '产业基金/补贴/链长制的合成强度：第 4 季才开始见效，但效应逐季递增且不衰减——最慢也最持久的杆。',
  },
];

/** 四态（推演的四个状态变量 = 宏观调控的四难平衡） */
export const MACRO_STATES = [
  { id: 'growth', label: '增长动能', color: '#22d3ee', desc: 'GDP 同比增速（%，示意）——政绩、税基与就业的总阀门。' },
  { id: 'inflation', label: '物价水平', color: '#c41e3a', desc: 'CPI 同比（%，示意）——民生容忍度的硬约束，2.5 是警戒线。' },
  { id: 'employ', label: '就业景气', color: '#10b981', desc: '就业景气指数（示意，55 为初值）——社会稳定的第一变量。' },
  { id: 'leverage', label: '宏观杠杆', color: '#e8a317', desc: '宏观杠杆率（%GDP，示意）——今天的每一分刺激，都是明天的账单。' },
];

/** 状态初值（基期） */
export const MACRO_INIT = { growth: 4.8, inflation: 1.2, employ: 55, leverage: 285 };

/** 中性政策组合（各杆 init） */
export function defaultLevers() {
  return Object.fromEntries(POLICY_LEVERS.map((l) => [l.id, l.init]));
}

// —— 确定性外生序列（示意标定，非随机）——
// EXT：外部需求冲击（季度，正=顺风），WAVE：汇率弹性带来的短期波动（前大后小衰减波）
const EXT = [-0.12, 0.08, -0.20, 0.05, -0.15, 0.06, -0.08, 0.04];
const WAVE = [1, -1, 0.6, -0.6, 0.3, -0.3, 0.15, -0.15];

const QN = 8; // 推演季度数
const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));
const r2 = (v) => Math.round(v * 100) / 100;
const r1 = (v) => Math.round(v * 10) / 10;

/**
 * 八季度差分推演（确定性纯函数）
 * @param {object} levers {fiscal,rate,bonds,fx,industry}（缺省项按中性补齐）
 * @returns {{growth:number[],inflation:number[],employ:number[],leverage:number[]}}
 *
 * 时滞结构（t 为季度下标，0 起）：
 *   财政/专项债 → 增长 t>=0 当季；→ 杠杆 t>=2（+2 季计提）
 *   利率        → 增长 t>=1（+1 季）；→ 通胀 t>=3（+3 季）；→ 杠杆 t>=1（信用渠道）
 *   产业政策    → 增长/就业 t>=3（+3 季），效应 (1+0.15·(t-3)) 逐季递增不衰减
 *   汇率弹性    → 外部冲击传导 ×(1-0.7·fx) 衰减，短期波动 ×0.12·fx 放大
 */
export function simulate(levers) {
  const L = { ...defaultLevers(), ...(levers || {}) };
  const dF = L.fiscal - 3.0;          // 财政偏离（百分点）
  const dB = L.bonds - 3.9;           // 专项债偏离（万亿）
  const dR = L.rate;                  // 利率偏离（bp，负=降息）
  const fxN = L.fx / 100;             // 汇率弹性 0-1
  const dI = (L.industry - 40) / 100; // 产业政策偏离

  const growth = [], inflation = [], employ = [], leverage = [];
  let p = MACRO_INIT.inflation;
  let e = MACRO_INIT.employ;
  let lev = MACRO_INIT.leverage;

  for (let t = 0; t < QN; t++) {
    // —— 增长：基线缓降 + 各杆贡献（含时滞与衰减）——
    const gBase = 4.8 - 0.035 * (t + 1);                      // 潜在增速缓降的基线
    const Fg = 0.42 * dF * (1 - 0.04 * t);                    // 财政当季见效，微衰减
    const Bg = 0.24 * dB * (1 - 0.05 * t);                    // 专项债当季见效，微衰减
    const Rg = t >= 1 ? (-dR / 100) * 0.32 : 0;               // 利率 +1 季起效
    const Ig = t >= 3 ? 0.5 * dI * (1 + 0.15 * (t - 3)) : 0;  // 产业政策 +3 季起效且递增
    const Xg = (1 - 0.7 * fxN) * EXT[t] + 0.12 * fxN * WAVE[t]; // 外部冲击传导 + 弹性波动
    const g = gBase + Fg + Bg + Rg + Ig + Xg;

    // —— 通胀：需求拉动（产出缺口）+ 货币滞后传导（+3 季）——
    let dp = 0.02 + 0.16 * (g - 4.6);
    if (t >= 3) dp += (-dR / 100) * 0.28;
    p = clamp(p + dp, -0.5, 8);

    // —— 就业：跟随增长缺口 + 产业政策滞后吸纳（+3 季）——
    let de = 0.5 * (g - 4.5);
    if (t >= 3) de += 0.8 * dI;
    e = clamp(e + de, 30, 80);

    // —— 杠杆：信用惯性 + 财政/专项债 +2 季计提 + 利率信用渠道 +1 季 − 名义增长分母 ——
    let dl = 0.8 - 0.25 * (g - 4.5);
    if (t >= 1) dl += (-dR / 100) * 1.0;
    if (t >= 2) dl += 0.9 * dF + 0.55 * dB;
    lev = clamp(lev + dl, 200, 400);

    growth.push(r2(g));
    inflation.push(r2(p));
    employ.push(r1(e));
    leverage.push(r1(lev));
  }
  return { growth, inflation, employ, leverage };
}

/**
 * 末季象限判定（五档，按优先级短路）
 * @returns {{label:string,color:string,note:string}}
 */
export function quadrant(traj) {
  const g = traj.growth[QN - 1];
  const p = traj.inflation[QN - 1];
  const dL = traj.leverage[QN - 1] - MACRO_INIT.leverage;
  if (g >= 4.7 && p <= 2.2 && dL <= 8) {
    return {
      label: '稳增长达成', color: '#10b981',
      note: '增长、物价、杠杆同时落在容忍带内——这套组合罕见地没有透支任何一张资产负债表，但窗口期通常比任期短。',
    };
  }
  if (g < 4.3 && p > 2.2) {
    return {
      label: '滞胀风险', color: '#c41e3a',
      note: '增长失速与物价抬头同时出现：工具箱里每一件武器都会同时打中一个错误目标，调控从选择题变成判断题。',
    };
  }
  if (dL > 15) {
    return {
      label: '债务雪球', color: '#e8a317',
      note: '杠杆八季增幅超过 15 个百分点——增长是借来的，今天的每一分刺激都在为明天计提利息，雪球只认坡度不认理由。',
    };
  }
  if (g < 4.5) {
    return {
      label: '紧缩出清', color: '#22d3ee',
      note: '出清在进行，代价在前台：杠杆回落以增长与就业为对价，能走多远取决于政治耐受度，而不是经济学。',
    };
  }
  return {
    label: '弱平衡', color: '#64748b',
    note: '不冷不热的均衡——没有破裂，也没有突破；时间在替结构性问题计息，平衡本身就是最贵的政策。',
  };
}

const fmtLever = (l, v) => `${v}${l.unit}`;
const sgn = (v, digits = 1) => (v >= 0 ? `+${v.toFixed(digits)}` : v.toFixed(digits));

/** 按政策组合生成机理解读条目（确定性文案） */
function mechanismLines(L) {
  const out = [];
  const dF = L.fiscal - 3.0, dB = L.bonds - 3.9, dR = L.rate, dI = L.industry - 40;
  if (dF > 0.2) out.push(`- 赤字率 ${L.fiscal}% 高于中性：当季拉动增长，但第 3 季起逐季计提杠杆——刺激是政绩，利息是遗产。`);
  else if (dF < -0.2) out.push(`- 赤字率 ${L.fiscal}% 低于中性：财政主动收缩，增长当季承压，换取杠杆曲线的弯头。`);
  if (dB > 0.3) out.push(`- 专项债 ${L.bonds} 万亿超中性额度：基建当季托底，与赤字共用同一张滞后两季的杠杆账单。`);
  else if (dB < -0.3) out.push(`- 专项债 ${L.bonds} 万亿低于中性：基建投资退坡，是去杠杆组合里最快见效的减法。`);
  if (dR <= -20) out.push(`- 降息 ${Math.abs(dR)}bp：增长效应第 2 季到账、通胀效应第 4 季到账——前者是政绩，后者是账单。`);
  else if (dR >= 20) out.push(`- 加息 ${dR}bp：第 2 季起压增长、压信用，通胀与杠杆同步降温，代价由就业先付。`);
  if (L.fx >= 70) out.push(`- 汇率弹性 ${L.fx}：接近浮动，外部冲击大部分被汇率吸收，代价是短期波动放大。`);
  else if (L.fx <= 30) out.push(`- 汇率弹性 ${L.fx}：接近管制，汇率稳了，外部冲击改由国内增长直接硬扛。`);
  if (dI >= 20) out.push(`- 产业政策强度 ${L.industry}：第 4 季起效且逐季递增——见效最慢，但却是唯一不衰减的杆。`);
  else if (dI <= -20) out.push(`- 产业政策强度 ${L.industry}：低位运行，把结构升级交还给市场自发节奏。`);
  if (!out.length) out.push('- 全部政策杆处于中性附近：基线情景下潜在增速缓降、杠杆惯性缓升，不作为即是一种选择。');
  out.push('- 时滞结构：财政/专项债当季见效、第 3 季计提杠杆；利率第 2 季作用于增长、第 4 季作用于物价；产业政策第 4 季起效不衰减。');
  return out;
}

/**
 * 推演报告（Markdown，确定性）
 * @param {{levers:object,traj:object,verdict:{label,color,note}}} param0
 */
export function buildMacroReport({ levers, traj, verdict }) {
  const L = { ...defaultLevers(), ...(levers || {}) };
  const lines = [];
  lines.push('# 宏观调控推演报告');
  lines.push('');
  lines.push(`> 基准日 ${MACRO_AS_OF} · 推演窗口 ${QN} 个季度 · 差分方程示意模型（思想工具）`);
  lines.push('');
  lines.push('## 一、政策组合');
  lines.push('');
  lines.push('| 政策杆 | 取值 | 中性参考 | 可调区间 |');
  lines.push('| --- | --- | --- | --- |');
  POLICY_LEVERS.forEach((l) => {
    lines.push(`| ${l.label} | ${fmtLever(l, L[l.id])} | ${fmtLever(l, l.init)} | ${l.min}–${l.max}${l.unit} |`);
  });
  lines.push('');
  lines.push('## 二、八季度轨迹关键点');
  lines.push('');
  lines.push('| 指标 | 初值 | 第 1 季 | 第 4 季 | 第 8 季 | Δ（末季−初值） |');
  lines.push('| --- | --- | --- | --- | --- | --- |');
  MACRO_STATES.forEach((s) => {
    const arr = traj[s.id];
    const init = MACRO_INIT[s.id];
    lines.push(`| ${s.label} | ${init} | ${arr[0]} | ${arr[3]} | ${arr[QN - 1]} | ${sgn(arr[QN - 1] - init)} |`);
  });
  lines.push('');
  lines.push('## 三、判定与机理解读');
  lines.push('');
  lines.push(`**末季判定：${verdict.label}** — ${verdict.note}`);
  lines.push('');
  mechanismLines(L).forEach((l) => lines.push(l));
  lines.push('');
  lines.push('## 尾注');
  lines.push('');
  lines.push('> 示意模型，非投资建议、非预测。全部系数为示意标定，仅作为理解宏观调控时滞与代价结构的思想工具。');
  return lines.join('\n');
}
