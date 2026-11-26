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
