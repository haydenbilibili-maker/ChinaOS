// 中国政要 · 唯一键与去重（IndexedDB 历史重复载入兜底）

/** 编号合成假名（如 海外人才0001 / 异议人士007 / 学者0123），不得进入活跃种子 */
const SYNTHETIC_NUMBERED_NAME_RE = /^(海外人才|异议人士|学者|企业家|台政要)\d{3,}$/;

export function isSyntheticNumberedTalentName(name) {
  return SYNTHETIC_NUMBERED_NAME_RE.test(String(name || '').trim());
}

/** 同一人同一任职的唯一键 */
export function figureKey(f) {
  return `${f.name}#${f.fields?.birth || ''}#${f.province || ''}#${f.role || ''}#${f.org || f.fields?.title || ''}`;
}

/** 写入 IndexedDB 的稳定主键（幂等载入） */
export function figureStableId(f) {
  return f.id || figureKey(f);
}

/**
 * 近重复键：同名 + 排他性高官职（忽略 org/title 用词差，如「上海市长」vs「上海市市长」）。
 * 排他职务同一省份同时只能有一人；同名同 office 即同一人多源副本。
 * @returns {string|null}
 */
export function personOfficeNearKey(f) {
  if (!f || f.status === 'former') return null;
  const name = String(f.name || '').trim();
  if (!name || /暂缺|vacancy/i.test(name) || /^\（/.test(name)) return null;
  const office = uniqueOfficeKey(f);
  if (!office) return null;
  return `${name}#${office}`;
}

/**
 * 归一化「排他性职务」键：一省一书记 / 一省一省长（直辖市市长/自治区主席同构）。
 * 卸任（status=former / 原* / 暂缺占位）不参与冲突检测。
 * @returns {string|null}
 */
export function uniqueOfficeKey(f) {
  if (!f || f.status === 'former') return null;
  const name = String(f.name || '');
  if (!name || /暂缺|vacancy/i.test(name)) return null;
  const title = String(f.fields?.title || '');
  const role = String(f.role || '');
  const blob = `${title} ${role}`;
  if (/^原/.test(role) || /原市委|原省委|原省长|原市长/.test(title)) return null;

  const prov = String(f.province || f.sector || '')
    .replace(/(维吾尔|壮族|回族|自治区|特别行政区)/g, '')
    .replace(/(省|市)$/g, '')
    .trim();
  if (!prov || prov === '中央') return null;

  // 省属国企「董事长 · 党委书记」不得撞省级党委书记
  const isSoePartyPost = /集团|公司|控股|投资集团|银行|董事会|董事长|总经理|党委副书记/.test(blob)
    || /省属国企|央企|国企/.test(String(f.sector || ''));

  // 省级党委书记（排除市委副书记；直辖市「×市委书记」单独匹配）
  if (/省委书记/.test(blob) && !/副书记/.test(blob)) {
    return `party-secretary:${prov}`;
  }
  if (!isSoePartyPost && /(党委书记)/.test(blob) && !/副书记/.test(blob) && !/市委书记/.test(blob)) {
    // 自治区等「××党委书记」口径
    return `party-secretary:${prov}`;
  }
  if (/(北京|天津|上海|重庆).{0,3}市委书记/.test(blob) && !/副书记/.test(blob)) {
    return `party-secretary:${prov}`;
  }

  const isVice = /副省长|副市长|常务副|副主席|副书记/.test(blob) || /副省长|副市长|常务副/.test(role);
  if (isVice) return null;

  if (/自治区主席/.test(blob) || role === '自治区主席') return `chief:${prov}`;
  if (role === '省长' || /(^|、)省长/.test(title) || /省委副书记、省长/.test(title)) return `chief:${prov}`;
  // 直辖市市长
  if ((role === '市长' || /市长/.test(title)) && /(北京|天津|上海|重庆)/.test(prov)) {
    return `chief:${prov}`;
  }
  return null;
}

/**
 * 检测排他性职务冲突（同 officeKey 多名在任）。
 * @returns {{ officeKey: string, figures: object[] }[]}
 */
export function findUniqueOfficeCollisions(list) {
  const map = new Map();
  for (const f of list || []) {
    const k = uniqueOfficeKey(f);
    if (!k) continue;
    if (!map.has(k)) map.set(k, []);
    map.get(k).push(f);
  }
  return [...map.entries()]
    .filter(([, arr]) => arr.length > 1)
    .map(([officeKey, figures]) => ({ officeKey, figures }));
}

/** 同名+同职务残留碰撞（姓氏同名风险面） */
export function findSameNameTitleCollisions(list) {
  const map = new Map();
  for (const f of list || []) {
    const name = String(f.name || '').trim();
    const role = String(f.role || '').trim();
    const title = String(f.fields?.title || '').trim();
    if (!name || /暂缺/.test(name)) continue;
    if (!/(市长|省长|书记|主席|部长)/.test(`${role} ${title}`)) continue;
    const k = `${name}#${role || title}`;
    if (!map.has(k)) map.set(k, []);
    map.get(k).push(f);
  }
  return [...map.entries()]
    .filter(([, arr]) => arr.length > 1)
    .map(([key, figures]) => ({ key, figures }));
}

function completeness(f) {
  let n = 0;
  if (f.career?.length) n += f.career.length;
  if (f.fields?.birth) n += 2;
  if (f.fields?.native) n += 1;
  if (f.raw) n += 3;
  if (f.provenance) n += 1;
  if (f.tags) n += 1;
  if (/新华网|中国政府网|人民网/.test(String(f.source || ''))) n += 4;
  // 直辖市市长城市库副本（sector=地方 + org=市名）略降权，优先省级主源
  if (f.fields?.cityTier === '直辖市') n -= 3;
  if (f.sector === '地方' && f.org && /市$/.test(String(f.org)) && f.role === '市长') n -= 2;
  return n;
}

function pickRicher(a, b) {
  const ca = completeness(a);
  const cb = completeness(b);
  if (ca !== cb) return ca > cb ? a : b;
  return (a.updatedAt || 0) >= (b.updatedAt || 0) ? a : b;
}

function mergeByKey(list, keyFn) {
  const seen = new Map();
  let merged = 0;
  for (const f of list || []) {
    const k = keyFn(f);
    if (k == null) {
      // 无键条目以对象身份透传（用递增槽位）
      seen.set(`__pass:${seen.size}`, f);
      continue;
    }
    const prev = seen.get(k);
    if (prev) {
      seen.set(k, pickRicher(f, prev));
      merged += 1;
    } else {
      seen.set(k, f);
    }
  }
  return { rows: [...seen.values()], merged };
}

/**
 * 多层去重：精确 figureKey → 近重复 personOfficeNearKey（同名同排他职务）。
 * @returns {{ rows: object[], dupeCount: number, rawCount: number }}
 */
export function dedupeFigures(list) {
  const rawCount = (list || []).length;
  const pass1 = mergeByKey(list, figureKey);
  const pass2 = mergeByKey(pass1.rows, (f) => personOfficeNearKey(f) || `exact:${figureKey(f)}`);
  const rows = pass2.rows;
  return { rows, dupeCount: rawCount - rows.length, rawCount };
}
