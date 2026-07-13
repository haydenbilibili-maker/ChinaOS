import React, { useState, useMemo } from 'react';
import { Card } from '../../app/ui.jsx';
import EChart from '../../lib/viz/EChart.jsx';
import {
  COMPARE_COUNTRIES, COMPARE_INDICATORS, DEFAULT_ISOS,
  useWBCompare, wbCompareStat,
} from './liveWBCompare.js';
import { BandHead } from './econUI.jsx';
import { categoryX, valueY, CHART_TOOLTIP, LEGEND } from '../shared/chartHelpers.js';

// ============================================================================
// 国际对比 · 世界银行（SectionCompare）
// ----------------------------------------------------------------------------
// 自包含 Section：内部直接 useWBCompare 实时取数（World Bank 多国近 10 年），
// 主线程 Page.jsx import 后 <SectionCompare/> 直接落位即可，无 props。
//   · 顶部 BandHead 编号 ◆ 标题区
//   · 指标 SelectorBar（COMPARE_INDICATORS，默认人均 GDP）
//   · 国家多选 chip（COMPARE_COUNTRIES，默认 CHN/USA/IND，最少 1、最多 5）
//   · ECharts 多国折线（近 10 年，每国 COMPARE_COUNTRIES.color，标记最新点）
//       loading 骨架 / error 降级提示「World Bank 取数失败/限频，稍后重试」
//   · latest 大数对比条（wbCompareStat）+ 中国相对位次一句
//   · source 徽章「World Bank · 实时」绿点 + 选中指标 note + 口径小字
// 容错：data 缺失不崩。
// 口径：公开统计梳理 · 示意标定 · 非投资建议 · 非预测。
// ============================================================================

const DISCLAIMER = '公开统计梳理 · 示意标定 · 非投资建议 · 非预测';
const TEAL = '#62a89e';   // 青：实时挂载 / 好转
const MAX_PICK = 5;

// ISO → 国家元数据 速查
const COUNTRY_BY_ISO = COMPARE_COUNTRIES.reduce((m, c) => { m[c.iso] = c; return m; }, {});

// 指标 key → 定义 速查
const IND_BY_KEY = COMPARE_INDICATORS.reduce((m, i) => { m[i.key] = i; return m; }, {});

