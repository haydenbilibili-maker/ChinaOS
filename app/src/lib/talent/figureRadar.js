// ============================================================================
// 人才精英库 · 人物关系雷达评分（可审计启发式，非 LLM）
// ----------------------------------------------------------------------------
// 六维画像：人物关系 / 任职履历 / 教育背景 / 地域家乡 / 机构类型 / 反腐关联
// 各维 0–100；缺失字段时从 title/org/region/career 字符串回退推断。
// ============================================================================

/** @typedef {{ relation: number, career: number, education: number, region: number, institution: number, anticorruption?: number }} RadarScores */

export const RADAR_DIMENSIONS = [
  { key: 'relation', label: '人物关系', color: '#22d3ee' },
  { key: 'career', label: '任职履历', color: '#c41e3a' },
  { key: 'education', label: '教育背景', color: '#8b5cf6' },
  { key: 'region', label: '地域家乡', color: '#e8a317' },
  { key: 'institution', label: '机构类型', color: '#10b981' },
  { key: 'anticorruption', label: '反腐关联', color: '#fb923c', optional: true },
];

const LEVEL_RANK = {
  '党和国家领导人': 0, 正国级: 0, 副国级: 1, 上将: 1, 正部级: 2, 中将: 2,
  省部级: 3, 少将: 3, 副部级: 4, 正厅级: 5, 副厅级: 6,
};

const RANK_BONUS = [
  [/政治局常委/, 95],
  [/政治局委员/, 85],
  [/候补委员/, 70],
  [/中央委员/, 60],
  [/书记处/, 55],
];

const INSTITUTION_WEIGHT = {
  中直: 92, 部委: 88, 人大: 75, 政协: 72, 司法: 78, 央企: 68, 地方人大政协: 62,
};

const SECTOR_WEIGHT = {
  党中央: 95, 国务院: 88, 全国政协: 72, 国家机关: 80, 军队: 82, 央企: 68, 地方: 55,
};

const PROVINCE_RE = /^(北京|上海|天津|重庆|河北|山西|辽宁|吉林|黑龙江|江苏|浙江|安徽|福建|江西|山东|河南|湖北|湖南|广东|广西|海南|四川|贵州|云南|陕西|甘肃|青海|宁夏|新疆|西藏|内蒙古)/;

/** 钳制 0–100 */
export function clampScore(n) {
  if (n == null || Number.isNaN(n)) return 0;
  return Math.max(0, Math.min(100, Math.round(n)));
}

/** 籍贯/地域 → 省级简称 */
export function extractProvince(text) {
  if (!text) return null;
  const m = String(text).match(PROVINCE_RE);
  return m ? m[1] : null;
}

/** 教育 prestige 启发式 */
export function scoreEducation(figure) {
  const hay = [
    figure?.fields?.edu,
    figure?.education,
    figure?.bio,
    ...(figure?.career || []).map((c) => c.desc),
  ].filter(Boolean).join(' ');

  if (!hay) return { score: 22, rationale: '学历字段缺失，按公开任职画像基线估分' };

  let score = 30;
  const signals = [];

  if (/C9|清华|北大|复旦|上交|浙大|南大|中科大|哈工大|西安交大/.test(hay)) {
    score = Math.max(score, 92);
    signals.push('C9/顶尖高校');
  }
  if (/985|中国人民大学|北航|北理工|同济|武大|中山|华中科技|四川大学等/.test(hay) || /985/.test(hay)) {
    score = Math.max(score, 82);
    signals.push('985');
  }
  if (/211/.test(hay)) {
    score = Math.max(score, 68);
    signals.push('211');
  }
  if (/党校|行政学院/.test(hay)) {
    score = Math.max(score, 58);
    signals.push('党校系统');
  }
  if (/海外|留学|美国|英国|日本|哈佛|牛津|剑桥|斯坦福|麻省/.test(hay)) {
    score = Math.max(score, 78);
    signals.push('海外教育');
  }
  if (/博士/.test(hay)) {
    score += 8;
    signals.push('博士');
  } else if (/硕士|研究生/.test(hay)) {
    score += 5;
    signals.push('研究生');
  } else if (/本科|学士|大学/.test(hay)) {
    score += 2;
    signals.push('本科');
  }

  return {
    score: clampScore(score),
    rationale: signals.length ? `识别：${signals.join('、')}` : '仅有泛化教育描述',
  };
}

/** 任职深度：条目数 × 跨度 × 层级 */
export function scoreCareer(figure) {
  const career = figure?.career || figure?.keyEvents || [];
  const level = figure?.level || '';
  let score = 20;
  const parts = [];

  const entries = career.length;
  if (entries) {
    score += Math.min(entries * 10, 45);
    parts.push(`${entries} 段履历`);
  }

  const years = [];
  for (const c of career) {
    const fm = (c.from || '').match(/(\d{4})/);
    const tm = (c.to || '').match(/(\d{4})/);
    if (fm) years.push(+fm[1]);
    if (tm) years.push(+tm[1]);
    else if (fm && !c.to) years.push(new Date().getFullYear());
  }
  if (years.length >= 2) {
    const span = Math.max(...years) - Math.min(...years);
    score += Math.min(span * 1.8, 25);
    parts.push(`系统内约 ${span} 年`);
  }

  const lr = LEVEL_RANK[level];
  if (lr != null) {
    score += (6 - Math.min(lr, 6)) * 6;
    parts.push(`层级 ${level}`);
  }

  const rank = figure?.fields?.rank || '';
  for (const [re, bonus] of RANK_BONUS) {
    if (re.test(rank)) {
      score = Math.max(score, bonus);
      parts.push(rank);
      break;
    }
  }

  return {
    score: clampScore(score),
    rationale: parts.length ? parts.join(' · ') : '履历条目稀少',
  };
}

