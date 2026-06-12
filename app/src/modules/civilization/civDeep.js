// ============================================================================
// 文明透视 · 作战室深度数据层 civDeep.js
// ----------------------------------------------------------------------------
// 口径铁律（贯穿本文件与页面展示）：
//   全部内容为「理想型分析框架 · 非实证史学 · 非现实影射」。
//   王朝案例的五因子为史学常识级粗粒度示意标定（0-100，值高=病重），
//   仅用于框架推演与案例对照，不构成历史实证结论，更不影射任何现实对象。
// 确定性铁律：零随机、零当前时间——所有数值为构建期常量，simDynasty /
//   buildCivReport 均为纯函数，同输入恒同输出。
// 消费方：./Page.jsx（王朝病理切片 / 治乱周期模拟器 / 周期推演报告）。
// ============================================================================

// ---------------------------------------------------------------------------
// 〇、维度定义
// ---------------------------------------------------------------------------
/** 五因子病理维度（值高=病重）——王朝案例标定与最近案例匹配共用 */
export const FACTOR_DEFS = [
  { key: 'fiscal', label: '财政枯竭' },
  { key: 'elite', label: '精英内卷' },
  { key: 'periphery', label: '边患外压' },
  { key: 'mobilize', label: '动员失灵' },
  { key: 'legitimacy', label: '认受侵蚀' },
];

/**
 * 模拟器四杆（治理投入方向 · 值高=对应风险被压制）。
 * 认受侵蚀无独立杆：在本框架中它是前四线长期失守的下游结果，不可直接购买。
 */
export const LEVER_DEFS = [
  { key: 'fiscal', label: '财政整顿', accent: '#e8a317', hint: '清丈税基、抑制兼并、压住开支——财政是其余三线的弹药库。' },
  { key: 'elite', label: '抑制内卷', accent: '#c41e3a', hint: '裁汰冗员、打破分利联盟——注意：内卷随承平自增，只能压低起点。' },
  { key: 'periphery', label: '边防经略', accent: '#22d3ee', hint: '边患外压的对冲投入——买安全或建武备，都按这一杆计价。' },
  { key: 'mobilize', label: '动员革新', accent: '#10b981', hint: '兵制财税链路的更新——动员失灵时，纸面国力无法变现为组织力。' },
];

// ---------------------------------------------------------------------------
// 一、六个王朝案例（史学常识级粗粒度示意 · 理想型标定，非实证测量）
// factors：五因子 0-100，值高=病重；collapse ≤30 字。
// ---------------------------------------------------------------------------
export const DYNASTY_CASES = [
  {
    id: 'han', name: '汉', span: '前 202 — 220', color: '#c41e3a',
    peak: '文景休养至武帝鼎盛，编户齐民把动员推到农业帝国上限。',
    collapse: '土地兼并掏空税基，豪强坐大，黄巾一击中枢失血而亡',
    factors: { fiscal: 75, elite: 70, periphery: 45, mobilize: 65, legitimacy: 60 },
    lesson: '税基被谁吃掉，江山就改姓谁——兼并不治，动员必亡。',
  },
  {
    id: 'tang', name: '唐', span: '618 — 907', color: '#e8a317',
    peak: '贞观开元双峰，府兵、均田、科举三件套同时在线。',
    collapse: '均田崩则府兵崩，藩镇外包暴力，黄巢斩断江淮财线',
    factors: { fiscal: 70, elite: 55, periphery: 65, mobilize: 85, legitimacy: 50 },
    lesson: '暴力一旦外包给边镇，迟早自立门户。',
  },
  {
    id: 'song', name: '宋', span: '960 — 1279', color: '#22d3ee',
    peak: '经济、科技、商业与城市化的古代巅峰，财富密度空前。',
    collapse: '三冗拖垮财政，岁币买不来的安全最终由崖山支付',
    factors: { fiscal: 80, elite: 75, periphery: 95, mobilize: 70, legitimacy: 40 },
    lesson: '花钱买安全是有效的，直到对手要的不再是钱。',
  },
  {
    id: 'ming', name: '明', span: '1368 — 1644', color: '#8b5cf6',
    peak: '永宣盛世远航四海，白银流入重写财政底层。',
    collapse: '财政枯竭撞上小冰期，辽饷催出流寇，两线对穿而亡',
    factors: { fiscal: 90, elite: 85, periphery: 75, mobilize: 70, legitimacy: 65 },
    lesson: '双线作战的本质是财政自杀，省出来的俸禄最后都变成辽饷。',
  },
  {
    id: 'qing', name: '清', span: '1644 — 1840（盛清至中衰）', color: '#10b981',
    peak: '康乾盛世人口破三亿，疆域整合至农业时代极限。',
    collapse: '人口爆炸吃尽盈余，白莲教耗空国库，盛极而衰',
    factors: { fiscal: 65, elite: 60, periphery: 35, mobilize: 55, legitimacy: 45 },
    lesson: '盛世的人口红利，就是下一轮危机的本金。',
  },
  {
    id: 'lateqing', name: '晚清', span: '1840 — 1912', color: '#fb923c',
    peak: '同治中兴与洋务自强，旧栈对工业文明的最后一次自我修补。',
    collapse: '赔款抽干财政，新军倒戈，认受归零后一夜瓦解',
    factors: { fiscal: 85, elite: 75, periphery: 95, mobilize: 80, legitimacy: 95 },
    lesson: '改革窗口拖过之后，改革本身也会变成催命符。',
  },
];

