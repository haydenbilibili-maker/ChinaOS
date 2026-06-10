import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { PageHeader, Card, Grid, Stat } from '../../app/ui.jsx';
import EChart from '../../lib/viz/EChart.jsx';
import * as DB from '../../lib/db/localdb.js';
import { parseCSV, parseJSON, parseFigure, parseManyFigures } from '../../lib/db/parse.js';
import { STOCK_CATALOG } from '../../lib/db/stock.js';
import { FIGURE_SEED, FIGURE_CATALOG_META } from '../../lib/db/figureSeed.js';

const TABS = [
  ['overview', '总览'], ['datasets', '数据集'], ['upload', '上传导入'],
  ['analyze', '解析分析'], ['figures', '政治人物简历'], ['stock', '存量队列'], ['tools', '备份 / 对账'],
];
const CATS = ['经济运行', '国家统计局', '海关总署', '世界银行', '科技指标', '地缘指标', '政治人物', '其他'];
const btn = (active) => ({ background: active ? 'rgba(196,30,58,0.2)' : 'var(--bg-elevated)', color: active ? '#fff' : 'var(--text-secondary)', border: 'none', cursor: 'pointer', borderRadius: 6 });
const inp = { background: 'var(--bg-base)', border: '1px solid var(--border-subtle)', color: 'var(--text-primary)', borderRadius: 6, padding: '6px 8px', fontSize: 13, width: '100%' };

