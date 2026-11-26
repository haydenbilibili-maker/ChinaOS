// 复杂网络观测模型 · 纯函数（可单测，无副作用）

const round1 = (x) => Math.round(x * 10) / 10;

/** 全会出席率（%）与较上次全会的百分点变化 */
export function plenumRates(plenums, base) {
  return plenums.map((r, i) => {
    const total = r.full + r.alternates;
    const share = round1((total / base) * 100);
    const prev = i > 0 ? plenums[i - 1] : null;
    const prevShare = prev ? round1(((prev.full + prev.alternates) / base) * 100) : null;
    return { ...r, total, share, change: prevShare === null ? null : round1(share - prevShare) };
  });
}

/** 精英稳定性汇总：军委原成员在任、政治局原委员被查、预警指标数 */
export function eliteKpis({ cmc, politburo, indicators }) {
  const original = politburo.filter((r) => !r.added);
  return {
    cmcRetained: cmc.filter((r) => r.inOffice).length,
    cmcTotal: cmc.length,
    pbPurged: original.filter((r) => r.status === '被查处').length,
    pbOriginal: original.length,
    warnCount: indicators.filter((r) => r.status === '预警').length,
    indTotal: indicators.length,
  };
}

/**
 * 贝叶斯更新：P(S_i | E) = P(E | S_i)·P(S_i) / Σ_j P(E | S_j)·P(S_j)
 * prior: { id: 概率(%) }；likelihood: { id: P(E|S) }；返回后验（%，一位小数）
 */
export function bayesUpdate(prior, likelihood) {
  const ids = Object.keys(prior);
  const weights = ids.map((id) => (prior[id] / 100) * (likelihood[id] ?? 0));
  const sum = weights.reduce((a, b) => a + b, 0);
  if (sum <= 0) return { ...prior };
  return Object.fromEntries(ids.map((id, i) => [id, round1((weights[i] / sum) * 100)]));
}

/** 情景按维度分组，保持原始顺序 */
export function groupScenarios(scenarios) {
  const out = [];
  for (const s of scenarios) {
    let g = out.find((x) => x.dimension === s.dimension);
    if (!g) { g = { dimension: s.dimension, items: [] }; out.push(g); }
    g.items.push(s);
  }
  return out;
}

/** 在任政治局委员按圈层计数，降序 */
export function circleCounts(politburo) {
  const m = new Map();
  for (const r of politburo) {
    if (r.status !== '在任') continue;
    m.set(r.circle, (m.get(r.circle) || 0) + 1);
  }
  return [...m.entries()].sort((a, b) => b[1] - a[1]);
}

/** 依次应用多条似然，返回最终后验（%） */
export function applySignals(prior, likes) {
  return likes.reduce((p, like) => bayesUpdate(p, like), { ...prior });
}

/** 领导层维度概率轨迹：起点 + 每条已发生事件后的后验 */
export function lTrajectory(base, updates) {
  const points = [{ label: '起点', date: null, probs: { ...base } }];
  let p = { ...base };
  for (const u of updates) {
    p = bayesUpdate(p, u.like);
    points.push({ label: u.label, date: u.date, event: u.event, why: u.why, like: u.like, probs: p });
  }
  return points;
}

/** 接班候选池：在任、未到龄、出生年在给定区间内的政治局委员 */
export function successorPool(politburo, [from, to]) {
  return politburo.filter((r) => r.status === '在任' && r.ageOut2027 === false && r.birthYear >= from && r.birthYear <= to);
}

/** 各分组的指标状态计数 */
export function indicatorDimSummary(indicators, groups) {
  return groups.map((g) => {
    const rows = indicators.filter((r) => r.group === g);
    const count = (s) => rows.filter((r) => r.status === s).length;
    return { group: g, total: rows.length, warn: count('预警'), watch: count('关注'), ok: count('正常'), pending: count('待评') };
  });
}

/** 影响某指标的事件（事件 indicators 字段以空格分隔） */
export function eventsForIndicator(events, id) {
  return events.filter((e) => String(e.indicators).split(/\s+/).includes(id));
}

/** 正文中提到某人的事件 */
export function eventsMentioning(events, name) {
  return events.filter((e) => String(e.event).includes(name));
}

/**
 * 构建网络节点与边。snapshot: '2022'（二十大组成时）| '2026'（当前）
 * 节点 id：hub / pipe-* / circle:<圈层> / m:<姓名>
 */
export function buildNetwork({ politburo, extra, pipelines, circles, alias, snapshot = '2026' }) {
  const people = [...politburo.filter((r) => r.circle !== '枢纽'), ...extra].map((r) => ({
    ...r,
    netCircle: alias[r.circle] || r.circle,
    netStatus: snapshot === '2022' ? (r.added ? '未入局' : '在任') : r.status,
  })).filter((r) => r.netStatus !== '未入局');

  const nodes = [{ id: 'hub', name: '习近平', kind: 'hub' }];
  const links = [];
  for (const p of pipelines) {
    nodes.push({ id: p.id, name: p.name, kind: 'pipeline' });
    links.push({ source: 'hub', target: p.id, kind: 'hub-pipe', weight: 3 });
  }
  for (const c of circles) {
    const w = snapshot === '2022' ? c.protect2022 : c.protect2026;
    nodes.push({ id: `circle:${c.id}`, name: c.id, kind: 'circle', protect: w });
    links.push({ source: 'hub', target: `circle:${c.id}`, kind: 'hub-circle', weight: w });
  }
  for (const r of people) {
    const id = `m:${r.name}`;
    nodes.push({ id, name: r.name, kind: 'member', status: r.netStatus, person: r });
    if (circles.some((c) => c.id === r.netCircle)) {
      links.push({ source: id, target: `circle:${r.netCircle}`, kind: 'member-circle', weight: 1, broken: r.netStatus === '被查处' });
    }
    const pipe = pipelines.find((p) => p.members.includes(r.name));
    if (pipe) links.push({ source: id, target: pipe.id, kind: 'member-pipe', weight: 1, broken: r.netStatus === '被查处' });
  }
  return { nodes, links };
}
