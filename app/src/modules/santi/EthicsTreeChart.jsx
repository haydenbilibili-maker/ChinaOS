import React, { useId, useMemo, useState } from 'react';
import { ETHICS_TREE } from './santiCanon.js';

/**
 * 图 D · 执剑伦理决策树（个体抉择面）
 * 抽象路径：局面 → 信息完备 → 按下/克制 → 制度接管；非人物立绘
 */
export default function EthicsTreeChart({ className = '', onSelectNode }) {
  const gid = useId().replace(/:/g, '');
  const [active, setActive] = useState(null);
  const tip = useMemo(() => ETHICS_TREE.find((n) => n.id === active), [active]);

  const W = 720;
  const H = 340;
  const pad = { l: 40, r: 40, t: 28, b: 28 };
  const iw = W - pad.l - pad.r;
  const ih = H - pad.t - pad.b;

  const toX = (n) => pad.l + n * iw;
  const toY = (n) => pad.t + n * ih;

  function activate(id) {
    setActive(id);
    onSelectNode?.(id);
  }

  const pts = Object.fromEntries(
    ETHICS_TREE.map((n) => [n.id, { ...n, px: toX(n.x), py: toY(n.y) }]),
  );

  const edges = [
    ['crisis', 'info'],
    ['info', 'press'],
    ['info', 'hold'],
    ['press', 'inst'],
    ['hold', 'inst'],
  ];

  return (
    <div className={`st-ethics ${className}`}>
      <svg
        className="st-ethics__svg"
        viewBox={`0 0 ${W} ${H}`}
        role="img"
        aria-labelledby={`st-ethics-title-${gid}`}
        aria-describedby={`st-ethics-desc-${gid}`}
      >
        <title id={`st-ethics-title-${gid}`}>执剑伦理决策树</title>
        <desc id={`st-ethics-desc-${gid}`}>
          抽象个体抉择路径：相互摧毁局面、信息完备度分叉、执行或克制、制度接管出口。点选节点可联动理论光谱。
        </desc>

        <defs>
          <marker
            id={`st-ethics-arrow-${gid}`}
            markerWidth="7"
            markerHeight="7"
            refX="6"
            refY="3.5"
            orient="auto"
          >
            <path d="M0,0 L7,3.5 L0,7 Z" fill="var(--st-signal)" opacity="0.7" />
          </marker>
        </defs>

        <text
          x={pad.l}
          y={18}
          fill="var(--st-metal-300)"
          fontSize="10"
          letterSpacing="0.12em"
        >
          图 D · 个体抉择面 · 非励志叙事
        </text>

        {edges.map(([a, b]) => {
          const from = pts[a];
          const to = pts[b];
          if (!from || !to) return null;
          return (
            <line
              key={`${a}-${b}`}
              x1={from.px}
              y1={from.py}
              x2={to.px}
              y2={to.py}
              stroke="var(--st-signal)"
              strokeWidth="1.4"
              strokeDasharray="4 3"
              markerEnd={`url(#st-ethics-arrow-${gid})`}
              opacity="0.6"
            />
          );
        })}

        {ETHICS_TREE.map((n) => {
          const p = pts[n.id];
          const on = active === n.id;
          return (
            <g
              key={n.id}
              className={`st-ethics__node${on ? ' is-active' : ''}`}
              transform={`translate(${p.px}, ${p.py})`}
              tabIndex={0}
              role="button"
              aria-pressed={on}
              aria-label={`${n.label} ${n.sub}`}
              onClick={() => activate(n.id)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  activate(n.id);
                }
              }}
            >
              {on && (
                <circle
                  className="st-pulse-ring"
                  r="22"
                  fill="none"
                  stroke="var(--st-flare)"
                  strokeWidth="1"
                  opacity="0.5"
                />
              )}
              <circle
                r="16"
                fill="var(--st-void-800)"
                stroke={on ? 'var(--st-flare)' : 'var(--st-signal)'}
                strokeWidth={on ? 2 : 1.4}
              />
              <circle r="4" fill={on ? 'var(--st-flare)' : 'var(--st-ice)'} />
              <text
                y="-24"
                textAnchor="middle"
                fill="var(--st-metal-100)"
                fontSize="11"
                fontWeight="600"
              >
                {n.label}
              </text>
              <text
                y="32"
                textAnchor="middle"
                fill="var(--st-metal-300)"
                fontSize="9"
                letterSpacing="0.08em"
              >
                {n.sub}
              </text>
            </g>
          );
        })}
      </svg>
      <p className="st-ethics__tip" aria-live="polite">
        {tip ? tip.tip : '点选节点展开路径含义；跳转光谱高亮关联卡。'}
      </p>
    </div>
  );
}
