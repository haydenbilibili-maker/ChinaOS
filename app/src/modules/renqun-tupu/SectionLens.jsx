import React, { useMemo, useState } from 'react';
import * as atlasViz from './atlasViz.js';
import EChart from '../../lib/viz/EChart.jsx';
import { Card } from '../../app/ui.jsx';
import { GY_MODULES } from '../../lib/gy/registry.js';

/**
 * GY-00 透视区块 ·「透视模组 · 主题簇棱镜」
 * 簇选择 SelectorBar → 该簇八维均值雷达 + 该簇成员卡片（点击跳 path）+ 簇研判。
 * 自包含、容错；与 SectionSpace3D / SectionParallel 共用同款内联小标题。
 *
 * 数据来自 atlasViz 契约：
 *   CLUSTER_DEFS[i] = { idx, head, color, count }
 *   sliceVectors()  = [{ num, code:'GY-XX', label, path, clusterIdx, ... }]
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

// 取簇名（CLUSTER_DEFS 用 head；兼容其他字段名）
const clusterLabel = (c, i) =>
  (c && (c.head ?? c.name ?? c.label ?? c.key)) || `簇 ${i + 1}`;

// 由切片向量/成员解析跳转 path：member.path 优先，回退 GY_MODULES
function resolveHash(member) {
  if (member && typeof member.path === 'string' && member.path) return member.path;
  const raw = String(member?.code ?? member?.num ?? '');
  const code = raw.replace(/[^0-9]/g, '').padStart(2, '0');
  const mod = GY_MODULES?.[code];
  return mod?.path || null;
}

// 把 'GY-10' / '10' 归一化为显示用纯编号
const pureNum = (member) =>
  String(member?.num ?? member?.code ?? '').replace(/[^0-9]/g, '');

export default function SectionLens() {
  const CLUSTERS = Array.isArray(atlasViz.CLUSTER_DEFS) ? atlasViz.CLUSTER_DEFS : [];
  const buildClusterRadarOption =
    typeof atlasViz.buildClusterRadarOption === 'function' ? atlasViz.buildClusterRadarOption : null;
  const sliceVectors =
    typeof atlasViz.sliceVectors === 'function' ? atlasViz.sliceVectors : null;

  const [idx, setIdx] = useState(0);
  const safeIdx = idx < CLUSTERS.length ? idx : 0;
  const cluster = CLUSTERS[safeIdx] || null;

  const option = useMemo(() => {
    if (!buildClusterRadarOption || !CLUSTERS.length) return null;
    try {
      return buildClusterRadarOption(safeIdx);
    } catch {
      return null;
    }
  }, [buildClusterRadarOption, CLUSTERS.length, safeIdx]);

  // 成员：从 sliceVectors 按 clusterIdx 过滤（每片自带 code/label/path）
  const members = useMemo(() => {
    if (!sliceVectors) {
      // 退化：CLUSTER_DEFS 自带 members/slices 时直接用
      const raw = cluster?.members ?? cluster?.slices ?? cluster?.nodes ?? [];
      return Array.isArray(raw) ? raw : [];
    }
    try {
      return sliceVectors().filter((s) => s.clusterIdx === safeIdx);
    } catch {
      return [];
    }
  }, [sliceVectors, cluster, safeIdx]);

  const ready = CLUSTERS.length > 0 && !!buildClusterRadarOption;

  const clusterColor = cluster?.color || '#22d3ee';
  const clusterName = clusterLabel(cluster, safeIdx);
  const count = cluster?.count ?? members.length;
  // 簇研判：CLUSTER_DEFS 无 blurb，用簇头 + 成员数合成结构研判
  const verdict =
    cluster?.blurb ??
    cluster?.verdict ??
    cluster?.note ??
    (cluster
      ? `本簇「${clusterName}」含 ${count} 片人群；雷达为该簇八维结构均值——形状即这群人共享的处境侧写。`
      : null);

  const go = (member) => {
    const path = resolveHash(member);
    if (path) {
      // HashRouter：写 location.hash 触发路由跳转
      window.location.hash = path.startsWith('#') ? path.slice(1) : path;
    }
  };

  return (
    <Card>
      <BandHead n="◳" title="透视模组 · 主题簇棱镜" en="LENS / CLUSTER PRISM" />

      {!ready ? (
        <Fallback note="主题簇雷达数据或绘制函数尚未就绪。" />
      ) : (
        <>
          {/* 簇选择 SelectorBar */}
          <div className="flex flex-wrap gap-1.5 mb-4">
            {CLUSTERS.map((c, i) => {
              const on = i === safeIdx;
              const col = c.color || '#64748b';
              return (
                <button
                  key={c.idx ?? c.key ?? c.head ?? i}
                  type="button"
                  onClick={() => setIdx(i)}
                  className="os-btn os-btn-sm inline-flex items-center gap-1.5"
                  style={{
                    fontSize: 11,
                    padding: '4px 10px',
                    background: on
                      ? `color-mix(in srgb, ${col} 20%, var(--bg-base))`
                      : 'var(--bg-base)',
                    color: on ? col : 'var(--text-secondary)',
                    border: `1px solid ${on ? col : 'var(--border-subtle)'}`,
                    borderRadius: 'var(--radius-sm)',
                    cursor: 'pointer',
                  }}
                >
                  <span
                    style={{ width: 8, height: 8, borderRadius: 2, background: col, display: 'inline-block' }}
                  />
                  {clusterLabel(c, i)}
                </button>
              );
            })}
          </div>

          <div className="grid gap-5" style={{ gridTemplateColumns: 'minmax(0,1fr)' }}>
            {/* 雷达 */}
            {option ? (
              <EChart option={option} style={{ height: 380 }} />
            ) : (
              <Fallback note="该簇雷达暂无法生成。" />
            )}

            {/* 簇研判 */}
            {verdict && (
              <p
                className="text-[12px] leading-snug os-card"
                style={{
                  color: 'var(--text-secondary)',
                  padding: '8px 12px',
                  borderLeft: `2px solid ${clusterColor}`,
                  background: 'var(--bg-elevated)',
                }}
              >
                <span className="mono text-[10px] mr-1.5" style={{ color: clusterColor }}>研判</span>
                {verdict}
              </p>
            )}

            {/* 成员卡片 */}
            <div>
              <div className="text-[11px] mb-2" style={{ color: 'var(--text-tertiary)' }}>
                {clusterName} · 成员切片（点击直跳模块）
              </div>
              {members.length === 0 ? (
                <p className="text-xs" style={{ color: 'var(--text-tertiary)' }}>该簇暂无成员数据。</p>
              ) : (
                <div
                  className="grid gap-2"
                  style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(150px,1fr))' }}
                >
                  {members.map((m, i) => {
                    const num = pureNum(m);
                    const label = m.label ?? m.name ?? m.short ?? '';
                    const path = resolveHash(m);
                    const clickable = !!path;
                    return (
                      <button
                        key={num || label || i}
                        type="button"
                        onClick={() => clickable && go(m)}
                        disabled={!clickable}
                        className="os-card os-card-interactive text-left rounded-lg p-2.5 transition-colors"
                        style={{
                          background: 'var(--bg-elevated)',
                          border: '1px solid var(--border-subtle)',
                          cursor: clickable ? 'pointer' : 'default',
                          opacity: clickable ? 1 : 0.75,
                        }}
                      >
                        <div className="mono text-[10px]" style={{ color: clusterColor }}>
                          GY-{num || '??'}
                          {clickable && <span style={{ color: 'var(--text-tertiary)' }}> ↗</span>}
                        </div>
                        <div className="text-[12px] mt-0.5 leading-snug" style={{ color: 'var(--text-primary)' }}>
                          {label || '—'}
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </>
      )}

      <CalibFoot />
    </Card>
  );
}