// ---------------------------------------------------------------------------
// 二、治乱周期六阶段（理想型阶段刻度 · 由健康度区间映射）
// ---------------------------------------------------------------------------
export const CYCLE_STAGES = [
  { id: 'founding', label: '开国整合', color: '#10b981', desc: '旧分利联盟被战争清洗，土地与权力重新分配，系统以最低包袱启动。' },
  { id: 'expansion', label: '盛世扩张', color: '#22d3ee', desc: '税基充裕、动员高效，儒法引擎全速运转，盈余掩盖一切结构问题。' },
  { id: 'stagnation', label: '承平积弊', color: '#e8a317', desc: '精英内卷与分利联盟随承平自增，盈余被存量结构逐期吃掉。' },
  { id: 'reform', label: '改革窗口', color: '#fb923c', desc: '问题已可见、资源还够用——历史上的变法多发生于此段，也多失败于此段。' },
  { id: 'crisis', label: '系统性危机', color: '#c41e3a', desc: '财政、动员、认受多线同时告急，任何单点修补都不再起效。' },
  { id: 'collapse', label: '崩溃重组', color: '#64748b', desc: '健康度跌破崩溃线，系统进入清算与重组，等待下一轮整合。' },
];

// ---------------------------------------------------------------------------
// 三、王朝生命周期推演 simDynasty —— 确定性差分模型（零随机）
// ----------------------------------------------------------------------------
// 输入：四杆 0-100（治理投入方向，值越高对应风险越被压制；缺省 50）。
// 机理：
//   健康度初值 START = 80（开国整合：低包袱但非满血——战争创伤仍在）。
//   每期衰减 = 基础熵增 BASE_ENTROPY(3)
//             + Σ 各风险因子未被压制部分 × 权重
//     未被压制部分 = 100 - 杆值（财政/边患/动员三线为静态敞口）。
//   精英内卷自增：eliteRisk(t) = min(100, (100-杆值) + ELITE_DRIFT×(t-1))。
//     机理：承平越久，功名集团与分利联盟越大、岗位与恩荫越固化——内卷
//     是时间的函数而非单纯投入的函数；抑制投入只能压低起点、压不住趋势。
//     这正是「只压财政不管精英 → 中后期仍崩」的来源：内卷自增吃掉盈余。
//   周期阶段：由健康度区间映射（第 1 期固定为开国整合）：
//     ≥70 盛世扩张 / ≥55 承平积弊 / ≥40 改革窗口 / ≥25 系统性危机 / <25 崩溃重组。
//   崩溃：健康度首次 < 25 的期数（1-12，1-based）；十二期内未跌破则为 null。
// 标定锚点（验收口径）：
//   四杆全 80 → 十二期不崩（终局≈26.5）→ 中兴续命；
//   四杆全 20 → 第 7 期崩（落在 5-9 验收带内）→ 速朽之局；
//   只压财政（85）不管精英（25）→ 第 9 期仍崩——内卷自增吃掉财政盈余。
// ============================================================================
const START = 80;            // 健康度初值
const BASE_ENTROPY = 3;      // 每期基础熵增（组织老化的不可避免部分）
const ELITE_DRIFT = 2.5;     // 精英内卷每期自增量（承平越久内卷越重）
const COLLAPSE_LINE = 25;    // 崩溃线
const PERIODS = 12;          // 推演期数
const W = { fiscal: 0.022, elite: 0.024, periphery: 0.014, mobilize: 0.018 }; // 风险权重

