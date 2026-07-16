import React, { useId, useMemo, useState } from 'react';

/**
 * 图 A · 黑暗森林坐标系
 * 横轴：猜疑链强度 · 纵轴：技术爆炸速率
 * 象限标注策略原型（思想实验，非政策处方）
 */
const QUADRANTS = [
  {
    id: 'q1',
    x: 0.72,
    y: 0.72,
    label: '先发沉默',
    sub: '高猜疑 × 高爆炸',
    tip: '窗口焦虑最大：暴露成本极高，策略倾向隐蔽与先发期权。',
  },
  {
    id: 'q2',
    x: 0.28,
    y: 0.72,
    label: '可控威慑',
    sub: '低猜疑 × 高爆炸',
    tip: '技术跃迁仍在，但沟通与制度可压低误判——更接近现实核禁忌区。',
  },
  {
    id: 'q3',
    x: 0.28,
    y: 0.28,
    label: '重复博弈',
    sub: '低猜疑 × 低爆炸',
    tip: '代差缓慢、意图较可验证：合作与以牙还牙更可能稳态。',
  },
  {
    id: 'q4',
    x: 0.72,
    y: 0.28,
    label: '脆弱均衡',
    sub: '高猜疑 × 低爆炸',
    tip: '军备可累积但翻转慢：安全困境存在，却未必立即「清除」。',
  },
];

export default function DarkForestChart({ className = '', onSelectQuad }) {
  const gid = useId().replace(/:/g, '');
  const [active, setActive] = useState(null);
  const tip = useMemo(() => QUADRANTS.find((q) => q.id === active), [active]);

  const W = 640;
  const H = 420;
  const pad = { l: 56, r: 28, t: 36, b: 52 };
  const iw = W - pad.l - pad.r;
  const ih = H - pad.t - pad.b;

  const toX = (n) => pad.l + n * iw;
  const toY = (n) => pad.t + (1 - n) * ih;

  function activate(id) {
    setActive(id);
    onSelectQuad?.(id);
  }

  return (
    <div className={`st-forest ${className}`}>
      <svg
        className="st-forest__svg"
        viewBox={`0 0 ${W} ${H}`}
        role="img"
        aria-labelledby={`st-forest-title-${gid}`}
        aria-describedby={`st-forest-desc-${gid}`}
      >
        <title id={`st-forest-title-${gid}`}>黑暗森林坐标系</title>
        <desc id={`st-forest-desc-${gid}`}>
          横轴为猜疑链强度，纵轴为技术爆炸速率。四象限分别为先发沉默、可控威慑、重复博弈与脆弱均衡。
        </desc>

        <defs>
          <radialGradient id={`st-void-${gid}`} cx="50%" cy="45%" r="65%">
            <stop offset="0%" stopColor="#1a2336" />
            <stop offset="100%" stopColor="#0b0e14" />
          </radialGradient>
          <pattern id={`st-grid-${gid}`} width="32" height="32" patternUnits="userSpaceOnUse">
            <path d="M32 0H0V32" fill="none" stroke="#2a3344" strokeWidth="0.6" opacity="0.55" />
          </pattern>
        </defs>

        <rect width={W} height={H} rx="6" fill={`url(#st-void-${gid})`} />
        <rect x={pad.l} y={pad.t} width={iw} height={ih} fill={`url(#st-grid-${gid})`} opacity="0.9" />

        {/* 象限底色 */}
        <rect x={toX(0.5)} y={toY(1)} width={iw / 2} height={ih / 2} fill="#c45c26" opacity="0.06" />
        <rect x={toX(0)} y={toY(1)} width={iw / 2} height={ih / 2} fill="#6b8cae" opacity="0.07" />
        <rect x={toX(0)} y={toY(0.5)} width={iw / 2} height={ih / 2} fill="#7a9e9f" opacity="0.06" />
        <rect x={toX(0.5)} y={toY(0.5)} width={iw / 2} height={ih / 2} fill="#8b95a8" opacity="0.05" />

        {/* 轴 */}
        <line x1={toX(0)} y1={toY(0)} x2={toX(1)} y2={toY(0)} stroke="#3a4558" strokeWidth="1.2" />
        <line x1={toX(0)} y1={toY(0)} x2={toX(0)} y2={toY(1)} stroke="#3a4558" strokeWidth="1.2" />
        <line x1={toX(0.5)} y1={toY(0)} x2={toX(0.5)} y2={toY(1)} stroke="#2a3344" strokeWidth="1" strokeDasharray="4 4" />
        <line x1={toX(0)} y1={toY(0.5)} x2={toX(1)} y2={toY(0.5)} stroke="#2a3344" strokeWidth="1" strokeDasharray="4 4" />

        {/* 轴标签 */}
        <text x={toX(0.5)} y={H - 14} textAnchor="middle" className="st-forest__axis">
          猜疑链强度 →
        </text>
        <text
          x={18}
          y={toY(0.5)}
          textAnchor="middle"
          className="st-forest__axis"
          transform={`rotate(-90 18 ${toY(0.5)})`}
        >
          技术爆炸速率 →
        </text>

        {QUADRANTS.map((q) => {
          const cx = toX(q.x);
          const cy = toY(q.y);
          const isOn = active === q.id;
          return (
            <g
              key={q.id}
              className={`st-forest__node${isOn ? ' is-active' : ''}`}
              tabIndex={0}
              role="button"
              aria-pressed={isOn}
              aria-label={`${q.label}：${q.sub}`}
              onClick={() => activate(q.id)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  activate(q.id);
                }
              }}
              style={{ cursor: 'pointer' }}
            >
              <circle cx={cx} cy={cy} r={isOn ? 18 : 14} fill="#121826" stroke={isOn ? '#c45c26' : '#6b8cae'} strokeWidth={isOn ? 2 : 1.4} />
              <circle cx={cx} cy={cy} r={4} fill={isOn ? '#c45c26' : '#7a9e9f'} />
              <text x={cx} y={cy - 26} textAnchor="middle" className="st-forest__label">
                {q.label}
              </text>
              <text x={cx} y={cy + 34} textAnchor="middle" className="st-forest__sub">
                {q.sub}
              </text>
            </g>
          );
        })}
      </svg>

      <div className="st-forest__caption" aria-live="polite">
        {tip ? (
          <>
            <span className="st-forest__cap-tag mono">{tip.label}</span>
            <span>{tip.tip}</span>
          </>
        ) : (
          <span>点击象限节点查看策略原型说明。本图为思想实验坐标系，非政策处方。</span>
        )}
      </div>
    </div>
  );
}
