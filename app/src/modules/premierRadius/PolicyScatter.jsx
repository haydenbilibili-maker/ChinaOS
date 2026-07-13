import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ATTRIBUTION_ROUTE } from '../../domain/governance';
import { LAYER_META } from '../../domain/governance';
import {
  collectPolicyPoints,
  layerColor,
  layerLabel,
  yearToX,
} from './radiusLogic';

const CHART_W = 920;
const CHART_H = 220;
const MARGIN = { top: 20, right: 24, bottom: 40, left: 72 };
const BAND_H = (CHART_H - MARGIN.top - MARGIN.bottom) / 3;

const LAYER_ROWS = ['direction', 'decision', 'execution'];

export default function PolicyScatter({ terms, onPolicyClick }) {
  const navigate = useNavigate();
  const [hoverId, setHoverId] = useState(null);
  const points = useMemo(() => collectPolicyPoints(terms), [terms]);

  function bandY(layerIndex) {
    return MARGIN.top + layerIndex * BAND_H + BAND_H / 2;
  }

  function handleClick(point) {
    if (point.issueId) {
      if (onPolicyClick) onPolicyClick(point);
      navigate(`${ATTRIBUTION_ROUTE}?issue=${encodeURIComponent(point.issueId)}`);
    }
  }

  return (
    <div className="pr-panel">
      <div className="pr-panel-ey">代表作分层散点</div>
      <p style={{ fontSize: 13, color: 'var(--pr-text-dim)', margin: '0 0 12px' }}>
        政策点按（年份, 层级）分布——朱镕基密集于决策/路线边缘，李强全部压在执行层。点击可跳转三层归因分析器。
      </p>
      <svg
        className="pr-chart-svg"
        viewBox={`0 0 ${CHART_W} ${CHART_H}`}
        role="img"
        aria-label="代表作分层散点图"
      >
        {LAYER_ROWS.map((layer, i) => (
          <g key={layer}>
            <rect
              x={MARGIN.left}
              y={MARGIN.top + i * BAND_H}
              width={CHART_W - MARGIN.left - MARGIN.right}
              height={BAND_H}
              fill={LAYER_META[layer].colorBg}
              opacity={0.5}
            />
            <text
              x={MARGIN.left - 8}
              y={bandY(i)}
              textAnchor="end"
              dominantBaseline="middle"
              fill={LAYER_META[layer].color}
              fontSize={10}
            >
              {layerLabel(layer)}
            </text>
          </g>
        ))}

        <line
          x1={MARGIN.left}
          y1={CHART_H - MARGIN.bottom}
          x2={CHART_W - MARGIN.right}
          y2={CHART_H - MARGIN.bottom}
          stroke="var(--pr-hair)"
        />

        {points.map((p, idx) => {
          const li = LAYER_ROWS.indexOf(p.layer);
          const x = yearToX(p.year, CHART_W, MARGIN.left, MARGIN.right);
          const y = bandY(li) + ((idx % 3) - 1) * 8;
          const id = `${p.premierId}-${p.year}-${p.title}`;
          const active = hoverId === id;
          return (
            <g key={id}>
              <circle
                cx={x}
                cy={y}
                r={active ? 7 : 5}
                fill={layerColor(p.layer)}
                stroke={p.issueId ? 'var(--pr-celadon)' : 'var(--pr-hair)'}
                strokeWidth={p.issueId ? 1.5 : 0.5}
                opacity={active ? 1 : 0.85}
                style={{ cursor: p.issueId ? 'pointer' : 'default' }}
                onMouseEnter={() => setHoverId(id)}
                onMouseLeave={() => setHoverId(null)}
                onClick={() => handleClick(p)}
              />
              {active && (
                <text
                  x={x + 10}
                  y={y - 8}
                  fill="var(--pr-text)"
                  fontSize={10}
                >
                  {p.title.slice(0, 14)}{p.title.length > 14 ? '…' : ''}
                </text>
              )}
              <title>{`${p.premierName} · ${p.year} · ${p.title}`}</title>
            </g>
          );
        })}
      </svg>

      <div className="pr-legend">
        {LAYER_ROWS.map((layer) => (
          <span key={layer} className="pr-legend-item">
            <span className="pr-legend-swatch" style={{ background: layerColor(layer) }} />
            {layerLabel(layer)}
          </span>
        ))}
      </div>
    </div>
  );
}
