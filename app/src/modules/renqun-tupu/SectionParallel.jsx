import React, { useMemo, useState } from 'react';
import * as atlasViz from './atlasViz.js';
import EChart from '../../lib/viz/EChart.jsx';
import { Card } from '../../app/ui.jsx';

/**
 * GY-00 透视区块 ·「八维全光谱 · 平行坐标」
 * 全 8 维平行坐标 + 维度子集筛选（至少保留 3 维）+ 簇色图例 + 方差研判。
 * 自包含、容错；与 SectionSpace3D / SectionLens 共用同款内联小标题。
 */

const SERIF =
  "'Noto Serif SC', 'Songti SC', 'STSong', 'Source Han Serif SC', Georgia, 'Times New Roman', serif";

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

function CalibFoot() {
  return (
    <p className="text-[10px] mt-4 leading-snug" style={{ color: 'var(--text-tertiary)' }}>
      人群画像为公开结构分析框架 · 示意标定 · 非真实人事评价
    </p>
  );
}

function Fallback({ note }) {
  return (
    <div className="os-card p-6 text-sm os-section" style={{ color: 'var(--text-tertiary)' }}>
      <span className="mono" style={{ color: 'var(--cyber-cyan)' }}>// 数据装载中</span> — {note}
    </div>
  );
}

export default function SectionParallel() {
  const DIMS = Array.isArray(atlasViz.SPACE_DIMS) ? atlasViz.SPACE_DIMS : [];
  const CLUSTERS = Array.isArray(atlasViz.CLUSTER_DEFS) ? atlasViz.CLUSTER_DEFS : [];
  const buildParallelOption =
    typeof atlasViz.buildParallelOption === 'function' ? atlasViz.buildParallelOption : null;
  const dimSummary = typeof atlasViz.dimSummary === 'function' ? atlasViz.dimSummary : null;

  const dimKey = (d) => (d == null ? '' : typeof d === 'string' ? d : d.key ?? d.name ?? d.id ?? '');
  const dimName = (d) => (d == null ? '' : typeof d === 'string' ? d : d.name ?? d.label ?? d.key ?? '');

  const allKeys = DIMS.map(dimKey).filter(Boolean);

  // 默认全 8 维开启
  const [active, setActive] = useState(() => new Set(allKeys));

  const activeKeys = useMemo(() => allKeys.filter((k) => active.has(k)), [allKeys, active]);

  const toggle = (k) => {
    setActive((prev) => {
      const next = new Set(prev);
      if (next.has(k)) {
        // 至少保留 3 维
        if (next.size <= 3) return prev;
        next.delete(k);
      } else {
        next.add(k);
      }
      return next;
    });
  };

  const option = useMemo(() => {
    if (!buildParallelOption) return null;
    try {
      // 契约：buildParallelOption({ dims }) —— dims 为 SPACE_DIMS id 数组（缺省画全维）
      return buildParallelOption(activeKeys.length ? { dims: activeKeys } : {});
    } catch {
      try {
        return buildParallelOption();
      } catch {
        return null;
      }
    }
  }, [buildParallelOption, activeKeys]);

  // 方差研判
  const verdict = useMemo(() => {
    if (!dimSummary) return null;
    try {
      const s = dimSummary();
      if (!s) return null;
      if (typeof s === 'string') return s;
      if (s.text) return s.text;
      if (s.verdict) return s.verdict;
      // 兜底：若返回各维方差，挑出方差最大/最小维
      if (Array.isArray(s)) {
        const sorted = [...s]
          .filter((x) => x && typeof x.variance === 'number')
          .sort((a, b) => b.variance - a.variance);
        if (sorted.length) {
          const top = sorted[0];
          const bot = sorted[sorted.length - 1];
          return `分化最剧的维度是「${top.name ?? top.key}」，最趋同的是「${bot.name ?? bot.key}」—— 前者是人群被撕开的主断层。`;
        }
      }
      return null;
    } catch {
      return null;
    }
  }, [dimSummary]);

  const ready = DIMS.length >= 3 && !!buildParallelOption;

  return (
    <Card>
      <BandHead n="≣" title="八维全光谱 · 平行坐标" en="PARALLEL / 8-DIM" />

      {!ready ? (
        <Fallback note="平行坐标数据或绘制函数尚未就绪。" />
      ) : (
        <>
          {/* 维度子集筛选 chips */}
          {DIMS.length > 0 && (
            <div className="mb-3">
              <div className="text-[11px] mb-1.5" style={{ color: 'var(--text-tertiary)' }}>
                维度筛选（至少保留 3 维）
              </div>
              <div className="flex flex-wrap gap-1.5">
                {DIMS.map((d) => {
                  const k = dimKey(d);
                  const on = active.has(k);
                  const locked = on && active.size <= 3;
                  return (
                    <button
                      key={k}
                      type="button"
                      onClick={() => toggle(k)}
                      title={locked ? '已是最小维度数，无法再关' : undefined}
                      className="os-btn os-btn-sm"
                      style={{
                        fontSize: 11,
                        padding: '3px 9px',
                        background: on
                          ? 'color-mix(in srgb, var(--cyber-cyan) 18%, var(--bg-base))'
                          : 'var(--bg-base)',
                        color: on ? 'var(--cyber-cyan)' : 'var(--text-tertiary)',
                        border: `1px solid ${on ? 'var(--cyber-cyan)' : 'var(--border-subtle)'}`,
                        borderRadius: 'var(--radius-sm)',
                        cursor: locked ? 'not-allowed' : 'pointer',
                        opacity: on ? 1 : 0.7,
                      }}
                    >
                      {dimName(d)}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* 簇色图例 */}
          {CLUSTERS.length > 0 && (
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
          )}

          {option ? (
            <EChart option={option} style={{ height: 460 }} />
          ) : (
            <Fallback note="当前维度组合无法生成平行坐标。" />
          )}

          {verdict && (
            <p
              className="text-[12px] mt-3 leading-snug os-card"
              style={{
                color: 'var(--text-secondary)',
                padding: '8px 12px',
                borderLeft: '2px solid var(--china-red)',
                background: 'var(--bg-elevated)',
              }}
            >
              <span className="mono text-[10px] mr-1.5" style={{ color: 'var(--china-red)' }}>研判</span>
              {verdict}
            </p>
          )}
        </>
      )}

      <CalibFoot />
    </Card>
  );
}