const round1 = (x) => Math.round(x * 10) / 10;

/** 杆值归一：缺省 50，显式 0 保留为 0，夹取 [0,100] */
function clampLever(v) {
  const n = Number(v);
  return Number.isFinite(n) ? Math.max(0, Math.min(100, n)) : 50;
}

/** 健康度 → 阶段下标（第 1 期固定为开国整合） */
function stageOf(h, i) {
  if (i === 0) return 0;
  if (h >= 70) return 1;
  if (h >= 55) return 2;
  if (h >= 40) return 3;
  if (h >= 25) return 4;
  return 5;
}

/** 四档判定：崩溃期数 + 终局健康度 → {label,color,note} */
function judge(collapse, finalH) {
  if (collapse === null) {
    return finalH >= 40
      ? { label: '长治久安', color: '#10b981', note: '四线投入压住风险敞口，但基础熵增仍在累积——长治不是永治，只是把清算推迟到推演窗口之外。' }
      : { label: '中兴续命', color: '#22d3ee', note: '系统带病运行而未击穿底线，相当于一次成功的中兴——续命换来的时间若不用于结构改革，只是把崩溃定价后移。' };
  }
  if (collapse >= 11) {
    return { label: '中兴续命', color: '#22d3ee', note: '撑过十期后才跌破崩溃线——属晚崩之局，盈余足够完成一次中兴，但没有完成第二次。' };
  }
  if (collapse >= 8) {
    return { label: '危机四伏', color: '#e8a317', note: '中后期跌破崩溃线——盛世盈余被积弊逐期吃掉，改革窗口出现过，但投入组合没有接住。' };
  }
  return { label: '速朽之局', color: '#c41e3a', note: '风险全敞口叠加内卷自增，系统在前中期即击穿底线——速朽不是意外，是配置的必然。' };
}

/**
 * 王朝生命周期推演（确定性纯函数）。
 * @param {{fiscal?:number, elite?:number, periphery?:number, mobilize?:number}} levers
 * @returns {{curve:number[], stageIdx:number[], collapse:number|null, verdict:{label:string,color:string,note:string}}}
 */
export function simDynasty({ fiscal, elite, periphery, mobilize } = {}) {
  const F = clampLever(fiscal);
  const E = clampLever(elite);
  const P = clampLever(periphery);
  const M = clampLever(mobilize);

  const curve = [round1(START)];
  let h = START;

  // 第 t 期 → 第 t+1 期的衰减（t 从 1 起，共 PERIODS-1 次转移）
  for (let t = 1; t < PERIODS; t++) {
    const eliteRisk = Math.min(100, (100 - E) + ELITE_DRIFT * (t - 1)); // 内卷随承平自增
    const decay = BASE_ENTROPY
      + (100 - F) * W.fiscal
      + eliteRisk * W.elite
      + (100 - P) * W.periphery
      + (100 - M) * W.mobilize;
    h = Math.max(0, Math.min(100, h - decay));
    curve.push(round1(h));
  }

  const stageIdx = curve.map((v, i) => stageOf(v, i));
  const firstBelow = curve.findIndex((v) => v < COLLAPSE_LINE);
  const collapse = firstBelow === -1 ? null : firstBelow + 1; // 1-based 期数
  const verdict = judge(collapse, curve[curve.length - 1]);

  return { curve, stageIdx, collapse, verdict };
}

// ---------------------------------------------------------------------------
// 四、最近案例匹配（仅为框架类比 · 非历史比附）
// 把四杆翻译为风险敞口（100-杆值），与各案例的四同名因子求欧氏距离。
// legitimacy 不参与匹配：模拟器中它是下游结果，没有对应杆。
// ---------------------------------------------------------------------------
const MATCH_KEYS = ['fiscal', 'elite', 'periphery', 'mobilize'];

