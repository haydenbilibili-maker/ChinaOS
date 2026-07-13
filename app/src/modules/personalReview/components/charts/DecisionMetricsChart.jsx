import { buildDecisionMetricBars } from '../../personalChartData.ts';

const W = 420;
const H = 160;
const PAD = { top: 18, right: 12, bottom: 36, left: 42 };
const CHART_W = W - PAD.left - PAD.right;
const CHART_H = H - PAD.top - PAD.bottom;

export default function DecisionMetricsChart({ decisions }) {
  const bars = buildDecisionMetricBars(decisions);
  if (!bars.length) return null;

  const maxPayback = Math.max(...bars.map((b) => b.paybackMonths), 1);
  const maxRoi = Math.max(...bars.map((b) => b.roiPercent), 1);
  const groupW = CHART_W / bars.length;
  const barW = Math.min(22, groupW * 0.28);

  return (
    <div className="pr-chart-wrap">
      <div className="pr-chart-ey">决策指标对照 · 回收期 / 回报率</div>
      <svg
        className="pr-chart-svg"
        viewBox={`0 0 ${W} ${H}`}
        role="img"
        aria-label="三笔决策回收期与回报率柱状图"
      >
        {[0, 0.5, 1].map((t) => {
          const y = PAD.top + CHART_H * (1 - t);
          return (
            <line
              key={t}
              x1={PAD.left}
              y1={y}
              x2={W - PAD.right}
              y2={y}
              stroke="var(--hair-soft)"
              strokeWidth={0.5}
              strokeDasharray={t === 0 ? 'none' : '3 3'}
            />
          );
        })}

        {bars.map((bar, i) => {
          const cx = PAD.left + groupW * i + groupW / 2;
          const payH = (bar.paybackMonths / maxPayback) * CHART_H;
          const roiH = (bar.roiPercent / maxRoi) * CHART_H;
          const payX = cx - barW - 3;
          const roiX = cx + 3;

          return (
            <g key={bar.id}>
              <rect
                x={payX}
                y={PAD.top + CHART_H - payH}
                width={barW}
                height={payH}
                rx={3}
                fill={bar.color}
                opacity={0.85}
              />
              <rect
                x={roiX}
                y={PAD.top + CHART_H - roiH}
                width={barW}
                height={roiH}
                rx={3}
                fill={bar.color}
                opacity={0.45}
              />
              <text
                x={cx}
                y={H - 10}
                textAnchor="middle"
                className="pr-chart-label"
              >
                {bar.shortName}
              </text>
              <text
                x={payX + barW / 2}
                y={PAD.top + CHART_H - payH - 4}
                textAnchor="middle"
                className="pr-chart-val"
              >
                {bar.paybackLabel}
              </text>
              <text
                x={roiX + barW / 2}
                y={PAD.top + CHART_H - roiH - 4}
                textAnchor="middle"
                className="pr-chart-val"
              >
                {bar.roiLabel}
              </text>
            </g>
          );
        })}

        <text x={PAD.left - 6} y={PAD.top + 4} textAnchor="end" className="pr-chart-axis">
          高
        </text>
        <text x={8} y={PAD.top + CHART_H / 2 + 3} className="pr-chart-legend">
          <tspan fill="currentColor" opacity={0.85}>■</tspan>
          <tspan dx={4}>回收期</tspan>
          <tspan dx={10} opacity={0.45}>■</tspan>
          <tspan dx={4}>回报率</tspan>
        </text>
      </svg>
    </div>
  );
}
