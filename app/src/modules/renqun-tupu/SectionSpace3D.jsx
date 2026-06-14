import React, { useMemo, useState } from 'react';
import * as atlasViz from './atlasViz.js';
import EChart from '../../lib/viz/EChart.jsx';
import { Card } from '../../app/ui.jsx';

/**
 * GY-00 透视区块 ·「多维立体空间坐标系」
 * 八维中任取三维 → 等距投影伪三维散点；点=一片人群，色=主题簇，径=边缘度。
 * 自包含、容错：atlasViz 任一导出缺失 → 回退占位，不白屏。
 * 与 SectionParallel / SectionLens 共用同款内联小标题（参考 econUI BandHead，本模块内联）。
 */

const SERIF =
  "'Noto Serif SC', 'Songti SC', 'STSong', 'Source Han Serif SC', Georgia, 'Times New Roman', serif";

// —— 共用内联小标题：编号(mono) + 衬线标题 + flex 横线 —— //
function BandHead({ n, title, en }) {
  return (
    <div className="flex items-baseline gap-3 mb-3">
      {n != null && (
        <span className="mono text-xs font-semibold shrink-0" style={{ color: 'var(--china-red)' }}>
          {n}
        </span>
      )}
      <h3
        className="text-base font-semibold shrink-0 leading-tight"
        style={{ fontFamily: SERIF, color: 'var(--text-primary)' }}
      >
        {title}
      </h3>
      {en && (
        <span className="mono text-[10px] shrink-0" style={{ color: 'var(--text-tertiary)' }}>
          {en}
        </span>
      )}
      <span
        className="flex-1 self-center"
        style={{ height: 1, background: 'var(--border-subtle)', minWidth: 16 }}
        aria-hidden="true"
      />
    </div>
  );
}

// 口径小字（三组件统一）
function CalibFoot() {
  return (
    <p className="text-[10px] mt-4 leading-snug" style={{ color: 'var(--text-tertiary)' }}>
      人群画像为公开结构分析框架 · 示意标定 · 非真实人事评价
    </p>
  );
}

function Fallback({ note }) {
  return (
    <div
      className="os-card p-6 text-sm os-section"
      style={{ color: 'var(--text-tertiary)' }}
    >
      <span className="mono" style={{ color: 'var(--cyber-cyan)' }}>// 数据装载中</span> — {note}
    </div>
  );
}

export default function SectionSpace3D() {
  // —— 契约导出读取（防御性）—— //
  const DIMS = Array.isArray(atlasViz.SPACE_DIMS) ? atlasViz.SPACE_DIMS : [];
  const CLUSTERS = Array.isArray(atlasViz.CLUSTER_DEFS) ? atlasViz.CLUSTER_DEFS : [];
  const build3DOption = typeof atlasViz.build3DOption === 'function' ? atlasViz.build3DOption : null;

  // DIMS 元素既可能是字符串，也可能是 {key,name} —— 统一取值/取名
  const dimKey = (d) => (d == null ? '' : typeof d === 'string' ? d : d.key ?? d.name ?? d.id ?? '');
  const dimName = (d) => (d == null ? '' : typeof d === 'string' ? d : d.name ?? d.label ?? d.key ?? '');

  const keys = DIMS.map(dimKey).filter(Boolean);

  // 默认 阶层位 / 年龄位 / 边缘度；找不到则退化为前三维
  const pick = (wanted, fallbackIdx) => {
    const hit = DIMS.find((d) => {
      const n = dimName(d);
      const k = dimKey(d);
      return wanted.some((w) => n.includes(w) || k.includes(w));
    });
    return hit ? dimKey(hit) : keys[fallbackIdx] ?? keys[0] ?? '';
  };

  const [xDim, setXDim] = useState(() => pick(['阶层'], 0));
  const [yDim, setYDim] = useState(() => pick(['年龄'], 1));
  const [zDim, setZDim] = useState(() => pick(['边缘'], 2));

  const option = useMemo(() => {
    if (!build3DOption || !xDim || !yDim || !zDim) return null;
    try {
      return build3DOption({ xDim, yDim, zDim });
    } catch {
      return null;
    }
  }, [build3DOption, xDim, yDim, zDim]);

  const ready = DIMS.length >= 3 && CLUSTERS.length > 0 && !!build3DOption;

  const AxisPicker = ({ label, value, onChange, color }) => (
    <div className="flex items-center gap-2 flex-wrap">
      <span
        className="mono text-[11px] font-semibold shrink-0"
        style={{ color: color || 'var(--text-secondary)', minWidth: 18 }}
      >
        {label}
      </span>
      <div className="flex flex-wrap gap-1.5">
        {DIMS.map((d) => {
          const k = dimKey(d);
          const on = value === k;
          return (
            <button
              key={k}
              type="button"
              onClick={() => onChange(k)}
              className="os-btn os-btn-sm"
              style={{
                fontSize: 11,
                padding: '3px 9px',
                background: on
                  ? `color-mix(in srgb, ${color || 'var(--cyber-cyan)'} 20%, var(--bg-base))`
                  : 'var(--bg-base)',
                color: on ? color || 'var(--cyber-cyan)' : 'var(--text-secondary)',
                border: `1px solid ${on ? color || 'var(--cyber-cyan)' : 'var(--border-subtle)'}`,
                borderRadius: 'var(--radius-sm)',
                cursor: 'pointer',
              }}
            >
              {dimName(d)}
            </button>
          );
        })}
      </div>
    </div>
  );

  return (
    <Card>
      <BandHead n="⊿" title="多维立体空间坐标系 · 八维中的三维投影" en="3D / ISO-PROJECTION" />

      {!ready ? (
        <Fallback note="多维坐标系数据或绘制函数尚未就绪。" />
      ) : (
        <>
          {/* 三轴选择器 */}
          <div className="flex flex-col gap-2.5 mb-4">
            <AxisPicker label="X" value={xDim} onChange={setXDim} color="#c41e3a" />
            <AxisPicker label="Y" value={yDim} onChange={setYDim} color="#22d3ee" />
            <AxisPicker label="Z" value={zDim} onChange={setZDim} color="#e8a317" />
          </div>

          {/* 簇色图例 */}
          <div className="flex flex-wrap gap-x-4 gap-y-1.5 mb-3">
            {CLUSTERS.map((c, i) => (
              <span key={c.idx ?? c.head ?? c.key ?? i} className="inline-flex items-center gap-1.5">
                <span
                  style={{
                    width: 10,
                    height: 10,
                    borderRadius: 2,
                    background: c.color || '#64748b',
                    display: 'inline-block',
                  }}
                />
                <span className="text-[11px]" style={{ color: 'var(--text-secondary)' }}>
                  {c.head ?? c.name ?? c.label ?? c.key ?? `簇${i + 1}`}
                </span>
              </span>
            ))}
          </div>

          {option ? (
            <EChart option={option} style={{ height: 520 }} />
          ) : (
            <Fallback note="当前三轴组合无法生成投影，请更换维度。" />
          )}

          <p className="text-[11px] mt-3 leading-snug" style={{ color: 'var(--text-tertiary)' }}>
            等距投影伪三维：每个点是一片人群，位置 = 其在所选三轴上的坐标，颜色 = 主题簇，点径 = 边缘度。
          </p>
        </>
      )}

      <CalibFoot />
    </Card>
  );
}
