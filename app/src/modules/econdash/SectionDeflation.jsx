import React from 'react';
import { Card } from '../../app/ui.jsx';
import {
  ECON_COLORS, BandHead, GaugeCard,
} from './econUI.jsx';
import { HEADLINE_GAUGES, deflationMood } from './econDeflation.js';

// ============================================================================
// 当前主线 · 通缩与资金活化（SectionDeflation）
// ----------------------------------------------------------------------------
// 自包含 Section：内部直接取 HEADLINE_GAUGES（确定性 seed，基准日常量），
// 主线程 Page.jsx import 后 <SectionDeflation/> 直接落位即可，无 props。
//   · 顶部 BandHead 编号 00 标题区
//   · 四列 GaugeCard 网格（移动端 2 列），每个表盘按 signal 映射四色语义
//   · 底部 deflationMood 研判条，按 tone 着色
// 设计语言：四色语义 朱砂/青/赭/黛 取自 ECON_COLORS。
// 口径：公开统计梳理 · 示意标定 · 非投资建议 · 非预测。
// ============================================================================

// signal → ECON_COLORS 语义色映射：收缩/通缩/警示走朱砂，扩张/好转走青，
// 区域/财政视角走赭，宏观叙事视角走黛；缺省回落中性。
function colorForSignal(signal) {
  const C = ECON_COLORS || {};
  const map = {
    contraction: C.cinnabar, deflation: C.cinnabar, divergence: C.cinnabar, warning: C.cinnabar,
    expansion: C.cyan, nominal: C.cyan, improving: C.cyan,
    regional: C.ochre, fiscal: C.ochre,
    narrative: C.indigo, macro: C.indigo,
  };
  return map[signal] || C.cinnabar || C.cyan || '#62a89e';
}

// 取序列末值；series 既可能是数组，也可能是 {value,..} 数组，做容错。
function lastValue(points) {
  if (!Array.isArray(points) || !points.length) return null;
  const last = points[points.length - 1];
  if (last == null) return null;
  if (typeof last === 'number') return last;
  if (typeof last === 'object') return last.value ?? last.v ?? last.y ?? null;
  return null;
}

const DISCLAIMER = '公开统计梳理 · 示意标定 · 非投资建议 · 非预测';

export default function SectionDeflation() {
  const gauges = Array.isArray(HEADLINE_GAUGES) ? HEADLINE_GAUGES : [];
  const mood = typeof deflationMood === 'function' ? deflationMood(gauges) : (deflationMood || null);
  const moodTone = mood?.tone || ECON_COLORS?.cinnabar || '#c44e3d';

  return (
    <Card className="os-card">
      <BandHead n="00" title="当前主线 · 通缩与资金活化" en="DEFLATION & LIQUIDITY" />

      {/* 四列表盘网格 —— 移动端 2 列、桌面 4 列 */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 mt-4">
        {gauges.map((g, i) => {
          const series = g.series || g.points || [];
          const color = colorForSignal(g.signal);
          const latest = lastValue(series);
          const unit = g.unit || '';
          return (
            <GaugeCard
              key={g.id || g.key || g.label || i}
              label={g.label}
              sub={g.sub}
              points={series}
              color={color}
              signal={g.signal}
              source={g.source}
              freq={g.freq}
              note={g.note}
              latest={latest != null ? `${latest}${unit}` : null}
              zero={g.zero}
            />
          );
        })}
      </div>

      {/* 研判条 —— deflationMood，按 tone 着色 */}
      {mood && (
        <div
          className="mt-5 rounded-md px-4 py-3"
          style={{
            background: `${moodTone}14`,
            borderLeft: `3px solid ${moodTone}`,
          }}
        >
          {mood.title && (
            <div className="text-sm font-semibold mb-1" style={{ color: moodTone }}>
              {mood.title}
            </div>
          )}
          <p className="text-xs leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
            {mood.text || mood.verdict || mood.note || (typeof mood === 'string' ? mood : '')}
          </p>
        </div>
      )}

      {/* 统一口径小字 */}
      <p className="mt-4 text-[10px] mono" style={{ color: 'var(--text-tertiary)' }}>
        {DISCLAIMER}
      </p>
    </Card>
  );
}