// ---------- 数据表（可编辑） ----------
function DataTable({ rows, columns, onEdit, onDelRow }) {
  const cols = columns && columns.length ? columns : (rows[0] ? Object.keys(rows[0]).filter((k) => k !== 'rowId' && k !== 'datasetId') : []);
  const shown = rows.slice(0, 200);
  return (
    <div style={{ overflowX: 'auto', border: '1px solid var(--border-subtle)', borderRadius: 8 }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
        <thead><tr style={{ background: 'var(--bg-elevated)' }}>
          {cols.map((c) => <th key={c} style={{ padding: '6px 10px', textAlign: 'left', color: 'var(--text-secondary)', whiteSpace: 'nowrap' }}>{c}</th>)}
          {onDelRow && <th style={{ padding: '6px 10px' }}></th>}
        </tr></thead>
        <tbody>
          {shown.map((r, ri) => (
            <tr key={r.rowId || ri} style={{ borderTop: '1px solid var(--border-subtle)' }}>
              {cols.map((c) => (
                <td key={c} style={{ padding: '2px 6px' }}>
                  {onEdit ? (
                    <input defaultValue={r[c]} onBlur={(e) => { if (String(e.target.value) !== String(r[c] ?? '')) onEdit(r.rowId, c, e.target.value); }}
                      style={{ ...inp, padding: '3px 6px', fontSize: 12, minWidth: 70 }} />
                  ) : <span style={{ color: 'var(--text-primary)' }}>{String(r[c] ?? '')}</span>}
                </td>
              ))}
              {onDelRow && <td style={{ padding: '2px 6px' }}><button onClick={() => onDelRow(r.rowId)} style={{ ...btn(false), padding: '2px 8px', fontSize: 11, color: 'var(--china-red)' }}>删</button></td>}
            </tr>
          ))}
        </tbody>
      </table>
      {rows.length > 200 && <div style={{ padding: 8, fontSize: 11, color: 'var(--text-tertiary)' }}>· 共 {rows.length} 行，仅显示前 200 行</div>}
    </div>
  );
}

export default function Page() {
  const [tab, setTab] = useState('overview');
  const [datasets, setDatasets] = useState([]);
  const [figures, setFigures] = useState([]);
  const [st, setSt] = useState(null);
  const [toast, setToast] = useState('');

  const refresh = useCallback(async () => {
    setDatasets(await DB.listDatasets());
    setFigures(await DB.listFigures());
    setSt(await DB.stats());
  }, []);
  useEffect(() => { refresh(); }, [refresh]);
  const flash = (m) => { setToast(m); setTimeout(() => setToast(''), 2600); };

  return (
    <div>
      <PageHeader badge="Data Console · 数据底座" title="本地数据库管理后台"
        subtitle="省市经济 · 国家统计局 · 海关总署 · 世界银行 · 政治人物简历 —— 上传 / 解析 / 编辑 / 分析（IndexedDB 本地持久化）" />
      <div className="flex gap-1 flex-wrap mb-4">
        {TABS.map(([k, label]) => <button key={k} onClick={() => setTab(k)} className="text-sm px-3 py-1.5 mono" style={btn(k === tab)}>{label}</button>)}
      </div>
      {toast && <div className="mb-4 px-3 py-2 rounded text-sm mono" style={{ background: 'rgba(16,185,129,0.14)', color: '#10b981' }}>{toast}</div>}

      {tab === 'overview' && <Overview st={st} datasets={datasets} onGo={setTab} />}
      {tab === 'datasets' && <Datasets datasets={datasets} refresh={refresh} flash={flash} />}
      {tab === 'upload' && <Upload refresh={refresh} flash={flash} go={setTab} />}
      {tab === 'analyze' && <Analyze datasets={datasets} />}
      {tab === 'figures' && <Figures figures={figures} refresh={refresh} flash={flash} />}
      {tab === 'stock' && <Stock datasets={datasets} refresh={refresh} flash={flash} />}
      {tab === 'tools' && <Tools datasets={datasets} refresh={refresh} flash={flash} />}
    </div>
  );
}

// ---------- 备份 / 对账 ----------
function Tools({ datasets, refresh, flash }) {
  const [aId, setA] = useState(''); const [bId, setB] = useState('');
  const [keyCol, setKeyCol] = useState(''); const [valCol, setVal] = useState('');
  const [recon, setRecon] = useState(null);
  const doExport = async () => {
    const all = await DB.exportAll();
    const blob = new Blob([JSON.stringify(all, null, 2)], { type: 'application/json' });
    const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = `china-os-db-backup-${all.exportedAt.slice(0, 10)}.json`; a.click();
    flash(`已导出整库：${all.datasets.length} 数据集 / ${all.figures.length} 简历`);
  };
  const doImport = (e) => {
    const f = e.target.files[0]; if (!f) return;
    const r = new FileReader();
    r.onload = async () => { try { const res = await DB.importAll(JSON.parse(String(r.result))); await refresh(); flash(`已导入备份：${res.datasets} 数据集 / ${res.figures} 简历`); } catch (er) { flash('导入失败：' + er.message); } };
    r.readAsText(f);
  };
  const runRecon = async () => {
    const [ra, rb] = await Promise.all([DB.getRows(aId), DB.getRows(bId)]);
    const idx = {}; rb.forEach((r) => { idx[r[keyCol]] = r; });
    const rows = ra.map((r) => {
      const m = idx[r[keyCol]]; const va = Number(r[valCol]); const vb = m ? Number(m[valCol]) : null;
      const delta = vb != null && !Number.isNaN(va) && !Number.isNaN(vb) ? va - vb : null;
      const pct = delta != null && vb ? (delta / vb) * 100 : null;
      return { key: r[keyCol], a: va, b: vb, delta: delta != null ? Math.round(delta * 100) / 100 : null, pct: pct != null ? Math.round(pct * 10) / 10 : null };
    }).filter((x) => x.b != null);
    setRecon(rows.sort((x, y) => Math.abs(y.pct || 0) - Math.abs(x.pct || 0)));
  };
  const dsA = datasets.find((d) => d.id === aId); const dsB = datasets.find((d) => d.id === bId);
  const commonCols = dsA && dsB ? dsA.columns.filter((c) => dsB.columns.includes(c)) : [];
  return (
    <Grid cols={1}>
      <Card title="整库备份 · 导出 / 导入">
        <div className="flex gap-2 items-center flex-wrap">
          <button onClick={doExport} style={{ ...btn(true), padding: '6px 16px', fontSize: 13 }}>导出整库 JSON</button>
          <label style={{ ...btn(false), padding: '6px 16px', fontSize: 13 }}>导入备份<input type="file" accept=".json" onChange={doImport} style={{ display: 'none' }} /></label>
          <span className="text-xs" style={{ color: 'var(--text-tertiary)' }}>导出含全部数据集（行）与简历；导入按 id 覆盖合并。</span>
        </div>
      </Card>
      <Card title="多源对账 · NBS vs WB（同名指标偏差核对）" className="mt-4">
        <div className="flex gap-2 flex-wrap items-center text-xs mb-3">
          <select value={aId} onChange={(e) => { setA(e.target.value); setRecon(null); }} style={{ ...inp, width: 200 }}><option value="">源 A</option>{datasets.map((d) => <option key={d.id} value={d.id}>{d.name}</option>)}</select>
          <span style={{ color: 'var(--text-tertiary)' }}>对</span>
          <select value={bId} onChange={(e) => { setB(e.target.value); setRecon(null); }} style={{ ...inp, width: 200 }}><option value="">源 B</option>{datasets.map((d) => <option key={d.id} value={d.id}>{d.name}</option>)}</select>
          {commonCols.length > 0 && <>
            <span style={{ color: 'var(--text-tertiary)' }}>主键</span>
            <select value={keyCol} onChange={(e) => setKeyCol(e.target.value)} style={{ ...inp, width: 120 }}><option value="">键</option>{commonCols.map((c) => <option key={c} value={c}>{c}</option>)}</select>
            <span style={{ color: 'var(--text-tertiary)' }}>比对</span>
            <select value={valCol} onChange={(e) => setVal(e.target.value)} style={{ ...inp, width: 120 }}><option value="">值</option>{commonCols.map((c) => <option key={c} value={c}>{c}</option>)}</select>
            <button onClick={runRecon} disabled={!keyCol || !valCol} style={{ ...btn(true), padding: '5px 14px', fontSize: 12 }}>对账</button>
          </>}
        </div>
        {recon && (
          <div style={{ overflowX: 'auto', border: '1px solid var(--border-subtle)', borderRadius: 8 }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
              <thead><tr style={{ background: 'var(--bg-elevated)' }}>{['主键', '源A', '源B', 'Δ', 'Δ%'].map((h) => <th key={h} style={{ padding: '6px 10px', textAlign: 'left', color: 'var(--text-secondary)' }}>{h}</th>)}</tr></thead>
              <tbody>{recon.map((r) => (
                <tr key={r.key} style={{ borderTop: '1px solid var(--border-subtle)' }}>
                  <td style={{ padding: '4px 10px', color: 'var(--text-primary)' }}>{r.key}</td>
                  <td style={{ padding: '4px 10px', color: 'var(--text-secondary)' }}>{r.a}</td>
                  <td style={{ padding: '4px 10px', color: 'var(--text-secondary)' }}>{r.b}</td>
                  <td style={{ padding: '4px 10px', color: 'var(--text-secondary)' }}>{r.delta}</td>
                  <td style={{ padding: '4px 10px', color: Math.abs(r.pct) > 10 ? '#c41e3a' : Math.abs(r.pct) > 3 ? '#e8a317' : '#10b981', fontFamily: 'monospace' }}>{r.pct != null ? r.pct + '%' : '—'}</td>
                </tr>
              ))}</tbody>
            </table>
          </div>
        )}
        {recon && <p className="text-[11px] mt-2" style={{ color: 'var(--text-tertiary)' }}>红：偏差&gt;10% · 黄：&gt;3% · 绿：≤3%。多源（如 NBS vs WB）同指标偏差可揭示口径差异或数据质量问题。</p>}
        {!recon && <p className="text-xs" style={{ color: 'var(--text-tertiary)' }}>选两个含相同列名的数据集（如同时含「指标/数值」），按主键比对数值字段的偏差。</p>}
      </Card>
    </Grid>
  );
}

// ---------- 总览 ----------
function Overview({ st, datasets, onGo }) {
  const catOption = useMemo(() => {
    if (!st) return null;
    const e = Object.entries(st.byCategory);
    return { tooltip: { trigger: 'item' }, legend: { bottom: 0, textStyle: { color: '#93a1b5' } },
      series: [{ type: 'pie', radius: ['44%', '70%'], center: ['50%', '44%'], label: { color: '#93a1b5' },
        data: e.map(([k, v], i) => ({ name: k, value: v, itemStyle: { color: ['#c41e3a', '#22d3ee', '#e8a317', '#10b981', '#8b5cf6', '#fb923c', '#64748b'][i % 7] } })) }] };
  }, [st]);
  return (
    <div>
      <Grid cols={4} className="mb-6">
        <Stat value={st ? st.datasetCount : '…'} label="数据集" accent="#22d3ee" />
        <Stat value={st ? st.totalRows.toLocaleString() : '…'} label="数据行总数" accent="#c41e3a" />
        <Stat value={st ? st.figureCount : '…'} label="政治人物简历" accent="#e8a317" />
        <Stat value={st ? Object.keys(st.byCategory).length : '…'} label="数据分类" accent="#10b981" />
      </Grid>
      <Grid cols={2} className="mb-6">
        <Card title="数据集分类构成">
          {catOption && Object.keys(st.byCategory).length ? <EChart option={catOption} style={{ height: 240 }} /> : <div className="py-16 text-center text-sm mono" style={{ color: 'var(--text-tertiary)' }}>// 暂无数据，去「存量队列」一键录入或「上传导入」</div>}
        </Card>
        <Card title="最近数据集">
          {datasets.length ? (
            <div className="space-y-2">
              {datasets.slice(0, 8).map((d) => (
                <div key={d.id} className="flex items-center justify-between text-xs" style={{ borderLeft: '2px solid var(--cyber-cyan)', paddingLeft: 8 }}>
                  <span style={{ color: 'var(--text-primary)' }}>{d.name}</span>
                  <span className="mono" style={{ color: 'var(--text-tertiary)' }}>{d.category} · {d.rowCount} 行 · {d.origin === 'stock' ? '存量' : d.origin === 'seed' ? '种子' : '上传'}</span>
                </div>
              ))}
            </div>
          ) : <div className="py-10 text-center text-sm mono" style={{ color: 'var(--text-tertiary)' }}>// 数据库为空</div>}
        </Card>
      </Grid>
      <Card title="数据底座说明">
        <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
          本后台为浏览器端本地库（IndexedDB），无需服务端即可上传、解析、编辑、分析多源数据。涵盖省市经济运行、国家统计局、海关总署、世界银行等口径；政治人物简历支持粘贴/JSON 解析录入。各模块已落地的数据可在<button onClick={() => onGo('stock')} className="mono" style={{ background: 'none', border: 'none', color: 'var(--cyber-cyan)', cursor: 'pointer', padding: 0 }}>「存量队列」</button>一键录入为数据库存量。
        </p>
      </Card>
    </div>
  );
}

// ---------- 数据集（浏览/编辑/删除） ----------
function Datasets({ datasets, refresh, flash }) {
  const [selId, setSelId] = useState(null);
  const [rows, setRows] = useState([]);
  const sel = datasets.find((d) => d.id === selId) || null;
  useEffect(() => { if (selId) DB.getRows(selId).then(setRows); else setRows([]); }, [selId]);
  useEffect(() => { if (!selId && datasets[0]) setSelId(datasets[0].id); }, [datasets, selId]);

  const exportJSON = () => {
    const clean = rows.map(({ rowId, datasetId, ...r }) => r);
    const blob = new Blob([JSON.stringify({ name: sel.name, category: sel.category, rows: clean }, null, 2)], { type: 'application/json' });
    const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = `${sel.name}.json`; a.click();
  };
  return (
    <Grid cols={1}>
      <div className="grid gap-4" style={{ gridTemplateColumns: '260px 1fr' }}>
        <Card title={`数据集 (${datasets.length})`}>
          <div className="space-y-1" style={{ maxHeight: 520, overflowY: 'auto' }}>
            {datasets.map((d) => (
              <button key={d.id} onClick={() => setSelId(d.id)} className="w-full text-left px-2 py-1.5 rounded text-xs"
                style={{ background: d.id === selId ? 'rgba(196,30,58,0.16)' : 'transparent', border: `1px solid ${d.id === selId ? 'var(--china-red)' : 'transparent'}`, cursor: 'pointer' }}>
                <div style={{ color: d.id === selId ? '#fff' : 'var(--text-secondary)' }}>{d.name}</div>
                <div className="mono" style={{ color: 'var(--text-tertiary)', fontSize: 10 }}>{d.category} · {d.rowCount} 行</div>
              </button>
            ))}
            {!datasets.length && <div className="text-xs mono py-6 text-center" style={{ color: 'var(--text-tertiary)' }}>// 空</div>}
          </div>
        </Card>
        <Card title={sel ? `${sel.name} · ${sel.rowCount} 行` : '选择数据集'}>
          {sel && (
            <>
              <div className="flex items-center gap-2 mb-3 flex-wrap text-xs">
                <span className="mono px-2 py-0.5 rounded" style={{ background: 'var(--bg-elevated)', color: 'var(--cyber-cyan)' }}>{sel.category}</span>
                <span className="mono" style={{ color: 'var(--text-tertiary)' }}>来源：{sel.source}</span>
                <button onClick={exportJSON} style={{ ...btn(false), padding: '3px 10px', fontSize: 11, marginLeft: 'auto' }}>导出 JSON</button>
                <button onClick={async () => { if (confirm(`删除数据集「${sel.name}」？`)) { await DB.deleteDataset(sel.id); setSelId(null); await refresh(); flash('数据集已删除'); } }} style={{ ...btn(false), padding: '3px 10px', fontSize: 11, color: 'var(--china-red)' }}>删除数据集</button>
              </div>
              <DataTable rows={rows} columns={sel.columns}
                onEdit={async (rowId, col, val) => { const num = val !== '' && !Number.isNaN(Number(val)); await DB.updateRow(rowId, { [col]: num ? Number(val) : val }); flash('已保存'); }}
                onDelRow={async (rowId) => { await DB.deleteRow(rowId); setRows(await DB.getRows(sel.id)); flash('行已删除'); }} />
            </>
          )}
        </Card>
      </div>
    </Grid>
  );
}

// ---------- 上传导入 ----------
function Upload({ refresh, flash, go }) {
  const [text, setText] = useState('');
  const [fmt, setFmt] = useState('csv');
  const [parsed, setParsed] = useState(null);
  const [err, setErr] = useState('');
  const [name, setName] = useState('');
  const [cat, setCat] = useState('经济运行');
  const [source, setSource] = useState('');

  const onFile = (e) => {
    const f = e.target.files[0]; if (!f) return;
    setName(f.name.replace(/\.[^.]+$/, ''));
    setFmt(f.name.endsWith('.json') ? 'json' : 'csv');
    const r = new FileReader(); r.onload = () => setText(String(r.result)); r.readAsText(f);
  };
  const doParse = () => {
    setErr('');
    try { const p = fmt === 'json' ? parseJSON(text) : parseCSV(text); if (!p.rows.length) throw new Error('未解析到数据行'); setParsed(p); if (p.meta?.source && !source) setSource(p.meta.source); }
    catch (e) { setErr(String(e.message || e)); setParsed(null); }
  };
  const doImport = async () => {
    await DB.putDataset({ name: name || '未命名数据集', category: cat, source: source || '手动上传', origin: 'upload', columns: parsed.columns, rows: parsed.rows, stampMs: Date.now() });
    await refresh(); flash(`已导入「${name}」 ${parsed.rows.length} 行`); go('datasets');
  };
  return (
    <Grid cols={2}>
      <Card title="① 粘贴或上传（CSV / JSON）">
        <div className="flex gap-2 mb-2 items-center text-xs">
          {['csv', 'json'].map((f) => <button key={f} onClick={() => setFmt(f)} style={{ ...btn(f === fmt), padding: '4px 12px' }}>{f.toUpperCase()}</button>)}
          <label style={{ ...btn(false), padding: '4px 12px', fontSize: 12 }}>选择文件<input type="file" accept=".csv,.json,.txt" onChange={onFile} style={{ display: 'none' }} /></label>
        </div>
        <textarea value={text} onChange={(e) => setText(e.target.value)} placeholder={fmt === 'csv' ? '省份,GDP亿元,人口万\n广东省,135673,12706\n...' : '[{"省份":"广东省","GDP":135673}]'} style={{ ...inp, height: 200, fontFamily: 'monospace', resize: 'vertical' }} />
        <button onClick={doParse} className="mt-2" style={{ ...btn(true), padding: '6px 16px', fontSize: 13 }}>解析预览</button>
        {err && <p className="text-xs mono mt-2" style={{ color: 'var(--china-red)' }}>解析失败：{err}</p>}
      </Card>
      <Card title="② 预览 → 元信息 → 导入">
        {parsed ? (
          <>
            <div className="grid grid-cols-2 gap-2 mb-2">
              <input value={name} onChange={(e) => setName(e.target.value)} placeholder="数据集名称" style={inp} />
              <select value={cat} onChange={(e) => setCat(e.target.value)} style={inp}>{CATS.map((c) => <option key={c} value={c}>{c}</option>)}</select>
              <input value={source} onChange={(e) => setSource(e.target.value)} placeholder="来源（如：国家统计局 2023）" style={{ ...inp, gridColumn: '1 / 3' }} />
            </div>
            <div className="text-xs mono mb-2" style={{ color: 'var(--text-tertiary)' }}>{parsed.columns.length} 列 · {parsed.rows.length} 行</div>
            <div className="flex flex-wrap gap-1.5 mb-2">
              {Object.entries(DB.inferTypes(parsed.rows, parsed.columns)).map(([col, t]) => (
                <span key={col} className="text-[10px] mono px-2 py-0.5 rounded" title={t.issues || ''}
                  style={{ background: 'var(--bg-elevated)', color: t.issues ? '#e8a317' : t.type === 'number' ? '#22d3ee' : 'var(--text-tertiary)' }}>
                  {col}:{t.type}{t.issues ? ' ⚠' : ''}
                </span>
              ))}
            </div>
            <DataTable rows={parsed.rows.slice(0, 50)} columns={parsed.columns} />
            <button onClick={doImport} className="mt-3" style={{ ...btn(true), padding: '6px 16px', fontSize: 13 }}>导入数据库</button>
          </>
        ) : <div className="py-16 text-center text-sm mono" style={{ color: 'var(--text-tertiary)' }}>// 左侧解析后在此预览并导入</div>}
      </Card>
    </Grid>
  );
}

// ---------- 解析分析 ----------
function Analyze({ datasets }) {
  const [dsId, setDsId] = useState('');
  const [rows, setRows] = useState([]);
  const [groupBy, setGroupBy] = useState('');
  const [valueField, setValueField] = useState('');
  const [agg, setAgg] = useState('sum');
  const ds = datasets.find((d) => d.id === dsId);
  useEffect(() => { if (dsId) DB.getRows(dsId).then((r) => { setRows(r); }); }, [dsId]);
  useEffect(() => { if (!dsId && datasets[0]) setDsId(datasets[0].id); }, [datasets, dsId]);
  const cols = ds ? ds.columns : [];
  const numCols = useMemo(() => cols.filter((c) => rows.some((r) => typeof r[c] === 'number')), [cols, rows]);
  useEffect(() => { if (cols.length && !groupBy) setGroupBy(cols[0]); }, [cols, groupBy]);
  useEffect(() => { if (numCols.length && !valueField) setValueField(numCols[0]); }, [numCols, valueField]);
  const result = useMemo(() => (rows.length && groupBy && valueField ? DB.aggregate(rows, { groupBy, valueField, agg }) : []), [rows, groupBy, valueField, agg]);
  const option = useMemo(() => {
    if (!result.length) return null;
    const top = result.slice(0, 20).reverse();
    return { grid: { left: 120, right: 36, top: 10, bottom: 24 }, xAxis: { type: 'value', splitLine: { lineStyle: { color: 'rgba(148,163,184,0.1)' } } },
      yAxis: { type: 'category', data: top.map((x) => String(x.key)), axisLine: { lineStyle: { color: '#27324a' } } },
      series: [{ type: 'bar', data: top.map((x) => x.value), barWidth: 12, itemStyle: { color: '#22d3ee', borderRadius: 3 }, label: { show: true, position: 'right', color: '#93a1b5' } }] };
  }, [result]);
  return (
    <Card title="解析分析 · 分组聚合">
      <div className="flex gap-2 flex-wrap mb-4 text-xs items-center">
        <select value={dsId} onChange={(e) => { setDsId(e.target.value); setGroupBy(''); setValueField(''); }} style={{ ...inp, width: 220 }}>{datasets.map((d) => <option key={d.id} value={d.id}>{d.name}</option>)}</select>
        <span style={{ color: 'var(--text-tertiary)' }}>按</span>
        <select value={groupBy} onChange={(e) => setGroupBy(e.target.value)} style={{ ...inp, width: 130 }}>{cols.map((c) => <option key={c} value={c}>{c}</option>)}</select>
        <span style={{ color: 'var(--text-tertiary)' }}>对</span>
        <select value={valueField} onChange={(e) => setValueField(e.target.value)} style={{ ...inp, width: 130 }}>{numCols.map((c) => <option key={c} value={c}>{c}</option>)}</select>
        <select value={agg} onChange={(e) => setAgg(e.target.value)} style={{ ...inp, width: 90 }}>{['sum', 'avg', 'count', 'max', 'min'].map((a) => <option key={a} value={a}>{a}</option>)}</select>
      </div>
      {option ? <EChart option={option} style={{ height: Math.max(240, result.slice(0, 20).length * 26) }} /> : <div className="py-16 text-center text-sm mono" style={{ color: 'var(--text-tertiary)' }}>// 选择数据集与数值字段后聚合出图</div>}
    </Card>
  );
}

// ---------- 政治人物简历 ----------
function Figures({ figures, refresh, flash }) {
  const [text, setText] = useState('');
  const [preview, setPreview] = useState(null);
  const [q, setQ] = useState('');
  const FIELD_LABEL = { name: '姓名', gender: '性别', birth: '出生', native: '籍贯', ethnic: '民族', party: '入党', edu: '学历', title: '现任', field: '分管' };
  const [bulk, setBulk] = useState('');
  const doParse = () => { try { setPreview(parseFigure(text)); } catch (e) { flash('解析失败：' + e.message); } };
  const filtered = figures.filter((f) => !q || (f.name + ' ' + (f.fields?.title || '') + ' ' + (f.province || '') + ' ' + (f.raw || '')).toLowerCase().includes(q.toLowerCase()));
  const save = async () => { await DB.putFigure({ ...preview, updatedAt: Date.now() }); setText(''); setPreview(null); await refresh(); flash(`已录入「${preview.name}」`); };
  const doBulk = async () => {
    try {
      const recs = parseManyFigures(bulk).filter((r) => r.name && r.name !== '未命名');
      if (!recs.length) { flash('未解析到简历记录'); return; }
      let ts = Date.now(); for (const r of recs) await DB.putFigure({ ...r, kind: r.kind || '导入', updatedAt: ts++ });
      setBulk(''); await refresh(); flash(`批量导入 ${recs.length} 条简历`);
    } catch (e) { flash('批量解析失败：' + e.message); }
  };
  const loadSeed = async (replace = false) => {
    if (replace && figures.length && !window.confirm(`将覆盖/更新 ${FIGURE_SEED.length} 条省部级公开履历（${FIGURE_CATALOG_META.asOf}），继续？`)) return;
    let ts = Date.now();
    for (const r of FIGURE_SEED) await DB.putFigure({ ...r, updatedAt: ts++ });
    await refresh();
    flash(`已载入 ${FIGURE_CATALOG_META.label}：${FIGURE_SEED.length} 条（截至 ${FIGURE_CATALOG_META.asOf}）`);
  };
  return (
    <div>
      <Card title="批量导入 · 从权威来源整段粘贴（多条简历）" className="mb-4">
        <p className="text-[11px] mb-2" style={{ color: 'var(--text-tertiary)' }}>
          支持：多条简历以空行或「---」分隔、每行一条 JSON(JSONL)、或 JSON 数组。自动按省份关键词关联。
          内置数据集：{FIGURE_CATALOG_META.label}（共 {FIGURE_SEED.length} 条：省级 {FIGURE_CATALOG_META.breakdown?.provincial} + 中央 {FIGURE_CATALOG_META.breakdown?.central} + 扩展 {FIGURE_CATALOG_META.breakdown?.extended} + 城市 {FIGURE_CATALOG_META.breakdown?.municipal} + 地级市 {FIGURE_CATALOG_META.breakdown?.prefectureCity} + 机构 {FIGURE_CATALOG_META.breakdown?.org} + 二层 {FIGURE_CATALOG_META.breakdown?.orgTier2}）· 来源 {FIGURE_CATALOG_META.sources.join(' / ')}。
        </p>
        <textarea value={bulk} onChange={(e) => setBulk(e.target.value)} placeholder={'姓名：张三\n现任：XX省委书记\n2020— 任XX省委书记\n---\n姓名：李四\n现任：XX省省长\n2021— 任XX省省长'} style={{ ...inp, height: 120, fontFamily: 'monospace', resize: 'vertical', width: '100%' }} />
        <div className="flex gap-2 mt-2 flex-wrap">
          <button onClick={doBulk} style={{ ...btn(true), padding: '6px 16px', fontSize: 13 }}>批量解析导入</button>
          <button onClick={() => loadSeed(true)} style={{ ...btn(false), padding: '6px 16px', fontSize: 13, color: 'var(--cyber-cyan)' }}>载入省部级履历（{FIGURE_SEED.length} 条 · {FIGURE_CATALOG_META.asOf}）</button>
        </div>
      </Card>
    <Grid cols={2}>
      <Card title="单条录入（粘贴文本或 JSON → 解析）">
        <textarea value={text} onChange={(e) => setText(e.target.value)} placeholder={'姓名：示例\n籍贯：XX省\n民族：汉族\n学历：XX大学\n现任：XX省委书记\n2018— 任XX市委书记\n2015—2018 任XX副省长'} style={{ ...inp, height: 220, fontFamily: 'monospace', resize: 'vertical' }} />
        <div className="flex gap-2 mt-2">
          <button onClick={doParse} style={{ ...btn(true), padding: '6px 16px', fontSize: 13 }}>解析</button>
          {preview && <button onClick={save} style={{ ...btn(false), padding: '6px 16px', fontSize: 13, color: '#10b981' }}>录入数据库</button>}
        </div>
        {preview && (
          <div className="mt-3 p-3 rounded" style={{ background: 'var(--bg-elevated)' }}>
            <div className="font-bold mb-2" style={{ color: 'var(--text-primary)' }}>{preview.name}</div>
            <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs mb-2">
              {Object.entries(preview.fields).filter(([k]) => k !== 'name').map(([k, v]) => <span key={k} style={{ color: 'var(--text-tertiary)' }}>{FIELD_LABEL[k] || k}：<span style={{ color: 'var(--text-secondary)' }}>{v}</span></span>)}
            </div>
            {preview.career?.length > 0 && <div className="space-y-1">{preview.career.map((c, i) => <div key={i} className="text-[11px]" style={{ borderLeft: '2px solid var(--china-red)', paddingLeft: 8, color: 'var(--text-secondary)' }}><span className="mono" style={{ color: 'var(--cyber-cyan)' }}>{c.from}{c.to ? `–${c.to}` : ''}</span> {c.desc}</div>)}</div>}
          </div>
        )}
        <p className="text-[11px] mt-2" style={{ color: 'var(--text-tertiary)' }}>解析抽取「标签：值」字段与含年份的履历时间线；仅录入用户提供的公开履历文本，供研究检索。</p>
      </Card>
      <Card title={`简历库 (${filtered.length}/${figures.length})`}>
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="检索：姓名 / 现任 / 省份 / 关键词" style={{ ...inp, marginBottom: 10 }} />
        <div className="space-y-2" style={{ maxHeight: 420, overflowY: 'auto' }}>
          {filtered.map((f) => (
            <div key={f.id} className="p-3 rounded" style={{ background: 'var(--bg-elevated)' }}>
              <div className="flex items-center justify-between">
                <span className="font-semibold" style={{ color: 'var(--text-primary)' }}>{f.name}{f.province && <span className="text-[10px] mono ml-2 px-1.5 py-0.5 rounded" style={{ background: 'rgba(34,211,238,0.12)', color: 'var(--cyber-cyan)' }}>{f.province.replace(/(省|市|自治区|回族|壮族|维吾尔)/g, '')}</span>}</span>
                <button onClick={async () => { await DB.deleteFigure(f.id); await refresh(); flash('已删除'); }} style={{ ...btn(false), padding: '2px 8px', fontSize: 11, color: 'var(--china-red)' }}>删</button>
              </div>
              <div className="flex flex-wrap gap-x-3 text-[11px] mt-1" style={{ color: 'var(--text-tertiary)' }}>
                {f.fields?.title && <span>{f.fields.title}</span>}{f.fields?.native && <span>籍贯 {f.fields.native}</span>}{f.fields?.edu && <span>{f.fields.edu}</span>}
              </div>
              {f.career?.length > 0 && <div className="text-[11px] mt-1" style={{ color: 'var(--text-tertiary)' }}>履历 {f.career.length} 条 · 最近 {f.career[0]?.from}</div>}
            </div>
          ))}
          {!filtered.length && <div className="py-16 text-center text-sm mono" style={{ color: 'var(--text-tertiary)' }}>// {figures.length ? '无匹配' : '简历库为空'}</div>}
        </div>
      </Card>
    </Grid>
    </div>
  );
}

// ---------- 存量队列 ----------
function Stock({ datasets, refresh, flash }) {
  const [busy, setBusy] = useState('');
  const ingest = async (item) => {
    setBusy(item.key);
    try {
      const { rows, source } = await item.load();
      await DB.putDataset({ id: `stock_${item.key}`, name: item.name, category: item.category, source, origin: 'stock', rows, stampMs: Date.now() });
      await refresh(); flash(`已录入存量「${item.name}」 ${rows.length} 行`);
    } catch (e) { flash('录入失败：' + (e.message || e)); }
    setBusy('');
  };
  const ingestAll = async () => { for (const it of STOCK_CATALOG) { try { await ingest(it); } catch (_) {} } };
  const isIn = (name) => datasets.some((d) => d.name === name);
  return (
    <Card title="存量数据队列 · 各模块已落地数据一键录入">
      <div className="flex justify-between items-center mb-3">
        <p className="text-xs" style={{ color: 'var(--text-tertiary)' }}>已分布在各模块的数据，登记为可录入数据库的存量；真实数据（省级财政/人口、WB）标注实时来源。</p>
        <button onClick={ingestAll} style={{ ...btn(true), padding: '6px 14px', fontSize: 12 }}>全部录入</button>
      </div>
      <div className="space-y-2">
        {STOCK_CATALOG.map((it) => (
          <div key={it.key} className="flex items-center gap-3 p-3 rounded" style={{ background: 'var(--bg-elevated)' }}>
            <div className="flex-1 min-w-0">
              <div className="text-sm" style={{ color: 'var(--text-primary)' }}>{it.name}
                {it.real && <span className="text-[10px] mono ml-2 px-1.5 py-0.5 rounded" style={{ background: 'rgba(16,185,129,0.15)', color: '#10b981' }}>真实源</span>}</div>
              <div className="text-[11px] mono" style={{ color: 'var(--text-tertiary)' }}>{it.category} · {it.source}</div>
            </div>
            {isIn(it.name)
              ? <span className="text-xs mono px-3 py-1" style={{ color: '#10b981' }}>✓ 已入库</span>
              : <button disabled={busy === it.key} onClick={() => ingest(it)} style={{ ...btn(false), padding: '5px 14px', fontSize: 12, color: 'var(--cyber-cyan)' }}>{busy === it.key ? '录入中…' : '录入'}</button>}
          </div>
        ))}
      </div>
    </Card>
  );
}
