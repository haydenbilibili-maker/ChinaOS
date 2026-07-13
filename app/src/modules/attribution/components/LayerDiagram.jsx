import { LAYER_META, POWER_LAYERS } from '../../../domain/governance.ts';
import { computeLayerStats } from '../stats.ts';

const BAND_HEIGHT = 72;
const GAP = 8;
const WIDTH = 640;
const PAD = 24;

export default function LayerDiagram({ issues }) {
  const stats = computeLayerStats(issues);
  const totalH = POWER_LAYERS.length * BAND_HEIGHT + (POWER_LAYERS.length - 1) * GAP + PAD * 2;

  return (
    <div className="aa-diagram-wrap">
      <svg
        viewBox={`0 0 ${WIDTH} ${totalH}`}
        className="aa-diagram-svg"
        role="img"
        aria-label="三层权力归因分层图"
      >
        <defs>
          <linearGradient id="aa-band-dir" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#2a1513" />
            <stop offset="100%" stopColor="#cf4a3d" stopOpacity="0.35" />
          </linearGradient>
          <linearGradient id="aa-band-dec" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#29200f" />
            <stop offset="100%" stopColor="#cf9a32" stopOpacity="0.35" />
          </linearGradient>
          <linearGradient id="aa-band-exe" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#11241a" />
            <stop offset="100%" stopColor="#4f9e72" stopOpacity="0.35" />
          </linearGradient>
        </defs>

        {POWER_LAYERS.map((layer, idx) => {
          const meta = LAYER_META[layer];
          const count = stats[layer];
          const y = PAD + idx * (BAND_HEIGHT + GAP);
          const fillId = layer === 'direction' ? 'aa-band-dir' : layer === 'decision' ? 'aa-band-dec' : 'aa-band-exe';
          const barW = stats.total > 0 ? (count / stats.total) * (WIDTH - PAD * 2 - 120) : 0;

          return (
            <g key={layer}>
              <rect
                x={PAD}
                y={y}
                width={WIDTH - PAD * 2}
                height={BAND_HEIGHT}
                rx={8}
                fill={`url(#${fillId})`}
                stroke={meta.color}
                strokeOpacity={0.45}
                strokeWidth={1}
              />
              <text x={PAD + 12} y={y + 22} fill={meta.color} fontSize={13} fontWeight={600}>
                {meta.label}
              </text>
              <text x={PAD + 12} y={y + 40} fill="var(--aa-text-dim, #93a6a4)" fontSize={10}>
                {meta.description.slice(0, 36)}…
              </text>
              <text x={WIDTH - PAD - 12} y={y + 28} fill={meta.color} fontSize={22} fontWeight={700} textAnchor="end">
                {count}
              </text>
              <text x={WIDTH - PAD - 12} y={y + 44} fill="var(--aa-text-faint, #5f7370)" fontSize={9} textAnchor="end">
                {stats.total > 0 ? `${Math.round(stats.ratios[layer] * 100)}%` : '0%'}
              </text>
              {barW > 0 && (
                <rect
                  x={PAD + 120}
                  y={y + BAND_HEIGHT - 14}
                  width={barW}
                  height={6}
                  rx={3}
                  fill={meta.color}
                  opacity={0.85}
                />
              )}
            </g>
          );
        })}
      </svg>

      <p className="aa-diagnostic">{stats.diagnosticConclusion}</p>

      <div className="aa-split-index">
        <div className="aa-split-head">
          <span>分裂指数</span>
          <span className="aa-split-val" data-sign={stats.splitIndex >= 0 ? 'pos' : 'neg'}>
            {stats.splitIndex >= 0 ? '+' : ''}{(stats.splitIndex * 100).toFixed(0)} bp
          </span>
        </div>
        <p className="aa-split-desc">微观执行精细度 vs 宏观结构僵持度 · 正值表示结构层议题占优</p>
        <div className="aa-split-bars">
          <div className="aa-split-bar">
            <span className="aa-split-label">结构层</span>
            <div className="aa-split-track">
              <div
                className="aa-split-fill structure"
                style={{ width: `${stats.structureRatio * 100}%` }}
              />
            </div>
            <span className="aa-split-pct">{Math.round(stats.structureRatio * 100)}%</span>
          </div>
          <div className="aa-split-bar">
            <span className="aa-split-label">执行层</span>
            <div className="aa-split-track">
              <div
                className="aa-split-fill execution"
                style={{ width: `${stats.executionRatio * 100}%` }}
              />
            </div>
            <span className="aa-split-pct">{Math.round(stats.executionRatio * 100)}%</span>
          </div>
        </div>
      </div>
    </div>
  );
}
