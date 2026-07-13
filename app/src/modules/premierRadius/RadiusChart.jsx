import { useMemo, useState } from 'react';
import { LAYER_META } from '../../domain/governance';
import PremierAvatar from './PremierAvatar.jsx';
import {
  CURRENT_YEAR,
  TIMELINE_END,
  TIMELINE_START,
  getCoverageSegments,
  layerColor,
  yearToX,
} from './radiusLogic';

const CHART_W = 920;
const CHART_H = 280;
const MARGIN = { top: 28, right: 24, bottom: 48, left: 72 };
const BAND_H = (CHART_H - MARGIN.top - MARGIN.bottom) / 3;

const LAYER_ROWS = [
  { id: 'direction', label: '路线层' },
  { id: 'decision', label: '决策层' },
  { id: 'execution', label: '执行层' },
];

const TERM_COLORS = {
  zhu: 'rgba(207, 74, 61, 0.55)',
  wen: 'rgba(207, 154, 50, 0.5)',
  likeqiang: 'rgba(121, 164, 150, 0.45)',
  liqiang: 'rgba(79, 158, 114, 0.55)',
};

export default function RadiusChart({ terms, globalInflections, selectedId, onSelectTerm }) {
  const [hover, setHover] = useState(null);
  const [tip, setTip] = useState(null);

  const segments = useMemo(
    () => terms.flatMap((term) => getCoverageSegments(term).map((seg) => ({ term, ...seg }))),
    [terms],
  );

  const markers = useMemo(() => globalInflections, [globalInflections]);

  const years = useMemo(() => {
    const ys = [];
    for (let y = TIMELINE_START; y <= TIMELINE_END; y += 5) ys.push(y);
    if (!ys.includes(TIMELINE_END)) ys.push(TIMELINE_END);
    return ys;
  }, []);

  function bandY(layerIndex) {
    return MARGIN.top + layerIndex * BAND_H;
  }

  function handleBlockEnter(term, seg) {
    setHover(term.id);
    setTip({ term, seg });
  }

  return (
    <div className="pr-panel">
      <div className="pr-panel-ey">权限半径曲线 · 1998 — {CURRENT_YEAR}</div>
      <svg
        className="pr-chart-svg"
        viewBox={`0 0 ${CHART_W} ${CHART_H}`}
        role="img"
        aria-label="四任总理权限半径时序图"
      >
        {/* 三层带状区 */}
        {LAYER_ROWS.map((row, i) => (
          <g key={row.id}>
            <rect
              x={MARGIN.left}
              y={bandY(i)}
              width={CHART_W - MARGIN.left - MARGIN.right}
              height={BAND_H}
              fill={LAYER_META[row.id].colorBg}
              stroke="var(--pr-hair)"
              strokeWidth={0.5}
              opacity={0.85}
            />
            <text
              x={MARGIN.left - 8}
              y={bandY(i) + BAND_H / 2}
              textAnchor="end"
              dominantBaseline="middle"
              fill={LAYER_META[row.id].color}
              fontSize={11}
              fontWeight={600}
            >
              {row.label}
            </text>
          </g>
        ))}

        {/* 覆盖区块 */}
        {segments.map((seg) => {
          const x1 = yearToX(seg.start, CHART_W, MARGIN.left, MARGIN.right);
          const x2 = yearToX(seg.end, CHART_W, MARGIN.left, MARGIN.right);
          const active = selectedId === seg.term.id || hover === seg.term.id;
          return seg.radius.map((layer) => {
            const li = LAYER_ROWS.findIndex((r) => r.id === layer);
            const partial = layer === 'direction' && seg.directionPartial;
            return (
              <rect
                key={`${seg.term.id}-${seg.start}-${layer}`}
                x={x1}
                y={bandY(li) + 4}
                width={Math.max(x2 - x1, 4)}
                height={BAND_H - 8}
                fill={TERM_COLORS[seg.term.id] || layerColor(layer)}
                stroke={active ? LAYER_META[layer].color : 'transparent'}
                strokeWidth={active ? 2 : 0}
                strokeDasharray={partial ? '4 3' : undefined}
                opacity={partial ? 0.45 : active ? 0.85 : 0.65}
                rx={3}
                style={{ cursor: 'pointer' }}
                onMouseEnter={() => handleBlockEnter(seg.term, seg)}
                onMouseLeave={() => { setHover(null); setTip(null); }}
                onClick={() => onSelectTerm(seg.term.id)}
              />
            );
          });
        })}

        {/* 时间轴 */}
        <line
          x1={MARGIN.left}
          y1={CHART_H - MARGIN.bottom + 12}
          x2={CHART_W - MARGIN.right}
          y2={CHART_H - MARGIN.bottom + 12}
          stroke="var(--pr-hair)"
        />
        {years.map((y) => {
          const x = yearToX(y, CHART_W, MARGIN.left, MARGIN.right);
          return (
            <g key={y}>
              <line
                x1={x}
                y1={CHART_H - MARGIN.bottom + 8}
                x2={x}
                y2={CHART_H - MARGIN.bottom + 16}
                stroke="var(--pr-text-faint)"
              />
              <text
                x={x}
                y={CHART_H - MARGIN.bottom + 28}
                textAnchor="middle"
                fill="var(--pr-text-faint)"
                fontSize={10}
                fontFamily="var(--pr-mono)"
              >
                {y}
              </text>
            </g>
          );
        })}

        {/* 全局转折点 */}
        {markers.map((m) => {
          const x = yearToX(m.year, CHART_W, MARGIN.left, MARGIN.right);
          return (
            <g key={`${m.year}-${m.event}`}>
              <line
                x1={x}
                y1={MARGIN.top}
                x2={x}
                y2={CHART_H - MARGIN.bottom}
                stroke="var(--pr-brass)"
                strokeWidth={1}
                strokeDasharray="3 4"
                opacity={0.7}
              />
              <circle cx={x} cy={MARGIN.top - 6} r={4} fill="var(--pr-brass)" />
              <title>{`${m.year} · ${m.event}`}</title>
            </g>
          );
        })}

        {tip && (
          <text
            className="pr-tooltip"
            x={MARGIN.left + 8}
            y={MARGIN.top - 4}
            fill="var(--pr-celadon)"
          >
            {tip.term.name} ({tip.seg.start}–{tip.seg.end}) · {tip.term.radiusNote.slice(0, 36)}…
          </text>
        )}
      </svg>

      <div className="pr-legend">
        {terms.map((t) => (
          <button
            key={t.id}
            type="button"
            className={`pr-legend-item pr-legend-term${selectedId === t.id ? ' is-selected' : ''}`}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'inherit' }}
            onClick={() => onSelectTerm(t.id)}
          >
            <PremierAvatar term={t} size={24} />
            <span
              className="pr-legend-swatch"
              style={{ background: TERM_COLORS[t.id] }}
            />
            {t.name} ({t.start}–{t.end ?? '今'})
          </button>
        ))}
        <span className="pr-legend-item">
          <span className="pr-legend-swatch" style={{ background: 'var(--pr-brass)' }} />
          全局转折点
        </span>
      </div>
    </div>
  );
}
