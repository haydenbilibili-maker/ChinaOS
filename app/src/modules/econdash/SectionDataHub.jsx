import React from 'react';
import {
  ECON_CATEGORIES,
  ECON_FREQ,
  parseEconSeries,
  seriesToDataset,
  rowsToPoints,
  seriesStats,
  listEconDatasets,
} from './econSeries.js';
import {
  listDatasets,
  getRows,
  putDataset,
  updateRow,
  deleteRow,
  deleteDataset,
  subscribe,
} from '../../lib/db/localdb.js';
import { ECON_COLORS, BandHead, SignalDot } from './econUI.jsx';
import { Link } from 'react-router-dom';
import EChart from '../../lib/viz/EChart.jsx';

// ============================================================================
// 经济数据底座 · 本地序列管理（SectionDataHub）
// ----------------------------------------------------------------------------
// econdash 内联管理本地库（IndexedDB）里的经济类数据集，并提供经济序列专用
// 上传 / 解析 / 预览 / 落库通道。完整多域后台仍在 /foundation。
//   · BandHead「经济数据底座 · 本地序列管理」
//   · 统计条：经济数据集数 / 总行数 / 分类分布 chips + Link → /foundation
//   · 左栏：经济数据集列表（点击选中）；空态友好提示
//   · 右栏（选中态）：折线图 + seriesStats chips + 前 N 行编辑 / 删行 / 删集
//   · 上传卡（常驻）：textarea + 格式 / 分类 / 频率 / 名称 / 来源 +
//     解析预览（points 数 / 前几点 / warnings）+ 保存到本地库 + 填充示例
// 全程 try/catch 容错：IndexedDB 不可用、解析失败、空数据均有提示，不白屏。
// econSeries 由并行代理产出；本组件对其全部函数做存在性守卫，缺失时退化兜底，
// 保证 bundle 与运行均不崩。
// 口径：公开统计梳理 · 示意标定 · 非投资建议 · 非预测。
// ============================================================================

const DISCLAIMER = '公开统计梳理 · 示意标定 · 非投资建议 · 非预测';

// —— 四色语义缺省回退（econUI 缺失时仍可渲染）——
const C = ECON_COLORS || {};
const TEAL = C.teal || '#62a89e'; // 青：扩张 / 名义 / 好转
const CINNABAR = C.cinnabar || '#c44e3d'; // 朱砂：收缩 / 警示
const OCHRE = C.ochre || '#c99a4e'; // 赭：区域 / 财政
const INDIGO = C.indigo || '#8090c6'; // 黛：宏观叙事

// —— 轴色规范（与既有 Section 统一）——
const AX = { line: '#27324a', text: '#93a1b5', split: 'rgba(148,163,184,0.1)' };

// —— 解析格式档位 ——
const FMT_TABS = [
  { id: 'auto', label: '自动' },
  { id: 'csv', label: 'CSV' },
  { id: 'json', label: 'JSON' },
  { id: 'free', label: '自由粘贴' },
];

// —— 分类 / 频率档位（econSeries 契约常量缺失时本地兜底）——
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

// —— 前 N 行可编辑上限 ——
const EDIT_N = 12;

// 取每个数据集的 [{name,category,source,origin,note,columns,rowCount,updatedAt,id}]。
const isEconDataset = (d) => !!d && CATS.includes(d.category);

