import React, { useMemo } from 'react';

function normalizePoints(points) {
  const nums = (Array.isArray(points) ? points : [])
    .map((v) => Number(v))
    .filter((v) => Number.isFinite(v));
  if (nums.length < 2) return null;
  const min = Math.min(...nums);
  const max = Math.max(...nums);
  const span = max - min || 1;
  return nums.map((v, i) => ({
    x: (i / (nums.length - 1)) * 100,
    y: 100 - ((v - min) / span) * 100,
  }));
}

/** 轻量 SVG 折线火花图 */
export default function OsSparkline({
  points,
  color = 'var(--cyber-cyan)',
  width = 80,
  height = 24,
  strokeWidth = 1.5,
  className = '',
  fill = false,
}) {
  const coords = useMemo(() => normalizePoints(points), [points]);
  if (!coords) return null;

  const line = coords.map((p) => `${p.x},${p.y}`).join(' ');
  const area = `0,100 ${line} 100,100`;

  return (
    <svg
      className={`os-sparkline block ${className}`.trim()}
      viewBox="0 0 100 100"
      width={width}
      height={height}
      preserveAspectRatio="none"
      role="img"
      aria-hidden="true"
    >
      {fill && (
        <polygon
          points={area}
          fill={color}
          fillOpacity={0.12}
        />
      )}
      <polyline
        points={line}
        fill="none"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
}
