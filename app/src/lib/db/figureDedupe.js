// 中国政要 · 唯一键与去重（IndexedDB 历史重复载入兜底）

/** 同一人同一任职的唯一键 */
export function figureKey(f) {
  return `${f.name}#${f.fields?.birth || ''}#${f.province || ''}#${f.role || ''}#${f.org || f.fields?.title || ''}`;
}

/** 写入 IndexedDB 的稳定主键（幂等载入） */
export function figureStableId(f) {
  return f.id || figureKey(f);
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
