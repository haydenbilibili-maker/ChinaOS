import React, { useMemo } from 'react';
import { AS_OF, LAYERS, getNationalStats, getRankings } from './liveMapData.js';

const STEEL = '#22d3ee';

/**
 * 全国态势 · 六维概览条（种子数据 · 示意标定）
 */
export default function LiveMapSituationHero({ layerId, statSeries, layerLabel }) {
  const stats = useMemo(
    () => (statSeries.length ? getNationalStats(layerId, statSeries) : null),
    [layerId, statSeries],
  );
  const rankings = useMemo(
    () => getRankings(layerId, 1, statSeries),
    [layerId, statSeries],
  );

  const short = (n) => n?.replace(/(省|市|自治区|壮族|回族|维吾尔)/g, '') || '—';

  const tiles = [
    { label: '全国均值', value: stats?.avg ?? '—', sub: layerLabel, accent: true },
    { label: '最高', value: stats?.max ?? '—', sub: short(stats?.maxProv) },
    { label: '最低', value: stats?.min ?? '—', sub: short(stats?.minProv) },
    { label: '种子层', value: LAYERS.length, sub: '指标维度' },
    { label: 'Top1', value: rankings.hot[0]?.value ?? '—', sub: short(rankings.hot[0]?.name) },
    { label: '基准日', value: AS_OF.slice(5), sub: AS_OF.slice(0, 4), accent: true },
  ];

  return (
    <section className="lcm-section lcm-situation-hero os-card" aria-label="全国态势概览">
      {tiles.map((t) => (
        <div
          key={t.label}
          className={`lcm-situation-stat${t.accent ? ' lcm-situation-stat--accent' : ''}`}
        >
          <span className="lcm-situation-stat__label">{t.label}</span>
          <span className="lcm-situation-stat__value">{t.value}</span>
          {t.sub && <span className="lcm-situation-stat__sub">{t.sub}</span>}
        </div>
      ))}
      <p className="lcm-situation-disclaimer text-[10px] m-0" style={{ color: 'var(--text-tertiary)', gridColumn: '1 / -1' }}>
        示意标定 · 公开统计公报量级对齐 · 非实时官方发布 · 着色层切换见下方图层条
      </p>
    </section>
  );
}
