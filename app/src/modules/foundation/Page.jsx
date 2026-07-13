import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { PageHeader, Card, Grid, Stat, StatGrid } from '../../app/ui.jsx';
import { ModuleFooter } from '../shared/ModuleParadigm.jsx';
import EconDataTab from './EconDataTab.jsx';
import EChart from '../../lib/viz/EChart.jsx';
import { AXIS, LABEL, GRID_LINE } from '../shared/chartHelpers.js';
import * as DB from '../../lib/db/localdb.js';
import { parseCSV, parseJSON, parseFigure, parseManyFigures, parseDoc } from '../../lib/db/parse.js';
import { STOCK_CATALOG } from '../../lib/db/stock.js';
import { FIGURE_SEED, FIGURE_CATALOG_META } from '../../lib/db/figureSeed.js';
import { figureStableId } from '../../lib/db/figureDedupe.js';
import { DOC_SEED, DOC_CATALOG_META, GWR_METRICS, TYPE_COLOR } from '../../lib/db/docSeed.js';
import { PRIVATE_ENTERPRISE_META, loadPrivateEnterprise500 } from '../../lib/db/privateEnterpriseSeed.js';
import { ANTI_CORRUPTION_SEED_PKG, ANTI_CORRUPTION_META, ANTI_CORRUPTION_COUNT } from '../../lib/db/antiCorruptionSeed.js';
import { CULTURAL_ELITE_SEED_PKG, CULTURAL_ELITE_META, CULTURAL_ELITE_DEDUPED_COUNT, CE_SUB_CATS, CE_TAB_LABEL } from '../../lib/db/culturalEliteSeed.js';
import { ACADEMICIAN_SEED_PKG, ACADEMICIAN_META, ACADEMICIAN_DEDUPED_COUNT } from '../../lib/db/academicianSeed.js';
import { BUSINESS_ELITE_SEED_PKG, BUSINESS_ELITE_META, BUSINESS_ELITE_COUNT } from '../../lib/db/businessEliteSeed.js';
import { OVERSEAS_TALENT_SEED_PKG, OVERSEAS_TALENT_META, OVERSEAS_TALENT_DEDUPED_COUNT, OT_TAB_LABEL } from '../../lib/db/overseasTalentSeed.js';
import { SELF_MEDIA_SEED_PKG, SELF_MEDIA_META, SELF_MEDIA_DEDUPED_COUNT, SM_TAB_LABEL, SM_SUB_CATS } from '../../lib/db/selfMediaSeed.js';
import { DIPLOMATIC_CORPS_SEED_PKG, DIPLOMATIC_CORPS_META, DIPLOMATIC_CORPS_DEDUPED_COUNT, DC_TAB_LABEL } from '../../lib/db/diplomaticCorpsSeed.js';
import { DISSIDENT_SEED_PKG, DISSIDENT_META, DISSIDENT_DEDUPED_COUNT, DV_TAB_LABEL } from '../../lib/db/dissidentSeed.js';
import { TAIWAN_POLITICAL_SEED_PKG, TAIWAN_POLITICAL_META, TAIWAN_POLITICAL_DEDUPED_COUNT, TW_TAB_LABEL } from '../../lib/db/taiwanPoliticalSeed.js';
import { HIGHER_EDUCATION_SEED_PKG, HIGHER_EDUCATION_META, HIGHER_EDUCATION_COUNT } from '../../lib/db/higherEducationSeed.js';
import { THINK_TANK_DEDUPED_COUNT, THINK_TANK_META, THINK_TANK_SEED_PKG } from '../../lib/db/thinkTankSeed.js';
import { RESEARCH_INSTITUTE_SEED_PKG, RESEARCH_INSTITUTE_META, RESEARCH_INSTITUTE_COUNT } from '../../lib/db/researchInstituteSeed.js';
import {
  loadAllTalentEliteSeeds, formatTalentBulkSummary, getTalentBulkConfirmMessage,
  TALENT_BULK_QUEUES, TALENT_BULK_TOTAL_COUNT, TALENT_BULK_SCOPE_LABEL,
} from '../../lib/db/talentBulkLoad.js';
import { LEGAL_STATUTE_META, LEGAL_STATUTE_DEDUPED_COUNT } from '../../lib/db/legalStatuteSeed.js';
import { useWorldBank } from '../../lib/db/useDataset.js';
import { WORLD_BANK_DATASET_ID, WORLD_BANK_META, WORLD_BANK_INDICATORS, WORLD_BANK_COUNTRIES, WORLD_BANK_SEED_PKG, WORLD_BANK_COUNT } from '../../lib/db/worldBankSeed.js';

