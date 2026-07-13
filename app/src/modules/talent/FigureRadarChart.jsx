import React, { useMemo } from 'react';
import EChart from '../../lib/viz/EChart.jsx';
import { Card } from '../../app/ui.jsx';
import {
  RADAR_DIMENSIONS,
  computeFigureRadarScores,
  computeCohortAverage,
  buildFigureRadarOption,
} from '../../lib/talent/figureRadar.js';

/**
 * 人物关系雷达 · 选中人物 + 可选对比 + 队列均值
 */
export default function FigureRadarChart({
  figure,
  compareFigure = null,
  cohortFigures = [],
  antiCorruptionNames = null,
  showCohortAvg = true,
  className = '',
}) {
  const ctx = useMemo(() => ({
    allFigures: cohortFigures,
    antiCorruptionNames,
    includeAnticorruption: !!antiCorruptionNames?.size,
  }), [cohortFigures, antiCorruptionNames]);

  const primary = useMemo(
    () => (figure ? { name: figure.name, ...computeFigureRadarScores(figure, ctx) } : null),
    [figure, ctx],
  );

  const compare = useMemo(
    () => (compareFigure ? { name: compareFigure.name, ...computeFigureRadarScores(compareFigure, ctx) } : null),
    [compareFigure, ctx],
  );

  const cohortAvg = useMemo(() => {
    if (!showCohortAvg || !cohortFigures?.length) return null;
    const rows = cohortFigures.map((f) => computeFigureRadarScores(f, ctx).scores);
    return computeCohortAverage(rows);
  }, [showCohortAvg, cohortFigures, ctx]);

  const chartOption = useMemo(
    () => buildFigureRadarOption({
      primary,
      compare,
      cohortAvg,
      includeAnticorruption: ctx.includeAnticorruption,
    }),
    [primary, compare, cohortAvg, ctx.includeAnticorruption],
  );

  if (!figure) {
    return (
      <Card title="人物画像 · 关系雷达" className={className}>
        <p className="text-sm py-8 text-center mono" style={{ color: 'var(--text-tertiary)' }}>
          // 从左侧列表选择人物以生成六维雷达
        </p>
      </Card>
    );
  }

  const dims = RADAR_DIMENSIONS.filter(
    (d) => ctx.includeAnticorruption || d.key !== 'anticorruption',
  );

  return (
    <div className={`space-y-4 ${className}`.trim()}>
      <Card title={`${figure.name} · 人物画像`}>
        <p className="text-[11px] mono mb-3" style={{ color: 'var(--text-tertiary)' }}>
          // 六维启发式评分（0–100）· 人物关系含同乡/同省/机构共现推断 · 非真人评价
        </p>
        <EChart option={chartOption} style={{ height: 300 }} />
        {primary?.relationGraph?.length > 0 && (
          <div className="mt-3 pt-3" style={{ borderTop: '1px solid var(--border-subtle)' }}>
            <div className="text-[10px] mono mb-2" style={{ color: 'var(--text-tertiary)' }}>关系纽带 Top</div>
            <div className="flex flex-wrap gap-1.5">
              {primary.relationGraph.slice(0, 8).map((n) => (
                <span
                  key={n.name}
                  className="text-[10px] mono px-2 py-0.5 rounded"
                  style={{ background: 'var(--bg-elevated)', color: 'var(--text-secondary)' }}
                  title={n.links.join('、')}
                >
                  {n.name}
                  <span style={{ color: 'var(--cyber-cyan)' }}> ·{n.weight}</span>
                </span>
              ))}
            </div>
          </div>
        )}
      </Card>

      <div className="grid gap-3" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))' }}>
        {dims.map((d) => {
          const b = primary?.breakdown?.[d.key];
          if (!b) return null;
          return (
            <div
              key={d.key}
              className="os-card p-3 rounded"
              style={{ borderLeft: `3px solid ${d.color}` }}
            >
              <div className="flex justify-between items-baseline mb-1">
                <span className="text-[11px] font-semibold" style={{ color: d.color }}>{d.label}</span>
                <span className="text-lg font-bold mono" style={{ color: 'var(--text-primary)' }}>{b.score}</span>
              </div>
              <p className="text-[10px] leading-relaxed" style={{ color: 'var(--text-tertiary)' }}>{b.rationale}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
