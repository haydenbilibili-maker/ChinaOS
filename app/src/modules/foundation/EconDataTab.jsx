import React from 'react';
import {
  ECON_CATEGORIES,
  ECON_FREQ,
  PERIOD_HINT,
  parseEconSeries,
  seriesToDataset,
  rowsToPoints,
  seriesStats,
  listEconDatasets,
} from '../econdash/econSeries.js';
import {
  getRows,
  putDataset,
  updateRow,
  deleteRow,
  deleteDataset,
  subscribe,
} from '../../lib/db/localdb.js';
import EChart from '../../lib/viz/EChart.jsx';
import {
  CHART_TOOLTIP,
  LEGEND,
  chartSeriesColor,
  categoryX,
  valueY,
} from '../shared/chartHelpers.js';

// ============================================================================
// 数据底座 · 经济数据标签页（EconDataTab）—— 完整经济数据管理组件
// ----------------------------------------------------------------------------
// 由「经济大盘 · 经济数据底座」迁移并升级至「数据与系统 · 数据底座」(foundation)。
// 能力：统计条/分类筛选 · 序列上传解析预览落库 · 数据集列表（筛选+搜索+多选）·
//       单序列折线+统计+行级编辑+追加点 · 元数据编辑 · 导出 CSV/JSON · 删除 ·
//       多序列叠加对比（可归一）· 全程容错 · subscribe 自动刷新。
// 持久化：本地 IndexedDB（localdb）；putDataset 同 id 即原地覆盖（改元数据/重写行）。
// 确定性：纯 UI 交互驱动，无随机；落库 stampMs=Date.now()（用户操作落库允许）。
// 口径：用户上传/编辑数据请核对来源与口径 · 本地 IndexedDB 持久化 · 示意非官方。
// ============================================================================

// —— 样式常量（沿用 foundation/Page.jsx 同款 btn/inp 风格，本组件自定义同款）——
const BTN = (active) => ({
  background: active ? 'rgba(196,30,58,0.2)' : 'var(--bg-elevated)',
  color: active ? 'var(--chip-active-text)' : 'var(--text-secondary)',
  border: 'none',
  cursor: 'pointer',
  borderRadius: 6,
  padding: '6px 10px',
  fontSize: 13,
});
const INP = {
  background: 'var(--bg-base)',
  border: '1px solid var(--border-subtle)',
  color: 'var(--text-primary)',
  borderRadius: 6,
  padding: '6px 8px',
  fontSize: 13,
  width: '100%',
  outline: 'none',
};

// —— 解析格式档位 ——
const FMT_TABS = [
  { id: 'auto', label: '自动' },
  { id: 'csv', label: 'CSV' },
  { id: 'json', label: 'JSON' },
  { id: 'free', label: '自由粘贴' },
];

// —— 契约常量兜底（econSeries 缺失时仍可渲染）——
const CATS = Array.isArray(ECON_CATEGORIES) && ECON_CATEGORIES.length
  ? ECON_CATEGORIES
  : ['经济运行', '国家统计局', '海关总署', '世界银行', '金融货币', '财政地方', '科技指标', '区域经济'];
const FREQS = Array.isArray(ECON_FREQ) && ECON_FREQ.length
  ? ECON_FREQ
  : ['年', '季', '月', '月累计', '日', '周'];

// —— 内置示例（自由粘贴样例：年度 GDP 增速示意）——
const SAMPLE = `# 用户上传示例 · 自由粘贴（每行：期 值）
2019 6.0
2020 2.2
2021 8.4
2022 3.0
2023 5.2
2024 5.0
2025 4.8`;

const isEconDataset = (d) => !!d && CATS.includes(d.category);

