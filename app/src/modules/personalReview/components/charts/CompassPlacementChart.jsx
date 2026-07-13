import { buildCompassDots } from '../../personalChartData.ts';

const W = 360;
const H = 280;
const PAD = 28;
const GRID = W - PAD * 2;

const QUADRANT_LABELS = [
  { x: 0.25, y: 0.12, text: '锚定型' },
  { x: 0.75, y: 0.12, text: '生产型 ★' },
  { x: 0.25, y: 0.88, text: '价值陷阱' },
  { x: 0.75, y: 0.88, text: '待兑现' },
];

export default function CompassPlacementChart({ decisions }) {
  const dots = buildCompassDots(decisions);
  if (!dots.length) return null;

  return (
    <div className="pr-chart-wrap pr-chart-compass">
      <div className="pr-chart-ey">罗盘落点 · 可迁移性 × 现金流</div>
      <svg
        className="pr-chart-svg"
        viewBox={`0 0 ${W} ${H}`}
        role="img"
        aria-label="决策罗盘二维落点图"
      >
        <rect
          x={PAD}
          y={PAD}
          width={GRID}
          height={GRID}
          fill="var(--ink-3)"
          stroke="var(--hair)"
          rx={8}
        />
        <line
          x1={PAD + GRID / 2}
          y1={PAD}
          x2={PAD + GRID / 2}
          y2={PAD + GRID}
          stroke="var(--hair-soft)"
          strokeWidth={1}
          strokeDasharray="4 4"
        />
        <line
          x1={PAD}
          y1={PAD + GRID / 2}
          x2={PAD + GRID}
          y2={PAD + GRID / 2}
          stroke="var(--hair-soft)"
          strokeWidth={1}
          strokeDasharray="4 4"
        />

        <rect
          x={PAD}
          y={PAD}
          width={GRID / 2}
          height={GRID / 2}
          fill="var(--off-bg)"
          opacity={0.35}
          rx={8}
        />
        <rect
          x={PAD + GRID / 2}
          y={PAD}
          width={GRID / 2}
          height={GRID / 2}
          fill="var(--off-bg)"
          opacity={0.55}
          rx={8}
        />
        <rect
          x={PAD}
          y={PAD + GRID / 2}
          width={GRID / 2}
          height={GRID / 2}
          fill="var(--risk-bg)"
          opacity={0.35}
          rx={8}
        />

        {QUADRANT_LABELS.map((lbl) => (
          <text
            key={lbl.text}
            x={PAD + GRID * lbl.x}
            y={PAD + GRID * lbl.y}
            textAnchor="middle"
            className="pr-chart-quad-label"
          >
            {lbl.text}
          </text>
        ))}

        <text x={PAD + GRID / 2} y={14} textAnchor="middle" className="pr-chart-axis-h">
          不可迁移 ← → 可迁移
        </text>
        <text
          x={12}
          y={PAD + GRID / 2}
          textAnchor="middle"
          className="pr-chart-axis-v"
          transform={`rotate(-90 12 ${PAD + GRID / 2})`}
        >
          有现金流 ↑ 无现金流
        </text>

        {dots.map((dot) => {
          const cx = PAD + GRID * dot.x;
          const cy = PAD + GRID * dot.y;
          return (
            <g key={dot.id}>
              <circle
                cx={cx}
                cy={cy}
                r={dot.size}
                fill={dot.color}
                stroke="var(--io-text)"
                strokeWidth={1}
                opacity={0.9}
              />
              <text x={cx} y={cy + dot.size + 12} textAnchor="middle" className="pr-chart-dot-label">
                {dot.name.split('（')[0]}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}
