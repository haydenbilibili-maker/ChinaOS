import React, { useMemo } from 'react';
import * as Lucide from 'lucide-react';
import { MAP_LAYER_DEFS } from './liveMapLayers.js';
import {
  MIN_SATELLITE_OPACITY, MAX_SATELLITE_OPACITY, DEFAULT_SATELLITE_OPACITY,
} from './liveSatellite.js';

const STEEL = '#22d3ee';

function Icon({ name, size = 12 }) {
  const Cmp = Lucide[name] || Lucide.Square;
  return <Cmp size={size} strokeWidth={1.75} />;
}

const SOURCE_LABEL = {
  network: '网络 API',
  proxy: 'Worker 代理',
  local: '本地 GeoJSON',
  cache: '已缓存',
};

/**
 * 神州活图 · 图层控制面板（ink-observatory 风格）
 */
export default function LiveMapLayerPanel({
  prefs,
  onToggle,
  geoSource,
  activeMetricLabel,
  fiscalActive,
  fiscalMeta,
  overlayStatuses = {},
  compact = false,
  satelliteOpacity = DEFAULT_SATELLITE_OPACITY,
  onSatelliteOpacityChange,
}) {
  const toggleable = useMemo(
    () => MAP_LAYER_DEFS.filter((d) => d.toggleable),
    [],
  );

  const visibleCount = toggleable.filter((d) => prefs[d.id]).length;

  return (
    <aside className="live-map-layer-panel ink-observatory lcm-layer-panel">
      <div className="lcm-layer-panel-hd">
        <Icon name="Layers" size={14} style={{ color: STEEL }} />
        <span className="lcm-layer-panel-title">图层控制</span>
        <span className="lcm-layer-panel-badge mono">{visibleCount}/{toggleable.length} 开</span>
      </div>

      {geoSource && (
        <div className="lcm-layer-geo-status mono text-[10px]">
          <span style={{ color: 'var(--text-tertiary)' }}>底图边界</span>
          <span className="lcm-layer-geo-pill" style={{ color: geoSource === 'network' ? '#10b981' : STEEL }}>
            {SOURCE_LABEL[geoSource] || geoSource}
          </span>
        </div>
      )}

      <ul className="lcm-layer-list">
        {toggleable.map((def) => {
          const on = !!prefs[def.id];
          const isFiscal = def.id === 'fiscal-network';
          const isSatellite = def.id === 'satellite-cloud';
          return (
            <li key={def.id} className={`lcm-layer-row ${on ? 'is-on' : ''}`}>
              <label className="lcm-layer-toggle">
                <input
                  type="checkbox"
                  checked={on}
                  onChange={() => onToggle(def.id)}
                  style={{ accentColor: STEEL }}
                />
                <Icon name={def.icon || 'Circle'} size={11} />
                <span className="lcm-layer-name">{def.name}</span>
              </label>
              {def.legend && on && (
                <span className="lcm-layer-legend mono">{def.legend}</span>
              )}
              {isFiscal && on && fiscalMeta && (
                <span className="lcm-layer-meta mono">
                  {fiscalMeta.year} · {fiscalActive ? '着色中' : '叠加'} · {fiscalMeta.sourceNote || '网络'}
                </span>
              )}
              {on && overlayStatuses[def.id] && (() => {
                const st = overlayStatuses[def.id];
                if (st.loading) {
                  return <span className="lcm-layer-meta mono" style={{ color: STEEL }}>拉取中…</span>;
                }
                if (st.error) {
                  return <span className="lcm-layer-meta mono" style={{ color: '#e8a317' }}>{st.error}</span>;
                }
                if (st.fetchedAt) {
                  const t = st.fetchedAt instanceof Date
                    ? st.fetchedAt.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })
                    : '--:--';
                  return <span className="lcm-layer-meta mono" style={{ color: '#10b981' }}>更新 {t}</span>;
                }
                return null;
              })()}
              {isSatellite && on && onSatelliteOpacityChange && (
                <label className="lcm-layer-opacity mono flex items-center gap-2 mt-1">
                  <span style={{ color: 'var(--text-tertiary)', fontSize: 10 }}>透明度</span>
                  <input
                    type="range"
                    min={MIN_SATELLITE_OPACITY}
                    max={MAX_SATELLITE_OPACITY}
                    step={0.05}
                    value={satelliteOpacity}
                    onChange={(e) => onSatelliteOpacityChange(parseFloat(e.target.value))}
                    style={{ flex: 1, accentColor: STEEL }}
                  />
                  <span style={{ color: STEEL, fontSize: 10 }}>{Math.round(satelliteOpacity * 100)}%</span>
                </label>
              )}
              {!compact && def.desc && (
                <p className="lcm-layer-desc">{def.desc}</p>
              )}
            </li>
          );
        })}
      </ul>

      <div className="lcm-layer-metric mono text-[10px]">
        <span style={{ color: 'var(--text-tertiary)' }}>当前着色</span>
        <span style={{ color: STEEL }}>{activeMetricLabel}</span>
      </div>
    </aside>
  );
}
