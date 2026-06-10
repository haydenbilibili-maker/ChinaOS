// 民营经济500强 · 地理与聚合工具

export const shortProv = (p) => (p || '').replace(/(省|市|自治区|回族|壮族|维吾尔|生产建设兵团)/g, '');

export const RANK_TIERS = [
  { key: 't10', label: 'Top 10', min: 1, max: 10, color: '#fb923c' },
  { key: 't50', label: 'Top 50', min: 11, max: 50, color: '#22d3ee' },
  { key: 't100', label: 'Top 100', min: 51, max: 100, color: '#e8a317' },
  { key: 't500', label: '101–500', min: 101, max: 500, color: '#64748b' },
];

export function tally(rows, key) {
  const m = new Map();
  rows.forEach((r) => { const k = r[key]; if (k) m.set(k, (m.get(k) || 0) + 1); });
  return [...m.entries()].sort((a, b) => b[1] - a[1]);
}

export function tierOf(rank) {
  return RANK_TIERS.find((t) => rank >= t.min && rank <= t.max) || RANK_TIERS[3];
}

/** 按省份聚合：企业数、营收汇总、Top3 企业名 */
export function aggregateByProvince(companies) {
  const m = new Map();
  (companies || []).forEach((c) => {
    const p = c.province;
    if (!p) return;
    if (!m.has(p)) m.set(p, { province: p, count: 0, revenueYi: 0, top: [] });
    const row = m.get(p);
    row.count += 1;
    row.revenueYi += c.revenueYi || 0;
    row.top.push(c);
  });
  return [...m.values()].map((row) => {
    row.top.sort((a, b) => a.rank - b.rank);
    row.topNames = row.top.slice(0, 3).map((c) => c.name);
    row.revenueYi = Math.round(row.revenueYi * 100) / 100;
    return row;
  }).sort((a, b) => b.count - a.count);
}

/** ChinaMap / ECharts 地图数据 */
export function mapMetricsFromAgg(agg) {
  const maxCount = Math.max(...agg.map((a) => a.count), 1);
  const maxRev = Math.max(...agg.map((a) => a.revenueYi), 1);
  const byProv = Object.fromEntries(agg.map((a) => [a.province, a]));
  return {
    byProv,
    count: {
      key: 'count',
      label: '企业数',
      valueName: '上榜企业数',
      max: maxCount,
      data: agg.map((a) => ({ name: a.province, value: a.count, extra: a })),
    },
    revenue: {
      key: 'revenue',
      label: '营收汇总',
      valueName: '营收汇总(亿元)',
      max: maxRev,
      data: agg.map((a) => ({ name: a.province, value: a.revenueYi, extra: a })),
    },
  };
}

export function tierDistribution(companies) {
  return RANK_TIERS.map((t) => ({
    ...t,
    count: (companies || []).filter((c) => c.rank >= t.min && c.rank <= t.max).length,
  }));
}

export function buildCompanyIndex(people, equity) {
  const founders = new Map();
  const managers = new Map();
  const eqDepth = new Map();
  (people || []).forEach((p) => {
    if (p.roleType === 'founder') founders.set(p.companyId, (founders.get(p.companyId) || 0) + 1);
    if (p.roleType === 'manager') managers.set(p.companyId, (managers.get(p.companyId) || 0) + 1);
  });
  (equity || []).forEach((e) => eqDepth.set(e.companyId, (eqDepth.get(e.companyId) || 0) + 1));
  return { founders, managers, eqDepth };
}
