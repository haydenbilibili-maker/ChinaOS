import { useState, useEffect } from 'react';
import * as DB from './localdb.js';
import { CULTURAL_ELITE_DATASET_ID, CULTURAL_ELITE_SEED_PKG } from './culturalEliteSeed.js';
import { BUSINESS_ELITE_DATASET_ID, BUSINESS_ELITE_SEED_PKG } from './businessEliteSeed.js';

// 响应式读取本地库数据集：写入（编辑/导入/删除）即自动刷新 → 模块前台即时更新。
// seed: 库中无此 id 时自动播种（{name,category,source,rows,...}），保证开箱即用。
export function useDataset(id, seed) {
  const [state, setState] = useState({ rows: null, ready: false });
  useEffect(() => {
    let alive = true;
    const load = async () => {
      let ds = await DB.getDataset(id);
      if (!ds && seed) { await DB.putDataset({ id, origin: 'seed', ...seed }); ds = await DB.getDataset(id); }
      if (!ds) { if (alive) setState({ rows: null, ready: true }); return; }
      const rows = (await DB.getRows(id)).map(({ rowId, datasetId, ...r }) => ({ __rowId: rowId, ...r }));
      if (alive) setState({ rows, ready: true });
    };
    load();
    const unsub = DB.subscribe((changedId) => { if (!changedId || changedId === id) load(); });
    return () => { alive = false; unsub(); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);
  return state; // { rows, ready }
}

// 响应式读取简历库
export function useFigures() {
  const [figs, setFigs] = useState(null);
  useEffect(() => {
    let alive = true;
    const load = async () => { const f = await DB.listFigures(); if (alive) setFigs(f); };
    load();
    const unsub = DB.subscribe((id) => { if (id === '__figures__' || !id) load(); });
    return () => { alive = false; unsub(); };
  }, []);
  return figs;
}

// 响应式读取民营经济500强三数据集（与政治人物库隔离）
export function usePrivateEnterprise500() {
  const companies = useDataset('pe500-companies');
  const people = useDataset('pe500-people');
  const equity = useDataset('pe500-equity');
  return {
    companies: companies.rows,
    people: people.rows,
    equity: equity.rows,
    ready: companies.ready && people.ready && equity.ready,
  };
}

// 响应式读取政策文件库（政府工作报告 / 五年规划 / 中央经济工作会议 等）
export function useDocs() {
  const [docs, setDocs] = useState(null);
  useEffect(() => {
    let alive = true;
    const load = async () => { const d = await DB.listDocs(); if (alive) setDocs(d); };
    load();
    const unsub = DB.subscribe((id) => { if (id === '__docs__' || !id) load(); });
    return () => { alive = false; unsub(); };
  }, []);
  return docs;
}

// 响应式读取文化精英库（大学 / 学者 / 文化人才）
export function useCulturalElite() {
  return useDataset(CULTURAL_ELITE_DATASET_ID, CULTURAL_ELITE_SEED_PKG);
}

// 响应式读取商业精英库（创始人 / 高管 / 投资人 / 行业领袖）
export function useBusinessElite() {
  return useDataset(BUSINESS_ELITE_DATASET_ID, BUSINESS_ELITE_SEED_PKG);
}