/** 地域嵌入：籍贯 + 任职省域重叠 + 同乡密度 */
export function scoreRegion(figure, ctx = {}) {
  const allFigures = ctx.allFigures || [];
  const native = extractProvince(figure?.fields?.native);
  const current = extractProvince(figure?.province) || (figure?.province === '中央' ? '中央' : null);

  let score = 15;
  const parts = [];

  if (native) {
    score += 18;
    parts.push(`籍贯 ${native}`);
  }

  const careerProvs = new Set();
  for (const c of figure?.career || []) {
    const p = extractProvince(c.desc);
    if (p) careerProvs.add(p);
  }
  if (careerProvs.size) {
    score += Math.min(careerProvs.size * 8, 32);
    parts.push(`${careerProvs.size} 省任职轨迹`);
  }

  if (native && current && native !== current && current !== '中央') {
    score += 12;
    parts.push('跨省任职');
  }

  if (native && allFigures.length) {
    const peers = allFigures.filter((f) => f.id !== figure.id && extractProvince(f?.fields?.native) === native);
    if (peers.length) {
      const density = Math.min(peers.length * 1.5, 22);
      score += density;
      parts.push(`同乡网络 ${peers.length} 人`);
    }
  }

  return {
    score: clampScore(score),
    rationale: parts.length ? parts.join(' · ') : '地域信息不足',
  };
}

/** 机构类型权重 */
export function scoreInstitution(figure) {
  const inst = figure?.fields?.institutionType;
  const sector = figure?.sector;
  const org = figure?.org || figure?.fields?.title || '';
  let score = 40;
  const parts = [];

  if (inst && INSTITUTION_WEIGHT[inst] != null) {
    score = INSTITUTION_WEIGHT[inst];
    parts.push(inst);
  } else if (sector && SECTOR_WEIGHT[sector] != null) {
    score = SECTOR_WEIGHT[sector];
    parts.push(sector);
  }

  if (/部|委|办|局|署/.test(org) && figure?.province === '中央') {
    score = Math.max(score, 85);
    parts.push('中央部委口径');
  }
  if (/省委|市委书记|省长|自治区/.test(org)) {
    score = Math.max(score, 72);
    parts.push('地方主官');
  }
  if (figure?.sector === '军队') {
    score = Math.max(score, 80);
    parts.push('军队系统');
  }

  return {
    score: clampScore(score),
    rationale: parts.length ? parts.join(' · ') : '机构带未标注',
  };
}

/** 反腐关联：仅当 ctx.antiCorruptionNames 含此人 */
export function scoreAnticorruption(figure, ctx = {}) {
  const names = ctx.antiCorruptionNames;
  if (!names?.size) return { score: 0, rationale: '非反腐队列视图', hidden: true };

  const hit = names.has((figure?.name || '').trim());
  return {
    score: hit ? 88 : 8,
    rationale: hit ? '出现在反腐透视公开通报库' : '未命中反腐通报库',
    hidden: false,
  };
}

/** 人物关系：显式关联 + 同省/同机构/履历共现 */
export function scoreRelation(figure, ctx = {}) {
  const allFigures = ctx.allFigures || [];
  let score = 8;
  const parts = [];

  const related = figure?.relatedEntities || [];
  const crossRefs = figure?.crossRefs || [];
  const tags = Array.isArray(figure?.tags) ? figure.tags : [];

  if (related.length) {
    score += Math.min(related.length * 6, 28);
    parts.push(`显式关联 ${related.length}`);
  }
  if (crossRefs.length) {
    score += Math.min(crossRefs.length * 4, 16);
    parts.push(`交叉引用 ${crossRefs.length}`);
  }
  if (tags.length) {
    score += Math.min(tags.length * 2, 12);
  }

  const native = extractProvince(figure?.fields?.native);
  const orgKey = (figure?.org || '').slice(0, 12);
  const prov = figure?.province;

  let inferred = 0;
  const graph = [];
  for (const other of allFigures) {
    if (other.id === figure.id) continue;
    let w = 0;
    const links = [];

    if (native && extractProvince(other?.fields?.native) === native) {
      w += 2;
      links.push('同乡');
    }
    if (prov && prov !== '中央' && other.province === prov) {
      w += 3;
      links.push('同省任职');
    }
    if (orgKey && orgKey.length > 2 && (other.org || '').includes(orgKey)) {
      w += 4;
      links.push('同机构');
    }

    const careerHay = (figure?.career || []).map((c) => c.desc).join(' ');
    for (const c of other?.career || []) {
      const p = extractProvince(c.desc);
      if (p && careerHay.includes(p)) {
        w += 2;
        links.push('履历共省');
        break;
      }
    }

    if (w > 0) {
      inferred += w;
      if (graph.length < 12) {
        graph.push({ name: other.name, weight: w, links: [...new Set(links)] });
      }
    }
  }

  score += Math.min(inferred * 0.85, 45);
  if (inferred) parts.push(`推断纽带 ${Math.round(inferred)} 点`);

  return {
    score: clampScore(score),
    rationale: parts.length ? parts.join(' · ') : '关系字段稀疏，依赖共现推断',
    graph: graph.sort((a, b) => b.weight - a.weight),
  };
}