// 时间戳 → 简短可读（容错）
function fmtTs(ms) {
  const n = Number(ms);
  if (!n || !isFinite(n)) return '—';
  try {
    const d = new Date(n);
    if (isNaN(d.getTime())) return '—';
    const p = (x) => String(x).padStart(2, '0');
    return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`;
  } catch (_) { return '—'; }
}

// 数字友好显示（容错）
function fmtNum(v) {
  if (v == null || v === '') return '—';
  const n = Number(v);
  if (!isFinite(n)) return String(v);
  return Math.abs(n) >= 1000 ? n.toLocaleString('en-US') : String(n);
}

// —— 容错包装：rowsToPoints（缺失时本地兜底）——
function safeRowsToPoints(rows) {
  const arr = Array.isArray(rows) ? rows : [];
  if (typeof rowsToPoints === 'function') {
    try { const r = rowsToPoints(arr); if (Array.isArray(r)) return r; } catch (_) { /* 落兜底 */ }
  }
  return arr.map((r) => {
    if (!r || typeof r !== 'object') return null;
    const period = r.period ?? r.date ?? r.time ?? r.x ?? '';
    const value = Number(r.value ?? r.val ?? r.y ?? r.amount);
    if (period === '' || !isFinite(value)) return null;
    return { period: String(period), value };
  }).filter(Boolean);
}

// —— 容错包装：seriesStats（缺失时本地兜底）——
function safeSeriesStats(points) {
  const pts = Array.isArray(points) ? points : [];
  if (typeof seriesStats === 'function') {
    try { const s = seriesStats(pts); if (s && typeof s === 'object') return s; } catch (_) { /* 落兜底 */ }
  }
  const clean = pts.filter((p) => p && p.period != null && isFinite(Number(p.value)))
    .map((p) => ({ period: String(p.period), value: Number(p.value) }));
  if (!clean.length) return { n: 0, latest: null, min: null, max: null, yoy: null, trend: 'flat' };
  const vals = clean.map((p) => p.value);
  const last = clean[clean.length - 1];
  const prev = clean.length > 1 ? clean[clean.length - 2] : null;
  const yoy = prev && prev.value !== 0 ? Math.round((last.value - prev.value) / Math.abs(prev.value) * 1000) / 10 : null;
  const trend = !prev ? 'flat' : last.value > prev.value ? 'up' : last.value < prev.value ? 'down' : 'flat';
  return { n: clean.length, latest: { period: last.period, value: last.value }, min: Math.min(...vals), max: Math.max(...vals), yoy, trend };
}

// —— 容错包装：listEconDatasets（缺失时退化为对 props.datasets 过滤）——
async function safeListEconDatasets(fallbackDatasets) {
  if (typeof listEconDatasets === 'function') {
    try { const r = await listEconDatasets(); if (Array.isArray(r)) return r; } catch (_) { /* 落兜底 */ }
  }
  const arr = Array.isArray(fallbackDatasets) ? fallbackDatasets : [];
  return arr.filter(isEconDataset).sort((a, b) => (b.updatedAt || 0) - (a.updatedAt || 0));
}

function trendSignal(trend) {
  if (trend === 'up') return '#10b981';
  if (trend === 'down') return '#c41e3a';
  return '#e8a317';
}
function trendLabel(trend) {
  if (trend === 'up') return '上行 ↑';
  if (trend === 'down') return '下行 ↓';
  if (trend === 'flat') return '走平 →';
  return '—';
}

// —— 浏览器下载触发（Blob + a[download]）——
function downloadBlob(text, filename, mime) {
  try {
    const blob = new Blob([text], { type: mime || 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(() => { try { URL.revokeObjectURL(url); } catch (_) {} }, 0);
    return true;
  } catch (_) { return false; }
}

// CSV 单元格转义
function csvCell(v) {
  const s = v == null ? '' : String(v);
  return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}

// —— 小徽章 ——
function Chip({ label, value, color, onClick, active }) {
  return (
    <span
      onClick={onClick}
      className="inline-flex items-baseline gap-1 mono"
      style={{
        fontSize: 11, padding: '3px 8px', borderRadius: 6,
        background: active ? 'rgba(196,30,58,0.2)' : 'var(--bg-elevated)',
        border: `1px solid ${active ? '#c41e3a' : 'var(--border-subtle)'}`,
        cursor: onClick ? 'pointer' : 'default',
      }}
    >
      {value != null && <span style={{ color: color || 'var(--text-primary)', fontWeight: 600 }}>{value}</span>}
      <span style={{ color: active ? 'var(--chip-active-text)' : 'var(--text-tertiary)' }}>{label}</span>
    </span>
  );
}

// —— 读数 pill ——
function Pill({ label, value, color }) {
  return (
    <span className="inline-flex flex-col" style={{ gap: 2, padding: '4px 8px', borderRadius: 6, background: 'var(--bg-base)', border: '1px solid var(--border-subtle)', minWidth: 64 }}>
      <span className="mono" style={{ fontSize: 9, color: 'var(--text-tertiary)' }}>{label}</span>
      <span className="mono" style={{ fontSize: 12, fontWeight: 600, color: color || 'var(--text-primary)' }}>{value}</span>
    </span>
  );
}

// 列名归一：取行的 period / value 原始值（容错近义列名）
function rowPeriod(r) { return r == null ? '' : (r.period ?? r.时间 ?? r.年份 ?? r.年月 ?? r.日期 ?? r.date ?? r.time ?? ''); }
function rowValue(r) { return r == null ? '' : (r.value ?? r.数值 ?? r.值 ?? r.val ?? r.y ?? ''); }

// ---------------------------------------------------------------------------
// 主组件
// ---------------------------------------------------------------------------
export default function EconDataTab({ datasets, refresh, flash } = {}) {
  const notify = React.useCallback((m) => { if (typeof flash === 'function') { try { flash(m); } catch (_) {} } }, [flash]);
  const reload = React.useCallback(async () => { if (typeof refresh === 'function') { try { await refresh(); } catch (_) {} } }, [refresh]);

  // —— 经济类数据集（优先 listEconDatasets，回退过滤 props.datasets）——
  const [econ, setEcon] = React.useState([]);
  const [listErr, setListErr] = React.useState('');
  const [loaded, setLoaded] = React.useState(false);

  const loadEcon = React.useCallback(async () => {
    try {
      const list = await safeListEconDatasets(datasets);
      setEcon(Array.isArray(list) ? list : []);
      setListErr('');
    } catch (_) {
      setEcon([]);
      setListErr('本地库读取失败（IndexedDB 可能不可用）');
    } finally {
      setLoaded(true);
    }
  }, [datasets]);

  // props.datasets 变化即重过滤（父级 refresh 后），并 mount 时拉取
  React.useEffect(() => { loadEcon(); }, [loadEcon]);

  // subscribe 监听外部写入 → 自身刷新 + 父级刷新
  React.useEffect(() => {
    if (typeof subscribe !== 'function') return undefined;
    let alive = true;
    let unsub = null;
    try {
      unsub = subscribe(() => { if (alive) { loadEcon(); reload(); } });
    } catch (_) { unsub = null; }
    return () => { alive = false; if (typeof unsub === 'function') { try { unsub(); } catch (_) {} } };
  }, [loadEcon, reload]);

  // —— 列表筛选/搜索/选中/多选 ——
  const [filterCat, setFilterCat] = React.useState('');   // '' = 全部
  const [kw, setKw] = React.useState('');
  const [selId, setSelId] = React.useState(null);
  const [checked, setChecked] = React.useState({});       // {id: true}

  const filtered = React.useMemo(() => {
    const k = kw.trim().toLowerCase();
    return econ.filter((d) => {
      if (!d) return false;
      if (filterCat && d.category !== filterCat) return false;
      if (k) {
        const hay = `${d.name || ''} ${d.source || ''} ${d.category || ''}`.toLowerCase();
        if (!hay.includes(k)) return false;
      }
      return true;
    });
  }, [econ, filterCat, kw]);

  const selected = React.useMemo(() => econ.find((d) => d && d.id === selId) || null, [econ, selId]);

  // 选中集被删 → 清空选中
  React.useEffect(() => {
    if (selId && loaded && !econ.some((d) => d && d.id === selId)) setSelId(null);
  }, [econ, selId, loaded]);

  // —— 统计条 ——
  const hub = React.useMemo(() => {
    let totalRows = 0; const byCat = {};
    for (const d of econ) {
      if (!d) continue;
      totalRows += Number(d.rowCount) || 0;
      const c = d.category || '未分类';
      byCat[c] = (byCat[c] || 0) + 1;
    }
    return { count: econ.length, totalRows, byCat };
  }, [econ]);

  // ========================================================================
  // 选中单序列：行数据 / 折线 / 统计 / 行编辑 / 追加点 / 元数据 / 导出 / 删除
  // ========================================================================
  const [rows, setRows] = React.useState([]);
  const [rowsErr, setRowsErr] = React.useState('');
  const [rowsLoading, setRowsLoading] = React.useState(false);

  const loadRows = React.useCallback(async (id) => {
    if (!id) { setRows([]); setRowsErr(''); return; }
    setRowsLoading(true);
    try {
      const r = typeof getRows === 'function' ? await getRows(id) : [];
      setRows(Array.isArray(r) ? r : []);
      setRowsErr('');
    } catch (_) {
      setRows([]); setRowsErr('行数据读取失败');
    } finally { setRowsLoading(false); }
  }, []);

  React.useEffect(() => { loadRows(selId); }, [selId, econ, loadRows]);

  const points = React.useMemo(() => safeRowsToPoints(rows), [rows]);
  const stats = React.useMemo(() => safeSeriesStats(points), [points]);

  const chartOption = React.useMemo(() => {
    if (!points.length) return null;
    const color = chartSeriesColor(0);
    return {
      grid: { left: 48, right: 18, top: 18, bottom: 28 },
      tooltip: { trigger: 'axis', ...CHART_TOOLTIP },
      xAxis: { ...categoryX(points.map((p) => p.period)), axisTick: { show: false } },
      yAxis: valueY({ scale: true, axisLine: { show: false } }),
      series: [{
        type: 'line', smooth: true, symbol: 'circle', symbolSize: 5,
        data: points.map((p) => p.value),
        lineStyle: { color, width: 2 },
        itemStyle: { color },
        areaStyle: { color: `${color}1a` },
      }],
    };
  }, [points]);

  // —— 行级编辑 ——
  const onEditRow = async (rowId, patch) => {
    if (!rowId || typeof updateRow !== 'function') return;
    try {
      await updateRow(rowId, patch);
      setRows((prev) => prev.map((r) => (r && r.rowId === rowId ? { ...r, ...patch } : r)));
    } catch (_) { setRowsErr('行更新失败'); }
  };
  const onDeleteRow = async (rowId) => {
    if (!rowId || typeof deleteRow !== 'function') return;
    try {
      await deleteRow(rowId);
      setRows((prev) => prev.filter((r) => r && r.rowId !== rowId));
      await loadEcon();
    } catch (_) { setRowsErr('行删除失败'); }
  };

  // —— 追加数据点（getRows 现有行 → putDataset 同 id 合并重写，最稳妥）——
  const [apPeriod, setApPeriod] = React.useState('');
  const [apValue, setApValue] = React.useState('');
  const onAppendPoint = async () => {
    if (!selected) return;
    const p = apPeriod.trim();
    const vRaw = apValue.trim();
    if (!p || vRaw === '') { notify('请填写 期 与 值 再追加'); return; }
    if (typeof putDataset !== 'function') { notify('落库模块未就绪'); return; }
    const num = Number(vRaw);
    const value = isFinite(num) && vRaw !== '' ? num : vRaw;
    try {
      const cur = typeof getRows === 'function' ? await getRows(selected.id) : rows;
      const clean = (Array.isArray(cur) ? cur : []).map(({ rowId, datasetId, ...r }) => r);
      const cols = (selected.columns && selected.columns.length) ? selected.columns : ['period', 'value'];
      await putDataset({
        id: selected.id,
        name: selected.name,
        category: selected.category,
        source: selected.source,
        origin: selected.origin || 'upload',
        note: selected.note,
        columns: cols,
        rows: [...clean, { period: p, value }],
        stampMs: Date.now(),
      });
      setApPeriod(''); setApValue('');
      notify('已追加数据点');
      await loadRows(selected.id);
      await loadEcon();
      await reload();
    } catch (_) { setRowsErr('追加数据点失败'); notify('追加失败'); }
  };

  // —— 元数据编辑（改 名称/分类/来源/备注 → putDataset 同 id 重写，原 columns+rows）——
  const [metaName, setMetaName] = React.useState('');
  const [metaCat, setMetaCat] = React.useState(CATS[0]);
  const [metaSource, setMetaSource] = React.useState('');
  const [metaNote, setMetaNote] = React.useState('');
  React.useEffect(() => {
    if (selected) {
      setMetaName(selected.name || '');
      setMetaCat(CATS.includes(selected.category) ? selected.category : CATS[0]);
      setMetaSource(selected.source || '');
      setMetaNote(selected.note || '');
    }
  }, [selected]);

  const onSaveMeta = async () => {
    if (!selected || typeof putDataset !== 'function') return;
    const nm = metaName.trim();
    if (!nm) { notify('名称不能为空'); return; }
    try {
      const cur = typeof getRows === 'function' ? await getRows(selected.id) : rows;
      const clean = (Array.isArray(cur) ? cur : []).map(({ rowId, datasetId, ...r }) => r);
      const cols = (selected.columns && selected.columns.length) ? selected.columns : ['period', 'value'];
      await putDataset({
        id: selected.id,
        name: nm,
        category: CATS.includes(metaCat) ? metaCat : selected.category,
        source: metaSource.trim(),
        origin: selected.origin || 'upload',
        note: metaNote.trim(),
        columns: cols,
        rows: clean,
        stampMs: Date.now(),
      });
      notify('元数据已保存');
      await loadEcon();
      await reload();
    } catch (_) { notify('元数据保存失败'); }
  };

  // —— 导出 CSV / JSON ——
  const exportName = (ext) => {
    const base = (selected && selected.name ? selected.name : 'econ-series').replace(/[\\/:*?"<>|]+/g, '_');
    return `${base}_${fmtTs(Date.now())}.${ext}`;
  };
  const onExportCSV = async () => {
    if (!selected) return;
    try {
      const cur = typeof getRows === 'function' ? await getRows(selected.id) : rows;
      const pts = safeRowsToPoints(cur);
      const head = 'period,value';
      const body = pts.map((p) => `${csvCell(p.period)},${csvCell(p.value)}`).join('\n');
      const ok = downloadBlob(`${head}\n${body}\n`, exportName('csv'), 'text/csv;charset=utf-8');
      notify(ok ? '已导出 CSV' : '导出失败');
    } catch (_) { notify('导出失败'); }
  };
  const onExportJSON = async () => {
    if (!selected) return;
    try {
      const cur = typeof getRows === 'function' ? await getRows(selected.id) : rows;
      const pts = safeRowsToPoints(cur);
      const obj = {
        indicator: selected.name || '',
        category: selected.category || '',
        source: selected.source || '',
        note: selected.note || '',
        points: pts,
      };
      const ok = downloadBlob(JSON.stringify(obj, null, 2), exportName('json'), 'application/json;charset=utf-8');
      notify(ok ? '已导出 JSON' : '导出失败');
    } catch (_) { notify('导出失败'); }
  };

  // —— 删除整个数据集 ——
  const onDeleteDataset = async () => {
    if (!selected || typeof deleteDataset !== 'function') return;
    let ok = true;
    try {
      ok = (typeof window !== 'undefined' && window.confirm)
        ? window.confirm(`确认删除数据集「${selected.name || selected.id}」？此操作不可撤销，将清除其全部行。`)
        : true;
    } catch (_) { ok = true; }
    if (!ok) return;
    try {
      await deleteDataset(selected.id);
      setSelId(null);
      notify('已删除数据集');
      await loadEcon();
      await reload();
    } catch (_) { notify('删除失败'); }
  };

  // ========================================================================
  // 上传：textarea + 格式/分类/频率/名称/单位/来源 → 解析预览 → 保存入库
  // ========================================================================
  const [raw, setRaw] = React.useState('');
  const [fmt, setFmt] = React.useState('auto');
  const [upCat, setUpCat] = React.useState(CATS[0]);
  const [upFreq, setUpFreq] = React.useState(FREQS[0]);
  const [upName, setUpName] = React.useState('');
  const [upUnit, setUpUnit] = React.useState('');
  const [upSource, setUpSource] = React.useState('');
  const [preview, setPreview] = React.useState(null);   // {points, warnings, parsed}
  const [parseErr, setParseErr] = React.useState('');
  const [saving, setSaving] = React.useState(false);

  const onParse = () => {
    setParseErr(''); setPreview(null);
    const text = (raw || '').trim();
    if (!text) { setParseErr('请先粘贴数据再解析。'); return; }
    if (typeof parseEconSeries !== 'function') { setParseErr('解析模块尚未就绪。'); return; }
    try {
      const parsed = parseEconSeries(text, fmt);
      const pts = parsed && Array.isArray(parsed.points) ? parsed.points : safeRowsToPoints(parsed && parsed.rows);
      const warnings = parsed && Array.isArray(parsed.warnings) ? parsed.warnings : [];
      if (parsed && parsed.ok === false) {
        setParseErr(`解析失败：${parsed.error || '格式无法识别'}`);
        setPreview({ points: pts, warnings, parsed });
        return;
      }
      if (!pts.length) {
        setParseErr('解析得到 0 个有效数据点，请检查格式或换一种解析模式。');
        setPreview({ points: [], warnings, parsed });
        return;
      }
      setPreview({ points: pts, warnings, parsed });
    } catch (e) {
      setParseErr(`解析失败：${(e && e.message) || '格式无法识别'}`);
    }
  };

  const onSave = async () => {
    if (!preview || !preview.points || !preview.points.length) { notify('请先解析出有效数据点再保存'); return; }
    if (typeof seriesToDataset !== 'function' || typeof putDataset !== 'function') { notify('落库模块尚未就绪'); return; }
    setSaving(true);
    try {
      const noteBits = [`频率 ${upFreq}`];
      if (upUnit.trim()) noteBits.push(`单位 ${upUnit.trim()}`);
      noteBits.push('用户上传 · 使用前核对来源口径');
      const ds = seriesToDataset(preview.parsed, {
        category: upCat,
        name: upName.trim() || undefined,
        source: upSource.trim() || undefined,
        note: noteBits.join(' · '),
      });
      const payload = ds && typeof ds === 'object' ? ds : {};
      await putDataset({
        name: payload.name || upName.trim() || `未命名经济序列 · ${upCat}`,
        category: payload.category || upCat,
        source: payload.source != null ? payload.source : (upSource.trim() || '用户上传'),
        origin: payload.origin || 'upload',
        note: payload.note || noteBits.join(' · '),
        columns: payload.columns || ['period', 'value'],
        rows: Array.isArray(payload.rows) ? payload.rows : [],
        stampMs: Date.now(),
      });
      notify('已保存入库，列表已刷新');
      setPreview(null); setRaw('');
      await loadEcon();
      await reload();
    } catch (e) {
      notify(`保存失败：${(e && e.message) || 'IndexedDB 写入异常'}`);
    } finally { setSaving(false); }
  };

  const onFillSample = () => {
    setRaw(SAMPLE);
    setFmt('free');
    setUpCat(CATS.includes('经济运行') ? '经济运行' : CATS[0]);
    setUpFreq(FREQS.includes('年') ? '年' : FREQS[0]);
    if (!upName) setUpName('GDP 实际增速（示例）');
    if (!upUnit) setUpUnit('%');
    if (!upSource) setUpSource('用户上传 · 示例');
    setPreview(null); setParseErr('');
  };

  // ========================================================================
  // 多序列叠加对比（勾选 ≥2）
  // ========================================================================
  const checkedIds = React.useMemo(() => Object.keys(checked).filter((id) => checked[id] && econ.some((d) => d && d.id === id)), [checked, econ]);
  const [cmpSeries, setCmpSeries] = React.useState([]);   // [{id,name,points}]
  const [cmpErr, setCmpErr] = React.useState('');
  const [normalize, setNormalize] = React.useState(false);

  React.useEffect(() => {
    let alive = true;
    if (checkedIds.length < 2) { setCmpSeries([]); setCmpErr(''); return undefined; }
    (async () => {
      try {
        const out = [];
        for (const id of checkedIds) {
          const meta = econ.find((d) => d && d.id === id);
          const r = typeof getRows === 'function' ? await getRows(id) : [];
          out.push({ id, name: (meta && meta.name) || id, points: safeRowsToPoints(r) });
        }
        if (alive) { setCmpSeries(out); setCmpErr(''); }
      } catch (_) {
        if (alive) { setCmpSeries([]); setCmpErr('对比序列读取失败'); }
      }
    })();
    return () => { alive = false; };
  }, [checkedIds.join('|'), econ]); // eslint-disable-line react-hooks/exhaustive-deps

  const cmpOption = React.useMemo(() => {
    const valid = cmpSeries.filter((s) => s.points.length);
    if (valid.length < 2) return null;
    // x 轴 = period 并集（排序）
    const set = new Set();
    valid.forEach((s) => s.points.forEach((p) => set.add(p.period)));
    const cmp = (a, b) => {
      const na = a.replace(/Q([1-4])/, '-Q$1'), nb = b.replace(/Q([1-4])/, '-Q$1');
      return na < nb ? -1 : na > nb ? 1 : 0;
    };
    const xs = Array.from(set).sort(cmp);
    const series = valid.map((s, i) => {
      const m = new Map(s.points.map((p) => [p.period, p.value]));
      let data = xs.map((x) => (m.has(x) ? m.get(x) : null));
      if (normalize) {
        const first = data.find((v) => v != null && v !== 0);
        if (first != null) data = data.map((v) => (v == null ? null : Math.round((v / first) * 1000) / 10));
      }
      const color = chartSeriesColor(i);
      return {
        name: s.name, type: 'line', smooth: true, symbol: 'circle', symbolSize: 4,
        connectNulls: true, data,
        lineStyle: { color, width: 2 }, itemStyle: { color },
      };
    });
    return {
      grid: { left: 48, right: 18, top: 36, bottom: 28 },
      tooltip: { trigger: 'axis', ...CHART_TOOLTIP },
      legend: { top: 0, ...LEGEND, type: 'scroll' },
      xAxis: { ...categoryX(xs), axisTick: { show: false } },
      yAxis: valueY({
        scale: true,
        axisLine: { show: false },
        axisLabel: { formatter: normalize ? '{value}' : undefined },
      }),
      series,
    };
  }, [cmpSeries, normalize]);

  const cmpNote = React.useMemo(() => {
    const valid = cmpSeries.filter((s) => s.points.length);
    if (valid.length < 2) return '';
    const names = valid.map((s) => s.name).join(' / ');
    return normalize
      ? `叠加对比（已归一至各自首点=100）：${names} —— 同基准看相对走势，消除量纲差异。`
      : `叠加对比（原值）：${names} —— x 轴为各序列 period 并集，缺失点自动连接。`;
  }, [cmpSeries, normalize]);

  // —— 复选切换 ——
  const toggleCheck = (id) => setChecked((prev) => ({ ...prev, [id]: !prev[id] }));

  // ========================================================================
  // 渲染
  // ========================================================================
  const labelStyle = { fontSize: 10, color: 'var(--text-tertiary)', marginBottom: 2, display: 'block' };
  const canSave = !!(preview && preview.points && preview.points.length);

  return (
    <div className="flex flex-col gap-4">
      {/* —— 统计条 —— */}
      <div className="os-card" style={{ padding: 'var(--card-padding)' }}>
        <div className="flex flex-wrap items-center gap-1.5">
          <Chip label="经济数据集" value={hub.count} color="#22d3ee" onClick={() => setFilterCat('')} active={filterCat === ''} />
          <Chip label="总行数" value={fmtNum(hub.totalRows)} color="var(--text-primary)" />
          <span style={{ color: 'var(--border-subtle)' }}>|</span>
          {CATS.filter((c) => hub.byCat[c]).map((c) => (
            <Chip key={c} label={c} value={hub.byCat[c]} color="#e8a317" onClick={() => setFilterCat(filterCat === c ? '' : c)} active={filterCat === c} />
          ))}
          {listErr && <span className="mono" style={{ fontSize: 10, color: '#c41e3a' }}>// {listErr}</span>}
        </div>
      </div>

      {/* —— 上传卡 —— */}
      <div className="os-card" style={{ padding: 'var(--card-padding)' }}>
        <div className="mono mb-2" style={{ fontSize: 11, color: 'var(--text-tertiary)' }}>经济序列上传 · 解析 → 预览 → 入库</div>

        <div className="flex flex-wrap items-center gap-2 mb-2">
          <div className="inline-flex items-center gap-0.5 p-0.5 rounded" style={{ background: 'var(--bg-base)', border: '1px solid var(--border-subtle)' }}>
            {FMT_TABS.map((t) => (
              <button key={t.id} type="button" onClick={() => setFmt(t.id)} className="mono"
                style={{ ...BTN(fmt === t.id), padding: '4px 10px', fontSize: 11 }}>{t.label}</button>
            ))}
          </div>
          <button type="button" onClick={onFillSample} className="mono" style={{ ...BTN(false), fontSize: 11, padding: '6px 10px' }}>填充示例</button>
        </div>

        <textarea
          value={raw}
          onChange={(e) => setRaw(e.target.value)}
          placeholder={'粘贴经济序列数据…\nCSV：period,value（首行表头可选）\nJSON：[{"period":"2024","value":5.0}]\n自由粘贴：每行「期 值」，空白/逗号分隔'}
          rows={6}
          className="mono"
          style={{ ...INP, fontSize: 12, resize: 'vertical', minHeight: 110 }}
        />
        {PERIOD_HINT && <p className="mono mt-1" style={{ fontSize: 10, color: 'var(--text-tertiary)', lineHeight: 1.5 }}>{PERIOD_HINT}</p>}

        <div className="grid grid-cols-2 lg:grid-cols-5 gap-2 mt-2">
          <label><span style={labelStyle}>分类</span>
            <select value={upCat} onChange={(e) => setUpCat(e.target.value)} style={INP}>{CATS.map((c) => <option key={c} value={c}>{c}</option>)}</select>
          </label>
          <label><span style={labelStyle}>频率</span>
            <select value={upFreq} onChange={(e) => setUpFreq(e.target.value)} style={INP}>{FREQS.map((f) => <option key={f} value={f}>{f}</option>)}</select>
          </label>
          <label><span style={labelStyle}>指标名</span>
            <input type="text" value={upName} onChange={(e) => setUpName(e.target.value)} placeholder="序列名称" style={INP} />
          </label>
          <label><span style={labelStyle}>单位</span>
            <input type="text" value={upUnit} onChange={(e) => setUpUnit(e.target.value)} placeholder="如 % / 亿元" style={INP} />
          </label>
          <label><span style={labelStyle}>来源</span>
            <input type="text" value={upSource} onChange={(e) => setUpSource(e.target.value)} placeholder="如 国家统计局 / 自录" style={INP} />
          </label>
        </div>

        <div className="flex flex-wrap items-center gap-2 mt-3">
          <button type="button" onClick={onParse} className="mono" style={{ ...BTN(false), fontSize: 12, padding: '6px 14px', color: '#22d3ee' }}>解析预览</button>
          <button type="button" onClick={onSave} disabled={saving || !canSave} className="mono"
            style={{ ...BTN(canSave), fontSize: 12, padding: '6px 14px', cursor: saving || !canSave ? 'not-allowed' : 'pointer', opacity: saving ? 0.7 : 1, color: canSave ? '#e8a317' : 'var(--text-tertiary)' }}>
            {saving ? '保存中…' : '保存入库'}
          </button>
          {parseErr && <span className="mono" style={{ fontSize: 11, color: '#c41e3a' }}>// {parseErr}</span>}
        </div>

        {preview && (
          <div className="mt-3 rounded p-3" style={{ background: 'var(--bg-base)', border: '1px solid var(--border-subtle)' }}>
            <div className="mono mb-1.5" style={{ fontSize: 11, color: 'var(--text-secondary)' }}>
              解析结果 · <span style={{ color: '#22d3ee' }}>{preview.points.length}</span> 个有效数据点
            </div>
            {preview.points.length > 0 && (
              <div className="flex flex-wrap items-center gap-1.5 mb-2">
                {preview.points.slice(0, 6).map((p, i) => (
                  <span key={i} className="mono" style={{ fontSize: 10, padding: '2px 6px', borderRadius: 4, background: 'var(--bg-elevated)', border: '1px solid var(--border-subtle)', color: 'var(--text-tertiary)' }}>
                    <span style={{ color: 'var(--text-secondary)' }}>{p.period}</span> {fmtNum(p.value)}
                  </span>
                ))}
                {preview.points.length > 6 && <span className="mono" style={{ fontSize: 10, color: 'var(--text-tertiary)' }}>…共 {preview.points.length}</span>}
              </div>
            )}
            {Array.isArray(preview.warnings) && preview.warnings.length > 0 && (
              <ul className="flex flex-col gap-0.5">
                {preview.warnings.slice(0, 12).map((w, i) => (
                  <li key={i} className="mono" style={{ fontSize: 10, color: '#e8a317' }}>⚠ {typeof w === 'string' ? w : (w && w.message) || String(w)}</li>
                ))}
                {preview.warnings.length > 12 && <li className="mono" style={{ fontSize: 10, color: 'var(--text-tertiary)' }}>…共 {preview.warnings.length} 条告警</li>}
              </ul>
            )}
          </div>
        )}
      </div>

      {/* —— 左右两栏：列表 / 详情 —— */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* 左栏：列表 */}
        <div className="os-card" style={{ padding: 'var(--card-padding)' }}>
          <div className="flex items-center justify-between gap-2 mb-2">
            <div className="mono" style={{ fontSize: 11, color: 'var(--text-tertiary)' }}>
              经济数据集（{filtered.length}/{hub.count}）{filterCat && ` · ${filterCat}`}
            </div>
            {checkedIds.length > 0 && (
              <button type="button" onClick={() => setChecked({})} className="mono" style={{ ...BTN(false), fontSize: 10, padding: '3px 8px' }}>清空勾选({checkedIds.length})</button>
            )}
          </div>

          <input type="text" value={kw} onChange={(e) => setKw(e.target.value)} placeholder="搜索 名称 / 来源 / 分类…"
            style={{ ...INP, fontSize: 12, marginBottom: 8 }} />

          {!loaded ? (
            <p className="mono" style={{ fontSize: 12, color: 'var(--text-tertiary)' }}>// 读取本地库…</p>
          ) : filtered.length === 0 ? (
            <div className="rounded p-4 text-center" style={{ border: '1px dashed var(--border-subtle)' }}>
              <div className="mono mb-1" style={{ fontSize: 13, color: '#e8a317' }}>// 空</div>
              <p style={{ fontSize: 12, color: 'var(--text-tertiary)' }}>{econ.length === 0 ? '暂无经济类数据集 —— 用上方上传载入。' : '无匹配项 —— 调整筛选 / 搜索。'}</p>
            </div>
          ) : (
            <ul className="flex flex-col gap-1.5" style={{ maxHeight: 460, overflow: 'auto', paddingRight: 4 }}>
              {filtered.map((d) => {
                if (!d) return null;
                const on = d.id === selId;
                const isUpload = d.origin === 'upload';
                const originLabel = isUpload ? '上传' : d.origin === 'seed' ? '种子' : (d.origin || '存量');
                return (
                  <li key={d.id} className="flex items-start gap-2">
                    <input type="checkbox" checked={!!checked[d.id]} onChange={() => toggleCheck(d.id)} title="加入叠加对比"
                      style={{ marginTop: 8, accentColor: '#c41e3a', cursor: 'pointer' }} />
                    <button type="button" onClick={() => setSelId(d.id)} className="text-left rounded transition-colors"
                      style={{ flex: 1, minWidth: 0, padding: 10, background: on ? 'rgba(34,211,238,0.08)' : 'var(--bg-base)', border: `1px solid ${on ? '#22d3ee' : 'var(--border-subtle)'}`, cursor: 'pointer' }}>
                      <div className="flex items-start justify-between gap-2">
                        <span style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-primary)', lineHeight: 1.3 }}>{d.name || '未命名'}</span>
                        <span className="mono shrink-0" style={{ fontSize: 10, padding: '1px 6px', borderRadius: 4, background: 'rgba(232,163,23,0.12)', color: '#e8a317' }}>{d.category || '未分类'}</span>
                      </div>
                      <div className="mono mt-1 flex items-center gap-1.5 flex-wrap" style={{ fontSize: 10, color: 'var(--text-tertiary)' }}>
                        <span>{fmtNum(d.rowCount)} 行</span>
                        <span style={{ color: 'var(--border-subtle)' }}>·</span>
                        <span style={{ color: isUpload ? '#10b981' : '#8b5cf6' }}>{originLabel}</span>
                        {d.source && (<><span style={{ color: 'var(--border-subtle)' }}>·</span><span>{d.source}</span></>)}
                        <span style={{ color: 'var(--border-subtle)' }}>·</span>
                        <span>{fmtTs(d.updatedAt)}</span>
                      </div>
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        {/* 右栏：选中详情 */}
        <div className="os-card" style={{ padding: 'var(--card-padding)' }}>
          {!selected ? (
            <div className="h-full flex items-center justify-center" style={{ minHeight: 200 }}>
              <p className="text-center" style={{ fontSize: 12, color: 'var(--text-tertiary)' }}>
                {econ.length === 0 ? '暂无数据集，先上传载入。' : '从左侧选择一个经济数据集查看序列、统计、行编辑与元数据。'}
              </p>
            </div>
          ) : (
            <div>
              <div className="flex items-start justify-between gap-2 mb-2">
                <div className="min-w-0">
                  <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)', lineHeight: 1.2 }}>{selected.name || '未命名'}</div>
                  <div className="mono mt-0.5" style={{ fontSize: 10, color: 'var(--text-tertiary)' }}>
                    {selected.category || '未分类'} · {selected.source || '—'} · {selected.origin === 'upload' ? '上传' : selected.origin === 'seed' ? '种子' : (selected.origin || '存量')} · {fmtNum(selected.rowCount)} 行
                  </div>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <button type="button" onClick={onExportCSV} className="mono" style={{ ...BTN(false), fontSize: 10, padding: '4px 8px' }}>CSV</button>
                  <button type="button" onClick={onExportJSON} className="mono" style={{ ...BTN(false), fontSize: 10, padding: '4px 8px' }}>JSON</button>
                  <button type="button" onClick={onDeleteDataset} className="mono" style={{ ...BTN(false), fontSize: 10, padding: '4px 8px', color: '#c41e3a', background: 'rgba(196,30,58,0.1)', border: '1px solid rgba(196,30,58,0.27)' }}>删除</button>
                </div>
              </div>

              {rowsErr && <p className="mono mb-2" style={{ fontSize: 10, color: '#c41e3a' }}>// {rowsErr}</p>}

              {/* 折线图 */}
              {rowsLoading ? (
                <p className="mono" style={{ fontSize: 12, color: 'var(--text-tertiary)' }}>// 加载序列…</p>
              ) : chartOption ? (
                <div className="rounded overflow-hidden mb-3"><EChart option={chartOption} style={{ height: 220 }} /></div>
              ) : (
                <p className="mono mb-3" style={{ fontSize: 12, color: 'var(--text-tertiary)' }}>// 该数据集无可绘制的 period/value 序列。</p>
              )}

              {/* 统计 chips */}
              {points.length > 0 && (
                <div className="flex flex-wrap items-center gap-1.5 mb-3">
                  <Pill label={stats.latest && stats.latest.period ? `最新 · ${stats.latest.period}` : '最新'} value={fmtNum(stats.latest && stats.latest.value)} />
                  <Pill label="同比/环比" value={stats.yoy == null ? '—' : `${stats.yoy > 0 ? '+' : ''}${stats.yoy}%`}
                    color={stats.yoy == null ? 'var(--text-tertiary)' : stats.yoy > 0 ? '#10b981' : stats.yoy < 0 ? '#c41e3a' : 'var(--text-tertiary)'} />
                  <Pill label="最小" value={fmtNum(stats.min)} color="#8b5cf6" />
                  <Pill label="最大" value={fmtNum(stats.max)} color="#e8a317" />
                  <span className="inline-flex items-center gap-1.5" style={{ padding: '4px 8px', borderRadius: 6, background: 'var(--bg-base)', border: '1px solid var(--border-subtle)' }}>
                    <span style={{ width: 8, height: 8, borderRadius: '50%', background: trendSignal(stats.trend), display: 'inline-block' }} />
                    <span className="mono" style={{ fontSize: 11, color: 'var(--text-secondary)' }}>{trendLabel(stats.trend)}</span>
                  </span>
                </div>
              )}

              {/* 追加数据点 */}
              <div className="flex flex-wrap items-end gap-1.5 mb-3">
                <label style={{ flex: 1, minWidth: 90 }}><span style={labelStyle}>追加 · 期</span>
                  <input type="text" value={apPeriod} onChange={(e) => setApPeriod(e.target.value)} placeholder="如 2026 / 2026-01" style={{ ...INP, fontSize: 12 }} />
                </label>
                <label style={{ width: 110 }}><span style={labelStyle}>值</span>
                  <input type="text" value={apValue} onChange={(e) => setApValue(e.target.value)} placeholder="数值" className="mono" style={{ ...INP, fontSize: 12 }} />
                </label>
                <button type="button" onClick={onAppendPoint} className="mono" style={{ ...BTN(false), fontSize: 11, padding: '7px 12px', color: '#10b981' }}>追加数据点</button>
              </div>

              {/* 行级编辑表 */}
              {rows.length > 0 && (
                <div className="mb-3">
                  <div className="mono mb-1.5" style={{ fontSize: 10, color: 'var(--text-tertiary)' }}>行编辑 · {rows.length} 行（改写 onBlur 即落库）</div>
                  <div className="flex flex-col gap-1" style={{ maxHeight: 240, overflow: 'auto', paddingRight: 4 }}>
                    {rows.map((r) => {
                      if (!r) return null;
                      const period = rowPeriod(r);
                      const value = rowValue(r);
                      return (
                        <div key={r.rowId} className="flex items-center gap-1.5">
                          <input type="text" defaultValue={period} aria-label="期"
                            onBlur={(e) => { const v = e.target.value; if (v !== String(period)) onEditRow(r.rowId, { period: v }); }}
                            style={{ ...INP, flex: 1, minWidth: 0, padding: '4px 8px', fontSize: 12 }} />
                          <input type="text" defaultValue={value} aria-label="值" className="mono"
                            onBlur={(e) => { const v = e.target.value; if (v !== String(value)) { const n = Number(v); onEditRow(r.rowId, { value: isFinite(n) && v.trim() !== '' ? n : v }); } }}
                            style={{ ...INP, width: 100, padding: '4px 8px', fontSize: 12 }} />
                          <button type="button" onClick={() => onDeleteRow(r.rowId)} aria-label="删除此行" className="mono"
                            style={{ ...BTN(false), fontSize: 10, padding: '4px 8px', color: '#c41e3a', background: 'transparent', border: '1px solid rgba(196,30,58,0.2)' }}>删</button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* 元数据编辑 */}
              <div className="rounded p-3" style={{ background: 'var(--bg-base)', border: '1px solid var(--border-subtle)' }}>
                <div className="mono mb-2" style={{ fontSize: 10, color: 'var(--text-tertiary)' }}>元数据编辑</div>
                <div className="grid grid-cols-2 gap-2 mb-2">
                  <label><span style={labelStyle}>名称</span><input type="text" value={metaName} onChange={(e) => setMetaName(e.target.value)} style={{ ...INP, fontSize: 12 }} /></label>
                  <label><span style={labelStyle}>分类</span><select value={metaCat} onChange={(e) => setMetaCat(e.target.value)} style={{ ...INP, fontSize: 12 }}>{CATS.map((c) => <option key={c} value={c}>{c}</option>)}</select></label>
                  <label><span style={labelStyle}>来源</span><input type="text" value={metaSource} onChange={(e) => setMetaSource(e.target.value)} style={{ ...INP, fontSize: 12 }} /></label>
                  <label><span style={labelStyle}>备注</span><input type="text" value={metaNote} onChange={(e) => setMetaNote(e.target.value)} style={{ ...INP, fontSize: 12 }} /></label>
                </div>
                <button type="button" onClick={onSaveMeta} className="mono" style={{ ...BTN(false), fontSize: 11, padding: '6px 12px', color: '#22d3ee' }}>保存元数据</button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* —— 多序列叠加对比 —— */}
      {checkedIds.length >= 2 && (
        <div className="os-card" style={{ padding: 'var(--card-padding)' }}>
          <div className="flex items-center justify-between gap-2 mb-2">
            <div className="mono" style={{ fontSize: 11, color: 'var(--text-tertiary)' }}>多序列叠加对比 · 勾选 {checkedIds.length} 项</div>
            <label className="inline-flex items-center gap-1.5 mono" style={{ fontSize: 11, color: 'var(--text-secondary)', cursor: 'pointer' }}>
              <input type="checkbox" checked={normalize} onChange={(e) => setNormalize(e.target.checked)} style={{ accentColor: '#c41e3a', cursor: 'pointer' }} />
              归一（首点=100）
            </label>
          </div>
          {cmpErr ? (
            <p className="mono" style={{ fontSize: 11, color: '#c41e3a' }}>// {cmpErr}</p>
          ) : cmpOption ? (
            <>
              <div className="rounded overflow-hidden"><EChart option={cmpOption} style={{ height: 300 }} /></div>
              {cmpNote && <p className="mt-2" style={{ fontSize: 11, color: 'var(--text-secondary)', lineHeight: 1.5 }}>{cmpNote}</p>}
            </>
          ) : (
            <p className="mono" style={{ fontSize: 11, color: 'var(--text-tertiary)' }}>// 勾选的序列需至少 2 个含有效 period/value 点方可叠加。</p>
          )}
        </div>
      )}

      {/* —— 卡尾口径小字 —— */}
      <p className="mono" style={{ fontSize: 10, color: 'var(--text-tertiary)', lineHeight: 1.6 }}>
        用户上传/编辑数据请核对来源与口径 · 本地 IndexedDB 持久化 · 示意非官方
      </p>
    </div>
  );
}
