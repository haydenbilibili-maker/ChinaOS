import React from 'react';

/** 品牌印：朱文方印「观」（VI 2.0 §6） */
export default function Seal({ size = 32, char = '观', className = '' }) {
  return (
    <svg className={`vi-seal ${className}`.trim()} viewBox="0 0 40 40" width={size} height={size} role="img" aria-label={`印：${char}`}>
      <rect x="1.5" y="1.5" width="37" height="37" rx="5" className="vi-seal__ground" />
      <rect x="4.5" y="4.5" width="31" height="31" rx="3" className="vi-seal__frame" fill="none" />
      <text x="20" y="27.5" textAnchor="middle" className="vi-seal__char">{char}</text>
    </svg>
  );
}
