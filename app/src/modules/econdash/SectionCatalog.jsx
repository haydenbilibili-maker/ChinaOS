import React from 'react';
import { Card } from '../../app/ui.jsx';
import { MACRO_BANDS, CHART_GLYPH, bandStats, catalogFilter } from './econCatalog.js';
import { ECON_COLORS, LENS_META, LensChip, BandHead } from './econUI.jsx';
import { KEY_INDICATORS, indicatorVerdict } from './econData.js';

// ============================================================================
// 共享宏观骨架 · 指标目录（SectionCatalog）
// ----------------------------------------------------------------------------
// 自包含 Section：内部直接取 MACRO_BANDS（确定性 seed，基准日常量），主线程
// Page.jsx import 后 <SectionCatalog/> 直接落位即可，无 props。
//   · 顶部 BandHead 编号 01–10 标题区
//   · 工具行：bandStats 摘要 chips + lens 筛选 SelectorBar + 受控搜索框
//   · catalogFilter(MACRO_BANDS,{lens,q}) → 2 列卡片网格（移动端 1 列）
//       accent='region' 卡左边框赭、accent='narr' 卡左边框黛
//       卡头：cn 编号(mono) + h 带名(衬线感) + star(右上,赭/黛)
//       rows：name(主) + note(次,faint) + meta「src · freq · glyph chart」+ LensChip
//       row.key 命中 KEY_INDICATORS(按 id) → 行右追加实时小徽章（value+unit /
//       yoy 涨跌着色 / indicatorVerdict tone 圆点，绿点标识「挂载实时读数」）
//   · 空结果友好提示 + 卡尾统一口径小字
// 设计语言：四色语义 朱砂/青/赭/黛 取自 ECON_COLORS（缺省回退硬编码）。
// 确定性、容错（数据非数组回退空、缺字段不崩）。
// 口径：公开统计梳理 · 示意标定 · 非投资建议 · 非预测。
// ============================================================================

const DISCLAIMER = '公开统计梳理 · 示意标定 · 非投资建议 · 非预测';

// —— 四色语义缺省回退（econUI 缺失时仍可渲染）——
const C = ECON_COLORS || {};
const OCHRE = C.ochre || '#c99a4e'; // 赭：区域 / 域视角
const INDIGO = C.indigo || '#8090c6'; // 黛：叙事 / 叙视角
const TEAL = C.teal || '#62a89e'; // 青：实时挂载 / 好转
const CINNABAR = C.cinnabar || '#c44e3d'; // 朱砂：通缩 / 下跌 / 警示

// —— indicatorVerdict.tone → 圆点色 ——
const TONE_COLOR = {
  positive: TEAL,
  caution: OCHRE,
  negative: CINNABAR,
  neutral: 'var(--text-tertiary)',
};

// —— lens 筛选档位（全部 / 叙 / 域 / 双）——
const LENS_TABS = [
  { id: 'all', label: '全部' },
  { id: '叙', label: '叙' },
  { id: '域', label: '域' },
  { id: '双', label: '双' },
];

