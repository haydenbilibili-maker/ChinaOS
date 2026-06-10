// ============================================================================
// 本地数据库 · IndexedDB 封装（China OS 数据底座）
// ----------------------------------------------------------------------------
// 纯浏览器端持久化「本地库」，无需后端：
//   stores: datasets(数据集元数据) / rows(行数据,按 datasetId 索引) / figures(政治人物简历)
// 支持：上传导入、行级编辑、删除、聚合分析、存量录入。
// ============================================================================

const DB_NAME = 'china-os-db';
const DB_VER = 1;
let _db = null;

function open() {
  if (_db) return Promise.resolve(_db);
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, DB_VER);
    req.onupgradeneeded = (e) => {
      const db = e.target.result;
      if (!db.objectStoreNames.contains('datasets')) db.createObjectStore('datasets', { keyPath: 'id' });
      if (!db.objectStoreNames.contains('rows')) {
        const s = db.createObjectStore('rows', { keyPath: 'rowId' });
        s.createIndex('byDataset', 'datasetId', { unique: false });
      }
      if (!db.objectStoreNames.contains('figures')) db.createObjectStore('figures', { keyPath: 'id' });
    };
    req.onsuccess = () => { _db = req.result; resolve(_db); };
    req.onerror = () => reject(req.error);
  });
}

function tx(store, mode = 'readonly') {
  return open().then((db) => db.transaction(store, mode).objectStore(store));
}
function reqP(r) { return new Promise((res, rej) => { r.onsuccess = () => res(r.result); r.onerror = () => rej(r.error); }); }

const uid = (() => { let n = 0; return (p) => `${p}_${(typeof performance !== 'undefined' ? Math.floor(performance.now() * 1000) : 0)}_${n++}`; })();

// ---------- 发布/订阅（写入即通知，驱动模块即时刷新） ----------
const listeners = new Set();
export function subscribe(fn) { listeners.add(fn); return () => listeners.delete(fn); }
function notify(id) { listeners.forEach((f) => { try { f(id); } catch (_) {} }); }

// ---------- 数据集 ----------
export async function listDatasets() {
  const s = await tx('datasets');
  return (await reqP(s.getAll())).sort((a, b) => (b.updatedAt || 0) - (a.updatedAt || 0));
}
export async function getDataset(id) { return reqP((await tx('datasets')).get(id)); }

export async function getRows(datasetId) {
  const s = await tx('rows');
  const idx = s.index('byDataset');
  return reqP(idx.getAll(IDBKeyRange.only(datasetId)));
}

// 写入一个数据集（含行）。columns 自动从首行推断（若未给）。
export async function putDataset({ id, name, category, source, origin = 'upload', note = '', columns, rows = [], stampMs }) {
  const dsId = id || uid('ds');
  const cols = columns || (rows[0] ? Object.keys(rows[0]) : []);
  const db = await open();
  // 1) 覆盖模式：先在独立事务里删除旧行（避免与新增行在同一事务内发生游标竞态）
  if (id) {
    await new Promise((res, rej) => {
      const t = db.transaction('rows', 'readwrite');
      t.oncomplete = res; t.onerror = () => rej(t.error);
      const idx = t.objectStore('rows').index('byDataset');
      idx.openKeyCursor(IDBKeyRange.only(id)).onsuccess = (e) => {
        const cur = e.target.result;
        if (cur) { t.objectStore('rows').delete(cur.primaryKey); cur.continue(); }
      };
    });
  }
  // 2) 写入元数据 + 新行
  await new Promise((res, rej) => {
    const t = db.transaction(['datasets', 'rows'], 'readwrite');
    t.oncomplete = res; t.onerror = () => rej(t.error);
    t.objectStore('datasets').put({ id: dsId, name, category, source, origin, note, columns: cols, rowCount: rows.length, updatedAt: stampMs || 0 });
    const rowStore = t.objectStore('rows');
    rows.forEach((r, i) => rowStore.put({ rowId: `${dsId}__${i}__${uid('r')}`, datasetId: dsId, ...r }));
  });
  notify(dsId);
  return dsId;
}

export async function updateRow(rowId, patch) {
  const db = await open();
  const s = db.transaction('rows', 'readwrite').objectStore('rows');
  const cur = await reqP(s.get(rowId));
  if (!cur) return;
  await reqP(s.put({ ...cur, ...patch }));
  notify(cur.datasetId);
}
export async function deleteRow(rowId) {
  const db = await open();
  const s = db.transaction('rows', 'readwrite').objectStore('rows');
  const cur = await reqP(s.get(rowId));
  await reqP(s.delete(rowId));
  if (cur) notify(cur.datasetId);
}
export async function deleteDataset(id) {
  const db = await open();
  await new Promise((res, rej) => {
    const t = db.transaction(['datasets', 'rows'], 'readwrite');
    t.oncomplete = res; t.onerror = () => rej(t.error);
    t.objectStore('datasets').delete(id);
    const idx = t.objectStore('rows').index('byDataset');
    idx.openKeyCursor(IDBKeyRange.only(id)).onsuccess = (e) => {
      const cur = e.target.result;
      if (cur) { t.objectStore('rows').delete(cur.primaryKey); cur.continue(); }
    };
  });
  notify(id);
}

