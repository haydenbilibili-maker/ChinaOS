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

  // 省级党委书记（排除「市委书记」「副书记」）
  if (/(省委书记|党委书记)/.test(blob) && !/副书记/.test(blob) && !/市委书记/.test(blob)) {
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

function completeness(f) {
  let n = 0;
  if (f.career?.length) n += f.career.length;
  if (f.fields?.birth) n += 2;
  if (f.fields?.native) n += 1;
  if (f.raw) n += 3;
  if (f.provenance) n += 1;
  if (f.tags) n += 1;
  return n;
}

function pickRicher(a, b) {
  const ca = completeness(a);
  const cb = completeness(b);
  if (ca !== cb) return ca > cb ? a : b;
  return (a.updatedAt || 0) >= (b.updatedAt || 0) ? a : b;
}

/** @returns {{ rows: object[], dupeCount: number, rawCount: number }} */
export function dedupeFigures(list) {
  const rawCount = (list || []).length;
  const seen = new Map();
  for (const f of list || []) {
    const k = figureKey(f);
    const prev = seen.get(k);
    seen.set(k, prev ? pickRicher(f, prev) : f);
  }
  const rows = [...seen.values()];
  return { rows, dupeCount: rawCount - rows.length, rawCount };
}