// 实时读数小徽章：行 key 命中 KEY_INDICATORS(按 id) 时挂载。
function LiveBadge({ ind }) {
  if (!ind || typeof ind !== 'object') return null;
  const verdict = typeof indicatorVerdict === 'function' ? indicatorVerdict(ind) : null;
  const toneColor = (verdict && TONE_COLOR[verdict.tone]) || 'var(--text-tertiary)';
  const yoy = typeof ind.yoy === 'number' && Number.isFinite(ind.yoy) ? ind.yoy : null;
  const yoyColor = yoy == null ? 'var(--text-tertiary)' : yoy > 0 ? TEAL : yoy < 0 ? CINNABAR : 'var(--text-tertiary)';
  const yoyText = yoy == null ? null : `${yoy > 0 ? '+' : ''}${yoy}%`;
  const valText = ind.value != null ? `${ind.value}${ind.unit || ''}` : null;

  return (
    <span
      className="inline-flex items-center gap-1.5 shrink-0 mono text-[10px] px-1.5 py-0.5 rounded"
      style={{ background: 'var(--bg-base)', border: `1px solid ${TEAL}55` }}
      title={`挂载实时读数${verdict?.text ? ' · ' + verdict.text : ''}`}
    >
      {/* 绿点标识：挂载实时读数 */}
      <span
        style={{ width: 6, height: 6, borderRadius: '50%', background: TEAL, display: 'inline-block', boxShadow: `0 0 5px ${TEAL}aa` }}
        aria-label="挂载实时读数"
      />
      {valText && <span style={{ color: 'var(--text-primary)' }}>{valText}</span>}
      {yoyText && <span style={{ color: yoyColor }}>{yoyText}</span>}
      {/* 研判 tone 圆点 */}
      <span
        style={{ width: 7, height: 7, borderRadius: '50%', background: toneColor, display: 'inline-block' }}
        aria-label={`研判 ${verdict?.tone || '中性'}`}
      />
    </span>
  );
}

// 单行：name + note + meta（src · freq · glyph chart）+ LensChip + 实时徽章。
function CatalogRow({ row, liveById }) {
  if (!row || typeof row !== 'object') return null;
  const glyph = (CHART_GLYPH && row.chart && CHART_GLYPH[row.chart]) || '';
  const metaBits = [
    row.src || null,
    row.freq || null,
    row.chart ? `${glyph ? glyph + ' ' : ''}${row.chart} chart` : null,
  ].filter(Boolean);
  const ind = row.key && liveById ? liveById[row.key] : null;

  return (
    <li
      className="py-2.5"
      style={{ borderTop: '1px solid var(--border-subtle)' }}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0 flex-1">
          <div className="text-[13px] font-medium leading-snug" style={{ color: 'var(--text-primary)' }}>
            {row.name || '—'}
          </div>
          {row.note && (
            <div className="text-[11px] leading-snug mt-0.5" style={{ color: 'var(--text-tertiary)' }}>
              {row.note}
            </div>
          )}
        </div>
        <div className="flex items-center gap-1.5 shrink-0">
          {ind && <LiveBadge ind={ind} />}
          {row.lens && <LensChip lens={row.lens} />}
        </div>
      </div>

      {metaBits.length > 0 && (
        <div className="mono text-[10px] mt-1.5 flex items-center gap-1.5 flex-wrap" style={{ color: 'var(--text-tertiary)' }}>
          {metaBits.map((b, i) => (
            <React.Fragment key={i}>
              {i > 0 && <span style={{ color: 'var(--border-subtle)' }}>·</span>}
              <span>{b}</span>
            </React.Fragment>
          ))}
        </div>
      )}
    </li>
  );
}

// 单卡：一条宏观带（cn / h / star / rows）。
function BandCard({ band, liveById }) {
  if (!band || typeof band !== 'object') return null;
  const isNarr = band.accent === 'narr';
  const edge = isNarr ? INDIGO : OCHRE; // narr→黛, region(默认)→赭
  const star = band.star || (isNarr ? '✦' : '◆');
  const rows = Array.isArray(band.rows) ? band.rows : [];

  return (
    <div className="os-card p-4" style={{ borderLeft: `3px solid ${edge}`, position: 'relative' }}>
      {/* 卡头：cn 编号 + h 带名 + star（右上） */}
      <div className="flex items-baseline gap-2 pr-5">
        {band.cn != null && (
          <span className="mono text-xs font-semibold shrink-0" style={{ color: edge }}>
            {band.cn}
          </span>
        )}
        <h4
          className="text-sm font-semibold leading-tight"
          style={{
            fontFamily: "'Noto Serif SC', 'Songti SC', 'STSong', Georgia, serif",
            color: 'var(--text-primary)',
          }}
        >
          {band.h || '未命名带'}
        </h4>
      </div>
      {band.note && (
        <p className="text-[10px] leading-relaxed mt-1.5 m-0" style={{ color: 'var(--text-tertiary)' }}>
          {band.note}
        </p>
      )}
      <span
        className="absolute text-sm"
        style={{ top: 12, right: 14, color: edge }}
        aria-hidden="true"
      >
        {star}
      </span>

      {/* rows 列表 */}
      {rows.length > 0 ? (
        <ul className="mt-2">
          {rows.map((row, i) => (
            <CatalogRow key={row?.key || row?.name || i} row={row} liveById={liveById} />
          ))}
        </ul>
      ) : (
        <p className="text-[11px] mt-3" style={{ color: 'var(--text-tertiary)' }}>
          该带暂无指标条目。
        </p>
      )}
    </div>
  );
}