export default function SectionCompare() {
  const [indKey, setIndKey] = useState('gdpPerCap');
  const [isos, setIsos] = useState(DEFAULT_ISOS);

  const ind = IND_BY_KEY[indKey] || COMPARE_INDICATORS[0];
  const { data, loading, error, fetchedAt } = useWBCompare(indKey, isos);
  const byCountry = (data && data.byCountry) || {};

  // 国家多选切换：最少保留 1 国、最多 MAX_PICK 国
  const toggleIso = (iso) => {
    setIsos((prev) => {
      if (prev.includes(iso)) {
        if (prev.length <= 1) return prev; // 至少保留 1 国
        return prev.filter((x) => x !== iso);
      }
      if (prev.length >= MAX_PICK) return prev; // 封顶 5 国
      // 维持 COMPARE_COUNTRIES 顺序
      return COMPARE_COUNTRIES.map((c) => c.iso).filter((x) => prev.includes(x) || x === iso);
    });
  };

  // —— ECharts 多国折线 option ——
  const chartOption = useMemo(() => {
    // 全部年份并集（升序）
    const yearSet = new Set();
    isos.forEach((iso) => {
      const c = byCountry[iso];
      if (c && Array.isArray(c.series)) c.series.forEach((p) => yearSet.add(p.year));
    });
    const years = Array.from(yearSet).sort((a, b) => a - b);

    const series = isos.map((iso) => {
      const meta = COUNTRY_BY_ISO[iso] || { name: iso, color: TEAL };
      const c = byCountry[iso] || {};
      const lookup = {};
      if (Array.isArray(c.series)) c.series.forEach((p) => { lookup[p.year] = p.value; });
      const latestYear = c.latest ? c.latest.year : null;
      const pts = years.map((y) => (y in lookup ? lookup[y] : null));
      return {
        name: meta.name,
        type: 'line',
        smooth: false,
        connectNulls: true,
        symbol: 'circle',
        symbolSize: (val, params) => (params.dataIndex === years.indexOf(latestYear) ? 7 : 3),
        showSymbol: true,
        lineStyle: { width: 2, color: meta.color },
        itemStyle: { color: meta.color },
        emphasis: { focus: 'series' },
        data: pts,
        // 标记最新点
        markPoint: latestYear != null ? {
          symbol: 'circle',
          symbolSize: 8,
          itemStyle: { color: meta.color, borderColor: '#fff', borderWidth: 1.5 },
          label: { show: false },
          data: [{ coord: [String(latestYear), lookup[latestYear]] }],
        } : undefined,
      };
    });

    const isPct = ind.kind === 'pct' || ind.kind === 'index';
    return {
      grid: { left: 48, right: 18, top: 30, bottom: 28 },
      legend: { top: 0, ...LEGEND, itemHeight: 8, icon: 'roundRect' },
      tooltip: {
        trigger: 'axis',
        ...CHART_TOOLTIP,
        valueFormatter: (v) => (v == null ? '—' : wbCompareStat(v, ind.kind)),
      },
      xAxis: {
        ...categoryX(years.map(String)),
        boundaryGap: false,
        axisTick: { show: false },
      },
      yAxis: {
        ...valueY({
          scale: !isPct,
          axisLine: { show: false },
          axisLabel: {
            formatter: (v) => (isPct ? `${v}` : wbCompareStat(v, ind.kind)),
          },
        }),
      },
      series,
    };
  }, [byCountry, isos, ind]);

  // —— latest 大数对比条数据（按 latest 值降序）——
  const ranked = useMemo(() => {
    const rows = isos.map((iso) => {
      const meta = COUNTRY_BY_ISO[iso] || { name: iso, color: TEAL };
      const c = byCountry[iso] || {};
      const latest = c.latest || null;
      return {
        iso,
        name: meta.name,
        color: meta.color,
        value: latest ? latest.value : null,
        year: latest ? latest.year : null,
        error: c.error || null,
      };
    });
    const withVal = rows.filter((r) => r.value != null);
    const maxAbs = withVal.length ? Math.max(...withVal.map((r) => Math.abs(r.value))) : 0;
    rows.forEach((r) => { r.pct = r.value != null && maxAbs > 0 ? (Math.abs(r.value) / maxAbs) * 100 : 0; });
    rows.sort((a, b) => {
      if (a.value == null) return 1;
      if (b.value == null) return -1;
      return b.value - a.value;
    });
    return rows;
  }, [byCountry, isos]);

  // 中国相对位次一句
  const chinaRankLine = useMemo(() => {
    if (!isos.includes('CHN')) return null;
    const valued = ranked.filter((r) => r.value != null);
    const idx = valued.findIndex((r) => r.iso === 'CHN');
    if (idx < 0) return null;
    const total = valued.length;
    const rank = idx + 1;
    const cn = valued[idx];
    const top = valued[0];
    let rel = '';
    if (rank === 1) {
      rel = '在选中国家中居首';
    } else if (top && top.value && cn.value != null) {
      const ratio = top.value !== 0 ? (cn.value / top.value) : null;
      rel = ratio != null
        ? `居第 ${rank} / ${total}，约为最高者 ${top.name} 的 ${(ratio * 100).toFixed(0)}%`
        : `居第 ${rank} / ${total}`;
    } else {
      rel = `居第 ${rank} / ${total}`;
    }
    return `中国「${ind.label}」最新 ${wbCompareStat(cn.value, ind.kind)}${cn.year ? `（${cn.year}）` : ''}，${rel}。`;
  }, [ranked, isos, ind]);

  const allEmpty = ranked.every((r) => r.value == null);

  return (
    <Card className="os-card">
      <BandHead n="◆" title="国际对比 · 世界银行" en="GLOBAL BENCHMARK · WORLD BANK" />

      {/* 指标 SelectorBar */}
      <div className="flex flex-wrap gap-1.5 mt-3">
        {COMPARE_INDICATORS.map((it) => {
          const active = it.key === indKey;
          return (
            <button
              key={it.key}
              type="button"
              onClick={() => setIndKey(it.key)}
              className="text-[11px] px-2.5 py-1 rounded-full transition-colors"
              style={{
                background: active ? `${TEAL}1f` : 'var(--bg-elevated)',
                border: `1px solid ${active ? TEAL : 'var(--border-subtle)'}`,
                color: active ? TEAL : 'var(--text-secondary)',
                fontWeight: active ? 600 : 400,
              }}
            >
              {it.label}
            </button>
          );
        })}
      </div>

      {/* 国家多选 chip */}
      <div className="flex flex-wrap items-center gap-1.5 mt-3">
        <span className="text-[10px] mono mr-1" style={{ color: 'var(--text-tertiary)' }}>对比国家</span>
        {COMPARE_COUNTRIES.map((c) => {
          const active = isos.includes(c.iso);
          const atCap = !active && isos.length >= MAX_PICK;
          return (
            <button
              key={c.iso}
              type="button"
              onClick={() => toggleIso(c.iso)}
              disabled={atCap}
              title={atCap ? `最多对比 ${MAX_PICK} 国` : c.name}
              className="inline-flex items-center gap-1.5 text-[11px] px-2.5 py-1 rounded-full transition-colors"
              style={{
                background: active ? `${c.color}1f` : 'var(--bg-elevated)',
                border: `1px solid ${active ? c.color : 'var(--border-subtle)'}`,
                color: active ? c.color : 'var(--text-tertiary)',
                opacity: atCap ? 0.45 : 1,
                cursor: atCap ? 'not-allowed' : 'pointer',
                fontWeight: active ? 600 : 400,
              }}
            >
              <span style={{ width: 7, height: 7, borderRadius: 2, background: c.color, display: 'inline-block', opacity: active ? 1 : 0.4 }} />
              {c.name}
            </button>
          );
        })}
        <span className="text-[10px] mono ml-auto" style={{ color: 'var(--text-tertiary)' }}>
          {isos.length}/{MAX_PICK} 国
        </span>
      </div>

      {/* 主图区：loading 骨架 / error 降级 / 折线 */}
      <div className="mt-4" style={{ minHeight: 300 }}>
        {loading ? (
          <div
            className="rounded-md animate-pulse flex items-center justify-center"
            style={{ height: 300, background: 'var(--bg-elevated)', border: '1px solid var(--border-subtle)' }}
          >
            <span className="text-xs mono" style={{ color: 'var(--text-tertiary)' }}>
              World Bank 实时取数中 · 逐国错峰…
            </span>
          </div>
        ) : (error || allEmpty) ? (
          <div
            className="rounded-md flex flex-col items-center justify-center gap-2 px-4 text-center"
            style={{ height: 300, background: 'var(--bg-elevated)', border: '1px solid var(--border-subtle)' }}
          >
            <span className="text-sm font-semibold" style={{ color: '#c44e3d' }}>
              World Bank 取数失败 / 限频
            </span>
            <span className="text-xs" style={{ color: 'var(--text-tertiary)' }}>
              稍后重试。{error ? `（${error}）` : ''}
            </span>
          </div>
        ) : (
          <EChart option={chartOption} style={{ height: 300 }} />
        )}
      </div>

      {/* latest 大数对比条 */}
      {!loading && !allEmpty && (
        <div className="mt-5 space-y-2">
          {ranked.map((r) => (
            <div key={r.iso} className="flex items-center gap-3">
              <span className="text-xs shrink-0" style={{ width: 40, color: 'var(--text-secondary)' }}>{r.name}</span>
              <div className="flex-1 rounded-full overflow-hidden" style={{ height: 8, background: 'var(--bg-elevated)' }}>
                <span style={{ width: `${Math.max(r.pct, r.value != null ? 4 : 0)}%`, height: '100%', display: 'block', background: r.color }} />
              </div>
              <span className="mono text-xs shrink-0 text-right" style={{ width: 96, color: r.value != null ? 'var(--text-primary)' : 'var(--text-tertiary)' }}>
                {r.value != null ? wbCompareStat(r.value, ind.kind) : (r.error ? '取数失败' : '—')}
                {r.year ? <span className="ml-1 text-[10px]" style={{ color: 'var(--text-tertiary)' }}>{r.year}</span> : null}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* 中国相对位次一句 */}
      {!loading && !allEmpty && chinaRankLine && (
        <p className="text-xs leading-relaxed mt-3" style={{ color: 'var(--text-secondary)' }}>
          {chinaRankLine}
        </p>
      )}

      {/* source 徽章 + 指标 note */}
      <div className="mt-4 flex items-center gap-2 flex-wrap">
        <span
          className="inline-flex items-center gap-1.5 text-[10px] mono px-2 py-0.5 rounded"
          style={{ background: `${TEAL}14`, border: `1px solid ${TEAL}55`, color: TEAL }}
        >
          <span style={{ width: 7, height: 7, borderRadius: '50%', background: TEAL, display: 'inline-block', boxShadow: `0 0 6px ${TEAL}aa` }} />
          World Bank · 实时
        </span>
        {fetchedAt && (
          <span className="text-[10px] mono" style={{ color: 'var(--text-tertiary)' }}>
            更新 {fetchedAt.toLocaleString('zh-CN', { hour12: false })}
          </span>
        )}
      </div>

      {ind.note && (
        <p className="text-[11px] leading-relaxed mt-2" style={{ color: 'var(--text-tertiary)' }}>
          {ind.label}：{ind.note}
        </p>
      )}

      {/* 统一口径小字 */}
      <p className="mt-3 text-[10px] mono" style={{ color: 'var(--text-tertiary)' }}>
        {DISCLAIMER}
      </p>
    </Card>
  );
}
