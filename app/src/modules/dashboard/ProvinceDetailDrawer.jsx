import React, { useEffect, useMemo, useRef } from 'react';
import { Link } from 'react-router-dom';
import * as Lucide from 'lucide-react';
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
  sheet = false,
}) {
  const radarRef = useRef(null);
  const sparkRef = useRef(null);
  const radarChart = useRef(null);
  const sparkChart = useRef(null);
  const closeRef = useRef(null);

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
    closeRef.current?.focus();
  }, [provinceName]);

  useEffect(() => {
    if (!radarRef.current || !provinceName) return undefined;
    let alive = true;
    let chart = null;
    let ro = null;
    import('echarts').then((echarts) => {
      if (!alive || !radarRef.current) return;
      chart = echarts.init(radarRef.current, null, { renderer: 'canvas' });
      radarChart.current = chart;
      ro = new ResizeObserver(() => chart?.resize());
      ro.observe(radarRef.current);
    });
    return () => {
      alive = false;
      ro?.disconnect();
      chart?.dispose();
      radarChart.current = null;
    };
  }, [provinceName]);

  useEffect(() => {
    if (!sparkRef.current || !provinceName) return undefined;
    let alive = true;
    let chart = null;
    let ro = null;
    import('echarts').then((echarts) => {
      if (!alive || !sparkRef.current) return;
      chart = echarts.init(sparkRef.current, null, { renderer: 'canvas' });
      sparkChart.current = chart;
      ro = new ResizeObserver(() => chart?.resize());
      ro.observe(sparkRef.current);
    });
    return () => {
      alive = false;
      ro?.disconnect();
      chart?.dispose();
      sparkChart.current = null;
    };
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
      className={`live-map-drawer lcm-drawer-in lcm-province-drawer absolute inset-y-0 right-0 z-20 flex flex-col w-full sm:w-80 lg:w-96 overflow-hidden${sheet ? ' lcm-province-drawer--sheet' : ''}`}
      role="dialog"
      aria-modal="true"
      aria-labelledby="lcm-drawer-title"
    >
      <header className="lcm-province-drawer__head">
        <div>
          <h3 id="lcm-drawer-title" className="lcm-province-drawer__title">{provinceName}</h3>
          <p className="lcm-province-drawer__sub">{layer.label} · {layer.valueName} · 示意种子</p>
        </div>
        <button
          ref={closeRef}
          type="button"
          onClick={onClose}
          className="lcm-province-drawer__close"
          aria-label="关闭省份详情"
        >
          <Lucide.X size={16} />
        </button>
      </header>

      <div className="lcm-province-drawer__hero">
        <span className="lcm-province-drawer__hero-val">{metrics?.value ?? '—'}</span>
        {layer.unit && <span className="lcm-province-drawer__hero-unit">{layer.unit}</span>}
      </div>

      <div className="lcm-province-drawer__body">
        <ul className="lcm-province-drawer__grid">
          {fields.map((f) => (
            <li key={f.key}>
              <span className="lcm-province-drawer__k">{f.label}</span>
              <span className="lcm-province-drawer__v">
                {metrics?.[f.key] != null ? f.fmt(metrics[f.key]) : '—'}
              </span>
            </li>
          ))}
        </ul>

        <div className="mb-4">
          <div className="text-[10px] mono mb-1" style={{ color: 'var(--text-tertiary)' }}>多维雷达 · 六维示意</div>
          <div ref={radarRef} style={{ height: 180, width: '100%' }} />
        </div>

        <div className="mb-4">
          <div className="text-[10px] mono mb-1" style={{ color: 'var(--text-tertiary)' }}>12 月走势 · {layer.label}</div>
          <div ref={sparkRef} style={{ height: 72, width: '100%' }} />
        </div>

        {compareNames.length >= 2 && (
          <div className="mb-4">
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
            className="text-[10px] mono px-2 py-1 rounded lcm-chip"
            style={{
              background: inCompare ? 'rgba(34,211,238,0.18)' : 'var(--bg-elevated)',
              border: `1px solid ${inCompare ? 'rgba(34,211,238,0.45)' : 'var(--border-subtle)'}`,
              color: inCompare ? STEEL : 'var(--text-secondary)',
            }}
          >
            {inCompare ? '移出对比' : '加入对比'}
          </button>
          {moduleLink && (
            <Link to={moduleLink.to} className="lcm-province-drawer__cta">
              {moduleLink.label} <Lucide.ArrowUpRight size={10} />
            </Link>
          )}
          <Link
            to={`/shenzhou-live?prov=${encodeURIComponent(provinceName)}&layer=${encodeURIComponent(layerId)}`}
            className="lcm-province-drawer__cta"
            style={{ borderColor: 'rgba(34,211,238,0.35)', color: STEEL, background: 'rgba(34,211,238,0.08)' }}
          >
            分享活图深链 ↗
          </Link>
          <Link to="/modules/heshan/factsheets" className="lcm-province-drawer__cta" style={{ borderColor: 'rgba(196,30,58,0.35)', color: 'var(--china-red, #c41e3a)', background: 'rgba(196,30,58,0.08)' }}>
            重构河山 ↗
          </Link>
        </div>
      </div>
    </div>
  );
}