// 摘要 chip。
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

export default function SectionCatalog() {
  const [lens, setLens] = React.useState('all');
  const [q, setQ] = React.useState('');

  // 数据源容错：非数组一律回退空。
  const bands = Array.isArray(MACRO_BANDS) ? MACRO_BANDS : [];

  // KEY_INDICATORS → id 索引（实时挂载查表）。
  const liveById = React.useMemo(() => {
    const map = {};
    const list = Array.isArray(KEY_INDICATORS) ? KEY_INDICATORS : [];
    for (const it of list) {
      if (it && it.id != null) map[it.id] = it;
    }
    return map;
  }, []);

  // 摘要：优先用契约 bandStats，缺失/异常时本地兜底统计。
  const stats = React.useMemo(() => {
    let s = null;
    if (typeof bandStats === 'function') {
      try { s = bandStats(bands); } catch (_) { s = null; }
    }
    if (s && typeof s === 'object') return s;
    // —— 本地兜底统计 ——
    let indicators = 0, live = 0, narr = 0, region = 0, both = 0;
    for (const b of bands) {
      const rows = Array.isArray(b?.rows) ? b.rows : [];
      indicators += rows.length;
      for (const r of rows) {
        if (r?.key && liveById[r.key]) live += 1;
        if (r?.lens === '叙') narr += 1;
        else if (r?.lens === '域') region += 1;
        else if (r?.lens === '双') both += 1;
      }
    }
    return { bands: bands.length, indicators, live, narr, region, both };
  }, [bands, liveById]);

  // 读数兼容多种字段命名（契约 bandStats 用 bandCount/rowCount/liveCount + 嵌套 lensCount）。
  const lc = (stats.lensCount && typeof stats.lensCount === 'object') ? stats.lensCount : stats;
  const sBands = stats.bands ?? stats.bandCount ?? bands.length;
  const sIndicators = stats.indicators ?? stats.rowCount ?? stats.indicatorCount ?? stats.rows ?? 0;
  const sLive = stats.live ?? stats.liveCount ?? stats.mounted ?? 0;
  const sNarr = lc.narr ?? lc.叙 ?? 0;
  const sRegion = lc.region ?? lc.域 ?? 0;
  const sBoth = lc.both ?? lc.双 ?? 0;

  // 筛选：优先契约 catalogFilter，缺失/异常时本地兜底。
  const filtered = React.useMemo(() => {
    const opts = { lens: lens === 'all' ? null : lens, q };
    if (typeof catalogFilter === 'function') {
      try {
        const r = catalogFilter(bands, opts);
        if (Array.isArray(r)) return r;
      } catch (_) { /* 落到兜底 */ }
    }
    // —— 本地兜底筛选 ——
    const needle = (q || '').trim().toLowerCase();
    const want = lens === 'all' ? null : lens;
    return bands
      .map((b) => {
        const rows = Array.isArray(b?.rows) ? b.rows : [];
        const kept = rows.filter((r) => {
          if (want && r?.lens !== want) return false;
          if (!needle) return true;
          const hay = [r?.name, r?.note, r?.src, b?.h, b?.cn].filter(Boolean).join(' ').toLowerCase();
          return hay.includes(needle);
        });
        return kept.length ? { ...b, rows: kept } : null;
      })
      .filter(Boolean);
  }, [bands, lens, q]);

  const lensActiveColor = (id) => {
    if (id === '叙') return INDIGO;
    if (id === '域') return OCHRE;
    if (id === '双') return TEAL;
    return CINNABAR;
  };

  return (
    <Card className="os-card">
      <BandHead n="01–10" title="共享宏观骨架" en="SHARED MACRO SKELETON" />

      {/* 工具行：摘要 chips + lens SelectorBar + 搜索框 */}
      <div className="flex flex-wrap items-center justify-between gap-3 mt-2 mb-4">
        {/* 摘要 chips */}
        <div className="flex flex-wrap items-center gap-1.5">
          <StatChip label="带" value={sBands} color={OCHRE} />
          <StatChip label="指标" value={sIndicators} color="var(--text-primary)" />
          <StatChip label="实时挂载" value={sLive} color={TEAL} />
          <StatChip label="叙" value={sNarr} color={INDIGO} />
          <StatChip label="域" value={sRegion} color={OCHRE} />
          <StatChip label="双" value={sBoth} color={TEAL} />
        </div>

        {/* lens 筛选 + 搜索 */}
        <div className="flex flex-wrap items-center gap-2">
          <div
            className="inline-flex items-center gap-0.5 p-0.5 rounded"
            style={{ background: 'var(--bg-base)', border: '1px solid var(--border-subtle)' }}
            role="tablist"
            aria-label="视角筛选"
          >
            {LENS_TABS.map((t) => {
              const on = lens === t.id;
              const ac = lensActiveColor(t.id);
              return (
                <button
                  key={t.id}
                  type="button"
                  role="tab"
                  aria-selected={on}
                  onClick={() => setLens(t.id)}
                  className="mono text-[11px] px-2.5 py-1 rounded transition-colors"
                  style={
                    on
                      ? { background: `${ac}22`, color: ac, fontWeight: 600 }
                      : { background: 'transparent', color: 'var(--text-tertiary)' }
                  }
                >
                  {t.label}
                </button>
              );
            })}
          </div>

          <input
            type="text"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="搜索指标 / 带名…"
            aria-label="搜索指标"
            className="text-[13px]"
            style={{
              background: 'var(--bg-base)',
              border: '1px solid var(--border-subtle)',
              color: 'var(--text-primary)',
              borderRadius: 'var(--radius-sm)',
              padding: '6px 10px',
              minWidth: 160,
              outline: 'none',
            }}
          />
          {q && (
            <button
              type="button"
              onClick={() => setQ('')}
              className="mono text-[11px] px-1.5 py-1 rounded"
              style={{ color: 'var(--text-tertiary)', background: 'transparent' }}
              aria-label="清除搜索"
            >
              清除
            </button>
          )}
        </div>
      </div>

      {/* 目录卡网格 —— 移动端 1 列、桌面 2 列 */}
      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map((band, i) => (
            <BandCard key={band?.cn || band?.h || i} band={band} liveById={liveById} />
          ))}
        </div>
      ) : (
        <div
          className="os-card p-6 text-center"
          style={{ borderStyle: 'dashed' }}
        >
          <div className="mono text-sm mb-1" style={{ color: CINNABAR }}>// 无匹配</div>
          <p className="text-xs" style={{ color: 'var(--text-tertiary)' }}>
            {bands.length === 0
              ? '指标目录暂未挂载，等待数据接线。'
              : '当前筛选 / 搜索条件下无匹配指标，试试切换视角或清空关键词。'}
          </p>
        </div>
      )}

      {/* 统一口径小字 */}
      <p className="mt-4 text-[10px] mono" style={{ color: 'var(--text-tertiary)' }}>
        {DISCLAIMER}
      </p>
    </Card>
  );
}
