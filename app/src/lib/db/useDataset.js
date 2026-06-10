import { useState, useEffect } from 'react';
import * as DB from './localdb.js';

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
