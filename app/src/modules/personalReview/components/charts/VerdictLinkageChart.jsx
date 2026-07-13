import { buildVerdictLinkageCells } from '../../personalChartData.ts';

const W = 400;
const H = 120;
const PAD = 12;
const CELL_W = (W - PAD * 2) / 5;
const CELL_H = H - PAD * 2 - 20;

const STANCE_COLOR = {
  守成: 'var(--def)',
  备战: 'var(--warn)',
  预热: 'var(--celadon)',
  进攻: 'var(--off)',
};

export default function VerdictLinkageChart({ regime, proximityScore }) {
  const cells = buildVerdictLinkageCells(regime, proximityScore);

  return (
    <div className="pr-chart-wrap pr-chart-verdict">
      <div className="pr-chart-ey">宏观联动矩阵 · 信号灯 × 三力 → 个人仓位</div>
      <svg
        className="pr-chart-svg"
        viewBox={`0 0 ${W} ${H}`}
        role="img"
        aria-label="宏观态势与个人仓位联动矩阵"
      >
        {cells.map((cell, i) => {
          const x = PAD + i * CELL_W;
          const y = PAD;
          const color = STANCE_COLOR[cell.stance] ?? 'var(--def)';
          return (
            <g key={cell.key}>
              <rect
                x={x + 2}
                y={y}
                width={CELL_W - 4}
                height={CELL_H}
                rx={6}
                fill={cell.active ? color : 'var(--ink-3)'}
                opacity={cell.active ? 0.35 : 0.6}
                stroke={cell.active ? color : 'var(--hair-soft)'}
                strokeWidth={cell.active ? 2 : 1}
              />
              <text
                x={x + CELL_W / 2}
                y={y + CELL_H / 2 - 4}
                textAnchor="middle"
                className={`pr-chart-cell-label${cell.active ? ' active' : ''}`}
              >
                {cell.label}
              </text>
              <text
                x={x + CELL_W / 2}
                y={y + CELL_H / 2 + 12}
                textAnchor="middle"
                className={`pr-chart-cell-stance${cell.active ? ' active' : ''}`}
                fill={cell.active ? color : 'var(--io-text-faint)'}
              >
                {cell.stance}
              </text>
              {cell.active && (
                <circle
                  cx={x + CELL_W - 10}
                  cy={y + 10}
                  r={4}
                  fill={color}
                />
              )}
            </g>
          );
        })}
        <text x={W / 2} y={H - 4} textAnchor="middle" className="pr-chart-axis-h">
          防御远 → 防御迫 → 观察蓄 → 治本开
        </text>
      </svg>
    </div>
  );
}