/**
 * 计算单人六维分数 + 各维说明
 * @param {object} figure
 * @param {{ allFigures?: object[], antiCorruptionNames?: Set<string>, includeAnticorruption?: boolean }} ctx
 */
export function computeFigureRadarScores(figure, ctx = {}) {
  const rel = scoreRelation(figure, ctx);
  const car = scoreCareer(figure);
  const edu = scoreEducation(figure);
  const reg = scoreRegion(figure, ctx);
  const ins = scoreInstitution(figure);
  const ac = scoreAnticorruption(figure, ctx);

  const includeAc = ctx.includeAnticorruption && !ac.hidden;

  const scores = {
    relation: rel.score,
    career: car.score,
    education: edu.score,
    region: reg.score,
    institution: ins.score,
  };
  if (includeAc) scores.anticorruption = ac.score;

  const breakdown = {
    relation: { score: rel.score, rationale: rel.rationale },
    career: { score: car.score, rationale: car.rationale },
    education: { score: edu.score, rationale: edu.rationale },
    region: { score: reg.score, rationale: reg.rationale },
    institution: { score: ins.score, rationale: ins.rationale },
  };
  if (includeAc) breakdown.anticorruption = { score: ac.score, rationale: ac.rationale };

  return { scores, breakdown, relationGraph: rel.graph || [] };
}

/**
 * 迷你关系网络（tooltip / 侧栏）
 */
export function computeRelationGraph(figure, allFigures = []) {
  const { relationGraph } = computeFigureRadarScores(figure, { allFigures });
  return relationGraph;
}

/** 队列均值（对比叠加） */
export function computeCohortAverage(scoreRows) {
  if (!scoreRows?.length) return null;
  const keys = ['relation', 'career', 'education', 'region', 'institution'];
  const avg = {};
  for (const k of keys) {
    const vals = scoreRows.map((s) => s[k]).filter((v) => v != null);
    avg[k] = vals.length ? clampScore(vals.reduce((a, b) => a + b, 0) / vals.length) : 0;
  }
  return avg;
}

/** 批量计算 */
export function computeRadarBatch(figures, ctx = {}) {
  return (figures || []).map((f) => ({
    figure: f,
    ...computeFigureRadarScores(f, { ...ctx, allFigures: figures }),
  }));
}

/**
 * ECharts 雷达 option（支持双人对比 + 队列均值）
 */
export function buildFigureRadarOption({
  primary,
  compare = null,
  cohortAvg = null,
  includeAnticorruption = false,
}) {
  const dims = RADAR_DIMENSIONS.filter((d) => includeAnticorruption || d.key !== 'anticorruption');
  const indicators = dims.map((d) => ({ name: d.label, max: 100 }));

  const seriesData = [];
  if (primary?.scores) {
    seriesData.push({
      value: dims.map((d) => primary.scores[d.key] ?? 0),
      name: primary.name || '选中',
      lineStyle: { color: '#c41e3a', width: 2 },
      itemStyle: { color: '#c41e3a' },
      areaStyle: { color: 'rgba(196,30,58,0.12)' },
    });
  }
  if (compare?.scores) {
    seriesData.push({
      value: dims.map((d) => compare.scores[d.key] ?? 0),
      name: compare.name || '对比',
      lineStyle: { color: '#22d3ee', width: 2 },
      itemStyle: { color: '#22d3ee' },
      areaStyle: { color: 'rgba(34,211,238,0.08)' },
    });
  }
  if (cohortAvg) {
    seriesData.push({
      value: dims.map((d) => cohortAvg[d.key] ?? 0),
      name: '队列均值',
      lineStyle: { color: '#64748b', width: 1, type: 'dashed' },
      itemStyle: { color: '#64748b' },
      areaStyle: { color: 'rgba(100,116,139,0.05)' },
    });
  }

  return {
    tooltip: { trigger: 'item' },
    legend: seriesData.length > 1
      ? { bottom: 0, textStyle: { fontSize: 10 }, itemWidth: 10, itemHeight: 10 }
      : undefined,
    radar: {
      indicator: indicators,
      radius: '62%',
      center: ['50%', '48%'],
      axisName: { fontSize: 10 },
      splitNumber: 4,
    },
    series: [{ type: 'radar', data: seriesData }],
  };
}
