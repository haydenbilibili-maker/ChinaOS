import React from 'react';
import { Card } from '../../app/ui.jsx';
import {
  ECON_COLORS, LensChip, BandHead, TensionBar,
} from './econUI.jsx';
import { TENSIONS, tensionVerdict } from './econDeflation.js';

// ============================================================================
// 背离监测 · 叙事×现实（SectionDivergence）
// ----------------------------------------------------------------------------
// 自包含 Section：内部直接取 TENSIONS（确定性 seed），主线程 Page.jsx
// import 后 <SectionDivergence/> 直接落位即可，无 props。
//   · 顶部 BandHead 编号 ★ 标题区
//   · 一句 lead：叙事在左、现实在右，裂缝越宽素材越多
//   · TENSIONS 两列网格（移动端 1 列）：每对
//       上行 —— 左(黛 indigo，a + as 小字) / 右对齐(朱砂 cinnabar，b + bs 小字)
//       TensionBar(left,right) 张力条
//       「监测张力 · {gap}」+ tensionVerdict 着色研判 + LensChip
// 设计语言：四色语义 朱砂/青/赭/黛 取自 ECON_COLORS。
// 口径：公开统计梳理 · 示意标定 · 非投资建议 · 非预测。
// ============================================================================

const DISCLAIMER = '公开统计梳理 · 示意标定 · 非投资建议 · 非预测';

export default function SectionDivergence() {
  const pairs = Array.isArray(TENSIONS) ? TENSIONS : [];
  const C = ECON_COLORS || {};
  const indigo = C.indigo || '#8090c6';
  const cinnabar = C.cinnabar || '#c44e3d';

  return (
    <Card className="os-card">
      <BandHead n="★" title="背离监测" en="NARRATIVE × REALITY" />

      <p className="text-xs leading-relaxed mt-3 mb-4" style={{ color: 'var(--text-secondary)' }}>
        左为<span style={{ color: indigo }}> 叙事 </span>口径，右为
        <span style={{ color: cinnabar }}> 现实 </span>体感 —— 裂缝越宽，分析素材越多。
      </p>

      {/* 张力对网格 —— 移动端 1 列、桌面 2 列 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {pairs.map((t, i) => {
          const verdict = typeof tensionVerdict === 'function'
            ? tensionVerdict(t)
            : (t.verdict || null);
          const vText = verdict?.text || verdict?.verdict || verdict?.note
            || (typeof verdict === 'string' ? verdict : '');
          const vTone = verdict?.tone || cinnabar;
          return (
            <div
              key={t.id || t.key || t.a || i}
              className="os-card p-4"
              style={{ borderLeft: `3px solid ${vTone}` }}
            >
              {/* 上行：左叙事 / 右现实 */}
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="min-w-0">
                  <div className="text-sm font-semibold leading-snug" style={{ color: indigo }}>
                    {t.a}
                  </div>
                  {t.as && (
                    <div className="text-[10px] mt-0.5 leading-snug" style={{ color: 'var(--text-tertiary)' }}>
                      {t.as}
                    </div>
                  )}
                </div>
                <div className="min-w-0 text-right">
                  <div className="text-sm font-semibold leading-snug" style={{ color: cinnabar }}>
                    {t.b}
                  </div>
                  {t.bs && (
                    <div className="text-[10px] mt-0.5 leading-snug" style={{ color: 'var(--text-tertiary)' }}>
                      {t.bs}
                    </div>
                  )}
                </div>
              </div>

              {/* 张力条 */}
              <TensionBar left={t.left} right={t.right} />

              {/* 监测张力 + 研判 + 视角 */}
              <div className="flex items-center justify-between gap-2 mt-3">
                <span className="text-[10px] mono" style={{ color: 'var(--text-tertiary)' }}>
                  监测张力 · {t.gap}
                </span>
                {t.lens && <LensChip lens={t.lens} />}
              </div>
              {vText && (
                <p className="text-xs leading-relaxed mt-2" style={{ color: vTone }}>
                  {vText}
                </p>
              )}
            </div>
          );
        })}
      </div>

      {/* 统一口径小字 */}
      <p className="mt-4 text-[10px] mono" style={{ color: 'var(--text-tertiary)' }}>
        {DISCLAIMER}
      </p>
    </Card>
  );
}
