import React from 'react';
import * as Lucide from 'lucide-react';
import { MAP_LAYER_DEFS } from './liveMapLayers.js';
import { formatLiveTime } from './liveWeather.js';

const STEEL = '#22d3ee';

function Icon({ name, size = 14 }) {
  const Cmp = Lucide[name] || Lucide.Square;
  return <Cmp size={size} strokeWidth={1.75} style={{ color: STEEL }} />;
}

function statusTone(st) {
  if (!st) return { label: '未启用', color: 'var(--text-tertiary)' };
  if (st.loading) return { label: '拉取中…', color: STEEL };
  if (st.error) return { label: st.error, color: '#e8a317' };
  if (st.fetchedAt) {
    return {
      label: `更新 ${formatLiveTime(st.fetchedAt)}`,
      color: '#10b981',
    };
  }
  return { label: '就绪', color: '#10b981' };
}

/**
 * 信号图层 Tab · 叠加层摘要卡片
 */
export default function LiveMapSignalSummary({
  prefs,
  overlayStatuses = {},
  geoSource,
  activeMetricLabel,
}) {
  const overlays = MAP_LAYER_DEFS.filter(
    (d) => d.toggleable && (d.type === 'overlay' || d.id === 'satellite-cloud' || d.id === 'fiscal-network'),
  );

  const onCount = overlays.filter((d) => prefs[d.id]).length;

  return (
    <section className="lcm-signal-summary lcm-section" aria-label="信号图层摘要">
      <div className="lcm-section-hd">
        <Icon name="Radio" />
        <h3 className="lcm-section-hd__title">信号图层 · 叠加摘要</h3>
        <span className="lcm-section-hd__meta">{onCount} 层开启 · 着色 {activeMetricLabel}</span>
      </div>
      <div className="lcm-signal-grid">
        {overlays.map((def) => {
          const on = !!prefs[def.id];
          const st = overlayStatuses[def.id];
          const tone = on ? statusTone(st) : { label: '已关闭', color: 'var(--text-tertiary)' };
          return (
            <article
              key={def.id}
              className={`lcm-signal-card ${on ? 'is-on' : ''}`}
              style={{ borderColor: on ? 'rgba(34,211,238,0.35)' : 'var(--border-subtle)' }}
            >
              <div className="lcm-signal-card__hd">
                <Icon name={def.icon || 'Circle'} size={12} />
                <span className="lcm-signal-card__title">{def.name}</span>
                <span className="lcm-signal-card__pill mono" style={{ color: on ? STEEL : 'var(--text-tertiary)' }}>
                  {on ? 'ON' : 'OFF'}
                </span>
              </div>
              {def.desc && (
                <p className="lcm-signal-card__desc">{def.desc}</p>
              )}
              <div className="lcm-signal-card__status mono" style={{ color: tone.color }}>
                {tone.label}
              </div>
            </article>
          );
        })}
        <article className="lcm-signal-card is-on" style={{ borderColor: 'rgba(34,211,238,0.35)' }}>
          <div className="lcm-signal-card__hd">
            <Icon name="Map" size={12} />
            <span className="lcm-signal-card__title">省界底图</span>
          </div>
          <p className="lcm-signal-card__desc">本地托管优先 · DataV 仅作可选回退</p>
          <div className="lcm-signal-card__status mono" style={{ color: geoSource === 'local' ? STEEL : geoSource === 'network' ? '#10b981' : 'var(--text-tertiary)' }}>
            {geoSource === 'local' && '本地 GeoJSON'}
            {geoSource === 'proxy' && 'Worker 代理'}
            {geoSource === 'network' && 'DataV 网络'}
            {geoSource === 'cache' && '已缓存'}
            {!geoSource && '加载中…'}
          </div>
        </article>
      </div>
    </section>
  );
}
