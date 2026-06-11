import React, { useEffect, useMemo, useRef } from 'react';
import { Link } from 'react-router-dom';
import * as Lucide from 'lucide-react';
import * as echarts from 'echarts';
import {
  getProvinceByName,
  getProvinceModuleLink,
  getProvinceRadar,
  RADAR_DIMS,
  LAYER_TOOLTIP_FIELDS,
  getLayerById,
} from './liveMapData.js';
import { getProvinceHistory, MONTH_LABELS } from './liveMapHistory.js';
import { CHART_TOOLTIP, chartTextColor } from '../shared/chartHelpers.js';

const STEEL = '#22d3ee';

function shortName(name) {
  return name.replace(/(省|市|自治区|壮族|回族|维吾尔)/g, '');
}

function CompareRow({ name, layerId }) {
  const p = getProvinceByName(name);
  const m = p?.[layerId] || p?.composite;
  const fields = LAYER_TOOLTIP_FIELDS[layerId] || [];
  return (
    <div className="flex-1 min-w-0 rounded-lg p-3" style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-subtle)' }}>
      <div className="text-sm font-semibold mb-2" style={{ color: STEEL }}>{shortName(name)}</div>
      <div className="text-2xl font-bold mono mb-2" style={{ color: 'var(--text-primary)' }}>{m?.value ?? '—'}</div>
      <ul className="space-y-1 text-[10px]" style={{ color: 'var(--text-tertiary)' }}>
        {fields.slice(0, 3).map((f) => (
          <li key={f.key} className="flex justify-between gap-2">
            <span>{f.label}</span>
            <span className="mono" style={{ color: 'var(--text-secondary)' }}>{m?.[f.key] != null ? f.fmt(m[f.key]) : '—'}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function ProvinceDetailDrawer({
  provinceName,
  layerId,
  compareNames = [],
  onClose,
  onToggleCompare,
  theme,
}) {
  const radarRef = useRef(null);
  const sparkRef = useRef(null);
  const radarChart = useRef(null);
  const sparkChart = useRef(null);

  const province = useMemo(() => getProvinceByName(provinceName), [provinceName]);
  const layer = getLayerById(layerId);
  const metrics = province?.[layerId] || province?.composite;
  const moduleLink = provinceName ? getProvinceModuleLink(provinceName) : null;
  const fields = LAYER_TOOLTIP_FIELDS[layerId] || [];
  const history = useMemo(
    () => (provinceName ? getProvinceHistory(provinceName, layerId) : []),
    [provinceName, layerId],
  );
  const radarVals = useMemo(
    () => (provinceName ? getProvinceRadar(provinceName) : []),
    [provinceName],
  );

  useEffect(() => {
    if (!radarRef.current || !provinceName) return undefined;
    const chart = echarts.init(radarRef.current, null, { renderer: 'canvas' });
    radarChart.current = chart;
    const ro = new ResizeObserver(() => chart.resize());
    ro.observe(radarRef.current);
    return () => { ro.disconnect(); chart.dispose(); radarChart.current = null; };
  }, [provinceName]);

  useEffect(() => {
    if (!sparkRef.current || !provinceName) return undefined;
    const chart = echarts.init(sparkRef.current, null, { renderer: 'canvas' });
    sparkChart.current = chart;
    const ro = new ResizeObserver(() => chart.resize());
    ro.observe(sparkRef.current);
    return () => { ro.disconnect(); chart.dispose(); sparkChart.current = null; };
  }, [provinceName, layerId]);

  useEffect(() => {
    const chart = radarChart.current;
    if (!chart || !radarVals.length) return;
    const isDark = theme !== 'light';
    chart.setOption({
      backgroundColor: 'transparent',
      radar: {
        indicator: RADAR_DIMS.map((d) => ({ name: d.label, max: 100 })),
        radius: '62%',
        splitNumber: 4,
        axisName: { color: chartTextColor(), fontSize: 9 },
        splitLine: { lineStyle: { color: isDark ? 'rgba(148,163,184,0.15)' : 'rgba(58,70,89,0.12)' } },
        splitArea: { show: false },
        axisLine: { lineStyle: { color: isDark ? 'rgba(148,163,184,0.2)' : 'rgba(58,70,89,0.15)' } },
      },
      series: [{
        type: 'radar',
        data: [{ value: radarVals, name: shortName(provinceName), areaStyle: { color: 'rgba(34,211,238,0.25)' }, lineStyle: { color: STEEL, width: 2 }, itemStyle: { color: STEEL } }],
      }],
    }, true);
  }, [radarVals, provinceName, theme]);

  useEffect(() => {
    const chart = sparkChart.current;
    if (!chart || !history.length) return;
    chart.setOption({
      backgroundColor: 'transparent',
      grid: { left: 4, right: 4, top: 8, bottom: 4 },
      xAxis: { type: 'category', data: MONTH_LABELS.map((m) => m.slice(5)), show: false },
      yAxis: { type: 'value', show: false, min: 'dataMin', max: 'dataMax' },
      tooltip: { trigger: 'axis', ...CHART_TOOLTIP },
      series: [{
        type: 'line',
        data: history,
        smooth: true,
        symbol: 'none',
        lineStyle: { color: STEEL, width: 2 },
        areaStyle: { color: 'rgba(34,211,238,0.12)' },
      }],
    }, true);
  }, [history, layerId]);

  if (!provinceName) return null;

  const inCompare = compareNames.includes(provinceName);

  return (
    <div
      className="live-map-drawer lcm-drawer-in absolute inset-y-0 right-0 z-20 flex flex-col w-full sm:w-80 lg:w-96 overflow-hidden"
      style={{
        background: 'var(--bg-base)',
        borderLeft: '1px solid var(--border-subtle)',
        boxShadow: '-8px 0 24px -8px rgba(0,0,0,0.25)',
        animation: 'os-fade-in 0.25s ease both',
      }}
    >
      <div className="flex items-center justify-between gap-3 px-4 py-3 border-b" style={{ borderColor: 'var(--border-subtle)' }}>
        <div>
          <h3 className="text-sm font-semibold m-0" style={{ color: 'var(--text-primary)' }}>{provinceName}</h3>
          <p className="text-[10px] m-0 mt-0.5" style={{ color: 'var(--text-tertiary)' }}>{layer.label} · {layer.valueName}</p>
        </div>
        <button type="button" onClick={onClose} className="p-1.5 rounded" style={{ color: 'var(--text-tertiary)' }} aria-label="关闭">
          <Lucide.X size={16} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-3 space-y-4">
        <div className="flex items-baseline gap-2">
          <span className="text-3xl font-bold mono" style={{ color: STEEL }}>{metrics?.value ?? '—'}</span>
          {layer.unit && <span className="text-xs" style={{ color: 'var(--text-tertiary)' }}>{layer.unit}</span>}
        </div>

        <ul className="grid grid-cols-2 gap-2 text-[10px]">
          {fields.map((f) => (
            <li key={f.key} className="rounded px-2 py-1.5" style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-subtle)' }}>
              <div style={{ color: 'var(--text-tertiary)' }}>{f.label}</div>
              <div className="mono font-medium mt-0.5" style={{ color: 'var(--text-primary)' }}>
                {metrics?.[f.key] != null ? f.fmt(metrics[f.key]) : '—'}
              </div>
            </li>
          ))}
        </ul>

        <div>
          <div className="text-[10px] mono mb-1" style={{ color: 'var(--text-tertiary)' }}>多维雷达</div>
          <div ref={radarRef} style={{ height: 180, width: '100%' }} />
        </div>

        <div>
          <div className="text-[10px] mono mb-1" style={{ color: 'var(--text-tertiary)' }}>12 月走势 · {layer.label}</div>
          <div ref={sparkRef} style={{ height: 72, width: '100%' }} />
        </div>

        {compareNames.length >= 2 && (
          <div>
            <div className="text-[10px] mono mb-2" style={{ color: 'var(--text-tertiary)' }}>对比模式</div>
            <div className="flex gap-2">
              {compareNames.map((n) => <CompareRow key={n} name={n} layerId={layerId} />)}
            </div>
          </div>
        )}

        <div className="flex flex-wrap gap-2 pt-1">
          <button
            type="button"
            onClick={() => onToggleCompare?.(provinceName)}
            className="text-[10px] mono px-2 py-1 rounded"
            style={{
              background: inCompare ? 'rgba(34,211,238,0.18)' : 'var(--bg-elevated)',
              border: `1px solid ${inCompare ? 'rgba(34,211,238,0.45)' : 'var(--border-subtle)'}`,
              color: inCompare ? STEEL : 'var(--text-secondary)',
            }}
          >
            {inCompare ? '移出对比' : '加入对比'}
          </button>
          {moduleLink && (
            <Link
              to={moduleLink.to}
              className="text-[10px] mono px-2 py-1 rounded inline-flex items-center gap-1"
              style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-subtle)', color: STEEL }}
            >
              {moduleLink.label} <Lucide.ArrowUpRight size={10} />
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
