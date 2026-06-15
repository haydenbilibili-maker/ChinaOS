import React, { useMemo } from 'react';
import { Card } from '../../app/ui.jsx';
import EChart from '../../lib/viz/EChart.jsx';

// ============================================================================
// ⑲ 风险地图 · 概率 × 影响
// ----------------------------------------------------------------------------
// 自包含组件：把 35 岁回迁创业期的主要风险铺在 概率(x) × 影响(y) 的平面上，
// 右上红区＝高概率高影响、最该先对冲；下方按 prob×impact 排序给出 Top 列表。
// 口径：私享自画像 · 本人自述 · 自评示意标定 · 非预测非承诺。
// ============================================================================

const AX = { line: '#27324a', text: '#93a1b5', split: 'rgba(148,163,184,0.1)' };
const MID = 50; // 象限分割线

// —— 风险点（prob/impact 0-100，自评示意）——
const RISKS = [
  { name: '创业现金流断裂', prob: 58, impact: 92, color: '#c41e3a' },
  { name: '出海红利二次退潮', prob: 72, impact: 70, color: '#e8a317' },
  { name: 'AI 技术替代加速', prob: 78, impact: 62, color: '#22d3ee' },
  { name: '健康透支', prob: 55, impact: 72, color: '#10b981' },
  { name: '同辈比较焦虑', prob: 80, impact: 40, color: '#8b5cf6' },
  { name: '家庭/地域拉扯', prob: 62, impact: 50, color: '#fb923c' },
  { name: '身份重写未完成', prob: 70, impact: 78, color: '#94a3b8' },
];

function scatterOption() {
  return {
    grid: { left: 52, right: 24, top: 24, bottom: 48 },
    tooltip: {
      trigger: 'item',
      formatter: (p) => {
        const r = p.data;
        return `${r.name}<br/>发生概率 ${r.value[0]} · 影响烈度 ${r.value[1]}<br/>暴露分 ${(r.value[0] * r.value[1] / 100).toFixed(0)}`;
      },
    },
    xAxis: {
      type: 'value', min: 0, max: 100, name: '发生概率 →', nameGap: 26,
      nameTextStyle: { color: AX.text, fontSize: 10 },
      axisLine: { lineStyle: { color: AX.line } },
      axisLabel: { color: AX.text, fontSize: 10 },
      splitLine: { lineStyle: { color: AX.split } },
    },
    yAxis: {
      type: 'value', min: 0, max: 100, name: '影响烈度 ↑', nameGap: 18,
      nameTextStyle: { color: AX.text, fontSize: 10, align: 'left' },
      axisLine: { lineStyle: { color: AX.line } },
      axisLabel: { color: AX.text, fontSize: 10 },
      splitLine: { lineStyle: { color: AX.split } },
    },
    series: [{
      type: 'scatter',
      symbolSize: (v) => 14 + (v[0] * v[1]) / 320,
      label: {
        show: true, position: 'right', formatter: (p) => p.data.name,
        color: AX.text, fontSize: 10,
      },
      labelLayout: { hideOverlap: true },
      data: RISKS.map((r) => ({
        name: r.name, value: [r.prob, r.impact],
        itemStyle: { color: r.color, borderColor: '#ffffff', borderWidth: 1, opacity: 0.92 },
      })),
      markLine: {
        silent: true, symbol: 'none',
        lineStyle: { color: 'rgba(196,30,58,0.35)', type: 'dashed' },
        label: { show: false },
        data: [{ xAxis: MID }, { yAxis: MID }],
      },
      markArea: {
        silent: true,
        itemStyle: { color: 'rgba(196,30,58,0.07)' },
        data: [[{ xAxis: MID, yAxis: MID }, { xAxis: 100, yAxis: 100 }]],
      },
    }],
  };
}

export default function SectionRisk() {
  const ranked = useMemo(
    () => [...RISKS].map((r) => ({ ...r, score: (r.prob * r.impact) / 100 })).sort((a, b) => b.score - a.score),
    []
  );
  const maxScore = ranked[0]?.score || 1;

  return (
    <Card title="⑲ 风险地图 · 概率 × 影响" className="mt-6">
      <div className="grid gap-6" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))' }}>
        <div>
          <EChart option={scatterOption()} style={{ height: 360 }} />
          <p className="text-xs mt-2" style={{ color: 'var(--text-tertiary)', lineHeight: 1.7 }}>
            右上 <span style={{ color: '#c41e3a' }}>红区</span>＝高概率 × 高影响——既容易发生又一旦发生就伤筋动骨，是必须先对冲的那一类；左下则可以观望。圈大小＝暴露分（概率 × 影响）。
          </p>
        </div>
        <div>
          <div className="text-[11px] mono mb-2" style={{ color: 'var(--text-tertiary)' }}>// Top 风险 · 按 概率 × 影响 排序</div>
          <div className="flex flex-col gap-2">
            {ranked.map((r, i) => (
              <div key={r.name} className="os-card p-3" style={{ borderLeft: `3px solid ${r.color}` }}>
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="mono text-xs" style={{ color: 'var(--text-tertiary)' }}>{String(i + 1).padStart(2, '0')}</span>
                    <span className="text-sm truncate" style={{ color: 'var(--text-primary)' }}>{r.name}</span>
                  </div>
                  <span className="mono text-xs flex-shrink-0" style={{ color: r.color }}>{r.score.toFixed(0)}</span>
                </div>
                <div className="mt-1.5 h-1 rounded-full overflow-hidden" style={{ background: 'rgba(148,163,184,0.12)' }}>
                  <div className="h-full rounded-full" style={{ width: `${(r.score / maxScore) * 100}%`, background: r.color }} />
                </div>
                <div className="mt-1 text-[11px] mono" style={{ color: 'var(--text-tertiary)' }}>
                  概率 {r.prob} · 影响 {r.impact}
                </div>
              </div>
            ))}
          </div>
          <p className="text-xs mt-3" style={{ color: 'var(--text-tertiary)', lineHeight: 1.7 }}>
            策略：<span style={{ color: '#c41e3a' }}>右上区先对冲</span>——现金流断裂与身份重写未完成排在最前，前者靠把「现金流安全边际」做厚、后者靠把次优约束变成独特凭证来逐步消化。
          </p>
        </div>
      </div>
      <p className="text-[11px] mt-4 pt-3" style={{ color: 'var(--text-tertiary)', lineHeight: 1.6, borderTop: '1px solid var(--border-subtle)' }}>
        私享自画像 · 本人自述 · 风险概率与影响为自评示意标定 · 非预测、非承诺。
      </p>
    </Card>
  );
}
