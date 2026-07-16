import React, { useId, useMemo, useState } from 'react';
import { SWORD_NODES } from './santiCanon.js';

/**
 * 图 C · 威慑执剑剖面
 * 抽象可信承诺链：能力 → 探测 → 授权 → 执剑 → 稳态（非人物立绘）
 */
export default function SwordChart({ className = '', onSelectNode }) {
  const gid = useId().replace(/:/g, '');
  const [active, setActive] = useState(null);
  const tip = useMemo(() => SWORD_NODES.find((n) => n.id === active), [active]);

  const W = 720;
  const H = 320;
  const pad = { l: 36, r: 36, t: 48, b: 40 };
  const iw = W - pad.l - pad.r;
  const ih = H - pad.t - pad.b;

  const toX = (n) => pad.l + n * iw;
  const toY = (n) => pad.t + n * ih;

  function activate(id) {
    setActive(id);
    onSelectNode?.(id);
  }

  const pts = SWORD_NODES.map((n) => ({ ...n, px: toX(n.x), py: toY(n.y) }));

  return (
    <div className={`st-sword ${className}`}>
      <svg
        className="st-sword__svg"
        viewBox={`0 0 ${W} ${H}`}
        role="img"
        aria-labelledby={`st-sword-title-${gid}`}
        aria-describedby={`st-sword-desc-${gid}`}
      >
        <title id={`st-sword-title-${gid}`}>威慑执剑剖面</title>
        <desc id={`st-sword-desc-${gid}`}>
          抽象可信承诺链：相互摧毁能力、探测与校验、授权与指挥链、执剑节点、威慑纪元稳态。点选节点可联动理论光谱。
        </desc>

        <defs>
          <linearGradient id={`st-sword-grad-${gid}`} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="var(--st-signal)" stopOpacity="0.15" />
            <stop offset="55%" stopColor="var(--st-ice)" stopOpacity="0.35" />
            <stop offset="100%" stopColor="var(--st-flare)" stopOpacity="0.45" />
          </linearGradient>
          <marker
            id={`st-sword-arrow-${gid}`}
            markerWidth="7"
            markerHeight="7"
            refX="6"
            refY="3.5"
            orient="auto"
          >
            <path d="M0,0 L7,3.5 L0,7 Z" fill="var(--st-signal)" opacity="0.7" />
          </marker>
        </defs>

        {/* 剖面底轨 */}
        <rect
          x={pad.l}
          y={pad.t + ih * 0.42}
          width={iw}
          height={ih * 0.28}
          rx="4"
          fill={`url(#st-sword-grad-${gid})`}
          stroke="var(--st-line)"
          strokeWidth="1"
          opacity="0.85"
        />
        <text
          x={pad.l + 8}
          y={pad.t + ih * 0.42 - 8}
          fill="var(--st-metal-300)"
          fontSize="10"
          letterSpacing="0.12em"
        >
          可信承诺链 · 剖面
        </text>

        {/* 连线 */}
        {pts.slice(0, -1).map((n, i) => {
          const next = pts[i + 1];
          return (
            <line
              key={`e-${n.id}`}
              x1={n.px}
              y1={n.py}
              x2={next.px}
              y2={next.py}
              stroke="var(--st-signal)"
              strokeWidth="1.5"
              strokeDasharray="4 3"
              markerEnd={`url(#st-sword-arrow-${gid})`}
              opacity="0.65"
            />
          );
        })}

        {/* 节点 */}
        {pts.map((n, i) => {
          const isOn = active === n.id;
          return (
            <g
              key={n.id}
              className={`st-sword__node${isOn ? ' is-active' : ''}`}
              transform={`translate(${n.px}, ${n.py})`}
              role="button"
              tabIndex={0}
              style={{ '--st-i': i }}
              aria-pressed={isOn}
              aria-label={`${n.label}：${n.tip}`}
              onClick={() => activate(n.id)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  activate(n.id);
                }
              }}
            >
              {isOn && (
                <circle
                  className="st-pulse-ring"
                  r={24}
                  fill="none"
                  stroke="var(--st-flare)"
                  strokeWidth="1.2"
                  opacity="0.5"
                />
              )}
              <circle
                r={isOn ? 16 : 13}
                fill={isOn ? 'var(--st-void-800)' : 'var(--st-void-900)'}
                stroke={isOn ? 'var(--st-flare)' : 'var(--st-signal)'}
                strokeWidth={isOn ? 2.2 : 1.4}
              />
              <circle
                r={4}
                fill={isOn ? 'var(--st-flare)' : 'var(--st-ice)'}
                opacity="0.9"
              />
              <text
                y={-22}
                textAnchor="middle"
                fill="var(--st-metal-100)"
                fontSize="11"
                fontWeight="600"
              >
                {n.label}
              </text>
              <text
                y={28}
                textAnchor="middle"
                fill="var(--st-metal-300)"
                fontSize="9"
                letterSpacing="0.06em"
              >
                {n.sub}
              </text>
            </g>
          );
        })}
      </svg>

      <p className="st-sword__tip" aria-live="polite">
        {tip ? tip.tip : '点选剖面节点（键盘 Enter / Space），跳转光谱并高亮关联概念卡。'}
      </p>
    </div>
  );
}