/**
 * @param {{fiscal?:number, elite?:number, periphery?:number, mobilize?:number}} levers
 * @returns {{kase: object, dist: number}} 距离最近的案例与四因子欧氏距离
 */
export function findNearestCase(levers = {}) {
  const risk = {
    fiscal: 100 - clampLever(levers.fiscal),
    elite: 100 - clampLever(levers.elite),
    periphery: 100 - clampLever(levers.periphery),
    mobilize: 100 - clampLever(levers.mobilize),
  };
  let best = null;
  let bestD = Infinity;
  DYNASTY_CASES.forEach((c) => {
    const d = Math.sqrt(MATCH_KEYS.reduce((s, k) => s + (risk[k] - c.factors[k]) ** 2, 0));
    if (d < bestD) { bestD = d; best = c; }
  });
  return { kase: best, dist: round1(bestD) };
}

// ---------------------------------------------------------------------------
// 五、周期推演报告 buildCivReport（Markdown · 尾注口径声明）
// ctx: { levers: {fiscal,elite,periphery,mobilize}, sim?: simDynasty 结果 }
// sim 缺省时按 levers 现算（同为确定性，结果一致）。
// ---------------------------------------------------------------------------
export function buildCivReport(ctx = {}) {
  const levers = ctx.levers || {};
  const sim = ctx.sim || simDynasty(levers);
  if (!Array.isArray(sim.curve) || sim.curve.length !== PERIODS) {
    throw new Error('buildCivReport: 需要合法的 simDynasty 结果');
  }
  const lv = (k) => clampLever(levers[k]);
  const at = (p) => sim.curve[p - 1]; // 1-based 期数取健康度

  const minH = Math.min(...sim.curve);
  const minIdx = sim.curve.indexOf(minH) + 1;
  const near = findNearestCase(levers);

  const L = [];
  L.push('# 治乱周期推演报告 · 理想型框架');
  L.push('');
  L.push('## 投入组合（四杆 0-100 · 值高=对应风险被压制）');
  LEVER_DEFS.forEach((d) => {
    L.push(`- ${d.label}：${lv(d.key)} / 100`);
  });
  L.push('');
  L.push('## 十二期轨迹关键点（健康度初值 80 · 崩溃线 25）');
  L.push(`- 第 1 期（开国整合）：健康度 ${at(1)}`);
  L.push(`- 第 4 期：健康度 ${at(4)} · ${CYCLE_STAGES[sim.stageIdx[3]].label}`);
  L.push(`- 第 8 期：健康度 ${at(8)} · ${CYCLE_STAGES[sim.stageIdx[7]].label}`);
  L.push(`- 第 12 期（终局）：健康度 ${at(12)} · ${CYCLE_STAGES[sim.stageIdx[11]].label}`);
  L.push(`- 全程最低：${minH}（第 ${minIdx} 期）`);
  L.push(
    sim.collapse
      ? `- 崩溃节点：第 ${sim.collapse} 期跌破崩溃线 25`
      : '- 崩溃节点：十二期内未跌破崩溃线 25'
  );
  L.push('');
  L.push('## 阶段变迁');
  sim.stageIdx.forEach((st, i) => {
    if (i === 0 || st !== sim.stageIdx[i - 1]) {
      L.push(`- 第 ${i + 1} 期 ${i === 0 ? '·' : '→ 进入'}「${CYCLE_STAGES[st].label}」`);
    }
  });
  L.push('');
  L.push('## 判定');
  L.push(`- **${sim.verdict.label}** —— ${sim.verdict.note}`);
  L.push('');
  L.push('## 框架类比（仅为理想型对照 · 非历史比附）');
  L.push(`- 当前风险组合与「${near.kase.name}」案例的四因子距离最近（欧氏距离 ${near.dist}）——${near.kase.name}：${near.kase.collapse}。教训：${near.kase.lesson}`);
  L.push('- 注：类比只说明风险结构在框架内相似，不构成任何历史实证或现实影射。');
  L.push('');
  L.push('---');
  L.push('理想型框架 · 非实证史学 · 非现实影射');
  return L.join('\n');
}
