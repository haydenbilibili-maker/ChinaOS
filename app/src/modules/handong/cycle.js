// ============================================================
// 汉东省治理沙盘 · 任期治理周期引擎（cycle.js）
// ------------------------------------------------------------
// 定位：纯函数引擎层，承载「回合=年度」的任期治理周期——
//   省态三表（经济动能/社会元气/财政余力）逐年演化、
//   财政余力决定年度政策预算、治理失分留下余波事件、
//   官员成长维度与连任疲劳、五年任期届满考核定级与换届总结。
// 零 React、零外部依赖、不 import 任何模块——可直接 node 冒烟。
// 声明：全部系数为示意标定，非预测；虚构省份推演，
//       不构成对任何真实地区、真实人物的评价或预测。
// ============================================================

const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v));

// ---------- 任期常量 ----------

export const TERM_YEARS = 5;

// 省态三表：任期内持续演化的三条生命线
export const METRICS = [
  { id: 'econ',   label: '经济动能', color: '#22d3ee', desc: '增长引擎的转速——危机砸经济/科技/能源域时掉血，年度自然修复' },
  { id: 'social', label: '社会元气', color: '#10b981', desc: '民生与舆论的承受力——社会/外部域受创时掉血，掉穿后余波更凶' },
  { id: 'fiscal', label: '财政余力', color: '#e8a317', desc: '救火的弹药库——金融域受创与大额政策投放都在消耗它，决定明年预算' },
];

// ---------- 三表初始化与演化 ----------

// 由剧本基线修正（六域序：科技产业/经济/社会民生/外部环境/能源资源/金融财政）
// 推出上任时的省情底子：底子越差的域，对应表初值越低。0-100 整数。
export function initMetrics(baselineMods) {
  const m = baselineMods || [0, 0, 0, 0, 0, 0];
  return {
    econ:   clamp(64 - Math.round((m[0] + m[1] + m[4]) / 2), 35, 85),
    social: clamp(64 - Math.round((m[2] + m[3]) / 1.5), 35, 85),
    fiscal: clamp(64 - Math.round(m[5] * 1.2), 35, 85),
  };
}

// 年度政策预算：财政余力换算成当年可投放的政策点数总额。
// fiscal 50→100、20→70、80→130——穷省救火，先看弹药库。
export function yearBudget(fiscal) {
  return clamp(Math.round(100 * (0.5 + fiscal / 100)), 60, 130);
}

// 年度结算：净烈度 net（六域）与已投放预算 allocUsed 共同决定三表掉血，
// 自然修复每表 +5（社会元气掉穿 35 后只 +3——元气伤了恢复更慢）。
export function evolveMetrics(metrics, net, allocUsed) {
  const econDmg   = (net[0] * 0.35 + net[1] * 0.45 + net[4] * 0.20) * 0.30;
  const socialDmg = (net[2] * 0.60 + net[3] * 0.40) * 0.35;
  const fiscalDmg = (net[5] * 0.65 + net[1] * 0.35) * 0.30 + allocUsed * 0.06; // 大手笔投放本身烧财政
  const socialRecover = metrics.social < 35 ? 3 : 5;
  return {
    econ:   clamp(Math.round(metrics.econ   + 5             - econDmg),   5, 100),
    social: clamp(Math.round(metrics.social + socialRecover - socialDmg), 5, 100),
    fiscal: clamp(Math.round(metrics.fiscal + 5             - fiscalDmg), 5, 100),
  };
}

// ---------- 余波事件 ----------

// 治理失分（score>=60）不会翻篇：同一条危机线次年按 0.55 烈度二次引爆。
export function aftermathOf(scenario, score, intensity) {
  if (score < 60) return null;
  return {
    sourceId: scenario.id,
    label: scenario.label + ' · 余波',
    intensity: clamp(Math.round(intensity * 0.55), 25, 80),
    note: '上一年治理失分留下的次生灾害：同一条危机线按 0.55 烈度二次引爆，处置班子带伤作战。',
  };
}

// ---------- 官员成长与疲劳 ----------

// 参战成长方向：本场危机最吃重的两个维度（need 最大两项，并列取下标小者）。
export function growthDims(need) {
  let top = 0;
  for (let i = 1; i < need.length; i++) if (need[i] > need[top]) top = i;
  let second = top === 0 ? 1 : 0;
  for (let i = 0; i < need.length; i++) {
    if (i === top) continue;
    if (need[i] > need[second]) second = i;
  }
  return [top, second];
}