// 时间戳 → 简短可读（容错：无效返回 —）
function fmtTs(ms) {
  const n = Number(ms);
  if (!n || !isFinite(n)) return '—';
  try {
    const d = new Date(n);
    if (isNaN(d.getTime())) return '—';
    const p = (x) => String(x).padStart(2, '0');
    return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`;
  } catch (_) {
    return '—';
  }
}

// 数字友好显示（容错）
function fmtNum(v) {
  if (v == null || v === '') return '—';
  const n = Number(v);
  if (!isFinite(n)) return String(v);
  return Math.abs(n) >= 1000 ? n.toLocaleString('en-US') : String(n);
}

// —— 容错包装：rowsToPoints（缺失时本地兜底取 period/value）——
function safeRowsToPoints(rows) {
  const arr = Array.isArray(rows) ? rows : [];
  if (typeof rowsToPoints === 'function') {
    try {
      const r = rowsToPoints(arr);
      if (Array.isArray(r)) return r;
    } catch (_) { /* 落兜底 */ }
  }
  return arr
    .map((r) => {
      if (!r || typeof r !== 'object') return null;
      const period = r.period ?? r.date ?? r.time ?? r.x ?? '';
      const raw = r.value ?? r.val ?? r.y ?? r.amount;
      const value = Number(raw);
      if (period === '' || !isFinite(value)) return null;
      return { period: String(period), value };
    })
    .filter(Boolean);
}

// —— 容错包装：seriesStats（缺失时本地兜底）——
function safeSeriesStats(points) {
  const pts = Array.isArray(points) ? points : [];
  if (typeof seriesStats === 'function') {
    try {
      const s = seriesStats(pts);
      if (s && typeof s === 'object') return s;
    } catch (_) { /* 落兜底 */ }
  }
  // 兜底返回与契约同形：latest 为 {period,value} 对象
  const clean = pts
    .filter((p) => p && p.period != null && isFinite(Number(p.value)))
    .map((p) => ({ period: String(p.period), value: Number(p.value) }));
  if (!clean.length) return { n: 0, latest: null, min: null, max: null, yoy: null, trend: 'flat' };
  const vals = clean.map((p) => p.value);
  const last = clean[clean.length - 1];
  const prev = clean.length > 1 ? clean[clean.length - 2] : null;
  const yoy = prev && prev.value !== 0 ? Math.round((last.value - prev.value) / Math.abs(prev.value) * 1000) / 10 : null;
  const trend = !prev ? 'flat' : last.value > prev.value ? 'up' : last.value < prev.value ? 'down' : 'flat';
  return { n: clean.length, latest: { period: last.period, value: last.value }, min: Math.min(...vals), max: Math.max(...vals), yoy, trend };
}

// —— 容错包装：listEconDatasets（缺失时用 listDatasets 过滤经济类）——
async function safeListEconDatasets() {
  if (typeof listEconDatasets === 'function') {
    try {
      const r = await listEconDatasets();
      if (Array.isArray(r)) return r;
    } catch (_) { /* 落兜底 */ }
  }
  if (typeof listDatasets === 'function') {
    try {
      const all = await listDatasets();
      return (Array.isArray(all) ? all : []).filter(isEconDataset);
    } catch (_) { /* 落空 */ }
  }
  return [];
}

// ---------------------------------------------------------------------------
// hook：组件内挂载读取 + 订阅写入刷新（alive 守卫）
// ---------------------------------------------------------------------------
function useEconDatasets() {
  const [datasets, setDatasets] = React.useState([]);
  const [loaded, setLoaded] = React.useState(false);
  const [err, setErr] = React.useState('');

  React.useEffect(() => {
    let alive = true;
    const load = async () => {
      try {
        const list = await safeListEconDatasets();
        if (!alive) return;
        setDatasets(Array.isArray(list) ? list : []);
        setErr('');
      } catch (e) {
        if (!alive) return;
        setDatasets([]);
        setErr('本地库读取失败（IndexedDB 可能不可用）');
      } finally {
        if (alive) setLoaded(true);
      }
    };
    load();

    let unsub = null;
    if (typeof subscribe === 'function') {
      try {
        unsub = subscribe(() => { if (alive) load(); });
      } catch (_) { unsub = null; }
    }
    return () => {
      alive = false;
      if (typeof unsub === 'function') { try { unsub(); } catch (_) {} }
    };
  }, []);

  return { datasets, loaded, err };
}

// —— 统计 chip ——
function StatChip({ label, value, color }) {
  return (
    <span
      className="inline-flex items-baseline gap-1 mono text-[10px] px-2 py-1 rounded"
      style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-subtle)' }}
    >
      <span style={{ color: color || 'var(--text-primary)', fontWeight: 600 }}>{value}</span>
      <span style={{ color: 'var(--text-tertiary)' }}>{label}</span>
    </span>
  );
}

// —— 序列读数 chip（latest/min/max/yoy/trend）——
function StatPill({ label, value, color }) {
  return (
    <span
      className="inline-flex flex-col gap-0.5 px-2 py-1 rounded"
      style={{ background: 'var(--bg-base)', border: '1px solid var(--border-subtle)', minWidth: 64 }}
    >
      <span className="mono text-[9px]" style={{ color: 'var(--text-tertiary)' }}>{label}</span>
      <span className="mono text-[12px] font-semibold" style={{ color: color || 'var(--text-primary)' }}>{value}</span>
    </span>
  );
}

// —— 趋势 → 信号语义 ——
function trendSignal(trend) {
  if (trend === 'up') return 'teal';
  if (trend === 'down') return 'cinnabar';
  return 'amber';
}
function trendLabel(trend) {
  if (trend === 'up') return '上行 ↑';
  if (trend === 'down') return '下行 ↓';
  if (trend === 'flat') return '走平 →';
  return '—';
}

// ---------------------------------------------------------------------------
// 主组件
// ---------------------------------------------------------------------------
export default function SectionDataHub() {
  const { datasets, loaded, err } = useEconDatasets();

  // 选中数据集
  const [selId, setSelId] = React.useState(null);
  const [rows, setRows] = React.useState([]);
  const [rowsErr, setRowsErr] = React.useState('');
  const [rowsLoading, setRowsLoading] = React.useState(false);

  // 上传表单
  const [raw, setRaw] = React.useState('');
  const [fmt, setFmt] = React.useState('auto');
  const [cat, setCat] = React.useState(CATS[0]);
  const [freq, setFreq] = React.useState(FREQS[0]);
  const [name, setName] = React.useState('');
  const [source, setSource] = React.useState('');
  const [preview, setPreview] = React.useState(null); // { points, warnings, parsed }
  const [parseErr, setParseErr] = React.useState('');
  const [saveMsg, setSaveMsg] = React.useState('');
  const [saving, setSaving] = React.useState(false);

  const selected = React.useMemo(
    () => datasets.find((d) => d && d.id === selId) || null,
    [datasets, selId],
  );

  // 选中态行数据加载（getRows）
  React.useEffect(() => {
    if (!selId) { setRows([]); setRowsErr(''); return; }
    let alive = true;
    setRowsLoading(true);
    (async () => {
      try {
        const r = typeof getRows === 'function' ? await getRows(selId) : [];
        if (!alive) return;
        setRows(Array.isArray(r) ? r : []);
        setRowsErr('');
      } catch (e) {
        if (!alive) return;
        setRows([]);
        setRowsErr('行数据读取失败');
      } finally {
        if (alive) setRowsLoading(false);
      }
    })();
    return () => { alive = false; };
  }, [selId, datasets]); // datasets 变化（写入触发）后重读选中集行

  // 选中集若被删则清空选中
  React.useEffect(() => {
    if (selId && loaded && !datasets.some((d) => d && d.id === selId)) {
      setSelId(null);
    }
  }, [datasets, selId, loaded]);

  // —— 派生：折线点 + 统计 ——
  const points = React.useMemo(() => safeRowsToPoints(rows), [rows]);
  const stats = React.useMemo(() => safeSeriesStats(points), [points]);

  const chartOption = React.useMemo(() => {
    if (!points.length) return null;
    return {
      grid: { left: 48, right: 18, top: 18, bottom: 28 },
      tooltip: { trigger: 'axis' },
      xAxis: {
        type: 'category',
        data: points.map((p) => p.period),
        axisLine: { lineStyle: { color: AX.line } },
        axisLabel: { color: AX.text, fontSize: 10 },
        axisTick: { show: false },
      },
      yAxis: {
        type: 'value',
        scale: true,
        axisLine: { show: false },
        axisLabel: { color: AX.text, fontSize: 10 },
        splitLine: { lineStyle: { color: AX.split } },
      },
      series: [
        {
          type: 'line',
          smooth: true,
          symbol: 'circle',
          symbolSize: 5,
          data: points.map((p) => p.value),
          lineStyle: { color: TEAL, width: 2 },
          itemStyle: { color: TEAL },
          areaStyle: { color: `${TEAL}1a` },
        },
      ],
    };
  }, [points]);

  // —— 统计条：经济数据集数 / 总行数 / 分类分布 ——
  const hub = React.useMemo(() => {
    const list = Array.isArray(datasets) ? datasets : [];
    let totalRows = 0;
    const byCat = {};
    for (const d of list) {
      if (!d) continue;
      totalRows += Number(d.rowCount) || 0;
      const k = d.category || '未分类';
      byCat[k] = (byCat[k] || 0) + 1;
    }
    return { count: list.length, totalRows, byCat };
  }, [datasets]);

  // —— 行编辑 ——
  const onEditRow = async (rowId, patch) => {
    if (!rowId || typeof updateRow !== 'function') return;
    try {
      await updateRow(rowId, patch);
      // 订阅会触发重读；这里同步乐观更新当前视图
      setRows((prev) => prev.map((r) => (r && r.rowId === rowId ? { ...r, ...patch } : r)));
    } catch (_) {
      setRowsErr('行更新失败');
    }
  };

  const onDeleteRow = async (rowId) => {
    if (!rowId || typeof deleteRow !== 'function') return;
    try {
      await deleteRow(rowId);
      setRows((prev) => prev.filter((r) => r && r.rowId !== rowId));
    } catch (_) {
      setRowsErr('行删除失败');
    }
  };

  const onDeleteDataset = async (id, dsName) => {
    if (!id || typeof deleteDataset !== 'function') return;
    let ok = true;
    try {
      ok = typeof window !== 'undefined' && window.confirm
        ? window.confirm(`确认删除数据集「${dsName || id}」？此操作不可撤销，将清除其全部行。`)
        : true;
    } catch (_) { ok = true; }
    if (!ok) return;
    try {
      await deleteDataset(id);
      setSelId(null);
    } catch (_) {
      setRowsErr('数据集删除失败');
    }
  };

  // —— 解析预览 ——
  const onParse = () => {
    setSaveMsg('');
    setParseErr('');
    setPreview(null);
    const text = (raw || '').trim();
    if (!text) { setParseErr('请先粘贴数据再解析。'); return; }
    if (typeof parseEconSeries !== 'function') {
      setParseErr('解析模块（econSeries）尚未就绪，请稍后重试。');
      return;
    }
    try {
      // 契约：parseEconSeries(text, fmt) —— 第二参为格式字符串（'auto'|'csv'|'json'|'free'）
      const parsed = parseEconSeries(text, fmt);
      const pts = parsed && Array.isArray(parsed.points)
        ? parsed.points
        : safeRowsToPoints(parsed && parsed.rows);
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

  // —— 保存到本地库 ——
  const onSave = async () => {
    if (!preview || !preview.points || !preview.points.length) {
      setSaveMsg('请先解析出有效数据点再保存。');
      return;
    }
    if (typeof seriesToDataset !== 'function' || typeof putDataset !== 'function') {
      setSaveMsg('落库模块尚未就绪，请稍后重试。');
      return;
    }
    setSaving(true);
    setSaveMsg('');
    try {
      // 契约：seriesToDataset(parsed, { category, name, source, note }) → putDataset 入参
      // 频率随口径写入 note（seriesToDataset 不单列 freq 字段）。
      const noteBits = [`频率 ${freq}`, '用户上传 · 使用前核对来源口径'];
      const ds = seriesToDataset(preview.parsed, {
        category: cat,
        name: (name || '').trim() || undefined,
        source: (source || '').trim() || undefined,
        note: noteBits.join(' · '),
      });
      const payload = ds && typeof ds === 'object' ? ds : {};
      await putDataset({
        name: payload.name || (name || '').trim() || `未命名经济序列 · ${cat}`,
        category: payload.category || cat,
        source: payload.source != null ? payload.source : ((source || '').trim() || '用户上传'),
        origin: payload.origin || 'upload',
        note: payload.note || noteBits.join(' · '),
        columns: payload.columns || ['period', 'value'],
        rows: Array.isArray(payload.rows) ? payload.rows : [],
        stampMs: Date.now(),
      });
      setSaveMsg('已保存到本地库，列表已自动刷新。');
      setPreview(null);
      setRaw('');
    } catch (e) {
      setSaveMsg(`保存失败：${(e && e.message) || 'IndexedDB 写入异常'}`);
    } finally {
      setSaving(false);
    }
  };

  const onFillSample = () => {
    setRaw(SAMPLE);
    setFmt('free');
    setCat(CATS.includes('经济运行') ? '经济运行' : CATS[0]);
    setFreq(FREQS.includes('年') ? '年' : FREQS[0]);
    if (!name) setName('GDP 实际增速（示例）');
    if (!source) setSource('用户上传 · 示例');
    setPreview(null);
    setParseErr('');
    setSaveMsg('');
  };

  const inputStyle = {
    background: 'var(--bg-base)',
    border: '1px solid var(--border-subtle)',
    color: 'var(--text-primary)',
    borderRadius: 'var(--radius-sm)',
    padding: '6px 10px',
    fontSize: '13px',
    outline: 'none',
  };

  const selectStyle = { ...inputStyle, paddingRight: 28 };

  return (
    <div className="os-card os-section mb-8" style={{ padding: 'var(--card-padding)' }}>
      <BandHead n="⌗" title="经济数据底座 · 本地序列管理" en="ECONOMIC DATA BASE" />

      {/* 顶部说明 + Link */}
      <div className="flex flex-wrap items-start justify-between gap-3 mb-3">
        <p className="text-xs leading-relaxed max-w-2xl" style={{ color: 'var(--text-secondary)' }}>
          本地浏览器持久化（IndexedDB）的经济类数据集就地管理：聚合经济运行 / 国家统计局 / 海关总署 /
          世界银行 / 科技 / 金融 / 财政 / 区域等序列，支持经济序列专用上传解析、行级编辑与折线复核。
          全量多域数据后台（其它领域、批量备份对账）仍在完整后台。
        </p>
        <Link
          to="/foundation"
          className="mono text-xs shrink-0 inline-flex items-center gap-1"
          style={{ color: 'var(--cyber-cyan)' }}
        >
          → 数据与系统 · 完整后台 ↗
        </Link>
      </div>

      {/* 统计条 */}
      <div className="flex flex-wrap items-center gap-1.5 mb-4">
        <StatChip label="经济数据集" value={hub.count} color={TEAL} />
        <StatChip label="总行数" value={fmtNum(hub.totalRows)} color="var(--text-primary)" />
        {Object.entries(hub.byCat).map(([k, n]) => (
          <StatChip key={k} label={k} value={n} color={OCHRE} />
        ))}
        {err && (
          <span className="mono text-[10px]" style={{ color: CINNABAR }}>// {err}</span>
        )}
      </div>

      {/* 左右两栏 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
        {/* 左栏：经济数据集列表 */}
        <div className="os-card p-4">
          <div className="mono text-[11px] mb-2" style={{ color: 'var(--text-tertiary)' }}>
            经济数据集（{hub.count}）
          </div>
          {!loaded ? (
            <p className="text-xs mono" style={{ color: 'var(--text-tertiary)' }}>// 读取本地库…</p>
          ) : datasets.length === 0 ? (
            <div
              className="rounded-md p-4 text-center"
              style={{ border: '1px dashed var(--border-subtle)' }}
            >
              <div className="mono text-sm mb-1" style={{ color: OCHRE }}>// 空</div>
              <p className="text-xs" style={{ color: 'var(--text-tertiary)' }}>
                暂无经济类数据集 —— 用右侧 / 下方上传，或去完整后台载入。
              </p>
            </div>
          ) : (
            <ul className="flex flex-col gap-1.5 max-h-[420px] overflow-auto pr-1">
              {datasets.map((d) => {
                if (!d) return null;
                const on = d.id === selId;
                const isUpload = d.origin === 'upload';
                return (
                  <li key={d.id}>
                    <button
                      type="button"
                      onClick={() => setSelId(d.id)}
                      className="w-full text-left rounded-md p-2.5 transition-colors"
                      style={{
                        background: on ? `${TEAL}14` : 'var(--bg-base)',
                        border: `1px solid ${on ? TEAL : 'var(--border-subtle)'}`,
                      }}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <span
                          className="text-[13px] font-medium leading-snug min-w-0"
                          style={{ color: 'var(--text-primary)' }}
                        >
                          {d.name || '未命名'}
                        </span>
                        <span
                          className="text-[10px] px-1.5 py-0.5 rounded mono shrink-0"
                          style={{ background: `${OCHRE}1f`, color: OCHRE }}
                        >
                          {d.category || '未分类'}
                        </span>
                      </div>
                      <div
                        className="mono text-[10px] mt-1 flex items-center gap-1.5 flex-wrap"
                        style={{ color: 'var(--text-tertiary)' }}
                      >
                        <span>{fmtNum(d.rowCount)} 行</span>
                        <span style={{ color: 'var(--border-subtle)' }}>·</span>
                        <span style={{ color: isUpload ? TEAL : INDIGO }}>
                          {isUpload ? '上传' : '种子'}
                        </span>
                        {d.source && (
                          <>
                            <span style={{ color: 'var(--border-subtle)' }}>·</span>
                            <span>{d.source}</span>
                          </>
                        )}
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

        {/* 右栏：选中态详情 */}
        <div className="os-card p-4">
          {!selected ? (
            <div className="h-full flex items-center justify-center">
              <p className="text-xs text-center" style={{ color: 'var(--text-tertiary)' }}>
                {datasets.length === 0
                  ? '左侧暂无数据集，先上传或去完整后台载入。'
                  : '从左侧选择一个经济数据集查看序列、统计与行编辑。'}
              </p>
            </div>
          ) : (
            <div>
              {/* 标题行 + 删集 */}
              <div className="flex items-start justify-between gap-2 mb-2">
                <div className="min-w-0">
                  <div className="text-sm font-semibold leading-tight" style={{ color: 'var(--text-primary)' }}>
                    {selected.name || '未命名'}
                  </div>
                  <div className="mono text-[10px] mt-0.5" style={{ color: 'var(--text-tertiary)' }}>
                    {selected.category || '未分类'} · {selected.source || '—'} ·{' '}
                    {selected.origin === 'upload' ? '上传' : '种子'} · {fmtNum(selected.rowCount)} 行
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => onDeleteDataset(selected.id, selected.name)}
                  className="mono text-[10px] px-2 py-1 rounded shrink-0"
                  style={{ color: CINNABAR, background: `${CINNABAR}12`, border: `1px solid ${CINNABAR}44` }}
                >
                  删除数据集
                </button>
              </div>

              {rowsErr && (
                <p className="mono text-[10px] mb-2" style={{ color: CINNABAR }}>// {rowsErr}</p>
              )}

              {/* 折线图 */}
              {rowsLoading ? (
                <p className="text-xs mono" style={{ color: 'var(--text-tertiary)' }}>// 加载序列…</p>
              ) : chartOption ? (
                <div className="rounded-md overflow-hidden mb-3">
                  <EChart option={chartOption} style={{ height: 220 }} />
                </div>
              ) : (
                <p className="text-xs mono mb-3" style={{ color: 'var(--text-tertiary)' }}>
                  // 该数据集无可绘制的 period/value 序列。
                </p>
              )}

              {/* 统计 chips */}
              {points.length > 0 && (
                <div className="flex flex-wrap items-center gap-1.5 mb-3">
                  <StatPill
                    label={stats.latest && stats.latest.period ? `最新 · ${stats.latest.period}` : '最新'}
                    value={fmtNum(stats.latest && stats.latest.value)}
                    color="var(--text-primary)"
                  />
                  <StatPill label="最小" value={fmtNum(stats.min)} color={INDIGO} />
                  <StatPill label="最大" value={fmtNum(stats.max)} color={OCHRE} />
                  <StatPill
                    label="环比"
                    value={stats.yoy == null ? '—' : `${stats.yoy > 0 ? '+' : ''}${stats.yoy}%`}
                    color={stats.yoy == null ? 'var(--text-tertiary)' : stats.yoy > 0 ? TEAL : stats.yoy < 0 ? CINNABAR : 'var(--text-tertiary)'}
                  />
                  <span
                    className="inline-flex items-center gap-1.5 px-2 py-1 rounded"
                    style={{ background: 'var(--bg-base)', border: '1px solid var(--border-subtle)' }}
                  >
                    <SignalDot signal={trendSignal(stats.trend)} />
                    <span className="mono text-[11px]" style={{ color: 'var(--text-secondary)' }}>
                      {trendLabel(stats.trend)}
                    </span>
                  </span>
                </div>
              )}

              {/* 行编辑（前 N 行 period/value） */}
              {rows.length > 0 && (
                <div>
                  <div className="mono text-[10px] mb-1.5" style={{ color: 'var(--text-tertiary)' }}>
                    行编辑 · 前 {Math.min(EDIT_N, rows.length)} / {rows.length} 行（直接改写即落库）
                  </div>
                  <div className="flex flex-col gap-1 max-h-[260px] overflow-auto pr-1">
                    {rows.slice(0, EDIT_N).map((r) => {
                      if (!r) return null;
                      const period = r.period ?? r.date ?? r.time ?? '';
                      const value = r.value ?? r.val ?? r.y ?? '';
                      return (
                        <div key={r.rowId} className="flex items-center gap-1.5">
                          <input
                            type="text"
                            defaultValue={period}
                            aria-label="期"
                            onBlur={(e) => {
                              const v = e.target.value;
                              if (v !== String(period)) onEditRow(r.rowId, { period: v });
                            }}
                            style={{ ...inputStyle, flex: 1, minWidth: 0, padding: '4px 8px', fontSize: 12 }}
                          />
                          <input
                            type="text"
                            defaultValue={value}
                            aria-label="值"
                            onBlur={(e) => {
                              const v = e.target.value;
                              if (v !== String(value)) {
                                const num = Number(v);
                                onEditRow(r.rowId, { value: isFinite(num) && v.trim() !== '' ? num : v });
                              }
                            }}
                            className="mono"
                            style={{ ...inputStyle, width: 96, padding: '4px 8px', fontSize: 12 }}
                          />
                          <button
                            type="button"
                            onClick={() => onDeleteRow(r.rowId)}
                            className="mono text-[10px] px-1.5 py-1 rounded shrink-0"
                            style={{ color: CINNABAR, background: 'transparent', border: `1px solid ${CINNABAR}33` }}
                            aria-label="删除此行"
                          >
                            删
                          </button>
                        </div>
                      );
                    })}
                  </div>
                  {rows.length > EDIT_N && (
                    <p className="mono text-[10px] mt-1.5" style={{ color: 'var(--text-tertiary)' }}>
                      仅前 {EDIT_N} 行可就地编辑；完整批量编辑请到完整后台。
                    </p>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* 上传卡（常驻） */}
      <div className="os-card p-4">
        <div className="mono text-[11px] mb-2" style={{ color: 'var(--text-tertiary)' }}>
          经济序列上传 · 解析 → 预览 → 落库
        </div>

        {/* 格式 SelectorBar */}
        <div className="flex flex-wrap items-center gap-2 mb-2">
          <div
            className="inline-flex items-center gap-0.5 p-0.5 rounded"
            style={{ background: 'var(--bg-base)', border: '1px solid var(--border-subtle)' }}
            role="tablist"
            aria-label="解析格式"
          >
            {FMT_TABS.map((t) => {
              const on = fmt === t.id;
              return (
                <button
                  key={t.id}
                  type="button"
                  role="tab"
                  aria-selected={on}
                  onClick={() => setFmt(t.id)}
                  className="mono text-[11px] px-2.5 py-1 rounded transition-colors"
                  style={on ? { background: `${TEAL}22`, color: TEAL, fontWeight: 600 } : { background: 'transparent', color: 'var(--text-tertiary)' }}
                >
                  {t.label}
                </button>
              );
            })}
          </div>
          <button
            type="button"
            onClick={onFillSample}
            className="mono text-[11px] px-2.5 py-1 rounded"
            style={{ color: INDIGO, background: `${INDIGO}12`, border: `1px solid ${INDIGO}44` }}
          >
            填充示例
          </button>
        </div>

        {/* textarea */}
        <textarea
          value={raw}
          onChange={(e) => { setRaw(e.target.value); }}
          placeholder={'粘贴经济序列数据…\nCSV：period,value（首行表头可选）\nJSON：[{"period":"2024","value":5.0}]\n自由粘贴：每行「期 值」，空白/逗号分隔'}
          rows={6}
          className="mono w-full"
          style={{ ...inputStyle, fontSize: 12, resize: 'vertical', minHeight: 120 }}
        />

        {/* 元数据：分类 / 频率 / 名称 / 来源 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 mt-2">
          <label className="flex flex-col gap-1">
            <span className="mono text-[10px]" style={{ color: 'var(--text-tertiary)' }}>分类</span>
            <select value={cat} onChange={(e) => setCat(e.target.value)} style={selectStyle}>
              {CATS.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </label>
          <label className="flex flex-col gap-1">
            <span className="mono text-[10px]" style={{ color: 'var(--text-tertiary)' }}>频率</span>
            <select value={freq} onChange={(e) => setFreq(e.target.value)} style={selectStyle}>
              {FREQS.map((f) => <option key={f} value={f}>{f}</option>)}
            </select>
          </label>
          <label className="flex flex-col gap-1">
            <span className="mono text-[10px]" style={{ color: 'var(--text-tertiary)' }}>名称</span>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="序列名称"
              style={inputStyle}
            />
          </label>
          <label className="flex flex-col gap-1">
            <span className="mono text-[10px]" style={{ color: 'var(--text-tertiary)' }}>来源</span>
            <input
              type="text"
              value={source}
              onChange={(e) => setSource(e.target.value)}
              placeholder="如 国家统计局 / 自录"
              style={inputStyle}
            />
          </label>
        </div>

        {/* 动作行 */}
        <div className="flex flex-wrap items-center gap-2 mt-3">
          <button
            type="button"
            onClick={onParse}
            className="mono text-[12px] px-3 py-1.5 rounded font-semibold"
            style={{ color: TEAL, background: `${TEAL}18`, border: `1px solid ${TEAL}55` }}
          >
            解析预览
          </button>
          <button
            type="button"
            onClick={onSave}
            disabled={saving || !preview || !preview.points || !preview.points.length}
            className="mono text-[12px] px-3 py-1.5 rounded font-semibold"
            style={{
              color: preview && preview.points && preview.points.length ? OCHRE : 'var(--text-tertiary)',
              background: preview && preview.points && preview.points.length ? `${OCHRE}18` : 'var(--bg-base)',
              border: `1px solid ${preview && preview.points && preview.points.length ? `${OCHRE}55` : 'var(--border-subtle)'}`,
              cursor: saving || !preview || !preview.points || !preview.points.length ? 'not-allowed' : 'pointer',
              opacity: saving ? 0.7 : 1,
            }}
          >
            {saving ? '保存中…' : '保存到本地库'}
          </button>
          {parseErr && <span className="mono text-[11px]" style={{ color: CINNABAR }}>// {parseErr}</span>}
          {saveMsg && (
            <span
              className="mono text-[11px]"
              style={{ color: saveMsg.startsWith('已保存') ? TEAL : CINNABAR }}
            >
              {saveMsg}
            </span>
          )}
        </div>

        {/* 预览块 */}
        {preview && (
          <div
            className="mt-3 rounded-md p-3"
            style={{ background: 'var(--bg-base)', border: '1px solid var(--border-subtle)' }}
          >
            <div className="mono text-[11px] mb-1.5" style={{ color: 'var(--text-secondary)' }}>
              解析结果 · <span style={{ color: TEAL }}>{preview.points.length}</span> 个有效数据点
            </div>
            {preview.points.length > 0 && (
              <div className="flex flex-wrap items-center gap-1.5 mb-2">
                {preview.points.slice(0, 6).map((p, i) => (
                  <span
                    key={i}
                    className="mono text-[10px] px-1.5 py-0.5 rounded"
                    style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-subtle)', color: 'var(--text-tertiary)' }}
                  >
                    <span style={{ color: 'var(--text-secondary)' }}>{p.period}</span>
                    {' '}{fmtNum(p.value)}
                  </span>
                ))}
                {preview.points.length > 6 && (
                  <span className="mono text-[10px]" style={{ color: 'var(--text-tertiary)' }}>
                    …共 {preview.points.length}
                  </span>
                )}
              </div>
            )}
            {Array.isArray(preview.warnings) && preview.warnings.length > 0 && (
              <ul className="flex flex-col gap-0.5">
                {preview.warnings.map((w, i) => (
                  <li key={i} className="mono text-[10px]" style={{ color: OCHRE }}>
                    ⚠ {typeof w === 'string' ? w : (w && w.message) || String(w)}
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}

        {/* 卡尾口径小字 */}
        <p className="mt-3 text-[10px] mono leading-relaxed" style={{ color: 'var(--text-tertiary)' }}>
          用户上传数据请核对来源与口径；本地 IndexedDB 持久化 · {DISCLAIMER}
        </p>
      </div>
    </div>
  );
}
