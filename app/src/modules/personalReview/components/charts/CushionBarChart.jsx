import { buildCushionBarData } from '../../personalChartData.ts';

const W = 420;
const H = 180;
const PAD = { top: 16, right: 16, bottom: 28, left: 72 };
const CHART_W = W - PAD.left - PAD.right;
const CHART_H = H - PAD.top - PAD.bottom;
const ROW_H = CHART_H / 4;

export default function CushionBarChart({ layers }) {
  const bars = buildCushionBarData(layers);
  if (!bars.length) return null;

  return (
    <div className="pr-chart-wrap">
      <div className="pr-chart-ey">四层垫子厚度 · 汇总对照</div>
      <svg
        className="pr-chart-svg"
        viewBox={`0 0 ${W} ${H}`}
        role="img"
        aria-label="个人四层垫子厚度柱状图"
      >
        {[25, 50, 75, 100].map((tick) => {
          const x = PAD.left + (tick / 100) * CHART_W;
          return (
            <g key={tick}>
              <line
                x1={x}
                y1={PAD.top}
                x2={x}
                y2={PAD.top + CHART_H}
                stroke="var(--hair-soft)"
                strokeWidth={0.5}
                strokeDasharray="2 3"
              />
              <text x={x} y={H - 8} textAnchor="middle" className="pr-chart-tick">
                {tick}
              </text>
            </g>
          );
        })}

        {bars.map((bar, i) => {
          const y = PAD.top + i * ROW_H + ROW_H * 0.2;
          const h = ROW_H * 0.6;
          const w = (bar.score / 100) * CHART_W;
          return (
            <g key={bar.name}>
              <text
                x={PAD.left - 8}
                y={y + h / 2 + 4}
                textAnchor="end"
                className="pr-chart-row-label"
              >
                {bar.name}
              </text>
              <rect
                x={PAD.left}
                y={y}
                width={CHART_W}
                height={h}
                fill="var(--ink-3)"
                stroke="var(--hair-soft)"
                rx={4}
              />
              <rect
                x={PAD.left}
                y={y}
                width={w}
                height={h}
                fill={bar.color}
                rx={4}
                opacity={0.9}
              />
              <text x={PAD.left + w + 6} y={y + h / 2 + 4} className="pr-chart-val">
                {bar.score}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}
