import React, { useState, useMemo } from 'react';
import { Card } from '../../app/ui.jsx';
import EChart from '../../lib/viz/EChart.jsx';
import ChinaMap from '../../lib/viz/ChinaMap.jsx';
import {
  ECON_COLORS, BandHead, Meter, SignalDot,
} from './econUI.jsx';
import { LABEL, AXIS, GRID_LINE, LEGEND } from '../shared/chartHelpers.js';
import {
  REGION_METRICS, REGIONS, regionStressTally, compareRegions,
  REGION_MAP_METRICS, regionMapData,
} from './econRegional.js';

// ============================================================================
// 区域下钻 · 投资环境压力（SectionRegional）
// ----------------------------------------------------------------------------
// 自包含 Section：内部直接取 REGIONS（确定性 seed，基准日常量），主线程
// Page.jsx import 后 <SectionRegional/> 直接落位即可，无 props。
//   · 顶部 BandHead 编号 ▲ 标题区
//   · lead：全国数据掩盖区域分化，下钻到省级看投资环境真实约束
//   · 省份选择：按 group 分组 chip（默认辽宁），最多 3 个对比
//       单选 → 该省六维 Meter 列表（label + raw + Meter(value) + stress 着色
//               赭→朱砂 + src 小字）+ regionStressTally 综合研判徽章
//       多选 → ECharts 雷达对比（compareRegions，六维，每省一系列，赭/黛/青）
//   · 卡尾统一口径小字。容错：数据缺失回退、零随机。
// 设计语言：四色语义 朱砂/青/赭/黛 取自 ECON_COLORS。
// 口径：公开统计梳理 · 示意标定 · 非投资建议 · 非预测。
// ============================================================================

const DISCLAIMER = '公开统计梳理 · 示意标定 · 非投资建议 · 非预测 —— 区域指标为公开口径近似 + 示意标定';
const MAX_COMPARE = 3;
// 八大区 + 全国，对齐 econRegional.js 的 group 取值（chip 与地图共用排序）
const GROUP_ORDER = ['东北', '华北', '华东', '华中', '华南', '西南', '西北', '全国'];

// stress 档位 → 颜色（低→赭，中度→赭偏暖，高压/严重→朱砂）。赭→朱砂语义。
function stressColor(stress) {
  const C = ECON_COLORS || {};
  if (stress === '高压' || stress === '严重') return C.cinnabar || '#c44e3d';
  if (stress === '中度') return C.ochre || '#c99a4e';
  return C.teal || '#62a89e';
}

// 综合等级 → 语义色 + signal（稳健→青，承压→赭，高压→朱砂）
function levelStyle(level) {
  const C = ECON_COLORS || {};
  if (level === '高压') return { color: C.cinnabar || '#c44e3d', signal: 'red' };
  if (level === '承压') return { color: C.ochre || '#c99a4e', signal: 'amber' };
  return { color: C.teal || '#62a89e', signal: 'green' };
}

// 多区域系列配色：赭 / 黛 / 青（最多 3 个对比）
function compareColors() {
  const C = ECON_COLORS || {};
  return [C.ochre || '#c99a4e', C.indigo || '#8090c6', C.teal || '#62a89e'];
}