// 连任疲劳：连续在岗年数 → 全维临时折减。板凳深度也是治理能力。
export function fatiguePenalty(streak) {
  return streak >= 5 ? -10 : streak >= 3 ? -6 : 0;
}

// ---------- 任期考核 ----------

// 五年账本定级：history=[{year,score,verdict,label,intensity}...]（长度 1-5）。
// score 是失分——越低越好；>=60 记一次治理失守。
export function termGrade(history) {
  const n = Math.max(1, history.length);
  const avg = history.reduce((s, h) => s + h.score, 0) / n;
  const excellentRate = history.filter((h) => h.score < 30).length / n; // 优良率
  const failCount = history.filter((h) => h.score >= 60).length;       // 失分次数

  let grade;
  if (avg < 25 && failCount === 0) grade = 'S';
  else if (avg < 40 && failCount <= 1) grade = 'A';
  else if (avg < 55) grade = 'B';
  else grade = 'C';

  const BOOK = {
    S: { color: '#10b981', name: '治理标杆任期', note: '五年无一次失守，危机线被逐条按灭——这种任期写进教材，也写进对手的复盘。' },
    A: { color: '#22d3ee', name: '稳健有为任期', note: '偶有失手但大盘没破，治理机器在高压下保持了转速。' },
    B: { color: '#e8a317', name: '守成补漏任期', note: '及格线上的五年：危机没有失控，但余波与欠账都留给了下一届。' },
    C: { color: '#c41e3a', name: '风险失控任期', note: '失分成串、三表见底，这份任期总结更像一份事故报告。' },
  };
  const b = BOOK[grade];
  return {
    grade,
    color: b.color,
    title: grade + ' · ' + b.name,
    note: b.note,
    avg: Math.round(avg * 10) / 10,
    excellentRate: Math.round(excellentRate * 100),
    failCount,
  };
}

// ---------- 换届总结 ----------

// 任期总结（Markdown）：届满结算的全部账目——定级、大事记、三表变迁、班子去向。
// ctx = { startYear, history[], metricsStart, metricsEnd, grade, roster[], aftermathCount }
export function buildTermReport(ctx) {
  const startYear = ctx.startYear || 2026;
  const endYear = startYear + TERM_YEARS - 1;
  const termNo = Math.max(1, Math.floor((startYear - 2026) / TERM_YEARS) + 1);
  const lines = [];

  lines.push('# 汉东省第 ' + termNo + ' 届班子任期总结（' + startYear + '—' + endYear + '）');
  lines.push('');

  lines.push('## 任期考核定级');
  lines.push('');
  lines.push('**' + ctx.grade.title + '**');
  lines.push('');
  lines.push(ctx.grade.note);
  lines.push('');

  lines.push('## 五年大事记');
  lines.push('');
  ctx.history.forEach((h) => {
    const verdictLabel = Array.isArray(h.verdict) ? h.verdict[0] : h.verdict;
    lines.push('- **' + h.year + ' 年 · ' + h.label + '**（烈度 ' + h.intensity + '）：净冲击 ' + h.score + ' · ' + verdictLabel);
  });
  lines.push('');
  lines.push('任期内余波事件 ' + (ctx.aftermathCount || 0) + ' 起——失分的代价从不当年结清。');
  lines.push('');

  lines.push('## 省态三表变迁');
  lines.push('');
  METRICS.forEach((m) => {
    const a = ctx.metricsStart[m.id];
    const b = ctx.metricsEnd[m.id];
    const d = b - a;
    lines.push('- ' + m.label + '：' + a + ' → ' + b + '（Δ' + (d >= 0 ? '+' : '') + d + '）');
  });
  lines.push('');

  lines.push('## 班子去向建议');
  lines.push('');
  ctx.roster.forEach((r) => {
    const judgeLabel = Array.isArray(r.judge) ? r.judge[0] : r.judge;
    let row = '- ' + r.name + '（' + r.postLabel + '）：累计政绩 ' + r.merit + ' · ' + judgeLabel;
    if (r.real) row += '（公开履历画像 · 虚构推演）';
    lines.push(row);
  });
  lines.push('');

  lines.push('---');
  lines.push('');
  lines.push('虚构省份任期推演，全部系数为示意标定；不构成对任何真实人物的人事评价或预测。');

  return lines.join('\n');
}
