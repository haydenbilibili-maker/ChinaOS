import { RUNWAY_CAP, buildRunwayBarData } from '../../personalChartData.ts';
import { calcRunway } from '../../../../domain/personal.ts';

const W = 440;
const H = 200;
const PAD = { top: 20, right: 16, bottom: 52, left: 16 };
const CHART_W = W - PAD.left - PAD.right;
const CHART_H = H - PAD.top - PAD.bottom;
const TARGET = 12;

export default function RunwayStressChart({ runway }) {
  const result = calcRunway(runway);
  const bars = buildRunwayBarData(result);
  if (!bars.length) return null;

  const maxMonths = RUNWAY_CAP;
  const groupW = CHART_W / bars.length;
  const barW = Math.min(48, groupW * 0.55);
  const targetX = PAD.left + (TARGET / maxMonths) * CHART_W;

  return (
    <div className="pr-chart-wrap">
      <div className="pr-chart-ey">安全垫压力情景 · 可撑月数对照</div>
      <svg
        className="pr-chart-svg"
        viewBox={`0 0 ${W} ${H}`}
        role="img"
        aria-label="现金安全垫三情景压力测试柱状图"
      >
        <line
          x1={PAD.left}
          y1={PAD.top + CHART_H}
          x2={W - PAD.right}
          y2={PAD.top + CHART_H}
          stroke="var(--hair)"
          strokeWidth={1}
        />

        <line
          x1={targetX}
          y1={PAD.top}
          x2={targetX}
          y2={PAD.top + CHART_H}
          stroke="var(--warn)"
          strokeWidth={1.5}
          strokeDasharray="5 4"
        />
        <text x={targetX + 4} y={PAD.top + 10} className="pr-chart-target-label">
          12月目标
        </text>

        {bars.map((bar, i) => {
          const cx = PAD.left + groupW * i + groupW / 2;
          const h = (bar.cappedMonths / maxMonths) * CHART_H;
          const isInf = bar.months === Infinity;
          return (
            <g key={bar.label}>
              <rect
                x={cx - barW / 2}
                y={PAD.top + CHART_H - h}
                width={barW}
                height={h}
                rx={4}
                fill={bar.color}
                opacity={isInf ? 0.55 : 0.9}
                stroke={isInf ? bar.color : 'none'}
                strokeWidth={isInf ? 1.5 : 0}
                strokeDasharray={isInf ? '4 3' : 'none'}
              />
              <text
                x={cx}
                y={PAD.top + CHART_H - h - 6}
                textAnchor="middle"
                className="pr-chart-val"
              >
                {bar.display}
              </text>
              <text
                x={cx}
                y={H - 28}
                textAnchor="middle"
                className="pr-chart-label"
              >
                {bar.label.split('·')[0].trim()}
              </text>
              <text
                x={cx}
                y={H - 14}
                textAnchor="middle"
                className="pr-chart-sublabel"
              >
                {bar.label.split('·')[1]?.trim() ?? ''}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}
