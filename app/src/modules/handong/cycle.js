// ============================================================
// 汉东省治理沙盘 · 任期治理周期引擎（cycle.js）
// ------------------------------------------------------------
// 定位：纯函数引擎层，承载「回合=年度」的任期治理周期——
//   省态三表（经济动能/社会元气/财政余力）逐年演化、
//   财政余力决定年度政策预算、治理失分留下余波事件、
//   官员成长维度与连任疲劳、五年任期届满考核定级与换届总结、
//   换届连任结算（succession）与跨届治理史拼接（mergeTermHistory）。
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

// ---------- 换届连任 ----------

// 岗位标签（与 handongData.POSTS 对齐的硬编码副本——保持本文件零依赖可 node 冒烟）
const SUCC_POST_LABEL = {
  secretary: '省委书记', governor: '省长', deputy: '常务副省长',
  organize: '组织部长', law: '政法委书记', propaganda: '宣传部长',
};
const postLabelOf = (pid) => SUCC_POST_LABEL[pid] || pid;

// 换届结算：按 promotionJudge 同口径阈值内联判断（不 import handongData 保持零依赖）——
//   merit>=70 拟提拔 / >=50 留任 / >=38 诫勉 / 其余 调整出局。
// 人事规则：
//   书记拟提拔 → 上调中央历练（离任出缺，不计 removed）；
//   省长拟提拔 → 升任书记；常务副拟提拔 → 升任省长；
//   其余岗位拟提拔 → 竞聘常务副（merit 最高者得，并列取岗序在前者，其余原岗留任）；
//   调整（merit<38）→ 出局进 removed（转任非领导职务）；诫勉 → 原岗留任带警示；留任 → 原岗。
// 晋升链按 书记→省长→常务副 顺序结算避免冲突；空出岗位置 null。
// 返回 { nextAssign, moves:[{name,from,to,reason}], removed:[officialId] }。
export function succession(assign, officials) {
  const byId = {};
  (officials || []).forEach((o) => { byId[o.id] = o; });
  const verdictOf = (m) => (m >= 70 ? 'promote' : m >= 50 ? 'stay' : m >= 38 ? 'warn' : 'out');

  const postIds = Object.keys(assign || {});
  const next = {};
  postIds.forEach((pid) => { next[pid] = (assign && assign[pid]) || null; });
  const moves = [];
  const removed = [];

  // 0) 调整出局：merit<38 全员先清场——无论在哪个岗，一律转任非领导职务
  postIds.forEach((pid) => {
    const o = next[pid] ? byId[next[pid]] : null;
    if (o && verdictOf(o.merit) === 'out') {
      removed.push(o.id);
      next[pid] = null;
      moves.push({
        name: o.name, from: postLabelOf(pid), to: '非领导职务',
        reason: '政绩 ' + o.merit + ' 落入调整档（<38）：转任非领导职务',
      });
    }
  });

  // 1) 书记：拟提拔 → 上调中央历练（离任出缺，不进 removed）
  const secO = next.secretary ? byId[next.secretary] : null;
  if (secO && verdictOf(secO.merit) === 'promote') {
    next.secretary = null;
    moves.push({
      name: secO.name, from: postLabelOf('secretary'), to: '中央历练',
      reason: '政绩 ' + secO.merit + ' 拟提拔：上调中央历练，书记岗出缺',
    });
  }

  // 2) 省长：拟提拔 → 升任书记（书记岗未出缺则原岗留任待机）
  const govO = next.governor ? byId[next.governor] : null;
  if (govO && verdictOf(govO.merit) === 'promote') {
    if (next.secretary === null) {
      next.secretary = govO.id;
      next.governor = null;
      moves.push({
        name: govO.name, from: postLabelOf('governor'), to: postLabelOf('secretary'),
        reason: '政绩 ' + govO.merit + ' 拟提拔：循链升任省委书记',
      });
    } else {
      moves.push({
        name: govO.name, from: postLabelOf('governor'), to: postLabelOf('governor'),
        reason: '政绩 ' + govO.merit + ' 拟提拔，但书记岗未出缺：原岗留任待机',
      });
    }
  }

  // 3) 常务副：拟提拔 → 升任省长（省长岗未出缺则原岗留任待机）
  const depO = next.deputy ? byId[next.deputy] : null;
  if (depO && verdictOf(depO.merit) === 'promote') {
    if (next.governor === null) {
      next.governor = depO.id;
      next.deputy = null;
      moves.push({
        name: depO.name, from: postLabelOf('deputy'), to: postLabelOf('governor'),
        reason: '政绩 ' + depO.merit + ' 拟提拔：循链升任省长',
      });
    } else {
      moves.push({
        name: depO.name, from: postLabelOf('deputy'), to: postLabelOf('deputy'),
        reason: '政绩 ' + depO.merit + ' 拟提拔，但省长岗未出缺：原岗留任待机',
      });
    }
  }

  // 4) 其余岗位：拟提拔者竞聘常务副——merit 最高者得（并列取岗序在前者），其余原岗留任
  const chainPosts = ['secretary', 'governor', 'deputy'];
  const contenders = postIds
    .filter((pid) => chainPosts.indexOf(pid) === -1)
    .map((pid) => ({ pid, o: next[pid] ? byId[next[pid]] : null }))
    .filter((c) => c.o && verdictOf(c.o.merit) === 'promote');
  if (contenders.length && next.deputy === null) {
    let win = contenders[0];
    contenders.forEach((c) => { if (c.o.merit > win.o.merit) win = c; });
    next.deputy = win.o.id;
    next[win.pid] = null;
    moves.push({
      name: win.o.name, from: postLabelOf(win.pid), to: postLabelOf('deputy'),
      reason: '政绩 ' + win.o.merit + ' 拟提拔：竞聘常务副省长胜出（' + contenders.length + ' 人竞聘）',
    });
    contenders.forEach((c) => {
      if (c === win) return;
      moves.push({
        name: c.o.name, from: postLabelOf(c.pid), to: postLabelOf(c.pid),
        reason: '政绩 ' + c.o.merit + ' 拟提拔：竞聘常务副未果，原岗留任',
      });
    });
  } else if (contenders.length) {
    contenders.forEach((c) => {
      moves.push({
        name: c.o.name, from: postLabelOf(c.pid), to: postLabelOf(c.pid),
        reason: '政绩 ' + c.o.merit + ' 拟提拔，但常务副岗未出缺：原岗留任待机',
      });
    });
  }

  // 5) 诫勉：原岗留任带警示（诫勉档不会被晋升链移动，直接按 next 现状记纪要）
  postIds.forEach((pid) => {
    const o = next[pid] ? byId[next[pid]] : null;
    if (o && verdictOf(o.merit) === 'warn') {
      moves.push({
        name: o.name, from: postLabelOf(pid), to: postLabelOf(pid),
        reason: '政绩 ' + o.merit + ' 落入诫勉档（38-49）：原岗留任带警示',
      });
    }
  });

  return { nextAssign: next, moves, removed };
}

// ---------- 跨届治理史 ----------

// 把多届 history 连成一条跨届序列 [{x:'T1Y1',score,term}...]，供跨届净冲击连线。
// termHistory = [{term, history:[{year,score,...}...]}...]；容错：缺 term 按下标补，缺 year 按序号补。
export function mergeTermHistory(termHistory) {
  const seq = [];
  (termHistory || []).forEach((t, ti) => {
    const tn = t && t.term != null ? t.term : ti + 1;
    ((t && t.history) || []).forEach((h, hi) => {
      seq.push({
        x: 'T' + tn + 'Y' + (h && h.year != null ? h.year : hi + 1),
        score: h ? h.score : 0,
        term: tn,
      });
    });
  });
  return seq;
}