const TABS = [
  ['overview', '总览'], ['econ', '经济数据'], ['datasets', '数据集'], ['worldbank', '世界银行'], ['upload', '上传导入'],
  ['analyze', '解析分析'], ['figures', '人才精英'], ['docs', '政策文件'], ['stock', '存量队列'], ['tools', '备份 / 对账'],
];
const TAB_KEYS = TABS.map(([k]) => k);
const CATS = ['经济运行', '国家统计局', '海关总署', '世界银行', '科技指标', '地缘指标', '人才精英', '其他'];
const btn = (active) => ({ background: active ? 'rgba(196,30,58,0.2)' : 'var(--bg-elevated)', color: active ? 'var(--chip-active-text)' : 'var(--text-secondary)', border: 'none', cursor: 'pointer', borderRadius: 6 });
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
  const [searchParams] = useSearchParams();
  const [tab, setTab] = useState(() => {
    const t = searchParams.get('tab');
    return t && TAB_KEYS.includes(t) ? t : 'overview';
  });
  const [datasets, setDatasets] = useState([]);
  const [figures, setFigures] = useState([]);
  const [docs, setDocs] = useState([]);
  const [st, setSt] = useState(null);
  const [toast, setToast] = useState('');

  const refresh = useCallback(async () => {
    setDatasets(await DB.listDatasets());
    setFigures(await DB.listFigures());
    setDocs(await DB.listDocs());
    setSt(await DB.stats());
  }, []);
  useEffect(() => { refresh(); }, [refresh]);
  const flash = (m) => { setToast(m); setTimeout(() => setToast(''), 2600); };

  return (
    <div>
      <PageHeader badge="Data Console · 数据底座" title="本地数据库管理后台"
        subtitle="省市经济 · 国家统计局 · 海关总署 · 世界银行 · 人才精英 —— 上传 / 解析 / 编辑 / 分析（IndexedDB 本地持久化）" />
      <div className="flex gap-1 flex-wrap mb-4">
        {TABS.map(([k, label]) => <button key={k} onClick={() => setTab(k)} className="text-sm px-3 py-1.5 mono" style={btn(k === tab)}>{label}</button>)}
      </div>
      {toast && <div className="mb-4 px-3 py-2 rounded text-sm mono" style={{ background: 'rgba(16,185,129,0.14)', color: '#10b981' }}>{toast}</div>}

      {tab === 'overview' && <Overview st={st} datasets={datasets} onGo={setTab} />}
      {tab === 'econ' && <EconDataTab datasets={datasets} refresh={refresh} flash={flash} />}
      {tab === 'datasets' && <Datasets datasets={datasets} refresh={refresh} flash={flash} />}
      {tab === 'worldbank' && <WorldBank datasets={datasets} refresh={refresh} flash={flash} />}
      {tab === 'upload' && <Upload refresh={refresh} flash={flash} go={setTab} />}
      {tab === 'analyze' && <Analyze datasets={datasets} />}
      {tab === 'figures' && <Figures figures={figures} refresh={refresh} flash={flash} datasets={datasets} />}
      {tab === 'docs' && <Docs docs={docs} refresh={refresh} flash={flash} />}
      {tab === 'stock' && <Stock datasets={datasets} refresh={refresh} flash={flash} />}
      {tab === 'tools' && <Tools datasets={datasets} refresh={refresh} flash={flash} />}

      <ModuleFooter moduleId="foundation" disclaimer="本地 IndexedDB 数据管理工具，数据由用户上传或内置种子载入，使用前请核对来源与口径" />
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
    return { tooltip: { trigger: 'item' }, legend: { bottom: 0, textStyle: { color: LABEL.color } },
      series: [{ type: 'pie', radius: ['44%', '70%'], center: ['50%', '44%'], label: { color: LABEL.color },
        data: e.map(([k, v], i) => ({ name: k, value: v, itemStyle: { color: ['#c41e3a', '#22d3ee', '#e8a317', '#10b981', '#8b5cf6', '#fb923c', '#64748b'][i % 7] } })) }] };
  }, [st]);
  return (
    <div>
      <StatGrid className="mb-6">
        <Stat value={st ? st.datasetCount : '…'} label="数据集" accent="#22d3ee" />
        <Stat value={st ? st.totalRows.toLocaleString() : '…'} label="数据行总数" accent="#c41e3a" />
        <Stat value={st ? st.figureCount : '…'} label="人才精英" accent="#e8a317" />
        <Stat value={st ? Object.keys(st.byCategory).length : '…'} label="数据分类" accent="#10b981" />
      </StatGrid>
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
          本后台为浏览器端本地库（IndexedDB），无需服务端即可上传、解析、编辑、分析多源数据。涵盖省市经济运行、国家统计局、海关总署、世界银行等口径；人才精英（中国政要 / 知识精英 / 商业精英等）支持粘贴/JSON 解析录入。各模块已落地的数据可在<button onClick={() => onGo('stock')} className="mono" style={{ background: 'none', border: 'none', color: 'var(--cyber-cyan)', cursor: 'pointer', padding: 0 }}>「存量队列」</button>一键录入为数据库存量。
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
                <div style={{ color: d.id === selId ? 'var(--chip-active-text)' : 'var(--text-secondary)' }}>{d.name}</div>
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

// ---------- 世界银行 WDI（本地取数） ----------
const WB_COUNTRY_COLOR = { CHN: '#c41e3a', HKG: '#22d3ee', MAC: '#e8a317' };
function fmtWB(v, unit) {
  if (v == null || v === '') return '—';
  const n = Number(v);
  if (Number.isNaN(n)) return String(v);
  if (unit === '人' || (unit === '美元' && Math.abs(n) >= 1e6)) return n.toLocaleString('en-US');
  return n.toLocaleString('en-US', { maximumFractionDigits: 3 });
}
function WorldBank({ datasets, refresh, flash }) {
  const { rows, ready } = useWorldBank(); // 本地 IndexedDB 取数（首次访问自动播种）
  const loaded = datasets?.some((d) => d.id === WORLD_BANK_DATASET_ID);
  const [indCode, setIndCode] = useState(WORLD_BANK_INDICATORS[0].code);
  const [country, setCountry] = useState('ALL');
  const [yFrom, setYFrom] = useState(WORLD_BANK_META.yearMin);
  const [yTo, setYTo] = useState(WORLD_BANK_META.yearMax);

  const data = rows || [];
  const ind = WORLD_BANK_INDICATORS.find((i) => i.code === indCode) || WORLD_BANK_INDICATORS[0];
  const years = useMemo(() => Array.from(new Set(data.map((r) => r.year))).sort((a, b) => a - b), [data]);

  const filtered = useMemo(() => data
    .filter((r) => r.indicatorCode === indCode && (country === 'ALL' || r.countryCode === country) && r.year >= yFrom && r.year <= yTo)
    .sort((a, b) => a.year - b.year || a.countryCode.localeCompare(b.countryCode)), [data, indCode, country, yFrom, yTo]);

  const chartCountries = country === 'ALL' ? WORLD_BANK_COUNTRIES.map((c) => c.code) : [country];
  const xYears = useMemo(() => years.filter((y) => y >= yFrom && y <= yTo), [years, yFrom, yTo]);
  const option = useMemo(() => {
    if (!filtered.length) return null;
    const idx = {};
    filtered.forEach((r) => { idx[`${r.countryCode}_${r.year}`] = r.value; });
    const series = chartCountries.map((cc) => {
      const meta = WORLD_BANK_COUNTRIES.find((c) => c.code === cc);
      return {
        name: meta ? meta.name : cc, type: 'line', smooth: true, showSymbol: false, connectNulls: true,
        data: xYears.map((y) => (idx[`${cc}_${y}`] != null ? idx[`${cc}_${y}`] : null)),
        lineStyle: { width: 2, color: WB_COUNTRY_COLOR[cc] || ind.accent }, itemStyle: { color: WB_COUNTRY_COLOR[cc] || ind.accent },
        areaStyle: chartCountries.length === 1 ? { color: (ind.accent || '#22d3ee') + '22' } : undefined,
      };
    });
    return {
      tooltip: { trigger: 'axis' },
      legend: { show: chartCountries.length > 1, top: 0, textStyle: { color: LABEL.color } },
      grid: { left: 64, right: 24, top: chartCountries.length > 1 ? 32 : 12, bottom: 28 },
      xAxis: { type: 'category', data: xYears, axisLine: { lineStyle: { color: AXIS.lineStyle.color } }, axisLabel: { color: LABEL.color } },
      yAxis: { type: 'value', scale: true, splitLine: { lineStyle: { color: 'rgba(148,163,184,0.1)' } }, axisLabel: { color: LABEL.color } },
      series,
    };
  }, [filtered, chartCountries, xYears, ind]);

  const doLoad = async () => {
    if (loaded && !window.confirm(`将以种子覆盖刷新本地库「${WORLD_BANK_META.label}」（${WORLD_BANK_COUNT.total} 行），继续？`)) return;
    await DB.putDataset({ ...WORLD_BANK_SEED_PKG, stampMs: Date.now() });
    await refresh();
    flash(`已${loaded ? '覆盖' : ''}载入 ${WORLD_BANK_META.label}：${WORLD_BANK_COUNT.total} 行（本地 IndexedDB）`);
  };
  const doClear = async () => {
    if (!window.confirm('清空世界银行本地数据集？（下次进入本页将自动从种子恢复）')) return;
    await DB.deleteDataset(WORLD_BANK_DATASET_ID);
    await refresh();
    flash('已清空世界银行数据集（再次进入将自动恢复）');
  };

  const tableRows = filtered.map((r) => ({ 年份: r.year, 国家地区: r.country, 指标: r.indicator, 数值: fmtWB(r.value, r.unit), 单位: r.unit, 指标代码: r.indicatorCode }));

  return (
    <div>
      <Card title="世界银行 WDI · 本地数据集概览" className="mb-4">
        <p className="text-[11px] mb-3" style={{ color: 'var(--text-tertiary)' }}>
          <span className="mono px-1.5 py-0.5 rounded mr-1" style={{ background: 'rgba(16,185,129,0.15)', color: '#10b981' }}>本地取数</span>
          数据自 <span className="mono">data/wb_api_*.csv</span>（世界发展指标 WDI）离线抽取并固化为种子，写入浏览器本地库（IndexedDB），下方浏览器实时读取本地数据 —— 无需联网。
          数据集 id：<span className="mono" style={{ color: 'var(--cyber-cyan)' }}>{WORLD_BANK_DATASET_ID}</span>。
        </p>
        <StatGrid className="mb-3">
          <Stat value={ready ? data.length.toLocaleString() : '…'} label="本地记录行" accent="#c41e3a" />
          <Stat value={WORLD_BANK_COUNT.indicators} label="核心指标" accent="#22d3ee" />
          <Stat value={WORLD_BANK_COUNT.countries} label="国家 / 地区" accent="#e8a317" />
          <Stat value={`${WORLD_BANK_META.yearMin}–${WORLD_BANK_META.yearMax}`} label="年份覆盖" accent="#10b981" />
        </StatGrid>
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs mono px-2 py-1 rounded" style={{ background: loaded ? 'rgba(16,185,129,0.14)' : 'var(--bg-elevated)', color: loaded ? '#10b981' : 'var(--text-tertiary)' }}>
            {loaded ? '✓ 已载入本地库' : '尚未载入'}
          </span>
          <button onClick={doLoad} style={{ ...btn(false), padding: '6px 16px', fontSize: 13, color: 'var(--cyber-cyan)' }}>{loaded ? '覆盖刷新' : '载入'}本地库（{WORLD_BANK_COUNT.total} 行）</button>
          <button onClick={doClear} style={{ ...btn(false), padding: '6px 16px', fontSize: 13, color: 'var(--china-red)' }}>清空数据集</button>
          <span className="text-[11px]" style={{ color: 'var(--text-tertiary)' }}>来源：{WORLD_BANK_META.sources.join(' / ')} · 截至 {WORLD_BANK_META.asOf}</span>
        </div>
      </Card>

      <Card title="指标浏览器 · 选择指标 → 本地数据出表 + 趋势图" className="mb-4">
        <div className="flex gap-2 flex-wrap mb-4 text-xs items-center">
          <select value={indCode} onChange={(e) => setIndCode(e.target.value)} style={{ ...inp, width: 240 }}>
            {WORLD_BANK_INDICATORS.map((i) => <option key={i.code} value={i.code}>{i.name}（{i.unit}）</option>)}
          </select>
          <select value={country} onChange={(e) => setCountry(e.target.value)} style={{ ...inp, width: 130 }}>
            <option value="ALL">全部地区对比</option>
            {WORLD_BANK_COUNTRIES.map((c) => <option key={c.code} value={c.code}>{c.name}</option>)}
          </select>
          <span style={{ color: 'var(--text-tertiary)' }}>年份</span>
          <select value={yFrom} onChange={(e) => setYFrom(Number(e.target.value))} style={{ ...inp, width: 90 }}>{years.map((y) => <option key={y} value={y}>{y}</option>)}</select>
          <span style={{ color: 'var(--text-tertiary)' }}>至</span>
          <select value={yTo} onChange={(e) => setYTo(Number(e.target.value))} style={{ ...inp, width: 90 }}>{years.map((y) => <option key={y} value={y}>{y}</option>)}</select>
          <span className="mono px-2 py-0.5 rounded" style={{ background: 'var(--bg-elevated)', color: ind.accent }}>{ind.code}</span>
        </div>
        {!ready ? (
          <div className="py-16 text-center text-sm mono" style={{ color: 'var(--text-tertiary)' }}>// 读取本地库…</div>
        ) : option ? (
          <div className="grid gap-4" style={{ gridTemplateColumns: 'minmax(0,1fr)' }}>
            <div style={{ border: '1px solid var(--border-subtle)', borderRadius: 8, padding: 8 }}>
              <div className="text-xs mono mb-1" style={{ color: 'var(--text-secondary)' }}>{ind.name} · 趋势（{country === 'ALL' ? '三地对比' : (WORLD_BANK_COUNTRIES.find((c) => c.code === country)?.name)}）· 单位 {ind.unit}</div>
              <EChart option={option} style={{ height: 300 }} />
            </div>
            <DataTable rows={tableRows} columns={['年份', '国家地区', '指标', '数值', '单位', '指标代码']} />
          </div>
        ) : (
          <div className="py-16 text-center text-sm mono" style={{ color: 'var(--text-tertiary)' }}>// 当前筛选无本地数据，调整指标 / 地区 / 年份</div>
        )}
      </Card>
    </div>
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
      yAxis: { type: 'category', data: top.map((x) => String(x.key)), axisLine: { lineStyle: { color: AXIS.lineStyle.color } } },
      series: [{ type: 'bar', data: top.map((x) => x.value), barWidth: 12, itemStyle: { color: '#22d3ee', borderRadius: 3 }, label: { show: true, position: 'right', color: LABEL.color } }] };
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

// ---------- 人才精英 ----------
function Figures({ figures, refresh, flash, datasets }) {
  const [text, setText] = useState('');
  const [preview, setPreview] = useState(null);
  const [q, setQ] = useState('');
  const FIELD_LABEL = { name: '姓名', gender: '性别', birth: '出生', native: '籍贯', ethnic: '民族', party: '入党', edu: '学历', title: '现任', field: '分管' };
  const [bulk, setBulk] = useState('');
  const [bulkAllBusy, setBulkAllBusy] = useState(false);
  const [bulkAllStep, setBulkAllStep] = useState('');
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
    if (replace && figures.length && !window.confirm(`将覆盖/更新 ${FIGURE_SEED.length} 条省部级中国政要（${FIGURE_CATALOG_META.asOf}），继续？`)) return;
    let ts = Date.now();
    for (const r of FIGURE_SEED) await DB.putFigure({ ...r, id: figureStableId(r), updatedAt: ts++ });
    await refresh();
    flash(`已载入 ${FIGURE_CATALOG_META.label}：${FIGURE_SEED.length} 条（截至 ${FIGURE_CATALOG_META.asOf}）`);
  };
  const acLoaded = datasets?.some((d) => d.id === ANTI_CORRUPTION_SEED_PKG.id);
  const loadAntiCorruption = async () => {
    if (acLoaded && !window.confirm(`将覆盖反腐数据集（${ANTI_CORRUPTION_COUNT} 条），继续？`)) return;
    await DB.putDataset({ ...ANTI_CORRUPTION_SEED_PKG, stampMs: Date.now() });
    await refresh();
    flash(`已载入 ${ANTI_CORRUPTION_META.label}：${ANTI_CORRUPTION_COUNT} 条`);
  };
  const acadLoaded = datasets?.some((d) => d.id === ACADEMICIAN_SEED_PKG.id);
  const loadAcademician = async () => {
    if (acadLoaded && !window.confirm(`将覆盖两院院士数据集（${ACADEMICIAN_DEDUPED_COUNT.total} 条），继续？`)) return;
    await DB.putDataset({ ...ACADEMICIAN_SEED_PKG, stampMs: Date.now() });
    await refresh();
    flash(`已载入 ${ACADEMICIAN_META.label}：${ACADEMICIAN_DEDUPED_COUNT.total} 条（中科院 ${ACADEMICIAN_DEDUPED_COUNT.cas} / 工程院 ${ACADEMICIAN_DEDUPED_COUNT.cae} / 两院 ${ACADEMICIAN_DEDUPED_COUNT.both}）`);
  };
  const ceLoaded = datasets?.some((d) => d.id === CULTURAL_ELITE_SEED_PKG.id);
  const loadCulturalElite = async () => {
    if (ceLoaded && !window.confirm(`将覆盖知识精英数据集（${CULTURAL_ELITE_DEDUPED_COUNT.total} 条），继续？`)) return;
    await DB.putDataset({ ...CULTURAL_ELITE_SEED_PKG, stampMs: Date.now() });
    await refresh();
    flash(`已载入 ${CULTURAL_ELITE_META.label}：${CULTURAL_ELITE_DEDUPED_COUNT.total} 条（${CE_SUB_CATS.map((k) => `${CE_TAB_LABEL[k]} ${CULTURAL_ELITE_DEDUPED_COUNT[k]}`).join(' / ')}）`);
  };
  const heLoaded = datasets?.some((d) => d.id === HIGHER_EDUCATION_SEED_PKG.id);
  const loadHigherEducation = async () => {
    if (heLoaded && !window.confirm(`将覆盖高等教育数据集（${HIGHER_EDUCATION_COUNT.total} 条），继续？`)) return;
    await DB.putDataset({ ...HIGHER_EDUCATION_SEED_PKG, stampMs: Date.now() });
    await refresh();
    flash(`已载入 ${HIGHER_EDUCATION_META.label}：${HIGHER_EDUCATION_COUNT.total} 所`);
  };
  const ttLoaded = datasets?.some((d) => d.id === THINK_TANK_SEED_PKG.id);
  const loadThinkTank = async () => {
    if (ttLoaded && !window.confirm(`将覆盖智库数据集（${THINK_TANK_DEDUPED_COUNT.total} 条），继续？`)) return;
    await DB.putDataset({ ...THINK_TANK_SEED_PKG, stampMs: Date.now() });
    await refresh();
    flash(`已载入 ${THINK_TANK_META.label}：${THINK_TANK_DEDUPED_COUNT.total} 家`);
  };
  const riLoaded = datasets?.some((d) => d.id === RESEARCH_INSTITUTE_SEED_PKG.id);
  const loadResearchInstitute = async () => {
    if (riLoaded && !window.confirm(`将覆盖科研院所数据集（${RESEARCH_INSTITUTE_COUNT.total} 条），继续？`)) return;
    await DB.putDataset({ ...RESEARCH_INSTITUTE_SEED_PKG, stampMs: Date.now() });
    await refresh();
    flash(`已载入 ${RESEARCH_INSTITUTE_META.label}：${RESEARCH_INSTITUTE_COUNT.total} 所`);
  };
  const beLoaded = datasets?.some((d) => d.id === BUSINESS_ELITE_SEED_PKG.id);
  const loadBusinessElite = async () => {
    if (beLoaded && !window.confirm(`将覆盖商业精英数据集（${BUSINESS_ELITE_COUNT.total} 条），继续？`)) return;
    await DB.putDataset({ ...BUSINESS_ELITE_SEED_PKG, stampMs: Date.now() });
    await refresh();
    flash(`已载入 ${BUSINESS_ELITE_META.label}：${BUSINESS_ELITE_COUNT.total} 条（创始人 ${BUSINESS_ELITE_COUNT.founder} / 实控人 ${BUSINESS_ELITE_COUNT.controller || 0} / 高管 ${BUSINESS_ELITE_COUNT.executive} / 投资人 ${BUSINESS_ELITE_COUNT.investor} / 行业领袖 ${BUSINESS_ELITE_COUNT.industry_leader}）`);
  };
  const otLoaded = datasets?.some((d) => d.id === OVERSEAS_TALENT_SEED_PKG.id);
  const loadOverseasTalent = async () => {
    if (otLoaded && !window.confirm(`将覆盖海外人才数据集（${OVERSEAS_TALENT_DEDUPED_COUNT.total} 条），继续？`)) return;
    await DB.putDataset({ ...OVERSEAS_TALENT_SEED_PKG, stampMs: Date.now() });
    await refresh();
    flash(`已载入 ${OVERSEAS_TALENT_META.label}：${OVERSEAS_TALENT_DEDUPED_COUNT.total} 条（${['knowledge', 'tech', 'industry', 'culture', 'academic'].map((k) => `${OT_TAB_LABEL[k]} ${OVERSEAS_TALENT_DEDUPED_COUNT[k]}`).join(' / ')}）`);
  };
  const smLoaded = datasets?.some((d) => d.id === SELF_MEDIA_SEED_PKG.id);
  const loadSelfMedia = async () => {
    if (smLoaded && !window.confirm(`将覆盖自媒体人数据集（${SELF_MEDIA_DEDUPED_COUNT.total} 条），继续？`)) return;
    await DB.putDataset({ ...SELF_MEDIA_SEED_PKG, stampMs: Date.now() });
    await refresh();
    flash(`已载入 ${SELF_MEDIA_META.label}：${SELF_MEDIA_DEDUPED_COUNT.total} 条（${SM_SUB_CATS.map((k) => `${SM_TAB_LABEL[k]} ${SELF_MEDIA_DEDUPED_COUNT[k]}`).join(' / ')}）`);
  };
  const dcLoaded = datasets?.some((d) => d.id === DIPLOMATIC_CORPS_SEED_PKG.id);
  const loadDiplomaticCorps = async () => {
    if (dcLoaded && !window.confirm(`将覆盖外交人才数据集（${DIPLOMATIC_CORPS_DEDUPED_COUNT.total} 条），继续？`)) return;
    await DB.putDataset({ ...DIPLOMATIC_CORPS_SEED_PKG, stampMs: Date.now() });
    await refresh();
    flash(`已载入 ${DIPLOMATIC_CORPS_META.label}：${DIPLOMATIC_CORPS_DEDUPED_COUNT.total} 条（${['亚太', '欧洲', '北美', '拉美', '非洲', '中东', '国际组织'].map((k) => `${DC_TAB_LABEL[k]} ${DIPLOMATIC_CORPS_DEDUPED_COUNT[k]}`).join(' / ')}）`);
  };
  const dvLoaded = datasets?.some((d) => d.id === DISSIDENT_SEED_PKG.id);
  const loadDissident = async () => {
    if (dvLoaded && !window.confirm(`将覆盖异见人士数据集（${DISSIDENT_DEDUPED_COUNT.total} 条），继续？`)) return;
    await DB.putDataset({ ...DISSIDENT_SEED_PKG, stampMs: Date.now() });
    await refresh();
    flash(`已载入 ${DISSIDENT_META.label}：${DISSIDENT_DEDUPED_COUNT.total} 条（${['lawyer', 'journalist', 'writer', 'movement', 'religion', 'labor', 'online', 'exile'].map((k) => `${DV_TAB_LABEL[k]} ${DISSIDENT_DEDUPED_COUNT[k]}`).join(' / ')}）`);
  };
  const twLoaded = datasets?.some((d) => d.id === TAIWAN_POLITICAL_SEED_PKG.id);
  const loadTaiwanPolitical = async () => {
    if (twLoaded && !window.confirm(`将覆盖台湾政治人物数据集（${TAIWAN_POLITICAL_DEDUPED_COUNT.total} 条），继续？`)) return;
    await DB.putDataset({ ...TAIWAN_POLITICAL_SEED_PKG, stampMs: Date.now() });
    await refresh();
    flash(`已载入 ${TAIWAN_POLITICAL_META.label}：${TAIWAN_POLITICAL_DEDUPED_COUNT.total} 条（${['president', 'premier', 'legislature', 'party', 'local', 'diplomacy', 'other'].map((k) => `${TW_TAB_LABEL[k]} ${TAIWAN_POLITICAL_DEDUPED_COUNT[k]}`).join(' / ')}）`);
  };
  const loadAllTalent = async () => {
    if (!window.confirm(getTalentBulkConfirmMessage())) return;
    setBulkAllBusy(true);
    setBulkAllStep('准备清空…');
    try {
      const { results } = await loadAllTalentEliteSeeds({
        onProgress: ({ queue, index, total, status }) => {
          if (status === 'loading') setBulkAllStep(`载入 ${queue.label}（${index + 1}/${total}）…`);
          else if (status === 'done') setBulkAllStep(`✓ ${queue.label}（${index + 1}/${total}）`);
          else if (status === 'error') setBulkAllStep(`✗ ${queue.label} 失败`);
        },
      });
      await refresh();
      flash(formatTalentBulkSummary(results));
    } catch (e) {
      flash('一键载入失败：' + (e.message || e));
    }
    setBulkAllBusy(false);
    setBulkAllStep('');
  };
  return (
    <div>
      <Card title="人才精英 · 结构化人力资本图谱" className="mb-4">
        <p className="text-[11px]" style={{ color: 'var(--text-tertiary)' }}>
          各队列种子载入与增量导入后台；与中国政要、反腐透视、异见人士、高等教育、智库、科研院所、知识精英、商业精英、海外人才、外交人才等数据集解耦存储。
          前台展示于 <Link to="/talent" className="mono" style={{ color: 'var(--cyber-cyan)' }}>人才精英库</Link>。
        </p>
      </Card>
      <Card title="一键载入 · 全部人才精英队列" className="mb-4">
        <p className="text-[11px] mb-2" style={{ color: 'var(--text-tertiary)' }}>
          范围：{TALENT_BULK_SCOPE_LABEL}。将先清空中国政要库，再覆盖载入 {TALENT_BULK_QUEUES.length} 个队列共约 {TALENT_BULK_TOTAL_COUNT.toLocaleString()} 条内置种子。
        </p>
        <p className="text-[11px] mb-3 mono" style={{ color: 'var(--text-secondary)' }}>
          {TALENT_BULK_QUEUES.map((q) => `${q.label} ${q.count}`).join(' · ')}
        </p>
        <div className="flex items-center gap-3 flex-wrap">
          <button
            onClick={loadAllTalent}
            disabled={bulkAllBusy}
            style={{
              ...btn(true),
              padding: '8px 20px',
              fontSize: 14,
              background: bulkAllBusy ? 'rgba(34,211,238,0.12)' : 'rgba(34,211,238,0.22)',
              color: 'var(--cyber-cyan)',
              border: '1px solid rgba(34,211,238,0.45)',
            }}
          >
            {bulkAllBusy ? '载入中…' : '一键清空并载入内置'}
          </button>
          {bulkAllBusy && bulkAllStep && (
            <span className="text-xs mono" style={{ color: 'var(--cyber-cyan)' }}>{bulkAllStep}</span>
          )}
        </div>
      </Card>
      <Card title="海外人才库 · 跨境人力资本队列（与境内精英互补）" className="mb-4">
        <p className="text-[11px] mb-2" style={{ color: 'var(--text-tertiary)' }}>
          内置 {OVERSEAS_TALENT_DEDUPED_COUNT.total} 条（{OVERSEAS_TALENT_META.scope}）。来源 {OVERSEAS_TALENT_META.sources.slice(0, 4).join(' / ')}等。
          {OVERSEAS_TALENT_META.notes} 展示于 <Link to="/talent?tab=overseas" className="mono" style={{ color: 'var(--cyber-cyan)' }}>人才精英库 · 海外人才</Link> 队列。
        </p>
        <button onClick={loadOverseasTalent} style={{ ...btn(false), padding: '6px 16px', fontSize: 13, color: '#0ea5e9', borderColor: 'rgba(14,165,233,0.35)' }}>
          {otLoaded ? '覆盖载入' : '载入'}海外人才库（{OVERSEAS_TALENT_DEDUPED_COUNT.total} 条 · {OVERSEAS_TALENT_META.asOf}）
        </button>
      </Card>
      <Card title="自媒体人库 · 传媒影响力队列（与知识精英拆分）" className="mb-4">
        <p className="text-[11px] mb-2" style={{ color: 'var(--text-tertiary)' }}>
          内置 {SELF_MEDIA_DEDUPED_COUNT.total} 条（{SELF_MEDIA_META.scope}）。来源 {SELF_MEDIA_META.sources.slice(0, 4).join(' / ')}等。
          {SELF_MEDIA_META.notes} 展示于 <Link to="/talent?tab=self-media" className="mono" style={{ color: 'var(--cyber-cyan)' }}>人才精英库 · 自媒体人</Link> 队列。
        </p>
        <button onClick={loadSelfMedia} style={{ ...btn(false), padding: '6px 16px', fontSize: 13, color: '#f472b6', borderColor: 'rgba(244,114,182,0.35)' }}>
          {smLoaded ? '覆盖载入' : '载入'}自媒体人库（{SELF_MEDIA_DEDUPED_COUNT.total} 条 · {SELF_MEDIA_META.asOf}）
        </button>
      </Card>
      <Card title="外交人才库 · 驻外使节全图（与政要/海外人才分轨）" className="mb-4">
        <p className="text-[11px] mb-2" style={{ color: 'var(--text-tertiary)' }}>
          内置 {DIPLOMATIC_CORPS_DEDUPED_COUNT.total} 条（{DIPLOMATIC_CORPS_META.scope}）。来源 {DIPLOMATIC_CORPS_META.sources.slice(0, 4).join(' / ')}等。
          {DIPLOMATIC_CORPS_META.notes} 展示于 <Link to="/talent?tab=diplomatic" className="mono" style={{ color: 'var(--cyber-cyan)' }}>人才精英库 · 外交人才</Link> 队列。
        </p>
        <button onClick={loadDiplomaticCorps} style={{ ...btn(false), padding: '6px 16px', fontSize: 13, color: '#f59e0b', borderColor: 'rgba(245,158,11,0.35)' }}>
          {dcLoaded ? '覆盖载入' : '载入'}外交人才库（{DIPLOMATIC_CORPS_DEDUPED_COUNT.total} 条 · {DIPLOMATIC_CORPS_META.asOf}）
        </button>
      </Card>
      <Card title="商业精英库 · 资本逻辑队列（与中国政要/知识生产隔离）" className="mb-4">
        <p className="text-[11px] mb-2" style={{ color: 'var(--text-tertiary)' }}>
          内置 {BUSINESS_ELITE_COUNT.total} 条（{BUSINESS_ELITE_META.scope}）。来源 {BUSINESS_ELITE_META.sources.slice(0, 4).join(' / ')}等。
          {BUSINESS_ELITE_META.notes} 展示于 <Link to="/talent?tab=business" className="mono" style={{ color: 'var(--cyber-cyan)' }}>人才精英库 · 商业精英</Link> 队列。
        </p>
        <button onClick={loadBusinessElite} style={{ ...btn(false), padding: '6px 16px', fontSize: 13, color: '#e8a317', borderColor: 'rgba(232,163,23,0.35)' }}>
          {beLoaded ? '覆盖载入' : '载入'}商业精英库（{BUSINESS_ELITE_COUNT.total} 条 · {BUSINESS_ELITE_META.asOf}）
        </button>
      </Card>
      <Card title="高等教育库 · 机构载体队列（已从知识精英解耦）" className="mb-4">
        <p className="text-[11px] mb-2" style={{ color: 'var(--text-tertiary)' }}>
          内置 {HIGHER_EDUCATION_COUNT.total} 所（{HIGHER_EDUCATION_META.scope}）。来源 {HIGHER_EDUCATION_META.sources.slice(0, 4).join(' / ')}等。
          {HIGHER_EDUCATION_META.notes} 展示于 <Link to="/talent?tab=education" className="mono" style={{ color: 'var(--cyber-cyan)' }}>人才精英库 · 高等教育</Link> 队列。
        </p>
        <button onClick={loadHigherEducation} style={{ ...btn(false), padding: '6px 16px', fontSize: 13, color: '#10b981', borderColor: 'rgba(16,185,129,0.35)' }}>
          {heLoaded ? '覆盖载入' : '载入'}高等教育库（{HIGHER_EDUCATION_COUNT.total} 所 · {HIGHER_EDUCATION_META.asOf}）
        </button>
      </Card>
      <Card title="智库库 · 机构载体队列" className="mb-4">
        <p className="text-[11px] mb-2" style={{ color: 'var(--text-tertiary)' }}>
          内置 {THINK_TANK_DEDUPED_COUNT.total} 家（{THINK_TANK_META.scope}）。来源 {THINK_TANK_META.sources.slice(0, 4).join(' / ')}等。
          {THINK_TANK_META.notes} 展示于 <Link to="/talent?tab=thinktank" className="mono" style={{ color: 'var(--cyber-cyan)' }}>人才精英库 · 智库</Link> 队列。
        </p>
        <button onClick={loadThinkTank} style={{ ...btn(false), padding: '6px 16px', fontSize: 13, color: 'var(--cyber-cyan)', borderColor: 'rgba(34,211,238,0.35)' }}>
          {ttLoaded ? '覆盖载入' : '载入'}智库库（{THINK_TANK_DEDUPED_COUNT.total} 家 · {THINK_TANK_META.asOf}）
        </button>
      </Card>
      <Card title="科研院所库 · 国立体系 + 民企科研" className="mb-4">
        <p className="text-[11px] mb-2" style={{ color: 'var(--text-tertiary)' }}>
          内置 {RESEARCH_INSTITUTE_COUNT.total} 条（{RESEARCH_INSTITUTE_META.scope}）。来源 {RESEARCH_INSTITUTE_META.sources.slice(0, 4).join(' / ')}等。
          {RESEARCH_INSTITUTE_META.notes} 展示于 <Link to="/talent?tab=research" className="mono" style={{ color: 'var(--cyber-cyan)' }}>人才精英库 · 科研院所</Link> 队列。
        </p>
        <button onClick={loadResearchInstitute} style={{ ...btn(false), padding: '6px 16px', fontSize: 13, color: '#a78bfa', borderColor: 'rgba(139,92,246,0.35)' }}>
          {riLoaded ? '覆盖载入' : '载入'}科研院所库（{RESEARCH_INSTITUTE_COUNT.total} 条 · 大科学装置 {RESEARCH_INSTITUTE_COUNT.facility} 项 · {RESEARCH_INSTITUTE_META.asOf}）
        </button>
      </Card>
      <Card title="两院院士库 · 独立数据集（中科院 / 工程院）" className="mb-4">
        <p className="text-[11px] mb-2" style={{ color: 'var(--text-tertiary)' }}>
          内置 {ACADEMICIAN_DEDUPED_COUNT.total} 条（{ACADEMICIAN_META.scope}）。来源 {ACADEMICIAN_META.sources.slice(0, 4).join(' / ')}等。
          {ACADEMICIAN_META.notes} 已并入 <Link to="/talent?tab=knowledge" className="mono" style={{ color: 'var(--cyber-cyan)' }}>人才精英库 · 知识精英 · 基础科学/工程技术/医学健康</Link> 队列并带两院院士标记。
        </p>
        <button onClick={loadAcademician} style={{ ...btn(false), padding: '6px 16px', fontSize: 13, color: '#d4af37', borderColor: 'rgba(212,175,55,0.45)' }}>
          {acadLoaded ? '覆盖载入' : '载入'}两院院士库（{ACADEMICIAN_DEDUPED_COUNT.total} 条 · {ACADEMICIAN_META.asOf}）
        </button>
      </Card>
      <Card title="知识精英库 · 知识生产队列（与中国政要隔离）" className="mb-4">
        <p className="text-[11px] mb-2" style={{ color: 'var(--text-tertiary)' }}>
          内置 {CULTURAL_ELITE_DEDUPED_COUNT.total} 条（含两院院士 enrich）。来源 {CULTURAL_ELITE_META.sources.slice(0, 4).join(' / ')}等。
          {CULTURAL_ELITE_META.notes} 展示于 <Link to="/talent?tab=knowledge" className="mono" style={{ color: 'var(--cyber-cyan)' }}>人才精英库 · 知识精英</Link> 队列。
        </p>
        <button onClick={loadCulturalElite} style={{ ...btn(false), padding: '6px 16px', fontSize: 13, color: '#a78bfa', borderColor: 'rgba(139,92,246,0.35)' }}>
          {ceLoaded ? '覆盖载入' : '载入'}知识精英库（{CULTURAL_ELITE_DEDUPED_COUNT.total} 条 · {CULTURAL_ELITE_META.asOf}）
        </button>
      </Card>
      <Card title="反腐透视 · 独立数据集（与中国政要隔离）" className="mb-4">
        <p className="text-[11px] mb-2" style={{ color: 'var(--text-tertiary)' }}>
          内置 {ANTI_CORRUPTION_COUNT} 条（{ANTI_CORRUPTION_META.scope}）。来源 {ANTI_CORRUPTION_META.sources.join(' / ')}。
          {ANTI_CORRUPTION_META.notes} 展示于 <Link to="/talent?tab=anticorruption" className="mono" style={{ color: 'var(--cyber-cyan)' }}>人才精英库 · 反腐透视</Link> 队列。
        </p>
        <button onClick={loadAntiCorruption} style={{ ...btn(false), padding: '6px 16px', fontSize: 13, color: 'var(--china-red)', borderColor: 'rgba(196,30,58,0.35)' }}>
          {acLoaded ? '覆盖载入' : '载入'}反腐名单（{ANTI_CORRUPTION_COUNT} 条 · {ANTI_CORRUPTION_META.asOf}）
        </button>
      </Card>
      <Card title="异见人士库 · 制度边界档案（与政要/知识生产隔离）" className="mb-4">
        <p className="text-[11px] mb-2" style={{ color: 'var(--text-tertiary)' }}>
          内置 {DISSIDENT_DEDUPED_COUNT.total} 条（{DISSIDENT_META.scope}）。来源 {DISSIDENT_META.sources.slice(0, 4).join(' / ')}等。
          {DISSIDENT_META.notes} 展示于 <Link to="/talent?tab=dissident" className="mono" style={{ color: 'var(--cyber-cyan)' }}>人才精英库 · 异见人士</Link> 队列。
        </p>
        <button onClick={loadDissident} style={{ ...btn(false), padding: '6px 16px', fontSize: 13, color: '#a78bfa', borderColor: 'rgba(139,92,246,0.35)' }}>
          {dvLoaded ? '覆盖载入' : '载入'}异见人士库（{DISSIDENT_DEDUPED_COUNT.total} 条 · {DISSIDENT_META.asOf}）
        </button>
      </Card>
      <Card title="台湾政治人物库 · 公开任职档案（与大陆政要/异见人士隔离）" className="mb-4">
        <p className="text-[11px] mb-2" style={{ color: 'var(--text-tertiary)' }}>
          内置 {TAIWAN_POLITICAL_DEDUPED_COUNT.total} 条（{TAIWAN_POLITICAL_META.scope}）。来源 {TAIWAN_POLITICAL_META.sources.slice(0, 3).join(' / ')}等。
          {TAIWAN_POLITICAL_META.notes} 展示于 <Link to="/talent?tab=taiwan" className="mono" style={{ color: 'var(--cyber-cyan)' }}>人才精英库 · 台湾政要</Link> 队列。
        </p>
        <button onClick={loadTaiwanPolitical} style={{ ...btn(false), padding: '6px 16px', fontSize: 13, color: '#38bdf8', borderColor: 'rgba(56,189,248,0.35)' }}>
          {twLoaded ? '覆盖载入' : '载入'}台湾政治人物库（{TAIWAN_POLITICAL_DEDUPED_COUNT.total} 条 · {TAIWAN_POLITICAL_META.asOf}）
        </button>
      </Card>
      <Card title="批量导入 · 从权威来源整段粘贴（多条简历）" className="mb-4">
        <p className="text-[11px] mb-2" style={{ color: 'var(--text-tertiary)' }}>
          支持：多条简历以空行或「---」分隔、每行一条 JSON(JSONL)、或 JSON 数组。自动按省份关键词关联。
          内置数据集：{FIGURE_CATALOG_META.label}（共 {FIGURE_SEED.length} 条：省级 {FIGURE_CATALOG_META.breakdown?.provincial} + 人大政协 {FIGURE_CATALOG_META.breakdown?.provincialExtended} + 常委岗位 {FIGURE_CATALOG_META.breakdown?.provincialStanding} + 中央 {FIGURE_CATALOG_META.breakdown?.central} + 扩展 {FIGURE_CATALOG_META.breakdown?.extended} + 城市 {FIGURE_CATALOG_META.breakdown?.municipal} + 地级市 {FIGURE_CATALOG_META.breakdown?.prefectureCity} + 机构 {FIGURE_CATALOG_META.breakdown?.org} + 二层 {FIGURE_CATALOG_META.breakdown?.orgTier2} + 军事 {FIGURE_CATALOG_META.breakdown?.military}）· 来源 {FIGURE_CATALOG_META.sources.join(' / ')}。
        </p>
        <textarea value={bulk} onChange={(e) => setBulk(e.target.value)} placeholder={'姓名：张三\n现任：XX省委书记\n2020— 任XX省委书记\n---\n姓名：李四\n现任：XX省省长\n2021— 任XX省省长'} style={{ ...inp, height: 120, fontFamily: 'monospace', resize: 'vertical', width: '100%' }} />
        <div className="flex gap-2 mt-2 flex-wrap">
          <button onClick={doBulk} style={{ ...btn(true), padding: '6px 16px', fontSize: 13 }}>批量解析导入</button>
          <button onClick={() => loadSeed(true)} style={{ ...btn(false), padding: '6px 16px', fontSize: 13, color: 'var(--cyber-cyan)' }}>载入中国政要（{FIGURE_SEED.length} 条 · {FIGURE_CATALOG_META.asOf}）</button>
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
        <p className="text-[11px] mt-2" style={{ color: 'var(--text-tertiary)' }}>解析抽取「标签：值」字段与含年份的履历时间线；仅录入用户提供的公开任职履历文本，供研究检索。</p>
      </Card>
      <Card title={`中国政要库 (${filtered.length}/${figures.length})`}>
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
          {!filtered.length && <div className="py-16 text-center text-sm mono" style={{ color: 'var(--text-tertiary)' }}>// {figures.length ? '无匹配' : '中国政要库为空'}</div>}
        </div>
      </Card>
    </Grid>
    </div>
  );
}

// ---------- 政策文件（上传 / 解析 / 管理） ----------
function Docs({ docs, refresh, flash }) {
  const [text, setText] = useState('');
  const [parsed, setParsed] = useState(null);
  const [q, setQ] = useState('');
  const [busy, setBusy] = useState(false);
  const doParse = () => { try { const p = parseDoc(text); setParsed(p); } catch (e) { flash('解析失败：' + e.message); } };
  const save = async () => { try { await DB.putDoc({ ...parsed, updatedAt: Date.now() }); setText(''); setParsed(null); await refresh(); flash(`已录入「${parsed.title}」`); } catch (e) { flash('录入失败：' + (e.message || e)); } };
  const loadSeed = async () => {
    setBusy(true);
    try {
      await DB.clearDocs();
      let ts = Date.now();
      for (const d of DOC_SEED) await DB.putDoc({ ...d, id: d.id, updatedAt: ts++ });
      await refresh();
      flash(`已载入内置政策文件 ${DOC_SEED.length} 份`);
    } catch (e) { flash('载入失败：' + (e.message || e)); }
    setBusy(false);
  };
  const filtered = docs.filter((d) => !q || (d.title + ' ' + d.type + ' ' + (d.category || '') + ' ' + (d.keywords || []).join(' ')).includes(q));
  return (
    <div>
      <Card title="政策文件库 · 内置载入" className="mb-4">
        <p className="text-[11px] mb-2" style={{ color: 'var(--text-tertiary)' }}>
          内置 {DOC_SEED.length} 份公开要点（{Object.entries(DOC_CATALOG_META.breakdown).filter(([, n]) => n).map(([k, n]) => `${k} ${n}`).slice(0, 5).join(' / ')}… 共 {DOC_CATALOG_META.total} 份）。来源：{DOC_CATALOG_META.sources.join(' / ')}。前台「<Link to="/policydocs" className="mono" style={{ color: 'var(--cyber-cyan)' }}>政策文件库</Link>」做报告比对、指标趋势与政策洞察。
        </p>
        <button onClick={loadSeed} disabled={busy} style={{ ...btn(false), padding: '6px 16px', fontSize: 13, color: 'var(--cyber-cyan)' }}>{busy ? '载入中…' : `清空并载入内置 ${DOC_SEED.length} 份（去重幂等）`}</button>
      </Card>
      <Card title="法律条文库 · 存量队列" className="mb-4">
        <p className="text-[11px] mb-2" style={{ color: 'var(--text-tertiary)' }}>
          内置 {LEGAL_STATUTE_DEDUPED_COUNT.total} 条规范要点（法律 {LEGAL_STATUTE_DEDUPED_COUNT.law} · 行政法规 {LEGAL_STATUTE_DEDUPED_COUNT.admin_regulation} · 司法解释 {LEGAL_STATUTE_DEDUPED_COUNT.judicial_interpretation}）。
          前台「<Link to="/policydocs?tab=legal" className="mono" style={{ color: 'var(--cyber-cyan)' }}>政令文库 · 法律条文</Link>」做领域检索与交叉引用；IndexedDB 刷新请至「存量队列」选择法律条文库一键录入。
        </p>
        <p className="text-[11px]" style={{ color: 'var(--text-tertiary)' }}>{LEGAL_STATUTE_META.notes}</p>
      </Card>
      <Grid cols={2}>
        <Card title="上传解析 · 粘贴报告 / 公报全文或要点">
          <textarea value={text} onChange={(e) => setText(e.target.value)} placeholder={'2025年政府工作报告\n国内生产总值增长5%左右；赤字率4%左右；城镇新增就业1200万人以上……\n大力提振消费、适度宽松的货币政策、人工智能+……'} style={{ ...inp, height: 200, fontFamily: 'monospace', resize: 'vertical' }} />
          <div className="flex gap-2 mt-2">
            <button onClick={doParse} style={{ ...btn(true), padding: '6px 16px', fontSize: 13 }}>解析</button>
            {parsed && <button onClick={save} style={{ ...btn(false), padding: '6px 16px', fontSize: 13, color: '#10b981' }}>录入数据库</button>}
          </div>
          {parsed && (
            <div className="mt-3 p-3 rounded text-xs" style={{ background: 'var(--bg-elevated)' }}>
              <div className="flex items-center gap-2 mb-2">
                <span className="font-bold" style={{ color: 'var(--text-primary)' }}>{parsed.title}</span>
                <span className="mono px-1.5 py-0.5 rounded" style={{ background: `${TYPE_COLOR[parsed.type] || '#64748b'}22`, color: TYPE_COLOR[parsed.type] || '#64748b' }}>{parsed.type}{parsed.year ? ` · ${parsed.year}` : ''}</span>
              </div>
              {Object.values(parsed.metrics || {}).some((v) => v != null) && (
                <div className="flex flex-wrap gap-x-3 gap-y-1 mb-2">
                  {GWR_METRICS.filter((m) => parsed.metrics[m.key] != null).map((m) => <span key={m.key} style={{ color: 'var(--text-tertiary)' }}>{m.label}：<span className="mono" style={{ color: 'var(--cyber-cyan)' }}>{parsed.metrics[m.key]}{m.unit}</span></span>)}
                </div>
              )}
              {(parsed.keywords || []).length > 0 && <div className="flex flex-wrap gap-1 mb-1">{parsed.keywords.map((k) => <span key={k} className="mono px-1.5 py-0.5 rounded" style={{ background: 'var(--bg-base)', color: 'var(--text-secondary)', fontSize: 10 }}>{k}</span>)}</div>}
              <div className="text-[10px]" style={{ color: 'var(--text-tertiary)' }}>识别 {Object.values(parsed.metrics || {}).filter((v) => v != null).length} 项指标 · {(parsed.keywords || []).length} 个提法 · {(parsed.highlights || []).length} 条要点</div>
            </div>
          )}
          <p className="text-[11px] mt-2" style={{ color: 'var(--text-tertiary)' }}>自动识别文件类型、年份、量化目标（GDP/赤字率/就业等）、政策定调与关键提法；仅录入用户提供的公开文本要点，供研究比对。</p>
        </Card>
        <Card title={`政策文件库 (${filtered.length}/${docs.length})`}>
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="检索：标题 / 类型 / 提法" style={{ ...inp, marginBottom: 10 }} />
          <div className="space-y-2" style={{ maxHeight: 460, overflowY: 'auto' }}>
            {filtered.map((d) => (
              <div key={d.id} className="p-3 rounded" style={{ background: 'var(--bg-elevated)', borderLeft: `3px solid ${TYPE_COLOR[d.type] || '#64748b'}` }}>
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>{d.year} · {d.type}</span>
                  <button onClick={async () => { await DB.deleteDoc(d.id); await refresh(); flash('已删除'); }} style={{ ...btn(false), padding: '2px 8px', fontSize: 11, color: 'var(--china-red)' }}>删</button>
                </div>
                <div className="text-[11px] mt-0.5" style={{ color: 'var(--text-tertiary)' }}>{d.title}</div>
                {(d.keywords || []).length > 0 && <div className="text-[10px] mono mt-1" style={{ color: 'var(--text-tertiary)' }}>{(d.keywords || []).slice(0, 4).join(' · ')}</div>}
              </div>
            ))}
            {!filtered.length && <div className="py-16 text-center text-sm mono" style={{ color: 'var(--text-tertiary)' }}>// {docs.length ? '无匹配' : '政策文件库为空，点上方载入内置'}</div>}
          </div>
        </Card>
      </Grid>
    </div>
  );
}

// ---------- 存量队列 ----------
function Stock({ datasets, refresh, flash }) {
  const [busy, setBusy] = useState('');
  const loadPe500 = async () => {
    setBusy('pe500');
    try {
      const res = await loadPrivateEnterprise500(DB);
      await refresh();
      flash(`已载入 ${PRIVATE_ENTERPRISE_META.label}：企业 ${res.companies} · 人物 ${res.people} · 股权 ${res.equity}（深度 ${res.deep}）`);
    } catch (e) { flash('载入失败：' + (e.message || e)); }
    setBusy('');
  };
  const ingest = async (item) => {
    setBusy(item.key);
    try {
      const { rows, source } = await item.load();
      await DB.putDataset({ id: item.id || `stock_${item.key}`, name: item.name, category: item.category, source, origin: 'stock', rows, stampMs: Date.now() });
      await refresh(); flash(`已录入存量「${item.name}」 ${rows.length} 行`);
    } catch (e) { flash('录入失败：' + (e.message || e)); }
    setBusy('');
  };
  const ingestAll = async () => { for (const it of STOCK_CATALOG) { try { await ingest(it); } catch (_) {} } };
  const isIn = (name) => datasets.some((d) => d.name === name);
  return (
    <Card title="存量数据队列 · 各模块已落地数据一键录入">
      <div className="flex justify-between items-center mb-3 flex-wrap gap-2">
        <p className="text-xs" style={{ color: 'var(--text-tertiary)' }}>已分布在各模块的数据，登记为可录入数据库的存量；真实数据（省级财政/人口、WB）标注实时来源。</p>
        <div className="flex gap-2">
          <button disabled={busy === 'pe500'} onClick={loadPe500} style={{ ...btn(false), padding: '6px 14px', fontSize: 12, color: '#fb923c', borderColor: 'rgba(251,146,60,0.4)' }}>
            {busy === 'pe500' ? '载入中…' : `载入民企500强（${PRIVATE_ENTERPRISE_META.scope}）`}
          </button>
          <button onClick={ingestAll} style={{ ...btn(true), padding: '6px 14px', fontSize: 12 }}>全部录入</button>
        </div>
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