export default function SectionRegional() {
  const regions = Array.isArray(REGIONS) ? REGIONS : [];
  const metrics = Array.isArray(REGION_METRICS) ? REGION_METRICS : [];

  // 默认辽宁；找不到则回退首个区域
  const defaultId = regions.some((r) => r.id === 'liaoning')
    ? 'liaoning'
    : (regions[0]?.id || null);
  const [selected, setSelected] = useState(defaultId ? [defaultId] : []);

  // —— 地图指标切换（综合承压 + 六维），默认综合承压 ——
  const mapMetrics = Array.isArray(REGION_MAP_METRICS) ? REGION_MAP_METRICS : [];
  const [mapMetricKey, setMapMetricKey] = useState(mapMetrics[0]?.key || 'composite');
  const mapMetric = mapMetrics.find((m) => m.key === mapMetricKey) || mapMetrics[0] || null;

  // 当前地图指标 → ChinaMap metrics（单指标，外部 SelectorBar 驱动切换）
  const mapData = useMemo(() => {
    if (!mapMetric) return [];
    return [{
      key: mapMetric.key,
      label: mapMetric.label,
      valueName: mapMetric.valueName,
      max: mapMetric.max || 100,
      data: regionMapData(mapMetric.key),
    }];
  }, [mapMetric]);

  // mapName（DataV 全称）→ regionId，供点击省份联动选中
  const mapNameToId = useMemo(() => {
    const m = {};
    for (const r of regions) if (r.mapName) m[r.mapName] = r.id;
    return m;
  }, [regions]);

  // 按 group 分组（保序）
  const grouped = useMemo(() => {
    const map = {};
    for (const r of regions) {
      const g = r.group || '其他';
      (map[g] || (map[g] = [])).push(r);
    }
    const ordered = [];
    for (const g of GROUP_ORDER) if (map[g]) ordered.push([g, map[g]]);
    for (const g of Object.keys(map)) if (!GROUP_ORDER.includes(g)) ordered.push([g, map[g]]);
    return ordered;
  }, [regions]);

  function toggle(id) {
    setSelected((prev) => {
      if (prev.includes(id)) {
        const next = prev.filter((x) => x !== id);
        return next.length ? next : prev; // 至少保留一个
      }
      if (prev.length >= MAX_COMPARE) {
        // 满 3 个：替换最早选中的
        return [...prev.slice(1), id];
      }
      return [...prev, id];
    });
  }

  // 点击地图省份 → 反查 regionId → 设为唯一选中省（驱动下方单省体检）
  function onMapRegionClick(name) {
    const id = mapNameToId[name];
    if (id) setSelected([id]);
  }

  const isMulti = selected.length > 1;
  const single = !isMulti ? (regions.find((r) => r.id === selected[0]) || null) : null;

  // —— 雷达 option（多选时）——
  const radarOption = useMemo(() => {
    if (!isMulti) return null;
    const palette = compareColors();
    const indicator = metrics.map((m) => ({ name: m.label, max: 100 }));
    const matrix = compareRegions(selected); // {metricId:{regionId:value}}
    const series = selected.map((rid, i) => {
      const region = regions.find((r) => r.id === rid);
      const data = metrics.map((m) => {
        const byRegion = matrix[m.id] || {};
        return typeof byRegion[rid] === 'number' ? byRegion[rid] : 0;
      });
      const color = palette[i % palette.length];
      return {
        value: data,
        name: region?.name || rid,
        symbol: 'circle',
        symbolSize: 4,
        lineStyle: { color, width: 2 },
        itemStyle: { color },
        areaStyle: { color, opacity: 0.1 },
      };
    });
    return {
      tooltip: { trigger: 'item' },
      legend: {
        bottom: 0,
        ...LEGEND,
        textStyle: { ...LEGEND.textStyle, fontSize: 11 },
        itemHeight: 8,
        data: selected.map((rid) => regions.find((r) => r.id === rid)?.name || rid),
      },
      radar: {
        indicator,
        center: ['50%', '46%'],
        radius: '64%',
        splitNumber: 4,
        axisName: { ...LABEL, fontSize: 11 },
        axisLine: AXIS,
        splitLine: GRID_LINE,
        splitArea: { areaStyle: { color: ['transparent', GRID_LINE.lineStyle.color] } },
      },
      series: [{ type: 'radar', data: series }],
    };
  }, [isMulti, selected, regions, metrics]);

  const tally = single ? regionStressTally(single) : null;
  const lv = tally ? levelStyle(tally.level) : null;

  return (
    <Card className="os-card">
      <BandHead n="▲" title="区域下钻 · 投资环境压力" en="REGIONAL STRESS" />

      <p className="text-xs leading-relaxed mt-3 mb-4" style={{ color: 'var(--text-secondary)' }}>
        全国数据掩盖了区域分化 —— 下钻到省级，才看得见投资环境的真实约束。
        点选省份切换单省体检；最多选 <span className="mono">{MAX_COMPARE}</span> 个进入雷达对比。
      </p>

      {/* —— 全省承压热力图：指标切换 SelectorBar + ChinaMap —— */}
      {mapMetric && mapData.length > 0 && (
        <div className="mb-5">
          <div className="flex items-center justify-between gap-2 flex-wrap mb-2">
            <span className="mono text-[11px]" style={{ color: 'var(--text-tertiary)' }}>
              全省承压热力图 · {mapMetric.label}
            </span>
            <div className="flex items-center gap-1 flex-wrap">
              {mapMetrics.map((mm) => {
                const active = mm.key === mapMetricKey;
                return (
                  <button
                    key={mm.key}
                    type="button"
                    onClick={() => setMapMetricKey(mm.key)}
                    className="text-[11px] px-2 py-0.5 rounded mono transition-colors"
                    style={{
                      background: active ? 'rgba(196,78,61,0.18)' : 'var(--bg-elevated)',
                      border: `1px solid ${active ? (ECON_COLORS.cinnabar || '#c44e3d') : 'var(--border-subtle)'}`,
                      color: active ? (ECON_COLORS.cinnabar || '#c44e3d') : 'var(--text-secondary)',
                      fontWeight: active ? 600 : 400,
                      cursor: 'pointer',
                    }}
                    aria-pressed={active}
                  >
                    {mm.label}
                  </button>
                );
              })}
            </div>
          </div>
          <ChinaMap
            metrics={mapData}
            enableDrill={false}
            onRegionClick={onMapRegionClick}
            style={{ height: 460 }}
          />
          <p className="text-[11px] leading-relaxed mt-1" style={{ color: 'var(--text-tertiary)' }}>
            颜色越深 = 投资环境越承压（示意）；点击省份可联动下方单省体检。全国基准不参与地图着色。
          </p>
        </div>
      )}

      {/* —— 省份选择：按 group 分组 chip —— */}
      <div className="flex flex-col gap-2.5 mb-5">
        {grouped.map(([g, list]) => (
          <div key={g} className="flex items-center gap-2 flex-wrap">
            <span className="mono text-[10px] shrink-0 w-12" style={{ color: 'var(--text-tertiary)' }}>
              {g}
            </span>
            <div className="flex items-center gap-1.5 flex-wrap">
              {list.map((r) => {
                const active = selected.includes(r.id);
                return (
                  <button
                    key={r.id}
                    type="button"
                    onClick={() => toggle(r.id)}
                    className="text-xs px-2.5 py-1 rounded-full transition-colors"
                    style={{
                      background: active ? 'var(--chip-active-bg, rgba(201,154,78,0.16))' : 'var(--bg-elevated)',
                      border: `1px solid ${active ? (ECON_COLORS.ochre || '#c99a4e') : 'var(--border-subtle)'}`,
                      color: active ? (ECON_COLORS.ochre || '#c99a4e') : 'var(--text-secondary)',
                      fontWeight: active ? 600 : 400,
                    }}
                    aria-pressed={active}
                  >
                    {r.name}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* —— 单选：六维 Meter 列表 + 综合研判徽章 —— */}
      {single && (
        <div>
          {/* 综合研判徽章 */}
          {tally && lv && (
            <div
              className="flex items-start gap-3 rounded-md px-4 py-3 mb-4"
              style={{ background: `${lv.color}12`, borderLeft: `3px solid ${lv.color}` }}
            >
              <span className="mt-1 shrink-0"><SignalDot signal={lv.signal} /></span>
              <div className="min-w-0">
                <div className="flex items-baseline gap-2 flex-wrap">
                  <span className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
                    {single.name}
                  </span>
                  <span
                    className="text-xs px-1.5 py-0.5 rounded mono font-semibold"
                    style={{ background: `${lv.color}1f`, color: lv.color }}
                  >
                    {tally.level}
                  </span>
                  <span className="mono text-[11px]" style={{ color: 'var(--text-tertiary)' }}>
                    综合承压 {tally.avg}/100 · 红档 {tally.redCount}/{metrics.length}
                  </span>
                </div>
                <p className="text-xs leading-relaxed mt-1" style={{ color: 'var(--text-secondary)' }}>
                  {single.headline ? `${single.headline}。` : ''}{tally.text}
                </p>
              </div>
            </div>
          )}

          {/* 六维 Meter 列表 */}
          <div className="flex flex-col gap-3">
            {metrics.map((m) => {
              const cell = single.metrics ? single.metrics[m.id] : null;
              const value = cell && typeof cell.value === 'number' ? cell.value : 0;
              const sc = stressColor(cell?.stress);
              return (
                <div key={m.id} className="os-card p-3">
                  <div className="flex items-baseline justify-between gap-3 mb-1.5">
                    <div className="min-w-0">
                      <span className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
                        {m.label}
                      </span>
                      <span className="text-[10px] ml-2" style={{ color: 'var(--text-tertiary)' }}>
                        {m.desc}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className="mono text-xs" style={{ color: 'var(--text-secondary)' }}>
                        {cell?.raw || '—'}
                      </span>
                      <span
                        className="text-[10px] px-1.5 py-0.5 rounded mono font-semibold"
                        style={{ background: `${sc}1f`, color: sc }}
                      >
                        {cell?.stress || '—'}
                      </span>
                    </div>
                  </div>
                  <Meter value={value} />
                  {cell?.src && (
                    <div className="mono text-[10px] mt-1.5" style={{ color: 'var(--text-tertiary)' }}>
                      源 · {cell.src}{cell.note ? ` · ${cell.note}` : ''}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* —— 多选：雷达对比 —— */}
      {isMulti && (
        <div>
          {radarOption ? (
            <EChart option={radarOption} style={{ height: 360 }} />
          ) : (
            <p className="text-xs mono" style={{ color: 'var(--text-tertiary)' }}>// 对比数据待载</p>
          )}
          <p className="text-[11px] leading-relaxed mt-2" style={{ color: 'var(--text-tertiary)' }}>
            六维均归一为「越高越承压」的 0–100 承压分；越靠外圈，投资环境约束越重。
          </p>
        </div>
      )}

      {/* —— 数据缺失回退 —— */}
      {!single && !isMulti && (
        <p className="text-xs mono" style={{ color: 'var(--text-tertiary)' }}>// 暂无可下钻的区域数据</p>
      )}

      {/* —— 统一口径小字 —— */}
      <p className="mt-5 text-[10px] mono" style={{ color: 'var(--text-tertiary)' }}>
        {DISCLAIMER}
      </p>
    </Card>
  );
}