// ---------- 政治人物简历 ----------
export async function listFigures() {
  const s = await tx('figures');
  return (await reqP(s.getAll())).sort((a, b) => (b.updatedAt || 0) - (a.updatedAt || 0));
}
export async function putFigure(fig) {
  const id = fig.id || uid('fig');
  const db = await open();
  await reqP(db.transaction('figures', 'readwrite').objectStore('figures').put({ ...fig, id }));
  notify('__figures__');
  return id;
}
export async function deleteFigure(id) {
  const db = await open();
  await reqP(db.transaction('figures', 'readwrite').objectStore('figures').delete(id));
  notify('__figures__');
}
export async function clearFigures() {
  const db = await open();
  await reqP(db.transaction('figures', 'readwrite').objectStore('figures').clear());
  notify('__figures__');
}

// ---------- 统计 ----------
export async function stats() {
  const ds = await listDatasets();
  const figs = await listFigures();
  const byCat = {};
  let totalRows = 0;
  ds.forEach((d) => { byCat[d.category] = (byCat[d.category] || 0) + 1; totalRows += d.rowCount || 0; });
  return { datasetCount: ds.length, totalRows, figureCount: figs.length, byCategory: byCat };
}

// 聚合：对 rows 按 groupBy 分组，对 valueField 求 agg(sum/avg/count/max/min)
export function aggregate(rows, { groupBy, valueField, agg = 'sum' }) {
  const buckets = {};
  rows.forEach((r) => {
    const k = groupBy ? r[groupBy] : '全部';
    const v = Number(r[valueField]);
    if (!buckets[k]) buckets[k] = [];
    if (!Number.isNaN(v)) buckets[k].push(v);
  });
  return Object.entries(buckets).map(([k, arr]) => {
    let val;
    if (agg === 'sum') val = arr.reduce((a, b) => a + b, 0);
    else if (agg === 'avg') val = arr.length ? arr.reduce((a, b) => a + b, 0) / arr.length : 0;
    else if (agg === 'count') val = arr.length;
    else if (agg === 'max') val = arr.length ? Math.max(...arr) : 0;
    else if (agg === 'min') val = arr.length ? Math.min(...arr) : 0;
    return { key: k, value: Math.round(val * 100) / 100 };
  }).sort((a, b) => b.value - a.value);
}

// ---------- 字段类型推断与校验 ----------
export function inferTypes(rows, columns) {
  const out = {};
  columns.forEach((c) => {
    let num = 0, txt = 0, empty = 0;
    rows.forEach((r) => {
      const v = r[c];
      if (v === '' || v == null) empty++;
      else if (typeof v === 'number' || (!Number.isNaN(Number(v)) && String(v).trim() !== '')) num++;
      else txt++;
    });
    const nonEmpty = num + txt;
    out[c] = { type: nonEmpty === 0 ? 'empty' : num >= txt ? 'number' : 'text', num, txt, empty,
      issues: out_issues(c, num, txt) };
  });
  return out;
  function out_issues(col, n, t) {
    if (n > 0 && t > 0) return `混合类型：${n} 数值 / ${t} 文本`;
    return '';
  }
}

// ---------- 整库导出 / 导入 ----------
export async function exportAll() {
  const ds = await listDatasets();
  const figs = await listFigures();
  const datasets = [];
  for (const d of ds) {
    const rows = (await getRows(d.id)).map(({ rowId, datasetId, ...r }) => r);
    datasets.push({ ...d, rows });
  }
  return { app: 'china-os-db', version: 1, exportedAt: new Date().toISOString(), datasets, figures: figs };
}
export async function importAll(obj, { merge = true } = {}) {
  if (!obj || !Array.isArray(obj.datasets)) throw new Error('备份格式无效（缺 datasets）');
  let ds = 0, fg = 0;
  for (const d of obj.datasets) {
    await putDataset({ id: d.id, name: d.name, category: d.category, source: d.source, origin: d.origin || 'import', note: d.note, columns: d.columns, rows: d.rows || [], stampMs: d.updatedAt || 0 });
    ds++;
  }
  if (Array.isArray(obj.figures)) { for (const f of obj.figures) { await putFigure(f); fg++; } }
  return { datasets: ds, figures: fg };
}
