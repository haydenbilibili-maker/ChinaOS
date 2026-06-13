// ============================================================================
// 本地数据库 · IndexedDB 封装（China OS 数据底座）
// ----------------------------------------------------------------------------
// 纯浏览器端持久化「本地库」，无需后端：
//   stores: datasets(数据集元数据) / rows(行数据,按 datasetId 索引) / figures(政治人物简历)
// 支持：上传导入、行级编辑、删除、聚合分析、存量录入。
// ============================================================================

import { figureStableId } from './figureDedupe.js';

const DB_NAME = 'china-os-db';
const DB_VER = 2;
// 本库依赖的对象存储；缺任一即触发升级建表（兼容历史/并发改动留下的不完整 schema）
const REQUIRED_STORES = ['datasets', 'rows', 'figures', 'docs'];
let _db = null;

// 幂等建表：在任意版本升级时补齐缺失的 store（带 if-not-contains 守卫）
function ensureStores(db) {
  if (!db.objectStoreNames.contains('datasets')) db.createObjectStore('datasets', { keyPath: 'id' });
  if (!db.objectStoreNames.contains('rows')) {
    const s = db.createObjectStore('rows', { keyPath: 'rowId' });
    s.createIndex('byDataset', 'datasetId', { unique: false });
  }
  if (!db.objectStoreNames.contains('figures')) db.createObjectStore('figures', { keyPath: 'id' });
  if (!db.objectStoreNames.contains('docs')) db.createObjectStore('docs', { keyPath: 'id' });
}

function openAt(version) {
  return new Promise((resolve, reject) => {
    const req = version ? indexedDB.open(DB_NAME, version) : indexedDB.open(DB_NAME);
    req.onupgradeneeded = (e) => ensureStores(e.target.result);
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
    req.onblocked = () => reject(new Error('数据库升级被其它标签页阻塞，请关闭该站点的其它标签后重试'));
  });
}

// 不只看版本号——直接核对所需 store 是否齐全；缺失则以 version+1 强制升级建表。
// 兼容「磁盘已是某版本但 schema 不完整」（历史 / 并发改动导致 docs 等 store 缺失）。
function open() {
  if (_db && REQUIRED_STORES.every((s) => _db.objectStoreNames.contains(s))) return Promise.resolve(_db);
  if (_db) { try { _db.close(); } catch (_) {} _db = null; }
  return openAt(undefined).then((db) => {
    const missing = REQUIRED_STORES.some((s) => !db.objectStoreNames.contains(s));
    const ver = db.version;
    if (!missing && ver >= DB_VER) { _db = db; return _db; }
    db.close();
    return openAt(Math.max(DB_VER, ver + (missing ? 1 : 0))).then((db2) => { _db = db2; return _db; });
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
  const id = figureStableId(fig);
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

// ---------- 政策文件（政府工作报告 / 五年规划 / 中央经济工作会议 等） ----------
export async function listDocs() {
  const s = await tx('docs');
  return (await reqP(s.getAll())).sort((a, b) => (b.year || 0) - (a.year || 0) || (b.updatedAt || 0) - (a.updatedAt || 0));
}
export async function putDoc(doc) {
  const id = doc.id || uid('doc');
  const db = await open();
  await reqP(db.transaction('docs', 'readwrite').objectStore('docs').put({ ...doc, id }));
  notify('__docs__');
  return id;
}
export async function deleteDoc(id) {
  const db = await open();
  await reqP(db.transaction('docs', 'readwrite').objectStore('docs').delete(id));
  notify('__docs__');
}
export async function clearDocs() {
  const db = await open();
  await reqP(db.transaction('docs', 'readwrite').objectStore('docs').clear());
  notify('__docs__');
}

// ---------- 统计 ----------
export async function stats() {
  const ds = await listDatasets();
  const figs = await listFigures();
  const docs = await listDocs();
  const byCat = {};
  let totalRows = 0;
  ds.forEach((d) => { byCat[d.category] = (byCat[d.category] || 0) + 1; totalRows += d.rowCount || 0; });
  return { datasetCount: ds.length, totalRows, figureCount: figs.length, docCount: docs.length, byCategory: byCat };
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
  const docs = await listDocs();
  return { app: 'china-os-db', version: DB_VER, exportedAt: new Date().toISOString(), datasets, figures: figs, docs };
}
export async function importAll(obj, { merge = true } = {}) {
  if (!obj || !Array.isArray(obj.datasets)) throw new Error('备份格式无效（缺 datasets）');
  let ds = 0, fg = 0, dc = 0;
  for (const d of obj.datasets) {
    await putDataset({ id: d.id, name: d.name, category: d.category, source: d.source, origin: d.origin || 'import', note: d.note, columns: d.columns, rows: d.rows || [], stampMs: d.updatedAt || 0 });
    ds++;
  }
  if (Array.isArray(obj.figures)) { for (const f of obj.figures) { await putFigure(f); fg++; } }
  if (Array.isArray(obj.docs)) { for (const d of obj.docs) { await putDoc(d); dc++; } }
  return { datasets: ds, figures: fg, docs: dc };
}
